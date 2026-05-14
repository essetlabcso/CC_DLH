"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { parseDiagnosisRecordForm } from "@/lib/admin/diagnosis-record-form";
import { getDiagnosisRecordApprovalReadiness } from "@/lib/admin/diagnosis-record-approval";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

export async function createDiagnosisRecordDraftAction(formData: FormData) {
  const identity = await requireWorkspaceIdentity(
    "/admin/diagnosis-records/new",
  );
  const parsed = parseDiagnosisRecordForm(formData);
  const datasetId = formData.get("datasetId");
  const errorPath =
    typeof datasetId === "string" && datasetId
      ? `/admin/diagnosis-records/new?datasetId=${encodeURIComponent(datasetId)}`
      : "/admin/diagnosis-records/new";

  if (!parsed.ok) {
    redirect(`${errorPath}${errorPath.includes("?") ? "&" : "?"}error=${encodeURIComponent(parsed.message)}`);
  }

  const dataset = await prisma.diagnosisDataset.findUnique({
    where: {
      id: parsed.data.datasetId,
    },
    select: {
      approvalStatus: true,
      archivedAt: true,
      id: true,
    },
  });

  if (!dataset) {
    notFound();
  }

  if (!canCreateRecordUnderDataset(dataset)) {
    redirect(
      `/admin/diagnosis-datasets/${dataset.id}?error=${encodeURIComponent(
        "Diagnosis records can only be created under draft evidence source packages that are not archived.",
      )}`,
    );
  }

  const existing = await prisma.diagnosisRecord.findUnique({
    where: {
      datasetId_diagnosisCode: {
        datasetId: parsed.data.datasetId,
        diagnosisCode: parsed.data.diagnosisCode,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    redirect(
      `${errorPath}${errorPath.includes("?") ? "&" : "?"}error=${encodeURIComponent(
        "A diagnosis record with this code already exists in this dataset.",
      )}`,
    );
  }

  const record = await prisma.$transaction(async (tx) => {
    const created = await tx.diagnosisRecord.create({
      data: {
        ...parsed.data,
        approvalStatus: "DRAFT",
        courseCreationStatus: "NOT_SELECTED",
        createdById: identity.user.id,
        isActive: true,
        isLocked: false,
        updatedById: identity.user.id,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_CREATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(created)),
        entityId: created.id,
        entityType: "DiagnosisRecord",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return created;
  });

  revalidateRecordPaths(record.datasetId, record.id);
  redirect(`/admin/diagnosis-records/${record.id}?created=1`);
}

export async function updateDiagnosisRecordDraftAction(
  recordId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-records/${recordId}/edit`,
  );
  const parsed = parseDiagnosisRecordForm(formData, {
    requireUpdateReason: true,
  });

  if (!parsed.ok) {
    redirect(
      `/admin/diagnosis-records/${recordId}/edit?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const current = await prisma.diagnosisRecord.findUnique({
    include: {
      dataset: {
        select: {
          approvalStatus: true,
          archivedAt: true,
          id: true,
        },
      },
      _count: {
        select: {
          selectedCourseSetups: true,
        },
      },
    },
    where: {
      id: recordId,
    },
  });

  if (!current) {
    notFound();
  }

  if (!canEditRecord(current)) {
    redirect(
      `/admin/diagnosis-records/${recordId}?error=${encodeURIComponent(
        "Only draft, unreleased, active diagnosis records under draft evidence source packages can be edited before Course Setup uses them.",
      )}`,
    );
  }

  if (parsed.data.datasetId !== current.datasetId) {
    redirect(
      `/admin/diagnosis-records/${recordId}/edit?error=${encodeURIComponent(
        "This draft record must stay linked to its current evidence source package.",
      )}`,
    );
  }

  if (parsed.data.diagnosisCode !== current.diagnosisCode) {
    const existing = await prisma.diagnosisRecord.findUnique({
      where: {
        datasetId_diagnosisCode: {
          datasetId: current.datasetId,
          diagnosisCode: parsed.data.diagnosisCode,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing && existing.id !== recordId) {
      redirect(
        `/admin/diagnosis-records/${recordId}/edit?error=${encodeURIComponent(
          "A diagnosis record with this code already exists in this dataset.",
        )}`,
      );
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisRecord.update({
      data: {
        ...parsed.data,
        changeReason: parsed.reason,
        datasetId: current.datasetId,
        updatedById: identity.user.id,
      },
      where: {
        id: recordId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_UPDATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(saved)),
        beforeJson: JSON.stringify(toAuditRecord(current)),
        entityId: saved.id,
        entityType: "DiagnosisRecord",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return saved;
  });

  revalidateRecordPaths(updated.datasetId, updated.id);
  redirect(`/admin/diagnosis-records/${updated.id}?updated=1`);
}

export async function approveDiagnosisRecordAction(
  recordId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-records/${recordId}`,
  );
  const reason = parseActionReason(formData, "approvalReason");

  if (!reason) {
    redirectWithRecordError(
      recordId,
      "Add an approval reason before approving this diagnosis record.",
    );
  }

  const current = await getRecordForGovernanceAction(recordId);

  if (!current) {
    notFound();
  }

  if (current.isLocked || current._count.selectedCourseSetups > 0) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record is already released or used by Course Setup, so it cannot be approved again.",
    );
  }

  if (isStatus(current.approvalStatus, "APPROVED")) {
    redirect(`/admin/diagnosis-records/${recordId}`);
  }

  const readiness = getDiagnosisRecordApprovalReadiness(
    toReadinessInput(current),
  );

  if (!readiness.approvalReady) {
    redirectWithRecordError(
      recordId,
      readiness.approvalBlockingIssues[0] ??
        "Resolve approval readiness issues before approving this diagnosis record.",
    );
  }

  const approved = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisRecord.update({
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedById: identity.user.id,
        changeReason: reason,
        updatedById: identity.user.id,
      },
      where: {
        id: recordId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_APPROVED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(saved)),
        beforeJson: JSON.stringify(toAuditRecord(current)),
        entityId: saved.id,
        entityType: "DiagnosisRecord",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateRecordPaths(approved.datasetId, approved.id);
  redirect(`/admin/diagnosis-records/${approved.id}?approved=1`);
}

export async function lockDiagnosisRecordForCourseSetupAction(
  recordId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-records/${recordId}`,
  );
  const reason = parseActionReason(formData, "lockReason");

  if (!reason) {
    redirectWithRecordError(
      recordId,
      "Add a release reason before making this diagnosis record available to Course Creators.",
    );
  }

  const current = await getRecordForGovernanceAction(recordId);

  if (!current) {
    notFound();
  }

  if (current.isLocked) {
    redirect(`/admin/diagnosis-records/${recordId}`);
  }

  if (current._count.selectedCourseSetups > 0) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record is already used by Course Setup and cannot be released again.",
    );
  }

  const readiness = getDiagnosisRecordApprovalReadiness(
    toReadinessInput(current),
  );

  if (!readiness.lockReady) {
    redirectWithRecordError(
      recordId,
      readiness.lockBlockingIssues[0] ??
        "Resolve release readiness issues before making this record available to Course Creators.",
    );
  }

  const locked = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisRecord.update({
      data: {
        changeReason: reason,
        courseCreationStatus: "AVAILABLE_FOR_COURSE_SETUP",
        isLocked: true,
        lockedAt: new Date(),
        lockedById: identity.user.id,
        updatedById: identity.user.id,
      },
      where: {
        id: recordId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_LOCKED_FOR_COURSE_SETUP",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(saved)),
        beforeJson: JSON.stringify(toAuditRecord(current)),
        entityId: saved.id,
        entityType: "DiagnosisRecord",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateRecordPaths(locked.datasetId, locked.id);
  revalidatePath("/studio/courses/[courseId]/setup", "page");
  redirect(`/admin/diagnosis-records/${locked.id}?locked=1`);
}

export async function returnDiagnosisRecordToDraftAction(
  recordId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-records/${recordId}`,
  );
  const reason = parseActionReason(formData, "returnReason");

  if (!reason) {
    redirectWithRecordError(
      recordId,
      "Add a reason before returning this diagnosis record to draft.",
    );
  }

  const current = await getRecordForGovernanceAction(recordId);

  if (!current) {
    notFound();
  }

  if (!current.isActive || current.archivedAt) {
    redirectWithRecordError(
      recordId,
      "Archived or inactive diagnosis records cannot be returned to draft.",
    );
  }

  if (current.isLocked) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record has already been released to Course Creators. Use 'Reopen released record' instead.",
    );
  }

  if (current._count.selectedCourseSetups > 0) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record is already selected by a Course Setup and cannot be returned to draft.",
    );
  }

  if (!isStatus(current.approvalStatus, "APPROVED")) {
    redirectWithRecordError(
      recordId,
      "Only approved diagnosis records can be returned to draft.",
    );
  }

  const returned = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisRecord.update({
      data: {
        approvalStatus: "DRAFT",
        approvedAt: null,
        approvedById: null,
        changeReason: reason,
        updatedById: identity.user.id,
      },
      where: {
        id: recordId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_RETURNED_TO_DRAFT",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(saved)),
        beforeJson: JSON.stringify(toAuditRecord(current)),
        entityId: saved.id,
        entityType: "DiagnosisRecord",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateRecordPaths(returned.datasetId, returned.id);
  redirect(`/admin/diagnosis-records/${returned.id}?returned=1`);
}

export async function reopenDiagnosisRecordAction(
  recordId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-records/${recordId}`,
  );
  const reason = parseActionReason(formData, "reopenReason");

  if (!reason) {
    redirectWithRecordError(
      recordId,
      "Add a reason before reopening this diagnosis record.",
    );
  }

  const current = await getRecordForGovernanceAction(recordId);

  if (!current) {
    notFound();
  }

  if (!current.isActive || current.archivedAt) {
    redirectWithRecordError(
      recordId,
      "Archived or inactive diagnosis records cannot be reopened.",
    );
  }

  if (!current.isLocked) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record has not been released. Use 'Return to draft' instead.",
    );
  }

  if (current._count.selectedCourseSetups > 0) {
    redirectWithRecordError(
      recordId,
      "This diagnosis record is already selected by a Course Setup. It cannot be reopened because it is anchoring active course design work.",
    );
  }

  const reopened = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisRecord.update({
      data: {
        approvalStatus: "DRAFT",
        approvedAt: null,
        approvedById: null,
        changeReason: reason,
        courseCreationStatus: "NOT_SELECTED",
        isLocked: false,
        lockedAt: null,
        lockedById: null,
        updatedById: identity.user.id,
      },
      where: {
        id: recordId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_RECORD_REOPENED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditRecord(saved)),
        beforeJson: JSON.stringify(toAuditRecord(current)),
        entityId: saved.id,
        entityType: "DiagnosisRecord",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateRecordPaths(reopened.datasetId, reopened.id);
  revalidatePath("/studio/courses/[courseId]/setup", "page");
  redirect(`/admin/diagnosis-records/${reopened.id}?reopened=1`);
}

function revalidateRecordPaths(datasetId: string, recordId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin/diagnosis-datasets");
  revalidatePath(`/admin/diagnosis-datasets/${datasetId}`);
  revalidatePath("/admin/diagnosis-records");
  revalidatePath(`/admin/diagnosis-records/${recordId}`);
  revalidatePath(`/admin/diagnosis-records/${recordId}/edit`);
}

function canCreateRecordUnderDataset(dataset: {
  approvalStatus: string;
  archivedAt: Date | null;
}) {
  return dataset.approvalStatus.toLowerCase() === "draft" && !dataset.archivedAt;
}

function canEditRecord(record: {
  approvalStatus: string;
  archivedAt: Date | null;
  dataset: {
    approvalStatus: string;
    archivedAt: Date | null;
  };
  isActive: boolean;
  isLocked: boolean;
  _count: {
    selectedCourseSetups: number;
  };
}) {
  return (
    canCreateRecordUnderDataset(record.dataset) &&
    record.approvalStatus.toLowerCase() === "draft" &&
    !record.isLocked &&
    record.isActive &&
    !record.archivedAt &&
    record._count.selectedCourseSetups === 0
  );
}

function parseActionReason(formData: FormData, fieldName: string) {
  const reason = formData.get(fieldName);

  if (typeof reason !== "string") {
    return "";
  }

  return reason.trim();
}

function redirectWithRecordError(recordId: string, message: string): never {
  redirect(
    `/admin/diagnosis-records/${recordId}?error=${encodeURIComponent(message)}`,
  );
}

function getRecordForGovernanceAction(recordId: string) {
  return prisma.diagnosisRecord.findUnique({
    include: {
      dataset: {
        select: {
          approvalStatus: true,
          archivedAt: true,
        },
      },
      _count: {
        select: {
          selectedCourseSetups: true,
        },
      },
    },
    where: {
      id: recordId,
    },
  });
}

function toReadinessInput(record: NonNullable<
  Awaited<ReturnType<typeof getRecordForGovernanceAction>>
>) {
  return {
    capacityGapStatement: record.capacityGapStatement,
    capacityPracticeArea: record.capacityPracticeArea,
    coreCapacityArea: record.coreCapacityArea,
    courseFitDecision: record.courseFitDecision,
    currentBaseline: record.currentBaseline,
    dataSensitivityLevel: record.dataSensitivityLevel,
    datasetApprovalStatus: record.dataset.approvalStatus,
    datasetArchivedAt: record.dataset.archivedAt,
    desiredPractice: record.desiredPractice,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    evidenceSource: record.evidenceSource,
    evaluationAnchor: record.evaluationAnchor,
    isActive: record.isActive,
    isLocked: record.isLocked,
    ksmeRoute: record.ksmeRoute,
    monitoringSignal: record.monitoringSignal,
    noHarmNote: record.noHarmNote,
    recordApprovalStatus: record.approvalStatus,
    recordArchivedAt: record.archivedAt,
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
    targetAudience: record.targetAudience,
  };
}

function isStatus(value: string, status: string) {
  return value.trim().toLowerCase() === status.trim().toLowerCase();
}

function toAuditRecord(record: {
  approvedAt?: Date | null;
  capacityGapStatement: string;
  capacityPracticeArea: string;
  coreCapacityArea: string;
  courseFitDecision: string;
  courseCreationStatus?: string;
  currentBaseline: string;
  dataSensitivityLevel: string;
  datasetId: string;
  desiredPractice: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  evidenceSource: string;
  evaluationAnchor: string;
  id: string;
  isActive: boolean;
  isLocked: boolean;
  ksmeRoute: string;
  lockedAt?: Date | null;
  noHarmNote: string;
  region: string;
  safeguardingRiskLevel: string;
  separableKnowledgeSkillComponent: string;
  targetAudience: string;
  visibilityScope: string;
  approvalStatus: string;
}) {
  return {
    approvalStatus: record.approvalStatus,
    approvedAt: record.approvedAt?.toISOString() ?? null,
    capacityGapStatement: record.capacityGapStatement,
    capacityPracticeArea: record.capacityPracticeArea,
    coreCapacityArea: record.coreCapacityArea,
    courseFitDecision: record.courseFitDecision,
    courseCreationStatus: record.courseCreationStatus,
    currentBaseline: record.currentBaseline,
    dataSensitivityLevel: record.dataSensitivityLevel,
    datasetId: record.datasetId,
    desiredPractice: record.desiredPractice,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    evidenceSource: record.evidenceSource,
    evaluationAnchor: record.evaluationAnchor,
    id: record.id,
    isActive: record.isActive,
    isLocked: record.isLocked,
    ksmeRoute: record.ksmeRoute,
    lockedAt: record.lockedAt?.toISOString() ?? null,
    noHarmNote: record.noHarmNote,
    region: record.region,
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
    targetAudience: record.targetAudience,
    visibilityScope: record.visibilityScope,
  };
}

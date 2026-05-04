"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { parseDiagnosisRecordForm } from "@/lib/admin/diagnosis-record-form";
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
        "Diagnosis records can only be created under draft datasets that are not archived.",
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
        "Only draft, unlocked, active diagnosis records under draft datasets can be edited before Course Setup uses them.",
      )}`,
    );
  }

  if (parsed.data.datasetId !== current.datasetId) {
    redirect(
      `/admin/diagnosis-records/${recordId}/edit?error=${encodeURIComponent(
        "This draft record must stay linked to its current diagnosis dataset.",
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

function toAuditRecord(record: {
  capacityGapStatement: string;
  capacityPracticeArea: string;
  coreCapacityArea: string;
  courseFitDecision: string;
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
    capacityGapStatement: record.capacityGapStatement,
    capacityPracticeArea: record.capacityPracticeArea,
    coreCapacityArea: record.coreCapacityArea,
    courseFitDecision: record.courseFitDecision,
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
    noHarmNote: record.noHarmNote,
    region: record.region,
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
    targetAudience: record.targetAudience,
    visibilityScope: record.visibilityScope,
  };
}

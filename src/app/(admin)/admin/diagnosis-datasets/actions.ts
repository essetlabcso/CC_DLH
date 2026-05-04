"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { parseDiagnosisDatasetForm } from "@/lib/admin/diagnosis-dataset-form";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

export async function createDiagnosisDatasetDraftAction(formData: FormData) {
  const identity = await requireWorkspaceIdentity("/admin/diagnosis-datasets/new");
  const parsed = parseDiagnosisDatasetForm(formData);

  if (!parsed.ok) {
    redirect(
      `/admin/diagnosis-datasets/new?error=${encodeURIComponent(parsed.message)}`,
    );
  }

  const existing = await prisma.diagnosisDataset.findUnique({
    where: {
      datasetCode: parsed.data.datasetCode,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    redirect(
      `/admin/diagnosis-datasets/new?error=${encodeURIComponent(
        "A diagnosis dataset with this code already exists.",
      )}`,
    );
  }

  const dataset = await prisma.$transaction(async (tx) => {
    const created = await tx.diagnosisDataset.create({
      data: {
        ...parsed.data,
        approvalStatus: "DRAFT",
        createdById: identity.user.id,
        updatedById: identity.user.id,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_DATASET_CREATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditDataset(created)),
        entityId: created.id,
        entityType: "DiagnosisDataset",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return created;
  });

  revalidateDatasetPaths(dataset.id);
  redirect(`/admin/diagnosis-datasets/${dataset.id}?created=1`);
}

export async function updateDiagnosisDatasetDraftAction(
  datasetId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-datasets/${datasetId}/edit`,
  );
  const parsed = parseDiagnosisDatasetForm(formData, {
    requireUpdateReason: true,
  });

  if (!parsed.ok) {
    redirect(
      `/admin/diagnosis-datasets/${datasetId}/edit?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const current = await prisma.diagnosisDataset.findUnique({
    include: {
      _count: {
        select: {
          records: true,
          selectedCourseSetups: true,
        },
      },
    },
    where: {
      id: datasetId,
    },
  });

  if (!current) {
    notFound();
  }

  if (
    current.approvalStatus.toLowerCase() !== "draft" ||
    current.archivedAt ||
    current._count.selectedCourseSetups > 0
  ) {
    redirect(
      `/admin/diagnosis-datasets/${datasetId}?error=${encodeURIComponent(
        "Only draft diagnosis datasets that are not archived or used by Course Setup can be edited.",
      )}`,
    );
  }

  const canEditDatasetCode = current._count.records === 0;
  const datasetCode = canEditDatasetCode
    ? parsed.data.datasetCode
    : current.datasetCode;

  if (datasetCode !== current.datasetCode) {
    const existing = await prisma.diagnosisDataset.findUnique({
      where: {
        datasetCode,
      },
      select: {
        id: true,
      },
    });

    if (existing && existing.id !== datasetId) {
      redirect(
        `/admin/diagnosis-datasets/${datasetId}/edit?error=${encodeURIComponent(
          "A diagnosis dataset with this code already exists.",
        )}`,
      );
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisDataset.update({
      data: {
        ...parsed.data,
        datasetCode,
        updatedById: identity.user.id,
      },
      where: {
        id: datasetId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_DATASET_UPDATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditDataset(saved)),
        beforeJson: JSON.stringify(toAuditDataset(current)),
        entityId: saved.id,
        entityType: "DiagnosisDataset",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return saved;
  });

  revalidateDatasetPaths(updated.id);
  redirect(`/admin/diagnosis-datasets/${updated.id}?updated=1`);
}

export async function approveDiagnosisDatasetAction(
  datasetId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-datasets/${datasetId}`,
  );
  const reason = parseActionReason(formData, "approvalReason");

  if (!reason) {
    redirectWithDatasetError(
      datasetId,
      "Add an approval reason before approving this diagnosis dataset.",
    );
  }

  const current = await prisma.diagnosisDataset.findUnique({
    include: {
      _count: {
        select: {
          selectedCourseSetups: true,
        },
      },
    },
    where: {
      id: datasetId,
    },
  });

  if (!current) {
    notFound();
  }

  if (current.archivedAt) {
    redirectWithDatasetError(
      datasetId,
      "Archived diagnosis datasets cannot be approved.",
    );
  }

  if (isStatus(current.approvalStatus, "APPROVED")) {
    redirect(`/admin/diagnosis-datasets/${datasetId}`);
  }

  if (!current.datasetCode.trim() || !current.datasetTitle.trim()) {
    redirectWithDatasetError(
      datasetId,
      "Add a dataset code and title before approval.",
    );
  }

  const approved = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisDataset.update({
      data: {
        approvalStatus: "APPROVED",
        approvedAt: new Date(),
        approvedById: identity.user.id,
        updatedById: identity.user.id,
      },
      where: {
        id: datasetId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_DATASET_APPROVED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditDataset(saved)),
        beforeJson: JSON.stringify(toAuditDataset(current)),
        entityId: saved.id,
        entityType: "DiagnosisDataset",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateDatasetPaths(approved.id);
  redirect(`/admin/diagnosis-datasets/${approved.id}?approved=1`);
}

export async function archiveDiagnosisDatasetAction(
  datasetId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/diagnosis-datasets/${datasetId}`,
  );
  const reason = parseActionReason(formData, "archiveReason");

  if (!reason) {
    redirectWithDatasetError(
      datasetId,
      "Add an archive reason before archiving this diagnosis dataset.",
    );
  }

  const current = await prisma.diagnosisDataset.findUnique({
    include: {
      _count: {
        select: {
          selectedCourseSetups: true,
        },
      },
    },
    where: {
      id: datasetId,
    },
  });

  if (!current) {
    notFound();
  }

  if (current.archivedAt || isStatus(current.approvalStatus, "ARCHIVED")) {
    redirect(`/admin/diagnosis-datasets/${datasetId}`);
  }

  if (current._count.selectedCourseSetups > 0) {
    redirectWithDatasetError(
      datasetId,
      "This diagnosis dataset is currently selected by Course Setup and cannot be archived in this phase.",
    );
  }

  const archived = await prisma.$transaction(async (tx) => {
    const saved = await tx.diagnosisDataset.update({
      data: {
        approvalStatus: "ARCHIVED",
        archivedAt: new Date(),
        updatedById: identity.user.id,
      },
      where: {
        id: datasetId,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "DIAGNOSIS_DATASET_ARCHIVED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditDataset(saved)),
        beforeJson: JSON.stringify(toAuditDataset(current)),
        entityId: saved.id,
        entityType: "DiagnosisDataset",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return saved;
  });

  revalidateDatasetPaths(archived.id);
  revalidatePath("/studio/courses/[courseId]/setup", "page");
  redirect(`/admin/diagnosis-datasets/${archived.id}?archived=1`);
}

function revalidateDatasetPaths(datasetId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin/diagnosis-datasets");
  revalidatePath(`/admin/diagnosis-datasets/${datasetId}`);
  revalidatePath(`/admin/diagnosis-datasets/${datasetId}/edit`);
}

function parseActionReason(formData: FormData, fieldName: string) {
  const reason = formData.get(fieldName);

  if (typeof reason !== "string") {
    return "";
  }

  return reason.trim();
}

function redirectWithDatasetError(datasetId: string, message: string): never {
  redirect(
    `/admin/diagnosis-datasets/${datasetId}?error=${encodeURIComponent(message)}`,
  );
}

function isStatus(value: string, status: string) {
  return value.trim().toLowerCase() === status.trim().toLowerCase();
}

function toAuditDataset(dataset: {
  archivedAt: Date | null;
  assessmentPeriodEnd: Date | null;
  assessmentPeriodStart: Date | null;
  assessmentPurpose: string;
  dataCollectionMethods: string;
  datasetCode: string;
  datasetTitle: string;
  id: string;
  notes: string;
  organizationGroup: string;
  programOrProject: string;
  regionsCovered: string;
  visibilityScope: string;
  approvalStatus: string;
}) {
  return {
    archivedAt: dataset.archivedAt?.toISOString() ?? null,
    assessmentPeriodEnd:
      dataset.assessmentPeriodEnd?.toISOString() ?? null,
    assessmentPeriodStart:
      dataset.assessmentPeriodStart?.toISOString() ?? null,
    assessmentPurpose: dataset.assessmentPurpose,
    dataCollectionMethods: dataset.dataCollectionMethods,
    datasetCode: dataset.datasetCode,
    datasetTitle: dataset.datasetTitle,
    id: dataset.id,
    notes: dataset.notes,
    organizationGroup: dataset.organizationGroup,
    programOrProject: dataset.programOrProject,
    regionsCovered: dataset.regionsCovered,
    visibilityScope: dataset.visibilityScope,
    approvalStatus: dataset.approvalStatus,
  };
}

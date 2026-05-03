import type { PrismaClient } from "@prisma/client";

import { mapDiagnosisRecordToCourseSetupOption } from "./diagnosis-selection";

export async function getCourseSetupDiagnosisOptions(prisma: PrismaClient) {
  const records = await prisma.diagnosisRecord.findMany({
    where: {
      approvalStatus: "APPROVED",
      archivedAt: null,
      isActive: true,
      isLocked: true,
      dataset: {
        approvalStatus: "APPROVED",
        archivedAt: null,
      },
    },
    include: {
      dataset: true,
    },
    orderBy: [
      { courseFitDecision: "asc" },
      { priorityRank: "asc" },
      { diagnosisTitle: "asc" },
    ],
  });

  return records.map(mapDiagnosisRecordToCourseSetupOption);
}

export async function getSelectableDiagnosisRecordById(
  prisma: PrismaClient,
  diagnosisRecordId: string,
) {
  if (!diagnosisRecordId) {
    return null;
  }

  const record = await prisma.diagnosisRecord.findFirst({
    where: {
      id: diagnosisRecordId,
      approvalStatus: "APPROVED",
      archivedAt: null,
      isActive: true,
      isLocked: true,
      dataset: {
        approvalStatus: "APPROVED",
        archivedAt: null,
      },
    },
    include: {
      dataset: true,
    },
  });

  if (!record) {
    return null;
  }

  const option = mapDiagnosisRecordToCourseSetupOption(record);

  return option.eligibility.selectable ? record : null;
}

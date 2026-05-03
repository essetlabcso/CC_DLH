import { prisma } from "@/lib/db/client";

export type AdminDashboardCounts = {
  lookupCategories: number;
  lookupValues: number;
  fieldMetadata: number;
  diagnosisDatasets: number;
  diagnosisRecords: number;
  auditLogs: number;
};

export type AdminReferenceCategorySummary = {
  categoryKey: string;
  categoryName: string;
  workflowPhase: string;
  valueCount: number;
  isSystemCategory: boolean;
  isActive: boolean;
};

export type AdminFieldMetadataSummary = {
  workflowPhase: string;
  fieldCount: number;
  sectionCount: number;
  dashboardFieldCount: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  const [
    lookupCategories,
    lookupValues,
    fieldMetadata,
    diagnosisDatasets,
    diagnosisRecords,
    auditLogs,
  ] = await Promise.all([
    prisma.adminLookupCategory.count(),
    prisma.adminLookupValue.count(),
    prisma.adminFieldMetadata.count(),
    prisma.diagnosisDataset.count(),
    prisma.diagnosisRecord.count(),
    prisma.adminAuditLog.count(),
  ]);

  return {
    lookupCategories,
    lookupValues,
    fieldMetadata,
    diagnosisDatasets,
    diagnosisRecords,
    auditLogs,
  };
}

export async function getAdminReferenceCategorySummaries(): Promise<
  AdminReferenceCategorySummary[]
> {
  const categories = await prisma.adminLookupCategory.findMany({
    include: {
      _count: {
        select: {
          values: true,
        },
      },
    },
    orderBy: [{ workflowPhase: "asc" }, { categoryName: "asc" }],
  });

  return categories.map((category) => ({
    categoryKey: category.categoryKey,
    categoryName: category.categoryName,
    workflowPhase: category.workflowPhase,
    valueCount: category._count.values,
    isSystemCategory: category.isSystemCategory,
    isActive: category.isActive,
  }));
}

export async function getAdminFieldMetadataSummaries(): Promise<
  AdminFieldMetadataSummary[]
> {
  const fields = await prisma.adminFieldMetadata.findMany({
    select: {
      workflowPhase: true,
      formSection: true,
      visibleInDashboard: true,
    },
    orderBy: [{ workflowPhase: "asc" }, { displayOrder: "asc" }],
  });

  const phaseMap = new Map<
    string,
    { fieldCount: number; sections: Set<string>; dashboardFieldCount: number }
  >();

  for (const field of fields) {
    const current =
      phaseMap.get(field.workflowPhase) ??
      { fieldCount: 0, sections: new Set<string>(), dashboardFieldCount: 0 };

    current.fieldCount += 1;
    current.sections.add(field.formSection);
    if (field.visibleInDashboard) {
      current.dashboardFieldCount += 1;
    }

    phaseMap.set(field.workflowPhase, current);
  }

  return Array.from(phaseMap.entries()).map(([workflowPhase, summary]) => ({
    workflowPhase,
    fieldCount: summary.fieldCount,
    sectionCount: summary.sections.size,
    dashboardFieldCount: summary.dashboardFieldCount,
  }));
}

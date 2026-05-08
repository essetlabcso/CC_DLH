import { prisma } from "@/lib/db/client";

export type AdminReferenceValue = {
  id: string;
  valueKey: string;
  displayLabel: string;
  description: string;
  helpText: string;
  displayOrder: number;
  isActive: boolean;
  isSystemLocked: boolean;
  visibleToAdmin: boolean;
  visibleToCreator: boolean;
  visibleToReviewer: boolean;
  visibleToParticipant: boolean;
  visibleInMonitoring: boolean;
  parentLabel: string | null;
  canEdit: boolean;
  isProtectedWorkflowValue: boolean;
  isUsed: boolean;
  isUsageTracked: boolean;
  usageCount: number;
  usageSummary: string;
};

export type AdminReferenceCategory = {
  id: string;
  categoryKey: string;
  categoryName: string;
  workflowPhase: string;
  description: string;
  isSystemCategory: boolean;
  isActive: boolean;
  values: AdminReferenceValue[];
  canEdit: boolean;
  canEditCategoryKey: boolean;
  canAddValue: boolean;
  isProtectedWorkflowCategory: boolean;
};

export type AdminReferenceDataBrowser = {
  categories: AdminReferenceCategory[];
  totals: {
    categories: number;
    values: number;
    systemLockedValues: number;
    activeValues: number;
    usedValues: number;
    usageTrackedValues: number;
  };
  selectedCategory: AdminReferenceCategory | null;
};

type AdminReferenceDataBrowserOptions = {
  categoryKey?: string;
  search?: string;
};

export async function getAdminReferenceDataBrowser({
  categoryKey,
  search,
}: AdminReferenceDataBrowserOptions = {}): Promise<AdminReferenceDataBrowser> {
  const normalizedSearch = search?.trim().toLowerCase() ?? "";
  const categories = await prisma.adminLookupCategory.findMany({
    include: {
      values: {
        include: {
          parentValue: {
            select: {
              displayLabel: true,
            },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { displayLabel: "asc" }],
      },
    },
    orderBy: [{ workflowPhase: "asc" }, { categoryName: "asc" }],
  });

  const mappedCategories = await Promise.all(
    categories.map(async (category) => {
      const isProtectedWorkflowCategory = isProtectedReferenceCategory(
        category.categoryKey,
      );
      const values = await Promise.all(
        category.values.map(async (value) => {
          const usage = await getReferenceValueUsage(category.categoryKey, {
            displayLabel: value.displayLabel,
            valueKey: value.valueKey,
          });

          return {
            id: value.id,
            valueKey: value.valueKey,
            displayLabel: value.displayLabel,
            description: value.description,
            helpText: value.helpText,
            displayOrder: value.displayOrder,
            isActive: value.isActive,
            isSystemLocked: value.isSystemLocked,
            visibleToAdmin: value.visibleToAdmin,
            visibleToCreator: value.visibleToCreator,
            visibleToReviewer: value.visibleToReviewer,
            visibleToParticipant: value.visibleToParticipant,
            visibleInMonitoring: value.visibleInMonitoring,
            parentLabel: value.parentValue?.displayLabel ?? null,
            canEdit: !value.isSystemLocked,
            isProtectedWorkflowValue: isProtectedWorkflowCategory,
            ...usage,
          };
        }),
      );

      return {
        id: category.id,
        categoryKey: category.categoryKey,
        categoryName: category.categoryName,
        workflowPhase: category.workflowPhase,
        description: category.description,
        isSystemCategory: category.isSystemCategory,
        isActive: category.isActive,
        values,
        canEdit: !category.isSystemCategory,
        canEditCategoryKey:
          !category.isSystemCategory && category.values.length === 0,
        canAddValue: category.isActive,
        isProtectedWorkflowCategory,
      };
    }),
  );

  const totals = {
    categories: mappedCategories.length,
    values: mappedCategories.reduce(
      (total, category) => total + category.values.length,
      0,
    ),
    systemLockedValues: mappedCategories.reduce(
      (total, category) =>
        total + category.values.filter((value) => value.isSystemLocked).length,
      0,
    ),
    activeValues: mappedCategories.reduce(
      (total, category) =>
        total + category.values.filter((value) => value.isActive).length,
      0,
    ),
    usedValues: mappedCategories.reduce(
      (total, category) =>
        total + category.values.filter((value) => value.isUsed).length,
      0,
    ),
    usageTrackedValues: mappedCategories.reduce(
      (total, category) =>
        total + category.values.filter((value) => value.isUsageTracked).length,
      0,
    ),
  };

  const filteredCategories = mappedCategories
    .map((category) => {
      const categoryMatches = matchesSearch(
        normalizedSearch,
        category.categoryName,
        category.categoryKey,
        category.workflowPhase,
        category.description,
      );
      const filteredValues = category.values.filter((value) =>
        matchesSearch(
          normalizedSearch,
          value.displayLabel,
          value.valueKey,
          value.description,
          value.helpText,
          value.parentLabel ?? "",
        ),
      );

      return {
        ...category,
        values:
          normalizedSearch && !categoryMatches ? filteredValues : category.values,
      };
    })
    .filter((category) => {
      const categoryMatches = matchesSearch(
        normalizedSearch,
        category.categoryName,
        category.categoryKey,
        category.workflowPhase,
        category.description,
      );

      return (
        (!categoryKey || category.categoryKey === categoryKey) &&
        (!normalizedSearch || categoryMatches || category.values.length > 0)
      );
    });

  return {
    categories: filteredCategories,
    totals,
    selectedCategory:
      mappedCategories.find((category) => category.categoryKey === categoryKey) ??
      null,
  };
}

export type AdminLookupCategoryFormDetail = {
  id: string;
  categoryKey: string;
  categoryName: string;
  description: string;
  workflowPhase: string;
  isActive: boolean;
  isSystemCategory: boolean;
  valueCount: number;
  canEdit: boolean;
  canEditCategoryKey: boolean;
};

export type AdminLookupValueFormDetail = {
  id: string;
  categoryId: string;
  categoryKey: string;
  categoryName: string;
  valueKey: string;
  displayLabel: string;
  description: string;
  helpText: string;
  displayOrder: number;
  parentValueId: string | null;
  isActive: boolean;
  isSystemLocked: boolean;
  visibleToAdmin: boolean;
  visibleToCreator: boolean;
  visibleToReviewer: boolean;
  visibleToParticipant: boolean;
  visibleInMonitoring: boolean;
  canEdit: boolean;
};

export type AdminLookupValueFormOptions = {
  categories: {
    id: string;
    categoryKey: string;
    categoryName: string;
  }[];
  parentValues: {
    id: string;
    displayLabel: string;
    valueKey: string;
  }[];
  selectedCategory:
    | {
        id: string;
        categoryKey: string;
        categoryName: string;
      }
    | null;
};

export async function getAdminLookupCategoryForEdit(
  categoryId: string,
): Promise<AdminLookupCategoryFormDetail | null> {
  const category = await prisma.adminLookupCategory.findUnique({
    include: {
      _count: {
        select: {
          values: true,
        },
      },
    },
    where: { id: categoryId },
  });

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    categoryKey: category.categoryKey,
    categoryName: category.categoryName,
    description: category.description,
    workflowPhase: category.workflowPhase,
    isActive: category.isActive,
    isSystemCategory: category.isSystemCategory,
    valueCount: category._count.values,
    canEdit: !category.isSystemCategory,
    canEditCategoryKey: !category.isSystemCategory && category._count.values === 0,
  };
}

export async function getAdminLookupValueForEdit(
  valueId: string,
): Promise<AdminLookupValueFormDetail | null> {
  const value = await prisma.adminLookupValue.findUnique({
    include: {
      category: {
        select: {
          categoryKey: true,
          categoryName: true,
        },
      },
    },
    where: { id: valueId },
  });

  if (!value) {
    return null;
  }

  return {
    id: value.id,
    categoryId: value.categoryId,
    categoryKey: value.category.categoryKey,
    categoryName: value.category.categoryName,
    valueKey: value.valueKey,
    displayLabel: value.displayLabel,
    description: value.description,
    helpText: value.helpText,
    displayOrder: value.displayOrder,
    parentValueId: value.parentValueId,
    isActive: value.isActive,
    isSystemLocked: value.isSystemLocked,
    visibleToAdmin: value.visibleToAdmin,
    visibleToCreator: value.visibleToCreator,
    visibleToReviewer: value.visibleToReviewer,
    visibleToParticipant: value.visibleToParticipant,
    visibleInMonitoring: value.visibleInMonitoring,
    canEdit: !value.isSystemLocked,
  };
}

export async function getAdminLookupValueFormOptions({
  categoryId,
  excludeValueId,
}: {
  categoryId?: string;
  excludeValueId?: string;
} = {}): Promise<AdminLookupValueFormOptions> {
  const categories = await prisma.adminLookupCategory.findMany({
    orderBy: [{ workflowPhase: "asc" }, { categoryName: "asc" }],
    select: {
      id: true,
      categoryKey: true,
      categoryName: true,
    },
  });
  const selectedCategory =
    categories.find((category) => category.id === categoryId) ?? null;
  const parentValues = categoryId
    ? await prisma.adminLookupValue.findMany({
        orderBy: [{ displayOrder: "asc" }, { displayLabel: "asc" }],
        select: {
          id: true,
          displayLabel: true,
          valueKey: true,
        },
        where: {
          categoryId,
          id: excludeValueId ? { not: excludeValueId } : undefined,
        },
      })
    : [];

  return {
    categories,
    parentValues,
    selectedCategory,
  };
}

function matchesSearch(search: string, ...values: string[]) {
  if (!search) {
    return true;
  }

  return values.some((value) => value.toLowerCase().includes(search));
}

type ReferenceUsageInput = {
  displayLabel: string;
  valueKey: string;
};

type ReferenceUsage = {
  isUsed: boolean;
  isUsageTracked: boolean;
  usageCount: number;
  usageSummary: string;
};

export function isProtectedReferenceCategory(categoryKey: string) {
  const normalized = categoryKey.toLowerCase();
  return [
    "badge",
    "capacity",
    "certificate",
    "course_fit",
    "ksme",
    "proof",
  ].some((token) => normalized.includes(token));
}

async function getReferenceValueUsage(
  categoryKey: string,
  value: ReferenceUsageInput,
): Promise<ReferenceUsage> {
  const tokens = getReferenceUsageTokens(value);

  if (tokens.length === 0) {
    return untrackedUsage();
  }

  switch (categoryKey) {
    case "organization_types": {
      const count = await prisma.organization.count({
        where: { organizationType: { in: tokens } },
      });
      return trackedUsage(count, "organization profile");
    }
    case "geographic_focus_areas": {
      const count = await prisma.organization.count({
        where: { geographicFocus: { in: tokens } },
      });
      return trackedUsage(count, "organization profile");
    }
    case "capacity_areas": {
      const [
        courseSetups,
        analysisHandovers,
        capacityMaps,
        proofConfigs,
        achievements,
        diagnosisRecords,
      ] = await Promise.all([
        prisma.courseSetup.count({ where: { capacityArea: { in: tokens } } }),
        prisma.courseAnalysisHandover.count({
          where: { capacityArea: { in: tokens } },
        }),
        prisma.courseCapacityMap.count({
          where: { capacityArea: { in: tokens } },
        }),
        prisma.coursePracticalProofConfig.count({
          where: { capacityArea: { in: tokens } },
        }),
        prisma.learnerVerifiedAchievement.count({
          where: { capacityArea: { in: tokens } },
        }),
        prisma.diagnosisRecord.count({
          where: { coreCapacityArea: { in: tokens } },
        }),
      ]);
      return trackedUsage(
        courseSetups +
          analysisHandovers +
          capacityMaps +
          proofConfigs +
          achievements +
          diagnosisRecords,
        "course, proof, diagnosis, or monitoring record",
      );
    }
    case "course_languages": {
      const count = await prisma.courseSetup.count({
        where: { language: { in: tokens } },
      });
      return trackedUsage(count, "course setup");
    }
    case "delivery_formats": {
      const count = await prisma.courseSetup.count({
        where: { formatAndTime: { in: tokens } },
      });
      return trackedUsage(count, "course setup");
    }
    case "participant_experience_levels": {
      const count = await prisma.courseSetup.count({
        where: { level: { in: tokens } },
      });
      return trackedUsage(count, "course setup");
    }
    case "target_audience_groups": {
      const count = await prisma.courseSetup.count({
        where: { primaryLearnerGroup: { in: tokens } },
      });
      return trackedUsage(count, "course setup");
    }
    case "course_fit_decisions": {
      const [courseDiagnoses, diagnosisRecords] = await Promise.all([
        prisma.courseDiagnosis.count({
          where: { courseFitDecision: { in: tokens } },
        }),
        prisma.diagnosisRecord.count({
          where: { courseFitDecision: { in: tokens } },
        }),
      ]);
      return trackedUsage(
        courseDiagnoses + diagnosisRecords,
        "diagnosis record",
      );
    }
    case "ksme_routes": {
      const [analysisHandovers, diagnosisRecords] = await Promise.all([
        prisma.courseAnalysisHandover.count({
          where: { ksmeRoute: { in: tokens } },
        }),
        prisma.diagnosisRecord.count({
          where: { ksmeRoute: { in: tokens } },
        }),
      ]);
      return trackedUsage(
        analysisHandovers + diagnosisRecords,
        "diagnosis or analysis record",
      );
    }
    default:
      return untrackedUsage();
  }
}

function getReferenceUsageTokens(value: ReferenceUsageInput) {
  return Array.from(
    new Set(
      [value.valueKey, value.displayLabel]
        .map((token) => token.trim())
        .filter(Boolean),
    ),
  );
}

function trackedUsage(count: number, recordLabel: string): ReferenceUsage {
  return {
    isUsed: count > 0,
    isUsageTracked: true,
    usageCount: count,
    usageSummary:
      count > 0
        ? `${count} linked ${count === 1 ? "record" : "records"} found in ${recordLabel}.`
        : `No linked ${recordLabel} records found.`,
  };
}

function untrackedUsage(): ReferenceUsage {
  return {
    isUsed: false,
    isUsageTracked: false,
    usageCount: 0,
    usageSummary: "Usage tracking is not available for this category yet.",
  };
}

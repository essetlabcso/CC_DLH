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
};

export type AdminReferenceDataBrowser = {
  categories: AdminReferenceCategory[];
  totals: {
    categories: number;
    values: number;
    systemLockedValues: number;
    activeValues: number;
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

  const mappedCategories = categories.map((category) => ({
    id: category.id,
    categoryKey: category.categoryKey,
    categoryName: category.categoryName,
    workflowPhase: category.workflowPhase,
    description: category.description,
    isSystemCategory: category.isSystemCategory,
    isActive: category.isActive,
    values: category.values.map((value) => ({
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
    })),
  }));

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

function matchesSearch(search: string, ...values: string[]) {
  if (!search) {
    return true;
  }

  return values.some((value) => value.toLowerCase().includes(search));
}

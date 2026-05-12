import type { PrismaClient } from "@prisma/client";

import { decCapacityAreas } from "./capacity-map";
import {
  courseFitDecisionLabels,
  courseFitDecisions,
  ksmeGapTypes,
} from "./diagnosis";

export type CourseSetupReferenceOption = {
  label: string;
  value: string;
};

export type CourseSetupReferenceOptions = {
  capacityAreas: CourseSetupReferenceOption[];
  courseLanguages: CourseSetupReferenceOption[];
  deliveryFormats: CourseSetupReferenceOption[];
  participantExperienceLevels: CourseSetupReferenceOption[];
  targetAudienceGroups: CourseSetupReferenceOption[];
  ksmeRoutes: CourseSetupReferenceOption[];
  courseFitDecisions: CourseSetupReferenceOption[];
};

export type CourseSetupLookupCategory = {
  categoryKey: string;
  values: {
    valueKey: string;
    displayLabel: string;
  }[];
};

const setupLookupCategories = {
  capacityAreas: "capacity_areas",
  courseLanguages: "course_languages",
  deliveryFormats: "delivery_formats",
  participantExperienceLevels: "participant_experience_levels",
  targetAudienceGroups: "target_audience_groups",
  ksmeRoutes: "ksme_routes",
  courseFitDecisions: "course_fit_decisions",
} as const;

export async function getCourseSetupReferenceOptions(
  prisma: PrismaClient,
): Promise<CourseSetupReferenceOptions> {
  const categories = await prisma.adminLookupCategory.findMany({
    include: {
      values: {
        orderBy: [{ displayOrder: "asc" }, { displayLabel: "asc" }],
        where: {
          isActive: true,
          visibleToCreator: true,
        },
      },
    },
    where: {
      categoryKey: {
        in: Object.values(setupLookupCategories),
      },
      isActive: true,
    },
  });

  // Force casting to match custom internal type, which is a subset of Prisma response
  return mapLookupCategoriesToCourseSetupOptions(
    categories as unknown as CourseSetupLookupCategory[],
  );
}

export function mapLookupCategoriesToCourseSetupOptions(
  categories: CourseSetupLookupCategory[],
): CourseSetupReferenceOptions {
  return {
    capacityAreas: getOptions(categories, setupLookupCategories.capacityAreas),
    courseLanguages: getOptions(
      categories,
      setupLookupCategories.courseLanguages,
    ),
    deliveryFormats: getOptions(categories, setupLookupCategories.deliveryFormats),
    participantExperienceLevels: getOptions(
      categories,
      setupLookupCategories.participantExperienceLevels,
    ),
    targetAudienceGroups: getOptions(
      categories,
      setupLookupCategories.targetAudienceGroups,
    ),
    ksmeRoutes: getOptions(categories, setupLookupCategories.ksmeRoutes),
    courseFitDecisions: getOptions(
      categories,
      setupLookupCategories.courseFitDecisions,
    ),
  };
}

function getOptions(
  categories: CourseSetupLookupCategory[],
  categoryKey: string,
): CourseSetupReferenceOption[] {
  const category = categories.find((item) => item.categoryKey === categoryKey);

  // Keep valueKey strategy ONLY for domains already expecting stable keys.
  // All other domains (especially capacity_areas) must use displayLabel for safe Phase 1 anchor stability.
  const useValueKey =
    categoryKey === setupLookupCategories.courseFitDecisions ||
    categoryKey === setupLookupCategories.ksmeRoutes;

  const dbOptions =
    category?.values.map((value) => ({
      label: value.displayLabel,
      value: useValueKey ? value.valueKey : value.displayLabel,
    })) ?? [];

  if (dbOptions.length > 0) {
    return dbOptions;
  }

  // Safe fallbacks if Admin lookup categories/options are missing
  switch (categoryKey) {
    case setupLookupCategories.courseFitDecisions:
      return courseFitDecisions.map((key) => ({
        label: courseFitDecisionLabels[key as keyof typeof courseFitDecisionLabels],
        value: key,
      }));
    case setupLookupCategories.ksmeRoutes:
      return ksmeGapTypes.map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key,
      }));
    case setupLookupCategories.capacityAreas:
      return decCapacityAreas.map((area) => ({
        label: area,
        value: area, // Use full label value
      }));
    default:
      return [];
  }
}

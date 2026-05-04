import type { PrismaClient } from "@prisma/client";

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
};

export type CourseSetupLookupCategory = {
  categoryKey: string;
  values: {
    displayLabel: string;
  }[];
};

const setupLookupCategories = {
  capacityAreas: "capacity_areas",
  courseLanguages: "course_languages",
  deliveryFormats: "delivery_formats",
  participantExperienceLevels: "participant_experience_levels",
  targetAudienceGroups: "target_audience_groups",
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

  return mapLookupCategoriesToCourseSetupOptions(categories);
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
  };
}

function getOptions(
  categories: CourseSetupLookupCategory[],
  categoryKey: string,
): CourseSetupReferenceOption[] {
  const category = categories.find((item) => item.categoryKey === categoryKey);

  return (
    category?.values.map((value) => ({
      label: value.displayLabel,
      value: value.displayLabel,
    })) ?? []
  );
}

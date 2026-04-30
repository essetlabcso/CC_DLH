import type { Prisma } from "@prisma/client";

import {
  filterOrganizationSafeAchievements,
  type OrganizationSafeAchievementFilters,
  type OrganizationSafeAchievementLike,
} from "@/lib/organization-achievement-summary";

export const achievementSummarySelect = {
  organizationId: true,
  userId: true,
  courseVersionId: true,
  issuedAt: true,
  capacityArea: true,
  subCapacityArea: true,
  linkedStandard: true,
  capacityIndicator: true,
  proofType: true,
  visibilityDefault: true,
  donorVisibilityEnabled: true,
  publicBadgeEnabled: true,
  badgeVisualIssued: true,
  aiIssued: true,
} satisfies Prisma.LearnerVerifiedAchievementSelect;

export type AchievementSummaryRecord =
  Prisma.LearnerVerifiedAchievementGetPayload<{
    select: typeof achievementSummarySelect;
  }>;

export function buildAchievementSummaryWhere(
  organizationId: string,
): Prisma.LearnerVerifiedAchievementWhereInput {
  return {
    organizationId,
    visibilityDefault: "PRIVATE",
    donorVisibilityEnabled: false,
    publicBadgeEnabled: false,
    badgeVisualIssued: false,
    aiIssued: false,
  };
}

export function toOrganizationSafeAchievement(
  achievement: AchievementSummaryRecord,
): OrganizationSafeAchievementLike {
  return {
    organizationId: achievement.organizationId,
    userId: achievement.userId,
    courseVersionId: achievement.courseVersionId,
    issuedAt: achievement.issuedAt,
    capacityArea: achievement.capacityArea,
    subCapacityArea: achievement.subCapacityArea,
    linkedStandard: achievement.linkedStandard,
    capacityIndicator: achievement.capacityIndicator,
    proofType: achievement.proofType,
    visibilityDefault: achievement.visibilityDefault,
    donorVisibilityEnabled: achievement.donorVisibilityEnabled,
    publicBadgeEnabled: achievement.publicBadgeEnabled,
    badgeVisualIssued: achievement.badgeVisualIssued,
    aiIssued: achievement.aiIssued,
  };
}

export function filterAchievementSummaryRecords(
  achievements: readonly OrganizationSafeAchievementLike[],
  filters: OrganizationSafeAchievementFilters,
) {
  return filterOrganizationSafeAchievements(achievements, filters);
}

export function getAchievementSummaryFilterOptions(
  achievements: readonly OrganizationSafeAchievementLike[],
) {
  return {
    capacityAreas: getUniqueSortedValues(
      achievements.map((achievement) => achievement.capacityArea),
    ),
    linkedStandards: getUniqueSortedValues(
      achievements.map((achievement) => achievement.linkedStandard),
    ),
    proofTypes: getUniqueSortedValues(
      achievements.map((achievement) => achievement.proofType),
    ),
  };
}

function getUniqueSortedValues(values: readonly string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));
}

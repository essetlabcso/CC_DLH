export type OrganizationSafeAchievementLike = {
  organizationId: string;
  userId: string;
  courseVersionId: string;
  issuedAt: Date | string;
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  proofType: string;
  visibilityDefault?: string | null;
  donorVisibilityEnabled?: boolean | null;
  publicBadgeEnabled?: boolean | null;
  badgeVisualIssued?: boolean | null;
  aiIssued?: boolean | null;
};

export type OrganizationAchievementGroup = {
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  proofType: string;
  achievementCount: number;
  learnerCount: number;
  courseVersionCount: number;
  smallGroupCaution: boolean;
};

export type OrganizationSafeAchievementSummary = {
  organizationId: string;
  totalAchievementCount: number;
  uniqueLearnerCount: number;
  courseVersionCount: number;
  latestIssuedAt: string;
  capacityAreaGroups: OrganizationAchievementGroup[];
  linkedStandardGroups: OrganizationAchievementGroup[];
  proofTypeGroups: OrganizationAchievementGroup[];
  privacySafety: {
    visibilityDefault: "PRIVATE";
    internalOnly: true;
    rawProofExcluded: true;
    learnerIdentitiesExcluded: true;
    donorVisibilityEnabled: false;
    publicBadgeEnabled: false;
    badgeVisualIssued: false;
    aiIssued: false;
    publicCredentialUrl: "";
    qrCodeEnabled: false;
    certificateSeparate: true;
    organizationalTransformationClaimed: false;
  };
};

export type OrganizationSafeAchievementFilters = {
  organizationId?: string;
  capacityArea?: string;
  linkedStandard?: string;
  proofType?: string;
};

export function buildOrganizationSafeAchievementSummary(
  achievements: readonly OrganizationSafeAchievementLike[],
): OrganizationSafeAchievementSummary {
  const safeAchievements = achievements.filter(isPrivateInternalAchievement);
  const organizationId = getSingleOrganizationId(safeAchievements);
  const uniqueLearnerIds = getUniqueValues(
    safeAchievements.map((achievement) => achievement.userId),
  );
  const courseVersionIds = getUniqueValues(
    safeAchievements.map((achievement) => achievement.courseVersionId),
  );

  return {
    organizationId,
    totalAchievementCount: safeAchievements.length,
    uniqueLearnerCount: uniqueLearnerIds.length,
    courseVersionCount: courseVersionIds.length,
    latestIssuedAt: getLatestIssuedAt(safeAchievements),
    capacityAreaGroups: buildOrganizationAchievementCapacityGroups(
      safeAchievements,
    ),
    linkedStandardGroups: buildGroupedAchievements(safeAchievements, (item) => [
      "",
      "",
      normalizeDimension(item.linkedStandard, "No linked standard"),
      "",
      "",
    ]),
    proofTypeGroups: buildGroupedAchievements(safeAchievements, (item) => [
      "",
      "",
      "",
      "",
      normalizeDimension(item.proofType, "Unspecified proof type"),
    ]),
    privacySafety: {
      visibilityDefault: "PRIVATE",
      internalOnly: true,
      rawProofExcluded: true,
      learnerIdentitiesExcluded: true,
      donorVisibilityEnabled: false,
      publicBadgeEnabled: false,
      badgeVisualIssued: false,
      aiIssued: false,
      publicCredentialUrl: "",
      qrCodeEnabled: false,
      certificateSeparate: true,
      organizationalTransformationClaimed: false,
    },
  };
}

export function buildOrganizationAchievementCapacityGroups(
  achievements: readonly OrganizationSafeAchievementLike[],
): OrganizationAchievementGroup[] {
  return buildGroupedAchievements(achievements, (item) => [
    normalizeDimension(item.capacityArea, "Unmapped capacity area"),
    normalizeDimension(item.subCapacityArea, "No sub-capacity area"),
    normalizeDimension(item.linkedStandard, "No linked standard"),
    normalizeDimension(item.capacityIndicator, "No capacity indicator"),
    normalizeDimension(item.proofType, "Unspecified proof type"),
  ]);
}

export function filterOrganizationSafeAchievements<
  TAchievement extends OrganizationSafeAchievementLike,
>(
  achievements: readonly TAchievement[],
  filters: OrganizationSafeAchievementFilters,
) {
  const organizationId = normalizeFilter(filters.organizationId);
  const capacityArea = normalizeFilter(filters.capacityArea);
  const linkedStandard = normalizeFilter(filters.linkedStandard);
  const proofType = normalizeFilter(filters.proofType);

  return achievements.filter((achievement) => {
    return (
      (!organizationId ||
        normalizeFilter(achievement.organizationId) === organizationId) &&
      (!capacityArea ||
        normalizeFilter(achievement.capacityArea) === capacityArea) &&
      (!linkedStandard ||
        normalizeFilter(achievement.linkedStandard) === linkedStandard) &&
      (!proofType || normalizeFilter(achievement.proofType) === proofType)
    );
  });
}

function buildGroupedAchievements(
  achievements: readonly OrganizationSafeAchievementLike[],
  getParts: (achievement: OrganizationSafeAchievementLike) => [
    string,
    string,
    string,
    string,
    string,
  ],
): OrganizationAchievementGroup[] {
  const groups = new Map<string, OrganizationSafeAchievementLike[]>();

  for (const achievement of achievements.filter(isPrivateInternalAchievement)) {
    const parts = getParts(achievement);
    const key = parts.join("::");
    const existing = groups.get(key) || [];

    existing.push(achievement);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .map(([key, groupAchievements]) => {
      const [capacityArea, subCapacityArea, linkedStandard, capacityIndicator, proofType] =
        key.split("::");
      const learnerCount = getUniqueValues(
        groupAchievements.map((achievement) => achievement.userId),
      ).length;
      const courseVersionCount = getUniqueValues(
        groupAchievements.map((achievement) => achievement.courseVersionId),
      ).length;

      return {
        capacityArea,
        subCapacityArea,
        linkedStandard,
        capacityIndicator,
        proofType,
        achievementCount: groupAchievements.length,
        learnerCount,
        courseVersionCount,
        smallGroupCaution: learnerCount < 3,
      };
    })
    .sort(
      (left, right) =>
        right.achievementCount - left.achievementCount ||
        left.capacityArea.localeCompare(right.capacityArea) ||
        left.linkedStandard.localeCompare(right.linkedStandard) ||
        left.proofType.localeCompare(right.proofType),
    );
}

function isPrivateInternalAchievement(
  achievement: OrganizationSafeAchievementLike,
) {
  return (
    (achievement.visibilityDefault || "PRIVATE") === "PRIVATE" &&
    achievement.donorVisibilityEnabled !== true &&
    achievement.publicBadgeEnabled !== true &&
    achievement.badgeVisualIssued !== true &&
    achievement.aiIssued !== true
  );
}

function getSingleOrganizationId(
  achievements: readonly OrganizationSafeAchievementLike[],
) {
  return getUniqueValues(
    achievements.map((achievement) => achievement.organizationId),
  )[0] || "";
}

function getLatestIssuedAt(
  achievements: readonly OrganizationSafeAchievementLike[],
) {
  const latest = achievements
    .map((achievement) => normalizeIssuedAt(achievement.issuedAt))
    .filter(Boolean)
    .sort()
    .at(-1);

  return latest || "";
}

function getUniqueValues(values: readonly string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizeDimension(value: string, fallback: string) {
  return value.trim() || fallback;
}

function normalizeFilter(value: string | null | undefined) {
  return value?.trim() || "";
}

function normalizeIssuedAt(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

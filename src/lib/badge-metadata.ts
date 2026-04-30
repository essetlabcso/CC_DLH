export const internalBadgeKind = "VERIFIED_ACHIEVEMENT" as const;
export const internalBadgeStatus = "INTERNAL_ONLY" as const;

export type InternalBadgeMetadataAchievementLike = {
  title: string;
  description: string;
  userId: string;
  organizationId: string;
  courseVersionId: string;
  practicalProofConfigId: string;
  proofSubmissionId: string;
  issuedById?: string | null;
  issuedAt: Date | string;
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  proofType: string;
};

export type InternalBadgeMetadata = {
  badgeKind: typeof internalBadgeKind;
  badgeStatus: typeof internalBadgeStatus;
  title: string;
  description: string;
  learnerId: string;
  organizationId: string;
  courseVersionId: string;
  proofConfigId: string;
  proofSubmissionId: string;
  issuerId: string;
  issuedAt: string;
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  proofType: string;
  visibilityDefault: "PRIVATE";
  publicBadgeEnabled: false;
  badgeVisualIssued: false;
  donorVisibilityEnabled: false;
  aiIssued: false;
  certificateSeparate: true;
  publicCredentialUrl: "";
  qrCodeEnabled: false;
};

export function buildInternalBadgeMetadata(
  achievement: InternalBadgeMetadataAchievementLike,
): InternalBadgeMetadata {
  return {
    badgeKind: internalBadgeKind,
    badgeStatus: internalBadgeStatus,
    title: achievement.title,
    description: achievement.description,
    learnerId: achievement.userId,
    organizationId: achievement.organizationId,
    courseVersionId: achievement.courseVersionId,
    proofConfigId: achievement.practicalProofConfigId,
    proofSubmissionId: achievement.proofSubmissionId,
    issuerId: achievement.issuedById || "",
    issuedAt: normalizeIssuedAt(achievement.issuedAt),
    capacityArea: achievement.capacityArea,
    subCapacityArea: achievement.subCapacityArea,
    linkedStandard: achievement.linkedStandard,
    capacityIndicator: achievement.capacityIndicator,
    proofType: achievement.proofType,
    visibilityDefault: "PRIVATE",
    publicBadgeEnabled: false,
    badgeVisualIssued: false,
    donorVisibilityEnabled: false,
    aiIssued: false,
    certificateSeparate: true,
    publicCredentialUrl: "",
    qrCodeEnabled: false,
  };
}

function normalizeIssuedAt(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

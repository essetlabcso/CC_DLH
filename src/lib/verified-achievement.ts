import { practicalProofVisibilityDefault } from "@/lib/studio/practical-proof";

export const verifiedAchievementAuditEventType =
  "VERIFIED_ACHIEVEMENT_ISSUED";

export type VerifiedAchievementProofSubmissionLike = {
  id: string;
  status: string;
  userId: string;
  courseVersionId: string;
  practicalProofConfigId: string;
  redactionRequired: boolean;
  specialistReviewRequired: boolean;
  visibilityDefault: string;
  donorVisibilityConsent: boolean;
  aiVerificationUsed: boolean;
  verifiedAchievement?: unknown | null;
  practicalProofConfig: {
    proofTitle: string;
    proofPurpose: string;
    acceptedProofType: string;
    capacityArea: string;
    subCapacityArea: string;
    linkedStandard: string;
    capacityIndicator: string;
  };
  courseVersion: {
    course: {
      organizationId: string;
      title: string;
    };
  };
};

export type VerifiedAchievementEligibility = {
  allowed: boolean;
  blockers: string[];
};

export function getVerifiedAchievementEligibility(
  submission: VerifiedAchievementProofSubmissionLike,
): VerifiedAchievementEligibility {
  const blockers: string[] = [];

  if (submission.status !== "ACCEPTED") {
    blockers.push("proof-not-accepted");
  }

  if (submission.redactionRequired) {
    blockers.push("redaction-required");
  }

  if (submission.specialistReviewRequired) {
    blockers.push("specialist-review-required");
  }

  if (submission.verifiedAchievement) {
    blockers.push("achievement-already-issued");
  }

  if (submission.visibilityDefault !== practicalProofVisibilityDefault) {
    blockers.push("raw-proof-not-private");
  }

  if (submission.donorVisibilityConsent) {
    blockers.push("donor-visibility-consented");
  }

  if (submission.aiVerificationUsed) {
    blockers.push("ai-verification-used");
  }

  if (!submission.practicalProofConfig.capacityArea) {
    blockers.push("capacity-area-missing");
  }

  if (!submission.practicalProofConfig.capacityIndicator) {
    blockers.push("capacity-indicator-missing");
  }

  return {
    allowed: blockers.length === 0,
    blockers,
  };
}

export function buildVerifiedAchievementCreateData(
  submission: VerifiedAchievementProofSubmissionLike,
  options: {
    issuedById: string;
    verificationNote?: string;
  },
) {
  const config = submission.practicalProofConfig;

  return {
    organizationId: submission.courseVersion.course.organizationId,
    userId: submission.userId,
    courseVersionId: submission.courseVersionId,
    practicalProofConfigId: submission.practicalProofConfigId,
    proofSubmissionId: submission.id,
    issuedById: options.issuedById,
    title: buildVerifiedAchievementTitle(config.capacityIndicator),
    description: buildVerifiedAchievementDescription({
      capacityArea: config.capacityArea,
      capacityIndicator: config.capacityIndicator,
      proofTitle: config.proofTitle,
    }),
    capacityArea: config.capacityArea,
    subCapacityArea: config.subCapacityArea,
    linkedStandard: config.linkedStandard,
    capacityIndicator: config.capacityIndicator,
    proofType: config.acceptedProofType,
    verificationDecision: "ACCEPTED",
    verificationNote: options.verificationNote?.trim() || "",
    visibilityDefault: practicalProofVisibilityDefault,
    donorVisibilityEnabled: false,
    publicBadgeEnabled: false,
    badgeVisualIssued: false,
    aiIssued: false,
  };
}

export function buildVerifiedAchievementTitle(capacityIndicator: string) {
  const indicator = capacityIndicator.trim();

  return indicator
    ? `Verified Achievement: ${indicator}`
    : "Verified Achievement";
}

export function buildVerifiedAchievementDescription(input: {
  capacityArea: string;
  capacityIndicator: string;
  proofTitle: string;
}) {
  const capacityArea = input.capacityArea.trim() || "a DEC capacity area";
  const capacityIndicator =
    input.capacityIndicator.trim() || "a specific capacity indicator";
  const proofTitle = input.proofTitle.trim() || "practical proof";

  return `Awarded for reviewed practical evidence from ${proofTitle}, linked to ${capacityIndicator} in ${capacityArea}.`;
}

export function getVerifiedAchievementBlockerMessage(blocker: string) {
  switch (blocker) {
    case "proof-not-accepted":
      return "Proof must be accepted before a verified achievement can be issued.";
    case "redaction-required":
      return "Redaction must be resolved before recognition is issued.";
    case "specialist-review-required":
      return "Specialist review must be resolved before recognition is issued.";
    case "achievement-already-issued":
      return "A verified achievement has already been issued for this proof.";
    case "raw-proof-not-private":
      return "Raw proof must remain private before recognition is issued.";
    case "donor-visibility-consented":
      return "Donor visibility is not enabled in this slice.";
    case "ai-verification-used":
      return "AI verification cannot issue verified achievements.";
    case "capacity-area-missing":
      return "Capacity area is required for verified achievement linkage.";
    case "capacity-indicator-missing":
      return "Capacity indicator is required for verified achievement linkage.";
    default:
      return blocker;
  }
}

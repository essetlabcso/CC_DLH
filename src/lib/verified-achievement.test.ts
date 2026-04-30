import { describe, expect, it } from "vitest";

import {
  buildVerifiedAchievementCreateData,
  getVerifiedAchievementEligibility,
  verifiedAchievementAuditEventType,
  type VerifiedAchievementProofSubmissionLike,
} from "./verified-achievement";

describe("verified achievement foundation", () => {
  it("allows private accepted proof to issue a verified achievement", () => {
    const submission = makeSubmission();

    expect(getVerifiedAchievementEligibility(submission)).toEqual({
      allowed: true,
      blockers: [],
    });

    const data = buildVerifiedAchievementCreateData(submission, {
      issuedById: "reviewer-1",
      verificationNote: "Accepted after human review.",
    });

    expect(data).toMatchObject({
      organizationId: "org-1",
      userId: "learner-1",
      courseVersionId: "version-1",
      practicalProofConfigId: "proof-config-1",
      proofSubmissionId: "submission-1",
      issuedById: "reviewer-1",
      capacityArea: "Safeguarding",
      capacityIndicator: "Uses safe referral steps.",
      proofType: "work-sample",
      verificationDecision: "ACCEPTED",
      visibilityDefault: "PRIVATE",
      donorVisibilityEnabled: false,
      publicBadgeEnabled: false,
      badgeVisualIssued: false,
      aiIssued: false,
    });
    expect(data.title).toContain("Verified Achievement");
    expect(data.description).toContain("reviewed practical evidence");
  });

  it("blocks non-accepted proof and unsafe recognition cases", () => {
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          status: "SUBMITTED",
        }),
      ).blockers,
    ).toContain("proof-not-accepted");
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          redactionRequired: true,
        }),
      ).blockers,
    ).toContain("redaction-required");
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          specialistReviewRequired: true,
        }),
      ).blockers,
    ).toContain("specialist-review-required");
  });

  it("blocks duplicate, donor-visible, AI-verified, or unlinked proof", () => {
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          verifiedAchievement: {},
        }),
      ).blockers,
    ).toContain("achievement-already-issued");
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          donorVisibilityConsent: true,
        }),
      ).blockers,
    ).toContain("donor-visibility-consented");
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          aiVerificationUsed: true,
        }),
      ).blockers,
    ).toContain("ai-verification-used");
    expect(
      getVerifiedAchievementEligibility(
        makeSubmission({
          practicalProofConfig: {
            ...makeSubmission().practicalProofConfig,
            capacityIndicator: "",
          },
        }),
      ).blockers,
    ).toContain("capacity-indicator-missing");
  });

  it("uses a dedicated audit event type without changing certificate rules", () => {
    expect(verifiedAchievementAuditEventType).toBe(
      "VERIFIED_ACHIEVEMENT_ISSUED",
    );
    expect(verifiedAchievementAuditEventType).not.toContain("90%");
  });
});

function makeSubmission(
  overrides: Partial<VerifiedAchievementProofSubmissionLike> = {},
): VerifiedAchievementProofSubmissionLike {
  return {
    id: "submission-1",
    status: "ACCEPTED",
    userId: "learner-1",
    courseVersionId: "version-1",
    practicalProofConfigId: "proof-config-1",
    redactionRequired: false,
    specialistReviewRequired: false,
    visibilityDefault: "PRIVATE",
    donorVisibilityConsent: false,
    aiVerificationUsed: false,
    verifiedAchievement: null,
    practicalProofConfig: {
      proofTitle: "Referral checklist",
      proofPurpose: "Show applied referral steps.",
      acceptedProofType: "work-sample",
      capacityArea: "Safeguarding",
      subCapacityArea: "Referral",
      linkedStandard: "DEC safeguarding practice",
      capacityIndicator: "Uses safe referral steps.",
    },
    courseVersion: {
      course: {
        organizationId: "org-1",
        title: "Safe referral basics",
      },
    },
    ...overrides,
  };
}

import { describe, expect, it } from "vitest";

import {
  buildProofReviewUpdateData,
  getProofReviewLearnerGuidance,
  getProofReviewStatusLabel,
  parseProofReviewDecisionFormData,
  summarizeProofReviewForLearner,
} from "./proof-review";

describe("proof review workflow", () => {
  it("requires learner-safe feedback for revision, unsafe, and rejected decisions", () => {
    const formData = new FormData();
    formData.set("status", "REVISION_REQUESTED");

    const result = parseProofReviewDecisionFormData(formData);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.missingFields).toEqual(
        expect.arrayContaining(["learnerFeedback", "requiredAction"]),
      );
    }
  });

  it("accepts proof without issuing badges or changing certificates", () => {
    const formData = new FormData();
    formData.set("status", "ACCEPTED");
    formData.set("learnerFeedback", "This proof meets the requested task.");
    formData.set("internalReviewNote", "Internal review complete.");

    const result = parseProofReviewDecisionFormData(formData);

    expect(result.ok).toBe(true);

    if (result.ok) {
      const update = buildProofReviewUpdateData(result.value);
      const checklist = JSON.parse(update.reviewChecklist) as Record<
        string,
        unknown
      >;

      expect(update.status).toBe("ACCEPTED");
      expect(checklist.noBadgeOrVerifiedAchievementIssued).toBe(true);
      expect(checklist.proofReviewSeparateFromCertificate).toBe(true);
      expect(checklist.certificateRule).toContain("80%+");
      expect(checklist.certificateRule).not.toContain("90%");
    }
  });

  it("keeps donor visibility and AI verification disabled in review evidence", () => {
    const formData = new FormData();
    formData.set("status", "UNSAFE_REDACTION_REQUIRED");
    formData.set("learnerFeedback", "Remove sensitive details.");
    formData.set("requiredAction", "Submit only anonymized information later.");

    const result = parseProofReviewDecisionFormData(formData);

    expect(result.ok).toBe(true);

    if (result.ok) {
      const update = buildProofReviewUpdateData(result.value);
      const checklist = JSON.parse(update.reviewChecklist) as Record<
        string,
        unknown
      >;

      expect(update.redactionRequired).toBe(true);
      expect(checklist.donorVisibilityEnabled).toBe(false);
      expect(checklist.aiVerificationUsed).toBe(false);
    }
  });

  it("formats learner-safe statuses and guidance", () => {
    expect(getProofReviewStatusLabel("REVISION_REQUESTED")).toBe(
      "Revision requested",
    );
    expect(
      getProofReviewLearnerGuidance({
        status: "ACCEPTED",
        learnerFeedback: "",
        requiredAction: "",
        redactionRequired: false,
        specialistReviewRequired: false,
      }),
    ).toContain("badge issuance are not active");
    expect(
      summarizeProofReviewForLearner({
        status: "UNDER_REVIEW",
        learnerFeedback: "",
        requiredAction: "",
        redactionRequired: false,
        specialistReviewRequired: false,
      }),
    ).toContain("Under review");
  });
});

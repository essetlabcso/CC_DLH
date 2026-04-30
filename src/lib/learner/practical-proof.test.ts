import { describe, expect, it } from "vitest";

import {
  buildPrivatePracticalProofSubmissionData,
  canSubmitPrivatePracticalProof,
  getPracticalProofCertificateSeparationCopy,
  parseLearnerPracticalProofFormData,
  summarizeLearnerPracticalProofSubmission,
} from "./practical-proof";

describe("learner practical proof intake", () => {
  it("requires text or a valid link plus safety acknowledgements", () => {
    const result = parseLearnerPracticalProofFormData(new FormData());

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.missingFields).toEqual(
        expect.arrayContaining([
          "proofTextOrEvidenceLink",
          "safetyAcknowledged",
          "certificateSeparationAcknowledged",
        ]),
      );
    }
  });

  it("rejects unsafe or invalid proof links", () => {
    const formData = new FormData();
    formData.set("evidenceLink", "javascript:alert('x')");
    formData.set("safetyAcknowledged", "on");
    formData.set("certificateSeparationAcknowledged", "on");

    const result = parseLearnerPracticalProofFormData(formData);

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.missingFields).toEqual(
        expect.arrayContaining(["proofTextOrEvidenceLink", "evidenceLink"]),
      );
    }
  });

  it("builds private-by-default proof submission data", () => {
    const formData = new FormData();
    formData.set("proofText", "A redacted example of how we applied the checklist.");
    formData.set("evidenceLink", "https://example.org/redacted-proof");
    formData.set("safetyAcknowledged", "on");
    formData.set("certificateSeparationAcknowledged", "on");

    const result = parseLearnerPracticalProofFormData(formData);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(buildPrivatePracticalProofSubmissionData(result.value)).toMatchObject({
        status: "SUBMITTED",
        visibilityDefault: "PRIVATE",
        donorVisibilityConsent: false,
        aiVerificationUsed: false,
        safetyAcknowledged: true,
        certificateSeparationAcknowledged: true,
      });
    }
  });

  it("allows submission only for safely enabled proof configuration", () => {
    expect(canSubmitPrivatePracticalProof(null)).toBe(false);
    expect(
      canSubmitPrivatePracticalProof({
        enabled: true,
        proofTitle: "Apply the referral checklist",
        proofPurpose: "Show safe use of the referral checklist.",
        acceptedProofType: "work-sample",
        submissionFormat: "text-response",
        instructions: "Describe how the checklist would be used.",
        safetyGuidance: "Do not include names or identifying case details.",
        reviewCriteria: "Shows correct sequence and safe escalation.",
        capacityArea: "Safeguarding",
        subCapacityArea: "Reporting",
        linkedStandard: "DEC safeguarding practice",
        capacityIndicator: "Uses safe referral steps.",
        visibilityDefault: "PRIVATE",
        donorVisibilityEnabled: false,
        certificateSeparationConfirmed: true,
        specialistReviewRequired: false,
      }),
    ).toBe(true);
  });

  it("keeps certificate copy separate from practical proof", () => {
    const copy = getPracticalProofCertificateSeparationCopy();

    expect(copy).toContain("final test only");
    expect(copy).toContain("80%+");
    expect(copy).not.toContain("90%");
  });

  it("summarizes own private submission status", () => {
    expect(summarizeLearnerPracticalProofSubmission(null)).toBe(
      "No practical proof submitted yet.",
    );
    expect(
      summarizeLearnerPracticalProofSubmission({
        status: "SUBMITTED",
        visibilityDefault: "PRIVATE",
        submittedAt: new Date("2026-04-30T00:00:00.000Z"),
      }),
    ).toContain("Private proof submitted");
  });
});

import { describe, expect, it } from "vitest";

import {
  buildPracticalProofReadiness,
  parsePracticalProofConfigFormData,
  practicalProofCertificateRule,
  practicalProofVisibilityDefault,
} from "./practical-proof";

describe("practical proof configuration", () => {
  it("treats missing proof config as safely disabled", () => {
    const readiness = buildPracticalProofReadiness(null);

    expect(readiness.ready).toBe(true);
    expect(readiness.enabled).toBe(false);
    expect(readiness.summary).toContain("certificates remain based");
  });

  it("defaults raw proof visibility to PRIVATE", () => {
    const result = parsePracticalProofConfigFormData(new FormData());

    expect(result.ok).toBe(true);
    expect(result.value.visibilityDefault).toBe(practicalProofVisibilityDefault);
    expect(result.value.donorVisibilityEnabled).toBe(false);
  });

  it("requires safe configuration fields when proof is enabled", () => {
    const formData = new FormData();
    formData.set("proofEnabled", "on");

    const result = parsePracticalProofConfigFormData(formData);

    expect(result.ok).toBe(false);
    expect(result.missingFields).toEqual(
      expect.arrayContaining([
        "proofTitle",
        "proofPurpose",
        "acceptedProofType",
        "submissionFormat",
        "instructions",
        "safetyGuidance",
        "reviewCriteria",
        "capacityArea",
        "capacityIndicator",
        "certificateSeparationConfirmed",
      ]),
    );
  });

  it("passes when enabled proof is private, safe, and separate from certificates", () => {
    const readiness = buildPracticalProofReadiness({
      enabled: true,
      proofTitle: "Apply the referral checklist",
      proofPurpose: "Show practical use of the referral checklist.",
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
    });

    expect(readiness.ready).toBe(true);
    expect(readiness.status).toBe("Safely configured");
    expect(readiness.certificateSeparation).toBe(practicalProofCertificateRule);
    expect(readiness.certificateSeparation).toContain("80%+");
    expect(readiness.certificateSeparation).not.toContain("90%");
  });

  it("blocks donor visibility and non-private raw proof visibility", () => {
    const readiness = buildPracticalProofReadiness({
      enabled: true,
      proofTitle: "Apply the referral checklist",
      proofPurpose: "Show practical use of the referral checklist.",
      acceptedProofType: "work-sample",
      submissionFormat: "text-response",
      instructions: "Describe how the checklist would be used.",
      safetyGuidance: "Do not include names or identifying case details.",
      reviewCriteria: "Shows correct sequence and safe escalation.",
      capacityArea: "Safeguarding",
      subCapacityArea: "Reporting",
      linkedStandard: "DEC safeguarding practice",
      capacityIndicator: "Uses safe referral steps.",
      visibilityDefault: "PUBLIC",
      donorVisibilityEnabled: true,
      certificateSeparationConfirmed: true,
      specialistReviewRequired: false,
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toEqual(
      expect.arrayContaining(["visibilityDefault", "donorVisibilityEnabled"]),
    );
  });
});

import { describe, expect, it } from "vitest";

import { buildInternalBadgeMetadata } from "./badge-metadata";

describe("internal badge metadata", () => {
  it("maps verified achievement fields to internal-only recognition metadata", () => {
    expect(buildInternalBadgeMetadata(makeAchievement())).toMatchObject({
      badgeKind: "VERIFIED_ACHIEVEMENT",
      badgeStatus: "INTERNAL_ONLY",
      title: "Verified Achievement: Uses safe referral steps.",
      description:
        "Awarded for reviewed practical evidence from Referral checklist.",
      learnerId: "learner-1",
      organizationId: "org-1",
      courseVersionId: "version-1",
      proofConfigId: "proof-config-1",
      proofSubmissionId: "submission-1",
      issuerId: "reviewer-1",
      issuedAt: "2026-05-01T00:00:00.000Z",
      capacityArea: "Safeguarding",
      subCapacityArea: "Referral",
      linkedStandard: "DEC safeguarding practice",
      capacityIndicator: "Uses safe referral steps.",
      proofType: "work-sample",
    });
  });

  it("keeps badge metadata private and non-public", () => {
    const metadata = buildInternalBadgeMetadata(makeAchievement());

    expect(metadata.visibilityDefault).toBe("PRIVATE");
    expect(metadata.publicBadgeEnabled).toBe(false);
    expect(metadata.badgeVisualIssued).toBe(false);
    expect(metadata.donorVisibilityEnabled).toBe(false);
    expect(metadata.aiIssued).toBe(false);
    expect(metadata.publicCredentialUrl).toBe("");
    expect(metadata.qrCodeEnabled).toBe(false);
    expect(metadata.certificateSeparate).toBe(true);
  });

  it("does not expose raw proof, internal review, public URL, QR data, or 90 percent threshold", () => {
    const metadata = buildInternalBadgeMetadata({
      ...makeAchievement(),
      proofText: "Raw proof must not be copied.",
      evidenceLink: "https://example.org/private-proof",
      internalReviewNote: "Internal reviewer note.",
      donorFacingSummary: "Donor summary must not exist.",
      publicUrl: "https://example.org/public-badge",
      qrCodeData: "qr-data",
    } as ReturnType<typeof makeAchievement> & Record<string, unknown>);
    const serialized = JSON.stringify(metadata);

    expect(serialized).not.toContain("Raw proof");
    expect(serialized).not.toContain("private-proof");
    expect(serialized).not.toContain("Internal reviewer note");
    expect(serialized).not.toContain("Donor summary");
    expect(serialized).not.toContain("public-badge");
    expect(serialized).not.toContain("qr-data");
    expect(serialized).not.toContain("90%");
  });

  it("uses an empty issuer id when the issuing user is no longer recorded", () => {
    expect(
      buildInternalBadgeMetadata({
        ...makeAchievement(),
        issuedById: null,
      }).issuerId,
    ).toBe("");
  });
});

function makeAchievement() {
  return {
    title: "Verified Achievement: Uses safe referral steps.",
    description:
      "Awarded for reviewed practical evidence from Referral checklist.",
    userId: "learner-1",
    organizationId: "org-1",
    courseVersionId: "version-1",
    practicalProofConfigId: "proof-config-1",
    proofSubmissionId: "submission-1",
    issuedById: "reviewer-1",
    issuedAt: new Date("2026-05-01T00:00:00.000Z"),
    capacityArea: "Safeguarding",
    subCapacityArea: "Referral",
    linkedStandard: "DEC safeguarding practice",
    capacityIndicator: "Uses safe referral steps.",
    proofType: "work-sample",
  };
}

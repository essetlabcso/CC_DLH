import { describe, expect, it } from "vitest";

import {
  buildOrganizationAchievementCapacityGroups,
  buildOrganizationSafeAchievementSummary,
  filterOrganizationSafeAchievements,
} from "./organization-achievement-summary";

describe("organization-safe achievement summary", () => {
  it("builds private aggregate counts from verified achievements", () => {
    const summary = buildOrganizationSafeAchievementSummary(makeAchievements());

    expect(summary).toMatchObject({
      organizationId: "org-1",
      totalAchievementCount: 4,
      uniqueLearnerCount: 3,
      courseVersionCount: 2,
      latestIssuedAt: "2026-05-04T00:00:00.000Z",
    });
    expect(summary.privacySafety).toMatchObject({
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
    });
  });

  it("groups by capacity area, linked standard, and proof type", () => {
    const summary = buildOrganizationSafeAchievementSummary(makeAchievements());

    expect(summary.capacityAreaGroups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          capacityArea: "Safeguarding",
          linkedStandard: "DEC safeguarding practice",
          proofType: "work-sample",
          achievementCount: 2,
          learnerCount: 2,
          courseVersionCount: 1,
          smallGroupCaution: true,
        }),
        expect.objectContaining({
          capacityArea: "MEAL",
          linkedStandard: "Outcome evidence standard",
          proofType: "reflection-note",
          achievementCount: 2,
          learnerCount: 2,
          courseVersionCount: 1,
          smallGroupCaution: true,
        }),
      ]),
    );
    expect(summary.linkedStandardGroups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          linkedStandard: "DEC safeguarding practice",
          achievementCount: 2,
        }),
        expect.objectContaining({
          linkedStandard: "Outcome evidence standard",
          achievementCount: 2,
        }),
      ]),
    );
    expect(summary.proofTypeGroups).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          proofType: "work-sample",
          achievementCount: 2,
        }),
        expect.objectContaining({
          proofType: "reflection-note",
          achievementCount: 2,
        }),
      ]),
    );
  });

  it("sets small group caution only when learner count is below three", () => {
    const groups = buildOrganizationAchievementCapacityGroups([
      ...makeAchievements(),
      makeAchievement({
        userId: "learner-4",
        issuedAt: new Date("2026-05-05T00:00:00.000Z"),
      }),
    ]);

    expect(
      groups.find((group) => group.capacityArea === "Safeguarding")
        ?.smallGroupCaution,
    ).toBe(false);
    expect(
      groups.find((group) => group.capacityArea === "MEAL")?.smallGroupCaution,
    ).toBe(true);
  });

  it("filters safe achievements without requiring monitoring records", () => {
    expect(
      filterOrganizationSafeAchievements(makeAchievements(), {
        organizationId: "org-1",
        capacityArea: "MEAL",
        linkedStandard: "Outcome evidence standard",
        proofType: "reflection-note",
      }),
    ).toHaveLength(2);
  });

  it("excludes non-private, donor-visible, public, visual, and AI-issued records", () => {
    const summary = buildOrganizationSafeAchievementSummary([
      ...makeAchievements(),
      makeAchievement({ visibilityDefault: "PUBLIC" }),
      makeAchievement({ donorVisibilityEnabled: true }),
      makeAchievement({ publicBadgeEnabled: true }),
      makeAchievement({ badgeVisualIssued: true }),
      makeAchievement({ aiIssued: true }),
    ]);

    expect(summary.totalAchievementCount).toBe(4);
    expect(summary.privacySafety.donorVisibilityEnabled).toBe(false);
    expect(summary.privacySafety.publicBadgeEnabled).toBe(false);
    expect(summary.privacySafety.aiIssued).toBe(false);
  });

  it("does not expose proof content, snapshots, internal notes, identities, public URLs, QR data, certificate claims, or 90 percent thresholds", () => {
    const summary = buildOrganizationSafeAchievementSummary([
      {
        ...makeAchievement(),
        proofText: "Raw proof text",
        evidenceLink: "https://example.org/private-proof",
        proofTextSnapshot: "Raw proof snapshot",
        evidenceLinkSnapshot: "https://example.org/snapshot",
        internalReviewNote: "Internal reviewer note",
        internalNote: "Private audit note",
        learnerName: "Learner Name",
        learnerEmail: "learner@example.org",
        donorFacingSummary: "Donor-facing summary",
        publicUrl: "https://example.org/public-achievement",
        qrCodeData: "qr-data",
        certificateClaim: "Certificate claim",
      } as ReturnType<typeof makeAchievement> & Record<string, unknown>,
    ]);
    const serialized = JSON.stringify(summary);

    expect(serialized).not.toContain("Raw proof text");
    expect(serialized).not.toContain("private-proof");
    expect(serialized).not.toContain("Raw proof snapshot");
    expect(serialized).not.toContain("snapshot");
    expect(serialized).not.toContain("Internal reviewer note");
    expect(serialized).not.toContain("Private audit note");
    expect(serialized).not.toContain("Learner Name");
    expect(serialized).not.toContain("learner@example.org");
    expect(serialized).not.toContain("Donor-facing summary");
    expect(serialized).not.toContain("public-achievement");
    expect(serialized).not.toContain("qr-data");
    expect(serialized).not.toContain("Certificate claim");
    expect(serialized).not.toContain("90%");
  });
});

function makeAchievements() {
  return [
    makeAchievement(),
    makeAchievement({
      userId: "learner-2",
      issuedAt: new Date("2026-05-02T00:00:00.000Z"),
    }),
    makeAchievement({
      userId: "learner-2",
      courseVersionId: "version-2",
      issuedAt: new Date("2026-05-03T00:00:00.000Z"),
      capacityArea: "MEAL",
      subCapacityArea: "Outcome evidence",
      linkedStandard: "Outcome evidence standard",
      capacityIndicator: "Uses outcome evidence safely.",
      proofType: "reflection-note",
    }),
    makeAchievement({
      userId: "learner-3",
      courseVersionId: "version-2",
      issuedAt: new Date("2026-05-04T00:00:00.000Z"),
      capacityArea: "MEAL",
      subCapacityArea: "Outcome evidence",
      linkedStandard: "Outcome evidence standard",
      capacityIndicator: "Uses outcome evidence safely.",
      proofType: "reflection-note",
    }),
  ];
}

function makeAchievement(
  overrides: Partial<ReturnType<typeof baseAchievement>> = {},
) {
  return {
    ...baseAchievement(),
    ...overrides,
  };
}

function baseAchievement() {
  return {
    organizationId: "org-1",
    userId: "learner-1",
    courseVersionId: "version-1",
    issuedAt: new Date("2026-05-01T00:00:00.000Z"),
    capacityArea: "Safeguarding",
    subCapacityArea: "Referral",
    linkedStandard: "DEC safeguarding practice",
    capacityIndicator: "Uses safe referral steps.",
    proofType: "work-sample",
    visibilityDefault: "PRIVATE",
    donorVisibilityEnabled: false,
    publicBadgeEnabled: false,
    badgeVisualIssued: false,
    aiIssued: false,
  };
}

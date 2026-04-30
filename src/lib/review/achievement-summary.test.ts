import { describe, expect, it } from "vitest";

import {
  achievementSummarySelect,
  buildAchievementSummaryWhere,
  filterAchievementSummaryRecords,
  getAchievementSummaryFilterOptions,
  toOrganizationSafeAchievement,
  type AchievementSummaryRecord,
} from "./achievement-summary";

describe("review achievement summary helpers", () => {
  it("scopes the verified achievement query to private internal records in one organization", () => {
    expect(buildAchievementSummaryWhere("org-1")).toEqual({
      organizationId: "org-1",
      visibilityDefault: "PRIVATE",
      donorVisibilityEnabled: false,
      publicBadgeEnabled: false,
      badgeVisualIssued: false,
      aiIssued: false,
    });
  });

  it("selects only organization-safe verified achievement fields", () => {
    const selectedFields = Object.keys(achievementSummarySelect);

    expect(selectedFields).toEqual([
      "organizationId",
      "userId",
      "courseVersionId",
      "issuedAt",
      "capacityArea",
      "subCapacityArea",
      "linkedStandard",
      "capacityIndicator",
      "proofType",
      "visibilityDefault",
      "donorVisibilityEnabled",
      "publicBadgeEnabled",
      "badgeVisualIssued",
      "aiIssued",
    ]);
    expect(JSON.stringify(achievementSummarySelect)).not.toMatch(
      /proofText|evidenceLink|proofTextSnapshot|evidenceLinkSnapshot|internalReviewNote|internalNote|email|name|certificate/i,
    );
  });

  it("maps only verified achievement records into summary-safe data", () => {
    const safeAchievement = toOrganizationSafeAchievement(makeAchievement());
    const serialized = JSON.stringify(safeAchievement);

    expect(safeAchievement).toMatchObject({
      organizationId: "org-1",
      userId: "learner-1",
      courseVersionId: "version-1",
      capacityArea: "Safeguarding",
      visibilityDefault: "PRIVATE",
      donorVisibilityEnabled: false,
      publicBadgeEnabled: false,
      badgeVisualIssued: false,
      aiIssued: false,
    });
    expect(serialized).not.toContain("proofText");
    expect(serialized).not.toContain("learner@example.org");
    expect(serialized).not.toContain("Certificate");
    expect(serialized).not.toContain("90%");
  });

  it("filters organization-safe achievements before summary rendering", () => {
    const records = [
      toOrganizationSafeAchievement(makeAchievement()),
      toOrganizationSafeAchievement(makeAchievement({ organizationId: "org-2" })),
      toOrganizationSafeAchievement(makeAchievement({ donorVisibilityEnabled: true })),
      toOrganizationSafeAchievement(makeAchievement({ publicBadgeEnabled: true })),
      toOrganizationSafeAchievement(makeAchievement({ badgeVisualIssued: true })),
      toOrganizationSafeAchievement(makeAchievement({ aiIssued: true })),
    ];

    expect(
      filterAchievementSummaryRecords(records, { organizationId: "org-1" }),
    ).toHaveLength(5);
    expect(
      filterAchievementSummaryRecords(records, {
        organizationId: "org-1",
        capacityArea: "Safeguarding",
      }).filter(
        (achievement) =>
          achievement.donorVisibilityEnabled !== true &&
          achievement.publicBadgeEnabled !== true &&
          achievement.badgeVisualIssued !== true &&
          achievement.aiIssued !== true,
      ),
    ).toHaveLength(1);
  });

  it("builds neutral filter options without learner identity details", () => {
    expect(
      getAchievementSummaryFilterOptions([
        toOrganizationSafeAchievement(makeAchievement()),
        toOrganizationSafeAchievement(
          makeAchievement({
            capacityArea: "MEAL",
            linkedStandard: "Outcome evidence standard",
            proofType: "reflection-note",
          }),
        ),
      ]),
    ).toEqual({
      capacityAreas: ["MEAL", "Safeguarding"],
      linkedStandards: ["DEC safeguarding practice", "Outcome evidence standard"],
      proofTypes: ["reflection-note", "work-sample"],
    });
  });
});

function makeAchievement(
  overrides: Partial<AchievementSummaryRecord> = {},
): AchievementSummaryRecord {
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
    ...overrides,
  };
}

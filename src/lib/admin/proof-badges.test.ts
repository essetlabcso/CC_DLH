import { describe, expect, it, vi, beforeEach } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminProofBadgesOverview } from "./proof-badges";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    coursePracticalProofConfig: {
      count: vi.fn(),
    },
    learnerCertificate: {
      count: vi.fn(),
    },
    learnerPracticalProofSubmission: {
      findMany: vi.fn(),
    },
    learnerVerifiedAchievement: {
      findMany: vi.fn(),
    },
  },
}));

describe("getAdminProofBadgesOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds read-only aggregate summaries for proof and recognition records", async () => {
    vi.mocked(prisma.coursePracticalProofConfig.count).mockResolvedValue(3);
    vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(8);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([
      {
        aiVerificationUsed: false,
        donorVisibilityConsent: false,
        practicalProofConfig: { capacityArea: "MEAL" },
        redactionRequired: false,
        specialistReviewRequired: false,
        status: "SUBMITTED",
        visibilityDefault: "PRIVATE",
        courseVersion: {
          course: {
            organization: { name: "CSO A" },
            title: "Outcome Tracking",
          },
        },
      },
      {
        aiVerificationUsed: false,
        donorVisibilityConsent: false,
        practicalProofConfig: { capacityArea: "Safeguarding" },
        redactionRequired: true,
        specialistReviewRequired: true,
        status: "ACCEPTED",
        visibilityDefault: "PRIVATE",
        courseVersion: {
          course: {
            organization: { name: "CSO B" },
            title: "Safe Referrals",
          },
        },
      },
    ] as never);
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([
      {
        aiIssued: false,
        badgeVisualIssued: false,
        capacityArea: "MEAL",
        donorVisibilityEnabled: false,
        organization: { name: "CSO A" },
        publicBadgeEnabled: false,
        verificationDecision: "ACCEPTED",
        visibilityDefault: "PRIVATE",
        courseVersion: {
          course: {
            organization: { name: "CSO A" },
            title: "Outcome Tracking",
          },
        },
      },
      {
        aiIssued: false,
        badgeVisualIssued: true,
        capacityArea: "MEAL",
        donorVisibilityEnabled: true,
        organization: { name: "CSO A" },
        publicBadgeEnabled: true,
        verificationDecision: "ACCEPTED",
        visibilityDefault: "DONOR_SAFE",
        courseVersion: {
          course: {
            organization: { name: "CSO A" },
            title: "Outcome Tracking",
          },
        },
      },
    ] as never);

    const overview = await getAdminProofBadgesOverview();

    expect(overview.totals).toEqual({
      certificates: 8,
      proofEnabledCourses: 3,
      proofSubmissions: 2,
      verifiedAchievements: 2,
    });
    expect(overview.proofStatuses).toEqual([
      { label: "Accepted", count: 1 },
      { label: "Submitted", count: 1 },
    ]);
    expect(overview.proofSafety).toEqual({
      aiVerificationUsed: 0,
      donorVisibilityConsent: 0,
      privateProof: 2,
      redactionRequired: 1,
      specialistReviewRequired: 1,
    });
    expect(overview.verifiedAchievementDecisions).toEqual([
      { label: "Accepted", count: 2 },
    ]);
    expect(overview.recognitionVisibility).toEqual({
      aiIssued: 0,
      badgeVisualIssued: 1,
      donorVisible: 1,
      privateAchievements: 1,
      publicBadgeEnabled: 1,
    });
    expect(overview.capacityAreas).toEqual([
      {
        label: "MEAL",
        proofSubmissions: 1,
        verifiedAchievements: 2,
      },
      {
        label: "Safeguarding",
        proofSubmissions: 1,
        verifiedAchievements: 0,
      },
    ]);
    expect(overview.courses[0]).toEqual({
      label: "Outcome Tracking - CSO A",
      proofSubmissions: 1,
      verifiedAchievements: 2,
    });
    expect(overview.organizations[0]).toEqual({
      label: "CSO A",
      proofSubmissions: 1,
      verifiedAchievements: 2,
    });
  });

  it("uses safe explicit selects without raw proof or learner details", async () => {
    vi.mocked(prisma.coursePracticalProofConfig.count).mockResolvedValue(0);
    vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(0);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([]);

    await getAdminProofBadgesOverview();

    const proofSelect =
      vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mock.calls[0][0]
        ?.select;
    expect(proofSelect).not.toHaveProperty("proofText");
    expect(proofSelect).not.toHaveProperty("evidenceLink");
    expect(proofSelect).not.toHaveProperty("internalReviewNote");
    expect(proofSelect).not.toHaveProperty("reviewChecklist");
    expect(proofSelect).not.toHaveProperty("user");
    expect(proofSelect).not.toHaveProperty("reviewer");
    expect(proofSelect).not.toHaveProperty("events");

    const achievementSelect =
      vi.mocked(prisma.learnerVerifiedAchievement.findMany).mock.calls[0][0]
        ?.select;
    expect(achievementSelect).not.toHaveProperty("user");
    expect(achievementSelect).not.toHaveProperty("verificationNote");
    expect(achievementSelect).not.toHaveProperty("proofSubmission");
    expect(achievementSelect).not.toHaveProperty("issuedBy");
  });

  it("returns empty aggregate lists safely", async () => {
    vi.mocked(prisma.coursePracticalProofConfig.count).mockResolvedValue(0);
    vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(0);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([]);

    await expect(getAdminProofBadgesOverview()).resolves.toEqual({
      capacityAreas: [],
      courses: [],
      organizations: [],
      proofSafety: {
        aiVerificationUsed: 0,
        donorVisibilityConsent: 0,
        privateProof: 0,
        redactionRequired: 0,
        specialistReviewRequired: 0,
      },
      proofStatuses: [],
      recognitionVisibility: {
        aiIssued: 0,
        badgeVisualIssued: 0,
        donorVisible: 0,
        privateAchievements: 0,
        publicBadgeEnabled: 0,
      },
      totals: {
        certificates: 0,
        proofEnabledCourses: 0,
        proofSubmissions: 0,
        verifiedAchievements: 0,
      },
      verifiedAchievementDecisions: [],
    });
  });
});

import { describe, it, expect, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminDataSafetyOverview } from "./data-safety";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learnerPracticalProofSubmission: {
      findMany: vi.fn(),
    },
    learnerVerifiedAchievement: {
      findMany: vi.fn(),
    },
  },
}));

describe("getAdminDataSafetyOverview", () => {
  it("fetches all platform submissions requiring specialist review or redaction using safe selects", async () => {
    const mockFlaggedSubmissions = [
      {
        id: "sub-1",
        redactionRequired: false,
        specialistReviewRequired: true,
      },
    ];
    const mockExternallyVisibleAchievements = [
      { id: "achv-1", donorVisibilityEnabled: true },
    ];

    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue(
      mockFlaggedSubmissions as never,
    );
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue(
      mockExternallyVisibleAchievements as never,
    );

    const result = await getAdminDataSafetyOverview();

    expect(prisma.learnerPracticalProofSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { specialistReviewRequired: true },
            { redactionRequired: true },
          ],
        }),
      }),
    );

    const select =
      vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mock.calls[0][0]
        ?.select;
    expect(select).toMatchObject({
      id: true,
      redactionRequired: true,
      specialistReviewRequired: true,
      submittedAt: true,
    });
    expect(select).not.toHaveProperty("proofText");
    expect(select).not.toHaveProperty("evidenceLink");
    expect(select).not.toHaveProperty("internalReviewNote");
    expect(select).not.toHaveProperty("requiredAction");
    expect(select).not.toHaveProperty("reviewChecklist");
    expect(select).not.toHaveProperty("events");
    expect(select).not.toHaveProperty("user");

    expect(result.flaggedSubmissions).toEqual(mockFlaggedSubmissions);
    expect(result.totals).toMatchObject({
      externallyVisibleAchievements: 1,
      flaggedProofSubmissions: 1,
      redactionNeeded: 0,
      specialistReviewNeeded: 1,
    });
  });

  it("fetches externally visible achievements with safe summary fields only", async () => {
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([]);

    await getAdminDataSafetyOverview();

    expect(prisma.learnerVerifiedAchievement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { donorVisibilityEnabled: true },
            { publicBadgeEnabled: true },
          ],
        }),
      }),
    );

    const select =
      vi.mocked(prisma.learnerVerifiedAchievement.findMany).mock.calls[0][0]
        ?.select;
    expect(select).toMatchObject({
      description: true,
      donorVisibilityEnabled: true,
      id: true,
      issuedAt: true,
      publicBadgeEnabled: true,
      title: true,
    });
    expect(select).not.toHaveProperty("user");
    expect(select).not.toHaveProperty("issuedBy");
    expect(select).not.toHaveProperty("proofSubmission");
    expect(select).not.toHaveProperty("verificationNote");
    expect(select).not.toHaveProperty("metadata");
  });

  it("counts redaction and specialist review flags separately", async () => {
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([
      {
        id: "sub-1",
        redactionRequired: true,
        specialistReviewRequired: true,
      },
      {
        id: "sub-2",
        redactionRequired: true,
        specialistReviewRequired: false,
      },
    ] as never);
    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([
      { id: "achv-1" },
      { id: "achv-2" },
    ] as never);

    const result = await getAdminDataSafetyOverview();

    expect(result.totals).toEqual({
      externallyVisibleAchievements: 2,
      flaggedProofSubmissions: 2,
      redactionNeeded: 2,
      specialistReviewNeeded: 1,
    });
  });
});

import { describe, it, expect, vi } from "vitest";

import { getAdminDataSafetyOverview } from "./data-safety";
import { prisma } from "@/lib/db/client";

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
  it("fetches all platform submissions requiring specialist review or redaction", async () => {
    const mockFlaggedSubmissions = [
      { id: "sub-1", specialistReviewRequired: true },
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

    // Verify raw proof fields are NOT selected
    const select = vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mock.calls[0][0]?.select;
    expect(select).not.toHaveProperty("proofText");
    expect(select).not.toHaveProperty("evidenceLink");

    expect(result.flaggedSubmissions).toEqual(mockFlaggedSubmissions);
  });

  it("fetches all externally visible achievements across platform", async () => {
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
  });
});

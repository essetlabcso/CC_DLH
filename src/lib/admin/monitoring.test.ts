import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getAdminMonitoringCounts,
  getCapacityAreaAchievementSummaries,
  getRecentVerifiedAchievements,
} from "./monitoring";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    user: { count: vi.fn() },
    learnerCertificate: { count: vi.fn() },
    learnerPracticalProofSubmission: { count: vi.fn() },
    learnerVerifiedAchievement: { count: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
  },
}));

describe("monitoring data aggregations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAdminMonitoringCounts", () => {
    it("returns correct aggregated counts", async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(15);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(10);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(5);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(2);

      const counts = await getAdminMonitoringCounts();

      expect(counts).toEqual({
        totalLearners: 15,
        totalCertificates: 10,
        proofsUnderReview: 5,
        totalVerifiedAchievements: 2,
      });

      expect(prisma.learnerPracticalProofSubmission.count).toHaveBeenCalledWith({
        where: {
          status: {
            in: ["SUBMITTED", "UNDER_REVIEW"],
          },
        },
      });
    });

    it("handles zero counts gracefully", async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(0);

      const counts = await getAdminMonitoringCounts();

      expect(counts).toEqual({
        totalLearners: 0,
        totalCertificates: 0,
        proofsUnderReview: 0,
        totalVerifiedAchievements: 0,
      });
    });
  });

  describe("getCapacityAreaAchievementSummaries", () => {
    it("groups verified achievements by capacity area", async () => {
      vi.mocked(prisma.learnerVerifiedAchievement.groupBy).mockResolvedValue([
        { capacityArea: "Monitoring, Evaluation, Accountability, and Learning", _count: { id: 3 } },
        { capacityArea: "Safeguarding", _count: { id: 1 } },
        { capacityArea: "", _count: { id: 2 } },
      ] as never);

      const summaries = await getCapacityAreaAchievementSummaries();

      expect(summaries).toEqual([
        { capacityArea: "Monitoring, Evaluation, Accountability, and Learning", count: 3 },
        { capacityArea: "Safeguarding", count: 1 },
        { capacityArea: "Uncategorized", count: 2 },
      ]);
    });
  });

  describe("getRecentVerifiedAchievements", () => {
    it("formats recent achievements safely without exposing raw proof", async () => {
      const mockDate = new Date("2026-05-01T00:00:00.000Z");
      vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([
        {
          id: "ach_1",
          title: "Outcome evidence practice",
          capacityArea: "MEAL",
          issuedAt: mockDate,
          organization: { name: "Test CSO" },
          courseVersion: { course: { title: "MEAL Basics" } },
        },
      ] as never);

      const recent = await getRecentVerifiedAchievements();

      expect(recent).toEqual([
        {
          id: "ach_1",
          title: "Outcome evidence practice",
          capacityArea: "MEAL",
          courseTitle: "MEAL Basics",
          organizationName: "Test CSO",
          issuedAt: mockDate,
        },
      ]);
    });
  });
});

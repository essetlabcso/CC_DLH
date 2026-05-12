import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getAdminMonitoringFilterOptions,
  getAdminMonitoringCounts,
  getCapacityAreaAchievementSummaries,
  getRecentVerifiedAchievements,
  parseAdminMonitoringFilters,
  getMonthlyMonitoringTrends,
  getCoursePerformanceSignals,
} from "./monitoring";
import { prisma } from "@/lib/db/client";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    cohort: { findMany: vi.fn() },
    course: { findMany: vi.fn() },
    organization: { findMany: vi.fn() },
    program: { findMany: vi.fn() },
    user: { count: vi.fn() },
    learnerCertificate: { count: vi.fn() },
    learnerPracticalProofSubmission: { count: vi.fn() },
    learnerVerifiedAchievement: { count: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
    learnerEnrollment: { count: vi.fn() },
    courseVersion: { findMany: vi.fn() },
  },
}));

describe("monitoring data aggregations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses non-empty monitoring filters including dates", () => {
    expect(
      parseAdminMonitoringFilters({
        capacityArea: " MEAL ",
        cohortId: "",
        courseId: "course-1",
        organizationId: "   ",
        programId: "program-1",
        startDate: "2026-01-01",
        endDate: "2026-01-31",
      }),
    ).toEqual({
      capacityArea: "MEAL",
      cohortId: undefined,
      courseId: "course-1",
      organizationId: undefined,
      programId: "program-1",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
    });
  });

  describe("getAdminMonitoringCounts", () => {
    it("returns correct aggregated counts", async () => {
      vi.mocked(prisma.learnerEnrollment.count).mockResolvedValue(20);
      vi.mocked(prisma.user.count).mockResolvedValue(15);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(10);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(5);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(2);

      const counts = await getAdminMonitoringCounts();

      expect(counts).toEqual({
        totalEnrolled: 20,
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

    it("applies filters through course version summary relations", async () => {
      vi.mocked(prisma.user.count).mockResolvedValue(4);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(3);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(2);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(1);

      await getAdminMonitoringCounts({
        capacityArea: "MEAL",
        cohortId: "cohort-1",
        courseId: "course-1",
        organizationId: "org-1",
        programId: "program-1",
      });

      const expectedCourseVersionWhere = {
        cohortCourses: {
          some: {
            cohort: {
              programId: "program-1",
            },
            cohortId: "cohort-1",
          },
        },
        course: {
          organizationId: "org-1",
        },
        courseId: "course-1",
        setup: {
          is: {
            capacityArea: "MEAL",
          },
        },
      };

      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {
          lessonProgress: {
            some: {
              courseVersion: expectedCourseVersionWhere,
            },
          },
        },
      });
      expect(prisma.learnerCertificate.count).toHaveBeenCalledWith({
        where: {
          courseVersion: expectedCourseVersionWhere,
        },
      });
      expect(prisma.learnerPracticalProofSubmission.count).toHaveBeenCalledWith({
        where: {
          courseVersion: expectedCourseVersionWhere,
          status: {
            in: ["SUBMITTED", "UNDER_REVIEW"],
          },
        },
      });
      expect(prisma.learnerVerifiedAchievement.count).toHaveBeenCalledWith({
        where: {
          capacityArea: "MEAL",
          courseVersion: {
            cohortCourses: expectedCourseVersionWhere.cohortCourses,
            course: expectedCourseVersionWhere.course,
            courseId: "course-1",
          },
        },
      });
    });

    it("handles zero counts gracefully", async () => {
      vi.mocked(prisma.learnerEnrollment.count).mockResolvedValue(0);
      vi.mocked(prisma.user.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(0);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(0);

      const counts = await getAdminMonitoringCounts();

      expect(counts).toEqual({
        totalEnrolled: 0,
        totalLearners: 0,
        totalCertificates: 0,
        proofsUnderReview: 0,
        totalVerifiedAchievements: 0,
      });
    });

    it("injects date constraints to where clause for all counted entities", async () => {
      vi.mocked(prisma.learnerEnrollment.count).mockResolvedValue(1);
      vi.mocked(prisma.user.count).mockResolvedValue(1);
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(1);
      vi.mocked(prisma.learnerPracticalProofSubmission.count).mockResolvedValue(1);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(1);

      await getAdminMonitoringCounts({
        startDate: "2026-02-01",
        endDate: "2026-02-28",
      });

      const expectedDateWhere = {
        gte: new Date("2026-02-01T00:00:00"),
        lte: new Date("2026-02-28T23:59:59"),
      };

      expect(prisma.learnerEnrollment.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expectedDateWhere,
        }),
      });

      expect(prisma.user.count).toHaveBeenCalledWith({
        where: {
          lessonProgress: {
            some: expect.objectContaining({
              createdAt: expectedDateWhere,
            }),
          },
        },
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

    it("filters capacity summaries without exposing achievement details", async () => {
      vi.mocked(prisma.learnerVerifiedAchievement.groupBy).mockResolvedValue([
        { capacityArea: "MEAL", _count: { id: 2 } },
      ] as never);

      await getCapacityAreaAchievementSummaries({
        cohortId: "cohort-1",
        programId: "program-1",
      });

      expect(prisma.learnerVerifiedAchievement.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: ["capacityArea"],
          where: {
            courseVersion: {
              cohortCourses: {
                some: {
                  cohort: {
                    programId: "program-1",
                  },
                  cohortId: "cohort-1",
                },
              },
            },
          },
        }),
      );
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

      expect(prisma.learnerVerifiedAchievement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.not.objectContaining({
            evidenceLink: true,
            internalReviewNote: true,
            proofText: true,
            user: expect.anything(),
          }),
        }),
      );
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

    it("applies safe filters to recent achievement summaries", async () => {
      vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([]);

      await getRecentVerifiedAchievements({
        capacityArea: "MEAL",
        organizationId: "org-1",
      });

      expect(prisma.learnerVerifiedAchievement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            capacityArea: "MEAL",
            courseVersion: {
              course: {
                organizationId: "org-1",
              },
            },
          },
        }),
      );
    });
  });

  describe("getAdminMonitoringFilterOptions", () => {
    it("loads safe filter options without learner or proof records", async () => {
      vi.mocked(prisma.program.findMany).mockResolvedValue([
        { code: "DEC", id: "program-1", name: "DEC Program" },
      ] as never);
      vi.mocked(prisma.cohort.findMany).mockResolvedValue([
        { id: "cohort-1", name: "Cohort A", program: { name: "DEC Program" } },
      ] as never);
      vi.mocked(prisma.organization.findMany).mockResolvedValue([
        { id: "org-1", name: "CSO One" },
      ] as never);
      vi.mocked(prisma.course.findMany).mockResolvedValue([
        {
          id: "course-1",
          organization: { name: "CSO One" },
          title: "MEAL Basics",
        },
      ] as never);
      vi.mocked(prisma.learnerVerifiedAchievement.groupBy).mockResolvedValue([
        { capacityArea: "MEAL", _count: { id: 2 } },
        { capacityArea: "", _count: { id: 1 } },
      ] as never);

      await expect(getAdminMonitoringFilterOptions()).resolves.toEqual({
        capacityAreas: ["MEAL"],
        cohorts: [
          {
            id: "cohort-1",
            name: "Cohort A",
            programName: "DEC Program",
          },
        ],
        courses: [
          {
            id: "course-1",
            organizationName: "CSO One",
            title: "MEAL Basics",
          },
        ],
        organizations: [{ id: "org-1", name: "CSO One" }],
        programs: [{ code: "DEC", id: "program-1", name: "DEC Program" }],
      });
      expect(prisma.program.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
        select: {
          code: true,
          id: true,
          name: true,
        },
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        orderBy: { title: "asc" },
        select: {
          id: true,
          organization: {
            select: {
              name: true,
            },
          },
          title: true,
        },
      });
    });
  });

  describe("getMonthlyMonitoringTrends", () => {
    it("returns 6 monthly points with accumulated counts", async () => {
      vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(5);
      vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(3);

      const trends = await getMonthlyMonitoringTrends();

      expect(trends).toHaveLength(6);
      expect(trends[0]).toEqual(
        expect.objectContaining({
          monthLabel: expect.any(String),
          certificates: 5,
          achievements: 3,
        }),
      );
      expect(prisma.learnerCertificate.count).toHaveBeenCalledTimes(6);
      expect(prisma.learnerVerifiedAchievement.count).toHaveBeenCalledTimes(6);
    });
  });

  describe("getCoursePerformanceSignals", () => {
    it("computes zero-safe rates for active courses", async () => {
      vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([
        {
          id: "cv1",
          courseId: "c1",
          course: {
            title: "Zero Stats Course",
            organization: { name: "Test Org" },
          },
          _count: {
            learnerEnrollments: 0,
            certificates: 0,
            verifiedAchievements: 0,
          },
        },
        {
          id: "cv2",
          courseId: "c2",
          course: {
            title: "Active Course",
            organization: { name: "Test Org" },
          },
          _count: {
            learnerEnrollments: 100,
            certificates: 30,
            verifiedAchievements: 15,
          },
        },
      ] as never);

      vi.mocked(prisma.user.count)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(50);

      const signals = await getCoursePerformanceSignals();

      expect(signals).toHaveLength(2);
      expect(signals[0]).toEqual({
        courseId: "c1",
        courseTitle: "Zero Stats Course",
        organizationName: "Test Org",
        totalEnrolled: 0,
        startedLearners: 0,
        certificates: 0,
        verifiedAchievements: 0,
        startRate: 0,
        completionRate: 0,
        proofRate: 0,
      });

      expect(signals[1]).toEqual({
        courseId: "c2",
        courseTitle: "Active Course",
        organizationName: "Test Org",
        totalEnrolled: 100,
        startedLearners: 50,
        certificates: 30,
        verifiedAchievements: 15,
        startRate: 50,
        completionRate: 60,
        proofRate: 30,
      });
    });
  });
});

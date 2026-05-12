import {
  CourseVersionStatus,
  LearnerInvitationStatus,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminDashboardQueues } from "./dashboard";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    courseVersion: { findMany: vi.fn() },
    diagnosisRecord: { findMany: vi.fn() },
    learnerPracticalProofSubmission: { findMany: vi.fn() },
    learnerInvitation: { findMany: vi.fn() },
    learnerEnrollment: { findMany: vi.fn() },
  },
}));

describe("Admin dashboard queues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries all relevant models with take: 5 and ordering", async () => {
    // Simple mock responses that return empty lists
    vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([]);
    vi.mocked(prisma.diagnosisRecord.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([]);

    await getAdminDashboardQueues();

    // 1. Pending Course Reviews
    expect(prisma.courseVersion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: CourseVersionStatus.SUBMITTED },
        take: 5,
        orderBy: { updatedAt: "desc" },
      })
    );

    // 2. Pending Diagnosis Records
    expect(prisma.diagnosisRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { approvalStatus: "UNDER_REVIEW" },
        take: 5,
      })
    );

    // 3. Active Invitations
    expect(prisma.learnerInvitation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: {
            in: [
              LearnerInvitationStatus.SENT,
              LearnerInvitationStatus.PENDING_ACCEPTANCE,
            ],
          },
        },
        take: 5,
      })
    );
  });

  it("uses explicit select structures to enforce data minimization", async () => {
    vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([]);
    vi.mocked(prisma.diagnosisRecord.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([]);

    await getAdminDashboardQueues();

    // Validate explicit select mapping on at least one representative model
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callArg = vi.mocked(prisma.courseVersion.findMany).mock.calls[0][0] as any;
    expect(callArg.select).toBeDefined();
    expect(callArg.include).toBeUndefined();
    expect(callArg.select.id).toBe(true);
    expect(callArg.select.courseId).toBe(true);
    expect(callArg.select.course).toEqual({ select: { title: true } });
  });

  it("maps and slices combined access issues properly", async () => {
    const now = new Date();
    const dateEarlier = new Date(now.getTime() - 10000);

    vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([]);
    vi.mocked(prisma.diagnosisRecord.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([]); // Active empty

    // Mocking for access issues
    vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([
      {
        id: "enrollment-1",
        organizationId: "org-a",
        courseId: "c-1",
        updatedAt: dateEarlier,
        organization: { name: "Org A" },
        course: { title: "Course A" },
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);

    vi.mocked(prisma.learnerInvitation.findMany)
      .mockResolvedValueOnce([]) // First call: active invitations
      .mockResolvedValueOnce([
        {
          id: "invite-1",
          updatedAt: now, // Newer
          organization: { name: "Org B" },
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any); // Second call: expired invitations

    const result = await getAdminDashboardQueues();

    // Should contain 2 items total, sorted by date (Newer invitation first)
    expect(result.accessIssues).toHaveLength(2);
    expect(result.accessIssues[0].id).toBe("invite-1");
    expect(result.accessIssues[0].href).toBe("/admin/learner-invitations");

    expect(result.accessIssues[1].id).toBe("enrollment-1");
    // Verify constructed detailed URL for enrollment tracking
    expect(result.accessIssues[1].href).toContain("courseId=c-1");
    expect(result.accessIssues[1].href).toContain("enrollmentStatus=SUSPENDED");
  });

  it("generates functional target view links for direct navigation", async () => {
    const updateTime = new Date();

    vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([
      {
        id: "v-123",
        courseId: "c-456",
        versionNumber: 2,
        updatedAt: updateTime,
        course: { title: "Test Course" },
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);

    vi.mocked(prisma.diagnosisRecord.findMany).mockResolvedValue([
      {
        id: "dr-999",
        diagnosisTitle: "Record Title",
        diagnosisCode: "DX1",
        updatedAt: updateTime,
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any);

    vi.mocked(prisma.learnerPracticalProofSubmission.findMany)
      .mockResolvedValueOnce([
        {
          id: "sub-111",
          status: "SUBMITTED",
          updatedAt: updateTime,
          courseVersion: { course: { title: "Course Title" } },
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any)
      .mockResolvedValueOnce([
        {
          id: "sub-flagged",
          specialistReviewRequired: true,
          redactionRequired: false,
          updatedAt: updateTime,
          courseVersion: { course: { title: "Course Title" } },
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);

    vi.mocked(prisma.learnerInvitation.findMany).mockResolvedValue([]);
    vi.mocked(prisma.learnerEnrollment.findMany).mockResolvedValue([]);

    const queues = await getAdminDashboardQueues();

    // Course Review link
    expect(queues.pendingCourseReviews[0].href).toBe(
      "/review/courses/c-456/versions/v-123"
    );

    // Diagnosis Record link
    expect(queues.pendingDiagnosisRecords[0].href).toBe(
      "/admin/diagnosis-records/dr-999"
    );

    // Practical proof link
    expect(queues.proofSubmissions[0].href).toBe("/review/proof/sub-111");

    // Data Safety Flag link - goes to landing page for triaging
    expect(queues.dataSafetyFlags[0].href).toBe("/admin/data-safety");
  });
});

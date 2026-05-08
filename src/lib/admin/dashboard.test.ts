import { CourseVersionStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminDashboardCounts } from "./dashboard";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    adminLookupCategory: { count: vi.fn() },
    adminLookupValue: { count: vi.fn() },
    adminFieldMetadata: { count: vi.fn() },
    diagnosisDataset: { count: vi.fn() },
    diagnosisRecord: { count: vi.fn() },
    adminAuditLog: { count: vi.fn() },
    organization: { count: vi.fn() },
    learnerCertificate: { count: vi.fn() },
    courseVersion: { count: vi.fn() },
    learnerPracticalProofSubmission: { count: vi.fn() },
    learnerVerifiedAchievement: { count: vi.fn() },
  },
}));

describe("Admin dashboard counts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects configuration, workflow, certificate, and safety counts", async () => {
    vi.mocked(prisma.adminLookupCategory.count).mockResolvedValue(2);
    vi.mocked(prisma.adminLookupValue.count).mockResolvedValue(12);
    vi.mocked(prisma.adminFieldMetadata.count).mockResolvedValue(8);
    vi.mocked(prisma.diagnosisDataset.count).mockResolvedValue(3);
    vi.mocked(prisma.diagnosisRecord.count).mockResolvedValue(7);
    vi.mocked(prisma.adminAuditLog.count).mockResolvedValue(21);
    vi.mocked(prisma.organization.count).mockResolvedValue(5);
    vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(9);
    vi.mocked(prisma.courseVersion.count)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(6);
    vi.mocked(prisma.learnerPracticalProofSubmission.count)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);
    vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(3);

    await expect(getAdminDashboardCounts()).resolves.toMatchObject({
      auditLogs: 21,
      certificates: 9,
      coursesApprovedForPublish: 1,
      coursesPublished: 6,
      coursesSubmittedForReview: 4,
      diagnosisDatasets: 3,
      diagnosisRecords: 7,
      externallyVisibleAchievements: 3,
      fieldMetadata: 8,
      lookupCategories: 2,
      lookupValues: 12,
      organizations: 5,
      proofsUnderReview: 2,
      specialistFlags: 1,
    });

    expect(prisma.courseVersion.count).toHaveBeenCalledWith({
      where: { status: CourseVersionStatus.SUBMITTED },
    });
    expect(prisma.courseVersion.count).toHaveBeenCalledWith({
      where: { status: CourseVersionStatus.APPROVED },
    });
    expect(prisma.courseVersion.count).toHaveBeenCalledWith({
      where: { status: CourseVersionStatus.PUBLISHED },
    });
    expect(prisma.learnerPracticalProofSubmission.count).toHaveBeenCalledWith({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
      },
    });
  });
});

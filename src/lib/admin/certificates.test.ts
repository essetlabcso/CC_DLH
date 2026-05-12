import { CertificateStatusEventType, Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminCertificateOverview } from "./certificates";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    learnerCertificate: {
      findMany: vi.fn(),
    },
  },
}));

describe("getAdminCertificateOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps certificate records and status history for Admin oversight", async () => {
    const issuedAt = new Date("2026-05-01T12:00:00.000Z");
    const revokedAt = new Date("2026-05-02T12:00:00.000Z");
    const eventAt = new Date("2026-05-02T12:05:00.000Z");
    vi.mocked(prisma.learnerCertificate.findMany).mockResolvedValue([
      {
        certificateNumber: "DEC-CERT-123",
        id: "cert-1",
        issuedAt,
        revokedAt,
        user: {
          email: "learner@example.org",
          name: "Learner One",
        },
        courseVersion: {
          versionNumber: 2,
          course: {
            id: "course-1",
            organization: {
              name: "CSO A",
            },
            title: "Outcome Evidence",
          },
        },
        statusEvents: [
          {
            actor: {
              name: "Admin User",
            },
            createdAt: eventAt,
            eventType: CertificateStatusEventType.REVOKED,
            id: "event-1",
            note: "Duplicate certificate issued.",
          },
        ],
      },
    ] as never);

    await expect(getAdminCertificateOverview("org-1")).resolves.toEqual({
      certificates: [
        {
          certificateNumber: "DEC-CERT-123",
          courseId: "course-1",
          courseTitle: "Outcome Evidence",
          courseVersionNumber: 2,
          id: "cert-1",
          issuedAt,
          learnerEmail: "learner@example.org",
          learnerName: "Learner One",
          organizationName: "CSO A",
          revokedAt,
          statusEvents: [
            {
              actorName: "Admin User",
              createdAt: eventAt,
              eventType: CertificateStatusEventType.REVOKED,
              id: "event-1",
              note: "Duplicate certificate issued.",
            },
          ],
        },
      ],
      totals: {
        active: 0,
        revoked: 1,
        total: 1,
      },
    });
  });

  it("uses safe explicit selects without final test, answer, proof, or badge data", async () => {
    vi.mocked(prisma.learnerCertificate.findMany).mockResolvedValue([] as never);

    await getAdminCertificateOverview("org-1");

    expect(prisma.learnerCertificate.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          courseVersion: {
            course: {
              organizationId: "org-1",
            },
          },
        },
      }),
    );

    const select =
      vi.mocked(prisma.learnerCertificate.findMany).mock.calls[0][0]?.select;
    expect(select).not.toHaveProperty("finalTestAttempts");
    expect(select).not.toHaveProperty("lessonProgress");
    expect(select).not.toHaveProperty("practicalProofSubmissions");
    expect(select).not.toHaveProperty("verifiedAchievements");
    expect(select).not.toHaveProperty("proofSubmission");
    expect(select).not.toHaveProperty("rawProof");
    expect(select).not.toHaveProperty("score");

    const courseVersionSelect = (
      select?.courseVersion as
        | {
            select?: Record<string, unknown>;
          }
        | undefined
    )?.select;
    expect(courseVersionSelect).not.toHaveProperty("finalTestAttempts");
    expect(courseVersionSelect).not.toHaveProperty("practicalProofSubmissions");
    expect(courseVersionSelect).not.toHaveProperty("verifiedAchievements");
    expect(courseVersionSelect).not.toHaveProperty("modules");
  });

  it("applies query, status, and courseId filters safely", async () => {
    vi.mocked(prisma.learnerCertificate.findMany).mockResolvedValue([] as never);

    await getAdminCertificateOverview("org-1", {
      query: "test",
      status: "ACTIVE",
      courseId: "course-123",
    });

    const where =
      vi.mocked(prisma.learnerCertificate.findMany).mock.calls[0][0]?.where as Prisma.LearnerCertificateWhereInput;

    const courseWhere = where.courseVersion as Prisma.CourseVersionWhereInput;
    const courseInnerWhere = courseWhere.course as Prisma.CourseWhereInput;

    expect(courseInnerWhere.organizationId).toBe("org-1");
    expect(courseInnerWhere.id).toBe("course-123");
    expect(where.revokedAt).toBeNull();
    expect(where.OR).toEqual([
      { certificateNumber: { contains: "test" } },
      { user: { name: { contains: "test" } } },
      { user: { email: { contains: "test" } } },
    ]);
  });
});

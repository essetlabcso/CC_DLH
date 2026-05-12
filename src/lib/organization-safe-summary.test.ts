/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";
import { getOrganizationSafeSummary } from "./organization-safe-summary";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    organization: { findUnique: vi.fn() },
    organizationMembership: { count: vi.fn() },
    user: { findMany: vi.fn() },
    learnerEnrollment: { count: vi.fn(), groupBy: vi.fn() },
    learnerVerifiedAchievement: { count: vi.fn(), findMany: vi.fn() },
    learnerCertificate: { count: vi.fn() },
    learnerPracticalProofSubmission: { findMany: vi.fn() },
  },
}));

describe("Organization Safe Summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null if organization does not exist", async () => {
    vi.mocked(prisma.organization.findUnique).mockResolvedValue(null);
    const result = await getOrganizationSafeSummary("missing-org");
    expect(result).toBeNull();
  });

  it("compiles accurate summary and avoids exposing raw proof content", async () => {
    vi.mocked(prisma.organization.findUnique).mockResolvedValue({
      name: "Save the Rainforest",
    } as any);

    // Mock aggregate counts in the correct resolution sequence
    vi.mocked(prisma.organizationMembership.count).mockResolvedValue(5);
    
    vi.mocked(prisma.learnerEnrollment.count)
      .mockResolvedValueOnce(20) // Total
      .mockResolvedValueOnce(12); // Completed
      
    vi.mocked(prisma.learnerVerifiedAchievement.count).mockResolvedValue(3);
    vi.mocked(prisma.learnerCertificate.count).mockResolvedValue(15);

    // Mock grouped & nested data
    vi.mocked(prisma.learnerPracticalProofSubmission.findMany).mockResolvedValue([
      { userId: "u1", status: "ACCEPTED", updatedAt: new Date("2024-01-05") },
      { userId: "u1", status: "SUBMITTED", updatedAt: new Date("2024-01-01") },
      { userId: "u2", status: "ESCALATED", updatedAt: new Date("2024-01-02") },
      { userId: "u3", status: "REVISION_REQUESTED", updatedAt: new Date("2024-01-02") },
    ] as any);

    vi.mocked(prisma.learnerVerifiedAchievement.findMany).mockResolvedValue([
      { capacityArea: "Environmental Policy" },
      { capacityArea: "Public Safety" },
    ] as any);

    vi.mocked(prisma.user.findMany).mockResolvedValue([
      {
        id: "u1",
        name: "Alice",
        _count: { learnerEnrollments: 5, certificates: 2 },
      },
      {
        id: "u2",
        name: "Bob",
        _count: { learnerEnrollments: 2, certificates: 1 },
      },
    ] as any);

    vi.mocked(prisma.learnerEnrollment.groupBy).mockResolvedValue([
      { userId: "u1", _count: { _all: 4 } },
      { userId: "u2", _count: { _all: 1 } },
    ] as any);

    const result = await getOrganizationSafeSummary("org-valid");

    expect(result).not.toBeNull();
    expect(result?.organizationName).toBe("Save the Rainforest");
    
    // Verify math
    expect(result?.completionRatePercent).toBe(60); // (12 / 20) * 100
    
    // Verify overall counts mapping
    expect(result?.activeMemberCount).toBe(5);
    expect(result?.totalEnrollments).toBe(20);
    expect(result?.completedEnrollments).toBe(12);
    expect(result?.certificatesIssued).toBe(15);
    
    // Verify pipeline map correctness
    expect(result?.evidencePipeline).toEqual({
      submittedCount: 1,
      underReviewCount: 1, // "ESCALATED" belongs here
      revisionRequestedCount: 1,
      acceptedCount: 1,
      rejectedCount: 0,
    });

    // Verify Capacity areas filter logic
    expect(result?.capacityAreasCovered).toContain("Environmental Policy");
    expect(result?.capacityAreasCovered).toContain("Public Safety");

    // Verify staff roster composition logic
    expect(result?.staffRoster).toHaveLength(2);
    
    const alice = result?.staffRoster.find((s) => s.userName === "Alice");
    expect(alice).toBeDefined();
    expect(alice?.completedCoursesCount).toBe(4);
    expect(alice?.enrolledCoursesCount).toBe(5);
    expect(alice?.certificatesCount).toBe(2);
    
    // Ensure it correctly selected the LATEST status for User 1 (ACCEPTED vs SUBMITTED)
    expect(alice?.practicalProofStatus).toBe("ACCEPTED");

    // STRICT SAFETY CHECKS
    expect(alice).not.toHaveProperty("userEmail");
    expect(alice).not.toHaveProperty("proofText");
    expect(alice).not.toHaveProperty("evidenceLink");
  });
});

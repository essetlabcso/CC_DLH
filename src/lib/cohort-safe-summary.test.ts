/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LearnerParticipantStatus } from "@prisma/client";

import { prisma } from "@/lib/db/client";
import { getCohortSafeSummary } from "./cohort-safe-summary";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    cohort: { findUnique: vi.fn() },
    cohortCourse: { findMany: vi.fn() },
    cohortParticipant: { findMany: vi.fn() },
    learnerEnrollment: { groupBy: vi.fn() },
  },
}));

describe("Cohort Safe Summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null if cohort does not exist", async () => {
    vi.mocked(prisma.cohort.findUnique).mockResolvedValue(null);
    const result = await getCohortSafeSummary("missing-cohort");
    expect(result).toBeNull();
  });

  it("safely compiles cohort metrics and roster", async () => {
    const mockNow = new Date("2026-06-01T12:00:00Z");

    vi.mocked(prisma.cohort.findUnique).mockResolvedValue({
      name: "Global Leadership 2026",
    } as any);

    vi.mocked(prisma.cohortCourse.findMany).mockResolvedValue([
      { courseId: "c1" },
      { courseId: "c2" },
      { courseId: "c3" },
    ] as any);

    const overdueDate = new Date("2026-05-15T12:00:00Z");
    const futureDate = new Date("2026-07-15T12:00:00Z");

    vi.mocked(prisma.cohortParticipant.findMany).mockResolvedValue([
      {
        userId: "u1",
        status: LearnerParticipantStatus.ACTIVE,
        dueAt: futureDate,
        user: { id: "u1", name: "Alice Archer" },
      },
      {
        userId: "u2",
        status: LearnerParticipantStatus.ACTIVE,
        dueAt: overdueDate,
        user: { id: "u2", name: "Bob Baker" },
      },
      {
        userId: "u3",
        status: LearnerParticipantStatus.COMPLETED,
        dueAt: overdueDate, // Even if date is past, COMPLETED status should be NONE
        user: { id: "u3", name: "Charlie Case" },
      },
    ] as any);

    vi.mocked(prisma.learnerEnrollment.groupBy).mockResolvedValue([
      { userId: "u1", _count: { courseId: 2 } },
      { userId: "u3", _count: { courseId: 3 } },
      // User 2 has no completions recorded in groupby
    ] as any);

    const result = await getCohortSafeSummary("cohort-123", mockNow);

    expect(result).not.toBeNull();
    expect(result?.cohortName).toBe("Global Leadership 2026");
    expect(result?.totalCourseCount).toBe(3);
    expect(result?.totalParticipantsCount).toBe(3);
    expect(result?.activeParticipantsCount).toBe(2); // u1, u2
    expect(result?.completedParticipantsCount).toBe(1); // u3

    expect(result?.roster).toHaveLength(3);

    // Alice: Active, Not Overdue, 2 courses
    const alice = result?.roster.find((r) => r.userName === "Alice Archer");
    expect(alice).toBeDefined();
    expect(alice?.completedCourseCount).toBe(2);
    expect(alice?.supportIndicator).toBe("NONE");

    // Bob: Active, Overdue, 0 courses
    const bob = result?.roster.find((r) => r.userName === "Bob Baker");
    expect(bob).toBeDefined();
    expect(bob?.completedCourseCount).toBe(0);
    expect(bob?.supportIndicator).toBe("OVERDUE");

    // Charlie: Completed, Overdue date ignored, 3 courses
    const charlie = result?.roster.find((r) => r.userName === "Charlie Case");
    expect(charlie).toBeDefined();
    expect(charlie?.completedCourseCount).toBe(3);
    expect(charlie?.supportIndicator).toBe("NONE");
  });
});

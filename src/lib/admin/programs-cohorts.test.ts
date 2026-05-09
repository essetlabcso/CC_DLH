import { ProgramStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import { getAdminProgramsCohortsOverview } from "./programs-cohorts";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    program: {
      findMany: vi.fn(),
    },
    cohort: {
      findMany: vi.fn(),
    },
    cohortCourse: {
      count: vi.fn(),
    },
  },
}));

describe("Admin programs and cohorts overview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps read-only program and cohort summaries from existing models", async () => {
    const startsAt = new Date("2026-01-01T00:00:00.000Z");
    const endsAt = new Date("2026-12-31T00:00:00.000Z");

    vi.mocked(prisma.program.findMany).mockResolvedValue([
      {
        id: "program-1",
        name: "DEC Core",
        code: "DEC-CORE",
        status: ProgramStatus.ACTIVE,
        startsAt,
        endsAt,
        ownerOrganization: { name: "DEC" },
        _count: {
          organizations: 3,
          cohorts: 2,
        },
      },
      {
        id: "program-2",
        name: "Future Program",
        code: null,
        status: ProgramStatus.DRAFT,
        startsAt: null,
        endsAt: null,
        ownerOrganization: null,
        _count: {
          organizations: 0,
          cohorts: 0,
        },
      },
    ] as never);
    vi.mocked(prisma.cohort.findMany).mockResolvedValue([
      {
        id: "cohort-1",
        name: "Cohort A",
        status: "ACTIVE",
        startsAt,
        endsAt: null,
        program: { name: "DEC Core" },
        organization: { name: "CSO One" },
        _count: {
          courses: 4,
        },
      },
    ] as never);
    vi.mocked(prisma.cohortCourse.count).mockResolvedValue(4);

    await expect(getAdminProgramsCohortsOverview()).resolves.toEqual({
      programs: [
        {
          id: "program-1",
          name: "DEC Core",
          code: "DEC-CORE",
          status: ProgramStatus.ACTIVE,
          ownerOrganizationName: "DEC",
          participantOrganizationCount: 3,
          cohortCount: 2,
          startsAt,
          endsAt,
        },
        {
          id: "program-2",
          name: "Future Program",
          code: null,
          status: ProgramStatus.DRAFT,
          ownerOrganizationName: null,
          participantOrganizationCount: 0,
          cohortCount: 0,
          startsAt: null,
          endsAt: null,
        },
      ],
      cohorts: [
        {
          id: "cohort-1",
          name: "Cohort A",
          status: "ACTIVE",
          programName: "DEC Core",
          organizationName: "CSO One",
          linkedCourseCount: 4,
          startsAt,
          endsAt: null,
        },
      ],
      totals: {
        programs: 2,
        activePrograms: 1,
        cohorts: 1,
        linkedCourses: 4,
      },
    });
  });

  it("uses summary-only selects for the read-only overview", async () => {
    vi.mocked(prisma.program.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.cohort.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.cohortCourse.count).mockResolvedValue(0);

    await getAdminProgramsCohortsOverview();

    expect(prisma.program.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          ownerOrganization: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              organizations: true,
              cohorts: true,
            },
          },
        }),
      }),
    );
    expect(prisma.cohort.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          program: {
            select: {
              name: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              courses: true,
            },
          },
        }),
      }),
    );
  });
});

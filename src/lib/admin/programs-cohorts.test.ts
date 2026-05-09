import { CourseVersionStatus, ProgramStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import {
  getAdminCohortDetail,
  getAdminProgramDetail,
  getAdminProgramsCohortsOverview,
} from "./programs-cohorts";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    program: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    cohort: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
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

  it("maps a read-only program detail with summary counts", async () => {
    const startsAt = new Date("2026-01-01T00:00:00.000Z");
    const joinedAt = new Date("2026-02-01T00:00:00.000Z");

    vi.mocked(prisma.program.findUnique).mockResolvedValue({
      id: "program-1",
      name: "DEC Core",
      slug: "dec-core",
      code: "DEC-CORE",
      description: "Core capacity program",
      status: ProgramStatus.ACTIVE,
      startsAt,
      endsAt: null,
      ownerOrganization: {
        id: "org-owner",
        name: "DEC",
      },
      organizations: [
        {
          id: "link-1",
          status: "ACTIVE",
          joinedAt,
          endedAt: null,
          notes: "Pilot partner",
          organization: {
            id: "org-1",
            name: "CSO One",
          },
        },
        {
          id: "link-2",
          status: "PAUSED",
          joinedAt,
          endedAt: null,
          notes: "",
          organization: {
            id: "org-2",
            name: "CSO Two",
          },
        },
      ],
      cohorts: [
        {
          id: "cohort-1",
          name: "Cohort A",
          status: "ACTIVE",
          startsAt,
          endsAt: null,
          organization: {
            name: "CSO One",
          },
          _count: {
            courses: 3,
          },
        },
        {
          id: "cohort-2",
          name: "Cohort B",
          status: "COMPLETED",
          startsAt: null,
          endsAt: null,
          organization: null,
          _count: {
            courses: 1,
          },
        },
      ],
    } as never);

    await expect(getAdminProgramDetail("program-1")).resolves.toEqual({
      id: "program-1",
      name: "DEC Core",
      slug: "dec-core",
      code: "DEC-CORE",
      description: "Core capacity program",
      status: ProgramStatus.ACTIVE,
      startsAt,
      endsAt: null,
      ownerOrganization: {
        id: "org-owner",
        name: "DEC",
      },
      participantOrganizations: [
        {
          id: "org-1",
          name: "CSO One",
          status: "ACTIVE",
          joinedAt,
          endedAt: null,
          notes: "Pilot partner",
        },
        {
          id: "org-2",
          name: "CSO Two",
          status: "PAUSED",
          joinedAt,
          endedAt: null,
          notes: "",
        },
      ],
      cohorts: [
        {
          id: "cohort-1",
          name: "Cohort A",
          status: "ACTIVE",
          organizationName: "CSO One",
          startsAt,
          endsAt: null,
          linkedCourseCount: 3,
        },
        {
          id: "cohort-2",
          name: "Cohort B",
          status: "COMPLETED",
          organizationName: null,
          startsAt: null,
          endsAt: null,
          linkedCourseCount: 1,
        },
      ],
      totals: {
        participantOrganizations: 2,
        activeParticipantOrganizations: 1,
        cohorts: 2,
        activeCohorts: 1,
        linkedCourses: 4,
      },
    });
  });

  it("maps a read-only cohort detail with course summary counts", async () => {
    const startsAt = new Date("2026-01-01T00:00:00.000Z");
    const dueAt = new Date("2026-03-01T00:00:00.000Z");

    vi.mocked(prisma.cohort.findUnique).mockResolvedValue({
      id: "cohort-1",
      name: "Cohort A",
      slug: "cohort-a",
      status: "ACTIVE",
      startsAt,
      endsAt: null,
      deliveryNotes: "Blended delivery",
      program: {
        id: "program-1",
        name: "DEC Core",
        code: "DEC-CORE",
        status: "ACTIVE",
      },
      organization: {
        id: "org-1",
        name: "CSO One",
      },
      courses: [
        {
          id: "cohort-course-1",
          required: true,
          startsAt,
          dueAt,
          displayOrder: 1,
          course: {
            id: "course-1",
            title: "Budget Basics",
            organization: {
              name: "CSO One",
            },
          },
          courseVersion: {
            id: "version-1",
            versionNumber: 2,
            status: CourseVersionStatus.PUBLISHED,
          },
        },
        {
          id: "cohort-course-2",
          required: false,
          startsAt: null,
          dueAt: null,
          displayOrder: 2,
          course: {
            id: "course-2",
            title: "Monitoring Basics",
            organization: {
              name: "CSO Two",
            },
          },
          courseVersion: {
            id: "version-2",
            versionNumber: 1,
            status: CourseVersionStatus.APPROVED,
          },
        },
      ],
    } as never);

    await expect(getAdminCohortDetail("cohort-1")).resolves.toEqual({
      id: "cohort-1",
      name: "Cohort A",
      slug: "cohort-a",
      status: "ACTIVE",
      startsAt,
      endsAt: null,
      deliveryNotes: "Blended delivery",
      program: {
        id: "program-1",
        name: "DEC Core",
        code: "DEC-CORE",
        status: "ACTIVE",
      },
      organization: {
        id: "org-1",
        name: "CSO One",
      },
      linkedCourses: [
        {
          id: "cohort-course-1",
          courseId: "course-1",
          courseTitle: "Budget Basics",
          courseOrganizationName: "CSO One",
          courseVersionId: "version-1",
          versionNumber: 2,
          versionStatus: CourseVersionStatus.PUBLISHED,
          required: true,
          startsAt,
          dueAt,
          displayOrder: 1,
        },
        {
          id: "cohort-course-2",
          courseId: "course-2",
          courseTitle: "Monitoring Basics",
          courseOrganizationName: "CSO Two",
          courseVersionId: "version-2",
          versionNumber: 1,
          versionStatus: CourseVersionStatus.APPROVED,
          required: false,
          startsAt: null,
          dueAt: null,
          displayOrder: 2,
        },
      ],
      totals: {
        linkedCourses: 2,
        requiredCourses: 1,
        optionalCourses: 1,
        publishedCourseVersions: 1,
      },
    });
  });

  it("uses summary-only selects for detail drilldowns", async () => {
    vi.mocked(prisma.program.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.cohort.findUnique).mockResolvedValue(null);

    await expect(getAdminProgramDetail("missing-program")).resolves.toBeNull();
    await expect(getAdminCohortDetail("missing-cohort")).resolves.toBeNull();

    expect(prisma.program.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          ownerOrganization: { select: { id: true, name: true } },
          organizations: expect.objectContaining({
            select: expect.objectContaining({
              organization: { select: { id: true, name: true } },
            }),
          }),
          cohorts: expect.objectContaining({
            select: expect.objectContaining({
              organization: { select: { name: true } },
              _count: { select: { courses: true } },
            }),
          }),
        }),
        where: { id: "missing-program" },
      }),
    );
    expect(prisma.cohort.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          program: {
            select: { id: true, name: true, code: true, status: true },
          },
          organization: { select: { id: true, name: true } },
          courses: expect.objectContaining({
            select: expect.objectContaining({
              course: expect.objectContaining({
                select: expect.objectContaining({
                  organization: { select: { name: true } },
                }),
              }),
              courseVersion: {
                select: { id: true, versionNumber: true, status: true },
              },
            }),
          }),
        }),
        where: { id: "missing-cohort" },
      }),
    );
  });
});

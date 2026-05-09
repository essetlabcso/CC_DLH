import { ProgramStatus } from "@prisma/client";

import { prisma } from "@/lib/db/client";

export type AdminProgramSummary = {
  id: string;
  name: string;
  code: string | null;
  status: string;
  ownerOrganizationName: string | null;
  participantOrganizationCount: number;
  cohortCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
};

export type AdminCohortSummary = {
  id: string;
  name: string;
  status: string;
  programName: string | null;
  organizationName: string | null;
  linkedCourseCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
};

export type AdminProgramsCohortsOverview = {
  programs: AdminProgramSummary[];
  cohorts: AdminCohortSummary[];
  totals: {
    programs: number;
    activePrograms: number;
    cohorts: number;
    linkedCourses: number;
  };
};

export async function getAdminProgramsCohortsOverview(): Promise<AdminProgramsCohortsOverview> {
  const [programs, cohorts, linkedCourses] = await Promise.all([
    prisma.program.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
        startsAt: true,
        endsAt: true,
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
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    }),
    prisma.cohort.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        startsAt: true,
        endsAt: true,
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
      },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    }),
    prisma.cohortCourse.count(),
  ]);

  return {
    programs: programs.map((program) => ({
      id: program.id,
      name: program.name,
      code: program.code,
      status: program.status,
      ownerOrganizationName: program.ownerOrganization?.name ?? null,
      participantOrganizationCount: program._count.organizations,
      cohortCount: program._count.cohorts,
      startsAt: program.startsAt,
      endsAt: program.endsAt,
    })),
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      status: cohort.status,
      programName: cohort.program?.name ?? null,
      organizationName: cohort.organization?.name ?? null,
      linkedCourseCount: cohort._count.courses,
      startsAt: cohort.startsAt,
      endsAt: cohort.endsAt,
    })),
    totals: {
      programs: programs.length,
      activePrograms: programs.filter(
        (program) => program.status === ProgramStatus.ACTIVE,
      ).length,
      cohorts: cohorts.length,
      linkedCourses,
    },
  };
}

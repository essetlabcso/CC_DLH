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

export type AdminProgramDetail = {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  description: string;
  status: string;
  startsAt: Date | null;
  endsAt: Date | null;
  ownerOrganization: {
    id: string;
    name: string;
  } | null;
  participantOrganizations: {
    id: string;
    name: string;
    status: string;
    joinedAt: Date;
    endedAt: Date | null;
    notes: string;
  }[];
  cohorts: {
    id: string;
    name: string;
    status: string;
    organizationName: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    linkedCourseCount: number;
  }[];
  totals: {
    participantOrganizations: number;
    activeParticipantOrganizations: number;
    cohorts: number;
    activeCohorts: number;
    linkedCourses: number;
  };
};

export type AdminCohortDetail = {
  id: string;
  name: string;
  slug: string;
  status: string;
  startsAt: Date | null;
  endsAt: Date | null;
  deliveryNotes: string;
  program: {
    id: string;
    name: string;
    code: string | null;
    status: string;
  } | null;
  organization: {
    id: string;
    name: string;
  } | null;
  linkedCourses: {
    id: string;
    courseId: string;
    courseTitle: string;
    courseOrganizationName: string;
    courseVersionId: string;
    versionNumber: number;
    versionStatus: string;
    required: boolean;
    startsAt: Date | null;
    dueAt: Date | null;
    displayOrder: number;
  }[];
  totals: {
    linkedCourses: number;
    requiredCourses: number;
    optionalCourses: number;
    publishedCourseVersions: number;
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

export async function getAdminProgramDetail(
  programId: string,
): Promise<AdminProgramDetail | null> {
  const program = await prisma.program.findUnique({
    select: {
      id: true,
      name: true,
      slug: true,
      code: true,
      description: true,
      status: true,
      startsAt: true,
      endsAt: true,
      ownerOrganization: {
        select: {
          id: true,
          name: true,
        },
      },
      organizations: {
        select: {
          id: true,
          status: true,
          joinedAt: true,
          endedAt: true,
          notes: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ status: "asc" }, { joinedAt: "desc" }],
      },
      cohorts: {
        select: {
          id: true,
          name: true,
          status: true,
          startsAt: true,
          endsAt: true,
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
      },
    },
    where: { id: programId },
  });

  if (!program) {
    return null;
  }

  const participantOrganizations = program.organizations.map(
    (participant) => ({
      id: participant.organization.id,
      name: participant.organization.name,
      status: participant.status,
      joinedAt: participant.joinedAt,
      endedAt: participant.endedAt,
      notes: participant.notes,
    }),
  );
  const cohorts = program.cohorts.map((cohort) => ({
    id: cohort.id,
    name: cohort.name,
    status: cohort.status,
    organizationName: cohort.organization?.name ?? null,
    startsAt: cohort.startsAt,
    endsAt: cohort.endsAt,
    linkedCourseCount: cohort._count.courses,
  }));

  return {
    id: program.id,
    name: program.name,
    slug: program.slug,
    code: program.code,
    description: program.description,
    status: program.status,
    startsAt: program.startsAt,
    endsAt: program.endsAt,
    ownerOrganization: program.ownerOrganization,
    participantOrganizations,
    cohorts,
    totals: {
      participantOrganizations: participantOrganizations.length,
      activeParticipantOrganizations: participantOrganizations.filter(
        (organization) => organization.status === "ACTIVE",
      ).length,
      cohorts: cohorts.length,
      activeCohorts: cohorts.filter((cohort) => cohort.status === "ACTIVE")
        .length,
      linkedCourses: cohorts.reduce(
        (total, cohort) => total + cohort.linkedCourseCount,
        0,
      ),
    },
  };
}

export async function getAdminCohortDetail(
  cohortId: string,
): Promise<AdminCohortDetail | null> {
  const cohort = await prisma.cohort.findUnique({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      startsAt: true,
      endsAt: true,
      deliveryNotes: true,
      program: {
        select: {
          id: true,
          name: true,
          code: true,
          status: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      courses: {
        select: {
          id: true,
          required: true,
          startsAt: true,
          dueAt: true,
          displayOrder: true,
          course: {
            select: {
              id: true,
              title: true,
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
          courseVersion: {
            select: {
              id: true,
              versionNumber: true,
              status: true,
            },
          },
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
    },
    where: { id: cohortId },
  });

  if (!cohort) {
    return null;
  }

  const linkedCourses = cohort.courses.map((courseLink) => ({
    id: courseLink.id,
    courseId: courseLink.course.id,
    courseTitle: courseLink.course.title,
    courseOrganizationName: courseLink.course.organization.name,
    courseVersionId: courseLink.courseVersion.id,
    versionNumber: courseLink.courseVersion.versionNumber,
    versionStatus: courseLink.courseVersion.status,
    required: courseLink.required,
    startsAt: courseLink.startsAt,
    dueAt: courseLink.dueAt,
    displayOrder: courseLink.displayOrder,
  }));

  return {
    id: cohort.id,
    name: cohort.name,
    slug: cohort.slug,
    status: cohort.status,
    startsAt: cohort.startsAt,
    endsAt: cohort.endsAt,
    deliveryNotes: cohort.deliveryNotes,
    program: cohort.program,
    organization: cohort.organization,
    linkedCourses,
    totals: {
      linkedCourses: linkedCourses.length,
      requiredCourses: linkedCourses.filter((course) => course.required).length,
      optionalCourses: linkedCourses.filter((course) => !course.required).length,
      publishedCourseVersions: linkedCourses.filter(
        (course) => course.versionStatus === "PUBLISHED",
      ).length,
    },
  };
}

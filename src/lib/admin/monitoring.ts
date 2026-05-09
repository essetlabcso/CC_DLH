import { prisma } from "@/lib/db/client";

export type AdminMonitoringFilters = {
  capacityArea?: string;
  cohortId?: string;
  courseId?: string;
  organizationId?: string;
  programId?: string;
};

export type AdminMonitoringCounts = {
  totalLearners: number;
  totalCertificates: number;
  proofsUnderReview: number;
  totalVerifiedAchievements: number;
};

export type AdminMonitoringFilterOptions = {
  capacityAreas: string[];
  cohorts: {
    id: string;
    name: string;
    programName: string | null;
  }[];
  courses: {
    id: string;
    title: string;
    organizationName: string;
  }[];
  organizations: {
    id: string;
    name: string;
  }[];
  programs: {
    id: string;
    name: string;
    code: string | null;
  }[];
};

export type CapacityAreaAchievementSummary = {
  capacityArea: string;
  count: number;
};

export type RecentVerifiedAchievement = {
  id: string;
  title: string;
  capacityArea: string;
  courseTitle: string;
  organizationName: string;
  issuedAt: Date;
};

type CourseVersionWhere = {
  cohortCourses?: {
    some: {
      cohort?: {
        programId?: string;
      };
      cohortId?: string;
    };
  };
  course?: {
    organizationId?: string;
  };
  courseId?: string;
  setup?: {
    is: {
      capacityArea: string;
    };
  };
};

type VerifiedAchievementWhere = {
  capacityArea?: string;
  courseVersion?: CourseVersionWhere;
};

export function parseAdminMonitoringFilters(
  filters: Record<string, string | undefined>,
): AdminMonitoringFilters {
  return {
    capacityArea: cleanFilterValue(filters.capacityArea),
    cohortId: cleanFilterValue(filters.cohortId),
    courseId: cleanFilterValue(filters.courseId),
    organizationId: cleanFilterValue(filters.organizationId),
    programId: cleanFilterValue(filters.programId),
  };
}

export async function getAdminMonitoringCounts(
  filters: AdminMonitoringFilters = {},
): Promise<AdminMonitoringCounts> {
  const courseVersionWhere = buildCourseVersionWhere(filters);
  const achievementWhere = buildVerifiedAchievementWhere(filters);
  const [
    totalLearners,
    totalCertificates,
    proofsUnderReview,
    totalVerifiedAchievements,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        lessonProgress: {
          some: withCourseVersionWhere(courseVersionWhere),
        },
      },
    }),
    prisma.learnerCertificate.count(
      countWhereArgs(withCourseVersionWhere(courseVersionWhere)),
    ),
    prisma.learnerPracticalProofSubmission.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
        ...withCourseVersionWhere(courseVersionWhere),
      },
    }),
    prisma.learnerVerifiedAchievement.count(countWhereArgs(achievementWhere)),
  ]);

  return {
    totalLearners,
    totalCertificates,
    proofsUnderReview,
    totalVerifiedAchievements,
  };
}

export async function getCapacityAreaAchievementSummaries(
  filters: AdminMonitoringFilters = {},
): Promise<CapacityAreaAchievementSummary[]> {
  const where = buildVerifiedAchievementWhere(filters);
  const grouped = hasKeys(where)
    ? await prisma.learnerVerifiedAchievement.groupBy({
        by: ["capacityArea"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        where,
      })
    : await prisma.learnerVerifiedAchievement.groupBy({
        by: ["capacityArea"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
      });

  return grouped.map((g) => ({
    capacityArea: g.capacityArea || "Uncategorized",
    count: g._count.id,
  }));
}

export async function getRecentVerifiedAchievements(
  filters: AdminMonitoringFilters = {},
): Promise<RecentVerifiedAchievement[]> {
  const where = buildVerifiedAchievementWhere(filters);
  const recent = await prisma.learnerVerifiedAchievement.findMany({
    orderBy: {
      issuedAt: "desc",
    },
    take: 10,
    where,
    select: {
      capacityArea: true,
      id: true,
      issuedAt: true,
      title: true,
      organization: {
        select: {
          name: true,
        },
      },
      courseVersion: {
        select: {
          course: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return recent.map((achievement) => ({
    id: achievement.id,
    title: achievement.title,
    capacityArea: achievement.capacityArea || "Uncategorized",
    courseTitle: achievement.courseVersion.course.title,
    organizationName: achievement.organization.name,
    issuedAt: achievement.issuedAt,
  }));
}

export async function getAdminMonitoringFilterOptions(): Promise<AdminMonitoringFilterOptions> {
  const [programs, cohorts, organizations, courses, capacityAreas] =
    await Promise.all([
      prisma.program.findMany({
        orderBy: { name: "asc" },
        select: {
          code: true,
          id: true,
          name: true,
        },
      }),
      prisma.cohort.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          program: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.organization.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      }),
      prisma.course.findMany({
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
      }),
      prisma.learnerVerifiedAchievement.groupBy({
        by: ["capacityArea"],
        _count: {
          id: true,
        },
        orderBy: {
          capacityArea: "asc",
        },
      }),
    ]);

  return {
    capacityAreas: capacityAreas
      .map((item) => item.capacityArea?.trim())
      .filter((value): value is string => Boolean(value)),
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      programName: cohort.program?.name ?? null,
    })),
    courses: courses.map((course) => ({
      id: course.id,
      title: course.title,
      organizationName: course.organization.name,
    })),
    organizations,
    programs,
  };
}

function buildCourseVersionWhere(
  filters: AdminMonitoringFilters,
): CourseVersionWhere {
  const where: CourseVersionWhere = {};

  if (filters.courseId) {
    where.courseId = filters.courseId;
  }

  if (filters.organizationId) {
    where.course = {
      organizationId: filters.organizationId,
    };
  }

  if (filters.cohortId || filters.programId) {
    where.cohortCourses = {
      some: {
        ...(filters.cohortId ? { cohortId: filters.cohortId } : {}),
        ...(filters.programId
          ? { cohort: { programId: filters.programId } }
          : {}),
      },
    };
  }

  if (filters.capacityArea) {
    where.setup = {
      is: {
        capacityArea: filters.capacityArea,
      },
    };
  }

  return where;
}

function buildVerifiedAchievementWhere(
  filters: AdminMonitoringFilters,
): VerifiedAchievementWhere {
  const courseVersionWhere = buildCourseVersionWhere({
    ...filters,
    capacityArea: undefined,
  });

  return {
    ...(filters.capacityArea ? { capacityArea: filters.capacityArea } : {}),
    ...withCourseVersionWhere(courseVersionWhere),
  };
}

function cleanFilterValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

function hasKeys(value: object) {
  return Object.keys(value).length > 0;
}

function withCourseVersionWhere(courseVersionWhere: CourseVersionWhere) {
  return hasKeys(courseVersionWhere)
    ? { courseVersion: courseVersionWhere }
    : {};
}

function countWhereArgs<T extends object>(where: T) {
  return hasKeys(where) ? { where } : undefined;
}

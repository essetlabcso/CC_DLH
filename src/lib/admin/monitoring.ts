import { prisma } from "@/lib/db/client";

export type AdminMonitoringFilters = {
  capacityArea?: string;
  cohortId?: string;
  courseId?: string;
  organizationId?: string;
  programId?: string;
  startDate?: string;
  endDate?: string;
};

export type AdminMonitoringCounts = {
  totalEnrolled: number;
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

export type MonthlyTrendPoint = {
  monthLabel: string; // e.g. "Jan 2026"
  certificates: number;
  achievements: number;
};

export type CoursePerformanceSignal = {
  courseId: string;
  courseTitle: string;
  organizationName: string;
  totalEnrolled: number;
  startedLearners: number;
  certificates: number;
  verifiedAchievements: number;
  startRate: number; // %
  completionRate: number; // % of started
  proofRate: number; // % of started
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
    startDate: cleanFilterValue(filters.startDate),
    endDate: cleanFilterValue(filters.endDate),
  };
}

export async function getAdminMonitoringCounts(
  filters: AdminMonitoringFilters = {},
): Promise<AdminMonitoringCounts> {
  const courseVersionWhere = buildCourseVersionWhere(filters);
  const achievementWhere = buildVerifiedAchievementWhere(filters);
  const dateWhere = buildDateRangeWhere(filters);

  const [
    totalEnrolled,
    totalLearners,
    totalCertificates,
    proofsUnderReview,
    totalVerifiedAchievements,
  ] = await Promise.all([
    prisma.learnerEnrollment.count({
      where: {
        ...dateWhere,
        ...withCourseVersionWhere(courseVersionWhere),
      },
    }),
    prisma.user.count({
      where: {
        lessonProgress: {
          some: {
            ...dateWhere,
            ...withCourseVersionWhere(courseVersionWhere),
          },
        },
      },
    }),
    prisma.learnerCertificate.count(
      countWhereArgs({
        ...dateWhere,
        ...withCourseVersionWhere(courseVersionWhere),
      }),
    ),
    prisma.learnerPracticalProofSubmission.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
        ...dateWhere,
        ...withCourseVersionWhere(courseVersionWhere),
      },
    }),
    prisma.learnerVerifiedAchievement.count(
      countWhereArgs({
        ...achievementWhere,
        ...(dateWhere.createdAt ? { issuedAt: dateWhere.createdAt } : {}),
      }),
    ),
  ]);

  return {
    totalEnrolled,
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
  const dateWhere = buildDateRangeWhere(filters);
  
  const combinedWhere = {
    ...where,
    ...(dateWhere.createdAt ? { issuedAt: dateWhere.createdAt } : {}),
  };

  const recent = await prisma.learnerVerifiedAchievement.findMany({
    orderBy: {
      issuedAt: "desc",
    },
    take: 10,
    where: hasKeys(combinedWhere) ? combinedWhere : undefined,
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

export async function getMonthlyMonitoringTrends(
  filters: AdminMonitoringFilters = {},
): Promise<MonthlyTrendPoint[]> {
  const courseVersionWhere = buildCourseVersionWhere(filters);
  const achievementWhere = buildVerifiedAchievementWhere(filters);
  
  // Generate past 6 calendar months (inclusive)
  const now = new Date();
  const months: { start: Date; end: Date; label: string }[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
    months.push({
      start: d,
      end,
      label: new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(d),
    });
  }

  const trendPoints = await Promise.all(
    months.map(async (m) => {
      const [certCount, achCount] = await Promise.all([
        prisma.learnerCertificate.count({
          where: {
            createdAt: { gte: m.start, lte: m.end },
            ...withCourseVersionWhere(courseVersionWhere),
          },
        }),
        prisma.learnerVerifiedAchievement.count({
          where: {
            ...achievementWhere,
            issuedAt: { gte: m.start, lte: m.end },
          },
        }),
      ]);

      return {
        monthLabel: m.label,
        certificates: certCount,
        achievements: achCount,
      };
    })
  );

  return trendPoints;
}

export async function getCoursePerformanceSignals(
  filters: AdminMonitoringFilters = {},
): Promise<CoursePerformanceSignal[]> {
  const courseVersionWhere = buildCourseVersionWhere(filters);
  
  // Fetch current active course versions
  // Limit to PUBLISHED versions or just standard match
  const versions = await prisma.courseVersion.findMany({
    where: {
      status: "PUBLISHED",
      ...courseVersionWhere,
    },
    select: {
      id: true,
      courseId: true,
      course: {
        select: {
          title: true,
          organization: { select: { name: true } },
        },
      },
      _count: {
        select: {
          learnerEnrollments: true,
          certificates: true,
          verifiedAchievements: true,
        },
      },
    },
    orderBy: {
      course: { title: "asc" },
    },
    take: 50,
  });

  const signals = await Promise.all(
    versions.map(async (v) => {
      const startedLearners = await prisma.user.count({
        where: {
          lessonProgress: {
            some: { courseVersionId: v.id },
          },
        },
      });

      const totalEnrolled = v._count.learnerEnrollments;
      const startRate = totalEnrolled > 0 ? Math.round((startedLearners / totalEnrolled) * 100) : 0;
      const completionRate = startedLearners > 0 ? Math.round((v._count.certificates / startedLearners) * 100) : 0;
      const proofRate = startedLearners > 0 ? Math.round((v._count.verifiedAchievements / startedLearners) * 100) : 0;

      return {
        courseId: v.courseId,
        courseTitle: v.course.title,
        organizationName: v.course.organization.name,
        totalEnrolled,
        startedLearners,
        certificates: v._count.certificates,
        verifiedAchievements: v._count.verifiedAchievements,
        startRate,
        completionRate,
        proofRate,
      };
    })
  );

  return signals;
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

function buildDateRangeWhere(filters: AdminMonitoringFilters) {
  const clause: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (filters.startDate) {
    clause.createdAt = clause.createdAt || {};
    clause.createdAt.gte = new Date(`${filters.startDate}T00:00:00`);
  }
  if (filters.endDate) {
    clause.createdAt = clause.createdAt || {};
    clause.createdAt.lte = new Date(`${filters.endDate}T23:59:59`);
  }
  return clause;
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

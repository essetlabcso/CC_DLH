import { prisma } from "@/lib/db/client";

export type AdminMonitoringCounts = {
  totalLearners: number;
  totalCertificates: number;
  proofsUnderReview: number;
  totalVerifiedAchievements: number;
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

export async function getAdminMonitoringCounts(): Promise<AdminMonitoringCounts> {
  const [
    totalLearners,
    totalCertificates,
    proofsUnderReview,
    totalVerifiedAchievements,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        lessonProgress: {
          some: {},
        },
      },
    }),
    prisma.learnerCertificate.count(),
    prisma.learnerPracticalProofSubmission.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
      },
    }),
    prisma.learnerVerifiedAchievement.count(),
  ]);

  return {
    totalLearners,
    totalCertificates,
    proofsUnderReview,
    totalVerifiedAchievements,
  };
}

export async function getCapacityAreaAchievementSummaries(): Promise<
  CapacityAreaAchievementSummary[]
> {
  const grouped = await prisma.learnerVerifiedAchievement.groupBy({
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

export async function getRecentVerifiedAchievements(): Promise<
  RecentVerifiedAchievement[]
> {
  const recent = await prisma.learnerVerifiedAchievement.findMany({
    orderBy: {
      issuedAt: "desc",
    },
    take: 10,
    include: {
      organization: {
        select: {
          name: true,
        },
      },
      courseVersion: {
        include: {
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

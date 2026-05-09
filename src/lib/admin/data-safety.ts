import { prisma } from "@/lib/db/client";

export type AdminDataSafetyOverview = {
  totals: {
    externallyVisibleAchievements: number;
    flaggedProofSubmissions: number;
    redactionNeeded: number;
    specialistReviewNeeded: number;
  };
  externallyVisibleAchievements: AdminExternallyVisibleAchievement[];
  flaggedSubmissions: AdminFlaggedProofSubmission[];
};

export type AdminFlaggedProofSubmission = {
  id: string;
  submittedAt: Date;
  specialistReviewRequired: boolean;
  redactionRequired: boolean;
  courseVersion: {
    versionNumber: number;
    course: {
      title: string;
      organization: {
        name: string;
      };
    };
  };
  practicalProofConfig: {
    proofTitle: string;
  };
  reviewer: {
    name: string | null;
  } | null;
};

export type AdminExternallyVisibleAchievement = {
  id: string;
  title: string;
  description: string;
  donorVisibilityEnabled: boolean;
  publicBadgeEnabled: boolean;
  issuedAt: Date;
  organization: {
    name: string;
  };
  courseVersion: {
    course: {
      title: string;
    };
  };
};

export async function getAdminDataSafetyOverview(): Promise<AdminDataSafetyOverview> {
  const flaggedSubmissions = await prisma.learnerPracticalProofSubmission.findMany({
    where: {
      OR: [
        { specialistReviewRequired: true },
        { redactionRequired: true },
      ],
    },
    select: {
      id: true,
      submittedAt: true,
      specialistReviewRequired: true,
      redactionRequired: true,
      courseVersion: {
        select: {
          versionNumber: true,
          course: {
            select: {
              title: true,
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      practicalProofConfig: {
        select: {
          proofTitle: true,
        },
      },
      reviewer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const externallyVisibleAchievements = await prisma.learnerVerifiedAchievement.findMany({
    where: {
      OR: [
        { donorVisibilityEnabled: true },
        { publicBadgeEnabled: true },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      donorVisibilityEnabled: true,
      publicBadgeEnabled: true,
      issuedAt: true,
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
    orderBy: {
      issuedAt: "desc",
    },
  });

  return {
    totals: {
      externallyVisibleAchievements: externallyVisibleAchievements.length,
      flaggedProofSubmissions: flaggedSubmissions.length,
      redactionNeeded: flaggedSubmissions.filter(
        (submission) => submission.redactionRequired,
      ).length,
      specialistReviewNeeded: flaggedSubmissions.filter(
        (submission) => submission.specialistReviewRequired,
      ).length,
    },
    flaggedSubmissions,
    externallyVisibleAchievements,
  };
}

import { prisma } from "@/lib/db/client";

export type AdminDataSafetyOverview = Awaited<
  ReturnType<typeof getAdminDataSafetyOverview>
>;

export async function getAdminDataSafetyOverview() {
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
      internalReviewNote: true,
      requiredAction: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
      issuedBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return {
    flaggedSubmissions,
    externallyVisibleAchievements,
  };
}

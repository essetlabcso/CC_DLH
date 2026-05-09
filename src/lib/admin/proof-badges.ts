import { prisma } from "@/lib/db/client";
import { getProofReviewStatusLabel } from "@/lib/review/proof-review";

export type AdminProofBadgesOverview = {
  totals: {
    certificates: number;
    proofEnabledCourses: number;
    proofSubmissions: number;
    verifiedAchievements: number;
  };
  proofStatuses: AdminCountSummary[];
  proofSafety: {
    aiVerificationUsed: number;
    donorVisibilityConsent: number;
    privateProof: number;
    redactionRequired: number;
    specialistReviewRequired: number;
  };
  verifiedAchievementDecisions: AdminCountSummary[];
  recognitionVisibility: {
    aiIssued: number;
    badgeVisualIssued: number;
    donorVisible: number;
    privateAchievements: number;
    publicBadgeEnabled: number;
  };
  capacityAreas: AdminEvidenceSummary[];
  courses: AdminEvidenceSummary[];
  organizations: AdminEvidenceSummary[];
};

export type AdminCountSummary = {
  label: string;
  count: number;
};

export type AdminEvidenceSummary = {
  label: string;
  proofSubmissions: number;
  verifiedAchievements: number;
};

type ProofSubmissionSummaryRecord = {
  status: string;
  visibilityDefault: string;
  donorVisibilityConsent: boolean;
  aiVerificationUsed: boolean;
  redactionRequired: boolean;
  specialistReviewRequired: boolean;
  practicalProofConfig: {
    capacityArea: string;
  };
  courseVersion: {
    course: {
      title: string;
      organization: {
        name: string;
      };
    };
  };
};

type VerifiedAchievementSummaryRecord = {
  verificationDecision: string;
  visibilityDefault: string;
  donorVisibilityEnabled: boolean;
  publicBadgeEnabled: boolean;
  badgeVisualIssued: boolean;
  aiIssued: boolean;
  capacityArea: string;
  organization: {
    name: string;
  };
  courseVersion: {
    course: {
      title: string;
      organization: {
        name: string;
      };
    };
  };
};

export async function getAdminProofBadgesOverview(): Promise<AdminProofBadgesOverview> {
  const [
    proofEnabledCourses,
    certificates,
    proofSubmissions,
    verifiedAchievements,
  ] = await Promise.all([
    prisma.coursePracticalProofConfig.count({
      where: {
        enabled: true,
      },
    }),
    prisma.learnerCertificate.count(),
    prisma.learnerPracticalProofSubmission.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      select: {
        aiVerificationUsed: true,
        donorVisibilityConsent: true,
        practicalProofConfig: {
          select: {
            capacityArea: true,
          },
        },
        redactionRequired: true,
        specialistReviewRequired: true,
        status: true,
        visibilityDefault: true,
        courseVersion: {
          select: {
            course: {
              select: {
                organization: {
                  select: {
                    name: true,
                  },
                },
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.learnerVerifiedAchievement.findMany({
      orderBy: {
        issuedAt: "desc",
      },
      select: {
        aiIssued: true,
        badgeVisualIssued: true,
        capacityArea: true,
        donorVisibilityEnabled: true,
        organization: {
          select: {
            name: true,
          },
        },
        publicBadgeEnabled: true,
        verificationDecision: true,
        visibilityDefault: true,
        courseVersion: {
          select: {
            course: {
              select: {
                organization: {
                  select: {
                    name: true,
                  },
                },
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const proofRecords = proofSubmissions as ProofSubmissionSummaryRecord[];
  const achievementRecords =
    verifiedAchievements as VerifiedAchievementSummaryRecord[];

  return {
    totals: {
      certificates,
      proofEnabledCourses,
      proofSubmissions: proofRecords.length,
      verifiedAchievements: achievementRecords.length,
    },
    proofStatuses: countBy(
      proofRecords,
      (submission) => getProofReviewStatusLabel(submission.status),
    ),
    proofSafety: {
      aiVerificationUsed: proofRecords.filter((submission) => submission.aiVerificationUsed).length,
      donorVisibilityConsent: proofRecords.filter((submission) => submission.donorVisibilityConsent).length,
      privateProof: proofRecords.filter((submission) => submission.visibilityDefault === "PRIVATE").length,
      redactionRequired: proofRecords.filter((submission) => submission.redactionRequired).length,
      specialistReviewRequired: proofRecords.filter((submission) => submission.specialistReviewRequired).length,
    },
    verifiedAchievementDecisions: countBy(
      achievementRecords,
      (achievement) => formatLabel(achievement.verificationDecision || "Not recorded"),
    ),
    recognitionVisibility: {
      aiIssued: achievementRecords.filter((achievement) => achievement.aiIssued).length,
      badgeVisualIssued: achievementRecords.filter((achievement) => achievement.badgeVisualIssued).length,
      donorVisible: achievementRecords.filter((achievement) => achievement.donorVisibilityEnabled).length,
      privateAchievements: achievementRecords.filter(
        (achievement) => achievement.visibilityDefault === "PRIVATE",
      ).length,
      publicBadgeEnabled: achievementRecords.filter((achievement) => achievement.publicBadgeEnabled).length,
    },
    capacityAreas: buildEvidenceSummaries({
      achievements: achievementRecords,
      getAchievementLabel: (achievement) =>
        cleanDimension(achievement.capacityArea, "Unmapped capacity area"),
      getProofLabel: (submission) =>
        cleanDimension(
          submission.practicalProofConfig.capacityArea,
          "Unmapped capacity area",
        ),
      proofs: proofRecords,
    }),
    courses: buildEvidenceSummaries({
      achievements: achievementRecords,
      getAchievementLabel: (achievement) =>
        formatCourseLabel(achievement.courseVersion.course),
      getProofLabel: (submission) => formatCourseLabel(submission.courseVersion.course),
      proofs: proofRecords,
    }),
    organizations: buildEvidenceSummaries({
      achievements: achievementRecords,
      getAchievementLabel: (achievement) =>
        cleanDimension(achievement.organization.name, "Unknown organization"),
      getProofLabel: (submission) =>
        cleanDimension(
          submission.courseVersion.course.organization.name,
          "Unknown organization",
        ),
      proofs: proofRecords,
    }),
  };
}

function buildEvidenceSummaries(input: {
  achievements: readonly VerifiedAchievementSummaryRecord[];
  getAchievementLabel: (achievement: VerifiedAchievementSummaryRecord) => string;
  getProofLabel: (submission: ProofSubmissionSummaryRecord) => string;
  proofs: readonly ProofSubmissionSummaryRecord[];
}) {
  const summaries = new Map<string, AdminEvidenceSummary>();

  for (const submission of input.proofs) {
    const label = input.getProofLabel(submission);
    const summary = getOrCreateEvidenceSummary(summaries, label);
    summary.proofSubmissions += 1;
  }

  for (const achievement of input.achievements) {
    const label = input.getAchievementLabel(achievement);
    const summary = getOrCreateEvidenceSummary(summaries, label);
    summary.verifiedAchievements += 1;
  }

  return Array.from(summaries.values()).sort(
    (left, right) =>
      right.proofSubmissions +
        right.verifiedAchievements -
        (left.proofSubmissions + left.verifiedAchievements) ||
      left.label.localeCompare(right.label),
  );
}

function getOrCreateEvidenceSummary(
  summaries: Map<string, AdminEvidenceSummary>,
  label: string,
) {
  const existing = summaries.get(label);

  if (existing) {
    return existing;
  }

  const summary = {
    label,
    proofSubmissions: 0,
    verifiedAchievements: 0,
  };

  summaries.set(label, summary);
  return summary;
}

function countBy<TItem>(
  items: readonly TItem[],
  getLabel: (item: TItem) => string,
): AdminCountSummary[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    const label = getLabel(item);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort(
      (left, right) =>
        right.count - left.count || left.label.localeCompare(right.label),
    );
}

function formatCourseLabel(course: {
  title: string;
  organization: {
    name: string;
  };
}) {
  return `${cleanDimension(course.title, "Untitled course")} - ${cleanDimension(
    course.organization.name,
    "Unknown organization",
  )}`;
}

function cleanDimension(value: string, fallback: string) {
  return value.trim() || fallback;
}

function formatLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

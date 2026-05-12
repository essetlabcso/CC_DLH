import { LearnerEnrollmentStatus, MembershipStatus, UserStatus } from "@prisma/client";

import { prisma } from "@/lib/db/client";

export interface SafeStaffRosterEntry {
  userId: string;
  userName: string;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  certificatesCount: number;
  practicalProofStatus: string | null;
}

export interface OrganizationSafeSummary {
  organizationName: string;
  activeMemberCount: number;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRatePercent: number;
  certificatesIssued: number;
  verifiedAchievementsAwarded: number;
  capacityAreasCovered: string[];
  evidencePipeline: {
    submittedCount: number;
    underReviewCount: number;
    revisionRequestedCount: number;
    acceptedCount: number;
    rejectedCount: number;
  };
  staffRoster: SafeStaffRosterEntry[];
}

export async function getOrganizationSafeSummary(
  organizationId: string
): Promise<OrganizationSafeSummary | null> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { name: true },
  });

  if (!organization) {
    return null;
  }

  const [
    activeMemberCount,
    totalEnrollments,
    completedEnrollments,
    verifiedAchievementsAwarded,
    certificatesIssued,
    allProofs,
    capacityAreas,
    users,
    completedCountByUser,
  ] = await Promise.all([
    prisma.organizationMembership.count({
      where: { organizationId, status: MembershipStatus.ACTIVE, user: { status: UserStatus.ACTIVE } },
    }),
    prisma.learnerEnrollment.count({
      where: { organizationId },
    }),
    prisma.learnerEnrollment.count({
      where: { organizationId, status: LearnerEnrollmentStatus.COMPLETED },
    }),
    prisma.learnerVerifiedAchievement.count({
      where: { organizationId },
    }),
    prisma.learnerCertificate.count({
      where: { user: { memberships: { some: { organizationId, status: MembershipStatus.ACTIVE } } } },
    }),
    prisma.learnerPracticalProofSubmission.findMany({
      where: { user: { memberships: { some: { organizationId, status: MembershipStatus.ACTIVE } } } },
      select: { userId: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.learnerVerifiedAchievement.findMany({
      where: { organizationId },
      distinct: ["capacityArea"],
      select: { capacityArea: true },
    }),
    prisma.user.findMany({
      where: { memberships: { some: { organizationId, status: MembershipStatus.ACTIVE } }, status: UserStatus.ACTIVE },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            learnerEnrollments: true,
            certificates: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.learnerEnrollment.groupBy({
      by: ["userId"],
      where: { organizationId, status: LearnerEnrollmentStatus.COMPLETED },
      _count: { _all: true },
    }),
  ]);

  const pipeline = {
    submittedCount: 0,
    underReviewCount: 0,
    revisionRequestedCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  };

  const latestUserProofStatus = new Map<string, string>();

  for (const proof of allProofs) {
    // Group-level aggregation across all submissions
    if (proof.status === "SUBMITTED") {
      pipeline.submittedCount++;
    } else if (proof.status === "UNDER_REVIEW" || proof.status === "ESCALATED") {
      pipeline.underReviewCount++;
    } else if (
      proof.status === "REVISION_REQUESTED" ||
      proof.status === "UNSAFE_REDACTION_REQUIRED"
    ) {
      pipeline.revisionRequestedCount++;
    } else if (proof.status === "ACCEPTED") {
      pipeline.acceptedCount++;
    } else if (proof.status === "REJECTED") {
      pipeline.rejectedCount++;
    }

    // Because we sorted by updatedAt DESC, the first one we process for each user IS their latest
    if (!latestUserProofStatus.has(proof.userId)) {
      latestUserProofStatus.set(proof.userId, proof.status);
    }
  }

  const completedMap = new Map<string, number>();
  for (const entry of completedCountByUser) {
    completedMap.set(entry.userId, entry._count._all);
  }

  const staffRoster: SafeStaffRosterEntry[] = users.map((u) => ({
    userId: u.id,
    userName: u.name,
    enrolledCoursesCount: u._count.learnerEnrollments,
    completedCoursesCount: completedMap.get(u.id) ?? 0,
    certificatesCount: u._count.certificates,
    practicalProofStatus: latestUserProofStatus.get(u.id) ?? null,
  }));

  const completionRatePercent =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

  return {
    organizationName: organization.name,
    activeMemberCount,
    totalEnrollments,
    completedEnrollments,
    completionRatePercent,
    certificatesIssued,
    verifiedAchievementsAwarded,
    capacityAreasCovered: capacityAreas
      .map((c) => c.capacityArea)
      .filter((area) => !!area),
    evidencePipeline: pipeline,
    staffRoster,
  };
}

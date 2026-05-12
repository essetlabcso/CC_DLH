import {
  CourseVersionStatus,
  LearnerEnrollmentStatus,
  LearnerInvitationStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db/client";

export type AdminDashboardCounts = {
  lookupCategories: number;
  lookupValues: number;
  fieldMetadata: number;
  diagnosisDatasets: number;
  diagnosisRecords: number;
  auditLogs: number;
  organizations: number;
  certificates: number;
  coursesSubmittedForReview: number;
  coursesApprovedForPublish: number;
  coursesPublished: number;
  proofsUnderReview: number;
  specialistFlags: number;
  externallyVisibleAchievements: number;
};

export type AdminReferenceCategorySummary = {
  categoryKey: string;
  categoryName: string;
  workflowPhase: string;
  valueCount: number;
  isSystemCategory: boolean;
  isActive: boolean;
};

export type AdminFieldMetadataSummary = {
  workflowPhase: string;
  fieldCount: number;
  sectionCount: number;
  dashboardFieldCount: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  const [
    lookupCategories,
    lookupValues,
    fieldMetadata,
    diagnosisDatasets,
    diagnosisRecords,
    auditLogs,
    organizations,
    certificates,
    coursesSubmittedForReview,
    coursesApprovedForPublish,
    coursesPublished,
    proofsUnderReview,
    specialistFlags,
    externallyVisibleAchievements,
  ] = await Promise.all([
    prisma.adminLookupCategory.count(),
    prisma.adminLookupValue.count(),
    prisma.adminFieldMetadata.count(),
    prisma.diagnosisDataset.count(),
    prisma.diagnosisRecord.count(),
    prisma.adminAuditLog.count(),
    prisma.organization.count(),
    prisma.learnerCertificate.count(),
    prisma.courseVersion.count({
      where: { status: CourseVersionStatus.SUBMITTED },
    }),
    prisma.courseVersion.count({
      where: { status: CourseVersionStatus.APPROVED },
    }),
    prisma.courseVersion.count({
      where: { status: CourseVersionStatus.PUBLISHED },
    }),
    prisma.learnerPracticalProofSubmission.count({
      where: {
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
      },
    }),
    prisma.learnerPracticalProofSubmission.count({
      where: {
        OR: [
          { specialistReviewRequired: true },
          { redactionRequired: true },
        ],
      },
    }),
    prisma.learnerVerifiedAchievement.count({
      where: {
        OR: [
          { donorVisibilityEnabled: true },
          { publicBadgeEnabled: true },
        ],
      },
    }),
  ]);

  return {
    lookupCategories,
    lookupValues,
    fieldMetadata,
    diagnosisDatasets,
    diagnosisRecords,
    auditLogs,
    organizations,
    certificates,
    coursesSubmittedForReview,
    coursesApprovedForPublish,
    coursesPublished,
    proofsUnderReview,
    specialistFlags,
    externallyVisibleAchievements,
  };
}

export async function getAdminReferenceCategorySummaries(): Promise<
  AdminReferenceCategorySummary[]
> {
  const categories = await prisma.adminLookupCategory.findMany({
    include: {
      _count: {
        select: {
          values: true,
        },
      },
    },
    orderBy: [{ workflowPhase: "asc" }, { categoryName: "asc" }],
  });

  return categories.map((category) => ({
    categoryKey: category.categoryKey,
    categoryName: category.categoryName,
    workflowPhase: category.workflowPhase,
    valueCount: category._count.values,
    isSystemCategory: category.isSystemCategory,
    isActive: category.isActive,
  }));
}

export async function getAdminFieldMetadataSummaries(): Promise<
  AdminFieldMetadataSummary[]
> {
  const fields = await prisma.adminFieldMetadata.findMany({
    select: {
      workflowPhase: true,
      formSection: true,
      visibleInDashboard: true,
    },
    orderBy: [{ workflowPhase: "asc" }, { displayOrder: "asc" }],
  });

  const phaseMap = new Map<
    string,
    { fieldCount: number; sections: Set<string>; dashboardFieldCount: number }
  >();

  for (const field of fields) {
    const current =
      phaseMap.get(field.workflowPhase) ??
      { fieldCount: 0, sections: new Set<string>(), dashboardFieldCount: 0 };

    current.fieldCount += 1;
    current.sections.add(field.formSection);
    if (field.visibleInDashboard) {
      current.dashboardFieldCount += 1;
    }

    phaseMap.set(field.workflowPhase, current);
  }

  return Array.from(phaseMap.entries()).map(([workflowPhase, summary]) => ({
    workflowPhase,
    fieldCount: summary.fieldCount,
    sectionCount: summary.sections.size,
    dashboardFieldCount: summary.dashboardFieldCount,
  }));
}

export type AdminDashboardQueueItem = {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: Date;
  href: string;
};

export type AdminDashboardQueues = {
  pendingCourseReviews: AdminDashboardQueueItem[];
  pendingDiagnosisRecords: AdminDashboardQueueItem[];
  proofSubmissions: AdminDashboardQueueItem[];
  dataSafetyFlags: AdminDashboardQueueItem[];
  activeInvitations: AdminDashboardQueueItem[];
  accessIssues: AdminDashboardQueueItem[];
};

export async function getAdminDashboardQueues(): Promise<AdminDashboardQueues> {
  const [
    pendingCourseReviews,
    pendingDiagnosisRecords,
    proofSubmissions,
    dataSafetyFlags,
    activeInvitations,
    suspendedEnrollments,
    expiredInvitations,
  ] = await Promise.all([
    prisma.courseVersion.findMany({
      where: { status: CourseVersionStatus.SUBMITTED },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { course: { select: { title: true } } },
    }),
    prisma.diagnosisRecord.findMany({
      where: { approvalStatus: "UNDER_REVIEW" },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.learnerPracticalProofSubmission.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        courseVersion: {
          include: { course: { select: { title: true } } },
        },
      },
    }),
    prisma.learnerPracticalProofSubmission.findMany({
      where: {
        OR: [{ specialistReviewRequired: true }, { redactionRequired: true }],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        courseVersion: {
          include: { course: { select: { title: true } } },
        },
      },
    }),
    prisma.learnerInvitation.findMany({
      where: {
        status: {
          in: [
            LearnerInvitationStatus.SENT,
            LearnerInvitationStatus.PENDING_ACCEPTANCE,
          ],
        },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { organization: { select: { name: true } } },
    }),
    prisma.learnerEnrollment.findMany({
      where: { status: LearnerEnrollmentStatus.SUSPENDED },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: {
        organization: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.learnerInvitation.findMany({
      where: { status: LearnerInvitationStatus.EXPIRED },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { organization: { select: { name: true } } },
    }),
  ]);

  const mappedAccessIssues: AdminDashboardQueueItem[] = [
    ...suspendedEnrollments.map((enrollment) => ({
      id: enrollment.id,
      title: enrollment.course.title,
      subtitle: `Suspended - ${enrollment.organization.name}`,
      updatedAt: enrollment.updatedAt,
      href: `/admin/participant-access?organizationId=${enrollment.organizationId}&courseId=${enrollment.courseId}&enrollmentStatus=SUSPENDED`,
    })),
    ...expiredInvitations.map((invitation) => ({
      id: invitation.id,
      title: invitation.organization?.name ?? "Unknown Organization",
      subtitle: "Expired Invitation",
      updatedAt: invitation.updatedAt,
      href: "/admin/learner-invitations",
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return {
    pendingCourseReviews: pendingCourseReviews.map((v) => ({
      id: v.id,
      title: v.course.title,
      subtitle: `Version ${v.versionNumber}`,
      updatedAt: v.updatedAt,
      href: `/review/courses/${v.courseId}/versions/${v.id}`,
    })),
    pendingDiagnosisRecords: pendingDiagnosisRecords.map((r) => ({
      id: r.id,
      title: r.diagnosisTitle,
      subtitle: r.diagnosisCode,
      updatedAt: r.updatedAt,
      href: `/admin/diagnosis-records/${r.id}`,
    })),
    proofSubmissions: proofSubmissions.map((p) => ({
      id: p.id,
      title: p.courseVersion.course.title,
      subtitle: `Proof: ${p.status}`,
      updatedAt: p.updatedAt,
      href: `/review/proof/${p.id}`,
    })),
    dataSafetyFlags: dataSafetyFlags.map((p) => ({
      id: p.id,
      title: p.courseVersion.course.title,
      subtitle: p.specialistReviewRequired ? "Specialist Flag" : "Redaction Flag",
      updatedAt: p.updatedAt,
      href: `/admin/data-safety`,
    })),
    activeInvitations: activeInvitations.map((inv) => ({
      id: inv.id,
      title: inv.organization?.name ?? "Unknown Organization",
      subtitle: inv.status.replace("_", " "),
      updatedAt: inv.updatedAt,
      href: "/admin/learner-invitations",
    })),
    accessIssues: mappedAccessIssues,
  };
}

import {
  CourseVersionStatus,
  CourseWorkflowStep,
  WorkflowStepStatus,
  type PrismaClient,
} from "@prisma/client";

import type { DecRole } from "@/lib/access";

export const editableCourseVersionStatuses = [
  CourseVersionStatus.DRAFT,
  CourseVersionStatus.CREATOR_REVIEW,
  CourseVersionStatus.RETURNED,
  CourseVersionStatus.REVISION_DRAFT,
] as const;

export type StudioIdentityContext = {
  userId: string;
  organizationId: string;
  role: DecRole;
};

export function canManageStudioCourse(
  identity: StudioIdentityContext,
  course: {
    organizationId: string;
    ownerId: string;
  },
) {
  return (
    identity.organizationId === course.organizationId &&
    (identity.role === "admin" || identity.userId === course.ownerId)
  );
}

export async function getCreatorCourses(
  prisma: PrismaClient,
  identity: StudioIdentityContext,
) {
  return prisma.course.findMany({
    where: {
      organizationId: identity.organizationId,
      ...(identity.role === "admin" ? {} : { ownerId: identity.userId }),
    },
    include: {
      versions: {
        orderBy: {
          versionNumber: "desc",
        },
        take: 1,
        include: {
          setup: true,
          diagnosis: true,
          analysisHandover: true,
          capacityMap: true,
          actionMap: true,
          storyboard: true,
          designHandover: true,
          reviewRecord: true,
          practicalProofConfig: true,
          modules: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              lessons: {
                orderBy: {
                  sortOrder: "asc",
                },
                include: {
                  blocks: {
                    orderBy: {
                      sortOrder: "asc",
                    },
                  },
                },
              },
            },
          },
          workflowSteps: {
            where: {
              step: {
                in: [
                  CourseWorkflowStep.COURSE_SETUP,
                  CourseWorkflowStep.DIAGNOSIS,
                  CourseWorkflowStep.CAPACITY_MAP,
                  CourseWorkflowStep.ACTION_MAP,
                  CourseWorkflowStep.STORYBOARD,
                  CourseWorkflowStep.BUILD,
                  CourseWorkflowStep.PREVIEW,
                  CourseWorkflowStep.CREATOR_REVIEW,
                ],
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getEditableCourseVersion(
  prisma: PrismaClient,
  identity: StudioIdentityContext,
  courseId: string,
) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      organizationId: identity.organizationId,
      ...(identity.role === "admin" ? {} : { ownerId: identity.userId }),
    },
    include: {
      versions: {
        where: {
          status: {
            in: [...editableCourseVersionStatuses],
          },
        },
        orderBy: {
          versionNumber: "desc",
        },
        take: 1,
        include: {
          setup: true,
          diagnosis: true,
          analysisHandover: true,
          capacityMap: true,
          actionMap: true,
          storyboard: true,
          designHandover: true,
          modules: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              lessons: {
                orderBy: {
                  sortOrder: "asc",
                },
                include: {
                  blocks: {
                    orderBy: {
                      sortOrder: "asc",
                    },
                  },
                },
              },
            },
          },
          workflowSteps: true,
          reviewRecord: true,
          practicalProofConfig: true,
        },
      },
    },
  });

  if (!course || course.versions.length === 0) {
    return null;
  }

  return {
    course,
    version: course.versions[0],
  };
}

export function getCourseSetupStepStatus(
  workflowSteps: readonly {
    step: CourseWorkflowStep;
    status: WorkflowStepStatus;
  }[],
) {
  return (
    workflowSteps.find((step) => step.step === CourseWorkflowStep.COURSE_SETUP)
      ?.status ?? WorkflowStepStatus.NOT_STARTED
  );
}

export function getWorkflowStepStatus(
  workflowSteps: readonly {
    step: CourseWorkflowStep;
    status: WorkflowStepStatus;
  }[],
  targetStep: CourseWorkflowStep,
) {
  return (
    workflowSteps.find((step) => step.step === targetStep)?.status ??
    WorkflowStepStatus.LOCKED
  );
}

export function getCourseStatusLabel(
  status: CourseVersionStatus | undefined,
  checklist?: string | null,
) {
  if (status === CourseVersionStatus.RETURNED && checklist) {
    try {
      const parsed = JSON.parse(checklist);
      const decisionType = parsed.reviewerReview?.decisionType;

      if (decisionType === "not-approved-pause") {
        return "Paused / Not Approved";
      }

      if (decisionType === "return-to-analysis") {
        return "Returned to Analysis";
      }

      if (decisionType === "return-to-design") {
        return "Returned to Design";
      }

      if (decisionType === "return-to-build") {
        return "Returned to Build";
      }
    } catch {
      // Ignore parse errors
    }
  }

  switch (status) {
    case CourseVersionStatus.DRAFT:
      return "Draft";
    case CourseVersionStatus.CREATOR_REVIEW:
      return "Ready for creator review";
    case CourseVersionStatus.SUBMITTED:
      return "Submitted for review";
    case CourseVersionStatus.RETURNED:
      return "Returned for changes";
    case CourseVersionStatus.APPROVED:
      return "Approved";
    case CourseVersionStatus.PUBLISHED:
      return "Published";
    case CourseVersionStatus.REVISION_DRAFT:
      return "Revision draft";
    case CourseVersionStatus.REPLACED:
      return "Replaced";
    case CourseVersionStatus.ARCHIVED:
      return "Archived";
    default:
      return "No version";
  }
}

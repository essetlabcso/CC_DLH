import {
  CourseVersionStatus,
  CourseWorkflowStep,
  WorkflowStepStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db/client";
import { getDiagnosisCourseFitDisplayLabel } from "@/lib/admin/diagnosis-display";
import { getReturnGuidanceFromChecklist } from "@/lib/review/decisions";
import { buildPublishReadiness } from "@/lib/review/publishing";
import {
  getBuildToReviewHandoverFromChecklist,
  summarizeBuildToReviewHandover,
} from "@/lib/studio/build-review-handover";
import { courseWorkflowSteps } from "@/lib/workflow/course-workflow";

export const adminCourseAttentionFilters = [
  "needs-review",
  "approved-publish",
  "blocked-publish",
  "returned",
  "published",
] as const;

export type AdminCourseAttentionFilter =
  (typeof adminCourseAttentionFilters)[number];

export type AdminCourseWorkflowFilters = {
  attention?: string;
  search?: string;
  status?: string;
};

export type AdminCourseWorkflowSummary = {
  total: number;
  submitted: number;
  approved: number;
  blockedPublish: number;
  returned: number;
  published: number;
};

export type AdminCourseWorkflowItem = {
  id: string;
  courseId: string;
  title: string;
  versionNumber: number;
  versionType: string;
  status: CourseVersionStatus;
  statusLabel: string;
  statusTone: string;
  ownerName: string;
  creatorName: string;
  organizationName: string;
  programCohortLabel: string;
  capacityArea: string;
  courseFitDecisionLabel: string;
  sourceAnchorSummary: string;
  readinessChecklist: {
    detail: string;
    label: string;
    ready: boolean;
  }[];
  reviewerName: string;
  workflowStage: string;
  workflowProgressLabel: string;
  workflowStepLabels: string[];
  nextActionLabel: string;
  nextActionHref: string | null;
  nextActionNote: string;
  blockers: string[];
  warnings: string[];
  publishReadinessLabel: string;
  publishReadinessSummary: string;
  attentionTags: string[];
  updatedAt: Date;
};

export type AdminCourseWorkflowOverview = {
  items: AdminCourseWorkflowItem[];
  summary: AdminCourseWorkflowSummary;
};

export async function getAdminCourseWorkflowOverview({
  attention,
  search,
  status,
}: AdminCourseWorkflowFilters = {}): Promise<AdminCourseWorkflowOverview> {
  const normalizedStatus = parseCourseVersionStatus(status);
  const normalizedSearch = search?.trim() ?? "";
  const versions = await prisma.courseVersion.findMany({
    include: {
      analysisHandover: true,
      diagnosis: true,
      course: {
        include: {
          cohortCourses: {
            include: {
              cohort: {
                include: {
                  program: true,
                },
              },
            },
          },
          organization: true,
          owner: true,
        },
      },
      createdBy: true,
      modules: {
        include: {
          lessons: true,
        },
      },
      practicalProofConfig: true,
      reviewRecord: {
        include: {
          reviewer: true,
        },
      },
      setup: true,
      actionMap: true,
      storyboard: true,
      workflowSteps: true,
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    where: {
      status: normalizedStatus,
      ...(normalizedSearch
        ? {
            OR: [
              { course: { title: { contains: normalizedSearch } } },
              {
                course: {
                  organization: { name: { contains: normalizedSearch } },
                },
              },
              { course: { owner: { name: { contains: normalizedSearch } } } },
              { createdBy: { name: { contains: normalizedSearch } } },
              { setup: { capacityArea: { contains: normalizedSearch } } },
            ],
          }
        : {}),
    },
  });

  const allItems = versions.map((version) => {
    const handover = getBuildToReviewHandoverFromChecklist(
      version.reviewRecord?.checklist,
    );
    const publishReadiness =
      version.status === CourseVersionStatus.APPROVED
        ? buildPublishReadiness(version)
        : null;
    const returnGuidance =
      version.status === CourseVersionStatus.RETURNED
        ? getReturnGuidanceFromChecklist(
            version.reviewRecord?.checklist,
            version.reviewRecord?.returnedReason,
          )
        : null;
    const blockers = buildCourseBlockers({
      handoverBlockers: handover?.blockingWarnings.map((item) => item.message),
      publishBlockers: publishReadiness?.blockers.map((item) => item.detail),
      status: version.status,
    });
    const warnings = buildCourseWarnings({
      handoverWarnings: handover?.reviewerAttentionItems,
      returnReason: returnGuidance?.requiredAction,
      status: version.status,
    });
    const attentionTags = getAdminCourseAttentionTags({
      blockers,
      publishReady: publishReadiness?.ready ?? null,
      status: version.status,
      warnings,
    });
    const courseFitDecisionLabel = getDiagnosisCourseFitDisplayLabel(
      handover?.anchors.courseFitDecision ||
        version.diagnosis?.courseFitDecision ||
        "",
    );
    const workflowStatusByStep = buildWorkflowStatusByStep(version.workflowSteps);
    const readinessChecklist = buildAdminCourseReadinessChecklist({
      actionMapRecorded: Boolean(version.actionMap),
      courseFitDecisionLabel,
      diagnosisLocked: Boolean(version.setup?.selectedDiagnosisRecordId),
      proofRulesRecorded: Boolean(version.practicalProofConfig) ||
        version.setup?.practicalProofEnabled === false,
      reviewApproved: version.status === CourseVersionStatus.APPROVED ||
        version.status === CourseVersionStatus.PUBLISHED,
      reviewStatus: version.status,
      storyboardReady: Boolean(version.storyboard?.approvedForBuild),
      workflowStatusByStep,
    });

    return {
      id: version.id,
      courseId: version.courseId,
      title: version.course.title,
      versionNumber: version.versionNumber,
      versionType: version.sourceVersionId ? "Revision version" : "New version",
      status: version.status,
      statusLabel: getAdminCourseStatusLabel(version.status),
      statusTone: getAdminCourseStatusTone(version.status),
      ownerName: version.course.owner.name,
      creatorName: version.createdBy.name,
      organizationName: version.course.organization.name,
      programCohortLabel: summarizeProgramCohort(version.course.cohortCourses),
      capacityArea:
        version.setup?.capacityArea ||
        version.analysisHandover?.capacityArea ||
        handover?.anchors.capacityArea ||
        "Not recorded",
      courseFitDecisionLabel,
      sourceAnchorSummary: summarizeSourceAnchorForAdmin(handover),
      readinessChecklist,
      reviewerName: version.reviewRecord?.reviewer?.name || "Not assigned",
      workflowStage: getAdminWorkflowStage(version.status, version.workflowSteps),
      workflowProgressLabel: summarizeWorkflowProgress(version.workflowSteps),
      workflowStepLabels: buildWorkflowStepLabels(version.workflowSteps),
      nextActionLabel: getAdminCourseNextActionLabel(version.status),
      nextActionHref: getAdminCourseNextActionHref({
        courseId: version.courseId,
        status: version.status,
        versionId: version.id,
      }),
      nextActionNote: getAdminCourseNextActionNote(version.status),
      blockers,
      warnings,
      publishReadinessLabel: publishReadiness
        ? publishReadiness.ready
          ? "Ready"
          : "Blocked"
        : getPublishReadinessFallbackLabel(version.status),
      publishReadinessSummary:
        publishReadiness?.summary ||
        (handover ? summarizeBuildToReviewHandover(handover) : "Not at publish readiness yet."),
      attentionTags,
      updatedAt: version.updatedAt,
    } satisfies AdminCourseWorkflowItem;
  });

  const items = filterAdminCourseWorkflowItems(allItems, attention);

  return {
    items,
    summary: summarizeAdminCourseWorkflow(allItems),
  };
}

function buildAdminCourseReadinessChecklist({
  actionMapRecorded,
  courseFitDecisionLabel,
  diagnosisLocked,
  proofRulesRecorded,
  reviewApproved,
  reviewStatus,
  storyboardReady,
  workflowStatusByStep,
}: {
  actionMapRecorded: boolean;
  courseFitDecisionLabel: string;
  diagnosisLocked: boolean;
  proofRulesRecorded: boolean;
  reviewApproved: boolean;
  reviewStatus: CourseVersionStatus;
  storyboardReady: boolean;
  workflowStatusByStep: Partial<Record<CourseWorkflowStep, WorkflowStepStatus>>;
}) {
  const finalCheckReady =
    workflowStatusByStep[CourseWorkflowStep.CREATOR_REVIEW] ===
      WorkflowStepStatus.COMPLETE ||
    reviewStatus === CourseVersionStatus.SUBMITTED ||
    reviewApproved;

  return [
    {
      detail: diagnosisLocked
        ? "Approved locked diagnosis selected in Course Setup."
        : "Course setup must select an approved locked diagnosis.",
      label: "Diagnosis locked",
      ready: diagnosisLocked,
    },
    {
      detail:
        courseFitDecisionLabel === "Not set"
          ? "Routing decision not recorded."
          : courseFitDecisionLabel,
      label: "Routing decision",
      ready: courseFitDecisionLabel !== "Not set",
    },
    {
      detail: actionMapRecorded
        ? "Action Map record exists."
        : "Action Map is not recorded yet.",
      label: "Action Map",
      ready: actionMapRecorded,
    },
    {
      detail: storyboardReady
        ? "Storyboard approved for build."
        : "Storyboard is not approved for build yet.",
      label: "Storyboard",
      ready: storyboardReady,
    },
    {
      detail: finalCheckReady
        ? "Final check is ready or already submitted for review."
        : "Creator final check is not complete yet.",
      label: "Final check",
      ready: finalCheckReady,
    },
    {
      detail: proofRulesRecorded
        ? "Proof rules are recorded or practical proof is not enabled."
        : "Practical proof rules need setup before publish readiness.",
      label: "Proof rules",
      ready: proofRulesRecorded,
    },
    {
      detail: reviewApproved
        ? "Review approval is complete."
        : "Publish remains unavailable until review approval is complete.",
      label: "Review status",
      ready: reviewApproved,
    },
  ];
}

function buildWorkflowStatusByStep(
  workflowSteps: readonly {
    status: WorkflowStepStatus;
    step: CourseWorkflowStep;
  }[],
) {
  return workflowSteps.reduce<Partial<Record<CourseWorkflowStep, WorkflowStepStatus>>>(
    (summary, item) => {
      summary[item.step] = item.status;
      return summary;
    },
    {},
  );
}

function summarizeSourceAnchorForAdmin(
  handover: ReturnType<typeof getBuildToReviewHandoverFromChecklist>,
) {
  if (!handover) {
    return "Source anchor not recorded";
  }

  const status = handover.anchors.alignmentStatus || "Not recorded";
  const packageLabel = handover.anchors.sourcePackage || "Not recorded";
  const gap = handover.anchors.gap || "Not recorded";

  return `${status}. ${packageLabel}. Gap: ${gap}`;
}

export function filterAdminCourseWorkflowItems(
  items: AdminCourseWorkflowItem[],
  attention?: string,
) {
  if (!isAdminCourseAttentionFilter(attention)) {
    return items;
  }

  return items.filter((item) => item.attentionTags.includes(attention));
}

export function getAdminCourseStatusLabel(status: CourseVersionStatus) {
  switch (status) {
    case CourseVersionStatus.DRAFT:
      return "Draft";
    case CourseVersionStatus.CREATOR_REVIEW:
      return "Creator review";
    case CourseVersionStatus.SUBMITTED:
      return "Submitted for review";
    case CourseVersionStatus.RETURNED:
      return "Returned for changes";
    case CourseVersionStatus.APPROVED:
      return "Approved for publish";
    case CourseVersionStatus.PUBLISHED:
      return "Published";
    case CourseVersionStatus.REVISION_DRAFT:
      return "Revision draft";
    case CourseVersionStatus.REPLACED:
      return "Replaced";
    case CourseVersionStatus.ARCHIVED:
      return "Archived";
  }
}

export function getAdminCourseNextActionLabel(status: CourseVersionStatus) {
  switch (status) {
    case CourseVersionStatus.SUBMITTED:
      return "Open review";
    case CourseVersionStatus.APPROVED:
      return "Check publish readiness";
    case CourseVersionStatus.PUBLISHED:
      return "View learner catalog";
    case CourseVersionStatus.RETURNED:
      return "Creator revision needed";
    case CourseVersionStatus.CREATOR_REVIEW:
      return "Creator submission pending";
    case CourseVersionStatus.REVISION_DRAFT:
      return "Revision in progress";
    case CourseVersionStatus.DRAFT:
      return "Creator work in progress";
    case CourseVersionStatus.REPLACED:
      return "No action needed";
    case CourseVersionStatus.ARCHIVED:
      return "No action needed";
  }
}

export function summarizeWorkflowProgress(
  workflowSteps: readonly { status: WorkflowStepStatus }[],
) {
  const complete = workflowSteps.filter(
    (step) => step.status === WorkflowStepStatus.COMPLETE,
  ).length;
  const total = courseWorkflowSteps.length;

  return `${complete} of ${total} workflow steps complete`;
}

export function getAdminCourseAttentionTags(input: {
  blockers: readonly string[];
  publishReady: boolean | null;
  status: CourseVersionStatus;
  warnings: readonly string[];
}) {
  const tags: AdminCourseAttentionFilter[] = [];

  if (input.status === CourseVersionStatus.SUBMITTED) {
    tags.push("needs-review");
  }

  if (input.status === CourseVersionStatus.APPROVED) {
    tags.push("approved-publish");

    if (input.publishReady === false || input.blockers.length > 0) {
      tags.push("blocked-publish");
    }
  }

  if (input.status === CourseVersionStatus.RETURNED) {
    tags.push("returned");
  }

  if (input.status === CourseVersionStatus.PUBLISHED) {
    tags.push("published");
  }

  return tags;
}

function summarizeAdminCourseWorkflow(
  items: AdminCourseWorkflowItem[],
): AdminCourseWorkflowSummary {
  return {
    total: items.length,
    submitted: items.filter((item) => item.status === CourseVersionStatus.SUBMITTED)
      .length,
    approved: items.filter((item) => item.status === CourseVersionStatus.APPROVED)
      .length,
    blockedPublish: items.filter((item) =>
      item.attentionTags.includes("blocked-publish"),
    ).length,
    returned: items.filter((item) => item.status === CourseVersionStatus.RETURNED)
      .length,
    published: items.filter((item) => item.status === CourseVersionStatus.PUBLISHED)
      .length,
  };
}

function getAdminCourseStatusTone(status: CourseVersionStatus) {
  switch (status) {
    case CourseVersionStatus.SUBMITTED:
    case CourseVersionStatus.APPROVED:
      return "status-badge-published";
    case CourseVersionStatus.RETURNED:
      return "status-badge-blocked";
    case CourseVersionStatus.PUBLISHED:
      return "status-badge-ready";
    default:
      return "";
  }
}

function getAdminWorkflowStage(
  status: CourseVersionStatus,
  workflowSteps: readonly {
    status: WorkflowStepStatus;
    step: CourseWorkflowStep;
  }[],
) {
  switch (status) {
    case CourseVersionStatus.SUBMITTED:
      return "Formal review";
    case CourseVersionStatus.APPROVED:
      return "Publishing";
    case CourseVersionStatus.PUBLISHED:
      return "Published learning";
    case CourseVersionStatus.RETURNED:
      return "Creator revision";
    case CourseVersionStatus.REPLACED:
      return "Replaced";
    case CourseVersionStatus.ARCHIVED:
      return "Archived";
    default: {
      const nextStep = courseWorkflowSteps.find((step) => {
        const record = workflowSteps.find((item) => item.step === step.step);
        return record?.status !== WorkflowStepStatus.COMPLETE;
      });

      return nextStep?.label || "Workflow complete";
    }
  }
}

function buildWorkflowStepLabels(
  workflowSteps: readonly {
    status: WorkflowStepStatus;
    step: CourseWorkflowStep;
  }[],
) {
  return courseWorkflowSteps.map((definition) => {
    const status =
      workflowSteps.find((item) => item.step === definition.step)?.status ||
      WorkflowStepStatus.NOT_STARTED;

    return `${definition.label}: ${formatWorkflowStepStatus(status)}`;
  });
}

function formatWorkflowStepStatus(status: WorkflowStepStatus) {
  switch (status) {
    case WorkflowStepStatus.COMPLETE:
      return "complete";
    case WorkflowStepStatus.IN_PROGRESS:
      return "in progress";
    case WorkflowStepStatus.LOCKED:
      return "locked";
    case WorkflowStepStatus.NEEDS_ATTENTION:
      return "needs attention";
    case WorkflowStepStatus.NOT_STARTED:
      return "not started";
  }
}

function buildCourseBlockers({
  handoverBlockers,
  publishBlockers,
  status,
}: {
  handoverBlockers?: string[];
  publishBlockers?: string[];
  status: CourseVersionStatus;
}) {
  if (status === CourseVersionStatus.APPROVED) {
    return publishBlockers ?? [];
  }

  if (status === CourseVersionStatus.SUBMITTED) {
    return handoverBlockers ?? [];
  }

  return [];
}

function buildCourseWarnings({
  handoverWarnings,
  returnReason,
  status,
}: {
  handoverWarnings?: string[];
  returnReason?: string;
  status: CourseVersionStatus;
}) {
  if (status === CourseVersionStatus.RETURNED && returnReason) {
    return [returnReason];
  }

  return handoverWarnings ?? [];
}

function getAdminCourseNextActionHref({
  courseId,
  status,
  versionId,
}: {
  courseId: string;
  status: CourseVersionStatus;
  versionId: string;
}) {
  switch (status) {
    case CourseVersionStatus.SUBMITTED:
      return `/review/courses/${courseId}/versions/${versionId}`;
    case CourseVersionStatus.APPROVED:
      return "/review/publishing";
    case CourseVersionStatus.PUBLISHED:
      return "/courses";
    default:
      return null;
  }
}

function getAdminCourseNextActionNote(status: CourseVersionStatus) {
  switch (status) {
    case CourseVersionStatus.SUBMITTED:
      return "Use the existing Review screen for approval, return, pause, or specialist-review decisions.";
    case CourseVersionStatus.APPROVED:
      return "Use the existing Publish queue; publishing remains blocked until readiness checks pass.";
    case CourseVersionStatus.PUBLISHED:
      return "Learners can see this course according to its published visibility settings.";
    case CourseVersionStatus.RETURNED:
      return "Creator must address the recorded return reason before resubmission.";
    case CourseVersionStatus.REPLACED:
    case CourseVersionStatus.ARCHIVED:
      return "Historical version; no Admin action is exposed here.";
    default:
      return "Creator-side workflow is still in progress.";
  }
}

function getPublishReadinessFallbackLabel(status: CourseVersionStatus) {
  if (status === CourseVersionStatus.PUBLISHED) {
    return "Published";
  }

  if (status === CourseVersionStatus.REPLACED) {
    return "Replaced";
  }

  return "Not at publish gate";
}

function summarizeProgramCohort(
  cohortCourses: readonly {
    cohort: {
      name: string;
      program: { name: string } | null;
    };
    courseVersionId: string | null;
  }[],
) {
  if (cohortCourses.length === 0) {
    return "No program or cohort linked";
  }

  return cohortCourses
    .slice(0, 2)
    .map((item) =>
      item.cohort.program
        ? `${item.cohort.program.name} / ${item.cohort.name}`
        : item.cohort.name,
    )
    .join("; ");
}

function parseCourseVersionStatus(status: string | undefined) {
  if (!status) {
    return undefined;
  }

  return Object.values(CourseVersionStatus).includes(
    status as CourseVersionStatus,
  )
    ? (status as CourseVersionStatus)
    : undefined;
}

function isAdminCourseAttentionFilter(
  value: string | undefined,
): value is AdminCourseAttentionFilter {
  return adminCourseAttentionFilters.includes(
    value as AdminCourseAttentionFilter,
  );
}

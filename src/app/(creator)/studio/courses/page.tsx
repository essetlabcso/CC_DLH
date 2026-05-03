import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getCourseSetupStepStatus,
  getCourseStatusLabel,
  getCreatorCourses,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import { getReturnGuidanceFromChecklist } from "@/lib/review/decisions";

import { createCourseAction } from "../actions";

type StudioCoursesPageProps = {
  searchParams?: Promise<{
    revisionSubmitted?: string;
    submitted?: string;
  }>;
};

export default async function StudioCoursesPage({
  searchParams,
}: StudioCoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/studio/courses");
  const courses = await getCreatorCourses(prisma, {
    userId: identity.user.id,
    organizationId: identity.user.organizationId,
    role: identity.session.role,
  });
  const submittedCount = courses.filter(
    (course) => course.versions[0]?.status === "SUBMITTED",
  ).length;
  const returnedCount = courses.filter(
    (course) => course.versions[0]?.status === "RETURNED",
  ).length;
  const activeBuildCount = courses.filter((course) => {
    const version = course.versions[0];

    if (!version) {
      return false;
    }

    const buildStatus = getWorkflowStepStatus(
      version.workflowSteps,
      CourseWorkflowStep.BUILD,
    );

    return buildStatus === WorkflowStepStatus.IN_PROGRESS;
  }).length;

  return (
    <WorkspaceShell eyebrow="Course Creator Studio" title="My courses">
      <div className="studio-course-hero">
        <div>
          <p>
            Manage DEC courses you are preparing, reviewing, revising, or
            monitoring.
          </p>
          <div className="review-hero-status" aria-label="Studio course summary">
            <span className="status-badge">{courses.length} total</span>
            <span className="status-badge status-badge-ready">
              {activeBuildCount} in build
            </span>
            <span className="status-badge">{submittedCount} submitted</span>
            <span
              className={`status-badge ${
                returnedCount > 0 ? "status-badge-blocked" : ""
              }`}
            >
              {returnedCount} returned
            </span>
          </div>
        </div>
        <div className="studio-course-hero-action">
          <strong>Next creator move</strong>
          <span>
            Open the course with the most urgent status, or start a new course
            from setup.
          </span>
        </div>
      </div>
      {resolvedSearchParams?.submitted === "1" ? (
        <p className="workspace-note">
          Course submitted for formal review. Reviewers can now see it in their
          queue.
        </p>
      ) : null}
      {resolvedSearchParams?.revisionSubmitted === "1" ? (
        <p className="workspace-note">
          Revision submitted for formal review. Reviewers can now compare and
          decide the updated version.
        </p>
      ) : null}
      <div className="studio-actions" aria-label="Course actions">
        <form action={createCourseAction}>
          <button className="workspace-button" type="submit">
            Start course
          </button>
        </form>
        <Link className="workspace-link" href="/studio">
          Studio home
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="course-list course-list-spacious">
          {courses.map((course) => {
            const version = course.versions[0];
            const setupStatus = version
              ? getCourseSetupStepStatus(version.workflowSteps)
              : undefined;
            const diagnosisStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.DIAGNOSIS,
                )
              : undefined;
            const capacityMapStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.CAPACITY_MAP,
                )
              : undefined;
            const actionMapStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.ACTION_MAP,
                )
              : undefined;
            const storyboardStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.STORYBOARD,
                )
              : undefined;
            const buildStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.BUILD,
                )
              : undefined;
            const previewStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.PREVIEW,
                )
              : undefined;
            const creatorReviewStatus = version
              ? getWorkflowStepStatus(
                  version.workflowSteps,
                  CourseWorkflowStep.CREATOR_REVIEW,
                )
              : undefined;
            const returnGuidance =
              version?.status === "RETURNED"
                ? getReturnGuidanceFromChecklist(
                    version.reviewRecord?.checklist,
                    version.reviewRecord?.returnedReason,
                  )
                : null;
            const continueHref =
              version?.status === "RETURNED" && returnGuidance
                ? getReturnedResumeHref(course.id, returnGuidance.returnTarget)
                : version?.status === "SUBMITTED"
                ? "/studio/courses"
                : previewStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/creator-review`
                : buildStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/preview`
                : storyboardStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/build`
                : actionMapStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/storyboard`
                : capacityMapStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/action-map`
                : diagnosisStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/capacity-map`
                : setupStatus === WorkflowStepStatus.COMPLETE
                ? `/studio/courses/${course.id}/diagnosis`
                : `/studio/courses/${course.id}/setup`;
            const continueLabel =
              version?.status === "RETURNED" && returnGuidance
                ? returnGuidance.resumeLabel
                : version?.status === "SUBMITTED"
                ? "Submitted for review"
                : creatorReviewStatus === WorkflowStepStatus.COMPLETE
                ? "Ready to submit"
                : previewStatus === WorkflowStepStatus.COMPLETE
                ? "Continue creator review"
                : buildStatus === WorkflowStepStatus.COMPLETE
                ? "Continue preview"
                : buildStatus === WorkflowStepStatus.IN_PROGRESS
                ? "Continue build"
                : storyboardStatus === WorkflowStepStatus.COMPLETE
                ? "Continue build"
                : actionMapStatus === WorkflowStepStatus.COMPLETE
                ? "Continue storyboard"
                : capacityMapStatus === WorkflowStepStatus.COMPLETE
                  ? "Continue action map"
                : diagnosisStatus === WorkflowStepStatus.COMPLETE
                  ? "Continue capacity map"
                : setupStatus === WorkflowStepStatus.COMPLETE
                  ? "Continue diagnosis"
                  : "Continue setup";
            const workflowSteps = [
              ["Setup", setupStatus],
              ["Diagnosis", diagnosisStatus],
              ["Capacity", capacityMapStatus],
              ["Action", actionMapStatus],
              ["Storyboard", storyboardStatus],
              ["Build", buildStatus],
              ["Preview", previewStatus],
              ["Review", creatorReviewStatus],
            ] as const;

            return (
              <article className="course-row studio-course-card" key={course.id}>
                <div className="studio-course-card-main">
                  <div className="studio-course-card-heading">
                    <div>
                      <h2>{course.title}</h2>
                      <p>{getCourseStatusLabel(version?.status)}</p>
                    </div>
                    <span
                      className={`status-badge ${getCourseBadgeClass(
                        version?.status,
                      )}`}
                    >
                      {getCourseStatusLabel(version?.status)}
                    </span>
                  </div>
                  <div
                    className="studio-workflow-strip"
                    aria-label={`Workflow status for ${course.title}`}
                  >
                    {workflowSteps.map(([label, status]) => (
                      <span
                        className={`workflow-chip ${getStepChipClass(status)}`}
                        key={label}
                      >
                        {label}: {formatStepStatus(status)}
                      </span>
                    ))}
                  </div>
                  {returnGuidance ? (
                    <div className="next-step-panel">
                      <h3>{returnGuidance.decisionLabel}</h3>
                      <p>
                        Resume point: {returnGuidance.resumeStep}. Reason:{" "}
                        {returnGuidance.reason}
                      </p>
                      <p>Required action: {returnGuidance.requiredAction}</p>
                      {returnGuidance.affectedArea ? (
                        <p>
                          Affected area: {returnGuidance.affectedArea}
                          {returnGuidance.affectedItem
                            ? ` / ${returnGuidance.affectedItem}`
                            : ""}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <Link
                  className={`workspace-link ${
                    version?.status === "SUBMITTED" ? "" : "primary"
                  }`}
                  href={continueHref}
                >
                  {continueLabel}
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No courses in production yet</h2>
          <p>
            Start a course to create the first draft and begin Course Setup.
          </p>
        </div>
      )}
    </WorkspaceShell>
  );
}

function getReturnedResumeHref(courseId: string, target: string) {
  switch (target) {
    case "analysis":
      return `/studio/courses/${courseId}/diagnosis`;
    case "design":
      return `/studio/courses/${courseId}/storyboard`;
    case "build":
      return `/studio/courses/${courseId}/build`;
    default:
      return `/studio/courses/${courseId}/build`;
  }
}

function formatStepStatus(status: string | undefined) {
  switch (status) {
    case "COMPLETE":
      return "complete";
    case "IN_PROGRESS":
      return "in progress";
    case "LOCKED":
      return "locked";
    default:
      return "ready";
  }
}

function getStepChipClass(status: string | undefined) {
  switch (status) {
    case "COMPLETE":
      return "workflow-chip-complete";
    case "IN_PROGRESS":
      return "workflow-chip-active";
    case "LOCKED":
      return "workflow-chip-locked";
    default:
      return "workflow-chip-ready";
  }
}

function getCourseBadgeClass(status: string | undefined) {
  switch (status) {
    case "RETURNED":
      return "status-badge-blocked";
    case "PUBLISHED":
    case "SUBMITTED":
      return "status-badge-published";
    default:
      return "status-badge-ready";
  }
}

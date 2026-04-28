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

  return (
    <WorkspaceShell eyebrow="Course Creator Studio" title="My courses">
      <p>
        Manage DEC courses you are preparing, reviewing, revising, or monitoring.
      </p>
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
            const continueHref =
              version?.status === "SUBMITTED"
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
              version?.status === "SUBMITTED"
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

            return (
              <article className="course-row" key={course.id}>
                <div>
                  <h2>{course.title}</h2>
                  <p>
                    {getCourseStatusLabel(version?.status)} · Course Setup{" "}
                    {formatStepStatus(setupStatus)} · Diagnosis{" "}
                    {formatStepStatus(diagnosisStatus)} · Capacity Map{" "}
                    {formatStepStatus(capacityMapStatus)} · Action Map{" "}
                    {formatStepStatus(actionMapStatus)} · Storyboard{" "}
                    {formatStepStatus(storyboardStatus)} · Build{" "}
                    {formatStepStatus(buildStatus)} · Preview{" "}
                    {formatStepStatus(previewStatus)} · Creator Review{" "}
                    {formatStepStatus(creatorReviewStatus)}
                  </p>
                </div>
                <Link href={continueHref}>{continueLabel}</Link>
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

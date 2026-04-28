import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  creatorReviewFieldLabels,
} from "@/lib/studio/creator-review";
import {
  getCourseStatusLabel,
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";

import {
  completeCreatorReviewAction,
  submitCourseForReviewAction,
} from "../../../actions";

type CreatorReviewPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    completed?: string;
    error?: string;
    fields?: string;
    ready?: string;
  }>;
};

export default async function CreatorReviewPage({
  params,
  searchParams,
}: CreatorReviewPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/creator-review`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const previewStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.PREVIEW,
  );
  const creatorReviewStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.CREATOR_REVIEW,
  );

  if (previewStatus !== WorkflowStepStatus.COMPLETE) {
    return (
      <WorkspaceShell eyebrow="Creator Review" title={editable.course.title}>
        <p>
          Complete Preview checks before final creator-side quality review.
        </p>
        <nav className="workspace-nav" aria-label="Creator Review recovery">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/preview`}
          >
            Go to Preview
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const completeReviewAction = completeCreatorReviewAction.bind(null, courseId);
  const submitForReviewAction = submitCourseForReviewAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => creatorReviewFieldLabels[field] || field)
    : [];
  const moduleCount = editable.version.modules.length;
  const lessonCount = editable.version.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0,
  );
  const blockCount = editable.version.modules.reduce(
    (sum, module) =>
      sum +
      module.lessons.reduce(
        (lessonSum, lesson) => lessonSum + lesson.blocks.length,
        0,
      ),
    0,
  );

  return (
    <WorkspaceShell eyebrow="Creator Review" title={editable.course.title}>
      <p>
        Complete the final creator-side quality checkpoint before the course can
        move to formal review submission.
      </p>
      {resolvedSearchParams?.ready === "1" ? (
        <p className="workspace-note">
          Preview checks complete. Creator Review is ready.
        </p>
      ) : null}
      {resolvedSearchParams?.completed === "1" ? (
        <p className="workspace-note">
          Creator Review complete. This course is ready for the submit-for-review
          step.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "checks" ? (
        <p className="workspace-error">
          Complete the required Creator Review checks:{" "}
          {missingFields.join(", ")}.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="creator-review-summary">
        <h2 id="creator-review-summary">Review summary</h2>
        <div className="context-grid">
          <article>
            <strong>Course status</strong>
            <span>{getCourseStatusLabel(editable.version.status)}</span>
          </article>
          <article>
            <strong>Preview</strong>
            <span>{formatStepStatus(previewStatus)}</span>
          </article>
          <article>
            <strong>Content</strong>
            <span>
              {moduleCount} module, {lessonCount} lesson, {blockCount} blocks
            </span>
          </article>
          <article>
            <strong>Creator Review</strong>
            <span>{formatStepStatus(creatorReviewStatus)}</span>
          </article>
        </div>
      </section>

      {creatorReviewStatus === WorkflowStepStatus.COMPLETE ? (
        <div className="next-step-panel">
          <h2>Next step: Submit for Review</h2>
          {editable.version.status === "SUBMITTED" ? (
            <p>
              This course has been submitted and is waiting in the reviewer
              queue.
            </p>
          ) : (
            <>
              <p>
                The creator-side checkpoint is complete. Submit this version to
                the formal review queue.
              </p>
              <form action={submitForReviewAction} className="studio-actions">
                <button className="workspace-button" type="submit">
                  Submit for Review
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <section className="studio-section" aria-labelledby="creator-checks-title">
          <h2 id="creator-checks-title">Creator Review checks</h2>
          <form action={completeReviewAction} className="checklist-form">
            <label className="checkbox-row">
              <input name="actionMappingConfirmed" type="checkbox" />
              <span>
                The course still follows the Diagnosis, Capacity Map, and Action
                Map
              </span>
            </label>
            <label className="checkbox-row">
              <input name="accuracySourcesConfirmed" type="checkbox" />
              <span>Accuracy and source readiness have been checked</span>
            </label>
            <label className="checkbox-row">
              <input name="accessibilityMobileConfirmed" type="checkbox" />
              <span>Accessibility, mobile, and low-bandwidth readiness are acceptable</span>
            </label>
            <label className="checkbox-row">
              <input name="safeguardingConfirmed" type="checkbox" />
              <span>Safeguarding, civic-space, and local realism risks are checked</span>
            </label>
            <label className="checkbox-row">
              <input name="learnerCheckConfirmed" type="checkbox" />
              <span>Practice and learner checks support the intended action</span>
            </label>
            <label className="checkbox-row">
              <input name="plainLanguageConfirmed" type="checkbox" />
              <span>Language is clear for local and grassroots CSO learners</span>
            </label>
            <label className="checkbox-row">
              <input name="submissionReadinessConfirmed" type="checkbox" />
              <span>The course is ready for formal review submission</span>
            </label>
            <button className="workspace-button" type="submit">
              Complete Creator Review
            </button>
          </form>
        </section>
      )}

      <nav className="workspace-nav" aria-label="Creator Review actions">
        <Link
          className="workspace-link"
          href={`/studio/courses/${courseId}/preview`}
        >
          Back to Preview
        </Link>
        <Link
          className="workspace-link"
          href={`/studio/courses/${courseId}/build`}
        >
          Back to Build Studio
        </Link>
        <Link className="workspace-link" href="/studio/courses">
          My courses
        </Link>
      </nav>
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

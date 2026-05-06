import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  creatorReviewFieldLabels,
} from "@/lib/studio/creator-review";
import { buildBuildToReviewHandover } from "@/lib/studio/build-review-handover";
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
  const handover = buildBuildToReviewHandover({
    courseTitle: editable.course.title,
    version: editable.version,
  });

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
      {resolvedSearchParams?.error === "handover" ? (
        <p className="workspace-error">
          Resolve the blocking Build-to-Review handover warnings before
          submitting this course for formal review.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="anchors-title">
        <h2 id="anchors-title">Analysis & Design Anchors</h2>
        <div className="context-grid">
          <article>
            <strong>Capacity Area</strong>
            <span>{editable.version.analysisHandover?.capacityArea || "Not specified"}</span>
          </article>
          <article>
            <strong>Validated Gap</strong>
            <span>{editable.version.analysisHandover?.validatedCapacityGap || "Not specified"}</span>
          </article>
          <article>
            <strong>K/S/M/E Route</strong>
            <span>{editable.version.analysisHandover?.ksmeRoute || "Not specified"}</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="creator-review-summary">
        <h2 id="creator-review-summary">Review summary</h2>
        <div className="context-grid">
          <article>
            <strong>Course version</strong>
            <span>Version {editable.version.versionNumber} ({editable.version.sourceVersionId ? "Revision version" : "New course version"})</span>
          </article>
          <article>
            <strong>Course status</strong>
            <span>{getCourseStatusLabel(editable.version.status)}</span>
          </article>
          <article>
            <strong>Preview status</strong>
            <span>{formatStepStatus(previewStatus)}</span>
          </article>
          <article>
            <strong>Content summary</strong>
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

      <section className="studio-section" aria-labelledby="handover-title">
        <h2 id="handover-title">Build-to-Review Handover</h2>
        <p>
          This evidence package is what reviewers will use to understand what
          was built, what was added, and what needs attention before publishing
          can be considered.
        </p>
        <div className="context-grid">
          <article>
            <strong>Required blocks</strong>
            <span>{handover.summary.requiredBlockCount}</span>
          </article>
          <article>
            <strong>Creator-added blocks</strong>
            <span>{handover.summary.creatorAddedBlockCount}</span>
          </article>
          <article>
            <strong>Final test</strong>
            <span>{handover.finalTest.ready ? "Ready" : "Not ready"}</span>
          </article>
          <article>
            <strong>Certificate rule</strong>
            <span>{handover.certificateRule}</span>
          </article>
          <article>
            <strong>AI review</strong>
            <span>{handover.aiReview.status}</span>
          </article>
          <article>
            <strong>Preview</strong>
            <span>{handover.preview.status}</span>
          </article>
          <article>
            <strong>Practical proof</strong>
            <span>{handover.practicalProof.status}</span>
            <p>{handover.practicalProof.summary}</p>
          </article>
        </div>
        {handover.blockingWarnings.length > 0 ? (
          <div className="workspace-error">
            <strong>Blocking warnings</strong>
            <ul>
              {handover.blockingWarnings.map((warning) => (
                <li key={`${warning.code}-${warning.message}`}>
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="workspace-note">
            No blocking handover warnings. This course can move to formal
            review after Creator Review is complete.
          </p>
        )}
        {handover.reviewerAttentionItems.length > 0 ? (
          <div className="next-step-panel">
            <h3>Reviewer attention items</h3>
            <ul>
              {handover.reviewerAttentionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {creatorReviewStatus === WorkflowStepStatus.COMPLETE ? (
        <div className="next-step-panel">
          <h2>Next step: Submit for Review</h2>
          {editable.version.status === "SUBMITTED" ? (
            <p>
              This course has been submitted and is waiting in the reviewer
              queue.
            </p>
          ) : handover.blockingWarnings.length > 0 ? (
            <p>
              Submission is blocked until the Build-to-Review handover warnings
              are resolved.
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
              <span>The course is ready for formal review submission (with no raw proof or learner data)</span>
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

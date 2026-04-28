import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  approveSubmittedCourseAction,
  returnSubmittedCourseAction,
} from "@/app/(review)/review/actions";
import {
  reviewerApprovalFieldLabels,
  reviewerReturnFieldLabels,
} from "@/lib/review/decisions";
import {
  getBlockTypeLabel,
  parseBuildBlockContent,
} from "@/lib/studio/build-studio";
import {
  countReviewBlocks,
  formatSubmittedDate,
  getReviewQueueStatusLabel,
  getReviewVersionTypeLabel,
} from "@/lib/review/queue";
import { getBuildToReviewHandoverFromChecklist } from "@/lib/studio/build-review-handover";

type SubmittedVersionReviewPageProps = {
  params?: Promise<{
    courseId?: string;
    versionId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    fields?: string;
  }>;
};

export default async function SubmittedVersionReviewPage({
  params,
  searchParams,
}: SubmittedVersionReviewPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;
  const versionId = resolvedParams?.versionId;

  if (!courseId || !versionId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/review/courses/${courseId}/versions/${versionId}`,
  );
  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      createdBy: true,
      reviewRecord: true,
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
    },
  });

  if (!version) {
    notFound();
  }

  const approveMissingFields = getMissingFieldLabels(
    resolvedSearchParams,
    "approve",
    reviewerApprovalFieldLabels,
  );
  const returnMissingFields = getMissingFieldLabels(
    resolvedSearchParams,
    "return",
    reviewerReturnFieldLabels,
  );
  const handover = getBuildToReviewHandoverFromChecklist(
    version.reviewRecord?.checklist,
  );

  return (
    <WorkspaceShell
      eyebrow={version.sourceVersionId ? "Submitted Revision" : "Submitted Version"}
      title={version.course.title}
    >
      <p>
        Review the learner experience, record checklist evidence, and either
        approve the course for publishing handoff or return it to the creator
        for changes.
      </p>

      <section className="studio-section" aria-labelledby="review-meta-title">
        <h2 id="review-meta-title">Submission details</h2>
        <div className="context-grid">
          <article>
            <strong>Status</strong>
            <span>{getReviewQueueStatusLabel(version.status)}</span>
          </article>
          <article>
            <strong>Version type</strong>
            <span>{getReviewVersionTypeLabel(version)}</span>
          </article>
          <article>
            <strong>Submitted</strong>
            <span>{formatSubmittedDate(version.submittedAt)}</span>
          </article>
          <article>
            <strong>Creator</strong>
            <span>{version.createdBy.name}</span>
          </article>
          <article>
            <strong>Review size</strong>
            <span>{countReviewBlocks(version.modules)} lesson blocks</span>
          </article>
        </div>
      </section>

      {version.reviewRecord?.decisionNotes ? (
        <p className="workspace-note">{version.reviewRecord.decisionNotes}</p>
      ) : null}

      {approveMissingFields.length > 0 ? (
        <p className="workspace-error">
          Complete the required approval checks:{" "}
          {approveMissingFields.join(", ")}.
        </p>
      ) : null}
      {returnMissingFields.length > 0 ? (
        <p className="workspace-error">
          Add reviewer comments before returning the course:{" "}
          {returnMissingFields.join(", ")}.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="handover-title">
        <h2 id="handover-title">Build-to-Review Handover</h2>
        {handover ? (
          <>
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
                <strong>Accessibility</strong>
                <span>{handover.accessibility.status}</span>
              </article>
              <article>
                <strong>Safeguarding</strong>
                <span>{handover.safeguarding.status}</span>
              </article>
              <article>
                <strong>Preview</strong>
                <span>{handover.preview.status}</span>
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
                No blocking handover warnings were recorded at submission.
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
            <div className="decision-grid">
              <article>
                <h3>Required Storyboard blocks</h3>
                {handover.requiredBlocks.length > 0 ? (
                  <ul>
                    {handover.requiredBlocks.map((block) => (
                      <li key={block.id}>
                        {block.title} · {block.type} · {block.purposeLink}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No required blocks recorded.</p>
                )}
              </article>
              <article>
                <h3>Creator-added blocks</h3>
                {handover.creatorAddedBlocks.length > 0 ? (
                  <ul>
                    {handover.creatorAddedBlocks.map((block) => (
                      <li key={block.id}>
                        {block.title} · {block.type} ·{" "}
                        {block.justification || "No justification"} ·{" "}
                        {block.purposeLink || "No purpose link"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No creator-added blocks recorded.</p>
                )}
              </article>
            </div>
          </>
        ) : (
          <p className="workspace-error">
            Build-to-Review handover evidence was not found in this submission.
          </p>
        )}
      </section>

      <section className="studio-section" aria-labelledby="review-preview-title">
        <h2 id="review-preview-title">Runtime preview</h2>
        <div className="learner-preview-shell">
          {version.modules.map((module) => (
            <section className="preview-module" key={module.id}>
              <h3>{module.title}</h3>
              {module.lessons.map((lesson) => (
                <article className="preview-lesson" key={lesson.id}>
                  <h4>{lesson.title}</h4>
                  <div className="preview-block-list">
                    {lesson.blocks.map((block) => {
                      const content = parseBuildBlockContent(block.content);

                      return (
                        <section className="preview-block" key={block.id}>
                          <p className="preview-block-kind">
                            {getBlockTypeLabel(block.type)}
                          </p>
                          <h5>
                            {content.title || getBlockTypeLabel(block.type)}
                          </h5>
                          {content.body ? <p>{content.body}</p> : null}
                          {content.prompt ? (
                            <div className="preview-prompt">
                              <strong>Question</strong>
                              <p>{content.prompt}</p>
                            </div>
                          ) : null}
                        </section>
                      );
                    })}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>

      <section className="studio-section" aria-labelledby="decision-title">
        <h2 id="decision-title">Reviewer decision</h2>
        <div className="decision-grid">
          <form
            action={approveSubmittedCourseAction.bind(
              null,
              courseId,
              versionId,
            )}
            className="checklist-form"
          >
            <h3>Approve for publishing handoff</h3>
            <p className="section-subcopy">
              Approval confirms that this submitted version is ready for the
              separate publishing step.
            </p>
            <label className="checkbox-row">
              <input name="runtimePreviewConfirmed" type="checkbox" />
              <span>
                Runtime preview works as a focused learner experience.
              </span>
            </label>
            <label className="checkbox-row">
              <input name="actionAlignmentConfirmed" type="checkbox" />
              <span>
                The lesson blocks align to the capacity goal and observable
                learner actions.
              </span>
            </label>
            <label className="checkbox-row">
              <input name="accessibilityMobileConfirmed" type="checkbox" />
              <span>
                The course is readable, accessible, and usable on smaller
                screens.
              </span>
            </label>
            <label className="checkbox-row">
              <input name="safeguardingConfirmed" type="checkbox" />
              <span>
                Safeguarding, civic-space sensitivity, and learner safety have
                been reviewed.
              </span>
            </label>
            <label className="checkbox-row">
              <input name="assessmentConfirmed" type="checkbox" />
              <span>
                Practice, checks, and feedback support the intended learning
                outcome.
              </span>
            </label>
            <label className="checkbox-row">
              <input name="sourcesConfirmed" type="checkbox" />
              <span>
                Sources, examples, and credibility cues are appropriate for
                publication readiness.
              </span>
            </label>
            <label>
              <span>Reviewer notes</span>
              <textarea name="decisionNotes" />
            </label>
            <button className="workspace-button" type="submit">
              Approve course
            </button>
          </form>

          <form
            action={returnSubmittedCourseAction.bind(null, courseId, versionId)}
            className="checklist-form"
          >
            <h3>Return for changes</h3>
            <p className="section-subcopy">
              Use this when the creator needs clear review comments before the
              course can be approved.
            </p>
            <label>
              <span>Return comments</span>
              <textarea name="returnedReason" />
            </label>
            <button className="workspace-button" type="submit">
              Return for changes
            </button>
          </form>
        </div>
      </section>

      <div className="next-step-panel">
        <h2>Publishing remains separate</h2>
        <p>
          Approval records review readiness only. Publishing will use its own
          controlled step after reviewer approval.
        </p>
      </div>

      <nav className="workspace-nav" aria-label="Submitted version actions">
        <Link className="workspace-link primary" href="/review/queue">
          Back to queue
        </Link>
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

function getMissingFieldLabels(
  searchParams:
    | {
        error?: string;
        fields?: string;
      }
    | undefined,
  error: string,
  labels: Record<string, string>,
) {
  if (searchParams?.error !== error || !searchParams.fields) {
    return [];
  }

  return searchParams.fields
    .split(",")
    .filter(Boolean)
    .map((field) => labels[field] || field);
}

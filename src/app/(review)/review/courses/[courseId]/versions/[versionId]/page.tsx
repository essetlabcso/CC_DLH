import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  approveSubmittedCourseAction,
  pauseSubmittedCourseAction,
  requireSpecialistReviewAction,
  returnSubmittedCourseAction,
} from "@/app/(review)/review/actions";
import {
  getReviewerReviewFromChecklist,
  hasUnresolvedSpecialistReview,
  reviewerPauseFieldLabels,
  reviewerApprovalFieldLabels,
  reviewerReturnFieldLabels,
  reviewerSpecialistFieldLabels,
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
    reasonShort?: string;
    blockers?: string;
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
      course:
        identity.session.role === "admin"
          ? {}
          : { organizationId: identity.user.organizationId },
    },
    include: {
      course: {
        include: {
          organization: true,
        },
      },
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
  const specialistMissingFields = getMissingFieldLabels(
    resolvedSearchParams,
    "specialistReview",
    reviewerSpecialistFieldLabels,
  );
  const pauseMissingFields = getMissingFieldLabels(
    resolvedSearchParams,
    "pause",
    reviewerPauseFieldLabels,
  );
  const handover = getBuildToReviewHandoverFromChecklist(
    version.reviewRecord?.checklist,
  );
  const reviewerReview = getReviewerReviewFromChecklist(
    version.reviewRecord?.checklist,
  );
  const approvalBlockedBySpecialist =
    resolvedSearchParams?.error === "specialist";
  const approvalBlockedByBlockers =
    resolvedSearchParams?.error === "approve-blocked";
  const blockerCodes = resolvedSearchParams?.blockers
    ? resolvedSearchParams.blockers.split(",")
    : [];
  const lessonCount = version.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
  const blockCount = countReviewBlocks(version.modules);
  const blockingWarningCount = handover?.blockingWarnings.length || 0;
  const reasonShort = resolvedSearchParams?.error && resolvedSearchParams?.reasonShort === "1";

  return (
    <WorkspaceShell
      eyebrow={version.sourceVersionId ? "Submitted Revision" : "Submitted Version"}
      title={version.course.title}
    >
      <div className="review-hero">
        <p>
          Review the learner experience, record checklist evidence, and either
          approve the course for publishing handoff or return it to the creator
          for changes.
        </p>
        <div className="review-hero-status" aria-label="Review summary">
          <span className="status-badge status-badge-published">
            {getReviewQueueStatusLabel(version.status)}
          </span>
          <span className="status-badge">{getReviewVersionTypeLabel(version)}</span>
          <span
            className={`status-badge ${
              blockingWarningCount > 0
                ? "status-badge-blocked"
                : "status-badge-ready"
            }`}
          >
            {blockingWarningCount > 0
              ? `${blockingWarningCount} blocker${
                  blockingWarningCount === 1 ? "" : "s"
                }`
              : "No blockers recorded"}
          </span>
        </div>
      </div>

      <section className="studio-section" aria-labelledby="review-meta-title">
        <div className="section-heading-row">
          <div>
            <h2 id="review-meta-title">Submission details</h2>
            <p className="section-subcopy">
              Core review context for this submitted course version.
            </p>
          </div>
        </div>
        <div className="context-grid">
          <article>
            <strong>Organization</strong>
            <span>{version.course.organization.name}</span>
          </article>
          <article>
            <strong>Status</strong>
            <span className="status-badge status-badge-published">
              {getReviewQueueStatusLabel(version.status)}
            </span>
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
            <span>
              {version.modules.length} modules · {lessonCount} lessons ·{" "}
              {blockCount} lesson blocks
            </span>
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
          Complete the structured return routing fields:{" "}
          {returnMissingFields.join(", ")}.
        </p>
      ) : null}
      {specialistMissingFields.length > 0 ? (
        <p className="workspace-error">
          Complete the specialist review fields:{" "}
          {specialistMissingFields.join(", ")}.
        </p>
      ) : null}
      {pauseMissingFields.length > 0 ? (
        <p className="workspace-error">
          Complete the pause decision fields: {pauseMissingFields.join(", ")}.
        </p>
      ) : null}
      {reasonShort ? (
        <p className="workspace-error">
          All review decision reasons and actions must be at least 20 characters long to ensure a meaningful audit trail.
        </p>
      ) : null}
      {approvalBlockedBySpecialist ? (
        <p className="workspace-error">
          Approval is blocked because specialist review is still required.
          Return the course with clear action, or complete specialist review
          outside this slice before approval.
        </p>
      ) : null}
      {approvalBlockedByBlockers ? (
        <div className="workspace-error" style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Approval is blocked because the handover still has unresolved readiness issues:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", margin: 0 }}>
            {blockerCodes.includes("missing-handover") && <li>Build-to-Review handover is missing</li>}
            {blockerCodes.includes("handover-blockers") && <li>Handover has active blocking warning(s)</li>}
            {blockerCodes.includes("final-test-not-ready") && <li>Final test is required for this certificate-bearing course but is not ready</li>}
            {blockerCodes.includes("ai-review-pending") && <li>There are AI draft block(s) pending human review</li>}
            {blockerCodes.includes("practical-proof-unsafe") && <li>Practical proof configuration is not safely configured</li>}
            {blockerCodes.includes("specialist-review-unresolved") && <li>Approval is blocked by an unresolved specialist review</li>}
            {blockerCodes.includes("invalid-status") && <li>Course version is not currently submitted for review</li>}
          </ul>
        </div>
      ) : null}
      {reviewerReview ? (
        <section
          className="studio-section review-routing-panel"
          aria-labelledby="routing-title"
        >
          <div className="section-heading-row">
            <div>
              <h2 id="routing-title">Current review routing</h2>
              <p className="section-subcopy">
                Any recorded review decision or routing note on this submitted
                version.
              </p>
            </div>
          </div>
          <div className="context-grid">
            <article>
              <strong>Decision</strong>
              <span>
                {reviewerReview.decisionLabel ||
                  reviewerReview.decisionType ||
                  "Recorded"}
              </span>
            </article>
            <article>
              <strong>Specialist review</strong>
              <span>
                {reviewerReview.specialistReviewRequired
                  ? "Required"
                  : "Not required"}
              </span>
            </article>
            <article>
              <strong>Return target</strong>
              <span>{reviewerReview.returnTarget || "Not returned"}</span>
            </article>
          </div>
          {reviewerReview.comments?.length ? (
            <ul>
              {reviewerReview.comments.map((comment) => (
                <li key={comment.id}>
                  {comment.severity}: {comment.affectedArea}
                  {comment.affectedItem ? ` / ${comment.affectedItem}` : ""} -{" "}
                  {comment.comment} Required action: {comment.requiredAction}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="studio-section" aria-labelledby="handover-title">
        <div className="section-heading-row">
          <div>
            <h2 id="handover-title">Build-to-Review Handover & Evidence</h2>
            <p className="section-subcopy">
              Comprehensive evidence, anchors, and registers submitted by the creator before this review step.
            </p>
          </div>
          {handover ? (
            <span
              className={`status-badge ${
                blockingWarningCount > 0
                  ? "status-badge-blocked"
                  : "status-badge-ready"
              }`}
            >
              {blockingWarningCount > 0 ? "Needs attention" : "Ready to review"}
            </span>
          ) : null}
        </div>
        {handover ? (
          <>
            {/* Anchors and Meta Context */}
            <div className="context-grid review-anchors-grid" style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
              <article>
                <strong>Capacity Area</strong>
                <span>{handover.anchors?.capacityArea || "Not specified"}</span>
              </article>
              <article>
                <strong>Validated Capacity Gap</strong>
                <span>{handover.anchors?.gap || "Not specified"}</span>
              </article>
              <article>
                <strong>K/S/M/E Route Anchor</strong>
                <span>{handover.anchors?.route || "Not specified"}</span>
              </article>
            </div>

            <div className="context-grid review-readiness-grid" style={{ marginBottom: "1.5rem" }}>
              <article>
                <strong>Required blocks count</strong>
                <span>{handover.summary.requiredBlockCount}</span>
              </article>
              <article>
                <strong>Creator-added blocks count</strong>
                <span>{handover.summary.creatorAddedBlockCount}</span>
              </article>
              <article>
                <strong>Final test</strong>
                <span
                  className={`status-badge ${
                    handover.finalTest.ready
                      ? "status-badge-ready"
                      : "status-badge-blocked"
                  }`}
                >
                  {handover.finalTest.ready ? "Ready" : "Not ready"}
                </span>
              </article>
              <article>
                <strong>Certificate rule</strong>
                <span>{handover.certificateRule}</span>
              </article>
              <article>
                <strong>AI review status</strong>
                <span className={getEvidenceBadgeClass(handover.aiReview.status)}>
                  {handover.aiReview.status}
                </span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
                  Pending: {handover.aiReview.pendingCount} · Reviewed: {handover.aiReview.reviewedCount}
                </p>
              </article>
              <article>
                <strong>Accessibility Notes</strong>
                <span className={getEvidenceBadgeClass(handover.accessibility.status)}>
                  {handover.accessibility.status}
                </span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
                  With notes: {handover.accessibility.blocksWithNotes} · Missing: {handover.accessibility.blocksMissingNotes}
                </p>
              </article>
              <article>
                <strong>Safeguarding Notes</strong>
                <span className={getEvidenceBadgeClass(handover.safeguarding.status)}>
                  {handover.safeguarding.status}
                </span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
                  With notes: {handover.safeguarding.blocksWithNotes} · Missing: {handover.safeguarding.blocksMissingNotes}
                </p>
              </article>
              <article>
                <strong>Preview checks</strong>
                <span className={getEvidenceBadgeClass(handover.preview.status)}>
                  {handover.preview.status}
                </span>
              </article>
              <article>
                <strong>Creator review</strong>
                <span className={getEvidenceBadgeClass(handover.creatorReview?.status || "locked")}>
                  {handover.creatorReview?.status || "locked"}
                </span>
              </article>
              <article style={{ gridColumn: "span 2" }}>
                <strong>Practical proof configuration</strong>
                <span
                  className={getEvidenceBadgeClass(
                    handover.practicalProof?.status || "Not recorded",
                  )}
                >
                  {handover.practicalProof?.status || "Not recorded"}
                </span>
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {handover.practicalProof?.summary ||
                    "No practical proof configuration evidence was recorded."}
                </p>
                <div className="workspace-note" style={{ marginTop: "0.5rem", fontSize: "0.85rem", padding: "0.5rem" }}>
                  <strong>Important:</strong> Under binding rule, the optional practical proof/verified achievement remains separate from the course certificate.
                </div>
              </article>
            </div>

            {handover.blockingWarnings.length > 0 ? (
              <div className="blocker-panel" style={{ marginBottom: "1.5rem" }}>
                <strong>Blocking warnings ({handover.blockingWarnings.length})</strong>
                <ul>
                  {handover.blockingWarnings.map((warning) => (
                    <li key={`${warning.code}-${warning.message}`}>
                      {warning.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="review-success-note" style={{ marginBottom: "1.5rem" }}>
                No blocking handover warnings were recorded at submission.
              </p>
            )}

            {handover.reviewerAttentionItems.length > 0 ? (
              <div className="next-step-panel" style={{ marginBottom: "1.5rem" }}>
                <h3>Reviewer attention items ({handover.reviewerAttentionItems.length})</h3>
                <ul>
                  {handover.reviewerAttentionItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="decision-grid review-evidence-grid">
              <article className="review-evidence-card">
                <h3>Required Storyboard blocks ({handover.requiredBlocks.length})</h3>
                {handover.requiredBlocks.length > 0 ? (
                  <ul>
                    {handover.requiredBlocks.map((block) => (
                      <li key={block.id} style={{ marginBottom: "0.5rem" }}>
                        <strong>{block.title}</strong> · <em>{block.type}</em><br />
                        <span style={{ fontSize: "0.85rem" }}>Purpose link: {block.purposeLink || "None"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No required blocks recorded.</p>
                )}
              </article>
              <article className="review-evidence-card">
                <h3>Creator-added blocks ({handover.creatorAddedBlocks.length})</h3>
                {handover.creatorAddedBlocks.length > 0 ? (
                  <ul>
                    {handover.creatorAddedBlocks.map((block) => (
                      <li key={block.id} style={{ marginBottom: "0.5rem" }}>
                        <strong>{block.title}</strong> · <em>{block.type}</em><br />
                        <span style={{ fontSize: "0.85rem" }}>Justification: {block.justification || "No justification provided"}</span><br />
                        <span style={{ fontSize: "0.85rem" }}>Purpose link: {block.purposeLink || "No purpose link"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No creator-added blocks recorded.</p>
                )}
              </article>
              <article className="review-evidence-card">
                <h3>Practical proof configuration details</h3>
                {handover.practicalProof?.enabled ? (
                  <ul>
                    <li>Title: {handover.practicalProof.proofTitle}</li>
                    <li>
                      Accepted proof:{" "}
                      {handover.practicalProof.acceptedProofTypeLabel}
                    </li>
                    <li>
                      Format: {handover.practicalProof.submissionFormatLabel}
                    </li>
                    <li>
                      Raw proof visibility:{" "}
                      {handover.practicalProof.visibilityDefault}
                    </li>
                    <li>
                      Certificate remains separate:{" "}
                      {handover.practicalProof.certificateSeparation}
                    </li>
                    <li>
                      Donor visibility:{" "}
                      {handover.practicalProof.donorVisibilityEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </li>
                  </ul>
                ) : (
                  <p>
                    Practical proof is not enabled. Course certificates remain
                    based on the final test only.
                  </p>
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
        <div className="section-heading-row">
          <div>
            <h2 id="review-preview-title">Runtime preview</h2>
            <p className="section-subcopy">
              A read-only view of the learner-facing lesson structure.
            </p>
          </div>
        </div>
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
        <div className="section-heading-row">
          <div>
            <h2 id="decision-title">Reviewer decision</h2>
            <p className="section-subcopy">
              Choose one review outcome. Approval moves this version to the
              separate DEC Admin publishing step.
            </p>
          </div>
          <span className="status-badge">Publishing stays separate</span>
        </div>
        <div className="decision-grid">
          <form
            action={approveSubmittedCourseAction.bind(
              null,
              courseId,
              versionId,
            )}
            className="checklist-form review-decision-form review-decision-form-primary"
          >
            <h3>Approve for publishing handoff</h3>
            <p className="section-subcopy">
              Approval confirms that this submitted version is ready for the
              separate publishing step.
            </p>

            {/* Decision Readiness Warnings */}
            {blockingWarningCount > 0 || !handover || (handover.aiReview?.pendingCount ?? 0) > 0 || !(handover.finalTest?.ready ?? false) || (version.reviewRecord?.checklist && hasUnresolvedSpecialistReview(version.reviewRecord.checklist)) ? (
              <div className="blocker-panel" style={{ marginBottom: "1.5rem", backgroundColor: "#fff5f5", borderColor: "#feb2b2", padding: "1rem", borderRadius: "0.375rem" }}>
                <strong style={{ color: "#c53030", display: "block", marginBottom: "0.5rem" }}>⚠️ Decision Readiness Warnings:</strong>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#9b2c2c", fontSize: "0.9rem" }}>
                  {!handover ? (
                    <li>Handover evidence not found in this submission.</li>
                  ) : (
                    <>
                      {handover.blockingWarnings.map((warning, idx) => (
                        <li key={idx} style={{ marginBottom: "0.25rem" }}>{warning.message}</li>
                      ))}
                      {(handover.aiReview?.pendingCount ?? 0) > 0 && (
                        <li style={{ marginBottom: "0.25rem" }}>There are {handover.aiReview.pendingCount} AI draft block(s) pending human review.</li>
                      )}
                      {!(handover.finalTest?.ready ?? false) && (
                        <li style={{ marginBottom: "0.25rem" }}>Final test is required but not ready.</li>
                      )}
                    </>
                  )}
                  {version.reviewRecord?.checklist && hasUnresolvedSpecialistReview(version.reviewRecord.checklist) && (
                    <li style={{ marginBottom: "0.25rem" }}>Approval is blocked by an unresolved specialist review.</li>
                  )}
                </ul>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "#9b2c2c", fontWeight: "bold" }}>
                  {"Please resolve these blockers or use 'Return with routing' / 'Require specialist review' instead of approving."}
                </p>
              </div>
            ) : null}

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
            <label className="checkbox-row">
              <input name="certificateRuleConfirmed" type="checkbox" />
              <span>
                Final test and certificate copy preserve the rule: 80%+ final
                test score = pass and automated course certificate.
              </span>
            </label>
            <label>
              <span>Reviewer notes</span>
              <textarea name="decisionNotes" required minLength={20} />
            </label>
            <button className="workspace-button" type="submit">
              Approve course
            </button>
          </form>

          <form
            action={returnSubmittedCourseAction.bind(null, courseId, versionId)}
            className="checklist-form review-decision-form"
          >
            <h3>Return with routing</h3>
            <p className="section-subcopy">
              Use this when the creator needs clear review comments before the
              course can be approved.
            </p>
            <label>
              <span>Return target</span>
              <select name="returnTarget" defaultValue="build">
                <option value="build">Return to Build</option>
                <option value="design">Return to Design</option>
                <option value="analysis">Return to Analysis</option>
                <option value="general">General return</option>
              </select>
            </label>
            <label>
              <span>Severity</span>
              <select name="severity" defaultValue="required-fix">
                <option value="minor">Minor</option>
                <option value="required-fix">Required fix</option>
                <option value="blocking">Blocking</option>
                <option value="specialist-review">Specialist review</option>
              </select>
            </label>
            <label>
              <span>Affected area</span>
              <input
                name="affectedArea"
                placeholder="Build, Design, Analysis, final test, accessibility"
                required
                minLength={5}
              />
            </label>
            <label>
              <span>Affected block or item</span>
              <input name="affectedItem" placeholder="Optional block or item" />
            </label>
            <label>
              <span>Reviewer comment</span>
              <textarea name="reviewerComment" required minLength={20} />
            </label>
            <label>
              <span>Required action</span>
              <textarea name="requiredAction" required minLength={20} />
            </label>
            <button className="workspace-button secondary" type="submit">
              Return to creator
            </button>
          </form>

          <form
            action={requireSpecialistReviewAction.bind(
              null,
              courseId,
              versionId,
            )}
            className="checklist-form review-decision-form"
          >
            <h3>Require specialist review</h3>
            <p className="section-subcopy">
              Use this for safeguarding, civic-space, accessibility, data,
              legal, or other specialist review needs. Normal approval remains
              blocked while this is open.
            </p>
            <label>
              <span>Specialist review area</span>
              <input
                name="affectedArea"
                placeholder="Safeguarding, accessibility, data safety"
                required
                minLength={5}
              />
            </label>
            <label>
              <span>Affected block or item</span>
              <input name="affectedItem" placeholder="Optional block or item" />
            </label>
            <label>
              <span>Reason</span>
              <textarea name="reviewerComment" required minLength={20} />
            </label>
            <label>
              <span>Required specialist action</span>
              <textarea name="requiredAction" required minLength={20} />
            </label>
            <button className="workspace-button secondary" type="submit">
              Flag specialist review
            </button>
          </form>

          <form
            action={pauseSubmittedCourseAction.bind(null, courseId, versionId)}
            className="checklist-form review-decision-form"
          >
            <h3>Not approved / pause</h3>
            <p className="section-subcopy">
              Use this when the course should not proceed in its current form.
            </p>
            <label>
              <span>Affected area</span>
              <input name="affectedArea" required minLength={5} />
            </label>
            <label>
              <span>Affected block or item</span>
              <input name="affectedItem" placeholder="Optional block or item" />
            </label>
            <label>
              <span>Pause reason</span>
              <textarea name="reviewerComment" required minLength={20} />
            </label>
            <label>
              <span>Required next action</span>
              <textarea name="requiredAction" required minLength={20} />
            </label>
            <button className="workspace-button secondary" type="submit">
              Pause course
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

function getEvidenceBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("ready") ||
    normalized.includes("complete") ||
    normalized.includes("approved") ||
    normalized.includes("passed")
  ) {
    return "status-badge status-badge-ready";
  }

  if (
    normalized.includes("blocked") ||
    normalized.includes("missing") ||
    normalized.includes("required") ||
    normalized.includes("not ")
  ) {
    return "status-badge status-badge-blocked";
  }

  return "status-badge";
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

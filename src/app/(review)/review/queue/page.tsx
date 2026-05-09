import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  formatSubmittedDate,
  getReviewQueueStatusLabel,
} from "@/lib/review/queue";
import { getReviewerReviewFromChecklist } from "@/lib/review/decisions";
import {
  getBuildToReviewHandoverFromChecklist,
} from "@/lib/studio/build-review-handover";

type ReviewQueuePageProps = {
  searchParams?: Promise<{
    approved?: string;
    returned?: string;
    specialist?: string;
    paused?: string;
  }>;
};

export default async function ReviewQueuePage({
  searchParams,
}: ReviewQueuePageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/queue");
  const submittedVersions = await prisma.courseVersion.findMany({
    where: {
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
        include: {
          lessons: {
            include: {
              blocks: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Review Queue" title="Submitted courses">
      <p>
        Open submitted course versions for runtime preview, checklist review,
        return comments, and approval decisions.
      </p>

      {resolvedSearchParams?.approved === "1" ? (
        <p className="workspace-note">
          Course approved. Publishing remains a separate controlled step.
        </p>
      ) : null}
      {resolvedSearchParams?.returned === "1" ? (
        <p className="workspace-note">
          Course returned to the creator with reviewer comments.
        </p>
      ) : null}
      {resolvedSearchParams?.specialist === "1" ? (
        <p className="workspace-note">
          Specialist review requirement recorded. Approval remains blocked
          until that review is resolved.
        </p>
      ) : null}
      {resolvedSearchParams?.paused === "1" ? (
        <p className="workspace-note">
          Course paused and returned with reviewer routing guidance.
        </p>
      ) : null}

      {submittedVersions.length > 0 ? (
        <div className="course-list course-list-spacious">
          {submittedVersions.map((version) => {
            const handover = getBuildToReviewHandoverFromChecklist(
              version.reviewRecord?.checklist,
            );
            const reviewerReview = getReviewerReviewFromChecklist(
              version.reviewRecord?.checklist,
            );

            return (
              <article className="course-row review-queue-card" key={version.id}>
                <div className="review-queue-card-main" style={{ width: "100%" }}>
                  <div className="review-queue-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ margin: 0 }}>{version.course.title}</h2>
                    <span className="status-badge status-badge-published">
                      {getReviewQueueStatusLabel(version.status, version.reviewRecord?.checklist)}
                    </span>
                  </div>
                  
                  <div className="context-grid review-queue-card-grid" style={{ marginBottom: "1rem" }}>
                    <article>
                      <strong>Organization</strong>
                      <span>{version.course.organization.name}</span>
                    </article>
                    <article>
                      <strong>Version & Submission</strong>
                      <span>
                        Version {version.versionNumber} · {version.sourceVersionId ? "Revision submission" : "New course submission"}
                      </span>
                    </article>
                    <article>
                      <strong>Submitted By</strong>
                      <span>{version.createdBy.name} on {formatSubmittedDate(version.submittedAt)}</span>
                    </article>
                    {handover ? (
                      <>
                        <article>
                          <strong>Capacity Area Anchor</strong>
                          <span>{handover.anchors.capacityArea || "Not specified"}</span>
                        </article>
                        <article>
                          <strong>K/S/M/E Route Anchor</strong>
                          <span>{handover.anchors.route || "Not specified"}</span>
                        </article>
                        <article>
                          <strong>Source Package</strong>
                          <span>{handover.anchors.sourcePackage || "Not recorded"}</span>
                        </article>
                        <article>
                          <strong>Course-Fit Decision</strong>
                          <span>{handover.anchors.courseFitDecision || "Not recorded"}</span>
                        </article>
                        <article>
                          <strong>Source Anchor Alignment</strong>
                          <span
                            className={`status-badge ${
                              handover.anchors.alignmentStatus ===
                              "Aligned with source anchor"
                                ? "status-badge-ready"
                                : "status-badge-blocked"
                            }`}
                          >
                            {handover.anchors.alignmentStatus || "Not recorded"}
                          </span>
                        </article>
                        <article>
                          <strong>Lesson Blocks</strong>
                          <span>
                            {handover.summary.totalBlocks} total blocks ({handover.summary.requiredBlockCount} required, {handover.summary.creatorAddedBlockCount} creator-added)
                          </span>
                        </article>
                        <article>
                          <strong>Final Test Readiness</strong>
                          <span className={`status-badge ${handover.finalTest.ready ? "status-badge-ready" : "status-badge-blocked"}`}>
                            {handover.finalTest.ready ? "Ready" : "Not Ready"}
                          </span>
                        </article>
                        <article>
                          <strong>Certificate Rule</strong>
                          <span>{handover.certificateRule}</span>
                        </article>
                        <article>
                          <strong>AI Review Status</strong>
                          <span className={getEvidenceBadgeClass(handover.aiReview.status)}>
                            {handover.aiReview.status}
                          </span>
                        </article>
                        <article>
                          <strong>Practical Proof</strong>
                          <span className={getEvidenceBadgeClass(handover.practicalProof?.status || "Not enabled")}>
                            {handover.practicalProof?.enabled
                              ? `Enabled: ${handover.practicalProof.status}`
                              : "Disabled"}
                          </span>
                        </article>
                      </>
                    ) : (
                      <article>
                        <strong>Build-to-Review Handover</strong>
                        <span className="status-badge status-badge-blocked">Not recorded</span>
                      </article>
                    )}
                  </div>

                  {handover?.blockingWarnings && handover.blockingWarnings.length > 0 ? (
                    <div className="blocker-panel review-queue-card-warnings" style={{ marginBottom: "1rem" }}>
                      <strong>Handover Blocking Warnings ({handover.blockingWarnings.length})</strong>
                      <ul>
                        {handover.blockingWarnings.map((warning, idx) => (
                          <li key={idx}>{warning.message}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {handover?.anchors.alignmentIssues &&
                  handover.anchors.alignmentIssues.length > 0 ? (
                    <div className="next-step-panel review-queue-card-attention" style={{ marginBottom: "1rem" }}>
                      <strong>Source-anchor alignment notes</strong>
                      <ul>
                        {handover.anchors.alignmentIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {handover?.reviewerAttentionItems && handover.reviewerAttentionItems.length > 0 ? (
                    <div className="next-step-panel review-queue-card-attention" style={{ marginBottom: "1rem" }}>
                      <strong>Reviewer Attention Items ({handover.reviewerAttentionItems.length})</strong>
                      <ul>
                        {handover.reviewerAttentionItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {version.reviewRecord?.decisionNotes ? (
                    <p className="workspace-note"><strong>Reviewer Notes:</strong> {version.reviewRecord.decisionNotes}</p>
                  ) : null}

                  {reviewerReview ? (
                    <p className="workspace-note">
                      <strong>Review routing:</strong> {reviewerReview.decisionLabel || reviewerReview.decisionType || "Decision recorded"}
                      {reviewerReview.specialistReviewRequired ? " · specialist review required" : ""}
                    </p>
                  ) : null}
                </div>
                <div className="review-queue-card-action" style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
                  <Link
                    className="workspace-button"
                    href={`/review/courses/${version.course.id}/versions/${version.id}`}
                  >
                    Open review
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state studio-section">
          <h2>No submitted courses yet</h2>
          <p>
            Submitted courses will appear here after creator-side review is
            complete.
          </p>
        </div>
      )}

      <nav className="workspace-nav" aria-label="Review queue actions">
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
    normalized.includes("passed") ||
    normalized.includes("reviewed")
  ) {
    return "status-badge status-badge-ready";
  }

  if (
    normalized.includes("blocked") ||
    normalized.includes("missing") ||
    normalized.includes("required") ||
    normalized.includes("pending") ||
    normalized.includes("not ")
  ) {
    return "status-badge status-badge-blocked";
  }

  return "status-badge";
}


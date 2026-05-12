import Link from "next/link";
import { notFound } from "next/navigation";

import {
  issueVerifiedAchievementAction,
  recordPracticalProofReviewAction,
} from "@/app/(review)/review/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requirePermissionIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  canReviewAssignedProof,
} from "@/lib/permissions/scoped-access";
import {
  formatProofAuditEventType,
  formatProofAuditStatus,
} from "@/lib/proof-audit";
import {
  getProofReviewStatusLabel,
  proofReviewFieldLabels,
  proofReviewStatuses,
} from "@/lib/review/proof-review";
import { formatPublishedDate } from "@/lib/review/publishing";
import {
  getProofTypeLabel,
  getSubmissionFormatLabel,
} from "@/lib/studio/practical-proof";
import {
  getVerifiedAchievementBlockerMessage,
  getVerifiedAchievementEligibility,
} from "@/lib/verified-achievement";

type ProofReviewDetailPageProps = {
  params?: Promise<{
    submissionId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    fields?: string;
    achievement?: string;
    reviewed?: string;
  }>;
};

export default async function ProofReviewDetailPage({
  params,
  searchParams,
}: ProofReviewDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const submissionId = resolvedParams?.submissionId;

  if (!submissionId) {
    notFound();
  }

  const identity = await requirePermissionIdentity(
    `/review/proof/${submissionId}`,
  );
  const submission = await prisma.learnerPracticalProofSubmission.findFirst({
    where: {
      id: submissionId,
      visibilityDefault: "PRIVATE",
      donorVisibilityConsent: false,
      aiVerificationUsed: false,
    },
    include: {
      user: true,
      reviewer: true,
      practicalProofConfig: true,
      courseVersion: {
        include: {
          course: true,
        },
      },
      events: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          actor: true,
        },
      },
      verifiedAchievement: {
        include: {
          issuedBy: true,
        },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  if (!canReviewAssignedProof(identity, submission)) {
    notFound();
  }

  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => proofReviewFieldLabels[field] || field)
    : [];
  const achievementBlockers = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map(getVerifiedAchievementBlockerMessage)
    : [];
  const achievementEligibility = getVerifiedAchievementEligibility(submission);

  return (
    <WorkspaceShell
      eyebrow="Proof Review"
      title={submission.courseVersion.course.title}
    >
      <p>
        Review this private proof submission separately from the course
        certificate. Do not copy raw proof outside this protected review space.
      </p>

      {resolvedSearchParams?.reviewed === "1" ? (
        <p className="workspace-note">Proof review decision saved.</p>
      ) : null}
      {resolvedSearchParams?.error === "proof-review" ? (
        <p className="workspace-error">
          Complete the proof review fields: {missingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.achievement === "issued" ? (
        <p className="workspace-note">Verified achievement issued privately.</p>
      ) : null}
      {resolvedSearchParams?.error === "achievement" ? (
        <p className="workspace-error">
          Verified achievement cannot be issued yet:{" "}
          {achievementBlockers.join(", ")}.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="proof-context-title">
        <h2 id="proof-context-title">Submission context</h2>
        <div className="context-grid">
          <article>
            <strong>Learner</strong>
            <span>{submission.user.name}</span>
          </article>
          <article>
            <strong>Status</strong>
            <span>{getProofReviewStatusLabel(submission.status)}</span>
          </article>
          <article>
            <strong>Submitted</strong>
            <span>{formatPublishedDate(submission.submittedAt)}</span>
          </article>
          <article>
            <strong>Visibility</strong>
            <span>{submission.visibilityDefault}</span>
          </article>
          <article>
            <strong>Reviewer</strong>
            <span>{submission.reviewer?.name || "Not assigned"}</span>
          </article>
          <article>
            <strong>Reviewed</strong>
            <span>{formatPublishedDate(submission.reviewedAt)}</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="proof-config-title">
        <h2 id="proof-config-title">Proof configuration</h2>
        <div className="context-grid">
          <article>
            <strong>Proof title</strong>
            <span>{submission.practicalProofConfig.proofTitle}</span>
          </article>
          <article>
            <strong>Accepted proof</strong>
            <span>
              {getProofTypeLabel(
                submission.practicalProofConfig.acceptedProofType,
              )}
            </span>
          </article>
          <article>
            <strong>Format</strong>
            <span>
              {getSubmissionFormatLabel(
                submission.practicalProofConfig.submissionFormat,
              )}
            </span>
          </article>
          <article>
            <strong>Capacity indicator</strong>
            <span>{submission.practicalProofConfig.capacityIndicator}</span>
          </article>
        </div>
        <div className="block-content">
          <strong>Review criteria</strong>
          <p>{submission.practicalProofConfig.reviewCriteria}</p>
        </div>
        <div className="block-content">
          <strong>Safety guidance</strong>
          <p>{submission.practicalProofConfig.safetyGuidance}</p>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="raw-proof-title">
        <h2 id="raw-proof-title">Private proof</h2>
        <div className="block-content">
          <strong>Proof text</strong>
          <p>{submission.proofText || "No text proof provided."}</p>
        </div>
        <div className="block-content">
          <strong>Evidence link</strong>
          {submission.evidenceLink ? (
            <p>
              <a href={submission.evidenceLink}>{submission.evidenceLink}</a>
            </p>
          ) : (
            <p>No evidence link provided.</p>
          )}
        </div>
        <p className="workspace-note">
          Safety acknowledged: {submission.safetyAcknowledged ? "yes" : "no"} ·
          Certificate separation acknowledged:{" "}
          {submission.certificateSeparationAcknowledged ? "yes" : "no"} · Donor
          visibility disabled · AI verification not used
        </p>
      </section>

      <section
        className="studio-section"
        aria-labelledby="verified-achievement-title"
      >
        <h2 id="verified-achievement-title">Verified achievement</h2>
        <p>
          Accepting practical proof and issuing a verified achievement are
          separate actions. This private recognition does not create a course
          certificate, public badge, donor summary, or public credential.
        </p>
        {submission.verifiedAchievement ? (
          <div className="context-grid">
            <article>
              <strong>Title</strong>
              <span>{submission.verifiedAchievement.title}</span>
            </article>
            <article>
              <strong>Issued</strong>
              <span>
                {formatPublishedDate(submission.verifiedAchievement.issuedAt)}
              </span>
            </article>
            <article>
              <strong>Issuer</strong>
              <span>
                {submission.verifiedAchievement.issuedBy?.name ||
                  "Not recorded"}
              </span>
            </article>
            <article>
              <strong>Visibility</strong>
              <span>{submission.verifiedAchievement.visibilityDefault}</span>
            </article>
            <article>
              <strong>Capacity indicator</strong>
              <span>{submission.verifiedAchievement.capacityIndicator}</span>
            </article>
            <article>
              <strong>Public badge</strong>
              <span>
                {submission.verifiedAchievement.publicBadgeEnabled
                  ? "Enabled"
                  : "Not active"}
              </span>
            </article>
          </div>
        ) : (
          <>
            {achievementEligibility.allowed ? (
              <form
                action={issueVerifiedAchievementAction.bind(
                  null,
                  submission.id,
                )}
                className="checklist-form"
              >
                <p className="workspace-note">
                  This accepted proof is eligible for a private verified
                  achievement. Raw proof stays private and donor visibility
                  remains disabled.
                </p>
                <button className="workspace-button" type="submit">
                  Issue verified achievement
                </button>
              </form>
            ) : (
              <div className="block-content">
                <strong>Not ready to issue</strong>
                <ul>
                  {achievementEligibility.blockers.map((blocker) => (
                    <li key={blocker}>
                      {getVerifiedAchievementBlockerMessage(blocker)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      <section className="studio-section" aria-labelledby="proof-history-title">
        <h2 id="proof-history-title">Private proof audit history</h2>
        <p>
          This timeline is visible only in the protected proof review space.
          Raw proof snapshots and internal notes must stay private.
        </p>
        {submission.events.length > 0 ? (
          <div className="course-list course-list-spacious">
            {submission.events.map((event) => (
              <article className="course-row" key={event.id}>
                <div>
                  <h3>{formatProofAuditEventType(event.eventType)}</h3>
                  <p>
                    {formatPublishedDate(event.createdAt)} · Actor{" "}
                    {event.actor?.name || "Not recorded"} · Status{" "}
                    {event.fromStatus
                      ? `${formatProofAuditStatus(
                          event.fromStatus,
                        )} to ${formatProofAuditStatus(event.toStatus)}`
                      : formatProofAuditStatus(event.toStatus)}
                    {event.revisionNumber
                      ? ` · Revision ${event.revisionNumber}`
                      : ""}
                  </p>
                  {event.proofTextSnapshot || event.evidenceLinkSnapshot ? (
                    <div className="block-content">
                      <strong>Private snapshot</strong>
                      <p>{event.proofTextSnapshot || "No text snapshot."}</p>
                      {event.evidenceLinkSnapshot ? (
                        <p>
                          <a href={event.evidenceLinkSnapshot}>
                            {event.evidenceLinkSnapshot}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {event.learnerVisibleNote ? (
                    <div className="block-content">
                      <strong>Learner-visible note</strong>
                      <p>{event.learnerVisibleNote}</p>
                    </div>
                  ) : null}
                  {event.requiredAction ? (
                    <div className="block-content">
                      <strong>Required action</strong>
                      <p>{event.requiredAction}</p>
                    </div>
                  ) : null}
                  {event.internalNote ? (
                    <div className="block-content">
                      <strong>Internal note</strong>
                      <p>{event.internalNote}</p>
                    </div>
                  ) : null}
                  <p className="workspace-note">
                    Raw proof visibility {event.visibilityDefault} · Donor
                    visibility disabled · AI verification not used
                    {event.redactionRequired ? " · Redaction required" : ""}
                    {event.specialistReviewRequired
                      ? " · Specialist review required"
                      : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="workspace-note">
            History will appear for new proof actions. Existing submissions may
            not have earlier events.
          </p>
        )}
      </section>

      <section className="studio-section" aria-labelledby="decision-title">
        <h2 id="decision-title">Review decision</h2>
        <form
          action={recordPracticalProofReviewAction.bind(null, submission.id)}
          className="checklist-form"
        >
          <label>
            <span>Decision</span>
            <select name="status" defaultValue={submission.status}>
              {proofReviewStatuses.map((status) => (
                <option key={status} value={status}>
                  {getProofReviewStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Learner-visible feedback</span>
            <textarea
              name="learnerFeedback"
              defaultValue={submission.learnerFeedback}
              placeholder="Write only feedback the learner can safely see."
            />
          </label>
          <label>
            <span>Required learner action</span>
            <textarea
              name="requiredAction"
              defaultValue={submission.requiredAction}
              placeholder="Explain the action required from the learner, if any."
            />
          </label>
          <label>
            <span>Internal reviewer note</span>
            <textarea
              name="internalReviewNote"
              defaultValue={submission.internalReviewNote}
              placeholder="Internal note for reviewer/admin use only."
            />
          </label>
          <label className="checkbox-row">
            <input
              name="redactionRequired"
              type="checkbox"
              defaultChecked={submission.redactionRequired}
            />
            <span>Redaction is required before any future recognition step.</span>
          </label>
          <label className="checkbox-row">
            <input
              name="specialistReviewRequired"
              type="checkbox"
              defaultChecked={submission.specialistReviewRequired}
            />
            <span>Specialist review is required before any future recognition step.</span>
          </label>
          <button className="workspace-button" type="submit">
            Save proof review
          </button>
        </form>
      </section>

      <nav className="workspace-nav" aria-label="Proof review navigation">
        <Link className="workspace-link" href="/review/proof">
          Proof review queue
        </Link>
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

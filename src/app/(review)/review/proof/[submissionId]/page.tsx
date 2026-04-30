import Link from "next/link";
import { notFound } from "next/navigation";

import { recordPracticalProofReviewAction } from "@/app/(review)/review/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getProofReviewStatusLabel,
  proofReviewFieldLabels,
  proofReviewStatuses,
} from "@/lib/review/proof-review";
import { formatPublishedDate } from "@/lib/review/publishing";
import { getProofTypeLabel, getSubmissionFormatLabel } from "@/lib/studio/practical-proof";

type ProofReviewDetailPageProps = {
  params?: Promise<{
    submissionId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    fields?: string;
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

  const identity = await requireWorkspaceIdentity(
    `/review/proof/${submissionId}`,
  );
  const submission = await prisma.learnerPracticalProofSubmission.findFirst({
    where: {
      id: submissionId,
      courseVersion: {
        course: {
          organizationId: identity.user.organizationId,
        },
      },
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
    },
  });

  if (!submission) {
    notFound();
  }

  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => proofReviewFieldLabels[field] || field)
    : [];

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

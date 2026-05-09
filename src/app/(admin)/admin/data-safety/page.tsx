import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminDataSafetyOverview,
  type AdminExternallyVisibleAchievement,
  type AdminFlaggedProofSubmission,
} from "@/lib/admin/data-safety";
import { requireWorkspaceIdentity } from "@/lib/auth/server";

import {
  resolveRedactionRequirementAction,
  resolveSpecialistReviewAction,
  revokeExternalVisibilityAction,
} from "./actions";

export default async function AdminDataSafetyPage() {
  await requireWorkspaceIdentity("/admin/data-safety");
  const overview = await getAdminDataSafetyOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Data Safety & Visibility">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="data-safety-title">
          <div>
            <h2 id="data-safety-title">Proof privacy and visibility controls</h2>
            <p>
              Review safety flags, redaction needs, specialist review needs,
              and external visibility for practical proof and verified
              achievements. Raw proof remains private by default, and this page
              does not change proof decisions, certificates, badges, or learner
              progress.
            </p>
          </div>
          <span className="status-badge status-badge-blocked">
            Safety review
          </span>
        </section>

        <section className="admin-section" aria-labelledby="safety-status-title">
          <div className="admin-section-heading">
            <h2 id="safety-status-title">Current safety status</h2>
            <p>
              These are safe platform counts only. They do not include raw proof,
              learner rosters, internal verifier notes, or hidden payloads.
            </p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Proof submissions with a redaction or specialist review flag."
              label="Flagged Proof Submissions"
              value={overview.totals.flaggedProofSubmissions}
            />
            <MetricCard
              detail="Proof submissions waiting for specialist safety review."
              label="Specialist Review Needed"
              value={overview.totals.specialistReviewNeeded}
            />
            <MetricCard
              detail="Proof submissions marked as needing redaction review."
              label="Redaction Needed"
              value={overview.totals.redactionNeeded}
            />
            <MetricCard
              detail="Verified achievements with donor or public visibility enabled."
              label="Externally Visible Achievements"
              value={overview.totals.externallyVisibleAchievements}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="safety-boundaries-title">
          <div className="admin-section-heading">
            <h2 id="safety-boundaries-title">Safety boundaries</h2>
            <p>
              Data Safety keeps proof privacy, redaction, specialist review, and
              external visibility separate from certificates and recognition.
            </p>
          </div>
          <div className="admin-card-grid">
            <BoundaryCard
              detail="Raw proof stays private unless an existing authorized workflow creates a safe summary."
              status="Private by default"
              title="Raw proof privacy"
            />
            <BoundaryCard
              detail="Redaction flags identify proof that may need sensitive details removed before visibility changes."
              status="Safety flag"
              title="Redaction needs"
            />
            <BoundaryCard
              detail="Specialist review flags identify proof that may involve sensitive safeguarding or civic-space context."
              status="Safety flag"
              title="Specialist review needs"
            />
            <BoundaryCard
              detail="Only reviewed achievement summaries can be donor-visible or public badge-visible."
              status="Safe summary"
              title="External visibility"
            />
            <BoundaryCard
              detail="Existing actions remain reason-required and continue to write Admin audit records."
              href="/admin/audit-log"
              status="Accountable"
              title="Audit and reasons"
            />
            <BoundaryCard
              detail="Use the queues below to resolve safety flags or revoke visibility without exposing raw proof here."
              status="Controlled"
              title="Safe next actions"
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="flagged-proofs-title">
          <div className="admin-section-heading">
            <h2 id="flagged-proofs-title">Proof safety queue</h2>
            <p>
              Safe queue fields only: proof title, course, organization,
              submitted date, reviewer display name, and flag status. Raw proof,
              learner emails, and internal verifier notes are not shown here.
            </p>
          </div>

          {overview.flaggedSubmissions.length > 0 ? (
            <div className="course-list course-list-spacious">
              {overview.flaggedSubmissions.map((submission) => (
                <ProofSafetyCard key={submission.id} submission={submission} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No flagged proof submissions</h3>
              <p>
                There are currently no proof submissions waiting for redaction
                or specialist safety review. Raw proof remains private by
                default.
              </p>
            </div>
          )}
        </section>

        <section className="admin-section" aria-labelledby="external-visibility-title">
          <div className="admin-section-heading">
            <h2 id="external-visibility-title">External visibility queue</h2>
            <p>
              Safe summary fields only: achievement title, course, organization,
              visibility flags, issued date, and the reviewed summary
              description. Raw proof and internal review notes are not shown.
            </p>
          </div>

          {overview.externallyVisibleAchievements.length > 0 ? (
            <div className="course-list course-list-spacious">
              {overview.externallyVisibleAchievements.map((achievement) => (
                <ExternalVisibilityCard
                  achievement={achievement}
                  key={achievement.id}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No externally visible achievements</h3>
              <p>
                No verified achievements currently have donor or public
                visibility enabled. This is the safest default.
              </p>
            </div>
          )}
        </section>

        <nav className="workspace-nav" aria-label="Data safety links">
          <Link className="workspace-link primary" href="/admin">
            Admin home
          </Link>
          <Link className="workspace-link" href="/admin/proof-badges">
            Practical Proof & Badges
          </Link>
          <Link className="workspace-link" href="/admin/audit-log">
            Audit Log
          </Link>
        </nav>
      </div>
    </WorkspaceShell>
  );
}

function ProofSafetyCard({
  submission,
}: {
  submission: AdminFlaggedProofSubmission;
}) {
  return (
    <article className="publishing-card">
      <div className="publishing-card-header">
        <div>
          <p className="block-kicker">
            {submission.courseVersion.course.organization.name} ·{" "}
            {submission.courseVersion.course.title}
          </p>
          <h3>{submission.practicalProofConfig?.proofTitle || "Proof submission"}</h3>
        </div>
        <span className="status-badge status-badge-blocked">
          {formatProofFlagStatus(submission)}
        </span>
      </div>
      <div className="publishing-card-body">
        <p>
          <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
        </p>
        <p>
          <strong>Reviewer:</strong> {submission.reviewer?.name || "Unassigned"}
        </p>
        <div className="next-step-panel">
          <strong>Safety boundary:</strong>
          <p>
            This queue does not show raw proof, learner contact details, or
            internal verifier notes. Use the authorized review workflow only
            when the safety review itself requires it.
          </p>
        </div>
      </div>
      <div className="publishing-card-actions">
        <Link
          className="workspace-button secondary"
          href={`/review/proof/${submission.id}`}
        >
          Open proof safety workflow
        </Link>
        {submission.specialistReviewRequired ? (
          <form
            action={resolveSpecialistReviewAction.bind(null, submission.id)}
            className="inline-status-form"
          >
            <input
              minLength={5}
              name="note"
              placeholder="Reason for resolving this flag (min 5 chars)"
              required
            />
            <button className="workspace-button" type="submit">
              Resolve specialist review flag
            </button>
          </form>
        ) : null}
        {submission.redactionRequired ? (
          <form
            action={resolveRedactionRequirementAction.bind(null, submission.id)}
            className="inline-status-form"
          >
            <input
              minLength={5}
              name="note"
              placeholder="Reason for resolving this flag (min 5 chars)"
              required
            />
            <button className="workspace-button" type="submit">
              Resolve redaction flag
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

function ExternalVisibilityCard({
  achievement,
}: {
  achievement: AdminExternallyVisibleAchievement;
}) {
  return (
    <article className="publishing-card">
      <div className="publishing-card-header">
        <div>
          <p className="block-kicker">
            {achievement.organization.name} ·{" "}
            {achievement.courseVersion.course.title}
          </p>
          <h3>{achievement.title}</h3>
        </div>
        <span className="status-badge status-badge-published">
          {formatVisibilityStatus(achievement)}
        </span>
      </div>
      <div className="publishing-card-body">
        <p>
          <strong>Issued:</strong> {formatDate(achievement.issuedAt)}
        </p>
        <div className="next-step-panel">
          <strong>Safe summary description:</strong>
          <p>{achievement.description || "No safe summary description provided."}</p>
        </div>
        <div className="blocker-panel">
          <strong>Visibility boundary:</strong>
          <p>
            External visibility remains limited to reviewed summary fields.
            Raw proof, learner records, and internal verifier notes stay
            protected.
          </p>
        </div>
      </div>
      <div className="publishing-card-actions">
        <Link
          className="workspace-button secondary"
          href="/review/achievements"
        >
          Open achievement review queue
        </Link>
        <form
          action={revokeExternalVisibilityAction.bind(null, achievement.id)}
          className="inline-status-form"
        >
          <input
            minLength={5}
            name="note"
            placeholder="Reason for revoking visibility (min 5 chars)"
            required
          />
          <button className="workspace-button" type="submit">
            Revoke external visibility
          </button>
        </form>
      </div>
    </article>
  );
}

function BoundaryCard({
  detail,
  href,
  status,
  title,
}: {
  detail: string;
  href?: string;
  status: string;
  title: string;
}) {
  return (
    <article className="admin-readiness-card">
      <div>
        <h3>{title}</h3>
        <span className="status-badge status-badge-ready">{status}</span>
      </div>
      <p>{detail}</p>
      {href ? (
        <Link className="workspace-link secondary" href={href}>
          Open
        </Link>
      ) : null}
    </article>
  );
}

function MetricCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: number;
}) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function formatProofFlagStatus(submission: AdminFlaggedProofSubmission) {
  if (submission.specialistReviewRequired && submission.redactionRequired) {
    return "Specialist review and redaction";
  }

  if (submission.specialistReviewRequired) {
    return "Specialist review";
  }

  return "Redaction needed";
}

function formatVisibilityStatus(achievement: AdminExternallyVisibleAchievement) {
  if (achievement.donorVisibilityEnabled && achievement.publicBadgeEnabled) {
    return "Donor-visible and public badge";
  }

  if (achievement.donorVisibilityEnabled) {
    return "Donor-visible";
  }

  return "Public badge";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(value);
}

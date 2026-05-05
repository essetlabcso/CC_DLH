import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { getAdminDataSafetyOverview } from "@/lib/admin/data-safety";

import {
  resolveSpecialistReviewAction,
  resolveRedactionRequirementAction,
  revokeExternalVisibilityAction,
} from "./actions";

export default async function AdminDataSafetyPage() {
  await requireWorkspaceIdentity("/admin/data-safety");
  const overview = await getAdminDataSafetyOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Data Safety & Visibility">
      <div className="admin-hero">
        <p>
          <strong>Internal DEC Admin Oversight View</strong>. Platform-wide governance 
          of sensitive practical proof submissions and verified achievements 
          that have external visibility enabled. Enforce the strict data safety 
          rules required by Annex 12. This page is not donor-safe reporting.
        </p>
      </div>

      <section className="admin-section" aria-labelledby="flagged-proofs-title">
        <div className="admin-section-heading">
          <h2 id="flagged-proofs-title">Proof needing specialist review</h2>
          <p>
            Submissions flagged by verifiers because they contain potentially 
            unsafe data, require redaction, or involve highly sensitive 
            safeguarding or civic-space topics.
          </p>
        </div>

        {overview.flaggedSubmissions.length > 0 ? (
          <div className="course-list course-list-spacious">
            {overview.flaggedSubmissions.map((submission) => (
              <article className="publishing-card" key={submission.id}>
                <div className="publishing-card-header">
                  <div>
                    <p className="block-kicker">
                      {submission.courseVersion.course.organization.name} · {submission.courseVersion.course.title}
                    </p>
                    <h3>{submission.practicalProofConfig?.proofTitle || "Proof Submission"}</h3>
                  </div>
                  <span className="status-badge status-badge-blocked">
                    {submission.specialistReviewRequired ? "Specialist review" : "Redaction required"}
                  </span>
                </div>
                <div className="publishing-card-body">
                  <p>
                    <strong>Learner:</strong> {submission.user.name} ({submission.user.email})
                  </p>
                  <p>
                    <strong>Verifier:</strong> {submission.reviewer?.name || "Unassigned"}
                  </p>
                  <div className="blocker-panel">
                    <strong>Review Note:</strong>
                    <p>{submission.internalReviewNote || "No note provided."}</p>
                  </div>
                  <div className="blocker-panel">
                    <strong>Action Required:</strong>
                    <p>{submission.requiredAction || "Not specified."}</p>
                  </div>
                </div>
                <div className="publishing-card-actions">
                  <Link
                    href={`/review/proof/${submission.id}`}
                    className="workspace-button secondary"
                  >
                    View submission
                  </Link>
                  {submission.specialistReviewRequired && (
                    <form
                      action={resolveSpecialistReviewAction.bind(
                        null,
                        submission.id,
                      )}
                      className="inline-status-form"
                    >
                      <input
                        name="note"
                        placeholder="Reason for resolving (min 5 chars)"
                        required
                        minLength={5}
                      />
                      <button className="workspace-button" type="submit">
                        Resolve specialist review
                      </button>
                    </form>
                  )}
                  {submission.redactionRequired && (
                    <form
                      action={resolveRedactionRequirementAction.bind(
                        null,
                        submission.id,
                      )}
                      className="inline-status-form"
                    >
                      <input
                        name="note"
                        placeholder="Reason for resolving (min 5 chars)"
                        required
                        minLength={5}
                      />
                      <button className="workspace-button" type="submit">
                        Resolve redaction
                      </button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No flagged proof submissions</h3>
            <p>
              There are currently no proof submissions blocked awaiting 
              Admin/Specialist review across the platform.
            </p>
          </div>
        )}
      </section>

      <section className="admin-section" aria-labelledby="external-visibility-title">
        <div className="admin-section-heading">
          <h2 id="external-visibility-title">Externally visible achievements</h2>
          <p>
            Verified achievements that have Donor Visibility or Public Badge 
            visibility enabled. Review these to ensure they represent safe 
            summaries without exposing raw sensitive data.
          </p>
        </div>

        {overview.externallyVisibleAchievements.length > 0 ? (
          <div className="course-list course-list-spacious">
            {overview.externallyVisibleAchievements.map((achievement) => (
              <article className="publishing-card" key={achievement.id}>
                <div className="publishing-card-header">
                  <div>
                    <p className="block-kicker">
                      {achievement.organization.name} · {achievement.courseVersion.course.title}
                    </p>
                    <h3>{achievement.title}</h3>
                  </div>
                  <span className="status-badge status-badge-published">
                    {achievement.donorVisibilityEnabled ? "Donor-visible" : "Public"}
                  </span>
                </div>
                <div className="publishing-card-body">
                  <p>
                    <strong>Learner:</strong> {achievement.user.name} ({achievement.user.email})
                  </p>
                  <p>
                    <strong>Issued By:</strong> {achievement.issuedBy?.name || "System"}
                  </p>
                  <div className="next-step-panel">
                    <strong>Safe Summary Description:</strong>
                    <p>{achievement.description}</p>
                  </div>
                </div>
                <div className="publishing-card-actions">
                  <Link
                    href={`/review/achievements/${achievement.id}`}
                    className="workspace-button secondary"
                  >
                    View achievement
                  </Link>
                  <form
                    action={revokeExternalVisibilityAction.bind(
                      null,
                      achievement.id,
                    )}
                    className="inline-status-form"
                  >
                    <input
                      name="note"
                      placeholder="Reason for revoking (min 5 chars)"
                      required
                      minLength={5}
                    />
                    <button className="workspace-button" type="submit">
                      Revoke visibility
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No externally visible achievements</h3>
            <p>
              No verified achievements currently have donor or public visibility 
              enabled on the platform.
            </p>
          </div>
        )}
      </section>

      <nav className="workspace-nav" aria-label="Data safety actions">
        <Link className="workspace-link primary" href="/admin">
          Admin home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

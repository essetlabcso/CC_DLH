import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminProofBadgesOverview,
  type AdminCountSummary,
  type AdminEvidenceSummary,
} from "@/lib/admin/proof-badges";
import { FINAL_TEST_PASS_SCORE } from "@/lib/learner/final-test";

export default async function AdminProofBadgesPage() {
  const overview = await getAdminProofBadgesOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Practical Proof & Badges">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="proof-badges-title">
          <div>
            <h2 id="proof-badges-title">Practical proof and recognition overview</h2>
            <p>
              Review safe aggregate evidence for practical proof submissions,
              verified achievements, and badge or recognition visibility. This
              page is read-only and does not change proof decisions,
              certificates, badge awards, or visibility settings.
            </p>
          </div>
          <span className="status-badge status-badge-published">Read-only overview</span>
        </section>

        <section className="admin-section" aria-labelledby="proof-safety-title">
          <div className="admin-section-heading">
            <h2 id="proof-safety-title">Evidence boundaries</h2>
            <p>
              Certificates come from the {FINAL_TEST_PASS_SCORE}%+ final test
              rule. Practical proof, verified achievements, and badges are
              separate evidence layers. Raw proof remains private by default.
            </p>
          </div>
          <div className="admin-card-grid">
            <EvidenceLayerCard
              detail="Automated course certificate issued from the final test rule."
              href="/admin/certificates"
              status="Final test"
              title="Certificates"
            />
            <EvidenceLayerCard
              detail="Private learner evidence submitted for human review. View queue or manage verifiers."
              href="/admin/proof-badges/assignments"
              status="Private proof"
              title="Practical proof submissions"
            />
            <EvidenceLayerCard
              detail="Recognition issued only after accepted practical proof is reviewed."
              status="Human reviewed"
              title="Verified achievements"
            />
            <EvidenceLayerCard
              detail="Recognition visibility flags from verified achievement records."
              status="Recognition"
              title="Badges / recognition"
            />
            <EvidenceLayerCard
              detail="Redaction, specialist review, and external visibility actions stay in Data Safety."
              href="/admin/data-safety"
              status="Action area"
              title="Data Safety & Visibility"
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="proof-summary-title">
          <div className="admin-section-heading">
            <h2 id="proof-summary-title">Summary</h2>
            <p>Safe platform totals without learner rosters, raw proof, or final scores.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Courses with practical proof enabled"
              label="Proof-enabled Courses"
              value={overview.totals.proofEnabledCourses}
            />
            <MetricCard
              detail="Private practical proof submissions"
              label="Proof Submissions"
              value={overview.totals.proofSubmissions}
            />
            <MetricCard
              detail="Human-reviewed recognition records"
              label="Verified Achievements"
              value={overview.totals.verifiedAchievements}
            />
            <MetricCard
              detail={`${FINAL_TEST_PASS_SCORE}%+ final test certificates, shown separately`}
              label="Certificates"
              value={overview.totals.certificates}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="proof-status-title">
          <div className="admin-section-heading">
            <h2 id="proof-status-title">Proof submission status</h2>
            <p>Status counts only. Proof content and reviewer notes are excluded.</p>
          </div>
          <CountSummaryGrid
            emptyMessage="No practical proof submissions have been recorded yet."
            items={overview.proofStatuses}
          />
        </section>

        <section className="admin-section" aria-labelledby="proof-flags-title">
          <div className="admin-section-heading">
            <h2 id="proof-flags-title">Proof safety and visibility flags</h2>
            <p>
              These counts identify where Data Safety may need attention. Use
              Data Safety & Visibility for any redaction, specialist review, or
              external visibility action.
            </p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Raw proof remains private by default"
              label="Private Proof"
              value={overview.proofSafety.privateProof}
            />
            <MetricCard
              detail="Marked for redaction review"
              label="Redaction Required"
              value={overview.proofSafety.redactionRequired}
            />
            <MetricCard
              detail="Marked for specialist review"
              label="Specialist Review"
              value={overview.proofSafety.specialistReviewRequired}
            />
            <MetricCard
              detail="Learner consent flag for donor visibility"
              label="Donor Consent"
              value={overview.proofSafety.donorVisibilityConsent}
            />
            <MetricCard
              detail="AI must not verify proof"
              label="AI Verification Used"
              value={overview.proofSafety.aiVerificationUsed}
            />
          </div>
          <div className="reference-action-row">
            <Link className="workspace-link secondary" href="/admin/data-safety">
              Open Data Safety & Visibility
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="achievement-status-title">
          <div className="admin-section-heading">
            <h2 id="achievement-status-title">Verified achievement status</h2>
            <p>Human-reviewed recognition records grouped by verification decision.</p>
          </div>
          <CountSummaryGrid
            emptyMessage="No verified achievements have been issued yet."
            items={overview.verifiedAchievementDecisions}
          />
        </section>

        <section className="admin-section" aria-labelledby="recognition-title">
          <div className="admin-section-heading">
            <h2 id="recognition-title">Badge and recognition visibility</h2>
            <p>
              Recognition visibility flags are shown separately from proof
              submissions and course certificates.
            </p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Achievement records still private"
              label="Private Achievements"
              value={overview.recognitionVisibility.privateAchievements}
            />
            <MetricCard
              detail="Safe summary visibility enabled"
              label="Donor-visible"
              value={overview.recognitionVisibility.donorVisible}
            />
            <MetricCard
              detail="Public badge flag enabled"
              label="Public Badge Enabled"
              value={overview.recognitionVisibility.publicBadgeEnabled}
            />
            <MetricCard
              detail="Badge visual has been issued"
              label="Badge Visual Issued"
              value={overview.recognitionVisibility.badgeVisualIssued}
            />
            <MetricCard
              detail="AI must not issue achievements"
              label="AI Issued"
              value={overview.recognitionVisibility.aiIssued}
            />
          </div>
        </section>

        <EvidenceSummarySection
          emptyMessage="No capacity-area proof or achievement summaries are available yet."
          items={overview.capacityAreas}
          title="Capacity area summaries"
        />
        <EvidenceSummarySection
          emptyMessage="No course proof or achievement summaries are available yet."
          items={overview.courses}
          title="Course summaries"
        />
        <EvidenceSummarySection
          emptyMessage="No organization proof or achievement summaries are available yet."
          items={overview.organizations}
          title="Organization summaries"
        />

        <nav className="workspace-nav" aria-label="Practical proof and badge links">
          <Link className="workspace-link primary" href="/admin">
            Admin home
          </Link>
          <Link className="workspace-link" href="/admin/certificates">
            Certificate registry
          </Link>
          <Link className="workspace-link" href="/admin/data-safety">
            Data Safety & Visibility
          </Link>
        </nav>
      </div>
    </WorkspaceShell>
  );
}

function EvidenceLayerCard({
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

function CountSummaryGrid({
  emptyMessage,
  items,
}: {
  emptyMessage: string;
  items: AdminCountSummary[];
}) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="admin-card-grid">
      {items.map((item) => (
        <article className="admin-readiness-card" key={item.label}>
          <div>
            <h3>{item.label}</h3>
            <span className="status-badge status-badge-published">
              {item.count}
            </span>
          </div>
          <p>Aggregate count only.</p>
        </article>
      ))}
    </div>
  );
}

function EvidenceSummarySection({
  emptyMessage,
  items,
  title,
}: {
  emptyMessage: string;
  items: AdminEvidenceSummary[];
  title: string;
}) {
  const titleId = title.toLowerCase().replaceAll(" ", "-");

  return (
    <section className="admin-section" aria-labelledby={titleId}>
      <div className="admin-section-heading">
        <h2 id={titleId}>{title}</h2>
        <p>Safe grouped totals across proof submissions and verified achievements.</p>
      </div>
      {items.length > 0 ? (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Proof submissions</th>
                <th>Verified achievements</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td>{item.proofSubmissions}</td>
                  <td>{item.verifiedAchievements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">{emptyMessage}</p>
      )}
    </section>
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

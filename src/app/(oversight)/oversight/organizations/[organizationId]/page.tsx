import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requirePermissionIdentity } from "@/lib/auth/server";
import { canViewSafeOrganizationSummary } from "@/lib/permissions/scoped-access";
import { getOrganizationSafeSummary } from "@/lib/organization-safe-summary";

type SafeSummaryPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function SafeSummaryPage({ params }: SafeSummaryPageProps) {
  const { organizationId } = await params;
  const pathname = `/oversight/organizations/${organizationId}`;
  
  // 1. Core Security Evaluation
  const identity = await requirePermissionIdentity(pathname);
  const hasAccess = canViewSafeOrganizationSummary(identity, organizationId);

  if (!hasAccess) {
    redirect(`/forbidden?reason=OVERSIGHT_RESTRICTED&next=${encodeURIComponent(pathname)}`);
  }

  // 2. Data Loading
  const summary = await getOrganizationSafeSummary(organizationId);

  if (!summary) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Organizational Oversight" title={summary.organizationName}>
      <div className="admin-dashboard">
        {/* Summary Banner */}
        <section className="admin-hero">
          <div>
            <h2>Safe Performance Summary</h2>
            <p>
              Aggregated view of organizational engagement, course completion, 
              and applied evidence. All confidential proof texts, reflections, and 
              emails are excluded to safeguard learner privacy.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/learn">
              Back to Learning
            </Link>
          </div>
        </section>

        {/* Metrics Overview */}
        <section className="admin-section" aria-labelledby="kpi-summary-title">
          <div className="admin-section-heading">
            <h2 id="kpi-summary-title">Core Metrics</h2>
            <p>High-level summary of learning activity.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard 
              label="Active Staff Members" 
              value={summary.activeMemberCount} 
              detail="Current active user accounts" 
            />
            <MetricCard 
              label="Enrollments" 
              value={summary.totalEnrollments} 
              detail={`${summary.completedEnrollments} courses completed (${summary.completionRatePercent}%)`} 
            />
            <MetricCard 
              label="Certificates Issued" 
              value={summary.certificatesIssued} 
              detail="Verified via final test passing scores" 
            />
            <MetricCard 
              label="Verified Achievements" 
              value={summary.verifiedAchievementsAwarded} 
              detail="Practical learning successfully applied" 
            />
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
          {/* Evidence Pipeline */}
          <section className="admin-section" aria-labelledby="pipeline-title">
            <div className="admin-section-heading">
              <h2 id="pipeline-title">Evidence Pipeline</h2>
              <p>Lifecycle of practical proof submissions across the staff.</p>
            </div>
            <div className="admin-card-grid">
              <article className="admin-readiness-card">
                <dl className="reference-meta-list">
                  <div>
                    <dt>Submitted (Awaiting Review)</dt>
                    <dd className="admin-stat-mini">{summary.evidencePipeline.submittedCount}</dd>
                  </div>
                  <div>
                    <dt>Under Review / Escalated</dt>
                    <dd className="admin-stat-mini">{summary.evidencePipeline.underReviewCount}</dd>
                  </div>
                  <div>
                    <dt>Revision Requested</dt>
                    <dd className="admin-stat-mini">{summary.evidencePipeline.revisionRequestedCount}</dd>
                  </div>
                  <div>
                    <dt>Accepted</dt>
                    <dd className="admin-stat-mini">{summary.evidencePipeline.acceptedCount}</dd>
                  </div>
                  <div>
                    <dt>Rejected</dt>
                    <dd className="admin-stat-mini">{summary.evidencePipeline.rejectedCount}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </section>

          {/* Capacity Areas */}
          <section className="admin-section" aria-labelledby="capacity-title">
            <div className="admin-section-heading">
              <h2 id="capacity-title">Capacity Areas</h2>
              <p>Applied focus areas validated by review.</p>
            </div>
            <div className="admin-card-grid">
              <article className="admin-readiness-card">
                {summary.capacityAreasCovered.length > 0 ? (
                  <ul className="workspace-bullet-list">
                    {summary.capacityAreasCovered.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="workspace-note">No achievements recorded across capacity areas yet.</p>
                )}
              </article>
            </div>
          </section>
        </div>

        {/* Staff Roster List */}
        <section className="admin-section" aria-labelledby="roster-title">
          <div className="admin-section-heading">
            <h2 id="roster-title">Staff Learning Roster</h2>
            <p>Individual metrics safely scoped to simple volume and overall pipeline status.</p>
          </div>
          <div className="admin-table-card">
            {summary.staffRoster.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Enrolled Courses</th>
                    <th>Completed Courses</th>
                    <th>Certificates</th>
                    <th>Latest Applied Proof Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.staffRoster.map((staff) => (
                    <tr key={staff.userId}>
                      <td><strong>{staff.userName}</strong></td>
                      <td>{staff.enrolledCoursesCount}</td>
                      <td>{staff.completedCoursesCount}</td>
                      <td>{staff.certificatesCount}</td>
                      <td>
                        <ProofStatusBadge status={staff.practicalProofStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="workspace-empty-message" style={{ padding: "1rem" }}>
                No staff members are currently mapped to this organization.
              </p>
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function ProofStatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return <span className="status-badge">None Submitted</span>;
  }

  let displayLabel = status.replace(/_/g, " ");
  let badgeClass = "status-badge";

  if (status === "ACCEPTED") {
    badgeClass += " status-badge-ready";
    displayLabel = "Accepted";
  } else if (["REJECTED", "REVISION_REQUESTED", "UNSAFE_REDACTION_REQUIRED"].includes(status)) {
    badgeClass += " status-badge-blocked";
    displayLabel = "Revision Needed";
  } else if (["SUBMITTED", "UNDER_REVIEW", "ESCALATED"].includes(status)) {
    badgeClass += " status-badge-published";
    displayLabel = "Under Review";
  }

  return <span className={badgeClass}>{displayLabel}</span>;
}

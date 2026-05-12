import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requirePermissionIdentity } from "@/lib/auth/server";
import { canViewCohortOversight } from "@/lib/permissions/scoped-access";
import { getCohortSafeSummary } from "@/lib/cohort-safe-summary";

type CohortSummaryPageProps = {
  params: Promise<{
    cohortId: string;
  }>;
};

export default async function CohortSafeSummaryPage({ params }: CohortSummaryPageProps) {
  const { cohortId } = await params;
  const pathname = `/oversight/cohorts/${cohortId}`;

  // 1. Core Security Evaluation
  const identity = await requirePermissionIdentity(pathname);
  const hasAccess = canViewCohortOversight(identity, cohortId);

  if (!hasAccess) {
    redirect(`/forbidden?reason=OVERSIGHT_RESTRICTED&next=${encodeURIComponent(pathname)}`);
  }

  // 2. Data Loading
  const summary = await getCohortSafeSummary(cohortId);

  if (!summary) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Cohort Facilitator View" title={summary.cohortName}>
      <div className="admin-dashboard">
        {/* Summary Banner */}
        <section className="admin-hero">
          <div>
            <h2>Safe Learner Support Tracker</h2>
            <p>
              Monitor learner activation, assigned course completion, and progress deadlines.
              Raw reflective proof texts and sensitive assessment data are excluded by default
              to protect learner confidentiality.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/learn">
              Back to Learning
            </Link>
          </div>
        </section>

        {/* Cohort Metrics Overview */}
        <section className="admin-section" aria-labelledby="cohort-kpi-title">
          <div className="admin-section-heading">
            <h2 id="cohort-kpi-title">Performance Baseline</h2>
            <p>Aggregated participant statuses for {summary.cohortName}.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              label="Total Participants"
              value={summary.totalParticipantsCount}
              detail="Total users attached to cohort"
            />
            <MetricCard
              label="Currently Active"
              value={summary.activeParticipantsCount}
              detail="Engaged learners progressing"
            />
            <MetricCard
              label="Fully Completed"
              value={summary.completedParticipantsCount}
              detail="Finalized all requirements"
            />
            <MetricCard
              label="Assigned Courses"
              value={summary.totalCourseCount}
              detail="Core curriculum tracks"
            />
          </div>
        </section>

        {/* Roster */}
        <section className="admin-section" aria-labelledby="roster-title">
          <div className="admin-section-heading">
            <h2 id="roster-title">Safe Cohort Roster</h2>
            <p>Scoped individual learner tracking.</p>
          </div>
          <div className="admin-table-card">
            {summary.roster.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Participation Status</th>
                    <th>Due Date</th>
                    <th>Course Progress</th>
                    <th>Support Need</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.roster.map((participant) => (
                    <tr key={participant.userId}>
                      <td>
                        <strong>{participant.userName}</strong>
                      </td>
                      <td>
                        <ParticipantStatusBadge status={participant.status} />
                      </td>
                      <td>
                        {participant.dueAt
                          ? new Date(participant.dueAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>
                          {participant.completedCourseCount} / {summary.totalCourseCount}
                        </span>
                      </td>
                      <td>
                        <SupportIndicatorBadge indicator={participant.supportIndicator} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="workspace-empty-message" style={{ padding: "1rem" }}>
                No participants have been assigned to this cohort.
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

function ParticipantStatusBadge({ status }: { status: string }) {
  let displayLabel = status.toLowerCase();
  displayLabel = displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1);

  let badgeClass = "status-badge";

  if (status === "COMPLETED") {
    badgeClass += " status-badge-ready";
  } else if (status === "ACTIVE") {
    badgeClass += " status-badge-published";
  } else if (["WITHDRAWN", "EXPIRED", "CANCELLED", "SUSPENDED"].includes(status)) {
    badgeClass += " status-badge-blocked";
  }

  return <span className={badgeClass}>{displayLabel}</span>;
}

function SupportIndicatorBadge({ indicator }: { indicator: string }) {
  if (indicator === "NONE") {
    return <span className="status-badge" style={{ opacity: 0.6 }}>None</span>;
  }

  if (indicator === "OVERDUE") {
    return <span className="status-badge status-badge-blocked">Overdue</span>;
  }

  return <span className="status-badge">{indicator}</span>;
}

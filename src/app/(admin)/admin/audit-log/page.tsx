import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminAuditLogSummary,
  type AdminAuditLogEntry,
} from "@/lib/admin/audit-log";
import Link from "next/link";

export default async function AdminAuditLogPage() {
  const auditLog = await getAdminAuditLogSummary();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Audit Log">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Governance activity record</h2>
            <p>
              Review Admin changes to reference data, diagnosis records, and
              platform governance records.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="audit-health-title">
          <div className="admin-section-heading">
            <h2 id="audit-health-title">Audit health</h2>
            <p>Recent governance events currently recorded by the platform.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Governance events recorded"
              label="Total records"
              value={auditLog.totals.total}
            />
            <MetricCard
              detail="Routine Admin changes"
              label="Low risk"
              value={auditLog.totals.lowRisk}
            />
            <MetricCard
              detail="Approval or lock actions"
              label="Medium risk"
              value={auditLog.totals.mediumRisk}
            />
            <MetricCard
              detail="Restricted events"
              label="High risk"
              value={auditLog.totals.highRisk}
            />
          </div>
        </section>

        {auditLog.entries.length > 0 ? (
          <section className="admin-section" aria-labelledby="audit-events-title">
            <div className="admin-section-heading">
              <h2 id="audit-events-title">Recent activity</h2>
              <p>
                The latest Admin governance events, including action reason and
                snapshot availability.
              </p>
            </div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Reason</th>
                    <th>Actor</th>
                    <th>Risk</th>
                    <th>Date</th>
                    <th>Snapshots</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.entries.map((entry) => (
                    <AuditLogRow entry={entry} key={entry.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-published">
              No records
            </span>
            <h2>No Admin activity has been recorded yet</h2>
            <p>
              Admin changes to datasets, diagnosis records, and platform
              governance settings will appear here once they are made.
            </p>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

function AuditLogRow({ entry }: { entry: AdminAuditLogEntry }) {
  return (
    <tr>
      <td>
        <strong>{entry.action}</strong>
      </td>
      <td>
        <span>{entry.entityType}</span>
        <small>{entry.entityId}</small>
      </td>
      <td>{entry.reason || "No reason recorded"}</td>
      <td>{entry.actorLabel}</td>
      <td>
        <span className={`status-badge ${riskBadgeClass(entry.riskLevel)}`}>
          {entry.riskLevel}
        </span>
      </td>
      <td>{formatDateTime(entry.createdAt)}</td>
      <td>
        {entry.hasBeforeSnapshot || entry.hasAfterSnapshot
          ? `${entry.hasBeforeSnapshot ? "Before" : ""}${
              entry.hasBeforeSnapshot && entry.hasAfterSnapshot ? " / " : ""
            }${entry.hasAfterSnapshot ? "After" : ""}`
          : "Not stored"}
      </td>
    </tr>
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function riskBadgeClass(riskLevel: string) {
  if (riskLevel.toLowerCase() === "medium") {
    return "status-badge-published";
  }

  if (riskLevel.toLowerCase() === "high") {
    return "status-badge-blocked";
  }

  return "status-badge-ready";
}

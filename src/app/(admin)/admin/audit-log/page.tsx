import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  adminAuditActionFilterOptions,
  adminAuditEntityFilterOptions,
  formatAdminAuditFilterLabel,
  getAdminAuditLogSummary,
  type AdminAuditLogEntry,
} from "@/lib/admin/audit-log";
import Link from "next/link";

type AdminAuditLogPageProps = {
  searchParams?: Promise<{
    action?: string;
    entity?: string;
    reason?: string;
    risk?: string;
  }>;
};

export default async function AdminAuditLogPage({
  searchParams,
}: AdminAuditLogPageProps) {
  const params = await searchParams;
  const auditLog = await getAdminAuditLogSummary({
    action: params?.action,
    entityType: params?.entity,
    reasonStatus: params?.reason === "missing" ? "MISSING_REASON" : params?.reason === "present" ? "WITH_REASON" : undefined,
    riskLevel:
      params?.risk === "LOW" ||
      params?.risk === "MEDIUM" ||
      params?.risk === "HIGH"
        ? params.risk
        : undefined,
  });
  const activeFilters = auditLog.filters;

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Audit Log">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Governance activity record</h2>
            <p>
              Review Admin changes to reference data, diagnosis records, and
              platform governance records. Sensitive actions should show an
              actor, affected record, reason, risk level, and before or after
              snapshot where the current workflow captures one.
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

        <section className="admin-section" aria-labelledby="audit-filters-title">
          <div className="admin-section-heading">
            <h2 id="audit-filters-title">Filters</h2>
            <p>
              Narrow recent activity by risk, action, entity type, or whether a
              reason was recorded.
            </p>
          </div>
          <form action="/admin/audit-log" className="admin-table-card">
            <div className="context-grid">
              <label className="workspace-label">
                <span>Risk</span>
                <select name="risk" defaultValue={activeFilters.riskLevel ?? ""}>
                  <option value="">All risks</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>
              <label className="workspace-label">
                <span>Entity</span>
                <select name="entity" defaultValue={activeFilters.entityType ?? ""}>
                  <option value="">All entities</option>
                  {adminAuditEntityFilterOptions.map((entity) => (
                    <option key={entity} value={entity}>
                      {entity}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>Action</span>
                <select name="action" defaultValue={activeFilters.action ?? ""}>
                  <option value="">All actions</option>
                  {adminAuditActionFilterOptions.map((action) => (
                    <option key={action} value={action}>
                      {formatAdminAuditFilterLabel(action)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>Reason</span>
                <select
                  name="reason"
                  defaultValue={
                    activeFilters.reasonStatus === "WITH_REASON"
                      ? "present"
                      : activeFilters.reasonStatus === "MISSING_REASON"
                        ? "missing"
                        : ""
                  }
                >
                  <option value="">All records</option>
                  <option value="present">Reason recorded</option>
                  <option value="missing">Missing reason</option>
                </select>
              </label>
            </div>
            <div className="workspace-nav" aria-label="Audit filter actions">
              <button className="workspace-button" type="submit">
                Apply filters
              </button>
              <Link className="workspace-link secondary" href="/admin/audit-log">
                Clear filters
              </Link>
            </div>
          </form>
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
              No matching records
            </span>
            <h2>No Admin activity matches the current view</h2>
            <p>
              Adjust the filters to review other Admin activity. If the log is
              empty without filters, Admin changes to governed records will
              appear here once they are made.
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

import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  adminAuditActionFilterOptions,
  adminAuditAreaFilterOptions,
  adminAuditEntityFilterOptions,
  getAdminAuditLogSummary,
  type AdminAuditLogEntry,
} from "@/lib/admin/audit-log";

type AdminAuditLogPageProps = {
  searchParams?: Promise<{
    action?: string;
    actor?: string;
    area?: string;
    date?: string;
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
    actorId: params?.actor,
    area: params?.area,
    dateRange: params?.date,
    entityType: params?.entity,
    reasonStatus: getReasonStatusFilter(params?.reason),
    riskLevel: getRiskFilter(params?.risk),
  });
  const activeFilters = auditLog.filters;

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Audit Log">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Admin activity record</h2>
            <p>
              Review sensitive Admin actions in plain language: what happened,
              who did it, when it happened, why it was done, and which record
              was affected. Change details are shown only as stored/not stored;
              raw internal payloads stay hidden.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="audit-health-title">
          <div className="admin-section-heading">
            <h2 id="audit-health-title">Audit health</h2>
            <p>Recent Admin actions currently recorded by the platform.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Admin actions recorded"
              label="Total records"
              value={auditLog.totals.total}
            />
            <MetricCard
              detail="Routine Admin changes"
              label="Low risk"
              value={auditLog.totals.lowRisk}
            />
            <MetricCard
              detail="Approval, release, or membership changes"
              label="Medium risk"
              value={auditLog.totals.mediumRisk}
            />
            <MetricCard
              detail="Restricted certificate, role, or data-safety changes"
              label="High risk"
              value={auditLog.totals.highRisk}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="audit-filters-title">
          <div className="admin-section-heading">
            <h2 id="audit-filters-title">Find Admin actions</h2>
            <p>
              Filter by work area, action type, affected record, risk level,
              who made the change, reason status, or recent date range.
            </p>
          </div>
          <form action="/admin/audit-log" className="admin-table-card">
            <div className="context-grid">
              <label className="workspace-label">
                <span>Work area</span>
                <select name="area" defaultValue={activeFilters.area ?? ""}>
                  <option value="">All work areas</option>
                  {adminAuditAreaFilterOptions.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>What happened</span>
                <select name="action" defaultValue={activeFilters.action ?? ""}>
                  <option value="">All action types</option>
                  {adminAuditActionFilterOptions.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>Affected record</span>
                <select name="entity" defaultValue={activeFilters.entityType ?? ""}>
                  <option value="">All affected records</option>
                  {adminAuditEntityFilterOptions.map((entity) => (
                    <option key={entity.value} value={entity.value}>
                      {entity.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>Risk level</span>
                <select name="risk" defaultValue={activeFilters.riskLevel ?? ""}>
                  <option value="">All risks</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>
              <label className="workspace-label">
                <span>Who</span>
                <select name="actor" defaultValue={activeFilters.actorId ?? ""}>
                  <option value="">All Admins</option>
                  {auditLog.actorOptions.map((actor) => (
                    <option key={actor.value} value={actor.value}>
                      {actor.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="workspace-label">
                <span>Why</span>
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
                  <option value="missing">No reason recorded</option>
                </select>
              </label>
              <label className="workspace-label">
                <span>When</span>
                <select name="date" defaultValue={activeFilters.dateRange ?? ""}>
                  <option value="">Any time</option>
                  <option value="LAST_7_DAYS">Last 7 days</option>
                  <option value="LAST_30_DAYS">Last 30 days</option>
                </select>
              </label>
            </div>
            <p className="workspace-note">
              Filters only change which audit records are listed. Change details
              are never opened here, and raw proof or internal payloads are not
              shown.
            </p>
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
              <h2 id="audit-events-title">Recent Admin actions</h2>
              <p>
                The latest records show what happened, who did it, why it was
                done, and whether change details were stored.
              </p>
            </div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>What happened</th>
                    <th>Affected record</th>
                    <th>Why</th>
                    <th>Who</th>
                    <th>Risk</th>
                    <th>When</th>
                    <th>Change details</th>
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
  const isHighRisk = entry.riskLevel === "HIGH";

  return (
    <tr>
      <td>
        <strong>{entry.actionLabel}</strong>
        <small>
          {entry.areaLabel}
          {isHighRisk ? " · High-risk action" : ""}
        </small>
      </td>
      <td>
        <span>{entry.entityLabel}</span>
        <small>{entry.entityId}</small>
      </td>
      <td>
        <span>{entry.reason || "No reason recorded"}</span>
        <small>{entry.reasonStatus}</small>
      </td>
      <td>{entry.actorLabel}</td>
      <td>
        <span className={`status-badge ${riskBadgeClass(entry.riskLevel)}`}>
          {entry.riskLabel}
        </span>
      </td>
      <td>{formatDateTime(entry.createdAt)}</td>
      <td>{entry.snapshotLabel}</td>
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

function getReasonStatusFilter(value: string | undefined) {
  if (value === "missing") {
    return "MISSING_REASON";
  }

  if (value === "present") {
    return "WITH_REASON";
  }

  return undefined;
}

function getRiskFilter(value: string | undefined) {
  return value === "LOW" || value === "MEDIUM" || value === "HIGH"
    ? value
    : undefined;
}

function riskBadgeClass(riskLevel: string) {
  if (riskLevel === "MEDIUM") {
    return "status-badge-published";
  }

  if (riskLevel === "HIGH") {
    return "status-badge-blocked";
  }

  return "status-badge-ready";
}

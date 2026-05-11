import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminAuthorityOverview,
  isSuperAdminEquivalentForPhase1,
  type AuthorityAuditActivity,
  type ScopedPlatformAdminAuthority,
  type SuperAdminEquivalentUser,
} from "@/lib/admin/admin-authority";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import {
  GrantPlatformAdminPanel,
  PlatformAdminStatusControl,
} from "./PlatformAdminControls";

export default async function AdminAuthorityPage() {
  const identity = await requireWorkspaceIdentity("/admin/admin-authority");
  const isSuperAdmin = isSuperAdminEquivalentForPhase1(identity.session.role);
  const overview = await getAdminAuthorityOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Admin Authority">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Super Admin-equivalent and Platform Admin authority</h2>
            <p>
              Review who holds the current Phase 1 Admin authority levels and
              what recent authority-related changes were recorded. Manage Platform Admin authority assignments below.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="authority-rules-title">
          <div className="admin-section-heading">
            <h2 id="authority-rules-title">Authority rules</h2>
            <p>
              These rules keep high-risk Admin access visible and controlled.
            </p>
          </div>
          <div className="admin-card-grid">
            <article className="admin-readiness-card">
              <div>
                <h3>Super Admin-equivalent authority</h3>
                <span className="status-badge status-badge-blocked">ADMIN</span>
              </div>
              <p>
                The current <strong>ADMIN</strong> role is the Phase 1 Super
                Admin-equivalent authority.
              </p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Platform Admin workspace authority</h3>
                <span className="status-badge status-badge-ready">
                  PLATFORM_ADMIN
                </span>
              </div>
              <p>
                Scoped <strong>PLATFORM_ADMIN</strong> authority gives
                day-to-day Admin workspace access.
              </p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Authority changes</h3>
                <span className="status-badge status-badge-published">
                  Controlled
                </span>
              </div>
              <p>
                Only Super Admin-equivalent users can grant or change Platform
                Admin authority.
              </p>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="authority-summary-title">
          <div className="admin-section-heading">
            <h2 id="authority-summary-title">Authority summary</h2>
            <p>Current authority records from existing role data.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Users with the current ADMIN authority"
              label="Super Admin-equivalent"
              value={overview.totals.superAdminEquivalentUsers}
            />
            <MetricCard
              detail="Scoped Platform Admin assignments"
              label="Platform Admin"
              value={overview.totals.scopedPlatformAdmins}
            />
            <MetricCard
              detail="Recent safe role and authority records"
              label="Audit activity"
              value={overview.totals.recentAuthorityEvents}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="super-admins-title">
          <div className="admin-section-heading">
            <h2 id="super-admins-title">Super Admin-equivalent users</h2>
            <p>
              Users shown here hold the current <strong>ADMIN</strong> role.
            </p>
          </div>
          {overview.superAdminEquivalentUsers.length > 0 ? (
            <div className="admin-user-list">
              {overview.superAdminEquivalentUsers.map((user) => (
                <SuperAdminEquivalentCard key={user.membershipId} user={user} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No records
              </span>
              <h2>No Super Admin-equivalent users found</h2>
              <p>
                At least one trusted user should hold the current ADMIN
                authority before broader Admin operation.
              </p>
            </section>
          )}
        </section>

        <section className="admin-section" aria-labelledby="platform-admins-title">
          <div className="admin-section-heading">
            <h2 id="platform-admins-title">Scoped Platform Admin authority</h2>
            <p>
              Manage assignments that grant specific workspace-level access.
            </p>
          </div>

          {isSuperAdmin && <GrantPlatformAdminPanel />}
          {overview.scopedPlatformAdmins.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Scope</th>
                    <th>Reason</th>
                    <th>Starts</th>
                    <th>Ends</th>
                    <th>Created by</th>
                    {isSuperAdmin && <th style={{ width: "120px" }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {overview.scopedPlatformAdmins.map((authority) => (
                    <ScopedPlatformAdminRow
                      authority={authority}
                      isSuperAdmin={isSuperAdmin}
                      key={authority.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-ready">
                No scoped assignments
              </span>
              <h2>No scoped Platform Admin authority found</h2>
              <p>
                Day-to-day Admin access may still be covered by current ADMIN
                users. Grant the first scoped assignment to activate delegation.
              </p>
            </section>
          )}
        </section>

        <section className="admin-section" aria-labelledby="authority-audit-title">
          <div className="admin-section-heading">
            <h2 id="authority-audit-title">Recent authority activity</h2>
            <p>
              Safe audit summaries for role, invitation, and membership changes.
              Before and after payloads are not opened here.
            </p>
          </div>
          {overview.auditActivity.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>What happened</th>
                    <th>Affected record</th>
                    <th>Who</th>
                    <th>Why</th>
                    <th>Risk</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.auditActivity.map((activity) => (
                    <AuthorityAuditRow activity={activity} key={activity.id} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-ready">
                No recent activity
              </span>
              <h2>No authority-related audit activity found</h2>
              <p>
                Role, invitation, and membership changes will appear here after
                they are recorded.
              </p>
            </section>
          )}
        </section>

        <nav className="workspace-nav" aria-label="Admin authority links">
          <Link className="workspace-link primary" href="/admin/users">
            Open Users and Roles
          </Link>
          <Link className="workspace-link" href="/admin/audit-log">
            Open Audit Log
          </Link>
        </nav>
      </div>
    </WorkspaceShell>
  );
}

function SuperAdminEquivalentCard({
  user,
}: {
  user: SuperAdminEquivalentUser;
}) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <div className="reference-badge-row">
          <span className="status-badge status-badge-blocked">
            Super Admin-equivalent
          </span>
          <span className="status-badge status-badge-published">
            {user.organizationName}
          </span>
        </div>
      </div>
      <dl className="reference-meta-list">
        <div>
          <dt>User status</dt>
          <dd>{getAdminStatusLabel(user.userStatus)}</dd>
        </div>
        <div>
          <dt>Membership status</dt>
          <dd>{getAdminStatusLabel(user.membershipStatus)}</dd>
        </div>
        <div>
          <dt>Authority source</dt>
          <dd>ADMIN membership role</dd>
        </div>
      </dl>
    </article>
  );
}

function ScopedPlatformAdminRow({
  authority,
  isSuperAdmin,
}: {
  authority: ScopedPlatformAdminAuthority;
  isSuperAdmin: boolean;
}) {
  return (
    <tr>
      <td>
        <strong>{authority.name}</strong>
        <small>{authority.email}</small>
      </td>
      <td>
        <span className={`status-badge ${statusBadgeClass(authority.status)}`}>
          {getAdminStatusLabel(authority.status)}
        </span>
      </td>
      <td>
        <span>{formatScopeType(authority.scopeType)}</span>
        <small>
          {authority.scopeLabel}
          {authority.scopeId ? ` · ${authority.scopeId}` : ""}
        </small>
      </td>
      <td>{authority.reason || "No reason recorded"}</td>
      <td>{formatDate(authority.startsAt)}</td>
      <td>{formatDate(authority.endsAt)}</td>
      <td>{authority.createdByLabel}</td>
      {isSuperAdmin && (
        <td>
          <PlatformAdminStatusControl
            assignmentId={authority.id}
            currentStatus={authority.status}
          />
        </td>
      )}
    </tr>
  );
}

function AuthorityAuditRow({
  activity,
}: {
  activity: AuthorityAuditActivity;
}) {
  return (
    <tr>
      <td>
        <strong>{activity.actionLabel}</strong>
      </td>
      <td>
        <span>{activity.entityLabel}</span>
        <small>{activity.entityId}</small>
      </td>
      <td>{activity.actorLabel}</td>
      <td>{activity.reason || "No reason recorded"}</td>
      <td>
        <span className={`status-badge ${riskBadgeClass(activity.riskLevel)}`}>
          {getAdminStatusLabel(activity.riskLevel)}
        </span>
      </td>
      <td>{formatDate(activity.createdAt)}</td>
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

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatScopeType(value: string) {
  return value
    .toLowerCase()
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function riskBadgeClass(riskLevel: string) {
  if (riskLevel === "HIGH") {
    return "status-badge-blocked";
  }

  if (riskLevel === "MEDIUM") {
    return "status-badge-published";
  }

  return "status-badge-ready";
}

function statusBadgeClass(status: string) {
  return status === "ACTIVE" ? "status-badge-ready" : "status-badge-blocked";
}

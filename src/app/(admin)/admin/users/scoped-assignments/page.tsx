import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getScopedRoleAssignmentsOverview } from "@/lib/admin/scoped-assignments";
import { isSuperAdminEquivalentForPhase1 } from "@/lib/admin/admin-authority";
import { requirePermissionIdentity } from "@/lib/auth/server";
import {
  GrantScopedRolePanel,
  ScopedAssignmentStatusControl,
} from "./ScopedAssignmentControls";

export default async function ScopedAssignmentsOverviewPage() {
  const identity = await requirePermissionIdentity(
    "/admin/users/scoped-assignments",
  );
  const isSuperAdmin = isSuperAdminEquivalentForPhase1(identity.session.role);
  const overview = await getScopedRoleAssignmentsOverview();

  return (
    <WorkspaceShell eyebrow="Admin Workspace" title="Local Scoped Roles">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Local Role & Scope Assignment</h2>
            <p>
              Delegates specific scoped authority (e.g., Facilitator, Focal Person, Safe Dashboard Viewer) 
              to active system users bounded by Organizations, Programs, Cohorts, or Courses.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              className="workspace-link secondary"
              href="/admin/users"
            >
              Back to Users Registry
            </Link>
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="active-assignments-title"
        >
          <div className="admin-section-heading">
            <h2 id="active-assignments-title">Authority Records</h2>
            <p>Active and recently expired/revoked scoped access logs.</p>
          </div>

          {isSuperAdmin && (
            <GrantScopedRolePanel />
          )}

          {overview.recentAssignments.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Target User</th>
                    <th>Local Role</th>
                    <th>Bound Dimension</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Authorized</th>
                    {isSuperAdmin && <th style={{ width: "120px" }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {overview.recentAssignments.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.userName}</strong>
                        <small style={{ display: "block", opacity: 0.7 }}>
                          {item.userEmail}
                        </small>
                      </td>
                      <td>
                        <span className="status-badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc" }}>
                          {item.roleKey}
                        </span>
                      </td>
                      <td>
                        <span>{item.scopeLabel}</span>
                        <small style={{ display: "block", opacity: 0.7 }}>
                          {item.scopeType} (ID: {item.scopeId})
                        </small>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.875rem" }}>
                          {item.reason}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${item.status === "ACTIVE" ? "status-badge-ready" : "status-badge-blocked"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <small style={{ display: "block" }}>
                          {formatDate(item.createdAt)}
                        </small>
                        <small style={{ display: "block", opacity: 0.7 }}>
                          by {item.createdByLabel}
                        </small>
                      </td>
                      {isSuperAdmin && (
                        <td>
                          <ScopedAssignmentStatusControl
                            assignmentId={item.id}
                            currentStatus={item.status}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-panel">
              <span className="status-badge status-badge-ready">
                No records
              </span>
              <p style={{ marginTop: "0.5rem" }}>
                No general scoped assignments currently active.
              </p>
            </div>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function formatDate(value: Date | null) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

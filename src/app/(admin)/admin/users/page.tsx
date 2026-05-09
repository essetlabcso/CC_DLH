import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { roles } from "@/lib/access";
import { getAdminUsersOverview, type AdminUserSummary } from "@/lib/admin/users";
import { updateUserRolesAction } from "@/app/(admin)/admin/users/actions";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { getAdminRoleLabel, getAdminStatusLabel } from "@/lib/admin/role-labels";
import Link from "next/link";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/admin/users");
  const overview = await getAdminUsersOverview();
  const canManageAdminAuthority = identity.session.role === "admin";

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Users and Roles">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>User and role management</h2>
            <p>
              Review current users, manage operational access, and keep
              Platform Admin authority under Super Admin-equivalent control.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <StatusMessage searchParams={resolvedSearchParams} />

        <section className="admin-section" aria-labelledby="user-health-title">
          <div className="admin-section-heading">
            <h2 id="user-health-title">User access summary</h2>
            <p>Live role counts from current organization memberships.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Known platform users"
              label="Users"
              value={overview.totals.users}
            />
            <MetricCard
              detail="Users currently active"
              label="Active"
              value={overview.totals.activeUsers}
            />
            <MetricCard
              detail="Can grant or change Platform Admin authority"
              label="Super Admin-equivalent"
              value={overview.totals.admins}
            />
            <MetricCard
              detail="Can create courses"
              label="Creators"
              value={overview.totals.creators}
            />
            <MetricCard
              detail="Can review courses"
              label="Reviewers"
              value={overview.totals.reviewers}
            />
            <MetricCard
              detail="Can access participant runtime"
              label="Participants"
              value={overview.totals.learners}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="users-title">
          <div className="admin-section-heading">
            <h2 id="users-title">Users</h2>
            <p>
              Role updates are recorded in the Admin audit log. This foundation
              does not create external authentication accounts.
            </p>
          </div>

          {overview.users.length > 0 ? (
            <div className="admin-user-list">
              {overview.users.map((user) => (
                <UserAccessCard
                  canManageAdminAuthority={canManageAdminAuthority}
                  key={user.id}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No users
              </span>
              <h2>No users found</h2>
              <p>
                Users will appear here after sign-in or future Admin account
                creation workflows.
              </p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function UserAccessCard({
  canManageAdminAuthority,
  user,
}: {
  canManageAdminAuthority: boolean;
  user: AdminUserSummary;
}) {
  const hasAdminAuthority = user.roles.includes("admin");
  const canUpdate =
    Boolean(user.membershipId) &&
    (canManageAdminAuthority || !hasAdminAuthority);
  const assignableRoles = canManageAdminAuthority
    ? roles
    : roles.filter((role) => role !== "admin");

  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <div className="reference-badge-row">
          <span className="status-badge status-badge-ready">
            {getAdminStatusLabel(user.status)}
          </span>
          <span className="status-badge status-badge-published">
            {user.organizationName}
          </span>
        </div>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Current roles</dt>
          <dd>
            {user.roles.length > 0
              ? user.roles.map(getAdminRoleLabel).join(", ")
              : "None"}
          </dd>
        </div>
        <div>
          <dt>Membership</dt>
          <dd>
            {user.membershipStatus
              ? getAdminStatusLabel(user.membershipStatus)
              : "None"}
          </dd>
        </div>
        <div>
          <dt>Courses owned</dt>
          <dd>{user.courseCount}</dd>
        </div>
        <div>
          <dt>Certificates</dt>
          <dd>{user.certificateCount}</dd>
        </div>
      </dl>

      {canUpdate ? (
        <form
          action={updateUserRolesAction.bind(null, user.membershipId ?? "")}
          className="admin-inline-form"
        >
          <fieldset>
            <legend>Assigned roles</legend>
            <div className="reference-visibility-grid">
              {assignableRoles.map((role) => (
                <label className="checkbox-row" key={role}>
                  <input
                    defaultChecked={user.roles.includes(role)}
                    name="roles"
                    type="checkbox"
                    value={role}
                  />
                  <span>{getAdminRoleLabel(role)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {!canManageAdminAuthority && hasAdminAuthority ? (
            <p className="workspace-note">
              Platform Admin authority is controlled by Super Admin-equivalent users.
            </p>
          ) : null}
          <label>
            <span>Reason for role update</span>
            <textarea
              name="changeReason"
              placeholder="Briefly explain why these role assignments are changing."
              required
              rows={3}
            />
          </label>
          <button className="workspace-link" type="submit">
            Save roles
          </button>
        </form>
      ) : (
        <p className="workspace-note">
          {hasAdminAuthority && !canManageAdminAuthority
            ? "Platform Admin authority is controlled by Super Admin-equivalent users."
            : "This user does not have an active membership to update."}
        </p>
      )}
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

function StatusMessage({
  searchParams,
}: {
  searchParams:
    | {
        error?: string;
        updated?: string;
      }
    | undefined;
}) {
  if (searchParams?.error) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-blocked">
          Action needed
        </span>
        <p>{searchParams.error}</p>
      </section>
    );
  }

  if (searchParams?.updated) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-ready">Updated</span>
        <p>User roles have been updated.</p>
      </section>
    );
  }

  return null;
}

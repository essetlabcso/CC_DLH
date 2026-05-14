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

const mvpRoleSummaries = [
  {
    title: "Admin",
    detail: "Platform governance, reference data, reporting, and admin console access.",
    status: "Core role",
  },
  {
    title: "Course Creator",
    detail: "Creates course designs from approved diagnosis evidence.",
    status: "Core role",
  },
  {
    title: "Reviewer",
    detail: "Reviews course versions and supports publish governance.",
    status: "Core role",
  },
  {
    title: "Proof Verifier",
    detail: "Reviews practical proof queues without changing certificates.",
    status: "Scoped workflow",
  },
  {
    title: "Organization Admin",
    detail: "Manages or views assigned CSO/organization records within scope.",
    status: "Scoped role",
  },
  {
    title: "Facilitator",
    detail: "Supports assigned cohorts, courses, or organization learning activity.",
    status: "Scoped role",
  },
  {
    title: "Participant",
    detail: "Learns through assigned courses, programs, cohorts, or open access.",
    status: "Core role",
  },
];

const scopeSummaries = [
  {
    title: "Program",
    detail: "Supported by local scoped assignments.",
  },
  {
    title: "Project",
    detail: "Visible as an MVP scope concept; no separate auth filter is rewired here.",
  },
  {
    title: "CSO / Organization",
    detail: "Supported through organization memberships and scoped assignments.",
  },
  {
    title: "Cohort",
    detail: "Supported for facilitator-style scoped access when cohorts are used.",
  },
  {
    title: "Course",
    detail: "Supported for local course-bounded assignments.",
  },
  {
    title: "Proof Queue",
    detail: "Managed through the separate Proof Verifier assignment workflow.",
  },
];

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
            <h2>Users & Roles</h2>
            <p>
              Review current users, manage platform access, and make role
              boundaries visible across the admin MVP.
            </p>
            <p>Users only access records within their assigned scope.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link className="workspace-link" href="/admin/users/scoped-assignments">
              Manage scoped assignments
            </Link>
            <Link className="workspace-link secondary" href="/admin/proof-badges/assignments">
              Proof verifier queue
            </Link>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <StatusMessage searchParams={resolvedSearchParams} />

        <section className="admin-section" aria-labelledby="role-scope-title">
          <div className="admin-section-heading">
            <h2 id="role-scope-title">MVP roles and scope boundaries</h2>
            <p>
              Core platform roles are assigned from this registry. Local scoped
              roles and proof queue assignments remain in their dedicated
              assignment screens.
            </p>
          </div>
          <div className="admin-card-grid">
            {mvpRoleSummaries.map((role) => (
              <article className="admin-readiness-card" key={role.title}>
                <div>
                  <h3>{role.title}</h3>
                  <span className="status-badge status-badge-ready">
                    {role.status}
                  </span>
                </div>
                <p>{role.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="scope-summary-title">
          <div className="admin-section-heading">
            <h2 id="scope-summary-title">Scope summary</h2>
            <p>
              Users only access records within their assigned scope. Use scoped
              assignments for bounded local authority rather than broad platform
              access.
            </p>
          </div>
          <div className="admin-card-grid">
            {scopeSummaries.map((scope) => (
              <article className="admin-readiness-card" key={scope.title}>
                <div>
                  <h3>{scope.title}</h3>
                  <span className="status-badge">Scope concept</span>
                </div>
                <p>{scope.detail}</p>
              </article>
            ))}
          </div>
          <div className="admin-card-actions" style={{ marginTop: "1rem" }}>
            <Link className="workspace-link" href="/admin/users/scoped-assignments">
              Open scoped assignments
            </Link>
            <Link className="workspace-link secondary" href="/admin/proof-badges/assignments">
              Open proof queue assignments
            </Link>
          </div>
        </section>

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
              detail="Platform governance users"
              label="Admins"
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
              does not create external authentication accounts. Admin authority
              remains controlled by Super Admin-equivalent users.
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

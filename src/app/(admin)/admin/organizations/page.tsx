import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import { getOrganizationsOverview, type OrganizationSummary } from "@/lib/admin/organizations";
import Link from "next/link";

export default async function AdminOrganizationsPage() {
  const overview = await getOrganizationsOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="CSOs & Programs">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>CSOs & Programs</h2>
            <p>
              Review registered CSOs, programs, optional cohorts, participants,
              and safe organization summaries for the admin MVP.
            </p>
            <p>
              Cohorts are optional. Courses can also be assigned directly
              through projects or open/self-paced access.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link" href="/admin/organizations/new">
              New CSO / Organization
            </Link>
            <Link className="workspace-link secondary" href="/admin/programs-cohorts">
              Programs & Cohorts
            </Link>
            <Link className="workspace-link secondary" href="/admin/participant-access">
              Participants
            </Link>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="cso-navigation-title">
          <div className="admin-section-heading">
            <h2 id="cso-navigation-title">CSO structure</h2>
            <p>
              Use these areas to move between CSO records, program and cohort
              groupings, and participant access. Program and cohort records are
              read-only in the current admin MVP; participant assignment actions
              live in Participant Access.
            </p>
          </div>
          <div className="admin-card-grid">
            <QuickLinkCard
              detail="Registered CSO/organization profiles and safe rollups."
              href="#registered-csos"
              label="CSOs"
            />
            <QuickLinkCard
              detail="Read-only program records and participating CSOs."
              href="/admin/programs-cohorts#programs"
              label="Programs"
            />
            <QuickLinkCard
              detail="Optional cohort groups where a program uses cohort delivery."
              href="/admin/programs-cohorts#cohorts"
              label="Cohorts"
            />
            <QuickLinkCard
              detail="Invitations, enrollments, program participants, and cohort participants."
              href="/admin/participant-access"
              label="Participants"
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="cso-safety-title">
          <div className="admin-section-heading">
            <h2 id="cso-safety-title">Safe organization summaries</h2>
            <p>
              This view shows aggregate CSO, program, cohort, certificate, and
              verified achievement counts. Raw proof, sensitive learner data,
              and private CSO documents are not shown here.
            </p>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="org-health-title">
          <div className="admin-section-heading">
            <h2 id="org-health-title">CSO and participant summary</h2>
            <p>Live counts of CSOs, programs, optional cohorts, and participants.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Total registered CSOs"
              label="CSOs"
              value={overview.totals.organizations}
            />
            <MetricCard
              detail="Total staff participants"
              label="Participants"
              value={overview.totals.participants}
            />
            <MetricCard
              detail="Program links across CSOs"
              label="Programs"
              value={overview.totals.programs}
            />
            <MetricCard
              detail="Cohort groups linked to CSOs"
              label="Cohorts"
              value={overview.totals.cohorts}
            />
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="orgs-title"
          id="registered-csos"
        >
          <div className="admin-section-heading">
            <h2 id="orgs-title">Registered CSOs</h2>
            <p>
              Review CSO-level learning, program, and cohort grouping
              summaries without exposing raw proof, sensitive learner data, or
              private CSO documents.
            </p>
          </div>

          {overview.organizations.length > 0 ? (
            <div className="admin-user-list">
              {overview.organizations.map((org) => (
                <OrganizationSummaryCard key={org.id} org={org} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No organizations
              </span>
              <h2>No organizations found</h2>
              <p>Organizations will appear here after initial system seeding.</p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function QuickLinkCard({
  detail,
  href,
  label,
}: {
  detail: string;
  href: string;
  label: string;
}) {
  return (
    <article className="admin-readiness-card">
      <div>
        <h3>{label}</h3>
        <Link className="workspace-link secondary" href={href}>
          Open
        </Link>
      </div>
      <p>{detail}</p>
    </article>
  );
}

function OrganizationSummaryCard({ org }: { org: OrganizationSummary }) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{org.name}</h3>
          <p className="admin-record-code">{org.slug}</p>
        </div>
        <div className="reference-badge-row">
          {org.isSystem && (
            <span className="status-badge status-badge-published">System</span>
          )}
          <span
            className={`status-badge ${
              org.status === "ACTIVE"
                ? "status-badge-published"
                : "status-badge-blocked"
            }`}
          >
            {getAdminStatusLabel(org.status)}
          </span>
          <span className="status-badge status-badge-published">
            {org.memberCount} members
          </span>
        </div>
      </div>

      <div className="reference-badge-row" style={{ marginTop: "0.5rem" }}>
        <span className="status-badge">
          {org.organizationType || "Not specified"}
        </span>
        <span className="status-badge">
          {org.geographicFocus || "Not specified"}
        </span>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Courses</dt>
          <dd>{org.courseCount}</dd>
        </div>
        <div>
          <dt>Program links</dt>
          <dd>{org.programCount}</dd>
        </div>
        <div>
          <dt>Cohorts</dt>
          <dd>{org.cohortCount}</dd>
        </div>
        <div>
          <dt>Certificates</dt>
          <dd>{org.certificateCount}</dd>
        </div>
        <div>
          <dt>Verified achievements</dt>
          <dd>{org.achievementCount}</dd>
        </div>
        <div>
          <dt>Registered on</dt>
          <dd>{org.createdAt.toLocaleDateString()}</dd>
        </div>
      </dl>

      <div className="admin-card-actions">
        <Link
          className="workspace-link"
          href={`/admin/organizations/${org.id}`}
        >
          View organization details
        </Link>
      </div>
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

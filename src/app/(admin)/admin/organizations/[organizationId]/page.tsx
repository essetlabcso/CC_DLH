import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getOrganizationDetail } from "@/lib/admin/organizations";
import Link from "next/link";
import { notFound } from "next/navigation";

type OrganizationDetailPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
};

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const { organizationId } = await params;
  const org = await getOrganizationDetail(organizationId);

  if (!org) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title={org.name}>
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>{org.name}</h2>
            <p>Slug: {org.slug}</p>
          </div>
          <Link className="workspace-link secondary" href="/admin/organizations">
            Back to Organizations
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="org-stats-title">
          <div className="admin-section-heading">
            <h2 id="org-stats-title">Safe performance summary</h2>
            <p>Aggregated evidence of learning and application.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Total courses owned by this CSO"
              label="Courses"
              value={org.stats.courses}
            />
            <MetricCard
              detail="Certificates earned by staff"
              label="Certificates"
              value={org.stats.certificates}
            />
            <MetricCard
              detail="Verified applied achievements"
              label="Achievements"
              value={org.stats.achievements}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="org-members-title">
          <div className="admin-section-heading">
            <h2 id="org-members-title">Organization members</h2>
            <p>
              Users associated with this organization and their platform roles.
            </p>
          </div>

          {org.members.length > 0 ? (
            <div className="admin-user-list">
              {org.members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No members
              </span>
              <h2>No members found</h2>
              <p>No users are currently associated with this organization.</p>
            </section>
          )}
        </section>

        <section className="admin-section" aria-labelledby="org-info-title">
          <div className="admin-section-heading">
            <h2 id="org-info-title">Metadata</h2>
          </div>
          <article className="admin-user-card">
            <dl className="reference-meta-list">
              <div>
                <dt>Organization ID</dt>
                <dd>{org.id}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>{org.slug}</dd>
              </div>
              <div>
                <dt>Created at</dt>
                <dd>{org.createdAt.toLocaleString()}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{org.updatedAt.toLocaleString()}</dd>
              </div>
            </dl>
          </article>
        </section>
      </div>
    </WorkspaceShell>
  );
}

function MemberCard({
  member,
}: {
  member: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isHomeOrg: boolean;
  };
}) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{member.name}</h3>
          <p>{member.email}</p>
        </div>
        <div className="reference-badge-row">
          {member.isHomeOrg ? (
            <span className="status-badge status-badge-published">Home Org</span>
          ) : (
            <span className="status-badge status-badge-ready">Member</span>
          )}
        </div>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Roles</dt>
          <dd>
            {member.roles.length > 0
              ? member.roles.map(formatLabel).join(", ")
              : "None"}
          </dd>
        </div>
      </dl>
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

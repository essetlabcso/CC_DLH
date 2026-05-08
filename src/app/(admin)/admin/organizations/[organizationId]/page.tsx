import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getOrganizationDetail } from "@/lib/admin/organizations";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { MembershipManager } from "../MembershipManager";
import Link from "next/link";
import { notFound } from "next/navigation";

type OrganizationDetailPageProps = {
  params: Promise<{
    organizationId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function OrganizationDetailPage({
  params,
  searchParams,
}: OrganizationDetailPageProps) {
  const resolvedSearchParams = await searchParams;
  const { organizationId } = await params;
  const identity = await requireWorkspaceIdentity(
    `/admin/organizations/${organizationId}`,
  );
  const org = await getOrganizationDetail(organizationId);
  const canManageAdminAuthority = identity.session.role === "admin";

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
          <div className="admin-hero-actions">
            <Link 
              className="workspace-link" 
              href={`/admin/organizations/${org.id}/edit`}
            >
              Edit Organization
            </Link>
            <Link className="workspace-link secondary" href="/admin/organizations">
              Back to Organizations
            </Link>
          </div>
        </section>

        <StatusMessage searchParams={resolvedSearchParams} />

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

        <section className="admin-section">
          <MembershipManager
            canManageAdminAuthority={canManageAdminAuthority}
            organizationId={org.id}
            members={org.members}
          />
        </section>

        <section className="admin-section" aria-labelledby="org-info-title">
          <div className="admin-section-heading">
            <h2 id="org-info-title">Administrative metadata</h2>
            <p>Core organizational profile and contact information.</p>
          </div>

          <div className="admin-user-list" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1rem" }}>
            <article className="admin-user-card">
              <div className="admin-section-heading" style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Identity & classification</h3>
              </div>
              <dl className="reference-meta-list">
                <div>
                  <dt>Organization type</dt>
                  <dd>{org.organizationType || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Geographic focus</dt>
                  <dd>{org.geographicFocus || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span
                      className={`status-badge ${
                        org.status === "ACTIVE"
                          ? "status-badge-published"
                          : "status-badge-blocked"
                      }`}
                    >
                      {getAdminStatusLabel(org.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd style={{ whiteSpace: "pre-wrap" }}>
                    {org.description || "No description provided."}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="admin-user-card">
              <div className="admin-section-heading" style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Contact & online presence</h3>
              </div>
              <dl className="reference-meta-list">
                <div>
                  <dt>Contact email</dt>
                  <dd>
                    {org.contactEmail ? (
                      <a href={`mailto:${org.contactEmail}`} className="admin-link">
                        {org.contactEmail}
                      </a>
                    ) : (
                      "Not specified"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{org.phone || "Not specified"}</dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>
                    {org.website ? (
                      <a
                        href={
                          org.website.startsWith("http")
                            ? org.website
                            : `https://${org.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-link"
                      >
                        {org.website}
                      </a>
                    ) : (
                      "Not specified"
                    )}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <article className="admin-user-card" style={{ marginTop: "1rem" }}>
            <div className="admin-section-heading" style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>System properties</h3>
            </div>
            <dl className="reference-meta-list">
              <div>
                <dt>Organization ID</dt>
                <dd className="admin-record-code">{org.id}</dd>
              </div>
              <div>
                <dt>System record</dt>
                <dd>
                  <span className={`status-badge ${org.isSystem ? 'status-badge-published' : ''}`}>
                    {org.isSystem ? "Yes" : "No"}
                  </span>
                </dd>
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
        <p>Organization membership updated.</p>
      </section>
    );
  }

  return null;
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

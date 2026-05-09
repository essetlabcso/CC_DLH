import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminProgramDetail } from "@/lib/admin/programs-cohorts";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import Link from "next/link";
import { notFound } from "next/navigation";

type AdminProgramDetailPageProps = {
  params: Promise<{
    programId: string;
  }>;
};

export default async function AdminProgramDetailPage({
  params,
}: AdminProgramDetailPageProps) {
  const { programId } = await params;
  const program = await getAdminProgramDetail(programId);

  if (!program) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Programs & Cohorts" title={program.name}>
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>{program.name}</h2>
            <p>
              Review this program, its participating organizations, linked
              cohorts, and course grouping counts.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link
              className="workspace-link secondary"
              href="/admin/programs-cohorts"
            >
              Back to Programs & Cohorts
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-safety-title">
          <div className="admin-section-heading">
            <h2 id="program-safety-title">Read-only detail</h2>
            <p>
              This page does not manage assignments, enrollment, learner
              records, or raw proof.
            </p>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-summary-title">
          <div className="admin-section-heading">
            <h2 id="program-summary-title">Program summary</h2>
            <p>Current safe grouping counts for this program.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Organizations linked to this program"
              label="Participant Organizations"
              value={program.totals.participantOrganizations}
            />
            <MetricCard
              detail="Participant organizations currently active"
              label="Active Organizations"
              value={program.totals.activeParticipantOrganizations}
            />
            <MetricCard
              detail="Cohorts linked to this program"
              label="Cohorts"
              value={program.totals.cohorts}
            />
            <MetricCard
              detail="Cohorts currently active"
              label="Active Cohorts"
              value={program.totals.activeCohorts}
            />
            <MetricCard
              detail="Course links across this program's cohorts"
              label="Linked Courses"
              value={program.totals.linkedCourses}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-profile-title">
          <div className="admin-section-heading">
            <h2 id="program-profile-title">Program profile</h2>
            <p>Status, dates, owner organization, and description.</p>
          </div>
          <article className="admin-user-card">
            <div className="reference-card-heading">
              <div>
                <h3>{program.name}</h3>
                <p className="admin-record-code">
                  {program.code || "No code"} · {program.slug}
                </p>
              </div>
              <span className={`status-badge ${getStatusTone(program.status)}`}>
                {getAdminStatusLabel(program.status)}
              </span>
            </div>
            <dl className="reference-meta-list">
              <div>
                <dt>Date range</dt>
                <dd>{formatDateRange(program.startsAt, program.endsAt)}</dd>
              </div>
              <div>
                <dt>Owner organization</dt>
                <dd>
                  {program.ownerOrganization ? (
                    <Link
                      href={`/admin/organizations/${program.ownerOrganization.id}`}
                    >
                      {program.ownerOrganization.name}
                    </Link>
                  ) : (
                    "Not linked"
                  )}
                </dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{program.description || "No description recorded."}</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="admin-section" aria-labelledby="program-orgs-title">
          <div className="admin-section-heading">
            <h2 id="program-orgs-title">Participant organizations</h2>
            <p>Organizations linked to this program through existing records.</p>
          </div>
          {program.participantOrganizations.length > 0 ? (
            <div className="admin-user-list">
              {program.participantOrganizations.map((organization) => (
                <article className="admin-user-card" key={organization.id}>
                  <div className="reference-card-heading">
                    <div>
                      <h3>
                        <Link href={`/admin/organizations/${organization.id}`}>
                          {organization.name}
                        </Link>
                      </h3>
                      <p className="admin-record-code">
                        Joined {formatDate(organization.joinedAt)}
                      </p>
                    </div>
                    <span
                      className={`status-badge ${getStatusTone(
                        organization.status,
                      )}`}
                    >
                      {getAdminStatusLabel(organization.status)}
                    </span>
                  </div>
                  <dl className="reference-meta-list">
                    <div>
                      <dt>Ended</dt>
                      <dd>{formatDate(organization.endedAt)}</dd>
                    </div>
                    <div>
                      <dt>Notes</dt>
                      <dd>{organization.notes || "No notes recorded."}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <EmptyPanel
              label="No participants"
              message="No participant organizations are linked to this program."
            />
          )}
        </section>

        <section className="admin-section" aria-labelledby="program-cohorts-title">
          <div className="admin-section-heading">
            <h2 id="program-cohorts-title">Linked cohorts</h2>
            <p>Cohorts grouped under this program.</p>
          </div>
          {program.cohorts.length > 0 ? (
            <div className="admin-user-list">
              {program.cohorts.map((cohort) => (
                <article className="admin-user-card" key={cohort.id}>
                  <div className="reference-card-heading">
                    <div>
                      <h3>
                        <Link href={`/admin/programs-cohorts/cohorts/${cohort.id}`}>
                          {cohort.name}
                        </Link>
                      </h3>
                      <p className="admin-record-code">
                        {cohort.organizationName || "No organization linked"}
                      </p>
                    </div>
                    <span className={`status-badge ${getStatusTone(cohort.status)}`}>
                      {getAdminStatusLabel(cohort.status)}
                    </span>
                  </div>
                  <dl className="reference-meta-list">
                    <div>
                      <dt>Date range</dt>
                      <dd>{formatDateRange(cohort.startsAt, cohort.endsAt)}</dd>
                    </div>
                    <div>
                      <dt>Linked courses</dt>
                      <dd>{cohort.linkedCourseCount}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <EmptyPanel
              label="No cohorts"
              message="No cohorts are linked to this program."
            />
          )}
        </section>
      </div>
    </WorkspaceShell>
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

function EmptyPanel({ label, message }: { label: string; message: string }) {
  return (
    <section className="admin-empty-panel">
      <span className="status-badge status-badge-blocked">{label}</span>
      <h2>{label}</h2>
      <p>{message}</p>
    </section>
  );
}

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString() : "Not recorded";
}

function formatDateRange(startsAt: Date | null, endsAt: Date | null) {
  if (!startsAt && !endsAt) {
    return "No dates recorded";
  }

  return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
}

function getStatusTone(status: string) {
  if (status === "ACTIVE") {
    return "status-badge-published";
  }

  if (status === "DRAFT" || status === "PAUSED") {
    return "status-badge-blocked";
  }

  return "status-badge-ready";
}

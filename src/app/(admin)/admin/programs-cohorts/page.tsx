import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminProgramsCohortsOverview,
  type AdminCohortSummary,
  type AdminProgramSummary,
} from "@/lib/admin/programs-cohorts";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import Link from "next/link";

export default async function AdminProgramsCohortsPage() {
  const overview = await getAdminProgramsCohortsOverview();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Programs & Cohorts">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Programs & Cohorts</h2>
            <p>
              Review how programs, cohorts, organizations, and courses are
              grouped.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-safety-title">
          <div className="admin-section-heading">
            <h2 id="program-safety-title">Read-only overview</h2>
            <p>
              This overview does not manage assignments, enrollment, learner
              records, or raw proof.
            </p>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-summary-title">
          <div className="admin-section-heading">
            <h2 id="program-summary-title">Grouping summary</h2>
            <p>Current program and cohort records available to Admins.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="All program records"
              label="Programs"
              value={overview.totals.programs}
            />
            <MetricCard
              detail="Programs currently active"
              label="Active Programs"
              value={overview.totals.activePrograms}
            />
            <MetricCard
              detail="All cohort groups"
              label="Cohorts"
              value={overview.totals.cohorts}
            />
            <MetricCard
              detail="Course links across cohorts"
              label="Linked Courses"
              value={overview.totals.linkedCourses}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="programs-title">
          <div className="admin-section-heading">
            <h2 id="programs-title">Programs</h2>
            <p>
              Program records show the owner organization, participating
              organizations, cohort count, status, and date range.
            </p>
          </div>
          {overview.programs.length > 0 ? (
            <div className="admin-user-list">
              {overview.programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No programs
              </span>
              <h2>No programs found</h2>
              <p>Programs will appear here after records are added.</p>
            </section>
          )}
        </section>

        <section className="admin-section" aria-labelledby="cohorts-title">
          <div className="admin-section-heading">
            <h2 id="cohorts-title">Cohorts</h2>
            <p>
              Cohort records show linked program, linked organization, course
              count, status, and date range.
            </p>
          </div>
          {overview.cohorts.length > 0 ? (
            <div className="admin-user-list">
              {overview.cohorts.map((cohort) => (
                <CohortCard cohort={cohort} key={cohort.id} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No cohorts
              </span>
              <h2>No cohorts found</h2>
              <p>Cohorts will appear here after records are added.</p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function ProgramCard({ program }: { program: AdminProgramSummary }) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{program.name}</h3>
          <p className="admin-record-code">{program.code || "No code"}</p>
        </div>
        <span className={`status-badge ${getStatusTone(program.status)}`}>
          {getAdminStatusLabel(program.status)}
        </span>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Owner organization</dt>
          <dd>{program.ownerOrganizationName || "Not linked"}</dd>
        </div>
        <div>
          <dt>Participant organizations</dt>
          <dd>{program.participantOrganizationCount}</dd>
        </div>
        <div>
          <dt>Cohorts</dt>
          <dd>{program.cohortCount}</dd>
        </div>
        <div>
          <dt>Date range</dt>
          <dd>{formatDateRange(program.startsAt, program.endsAt)}</dd>
        </div>
      </dl>

      <div className="admin-card-actions">
        <Link
          className="workspace-link secondary"
          href={`/admin/programs-cohorts/programs/${program.id}`}
        >
          View program
        </Link>
      </div>
    </article>
  );
}

function CohortCard({ cohort }: { cohort: AdminCohortSummary }) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{cohort.name}</h3>
          <p className="admin-record-code">
            {cohort.programName || "No program linked"}
          </p>
        </div>
        <span className={`status-badge ${getStatusTone(cohort.status)}`}>
          {getAdminStatusLabel(cohort.status)}
        </span>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Linked program</dt>
          <dd>{cohort.programName || "Not linked"}</dd>
        </div>
        <div>
          <dt>Linked organization</dt>
          <dd>{cohort.organizationName || "Not linked"}</dd>
        </div>
        <div>
          <dt>Linked courses</dt>
          <dd>{cohort.linkedCourseCount}</dd>
        </div>
        <div>
          <dt>Date range</dt>
          <dd>{formatDateRange(cohort.startsAt, cohort.endsAt)}</dd>
        </div>
      </dl>

      <div className="admin-card-actions">
        <Link
          className="workspace-link secondary"
          href={`/admin/programs-cohorts/cohorts/${cohort.id}`}
        >
          View cohort
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

function formatDateRange(startsAt: Date | null, endsAt: Date | null) {
  if (!startsAt && !endsAt) {
    return "No dates recorded";
  }

  const start = startsAt ? startsAt.toLocaleDateString() : "No start date";
  const end = endsAt ? endsAt.toLocaleDateString() : "No end date";

  return `${start} - ${end}`;
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

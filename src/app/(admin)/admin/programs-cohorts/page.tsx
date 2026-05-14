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
    <WorkspaceShell eyebrow="Admin Control Center" title="CSOs, Programs & Cohorts">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Programs & Cohorts</h2>
            <p>
              Review how programs, optional cohorts, CSOs, participants, and
              courses are grouped for the admin MVP.
            </p>
            <p>
              Cohorts are optional. Courses can also be assigned directly
              through projects or open/self-paced access.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin/organizations">
              CSOs
            </Link>
            <Link className="workspace-link secondary" href="/admin/participant-access">
              Participants
            </Link>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-safety-title">
          <div className="admin-section-heading">
            <h2 id="program-safety-title">Read-only program and cohort overview</h2>
            <p>
              Program and cohort records remain read-only here in the current
              admin MVP. Participant assignments are handled in Participant
              Access. This overview does not expose raw proof, sensitive learner
              data, or private CSO documents.
            </p>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="program-nav-title">
          <div className="admin-section-heading">
            <h2 id="program-nav-title">CSO structure quick links</h2>
            <p>
              Move between the four MVP structure areas without implying that
              every learner or course must belong to a cohort.
            </p>
          </div>
          <div className="admin-card-grid">
            <QuickLinkCard
              detail="Registered CSO/organization profiles and safe rollups."
              href="/admin/organizations#registered-csos"
              label="CSOs"
            />
            <QuickLinkCard
              detail="Read-only program records and participating CSOs."
              href="#programs"
              label="Programs"
            />
            <QuickLinkCard
              detail="Optional delivery groups linked to programs where needed."
              href="#cohorts"
              label="Cohorts"
            />
            <QuickLinkCard
              detail="Course, program, cohort, and invitation access records."
              href="/admin/participant-access"
              label="Participants"
            />
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

        <section className="admin-section" aria-labelledby="programs-title" id="programs">
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

        <section className="admin-section" aria-labelledby="cohorts-title" id="cohorts">
          <div className="admin-section-heading">
            <h2 id="cohorts-title">Cohorts</h2>
            <p>
              Cohort records show linked program, linked organization, course
              count, status, and date range. Cohorts are optional and are not
              required for every course or participant.
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

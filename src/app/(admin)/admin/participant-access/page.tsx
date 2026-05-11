import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminParticipantAccessOverview,
  parseParticipantAccessFilters,
  type AdminCohortParticipantRow,
  type AdminEnrollmentRow,
  type AdminInvitationRow,
  type AdminParticipantAccessFilterOptions,
  type AdminParticipantAccessFilters,
  type AdminProgramParticipantRow,
} from "@/lib/admin/participant-access";
import { formatAdminLabel } from "@/lib/admin/role-labels";
import { LearnerParticipantStatus } from "@prisma/client";
import Link from "next/link";

import { AssignmentPanels } from "./AssignmentPanels";
import { ParticipantStatusControl } from "./ParticipantStatusControl";

type AdminParticipantAccessPageProps = {
  searchParams?: Promise<{
    organizationId?: string;
    programId?: string;
    cohortId?: string;
    courseId?: string;
    enrollmentStatus?: string;
    search?: string;
  }>;
};

const enrollmentStatusOptions = [
  "INVITED",
  "ASSIGNED",
  "ENROLLED",
  "STARTED",
  "COMPLETED",
  "WITHDRAWN",
  "EXPIRED",
  "CANCELLED",
  "SUSPENDED",
];

export default async function AdminParticipantAccessPage({
  searchParams,
}: AdminParticipantAccessPageProps) {
  const params = await searchParams;
  const filters = parseParticipantAccessFilters(params ?? {});
  const overview = await getAdminParticipantAccessOverview(filters);
  const selectedChips = buildSelectedChips(filters, overview.filterOptions);
  const hasSelectedFilters = selectedChips.length > 0;

  return (
    <WorkspaceShell
      eyebrow="Admin Control Center"
      title="Participant Access"
    >
      <div className="admin-dashboard">
        <section
          className="admin-hero"
          aria-labelledby="participant-access-title"
        >
          <div>
            <h2 id="participant-access-title">
              Participant Access Overview
            </h2>
            <p>
              View learner access records across invitations, enrollments,
              program participants, and cohort participants. Assign learners
              directly to courses, programs, or cohorts.
            </p>
          </div>
          <div className="admin-hero-actions">
            <span className="status-badge status-badge-published">
              Overview and assignment
            </span>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="participant-safety-title"
        >
          <div className="admin-section-heading">
            <h2 id="participant-safety-title">Data safety boundaries</h2>
            <p>
              This overview does not display raw invitation tokens, token hashes,
              raw proof text, final test answers, internal metadata, or internal
              reasons. Learner emails are shown for identification only.
            </p>
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="participant-filter-title"
        >
          <div className="admin-section-heading">
            <h2 id="participant-filter-title">Filter access records</h2>
            <p>
              Narrow results by organization, program, cohort, course, enrollment
              status, or learner name and email.
            </p>
          </div>
          <form
            action="/admin/participant-access"
            className="reference-filter-panel"
          >
            <div className="diagnosis-filter-grid">
              <SelectField
                label="Organization"
                name="organizationId"
                options={overview.filterOptions.organizations.map((org) => ({
                  label: org.name,
                  value: org.id,
                }))}
                value={filters.organizationId}
              />
              <SelectField
                label="Program"
                name="programId"
                options={overview.filterOptions.programs.map((prog) => ({
                  label: prog.code
                    ? `${prog.name} (${prog.code})`
                    : prog.name,
                  value: prog.id,
                }))}
                value={filters.programId}
              />
              <SelectField
                label="Cohort"
                name="cohortId"
                options={overview.filterOptions.cohorts.map((coh) => ({
                  label: coh.name,
                  value: coh.id,
                }))}
                value={filters.cohortId}
              />
              <SelectField
                label="Course"
                name="courseId"
                options={overview.filterOptions.courses.map((course) => ({
                  label: course.title,
                  value: course.id,
                }))}
                value={filters.courseId}
              />
              <SelectField
                label="Enrollment status"
                name="enrollmentStatus"
                options={enrollmentStatusOptions.map((status) => ({
                  label: formatAdminLabel(status),
                  value: status,
                }))}
                value={filters.enrollmentStatus}
              />
              <label>
                <span>Search learner</span>
                <input
                  className="reference-search-input"
                  defaultValue={filters.search ?? ""}
                  name="search"
                  placeholder="Name or email"
                  type="text"
                />
              </label>
            </div>
            <div className="reference-filter-row compact">
              <button className="workspace-button" type="submit">
                Apply filters
              </button>
              <Link
                className="workspace-link secondary"
                href="/admin/participant-access"
              >
                Clear
              </Link>
            </div>
          </form>

          {hasSelectedFilters ? (
            <div className="reference-badge-row" style={{ marginTop: "1rem" }}>
              {selectedChips.map((chip) => (
                <span
                  className="status-badge status-badge-ready"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section
          className="admin-section"
          aria-labelledby="participant-totals-title"
        >
          <div className="admin-section-heading">
            <h2 id="participant-totals-title">Access summary</h2>
            <p>
              Aggregate counts of access records matching the current filters.
            </p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Course enrollment records"
              label="Enrollments"
              value={overview.totals.enrollments}
            />
            <MetricCard
              detail="Learner invitation records"
              label="Invitations"
              value={overview.totals.invitations}
            />
            <MetricCard
              detail="Program participant records"
              label="Program Participants"
              value={overview.totals.programParticipants}
            />
            <MetricCard
              detail="Cohort participant records"
              label="Cohort Participants"
              value={overview.totals.cohortParticipants}
            />
          </div>
        </section>

        <AssignmentPanels
          organizationOptions={overview.filterOptions.organizations.map(
            (org) => ({ label: org.name, value: org.id }),
          )}
          courseOptions={overview.filterOptions.courses.map((course) => ({
            label: course.title,
            value: course.id,
          }))}
          programOptions={overview.filterOptions.programs.map((prog) => ({
            label: prog.code
              ? `${prog.name} (${prog.code})`
              : prog.name,
            value: prog.id,
          }))}
          cohortOptions={overview.filterOptions.cohorts.map((coh) => ({
            label: coh.name,
            value: coh.id,
          }))}
        />

        <EnrollmentTable
          enrollments={overview.enrollments}
          hasFilters={hasSelectedFilters}
          total={overview.totals.enrollments}
        />
        <InvitationTable
          hasFilters={hasSelectedFilters}
          invitations={overview.invitations}
          total={overview.totals.invitations}
        />
        <ProgramParticipantTable
          hasFilters={hasSelectedFilters}
          participants={overview.programParticipants}
          total={overview.totals.programParticipants}
        />
        <CohortParticipantTable
          hasFilters={hasSelectedFilters}
          participants={overview.cohortParticipants}
          total={overview.totals.cohortParticipants}
        />
      </div>
    </WorkspaceShell>
  );
}

// ---------------------------------------------------------------------------
// Table sections
// ---------------------------------------------------------------------------

function EnrollmentTable({
  enrollments,
  hasFilters,
  total,
}: {
  enrollments: AdminEnrollmentRow[];
  hasFilters: boolean;
  total: number;
}) {
  return (
    <section
      className="admin-section"
      aria-labelledby="enrollment-table-title"
    >
      <div className="admin-section-heading">
        <h2 id="enrollment-table-title">
          Enrollments{total > enrollments.length ? ` (showing ${enrollments.length} of ${total})` : ""}
        </h2>
        <p>
          Course enrollment records with learner, organization, course, source,
          status, and key dates. Most recent first, capped at 100 rows.
        </p>
      </div>
      <div className="admin-table-container">
        {enrollments.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Course</th>
                <th>Version</th>
                <th>Source</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Started</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((row) => (
                <tr key={row.id}>
                  <td>{row.learnerName}</td>
                  <td>{row.learnerEmail}</td>
                  <td>{row.organizationName}</td>
                  <td>{row.courseTitle}</td>
                  <td>
                    v{row.versionNumber}{" "}
                    <span className={`status-badge ${getVersionStatusTone(row.versionStatus)}`}>
                      {formatAdminLabel(row.versionStatus)}
                    </span>
                  </td>
                  <td>{formatAdminLabel(row.source)}</td>
                  <td>
                    <span className={`status-badge ${getAccessStatusTone(row.status)}`}>
                      {formatAdminLabel(row.status)}
                    </span>
                  </td>
                  <td>{formatDate(row.enrolledAt)}</td>
                  <td>{formatDate(row.startedAt)}</td>
                  <td>{formatDate(row.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">
            {hasFilters
              ? "No enrollment records match the selected filters."
              : "No enrollment records found."}
          </p>
        )}
      </div>
    </section>
  );
}

function InvitationTable({
  invitations,
  hasFilters,
  total,
}: {
  invitations: AdminInvitationRow[];
  hasFilters: boolean;
  total: number;
}) {
  return (
    <section
      className="admin-section"
      aria-labelledby="invitation-table-title"
    >
      <div className="admin-section-heading">
        <h2 id="invitation-table-title">
          Invitations{total > invitations.length ? ` (showing ${invitations.length} of ${total})` : ""}
        </h2>
        <p>
          Learner invitation records with scope, status, and dates. No raw
          tokens or token hashes are displayed. Most recent first, capped at 50
          rows.
        </p>
      </div>
      <div className="admin-table-container">
        {invitations.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Organization</th>
                <th>Program</th>
                <th>Cohort</th>
                <th>Course</th>
                <th>Version</th>
                <th>Status</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Accepted</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((row) => (
                <tr key={row.id}>
                  <td>{row.email}</td>
                  <td>{row.organizationName}</td>
                  <td>{row.programName ?? "—"}</td>
                  <td>{row.cohortName ?? "—"}</td>
                  <td>{row.courseTitle ?? "—"}</td>
                  <td>{row.versionLabel ?? "—"}</td>
                  <td>
                    <span className={`status-badge ${getInvitationStatusTone(row.status)}`}>
                      {formatAdminLabel(row.status)}
                    </span>
                  </td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>{formatDate(row.expiresAt)}</td>
                  <td>{formatDate(row.acceptedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">
            {hasFilters
              ? "No invitation records match the selected filters."
              : "No invitation records found."}
          </p>
        )}
      </div>
    </section>
  );
}

function ProgramParticipantTable({
  participants,
  hasFilters,
  total,
}: {
  participants: AdminProgramParticipantRow[];
  hasFilters: boolean;
  total: number;
}) {
  return (
    <section
      className="admin-section"
      aria-labelledby="program-participant-table-title"
    >
      <div className="admin-section-heading">
        <h2 id="program-participant-table-title">
          Program Participants{total > participants.length ? ` (showing ${participants.length} of ${total})` : ""}
        </h2>
        <p>
          Program participant records with learner, organization, status, and
          dates. Most recent first, capped at 50 rows.
        </p>
      </div>
      <div className="admin-table-container">
        {participants.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Program</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Ended</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((row) => (
                <tr key={row.id}>
                  <td>{row.learnerName}</td>
                  <td>{row.learnerEmail}</td>
                  <td>{row.organizationName}</td>
                  <td>{row.programName}</td>
                  <td>
                    <span className={`status-badge ${getAccessStatusTone(row.status)}`}>
                      {formatAdminLabel(row.status)}
                    </span>
                  </td>
                  <td>{formatDate(row.joinedAt)}</td>
                  <td>{formatDate(row.endedAt)}</td>
                  <td>
                    <ParticipantStatusControl
                      participantId={row.id}
                      currentStatus={row.status as LearnerParticipantStatus}
                      type="PROGRAM"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">
            {hasFilters
              ? "No program participant records match the selected filters."
              : "No program participant records found."}
          </p>
        )}
      </div>
    </section>
  );
}

function CohortParticipantTable({
  participants,
  hasFilters,
  total,
}: {
  participants: AdminCohortParticipantRow[];
  hasFilters: boolean;
  total: number;
}) {
  return (
    <section
      className="admin-section"
      aria-labelledby="cohort-participant-table-title"
    >
      <div className="admin-section-heading">
        <h2 id="cohort-participant-table-title">
          Cohort Participants{total > participants.length ? ` (showing ${participants.length} of ${total})` : ""}
        </h2>
        <p>
          Cohort participant records with learner, organization, program link,
          status, and dates. Most recent first, capped at 50 rows.
        </p>
      </div>
      <div className="admin-table-container">
        {participants.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Cohort</th>
                <th>Program</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Ended</th>
                <th>Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((row) => (
                <tr key={row.id}>
                  <td>{row.learnerName}</td>
                  <td>{row.learnerEmail}</td>
                  <td>{row.organizationName}</td>
                  <td>{row.cohortName}</td>
                  <td>{row.programName ?? "—"}</td>
                  <td>
                    <span className={`status-badge ${getAccessStatusTone(row.status)}`}>
                      {formatAdminLabel(row.status)}
                    </span>
                  </td>
                  <td>{formatDate(row.joinedAt)}</td>
                  <td>{formatDate(row.endedAt)}</td>
                  <td>{formatDate(row.dueAt)}</td>
                  <td>
                    <ParticipantStatusControl
                      participantId={row.id}
                      currentStatus={row.status as LearnerParticipantStatus}
                      type="COHORT"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">
            {hasFilters
              ? "No cohort participant records match the selected filters."
              : "No cohort participant records found."}
          </p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared UI helpers
// ---------------------------------------------------------------------------

function SelectField({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <select
        className="reference-search-input"
        defaultValue={value ?? ""}
        name={name}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getAccessStatusTone(status: string) {
  const upper = status.toUpperCase();
  if (upper === "ACTIVE" || upper === "ENROLLED" || upper === "STARTED" || upper === "COMPLETED") {
    return "status-badge-published";
  }
  if (upper === "SUSPENDED" || upper === "CANCELLED" || upper === "REVOKED" || upper === "WITHDRAWN" || upper === "EXPIRED") {
    return "status-badge-blocked";
  }
  return "status-badge-ready";
}

function getInvitationStatusTone(status: string) {
  const upper = status.toUpperCase();
  if (upper === "ACCEPTED") return "status-badge-published";
  if (upper === "CANCELLED" || upper === "REVOKED" || upper === "EXPIRED") {
    return "status-badge-blocked";
  }
  return "status-badge-ready";
}

function getVersionStatusTone(status: string) {
  const upper = status.toUpperCase();
  if (upper === "PUBLISHED") return "status-badge-published";
  if (upper === "DRAFT" || upper === "ARCHIVED" || upper === "REPLACED") {
    return "status-badge-blocked";
  }
  return "status-badge-ready";
}

function buildSelectedChips(
  filters: AdminParticipantAccessFilters,
  options: AdminParticipantAccessFilterOptions,
) {
  const chips = [
    chipForOption(
      "Organization",
      filters.organizationId,
      options.organizations.map((o) => ({ label: o.name, value: o.id })),
    ),
    chipForOption(
      "Program",
      filters.programId,
      options.programs.map((p) => ({
        label: p.code ? `${p.name} (${p.code})` : p.name,
        value: p.id,
      })),
    ),
    chipForOption(
      "Cohort",
      filters.cohortId,
      options.cohorts.map((c) => ({ label: c.name, value: c.id })),
    ),
    chipForOption(
      "Course",
      filters.courseId,
      options.courses.map((c) => ({ label: c.title, value: c.id })),
    ),
    filters.enrollmentStatus
      ? `Enrollment status: ${formatAdminLabel(filters.enrollmentStatus)}`
      : null,
    filters.search ? `Search: ${filters.search}` : null,
  ];
  return chips.filter((chip): chip is string => Boolean(chip));
}

function chipForOption(
  label: string,
  value: string | undefined,
  options: { label: string; value: string }[],
) {
  if (!value) return null;
  const option = options.find((o) => o.value === value);
  return `${label}: ${option?.label ?? value}`;
}

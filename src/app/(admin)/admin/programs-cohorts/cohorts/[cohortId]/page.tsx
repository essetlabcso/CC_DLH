import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminCohortDetail,
  type AdminCohortDetail,
} from "@/lib/admin/programs-cohorts";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";
import Link from "next/link";
import { notFound } from "next/navigation";

type AdminCohortDetailPageProps = {
  params: Promise<{
    cohortId: string;
  }>;
};

export default async function AdminCohortDetailPage({
  params,
}: AdminCohortDetailPageProps) {
  const { cohortId } = await params;
  const cohort = await getAdminCohortDetail(cohortId);

  if (!cohort) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Programs & Cohorts" title={cohort.name}>
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>{cohort.name}</h2>
            <p>
              Review this cohort, its linked program, organization, and course
              grouping records.
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

        <section className="admin-section" aria-labelledby="cohort-safety-title">
          <div className="admin-section-heading">
            <h2 id="cohort-safety-title">Read-only detail</h2>
            <p>
              This page does not manage scheduling automation, assignments,
              enrollment, learner records, or raw proof.
            </p>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="cohort-summary-title">
          <div className="admin-section-heading">
            <h2 id="cohort-summary-title">Cohort summary</h2>
            <p>Current safe course grouping counts for this cohort.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Course records linked to this cohort"
              label="Linked Courses"
              value={cohort.totals.linkedCourses}
            />
            <MetricCard
              detail="Required course links"
              label="Required Courses"
              value={cohort.totals.requiredCourses}
            />
            <MetricCard
              detail="Optional course links"
              label="Optional Courses"
              value={cohort.totals.optionalCourses}
            />
            <MetricCard
              detail="Linked course versions currently published"
              label="Published Versions"
              value={cohort.totals.publishedCourseVersions}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="cohort-profile-title">
          <div className="admin-section-heading">
            <h2 id="cohort-profile-title">Cohort profile</h2>
            <p>Status, dates, linked program, organization, and delivery notes.</p>
          </div>
          <article className="admin-user-card">
            <div className="reference-card-heading">
              <div>
                <h3>{cohort.name}</h3>
                <p className="admin-record-code">{cohort.slug}</p>
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
                <dt>Linked program</dt>
                <dd>
                  {cohort.program ? (
                    <Link
                      href={`/admin/programs-cohorts/programs/${cohort.program.id}`}
                    >
                      {cohort.program.name}
                      {cohort.program.code ? ` · ${cohort.program.code}` : ""}
                    </Link>
                  ) : (
                    "Not linked"
                  )}
                </dd>
              </div>
              <div>
                <dt>Linked organization</dt>
                <dd>
                  {cohort.organization ? (
                    <Link href={`/admin/organizations/${cohort.organization.id}`}>
                      {cohort.organization.name}
                    </Link>
                  ) : (
                    "Not linked"
                  )}
                </dd>
              </div>
              <div>
                <dt>Delivery notes</dt>
                <dd>{cohort.deliveryNotes || "No delivery notes recorded."}</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="admin-section" aria-labelledby="cohort-courses-title">
          <div className="admin-section-heading">
            <h2 id="cohort-courses-title">Linked courses</h2>
            <p>Course and version records linked to this cohort.</p>
          </div>
          {cohort.linkedCourses.length > 0 ? (
            <div className="admin-user-list">
              {cohort.linkedCourses.map((course) => (
                <CourseLinkCard course={course} key={course.id} />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No linked courses
              </span>
              <h2>No linked courses</h2>
              <p>No course records are linked to this cohort.</p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function CourseLinkCard({
  course,
}: {
  course: AdminCohortDetail["linkedCourses"][number];
}) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{course.courseTitle}</h3>
          <p className="admin-record-code">{course.courseOrganizationName}</p>
        </div>
        <span className={`status-badge ${getStatusTone(course.versionStatus)}`}>
          {getAdminStatusLabel(course.versionStatus)}
        </span>
      </div>
      <dl className="reference-meta-list">
        <div>
          <dt>Version</dt>
          <dd>Version {course.versionNumber}</dd>
        </div>
        <div>
          <dt>Required</dt>
          <dd>{course.required ? "Required" : "Optional"}</dd>
        </div>
        <div>
          <dt>Start date</dt>
          <dd>{formatDate(course.startsAt)}</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{formatDate(course.dueAt)}</dd>
        </div>
        <div>
          <dt>Display order</dt>
          <dd>{course.displayOrder}</dd>
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
  if (status === "ACTIVE" || status === "PUBLISHED") {
    return "status-badge-published";
  }

  if (status === "DRAFT" || status === "PAUSED" || status === "RETURNED") {
    return "status-badge-blocked";
  }

  return "status-badge-ready";
}

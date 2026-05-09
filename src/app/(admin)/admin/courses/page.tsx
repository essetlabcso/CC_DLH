import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  adminCourseAttentionFilters,
  getAdminCourseWorkflowOverview,
} from "@/lib/admin/course-workflow-overview";

type AdminCoursesPageProps = {
  searchParams?: Promise<{
    attention?: string;
    search?: string;
    status?: string;
  }>;
};

const attentionLabels: Record<string, string> = {
  "approved-publish": "Approved for publish",
  "blocked-publish": "Blocked publish readiness",
  "needs-review": "Needs review",
  published: "Published",
  returned: "Returned",
};

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const params = await searchParams;
  const search = params?.search?.trim() ?? "";
  const status = params?.status ?? "";
  const attention = params?.attention ?? "";
  const overview = await getAdminCourseWorkflowOverview({
    attention,
    search,
    status,
  });

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Courses & Workflow">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="admin-courses-title">
          <div>
            <h2 id="admin-courses-title">Course workflow oversight</h2>
            <p>
              See which courses need attention and why. This view uses existing
              workflow, review, and publish records without adding an Admin gate
              override.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/review/queue">
              Review queue
            </Link>
            <Link className="workspace-link secondary" href="/review/publishing">
              Publish queue
            </Link>
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="course-summary-title">
          <div className="admin-section-heading">
            <h2 id="course-summary-title">Workflow attention summary</h2>
            <p>Current course-version records across the platform.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Course versions in this oversight view"
              label="Total"
              value={overview.summary.total}
            />
            <MetricCard
              detail="Waiting in the Review queue"
              label="Needs review"
              value={overview.summary.submitted}
            />
            <MetricCard
              detail="Approved and waiting for publish checks"
              label="Approved"
              value={overview.summary.approved}
            />
            <MetricCard
              detail="Approved courses with publish blockers"
              label="Publish blocked"
              value={overview.summary.blockedPublish}
            />
            <MetricCard
              detail="Returned to creators for changes"
              label="Returned"
              value={overview.summary.returned}
            />
            <MetricCard
              detail="Released for learner access"
              label="Published"
              value={overview.summary.published}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="course-filter-title">
          <div className="admin-section-heading">
            <h2 id="course-filter-title">Find courses</h2>
            <p>Filter by title, organization, creator, capacity area, status, or attention type.</p>
          </div>
          <form action="/admin/courses" className="reference-filter-panel">
            <label className="workspace-label" htmlFor="course-search">
              Search
            </label>
            <div className="reference-filter-row">
              <input
                className="reference-search-input"
                defaultValue={search}
                id="course-search"
                name="search"
                placeholder="Search courses, organizations, creators, or capacity areas"
                type="search"
              />
              <select
                aria-label="Course status"
                className="reference-search-input"
                defaultValue={status}
                name="status"
              >
                <option value="">All statuses</option>
                {Object.values(CourseVersionStatus).map((value) => (
                  <option key={value} value={value}>
                    {formatEnumLabel(value)}
                  </option>
                ))}
              </select>
              <select
                aria-label="Attention filter"
                className="reference-search-input"
                defaultValue={attention}
                name="attention"
              >
                <option value="">All attention types</option>
                {adminCourseAttentionFilters.map((value) => (
                  <option key={value} value={value}>
                    {attentionLabels[value]}
                  </option>
                ))}
              </select>
              <button className="workspace-button" type="submit">
                Apply
              </button>
              <Link className="workspace-link secondary" href="/admin/courses">
                Clear
              </Link>
            </div>
          </form>
        </section>

        <section className="admin-section" aria-labelledby="course-list-title">
          <div className="admin-section-heading">
            <h2 id="course-list-title">Course workflow list</h2>
            <p>{overview.items.length} course versions shown.</p>
          </div>

          {overview.items.length > 0 ? (
            <div className="course-list course-list-spacious">
              {overview.items.map((item) => (
                <article className="course-row studio-course-card" key={item.id}>
                  <div className="studio-course-card-main">
                    <div className="studio-course-card-heading">
                      <div>
                        <p className="block-kicker">
                          {item.versionType} · Version {item.versionNumber}
                        </p>
                        <h2>{item.title}</h2>
                        <p>
                          {item.organizationName} · Owner {item.ownerName} ·
                          Creator {item.creatorName}
                        </p>
                      </div>
                      <span className={`status-badge ${item.statusTone}`}>
                        {item.statusLabel}
                      </span>
                    </div>

                    <div className="context-grid review-queue-card-grid">
                      <article>
                        <strong>Program / Cohort</strong>
                        <span>{item.programCohortLabel}</span>
                      </article>
                      <article>
                        <strong>Capacity area</strong>
                        <span>{item.capacityArea}</span>
                      </article>
                      <article>
                        <strong>Source anchor</strong>
                        <span>{item.sourceAnchorSummary}</span>
                      </article>
                      <article>
                        <strong>Workflow stage</strong>
                        <span>{item.workflowStage}</span>
                      </article>
                      <article>
                        <strong>Reviewer</strong>
                        <span>{item.reviewerName}</span>
                      </article>
                      <article>
                        <strong>Workflow progress</strong>
                        <span>{item.workflowProgressLabel}</span>
                      </article>
                      <article>
                        <strong>Publish readiness</strong>
                        <span>{item.publishReadinessLabel}</span>
                      </article>
                    </div>

                    <div
                      className="studio-workflow-strip"
                      aria-label={`Workflow steps for ${item.title}`}
                    >
                      {item.workflowStepLabels.map((label) => (
                        <span className="workflow-chip" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="next-step-panel">
                      <strong>{item.nextActionLabel}</strong>
                      <p>{item.nextActionNote}</p>
                      <p>{item.publishReadinessSummary}</p>
                    </div>

                    {item.blockers.length > 0 ? (
                      <div className="blocker-panel">
                        <strong>Blockers</strong>
                        <ul>
                          {item.blockers.map((blocker) => (
                            <li key={blocker}>{blocker}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {item.warnings.length > 0 ? (
                      <div className="next-step-panel">
                        <strong>Warnings or attention notes</strong>
                        <ul>
                          {item.warnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="reference-action-row">
                    {item.nextActionHref ? (
                      <Link className="workspace-link secondary" href={item.nextActionHref}>
                        {item.nextActionLabel}
                      </Link>
                    ) : (
                      <span className="status-badge">No direct action</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">No results</span>
              <h2>No courses match this filter</h2>
              <p>
                Clear the filters or choose a different status to review course
                workflow records.
              </p>
            </div>
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

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

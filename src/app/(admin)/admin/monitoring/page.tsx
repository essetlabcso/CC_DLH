import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminMonitoringFilterOptions,
  getAdminMonitoringCounts,
  getCapacityAreaAchievementSummaries,
  getRecentVerifiedAchievements,
  parseAdminMonitoringFilters,
  type AdminMonitoringFilterOptions,
  type AdminMonitoringFilters,
} from "@/lib/admin/monitoring";
import Link from "next/link";

type AdminMonitoringPageProps = {
  searchParams?: Promise<{
    capacityArea?: string;
    cohortId?: string;
    courseId?: string;
    organizationId?: string;
    programId?: string;
  }>;
};

export default async function AdminMonitoringPage({
  searchParams,
}: AdminMonitoringPageProps) {
  const params = await searchParams;
  const filters = parseAdminMonitoringFilters(params ?? {});
  const [counts, capacitySummaries, recentAchievements, filterOptions] =
    await Promise.all([
      getAdminMonitoringCounts(filters),
      getCapacityAreaAchievementSummaries(filters),
      getRecentVerifiedAchievements(filters),
      getAdminMonitoringFilterOptions(),
    ]);
  const selectedFilters = buildSelectedFilterChips(filters, filterOptions);
  const hasSelectedFilters = selectedFilters.length > 0;

  const monitoringCards = [
    {
      label: "Learners With Progress",
      value: counts.totalLearners,
      detail: "Learners who have started at least one matching course lesson.",
    },
    {
      label: "Course Certificates",
      value: counts.totalCertificates,
      detail: "Automated course certificates issued for 80%+ final test scores.",
    },
    {
      label: "Proof Submissions Under Review",
      value: counts.proofsUnderReview,
      detail: "Private practical proof submissions awaiting human verifier review.",
    },
    {
      label: "Verified Achievements",
      value: counts.totalVerifiedAchievements,
      detail: "Human-reviewed achievement records based on accepted practical proof.",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Monitoring & Capacity Evidence">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="monitoring-overview-title">
          <div>
            <h2 id="monitoring-overview-title">Platform Evidence Overview</h2>
            <p>
              Aggregate insights into learning progress, certificates, private
              proof review, and verified achievements. Raw proof, sensitive
              learner details, and internal review notes are omitted.
            </p>
          </div>
          <span className="status-badge status-badge-published">Read-only overview</span>
        </section>

        <section className="admin-section" aria-labelledby="monitoring-filter-title">
          <div className="admin-section-heading">
            <h2 id="monitoring-filter-title">Filter aggregate evidence</h2>
            <p>Filters update aggregate counts only. No learner rosters, raw proof, or individual progress records are shown.</p>
          </div>
          <form action="/admin/monitoring" className="reference-filter-panel">
            <div className="diagnosis-filter-grid">
              <SelectField
                label="Program"
                name="programId"
                options={filterOptions.programs.map((program) => ({
                  label: program.code
                    ? `${program.name} (${program.code})`
                    : program.name,
                  value: program.id,
                }))}
                value={filters.programId}
              />
              <SelectField
                label="Cohort"
                name="cohortId"
                options={filterOptions.cohorts.map((cohort) => ({
                  label: cohort.programName
                    ? `${cohort.name} · ${cohort.programName}`
                    : cohort.name,
                  value: cohort.id,
                }))}
                value={filters.cohortId}
              />
              <SelectField
                label="Organization"
                name="organizationId"
                options={filterOptions.organizations.map((organization) => ({
                  label: organization.name,
                  value: organization.id,
                }))}
                value={filters.organizationId}
              />
              <SelectField
                label="Course"
                name="courseId"
                options={filterOptions.courses.map((course) => ({
                  label: `${course.title} · ${course.organizationName}`,
                  value: course.id,
                }))}
                value={filters.courseId}
              />
              <SelectField
                label="Capacity area"
                name="capacityArea"
                options={filterOptions.capacityAreas.map((capacityArea) => ({
                  label: capacityArea,
                  value: capacityArea,
                }))}
                value={filters.capacityArea}
              />
            </div>
            <div className="reference-filter-row compact">
              <button className="workspace-button" type="submit">
                Apply filters
              </button>
              <Link className="workspace-link secondary" href="/admin/monitoring">
                Clear
              </Link>
            </div>
          </form>

          {hasSelectedFilters ? (
            <div className="reference-badge-row" style={{ marginTop: "1rem" }}>
              {selectedFilters.map((filter) => (
                <span className="status-badge status-badge-ready" key={filter}>
                  {filter}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="admin-section" aria-labelledby="evidence-boundaries-title">
          <div className="admin-section-heading">
            <h2 id="evidence-boundaries-title">Evidence boundaries</h2>
            <p>
              Monitoring distinguishes course completion evidence from applied
              evidence. These summaries support platform learning and safe
              follow-up; they do not certify full organizational transformation
              or donor readiness.
            </p>
          </div>
          <div className="admin-card-grid">
            <article className="admin-readiness-card">
              <div>
                <h3>Certificate</h3>
                <span className="status-badge status-badge-ready">Final test</span>
              </div>
              <p>Issued automatically when a learner scores 80% or above on the final test.</p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Practical proof</h3>
                <span className="status-badge">Private by default</span>
              </div>
              <p>Optional applied evidence reviewed separately from course certification.</p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Verified achievement</h3>
                <span className="status-badge status-badge-published">Human reviewed</span>
              </div>
              <p>Recognition based on accepted proof, shown only as safe summary data here.</p>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="platform-metrics-title">
          <div className="admin-section-heading">
            <h2 id="platform-metrics-title">Platform Metrics</h2>
            <p>Aggregate counts across courses and organizations. No raw proof is shown.</p>
          </div>
          <div className="admin-metrics-grid">
            {monitoringCards.map((card) => (
              <article className="admin-stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="capacity-focus-title">
          <div className="admin-section-heading">
            <h2 id="capacity-focus-title">Capacity Area Focus</h2>
            <p>
              Verified achievements grouped by DEC capacity area. These are
              evidence signals, not proof of full organizational transformation.
            </p>
          </div>
          <div className="admin-card-grid">
            {capacitySummaries.length > 0 ? (
              capacitySummaries.map((summary) => (
                <article className="admin-readiness-card" key={summary.capacityArea}>
                  <div>
                    <h3>{summary.capacityArea}</h3>
                    <span className="status-badge status-badge-ready">
                      {summary.count} verified
                    </span>
                  </div>
                  <p>Safe achievement summaries mapped to this capacity area.</p>
                </article>
              ))
            ) : (
              <p className="empty-state">
                {hasSelectedFilters
                  ? "No aggregate achievement evidence matches the selected filters."
                  : "No verified achievements have been recorded yet. Certificates may still exist separately through the final test pathway."}
              </p>
            )}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="recent-achievements-title">
          <div className="admin-section-heading">
            <h2 id="recent-achievements-title">Recent Verified Achievements</h2>
            <p>
              The latest human-reviewed achievement summaries across the
              platform. This table intentionally excludes raw proof content.
            </p>
          </div>
          
          <div className="admin-table-container">
            {recentAchievements.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Capacity Area</th>
                    <th>Achievement</th>
                    <th>Course</th>
                    <th>Organization</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAchievements.map((achievement) => (
                    <tr key={achievement.id}>
                      <td>
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(achievement.issuedAt)}
                      </td>
                      <td>{achievement.capacityArea}</td>
                      <td>{achievement.title}</td>
                      <td>{achievement.courseTitle}</td>
                      <td>{achievement.organizationName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">
                {hasSelectedFilters
                  ? "No recent verified achievement summaries match the selected filters."
                  : "No verified achievements have been recorded yet. Monitoring will show only safe summary evidence when human verification exists."}
              </p>
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

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

function buildSelectedFilterChips(
  filters: AdminMonitoringFilters,
  options: AdminMonitoringFilterOptions,
) {
  const chips = [
    labelForSelectedOption(
      "Program",
      filters.programId,
      options.programs.map((program) => ({
        label: program.code ? `${program.name} (${program.code})` : program.name,
        value: program.id,
      })),
    ),
    labelForSelectedOption(
      "Cohort",
      filters.cohortId,
      options.cohorts.map((cohort) => ({
        label: cohort.programName
          ? `${cohort.name} · ${cohort.programName}`
          : cohort.name,
        value: cohort.id,
      })),
    ),
    labelForSelectedOption(
      "Organization",
      filters.organizationId,
      options.organizations.map((organization) => ({
        label: organization.name,
        value: organization.id,
      })),
    ),
    labelForSelectedOption(
      "Course",
      filters.courseId,
      options.courses.map((course) => ({
        label: course.title,
        value: course.id,
      })),
    ),
    filters.capacityArea ? `Capacity area: ${filters.capacityArea}` : null,
  ];

  return chips.filter((chip): chip is string => Boolean(chip));
}

function labelForSelectedOption(
  label: string,
  value: string | undefined,
  options: { label: string; value: string }[],
) {
  if (!value) {
    return null;
  }

  const option = options.find((item) => item.value === value);

  return `${label}: ${option?.label ?? value}`;
}

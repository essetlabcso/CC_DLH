import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { requestPublishedCourseRevisionAction } from "@/app/(review)/review/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  buildMonitoringCapacityGroups,
  buildMonitoringCourseSummary,
  filterMonitoringCourseSignals,
  getMonitoringFilterOptions,
  getMonitoringStatusLabel,
} from "@/lib/review/monitoring";
import {
  countPublishableLessons,
  formatPublishedDate,
} from "@/lib/review/publishing";
import { revisionRequestFieldLabels } from "@/lib/review/revisions";

type MonitoringPageProps = {
  searchParams?: Promise<{
    error?: string;
    fields?: string;
    capacityArea?: string;
    linkedStandard?: string;
  }>;
};

export default async function MonitoringPage({
  searchParams,
}: MonitoringPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/monitoring");
  const publishedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      capacityMap: true,
      monitoringRecord: true,
      modules: {
        include: {
          lessons: true,
        },
      },
      lessonProgress: true,
      finalTestAttempts: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  const summaries = publishedVersions.map((version) => {
    const totalLessons = countPublishableLessons(version);

    return {
      version,
      capacityArea: version.capacityMap?.capacityArea,
      linkedStandard: version.capacityMap?.linkedStandard,
      summary: buildMonitoringCourseSummary({
        totalLessons,
        progressRecords: version.lessonProgress,
        finalTestAttempts: version.finalTestAttempts,
      }),
    };
  });
  const filterOptions = getMonitoringFilterOptions(summaries);
  const activeFilters = {
    capacityArea: resolvedSearchParams?.capacityArea?.trim() || "",
    linkedStandard: resolvedSearchParams?.linkedStandard?.trim() || "",
  };
  const filteredSummaries = filterMonitoringCourseSignals(
    summaries,
    activeFilters,
  );
  const capacityGroups = buildMonitoringCapacityGroups(filteredSummaries);
  const snapshotHref = buildSnapshotHref(activeFilters);
  const totalLearnerStarts = summaries.reduce(
    (total, item) => total + item.summary.learnersStarted,
    0,
  );
  const totalCompletions = summaries.reduce(
    (total, item) => total + item.summary.learnersCompleted,
    0,
  );
  const averageCompletionRate =
    summaries.length === 0
      ? 0
      : Math.round(
          summaries.reduce(
            (total, item) => total + item.summary.completionRate,
            0,
          ) / summaries.length,
        );
  const totalFinalTestAttempts = summaries.reduce(
    (total, item) => total + item.summary.finalTestAttempts,
    0,
  );
  const totalFinalTestLearners = summaries.reduce(
    (total, item) => total + item.summary.finalTestLearners,
    0,
  );
  const totalFinalTestPasses = summaries.reduce(
    (total, item) => total + item.summary.finalTestPasses,
    0,
  );
  const finalTestPassRate =
    totalFinalTestLearners === 0
      ? 0
      : Math.round((totalFinalTestPasses / totalFinalTestLearners) * 100);

  return (
    <WorkspaceShell eyebrow="Monitoring" title="Published course signals">
      <p>
        Monitor course-level learning signals after publication. This view uses
        aggregate progress only and does not expose individual learner records.
      </p>

      {resolvedSearchParams?.error === "revision" ? (
        <p className="workspace-error">
          Add a revision reason before requesting revision:{" "}
          {getMissingFieldLabels(
            resolvedSearchParams.fields,
            revisionRequestFieldLabels,
          ).join(", ")}
          .
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="monitoring-summary">
        <h2 id="monitoring-summary">Monitoring summary</h2>
        <div className="metric-grid">
          <article>
            <strong>{publishedVersions.length}</strong>
            <span>Published courses</span>
          </article>
          <article>
            <strong>{totalLearnerStarts}</strong>
            <span>Learners started</span>
          </article>
          <article>
            <strong>{totalCompletions}</strong>
            <span>Learners completed</span>
          </article>
          <article>
            <strong>{averageCompletionRate}%</strong>
            <span>{getMonitoringStatusLabel(totalLearnerStarts, averageCompletionRate)}</span>
          </article>
          <article>
            <strong>{totalFinalTestAttempts}</strong>
            <span>Final test attempts</span>
          </article>
          <article>
            <strong>{finalTestPassRate}%</strong>
            <span>Final test pass rate</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="monitoring-filters-title">
        <h2 id="monitoring-filters-title">Monitoring filters</h2>
        <form action="/review/monitoring" className="filter-form" method="get">
          <label>
            <span>Capacity area</span>
            <select name="capacityArea" defaultValue={activeFilters.capacityArea}>
              <option value="">All capacity areas</option>
              {filterOptions.capacityAreas.map((capacityArea) => (
                <option key={capacityArea} value={capacityArea}>
                  {capacityArea}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Linked standard</span>
            <select
              name="linkedStandard"
              defaultValue={activeFilters.linkedStandard}
            >
              <option value="">All linked standards</option>
              {filterOptions.linkedStandards.map((linkedStandard) => (
                <option key={linkedStandard} value={linkedStandard}>
                  {linkedStandard}
                </option>
              ))}
            </select>
          </label>
          <button className="workspace-button" type="submit">
            Apply filters
          </button>
          <Link className="workspace-link" href="/review/monitoring">
            Clear filters
          </Link>
          <Link className="workspace-link" href={snapshotHref}>
            Open snapshot
          </Link>
        </form>
      </section>

      <section className="studio-section" aria-labelledby="capacity-groups-title">
        <h2 id="capacity-groups-title">Capacity indicator groups</h2>
        {capacityGroups.length > 0 ? (
          <div className="course-list course-list-spacious">
            {capacityGroups.map((group) => (
              <article className="course-row" key={group.key}>
                <div>
                  <h3>{group.capacityArea}</h3>
                  <p>{group.linkedStandard}</p>
                  <div className="context-grid monitoring-grid">
                    <article>
                      <strong>{group.courseCount}</strong>
                      <span>Courses</span>
                    </article>
                    <article>
                      <strong>{group.learnersStarted}</strong>
                      <span>Learners started</span>
                    </article>
                    <article>
                      <strong>{group.averageCompletionRate}%</strong>
                      <span>Average completion rate</span>
                    </article>
                    <article>
                      <strong>{group.finalTestPassRate}%</strong>
                      <span>Final test pass rate</span>
                    </article>
                    <article>
                      <strong>{group.finalTestAverageScore}%</strong>
                      <span>Average final test score</span>
                    </article>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No grouped signals match the current filters</h3>
            <p>
              Adjust the filters or publish courses with capacity mapping to
              see grouped monitoring signals.
            </p>
          </div>
        )}
      </section>

      <section className="studio-section" aria-labelledby="courses-title">
        <h2 id="courses-title">Course signals</h2>
        {filteredSummaries.length > 0 ? (
          <div className="course-list course-list-spacious">
            {filteredSummaries.map(({ version, summary }) => (
              <article className="course-row" key={version.id}>
                <div>
                  <h3>{version.course.title}</h3>
                  <p>
                    Published {formatPublishedDate(version.publishedAt)} ·{" "}
                    {summary.totalLessons}{" "}
                    {summary.totalLessons === 1 ? "lesson" : "lessons"} ·{" "}
                    {summary.statusLabel}
                  </p>
                  <div className="context-grid monitoring-grid">
                    <article>
                      <strong>{summary.learnersStarted}</strong>
                      <span>Learners started</span>
                    </article>
                    <article>
                      <strong>{summary.learnersCompleted}</strong>
                      <span>Learners completed</span>
                    </article>
                    <article>
                      <strong>{summary.lessonStarts}</strong>
                      <span>Lesson starts</span>
                    </article>
                    <article>
                      <strong>{summary.completionRate}%</strong>
                      <span>Lesson completion rate</span>
                    </article>
                    <article>
                      <strong>{summary.finalTestAttempts}</strong>
                      <span>Final test attempts</span>
                    </article>
                    <article>
                      <strong>{summary.finalTestPassRate}%</strong>
                      <span>Final test pass rate</span>
                    </article>
                    <article>
                      <strong>{summary.finalTestAverageScore}%</strong>
                      <span>Average final test score</span>
                    </article>
                  </div>
                  {version.capacityMap?.monitoringRelevance ? (
                    <p>
                      Monitoring focus: {version.capacityMap.monitoringRelevance}
                    </p>
                  ) : null}
                  {version.monitoringRecord?.improvementNotes ? (
                    <p>{version.monitoringRecord.improvementNotes}</p>
                  ) : null}
                  <form
                    action={requestPublishedCourseRevisionAction.bind(
                      null,
                      version.course.id,
                      version.id,
                    )}
                    className="checklist-form"
                  >
                    <h4>Request revision</h4>
                    <label>
                      <span>Reason for revision</span>
                      <textarea name="revisionReason" />
                    </label>
                    <button className="workspace-button" type="submit">
                      Request revision
                    </button>
                  </form>
                </div>
                <Link href="/courses">View discovery</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No published courses yet</h3>
            <p>
              Monitoring signals will appear here after courses are published
              and learners begin lessons.
            </p>
          </div>
        )}
      </section>

      <nav className="workspace-nav" aria-label="Monitoring actions">
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
        <Link className="workspace-link" href="/review/publishing">
          Publishing
        </Link>
        <Link className="workspace-link" href="/review/revisions">
          Revision queue
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

function buildSnapshotHref(filters: {
  capacityArea: string;
  linkedStandard: string;
}) {
  const params = new URLSearchParams();

  if (filters.capacityArea) {
    params.set("capacityArea", filters.capacityArea);
  }

  if (filters.linkedStandard) {
    params.set("linkedStandard", filters.linkedStandard);
  }

  const query = params.toString();

  return query
    ? `/review/monitoring/snapshot?${query}`
    : "/review/monitoring/snapshot";
}

function getMissingFieldLabels(
  fields: string | undefined,
  labels: Record<string, string>,
) {
  if (!fields) {
    return [];
  }

  return fields
    .split(",")
    .filter(Boolean)
    .map((field) => labels[field] || field);
}

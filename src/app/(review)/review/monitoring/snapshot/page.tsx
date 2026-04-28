import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { PrintPageButton } from "@/components/workspace/PrintPageButton";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  buildMonitoringEvidenceSnapshot,
  buildMonitoringCourseSummary,
  filterMonitoringCourseSignals,
} from "@/lib/review/monitoring";
import {
  countPublishableLessons,
  formatPublishedDate,
} from "@/lib/review/publishing";

type MonitoringSnapshotPageProps = {
  searchParams?: Promise<{
    capacityArea?: string;
    linkedStandard?: string;
  }>;
};

export default async function MonitoringSnapshotPage({
  searchParams,
}: MonitoringSnapshotPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/monitoring/snapshot");
  const activeFilters = {
    capacityArea: resolvedSearchParams?.capacityArea?.trim() || "",
    linkedStandard: resolvedSearchParams?.linkedStandard?.trim() || "",
  };
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
  const courseSignals = publishedVersions.map((version) => {
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
  const filteredCourseSignals = filterMonitoringCourseSignals(
    courseSignals,
    activeFilters,
  );
  const snapshot = buildMonitoringEvidenceSnapshot(filteredCourseSignals);
  const generatedAt = new Date();

  return (
    <WorkspaceShell
      eyebrow="Monitoring Evidence"
      title="Monitoring evidence snapshot"
    >
      <p>
        Aggregate evidence for published DEC Learning Hub courses. This
        snapshot does not include individual learner records.
      </p>

      <nav className="workspace-nav print-hidden" aria-label="Snapshot actions">
        <PrintPageButton label="Print or save snapshot" />
        <Link className="workspace-link primary" href="/review/monitoring">
          Back to monitoring
        </Link>
      </nav>

      <section className="evidence-sheet" aria-labelledby="snapshot-title">
        <div className="evidence-header">
          <p className="public-kicker">DEC Learning Hub</p>
          <h2 id="snapshot-title">Monitoring Evidence Snapshot</h2>
          <p>Generated {formatSnapshotDate(generatedAt)}</p>
        </div>

        <section className="studio-section" aria-labelledby="filters-title">
          <h3 id="filters-title">Snapshot scope</h3>
          <div className="context-grid">
            <article>
              <strong>Capacity area</strong>
              <span>{activeFilters.capacityArea || "All capacity areas"}</span>
            </article>
            <article>
              <strong>Linked standard</strong>
              <span>{activeFilters.linkedStandard || "All linked standards"}</span>
            </article>
            <article>
              <strong>Evidence level</strong>
              <span>Aggregate course and capacity signals</span>
            </article>
            <article>
              <strong>Learner privacy</strong>
              <span>No individual learner records included</span>
            </article>
          </div>
        </section>

        <section className="studio-section" aria-labelledby="snapshot-summary">
          <h3 id="snapshot-summary">Aggregate signals</h3>
          <div className="metric-grid">
            <article>
              <strong>{snapshot.courseCount}</strong>
              <span>Courses</span>
            </article>
            <article>
              <strong>{snapshot.learnersStarted}</strong>
              <span>Learners started</span>
            </article>
            <article>
              <strong>{snapshot.learnersCompleted}</strong>
              <span>Learners completed</span>
            </article>
            <article>
              <strong>{snapshot.averageCompletionRate}%</strong>
              <span>Average completion rate</span>
            </article>
            <article>
              <strong>{snapshot.finalTestAttempts}</strong>
              <span>Final test attempts</span>
            </article>
            <article>
              <strong>{snapshot.finalTestPassRate}%</strong>
              <span>Final test pass rate</span>
            </article>
            <article>
              <strong>{snapshot.finalTestAverageScore}%</strong>
              <span>Average final test score</span>
            </article>
          </div>
        </section>

        <section className="studio-section" aria-labelledby="capacity-title">
          <h3 id="capacity-title">Capacity indicator signals</h3>
          {snapshot.capacityGroups.length > 0 ? (
            <div className="course-list course-list-spacious">
              {snapshot.capacityGroups.map((group) => (
                <article className="course-row" key={group.key}>
                  <div>
                    <h4>{group.capacityArea}</h4>
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
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h4>No monitoring signals in this scope</h4>
              <p>
                Publish courses and learner activity to populate this evidence
                snapshot.
              </p>
            </div>
          )}
        </section>

        <section className="studio-section" aria-labelledby="course-title">
          <h3 id="course-title">Course signals included</h3>
          {filteredCourseSignals.length > 0 ? (
            <div className="course-list course-list-spacious">
              {filteredCourseSignals.map(({ version, summary }) => (
                <article className="course-row" key={version.id}>
                  <div>
                    <h4>{version.course.title}</h4>
                    <p>
                      Published {formatPublishedDate(version.publishedAt)} ·{" "}
                      {summary.totalLessons}{" "}
                      {summary.totalLessons === 1 ? "lesson" : "lessons"}
                    </p>
                    <div className="context-grid monitoring-grid">
                      <article>
                        <strong>{summary.learnersStarted}</strong>
                        <span>Learners started</span>
                      </article>
                      <article>
                        <strong>{summary.completionRate}%</strong>
                        <span>Completion rate</span>
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
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </WorkspaceShell>
  );
}

function formatSnapshotDate(value: Date) {
  return value.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

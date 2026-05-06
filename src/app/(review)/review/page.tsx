import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { countReviewBlocks, formatSubmittedDate } from "@/lib/review/queue";

export default async function ReviewWorkspacePage() {
  const identity = await requireWorkspaceIdentity("/review");
  const submittedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.SUBMITTED,
      course:
        identity.session.role === "admin"
          ? {}
          : { organizationId: identity.user.organizationId },
    },
    include: {
      course: {
        include: {
          organization: true,
        },
      },
      createdBy: true,
      modules: {
        include: {
          lessons: {
            include: {
              blocks: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
  const approvedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.APPROVED,
      course:
        identity.session.role === "admin"
          ? {}
          : { organizationId: identity.user.organizationId },
    },
    include: {
      course: {
        include: {
          organization: true,
        },
      },
      modules: {
        include: {
          lessons: {
            include: {
              blocks: true,
            },
          },
        },
      },
    },
    orderBy: {
      approvedAt: "asc",
    },
  });
  const publishedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      course:
        identity.session.role === "admin"
          ? {}
          : { organizationId: identity.user.organizationId },
    },
    include: {
      course: {
        include: {
          organization: true,
        },
      },
      lessonProgress: true,
      finalTestAttempts: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  const revisionRequestCount = await prisma.courseRevisionRecord.count({
    where: {
      courseVersion: {
        status: CourseVersionStatus.PUBLISHED,
        course:
          identity.session.role === "admin"
            ? {}
            : { organizationId: identity.user.organizationId },
      },
    },
  });

  return (
    <WorkspaceShell eyebrow="Review Workspace" title="Review and publishing">
      <p>
        Review submitted DEC course versions, check learner readiness, and make
        return or approval decisions before the publishing handoff.
      </p>
      <div className="studio-actions" aria-label="Review actions">
        <Link className="workspace-link primary" href="/review/queue">
          Open review queue
        </Link>
        <Link className="workspace-link" href="/review/publishing">
          Open publishing
        </Link>
        <Link className="workspace-link" href="/review/proof">
          Open proof review
        </Link>
        <Link className="workspace-link" href="/review/achievements">
          Open achievement summary
        </Link>
        <Link className="workspace-link" href="/review/monitoring">
          Open monitoring
        </Link>
        <Link className="workspace-link" href="/review/revisions">
          Open revisions
        </Link>
      </div>

      <section className="studio-section" aria-labelledby="review-summary-title">
        <h2 id="review-summary-title">Queue summary</h2>
        <div className="metric-grid">
          <article>
            <strong>{submittedVersions.length}</strong>
            <span>Submitted courses</span>
          </article>
          <article>
            <strong>
              {submittedVersions.reduce(
                (total, version) => total + countReviewBlocks(version.modules),
                0,
              )}
            </strong>
            <span>Blocks awaiting review</span>
          </article>
          <article>
            <strong>{approvedVersions.length}</strong>
            <span>Approved for publishing</span>
          </article>
          <article>
            <strong>{publishedVersions.length}</strong>
            <span>Published courses</span>
          </article>
          <article>
            <strong>
              {publishedVersions.reduce(
                (total, version) =>
                  total +
                  new Set(
                    version.lessonProgress.map((progress) => progress.userId),
                  ).size,
                0,
              )}
            </strong>
            <span>Learners started</span>
          </article>
          <article>
            <strong>
              {publishedVersions.reduce(
                (total, version) => total + version.finalTestAttempts.length,
                0,
              )}
            </strong>
            <span>Final test attempts</span>
          </article>
          <article>
            <strong>{revisionRequestCount}</strong>
            <span>Revision requests</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="recent-review-title">
        <div className="section-heading-row">
          <h2 id="recent-review-title">Submitted courses</h2>
          <Link href="/review/queue">View all</Link>
        </div>
        {submittedVersions.length > 0 ? (
          <div className="course-list">
            {submittedVersions
              .filter((_, index) => index < 3)
              .map((version) => (
              <article className="course-row" key={version.id}>
                <div>
                  <h3>{version.course.title}</h3>
                  <p>
                    Version {version.versionNumber} · Submitted{" "}
                    {formatSubmittedDate(version.submittedAt)} · Creator{" "}
                    {version.createdBy.name}
                  </p>
                </div>
                <Link
                  href={`/review/courses/${version.course.id}/versions/${version.id}`}
                >
                  Open
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No submitted courses yet</h3>
            <p>
              Courses will appear here after creators complete Creator Review
              and submit them for formal review.
            </p>
          </div>
        )}
      </section>

      <section className="studio-section" aria-labelledby="publishing-title">
        <div className="section-heading-row">
          <h2 id="publishing-title">Approved for publishing</h2>
          <Link href="/review/publishing">View all</Link>
        </div>
        {approvedVersions.length > 0 ? (
          <div className="course-list">
            {approvedVersions
              .filter((_, index) => index < 3)
              .map((version) => (
                <article className="course-row" key={version.id}>
                  <div>
                    <h3>{version.course.title}</h3>
                    <p>
                      Version {version.versionNumber} ·{" "}
                      {countReviewBlocks(version.modules)} blocks ready for
                      learner publication
                    </p>
                  </div>
                  <Link href="/review/publishing">Publish</Link>
                </article>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No approved courses waiting</h3>
            <p>
              Approved courses will appear here before they become visible to
              learners.
            </p>
          </div>
        )}
      </section>

      <section className="studio-section" aria-labelledby="monitoring-title">
        <div className="section-heading-row">
          <h2 id="monitoring-title">Published course monitoring</h2>
          <Link href="/review/monitoring">View all</Link>
        </div>
        {publishedVersions.length > 0 ? (
          <div className="course-list">
            {publishedVersions
              .filter((_, index) => index < 3)
              .map((version) => (
                <article className="course-row" key={version.id}>
                  <div>
                    <h3>{version.course.title}</h3>
                    <p>
                      {new Set(
                        version.lessonProgress.map(
                          (progress) => progress.userId,
                        ),
                      ).size}{" "}
                      learners started ·{" "}
                      {
                        version.lessonProgress.filter(
                          (progress) => progress.completedAt,
                        ).length
                      }{" "}
                      completed lesson records
                      {version.finalTestAttempts.length > 0
                        ? ` · ${version.finalTestAttempts.length} final test attempts`
                        : ""}
                    </p>
                  </div>
                  <Link href="/review/monitoring">Monitor</Link>
                </article>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No published courses yet</h3>
            <p>
              Monitoring signals will appear after courses are published and
              learners begin lessons.
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}

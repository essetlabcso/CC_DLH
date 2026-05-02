import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { publishApprovedCourseAction } from "@/app/(review)/review/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  buildPublishReadiness,
  countPublishableLessons,
  formatPublishedDate,
  getPublishingVersionTypeLabel,
  getPublishingStatusLabel,
} from "@/lib/review/publishing";

type PublishingPageProps = {
  searchParams?: Promise<{
    published?: string;
    blocked?: string;
    version?: string;
  }>;
};

export default async function PublishingPage({
  searchParams,
}: PublishingPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/publishing");
  const approvedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.APPROVED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      createdBy: true,
      reviewRecord: {
        include: {
          reviewer: true,
        },
      },
      setup: true,
      practicalProofConfig: true,
      modules: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: {
      approvedAt: "asc",
    },
  });
  const recentlyPublished = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      modules: {
        include: {
          lessons: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
  });
  const canPublishApprovedVersions = identity.session.role === "admin";

  return (
    <WorkspaceShell eyebrow="Publishing" title="Approved courses">
      <p>
        Publish only course versions that have completed reviewer approval.
        Publishing makes the course visible in learner discovery.
      </p>
      <div
        className={
          canPublishApprovedVersions
            ? "role-banner role-banner-admin"
            : "role-banner role-banner-readonly"
        }
      >
        <strong>
          {canPublishApprovedVersions
            ? "You can publish approved courses."
            : "Approved courses must be published by a DEC Admin."}
        </strong>
        <span>
          {canPublishApprovedVersions
            ? "Publish actions appear only when all readiness checks pass."
            : "You can review readiness evidence here, but this view is read-only for reviewers."}
        </span>
      </div>

      {resolvedSearchParams?.published === "1" ? (
        <p className="workspace-note">
          Course published. Learners now see the current approved version in
          discovery and member learning.
        </p>
      ) : null}
      {resolvedSearchParams?.blocked === "1" ? (
        <p className="workspace-error">
          Publishing was blocked because readiness checks did not pass. Review
          the readiness evidence below before trying again.
        </p>
      ) : null}

      <section
        className="studio-section"
        aria-labelledby="approved-publishing-title"
      >
        <h2 id="approved-publishing-title">Ready to publish</h2>
        {approvedVersions.length > 0 ? (
          <div className="course-list course-list-spacious">
            {approvedVersions.map((version) => {
              const readiness = buildPublishReadiness(version);
              const readinessLabel = readiness.ready ? "Ready" : "Blocked";

              return (
                <article className="publishing-card" key={version.id}>
                  <div className="publishing-card-header">
                    <div>
                      <p className="block-kicker">
                        {getPublishingVersionTypeLabel(version)} · Version{" "}
                        {version.versionNumber}
                      </p>
                      <h3>{version.course.title}</h3>
                    </div>
                    <span
                      className={
                        readiness.ready
                          ? "status-badge status-badge-ready"
                          : "status-badge status-badge-blocked"
                      }
                    >
                      {readinessLabel}
                    </span>
                  </div>

                  <div className="publishing-card-body">
                    <p>{readiness.summary}</p>
                    <div className="publishing-meta">
                      <span>{getPublishingStatusLabel(version.status)}</span>
                      <span>Creator {version.createdBy.name}</span>
                      <span>
                        Reviewer{" "}
                        {version.reviewRecord?.reviewer?.name ||
                          "reviewer not recorded"}
                      </span>
                      <span>{countPublishableLessons(version)} lessons</span>
                    </div>
                    <p>Learner visibility: {readiness.learnerVisibilityDefault}</p>
                    {version.reviewRecord?.decisionNotes ? (
                      <p>{version.reviewRecord.decisionNotes}</p>
                    ) : null}
                    <div className="readiness-grid">
                      {readiness.checks.map((check) => (
                        <article
                          className={
                            check.ready
                              ? "readiness-check readiness-check-ready"
                              : "readiness-check readiness-check-blocked"
                          }
                          key={check.key}
                        >
                          <div className="readiness-check-heading">
                            <strong>{check.label}</strong>
                            <span
                              className={
                                check.ready
                                  ? "status-badge status-badge-ready"
                                  : "status-badge status-badge-blocked"
                              }
                            >
                              {check.ready ? "Ready" : "Blocked"}
                            </span>
                          </div>
                          <p>{check.detail}</p>
                        </article>
                      ))}
                    </div>
                    {readiness.blockers.length > 0 ? (
                      <div className="blocker-panel">
                        <strong>Publish blockers</strong>
                        <ul>
                          {readiness.blockers.map((blocker) => (
                            <li key={blocker.key}>{blocker.detail}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="publishing-card-actions">
                  {canPublishApprovedVersions && readiness.ready ? (
                    <form
                      action={publishApprovedCourseAction.bind(
                        null,
                        version.course.id,
                        version.id,
                      )}
                    >
                      <button
                        className="workspace-button"
                        type="submit"
                      >
                        Publish now
                      </button>
                    </form>
                  ) : canPublishApprovedVersions ? (
                    <p className="workspace-note">
                      Resolve blockers before publishing.
                    </p>
                  ) : (
                    <p className="workspace-note">
                      Approved courses must be published by a DEC Admin.
                    </p>
                  )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No approved courses waiting</h3>
            <p>
              Approved courses will appear here after reviewers complete the
              review decision step.
            </p>
          </div>
        )}
      </section>

      <section
        className="studio-section"
        aria-labelledby="published-courses-title"
      >
        <div className="section-heading-row">
          <h2 id="published-courses-title">Recently published</h2>
          <Link href="/courses">View learner discovery</Link>
        </div>
        {recentlyPublished.length > 0 ? (
          <div className="course-list">
            {recentlyPublished.map((version) => (
              <article className="course-row published-row" key={version.id}>
                <div>
                  <div className="published-heading">
                    <h3>{version.course.title}</h3>
                    <span className="status-badge status-badge-published">
                      Published
                    </span>
                  </div>
                  <p>
                    {getPublishingStatusLabel(version.status)} · Version{" "}
                    {version.versionNumber} · Published{" "}
                    {formatPublishedDate(version.publishedAt)} ·{" "}
                    {getPublishingVersionTypeLabel(version)} ·{" "}
                    {countPublishableLessons(version)} lessons
                  </p>
                </div>
                <Link href="/courses">Open discovery</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No published courses yet</h3>
            <p>Published courses will appear here after the publishing gate.</p>
          </div>
        )}
      </section>

      <nav className="workspace-nav" aria-label="Publishing actions">
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
        <Link className="workspace-link" href="/review/queue">
          Review queue
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

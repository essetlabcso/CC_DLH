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

  return (
    <WorkspaceShell eyebrow="Publishing" title="Approved courses">
      <p>
        Publish only course versions that have completed reviewer approval.
        Publishing makes the course visible in learner discovery.
      </p>

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

              return (
                <article className="course-row" key={version.id}>
                  <div>
                    <h3>{version.course.title}</h3>
                    <p>
                      {getPublishingStatusLabel(version.status)} ·{" "}
                      {getPublishingVersionTypeLabel(version)} · Version{" "}
                      {version.versionNumber} · Creator {version.createdBy.name} ·{" "}
                      Reviewer{" "}
                      {version.reviewRecord?.reviewer?.name ||
                        "reviewer not recorded"}{" "}
                      · {countPublishableLessons(version)} lessons
                    </p>
                    <p>{readiness.summary}</p>
                    <p>
                      Learner visibility: {readiness.learnerVisibilityDefault}
                    </p>
                    {version.reviewRecord?.decisionNotes ? (
                      <p>{version.reviewRecord.decisionNotes}</p>
                    ) : null}
                    <div className="context-grid">
                      {readiness.checks.map((check) => (
                        <article key={check.key}>
                          <strong>{check.label}</strong>
                          <span>{check.ready ? "Ready" : "Blocked"}</span>
                          <p>{check.detail}</p>
                        </article>
                      ))}
                    </div>
                    {readiness.blockers.length > 0 ? (
                      <div className="workspace-error">
                        <strong>Publish blockers</strong>
                        <ul>
                          {readiness.blockers.map((blocker) => (
                            <li key={blocker.key}>{blocker.detail}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  <form
                    action={publishApprovedCourseAction.bind(
                      null,
                      version.course.id,
                      version.id,
                    )}
                  >
                    <button
                      className="workspace-button"
                      disabled={!readiness.ready}
                      type="submit"
                    >
                      Publish now
                    </button>
                  </form>
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
              <article className="course-row" key={version.id}>
                <div>
                  <h3>{version.course.title}</h3>
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

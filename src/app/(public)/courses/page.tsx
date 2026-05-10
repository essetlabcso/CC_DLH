import Link from "next/link";

import { selfEnrollLearnerAction } from "@/app/(learner)/learn/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getCurrentIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  loadLearnerAccessDecision,
  type LearnerAccessLoaderPrisma,
} from "@/lib/learner/access-loader";
import {
  buildPublicCourseCta,
  buildPublicCatalogueCourseVersionWhere,
  filterPublicCatalogueVersions,
} from "@/lib/learner/self-enrollment";
import {
  countPublishableLessons,
  formatPublishedDate,
} from "@/lib/review/publishing";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const identity = await getCurrentIdentity();
  const learnerIdentity =
    identity?.session.role === "learner"
      ? {
          userId: identity.user.id,
          organizationId: identity.user.organizationId,
          roles: identity.user.roles,
        }
      : null;
  const candidateVersions = await prisma.courseVersion.findMany({
    where: buildPublicCatalogueCourseVersionWhere(),
    include: {
      course: {
        include: {
          organization: true,
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
      publishedAt: "desc",
    },
  });
  const publishedVersions = filterPublicCatalogueVersions(candidateVersions);
  const accessResults = new Map(
    (
      await Promise.all(
        publishedVersions.map(async (version) => {
          const access = await loadLearnerAccessDecision(
            prisma as unknown as LearnerAccessLoaderPrisma,
            {
              courseId: version.course.id,
              courseVersionId: version.id,
              identity: learnerIdentity,
            },
          );

          return access ? ([version.id, access.decision] as const) : null;
        }),
      )
    ).filter((result) => result !== null),
  );

  return (
    <WorkspaceShell eyebrow="Learner Courses" title="Explore courses">
      <p>
        Browse DEC learning areas for local and grassroots CSOs. Sign in to
        continue assigned learning and return to your course progress.
      </p>

      {publishedVersions.length > 0 ? (
        <section className="studio-section" aria-labelledby="courses-title">
          <h2 id="courses-title">Available courses</h2>
          <div className="course-list course-list-spacious">
            {publishedVersions.map((version) => {
              const decision = accessResults.get(version.id);
              const cta = decision
                ? buildPublicCourseCta({
                    courseId: version.course.id,
                    isSignedInLearner: Boolean(learnerIdentity),
                    decision,
                  })
                : null;

              return (
                <article className="course-row learner-dashboard-card" key={version.id}>
                  <div className="learner-dashboard-card-main">
                    <div className="studio-course-card-heading">
                      <div>
                        <h3>{version.course.title}</h3>
                        <p>
                          {version.setup?.summary ||
                            "A DEC-reviewed course for local CSO learning."}
                        </p>
                      </div>
                    </div>
                    <div className="context-grid" style={{ marginBottom: "1rem" }}>
                      <article>
                        <strong>Organization</strong>
                        <span>{version.course.organization.name}</span>
                      </article>
                      {version.setup?.capacityArea ? (
                        <article>
                          <strong>Capacity area</strong>
                          <span>{version.setup.capacityArea}</span>
                        </article>
                      ) : null}
                      {version.setup?.formatAndTime ? (
                        <article>
                          <strong>Format</strong>
                          <span>{version.setup.formatAndTime}</span>
                        </article>
                      ) : null}
                      {version.setup?.primaryLearnerGroup ? (
                        <article>
                          <strong>Target learners</strong>
                          <span>{version.setup.primaryLearnerGroup}</span>
                        </article>
                      ) : null}
                    </div>
                    <div className="studio-workflow-strip">
                      <span className="workflow-chip">
                        {countPublishableLessons(version)} lessons
                      </span>
                      <span className="workflow-chip">
                        Published {formatPublishedDate(version.publishedAt)}
                      </span>
                      <span className="workflow-chip workflow-chip-complete">
                        Score 80%+ on the final test to receive your course certificate
                      </span>
                    </div>
                  </div>
                  {cta?.kind === "SELF_ENROLL" ? (
                    <form action={selfEnrollLearnerAction.bind(null, version.course.id)}>
                      <button className="workspace-button" type="submit">
                        {cta.label}
                      </button>
                    </form>
                  ) : cta?.kind === "OPEN" || cta?.kind === "SIGN_IN" ? (
                    <Link className="workspace-link primary" href={cta.href}>
                      {cta.label}
                    </Link>
                  ) : (
                    <span className="status-badge status-badge-blocked">
                      {cta?.label ?? "Unavailable"}
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="studio-section empty-state" aria-label="Courses">
          <h2>Courses are being prepared</h2>
          <p>
            Published courses will appear here after DEC review and publishing
            are complete.
          </p>
        </section>
      )}

      <nav aria-label="Course discovery actions" className="workspace-nav">
        <Link className="workspace-link primary" href="/sign-in?next=/learn">
          Sign in to learning
        </Link>
        <Link className="workspace-link" href="/">
          Home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

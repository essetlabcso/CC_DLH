import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { buildCertificateEligibility } from "@/lib/learner/certificates";
import { formatLearnerCourseDuration } from "@/lib/learner/course-access";
import { getBestFinalTestAttempt } from "@/lib/learner/final-test";
import { buildLearnerProgressSummary } from "@/lib/learner/progress";

export default async function LearnerWorkspacePage() {
  const identity = await requireWorkspaceIdentity("/learn");
  const publishedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
    },
    include: {
      course: true,
      setup: true,
      modules: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              blocks: true,
            },
          },
        },
      },
      lessonProgress: {
        where: {
          userId: identity.user.id,
        },
      },
      finalTestAttempts: {
        where: {
          userId: identity.user.id,
        },
        orderBy: {
          submittedAt: "desc",
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Learner Workspace" title="My learning">
      <p>
        Continue assigned DEC learning, return to course progress, and access
        completed learning records as courses become available.
      </p>
      <nav className="workspace-nav" aria-label="Learner workspace actions">
        <Link className="workspace-link primary" href="/learn/certificates">
          My certificates
        </Link>
        <Link className="workspace-link" href="/courses">
          Explore courses
        </Link>
      </nav>

      <section className="studio-section" aria-labelledby="available-title">
        <h2 id="available-title">Available learning</h2>
        {publishedVersions.length > 0 ? (
          <div className="course-list course-list-spacious">
            {publishedVersions.map((version) => {
              const totalLessons = version.modules.reduce(
                (total, module) => total + module.lessons.length,
                0,
              );
              const completedLessons = version.lessonProgress.filter(
                (progress) => progress.completedAt,
              ).length;
              const progressSummary = buildLearnerProgressSummary(
                totalLessons,
                version.lessonProgress.length,
                completedLessons,
              );
              const bestFinalTestAttempt = getBestFinalTestAttempt(
                version.finalTestAttempts,
              );
              const certificateEligibility = buildCertificateEligibility({
                certificateIntent: version.setup?.certificateIntent,
                totalLessons,
                completedLessons,
                finalTestScorePercent: bestFinalTestAttempt?.scorePercent,
                finalTestPassed: bestFinalTestAttempt?.passed,
              });

              return (
                <article className="course-row" key={version.id}>
                  <div>
                    <h3>{version.course.title}</h3>
                    <p>
                      {version.setup?.summary ||
                        "A DEC-reviewed course for practical CSO learning."}
                    </p>
                    <p>
                      {formatLearnerCourseDuration(version.modules)} ·{" "}
                      {progressSummary.label} ·{" "}
                      {certificateEligibility.label}
                    </p>
                  </div>
                  <Link href={`/learn/courses/${version.course.id}`}>
                    Open course
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No courses available yet</h3>
            <p>
              Published courses assigned to your organization will appear here.
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}

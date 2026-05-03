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
  const courseSummaries = publishedVersions.map((version) => {
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

    return {
      version,
      totalLessons,
      completedLessons,
      progressSummary,
      certificateEligibility,
      bestFinalTestAttempt,
    };
  });
  const completedCourseCount = courseSummaries.filter(
    ({ progressSummary }) => progressSummary.label === "Complete",
  ).length;
  const certificateReadyCount = courseSummaries.filter(
    ({ certificateEligibility }) =>
      certificateEligibility.label.toLowerCase().includes("earned") ||
      certificateEligibility.label.toLowerCase().includes("eligible"),
  ).length;
  const inProgressCount = courseSummaries.filter(
    ({ completedLessons, totalLessons }) =>
      completedLessons > 0 && completedLessons < totalLessons,
  ).length;

  return (
    <WorkspaceShell eyebrow="Learner Workspace" title="My learning">
      <div className="learner-dashboard-hero">
        <div>
          <p>
            Continue assigned DEC learning, return to course progress, and
            access completed learning records as courses become available.
          </p>
          <div className="review-hero-status" aria-label="Learning summary">
            <span className="status-badge">
              {publishedVersions.length} available
            </span>
            <span className="status-badge status-badge-published">
              {inProgressCount} in progress
            </span>
            <span className="status-badge status-badge-ready">
              {completedCourseCount} complete
            </span>
            <span className="status-badge">
              {certificateReadyCount} certificate-ready
            </span>
          </div>
        </div>
        <div className="learner-course-next">
          <strong>Next learner move</strong>
          <span>
            Open a course, finish any remaining lessons, then complete the
            final test where a certificate is offered.
          </span>
        </div>
      </div>
      <nav className="workspace-nav" aria-label="Learner workspace actions">
        <Link className="workspace-link primary" href="/learn/certificates">
          My certificates
        </Link>
        <Link className="workspace-link" href="/courses">
          Explore courses
        </Link>
      </nav>

      <section className="studio-section" aria-labelledby="available-title">
        <div className="section-heading-row">
          <div>
            <h2 id="available-title">Available learning</h2>
            <p className="section-subcopy">
              Courses published for your organization and ready to open.
            </p>
          </div>
          <span className="status-badge">
            {publishedVersions.length} course
            {publishedVersions.length === 1 ? "" : "s"}
          </span>
        </div>
        {courseSummaries.length > 0 ? (
          <div className="course-list course-list-spacious">
            {courseSummaries.map(
              ({
                version,
                totalLessons,
                completedLessons,
                progressSummary,
                certificateEligibility,
                bestFinalTestAttempt,
              }) => {
              return (
                <article className="course-row learner-dashboard-card" key={version.id}>
                  <div className="learner-dashboard-card-main">
                    <div className="studio-course-card-heading">
                      <div>
                        <h3>{version.course.title}</h3>
                        <p>
                          {version.setup?.summary ||
                            "A DEC-reviewed course for practical CSO learning."}
                        </p>
                      </div>
                      <span
                        className={`status-badge ${getLearnerDashboardProgressClass(
                          progressSummary.label,
                        )}`}
                      >
                        {progressSummary.label}
                      </span>
                    </div>
                    <div className="studio-workflow-strip">
                      <span className="workflow-chip">
                        {formatLearnerCourseDuration(version.modules)}
                      </span>
                      <span className="workflow-chip workflow-chip-active">
                        {completedLessons}/{totalLessons} lessons
                      </span>
                      <span
                        className={`workflow-chip ${getLearnerDashboardCertificateClass(
                          certificateEligibility.label,
                        )}`}
                      >
                        {certificateEligibility.label}
                      </span>
                      <span className="workflow-chip">
                        {bestFinalTestAttempt
                          ? `Best score ${bestFinalTestAttempt.scorePercent}%`
                          : "Final test not started"}
                      </span>
                    </div>
                  </div>
                  <Link
                    className="workspace-link primary"
                    href={`/learn/courses/${version.course.id}`}
                  >
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

function getLearnerDashboardProgressClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("complete")) {
    return "status-badge-ready";
  }

  if (normalized.includes("not") || normalized.includes("0")) {
    return "status-badge-blocked";
  }

  return "status-badge-published";
}

function getLearnerDashboardCertificateClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("earned") || normalized.includes("eligible")) {
    return "workflow-chip-complete";
  }

  if (normalized.includes("not") || normalized.includes("locked")) {
    return "workflow-chip-locked";
  }

  return "workflow-chip-active";
}

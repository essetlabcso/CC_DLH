import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { buildCertificateEligibility } from "@/lib/learner/certificates";
import { formatLearnerCourseDuration } from "@/lib/learner/course-access";
import { getBestFinalTestAttempt } from "@/lib/learner/final-test";
import { buildLearnerProgressSummary } from "@/lib/learner/progress";
import { activeLearnerEnrollmentStatuses } from "@/lib/learner/self-enrollment";
import { loadPermissionIdentity } from "@/lib/auth/permission-identity";
import { canViewSafeOrganizationSummary } from "@/lib/permissions/scoped-access";

export default async function LearnerWorkspacePage() {
  const identity = await requireWorkspaceIdentity("/learn");
  const permissionIdentity = await loadPermissionIdentity(prisma, identity);
  const showOversight =
    permissionIdentity &&
    canViewSafeOrganizationSummary(
      permissionIdentity,
      identity.user.organizationId,
    );
  const publishedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      OR: [
        {
          course: {
            organizationId: identity.user.organizationId,
            status: "ACTIVE",
          },
        },
        {
          course: {
            status: "ACTIVE",
          },
          learnerEnrollments: {
            some: {
              userId: identity.user.id,
              status: {
                in: [...activeLearnerEnrollmentStatuses],
              },
            },
          },
        },
      ],
    },
    include: {
      course: {
        include: {
          organization: true,
        },
      },
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
      practicalProofConfig: true,
      practicalProofSubmissions: {
        where: {
          userId: identity.user.id,
        },
        orderBy: {
          submittedAt: "desc",
        },
      },
      verifiedAchievements: {
        where: {
          userId: identity.user.id,
        },
        orderBy: {
          issuedAt: "desc",
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
      proofConfig: version.practicalProofConfig,
      proofSubmission: version.practicalProofSubmissions[0],
      verifiedAchievement: version.verifiedAchievements[0],
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
        {showOversight && (
          <Link
            className="workspace-link"
            href={`/oversight/organizations/${identity.user.organizationId}`}
          >
            Organizational oversight
          </Link>
        )}
      </nav>

      <section className="studio-section" aria-labelledby="available-title">
        <div className="section-heading-row">
          <div>
            <h2 id="available-title">Available learning</h2>
            <p className="section-subcopy">
              Courses assigned to your organization or explicitly enrolled.
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
                proofConfig,
                proofSubmission,
                verifiedAchievement,
              }) => {
                let proofStatusLabel = "Proof not enabled";
                let proofClass = "workflow-chip-locked";

                if (proofConfig?.enabled) {
                  if (verifiedAchievement) {
                    proofStatusLabel = "Verified achievement issued";
                    proofClass = "workflow-chip-complete";
                  } else if (!proofSubmission) {
                    proofStatusLabel = "Proof not submitted";
                    proofClass = "workflow-chip-active";
                  } else {
                    const status = proofSubmission.status;
                    if (status === "SUBMITTED") {
                      proofStatusLabel = "Proof submitted privately";
                      proofClass = "workflow-chip-active";
                    } else if (status === "REVISION_REQUESTED") {
                      proofStatusLabel = "Revision requested privately";
                      proofClass = "workflow-chip-locked";
                    } else if (status === "ACCEPTED") {
                      proofStatusLabel = "Proof accepted";
                      proofClass = "workflow-chip-complete";
                    } else if (status === "REJECTED") {
                      proofStatusLabel = "Proof rejected";
                      proofClass = "workflow-chip-locked";
                    }
                  }
                }

                let primaryActionLabel = "Open course";
                let primaryActionHref = `/learn/courses/${version.course.id}`;

                if (completedLessons === 0) {
                  primaryActionLabel = "Start course";
                  primaryActionHref = `/learn/courses/${version.course.id}`;
                } else if (completedLessons > 0 && completedLessons < totalLessons) {
                  primaryActionLabel = "Continue learning";
                  primaryActionHref = `/learn/courses/${version.course.id}`;
                } else if (completedLessons === totalLessons && (!bestFinalTestAttempt || !bestFinalTestAttempt.passed)) {
                  primaryActionLabel = "Take final test";
                  primaryActionHref = `/learn/courses/${version.course.id}#final-test-title`;
                } else if (certificateEligibility.eligible) {
                  primaryActionLabel = "View certificate";
                  primaryActionHref = "/learn/certificates";
                } else if (proofConfig?.enabled && !proofSubmission) {
                  primaryActionLabel = "Submit optional proof";
                  primaryActionHref = `/learn/courses/${version.course.id}#proof-title`;
                } else if (proofConfig?.enabled && proofSubmission?.status === "REVISION_REQUESTED") {
                  primaryActionLabel = "Revise private proof";
                  primaryActionHref = `/learn/courses/${version.course.id}#proof-title`;
                }

                return (
                  <article className="course-row learner-dashboard-card" key={version.id}>
                    <div className="learner-dashboard-card-main">
                      <div className="studio-course-card-heading">
                        <div>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                            {version.setup?.capacityArea ? (
                              <span className="status-badge" style={{ fontSize: "0.75rem", padding: "0.1rem 0.4rem" }}>
                                {version.setup.capacityArea}
                              </span>
                            ) : null}
                            <span className="status-badge" style={{ fontSize: "0.75rem", padding: "0.1rem 0.4rem" }}>
                              Version {version.versionNumber}
                            </span>
                          </div>
                          <h3>{version.course.title}</h3>
                          <p style={{ fontSize: "0.85rem", color: "#666", margin: "0.25rem 0" }}>
                            Provided by {version.course.organization.name || "DEC Learning Hub"}
                          </p>
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
                        {proofConfig?.enabled ? (
                          <span className={`workflow-chip ${proofClass}`}>
                            {proofStatusLabel}
                          </span>
                        ) : null}
                      </div>

                      {/* Secondary action links */}
                      <div className="workspace-card-actions" style={{ marginTop: "1rem", display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
                        <Link className="workspace-sublink" href={`/learn/courses/${version.course.id}`} style={{ color: "#3b82f6", textDecoration: "underline" }}>
                          Open course overview
                        </Link>
                        {certificateEligibility.eligible ? (
                          <Link className="workspace-sublink" href="/learn/certificates" style={{ color: "#10b981", textDecoration: "underline" }}>
                            My certificates
                          </Link>
                        ) : null}
                        {proofConfig?.enabled ? (
                          <Link className="workspace-sublink" href={`/learn/courses/${version.course.id}#proof-title`} style={{ color: "#6366f1", textDecoration: "underline" }}>
                            Manage private proof
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <Link
                      className="workspace-link primary"
                      href={primaryActionHref}
                    >
                      {primaryActionLabel}
                    </Link>
                  </article>
                );
              })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No courses available yet</h3>
            <p>
              Enrolled courses and courses assigned to your organization will
              appear here.
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

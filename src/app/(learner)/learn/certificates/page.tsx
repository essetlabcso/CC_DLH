import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { getCertificateStatusLabel } from "@/lib/learner/certificate-status";
import {
  buildCertificateEligibility,
  formatCertificateDate,
  getLatestCompletedAt,
} from "@/lib/learner/certificates";
import { getBestFinalTestAttempt } from "@/lib/learner/final-test";

export default async function LearnerCertificatesPage() {
  const identity = await requireWorkspaceIdentity("/learn/certificates");
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
      certificates: {
        where: {
          userId: identity.user.id,
          revokedAt: null,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const certificateRows = publishedVersions.map((version) => {
    const totalLessons = version.modules.reduce(
      (total, module) => total + module.lessons.length,
      0,
    );
    const completedLessons = version.lessonProgress.filter(
      (progress) => progress.completedAt,
    ).length;
    const bestFinalTestAttempt = getBestFinalTestAttempt(
      version.finalTestAttempts,
    );
    const eligibility = buildCertificateEligibility({
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
      eligibility,
      certificate: version.certificates[0],
      completedAt: getLatestCompletedAt(version.lessonProgress),
      finalTestAttempt: bestFinalTestAttempt,
    };
  });

  return (
    <WorkspaceShell eyebrow="Certificates" title="My certificates">
      <p>
        View certificate readiness for DEC courses that include a completion
        certificate.
      </p>
      <div className="workspace-note" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong> A course certificate confirms you have met the
        learning threshold. It does not signify full organizational
        transformation. Practical proof and verified achievement pathways are
        separate from certification.
      </div>

      {certificateRows.length > 0 ? (
        <div className="course-list course-list-spacious">
          {certificateRows.map((row) => (
            <article className="course-row" key={row.version.id}>
              <div>
                <h2>{row.version.course.title}</h2>
                <p>{row.eligibility.label}</p>
                <p>{row.eligibility.detail}</p>
                {row.finalTestAttempt ? (
                  <p>Best final test score: {row.finalTestAttempt.scorePercent}%</p>
                ) : null}
                {row.eligibility.eligible ? (
                  <div className="context-grid">
                    <article>
                      <strong>Basis</strong>
                      <span>80%+ final test score</span>
                    </article>
                    <article>
                      <strong>Certificate ID</strong>
                      <span>
                        {row.certificate?.certificateNumber ||
                          "Ready to issue"}
                      </span>
                    </article>
                    <article>
                      <strong>Status</strong>
                      <span>
                        {row.certificate
                          ? getCertificateStatusLabel(row.certificate)
                          : "Ready to issue"}
                      </span>
                    </article>
                    <article>
                      <strong>Learner</strong>
                      <span>{identity.user.name}</span>
                    </article>
                    <article>
                      <strong>Issued</strong>
                      <span>{formatCertificateDate(row.completedAt)}</span>
                    </article>
                    <article>
                      <strong>Course version</strong>
                      <span>Version {row.version.versionNumber}</span>
                    </article>
                  </div>
                ) : null}
              </div>
              <div className="course-row-actions">
                {row.certificate ? (
                  <>
                    {!row.certificate.revokedAt ? (
                      <Link
                        href={`/learn/certificates/${row.certificate.certificateNumber}`}
                      >
                        Open certificate
                      </Link>
                    ) : null}
                    <Link
                      href={`/verify?certificate=${encodeURIComponent(
                        row.certificate.certificateNumber,
                      )}`}
                    >
                      Verify
                    </Link>
                  </>
                ) : null}
                <Link href={`/learn/courses/${row.version.course.id}`}>
                  Open course
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No certificate records yet</h2>
          <p>
            Certificate-ready courses will appear here after they are published
            and assigned to your organization.
          </p>
        </div>
      )}

      <nav className="workspace-nav" aria-label="Certificate actions">
        <Link className="workspace-link primary" href="/learn">
          My learning
        </Link>
        <Link className="workspace-link" href="/courses">
          Explore courses
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

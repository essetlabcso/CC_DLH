import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  buildMonitoringCourseSummary,
} from "@/lib/review/monitoring";
import {
  formatPublishedDate,
} from "@/lib/review/publishing";

type MonitoringDetailPageProps = {
  params: Promise<{
    courseId: string;
    versionId: string;
  }>;
};

export default async function MonitoringDetailPage({
  params,
}: MonitoringDetailPageProps) {
  const { courseId, versionId } = await params;
  const identity = await requireWorkspaceIdentity(`/review/monitoring/${courseId}/versions/${versionId}`);
  const isAdmin = identity.session.role === "admin";

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: isAdmin
        ? {}
        : { organizationId: identity.user.organizationId },
    },
    select: {
      id: true,
      courseId: true,
      versionNumber: true,
      publishedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      setup: {
        select: {
          summary: true,
          primaryLearnerGroup: true,
        },
      },
      capacityMap: {
        select: {
          capacityArea: true,
          linkedStandard: true,
          capacityOutcome: true,
        },
      },
      monitoringRecord: {
        select: {
          signalSummary: true,
          improvementNotes: true,
        },
      },
      modules: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
      lessonProgress: {
        select: {
          userId: true,
          completedAt: true,
        },
      },
      finalTestAttempts: {
        select: {
          userId: true,
          scorePercent: true,
          passed: true,
          submittedAt: true,
        },
      },
      _count: {
        select: {
          certificates: true,
          practicalProofSubmissions: true,
          verifiedAchievements: true,
        },
      },
    },
  });

  if (!version) {
    notFound();
  }

  const totalLessons = version.modules.reduce(
    (total, mod) => total + mod.lessons.length,
    0,
  );
  const summary = buildMonitoringCourseSummary({
    totalLessons,
    progressRecords: version.lessonProgress,
    finalTestAttempts: version.finalTestAttempts,
    certificateCount: version._count.certificates,
    proofSubmissionCount: version._count.practicalProofSubmissions,
    verifiedAchievementCount: version._count.verifiedAchievements,
  });
  const demoMetrics = parseDemoMonitoringMetrics(
    version.monitoringRecord?.signalSummary,
  );
  const displayedMetrics = {
    enrolled: demoMetrics?.enrolledLearners ?? summary.learnersStarted,
    started: demoMetrics?.startedLearners ?? summary.learnersStarted,
    completed: demoMetrics?.completedLearners ?? summary.learnersCompleted,
    completionRate: demoMetrics?.completionRate ?? summary.completionRate,
    finalTestPassRate:
      demoMetrics?.finalTestPassRate ?? summary.finalTestPassRate,
    certificatesIssued:
      demoMetrics?.certificatesIssued ?? summary.certificateCount,
    proofSubmissions:
      demoMetrics?.practicalProofSubmissions ??
      summary.proofSubmissionCount,
    verifiedAchievements:
      demoMetrics?.verifiedAchievementsAwarded ??
      summary.verifiedAchievementCount,
    learnerFeedbackAverage: demoMetrics?.learnerFeedbackAverage,
    improvementSignal: demoMetrics?.improvementSignal,
    safeCapacityEvidenceSummary: demoMetrics?.safeCapacityEvidenceSummary,
    courseVersion: demoMetrics?.courseVersion,
  };

  return (
    <WorkspaceShell
      eyebrow="Monitoring Detail"
      title={version.course.title}
    >
      <header className="detail-header">
        <p>
          {version.course.organization.name} · Version {version.versionNumber} · Published {formatPublishedDate(version.publishedAt)}
        </p>
      </header>

      <div className="workspace-alert warning">
        <p>
          <strong>Governance Notice:</strong> Course completion certificates prove that a learner has passed the final test (80%+ score) and completed training. They do not prove full organizational transformation or performance change in the field.
        </p>
      </div>

      <section className="studio-section" aria-labelledby="traceability-title">
        <h2 id="traceability-title">Traceability Summary</h2>
        <div className="detail-grid">
          <div>
            <h3>Course Purpose</h3>
            <p>{version.setup?.summary || "No summary recorded."}</p>
          </div>
          <div>
            <h3>Capacity Focus</h3>
            <p>
              {version.capacityMap?.capacityArea || "Unmapped capacity area"} · {version.capacityMap?.linkedStandard || "No linked standard"}
            </p>
            {version.capacityMap?.capacityOutcome ? (
              <p>Outcome: {version.capacityMap.capacityOutcome}</p>
            ) : null}
          </div>
          <div>
            <h3>Target Learners</h3>
            <p>{version.setup?.primaryLearnerGroup || "No learner group recorded."}</p>
          </div>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="engagement-title">
        <h2 id="engagement-title">Engagement & Progress</h2>
        <div className="metric-grid">
          <article>
            <strong>{displayedMetrics.enrolled}</strong>
            <span>Enrolled participants</span>
          </article>
          <article>
            <strong>{displayedMetrics.started}</strong>
            <span>Started</span>
          </article>
          <article>
            <strong>{displayedMetrics.completed}</strong>
            <span>Learners completed</span>
          </article>
          <article>
            <strong>{displayedMetrics.completionRate}%</strong>
            <span>Completion rate</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="evidence-title">
        <h2 id="evidence-title">Impact Evidence</h2>
        <div className="metric-grid">
          <article>
            <strong>{displayedMetrics.finalTestPassRate}%</strong>
            <span>Final test pass rate (80%+)</span>
          </article>
          <article>
            <strong>{displayedMetrics.certificatesIssued}</strong>
            <span>Certificates issued</span>
          </article>
          <article>
            <strong>{displayedMetrics.proofSubmissions}</strong>
            <span>Practical proofs submitted</span>
          </article>
          <article>
            <strong>{displayedMetrics.verifiedAchievements}</strong>
            <span>Verified achievements</span>
          </article>
          {displayedMetrics.learnerFeedbackAverage ? (
            <article>
              <strong>{displayedMetrics.learnerFeedbackAverage} / 5</strong>
              <span>Learner feedback</span>
            </article>
          ) : null}
          {displayedMetrics.courseVersion ? (
            <article>
              <strong>{displayedMetrics.courseVersion}</strong>
              <span>Course version</span>
            </article>
          ) : null}
          <article>
            <strong>{version.capacityMap?.capacityArea || "MEAL"}</strong>
            <span>Capacity area</span>
          </article>
        </div>
        
        <div className="context-grid">
          <div className="studio-section-sub">
            <h3>Final Test Performance</h3>
            <p>Average Score: {summary.finalTestAverageScore}%</p>
            <p>Pass Rate: {summary.finalTestPassRate}%</p>
            <p>Total Attempts: {summary.finalTestAttempts}</p>
          </div>
          <div className="studio-section-sub">
            <h3>Practical Evidence</h3>
            <p>
              Practical proof is separate from the automated course certificate. It requires human review of field evidence.
            </p>
            <p>Submissions: {displayedMetrics.proofSubmissions}</p>
            <p>Verified achievements: {displayedMetrics.verifiedAchievements}</p>
            <p>Raw proof is private by default and is not displayed here.</p>
          </div>
        </div>
      </section>

      {displayedMetrics.safeCapacityEvidenceSummary ||
      displayedMetrics.improvementSignal ? (
        <section className="studio-section" aria-labelledby="safe-summary-title">
          <h2 id="safe-summary-title">Safe Capacity Evidence Summary</h2>
          {displayedMetrics.safeCapacityEvidenceSummary ? (
            <p>{displayedMetrics.safeCapacityEvidenceSummary}</p>
          ) : null}
          {displayedMetrics.improvementSignal ? (
            <div className="workspace-note">
              <strong>Improvement signal:</strong>{" "}
              {displayedMetrics.improvementSignal}
            </div>
          ) : null}
        </section>
      ) : null}

      {version.monitoringRecord?.improvementNotes ? (
        <section className="studio-section" aria-labelledby="improvement-title">
          <h2 id="improvement-title">Monitoring Notes</h2>
          <div className="workspace-note">
            <p>{version.monitoringRecord.improvementNotes}</p>
          </div>
        </section>
      ) : null}

      <nav className="workspace-nav" aria-label="Monitoring detail actions">
        <Link className="workspace-link" href="/review/monitoring">
          Back to monitoring dashboard
        </Link>
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

type DemoMonitoringMetrics = {
  courseVersion?: string;
  enrolledLearners?: number;
  startedLearners?: number;
  completedLearners?: number;
  completionRate?: number;
  finalTestPassRate?: number;
  certificatesIssued?: number;
  practicalProofSubmissions?: number;
  verifiedAchievementsAwarded?: number;
  learnerFeedbackAverage?: number;
  improvementSignal?: string;
  safeCapacityEvidenceSummary?: string;
};

function parseDemoMonitoringMetrics(
  value: string | null | undefined,
): DemoMonitoringMetrics | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as DemoMonitoringMetrics;

    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

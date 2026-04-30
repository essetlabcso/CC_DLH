import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { submitLearnerFinalTestAction } from "@/app/(learner)/learn/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { buildCertificateEligibility } from "@/lib/learner/certificates";
import {
  countLearnerCourseBlocks,
  formatLearnerCourseDuration,
  getFirstLearnerLesson,
} from "@/lib/learner/course-access";
import {
  buildPracticalProofReadiness,
  getProofTypeLabel,
  getSubmissionFormatLabel,
} from "@/lib/studio/practical-proof";
import {
  getBestFinalTestAttempt,
  getLatestFinalTestAttempt,
  parseFinalTestContent,
} from "@/lib/learner/final-test";
import { buildLearnerProgressSummary } from "@/lib/learner/progress";
import { formatPublishedDate } from "@/lib/review/publishing";

type LearnerCoursePageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    finalTest?: string;
  }>;
};

export default async function LearnerCoursePage({
  params,
  searchParams,
}: LearnerCoursePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(`/learn/courses/${courseId}`);
  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
    },
    include: {
      course: true,
      setup: true,
      practicalProofConfig: true,
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

  if (!version) {
    notFound();
  }

  const progressRecords = await prisma.learnerLessonProgress.findMany({
    where: {
      userId: identity.user.id,
      courseVersionId: version.id,
    },
  });
  const totalLessons = version.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
  const progressSummary = buildLearnerProgressSummary(
    totalLessons,
    progressRecords.length,
    progressRecords.filter((progress) => progress.completedAt).length,
  );
  const latestFinalTestAttempt = getLatestFinalTestAttempt(
    version.finalTestAttempts,
  );
  const bestFinalTestAttempt = getBestFinalTestAttempt(
    version.finalTestAttempts,
  );
  const certificateEligibility = buildCertificateEligibility({
    certificateIntent: version.setup?.certificateIntent,
    totalLessons,
    completedLessons: progressRecords.filter((progress) => progress.completedAt)
      .length,
    finalTestScorePercent: bestFinalTestAttempt?.scorePercent,
    finalTestPassed: bestFinalTestAttempt?.passed,
  });
  const completedLessonIds = new Set(
    progressRecords
      .filter((progress) => progress.completedAt)
      .map((progress) => progress.lessonId),
  );
  const firstLesson = getFirstLearnerLesson(version.modules);
  const finalTestBlock = version.modules
    .flatMap((module) => module.lessons)
    .flatMap((lesson) => lesson.blocks)
    .find((block) => block.type === "FINAL_TEST");
  const finalTest = parseFinalTestContent(finalTestBlock?.content);
  const proofReadiness = buildPracticalProofReadiness(
    version.practicalProofConfig,
  );

  return (
    <WorkspaceShell eyebrow="Course" title={version.course.title}>
      <p>
        {version.setup?.summary ||
          "A DEC-reviewed course for practical CSO learning."}
      </p>
      {resolvedSearchParams?.finalTest === "1" ? (
        <p className="workspace-note">Final test submitted.</p>
      ) : null}
      {resolvedSearchParams?.error === "final-test-answer" ? (
        <p className="workspace-error">
          Choose an answer before submitting the final test.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="course-meta-title">
        <h2 id="course-meta-title">Course overview</h2>
        <div className="context-grid">
          <article>
            <strong>Format</strong>
            <span>{version.setup?.formatAndTime || "Self-paced learning"}</span>
          </article>
          <article>
            <strong>Level</strong>
            <span>{version.setup?.level || "All levels"}</span>
          </article>
          <article>
            <strong>Lessons</strong>
            <span>{formatLearnerCourseDuration(version.modules)}</span>
          </article>
          <article>
            <strong>Progress</strong>
            <span>{progressSummary.label}</span>
          </article>
          <article>
            <strong>Certificate</strong>
            <span>{certificateEligibility.label}</span>
          </article>
        </div>
        <p className="workspace-note">
          Published {formatPublishedDate(version.publishedAt)}
        </p>
      </section>

      <section className="studio-section" aria-labelledby="modules-title">
        <h2 id="modules-title">What you will learn</h2>
        <div className="course-list course-list-spacious">
          {version.modules.map((module) => (
            <article className="course-row" key={module.id}>
              <div>
                <h3>{module.title}</h3>
                <p>
                  {module.lessons.length}{" "}
                  {module.lessons.length === 1 ? "lesson" : "lessons"} ·{" "}
                  {module.lessons.reduce(
                    (total, lesson) => total + lesson.blocks.length,
                    0,
                  )}{" "}
                  learning blocks
                </p>
                <ol className="lesson-list">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      {lesson.title} ·{" "}
                      {completedLessonIds.has(lesson.id)
                        ? "Complete"
                        : "Not complete"}
                    </li>
                  ))}
                </ol>
              </div>
              {module.lessons[0] ? (
                <Link
                  href={`/learn/courses/${version.course.id}/lessons/${module.lessons[0].id}`}
                >
                  Open module
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <div className="next-step-panel">
        <h2>{certificateEligibility.label}</h2>
        <p>{certificateEligibility.detail}</p>
        {latestFinalTestAttempt ? (
          <p>
            Latest final test score: {latestFinalTestAttempt.scorePercent}%.
          </p>
        ) : null}
        <p>
          This course has {countLearnerCourseBlocks(version.modules)} learner
          blocks prepared for web learning.
        </p>
      </div>

      {finalTestBlock && finalTest.ok ? (
        <section className="studio-section" aria-labelledby="final-test-title">
          <h2 id="final-test-title">Final test</h2>
          <div className="final-test-panel">
            <div>
              <p className="block-kicker">Course assessment</p>
              <h3>{finalTest.value.title}</h3>
              <p>
                Score 80% or above on the final test to pass the course and
                receive the course certificate.
              </p>
            </div>
            <form
              action={submitLearnerFinalTestAction.bind(
                null,
                courseId,
                finalTestBlock.id,
              )}
              className="checklist-form"
            >
              <fieldset>
                <legend>{finalTest.value.prompt}</legend>
                {finalTest.value.choices.map((choice, index) => {
                  const answer = ["A", "B", "C", "D"][index];

                  return (
                    <label className="radio-row" key={answer}>
                      <input
                        name="selectedAnswer"
                        type="radio"
                        value={answer}
                      />
                      <span>
                        {answer}. {choice}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <button className="workspace-button" type="submit">
                Submit final test
              </button>
            </form>
            {latestFinalTestAttempt ? (
              <div className="context-grid">
                <article>
                  <strong>Latest score</strong>
                  <span>{latestFinalTestAttempt.scorePercent}%</span>
                </article>
                <article>
                  <strong>Status</strong>
                  <span>
                    {latestFinalTestAttempt.passed
                      ? "Passed"
                      : "Not passed yet"}
                  </span>
                </article>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {proofReadiness.enabled && proofReadiness.ready ? (
        <section className="studio-section" aria-labelledby="proof-title">
          <h2 id="proof-title">Optional practical proof</h2>
          <div className="final-test-panel">
            <div>
              <p className="block-kicker">Separate from certification</p>
              <h3>{version.practicalProofConfig?.proofTitle}</h3>
              <p>
                Your course certificate is based on the final test. Practical
                proof is a separate optional pathway for showing how you apply
                the learning in real CSO work.
              </p>
            </div>
            <div className="context-grid">
              <article>
                <strong>Accepted proof</strong>
                <span>
                  {getProofTypeLabel(
                    version.practicalProofConfig?.acceptedProofType || "",
                  )}
                </span>
              </article>
              <article>
                <strong>Format</strong>
                <span>
                  {getSubmissionFormatLabel(
                    version.practicalProofConfig?.submissionFormat || "",
                  )}
                </span>
              </article>
              <article>
                <strong>Privacy</strong>
                <span>{proofReadiness.visibilityDefault}</span>
              </article>
              <article>
                <strong>Capacity indicator</strong>
                <span>{proofReadiness.capacityIndicator}</span>
              </article>
            </div>
            <div className="block-content">
              <strong>Instructions</strong>
              <p>{version.practicalProofConfig?.instructions}</p>
            </div>
            <div className="block-content">
              <strong>Safety guidance</strong>
              <p>{version.practicalProofConfig?.safetyGuidance}</p>
            </div>
            <p className="workspace-note">
              This course currently provides proof guidance only. Do not share
              sensitive or identifying material unless DEC opens a protected
              proof submission process for this course.
            </p>
          </div>
        </section>
      ) : null}

      <nav className="workspace-nav" aria-label="Learner course actions">
        {firstLesson ? (
          <Link
            className="workspace-link primary"
            href={`/learn/courses/${version.course.id}/lessons/${firstLesson.lessonId}`}
          >
            Start first lesson
          </Link>
        ) : null}
        <Link className="workspace-link" href="/learn">
          My learning
        </Link>
        <Link className="workspace-link" href="/learn/certificates">
          My certificates
        </Link>
        <Link className="workspace-link" href="/courses">
          Explore courses
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  submitLearnerFinalTestAction,
  submitLearnerPracticalProofAction,
} from "@/app/(learner)/learn/actions";
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
import {
  canRevisePrivatePracticalProof,
  formatLearnerProofStatus,
  getLearnerProofReviewGuidance,
  getPracticalProofCertificateSeparationCopy,
  learnerProofSubmissionFieldLabels,
  summarizeLearnerPracticalProofSubmission,
} from "@/lib/learner/practical-proof";
import { summarizeLearnerProofAuditEvent } from "@/lib/proof-audit";
import { buildLearnerProgressSummary } from "@/lib/learner/progress";
import { formatPublishedDate } from "@/lib/review/publishing";

type LearnerCoursePageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    finalTest?: string;
    fields?: string;
    proof?: string;
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
      practicalProofSubmissions: {
        where: {
          userId: identity.user.id,
        },
        include: {
          events: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      },
      verifiedAchievements: {
        where: {
          userId: identity.user.id,
          visibilityDefault: "PRIVATE",
          donorVisibilityEnabled: false,
          aiIssued: false,
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
  const proofSubmission = version.practicalProofSubmissions[0];
  const verifiedAchievement = version.verifiedAchievements[0];
  const canReviseProof = canRevisePrivatePracticalProof(
    proofSubmission?.status || "",
  );
  const proofReviewGuidance = getLearnerProofReviewGuidance(proofSubmission);
  const proofMissingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => learnerProofSubmissionFieldLabels[field] || field)
    : [];
  const completedLessons = progressRecords.filter(
    (progress) => progress.completedAt,
  ).length;
  const lessonCompletionLabel = `${completedLessons}/${totalLessons} lessons complete`;
  const finalTestStatusLabel = bestFinalTestAttempt?.passed
    ? "Final test passed"
    : latestFinalTestAttempt
      ? "Final test attempted"
      : "Final test not started";
  const proofStatusLabel = proofReadiness.enabled
    ? proofSubmission
      ? formatLearnerProofStatus(proofSubmission.status)
      : proofReadiness.ready
        ? "Proof optional"
        : "Proof unavailable"
    : "No proof requirement";

  return (
    <WorkspaceShell eyebrow="Course" title={version.course.title}>
      <div className="learner-course-hero">
        <div>
          <p>
            {version.setup?.summary ||
              "A DEC-reviewed course for practical CSO learning."}
          </p>
          <div className="review-hero-status" aria-label="Course progress summary">
            <span className="status-badge">{lessonCompletionLabel}</span>
            <span
              className={`status-badge ${getLearnerProgressBadgeClass(
                progressSummary.label,
              )}`}
            >
              {progressSummary.label}
            </span>
            <span
              className={`status-badge ${
                bestFinalTestAttempt?.passed
                  ? "status-badge-ready"
                  : "status-badge-blocked"
              }`}
            >
              {finalTestStatusLabel}
            </span>
            <span className={getCertificateBadgeClass(certificateEligibility.label)}>
              {certificateEligibility.label}
            </span>
          </div>
        </div>
        <div className="learner-course-next">
          <strong>Next learner step</strong>
          <span>
            {firstLesson
              ? "Start or continue lessons, then complete the final test for certificate eligibility."
              : "Course lessons are not available yet."}
          </span>
        </div>
      </div>
      {resolvedSearchParams?.finalTest === "1" ? (
        <p className="workspace-note">Final test submitted.</p>
      ) : null}
      {resolvedSearchParams?.proof === "1" ? (
        <p className="workspace-note">
          Practical proof submitted privately. Your certificate status is still
          based on the final test only.
        </p>
      ) : null}
      {resolvedSearchParams?.proof === "resubmitted" ? (
        <p className="workspace-note">
          Revised practical proof submitted privately. It is back with DEC
          review and remains separate from your course certificate.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "final-test-answer" ? (
        <p className="workspace-error">
          Choose an answer before submitting the final test.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "proof" ? (
        <p className="workspace-error">
          Complete the private proof submission fields:{" "}
          {proofMissingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "proof-config" ? (
        <p className="workspace-error">
          Practical proof is not currently open for this course.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "proof-exists" ? (
        <p className="workspace-error">
          A private practical proof submission already exists for this course.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="course-meta-title">
        <div className="section-heading-row">
          <div>
            <h2 id="course-meta-title">Course overview</h2>
            <p className="section-subcopy">
              Practical course details, progress, and certificate status.
            </p>
          </div>
          <span className="status-badge status-badge-published">
            Published {formatPublishedDate(version.publishedAt)}
          </span>
        </div>
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
            <span
              className={`status-badge ${getLearnerProgressBadgeClass(
                progressSummary.label,
              )}`}
            >
              {progressSummary.label}
            </span>
          </article>
          <article>
            <strong>Certificate</strong>
            <span className={getCertificateBadgeClass(certificateEligibility.label)}>
              {certificateEligibility.label}
            </span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="modules-title">
        <div className="section-heading-row">
          <div>
            <h2 id="modules-title">What you will learn</h2>
            <p className="section-subcopy">
              Lessons are short, trackable steps toward the final test.
            </p>
          </div>
          <span className="status-badge">
            {countLearnerCourseBlocks(version.modules)} learner blocks
          </span>
        </div>
        <div className="course-list course-list-spacious">
          {version.modules.map((module) => (
            <article className="course-row learner-module-card" key={module.id}>
              <div>
                <div className="studio-course-card-heading">
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
                  </div>
                  <span className="status-badge">
                    {
                      module.lessons.filter((lesson) =>
                        completedLessonIds.has(lesson.id),
                      ).length
                    }
                    /{module.lessons.length} complete
                  </span>
                </div>
                <ol className="lesson-list">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <span>{lesson.title}</span>
                      <span
                        className={`workflow-chip ${
                          completedLessonIds.has(lesson.id)
                            ? "workflow-chip-complete"
                            : "workflow-chip-ready"
                        }`}
                      >
                        {completedLessonIds.has(lesson.id)
                          ? "Complete"
                          : "Not complete"}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              {module.lessons[0] ? (
                <Link
                  className="workspace-link primary"
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
        <div className="workspace-note" style={{ marginTop: "1rem" }}>
          <strong>Note:</strong> A course certificate confirms you have met the learning threshold. It does not signify full organizational transformation or independently verified practice.
        </div>
      </div>

      {finalTestBlock && finalTest.ok ? (
        <section className="studio-section" aria-labelledby="final-test-title">
          <div className="section-heading-row">
            <div>
              <h2 id="final-test-title">Final test</h2>
              <p className="section-subcopy">
                Score 80% or above to pass the course and unlock the course
                certificate.
              </p>
            </div>
            <span
              className={`status-badge ${
                bestFinalTestAttempt?.passed
                  ? "status-badge-ready"
                  : "status-badge-blocked"
              }`}
            >
              {finalTestStatusLabel}
            </span>
          </div>
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
                {version.finalTestAttempts.length > 1 && bestFinalTestAttempt ? (
                  <article>
                    <strong>Best score</strong>
                    <span>{bestFinalTestAttempt.scorePercent}%</span>
                  </article>
                ) : null}
                <article>
                  <strong>Status</strong>
                  <span
                    className={`status-badge ${
                      latestFinalTestAttempt.passed
                        ? "status-badge-ready"
                        : "status-badge-blocked"
                    }`}
                  >
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
          <div className="section-heading-row">
            <div>
              <h2 id="proof-title">Optional practical proof</h2>
              <p className="section-subcopy">
                A private, optional evidence pathway separate from the course
                certificate.
              </p>
            </div>
            <span className="status-badge">{proofStatusLabel}</span>
          </div>
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
              {summarizeLearnerPracticalProofSubmission(proofSubmission)}
            </p>
            {proofSubmission ? (
              <>
                <div className="context-grid">
                  <article>
                    <strong>Status</strong>
                    <span>{formatLearnerProofStatus(proofSubmission.status)}</span>
                  </article>
                  <article>
                    <strong>Raw proof visibility</strong>
                    <span>{proofSubmission.visibilityDefault}</span>
                  </article>
                  <article>
                    <strong>Submitted</strong>
                    <span>
                      {proofSubmission.submittedAt.toLocaleDateString(
                        "en-US",
                        {
                          dateStyle: "medium",
                        },
                      )}
                    </span>
                  </article>
                  <article>
                    <strong>Last updated</strong>
                    <span>
                      {proofSubmission.updatedAt.toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </article>
                </div>
                {proofReviewGuidance ? (
                  <p className="workspace-note">{proofReviewGuidance}</p>
                ) : null}
                {proofSubmission.learnerFeedback ? (
                  <div className="block-content">
                    <strong>Reviewer feedback</strong>
                    <p>{proofSubmission.learnerFeedback}</p>
                  </div>
                ) : null}
                {proofSubmission.requiredAction ? (
                  <div className="block-content">
                    <strong>Requested action</strong>
                    <p>{proofSubmission.requiredAction}</p>
                  </div>
                ) : null}
                {verifiedAchievement ? (
                  <div className="block-content">
                    <strong>Private verified achievement</strong>
                    <p>{verifiedAchievement.title}</p>
                    <p>{verifiedAchievement.description}</p>
                    <p className="workspace-note">
                      Issued{" "}
                      {verifiedAchievement.issuedAt.toLocaleDateString(
                        "en-US",
                        {
                          dateStyle: "medium",
                        },
                      )}{" "}
                      for {verifiedAchievement.capacityIndicator}. This is
                      separate from your course certificate. No public badge or
                      donor-facing display is active.
                    </p>
                  </div>
                ) : null}
                <div className="block-content">
                  <strong>Private proof history</strong>
                  {proofSubmission.events.length > 0 ? (
                    <ol className="lesson-list">
                      {proofSubmission.events.map((event) => (
                        <li key={event.id}>
                          {event.createdAt.toLocaleDateString("en-US", {
                            dateStyle: "medium",
                          })}{" "}
                          · {summarizeLearnerProofAuditEvent(event)}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>
                      History will appear for new proof actions. Internal
                      reviewer notes are not shown here.
                    </p>
                  )}
                </div>
                {canReviseProof ? (
                  <form
                    action={submitLearnerPracticalProofAction.bind(
                      null,
                      courseId,
                    )}
                    className="checklist-form"
                  >
                    <div className="block-content">
                      <strong>Revise private proof</strong>
                      <p>{getPracticalProofCertificateSeparationCopy()}</p>
                      <p>
                        Update only safe, anonymized text or a safe link. Do
                        not include real names, contact details, exact
                        locations, active case details, confidential documents,
                        or politically sensitive information.
                      </p>
                    </div>
                    <label>
                      <span>Practical proof text</span>
                      <textarea
                        defaultValue={proofSubmission.proofText}
                        name="proofText"
                        placeholder="Describe the revised practical output or application using safe, anonymized details."
                      />
                    </label>
                    <label>
                      <span>Optional evidence link</span>
                      <input
                        defaultValue={proofSubmission.evidenceLink}
                        name="evidenceLink"
                        placeholder="https://example.org/redacted-proof"
                        type="url"
                      />
                    </label>
                    <label className="checkbox-row">
                      <input name="safetyAcknowledged" type="checkbox" />
                      <span>
                        I have removed sensitive, identifying, safeguarding,
                        beneficiary, and politically sensitive details.
                      </span>
                    </label>
                    <label className="checkbox-row">
                      <input
                        name="certificateSeparationAcknowledged"
                        type="checkbox"
                      />
                      <span>
                        I understand this practical proof is optional and
                        separate from my course certificate.
                      </span>
                    </label>
                    <button className="workspace-button" type="submit">
                      Resubmit private proof
                    </button>
                  </form>
                ) : null}
              </>
            ) : (
              <form
                action={submitLearnerPracticalProofAction.bind(null, courseId)}
                className="checklist-form"
              >
                <div className="block-content">
                  <strong>Before you submit</strong>
                  <p>{getPracticalProofCertificateSeparationCopy()}</p>
                  <p>
                    Do not include real names, phone numbers, addresses,
                    beneficiary details, active safeguarding cases, or
                    politically sensitive information. Use redacted or
                    anonymized examples only.
                  </p>
                </div>
                <label>
                  <span>Practical proof text</span>
                  <textarea
                    name="proofText"
                    placeholder="Describe the practical output or application using safe, anonymized details."
                  />
                </label>
                <label>
                  <span>Optional evidence link</span>
                  <input
                    name="evidenceLink"
                    placeholder="https://example.org/redacted-proof"
                    type="url"
                  />
                </label>
                <label className="checkbox-row">
                  <input name="safetyAcknowledged" type="checkbox" />
                  <span>
                    I have removed sensitive, identifying, safeguarding,
                    beneficiary, and politically sensitive details.
                  </span>
                </label>
                <label className="checkbox-row">
                  <input
                    name="certificateSeparationAcknowledged"
                    type="checkbox"
                  />
                  <span>
                    I understand this practical proof is optional and separate
                    from my course certificate.
                  </span>
                </label>
                <button className="workspace-button" type="submit">
                  Submit private proof
                </button>
              </form>
            )}
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

function getLearnerProgressBadgeClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("complete")) {
    return "status-badge-ready";
  }

  if (normalized.includes("not") || normalized.includes("0")) {
    return "status-badge-blocked";
  }

  return "status-badge-published";
}

function getCertificateBadgeClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("earned") || normalized.includes("eligible")) {
    return "status-badge status-badge-ready";
  }

  if (normalized.includes("not") || normalized.includes("locked")) {
    return "status-badge status-badge-blocked";
  }

  return "status-badge";
}

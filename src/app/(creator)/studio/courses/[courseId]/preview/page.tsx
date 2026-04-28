import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getBlockTypeLabel,
  parseBuildBlockContent,
} from "@/lib/studio/build-studio";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import {
  previewCompletionFieldLabels,
} from "@/lib/studio/preview-checks";

import { completePreviewChecksAction } from "../../../actions";

type PreviewPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    fields?: string;
    ready?: string;
  }>;
};

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/preview`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const buildStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.BUILD,
  );
  const previewStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.PREVIEW,
  );

  if (buildStatus !== WorkflowStepStatus.COMPLETE) {
    return (
      <WorkspaceShell eyebrow="Preview" title={editable.course.title}>
        <p>
          Complete Build Studio checks before opening this course in Preview.
        </p>
        <nav className="workspace-nav" aria-label="Preview recovery">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/build`}
          >
            Go to Build Studio
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const completePreviewAction = completePreviewChecksAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => previewCompletionFieldLabels[field] || field)
    : [];

  return (
    <WorkspaceShell eyebrow="Preview" title={editable.course.title}>
      <p>
        Review the course in a learner-facing shape before creator review and
        formal publishing checks.
      </p>
      {resolvedSearchParams?.ready === "1" ? (
        <p className="workspace-note">Build checks complete. Preview is open.</p>
      ) : null}
      {resolvedSearchParams?.error === "checks" ? (
        <p className="workspace-error">
          Complete the required Preview checks: {missingFields.join(", ")}.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="preview-title">
        <div className="learner-preview-shell">
          <div className="learner-preview-header">
            <p className="public-kicker">Course Preview</p>
            <h2 id="preview-title">{editable.course.title}</h2>
            <p>
              This preview uses the same saved lesson blocks that will later
              power the learner course player.
            </p>
          </div>

          {editable.version.modules.map((module) => (
            <section className="preview-module" key={module.id}>
              <h3>{module.title}</h3>
              {module.lessons.map((lesson) => (
                <article className="preview-lesson" key={lesson.id}>
                  <h4>{lesson.title}</h4>
                  <div className="preview-block-list">
                    {lesson.blocks.map((block) => {
                      const content = parseBuildBlockContent(block.content);

                      return (
                        <section className="preview-block" key={block.id}>
                          <p className="preview-block-kind">
                            {getPreviewBlockKind(block.type)}
                          </p>
                          <h5>
                            {content.title || getBlockTypeLabel(block.type)}
                          </h5>
                          {content.body ? <p>{content.body}</p> : null}
                          {content.prompt ? (
                            <div className="preview-prompt">
                              <strong>
                                {block.type === "FINAL_TEST"
                                  ? "Final test question"
                                  : "Question"}
                              </strong>
                              <p>{content.prompt}</p>
                              {content.choices ? (
                                <ol className="preview-choice-list" type="A">
                                  {content.choices.map((choice) => (
                                    <li key={choice}>{choice}</li>
                                  ))}
                                </ol>
                              ) : null}
                              {block.type === "FINAL_TEST" &&
                              content.correctAnswer ? (
                                <p>
                                  Correct answer: {content.correctAnswer}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </section>
                      );
                    })}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </section>

      <div className="next-step-panel">
        <h2>Next step: Creator Review</h2>
        {previewStatus === WorkflowStepStatus.COMPLETE ? (
          <>
            <p>
              Preview checks are complete. Continue to Creator Review for final
              sign-off before submission.
            </p>
            <nav className="workspace-nav" aria-label="Preview next step">
              <Link
                className="workspace-link primary"
                href={`/studio/courses/${courseId}/creator-review`}
              >
                Continue to Creator Review
              </Link>
            </nav>
          </>
        ) : (
          <p>
            Confirm Preview checks to open Creator Review before the course can
            be submitted to reviewers.
          </p>
        )}
      </div>

      {previewStatus === WorkflowStepStatus.COMPLETE ? null : (
        <section className="studio-section" aria-labelledby="preview-checks-title">
          <h2 id="preview-checks-title">Preview checks</h2>
          <form action={completePreviewAction} className="checklist-form">
            <label className="checkbox-row">
              <input name="practicalFlowConfirmed" type="checkbox" />
              <span>The lesson feels practical for CSO staff work</span>
            </label>
            <label className="checkbox-row">
              <input name="avoidsInformationDumpConfirmed" type="checkbox" />
              <span>The lesson avoids dumping information without practice</span>
            </label>
            <label className="checkbox-row">
              <input name="practiceConfirmed" type="checkbox" />
              <span>The learner makes a decision or practices the action</span>
            </label>
            <label className="checkbox-row">
              <input name="mobilePreviewConfirmed" type="checkbox" />
              <span>Mobile and low-bandwidth Preview has been checked</span>
            </label>
            <label className="checkbox-row">
              <input name="accessibilityPreviewConfirmed" type="checkbox" />
              <span>Accessibility risks have been checked in Preview</span>
            </label>
            <button className="workspace-button" type="submit">
              Complete Preview checks
            </button>
          </form>
        </section>
      )}

      <nav className="workspace-nav" aria-label="Preview actions">
        <Link
          className="workspace-link"
          href={`/studio/courses/${courseId}/build`}
        >
          Back to Build Studio
        </Link>
        <Link className="workspace-link" href="/studio/courses">
          My courses
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

function getPreviewBlockKind(type: string) {
  switch (type) {
    case "SCENARIO":
      return "Practice";
    case "CHECK":
      return "Check";
    case "FINAL_TEST":
      return "Final test";
    case "REFLECTION":
      return "Reflect";
    default:
      return "Read";
  }
}

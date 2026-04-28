import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DesignSummaryPanel } from "@/components/studio/DesignSummaryPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  blockJustificationLabels,
  blockLibrary,
  creatorAddedBlockFieldLabels,
} from "@/lib/studio/block-library";
import {
  buildBlockEditFieldLabels,
  finalTestAuthoringFieldLabels,
  getBlockTypeLabel,
  parseBuildBlockContent,
} from "@/lib/studio/build-studio";
import {
  buildCompletionFieldLabels,
  hasBuildContent,
  hasFinalTestContent,
} from "@/lib/studio/build-checks";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import { isDesignHandoverLocked } from "@/lib/studio/design-handover";
import { parseStoryboardLessonPlan } from "@/lib/studio/storyboard";

import {
  addCreatorBlockAction,
  completeBuildChecksAction,
  generateBuildFromStoryboardAction,
  moveBuildBlockAction,
  saveBuildBlockContentAction,
  saveFinalTestBlockAction,
} from "../../../actions";

type BuildStudioPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    checked?: string;
    error?: string;
    fields?: string;
    generated?: string;
    designLocked?: string;
    added?: string;
    edited?: string;
    moved?: string;
    finalTest?: string;
  }>;
};

export default async function BuildStudioPage({
  params,
  searchParams,
}: BuildStudioPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
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

  const storyboardStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.STORYBOARD,
  );
  const buildStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.BUILD,
  );
  const previewStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.PREVIEW,
  );
  const storyboard = editable.version.storyboard;
  const designHandover = editable.version.designHandover;
  const storyboardLesson = parseStoryboardLessonPlan(
    storyboard?.lessonPlan,
  )[0];

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !storyboard?.approvedForBuild ||
    !isDesignHandoverLocked(designHandover) ||
    !storyboardLesson
  ) {
    return (
      <WorkspaceShell eyebrow="Build Studio" title={editable.course.title}>
        <p>
          Complete Storyboard and lock the Design-to-Build Handover before
          creating learner-facing lesson content.
        </p>
        <nav className="workspace-nav" aria-label="Build Studio recovery">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/storyboard`}
          >
            Go to Storyboard
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const generateAction = generateBuildFromStoryboardAction.bind(null, courseId);
  const completeChecksAction = completeBuildChecksAction.bind(null, courseId);
  const modules = editable.version.modules;
  const hasGeneratedContent = hasBuildContent(modules);
  const rawMissingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
    : [];
  const buildMissingFields = rawMissingFields.map(
    (field) => buildCompletionFieldLabels[field] || field,
  );
  const firstLessonId = getFirstLessonId(modules);
  const finalTestBlock = modules
    .flatMap((module) => module.lessons)
    .flatMap((lesson) => lesson.blocks)
    .find((block) => block.type === "FINAL_TEST");
  const finalTestContent = parseBuildBlockContent(finalTestBlock?.content);
  const finalTestAction = firstLessonId
    ? saveFinalTestBlockAction.bind(null, courseId, firstLessonId)
    : null;
  const finalTestRequired = hasCertificateIntent(
    editable.version.setup?.certificateIntent,
  );
  const finalTestReady = hasFinalTestContent(modules);

  return (
    <WorkspaceShell eyebrow="Build Studio" title={editable.course.title}>
      <p>
        Build Studio turns the approved Storyboard into governed lesson blocks
        that can later be previewed in the learner experience.
      </p>
      {resolvedSearchParams?.designLocked === "1" ? (
        <p className="workspace-note">
          Design Handover locked for Build. Build Studio is now open.
        </p>
      ) : null}
      {resolvedSearchParams?.generated === "1" ? (
        <p className="workspace-note">
          Lesson blocks generated from Storyboard.
        </p>
      ) : null}
      {resolvedSearchParams?.added === "1" ? (
        <p className="workspace-note">
          Creator-added block saved with its justification and purpose link.
        </p>
      ) : null}
      {resolvedSearchParams?.edited === "1" ? (
        <p className="workspace-note">
          Lesson block updated. Complete Build checks again before Preview.
        </p>
      ) : null}
      {resolvedSearchParams?.moved === "1" ? (
        <p className="workspace-note">
          Lesson order updated. Complete Build checks again before Preview.
        </p>
      ) : null}
      {resolvedSearchParams?.moved === "none" ? (
        <p className="workspace-note">
          This block is already at that position in the lesson.
        </p>
      ) : null}
      {resolvedSearchParams?.finalTest === "1" ? (
        <p className="workspace-note">
          Final test saved. Complete Build checks again before Preview.
        </p>
      ) : null}
      {resolvedSearchParams?.checked === "1" ? (
        <p className="workspace-note">Build checks completed.</p>
      ) : null}
      {resolvedSearchParams?.error === "checks" ? (
        <p className="workspace-error">
          Complete the required checks before opening Preview:{" "}
          {buildMissingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "add-block" ? (
        <p className="workspace-error">
          Complete the required added-block fields:{" "}
          {rawMissingFields
            .map((field) => creatorAddedBlockFieldLabels[field] || field)
            .join(", ")}
          .
        </p>
      ) : null}
      {resolvedSearchParams?.error === "edit-block" ? (
        <p className="workspace-error">
          Complete the required block content fields:{" "}
          {rawMissingFields
            .map((field) => buildBlockEditFieldLabels[field] || field)
            .join(", ")}
          .
        </p>
      ) : null}
      {resolvedSearchParams?.error === "move-block" ? (
        <p className="workspace-error">
          Choose a valid direction before changing the lesson order.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "final-test" ? (
        <p className="workspace-error">
          Complete the required final test fields:{" "}
          {rawMissingFields
            .map((field) => finalTestAuthoringFieldLabels[field] || field)
            .join(", ")}
          .
        </p>
      ) : null}

      {designHandover ? <DesignSummaryPanel handover={designHandover} /> : null}

      <section className="studio-section" aria-labelledby="build-source-title">
        <h2 id="build-source-title">Storyboard source</h2>
        <div className="context-grid">
          <article>
            <strong>Module</strong>
            <span>{storyboardLesson.moduleName}</span>
          </article>
          <article>
            <strong>Lesson</strong>
            <span>{storyboardLesson.title}</span>
          </article>
          <article>
            <strong>Learner action</strong>
            <span>{storyboardLesson.linkedLearnerAction}</span>
          </article>
          <article>
            <strong>Learning mode</strong>
            <span>{formatLearningMode(storyboardLesson.learningMode)}</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="build-actions-title">
        <h2 id="build-actions-title">Authoring actions</h2>
        <div className="studio-actions">
          <form action={generateAction}>
            <button className="workspace-button" type="submit">
              {hasGeneratedContent
                ? "Regenerate from Storyboard"
                : "Generate lesson blocks"}
            </button>
          </form>
          <Link
            className="workspace-link"
            href={`/studio/courses/${courseId}/storyboard`}
          >
            Review Storyboard
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            My courses
          </Link>
        </div>
      </section>

      {hasGeneratedContent ? (
        <section className="studio-section" aria-labelledby="build-canvas-title">
          <div className="section-heading-row">
            <div>
              <h2 id="build-canvas-title">Lesson build</h2>
              <p className="section-subcopy">
                Build is {formatStepStatus(buildStatus)}. Preview is{" "}
                {formatStepStatus(previewStatus)}.
              </p>
            </div>
          </div>
          <div className="build-studio-layout">
            <aside className="build-structure" aria-label="Lesson structure">
              <h3>Structure</h3>
              {modules.map((module) => (
                <div key={module.id}>
                  <strong>{module.title}</strong>
                  <ol>
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>{lesson.title}</li>
                    ))}
                  </ol>
                </div>
              ))}
              <section className="block-library" aria-labelledby="block-library-title">
                <h3 id="block-library-title">Block library</h3>
                <p>
                  Add optional blocks only when they support the approved Design
                  Handover and a clear learner purpose.
                </p>
                {blockLibrary.map((category) => (
                  <details key={category.label}>
                    <summary>{category.label}</summary>
                    {category.subcategories.map((subcategory) => (
                      <div className="block-library-group" key={subcategory.label}>
                        <strong>{subcategory.label}</strong>
                        <ul>
                          {subcategory.items.map((item) => (
                            <li key={item.id}>
                              <span>{item.label}</span>
                              <small>{item.purpose}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </details>
                ))}
                {getFirstLessonId(modules) ? (
                  <form
                    action={addCreatorBlockAction.bind(
                      null,
                      courseId,
                      getFirstLessonId(modules) as string,
                    )}
                    className="block-library-form"
                  >
                    <h4>Add a creator block</h4>
                    <label>
                      <span>Block type</span>
                      <select name="blockId" required>
                        <option value="">Choose a block</option>
                        {blockLibrary.map((category) => (
                          <optgroup key={category.label} label={category.label}>
                            {category.subcategories.flatMap((subcategory) =>
                              subcategory.items.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.label}
                                </option>
                              )),
                            )}
                          </optgroup>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Block title</span>
                      <input name="title" required />
                    </label>
                    <label>
                      <span>Justification</span>
                      <select name="justification" required>
                        <option value="">Choose a reason</option>
                        {Object.entries(blockJustificationLabels).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <label>
                      <span>Purpose link</span>
                      <textarea
                        name="purposeLink"
                        required
                        defaultValue={storyboardLesson.linkedLearnerAction}
                      />
                    </label>
                    <button className="workspace-button" type="submit">
                      Add block
                    </button>
                  </form>
                ) : null}
              </section>
            </aside>
            <div className="build-canvas">
              {finalTestAction ? (
                <section
                  className="final-test-panel"
                  aria-labelledby="final-test-title"
                >
                  <div>
                    <p className="block-kicker">Assessment</p>
                    <h3 id="final-test-title">Final test</h3>
                    <p>
                      Author the course final test item. The certificate rule
                      remains 80% or above on the final test.
                    </p>
                  </div>
                  <form action={finalTestAction} className="block-edit-form">
                    <label>
                      <span>Assessment purpose</span>
                      <textarea
                        name="purpose"
                        required
                        defaultValue={
                          finalTestContent.purpose ||
                          storyboardLesson.linkedLearnerAction
                        }
                      />
                    </label>
                    <label>
                      <span>Question</span>
                      <textarea
                        name="prompt"
                        required
                        defaultValue={finalTestContent.prompt || ""}
                      />
                    </label>
                    <div className="form-grid">
                      <label>
                        <span>Choice A</span>
                        <input
                          name="choiceA"
                          required
                          defaultValue={finalTestContent.choices?.[0] || ""}
                        />
                      </label>
                      <label>
                        <span>Choice B</span>
                        <input
                          name="choiceB"
                          required
                          defaultValue={finalTestContent.choices?.[1] || ""}
                        />
                      </label>
                      <label>
                        <span>Choice C</span>
                        <input
                          name="choiceC"
                          required
                          defaultValue={finalTestContent.choices?.[2] || ""}
                        />
                      </label>
                      <label>
                        <span>Choice D</span>
                        <input
                          name="choiceD"
                          required
                          defaultValue={finalTestContent.choices?.[3] || ""}
                        />
                      </label>
                    </div>
                    <label>
                      <span>Correct answer</span>
                      <select
                        name="correctAnswer"
                        required
                        defaultValue={finalTestContent.correctAnswer || ""}
                      >
                        <option value="">Choose the correct answer</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </label>
                    <label>
                      <span>Feedback</span>
                      <textarea
                        name="feedback"
                        defaultValue={finalTestContent.feedback || ""}
                      />
                    </label>
                    <label>
                      <span>Accessibility note</span>
                      <textarea
                        name="accessibilityNote"
                        defaultValue={finalTestContent.accessibilityNote || ""}
                      />
                    </label>
                    <button className="workspace-button" type="submit">
                      Save final test
                    </button>
                  </form>
                </section>
              ) : null}
              {modules.flatMap((module) =>
                module.lessons.flatMap((lesson) =>
                  lesson.blocks.map((block, blockIndex) => {
                    const content = parseBuildBlockContent(block.content);
                    const saveBlockAction = saveBuildBlockContentAction.bind(
                      null,
                      courseId,
                      block.id,
                    );
                    const moveBlockUpAction = moveBuildBlockAction.bind(
                      null,
                      courseId,
                      block.id,
                      "up",
                    );
                    const moveBlockDownAction = moveBuildBlockAction.bind(
                      null,
                      courseId,
                      block.id,
                      "down",
                    );
                    const isFirstBlock = blockIndex === 0;
                    const isLastBlock =
                      blockIndex === lesson.blocks.length - 1;

                    return (
                      <article className="build-block" key={block.id}>
                        <div className="block-heading-row">
                          <div>
                            <p className="block-kicker">
                              {block.sortOrder}. {getBlockTypeLabel(block.type)}
                            </p>
                            <p className="block-origin">
                              {block.origin === "CREATOR_ADDED"
                                ? "Creator-added"
                                : "Required from Design"}
                            </p>
                            <h3>{content.title || getBlockTypeLabel(block.type)}</h3>
                            {content.purpose ? <p>{content.purpose}</p> : null}
                          </div>
                          <div
                            className="block-order-controls"
                            aria-label={`Change order for ${
                              content.title || getBlockTypeLabel(block.type)
                            }`}
                          >
                            <form action={moveBlockUpAction}>
                              <button
                                className="workspace-button secondary"
                                type="submit"
                                disabled={isFirstBlock}
                              >
                                Move up
                              </button>
                            </form>
                            <form action={moveBlockDownAction}>
                              <button
                                className="workspace-button secondary"
                                type="submit"
                                disabled={isLastBlock}
                              >
                                Move down
                              </button>
                            </form>
                          </div>
                        </div>
                        {block.origin === "CREATOR_ADDED" ? (
                          <div className="block-content">
                            <strong>Governance</strong>
                            <p>Justification: {block.justification}</p>
                            <p>Purpose link: {block.purposeLink}</p>
                          </div>
                        ) : null}
                        {content.body ? (
                          <div className="block-content">
                            <strong>Content</strong>
                            <p>{content.body}</p>
                          </div>
                        ) : null}
                        {content.prompt ? (
                          <div className="block-content">
                            <strong>Prompt</strong>
                            <p>{content.prompt}</p>
                          </div>
                        ) : null}
                        {content.accessibilityNote ? (
                          <div className="block-content">
                            <strong>Accessibility</strong>
                            <p>{content.accessibilityNote}</p>
                          </div>
                        ) : null}
                        <form
                          action={saveBlockAction}
                          className="block-edit-form"
                        >
                          <h4>Edit learner content</h4>
                          <label>
                            <span>Block title</span>
                            <input
                              name="title"
                              required
                              defaultValue={
                                content.title || getBlockTypeLabel(block.type)
                              }
                            />
                          </label>
                          <label>
                            <span>Purpose</span>
                            <textarea
                              name="purpose"
                              required
                              defaultValue={
                                content.purpose || block.purposeLink
                              }
                            />
                          </label>
                          <label>
                            <span>Content</span>
                            <textarea
                              name="body"
                              defaultValue={content.body || ""}
                            />
                          </label>
                          <label>
                            <span>Prompt</span>
                            <textarea
                              name="prompt"
                              defaultValue={content.prompt || ""}
                            />
                          </label>
                          <label>
                            <span>Feedback</span>
                            <textarea
                              name="feedback"
                              defaultValue={content.feedback || ""}
                            />
                          </label>
                          <label>
                            <span>Accessibility note</span>
                            <textarea
                              name="accessibilityNote"
                              defaultValue={content.accessibilityNote || ""}
                            />
                          </label>
                          <button className="workspace-button" type="submit">
                            Save block
                          </button>
                        </form>
                      </article>
                    );
                  }),
                ),
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="empty-state studio-section">
          <h2>No lesson blocks yet</h2>
          <p>
            Generate lesson blocks to turn the Storyboard into a structured
            learner lesson.
          </p>
        </div>
      )}

      {hasGeneratedContent ? (
        <section className="studio-section" aria-labelledby="build-checks-title">
          <h2 id="build-checks-title">Completion checks</h2>
          {buildStatus === WorkflowStepStatus.COMPLETE ? (
            <div className="next-step-panel">
              <h3>Preview is ready</h3>
              <p>
                Build checks are complete. Open Preview to inspect this lesson
                in a learner-facing shape.
              </p>
              <nav className="workspace-nav" aria-label="Build completed action">
                <Link
                  className="workspace-link primary"
                  href={`/studio/courses/${courseId}/preview`}
                >
                  Open Preview
                </Link>
              </nav>
            </div>
          ) : (
            <form action={completeChecksAction} className="checklist-form">
              <label className="checkbox-row">
                <input name="generatedContentConfirmed" type="checkbox" />
                <span>Generated lesson content exists and is reviewable</span>
              </label>
              <label className="checkbox-row">
                <input name="actionAlignmentConfirmed" type="checkbox" />
                <span>
                  Every block supports the intended learner action from the
                  Storyboard
                </span>
              </label>
              <label className="checkbox-row">
                <input name="mobileReadinessConfirmed" type="checkbox" />
                <span>
                  Content is short enough for mobile and low-bandwidth review
                </span>
              </label>
              <label className="checkbox-row">
                <input name="accessibilityConfirmed" type="checkbox" />
                <span>
                  Content does not depend on audio, images, or color-only cues
                </span>
              </label>
              <label className="checkbox-row">
                <input name="safetyConfirmed" type="checkbox" />
                <span>
                  Safety, local realism, and sensitive-topic risks have been
                  checked
                </span>
              </label>
              {finalTestRequired ? (
                <label className="checkbox-row">
                  <input
                    name="finalTestConfirmed"
                    type="checkbox"
                    disabled={!finalTestReady}
                  />
                  <span>
                    Final test is authored and ready for the 80% pass rule
                  </span>
                </label>
              ) : null}
              <button className="workspace-button" type="submit">
                Complete checks and open Preview
              </button>
            </form>
          )}
        </section>
      ) : null}

      <div className="next-step-panel">
        <h2>Next step: Preview</h2>
        {buildStatus === WorkflowStepStatus.COMPLETE ? (
          <>
            <p>
              Preview is open. Inspect the generated lesson before moving toward
              creator review.
            </p>
            <nav className="workspace-nav" aria-label="Build next step">
              <Link
                className="workspace-link primary"
                href={`/studio/courses/${courseId}/preview`}
              >
                Continue to Preview
              </Link>
            </nav>
          </>
        ) : (
          <p>
            Preview remains closed until the completion checks confirm mobile,
            accessibility, action alignment, and safety readiness.
          </p>
        )}
      </div>
    </WorkspaceShell>
  );
}

function getFirstLessonId(
  modules: readonly {
    lessons: readonly {
      id: string;
    }[];
  }[],
) {
  return modules.flatMap((module) => module.lessons)[0]?.id;
}

function formatLearningMode(mode: string) {
  return mode
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.substring(1))
    .join(" ");
}

function formatStepStatus(status: string | undefined) {
  switch (status) {
    case "COMPLETE":
      return "complete";
    case "IN_PROGRESS":
      return "in progress";
    case "LOCKED":
      return "locked";
    default:
      return "ready";
  }
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

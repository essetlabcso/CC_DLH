import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { completeLearnerLessonAction } from "@/app/(learner)/learn/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { isLessonComplete } from "@/lib/learner/progress";
import { getLearnerLessonNavigation } from "@/lib/learner/course-access";
import {
  getBlockTypeLabel,
  parseBuildBlockContent,
} from "@/lib/studio/build-studio";

type LearnerLessonPageProps = {
  params?: Promise<{
    courseId?: string;
    lessonId?: string;
  }>;
  searchParams?: Promise<{
    completed?: string;
  }>;
};

export default async function LearnerLessonPage({
  params,
  searchParams,
}: LearnerLessonPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;
  const lessonId = resolvedParams?.lessonId;

  if (!courseId || !lessonId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/learn/courses/${courseId}/lessons/${lessonId}`,
  );
  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
      modules: {
        some: {
          lessons: {
            some: {
              id: lessonId,
            },
          },
        },
      },
    },
    include: {
      course: true,
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
              blocks: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!version) {
    notFound();
  }

  const lesson = version.modules
    .flatMap((module) =>
      module.lessons.map((moduleLesson) => ({
        ...moduleLesson,
        moduleTitle: module.title,
      })),
    )
    .find((moduleLesson) => moduleLesson.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const lessonProgress = await prisma.learnerLessonProgress.upsert({
    where: {
      userId_courseVersionId_lessonId: {
        userId: identity.user.id,
        courseVersionId: version.id,
        lessonId,
      },
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      userId: identity.user.id,
      courseVersionId: version.id,
      lessonId,
    },
  });
  const complete = isLessonComplete(lessonProgress);
  const navigation = getLearnerLessonNavigation(version.modules, lessonId);

  return (
    <WorkspaceShell eyebrow={lesson.moduleTitle} title={lesson.title}>
      <p>
        Work through each block in order. The lesson is designed for focused,
        practical application in CSO work.
      </p>

      {resolvedSearchParams?.completed === "1" ? (
        <p className="workspace-note">Lesson marked complete.</p>
      ) : null}

      <section className="studio-section" aria-labelledby="progress-title">
        <h2 id="progress-title">Progress</h2>
        <div className="context-grid">
          <article>
            <strong>Started</strong>
            <span>{lessonProgress.startedAt.toLocaleString()}</span>
          </article>
          <article>
            <strong>Status</strong>
            <span>{complete ? "Complete" : "In progress"}</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="lesson-content-title">
        <h2 id="lesson-content-title">Lesson</h2>
        <div className="learner-preview-shell">
          <article className="preview-lesson">
            <div className="preview-block-list">
              {lesson.blocks.map((block) => {
                const content = parseBuildBlockContent(block.content);

                return (
                  <section className="preview-block" key={block.id}>
                    <p className="preview-block-kind">
                      {getBlockTypeLabel(block.type)}
                    </p>
                    <h3>{content.title || getBlockTypeLabel(block.type)}</h3>
                    {block.type === "FINAL_TEST" ? (
                      <div className="preview-prompt">
                        <strong>Final test preview</strong>
                        <p>
                          Final test assessment is available from the course
                          overview page.
                        </p>
                      </div>
                    ) : (
                      <>
                        {content.body ? <p>{content.body}</p> : null}
                        {content.prompt ? (
                          <div className="preview-prompt">
                            <strong>Question</strong>
                            <p>{content.prompt}</p>
                            {content.choices ? (
                              <ol className="preview-choice-list" type="A">
                                {content.choices.map((choice) => (
                                  <li key={choice}>{choice}</li>
                                ))}
                              </ol>
                            ) : null}
                          </div>
                        ) : null}
                        {content.feedback ? (
                          <div className="preview-prompt">
                            <strong>Feedback</strong>
                            <p>{content.feedback}</p>
                          </div>
                        ) : null}
                      </>
                    )}
                  </section>
                );
              })}
            </div>
          </article>
        </div>
      </section>

      <div className="next-step-panel">
        <h2>{complete ? "Lesson complete" : "Ready to finish"}</h2>
        <p>
          {complete
            ? "Your progress has been saved for this lesson."
            : "Mark this lesson complete when you have reviewed the guidance and practice prompt."}
        </p>
        {!complete ? (
          <form
            action={completeLearnerLessonAction.bind(null, courseId, lessonId)}
            className="studio-actions"
          >
            <button className="workspace-button" type="submit">
              Mark lesson complete
            </button>
          </form>
        ) : null}
      </div>

      <nav className="workspace-nav" aria-label="Lesson actions">
        {navigation.previousLesson ? (
          <Link
            className="workspace-link"
            href={`/learn/courses/${courseId}/lessons/${navigation.previousLesson.lessonId}`}
          >
            Previous lesson
          </Link>
        ) : null}
        {navigation.nextLesson ? (
          <Link
            className="workspace-link primary"
            href={`/learn/courses/${courseId}/lessons/${navigation.nextLesson.lessonId}`}
          >
            Next lesson
          </Link>
        ) : null}
        <Link className="workspace-link" href={`/learn/courses/${courseId}`}>
          Course overview
        </Link>
        <Link className="workspace-link" href="/learn">
          My learning
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

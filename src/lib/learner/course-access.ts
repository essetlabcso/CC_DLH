export type LearnerCourseModule = {
  id: string;
  title: string;
  sortOrder: number;
  lessons: {
    id: string;
    title: string;
    sortOrder: number;
    blocks: readonly unknown[];
  }[];
};

export function getFirstLearnerLesson(
  modules: readonly LearnerCourseModule[],
) {
  return modules
    .flatMap((module) =>
      module.lessons.map((lesson) => ({
        moduleId: module.id,
        moduleTitle: module.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        moduleOrder: module.sortOrder,
        lessonOrder: lesson.sortOrder,
      })),
    )
    .sort(
      (left, right) =>
        left.moduleOrder - right.moduleOrder ||
        left.lessonOrder - right.lessonOrder,
    )[0];
}

export function countLearnerCourseBlocks(
  modules: readonly LearnerCourseModule[],
) {
  return modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.blocks.length,
        0,
      ),
    0,
  );
}

export function formatLearnerCourseDuration(
  modules: readonly LearnerCourseModule[],
) {
  const lessonCount = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  if (lessonCount === 0) {
    return "No lessons available";
  }

  return lessonCount === 1 ? "1 lesson" : `${lessonCount} lessons`;
}

export function getLearnerLessonNavigation(
  modules: readonly LearnerCourseModule[],
  currentLessonId: string,
) {
  const allLessons = modules
    .flatMap((module) =>
      module.lessons.map((lesson) => ({
        moduleId: module.id,
        moduleTitle: module.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        moduleOrder: module.sortOrder,
        lessonOrder: lesson.sortOrder,
      })),
    )
    .sort(
      (left, right) =>
        left.moduleOrder - right.moduleOrder ||
        left.lessonOrder - right.lessonOrder,
    );

  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.lessonId === currentLessonId,
  );

  if (currentIndex === -1) {
    return { previousLesson: undefined, nextLesson: undefined };
  }

  return {
    previousLesson: currentIndex > 0 ? allLessons[currentIndex - 1] : undefined,
    nextLesson:
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : undefined,
  };
}

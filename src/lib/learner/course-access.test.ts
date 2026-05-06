import { describe, expect, it } from "vitest";

import {
  countLearnerCourseBlocks,
  formatLearnerCourseDuration,
  getFirstLearnerLesson,
  getLearnerLessonNavigation,
  type LearnerCourseModule,
} from "./course-access";

const modules: LearnerCourseModule[] = [
  {
    id: "module-2",
    title: "Second module",
    sortOrder: 2,
    lessons: [
      {
        id: "lesson-2",
        title: "Second lesson",
        sortOrder: 1,
        blocks: [{}, {}],
      },
    ],
  },
  {
    id: "module-1",
    title: "First module",
    sortOrder: 1,
    lessons: [
      {
        id: "lesson-1",
        title: "First lesson",
        sortOrder: 1,
        blocks: [{}],
      },
    ],
  },
];

describe("learner course access helpers", () => {
  it("finds the first lesson by module and lesson order", () => {
    expect(getFirstLearnerLesson(modules)).toMatchObject({
      moduleId: "module-1",
      moduleTitle: "First module",
      lessonId: "lesson-1",
      lessonTitle: "First lesson",
    });
  });

  it("counts learner-facing blocks across the course", () => {
    expect(countLearnerCourseBlocks(modules)).toBe(3);
  });

  it("formats the visible lesson count", () => {
    expect(formatLearnerCourseDuration(modules)).toBe("2 lessons");
    expect(formatLearnerCourseDuration([])).toBe("No lessons available");
  });

  it("calculates previous and next lesson navigation", () => {
    expect(getLearnerLessonNavigation(modules, "lesson-1")).toMatchObject({
      previousLesson: undefined,
      nextLesson: {
        lessonId: "lesson-2",
        lessonTitle: "Second lesson",
        moduleId: "module-2",
        moduleTitle: "Second module",
      },
    });

    expect(getLearnerLessonNavigation(modules, "lesson-2")).toMatchObject({
      previousLesson: {
        lessonId: "lesson-1",
        lessonTitle: "First lesson",
        moduleId: "module-1",
        moduleTitle: "First module",
      },
      nextLesson: undefined,
    });

    expect(getLearnerLessonNavigation(modules, "unknown")).toMatchObject({
      previousLesson: undefined,
      nextLesson: undefined,
    });
  });
});

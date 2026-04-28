import { describe, expect, it } from "vitest";

import { buildLearnerProgressSummary, isLessonComplete } from "./progress";

describe("learner progress helpers", () => {
  it("summarizes completion as a percentage", () => {
    expect(buildLearnerProgressSummary(4, 2, 1)).toMatchObject({
      totalLessons: 4,
      startedLessons: 2,
      completedLessons: 1,
      percentComplete: 25,
      label: "25% complete",
    });
  });

  it("labels complete courses clearly", () => {
    expect(buildLearnerProgressSummary(1, 1, 1)).toMatchObject({
      percentComplete: 100,
      label: "Complete",
    });
  });

  it("keeps empty courses readable", () => {
    expect(buildLearnerProgressSummary(0, 2, 2)).toMatchObject({
      totalLessons: 0,
      startedLessons: 0,
      completedLessons: 0,
      percentComplete: 0,
      label: "No lessons available",
    });
  });

  it("recognizes completed lesson progress", () => {
    expect(isLessonComplete({ completedAt: new Date() })).toBe(true);
    expect(isLessonComplete({ completedAt: null })).toBe(false);
    expect(isLessonComplete(null)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildMonitoringCapacityGroups,
  buildMonitoringCourseSummary,
  buildMonitoringEvidenceSnapshot,
  filterMonitoringCourseSignals,
  getMonitoringFilterOptions,
  getMonitoringStatusLabel,
} from "./monitoring";

describe("monitoring helpers", () => {
  it("summarizes course-level learner activity without learner detail", () => {
    const summary = buildMonitoringCourseSummary({
      totalLessons: 2,
      progressRecords: [
        {
          userId: "learner-1",
          completedAt: new Date(),
        },
        {
          userId: "learner-1",
          completedAt: new Date(),
        },
        {
          userId: "learner-2",
          completedAt: null,
        },
      ],
      finalTestAttempts: [
        {
          userId: "learner-1",
          scorePercent: 100,
          passed: true,
          submittedAt: new Date("2026-04-26T00:00:00Z"),
        },
        {
          userId: "learner-2",
          scorePercent: 0,
          passed: false,
          submittedAt: new Date("2026-04-26T00:00:00Z"),
        },
        {
          userId: "learner-2",
          scorePercent: 100,
          passed: true,
          submittedAt: new Date("2026-04-27T00:00:00Z"),
        },
      ],
    });

    expect(summary).toMatchObject({
      totalLessons: 2,
      learnersStarted: 2,
      learnersCompleted: 1,
      lessonStarts: 3,
      lessonCompletions: 2,
      completionRate: 50,
      finalTestAttempts: 3,
      finalTestLearners: 2,
      finalTestPasses: 2,
      finalTestPassRate: 100,
      finalTestAverageScore: 100,
      statusLabel: "Learning in progress",
    });
  });

  it("keeps empty activity readable", () => {
    expect(
      buildMonitoringCourseSummary({
        totalLessons: 1,
        progressRecords: [],
      }),
    ).toMatchObject({
      learnersStarted: 0,
      learnersCompleted: 0,
      completionRate: 0,
      finalTestAttempts: 0,
      finalTestPassRate: 0,
      finalTestAverageScore: 0,
      statusLabel: "No learner activity yet",
    });
  });

  it("uses clear monitoring status labels", () => {
    expect(getMonitoringStatusLabel(0, 0)).toBe("No learner activity yet");
    expect(getMonitoringStatusLabel(3, 0)).toBe("Started, not completed");
    expect(getMonitoringStatusLabel(3, 50)).toBe("Learning in progress");
    expect(getMonitoringStatusLabel(3, 100)).toBe("Strong completion signal");
  });

  it("groups monitoring signals by capacity area and linked standard", () => {
    const groups = buildMonitoringCapacityGroups([
      {
        capacityArea: "Safeguarding",
        linkedStandard: "CHS",
        summary: {
          totalLessons: 2,
          learnersStarted: 2,
          learnersCompleted: 1,
          lessonStarts: 4,
          lessonCompletions: 2,
          completionRate: 50,
          finalTestAttempts: 3,
          finalTestLearners: 2,
          finalTestPasses: 1,
          finalTestPassRate: 50,
          finalTestAverageScore: 50,
          statusLabel: "Learning in progress",
        },
      },
      {
        capacityArea: "Safeguarding",
        linkedStandard: "CHS",
        summary: {
          totalLessons: 1,
          learnersStarted: 1,
          learnersCompleted: 1,
          lessonStarts: 1,
          lessonCompletions: 1,
          completionRate: 100,
          finalTestAttempts: 1,
          finalTestLearners: 1,
          finalTestPasses: 1,
          finalTestPassRate: 100,
          finalTestAverageScore: 100,
          statusLabel: "Strong completion signal",
        },
      },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      capacityArea: "Safeguarding",
      linkedStandard: "CHS",
      courseCount: 2,
      learnersStarted: 3,
      finalTestAttempts: 4,
      finalTestPassRate: 67,
      finalTestAverageScore: 75,
    });
  });

  it("filters monitoring signals and exposes filter options", () => {
    const signals = [
      {
        capacityArea: "Safeguarding",
        linkedStandard: "CHS",
        summary: buildMonitoringCourseSummary({
          totalLessons: 1,
          progressRecords: [],
        }),
      },
      {
        capacityArea: "Finance",
        linkedStandard: "Local policy",
        summary: buildMonitoringCourseSummary({
          totalLessons: 1,
          progressRecords: [],
        }),
      },
    ];

    expect(
      filterMonitoringCourseSignals(signals, {
        capacityArea: "Safeguarding",
      }),
    ).toHaveLength(1);
    expect(getMonitoringFilterOptions(signals)).toEqual({
      capacityAreas: ["Finance", "Safeguarding"],
      linkedStandards: ["CHS", "Local policy"],
    });
  });

  it("builds an aggregate evidence snapshot without learner-level rows", () => {
    const signals = [
      {
        capacityArea: "Safeguarding",
        linkedStandard: "CHS",
        summary: {
          totalLessons: 2,
          learnersStarted: 2,
          learnersCompleted: 1,
          lessonStarts: 4,
          lessonCompletions: 2,
          completionRate: 50,
          finalTestAttempts: 2,
          finalTestLearners: 2,
          finalTestPasses: 1,
          finalTestPassRate: 50,
          finalTestAverageScore: 50,
          statusLabel: "Learning in progress",
        },
      },
      {
        capacityArea: "Finance",
        linkedStandard: "Local policy",
        summary: {
          totalLessons: 1,
          learnersStarted: 1,
          learnersCompleted: 1,
          lessonStarts: 1,
          lessonCompletions: 1,
          completionRate: 100,
          finalTestAttempts: 1,
          finalTestLearners: 1,
          finalTestPasses: 1,
          finalTestPassRate: 100,
          finalTestAverageScore: 100,
          statusLabel: "Strong completion signal",
        },
      },
    ];

    expect(buildMonitoringEvidenceSnapshot(signals)).toMatchObject({
      courseCount: 2,
      learnersStarted: 3,
      averageCompletionRate: 75,
      finalTestAttempts: 3,
      finalTestPassRate: 67,
      finalTestAverageScore: 75,
    });
  });
});

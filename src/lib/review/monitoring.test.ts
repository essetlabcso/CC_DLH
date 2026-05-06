import { describe, expect, it } from "vitest";
import { 
  buildMonitoringCourseSummary, 
  buildMonitoringEvidenceSnapshot,
  MonitoringCourseSignal 
} from "./monitoring";

describe("monitoring aggregation logic", () => {
  it("calculates basic progress and test metrics correctly", () => {
    const input = {
      totalLessons: 2,
      progressRecords: [
        { userId: "user-1", completedAt: new Date() }, // Lesson 1
        { userId: "user-1", completedAt: new Date() }, // Lesson 2 (user-1 completed)
        { userId: "user-2", completedAt: new Date() }, // Lesson 1 (user-2 in progress)
      ],
      finalTestAttempts: [
        { userId: "user-1", scorePercent: 85, passed: true, submittedAt: new Date() },
        { userId: "user-2", scorePercent: 40, passed: false, submittedAt: new Date() },
      ],
    };

    const summary = buildMonitoringCourseSummary(input);

    expect(summary.learnersStarted).toBe(2);
    expect(summary.learnersCompleted).toBe(1);
    expect(summary.completionRate).toBe(75); // (3 lesson completions / 4 possible) * 100
    expect(summary.finalTestPasses).toBe(1);
    expect(summary.finalTestPassRate).toBe(50);
  });

  it("aggregates evidence metrics correctly in course summary", () => {
    const summary = buildMonitoringCourseSummary({
      totalLessons: 1,
      progressRecords: [],
      certificateCount: 5,
      proofSubmissionCount: 10,
      verifiedAchievementCount: 2,
    });

    expect(summary.certificateCount).toBe(5);
    expect(summary.proofSubmissionCount).toBe(10);
    expect(summary.verifiedAchievementCount).toBe(2);
  });

  it("aggregates evidence metrics correctly in evidence snapshot", () => {
    const signals: MonitoringCourseSignal[] = [
      {
        capacityArea: "A",
        summary: buildMonitoringCourseSummary({
          totalLessons: 1,
          progressRecords: [],
          certificateCount: 5,
          proofSubmissionCount: 3,
        }),
      },
      {
        capacityArea: "A",
        summary: buildMonitoringCourseSummary({
          totalLessons: 1,
          progressRecords: [],
          certificateCount: 2,
          verifiedAchievementCount: 1,
        }),
      },
    ];

    const snapshot = buildMonitoringEvidenceSnapshot(signals);
    expect(snapshot.certificateCount).toBe(7);
    expect(snapshot.proofSubmissionCount).toBe(3);
    expect(snapshot.verifiedAchievementCount).toBe(1);
  });

  it("incorporates certificates and proofs into summary", () => {
    const input = {
      totalLessons: 1,
      progressRecords: [],
      certificateCount: 15,
      proofSubmissionCount: 5,
      verifiedAchievementCount: 3,
    };

    const summary = buildMonitoringCourseSummary(input);

    expect(summary.certificateCount).toBe(15);
    expect(summary.proofSubmissionCount).toBe(5);
    expect(summary.verifiedAchievementCount).toBe(3);
  });

  it("uses the best final test attempt per learner", () => {
    const input = {
      totalLessons: 1,
      progressRecords: [{ userId: "user-1", completedAt: new Date() }],
      finalTestAttempts: [
        { userId: "user-1", scorePercent: 50, passed: false, submittedAt: new Date(2026, 1, 1) },
        { userId: "user-1", scorePercent: 90, passed: true, submittedAt: new Date(2026, 1, 2) },
      ],
    };

    const summary = buildMonitoringCourseSummary(input);

    expect(summary.finalTestLearners).toBe(1);
    expect(summary.finalTestPasses).toBe(1);
    expect(summary.finalTestAverageScore).toBe(90);
  });
  
  it("correctly calculates pass rate for 80% rule implicitly via test attempt flags", () => {
    const input = {
      totalLessons: 1,
      progressRecords: [],
      finalTestAttempts: [
        { userId: "user-1", scorePercent: 80, passed: true, submittedAt: new Date() },
        { userId: "user-2", scorePercent: 79, passed: false, submittedAt: new Date() },
      ],
    };

    const summary = buildMonitoringCourseSummary(input);

    expect(summary.finalTestPasses).toBe(1);
    expect(summary.finalTestPassRate).toBe(50);
  });
});

export type MonitoringProgressRecord = {
  userId: string;
  completedAt: Date | null;
};

export type MonitoringFinalTestAttempt = {
  userId: string;
  scorePercent: number;
  passed: boolean;
  submittedAt: Date;
};

export type MonitoringCourseInput = {
  totalLessons: number;
  progressRecords: readonly MonitoringProgressRecord[];
  finalTestAttempts?: readonly MonitoringFinalTestAttempt[];
};

export type MonitoringCourseSummary = {
  totalLessons: number;
  learnersStarted: number;
  learnersCompleted: number;
  lessonStarts: number;
  lessonCompletions: number;
  completionRate: number;
  finalTestAttempts: number;
  finalTestLearners: number;
  finalTestPasses: number;
  finalTestPassRate: number;
  finalTestAverageScore: number;
  statusLabel: string;
};

export type MonitoringCourseSignal = {
  capacityArea?: string | null;
  linkedStandard?: string | null;
  summary: MonitoringCourseSummary;
};

export type MonitoringFilterInput = {
  capacityArea?: string;
  linkedStandard?: string;
};

export type MonitoringCapacityGroup = {
  key: string;
  capacityArea: string;
  linkedStandard: string;
  courseCount: number;
  learnersStarted: number;
  learnersCompleted: number;
  averageCompletionRate: number;
  finalTestAttempts: number;
  finalTestLearners: number;
  finalTestPasses: number;
  finalTestPassRate: number;
  finalTestAverageScore: number;
};

export type MonitoringEvidenceSnapshot = {
  courseCount: number;
  learnersStarted: number;
  learnersCompleted: number;
  averageCompletionRate: number;
  finalTestAttempts: number;
  finalTestLearners: number;
  finalTestPasses: number;
  finalTestPassRate: number;
  finalTestAverageScore: number;
  capacityGroups: MonitoringCapacityGroup[];
};

export function buildMonitoringCourseSummary({
  totalLessons,
  progressRecords,
  finalTestAttempts = [],
}: MonitoringCourseInput): MonitoringCourseSummary {
  const safeTotalLessons = Math.max(totalLessons, 0);
  const startedLearners = new Set(
    progressRecords.map((progress) => progress.userId),
  );
  const completionsByLearner = new Map<string, number>();

  for (const progress of progressRecords) {
    if (!progress.completedAt) {
      continue;
    }

    completionsByLearner.set(
      progress.userId,
      (completionsByLearner.get(progress.userId) || 0) + 1,
    );
  }

  const learnersCompleted =
    safeTotalLessons === 0
      ? 0
      : Array.from(completionsByLearner.values()).filter(
          (completedLessons) => completedLessons >= safeTotalLessons,
        ).length;
  const lessonCompletions = progressRecords.filter(
    (progress) => progress.completedAt,
  ).length;
  const possibleCompletions = startedLearners.size * safeTotalLessons;
  const completionRate =
    possibleCompletions === 0
      ? 0
      : Math.round((lessonCompletions / possibleCompletions) * 100);
  const bestAttemptsByLearner = getBestFinalTestAttemptsByLearner(
    finalTestAttempts,
  );
  const bestAttempts = Array.from(bestAttemptsByLearner.values());
  const finalTestPasses = bestAttempts.filter((attempt) => attempt.passed).length;
  const finalTestPassRate =
    bestAttempts.length === 0
      ? 0
      : Math.round((finalTestPasses / bestAttempts.length) * 100);
  const finalTestAverageScore =
    bestAttempts.length === 0
      ? 0
      : Math.round(
          bestAttempts.reduce(
            (total, attempt) => total + attempt.scorePercent,
            0,
          ) / bestAttempts.length,
        );

  return {
    totalLessons: safeTotalLessons,
    learnersStarted: startedLearners.size,
    learnersCompleted,
    lessonStarts: progressRecords.length,
    lessonCompletions,
    completionRate,
    finalTestAttempts: finalTestAttempts.length,
    finalTestLearners: bestAttempts.length,
    finalTestPasses,
    finalTestPassRate,
    finalTestAverageScore,
    statusLabel: getMonitoringStatusLabel(startedLearners.size, completionRate),
  };
}

export function buildMonitoringEvidenceSnapshot(
  signals: readonly MonitoringCourseSignal[],
): MonitoringEvidenceSnapshot {
  const finalTestLearners = sumGroupMetric(signals, "finalTestLearners");
  const finalTestPasses = sumGroupMetric(signals, "finalTestPasses");

  return {
    courseCount: signals.length,
    learnersStarted: sumGroupMetric(signals, "learnersStarted"),
    learnersCompleted: sumGroupMetric(signals, "learnersCompleted"),
    averageCompletionRate: averageGroupMetric(signals, "completionRate"),
    finalTestAttempts: sumGroupMetric(signals, "finalTestAttempts"),
    finalTestLearners,
    finalTestPasses,
    finalTestPassRate:
      finalTestLearners === 0
        ? 0
        : Math.round((finalTestPasses / finalTestLearners) * 100),
    finalTestAverageScore: averageGroupMetric(
      signals,
      "finalTestAverageScore",
    ),
    capacityGroups: buildMonitoringCapacityGroups(signals),
  };
}

export function filterMonitoringCourseSignals<TSignal extends MonitoringCourseSignal>(
  signals: readonly TSignal[],
  filters: MonitoringFilterInput,
) {
  const capacityArea = normalizeFilterValue(filters.capacityArea);
  const linkedStandard = normalizeFilterValue(filters.linkedStandard);

  return signals.filter((signal) => {
    return (
      (!capacityArea ||
        normalizeFilterValue(signal.capacityArea) === capacityArea) &&
      (!linkedStandard ||
        normalizeFilterValue(signal.linkedStandard) === linkedStandard)
    );
  });
}

export function buildMonitoringCapacityGroups(
  signals: readonly MonitoringCourseSignal[],
): MonitoringCapacityGroup[] {
  const groups = new Map<string, MonitoringCourseSignal[]>();

  for (const signal of signals) {
    const capacityArea = getMonitoringDimensionLabel(
      signal.capacityArea,
      "Unmapped capacity area",
    );
    const linkedStandard = getMonitoringDimensionLabel(
      signal.linkedStandard,
      "No linked standard",
    );
    const key = `${capacityArea}::${linkedStandard}`;
    const existing = groups.get(key) || [];

    existing.push(signal);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .map(([key, groupSignals]) => {
      const courseCount = groupSignals.length;
      const finalTestLearners = sumGroupMetric(
        groupSignals,
        "finalTestLearners",
      );
      const finalTestPasses = sumGroupMetric(groupSignals, "finalTestPasses");

      return {
        key,
        capacityArea: key.split("::")[0],
        linkedStandard: key.split("::")[1],
        courseCount,
        learnersStarted: sumGroupMetric(groupSignals, "learnersStarted"),
        learnersCompleted: sumGroupMetric(groupSignals, "learnersCompleted"),
        averageCompletionRate: averageGroupMetric(
          groupSignals,
          "completionRate",
        ),
        finalTestAttempts: sumGroupMetric(groupSignals, "finalTestAttempts"),
        finalTestLearners,
        finalTestPasses,
        finalTestPassRate:
          finalTestLearners === 0
            ? 0
            : Math.round((finalTestPasses / finalTestLearners) * 100),
        finalTestAverageScore: averageGroupMetric(
          groupSignals,
          "finalTestAverageScore",
        ),
      };
    })
    .sort(
      (left, right) =>
        right.courseCount - left.courseCount ||
        left.capacityArea.localeCompare(right.capacityArea) ||
        left.linkedStandard.localeCompare(right.linkedStandard),
    );
}

export function getMonitoringFilterOptions(
  signals: readonly MonitoringCourseSignal[],
) {
  return {
    capacityAreas: getUniqueSortedOptions(
      signals.map((signal) => signal.capacityArea),
    ),
    linkedStandards: getUniqueSortedOptions(
      signals.map((signal) => signal.linkedStandard),
    ),
  };
}

export function getMonitoringStatusLabel(
  learnersStarted: number,
  completionRate: number,
) {
  if (learnersStarted === 0) {
    return "No learner activity yet";
  }

  if (completionRate >= 80) {
    return "Strong completion signal";
  }

  if (completionRate > 0) {
    return "Learning in progress";
  }

  return "Started, not completed";
}

function normalizeFilterValue(value: string | null | undefined) {
  return value?.trim() || "";
}

function getMonitoringDimensionLabel(
  value: string | null | undefined,
  fallback: string,
) {
  return normalizeFilterValue(value) || fallback;
}

function getUniqueSortedOptions(values: readonly (string | null | undefined)[]) {
  return Array.from(
    new Set(values.map((value) => normalizeFilterValue(value)).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));
}

function sumGroupMetric(
  signals: readonly MonitoringCourseSignal[],
  field: keyof Pick<
    MonitoringCourseSummary,
    | "learnersStarted"
    | "learnersCompleted"
    | "finalTestAttempts"
    | "finalTestLearners"
    | "finalTestPasses"
  >,
) {
  return signals.reduce((total, signal) => total + signal.summary[field], 0);
}

function averageGroupMetric(
  signals: readonly MonitoringCourseSignal[],
  field: keyof Pick<
    MonitoringCourseSummary,
    "completionRate" | "finalTestAverageScore"
  >,
) {
  return signals.length === 0
    ? 0
    : Math.round(
        signals.reduce((total, signal) => total + signal.summary[field], 0) /
          signals.length,
      );
}

function getBestFinalTestAttemptsByLearner(
  attempts: readonly MonitoringFinalTestAttempt[],
) {
  const bestAttempts = new Map<string, MonitoringFinalTestAttempt>();

  for (const attempt of attempts) {
    const existing = bestAttempts.get(attempt.userId);

    if (
      !existing ||
      attempt.scorePercent > existing.scorePercent ||
      (attempt.scorePercent === existing.scorePercent &&
        attempt.submittedAt.getTime() > existing.submittedAt.getTime())
    ) {
      bestAttempts.set(attempt.userId, attempt);
    }
  }

  return bestAttempts;
}

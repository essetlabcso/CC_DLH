export type LearnerProgressSummary = {
  totalLessons: number;
  startedLessons: number;
  completedLessons: number;
  percentComplete: number;
  label: string;
};

export function buildLearnerProgressSummary(
  totalLessons: number,
  startedLessons: number,
  completedLessons: number,
): LearnerProgressSummary {
  const safeTotal = Math.max(totalLessons, 0);
  const safeStarted = clampCount(startedLessons, safeTotal);
  const safeCompleted = clampCount(completedLessons, safeTotal);
  const percentComplete =
    safeTotal === 0 ? 0 : Math.round((safeCompleted / safeTotal) * 100);

  return {
    totalLessons: safeTotal,
    startedLessons: safeStarted,
    completedLessons: safeCompleted,
    percentComplete,
    label: buildProgressLabel(safeTotal, safeCompleted, percentComplete),
  };
}

export function isLessonComplete(
  progress:
    | {
        completedAt: Date | null;
      }
    | null
    | undefined,
) {
  return Boolean(progress?.completedAt);
}

function buildProgressLabel(
  totalLessons: number,
  completedLessons: number,
  percentComplete: number,
) {
  if (totalLessons === 0) {
    return "No lessons available";
  }

  if (completedLessons === 0) {
    return "Not started";
  }

  if (completedLessons === totalLessons) {
    return "Complete";
  }

  return `${percentComplete}% complete`;
}

function clampCount(value: number, max: number) {
  return Math.min(Math.max(value, 0), max);
}

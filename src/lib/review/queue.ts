import { CourseVersionStatus } from "@prisma/client";

export type ReviewQueueItem = {
  courseTitle: string;
  versionNumber: number;
  sourceVersionId?: string | null;
  submittedAt: Date | null;
  creatorName: string;
  blockCount: number;
};

export function getReviewQueueStatusLabel(
  status: CourseVersionStatus,
  checklist?: string | null,
) {
  if (status === CourseVersionStatus.SUBMITTED && checklist) {
    try {
      const parsed = JSON.parse(checklist);
      if (parsed.reviewerReview?.specialistReviewRequired) {
        return "Specialist review pending";
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (status === CourseVersionStatus.RETURNED && checklist) {
    try {
      const parsed = JSON.parse(checklist);
      const decisionType = parsed.reviewerReview?.decisionType;

      if (decisionType === "not-approved-pause") {
        return "Paused / Not Approved";
      }

      if (decisionType === "return-to-analysis") {
        return "Returned to Analysis";
      }

      if (decisionType === "return-to-design") {
        return "Returned to Design";
      }

      if (decisionType === "return-to-build") {
        return "Returned to Build";
      }
    } catch {
      // Ignore parse errors
    }
  }

  switch (status) {
    case CourseVersionStatus.SUBMITTED:
      return "Submitted for review";
    case CourseVersionStatus.RETURNED:
      return "Returned for changes";
    case CourseVersionStatus.APPROVED:
      return "Approved";
    case CourseVersionStatus.PUBLISHED:
      return "Published";
    default:
      return "Not in review";
  }
}

export function countReviewBlocks(
  modules: readonly {
    lessons: readonly {
      blocks: readonly unknown[];
    }[];
  }[],
) {
  return modules.reduce(
    (moduleTotal, module) =>
      moduleTotal +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.blocks.length,
        0,
      ),
    0,
  );
}

export function formatSubmittedDate(submittedAt: Date | null) {
  if (!submittedAt) {
    return "Submission time not recorded";
  }

  return submittedAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getReviewVersionTypeLabel(version: {
  sourceVersionId?: string | null;
}) {
  return version.sourceVersionId ? "Revision version" : "New course version";
}

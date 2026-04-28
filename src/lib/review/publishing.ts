import { CourseVersionStatus } from "@prisma/client";

export type PublishableVersionSummary = {
  modules: readonly {
    lessons: readonly unknown[];
  }[];
};

export function getPublishingStatusLabel(status: CourseVersionStatus) {
  switch (status) {
    case CourseVersionStatus.APPROVED:
      return "Approved for publishing";
    case CourseVersionStatus.PUBLISHED:
      return "Published";
    case CourseVersionStatus.REPLACED:
      return "Replaced by a newer version";
    default:
      return "Not ready for publishing";
  }
}

export function countPublishableLessons(version: PublishableVersionSummary) {
  return version.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
}

export function formatPublishedDate(publishedAt: Date | null) {
  if (!publishedAt) {
    return "Publication time not recorded";
  }

  return publishedAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getPublishingVersionTypeLabel(version: {
  sourceVersionId?: string | null;
}) {
  return version.sourceVersionId ? "Revision version" : "New course version";
}

export function summarizePublication(
  courseTitle: string,
  versionNumber: number,
  options: {
    isRevision?: boolean;
  } = {},
) {
  if (options.isRevision) {
    return `Published revised ${courseTitle} version ${versionNumber} for learner discovery.`;
  }

  return `Published ${courseTitle} version ${versionNumber} for learner discovery.`;
}

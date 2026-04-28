import { CourseVersionStatus } from "@prisma/client";

import type { BuildToReviewHandover } from "@/lib/studio/build-review-handover";

export const publishCertificateRule =
  "80%+ final test score = pass and automated course certificate";

export type PublishableVersionSummary = {
  modules: readonly {
    lessons: readonly unknown[];
  }[];
};

export type PublishReadinessCheck = {
  key: string;
  label: string;
  ready: boolean;
  detail: string;
};

export type PublishReadiness = {
  ready: boolean;
  certificateRule: typeof publishCertificateRule;
  learnerVisibilityDefault: string;
  checks: PublishReadinessCheck[];
  blockers: PublishReadinessCheck[];
  warnings: PublishReadinessCheck[];
  summary: string;
  generatedAt: string;
};

export type PublicationRecord = {
  publishedAt: string;
  publishedById: string;
  courseId: string;
  courseVersionId: string;
  versionNumber: number;
  releaseType: "publish-now";
  visibility: string;
  enrollment: string;
  certificateRule: typeof publishCertificateRule;
  readinessSummary: string;
};

export type PublishReadinessVersion = {
  id?: string;
  versionNumber?: number;
  status: CourseVersionStatus;
  sourceVersionId?: string | null;
  course: {
    id?: string;
    title: string;
  };
  setup?: {
    summary?: string | null;
    primaryLearnerGroup?: string | null;
    language?: string | null;
    formatAndTime?: string | null;
    level?: string | null;
    capacityArea?: string | null;
    certificateIntent?: string | null;
  } | null;
  reviewRecord?: {
    checklist: string | null;
  } | null;
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

export function buildPublishReadiness(
  version: PublishReadinessVersion,
  options: {
    generatedAt?: Date;
  } = {},
): PublishReadiness {
  const checklist = parseChecklist(version.reviewRecord?.checklist);
  const reviewerReview = getObject(checklist.reviewerReview);
  const handover = getObject(
    checklist.buildToReviewHandover,
  ) as BuildToReviewHandover | null;
  const certificateIntentActive = hasCertificateIntent(
    version.setup?.certificateIntent,
  );
  const requiredMetadata = [
    {
      key: "title",
      label: "Course title",
      value: version.course.title,
    },
    {
      key: "summary",
      label: "Short description",
      value: version.setup?.summary,
    },
    {
      key: "targetLearners",
      label: "Target learners",
      value: version.setup?.primaryLearnerGroup,
    },
    {
      key: "capacityArea",
      label: "Capacity area",
      value: version.setup?.capacityArea,
    },
    {
      key: "language",
      label: "Language",
      value: version.setup?.language,
    },
    {
      key: "duration",
      label: "Estimated duration",
      value: version.setup?.formatAndTime,
    },
  ];
  const metadataMissing = requiredMetadata.filter(
    (field) => !field.value?.trim(),
  );
  const checks: PublishReadinessCheck[] = [
    {
      key: "approved-status",
      label: "Approved version state",
      ready: version.status === CourseVersionStatus.APPROVED,
      detail:
        version.status === CourseVersionStatus.APPROVED
          ? "Course version is approved for publishing."
          : "Only approved course versions can be published.",
    },
    {
      key: "review-record",
      label: "Review record",
      ready: Boolean(version.reviewRecord?.checklist),
      detail: version.reviewRecord?.checklist
        ? "Course Review Record is present."
        : "Course Review Record is missing.",
    },
    {
      key: "review-decision",
      label: "Review decision",
      ready: reviewerReview?.decisionType === "approve-for-publish",
      detail:
        reviewerReview?.decisionType === "approve-for-publish"
          ? "Review decision is Approved for Publish readiness."
          : "Review decision is not Approved for Publish readiness.",
    },
    {
      key: "specialist-review",
      label: "Specialist review",
      ready:
        reviewerReview?.specialistReviewRequired !== true &&
        reviewerReview?.decisionType !== "specialist-review-required",
      detail:
        reviewerReview?.specialistReviewRequired === true ||
        reviewerReview?.decisionType === "specialist-review-required"
          ? "Specialist review remains unresolved."
          : "No unresolved specialist review is recorded.",
    },
    {
      key: "certificate-rule",
      label: "Certificate rule",
      ready:
        reviewerReview?.certificateRuleConfirmed === true &&
        reviewerReview?.certificateRule === publishCertificateRule,
      detail:
        reviewerReview?.certificateRuleConfirmed === true &&
        reviewerReview?.certificateRule === publishCertificateRule
          ? publishCertificateRule
          : "Review must confirm the 80%+ final test certificate rule.",
    },
    {
      key: "final-test",
      label: "Final test readiness",
      ready:
        !certificateIntentActive ||
        Boolean(handover?.finalTest?.required && handover.finalTest.ready),
      detail:
        !certificateIntentActive
          ? "No certificate intent recorded for this course."
          : handover?.finalTest?.required && handover.finalTest.ready
            ? "Final test is ready for a certifying course."
            : "Final test readiness is missing for a certifying course.",
    },
    {
      key: "accessibility",
      label: "Accessibility readiness",
      ready: handover?.accessibility?.blocksMissingNotes === 0,
      detail:
        handover?.accessibility?.blocksMissingNotes === 0
          ? "Block-level accessibility notes are present."
          : "Accessibility readiness needs reviewer or publisher attention.",
    },
    {
      key: "safeguarding",
      label: "Safeguarding readiness",
      ready: handover?.safeguarding?.blocksMissingNotes === 0,
      detail:
        handover?.safeguarding?.blocksMissingNotes === 0
          ? "Block-level safeguarding notes are present."
          : "Safeguarding readiness needs reviewer or publisher attention.",
    },
    {
      key: "preview",
      label: "Learner preview",
      ready: handover?.preview?.completed === true,
      detail:
        handover?.preview?.completed === true
          ? "Learner preview was completed."
          : "Learner preview completion is missing.",
    },
    {
      key: "metadata",
      label: "Publication metadata",
      ready: metadataMissing.length === 0,
      detail:
        metadataMissing.length === 0
          ? "Required learner-facing metadata is complete."
          : `Missing metadata: ${metadataMissing
              .map((field) => field.label)
              .join(", ")}.`,
    },
  ];
  const blockers = checks.filter((check) => !check.ready);

  return {
    ready: blockers.length === 0,
    certificateRule: publishCertificateRule,
    learnerVisibilityDefault:
      "Visible in learner discovery after authorized Publish action.",
    checks,
    blockers,
    warnings: [],
    summary:
      blockers.length === 0
        ? "Ready to publish after authorized publisher confirmation."
        : `${blockers.length} publish readiness blocker(s) must be resolved before publishing.`,
    generatedAt: (options.generatedAt || new Date()).toISOString(),
  };
}

export function canPublishVersion(readiness: PublishReadiness) {
  return readiness.ready;
}

export function mergePublishReadinessChecklist(
  existingChecklist: string | null | undefined,
  readiness: PublishReadiness,
) {
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    publishReadiness: readiness,
  });
}

export function mergePublicationRecordChecklist(
  existingChecklist: string | null | undefined,
  readiness: PublishReadiness,
  record: PublicationRecord,
) {
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    publishReadiness: readiness,
    publicationRecord: record,
  });
}

export function isLearnerVisibleCourseVersionStatus(
  status: CourseVersionStatus,
) {
  return status === CourseVersionStatus.PUBLISHED;
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

function getObject(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function parseChecklist(
  checklist: string | null | undefined,
): Record<string, unknown> {
  if (!checklist) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(checklist);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
}

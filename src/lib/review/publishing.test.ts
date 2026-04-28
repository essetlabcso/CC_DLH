import { CourseVersionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildPublishReadiness,
  canPublishVersion,
  countPublishableLessons,
  formatPublishedDate,
  getPublishingVersionTypeLabel,
  getPublishingStatusLabel,
  isLearnerVisibleCourseVersionStatus,
  mergePublicationRecordChecklist,
  mergePublishReadinessChecklist,
  summarizePublication,
} from "./publishing";

describe("publishing helpers", () => {
  it("uses product-friendly publication labels", () => {
    expect(getPublishingStatusLabel(CourseVersionStatus.APPROVED)).toBe(
      "Approved for publishing",
    );
    expect(getPublishingStatusLabel(CourseVersionStatus.DRAFT)).toBe(
      "Not ready for publishing",
    );
  });

  it("counts lessons across modules", () => {
    expect(
      countPublishableLessons({
        modules: [
          {
            lessons: [{}, {}],
          },
          {
            lessons: [{}],
          },
        ],
      }),
    ).toBe(3);
  });

  it("formats missing publication time clearly", () => {
    expect(formatPublishedDate(null)).toBe("Publication time not recorded");
  });

  it("summarizes publication handoff for lifecycle evidence", () => {
    expect(summarizePublication("Safeguarding Basics", 2)).toBe(
      "Published Safeguarding Basics version 2 for learner discovery.",
    );
  });

  it("summarizes revision publication distinctly", () => {
    expect(
      summarizePublication("Safeguarding Basics", 2, { isRevision: true }),
    ).toBe(
      "Published revised Safeguarding Basics version 2 for learner discovery.",
    );
  });

  it("labels revision versions in the publishing queue", () => {
    expect(getPublishingVersionTypeLabel({ sourceVersionId: "version-1" })).toBe(
      "Revision version",
    );
    expect(getPublishingVersionTypeLabel({ sourceVersionId: null })).toBe(
      "New course version",
    );
  });

  it("passes publish readiness for approved review with complete evidence", () => {
    const readiness = buildPublishReadiness(buildReadyVersion());

    expect(readiness.ready).toBe(true);
    expect(canPublishVersion(readiness)).toBe(true);
    expect(readiness.certificateRule).toBe(
      "80%+ final test score = pass and automated course certificate",
    );
    expect(readiness.certificateRule).not.toContain("90%");
  });

  it("fails publish readiness when the review record is missing", () => {
    const readiness = buildPublishReadiness({
      ...buildReadyVersion(),
      reviewRecord: null,
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toContain(
      "review-record",
    );
  });

  it("fails publish readiness when review decision is not approve-for-publish", () => {
    const readiness = buildPublishReadiness(
      buildReadyVersion({
        reviewerReview: {
          decisionType: "return-to-build",
          certificateRuleConfirmed: true,
          certificateRule:
            "80%+ final test score = pass and automated course certificate",
        },
      }),
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toContain(
      "review-decision",
    );
  });

  it("fails publish readiness for unresolved specialist review", () => {
    const readiness = buildPublishReadiness(
      buildReadyVersion({
        reviewerReview: {
          decisionType: "specialist-review-required",
          specialistReviewRequired: true,
          certificateRuleConfirmed: true,
          certificateRule:
            "80%+ final test score = pass and automated course certificate",
        },
      }),
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toContain(
      "specialist-review",
    );
  });

  it("fails publish readiness without 80% certificate confirmation", () => {
    const readiness = buildPublishReadiness(
      buildReadyVersion({
        reviewerReview: {
          decisionType: "approve-for-publish",
          certificateRuleConfirmed: false,
        },
      }),
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toContain(
      "certificate-rule",
    );
  });

  it("fails publish readiness when final test readiness is missing for certifying course", () => {
    const readiness = buildPublishReadiness(
      buildReadyVersion({
        handover: {
          finalTest: {
            required: true,
            ready: false,
            questionCount: 0,
            summary: "Final test missing.",
          },
        },
      }),
    );

    expect(readiness.ready).toBe(false);
    expect(readiness.blockers.map((blocker) => blocker.key)).toContain(
      "final-test",
    );
  });

  it("records publish readiness and publication evidence in checklist JSON", () => {
    const readiness = buildPublishReadiness(buildReadyVersion());
    const readinessChecklist = mergePublishReadinessChecklist("{}", readiness);
    const publicationChecklist = mergePublicationRecordChecklist(
      readinessChecklist,
      readiness,
      {
        publishedAt: "2026-04-28T00:00:00.000Z",
        publishedById: "publisher-1",
        courseId: "course-1",
        courseVersionId: "version-1",
        versionNumber: 1,
        releaseType: "publish-now",
        visibility: "Visible in learner discovery after authorized Publish action.",
        enrollment: "Learner sign-in required",
        certificateRule:
          "80%+ final test score = pass and automated course certificate",
        readinessSummary: readiness.summary,
      },
    );

    expect(JSON.parse(readinessChecklist).publishReadiness.ready).toBe(true);
    expect(JSON.parse(publicationChecklist).publicationRecord).toMatchObject({
      courseVersionId: "version-1",
      releaseType: "publish-now",
    });
  });

  it("keeps learner visibility limited to published versions", () => {
    expect(
      isLearnerVisibleCourseVersionStatus(CourseVersionStatus.APPROVED),
    ).toBe(false);
    expect(
      isLearnerVisibleCourseVersionStatus(CourseVersionStatus.PUBLISHED),
    ).toBe(true);
  });
});

function buildReadyVersion(
  overrides: {
    reviewerReview?: Record<string, unknown>;
    handover?: Record<string, unknown>;
  } = {},
) {
  const reviewerReview = {
    decisionType: "approve-for-publish",
    certificateRuleConfirmed: true,
    certificateRule:
      "80%+ final test score = pass and automated course certificate",
    specialistReviewRequired: false,
    ...overrides.reviewerReview,
  };
  const handover = {
    finalTest: {
      required: true,
      ready: true,
      questionCount: 1,
      summary:
        "Final test ready. 80%+ final test score = pass and automated course certificate.",
    },
    accessibility: {
      status: "Block-level notes present",
      blocksWithNotes: 3,
      blocksMissingNotes: 0,
    },
    safeguarding: {
      status: "Block-level notes present",
      blocksWithNotes: 3,
      blocksMissingNotes: 0,
    },
    preview: {
      completed: true,
      status: "complete",
    },
    ...overrides.handover,
  };

  return {
    id: "version-1",
    versionNumber: 1,
    status: CourseVersionStatus.APPROVED,
    course: {
      id: "course-1",
      title: "Safeguarding Basics",
    },
    setup: {
      summary: "A practical safeguarding course.",
      primaryLearnerGroup: "CSO safeguarding focal persons",
      language: "English",
      formatAndTime: "20 minutes",
      level: "Foundational",
      capacityArea: "Safeguarding",
      certificateIntent: "Course certificate at 80% final test score",
    },
    reviewRecord: {
      checklist: JSON.stringify({
        reviewerReview,
        buildToReviewHandover: handover,
      }),
    },
  };
}

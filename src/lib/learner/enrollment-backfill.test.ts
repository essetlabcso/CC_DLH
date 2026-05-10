import { describe, expect, it } from "vitest";

import { buildInferredEnrollmentCandidate } from "./enrollment-backfill";

const baseInput = {
  userId: "learner-1",
  courseId: "course-1",
  courseVersionId: "version-1",
  organizationId: "org-1",
  totalLessons: 2,
};

describe("learner enrollment backfill candidate helper", () => {
  it("does not infer anything when there is no historical learner activity", () => {
    expect(buildInferredEnrollmentCandidate(baseInput)).toBeNull();
  });

  it("does not duplicate existing enrollment records", () => {
    expect(
      buildInferredEnrollmentCandidate({
        ...baseInput,
        existingEnrollment: {
          id: "enrollment-1",
        },
        lessonProgress: [
          {
            startedAt: new Date("2026-05-01T09:00:00.000Z"),
          },
        ],
      }),
    ).toBeNull();
  });

  it("infers STARTED from lesson progress", () => {
    const candidate = buildInferredEnrollmentCandidate({
      ...baseInput,
      lessonProgress: [
        {
          startedAt: new Date("2026-05-01T09:00:00.000Z"),
          completedAt: null,
        },
      ],
    });

    expect(candidate).toMatchObject({
      source: "LEGACY_INFERRED",
      status: "STARTED",
      startedAt: new Date("2026-05-01T09:00:00.000Z"),
    });
    expect(candidate?.metadata).not.toContain("proofText");
  });

  it("infers COMPLETED when all lessons are complete", () => {
    const candidate = buildInferredEnrollmentCandidate({
      ...baseInput,
      lessonProgress: [
        {
          startedAt: new Date("2026-05-01T09:00:00.000Z"),
          completedAt: new Date("2026-05-01T10:00:00.000Z"),
        },
        {
          startedAt: new Date("2026-05-02T09:00:00.000Z"),
          completedAt: new Date("2026-05-02T10:00:00.000Z"),
        },
      ],
    });

    expect(candidate).toMatchObject({
      status: "COMPLETED",
      completedAt: new Date("2026-05-02T10:00:00.000Z"),
    });
  });

  it("infers COMPLETED from active certificate plus passing final test", () => {
    const candidate = buildInferredEnrollmentCandidate({
      ...baseInput,
      lessonProgress: [],
      finalTestAttempts: [
        {
          submittedAt: new Date("2026-05-03T09:00:00.000Z"),
          passed: true,
        },
      ],
      certificates: [
        {
          issuedAt: new Date("2026-05-03T09:05:00.000Z"),
          revokedAt: null,
        },
      ],
    });

    expect(candidate).toMatchObject({
      status: "COMPLETED",
      completedAt: new Date("2026-05-03T09:05:00.000Z"),
    });
  });

  it("does not infer completion from revoked certificates alone", () => {
    const candidate = buildInferredEnrollmentCandidate({
      ...baseInput,
      finalTestAttempts: [
        {
          submittedAt: new Date("2026-05-03T09:00:00.000Z"),
          passed: true,
        },
      ],
      certificates: [
        {
          issuedAt: new Date("2026-05-03T09:05:00.000Z"),
          revokedAt: new Date("2026-05-04T09:05:00.000Z"),
        },
      ],
    });

    expect(candidate).toMatchObject({
      status: "STARTED",
      completedAt: undefined,
    });
  });

  it("infers STARTED from proof submissions without copying proof content", () => {
    const candidate = buildInferredEnrollmentCandidate({
      ...baseInput,
      proofSubmissions: [
        {
          submittedAt: new Date("2026-05-05T09:00:00.000Z"),
        },
      ],
    });

    expect(candidate).toMatchObject({
      status: "STARTED",
    });
    expect(JSON.parse(candidate?.metadata ?? "{}")).toMatchObject({
      hasProofSubmission: true,
    });
  });
});

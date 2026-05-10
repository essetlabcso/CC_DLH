import { describe, expect, it } from "vitest";

import {
  backfillCertificateSelect,
  backfillExistingEnrollmentSelect,
  backfillFinalTestAttemptSelect,
  backfillLessonProgressSelect,
  backfillProofSubmissionSelect,
  loadInferredEnrollmentBackfillCandidates,
  type EnrollmentBackfillLoaderPrisma,
} from "./enrollment-backfill-loader";

type FindManyCall = {
  model: string;
  args: unknown;
};

function createPrisma(
  overrides: Partial<{
    existingEnrollments: Awaited<
      ReturnType<EnrollmentBackfillLoaderPrisma["learnerEnrollment"]["findMany"]>
    >;
    lessonProgress: Awaited<
      ReturnType<
        EnrollmentBackfillLoaderPrisma["learnerLessonProgress"]["findMany"]
      >
    >;
    finalTestAttempts: Awaited<
      ReturnType<
        EnrollmentBackfillLoaderPrisma["learnerFinalTestAttempt"]["findMany"]
      >
    >;
    certificates: Awaited<
      ReturnType<EnrollmentBackfillLoaderPrisma["learnerCertificate"]["findMany"]>
    >;
    proofSubmissions: Awaited<
      ReturnType<
        EnrollmentBackfillLoaderPrisma["learnerPracticalProofSubmission"]["findMany"]
      >
    >;
  }> = {},
) {
  const calls: FindManyCall[] = [];
  const prisma: EnrollmentBackfillLoaderPrisma = {
    courseVersion: {
      async findMany(args) {
        calls.push({ model: "courseVersion", args });
        return [courseVersionRecord()];
      },
    },
    learnerEnrollment: {
      async findMany(args) {
        calls.push({ model: "learnerEnrollment", args });
        return overrides.existingEnrollments ?? [];
      },
    },
    learnerLessonProgress: {
      async findMany(args) {
        calls.push({ model: "learnerLessonProgress", args });
        return overrides.lessonProgress ?? [];
      },
    },
    learnerFinalTestAttempt: {
      async findMany(args) {
        calls.push({ model: "learnerFinalTestAttempt", args });
        return overrides.finalTestAttempts ?? [];
      },
    },
    learnerCertificate: {
      async findMany(args) {
        calls.push({ model: "learnerCertificate", args });
        return overrides.certificates ?? [];
      },
    },
    learnerPracticalProofSubmission: {
      async findMany(args) {
        calls.push({ model: "learnerPracticalProofSubmission", args });
        return overrides.proofSubmissions ?? [];
      },
    },
  };

  return { prisma, calls };
}

describe("learner enrollment backfill loader", () => {
  it("keeps read selections free of proof content, final answers, and unsafe token fields", () => {
    const serialized = JSON.stringify([
      backfillExistingEnrollmentSelect,
      backfillLessonProgressSelect,
      backfillFinalTestAttemptSelect,
      backfillCertificateSelect,
      backfillProofSubmissionSelect,
    ]);

    expect(serialized).not.toContain("tokenHash");
    expect(serialized).not.toContain("selectedAnswer");
    expect(serialized).not.toContain("correctAnswer");
    expect(serialized).not.toContain("proofText");
    expect(serialized).not.toContain("evidenceLink");
    expect(serialized).not.toContain("internalReviewNote");
    expect(serialized).not.toContain("proofTextSnapshot");
  });

  it("passes filters to every read without writing data", async () => {
    const { prisma, calls } = createPrisma();

    await loadInferredEnrollmentBackfillCandidates(prisma, {
      userIds: ["learner-1"],
      courseVersionIds: ["version-1"],
    });

    expect(calls).toHaveLength(6);
    expect(calls.map((call) => call.model)).toEqual([
      "courseVersion",
      "learnerEnrollment",
      "learnerLessonProgress",
      "learnerFinalTestAttempt",
      "learnerCertificate",
      "learnerPracticalProofSubmission",
    ]);
    expect(calls[1]?.args).toMatchObject({
      where: {
        userId: { in: ["learner-1"] },
        courseVersionId: { in: ["version-1"] },
      },
    });
  });

  it("suppresses inferred candidates when an explicit enrollment exists", async () => {
    const { prisma } = createPrisma({
      existingEnrollments: [
        {
          id: "enrollment-1",
          source: "ADMIN_ASSIGNMENT",
          userId: "learner-1",
          courseVersionId: "version-1",
        },
      ],
      lessonProgress: [
        {
          userId: "learner-1",
          courseVersionId: "version-1",
          startedAt: date("2026-05-01"),
          completedAt: null,
        },
      ],
    });

    const candidates = await loadInferredEnrollmentBackfillCandidates(prisma);

    expect(candidates).toEqual([]);
  });

  it("does not infer completion from a revoked certificate alone", async () => {
    const { prisma } = createPrisma({
      certificates: [
        {
          userId: "learner-1",
          courseVersionId: "version-1",
          issuedAt: date("2026-05-02"),
          revokedAt: date("2026-05-03"),
        },
      ],
    });

    const candidates = await loadInferredEnrollmentBackfillCandidates(prisma);

    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.status).toBe("STARTED");
    expect(candidates[0]?.completedAt).toBeUndefined();
  });

  it("infers completion from active certificate plus passed final test", async () => {
    const { prisma } = createPrisma({
      finalTestAttempts: [
        {
          userId: "learner-1",
          courseVersionId: "version-1",
          submittedAt: date("2026-05-02"),
          passed: true,
        },
      ],
      certificates: [
        {
          userId: "learner-1",
          courseVersionId: "version-1",
          issuedAt: date("2026-05-03"),
          revokedAt: null,
        },
      ],
    });

    const candidates = await loadInferredEnrollmentBackfillCandidates(prisma);

    expect(candidates[0]?.status).toBe("COMPLETED");
    expect(candidates[0]?.completedAt).toEqual(date("2026-05-03"));
  });

  it("uses proof submission timestamps without copying proof content", async () => {
    const { prisma } = createPrisma({
      proofSubmissions: [
        {
          userId: "learner-1",
          courseVersionId: "version-1",
          submittedAt: date("2026-05-04"),
        },
      ],
    });

    const candidates = await loadInferredEnrollmentBackfillCandidates(prisma);

    expect(candidates[0]).toMatchObject({
      status: "STARTED",
      startedAt: date("2026-05-04"),
    });
    expect(candidates[0]?.metadata).toContain('"hasProofSubmission":true');
    expect(candidates[0]?.metadata).not.toContain("proofText");
    expect(candidates[0]?.metadata).not.toContain("evidenceLink");
  });
});

function courseVersionRecord() {
  return {
    id: "version-1",
    courseId: "course-1",
    course: {
      organizationId: "org-1",
    },
    modules: [
      {
        lessons: [{ id: "lesson-1" }, { id: "lesson-2" }],
      },
    ],
  };
}

function date(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

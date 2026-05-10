import { describe, expect, it } from "vitest";

import {
  loadLearnerRuntimeAccess,
  type LearnerRuntimeAccessPrisma,
} from "./runtime-access";
import type { PublicEligibilityVersion } from "./self-enrollment";

function createPrisma(
  options: {
    version?: PublicEligibilityVersion | null;
    enrollmentStatus?: string | null;
  } = {},
) {
  const calls: { model: string; args: unknown }[] = [];
  const version =
    options.version === undefined ? courseVersionRecord() : options.version;

  const prisma: LearnerRuntimeAccessPrisma = {
    courseVersion: {
      async findFirst(args) {
        calls.push({ model: "courseVersion", args });

        if (JSON.stringify(args).includes("cohortCourses")) {
          return version
            ? {
                ...version,
                publishedAt: new Date("2026-05-01T00:00:00.000Z"),
                setup: version.setup
                  ? {
                      ...version.setup,
                      memberCatalogVisible: false,
                      requiresProgramAssignment: false,
                      requiresCohortAssignment: false,
                    }
                  : null,
                cohortCourses: [],
              }
            : null;
        }

        return version;
      },
    },
    learnerEnrollment: {
      async findFirst(args) {
        calls.push({ model: "learnerEnrollment", args });

        return options.enrollmentStatus
          ? {
              id: "enrollment-1",
              status: options.enrollmentStatus,
              programId: null,
              cohortId: null,
              invitationId: null,
            }
          : null;
      },
    },
    learnerInvitation: {
      async findFirst(args) {
        calls.push({ model: "learnerInvitation", args });
        return null;
      },
    },
    programParticipant: {
      async findFirst(args) {
        calls.push({ model: "programParticipant", args });
        return null;
      },
    },
    cohortParticipant: {
      async findFirst(args) {
        calls.push({ model: "cohortParticipant", args });
        return null;
      },
    },
  };

  return { prisma, calls };
}

describe("learner runtime access", () => {
  it("allows a self-enrolled public learner to open lessons", async () => {
    const { prisma } = createPrisma({
      enrollmentStatus: "ENROLLED",
    });

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      lessonId: "lesson-1",
      requiredAction: "OPEN_LESSON",
      identity: {
        userId: "learner-1",
        organizationId: "learner-org",
      },
    });

    expect(result).toMatchObject({
      allowed: true,
      publicEligible: true,
      legacyOrganizationAccess: false,
      courseVersionId: "version-1",
      reason: "PUBLIC_ENROLLED",
    });
  });

  it.each([
    ["OPEN_LESSON"],
    ["SUBMIT_FINAL_TEST"],
    ["SUBMIT_PROOF"],
  ] as const)("blocks unenrolled public learners from %s", async (requiredAction) => {
    const { prisma } = createPrisma();

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      requiredAction,
      identity: {
        userId: "learner-1",
        organizationId: "learner-org",
      },
    });

    expect(result.allowed).toBe(false);
    expect(result.publicEligible).toBe(true);
    expect(result.reason).toBe("PUBLIC_SELF_ENROLL_AVAILABLE");
    expect(result.decision?.allowedActions).toEqual(["SELF_ENROLL"]);
  });

  it("allows public final test submission after enrollment", async () => {
    const { prisma } = createPrisma({
      enrollmentStatus: "STARTED",
    });

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      requiredAction: "SUBMIT_FINAL_TEST",
      identity: {
        userId: "learner-1",
        organizationId: "learner-org",
      },
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("ENROLLMENT_STARTED");
  });

  it("allows public proof submission after enrollment", async () => {
    const { prisma } = createPrisma({
      enrollmentStatus: "ENROLLED",
    });

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      requiredAction: "SUBMIT_PROOF",
      identity: {
        userId: "learner-1",
        organizationId: "learner-org",
      },
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("PUBLIC_ENROLLED");
  });

  it("preserves same-organization access for non-public courses during transition", async () => {
    const { prisma } = createPrisma({
      version: courseVersionRecord({
        accessMode: "MEMBER_CSO_ONLY",
        publicCatalogVisible: false,
      }),
    });

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      requiredAction: "OPEN_LESSON",
      identity: {
        userId: "learner-1",
        organizationId: "owner-org",
      },
    });

    expect(result).toMatchObject({
      allowed: true,
      publicEligible: false,
      legacyOrganizationAccess: true,
      reason: "ORGANIZATION_ASSIGNMENT_REQUIRED",
    });
  });

  it.each([
    ["WITHDRAWN", "ENROLLMENT_WITHDRAWN"],
    ["EXPIRED", "ENROLLMENT_EXPIRED"],
    ["CANCELLED", "ENROLLMENT_CANCELLED"],
    ["SUSPENDED", "ENROLLMENT_SUSPENDED"],
  ] as const)("blocks %s public enrollments", async (status, reason) => {
    const { prisma } = createPrisma({
      enrollmentStatus: status,
    });

    const result = await loadLearnerRuntimeAccess(prisma, {
      courseId: "course-1",
      requiredAction: "OPEN_LESSON",
      identity: {
        userId: "learner-1",
        organizationId: "learner-org",
      },
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe(reason);
  });

  it("keeps safe selects free of proof, final-answer, and token fields", async () => {
    const { prisma, calls } = createPrisma();

    await expect(
      loadLearnerRuntimeAccess(prisma, {
        courseId: "course-1",
        requiredAction: "OPEN_COURSE",
        identity: {
          userId: "learner-1",
          organizationId: "learner-org",
        },
      }),
    ).resolves.toBeTruthy();

    const serialized = JSON.stringify(calls);

    expect(serialized).not.toContain("tokenHash");
    expect(serialized).not.toContain("proofText");
    expect(serialized).not.toContain("evidenceLink");
    expect(serialized).not.toContain("selectedAnswer");
    expect(serialized).not.toContain("correctAnswer");
    expect(serialized).not.toContain("proofTextSnapshot");
  });
});

function courseVersionRecord(
  overrides: Partial<{
    accessMode:
      | "PUBLIC_OPEN"
      | "PUBLIC_REGISTRATION_REQUIRED"
      | "MEMBER_CSO_ONLY";
    publicCatalogVisible: boolean;
  }> = {},
): PublicEligibilityVersion {
  const accessMode = overrides.accessMode ?? "PUBLIC_OPEN";

  return {
    id: "version-1",
    courseId: "course-1",
    status: "PUBLISHED",
    course: {
      id: "course-1",
      organizationId: "owner-org",
      status: "ACTIVE",
      accessMode,
      publicCatalogVisible:
        overrides.publicCatalogVisible ?? accessMode.startsWith("PUBLIC"),
    },
    setup: {
      accessMode,
      enrollmentMode: "SELF_ENROLL",
      publicCatalogVisible:
        overrides.publicCatalogVisible ?? accessMode.startsWith("PUBLIC"),
    },
  };
}

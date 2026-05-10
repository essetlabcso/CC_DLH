import { describe, expect, it } from "vitest";

import {
  learnerAccessCourseVersionSelect,
  learnerAccessEnrollmentSelect,
  learnerAccessInvitationSelect,
  loadLearnerAccessDecision,
  type LearnerAccessLoaderPrisma,
} from "./access-loader";

type FindFirstCall = {
  model: string;
  args: unknown;
};

function createPrisma(
  overrides: Partial<{
    enrollment: Awaited<
      ReturnType<LearnerAccessLoaderPrisma["learnerEnrollment"]["findFirst"]>
    >;
    invitation: Awaited<
      ReturnType<LearnerAccessLoaderPrisma["learnerInvitation"]["findFirst"]>
    >;
    programParticipant: Awaited<
      ReturnType<LearnerAccessLoaderPrisma["programParticipant"]["findFirst"]>
    >;
    cohortParticipant: Awaited<
      ReturnType<LearnerAccessLoaderPrisma["cohortParticipant"]["findFirst"]>
    >;
    version: Awaited<
      ReturnType<LearnerAccessLoaderPrisma["courseVersion"]["findFirst"]>
    >;
  }> = {},
) {
  const calls: FindFirstCall[] = [];
  const version =
    overrides.version ??
    courseVersionRecord({
      accessMode: "PUBLIC_OPEN",
    });

  const prisma: LearnerAccessLoaderPrisma = {
    courseVersion: {
      async findFirst(args) {
        calls.push({ model: "courseVersion", args });
        return version;
      },
    },
    learnerEnrollment: {
      async findFirst(args) {
        calls.push({ model: "learnerEnrollment", args });
        return overrides.enrollment ?? null;
      },
    },
    learnerInvitation: {
      async findFirst(args) {
        calls.push({ model: "learnerInvitation", args });
        return overrides.invitation ?? null;
      },
    },
    programParticipant: {
      async findFirst(args) {
        calls.push({ model: "programParticipant", args });
        return overrides.programParticipant ?? null;
      },
    },
    cohortParticipant: {
      async findFirst(args) {
        calls.push({ model: "cohortParticipant", args });
        return overrides.cohortParticipant ?? null;
      },
    },
  };

  return { prisma, calls };
}

describe("learner access loader", () => {
  it("loads the latest published version when no version is provided", async () => {
    const { prisma, calls } = createPrisma();

    const result = await loadLearnerAccessDecision(prisma, {
      courseId: "course-1",
    });

    expect(result?.context.courseVersionId).toBe("version-1");
    expect(calls[0]).toMatchObject({
      model: "courseVersion",
      args: {
        where: {
          courseId: "course-1",
          status: "PUBLISHED",
        },
        orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
      },
    });
  });

  it("keeps safe selects free of raw token, proof, and final-answer fields", () => {
    const serialized = JSON.stringify([
      learnerAccessCourseVersionSelect,
      learnerAccessEnrollmentSelect,
      learnerAccessInvitationSelect,
    ]);

    expect(serialized).not.toContain("tokenHash");
    expect(serialized).not.toContain("email");
    expect(serialized).not.toContain("proofText");
    expect(serialized).not.toContain("evidenceLink");
    expect(serialized).not.toContain("selectedAnswer");
    expect(serialized).not.toContain("correctAnswer");
    expect(serialized).not.toContain("proofTextSnapshot");
  });

  it.each([
    ["public-open", "PUBLIC_OPEN", "PUBLIC_SELF_ENROLL_AVAILABLE"],
    [
      "public-registration-required",
      "PUBLIC_REGISTRATION_REQUIRED",
      "PUBLIC_SELF_ENROLL_AVAILABLE",
    ],
    ["organization-assigned", "MEMBER_CSO_ONLY", "ORGANIZATION_ASSIGNMENT_REQUIRED"],
    ["private-internal", "PRIVATE_INTERNAL", "PRIVATE_ASSIGNMENT_REQUIRED"],
    ["pilot-restricted", "PILOT_RESTRICTED", "PILOT_ASSIGNMENT_REQUIRED"],
  ] as const)(
    "represents %s course access context",
    async (_label, accessMode, reasonCode) => {
      const { prisma } = createPrisma({
        version: courseVersionRecord({ accessMode }),
      });

      const result = await loadLearnerAccessDecision(prisma, {
        courseId: "course-1",
        identity: {
          userId: "learner-1",
          organizationId: "org-1",
        },
      });

      expect(result?.decision.accessModel).toBe(_label);
      expect(result?.decision.reasonCode).toBe(reasonCode);
    },
  );

  it("loads accepted invitation context without selecting token hashes", async () => {
    const { prisma, calls } = createPrisma({
      version: courseVersionRecord({
        accessMode: "MEMBER_CSO_ONLY",
        enrollmentMode: "INVITATION_ONLY",
      }),
      invitation: {
        id: "invitation-1",
        status: "ACCEPTED",
        programId: null,
        cohortId: null,
        courseId: "course-1",
        courseVersionId: "version-1",
        expiresAt: futureDate(),
      },
    });

    const result = await loadLearnerAccessDecision(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-1",
      },
      now: new Date("2026-05-10T00:00:00.000Z"),
    });

    const invitationCall = calls.find(
      (call) => call.model === "learnerInvitation",
    );

    expect(result?.decision.accessModel).toBe("invitation-only");
    expect(result?.decision.allowed).toBe(true);
    expect(result?.context.hasInvitation).toBe(true);
    expect(JSON.stringify(invitationCall?.args)).not.toContain("tokenHash");
  });

  it("loads program participant context for program-assigned access", async () => {
    const { prisma } = createPrisma({
      version: courseVersionRecord({
        accessMode: "PROGRAM_ASSIGNED",
        programId: "program-1",
      }),
      programParticipant: {
        id: "program-participant-1",
        status: "ACTIVE",
        programId: "program-1",
        organizationId: "org-1",
      },
    });

    const result = await loadLearnerAccessDecision(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-1",
      },
    });

    expect(result?.decision.allowed).toBe(true);
    expect(result?.decision.accessModel).toBe("program-assigned");
    expect(result?.context.programIds).toEqual(["program-1"]);
    expect(result?.context.hasProgramParticipant).toBe(true);
  });

  it("loads cohort participant context for cohort-assigned access", async () => {
    const { prisma } = createPrisma({
      version: courseVersionRecord({
        accessMode: "COHORT_ASSIGNED",
        cohortId: "cohort-1",
        programId: "program-1",
      }),
      cohortParticipant: {
        id: "cohort-participant-1",
        status: "ACTIVE",
        programId: "program-1",
        cohortId: "cohort-1",
        organizationId: "org-1",
      },
    });

    const result = await loadLearnerAccessDecision(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-1",
      },
    });

    expect(result?.decision.allowed).toBe(true);
    expect(result?.decision.accessModel).toBe("cohort-assigned");
    expect(result?.context.cohortIds).toEqual(["cohort-1"]);
    expect(result?.context.hasCohortParticipant).toBe(true);
  });
});

function courseVersionRecord(options: {
  accessMode:
    | "PUBLIC_OPEN"
    | "PUBLIC_REGISTRATION_REQUIRED"
    | "MEMBER_CSO_ONLY"
    | "PROGRAM_ASSIGNED"
    | "COHORT_ASSIGNED"
    | "PRIVATE_INTERNAL"
    | "PILOT_RESTRICTED";
  enrollmentMode?: "SELF_ENROLL" | "ASSIGNED" | "INVITATION_ONLY" | "ADMIN_ENROLL";
  programId?: string;
  cohortId?: string;
}) {
  return {
    id: "version-1",
    courseId: "course-1",
    status: "PUBLISHED",
    publishedAt: new Date("2026-05-01T00:00:00.000Z"),
    course: {
      id: "course-1",
      organizationId: "org-1",
      status: "ACTIVE",
      accessMode: options.accessMode,
      publicCatalogVisible: options.accessMode.startsWith("PUBLIC"),
    },
    setup: {
      accessMode: options.accessMode,
      enrollmentMode: options.enrollmentMode ?? "SELF_ENROLL",
      publicCatalogVisible: options.accessMode.startsWith("PUBLIC"),
      memberCatalogVisible: true,
      requiresProgramAssignment: options.accessMode === "PROGRAM_ASSIGNED",
      requiresCohortAssignment: options.accessMode === "COHORT_ASSIGNED",
    },
    cohortCourses: options.cohortId
      ? [
          {
            cohortId: options.cohortId,
            cohort: {
              id: options.cohortId,
              programId: options.programId ?? null,
              organizationId: "org-1",
              status: "ACTIVE",
            },
          },
        ]
      : options.programId
        ? [
            {
              cohortId: "program-context-cohort",
              cohort: {
                id: "program-context-cohort",
                programId: options.programId,
                organizationId: "org-1",
                status: "ACTIVE",
              },
            },
          ]
        : [],
  };
}

function futureDate() {
  return new Date("2026-06-01T00:00:00.000Z");
}

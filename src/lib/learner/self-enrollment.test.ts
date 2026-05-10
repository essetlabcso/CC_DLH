import {
  CourseAccessMode,
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildPublicCourseCta,
  filterPublicCatalogueVersions,
  isPublicEligibleCourseVersion,
  publicSelfEnrollmentMetadata,
  publicSelfEnrollmentReason,
  selfEnrollInPublicCourse,
  type PublicEligibilityVersion,
  type SelfEnrollmentPrisma,
  type SelfEnrollmentRecord,
} from "./self-enrollment";

function createPrisma(
  options: {
    version?: PublicEligibilityVersion | null;
    enrollment?: SelfEnrollmentRecord | null;
  } = {},
) {
  const calls: { model: string; operation: string; args: unknown }[] = [];
  const version = options.version === undefined ? publicVersion() : options.version;
  const transaction = {
    learnerEnrollment: {
      async findUnique(args: unknown) {
        calls.push({ model: "learnerEnrollment", operation: "findUnique", args });
        return options.enrollment ?? null;
      },
      async create(args: unknown) {
        calls.push({ model: "learnerEnrollment", operation: "create", args });
        return enrollmentRecord();
      },
    },
    learnerEnrollmentEvent: {
      async create(args: unknown) {
        calls.push({
          model: "learnerEnrollmentEvent",
          operation: "create",
          args,
        });
        return { id: "event-1" };
      },
    },
  };
  const prisma = {
    courseVersion: {
      async findFirst(args: unknown) {
        calls.push({ model: "courseVersion", operation: "findFirst", args });

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
      async findFirst(args: unknown) {
        calls.push({ model: "learnerEnrollment", operation: "findFirst", args });
        return options.enrollment
          ? {
              id: options.enrollment.id,
              status: options.enrollment.status,
              programId: null,
              cohortId: null,
              invitationId: null,
            }
          : null;
      },
      async findUnique(args: unknown) {
        return transaction.learnerEnrollment.findUnique(args);
      },
      async create(args: unknown) {
        return transaction.learnerEnrollment.create(args);
      },
    },
    learnerInvitation: {
      async findFirst(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "findFirst", args });
        return null;
      },
    },
    programParticipant: {
      async findFirst(args: unknown) {
        calls.push({ model: "programParticipant", operation: "findFirst", args });
        return null;
      },
    },
    cohortParticipant: {
      async findFirst(args: unknown) {
        calls.push({ model: "cohortParticipant", operation: "findFirst", args });
        return null;
      },
    },
    learnerEnrollmentEvent: transaction.learnerEnrollmentEvent,
    async $transaction<T>(
      callback: (transactionClient: typeof transaction) => Promise<T>,
    ) {
      calls.push({ model: "prisma", operation: "$transaction", args: {} });
      return callback(transaction);
    },
  } satisfies SelfEnrollmentPrisma;

  return { prisma, calls };
}

describe("public self-enrollment", () => {
  it("filters the public catalogue to public visible active published courses", () => {
    const versions = [
      publicVersion({
        id: "public-open",
        accessMode: CourseAccessMode.PUBLIC_OPEN,
      }),
      publicVersion({
        id: "registration-required",
        accessMode: CourseAccessMode.PUBLIC_REGISTRATION_REQUIRED,
      }),
      publicVersion({
        id: "member-only",
        accessMode: CourseAccessMode.MEMBER_CSO_ONLY,
      }),
      publicVersion({
        id: "program-assigned",
        accessMode: CourseAccessMode.PROGRAM_ASSIGNED,
      }),
      publicVersion({
        id: "cohort-assigned",
        accessMode: CourseAccessMode.COHORT_ASSIGNED,
      }),
      publicVersion({
        id: "private-internal",
        accessMode: CourseAccessMode.PRIVATE_INTERNAL,
      }),
      publicVersion({
        id: "pilot",
        accessMode: CourseAccessMode.PILOT_RESTRICTED,
      }),
      publicVersion({
        id: "unpublished",
        status: CourseVersionStatus.APPROVED,
      }),
      publicVersion({
        id: "archived-course",
        courseStatus: "ARCHIVED",
      }),
      publicVersion({
        id: "hidden-public",
        publicCatalogVisible: false,
      }),
      publicVersion({
        id: "invitation-only",
        enrollmentMode: "INVITATION_ONLY",
      }),
    ];

    expect(filterPublicCatalogueVersions(versions).map((version) => version.id)).toEqual([
      "public-open",
      "registration-required",
    ]);
  });

  it("builds an anonymous sign-in/register CTA for public courses", () => {
    const cta = buildPublicCourseCta({
      courseId: "course-1",
      isSignedInLearner: false,
      decision: {
        allowed: true,
        reasonCode: "SIGN_IN_REQUIRED",
        accessModel: "public-registration-required",
        allowedActions: ["VIEW_PUBLIC_CATALOG_CARD", "SIGN_IN", "REGISTER"],
        learnerMessage: "Register or sign in before starting this course.",
        auditContext: {
          courseId: "course-1",
          courseVersionId: "version-1",
        },
      },
    });

    expect(cta).toEqual({
      kind: "SIGN_IN",
      label: "Sign in or register to enroll",
      href: "/sign-in?next=%2Flearn%2Fcourses%2Fcourse-1",
    });
  });

  it("creates a safe learner enrollment and event for signed-in self-enrollment", async () => {
    const { prisma, calls } = createPrisma();
    const now = new Date("2026-05-10T10:00:00.000Z");

    const result = await selfEnrollInPublicCourse(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-learner",
      },
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      created: true,
      enrollment: {
        source: LearnerEnrollmentSource.SELF_ENROLL,
        status: LearnerEnrollmentStatus.ENROLLED,
      },
    });
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollment",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            userId: "learner-1",
            courseId: "course-1",
            courseVersionId: "version-1",
            organizationId: "org-learner",
            source: LearnerEnrollmentSource.SELF_ENROLL,
            status: LearnerEnrollmentStatus.ENROLLED,
            enrolledAt: now,
            reason: publicSelfEnrollmentReason,
            metadata: publicSelfEnrollmentMetadata,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollmentEvent",
        operation: "create",
        args: {
          data: expect.objectContaining({
            eventType: LearnerEnrollmentEventType.ENROLLMENT_CREATED,
            actorId: "learner-1",
            toStatus: LearnerEnrollmentStatus.ENROLLED,
            reason: publicSelfEnrollmentReason,
            metadata: publicSelfEnrollmentMetadata,
          }),
        },
      }),
    );
  });

  it("reuses an existing enrollment without creating duplicates or events", async () => {
    const { prisma, calls } = createPrisma({
      enrollment: enrollmentRecord(),
    });

    const result = await selfEnrollInPublicCourse(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-learner",
      },
    });

    expect(result).toMatchObject({
      ok: true,
      created: false,
      enrollment: {
        id: "enrollment-1",
      },
    });
    expect(
      calls.some(
        (call) =>
          call.model === "learnerEnrollment" && call.operation === "create",
      ),
    ).toBe(false);
    expect(
      calls.some(
        (call) =>
          call.model === "learnerEnrollmentEvent" && call.operation === "create",
      ),
    ).toBe(false);
  });

  it.each([
    ["restricted", publicVersion({ accessMode: CourseAccessMode.MEMBER_CSO_ONLY })],
    ["unpublished", publicVersion({ status: CourseVersionStatus.APPROVED })],
    ["archived", publicVersion({ courseStatus: "ARCHIVED" })],
  ] as const)("blocks %s course self-enrollment", async (_label, version) => {
    expect(isPublicEligibleCourseVersion(version)).toBe(false);
    const { prisma, calls } = createPrisma({ version });

    const result = await selfEnrollInPublicCourse(prisma, {
      courseId: "course-1",
      identity: {
        userId: "learner-1",
        organizationId: "org-learner",
      },
    });

    expect(result).toEqual({
      ok: false,
      reason: "PUBLIC_COURSE_NOT_AVAILABLE",
    });
    expect(
      calls.some(
        (call) =>
          call.model === "learnerEnrollment" && call.operation === "create",
      ),
    ).toBe(false);
  });
});

function publicVersion(
  overrides: Partial<{
    id: string;
    status: CourseVersionStatus;
    courseStatus: string;
    accessMode: CourseAccessMode;
    publicCatalogVisible: boolean;
    enrollmentMode: "SELF_ENROLL" | "ASSIGNED" | "INVITATION_ONLY" | "ADMIN_ENROLL";
  }> = {},
): PublicEligibilityVersion {
  const accessMode = overrides.accessMode ?? CourseAccessMode.PUBLIC_OPEN;
  const publicCatalogVisible = overrides.publicCatalogVisible ?? true;

  return {
    id: overrides.id ?? "version-1",
    courseId: "course-1",
    status: overrides.status ?? CourseVersionStatus.PUBLISHED,
    course: {
      id: "course-1",
      organizationId: "org-owner",
      status: overrides.courseStatus ?? "ACTIVE",
      accessMode,
      publicCatalogVisible,
    },
    setup: {
      accessMode,
      enrollmentMode: overrides.enrollmentMode ?? "SELF_ENROLL",
      publicCatalogVisible,
    },
  };
}

function enrollmentRecord(): SelfEnrollmentRecord {
  return {
    id: "enrollment-1",
    userId: "learner-1",
    courseId: "course-1",
    courseVersionId: "version-1",
    organizationId: "org-learner",
    source: LearnerEnrollmentSource.SELF_ENROLL,
    status: LearnerEnrollmentStatus.ENROLLED,
    enrolledAt: new Date("2026-05-10T10:00:00.000Z"),
  };
}

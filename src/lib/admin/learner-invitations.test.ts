import {
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentStatus,
  LearnerInvitationStatus,
  LearnerParticipantStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  adminLearnerInvitationCreationMetadata,
  adminLearnerInvitationStatusMetadata,
  cancelAdminLearnerInvitation,
  createAdminLearnerInvitation,
  parseAdminLearnerInvitationForm,
  parseAdminLearnerInvitationStatusReason,
  revokeAdminLearnerInvitation,
  rotateAdminLearnerInvitation,
  type AdminLearnerInvitationPrisma,
} from "./learner-invitations";

const now = new Date("2026-05-11T09:00:00.000Z");

describe("Admin learner invitation helper", () => {
  it("parses a valid invitation form", () => {
    const result = parseAdminLearnerInvitationForm(validFormData(), { now });

    expect(result).toMatchObject({
      ok: true,
      data: {
        email: "learner@example.org",
        organizationId: "org-1",
        courseId: "course-1",
        courseVersionId: "version-1",
        reason: "Invite learner.",
      },
    });
  });

  it("blocks invalid invited email", () => {
    const formData = validFormData();
    formData.set("email", "not-an-email");

    expect(parseAdminLearnerInvitationForm(formData, { now })).toEqual({
      ok: false,
      message: "Enter a valid invited email address.",
    });
  });

  it("blocks past expiry dates", () => {
    const formData = validFormData();
    formData.set("expiresAt", "2026-05-01T09:00");

    expect(parseAdminLearnerInvitationForm(formData, { now })).toEqual({
      ok: false,
      message: "Invitation expiry must be in the future.",
    });
  });

  it("requires a reason for cancel and revoke actions", () => {
    const formData = new FormData();
    formData.set("reason", "   ");

    expect(parseAdminLearnerInvitationStatusReason(formData)).toEqual({
      ok: false,
      message: "Enter a reason for this invitation status change.",
    });
  });

  it("creates an invitation with tokenHash only and no enrollment", async () => {
    const { calls, prisma } = createPrisma();

    const result = await createAdminLearnerInvitation(prisma, {
      email: "learner@example.org",
      organizationId: "org-1",
      programId: "program-1",
      cohortId: "cohort-1",
      courseId: "course-1",
      courseVersionId: "version-1",
      invitedById: "admin-1",
      expiresAt: new Date("2026-06-01T09:00:00.000Z"),
      reason: "Invite learner.",
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      invitationId: "invitation-1",
    });
    expect(result.ok ? result.rawToken : "").toBeTruthy();
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            email: "learner@example.org",
            organizationId: "org-1",
            programId: "program-1",
            cohortId: "cohort-1",
            courseId: "course-1",
            courseVersionId: "version-1",
            invitedById: "admin-1",
            status: LearnerInvitationStatus.CREATED,
            metadata: adminLearnerInvitationCreationMetadata,
            tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollmentEvent",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            eventType: LearnerEnrollmentEventType.INVITATION_CREATED,
            toStatus: LearnerInvitationStatus.CREATED,
            metadata: adminLearnerInvitationCreationMetadata,
          }),
        }),
      }),
    );
    expect(calls.some((call) => call.model === "learnerEnrollment")).toBe(false);

    const rawToken = result.ok ? result.rawToken : "";
    expect(JSON.stringify(calls)).not.toContain(rawToken);
    expect(JSON.stringify(calls)).not.toContain("rawToken");
  });

  it("chooses the latest published version when only course is selected", async () => {
    const { calls, prisma } = createPrisma();

    const result = await createAdminLearnerInvitation(prisma, {
      email: "learner@example.org",
      organizationId: "org-1",
      programId: null,
      cohortId: null,
      courseId: "course-1",
      courseVersionId: null,
      invitedById: "admin-1",
      expiresAt: new Date("2026-06-01T09:00:00.000Z"),
      reason: "",
      now,
    });

    expect(result).toMatchObject({ ok: true });
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "courseVersion",
        operation: "findFirst",
        args: expect.objectContaining({
          where: {
            courseId: "course-1",
            status: CourseVersionStatus.PUBLISHED,
          },
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            courseVersionId: "version-1",
          }),
        }),
      }),
    );
  });

  it("blocks course and course version mismatch", async () => {
    const { prisma } = createPrisma({
      courseVersion: courseVersionRecord({ courseId: "course-2" }),
    });

    const result = await createAdminLearnerInvitation(prisma, {
      email: "learner@example.org",
      organizationId: "org-1",
      programId: null,
      cohortId: null,
      courseId: "course-1",
      courseVersionId: "version-1",
      invitedById: "admin-1",
      expiresAt: new Date("2026-06-01T09:00:00.000Z"),
      reason: "",
      now,
    });

    expect(result).toEqual({
      ok: false,
      message: "Choose a course version linked to the selected course.",
    });
  });

  it("blocks course organization mismatch", async () => {
    const { prisma } = createPrisma({
      course: courseRecord({ organizationId: "org-2" }),
    });

    const result = await createAdminLearnerInvitation(prisma, {
      email: "learner@example.org",
      organizationId: "org-1",
      programId: null,
      cohortId: null,
      courseId: "course-1",
      courseVersionId: null,
      invitedById: "admin-1",
      expiresAt: new Date("2026-06-01T09:00:00.000Z"),
      reason: "",
      now,
    });

    expect(result).toEqual({
      ok: false,
      message: "Choose a course owned by the selected organization.",
    });
  });

  it("blocks course version organization mismatch", async () => {
    const { prisma } = createPrisma({
      courseVersion: courseVersionRecord({
        course: {
          id: "course-1",
          organizationId: "org-2",
        },
      }),
    });

    const result = await createAdminLearnerInvitation(prisma, {
      email: "learner@example.org",
      organizationId: "org-1",
      programId: null,
      cohortId: null,
      courseId: null,
      courseVersionId: "version-1",
      invitedById: "admin-1",
      expiresAt: new Date("2026-06-01T09:00:00.000Z"),
      reason: "",
      now,
    });

    expect(result).toEqual({
      ok: false,
      message: "Choose a course version owned by the selected organization.",
    });
  });

  it("cancels a pending invitation without creating access records", async () => {
    const { calls, prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.SENT,
      }),
    });

    const result = await cancelAdminLearnerInvitation(prisma, {
      invitationId: "invitation-1",
      actorId: "admin-1",
      reason: "Learner should not receive this invite.",
      now,
    });

    expect(result).toEqual({
      ok: true,
      invitationId: "invitation-1",
      status: LearnerInvitationStatus.CANCELLED,
      suspendedEnrollments: 0,
      suspendedProgramParticipants: 0,
      suspendedCohortParticipants: 0,
    });
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "update",
        args: expect.objectContaining({
          data: expect.objectContaining({
            status: LearnerInvitationStatus.CANCELLED,
            cancelledAt: now,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "adminAuditLog",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            action: "LEARNER_INVITATION_CANCELLED",
            reason: "Learner should not receive this invite.",
            metadata: adminLearnerInvitationStatusMetadata,
          }),
        }),
      }),
    );
    expect(
      calls.some((call) => call.model === "learnerEnrollment"),
    ).toBe(false);
    expect(calls.some((call) => call.model === "programParticipant")).toBe(
      false,
    );
    expect(calls.some((call) => call.model === "cohortParticipant")).toBe(
      false,
    );
  });

  it("blocks cancelling accepted or already closed invitations", async () => {
    const { prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.ACCEPTED,
      }),
    });

    await expect(
      cancelAdminLearnerInvitation(prisma, {
        invitationId: "invitation-1",
        actorId: "admin-1",
        reason: "Wrong action.",
        now,
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Only pending invitations can be cancelled.",
    });
  });

  it("revokes an accepted invitation and suspends linked active access records", async () => {
    const { calls, prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.ACCEPTED,
        acceptedAt: now,
      }),
      enrollments: [
        linkedRecord("enrollment-1", LearnerEnrollmentStatus.ENROLLED),
      ],
      programParticipants: [
        linkedRecord("program-participant-1", LearnerParticipantStatus.ACTIVE),
      ],
      cohortParticipants: [
        linkedRecord("cohort-participant-1", LearnerParticipantStatus.ASSIGNED),
      ],
    });

    const result = await revokeAdminLearnerInvitation(prisma, {
      invitationId: "invitation-1",
      actorId: "admin-1",
      reason: "Access should stop.",
      now,
    });

    expect(result).toEqual({
      ok: true,
      invitationId: "invitation-1",
      status: LearnerInvitationStatus.REVOKED,
      suspendedEnrollments: 1,
      suspendedProgramParticipants: 1,
      suspendedCohortParticipants: 1,
    });
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "update",
        args: expect.objectContaining({
          data: expect.objectContaining({
            status: LearnerInvitationStatus.REVOKED,
            revokedAt: now,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollment",
        operation: "updateMany",
        args: expect.objectContaining({
          data: {
            status: LearnerEnrollmentStatus.SUSPENDED,
          },
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "programParticipant",
        operation: "updateMany",
        args: expect.objectContaining({
          data: {
            status: LearnerParticipantStatus.SUSPENDED,
            endedAt: now,
          },
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "cohortParticipant",
        operation: "updateMany",
        args: expect.objectContaining({
          data: {
            status: LearnerParticipantStatus.SUSPENDED,
            endedAt: now,
          },
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollmentEvent",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            enrollmentId: "enrollment-1",
            eventType: LearnerEnrollmentEventType.ENROLLMENT_SUSPENDED,
            toStatus: LearnerEnrollmentStatus.SUSPENDED,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollmentEvent",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            programParticipantId: "program-participant-1",
            eventType: LearnerEnrollmentEventType.ASSIGNMENT_REMOVED,
            toStatus: LearnerParticipantStatus.SUSPENDED,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "adminAuditLog",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            action: "LEARNER_INVITATION_REVOKED",
            riskLevel: "MEDIUM",
          }),
        }),
      }),
    );
    expect(calls.some((call) => call.operation === "delete")).toBe(false);
    expect(calls.some((call) => call.operation === "deleteMany")).toBe(false);
  });

  it("blocks revoking pending or already closed invitations", async () => {
    const { prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.CANCELLED,
      }),
    });

    await expect(
      revokeAdminLearnerInvitation(prisma, {
        invitationId: "invitation-1",
        actorId: "admin-1",
        reason: "Wrong action.",
        now,
      }),
    ).resolves.toEqual({
      ok: false,
      message: "Only accepted invitations can be revoked.",
    });
  });

  it("does not force unsafe transitions for already inactive linked records", async () => {
    const { calls, prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.ACCEPTED,
        acceptedAt: now,
      }),
      enrollments: [],
      programParticipants: [],
      cohortParticipants: [],
    });

    const result = await revokeAdminLearnerInvitation(prisma, {
      invitationId: "invitation-1",
      actorId: "admin-1",
      reason: "Access already stopped.",
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      suspendedEnrollments: 0,
      suspendedProgramParticipants: 0,
      suspendedCohortParticipants: 0,
    });
    expect(calls.some((call) => call.operation === "updateMany")).toBe(false);
  });

  it("rotates an expired invitation successfully", async () => {
    const { calls, prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.EXPIRED,
      }),
    });

    const futureDate = new Date("2026-07-01T09:00:00.000Z");

    const result = await rotateAdminLearnerInvitation(prisma, {
      invitationId: "invitation-1",
      actorId: "admin-1",
      reason: "Extend valid period.",
      expiresAt: futureDate,
      now,
    });

    expect(result).toMatchObject({
      ok: true,
    });
    expect(result.ok ? result.rawToken : "").toBeTruthy();

    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "update",
        args: expect.objectContaining({
          data: expect.objectContaining({
            status: LearnerInvitationStatus.CREATED,
            expiresAt: futureDate,
            tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
          }),
        }),
      }),
    );

    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "adminAuditLog",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            action: "LEARNER_INVITATION_TOKEN_ROTATED",
            reason: "Extend valid period.",
          }),
        }),
      }),
    );
  });

  it("blocks rotating an accepted invitation", async () => {
    const { prisma } = createPrisma({
      invitationStatus: invitationStatusRecord({
        status: LearnerInvitationStatus.ACCEPTED,
      }),
    });

    const result = await rotateAdminLearnerInvitation(prisma, {
      invitationId: "invitation-1",
      actorId: "admin-1",
      reason: "Attempt rotation.",
      expiresAt: new Date("2026-07-01T09:00:00.000Z"),
      now,
    });

    expect(result).toEqual({
      ok: false,
      message: "Only pending or expired invitations can be rotated.",
    });
  });
});

type Call = {
  model: string;
  operation: string;
  args: unknown;
};

function validFormData() {
  const formData = new FormData();

  formData.set("email", "Learner@Example.Org");
  formData.set("organizationId", "org-1");
  formData.set("programId", "");
  formData.set("cohortId", "");
  formData.set("courseId", "course-1");
  formData.set("courseVersionId", "version-1");
  formData.set("expiresAt", "2026-06-01T09:00");
  formData.set("reason", "Invite learner.");

  return formData;
}

function createPrisma(
  options: {
    organization?: ReturnType<typeof organizationRecord> | null;
    program?: ReturnType<typeof programRecord> | null;
    cohort?: ReturnType<typeof cohortRecord> | null;
    course?: ReturnType<typeof courseRecord> | null;
    courseVersion?: ReturnType<typeof courseVersionRecord> | null;
    invitationStatus?: ReturnType<typeof invitationStatusRecord> | null;
    enrollments?: ReturnType<typeof linkedRecord>[];
    programParticipants?: ReturnType<typeof linkedRecord>[];
    cohortParticipants?: ReturnType<typeof linkedRecord>[];
  } = {},
) {
  const calls: Call[] = [];
  const transaction = {
    learnerInvitation: {
      async findUnique(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "findUnique", args });

        return options.invitationStatus === undefined
          ? invitationStatusRecord()
          : options.invitationStatus;
      },
      async create(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "create", args });

        return { id: "invitation-1" };
      },
      async update(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "update", args });
        const updateArgs = args as {
          data: {
            status: LearnerInvitationStatus;
          };
        };

        return invitationStatusRecord({
          status: updateArgs.data.status,
          acceptedAt: options.invitationStatus?.acceptedAt ?? null,
        });
      },
    },
    learnerEnrollment: {
      async findMany(args: unknown) {
        calls.push({ model: "learnerEnrollment", operation: "findMany", args });

        return options.enrollments ?? [];
      },
      async updateMany(args: unknown) {
        calls.push({ model: "learnerEnrollment", operation: "updateMany", args });

        return { count: options.enrollments?.length ?? 0 };
      },
    },
    programParticipant: {
      async findMany(args: unknown) {
        calls.push({ model: "programParticipant", operation: "findMany", args });

        return options.programParticipants ?? [];
      },
      async updateMany(args: unknown) {
        calls.push({
          model: "programParticipant",
          operation: "updateMany",
          args,
        });

        return { count: options.programParticipants?.length ?? 0 };
      },
    },
    cohortParticipant: {
      async findMany(args: unknown) {
        calls.push({ model: "cohortParticipant", operation: "findMany", args });

        return options.cohortParticipants ?? [];
      },
      async updateMany(args: unknown) {
        calls.push({
          model: "cohortParticipant",
          operation: "updateMany",
          args,
        });

        return { count: options.cohortParticipants?.length ?? 0 };
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
    adminAuditLog: {
      async create(args: unknown) {
        calls.push({ model: "adminAuditLog", operation: "create", args });

        return { id: "audit-1" };
      },
    },
  };
  const prisma = {
    organization: {
      async findUnique(args: unknown) {
        calls.push({ model: "organization", operation: "findUnique", args });

        return options.organization === undefined
          ? organizationRecord()
          : options.organization;
      },
    },
    program: {
      async findUnique(args: unknown) {
        calls.push({ model: "program", operation: "findUnique", args });

        return options.program === undefined ? programRecord() : options.program;
      },
    },
    cohort: {
      async findUnique(args: unknown) {
        calls.push({ model: "cohort", operation: "findUnique", args });

        return options.cohort === undefined ? cohortRecord() : options.cohort;
      },
    },
    course: {
      async findUnique(args: unknown) {
        calls.push({ model: "course", operation: "findUnique", args });

        return options.course === undefined ? courseRecord() : options.course;
      },
    },
    courseVersion: {
      async findFirst(args: unknown) {
        calls.push({ model: "courseVersion", operation: "findFirst", args });

        return options.courseVersion === undefined
          ? courseVersionRecord()
          : options.courseVersion;
      },
    },
    async $transaction<T>(callback: (tx: typeof transaction) => Promise<T>) {
      return callback(transaction);
    },
  } as AdminLearnerInvitationPrisma;

  return { calls, prisma };
}

function organizationRecord() {
  return { id: "org-1" };
}

function programRecord() {
  return {
    id: "program-1",
    ownerOrganizationId: "org-1",
    organizations: [],
  };
}

function cohortRecord() {
  return {
    id: "cohort-1",
    programId: "program-1",
    organizationId: "org-1",
  };
}

function courseRecord(
  overrides: Partial<{
    id: string;
    organizationId: string;
  }> = {},
) {
  return {
    id: "course-1",
    organizationId: "org-1",
    ...overrides,
  };
}

function courseVersionRecord(
  overrides: Partial<{
    id: string;
    courseId: string;
    status: CourseVersionStatus;
    course: {
      id: string;
      organizationId: string;
    };
  }> = {},
) {
  return {
    id: "version-1",
    courseId: "course-1",
    status: CourseVersionStatus.PUBLISHED,
    course: {
      id: "course-1",
      organizationId: "org-1",
    },
    ...overrides,
  };
}

function invitationStatusRecord(
  overrides: Partial<{
    id: string;
    status: LearnerInvitationStatus;
    acceptedAt: Date | null;
  }> = {},
) {
  return {
    id: "invitation-1",
    status: LearnerInvitationStatus.CREATED,
    acceptedAt: null,
    ...overrides,
  };
}

function linkedRecord(id: string, status: string) {
  return { id, status };
}

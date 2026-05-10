import {
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
  LearnerInvitationStatus,
  LearnerParticipantStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  acceptLearnerInvitation,
  learnerInvitationAcceptanceMetadata,
  loadLearnerInvitationPreview,
  type LearnerInvitationAcceptancePrisma,
} from "./invitation-acceptance";
import { hashLearnerInvitationToken } from "./invitations";

const rawToken = "invite-token-123";
const now = new Date("2026-05-10T09:00:00.000Z");

describe("learner invitation acceptance", () => {
  it("accepts a valid course invitation and creates enrollment with safe events", async () => {
    const { calls, prisma } = createPrisma({
      invitation: invitationRecord({
        programId: "program-1",
        cohortId: "cohort-1",
      }),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      alreadyAccepted: false,
      invitationId: "invitation-1",
      enrollmentId: "enrollment-1",
      programParticipantId: "program-participant-1",
      cohortParticipantId: "cohort-participant-1",
      courseId: "course-1",
      courseVersionId: "version-1",
    });
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerInvitation",
        operation: "update",
        args: expect.objectContaining({
          data: expect.objectContaining({
            status: LearnerInvitationStatus.ACCEPTED,
            acceptedUserId: "user-1",
            acceptedAt: now,
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "learnerEnrollment",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            courseId: "course-1",
            courseVersionId: "version-1",
            organizationId: "org-1",
            programId: "program-1",
            cohortId: "cohort-1",
            invitationId: "invitation-1",
            source: LearnerEnrollmentSource.INVITATION,
            status: LearnerEnrollmentStatus.ENROLLED,
            metadata: learnerInvitationAcceptanceMetadata,
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
            eventType: LearnerEnrollmentEventType.INVITATION_ACCEPTED,
            metadata: learnerInvitationAcceptanceMetadata,
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
            eventType: LearnerEnrollmentEventType.ENROLLMENT_CREATED,
            metadata: learnerInvitationAcceptanceMetadata,
          }),
        }),
      }),
    );
    expect(JSON.stringify(calls)).not.toContain(rawToken);
  });

  it("creates program and cohort participants for scoped invitations", async () => {
    const { calls, prisma } = createPrisma({
      invitation: invitationRecord({
        courseId: null,
        courseVersionId: null,
        programId: "program-1",
        cohortId: "cohort-1",
      }),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      programParticipantId: "program-participant-1",
      cohortParticipantId: "cohort-participant-1",
    });
    expect(result).toHaveProperty("enrollmentId", undefined);
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "programParticipant",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            programId: "program-1",
            status: LearnerParticipantStatus.ACTIVE,
            invitationId: "invitation-1",
          }),
        }),
      }),
    );
    expect(calls).toContainEqual(
      expect.objectContaining({
        model: "cohortParticipant",
        operation: "create",
        args: expect.objectContaining({
          data: expect.objectContaining({
            cohortId: "cohort-1",
            programId: "program-1",
            status: LearnerParticipantStatus.ACTIVE,
            invitationId: "invitation-1",
          }),
        }),
      }),
    );
    expect(calls.some((call) => call.model === "learnerEnrollment")).toBe(false);
  });

  it("blocks expired invitations without creating access", async () => {
    const { calls, prisma } = createPrisma({
      invitation: invitationRecord({
        expiresAt: new Date("2026-05-01T00:00:00.000Z"),
      }),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toEqual({ ok: false, reason: "INVITATION_EXPIRED" });
    expect(calls.some((call) => call.operation === "create")).toBe(false);
    expect(calls.some((call) => call.operation === "update")).toBe(false);
  });

  it("blocks a signed-in user whose email does not match the invitation", async () => {
    const { calls, prisma } = createPrisma();

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity({ email: "other@dec.local" }),
      now,
    });

    expect(result).toEqual({
      ok: false,
      reason: "SIGN_IN_WITH_INVITED_ACCOUNT",
    });
    expect(calls.some((call) => call.operation === "create")).toBe(false);
  });

  it("is idempotent when the same accepted user accepts again", async () => {
    const { calls, prisma } = createPrisma({
      invitation: invitationRecord({
        acceptedUserId: "user-1",
        programId: "program-1",
        cohortId: "cohort-1",
        status: LearnerInvitationStatus.ACCEPTED,
      }),
      enrollment: enrollmentRecord(),
      programParticipant: participantRecord("program-participant-existing"),
      cohortParticipant: participantRecord("cohort-participant-existing"),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      alreadyAccepted: true,
      enrollmentId: "enrollment-1",
      programParticipantId: "program-participant-existing",
      cohortParticipantId: "cohort-participant-existing",
    });
    expect(
      calls.some(
        (call) =>
          call.model === "learnerInvitation" && call.operation === "update",
      ),
    ).toBe(false);
    expect(calls.some((call) => call.operation === "create")).toBe(false);
  });

  it("blocks an already accepted invitation for a different user", async () => {
    const { prisma } = createPrisma({
      invitation: invitationRecord({
        acceptedUserId: "different-user",
        status: LearnerInvitationStatus.ACCEPTED,
      }),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toEqual({
      ok: false,
      reason: "SIGN_IN_WITH_INVITED_ACCOUNT",
    });
  });

  it("does not create course enrollment when the invitation has no course scope", async () => {
    const { calls, prisma } = createPrisma({
      invitation: invitationRecord({
        courseId: null,
        courseVersionId: null,
      }),
    });

    const result = await acceptLearnerInvitation(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      invitationId: "invitation-1",
    });
    expect(result).toHaveProperty("enrollmentId", undefined);
    expect(calls.some((call) => call.model === "learnerEnrollment")).toBe(false);
  });

  it("loads a safe preview without selecting or returning tokenHash", async () => {
    const { calls, prisma } = createPrisma();

    const result = await loadLearnerInvitationPreview(prisma, {
      token: rawToken,
      identity: invitedIdentity(),
      now,
    });

    expect(result).toMatchObject({
      ok: true,
      status: "READY",
      invitationId: "invitation-1",
      courseId: "course-1",
    });
    expect(calls[0]).toMatchObject({
      model: "learnerInvitation",
      operation: "findFirst",
      args: {
        where: {
          tokenHash: hashLearnerInvitationToken(rawToken),
        },
      },
    });
    expect(JSON.stringify(calls)).not.toContain(rawToken);
    expect(JSON.stringify(calls)).not.toContain("tokenHash\":true");
  });
});

type Call = {
  model: string;
  operation: string;
  args: unknown;
};

function createPrisma(
  options: {
    invitation?: ReturnType<typeof invitationRecord> | null;
    courseVersion?: ReturnType<typeof courseVersionRecord> | null;
    enrollment?: ReturnType<typeof enrollmentRecord> | null;
    programParticipant?: ReturnType<typeof participantRecord> | null;
    cohortParticipant?: ReturnType<typeof participantRecord> | null;
  } = {},
) {
  const calls: Call[] = [];
  const invitation =
    options.invitation === undefined ? invitationRecord() : options.invitation;
  const courseVersion =
    options.courseVersion === undefined
      ? courseVersionRecord()
      : options.courseVersion;
  const transaction = {
    learnerInvitation: {
      async update(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "update", args });

        return {
          ...(invitation ?? invitationRecord()),
          status: LearnerInvitationStatus.ACCEPTED,
          acceptedUserId: "user-1",
        };
      },
    },
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
    programParticipant: {
      async findUnique(args: unknown) {
        calls.push({
          model: "programParticipant",
          operation: "findUnique",
          args,
        });

        return options.programParticipant ?? null;
      },
      async create(args: unknown) {
        calls.push({ model: "programParticipant", operation: "create", args });

        return participantRecord("program-participant-1");
      },
    },
    cohortParticipant: {
      async findUnique(args: unknown) {
        calls.push({
          model: "cohortParticipant",
          operation: "findUnique",
          args,
        });

        return options.cohortParticipant ?? null;
      },
      async create(args: unknown) {
        calls.push({ model: "cohortParticipant", operation: "create", args });

        return participantRecord("cohort-participant-1");
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
    learnerInvitation: {
      async findFirst(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "findFirst", args });

        return invitation;
      },
    },
    courseVersion: {
      async findFirst(args: unknown) {
        calls.push({ model: "courseVersion", operation: "findFirst", args });

        return courseVersion;
      },
    },
    async $transaction<T>(callback: (tx: typeof transaction) => Promise<T>) {
      return callback(transaction);
    },
  } as LearnerInvitationAcceptancePrisma;

  return { calls, prisma };
}

function invitationRecord(
  overrides: Partial<{
    id: string;
    email: string;
    organizationId: string | null;
    programId: string | null;
    cohortId: string | null;
    courseId: string | null;
    courseVersionId: string | null;
    acceptedUserId: string | null;
    status: LearnerInvitationStatus;
    expiresAt: Date;
  }> = {},
) {
  return {
    id: "invitation-1",
    email: "learner@dec.local",
    organizationId: "org-1",
    programId: null,
    cohortId: null,
    courseId: "course-1",
    courseVersionId: "version-1",
    acceptedUserId: null,
    status: LearnerInvitationStatus.SENT,
    expiresAt: new Date("2026-06-01T00:00:00.000Z"),
    ...overrides,
  };
}

function courseVersionRecord() {
  return {
    id: "version-1",
    courseId: "course-1",
    course: {
      id: "course-1",
      organizationId: "org-1",
    },
  };
}

function enrollmentRecord() {
  return {
    id: "enrollment-1",
    courseId: "course-1",
    courseVersionId: "version-1",
  };
}

function participantRecord(id: string) {
  return { id };
}

function invitedIdentity(overrides: Partial<ReturnType<typeof baseIdentity>> = {}) {
  return {
    ...baseIdentity(),
    ...overrides,
  };
}

function baseIdentity() {
  return {
    userId: "user-1",
    email: "learner@dec.local",
    organizationId: "org-1",
    roles: ["learner"] as const,
  };
}

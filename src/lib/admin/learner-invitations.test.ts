import {
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerInvitationStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  adminLearnerInvitationCreationMetadata,
  createAdminLearnerInvitation,
  parseAdminLearnerInvitationForm,
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
  } = {},
) {
  const calls: Call[] = [];
  const transaction = {
    learnerInvitation: {
      async create(args: unknown) {
        calls.push({ model: "learnerInvitation", operation: "create", args });

        return { id: "invitation-1" };
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

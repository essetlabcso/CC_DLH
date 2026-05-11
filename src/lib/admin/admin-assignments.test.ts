import { describe, expect, it, vi } from "vitest";
import {
  CohortStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
  LearnerParticipantStatus,
  ProgramStatus,
} from "@prisma/client";

import {
  assignLearnerToCourse,
  assignLearnerToProgram,
  assignLearnerToCohort,
  parseAdminAssignmentForm,
  type AdminAssignmentPrisma,
} from "./admin-assignments";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function createMockPrisma(overrides: Partial<Record<string, unknown>> = {}) {
  const txMock = {
    learnerEnrollment: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockResolvedValue({ id: "enrollment-1", status: "ASSIGNED" }),
    },
    programParticipant: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockResolvedValue({ id: "pp-1", status: "ASSIGNED" }),
    },
    cohortParticipant: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi
        .fn()
        .mockResolvedValue({ id: "cp-1", status: "ASSIGNED" }),
    },
    learnerEnrollmentEvent: {
      create: vi.fn().mockResolvedValue({}),
    },
    adminAuditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  };

  return {
    prisma: {
      user: {
        findFirst: vi
          .fn()
          .mockResolvedValue({ id: "user-1", email: "learner@example.com" }),
      },
      organizationMembership: {
        findFirst: vi.fn().mockResolvedValue({ id: "membership-1" }),
      },
      courseVersion: {
        findFirst: vi.fn().mockResolvedValue({
          id: "cv-1",
          courseId: "course-1",
        }),
      },
      program: {
        findFirst: vi.fn().mockResolvedValue({
          id: "prog-1",
          status: ProgramStatus.ACTIVE,
          organizationId: "org-1",
        }),
      },
      cohort: {
        findFirst: vi.fn().mockResolvedValue({
          id: "cohort-1",
          status: CohortStatus.ACTIVE,
          programId: "prog-1",
          organizationId: "org-1",
          program: { ownerOrganizationId: "org-1" },
        }),
      },
      $transaction: vi.fn((callback: (tx: typeof txMock) => Promise<unknown>) =>
        callback(txMock),
      ),
      ...overrides,
    } as unknown as AdminAssignmentPrisma,
    tx: txMock,
  };
}

function createFormData(entries: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

// ---------------------------------------------------------------------------
// Course Assignment
// ---------------------------------------------------------------------------

describe("assignLearnerToCourse", () => {
  const baseInput = {
    email: "learner@example.com",
    courseId: "course-1",
    organizationId: "org-1",
    reason: "Assigning learner for capacity building program",
    actorId: "admin-1",
  };

  it("creates enrollment with correct source and status", async () => {
    const { prisma, tx } = createMockPrisma();
    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(false);
      expect(result.recordId).toBe("enrollment-1");
    }

    expect(tx.learnerEnrollment.create).toHaveBeenCalledOnce();
    const createCall = tx.learnerEnrollment.create.mock.calls[0][0];
    expect(createCall.data.source).toBe(
      LearnerEnrollmentSource.ADMIN_ASSIGNMENT,
    );
    expect(createCall.data.status).toBe(LearnerEnrollmentStatus.ASSIGNED);
    expect(createCall.data.assignedById).toBe("admin-1");
    expect(createCall.data.organizationId).toBe("org-1");
  });

  it("creates LearnerEnrollmentEvent with ASSIGNMENT_CREATED", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToCourse(prisma, baseInput);

    expect(tx.learnerEnrollmentEvent.create).toHaveBeenCalledOnce();
    const eventCall = tx.learnerEnrollmentEvent.create.mock.calls[0][0];
    expect(eventCall.data.eventType).toBe(
      LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
    );
    expect(eventCall.data.enrollmentId).toBe("enrollment-1");
    expect(eventCall.data.actorId).toBe("admin-1");
  });

  it("creates AdminAuditLog with ENROLLMENT_ASSIGNED", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToCourse(prisma, baseInput);

    expect(tx.adminAuditLog.create).toHaveBeenCalledOnce();
    const auditCall = tx.adminAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("ENROLLMENT_ASSIGNED");
    expect(auditCall.data.entityType).toBe("LearnerEnrollment");
    expect(auditCall.data.riskLevel).toBe("MEDIUM");
    expect(auditCall.data.reason).toBe(baseInput.reason);
  });

  it("returns existing enrollment if already assigned (idempotent)", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.learnerEnrollment.findUnique.mockResolvedValue({
      id: "existing-enrollment",
      status: LearnerEnrollmentStatus.ENROLLED,
    });

    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(true);
      expect(result.recordId).toBe("existing-enrollment");
    }
    expect(tx.learnerEnrollment.create).not.toHaveBeenCalled();
  });

  it("rejects if user not found", async () => {
    const { prisma } = createMockPrisma({
      user: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("User not found");
    }
  });

  it("rejects if no published CourseVersion", async () => {
    const { prisma } = createMockPrisma({
      courseVersion: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("No published course version");
    }
  });

  it("blocks on inactive existing enrollment without creating duplicate", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.learnerEnrollment.findUnique.mockResolvedValue({
      id: "withdrawn-enrollment",
      status: LearnerEnrollmentStatus.WITHDRAWN,
    });

    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("inactive enrollment");
    }
    expect(tx.learnerEnrollment.create).not.toHaveBeenCalled();
  });

  it("rejects if user is not a member of the selected organization", async () => {
    const { prisma } = createMockPrisma({
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToCourse(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("not an active member");
    }
  });
});

// ---------------------------------------------------------------------------
// Program Assignment
// ---------------------------------------------------------------------------

describe("assignLearnerToProgram", () => {
  const baseInput = {
    email: "learner@example.com",
    programId: "prog-1",
    organizationId: "org-1",
    reason: "Assigning learner to capacity building program",
    actorId: "admin-1",
  };

  it("creates ProgramParticipant with correct fields", async () => {
    const { prisma, tx } = createMockPrisma();
    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(false);
      expect(result.recordId).toBe("pp-1");
    }

    expect(tx.programParticipant.create).toHaveBeenCalledOnce();
    const createCall = tx.programParticipant.create.mock.calls[0][0];
    expect(createCall.data.status).toBe(LearnerParticipantStatus.ASSIGNED);
    expect(createCall.data.assignedById).toBe("admin-1");
    expect(createCall.data.organizationId).toBe("org-1");
  });

  it("creates event and audit log for program assignment", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToProgram(prisma, baseInput);

    expect(tx.learnerEnrollmentEvent.create).toHaveBeenCalledOnce();
    const eventCall = tx.learnerEnrollmentEvent.create.mock.calls[0][0];
    expect(eventCall.data.eventType).toBe(
      LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
    );
    expect(eventCall.data.programParticipantId).toBe("pp-1");

    expect(tx.adminAuditLog.create).toHaveBeenCalledOnce();
    const auditCall = tx.adminAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("PARTICIPANT_ASSIGNED_TO_PROGRAM");
    expect(auditCall.data.entityType).toBe("ProgramParticipant");
  });

  it("returns existing if already assigned (idempotent)", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.programParticipant.findUnique.mockResolvedValue({
      id: "existing-pp",
      status: LearnerParticipantStatus.ACTIVE,
    });

    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(true);
      expect(result.recordId).toBe("existing-pp");
    }
    expect(tx.programParticipant.create).not.toHaveBeenCalled();
  });

  it("rejects if user not found", async () => {
    const { prisma } = createMockPrisma({
      user: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("User not found");
    }
  });

  it("rejects if program not ACTIVE", async () => {
    const { prisma } = createMockPrisma({
      program: {
        findFirst: vi.fn().mockResolvedValue({
          id: "prog-1",
          status: ProgramStatus.DRAFT,
          organizationId: "org-1",
        }),
      },
    });

    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Only active programs");
    }
  });

  it("blocks on inactive existing participant without creating duplicate", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.programParticipant.findUnique.mockResolvedValue({
      id: "withdrawn-pp",
      status: LearnerParticipantStatus.WITHDRAWN,
    });

    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("inactive participation");
    }
    expect(tx.programParticipant.create).not.toHaveBeenCalled();
  });

  it("rejects if user is not a member of the selected organization", async () => {
    const { prisma } = createMockPrisma({
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToProgram(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("not an active member");
    }
  });
});

// ---------------------------------------------------------------------------
// Cohort Assignment
// ---------------------------------------------------------------------------

describe("assignLearnerToCohort", () => {
  const baseInput = {
    email: "learner@example.com",
    cohortId: "cohort-1",
    organizationId: "org-1",
    reason: "Assigning learner to field training cohort",
    actorId: "admin-1",
  };

  it("creates CohortParticipant with correct fields", async () => {
    const { prisma, tx } = createMockPrisma();
    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(false);
      expect(result.recordId).toBe("cp-1");
    }

    expect(tx.cohortParticipant.create).toHaveBeenCalledOnce();
    const createCall = tx.cohortParticipant.create.mock.calls[0][0];
    expect(createCall.data.status).toBe(LearnerParticipantStatus.ASSIGNED);
    expect(createCall.data.assignedById).toBe("admin-1");
    expect(createCall.data.cohortId).toBe("cohort-1");
    expect(createCall.data.programId).toBe("prog-1");
  });

  it("creates event and audit log for cohort assignment", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToCohort(prisma, baseInput);

    expect(tx.learnerEnrollmentEvent.create).toHaveBeenCalledOnce();
    const eventCall = tx.learnerEnrollmentEvent.create.mock.calls[0][0];
    expect(eventCall.data.eventType).toBe(
      LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
    );
    expect(eventCall.data.cohortParticipantId).toBe("cp-1");

    expect(tx.adminAuditLog.create).toHaveBeenCalledOnce();
    const auditCall = tx.adminAuditLog.create.mock.calls[0][0];
    expect(auditCall.data.action).toBe("PARTICIPANT_ASSIGNED_TO_COHORT");
    expect(auditCall.data.entityType).toBe("CohortParticipant");
  });

  it("returns existing if already assigned (idempotent)", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.cohortParticipant.findUnique.mockResolvedValue({
      id: "existing-cp",
      status: LearnerParticipantStatus.ACTIVE,
    });

    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.alreadyExisted).toBe(true);
      expect(result.recordId).toBe("existing-cp");
    }
    expect(tx.cohortParticipant.create).not.toHaveBeenCalled();
  });

  it("rejects if user not found", async () => {
    const { prisma } = createMockPrisma({
      user: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("User not found");
    }
  });

  it("rejects if cohort not ACTIVE", async () => {
    const { prisma } = createMockPrisma({
      cohort: {
        findFirst: vi.fn().mockResolvedValue({
          id: "cohort-1",
          status: CohortStatus.COMPLETED,
          programId: "prog-1",
          organizationId: "org-1",
          program: { ownerOrganizationId: "org-1" },
        }),
      },
    });

    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Only active cohorts");
    }
  });

  it("derives organizationId from input", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToCohort(prisma, baseInput);

    const createCall = tx.cohortParticipant.create.mock.calls[0][0];
    expect(createCall.data.organizationId).toBe("org-1");
  });

  it("blocks on inactive existing participant without creating duplicate", async () => {
    const { prisma, tx } = createMockPrisma();
    tx.cohortParticipant.findUnique.mockResolvedValue({
      id: "withdrawn-cp",
      status: LearnerParticipantStatus.WITHDRAWN,
    });

    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("inactive participation");
    }
    expect(tx.cohortParticipant.create).not.toHaveBeenCalled();
  });

  it("rejects if user is not a member of the selected organization", async () => {
    const { prisma } = createMockPrisma({
      organizationMembership: { findFirst: vi.fn().mockResolvedValue(null) },
    });

    const result = await assignLearnerToCohort(prisma, baseInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("not an active member");
    }
  });
});

// ---------------------------------------------------------------------------
// Form Parser
// ---------------------------------------------------------------------------

describe("parseAdminAssignmentForm", () => {
  it("parses valid course form correctly", () => {
    const formData = createFormData({
      email: "learner@example.com",
      courseId: "course-1",
      organizationId: "org-1",
      reason: "Assigning for capacity building program",
    });

    const result = parseAdminAssignmentForm(formData, "course");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("learner@example.com");
      expect(result.data.targetId).toBe("course-1");
      expect(result.data.organizationId).toBe("org-1");
    }
  });

  it("rejects missing email", () => {
    const formData = createFormData({
      courseId: "course-1",
      organizationId: "org-1",
      reason: "Assigning for capacity building program",
    });

    const result = parseAdminAssignmentForm(formData, "course");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("email");
    }
  });

  it("rejects missing target", () => {
    const formData = createFormData({
      email: "learner@example.com",
      organizationId: "org-1",
      reason: "Assigning for capacity building program",
    });

    const result = parseAdminAssignmentForm(formData, "course");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("course");
    }
  });

  it("rejects short reason", () => {
    const formData = createFormData({
      email: "learner@example.com",
      courseId: "course-1",
      organizationId: "org-1",
      reason: "Short",
    });

    const result = parseAdminAssignmentForm(formData, "course");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("10 characters");
    }
  });

  it("requires organizationId for cohort assignments", () => {
    const formData = createFormData({
      email: "learner@example.com",
      cohortId: "cohort-1",
      reason: "Assigning for field training cohort",
    });

    const result = parseAdminAssignmentForm(formData, "cohort");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("organization");
    }
  });

  it("accepts cohort form with organizationId", () => {
    const formData = createFormData({
      email: "learner@example.com",
      cohortId: "cohort-1",
      organizationId: "org-1",
      reason: "Assigning for field training cohort",
    });

    const result = parseAdminAssignmentForm(formData, "cohort");

    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Data Safety
// ---------------------------------------------------------------------------

describe("data safety", () => {
  it("audit afterJson never contains tokenHash, metadata, rawProof, finalAnswer, or finalScore", async () => {
    const { prisma, tx } = createMockPrisma();
    await assignLearnerToCourse(prisma, {
      email: "learner@example.com",
      courseId: "course-1",
      organizationId: "org-1",
      reason: "Assigning for capacity building program",
      actorId: "admin-1",
    });

    const auditCall = tx.adminAuditLog.create.mock.calls[0][0];
    const afterJson = auditCall.data.afterJson as string;

    expect(afterJson).not.toContain("tokenHash");
    expect(afterJson).not.toContain("rawProof");
    expect(afterJson).not.toContain("finalAnswer");
    expect(afterJson).not.toContain("finalScore");
    expect(afterJson).not.toContain('"metadata"');
  });
});

import {
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
  LearnerParticipantStatus,
  ProgramStatus,
  CohortStatus,
} from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AdminCourseAssignmentInput = {
  email: string;
  courseId: string;
  organizationId: string;
  reason: string;
  actorId: string;
};

export type AdminProgramAssignmentInput = {
  email: string;
  programId: string;
  organizationId: string;
  reason: string;
  actorId: string;
};

export type AdminCohortAssignmentInput = {
  email: string;
  cohortId: string;
  organizationId: string;
  reason: string;
  actorId: string;
};

export type AdminAssignmentResult =
  | {
      ok: true;
      message: string;
      recordId: string;
      alreadyExisted: boolean;
    }
  | {
      ok: false;
      message: string;
    };

export type ParsedAdminAssignmentForm =
  | {
      ok: true;
      data: {
        email: string;
        targetId: string;
        organizationId: string;
        reason: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumReasonLength = 10;

const adminAssignmentMetadata = JSON.stringify({
  source: "admin-direct-assignment",
});

const activeEnrollmentStatuses = [
  LearnerEnrollmentStatus.ASSIGNED,
  LearnerEnrollmentStatus.ENROLLED,
  LearnerEnrollmentStatus.STARTED,
  LearnerEnrollmentStatus.COMPLETED,
] as const;

const activeParticipantStatuses = [
  LearnerParticipantStatus.ASSIGNED,
  LearnerParticipantStatus.ACTIVE,
  LearnerParticipantStatus.COMPLETED,
] as const;

// ---------------------------------------------------------------------------
// Prisma type surface (for testability)
// ---------------------------------------------------------------------------

type FindFirstArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

type FindUniqueArgs = {
  where: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type CreateArgs = {
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type UserRecord = {
  id: string;
  email: string;
};

type AssignmentTransaction = {
  learnerEnrollment: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique(args: FindUniqueArgs): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(args: CreateArgs): Promise<any>;
  };
  programParticipant: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique(args: FindUniqueArgs): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(args: CreateArgs): Promise<any>;
  };
  cohortParticipant: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique(args: FindUniqueArgs): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(args: CreateArgs): Promise<any>;
  };
  learnerEnrollmentEvent: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(args: CreateArgs): Promise<any>;
  };
  adminAuditLog: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(args: CreateArgs): Promise<any>;
  };
};

export type AdminAssignmentPrisma = {
  user: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args: FindFirstArgs): Promise<any>;
  };
  organizationMembership: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args: FindFirstArgs): Promise<any>;
  };
  courseVersion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args: FindFirstArgs): Promise<any>;
  };
  program: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args: FindFirstArgs): Promise<any>;
  };
  cohort: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findFirst(args: FindFirstArgs): Promise<any>;
  };
  $transaction<T>(
    callback: (transaction: AssignmentTransaction) => Promise<T>,
  ): Promise<T>;
};

// ---------------------------------------------------------------------------
// Course Assignment
// ---------------------------------------------------------------------------

export async function assignLearnerToCourse(
  prisma: AdminAssignmentPrisma,
  input: AdminCourseAssignmentInput,
): Promise<AdminAssignmentResult> {
  const user = await lookupUserByEmail(prisma, input.email);

  if (!user) {
    return {
      ok: false,
      message:
        "User not found. Only existing users can be assigned to courses.",
    };
  }

  const membership = await verifyUserOrgMembership(
    prisma,
    user.id,
    input.organizationId,
  );

  if (!membership) {
    return {
      ok: false,
      message:
        "User is not an active member of the selected organization.",
    };
  }

  const courseVersion = await prisma.courseVersion.findFirst({
    where: {
      courseId: input.courseId,
      course: { organizationId: input.organizationId },
      status: CourseVersionStatus.PUBLISHED,
    },
    select: courseVersionSelect,
    orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
  });

  if (!courseVersion) {
    return {
      ok: false,
      message:
        "No published course version found for this organization. Only published courses can be assigned.",
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.learnerEnrollment.findUnique({
      where: {
        userId_courseVersionId: {
          userId: user.id,
          courseVersionId: courseVersion.id,
        },
      },
      select: enrollmentSelect,
    });

    if (existing && isActiveEnrollment(existing.status)) {
      return {
        ok: true,
        message:
          "Learner already has an active enrollment for this course version.",
        recordId: existing.id,
        alreadyExisted: true,
      };
    }

    if (existing) {
      return {
        ok: false,
        message:
          "Learner has an inactive enrollment for this course version. Reactivation is not yet supported — contact support or manage status manually.",
      };
    }

    const now = new Date();
    const enrollment = await tx.learnerEnrollment.create({
      data: {
        userId: user.id,
        courseId: input.courseId,
        courseVersionId: courseVersion.id,
        organizationId: input.organizationId,
        assignedById: input.actorId,
        source: LearnerEnrollmentSource.ADMIN_ASSIGNMENT,
        status: LearnerEnrollmentStatus.ASSIGNED,
        enrolledAt: now,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
      select: enrollmentSelect,
    });

    await tx.learnerEnrollmentEvent.create({
      data: {
        enrollmentId: enrollment.id,
        actorId: input.actorId,
        eventType: LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
        toStatus: LearnerEnrollmentStatus.ASSIGNED,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ENROLLMENT_ASSIGNED",
        actorId: input.actorId,
        afterJson: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          courseId: input.courseId,
          courseVersionId: courseVersion.id,
          organizationId: input.organizationId,
          source: LearnerEnrollmentSource.ADMIN_ASSIGNMENT,
        }),
        entityId: enrollment.id,
        entityType: "LearnerEnrollment",
        reason: input.reason,
        riskLevel: "MEDIUM",
      },
    });

    return {
      ok: true,
      message: "Learner assigned to course successfully.",
      recordId: enrollment.id,
      alreadyExisted: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Program Assignment
// ---------------------------------------------------------------------------

export async function assignLearnerToProgram(
  prisma: AdminAssignmentPrisma,
  input: AdminProgramAssignmentInput,
): Promise<AdminAssignmentResult> {
  const user = await lookupUserByEmail(prisma, input.email);

  if (!user) {
    return {
      ok: false,
      message:
        "User not found. Only existing users can be assigned to programs.",
    };
  }

  const membership = await verifyUserOrgMembership(
    prisma,
    user.id,
    input.organizationId,
  );

  if (!membership) {
    return {
      ok: false,
      message:
        "User is not an active member of the selected organization.",
    };
  }

  const program = await prisma.program.findFirst({
    where: { id: input.programId },
    select: programSelect,
  });

  if (!program) {
    return { ok: false, message: "Program not found." };
  }

  if (program.status !== ProgramStatus.ACTIVE) {
    return {
      ok: false,
      message: "Only active programs can receive participant assignments.",
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.programParticipant.findUnique({
      where: {
        programId_userId: {
          programId: input.programId,
          userId: user.id,
        },
      },
      select: participantSelect,
    });

    if (existing && isActiveParticipant(existing.status)) {
      return {
        ok: true,
        message: "Learner is already an active participant in this program.",
        recordId: existing.id,
        alreadyExisted: true,
      };
    }

    if (existing) {
      return {
        ok: false,
        message:
          "Learner has an inactive participation record for this program. Reactivation is not yet supported — contact support or manage status manually.",
      };
    }

    const now = new Date();
    const participant = await tx.programParticipant.create({
      data: {
        programId: input.programId,
        organizationId: input.organizationId,
        userId: user.id,
        assignedById: input.actorId,
        status: LearnerParticipantStatus.ASSIGNED,
        joinedAt: now,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
      select: participantSelect,
    });

    await tx.learnerEnrollmentEvent.create({
      data: {
        programParticipantId: participant.id,
        actorId: input.actorId,
        eventType: LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
        toStatus: LearnerParticipantStatus.ASSIGNED,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "PARTICIPANT_ASSIGNED_TO_PROGRAM",
        actorId: input.actorId,
        afterJson: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          programId: input.programId,
          organizationId: input.organizationId,
          source: "ADMIN_ASSIGNMENT",
        }),
        entityId: participant.id,
        entityType: "ProgramParticipant",
        reason: input.reason,
        riskLevel: "MEDIUM",
      },
    });

    return {
      ok: true,
      message: "Learner assigned to program successfully.",
      recordId: participant.id,
      alreadyExisted: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Cohort Assignment
// ---------------------------------------------------------------------------

export async function assignLearnerToCohort(
  prisma: AdminAssignmentPrisma,
  input: AdminCohortAssignmentInput,
): Promise<AdminAssignmentResult> {
  const user = await lookupUserByEmail(prisma, input.email);

  if (!user) {
    return {
      ok: false,
      message:
        "User not found. Only existing users can be assigned to cohorts.",
    };
  }

  const membership = await verifyUserOrgMembership(
    prisma,
    user.id,
    input.organizationId,
  );

  if (!membership) {
    return {
      ok: false,
      message:
        "User is not an active member of the selected organization.",
    };
  }

  const cohort = await prisma.cohort.findFirst({
    where: { id: input.cohortId },
    select: cohortSelect,
  });

  if (!cohort) {
    return { ok: false, message: "Cohort not found." };
  }

  if (cohort.status !== CohortStatus.ACTIVE) {
    return {
      ok: false,
      message: "Only active cohorts can receive participant assignments.",
    };
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.cohortParticipant.findUnique({
      where: {
        cohortId_userId: {
          cohortId: input.cohortId,
          userId: user.id,
        },
      },
      select: participantSelect,
    });

    if (existing && isActiveParticipant(existing.status)) {
      return {
        ok: true,
        message: "Learner is already an active participant in this cohort.",
        recordId: existing.id,
        alreadyExisted: true,
      };
    }

    if (existing) {
      return {
        ok: false,
        message:
          "Learner has an inactive participation record for this cohort. Reactivation is not yet supported — contact support or manage status manually.",
      };
    }

    const now = new Date();
    const participant = await tx.cohortParticipant.create({
      data: {
        cohortId: input.cohortId,
        programId: cohort.programId,
        organizationId: input.organizationId,
        userId: user.id,
        assignedById: input.actorId,
        status: LearnerParticipantStatus.ASSIGNED,
        joinedAt: now,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
      select: participantSelect,
    });

    await tx.learnerEnrollmentEvent.create({
      data: {
        cohortParticipantId: participant.id,
        actorId: input.actorId,
        eventType: LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
        toStatus: LearnerParticipantStatus.ASSIGNED,
        reason: input.reason,
        metadata: adminAssignmentMetadata,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "PARTICIPANT_ASSIGNED_TO_COHORT",
        actorId: input.actorId,
        afterJson: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          cohortId: input.cohortId,
          programId: cohort.programId,
          organizationId: input.organizationId,
          source: "ADMIN_ASSIGNMENT",
        }),
        entityId: participant.id,
        entityType: "CohortParticipant",
        reason: input.reason,
        riskLevel: "MEDIUM",
      },
    });

    return {
      ok: true,
      message: "Learner assigned to cohort successfully.",
      recordId: participant.id,
      alreadyExisted: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Form Parser
// ---------------------------------------------------------------------------

export function parseAdminAssignmentForm(
  formData: FormData,
  type: "course" | "program" | "cohort",
): ParsedAdminAssignmentForm {
  const email = formData.get("email")?.toString().trim() ?? "";
  const reason = formData.get("reason")?.toString().trim() ?? "";
  const organizationId =
    formData.get("organizationId")?.toString().trim() ?? "";

  const targetKey =
    type === "course"
      ? "courseId"
      : type === "program"
        ? "programId"
        : "cohortId";
  const targetId = formData.get(targetKey)?.toString().trim() ?? "";

  if (!email || !emailPattern.test(email)) {
    return { ok: false, message: "A valid email address is required." };
  }

  if (!targetId) {
    return {
      ok: false,
      message: `Select a ${type} to assign the learner to.`,
    };
  }

  if (!organizationId) {
    return { ok: false, message: "Select an organization." };
  }

  if (!reason || reason.length < minimumReasonLength) {
    return {
      ok: false,
      message: `A reason of at least ${minimumReasonLength} characters is required.`,
    };
  }

  return {
    ok: true,
    data: {
      email,
      targetId,
      organizationId,
      reason,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function lookupUserByEmail(
  prisma: Pick<AdminAssignmentPrisma, "user">,
  email: string,
): Promise<UserRecord | null> {
  return prisma.user.findFirst({
    where: { email: email.trim().toLowerCase() },
    select: userSelect,
  });
}

async function verifyUserOrgMembership(
  prisma: Pick<AdminAssignmentPrisma, "organizationMembership">,
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const membership = await prisma.organizationMembership.findFirst({
    where: { userId, organizationId, status: "ACTIVE" },
    select: { id: true },
  });
  return membership !== null;
}

function isActiveEnrollment(status: LearnerEnrollmentStatus): boolean {
  return (activeEnrollmentStatuses as readonly LearnerEnrollmentStatus[]).includes(
    status,
  );
}

function isActiveParticipant(status: LearnerParticipantStatus): boolean {
  return (activeParticipantStatuses as readonly LearnerParticipantStatus[]).includes(
    status,
  );
}

// ---------------------------------------------------------------------------
// Select clauses
// ---------------------------------------------------------------------------

const userSelect = {
  id: true,
  email: true,
} as const;

const courseVersionSelect = {
  id: true,
  courseId: true,
} as const;

const enrollmentSelect = {
  id: true,
  status: true,
} as const;

const participantSelect = {
  id: true,
  status: true,
} as const;

const programSelect = {
  id: true,
  status: true,
  ownerOrganizationId: true,
} as const;

const cohortSelect = {
  id: true,
  status: true,
  programId: true,
  organizationId: true,
  program: {
    select: {
      ownerOrganizationId: true,
    },
  },
} as const;

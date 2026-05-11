import {
  CourseStatus,
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentStatus,
  LearnerInvitationStatus,
  LearnerParticipantStatus,
} from "@prisma/client";

import {
  generateLearnerInvitationToken,
  hashLearnerInvitationToken,
} from "@/lib/learner/invitations";

export const adminLearnerInvitationCreationReason =
  "Admin learner invitation created";
export const adminLearnerInvitationCreationMetadata = JSON.stringify({
  source: "admin-learner-invitation",
});
export const adminLearnerInvitationStatusMetadata = JSON.stringify({
  source: "admin-learner-invitation-status",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cancellableInvitationStatuses = [
  LearnerInvitationStatus.CREATED,
  LearnerInvitationStatus.SENT,
  LearnerInvitationStatus.PENDING_ACCEPTANCE,
] as const;
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

export type AdminLearnerInvitationOption = {
  id: string;
  label: string;
};

export type AdminLearnerInvitationCourseVersionOption =
  AdminLearnerInvitationOption & {
    courseId: string;
  };

export type AdminLearnerInvitationSummary = {
  id: string;
  email: string;
  status: string;
  organizationName: string;
  programName: string | null;
  cohortName: string | null;
  courseTitle: string | null;
  courseVersionLabel: string | null;
  invitedByName: string;
  invitedByEmail: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  canCancel: boolean;
  canRevoke: boolean;
};

export type AdminLearnerInvitationWorkspace = {
  invitations: AdminLearnerInvitationSummary[];
  options: {
    organizations: AdminLearnerInvitationOption[];
    programs: AdminLearnerInvitationOption[];
    cohorts: AdminLearnerInvitationOption[];
    courses: AdminLearnerInvitationOption[];
    courseVersions: AdminLearnerInvitationCourseVersionOption[];
  };
};

export type ParsedAdminLearnerInvitationForm =
  | {
      ok: true;
      data: {
        email: string;
        organizationId: string;
        programId: string | null;
        cohortId: string | null;
        courseId: string | null;
        courseVersionId: string | null;
        expiresAt: Date;
        reason: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

export type AdminCreateLearnerInvitationInput =
  Extract<ParsedAdminLearnerInvitationForm, { ok: true }>["data"] & {
    invitedById: string;
    now?: Date;
  };

export type AdminCreateLearnerInvitationResult =
  | {
      ok: true;
      invitationId: string;
      rawToken: string;
    }
  | {
      ok: false;
      message: string;
    };

export type AdminLearnerInvitationStatusResult =
  | {
      ok: true;
      invitationId: string;
      status: LearnerInvitationStatus;
      suspendedEnrollments: number;
      suspendedProgramParticipants: number;
      suspendedCohortParticipants: number;
    }
  | {
      ok: false;
      message: string;
    };

export type AdminLearnerInvitationStatusInput = {
  invitationId: string;
  actorId: string;
  reason: string;
  now?: Date;
};

type FindUniqueArgs = {
  where: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type FindFirstArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

type CreateArgs = {
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type UpdateArgs = {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type UpdateManyArgs = {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
};

type AdminLearnerInvitationTransaction = {
  learnerInvitation: {
    findUnique(args: FindUniqueArgs): Promise<InvitationStatusRecord | null>;
    create(args: CreateArgs): Promise<{ id: string }>;
    update(args: UpdateArgs): Promise<InvitationStatusRecord>;
  };
  learnerEnrollment: {
    findMany(args: FindFirstArgs): Promise<LinkedStatusRecord[]>;
    updateMany(args: UpdateManyArgs): Promise<{ count: number }>;
  };
  programParticipant: {
    findMany(args: FindFirstArgs): Promise<LinkedStatusRecord[]>;
    updateMany(args: UpdateManyArgs): Promise<{ count: number }>;
  };
  cohortParticipant: {
    findMany(args: FindFirstArgs): Promise<LinkedStatusRecord[]>;
    updateMany(args: UpdateManyArgs): Promise<{ count: number }>;
  };
  learnerEnrollmentEvent: {
    create(args: CreateArgs): Promise<unknown>;
  };
  adminAuditLog: {
    create(args: CreateArgs): Promise<unknown>;
  };
};

export type AdminLearnerInvitationPrisma = {
  organization: {
    findUnique(args: FindUniqueArgs): Promise<{ id: string } | null>;
    findMany?(args: Record<string, unknown>): Promise<OrganizationOptionRecord[]>;
  };
  program: {
    findUnique(args: FindUniqueArgs): Promise<ProgramValidationRecord | null>;
    findMany?(args: Record<string, unknown>): Promise<ProgramOptionRecord[]>;
  };
  cohort: {
    findUnique(args: FindUniqueArgs): Promise<CohortValidationRecord | null>;
    findMany?(args: Record<string, unknown>): Promise<CohortOptionRecord[]>;
  };
  course: {
    findUnique(args: FindUniqueArgs): Promise<CourseValidationRecord | null>;
    findMany?(args: Record<string, unknown>): Promise<CourseOptionRecord[]>;
  };
  courseVersion: {
    findFirst(args: FindFirstArgs): Promise<CourseVersionValidationRecord | null>;
    findMany?(args: Record<string, unknown>): Promise<CourseVersionOptionRecord[]>;
  };
  learnerInvitation: {
    findMany?(args: Record<string, unknown>): Promise<LearnerInvitationListRecord[]>;
  };
  $transaction<T>(
    callback: (transaction: AdminLearnerInvitationTransaction) => Promise<T>,
  ): Promise<T>;
};

type ProgramValidationRecord = {
  id: string;
  ownerOrganizationId: string | null;
  organizations: {
    organizationId: string;
  }[];
};

type CohortValidationRecord = {
  id: string;
  programId: string | null;
  organizationId: string | null;
};

type CourseValidationRecord = {
  id: string;
  organizationId: string;
};

type CourseVersionValidationRecord = {
  id: string;
  courseId: string;
  status: CourseVersionStatus;
  course: {
    id: string;
    organizationId: string;
  };
};

type OrganizationOptionRecord = {
  id: string;
  name: string;
  status: string;
};

type ProgramOptionRecord = {
  id: string;
  name: string;
  code: string | null;
  status: string;
};

type CohortOptionRecord = {
  id: string;
  name: string;
  status: string;
};

type CourseOptionRecord = {
  id: string;
  title: string;
  organization: {
    name: string;
  };
};

type CourseVersionOptionRecord = {
  id: string;
  courseId: string;
  versionNumber: number;
  course: {
    title: string;
  };
};

type LearnerInvitationListRecord = {
  id: string;
  email: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  organization: {
    name: string;
  } | null;
  program: {
    name: string;
    code: string | null;
  } | null;
  cohort: {
    name: string;
  } | null;
  course: {
    title: string;
  } | null;
  courseVersion: {
    versionNumber: number;
    status: string;
  } | null;
  invitedBy: {
    name: string;
    email: string;
  };
};

type InvitationStatusRecord = {
  id: string;
  status: LearnerInvitationStatus;
  acceptedAt: Date | null;
};

type LinkedStatusRecord = {
  id: string;
  status: string;
};

export function parseAdminLearnerInvitationForm(
  formData: FormData,
  options: { now?: Date } = {},
): ParsedAdminLearnerInvitationForm {
  const email = readString(formData, "email").toLowerCase();
  const organizationId = readString(formData, "organizationId");
  const programId = readOptionalString(formData, "programId");
  const cohortId = readOptionalString(formData, "cohortId");
  const courseId = readOptionalString(formData, "courseId");
  const courseVersionId = readOptionalString(formData, "courseVersionId");
  const expiresAtRaw = readString(formData, "expiresAt");
  const reason = readOptionalString(formData, "reason") ?? "";
  const now = options.now ?? new Date();

  if (!emailPattern.test(email)) {
    return { ok: false, message: "Enter a valid invited email address." };
  }

  if (!organizationId) {
    return { ok: false, message: "Choose an organization." };
  }

  if (!expiresAtRaw) {
    return { ok: false, message: "Choose an invitation expiry date." };
  }

  const expiresAt = new Date(expiresAtRaw);

  if (Number.isNaN(expiresAt.getTime())) {
    return { ok: false, message: "Choose a valid invitation expiry date." };
  }

  if (expiresAt <= now) {
    return { ok: false, message: "Invitation expiry must be in the future." };
  }

  return {
    ok: true,
    data: {
      email,
      organizationId,
      programId,
      cohortId,
      courseId,
      courseVersionId,
      expiresAt,
      reason,
    },
  };
}

export function parseAdminLearnerInvitationStatusReason(formData: FormData) {
  const reason = readString(formData, "reason");

  if (!reason) {
    return {
      ok: false,
      message: "Enter a reason for this invitation status change.",
    } as const;
  }

  return {
    ok: true,
    reason,
  } as const;
}

export async function createAdminLearnerInvitation(
  prisma: AdminLearnerInvitationPrisma,
  input: AdminCreateLearnerInvitationInput,
): Promise<AdminCreateLearnerInvitationResult> {
  const scope = await resolveLearnerInvitationScope(prisma, input);

  if (!scope.ok) {
    return scope;
  }

  const rawToken = generateLearnerInvitationToken();
  const tokenHash = hashLearnerInvitationToken(rawToken);
  const reason = input.reason || adminLearnerInvitationCreationReason;

  const invitation = await prisma.$transaction(async (transaction) => {
    const created = await transaction.learnerInvitation.create({
      data: {
        email: input.email,
        organizationId: input.organizationId,
        programId: input.programId,
        cohortId: input.cohortId,
        courseId: scope.courseId,
        courseVersionId: scope.courseVersionId,
        invitedById: input.invitedById,
        tokenHash,
        status: LearnerInvitationStatus.CREATED,
        expiresAt: input.expiresAt,
        reason,
        metadata: adminLearnerInvitationCreationMetadata,
      },
      select: {
        id: true,
      },
    });

    await transaction.learnerEnrollmentEvent.create({
      data: {
        invitationId: created.id,
        actorId: input.invitedById,
        eventType: LearnerEnrollmentEventType.INVITATION_CREATED,
        toStatus: LearnerInvitationStatus.CREATED,
        reason,
        metadata: adminLearnerInvitationCreationMetadata,
      },
    });

    return created;
  });

  return {
    ok: true,
    invitationId: invitation.id,
    rawToken,
  };
}

export async function cancelAdminLearnerInvitation(
  prisma: AdminLearnerInvitationPrisma,
  input: AdminLearnerInvitationStatusInput,
): Promise<AdminLearnerInvitationStatusResult> {
  return updateAdminLearnerInvitationAccessStatus(prisma, {
    ...input,
    targetStatus: LearnerInvitationStatus.CANCELLED,
  });
}

export async function revokeAdminLearnerInvitation(
  prisma: AdminLearnerInvitationPrisma,
  input: AdminLearnerInvitationStatusInput,
): Promise<AdminLearnerInvitationStatusResult> {
  return updateAdminLearnerInvitationAccessStatus(prisma, {
    ...input,
    targetStatus: LearnerInvitationStatus.REVOKED,
  });
}

export async function getAdminLearnerInvitationWorkspace(
  prisma: AdminLearnerInvitationPrisma,
): Promise<AdminLearnerInvitationWorkspace> {
  const [
    invitations,
    organizations,
    programs,
    cohorts,
    courses,
    courseVersions,
  ] = await Promise.all([
    prisma.learnerInvitation.findMany?.({
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        organization: {
          select: {
            name: true,
          },
        },
        program: {
          select: {
            name: true,
            code: true,
          },
        },
        cohort: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
        courseVersion: {
          select: {
            versionNumber: true,
            status: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 50,
    }) ?? [],
    prisma.organization.findMany?.({
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: [{ name: "asc" }],
    }) ?? [],
    prisma.program.findMany?.({
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
      },
      orderBy: [{ name: "asc" }],
    }) ?? [],
    prisma.cohort.findMany?.({
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: [{ name: "asc" }],
    }) ?? [],
    prisma.course.findMany?.({
      where: {
        status: CourseStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ title: "asc" }],
    }) ?? [],
    prisma.courseVersion.findMany?.({
      where: {
        status: CourseVersionStatus.PUBLISHED,
      },
      select: {
        id: true,
        courseId: true,
        versionNumber: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: [{ courseId: "asc" }, { versionNumber: "desc" }],
    }) ?? [],
  ]);

  return {
    invitations: invitations.map(toInvitationSummary),
    options: {
      organizations: organizations.map((organization) => ({
        id: String(organization.id),
        label: `${organization.name} (${organization.status})`,
      })),
      programs: programs.map((program) => ({
        id: String(program.id),
        label: `${program.name}${
          program.code ? ` (${program.code})` : ""
        } - ${program.status}`,
      })),
      cohorts: cohorts.map((cohort) => ({
        id: String(cohort.id),
        label: `${cohort.name} (${cohort.status})`,
      })),
      courses: courses.map((course) => ({
        id: String(course.id),
        label: `${course.title} - ${course.organization.name}`,
      })),
      courseVersions: courseVersions.map((version) => ({
        id: String(version.id),
        courseId: String(version.courseId),
        label: `${version.course.title} - v${version.versionNumber}`,
      })),
    },
  };
}

async function resolveLearnerInvitationScope(
  prisma: AdminLearnerInvitationPrisma,
  input: AdminCreateLearnerInvitationInput,
): Promise<
  | {
      ok: true;
      courseId: string | null;
      courseVersionId: string | null;
    }
  | {
      ok: false;
      message: string;
    }
> {
  const organization = await prisma.organization.findUnique({
    where: {
      id: input.organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!organization) {
    return { ok: false, message: "Choose an existing organization." };
  }

  if (input.programId) {
    const program = await prisma.program.findUnique({
      where: {
        id: input.programId,
      },
      select: {
        id: true,
        ownerOrganizationId: true,
        organizations: {
          where: {
            organizationId: input.organizationId,
          },
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!program) {
      return { ok: false, message: "Choose an existing program." };
    }

    const organizationLinked =
      program.ownerOrganizationId === input.organizationId ||
      program.organizations.some(
        (participant) => participant.organizationId === input.organizationId,
      );

    if (!organizationLinked) {
      return {
        ok: false,
        message: "Choose a program linked to the selected organization.",
      };
    }
  }

  if (input.cohortId) {
    const cohort = await prisma.cohort.findUnique({
      where: {
        id: input.cohortId,
      },
      select: {
        id: true,
        programId: true,
        organizationId: true,
      },
    });

    if (!cohort) {
      return { ok: false, message: "Choose an existing cohort." };
    }

    if (input.programId && cohort.programId !== input.programId) {
      return {
        ok: false,
        message: "Choose a cohort linked to the selected program.",
      };
    }

    if (cohort.organizationId && cohort.organizationId !== input.organizationId) {
      return {
        ok: false,
        message: "Choose a cohort linked to the selected organization.",
      };
    }
  }

  const course = input.courseId
    ? await prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
        select: {
          id: true,
          organizationId: true,
        },
      })
    : null;

  if (input.courseId && !course) {
    return { ok: false, message: "Choose an existing course." };
  }

  if (course && course.organizationId !== input.organizationId) {
    return {
      ok: false,
      message: "Choose a course owned by the selected organization.",
    };
  }

  const courseVersion = input.courseVersionId
    ? await prisma.courseVersion.findFirst({
        where: {
          id: input.courseVersionId,
        },
        select: courseVersionValidationSelect,
      })
    : input.courseId
      ? await prisma.courseVersion.findFirst({
          where: {
            courseId: input.courseId,
            status: CourseVersionStatus.PUBLISHED,
          },
          select: courseVersionValidationSelect,
          orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
        })
      : null;

  if ((input.courseId || input.courseVersionId) && !courseVersion) {
    return {
      ok: false,
      message: "Choose a published course version for the selected course.",
    };
  }

  if (courseVersion && courseVersion.status !== CourseVersionStatus.PUBLISHED) {
    return {
      ok: false,
      message: "Choose a published course version.",
    };
  }

  if (
    input.courseId &&
    courseVersion &&
    courseVersion.courseId !== input.courseId
  ) {
    return {
      ok: false,
      message: "Choose a course version linked to the selected course.",
    };
  }

  if (
    courseVersion &&
    courseVersion.course.organizationId !== input.organizationId
  ) {
    return {
      ok: false,
      message:
        "Choose a course version owned by the selected organization.",
    };
  }

  return {
    ok: true,
    courseId: courseVersion?.courseId ?? input.courseId,
    courseVersionId: courseVersion?.id ?? null,
  };
}

function toInvitationSummary(invitation: LearnerInvitationListRecord) {
  return {
    id: String(invitation.id),
    email: String(invitation.email),
    status: String(invitation.status),
    organizationName: invitation.organization?.name ?? "Not linked",
    programName: invitation.program
      ? `${invitation.program.name}${
          invitation.program.code ? ` (${invitation.program.code})` : ""
        }`
      : null,
    cohortName: invitation.cohort?.name ?? null,
    courseTitle: invitation.course?.title ?? null,
    courseVersionLabel: invitation.courseVersion
      ? `v${invitation.courseVersion.versionNumber} - ${invitation.courseVersion.status}`
      : null,
    invitedByName: invitation.invitedBy?.name ?? "Unknown",
    invitedByEmail: invitation.invitedBy?.email ?? "",
    createdAt: invitation.createdAt,
    expiresAt: invitation.expiresAt,
    acceptedAt: invitation.acceptedAt ?? null,
    canCancel: cancellableInvitationStatuses.includes(
      invitation.status as (typeof cancellableInvitationStatuses)[number],
    ),
    canRevoke: invitation.status === LearnerInvitationStatus.ACCEPTED,
  } satisfies AdminLearnerInvitationSummary;
}

async function updateAdminLearnerInvitationAccessStatus(
  prisma: AdminLearnerInvitationPrisma,
  input: AdminLearnerInvitationStatusInput & {
    targetStatus: LearnerInvitationStatus;
  },
): Promise<AdminLearnerInvitationStatusResult> {
  if (!input.reason.trim()) {
    return {
      ok: false,
      message: "Enter a reason for this invitation status change.",
    };
  }

  const now = input.now ?? new Date();

  return prisma.$transaction(async (transaction) => {
    const invitation = await transaction.learnerInvitation.findUnique({
      where: {
        id: input.invitationId,
      },
      select: invitationStatusSelect,
    });

    if (!invitation) {
      return {
        ok: false,
        message: "Invitation was not found.",
      };
    }

    if (
      input.targetStatus === LearnerInvitationStatus.CANCELLED &&
      !cancellableInvitationStatuses.includes(
        invitation.status as (typeof cancellableInvitationStatuses)[number],
      )
    ) {
      return {
        ok: false,
        message: "Only pending invitations can be cancelled.",
      };
    }

    if (
      input.targetStatus === LearnerInvitationStatus.REVOKED &&
      invitation.status !== LearnerInvitationStatus.ACCEPTED
    ) {
      return {
        ok: false,
        message: "Only accepted invitations can be revoked.",
      };
    }

    const updated = await transaction.learnerInvitation.update({
      where: {
        id: invitation.id,
      },
      data:
        input.targetStatus === LearnerInvitationStatus.CANCELLED
          ? {
              status: LearnerInvitationStatus.CANCELLED,
              cancelledAt: now,
              reason: input.reason,
            }
          : {
              status: LearnerInvitationStatus.REVOKED,
              revokedAt: now,
              reason: input.reason,
            },
      select: invitationStatusSelect,
    });

    await transaction.adminAuditLog.create({
      data: {
        action:
          input.targetStatus === LearnerInvitationStatus.CANCELLED
            ? "LEARNER_INVITATION_CANCELLED"
            : "LEARNER_INVITATION_REVOKED",
        actorId: input.actorId,
        beforeJson: JSON.stringify({ status: invitation.status }),
        afterJson: JSON.stringify({ status: updated.status }),
        entityId: invitation.id,
        entityType: "LearnerInvitation",
        reason: input.reason,
        riskLevel:
          input.targetStatus === LearnerInvitationStatus.REVOKED
            ? "MEDIUM"
            : "LOW",
        metadata: adminLearnerInvitationStatusMetadata,
      },
    });

    if (input.targetStatus === LearnerInvitationStatus.CANCELLED) {
      return {
        ok: true,
        invitationId: updated.id,
        status: updated.status,
        suspendedEnrollments: 0,
        suspendedProgramParticipants: 0,
        suspendedCohortParticipants: 0,
      };
    }

    const suspendedEnrollments = await suspendLinkedRecords(transaction, {
      actorId: input.actorId,
      invitationId: updated.id,
      now,
      reason: input.reason,
      model: "learnerEnrollment",
      activeStatuses: [...activeEnrollmentStatuses],
      eventType: LearnerEnrollmentEventType.ENROLLMENT_SUSPENDED,
      eventLinkField: "enrollmentId",
      targetStatus: LearnerEnrollmentStatus.SUSPENDED,
    });
    const suspendedProgramParticipants = await suspendLinkedRecords(transaction, {
      actorId: input.actorId,
      invitationId: updated.id,
      now,
      reason: input.reason,
      model: "programParticipant",
      activeStatuses: [...activeParticipantStatuses],
      eventType: LearnerEnrollmentEventType.ASSIGNMENT_REMOVED,
      eventLinkField: "programParticipantId",
      targetStatus: LearnerParticipantStatus.SUSPENDED,
    });
    const suspendedCohortParticipants = await suspendLinkedRecords(transaction, {
      actorId: input.actorId,
      invitationId: updated.id,
      now,
      reason: input.reason,
      model: "cohortParticipant",
      activeStatuses: [...activeParticipantStatuses],
      eventType: LearnerEnrollmentEventType.ASSIGNMENT_REMOVED,
      eventLinkField: "cohortParticipantId",
      targetStatus: LearnerParticipantStatus.SUSPENDED,
    });

    return {
      ok: true,
      invitationId: updated.id,
      status: updated.status,
      suspendedEnrollments,
      suspendedProgramParticipants,
      suspendedCohortParticipants,
    };
  });
}

async function suspendLinkedRecords(
  transaction: AdminLearnerInvitationTransaction,
  input: {
    actorId: string;
    invitationId: string;
    now: Date;
    reason: string;
    model: "learnerEnrollment" | "programParticipant" | "cohortParticipant";
    activeStatuses: string[];
    eventType: LearnerEnrollmentEventType;
    eventLinkField:
      | "enrollmentId"
      | "programParticipantId"
      | "cohortParticipantId";
    targetStatus: LearnerEnrollmentStatus | LearnerParticipantStatus;
  },
) {
  const store = transaction[input.model];
  const records = await store.findMany({
    where: {
      invitationId: input.invitationId,
      status: {
        in: input.activeStatuses,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (records.length === 0) {
    return 0;
  }

  await store.updateMany({
    where: {
      id: {
        in: records.map((record) => record.id),
      },
    },
    data:
      input.model === "learnerEnrollment"
        ? {
            status: input.targetStatus,
          }
        : {
            status: input.targetStatus,
            endedAt: input.now,
          },
  });

  for (const record of records) {
    await transaction.learnerEnrollmentEvent.create({
      data: {
        invitationId: input.invitationId,
        [input.eventLinkField]: record.id,
        actorId: input.actorId,
        eventType: input.eventType,
        fromStatus: record.status,
        toStatus: input.targetStatus,
        reason: input.reason,
        metadata: adminLearnerInvitationStatusMetadata,
      },
    });
  }

  return records.length;
}

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);

  return value.length > 0 ? value : null;
}

const courseVersionValidationSelect = {
  id: true,
  courseId: true,
  status: true,
  course: {
    select: {
      id: true,
      organizationId: true,
    },
  },
} as const;

const invitationStatusSelect = {
  id: true,
  status: true,
  acceptedAt: true,
} as const;

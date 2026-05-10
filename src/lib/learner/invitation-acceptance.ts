import {
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
  LearnerInvitationStatus,
  LearnerParticipantStatus,
} from "@prisma/client";

import type { DecRole } from "@/lib/access";

import {
  hashLearnerInvitationToken,
  isUsableLearnerInvitationToken,
} from "./invitations";

export const learnerInvitationAcceptanceReason = "Learner invitation accepted";
export const learnerInvitationAcceptanceMetadata = JSON.stringify({
  source: "invitation-acceptance",
});

const acceptableInvitationStatuses = [
  LearnerInvitationStatus.CREATED,
  LearnerInvitationStatus.SENT,
  LearnerInvitationStatus.PENDING_ACCEPTANCE,
] as const;

export type LearnerInvitationAcceptanceIdentity = {
  userId: string;
  email: string;
  organizationId: string;
  roles: readonly DecRole[];
};

export type LearnerInvitationAcceptanceResult =
  | {
      ok: true;
      alreadyAccepted: boolean;
      invitationId: string;
      enrollmentId?: string;
      programParticipantId?: string;
      cohortParticipantId?: string;
      courseId?: string;
      courseVersionId?: string;
    }
  | {
      ok: false;
      reason:
        | "INVITATION_UNAVAILABLE"
        | "INVITATION_EXPIRED"
        | "SIGN_IN_WITH_INVITED_ACCOUNT";
    };

export type LearnerInvitationPreviewResult =
  | {
      ok: true;
      status: "READY" | "ALREADY_ACCEPTED";
      invitationId: string;
      courseId?: string;
    }
  | {
      ok: false;
      reason:
        | "INVITATION_UNAVAILABLE"
        | "INVITATION_EXPIRED"
        | "SIGN_IN_REQUIRED"
        | "SIGN_IN_WITH_INVITED_ACCOUNT";
    };

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

type UpdateArgs = {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type InvitationRecord = {
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
};

type CourseVersionRecord = {
  id: string;
  courseId: string;
  course: {
    id: string;
    organizationId: string;
  };
};

type EnrollmentRecord = {
  id: string;
  courseId: string;
  courseVersionId: string;
};

type ParticipantRecord = {
  id: string;
};

type AcceptanceTransaction = {
  learnerInvitation: {
    update(args: UpdateArgs): Promise<InvitationRecord>;
  };
  learnerEnrollment: {
    findUnique(args: FindUniqueArgs): Promise<EnrollmentRecord | null>;
    create(args: CreateArgs): Promise<EnrollmentRecord>;
  };
  programParticipant: {
    findUnique(args: FindUniqueArgs): Promise<ParticipantRecord | null>;
    create(args: CreateArgs): Promise<ParticipantRecord>;
  };
  cohortParticipant: {
    findUnique(args: FindUniqueArgs): Promise<ParticipantRecord | null>;
    create(args: CreateArgs): Promise<ParticipantRecord>;
  };
  learnerEnrollmentEvent: {
    create(args: CreateArgs): Promise<unknown>;
  };
};

export type LearnerInvitationAcceptancePrisma = {
  learnerInvitation: {
    findFirst(args: FindFirstArgs): Promise<InvitationRecord | null>;
  };
  courseVersion: {
    findFirst(args: FindFirstArgs): Promise<CourseVersionRecord | null>;
  };
  $transaction<T>(
    callback: (transaction: AcceptanceTransaction) => Promise<T>,
  ): Promise<T>;
};

export type LearnerInvitationAcceptanceInput = {
  token: string;
  identity: LearnerInvitationAcceptanceIdentity;
  now?: Date;
};

export type LearnerInvitationPreviewInput = {
  token: string;
  identity?: LearnerInvitationAcceptanceIdentity | null;
  now?: Date;
};

export async function loadLearnerInvitationPreview(
  prisma: Pick<LearnerInvitationAcceptancePrisma, "learnerInvitation">,
  input: LearnerInvitationPreviewInput,
): Promise<LearnerInvitationPreviewResult> {
  const invitation = await loadInvitationByToken(prisma, input.token);

  if (!invitation) {
    return { ok: false, reason: "INVITATION_UNAVAILABLE" };
  }

  const availability = evaluateInvitationAvailability(invitation, input.now);

  if (availability !== "AVAILABLE") {
    return { ok: false, reason: availability };
  }

  if (!input.identity) {
    return { ok: false, reason: "SIGN_IN_REQUIRED" };
  }

  const accountMatch = invitationMatchesIdentity(invitation, input.identity);

  if (!accountMatch) {
    return { ok: false, reason: "SIGN_IN_WITH_INVITED_ACCOUNT" };
  }

  return {
    ok: true,
    status:
      invitation.status === LearnerInvitationStatus.ACCEPTED
        ? "ALREADY_ACCEPTED"
        : "READY",
    invitationId: invitation.id,
    courseId: invitation.courseId ?? undefined,
  };
}

export async function acceptLearnerInvitation(
  prisma: LearnerInvitationAcceptancePrisma,
  input: LearnerInvitationAcceptanceInput,
): Promise<LearnerInvitationAcceptanceResult> {
  const invitation = await loadInvitationByToken(prisma, input.token);

  if (!invitation) {
    return { ok: false, reason: "INVITATION_UNAVAILABLE" };
  }

  const availability = evaluateInvitationAvailability(invitation, input.now);

  if (availability !== "AVAILABLE") {
    return { ok: false, reason: availability };
  }

  if (!invitationMatchesIdentity(invitation, input.identity)) {
    return { ok: false, reason: "SIGN_IN_WITH_INVITED_ACCOUNT" };
  }

  const courseVersion = await loadInvitationCourseVersion(prisma, invitation);

  if (invitation.courseId && !courseVersion) {
    return { ok: false, reason: "INVITATION_UNAVAILABLE" };
  }

  const now = input.now ?? new Date();

  return prisma.$transaction(async (transaction) => {
    const acceptedInvitation =
      invitation.status === LearnerInvitationStatus.ACCEPTED
        ? invitation
        : await transaction.learnerInvitation.update({
            where: { id: invitation.id },
            data: {
              status: LearnerInvitationStatus.ACCEPTED,
              acceptedUserId: input.identity.userId,
              acceptedAt: now,
            },
            select: learnerInvitationAcceptanceSelect,
          });

    if (invitation.status !== LearnerInvitationStatus.ACCEPTED) {
      await transaction.learnerEnrollmentEvent.create({
        data: {
          invitationId: acceptedInvitation.id,
          actorId: input.identity.userId,
          eventType: LearnerEnrollmentEventType.INVITATION_ACCEPTED,
          fromStatus: invitation.status,
          toStatus: LearnerInvitationStatus.ACCEPTED,
          reason: learnerInvitationAcceptanceReason,
          metadata: learnerInvitationAcceptanceMetadata,
        },
      });
    }

    const organizationId =
      acceptedInvitation.organizationId ?? input.identity.organizationId;
    const enrollment = courseVersion
      ? await ensureInvitationEnrollment(transaction, {
          invitation: acceptedInvitation,
          courseVersion,
          identity: input.identity,
          organizationId,
          now,
        })
      : null;
    const programParticipant = acceptedInvitation.programId
      ? await ensureProgramParticipant(transaction, {
          invitation: acceptedInvitation,
          identity: input.identity,
          organizationId,
          now,
        })
      : null;
    const cohortParticipant = acceptedInvitation.cohortId
      ? await ensureCohortParticipant(transaction, {
          invitation: acceptedInvitation,
          identity: input.identity,
          organizationId,
          now,
        })
      : null;

    return {
      ok: true,
      alreadyAccepted: invitation.status === LearnerInvitationStatus.ACCEPTED,
      invitationId: acceptedInvitation.id,
      enrollmentId: enrollment?.id,
      programParticipantId: programParticipant?.id,
      cohortParticipantId: cohortParticipant?.id,
      courseId: enrollment?.courseId,
      courseVersionId: enrollment?.courseVersionId,
    };
  });
}

async function ensureInvitationEnrollment(
  transaction: AcceptanceTransaction,
  input: {
    invitation: InvitationRecord;
    courseVersion: CourseVersionRecord;
    identity: LearnerInvitationAcceptanceIdentity;
    organizationId: string;
    now: Date;
  },
) {
  const existingEnrollment = await transaction.learnerEnrollment.findUnique({
    where: {
      userId_courseVersionId: {
        userId: input.identity.userId,
        courseVersionId: input.courseVersion.id,
      },
    },
    select: invitationEnrollmentSelect,
  });

  if (existingEnrollment) {
    return existingEnrollment;
  }

  const enrollment = await transaction.learnerEnrollment.create({
    data: {
      userId: input.identity.userId,
      courseId: input.courseVersion.courseId,
      courseVersionId: input.courseVersion.id,
      organizationId: input.organizationId,
      programId: input.invitation.programId,
      cohortId: input.invitation.cohortId,
      invitationId: input.invitation.id,
      source: LearnerEnrollmentSource.INVITATION,
      status: LearnerEnrollmentStatus.ENROLLED,
      enrolledAt: input.now,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
    select: invitationEnrollmentSelect,
  });

  await transaction.learnerEnrollmentEvent.create({
    data: {
      enrollmentId: enrollment.id,
      invitationId: input.invitation.id,
      actorId: input.identity.userId,
      eventType: LearnerEnrollmentEventType.ENROLLMENT_CREATED,
      toStatus: LearnerEnrollmentStatus.ENROLLED,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
  });

  return enrollment;
}

async function ensureProgramParticipant(
  transaction: AcceptanceTransaction,
  input: {
    invitation: InvitationRecord;
    identity: LearnerInvitationAcceptanceIdentity;
    organizationId: string;
    now: Date;
  },
) {
  if (!input.invitation.programId) {
    return null;
  }

  const existingParticipant = await transaction.programParticipant.findUnique({
    where: {
      programId_userId: {
        programId: input.invitation.programId,
        userId: input.identity.userId,
      },
    },
    select: participantSelect,
  });

  if (existingParticipant) {
    return existingParticipant;
  }

  const participant = await transaction.programParticipant.create({
    data: {
      programId: input.invitation.programId,
      organizationId: input.organizationId,
      userId: input.identity.userId,
      assignedById: null,
      invitationId: input.invitation.id,
      status: LearnerParticipantStatus.ACTIVE,
      joinedAt: input.now,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
    select: participantSelect,
  });

  await transaction.learnerEnrollmentEvent.create({
    data: {
      invitationId: input.invitation.id,
      programParticipantId: participant.id,
      actorId: input.identity.userId,
      eventType: LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
      toStatus: LearnerParticipantStatus.ACTIVE,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
  });

  return participant;
}

async function ensureCohortParticipant(
  transaction: AcceptanceTransaction,
  input: {
    invitation: InvitationRecord;
    identity: LearnerInvitationAcceptanceIdentity;
    organizationId: string;
    now: Date;
  },
) {
  if (!input.invitation.cohortId) {
    return null;
  }

  const existingParticipant = await transaction.cohortParticipant.findUnique({
    where: {
      cohortId_userId: {
        cohortId: input.invitation.cohortId,
        userId: input.identity.userId,
      },
    },
    select: participantSelect,
  });

  if (existingParticipant) {
    return existingParticipant;
  }

  const participant = await transaction.cohortParticipant.create({
    data: {
      cohortId: input.invitation.cohortId,
      programId: input.invitation.programId,
      organizationId: input.organizationId,
      userId: input.identity.userId,
      assignedById: null,
      invitationId: input.invitation.id,
      status: LearnerParticipantStatus.ACTIVE,
      joinedAt: input.now,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
    select: participantSelect,
  });

  await transaction.learnerEnrollmentEvent.create({
    data: {
      invitationId: input.invitation.id,
      cohortParticipantId: participant.id,
      actorId: input.identity.userId,
      eventType: LearnerEnrollmentEventType.ASSIGNMENT_CREATED,
      toStatus: LearnerParticipantStatus.ACTIVE,
      reason: learnerInvitationAcceptanceReason,
      metadata: learnerInvitationAcceptanceMetadata,
    },
  });

  return participant;
}

async function loadInvitationCourseVersion(
  prisma: Pick<LearnerInvitationAcceptancePrisma, "courseVersion">,
  invitation: InvitationRecord,
) {
  if (!invitation.courseId && !invitation.courseVersionId) {
    return null;
  }

  return prisma.courseVersion.findFirst({
    where: {
      status: CourseVersionStatus.PUBLISHED,
      ...(invitation.courseVersionId ? { id: invitation.courseVersionId } : {}),
      ...(invitation.courseId ? { courseId: invitation.courseId } : {}),
    },
    select: invitationCourseVersionSelect,
    orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
  });
}

async function loadInvitationByToken(
  prisma: Pick<LearnerInvitationAcceptancePrisma, "learnerInvitation">,
  token: string,
) {
  if (!isUsableLearnerInvitationToken(token)) {
    return null;
  }

  return prisma.learnerInvitation.findFirst({
    where: {
      tokenHash: hashLearnerInvitationToken(token),
    },
    select: learnerInvitationAcceptanceSelect,
  });
}

function evaluateInvitationAvailability(
  invitation: InvitationRecord,
  now = new Date(),
):
  | "AVAILABLE"
  | "INVITATION_UNAVAILABLE"
  | "INVITATION_EXPIRED"
  | "SIGN_IN_WITH_INVITED_ACCOUNT" {
  if (
    invitation.status === LearnerInvitationStatus.CANCELLED ||
    invitation.status === LearnerInvitationStatus.REVOKED
  ) {
    return "INVITATION_UNAVAILABLE";
  }

  if (
    invitation.status === LearnerInvitationStatus.EXPIRED ||
    (invitation.status !== LearnerInvitationStatus.ACCEPTED &&
      invitation.expiresAt <= now)
  ) {
    return "INVITATION_EXPIRED";
  }

  if (
    invitation.status !== LearnerInvitationStatus.ACCEPTED &&
    !acceptableInvitationStatuses.includes(
      invitation.status as (typeof acceptableInvitationStatuses)[number],
    )
  ) {
    return "INVITATION_UNAVAILABLE";
  }

  return "AVAILABLE";
}

function invitationMatchesIdentity(
  invitation: InvitationRecord,
  identity: LearnerInvitationAcceptanceIdentity,
) {
  if (
    invitation.acceptedUserId &&
    invitation.acceptedUserId !== identity.userId
  ) {
    return false;
  }

  if (normalizeEmail(invitation.email) !== normalizeEmail(identity.email)) {
    return false;
  }

  if (
    invitation.organizationId &&
    invitation.organizationId !== identity.organizationId
  ) {
    return false;
  }

  return true;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const learnerInvitationAcceptanceSelect = {
  id: true,
  email: true,
  organizationId: true,
  programId: true,
  cohortId: true,
  courseId: true,
  courseVersionId: true,
  acceptedUserId: true,
  status: true,
  expiresAt: true,
} as const;

const invitationCourseVersionSelect = {
  id: true,
  courseId: true,
  course: {
    select: {
      id: true,
      organizationId: true,
    },
  },
} as const;

const invitationEnrollmentSelect = {
  id: true,
  courseId: true,
  courseVersionId: true,
} as const;

const participantSelect = {
  id: true,
} as const;

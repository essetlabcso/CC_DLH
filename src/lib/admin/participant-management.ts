import {
  LearnerEnrollmentEventType,
  LearnerParticipantStatus,
} from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AdminParticipantStatusInput = {
  participantId: string;
  targetStatus: LearnerParticipantStatus;
  reason: string;
  actorId: string;
};

export type AdminManagementResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

// ---------------------------------------------------------------------------
// Prisma type surface (for testability)
// ---------------------------------------------------------------------------

type FindUniqueArgs = {
  where: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type UpdateArgs = {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type CreateArgs = {
  data: Record<string, unknown>;
};

type ManagementTransaction = {
  programParticipant: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique(args: FindUniqueArgs): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update(args: UpdateArgs): Promise<any>;
  };
  cohortParticipant: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findUnique(args: FindUniqueArgs): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update(args: UpdateArgs): Promise<any>;
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

export type AdminManagementPrisma = ManagementTransaction & {
  $transaction<T>(fn: (tx: ManagementTransaction) => Promise<T>): Promise<T>;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const terminalStatuses: LearnerParticipantStatus[] = [
  LearnerParticipantStatus.COMPLETED,
  LearnerParticipantStatus.WITHDRAWN,
  LearnerParticipantStatus.CANCELLED,
  LearnerParticipantStatus.EXPIRED,
];

export const VALID_ADMIN_TARGET_STATUSES: LearnerParticipantStatus[] = [
  LearnerParticipantStatus.ACTIVE,
  LearnerParticipantStatus.SUSPENDED,
  LearnerParticipantStatus.COMPLETED,
  LearnerParticipantStatus.WITHDRAWN,
  LearnerParticipantStatus.CANCELLED,
];

function mapStatusToEventType(status: LearnerParticipantStatus): LearnerEnrollmentEventType {
  switch (status) {
    case LearnerParticipantStatus.SUSPENDED:
      return LearnerEnrollmentEventType.ENROLLMENT_SUSPENDED;
    case LearnerParticipantStatus.ACTIVE:
      return LearnerEnrollmentEventType.ENROLLMENT_REACTIVATED;
    case LearnerParticipantStatus.WITHDRAWN:
      return LearnerEnrollmentEventType.ENROLLMENT_WITHDRAWN;
    case LearnerParticipantStatus.CANCELLED:
      return LearnerEnrollmentEventType.ENROLLMENT_CANCELLED;
    case LearnerParticipantStatus.COMPLETED:
      return LearnerEnrollmentEventType.ENROLLMENT_COMPLETED;
    case LearnerParticipantStatus.EXPIRED:
      return LearnerEnrollmentEventType.ENROLLMENT_EXPIRED;
    default:
      // Fallback for cases like returning to ASSIGNED state.
      return LearnerEnrollmentEventType.ASSIGNMENT_CREATED;
  }
}

// ---------------------------------------------------------------------------
// Core Methods
// ---------------------------------------------------------------------------

/**
 * Updates the status of a Program Participant securely with auditing.
 */
export async function updateProgramParticipantStatus(
  prisma: AdminManagementPrisma,
  input: AdminParticipantStatusInput,
): Promise<AdminManagementResult> {
  const now = new Date();
  const isTerminal = terminalStatuses.includes(input.targetStatus);

  if (input.reason.trim().length < 10) {
    return { ok: false, message: "A reason of at least 10 characters is required." };
  }

  if (!VALID_ADMIN_TARGET_STATUSES.includes(input.targetStatus)) {
    return { ok: false, message: `Transitions to ${input.targetStatus} are not permitted.` };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.programParticipant.findUnique({
        where: { id: input.participantId },
        select: {
          id: true,
          status: true,
          programId: true,
          organizationId: true,
          userId: true,
        },
      });

      if (!existing) {
        return { ok: false, message: "Program participant record not found." };
      }

      if (terminalStatuses.includes(existing.status as LearnerParticipantStatus)) {
        return {
          ok: false,
          message: "Cannot modify status of records in a terminal state (COMPLETED, WITHDRAWN, CANCELLED, EXPIRED).",
        };
      }

      if (existing.status === input.targetStatus) {
        return { ok: true, message: "Record is already in the requested status." };
      }

      // Perform status write
      await tx.programParticipant.update({
        where: { id: input.participantId },
        data: {
          status: input.targetStatus,
          reason: input.reason,
          endedAt: isTerminal ? now : null,
        },
      });

      // Record history log
      await tx.learnerEnrollmentEvent.create({
        data: {
          programParticipantId: existing.id,
          actorId: input.actorId,
          eventType: mapStatusToEventType(input.targetStatus),
          fromStatus: existing.status,
          toStatus: input.targetStatus,
          reason: input.reason,
          metadata: JSON.stringify({ source: "admin-manual-status-override" }),
        },
      });

      // Record system security audit
      await tx.adminAuditLog.create({
        data: {
          action: "PARTICIPANT_STATUS_UPDATED",
          actorId: input.actorId,
          entityId: existing.id,
          entityType: "ProgramParticipant",
          reason: input.reason,
          riskLevel: "MEDIUM",
          beforeJson: JSON.stringify({ status: existing.status }),
          afterJson: JSON.stringify({ status: input.targetStatus }),
        },
      });

      return { ok: true, message: "Program participant status updated successfully." };
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown database failure.";
    return { ok: false, message: `Database failed to update status: ${msg}` };
  }
}

/**
 * Updates the status of a Cohort Participant securely with auditing.
 */
export async function updateCohortParticipantStatus(
  prisma: AdminManagementPrisma,
  input: AdminParticipantStatusInput,
): Promise<AdminManagementResult> {
  const now = new Date();
  const isTerminal = terminalStatuses.includes(input.targetStatus);

  if (input.reason.trim().length < 10) {
    return { ok: false, message: "A reason of at least 10 characters is required." };
  }

  if (!VALID_ADMIN_TARGET_STATUSES.includes(input.targetStatus)) {
    return { ok: false, message: `Transitions to ${input.targetStatus} are not permitted.` };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.cohortParticipant.findUnique({
        where: { id: input.participantId },
        select: {
          id: true,
          status: true,
          cohortId: true,
          organizationId: true,
          userId: true,
        },
      });

      if (!existing) {
        return { ok: false, message: "Cohort participant record not found." };
      }

      if (terminalStatuses.includes(existing.status as LearnerParticipantStatus)) {
        return {
          ok: false,
          message: "Cannot modify status of records in a terminal state (COMPLETED, WITHDRAWN, CANCELLED, EXPIRED).",
        };
      }

      if (existing.status === input.targetStatus) {
        return { ok: true, message: "Record is already in the requested status." };
      }

      // Perform status write
      await tx.cohortParticipant.update({
        where: { id: input.participantId },
        data: {
          status: input.targetStatus,
          reason: input.reason,
          endedAt: isTerminal ? now : null,
        },
      });

      // Record history log
      await tx.learnerEnrollmentEvent.create({
        data: {
          cohortParticipantId: existing.id,
          actorId: input.actorId,
          eventType: mapStatusToEventType(input.targetStatus),
          fromStatus: existing.status,
          toStatus: input.targetStatus,
          reason: input.reason,
          metadata: JSON.stringify({ source: "admin-manual-status-override" }),
        },
      });

      // Record system security audit
      await tx.adminAuditLog.create({
        data: {
          action: "PARTICIPANT_STATUS_UPDATED",
          actorId: input.actorId,
          entityId: existing.id,
          entityType: "CohortParticipant",
          reason: input.reason,
          riskLevel: "MEDIUM",
          beforeJson: JSON.stringify({ status: existing.status }),
          afterJson: JSON.stringify({ status: input.targetStatus }),
        },
      });

      return { ok: true, message: "Cohort participant status updated successfully." };
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown database failure.";
    return { ok: false, message: `Database failed to update status: ${msg}` };
  }
}

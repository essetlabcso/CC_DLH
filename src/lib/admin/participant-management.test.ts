import { describe, expect, it, vi } from "vitest";
import { LearnerEnrollmentEventType, LearnerParticipantStatus } from "@prisma/client";
import {
  updateProgramParticipantStatus,
  updateCohortParticipantStatus,
  type AdminManagementPrisma,
} from "./participant-management";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function createMockPrisma() {
  const txMock = {
    programParticipant: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    cohortParticipant: {
      findUnique: vi.fn(),
      update: vi.fn().mockResolvedValue({}),
    },
    learnerEnrollmentEvent: {
      create: vi.fn().mockResolvedValue({}),
    },
    adminAuditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  };

  const mockPrisma = {
    ...txMock,
    $transaction: vi.fn(async (callback) => {
      return callback(txMock);
    }),
  } as unknown as AdminManagementPrisma & typeof txMock;

  return { mockPrisma, txMock };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Participant Management Service", () => {
  describe("updateProgramParticipantStatus", () => {
    it("should fail if program participant is not found", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.programParticipant.findUnique.mockResolvedValue(null);

      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "missing-1",
        targetStatus: LearnerParticipantStatus.SUSPENDED,
        reason: "A valid reason that is long enough.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(false);
      expect(result.message).toContain("not found");
      expect(txMock.programParticipant.update).not.toHaveBeenCalled();
    });

    it("should fail if the reason is shorter than 10 characters", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "any-1",
        targetStatus: LearnerParticipantStatus.SUSPENDED,
        reason: "short",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(false);
      expect(result.message).toContain("reason of at least 10 characters");
      expect(txMock.programParticipant.findUnique).not.toHaveBeenCalled();
    });

    it("should fail if transitioning to an invalid target status", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "any-1",
        targetStatus: LearnerParticipantStatus.EXPIRED, // not in the whitelist
        reason: "A long enough reason string.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(false);
      expect(result.message).toContain("not permitted");
      expect(txMock.programParticipant.findUnique).not.toHaveBeenCalled();
    });

    it("should block modifications to terminal records", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.programParticipant.findUnique.mockResolvedValue({
        id: "pp-1",
        status: LearnerParticipantStatus.COMPLETED,
      });

      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "pp-1",
        targetStatus: LearnerParticipantStatus.ACTIVE,
        reason: "A valid reason that is long enough.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(false);
      expect(result.message).toContain("terminal state");
      expect(txMock.programParticipant.update).not.toHaveBeenCalled();
    });

    it("should skip update if status is already equivalent", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.programParticipant.findUnique.mockResolvedValue({
        id: "pp-1",
        status: LearnerParticipantStatus.SUSPENDED,
      });

      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "pp-1",
        targetStatus: LearnerParticipantStatus.SUSPENDED,
        reason: "A valid reason that is long enough.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(true);
      expect(result.message).toContain("already in the requested status");
      expect(txMock.programParticipant.update).not.toHaveBeenCalled();
    });

    it("should successfully update status, create events and audits", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.programParticipant.findUnique.mockResolvedValue({
        id: "pp-1",
        status: LearnerParticipantStatus.ACTIVE,
        userId: "user-1",
      });

      const result = await updateProgramParticipantStatus(mockPrisma, {
        participantId: "pp-1",
        targetStatus: LearnerParticipantStatus.SUSPENDED,
        reason: "Suspending temporarily.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(true);
      
      // Check participant update
      expect(txMock.programParticipant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "pp-1" },
          data: expect.objectContaining({
            status: "SUSPENDED",
            reason: "Suspending temporarily.",
            endedAt: null, // SUSPENDED is not terminal
          }),
        })
      );

      // Check lifecycle event
      expect(txMock.learnerEnrollmentEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          programParticipantId: "pp-1",
          eventType: LearnerEnrollmentEventType.ENROLLMENT_SUSPENDED,
          fromStatus: "ACTIVE",
          toStatus: "SUSPENDED",
          reason: "Suspending temporarily.",
        }),
      });

      // Check admin audit
      expect(txMock.adminAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "PARTICIPANT_STATUS_UPDATED",
          entityType: "ProgramParticipant",
          entityId: "pp-1",
          reason: "Suspending temporarily.",
        }),
      });
    });

    it("should set endedAt when transitioning to terminal state", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.programParticipant.findUnique.mockResolvedValue({
        id: "pp-1",
        status: LearnerParticipantStatus.ACTIVE,
      });

      await updateProgramParticipantStatus(mockPrisma, {
        participantId: "pp-1",
        targetStatus: LearnerParticipantStatus.WITHDRAWN,
        reason: "User withdrew.",
        actorId: "admin-1",
      });

      expect(txMock.programParticipant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "WITHDRAWN",
            endedAt: expect.any(Date),
          }),
        })
      );
    });
  });

  describe("updateCohortParticipantStatus", () => {
    it("should successfully update cohort participant and emit events", async () => {
      const { mockPrisma, txMock } = createMockPrisma();
      txMock.cohortParticipant.findUnique.mockResolvedValue({
        id: "cp-1",
        status: LearnerParticipantStatus.ACTIVE,
      });

      const result = await updateCohortParticipantStatus(mockPrisma, {
        participantId: "cp-1",
        targetStatus: LearnerParticipantStatus.COMPLETED,
        reason: "Force completed via override.",
        actorId: "admin-1",
      });

      expect(result.ok).toBe(true);
      
      // Check update
      expect(txMock.cohortParticipant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "COMPLETED",
            endedAt: expect.any(Date),
          }),
        })
      );

      // Check cohort event relation
      expect(txMock.learnerEnrollmentEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cohortParticipantId: "cp-1",
          eventType: LearnerEnrollmentEventType.ENROLLMENT_COMPLETED,
        }),
      });
    });
  });
});

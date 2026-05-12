import {
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import {
  assignCourseReviewer,
  disableCourseReviewerAssignment,
  getCourseReviewerAssignmentsOverview,
} from "./course-reviewer-assignments";
import { ADMIN_AUTHORITY_CHANGE_ERROR } from "./admin-authority";

vi.mock("@/lib/db/client", () => {
  const mockPrisma = {
    $transaction: vi.fn().mockImplementation(async (cb) => await cb(mockPrisma)),
    adminAuditLog: {
      create: vi.fn(),
    },
    scopedRoleAssignment: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    courseVersion: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    course: {
      findUnique: vi.fn(),
    },
    organization: {
      findUnique: vi.fn(),
    },
    organizationMembership: {
      findFirst: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe("Course reviewer assignments library", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCourseReviewerAssignmentsOverview", () => {
    it("maps assignments into enriched DTOs with scope labels", async () => {
      const createdAt = new Date("2026-05-10T10:00:00Z");
      vi.mocked(prisma.scopedRoleAssignment.findMany).mockResolvedValue([
        {
          id: "assignment_1",
          user: { id: "u1", name: "User One", email: "u1@ex.com" },
          createdBy: { name: "System Admin" },
          scopeType: PermissionScopeType.COURSE,
          scopeId: "c1",
          course: { title: "Course Title" },
          status: ScopedRoleAssignmentStatus.ACTIVE,
          reason: "Needed",
          createdAt,
        }
      ] as never);

      vi.mocked(prisma.courseVersion.findMany).mockResolvedValue([
        {
          id: "version_1",
          submittedAt: createdAt,
          versionNumber: 1,
          createdBy: { name: "Author Name" },
          course: { title: "Course Title" },
        }
      ] as never);

      const overview = await getCourseReviewerAssignmentsOverview();

      expect(overview.activeAssignments).toHaveLength(1);
      expect(overview.activeAssignments[0].scopeLabel).toBe("Course: Course Title");
      expect(overview.recentVersionsWithoutAssignment).toHaveLength(1);
      expect(overview.recentVersionsWithoutAssignment[0].id).toBe("version_1");
    });
  });

  describe("assignCourseReviewer", () => {
    const input = {
      actorId: "admin_id",
      actorRole: "admin" as const,
      email: "reviewer@example.com",
      scopeType: PermissionScopeType.COURSE,
      scopeValue: "course_id",
      reason: "Testing logic governance compliance.",
    };

    it("enforces Super Admin actor role", async () => {
      await expect(
        assignCourseReviewer({ ...input, actorRole: "learner" })
      ).rejects.toThrow(ADMIN_AUTHORITY_CHANGE_ERROR);
    });

    it("rejects validation errors for short reason", async () => {
      await expect(
        assignCourseReviewer({ ...input, reason: "Short" })
      ).rejects.toThrow("Reason (min 10 chars) is required.");
    });

    it("throws if target user does not exist", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
      await expect(assignCourseReviewer(input)).rejects.toThrow("not found");
    });

    it("verifies the actual course entity exists", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "target_u", status: "ACTIVE" } as never);
      vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({ id: "m1", roles: [{ role: "REVIEWER" }] } as never);
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);
      await expect(assignCourseReviewer(input)).rejects.toThrow("Course not found.");
    });

    it("creates assignment and audit log sequentially in transaction", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "target_u", status: "ACTIVE" } as never);
      vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({ id: "m1", roles: [{ role: "REVIEWER" }] } as never);
      vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: "course_id" } as never);
      vi.mocked(prisma.scopedRoleAssignment.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.scopedRoleAssignment.create).mockResolvedValue({ id: "new_assign_id" } as never);

      await assignCourseReviewer(input);

      expect(prisma.scopedRoleAssignment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "target_u",
            roleKey: ScopedRoleKey.COURSE_REVIEWER,
            courseId: "course_id",
            scopeId: "course_id",
          }),
        })
      );

      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "AUTHORITY_GRANTED",
            entityId: "new_assign_id",
            riskLevel: "MEDIUM",
          }),
        })
      );
    });

    it("blocks redundant active assignments", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "target_u", status: "ACTIVE" } as never);
      vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({ id: "m1", roles: [{ role: "REVIEWER" }] } as never);
      vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: "course_id" } as never);
      vi.mocked(prisma.scopedRoleAssignment.findFirst).mockResolvedValue({
        id: "existing",
        status: ScopedRoleAssignmentStatus.ACTIVE,
      } as never);

      await expect(assignCourseReviewer(input)).rejects.toThrow("already has an active assignment");
    });

    it("reactivates disabled assignments instead of duplicating", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "target_u", status: "ACTIVE" } as never);
      vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({ id: "m1", roles: [{ role: "REVIEWER" }] } as never);
      vi.mocked(prisma.course.findUnique).mockResolvedValue({ id: "course_id" } as never);
      vi.mocked(prisma.scopedRoleAssignment.findFirst).mockResolvedValue({
        id: "existing_id",
        status: ScopedRoleAssignmentStatus.DISABLED,
      } as never);
      vi.mocked(prisma.scopedRoleAssignment.update).mockResolvedValue({ id: "existing_id" } as never);

      await assignCourseReviewer(input);

      expect(prisma.scopedRoleAssignment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "existing_id" },
          data: expect.objectContaining({
            status: ScopedRoleAssignmentStatus.ACTIVE,
            expiresAt: null,
          }),
        })
      );
    });

    it("rejects target users who do not have system REVIEWER or ADMIN roles", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: "target_u", status: "ACTIVE" } as never);
      // Mocked learner-only membership
      vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({
        id: "m1",
        roles: [{ role: "LEARNER" }],
      } as never);

      await expect(assignCourseReviewer(input)).rejects.toThrow(
        "Target user must currently hold the system REVIEWER or ADMIN role"
      );
    });
  });

  describe("disableCourseReviewerAssignment", () => {
    const disableInput = {
      actorId: "admin_id",
      actorRole: "admin" as const,
      assignmentId: "target_assign",
      reason: "Retiring the reviewer cycle.",
    };

    it("throws if assignment not found", async () => {
      vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue(null);
      await expect(disableCourseReviewerAssignment(disableInput)).rejects.toThrow("Assignment not found.");
    });

    it("updates assignment status and appends audit", async () => {
      vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue({
        id: "target_assign",
        roleKey: ScopedRoleKey.COURSE_REVIEWER,
      } as never);

      await disableCourseReviewerAssignment(disableInput);

      expect(prisma.scopedRoleAssignment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "target_assign" },
          data: expect.objectContaining({
            status: ScopedRoleAssignmentStatus.DISABLED,
          }),
        })
      );

      expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: "AUTHORITY_REVOKED",
            entityId: "target_assign",
          }),
        })
      );
    });
  });
});

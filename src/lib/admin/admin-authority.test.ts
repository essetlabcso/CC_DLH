import {
  MembershipStatus,
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import {
  canChangePlatformAdminAuthority,
  getAdminAuthorityOverview,
  grantPlatformAdminAuthority,
  isSuperAdminEquivalentForPhase1,
  touchesPlatformAdminAuthority,
  updatePlatformAdminAuthorityStatus,
  ADMIN_AUTHORITY_CHANGE_ERROR,
} from "./admin-authority";

vi.mock("@/lib/db/client", () => {
  const mockPrisma = {
    $transaction: vi.fn().mockImplementation(async (cb) => await cb(mockPrisma)),
    adminAuditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    organizationMembership: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
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
  };
  return { prisma: mockPrisma };
});

describe("Admin authority boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("treats only admin as the Super Admin-equivalent for Phase 1", () => {
    expect(isSuperAdminEquivalentForPhase1("admin")).toBe(true);
    expect(isSuperAdminEquivalentForPhase1("learner")).toBe(false);
    expect(isSuperAdminEquivalentForPhase1("creator")).toBe(false);
    expect(isSuperAdminEquivalentForPhase1("reviewer")).toBe(false);
  });

  it("detects assignment or removal of Platform Admin authority", () => {
    expect(
      touchesPlatformAdminAuthority([UserRole.LEARNER], [UserRole.ADMIN]),
    ).toBe(true);
    expect(
      touchesPlatformAdminAuthority([UserRole.ADMIN], [UserRole.LEARNER]),
    ).toBe(true);
    expect(
      touchesPlatformAdminAuthority([UserRole.LEARNER], [UserRole.CREATOR]),
    ).toBe(false);
  });

  it("blocks non-Super Admin-equivalent users from changing Platform Admin authority", () => {
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "admin",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(true);
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(false);
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.CREATOR],
      }),
    ).toBe(true);
  });

  it("maps the read-only Admin authority overview from existing role data", async () => {
    const createdAt = new Date("2026-05-08T10:00:00.000Z");
    vi.mocked(prisma.organizationMembership.findMany).mockResolvedValue([
      {
        createdAt,
        id: "membership_1",
        organization: {
          name: "DEC",
          slug: "dec",
        },
        status: MembershipStatus.ACTIVE,
        user: {
          email: "super@example.org",
          id: "user_super",
          name: "Super Admin",
          status: UserStatus.ACTIVE,
        },
      },
    ] as never);
    vi.mocked(prisma.scopedRoleAssignment.findMany).mockResolvedValue([
      {
        capacityArea: null,
        cohort: null,
        cohortId: null,
        course: null,
        courseId: null,
        courseVersion: null,
        courseVersionId: null,
        createdAt,
        createdBy: {
          email: "super@example.org",
          name: "Super Admin",
        },
        expiresAt: null,
        id: "scoped_1",
        organization: null,
        organizationId: null,
        program: null,
        programId: null,
        proofSubmissionId: null,
        reason: "Day-to-day Admin coverage.",
        roleKey: ScopedRoleKey.PLATFORM_ADMIN,
        scopeId: "platform",
        scopeType: PermissionScopeType.PLATFORM,
        startsAt: createdAt,
        status: ScopedRoleAssignmentStatus.ACTIVE,
        user: {
          email: "platform@example.org",
          id: "user_platform",
          name: "Platform Admin",
          organization: {
            name: "DEC",
          },
          status: UserStatus.ACTIVE,
        },
        userId: "user_platform",
      },
    ] as never);
    vi.mocked(prisma.adminAuditLog.findMany).mockResolvedValue([
      {
        action: "USER_ROLES_UPDATED",
        actor: {
          email: "super@example.org",
          name: "Super Admin",
        },
        createdAt,
        entityId: "user_platform",
        entityType: "User",
        id: "audit_1",
        reason: "Added Platform Admin coverage.",
        riskLevel: "HIGH",
      },
    ] as never);

    const overview = await getAdminAuthorityOverview();

    expect(overview.superAdminEquivalentUsers).toEqual([
      {
        email: "super@example.org",
        membershipId: "membership_1",
        membershipStatus: MembershipStatus.ACTIVE,
        name: "Super Admin",
        organizationName: "DEC",
        organizationSlug: "dec",
        userId: "user_super",
        userStatus: UserStatus.ACTIVE,
      },
    ]);
    expect(overview.scopedPlatformAdmins).toEqual([
      expect.objectContaining({
        createdByLabel: "Super Admin",
        email: "platform@example.org",
        name: "Platform Admin",
        reason: "Day-to-day Admin coverage.",
        scopeId: "platform",
        scopeLabel: "Platform-wide",
        scopeType: PermissionScopeType.PLATFORM,
        status: ScopedRoleAssignmentStatus.ACTIVE,
      }),
    ]);
    expect(overview.auditActivity).toEqual([
      {
        actionLabel: "User roles updated",
        actorLabel: "Super Admin",
        createdAt,
        entityId: "user_platform",
        entityLabel: "User account",
        id: "audit_1",
        reason: "Added Platform Admin coverage.",
        riskLevel: "HIGH",
      },
    ]);
    expect(overview.totals).toEqual({
      recentAuthorityEvents: 1,
      scopedPlatformAdmins: 1,
      superAdminEquivalentUsers: 1,
    });
  });

  it("uses safe explicit selects for authority audit activity", async () => {
    vi.mocked(prisma.organizationMembership.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.scopedRoleAssignment.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.adminAuditLog.findMany).mockResolvedValue([] as never);

    await getAdminAuthorityOverview();

    expect(prisma.adminAuditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          action: true,
          actor: {
            select: {
              email: true,
              name: true,
            },
          },
          createdAt: true,
          entityId: true,
          entityType: true,
          id: true,
          reason: true,
          riskLevel: true,
        }),
        where: {
          action: {
            in: [
              "USER_ROLES_UPDATED",
              "USER_INVITED",
              "MEMBERSHIP_ADDED",
              "MEMBERSHIP_UPDATED",
              "AUTHORITY_GRANTED",
              "AUTHORITY_UPDATED",
            ],
          },
        },
      }),
    );

    const auditCall = vi.mocked(prisma.adminAuditLog.findMany).mock.calls[0]?.[0];
    expect(auditCall).not.toHaveProperty("include");
    expect(auditCall?.select).not.toHaveProperty("beforeJson");
    expect(auditCall?.select).not.toHaveProperty("afterJson");
    expect(auditCall?.select).not.toHaveProperty("metadata");
  });

  describe("Mutators: Platform Admin Management", () => {
    const validActorId = "actor_1";
    const targetUserId = "user_2";
    const targetEmail = "candidate@example.org";
    const validReason = "Establishing regular administrative coverage for reporting periods.";

    describe("grantPlatformAdminAuthority", () => {
      it("enforces Super Admin privileges for the actor", async () => {
        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "learner",
            email: targetEmail,
            reason: validReason,
          })
        ).rejects.toThrow(ADMIN_AUTHORITY_CHANGE_ERROR);
      });

      it("rejects reasons shorter than 10 characters", async () => {
        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "admin",
            email: targetEmail,
            reason: "Short.",
          })
        ).rejects.toThrow("A descriptive reason (min 10 characters) is required.");
      });

      it("rejects if user record does not exist", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "admin",
            email: targetEmail,
            reason: validReason,
          })
        ).rejects.toThrow(`No existing user record found for email: ${targetEmail}`);
      });

      it("rejects non-ACTIVE user statuses", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue({
          id: targetUserId,
          status: UserStatus.DISABLED,
        } as never);

        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "admin",
            email: targetEmail,
            reason: validReason,
          })
        ).rejects.toThrow("Authority can only be granted to active user accounts.");
      });

      it("rejects redundant active Platform assignments", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue({
          id: targetUserId,
          status: UserStatus.ACTIVE,
          organizationId: "org_123",
        } as never);
        vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({
          id: "mem_123",
        } as never);
        vi.mocked(prisma.scopedRoleAssignment.findFirst).mockResolvedValue({
          id: "existing_scoped_1",
          status: "ACTIVE",
        } as never);

        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "admin",
            email: targetEmail,
            reason: validReason,
          })
        ).rejects.toThrow(
          `${targetEmail} already has a Platform Admin assignment record (Status: ACTIVE).`
        );
      });

      it("rejects if target user lacks active organization membership", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue({
          id: targetUserId,
          status: UserStatus.ACTIVE,
          organizationId: "org_123",
        } as never);
        vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue(null);

        await expect(
          grantPlatformAdminAuthority({
            actorId: validActorId,
            actorRole: "admin",
            email: targetEmail,
            reason: validReason,
          })
        ).rejects.toThrow(
          "Target user must hold an ACTIVE membership within their system organization"
        );
      });

      it("successfully grants authority and appends audit log", async () => {
        vi.mocked(prisma.user.findFirst).mockResolvedValue({
          id: targetUserId,
          status: UserStatus.ACTIVE,
          organizationId: "org_123",
        } as never);
        vi.mocked(prisma.organizationMembership.findFirst).mockResolvedValue({
          id: "mem_123",
        } as never);
        vi.mocked(prisma.scopedRoleAssignment.findFirst).mockResolvedValue(null);
        vi.mocked(prisma.scopedRoleAssignment.create).mockResolvedValue({
          id: "new_scoped_99",
        } as never);

        await grantPlatformAdminAuthority({
          actorId: validActorId,
          actorRole: "admin",
          email: targetEmail,
          reason: validReason,
        });

        expect(prisma.scopedRoleAssignment.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              userId: targetUserId,
              roleKey: ScopedRoleKey.PLATFORM_ADMIN,
              scopeType: PermissionScopeType.PLATFORM,
              status: ScopedRoleAssignmentStatus.ACTIVE,
              createdById: validActorId,
              reason: validReason,
            }),
          })
        );

        expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              action: "AUTHORITY_GRANTED",
              actorId: validActorId,
              entityId: "new_scoped_99",
              entityType: "ScopedRoleAssignment",
            }),
          })
        );
      });
    });

    describe("updatePlatformAdminAuthorityStatus", () => {
      const targetAssignmentId = "assign_55";

      it("enforces Super Admin privileges on status changes", async () => {
        await expect(
          updatePlatformAdminAuthorityStatus({
            actorId: validActorId,
            actorRole: "learner",
            assignmentId: targetAssignmentId,
            reason: validReason,
            status: ScopedRoleAssignmentStatus.DISABLED,
          })
        ).rejects.toThrow(ADMIN_AUTHORITY_CHANGE_ERROR);
      });

      it("blocks self-modification of status", async () => {
        vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue({
          id: targetAssignmentId,
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          userId: validActorId, // Actor matches target
        } as never);

        await expect(
          updatePlatformAdminAuthorityStatus({
            actorId: validActorId,
            actorRole: "admin",
            assignmentId: targetAssignmentId,
            reason: validReason,
            status: ScopedRoleAssignmentStatus.DISABLED,
          })
        ).rejects.toThrow("Self-modification check failed");
      });

      it("successfully updates status and creates audit trail", async () => {
        vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue({
          id: targetAssignmentId,
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          userId: targetUserId,
        } as never);
        vi.mocked(prisma.scopedRoleAssignment.update).mockResolvedValue({
          id: targetAssignmentId,
        } as never);

        await updatePlatformAdminAuthorityStatus({
          actorId: validActorId,
          actorRole: "admin",
          assignmentId: targetAssignmentId,
          reason: validReason,
          status: ScopedRoleAssignmentStatus.DISABLED,
        });

        expect(prisma.scopedRoleAssignment.update).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: targetAssignmentId },
            data: expect.objectContaining({
              status: ScopedRoleAssignmentStatus.DISABLED,
              reason: validReason,
            }),
          })
        );

        expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              action: "AUTHORITY_UPDATED",
              actorId: validActorId,
              entityId: targetAssignmentId,
              entityType: "ScopedRoleAssignment",
            }),
          })
        );
      });

      it("populates expiresAt timestamp when marking assignment DISABLED", async () => {
        vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue({
          id: targetAssignmentId,
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          userId: targetUserId,
        } as never);

        await updatePlatformAdminAuthorityStatus({
          actorId: validActorId,
          actorRole: "admin",
          assignmentId: targetAssignmentId,
          reason: validReason,
          status: ScopedRoleAssignmentStatus.DISABLED,
        });

        expect(prisma.scopedRoleAssignment.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              status: ScopedRoleAssignmentStatus.DISABLED,
              expiresAt: expect.any(Date),
            }),
          })
        );
      });

      it("clears expiresAt safely when reactivating assignment to ACTIVE", async () => {
        vi.mocked(prisma.scopedRoleAssignment.findUnique).mockResolvedValue({
          id: targetAssignmentId,
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          userId: targetUserId,
        } as never);

        await updatePlatformAdminAuthorityStatus({
          actorId: validActorId,
          actorRole: "admin",
          assignmentId: targetAssignmentId,
          reason: validReason,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        });

        expect(prisma.scopedRoleAssignment.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              status: ScopedRoleAssignmentStatus.ACTIVE,
              expiresAt: null,
            }),
          })
        );
      });

      it("rejects unsupported non-whitelist status codes", async () => {
        await expect(
          updatePlatformAdminAuthorityStatus({
            actorId: validActorId,
            actorRole: "admin",
            assignmentId: targetAssignmentId,
            reason: validReason,
            status: ScopedRoleAssignmentStatus.INVITED, // Not in whitelist
          })
        ).rejects.toThrow("is unsupported for Platform Admin updates");
      });
    });
  });
});

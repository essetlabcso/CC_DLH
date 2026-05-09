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
  isSuperAdminEquivalentForPhase1,
  touchesPlatformAdminAuthority,
} from "./admin-authority";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    adminAuditLog: {
      findMany: vi.fn(),
    },
    organizationMembership: {
      findMany: vi.fn(),
    },
    scopedRoleAssignment: {
      findMany: vi.fn(),
    },
  },
}));

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
});

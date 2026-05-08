import {
  MembershipStatus,
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
  UserRole as PrismaUserRole,
  UserStatus,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import type { DecSession } from "@/lib/auth/session";

import { buildPersistedIdentity } from "./persistence";
import { buildPermissionIdentity, loadPermissionIdentity } from "./permission-identity";

const session: DecSession = {
  userId: "user-1",
  organizationId: "org-1",
  email: "learner@example.test",
  name: "Learner One",
  role: "learner",
  issuedAt: 1000,
  expiresAt: 2000,
};

const persistedIdentity = buildPersistedIdentity(session, {
  id: "user-1",
  organizationId: "org-1",
  email: "learner@example.test",
  name: "Learner One",
  status: UserStatus.ACTIVE,
  organization: {
    id: "org-1",
    slug: "dec",
    name: "DEC",
  },
  memberships: [
    {
      id: "membership-1",
      organizationId: "org-1",
      status: MembershipStatus.ACTIVE,
      roles: [{ role: PrismaUserRole.LEARNER }],
    },
  ],
});

describe("permission identity loading", () => {
  it("builds a permission identity without changing persisted identity shape", () => {
    expect(persistedIdentity).not.toBeNull();
    const permissionIdentity = buildPermissionIdentity(persistedIdentity!, [
      {
        roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
        scopeType: PermissionScopeType.ORGANIZATION,
        scopeId: "org-1",
        organizationId: "org-1",
        status: ScopedRoleAssignmentStatus.ACTIVE,
      },
    ]);

    expect(permissionIdentity.session.role).toBe("learner");
    expect(permissionIdentity.user.roles).toEqual(["learner"]);
    expect(permissionIdentity.scopedRoleAssignments).toHaveLength(1);
  });

  it("loads only active non-expired scoped assignments through the dedicated helper", async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        roleKey: ScopedRoleKey.FACILITATOR,
        scopeType: PermissionScopeType.COHORT,
        scopeId: "cohort-1",
        cohortId: "cohort-1",
        status: ScopedRoleAssignmentStatus.ACTIVE,
      },
    ]);
    const prisma = {
      scopedRoleAssignment: {
        findMany,
      },
    };

    const permissionIdentity = await loadPermissionIdentity(
      prisma as never,
      persistedIdentity,
    );

    expect(permissionIdentity?.scopedRoleAssignments).toHaveLength(1);
    expect(findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        status: ScopedRoleAssignmentStatus.ACTIVE,
        OR: [{ startsAt: null }, { startsAt: { lte: expect.any(Date) } }],
        AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }] }],
      },
    });
  });

  it("does not create a permission identity when no persisted identity exists", async () => {
    await expect(loadPermissionIdentity({} as never, null)).resolves.toBeNull();
  });
});

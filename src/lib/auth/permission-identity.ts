import type { PrismaClient } from "@prisma/client";

import type { PersistedIdentity } from "@/lib/auth/persistence";
import {
  getScopedRoleAssignments,
  type PermissionIdentity,
  type ScopedAccessAssignment,
} from "@/lib/permissions/scoped-access";

export function buildPermissionIdentity(
  identity: PersistedIdentity,
  scopedRoleAssignments: readonly ScopedAccessAssignment[],
): PermissionIdentity {
  return {
    session: {
      role: identity.session.role,
    },
    user: {
      id: identity.user.id,
      organizationId: identity.user.organizationId,
      roles: identity.user.roles,
    },
    scopedRoleAssignments,
  };
}

export async function loadPermissionIdentity(
  prisma: PrismaClient,
  identity: PersistedIdentity | null,
) {
  if (!identity) {
    return null;
  }

  const scopedRoleAssignments = await getScopedRoleAssignments(
    prisma,
    identity.user.id,
  );

  return buildPermissionIdentity(identity, scopedRoleAssignments);
}

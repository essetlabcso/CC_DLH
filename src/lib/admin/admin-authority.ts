import { UserRole } from "@prisma/client";

import type { DecRole } from "@/lib/access";

export const ADMIN_AUTHORITY_CHANGE_ERROR =
  "Only Super Admin-equivalent users can grant or change Platform Admin authority.";

export function isSuperAdminEquivalentForPhase1(role: DecRole) {
  return role === "admin";
}

export function touchesPlatformAdminAuthority(
  currentRoles: readonly UserRole[],
  nextRoles: readonly UserRole[],
) {
  return currentRoles.includes(UserRole.ADMIN) || nextRoles.includes(UserRole.ADMIN);
}

export function canChangePlatformAdminAuthority(input: {
  actorRole: DecRole;
  currentRoles: readonly UserRole[];
  nextRoles: readonly UserRole[];
}) {
  return (
    !touchesPlatformAdminAuthority(input.currentRoles, input.nextRoles) ||
    isSuperAdminEquivalentForPhase1(input.actorRole)
  );
}

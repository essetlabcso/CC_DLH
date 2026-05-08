import { UserRole } from "@prisma/client";

import type { DecRole } from "@/lib/access";

export const ADMIN_AUTHORITY_CHANGE_ERROR =
  "Only a legacy Admin can assign or change Platform Admin authority.";

export function isLegacySuperAdminEquivalent(role: DecRole) {
  return role === "admin";
}

export function touchesLegacyAdminAuthority(
  currentRoles: readonly UserRole[],
  nextRoles: readonly UserRole[],
) {
  return currentRoles.includes(UserRole.ADMIN) || nextRoles.includes(UserRole.ADMIN);
}

export function canChangeLegacyAdminAuthority(input: {
  actorRole: DecRole;
  currentRoles: readonly UserRole[];
  nextRoles: readonly UserRole[];
}) {
  return (
    !touchesLegacyAdminAuthority(input.currentRoles, input.nextRoles) ||
    isLegacySuperAdminEquivalent(input.actorRole)
  );
}

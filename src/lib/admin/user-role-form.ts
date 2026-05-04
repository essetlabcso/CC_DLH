import { roles, type DecRole, isDecRole } from "@/lib/access";

export type UserRoleUpdateResult =
  | {
      ok: true;
      roles: DecRole[];
      reason: string;
    }
  | {
      ok: false;
      message: string;
    };

export function parseUserRoleUpdateForm(
  formData: FormData,
): UserRoleUpdateResult {
  const selectedRoles = formData
    .getAll("roles")
    .map((role) => String(role).trim().toLowerCase())
    .filter(isDecRole);
  const uniqueRoles = Array.from(new Set(selectedRoles));
  const reason = String(formData.get("changeReason") || "").trim();

  if (uniqueRoles.length === 0) {
    return {
      ok: false,
      message: "Choose at least one role for this user.",
    };
  }

  if (!reason) {
    return {
      ok: false,
      message: "Enter a reason for this role update.",
    };
  }

  return {
    ok: true,
    roles: roles.filter((role) => uniqueRoles.includes(role)),
    reason,
  };
}

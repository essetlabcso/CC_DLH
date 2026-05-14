"use server";

import { revalidatePath } from "next/cache";
import { PermissionScopeType, ScopedRoleKey } from "@prisma/client";

import { requirePermissionIdentity } from "@/lib/auth/server";
import {
  assignScopedRole,
  disableScopedRoleAssignment,
} from "@/lib/admin/scoped-assignments";

export type ScopedAssignmentActionState = {
  ok: boolean;
  message: string;
};

const PAGE_PATH = "/admin/users/scoped-assignments";

export async function assignScopedRoleAction(
  prevState: ScopedAssignmentActionState,
  formData: FormData
): Promise<ScopedAssignmentActionState> {
  const identity = await requirePermissionIdentity(PAGE_PATH);

  const email = formData.get("email") as string;
  const roleKey = formData.get("roleKey") as ScopedRoleKey;
  const scopeType = formData.get("scopeType") as PermissionScopeType;
  const scopeValue = formData.get("scopeValue") as string;
  const reason = formData.get("reason") as string;

  try {
    await assignScopedRole({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      email,
      roleKey,
      scopeType,
      scopeValue,
      reason,
    });
    revalidatePath(PAGE_PATH);
    return { ok: true, message: "Scoped role assigned successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

export async function disableScopedRoleAction(
  assignmentId: string,
  reason: string
): Promise<ScopedAssignmentActionState> {
  const identity = await requirePermissionIdentity(PAGE_PATH);

  try {
    await disableScopedRoleAssignment({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      assignmentId,
      reason,
    });
    revalidatePath(PAGE_PATH);
    return { ok: true, message: "Scoped role assignment disabled." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

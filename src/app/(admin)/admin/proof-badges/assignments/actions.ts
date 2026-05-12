"use server";

import { revalidatePath } from "next/cache";
import { PermissionScopeType } from "@prisma/client";

import { requirePermissionIdentity } from "@/lib/auth/server";
import {
  assignProofVerifier,
  disableProofVerifierAssignment,
} from "@/lib/admin/proof-verifier-assignments";

export type ProofAssignmentActionState = {
  ok: boolean;
  message: string;
};

export async function assignProofVerifierAction(
  prevState: ProofAssignmentActionState,
  formData: FormData
): Promise<ProofAssignmentActionState> {
  const identity = await requirePermissionIdentity("/admin/proof-badges/assignments");

  const email = formData.get("email") as string;
  const scopeType = formData.get("scopeType") as PermissionScopeType;
  const scopeValue = formData.get("scopeValue") as string;
  const reason = formData.get("reason") as string;

  try {
    await assignProofVerifier({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      email,
      scopeType,
      scopeValue,
      reason,
    });
    revalidatePath("/admin/proof-badges/assignments");
    return { ok: true, message: "Verifier assigned successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

export async function disableAssignmentAction(
  assignmentId: string,
  reason: string
): Promise<ProofAssignmentActionState> {
  const identity = await requirePermissionIdentity("/admin/proof-badges/assignments");

  try {
    await disableProofVerifierAssignment({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      assignmentId,
      reason,
    });
    revalidatePath("/admin/proof-badges/assignments");
    return { ok: true, message: "Assignment disabled." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

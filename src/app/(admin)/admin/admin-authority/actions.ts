"use server";

import { ScopedRoleAssignmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import {
  grantPlatformAdminAuthority,
  updatePlatformAdminAuthorityStatus,
} from "@/lib/admin/admin-authority";

export type AdminAuthorityActionState = {
  ok: boolean;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function grantPlatformAdminAction(
  prevState: AdminAuthorityActionState,
  formData: FormData,
): Promise<AdminAuthorityActionState> {
  try {
    const identity = await requireWorkspaceIdentity("/admin/admin-authority");
    
    const email = formData.get("email")?.toString().trim() ?? "";
    const reason = formData.get("reason")?.toString().trim() ?? "";

    if (!email || !emailPattern.test(email)) {
      return {
        ok: false,
        message: "Please provide a valid email address",
      };
    }

    if (reason.length < 10) {
      return {
        ok: false,
        message: "Reason must be at least 10 characters",
      };
    }

    await grantPlatformAdminAuthority({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      email: email,
      reason: reason,
    });

    revalidatePath("/admin/admin-authority");
    return {
      ok: true,
      message: `Successfully granted Platform Admin authority to ${email}`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { ok: false, message: msg };
  }
}

export async function updatePlatformAdminStatusAction(
  assignmentId: string,
  status: ScopedRoleAssignmentStatus,
  reason: string,
): Promise<AdminAuthorityActionState> {
  try {
    const identity = await requireWorkspaceIdentity("/admin/admin-authority");

    const trimmedReason = reason?.trim();
    if (!trimmedReason || trimmedReason.length < 10) {
      return {
        ok: false,
        message: "A descriptive reason (min 10 characters) is required.",
      };
    }

    await updatePlatformAdminAuthorityStatus({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      assignmentId,
      reason: trimmedReason,
      status,
    });

    revalidatePath("/admin/admin-authority");
    return {
      ok: true,
      message: `Authority status successfully updated to ${status.toLowerCase()}.`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { ok: false, message: msg };
  }
}

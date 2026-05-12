"use server";

import { revalidatePath } from "next/cache";
import { PermissionScopeType } from "@prisma/client";

import { requirePermissionIdentity } from "@/lib/auth/server";
import {
  assignCourseReviewer,
  disableCourseReviewerAssignment,
} from "@/lib/admin/course-reviewer-assignments";

export type ReviewerAssignmentActionState = {
  ok: boolean;
  message: string;
};

export async function assignCourseReviewerAction(
  prevState: ReviewerAssignmentActionState,
  formData: FormData
): Promise<ReviewerAssignmentActionState> {
  const identity = await requirePermissionIdentity("/admin/courses/assignments");

  const email = formData.get("email") as string;
  const scopeType = formData.get("scopeType") as PermissionScopeType;
  const scopeValue = formData.get("scopeValue") as string;
  const reason = formData.get("reason") as string;

  try {
    await assignCourseReviewer({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      email,
      scopeType,
      scopeValue,
      reason,
    });
    revalidatePath("/admin/courses/assignments");
    return { ok: true, message: "Reviewer assigned successfully." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

export async function disableCourseReviewerAssignmentAction(
  assignmentId: string,
  reason: string
): Promise<ReviewerAssignmentActionState> {
  const identity = await requirePermissionIdentity("/admin/courses/assignments");

  try {
    await disableCourseReviewerAssignment({
      actorId: identity.user.id,
      actorRole: identity.session.role,
      assignmentId,
      reason,
    });
    revalidatePath("/admin/courses/assignments");
    return { ok: true, message: "Assignment disabled." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, message };
  }
}

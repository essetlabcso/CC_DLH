"use server";

import { revalidatePath } from "next/cache";

import {
  assignLearnerToCohort,
  assignLearnerToCourse,
  assignLearnerToProgram,
  parseAdminAssignmentForm,
  type AdminAssignmentPrisma,
} from "@/lib/admin/admin-assignments";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

const db = prisma as unknown as AdminAssignmentPrisma;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AdminAssignmentActionState = {
  ok: boolean;
  message: string;
};

// ---------------------------------------------------------------------------
// Course Assignment Action
// ---------------------------------------------------------------------------

export async function assignToCourseAction(
  _prevState: AdminAssignmentActionState,
  formData: FormData,
): Promise<AdminAssignmentActionState> {
  const identity = await requireWorkspaceIdentity("/admin/participant-access");
  const parsed = parseAdminAssignmentForm(formData, "course");

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const result = await assignLearnerToCourse(db, {
    email: parsed.data.email,
    courseId: parsed.data.targetId,
    organizationId: parsed.data.organizationId,
    reason: parsed.data.reason,
    actorId: identity.user.id,
  });

  if (result.ok) {
    revalidatePath("/admin/participant-access");
    revalidatePath("/admin/audit-log");
  }

  return { ok: result.ok, message: result.message };
}

// ---------------------------------------------------------------------------
// Program Assignment Action
// ---------------------------------------------------------------------------

export async function assignToProgramAction(
  _prevState: AdminAssignmentActionState,
  formData: FormData,
): Promise<AdminAssignmentActionState> {
  const identity = await requireWorkspaceIdentity("/admin/participant-access");
  const parsed = parseAdminAssignmentForm(formData, "program");

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const result = await assignLearnerToProgram(db, {
    email: parsed.data.email,
    programId: parsed.data.targetId,
    organizationId: parsed.data.organizationId,
    reason: parsed.data.reason,
    actorId: identity.user.id,
  });

  if (result.ok) {
    revalidatePath("/admin/participant-access");
    revalidatePath("/admin/audit-log");
  }

  return { ok: result.ok, message: result.message };
}

// ---------------------------------------------------------------------------
// Cohort Assignment Action
// ---------------------------------------------------------------------------

export async function assignToCohortAction(
  _prevState: AdminAssignmentActionState,
  formData: FormData,
): Promise<AdminAssignmentActionState> {
  const identity = await requireWorkspaceIdentity("/admin/participant-access");
  const parsed = parseAdminAssignmentForm(formData, "cohort");

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const result = await assignLearnerToCohort(db, {
    email: parsed.data.email,
    cohortId: parsed.data.targetId,
    organizationId: parsed.data.organizationId || undefined,
    reason: parsed.data.reason,
    actorId: identity.user.id,
  });

  if (result.ok) {
    revalidatePath("/admin/participant-access");
    revalidatePath("/admin/audit-log");
  }

  return { ok: result.ok, message: result.message };
}

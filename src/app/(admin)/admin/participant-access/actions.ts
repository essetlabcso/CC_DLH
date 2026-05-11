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
// Status Management Actions
// ---------------------------------------------------------------------------

import { LearnerParticipantStatus } from "@prisma/client";
import {
  updateProgramParticipantStatus,
  updateCohortParticipantStatus,
  type AdminManagementPrisma,
} from "@/lib/admin/participant-management";

const manageDb = prisma as unknown as AdminManagementPrisma;

function parseManagementForm(formData: FormData):
  | { ok: true; data: { participantId: string; targetStatus: LearnerParticipantStatus; reason: string } }
  | { ok: false; message: string }
{
  const participantId = formData.get("participantId")?.toString();
  const targetStatus = formData.get("targetStatus")?.toString() as LearnerParticipantStatus;
  const reason = formData.get("reason")?.toString();

  if (!participantId) return { ok: false, message: "Participant ID required." };
  if (!targetStatus) return { ok: false, message: "Target status required." };
  if (!reason || reason.trim().length < 10) {
    return { ok: false, message: "Valid reason (min 10 chars) is required." };
  }

  return {
    ok: true,
    data: { participantId, targetStatus, reason: reason.trim() },
  };
}

export async function updateProgramParticipantStatusAction(
  _prevState: AdminAssignmentActionState,
  formData: FormData,
): Promise<AdminAssignmentActionState> {
  const identity = await requireWorkspaceIdentity("/admin/participant-access");
  const parsed = parseManagementForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const result = await updateProgramParticipantStatus(manageDb, {
    ...parsed.data,
    actorId: identity.user.id,
  });

  if (result.ok) {
    revalidatePath("/admin/participant-access");
    revalidatePath("/admin/audit-log");
  }

  return { ok: result.ok, message: result.message };
}

export async function updateCohortParticipantStatusAction(
  _prevState: AdminAssignmentActionState,
  formData: FormData,
): Promise<AdminAssignmentActionState> {
  const identity = await requireWorkspaceIdentity("/admin/participant-access");
  const parsed = parseManagementForm(formData);

  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const result = await updateCohortParticipantStatus(manageDb, {
    ...parsed.data,
    actorId: identity.user.id,
  });

  if (result.ok) {
    revalidatePath("/admin/participant-access");
    revalidatePath("/admin/audit-log");
  }

  return { ok: result.ok, message: result.message };
}

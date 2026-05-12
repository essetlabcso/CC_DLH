"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  cancelAdminLearnerInvitation,
  createAdminLearnerInvitation,
  parseAdminLearnerInvitationForm,
  parseAdminLearnerInvitationRotationForm,
  parseAdminLearnerInvitationStatusReason,
  revokeAdminLearnerInvitation,
  rotateAdminLearnerInvitation,
  type AdminLearnerInvitationPrisma,
} from "@/lib/admin/learner-invitations";

export type CreateLearnerInvitationActionState = {
  ok: boolean;
  message: string;
  inviteLink?: string;
};

export async function createLearnerInvitationAction(
  _previousState: CreateLearnerInvitationActionState,
  formData: FormData,
): Promise<CreateLearnerInvitationActionState> {
  const identity = await requireWorkspaceIdentity("/admin/learner-invitations");
  const parsed = parseAdminLearnerInvitationForm(formData);

  if (!parsed.ok) {
    return {
      ok: false,
      message: parsed.message,
    };
  }

  const result = await createAdminLearnerInvitation(
    prisma as unknown as AdminLearnerInvitationPrisma,
    {
      ...parsed.data,
      invitedById: identity.user.id,
    },
  );

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  return {
    ok: true,
    message: "Invitation created. Copy this link now. It will not be shown again.",
    inviteLink: await buildInviteLink(result.rawToken),
  };
}

export type RotateLearnerInvitationActionState = {
  ok: boolean;
  message: string;
  inviteLink?: string;
};

export async function rotateLearnerInvitationAction(
  invitationId: string,
  _previousState: RotateLearnerInvitationActionState,
  formData: FormData,
): Promise<RotateLearnerInvitationActionState> {
  const identity = await requireWorkspaceIdentity("/admin/learner-invitations");
  const parsed = parseAdminLearnerInvitationRotationForm(formData);

  if (!parsed.ok) {
    return {
      ok: false,
      message: parsed.message,
    };
  }

  const result = await rotateAdminLearnerInvitation(
    prisma as unknown as AdminLearnerInvitationPrisma,
    {
      invitationId,
      actorId: identity.user.id,
      expiresAt: parsed.expiresAt,
      reason: parsed.reason,
    },
  );

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  return {
    ok: true,
    message:
      "Invitation token rotated. Copy this new link now. The older link is now invalid.",
    inviteLink: await buildInviteLink(result.rawToken),
  };
}

export async function cancelLearnerInvitationAction(
  invitationId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/learner-invitations");
  const parsed = parseAdminLearnerInvitationStatusReason(formData);

  if (!parsed.ok) {
    redirectWithInvitationStatusError(parsed.message);
  }

  const result = await cancelAdminLearnerInvitation(
    prisma as unknown as AdminLearnerInvitationPrisma,
    {
      invitationId,
      actorId: identity.user.id,
      reason: parsed.reason,
    },
  );

  if (!result.ok) {
    redirectWithInvitationStatusError(result.message);
  }

  redirect("/admin/learner-invitations?updated=cancelled");
}

export async function revokeLearnerInvitationAction(
  invitationId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/learner-invitations");
  const parsed = parseAdminLearnerInvitationStatusReason(formData);

  if (!parsed.ok) {
    redirectWithInvitationStatusError(parsed.message);
  }

  const result = await revokeAdminLearnerInvitation(
    prisma as unknown as AdminLearnerInvitationPrisma,
    {
      invitationId,
      actorId: identity.user.id,
      reason: parsed.reason,
    },
  );

  if (!result.ok) {
    redirectWithInvitationStatusError(result.message);
  }

  redirect("/admin/learner-invitations?updated=revoked");
}

async function buildInviteLink(rawToken: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!host) {
    return `/invite/${encodeURIComponent(rawToken)}`;
  }

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}/invite/${encodeURIComponent(rawToken)}`;
}

function redirectWithInvitationStatusError(message: string): never {
  redirect(
    `/admin/learner-invitations?error=${encodeURIComponent(message)}`,
  );
}

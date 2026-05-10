"use server";

import { headers } from "next/headers";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  createAdminLearnerInvitation,
  parseAdminLearnerInvitationForm,
  type AdminLearnerInvitationPrisma,
} from "@/lib/admin/learner-invitations";

export type CreateLearnerInvitationActionState = {
  ok: boolean;
  message: string;
  inviteLink?: string;
};

export const initialCreateLearnerInvitationActionState: CreateLearnerInvitationActionState =
  {
    ok: false,
    message: "",
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

async function buildInviteLink(rawToken: string) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");

  if (!host) {
    return `/invite/${encodeURIComponent(rawToken)}`;
  }

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}/invite/${encodeURIComponent(rawToken)}`;
}

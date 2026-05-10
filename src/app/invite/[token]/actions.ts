"use server";

import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  acceptLearnerInvitation,
  type LearnerInvitationAcceptancePrisma,
} from "@/lib/learner/invitation-acceptance";

export async function acceptLearnerInvitationAction(token: string) {
  const invitationPath = buildInvitationPath(token);
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect(`/sign-in?next=${encodeURIComponent(invitationPath)}`);
  }

  if (identity.session.role !== "learner") {
    redirect(
      `/forbidden?next=${encodeURIComponent(invitationPath)}&workspace=learner`,
    );
  }

  const result = await acceptLearnerInvitation(
    prisma as unknown as LearnerInvitationAcceptancePrisma,
    {
      token,
      identity: {
        userId: identity.user.id,
        email: identity.user.email,
        organizationId: identity.user.organizationId,
        roles: identity.user.roles,
      },
    },
  );

  if (result.ok) {
    redirect(
      result.courseId
        ? `/learn/courses/${result.courseId}?invitation=accepted`
        : "/learn?invitation=accepted",
    );
  }

  redirect(`${invitationPath}?error=${result.reason}`);
}

function buildInvitationPath(token: string) {
  return `/invite/${encodeURIComponent(token)}`;
}

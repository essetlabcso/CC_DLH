import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getCurrentIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  loadLearnerInvitationPreview,
  type LearnerInvitationAcceptancePrisma,
} from "@/lib/learner/invitation-acceptance";

import { acceptLearnerInvitationAction } from "./actions";

type InvitationPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function InvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const { token } = await params;
  const query = await searchParams;
  const identity = await getCurrentIdentity();
  const invitationPath = `/invite/${encodeURIComponent(token)}`;
  const preview = await loadLearnerInvitationPreview(
    prisma as unknown as Pick<
      LearnerInvitationAcceptancePrisma,
      "learnerInvitation"
    >,
    {
      token,
      identity: identity
        ? {
            userId: identity.user.id,
            email: identity.user.email,
            organizationId: identity.user.organizationId,
            roles: identity.user.roles,
          }
        : null,
    },
  );
  const errorReason = normalizeInvitationError(query?.error);
  const message = errorReason
    ? invitationMessageForReason(errorReason)
    : preview.ok
      ? null
      : invitationMessageForReason(preview.reason);

  return (
    <WorkspaceShell eyebrow="Learning Invitation" title="Accept invitation">
      {message ? <p className="workspace-error">{message}</p> : null}

      {!preview.ok && preview.reason === "SIGN_IN_REQUIRED" ? (
        <>
          <p>Sign in with the invited account to continue.</p>
          <Link
            className="workspace-button"
            href={`/sign-in?next=${encodeURIComponent(invitationPath)}`}
          >
            Sign in to accept
          </Link>
        </>
      ) : null}

      {preview.ok ? (
        <>
          <p>
            This invitation is ready. Accept it to add the learning assignment
            to your account.
          </p>
          {preview.status === "ALREADY_ACCEPTED" ? (
            <Link
              className="workspace-button"
              href={
                preview.courseId ? `/learn/courses/${preview.courseId}` : "/learn"
              }
            >
              Continue to learning
            </Link>
          ) : (
            <form action={acceptLearnerInvitationAction.bind(null, token)}>
              <button className="workspace-button" type="submit">
                Accept invitation
              </button>
            </form>
          )}
        </>
      ) : null}

      {!preview.ok && preview.reason !== "SIGN_IN_REQUIRED" ? (
        <Link
          className="workspace-link"
          href={`/sign-in?next=${encodeURIComponent(invitationPath)}`}
        >
          Use a different account
        </Link>
      ) : null}
    </WorkspaceShell>
  );
}

function normalizeInvitationError(error: string | undefined) {
  if (
    error === "INVITATION_UNAVAILABLE" ||
    error === "INVITATION_EXPIRED" ||
    error === "SIGN_IN_WITH_INVITED_ACCOUNT"
  ) {
    return error;
  }

  return null;
}

function invitationMessageForReason(
  reason:
    | "INVITATION_UNAVAILABLE"
    | "INVITATION_EXPIRED"
    | "SIGN_IN_REQUIRED"
    | "SIGN_IN_WITH_INVITED_ACCOUNT",
) {
  if (reason === "INVITATION_EXPIRED") {
    return "This invitation has expired.";
  }

  if (
    reason === "SIGN_IN_REQUIRED" ||
    reason === "SIGN_IN_WITH_INVITED_ACCOUNT"
  ) {
    return "Sign in with the invited account to continue.";
  }

  return "This invitation is unavailable.";
}

"use client";

import { useActionState, useState } from "react";

import {
  rotateLearnerInvitationAction,
  type RotateLearnerInvitationActionState,
} from "./actions";

type InvitationRotateFormProps = {
  invitationId: string;
  isExpired?: boolean;
};

const initialRotateLearnerInvitationActionState: RotateLearnerInvitationActionState =
  {
    ok: false,
    message: "",
  };

export function InvitationRotateForm({
  invitationId,
  isExpired = false,
}: InvitationRotateFormProps) {
  const [state, formAction, pending] = useActionState(
    rotateLearnerInvitationAction.bind(null, invitationId),
    initialRotateLearnerInvitationActionState,
  );
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    if (!state.inviteLink) {
      return;
    }

    await navigator.clipboard.writeText(state.inviteLink);
    setCopied(true);
  }

  if (state.inviteLink) {
    return (
      <div className="admin-inline-form">
        <p className="workspace-note">{state.message}</p>
        <div className="admin-inline-form">
          <label>
            <span>New invitation link</span>
            <input readOnly type="text" value={state.inviteLink} />
          </label>
          <button
            className="workspace-link secondary"
            onClick={copyInviteLink}
            type="button"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="admin-inline-form">
      {state.message && !state.ok ? (
        <p className="workspace-error">{state.message}</p>
      ) : null}

      <label>
        <span>
          New expires at (
          {isExpired ? "Required" : "leave blank to retain existing"})
        </span>
        <input
          name="expiresAt"
          required={isExpired}
          type="datetime-local"
        />
      </label>

      <label>
        <span>Reason to rotate token</span>
        <textarea
          name="reason"
          placeholder="Briefly explain why you are issuing a new token."
          required
          rows={2}
        />
      </label>

      <button
        className="workspace-link secondary"
        disabled={pending}
        type="submit"
      >
        {pending ? "Rotating..." : "Rotate token"}
      </button>
    </form>
  );
}

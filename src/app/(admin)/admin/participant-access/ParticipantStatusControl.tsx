"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { LearnerParticipantStatus } from "@prisma/client";
import {
  updateProgramParticipantStatusAction,
  updateCohortParticipantStatusAction,
  type AdminAssignmentActionState,
} from "./actions";

type ParticipantStatusControlProps = {
  participantId: string;
  currentStatus: LearnerParticipantStatus;
  type: "PROGRAM" | "COHORT";
};

const TERMINAL_STATUSES: LearnerParticipantStatus[] = [
  LearnerParticipantStatus.COMPLETED,
  LearnerParticipantStatus.WITHDRAWN,
  LearnerParticipantStatus.CANCELLED,
  LearnerParticipantStatus.EXPIRED,
];

const ALLOWED_TARGET_STATUSES = [
  LearnerParticipantStatus.ACTIVE,
  LearnerParticipantStatus.SUSPENDED,
  LearnerParticipantStatus.COMPLETED,
  LearnerParticipantStatus.WITHDRAWN,
  LearnerParticipantStatus.CANCELLED,
];

export function ParticipantStatusControl({
  participantId,
  currentStatus,
  type,
}: ParticipantStatusControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [, startTransition] = useTransition();

  const actionToUse =
    type === "PROGRAM"
      ? updateProgramParticipantStatusAction
      : updateCohortParticipantStatusAction;

  const initialState: AdminAssignmentActionState = {
    ok: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(actionToUse, initialState);

  // Safely reset toggle on successful operation
  useEffect(() => {
    if (state.ok && !isPending) {
      setIsEditing(false);
    }
  }, [state.ok, isPending]);

  const wrappedSubmit = (payload: FormData) => {
    startTransition(() => {
      formAction(payload);
    });
  };

  if (TERMINAL_STATUSES.includes(currentStatus)) {
    // Defer reactivation of terminal records to a future package.
    return null;
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        className="workspace-link"
        style={{ fontSize: "0.875rem" }}
        onClick={() => setIsEditing(true)}
      >
        Manage
      </button>
    );
  }

  return (
    <form
      action={wrappedSubmit}
      className="admin-management-inline-form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        minWidth: "180px",
        padding: "0.5rem",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "4px",
      }}
    >
      <input type="hidden" name="participantId" value={participantId} />
      
      <div>
        <label
          className="workspace-label"
          style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}
        >
          New Status
        </label>
        <select
          name="targetStatus"
          className="workspace-input"
          style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem" }}
          defaultValue={currentStatus}
          disabled={isPending}
          required
        >
          {ALLOWED_TARGET_STATUSES.map((stat) => (
            <option key={stat} value={stat}>
              {stat.charAt(0) + stat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: "0.7rem", opacity: 0.8, margin: "0.25rem 0" }}>
        Changes are logged in the audit trail. Records are preserved.
      </p>

      <div>
        <label
          className="workspace-label"
          style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}
        >
          Reason (min 10 chars)
        </label>
        <textarea
          name="reason"
          className="workspace-input"
          style={{ fontSize: "0.875rem", minHeight: "50px", resize: "vertical" }}
          required
          minLength={10}
          disabled={isPending}
          placeholder="Why is this being changed?"
        />
      </div>

      {state.message && !state.ok && (
        <p style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}>
          {state.message}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          className="workspace-button-primary"
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", flex: 1 }}
          disabled={isPending}
        >
          {isPending ? "..." : "Save"}
        </button>
        <button
          type="button"
          className="workspace-button-secondary"
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", flex: 1 }}
          onClick={() => setIsEditing(false)}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { ScopedRoleAssignmentStatus } from "@prisma/client";

import {
  grantPlatformAdminAction,
  updatePlatformAdminStatusAction,
  type AdminAuthorityActionState,
} from "./actions";

// ---------------------------------------------------------------------------
// 1. Grant Controls
// ---------------------------------------------------------------------------

export function GrantPlatformAdminPanel() {
  const initialState: AdminAuthorityActionState = {
    ok: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    grantPlatformAdminAction,
    initialState
  );

  const [, startTransition] = useTransition();

  const wrappedSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  // State tracker optionally used for side-effects
  useEffect(() => {
    if (state.ok && !isPending) {
      // Handle side effect if needed
    }
  }, [state.ok, isPending]);

  return (
    <details className="reference-filter-panel" style={{ marginBottom: "1.5rem" }}>
      <summary className="reference-filter-summary">
        <span className="workspace-button-secondary" style={{ fontSize: "0.875rem" }}>
          + Grant New Platform Admin Authority
        </span>
      </summary>
      <div className="reference-filter-content" style={{ maxWidth: "500px", marginTop: "1rem" }}>
        <form action={wrappedSubmit} className="admin-grant-form" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3>Grant Platform Admin Authority</h3>
          <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
            This grants day-to-day Admin workspace access. The target user must already exist and hold active membership.
          </p>

          <div className="form-group">
            <label htmlFor="grant-email" className="workspace-label">User Email</label>
            <input
              id="grant-email"
              name="email"
              type="email"
              className="workspace-input"
              required
              placeholder="user@example.com"
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="grant-reason" className="workspace-label">Reason (Audit Log)</label>
            <textarea
              id="grant-reason"
              name="reason"
              className="workspace-input"
              required
              minLength={10}
              placeholder="Purpose of this grant..."
              rows={3}
              disabled={isPending}
            />
          </div>

          {state.message && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "4px",
                fontSize: "0.875rem",
                backgroundColor: state.ok ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: state.ok ? "#4ade80" : "#fca5a5",
                border: `1px solid ${state.ok ? "#22c55e33" : "#ef444433"}`,
              }}
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            className="workspace-button-primary"
            disabled={isPending}
            style={{ alignSelf: "flex-start" }}
          >
            {isPending ? "Processing..." : "Submit Grant Request"}
          </button>
        </form>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// 2. Status Controls
// ---------------------------------------------------------------------------

type StatusControlProps = {
  assignmentId: string;
  currentStatus: ScopedRoleAssignmentStatus;
};

const ALLOWED_TARGET_STATUSES = [
  ScopedRoleAssignmentStatus.ACTIVE,
  ScopedRoleAssignmentStatus.DISABLED,
];

export function PlatformAdminStatusControl({
  assignmentId,
  currentStatus,
}: StatusControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState("");
  const [targetStatus, setTargetStatus] = useState<ScopedRoleAssignmentStatus>(currentStatus);

  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Reset target state if editing opens
  useEffect(() => {
    if (isEditing) {
      setTargetStatus(currentStatus);
      setReason("");
      setErrorMsg("");
    }
  }, [isEditing, currentStatus]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetStatus === currentStatus) {
      setErrorMsg("Select a different status to apply changes.");
      return;
    }
    if (reason.trim().length < 10) {
      setErrorMsg("Reason must be at least 10 characters.");
      return;
    }

    setIsPending(true);
    setErrorMsg("");
    
    try {
      const res = await updatePlatformAdminStatusAction(assignmentId, targetStatus, reason.trim());
      if (res.ok) {
        setIsEditing(false);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg("System failure submitting status change.");
    } finally {
      setIsPending(false);
    }
  };

  if (currentStatus === ScopedRoleAssignmentStatus.EXPIRED) {
    return <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>None</span>;
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        className="workspace-link"
        style={{ fontSize: "0.875rem" }}
        onClick={() => setIsEditing(true)}
      >
        Update Status
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSave}
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
      <div>
        <label className="workspace-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
          New Status
        </label>
        <select
          className="workspace-input"
          style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem" }}
          value={targetStatus}
          onChange={(e) => setTargetStatus(e.target.value as ScopedRoleAssignmentStatus)}
          disabled={isPending}
          required
        >
          {ALLOWED_TARGET_STATUSES.map((stat) => (
            <option key={stat} value={stat}>
              {stat === ScopedRoleAssignmentStatus.ACTIVE ? "Active" : "Disabled"}
            </option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: "0.7rem", opacity: 0.8, margin: "0.25rem 0" }}>
        Record preservation policy applies. History will be logged.
      </p>

      <div>
        <label className="workspace-label" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
          Reason (min 10 chars)
        </label>
        <textarea
          className="workspace-input"
          style={{ fontSize: "0.875rem", minHeight: "50px", resize: "vertical" }}
          required
          minLength={10}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isPending}
          placeholder="Justification..."
        />
      </div>

      {errorMsg && (
        <p style={{ color: "#ef4444", fontSize: "0.75rem", margin: 0 }}>
          {errorMsg}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          className="workspace-button-primary"
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", flex: 1 }}
          disabled={isPending || targetStatus === currentStatus}
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

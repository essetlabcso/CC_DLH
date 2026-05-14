"use client";

import { useActionState, useState } from "react";
import {
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
} from "@prisma/client";
import {
  assignScopedRoleAction,
  disableScopedRoleAction,
  type ScopedAssignmentActionState,
} from "./actions";

const MANAGED_ROLES = [
  { value: ScopedRoleKey.FACILITATOR, label: "Facilitator" },
  { value: ScopedRoleKey.ORG_FOCAL_PERSON, label: "Organization Focal Person" },
  { value: ScopedRoleKey.PROGRAM_ME_MANAGER, label: "Program M&E Manager" },
  { value: ScopedRoleKey.SAFE_DASHBOARD_VIEWER, label: "Safe Dashboard Viewer" },
];

const ALLOWED_SCOPE_TYPES = [
  { value: PermissionScopeType.ORGANIZATION, label: "Organization" },
  { value: PermissionScopeType.PROGRAM, label: "Program" },
  { value: PermissionScopeType.COHORT, label: "Cohort" },
  { value: PermissionScopeType.COURSE, label: "Course" },
];

export function GrantScopedRolePanel() {
  const initialState: ScopedAssignmentActionState = { ok: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    assignScopedRoleAction,
    initialState,
  );

  const [roleKey, setRoleKey] = useState<string>(ScopedRoleKey.FACILITATOR);
  const [scopeType, setScopeType] = useState<string>(PermissionScopeType.ORGANIZATION);

  return (
    <details
      className="reference-filter-panel"
      style={{ marginBottom: "1.5rem" }}
    >
      <summary className="reference-filter-summary">
        <span
          className="workspace-button-secondary"
          style={{ fontSize: "0.875rem" }}
        >
          + Assign Local Scoped Role
        </span>
      </summary>
      <div
        className="reference-filter-content"
        style={{ maxWidth: "600px", marginTop: "1rem" }}
      >
        <form
          action={formAction}
          className="admin-grant-form"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h3>Assign Scoped Role</h3>
          <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
            Allocates specific local authority (e.g. Facilitator or Focal Person) 
            bounded by target entity ID.
          </p>

          <div className="form-group">
            <label htmlFor="grant-email" className="workspace-label">
              User Email
            </label>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label htmlFor="grant-role-key" className="workspace-label">
                Scoped Role
              </label>
              <select
                id="grant-role-key"
                name="roleKey"
                className="workspace-input"
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value)}
                disabled={isPending}
                required
              >
                {MANAGED_ROLES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="grant-scope-type" className="workspace-label">
                Scope Dimension
              </label>
              <select
                id="grant-scope-type"
                name="scopeType"
                className="workspace-input"
                value={scopeType}
                onChange={(e) => setScopeType(e.target.value)}
                disabled={isPending}
                required
              >
                {ALLOWED_SCOPE_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="grant-scope-value" className="workspace-label">
              Target Dimension ID
            </label>
            <input
              id="grant-scope-value"
              name="scopeValue"
              className="workspace-input"
              placeholder="e.g. organization-uuid or cohort-uuid"
              required
              disabled={isPending}
            />
            <small style={{ opacity: 0.7, display: "block", marginTop: "0.25rem" }}>
              Provide the precise database ID (UUID) of the target {scopeType.toLowerCase()} entity.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="grant-reason" className="workspace-label">
              Reason (Required for Audit)
            </label>
            <textarea
              id="grant-reason"
              name="reason"
              className="workspace-input"
              required
              minLength={10}
              placeholder="Governance justification (minimum 10 characters)..."
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
                backgroundColor: state.ok
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(239, 68, 68, 0.1)",
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
            {isPending ? "Executing..." : "Confirm Assignment"}
          </button>
        </form>
      </div>
    </details>
  );
}

export function ScopedAssignmentStatusControl({
  assignmentId,
  currentStatus,
}: {
  assignmentId: string;
  currentStatus: ScopedRoleAssignmentStatus;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (currentStatus !== ScopedRoleAssignmentStatus.ACTIVE) {
    return <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>Disabled</span>;
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        className="workspace-link"
        style={{ fontSize: "0.875rem", color: "#fca5a5" }}
        onClick={() => setIsEditing(true)}
      >
        Revoke
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setErrorMsg("Reason must be at least 10 chars.");
      return;
    }

    setIsPending(true);
    setErrorMsg("");

    try {
      const res = await disableScopedRoleAction(assignmentId, reason.trim());
      if (res.ok) {
        setIsEditing(false);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg("Network or unknown system failure.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        minWidth: "160px",
        padding: "0.5rem",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "4px",
      }}
    >
      <label className="workspace-label" style={{ fontSize: "0.7rem" }}>
        Revoke Reason
      </label>
      <textarea
        className="workspace-input"
        style={{ fontSize: "0.75rem", minHeight: "40px" }}
        required
        minLength={10}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={isPending}
      />
      {errorMsg && (
        <p style={{ color: "#ef4444", fontSize: "0.7rem" }}>{errorMsg}</p>
      )}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          className="workspace-button-primary"
          disabled={isPending}
          style={{
            fontSize: "0.7rem",
            padding: "0.2rem",
            flex: 1,
            background: "#b91c1c",
          }}
        >
          {isPending ? "..." : "Revoke"}
        </button>
        <button
          type="button"
          className="workspace-button-secondary"
          onClick={() => setIsEditing(false)}
          disabled={isPending}
          style={{ fontSize: "0.7rem", padding: "0.2rem", flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

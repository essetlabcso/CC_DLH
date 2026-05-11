"use client";

import { useActionState } from "react";

import {
  assignToCohortAction,
  assignToCourseAction,
  assignToProgramAction,
  type AdminAssignmentActionState,
} from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DropdownOption = {
  label: string;
  value: string;
};

type AssignmentPanelsProps = {
  organizationOptions: DropdownOption[];
  courseOptions: DropdownOption[];
  programOptions: DropdownOption[];
  cohortOptions: DropdownOption[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const initialState: AdminAssignmentActionState = {
  ok: false,
  message: "",
};

export function AssignmentPanels({
  organizationOptions,
  courseOptions,
  programOptions,
  cohortOptions,
}: AssignmentPanelsProps) {
  return (
    <section
      className="admin-section"
      aria-labelledby="participant-assignment-title"
    >
      <div className="admin-section-heading">
        <h2 id="participant-assignment-title">Direct assignment</h2>
        <p>
          Assign a learner directly to a course, program, or cohort. All
          assignments require a reason and are audited.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <CourseAssignmentPanel
          courseOptions={courseOptions}
          organizationOptions={organizationOptions}
        />
        <ProgramAssignmentPanel
          organizationOptions={organizationOptions}
          programOptions={programOptions}
        />
        <CohortAssignmentPanel
          cohortOptions={cohortOptions}
          organizationOptions={organizationOptions}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Course Assignment
// ---------------------------------------------------------------------------

function CourseAssignmentPanel({
  courseOptions,
  organizationOptions,
}: {
  courseOptions: DropdownOption[];
  organizationOptions: DropdownOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    assignToCourseAction,
    initialState,
  );

  return (
    <details className="admin-assignment-panel">
      <summary className="workspace-button secondary">
        Assign learner to course
      </summary>
      <form
        action={formAction}
        className="reference-filter-panel"
        style={{ marginTop: "0.75rem" }}
      >
        <div className="diagnosis-filter-grid">
          <label>
            <span>Learner email</span>
            <input
              className="reference-search-input"
              name="email"
              placeholder="learner@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span>Organization</span>
            <select
              className="reference-select-input"
              name="organizationId"
              required
            >
              <option value="">Select organization</option>
              {organizationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Course</span>
            <select
              className="reference-select-input"
              name="courseId"
              required
            >
              <option value="">Select course</option>
              {courseOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Reason (required, at least 10 characters)</span>
            <textarea
              className="reference-search-input"
              minLength={10}
              name="reason"
              placeholder="Explain why this learner is being assigned..."
              required
              rows={2}
            />
          </label>
        </div>
        <div className="reference-filter-row compact">
          <button
            className="workspace-button"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Assigning…" : "Assign to course"}
          </button>
        </div>
        <ActionResultMessage state={state} />
      </form>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Program Assignment
// ---------------------------------------------------------------------------

function ProgramAssignmentPanel({
  organizationOptions,
  programOptions,
}: {
  organizationOptions: DropdownOption[];
  programOptions: DropdownOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    assignToProgramAction,
    initialState,
  );

  return (
    <details className="admin-assignment-panel">
      <summary className="workspace-button secondary">
        Assign learner to program
      </summary>
      <form
        action={formAction}
        className="reference-filter-panel"
        style={{ marginTop: "0.75rem" }}
      >
        <div className="diagnosis-filter-grid">
          <label>
            <span>Learner email</span>
            <input
              className="reference-search-input"
              name="email"
              placeholder="learner@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span>Organization</span>
            <select
              className="reference-select-input"
              name="organizationId"
              required
            >
              <option value="">Select organization</option>
              {organizationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Program</span>
            <select
              className="reference-select-input"
              name="programId"
              required
            >
              <option value="">Select program</option>
              {programOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Reason (required, at least 10 characters)</span>
            <textarea
              className="reference-search-input"
              minLength={10}
              name="reason"
              placeholder="Explain why this learner is being assigned..."
              required
              rows={2}
            />
          </label>
        </div>
        <div className="reference-filter-row compact">
          <button
            className="workspace-button"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Assigning…" : "Assign to program"}
          </button>
        </div>
        <ActionResultMessage state={state} />
      </form>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Cohort Assignment
// ---------------------------------------------------------------------------

function CohortAssignmentPanel({
  cohortOptions,
  organizationOptions,
}: {
  cohortOptions: DropdownOption[];
  organizationOptions: DropdownOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    assignToCohortAction,
    initialState,
  );

  return (
    <details className="admin-assignment-panel">
      <summary className="workspace-button secondary">
        Assign learner to cohort
      </summary>
      <form
        action={formAction}
        className="reference-filter-panel"
        style={{ marginTop: "0.75rem" }}
      >
        <div className="diagnosis-filter-grid">
          <label>
            <span>Learner email</span>
            <input
              className="reference-search-input"
              name="email"
              placeholder="learner@example.com"
              required
              type="email"
            />
          </label>
          <label>
            <span>Organization</span>
            <select
              className="reference-select-input"
              name="organizationId"
              required
            >
              <option value="">Select organization</option>
              {organizationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Cohort</span>
            <select
              className="reference-select-input"
              name="cohortId"
              required
            >
              <option value="">Select cohort</option>
              {cohortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Reason (required, at least 10 characters)</span>
            <textarea
              className="reference-search-input"
              minLength={10}
              name="reason"
              placeholder="Explain why this learner is being assigned..."
              required
              rows={2}
            />
          </label>
        </div>
        <div className="reference-filter-row compact">
          <button
            className="workspace-button"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Assigning…" : "Assign to cohort"}
          </button>
        </div>
        <ActionResultMessage state={state} />
      </form>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Result message
// ---------------------------------------------------------------------------

function ActionResultMessage({
  state,
}: {
  state: AdminAssignmentActionState;
}) {
  if (!state.message) return null;

  return (
    <div
      className={`reference-filter-row compact ${state.ok ? "status-success" : "status-error"}`}
      role="status"
      style={{
        padding: "0.5rem 0.75rem",
        marginTop: "0.5rem",
        borderRadius: "0.375rem",
        backgroundColor: state.ok
          ? "var(--color-success-bg, #e8f5e9)"
          : "var(--color-error-bg, #ffebee)",
        color: state.ok
          ? "var(--color-success-text, #2e7d32)"
          : "var(--color-error-text, #c62828)",
        fontSize: "0.875rem",
      }}
    >
      {state.message}
    </div>
  );
}

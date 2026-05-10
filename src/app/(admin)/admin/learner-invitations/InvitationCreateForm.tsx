"use client";

import { useActionState, useState } from "react";

import type {
  AdminLearnerInvitationCourseVersionOption,
  AdminLearnerInvitationOption,
} from "@/lib/admin/learner-invitations";

import {
  createLearnerInvitationAction,
  initialCreateLearnerInvitationActionState,
} from "./actions";

type InvitationCreateFormProps = {
  options: {
    organizations: AdminLearnerInvitationOption[];
    programs: AdminLearnerInvitationOption[];
    cohorts: AdminLearnerInvitationOption[];
    courses: AdminLearnerInvitationOption[];
    courseVersions: AdminLearnerInvitationCourseVersionOption[];
  };
};

export function InvitationCreateForm({ options }: InvitationCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createLearnerInvitationAction,
    initialCreateLearnerInvitationActionState,
  );
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    if (!state.inviteLink) {
      return;
    }

    await navigator.clipboard.writeText(state.inviteLink);
    setCopied(true);
  }

  return (
    <form action={formAction} className="admin-inline-form">
      {state.message ? (
        <p className={state.ok ? "workspace-note" : "workspace-error"}>
          {state.message}
        </p>
      ) : null}

      {state.inviteLink ? (
        <div className="admin-inline-form">
          <label>
            <span>Invitation link</span>
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
      ) : null}

      <label>
        <span>Invited email</span>
        <input
          name="email"
          placeholder="learner@example.org"
          required
          type="email"
        />
      </label>

      <label>
        <span>Organization</span>
        <select name="organizationId" required>
          <option value="">Choose organization</option>
          {options.organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Program</span>
        <select name="programId">
          <option value="">No program</option>
          {options.programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Cohort</span>
        <select name="cohortId">
          <option value="">No cohort</option>
          {options.cohorts.map((cohort) => (
            <option key={cohort.id} value={cohort.id}>
              {cohort.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Course</span>
        <select name="courseId">
          <option value="">No course</option>
          {options.courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Course version</span>
        <select name="courseVersionId">
          <option value="">Latest published version if course is selected</option>
          {options.courseVersions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Expires at</span>
        <input name="expiresAt" required type="datetime-local" />
      </label>

      <label>
        <span>Reason or note</span>
        <textarea
          name="reason"
          placeholder="Briefly explain why this learner is being invited."
          rows={3}
        />
      </label>

      <button className="workspace-link" disabled={pending} type="submit">
        {pending ? "Creating..." : "Create invitation"}
      </button>
    </form>
  );
}

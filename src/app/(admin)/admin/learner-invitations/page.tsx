import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getAdminLearnerInvitationWorkspace,
  type AdminLearnerInvitationPrisma,
  type AdminLearnerInvitationSummary,
} from "@/lib/admin/learner-invitations";
import { getAdminStatusLabel } from "@/lib/admin/role-labels";

import { InvitationCreateForm } from "./InvitationCreateForm";

export default async function AdminLearnerInvitationsPage() {
  await requireWorkspaceIdentity("/admin/learner-invitations");
  const workspace = await getAdminLearnerInvitationWorkspace(
    prisma as unknown as AdminLearnerInvitationPrisma,
  );

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Learner Invitations">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Invitation access</h2>
            <p>
              Create a single learner invitation and review safe invitation
              status. Email delivery, bulk invites, resend, cancel, and revoke
              workflows are not enabled in this slice.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="create-title">
          <div className="admin-section-heading">
            <h2 id="create-title">Create invitation</h2>
            <p>
              Copy the generated link immediately after creation. The raw link is
              never stored and will not be shown again after refresh.
            </p>
          </div>
          <InvitationCreateForm options={workspace.options} />
        </section>

        <section className="admin-section" aria-labelledby="list-title">
          <div className="admin-section-heading">
            <h2 id="list-title">Invitation list</h2>
            <p>
              Read-only status view. Token hashes and raw invitation links are
              not shown.
            </p>
          </div>

          {workspace.invitations.length > 0 ? (
            <div className="admin-user-list">
              {workspace.invitations.map((invitation) => (
                <InvitationCard
                  invitation={invitation}
                  key={invitation.id}
                />
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                No invitations
              </span>
              <h2>No learner invitations found</h2>
              <p>Create one invitation to start the member learner access flow.</p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function InvitationCard({
  invitation,
}: {
  invitation: AdminLearnerInvitationSummary;
}) {
  return (
    <article className="admin-user-card">
      <div className="reference-card-heading">
        <div>
          <h3>{invitation.email}</h3>
          <p className="admin-record-code">{invitation.organizationName}</p>
        </div>
        <span className={`status-badge ${getStatusTone(invitation.status)}`}>
          {getAdminStatusLabel(invitation.status)}
        </span>
      </div>

      <dl className="reference-meta-list">
        <div>
          <dt>Program</dt>
          <dd>{invitation.programName ?? "Not linked"}</dd>
        </div>
        <div>
          <dt>Cohort</dt>
          <dd>{invitation.cohortName ?? "Not linked"}</dd>
        </div>
        <div>
          <dt>Course</dt>
          <dd>{invitation.courseTitle ?? "Not linked"}</dd>
        </div>
        <div>
          <dt>Course version</dt>
          <dd>{invitation.courseVersionLabel ?? "Not linked"}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(invitation.createdAt)}</dd>
        </div>
        <div>
          <dt>Expires</dt>
          <dd>{formatDate(invitation.expiresAt)}</dd>
        </div>
        <div>
          <dt>Accepted</dt>
          <dd>{formatDate(invitation.acceptedAt)}</dd>
        </div>
        <div>
          <dt>Invited by</dt>
          <dd>
            {invitation.invitedByName}
            {invitation.invitedByEmail
              ? ` (${invitation.invitedByEmail})`
              : ""}
          </dd>
        </div>
      </dl>
    </article>
  );
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getStatusTone(status: string) {
  if (status === "ACCEPTED") {
    return "status-badge-ready";
  }

  if (status === "EXPIRED" || status === "CANCELLED" || status === "REVOKED") {
    return "status-badge-blocked";
  }

  return "status-badge-published";
}

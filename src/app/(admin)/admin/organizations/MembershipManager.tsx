"use client";

import { useState } from "react";
import { MembershipStatus, UserRole } from "@prisma/client";
import { getAdminRoleLabel } from "@/lib/admin/role-labels";
import { addOrganizationMemberAction, updateOrganizationMembershipAction, inviteOrganizationMemberAction } from "./actions";

type Member = {
  id: string;
  membershipId: string;
  name: string;
  email: string;
  roles: string[];
  status: string;
  isHomeOrg: boolean;
};

export function MembershipManager({
  canManageAdminAuthority,
  organizationId,
  members,
}: {
  canManageAdminAuthority: boolean;
  organizationId: string;
  members: Member[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addMode, setAddMode] = useState<"existing" | "new">("existing");
  const assignableRoles = canManageAdminAuthority
    ? Object.values(UserRole)
    : Object.values(UserRole).filter((role) => role !== UserRole.ADMIN);

  return (
    <div className="admin-membership-manager">
      <div className="admin-section-heading" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 id="org-members-title">Organization members</h2>
          <p>Users associated with this organization and their platform roles.</p>
        </div>
        {!isAdding && (
          <button 
            className="workspace-link" 
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
            }}
          >
            Add Member
          </button>
        )}
      </div>

      {isAdding && (
        <section className="admin-user-card" style={{ marginBottom: "2rem", border: "2px solid var(--primary-accent)" }}>
          <div className="admin-section-heading">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Add or Invite Member</h3>
            <p>Add an existing user or invite a new learner or operational user to this organization.</p>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button 
              className={`workspace-link ${addMode === "existing" ? "" : "secondary"}`}
              onClick={() => setAddMode("existing")}
            >
              Add Existing
            </button>
            <button 
              className={`workspace-link ${addMode === "new" ? "" : "secondary"}`}
              onClick={() => setAddMode("new")}
            >
              Invite New User
            </button>
          </div>

          {addMode === "existing" ? (
            <form action={addOrganizationMemberAction.bind(null, organizationId)} className="admin-inline-form">
              <label>
                <span>User Email</span>
                <input name="email" type="email" placeholder="user@example.com" required />
              </label>
              <label>
                <span>Reason for adding</span>
                <textarea 
                  name="reason" 
                  placeholder="Why is this user being added to this organization?" 
                  required 
                  rows={2} 
                />
              </label>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="workspace-link" type="submit">Add Member</button>
                <button 
                  className="workspace-link secondary" 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form action={inviteOrganizationMemberAction.bind(null, organizationId)} className="admin-inline-form">
              <label>
                <span>User Name</span>
                <input name="name" type="text" placeholder="Full Name" required />
              </label>
              <label>
                <span>User Email</span>
                <input name="email" type="email" placeholder="user@example.com" required />
              </label>
              <fieldset style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <legend style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Initial Roles</legend>
                <div className="reference-visibility-grid">
                  {assignableRoles.map((role) => (
                    <label className="checkbox-row" key={role}>
                      <input
                        defaultChecked={role === "LEARNER"}
                        name="roles"
                        type="checkbox"
                        value={role}
                      />
                      <span>{getAdminRoleLabel(role)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {!canManageAdminAuthority ? (
                <p className="workspace-note">
                  Platform Admin authority is controlled by Super Admin-equivalent users.
                </p>
              ) : null}
              <label>
                <span>Reason for inviting</span>
                <textarea 
                  name="reason" 
                  placeholder="Why is this user being invited to this organization?" 
                  required 
                  rows={2} 
                />
              </label>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="workspace-link" type="submit">Invite User</button>
                <button 
                  className="workspace-link secondary" 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {members.length > 0 ? (
        <div className="admin-user-list">
          {members.map((member) => (
            <div key={member.membershipId}>
              {editingId === member.membershipId ? (
                <article className="admin-user-card" style={{ border: "2px solid var(--primary-accent)" }}>
                  <div className="admin-section-heading">
                    <h3>Edit {member.name}</h3>
                    <p>{member.email}</p>
                  </div>
                  <form 
                    action={updateOrganizationMembershipAction.bind(null, organizationId, member.membershipId)} 
                    className="admin-inline-form"
                  >
                    <fieldset>
                      <legend>Assigned roles</legend>
                      <div className="reference-visibility-grid">
                        {assignableRoles.map((role) => (
                          <label className="checkbox-row" key={role}>
                            <input
                              defaultChecked={member.roles.includes(role)}
                              name="roles"
                              type="checkbox"
                              value={role}
                            />
                            <span>{getAdminRoleLabel(role)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {!canManageAdminAuthority && member.roles.includes(UserRole.ADMIN) ? (
                      <p className="workspace-note">
                        Platform Admin authority is controlled by Super Admin-equivalent users.
                      </p>
                    ) : null}

                    <label>
                      <span>Membership Status</span>
                      <select name="status" defaultValue={member.status}>
                        <option value={MembershipStatus.ACTIVE}>Active</option>
                        <option value={MembershipStatus.DISABLED}>Disabled</option>
                      </select>
                    </label>

                    <label>
                      <span>Reason for change</span>
                      <textarea 
                        name="reason" 
                        placeholder="Explain why roles or status are changing." 
                        required 
                        rows={2} 
                      />
                    </label>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                      <button className="workspace-link" type="submit">Save Changes</button>
                      <button 
                        className="workspace-link secondary" 
                        type="button" 
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </article>
              ) : (
                <article className={`admin-user-card ${member.status === 'DISABLED' ? 'disabled-member' : ''}`}>
                  <div className="reference-card-heading">
                    <div>
                      <h3 style={{ textDecoration: member.status === 'DISABLED' ? 'line-through' : 'none' }}>
                        {member.name}
                      </h3>
                      <p>{member.email}</p>
                    </div>
                    <div className="reference-badge-row">
                      {member.status === 'DISABLED' && (
                        <span className="status-badge status-badge-blocked">Disabled</span>
                      )}
                      {member.isHomeOrg ? (
                        <span className="status-badge status-badge-published">Home Org</span>
                      ) : (
                        <span className="status-badge status-badge-ready">Member</span>
                      )}
                      {canManageAdminAuthority || !member.roles.includes(UserRole.ADMIN) ? (
                        <button
                          className="admin-link-small"
                          onClick={() => {
                            setEditingId(member.membershipId);
                            setIsAdding(false);
                          }}
                          style={{ border: "none", background: "none", cursor: "pointer", padding: 0, marginLeft: "0.5rem" }}
                        >
                          Manage
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <dl className="reference-meta-list">
                    <div>
                      <dt>Roles</dt>
                      <dd>
                        {member.roles.length > 0
                          ? member.roles.map(getAdminRoleLabel).join(", ")
                          : "None"}
                      </dd>
                    </div>
                  </dl>
                  {!canManageAdminAuthority && member.roles.includes(UserRole.ADMIN) ? (
                    <p className="workspace-note">
                      Platform Admin authority is controlled by Super Admin-equivalent users.
                    </p>
                  ) : null}
                </article>
              )}
            </div>
          ))}
        </div>
      ) : (
        <section className="admin-empty-panel">
          <span className="status-badge status-badge-blocked">No members</span>
          <h2>No members found</h2>
          <p>No users are currently associated with this organization.</p>
        </section>
      )}
    </div>
  );
}

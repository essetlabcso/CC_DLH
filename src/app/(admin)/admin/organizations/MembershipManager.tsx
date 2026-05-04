"use client";

import { useState } from "react";
import { MembershipStatus, UserRole } from "@prisma/client";
import { addOrganizationMemberAction, updateOrganizationMembershipAction } from "./actions";

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
  organizationId,
  members,
}: {
  organizationId: string;
  members: Member[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Add existing user</h3>
            <p>Associate a registered user with this organization.</p>
          </div>
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
                        {Object.values(UserRole).map((role) => (
                          <label className="checkbox-row" key={role}>
                            <input
                              defaultChecked={member.roles.includes(role)}
                              name="roles"
                              type="checkbox"
                              value={role}
                            />
                            <span>{role === "LEARNER" ? "Participant" : formatLabel(role)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

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
                    </div>
                  </div>
                  <dl className="reference-meta-list">
                    <div>
                      <dt>Roles</dt>
                      <dd>
                        {member.roles.length > 0
                          ? member.roles.map(formatLabel).join(", ")
                          : "None"}
                      </dd>
                    </div>
                  </dl>
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

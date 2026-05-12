import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getProofVerifierAssignmentsOverview } from "@/lib/admin/proof-verifier-assignments";
import { isSuperAdminEquivalentForPhase1 } from "@/lib/admin/admin-authority";
import { requirePermissionIdentity } from "@/lib/auth/server";
import { GrantProofVerifierPanel, ProofVerifierStatusControl } from "./ProofAssignmentControls";

export default async function ProofVerifierAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ prefillType?: string; prefillValue?: string }>;
}) {
  const identity = await requirePermissionIdentity("/admin/proof-badges/assignments");
  const isSuperAdmin = isSuperAdminEquivalentForPhase1(identity.session.role);
  const overview = await getProofVerifierAssignmentsOverview();
  const resolvedParams = await searchParams;

  return (
    <WorkspaceShell eyebrow="Admin Controls" title="Proof Verifier Workspace">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Practical Proof Verifier Management</h2>
            <p>
              Assign users the right to view and verify private evidence. 
              Controls apply according to scoped data-governance workflows.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link className="workspace-link secondary" href="/admin/proof-badges">
              Back to Proof Dashboard
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="unassigned-title">
          <div className="admin-section-heading">
            <h2 id="unassigned-title">Recent unassigned proofs</h2>
            <p>Evidence submissions that have no active explicit verifier assignment.</p>
          </div>
          
          {overview.recentProofsWithoutAssignment.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Course</th>
                    <th>Submitted</th>
                    <th style={{ width: "100px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentProofsWithoutAssignment.map((proof) => (
                    <tr key={proof.id}>
                      <td><strong>{proof.learnerName}</strong></td>
                      <td>{proof.courseTitle}</td>
                      <td>{formatDate(proof.submittedAt)}</td>
                      <td>
                        <Link 
                          href={`/admin/proof-badges/assignments?prefillType=PRACTICAL_PROOF_SUBMISSION&prefillValue=${proof.id}`}
                          className="workspace-link"
                          style={{ fontSize: "0.875rem" }}
                        >
                          Assign
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-panel" style={{ padding: "1.5rem" }}>
              <span className="status-badge status-badge-ready">Queue cleared</span>
              <p style={{ marginTop: "0.5rem" }}>All recent submissions are accounted for.</p>
            </div>
          )}
        </section>

        <section className="admin-section" aria-labelledby="active-assignments-title">
          <div className="admin-section-heading">
            <h2 id="active-assignments-title">Verifier assignments</h2>
            <p>Active and recent security scope allocations.</p>
          </div>

          {isSuperAdmin && (
            <GrantProofVerifierPanel 
              prefillType={resolvedParams.prefillType}
              prefillValue={resolvedParams.prefillValue}
            />
          )}

          {overview.recentAssignments.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Verifier</th>
                    <th>Scope</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    {isSuperAdmin && <th style={{ width: "120px" }}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {overview.recentAssignments.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.userName}</strong>
                        <small style={{ display: "block", opacity: 0.7 }}>{item.userEmail}</small>
                      </td>
                      <td>
                        <span>{item.scopeLabel}</span>
                        <small style={{ display: "block", opacity: 0.7 }}>{item.scopeType}</small>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.875rem" }}>{item.reason}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${item.status === "ACTIVE" ? "status-badge-ready" : "status-badge-blocked"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <small style={{ display: "block" }}>{formatDate(item.createdAt)}</small>
                        <small style={{ display: "block", opacity: 0.7 }}>by {item.createdByLabel}</small>
                      </td>
                      {isSuperAdmin && (
                        <td>
                          <ProofVerifierStatusControl 
                            assignmentId={item.id} 
                            currentStatus={item.status} 
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-panel">
              <span className="status-badge status-badge-ready">No assignments</span>
              <p style={{ marginTop: "0.5rem" }}>No proof verifier allocations found.</p>
            </div>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}

function formatDate(value: Date | null) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

import Link from "next/link";
import { PermissionScopeType } from "@prisma/client";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getCourseReviewerAssignmentsOverview } from "@/lib/admin/course-reviewer-assignments";
import { isSuperAdminEquivalentForPhase1 } from "@/lib/admin/admin-authority";
import { requirePermissionIdentity } from "@/lib/auth/server";
import {
  GrantReviewerPanel,
  ReviewerStatusControl,
} from "./ReviewerAssignmentControls";

export default async function CourseReviewerAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ prefillType?: string; prefillValue?: string }>;
}) {
  const identity = await requirePermissionIdentity(
    "/admin/courses/assignments",
  );
  const isSuperAdmin = isSuperAdminEquivalentForPhase1(identity.session.role);
  const overview = await getCourseReviewerAssignmentsOverview();
  const resolvedParams = await searchParams;

  return (
    <WorkspaceShell eyebrow="Admin Controls" title="Reviewer Workspace">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Course Reviewer Management</h2>
            <p>
              Assign users formal review authority for content submissions.
              Controls apply according to scoped content-governance workflows.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              className="workspace-link secondary"
              href="/admin/courses"
            >
              Back to Course Dashboard
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="unassigned-title">
          <div className="admin-section-heading">
            <h2 id="unassigned-title">Recent unassigned submitted courses</h2>
            <p>
              Course versions in SUBMITTED status that have no direct explicit reviewer assignment.
            </p>
          </div>

          {overview.recentVersionsWithoutAssignment.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course Title</th>
                    <th>Version</th>
                    <th>Author</th>
                    <th>Submitted</th>
                    <th style={{ width: "100px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentVersionsWithoutAssignment.map((version) => (
                    <tr key={version.id}>
                      <td>
                        <strong>{version.courseTitle}</strong>
                      </td>
                      <td>v{version.versionNumber}</td>
                      <td>{version.creatorName}</td>
                      <td>{formatDate(version.submittedAt)}</td>
                      <td>
                        <Link
                          href={`/admin/courses/assignments?prefillType=${PermissionScopeType.COURSE_VERSION}&prefillValue=${version.id}`}
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
              <span className="status-badge status-badge-ready">
                Queue cleared
              </span>
              <p style={{ marginTop: "0.5rem" }}>
                All recent submissions are accounted for.
              </p>
            </div>
          )}
        </section>

        <section
          className="admin-section"
          aria-labelledby="active-assignments-title"
        >
          <div className="admin-section-heading">
            <h2 id="active-assignments-title">Reviewer assignments</h2>
            <p>Active and recent security scope allocations.</p>
          </div>

          {isSuperAdmin && (
            <GrantReviewerPanel
              prefillType={resolvedParams.prefillType}
              prefillValue={resolvedParams.prefillValue}
            />
          )}

          {overview.recentAssignments.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
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
                        <small style={{ display: "block", opacity: 0.7 }}>
                          {item.userEmail}
                        </small>
                      </td>
                      <td>
                        <span>{item.scopeLabel}</span>
                        <small style={{ display: "block", opacity: 0.7 }}>
                          {item.scopeType}
                        </small>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.875rem" }}>
                          {item.reason}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${item.status === "ACTIVE" ? "status-badge-ready" : "status-badge-blocked"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <small style={{ display: "block" }}>
                          {formatDate(item.createdAt)}
                        </small>
                        <small style={{ display: "block", opacity: 0.7 }}>
                          by {item.createdByLabel}
                        </small>
                      </td>
                      {isSuperAdmin && (
                        <td>
                          <ReviewerStatusControl
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
              <span className="status-badge status-badge-ready">
                No assignments
              </span>
              <p style={{ marginTop: "0.5rem" }}>
                No course reviewer allocations found.
              </p>
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

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminFieldMetadataSummaries } from "@/lib/admin/dashboard";
import Link from "next/link";

export default async function AdminFieldMetadataPage() {
  const summaries = await getAdminFieldMetadataSummaries();
  const totalFields = summaries.reduce(
    (total, summary) => total + summary.fieldCount,
    0,
  );

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Workflow Field Metadata">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Workflow field registry</h2>
            <p>
              Review the registered fields that define what the platform will
              track across setup, diagnosis, design, build, review, publishing,
              and monitoring.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="metadata-summary-title">
          <div className="admin-section-heading">
            <h2 id="metadata-summary-title">Metadata summary</h2>
            <p>{totalFields} workflow field records are available.</p>
          </div>
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Workflow area</th>
                  <th>Fields</th>
                  <th>Sections</th>
                  <th>Dashboard signals</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((summary) => (
                  <tr key={summary.workflowPhase}>
                    <td>{formatLabel(summary.workflowPhase)}</td>
                    <td>{summary.fieldCount}</td>
                    <td>{summary.sectionCount}</td>
                    <td>{summary.dashboardFieldCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

function formatLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

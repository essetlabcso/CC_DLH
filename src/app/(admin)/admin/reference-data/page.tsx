import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminReferenceCategorySummaries } from "@/lib/admin/dashboard";
import Link from "next/link";

export default async function AdminReferenceDataPage() {
  const categories = await getAdminReferenceCategorySummaries();
  const valueCount = categories.reduce(
    (total, category) => total + category.valueCount,
    0,
  );

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Reference Data">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Controlled values overview</h2>
            <p>
              Review the lookup categories and values that will support governed
              setup, diagnosis, review, publishing, proof, and monitoring work.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="reference-summary-title">
          <div className="admin-section-heading">
            <h2 id="reference-summary-title">Reference summary</h2>
            <p>
              {categories.length} categories and {valueCount} values are
              available for future Admin-managed workflows.
            </p>
          </div>
          <div className="admin-table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Workflow area</th>
                  <th>Values</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.categoryKey}>
                    <td>{category.categoryName}</td>
                    <td>{formatLabel(category.workflowPhase)}</td>
                    <td>{category.valueCount}</td>
                    <td>
                      <span className="status-badge status-badge-ready">
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
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

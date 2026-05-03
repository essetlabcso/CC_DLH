import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDashboardCounts } from "@/lib/admin/dashboard";
import Link from "next/link";

export default async function AdminAuditLogPage() {
  const counts = await getAdminDashboardCounts();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Audit Log">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Governance activity record</h2>
            <p>
              Future Admin changes to reference data, diagnosis records, and
              platform settings will be traceable here.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-empty-panel">
          <span className="status-badge status-badge-published">
            {counts.auditLogs} records
          </span>
          <h2>No Admin activity has been recorded yet</h2>
          <p>
            This read-only view is ready for future governance events once Admin
            editing workflows are introduced.
          </p>
        </section>
      </div>
    </WorkspaceShell>
  );
}

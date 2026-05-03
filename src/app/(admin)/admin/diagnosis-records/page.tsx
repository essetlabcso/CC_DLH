import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDashboardCounts } from "@/lib/admin/dashboard";
import Link from "next/link";

export default async function AdminDiagnosisRecordsPage() {
  const counts = await getAdminDashboardCounts();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Diagnosis Records">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Approved diagnosis records</h2>
            <p>
              Diagnosis records will carry approved capacity gaps, K/S/M/E
              routes, course-fit decisions, safety notes, and monitoring anchors.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-empty-panel">
          <span className="status-badge status-badge-blocked">
            {counts.diagnosisRecords} configured
          </span>
          <h2>No diagnosis records are configured yet</h2>
          <p>
            Admins will approve records here before course creators start from a
            governed diagnosis context.
          </p>
        </section>
      </div>
    </WorkspaceShell>
  );
}

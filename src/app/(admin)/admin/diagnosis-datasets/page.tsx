import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDashboardCounts } from "@/lib/admin/dashboard";
import Link from "next/link";

export default async function AdminDiagnosisDatasetsPage() {
  const counts = await getAdminDashboardCounts();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Diagnosis Datasets">
      <div className="admin-dashboard">
        <section className="admin-hero">
          <div>
            <h2>Approved diagnosis source datasets</h2>
            <p>
              Diagnosis datasets will become the controlled source material for
              future course setup and analysis work.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin">
            Back to Admin
          </Link>
        </section>

        <section className="admin-empty-panel">
          <span className="status-badge status-badge-blocked">
            {counts.diagnosisDatasets} configured
          </span>
          <h2>No diagnosis datasets are configured yet</h2>
          <p>
            Admins will add approved datasets here before Course Setup is
            connected to diagnosis selection.
          </p>
        </section>
      </div>
    </WorkspaceShell>
  );
}

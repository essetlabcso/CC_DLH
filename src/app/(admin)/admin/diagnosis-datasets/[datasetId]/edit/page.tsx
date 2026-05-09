import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { updateDiagnosisDatasetDraftAction } from "@/app/(admin)/admin/diagnosis-datasets/actions";
import { DatasetDraftForm } from "@/app/(admin)/admin/diagnosis-datasets/DatasetDraftForm";
import { getAdminDiagnosisDatasetDetail } from "@/lib/admin/diagnosis";
import Link from "next/link";
import { notFound } from "next/navigation";

type EditDiagnosisDatasetPageProps = {
  params?: Promise<{
    datasetId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditDiagnosisDatasetPage({
  params,
  searchParams,
}: EditDiagnosisDatasetPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const datasetId = resolvedParams?.datasetId;

  if (!datasetId) {
    notFound();
  }

  const dataset = await getAdminDiagnosisDatasetDetail(datasetId);

  if (!dataset) {
    notFound();
  }

  const action = updateDiagnosisDatasetDraftAction.bind(null, dataset.id);

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Edit Evidence Source Package">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">{dataset.datasetCode}</p>
            <h2>{dataset.datasetTitle}</h2>
            <p>
              Update draft evidence package metadata before diagnosis records
              are approved and released for future course creation.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${dataset.id}`}
            >
              Back to evidence package
            </Link>
            <Link className="workspace-link secondary" href="/admin/diagnosis-datasets">
              All evidence packages
            </Link>
          </div>
        </section>

        {dataset.canEdit ? (
          <section className="admin-section" aria-labelledby="dataset-form-title">
            <div className="admin-section-heading">
              <h2 id="dataset-form-title">Draft evidence package details</h2>
              <p>
                A reason is required so the Admin audit trail explains this
                draft update.
              </p>
            </div>
            <DatasetDraftForm
              action={action}
              canEditDatasetCode={dataset.canEditDatasetCode}
              dataset={dataset}
              error={resolvedSearchParams?.error}
              mode="edit"
            />
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-blocked">Read only</span>
            <h2>This evidence source package cannot be edited here</h2>
            <p>
              Only draft evidence source packages that are not archived and not
              selected by Course Setup can be edited. Approved, archived, and
              used packages remain protected for traceability.
            </p>
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${dataset.id}`}
            >
              Return to read-only detail
            </Link>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

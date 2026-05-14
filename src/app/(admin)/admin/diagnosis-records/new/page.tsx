import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { createDiagnosisRecordDraftAction } from "@/app/(admin)/admin/diagnosis-records/actions";
import { DiagnosisRecordDraftForm } from "@/app/(admin)/admin/diagnosis-records/DiagnosisRecordDraftForm";
import {
  getAdminDiagnosisDatasetDetail,
  getAdminDiagnosisRecordDraftFormOptions,
} from "@/lib/admin/diagnosis";
import Link from "next/link";
import { notFound } from "next/navigation";

type NewDiagnosisRecordPageProps = {
  searchParams?: Promise<{
    datasetId?: string;
    error?: string;
  }>;
};

export default async function NewDiagnosisRecordPage({
  searchParams,
}: NewDiagnosisRecordPageProps) {
  const resolvedSearchParams = await searchParams;
  const datasetId = resolvedSearchParams?.datasetId;

  if (!datasetId) {
    return (
      <WorkspaceShell eyebrow="Admin Control Center" title="New Diagnosis Record">
        <div className="admin-dashboard diagnosis-browser">
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-blocked">
              Evidence package needed
            </span>
            <h2>Start from a draft evidence source package</h2>
            <p>
              Draft diagnosis records must be created under a draft evidence
              source package so the evidence remains traceable.
            </p>
            <Link className="workspace-link secondary" href="/admin/diagnosis-datasets">
              Open evidence packages
            </Link>
          </section>
        </div>
      </WorkspaceShell>
    );
  }

  const [dataset, options] = await Promise.all([
    getAdminDiagnosisDatasetDetail(datasetId),
    getAdminDiagnosisRecordDraftFormOptions(),
  ]);

  if (!dataset) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="New Diagnosis Record">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">{dataset.datasetCode}</p>
            <h2>Create a draft diagnosis record</h2>
            <p>
              Add one controlled draft diagnosis record under this evidence
              source package. Draft records are not selectable in Course Setup
              until approval and release to Course Creators are complete.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${dataset.id}`}
            >
              Back to dataset
            </Link>
            <Link className="workspace-link secondary" href="/admin/diagnosis-records">
              All records
            </Link>
          </div>
        </section>

        {dataset.canEdit ? (
          <section className="admin-section" aria-labelledby="record-form-title">
            <div className="admin-section-heading">
              <h2 id="record-form-title">Draft diagnosis record details</h2>
              <p>
                Use safe summary wording only. Do not include raw interview,
                safeguarding, political, or personal data.
              </p>
            </div>
            <DiagnosisRecordDraftForm
              action={createDiagnosisRecordDraftAction}
              dataset={dataset}
              error={resolvedSearchParams?.error}
              mode="create"
              options={options}
            />
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-blocked">Read only</span>
            <h2>This dataset cannot receive draft records here</h2>
            <p>
              Diagnosis records can only be created under draft datasets that are
              not archived. Approved, archived, and used datasets remain
              protected for traceability.
            </p>
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${dataset.id}`}
            >
              Return to dataset
            </Link>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

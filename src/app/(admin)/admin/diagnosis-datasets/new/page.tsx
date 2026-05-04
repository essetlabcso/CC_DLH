import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { createDiagnosisDatasetDraftAction } from "@/app/(admin)/admin/diagnosis-datasets/actions";
import { DatasetDraftForm } from "@/app/(admin)/admin/diagnosis-datasets/DatasetDraftForm";
import Link from "next/link";

type NewDiagnosisDatasetPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewDiagnosisDatasetPage({
  searchParams,
}: NewDiagnosisDatasetPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="New Diagnosis Dataset">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <h2>Create a draft diagnosis dataset</h2>
            <p>
              Start a controlled source dataset for future approved diagnosis
              records. Draft datasets stay hidden from Course Setup until later
              approval and locking workflows are enabled.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin/diagnosis-datasets">
            Back to datasets
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="draft-rules-title">
          <div className="admin-section-heading">
            <h2 id="draft-rules-title">Draft rules</h2>
            <p>
              This step creates draft source metadata only. It does not approve,
              publish, import, or expose diagnosis records to course creators.
            </p>
          </div>
          <div className="reference-badge-row">
            <span className="status-badge status-badge-published">
              Draft only
            </span>
            <span className="status-badge status-badge-published">
              Admin controlled
            </span>
            <span className="status-badge status-badge-blocked">
              Not selectable in Course Setup
            </span>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="dataset-form-title">
          <div className="admin-section-heading">
            <h2 id="dataset-form-title">Dataset details</h2>
            <p>
              Use safe summary wording only. Do not include raw interview,
              safeguarding, political, or personal data.
            </p>
          </div>
          <DatasetDraftForm
            action={createDiagnosisDatasetDraftAction}
            error={resolvedSearchParams?.error}
            mode="create"
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}

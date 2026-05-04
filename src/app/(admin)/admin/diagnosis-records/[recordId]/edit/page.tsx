import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { updateDiagnosisRecordDraftAction } from "@/app/(admin)/admin/diagnosis-records/actions";
import { DiagnosisRecordDraftForm } from "@/app/(admin)/admin/diagnosis-records/DiagnosisRecordDraftForm";
import {
  getAdminDiagnosisRecordDetail,
  getAdminDiagnosisRecordDraftFormOptions,
} from "@/lib/admin/diagnosis";
import Link from "next/link";
import { notFound } from "next/navigation";

type EditDiagnosisRecordPageProps = {
  params?: Promise<{
    recordId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditDiagnosisRecordPage({
  params,
  searchParams,
}: EditDiagnosisRecordPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const recordId = resolvedParams?.recordId;

  if (!recordId) {
    notFound();
  }

  const [record, options] = await Promise.all([
    getAdminDiagnosisRecordDetail(recordId),
    getAdminDiagnosisRecordDraftFormOptions(),
  ]);

  if (!record) {
    notFound();
  }

  const action = updateDiagnosisRecordDraftAction.bind(null, record.id);

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Edit Diagnosis Record">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">
              {record.diagnosisCode} · {record.datasetCode}
            </p>
            <h2>{record.diagnosisTitle}</h2>
            <p>
              Update this draft diagnosis record before it is approved, locked,
              or selected by Course Setup.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-records/${record.id}`}
            >
              Back to record
            </Link>
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${record.datasetId}`}
            >
              Open dataset
            </Link>
          </div>
        </section>

        {record.canEdit ? (
          <section className="admin-section" aria-labelledby="record-form-title">
            <div className="admin-section-heading">
              <h2 id="record-form-title">Draft record details</h2>
              <p>
                A reason is required so the Admin audit trail explains this
                draft update.
              </p>
            </div>
            <DiagnosisRecordDraftForm
              action={action}
              dataset={{
                datasetCode: record.datasetCode,
                datasetTitle: record.datasetTitle,
                id: record.datasetId,
              }}
              error={resolvedSearchParams?.error}
              mode="edit"
              options={options}
              record={record}
            />
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-blocked">Read only</span>
            <h2>This diagnosis record cannot be edited here</h2>
            <p>
              Only draft, unlocked, active records under draft datasets can be
              edited before Course Setup uses them. Approved, locked, archived,
              inactive, and used records remain protected for traceability.
            </p>
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-records/${record.id}`}
            >
              Return to read-only detail
            </Link>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

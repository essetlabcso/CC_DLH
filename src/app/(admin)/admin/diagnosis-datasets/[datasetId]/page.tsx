import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  approveDiagnosisDatasetAction,
  archiveDiagnosisDatasetAction,
} from "@/app/(admin)/admin/diagnosis-datasets/actions";
import { getAdminDiagnosisDatasetDetail } from "@/lib/admin/diagnosis";
import Link from "next/link";
import { notFound } from "next/navigation";

type AdminDiagnosisDatasetDetailPageProps = {
  params?: Promise<{
    datasetId?: string;
  }>;
  searchParams?: Promise<{
    approved?: string;
    archived?: string;
    created?: string;
    error?: string;
    updated?: string;
  }>;
};

export default async function AdminDiagnosisDatasetDetailPage({
  params,
  searchParams,
}: AdminDiagnosisDatasetDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const datasetId = resolvedParams?.datasetId;

  if (!datasetId) {
    notFound();
  }

  const dataset = await getAdminDiagnosisDatasetDetail(datasetId);

  if (!dataset) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Diagnosis Dataset">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">{dataset.datasetCode}</p>
            <h2>{dataset.datasetTitle}</h2>
            <p>
              Governed view of this diagnosis source dataset, its coverage,
              approval state, linked diagnosis records, and Course Setup usage.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin/diagnosis-datasets">
              Back to datasets
            </Link>
            {dataset.canEdit ? (
              <Link
                className="workspace-link"
                href={`/admin/diagnosis-datasets/${dataset.id}/edit`}
              >
                Edit draft
              </Link>
            ) : null}
            {dataset.canEdit ? (
              <Link
                className="workspace-link"
                href={`/admin/diagnosis-records/new?datasetId=${dataset.id}`}
              >
                New draft record
              </Link>
            ) : null}
            <Link className="workspace-link secondary" href="/admin/diagnosis-records">
              Diagnosis records
            </Link>
          </div>
        </section>

        <StatusMessage searchParams={resolvedSearchParams} />

        <section className="admin-section" aria-labelledby="dataset-status-title">
          <div className="admin-section-heading">
            <h2 id="dataset-status-title">Dataset status</h2>
            <p>Governance and use signals for this diagnosis dataset.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Diagnosis records linked to this dataset"
              label="Records"
              value={dataset.recordCount}
            />
            <MetricCard
              detail="Approved records"
              label="Approved"
              value={dataset.totals.approvedRecords}
            />
            <MetricCard
              detail="Locked records"
              label="Locked"
              value={dataset.totals.lockedRecords}
            />
            <MetricCard
              detail="Active records"
              label="Active"
              value={dataset.totals.activeRecords}
            />
            <MetricCard
              detail="Courses selecting this dataset"
              label="Course usage"
              value={dataset.totals.selectedCourseSetups}
            />
          </div>
          <div className="reference-badge-row">
            <StatusBadge label={formatStatus(dataset.approvalStatus)} />
            <span
              className={`status-badge ${
                dataset.archivedAt ? "status-badge-blocked" : "status-badge-ready"
              }`}
            >
              {dataset.archivedAt ? "Archived" : "Active"}
            </span>
            {dataset.canEdit ? (
              <span className="status-badge status-badge-ready">
                Draft edit available
              </span>
            ) : (
              <span className="status-badge status-badge-published">
                Read only
              </span>
            )}
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="dataset-governance-title"
        >
          <div className="admin-section-heading">
            <h2 id="dataset-governance-title">Dataset governance actions</h2>
            <p>
              Approve datasets for diagnosis record locking, or archive datasets
              that should no longer support new Course Setup selection.
            </p>
          </div>
          <div className="diagnosis-preview-grid">
            <GovernanceActionCard
              action={approveDiagnosisDatasetAction.bind(null, dataset.id)}
              buttonLabel="Approve dataset"
              disabledHelp={
                isApproved(dataset.approvalStatus)
                  ? "This dataset is already approved."
                  : "Archived datasets cannot be approved."
              }
              enabled={dataset.canApprove}
              fieldName="approvalReason"
              helpText="Approval confirms that this dataset can support approved diagnosis records."
              label="Approval reason"
              title="Approve dataset"
            />
            <GovernanceActionCard
              action={archiveDiagnosisDatasetAction.bind(null, dataset.id)}
              buttonLabel="Archive dataset"
              disabledHelp={
                dataset.selectedCourseSetupCount > 0
                  ? "This dataset is selected by Course Setup and cannot be archived in this phase."
                  : "This dataset is already archived."
              }
              enabled={dataset.canArchive}
              fieldName="archiveReason"
              helpText="Archiving keeps the dataset for traceability but removes it from future course-selection use."
              label="Archive reason"
              title="Archive dataset"
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="dataset-context-title">
          <div className="admin-section-heading">
            <h2 id="dataset-context-title">Dataset context</h2>
            <p>Approved source information for Admin review and traceability.</p>
          </div>
          <dl className="reference-meta-list">
            <MetaItem
              label="Program / project"
              value={dataset.programOrProject || "Not specified"}
            />
            <MetaItem label="Assessment purpose" value={dataset.assessmentPurpose} />
            <MetaItem label="Assessment period" value={dataset.assessmentPeriod} />
            <MetaItem
              label="Regions covered"
              value={joinList(dataset.regionsCovered)}
            />
            <MetaItem
              label="Organization group"
              value={dataset.organizationGroup || "Not specified"}
            />
            <MetaItem
              label="Data collection methods"
              value={joinList(dataset.dataCollectionMethods)}
            />
            <MetaItem
              label="Visibility"
              value={formatStatus(dataset.visibilityScope)}
            />
            <MetaItem
              label="Approved by"
              value={dataset.approvedByName ?? "Not approved"}
            />
            <MetaItem label="Approved date" value={formatDate(dataset.approvedAt)} />
            <MetaItem
              label="Created by"
              value={dataset.createdByName ?? "Not recorded"}
            />
            <MetaItem label="Created" value={formatDate(dataset.createdAt)} />
            <MetaItem
              label="Updated by"
              value={dataset.updatedByName ?? "Not recorded"}
            />
            <MetaItem label="Last updated" value={formatDate(dataset.updatedAt)} />
          </dl>
          <TextPanel label="Notes" value={dataset.notes} />
        </section>

        <section className="admin-section" aria-labelledby="dataset-records-title">
          <div className="admin-section-heading">
            <h2 id="dataset-records-title">Linked diagnosis records</h2>
            <p>Records inside this dataset that may anchor future course creation.</p>
          </div>
          {dataset.records.length > 0 ? (
            <div className="diagnosis-card-grid">
              {dataset.records.map((record) => (
                <article className="diagnosis-record-card" key={record.id}>
                  <div className="diagnosis-card-heading">
                    <div>
                      <p>{record.diagnosisCode}</p>
                      <h3>{record.diagnosisTitle}</h3>
                    </div>
                    <div className="reference-badge-row">
                      <StatusBadge label={formatStatus(record.approvalStatus)} />
                      <span
                        className={`status-badge ${
                          record.isLocked
                            ? "status-badge-published"
                            : "status-badge-ready"
                        }`}
                      >
                        {record.isLocked ? "Locked" : "Unlocked"}
                      </span>
                      <span
                        className={`status-badge ${
                          record.archivedAt || !record.isActive
                            ? "status-badge-blocked"
                            : "status-badge-ready"
                        }`}
                      >
                        {record.archivedAt || !record.isActive ? "Archived" : "Active"}
                      </span>
                      <Link
                        className="workspace-link secondary"
                        href={`/admin/diagnosis-records/${record.id}`}
                      >
                        Open record
                      </Link>
                      {record.canEdit ? (
                        <Link
                          className="workspace-link"
                          href={`/admin/diagnosis-records/${record.id}/edit`}
                        >
                          Edit draft
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <dl className="reference-meta-list">
                    <MetaItem
                      label="Core Capacity Area"
                      value={record.coreCapacityArea || "Not set"}
                    />
                    <MetaItem
                      label="Capacity Practice Area"
                      value={
                        record.capacityPracticeArea ||
                        record.subCapacity ||
                        "Not set"
                      }
                    />
                    <MetaItem
                      label="Target Audience"
                      value={record.targetAudience || "Not set"}
                    />
                    <MetaItem label="Region" value={record.region || "Not set"} />
                    <MetaItem
                      label="K/S/M/E route"
                      value={record.ksmeRoute || "Not set"}
                    />
                    <MetaItem
                      label="Course-fit decision"
                      value={record.courseFitDecision || "Not set"}
                    />
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">No records</span>
              <h2>No diagnosis records are linked yet</h2>
              <p>
                Diagnosis records will appear here when this dataset is populated.
              </p>
            </section>
          )}
        </section>

        <UsageSection usages={dataset.linkedCourseSetups} />
      </div>
    </WorkspaceShell>
  );
}

function StatusMessage({
  searchParams,
}: {
  searchParams:
    | {
        approved?: string;
        archived?: string;
        created?: string;
        error?: string;
        updated?: string;
      }
    | undefined;
}) {
  if (searchParams?.error) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-blocked">
          Action needed
        </span>
        <p>{searchParams.error}</p>
      </section>
    );
  }

  if (searchParams?.approved) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-ready">Approved</span>
        <p>This diagnosis dataset has been approved.</p>
      </section>
    );
  }

  if (searchParams?.archived) {
    return (
      <section className="admin-section" aria-label="Action message">
        <span className="status-badge status-badge-blocked">Archived</span>
        <p>
          This diagnosis dataset is archived and remains visible for historical
          traceability.
        </p>
      </section>
    );
  }

  return null;
}

function MetricCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: number;
}) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || "Not recorded"}</dd>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const isApproved = label.toLowerCase().includes("approved");

  return (
    <span
      className={`status-badge ${
        isApproved ? "status-badge-ready" : "status-badge-published"
      }`}
    >
      {label}
    </span>
  );
}

function GovernanceActionCard({
  action,
  buttonLabel,
  disabledHelp,
  enabled,
  fieldName,
  helpText,
  label,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  buttonLabel: string;
  disabledHelp: string;
  enabled: boolean;
  fieldName: string;
  helpText: string;
  label: string;
  title: string;
}) {
  return (
    <div>
      <div className="diagnosis-card-heading">
        <div>
          <p>Admin action</p>
          <h3>{title}</h3>
        </div>
        <span
          className={`status-badge ${
            enabled ? "status-badge-ready" : "status-badge-published"
          }`}
        >
          {enabled ? "Available" : "Not available"}
        </span>
      </div>
      <p>{enabled ? helpText : disabledHelp}</p>
      {enabled ? (
        <form action={action} className="admin-inline-form">
          <label>
            <span>{label}</span>
            <textarea
              name={fieldName}
              placeholder="Explain the governance reason for this action."
              required
              rows={3}
            />
          </label>
          <button className="workspace-link" type="submit">
            {buttonLabel}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function isApproved(value: string) {
  return value.trim().toLowerCase() === "approved";
}

function TextPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="diagnosis-preview-grid">
      <div>
        <strong>{label}</strong>
        <p>{value || "Not recorded yet."}</p>
      </div>
    </div>
  );
}

function UsageSection({
  usages,
}: {
  usages: Array<{
    courseId: string;
    courseTitle: string;
    courseVersionId: string;
    setupTitle: string;
    setupUpdatedAt: Date;
    versionNumber: number;
    versionStatus: string;
  }>;
}) {
  return (
    <section className="admin-section" aria-labelledby="dataset-usage-title">
      <div className="admin-section-heading">
        <h2 id="dataset-usage-title">Linked Course Setup usage</h2>
        <p>
          Courses that currently preserve this dataset as their approved evidence
          anchor.
        </p>
      </div>
      {usages.length > 0 ? (
        <div className="diagnosis-card-grid">
          {usages.map((usage) => (
            <article className="diagnosis-dataset-card" key={usage.courseVersionId}>
              <div className="diagnosis-card-heading">
                <div>
                  <p>Version {usage.versionNumber}</p>
                  <h3>{usage.courseTitle}</h3>
                </div>
                <StatusBadge label={formatStatus(usage.versionStatus)} />
              </div>
              <dl className="reference-meta-list">
                <MetaItem label="Setup title" value={usage.setupTitle} />
                <MetaItem
                  label="Last setup update"
                  value={formatDate(usage.setupUpdatedAt)}
                />
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-empty-panel">
          <span className="status-badge status-badge-published">No course usage</span>
          <h2>No Course Setup records currently select this dataset</h2>
          <p>
            This dataset remains available for review even when it has not yet
            been selected by a course.
          </p>
        </section>
      )}
    </section>
  );
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatStatus(value: string) {
  if (!value) {
    return "Not set";
  }

  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function joinList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "Not specified";
}

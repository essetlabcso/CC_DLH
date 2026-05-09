import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDiagnosisDatasetBrowser } from "@/lib/admin/diagnosis";
import Link from "next/link";

export default async function AdminDiagnosisDatasetsPage() {
  const browser = await getAdminDiagnosisDatasetBrowser();

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Evidence Source Packages">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <h2>Evidence Source Packages</h2>
            <p>
              Browse the evidence source packages that hold validated capacity
              gaps. Approved packages can supply validated capacity gaps for
              release to Course Creators.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
            <Link className="workspace-link" href="/admin/diagnosis-datasets/new">
              New draft evidence package
            </Link>
            <Link className="workspace-link secondary" href="/admin/diagnosis-records">
              Validated Capacity Gaps
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="dataset-health-title">
          <div className="admin-section-heading">
            <h2 id="dataset-health-title">Evidence package readiness</h2>
            <p>Live totals for Admin-managed evidence source packages.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Evidence source packages"
              label="Total packages"
              value={browser.totals.totalDatasets}
            />
            <MetricCard
              detail="Approved as source evidence"
              label="Approved"
              value={browser.totals.approvedDatasets}
            />
            <MetricCard
              detail="Draft or under review"
              label="In preparation"
              value={browser.totals.draftOrUnderReviewDatasets}
            />
            <MetricCard
              detail="No longer available"
              label="Archived"
              value={browser.totals.archivedDatasets}
            />
            <MetricCard
              detail="Linked validated capacity gaps"
              label="Capacity gaps"
              value={browser.totals.totalRecords}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="dataset-list-title">
          <div className="admin-section-heading">
            <h2 id="dataset-list-title">Evidence package browser</h2>
            <p>
              Read-only view of package status, coverage, visibility, and linked
              validated capacity gap counts.
            </p>
          </div>

          {browser.datasets.length > 0 ? (
            <div className="diagnosis-card-grid">
              {browser.datasets.map((dataset) => (
                <article className="diagnosis-dataset-card" key={dataset.id}>
                  <div className="diagnosis-card-heading">
                    <div>
                      <p>{dataset.datasetCode}</p>
                      <h3>{dataset.datasetTitle}</h3>
                    </div>
                    <StatusBadge label={formatStatus(dataset.approvalStatus)} />
                  </div>

                  <p>
                    {dataset.assessmentPurpose ||
                      "No assessment purpose has been recorded yet."}
                  </p>

                  <dl className="reference-meta-list">
                    <MetaItem
                      label="Program / project"
                      value={dataset.programOrProject || "Not specified"}
                    />
                    <MetaItem
                      label="Assessment period"
                      value={dataset.assessmentPeriod}
                    />
                    <MetaItem
                      label="Regions covered"
                      value={
                        dataset.regionsCovered.length > 0
                          ? dataset.regionsCovered.join(", ")
                          : "Not specified"
                      }
                    />
                    <MetaItem
                      label="Organization group"
                      value={dataset.organizationGroup || "Not specified"}
                    />
                    <MetaItem
                      label="Visibility"
                      value={formatStatus(dataset.visibilityScope)}
                    />
                    <MetaItem label="Records" value={String(dataset.recordCount)} />
                    <MetaItem
                      label="Approved by"
                      value={dataset.approvedByName ?? "Not approved"}
                    />
                    <MetaItem
                      label="Approved date"
                      value={formatDate(dataset.approvedAt)}
                    />
                  </dl>

                  <div className="reference-badge-row">
                    <span
                      className={`status-badge ${
                        dataset.archivedAt
                          ? "status-badge-blocked"
                          : "status-badge-ready"
                      }`}
                    >
                      {dataset.archivedAt ? "Archived" : "Active"}
                    </span>
                    <span className="status-badge status-badge-published">
                      Read only
                    </span>
                    <Link
                      className="workspace-link secondary"
                      href={`/admin/diagnosis-datasets/${dataset.id}`}
                    >
                      Open dataset
                    </Link>
                    {dataset.canEdit ? (
                      <Link
                        className="workspace-link secondary"
                        href={`/admin/diagnosis-datasets/${dataset.id}/edit`}
                      >
                        Edit draft
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                0 configured
              </span>
              <h2>No evidence source packages are configured yet</h2>
              <p>
                Approved evidence source packages will be added here before
                validated capacity gaps can be released to Course Creators.
              </p>
            </section>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
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
      <dd>{value}</dd>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const isReady = label.toLowerCase().includes("approved");

  return (
    <span
      className={`status-badge ${
        isReady ? "status-badge-ready" : "status-badge-published"
      }`}
    >
      {label}
    </span>
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
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

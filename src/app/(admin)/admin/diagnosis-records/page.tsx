import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDiagnosisRecordBrowser } from "@/lib/admin/diagnosis";
import {
  diagnosisCourseFitGuidance,
  formatDiagnosisTextForDisplay,
  getDiagnosisCourseFitDisplayLabel,
} from "@/lib/admin/diagnosis-display";
import Link from "next/link";

type AdminDiagnosisRecordsPageProps = {
  searchParams?: Promise<{
    activeState?: string;
    approvalStatus?: string;
    capacityArea?: string;
    courseFitDecision?: string;
    datasetId?: string;
    ksmeRoute?: string;
    region?: string;
    search?: string;
  }>;
};

export default async function AdminDiagnosisRecordsPage({
  searchParams,
}: AdminDiagnosisRecordsPageProps) {
  const params = await searchParams;
  const filters = {
    activeState: cleanParam(params?.activeState),
    approvalStatus: cleanParam(params?.approvalStatus),
    capacityArea: cleanParam(params?.capacityArea),
    courseFitDecision: cleanParam(params?.courseFitDecision),
    datasetId: cleanParam(params?.datasetId),
    ksmeRoute: cleanParam(params?.ksmeRoute),
    region: cleanParam(params?.region),
    search: params?.search?.trim() ?? "",
  };
  const browser = await getAdminDiagnosisRecordBrowser(filters);
  const courseFitLabels = [
    "Course-ready",
    "Course + support",
    "Learning support pathway",
    "Non-course support route",
    "Needs further diagnosis",
  ];

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Diagnosis Records">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <h2>Diagnosis Records</h2>
            <p>
              Browse diagnosis records that package capacity evidence,
              K/S/M/E classification, course-fit routing, safeguards, and
              release status for governed course creation.
            </p>
            <p>{diagnosisCourseFitGuidance}</p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
            <Link className="workspace-link secondary" href="/admin/diagnosis-datasets">
              Evidence Source Packages
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="course-fit-language-title">
          <div className="admin-section-heading">
            <h2 id="course-fit-language-title">Course-fit routing language</h2>
            <p>{diagnosisCourseFitGuidance}</p>
          </div>
          <div className="reference-badge-row" style={{ justifyContent: "flex-start" }}>
            {courseFitLabels.map((label) => (
              <span className="status-badge status-badge-published" key={label}>
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="record-health-title">
          <div className="admin-section-heading">
            <h2 id="record-health-title">Record readiness</h2>
            <p>Live totals for diagnosis records and creator release.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Diagnosis records available"
              label="Total records"
              value={browser.totals.totalRecords}
            />
            <MetricCard
              detail="Approved as validated evidence"
              label="Approved"
              value={browser.totals.approvedRecords}
            />
            <MetricCard
              detail="Available to Course Creators"
              label="Released"
              value={browser.totals.lockedRecords}
            />
            <MetricCard
              detail="No longer available"
              label="Archived"
              value={browser.totals.archivedRecords}
            />
            <MetricCard
              detail="Suitable for a course response"
              label="Course-ready"
              value={browser.totals.courseAddressableRecords}
            />
            <MetricCard
              detail="Needs further diagnosis"
              label="Further diagnosis"
              value={browser.totals.needsFurtherDiagnosisRecords}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="record-filter-title">
          <div className="admin-section-heading">
            <h2 id="record-filter-title">Find diagnosis records</h2>
            <p>
              Filter by evidence source package, approval status, capacity area,
              K/S/M/E route, course-fit routing decision, region, or active state.
            </p>
          </div>
          <form action="/admin/diagnosis-records" className="diagnosis-filter-panel">
            <label className="workspace-label" htmlFor="diagnosis-search">
              Search records
            </label>
            <input
              className="reference-search-input"
              defaultValue={filters.search}
              id="diagnosis-search"
              name="search"
              placeholder="Search code, title, region, capacity area, or gap"
              type="search"
            />
            <div className="diagnosis-filter-grid">
              <SelectField
                label="Evidence source package"
                name="datasetId"
                options={browser.filterOptions.datasets.map((dataset) => ({
                  label: `${dataset.datasetCode} · ${dataset.datasetTitle}`,
                  value: dataset.id,
                }))}
                value={filters.datasetId}
              />
              <SelectField
                label="Approval status"
                name="approvalStatus"
                options={browser.filterOptions.approvalStatuses.map(toOption)}
                value={filters.approvalStatus}
              />
              <SelectField
                label="Capacity area"
                name="capacityArea"
                options={browser.filterOptions.capacityAreas.map(toOption)}
                value={filters.capacityArea}
              />
              <SelectField
                label="K/S/M/E route"
                name="ksmeRoute"
                options={browser.filterOptions.ksmeRoutes.map(toOption)}
                value={filters.ksmeRoute}
              />
              <SelectField
                label="Course-fit decision"
                name="courseFitDecision"
                options={browser.filterOptions.courseFitDecisions.map(
                  toCourseFitOption,
                )}
                value={filters.courseFitDecision}
              />
              <SelectField
                label="Region"
                name="region"
                options={browser.filterOptions.regions.map(toOption)}
                value={filters.region}
              />
              <SelectField
                label="Record state"
                name="activeState"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Archived", value: "archived" },
                ]}
                value={filters.activeState}
              />
            </div>
            <div className="reference-filter-row compact">
              <button className="workspace-button" type="submit">
                Apply filters
              </button>
              <Link className="workspace-link secondary" href="/admin/diagnosis-records">
                Clear
              </Link>
            </div>
          </form>
        </section>

        <section className="admin-section" aria-labelledby="record-list-title">
          <div className="admin-section-heading">
            <h2 id="record-list-title">Diagnosis record browser</h2>
            <p>
              {browser.records.length} records shown with evidence context,
              capacity alignment, course-fit routing, release status, and
              governance status.
            </p>
          </div>

          {browser.records.length > 0 ? (
            <div className="diagnosis-card-grid">
              {browser.records.map((record) => (
                <article className="diagnosis-record-card" key={record.id}>
                  <div className="diagnosis-card-heading">
                    <div>
                      <p>
                        {record.diagnosisCode} · {record.datasetCode}
                      </p>
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
                        {record.isLocked ? "Released to creators" : "Not released"}
                      </span>
                      {record.selectedCourseSetupCount > 0 ? (
                        <span className="status-badge status-badge-published">
                          Already selected
                        </span>
                      ) : null}
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
                      label="Evidence source package"
                      value={record.datasetTitle}
                    />
                    <MetaItem label="Region" value={record.region || "Not set"} />
                    <MetaItem
                      label="Organization / group"
                      value={record.organizationGroup || "Not set"}
                    />
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
                    <MetaItem
                      label="K/S/M/E route"
                      value={record.ksmeRoute || "Not set"}
                    />
                    <MetaItem
                      label="Course-fit decision"
                      value={getDiagnosisCourseFitDisplayLabel(
                        record.courseFitDecision,
                      )}
                    />
                    <MetaItem label="Priority" value={record.priorityLabel} />
                    <MetaItem
                      label="Safety level"
                      value={record.safeguardingRiskLevel || "Not set"}
                    />
                    <MetaItem
                      label="Sensitivity"
                      value={formatStatus(record.dataSensitivityLevel)}
                    />
                    <MetaItem
                      label="Visibility"
                      value={formatStatus(record.visibilityScope)}
                    />
                    <MetaItem
                      label="Course creator usage"
                      value={
                        record.selectedCourseSetupCount > 0
                          ? `${record.selectedCourseSetupCount} selected`
                          : "Not selected yet"
                      }
                    />
                  </dl>

                  <div className="diagnosis-preview-grid">
                    <PreviewBlock
                      label="Baseline"
                      value={formatDiagnosisTextForDisplay(record.currentBaseline)}
                    />
                    <PreviewBlock
                      label="Capacity gap"
                      value={formatDiagnosisTextForDisplay(
                        record.capacityGapStatement,
                      )}
                    />
                    <PreviewBlock
                      label="Desired practice"
                      value={formatDiagnosisTextForDisplay(record.desiredPractice)}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <section className="admin-empty-panel">
              <span className="status-badge status-badge-blocked">
                0 records shown
              </span>
              <h2>No diagnosis records are configured yet</h2>
              <p>
                Approved and released diagnosis records will later become the
                evidence base selected by Course Creators. No records are
                available to browse yet.
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

function PreviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{label}</strong>
      <p>{value || "Not recorded yet."}</p>
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
}) {
  return (
    <label className="diagnosis-filter-field">
      <span>{label}</span>
      <select className="workspace-select" defaultValue={value ?? ""} name={name}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

function cleanParam(value: string | undefined) {
  return value?.trim() || undefined;
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

function toOption(value: string) {
  return {
    label: formatStatus(value),
    value,
  };
}

function toCourseFitOption(value: string) {
  return {
    label: getDiagnosisCourseFitDisplayLabel(value),
    value,
  };
}

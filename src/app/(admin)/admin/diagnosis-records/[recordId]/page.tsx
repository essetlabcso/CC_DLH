import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDiagnosisRecordDetail } from "@/lib/admin/diagnosis";
import {
  getDiagnosisRecordApprovalReadiness,
  type DiagnosisRecordApprovalReadiness,
} from "@/lib/admin/diagnosis-record-approval";
import Link from "next/link";
import { notFound } from "next/navigation";

type AdminDiagnosisRecordDetailPageProps = {
  params?: Promise<{
    recordId?: string;
  }>;
};

export default async function AdminDiagnosisRecordDetailPage({
  params,
}: AdminDiagnosisRecordDetailPageProps) {
  const resolvedParams = await params;
  const recordId = resolvedParams?.recordId;

  if (!recordId) {
    notFound();
  }

  const record = await getAdminDiagnosisRecordDetail(recordId);

  if (!record) {
    notFound();
  }

  const readiness = getDiagnosisRecordApprovalReadiness({
    capacityGapStatement: record.capacityGapStatement,
    capacityPracticeArea: record.capacityPracticeArea,
    coreCapacityArea: record.coreCapacityArea,
    courseFitDecision: record.courseFitDecision,
    currentBaseline: record.currentBaseline,
    dataSensitivityLevel: record.dataSensitivityLevel,
    datasetApprovalStatus: record.datasetApprovalStatus,
    datasetArchivedAt: record.datasetArchivedAt,
    desiredPractice: record.desiredPractice,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    evidenceSource: record.evidenceSource,
    evaluationAnchor: record.evaluationAnchor,
    isActive: record.isActive,
    isLocked: record.isLocked,
    ksmeRoute: record.ksmeRoute,
    monitoringSignal: record.monitoringSignal,
    noHarmNote: record.noHarmNote,
    recordApprovalStatus: record.approvalStatus,
    recordArchivedAt: record.archivedAt,
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
    targetAudience: record.targetAudience,
  });

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Diagnosis Record">
      <div className="admin-dashboard diagnosis-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">
              {record.diagnosisCode} · {record.datasetCode}
            </p>
            <h2>{record.diagnosisTitle}</h2>
            <p>
              Read-only view of the approved diagnosis evidence, course-fit
              decision, safety context, and Course Setup usage for this record.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin/diagnosis-records">
              Back to records
            </Link>
            <Link
              className="workspace-link secondary"
              href={`/admin/diagnosis-datasets/${record.datasetId}`}
            >
              Open dataset
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
        </section>

        <section className="admin-section" aria-labelledby="record-status-title">
          <div className="admin-section-heading">
            <h2 id="record-status-title">Record status</h2>
            <p>Governance, course eligibility, and use signals for this record.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Course Setup records selecting this diagnosis"
              label="Course usage"
              value={record.linkedCourseSetups.length}
            />
            <MetricCard
              detail="Priority rank where available"
              label="Priority rank"
              value={record.priorityRank ?? 0}
            />
            <MetricCard
              detail="Dataset approval state"
              label="Dataset approved"
              value={record.datasetApprovalStatus === "APPROVED" ? 1 : 0}
            />
          </div>
          <div className="reference-badge-row">
            <StatusBadge label={formatStatus(record.approvalStatus)} />
            <span
              className={`status-badge ${
                record.isLocked ? "status-badge-published" : "status-badge-ready"
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
            <span
              className={`status-badge ${
                record.courseEligibility.isEligible
                  ? "status-badge-ready"
                  : "status-badge-blocked"
              }`}
            >
              {record.courseEligibility.label}
            </span>
            {record.canEdit ? (
              <span className="status-badge status-badge-ready">
                Draft edit available
              </span>
            ) : (
              <span className="status-badge status-badge-published">Read only</span>
            )}
          </div>
        </section>

        <section
          className="admin-section"
          aria-labelledby="record-readiness-title"
        >
          <div className="admin-section-heading">
            <h2 id="record-readiness-title">Approval and lock readiness</h2>
            <p>
              Read-only guidance for Admin review. Approval confirms the record
              is complete evidence; locking makes an approved, eligible record
              available for Course Setup.
            </p>
          </div>
          <div className="diagnosis-preview-grid">
            <ReadinessCard
              blockedLabel="Not ready for approval"
              blockingIssues={readiness.approvalBlockingIssues}
              ready={readiness.approvalReady}
              readyLabel="Ready for approval review"
              title="Approval readiness"
              warnings={readiness.approvalWarnings}
            />
            <ReadinessCard
              blockedLabel="Not eligible for Course Setup"
              blockingIssues={readiness.lockBlockingIssues}
              ready={readiness.lockReady}
              readyLabel={
                record.isLocked
                  ? "Locked and Course Setup eligible"
                  : "Ready to lock for Course Setup"
              }
              title="Lock readiness"
              warnings={readiness.lockWarnings}
            />
          </div>
          <div className="diagnosis-preview-grid">
            <div>
              <strong>Readiness summary</strong>
              <p>{readiness.summary}</p>
            </div>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="record-evidence-title">
          <div className="admin-section-heading">
            <h2 id="record-evidence-title">Evidence summary</h2>
            <p>Baseline, capacity gap, desired practice, and evidence source.</p>
          </div>
          <div className="diagnosis-preview-grid">
            <PreviewBlock
              label="Baseline / current practice"
              value={record.currentBaseline}
            />
            <PreviewBlock
              label="Capacity gap"
              value={record.capacityGapStatement}
            />
            <PreviewBlock
              label="Desired practice"
              value={record.desiredPractice}
            />
            <PreviewBlock label="Evidence source" value={record.evidenceSource} />
            <PreviewBlock
              label="Root cause summary"
              value={record.rootCauseSummary}
            />
            <PreviewBlock
              label="Safe dashboard summary"
              value={record.safeSummaryForDashboard}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="record-capacity-title">
          <div className="admin-section-heading">
            <h2 id="record-capacity-title">Capacity and participant context</h2>
            <p>How this record maps to DEC capacity practice and target groups.</p>
          </div>
          <dl className="reference-meta-list">
            <MetaItem label="Dataset" value={record.datasetTitle} />
            <MetaItem label="Assessment period" value={record.assessmentPeriod} />
            <MetaItem
              label="Dataset status"
              value={
                record.datasetArchivedAt
                  ? "Archived"
                  : formatStatus(record.datasetApprovalStatus)
              }
            />
            <MetaItem
              label="Organization"
              value={record.organizationName ?? "Not linked to one organization"}
            />
            <MetaItem
              label="Organization / group"
              value={record.organizationGroup || "Not set"}
            />
            <MetaItem label="Region" value={record.region || "Not set"} />
            <MetaItem
              label="Sector / thematic area"
              value={record.sectorThematicArea || "Not set"}
            />
            <MetaItem
              label="Core Capacity Area"
              value={record.coreCapacityArea || "Not set"}
            />
            <MetaItem
              label="Capacity Practice Area"
              value={record.capacityPracticeArea || "Not set"}
            />
            <MetaItem
              label="Sub-capacity"
              value={record.subCapacity || "Not set"}
            />
            <MetaItem
              label="Indicator / standard link"
              value={record.indicatorStandardLink || "Not set"}
            />
            <MetaItem
              label="Target Audience"
              value={record.targetAudience || "Not set"}
            />
          </dl>
        </section>

        <section className="admin-section" aria-labelledby="record-fit-title">
          <div className="admin-section-heading">
            <h2 id="record-fit-title">K/S/M/E and course-fit decision</h2>
            <p>Whether this diagnosis can safely anchor course creation.</p>
          </div>
          <dl className="reference-meta-list">
            <MetaItem label="K/S/M/E route" value={record.ksmeRoute || "Not set"} />
            <MetaItem
              label="Course-fit decision"
              value={record.courseFitDecision || "Not set"}
            />
            <MetaItem
              label="Separable Knowledge/Skill component"
              value={record.separableKnowledgeSkillComponent || "Not recorded"}
            />
            <MetaItem
              label="Non-course barrier"
              value={record.nonCourseBarrierSummary || "Not recorded"}
            />
            <MetaItem
              label="Recommended intervention route"
              value={record.recommendedInterventionRoute || "Not set"}
            />
            <MetaItem
              label="Recommended course or support title"
              value={record.recommendedCourseOrSupportTitle || "Not set"}
            />
            <MetaItem
              label="Course creation status"
              value={formatStatus(record.courseCreationStatus)}
            />
            <MetaItem label="Priority" value={record.priorityLabel} />
          </dl>
          <div className="diagnosis-preview-grid">
            <div>
              <strong>Course setup eligibility</strong>
              <ul>
                {record.courseEligibility.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="record-safety-title">
          <div className="admin-section-heading">
            <h2 id="record-safety-title">Safety, monitoring, and recognition context</h2>
            <p>
              Safeguarding, data sensitivity, monitoring anchors, and practical
              evidence references.
            </p>
          </div>
          <dl className="reference-meta-list">
            <MetaItem
              label="Safeguarding risk level"
              value={record.safeguardingRiskLevel || "Not set"}
            />
            <MetaItem
              label="Data sensitivity"
              value={formatStatus(record.dataSensitivityLevel)}
            />
            <MetaItem
              label="No-harm note"
              value={record.noHarmNote || "Not recorded"}
            />
            <MetaItem
              label="Evaluation anchor"
              value={record.evaluationAnchor || "Not recorded"}
            />
            <MetaItem
              label="Monitoring signal"
              value={record.monitoringSignal || "Not recorded"}
            />
            <MetaItem
              label="Possible practical proof"
              value={record.possiblePracticalProof || "Not recorded"}
            />
            <MetaItem
              label="Verified achievement example"
              value={record.verifiedAchievementExample || "Not recorded"}
            />
            <MetaItem
              label="Visibility"
              value={formatStatus(record.visibilityScope)}
            />
          </dl>
        </section>

        <section className="admin-section" aria-labelledby="record-governance-title">
          <div className="admin-section-heading">
            <h2 id="record-governance-title">Approval and traceability</h2>
            <p>Who approved or locked the record and when it last changed.</p>
          </div>
          <dl className="reference-meta-list">
            <MetaItem
              label="Approved by"
              value={record.approvedByName ?? "Not approved"}
            />
            <MetaItem label="Approved date" value={formatDate(record.approvedAt)} />
            <MetaItem
              label="Locked by"
              value={record.lockedByName ?? "Not locked"}
            />
            <MetaItem label="Locked date" value={formatDate(record.lockedAt)} />
            <MetaItem
              label="Created by"
              value={record.createdByName ?? "Not recorded"}
            />
            <MetaItem label="Created" value={formatDate(record.createdAt)} />
            <MetaItem
              label="Updated by"
              value={record.updatedByName ?? "Not recorded"}
            />
            <MetaItem label="Last updated" value={formatDate(record.updatedAt)} />
            <MetaItem
              label="Change reason"
              value={record.changeReason || "Not recorded"}
            />
          </dl>
        </section>

        <UsageSection usages={record.linkedCourseSetups} />
      </div>
    </WorkspaceShell>
  );
}

function ReadinessCard({
  blockedLabel,
  blockingIssues,
  ready,
  readyLabel,
  title,
  warnings,
}: {
  blockedLabel: string;
  blockingIssues: DiagnosisRecordApprovalReadiness["approvalBlockingIssues"];
  ready: boolean;
  readyLabel: string;
  title: string;
  warnings: DiagnosisRecordApprovalReadiness["approvalWarnings"];
}) {
  return (
    <div>
      <div className="diagnosis-card-heading">
        <div>
          <p>Read-only check</p>
          <h3>{title}</h3>
        </div>
        <span
          className={`status-badge ${
            ready ? "status-badge-ready" : "status-badge-blocked"
          }`}
        >
          {ready ? readyLabel : blockedLabel}
        </span>
      </div>
      <IssueList
        emptyText="No blocking issues found."
        items={blockingIssues}
        title="Blocking issues"
      />
      <IssueList emptyText="No warnings found." items={warnings} title="Warnings" />
    </div>
  );
}

function IssueList({
  emptyText,
  items,
  title,
}: {
  emptyText: string;
  items: string[];
  title: string;
}) {
  return (
    <div>
      <strong>{title}</strong>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
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
      <dd>{value || "Not recorded"}</dd>
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
    <section className="admin-section" aria-labelledby="record-usage-title">
      <div className="admin-section-heading">
        <h2 id="record-usage-title">Linked Course Setup usage</h2>
        <p>
          Courses that currently preserve this diagnosis record as their approved
          evidence anchor.
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
          <h2>No Course Setup records currently select this diagnosis</h2>
          <p>
            This record remains available for review even when it has not yet
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

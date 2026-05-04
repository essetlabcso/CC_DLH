import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDashboardCounts } from "@/lib/admin/dashboard";
import Link from "next/link";

const governanceRules = [
  "80% final test score triggers certificate eligibility.",
  "Practical proof is tracked separately from certificates.",
  "Review approves readiness; Publish releases approved versions.",
  "Raw proof remains private by default.",
  "Course creators cannot publish courses.",
  "Course creators should eventually begin from approved diagnosis records.",
];

const taskCards = [
  {
    title: "Reference Data",
    href: "/admin/reference-data",
    status: "View only",
    summary:
      "Lookup categories and values used across setup, review, publishing, proof, and monitoring.",
  },
  {
    title: "Workflow Field Metadata",
    href: "/admin/field-metadata",
    status: "View only",
    summary:
      "Registry of important fields across setup, diagnosis, design, build, review, publish, and monitoring.",
  },
  {
    title: "Diagnosis Datasets",
    href: "/admin/diagnosis-datasets",
    status: "Not configured",
    summary:
      "Approved source datasets that will anchor future course setup and analysis work.",
  },
  {
    title: "Diagnosis Records",
    href: "/admin/diagnosis-records",
    status: "Not configured",
    summary:
      "Approved diagnosis records that future course creators will select before building.",
  },
  {
    title: "Audit Log",
    href: "/admin/audit-log",
    status: "View only",
    summary:
      "Trace of future Admin reference-data and governance changes.",
  },
  {
    title: "Users and Roles",
    href: "/admin/users",
    status: "Manage",
    summary:
      "Review current users and manage existing platform role assignments.",
  },
  {
    title: "Certificate Oversight",
    href: "/admin/certificates",
    status: "Available",
    summary:
      "Review issued certificates and certificate verification records.",
  },
];

export default async function AdminWorkspacePage() {
  const counts = await getAdminDashboardCounts();

  const healthCards = [
    {
      label: "Lookup categories",
      value: counts.lookupCategories,
      detail: "Reference groups available",
    },
    {
      label: "Lookup values",
      value: counts.lookupValues,
      detail: "Controlled values available",
    },
    {
      label: "Workflow fields",
      value: counts.fieldMetadata,
      detail: "Tracked field records",
    },
    {
      label: "Diagnosis datasets",
      value: counts.diagnosisDatasets,
      detail: "Approved sources configured",
    },
    {
      label: "Diagnosis records",
      value: counts.diagnosisRecords,
      detail: "Approved records configured",
    },
    {
      label: "Audit log records",
      value: counts.auditLogs,
      detail: "Governance events recorded",
    },
  ];

  const readinessCards = [
    {
      label: "Reference data ready",
      status: counts.lookupCategories > 0 && counts.lookupValues > 0 ? "Ready" : "Needs setup",
      tone:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "status-badge-ready"
          : "status-badge-blocked",
      detail:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "Core categories and values are available for future Admin-managed forms."
          : "Reference categories and values need to be loaded before connected forms can use them.",
    },
    {
      label: "Workflow metadata ready",
      status: counts.fieldMetadata > 0 ? "Ready" : "Needs setup",
      tone: counts.fieldMetadata > 0 ? "status-badge-ready" : "status-badge-blocked",
      detail:
        counts.fieldMetadata > 0
          ? "Key workflow fields are registered for future governed setup and review screens."
          : "Workflow field records need to be loaded before Admin can oversee field governance.",
    },
    {
      label: "Diagnosis datasets",
      status: counts.diagnosisDatasets > 0 ? "Configured" : "Not yet configured",
      tone:
        counts.diagnosisDatasets > 0
          ? "status-badge-ready"
          : "status-badge-blocked",
      detail:
        counts.diagnosisDatasets > 0
          ? "At least one diagnosis dataset is available."
          : "Approved diagnosis datasets still need to be added.",
    },
    {
      label: "Diagnosis records",
      status: counts.diagnosisRecords > 0 ? "Configured" : "Not yet configured",
      tone:
        counts.diagnosisRecords > 0 ? "status-badge-ready" : "status-badge-blocked",
      detail:
        counts.diagnosisRecords > 0
          ? "At least one diagnosis record is available."
          : "Approved diagnosis records still need to be added.",
    },
    {
      label: "Course Setup connection",
      status: "Not yet enabled",
      tone: "status-badge-blocked",
      detail:
        "Course creators still use the existing setup flow until approved diagnosis selection is connected.",
    },
    {
      label: "Admin editing",
      status: "Not yet enabled",
      tone: "status-badge-blocked",
      detail:
        "This area is read-only for now; editing screens will be added after the foundation is verified.",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Admin Control Center">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="admin-overview-title">
          <div>
            <h2 id="admin-overview-title">Platform governance overview</h2>
            <p>
              Control the reference data, approved diagnosis records, workflow
              field metadata, and governance signals that keep the DEC Learning
              Hub consistent and traceable.
            </p>
          </div>
          <span className="status-badge status-badge-published">Read-only overview</span>
        </section>

        <section className="admin-section" aria-labelledby="admin-health-title">
          <div className="admin-section-heading">
            <h2 id="admin-health-title">Configuration health</h2>
            <p>Live counts from the current Admin foundation.</p>
          </div>
          <div className="admin-metrics-grid">
            {healthCards.map((card) => (
              <article className="admin-stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="admin-readiness-title">
          <div className="admin-section-heading">
            <h2 id="admin-readiness-title">Readiness status</h2>
            <p>What is ready now and what remains intentionally controlled.</p>
          </div>
          <div className="admin-card-grid">
            {readinessCards.map((card) => (
              <article className="admin-readiness-card" key={card.label}>
                <div>
                  <h3>{card.label}</h3>
                  <span className={`status-badge ${card.tone}`}>{card.status}</span>
                </div>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="admin-tasks-title">
          <div className="admin-section-heading">
            <h2 id="admin-tasks-title">Admin areas</h2>
            <p>Read-only entry points for the platform control center.</p>
          </div>
          <div className="admin-task-grid">
            {taskCards.map((card) => (
              <Link className="admin-task-card" href={card.href} key={card.title}>
                <span className="status-badge status-badge-published">{card.status}</span>
                <strong>{card.title}</strong>
                <p>{card.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="admin-rules-title">
          <div className="admin-section-heading">
            <h2 id="admin-rules-title">Governance reminders</h2>
            <p>Rules that remain active across the current platform foundation.</p>
          </div>
          <div className="admin-rule-grid">
            {governanceRules.map((rule) => (
              <div className="admin-rule-card" key={rule}>
                <span aria-hidden="true">OK</span>
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

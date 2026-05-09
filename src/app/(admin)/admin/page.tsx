import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { getAdminDashboardCounts } from "@/lib/admin/dashboard";
import Link from "next/link";

const governanceRules = [
  "Only Super Admin-equivalent users can grant or change Platform Admin authority.",
  "Platform Admins publish only after Review approval.",
  "80%+ final test score triggers the course certificate.",
  "Practical proof remains separate from the course certificate.",
  "Raw proof remains private by default.",
  "Admins can return, reopen, reassign, archive, or retire only through allowed workflow actions.",
];

const taskCards = [
  {
    title: "Users and Roles",
    href: "/admin/users",
    status: "Manage",
    summary:
      "Manage operational access while keeping Platform Admin authority under Super Admin-equivalent control.",
  },
  {
    title: "Organizations",
    href: "/admin/organizations",
    status: "Manage",
    summary:
      "Register CSOs, maintain organization details, and manage memberships.",
  },
  {
    title: "Reference Data",
    href: "/admin/reference-data",
    status: "Manage",
    summary:
      "Manage approved values used across setup, review, publishing, proof, and monitoring.",
  },
  {
    title: "Courses & Workflow",
    href: "/admin/courses",
    status: "Review",
    summary:
      "See course workflow status, blockers, next actions, and publish readiness without bypassing gates.",
  },
  {
    title: "Workflow Field Metadata",
    href: "/admin/field-metadata",
    status: "View only",
    summary:
      "Review the governed fields used across the course workflow.",
  },
  {
    title: "Diagnosis Datasets",
    href: "/admin/diagnosis-datasets",
    status: "Manage",
    summary:
      "Approved source datasets that will anchor future course setup and analysis work.",
  },
  {
    title: "Diagnosis Records",
    href: "/admin/diagnosis-records",
    status: "Manage",
    summary:
      "Approved diagnosis records that future course creators will select before building.",
  },
  {
    title: "Audit Log",
    href: "/admin/audit-log",
    status: "Available",
    summary:
      "Review the trace of Admin changes and sensitive decisions.",
  },
  {
    title: "Certificate Oversight",
    href: "/admin/certificates",
    status: "Available",
    summary:
      "Review issued certificates and certificate verification records.",
  },
  {
    title: "Monitoring & Evidence",
    href: "/admin/monitoring",
    status: "Available",
    summary:
      "High-level insights into learning progress and organizational capacity achievements.",
  },
  {
    title: "Data Safety & Visibility",
    href: "/admin/data-safety",
    status: "Manage",
    summary:
      "Oversee practical proof safety flags and external visibility decisions.",
  },
  {
    title: "Configuration",
    href: "/admin/config",
    status: "Review",
    summary:
      "Review system constraints and controlled setup areas.",
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
    {
      label: "Organizations",
      value: counts.organizations,
      detail: "Registered CSOs",
    },
    {
      label: "Certificates",
      value: counts.certificates,
      detail: "Issued learning certificates",
    },
    {
      label: "Approved for publish",
      value: counts.coursesApprovedForPublish,
      detail: "Courses waiting for release",
    },
    {
      label: "Specialist flags",
      value: counts.specialistFlags,
      detail: "Proof needing Admin review",
    },
    {
      label: "Externally visible",
      value: counts.externallyVisibleAchievements,
      detail: "Achievements safely shared",
    },
  ];

  const actionCards = [
    {
      label: "Course workflow",
      href: "/admin/courses",
      status:
        counts.coursesSubmittedForReview + counts.coursesApprovedForPublish > 0
          ? "Needs review"
          : "Clear",
      tone:
        counts.coursesSubmittedForReview + counts.coursesApprovedForPublish > 0
          ? "status-badge-blocked"
          : "status-badge-ready",
      detail:
        counts.coursesSubmittedForReview + counts.coursesApprovedForPublish > 0
          ? `${
              counts.coursesSubmittedForReview +
              counts.coursesApprovedForPublish
            } course version${
              counts.coursesSubmittedForReview +
                counts.coursesApprovedForPublish ===
              1
                ? ""
                : "s"
            } need review or publish attention.`
          : "No submitted or approved courses are currently waiting.",
    },
    {
      label: "Proof safety review",
      href: "/admin/data-safety",
      status: counts.specialistFlags > 0 ? "Needs attention" : "Clear",
      tone:
        counts.specialistFlags > 0
          ? "status-badge-blocked"
          : "status-badge-ready",
      detail:
        counts.specialistFlags > 0
          ? `${counts.specialistFlags} proof submission${
              counts.specialistFlags === 1 ? "" : "s"
            } need specialist or redaction review.`
          : "No specialist or redaction flags are waiting.",
    },
    {
      label: "External visibility",
      href: "/admin/data-safety",
      status:
        counts.externallyVisibleAchievements > 0 ? "Review visibility" : "Private by default",
      tone:
        counts.externallyVisibleAchievements > 0
          ? "status-badge-published"
          : "status-badge-ready",
      detail:
        counts.externallyVisibleAchievements > 0
          ? `${counts.externallyVisibleAchievements} achievement${
              counts.externallyVisibleAchievements === 1 ? "" : "s"
            } have donor or public visibility enabled.`
          : "No verified achievements are externally visible.",
    },
    {
      label: "Publish queue",
      href: "/review/publishing",
      status: counts.coursesApprovedForPublish > 0 ? "Ready for Admin" : "No waiting courses",
      tone:
        counts.coursesApprovedForPublish > 0
          ? "status-badge-blocked"
          : "status-badge-ready",
      detail:
        counts.coursesApprovedForPublish > 0
          ? `${counts.coursesApprovedForPublish} reviewed course${
              counts.coursesApprovedForPublish === 1 ? "" : "s"
            } are approved for publishing checks.`
          : "No reviewed courses are currently waiting for publication.",
    },
    {
      label: "Reference setup",
      href: "/admin/reference-data",
      status:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "Ready"
          : "Needs setup",
      tone:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "status-badge-ready"
          : "status-badge-blocked",
      detail:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "Reference categories and values are available."
          : "Reference categories and values need Admin setup.",
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
          ? "Core categories and values are available for Admin-managed forms."
          : "Reference categories and values need setup before connected forms can use them.",
    },
    {
      label: "Workflow metadata ready",
      status: counts.fieldMetadata > 0 ? "Ready" : "Needs setup",
      tone: counts.fieldMetadata > 0 ? "status-badge-ready" : "status-badge-blocked",
      detail:
        counts.fieldMetadata > 0
          ? "Key workflow fields are registered for governed setup and review screens."
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
      status: "Partially enabled",
      tone: "status-badge-ready",
      detail:
        "Course setup is anchored to Admin diagnosis records and selected lookup fields.",
    },
    {
      label: "Data safety oversight",
      status: "Enabled",
      tone: "status-badge-ready",
      detail:
        "Administrative oversight for sensitive proof submissions and external visibility is active.",
    },
  ];

  const workflowCards = [
    {
      label: "Submitted for Review",
      value: counts.coursesSubmittedForReview,
      detail: "Course versions waiting in the review pathway",
    },
    {
      label: "Approved for Publish",
      value: counts.coursesApprovedForPublish,
      detail: "Reviewed course versions ready for publishing checks",
    },
    {
      label: "Published",
      value: counts.coursesPublished,
      detail: "Course versions released for learners",
    },
    {
      label: "Proof Under Review",
      value: counts.proofsUnderReview,
      detail: "Practical proof submissions in review",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Admin Control Center">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="admin-overview-title">
          <div>
            <h2 id="admin-overview-title">Platform governance overview</h2>
            <p>
              Keep platform access, reference data, course readiness,
              certificates, proof safety, and monitoring evidence clear and
              traceable.
            </p>
          </div>
          <span className="status-badge status-badge-ready">Operational view</span>
        </section>

        <section className="admin-section" aria-labelledby="admin-actions-title">
          <div className="admin-section-heading">
            <h2 id="admin-actions-title">Action required</h2>
            <p>Items that need Admin attention from current platform records.</p>
          </div>
          <div className="admin-card-grid">
            {actionCards.map((card) => (
              <Link className="admin-task-card" href={card.href} key={card.label}>
                <span className={`status-badge ${card.tone}`}>{card.status}</span>
                <strong>{card.label}</strong>
                <p>{card.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="admin-health-title">
          <div className="admin-section-heading">
            <h2 id="admin-health-title">Configuration health</h2>
            <p>Current setup, governance, and safety records.</p>
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

        <section className="admin-section" aria-labelledby="admin-workflow-title">
          <div className="admin-section-heading">
            <h2 id="admin-workflow-title">Workflow status</h2>
            <p>High-level course and proof movement, using existing platform records.</p>
          </div>
          <div className="admin-metrics-grid">
            {workflowCards.map((card) => (
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
            <p>What is ready, what needs setup, and what remains intentionally controlled.</p>
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
            <p>Common places for Admin review, setup, and oversight.</p>
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

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminDashboardCounts,
  getAdminDashboardQueues,
  type AdminDashboardQueueItem,
} from "@/lib/admin/dashboard";
import Link from "next/link";

const governanceRules = [
  "Only Super Admin-equivalent users can grant or change Platform Admin authority.",
  "Platform Admins publish only after Review approval.",
  "80%+ final test score triggers the course certificate.",
  "Practical proof remains separate from the course certificate.",
  "Raw proof remains private by default.",
  "Sensitive course changes need a clear reason and an activity record.",
];

const adminAreaGroups = [
  {
    title: "People and Organizations",
    summary: "Manage who uses the platform and how CSOs are grouped.",
    panels: [
      {
        title: "Users & Roles",
        href: "/admin/users",
        status: "Manage",
        summary:
          "Invite users, update roles, and protect Platform Admin authority.",
      },
      {
        title: "Learner Invitations",
        href: "/admin/learner-invitations",
        status: "Create",
        summary:
          "Create one learner invitation and review invitation status safely.",
      },
      {
        title: "Admin Authority",
        href: "/admin/admin-authority",
        status: "View",
        summary:
          "Review Super Admin-equivalent and Platform Admin authority.",
      },
      {
        title: "Organizations",
        href: "/admin/organizations",
        status: "Manage",
        summary:
          "Manage CSO profiles, members, and safe organization summaries.",
      },
      {
        title: "Programs & Cohorts",
        href: "/admin/programs-cohorts",
        status: "View",
        summary:
          "Review how programs, cohorts, organizations, and courses are grouped.",
      },
      {
        title: "Participant Access",
        href: "/admin/participant-access",
        status: "View",
        summary:
          "Review learner access across invitations, enrollments, programs, and cohorts.",
      },
    ],
  },
  {
    title: "Course Governance",
    summary: "Keep course creation tied to approved evidence and review steps.",
    panels: [
      {
        title: "Evidence Source Packages",
        href: "/admin/diagnosis-datasets",
        status: "Manage",
        summary: "Manage approved source evidence for capacity gaps.",
      },
      {
        title: "Validated Capacity Gaps",
        href: "/admin/diagnosis-records",
        status: "Manage",
        summary: "Review approved gaps that can become courses.",
      },
      {
        title: "Courses & Workflow",
        href: "/admin/courses",
        status: "Review",
        summary: "See where each course is and what needs attention.",
      },
      {
        title: "Review Queue",
        href: "/review/queue",
        status: "Review",
        summary: "Check courses waiting for review decisions.",
      },
      {
        title: "Publish Queue",
        href: "/review/publishing",
        status: "Publish",
        summary: "Release approved courses when readiness checks pass.",
      },
    ],
  },
  {
    title: "Learning Evidence",
    summary: "Track certificates, applied evidence, and safe progress summaries.",
    panels: [
      {
        title: "Certificates",
        href: "/admin/certificates",
        status: "Review",
        summary: "View certificates issued from 80%+ final test scores.",
      },
      {
        title: "Practical Proof & Badges",
        href: "/admin/proof-badges",
        status: "View",
        summary:
          "Review proof, recognition, badge visibility, and safety summaries.",
      },
      {
        title: "Monitoring & Capacity Evidence",
        href: "/admin/monitoring",
        status: "View",
        summary: "View safe learning and achievement summaries.",
      },
    ],
  },
  {
    title: "Safety and Accountability",
    summary: "Protect sensitive data and keep Admin changes traceable.",
    panels: [
      {
        title: "Data Safety & Visibility",
        href: "/admin/data-safety",
        status: "Manage",
        summary: "Review proof safety flags and external visibility.",
      },
      {
        title: "Reference Data",
        href: "/admin/reference-data",
        status: "Manage",
        summary: "Manage dropdown choices and controlled values.",
      },
      {
        title: "Audit Log",
        href: "/admin/audit-log",
        status: "Review",
        summary: "Review important Admin changes and reasons.",
      },
      {
        title: "Workflow Fields",
        href: "/admin/field-metadata",
        status: "Support",
        summary: "Check which fields appear in each course step.",
      },
      {
        title: "Settings",
        href: "/admin/config",
        status: "Support",
        summary: "Open lower-priority setup and reference tools.",
      },
    ],
  },
];

function DashboardQueue({
  title,
  items,
}: {
  title: string;
  items: AdminDashboardQueueItem[];
}) {
  return (
    <div className="admin-queue-card">
      <div className="admin-queue-header">
        <h3>{title}</h3>
      </div>
      {items.length === 0 ? (
        <div className="admin-queue-empty">No active items</div>
      ) : (
        <ul className="admin-queue-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="admin-queue-item">
                <span className="admin-queue-title" title={item.title}>
                  {item.title}
                </span>
                <div className="admin-queue-meta">
                  <span>{item.subtitle}</span>
                  <span>
                    {item.updatedAt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminWorkspacePage() {
  const [counts, queues] = await Promise.all([
    getAdminDashboardCounts(),
    getAdminDashboardQueues(),
  ]);

  const healthCards = [
    {
      label: "Reference groups",
      value: counts.lookupCategories,
      detail: "Groups of dropdown choices",
    },
    {
      label: "Reference values",
      value: counts.lookupValues,
      detail: "Dropdown choices available",
    },
    {
      label: "Workflow Fields",
      value: counts.fieldMetadata,
      detail: "Fields shown across course steps",
    },
    {
      label: "Evidence Source Packages",
      value: counts.diagnosisDatasets,
      detail: "Source evidence packages",
    },
    {
      label: "Validated Capacity Gaps",
      value: counts.diagnosisRecords,
      detail: "Gaps ready for Admin review",
    },
    {
      label: "Audit Log",
      value: counts.auditLogs,
      detail: "Admin actions recorded",
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
          : "No submitted or approved courses are waiting.",
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
            } are ready for final publishing checks.`
          : "No reviewed courses are waiting for publication.",
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
      label: "Reference Data",
      status: counts.lookupCategories > 0 && counts.lookupValues > 0 ? "Ready" : "Needs setup",
      tone:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "status-badge-ready"
          : "status-badge-blocked",
      detail:
        counts.lookupCategories > 0 && counts.lookupValues > 0
          ? "Dropdown choices are available for Admin-managed forms."
          : "Dropdown choices need setup before forms can use them.",
    },
    {
      label: "Workflow Fields",
      status: counts.fieldMetadata > 0 ? "Ready" : "Needs setup",
      tone: counts.fieldMetadata > 0 ? "status-badge-ready" : "status-badge-blocked",
      detail:
        counts.fieldMetadata > 0
          ? "Course step fields are available for Admin review."
          : "Course step fields need to be loaded before Admin review.",
    },
    {
      label: "Evidence Source Packages",
      status: counts.diagnosisDatasets > 0 ? "Configured" : "Not yet configured",
      tone:
        counts.diagnosisDatasets > 0
          ? "status-badge-ready"
          : "status-badge-blocked",
      detail:
        counts.diagnosisDatasets > 0
          ? "At least one evidence source package is available."
          : "Approved evidence source packages still need to be added.",
    },
    {
      label: "Validated Capacity Gaps",
      status: counts.diagnosisRecords > 0 ? "Configured" : "Not yet configured",
      tone:
        counts.diagnosisRecords > 0 ? "status-badge-ready" : "status-badge-blocked",
      detail:
        counts.diagnosisRecords > 0
          ? "At least one validated capacity gap is available."
          : "Approved capacity gaps still need to be added.",
    },
    {
      label: "Data Safety & Visibility",
      status: "Enabled",
      tone: "status-badge-ready",
      detail:
        "Proof safety flags and external visibility checks are available.",
    },
  ];

  const workflowCards = [
    {
      label: "Submitted for Review",
      value: counts.coursesSubmittedForReview,
      detail: "Courses waiting for review decisions",
    },
    {
      label: "Approved for Publish",
      value: counts.coursesApprovedForPublish,
      detail: "Courses ready for publishing checks",
    },
    {
      label: "Published",
      value: counts.coursesPublished,
      detail: "Courses released for learners",
    },
    {
      label: "Proof Under Review",
      value: counts.proofsUnderReview,
      detail: "Practical proof waiting for human review",
    },
  ];

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Admin Control Center">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="admin-overview-title">
          <div>
            <h2 id="admin-overview-title">What Admins Control</h2>
            <p>
              Manage access, CSO records, approved evidence, course readiness,
              certificates, proof safety, and monitoring summaries from one
              place.
            </p>
          </div>
          <span className="status-badge status-badge-ready">Ready</span>
        </section>

        <section className="admin-section" aria-labelledby="admin-actions-title">
          <div className="admin-section-heading">
            <h2 id="admin-actions-title">Action required</h2>
            <p>Items that need Admin attention now.</p>
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

        <section className="admin-section" aria-labelledby="admin-queues-title">
          <div className="admin-section-heading">
            <h2 id="admin-queues-title">Operational Queues</h2>
            <p>Prioritized workflow items that need direct action.</p>
          </div>
          <div className="admin-queue-grid">
            <DashboardQueue
              title="Pending Course Reviews"
              items={queues.pendingCourseReviews}
            />
            <DashboardQueue
              title="Pending Diagnosis Records"
              items={queues.pendingDiagnosisRecords}
            />
            <DashboardQueue
              title="Practical Proof Review"
              items={queues.proofSubmissions}
            />
            <DashboardQueue
              title="Data Safety Flags"
              items={queues.dataSafetyFlags}
            />
            <DashboardQueue
              title="Active Invitations"
              items={queues.activeInvitations}
            />
            <DashboardQueue
              title="Access Issues"
              items={queues.accessIssues}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="admin-health-title">
          <div className="admin-section-heading">
            <h2 id="admin-health-title">Setup Status</h2>
            <p>Core Admin areas and safety counts.</p>
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
            <h2 id="admin-workflow-title">Course and Proof Status</h2>
            <p>Courses and practical proof that may need follow-up.</p>
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
            <h2 id="admin-readiness-title">Platform Readiness</h2>
            <p>What is ready and what still needs Admin setup.</p>
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
            <h2 id="admin-tasks-title">Admin Work Areas</h2>
            <p>Choose the area that matches the work you need to do.</p>
          </div>
          {adminAreaGroups.map((group) => (
            <section className="admin-section" key={group.title}>
              <div className="admin-section-heading">
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
              </div>
              <div className="admin-task-grid">
                {group.panels.map((panel) =>
                  panel.href ? (
                    <Link
                      className="admin-task-card"
                      href={panel.href}
                      key={panel.title}
                    >
                      <span className="status-badge status-badge-published">
                        {panel.status}
                      </span>
                      <strong>{panel.title}</strong>
                      <p>{panel.summary}</p>
                    </Link>
                  ) : (
                    <article className="admin-task-card" key={panel.title}>
                      <span className="status-badge">{panel.status}</span>
                      <strong>{panel.title}</strong>
                      <p>{panel.summary}</p>
                    </article>
                  ),
                )}
              </div>
            </section>
          ))}
        </section>

        <section className="admin-section" aria-labelledby="admin-rules-title">
          <div className="admin-section-heading">
            <h2 id="admin-rules-title">Governance reminders</h2>
            <p>Rules that keep the platform safe and consistent.</p>
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

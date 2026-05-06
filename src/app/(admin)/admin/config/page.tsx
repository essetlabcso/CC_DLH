import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import Link from "next/link";

const configCards = [
  {
    title: "Controlled Lookups",
    href: "/admin/config/lookups",
    status: "Manage",
    summary:
      "Manage categories and values used across setup, analysis, design, review, publishing, proof, and monitoring.",
  },
  {
    title: "Workflow Field Metadata",
    href: "/admin/field-metadata",
    status: "View only",
    summary:
      "Registry of important fields across course setup, diagnosis, design, build, and monitoring phases.",
  },
  {
    title: "Diagnosis Datasets",
    href: "/admin/diagnosis-datasets",
    status: "Manage",
    summary:
      "Approved source datasets that anchor course setup and analysis work.",
  },
];

export default async function AdminConfigPage() {
  await requireWorkspaceIdentity("/admin/config");

  return (
    <WorkspaceShell eyebrow="DEC Admin" title="Configuration Center">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="config-overview-title">
          <div>
            <h2 id="config-overview-title">Platform configuration overview</h2>
            <p>
              Manage platform taxonomies, lookup categories, and governed workflow
              elements that support Course Setup, build, review, and publishing.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link className="workspace-link secondary" href="/admin">
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="config-areas-title">
          <div className="admin-section-heading">
            <h2>Configuration Areas</h2>
            <p>Select a controlled area below to inspect or manage taxonomies.</p>
          </div>
          <div className="admin-task-grid">
            {configCards.map((card) => (
              <Link className="admin-task-card" href={card.href} key={card.title}>
                <span className="status-badge status-badge-published">{card.status}</span>
                <strong>{card.title}</strong>
                <p>{card.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-section" aria-labelledby="config-principles-title">
          <div className="admin-section-heading">
            <h2 id="config-principles-title">Governance and Safety Rules</h2>
            <p>Core rules that keep lookups and platform configuration safe and consistent.</p>
          </div>
          <div className="admin-rule-grid">
            <div className="admin-rule-card">
              <span aria-hidden="true">OK</span>
              <p>Active/inactive flags are toggled to deactivate options safely, preventing historical record corruption.</p>
            </div>
            <div className="admin-rule-card">
              <span aria-hidden="true">OK</span>
              <p>Standard system constraints (80% certificate eligibility score, KSME routing checks) cannot be modified.</p>
            </div>
            <div className="admin-rule-card">
              <span aria-hidden="true">OK</span>
              <p>System-locked records are protected against administrative modification to maintain system integrity.</p>
            </div>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

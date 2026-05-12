import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  getAdminCertificateOverview,
  type AdminCertificateRecord,
} from "@/lib/admin/certificates";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getCertificateStatusEventLabel,
  getCertificateStatusLabel,
} from "@/lib/learner/certificate-status";
import { formatCertificateDate } from "@/lib/learner/certificates";
import { FINAL_TEST_PASS_SCORE } from "@/lib/learner/final-test";

import {
  reactivateCertificateAction,
  revokeCertificateAction,
} from "./actions";

type AdminCertificatesPageProps = {
  searchParams?: Promise<{
    error?: string;
    reactivated?: string;
    revoked?: string;
    q?: string;
    status?: "ACTIVE" | "REVOKED";
    courseId?: string;
  }>;
};

export default async function AdminCertificatesPage({
  searchParams,
}: AdminCertificatesPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/admin/certificates");

  const statusFilter =
    resolvedSearchParams?.status === "ACTIVE" ||
    resolvedSearchParams?.status === "REVOKED"
      ? resolvedSearchParams.status
      : undefined;

  const overview = await getAdminCertificateOverview(
    identity.user.organizationId,
    {
      query: resolvedSearchParams?.q,
      status: statusFilter,
      courseId: resolvedSearchParams?.courseId,
    },
  );

  const courses = await prisma.course.findMany({
    where: { organizationId: identity.user.organizationId },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Certificate Oversight">
      <div className="admin-dashboard">
        <section className="admin-hero" aria-labelledby="certificate-title">
          <div>
            <h2 id="certificate-title">Certificate registry</h2>
            <p>
              Review issued DEC learning certificates, status history, and
              Admin reasons for revoke or reactivate decisions.
            </p>
          </div>
          <span className="status-badge status-badge-ready">
            {FINAL_TEST_PASS_SCORE}%+ final test rule
          </span>
        </section>

        <StatusMessage searchParams={resolvedSearchParams} />

        <section className="admin-section" aria-labelledby="certificate-rules-title">
          <div className="admin-section-heading">
            <h2 id="certificate-rules-title">Certificate rule and separation</h2>
            <p>
              Certificates are issued from the final test only: learners who
              score {FINAL_TEST_PASS_SCORE}% or above pass the course and
              receive the automated certificate where certificates are enabled.
              Practical proof, verified achievements, and badges are separate
              evidence layers and are not required for course certificates.
            </p>
          </div>
          <div className="admin-card-grid">
            <article className="admin-readiness-card">
              <div>
                <h3>Course certificate</h3>
                <span className="status-badge status-badge-ready">Final test</span>
              </div>
              <p>Based only on the {FINAL_TEST_PASS_SCORE}%+ final test rule.</p>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Practical proof and badges</h3>
                <span className="status-badge">Separate</span>
              </div>
              <p>Reviewed and monitored separately from the certificate registry.</p>
              <Link className="workspace-link secondary" href="/admin/proof-badges">
                Open proof and badges overview
              </Link>
            </article>
            <article className="admin-readiness-card">
              <div>
                <h3>Audit trail</h3>
                <span className="status-badge status-badge-published">Required reasons</span>
              </div>
              <p>Revoke and reactivate actions require a visible Admin reason.</p>
              <Link className="workspace-link secondary" href="/admin/audit-log">
                Open audit log
              </Link>
            </article>
          </div>
        </section>

        <section className="admin-section" aria-labelledby="certificate-summary-title">
          <div className="admin-section-heading">
            <h2 id="certificate-summary-title">Certificate summary</h2>
            <p>Safe certificate totals for the current Admin organization scope.</p>
          </div>
          <div className="admin-metrics-grid">
            <MetricCard
              detail="Certificate records visible in this registry"
              label="Total"
              value={overview.totals.total}
            />
            <MetricCard
              detail="Currently valid certificate records"
              label="Active"
              value={overview.totals.active}
            />
            <MetricCard
              detail="Certificates revoked after Admin review"
              label="Revoked"
              value={overview.totals.revoked}
            />
          </div>
        </section>

        <section className="admin-section" aria-labelledby="certificate-list-title">
          <div className="admin-section-heading">
            <h2 id="certificate-list-title">Issued certificates</h2>
            <p>
              Certificate records show status and Admin-entered reasons without
              exposing final test attempts, answer-level data, raw proof, or
              practical proof records.
            </p>
          </div>

          <CertificateFilters
            courses={courses}
            searchParams={resolvedSearchParams || {}}
          />

          {overview.certificates.length > 0 ? (
            <div className="course-list course-list-spacious">
              {overview.certificates.map((certificate) => (
                <CertificateCard
                  certificate={certificate}
                  key={certificate.id}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No certificates issued yet</h2>
              <p>
                Certificate records will appear here after learners score{" "}
                {FINAL_TEST_PASS_SCORE}% or above on the final test for a
                certificate-enabled course. Optional proof or badges will not
                create certificate records.
              </p>
            </div>
          )}
        </section>

        <nav className="workspace-nav" aria-label="Certificate oversight links">
          <Link className="workspace-link primary" href="/admin">
            Admin home
          </Link>
          <Link className="workspace-link" href="/admin/proof-badges">
            Proof and badges overview
          </Link>
          <Link className="workspace-link" href="/admin/audit-log">
            Audit log
          </Link>
        </nav>
      </div>
    </WorkspaceShell>
  );
}

function CertificateCard({
  certificate,
}: {
  certificate: AdminCertificateRecord;
}) {
  const isRevoked = Boolean(certificate.revokedAt);

  return (
    <article className="course-row">
      <div>
        <div className="studio-course-card-heading">
          <div>
            <p className="block-kicker">{certificate.organizationName}</p>
            <h2>{certificate.courseTitle}</h2>
            <p>
              {certificate.certificateNumber} · Version{" "}
              {certificate.courseVersionNumber}
            </p>
          </div>
          <span
            className={`status-badge ${
              isRevoked ? "status-badge-blocked" : "status-badge-ready"
            }`}
          >
            {getCertificateStatusLabel(certificate)}
          </span>
        </div>

        <div className="context-grid">
          <article>
            <strong>Learner</strong>
            <span>{certificate.learnerName}</span>
          </article>
          <article>
            <strong>Email</strong>
            <span>{certificate.learnerEmail}</span>
          </article>
          <article>
            <strong>Organization</strong>
            <span>{certificate.organizationName}</span>
          </article>
          <article>
            <strong>Issued</strong>
            <span>{formatCertificateDate(certificate.issuedAt)}</span>
          </article>
          <article>
            <strong>Certificate basis</strong>
            <span>{FINAL_TEST_PASS_SCORE}%+ final test rule</span>
          </article>
          <article>
            <strong>Proof relationship</strong>
            <span>Separate from proof, achievements, and badges</span>
          </article>
        </div>

        <CertificateStatusHistory certificate={certificate} />
      </div>
      <div className="course-row-actions">
        <Link
          href={`/verify?certificate=${encodeURIComponent(
            certificate.certificateNumber,
          )}`}
        >
          Verify
        </Link>
        <Link href={`/learn/courses/${certificate.courseId}`}>
          View course
        </Link>
        {isRevoked ? (
          <form
            action={reactivateCertificateAction.bind(
              null,
              certificate.certificateNumber,
            )}
            className="inline-status-form"
          >
            <label>
              <span>Reason for reactivation</span>
              <textarea
                name="note"
                placeholder="Explain why this certificate should be reactivated."
                required
                minLength={5}
                rows={3}
              />
            </label>
            <button className="workspace-button" type="submit">
              Reactivate
            </button>
          </form>
        ) : (
          <form
            action={revokeCertificateAction.bind(
              null,
              certificate.certificateNumber,
            )}
            className="inline-status-form"
          >
            <label>
              <span>Reason for revocation</span>
              <textarea
                name="note"
                placeholder="Explain why this certificate should be revoked."
                required
                minLength={5}
                rows={3}
              />
            </label>
            <button className="workspace-button" type="submit">
              Revoke
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

function CertificateStatusHistory({
  certificate,
}: {
  certificate: AdminCertificateRecord;
}) {
  return (
    <section
      className="certificate-history"
      aria-label={`Status history for ${certificate.certificateNumber}`}
    >
      <h3>Certificate status history and reasons</h3>
      {certificate.statusEvents.length > 0 ? (
        <ul>
          {certificate.statusEvents.map((event) => (
            <li key={event.id}>
              {getCertificateStatusEventLabel(event.eventType)} ·{" "}
              {formatCertificateDate(event.createdAt)}
              {event.actorName ? ` · ${event.actorName}` : ""}
              {event.note ? ` · Reason: ${event.note}` : " · No reason recorded"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="workspace-note">
          No certificate status history has been recorded yet.
        </p>
      )}
    </section>
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

function StatusMessage({
  searchParams,
}: {
  searchParams:
    | {
        error?: string;
        reactivated?: string;
        revoked?: string;
      }
    | undefined;
}) {
  if (searchParams?.error) {
    return (
      <section className="admin-section" aria-label="Certificate action message">
        <span className="status-badge status-badge-blocked">Action needed</span>
        <p>{searchParams.error}</p>
      </section>
    );
  }

  if (searchParams?.revoked === "1") {
    return (
      <section className="admin-section" aria-label="Certificate action message">
        <span className="status-badge status-badge-ready">Updated</span>
        <p>Certificate revoked and recorded in the Admin audit log.</p>
      </section>
    );
  }

  if (searchParams?.reactivated === "1") {
    return (
      <section className="admin-section" aria-label="Certificate action message">
        <span className="status-badge status-badge-ready">Updated</span>
        <p>Certificate reactivated and recorded in the Admin audit log.</p>
      </section>
    );
  }

  return null;
}

function CertificateFilters({
  courses,
  searchParams,
}: {
  courses: { id: string; title: string }[];
  searchParams: { q?: string; status?: string; courseId?: string };
}) {
  const exportParams = new URLSearchParams();
  if (searchParams.q) exportParams.set("q", searchParams.q);
  if (searchParams.status) exportParams.set("status", searchParams.status);
  if (searchParams.courseId) exportParams.set("courseId", searchParams.courseId);

  return (
    <div className="admin-filters">
      <form method="GET" className="admin-filters-form">
        <label>
          <span className="visually-hidden">Search</span>
          <input
            type="search"
            name="q"
            placeholder="Search by learner name, email, or cert number..."
            defaultValue={searchParams.q || ""}
            className="filter-input"
          />
        </label>

        <label>
          <span className="visually-hidden">Status</span>
          <select
            name="status"
            defaultValue={searchParams.status || ""}
            className="filter-select"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </label>

        <label>
          <span className="visually-hidden">Course</span>
          <select
            name="courseId"
            defaultValue={searchParams.courseId || ""}
            className="filter-select"
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="workspace-button">
          Filter
        </button>

        {(searchParams.q || searchParams.status || searchParams.courseId) && (
          <Link href="/admin/certificates" className="workspace-button secondary">
            Clear
          </Link>
        )}
      </form>

      <div className="admin-filters-actions">
        <Link
          href={`/admin/certificates/export?${exportParams.toString()}`}
          className="workspace-link secondary"
        >
          Export CSV
        </Link>
      </div>
    </div>
  );
}

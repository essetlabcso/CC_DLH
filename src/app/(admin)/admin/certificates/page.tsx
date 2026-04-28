import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  getCertificateStatusEventLabel,
  getCertificateStatusLabel,
} from "@/lib/learner/certificate-status";
import { formatCertificateDate } from "@/lib/learner/certificates";

import {
  reactivateCertificateAction,
  revokeCertificateAction,
} from "./actions";

type AdminCertificatesPageProps = {
  searchParams?: Promise<{
    reactivated?: string;
    revoked?: string;
  }>;
};

export default async function AdminCertificatesPage({
  searchParams,
}: AdminCertificatesPageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/admin/certificates");
  const certificates = await prisma.learnerCertificate.findMany({
    where: {
      courseVersion: {
        course: {
          organizationId: identity.user.organizationId,
        },
      },
    },
    include: {
      user: true,
      courseVersion: {
        include: {
          course: true,
        },
      },
      statusEvents: {
        include: {
          actor: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Admin" title="Certificate oversight">
      <p>
        Review issued DEC learning certificates and their learner, course, and
        version records.
      </p>
      {resolvedSearchParams?.revoked === "1" ? (
        <p className="workspace-note">Certificate revoked.</p>
      ) : null}
      {resolvedSearchParams?.reactivated === "1" ? (
        <p className="workspace-note">Certificate reactivated.</p>
      ) : null}

      {certificates.length > 0 ? (
        <div className="course-list course-list-spacious">
          {certificates.map((certificate) => (
            <article className="course-row" key={certificate.id}>
              <div>
                <h2>{certificate.courseVersion.course.title}</h2>
                <p>
                  {certificate.certificateNumber} ·{" "}
                  {getCertificateStatusLabel(certificate)} · Version{" "}
                  {certificate.courseVersion.versionNumber}
                </p>
                <div className="context-grid">
                  <article>
                    <strong>Learner</strong>
                    <span>{certificate.user.name}</span>
                  </article>
                  <article>
                    <strong>Email</strong>
                    <span>{certificate.user.email}</span>
                  </article>
                  <article>
                    <strong>Issued</strong>
                    <span>{formatCertificateDate(certificate.issuedAt)}</span>
                  </article>
                  <article>
                    <strong>Status</strong>
                    <span>
                      {getCertificateStatusLabel(certificate)}
                    </span>
                  </article>
                </div>
                <section
                  className="certificate-history"
                  aria-label={`Status history for ${certificate.certificateNumber}`}
                >
                  <h3>Status history</h3>
                  <ul>
                    {certificate.statusEvents.map((event) => (
                      <li key={event.id}>
                        {getCertificateStatusEventLabel(event.eventType)} ·{" "}
                        {formatCertificateDate(event.createdAt)}
                        {event.actor ? ` · ${event.actor.name}` : ""}
                        {event.note ? ` · ${event.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <div className="course-row-actions">
                <Link
                  href={`/verify?certificate=${encodeURIComponent(
                    certificate.certificateNumber,
                  )}`}
                >
                  Verify
                </Link>
                <Link href={`/learn/courses/${certificate.courseVersion.course.id}`}>
                  View course
                </Link>
                {certificate.revokedAt ? (
                  <form
                    action={reactivateCertificateAction.bind(
                      null,
                      certificate.certificateNumber,
                    )}
                    className="inline-status-form"
                  >
                    <input
                      aria-label="Reactivation note"
                      name="note"
                      value="Certificate reactivated after admin review."
                      type="hidden"
                    />
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
                    <input
                      aria-label="Revocation note"
                      name="note"
                      value="Certificate revoked after admin review."
                      type="hidden"
                    />
                    <button className="workspace-button" type="submit">
                      Revoke
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No certificates issued yet</h2>
          <p>
            Certificate records will appear here after learners complete
            certificate-ready courses.
          </p>
        </div>
      )}

      <nav className="workspace-nav" aria-label="Certificate oversight actions">
        <Link className="workspace-link primary" href="/admin">
          Admin home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

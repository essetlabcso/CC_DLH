import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { prisma } from "@/lib/db/client";
import {
  getCertificateStatusEventLabel,
  getCertificateStatusLabel,
  getCertificateVerificationLabel,
} from "@/lib/learner/certificate-status";
import { formatCertificateDate } from "@/lib/learner/certificates";

type VerifyCertificatePageProps = {
  searchParams?: Promise<{
    certificate?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function VerifyCertificatePage({
  searchParams,
}: VerifyCertificatePageProps) {
  const resolvedSearchParams = await searchParams;
  const certificateNumber = resolvedSearchParams?.certificate?.trim() || "";
  const certificate = certificateNumber
    ? await prisma.learnerCertificate.findUnique({
        where: {
          certificateNumber,
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
      })
    : null;

  return (
    <WorkspaceShell eyebrow="Certificate Verification" title="Verify certificate">
      <p>
        Confirm an issued DEC Learning Hub certificate by entering its
        certificate ID.
      </p>

      <form action="/verify" className="workspace-form" method="get">
        <label className="workspace-label" htmlFor="certificate">
          Certificate ID
        </label>
        <input
          className="workspace-select"
          defaultValue={certificateNumber}
          id="certificate"
          name="certificate"
        />
        <button className="workspace-button" type="submit">
          Verify
        </button>
      </form>

      {certificateNumber && certificate ? (
        <section className="studio-section" aria-labelledby="valid-certificate">
          <h2 id="valid-certificate">
            {getCertificateVerificationLabel(certificate)}
          </h2>
          <div className="context-grid">
            <article>
              <strong>Certificate ID</strong>
              <span>{certificate.certificateNumber}</span>
            </article>
            <article>
              <strong>Learner</strong>
              <span>{certificate.user.name}</span>
            </article>
            <article>
              <strong>Course</strong>
              <span>{certificate.courseVersion.course.title}</span>
            </article>
            <article>
              <strong>Status</strong>
              <span>{getCertificateStatusLabel(certificate)}</span>
            </article>
          </div>
          <section className="certificate-history" aria-label="Certificate status history">
            <h3>Status history</h3>
            <ul>
              {certificate.statusEvents.map((event) => (
                <li key={event.id}>
                  {getCertificateStatusEventLabel(event.eventType)} ·{" "}
                  {formatCertificateDate(event.createdAt)}
                  {event.note ? ` · ${event.note}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </section>
      ) : null}

      {certificateNumber && !certificate ? (
        <section className="studio-section empty-state" aria-label="Certificate result">
          <h2>Certificate not verified</h2>
          <p>
            No active certificate was found for the certificate ID entered.
          </p>
        </section>
      ) : null}

      <nav className="workspace-nav" aria-label="Verification actions">
        <Link className="workspace-link primary" href="/courses">
          Explore courses
        </Link>
        <Link className="workspace-link" href="/">
          Home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

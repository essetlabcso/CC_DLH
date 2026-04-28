import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintCertificateButton } from "@/components/certificates/PrintCertificateButton";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { formatCertificateDate } from "@/lib/learner/certificates";

type LearnerCertificateDetailPageProps = {
  params?: Promise<{
    certificateNumber?: string;
  }>;
};

export default async function LearnerCertificateDetailPage({
  params,
}: LearnerCertificateDetailPageProps) {
  const resolvedParams = await params;
  const certificateNumber = resolvedParams?.certificateNumber;

  if (!certificateNumber) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/learn/certificates/${certificateNumber}`,
  );
  const certificate = await prisma.learnerCertificate.findFirst({
    where: {
      certificateNumber,
      userId: identity.user.id,
      revokedAt: null,
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
          setup: true,
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Certificate" title="Certificate of completion">
      <section className="certificate-sheet" aria-labelledby="certificate-title">
        <p className="certificate-kicker">DEC Learning Hub</p>
        <h2 id="certificate-title">Certificate of completion</h2>
        <p className="certificate-awarded">Awarded to</p>
        <p className="certificate-learner">{certificate.user.name}</p>
        <p>
          For completing{" "}
          <strong>{certificate.courseVersion.course.title}</strong>
        </p>
        <div className="context-grid">
          <article>
            <strong>Certificate ID</strong>
            <span>{certificate.certificateNumber}</span>
          </article>
          <article>
            <strong>Issued</strong>
            <span>{formatCertificateDate(certificate.issuedAt)}</span>
          </article>
          <article>
            <strong>Course version</strong>
            <span>Version {certificate.courseVersion.versionNumber}</span>
          </article>
          <article>
            <strong>Status</strong>
            <span>Active</span>
          </article>
        </div>
      </section>

      <nav className="workspace-nav print-hidden" aria-label="Certificate actions">
        <PrintCertificateButton />
        <Link
          className="workspace-link primary"
          href={`/verify?certificate=${encodeURIComponent(
            certificate.certificateNumber,
          )}`}
        >
          Verify certificate
        </Link>
        <Link className="workspace-link" href="/learn/certificates">
          My certificates
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

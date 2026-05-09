"use server";

import { CertificateStatusEventType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { parseRequiredCertificateAdminReason } from "@/lib/learner/certificate-status";

export async function revokeCertificateAction(
  certificateNumber: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/certificates");
  const parsedReason = parseRequiredCertificateAdminReason(formData);

  if (!parsedReason.ok) {
    redirect(
      `/admin/certificates?error=${encodeURIComponent(parsedReason.message)}`,
    );
  }

  const certificate = await prisma.learnerCertificate.findFirst({
    where: {
      certificateNumber,
      courseVersion: {
        course: {
          organizationId: identity.user.organizationId,
        },
      },
    },
    select: {
      certificateNumber: true,
      courseVersionId: true,
      id: true,
      revokedAt: true,
      userId: true,
    },
  });

  if (!certificate) {
    notFound();
  }

  if (!certificate.revokedAt) {
    const revokedAt = new Date();
    const reason = parsedReason.reason;

    await prisma.$transaction(async (tx) => {
      await tx.learnerCertificate.update({
        where: {
          id: certificate.id,
        },
        data: {
          revokedAt,
          statusEvents: {
            create: {
              actorId: identity.user.id,
              eventType: CertificateStatusEventType.REVOKED,
              note: reason,
              createdAt: revokedAt,
            },
          },
        },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "CERTIFICATE_REVOKED",
          actorId: identity.user.id,
          beforeJson: JSON.stringify(toCertificateAuditSnapshot(certificate)),
          afterJson: JSON.stringify({
            ...toCertificateAuditSnapshot(certificate),
            revokedAt: revokedAt.toISOString(),
          }),
          entityId: certificate.id,
          entityType: "LearnerCertificate",
          reason,
          riskLevel: "HIGH",
        },
      });
    });
  }

  revalidateCertificatePaths(certificateNumber);
  redirect("/admin/certificates?revoked=1");
}

export async function reactivateCertificateAction(
  certificateNumber: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/certificates");
  const parsedReason = parseRequiredCertificateAdminReason(formData);

  if (!parsedReason.ok) {
    redirect(
      `/admin/certificates?error=${encodeURIComponent(parsedReason.message)}`,
    );
  }

  const certificate = await prisma.learnerCertificate.findFirst({
    where: {
      certificateNumber,
      courseVersion: {
        course: {
          organizationId: identity.user.organizationId,
        },
      },
    },
    select: {
      certificateNumber: true,
      courseVersionId: true,
      id: true,
      revokedAt: true,
      userId: true,
    },
  });

  if (!certificate) {
    notFound();
  }

  if (certificate.revokedAt) {
    const reason = parsedReason.reason;

    await prisma.$transaction(async (tx) => {
      await tx.learnerCertificate.update({
        where: {
          id: certificate.id,
        },
        data: {
          revokedAt: null,
          statusEvents: {
            create: {
              actorId: identity.user.id,
              eventType: CertificateStatusEventType.REACTIVATED,
              note: reason,
            },
          },
        },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "CERTIFICATE_REACTIVATED",
          actorId: identity.user.id,
          beforeJson: JSON.stringify(toCertificateAuditSnapshot(certificate)),
          afterJson: JSON.stringify({
            ...toCertificateAuditSnapshot(certificate),
            revokedAt: null,
          }),
          entityId: certificate.id,
          entityType: "LearnerCertificate",
          reason,
          riskLevel: "HIGH",
        },
      });
    });
  }

  revalidateCertificatePaths(certificateNumber);
  redirect("/admin/certificates?reactivated=1");
}

function revalidateCertificatePaths(certificateNumber: string) {
  revalidatePath("/admin/certificates");
  revalidatePath("/admin/audit-log");
  revalidatePath("/learn/certificates");
  revalidatePath(`/learn/certificates/${certificateNumber}`);
  revalidatePath(`/verify?certificate=${encodeURIComponent(certificateNumber)}`);
}

function toCertificateAuditSnapshot(certificate: {
  certificateNumber: string;
  courseVersionId: string;
  id: string;
  revokedAt: Date | null;
  userId: string;
}) {
  return {
    certificateNumber: certificate.certificateNumber,
    courseVersionId: certificate.courseVersionId,
    id: certificate.id,
    revokedAt: certificate.revokedAt?.toISOString() ?? null,
    userId: certificate.userId,
  };
}

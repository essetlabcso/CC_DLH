"use server";

import { CertificateStatusEventType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { parseCertificateAdminNote } from "@/lib/learner/certificate-status";

export async function revokeCertificateAction(
  certificateNumber: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/certificates");
  const note = parseCertificateAdminNote(formData);
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
      id: true,
      revokedAt: true,
    },
  });

  if (!certificate) {
    notFound();
  }

  if (!certificate.revokedAt) {
    const revokedAt = new Date();

    await prisma.learnerCertificate.update({
      where: {
        id: certificate.id,
      },
      data: {
        revokedAt,
        statusEvents: {
          create: {
            actorId: identity.user.id,
            eventType: CertificateStatusEventType.REVOKED,
            note: note || "Certificate revoked by admin.",
            createdAt: revokedAt,
          },
        },
      },
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
  const note = parseCertificateAdminNote(formData);
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
      id: true,
      revokedAt: true,
    },
  });

  if (!certificate) {
    notFound();
  }

  if (certificate.revokedAt) {
    await prisma.learnerCertificate.update({
      where: {
        id: certificate.id,
      },
      data: {
        revokedAt: null,
        statusEvents: {
          create: {
            actorId: identity.user.id,
            eventType: CertificateStatusEventType.REACTIVATED,
            note: note || "Certificate reactivated by admin.",
          },
        },
      },
    });
  }

  revalidateCertificatePaths(certificateNumber);
  redirect("/admin/certificates?reactivated=1");
}

function revalidateCertificatePaths(certificateNumber: string) {
  revalidatePath("/admin/certificates");
  revalidatePath("/learn/certificates");
  revalidatePath(`/learn/certificates/${certificateNumber}`);
  revalidatePath(`/verify?certificate=${encodeURIComponent(certificateNumber)}`);
}

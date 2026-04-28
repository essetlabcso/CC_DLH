import { CertificateStatusEventType } from "@prisma/client";

export function getCertificateStatusLabel(certificate: {
  revokedAt: Date | null;
}) {
  return certificate.revokedAt ? "Revoked" : "Active";
}

export function getCertificateVerificationLabel(certificate: {
  revokedAt: Date | null;
}) {
  return certificate.revokedAt
    ? "Certificate revoked"
    : "Certificate verified";
}

export function getCertificateStatusEventLabel(
  eventType: CertificateStatusEventType,
) {
  switch (eventType) {
    case CertificateStatusEventType.ISSUED:
      return "Issued";
    case CertificateStatusEventType.REVOKED:
      return "Revoked";
    case CertificateStatusEventType.REACTIVATED:
      return "Reactivated";
  }
}

export function parseCertificateAdminNote(formData: FormData) {
  const value = formData.get("note");

  return typeof value === "string" ? value.trim() : "";
}

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

export type CertificateAdminReasonResult =
  | {
      ok: true;
      reason: string;
    }
  | {
      ok: false;
      message: string;
    };

export function parseCertificateAdminNote(
  formData: FormData,
  fieldName = "note",
) {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value.trim() : "";
}

export function parseRequiredCertificateAdminReason(
  formData: FormData,
  fieldName = "note",
): CertificateAdminReasonResult {
  const reason = parseCertificateAdminNote(formData, fieldName);

  if (reason.length < 5) {
    return {
      ok: false,
      message: "Enter a certificate status reason of at least 5 characters.",
    };
  }

  return {
    ok: true,
    reason,
  };
}

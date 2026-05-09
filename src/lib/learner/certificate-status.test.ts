import { CertificateStatusEventType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  getCertificateStatusEventLabel,
  getCertificateStatusLabel,
  getCertificateVerificationLabel,
  parseCertificateAdminNote,
  parseRequiredCertificateAdminReason,
} from "./certificate-status";

describe("certificate status helpers", () => {
  it("labels active and revoked certificates clearly", () => {
    expect(getCertificateStatusLabel({ revokedAt: null })).toBe("Active");
    expect(getCertificateStatusLabel({ revokedAt: new Date() })).toBe(
      "Revoked",
    );
  });

  it("uses verification wording for public certificate lookup", () => {
    expect(getCertificateVerificationLabel({ revokedAt: null })).toBe(
      "Certificate verified",
    );
    expect(getCertificateVerificationLabel({ revokedAt: new Date() })).toBe(
      "Certificate revoked",
    );
  });

  it("labels status history events", () => {
    expect(
      getCertificateStatusEventLabel(CertificateStatusEventType.ISSUED),
    ).toBe("Issued");
    expect(
      getCertificateStatusEventLabel(CertificateStatusEventType.REACTIVATED),
    ).toBe("Reactivated");
  });

  it("trims admin status notes", () => {
    const formData = new FormData();
    formData.set("note", "  Duplicate issued in error.  ");

    expect(parseCertificateAdminNote(formData)).toBe(
      "Duplicate issued in error.",
    );
  });

  it("requires visible admin reasons for certificate status changes", () => {
    const blankFormData = new FormData();
    blankFormData.set("note", "   ");

    expect(parseRequiredCertificateAdminReason(blankFormData)).toEqual({
      ok: false,
      message: "Enter a certificate status reason of at least 5 characters.",
    });

    const shortFormData = new FormData();
    shortFormData.set("note", "abcd");

    expect(parseRequiredCertificateAdminReason(shortFormData)).toEqual({
      ok: false,
      message: "Enter a certificate status reason of at least 5 characters.",
    });

    const validFormData = new FormData();
    validFormData.set("note", "  Duplicate certificate issued.  ");

    expect(parseRequiredCertificateAdminReason(validFormData)).toEqual({
      ok: true,
      reason: "Duplicate certificate issued.",
    });
  });
});

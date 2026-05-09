import { CertificateStatusEventType } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

import {
  reactivateCertificateAction,
  revokeCertificateAction,
} from "./actions";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((target: string) => {
    throw new Error(`NEXT_REDIRECT:${target}`);
  }),
}));

vi.mock("@/lib/auth/server", () => ({
  requireWorkspaceIdentity: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  prisma: {
    $transaction: vi.fn(),
    learnerCertificate: {
      findFirst: vi.fn(),
    },
  },
}));

describe("certificate admin actions", () => {
  const tx = {
    adminAuditLog: {
      create: vi.fn(),
    },
    learnerCertificate: {
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireWorkspaceIdentity).mockResolvedValue({
      session: { role: "admin" },
      user: {
        id: "admin-1",
        email: "admin@example.org",
        name: "Admin User",
        organization: { name: "DEC" },
        organizationId: "org-1",
      },
    } as never);
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
      callback(tx as never),
    );
  });

  it("rejects certificate revocation without a visible Admin reason", async () => {
    const formData = new FormData();

    await expect(
      revokeCertificateAction("DEC-CERT-123", formData),
    ).rejects.toThrow(
      "NEXT_REDIRECT:/admin/certificates?error=Enter%20a%20certificate%20status%20reason%20of%20at%20least%205%20characters.",
    );

    expect(prisma.learnerCertificate.findFirst).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("records the entered revocation reason in status history and audit log", async () => {
    const formData = new FormData();
    formData.set("note", "Duplicate certificate issued.");
    vi.mocked(prisma.learnerCertificate.findFirst).mockResolvedValue({
      certificateNumber: "DEC-CERT-123",
      courseVersionId: "version-1",
      id: "cert-1",
      revokedAt: null,
      userId: "learner-1",
    } as never);

    await expect(
      revokeCertificateAction("DEC-CERT-123", formData),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/certificates?revoked=1");

    expect(tx.learnerCertificate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          statusEvents: {
            create: expect.objectContaining({
              eventType: CertificateStatusEventType.REVOKED,
              note: "Duplicate certificate issued.",
            }),
          },
        }),
      }),
    );
    expect(tx.adminAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CERTIFICATE_REVOKED",
          reason: "Duplicate certificate issued.",
        }),
      }),
    );
  });

  it("records the entered reactivation reason in status history and audit log", async () => {
    const formData = new FormData();
    formData.set("note", "Revocation was made in error.");
    vi.mocked(prisma.learnerCertificate.findFirst).mockResolvedValue({
      certificateNumber: "DEC-CERT-123",
      courseVersionId: "version-1",
      id: "cert-1",
      revokedAt: new Date("2026-05-01T00:00:00.000Z"),
      userId: "learner-1",
    } as never);

    await expect(
      reactivateCertificateAction("DEC-CERT-123", formData),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/certificates?reactivated=1");

    expect(tx.learnerCertificate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          statusEvents: {
            create: expect.objectContaining({
              eventType: CertificateStatusEventType.REACTIVATED,
              note: "Revocation was made in error.",
            }),
          },
        }),
      }),
    );
    expect(tx.adminAuditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: "CERTIFICATE_REACTIVATED",
          reason: "Revocation was made in error.",
        }),
      }),
    );
  });
});

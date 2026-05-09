import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/db/client";

import {
  getAdminAuditLogSummary,
  normalizeAdminAuditLogFilters,
} from "./audit-log";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    adminAuditLog: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

describe("admin audit log summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes unsupported filters away", () => {
    expect(
      normalizeAdminAuditLogFilters({
        action: "UNKNOWN_ACTION",
        area: "UNKNOWN_AREA",
        dateRange: "YESTERDAY" as never,
        entityType: "UnknownEntity",
        reasonStatus: "BAD_STATUS" as never,
        riskLevel: "CRITICAL" as never,
      }),
    ).toEqual({});
  });

  it("applies supported filters to recent audit records", async () => {
    const createdAt = new Date("2026-05-08T10:00:00.000Z");
    vi.mocked(prisma.adminAuditLog.findMany)
      .mockResolvedValueOnce([
        {
          action: "CERTIFICATE_REVOKED",
          actor: { email: "admin@example.org", name: "Admin User" },
          actorId: "user_1",
          afterJson: "{}",
          beforeJson: "{}",
          createdAt,
          entityId: "cert_1",
          entityType: "LearnerCertificate",
          id: "audit_1",
          metadata: "{}",
          reason: "Incorrect learner record.",
          riskLevel: "HIGH",
        },
      ] as never)
      .mockResolvedValueOnce([
        {
          action: "CERTIFICATE_REVOKED",
          actor: { email: "admin@example.org", name: "Admin User" },
          actorId: "user_1",
          afterJson: "{}",
          beforeJson: "{}",
          createdAt,
          entityId: "cert_1",
          entityType: "LearnerCertificate",
          id: "audit_1",
          metadata: "{}",
          reason: "Incorrect learner record.",
          riskLevel: "HIGH",
        },
      ] as never);
    vi.mocked(prisma.adminAuditLog.groupBy).mockResolvedValue([
      { riskLevel: "HIGH", _count: { _all: 1 } },
      { riskLevel: "MEDIUM", _count: { _all: 2 } },
    ] as never);

    const summary = await getAdminAuditLogSummary({
      action: "CERTIFICATE_REVOKED",
      actorId: "user_1",
      area: "CERTIFICATES",
      dateRange: "LAST_7_DAYS",
      entityType: "LearnerCertificate",
      reasonStatus: "WITH_REASON",
      riskLevel: "HIGH",
    });

    expect(prisma.adminAuditLog.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          action: "CERTIFICATE_REVOKED",
          actorId: "user_1",
          createdAt: {
            gte: expect.any(Date),
          },
          entityType: "LearnerCertificate",
          NOT: { reason: "" },
          riskLevel: "HIGH",
        },
      }),
    );
    expect(summary.entries).toEqual([
      {
        action: "CERTIFICATE_REVOKED",
        actionLabel: "Certificate revoked",
        actorLabel: "Admin User",
        areaLabel: "Certificates",
        createdAt,
        entityId: "cert_1",
        entityLabel: "Certificate",
        entityType: "LearnerCertificate",
        hasAfterSnapshot: true,
        hasBeforeSnapshot: true,
        id: "audit_1",
        reason: "Incorrect learner record.",
        reasonStatus: "Reason recorded",
        riskLabel: "High",
        riskLevel: "HIGH",
        snapshotLabel: "Before and after change details stored",
      },
    ]);
    expect(summary.actorOptions).toEqual([
      {
        label: "Admin User",
        value: "user_1",
      },
    ]);
    expect(summary.filters).toEqual({
      action: "CERTIFICATE_REVOKED",
      actorId: "user_1",
      area: "CERTIFICATES",
      dateRange: "LAST_7_DAYS",
      entityType: "LearnerCertificate",
      reasonStatus: "WITH_REASON",
      riskLevel: "HIGH",
    });
    expect(summary.totals).toEqual({
      highRisk: 1,
      lowRisk: 0,
      mediumRisk: 2,
      total: 3,
    });
  });

  it("can filter by action family without exposing audit payloads", async () => {
    vi.mocked(prisma.adminAuditLog.findMany)
      .mockResolvedValueOnce([] as never)
      .mockResolvedValueOnce([] as never);
    vi.mocked(prisma.adminAuditLog.groupBy).mockResolvedValue([] as never);

    await getAdminAuditLogSummary({ area: "PROOF_DATA_SAFETY" });

    expect(prisma.adminAuditLog.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          action: {
            in: [
              "EXTERNAL_VISIBILITY_REVOKED",
              "REDACTION_REQUIREMENT_RESOLVED",
              "SPECIALIST_REVIEW_RESOLVED",
            ],
          },
        },
      }),
    );
  });

  it("can filter records that are missing reasons", async () => {
    vi.mocked(prisma.adminAuditLog.findMany)
      .mockResolvedValueOnce([] as never)
      .mockResolvedValueOnce([] as never);
    vi.mocked(prisma.adminAuditLog.groupBy).mockResolvedValue([] as never);

    await getAdminAuditLogSummary({ reasonStatus: "MISSING_REASON" });

    expect(prisma.adminAuditLog.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          reason: "",
        },
      }),
    );
  });
});

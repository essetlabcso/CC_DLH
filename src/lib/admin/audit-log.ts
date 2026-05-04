import { prisma } from "@/lib/db/client";

export type AdminAuditLogEntry = {
  id: string;
  action: string;
  actorLabel: string;
  createdAt: Date;
  entityId: string;
  entityType: string;
  hasAfterSnapshot: boolean;
  hasBeforeSnapshot: boolean;
  reason: string;
  riskLevel: string;
};

export type AdminAuditLogSummary = {
  entries: AdminAuditLogEntry[];
  totals: {
    highRisk: number;
    lowRisk: number;
    mediumRisk: number;
    total: number;
  };
};

export async function getAdminAuditLogSummary(): Promise<AdminAuditLogSummary> {
  const [entries, totals] = await Promise.all([
    prisma.adminAuditLog.findMany({
      include: {
        actor: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    }),
    prisma.adminAuditLog.groupBy({
      by: ["riskLevel"],
      _count: {
        _all: true,
      },
    }),
  ]);

  const countForRisk = (riskLevel: string) =>
    totals.find((total) => isSameLabel(total.riskLevel, riskLevel))?._count
      ._all ?? 0;

  return {
    entries: entries.map((entry) => ({
      id: entry.id,
      action: formatAction(entry.action),
      actorLabel:
        entry.actor?.name ?? entry.actor?.email ?? "System or unavailable user",
      createdAt: entry.createdAt,
      entityId: entry.entityId,
      entityType: entry.entityType,
      hasAfterSnapshot: entry.afterJson.trim().length > 0,
      hasBeforeSnapshot: entry.beforeJson.trim().length > 0,
      reason: entry.reason,
      riskLevel: formatLabel(entry.riskLevel),
    })),
    totals: {
      highRisk: countForRisk("HIGH"),
      lowRisk: countForRisk("LOW"),
      mediumRisk: countForRisk("MEDIUM"),
      total: totals.reduce((sum, total) => sum + total._count._all, 0),
    },
  };
}

function formatAction(value: string) {
  return formatLabel(value).replace("Diagnosis", "Diagnosis ");
}

function formatLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isSameLabel(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

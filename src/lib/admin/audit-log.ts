import { prisma } from "@/lib/db/client";

const auditRiskLevels = ["LOW", "MEDIUM", "HIGH"] as const;
const auditReasonStatuses = ["WITH_REASON", "MISSING_REASON"] as const;

export const adminAuditEntityFilterOptions = [
  "User",
  "Organization",
  "OrganizationMembership",
  "AdminLookupCategory",
  "AdminLookupValue",
  "DiagnosisDataset",
  "DiagnosisRecord",
  "CourseVersion",
  "LearnerCertificate",
  "PracticalProofSubmission",
  "VerifiedAchievement",
] as const;

export const adminAuditActionFilterOptions = [
  "USER_ROLES_UPDATED",
  "USER_INVITED",
  "MEMBERSHIP_ADDED",
  "MEMBERSHIP_UPDATED",
  "ORGANIZATION_CREATED",
  "ORGANIZATION_UPDATED",
  "LOOKUP_CATEGORY_CREATED",
  "LOOKUP_CATEGORY_UPDATED",
  "LOOKUP_VALUE_CREATED",
  "LOOKUP_VALUE_UPDATED",
  "COURSE_VERSION_RETURNED",
  "COURSE_VERSION_PAUSED",
  "COURSE_VERSION_SPECIALIST_REVIEW_REQUIRED",
  "COURSE_VERSION_PUBLISHED",
  "COURSE_REVISION_REQUESTED",
  "CERTIFICATE_REVOKED",
  "CERTIFICATE_REACTIVATED",
  "SPECIALIST_REVIEW_RESOLVED",
  "REDACTION_REQUIREMENT_RESOLVED",
  "EXTERNAL_VISIBILITY_REVOKED",
] as const;

export type AdminAuditLogFilters = {
  action?: string;
  entityType?: string;
  reasonStatus?: string;
  riskLevel?: string;
};

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
  filters: AdminAuditLogFilters;
  totals: {
    highRisk: number;
    lowRisk: number;
    mediumRisk: number;
    total: number;
  };
};

export async function getAdminAuditLogSummary(
  filters: AdminAuditLogFilters = {},
): Promise<AdminAuditLogSummary> {
  const normalizedFilters = normalizeAdminAuditLogFilters(filters);
  const where = buildAuditLogWhere(normalizedFilters);
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
      where,
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
    filters: normalizedFilters,
    totals: {
      highRisk: countForRisk("HIGH"),
      lowRisk: countForRisk("LOW"),
      mediumRisk: countForRisk("MEDIUM"),
      total: totals.reduce((sum, total) => sum + total._count._all, 0),
    },
  };
}

export function normalizeAdminAuditLogFilters(
  filters: AdminAuditLogFilters,
): AdminAuditLogFilters {
  const riskLevel = filters.riskLevel?.trim().toUpperCase();
  const reasonStatus = filters.reasonStatus?.trim().toUpperCase();
  const entityType = filters.entityType?.trim();
  const action = filters.action?.trim().toUpperCase();

  return {
    action: adminAuditActionFilterOptions.includes(
      action as (typeof adminAuditActionFilterOptions)[number],
    )
      ? action
      : undefined,
    entityType: adminAuditEntityFilterOptions.includes(
      entityType as (typeof adminAuditEntityFilterOptions)[number],
    )
      ? entityType
      : undefined,
    reasonStatus: auditReasonStatuses.includes(
      reasonStatus as (typeof auditReasonStatuses)[number],
    )
      ? (reasonStatus as (typeof auditReasonStatuses)[number])
      : undefined,
    riskLevel: auditRiskLevels.includes(
      riskLevel as (typeof auditRiskLevels)[number],
    )
      ? (riskLevel as (typeof auditRiskLevels)[number])
      : undefined,
  };
}

export function formatAdminAuditFilterLabel(value: string) {
  return formatAction(value);
}

function buildAuditLogWhere(filters: AdminAuditLogFilters) {
  const where: {
    action?: string;
    entityType?: string;
    NOT?: { reason: string };
    reason?: string;
    riskLevel?: string;
  } = {};

  if (filters.riskLevel) {
    where.riskLevel = filters.riskLevel;
  }

  if (filters.entityType) {
    where.entityType = filters.entityType;
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.reasonStatus === "WITH_REASON") {
    where.NOT = { reason: "" };
  } else if (filters.reasonStatus === "MISSING_REASON") {
    where.reason = "";
  }

  return where;
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

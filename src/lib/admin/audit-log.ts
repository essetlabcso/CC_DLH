import { prisma } from "@/lib/db/client";

const auditRiskLevels = ["LOW", "MEDIUM", "HIGH"] as const;
const auditReasonStatuses = ["WITH_REASON", "MISSING_REASON"] as const;
const auditDateRanges = ["LAST_7_DAYS", "LAST_30_DAYS"] as const;

export const adminAuditAreaFilterOptions = [
  { label: "People and roles", value: "PEOPLE_ROLES" },
  { label: "Organizations", value: "ORGANIZATIONS" },
  { label: "Reference data", value: "REFERENCE_DATA" },
  { label: "Evidence sources", value: "EVIDENCE_SOURCES" },
  { label: "Validated capacity gaps", value: "VALIDATED_CAPACITY_GAPS" },
  { label: "Courses and workflow", value: "COURSES_WORKFLOW" },
  { label: "Certificates", value: "CERTIFICATES" },
  { label: "Proof and data safety", value: "PROOF_DATA_SAFETY" },
] as const;

const adminAuditEntityMetadata = {
  AdminLookupCategory: "Reference category",
  AdminLookupValue: "Reference value",
  CourseVersion: "Course version",
  DiagnosisDataset: "Evidence source package",
  DiagnosisRecord: "Validated capacity gap",
  LearnerCertificate: "Certificate",
  Organization: "Organization",
  OrganizationMembership: "Organization membership",
  PracticalProofSubmission: "Practical proof submission",
  User: "User account",
  VerifiedAchievement: "Verified achievement",
  LearnerEnrollment: "Learner enrollment",
  ProgramParticipant: "Program participant",
  CohortParticipant: "Cohort participant",
  ScopedRoleAssignment: "Scoped role assignment",
} as const;

const adminAuditActionMetadata = {
  CERTIFICATE_REACTIVATED: {
    area: "CERTIFICATES",
    label: "Certificate reactivated",
  },
  CERTIFICATE_REVOKED: {
    area: "CERTIFICATES",
    label: "Certificate revoked",
  },
  AUTHORITY_GRANTED: {
    area: "PEOPLE_ROLES",
    label: "Authority granted",
  },
  AUTHORITY_UPDATED: {
    area: "PEOPLE_ROLES",
    label: "Authority updated",
  },
  COURSE_REVISION_REQUESTED: {
    area: "COURSES_WORKFLOW",
    label: "Course revision requested",
  },
  COURSE_VERSION_PAUSED: {
    area: "COURSES_WORKFLOW",
    label: "Course paused",
  },
  COURSE_VERSION_PUBLISHED: {
    area: "COURSES_WORKFLOW",
    label: "Course version published",
  },
  COURSE_VERSION_RETURNED: {
    area: "COURSES_WORKFLOW",
    label: "Course returned for changes",
  },
  COURSE_VERSION_SPECIALIST_REVIEW_REQUIRED: {
    area: "COURSES_WORKFLOW",
    label: "Course sent for specialist review",
  },
  ENROLLMENT_ASSIGNED: {
    area: "PEOPLE_ROLES",
    label: "Learner assigned to course",
  },
  DIAGNOSIS_DATASET_APPROVED: {
    area: "EVIDENCE_SOURCES",
    label: "Evidence source package approved",
  },
  DIAGNOSIS_DATASET_ARCHIVED: {
    area: "EVIDENCE_SOURCES",
    label: "Evidence source package archived",
  },
  DIAGNOSIS_DATASET_CREATED: {
    area: "EVIDENCE_SOURCES",
    label: "Evidence source package created",
  },
  DIAGNOSIS_DATASET_UPDATED: {
    area: "EVIDENCE_SOURCES",
    label: "Evidence source package updated",
  },
  DIAGNOSIS_RECORD_APPROVED: {
    area: "VALIDATED_CAPACITY_GAPS",
    label: "Validated capacity gap approved",
  },
  DIAGNOSIS_RECORD_CREATED: {
    area: "VALIDATED_CAPACITY_GAPS",
    label: "Validated capacity gap created",
  },
  DIAGNOSIS_RECORD_LOCKED_FOR_COURSE_SETUP: {
    area: "VALIDATED_CAPACITY_GAPS",
    label: "Validated capacity gap released for course setup",
  },
  DIAGNOSIS_RECORD_UPDATED: {
    area: "VALIDATED_CAPACITY_GAPS",
    label: "Validated capacity gap updated",
  },
  EXTERNAL_VISIBILITY_REVOKED: {
    area: "PROOF_DATA_SAFETY",
    label: "External visibility revoked",
  },
  LOOKUP_CATEGORY_CREATED: {
    area: "REFERENCE_DATA",
    label: "Reference category created",
  },
  LOOKUP_CATEGORY_UPDATED: {
    area: "REFERENCE_DATA",
    label: "Reference category updated",
  },
  LOOKUP_VALUE_CREATED: {
    area: "REFERENCE_DATA",
    label: "Reference value created",
  },
  LOOKUP_VALUE_UPDATED: {
    area: "REFERENCE_DATA",
    label: "Reference value updated",
  },
  MEMBERSHIP_ADDED: {
    area: "ORGANIZATIONS",
    label: "Organization member added",
  },
  MEMBERSHIP_UPDATED: {
    area: "ORGANIZATIONS",
    label: "Organization membership updated",
  },
  ORGANIZATION_CREATED: {
    area: "ORGANIZATIONS",
    label: "Organization created",
  },
  ORGANIZATION_UPDATED: {
    area: "ORGANIZATIONS",
    label: "Organization updated",
  },
  PARTICIPANT_ASSIGNED_TO_PROGRAM: {
    area: "PEOPLE_ROLES",
    label: "Learner assigned to program",
  },
  PARTICIPANT_ASSIGNED_TO_COHORT: {
    area: "PEOPLE_ROLES",
    label: "Learner assigned to cohort",
  },
  PARTICIPANT_STATUS_UPDATED: {
    area: "PEOPLE_ROLES",
    label: "Participant status updated",
  },
  REDACTION_REQUIREMENT_RESOLVED: {
    area: "PROOF_DATA_SAFETY",
    label: "Redaction requirement resolved",
  },
  SPECIALIST_REVIEW_RESOLVED: {
    area: "PROOF_DATA_SAFETY",
    label: "Specialist review resolved",
  },
  USER_INVITED: {
    area: "PEOPLE_ROLES",
    label: "User invited",
  },
  USER_ROLES_UPDATED: {
    area: "PEOPLE_ROLES",
    label: "User roles updated",
  },
} as const;

type AdminAuditAreaValue = (typeof adminAuditAreaFilterOptions)[number]["value"];
type AdminAuditActionValue = keyof typeof adminAuditActionMetadata;
type AdminAuditDateRange = (typeof auditDateRanges)[number];
type AdminAuditReasonStatus = (typeof auditReasonStatuses)[number];
type AdminAuditRiskLevel = (typeof auditRiskLevels)[number];

export const adminAuditEntityFilterOptions = Object.entries(
  adminAuditEntityMetadata,
).map(([value, label]) => ({ label, value }));

export const adminAuditActionFilterOptions = Object.entries(
  adminAuditActionMetadata,
).map(([value, metadata]) => ({
  area: metadata.area,
  label: metadata.label,
  value,
}));

export type AdminAuditActorFilterOption = {
  label: string;
  value: string;
};

export type AdminAuditLogFilters = {
  action?: string;
  actorId?: string;
  area?: string;
  dateRange?: string;
  entityType?: string;
  reasonStatus?: string;
  riskLevel?: string;
};

export type AdminAuditLogEntry = {
  action: string;
  actionLabel: string;
  actorLabel: string;
  areaLabel: string;
  createdAt: Date;
  entityId: string;
  entityLabel: string;
  entityType: string;
  hasAfterSnapshot: boolean;
  hasBeforeSnapshot: boolean;
  id: string;
  reason: string;
  reasonStatus: string;
  riskLabel: string;
  riskLevel: string;
  snapshotLabel: string;
};

export type AdminAuditLogSummary = {
  actorOptions: AdminAuditActorFilterOption[];
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
  const [entries, totals, actorOptions] = await Promise.all([
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
    prisma.adminAuditLog.findMany({
      distinct: ["actorId"],
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
      where: {
        actorId: {
          not: null,
        },
      },
    }),
  ]);

  const countForRisk = (riskLevel: string) =>
    totals.find((total) => isSameLabel(total.riskLevel, riskLevel))?._count
      ._all ?? 0;

  return {
    actorOptions: actorOptions
      .map((entry) =>
        entry.actorId
          ? {
              label: getActorLabel(entry.actor),
              value: entry.actorId,
            }
          : null,
      )
      .filter((option): option is AdminAuditActorFilterOption =>
        Boolean(option),
      ),
    entries: entries.map((entry) => {
      const metadata = getAuditActionMetadata(entry.action);
      const hasBeforeSnapshot = entry.beforeJson.trim().length > 0;
      const hasAfterSnapshot = entry.afterJson.trim().length > 0;

      return {
        action: entry.action,
        actionLabel: metadata.label,
        actorLabel: getActorLabel(entry.actor),
        areaLabel: getAdminAuditAreaLabel(metadata.area),
        createdAt: entry.createdAt,
        entityId: entry.entityId,
        entityLabel: getAdminAuditEntityLabel(entry.entityType),
        entityType: entry.entityType,
        hasAfterSnapshot,
        hasBeforeSnapshot,
        id: entry.id,
        reason: entry.reason,
        reasonStatus: entry.reason.trim()
          ? "Reason recorded"
          : "No reason recorded",
        riskLabel: formatAdminAuditRiskLabel(entry.riskLevel),
        riskLevel: entry.riskLevel.toUpperCase(),
        snapshotLabel: getSnapshotLabel(hasBeforeSnapshot, hasAfterSnapshot),
      };
    }),
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
  const action = filters.action?.trim().toUpperCase();
  const actorId = filters.actorId?.trim();
  const area = filters.area?.trim().toUpperCase();
  const dateRange = filters.dateRange?.trim().toUpperCase();
  const entityType = filters.entityType?.trim();
  const reasonStatus = filters.reasonStatus?.trim().toUpperCase();
  const riskLevel = filters.riskLevel?.trim().toUpperCase();

  return {
    action: isKnownAction(action) ? action : undefined,
    actorId: actorId || undefined,
    area: isKnownArea(area) ? area : undefined,
    dateRange: auditDateRanges.includes(dateRange as AdminAuditDateRange)
      ? (dateRange as AdminAuditDateRange)
      : undefined,
    entityType: isKnownEntity(entityType) ? entityType : undefined,
    reasonStatus: auditReasonStatuses.includes(
      reasonStatus as AdminAuditReasonStatus,
    )
      ? (reasonStatus as AdminAuditReasonStatus)
      : undefined,
    riskLevel: auditRiskLevels.includes(riskLevel as AdminAuditRiskLevel)
      ? (riskLevel as AdminAuditRiskLevel)
      : undefined,
  };
}

export function formatAdminAuditFilterLabel(value: string) {
  if (isKnownAction(value)) {
    return adminAuditActionMetadata[value].label;
  }

  if (isKnownEntity(value)) {
    return adminAuditEntityMetadata[value];
  }

  return formatLabel(value);
}

function buildAuditLogWhere(filters: AdminAuditLogFilters) {
  const where: {
    action?: string | { in: string[] };
    actorId?: string;
    createdAt?: { gte: Date };
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

  if (filters.actorId) {
    where.actorId = filters.actorId;
  }

  if (filters.action) {
    where.action = filters.action;
  } else if (filters.area && isKnownArea(filters.area)) {
    where.action = {
      in: adminAuditActionFilterOptions
        .filter((option) => option.area === filters.area)
        .map((option) => option.value),
    };
  }

  if (filters.dateRange === "LAST_7_DAYS") {
    where.createdAt = getDateRangeBoundary(7);
  } else if (filters.dateRange === "LAST_30_DAYS") {
    where.createdAt = getDateRangeBoundary(30);
  }

  if (filters.reasonStatus === "WITH_REASON") {
    where.NOT = { reason: "" };
  } else if (filters.reasonStatus === "MISSING_REASON") {
    where.reason = "";
  }

  return where;
}

function getAuditActionMetadata(action: string) {
  if (isKnownAction(action)) {
    return adminAuditActionMetadata[action];
  }

  return {
    area: "COURSES_WORKFLOW" as AdminAuditAreaValue,
    label: formatLabel(action),
  };
}

function getAdminAuditAreaLabel(area: string) {
  return (
    adminAuditAreaFilterOptions.find((option) => option.value === area)?.label ??
    "Admin activity"
  );
}

function getAdminAuditEntityLabel(entityType: string) {
  return isKnownEntity(entityType)
    ? adminAuditEntityMetadata[entityType]
    : formatLabel(entityType);
}

function formatAdminAuditRiskLabel(riskLevel: string) {
  return auditRiskLevels.includes(riskLevel.toUpperCase() as AdminAuditRiskLevel)
    ? formatLabel(riskLevel)
    : "Risk not set";
}

function getActorLabel(
  actor: { email?: string | null; name?: string | null } | null,
) {
  return actor?.name ?? actor?.email ?? "System or unavailable user";
}

function getDateRangeBoundary(days: number) {
  return {
    gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
  };
}

function getSnapshotLabel(hasBeforeSnapshot: boolean, hasAfterSnapshot: boolean) {
  if (hasBeforeSnapshot && hasAfterSnapshot) {
    return "Before and after change details stored";
  }

  if (hasBeforeSnapshot) {
    return "Before change details stored";
  }

  if (hasAfterSnapshot) {
    return "After change details stored";
  }

  return "No change details stored";
}

function isKnownAction(value: string | undefined): value is AdminAuditActionValue {
  return Boolean(
    value &&
      Object.prototype.hasOwnProperty.call(adminAuditActionMetadata, value),
  );
}

function isKnownArea(value: string | undefined): value is AdminAuditAreaValue {
  return Boolean(
    value &&
      adminAuditAreaFilterOptions.some((option) => option.value === value),
  );
}

function isKnownEntity(
  value: string | undefined,
): value is keyof typeof adminAuditEntityMetadata {
  return Boolean(
    value &&
      Object.prototype.hasOwnProperty.call(adminAuditEntityMetadata, value),
  );
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

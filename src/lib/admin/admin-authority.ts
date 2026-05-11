import {
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
  UserRole,
  type MembershipStatus,
  type UserStatus,
} from "@prisma/client";

import type { DecRole } from "@/lib/access";
import { prisma } from "@/lib/db/client";

export const ADMIN_AUTHORITY_CHANGE_ERROR =
  "Only Super Admin-equivalent users can grant or change Platform Admin authority.";

export function isSuperAdminEquivalentForPhase1(role: DecRole) {
  return role === "admin";
}

export function touchesPlatformAdminAuthority(
  currentRoles: readonly UserRole[],
  nextRoles: readonly UserRole[],
) {
  return currentRoles.includes(UserRole.ADMIN) || nextRoles.includes(UserRole.ADMIN);
}

export function canChangePlatformAdminAuthority(input: {
  actorRole: DecRole;
  currentRoles: readonly UserRole[];
  nextRoles: readonly UserRole[];
}) {
  return (
    !touchesPlatformAdminAuthority(input.currentRoles, input.nextRoles) ||
    isSuperAdminEquivalentForPhase1(input.actorRole)
  );
}

export type SuperAdminEquivalentUser = {
  email: string;
  membershipId: string;
  membershipStatus: MembershipStatus;
  name: string;
  organizationName: string;
  organizationSlug: string;
  userId: string;
  userStatus: UserStatus;
};

export type ScopedPlatformAdminAuthority = {
  createdAt: Date;
  createdByLabel: string;
  email: string;
  endsAt: Date | null;
  id: string;
  name: string;
  organizationName: string;
  reason: string;
  scopeId: string;
  scopeLabel: string;
  scopeType: PermissionScopeType;
  startsAt: Date | null;
  status: ScopedRoleAssignmentStatus;
  userId: string;
  userStatus: UserStatus;
};

export type AuthorityAuditActivity = {
  actionLabel: string;
  actorLabel: string;
  createdAt: Date;
  entityId: string;
  entityLabel: string;
  id: string;
  reason: string;
  riskLevel: string;
};

export type AdminAuthorityOverview = {
  auditActivity: AuthorityAuditActivity[];
  scopedPlatformAdmins: ScopedPlatformAdminAuthority[];
  superAdminEquivalentUsers: SuperAdminEquivalentUser[];
  totals: {
    recentAuthorityEvents: number;
    scopedPlatformAdmins: number;
    superAdminEquivalentUsers: number;
  };
};

const authorityAuditActions = [
  "USER_ROLES_UPDATED",
  "USER_INVITED",
  "MEMBERSHIP_ADDED",
  "MEMBERSHIP_UPDATED",
  "AUTHORITY_GRANTED",
  "AUTHORITY_UPDATED",
] as const;

export async function getAdminAuthorityOverview(): Promise<AdminAuthorityOverview> {
  const [superAdminEquivalentUsers, scopedPlatformAdmins, auditActivity] =
    await Promise.all([
      prisma.organizationMembership.findMany({
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          organization: {
            select: {
              name: true,
              slug: true,
            },
          },
          status: true,
          user: {
            select: {
              email: true,
              id: true,
              name: true,
              status: true,
            },
          },
        },
        where: {
          roles: {
            some: {
              role: UserRole.ADMIN,
            },
          },
        },
      }),
      prisma.scopedRoleAssignment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          capacityArea: true,
          cohort: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          cohortId: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          courseId: true,
          courseVersion: {
            select: {
              id: true,
              versionNumber: true,
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
          courseVersionId: true,
          createdAt: true,
          createdBy: {
            select: {
              email: true,
              name: true,
            },
          },
          expiresAt: true,
          id: true,
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          organizationId: true,
          program: {
            select: {
              code: true,
              id: true,
              name: true,
            },
          },
          programId: true,
          proofSubmissionId: true,
          reason: true,
          roleKey: true,
          scopeId: true,
          scopeType: true,
          startsAt: true,
          status: true,
          user: {
            select: {
              email: true,
              id: true,
              name: true,
              organization: {
                select: {
                  name: true,
                },
              },
              status: true,
            },
          },
          userId: true,
        },
        where: {
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
        },
      }),
      prisma.adminAuditLog.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          action: true,
          actor: {
            select: {
              email: true,
              name: true,
            },
          },
          createdAt: true,
          entityId: true,
          entityType: true,
          id: true,
          reason: true,
          riskLevel: true,
        },
        take: 10,
        where: {
          action: {
            in: [...authorityAuditActions],
          },
        },
      }),
    ]);

  const scopedAuthorities = scopedPlatformAdmins.map((assignment) => {
    const scope = getScopedPlatformAdminScope(assignment);

    return {
      createdAt: assignment.createdAt,
      createdByLabel: getActorLabel(assignment.createdBy),
      email: assignment.user.email,
      endsAt: assignment.expiresAt,
      id: assignment.id,
      name: assignment.user.name,
      organizationName: assignment.user.organization.name,
      reason: assignment.reason,
      scopeId: scope.id,
      scopeLabel: scope.label,
      scopeType: assignment.scopeType,
      startsAt: assignment.startsAt,
      status: assignment.status,
      userId: assignment.userId,
      userStatus: assignment.user.status,
    };
  });

  const superAdmins = superAdminEquivalentUsers.map((membership) => ({
    email: membership.user.email,
    membershipId: membership.id,
    membershipStatus: membership.status,
    name: membership.user.name,
    organizationName: membership.organization.name,
    organizationSlug: membership.organization.slug,
    userId: membership.user.id,
    userStatus: membership.user.status,
  }));

  return {
    auditActivity: auditActivity.map((entry) => ({
      actionLabel: getAuthorityAuditActionLabel(entry.action),
      actorLabel: getActorLabel(entry.actor),
      createdAt: entry.createdAt,
      entityId: entry.entityId,
      entityLabel: getAuthorityAuditEntityLabel(entry.entityType),
      id: entry.id,
      reason: entry.reason,
      riskLevel: entry.riskLevel,
    })),
    scopedPlatformAdmins: scopedAuthorities,
    superAdminEquivalentUsers: superAdmins,
    totals: {
      recentAuthorityEvents: auditActivity.length,
      scopedPlatformAdmins: scopedAuthorities.length,
      superAdminEquivalentUsers: superAdmins.length,
    },
  };
}

function getScopedPlatformAdminScope(assignment: {
  capacityArea?: string | null;
  cohort?: { id: string; name: string; slug: string } | null;
  cohortId?: string | null;
  course?: { id: string; title: string } | null;
  courseId?: string | null;
  courseVersion?: {
    id: string;
    versionNumber: number;
    course: { title: string };
  } | null;
  courseVersionId?: string | null;
  organization?: { id: string; name: string; slug: string } | null;
  organizationId?: string | null;
  program?: { code: string | null; id: string; name: string } | null;
  programId?: string | null;
  proofSubmissionId?: string | null;
  scopeId: string;
  scopeType: PermissionScopeType;
}) {
  switch (assignment.scopeType) {
    case PermissionScopeType.PLATFORM:
      return {
        id: assignment.scopeId || "platform",
        label: "Platform-wide",
      };
    case PermissionScopeType.ORGANIZATION:
      return {
        id: assignment.organizationId || assignment.scopeId,
        label: assignment.organization?.name ?? "Organization scope",
      };
    case PermissionScopeType.COURSE:
      return {
        id: assignment.courseId || assignment.scopeId,
        label: assignment.course?.title ?? "Course scope",
      };
    case PermissionScopeType.COURSE_VERSION:
      return {
        id: assignment.courseVersionId || assignment.scopeId,
        label: assignment.courseVersion
          ? `${assignment.courseVersion.course.title} v${assignment.courseVersion.versionNumber}`
          : "Course version scope",
      };
    case PermissionScopeType.PROGRAM:
      return {
        id: assignment.programId || assignment.scopeId,
        label: assignment.program?.code
          ? `${assignment.program.name} (${assignment.program.code})`
          : assignment.program?.name ?? "Program scope",
      };
    case PermissionScopeType.COHORT:
      return {
        id: assignment.cohortId || assignment.scopeId,
        label: assignment.cohort?.name ?? "Cohort scope",
      };
    case PermissionScopeType.PRACTICAL_PROOF_SUBMISSION:
      return {
        id: assignment.proofSubmissionId || assignment.scopeId,
        label: "Practical proof submission scope",
      };
    case PermissionScopeType.CAPACITY_AREA:
      return {
        id: assignment.capacityArea || assignment.scopeId,
        label: assignment.capacityArea || "Capacity area scope",
      };
    case PermissionScopeType.PORTFOLIO:
      return {
        id: assignment.scopeId,
        label: "Portfolio scope",
      };
  }
}

function getAuthorityAuditActionLabel(action: string) {
  switch (action) {
    case "USER_ROLES_UPDATED":
      return "User roles updated";
    case "USER_INVITED":
      return "User invited";
    case "MEMBERSHIP_ADDED":
      return "Organization member added";
    case "MEMBERSHIP_UPDATED":
      return "Organization membership updated";
    case "AUTHORITY_GRANTED":
      return "Platform Admin authority granted";
    case "AUTHORITY_UPDATED":
      return "Platform Admin authority updated";
    default:
      return formatAdminAuthorityLabel(action);
  }
}

function getAuthorityAuditEntityLabel(entityType: string) {
  switch (entityType) {
    case "User":
      return "User account";
    case "OrganizationMembership":
      return "Organization membership";
    case "ScopedRoleAssignment":
      return "Scoped role assignment";
    default:
      return formatAdminAuthorityLabel(entityType);
  }
}

function getActorLabel(actor: { email?: string | null; name?: string | null } | null) {
  return actor?.name ?? actor?.email ?? "System or unavailable user";
}

function formatAdminAuthorityLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

// ---------------------------------------------------------------------------
// Mutators
// ---------------------------------------------------------------------------

export type GrantPlatformAdminInput = {
  actorId: string;
  actorRole: DecRole;
  email: string;
  reason: string;
};

export async function grantPlatformAdminAuthority(input: GrantPlatformAdminInput) {
  // 1. Actor Gate
  if (!isSuperAdminEquivalentForPhase1(input.actorRole)) {
    throw new Error(ADMIN_AUTHORITY_CHANGE_ERROR);
  }

  // 2. Validations
  const reason = input.reason?.trim() ?? "";
  if (reason.length < 10) {
    throw new Error("A descriptive reason (min 10 characters) is required.");
  }

  const email = input.email?.trim().toLowerCase();
  if (!email) {
    throw new Error("Email address is required.");
  }

  // 3. Look up target user
  const targetUser = await prisma.user.findFirst({
    where: { email },
    select: { id: true, status: true },
  });

  if (!targetUser) {
    throw new Error(`No existing user record found for email: ${email}`);
  }

  if (targetUser.status !== "ACTIVE") {
    throw new Error(`Authority can only be granted to active user accounts. Current status: ${targetUser.status}`);
  }

  // 4. Prevent redundant active assignments
  const existingActive = await prisma.scopedRoleAssignment.findFirst({
    where: {
      userId: targetUser.id,
      roleKey: ScopedRoleKey.PLATFORM_ADMIN,
      scopeType: PermissionScopeType.PLATFORM,
      status: ScopedRoleAssignmentStatus.ACTIVE,
    },
  });

  if (existingActive) {
    throw new Error(`${email} already holds active Platform Admin authority.`);
  }

  // 5. Execute creation
  return await prisma.$transaction(async (tx) => {
    const assignment = await tx.scopedRoleAssignment.create({
      data: {
        createdById: input.actorId,
        reason,
        roleKey: ScopedRoleKey.PLATFORM_ADMIN,
        scopeId: "platform",
        scopeType: PermissionScopeType.PLATFORM,
        startsAt: new Date(),
        status: ScopedRoleAssignmentStatus.ACTIVE,
        userId: targetUser.id,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "AUTHORITY_GRANTED",
        actorId: input.actorId,
        entityId: assignment.id,
        entityType: "ScopedRoleAssignment",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return assignment;
  });
}

export type UpdatePlatformAdminStatusInput = {
  actorId: string;
  actorRole: DecRole;
  assignmentId: string;
  reason: string;
  status: ScopedRoleAssignmentStatus;
};

export async function updatePlatformAdminAuthorityStatus(
  input: UpdatePlatformAdminStatusInput,
) {
  // 1. Actor Gate
  if (!isSuperAdminEquivalentForPhase1(input.actorRole)) {
    throw new Error(ADMIN_AUTHORITY_CHANGE_ERROR);
  }

  // 2. Validation
  const reason = input.reason?.trim() ?? "";
  if (reason.length < 10) {
    throw new Error("A descriptive reason (min 10 characters) is required.");
  }

  // 3. Lookup assignment
  const assignment = await prisma.scopedRoleAssignment.findUnique({
    select: {
      id: true,
      roleKey: true,
      userId: true,
    },
    where: { id: input.assignmentId },
  });

  if (!assignment) {
    throw new Error("Platform Admin assignment not found.");
  }

  if (assignment.roleKey !== ScopedRoleKey.PLATFORM_ADMIN) {
    throw new Error("Modification denied: Assignment is not a Platform Admin role.");
  }

  // 4. Self-modification gate
  if (assignment.userId === input.actorId) {
    throw new Error("Self-modification check failed: You cannot modify your own Platform Admin authority status.");
  }

  // 5. Execute update
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.scopedRoleAssignment.update({
      data: {
        reason,
        status: input.status,
        ...(input.status === ScopedRoleAssignmentStatus.DISABLED
          ? { expiresAt: new Date() }
          : {}),
      },
      where: { id: input.assignmentId },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "AUTHORITY_UPDATED",
        actorId: input.actorId,
        entityId: assignment.id,
        entityType: "ScopedRoleAssignment",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return updated;
  });
}

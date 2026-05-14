import {
  PermissionScopeType,
  Prisma,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
} from "@prisma/client";

import { type DecRole } from "@/lib/access";
import { prisma } from "@/lib/db/client";
import {
  ADMIN_AUTHORITY_CHANGE_ERROR,
  isSuperAdminEquivalentForPhase1,
} from "./admin-authority";

export type ScopedAssignment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleKey: ScopedRoleKey;
  scopeType: PermissionScopeType;
  scopeId: string;
  scopeLabel: string;
  status: ScopedRoleAssignmentStatus;
  reason: string;
  createdAt: Date;
  createdByLabel: string;
};

export type ScopedAssignmentsOverview = {
  activeAssignments: ScopedAssignment[];
  recentAssignments: ScopedAssignment[];
};

const GENERAL_SCOPED_ROLES: readonly ScopedRoleKey[] = [
  ScopedRoleKey.ORG_FOCAL_PERSON,
  ScopedRoleKey.FACILITATOR,
  ScopedRoleKey.PROGRAM_ME_MANAGER,
  ScopedRoleKey.SAFE_DASHBOARD_VIEWER,
];

export async function getScopedRoleAssignmentsOverview(): Promise<ScopedAssignmentsOverview> {
  const assignments = await prisma.scopedRoleAssignment.findMany({
    where: {
      roleKey: {
        in: [...GENERAL_SCOPED_ROLES],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
      course: { select: { title: true } },
      organization: { select: { name: true } },
      program: { select: { name: true } },
      cohort: { select: { name: true } },
    },
  });

  const mappedAssignments = assignments.map((a) => {
    let scopeLabel = a.scopeId;
    if (a.scopeType === PermissionScopeType.ORGANIZATION && a.organization) {
      scopeLabel = `Organization: ${a.organization.name}`;
    } else if (a.scopeType === PermissionScopeType.PROGRAM && a.program) {
      scopeLabel = `Program: ${a.program.name}`;
    } else if (a.scopeType === PermissionScopeType.COHORT && a.cohort) {
      scopeLabel = `Cohort: ${a.cohort.name}`;
    } else if (a.scopeType === PermissionScopeType.COURSE && a.course) {
      scopeLabel = `Course: ${a.course.title}`;
    }

    return {
      id: a.id,
      userId: a.user.id,
      userName: a.user.name,
      userEmail: a.user.email,
      roleKey: a.roleKey,
      scopeType: a.scopeType,
      scopeId: a.scopeId,
      scopeLabel,
      status: a.status,
      reason: a.reason,
      createdAt: a.createdAt,
      createdByLabel: a.createdBy?.name || "Unknown System",
    };
  });

  return {
    activeAssignments: mappedAssignments.filter(
      (a) => a.status === ScopedRoleAssignmentStatus.ACTIVE,
    ),
    recentAssignments: mappedAssignments.slice(0, 30),
  };
}

export type AssignScopedRoleInput = {
  actorId: string;
  actorRole: DecRole;
  email: string;
  roleKey: ScopedRoleKey;
  scopeType: PermissionScopeType;
  scopeValue: string;
  reason: string;
};

export async function assignScopedRole(input: AssignScopedRoleInput) {
  // 1. Actor Gate
  if (!isSuperAdminEquivalentForPhase1(input.actorRole)) {
    throw new Error(ADMIN_AUTHORITY_CHANGE_ERROR);
  }

  // 2. Validate Input
  const email = input.email?.toLowerCase().trim();
  const reason = input.reason?.trim() ?? "";
  const scopeValue = input.scopeValue?.trim();

  if (!email) throw new Error("Target user email is required.");
  if (reason.length < 10) throw new Error("Reason (min 10 chars) is required.");
  if (!scopeValue) throw new Error("A valid Scope Value ID is required.");

  if (!GENERAL_SCOPED_ROLES.includes(input.roleKey)) {
    throw new Error(`Role unsupported by this general interface: ${input.roleKey}`);
  }

  const allowedScopes: readonly PermissionScopeType[] = [
    PermissionScopeType.ORGANIZATION,
    PermissionScopeType.PROGRAM,
    PermissionScopeType.COHORT,
    PermissionScopeType.COURSE,
  ];
  if (!allowedScopes.includes(input.scopeType)) {
    throw new Error(`Unsupported scope type: ${input.scopeType}`);
  }

  // 3. Load User
  const targetUser = await prisma.user.findFirst({
    where: { email },
    select: { id: true, status: true, organizationId: true },
  });
  if (!targetUser) {
    throw new Error(`User with email ${email} not found.`);
  }
  if (targetUser.status !== "ACTIVE") {
    throw new Error(
      `Authority can only be granted to active user accounts. Current status: ${targetUser.status}`,
    );
  }

  // Enforce active organization membership for target user
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      userId: targetUser.id,
      organizationId: targetUser.organizationId,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (!membership) {
    throw new Error(
      "Target user must hold an ACTIVE membership within their system organization to hold scoped authority.",
    );
  }

  // 4. Verify target entity exists
  let organizationId: string | undefined;
  let programId: string | undefined;
  let cohortId: string | undefined;
  let courseId: string | undefined;

  if (input.scopeType === PermissionScopeType.ORGANIZATION) {
    const org = await prisma.organization.findUnique({ where: { id: scopeValue } });
    if (!org) throw new Error("Organization not found.");
    organizationId = scopeValue;
  } else if (input.scopeType === PermissionScopeType.PROGRAM) {
    const prog = await prisma.program.findUnique({ where: { id: scopeValue } });
    if (!prog) throw new Error("Program not found.");
    programId = scopeValue;
  } else if (input.scopeType === PermissionScopeType.COHORT) {
    const coh = await prisma.cohort.findUnique({ where: { id: scopeValue } });
    if (!coh) throw new Error("Cohort not found.");
    cohortId = scopeValue;
  } else if (input.scopeType === PermissionScopeType.COURSE) {
    const crs = await prisma.course.findUnique({ where: { id: scopeValue } });
    if (!crs) throw new Error("Course not found.");
    courseId = scopeValue;
  }

  const updateData: Prisma.ScopedRoleAssignmentUncheckedCreateInput = {
    createdById: input.actorId,
    reason,
    roleKey: input.roleKey,
    scopeId: scopeValue,
    scopeType: input.scopeType,
    startsAt: new Date(),
    status: ScopedRoleAssignmentStatus.ACTIVE,
    userId: targetUser.id,
    organizationId,
    programId,
    cohortId,
    courseId,
  };

  // 5. Check for existing assignment
  const existing = await prisma.scopedRoleAssignment.findFirst({
    where: {
      userId: targetUser.id,
      roleKey: input.roleKey,
      scopeType: input.scopeType,
      scopeId: scopeValue,
    },
    select: { id: true, status: true },
  });

  if (existing && existing.status === ScopedRoleAssignmentStatus.ACTIVE) {
    throw new Error("User already has an active assignment for this exact scope and role.");
  }

  // 6. Run Transaction
  return await prisma.$transaction(async (tx) => {
    let assignment;

    if (existing) {
      // Reactivate
      assignment = await tx.scopedRoleAssignment.update({
        where: { id: existing.id },
        data: {
          reason,
          startsAt: new Date(),
          status: ScopedRoleAssignmentStatus.ACTIVE,
          expiresAt: null,
          createdById: input.actorId,
        },
      });
    } else {
      assignment = await tx.scopedRoleAssignment.create({
        data: updateData,
      });
    }

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

export async function disableScopedRoleAssignment(input: {
  actorId: string;
  actorRole: DecRole;
  assignmentId: string;
  reason: string;
}) {
  if (!isSuperAdminEquivalentForPhase1(input.actorRole)) {
    throw new Error(ADMIN_AUTHORITY_CHANGE_ERROR);
  }

  const reason = input.reason?.trim() ?? "";
  if (reason.length < 10) {
    throw new Error("Reason (min 10 chars) is required to disable an assignment.");
  }

  const assignment = await prisma.scopedRoleAssignment.findUnique({
    where: { id: input.assignmentId },
  });
  if (!assignment) throw new Error("Assignment not found.");

  if (!GENERAL_SCOPED_ROLES.includes(assignment.roleKey)) {
    throw new Error("Modification denied: Assignment is not a managed local scoped role.");
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.scopedRoleAssignment.update({
      where: { id: input.assignmentId },
      data: {
        status: ScopedRoleAssignmentStatus.DISABLED,
        expiresAt: new Date(),
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "AUTHORITY_REVOKED",
        actorId: input.actorId,
        entityId: input.assignmentId,
        entityType: "ScopedRoleAssignment",
        reason,
        riskLevel: "MEDIUM",
      },
    });

    return updated;
  });
}

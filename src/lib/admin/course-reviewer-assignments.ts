import {
  CourseVersionStatus,
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

export type ScopedCourseReviewerAssignment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  scopeType: PermissionScopeType;
  scopeId: string;
  scopeLabel: string;
  status: ScopedRoleAssignmentStatus;
  reason: string;
  createdAt: Date;
  createdByLabel: string;
};

export type CourseReviewerAssignmentsOverview = {
  activeAssignments: ScopedCourseReviewerAssignment[];
  recentAssignments: ScopedCourseReviewerAssignment[];
  recentVersionsWithoutAssignment: {
    id: string;
    courseTitle: string;
    versionNumber: number;
    creatorName: string;
    submittedAt: Date | null;
  }[];
};

export async function getCourseReviewerAssignmentsOverview(): Promise<CourseReviewerAssignmentsOverview> {
  const assignments = await prisma.scopedRoleAssignment.findMany({
    where: {
      roleKey: ScopedRoleKey.COURSE_REVIEWER,
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
      courseVersion: {
        include: {
          course: { select: { title: true } },
        },
      },
    },
  });

  const mappedAssignments = assignments.map((a) => {
    let scopeLabel = a.scopeId;
    if (a.scopeType === PermissionScopeType.COURSE_VERSION && a.courseVersion) {
      scopeLabel = `Version: ${a.courseVersion.course.title} (v${a.courseVersion.versionNumber})`;
    } else if (a.scopeType === PermissionScopeType.COURSE && a.course) {
      scopeLabel = `Course: ${a.course.title}`;
    } else if (a.scopeType === PermissionScopeType.ORGANIZATION && a.organization) {
      scopeLabel = `Organization: ${a.organization.name}`;
    }

    return {
      id: a.id,
      userId: a.user.id,
      userName: a.user.name,
      userEmail: a.user.email,
      scopeType: a.scopeType,
      scopeId: a.scopeId,
      scopeLabel,
      status: a.status,
      reason: a.reason,
      createdAt: a.createdAt,
      createdByLabel: a.createdBy?.name || "Unknown System",
    };
  });

  const recentVersions = await prisma.courseVersion.findMany({
    take: 10,
    orderBy: [{ submittedAt: "desc" }, { createdAt: "desc" }],
    where: {
      status: CourseVersionStatus.SUBMITTED,
      // No active assignment at the version level
      scopedRoleAssignments: {
        none: {
          roleKey: ScopedRoleKey.COURSE_REVIEWER,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      },
      // No active assignment at the course level
      course: {
        scopedRoleAssignments: {
          none: {
            roleKey: ScopedRoleKey.COURSE_REVIEWER,
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        },
        // No active assignment at the organization level
        organization: {
          scopedRoleAssignments: {
            none: {
              roleKey: ScopedRoleKey.COURSE_REVIEWER,
              status: ScopedRoleAssignmentStatus.ACTIVE,
            },
          },
        },
      },
    },
    select: {
      id: true,
      submittedAt: true,
      versionNumber: true,
      createdBy: { select: { name: true } },
      course: { select: { title: true } },
    },
  });

  return {
    activeAssignments: mappedAssignments.filter(
      (a) => a.status === ScopedRoleAssignmentStatus.ACTIVE,
    ),
    recentAssignments: mappedAssignments.slice(0, 20),
    recentVersionsWithoutAssignment: recentVersions.map((v) => ({
      id: v.id,
      courseTitle: v.course.title,
      versionNumber: v.versionNumber,
      creatorName: v.createdBy.name,
      submittedAt: v.submittedAt,
    })),
  };
}

export type AssignCourseReviewerInput = {
  actorId: string;
  actorRole: DecRole;
  email: string;
  scopeType: PermissionScopeType;
  scopeValue: string;
  reason: string;
};

export async function assignCourseReviewer(input: AssignCourseReviewerInput) {
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

  // Valid scopes supported by canReviewCourseVersion
  const allowedScopes: PermissionScopeType[] = [
    PermissionScopeType.COURSE_VERSION,
    PermissionScopeType.COURSE,
    PermissionScopeType.ORGANIZATION,
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

  // Enforce active organization membership & required workspace role
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      userId: targetUser.id,
      organizationId: targetUser.organizationId,
      status: "ACTIVE",
    },
    include: {
      roles: {
        select: { role: true },
      },
    },
  });
  if (!membership) {
    throw new Error(
      "Target user must hold an ACTIVE membership within their system organization to hold reviewer authority.",
    );
  }

  // Temporarily enforce workspace access until /review route fully wires scoped access
  const hasRequiredRole = membership.roles.some(
    (r) => r.role === "REVIEWER" || r.role === "ADMIN",
  );
  if (!hasRequiredRole) {
    throw new Error(
      "Target user must currently hold the system REVIEWER or ADMIN role to be assigned as a course reviewer.",
    );
  }

  // 4. Verify target entity exists
  let courseVersionId: string | undefined;
  let courseId: string | undefined;
  let organizationId: string | undefined;

  if (input.scopeType === PermissionScopeType.COURSE_VERSION) {
    const version = await prisma.courseVersion.findUnique({
      where: { id: scopeValue },
    });
    if (!version) throw new Error("Course version not found.");
    courseVersionId = scopeValue;
  } else if (input.scopeType === PermissionScopeType.COURSE) {
    const course = await prisma.course.findUnique({ where: { id: scopeValue } });
    if (!course) throw new Error("Course not found.");
    courseId = scopeValue;
  } else if (input.scopeType === PermissionScopeType.ORGANIZATION) {
    const org = await prisma.organization.findUnique({ where: { id: scopeValue } });
    if (!org) throw new Error("Organization not found.");
    organizationId = scopeValue;
  }

  const updateData: Prisma.ScopedRoleAssignmentUncheckedCreateInput = {
    createdById: input.actorId,
    reason,
    roleKey: ScopedRoleKey.COURSE_REVIEWER,
    scopeId: scopeValue,
    scopeType: input.scopeType,
    startsAt: new Date(),
    status: ScopedRoleAssignmentStatus.ACTIVE,
    userId: targetUser.id,
    courseVersionId,
    courseId,
    organizationId,
  };

  // 5. Check for existing assignment record to handle idempotency
  const existing = await prisma.scopedRoleAssignment.findFirst({
    where: {
      userId: targetUser.id,
      roleKey: ScopedRoleKey.COURSE_REVIEWER,
      scopeType: input.scopeType,
      scopeId: scopeValue,
    },
    select: { id: true, status: true },
  });

  if (existing && existing.status === ScopedRoleAssignmentStatus.ACTIVE) {
    throw new Error("User already has an active assignment for this exact scope.");
  }

  // 6. Run Transaction
  return await prisma.$transaction(async (tx) => {
    let assignment;

    if (existing) {
      // Reactivate existing disabled record
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

export async function disableCourseReviewerAssignment(input: {
  actorId: string;
  actorRole: DecRole;
  assignmentId: string;
  reason: string;
}) {
  // 1. Actor Gate
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
  if (assignment.roleKey !== ScopedRoleKey.COURSE_REVIEWER) {
    throw new Error("Modification denied: Assignment is not a course reviewer role.");
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

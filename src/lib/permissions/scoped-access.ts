import {
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
  type PrismaClient,
} from "@prisma/client";

import {
  canAccessWorkspace as canAccessLegacyWorkspace,
  type DecRole,
  type ProtectedWorkspace,
} from "@/lib/access";

export type PermissionScope = {
  type: PermissionScopeType;
  id?: string | null;
  organizationId?: string | null;
  courseId?: string | null;
  courseVersionId?: string | null;
  proofSubmissionId?: string | null;
  programId?: string | null;
  cohortId?: string | null;
  capacityArea?: string | null;
};

export type ScopedAccessAssignment = {
  roleKey: ScopedRoleKey;
  scopeType: PermissionScopeType;
  scopeId?: string | null;
  organizationId?: string | null;
  courseId?: string | null;
  courseVersionId?: string | null;
  proofSubmissionId?: string | null;
  programId?: string | null;
  cohortId?: string | null;
  capacityArea?: string | null;
  status?: ScopedRoleAssignmentStatus;
  startsAt?: Date | string | null;
  expiresAt?: Date | string | null;
};

export type PermissionIdentity = {
  session: {
    role: DecRole;
  };
  user: {
    id: string;
    organizationId: string;
    roles?: readonly DecRole[];
  };
  // Slice 1 does not auto-load these on PersistedIdentity. Later scoped
  // routes must attach active assignments before relying on scoped grants.
  scopedRoleAssignments?: readonly ScopedAccessAssignment[];
};

export type CourseScopeLike = {
  id: string;
  organizationId: string;
  ownerId: string;
};

export type CourseVersionScopeLike = {
  id: string;
  courseId: string;
  course: {
    id?: string;
    organizationId: string;
    ownerId?: string | null;
  };
};

export type ProofSubmissionScopeLike = {
  id: string;
  userId: string;
  courseVersionId: string;
  practicalProofConfig?: {
    capacityArea?: string | null;
  } | null;
  courseVersion?: {
    id?: string;
    courseId: string;
    course: {
      id?: string;
      organizationId: string;
      ownerId?: string | null;
    };
  } | null;
};

export type PermissionDecision = {
  allowed: boolean;
  reason: string;
};

export async function getScopedRoleAssignments(
  prisma: PrismaClient,
  userId: string,
  now = new Date(),
) {
  const assignments = await prisma.scopedRoleAssignment.findMany({
    where: {
      userId,
      status: ScopedRoleAssignmentStatus.ACTIVE,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
    },
  });

  return assignments satisfies ScopedAccessAssignment[];
}

export function canAccessWorkspace(
  identity: PermissionIdentity,
  workspace: ProtectedWorkspace,
) {
  return canAccessLegacyWorkspace(identity.session.role, workspace);
}

export function hasLegacyRole(
  identity: PermissionIdentity,
  role: DecRole,
) {
  return (
    identity.session.role === role ||
    Boolean(identity.user.roles?.includes(role))
  );
}

export function hasScopedRole(
  identity: PermissionIdentity,
  roleKey: ScopedRoleKey,
  scope: PermissionScope,
  now = new Date(),
) {
  return getIdentityAssignments(identity).some(
    (assignment) =>
      assignment.roleKey === roleKey &&
      isActiveScopedAssignment(assignment, now) &&
      matchesScope(assignment, scope),
  );
}

export function hasPlatformAdmin(identity: PermissionIdentity) {
  return (
    hasLegacyRole(identity, "admin") ||
    hasScopedRole(identity, ScopedRoleKey.PLATFORM_ADMIN, {
      type: PermissionScopeType.PLATFORM,
    })
  );
}

export function hasSuperAdminEquivalent(identity: PermissionIdentity) {
  return hasLegacyRole(identity, "admin");
}

export function canAccessAdminWorkspace(identity: PermissionIdentity) {
  return hasPlatformAdmin(identity);
}

export function canManagePlatformAdminAuthority(identity: PermissionIdentity) {
  return hasSuperAdminEquivalent(identity);
}

export function canCreateCourse(
  identity: PermissionIdentity,
  organizationId: string,
) {
  return (
    hasLegacyRole(identity, "admin") ||
    (hasLegacyRole(identity, "creator") &&
      identity.user.organizationId === organizationId) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_CREATOR, {
      type: PermissionScopeType.ORGANIZATION,
      id: organizationId,
      organizationId,
    })
  );
}

export function canManageCourse(
  identity: PermissionIdentity,
  course: CourseScopeLike,
) {
  return (
    (identity.user.organizationId === course.organizationId &&
      (hasLegacyRole(identity, "admin") ||
        (hasLegacyRole(identity, "creator") &&
          identity.user.id === course.ownerId))) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_CREATOR, {
      type: PermissionScopeType.COURSE,
      id: course.id,
      courseId: course.id,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_CREATOR, {
      type: PermissionScopeType.ORGANIZATION,
      id: course.organizationId,
      organizationId: course.organizationId,
    })
  );
}

export function canReviewCourseVersion(
  identity: PermissionIdentity,
  version: CourseVersionScopeLike,
) {
  const organizationId = version.course.organizationId;
  const courseId = version.course.id || version.courseId;

  return (
    hasLegacyRole(identity, "admin") ||
    (hasLegacyRole(identity, "reviewer") &&
      identity.user.organizationId === organizationId) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_REVIEWER, {
      type: PermissionScopeType.COURSE_VERSION,
      id: version.id,
      courseVersionId: version.id,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_REVIEWER, {
      type: PermissionScopeType.COURSE,
      id: courseId,
      courseId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.COURSE_REVIEWER, {
      type: PermissionScopeType.ORGANIZATION,
      id: organizationId,
      organizationId,
    })
  );
}

export function canApproveForPublish(
  identity: PermissionIdentity,
  version: CourseVersionScopeLike,
) {
  return canReviewCourseVersion(identity, version);
}

export function canViewPublishQueue(identity: PermissionIdentity) {
  return hasPlatformAdmin(identity);
}

export function canPublishCourseVersion(
  identity: PermissionIdentity,
) {
  return hasPlatformAdmin(identity);
}

export function canViewRawProof(
  identity: PermissionIdentity,
  submission: ProofSubmissionScopeLike,
) {
  return (
    submission.userId === identity.user.id ||
    hasLegacyRole(identity, "admin") ||
    hasProofVerifierScope(identity, submission)
  );
}

export function canReviewAssignedProof(
  identity: PermissionIdentity,
  submission: ProofSubmissionScopeLike,
) {
  const organizationId = submission.courseVersion?.course.organizationId;

  // Transitional compatibility: legacy reviewer/admin proof review remains
  // organization-scoped until the dedicated proof-verifier assignment slice.
  return (
    hasLegacyRole(identity, "admin") ||
    (hasLegacyRole(identity, "reviewer") &&
      organizationId !== undefined &&
      identity.user.organizationId === organizationId) ||
    hasProofVerifierScope(identity, submission)
  );
}

export function canViewSafeOrganizationSummary(
  identity: PermissionIdentity,
  organizationId: string,
) {
  return (
    hasLegacyRole(identity, "admin") ||
    hasScopedRole(identity, ScopedRoleKey.ORG_FOCAL_PERSON, {
      type: PermissionScopeType.ORGANIZATION,
      id: organizationId,
      organizationId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.SAFE_DASHBOARD_VIEWER, {
      type: PermissionScopeType.ORGANIZATION,
      id: organizationId,
      organizationId,
    })
  );
}

export function canViewCohortOversight(
  identity: PermissionIdentity,
  cohortId: string,
) {
  return (
    hasPlatformAdmin(identity) ||
    hasScopedRole(identity, ScopedRoleKey.FACILITATOR, {
      type: PermissionScopeType.COHORT,
      id: cohortId,
      cohortId,
    })
  );
}

export function canViewScopedProgramDashboard(
  identity: PermissionIdentity,
  programOrPortfolioScopeId: string,
) {
  return (
    hasLegacyRole(identity, "admin") ||
    hasScopedRole(identity, ScopedRoleKey.PROGRAM_ME_MANAGER, {
      type: PermissionScopeType.PROGRAM,
      id: programOrPortfolioScopeId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.PROGRAM_ME_MANAGER, {
      type: PermissionScopeType.PROGRAM,
      programId: programOrPortfolioScopeId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.PROGRAM_ME_MANAGER, {
      type: PermissionScopeType.PORTFOLIO,
      id: programOrPortfolioScopeId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.SAFE_DASHBOARD_VIEWER, {
      type: PermissionScopeType.PROGRAM,
      id: programOrPortfolioScopeId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.SAFE_DASHBOARD_VIEWER, {
      type: PermissionScopeType.PROGRAM,
      programId: programOrPortfolioScopeId,
    }) ||
    hasScopedRole(identity, ScopedRoleKey.SAFE_DASHBOARD_VIEWER, {
      type: PermissionScopeType.PORTFOLIO,
      id: programOrPortfolioScopeId,
    })
  );
}

export function getPermissionDecision(
  allowed: boolean,
  reason: string,
): PermissionDecision {
  return { allowed, reason };
}

export function isActiveScopedAssignment(
  assignment: ScopedAccessAssignment,
  now = new Date(),
) {
  if (
    assignment.status !== undefined &&
    assignment.status !== ScopedRoleAssignmentStatus.ACTIVE
  ) {
    return false;
  }

  const startsAt = toDate(assignment.startsAt);
  if (startsAt && startsAt.getTime() > now.getTime()) {
    return false;
  }

  const expiresAt = toDate(assignment.expiresAt);
  if (expiresAt && expiresAt.getTime() <= now.getTime()) {
    return false;
  }

  return true;
}

export function matchesScope(
  assignment: ScopedAccessAssignment,
  scope: PermissionScope,
) {
  if (assignment.scopeType !== scope.type) {
    return false;
  }

  if (scope.type === PermissionScopeType.PLATFORM) {
    return true;
  }

  if (
    scope.id !== undefined &&
    normalizeScopeValue(assignment.scopeId) !== normalizeScopeValue(scope.id)
  ) {
    return false;
  }

  if (
    scope.organizationId !== undefined &&
    normalizeScopeValue(assignment.organizationId) !==
      normalizeScopeValue(scope.organizationId)
  ) {
    return false;
  }

  if (
    scope.courseId !== undefined &&
    normalizeScopeValue(assignment.courseId) !== normalizeScopeValue(scope.courseId)
  ) {
    return false;
  }

  if (
    scope.courseVersionId !== undefined &&
    normalizeScopeValue(assignment.courseVersionId) !==
      normalizeScopeValue(scope.courseVersionId)
  ) {
    return false;
  }

  if (
    scope.proofSubmissionId !== undefined &&
    normalizeScopeValue(assignment.proofSubmissionId) !==
      normalizeScopeValue(scope.proofSubmissionId)
  ) {
    return false;
  }

  if (
    scope.programId !== undefined &&
    normalizeScopeValue(assignment.programId) !==
      normalizeScopeValue(scope.programId)
  ) {
    return false;
  }

  if (
    scope.cohortId !== undefined &&
    normalizeScopeValue(assignment.cohortId) !==
      normalizeScopeValue(scope.cohortId)
  ) {
    return false;
  }

  if (
    scope.capacityArea !== undefined &&
    normalizeCapacityArea(assignment.capacityArea) !==
      normalizeCapacityArea(scope.capacityArea)
  ) {
    return false;
  }

  return true;
}

function hasProofVerifierScope(
  identity: PermissionIdentity,
  submission: ProofSubmissionScopeLike,
) {
  const organizationId = submission.courseVersion?.course.organizationId;
  const courseId = submission.courseVersion?.course.id || submission.courseVersion?.courseId;
  const capacityArea = submission.practicalProofConfig?.capacityArea;

  return (
    hasScopedRole(identity, ScopedRoleKey.PRACTICAL_PROOF_VERIFIER, {
      type: PermissionScopeType.PRACTICAL_PROOF_SUBMISSION,
      id: submission.id,
      proofSubmissionId: submission.id,
    }) ||
    (courseId !== undefined &&
      hasScopedRole(identity, ScopedRoleKey.PRACTICAL_PROOF_VERIFIER, {
        type: PermissionScopeType.COURSE,
        id: courseId,
        courseId,
      })) ||
    (organizationId !== undefined &&
      hasScopedRole(identity, ScopedRoleKey.PRACTICAL_PROOF_VERIFIER, {
        type: PermissionScopeType.ORGANIZATION,
        id: organizationId,
        organizationId,
      })) ||
    (capacityArea !== undefined &&
      hasScopedRole(identity, ScopedRoleKey.PRACTICAL_PROOF_VERIFIER, {
        type: PermissionScopeType.CAPACITY_AREA,
        id: capacityArea,
        capacityArea,
      }))
  );
}

function getIdentityAssignments(identity: PermissionIdentity) {
  return identity.scopedRoleAssignments || [];
}

function normalizeScopeValue(value: string | null | undefined) {
  return value || "";
}

function normalizeCapacityArea(value: string | null | undefined) {
  return normalizeScopeValue(value).trim().toLowerCase();
}

function toDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}

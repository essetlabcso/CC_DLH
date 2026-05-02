import { CourseVersionStatus } from "@prisma/client";

import type { DecRole } from "@/lib/access";

const allowedTransitions: Record<
  CourseVersionStatus,
  readonly CourseVersionStatus[]
> = {
  DRAFT: ["CREATOR_REVIEW", "SUBMITTED", "ARCHIVED"],
  CREATOR_REVIEW: ["DRAFT", "SUBMITTED", "ARCHIVED"],
  SUBMITTED: ["RETURNED", "APPROVED"],
  RETURNED: ["DRAFT", "ARCHIVED"],
  APPROVED: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["REVISION_DRAFT", "REPLACED", "ARCHIVED"],
  REVISION_DRAFT: ["CREATOR_REVIEW", "SUBMITTED", "ARCHIVED"],
  REPLACED: ["ARCHIVED"],
  ARCHIVED: [],
};

const transitionRoles: Partial<
  Record<CourseVersionStatus, Partial<Record<CourseVersionStatus, readonly DecRole[]>>>
> = {
  DRAFT: {
    CREATOR_REVIEW: ["creator", "admin"],
    SUBMITTED: ["creator", "admin"],
    ARCHIVED: ["creator", "admin"],
  },
  CREATOR_REVIEW: {
    DRAFT: ["creator", "admin"],
    SUBMITTED: ["creator", "admin"],
    ARCHIVED: ["creator", "admin"],
  },
  SUBMITTED: {
    RETURNED: ["reviewer", "admin"],
    APPROVED: ["reviewer", "admin"],
  },
  RETURNED: {
    DRAFT: ["creator", "admin"],
    ARCHIVED: ["creator", "admin"],
  },
  APPROVED: {
    PUBLISHED: ["admin"],
    ARCHIVED: ["admin"],
  },
  PUBLISHED: {
    REVISION_DRAFT: ["creator", "reviewer", "admin"],
    REPLACED: ["admin"],
    ARCHIVED: ["admin"],
  },
  REVISION_DRAFT: {
    CREATOR_REVIEW: ["creator", "admin"],
    SUBMITTED: ["creator", "admin"],
    ARCHIVED: ["creator", "admin"],
  },
  REPLACED: {
    ARCHIVED: ["admin"],
  },
};

export function canTransitionCourseVersion(
  fromStatus: CourseVersionStatus,
  toStatus: CourseVersionStatus,
) {
  return allowedTransitions[fromStatus].includes(toStatus);
}

export function canRoleTransitionCourseVersion(
  role: DecRole,
  fromStatus: CourseVersionStatus,
  toStatus: CourseVersionStatus,
) {
  if (!canTransitionCourseVersion(fromStatus, toStatus)) {
    return false;
  }

  return transitionRoles[fromStatus]?.[toStatus]?.includes(role) ?? false;
}

export function assertCourseVersionTransition(
  fromStatus: CourseVersionStatus,
  toStatus: CourseVersionStatus,
) {
  if (!canTransitionCourseVersion(fromStatus, toStatus)) {
    throw new Error(
      `Invalid course version transition: ${fromStatus} to ${toStatus}`,
    );
  }
}

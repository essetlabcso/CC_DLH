import {
  CourseAccessMode,
  CourseStatus,
  CourseVersionStatus,
  LearnerEnrollmentEventType,
  LearnerEnrollmentSource,
  LearnerEnrollmentStatus,
  type Prisma,
} from "@prisma/client";

import {
  loadLearnerAccessDecision,
  type LearnerAccessLoaderPrisma,
} from "./access-loader";
import type {
  CourseAccessModeLike,
  CourseStatusLike,
  CourseVersionStatusLike,
  EnrollmentModeLike,
  LearnerAccessDecision,
  LearnerAccessIdentity,
} from "./access-decision";

export const publicSelfEnrollmentMetadata = JSON.stringify({
  source: "public-self-enrollment",
});

export const publicSelfEnrollmentReason = "Public learner self-enrollment";

export const publicCourseAccessModes = [
  CourseAccessMode.PUBLIC_OPEN,
  CourseAccessMode.PUBLIC_REGISTRATION_REQUIRED,
] as const;

export const activeLearnerEnrollmentStatuses = [
  LearnerEnrollmentStatus.ASSIGNED,
  LearnerEnrollmentStatus.ENROLLED,
  LearnerEnrollmentStatus.STARTED,
  LearnerEnrollmentStatus.COMPLETED,
] as const;

export function buildPublicCatalogueCourseVersionWhere(): Prisma.CourseVersionWhereInput {
  return {
    status: CourseVersionStatus.PUBLISHED,
    course: {
      status: CourseStatus.ACTIVE,
    },
    OR: [
      {
        course: {
          accessMode: {
            in: [...publicCourseAccessModes],
          },
          publicCatalogVisible: true,
        },
      },
      {
        setup: {
          accessMode: {
            in: [...publicCourseAccessModes],
          },
          publicCatalogVisible: true,
        },
      },
    ],
  };
}

export const publicSelfEnrollmentVersionSelect = {
  id: true,
  courseId: true,
  status: true,
  course: {
    select: {
      id: true,
      organizationId: true,
      status: true,
      accessMode: true,
      publicCatalogVisible: true,
    },
  },
  setup: {
    select: {
      accessMode: true,
      enrollmentMode: true,
      publicCatalogVisible: true,
    },
  },
} as const;

export type PublicEligibilityVersion = {
  id: string;
  courseId: string;
  status: CourseVersionStatusLike;
  course: {
    id: string;
    organizationId: string;
    status: CourseStatusLike;
    accessMode: CourseAccessModeLike;
    publicCatalogVisible: boolean | null;
  };
  setup: {
    accessMode: CourseAccessModeLike | null;
    enrollmentMode: EnrollmentModeLike | null;
    publicCatalogVisible: boolean | null;
  } | null;
};

export type SelfEnrollmentRecord = {
  id: string;
  userId: string;
  courseId: string;
  courseVersionId: string;
  organizationId: string;
  source: string;
  status: string;
  enrolledAt: Date | null;
};

export type SelfEnrollmentResult =
  | {
      ok: true;
      created: boolean;
      enrollment: SelfEnrollmentRecord;
      decision: LearnerAccessDecision;
    }
  | {
      ok: false;
      reason: string;
      decision?: LearnerAccessDecision;
    };

type FindFirstArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

type FindUniqueArgs = {
  where: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type CreateArgs = {
  data: Record<string, unknown>;
  select?: Record<string, unknown>;
};

type SelfEnrollmentTransaction = {
  learnerEnrollment: {
    findUnique(args: FindUniqueArgs): Promise<SelfEnrollmentRecord | null>;
    create(args: CreateArgs): Promise<SelfEnrollmentRecord>;
  };
  learnerEnrollmentEvent: {
    create(args: CreateArgs): Promise<unknown>;
  };
};

export type SelfEnrollmentPrisma = {
  courseVersion: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
  };
  learnerEnrollment: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
    findUnique(args: FindUniqueArgs): Promise<SelfEnrollmentRecord | null>;
    create(args: CreateArgs): Promise<SelfEnrollmentRecord>;
  };
  learnerInvitation: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
  };
  programParticipant: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
  };
  cohortParticipant: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
  };
  learnerEnrollmentEvent: {
    create(args: CreateArgs): Promise<unknown>;
  };
  $transaction<T>(
    callback: (transaction: SelfEnrollmentTransaction) => Promise<T>,
  ): Promise<T>;
};

export type SelfEnrollmentInput = {
  courseId: string;
  identity: LearnerAccessIdentity;
  now?: Date;
};

export type PublicCourseCta =
  | {
      kind: "SIGN_IN";
      label: string;
      href: string;
    }
  | {
      kind: "SELF_ENROLL";
      label: string;
    }
  | {
      kind: "OPEN";
      label: string;
      href: string;
    }
  | {
      kind: "BLOCKED";
      label: string;
    };

export function isPublicEligibleCourseVersion(
  version: PublicEligibilityVersion,
): boolean {
  if (version.status !== CourseVersionStatus.PUBLISHED) {
    return false;
  }

  if (version.course.status !== "ACTIVE") {
    return false;
  }

  if (version.setup?.enrollmentMode === "INVITATION_ONLY") {
    return false;
  }

  return (
    isPublicAccessMode(version.setup?.accessMode ?? version.course.accessMode) &&
    Boolean(version.setup?.publicCatalogVisible ?? version.course.publicCatalogVisible)
  );
}

export function filterPublicCatalogueVersions<
  Version extends PublicEligibilityVersion,
>(versions: readonly Version[]) {
  return versions.filter(isPublicEligibleCourseVersion);
}

export function buildPublicCourseCta(input: {
  courseId: string;
  isSignedInLearner: boolean;
  decision: LearnerAccessDecision;
}): PublicCourseCta {
  if (!input.isSignedInLearner) {
    const label =
      input.decision.accessModel === "public-registration-required"
        ? "Sign in or register to enroll"
        : "Sign in to start";

    return {
      kind: "SIGN_IN",
      label,
      href: `/sign-in?next=${encodeURIComponent(
        `/learn/courses/${input.courseId}`,
      )}`,
    };
  }

  if (input.decision.allowedActions.includes("SELF_ENROLL")) {
    return {
      kind: "SELF_ENROLL",
      label: "Enroll and start",
    };
  }

  if (canOpenEnrolledCourse(input.decision)) {
    return {
      kind: "OPEN",
      label:
        input.decision.reasonCode === "ENROLLMENT_COMPLETED"
          ? "View course record"
          : "Open course",
      href: `/learn/courses/${input.courseId}`,
    };
  }

  return {
    kind: "BLOCKED",
    label: "Contact support",
  };
}

export async function selfEnrollInPublicCourse(
  prisma: SelfEnrollmentPrisma,
  input: SelfEnrollmentInput,
): Promise<SelfEnrollmentResult> {
  const version = (await prisma.courseVersion.findFirst({
    where: {
      ...buildPublicCatalogueCourseVersionWhere(),
      courseId: input.courseId,
    },
    select: publicSelfEnrollmentVersionSelect,
    orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
  })) as PublicEligibilityVersion | null;

  if (!version || !isPublicEligibleCourseVersion(version)) {
    return { ok: false, reason: "PUBLIC_COURSE_NOT_AVAILABLE" };
  }

  const access = await loadLearnerAccessDecision(
    prisma as unknown as LearnerAccessLoaderPrisma,
    {
      courseId: input.courseId,
      courseVersionId: version.id,
      identity: input.identity,
      now: input.now,
    },
  );

  if (!access) {
    return { ok: false, reason: "ACCESS_CONTEXT_NOT_FOUND" };
  }

  const canSelfEnroll = access.decision.allowedActions.includes("SELF_ENROLL");
  const canOpen = canOpenEnrolledCourse(access.decision);

  if (!canSelfEnroll && !canOpen) {
    return {
      ok: false,
      reason: access.decision.reasonCode,
      decision: access.decision,
    };
  }

  return prisma.$transaction(async (transaction) => {
    const existingEnrollment = await transaction.learnerEnrollment.findUnique({
      where: {
        userId_courseVersionId: {
          userId: input.identity.userId,
          courseVersionId: version.id,
        },
      },
      select: selfEnrollmentRecordSelect,
    });

    if (existingEnrollment) {
      return {
        ok: true,
        created: false,
        enrollment: existingEnrollment,
        decision: access.decision,
      };
    }

    if (!canSelfEnroll) {
      return {
        ok: false,
        reason: "SELF_ENROLL_NOT_ALLOWED",
        decision: access.decision,
      };
    }

    const enrolledAt = input.now ?? new Date();
    const enrollment = await transaction.learnerEnrollment.create({
      data: {
        userId: input.identity.userId,
        courseId: version.course.id,
        courseVersionId: version.id,
        organizationId: input.identity.organizationId,
        source: LearnerEnrollmentSource.SELF_ENROLL,
        status: LearnerEnrollmentStatus.ENROLLED,
        enrolledAt,
        reason: publicSelfEnrollmentReason,
        metadata: publicSelfEnrollmentMetadata,
      },
      select: selfEnrollmentRecordSelect,
    });

    await transaction.learnerEnrollmentEvent.create({
      data: {
        enrollmentId: enrollment.id,
        actorId: input.identity.userId,
        eventType: LearnerEnrollmentEventType.ENROLLMENT_CREATED,
        toStatus: LearnerEnrollmentStatus.ENROLLED,
        reason: publicSelfEnrollmentReason,
        metadata: publicSelfEnrollmentMetadata,
      },
    });

    return {
      ok: true,
      created: true,
      enrollment,
      decision: access.decision,
    };
  });
}

export function canOpenEnrolledCourse(decision: LearnerAccessDecision) {
  return (
    decision.allowedActions.includes("OPEN_COURSE") ||
    decision.allowedActions.includes("OPEN_LESSON")
  );
}

function isPublicAccessMode(accessMode: CourseAccessModeLike) {
  return (
    accessMode === CourseAccessMode.PUBLIC_OPEN ||
    accessMode === CourseAccessMode.PUBLIC_REGISTRATION_REQUIRED
  );
}

const selfEnrollmentRecordSelect = {
  id: true,
  userId: true,
  courseId: true,
  courseVersionId: true,
  organizationId: true,
  source: true,
  status: true,
  enrolledAt: true,
} as const;

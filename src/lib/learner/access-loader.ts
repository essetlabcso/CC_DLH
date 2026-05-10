import {
  type CourseAccessModeLike,
  type CourseStatusLike,
  type CourseVersionStatusLike,
  type EnrollmentModeLike,
  type LearnerAccessDecision,
  type LearnerAccessEnrollment,
  type LearnerAccessIdentity,
  type LearnerAccessInvitation,
  type LearnerAccessParticipant,
  resolveLearnerAccess,
} from "./access-decision";

export const learnerAccessCourseVersionSelect = {
  id: true,
  courseId: true,
  status: true,
  publishedAt: true,
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
      memberCatalogVisible: true,
      requiresProgramAssignment: true,
      requiresCohortAssignment: true,
    },
  },
  cohortCourses: {
    select: {
      cohortId: true,
      cohort: {
        select: {
          id: true,
          programId: true,
          organizationId: true,
          status: true,
        },
      },
    },
  },
} as const;

export const learnerAccessEnrollmentSelect = {
  id: true,
  status: true,
  programId: true,
  cohortId: true,
  invitationId: true,
} as const;

export const learnerAccessInvitationSelect = {
  id: true,
  status: true,
  programId: true,
  cohortId: true,
  courseId: true,
  courseVersionId: true,
  expiresAt: true,
} as const;

export const learnerAccessProgramParticipantSelect = {
  id: true,
  status: true,
  programId: true,
  organizationId: true,
} as const;

export const learnerAccessCohortParticipantSelect = {
  id: true,
  status: true,
  programId: true,
  cohortId: true,
  organizationId: true,
} as const;

export type LearnerAccessLoaderInput = {
  courseId: string;
  courseVersionId?: string;
  identity?: LearnerAccessIdentity | null;
  now?: Date;
};

export type LearnerAccessLoaderResult = {
  decision: LearnerAccessDecision;
  context: {
    courseId: string;
    courseVersionId: string;
    programIds: string[];
    cohortIds: string[];
    hasEnrollment: boolean;
    hasInvitation: boolean;
    hasProgramParticipant: boolean;
    hasCohortParticipant: boolean;
  };
};

type SafeCourseVersionRecord = {
  id: string;
  courseId: string;
  status: CourseVersionStatusLike;
  publishedAt: Date | null;
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
    memberCatalogVisible: boolean | null;
    requiresProgramAssignment: boolean | null;
    requiresCohortAssignment: boolean | null;
  } | null;
  cohortCourses: {
    cohortId: string;
    cohort: {
      id: string;
      programId: string | null;
      organizationId: string | null;
      status: string;
    };
  }[];
};

type FindFirstArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

export type LearnerAccessLoaderPrisma = {
  courseVersion: {
    findFirst(args: FindFirstArgs): Promise<SafeCourseVersionRecord | null>;
  };
  learnerEnrollment: {
    findFirst(args: FindFirstArgs): Promise<LearnerAccessEnrollment | null>;
  };
  learnerInvitation: {
    findFirst(args: FindFirstArgs): Promise<LearnerAccessInvitation | null>;
  };
  programParticipant: {
    findFirst(args: FindFirstArgs): Promise<LearnerAccessParticipant | null>;
  };
  cohortParticipant: {
    findFirst(args: FindFirstArgs): Promise<LearnerAccessParticipant | null>;
  };
};

export async function loadLearnerAccessDecision(
  prisma: LearnerAccessLoaderPrisma,
  input: LearnerAccessLoaderInput,
): Promise<LearnerAccessLoaderResult | null> {
  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId: input.courseId,
      status: "PUBLISHED",
      ...(input.courseVersionId ? { id: input.courseVersionId } : {}),
    },
    select: learnerAccessCourseVersionSelect,
    orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
  });

  if (!version) {
    return null;
  }

  const programIds = getProgramIds(version);
  const cohortIds = getCohortIds(version);
  const enrollment = await loadEnrollment(prisma, input.identity, version.id);
  const invitation = await loadInvitation(prisma, input.identity, version, {
    programIds,
    cohortIds,
  });

  const programParticipant = await loadProgramParticipant(
    prisma,
    input.identity,
    mergeIds(programIds, enrollment?.programId, invitation?.programId),
  );
  const cohortParticipant = await loadCohortParticipant(
    prisma,
    input.identity,
    mergeIds(cohortIds, enrollment?.cohortId, invitation?.cohortId),
  );

  const decision = resolveLearnerAccess({
    now: input.now,
    identity: input.identity,
    course: version.course,
    version: {
      id: version.id,
      status: version.status,
      publishedAt: version.publishedAt,
    },
    setup: version.setup,
    enrollment,
    invitation,
    programParticipant,
    cohortParticipant,
  });

  return {
    decision,
    context: {
      courseId: version.course.id,
      courseVersionId: version.id,
      programIds,
      cohortIds,
      hasEnrollment: Boolean(enrollment),
      hasInvitation: Boolean(invitation),
      hasProgramParticipant: Boolean(programParticipant),
      hasCohortParticipant: Boolean(cohortParticipant),
    },
  };
}

async function loadEnrollment(
  prisma: LearnerAccessLoaderPrisma,
  identity: LearnerAccessIdentity | null | undefined,
  courseVersionId: string,
) {
  if (!identity) {
    return null;
  }

  return prisma.learnerEnrollment.findFirst({
    where: {
      userId: identity.userId,
      courseVersionId,
    },
    select: learnerAccessEnrollmentSelect,
  });
}

async function loadInvitation(
  prisma: LearnerAccessLoaderPrisma,
  identity: LearnerAccessIdentity | null | undefined,
  version: SafeCourseVersionRecord,
  context: { programIds: readonly string[]; cohortIds: readonly string[] },
) {
  if (!identity) {
    return null;
  }

  return prisma.learnerInvitation.findFirst({
    where: {
      acceptedUserId: identity.userId,
      OR: [
        { courseVersionId: version.id },
        { courseId: version.course.id },
        ...(context.programIds.length > 0
          ? [{ programId: { in: context.programIds } }]
          : []),
        ...(context.cohortIds.length > 0
          ? [{ cohortId: { in: context.cohortIds } }]
          : []),
      ],
    },
    select: learnerAccessInvitationSelect,
    orderBy: [{ acceptedAt: "desc" }, { sentAt: "desc" }, { createdAt: "desc" }],
  });
}

async function loadProgramParticipant(
  prisma: LearnerAccessLoaderPrisma,
  identity: LearnerAccessIdentity | null | undefined,
  programIds: readonly string[],
) {
  if (!identity || programIds.length === 0) {
    return null;
  }

  return prisma.programParticipant.findFirst({
    where: {
      userId: identity.userId,
      programId: { in: programIds },
    },
    select: learnerAccessProgramParticipantSelect,
    orderBy: [{ joinedAt: "desc" }, { createdAt: "desc" }],
  });
}

async function loadCohortParticipant(
  prisma: LearnerAccessLoaderPrisma,
  identity: LearnerAccessIdentity | null | undefined,
  cohortIds: readonly string[],
) {
  if (!identity || cohortIds.length === 0) {
    return null;
  }

  return prisma.cohortParticipant.findFirst({
    where: {
      userId: identity.userId,
      cohortId: { in: cohortIds },
    },
    select: learnerAccessCohortParticipantSelect,
    orderBy: [{ joinedAt: "desc" }, { createdAt: "desc" }],
  });
}

function getProgramIds(version: SafeCourseVersionRecord) {
  return uniqueStrings(
    version.cohortCourses.map((cohortCourse) => cohortCourse.cohort.programId),
  );
}

function getCohortIds(version: SafeCourseVersionRecord) {
  return uniqueStrings(
    version.cohortCourses.map((cohortCourse) => cohortCourse.cohortId),
  );
}

function mergeIds(
  baseIds: readonly string[],
  ...extraIds: (string | null | undefined)[]
) {
  return uniqueStrings([...baseIds, ...extraIds]);
}

function uniqueStrings(values: readonly (string | null | undefined)[]) {
  return [...new Set(values.filter(isString))];
}

function isString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

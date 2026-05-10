import {
  buildInferredEnrollmentCandidate,
  type InferredEnrollmentCandidate,
} from "./enrollment-backfill";

export const backfillCourseVersionSelect = {
  id: true,
  courseId: true,
  course: {
    select: {
      organizationId: true,
    },
  },
  modules: {
    select: {
      lessons: {
        select: {
          id: true,
        },
      },
    },
  },
} as const;

export const backfillExistingEnrollmentSelect = {
  id: true,
  source: true,
  userId: true,
  courseVersionId: true,
} as const;

export const backfillLessonProgressSelect = {
  userId: true,
  courseVersionId: true,
  startedAt: true,
  completedAt: true,
} as const;

export const backfillFinalTestAttemptSelect = {
  userId: true,
  courseVersionId: true,
  submittedAt: true,
  passed: true,
} as const;

export const backfillCertificateSelect = {
  userId: true,
  courseVersionId: true,
  issuedAt: true,
  revokedAt: true,
} as const;

export const backfillProofSubmissionSelect = {
  userId: true,
  courseVersionId: true,
  submittedAt: true,
} as const;

export type EnrollmentBackfillLoaderInput = {
  userIds?: readonly string[];
  courseVersionIds?: readonly string[];
};

type FindManyArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

type CourseVersionBackfillRecord = {
  id: string;
  courseId: string;
  course: {
    organizationId: string;
  };
  modules: {
    lessons: {
      id: string;
    }[];
  }[];
};

type ExistingEnrollmentRecord = {
  id: string;
  source?: string | null;
  userId: string;
  courseVersionId: string;
};

type LessonProgressRecord = {
  userId: string;
  courseVersionId: string;
  startedAt: Date;
  completedAt: Date | null;
};

type FinalTestAttemptRecord = {
  userId: string;
  courseVersionId: string;
  submittedAt: Date;
  passed: boolean;
};

type CertificateRecord = {
  userId: string;
  courseVersionId: string;
  issuedAt: Date;
  revokedAt: Date | null;
};

type ProofSubmissionRecord = {
  userId: string;
  courseVersionId: string;
  submittedAt: Date;
};

export type EnrollmentBackfillLoaderPrisma = {
  courseVersion: {
    findMany(args: FindManyArgs): Promise<CourseVersionBackfillRecord[]>;
  };
  learnerEnrollment: {
    findMany(args: FindManyArgs): Promise<ExistingEnrollmentRecord[]>;
  };
  learnerLessonProgress: {
    findMany(args: FindManyArgs): Promise<LessonProgressRecord[]>;
  };
  learnerFinalTestAttempt: {
    findMany(args: FindManyArgs): Promise<FinalTestAttemptRecord[]>;
  };
  learnerCertificate: {
    findMany(args: FindManyArgs): Promise<CertificateRecord[]>;
  };
  learnerPracticalProofSubmission: {
    findMany(args: FindManyArgs): Promise<ProofSubmissionRecord[]>;
  };
};

type ActivityGroup = {
  userId: string;
  courseVersionId: string;
  lessonProgress: LessonProgressRecord[];
  finalTestAttempts: FinalTestAttemptRecord[];
  certificates: CertificateRecord[];
  proofSubmissions: ProofSubmissionRecord[];
};

export async function loadInferredEnrollmentBackfillCandidates(
  prisma: EnrollmentBackfillLoaderPrisma,
  input: EnrollmentBackfillLoaderInput = {},
): Promise<InferredEnrollmentCandidate[]> {
  const where = buildActivityWhere(input);
  const versions = await prisma.courseVersion.findMany({
    where: buildCourseVersionWhere(input),
    select: backfillCourseVersionSelect,
  });
  const versionById = new Map(versions.map((version) => [version.id, version]));

  const [existingEnrollments, lessonProgress, finalTestAttempts, certificates, proofSubmissions] =
    await Promise.all([
      prisma.learnerEnrollment.findMany({
        where,
        select: backfillExistingEnrollmentSelect,
      }),
      prisma.learnerLessonProgress.findMany({
        where,
        select: backfillLessonProgressSelect,
        orderBy: { startedAt: "asc" },
      }),
      prisma.learnerFinalTestAttempt.findMany({
        where,
        select: backfillFinalTestAttemptSelect,
        orderBy: { submittedAt: "asc" },
      }),
      prisma.learnerCertificate.findMany({
        where,
        select: backfillCertificateSelect,
        orderBy: { issuedAt: "asc" },
      }),
      prisma.learnerPracticalProofSubmission.findMany({
        where,
        select: backfillProofSubmissionSelect,
        orderBy: { submittedAt: "asc" },
      }),
    ]);

  const existingEnrollmentByKey = new Map(
    existingEnrollments.map((enrollment) => [
      activityKey(enrollment.userId, enrollment.courseVersionId),
      enrollment,
    ]),
  );
  const groups = groupActivity([
    ...lessonProgress,
    ...finalTestAttempts,
    ...certificates,
    ...proofSubmissions,
  ]);

  return [...groups.values()]
    .map((group) => {
      const version = versionById.get(group.courseVersionId);

      if (!version) {
        return null;
      }

      return buildInferredEnrollmentCandidate({
        userId: group.userId,
        courseId: version.courseId,
        courseVersionId: group.courseVersionId,
        organizationId: version.course.organizationId,
        totalLessons: countLessons(version),
        lessonProgress: group.lessonProgress,
        finalTestAttempts: group.finalTestAttempts,
        certificates: group.certificates,
        proofSubmissions: group.proofSubmissions,
        existingEnrollment: existingEnrollmentByKey.get(
          activityKey(group.userId, group.courseVersionId),
        ),
      });
    })
    .filter(isCandidate);
}

function groupActivity(
  records: (
    | LessonProgressRecord
    | FinalTestAttemptRecord
    | CertificateRecord
    | ProofSubmissionRecord
  )[],
) {
  const groups = new Map<string, ActivityGroup>();

  records.forEach((record) => {
    const key = activityKey(record.userId, record.courseVersionId);
    const group =
      groups.get(key) ??
      {
        userId: record.userId,
        courseVersionId: record.courseVersionId,
        lessonProgress: [],
        finalTestAttempts: [],
        certificates: [],
        proofSubmissions: [],
      };

    if ("completedAt" in record) {
      group.lessonProgress.push(record);
    } else if ("passed" in record) {
      group.finalTestAttempts.push(record);
    } else if ("revokedAt" in record) {
      group.certificates.push(record);
    } else {
      group.proofSubmissions.push(record);
    }

    groups.set(key, group);
  });

  return groups;
}

function buildActivityWhere(input: EnrollmentBackfillLoaderInput) {
  return {
    ...(input.userIds?.length ? { userId: { in: [...input.userIds] } } : {}),
    ...(input.courseVersionIds?.length
      ? { courseVersionId: { in: [...input.courseVersionIds] } }
      : {}),
  };
}

function buildCourseVersionWhere(input: EnrollmentBackfillLoaderInput) {
  return input.courseVersionIds?.length
    ? { id: { in: [...input.courseVersionIds] } }
    : {};
}

function countLessons(version: CourseVersionBackfillRecord) {
  return version.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
}

function activityKey(userId: string, courseVersionId: string) {
  return `${userId}:${courseVersionId}`;
}

function isCandidate(
  candidate: InferredEnrollmentCandidate | null,
): candidate is InferredEnrollmentCandidate {
  return candidate !== null;
}

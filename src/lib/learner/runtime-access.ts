import {
  loadLearnerAccessDecision,
  type LearnerAccessLoaderPrisma,
} from "./access-loader";
import type {
  LearnerAccessAction,
  LearnerAccessDecision,
  LearnerAccessIdentity,
  LearnerAccessReasonCode,
} from "./access-decision";
import {
  isPublicEligibleCourseVersion,
  publicSelfEnrollmentVersionSelect,
  type PublicEligibilityVersion,
} from "./self-enrollment";

export type LearnerRuntimeRequiredAction = Extract<
  LearnerAccessAction,
  "OPEN_COURSE" | "OPEN_LESSON" | "SUBMIT_FINAL_TEST" | "SUBMIT_PROOF"
>;

type FindFirstArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, string> | Record<string, string>[];
};

export type LearnerRuntimeAccessPrisma = {
  courseVersion: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
  };
  learnerEnrollment: {
    findFirst(args: FindFirstArgs): Promise<unknown>;
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
};

export type LearnerRuntimeAccessInput = {
  courseId: string;
  identity: LearnerAccessIdentity;
  requiredAction: LearnerRuntimeRequiredAction;
  lessonId?: string;
  courseVersionId?: string;
  now?: Date;
};

export type LearnerRuntimeAccessResult = {
  allowed: boolean;
  reason: LearnerAccessReasonCode | "COURSE_VERSION_NOT_FOUND";
  courseId: string;
  courseVersionId?: string;
  publicEligible: boolean;
  legacyOrganizationAccess: boolean;
  decision?: LearnerAccessDecision;
};

export async function loadLearnerRuntimeAccess(
  prisma: LearnerRuntimeAccessPrisma,
  input: LearnerRuntimeAccessInput,
): Promise<LearnerRuntimeAccessResult> {
  const version = (await prisma.courseVersion.findFirst({
    where: {
      courseId: input.courseId,
      status: "PUBLISHED",
      ...(input.courseVersionId ? { id: input.courseVersionId } : {}),
      ...(input.lessonId
        ? {
            modules: {
              some: {
                lessons: {
                  some: {
                    id: input.lessonId,
                  },
                },
              },
            },
          }
        : {}),
    },
    select: publicSelfEnrollmentVersionSelect,
    orderBy: [{ publishedAt: "desc" }, { versionNumber: "desc" }],
  })) as PublicEligibilityVersion | null;

  if (!version) {
    return {
      allowed: false,
      reason: "COURSE_VERSION_NOT_FOUND",
      courseId: input.courseId,
      publicEligible: false,
      legacyOrganizationAccess: false,
    };
  }

  const publicEligible = isPublicEligibleCourseVersion(version);
  const access = await loadLearnerAccessDecision(
    prisma as unknown as LearnerAccessLoaderPrisma,
    {
      courseId: input.courseId,
      courseVersionId: version.id,
      identity: input.identity,
      now: input.now,
    },
  );
  const decision = access?.decision;
  const hasRequiredAction = Boolean(
    decision?.allowedActions.includes(input.requiredAction),
  );
  const legacyOrganizationAccess =
    !publicEligible &&
    version.course.organizationId === input.identity.organizationId;

  return {
    allowed: publicEligible
      ? hasRequiredAction
      : hasRequiredAction || legacyOrganizationAccess,
    reason: decision?.reasonCode ?? "COURSE_VERSION_NOT_FOUND",
    courseId: version.course.id,
    courseVersionId: version.id,
    publicEligible,
    legacyOrganizationAccess,
    decision,
  };
}

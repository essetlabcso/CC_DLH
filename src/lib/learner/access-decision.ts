export type LearnerAccessModel =
  | "public-open"
  | "public-registration-required"
  | "organization-assigned"
  | "program-assigned"
  | "cohort-assigned"
  | "invitation-only"
  | "private-internal"
  | "pilot-restricted";

export type LearnerAccessAction =
  | "VIEW_PUBLIC_CATALOG_CARD"
  | "SIGN_IN"
  | "REGISTER"
  | "SELF_ENROLL"
  | "ACCEPT_INVITATION"
  | "OPEN_COURSE"
  | "OPEN_LESSON"
  | "SUBMIT_FINAL_TEST"
  | "SUBMIT_PROOF"
  | "VIEW_CERTIFICATE"
  | "CONTACT_ADMIN";

export type LearnerAccessReasonCode =
  | "COURSE_NOT_ACTIVE"
  | "VERSION_NOT_PUBLISHED"
  | "SIGN_IN_REQUIRED"
  | "PUBLIC_SELF_ENROLL_AVAILABLE"
  | "PUBLIC_ENROLLED"
  | "ORGANIZATION_MEMBERSHIP_REQUIRED"
  | "ORGANIZATION_ASSIGNMENT_REQUIRED"
  | "PROGRAM_ASSIGNMENT_REQUIRED"
  | "COHORT_ASSIGNMENT_REQUIRED"
  | "INVITATION_REQUIRED"
  | "INVITATION_PENDING_ACCEPTANCE"
  | "INVITATION_EXPIRED"
  | "PRIVATE_ASSIGNMENT_REQUIRED"
  | "PILOT_ASSIGNMENT_REQUIRED"
  | "ENROLLMENT_ACTIVE"
  | "ENROLLMENT_STARTED"
  | "ENROLLMENT_COMPLETED"
  | "ENROLLMENT_WITHDRAWN"
  | "ENROLLMENT_EXPIRED"
  | "ENROLLMENT_CANCELLED"
  | "ENROLLMENT_SUSPENDED";

export type CourseAccessModeLike =
  | "PUBLIC_OPEN"
  | "PUBLIC_REGISTRATION_REQUIRED"
  | "MEMBER_CSO_ONLY"
  | "PROGRAM_ASSIGNED"
  | "COHORT_ASSIGNED"
  | "PRIVATE_INTERNAL"
  | "PILOT_RESTRICTED";

export type EnrollmentModeLike =
  | "SELF_ENROLL"
  | "ASSIGNED"
  | "INVITATION_ONLY"
  | "ADMIN_ENROLL";

export type CourseStatusLike = "ACTIVE" | "ARCHIVED" | string;
export type CourseVersionStatusLike =
  | "DRAFT"
  | "CREATOR_REVIEW"
  | "SUBMITTED"
  | "RETURNED"
  | "APPROVED"
  | "PUBLISHED"
  | "REVISION_DRAFT"
  | "REPLACED"
  | "ARCHIVED"
  | string;

export type LearnerEnrollmentStatusLike =
  | "INVITED"
  | "ASSIGNED"
  | "ENROLLED"
  | "STARTED"
  | "COMPLETED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED";

export type LearnerInvitationStatusLike =
  | "CREATED"
  | "SENT"
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "EXPIRED"
  | "CANCELLED"
  | "REVOKED";

export type LearnerParticipantStatusLike =
  | "ASSIGNED"
  | "ACTIVE"
  | "COMPLETED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED";

export type LearnerAccessIdentity = {
  userId: string;
  organizationId: string;
  roles?: readonly string[];
};

export type LearnerAccessEnrollment = {
  id: string;
  status: LearnerEnrollmentStatusLike;
  programId?: string | null;
  cohortId?: string | null;
  invitationId?: string | null;
};

export type LearnerAccessInvitation = {
  id: string;
  status: LearnerInvitationStatusLike;
  programId?: string | null;
  cohortId?: string | null;
  courseId?: string | null;
  courseVersionId?: string | null;
  expiresAt?: Date | string | null;
};

export type LearnerAccessParticipant = {
  id: string;
  status: LearnerParticipantStatusLike;
  programId?: string | null;
  cohortId?: string | null;
  organizationId?: string | null;
};

export type LearnerAccessDecisionInput = {
  now?: Date;
  identity?: LearnerAccessIdentity | null;
  course: {
    id: string;
    organizationId: string;
    status: CourseStatusLike;
    accessMode: CourseAccessModeLike;
    publicCatalogVisible?: boolean | null;
  };
  version: {
    id: string;
    status: CourseVersionStatusLike;
    publishedAt?: Date | null;
  };
  setup?: {
    accessMode?: CourseAccessModeLike | null;
    enrollmentMode?: EnrollmentModeLike | null;
    publicCatalogVisible?: boolean | null;
    memberCatalogVisible?: boolean | null;
    requiresProgramAssignment?: boolean | null;
    requiresCohortAssignment?: boolean | null;
  } | null;
  enrollment?: LearnerAccessEnrollment | null;
  invitation?: LearnerAccessInvitation | null;
  programParticipant?: LearnerAccessParticipant | null;
  cohortParticipant?: LearnerAccessParticipant | null;
};

export type LearnerAccessDecision = {
  allowed: boolean;
  reasonCode: LearnerAccessReasonCode;
  accessModel: LearnerAccessModel;
  allowedActions: LearnerAccessAction[];
  learnerMessage: string;
  auditContext: {
    courseId: string;
    courseVersionId: string;
    userId?: string;
    enrollmentId?: string;
    invitationId?: string;
    programId?: string;
    cohortId?: string;
  };
};

const activeEnrollmentStatuses = new Set<LearnerEnrollmentStatusLike>([
  "ASSIGNED",
  "ENROLLED",
  "STARTED",
  "COMPLETED",
]);

const blockedEnrollmentReason: Partial<
  Record<LearnerEnrollmentStatusLike, LearnerAccessReasonCode>
> = {
  WITHDRAWN: "ENROLLMENT_WITHDRAWN",
  EXPIRED: "ENROLLMENT_EXPIRED",
  CANCELLED: "ENROLLMENT_CANCELLED",
  SUSPENDED: "ENROLLMENT_SUSPENDED",
};

const activeParticipantStatuses = new Set<LearnerParticipantStatusLike>([
  "ASSIGNED",
  "ACTIVE",
  "COMPLETED",
]);

export function resolveLearnerAccess(
  input: LearnerAccessDecisionInput,
): LearnerAccessDecision {
  const accessModel = resolveAccessModel(input);
  const auditContext = buildAuditContext(input);

  if (input.course.status !== "ACTIVE") {
    return block(input, accessModel, "COURSE_NOT_ACTIVE", [
      "This course is not currently active.",
    ]);
  }

  if (input.version.status !== "PUBLISHED") {
    return block(input, accessModel, "VERSION_NOT_PUBLISHED", [
      "This course version is not published for learners yet.",
    ]);
  }

  const enrollmentDecision = decideFromEnrollment(input, accessModel);

  if (enrollmentDecision) {
    return enrollmentDecision;
  }

  switch (accessModel) {
    case "public-open":
      return decidePublicOpen(input, auditContext);
    case "public-registration-required":
      return decidePublicRegistrationRequired(input, auditContext);
    case "organization-assigned":
      return decideOrganizationAssigned(input, auditContext);
    case "program-assigned":
      return decideProgramAssigned(input, auditContext);
    case "cohort-assigned":
      return decideCohortAssigned(input, auditContext);
    case "invitation-only":
      return decideInvitationOnly(input, auditContext);
    case "private-internal":
      return block(input, accessModel, "PRIVATE_ASSIGNMENT_REQUIRED", [
        "This course requires a private assignment before it can be opened.",
      ]);
    case "pilot-restricted":
      return block(input, accessModel, "PILOT_ASSIGNMENT_REQUIRED", [
        "This course is limited to assigned pilot participants.",
      ]);
  }
}

export function toLearnerAccessModel(
  accessMode: CourseAccessModeLike,
): LearnerAccessModel {
  if (accessMode === "PUBLIC_OPEN") {
    return "public-open";
  }

  if (accessMode === "PUBLIC_REGISTRATION_REQUIRED") {
    return "public-registration-required";
  }

  if (accessMode === "PROGRAM_ASSIGNED") {
    return "program-assigned";
  }

  if (accessMode === "COHORT_ASSIGNED") {
    return "cohort-assigned";
  }

  if (accessMode === "PRIVATE_INTERNAL") {
    return "private-internal";
  }

  if (accessMode === "PILOT_RESTRICTED") {
    return "pilot-restricted";
  }

  return "organization-assigned";
}

function resolveAccessModel(input: LearnerAccessDecisionInput) {
  if (input.setup?.enrollmentMode === "INVITATION_ONLY") {
    return "invitation-only";
  }

  return toLearnerAccessModel(input.setup?.accessMode ?? input.course.accessMode);
}

function decideFromEnrollment(
  input: LearnerAccessDecisionInput,
  accessModel: LearnerAccessModel,
) {
  const enrollment = input.enrollment;

  if (!enrollment) {
    return null;
  }

  const blockedReason = blockedEnrollmentReason[enrollment.status];

  if (blockedReason) {
    return block(input, accessModel, blockedReason, [
      blockedEnrollmentMessage(enrollment.status),
    ]);
  }

  if (!activeEnrollmentStatuses.has(enrollment.status)) {
    return null;
  }

  const reasonCode = enrollmentReasonCode(enrollment.status, accessModel);

  return allow(input, accessModel, reasonCode, learnerRuntimeActions(reasonCode), [
    enrollment.status === "COMPLETED"
      ? "You have completed this enrollment and can return to your learning record."
      : "You can open this assigned learning.",
  ]);
}

function decidePublicOpen(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  if (!input.identity) {
    return {
      allowed: true,
      reasonCode: "SIGN_IN_REQUIRED",
      accessModel: "public-open",
      allowedActions: ["VIEW_PUBLIC_CATALOG_CARD", "SIGN_IN", "REGISTER"],
      learnerMessage: "Sign in or register to start this public course.",
      auditContext,
    } satisfies LearnerAccessDecision;
  }

  return allow(input, "public-open", "PUBLIC_SELF_ENROLL_AVAILABLE", [
    "SELF_ENROLL",
  ], [
    "You can self-enroll in this public course.",
  ]);
}

function decidePublicRegistrationRequired(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  if (!input.identity) {
    return {
      allowed: true,
      reasonCode: "SIGN_IN_REQUIRED",
      accessModel: "public-registration-required",
      allowedActions: ["VIEW_PUBLIC_CATALOG_CARD", "SIGN_IN", "REGISTER"],
      learnerMessage: "Register or sign in before starting this course.",
      auditContext,
    } satisfies LearnerAccessDecision;
  }

  return allow(
    input,
    "public-registration-required",
    "PUBLIC_SELF_ENROLL_AVAILABLE",
    ["SELF_ENROLL"],
    ["You can enroll after confirming your registration."],
  );
}

function decideOrganizationAssigned(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  if (!input.identity) {
    return {
      allowed: false,
      reasonCode: "SIGN_IN_REQUIRED",
      accessModel: "organization-assigned",
      allowedActions: ["SIGN_IN"],
      learnerMessage: "Sign in with an eligible organization account.",
      auditContext,
    } satisfies LearnerAccessDecision;
  }

  if (input.identity.organizationId !== input.course.organizationId) {
    return block(input, "organization-assigned", "ORGANIZATION_MEMBERSHIP_REQUIRED", [
      "This course is limited to learners from an eligible organization.",
    ]);
  }

  return block(input, "organization-assigned", "ORGANIZATION_ASSIGNMENT_REQUIRED", [
    "This course requires an organization assignment before it can be opened.",
  ]);
}

function decideProgramAssigned(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  if (!input.identity) {
    return {
      allowed: false,
      reasonCode: "SIGN_IN_REQUIRED",
      accessModel: "program-assigned",
      allowedActions: ["SIGN_IN"],
      learnerMessage: "Sign in with an eligible program account.",
      auditContext,
    } satisfies LearnerAccessDecision;
  }

  if (isActiveParticipant(input.programParticipant)) {
    return allow(input, "program-assigned", "ENROLLMENT_ACTIVE", [
      "OPEN_COURSE",
    ], [
      "You can open this program-assigned learning.",
    ]);
  }

  return block(input, "program-assigned", "PROGRAM_ASSIGNMENT_REQUIRED", [
    "This course requires program assignment before it can be opened.",
  ]);
}

function decideCohortAssigned(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  if (!input.identity) {
    return {
      allowed: false,
      reasonCode: "SIGN_IN_REQUIRED",
      accessModel: "cohort-assigned",
      allowedActions: ["SIGN_IN"],
      learnerMessage: "Sign in with an eligible cohort account.",
      auditContext,
    } satisfies LearnerAccessDecision;
  }

  if (isActiveParticipant(input.cohortParticipant)) {
    return allow(input, "cohort-assigned", "ENROLLMENT_ACTIVE", [
      "OPEN_COURSE",
    ], [
      "You can open this cohort-assigned learning.",
    ]);
  }

  return block(input, "cohort-assigned", "COHORT_ASSIGNMENT_REQUIRED", [
    "This course requires cohort assignment before it can be opened.",
  ]);
}

function decideInvitationOnly(
  input: LearnerAccessDecisionInput,
  auditContext: LearnerAccessDecision["auditContext"],
) {
  const invitation = input.invitation;

  if (!invitation) {
    return block(input, "invitation-only", "INVITATION_REQUIRED", [
      "This course requires an invitation.",
    ]);
  }

  if (invitation.status === "ACCEPTED") {
    return allow(input, "invitation-only", "ENROLLMENT_ACTIVE", [
      "OPEN_COURSE",
    ], [
      "Your invitation has been accepted and this course can be opened.",
    ]);
  }

  if (invitation.status === "EXPIRED" || hasInvitationExpired(input)) {
    return block(input, "invitation-only", "INVITATION_EXPIRED", [
      "This invitation has expired. Contact an administrator if access is still needed.",
    ]);
  }

  if (["CANCELLED", "REVOKED"].includes(invitation.status)) {
    return block(input, "invitation-only", "INVITATION_REQUIRED", [
      "This invitation is no longer active.",
    ]);
  }

  return {
    allowed: false,
    reasonCode: "INVITATION_PENDING_ACCEPTANCE",
    accessModel: "invitation-only",
    allowedActions: ["ACCEPT_INVITATION"],
    learnerMessage: "Accept the invitation before opening this course.",
    auditContext,
  } satisfies LearnerAccessDecision;
}

function allow(
  input: LearnerAccessDecisionInput,
  accessModel: LearnerAccessModel,
  reasonCode: LearnerAccessReasonCode,
  allowedActions: LearnerAccessAction[],
  messageParts: string[],
): LearnerAccessDecision {
  return {
    allowed: true,
    reasonCode,
    accessModel,
    allowedActions,
    learnerMessage: messageParts.join(" "),
    auditContext: buildAuditContext(input),
  };
}

function block(
  input: LearnerAccessDecisionInput,
  accessModel: LearnerAccessModel,
  reasonCode: LearnerAccessReasonCode,
  messageParts: string[],
): LearnerAccessDecision {
  return {
    allowed: false,
    reasonCode,
    accessModel,
    allowedActions: defaultBlockedActions(input),
    learnerMessage: messageParts.join(" "),
    auditContext: buildAuditContext(input),
  };
}

function defaultBlockedActions(input: LearnerAccessDecisionInput) {
  return input.identity
    ? (["CONTACT_ADMIN"] satisfies LearnerAccessAction[])
    : (["SIGN_IN"] satisfies LearnerAccessAction[]);
}

function learnerRuntimeActions(reasonCode: LearnerAccessReasonCode) {
  const actions: LearnerAccessAction[] = [
    "OPEN_COURSE",
    "OPEN_LESSON",
    "SUBMIT_FINAL_TEST",
    "SUBMIT_PROOF",
  ];

  if (reasonCode === "ENROLLMENT_COMPLETED") {
    actions.push("VIEW_CERTIFICATE");
  }

  return actions;
}

function enrollmentReasonCode(
  status: LearnerEnrollmentStatusLike,
  accessModel: LearnerAccessModel,
): LearnerAccessReasonCode {
  if (status === "STARTED") {
    return "ENROLLMENT_STARTED";
  }

  if (status === "COMPLETED") {
    return "ENROLLMENT_COMPLETED";
  }

  if (
    status === "ENROLLED" &&
    (accessModel === "public-open" ||
      accessModel === "public-registration-required")
  ) {
    return "PUBLIC_ENROLLED";
  }

  return "ENROLLMENT_ACTIVE";
}

function blockedEnrollmentMessage(status: LearnerEnrollmentStatusLike) {
  if (status === "WITHDRAWN") {
    return "This enrollment has been withdrawn.";
  }

  if (status === "EXPIRED") {
    return "This enrollment has expired.";
  }

  if (status === "CANCELLED") {
    return "This enrollment has been cancelled.";
  }

  return "This enrollment is currently suspended.";
}

function isActiveParticipant(
  participant: LearnerAccessParticipant | null | undefined,
) {
  return Boolean(
    participant && activeParticipantStatuses.has(participant.status),
  );
}

function hasInvitationExpired(input: LearnerAccessDecisionInput) {
  const expiresAt = input.invitation?.expiresAt;

  if (!expiresAt) {
    return false;
  }

  return new Date(expiresAt).getTime() <= (input.now ?? new Date()).getTime();
}

function buildAuditContext(input: LearnerAccessDecisionInput) {
  return {
    courseId: input.course.id,
    courseVersionId: input.version.id,
    userId: input.identity?.userId,
    enrollmentId: input.enrollment?.id,
    invitationId: input.invitation?.id ?? input.enrollment?.invitationId ?? undefined,
    programId:
      input.programParticipant?.programId ??
      input.enrollment?.programId ??
      input.invitation?.programId ??
      undefined,
    cohortId:
      input.cohortParticipant?.cohortId ??
      input.enrollment?.cohortId ??
      input.invitation?.cohortId ??
      undefined,
  };
}

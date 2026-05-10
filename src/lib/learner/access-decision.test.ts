import { describe, expect, it } from "vitest";

import {
  resolveLearnerAccess,
  toLearnerAccessModel,
  type LearnerAccessDecisionInput,
  type LearnerEnrollmentStatusLike,
} from "./access-decision";

const baseInput: LearnerAccessDecisionInput = {
  now: new Date("2026-05-10T09:00:00.000Z"),
  identity: {
    userId: "learner-1",
    organizationId: "org-1",
    roles: ["learner"],
  },
  course: {
    id: "course-1",
    organizationId: "org-1",
    status: "ACTIVE",
    accessMode: "MEMBER_CSO_ONLY",
    publicCatalogVisible: false,
  },
  version: {
    id: "version-1",
    status: "PUBLISHED",
    publishedAt: new Date("2026-05-01T09:00:00.000Z"),
  },
};

describe("learner access decision foundation", () => {
  it("maps legacy member CSO mode to organization-assigned product language", () => {
    expect(toLearnerAccessModel("MEMBER_CSO_ONLY")).toBe(
      "organization-assigned",
    );
  });

  it("allows public-open catalogue discovery before sign-in", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      identity: null,
      course: {
        ...baseInput.course,
        accessMode: "PUBLIC_OPEN",
        publicCatalogVisible: true,
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      accessModel: "public-open",
      reasonCode: "SIGN_IN_REQUIRED",
    });
    expect(decision.allowedActions).toContain("VIEW_PUBLIC_CATALOG_CARD");
    expect(decision.allowedActions).toContain("SIGN_IN");
  });

  it("offers self-enrollment for signed-in public-open learners", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PUBLIC_OPEN",
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      reasonCode: "PUBLIC_SELF_ENROLL_AVAILABLE",
    });
    expect(decision.allowedActions).toEqual(["SELF_ENROLL"]);
  });

  it("requires registration before public-registration-required access", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      identity: null,
      course: {
        ...baseInput.course,
        accessMode: "PUBLIC_REGISTRATION_REQUIRED",
        publicCatalogVisible: true,
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      accessModel: "public-registration-required",
      reasonCode: "SIGN_IN_REQUIRED",
    });
    expect(decision.allowedActions).toContain("REGISTER");
  });

  it("requires explicit organization assignment for organization-assigned access", () => {
    const decision = resolveLearnerAccess(baseInput);

    expect(decision).toMatchObject({
      allowed: false,
      accessModel: "organization-assigned",
      reasonCode: "ORGANIZATION_ASSIGNMENT_REQUIRED",
    });
  });

  it("requires matching organization membership before organization assignment can matter", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      identity: {
        userId: "learner-2",
        organizationId: "org-2",
      },
    });

    expect(decision).toMatchObject({
      allowed: false,
      reasonCode: "ORGANIZATION_MEMBERSHIP_REQUIRED",
    });
  });

  it("allows active program participants into program-assigned learning", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PROGRAM_ASSIGNED",
      },
      programParticipant: {
        id: "program-participant-1",
        status: "ACTIVE",
        programId: "program-1",
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      accessModel: "program-assigned",
      reasonCode: "ENROLLMENT_ACTIVE",
    });
    expect(decision.allowedActions).toContain("OPEN_COURSE");
    expect(decision.auditContext.programId).toBe("program-1");
  });

  it("blocks program-assigned learning without program participant status", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PROGRAM_ASSIGNED",
      },
    });

    expect(decision).toMatchObject({
      allowed: false,
      reasonCode: "PROGRAM_ASSIGNMENT_REQUIRED",
    });
  });

  it("allows active cohort participants into cohort-assigned learning", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "COHORT_ASSIGNED",
      },
      cohortParticipant: {
        id: "cohort-participant-1",
        status: "ASSIGNED",
        cohortId: "cohort-1",
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      accessModel: "cohort-assigned",
      reasonCode: "ENROLLMENT_ACTIVE",
    });
    expect(decision.auditContext.cohortId).toBe("cohort-1");
  });

  it("requires accepted invitations for invitation-only learning", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PRIVATE_INTERNAL",
      },
      setup: {
        accessMode: "PRIVATE_INTERNAL",
        enrollmentMode: "INVITATION_ONLY",
      },
    });

    expect(decision).toMatchObject({
      allowed: false,
      accessModel: "invitation-only",
      reasonCode: "INVITATION_REQUIRED",
    });

    const invitationDecision = resolveLearnerAccess({
      ...baseInput,
      setup: {
        accessMode: "PRIVATE_INTERNAL",
        enrollmentMode: "INVITATION_ONLY",
      },
      course: {
        ...baseInput.course,
        accessMode: "PRIVATE_INTERNAL",
      },
      invitation: {
        id: "invitation-1",
        status: "PENDING_ACCEPTANCE",
      },
    });

    expect(invitationDecision).toMatchObject({
      accessModel: "invitation-only",
      reasonCode: "INVITATION_PENDING_ACCEPTANCE",
    });
  });

  it("allows accepted invitation-only access when the course mode is invitation-only", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PRIVATE_INTERNAL",
      },
      setup: {
        accessMode: "PRIVATE_INTERNAL",
        enrollmentMode: "INVITATION_ONLY",
      },
      enrollment: {
        id: "enrollment-1",
        status: "ENROLLED",
        invitationId: "invitation-1",
      },
      invitation: {
        id: "invitation-1",
        status: "ACCEPTED",
      },
    });

    expect(decision).toMatchObject({
      allowed: true,
      accessModel: "invitation-only",
      reasonCode: "ENROLLMENT_ACTIVE",
    });
    expect(decision.auditContext.invitationId).toBe("invitation-1");
  });

  it("blocks private-internal learning without assignment", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PRIVATE_INTERNAL",
      },
    });

    expect(decision).toMatchObject({
      allowed: false,
      accessModel: "private-internal",
      reasonCode: "PRIVATE_ASSIGNMENT_REQUIRED",
    });
  });

  it("blocks pilot-restricted learning without assignment", () => {
    const decision = resolveLearnerAccess({
      ...baseInput,
      course: {
        ...baseInput.course,
        accessMode: "PILOT_RESTRICTED",
      },
    });

    expect(decision).toMatchObject({
      allowed: false,
      accessModel: "pilot-restricted",
      reasonCode: "PILOT_ASSIGNMENT_REQUIRED",
    });
  });

  it.each([
    ["WITHDRAWN", "ENROLLMENT_WITHDRAWN"],
    ["EXPIRED", "ENROLLMENT_EXPIRED"],
    ["CANCELLED", "ENROLLMENT_CANCELLED"],
    ["SUSPENDED", "ENROLLMENT_SUSPENDED"],
  ] as const)(
    "blocks %s enrollments before access-model fallback",
    (status, reasonCode) => {
      const decision = resolveLearnerAccess({
        ...baseInput,
        course: {
          ...baseInput.course,
          accessMode: "PUBLIC_OPEN",
        },
        enrollment: {
          id: `enrollment-${status.toLowerCase()}`,
          status: status satisfies LearnerEnrollmentStatusLike,
        },
      });

      expect(decision).toMatchObject({
        allowed: false,
        reasonCode,
      });
      expect(decision.allowedActions).toEqual(["CONTACT_ADMIN"]);
    },
  );

  it("blocks inactive course and unpublished versions first", () => {
    expect(
      resolveLearnerAccess({
        ...baseInput,
        course: {
          ...baseInput.course,
          status: "ARCHIVED",
        },
      }).reasonCode,
    ).toBe("COURSE_NOT_ACTIVE");

    expect(
      resolveLearnerAccess({
        ...baseInput,
        version: {
          ...baseInput.version,
          status: "APPROVED",
        },
      }).reasonCode,
    ).toBe("VERSION_NOT_PUBLISHED");
  });
});

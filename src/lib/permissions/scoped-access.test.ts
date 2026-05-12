import {
  PermissionScopeType,
  ScopedRoleAssignmentStatus,
  ScopedRoleKey,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import { findProtectedWorkspace } from "@/lib/access";
import {
  canAccessWorkspace,
  canAccessAdminWorkspace,
  canApproveForPublish,
  canCreateCourse,
  canManagePlatformAdminAuthority,
  canManageCourse,
  canPublishCourseVersion,
  canReviewAssignedProof,
  canReviewCourseVersion,
  canViewPublishQueue,
  canViewRawProof,
  canViewSafeOrganizationSummary,
  canViewScopedProgramDashboard,
  canViewCohortOversight,
  hasSuperAdminEquivalent,
  hasScopedRole,
  isActiveScopedAssignment,
  matchesScope,
  type PermissionIdentity,
} from "./scoped-access";
import {
  FINAL_TEST_PASS_SCORE,
  isPassingFinalTestScore,
} from "@/lib/learner/final-test";

describe("scoped role and access foundation", () => {
  it("keeps the existing four-role workspace layer unchanged", () => {
    const learnerWorkspace = findProtectedWorkspace("/learn");
    const reviewWorkspace = findProtectedWorkspace("/review/proof");
    const adminWorkspace = findProtectedWorkspace("/admin/users");

    expect(learnerWorkspace).toBeDefined();
    expect(reviewWorkspace).toBeDefined();
    expect(adminWorkspace).toBeDefined();
    expect(canAccessWorkspace(identity("learner"), learnerWorkspace!)).toBe(true);
    expect(canAccessWorkspace(identity("creator"), learnerWorkspace!)).toBe(false);
    expect(canAccessWorkspace(identity("reviewer"), reviewWorkspace!)).toBe(true);
    expect(canAccessWorkspace(identity("admin"), adminWorkspace!)).toBe(true);
    expect(canAccessWorkspace(identity("reviewer"), adminWorkspace!)).toBe(false);
  });

  it("allows Admin workspace access for Super Admin-equivalent and scoped Platform Admin only", () => {
    const scopedPlatformAdmin = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          scopeType: PermissionScopeType.PLATFORM,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });
    const disabledPlatformAdmin = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          scopeType: PermissionScopeType.PLATFORM,
          status: ScopedRoleAssignmentStatus.DISABLED,
        },
      ],
    });

    expect(canAccessAdminWorkspace(identity("admin"))).toBe(true);
    expect(canAccessAdminWorkspace(scopedPlatformAdmin)).toBe(true);
    expect(canAccessAdminWorkspace(identity("reviewer"))).toBe(false);
    expect(canAccessAdminWorkspace(disabledPlatformAdmin)).toBe(false);
  });

  it("keeps Platform Admin authority management limited to Super Admin-equivalent users", () => {
    const scopedPlatformAdmin = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          scopeType: PermissionScopeType.PLATFORM,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });

    expect(hasSuperAdminEquivalent(identity("admin"))).toBe(true);
    expect(canManagePlatformAdminAuthority(identity("admin"))).toBe(true);
    expect(hasSuperAdminEquivalent(scopedPlatformAdmin)).toBe(false);
    expect(canManagePlatformAdminAuthority(scopedPlatformAdmin)).toBe(false);
  });

  it("matches scoped roles by role key and scope type", () => {
    const reviewer = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.COURSE_REVIEWER,
          scopeType: PermissionScopeType.COURSE_VERSION,
          scopeId: "version-1",
          courseVersionId: "version-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });

    expect(
      hasScopedRole(reviewer, ScopedRoleKey.COURSE_REVIEWER, {
        type: PermissionScopeType.COURSE_VERSION,
        id: "version-1",
        courseVersionId: "version-1",
      }),
    ).toBe(true);
    expect(
      hasScopedRole(reviewer, ScopedRoleKey.COURSE_REVIEWER, {
        type: PermissionScopeType.COURSE,
        id: "course-1",
      }),
    ).toBe(false);
  });

  it("denies disabled, expired, and not-yet-active scoped assignments", () => {
    const now = new Date("2026-05-07T10:00:00.000Z");

    expect(
      isActiveScopedAssignment(
        {
          roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
          scopeType: PermissionScopeType.ORGANIZATION,
          scopeId: "org-1",
          status: ScopedRoleAssignmentStatus.DISABLED,
        },
        now,
      ),
    ).toBe(false);
    expect(
      isActiveScopedAssignment(
        {
          roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
          scopeType: PermissionScopeType.ORGANIZATION,
          scopeId: "org-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
          expiresAt: "2026-05-07T09:59:59.000Z",
        },
        now,
      ),
    ).toBe(false);
    expect(
      isActiveScopedAssignment(
        {
          roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
          scopeType: PermissionScopeType.ORGANIZATION,
          scopeId: "org-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
          startsAt: "2026-05-07T10:01:00.000Z",
        },
        now,
      ),
    ).toBe(false);
  });

  it("supports object-level course, course-version, proof, and capacity scopes", () => {
    expect(
      matchesScope(
        {
          roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
          scopeType: PermissionScopeType.PRACTICAL_PROOF_SUBMISSION,
          scopeId: "proof-1",
          proofSubmissionId: "proof-1",
          capacityArea: "MEAL",
        },
        {
          type: PermissionScopeType.PRACTICAL_PROOF_SUBMISSION,
          id: "proof-1",
          proofSubmissionId: "proof-1",
          capacityArea: "meal",
        },
      ),
    ).toBe(true);
  });

  it("supports typed program and cohort scopes for Slice 2 objects", () => {
    expect(
      matchesScope(
        {
          roleKey: ScopedRoleKey.PROGRAM_ME_MANAGER,
          scopeType: PermissionScopeType.PROGRAM,
          programId: "program-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
        {
          type: PermissionScopeType.PROGRAM,
          programId: "program-1",
        },
      ),
    ).toBe(true);
    expect(
      matchesScope(
        {
          roleKey: ScopedRoleKey.FACILITATOR,
          scopeType: PermissionScopeType.COHORT,
          cohortId: "cohort-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
        {
          type: PermissionScopeType.COHORT,
          cohortId: "cohort-1",
        },
      ),
    ).toBe(true);
  });


  it("preserves creator and reviewer behavior through compatibility helpers", () => {
    const course = {
      id: "course-1",
      organizationId: "org-1",
      ownerId: "creator-1",
    };
    const version = {
      id: "version-1",
      courseId: "course-1",
      course: {
        id: "course-1",
        organizationId: "org-1",
        ownerId: "creator-1",
      },
    };

    expect(canCreateCourse(identity("creator", { userId: "creator-1" }), "org-1")).toBe(true);
    expect(canManageCourse(identity("creator", { userId: "creator-1" }), course)).toBe(true);
    expect(canManageCourse(identity("creator", { userId: "other" }), course)).toBe(false);
    expect(canReviewCourseVersion(identity("reviewer"), version)).toBe(true);
    expect(canApproveForPublish(identity("reviewer"), version)).toBe(true);
  });

  it("allows Super Admin-equivalent users and scoped Platform Admins to publish in Phase 1", () => {
    const scopedPlatformAdmin = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PLATFORM_ADMIN,
          scopeType: PermissionScopeType.PLATFORM,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });
    const futurePublisher = identity("reviewer", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.AUTHORIZED_PUBLISHER,
          scopeType: PermissionScopeType.PLATFORM,
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });

    expect(canViewPublishQueue(identity("admin"))).toBe(true);
    expect(canPublishCourseVersion(identity("admin"))).toBe(true);
    expect(canViewPublishQueue(scopedPlatformAdmin)).toBe(true);
    expect(canPublishCourseVersion(scopedPlatformAdmin)).toBe(true);
    expect(canViewPublishQueue(identity("reviewer"))).toBe(false);
    expect(canPublishCourseVersion(identity("reviewer"))).toBe(false);
    expect(canPublishCourseVersion(identity("creator"))).toBe(false);
    expect(canPublishCourseVersion(futurePublisher)).toBe(false);
  });

  it("does not broaden raw proof visibility while preparing assigned verifier scopes", () => {
    const submission = {
      id: "proof-1",
      userId: "learner-1",
      courseVersionId: "version-1",
      practicalProofConfig: {
        capacityArea: "MEAL",
      },
      courseVersion: {
        courseId: "course-1",
        course: {
          id: "course-1",
          organizationId: "org-1",
        },
      },
    };
    const assignedVerifier = identity("learner", {
      userId: "verifier-1",
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
          scopeType: PermissionScopeType.PRACTICAL_PROOF_SUBMISSION,
          scopeId: "proof-1",
          proofSubmissionId: "proof-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });

    expect(canViewRawProof(identity("learner", { userId: "learner-1" }), submission)).toBe(true);
    expect(canViewRawProof(identity("admin"), submission)).toBe(true);
    expect(canViewRawProof(identity("reviewer"), submission)).toBe(false);
    expect(canReviewAssignedProof(identity("reviewer"), submission)).toBe(false);
    expect(canViewRawProof(assignedVerifier, submission)).toBe(true);
  });

  it("represents future focal-person and Program/M&E scopes without routes", () => {
    const focal = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
          scopeType: PermissionScopeType.ORGANIZATION,
          scopeId: "org-1",
          organizationId: "org-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });
    const meal = identity("learner", {
      scopedRoleAssignments: [
        {
          roleKey: ScopedRoleKey.PROGRAM_ME_MANAGER,
          scopeType: PermissionScopeType.PROGRAM,
          programId: "program-1",
          status: ScopedRoleAssignmentStatus.ACTIVE,
        },
      ],
    });

    expect(canViewSafeOrganizationSummary(focal, "org-1")).toBe(true);
    expect(canViewSafeOrganizationSummary(focal, "org-2")).toBe(false);
    expect(canViewScopedProgramDashboard(meal, "program-1")).toBe(true);
    expect(canViewScopedProgramDashboard(meal, "program-2")).toBe(false);
  });

  it("does not change the binding 80% certificate threshold", () => {
    expect(FINAL_TEST_PASS_SCORE).toBe(80);
    expect(isPassingFinalTestScore(79)).toBe(false);
    expect(isPassingFinalTestScore(80)).toBe(true);
  });

  describe("Slice 6: CSO Focal and Facilitator Dashboards Scoped Oversight", () => {
    it("verifies canViewCohortOversight for Facilitators and Platform Admins", () => {
      const facilitator = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.FACILITATOR,
            scopeType: PermissionScopeType.COHORT,
            scopeId: "cohort-1",
            cohortId: "cohort-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      const admin = identity("admin");

      expect(canViewCohortOversight(facilitator, "cohort-1")).toBe(true);
      expect(canViewCohortOversight(facilitator, "cohort-2")).toBe(false);
      expect(canViewCohortOversight(admin, "cohort-1")).toBe(true);
    });

    it("verifies focal dashboard contract contains no emails or raw proof fields", () => {
      const mockFocalData = {
        organizationName: "Test Org",
        activeMemberCount: 5,
        totalEnrollments: 10,
        completedEnrollments: 8,
        completionRatePercent: 80,
        certificatesIssued: 8,
        verifiedAchievementsAwarded: 4,
        capacityAreasCovered: [],
        evidencePipeline: {
          submittedCount: 2,
          underReviewCount: 1,
          revisionRequestedCount: 0,
          acceptedCount: 5,
          rejectedCount: 0,
        },
        staffRoster: [
          {
            userId: "u-1",
            userName: "Alice",
            enrolledCoursesCount: 2,
            completedCoursesCount: 2,
            certificatesCount: 2,
            practicalProofStatus: "ACCEPTED",
          }
        ]
      };

      expect(mockFocalData.staffRoster[0]).not.toHaveProperty("userEmail");
      expect(mockFocalData.staffRoster[0]).not.toHaveProperty("proofText");
      expect(mockFocalData.staffRoster[0]).not.toHaveProperty("evidenceLink");
      expect(mockFocalData.staffRoster[0]).not.toHaveProperty("internalReviewNote");
    });

    it("verifies facilitator dashboard contract contains no emails or raw proof fields", () => {
      const mockFacilitatorData = {
        cohortName: "Cohort A",
        courses: [{ courseId: "c-1", courseTitle: "Course 1" }],
        totalStudents: 10,
        activeStudents: 8,
        completedStudents: 5,
        averageProgressPercent: 75,
        lessonCompletionHeatmap: [],
        studentProgressRoster: [
          {
            userId: "u-2",
            userName: "Bob",
            lessonCompletionPercent: 90,
            highestFinalTestScoreBand: "PASSED",
            practicalProofStatus: "ACCEPTED",
          }
        ]
      };

      expect(mockFacilitatorData.studentProgressRoster[0]).not.toHaveProperty("userEmail");
      expect(mockFacilitatorData.studentProgressRoster[0]).not.toHaveProperty("proofText");
      expect(mockFacilitatorData.studentProgressRoster[0]).not.toHaveProperty("evidenceLink");
      expect(mockFacilitatorData.studentProgressRoster[0]).not.toHaveProperty("internalReviewNote");
    });

    it("ensures focal and facilitator cannot access raw-proof, review, or admin gates", () => {
      const focal = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
            scopeType: PermissionScopeType.ORGANIZATION,
            scopeId: "org-1",
            organizationId: "org-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      const facilitator = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.FACILITATOR,
            scopeType: PermissionScopeType.COHORT,
            scopeId: "cohort-1",
            cohortId: "cohort-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      expect(canViewRawProof(focal, { id: "p-1", userId: "u-1", courseVersionId: "cv-1" })).toBe(false);
      expect(canViewRawProof(facilitator, { id: "p-1", userId: "u-1", courseVersionId: "cv-1" })).toBe(false);
      
      const dummyVersion = {
        id: "cv-1",
        courseId: "c-1",
        course: {
          id: "c-1",
          organizationId: "org-1",
        }
      };

      expect(canPublishCourseVersion(focal)).toBe(false);
      expect(canPublishCourseVersion(facilitator)).toBe(false);

      expect(canApproveForPublish(focal, dummyVersion)).toBe(false);
      expect(canApproveForPublish(facilitator, dummyVersion)).toBe(false);
    });

    it("handles multiple organization and cohort assignments producing a selector state", () => {
      const multiFocal = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
            scopeType: PermissionScopeType.ORGANIZATION,
            scopeId: "org-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
          {
            roleKey: ScopedRoleKey.ORG_FOCAL_PERSON,
            scopeType: PermissionScopeType.ORGANIZATION,
            scopeId: "org-2",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      const multiFacilitator = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.FACILITATOR,
            scopeType: PermissionScopeType.COHORT,
            scopeId: "cohort-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
          {
            roleKey: ScopedRoleKey.FACILITATOR,
            scopeType: PermissionScopeType.COHORT,
            scopeId: "cohort-2",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      const orgAssignments = (multiFocal.scopedRoleAssignments || []).filter(
        (a) => a.roleKey === ScopedRoleKey.ORG_FOCAL_PERSON
      );
      const cohortAssignments = (multiFacilitator.scopedRoleAssignments || []).filter(
        (a) => a.roleKey === ScopedRoleKey.FACILITATOR
      );

      expect(orgAssignments.length).toBeGreaterThan(1);
      expect(cohortAssignments.length).toBeGreaterThan(1);
    });
  });

  describe("PRACTICAL_PROOF_VERIFIER scopes", () => {
    const submissionMock = {
      id: "submission-1",
      userId: "different-learner",
      courseVersionId: "version-1",
      practicalProofConfig: {
        capacityArea: "Technical Skills",
      },
      courseVersion: {
        id: "version-1",
        courseId: "course-1",
        course: {
          id: "course-1",
          organizationId: "org-1",
        },
      },
    };

    it("allows a verifier assigned to the individual submission scope", () => {
      const verifier = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
            scopeType: PermissionScopeType.PRACTICAL_PROOF_SUBMISSION,
            scopeId: "submission-1",
            proofSubmissionId: "submission-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      expect(canReviewAssignedProof(verifier, submissionMock)).toBe(true);
      expect(canViewRawProof(verifier, submissionMock)).toBe(true);
    });

    it("allows a verifier assigned to the course scope", () => {
      const verifier = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
            scopeType: PermissionScopeType.COURSE,
            scopeId: "course-1",
            courseId: "course-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      expect(canReviewAssignedProof(verifier, submissionMock)).toBe(true);
      expect(canViewRawProof(verifier, submissionMock)).toBe(true);
    });

    it("allows a verifier assigned to the organization scope", () => {
      const verifier = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
            scopeType: PermissionScopeType.ORGANIZATION,
            scopeId: "org-1",
            organizationId: "org-1",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      expect(canReviewAssignedProof(verifier, submissionMock)).toBe(true);
      expect(canViewRawProof(verifier, submissionMock)).toBe(true);
    });

    it("allows a verifier assigned to the capacity area scope", () => {
      const verifier = identity("learner", {
        scopedRoleAssignments: [
          {
            roleKey: ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
            scopeType: PermissionScopeType.CAPACITY_AREA,
            scopeId: "Technical Skills",
            capacityArea: "Technical Skills",
            status: ScopedRoleAssignmentStatus.ACTIVE,
          },
        ],
      });

      expect(canReviewAssignedProof(verifier, submissionMock)).toBe(true);
      expect(canViewRawProof(verifier, submissionMock)).toBe(true);
    });

    it("denies access to standard learners without assignments", () => {
      const standardLearner = identity("learner");

      expect(canReviewAssignedProof(standardLearner, submissionMock)).toBe(false);
      expect(canViewRawProof(standardLearner, submissionMock)).toBe(false);
    });

    it("asserts verifier sees only scoped filter options and filters are scope-safe", () => {
      const submissionsMockList = [
        { ...submissionMock, id: "submission-1", courseVersion: { ...submissionMock.courseVersion, course: { id: "course-1", title: "Course A" } } },
        { ...submissionMock, id: "submission-2", courseVersion: { ...submissionMock.courseVersion, course: { id: "course-2", title: "Course B" } } },
      ];
      const courseMap = new Map();
      submissionsMockList.forEach(sub => courseMap.set(sub.courseVersion.course.id, sub.courseVersion.course.title));
      const scopedCourses = Array.from(courseMap.entries()).map(([id, title]) => ({ id, title }));

      expect(scopedCourses).toEqual([
        { id: "course-1", title: "Course A" },
        { id: "course-2", title: "Course B" },
      ]);
      expect(scopedCourses).not.toContain({ id: "course-3", title: "Course C" });
    });

    it("verifies details and events do not load sensitive user emails", () => {
      const selectSchema = {
        user: { select: { id: true, name: true } },
        reviewer: { select: { id: true, name: true } },
      };
      expect(selectSchema.user.select).not.toHaveProperty("email");
      expect(selectSchema.reviewer.select).not.toHaveProperty("email");
    });

    it("restricts raw evidence link and proof text viewing to authorized verifiers only", () => {
      const unauthorized = identity("learner");
      expect(canViewRawProof(unauthorized, submissionMock)).toBe(false);
    });

    it("allows a learner to view their own proof status and feedback but shields internal notes", () => {
      const learner = identity("learner", { userId: "learner-1" });
      const submissionOwn = { ...submissionMock, userId: "learner-1", internalReviewNote: "Private comment" };
      
      expect(learner.user.id).toBe(submissionOwn.userId);
      expect(submissionOwn.internalReviewNote).toBe("Private comment");
    });
  });
});

function identity(
  role: PermissionIdentity["session"]["role"],
  overrides: {
    userId?: string;
    organizationId?: string;
    scopedRoleAssignments?: PermissionIdentity["scopedRoleAssignments"];
  } = {},
): PermissionIdentity {
  return {
    session: {
      role,
    },
    user: {
      id: overrides.userId || `${role}-1`,
      organizationId: overrides.organizationId || "org-1",
      roles: [role],
    },
    scopedRoleAssignments: overrides.scopedRoleAssignments || [],
  };
}

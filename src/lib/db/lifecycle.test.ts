import { CourseVersionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  assertCourseVersionTransition,
  canRoleTransitionCourseVersion,
  canTransitionCourseVersion,
} from "./lifecycle";

describe("course version lifecycle policy", () => {
  it("allows the governed forward movement path", () => {
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.DRAFT,
        CourseVersionStatus.CREATOR_REVIEW,
      ),
    ).toBe(true);
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.CREATOR_REVIEW,
        CourseVersionStatus.SUBMITTED,
      ),
    ).toBe(true);
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.SUBMITTED,
        CourseVersionStatus.APPROVED,
      ),
    ).toBe(true);
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.APPROVED,
        CourseVersionStatus.PUBLISHED,
      ),
    ).toBe(true);
  });

  it("allows revision drafts without mutating the published version directly", () => {
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.PUBLISHED,
        CourseVersionStatus.REVISION_DRAFT,
      ),
    ).toBe(true);
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.REVISION_DRAFT,
        CourseVersionStatus.SUBMITTED,
      ),
    ).toBe(true);
  });

  it("blocks direct publishing from draft", () => {
    expect(
      canTransitionCourseVersion(
        CourseVersionStatus.DRAFT,
        CourseVersionStatus.PUBLISHED,
      ),
    ).toBe(false);
    expect(() =>
      assertCourseVersionTransition(
        CourseVersionStatus.DRAFT,
        CourseVersionStatus.PUBLISHED,
      ),
    ).toThrow("Invalid course version transition");
  });

  it("keeps publication decisions with reviewer or admin roles", () => {
    expect(
      canRoleTransitionCourseVersion(
        "reviewer",
        CourseVersionStatus.APPROVED,
        CourseVersionStatus.PUBLISHED,
      ),
    ).toBe(true);
    expect(
      canRoleTransitionCourseVersion(
        "creator",
        CourseVersionStatus.APPROVED,
        CourseVersionStatus.PUBLISHED,
      ),
    ).toBe(false);
  });

  it("allows reviewer-led revision initiation from published monitoring signals", () => {
    expect(
      canRoleTransitionCourseVersion(
        "reviewer",
        CourseVersionStatus.PUBLISHED,
        CourseVersionStatus.REVISION_DRAFT,
      ),
    ).toBe(true);
  });
});

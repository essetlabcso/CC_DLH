import { describe, expect, it } from "vitest";

import { canAccessWorkspace, findProtectedWorkspace } from "./access";

describe("DEC workspace access policy", () => {
  it("matches protected workspace prefixes", () => {
    expect(findProtectedWorkspace("/learn")?.label).toBe("Learner");
    expect(findProtectedWorkspace("/studio/course-1")?.label).toBe("Studio");
    expect(findProtectedWorkspace("/unknown")).toBeUndefined();
  });

  it("allows only the configured roles for each workspace", () => {
    const learner = findProtectedWorkspace("/learn");
    const admin = findProtectedWorkspace("/admin");

    expect(learner).toBeDefined();
    expect(admin).toBeDefined();
    expect(canAccessWorkspace("learner", learner!)).toBe(true);
    expect(canAccessWorkspace("creator", learner!)).toBe(false);
    expect(canAccessWorkspace("admin", admin!)).toBe(true);
    expect(canAccessWorkspace("reviewer", admin!)).toBe(false);
  });

  it("keeps reviewers in the review workspace instead of Studio", () => {
    const studio = findProtectedWorkspace("/studio");
    const review = findProtectedWorkspace("/review");

    expect(studio).toBeDefined();
    expect(review).toBeDefined();
    expect(canAccessWorkspace("reviewer", studio!)).toBe(false);
    expect(canAccessWorkspace("reviewer", review!)).toBe(true);
  });
});

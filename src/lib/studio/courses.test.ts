import { describe, expect, it } from "vitest";

import { canManageStudioCourse, getCourseStatusLabel } from "./courses";

describe("Studio course access helpers", () => {
  it("keeps course management organization-scoped and owner-aware", () => {
    expect(
      canManageStudioCourse(
        { userId: "creator-1", organizationId: "org-1", role: "creator" },
        { organizationId: "org-1", ownerId: "creator-1" },
      ),
    ).toBe(true);
    expect(
      canManageStudioCourse(
        { userId: "creator-2", organizationId: "org-1", role: "creator" },
        { organizationId: "org-1", ownerId: "creator-1" },
      ),
    ).toBe(false);
    expect(
      canManageStudioCourse(
        { userId: "admin-1", organizationId: "org-1", role: "admin" },
        { organizationId: "org-1", ownerId: "creator-1" },
      ),
    ).toBe(true);
    expect(
      canManageStudioCourse(
        { userId: "admin-1", organizationId: "org-2", role: "admin" },
        { organizationId: "org-1", ownerId: "creator-1" },
      ),
    ).toBe(false);
  });

  it("uses product-friendly lifecycle labels", () => {
    expect(getCourseStatusLabel("REVISION_DRAFT")).toBe("Revision draft");
    expect(getCourseStatusLabel("SUBMITTED")).toBe("Submitted for review");
  });
});

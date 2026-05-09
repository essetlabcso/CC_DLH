import { describe, expect, it } from "vitest";

import { getAdminRoleLabel, getAdminStatusLabel } from "./role-labels";

describe("Admin role labels", () => {
  it("uses clear product labels for current membership roles", () => {
    expect(getAdminRoleLabel("learner")).toBe("Learner / Participant");
    expect(getAdminRoleLabel("CREATOR")).toBe("Course Creator");
    expect(getAdminRoleLabel("reviewer")).toBe("Course Reviewer");
    expect(getAdminRoleLabel("ADMIN")).toBe(
      "Super Admin-equivalent authority",
    );
  });

  it("formats statuses without exposing enum style labels", () => {
    expect(getAdminStatusLabel("ACTIVE")).toBe("Active");
    expect(getAdminStatusLabel("DISABLED")).toBe("Disabled");
  });
});

import { describe, expect, it } from "vitest";

import { parseUserRoleUpdateForm } from "./user-role-form";

describe("Admin user role form parsing", () => {
  it("accepts valid role selections with a reason", () => {
    const formData = new FormData();

    formData.append("roles", "creator");
    formData.append("roles", "reviewer");
    formData.append("roles", "unknown");
    formData.set("changeReason", "Assign creator and reviewer access.");

    const result = parseUserRoleUpdateForm(formData);

    expect(result).toEqual({
      ok: true,
      roles: ["creator", "reviewer"],
      reason: "Assign creator and reviewer access.",
    });
  });

  it("requires at least one valid role", () => {
    const formData = new FormData();

    formData.set("changeReason", "Update requested.");

    expect(parseUserRoleUpdateForm(formData)).toEqual({
      ok: false,
      message: "Choose at least one role for this user.",
    });
  });

  it("requires a role change reason", () => {
    const formData = new FormData();

    formData.append("roles", "admin");

    expect(parseUserRoleUpdateForm(formData)).toEqual({
      ok: false,
      message: "Enter a reason for this role update.",
    });
  });
});

import { MembershipStatus, UserRole } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { parseAddMemberForm, parseUpdateMembershipForm } from "./membership-form";

describe("membership-form validation", () => {
  describe("parseAddMemberForm", () => {
    it("accepts valid email and reason", () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("reason", "Adding a new creator.");

      const result = parseAddMemberForm(formData);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.email).toBe("test@example.com");
      }
    });

    it("rejects invalid email", () => {
      const formData = new FormData();
      formData.append("email", "not-an-email");
      formData.append("reason", "Adding a member.");

      const result = parseAddMemberForm(formData);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("valid email");
      }
    });

    it("rejects short reason", () => {
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("reason", "abc");

      const result = parseAddMemberForm(formData);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("at least 5 characters");
      }
    });
  });

  describe("parseUpdateMembershipForm", () => {
    it("accepts valid roles, status, and reason", () => {
      const formData = new FormData();
      formData.append("roles", UserRole.LEARNER);
      formData.append("roles", UserRole.CREATOR);
      formData.append("status", MembershipStatus.ACTIVE);
      formData.append("reason", "Upgrading permissions.");

      const result = parseUpdateMembershipForm(formData);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.roles).toContain(UserRole.LEARNER);
        expect(result.data.roles).toContain(UserRole.CREATOR);
        expect(result.data.status).toBe(MembershipStatus.ACTIVE);
      }
    });

    it("rejects missing roles", () => {
      const formData = new FormData();
      formData.append("status", MembershipStatus.ACTIVE);
      formData.append("reason", "Changing status.");

      const result = parseUpdateMembershipForm(formData);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain("At least one role");
      }
    });

    it("rejects invalid status", () => {
      const formData = new FormData();
      formData.append("roles", UserRole.LEARNER);
      formData.append("status", "INVALID_STATUS");
      formData.append("reason", "Testing invalid status.");

      const result = parseUpdateMembershipForm(formData);
      expect(result.ok).toBe(false);
    });
  });
});

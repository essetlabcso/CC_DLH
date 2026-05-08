import { UserRole } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  canChangeLegacyAdminAuthority,
  isLegacySuperAdminEquivalent,
  touchesLegacyAdminAuthority,
} from "./admin-authority";

describe("Admin authority boundary", () => {
  it("treats only legacy admin as the Super Admin-equivalent for Slice 1", () => {
    expect(isLegacySuperAdminEquivalent("admin")).toBe(true);
    expect(isLegacySuperAdminEquivalent("learner")).toBe(false);
    expect(isLegacySuperAdminEquivalent("creator")).toBe(false);
    expect(isLegacySuperAdminEquivalent("reviewer")).toBe(false);
  });

  it("detects assignment or removal of legacy Admin authority", () => {
    expect(
      touchesLegacyAdminAuthority([UserRole.LEARNER], [UserRole.ADMIN]),
    ).toBe(true);
    expect(
      touchesLegacyAdminAuthority([UserRole.ADMIN], [UserRole.LEARNER]),
    ).toBe(true);
    expect(
      touchesLegacyAdminAuthority([UserRole.LEARNER], [UserRole.CREATOR]),
    ).toBe(false);
  });

  it("blocks non-legacy admins from changing Admin authority", () => {
    expect(
      canChangeLegacyAdminAuthority({
        actorRole: "admin",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(true);
    expect(
      canChangeLegacyAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(false);
    expect(
      canChangeLegacyAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.CREATOR],
      }),
    ).toBe(true);
  });
});

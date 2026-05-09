import { UserRole } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  canChangePlatformAdminAuthority,
  isSuperAdminEquivalentForPhase1,
  touchesPlatformAdminAuthority,
} from "./admin-authority";

describe("Admin authority boundary", () => {
  it("treats only admin as the Super Admin-equivalent for Phase 1", () => {
    expect(isSuperAdminEquivalentForPhase1("admin")).toBe(true);
    expect(isSuperAdminEquivalentForPhase1("learner")).toBe(false);
    expect(isSuperAdminEquivalentForPhase1("creator")).toBe(false);
    expect(isSuperAdminEquivalentForPhase1("reviewer")).toBe(false);
  });

  it("detects assignment or removal of Platform Admin authority", () => {
    expect(
      touchesPlatformAdminAuthority([UserRole.LEARNER], [UserRole.ADMIN]),
    ).toBe(true);
    expect(
      touchesPlatformAdminAuthority([UserRole.ADMIN], [UserRole.LEARNER]),
    ).toBe(true);
    expect(
      touchesPlatformAdminAuthority([UserRole.LEARNER], [UserRole.CREATOR]),
    ).toBe(false);
  });

  it("blocks non-Super Admin-equivalent users from changing Platform Admin authority", () => {
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "admin",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(true);
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.ADMIN],
      }),
    ).toBe(false);
    expect(
      canChangePlatformAdminAuthority({
        actorRole: "learner",
        currentRoles: [UserRole.LEARNER],
        nextRoles: [UserRole.CREATOR],
      }),
    ).toBe(true);
  });
});

import {
  MembershipStatus,
  UserRole as PrismaUserRole,
  UserStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import type { DecSession } from "@/lib/auth/session";

import {
  buildPersistedIdentity,
  fromPrismaUserRole,
  toPrismaUserRole,
} from "./persistence";

const baseSession: DecSession = {
  userId: "user-1",
  organizationId: "org-1",
  email: "learner@example.test",
  name: "Learner One",
  role: "learner",
  issuedAt: 1000,
  expiresAt: 2000,
};

const baseUser = {
  id: "user-1",
  organizationId: "org-1",
  email: "learner@example.test",
  name: "Learner One",
  status: UserStatus.ACTIVE,
  organization: {
    id: "org-1",
    slug: "dec",
    name: "DEC",
  },
  memberships: [
    {
      id: "membership-1",
      organizationId: "org-1",
      status: MembershipStatus.ACTIVE,
      roles: [{ role: PrismaUserRole.LEARNER }],
    },
  ],
};

describe("persisted DEC identities", () => {
  it("maps DEC roles to persisted Prisma roles", () => {
    expect(toPrismaUserRole("learner")).toBe(PrismaUserRole.LEARNER);
    expect(fromPrismaUserRole(PrismaUserRole.ADMIN)).toBe("admin");
  });

  it("accepts active users with the selected persisted role", () => {
    const identity = buildPersistedIdentity(baseSession, baseUser);

    expect(identity?.user.membershipId).toBe("membership-1");
    expect(identity?.user.roles).toEqual(["learner"]);
  });

  it("rejects sessions whose selected role is no longer assigned", () => {
    expect(
      buildPersistedIdentity(
        {
          ...baseSession,
          role: "admin",
        },
        baseUser,
      ),
    ).toBeNull();
  });

  it("rejects disabled users", () => {
    expect(
      buildPersistedIdentity(baseSession, {
        ...baseUser,
        status: UserStatus.DISABLED,
      }),
    ).toBeNull();
  });

  it("rejects users without an active membership for the selected organization", () => {
    expect(
      buildPersistedIdentity(baseSession, {
        ...baseUser,
        memberships: [
          {
            ...baseUser.memberships[0],
            status: MembershipStatus.DISABLED,
          },
        ],
      }),
    ).toBeNull();
  });
});

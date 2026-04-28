import {
  MembershipStatus,
  UserRole as PrismaUserRole,
  UserStatus,
  type PrismaClient,
} from "@prisma/client";

import type { DecRole } from "@/lib/access";
import type { DecSession } from "@/lib/auth/session";

export const LOCAL_DEV_ORGANIZATION = {
  name: "DEC Local Development",
  slug: "dec-local",
} as const;

export type PersistedIdentity = {
  session: DecSession;
  user: {
    id: string;
    organizationId: string;
    email: string;
    name: string;
    status: UserStatus;
    organization: {
      id: string;
      slug: string;
      name: string;
    };
    membershipId: string;
    roles: readonly DecRole[];
  };
};

type UserWithOrganizationAndMemberships = {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  status: UserStatus;
  organization: {
    id: string;
    slug: string;
    name: string;
  };
  memberships: readonly {
    id: string;
    organizationId: string;
    status: MembershipStatus;
    roles: readonly {
      role: PrismaUserRole;
    }[];
  }[];
};

export function toPrismaUserRole(role: DecRole) {
  return role.toUpperCase() as PrismaUserRole;
}

export function fromPrismaUserRole(role: PrismaUserRole): DecRole {
  return role.toLowerCase() as DecRole;
}

export function buildPersistedIdentity(
  session: DecSession,
  user: UserWithOrganizationAndMemberships | null,
): PersistedIdentity | null {
  if (!user || user.status !== UserStatus.ACTIVE) {
    return null;
  }

  const membership = user.memberships.find(
    (candidate) =>
      candidate.organizationId === session.organizationId &&
      candidate.status === MembershipStatus.ACTIVE,
  );

  if (!membership) {
    return null;
  }

  const roles = membership.roles.map(({ role }) => fromPrismaUserRole(role));

  if (
    session.userId !== user.id ||
    session.organizationId !== membership.organizationId ||
    !roles.includes(session.role)
  ) {
    return null;
  }

  return {
    session,
    user: {
      id: user.id,
      organizationId: user.organizationId,
      email: user.email,
      name: user.name,
      status: user.status,
      organization: user.organization,
      membershipId: membership.id,
      roles,
    },
  };
}

export async function getPersistedIdentity(
  prisma: PrismaClient,
  session: DecSession | null,
) {
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      organization: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      memberships: {
        where: {
          organizationId: session.organizationId,
        },
        select: {
          id: true,
          organizationId: true,
          status: true,
          roles: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  return buildPersistedIdentity(session, user);
}

export async function upsertLocalDevUser(
  prisma: PrismaClient,
  role: DecRole,
) {
  const organization = await prisma.organization.upsert({
    where: { slug: LOCAL_DEV_ORGANIZATION.slug },
    update: {
      name: LOCAL_DEV_ORGANIZATION.name,
    },
    create: LOCAL_DEV_ORGANIZATION,
  });
  const user = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: `${role}@dec.local`,
      },
    },
    update: {
      name: `DEC ${role}`,
      status: UserStatus.ACTIVE,
    },
    create: {
      organizationId: organization.id,
      email: `${role}@dec.local`,
      name: `DEC ${role}`,
      status: UserStatus.ACTIVE,
    },
  });

  const membership = await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    update: {
      status: MembershipStatus.ACTIVE,
    },
    create: {
      organizationId: organization.id,
      userId: user.id,
      status: MembershipStatus.ACTIVE,
    },
  });

  await prisma.membershipRoleAssignment.upsert({
    where: {
      membershipId_role: {
        membershipId: membership.id,
        role: toPrismaUserRole(role),
      },
    },
    update: {},
    create: {
      membershipId: membership.id,
      role: toPrismaUserRole(role),
    },
  });

  return {
    ...user,
    organization,
  };
}

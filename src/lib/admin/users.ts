import { MembershipStatus, UserRole, UserStatus } from "@prisma/client";

import { fromPrismaUserRole } from "@/lib/auth/persistence";
import { prisma } from "@/lib/db/client";

export type AdminUserSummary = {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  organizationName: string;
  organizationSlug: string;
  membershipId: string | null;
  membershipStatus: MembershipStatus | null;
  roles: string[];
  courseCount: number;
  certificateCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUsersOverview = {
  users: AdminUserSummary[];
  totals: {
    users: number;
    activeUsers: number;
    admins: number;
    creators: number;
    reviewers: number;
    learners: number;
  };
};

export async function getAdminUsersOverview(): Promise<AdminUsersOverview> {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          certificates: true,
          courses: true,
        },
      },
      memberships: {
        include: {
          roles: {
            orderBy: { role: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      organization: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [{ organizationId: "asc" }, { name: "asc" }],
  });

  const mappedUsers = users.map((user) => {
    const membership = user.memberships[0] ?? null;
    const userRoles =
      membership?.roles.map((role) => fromPrismaUserRole(role.role)) ?? [];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      organizationName: user.organization.name,
      organizationSlug: user.organization.slug,
      membershipId: membership?.id ?? null,
      membershipStatus: membership?.status ?? null,
      roles: userRoles,
      courseCount: user._count.courses,
      certificateCount: user._count.certificates,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });

  return {
    users: mappedUsers,
    totals: {
      users: mappedUsers.length,
      activeUsers: mappedUsers.filter((user) => user.status === UserStatus.ACTIVE)
        .length,
      admins: countUsersWithRole(mappedUsers, UserRole.ADMIN),
      creators: countUsersWithRole(mappedUsers, UserRole.CREATOR),
      reviewers: countUsersWithRole(mappedUsers, UserRole.REVIEWER),
      learners: countUsersWithRole(mappedUsers, UserRole.LEARNER),
    },
  };
}

function countUsersWithRole(users: AdminUserSummary[], role: UserRole) {
  const roleLabel = fromPrismaUserRole(role);

  return users.filter((user) => user.roles.includes(roleLabel)).length;
}

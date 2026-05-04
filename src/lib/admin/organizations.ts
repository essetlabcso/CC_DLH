import { prisma } from "@/lib/db/client";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  organizationType: string | null;
  geographicFocus: string | null;
  status: string;
  isSystem: boolean;
  memberCount: number;
  courseCount: number;
  certificateCount: number;
  achievementCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationsOverview = {
  organizations: OrganizationSummary[];
  totals: {
    organizations: number;
    participants: number;
  };
};

export async function getOrganizationsOverview(): Promise<OrganizationsOverview> {
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          memberships: true,
          courses: true,
          verifiedAchievements: true,
        },
      },
      users: {
        select: {
          _count: {
            select: {
              certificates: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const mappedOrgs = organizations.map((org) => {
    // Total certificates is the sum of certificates of all users whose home org is this one
    const certificateCount = org.users.reduce(
      (sum, user) => sum + user._count.certificates,
      0,
    );

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      organizationType: org.organizationType,
      geographicFocus: org.geographicFocus,
      status: org.status,
      isSystem: org.isSystem,
      memberCount: org._count.users + org._count.memberships,
      courseCount: org._count.courses,
      certificateCount,
      achievementCount: org._count.verifiedAchievements,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  });

  return {
    organizations: mappedOrgs,
    totals: {
      organizations: mappedOrgs.length,
      participants: mappedOrgs.reduce((sum, org) => sum + org.memberCount, 0),
    },
  };
}

export type OrganizationDetail = {
  id: string;
  name: string;
  slug: string;
  organizationType: string | null;
  geographicFocus: string | null;
  description: string | null;
  contactEmail: string | null;
  website: string | null;
  phone: string | null;
  status: string;
  isSystem: boolean;
  members: {
    id: string;
    membershipId: string;
    name: string;
    email: string;
    roles: string[];
    status: string;
    isHomeOrg: boolean;
  }[];
  stats: {
    courses: number;
    certificates: number;
    achievements: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export async function getOrganizationDetail(
  id: string,
): Promise<OrganizationDetail | null> {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          _count: {
            select: {
              certificates: true,
            },
          },
          memberships: {
            where: { organizationId: id },
            include: {
              roles: true,
            },
          },
        },
      },
      memberships: {
        include: {
          user: true,
          roles: true,
        },
      },
      _count: {
        select: {
          courses: true,
          verifiedAchievements: true,
        },
      },
    },
  });

  if (!org) return null;

  // Compile members list
  // 1. Users whose home org is this one
  const homeMembers = org.users.map((user) => {
    const membership = user.memberships[0];
    return {
      id: user.id,
      membershipId: membership.id,
      name: user.name,
      email: user.email,
      roles: membership.roles.map((r) => r.role.toString()),
      status: membership.status,
      isHomeOrg: true,
    };
  });

  // 2. Users who have a membership here but home org is different
  const externalMembers = org.memberships
    .filter((m) => m.user.organizationId !== id)
    .map((m) => ({
      id: m.user.id,
      membershipId: m.id,
      name: m.user.name,
      email: m.user.email,
      roles: m.roles.map((r) => r.role.toString()),
      status: m.status,
      isHomeOrg: false,
    }));

  const allMembers = [...homeMembers, ...externalMembers].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const certificateCount = org.users.reduce(
    (sum, user) => sum + user._count.certificates,
    0,
  );

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    organizationType: org.organizationType,
    geographicFocus: org.geographicFocus,
    description: org.description,
    contactEmail: org.contactEmail,
    website: org.website,
    phone: org.phone,
    status: org.status,
    isSystem: org.isSystem,
    members: allMembers,
    stats: {
      courses: org._count.courses,
      certificates: certificateCount,
      achievements: org._count.verifiedAchievements,
    },
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
  };
}

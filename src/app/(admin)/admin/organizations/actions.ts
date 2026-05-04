"use server";

import { MembershipStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { parseOrganizationForm } from "@/lib/admin/organization-form";
import { parseAddMemberForm, parseUpdateMembershipForm, parseInviteMemberForm } from "@/lib/admin/membership-form";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

export async function createOrganizationAction(formData: FormData) {
  const identity = await requireWorkspaceIdentity("/admin/organizations/new");
  const parsed = parseOrganizationForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/organizations/new?error=${encodeURIComponent(parsed.message)}`);
  }

  // Validate lookups
  await validateLookups(parsed.data.organizationType, parsed.data.geographicFocus, "/admin/organizations/new");

  // Validate slug uniqueness
  const existing = await prisma.organization.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existing) {
    redirect(
      `/admin/organizations/new?error=${encodeURIComponent(
        "An organization with this slug already exists."
      )}`
    );
  }

  const organization = await prisma.$transaction(async (tx) => {
    const created = await tx.organization.create({
      data: {
        ...parsed.data,
        isSystem: false,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ORGANIZATION_CREATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditOrganization(created)),
        entityId: created.id,
        entityType: "Organization",
        reason: parsed.reason || "New organization created.",
        riskLevel: "LOW",
      },
    });

    return created;
  });

  revalidateOrganizationPaths(organization.id);
  redirect(`/admin/organizations/${organization.id}?created=1`);
}

export async function updateOrganizationAction(organizationId: string, formData: FormData) {
  const identity = await requireWorkspaceIdentity(`/admin/organizations/${organizationId}/edit`);
  const parsed = parseOrganizationForm(formData, { requireUpdateReason: true });

  if (!parsed.ok) {
    redirect(
      `/admin/organizations/${organizationId}/edit?error=${encodeURIComponent(parsed.message)}`
    );
  }

  const current = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      _count: {
        select: {
          users: true,
          memberships: true,
          courses: true,
          diagnosisRecords: true,
        },
      },
    },
  });

  if (!current) {
    notFound();
  }

  // Protection: isSystem
  if (current.isSystem) {
    if (parsed.data.status === "INACTIVE") {
      redirect(
        `/admin/organizations/${organizationId}/edit?error=${encodeURIComponent(
          "System organizations cannot be deactivated."
        )}`
      );
    }
    if (parsed.data.slug !== current.slug) {
      redirect(
        `/admin/organizations/${organizationId}/edit?error=${encodeURIComponent(
          "Slugs for system organizations cannot be changed."
        )}`
      );
    }
  }

  // Protection: Slug change with linked records
  if (parsed.data.slug !== current.slug) {
    const totalLinked =
      current._count.users + current._count.memberships + current._count.courses + current._count.diagnosisRecords;
    
    if (totalLinked > 0) {
      redirect(
        `/admin/organizations/${organizationId}/edit?error=${encodeURIComponent(
          "Slug cannot be changed because this organization has linked users, courses, or records."
        )}`
      );
    }

    const duplicate = await prisma.organization.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });

    if (duplicate && duplicate.id !== organizationId) {
      redirect(
        `/admin/organizations/${organizationId}/edit?error=${encodeURIComponent(
          "An organization with this slug already exists."
        )}`
      );
    }
  }

  // Validate lookups
  await validateLookups(
    parsed.data.organizationType,
    parsed.data.geographicFocus,
    `/admin/organizations/${organizationId}/edit`
  );

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.organization.update({
      where: { id: organizationId },
      data: {
        ...parsed.data,
        // isSystem is never updated via form
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "ORGANIZATION_UPDATED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify(toAuditOrganization(current)),
        afterJson: JSON.stringify(toAuditOrganization(saved)),
        entityId: saved.id,
        entityType: "Organization",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return saved;
  });

  revalidateOrganizationPaths(updated.id);
  redirect(`/admin/organizations/${updated.id}?updated=1`);
}

async function validateLookups(typeKey: string, focusKey: string, errorRedirect: string) {
  const typeValue = await prisma.adminLookupValue.findFirst({
    where: {
      category: { categoryKey: "organization_types" },
      valueKey: typeKey,
      isActive: true,
    },
  });

  if (!typeValue) {
    redirect(`${errorRedirect}${errorRedirect.includes("?") ? "&" : "?"}error=${encodeURIComponent("Select a valid, active organization type.")}`);
  }

  const focusValue = await prisma.adminLookupValue.findFirst({
    where: {
      category: { categoryKey: "geographic_focus_areas" },
      valueKey: focusKey,
      isActive: true,
    },
  });

  if (!focusValue) {
    redirect(`${errorRedirect}${errorRedirect.includes("?") ? "&" : "?"}error=${encodeURIComponent("Select a valid, active geographic focus area.")}`);
  }
}

export async function addOrganizationMemberAction(organizationId: string, formData: FormData) {
  const identity = await requireWorkspaceIdentity(`/admin/organizations/${organizationId}`);
  const parsed = parseAddMemberForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/organizations/${organizationId}?error=${encodeURIComponent(parsed.message)}`);
  }

  // Find existing user
  const user = await prisma.user.findFirst({
    where: { email: parsed.data.email },
  });

  if (!user) {
    redirect(
      `/admin/organizations/${organizationId}?error=${encodeURIComponent(
        "User not found. Only existing users can be added to organizations."
      )}`
    );
  }

  // Check for existing membership
  const existing = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    redirect(
      `/admin/organizations/${organizationId}?error=${encodeURIComponent(
        "This user is already a member of this organization."
      )}`
    );
  }

  await prisma.$transaction(async (tx) => {
    const membership = await tx.organizationMembership.create({
      data: {
        organizationId,
        userId: user.id,
        status: MembershipStatus.ACTIVE,
      },
    });

    // Default role: LEARNER (Participant)
    await tx.membershipRoleAssignment.create({
      data: {
        membershipId: membership.id,
        role: UserRole.LEARNER,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "MEMBERSHIP_ADDED",
        actorId: identity.user.id,
        afterJson: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          organizationId,
          roles: ["LEARNER"],
        }),
        entityId: membership.id,
        entityType: "OrganizationMembership",
        reason: parsed.data.reason,
        riskLevel: "MEDIUM",
      },
    });
  });

  revalidateOrganizationPaths(organizationId);
  redirect(`/admin/organizations/${organizationId}?updated=1`);
}

export async function updateOrganizationMembershipAction(
  organizationId: string,
  membershipId: string,
  formData: FormData
) {
  const identity = await requireWorkspaceIdentity(`/admin/organizations/${organizationId}`);
  const parsed = parseUpdateMembershipForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/organizations/${organizationId}?error=${encodeURIComponent(parsed.message)}`);
  }

  const membership = await prisma.organizationMembership.findUnique({
    where: { id: membershipId },
    include: {
      roles: true,
      user: {
        select: { id: true, email: true },
      },
    },
  });

  if (!membership || membership.organizationId !== organizationId) {
    notFound();
  }

  const isUpdatingSelf = membership.userId === identity.user.id;
  const becomingDisabled = parsed.data.status === MembershipStatus.DISABLED;
  const nextRoles = parsed.data.roles;
  const currentRoles = membership.roles.map((r) => r.role);
  const removingAdmin = currentRoles.includes(UserRole.ADMIN) && !nextRoles.includes(UserRole.ADMIN);

  // Protection: Self-lockout
  if (isUpdatingSelf) {
    if (becomingDisabled) {
      redirect(
        `/admin/organizations/${organizationId}?error=${encodeURIComponent(
          "You cannot disable your own membership."
        )}`
      );
    }
    if (removingAdmin) {
      redirect(
        `/admin/organizations/${organizationId}?error=${encodeURIComponent(
          "You cannot remove your own Admin role."
        )}`
      );
    }
  }

  // Protection: Last Admin
  if (becomingDisabled || removingAdmin) {
    const otherAdmins = await prisma.organizationMembership.count({
      where: {
        organizationId,
        status: MembershipStatus.ACTIVE,
        id: { not: membershipId },
        roles: {
          some: { role: UserRole.ADMIN },
        },
      },
    });

    if (otherAdmins === 0) {
      redirect(
        `/admin/organizations/${organizationId}?error=${encodeURIComponent(
          "Cannot remove the last active administrator from this organization."
        )}`
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    // Update status
    await tx.organizationMembership.update({
      where: { id: membershipId },
      data: { status: parsed.data.status },
    });

    // Update roles
    await tx.membershipRoleAssignment.deleteMany({
      where: {
        membershipId,
        role: { notIn: nextRoles },
      },
    });

    for (const role of nextRoles) {
      await tx.membershipRoleAssignment.upsert({
        where: {
          membershipId_role: { membershipId, role },
        },
        update: {},
        create: { membershipId, role },
      });
    }

    await tx.adminAuditLog.create({
      data: {
        action: "MEMBERSHIP_UPDATED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify({
          userId: membership.userId,
          userEmail: membership.user.email,
          status: membership.status,
          roles: currentRoles,
        }),
        afterJson: JSON.stringify({
          userId: membership.userId,
          userEmail: membership.user.email,
          status: parsed.data.status,
          roles: nextRoles,
        }),
        entityId: membershipId,
        entityType: "OrganizationMembership",
        reason: parsed.data.reason,
        riskLevel: nextRoles.includes(UserRole.ADMIN) || removingAdmin ? "HIGH" : "MEDIUM",
      },
    });
  });

  revalidateOrganizationPaths(organizationId);
  redirect(`/admin/organizations/${organizationId}?updated=1`);
}

function revalidateOrganizationPaths(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  revalidatePath(`/admin/organizations/${id}/edit`);
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin/users");
}

function toAuditOrganization(org: {
  id: string;
  name: string;
  slug: string;
  organizationType: string | null;
  geographicFocus: string | null;
  status: string;
  isSystem: boolean;
}) {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    organizationType: org.organizationType,
    geographicFocus: org.geographicFocus,
    status: org.status,
    isSystem: org.isSystem,
  };
}

export async function inviteOrganizationMemberAction(organizationId: string, formData: FormData) {
  const identity = await requireWorkspaceIdentity(`/admin/organizations/${organizationId}`);
  const parsed = parseInviteMemberForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/organizations/${organizationId}?error=${encodeURIComponent(parsed.message)}`);
  }

  // Check if user already exists
  let user = await prisma.user.findFirst({
    where: { email: parsed.data.email },
  });

  const isNewUser = !user;
  const isHighRisk = parsed.data.roles.includes(UserRole.ADMIN);

  await prisma.$transaction(async (tx) => {
    if (!user) {
      user = await tx.user.create({
        data: {
          email: parsed.data.email,
          name: parsed.data.name,
          organizationId: organizationId,
          status: "INVITED",
        },
      });
    }

    // Check for existing membership
    const existingMembership = await tx.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      // We cannot redirect inside a transaction safely without throwing, but Next.js redirect throws.
      // So it will abort the transaction, which is fine since we want to abort.
      redirect(
        `/admin/organizations/${organizationId}?error=${encodeURIComponent(
          "This user is already a member of this organization."
        )}`
      );
    }

    const membership = await tx.organizationMembership.create({
      data: {
        organizationId,
        userId: user.id,
        status: MembershipStatus.INVITED,
      },
    });

    for (const role of parsed.data.roles) {
      await tx.membershipRoleAssignment.create({
        data: {
          membershipId: membership.id,
          role: role,
        },
      });
    }

    await tx.adminAuditLog.create({
      data: {
        action: "USER_INVITED",
        actorId: identity.user.id,
        afterJson: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          organizationId,
          membershipId: membership.id,
          roles: parsed.data.roles,
          isNewUser,
        }),
        entityId: user.id,
        entityType: "User",
        reason: parsed.data.reason,
        riskLevel: isHighRisk ? "HIGH" : "MEDIUM",
      },
    });
  });

  revalidateOrganizationPaths(organizationId);
  redirect(`/admin/organizations/${organizationId}?updated=1`);
}

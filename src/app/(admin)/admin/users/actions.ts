"use server";

import { MembershipStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  ADMIN_AUTHORITY_CHANGE_ERROR,
  canChangeLegacyAdminAuthority,
} from "@/lib/admin/admin-authority";
import { parseUserRoleUpdateForm } from "@/lib/admin/user-role-form";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { toPrismaUserRole } from "@/lib/auth/persistence";
import { prisma } from "@/lib/db/client";

export async function updateUserRolesAction(
  membershipId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/users");
  const parsed = parseUserRoleUpdateForm(formData);

  if (!parsed.ok) {
    redirect(`/admin/users?error=${encodeURIComponent(parsed.message)}`);
  }

  const membership = await prisma.organizationMembership.findUnique({
    include: {
      roles: true,
      user: {
        select: {
          email: true,
          id: true,
          name: true,
        },
      },
    },
    where: { id: membershipId },
  });

  if (!membership) {
    notFound();
  }

  if (membership.status !== MembershipStatus.ACTIVE) {
    redirect(
      `/admin/users?error=${encodeURIComponent(
        "Only active memberships can be updated.",
      )}`,
    );
  }

  const nextPrismaRoles = parsed.roles.map(toPrismaUserRole);
  const currentRoles = membership.roles.map((role) => role.role);
  const isUpdatingSelf = membership.userId === identity.user.id;

  if (
    !canChangeLegacyAdminAuthority({
      actorRole: identity.session.role,
      currentRoles,
      nextRoles: nextPrismaRoles,
    })
  ) {
    redirect(
      `/admin/users?error=${encodeURIComponent(
        ADMIN_AUTHORITY_CHANGE_ERROR,
      )}`,
    );
  }

  if (isUpdatingSelf && !parsed.roles.includes("admin")) {
    redirect(
      `/admin/users?error=${encodeURIComponent(
        "You cannot remove your own Admin access.",
      )}`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.membershipRoleAssignment.deleteMany({
      where: {
        membershipId,
        role: {
          notIn: nextPrismaRoles,
        },
      },
    });

    for (const role of nextPrismaRoles) {
      await tx.membershipRoleAssignment.upsert({
        where: {
          membershipId_role: {
            membershipId,
            role,
          },
        },
        update: {},
        create: {
          membershipId,
          role,
        },
      });
    }

    await tx.adminAuditLog.create({
      data: {
        action: "USER_ROLES_UPDATED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify({
          roles: currentRoles,
          userEmail: membership.user.email,
          userId: membership.user.id,
        }),
        afterJson: JSON.stringify({
          roles: nextPrismaRoles,
          userEmail: membership.user.email,
          userId: membership.user.id,
        }),
        entityId: membership.user.id,
        entityType: "User",
        reason: parsed.reason,
        riskLevel: parsed.roles.includes("admin") ? "HIGH" : "MEDIUM",
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin/users");
  redirect("/admin/users?updated=roles");
}

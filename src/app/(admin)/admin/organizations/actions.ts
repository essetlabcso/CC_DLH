"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { parseOrganizationForm } from "@/lib/admin/organization-form";
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

function revalidateOrganizationPaths(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  revalidatePath(`/admin/organizations/${id}/edit`);
  revalidatePath("/admin/audit-log");
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

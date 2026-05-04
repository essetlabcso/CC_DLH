"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  parseLookupCategoryForm,
  parseLookupValueForm,
} from "@/lib/admin/reference-data-form";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

export async function createLookupCategoryAction(formData: FormData) {
  const identity = await requireWorkspaceIdentity(
    "/admin/reference-data/categories/new",
  );
  const parsed = parseLookupCategoryForm(formData);

  if (!parsed.ok) {
    redirect(
      `/admin/reference-data/categories/new?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const existing = await prisma.adminLookupCategory.findUnique({
    where: { categoryKey: parsed.data.categoryKey },
    select: { id: true },
  });

  if (existing) {
    redirect(
      `/admin/reference-data/categories/new?error=${encodeURIComponent(
        "A reference category with this key already exists.",
      )}`,
    );
  }

  const category = await prisma.$transaction(async (tx) => {
    const created = await tx.adminLookupCategory.create({
      data: {
        ...parsed.data,
        createdById: identity.user.id,
        isSystemCategory: false,
        updatedById: identity.user.id,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "LOOKUP_CATEGORY_CREATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditCategory(created)),
        entityId: created.id,
        entityType: "AdminLookupCategory",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return created;
  });

  revalidateReferencePaths();
  redirect(
    `/admin/reference-data?category=${encodeURIComponent(
      category.categoryKey,
    )}&created=category`,
  );
}

export async function updateLookupCategoryAction(
  categoryId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/reference-data/categories/${categoryId}/edit`,
  );
  const parsed = parseLookupCategoryForm(formData, { requireReason: true });

  if (!parsed.ok) {
    redirect(
      `/admin/reference-data/categories/${categoryId}/edit?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const current = await prisma.adminLookupCategory.findUnique({
    include: {
      _count: {
        select: {
          values: true,
        },
      },
    },
    where: { id: categoryId },
  });

  if (!current) {
    notFound();
  }

  if (current.isSystemCategory) {
    redirect(
      `/admin/reference-data?category=${encodeURIComponent(
        current.categoryKey,
      )}&error=${encodeURIComponent("System categories are protected.")}`,
    );
  }

  const categoryKey =
    current._count.values > 0 ? current.categoryKey : parsed.data.categoryKey;

  if (categoryKey !== current.categoryKey) {
    const duplicate = await prisma.adminLookupCategory.findUnique({
      where: { categoryKey },
      select: { id: true },
    });

    if (duplicate && duplicate.id !== categoryId) {
      redirect(
        `/admin/reference-data/categories/${categoryId}/edit?error=${encodeURIComponent(
          "A reference category with this key already exists.",
        )}`,
      );
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.adminLookupCategory.update({
      data: {
        ...parsed.data,
        categoryKey,
        updatedById: identity.user.id,
      },
      where: { id: categoryId },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "LOOKUP_CATEGORY_UPDATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditCategory(saved)),
        beforeJson: JSON.stringify(toAuditCategory(current)),
        entityId: saved.id,
        entityType: "AdminLookupCategory",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return saved;
  });

  revalidateReferencePaths();
  redirect(
    `/admin/reference-data?category=${encodeURIComponent(
      updated.categoryKey,
    )}&updated=category`,
  );
}

export async function createLookupValueAction(formData: FormData) {
  const identity = await requireWorkspaceIdentity("/admin/reference-data/values/new");
  const parsed = parseLookupValueForm(formData);

  if (!parsed.ok) {
    redirect(
      `/admin/reference-data/values/new?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const errorPath = `/admin/reference-data/values/new?categoryId=${encodeURIComponent(
    parsed.data.categoryId,
  )}`;

  await ensureCategoryExists(parsed.data.categoryId, errorPath);
  await ensureUniqueValueKey(
    parsed.data.categoryId,
    parsed.data.valueKey,
    errorPath,
  );
  await ensureParentValue(
    parsed.data.categoryId,
    parsed.data.parentValueId,
    errorPath,
  );

  const value = await prisma.$transaction(async (tx) => {
    const created = await tx.adminLookupValue.create({
      data: {
        ...parsed.data,
        createdById: identity.user.id,
        isSystemLocked: false,
        updatedById: identity.user.id,
      },
      include: { category: true },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "LOOKUP_VALUE_CREATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditValue(created)),
        entityId: created.id,
        entityType: "AdminLookupValue",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return created;
  });

  revalidateReferencePaths();
  redirect(
    `/admin/reference-data?category=${encodeURIComponent(
      value.category.categoryKey,
    )}&created=value`,
  );
}

export async function updateLookupValueAction(
  valueId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/admin/reference-data/values/${valueId}/edit`,
  );
  const parsed = parseLookupValueForm(formData, { requireReason: true });

  if (!parsed.ok) {
    redirect(
      `/admin/reference-data/values/${valueId}/edit?error=${encodeURIComponent(
        parsed.message,
      )}`,
    );
  }

  const current = await prisma.adminLookupValue.findUnique({
    include: { category: true },
    where: { id: valueId },
  });

  if (!current) {
    notFound();
  }

  if (current.isSystemLocked) {
    redirect(
      `/admin/reference-data?category=${encodeURIComponent(
        current.category.categoryKey,
      )}&error=${encodeURIComponent("System-locked values are protected.")}`,
    );
  }

  const errorPath = `/admin/reference-data/values/${valueId}/edit`;

  await ensureCategoryExists(parsed.data.categoryId, errorPath);
  await ensureUniqueValueKey(
    parsed.data.categoryId,
    parsed.data.valueKey,
    errorPath,
    valueId,
  );
  await ensureParentValue(
    parsed.data.categoryId,
    parsed.data.parentValueId,
    errorPath,
    valueId,
  );

  const updated = await prisma.$transaction(async (tx) => {
    const saved = await tx.adminLookupValue.update({
      data: {
        ...parsed.data,
        updatedById: identity.user.id,
      },
      include: { category: true },
      where: { id: valueId },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "LOOKUP_VALUE_UPDATED",
        actorId: identity.user.id,
        afterJson: JSON.stringify(toAuditValue(saved)),
        beforeJson: JSON.stringify(toAuditValue(current)),
        entityId: saved.id,
        entityType: "AdminLookupValue",
        reason: parsed.reason,
        riskLevel: "LOW",
      },
    });

    return saved;
  });

  revalidateReferencePaths();
  redirect(
    `/admin/reference-data?category=${encodeURIComponent(
      updated.category.categoryKey,
    )}&updated=value`,
  );
}

async function ensureCategoryExists(categoryId: string, redirectPath: string) {
  const category = await prisma.adminLookupCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    redirect(
      withError(redirectPath, "Choose an existing reference category."),
    );
  }
}

async function ensureUniqueValueKey(
  categoryId: string,
  valueKey: string,
  redirectPath: string,
  currentValueId?: string,
) {
  const duplicate = await prisma.adminLookupValue.findUnique({
    where: {
      categoryId_valueKey: {
        categoryId,
        valueKey,
      },
    },
    select: { id: true },
  });

  if (duplicate && duplicate.id !== currentValueId) {
    redirect(
      withError(
        redirectPath,
        "A value with this key already exists in the selected category.",
      ),
    );
  }
}

async function ensureParentValue(
  categoryId: string,
  parentValueId: string | null,
  redirectPath: string,
  currentValueId?: string,
) {
  if (!parentValueId) {
    return;
  }

  if (parentValueId === currentValueId) {
    redirect(
      withError(redirectPath, "A value cannot be its own parent."),
    );
  }

  const parent = await prisma.adminLookupValue.findFirst({
    where: {
      categoryId,
      id: parentValueId,
    },
    select: { id: true },
  });

  if (!parent) {
    redirect(
      withError(redirectPath, "Choose a parent value from the same category."),
    );
  }
}

function withError(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(message)}`;
}

function revalidateReferencePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin/reference-data");
}

function toAuditCategory(category: {
  categoryKey: string;
  categoryName: string;
  description: string;
  id: string;
  isActive: boolean;
  isSystemCategory: boolean;
  workflowPhase: string;
}) {
  return {
    categoryKey: category.categoryKey,
    categoryName: category.categoryName,
    description: category.description,
    id: category.id,
    isActive: category.isActive,
    isSystemCategory: category.isSystemCategory,
    workflowPhase: category.workflowPhase,
  };
}

function toAuditValue(value: {
  category: { categoryKey: string };
  changeReason: string;
  description: string;
  displayLabel: string;
  displayOrder: number;
  helpText: string;
  id: string;
  isActive: boolean;
  isSystemLocked: boolean;
  parentValueId: string | null;
  valueKey: string;
  visibleInMonitoring: boolean;
  visibleToAdmin: boolean;
  visibleToCreator: boolean;
  visibleToParticipant: boolean;
  visibleToReviewer: boolean;
}) {
  return {
    categoryKey: value.category.categoryKey,
    changeReason: value.changeReason,
    description: value.description,
    displayLabel: value.displayLabel,
    displayOrder: value.displayOrder,
    helpText: value.helpText,
    id: value.id,
    isActive: value.isActive,
    isSystemLocked: value.isSystemLocked,
    parentValueId: value.parentValueId,
    valueKey: value.valueKey,
    visibleInMonitoring: value.visibleInMonitoring,
    visibleToAdmin: value.visibleToAdmin,
    visibleToCreator: value.visibleToCreator,
    visibleToParticipant: value.visibleToParticipant,
    visibleToReviewer: value.visibleToReviewer,
  };
}

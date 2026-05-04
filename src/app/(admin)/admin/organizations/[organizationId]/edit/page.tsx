import { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { getOrganizationDetail } from "@/lib/admin/organizations";
import { updateOrganizationAction } from "../../actions";
import { OrganizationForm } from "../../OrganizationForm";

export const metadata: Metadata = {
  title: "Edit Organization | Admin Portal",
};

type EditOrganizationPageProps = {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditOrganizationPage({
  params,
  searchParams,
}: EditOrganizationPageProps) {
  const { organizationId } = await params;
  await requireWorkspaceIdentity(`/admin/organizations/${organizationId}/edit`);
  const { error } = await searchParams;

  const org = await getOrganizationDetail(organizationId);

  if (!org) {
    notFound();
  }

  const [types, focusAreas] = await Promise.all([
    prisma.adminLookupValue.findMany({
      where: {
        category: { categoryKey: "organization_types" },
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
      select: { valueKey: true, displayLabel: true },
    }),
    prisma.adminLookupValue.findMany({
      where: {
        category: { categoryKey: "geographic_focus_areas" },
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
      select: { valueKey: true, displayLabel: true },
    }),
  ]);

  // Ensure initialData matches what OrganizationForm expects
  const initialData = {
    id: org.id,
    name: org.name,
    slug: org.slug,
    organizationType: org.organizationType || "",
    geographicFocus: org.geographicFocus || "",
    description: org.description || "",
    contactEmail: org.contactEmail || "",
    website: org.website || "",
    phone: org.phone || "",
    status: org.status,
    isSystem: org.isSystem,
  };

  const updateWithId = updateOrganizationAction.bind(null, organizationId);

  return (
    <div className="workspace-container">
      <header className="workspace-header">
        <h1>Edit Organization</h1>
        <p className="workspace-description">
          Update metadata for <strong>{org.name}</strong>.
        </p>
      </header>

      <div className="workspace-content">
        <div className="admin-form-shell">
          <OrganizationForm
            action={updateWithId}
            error={error}
            mode="edit"
            initialData={initialData}
            lookups={{ types, focusAreas }}
          />
        </div>
      </div>
    </div>
  );
}

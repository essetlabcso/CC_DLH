import { Metadata } from "next";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { createOrganizationAction } from "../actions";
import { OrganizationForm } from "../OrganizationForm";

export const metadata: Metadata = {
  title: "New Organization | Admin Portal",
};

type NewOrganizationPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewOrganizationPage({
  searchParams,
}: NewOrganizationPageProps) {
  await requireWorkspaceIdentity("/admin/organizations/new");
  const { error } = await searchParams;

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

  return (
    <div className="workspace-container">
      <header className="workspace-header">
        <h1>New Organization</h1>
        <p className="workspace-description">
          Register a new partner CSO or internal unit to enable diagnosis and course enrollment.
        </p>
      </header>

      <div className="workspace-content">
        <div className="admin-form-shell">
          <OrganizationForm
            action={createOrganizationAction}
            error={error}
            mode="create"
            lookups={{ types, focusAreas }}
          />
        </div>
      </div>
    </div>
  );
}

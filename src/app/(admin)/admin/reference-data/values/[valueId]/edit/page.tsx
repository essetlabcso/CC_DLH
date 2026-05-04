import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { updateLookupValueAction } from "@/app/(admin)/admin/reference-data/actions";
import { LookupValueForm } from "@/app/(admin)/admin/reference-data/LookupValueForm";
import {
  getAdminLookupValueForEdit,
  getAdminLookupValueFormOptions,
} from "@/lib/admin/reference-data";
import Link from "next/link";
import { notFound } from "next/navigation";

type EditLookupValuePageProps = {
  params?: Promise<{
    valueId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditLookupValuePage({
  params,
  searchParams,
}: EditLookupValuePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const valueId = resolvedParams?.valueId;

  if (!valueId) {
    notFound();
  }

  const value = await getAdminLookupValueForEdit(valueId);

  if (!value) {
    notFound();
  }

  const options = await getAdminLookupValueFormOptions({
    categoryId: value.categoryId,
    excludeValueId: value.id,
  });

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Edit Controlled Value">
      <div className="admin-dashboard reference-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">{value.categoryName}</p>
            <h2>{value.displayLabel}</h2>
            <p>
              Update Admin-managed controlled value details. System-locked values
              are protected.
            </p>
          </div>
          <Link
            className="workspace-link secondary"
            href={`/admin/reference-data?category=${encodeURIComponent(
              value.categoryKey,
            )}`}
          >
            Back to category
          </Link>
        </section>

        {value.canEdit ? (
          <section className="admin-section" aria-labelledby="value-form-title">
            <div className="admin-section-heading">
              <h2 id="value-form-title">Value details</h2>
              <p>
                Changes are recorded in the Admin audit log. Historical course
                records keep their stored values.
              </p>
            </div>
            <LookupValueForm
              action={updateLookupValueAction.bind(null, value.id)}
              error={resolvedSearchParams?.error}
              mode="edit"
              options={options}
              value={value}
            />
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-published">
              System Locked
            </span>
            <h2>Protected controlled value</h2>
            <p>
              This value is part of the protected reference set and cannot be
              edited here.
            </p>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

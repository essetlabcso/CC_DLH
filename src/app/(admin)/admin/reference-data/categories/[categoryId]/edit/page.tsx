import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { updateLookupCategoryAction } from "@/app/(admin)/admin/reference-data/actions";
import { LookupCategoryForm } from "@/app/(admin)/admin/reference-data/LookupCategoryForm";
import { getAdminLookupCategoryForEdit } from "@/lib/admin/reference-data";
import Link from "next/link";
import { notFound } from "next/navigation";

type EditLookupCategoryPageProps = {
  params?: Promise<{
    categoryId?: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditLookupCategoryPage({
  params,
  searchParams,
}: EditLookupCategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedParams?.categoryId;

  if (!categoryId) {
    notFound();
  }

  const category = await getAdminLookupCategoryForEdit(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="Edit Reference Category">
      <div className="admin-dashboard reference-browser">
        <section className="admin-hero">
          <div>
            <p className="workspace-kicker">{category.categoryKey}</p>
            <h2>{category.categoryName}</h2>
            <p>
              Update Admin-managed category details. System categories are
              protected to keep core workflow bindings stable.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin/reference-data">
            Back to reference data
          </Link>
        </section>

        {category.canEdit ? (
          <section className="admin-section" aria-labelledby="category-form-title">
            <div className="admin-section-heading">
              <h2 id="category-form-title">Category details</h2>
              <p>
                Changes are recorded in the Admin audit log and do not alter
                existing course records.
              </p>
            </div>
            <LookupCategoryForm
              action={updateLookupCategoryAction.bind(null, category.id)}
              category={category}
              error={resolvedSearchParams?.error}
              mode="edit"
            />
          </section>
        ) : (
          <section className="admin-empty-panel">
            <span className="status-badge status-badge-published">
              Protected
            </span>
            <h2>System category</h2>
            <p>
              This category is protected. Admins can add controlled values where
              appropriate, but the category definition is not editable here.
            </p>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

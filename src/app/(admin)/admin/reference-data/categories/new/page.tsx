import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { createLookupCategoryAction } from "@/app/(admin)/admin/reference-data/actions";
import { LookupCategoryForm } from "@/app/(admin)/admin/reference-data/LookupCategoryForm";
import Link from "next/link";

type NewLookupCategoryPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewLookupCategoryPage({
  searchParams,
}: NewLookupCategoryPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="New Reference Category">
      <div className="admin-dashboard reference-browser">
        <section className="admin-hero">
          <div>
            <h2>Create a reference category</h2>
            <p>
              Add an Admin-managed group for controlled values. System categories
              remain protected.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin/reference-data">
            Back to reference data
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="category-form-title">
          <div className="admin-section-heading">
            <h2 id="category-form-title">Category details</h2>
            <p>
              Use stable keys and clear names so future dropdowns and dashboards
              stay consistent.
            </p>
          </div>
          <LookupCategoryForm
            action={createLookupCategoryAction}
            error={resolvedSearchParams?.error}
            mode="create"
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}

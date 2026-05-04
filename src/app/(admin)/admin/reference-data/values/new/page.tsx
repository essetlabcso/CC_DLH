import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { createLookupValueAction } from "@/app/(admin)/admin/reference-data/actions";
import { LookupValueForm } from "@/app/(admin)/admin/reference-data/LookupValueForm";
import { getAdminLookupValueFormOptions } from "@/lib/admin/reference-data";
import Link from "next/link";

type NewLookupValuePageProps = {
  searchParams?: Promise<{
    categoryId?: string;
    error?: string;
  }>;
};

export default async function NewLookupValuePage({
  searchParams,
}: NewLookupValuePageProps) {
  const resolvedSearchParams = await searchParams;
  const options = await getAdminLookupValueFormOptions({
    categoryId: resolvedSearchParams?.categoryId,
  });

  return (
    <WorkspaceShell eyebrow="Admin Control Center" title="New Controlled Value">
      <div className="admin-dashboard reference-browser">
        <section className="admin-hero">
          <div>
            <h2>Create a controlled value</h2>
            <p>
              Add an Admin-managed option to a reference category. New values are
              not system locked.
            </p>
          </div>
          <Link className="workspace-link secondary" href="/admin/reference-data">
            Back to reference data
          </Link>
        </section>

        <section className="admin-section" aria-labelledby="value-form-title">
          <div className="admin-section-heading">
            <h2 id="value-form-title">Value details</h2>
            <p>
              Set label, ordering, parent value, status, and role visibility for
              future controlled dropdown use.
            </p>
          </div>
          <LookupValueForm
            action={createLookupValueAction}
            error={resolvedSearchParams?.error}
            mode="create"
            options={options}
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}

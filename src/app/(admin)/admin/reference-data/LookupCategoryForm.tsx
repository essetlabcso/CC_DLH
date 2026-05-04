import Link from "next/link";

import type { AdminLookupCategoryFormDetail } from "@/lib/admin/reference-data";

type LookupCategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: AdminLookupCategoryFormDetail;
  error?: string;
  mode: "create" | "edit";
};

export function LookupCategoryForm({
  action,
  category,
  error,
  mode,
}: LookupCategoryFormProps) {
  const isEdit = mode === "edit";
  const canEditCategoryKey = category?.canEditCategoryKey ?? true;

  return (
    <form action={action} className="setup-form admin-draft-form">
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend>Category identity</legend>
        <label>
          <span>Category key</span>
          <input
            aria-describedby={
              canEditCategoryKey ? undefined : "category-key-readonly-note"
            }
            defaultValue={category?.categoryKey ?? ""}
            name="categoryKey"
            placeholder="course_levels"
            readOnly={!canEditCategoryKey}
            required
          />
        </label>
        {!canEditCategoryKey ? (
          <p className="form-help" id="category-key-readonly-note">
            Category key is locked because this category already has values.
          </p>
        ) : null}

        <label>
          <span>Category name</span>
          <input
            defaultValue={category?.categoryName ?? ""}
            name="categoryName"
            placeholder="Course Levels"
            required
          />
        </label>

        <label>
          <span>Workflow area</span>
          <input
            defaultValue={category?.workflowPhase ?? "cross-workflow"}
            name="workflowPhase"
            placeholder="course-setup"
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            defaultValue={category?.description ?? ""}
            name="description"
            placeholder="Explain what this reference category controls."
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Status</legend>
        <label className="checkbox-row">
          <input
            defaultChecked={category?.isActive ?? true}
            name="isActive"
            type="checkbox"
          />
          <span>Active</span>
        </label>

        {isEdit ? (
          <label>
            <span>Reason for update</span>
            <textarea
              name="changeReason"
              placeholder="Briefly explain why this category is being updated."
              required
            />
          </label>
        ) : (
          <label>
            <span>Create reason</span>
            <textarea
              name="changeReason"
              placeholder="Optional note for the Admin audit trail."
            />
          </label>
        )}
      </fieldset>

      <div className="form-actions">
        <button className="workspace-link" type="submit">
          {isEdit ? "Save category" : "Create category"}
        </button>
        <Link className="workspace-link secondary" href="/admin/reference-data">
          Cancel
        </Link>
      </div>
    </form>
  );
}

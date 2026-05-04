import Link from "next/link";

import type {
  AdminLookupValueFormDetail,
  AdminLookupValueFormOptions,
} from "@/lib/admin/reference-data";

type LookupValueFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  mode: "create" | "edit";
  options: AdminLookupValueFormOptions;
  value?: AdminLookupValueFormDetail;
};

export function LookupValueForm({
  action,
  error,
  mode,
  options,
  value,
}: LookupValueFormProps) {
  const isEdit = mode === "edit";
  const selectedCategoryId =
    value?.categoryId ?? options.selectedCategory?.id ?? "";

  return (
    <form action={action} className="setup-form admin-draft-form">
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend>Reference category</legend>
        <label>
          <span>Category</span>
          <select
            defaultValue={selectedCategoryId}
            name="categoryId"
            required
          >
            <option value="">Choose a category</option>
            {options.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>
        <p className="form-help">
          Parent value options are shown for the selected category used to open
          this form.
        </p>
      </fieldset>

      <fieldset>
        <legend>Value identity</legend>
        <label>
          <span>Value key</span>
          <input
            defaultValue={value?.valueKey ?? ""}
            name="valueKey"
            placeholder="advanced"
            required
          />
        </label>

        <label>
          <span>Display label</span>
          <input
            defaultValue={value?.displayLabel ?? ""}
            name="displayLabel"
            placeholder="Advanced"
            required
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            defaultValue={value?.description ?? ""}
            name="description"
            placeholder="Explain what this value means."
          />
        </label>

        <label>
          <span>Help text</span>
          <textarea
            defaultValue={value?.helpText ?? ""}
            name="helpText"
            placeholder="Optional guidance shown near future dropdowns."
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Order and parent value</legend>
        <div className="form-grid">
          <label>
            <span>Display order</span>
            <input
              defaultValue={value?.displayOrder ?? 0}
              name="displayOrder"
              type="number"
            />
          </label>
          <label>
            <span>Parent value</span>
            <select
              defaultValue={value?.parentValueId ?? ""}
              name="parentValueId"
            >
              <option value="">None</option>
              {options.parentValues.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.displayLabel}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Status and visibility</legend>
        <label className="checkbox-row">
          <input
            defaultChecked={value?.isActive ?? true}
            name="isActive"
            type="checkbox"
          />
          <span>Active</span>
        </label>
        <div className="reference-visibility-grid">
          <Checkbox
            defaultChecked={value?.visibleToAdmin ?? true}
            label="Visible to Admin"
            name="visibleToAdmin"
          />
          <Checkbox
            defaultChecked={value?.visibleToCreator ?? true}
            label="Visible to Creator"
            name="visibleToCreator"
          />
          <Checkbox
            defaultChecked={value?.visibleToReviewer ?? true}
            label="Visible to Reviewer"
            name="visibleToReviewer"
          />
          <Checkbox
            defaultChecked={value?.visibleToParticipant ?? false}
            label="Visible to Participant"
            name="visibleToParticipant"
          />
          <Checkbox
            defaultChecked={value?.visibleInMonitoring ?? false}
            label="Visible in Monitoring"
            name="visibleInMonitoring"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend>Admin reason</legend>
        <label>
          <span>{isEdit ? "Reason for update" : "Create reason"}</span>
          <textarea
            name="changeReason"
            placeholder={
              isEdit
                ? "Briefly explain why this value is being updated."
                : "Optional note for the Admin audit trail."
            }
            required={isEdit}
          />
        </label>
      </fieldset>

      <div className="form-actions">
        <button className="workspace-link" type="submit">
          {isEdit ? "Save value" : "Create value"}
        </button>
        <Link className="workspace-link secondary" href="/admin/reference-data">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Checkbox({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="checkbox-row">
      <input defaultChecked={defaultChecked} name={name} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}

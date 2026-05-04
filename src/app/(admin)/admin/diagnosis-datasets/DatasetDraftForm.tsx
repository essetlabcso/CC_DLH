import Link from "next/link";

type DatasetDraftFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  canEditDatasetCode?: boolean;
  dataset?: {
    assessmentPeriodEnd?: Date | null;
    assessmentPeriodStart?: Date | null;
    assessmentPurpose: string;
    dataCollectionMethods: string[];
    datasetCode: string;
    datasetTitle: string;
    id: string;
    notes: string;
    organizationGroup: string;
    programOrProject: string;
    regionsCovered: string[];
    visibilityScope: string;
  };
  error?: string;
  mode: "create" | "edit";
};

export function DatasetDraftForm({
  action,
  canEditDatasetCode = true,
  dataset,
  error,
  mode,
}: DatasetDraftFormProps) {
  const isEdit = mode === "edit";

  return (
    <form action={action} className="setup-form admin-draft-form">
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend>Core dataset identity</legend>
        <label>
          <span>Dataset code</span>
          <input
            aria-describedby={
              canEditDatasetCode ? undefined : "dataset-code-readonly-note"
            }
            defaultValue={dataset?.datasetCode ?? ""}
            name="datasetCode"
            placeholder="DEC-CSF-2026-R2"
            readOnly={!canEditDatasetCode}
            required
          />
        </label>
        {!canEditDatasetCode ? (
          <p className="form-help" id="dataset-code-readonly-note">
            Dataset code is locked because this draft already has linked records.
          </p>
        ) : null}

        <label>
          <span>Dataset title</span>
          <input
            defaultValue={dataset?.datasetTitle ?? ""}
            name="datasetTitle"
            placeholder="CSO Capacity Diagnosis Round 2"
            required
          />
        </label>

        <label>
          <span>Program / project</span>
          <input
            defaultValue={dataset?.programOrProject ?? ""}
            name="programOrProject"
            placeholder="EU CSF+"
          />
        </label>

        <label>
          <span>Assessment purpose</span>
          <textarea
            defaultValue={dataset?.assessmentPurpose ?? ""}
            name="assessmentPurpose"
            placeholder="Describe why this diagnosis dataset was collected."
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Coverage and methods</legend>
        <div className="form-grid">
          <label>
            <span>Assessment start</span>
            <input
              defaultValue={formatDateInput(dataset?.assessmentPeriodStart)}
              name="assessmentPeriodStart"
              type="date"
            />
          </label>
          <label>
            <span>Assessment end</span>
            <input
              defaultValue={formatDateInput(dataset?.assessmentPeriodEnd)}
              name="assessmentPeriodEnd"
              type="date"
            />
          </label>
        </div>

        <label>
          <span>Regions covered</span>
          <textarea
            defaultValue={formatList(dataset?.regionsCovered)}
            name="regionsCovered"
            placeholder="Addis Ababa&#10;Oromia&#10;Sidama"
          />
        </label>

        <label>
          <span>Organization group</span>
          <input
            defaultValue={dataset?.organizationGroup ?? ""}
            name="organizationGroup"
            placeholder="Selected local CSO partners"
          />
        </label>

        <label>
          <span>Data collection methods</span>
          <textarea
            defaultValue={formatList(dataset?.dataCollectionMethods)}
            name="dataCollectionMethods"
            placeholder="Workshop&#10;Survey&#10;Interview"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Visibility and notes</legend>
        <label>
          <span>Visibility scope</span>
          <select
            defaultValue={dataset?.visibilityScope ?? "ADMIN_ONLY"}
            name="visibilityScope"
          >
            <option value="ADMIN_ONLY">Admin only</option>
            <option value="DEC_COURSE_CREATORS">
              DEC course creators / internal course creation
            </option>
            <option value="INTERNAL_COURSE_CREATION">
              Internal course creation
            </option>
          </select>
        </label>

        <label>
          <span>Admin notes</span>
          <textarea
            defaultValue={dataset?.notes ?? ""}
            name="notes"
            placeholder="Use safe summary notes only. Do not include raw interview, safeguarding, political, or personal data."
          />
        </label>

        {isEdit ? (
          <label>
            <span>Reason for update</span>
            <textarea
              name="updateReason"
              placeholder="Briefly explain why this draft dataset is being updated."
              required
            />
          </label>
        ) : (
          <label>
            <span>Create reason</span>
            <textarea
              name="createReason"
              placeholder="Optional note for the Admin audit trail."
            />
          </label>
        )}
      </fieldset>

      <div className="form-actions">
        <button className="workspace-link" type="submit">
          {isEdit ? "Save draft dataset" : "Create draft dataset"}
        </button>
        <Link
          className="workspace-link secondary"
          href={
            dataset
              ? `/admin/diagnosis-datasets/${dataset.id}`
              : "/admin/diagnosis-datasets"
          }
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function formatDateInput(value?: Date | null) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function formatList(values?: string[]) {
  return values?.join("\n") ?? "";
}

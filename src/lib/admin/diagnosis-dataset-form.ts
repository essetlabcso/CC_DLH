export type DiagnosisDatasetFormValues = {
  assessmentPeriodEnd: Date | null;
  assessmentPeriodStart: Date | null;
  assessmentPurpose: string;
  createReason: string;
  dataCollectionMethods: string;
  datasetCode: string;
  datasetTitle: string;
  notes: string;
  organizationGroup: string;
  programOrProject: string;
  regionsCovered: string;
  updateReason: string;
  visibilityScope: string;
};

export type DiagnosisDatasetFormField =
  | "assessmentPeriodEnd"
  | "assessmentPeriodStart"
  | "datasetCode"
  | "datasetTitle"
  | "updateReason";

export type DiagnosisDatasetFormResult =
  | {
      ok: true;
      data: {
        assessmentPeriodEnd: Date | null;
        assessmentPeriodStart: Date | null;
        assessmentPurpose: string;
        dataCollectionMethods: string;
        datasetCode: string;
        datasetTitle: string;
        notes: string;
        organizationGroup: string;
        programOrProject: string;
        regionsCovered: string;
        visibilityScope: string;
      };
      reason: string;
    }
  | {
      ok: false;
      fieldErrors: Partial<Record<DiagnosisDatasetFormField, string>>;
      message: string;
    };

export function parseDiagnosisDatasetForm(
  formData: FormData,
  { requireUpdateReason = false }: { requireUpdateReason?: boolean } = {},
): DiagnosisDatasetFormResult {
  const values = readDiagnosisDatasetFormValues(formData);
  const fieldErrors: Partial<Record<DiagnosisDatasetFormField, string>> = {};

  if (!values.datasetCode) {
    fieldErrors.datasetCode = "Enter a dataset code.";
  }

  if (!values.datasetTitle) {
    fieldErrors.datasetTitle = "Enter a dataset title.";
  }

  if (
    values.assessmentPeriodStart &&
    values.assessmentPeriodEnd &&
    values.assessmentPeriodStart > values.assessmentPeriodEnd
  ) {
    fieldErrors.assessmentPeriodEnd =
      "Assessment end date must be after the start date.";
  }

  const reason = requireUpdateReason
    ? values.updateReason
    : values.createReason;

  if (requireUpdateReason && !reason) {
    fieldErrors.updateReason = "Enter a reason for this update.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: "Check the dataset details and try again.",
    };
  }

  return {
    ok: true,
    data: {
      assessmentPeriodEnd: values.assessmentPeriodEnd,
      assessmentPeriodStart: values.assessmentPeriodStart,
      assessmentPurpose: values.assessmentPurpose,
      dataCollectionMethods: serializeList(values.dataCollectionMethods),
      datasetCode: values.datasetCode,
      datasetTitle: values.datasetTitle,
      notes: values.notes,
      organizationGroup: values.organizationGroup,
      programOrProject: values.programOrProject,
      regionsCovered: serializeList(values.regionsCovered),
      visibilityScope: values.visibilityScope || "ADMIN_ONLY",
    },
    reason,
  };
}

export function readDiagnosisDatasetFormValues(
  formData: FormData,
): DiagnosisDatasetFormValues {
  return {
    assessmentPeriodEnd: parseDate(readString(formData, "assessmentPeriodEnd")),
    assessmentPeriodStart: parseDate(
      readString(formData, "assessmentPeriodStart"),
    ),
    assessmentPurpose: readString(formData, "assessmentPurpose"),
    createReason: readString(formData, "createReason"),
    dataCollectionMethods: readString(formData, "dataCollectionMethods"),
    datasetCode: readString(formData, "datasetCode").toUpperCase(),
    datasetTitle: readString(formData, "datasetTitle"),
    notes: readString(formData, "notes"),
    organizationGroup: readString(formData, "organizationGroup"),
    programOrProject: readString(formData, "programOrProject"),
    regionsCovered: readString(formData, "regionsCovered"),
    updateReason: readString(formData, "updateReason"),
    visibilityScope: readString(formData, "visibilityScope") || "ADMIN_ONLY",
  };
}

export function serializeList(value: string) {
  return JSON.stringify(
    value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

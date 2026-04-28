export type PreviewCompletionChecksInput = {
  practicalFlowConfirmed: boolean;
  avoidsInformationDumpConfirmed: boolean;
  practiceConfirmed: boolean;
  mobilePreviewConfirmed: boolean;
  accessibilityPreviewConfirmed: boolean;
};

export type PreviewCompletionValidationResult =
  | {
      ok: true;
      value: PreviewCompletionChecksInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const previewCompletionFieldLabels: Record<string, string> = {
  practicalFlowConfirmed: "practical lesson flow",
  avoidsInformationDumpConfirmed: "no information dumping",
  practiceConfirmed: "decision or practice activity",
  mobilePreviewConfirmed: "mobile preview",
  accessibilityPreviewConfirmed: "accessibility preview",
};

export function parsePreviewCompletionChecksFormData(
  formData: FormData,
): PreviewCompletionValidationResult {
  const value: PreviewCompletionChecksInput = {
    practicalFlowConfirmed: formData.get("practicalFlowConfirmed") === "on",
    avoidsInformationDumpConfirmed:
      formData.get("avoidsInformationDumpConfirmed") === "on",
    practiceConfirmed: formData.get("practiceConfirmed") === "on",
    mobilePreviewConfirmed: formData.get("mobilePreviewConfirmed") === "on",
    accessibilityPreviewConfirmed:
      formData.get("accessibilityPreviewConfirmed") === "on",
  };
  const missingFields = Object.entries(value)
    .filter(([, confirmed]) => !confirmed)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  return {
    ok: true,
    value,
  };
}

export function summarizePreviewCompletionChecks(
  input: PreviewCompletionChecksInput,
) {
  const completed = Object.entries(input)
    .filter(([, confirmed]) => confirmed)
    .map(([field]) => previewCompletionFieldLabels[field] || field);

  return `Preview checks completed: ${completed.join(", ")}.`;
}

export type RevisionRequestInput = {
  revisionReason: string;
};

export type RevisionRequestValidationResult =
  | {
      ok: true;
      value: RevisionRequestInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const revisionRequestFieldLabels: Record<string, string> = {
  revisionReason: "revision reason",
};

export function parseRevisionRequestFormData(
  formData: FormData,
): RevisionRequestValidationResult {
  const revisionReason = getTrimmedFormValue(formData, "revisionReason");

  if (!revisionReason) {
    return {
      ok: false,
      missingFields: ["revisionReason"],
    };
  }

  return {
    ok: true,
    value: {
      revisionReason,
    },
  };
}

export function summarizeRevisionRequest(
  courseTitle: string,
  input: RevisionRequestInput,
) {
  return `Revision requested for ${courseTitle}: ${input.revisionReason}`;
}

function getTrimmedFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

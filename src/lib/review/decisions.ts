export type ReviewerApprovalChecksInput = {
  runtimePreviewConfirmed: boolean;
  actionAlignmentConfirmed: boolean;
  accessibilityMobileConfirmed: boolean;
  safeguardingConfirmed: boolean;
  assessmentConfirmed: boolean;
  sourcesConfirmed: boolean;
  decisionNotes: string;
};

export type ReviewerReturnInput = {
  returnedReason: string;
};

export type ReviewerApprovalValidationResult =
  | {
      ok: true;
      value: ReviewerApprovalChecksInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type ReviewerReturnValidationResult =
  | {
      ok: true;
      value: ReviewerReturnInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const reviewerApprovalFieldLabels: Record<string, string> = {
  runtimePreviewConfirmed: "runtime preview",
  actionAlignmentConfirmed: "action alignment",
  accessibilityMobileConfirmed: "accessibility and mobile readiness",
  safeguardingConfirmed: "safeguarding and civic-space safety",
  assessmentConfirmed: "learner checks and assessment",
  sourcesConfirmed: "source and credibility review",
  decisionNotes: "reviewer decision notes",
};

export const reviewerReturnFieldLabels: Record<string, string> = {
  returnedReason: "return-for-changes comments",
};

export function parseReviewerApprovalFormData(
  formData: FormData,
): ReviewerApprovalValidationResult {
  const value: ReviewerApprovalChecksInput = {
    runtimePreviewConfirmed: formData.get("runtimePreviewConfirmed") === "on",
    actionAlignmentConfirmed:
      formData.get("actionAlignmentConfirmed") === "on",
    accessibilityMobileConfirmed:
      formData.get("accessibilityMobileConfirmed") === "on",
    safeguardingConfirmed: formData.get("safeguardingConfirmed") === "on",
    assessmentConfirmed: formData.get("assessmentConfirmed") === "on",
    sourcesConfirmed: formData.get("sourcesConfirmed") === "on",
    decisionNotes: getTrimmedFormValue(formData, "decisionNotes"),
  };
  const missingFields = Object.entries(value)
    .filter(([, fieldValue]) =>
      typeof fieldValue === "boolean" ? !fieldValue : fieldValue.length === 0,
    )
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

export function parseReviewerReturnFormData(
  formData: FormData,
): ReviewerReturnValidationResult {
  const value: ReviewerReturnInput = {
    returnedReason: getTrimmedFormValue(formData, "returnedReason"),
  };

  if (!value.returnedReason) {
    return {
      ok: false,
      missingFields: ["returnedReason"],
    };
  }

  return {
    ok: true,
    value,
  };
}

export function buildReviewerApprovalChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerApprovalChecksInput,
) {
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      runtimePreviewConfirmed: input.runtimePreviewConfirmed,
      actionAlignmentConfirmed: input.actionAlignmentConfirmed,
      accessibilityMobileConfirmed: input.accessibilityMobileConfirmed,
      safeguardingConfirmed: input.safeguardingConfirmed,
      assessmentConfirmed: input.assessmentConfirmed,
      sourcesConfirmed: input.sourcesConfirmed,
      approvedAt: new Date().toISOString(),
    },
  });
}

export function buildReviewerReturnChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerReturnInput,
) {
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      returnedForChanges: true,
      returnedReason: input.returnedReason,
      returnedAt: new Date().toISOString(),
    },
  });
}

export function summarizeReviewerApproval(input: ReviewerApprovalChecksInput) {
  const completed = Object.entries(input)
    .filter(([field, fieldValue]) => field !== "decisionNotes" && fieldValue)
    .map(([field]) => reviewerApprovalFieldLabels[field] || field);

  return `Reviewer approval recorded: ${completed.join(", ")}.`;
}

export function summarizeReviewerReturn(input: ReviewerReturnInput) {
  return `Returned for changes: ${input.returnedReason}`;
}

function getTrimmedFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function parseChecklist(checklist: string | null | undefined) {
  if (!checklist) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(checklist);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return {};
  }

  return {};
}

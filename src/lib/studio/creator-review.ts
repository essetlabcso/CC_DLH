export type CreatorReviewChecksInput = {
  actionMappingConfirmed: boolean;
  accuracySourcesConfirmed: boolean;
  accessibilityMobileConfirmed: boolean;
  safeguardingConfirmed: boolean;
  learnerCheckConfirmed: boolean;
  plainLanguageConfirmed: boolean;
  submissionReadinessConfirmed: boolean;
};

export type CreatorReviewValidationResult =
  | {
      ok: true;
      value: CreatorReviewChecksInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const creatorReviewFieldLabels: Record<string, string> = {
  actionMappingConfirmed: "action-mapping quality",
  accuracySourcesConfirmed: "accuracy and source readiness",
  accessibilityMobileConfirmed: "accessibility and mobile readiness",
  safeguardingConfirmed: "safeguarding and civic-space safety",
  learnerCheckConfirmed: "learner checks and practice",
  plainLanguageConfirmed: "plain-language readability",
  submissionReadinessConfirmed: "submission readiness",
};

export function parseCreatorReviewChecksFormData(
  formData: FormData,
): CreatorReviewValidationResult {
  const value: CreatorReviewChecksInput = {
    actionMappingConfirmed: formData.get("actionMappingConfirmed") === "on",
    accuracySourcesConfirmed: formData.get("accuracySourcesConfirmed") === "on",
    accessibilityMobileConfirmed:
      formData.get("accessibilityMobileConfirmed") === "on",
    safeguardingConfirmed: formData.get("safeguardingConfirmed") === "on",
    learnerCheckConfirmed: formData.get("learnerCheckConfirmed") === "on",
    plainLanguageConfirmed: formData.get("plainLanguageConfirmed") === "on",
    submissionReadinessConfirmed:
      formData.get("submissionReadinessConfirmed") === "on",
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

export function buildCreatorReviewChecklist(input: CreatorReviewChecksInput) {
  return JSON.stringify({
    creatorReview: input,
    completedAt: new Date().toISOString(),
  });
}

export function summarizeCreatorReviewChecks(input: CreatorReviewChecksInput) {
  const completed = Object.entries(input)
    .filter(([, confirmed]) => confirmed)
    .map(([field]) => creatorReviewFieldLabels[field] || field);

  return `Creator Review completed: ${completed.join(", ")}.`;
}

export const practicalProofCertificateRule =
  "80%+ final test score = pass and automated course certificate";

export const practicalProofVisibilityDefault = "PRIVATE";

export const practicalProofTypes = [
  {
    value: "work-sample",
    label: "Work sample",
  },
  {
    value: "field-implementation-note",
    label: "Field implementation note",
  },
  {
    value: "tool-or-template",
    label: "Tool or template",
  },
  {
    value: "scenario-response",
    label: "Scenario response",
  },
  {
    value: "reflection-note",
    label: "Reflection note",
  },
] as const;

export const practicalProofSubmissionFormats = [
  {
    value: "text-response",
    label: "Text response",
  },
  {
    value: "document-link",
    label: "Document link",
  },
  {
    value: "document-upload-future",
    label: "Document upload in a future release",
  },
] as const;

export type PracticalProofConfigInput = {
  enabled: boolean;
  proofTitle: string;
  proofPurpose: string;
  acceptedProofType: string;
  submissionFormat: string;
  instructions: string;
  safetyGuidance: string;
  reviewCriteria: string;
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  visibilityDefault: string;
  donorVisibilityEnabled: boolean;
  certificateSeparationConfirmed: boolean;
  specialistReviewRequired: boolean;
};

export type PracticalProofConfigLike = PracticalProofConfigInput | null | undefined;

export type PracticalProofReadiness = {
  enabled: boolean;
  ready: boolean;
  status: string;
  summary: string;
  certificateSeparation: string;
  visibilityDefault: string;
  donorVisibilityEnabled: boolean;
  specialistReviewRequired: boolean;
  proofTitle: string;
  acceptedProofType: string;
  acceptedProofTypeLabel: string;
  submissionFormat: string;
  submissionFormatLabel: string;
  capacityIndicator: string;
  safetyGuidancePresent: boolean;
  reviewCriteriaPresent: boolean;
  blockers: {
    key: string;
    message: string;
  }[];
};

export const practicalProofFieldLabels: Record<string, string> = {
  proofTitle: "proof title",
  proofPurpose: "proof purpose",
  acceptedProofType: "accepted proof type",
  submissionFormat: "submission format",
  instructions: "learner instructions",
  safetyGuidance: "safety and anonymization guidance",
  reviewCriteria: "review criteria",
  capacityArea: "capacity area",
  capacityIndicator: "capacity indicator",
  certificateSeparationConfirmed: "certificate separation confirmation",
  visibilityDefault: "private raw-proof visibility",
  donorVisibilityEnabled: "donor visibility disabled",
};

export function parsePracticalProofConfigFormData(
  formData: FormData,
  defaults: {
    capacityArea?: string | null;
    subCapacityArea?: string | null;
    linkedStandard?: string | null;
    capacityIndicator?: string | null;
  } = {},
) {
  const enabled = formData.get("proofEnabled") === "on";
  const input: PracticalProofConfigInput = {
    enabled,
    proofTitle: enabled ? getFormString(formData, "proofTitle") : "",
    proofPurpose: enabled ? getFormString(formData, "proofPurpose") : "",
    acceptedProofType: enabled
      ? normalizeProofType(getFormString(formData, "acceptedProofType"))
      : "",
    submissionFormat: enabled
      ? normalizeSubmissionFormat(getFormString(formData, "submissionFormat"))
      : "",
    instructions: enabled ? getFormString(formData, "instructions") : "",
    safetyGuidance: enabled ? getFormString(formData, "safetyGuidance") : "",
    reviewCriteria: enabled ? getFormString(formData, "reviewCriteria") : "",
    capacityArea: enabled
      ? getFormString(formData, "capacityArea") ||
        cleanDefault(defaults.capacityArea)
      : "",
    subCapacityArea: enabled
      ? getFormString(formData, "subCapacityArea") ||
        cleanDefault(defaults.subCapacityArea)
      : "",
    linkedStandard: enabled
      ? getFormString(formData, "linkedStandard") ||
        cleanDefault(defaults.linkedStandard)
      : "",
    capacityIndicator: enabled
      ? getFormString(formData, "capacityIndicator") ||
        cleanDefault(defaults.capacityIndicator)
      : "",
    visibilityDefault: practicalProofVisibilityDefault,
    donorVisibilityEnabled: false,
    certificateSeparationConfirmed:
      enabled && formData.get("certificateSeparationConfirmed") === "on",
    specialistReviewRequired:
      enabled && formData.get("specialistReviewRequired") === "on",
  };
  const readiness = buildPracticalProofReadiness(input);

  if (!readiness.ready) {
    return {
      ok: false as const,
      missingFields: readiness.blockers.map((blocker) => blocker.key),
      value: input,
    };
  }

  return {
    ok: true as const,
    value: input,
  };
}

export function buildPracticalProofReadiness(
  config: PracticalProofConfigLike,
): PracticalProofReadiness {
  const normalized = normalizePracticalProofConfig(config);
  const blockers: PracticalProofReadiness["blockers"] = [];

  if (!normalized.enabled) {
    return {
      enabled: false,
      ready: true,
      status: "Disabled",
      summary:
        "Practical proof is not enabled for this course version. Course certificates remain based on the final test only.",
      certificateSeparation: practicalProofCertificateRule,
      visibilityDefault: practicalProofVisibilityDefault,
      donorVisibilityEnabled: false,
      specialistReviewRequired: false,
      proofTitle: "",
      acceptedProofType: "",
      acceptedProofTypeLabel: "Not enabled",
      submissionFormat: "",
      submissionFormatLabel: "Not enabled",
      capacityIndicator: "",
      safetyGuidancePresent: false,
      reviewCriteriaPresent: false,
      blockers,
    };
  }

  addMissingTextBlocker(blockers, normalized.proofTitle, "proofTitle");
  addMissingTextBlocker(blockers, normalized.proofPurpose, "proofPurpose");
  addMissingTextBlocker(blockers, normalized.instructions, "instructions");
  addMissingTextBlocker(blockers, normalized.safetyGuidance, "safetyGuidance");
  addMissingTextBlocker(blockers, normalized.reviewCriteria, "reviewCriteria");
  addMissingTextBlocker(blockers, normalized.capacityArea, "capacityArea");
  addMissingTextBlocker(
    blockers,
    normalized.capacityIndicator,
    "capacityIndicator",
  );

  if (!normalizeProofType(normalized.acceptedProofType)) {
    blockers.push({
      key: "acceptedProofType",
      message: "Choose an accepted practical proof type.",
    });
  }

  if (!normalizeSubmissionFormat(normalized.submissionFormat)) {
    blockers.push({
      key: "submissionFormat",
      message: "Choose a practical proof submission format.",
    });
  }

  if (normalized.visibilityDefault !== practicalProofVisibilityDefault) {
    blockers.push({
      key: "visibilityDefault",
      message: "Raw practical proof visibility must remain PRIVATE.",
    });
  }

  if (normalized.donorVisibilityEnabled) {
    blockers.push({
      key: "donorVisibilityEnabled",
      message: "Donor-facing proof visibility is disabled in this slice.",
    });
  }

  if (!normalized.certificateSeparationConfirmed) {
    blockers.push({
      key: "certificateSeparationConfirmed",
      message:
        "Confirm that practical proof is optional and separate from course certification.",
    });
  }

  return {
    enabled: true,
    ready: blockers.length === 0,
    status:
      blockers.length === 0 ? "Safely configured" : "Configuration incomplete",
    summary:
      blockers.length === 0
        ? "Optional practical proof is safely configured and separate from the course certificate."
        : `${blockers.length} practical proof configuration blocker(s) must be resolved.`,
    certificateSeparation: practicalProofCertificateRule,
    visibilityDefault: normalized.visibilityDefault,
    donorVisibilityEnabled: normalized.donorVisibilityEnabled,
    specialistReviewRequired: normalized.specialistReviewRequired,
    proofTitle: normalized.proofTitle,
    acceptedProofType: normalized.acceptedProofType,
    acceptedProofTypeLabel: getProofTypeLabel(normalized.acceptedProofType),
    submissionFormat: normalized.submissionFormat,
    submissionFormatLabel: getSubmissionFormatLabel(
      normalized.submissionFormat,
    ),
    capacityIndicator: normalized.capacityIndicator,
    safetyGuidancePresent: Boolean(normalized.safetyGuidance),
    reviewCriteriaPresent: Boolean(normalized.reviewCriteria),
    blockers,
  };
}

export function normalizePracticalProofConfig(
  config: PracticalProofConfigLike,
): PracticalProofConfigInput {
  return {
    enabled: Boolean(config?.enabled),
    proofTitle: cleanDefault(config?.proofTitle),
    proofPurpose: cleanDefault(config?.proofPurpose),
    acceptedProofType: cleanDefault(config?.acceptedProofType),
    submissionFormat: cleanDefault(config?.submissionFormat),
    instructions: cleanDefault(config?.instructions),
    safetyGuidance: cleanDefault(config?.safetyGuidance),
    reviewCriteria: cleanDefault(config?.reviewCriteria),
    capacityArea: cleanDefault(config?.capacityArea),
    subCapacityArea: cleanDefault(config?.subCapacityArea),
    linkedStandard: cleanDefault(config?.linkedStandard),
    capacityIndicator: cleanDefault(config?.capacityIndicator),
    visibilityDefault:
      cleanDefault(config?.visibilityDefault) || practicalProofVisibilityDefault,
    donorVisibilityEnabled: Boolean(config?.donorVisibilityEnabled),
    certificateSeparationConfirmed: Boolean(
      config?.certificateSeparationConfirmed,
    ),
    specialistReviewRequired: Boolean(config?.specialistReviewRequired),
  };
}

export function getProofTypeLabel(value: string) {
  return (
    practicalProofTypes.find((type) => type.value === value)?.label ||
    "Not set"
  );
}

export function getSubmissionFormatLabel(value: string) {
  return (
    practicalProofSubmissionFormats.find((format) => format.value === value)
      ?.label || "Not set"
  );
}

function addMissingTextBlocker(
  blockers: PracticalProofReadiness["blockers"],
  value: string,
  key: keyof typeof practicalProofFieldLabels,
) {
  if (!value) {
    blockers.push({
      key,
      message: `Complete the ${practicalProofFieldLabels[key]}.`,
    });
  }
}

function normalizeProofType(value: string) {
  return practicalProofTypes.some((type) => type.value === value) ? value : "";
}

function normalizeSubmissionFormat(value: string) {
  return practicalProofSubmissionFormats.some((format) => format.value === value)
    ? value
    : "";
}

function getFormString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function cleanDefault(value: string | null | undefined) {
  return value?.trim() || "";
}

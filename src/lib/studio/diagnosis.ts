export const courseFitDecisions = [
  "course-fit",
  "needs-more-evidence",
  "alternative-intervention",
] as const;

export type CourseFitDecision = (typeof courseFitDecisions)[number];

export const ksmeGapTypes = [
  "knowledge",
  "skill",
  "motivation",
  "environment",
  "mixed",
] as const;

export type KsmeGapType = (typeof ksmeGapTypes)[number];

export type CourseDiagnosisInput = {
  surfaceRequest: string;
  performanceEvidence: string;
  currentReality: string;
  desiredReality: string;
  affectedLearnerGroup: string;
  evidenceSource: string;
  evidenceType: string;
  evidencePeriod: string;
  ksmeGap: KsmeGapType | "";
  courseFitDecision: CourseFitDecision | "";
  alternativeIntervention: string;
};

export type CourseDiagnosisValidationResult =
  | {
      ok: true;
      value: CourseDiagnosisInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

const requiredFields: readonly (keyof CourseDiagnosisInput)[] = [
  "surfaceRequest",
  "performanceEvidence",
  "currentReality",
  "desiredReality",
  "affectedLearnerGroup",
  "evidenceSource",
  "evidenceType",
  "ksmeGap",
  "courseFitDecision",
];

export const diagnosisFieldLabels: Record<string, string> = {
  surfaceRequest: "training request",
  performanceEvidence: "performance evidence",
  currentReality: "current reality",
  desiredReality: "desired reality",
  affectedLearnerGroup: "affected learner group",
  evidenceSource: "evidence source",
  evidenceType: "evidence type",
  ksmeGap: "KSME gap",
  courseFitDecision: "course-fit decision",
  alternativeIntervention: "alternative intervention recommendation",
};

export function parseCourseDiagnosisFormData(
  formData: FormData,
): CourseDiagnosisValidationResult {
  const value: CourseDiagnosisInput = {
    surfaceRequest: getTextValue(formData, "surfaceRequest"),
    performanceEvidence: getTextValue(formData, "performanceEvidence"),
    currentReality: getTextValue(formData, "currentReality"),
    desiredReality: getTextValue(formData, "desiredReality"),
    affectedLearnerGroup: getTextValue(formData, "affectedLearnerGroup"),
    evidenceSource: getTextValue(formData, "evidenceSource"),
    evidenceType: getTextValue(formData, "evidenceType"),
    evidencePeriod: getTextValue(formData, "evidencePeriod"),
    ksmeGap: normalizeKsmeGap(getTextValue(formData, "ksmeGap")),
    courseFitDecision: normalizeCourseFitDecision(
      getTextValue(formData, "courseFitDecision"),
    ),
    alternativeIntervention: getTextValue(formData, "alternativeIntervention"),
  };
  const missingFields = requiredFields.filter((field) => !value[field]);

  if (
    value.courseFitDecision === "alternative-intervention" &&
    !value.alternativeIntervention
  ) {
    missingFields.push("alternativeIntervention");
  }

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

export function shouldOpenCapacityMap(decision: CourseFitDecision | "") {
  return decision === "course-fit";
}

export function buildEvidenceSources(input: CourseDiagnosisInput) {
  return JSON.stringify({
    source: input.evidenceSource,
    type: input.evidenceType,
    period: input.evidencePeriod,
  });
}

export function parseEvidenceSources(value: string | undefined) {
  if (!value) {
    return {
      source: "",
      type: "",
      period: "",
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<{
      source: string;
      type: string;
      period: string;
    }>;

    return {
      source: parsed.source || "",
      type: parsed.type || "",
      period: parsed.period || "",
    };
  } catch {
    return {
      source: "",
      type: "",
      period: "",
    };
  }
}

function normalizeKsmeGap(value: string): KsmeGapType | "" {
  return ksmeGapTypes.includes(value as KsmeGapType)
    ? (value as KsmeGapType)
    : "";
}

function normalizeCourseFitDecision(value: string): CourseFitDecision | "" {
  return courseFitDecisions.includes(value as CourseFitDecision)
    ? (value as CourseFitDecision)
    : "";
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

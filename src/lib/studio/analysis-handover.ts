import type { CourseAnalysisHandover } from "@prisma/client";

import { taxonomyLabels } from "@/lib/analysis-import/taxonomy-alignment";
import { isDecCapacityArea } from "@/lib/studio/capacity-map";
import {
  getDiagnosisRecordEligibility,
  type CourseSetupDiagnosisSnapshot,
} from "@/lib/studio/diagnosis-selection";

export const analysisHandoverStatuses = ["DRAFT", "LOCKED"] as const;

export type AnalysisHandoverStatus = (typeof analysisHandoverStatuses)[number];

export const analysisGateDecisions = [
  "proceed-to-design",
  "proceed-with-conditions",
  "needs-further-diagnosis",
  "non-course-route",
] as const;

export type AnalysisGateDecision = (typeof analysisGateDecisions)[number];

export type AnalysisHandoverInput = {
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  validatedCapacityGap: string;
  baseline: string;
  desiredPractice: string;
  rootCauseSummary: string;
  ksmeRoute: string;
  separableKnowledgeSkillComponent: string;
  interventionDecision: string;
  analysisGateDecision: string;
  referralOrFurtherDiagnosisNote: string;
  safeguardsNote: string;
  evaluationAnchor: string;
};

export type AnalysisHandoverValidationResult =
  | {
      ok: true;
      value: AnalysisHandoverInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type AnalysisAnchorConsistencyInput = {
  snapshot: CourseSetupDiagnosisSnapshot | null;
  diagnosis: {
    affectedLearnerGroup: string;
    courseFitDecision: string;
  } | null;
  handover: AnalysisHandoverInput | null;
};

export type AnalysisAnchorConsistencyResult = {
  ok: boolean;
  issues: string[];
};

const requiredFields: readonly (keyof AnalysisHandoverInput)[] = [
  "capacityArea",
  "subCapacityArea",
  "linkedStandard",
  "capacityIndicator",
  "validatedCapacityGap",
  "baseline",
  "desiredPractice",
  "rootCauseSummary",
  "ksmeRoute",
  "interventionDecision",
  "analysisGateDecision",
  "safeguardsNote",
  "evaluationAnchor",
];

export const analysisHandoverFieldLabels: Record<string, string> = {
  capacityArea: taxonomyLabels.coreCapacityArea,
  subCapacityArea: taxonomyLabels.capacityPracticeArea,
  linkedStandard: "linked standard or framework",
  capacityIndicator: "capacity indicator or evidence marker",
  validatedCapacityGap: "validated capacity gap",
  baseline: "baseline",
  desiredPractice: "desired practice",
  rootCauseSummary: "root cause summary",
  ksmeRoute: taxonomyLabels.ksmeRoute,
  separableKnowledgeSkillComponent: "separable Knowledge or Skill component",
  interventionDecision: "intervention decision",
  analysisGateDecision: "Analysis Gate decision",
  referralOrFurtherDiagnosisNote: "referral or further-diagnosis note",
  safeguardsNote: "safeguards and no-harm note",
  evaluationAnchor: "evaluation anchor",
};

export function parseAnalysisHandoverFormData(
  formData: FormData,
): AnalysisHandoverValidationResult {
  const value: AnalysisHandoverInput = {
    capacityArea: getTextValue(formData, "capacityArea"),
    subCapacityArea: getTextValue(formData, "subCapacityArea"),
    linkedStandard: getTextValue(formData, "linkedStandard"),
    capacityIndicator: getTextValue(formData, "capacityIndicator"),
    validatedCapacityGap: getTextValue(formData, "validatedCapacityGap"),
    baseline: getTextValue(formData, "baseline"),
    desiredPractice: getTextValue(formData, "desiredPractice"),
    rootCauseSummary: getTextValue(formData, "rootCauseSummary"),
    ksmeRoute:
      getTextValue(formData, "ksmeRoute") || getTextValue(formData, "ksmeGap"),
    separableKnowledgeSkillComponent: getTextValue(
      formData,
      "separableKnowledgeSkillComponent",
    ),
    interventionDecision: getTextValue(formData, "interventionDecision"),
    analysisGateDecision: normalizeAnalysisGateDecision(
      getTextValue(formData, "analysisGateDecision"),
    ),
    referralOrFurtherDiagnosisNote: getTextValue(
      formData,
      "referralOrFurtherDiagnosisNote",
    ),
    safeguardsNote: getTextValue(formData, "safeguardsNote"),
    evaluationAnchor: getTextValue(formData, "evaluationAnchor"),
  };
  return validateAnalysisHandoverInput(value, {
    courseFitDecision: getTextValue(formData, "courseFitDecision"),
  });
}

export function validateAnalysisHandoverInput(
  value: AnalysisHandoverInput,
  options: {
    courseFitDecision?: string;
  } = {},
): AnalysisHandoverValidationResult {
  const missingFields = requiredFields.filter((field) => !value[field]);

  if (value.capacityArea && !isDecCapacityArea(value.capacityArea)) {
    missingFields.push("capacityArea");
  }

  if (
    requiresSeparableKnowledgeSkill(value.ksmeRoute) &&
    !value.separableKnowledgeSkillComponent
  ) {
    missingFields.push("separableKnowledgeSkillComponent");
  }

  if (
    requiresReferralOrFurtherDiagnosisNote(
      value.analysisGateDecision,
      options.courseFitDecision,
    ) &&
    !value.referralOrFurtherDiagnosisNote
  ) {
    missingFields.push("referralOrFurtherDiagnosisNote");
  }

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields: Array.from(new Set(missingFields)),
    };
  }

  return {
    ok: true,
    value,
  };
}

export function isAnalysisHandoverLocked(
  handover:
    | Pick<CourseAnalysisHandover, "status" | "lockedAt">
    | null
    | undefined,
) {
  return handover?.status === "LOCKED" && Boolean(handover.lockedAt);
}

export function canAnalysisProceedToDesign(
  input: Pick<
    AnalysisHandoverInput,
    "ksmeRoute" | "separableKnowledgeSkillComponent" | "analysisGateDecision"
  > & {
    courseFitDecision: string;
  },
) {
  if (input.courseFitDecision !== "course-fit") {
    return false;
  }

  if (!isProceedingAnalysisGateDecision(input.analysisGateDecision)) {
    return false;
  }

  if (input.ksmeRoute === "knowledge" || input.ksmeRoute === "skill") {
    return true;
  }

  return (
    requiresSeparableKnowledgeSkill(input.ksmeRoute) &&
    input.separableKnowledgeSkillComponent.trim().length > 0
  );
}

export function validateAnalysisAnchorConsistency({
  diagnosis,
  handover,
  snapshot,
}: AnalysisAnchorConsistencyInput): AnalysisAnchorConsistencyResult {
  const issues: string[] = [];

  if (!snapshot) {
    return {
      ok: false,
      issues: [
        "No approved diagnosis evidence is linked to this course. Return to Course Setup and select a valid diagnosis record before locking Analysis for Design.",
      ],
    };
  }

  if (!diagnosis || !handover) {
    return {
      ok: false,
      issues: [
        "Save the course-specific Diagnosis and Analysis Handover before locking Analysis for Design.",
      ],
    };
  }

  const anchor = snapshot.record;
  const anchorEligibility = getDiagnosisRecordEligibility({
    courseFitDecision: anchor.courseFitDecision,
    ksmeRoute: anchor.ksmeRoute,
    separableKnowledgeSkillComponent:
      anchor.separableKnowledgeSkillComponent,
  });

  if (!anchorEligibility.selectable) {
    issues.push(
      "The selected diagnosis evidence is not currently eligible to anchor course production. Return to Course Setup and select a course-eligible diagnosis record.",
    );
  }

  if (!sameMeaning(handover.capacityArea, anchor.coreCapacityArea)) {
    issues.push(
      "Capacity area must match the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (
    contradictsText(
      handover.subCapacityArea,
      anchor.capacityPracticeArea || anchor.subCapacity,
    )
  ) {
    issues.push(
      "Capacity Practice Area should align with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (
    contradictsParticipantGroup(
      diagnosis.affectedLearnerGroup,
      anchor.targetAudience,
    )
  ) {
    issues.push(
      "Target Audience or Participant group should align with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (!ksmeRoutesCompatible(handover.ksmeRoute, anchor.ksmeRoute)) {
    issues.push(
      "K/S/M/E route must match or remain compatible with the approved diagnosis evidence.",
    );
  }

  if (
    protectedAnchorContradicts(
      handover.validatedCapacityGap,
      anchor.capacityGapStatement,
    )
  ) {
    issues.push(
      "Validated capacity gap must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (protectedAnchorContradicts(handover.baseline, anchor.currentBaseline)) {
    issues.push(
      "Baseline/current practice must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (
    requiresSeparableKnowledgeSkill(anchor.ksmeRoute.toLowerCase()) &&
    !anchor.separableKnowledgeSkillComponent.trim()
  ) {
    issues.push(
      "The approved diagnosis evidence needs a separable Knowledge or Skill component before it can move into Design.",
    );
  }

  if (
    courseFitContradictsAnchor(
      diagnosis.courseFitDecision,
      anchor.courseFitDecision,
    )
  ) {
    issues.push(
      "Course-fit decision must remain compatible with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  if (
    anchor.noHarmNote.trim() &&
    protectedAnchorContradicts(handover.safeguardsNote, anchor.noHarmNote)
  ) {
    issues.push(
      "Safeguarding and no-harm guidance from the approved diagnosis evidence must remain visible in the Analysis Handover.",
    );
  }

  if (
    protectedAnchorContradicts(
      handover.evaluationAnchor,
      anchor.evaluationAnchor,
    )
  ) {
    issues.push(
      "Evaluation anchor must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

export function getAnalysisRouteDecisionLabel(
  input:
    | (Pick<
        AnalysisHandoverInput,
        "ksmeRoute" | "separableKnowledgeSkillComponent" | "analysisGateDecision"
      > & {
        courseFitDecision: string;
      })
    | null
    | undefined,
) {
  if (!input) {
    return "Analysis handover not prepared";
  }

  if (input.courseFitDecision !== "course-fit") {
    return "Needs further diagnosis or non-course support before Design";
  }

  if (input.analysisGateDecision === "needs-further-diagnosis") {
    return "Needs further diagnosis before Design";
  }

  if (input.analysisGateDecision === "non-course-route") {
    return "Routed outside course production";
  }

  if (!isProceedingAnalysisGateDecision(input.analysisGateDecision)) {
    return "Analysis Gate decision not ready";
  }

  if (input.ksmeRoute === "knowledge" || input.ksmeRoute === "skill") {
    return "Ready for course design";
  }

  if (input.separableKnowledgeSkillComponent.trim()) {
    return "Ready for course design using the separable Knowledge or Skill component";
  }

  return "Needs a separable Knowledge or Skill component before course design";
}

export function getAnalysisHandoverStatusLabel(
  handover:
    | Pick<CourseAnalysisHandover, "status" | "lockedAt">
    | null
    | undefined,
) {
  if (isAnalysisHandoverLocked(handover)) {
    return "Locked for Design";
  }

  if (handover) {
    return "Draft handover";
  }

  return "Not prepared";
}

export function requiresSeparableKnowledgeSkill(ksmeRoute: string) {
  return ["motivation", "environment", "mixed"].includes(ksmeRoute);
}

export function requiresReferralOrFurtherDiagnosisNote(
  analysisGateDecision: string,
  courseFitDecision = "",
) {
  return (
    analysisGateDecision === "needs-further-diagnosis" ||
    analysisGateDecision === "non-course-route" ||
    courseFitDecision === "needs-more-evidence" ||
    courseFitDecision === "alternative-intervention"
  );
}

export function getAnalysisGateDecisionLabel(value: string) {
  switch (value) {
    case "proceed-to-design":
      return "Proceed to Design";
    case "proceed-with-conditions":
      return "Proceed to Design with conditions";
    case "needs-further-diagnosis":
      return "Needs further diagnosis";
    case "non-course-route":
      return "Non-course route";
    default:
      return "Not decided";
  }
}

function isProceedingAnalysisGateDecision(value: string) {
  return value === "proceed-to-design" || value === "proceed-with-conditions";
}

function normalizeAnalysisGateDecision(value: string): AnalysisGateDecision | "" {
  return analysisGateDecisions.includes(value as AnalysisGateDecision)
    ? (value as AnalysisGateDecision)
    : "";
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function sameMeaning(left: string, right: string) {
  return normalizeComparableText(left) === normalizeComparableText(right);
}

function contradictsText(value: string, anchorValue: string) {
  const normalizedValue = normalizeComparableText(value);
  const normalizedAnchor = normalizeComparableText(anchorValue);

  if (!normalizedValue || !normalizedAnchor) {
    return true;
  }

  return (
    normalizedValue !== normalizedAnchor &&
    !normalizedValue.includes(normalizedAnchor) &&
    !normalizedAnchor.includes(normalizedValue)
  );
}

function contradictsParticipantGroup(value: string, anchorValue: string) {
  const valueParts = splitComparableParts(value);
  const anchorParts = splitComparableParts(anchorValue);

  if (valueParts.length === 0 || anchorParts.length === 0) {
    return true;
  }

  return !valueParts.some((part) =>
    anchorParts.some(
      (anchorPart) =>
        part === anchorPart ||
        part.includes(anchorPart) ||
        anchorPart.includes(part),
    ),
  );
}

function ksmeRoutesCompatible(value: string, anchorValue: string) {
  const normalizedValue = normalizeComparableText(value);
  const normalizedAnchor = normalizeComparableText(anchorValue);

  if (!normalizedValue || !normalizedAnchor) {
    return false;
  }

  return normalizedValue === normalizedAnchor;
}

function courseFitContradictsAnchor(value: string, anchorValue: string) {
  const normalizedValue = normalizeComparableText(value);
  const normalizedAnchor = normalizeComparableText(anchorValue);
  const anchorAllowsCourse =
    normalizedAnchor === "course addressable" ||
    normalizedAnchor === "partly course addressable" ||
    normalizedAnchor === "blended support recommended";

  if (!anchorAllowsCourse) {
    return true;
  }

  return normalizedValue !== "course fit";
}

function protectedAnchorContradicts(value: string, anchorValue: string) {
  const normalizedValue = normalizeComparableText(value);
  const normalizedAnchor = normalizeComparableText(anchorValue);

  if (!normalizedAnchor) {
    return false;
  }

  if (!normalizedValue) {
    return true;
  }

  if (
    normalizedValue.includes(normalizedAnchor) ||
    normalizedAnchor.includes(normalizedValue)
  ) {
    return false;
  }

  return !hasMeaningfulTextOverlap(normalizedValue, normalizedAnchor);
}

function hasMeaningfulTextOverlap(value: string, anchorValue: string) {
  const valueTokens = new Set(getMeaningfulTokens(value));
  const anchorTokens = getMeaningfulTokens(anchorValue);

  if (anchorTokens.length === 0) {
    return false;
  }

  const overlapCount = anchorTokens.filter((token) =>
    valueTokens.has(token),
  ).length;
  const requiredOverlap = Math.min(2, anchorTokens.length);
  const overlapRatio = overlapCount / anchorTokens.length;

  return overlapCount >= requiredOverlap && overlapRatio >= 0.3;
}

function getMeaningfulTokens(value: string) {
  const stopwords = new Set([
    "about",
    "after",
    "again",
    "before",
    "being",
    "cannot",
    "course",
    "from",
    "have",
    "into",
    "only",
    "that",
    "their",
    "this",
    "through",
    "with",
  ]);

  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 3 && !stopwords.has(token));
}

function splitComparableParts(value: string) {
  return normalizeComparableText(value)
    .split(/\s+(?:and|or)\s+|\/|,|;/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeComparableText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-–—]/g, " ")
    .replace(/[^a-z0-9/,\s;]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

import type { CourseAnalysisHandover } from "@prisma/client";

import { isDecCapacityArea } from "@/lib/studio/capacity-map";

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
  capacityArea: "capacity area",
  subCapacityArea: "sub-capacity area",
  linkedStandard: "linked standard or framework",
  capacityIndicator: "capacity indicator or evidence marker",
  validatedCapacityGap: "validated capacity gap",
  baseline: "baseline",
  desiredPractice: "desired practice",
  rootCauseSummary: "root cause summary",
  ksmeRoute: "KSME route",
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

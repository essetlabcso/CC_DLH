import type { CourseAnalysisHandover } from "@prisma/client";

export const analysisHandoverStatuses = ["DRAFT", "LOCKED"] as const;

export type AnalysisHandoverStatus = (typeof analysisHandoverStatuses)[number];

export type AnalysisHandoverInput = {
  validatedCapacityGap: string;
  baseline: string;
  desiredPractice: string;
  rootCauseSummary: string;
  ksmeRoute: string;
  separableKnowledgeSkillComponent: string;
  interventionDecision: string;
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
  "validatedCapacityGap",
  "baseline",
  "desiredPractice",
  "rootCauseSummary",
  "ksmeRoute",
  "interventionDecision",
  "safeguardsNote",
  "evaluationAnchor",
];

export const analysisHandoverFieldLabels: Record<string, string> = {
  validatedCapacityGap: "validated capacity gap",
  baseline: "baseline",
  desiredPractice: "desired practice",
  rootCauseSummary: "root cause summary",
  ksmeRoute: "KSME route",
  separableKnowledgeSkillComponent: "separable Knowledge or Skill component",
  interventionDecision: "intervention decision",
  safeguardsNote: "safeguards and no-harm note",
  evaluationAnchor: "evaluation anchor",
};

export function parseAnalysisHandoverFormData(
  formData: FormData,
): AnalysisHandoverValidationResult {
  const value: AnalysisHandoverInput = {
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
    safeguardsNote: getTextValue(formData, "safeguardsNote"),
    evaluationAnchor: getTextValue(formData, "evaluationAnchor"),
  };
  return validateAnalysisHandoverInput(value);
}

export function validateAnalysisHandoverInput(
  value: AnalysisHandoverInput,
): AnalysisHandoverValidationResult {
  const missingFields = requiredFields.filter((field) => !value[field]);

  if (
    requiresSeparableKnowledgeSkill(value.ksmeRoute) &&
    !value.separableKnowledgeSkillComponent
  ) {
    missingFields.push("separableKnowledgeSkillComponent");
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
    "ksmeRoute" | "separableKnowledgeSkillComponent"
  > & {
    courseFitDecision: string;
  },
) {
  if (input.courseFitDecision !== "course-fit") {
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
        "ksmeRoute" | "separableKnowledgeSkillComponent"
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
    return "Course design remains paused";
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

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

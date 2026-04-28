import type { CourseDesignHandover } from "@prisma/client";

export type DesignHandoverInput = {
  coursePurpose: string;
  performanceGoal: string;
  learningPathway: string;
  approvedBlockSequence: string;
  practiceStrategy: string;
  assessmentStrategy: string;
  accessibilityRequirements: string;
  safeguards: string;
  aiAuthoringBoundaries: string;
  evaluationAnchor: string;
};

export type DesignHandoverValidationResult =
  | {
      ok: true;
      value: DesignHandoverInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

const requiredFields: readonly (keyof DesignHandoverInput)[] = [
  "coursePurpose",
  "performanceGoal",
  "learningPathway",
  "approvedBlockSequence",
  "practiceStrategy",
  "assessmentStrategy",
  "accessibilityRequirements",
  "safeguards",
  "aiAuthoringBoundaries",
  "evaluationAnchor",
];

export const designHandoverFieldLabels: Record<string, string> = {
  coursePurpose: "course purpose",
  performanceGoal: "performance goal",
  learningPathway: "learning pathway",
  approvedBlockSequence: "approved block sequence",
  practiceStrategy: "practice strategy",
  assessmentStrategy: "assessment strategy",
  accessibilityRequirements: "accessibility and low-bandwidth requirements",
  safeguards: "safeguards",
  aiAuthoringBoundaries: "AI authoring boundaries",
  evaluationAnchor: "evaluation anchor",
};

export function parseDesignHandoverFormData(
  formData: FormData,
): DesignHandoverValidationResult {
  return validateDesignHandoverInput({
    coursePurpose: getTextValue(formData, "coursePurpose"),
    performanceGoal: getTextValue(formData, "performanceGoal"),
    learningPathway: getTextValue(formData, "learningPathway"),
    approvedBlockSequence: getTextValue(formData, "approvedBlockSequence"),
    practiceStrategy: getTextValue(formData, "practiceStrategy"),
    assessmentStrategy: getTextValue(formData, "assessmentStrategy"),
    accessibilityRequirements: getTextValue(
      formData,
      "accessibilityRequirements",
    ),
    safeguards: getTextValue(formData, "safeguards"),
    aiAuthoringBoundaries: getTextValue(formData, "aiAuthoringBoundaries"),
    evaluationAnchor: getTextValue(formData, "evaluationAnchor"),
  });
}

export function validateDesignHandoverInput(
  value: DesignHandoverInput,
): DesignHandoverValidationResult {
  const missingFields = requiredFields.filter((field) => !value[field]);

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

export function isDesignHandoverLocked(
  handover:
    | Pick<CourseDesignHandover, "status" | "lockedAt">
    | null
    | undefined,
) {
  return handover?.status === "LOCKED" && Boolean(handover.lockedAt);
}

export function getDesignHandoverStatusLabel(
  handover:
    | Pick<CourseDesignHandover, "status" | "lockedAt">
    | null
    | undefined,
) {
  if (isDesignHandoverLocked(handover)) {
    return "Locked for Build";
  }

  if (handover) {
    return "Draft handover";
  }

  return "Not prepared";
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export type CourseCapacityMapInput = {
  capacityArea: string;
  subarea: string;
  capabilityFocus: string;
  linkedStandard: string;
  capacityOutcome: string;
  diagnosisLink: string;
  monitoringRelevance: string;
};

export type CourseCapacityMapValidationResult =
  | {
      ok: true;
      value: CourseCapacityMapInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

const requiredFields: readonly (keyof CourseCapacityMapInput)[] = [
  "capacityArea",
  "subarea",
  "capabilityFocus",
  "linkedStandard",
  "capacityOutcome",
  "diagnosisLink",
  "monitoringRelevance",
];

export const capacityMapFieldLabels: Record<string, string> = {
  capacityArea: "capacity area",
  subarea: "subarea",
  capabilityFocus: "capability focus",
  linkedStandard: "linked standard",
  capacityOutcome: "capacity outcome",
  diagnosisLink: "diagnosis link",
  monitoringRelevance: "monitoring relevance",
};

export const decCapacityAreas = [
  "Governance and leadership",
  "Safeguarding and accountability",
  "MEAL",
  "Financial management",
  "Donor compliance",
  "Human rights-based approach",
  "Advocacy and civic space",
  "Organizational sustainability",
] as const;

export function parseCourseCapacityMapFormData(
  formData: FormData,
): CourseCapacityMapValidationResult {
  const value: CourseCapacityMapInput = {
    capacityArea: getTextValue(formData, "capacityArea"),
    subarea: getTextValue(formData, "subarea"),
    capabilityFocus: getTextValue(formData, "capabilityFocus"),
    linkedStandard: getTextValue(formData, "linkedStandard"),
    capacityOutcome: getTextValue(formData, "capacityOutcome"),
    diagnosisLink: getTextValue(formData, "diagnosisLink"),
    monitoringRelevance: getTextValue(formData, "monitoringRelevance"),
  };
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

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

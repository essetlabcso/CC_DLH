import { taxonomyLabels } from "@/lib/analysis-import/taxonomy-alignment";

export type CourseCapacityMapInput = {
  capacityArea: string;
  subarea: string;
  capabilityFocus: string;
  linkedStandard: string;
  capacityOutcome: string;
  diagnosisLink: string;
  monitoringRelevance: string;
};

export type CapacityMapAnalysisAnchors = Pick<
  CourseCapacityMapInput,
  "capacityArea" | "subarea" | "linkedStandard"
>;

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
  capacityArea: taxonomyLabels.coreCapacityArea,
  subarea: taxonomyLabels.capacityPracticeArea,
  subCapacityArea: taxonomyLabels.capacityPracticeArea,
  capabilityFocus: "capability focus",
  linkedStandard: "linked standard",
  capacityIndicator: "capacity indicator",
  capacityOutcome: "capacity outcome",
  diagnosisLink: "diagnosis link",
  monitoringRelevance: "monitoring relevance",
};

export const decCapacityAreas = [
  "Internal Governance and Leadership",
  "Transparency and Accountability",
  "Strategic Planning and Organizational Sustainability",
  "Financial Management and Resource Mobilization",
  "Human Resources, Inclusion, and Safeguarding",
  "Evidence-Based Advocacy and Civic Engagement",
  "Monitoring, Evaluation, Accountability, and Learning",
  "Digital Skills and Data Use / IT Competencies",
  "Networking, Partnerships, and Collective Action",
] as const;

export type DecCapacityArea = (typeof decCapacityAreas)[number];

export function isDecCapacityArea(value: string): value is DecCapacityArea {
  return decCapacityAreas.includes(value as DecCapacityArea);
}

export function parseCourseCapacityMapFormData(
  formData: FormData,
  anchors?: Partial<CapacityMapAnalysisAnchors>,
): CourseCapacityMapValidationResult {
  const value: CourseCapacityMapInput = {
    capacityArea: anchors?.capacityArea?.trim() || getTextValue(formData, "capacityArea"),
    subarea: anchors?.subarea?.trim() || getTextValue(formData, "subarea"),
    capabilityFocus: getTextValue(formData, "capabilityFocus"),
    linkedStandard:
      anchors?.linkedStandard?.trim() || getTextValue(formData, "linkedStandard"),
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

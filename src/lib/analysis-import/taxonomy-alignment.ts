export const taxonomyLabels = {
  coreCapacityArea: "Core Capacity Area",
  capacityPracticeArea: "Capacity Practice Area",
  currentPracticeScore: "Current Practice Score",
  priorityCapacityGap: "Priority Capacity Gap",
  courseFitDecision: "Course-fit decision",
  ksmeRoute: "K/S/M/E route",
  analysisToDesignHandover: "Analysis-to-Design Handover",
} as const;

export const taxonomyFieldCompatibilityLabels: Record<string, string> = {
  capacityArea: taxonomyLabels.coreCapacityArea,
  subCapacityArea: taxonomyLabels.capacityPracticeArea,
  subarea: taxonomyLabels.capacityPracticeArea,
};

export function getWorkbookImportFieldLabel(fieldName: string) {
  return taxonomyFieldCompatibilityLabels[fieldName] || fieldName;
}

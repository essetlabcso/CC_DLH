export type DiagnosisRecordFormValues = {
  capacityGapStatement: string;
  capacityPracticeArea: string;
  coreCapacityArea: string;
  courseFitDecision: string;
  createReason: string;
  currentBaseline: string;
  dataSensitivityLevel: string;
  datasetId: string;
  desiredPractice: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  evidenceSource: string;
  evaluationAnchor: string;
  indicatorStandardLink: string;
  ksmeRoute: string;
  monitoringSignal: string;
  noHarmNote: string;
  nonCourseBarrierSummary: string;
  organizationGroup: string;
  possiblePracticalProof: string;
  priorityLevel: string;
  priorityRank: number | null;
  recommendedCourseOrSupportTitle: string;
  recommendedInterventionRoute: string;
  region: string;
  rootCauseSummary: string;
  safeguardingRiskLevel: string;
  safeSummaryForDashboard: string;
  sectorThematicArea: string;
  separableKnowledgeSkillComponent: string;
  subCapacity: string;
  targetAudience: string;
  updateReason: string;
  verifiedAchievementExample: string;
  visibilityScope: string;
};

export type DiagnosisRecordFormField =
  | "capacityGapStatement"
  | "coreCapacityArea"
  | "datasetId"
  | "diagnosisCode"
  | "diagnosisTitle"
  | "priorityRank"
  | "updateReason";

export type DiagnosisRecordFormData = Omit<
  DiagnosisRecordFormValues,
  "createReason" | "updateReason"
>;

export type DiagnosisRecordFormResult =
  | {
      ok: true;
      data: DiagnosisRecordFormData;
      reason: string;
      warnings: string[];
    }
  | {
      ok: false;
      fieldErrors: Partial<Record<DiagnosisRecordFormField, string>>;
      message: string;
      warnings: string[];
    };

export function parseDiagnosisRecordForm(
  formData: FormData,
  { requireUpdateReason = false }: { requireUpdateReason?: boolean } = {},
): DiagnosisRecordFormResult {
  const values = readDiagnosisRecordFormValues(formData);
  const fieldErrors: Partial<Record<DiagnosisRecordFormField, string>> = {};
  const warnings = getDiagnosisRecordDraftWarnings(values);

  if (!values.datasetId) {
    fieldErrors.datasetId = "Choose the source diagnosis dataset.";
  }

  if (!values.diagnosisCode) {
    fieldErrors.diagnosisCode = "Enter a diagnosis code.";
  }

  if (!values.diagnosisTitle) {
    fieldErrors.diagnosisTitle = "Enter a diagnosis title.";
  }

  if (!values.coreCapacityArea) {
    fieldErrors.coreCapacityArea = "Choose a Core Capacity Area.";
  }

  if (!values.capacityGapStatement) {
    fieldErrors.capacityGapStatement = "Enter the capacity gap statement.";
  }

  const reason = requireUpdateReason
    ? values.updateReason
    : values.createReason;

  if (requireUpdateReason && !reason) {
    fieldErrors.updateReason = "Enter a reason for this update.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: "Check the diagnosis record details and try again.",
      warnings,
    };
  }

  return {
    ok: true,
    data: {
      capacityGapStatement: values.capacityGapStatement,
      capacityPracticeArea: values.capacityPracticeArea,
      coreCapacityArea: values.coreCapacityArea,
      courseFitDecision: values.courseFitDecision,
      currentBaseline: values.currentBaseline,
      dataSensitivityLevel: values.dataSensitivityLevel,
      datasetId: values.datasetId,
      desiredPractice: values.desiredPractice,
      diagnosisCode: values.diagnosisCode,
      diagnosisTitle: values.diagnosisTitle,
      evidenceSource: values.evidenceSource,
      evaluationAnchor: values.evaluationAnchor,
      indicatorStandardLink: values.indicatorStandardLink,
      ksmeRoute: values.ksmeRoute,
      monitoringSignal: values.monitoringSignal,
      noHarmNote: values.noHarmNote,
      nonCourseBarrierSummary: values.nonCourseBarrierSummary,
      organizationGroup: values.organizationGroup,
      possiblePracticalProof: values.possiblePracticalProof,
      priorityLevel: values.priorityLevel,
      priorityRank: values.priorityRank,
      recommendedCourseOrSupportTitle: values.recommendedCourseOrSupportTitle,
      recommendedInterventionRoute: values.recommendedInterventionRoute,
      region: values.region,
      rootCauseSummary: values.rootCauseSummary,
      safeguardingRiskLevel: values.safeguardingRiskLevel,
      safeSummaryForDashboard: values.safeSummaryForDashboard,
      sectorThematicArea: values.sectorThematicArea,
      separableKnowledgeSkillComponent:
        values.separableKnowledgeSkillComponent,
      subCapacity: values.subCapacity,
      targetAudience: values.targetAudience,
      verifiedAchievementExample: values.verifiedAchievementExample,
      visibilityScope: values.visibilityScope,
    },
    reason,
    warnings,
  };
}

export function readDiagnosisRecordFormValues(
  formData: FormData,
): DiagnosisRecordFormValues {
  return {
    capacityGapStatement: readString(formData, "capacityGapStatement"),
    capacityPracticeArea: readString(formData, "capacityPracticeArea"),
    coreCapacityArea: readString(formData, "coreCapacityArea"),
    courseFitDecision: readString(formData, "courseFitDecision"),
    createReason: readString(formData, "createReason"),
    currentBaseline: readString(formData, "currentBaseline"),
    dataSensitivityLevel: readString(formData, "dataSensitivityLevel") || "LOW",
    datasetId: readString(formData, "datasetId"),
    desiredPractice: readString(formData, "desiredPractice"),
    diagnosisCode: readString(formData, "diagnosisCode").toUpperCase(),
    diagnosisTitle: readString(formData, "diagnosisTitle"),
    evidenceSource: readString(formData, "evidenceSource"),
    evaluationAnchor: readString(formData, "evaluationAnchor"),
    indicatorStandardLink: readString(formData, "indicatorStandardLink"),
    ksmeRoute: readString(formData, "ksmeRoute"),
    monitoringSignal: readString(formData, "monitoringSignal"),
    noHarmNote: readString(formData, "noHarmNote"),
    nonCourseBarrierSummary: readString(formData, "nonCourseBarrierSummary"),
    organizationGroup: readString(formData, "organizationGroup"),
    possiblePracticalProof: readString(formData, "possiblePracticalProof"),
    priorityLevel: readString(formData, "priorityLevel"),
    priorityRank: parseOptionalInt(readString(formData, "priorityRank")),
    recommendedCourseOrSupportTitle: readString(
      formData,
      "recommendedCourseOrSupportTitle",
    ),
    recommendedInterventionRoute: readString(
      formData,
      "recommendedInterventionRoute",
    ),
    region: readString(formData, "region"),
    rootCauseSummary: readString(formData, "rootCauseSummary"),
    safeguardingRiskLevel: readString(formData, "safeguardingRiskLevel"),
    safeSummaryForDashboard: readString(formData, "safeSummaryForDashboard"),
    sectorThematicArea: readString(formData, "sectorThematicArea"),
    separableKnowledgeSkillComponent: readString(
      formData,
      "separableKnowledgeSkillComponent",
    ),
    subCapacity: readString(formData, "subCapacity"),
    targetAudience: readString(formData, "targetAudience"),
    updateReason: readString(formData, "updateReason"),
    verifiedAchievementExample: readString(
      formData,
      "verifiedAchievementExample",
    ),
    visibilityScope: readString(formData, "visibilityScope") || "ADMIN_ONLY",
  };
}

export function getDiagnosisRecordDraftWarnings({
  courseFitDecision,
  currentBaseline,
  desiredPractice,
  evidenceSource,
  evaluationAnchor,
  ksmeRoute,
  noHarmNote,
  targetAudience,
}: Pick<
  DiagnosisRecordFormValues,
  | "courseFitDecision"
  | "currentBaseline"
  | "desiredPractice"
  | "evidenceSource"
  | "evaluationAnchor"
  | "ksmeRoute"
  | "noHarmNote"
  | "targetAudience"
>) {
  const warnings: string[] = [];

  if (!currentBaseline) {
    warnings.push("Add the baseline or current practice before approval review.");
  }

  if (!desiredPractice) {
    warnings.push("Add the desired practice before approval review.");
  }

  if (!evidenceSource) {
    warnings.push("Add the evidence source before approval review.");
  }

  if (!targetAudience) {
    warnings.push("Add the Target Audience before approval review.");
  }

  if (!ksmeRoute) {
    warnings.push("Choose a K/S/M/E route before approval review.");
  }

  if (!courseFitDecision) {
    warnings.push("Choose a course-fit decision before approval review.");
  }

  if (!noHarmNote) {
    warnings.push("Add a safeguarding or no-harm note before approval review.");
  }

  if (!evaluationAnchor) {
    warnings.push("Add an evaluation anchor before approval review.");
  }

  return warnings;
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalInt(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

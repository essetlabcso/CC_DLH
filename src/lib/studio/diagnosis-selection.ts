import type { DiagnosisDataset, DiagnosisRecord } from "@prisma/client";

export type CourseSetupDiagnosisSnapshot = {
  dataset: {
    id: string;
    code: string;
    title: string;
    programOrProject: string;
    assessmentPeriodStart: string | null;
    assessmentPeriodEnd: string | null;
    regionsCovered: string;
    organizationGroup: string;
  };
  record: {
    id: string;
    code: string;
    title: string;
    coreCapacityArea: string;
    capacityPracticeArea: string;
    subCapacity: string;
    targetAudience: string;
    region: string;
    currentBaseline: string;
    capacityGapStatement: string;
    desiredPractice: string;
    evidenceSourceSummary: string;
    ksmeRoute: string;
    separableKnowledgeSkillComponent: string;
    courseFitDecision: string;
    safeguardingRiskLevel: string;
    dataSensitivityLevel: string;
    noHarmNote: string;
    evaluationAnchor: string;
    monitoringSignal: string;
    possiblePracticalProof: string;
    verifiedAchievementExample: string;
  };
};

type DiagnosisDatasetSnapshotInput = Pick<
  DiagnosisDataset,
  | "id"
  | "datasetCode"
  | "datasetTitle"
  | "programOrProject"
  | "assessmentPeriodStart"
  | "assessmentPeriodEnd"
  | "regionsCovered"
  | "organizationGroup"
>;

type DiagnosisRecordSnapshotInput = Pick<
  DiagnosisRecord,
  | "id"
  | "diagnosisCode"
  | "diagnosisTitle"
  | "coreCapacityArea"
  | "capacityPracticeArea"
  | "subCapacity"
  | "targetAudience"
  | "region"
  | "currentBaseline"
  | "capacityGapStatement"
  | "desiredPractice"
  | "evidenceSource"
  | "ksmeRoute"
  | "separableKnowledgeSkillComponent"
  | "courseFitDecision"
  | "safeguardingRiskLevel"
  | "dataSensitivityLevel"
  | "noHarmNote"
  | "evaluationAnchor"
  | "monitoringSignal"
  | "possiblePracticalProof"
  | "verifiedAchievementExample"
>;

export function buildCourseSetupDiagnosisSnapshot(
  dataset: DiagnosisDatasetSnapshotInput,
  record: DiagnosisRecordSnapshotInput,
): CourseSetupDiagnosisSnapshot {
  return {
    dataset: {
      id: dataset.id,
      code: dataset.datasetCode,
      title: dataset.datasetTitle,
      programOrProject: dataset.programOrProject,
      assessmentPeriodStart: toIsoDate(dataset.assessmentPeriodStart),
      assessmentPeriodEnd: toIsoDate(dataset.assessmentPeriodEnd),
      regionsCovered: dataset.regionsCovered,
      organizationGroup: dataset.organizationGroup,
    },
    record: {
      id: record.id,
      code: record.diagnosisCode,
      title: record.diagnosisTitle,
      coreCapacityArea: record.coreCapacityArea,
      capacityPracticeArea: record.capacityPracticeArea,
      subCapacity: record.subCapacity,
      targetAudience: record.targetAudience,
      region: record.region,
      currentBaseline: record.currentBaseline,
      capacityGapStatement: record.capacityGapStatement,
      desiredPractice: record.desiredPractice,
      evidenceSourceSummary: record.evidenceSource,
      ksmeRoute: record.ksmeRoute,
      separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
      courseFitDecision: record.courseFitDecision,
      safeguardingRiskLevel: record.safeguardingRiskLevel,
      dataSensitivityLevel: record.dataSensitivityLevel,
      noHarmNote: record.noHarmNote,
      evaluationAnchor: record.evaluationAnchor,
      monitoringSignal: record.monitoringSignal,
      possiblePracticalProof: record.possiblePracticalProof,
      verifiedAchievementExample: record.verifiedAchievementExample,
    },
  };
}

export function serializeCourseSetupDiagnosisSnapshot(
  snapshot: CourseSetupDiagnosisSnapshot,
) {
  return JSON.stringify(snapshot);
}

export function parseCourseSetupDiagnosisSnapshot(
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as CourseSetupDiagnosisSnapshot;

    if (!parsed.dataset?.code || !parsed.record?.code) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function toIsoDate(value: Date | null) {
  return value ? value.toISOString() : null;
}

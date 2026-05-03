import type { DiagnosisDataset, DiagnosisRecord } from "@prisma/client";

export type CourseSetupDiagnosisEligibility = {
  selectable: boolean;
  reason: string;
  tone: "ready" | "partial" | "blocked";
};

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

export type CourseSetupDiagnosisOption = {
  id: string;
  datasetId: string;
  datasetCode: string;
  datasetTitle: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  region: string;
  organizationGroup: string;
  coreCapacityArea: string;
  capacityPracticeArea: string;
  subCapacity: string;
  targetAudience: string;
  currentBaseline: string;
  capacityGapStatement: string;
  desiredPractice: string;
  evidenceSource: string;
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
  eligibility: CourseSetupDiagnosisEligibility;
};

export type DiagnosisRecordWithDataset = DiagnosisRecord & {
  dataset: DiagnosisDataset;
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

export function getDiagnosisRecordEligibility(input: {
  courseFitDecision: string;
  ksmeRoute: string;
  separableKnowledgeSkillComponent: string;
}): CourseSetupDiagnosisEligibility {
  const courseFitDecision = normalizeDecision(input.courseFitDecision);
  const ksmeRoute = normalizeDecision(input.ksmeRoute);
  const hasKnowledgeSkillComponent = Boolean(
    input.separableKnowledgeSkillComponent.trim(),
  );

  if (courseFitDecision === "course-addressable") {
    return getKsmeEligibility(ksmeRoute, hasKnowledgeSkillComponent, true);
  }

  if (
    courseFitDecision === "partly course-addressable" ||
    courseFitDecision === "blended support recommended"
  ) {
    if (!hasKnowledgeSkillComponent) {
      return {
        selectable: false,
        reason:
          "This record needs a clearly documented Knowledge or Skill component before it can anchor a course.",
        tone: "blocked",
      };
    }

    return getKsmeEligibility(ksmeRoute, hasKnowledgeSkillComponent, false);
  }

  if (courseFitDecision === "non-course support required") {
    return {
      selectable: false,
      reason:
        "This diagnosis points to non-course support, so it is visible for context but cannot anchor course creation.",
      tone: "blocked",
    };
  }

  if (courseFitDecision === "further diagnosis needed") {
    return {
      selectable: false,
      reason:
        "This record needs further diagnosis before it can be used for course setup.",
      tone: "blocked",
    };
  }

  if (courseFitDecision === "not prioritized for phase 1") {
    return {
      selectable: false,
      reason:
        "This record is not prioritized for Phase 1 course creation.",
      tone: "blocked",
    };
  }

  return {
    selectable: false,
    reason:
      "This record does not yet have a course-fit decision that allows course creation.",
    tone: "blocked",
  };
}

export function mapDiagnosisRecordToCourseSetupOption(
  record: DiagnosisRecordWithDataset,
): CourseSetupDiagnosisOption {
  return {
    id: record.id,
    datasetId: record.datasetId,
    datasetCode: record.dataset.datasetCode,
    datasetTitle: record.dataset.datasetTitle,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    region: record.region,
    organizationGroup: record.organizationGroup,
    coreCapacityArea: record.coreCapacityArea,
    capacityPracticeArea: record.capacityPracticeArea,
    subCapacity: record.subCapacity,
    targetAudience: record.targetAudience,
    currentBaseline: record.currentBaseline,
    capacityGapStatement: record.capacityGapStatement,
    desiredPractice: record.desiredPractice,
    evidenceSource: record.evidenceSource,
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
    eligibility: getDiagnosisRecordEligibility({
      courseFitDecision: record.courseFitDecision,
      ksmeRoute: record.ksmeRoute,
      separableKnowledgeSkillComponent:
        record.separableKnowledgeSkillComponent,
    }),
  };
}

export function buildCourseSetupDiagnosisSelectionData(
  record: DiagnosisRecordWithDataset | null,
) {
  if (!record) {
    return {};
  }

  return {
    selectedDiagnosisDatasetId: record.datasetId,
    selectedDiagnosisRecordId: record.id,
    diagnosisSnapshot: serializeCourseSetupDiagnosisSnapshot(
      buildCourseSetupDiagnosisSnapshot(record.dataset, record),
    ),
  };
}

function getKsmeEligibility(
  ksmeRoute: string,
  hasKnowledgeSkillComponent: boolean,
  fullyCourseAddressable: boolean,
): CourseSetupDiagnosisEligibility {
  if (ksmeRoute === "knowledge" || ksmeRoute === "skill") {
    return {
      selectable: true,
      reason: fullyCourseAddressable
        ? "Ready to anchor course setup."
        : "Selectable for the documented course component.",
      tone: fullyCourseAddressable ? "ready" : "partial",
    };
  }

  if (ksmeRoute === "mixed") {
    return hasKnowledgeSkillComponent
      ? {
          selectable: true,
          reason: "Selectable for the documented Knowledge or Skill component.",
          tone: "partial",
        }
      : {
          selectable: false,
          reason:
            "Mixed-route records need a clear Knowledge or Skill component before course setup.",
          tone: "blocked",
        };
  }

  if (ksmeRoute === "motivation" || ksmeRoute === "environment") {
    return hasKnowledgeSkillComponent
      ? {
          selectable: true,
          reason:
            "Selectable only for the separable Knowledge or Skill component.",
          tone: "partial",
        }
      : {
          selectable: false,
          reason:
            "Motivation or Environment records need a separable Knowledge or Skill component before course setup.",
          tone: "blocked",
        };
  }

  return {
    selectable: false,
    reason:
      "This K/S/M/E route needs further diagnosis before course setup.",
    tone: "blocked",
  };
}

function normalizeDecision(value: string) {
  return value.trim().toLowerCase();
}

function toIsoDate(value: Date | null) {
  return value ? value.toISOString() : null;
}

import { describe, expect, it } from "vitest";

import {
  buildEvidenceContextDisplayModel,
  type EvidenceContextAnalysisInput,
} from "./evidence-context";
import {
  buildCourseSetupDiagnosisSnapshot,
  serializeCourseSetupDiagnosisSnapshot,
  type DiagnosisRecordWithDataset,
} from "./diagnosis-selection";

describe("evidence context display model", () => {
  it("resolves a valid diagnosis snapshot for display", () => {
    const context = buildEvidenceContextDisplayModel({
      diagnosisSnapshotValue: serializeCourseSetupDiagnosisSnapshot(
        buildSnapshot(),
      ),
    });

    expect(context.title).toBe("Admin-approved source anchor");
    expect(context.lineage.approvedDiagnosis).toBe("Approved source anchor");
    expect(context.status.hasApprovedDiagnosisEvidence).toBe(true);
    expect(context.status.hasMissingEvidenceWarning).toBe(false);
    expect(context.diagnosis?.datasetCode).toBe("DEC-CSF-2026-R1");
    expect(context.diagnosis?.diagnosisCode).toBe("MEAL-001");
    expect(context.badges.map((badge) => badge.label)).toContain(
      "Admin-approved source",
    );
    expect(context.badges.map((badge) => badge.label)).toContain("Skill");
    expect(context.diagnosis?.items).toContainEqual({
      label: "Linked evidence source package",
      value: "DEC-CSF-2026-R1 - CSF+ Partner CSO Capacity Diagnosis - Round 1",
    });
  });

  it("falls back to a linked diagnosis record when the snapshot is invalid", () => {
    const context = buildEvidenceContextDisplayModel({
      diagnosisSnapshotValue: "{not valid json",
      linkedDiagnosisRecord: buildLinkedRecord(),
    });

    expect(context.status.hasApprovedDiagnosisEvidence).toBe(true);
    expect(context.diagnosis?.diagnosisCode).toBe("MEAL-002");
    expect(context.diagnosis?.diagnosisTitle).toBe(
      "Review outcome evidence notes",
    );
  });

  it("returns a warning state when diagnosis evidence is missing", () => {
    const context = buildEvidenceContextDisplayModel({});

    expect(context.status.hasApprovedDiagnosisEvidence).toBe(false);
    expect(context.status.hasMissingEvidenceWarning).toBe(true);
    expect(context.warning).toContain("No approved diagnosis evidence");
    expect(context.diagnosis).toBeNull();
  });

  it("includes locked Analysis context when provided", () => {
    const context = buildEvidenceContextDisplayModel({
      analysisHandover: buildAnalysisHandover(),
      diagnosisSnapshotValue: serializeCourseSetupDiagnosisSnapshot(
        buildSnapshot(),
      ),
    });

    expect(context.status.hasLockedAnalysis).toBe(true);
    expect(context.analysis?.items).toContainEqual({
      label: "Validated capacity gap",
      value:
        "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
    });
  });

  it("preserves Capacity Practice Area and sub-capacity compatibility", () => {
    const snapshot = buildSnapshot({
      capacityPracticeArea: "",
      subCapacity: "Outcome evidence and learning documentation",
    });
    const context = buildEvidenceContextDisplayModel({
      diagnosisSnapshotValue: serializeCourseSetupDiagnosisSnapshot(snapshot),
    });

    expect(context.diagnosis?.items).toContainEqual({
      label: "Capacity Practice Area",
      value: "Outcome evidence and learning documentation",
    });
  });
});

function buildSnapshot(
  overrides: Partial<{
    capacityPracticeArea: string;
    subCapacity: string;
  }> = {},
) {
  return buildCourseSetupDiagnosisSnapshot(
    {
      id: "dataset-1",
      datasetCode: "DEC-CSF-2026-R1",
      datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
      programOrProject: "EU CSF+",
      assessmentPeriodStart: null,
      assessmentPeriodEnd: null,
      regionsCovered: "Addis Ababa, Oromia",
      organizationGroup: "Selected local CSO partners / CSF+ cohort",
    },
    {
      id: "record-1",
      diagnosisCode: "MEAL-001",
      diagnosisTitle: "Prepare concise outcome evidence notes",
      coreCapacityArea:
        "Monitoring, Evaluation, Accountability, and Learning",
      capacityPracticeArea:
        overrides.capacityPracticeArea ??
        "Outcome evidence and learning documentation",
      subCapacity:
        overrides.subCapacity ?? "Outcome evidence and learning documentation",
      targetAudience: "MEAL staff / Program staff",
      region: "Addis Ababa",
      currentBaseline:
        "Staff collect routine monitoring data, but outcome notes are activity-focused.",
      capacityGapStatement:
        "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
      desiredPractice:
        "Staff prepare a short outcome evidence note linked to outputs, observed change, evidence source, and learning implication.",
      evidenceSource:
        "Fictionalized workshop exercise, survey summary, and validation discussion.",
      ksmeRoute: "Skill",
      separableKnowledgeSkillComponent: "",
      courseFitDecision: "Course-addressable",
      safeguardingRiskLevel: "Low",
      dataSensitivityLevel: "Internal",
      noHarmNote:
        "Use anonymized examples and avoid raw participant details in practice activities.",
      evaluationAnchor:
        "Participant can produce a short outcome evidence note from a safe sample dataset.",
      monitoringSignal:
        "Quality of submitted outcome evidence notes improves in course practice tasks.",
      possiblePracticalProof: "MEAL evidence output",
      verifiedAchievementExample:
        "Accepted outcome evidence note using safe sample data.",
    },
  );
}

function buildLinkedRecord(): DiagnosisRecordWithDataset {
  return {
    id: "record-2",
    datasetId: "dataset-1",
    diagnosisCode: "MEAL-002",
    diagnosisTitle: "Review outcome evidence notes",
    organizationId: null,
    coreCapacityArea:
      "Monitoring, Evaluation, Accountability, and Learning",
    capacityPracticeArea: "Outcome evidence review",
    subCapacity: "Outcome evidence review",
    indicatorStandardLink: "DEC CSO capacity standard",
    targetAudience: "MEAL staff",
    region: "Oromia",
    sectorThematicArea: "",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    currentBaseline: "Outcome notes are reviewed inconsistently.",
    capacityGapStatement:
      "Staff need a reliable review checklist for outcome evidence notes.",
    desiredPractice:
      "Staff review outcome evidence notes using a short checklist.",
    evidenceSource: "Fictionalized validation summary.",
    rootCauseSummary: "Checklist practice is inconsistent.",
    ksmeRoute: "Skill",
    separableKnowledgeSkillComponent: "",
    nonCourseBarrierSummary: "",
    courseFitDecision: "Course-addressable",
    recommendedInterventionRoute: "Course",
    recommendedCourseOrSupportTitle: "Review outcome evidence notes",
    priorityLevel: "High",
    priorityRank: 1,
    courseCreationStatus: "course-ready",
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote: "Use safe sample notes only.",
    safeSummaryForDashboard: "Safe fictionalized MEAL review practice.",
    evaluationAnchor: "Participant reviews a safe sample note.",
    monitoringSignal: "Review checklist quality improves.",
    possiblePracticalProof: "Completed review checklist",
    verifiedAchievementExample: "Accepted review checklist.",
    approvalStatus: "APPROVED",
    visibilityScope: "DEC course creators / internal course creation",
    isActive: true,
    isLocked: true,
    changeReason: "",
    approvedById: null,
    lockedById: null,
    createdById: null,
    updatedById: null,
    approvedAt: null,
    lockedAt: null,
    archivedAt: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    dataset: {
      id: "dataset-1",
      datasetCode: "DEC-CSF-2026-R1",
      datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
      programOrProject: "EU CSF+",
      assessmentPurpose: "Demo testing dataset",
      assessmentPeriodStart: null,
      assessmentPeriodEnd: null,
      regionsCovered: "Addis Ababa, Oromia",
      organizationGroup: "Selected local CSO partners / CSF+ cohort",
      dataCollectionMethods: "Workshop, survey, interview",
      approvalStatus: "APPROVED",
      visibilityScope: "DEC course creators / internal course creation",
      notes: "",
      approvedById: null,
      createdById: null,
      updatedById: null,
      approvedAt: null,
      archivedAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  };
}

function buildAnalysisHandover(): EvidenceContextAnalysisInput {
  return {
    status: "LOCKED",
    lockedAt: new Date("2026-01-02T00:00:00.000Z"),
    capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
    subCapacityArea: "Outcome evidence and learning documentation",
    capacityIndicator:
      "Participant can prepare a concise outcome evidence note.",
    validatedCapacityGap:
      "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
    baseline:
      "Staff collect routine monitoring data, but outcome notes are activity-focused.",
    desiredPractice:
      "Staff prepare a short outcome evidence note linked to outputs, observed change, evidence source, and learning implication.",
    rootCauseSummary:
      "The main course-addressable issue is a Skill gap in preparing concise outcome evidence.",
    ksmeRoute: "skill",
    separableKnowledgeSkillComponent: "",
    interventionDecision: "Proceed with a focused skill-practice course.",
    analysisGateDecision: "proceed-to-design",
    safeguardsNote:
      "Use anonymized examples and avoid raw participant details in practice activities.",
    evaluationAnchor:
      "Participant can produce a short outcome evidence note from a safe sample dataset.",
  };
}

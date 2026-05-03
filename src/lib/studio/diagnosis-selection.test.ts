import { describe, expect, it } from "vitest";

import {
  buildCourseSetupDiagnosisSelectionData,
  buildCourseSetupDiagnosisSnapshot,
  getDiagnosisRecordEligibility,
  parseCourseSetupDiagnosisSnapshot,
  serializeCourseSetupDiagnosisSnapshot,
} from "./diagnosis-selection";

describe("course setup diagnosis snapshot helpers", () => {
  it("captures the approved diagnosis context needed for future course setup selection", () => {
    const snapshot = buildCourseSetupDiagnosisSnapshot(
      {
        id: "dataset-1",
        datasetCode: "DEC-CSF-2026-R1",
        datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
        programOrProject: "EU CSF+",
        assessmentPeriodStart: new Date("2026-01-01T00:00:00.000Z"),
        assessmentPeriodEnd: new Date("2026-03-31T00:00:00.000Z"),
        regionsCovered: JSON.stringify(["Addis Ababa", "Oromia"]),
        organizationGroup: "Selected local CSO partners",
      },
      {
        id: "record-1",
        diagnosisCode: "MEAL-001",
        diagnosisTitle: "Outcome evidence and learning documentation",
        coreCapacityArea: "Monitoring, Evaluation, Accountability, and Learning",
        capacityPracticeArea: "Outcome evidence and learning documentation",
        subCapacity: "Outcome evidence",
        targetAudience: "MEAL staff / Program staff",
        region: "Addis Ababa",
        currentBaseline:
          "Staff understand reporting requirements but need support preparing evidence notes.",
        capacityGapStatement:
          "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
        desiredPractice:
          "Staff prepare a short outcome evidence note that links outputs, observed change, source, and learning implication.",
        evidenceSource: "Validated workshop and document review summary.",
        ksmeRoute: "Skill",
        separableKnowledgeSkillComponent: "",
        courseFitDecision: "Course-addressable",
        safeguardingRiskLevel: "Low",
        dataSensitivityLevel: "Internal",
        noHarmNote: "Use summary evidence only.",
        evaluationAnchor: "Outcome evidence note quality",
        monitoringSignal: "Evidence notes submitted",
        possiblePracticalProof: "Short outcome evidence note",
        verifiedAchievementExample: "Outcome evidence note accepted",
      },
    );

    expect(snapshot.dataset.code).toBe("DEC-CSF-2026-R1");
    expect(snapshot.record.capacityPracticeArea).toBe(
      "Outcome evidence and learning documentation",
    );
    expect(snapshot.record.evidenceSourceSummary).toBe(
      "Validated workshop and document review summary.",
    );
    expect(snapshot.record.possiblePracticalProof).toBe(
      "Short outcome evidence note",
    );
  });

  it("serializes and safely parses a snapshot", () => {
    const snapshot = buildCourseSetupDiagnosisSnapshot(
      {
        id: "dataset-1",
        datasetCode: "DEC-CSF-2026-R1",
        datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
        programOrProject: "EU CSF+",
        assessmentPeriodStart: null,
        assessmentPeriodEnd: null,
        regionsCovered: "[]",
        organizationGroup: "",
      },
      {
        id: "record-1",
        diagnosisCode: "MEAL-001",
        diagnosisTitle: "Outcome evidence",
        coreCapacityArea: "MEAL",
        capacityPracticeArea: "Outcome evidence",
        subCapacity: "",
        targetAudience: "MEAL staff",
        region: "Addis Ababa",
        currentBaseline: "",
        capacityGapStatement: "",
        desiredPractice: "",
        evidenceSource: "",
        ksmeRoute: "Skill",
        separableKnowledgeSkillComponent: "",
        courseFitDecision: "Course-addressable",
        safeguardingRiskLevel: "Low",
        dataSensitivityLevel: "Internal",
        noHarmNote: "",
        evaluationAnchor: "",
        monitoringSignal: "",
        possiblePracticalProof: "",
        verifiedAchievementExample: "",
      },
    );

    const serialized = serializeCourseSetupDiagnosisSnapshot(snapshot);

    expect(parseCourseSetupDiagnosisSnapshot(serialized)).toEqual(snapshot);
    expect(parseCourseSetupDiagnosisSnapshot("{bad json")).toBeNull();
    expect(parseCourseSetupDiagnosisSnapshot("{}")).toBeNull();
  });

  it("keeps course setup selection data scoped to the selected diagnosis record", () => {
    const record = buildRecordWithDataset({
      id: "record-1",
      datasetId: "dataset-1",
      diagnosisCode: "MEAL-001",
    });

    const data = buildCourseSetupDiagnosisSelectionData(record);

    expect(data.selectedDiagnosisDatasetId).toBe("dataset-1");
    expect(data.selectedDiagnosisRecordId).toBe("record-1");
    expect(
      parseCourseSetupDiagnosisSnapshot(data.diagnosisSnapshot),
    )?.toMatchObject({
      dataset: {
        code: "DEC-CSF-2026-R1",
      },
      record: {
        code: "MEAL-001",
      },
    });
    expect(buildCourseSetupDiagnosisSelectionData(null)).toEqual({});
  });

  it("allows only course-eligible diagnosis records to anchor course setup", () => {
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Course-addressable",
        ksmeRoute: "Skill",
        separableKnowledgeSkillComponent: "",
      }),
    ).toMatchObject({ selectable: true, tone: "ready" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Partly course-addressable",
        ksmeRoute: "Mixed",
        separableKnowledgeSkillComponent: "Draft a safe message.",
      }),
    ).toMatchObject({ selectable: true, tone: "partial" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Partly course-addressable",
        ksmeRoute: "Mixed",
        separableKnowledgeSkillComponent: "",
      }),
    ).toMatchObject({ selectable: false, tone: "blocked" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Non-course support required",
        ksmeRoute: "Environment",
        separableKnowledgeSkillComponent: "",
      }),
    ).toMatchObject({ selectable: false, tone: "blocked" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Further diagnosis needed",
        ksmeRoute: "Unclear / needs further diagnosis",
        separableKnowledgeSkillComponent: "",
      }),
    ).toMatchObject({ selectable: false, tone: "blocked" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Blended support recommended",
        ksmeRoute: "Motivation",
        separableKnowledgeSkillComponent:
          "Practice applying a simple planning checklist.",
      }),
    ).toMatchObject({ selectable: true, tone: "partial" });
    expect(
      getDiagnosisRecordEligibility({
        courseFitDecision: "Course-addressable",
        ksmeRoute: "Environment",
        separableKnowledgeSkillComponent: "",
      }),
    ).toMatchObject({ selectable: false, tone: "blocked" });
  });
});

function buildRecordWithDataset(overrides: {
  diagnosisCode?: string;
  datasetId?: string;
  id?: string;
}) {
  const now = new Date("2026-01-01T00:00:00.000Z");

  return {
    id: overrides.id ?? "record-1",
    datasetId: overrides.datasetId ?? "dataset-1",
    diagnosisCode: overrides.diagnosisCode ?? "MEAL-001",
    diagnosisTitle: "Outcome evidence",
    organizationId: null,
    organizationGroup: "",
    region: "Addis Ababa",
    sectorThematicArea: "",
    coreCapacityArea: "MEAL",
    capacityPracticeArea: "Outcome evidence",
    subCapacity: "",
    indicatorStandardLink: "",
    targetAudience: "MEAL staff",
    currentBaseline: "",
    desiredPractice: "",
    capacityGapStatement: "",
    evidenceSource: "",
    rootCauseSummary: "",
    ksmeRoute: "Skill",
    separableKnowledgeSkillComponent: "",
    nonCourseBarrierSummary: "",
    courseFitDecision: "Course-addressable",
    recommendedInterventionRoute: "",
    recommendedCourseOrSupportTitle: "",
    priorityLevel: "",
    priorityRank: null,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote: "",
    safeSummaryForDashboard: "",
    evaluationAnchor: "",
    monitoringSignal: "",
    possiblePracticalProof: "",
    verifiedAchievementExample: "",
    approvalStatus: "APPROVED",
    visibilityScope: "DEC_COURSE_CREATORS_INTERNAL_COURSE_CREATION",
    courseCreationStatus: "READY_FOR_COURSE_SETUP",
    isLocked: true,
    isActive: true,
    approvedById: null,
    approvedAt: now,
    lockedById: null,
    lockedAt: now,
    archivedAt: null,
    changeReason: "",
    createdById: null,
    updatedById: null,
    createdAt: now,
    updatedAt: now,
    dataset: {
      id: overrides.datasetId ?? "dataset-1",
      datasetCode: "DEC-CSF-2026-R1",
      datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
      assessmentPeriodStart: null,
      assessmentPeriodEnd: null,
      programOrProject: "EU CSF+",
      assessmentPurpose: "",
      regionsCovered: "[]",
      organizationGroup: "",
      dataCollectionMethods: "[]",
      approvalStatus: "APPROVED",
      visibilityScope: "DEC_COURSE_CREATORS_INTERNAL_COURSE_CREATION",
      notes: "",
      approvedById: null,
      approvedAt: now,
      archivedAt: null,
      createdById: null,
      updatedById: null,
      createdAt: now,
      updatedAt: now,
    },
  };
}

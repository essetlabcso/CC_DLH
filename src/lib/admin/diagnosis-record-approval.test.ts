import { describe, expect, it } from "vitest";

import {
  getDiagnosisRecordApprovalReadiness,
  type DiagnosisRecordApprovalReadinessInput,
} from "@/lib/admin/diagnosis-record-approval";

describe("diagnosis record approval and lock readiness", () => {
  it("passes approval and lock readiness for a complete eligible record", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        recordApprovalStatus: "APPROVED",
      }),
    );

    expect(readiness.approvalReady).toBe(true);
    expect(readiness.lockReady).toBe(true);
    expect(readiness.approvalBlockingIssues).toEqual([]);
    expect(readiness.lockBlockingIssues).toEqual([]);
    expect(readiness.status).toBe("ready_for_lock");
  });

  it("returns approval blockers for incomplete core evidence", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        courseFitDecision: "",
        currentBaseline: "",
        desiredPractice: "",
        diagnosisCode: "",
        diagnosisTitle: "",
        evidenceSource: "",
        evaluationAnchor: "",
        ksmeRoute: "",
        noHarmNote: "",
        targetAudience: "",
      }),
    );

    expect(readiness.approvalReady).toBe(false);
    expect(readiness.lockReady).toBe(false);
    expect(readiness.approvalBlockingIssues).toEqual(
      expect.arrayContaining([
        "Add a diagnosis code.",
        "Add a diagnosis title.",
        "Add the baseline or current practice.",
        "Add the desired practice.",
        "Add the evidence source.",
        "Add the Target Audience.",
        "Choose a K/S/M/E route.",
        "Choose a course-fit decision.",
        "Add a safeguarding or no-harm note.",
        "Add an evaluation anchor.",
      ]),
    );
    expect(readiness.lockBlockingIssues).toContain(
      "Resolve approval readiness issues before locking this record.",
    );
  });

  it("does not pass lock readiness while the record is still draft", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(buildInput());

    expect(readiness.approvalReady).toBe(true);
    expect(readiness.lockReady).toBe(false);
    expect(readiness.status).toBe("ready_for_approval");
    expect(readiness.lockBlockingIssues).toContain(
      "Approve the diagnosis record before locking it.",
    );
  });

  it.each(["Mixed", "Motivation", "Environment"])(
    "blocks %s records without a separable Knowledge or Skill component",
    (ksmeRoute) => {
      const readiness = getDiagnosisRecordApprovalReadiness(
        buildInput({
          ksmeRoute,
          recordApprovalStatus: "APPROVED",
          separableKnowledgeSkillComponent: "",
        }),
      );

      expect(readiness.approvalReady).toBe(true);
      expect(readiness.lockReady).toBe(false);
      expect(readiness.lockBlockingIssues.join(" ")).toContain(
        "Knowledge or Skill component",
      );
    },
  );

  it("blocks partly course-addressable records without a separable Knowledge or Skill component", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        courseFitDecision: "Partly course-addressable",
        ksmeRoute: "Mixed",
        recordApprovalStatus: "APPROVED",
        separableKnowledgeSkillComponent: "",
      }),
    );

    expect(readiness.lockReady).toBe(false);
    expect(readiness.lockBlockingIssues).toContain(
      "This record needs a clearly documented Knowledge or Skill component before it can anchor a course.",
    );
  });

  it("allows partly course-addressable records when the course component is explicit", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        courseFitDecision: "Partly course-addressable",
        ksmeRoute: "Mixed",
        recordApprovalStatus: "APPROVED",
        separableKnowledgeSkillComponent:
          "Practice writing a short outcome evidence note.",
      }),
    );

    expect(readiness.lockReady).toBe(true);
    expect(readiness.status).toBe("ready_for_lock");
  });

  it("blocks non-course support records from Course Setup lock readiness", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        courseFitDecision: "Non-course support required",
        ksmeRoute: "Environment",
        recordApprovalStatus: "APPROVED",
        separableKnowledgeSkillComponent:
          "A short guidance note could be added later.",
      }),
    );

    expect(readiness.approvalReady).toBe(true);
    expect(readiness.lockReady).toBe(false);
    expect(readiness.lockBlockingIssues).toContain(
      "This diagnosis points to non-course support, so it is visible for context but cannot anchor course creation.",
    );
  });

  it("requires an approved active dataset before lock readiness", () => {
    const readiness = getDiagnosisRecordApprovalReadiness(
      buildInput({
        datasetApprovalStatus: "DRAFT",
        datasetArchivedAt: new Date("2026-01-01T00:00:00.000Z"),
        recordApprovalStatus: "APPROVED",
      }),
    );

    expect(readiness.lockReady).toBe(false);
    expect(readiness.lockBlockingIssues).toEqual(
      expect.arrayContaining([
        "The linked diagnosis dataset must be approved before this record can be locked for Course Setup.",
        "Archived diagnosis datasets cannot supply Course Setup records.",
      ]),
    );
  });
});

function buildInput(
  overrides: Partial<DiagnosisRecordApprovalReadinessInput> = {},
): DiagnosisRecordApprovalReadinessInput {
  return {
    capacityGapStatement:
      "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
    capacityPracticeArea: "Outcome evidence and learning documentation",
    coreCapacityArea: "Monitoring, Evaluation, Accountability, and Learning",
    courseFitDecision: "Course-addressable",
    currentBaseline:
      "Staff understand reporting requirements but need support preparing evidence notes.",
    dataSensitivityLevel: "Internal",
    datasetApprovalStatus: "APPROVED",
    datasetArchivedAt: null,
    desiredPractice:
      "Staff prepare a short outcome evidence note that links outputs, observed change, source, and learning implication.",
    diagnosisCode: "MEAL-001",
    diagnosisTitle: "Outcome evidence and learning documentation",
    evidenceSource: "Validated workshop and document review summary.",
    evaluationAnchor: "Outcome evidence note quality",
    isActive: true,
    isLocked: false,
    ksmeRoute: "Skill",
    monitoringSignal: "Evidence notes submitted",
    noHarmNote: "Use summary evidence only.",
    recordApprovalStatus: "DRAFT",
    recordArchivedAt: null,
    safeguardingRiskLevel: "Low",
    separableKnowledgeSkillComponent: "",
    targetAudience: "MEAL staff / Program staff",
    ...overrides,
  };
}

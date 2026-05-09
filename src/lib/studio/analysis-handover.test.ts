import { describe, expect, it } from "vitest";

import {
  analysisHandoverFieldLabels,
  canAnalysisProceedToDesign,
  isAnalysisHandoverLocked,
  parseAnalysisHandoverFormData,
  requiresSeparableKnowledgeSkill,
  validateAnalysisAnchorConsistency,
} from "./analysis-handover";

describe("analysis handover gate", () => {
  it("lets Knowledge and Skill routes proceed after course-fit analysis", () => {
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "course-fit",
        ksmeRoute: "knowledge",
        separableKnowledgeSkillComponent: "",
        analysisGateDecision: "proceed-to-design",
      }),
    ).toBe(true);
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "course-fit",
        ksmeRoute: "skill",
        separableKnowledgeSkillComponent: "",
        analysisGateDecision: "proceed-with-conditions",
      }),
    ).toBe(true);
  });

  it("blocks Motivation, Environment, and Mixed routes without separable Knowledge or Skill", () => {
    for (const ksmeRoute of ["motivation", "environment", "mixed"]) {
      expect(requiresSeparableKnowledgeSkill(ksmeRoute)).toBe(true);
      expect(
        canAnalysisProceedToDesign({
          courseFitDecision: "course-fit",
          ksmeRoute,
          separableKnowledgeSkillComponent: "",
          analysisGateDecision: "proceed-to-design",
        }),
      ).toBe(false);
    }
  });

  it("allows Motivation, Environment, and Mixed routes only when a separable Knowledge or Skill component is explicit", () => {
    for (const ksmeRoute of ["motivation", "environment", "mixed"]) {
      expect(
        canAnalysisProceedToDesign({
          courseFitDecision: "course-fit",
          ksmeRoute,
          separableKnowledgeSkillComponent:
            "Learners need to practice safe referral documentation.",
          analysisGateDecision: "proceed-to-design",
        }),
      ).toBe(true);
    }
  });

  it("blocks paused and non-course decisions even when the handover fields are present", () => {
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "alternative-intervention",
        ksmeRoute: "skill",
        separableKnowledgeSkillComponent:
          "Learners need to practice safe referral documentation.",
        analysisGateDecision: "non-course-route",
      }),
    ).toBe(false);
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "needs-more-evidence",
        ksmeRoute: "knowledge",
        separableKnowledgeSkillComponent: "",
        analysisGateDecision: "proceed-to-design",
      }),
    ).toBe(false);
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "course-fit",
        ksmeRoute: "skill",
        separableKnowledgeSkillComponent: "",
        analysisGateDecision: "needs-further-diagnosis",
      }),
    ).toBe(false);
  });

  it("requires capacity taxonomy fields before locking the handover", () => {
    const formData = buildValidHandoverFormData();

    formData.set("capacityArea", "");

    const result = parseAnalysisHandoverFormData(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("capacityArea");
    }
  });

  it("keeps subCapacityArea as a compatible storage key with Capacity Practice Area labeling", () => {
    const formData = buildValidHandoverFormData();
    const result = parseAnalysisHandoverFormData(formData);

    expect(analysisHandoverFieldLabels.subCapacityArea).toBe(
      "Capacity Practice Area",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.subCapacityArea).toBe(
        "Safeguarding referral practice",
      );
    }
  });

  it("requires the separable component while parsing non-Knowledge/Skill handovers", () => {
    const formData = buildValidHandoverFormData();

    formData.set("ksmeGap", "environment");
    formData.set("separableKnowledgeSkillComponent", "");

    const result = parseAnalysisHandoverFormData(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain(
        "separableKnowledgeSkillComponent",
      );
    }
  });

  it("requires a referral or further-diagnosis note for paused analysis routes", () => {
    const formData = buildValidHandoverFormData();

    formData.set("courseFitDecision", "needs-more-evidence");
    formData.set("analysisGateDecision", "needs-further-diagnosis");
    formData.set("referralOrFurtherDiagnosisNote", "");

    const result = parseAnalysisHandoverFormData(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("referralOrFurtherDiagnosisNote");
    }
  });

  it("uses locked status and locked time to identify approved handovers", () => {
    expect(
      isAnalysisHandoverLocked({
        status: "LOCKED",
        lockedAt: new Date("2026-04-27T00:00:00.000Z"),
      }),
    ).toBe(true);
    expect(
      isAnalysisHandoverLocked({
        status: "LOCKED",
        lockedAt: null,
      }),
    ).toBe(false);
  });

  it("passes anchor consistency when Analysis fields align with approved diagnosis evidence", () => {
    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover: buildValidHandoverInput(),
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("blocks lock readiness when capacity area contradicts the approved diagnosis evidence", () => {
    const handover = buildValidHandoverInput();
    handover.capacityArea = "Internal Governance and Leadership";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Capacity area must match the approved diagnosis evidence selected in Course Setup.",
    );
  });

  it("blocks lock readiness when the K/S/M/E route contradicts the approved diagnosis evidence", () => {
    const handover = buildValidHandoverInput();
    handover.ksmeRoute = "knowledge";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "K/S/M/E route must match or remain compatible with the approved diagnosis evidence.",
    );
  });

  it("blocks lock readiness when the validated capacity gap drops the source anchor gap", () => {
    const handover = buildValidHandoverInput();
    handover.validatedCapacityGap =
      "Finance staff need help preparing procurement reports.";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Validated capacity gap must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  });

  it("blocks lock readiness when baseline/current practice omits the source anchor baseline", () => {
    const handover = buildValidHandoverInput();
    handover.baseline = "";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Baseline/current practice must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  });

  it("blocks lock readiness when evaluation anchor contradicts the source anchor", () => {
    const handover = buildValidHandoverInput();
    handover.evaluationAnchor =
      "Learners can identify procurement thresholds in a finance policy.";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Evaluation anchor must remain aligned with the approved diagnosis evidence selected in Course Setup.",
    );
  });

  it("continues to block lock readiness when no-harm guidance is dropped", () => {
    const handover = buildValidHandoverInput();
    handover.safeguardsNote = "Use finance examples.";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot: buildDiagnosisSnapshot(),
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Safeguarding and no-harm guidance from the approved diagnosis evidence must remain visible in the Analysis Handover.",
    );
  });

  it("blocks lock readiness when approved diagnosis evidence is missing", () => {
    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover: buildValidHandoverInput(),
      snapshot: null,
    });

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toContain("No approved diagnosis evidence");
  });

  it("blocks non-course-support diagnosis evidence from locking into Design", () => {
    const snapshot = buildDiagnosisSnapshot({
      courseFitDecision: "Non-course support required",
      ksmeRoute: "Environment",
      separableKnowledgeSkillComponent: "",
    });
    const handover = buildValidHandoverInput();
    handover.ksmeRoute = "environment";

    const result = validateAnalysisAnchorConsistency({
      diagnosis: {
        affectedLearnerGroup: "MEAL staff",
        courseFitDecision: "course-fit",
      },
      handover,
      snapshot,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "The selected diagnosis evidence is not currently eligible to anchor course production. Return to Course Setup and select a course-eligible diagnosis record.",
    );
  });
});

function buildValidHandoverFormData() {
  const formData = new FormData();

  formData.set("courseFitDecision", "course-fit");
  formData.set("capacityArea", "Human Resources, Inclusion, and Safeguarding");
  formData.set("subCapacityArea", "Safeguarding referral practice");
  formData.set("linkedStandard", "DEC safeguarding practice standard");
  formData.set(
    "capacityIndicator",
    "Staff use the correct reporting pathway in a realistic scenario.",
  );
  formData.set(
    "validatedCapacityGap",
    "Safeguarding focal staff do not report incidents through the correct path.",
  );
  formData.set("baseline", "Staff wait for senior approval before acting.");
  formData.set(
    "desiredPractice",
    "Staff use the approved referral path promptly.",
  );
  formData.set(
    "rootCauseSummary",
    "The main issue is a skill gap around choosing the correct pathway.",
  );
  formData.set("ksmeGap", "skill");
  formData.set("interventionDecision", "Proceed with a skill practice course.");
  formData.set("analysisGateDecision", "proceed-to-design");
  formData.set("referralOrFurtherDiagnosisNote", "");
  formData.set(
    "safeguardsNote",
    "Use fictionalized examples and avoid identifiable cases.",
  );
  formData.set(
    "evaluationAnchor",
    "Learners can choose the correct reporting pathway in a scenario.",
  );

  return formData;
}

function buildValidHandoverInput() {
  const formData = buildValidHandoverFormData();
  formData.set(
    "capacityArea",
    "Monitoring, Evaluation, Accountability, and Learning",
  );
  formData.set(
    "subCapacityArea",
    "Outcome evidence and learning documentation",
  );
  formData.set("ksmeGap", "skill");
  formData.set(
    "validatedCapacityGap",
    "Staff need practice preparing concise outcome evidence statements from routine monitoring data.",
  );
  formData.set(
    "baseline",
    "Staff understand reporting requirements but need support preparing concise outcome evidence statements.",
  );
  formData.set(
    "safeguardsNote",
    "Use fictionalized examples and avoid identifiable participant data.",
  );
  formData.set(
    "evaluationAnchor",
    "Participant prepares a concise outcome evidence statement.",
  );
  const result = parseAnalysisHandoverFormData(formData);

  if (!result.ok) {
    throw new Error("Expected valid handover input in test fixture.");
  }

  return result.value;
}

function buildDiagnosisSnapshot(
  overrides: Partial<{
    courseFitDecision: string;
    ksmeRoute: string;
    separableKnowledgeSkillComponent: string;
  }> = {},
) {
  return {
    dataset: {
      id: "dataset-1",
      code: "DEC-CSF-2026-R1",
      title: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
      programOrProject: "EU CSF+",
      assessmentPeriodStart: null,
      assessmentPeriodEnd: null,
      regionsCovered: "Addis Ababa, Oromia",
      organizationGroup: "Selected local CSO partners / CSF+ cohort",
    },
    record: {
      id: "record-1",
      code: "MEAL-001",
      title: "MEAL outcome evidence",
      coreCapacityArea:
        "Monitoring, Evaluation, Accountability, and Learning",
      capacityPracticeArea: "Outcome evidence and learning documentation",
      subCapacity: "Outcome evidence and learning documentation",
      targetAudience: "MEAL staff / Program staff",
      region: "Addis Ababa",
      currentBaseline:
        "Staff understand reporting requirements but cannot prepare concise outcome evidence statements.",
      capacityGapStatement:
        "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
      desiredPractice:
        "Staff prepare a short outcome evidence note that links outputs, observed change, evidence source, and learning implication.",
      evidenceSourceSummary:
        "Workshop, survey, interview, document review, facilitated validation",
      ksmeRoute: overrides.ksmeRoute ?? "Skill",
      separableKnowledgeSkillComponent:
        overrides.separableKnowledgeSkillComponent ?? "",
      courseFitDecision: overrides.courseFitDecision ?? "Course-addressable",
      safeguardingRiskLevel: "Low",
      dataSensitivityLevel: "Internal",
      noHarmNote:
        "Use fictionalized examples and avoid identifiable participant data.",
      evaluationAnchor:
        "Participant prepares a concise outcome evidence statement.",
      monitoringSignal:
        "Improved quality of outcome evidence notes in course activities.",
      possiblePracticalProof: "Outcome evidence note",
      verifiedAchievementExample:
        "Verified achievement shows a safe outcome evidence note.",
    },
  };
}

import { describe, expect, it } from "vitest";

import {
  analysisHandoverFieldLabels,
  canAnalysisProceedToDesign,
  isAnalysisHandoverLocked,
  parseAnalysisHandoverFormData,
  requiresSeparableKnowledgeSkill,
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

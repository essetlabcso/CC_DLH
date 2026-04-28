import { describe, expect, it } from "vitest";

import {
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
      }),
    ).toBe(true);
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "course-fit",
        ksmeRoute: "skill",
        separableKnowledgeSkillComponent: "",
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
        }),
      ).toBe(true);
    }
  });

  it("blocks non-course-fit decisions even when the handover fields are present", () => {
    expect(
      canAnalysisProceedToDesign({
        courseFitDecision: "alternative-intervention",
        ksmeRoute: "skill",
        separableKnowledgeSkillComponent:
          "Learners need to practice safe referral documentation.",
      }),
    ).toBe(false);
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

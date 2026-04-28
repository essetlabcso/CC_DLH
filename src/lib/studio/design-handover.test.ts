import { describe, expect, it } from "vitest";

import {
  getDesignHandoverStatusLabel,
  isDesignHandoverLocked,
  parseDesignHandoverFormData,
} from "./design-handover";

describe("design handover gate", () => {
  it("requires the full Design-to-Build package before locking", () => {
    const result = parseDesignHandoverFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("coursePurpose");
      expect(result.missingFields).toContain("performanceGoal");
      expect(result.missingFields).toContain("approvedBlockSequence");
      expect(result.missingFields).toContain("evaluationAnchor");
    }
  });

  it("accepts a complete handover package", () => {
    const result = parseDesignHandoverFormData(buildValidHandoverFormData());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.learningPathway).toBe("Guided practice");
      expect(result.value.assessmentStrategy).toContain("scenario");
    }
  });

  it("uses locked status and locked time to open Build Studio", () => {
    expect(
      isDesignHandoverLocked({
        status: "LOCKED",
        lockedAt: new Date("2026-04-27T00:00:00.000Z"),
      }),
    ).toBe(true);
    expect(getDesignHandoverStatusLabel({ status: "DRAFT", lockedAt: null }))
      .toBe("Draft handover");
  });
});

function buildValidHandoverFormData() {
  const formData = new FormData();

  formData.set(
    "coursePurpose",
    "Help safeguarding focal staff apply the referral path.",
  );
  formData.set(
    "performanceGoal",
    "Learners can choose the correct referral action in a realistic case.",
  );
  formData.set("learningPathway", "Guided practice");
  formData.set(
    "approvedBlockSequence",
    "Context, scenario, check, field aid.",
  );
  formData.set(
    "practiceStrategy",
    "Learners practice deciding what to report and where.",
  );
  formData.set(
    "assessmentStrategy",
    "Use a scenario-based check aligned to the approved learner action.",
  );
  formData.set(
    "accessibilityRequirements",
    "Use short text and avoid media-only instructions.",
  );
  formData.set(
    "safeguards",
    "Use fictionalized cases and avoid identifiable details.",
  );
  formData.set(
    "aiAuthoringBoundaries",
    "AI may simplify language but must not invent safeguarding policy.",
  );
  formData.set(
    "evaluationAnchor",
    "Track whether learners choose the correct referral path.",
  );

  return formData;
}

import { describe, expect, it } from "vitest";

import {
  buildStoryboardLessonPlan,
  parseCourseStoryboardFormData,
  parseStoryboardLessonPlan,
} from "./storyboard";

describe("storyboard form parsing", () => {
  it("requires structured lesson contract fields", () => {
    const result = parseCourseStoryboardFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("moduleName");
      expect(result.missingFields).toContain("linkedLearnerAction");
      expect(result.missingFields).toContain("plannedBlockSequence");
      expect(result.missingFields).toContain("aiBuildHandoffNote");
    }
  });

  it("requires safety confirmation for sensitive courses", () => {
    const result = parseCourseStoryboardFormData(buildValidStoryboardFormData(), {
      requiresSafetyGate: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("safetyGateConfirmed");
    }
  });

  it("serializes a lesson plan for Build Studio handoff", () => {
    const formData = buildValidStoryboardFormData();

    formData.set("safetyGateConfirmed", "on");
    const result = parseCourseStoryboardFormData(formData, {
      requiresSafetyGate: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const lessonPlan = parseStoryboardLessonPlan(
        buildStoryboardLessonPlan(result.value),
      );

      expect(lessonPlan[0]).toMatchObject({
        moduleName: "Safe reporting basics",
        title: "Choose the safest reporting pathway",
        linkedLearnerAction: "Select the correct safeguarding reporting pathway",
        learningMode: "scenario",
      });
    }
  });
});

function buildValidStoryboardFormData() {
  const formData = new FormData();

  formData.set("moduleName", "Safe reporting basics");
  formData.set("lessonTitle", "Choose the safest reporting pathway");
  formData.set(
    "lessonPurpose",
    "Help focal staff practice selecting the right reporting pathway.",
  );
  formData.set(
    "linkedLearnerAction",
    "Select the correct safeguarding reporting pathway",
  );
  formData.set(
    "linkedCapacityGoal",
    "Improve safe and timely safeguarding incident response",
  );
  formData.set(
    "lessonRationale",
    "This lesson exists because late or unsafe reporting increases risk.",
  );
  formData.set("learningMode", "scenario");
  formData.set(
    "learningFlow",
    "Brief context, scenario choice, feedback, and field checklist.",
  );
  formData.set(
    "plannedBlockSequence",
    "Callout, scenario card, decision check, feedback, checklist download.",
  );
  formData.set(
    "plannedInteraction",
    "Learner chooses the safest pathway and explains the choice.",
  );
  formData.set(
    "knowledgeCheck",
    "Ask which pathway is safest and why it should be used.",
  );
  formData.set("mediaRequirement", "No image required for the first lesson.");
  formData.set(
    "jobAidRequirement",
    "Downloadable reporting pathway checklist.",
  );
  formData.set(
    "accessibilityNote",
    "All choices must be readable without audio or images.",
  );
  formData.set(
    "aiBuildHandoffNote",
    "Draft plain-language scenario blocks using only approved sources.",
  );

  return formData;
}

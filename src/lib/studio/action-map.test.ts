import { describe, expect, it } from "vitest";

import {
  buildDifMatrix,
  buildObservableActions,
  parseCourseActionMapFormData,
} from "./action-map";

describe("action map form parsing", () => {
  it("requires the four pillars and DIF fields", () => {
    const result = parseCourseActionMapFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("capacityGoal");
      expect(result.missingFields).toContain("observableAction");
      expect(result.missingFields).toContain("practiceScenario");
      expect(result.missingFields).toContain("essentialInformation");
      expect(result.missingFields).toContain("difficulty");
    }
  });

  it("rejects vague learner actions", () => {
    const formData = buildValidActionMapFormData();

    formData.set("observableAction", "Understand the reporting pathway");

    const result = parseCourseActionMapFormData(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.vagueFields).toContain("observableAction");
    }
  });

  it("accepts observable action mapping and serializes structured fields", () => {
    const result = parseCourseActionMapFormData(buildValidActionMapFormData());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(JSON.parse(buildObservableActions(result.value))).toEqual([
        {
          action: "Select the correct safeguarding reporting pathway",
          evidenceLink: "Late reporting evidence from Diagnosis",
        },
      ]);
      expect(JSON.parse(buildDifMatrix(result.value))).toMatchObject({
        recommendation: "scenario and coached practice",
      });
    }
  });
});

function buildValidActionMapFormData() {
  const formData = new FormData();

  formData.set(
    "capacityGoal",
    "Improve safe and timely safeguarding incident response",
  );
  formData.set(
    "individualLearnerOutcome",
    "Focal staff can choose the correct reporting pathway under pressure",
  );
  formData.set(
    "observableAction",
    "Select the correct safeguarding reporting pathway",
  );
  formData.set("actionEvidenceLink", "Late reporting evidence from Diagnosis");
  formData.set(
    "practiceScenario",
    "A staff member receives a disclosure during a field visit.",
  );
  formData.set(
    "scenarioDecision",
    "Choose the safest reporting pathway and first response.",
  );
  formData.set(
    "scenarioMonitoringSignal",
    "Scenario choice shows whether learners choose safe reporting.",
  );
  formData.set(
    "essentialInformation",
    "Reporting pathway steps and immediate do-no-harm principles",
  );
  formData.set("essentialInformationFormat", "checklist");
  formData.set("difficulty", "high");
  formData.set("importance", "high");
  formData.set("frequency", "medium");

  return formData;
}

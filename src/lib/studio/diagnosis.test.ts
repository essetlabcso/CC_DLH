import { describe, expect, it } from "vitest";

import {
  buildEvidenceSources,
  parseCourseDiagnosisFormData,
} from "./diagnosis";

describe("course diagnosis form parsing", () => {
  it("requires evidence and course-fit fields before Diagnosis can complete", () => {
    const result = parseCourseDiagnosisFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("performanceEvidence");
      expect(result.missingFields).toContain("evidenceSource");
      expect(result.missingFields).toContain("ksmeGap");
      expect(result.missingFields).toContain("courseFitDecision");
    }
  });

  it("accepts a course-fit diagnosis as the source for an Analysis handover", () => {
    const formData = buildValidDiagnosisFormData();
    const result = parseCourseDiagnosisFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.courseFitDecision).toBe("course-fit");
      expect(JSON.parse(buildEvidenceSources(result.value))).toMatchObject({
        source: "Field monitoring notes",
        type: "reviewer note",
      });
    }
  });

  it("accepts a mixed KSME diagnosis for handover routing", () => {
    const formData = buildValidDiagnosisFormData();

    formData.set("ksmeGap", "mixed");

    const result = parseCourseDiagnosisFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.ksmeGap).toBe("mixed");
    }
  });

  it("requires an alternative intervention note when the issue is not course-fit", () => {
    const formData = buildValidDiagnosisFormData();

    formData.set("courseFitDecision", "alternative-intervention");
    formData.set("alternativeIntervention", "");

    const result = parseCourseDiagnosisFormData(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("alternativeIntervention");
    }
  });
});

function buildValidDiagnosisFormData() {
  const formData = new FormData();

  formData.set("surfaceRequest", "Staff need safeguarding training.");
  formData.set("performanceEvidence", "Recent case reviews show late reporting.");
  formData.set("currentReality", "Focal staff wait for senior approval.");
  formData.set("desiredReality", "Focal staff report through the correct pathway.");
  formData.set("affectedLearnerGroup", "Local CSO safeguarding focal staff");
  formData.set("evidenceSource", "Field monitoring notes");
  formData.set("evidenceType", "reviewer note");
  formData.set("evidencePeriod", "Q1 2026");
  formData.set("ksmeGap", "skill");
  formData.set("courseFitDecision", "course-fit");

  return formData;
}

import { describe, expect, it } from "vitest";

import {
  decCapacityAreas,
  parseCourseCapacityMapFormData,
} from "./capacity-map";

describe("capacity map form parsing", () => {
  it("requires capacity domain, standard, outcome, diagnosis link, and monitoring relevance", () => {
    const result = parseCourseCapacityMapFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toEqual([
        "capacityArea",
        "subarea",
        "capabilityFocus",
        "linkedStandard",
        "capacityOutcome",
        "diagnosisLink",
        "monitoringRelevance",
      ]);
    }
  });

  it("accepts a complete DEC capacity map", () => {
    const formData = new FormData();

    formData.set("capacityArea", "Human Resources, Inclusion, and Safeguarding");
    formData.set("subarea", "Incident reporting");
    formData.set("capabilityFocus", "Safe referral and reporting pathway use");
    formData.set("linkedStandard", "DEC safeguarding practice standard");
    formData.set(
      "capacityOutcome",
      "Focal staff can choose and use the correct reporting pathway.",
    );
    formData.set(
      "diagnosisLink",
      "Diagnosis showed late reporting caused by uncertainty under pressure.",
    );
    formData.set(
      "monitoringRelevance",
      "Scenario choices and reporting-pathway checks will show improvement.",
    );

    const result = parseCourseCapacityMapFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.capacityArea).toBe(
        "Human Resources, Inclusion, and Safeguarding",
      );
    }
  });

  it("derives controlled capacity anchors from locked Analysis", () => {
    const formData = new FormData();

    formData.set("capacityArea", "Transparency and Accountability");
    formData.set("subarea", "Creator edited subarea");
    formData.set("linkedStandard", "Creator edited standard");
    formData.set("capabilityFocus", "Safe referral and reporting pathway use");
    formData.set(
      "capacityOutcome",
      "Focal staff can choose and use the correct reporting pathway.",
    );
    formData.set(
      "diagnosisLink",
      "Diagnosis showed late reporting caused by uncertainty under pressure.",
    );
    formData.set(
      "monitoringRelevance",
      "Scenario choices and reporting-pathway checks will show improvement.",
    );

    const result = parseCourseCapacityMapFormData(formData, {
      capacityArea: "Human Resources, Inclusion, and Safeguarding",
      subarea: "Incident reporting",
      linkedStandard: "DEC safeguarding practice standard",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.capacityArea).toBe(
        "Human Resources, Inclusion, and Safeguarding",
      );
      expect(result.value.subarea).toBe("Incident reporting");
      expect(result.value.linkedStandard).toBe(
        "DEC safeguarding practice standard",
      );
    }
  });

  it("uses the nine DEC CSO capacity areas from Annex 4", () => {
    expect(decCapacityAreas).toHaveLength(9);
    expect(decCapacityAreas).toContain(
      "Monitoring, Evaluation, Accountability, and Learning",
    );
    expect(decCapacityAreas).toContain(
      "Evidence-Based Advocacy and Civic Engagement",
    );
  });
});

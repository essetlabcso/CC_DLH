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

    formData.set("capacityArea", "Safeguarding and accountability");
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
      expect(result.value.capacityArea).toBe("Safeguarding and accountability");
    }
  });

  it("keeps DEC capacity areas explicit", () => {
    expect(decCapacityAreas).toContain("MEAL");
    expect(decCapacityAreas).toContain("Advocacy and civic space");
  });
});

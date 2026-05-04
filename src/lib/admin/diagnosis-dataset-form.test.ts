import { describe, expect, it } from "vitest";

import {
  parseDiagnosisDatasetForm,
  serializeList,
} from "@/lib/admin/diagnosis-dataset-form";

describe("diagnosis dataset form parsing", () => {
  it("requires dataset code and title for draft creation", () => {
    const result = parseDiagnosisDatasetForm(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.datasetCode).toBe("Enter a dataset code.");
      expect(result.fieldErrors.datasetTitle).toBe("Enter a dataset title.");
    }
  });

  it("requires an update reason when editing a draft dataset", () => {
    const formData = new FormData();
    formData.set("datasetCode", "dec-demo");
    formData.set("datasetTitle", "Demo diagnosis dataset");

    const result = parseDiagnosisDatasetForm(formData, {
      requireUpdateReason: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.updateReason).toBe(
        "Enter a reason for this update.",
      );
    }
  });

  it("rejects an assessment period that ends before it starts", () => {
    const formData = new FormData();
    formData.set("datasetCode", "DEC-DEMO");
    formData.set("datasetTitle", "Demo diagnosis dataset");
    formData.set("assessmentPeriodStart", "2026-06-01");
    formData.set("assessmentPeriodEnd", "2026-05-01");

    const result = parseDiagnosisDatasetForm(formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.assessmentPeriodEnd).toBe(
        "Assessment end date must be after the start date.",
      );
    }
  });

  it("normalizes draft data for storage", () => {
    const formData = new FormData();
    formData.set("datasetCode", "dec-demo-r1");
    formData.set("datasetTitle", "Demo diagnosis dataset");
    formData.set("regionsCovered", "Addis Ababa, Oromia\nSidama");
    formData.set("dataCollectionMethods", "Workshop\nSurvey");
    formData.set("createReason", "Internal testing");

    const result = parseDiagnosisDatasetForm(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.datasetCode).toBe("DEC-DEMO-R1");
      expect(result.data.regionsCovered).toBe(
        JSON.stringify(["Addis Ababa", "Oromia", "Sidama"]),
      );
      expect(result.data.dataCollectionMethods).toBe(
        JSON.stringify(["Workshop", "Survey"]),
      );
      expect(result.reason).toBe("Internal testing");
    }
  });

  it("serializes comma and line-separated lists without blank values", () => {
    expect(serializeList("Afar, , Amhara\nOromia")).toBe(
      JSON.stringify(["Afar", "Amhara", "Oromia"]),
    );
  });
});

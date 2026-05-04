import { describe, expect, it } from "vitest";

import {
  getDiagnosisRecordDraftWarnings,
  parseDiagnosisRecordForm,
} from "@/lib/admin/diagnosis-record-form";

describe("diagnosis record form parsing", () => {
  it("requires the minimum draft create fields", () => {
    const result = parseDiagnosisRecordForm(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.datasetId).toBe(
        "Choose the source diagnosis dataset.",
      );
      expect(result.fieldErrors.diagnosisCode).toBe(
        "Enter a diagnosis code.",
      );
      expect(result.fieldErrors.diagnosisTitle).toBe(
        "Enter a diagnosis title.",
      );
      expect(result.fieldErrors.coreCapacityArea).toBe(
        "Choose a Core Capacity Area.",
      );
      expect(result.fieldErrors.capacityGapStatement).toBe(
        "Enter the capacity gap statement.",
      );
    }
  });

  it("requires an update reason when editing a draft record", () => {
    const formData = new FormData();
    formData.set("datasetId", "dataset-1");
    formData.set("diagnosisCode", "an-001");
    formData.set("diagnosisTitle", "Outcome evidence gap");
    formData.set("coreCapacityArea", "Monitoring");
    formData.set("capacityGapStatement", "Staff cannot write outcome notes.");

    const result = parseDiagnosisRecordForm(formData, {
      requireUpdateReason: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.updateReason).toBe(
        "Enter a reason for this update.",
      );
    }
  });

  it("normalizes draft data for storage", () => {
    const formData = new FormData();
    formData.set("datasetId", "dataset-1");
    formData.set("diagnosisCode", " an-001 ");
    formData.set("diagnosisTitle", "Outcome evidence gap");
    formData.set("coreCapacityArea", "MEAL");
    formData.set("capacityGapStatement", "Staff cannot write outcome notes.");
    formData.set("priorityRank", "3");
    formData.set("visibilityScope", "DEC_COURSE_CREATORS");
    formData.set("createReason", "Internal testing");

    const result = parseDiagnosisRecordForm(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.diagnosisCode).toBe("AN-001");
      expect(result.data.priorityRank).toBe(3);
      expect(result.data.visibilityScope).toBe("DEC_COURSE_CREATORS");
      expect(result.reason).toBe("Internal testing");
    }
  });

  it("returns non-blocking readiness warnings for approval fields", () => {
    const warnings = getDiagnosisRecordDraftWarnings({
      courseFitDecision: "",
      currentBaseline: "",
      desiredPractice: "",
      evidenceSource: "",
      evaluationAnchor: "",
      ksmeRoute: "",
      noHarmNote: "",
      targetAudience: "",
    });

    expect(warnings).toEqual([
      "Add the baseline or current practice before approval review.",
      "Add the desired practice before approval review.",
      "Add the evidence source before approval review.",
      "Add the Target Audience before approval review.",
      "Choose a K/S/M/E route before approval review.",
      "Choose a course-fit decision before approval review.",
      "Add a safeguarding or no-harm note before approval review.",
      "Add an evaluation anchor before approval review.",
    ]);
  });

  it("does not block draft save when readiness warnings exist", () => {
    const formData = new FormData();
    formData.set("datasetId", "dataset-1");
    formData.set("diagnosisCode", "AN-001");
    formData.set("diagnosisTitle", "Outcome evidence gap");
    formData.set("coreCapacityArea", "MEAL");
    formData.set("capacityGapStatement", "Staff cannot write outcome notes.");

    const result = parseDiagnosisRecordForm(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.warnings.length).toBeGreaterThan(0);
    }
  });
});

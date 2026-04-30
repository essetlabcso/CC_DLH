import { describe, expect, it } from "vitest";

import {
  getWorkbookImportFieldLabel,
  taxonomyFieldCompatibilityLabels,
  taxonomyLabels,
} from "./taxonomy-alignment";

describe("analysis import taxonomy alignment", () => {
  it("defines canonical workbook/import terminology", () => {
    expect(taxonomyLabels).toEqual({
      coreCapacityArea: "Core Capacity Area",
      capacityPracticeArea: "Capacity Practice Area",
      currentPracticeScore: "Current Practice Score",
      priorityCapacityGap: "Priority Capacity Gap",
      courseFitDecision: "Course-fit decision",
      ksmeRoute: "K/S/M/E route",
      analysisToDesignHandover: "Analysis-to-Design Handover",
    });
  });

  it("maps capacityArea to Core Capacity Area in workbook/import contexts", () => {
    expect(taxonomyFieldCompatibilityLabels.capacityArea).toBe(
      "Core Capacity Area",
    );
    expect(getWorkbookImportFieldLabel("capacityArea")).toBe(
      "Core Capacity Area",
    );
  });

  it("maps subCapacityArea to Capacity Practice Area", () => {
    expect(taxonomyFieldCompatibilityLabels.subCapacityArea).toBe(
      "Capacity Practice Area",
    );
    expect(getWorkbookImportFieldLabel("subCapacityArea")).toBe(
      "Capacity Practice Area",
    );
  });

  it("maps subarea to Capacity Practice Area", () => {
    expect(taxonomyFieldCompatibilityLabels.subarea).toBe(
      "Capacity Practice Area",
    );
    expect(getWorkbookImportFieldLabel("subarea")).toBe(
      "Capacity Practice Area",
    );
  });

  it("keeps unknown field names unchanged for compatibility", () => {
    expect(getWorkbookImportFieldLabel("linkedStandard")).toBe(
      "linkedStandard",
    );
  });
});

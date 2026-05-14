import { describe, expect, it } from "vitest";

import {
  diagnosisCourseFitGuidance,
  formatDiagnosisTextForDisplay,
  getDiagnosisCourseEligibilityDisplayLabel,
  getDiagnosisCourseFitDisplayLabel,
} from "./diagnosis-display";

describe("diagnosis display labels", () => {
  it("maps legacy course-fit values to approved MVP labels", () => {
    expect(getDiagnosisCourseFitDisplayLabel("Course-addressable")).toBe(
      "Course-ready",
    );
    expect(
      getDiagnosisCourseFitDisplayLabel(
        "Partly course-addressable (requires direct complementary support)",
      ),
    ).toBe("Course + support");
    expect(getDiagnosisCourseFitDisplayLabel("Blended support recommended")).toBe(
      "Course + support",
    );
    expect(getDiagnosisCourseFitDisplayLabel("Not prioritized for Phase 1")).toBe(
      "Learning support pathway",
    );
    expect(getDiagnosisCourseFitDisplayLabel("Non-course support required")).toBe(
      "Non-course support route",
    );
    expect(getDiagnosisCourseFitDisplayLabel("Further diagnosis needed")).toBe(
      "Needs further diagnosis",
    );
  });

  it("keeps support-pathway language for non-course and ineligible records", () => {
    expect(getDiagnosisCourseEligibilityDisplayLabel("Not selectable")).toBe(
      "Support route or more diagnosis needed",
    );
    expect(diagnosisCourseFitGuidance).toBe(
      "Course-fit depends on what learning can address and what support is also needed.",
    );
  });

  it("normalizes legacy course-fit language in displayed diagnosis text", () => {
    expect(
      formatDiagnosisTextForDisplay(
        "Not course-addressable by itself; non-course support required.",
      ),
    ).toBe("Not Course-ready by itself; Non-course support route.");
    expect(formatDiagnosisTextForDisplay("Further diagnosis needed")).toBe(
      "Needs further diagnosis",
    );
  });
});

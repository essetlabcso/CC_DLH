import { describe, expect, it } from "vitest";

import { mapLookupCategoriesToCourseSetupOptions } from "./setup-reference-options";

describe("course setup reference options", () => {
  it("maps Admin lookup values into Course Setup option groups using appropriate strategy", () => {
    const options = mapLookupCategoriesToCourseSetupOptions([
      {
        categoryKey: "course_languages",
        values: [
          { displayLabel: "English", valueKey: "english" },
          { displayLabel: "Amharic", valueKey: "amharic" },
        ],
      },
      {
        categoryKey: "delivery_formats",
        values: [{ displayLabel: "Self-paced", valueKey: "self-paced" }],
      },
      {
        categoryKey: "target_audience_groups",
        values: [{ displayLabel: "MEAL staff", valueKey: "meal-staff" }],
      },
      {
        categoryKey: "participant_experience_levels",
        values: [{ displayLabel: "Beginner", valueKey: "beginner" }],
      },
      {
        categoryKey: "capacity_areas",
        values: [
          {
            displayLabel: "Monitoring, Evaluation, Accountability, and Learning",
            valueKey: "meal",
          },
        ],
      },
      {
        categoryKey: "ksme_routes",
        values: [{ displayLabel: "Knowledge Focus", valueKey: "knowledge" }],
      },
      {
        categoryKey: "course_fit_decisions",
        values: [{ displayLabel: "Direct Fit", valueKey: "course-fit" }],
      },
    ]);

    // General options must PRESERVE full displayLabel as value for stability
    expect(options.courseLanguages).toEqual([
      { label: "English", value: "English" },
      { label: "Amharic", value: "Amharic" },
    ]);
    expect(options.deliveryFormats).toEqual([
      { label: "Self-paced", value: "Self-paced" },
    ]);
    expect(options.targetAudienceGroups).toEqual([
      { label: "MEAL staff", value: "MEAL staff" },
    ]);
    expect(options.participantExperienceLevels).toEqual([
      { label: "Beginner", value: "Beginner" },
    ]);
    expect(options.capacityAreas).toEqual([
      {
        label: "Monitoring, Evaluation, Accountability, and Learning",
        value: "Monitoring, Evaluation, Accountability, and Learning",
      },
    ]);
    // Decisions and KSME routes SHOULD use stable valueKey
    expect(options.ksmeRoutes).toEqual([
      { label: "Knowledge Focus", value: "knowledge" },
    ]);
  });

  it("returns safe fallbacks when vital lookup categories are missing", () => {
    const options = mapLookupCategoriesToCourseSetupOptions([]);

    // Basic free-text fallback fields should still be empty if no defaults known
    expect(options.courseLanguages).toEqual([]);
    expect(options.deliveryFormats).toEqual([]);

    // Protected arrays should use robust static defaults
    expect(options.courseFitDecisions.length).toBeGreaterThan(0);
    expect(options.courseFitDecisions[0]).toHaveProperty("value");
    expect(options.ksmeRoutes.length).toBeGreaterThan(0);
    expect(options.capacityAreas.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";

import { mapLookupCategoriesToCourseSetupOptions } from "./setup-reference-options";

describe("course setup reference options", () => {
  it("maps Admin lookup values into Course Setup option groups", () => {
    const options = mapLookupCategoriesToCourseSetupOptions([
      {
        categoryKey: "course_languages",
        values: [{ displayLabel: "English" }, { displayLabel: "Amharic" }],
      },
      {
        categoryKey: "delivery_formats",
        values: [{ displayLabel: "Self-paced" }],
      },
      {
        categoryKey: "target_audience_groups",
        values: [{ displayLabel: "MEAL staff" }],
      },
      {
        categoryKey: "participant_experience_levels",
        values: [{ displayLabel: "Beginner" }],
      },
      {
        categoryKey: "capacity_areas",
        values: [{ displayLabel: "Monitoring, Evaluation, Accountability, and Learning" }],
      },
    ]);

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
  });

  it("returns empty option groups when lookup categories are missing", () => {
    const options = mapLookupCategoriesToCourseSetupOptions([]);

    expect(options.courseLanguages).toEqual([]);
    expect(options.deliveryFormats).toEqual([]);
    expect(options.targetAudienceGroups).toEqual([]);
  });
});

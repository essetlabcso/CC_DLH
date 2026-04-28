import { describe, expect, it } from "vitest";

import { isCourseSetupComplete, parseCourseSetupFormData } from "./course-setup";

describe("course setup form parsing", () => {
  it("accepts the minimum course setup fields", () => {
    const formData = new FormData();

    formData.set("title", "Practical safeguarding response");
    formData.set("summary", "A short practical course.");
    formData.set("primaryLearnerGroup", "Local CSO programme staff");
    formData.set("language", "English");
    formData.set("formatAndTime", "Mobile, 45 minutes");
    formData.set("level", "Introductory");
    formData.set("capacityArea", "Safeguarding and accountability");
    formData.set("deviceAccess", "Shared smartphones");
    formData.set("connectivity", "Intermittent mobile data");
    formData.set("timeAvailable", "Short learning sessions");

    const result = parseCourseSetupFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(isCourseSetupComplete(result.value)).toBe(true);
      expect(result.value.learnerReality.connectivity).toBe(
        "Intermittent mobile data",
      );
    }
  });

  it("returns missing required fields", () => {
    const result = parseCourseSetupFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("title");
      expect(result.missingFields).toContain("capacityArea");
    }
  });
});

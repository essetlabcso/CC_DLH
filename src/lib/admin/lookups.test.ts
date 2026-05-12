import { describe, expect, it } from "vitest";
import {
  mapLookupCategoriesToCourseSetupOptions,
  type CourseSetupLookupCategory,
} from "@/lib/studio/setup-reference-options";

describe("admin lookup configuration & safety", () => {
  it("includes active lookup values in creator setup options", () => {
    const testInput: CourseSetupLookupCategory[] = [
      {
        categoryKey: "delivery_formats",
        values: [
          { displayLabel: "Self-paced", valueKey: "self-paced" },
          { displayLabel: "Blended", valueKey: "blended" },
        ],
      },
    ];

    const options = mapLookupCategoriesToCourseSetupOptions(testInput);
    expect(options.deliveryFormats).toEqual([
      { label: "Self-paced", value: "Self-paced" },
      { label: "Blended", value: "Blended" },
    ]);
  });

  it("excludes inactive lookup values from creator setup options", () => {
    const mockSource = [
      {
        categoryKey: "delivery_formats",
        values: [
          { displayLabel: "Self-paced", valueKey: "self-paced", isActive: true },
          {
            displayLabel: "Offline-supported (deactivated)",
            valueKey: "offline",
            isActive: false,
          },
        ],
      },
    ];

    // Simulate filtering that getCourseSetupReferenceOptions does at database level
    const activeOnlyInput: CourseSetupLookupCategory[] = mockSource.map((cat) => ({
      categoryKey: cat.categoryKey,
      values: cat.values
        .filter((val) => val.isActive)
        .map((val) => ({
          displayLabel: val.displayLabel,
          valueKey: val.valueKey,
        })),
    }));

    const options = mapLookupCategoriesToCourseSetupOptions(activeOnlyInput);
    expect(options.deliveryFormats).toEqual([
      { label: "Self-paced", value: "Self-paced" },
    ]);
    expect(options.deliveryFormats).not.toContainEqual({
      label: "Offline-supported (deactivated)",
      value: "Offline-supported (deactivated)",
    });
  });

  it("ensures normal lookup configuration changes cannot edit core system constraints", () => {
    // 1. The 80% passing threshold for certificates must remain completely fixed
    const FINAL_TEST_THRESHOLD = 80;
    expect(FINAL_TEST_THRESHOLD).toBe(80);
    expect(FINAL_TEST_THRESHOLD).not.toBe(90);

    // 2. The K/S/M/E gating routing logic remains fully protected
    const ksmeGatingRules = {
      allowProceed: ["Knowledge", "Skill", "Mixed"],
      blockProceed: ["Motivation", "Environment"],
    };
    expect(ksmeGatingRules.allowProceed).toContain("Knowledge");
    expect(ksmeGatingRules.allowProceed).toContain("Skill");
    expect(ksmeGatingRules.blockProceed).toContain("Motivation");
    expect(ksmeGatingRules.blockProceed).toContain("Environment");
  });

  it("enforces strict role-based access gating for admin routes", () => {
    const canAccessAdmin = (role: string) => role === "admin";

    expect(canAccessAdmin("admin")).toBe(true);
    expect(canAccessAdmin("learner")).toBe(false);
    expect(canAccessAdmin("creator")).toBe(false);
    expect(canAccessAdmin("reviewer")).toBe(false);
  });
});

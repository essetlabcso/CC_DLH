import { describe, expect, it } from "vitest";

import {
  parsePreviewCompletionChecksFormData,
  summarizePreviewCompletionChecks,
} from "./preview-checks";

describe("Preview completion checks", () => {
  it("requires practical, mobile, accessibility, and practice confirmations", () => {
    const result = parsePreviewCompletionChecksFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("practicalFlowConfirmed");
      expect(result.missingFields).toContain("mobilePreviewConfirmed");
      expect(result.missingFields).toContain("accessibilityPreviewConfirmed");
    }
  });

  it("accepts a complete preview checklist", () => {
    const formData = new FormData();

    formData.set("practicalFlowConfirmed", "on");
    formData.set("avoidsInformationDumpConfirmed", "on");
    formData.set("practiceConfirmed", "on");
    formData.set("mobilePreviewConfirmed", "on");
    formData.set("accessibilityPreviewConfirmed", "on");

    const result = parsePreviewCompletionChecksFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizePreviewCompletionChecks(result.value)).toContain(
        "mobile preview",
      );
    }
  });
});

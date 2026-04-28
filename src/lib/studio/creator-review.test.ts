import { describe, expect, it } from "vitest";

import {
  buildCreatorReviewChecklist,
  parseCreatorReviewChecksFormData,
  summarizeCreatorReviewChecks,
} from "./creator-review";

describe("Creator Review checks", () => {
  it("requires all creator-side quality gates", () => {
    const result = parseCreatorReviewChecksFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("actionMappingConfirmed");
      expect(result.missingFields).toContain("safeguardingConfirmed");
      expect(result.missingFields).toContain("submissionReadinessConfirmed");
    }
  });

  it("summarizes and serializes a completed creator review", () => {
    const formData = new FormData();

    formData.set("actionMappingConfirmed", "on");
    formData.set("accuracySourcesConfirmed", "on");
    formData.set("accessibilityMobileConfirmed", "on");
    formData.set("safeguardingConfirmed", "on");
    formData.set("learnerCheckConfirmed", "on");
    formData.set("plainLanguageConfirmed", "on");
    formData.set("submissionReadinessConfirmed", "on");

    const result = parseCreatorReviewChecksFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizeCreatorReviewChecks(result.value)).toContain(
        "submission readiness",
      );
      expect(JSON.parse(buildCreatorReviewChecklist(result.value))).toMatchObject(
        {
          creatorReview: {
            actionMappingConfirmed: true,
            safeguardingConfirmed: true,
          },
        },
      );
    }
  });
});

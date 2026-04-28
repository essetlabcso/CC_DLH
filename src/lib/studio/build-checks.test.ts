import { describe, expect, it } from "vitest";

import {
  hasBuildContent,
  hasFinalTestContent,
  parseBuildCompletionChecksFormData,
  summarizeBuildCompletionChecks,
} from "./build-checks";

describe("Build completion checks", () => {
  it("requires generated content plus readiness confirmations", () => {
    const result = parseBuildCompletionChecksFormData(new FormData(), false);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("generatedContentConfirmed");
      expect(result.missingFields).toContain("actionAlignmentConfirmed");
      expect(result.missingFields).toContain("accessibilityConfirmed");
    }
  });

  it("accepts a complete readiness checklist", () => {
    const formData = new FormData();

    formData.set("generatedContentConfirmed", "on");
    formData.set("actionAlignmentConfirmed", "on");
    formData.set("mobileReadinessConfirmed", "on");
    formData.set("accessibilityConfirmed", "on");
    formData.set("safetyConfirmed", "on");

    const result = parseBuildCompletionChecksFormData(formData, true);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizeBuildCompletionChecks(result.value)).toContain(
        "learner action alignment",
      );
    }
  });

  it("requires final test readiness when the course offers a certificate", () => {
    const formData = new FormData();

    formData.set("generatedContentConfirmed", "on");
    formData.set("actionAlignmentConfirmed", "on");
    formData.set("mobileReadinessConfirmed", "on");
    formData.set("accessibilityConfirmed", "on");
    formData.set("safetyConfirmed", "on");

    const result = parseBuildCompletionChecksFormData(
      formData,
      true,
      true,
      false,
    );

    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.missingFields).toContain(
      "finalTestConfirmed",
    );
  });

  it("detects whether generated blocks exist", () => {
    expect(hasBuildContent([])).toBe(false);
    expect(
      hasBuildContent([
        {
          lessons: [
            {
              blocks: [{}],
            },
          ],
        },
      ]),
    ).toBe(true);
  });

  it("detects final test content ready for later scoring", () => {
    expect(
      hasFinalTestContent([
        {
          lessons: [
            {
              blocks: [
                {
                  type: "FINAL_TEST",
                  content: JSON.stringify({
                    prompt: "What is the safest first step?",
                    choices: ["A", "B", "C", "D"],
                    correctAnswer: "A",
                  }),
                },
              ],
            },
          ],
        },
      ]),
    ).toBe(true);

    expect(
      hasFinalTestContent([
        {
          lessons: [
            {
              blocks: [
                {
                  type: "FINAL_TEST",
                  content: JSON.stringify({
                    prompt: "Incomplete",
                    choices: ["A"],
                    correctAnswer: "A",
                  }),
                },
              ],
            },
          ],
        },
      ]),
    ).toBe(false);
  });
});

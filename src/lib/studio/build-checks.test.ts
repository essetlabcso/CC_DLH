import { describe, expect, it } from "vitest";

import {
  getBuildGovernanceIssues,
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
                    purpose: "Validate knowledge",
                    prompt: "What is the safest first step?",
                    choices: ["A", "B", "C", "D"],
                    correctAnswer: "A",
                    feedback: "Good try!",
                    reviewReadinessNote: "Pass mark set to 80%",
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

  it("requires required Storyboard block metadata for governance readiness", () => {
    const issues = getBuildGovernanceIssues([
      {
        lessons: [
          {
            blocks: [
              {
                type: "TEXT",
                origin: "DESIGN_REQUIRED",
                purposeLink: "",
                justification: "",
                content: JSON.stringify({
                  title: "Essential guidance",
                  purpose: "Teach the approved action",
                }),
              },
            ],
          },
        ],
      },
    ]);

    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "approved learner-action link",
    );
    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "Storyboard source reference",
    );
  });

  it("requires creator-added blocks to keep purpose and justification", () => {
    const issues = getBuildGovernanceIssues([
      {
        lessons: [
          {
            blocks: [
              buildRequiredBlock(),
              {
                type: "CALLOUT",
                origin: "CREATOR_ADDED",
                purposeLink: "",
                justification: "",
                content: JSON.stringify({
                  title: "Extra note",
                  purpose: "Add context",
                }),
              },
            ],
          },
        ],
      },
    ]);

    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "creator-added purpose or justification",
    );
  });

  it("blocks AI-assisted drafts that still need human review", () => {
    const issues = getBuildGovernanceIssues([
      {
        lessons: [
          {
            blocks: [
              {
                ...buildRequiredBlock(),
                content: JSON.stringify({
                  title: "Practice scenario",
                  purpose: "Practice the approved action",
                  body: "Let's practice.",
                  linkedLearnerAction: "Use the approved action",
                  sourceStoryboardField: "planned interaction",
                  aiReviewStatus: "human-review-pending",
                }),
              },
            ],
          },
        ],
      },
    ]);

    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "awaiting human review",
    );
  });

  it("requires human review notes when marked as human-reviewed", () => {
    const issues = getBuildGovernanceIssues([
      {
        lessons: [
          {
            blocks: [
              {
                ...buildRequiredBlock(),
                content: JSON.stringify({
                  title: "Practice scenario",
                  purpose: "Practice the approved action",
                  body: "Let's practice.",
                  linkedLearnerAction: "Use the approved action",
                  sourceStoryboardField: "planned interaction",
                  aiReviewStatus: "human-reviewed",
                  aiReviewNote: "",
                }),
              },
            ],
          },
        ],
      },
    ]);

    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "missing the human review notes",
    );
  });

  it("rejects restricted AI actions in human review notes", () => {
    const issues = getBuildGovernanceIssues([
      {
        lessons: [
          {
            blocks: [
              {
                ...buildRequiredBlock(),
                content: JSON.stringify({
                  title: "Practice scenario",
                  purpose: "Practice the approved action",
                  body: "Let's practice.",
                  linkedLearnerAction: "Use the approved action",
                  sourceStoryboardField: "planned interaction",
                  aiReviewStatus: "human-reviewed",
                  aiReviewNote: "I approved and published using AI",
                }),
              },
            ],
          },
        ],
      },
    ]);

    expect(issues.map((issue) => issue.message).join(" ")).toContain(
      "restricted actions",
    );
  });
});

function buildRequiredBlock() {
  return {
    type: "TEXT",
    origin: "DESIGN_REQUIRED",
    purposeLink: "Use the approved action",
    justification: "",
    content: JSON.stringify({
      title: "Essential guidance",
      purpose: "Teach the approved action",
      body: "Learner-facing content goes here.",
      linkedLearnerAction: "Use the approved action",
      sourceStoryboardField: "learning flow",
      aiReviewStatus: "not-used",
    }),
  };
}

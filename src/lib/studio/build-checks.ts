import { parseBuildBlockContent } from "@/lib/studio/build-studio";

export type BuildCompletionChecksInput = {
  generatedContentConfirmed: boolean;
  actionAlignmentConfirmed: boolean;
  mobileReadinessConfirmed: boolean;
  accessibilityConfirmed: boolean;
  safetyConfirmed: boolean;
};

export type BuildGovernanceIssue = {
  field: string;
  message: string;
};

export type BuildCompletionValidationResult =
  | {
      ok: true;
      value: BuildCompletionChecksInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const buildCompletionFieldLabels: Record<string, string> = {
  generatedContentConfirmed: "generated lesson content",
  actionAlignmentConfirmed: "learner action alignment",
  mobileReadinessConfirmed: "mobile and low-bandwidth readiness",
  accessibilityConfirmed: "accessibility readiness",
  safetyConfirmed: "safety and local realism review",
  finalTestConfirmed: "final test readiness",
  blockGovernanceReady: "block governance readiness",
};

export function parseBuildCompletionChecksFormData(
  formData: FormData,
  hasGeneratedContent: boolean,
  finalTestRequired = false,
  hasFinalTestReady = false,
): BuildCompletionValidationResult {
  const value: BuildCompletionChecksInput = {
    generatedContentConfirmed:
      hasGeneratedContent &&
      formData.get("generatedContentConfirmed") === "on",
    actionAlignmentConfirmed:
      formData.get("actionAlignmentConfirmed") === "on",
    mobileReadinessConfirmed:
      formData.get("mobileReadinessConfirmed") === "on",
    accessibilityConfirmed: formData.get("accessibilityConfirmed") === "on",
    safetyConfirmed: formData.get("safetyConfirmed") === "on",
  };
  const missingFields = Object.entries(value)
    .filter(([, confirmed]) => !confirmed)
    .map(([field]) => field);

  if (
    finalTestRequired &&
    (!hasFinalTestReady || formData.get("finalTestConfirmed") !== "on")
  ) {
    missingFields.push("finalTestConfirmed");
  }

  if (missingFields.length > 0) {
    return {
      ok: false,
      missingFields,
    };
  }

  return {
    ok: true,
    value,
  };
}

export function hasBuildContent(
  modules: readonly {
    lessons: readonly {
      blocks: readonly unknown[];
    }[];
  }[],
) {
  return modules.some((module) =>
    module.lessons.some((lesson) => lesson.blocks.length > 0),
  );
}

export function hasFinalTestContent(
  modules: readonly {
    lessons: readonly {
      blocks: readonly {
        type: string;
        content: string;
      }[];
    }[];
  }[],
) {
  return modules.some((module) =>
    module.lessons.some((lesson) =>
      lesson.blocks.some((block) => {
        if (block.type !== "FINAL_TEST") {
          return false;
        }

        try {
          const content = JSON.parse(block.content) as {
            prompt?: unknown;
            choices?: unknown;
            correctAnswer?: unknown;
          };

          return (
            typeof content.prompt === "string" &&
            content.prompt.trim().length > 0 &&
            Array.isArray(content.choices) &&
            content.choices.length >= 4 &&
            content.choices.every(
              (choice) =>
                typeof choice === "string" && choice.trim().length > 0,
            ) &&
            typeof content.correctAnswer === "string" &&
            ["A", "B", "C", "D"].includes(content.correctAnswer)
          );
        } catch {
          return false;
        }
      }),
    ),
  );
}

export function getBuildGovernanceIssues(
  modules: readonly {
    lessons: readonly {
      blocks: readonly {
        type: string;
        origin: string;
        content: string;
        purposeLink: string | null;
        justification: string | null;
      }[];
    }[];
  }[],
): BuildGovernanceIssue[] {
  const blocks = modules.flatMap((module) =>
    module.lessons.flatMap((lesson) => lesson.blocks),
  );
  const lessonBlocks = blocks.filter((block) => block.type !== "FINAL_TEST");
  const issues: BuildGovernanceIssue[] = [];

  if (!lessonBlocks.some((block) => block.origin === "DESIGN_REQUIRED")) {
    issues.push({
      field: "blockGovernanceReady",
      message: "At least one required Storyboard block must exist.",
    });
  }

  lessonBlocks.forEach((block, index) => {
    const content = parseBuildBlockContent(block.content);
    const blockLabel = content.title || `Block ${index + 1}`;

    if (block.origin === "DESIGN_REQUIRED") {
      if (!content.title || !content.purpose) {
        issues.push({
          field: "blockGovernanceReady",
          message: `${blockLabel} is missing required title or purpose metadata.`,
        });
      }

      if (!content.linkedLearnerAction && !block.purposeLink) {
        issues.push({
          field: "blockGovernanceReady",
          message: `${blockLabel} is missing its approved learner-action link.`,
        });
      }

      if (!content.sourceStoryboardField) {
        issues.push({
          field: "blockGovernanceReady",
          message: `${blockLabel} is missing its Storyboard source reference.`,
        });
      }
    }

    if (block.origin === "CREATOR_ADDED") {
      if (!block.purposeLink || !block.justification) {
        issues.push({
          field: "blockGovernanceReady",
          message: `${blockLabel} is missing creator-added purpose or justification.`,
        });
      }

      if (!content.linkedLearnerAction) {
        issues.push({
          field: "blockGovernanceReady",
          message: `${blockLabel} is missing its purpose link in block content.`,
        });
      }
    }

    if (content.aiReviewStatus === "human-review-pending") {
      issues.push({
        field: "blockGovernanceReady",
        message: `${blockLabel} has AI-assisted draft content awaiting human review.`,
      });
    }
  });

  return issues;
}

export function summarizeBuildCompletionChecks(
  input: BuildCompletionChecksInput,
) {
  const completed = Object.entries(input)
    .filter(([, confirmed]) => confirmed)
    .map(([field]) => buildCompletionFieldLabels[field] || field);

  return `Build checks completed: ${completed.join(", ")}.`;
}

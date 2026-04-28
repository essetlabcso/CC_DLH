export type BuildCompletionChecksInput = {
  generatedContentConfirmed: boolean;
  actionAlignmentConfirmed: boolean;
  mobileReadinessConfirmed: boolean;
  accessibilityConfirmed: boolean;
  safetyConfirmed: boolean;
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

export function summarizeBuildCompletionChecks(
  input: BuildCompletionChecksInput,
) {
  const completed = Object.entries(input)
    .filter(([, confirmed]) => confirmed)
    .map(([field]) => buildCompletionFieldLabels[field] || field);

  return `Build checks completed: ${completed.join(", ")}.`;
}

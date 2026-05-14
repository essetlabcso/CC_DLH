import { LessonBlockType } from "@prisma/client";

import type { CourseStoryboardLesson } from "@/lib/studio/storyboard";

export type BuildStudioBlockDraft = {
  type: LessonBlockType;
  title: string;
  purpose: string;
  content: BuildStudioBlockContent;
};

export type BuildStudioBlockContent = {
  title: string;
  blockTypeLabel?: string;
  interactionType?: string;
  purpose?: string;
  body?: string;
  prompt?: string;
  choices?: string[];
  scenarioChoices?: BuildStudioScenarioChoice[];
  revealItems?: BuildStudioRevealItem[];
  correctAnswer?: string;
  feedback?: string;
  linkedLearnerAction?: string;
  sourceStoryboardField?: string;
  accessibilityNote?: string;
  safeguardingNote?: string;
  aiHandoffNote?: string;
  aiReviewStatus?: BuildAiReviewStatus;
  aiReviewNote?: string;
  reviewReadinessNote?: string;
};

export type BuildStudioScenarioChoice = {
  id: string;
  label: string;
  feedback: string;
  best?: boolean;
};

export type BuildStudioRevealItem = {
  title: string;
  body: string;
};

export const buildAiReviewStatuses = [
  "not-used",
  "human-review-pending",
  "human-reviewed",
] as const;

export type BuildAiReviewStatus = (typeof buildAiReviewStatuses)[number];

export const buildAiReviewStatusLabels: Record<BuildAiReviewStatus, string> = {
  "not-used": "AI not used",
  "human-review-pending": "AI draft requires human review",
  "human-reviewed": "AI draft human-reviewed",
};

export type FinalTestAuthoringInput = {
  purpose: string;
  prompt: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: string;
  feedback?: string;
  accessibilityNote?: string;
};

export type BuildBlockEditInput = {
  title: string;
  purpose: string;
  body?: string;
  prompt?: string;
  feedback?: string;
  accessibilityNote?: string;
  safeguardingNote?: string;
  aiReviewStatus: BuildAiReviewStatus;
  aiReviewNote?: string;
  reviewReadinessNote?: string;
};

export type BuildBlockMoveDirection = "up" | "down";

export const buildBlockEditFieldLabels: Record<string, string> = {
  title: "Block title",
  purpose: "Purpose",
  aiReviewStatus: "AI review status",
};

export const finalTestAuthoringFieldLabels: Record<string, string> = {
  purpose: "Assessment purpose",
  prompt: "Question",
  choiceA: "Choice A",
  choiceB: "Choice B",
  choiceC: "Choice C",
  choiceD: "Choice D",
  correctAnswer: "Correct answer",
};

export function buildInitialBlocksFromStoryboard(
  lesson: CourseStoryboardLesson,
): BuildStudioBlockDraft[] {
  return [
    buildOpeningBlock(lesson),
    buildPracticeBlock(lesson),
    buildCheckBlock(lesson),
    buildJobAidBlock(lesson),
  ];
}

export function serializeBuildBlockContent(content: BuildStudioBlockContent) {
  return JSON.stringify(content);
}

export function parseBuildBlockContent(
  value: string | undefined,
): BuildStudioBlockContent {
  if (!value) {
    return {
      title: "",
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<BuildStudioBlockContent>;

    return {
      title: String(parsed.title || ""),
      blockTypeLabel: parsed.blockTypeLabel
        ? String(parsed.blockTypeLabel)
        : undefined,
      interactionType: parsed.interactionType
        ? String(parsed.interactionType)
        : undefined,
      purpose: parsed.purpose ? String(parsed.purpose) : undefined,
      body: parsed.body ? String(parsed.body) : undefined,
      prompt: parsed.prompt ? String(parsed.prompt) : undefined,
      choices: Array.isArray(parsed.choices)
        ? parsed.choices.map((choice) => String(choice))
        : undefined,
      scenarioChoices: parseScenarioChoices(parsed.scenarioChoices),
      revealItems: parseRevealItems(parsed.revealItems),
      correctAnswer: parsed.correctAnswer
        ? String(parsed.correctAnswer)
        : undefined,
      feedback: parsed.feedback ? String(parsed.feedback) : undefined,
      linkedLearnerAction: parsed.linkedLearnerAction
        ? String(parsed.linkedLearnerAction)
        : undefined,
      sourceStoryboardField: parsed.sourceStoryboardField
        ? String(parsed.sourceStoryboardField)
        : undefined,
      accessibilityNote: parsed.accessibilityNote
        ? String(parsed.accessibilityNote)
        : undefined,
      safeguardingNote: parsed.safeguardingNote
        ? String(parsed.safeguardingNote)
        : undefined,
      aiHandoffNote: parsed.aiHandoffNote
        ? String(parsed.aiHandoffNote)
        : undefined,
      aiReviewStatus: normalizeAiReviewStatus(parsed.aiReviewStatus),
      aiReviewNote: parsed.aiReviewNote
        ? String(parsed.aiReviewNote)
        : undefined,
      reviewReadinessNote: parsed.reviewReadinessNote
        ? String(parsed.reviewReadinessNote)
        : undefined,
    };
  } catch {
    return {
      title: "",
    };
  }
}

export function parseBuildBlockEditFormData(formData: FormData):
  | {
      ok: true;
      value: BuildBlockEditInput;
    }
  | {
      ok: false;
      missingFields: string[];
    } {
  const value = {
    title: getFormString(formData, "title"),
    purpose: getFormString(formData, "purpose"),
    body: getOptionalFormString(formData, "body"),
    prompt: getOptionalFormString(formData, "prompt"),
    feedback: getOptionalFormString(formData, "feedback"),
    accessibilityNote: getOptionalFormString(formData, "accessibilityNote"),
    safeguardingNote: getOptionalFormString(formData, "safeguardingNote"),
    aiReviewStatus: normalizeAiReviewStatus(
      getFormString(formData, "aiReviewStatus"),
    ),
    aiReviewNote: getOptionalFormString(formData, "aiReviewNote"),
    reviewReadinessNote: getOptionalFormString(
      formData,
      "reviewReadinessNote",
    ),
  };
  const missingFields = Object.entries({
    title: value.title,
    purpose: value.purpose,
  })
    .filter(([, fieldValue]) => !fieldValue)
    .map(([field]) => field);

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

export function mergeBuildBlockEditContent(
  existing: BuildStudioBlockContent,
  input: BuildBlockEditInput,
): BuildStudioBlockContent {
  return {
    ...existing,
    title: input.title,
    purpose: input.purpose,
    body: input.body,
    prompt: input.prompt,
    feedback: input.feedback,
    accessibilityNote: input.accessibilityNote,
    safeguardingNote: input.safeguardingNote,
    aiReviewStatus: input.aiReviewStatus,
    aiReviewNote: input.aiReviewNote,
    reviewReadinessNote: input.reviewReadinessNote,
  };
}

export function parseFinalTestAuthoringFormData(formData: FormData):
  | {
      ok: true;
      value: FinalTestAuthoringInput;
    }
  | {
      ok: false;
      missingFields: string[];
    } {
  const value: FinalTestAuthoringInput = {
    purpose: getFormString(formData, "purpose"),
    prompt: getFormString(formData, "prompt"),
    choiceA: getFormString(formData, "choiceA"),
    choiceB: getFormString(formData, "choiceB"),
    choiceC: getFormString(formData, "choiceC"),
    choiceD: getFormString(formData, "choiceD"),
    correctAnswer: normalizeCorrectAnswer(
      getFormString(formData, "correctAnswer"),
    ),
    feedback: getOptionalFormString(formData, "feedback"),
    accessibilityNote: getOptionalFormString(formData, "accessibilityNote"),
  };
  const missingFields = Object.entries({
    purpose: value.purpose,
    prompt: value.prompt,
    choiceA: value.choiceA,
    choiceB: value.choiceB,
    choiceC: value.choiceC,
    choiceD: value.choiceD,
    correctAnswer: value.correctAnswer,
  })
    .filter(([, fieldValue]) => !fieldValue)
    .map(([field]) => field);

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

export function buildFinalTestBlockContent(
  input: FinalTestAuthoringInput,
): BuildStudioBlockContent {
  return {
    title: "Final test",
    purpose: input.purpose,
    prompt: input.prompt,
    choices: [input.choiceA, input.choiceB, input.choiceC, input.choiceD],
    correctAnswer: input.correctAnswer,
    feedback: input.feedback,
    sourceStoryboardField: "final test authoring",
    accessibilityNote: input.accessibilityNote,
    safeguardingNote: "",
    aiReviewStatus: "not-used",
    aiReviewNote: "",
    reviewReadinessNote:
      "Final test item should stay linked to the required learner action and use the 80% pass and certificate rule.",
  };
}

export function getAdjacentBlockForMove<TBlock extends { id: string; sortOrder: number }>(
  blocks: readonly TBlock[],
  blockId: string,
  direction: BuildBlockMoveDirection,
) {
  const orderedBlocks = [...blocks].sort((first, second) => {
    return first.sortOrder - second.sortOrder;
  });
  const currentIndex = orderedBlocks.findIndex((block) => block.id === blockId);

  if (currentIndex < 0) {
    return null;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  const targetBlock = orderedBlocks[targetIndex];

  if (!targetBlock) {
    return null;
  }

  return {
    movingBlock: orderedBlocks[currentIndex],
    targetBlock,
  };
}

export function getBlockTypeLabel(type: LessonBlockType) {
  switch (type) {
    case LessonBlockType.CALLOUT:
      return "Callout";
    case LessonBlockType.SCENARIO:
      return "Scenario";
    case LessonBlockType.CHECK:
      return "Knowledge Check";
    case LessonBlockType.REFLECTION:
      return "Reflection";
    case LessonBlockType.IMAGE:
      return "Image";
    case LessonBlockType.VIDEO:
      return "Video";
    case LessonBlockType.FINAL_TEST:
      return "Final Test";
    default:
      return "Text";
  }
}

function getFormString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalFormString(formData: FormData, field: string) {
  const value = getFormString(formData, field);

  return value || undefined;
}

function normalizeCorrectAnswer(value: string) {
  const normalized = value.trim().toUpperCase();

  return ["A", "B", "C", "D"].includes(normalized) ? normalized : "";
}

function normalizeAiReviewStatus(value: unknown): BuildAiReviewStatus {
  return buildAiReviewStatuses.includes(value as BuildAiReviewStatus)
    ? (value as BuildAiReviewStatus)
    : "not-used";
}

function isScenarioChoice(
  choice: BuildStudioScenarioChoice | null,
): choice is BuildStudioScenarioChoice {
  return Boolean(choice?.id && choice.label);
}

function isRevealItem(
  item: BuildStudioRevealItem | null,
): item is BuildStudioRevealItem {
  return Boolean(item?.title && item.body);
}

function parseScenarioChoices(value: unknown): BuildStudioScenarioChoice[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const choices: BuildStudioScenarioChoice[] = [];

  for (const choice of value) {
    if (!choice || typeof choice !== "object") {
      continue;
    }

    const record = choice as Record<string, unknown>;
    const parsedChoice = {
      id: String(record.id || ""),
      label: String(record.label || ""),
      feedback: String(record.feedback || ""),
      best: record.best === true,
    };

    if (isScenarioChoice(parsedChoice)) {
      choices.push(parsedChoice);
    }
  }

  return choices.length > 0 ? choices : undefined;
}

function parseRevealItems(value: unknown): BuildStudioRevealItem[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items: BuildStudioRevealItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const parsedItem = {
      title: String(record.title || ""),
      body: String(record.body || ""),
    };

    if (isRevealItem(parsedItem)) {
      items.push(parsedItem);
    }
  }

  return items.length > 0 ? items : undefined;
}

function buildOpeningBlock(
  lesson: CourseStoryboardLesson,
): BuildStudioBlockDraft {
  return {
    type: LessonBlockType.CALLOUT,
    title: "Why this matters",
    purpose: "Orient the learner to the practical reason for the lesson.",
    content: {
      title: "Why this matters",
      purpose: "Orient the learner to the practical reason for the lesson.",
      body: `${lesson.purpose}\n\n${lesson.rationale}`.trim(),
      linkedLearnerAction: lesson.linkedLearnerAction,
      sourceStoryboardField: "lesson purpose and reason this lesson exists",
      accessibilityNote: lesson.accessibilityNote,
      safeguardingNote: lesson.criticalActionNote,
      aiHandoffNote: lesson.aiBuildHandoffNote,
      aiReviewStatus: "not-used",
      aiReviewNote: "",
      reviewReadinessNote:
        "Required Storyboard block. Preserve the approved lesson purpose and rationale.",
    },
  };
}

function buildPracticeBlock(
  lesson: CourseStoryboardLesson,
): BuildStudioBlockDraft {
  if (lesson.learningMode === "reflection") {
    return {
      type: LessonBlockType.REFLECTION,
      title: "Apply this to your context",
      purpose: "Prompt the learner to connect the lesson to their own CSO work.",
      content: {
        title: "Apply this to your context",
        purpose:
          "Prompt the learner to connect the lesson to their own CSO work.",
        prompt: lesson.plannedInteraction,
        linkedLearnerAction: lesson.linkedLearnerAction,
        sourceStoryboardField: "planned interaction",
        accessibilityNote: lesson.accessibilityNote,
        safeguardingNote: lesson.criticalActionNote,
        aiHandoffNote: lesson.aiBuildHandoffNote,
        aiReviewStatus: "not-used",
        aiReviewNote: "",
        reviewReadinessNote:
          "Required Storyboard block. Preserve the approved reflection action.",
      },
    };
  }

  if (
    lesson.learningMode === "scenario" ||
    lesson.learningMode === "practice" ||
    lesson.learningMode === "urgent-job-aid"
  ) {
    return {
      type: LessonBlockType.SCENARIO,
      title: "Practice scenario",
      purpose: "Let the learner practice the action before the knowledge check.",
      content: {
        title: "Practice scenario",
        purpose:
          "Let the learner practice the action before the knowledge check.",
        body: lesson.learningFlow,
        prompt: lesson.plannedInteraction,
        linkedLearnerAction: lesson.linkedLearnerAction,
        sourceStoryboardField: "learning flow and planned interaction",
        accessibilityNote: lesson.accessibilityNote,
        safeguardingNote: lesson.criticalActionNote,
        aiHandoffNote: lesson.aiBuildHandoffNote,
        aiReviewStatus: "not-used",
        aiReviewNote: "",
        reviewReadinessNote:
          "Required Storyboard block. Preserve the approved practice or scenario action.",
      },
    };
  }

  return {
    type: LessonBlockType.TEXT,
    title: "Essential guidance",
    purpose: "Present the core information needed for the learner action.",
    content: {
      title: "Essential guidance",
      purpose: "Present the core information needed for the learner action.",
      body: lesson.learningFlow,
      linkedLearnerAction: lesson.linkedLearnerAction,
      sourceStoryboardField: "learning flow",
      accessibilityNote: lesson.accessibilityNote,
      safeguardingNote: lesson.criticalActionNote,
      aiHandoffNote: lesson.aiBuildHandoffNote,
      aiReviewStatus: "not-used",
      aiReviewNote: "",
      reviewReadinessNote:
        "Required Storyboard block. Preserve the approved essential guidance.",
    },
  };
}

function buildCheckBlock(lesson: CourseStoryboardLesson): BuildStudioBlockDraft {
  return {
    type: LessonBlockType.CHECK,
    title: "Check the decision",
    purpose: "Confirm that the learner can perform the intended action.",
    content: {
      title: "Check the decision",
      purpose: "Confirm that the learner can perform the intended action.",
      prompt: lesson.knowledgeCheck,
      linkedLearnerAction: lesson.linkedLearnerAction,
      sourceStoryboardField: "knowledge check or learner output",
      accessibilityNote: lesson.accessibilityNote,
      safeguardingNote: lesson.criticalActionNote,
      aiHandoffNote: lesson.aiBuildHandoffNote,
      aiReviewStatus: "not-used",
      aiReviewNote: "",
      reviewReadinessNote:
        "Required Storyboard block. Preserve the approved knowledge-check intent.",
    },
  };
}

function buildJobAidBlock(
  lesson: CourseStoryboardLesson,
): BuildStudioBlockDraft {
  const title =
    lesson.learningMode === "urgent-job-aid"
      ? "Critical action first"
      : "Field aid";

  return {
    type: LessonBlockType.CALLOUT,
    title,
    purpose: "Give the learner a practical reference they can reuse after the course.",
    content: {
      title,
      purpose:
        "Give the learner a practical reference they can reuse after the course.",
      body: [
        lesson.jobAidRequirement,
        lesson.mediaRequirement,
        lesson.criticalActionNote,
      ]
        .filter(Boolean)
        .join("\n\n"),
      linkedLearnerAction: lesson.linkedLearnerAction,
      sourceStoryboardField: "job aid, media, and high-stakes notes",
      accessibilityNote: lesson.accessibilityNote,
      safeguardingNote: lesson.criticalActionNote,
      aiHandoffNote: lesson.aiBuildHandoffNote,
      aiReviewStatus: "not-used",
      aiReviewNote: "",
      reviewReadinessNote:
        "Required Storyboard block. Preserve the approved field-aid purpose.",
    },
  };
}

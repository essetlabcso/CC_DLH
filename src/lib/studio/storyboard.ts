export type CourseStoryboardInput = {
  moduleName: string;
  lessonTitle: string;
  lessonPurpose: string;
  linkedLearnerAction: string;
  linkedCapacityGoal: string;
  lessonRationale: string;
  learningMode: string;
  learningFlow: string;
  plannedBlockSequence: string;
  plannedInteraction: string;
  knowledgeCheck: string;
  mediaRequirement: string;
  jobAidRequirement: string;
  accessibilityNote: string;
  aiBuildHandoffNote: string;
  criticalActionNote: string;
  safetyGateConfirmed: boolean;
};

export type CourseStoryboardLesson = {
  moduleName: string;
  title: string;
  purpose: string;
  linkedLearnerAction: string;
  linkedCapacityGoal: string;
  rationale: string;
  learningMode: string;
  learningFlow: string;
  plannedBlockSequence: string;
  plannedInteraction: string;
  knowledgeCheck: string;
  mediaRequirement: string;
  jobAidRequirement: string;
  accessibilityNote: string;
  aiBuildHandoffNote: string;
  criticalActionNote: string;
};

export type CourseStoryboardValidationResult =
  | {
      ok: true;
      value: CourseStoryboardInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

type StoryboardParseOptions = {
  requiresSafetyGate?: boolean;
};

const requiredFields: readonly (keyof CourseStoryboardInput)[] = [
  "moduleName",
  "lessonTitle",
  "lessonPurpose",
  "linkedLearnerAction",
  "linkedCapacityGoal",
  "lessonRationale",
  "learningMode",
  "learningFlow",
  "plannedBlockSequence",
  "plannedInteraction",
  "knowledgeCheck",
  "mediaRequirement",
  "jobAidRequirement",
  "accessibilityNote",
  "aiBuildHandoffNote",
];

export const storyboardFieldLabels: Record<string, string> = {
  moduleName: "module name",
  lessonTitle: "lesson title",
  lessonPurpose: "lesson purpose",
  linkedLearnerAction: "linked learner action",
  linkedCapacityGoal: "linked capacity goal",
  lessonRationale: "reason this lesson exists",
  learningMode: "learning mode",
  learningFlow: "learning flow",
  plannedBlockSequence: "planned block sequence",
  plannedInteraction: "planned interaction",
  knowledgeCheck: "knowledge check or learner output",
  mediaRequirement: "media requirement",
  jobAidRequirement: "download or job aid requirement",
  accessibilityNote: "accessibility note",
  aiBuildHandoffNote: "AI build handoff note",
  safetyGateConfirmed: "sensitive-course safety check",
};

export const learningModeOptions = [
  "scenario",
  "checklist",
  "reflection",
  "practice",
  "short-explanation",
  "urgent-job-aid",
] as const;

export function parseCourseStoryboardFormData(
  formData: FormData,
  options: StoryboardParseOptions = {},
): CourseStoryboardValidationResult {
  const value: CourseStoryboardInput = {
    moduleName: getTextValue(formData, "moduleName"),
    lessonTitle: getTextValue(formData, "lessonTitle"),
    lessonPurpose: getTextValue(formData, "lessonPurpose"),
    linkedLearnerAction: getTextValue(formData, "linkedLearnerAction"),
    linkedCapacityGoal: getTextValue(formData, "linkedCapacityGoal"),
    lessonRationale: getTextValue(formData, "lessonRationale"),
    learningMode: getTextValue(formData, "learningMode"),
    learningFlow: getTextValue(formData, "learningFlow"),
    plannedBlockSequence: getTextValue(formData, "plannedBlockSequence"),
    plannedInteraction: getTextValue(formData, "plannedInteraction"),
    knowledgeCheck: getTextValue(formData, "knowledgeCheck"),
    mediaRequirement: getTextValue(formData, "mediaRequirement"),
    jobAidRequirement: getTextValue(formData, "jobAidRequirement"),
    accessibilityNote: getTextValue(formData, "accessibilityNote"),
    aiBuildHandoffNote: getTextValue(formData, "aiBuildHandoffNote"),
    criticalActionNote: getTextValue(formData, "criticalActionNote"),
    safetyGateConfirmed: formData.get("safetyGateConfirmed") === "on",
  };
  const missingFields = requiredFields.filter((field) => !value[field]);

  if (options.requiresSafetyGate && !value.safetyGateConfirmed) {
    missingFields.push("safetyGateConfirmed");
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

export function buildStoryboardLessonPlan(input: CourseStoryboardInput) {
  const lesson: CourseStoryboardLesson = {
    moduleName: input.moduleName,
    title: input.lessonTitle,
    purpose: input.lessonPurpose,
    linkedLearnerAction: input.linkedLearnerAction,
    linkedCapacityGoal: input.linkedCapacityGoal,
    rationale: input.lessonRationale,
    learningMode: input.learningMode,
    learningFlow: input.learningFlow,
    plannedBlockSequence: input.plannedBlockSequence,
    plannedInteraction: input.plannedInteraction,
    knowledgeCheck: input.knowledgeCheck,
    mediaRequirement: input.mediaRequirement,
    jobAidRequirement: input.jobAidRequirement,
    accessibilityNote: input.accessibilityNote,
    aiBuildHandoffNote: input.aiBuildHandoffNote,
    criticalActionNote: input.criticalActionNote,
  };

  return JSON.stringify([lesson]);
}

export function parseStoryboardLessonPlan(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? (parsed as CourseStoryboardLesson[]) : [];
  } catch {
    return [];
  }
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

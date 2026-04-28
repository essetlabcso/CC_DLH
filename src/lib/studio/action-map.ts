export const vagueActionVerbs = [
  "understand",
  "know",
  "learn",
  "appreciate",
  "be aware",
  "be familiar",
] as const;

export type CourseActionMapInput = {
  capacityGoal: string;
  individualLearnerOutcome: string;
  observableAction: string;
  actionEvidenceLink: string;
  practiceScenario: string;
  scenarioDecision: string;
  scenarioMonitoringSignal: string;
  essentialInformation: string;
  essentialInformationFormat: string;
  difficulty: string;
  importance: string;
  frequency: string;
};

export type CourseActionMapValidationResult =
  | {
      ok: true;
      value: CourseActionMapInput;
    }
  | {
      ok: false;
      missingFields: string[];
      vagueFields: string[];
    };

const requiredFields: readonly (keyof CourseActionMapInput)[] = [
  "capacityGoal",
  "individualLearnerOutcome",
  "observableAction",
  "actionEvidenceLink",
  "practiceScenario",
  "scenarioDecision",
  "scenarioMonitoringSignal",
  "essentialInformation",
  "essentialInformationFormat",
  "difficulty",
  "importance",
  "frequency",
];

export const actionMapFieldLabels: Record<string, string> = {
  capacityGoal: "capacity goal",
  individualLearnerOutcome: "individual learner outcome",
  observableAction: "observable learner action",
  actionEvidenceLink: "action evidence link",
  practiceScenario: "practice scenario",
  scenarioDecision: "scenario decision",
  scenarioMonitoringSignal: "scenario monitoring signal",
  essentialInformation: "essential information",
  essentialInformationFormat: "essential information format",
  difficulty: "difficulty",
  importance: "importance",
  frequency: "frequency",
};

export function parseCourseActionMapFormData(
  formData: FormData,
): CourseActionMapValidationResult {
  const value: CourseActionMapInput = {
    capacityGoal: getTextValue(formData, "capacityGoal"),
    individualLearnerOutcome: getTextValue(formData, "individualLearnerOutcome"),
    observableAction: getTextValue(formData, "observableAction"),
    actionEvidenceLink: getTextValue(formData, "actionEvidenceLink"),
    practiceScenario: getTextValue(formData, "practiceScenario"),
    scenarioDecision: getTextValue(formData, "scenarioDecision"),
    scenarioMonitoringSignal: getTextValue(formData, "scenarioMonitoringSignal"),
    essentialInformation: getTextValue(formData, "essentialInformation"),
    essentialInformationFormat: getTextValue(
      formData,
      "essentialInformationFormat",
    ),
    difficulty: getTextValue(formData, "difficulty"),
    importance: getTextValue(formData, "importance"),
    frequency: getTextValue(formData, "frequency"),
  };
  const missingFields = requiredFields.filter((field) => !value[field]);
  const vagueFields = findVagueActionFields(value);

  if (missingFields.length > 0 || vagueFields.length > 0) {
    return {
      ok: false,
      missingFields,
      vagueFields,
    };
  }

  return {
    ok: true,
    value,
  };
}

export function buildObservableActions(input: CourseActionMapInput) {
  return JSON.stringify([
    {
      action: input.observableAction,
      evidenceLink: input.actionEvidenceLink,
    },
  ]);
}

export function buildPracticeScenarios(input: CourseActionMapInput) {
  return JSON.stringify([
    {
      situation: input.practiceScenario,
      decision: input.scenarioDecision,
      monitoringSignal: input.scenarioMonitoringSignal,
    },
  ]);
}

export function buildEssentialInformation(input: CourseActionMapInput) {
  return JSON.stringify([
    {
      item: input.essentialInformation,
      format: input.essentialInformationFormat,
    },
  ]);
}

export function buildDifMatrix(input: CourseActionMapInput) {
  return JSON.stringify({
    difficulty: input.difficulty,
    importance: input.importance,
    frequency: input.frequency,
    recommendation: recommendDifSupport(input),
  });
}

export function parseJsonArrayField(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseDifMatrix(value: string | undefined) {
  if (!value) {
    return {
      difficulty: "",
      importance: "",
      frequency: "",
      recommendation: "",
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<{
      difficulty: string;
      importance: string;
      frequency: string;
      recommendation: string;
    }>;

    return {
      difficulty: parsed.difficulty || "",
      importance: parsed.importance || "",
      frequency: parsed.frequency || "",
      recommendation: parsed.recommendation || "",
    };
  } catch {
    return {
      difficulty: "",
      importance: "",
      frequency: "",
      recommendation: "",
    };
  }
}

export function findVagueActionFields(input: CourseActionMapInput) {
  const fieldsToCheck: readonly (keyof CourseActionMapInput)[] = [
    "capacityGoal",
    "individualLearnerOutcome",
    "observableAction",
  ];

  return fieldsToCheck.filter((field) => containsVagueActionVerb(input[field]));
}

function containsVagueActionVerb(value: string) {
  const normalized = value.toLowerCase();

  return vagueActionVerbs.some(
    (verb) =>
      normalized === verb ||
      normalized.startsWith(`${verb} `) ||
      normalized.includes(` ${verb} `),
  );
}

function recommendDifSupport(input: CourseActionMapInput) {
  if (input.importance === "high" && input.difficulty === "high") {
    return "scenario and coached practice";
  }

  if (input.frequency === "high" && input.difficulty === "low") {
    return "checklist or job aid";
  }

  if (input.importance === "high" && input.frequency === "low") {
    return "job aid and short scenario";
  }

  return "short guided practice";
}

function getTextValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

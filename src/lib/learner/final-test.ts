export const FINAL_TEST_PASS_SCORE = 80;

export type FinalTestContent = {
  title: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  feedback?: string;
};

export type FinalTestAttemptResult = {
  selectedAnswer: string;
  correctAnswer: string;
  scorePercent: number;
  passed: boolean;
};

export function parseFinalTestContent(value: string | undefined):
  | {
      ok: true;
      value: FinalTestContent;
    }
  | {
      ok: false;
    } {
  if (!value) {
    return {
      ok: false,
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<FinalTestContent>;
    const prompt = toStringValue(parsed.prompt);
    const choices = Array.isArray(parsed.choices)
      ? parsed.choices.map((choice) => String(choice)).filter(Boolean)
      : [];
    const correctAnswer = normalizeAnswer(parsed.correctAnswer);

    if (!prompt || choices.length < 4 || !correctAnswer) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
      value: {
        title: toStringValue(parsed.title) || "Final test",
        prompt,
        choices,
        correctAnswer,
        feedback: toStringValue(parsed.feedback) || undefined,
      },
    };
  } catch {
    return {
      ok: false,
    };
  }
}

export function isPassingFinalTestScore(scorePercent: number) {
  return scorePercent >= FINAL_TEST_PASS_SCORE;
}

export function scoreFinalTestAnswer(input: {
  selectedAnswer: string;
  correctAnswer: string;
}): FinalTestAttemptResult {
  const selectedAnswer = normalizeAnswer(input.selectedAnswer);
  const correctAnswer = normalizeAnswer(input.correctAnswer);
  const scorePercent =
    selectedAnswer && correctAnswer && selectedAnswer === correctAnswer
      ? 100
      : 0;

  return {
    selectedAnswer,
    correctAnswer,
    scorePercent,
    passed: isPassingFinalTestScore(scorePercent),
  };
}

export function parseFinalTestAnswerFormData(formData: FormData) {
  return normalizeAnswer(formData.get("selectedAnswer"));
}

export function getLatestFinalTestAttempt<
  TAttempt extends { submittedAt: Date; scorePercent: number },
>(attempts: readonly TAttempt[]) {
  return [...attempts].sort(
    (left, right) => right.submittedAt.getTime() - left.submittedAt.getTime(),
  )[0];
}

export function getBestFinalTestAttempt<
  TAttempt extends { submittedAt: Date; scorePercent: number },
>(attempts: readonly TAttempt[]) {
  return [...attempts].sort((left, right) => {
    return (
      right.scorePercent - left.scorePercent ||
      right.submittedAt.getTime() - left.submittedAt.getTime()
    );
  })[0];
}

function normalizeAnswer(value: FormDataEntryValue | unknown) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  return ["A", "B", "C", "D"].includes(normalized) ? normalized : "";
}

function toStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

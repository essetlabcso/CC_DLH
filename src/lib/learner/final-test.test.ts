import { describe, expect, it } from "vitest";

import {
  getBestFinalTestAttempt,
  getLatestFinalTestAttempt,
  isPassingFinalTestScore,
  parseFinalTestAnswerFormData,
  parseFinalTestContent,
  scoreFinalTestAnswer,
} from "./final-test";

describe("learner final test helpers", () => {
  it("parses authored final test block content", () => {
    const result = parseFinalTestContent(
      JSON.stringify({
        title: "Final test",
        prompt: "What is the safest first step?",
        choices: ["A", "B", "C", "D"],
        correctAnswer: "a",
        feedback: "Use the approved pathway.",
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.ok ? result.value.correctAnswer : "").toBe("A");
  });

  it("scores final test answers against the 80 percent pass rule", () => {
    expect(isPassingFinalTestScore(79)).toBe(false);
    expect(isPassingFinalTestScore(80)).toBe(true);
    expect(isPassingFinalTestScore(81)).toBe(true);

    expect(
      scoreFinalTestAnswer({
        selectedAnswer: "A",
        correctAnswer: "A",
      }),
    ).toMatchObject({
      scorePercent: 100,
      passed: true,
    });
    expect(
      scoreFinalTestAnswer({
        selectedAnswer: "B",
        correctAnswer: "A",
      }),
    ).toMatchObject({
      scorePercent: 0,
      passed: false,
    });
  });

  it("normalizes final test answer form input", () => {
    const formData = new FormData();
    formData.set("selectedAnswer", " b ");

    expect(parseFinalTestAnswerFormData(formData)).toBe("B");
  });

  it("finds latest and best final test attempts", () => {
    const olderPass = {
      scorePercent: 100,
      submittedAt: new Date("2026-04-25T00:00:00Z"),
    };
    const newerFail = {
      scorePercent: 0,
      submittedAt: new Date("2026-04-26T00:00:00Z"),
    };

    expect(getLatestFinalTestAttempt([olderPass, newerFail])).toBe(newerFail);
    expect(getBestFinalTestAttempt([olderPass, newerFail])).toBe(olderPass);
  });
});

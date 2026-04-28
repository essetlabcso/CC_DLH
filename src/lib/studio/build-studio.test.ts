import { LessonBlockType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildFinalTestBlockContent,
  buildInitialBlocksFromStoryboard,
  getAdjacentBlockForMove,
  mergeBuildBlockEditContent,
  parseBuildBlockContent,
  parseBuildBlockEditFormData,
  parseFinalTestAuthoringFormData,
  serializeBuildBlockContent,
} from "./build-studio";
import type { CourseStoryboardLesson } from "./storyboard";

describe("Build Studio block generation", () => {
  it("creates governed learner blocks from a scenario storyboard", () => {
    const blocks = buildInitialBlocksFromStoryboard(buildStoryboardLesson());

    expect(blocks.map((block) => block.type)).toEqual([
      LessonBlockType.CALLOUT,
      LessonBlockType.SCENARIO,
      LessonBlockType.CHECK,
      LessonBlockType.CALLOUT,
    ]);
    expect(blocks[1].content.linkedLearnerAction).toBe(
      "Select the correct safeguarding reporting pathway",
    );
  });

  it("uses a reflection block when the storyboard mode is reflection", () => {
    const blocks = buildInitialBlocksFromStoryboard({
      ...buildStoryboardLesson(),
      learningMode: "reflection",
    });

    expect(blocks[1].type).toBe(LessonBlockType.REFLECTION);
  });

  it("parses block content safely for display", () => {
    const content = parseBuildBlockContent(
      serializeBuildBlockContent({
        title: "Check the decision",
        prompt: "Which pathway is safest?",
        choices: ["A", "B"],
        safeguardingNote: "Avoid naming sensitive cases.",
        aiReviewStatus: "human-reviewed",
        aiReviewNote: "Creator reviewed the draft.",
      }),
    );

    expect(content.title).toBe("Check the decision");
    expect(content.choices).toEqual(["A", "B"]);
    expect(content.safeguardingNote).toBe("Avoid naming sensitive cases.");
    expect(content.aiReviewStatus).toBe("human-reviewed");
    expect(content.aiReviewNote).toBe("Creator reviewed the draft.");
    expect(parseBuildBlockContent("{broken").title).toBe("");
  });

  it("requires editable block title and purpose", () => {
    const formData = new FormData();
    formData.set("title", " ");
    formData.set("purpose", "Keep the lesson aligned to the learner action");

    const result = parseBuildBlockEditFormData(formData);

    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.missingFields).toEqual(["title"]);
  });

  it("merges edited learner content without losing governed source metadata", () => {
    const formData = new FormData();
    formData.set("title", "Updated scenario");
    formData.set("purpose", "Practice the approved reporting action");
    formData.set("body", "A new field scenario");
    formData.set("prompt", "What should the focal person do first?");
    formData.set("safeguardingNote", "Use fictionalized case details.");
    formData.set("aiReviewStatus", "human-review-pending");
    formData.set("aiReviewNote", "Draft needs SME review.");
    formData.set("reviewReadinessNote", "Reviewer should check realism.");
    const result = parseBuildBlockEditFormData(formData);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const merged = mergeBuildBlockEditContent(
      {
        title: "Practice scenario",
        purpose: "Old purpose",
        body: "Old content",
        choices: ["A", "B"],
        correctAnswer: "A",
        linkedLearnerAction: "Select the correct reporting pathway",
        sourceStoryboardField: "learning flow and planned interaction",
        aiHandoffNote: "Use plain language.",
      },
      result.value,
    );

    expect(merged.title).toBe("Updated scenario");
    expect(merged.body).toBe("A new field scenario");
    expect(merged.linkedLearnerAction).toBe(
      "Select the correct reporting pathway",
    );
    expect(merged.sourceStoryboardField).toBe(
      "learning flow and planned interaction",
    );
    expect(merged.choices).toEqual(["A", "B"]);
    expect(merged.safeguardingNote).toBe("Use fictionalized case details.");
    expect(merged.aiReviewStatus).toBe("human-review-pending");
    expect(merged.aiReviewNote).toBe("Draft needs SME review.");
    expect(merged.reviewReadinessNote).toBe("Reviewer should check realism.");
  });

  it("finds the neighboring block when moving within a lesson", () => {
    const blocks = [
      { id: "check", sortOrder: 3 },
      { id: "intro", sortOrder: 1 },
      { id: "practice", sortOrder: 2 },
    ];

    expect(getAdjacentBlockForMove(blocks, "practice", "up")).toEqual({
      movingBlock: { id: "practice", sortOrder: 2 },
      targetBlock: { id: "intro", sortOrder: 1 },
    });
    expect(getAdjacentBlockForMove(blocks, "practice", "down")).toEqual({
      movingBlock: { id: "practice", sortOrder: 2 },
      targetBlock: { id: "check", sortOrder: 3 },
    });
    expect(getAdjacentBlockForMove(blocks, "intro", "up")).toBeNull();
    expect(getAdjacentBlockForMove(blocks, "missing", "down")).toBeNull();
  });

  it("builds final test content from required authoring fields", () => {
    const formData = new FormData();
    formData.set("purpose", "Confirm the learner can choose the safe pathway");
    formData.set("prompt", "Which action should happen first?");
    formData.set("choiceA", "Call the approved focal point");
    formData.set("choiceB", "Share the case widely");
    formData.set("choiceC", "Wait for the next team meeting");
    formData.set("choiceD", "Ignore the report");
    formData.set("correctAnswer", "a");
    formData.set("feedback", "Use the approved reporting pathway.");

    const result = parseFinalTestAuthoringFormData(formData);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    const content = buildFinalTestBlockContent(result.value);

    expect(content.title).toBe("Final test");
    expect(content.choices).toEqual([
      "Call the approved focal point",
      "Share the case widely",
      "Wait for the next team meeting",
      "Ignore the report",
    ]);
    expect(content.correctAnswer).toBe("A");
  });

  it("rejects final test authoring when the correct answer is invalid", () => {
    const formData = new FormData();
    formData.set("purpose", "Confirm learner readiness");
    formData.set("prompt", "Pick one");
    formData.set("choiceA", "One");
    formData.set("choiceB", "Two");
    formData.set("choiceC", "Three");
    formData.set("choiceD", "Four");
    formData.set("correctAnswer", "E");

    const result = parseFinalTestAuthoringFormData(formData);

    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.missingFields).toContain("correctAnswer");
  });
});

function buildStoryboardLesson(): CourseStoryboardLesson {
  return {
    moduleName: "Safe reporting basics",
    title: "Choose the safest reporting pathway",
    purpose: "Help focal staff practice selecting the right reporting pathway.",
    linkedLearnerAction: "Select the correct safeguarding reporting pathway",
    linkedCapacityGoal: "Improve safe and timely safeguarding incident response",
    rationale: "Late reporting can increase survivor and organizational risk.",
    learningMode: "scenario",
    learningFlow: "Brief field context, scenario choice, feedback, and checklist.",
    plannedBlockSequence:
      "Callout, scenario card, decision branch, feedback, job aid, check.",
    plannedInteraction:
      "Learner chooses the safest reporting pathway and explains the first action.",
    knowledgeCheck: "Ask which pathway is safest and why.",
    mediaRequirement: "Use a simple pathway diagram only if approved.",
    jobAidRequirement: "Downloadable reporting pathway checklist.",
    accessibilityNote: "Do not rely on color-only cues.",
    aiBuildHandoffNote:
      "Draft plain-language scenario blocks using approved sources.",
    criticalActionNote: "Use do-no-harm framing.",
  };
}

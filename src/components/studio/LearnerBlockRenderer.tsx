"use client";

import { useState } from "react";

import {
  getBlockTypeLabel,
  type BuildStudioBlockContent,
} from "@/lib/studio/build-studio";
import type { LessonBlockType } from "@prisma/client";

type LearnerBlockRendererProps = {
  blockType: LessonBlockType;
  content: BuildStudioBlockContent;
  mode?: "preview" | "learner";
};

export function LearnerBlockRenderer({
  blockType,
  content,
  mode = "learner",
}: LearnerBlockRendererProps) {
  const typeLabel = content.blockTypeLabel || getBlockTypeLabel(blockType);

  return (
    <section className="preview-block">
      <p className="preview-block-kind">{typeLabel}</p>
      <h3>{content.title || typeLabel}</h3>
      {content.purpose ? <p>{content.purpose}</p> : null}
      {content.body ? <p>{content.body}</p> : null}
      {renderInteractiveContent(blockType, content, mode)}
      {content.accessibilityNote ? (
        <p className="block-support-note">
          <strong>Accessibility:</strong> {content.accessibilityNote}
        </p>
      ) : null}
      {content.safeguardingNote ? (
        <p className="block-support-note">
          <strong>Safety:</strong> {content.safeguardingNote}
        </p>
      ) : null}
    </section>
  );
}

function renderInteractiveContent(
  blockType: LessonBlockType,
  content: BuildStudioBlockContent,
  mode: "preview" | "learner",
) {
  if (content.interactionType === "accordion" && content.revealItems?.length) {
    return (
      <div className="learner-reveal-list">
        {content.revealItems.map((item) => (
          <details key={item.title}>
            <summary>{item.title}</summary>
            <p>{item.body}</p>
          </details>
        ))}
      </div>
    );
  }

  if (
    content.interactionType === "branching-scenario" &&
    content.scenarioChoices?.length
  ) {
    return <BranchingScenario content={content} />;
  }

  if (blockType === "CHECK" && content.choices?.length) {
    return <KnowledgeCheck content={content} />;
  }

  if (blockType === "REFLECTION") {
    return <ReflectionPrompt content={content} mode={mode} />;
  }

  if (blockType === "IMAGE") {
    return (
      <div className="visual-placeholder" role="img" aria-label={content.title}>
        <span>Visual placeholder</span>
        <strong>{content.title}</strong>
      </div>
    );
  }

  if (content.prompt) {
    return (
      <div className="preview-prompt">
        <strong>Prompt</strong>
        <p>{content.prompt}</p>
      </div>
    );
  }

  return null;
}

function BranchingScenario({ content }: { content: BuildStudioBlockContent }) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const selectedChoice = content.scenarioChoices?.find(
    (choice) => choice.id === selectedChoiceId,
  );

  return (
    <div className="preview-prompt branching-scenario">
      <strong>Scenario decision</strong>
      {content.prompt ? <p>{content.prompt}</p> : null}
      <div className="scenario-choice-grid">
        {content.scenarioChoices?.map((choice) => (
          <button
            className={
              selectedChoiceId === choice.id
                ? "scenario-choice selected"
                : "scenario-choice"
            }
            key={choice.id}
            onClick={() => setSelectedChoiceId(choice.id)}
            type="button"
          >
            <span>{choice.label}</span>
            {choice.best ? <small>Best / safer choice</small> : null}
          </button>
        ))}
      </div>
      {selectedChoice ? (
        <div
          className={
            selectedChoice.best
              ? "scenario-feedback scenario-feedback-best"
              : "scenario-feedback"
          }
        >
          <strong>{selectedChoice.best ? "Best choice" : "Consequence"}</strong>
          <p>{selectedChoice.feedback}</p>
          <button
            className="workspace-button secondary"
            onClick={() => setSelectedChoiceId(null)}
            type="button"
          >
            Retry or explore another option
          </button>
        </div>
      ) : null}
    </div>
  );
}

function KnowledgeCheck({ content }: { content: BuildStudioBlockContent }) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const selectedLetter = selectedAnswer || "";
  const isCorrect =
    selectedLetter &&
    selectedLetter.toUpperCase() === content.correctAnswer?.toUpperCase();

  return (
    <div className="preview-prompt">
      <strong>Knowledge check</strong>
      {content.prompt ? <p>{content.prompt}</p> : null}
      <div className="scenario-choice-grid">
        {content.choices?.map((choice, index) => {
          const answer = ["A", "B", "C", "D"][index];

          return (
            <button
              className={
                selectedLetter === answer
                  ? "scenario-choice selected"
                  : "scenario-choice"
              }
              key={answer}
              onClick={() => setSelectedAnswer(answer)}
              type="button"
            >
              {answer}. {choice}
            </button>
          );
        })}
      </div>
      {selectedLetter ? (
        <div
          className={
            isCorrect
              ? "scenario-feedback scenario-feedback-best"
              : "scenario-feedback"
          }
        >
          <strong>{isCorrect ? "Correct" : "Try again"}</strong>
          <p>{content.feedback || "Review the guidance and choose again."}</p>
        </div>
      ) : null}
    </div>
  );
}

function ReflectionPrompt({
  content,
  mode,
}: {
  content: BuildStudioBlockContent;
  mode: "preview" | "learner";
}) {
  const [value, setValue] = useState("");

  return (
    <div className="preview-prompt">
      <strong>Reflection</strong>
      {content.prompt ? <p>{content.prompt}</p> : null}
      <textarea
        aria-label="Reflection response"
        onChange={(event) => setValue(event.target.value)}
        placeholder={
          mode === "preview"
            ? "Preview response area"
            : "Write a private note for your own learning."
        }
        value={value}
      />
      {value ? <p className="block-support-note">Reflection saved locally.</p> : null}
    </div>
  );
}

import {
  CourseWorkflowStep,
  LessonBlockType,
  WorkflowStepStatus,
} from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  buildBuildToReviewHandover,
  buildToReviewCertificateRule,
  canSubmitBuildToReviewHandover,
  getBuildToReviewHandoverFromChecklist,
  mergeBuildToReviewHandoverChecklist,
} from "./build-review-handover";

describe("Build-to-Review handover", () => {
  it("includes the required Storyboard block register", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion(),
    });

    expect(handover.requiredBlocks).toHaveLength(1);
    expect(handover.requiredBlocks[0]).toMatchObject({
      title: "Required guidance",
      purposeLink: "Use the approved checklist",
    });
  });

  it("includes creator-added block justification and purpose link", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        extraBlocks: [
          {
            id: "creator-1",
            type: LessonBlockType.CALLOUT,
            origin: "CREATOR_ADDED",
            purposeLink: "Support safer reporting",
            justification: "Supports safeguarding",
            content: JSON.stringify({
              title: "Safety reminder",
              purpose: "Add a safeguarding reminder",
              linkedLearnerAction: "Support safer reporting",
              aiReviewStatus: "not-used",
              accessibilityNote: "Plain-language note.",
              safeguardingNote: "Avoid names.",
            }),
          },
        ],
      }),
    });

    expect(handover.creatorAddedBlocks).toHaveLength(1);
    expect(handover.creatorAddedBlocks[0]).toMatchObject({
      justification: "Supports safeguarding",
      purposeLink: "Support safer reporting",
    });
  });

  it("blocks AI-assisted content that still needs human review", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        requiredContent: {
          aiReviewStatus: "human-review-pending",
        },
      }),
    });

    expect(handover.aiReview.pendingCount).toBe(1);
    expect(handover.blockingWarnings.map((warning) => warning.message).join(" ")).toContain(
      "awaiting human review",
    );
  });

  it("blocks missing final test when certificate intent is active", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        includeFinalTest: false,
      }),
    });

    expect(handover.finalTest.required).toBe(true);
    expect(handover.finalTest.ready).toBe(false);
    expect(handover.blockingWarnings.map((warning) => warning.code)).toContain(
      "final-test-not-ready",
    );
    expect(canSubmitBuildToReviewHandover(handover)).toBe(false);
  });

  it("preserves the corrected 80% certificate rule", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion(),
    });

    expect(handover.certificateRule).toBe(buildToReviewCertificateRule);
    expect(handover.certificateRule).toContain("80%+");
    expect(handover.certificateRule).not.toContain("90%");
  });

  it("serializes the handover inside the review checklist", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion(),
    });
    const checklist = mergeBuildToReviewHandoverChecklist(
      JSON.stringify({ creatorReview: { submissionReadinessConfirmed: true } }),
      handover,
    );

    expect(getBuildToReviewHandoverFromChecklist(checklist)).toMatchObject({
      courseTitle: "Safe reporting basics",
      certificateRule: buildToReviewCertificateRule,
    });
    expect(JSON.parse(checklist)).toMatchObject({
      creatorReview: {
        submissionReadinessConfirmed: true,
      },
    });
  });
});

function buildVersion(
  options: {
    includeFinalTest?: boolean;
    requiredContent?: Record<string, unknown>;
    extraBlocks?: {
      id: string;
      type: LessonBlockType;
      origin: string;
      content: string;
      purposeLink: string;
      justification: string;
    }[];
  } = {},
) {
  const includeFinalTest = options.includeFinalTest ?? true;
  const requiredContent = {
    title: "Required guidance",
    purpose: "Teach the approved action",
    linkedLearnerAction: "Use the approved checklist",
    sourceStoryboardField: "learning flow",
    aiReviewStatus: "not-used",
    accessibilityNote: "Use text.",
    safeguardingNote: "Use fictional examples.",
    ...options.requiredContent,
  };

  return {
    setup: {
      certificateIntent: "Certificate",
    },
    workflowSteps: [
      {
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.COMPLETE,
      },
      {
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.COMPLETE,
      },
      {
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.COMPLETE,
      },
    ],
    modules: [
      {
        title: "Module 1",
        lessons: [
          {
            title: "Lesson 1",
            blocks: [
              {
                id: "required-1",
                type: LessonBlockType.TEXT,
                origin: "DESIGN_REQUIRED",
                purposeLink: "Use the approved checklist",
                justification: "",
                content: JSON.stringify(requiredContent),
              },
              ...(options.extraBlocks || []),
              ...(includeFinalTest
                ? [
                    {
                      id: "final-test-1",
                      type: LessonBlockType.FINAL_TEST,
                      origin: "DESIGN_REQUIRED",
                      purposeLink: "Use the approved checklist",
                      justification: "",
                      content: JSON.stringify({
                        title: "Final test",
                        purpose: "Confirm the approved action",
                        prompt: "What is the safest first step?",
                        choices: ["A", "B", "C", "D"],
                        correctAnswer: "A",
                      }),
                    },
                  ]
                : []),
            ],
          },
        ],
      },
    ],
  };
}

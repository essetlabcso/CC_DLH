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
import type { PracticalProofConfigInput } from "./practical-proof";

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

  it("shows practical proof status in the handover", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        practicalProofConfig: {
          enabled: true,
          proofTitle: "Apply the reporting checklist",
          proofPurpose: "Show safe use of the checklist.",
          acceptedProofType: "work-sample",
          submissionFormat: "text-response",
          instructions: "Describe the safe reporting steps.",
          safetyGuidance: "Do not include names or identifying details.",
          reviewCriteria: "Uses the correct sequence and escalation point.",
          capacityArea: "Safeguarding",
          subCapacityArea: "Reporting",
          linkedStandard: "DEC safeguarding practice",
          capacityIndicator: "Uses safe referral steps.",
          visibilityDefault: "PRIVATE",
          donorVisibilityEnabled: false,
          certificateSeparationConfirmed: true,
          specialistReviewRequired: false,
        },
      }),
    });

    expect(handover.practicalProof).toMatchObject({
      enabled: true,
      ready: true,
      status: "Safely configured",
    });
    expect(handover.blockingWarnings).toHaveLength(0);
  });

  it("blocks review submission when enabled practical proof is unsafe", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        practicalProofConfig: {
          enabled: true,
          proofTitle: "Apply the reporting checklist",
          proofPurpose: "Show safe use of the checklist.",
          acceptedProofType: "work-sample",
          submissionFormat: "text-response",
          instructions: "Describe the safe reporting steps.",
          safetyGuidance: "",
          reviewCriteria: "",
          capacityArea: "Safeguarding",
          subCapacityArea: "Reporting",
          linkedStandard: "DEC safeguarding practice",
          capacityIndicator: "Uses safe referral steps.",
          visibilityDefault: "PRIVATE",
          donorVisibilityEnabled: false,
          certificateSeparationConfirmed: false,
          specialistReviewRequired: false,
        },
      }),
    });

    expect(handover.practicalProof.ready).toBe(false);
    expect(handover.blockingWarnings.map((warning) => warning.code)).toEqual(
      expect.arrayContaining([
        "practical-proof-safetyGuidance",
        "practical-proof-reviewCriteria",
        "practical-proof-certificateSeparationConfirmed",
      ]),
    );
    expect(canSubmitBuildToReviewHandover(handover)).toBe(false);
  });

  it("keeps practical proof disabled without affecting review submission", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion(),
    });

    expect(handover.practicalProof).toMatchObject({
      enabled: false,
      ready: true,
    });
    expect(canSubmitBuildToReviewHandover(handover)).toBe(true);
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

  it("handles first submission vs revision submission labeling and anchors", () => {
    const firstHandover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion(),
    });
    expect(firstHandover.submissionType).toBe("new");
    expect(firstHandover.anchors.capacityArea).toBe("Not specified");

    const revisionHandover = buildBuildToReviewHandover({
      courseTitle: "Safe reporting basics",
      version: buildVersion({
        sourceVersionId: "original-v1",
        analysisHandover: {
          capacityArea: "Safeguarding",
          validatedCapacityGap: "Reporting gap",
          ksmeRoute: "Knowledge",
        },
      }),
    });
    expect(revisionHandover.submissionType).toBe("revision");
    expect(revisionHandover.anchors).toMatchObject({
      capacityArea: "Safeguarding",
      gap: "Reporting gap",
      route: "Knowledge",
    });
  });
});

function buildVersion(
  options: {
    sourceVersionId?: string | null;
    analysisHandover?: {
      capacityArea?: string | null;
      validatedCapacityGap?: string | null;
      ksmeRoute?: string | null;
    } | null;
    includeFinalTest?: boolean;
    requiredContent?: Record<string, unknown>;
    practicalProofConfig?: PracticalProofConfigInput;
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
    body: "Learner-facing content goes here.",
    linkedLearnerAction: "Use the approved checklist",
    sourceStoryboardField: "learning flow",
    aiReviewStatus: "not-used",
    accessibilityNote: "Use text.",
    safeguardingNote: "Use fictional examples.",
    ...options.requiredContent,
  };

  return {
    sourceVersionId: options.sourceVersionId,
    analysisHandover: options.analysisHandover,
    setup: {
      certificateIntent: "Certificate",
    },
    practicalProofConfig: options.practicalProofConfig,
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
                        feedback: "That is correct!",
                        reviewReadinessNote: "Pass mark set to 80%",
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

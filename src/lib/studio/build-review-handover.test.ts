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
import {
  buildCourseSetupDiagnosisSnapshot,
  serializeCourseSetupDiagnosisSnapshot,
} from "./diagnosis-selection";
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

  it("includes safe source-anchor summary fields for reviewer visibility", () => {
    const handover = buildBuildToReviewHandover({
      courseTitle: "Outcome evidence basics",
      version: buildVersion({
        analysisHandover: {
          analysisGateDecision: "proceed-to-design",
          baseline:
            "Staff understand reporting requirements but need support preparing concise outcome evidence statements.",
          capacityArea:
            "Monitoring, Evaluation, Accountability, and Learning",
          capacityIndicator: "Outcome note quality",
          desiredPractice: "Staff prepare short outcome evidence notes.",
          evaluationAnchor:
            "Participant prepares a concise outcome evidence statement.",
          interventionDecision: "Proceed with a skill practice course.",
          ksmeRoute: "Skill",
          linkedStandard: "DEC MEAL practice",
          referralOrFurtherDiagnosisNote: "",
          rootCauseSummary:
            "The main issue is a skill gap around concise evidence statements.",
          safeguardsNote:
            "Use fictionalized examples and avoid identifiable participant data.",
          separableKnowledgeSkillComponent: "",
          subCapacityArea: "Outcome evidence and learning documentation",
          validatedCapacityGap:
            "Staff need practice preparing concise outcome evidence statements from routine monitoring data.",
        },
        diagnosis: {
          affectedLearnerGroup: "MEAL staff",
          courseFitDecision: "course-fit",
        },
        diagnosisSnapshot: buildDiagnosisSnapshotValue(),
      }),
    });

    expect(handover.anchors).toMatchObject({
      alignmentStatus: "Aligned with source anchor",
      baseline:
        "Staff understand reporting requirements but cannot prepare concise outcome evidence statements.",
      courseFitDecision: "Course-addressable",
      evaluationAnchor:
        "Participant prepares a concise outcome evidence statement.",
      gap:
        "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
      route: "Skill",
      safeguards:
        "Use fictionalized examples and avoid identifiable participant data.",
      sourcePackage: "DEC-CSF-2026-R1 - CSF+ Partner CSO Capacity Diagnosis - Round 1",
    });
    expect(handover.anchors.alignmentIssues).toEqual([]);
  });
});

function buildVersion(
  options: {
    sourceVersionId?: string | null;
    analysisHandover?: {
      capacityArea?: string | null;
      subCapacityArea?: string | null;
      linkedStandard?: string | null;
      capacityIndicator?: string | null;
      validatedCapacityGap?: string | null;
      baseline?: string | null;
      desiredPractice?: string | null;
      rootCauseSummary?: string | null;
      ksmeRoute?: string | null;
      separableKnowledgeSkillComponent?: string | null;
      interventionDecision?: string | null;
      analysisGateDecision?: string | null;
      referralOrFurtherDiagnosisNote?: string | null;
      safeguardsNote?: string | null;
      evaluationAnchor?: string | null;
    } | null;
    diagnosis?: {
      affectedLearnerGroup?: string | null;
      courseFitDecision?: string | null;
    } | null;
    diagnosisSnapshot?: string | null;
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
    diagnosis: options.diagnosis,
    setup: {
      certificateIntent: "Certificate",
      diagnosisSnapshot: options.diagnosisSnapshot,
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

function buildDiagnosisSnapshotValue() {
  return serializeCourseSetupDiagnosisSnapshot(
    buildCourseSetupDiagnosisSnapshot(
      {
        id: "dataset-1",
        datasetCode: "DEC-CSF-2026-R1",
        datasetTitle: "CSF+ Partner CSO Capacity Diagnosis - Round 1",
        programOrProject: "EU CSF+",
        assessmentPeriodStart: null,
        assessmentPeriodEnd: null,
        regionsCovered: "Addis Ababa, Oromia",
        organizationGroup: "Selected local CSO partners / CSF+ cohort",
      },
      {
        id: "record-1",
        diagnosisCode: "MEAL-001",
        diagnosisTitle: "MEAL outcome evidence",
        coreCapacityArea:
          "Monitoring, Evaluation, Accountability, and Learning",
        capacityPracticeArea: "Outcome evidence and learning documentation",
        subCapacity: "Outcome evidence and learning documentation",
        targetAudience: "MEAL staff / Program staff",
        region: "Addis Ababa",
        currentBaseline:
          "Staff understand reporting requirements but cannot prepare concise outcome evidence statements.",
        capacityGapStatement:
          "Staff cannot prepare concise outcome evidence statements from routine monitoring data.",
        desiredPractice:
          "Staff prepare a short outcome evidence note that links outputs, observed change, evidence source, and learning implication.",
        evidenceSource:
          "Fictionalized workshop exercise, survey summary, and validation discussion.",
        ksmeRoute: "Skill",
        separableKnowledgeSkillComponent: "",
        courseFitDecision: "Course-addressable",
        safeguardingRiskLevel: "Low",
        dataSensitivityLevel: "Internal",
        noHarmNote:
          "Use fictionalized examples and avoid identifiable participant data.",
        evaluationAnchor:
          "Participant prepares a concise outcome evidence statement.",
        monitoringSignal:
          "Improved quality of outcome evidence notes in course activities.",
        possiblePracticalProof: "Outcome evidence note",
        verifiedAchievementExample:
          "Verified achievement shows a safe outcome evidence note.",
      },
    ),
  );
}

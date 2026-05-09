import {
  CourseWorkflowStep,
  LessonBlockType,
  WorkflowStepStatus,
} from "@prisma/client";

import {
  buildAiReviewStatusLabels,
  getBlockTypeLabel,
  parseBuildBlockContent,
} from "@/lib/studio/build-studio";
import {
  getBuildGovernanceIssues,
  hasBuildContent,
  hasFinalTestContent,
} from "@/lib/studio/build-checks";
import {
  buildPracticalProofReadiness,
  type PracticalProofConfigLike,
  type PracticalProofReadiness,
} from "@/lib/studio/practical-proof";
import { validateAnalysisAnchorConsistency } from "@/lib/studio/analysis-handover";
import { parseCourseSetupDiagnosisSnapshot } from "@/lib/studio/diagnosis-selection";

export const buildToReviewCertificateRule =
  "80%+ final test score = pass and automated course certificate";

export type BuildToReviewHandoverBlock = {
  id: string;
  title: string;
  type: string;
  lessonTitle: string;
  purpose: string;
  purposeLink: string;
  justification?: string;
  aiReviewStatus: string;
  accessibilityNote: string;
  safeguardingNote: string;
  reviewReadinessNote: string;
};

export type BuildToReviewHandoverWarning = {
  code: string;
  message: string;
};

export type BuildToReviewHandover = {
  generatedAt: string;
  courseTitle: string;
  certificateRule: string;
  submissionType: "revision" | "new";
  anchors: {
    capacityArea: string;
    gap: string;
    route: string;
    sourcePackage?: string;
    courseFitDecision?: string;
    baseline?: string;
    safeguards?: string;
    evaluationAnchor?: string;
    alignmentStatus?: string;
    alignmentIssues?: string[];
  };
  summary: {
    moduleCount: number;
    lessonCount: number;
    totalBlocks: number;
    requiredBlockCount: number;
    creatorAddedBlockCount: number;
  };
  requiredBlocks: BuildToReviewHandoverBlock[];
  creatorAddedBlocks: BuildToReviewHandoverBlock[];
  finalTest: {
    required: boolean;
    ready: boolean;
    questionCount: number;
    summary: string;
  };
  aiReview: {
    status: string;
    pendingCount: number;
    reviewedCount: number;
    notUsedCount: number;
  };
  accessibility: {
    status: string;
    blocksWithNotes: number;
    blocksMissingNotes: number;
  };
  safeguarding: {
    status: string;
    blocksWithNotes: number;
    blocksMissingNotes: number;
  };
  preview: {
    completed: boolean;
    status: string;
  };
  creatorReview: {
    completed: boolean;
    status: string;
  };
  practicalProof: PracticalProofReadiness;
  blockingWarnings: BuildToReviewHandoverWarning[];
  reviewerAttentionItems: string[];
};

export type BuildToReviewWorkflowStep = {
  step: CourseWorkflowStep;
  status: WorkflowStepStatus;
};

export type BuildToReviewVersion = {
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
  designHandover?: {
    lockedAt?: string | Date | null;
  } | null;
  setup?: {
    certificateIntent?: string | null;
    diagnosisSnapshot?: string | null;
  } | null;
  practicalProofConfig?: PracticalProofConfigLike;
  workflowSteps: readonly BuildToReviewWorkflowStep[];
  modules: readonly {
    title: string;
    lessons: readonly {
      title: string;
      blocks: readonly {
        id: string;
        type: LessonBlockType | string;
        origin: string;
        content: string;
        purposeLink: string | null;
        justification: string | null;
      }[];
    }[];
  }[];
};

export function buildBuildToReviewHandover(
  input: {
    courseTitle: string;
    version: BuildToReviewVersion;
  },
  options: {
    generatedAt?: Date;
    workflowStatusOverrides?: Partial<
      Record<CourseWorkflowStep, WorkflowStepStatus>
    >;
  } = {},
): BuildToReviewHandover {
  const blocks = input.version.modules.flatMap((module) =>
    module.lessons.flatMap((lesson) =>
      lesson.blocks.map((block) => ({
        ...block,
        lessonTitle: lesson.title,
      })),
    ),
  );
  const lessonBlocks = blocks.filter(
    (block) => block.type !== LessonBlockType.FINAL_TEST,
  );
  const requiredBlocks = lessonBlocks.filter(
    (block) => block.origin === "DESIGN_REQUIRED",
  );
  const creatorAddedBlocks = lessonBlocks.filter(
    (block) => block.origin === "CREATOR_ADDED",
  );
  const finalTestBlocks = blocks.filter(
    (block) => block.type === LessonBlockType.FINAL_TEST,
  );
  const finalTestRequired = hasCertificateIntent(
    input.version.setup?.certificateIntent,
  );
  const finalTestReady = hasFinalTestContent(input.version.modules);
  const buildStatus = getWorkflowStatus(
    input.version.workflowSteps,
    CourseWorkflowStep.BUILD,
    options.workflowStatusOverrides,
  );
  const previewStatus = getWorkflowStatus(
    input.version.workflowSteps,
    CourseWorkflowStep.PREVIEW,
    options.workflowStatusOverrides,
  );
  const creatorReviewStatus = getWorkflowStatus(
    input.version.workflowSteps,
    CourseWorkflowStep.CREATOR_REVIEW,
    options.workflowStatusOverrides,
  );
  const mappedRequiredBlocks = requiredBlocks.map(mapBlockToHandoverBlock);
  const mappedCreatorAddedBlocks = creatorAddedBlocks.map(
    mapBlockToHandoverBlock,
  );
  const allMappedBlocks = [
    ...mappedRequiredBlocks,
    ...mappedCreatorAddedBlocks,
  ];
  const pendingAiBlocks = allMappedBlocks.filter(
    (block) => block.aiReviewStatus === "AI draft requires human review",
  );
  const reviewedAiBlocks = allMappedBlocks.filter(
    (block) => block.aiReviewStatus === "AI draft human-reviewed",
  );
  const aiNotUsedBlocks = allMappedBlocks.filter(
    (block) => block.aiReviewStatus === "AI not used",
  );
  const accessibilityMissing = allMappedBlocks.filter(
    (block) => !block.accessibilityNote,
  );
  const safeguardingMissing = allMappedBlocks.filter(
    (block) => !block.safeguardingNote,
  );
  const governanceIssues = getBuildGovernanceIssues(input.version.modules);
  const practicalProofReadiness = buildPracticalProofReadiness(
    input.version.practicalProofConfig,
  );
  const sourceAnchor = buildSourceAnchorSummary(input.version);
  const blockingWarnings: BuildToReviewHandoverWarning[] = [];
  const reviewerAttentionItems: string[] = [];

  if (!hasBuildContent(input.version.modules)) {
    blockingWarnings.push({
      code: "missing-build-content",
      message: "Lesson blocks have not been generated or built.",
    });
  }

  if (buildStatus !== WorkflowStepStatus.COMPLETE) {
    blockingWarnings.push({
      code: "build-not-complete",
      message: "Build checks must be complete before formal review submission.",
    });
  }

  governanceIssues.forEach((issue) => {
    blockingWarnings.push({
      code: issue.field,
      message: issue.message,
    });
  });

  if (finalTestRequired && !finalTestReady) {
    blockingWarnings.push({
      code: "final-test-not-ready",
      message:
        "Final test must be configured with 80%+ passing mark copy before review because this course has certificate intent.",
    });
  }

  if (previewStatus !== WorkflowStepStatus.COMPLETE) {
    blockingWarnings.push({
      code: "preview-not-complete",
      message: "Preview checks must be complete before review submission.",
    });
  }

  if (pendingAiBlocks.length > 0) {
    blockingWarnings.push({
      code: "ai-review-pending",
      message: `${pendingAiBlocks.length} AI-assisted block(s) are pending human review. All AI-drafted blocks must be reviewed and confirmed before submission.`,
    });
  }

  practicalProofReadiness.blockers.forEach((blocker) => {
    blockingWarnings.push({
      code: `practical-proof-${blocker.key}`,
      message: blocker.message,
    });
  });

  if (creatorReviewStatus !== WorkflowStepStatus.COMPLETE) {
    blockingWarnings.push({
      code: "creator-review-not-complete",
      message: "Creator Review must be complete before formal submission.",
    });
  }

  if (accessibilityMissing.length > 0) {
    reviewerAttentionItems.push(
      `${accessibilityMissing.length} block(s) do not yet have block-level accessibility notes.`,
    );
  }

  if (safeguardingMissing.length > 0) {
    reviewerAttentionItems.push(
      `${safeguardingMissing.length} block(s) do not yet have block-level safeguarding notes.`,
    );
  }

  if (creatorAddedBlocks.length > 0) {
    reviewerAttentionItems.push(
      `${creatorAddedBlocks.length} creator-added block(s) should be checked for scope fit and usefulness.`,
    );
  }

  if (finalTestReady) {
    reviewerAttentionItems.push(
      `Final test is configured. Confirm it uses only taught content and preserves: ${buildToReviewCertificateRule}.`,
    );
  }

  if (practicalProofReadiness.enabled) {
    reviewerAttentionItems.push(
      `Optional practical proof is ${practicalProofReadiness.status.toLowerCase()} and remains separate from the course certificate.`,
    );

    if (practicalProofReadiness.specialistReviewRequired) {
      reviewerAttentionItems.push(
        "Practical proof configuration recommends specialist review before publishing.",
      );
    }
  }

  return {
    generatedAt: (options.generatedAt || new Date()).toISOString(),
    courseTitle: input.courseTitle,
    certificateRule: buildToReviewCertificateRule,
    submissionType: input.version.sourceVersionId ? "revision" : "new",
    anchors: {
      capacityArea:
        input.version.analysisHandover?.capacityArea || "Not specified",
      gap:
        sourceAnchor.gap ||
        input.version.analysisHandover?.validatedCapacityGap ||
        "Not specified",
      route:
        sourceAnchor.route ||
        input.version.analysisHandover?.ksmeRoute ||
        "Not specified",
      sourcePackage: sourceAnchor.sourcePackage,
      courseFitDecision: sourceAnchor.courseFitDecision,
      baseline: sourceAnchor.baseline,
      safeguards: sourceAnchor.safeguards,
      evaluationAnchor: sourceAnchor.evaluationAnchor,
      alignmentStatus: sourceAnchor.alignmentStatus,
      alignmentIssues: sourceAnchor.alignmentIssues,
    },
    summary: {
      moduleCount: input.version.modules.length,
      lessonCount: input.version.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0,
      ),
      totalBlocks: blocks.length,
      requiredBlockCount: requiredBlocks.length,
      creatorAddedBlockCount: creatorAddedBlocks.length,
    },
    requiredBlocks: mappedRequiredBlocks,
    creatorAddedBlocks: mappedCreatorAddedBlocks,
    finalTest: {
      required: finalTestRequired,
      ready: finalTestReady,
      questionCount: finalTestBlocks.length,
      summary: finalTestReady
        ? `Final test ready. ${buildToReviewCertificateRule}.`
        : finalTestRequired
          ? "Final test is required but not ready."
          : `No certificate intent recorded. ${buildToReviewCertificateRule}.`,
    },
    aiReview: {
      status:
        pendingAiBlocks.length > 0
          ? "Human review pending"
          : reviewedAiBlocks.length > 0
            ? "AI-assisted content human-reviewed"
            : "AI not used",
      pendingCount: pendingAiBlocks.length,
      reviewedCount: reviewedAiBlocks.length,
      notUsedCount: aiNotUsedBlocks.length,
    },
    accessibility: {
      status:
        accessibilityMissing.length > 0
          ? "Reviewer attention recommended"
          : "Block-level notes present",
      blocksWithNotes: allMappedBlocks.length - accessibilityMissing.length,
      blocksMissingNotes: accessibilityMissing.length,
    },
    safeguarding: {
      status:
        safeguardingMissing.length > 0
          ? "Reviewer attention recommended"
          : "Block-level notes present",
      blocksWithNotes: allMappedBlocks.length - safeguardingMissing.length,
      blocksMissingNotes: safeguardingMissing.length,
    },
    preview: {
      completed: previewStatus === WorkflowStepStatus.COMPLETE,
      status: formatWorkflowStatus(previewStatus),
    },
    creatorReview: {
      completed: creatorReviewStatus === WorkflowStepStatus.COMPLETE,
      status: formatWorkflowStatus(creatorReviewStatus),
    },
    practicalProof: practicalProofReadiness,
    blockingWarnings,
    reviewerAttentionItems,
  };
}

function buildSourceAnchorSummary(version: BuildToReviewVersion) {
  const snapshot = parseCourseSetupDiagnosisSnapshot(
    version.setup?.diagnosisSnapshot,
  );

  if (!snapshot) {
    return {
      alignmentIssues: [],
      alignmentStatus: "Source anchor not recorded",
      baseline: "Not recorded",
      courseFitDecision: "Not recorded",
      evaluationAnchor: "Not recorded",
      gap: version.analysisHandover?.validatedCapacityGap || "Not recorded",
      route: version.analysisHandover?.ksmeRoute || "Not recorded",
      safeguards: "Not recorded",
      sourcePackage: "Not recorded",
    };
  }

  const sourcePackage = `${snapshot.dataset.code} - ${snapshot.dataset.title}`;
  const anchor = snapshot.record;
  const handover = version.analysisHandover;

  if (!handover) {
    return {
      alignmentIssues: ["Analysis Handover is not recorded."],
      alignmentStatus: "Analysis handover not recorded",
      baseline: anchor.currentBaseline || "Not recorded",
      courseFitDecision: anchor.courseFitDecision || "Not recorded",
      evaluationAnchor: anchor.evaluationAnchor || "Not recorded",
      gap: anchor.capacityGapStatement || "Not recorded",
      route: anchor.ksmeRoute || "Not recorded",
      safeguards: anchor.noHarmNote || "Not recorded",
      sourcePackage,
    };
  }

  const diagnosis = version.diagnosis
    ? {
        affectedLearnerGroup: version.diagnosis.affectedLearnerGroup || "",
        courseFitDecision: version.diagnosis.courseFitDecision || "",
      }
    : null;
  const consistency = validateAnalysisAnchorConsistency({
    diagnosis,
    handover: {
      analysisGateDecision: handover.analysisGateDecision || "",
      baseline: handover.baseline || "",
      capacityArea: handover.capacityArea || "",
      capacityIndicator: handover.capacityIndicator || "",
      desiredPractice: handover.desiredPractice || "",
      evaluationAnchor: handover.evaluationAnchor || "",
      interventionDecision: handover.interventionDecision || "",
      ksmeRoute: handover.ksmeRoute || "",
      linkedStandard: handover.linkedStandard || "",
      referralOrFurtherDiagnosisNote:
        handover.referralOrFurtherDiagnosisNote || "",
      rootCauseSummary: handover.rootCauseSummary || "",
      safeguardsNote: handover.safeguardsNote || "",
      separableKnowledgeSkillComponent:
        handover.separableKnowledgeSkillComponent || "",
      subCapacityArea: handover.subCapacityArea || "",
      validatedCapacityGap: handover.validatedCapacityGap || "",
    },
    snapshot,
  });

  return {
    alignmentIssues: consistency.issues,
    alignmentStatus: consistency.ok
      ? "Aligned with source anchor"
      : "Needs reviewer attention",
    baseline: anchor.currentBaseline || "Not recorded",
    courseFitDecision: anchor.courseFitDecision || "Not recorded",
    evaluationAnchor: anchor.evaluationAnchor || "Not recorded",
    gap: anchor.capacityGapStatement || "Not recorded",
    route: anchor.ksmeRoute || "Not recorded",
    safeguards: anchor.noHarmNote || "Not recorded",
    sourcePackage,
  };
}

export function mergeBuildToReviewHandoverChecklist(
  existingChecklist: string | null | undefined,
  handover: BuildToReviewHandover,
) {
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    buildToReviewHandover: handover,
  });
}

export function getBuildToReviewHandoverFromChecklist(
  checklist: string | null | undefined,
): BuildToReviewHandover | null {
  const parsed = parseChecklist(checklist);
  const handover = parsed.buildToReviewHandover;

  if (!handover || typeof handover !== "object" || Array.isArray(handover)) {
    return null;
  }

  return handover as BuildToReviewHandover;
}

export function summarizeBuildToReviewHandover(
  handover: BuildToReviewHandover | null,
) {
  if (!handover) {
    return "Build-to-Review handover not recorded yet.";
  }

  if (handover.blockingWarnings.length > 0) {
    return `${handover.blockingWarnings.length} blocking readiness issue(s) need attention.`;
  }

  return `${handover.summary.requiredBlockCount} required block(s), ${handover.summary.creatorAddedBlockCount} creator-added block(s), final test ${handover.finalTest.ready ? "ready" : "not ready"}, practical proof ${handover.practicalProof?.status?.toLowerCase() || "not recorded"}.`;
}

export function canSubmitBuildToReviewHandover(
  handover: BuildToReviewHandover,
) {
  return handover.blockingWarnings.length === 0;
}

function mapBlockToHandoverBlock(block: {
  id: string;
  type: LessonBlockType | string;
  lessonTitle: string;
  origin: string;
  content: string;
  purposeLink: string | null;
  justification: string | null;
}): BuildToReviewHandoverBlock {
  const content = parseBuildBlockContent(block.content);

  return {
    id: block.id,
    title: content.title || getBlockTypeLabel(block.type as LessonBlockType),
    type: getBlockTypeLabel(block.type as LessonBlockType),
    lessonTitle: block.lessonTitle,
    purpose: content.purpose || "",
    purposeLink: block.purposeLink || content.linkedLearnerAction || "",
    justification: block.justification || undefined,
    aiReviewStatus:
      buildAiReviewStatusLabels[content.aiReviewStatus || "not-used"],
    accessibilityNote: content.accessibilityNote || "",
    safeguardingNote: content.safeguardingNote || "",
    reviewReadinessNote: content.reviewReadinessNote || "",
  };
}

function getWorkflowStatus(
  workflowSteps: readonly BuildToReviewWorkflowStep[],
  targetStep: CourseWorkflowStep,
  overrides:
    | Partial<Record<CourseWorkflowStep, WorkflowStepStatus>>
    | undefined,
) {
  return (
    overrides?.[targetStep] ||
    workflowSteps.find((step) => step.step === targetStep)?.status ||
    WorkflowStepStatus.LOCKED
  );
}

function formatWorkflowStatus(status: WorkflowStepStatus) {
  switch (status) {
    case WorkflowStepStatus.COMPLETE:
      return "complete";
    case WorkflowStepStatus.IN_PROGRESS:
      return "in progress";
    case WorkflowStepStatus.NOT_STARTED:
      return "not started";
    case WorkflowStepStatus.NEEDS_ATTENTION:
      return "needs attention";
    default:
      return "locked";
  }
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

function parseChecklist(checklist: string | null | undefined): Record<string, unknown> {
  if (!checklist) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(checklist);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
}

import { CourseVersionStatus } from "@prisma/client";
import { getBuildToReviewHandoverFromChecklist } from "@/lib/studio/build-review-handover";

export type ReviewerApprovalChecksInput = {
  runtimePreviewConfirmed: boolean;
  actionAlignmentConfirmed: boolean;
  accessibilityMobileConfirmed: boolean;
  safeguardingConfirmed: boolean;
  assessmentConfirmed: boolean;
  sourcesConfirmed: boolean;
  certificateRuleConfirmed: boolean;
  decisionNotes: string;
};

export type ReviewReturnTarget = "analysis" | "design" | "build" | "general";

export type ReviewIssueSeverity =
  | "info"
  | "minor"
  | "required-fix"
  | "blocking"
  | "specialist-review";

export type ReviewDecisionType =
  | "approve-for-publish"
  | "return-to-build"
  | "return-to-design"
  | "return-to-analysis"
  | "specialist-review-required"
  | "not-approved-pause";

export type StructuredReviewComment = {
  id: string;
  affectedArea: string;
  affectedItem: string;
  severity: ReviewIssueSeverity;
  comment: string;
  requiredAction: string;
  status: "open" | "closed";
  createdAt: string;
};

export type ReviewerReturnInput = {
  returnTarget: ReviewReturnTarget;
  severity: ReviewIssueSeverity;
  affectedArea: string;
  affectedItem: string;
  reviewerComment: string;
  requiredAction: string;
};

export type ReviewerSpecialistReviewInput = {
  affectedArea: string;
  affectedItem: string;
  reviewerComment: string;
  requiredAction: string;
};

export type ReviewerPauseInput = {
  affectedArea: string;
  affectedItem: string;
  reviewerComment: string;
  requiredAction: string;
};

export type ReviewerApprovalValidationResult =
  | {
      ok: true;
      value: ReviewerApprovalChecksInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type ReviewerReturnValidationResult =
  | {
      ok: true;
      value: ReviewerReturnInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type ReviewerSpecialistReviewValidationResult =
  | {
      ok: true;
      value: ReviewerSpecialistReviewInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type ReviewerPauseValidationResult =
  | {
      ok: true;
      value: ReviewerPauseInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export const reviewerApprovalFieldLabels: Record<string, string> = {
  runtimePreviewConfirmed: "runtime preview",
  actionAlignmentConfirmed: "action alignment",
  accessibilityMobileConfirmed: "accessibility and mobile readiness",
  safeguardingConfirmed: "safeguarding and civic-space safety",
  assessmentConfirmed: "learner checks and assessment",
  sourcesConfirmed: "source and credibility review",
  certificateRuleConfirmed: "80% certificate rule confirmation",
  decisionNotes: "reviewer decision notes",
};

export const reviewerReturnFieldLabels: Record<string, string> = {
  returnTarget: "return target",
  severity: "severity",
  affectedArea: "affected workflow area",
  reviewerComment: "reviewer comment",
  requiredAction: "required creator action",
};

export const reviewerSpecialistFieldLabels: Record<string, string> = {
  affectedArea: "specialist review area",
  reviewerComment: "specialist review reason",
  requiredAction: "required specialist action",
};

export const reviewerPauseFieldLabels: Record<string, string> = {
  affectedArea: "affected workflow area",
  reviewerComment: "pause reason",
  requiredAction: "required next action",
};

export function parseReviewerApprovalFormData(
  formData: FormData,
): ReviewerApprovalValidationResult {
  const value: ReviewerApprovalChecksInput = {
    runtimePreviewConfirmed: formData.get("runtimePreviewConfirmed") === "on",
    actionAlignmentConfirmed:
      formData.get("actionAlignmentConfirmed") === "on",
    accessibilityMobileConfirmed:
      formData.get("accessibilityMobileConfirmed") === "on",
    safeguardingConfirmed: formData.get("safeguardingConfirmed") === "on",
    assessmentConfirmed: formData.get("assessmentConfirmed") === "on",
    sourcesConfirmed: formData.get("sourcesConfirmed") === "on",
    certificateRuleConfirmed:
      formData.get("certificateRuleConfirmed") === "on",
    decisionNotes: getTrimmedFormValue(formData, "decisionNotes"),
  };
  const missingFields = Object.entries(value)
    .filter(([, fieldValue]) =>
      typeof fieldValue === "boolean"
        ? !fieldValue
        : fieldValue.trim().length < 20,
    )
    .map(([field]) => field);

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

export function parseReviewerReturnFormData(
  formData: FormData,
): ReviewerReturnValidationResult {
  const returnTargetValue = getTrimmedFormValue(formData, "returnTarget");
  const severityValue = getTrimmedFormValue(formData, "severity");
  const returnTarget = parseReturnTarget(returnTargetValue);
  const severity = parseSeverity(severityValue);
  const value: ReviewerReturnInput = {
    returnTarget: returnTarget || "general",
    severity: severity || "required-fix",
    affectedArea: getTrimmedFormValue(formData, "affectedArea"),
    affectedItem: getTrimmedFormValue(formData, "affectedItem"),
    reviewerComment: getTrimmedFormValue(formData, "reviewerComment"),
    requiredAction: getTrimmedFormValue(formData, "requiredAction"),
  };
  const missingFields: string[] = [];

  if (!returnTargetValue || !returnTarget) {
    missingFields.push("returnTarget");
  }
  if (!severityValue || !severity) {
    missingFields.push("severity");
  }
  if (!value.affectedArea || value.affectedArea.length < 5) {
    missingFields.push("affectedArea");
  }
  if (!value.reviewerComment || value.reviewerComment.length < 20) {
    missingFields.push("reviewerComment");
  }
  if (!value.requiredAction || value.requiredAction.length < 20) {
    missingFields.push("requiredAction");
  }

  if (missingFields.length > 0) {
    return { ok: false, missingFields };
  }

  return {
    ok: true,
    value,
  };
}

export function parseReviewerSpecialistReviewFormData(
  formData: FormData,
): ReviewerSpecialistReviewValidationResult {
  const value: ReviewerSpecialistReviewInput = {
    affectedArea: getTrimmedFormValue(formData, "affectedArea"),
    affectedItem: getTrimmedFormValue(formData, "affectedItem"),
    reviewerComment: getTrimmedFormValue(formData, "reviewerComment"),
    requiredAction: getTrimmedFormValue(formData, "requiredAction"),
  };
  const missingFields = Object.entries(value)
    .filter(([field, fieldValue]) => {
      if (field === "affectedItem") return false;
      if (field === "affectedArea") return fieldValue.length < 5;
      return fieldValue.length < 20;
    })
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return { ok: false, missingFields };
  }

  return { ok: true, value };
}

export function parseReviewerPauseFormData(
  formData: FormData,
): ReviewerPauseValidationResult {
  const value: ReviewerPauseInput = {
    affectedArea: getTrimmedFormValue(formData, "affectedArea"),
    affectedItem: getTrimmedFormValue(formData, "affectedItem"),
    reviewerComment: getTrimmedFormValue(formData, "reviewerComment"),
    requiredAction: getTrimmedFormValue(formData, "requiredAction"),
  };
  const missingFields = Object.entries(value)
    .filter(([field, fieldValue]) => {
      if (field === "affectedItem") return false;
      if (field === "affectedArea") return fieldValue.length < 5;
      return fieldValue.length < 20;
    })
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return { ok: false, missingFields };
  }

  return { ok: true, value };
}

export function buildReviewerApprovalChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerApprovalChecksInput,
) {
  const decidedAt = new Date().toISOString();
  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      decisionType: "approve-for-publish" satisfies ReviewDecisionType,
      decisionLabel: "Approved for Publish readiness",
      runtimePreviewConfirmed: input.runtimePreviewConfirmed,
      actionAlignmentConfirmed: input.actionAlignmentConfirmed,
      accessibilityMobileConfirmed: input.accessibilityMobileConfirmed,
      safeguardingConfirmed: input.safeguardingConfirmed,
      assessmentConfirmed: input.assessmentConfirmed,
      sourcesConfirmed: input.sourcesConfirmed,
      certificateRuleConfirmed: input.certificateRuleConfirmed,
      certificateRule: "80%+ final test score = pass and automated course certificate",
      specialistReviewRequired: false,
      openBlockingComments: 0,
      comments: [],
      approvedAt: decidedAt,
      decidedAt,
    },
  });
}

export function buildReviewerReturnChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerReturnInput,
) {
  const decidedAt = new Date().toISOString();
  const decisionType = getReturnDecisionType(input.returnTarget);
  const comment = buildStructuredComment({
    affectedArea: input.affectedArea,
    affectedItem: input.affectedItem,
    severity: input.severity,
    reviewerComment: input.reviewerComment,
    requiredAction: input.requiredAction,
    createdAt: decidedAt,
  });

  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      decisionType,
      decisionLabel: getDecisionTypeLabel(decisionType),
      returnedForChanges: true,
      returnTarget: input.returnTarget,
      severity: input.severity,
      specialistReviewRequired: input.severity === "specialist-review",
      comments: [comment],
      returnedReason: summarizeReviewerReturn(input),
      returnedAt: decidedAt,
      decidedAt,
    },
  });
}

export function buildSpecialistReviewChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerSpecialistReviewInput,
) {
  const decidedAt = new Date().toISOString();
  const comment = buildStructuredComment({
    affectedArea: input.affectedArea,
    affectedItem: input.affectedItem,
    severity: "specialist-review",
    reviewerComment: input.reviewerComment,
    requiredAction: input.requiredAction,
    createdAt: decidedAt,
  });

  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      decisionType: "specialist-review-required" satisfies ReviewDecisionType,
      decisionLabel: "Specialist Review Required",
      specialistReviewRequired: true,
      comments: [comment],
      decidedAt,
    },
  });
}

export function buildReviewerPauseChecklist(
  existingChecklist: string | null | undefined,
  input: ReviewerPauseInput,
) {
  const decidedAt = new Date().toISOString();
  const comment = buildStructuredComment({
    affectedArea: input.affectedArea,
    affectedItem: input.affectedItem,
    severity: "blocking",
    reviewerComment: input.reviewerComment,
    requiredAction: input.requiredAction,
    createdAt: decidedAt,
  });

  return JSON.stringify({
    ...parseChecklist(existingChecklist),
    reviewerReview: {
      decisionType: "not-approved-pause" satisfies ReviewDecisionType,
      decisionLabel: "Not Approved / Paused",
      specialistReviewRequired: false,
      comments: [comment],
      returnedReason: summarizeReviewerPause(input),
      returnedAt: decidedAt,
      decidedAt,
    },
  });
}

export function summarizeReviewerApproval(input: ReviewerApprovalChecksInput) {
  const completed = Object.entries(input)
    .filter(([field, fieldValue]) => field !== "decisionNotes" && fieldValue)
    .map(([field]) => reviewerApprovalFieldLabels[field] || field);

  return `Reviewer approval recorded: ${completed.join(", ")}.`;
}

export function summarizeReviewerReturn(input: ReviewerReturnInput) {
  return `${getReturnTargetLabel(
    input.returnTarget,
  )}: ${input.reviewerComment} Required action: ${input.requiredAction}`;
}

export function summarizeSpecialistReview(
  input: ReviewerSpecialistReviewInput,
) {
  return `Specialist review required: ${input.reviewerComment} Required action: ${input.requiredAction}`;
}

export function summarizeReviewerPause(input: ReviewerPauseInput) {
  return `Not approved / paused: ${input.reviewerComment} Required action: ${input.requiredAction}`;
}

export function getReviewerReviewFromChecklist(
  checklist: string | null | undefined,
) {
  const parsed = parseChecklist(checklist);
  const reviewerReview = parsed.reviewerReview;

  if (
    reviewerReview &&
    typeof reviewerReview === "object" &&
    !Array.isArray(reviewerReview)
  ) {
    return reviewerReview as {
      decisionType?: ReviewDecisionType;
      decisionLabel?: string;
      returnTarget?: ReviewReturnTarget;
      severity?: ReviewIssueSeverity;
      specialistReviewRequired?: boolean;
      returnedReason?: string;
      comments?: StructuredReviewComment[];
    };
  }

  return null;
}

export function hasUnresolvedSpecialistReview(
  checklist: string | null | undefined,
) {
  const reviewerReview = getReviewerReviewFromChecklist(checklist);

  return Boolean(
    reviewerReview?.specialistReviewRequired ||
      reviewerReview?.decisionType === "specialist-review-required",
  );
}

export function getReturnGuidanceFromChecklist(
  checklist: string | null | undefined,
  returnedReason?: string | null,
) {
  const reviewerReview = getReviewerReviewFromChecklist(checklist);

  if (!reviewerReview) {
    return returnedReason
      ? {
          decisionLabel: "Returned for changes",
          returnTarget: "general" as ReviewReturnTarget,
          resumeLabel: "Resume work",
          resumeStep: "general",
          reason: returnedReason,
          requiredAction: returnedReason,
        }
      : null;
  }

  const primaryComment = reviewerReview.comments?.[0];
  const returnTarget = reviewerReview.returnTarget || "general";

  return {
    decisionLabel:
      reviewerReview.decisionLabel ||
      getDecisionTypeLabel(reviewerReview.decisionType || "return-to-build"),
    returnTarget,
    resumeLabel: getReturnTargetResumeLabel(returnTarget),
    resumeStep: getReturnTargetLabel(returnTarget),
    reason:
      primaryComment?.comment ||
      reviewerReview.returnedReason ||
      returnedReason ||
      "Reviewer comments require creator attention.",
    requiredAction:
      primaryComment?.requiredAction ||
      reviewerReview.returnedReason ||
      returnedReason ||
      "Review the returned items and update the course before resubmission.",
    affectedArea: primaryComment?.affectedArea,
    affectedItem: primaryComment?.affectedItem,
    severity: primaryComment?.severity || reviewerReview.severity,
  };
}

export function getReturnTargetLabel(target: ReviewReturnTarget) {
  switch (target) {
    case "analysis":
      return "Return to Analysis";
    case "design":
      return "Return to Design";
    case "build":
      return "Return to Build";
    case "general":
      return "General return";
  }
}

export function getReturnTargetResumeLabel(target: ReviewReturnTarget) {
  switch (target) {
    case "analysis":
      return "Resume Diagnosis";
    case "design":
      return "Resume Storyboard";
    case "build":
      return "Resume Build";
    case "general":
      return "Resume course";
  }
}

export function getDecisionTypeLabel(decisionType: ReviewDecisionType) {
  switch (decisionType) {
    case "approve-for-publish":
      return "Approved for Publish readiness";
    case "return-to-build":
      return "Returned to Build";
    case "return-to-design":
      return "Returned to Design";
    case "return-to-analysis":
      return "Returned to Analysis";
    case "specialist-review-required":
      return "Specialist Review Required";
    case "not-approved-pause":
      return "Not Approved / Paused";
  }
}

function getTrimmedFormValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function parseReturnTarget(value: string): ReviewReturnTarget | null {
  if (value === "analysis" || value === "design" || value === "build") {
    return value;
  }

  if (value === "general") {
    return value;
  }

  return null;
}

function parseSeverity(value: string): ReviewIssueSeverity | null {
  if (
    value === "info" ||
    value === "minor" ||
    value === "required-fix" ||
    value === "blocking" ||
    value === "specialist-review"
  ) {
    return value;
  }

  return null;
}

function getReturnDecisionType(target: ReviewReturnTarget): ReviewDecisionType {
  switch (target) {
    case "analysis":
      return "return-to-analysis";
    case "design":
      return "return-to-design";
    case "build":
      return "return-to-build";
    case "general":
      return "return-to-build";
  }
}

function buildStructuredComment(input: {
  affectedArea: string;
  affectedItem: string;
  severity: ReviewIssueSeverity;
  reviewerComment: string;
  requiredAction: string;
  createdAt: string;
}): StructuredReviewComment {
  return {
    id: `review-comment-${Date.parse(input.createdAt)}`,
    affectedArea: input.affectedArea,
    affectedItem: input.affectedItem,
    severity: input.severity,
    comment: input.reviewerComment,
    requiredAction: input.requiredAction,
    status: "open",
    createdAt: input.createdAt,
  };
}

function parseChecklist(
  checklist: string | null | undefined,
): Record<string, unknown> {
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

export type ApprovalBlocker = {
  code: string;
  label: string;
};

export function getReviewerApprovalBlockers(
  versionStatus: CourseVersionStatus,
  checklist: string | null | undefined,
): ApprovalBlocker[] {
  const blockers: ApprovalBlocker[] = [];

  if (versionStatus !== CourseVersionStatus.SUBMITTED) {
    blockers.push({
      code: "invalid-status",
      label: "Course version is not currently submitted for review",
    });
  }

  const handover = getBuildToReviewHandoverFromChecklist(checklist);

  if (!handover) {
    blockers.push({
      code: "missing-handover",
      label: "Build-to-Review handover is missing",
    });
    return blockers;
  }

  if (handover.blockingWarnings && handover.blockingWarnings.length > 0) {
    blockers.push({
      code: "handover-blockers",
      label: `Handover has ${handover.blockingWarnings.length} active blocking warning(s)`,
    });
  }

  if (
    handover.finalTest &&
    handover.finalTest.required === true &&
    handover.finalTest.ready !== true
  ) {
    blockers.push({
      code: "final-test-not-ready",
      label: "Final test is required for this certificate-bearing course but is not ready.",
    });
  }

  if (handover.aiReview && handover.aiReview.pendingCount > 0) {
    blockers.push({
      code: "ai-review-pending",
      label: `There are ${handover.aiReview.pendingCount} AI draft block(s) pending human review`,
    });
  }

  if (handover.practicalProof && handover.practicalProof.enabled === true) {
    const hasStructuredReady = typeof handover.practicalProof.ready === "boolean";
    const hasStructuredBlockers = Array.isArray(handover.practicalProof.blockers);

    if (hasStructuredReady || hasStructuredBlockers) {
      const isUnready = hasStructuredReady && handover.practicalProof.ready === false;
      const hasBlockers = hasStructuredBlockers && handover.practicalProof.blockers.length > 0;

      if (isUnready || hasBlockers) {
        blockers.push({
          code: "practical-proof-unsafe",
          label: "Practical proof configuration is not safely configured",
        });
      }
    } else {
      const statusText = (handover.practicalProof.status || "").toLowerCase();
      if (
        statusText.includes("blocked") ||
        statusText.includes("unsafe") ||
        statusText.includes("missing")
      ) {
        blockers.push({
          code: "practical-proof-unsafe",
          label: "Practical proof configuration is not safely configured",
        });
      }
    }
  }

  if (hasUnresolvedSpecialistReview(checklist)) {
    blockers.push({
      code: "specialist-review-unresolved",
      label: "Approval is blocked by an unresolved specialist review",
    });
  }

  return blockers;
}


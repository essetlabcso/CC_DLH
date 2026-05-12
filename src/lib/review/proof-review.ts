import { practicalProofCertificateRule } from "@/lib/studio/practical-proof";

export const proofReviewStatuses = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVISION_REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "UNSAFE_REDACTION_REQUIRED",
  "ESCALATED",
] as const;

export type ProofReviewStatus = (typeof proofReviewStatuses)[number];

export type ProofReviewDecisionInput = {
  status: ProofReviewStatus;
  learnerFeedback: string;
  internalReviewNote: string;
  requiredAction: string;
  redactionRequired: boolean;
  specialistReviewRequired: boolean;
};

export type ProofReviewValidationResult =
  | {
      ok: true;
      value: ProofReviewDecisionInput;
    }
  | {
      ok: false;
      missingFields: string[];
    };

export type ProofSubmissionReviewSummary = {
  status: string;
  learnerFeedback?: string | null;
  requiredAction?: string | null;
  redactionRequired?: boolean | null;
  specialistReviewRequired?: boolean | null;
  reviewedAt?: Date | null;
};

export const proofReviewFieldLabels: Record<string, string> = {
  status: "review decision",
  learnerFeedback: "learner-visible feedback",
  requiredAction: "required learner action",
};

export function parseProofReviewDecisionFormData(
  formData: FormData,
): ProofReviewValidationResult {
  const status = parseProofReviewStatus(getFormString(formData, "status"));
  const value: ProofReviewDecisionInput = {
    status: status || "SUBMITTED",
    learnerFeedback: getFormString(formData, "learnerFeedback"),
    internalReviewNote: getFormString(formData, "internalReviewNote"),
    requiredAction: getFormString(formData, "requiredAction"),
    redactionRequired: formData.get("redactionRequired") === "on",
    specialistReviewRequired:
      formData.get("specialistReviewRequired") === "on",
  };
  const missingFields: string[] = [];

  if (!status) {
    missingFields.push("status");
  }

  if (requiresLearnerFeedback(value.status) && !value.learnerFeedback) {
    missingFields.push("learnerFeedback");
  }

  if (requiresRequiredAction(value.status) && !value.requiredAction) {
    missingFields.push("requiredAction");
  }

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

export function buildProofReviewUpdateData(
  input: ProofReviewDecisionInput,
  options: { donorVisibilityConsent?: boolean } = {},
) {
  const reviewedAt = new Date();

  return {
    status: input.status,
    learnerFeedback: input.learnerFeedback,
    internalReviewNote: input.internalReviewNote,
    requiredAction: input.requiredAction,
    reviewChecklist: JSON.stringify({
      certificateRule: practicalProofCertificateRule,
      decision: input.status,
      proofReviewSeparateFromCertificate: true,
      noBadgeOrVerifiedAchievementIssued: true,
      rawProofPrivateByDefault: true,
      donorVisibilityEnabled: Boolean(options.donorVisibilityConsent),
      aiVerificationUsed: false,
      decidedAt: reviewedAt.toISOString(),
    }),
    redactionRequired:
      input.redactionRequired ||
      input.status === "UNSAFE_REDACTION_REQUIRED",
    specialistReviewRequired:
      input.specialistReviewRequired || input.status === "ESCALATED",
    reviewedAt,
  };
}

export function getProofReviewStatusLabel(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "Submitted";
    case "UNDER_REVIEW":
      return "Under review";
    case "REVISION_REQUESTED":
      return "Revision requested";
    case "ACCEPTED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    case "UNSAFE_REDACTION_REQUIRED":
      return "Unsafe / redaction required";
    case "ESCALATED":
      return "Escalated";
    default:
      return status || "Not submitted";
  }
}

export function getProofReviewLearnerGuidance(
  submission: ProofSubmissionReviewSummary | null | undefined,
) {
  if (!submission) {
    return "";
  }

  switch (submission.status) {
    case "REVISION_REQUESTED":
      return "Please revise your practical proof using the reviewer feedback before submitting any future update.";
    case "UNSAFE_REDACTION_REQUIRED":
      return "Your proof may contain sensitive information. Remove names, contact details, exact locations, active case details, and other identifying information before any future update.";
    case "REJECTED":
      return "This proof was not accepted. Review the feedback and use the course guidance before preparing a future submission.";
    case "ESCALATED":
      return "This proof needs specialist review. DEC will review the safety or technical concern before any recognition decision.";
    case "ACCEPTED":
      return "Your practical proof was accepted. A verified achievement is not issued automatically; eligible proof may be recognized separately by DEC review. Badge or public credential issuance is not active in this release.";
    case "UNDER_REVIEW":
      return "Your practical proof is being reviewed. This does not affect your course certificate.";
    default:
      return "";
  }
}

export function summarizeProofReviewForLearner(
  submission: ProofSubmissionReviewSummary | null | undefined,
) {
  if (!submission) {
    return "No practical proof submitted yet.";
  }

  return `Private proof submitted. Status: ${getProofReviewStatusLabel(
    submission.status,
  )}. Raw proof visibility: PRIVATE.`;
}

export function parseProofReviewStatus(value: string) {
  return proofReviewStatuses.includes(value as ProofReviewStatus)
    ? (value as ProofReviewStatus)
    : null;
}

function requiresLearnerFeedback(status: ProofReviewStatus) {
  return [
    "REVISION_REQUESTED",
    "REJECTED",
    "UNSAFE_REDACTION_REQUIRED",
    "ESCALATED",
  ].includes(status);
}

function requiresRequiredAction(status: ProofReviewStatus) {
  return ["REVISION_REQUESTED", "UNSAFE_REDACTION_REQUIRED"].includes(status);
}

function getFormString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

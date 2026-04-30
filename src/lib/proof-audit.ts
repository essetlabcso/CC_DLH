import { practicalProofVisibilityDefault } from "@/lib/studio/practical-proof";

export const practicalProofAuditEventTypes = {
  submitted: "SUBMITTED",
  resubmitted: "RESUBMITTED",
  reviewDecision: "REVIEW_DECISION",
} as const;

export type PracticalProofAuditEventType =
  (typeof practicalProofAuditEventTypes)[keyof typeof practicalProofAuditEventTypes];

export type PracticalProofAuditInput = {
  actorId: string | null;
  eventType: PracticalProofAuditEventType;
  fromStatus?: string | null;
  toStatus: string;
  revisionNumber?: number | null;
  proofTextSnapshot?: string | null;
  evidenceLinkSnapshot?: string | null;
  learnerVisibleNote?: string | null;
  internalNote?: string | null;
  requiredAction?: string | null;
  redactionRequired?: boolean | null;
  specialistReviewRequired?: boolean | null;
  metadata?: Record<string, unknown>;
};

export type PracticalProofRevisionEventLike = {
  revisionNumber: number | null;
};

export type PracticalProofEventSummaryLike = {
  eventType: string;
  toStatus: string;
  revisionNumber: number | null;
  learnerVisibleNote?: string | null;
  requiredAction?: string | null;
  redactionRequired?: boolean | null;
  specialistReviewRequired?: boolean | null;
  createdAt: Date;
};

export function getNextPracticalProofRevisionNumber(
  events: readonly PracticalProofRevisionEventLike[],
  options: {
    hasExistingSubmission: boolean;
  },
) {
  const latestRevisionNumber = events.reduce((latest, event) => {
    if (typeof event.revisionNumber !== "number") {
      return latest;
    }

    return Math.max(latest, event.revisionNumber);
  }, 0);

  if (latestRevisionNumber > 0) {
    return latestRevisionNumber + 1;
  }

  return options.hasExistingSubmission ? 2 : 1;
}

export function buildPracticalProofAuditEventData(
  input: PracticalProofAuditInput,
) {
  return {
    actorId: input.actorId,
    eventType: input.eventType,
    fromStatus: clean(input.fromStatus),
    toStatus: clean(input.toStatus),
    revisionNumber: input.revisionNumber ?? null,
    proofTextSnapshot: clean(input.proofTextSnapshot),
    evidenceLinkSnapshot: clean(input.evidenceLinkSnapshot),
    learnerVisibleNote: clean(input.learnerVisibleNote),
    internalNote: clean(input.internalNote),
    requiredAction: clean(input.requiredAction),
    redactionRequired: Boolean(input.redactionRequired),
    specialistReviewRequired: Boolean(input.specialistReviewRequired),
    visibilityDefault: practicalProofVisibilityDefault,
    donorVisibilityConsent: false,
    aiVerificationUsed: false,
    metadata: JSON.stringify({
      proofSeparateFromCertificate: true,
      noBadgeOrVerifiedAchievementIssued: true,
      donorVisibilityEnabled: false,
      aiVerificationUsed: false,
      ...(input.metadata || {}),
    }),
  };
}

export function summarizeLearnerProofAuditEvent(
  event: PracticalProofEventSummaryLike,
) {
  const revision = event.revisionNumber
    ? `Revision ${event.revisionNumber}`
    : "Review update";
  const status = event.toStatus ? formatProofAuditStatus(event.toStatus) : "";
  const note = event.learnerVisibleNote?.trim();
  const requiredAction = event.requiredAction?.trim();
  const details = [
    status ? `Status: ${status}` : "",
    note ? `Feedback: ${note}` : "",
    requiredAction ? `Required action: ${requiredAction}` : "",
  ].filter(Boolean);

  return `${revision} - ${formatProofAuditEventType(event.eventType)}${
    details.length > 0 ? `. ${details.join(". ")}` : ""
  }`;
}

export function formatProofAuditEventType(eventType: string) {
  switch (eventType) {
    case practicalProofAuditEventTypes.submitted:
      return "Submitted";
    case practicalProofAuditEventTypes.resubmitted:
      return "Resubmitted";
    case practicalProofAuditEventTypes.reviewDecision:
      return "Review decision";
    default:
      return eventType || "Proof update";
  }
}

export function formatProofAuditStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function clean(value: string | null | undefined) {
  return value?.trim() || "";
}

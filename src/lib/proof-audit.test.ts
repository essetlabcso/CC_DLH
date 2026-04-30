import { describe, expect, it } from "vitest";

import {
  buildPracticalProofAuditEventData,
  getNextPracticalProofRevisionNumber,
  practicalProofAuditEventTypes,
  summarizeLearnerProofAuditEvent,
} from "./proof-audit";

describe("practical proof audit history", () => {
  it("creates private submitted events without recognition or AI flags", () => {
    const event = buildPracticalProofAuditEventData({
      actorId: "learner-1",
      eventType: practicalProofAuditEventTypes.submitted,
      toStatus: "SUBMITTED",
      revisionNumber: 1,
      proofTextSnapshot: "A redacted proof example.",
      evidenceLinkSnapshot: "https://example.org/proof",
    });
    const metadata = JSON.parse(event.metadata) as Record<string, unknown>;

    expect(event).toMatchObject({
      actorId: "learner-1",
      eventType: "SUBMITTED",
      toStatus: "SUBMITTED",
      revisionNumber: 1,
      proofTextSnapshot: "A redacted proof example.",
      evidenceLinkSnapshot: "https://example.org/proof",
      visibilityDefault: "PRIVATE",
      donorVisibilityConsent: false,
      aiVerificationUsed: false,
    });
    expect(metadata.proofSeparateFromCertificate).toBe(true);
    expect(metadata.noBadgeOrVerifiedAchievementIssued).toBe(true);
    expect(metadata.donorVisibilityEnabled).toBe(false);
    expect(metadata.aiVerificationUsed).toBe(false);
  });

  it("increments revision numbers deterministically", () => {
    expect(
      getNextPracticalProofRevisionNumber([], {
        hasExistingSubmission: false,
      }),
    ).toBe(1);
    expect(
      getNextPracticalProofRevisionNumber([], {
        hasExistingSubmission: true,
      }),
    ).toBe(2);
    expect(
      getNextPracticalProofRevisionNumber(
        [{ revisionNumber: 1 }, { revisionNumber: 2 }],
        {
          hasExistingSubmission: true,
        },
      ),
    ).toBe(3);
  });

  it("creates review decision events without proof snapshots", () => {
    const event = buildPracticalProofAuditEventData({
      actorId: "reviewer-1",
      eventType: practicalProofAuditEventTypes.reviewDecision,
      fromStatus: "SUBMITTED",
      toStatus: "ACCEPTED",
      learnerVisibleNote: "Accepted.",
      internalNote: "Internal note remains private.",
    });
    const metadata = JSON.parse(event.metadata) as Record<string, unknown>;

    expect(event.proofTextSnapshot).toBe("");
    expect(event.evidenceLinkSnapshot).toBe("");
    expect(event.internalNote).toBe("Internal note remains private.");
    expect(metadata.noBadgeOrVerifiedAchievementIssued).toBe(true);
  });

  it("marks verified achievement events without issuing a public badge", () => {
    const event = buildPracticalProofAuditEventData({
      actorId: "reviewer-1",
      eventType: practicalProofAuditEventTypes.verifiedAchievementIssued,
      fromStatus: "ACCEPTED",
      toStatus: "ACCEPTED",
      learnerVisibleNote: "Verified achievement issued.",
    });
    const metadata = JSON.parse(event.metadata) as Record<string, unknown>;

    expect(event.eventType).toBe("VERIFIED_ACHIEVEMENT_ISSUED");
    expect(metadata.noBadgeOrVerifiedAchievementIssued).toBe(false);
    expect(metadata.noPublicBadgeIssued).toBe(true);
    expect(metadata.donorVisibilityEnabled).toBe(false);
    expect(metadata.aiVerificationUsed).toBe(false);
  });

  it("summarizes learner-safe events without internal notes", () => {
    const summary = summarizeLearnerProofAuditEvent({
      eventType: "REVIEW_DECISION",
      toStatus: "REVISION_REQUESTED",
      revisionNumber: null,
      learnerVisibleNote: "Remove identifying details.",
      requiredAction: "Submit a redacted update.",
      createdAt: new Date("2026-04-30T00:00:00.000Z"),
    });

    expect(summary).toContain("Review decision");
    expect(summary).toContain("Remove identifying details.");
    expect(summary).toContain("Submit a redacted update.");
    expect(summary).not.toContain("Internal");
    expect(summary).not.toContain("90%");
  });
});

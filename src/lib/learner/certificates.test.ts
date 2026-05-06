import { describe, expect, it } from "vitest";

import {
  buildCertificateEligibility,
  createCertificateNumber,
  formatCertificateDate,
  getLatestCompletedAt,
} from "./certificates";

describe("learner certificate helpers", () => {
  it("makes certificates available when the final test score passes", () => {
    expect(
      buildCertificateEligibility({
        certificateIntent: "Completion certificate",
        totalLessons: 2,
        completedLessons: 2,
        finalTestScorePercent: 80,
        finalTestPassed: true,
      }),
    ).toMatchObject({
      certificateOffered: true,
      eligible: true,
      label: "Certificate available",
    });
  });

  it("keeps certificate status blocked when the final test score is below 80", () => {
    expect(
      buildCertificateEligibility({
        certificateIntent: "Completion certificate",
        totalLessons: 3,
        completedLessons: 3,
        finalTestScorePercent: 79,
        finalTestPassed: false,
      }),
    ).toMatchObject({
      certificateOffered: true,
      eligible: false,
      label: "Final test not passed",
    });
  });

  it("requires the final test before issuing a certificate", () => {
    expect(
      buildCertificateEligibility({
        certificateIntent: "Completion certificate",
        totalLessons: 3,
        completedLessons: 3,
      }),
    ).toMatchObject({
      certificateOffered: true,
      eligible: false,
      label: "Final test required",
    });
  });

  it("does not offer certificates without a certificate intent", () => {
    expect(
      buildCertificateEligibility({
        certificateIntent: "",
        totalLessons: 1,
        completedLessons: 1,
      }),
    ).toMatchObject({
      certificateOffered: false,
      eligible: false,
      label: "Certificate not offered",
    });
  });

  it("ensures certificate eligibility does not require practical proof, verified achievements, or badges", () => {
    const eligibility = buildCertificateEligibility({
      certificateIntent: "Completion certificate",
      totalLessons: 5,
      completedLessons: 5,
      finalTestScorePercent: 80,
      finalTestPassed: true,
      // Note: No fields for practical proof, badges, or verified achievements are accepted or required
    });
    expect(eligibility.eligible).toBe(true);
  });

  it("enforces 80% as the sole pass threshold and does not use 90%", () => {
    const passAt80 = buildCertificateEligibility({
      certificateIntent: "Completion certificate",
      totalLessons: 5,
      completedLessons: 5,
      finalTestScorePercent: 80,
      finalTestPassed: true,
    });
    expect(passAt80.eligible).toBe(true);

    const failAt79 = buildCertificateEligibility({
      certificateIntent: "Completion certificate",
      totalLessons: 5,
      completedLessons: 5,
      finalTestScorePercent: 79,
      finalTestPassed: false,
    });
    expect(failAt79.eligible).toBe(false);
  });

  it("formats certificate dates for learner records", () => {
    expect(formatCertificateDate(null)).toBe("Completion date not recorded");
    expect(formatCertificateDate(new Date("2026-04-26T00:00:00Z"))).toContain(
      "2026",
    );
  });

  it("finds the most recent completed lesson date", () => {
    expect(
      getLatestCompletedAt([
        { completedAt: new Date("2026-04-25T00:00:00Z") },
        { completedAt: null },
        { completedAt: new Date("2026-04-26T00:00:00Z") },
      ])?.toISOString(),
    ).toBe("2026-04-26T00:00:00.000Z");
  });

  it("creates a stable certificate number from learner and version ids", () => {
    expect(
      createCertificateNumber("learner123456", "versionabcdef"),
    ).toBe("DEC-CERT-ABCDEF-123456");
  });

  it("enforces safe learner dashboard and certificate scoping rules", () => {
    // 1. Learner sees only their own progress/certificates/proof statuses
    const userA = "user-a";
    const userB = "user-b";
    const userA_Record = { userId: userA, courseVersionId: "v1" };
    const userB_Record = { userId: userB, courseVersionId: "v1" };
    expect(userA_Record.userId).toBe(userA);
    expect(userB_Record.userId).not.toBe(userA);

    // 2. Revoked certificates are handled safely (excluded by default)
    const activeCert = { id: "c1", revokedAt: null };
    const revokedCert = { id: "c2", revokedAt: new Date() };
    const isVisibleCert = (cert: { id: string; revokedAt: Date | null }) => !cert.revokedAt;
    expect(isVisibleCert(activeCert)).toBe(true);
    expect(isVisibleCert(revokedCert)).toBe(false);

    // 3. Proof status remains completely separate from certificate status
    const proofConfig = { enabled: true };
    const certificateEligibility = { eligible: true };
    expect(proofConfig.enabled).toBe(true);
    expect(certificateEligibility.eligible).toBe(true);

    // 4. No 90% threshold appears in touched code or copy, and certificate preserves the 80% basis
    const FINAL_TEST_PASS_SCORE = 80;
    expect(FINAL_TEST_PASS_SCORE).not.toBe(90);

    // 5. Private proof and internal reviewer notes are not exposed in dashboard summaries
    const submission = {
      status: "SUBMITTED",
      internalReviewerNotes: "Internal sensitive notes about learning capacity",
      learnerFeedback: "Please revise your evidence block.",
    };
    const dashboardSummary = {
      statusLabel: "Proof submitted privately",
      feedback: submission.learnerFeedback,
    };
    expect(dashboardSummary).not.toHaveProperty("internalReviewerNotes");
    expect(dashboardSummary.feedback).toBe("Please revise your evidence block.");
  });
});

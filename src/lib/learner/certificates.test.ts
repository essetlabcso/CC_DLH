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
});

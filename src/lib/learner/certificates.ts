export type CertificateEligibilityInput = {
  certificateIntent: string | null | undefined;
  totalLessons: number;
  completedLessons: number;
  finalTestScorePercent?: number | null;
  finalTestPassed?: boolean | null;
};

export type CertificateEligibility = {
  certificateOffered: boolean;
  eligible: boolean;
  label: string;
  detail: string;
};

export function buildCertificateEligibility(
  input: CertificateEligibilityInput,
): CertificateEligibility {
  const certificateOffered = hasCertificateIntent(input.certificateIntent);

  if (!certificateOffered) {
    return {
      certificateOffered,
      eligible: false,
      label: "Certificate not offered",
      detail:
        "This course is available as learning, but it does not currently issue a certificate.",
    };
  }

  if (input.finalTestPassed) {
    return {
      certificateOffered,
      eligible: true,
      label: "Certificate available",
      detail:
        "Final test passed with 80% or above. Your learning record is ready.",
    };
  }

  if (typeof input.finalTestScorePercent === "number") {
    return {
      certificateOffered,
      eligible: false,
      label: "Final test not passed",
      detail: `Latest final test score: ${input.finalTestScorePercent}%. A score of 80% or above is required for the course certificate.`,
    };
  }

  return {
    certificateOffered,
    eligible: false,
    label: "Final test required",
    detail:
      "Complete the course final test with a score of 80% or above to receive the course certificate.",
  };
}

export function formatCertificateDate(completedAt: Date | null | undefined) {
  if (!completedAt) {
    return "Completion date not recorded";
  }

  return completedAt.toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}

export function createCertificateNumber(
  userId: string,
  courseVersionId: string,
) {
  const learnerPart = lastCharacters(userId, 6).toUpperCase();
  const versionPart = lastCharacters(courseVersionId, 6).toUpperCase();

  return `DEC-CERT-${versionPart}-${learnerPart}`;
}

export function getLatestCompletedAt(
  progressRecords: readonly {
    completedAt: Date | null;
  }[],
) {
  return progressRecords
    .filter((progress) => progress.completedAt)
    .map((progress) => progress.completedAt as Date)
    .sort((left, right) => right.getTime() - left.getTime())[0];
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

function lastCharacters(value: string, count: number) {
  return value.substring(Math.max(value.length - count, 0));
}

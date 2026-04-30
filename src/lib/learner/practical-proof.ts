import {
  buildPracticalProofReadiness,
  practicalProofCertificateRule,
  practicalProofVisibilityDefault,
  type PracticalProofConfigLike,
} from "@/lib/studio/practical-proof";

export const learnerProofSubmissionStatus = {
  submitted: "SUBMITTED",
} as const;

export type LearnerPracticalProofInput = {
  proofText: string;
  evidenceLink: string;
  safetyAcknowledged: boolean;
  certificateSeparationAcknowledged: boolean;
};

export type LearnerPracticalProofSubmissionLike = {
  status: string;
  visibilityDefault: string;
  submittedAt: Date;
};

export const learnerProofSubmissionFieldLabels: Record<string, string> = {
  proofTextOrEvidenceLink: "proof text or evidence link",
  evidenceLink: "valid evidence link",
  safetyAcknowledged: "safety and anonymization acknowledgement",
  certificateSeparationAcknowledged: "certificate separation acknowledgement",
  proofConfig: "safe practical proof configuration",
  duplicateSubmission: "existing private proof submission",
};

export function parseLearnerPracticalProofFormData(formData: FormData):
  | {
      ok: true;
      value: LearnerPracticalProofInput;
    }
  | {
      ok: false;
      missingFields: string[];
    } {
  const value: LearnerPracticalProofInput = {
    proofText: getFormString(formData, "proofText"),
    evidenceLink: normalizeOptionalUrl(getFormString(formData, "evidenceLink")),
    safetyAcknowledged: formData.get("safetyAcknowledged") === "on",
    certificateSeparationAcknowledged:
      formData.get("certificateSeparationAcknowledged") === "on",
  };
  const missingFields: string[] = [];

  if (!value.proofText && !value.evidenceLink) {
    missingFields.push("proofTextOrEvidenceLink");
  }

  if (getFormString(formData, "evidenceLink") && !value.evidenceLink) {
    missingFields.push("evidenceLink");
  }

  if (!value.safetyAcknowledged) {
    missingFields.push("safetyAcknowledged");
  }

  if (!value.certificateSeparationAcknowledged) {
    missingFields.push("certificateSeparationAcknowledged");
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

export function canSubmitPrivatePracticalProof(
  config: PracticalProofConfigLike,
) {
  const readiness = buildPracticalProofReadiness(config);

  return readiness.enabled && readiness.ready;
}

export function buildPrivatePracticalProofSubmissionData(
  input: LearnerPracticalProofInput,
) {
  return {
    status: learnerProofSubmissionStatus.submitted,
    visibilityDefault: practicalProofVisibilityDefault,
    proofText: input.proofText,
    evidenceLink: input.evidenceLink,
    safetyAcknowledged: input.safetyAcknowledged,
    certificateSeparationAcknowledged:
      input.certificateSeparationAcknowledged,
    donorVisibilityConsent: false,
    aiVerificationUsed: false,
  };
}

export function summarizeLearnerPracticalProofSubmission(
  submission: LearnerPracticalProofSubmissionLike | null | undefined,
) {
  if (!submission) {
    return "No practical proof submitted yet.";
  }

  return `Private proof submitted. Status: ${formatLearnerProofStatus(
    submission.status,
  )}. Raw proof visibility: ${submission.visibilityDefault}.`;
}

export function getPracticalProofCertificateSeparationCopy() {
  return `Your course certificate is based on the final test only: ${practicalProofCertificateRule}. Practical proof is optional and separate.`;
}

export function formatLearnerProofStatus(status: string) {
  return status === learnerProofSubmissionStatus.submitted
    ? "Submitted"
    : status;
}

function normalizeOptionalUrl(value: string) {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);

    return ["http:", "https:"].includes(parsed.protocol)
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

function getFormString(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

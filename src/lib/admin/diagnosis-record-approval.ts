import { getDiagnosisRecordEligibility } from "@/lib/studio/diagnosis-selection";

export type DiagnosisRecordApprovalReadinessInput = {
  capacityGapStatement: string;
  capacityPracticeArea: string;
  coreCapacityArea: string;
  courseFitDecision: string;
  currentBaseline: string;
  dataSensitivityLevel: string;
  datasetApprovalStatus: string;
  datasetArchivedAt: Date | null;
  desiredPractice: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  evidenceSource: string;
  evaluationAnchor: string;
  isActive: boolean;
  isLocked: boolean;
  ksmeRoute: string;
  monitoringSignal: string;
  noHarmNote: string;
  recordApprovalStatus: string;
  recordArchivedAt: Date | null;
  safeguardingRiskLevel: string;
  separableKnowledgeSkillComponent: string;
  targetAudience: string;
};

export type DiagnosisRecordApprovalReadiness = {
  approvalBlockingIssues: string[];
  approvalReady: boolean;
  approvalWarnings: string[];
  lockBlockingIssues: string[];
  lockReady: boolean;
  lockWarnings: string[];
  status:
    | "ready_for_approval"
    | "ready_for_lock"
    | "approval_blocked"
    | "lock_blocked";
  summary: string;
};

type RequiredApprovalField = {
  key: keyof DiagnosisRecordApprovalReadinessInput;
  message: string;
};

const REQUIRED_APPROVAL_FIELDS: RequiredApprovalField[] = [
  {
    key: "diagnosisCode",
    message: "Add a diagnosis code.",
  },
  {
    key: "diagnosisTitle",
    message: "Add a diagnosis title.",
  },
  {
    key: "coreCapacityArea",
    message: "Choose a Core Capacity Area.",
  },
  {
    key: "capacityGapStatement",
    message: "Add the capacity gap statement.",
  },
  {
    key: "currentBaseline",
    message: "Add the baseline or current practice.",
  },
  {
    key: "desiredPractice",
    message: "Add the desired practice.",
  },
  {
    key: "evidenceSource",
    message: "Add the evidence source.",
  },
  {
    key: "targetAudience",
    message: "Add the Target Audience.",
  },
  {
    key: "ksmeRoute",
    message: "Choose a K/S/M/E route.",
  },
  {
    key: "courseFitDecision",
    message: "Choose a course-fit decision.",
  },
  {
    key: "noHarmNote",
    message: "Add a safeguarding or no-harm note.",
  },
  {
    key: "evaluationAnchor",
    message: "Add an evaluation anchor.",
  },
];

export function getDiagnosisRecordApprovalReadiness(
  input: DiagnosisRecordApprovalReadinessInput,
): DiagnosisRecordApprovalReadiness {
  const approvalBlockingIssues = getApprovalBlockingIssues(input);
  const approvalWarnings = getApprovalWarnings(input);
  const lockBlockingIssues = getLockBlockingIssues(
    input,
    approvalBlockingIssues,
  );
  const lockWarnings = getLockWarnings(input);

  const approvalReady = approvalBlockingIssues.length === 0;
  const lockReady = lockBlockingIssues.length === 0;
  const status = getStatus({ approvalReady, lockReady, input });

  return {
    approvalBlockingIssues,
    approvalReady,
    approvalWarnings,
    lockBlockingIssues,
    lockReady,
    lockWarnings,
    status,
    summary: getSummary(status),
  };
}

function getApprovalBlockingIssues(
  input: DiagnosisRecordApprovalReadinessInput,
) {
  const issues = REQUIRED_APPROVAL_FIELDS.filter(({ key }) =>
    isBlank(input[key]),
  ).map(({ message }) => message);

  if (input.recordArchivedAt) {
    issues.push("Archived diagnosis records cannot be approved.");
  }

  if (!input.isActive) {
    issues.push("Inactive diagnosis records cannot be approved.");
  }

  return uniqueMessages(issues);
}

function getApprovalWarnings(input: DiagnosisRecordApprovalReadinessInput) {
  const warnings: string[] = [];

  if (isBlank(input.capacityPracticeArea)) {
    warnings.push(
      "Add the Capacity Practice Area before final approval where possible.",
    );
  }

  if (isBlank(input.safeguardingRiskLevel)) {
    warnings.push("Choose a safeguarding risk level before final approval.");
  }

  if (isBlank(input.dataSensitivityLevel)) {
    warnings.push("Choose a data sensitivity level before final approval.");
  }

  if (isBlank(input.monitoringSignal)) {
    warnings.push("Add a monitoring signal before final approval.");
  }

  const courseEligibility = getDiagnosisRecordEligibility({
    courseFitDecision: input.courseFitDecision,
    ksmeRoute: input.ksmeRoute,
    separableKnowledgeSkillComponent: input.separableKnowledgeSkillComponent,
  });

  if (!courseEligibility.selectable && hasText(input.courseFitDecision)) {
    warnings.push(
      "This record may still be valid evidence, but it is not ready to anchor Course Setup.",
    );
  }

  return uniqueMessages(warnings);
}

function getLockBlockingIssues(
  input: DiagnosisRecordApprovalReadinessInput,
  approvalBlockingIssues: string[],
) {
  const issues: string[] = [];

  if (approvalBlockingIssues.length > 0) {
    issues.push("Resolve approval readiness issues before locking this record.");
  }

  if (!isStatus(input.datasetApprovalStatus, "APPROVED")) {
    issues.push(
      "The linked diagnosis dataset must be approved before this record can be locked for Course Setup.",
    );
  }

  if (input.datasetArchivedAt) {
    issues.push("Archived diagnosis datasets cannot supply Course Setup records.");
  }

  if (!isStatus(input.recordApprovalStatus, "APPROVED")) {
    issues.push("Approve the diagnosis record before locking it.");
  }

  if (input.recordArchivedAt) {
    issues.push("Archived diagnosis records cannot be locked for Course Setup.");
  }

  if (!input.isActive) {
    issues.push("Inactive diagnosis records cannot be locked for Course Setup.");
  }

  const courseEligibility = getDiagnosisRecordEligibility({
    courseFitDecision: input.courseFitDecision,
    ksmeRoute: input.ksmeRoute,
    separableKnowledgeSkillComponent: input.separableKnowledgeSkillComponent,
  });

  if (!courseEligibility.selectable) {
    issues.push(courseEligibility.reason);
  }

  return uniqueMessages(issues);
}

function getLockWarnings(input: DiagnosisRecordApprovalReadinessInput) {
  const warnings: string[] = [];

  if (!input.isLocked && isStatus(input.recordApprovalStatus, "APPROVED")) {
    warnings.push(
      "Locking will make this approved diagnosis record read-only for Course Setup use.",
    );
  }

  if (isHighOrVeryHigh(input.safeguardingRiskLevel)) {
    warnings.push(
      "Keep the safeguarding and no-harm note visible wherever this record is used.",
    );
  }

  if (isHighOrVeryHigh(input.dataSensitivityLevel)) {
    warnings.push(
      "Keep raw or sensitive evidence out of creator-facing course materials.",
    );
  }

  return uniqueMessages(warnings);
}

function getStatus({
  approvalReady,
  input,
  lockReady,
}: {
  approvalReady: boolean;
  input: DiagnosisRecordApprovalReadinessInput;
  lockReady: boolean;
}): DiagnosisRecordApprovalReadiness["status"] {
  if (lockReady) {
    return "ready_for_lock";
  }

  if (approvalReady && isStatus(input.recordApprovalStatus, "APPROVED")) {
    return "lock_blocked";
  }

  if (approvalReady) {
    return "ready_for_approval";
  }

  return "approval_blocked";
}

function getSummary(status: DiagnosisRecordApprovalReadiness["status"]) {
  if (status === "ready_for_lock") {
    return "This diagnosis record is approved and ready to be locked for Course Setup eligibility.";
  }

  if (status === "ready_for_approval") {
    return "This diagnosis record has the core evidence fields needed for approval review.";
  }

  if (status === "lock_blocked") {
    return "This diagnosis record is approved but not yet ready to be locked for Course Setup.";
  }

  return "This diagnosis record needs more evidence before approval review.";
}

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim().length === 0;
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function isHighOrVeryHigh(value: string) {
  const normalized = value.trim().toLowerCase();

  return normalized === "high" || normalized.includes("very high");
}

function isStatus(value: string, status: string) {
  return value.trim().toLowerCase() === status.trim().toLowerCase();
}

function uniqueMessages(messages: string[]) {
  return Array.from(new Set(messages));
}

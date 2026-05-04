import type { BuildGovernanceIssue } from "@/lib/studio/build-checks";
import {
  getDesignHandoverAnchorDriftFields,
  type AnalysisDesignAnchorSource,
  type DesignHandoverAnchorValues,
} from "@/lib/studio/design-anchors";
import type { EvidenceContextDisplayModel } from "@/lib/studio/evidence-context";

export type DownstreamEvidenceIssue = {
  code: string;
  message: string;
  source:
    | "evidence-context"
    | "capacity-map"
    | "action-map"
    | "storyboard"
    | "build";
};

export type DownstreamEvidenceReadinessResult = {
  status: "ready" | "warning" | "blocked";
  summary: string;
  blockingIssues: DownstreamEvidenceIssue[];
  warnings: DownstreamEvidenceIssue[];
};

export type DownstreamEvidenceReadinessInput = {
  evidenceContext: EvidenceContextDisplayModel;
  capacityMap?: {
    diagnosisLink?: string | null;
    monitoringRelevance?: string | null;
  } | null;
  actionMap?: {
    actionEvidenceLink?: string | null;
  } | null;
  designHandover?: DesignHandoverAnchorValues | null;
  analysisHandover?: AnalysisDesignAnchorSource | null;
  build?: {
    governanceIssues?: readonly BuildGovernanceIssue[];
    hasGeneratedContent?: boolean;
  } | null;
};

export function evaluateDownstreamEvidenceReadiness(
  input: DownstreamEvidenceReadinessInput,
): DownstreamEvidenceReadinessResult {
  const blockingIssues: DownstreamEvidenceIssue[] = [];
  const warnings: DownstreamEvidenceIssue[] = [];

  addEvidenceContextIssues(input.evidenceContext, blockingIssues);
  addCapacityMapWarnings(input.capacityMap, warnings);
  addActionMapWarnings(input.actionMap, warnings);
  addStoryboardIssues(
    input.designHandover,
    input.analysisHandover,
    blockingIssues,
  );
  addBuildIssues(input.build, blockingIssues, warnings);

  return {
    status:
      blockingIssues.length > 0
        ? "blocked"
        : warnings.length > 0
          ? "warning"
          : "ready",
    summary: summarizeReadiness(blockingIssues, warnings),
    blockingIssues,
    warnings,
  };
}

function addEvidenceContextIssues(
  evidenceContext: EvidenceContextDisplayModel,
  blockingIssues: DownstreamEvidenceIssue[],
) {
  if (!evidenceContext.status.hasApprovedDiagnosisEvidence) {
    blockingIssues.push({
      code: "missing-approved-diagnosis-evidence",
      message:
        "Approved diagnosis evidence is missing. Return to Course Setup and select a valid diagnosis record before continuing evidence-linked design work.",
      source: "evidence-context",
    });
  }

  if (!evidenceContext.status.hasLockedAnalysis) {
    blockingIssues.push({
      code: "missing-locked-analysis",
      message:
        "Locked Analysis is missing. Lock Analysis before downstream Design and Build work can be treated as evidence-linked.",
      source: "evidence-context",
    });
  }
}

function addCapacityMapWarnings(
  capacityMap: DownstreamEvidenceReadinessInput["capacityMap"],
  warnings: DownstreamEvidenceIssue[],
) {
  if (!capacityMap) {
    return;
  }

  if (!hasText(capacityMap.diagnosisLink)) {
    warnings.push({
      code: "capacity-map-missing-diagnosis-link",
      message:
        "Capacity Map does not yet explain how the mapped outcome links back to the diagnosis evidence.",
      source: "capacity-map",
    });
  }

  if (!hasText(capacityMap.monitoringRelevance)) {
    warnings.push({
      code: "capacity-map-missing-monitoring-relevance",
      message:
        "Capacity Map does not yet explain the monitoring relevance for this capacity outcome.",
      source: "capacity-map",
    });
  }
}

function addActionMapWarnings(
  actionMap: DownstreamEvidenceReadinessInput["actionMap"],
  warnings: DownstreamEvidenceIssue[],
) {
  if (!actionMap) {
    return;
  }

  if (isWeakEvidenceLink(actionMap.actionEvidenceLink)) {
    warnings.push({
      code: "action-map-weak-evidence-link",
      message:
        "Action Map evidence link is missing or too generic. It should point clearly to the diagnosis gap, baseline, or monitoring signal.",
      source: "action-map",
    });
  }
}

function addStoryboardIssues(
  designHandover: DesignHandoverAnchorValues | null | undefined,
  analysisHandover: AnalysisDesignAnchorSource | null | undefined,
  blockingIssues: DownstreamEvidenceIssue[],
) {
  if (!designHandover) {
    return;
  }

  const driftFields = getDesignHandoverAnchorDriftFields(
    designHandover,
    analysisHandover,
  );

  driftFields.forEach((field) => {
    blockingIssues.push({
      code: `storyboard-dropped-${field}`,
      message:
        field === "safeguards"
          ? "Design Handover dropped or changed the locked Analysis safeguards."
          : "Design Handover dropped or changed the locked Analysis evaluation anchor.",
      source: "storyboard",
    });
  });
}

function addBuildIssues(
  build: DownstreamEvidenceReadinessInput["build"],
  blockingIssues: DownstreamEvidenceIssue[],
  warnings: DownstreamEvidenceIssue[],
) {
  if (!build) {
    return;
  }

  if (build.hasGeneratedContent === false) {
    warnings.push({
      code: "build-content-not-generated",
      message:
        "Build content has not been generated yet. This is a readiness concern until Build Studio creates reviewable lesson blocks.",
      source: "build",
    });
  }

  build.governanceIssues?.forEach((issue) => {
    blockingIssues.push({
      code: issue.field,
      message: issue.message,
      source: "build",
    });
  });
}

function summarizeReadiness(
  blockingIssues: readonly DownstreamEvidenceIssue[],
  warnings: readonly DownstreamEvidenceIssue[],
) {
  if (blockingIssues.length > 0) {
    return `${blockingIssues.length} blocking evidence readiness issue(s) need attention.`;
  }

  if (warnings.length > 0) {
    return `${warnings.length} evidence readiness warning(s) should be reviewed.`;
  }

  return "Evidence context and downstream readiness checks are aligned.";
}

function isWeakEvidenceLink(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() || "";

  if (!normalized) {
    return true;
  }

  return ["diagnosis", "evidence", "see diagnosis", "linked"].includes(
    normalized,
  );
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

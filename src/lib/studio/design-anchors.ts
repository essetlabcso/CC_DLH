export type AnalysisDesignAnchorSource = {
  capacityArea: string;
  subCapacityArea: string;
  linkedStandard: string;
  capacityIndicator: string;
  validatedCapacityGap: string;
  baseline: string;
  desiredPractice: string;
  ksmeRoute: string;
  safeguardsNote: string;
  evaluationAnchor: string;
};

export type DesignPrerequisiteStatuses = {
  analysisLocked: boolean;
  capacityMapComplete: boolean;
  actionMapComplete: boolean;
  storyboardComplete: boolean;
  storyboardApprovedForBuild: boolean;
  designHandoverComplete: boolean;
};

export type DesignHandoverAnchorValues = {
  safeguards: string;
  evaluationAnchor: string;
};

export function getAnalysisDesignAnchors(
  handover: AnalysisDesignAnchorSource | null | undefined,
) {
  return {
    capacityArea: handover?.capacityArea?.trim() || "",
    subCapacityArea: handover?.subCapacityArea?.trim() || "",
    linkedStandard: handover?.linkedStandard?.trim() || "",
    capacityIndicator: handover?.capacityIndicator?.trim() || "",
    validatedCapacityGap: handover?.validatedCapacityGap?.trim() || "",
    baseline: handover?.baseline?.trim() || "",
    desiredPractice: handover?.desiredPractice?.trim() || "",
    ksmeRoute: handover?.ksmeRoute?.trim() || "",
    safeguardsNote: handover?.safeguardsNote?.trim() || "",
    evaluationAnchor: handover?.evaluationAnchor?.trim() || "",
  };
}

export function getMissingAnalysisDesignAnchorFields(
  handover: AnalysisDesignAnchorSource | null | undefined,
) {
  const anchors = getAnalysisDesignAnchors(handover);

  return [
    ["capacityArea", anchors.capacityArea],
    ["subCapacityArea", anchors.subCapacityArea],
    ["linkedStandard", anchors.linkedStandard],
    ["capacityIndicator", anchors.capacityIndicator],
    ["validatedCapacityGap", anchors.validatedCapacityGap],
    ["baseline", anchors.baseline],
    ["desiredPractice", anchors.desiredPractice],
    ["ksmeRoute", anchors.ksmeRoute],
    ["safeguardsNote", anchors.safeguardsNote],
    ["evaluationAnchor", anchors.evaluationAnchor],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);
}

export function hasCompleteAnalysisDesignAnchors(
  handover: AnalysisDesignAnchorSource | null | undefined,
) {
  return getMissingAnalysisDesignAnchorFields(handover).length === 0;
}

export function getIncompleteDesignPrerequisites(
  statuses: DesignPrerequisiteStatuses,
) {
  const missing: string[] = [];

  if (!statuses.analysisLocked) {
    missing.push("locked Analysis Handover");
  }

  if (!statuses.capacityMapComplete) {
    missing.push("completed Capacity Map");
  }

  if (!statuses.actionMapComplete) {
    missing.push("completed Action Map");
  }

  if (!statuses.storyboardComplete || !statuses.storyboardApprovedForBuild) {
    missing.push("completed Storyboard");
  }

  if (!statuses.designHandoverComplete) {
    missing.push("complete Design-to-Build Handover");
  }

  return missing;
}

export function getDesignHandoverAnchorDriftFields(
  designHandover: DesignHandoverAnchorValues,
  handover: AnalysisDesignAnchorSource | null | undefined,
) {
  const anchors = getAnalysisDesignAnchors(handover);
  const driftFields: string[] = [];

  if (
    anchors.safeguardsNote &&
    designHandover.safeguards.trim() !== anchors.safeguardsNote
  ) {
    driftFields.push("safeguards");
  }

  if (
    anchors.evaluationAnchor &&
    designHandover.evaluationAnchor.trim() !== anchors.evaluationAnchor
  ) {
    driftFields.push("evaluationAnchor");
  }

  return driftFields;
}

export function formatAnchorValue(value: string | null | undefined) {
  return value?.trim() || "Not set";
}

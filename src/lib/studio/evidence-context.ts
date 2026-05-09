import type { CourseAnalysisHandover } from "@prisma/client";

import {
  resolveCourseSetupDiagnosisSnapshot,
  type CourseSetupDiagnosisSnapshot,
  type DiagnosisRecordWithDataset,
} from "@/lib/studio/diagnosis-selection";

export type EvidenceContextAnalysisInput = Pick<
  CourseAnalysisHandover,
  | "status"
  | "lockedAt"
  | "capacityArea"
  | "subCapacityArea"
  | "capacityIndicator"
  | "validatedCapacityGap"
  | "baseline"
  | "desiredPractice"
  | "rootCauseSummary"
  | "ksmeRoute"
  | "separableKnowledgeSkillComponent"
  | "interventionDecision"
  | "analysisGateDecision"
  | "safeguardsNote"
  | "evaluationAnchor"
>;

export type EvidenceContextDisplayItem = {
  label: string;
  value: string;
};

export type EvidenceContextDisplayModel = {
  title: string;
  description: string;
  status: {
    hasApprovedDiagnosisEvidence: boolean;
    hasLockedAnalysis: boolean;
    hasMissingEvidenceWarning: boolean;
    hasDesignContext: boolean;
  };
  lineage: {
    approvedDiagnosis: string;
    lockedAnalysis: string;
    designContext: string;
  };
  badges: {
    label: string;
    tone: "ready" | "blocked" | "neutral";
  }[];
  diagnosis: {
    datasetCode: string;
    datasetTitle: string;
    diagnosisCode: string;
    diagnosisTitle: string;
    items: EvidenceContextDisplayItem[];
  } | null;
  analysis: {
    items: EvidenceContextDisplayItem[];
  } | null;
  warning: string | null;
};

export function buildEvidenceContextDisplayModel({
  analysisHandover,
  currentStageLabel = "Design / Build context",
  diagnosisSnapshotValue,
  linkedDiagnosisRecord,
}: {
  analysisHandover?: EvidenceContextAnalysisInput | null;
  currentStageLabel?: string;
  diagnosisSnapshotValue?: string | null;
  linkedDiagnosisRecord?: DiagnosisRecordWithDataset | null;
}): EvidenceContextDisplayModel {
  const snapshot = resolveCourseSetupDiagnosisSnapshot({
    linkedRecord: linkedDiagnosisRecord,
    snapshotValue: diagnosisSnapshotValue,
  });
  const hasApprovedDiagnosisEvidence = Boolean(snapshot);
  const hasLockedAnalysis = Boolean(
    analysisHandover?.status === "LOCKED" && analysisHandover.lockedAt,
  );

  return {
    title: "Admin-approved source anchor",
    description:
      "Use this read-only source context to keep course planning aligned with the approved diagnosis evidence. Creators design the learning response, but should not silently change the evidence base.",
    status: {
      hasApprovedDiagnosisEvidence,
      hasLockedAnalysis,
      hasMissingEvidenceWarning: !hasApprovedDiagnosisEvidence,
      hasDesignContext: false,
    },
    lineage: {
      approvedDiagnosis: hasApprovedDiagnosisEvidence
        ? "Approved source anchor"
        : "Source anchor missing",
      lockedAnalysis: hasLockedAnalysis ? "Locked Analysis" : "Analysis not locked",
      designContext: currentStageLabel,
    },
    badges: buildEvidenceContextBadges(snapshot, hasLockedAnalysis),
    diagnosis: snapshot ? buildDiagnosisDisplay(snapshot) : null,
    analysis: analysisHandover ? buildAnalysisDisplay(analysisHandover) : null,
    warning: hasApprovedDiagnosisEvidence
      ? null
      : "No approved diagnosis evidence is linked to this course. Return to Course Setup and select a valid diagnosis record before continuing.",
  };
}

function buildEvidenceContextBadges(
  snapshot: CourseSetupDiagnosisSnapshot | null,
  hasLockedAnalysis: boolean,
) {
  const badges: EvidenceContextDisplayModel["badges"] = [
    {
      label: hasLockedAnalysis ? "Locked Analysis" : "Analysis not locked",
      tone: hasLockedAnalysis ? "ready" : "blocked",
    },
  ];

  if (!snapshot) {
    badges.unshift({
      label: "Evidence missing",
      tone: "blocked",
    });
    return badges;
  }

    badges.unshift(
      {
      label: "Admin-approved source",
      tone: "ready",
    },
    {
      label: snapshot.record.ksmeRoute || "K/S/M/E not set",
      tone: "neutral",
    },
    {
      label: snapshot.record.courseFitDecision || "Course-fit not set",
      tone: "ready",
    },
    {
      label: snapshot.record.dataSensitivityLevel || "Sensitivity not set",
      tone: "neutral",
    },
  );

  return badges;
}

function buildDiagnosisDisplay(snapshot: CourseSetupDiagnosisSnapshot) {
  const capacityPracticeArea =
    snapshot.record.capacityPracticeArea || snapshot.record.subCapacity;

  return {
    datasetCode: snapshot.dataset.code,
    datasetTitle: snapshot.dataset.title,
    diagnosisCode: snapshot.record.code,
    diagnosisTitle: snapshot.record.title,
    items: [
      item(
        "Linked evidence source package",
        `${snapshot.dataset.code} - ${snapshot.dataset.title}`,
      ),
      item("Core capacity area", snapshot.record.coreCapacityArea),
      item("Capacity Practice Area", capacityPracticeArea),
      item("Target Audience", snapshot.record.targetAudience),
      item("Region", snapshot.record.region),
      item("Capacity gap", snapshot.record.capacityGapStatement),
      item("Baseline / current practice", snapshot.record.currentBaseline),
      item("Desired practice", snapshot.record.desiredPractice),
      item("Evidence source summary", snapshot.record.evidenceSourceSummary),
      item("K/S/M/E route", snapshot.record.ksmeRoute),
      item("Course-fit decision", snapshot.record.courseFitDecision),
      item("Safeguards / no-harm note", snapshot.record.noHarmNote),
      item("Data sensitivity", snapshot.record.dataSensitivityLevel),
      item("Evaluation anchor", snapshot.record.evaluationAnchor),
      item("Monitoring signal", snapshot.record.monitoringSignal),
      item(
        "Separable Knowledge/Skill component",
        snapshot.record.separableKnowledgeSkillComponent,
      ),
    ],
  };
}

function buildAnalysisDisplay(analysis: EvidenceContextAnalysisInput) {
  return {
    items: [
      item("Core capacity area", analysis.capacityArea),
      item("Capacity Practice Area", analysis.subCapacityArea),
      item("Capacity indicator", analysis.capacityIndicator),
      item("Validated capacity gap", analysis.validatedCapacityGap),
      item("Baseline / current practice", analysis.baseline),
      item("Desired practice", analysis.desiredPractice),
      item("Root cause summary", analysis.rootCauseSummary),
      item("K/S/M/E route", analysis.ksmeRoute),
      item(
        "Separable Knowledge/Skill component",
        analysis.separableKnowledgeSkillComponent,
      ),
      item("Intervention decision", analysis.interventionDecision),
      item("Analysis Gate decision", analysis.analysisGateDecision),
      item("Safeguards / no-harm note", analysis.safeguardsNote),
      item("Evaluation anchor", analysis.evaluationAnchor),
    ],
  };
}

function item(label: string, value: string): EvidenceContextDisplayItem {
  return {
    label,
    value: value?.trim() || "Not specified",
  };
}

import { describe, expect, it } from "vitest";

import type { EvidenceContextDisplayModel } from "@/lib/studio/evidence-context";

import { evaluateDownstreamEvidenceReadiness } from "./downstream-evidence-readiness";

describe("downstream evidence readiness", () => {
  it("returns ready for aligned evidence context and downstream fields", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      actionMap: {
        actionEvidenceLink:
          "Validated diagnosis gap shows staff need practice preparing outcome evidence notes.",
      },
      analysisHandover: buildAnalysisHandover(),
      build: {
        governanceIssues: [],
        hasGeneratedContent: true,
      },
      capacityMap: {
        diagnosisLink:
          "Maps directly to the approved diagnosis gap about outcome evidence.",
        monitoringRelevance:
          "Monitoring can review whether evidence notes connect outputs, change, and learning.",
      },
      designHandover: {
        safeguards: "Use fictionalized examples and avoid raw case data.",
        evaluationAnchor:
          "Learners prepare an outcome evidence note from a safe sample.",
      },
      evidenceContext: buildEvidenceContext(),
    });

    expect(result.status).toBe("ready");
    expect(result.blockingIssues).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("blocks when approved diagnosis evidence is missing", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      evidenceContext: buildEvidenceContext({
        hasApprovedDiagnosisEvidence: false,
      }),
    });

    expect(result.status).toBe("blocked");
    expect(result.blockingIssues).toContainEqual(
      expect.objectContaining({
        code: "missing-approved-diagnosis-evidence",
        source: "evidence-context",
      }),
    );
  });

  it("blocks when locked Analysis is missing", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      evidenceContext: buildEvidenceContext({
        hasLockedAnalysis: false,
      }),
    });

    expect(result.status).toBe("blocked");
    expect(result.blockingIssues).toContainEqual(
      expect.objectContaining({
        code: "missing-locked-analysis",
        source: "evidence-context",
      }),
    );
  });

  it("warns, but does not block, when Capacity Map evidence linkage is missing", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      capacityMap: {
        diagnosisLink: "",
        monitoringRelevance: "",
      },
      evidenceContext: buildEvidenceContext(),
    });

    expect(result.status).toBe("warning");
    expect(result.blockingIssues).toEqual([]);
    expect(result.warnings.map((warning) => warning.code)).toEqual([
      "capacity-map-missing-diagnosis-link",
      "capacity-map-missing-monitoring-relevance",
    ]);
  });

  it("warns, but does not block, when Action Map evidence link is weak", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      actionMap: {
        actionEvidenceLink: "Evidence",
      },
      evidenceContext: buildEvidenceContext(),
    });

    expect(result.status).toBe("warning");
    expect(result.blockingIssues).toEqual([]);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        code: "action-map-weak-evidence-link",
        source: "action-map",
      }),
    );
  });

  it("blocks when Storyboard Design Handover drops locked safeguards or evaluation anchor", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      analysisHandover: buildAnalysisHandover(),
      designHandover: {
        safeguards: "Changed safeguards",
        evaluationAnchor: "Changed evaluation anchor",
      },
      evidenceContext: buildEvidenceContext(),
    });

    expect(result.status).toBe("blocked");
    expect(result.blockingIssues.map((issue) => issue.code)).toEqual([
      "storyboard-dropped-safeguards",
      "storyboard-dropped-evaluationAnchor",
    ]);
  });

  it("treats existing Build governance issues as blocking and generic Build drift as warning only", () => {
    const result = evaluateDownstreamEvidenceReadiness({
      build: {
        governanceIssues: [
          {
            field: "blockGovernanceReady",
            message: "Required Storyboard block is missing its purpose link.",
          },
        ],
        hasGeneratedContent: false,
      },
      evidenceContext: buildEvidenceContext(),
    });

    expect(result.status).toBe("blocked");
    expect(result.blockingIssues).toContainEqual(
      expect.objectContaining({
        code: "blockGovernanceReady",
        source: "build",
      }),
    );
    expect(result.warnings).toContainEqual(
      expect.objectContaining({
        code: "build-content-not-generated",
        source: "build",
      }),
    );
  });
});

function buildEvidenceContext(
  overrides: Partial<EvidenceContextDisplayModel["status"]> = {},
): EvidenceContextDisplayModel {
  const status = {
    hasApprovedDiagnosisEvidence: true,
    hasDesignContext: false,
    hasLockedAnalysis: true,
    hasMissingEvidenceWarning: false,
    ...overrides,
  };

  return {
    analysis: null,
    badges: [],
    description: "Read-only context.",
    diagnosis: null,
    lineage: {
      approvedDiagnosis: status.hasApprovedDiagnosisEvidence
        ? "Approved diagnosis"
        : "Diagnosis evidence missing",
      designContext: "Design / Build context",
      lockedAnalysis: status.hasLockedAnalysis
        ? "Locked Analysis"
        : "Analysis not locked",
    },
    status,
    title: "Evidence context",
    warning: null,
  };
}

function buildAnalysisHandover() {
  return {
    baseline: "Staff document outputs but do not connect them to change.",
    capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
    capacityIndicator: "Outcome evidence note connects outputs and change.",
    desiredPractice:
      "Staff prepare concise outcome evidence notes from routine data.",
    evaluationAnchor:
      "Learners prepare an outcome evidence note from a safe sample.",
    ksmeRoute: "skill",
    linkedStandard: "DEC MEAL practice standard",
    safeguardsNote: "Use fictionalized examples and avoid raw case data.",
    subCapacityArea: "Outcome evidence and learning documentation",
    validatedCapacityGap:
      "Staff cannot prepare concise outcome evidence statements.",
  };
}

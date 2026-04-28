import { describe, expect, it } from "vitest";

import {
  formatAnchorValue,
  getAnalysisDesignAnchors,
  getDesignHandoverAnchorDriftFields,
  getIncompleteDesignPrerequisites,
  getMissingAnalysisDesignAnchorFields,
} from "./design-anchors";

describe("design analysis anchors", () => {
  it("derives controlled Design anchors from the locked Analysis Handover shape", () => {
    const anchors = getAnalysisDesignAnchors(buildAnalysisHandover());

    expect(anchors).toMatchObject({
      capacityArea: "Human Resources, Inclusion, and Safeguarding",
      subCapacityArea: "Safeguarding referral pathway",
      linkedStandard: "DEC safeguarding practice standard",
      capacityIndicator: "Staff choose the correct referral pathway.",
      evaluationAnchor: "Scenario choices show correct referral judgment.",
    });
  });

  it("keeps legacy blank locked handovers safe for rendering", () => {
    expect(getMissingAnalysisDesignAnchorFields(null)).toContain(
      "capacityArea",
    );
    expect(formatAnchorValue("")).toBe("Not set");
  });

  it("detects when Design Handover fields drift from approved Analysis anchors", () => {
    expect(
      getDesignHandoverAnchorDriftFields(
        {
          safeguards: "Changed safeguard",
          evaluationAnchor: "Scenario choices show correct referral judgment.",
        },
        buildAnalysisHandover(),
      ),
    ).toEqual(["safeguards"]);
  });

  it("requires every Design prerequisite before Build can open", () => {
    expect(
      getIncompleteDesignPrerequisites({
        analysisLocked: true,
        capacityMapComplete: true,
        actionMapComplete: false,
        storyboardComplete: true,
        storyboardApprovedForBuild: true,
        designHandoverComplete: false,
      }),
    ).toEqual(["completed Action Map", "complete Design-to-Build Handover"]);
  });
});

function buildAnalysisHandover() {
  return {
    capacityArea: "Human Resources, Inclusion, and Safeguarding",
    subCapacityArea: "Safeguarding referral pathway",
    linkedStandard: "DEC safeguarding practice standard",
    capacityIndicator: "Staff choose the correct referral pathway.",
    validatedCapacityGap:
      "Safeguarding focal staff choose inconsistent reporting paths.",
    baseline: "Staff delay reporting while seeking informal approval.",
    desiredPractice: "Staff use the approved referral pathway promptly.",
    ksmeRoute: "skill",
    safeguardsNote: "Use fictionalized scenarios and no real cases.",
    evaluationAnchor: "Scenario choices show correct referral judgment.",
  };
}

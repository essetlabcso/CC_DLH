import { describe, expect, it } from "vitest";

import {
  buildReviewerPauseChecklist,
  buildReviewerApprovalChecklist,
  buildReviewerReturnChecklist,
  buildSpecialistReviewChecklist,
  getReturnGuidanceFromChecklist,
  hasUnresolvedSpecialistReview,
  parseReviewerApprovalFormData,
  parseReviewerPauseFormData,
  parseReviewerReturnFormData,
  parseReviewerSpecialistReviewFormData,
  summarizeReviewerApproval,
  summarizeReviewerPause,
  summarizeReviewerReturn,
  summarizeSpecialistReview,
} from "./decisions";

describe("reviewer decision helpers", () => {
  it("requires all approval checks and decision notes before approval", () => {
    const result = parseReviewerApprovalFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toContain("runtimePreviewConfirmed");
      expect(result.missingFields).toContain("sourcesConfirmed");
      expect(result.missingFields).toContain("decisionNotes");
    }
  });

  it("serializes an approval while preserving creator review evidence", () => {
    const formData = new FormData();

    formData.set("runtimePreviewConfirmed", "on");
    formData.set("actionAlignmentConfirmed", "on");
    formData.set("accessibilityMobileConfirmed", "on");
    formData.set("safeguardingConfirmed", "on");
    formData.set("assessmentConfirmed", "on");
    formData.set("sourcesConfirmed", "on");
    formData.set("certificateRuleConfirmed", "on");
    formData.set("decisionNotes", "Ready for publishing handoff.");

    const result = parseReviewerApprovalFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizeReviewerApproval(result.value)).toContain(
        "runtime preview",
      );
      expect(
        JSON.parse(
          buildReviewerApprovalChecklist(
            JSON.stringify({
              creatorReview: {
                submissionReadinessConfirmed: true,
              },
            }),
            result.value,
          ),
        ),
      ).toMatchObject({
        creatorReview: {
          submissionReadinessConfirmed: true,
        },
        reviewerReview: {
          runtimePreviewConfirmed: true,
          sourcesConfirmed: true,
          certificateRuleConfirmed: true,
          certificateRule:
            "80%+ final test score = pass and automated course certificate",
        },
      });
      expect(
        JSON.parse(buildReviewerApprovalChecklist("{}", result.value))
          .reviewerReview.certificateRule,
      ).not.toContain("90%");
    }
  });

  it("requires reviewer comments before returning a course for changes", () => {
    const result = parseReviewerReturnFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toEqual([
        "returnTarget",
        "severity",
        "affectedArea",
        "reviewerComment",
        "requiredAction",
      ]);
    }
  });

  it("serializes return-to-build routing for the creator revision loop", () => {
    const formData = new FormData();

    formData.set("returnTarget", "build");
    formData.set("severity", "required-fix");
    formData.set("affectedArea", "Build");
    formData.set("affectedItem", "Scenario block");
    formData.set("reviewerComment", "Strengthen the scenario feedback.");
    formData.set("requiredAction", "Revise the scenario feedback and resubmit.");

    const result = parseReviewerReturnFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizeReviewerReturn(result.value)).toContain(
        "Return to Build",
      );
      expect(
        JSON.parse(buildReviewerReturnChecklist("{}", result.value)),
      ).toMatchObject({
        reviewerReview: {
          decisionType: "return-to-build",
          returnedForChanges: true,
          returnTarget: "build",
          comments: [
            {
              affectedArea: "Build",
              affectedItem: "Scenario block",
              severity: "required-fix",
              comment: "Strengthen the scenario feedback.",
              requiredAction: "Revise the scenario feedback and resubmit.",
              status: "open",
            },
          ],
        },
      });
    }
  });

  it("serializes return-to-design and return-to-analysis routing", () => {
    const designFormData = new FormData();
    designFormData.set("returnTarget", "design");
    designFormData.set("severity", "blocking");
    designFormData.set("affectedArea", "Design");
    designFormData.set("reviewerComment", "Storyboard misses skill practice.");
    designFormData.set("requiredAction", "Revise the Storyboard practice step.");

    const analysisFormData = new FormData();
    analysisFormData.set("returnTarget", "analysis");
    analysisFormData.set("severity", "blocking");
    analysisFormData.set("affectedArea", "Analysis");
    analysisFormData.set(
      "reviewerComment",
      "Course-fit decision needs further diagnosis.",
    );
    analysisFormData.set(
      "requiredAction",
      "Clarify the separable Knowledge/Skill component.",
    );

    const designResult = parseReviewerReturnFormData(designFormData);
    const analysisResult = parseReviewerReturnFormData(analysisFormData);

    expect(designResult.ok).toBe(true);
    expect(analysisResult.ok).toBe(true);
    if (designResult.ok && analysisResult.ok) {
      expect(
        JSON.parse(buildReviewerReturnChecklist("{}", designResult.value))
          .reviewerReview.decisionType,
      ).toBe("return-to-design");
      expect(
        JSON.parse(buildReviewerReturnChecklist("{}", analysisResult.value))
          .reviewerReview.decisionType,
      ).toBe("return-to-analysis");
    }
  });

  it("records specialist review as an approval blocker", () => {
    const formData = new FormData();

    formData.set("affectedArea", "Safeguarding");
    formData.set("reviewerComment", "Sensitive scenario needs specialist review.");
    formData.set("requiredAction", "Review the scenario for data safety.");

    const result = parseReviewerSpecialistReviewFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const checklist = buildSpecialistReviewChecklist("{}", result.value);

      expect(summarizeSpecialistReview(result.value)).toContain(
        "Specialist review required",
      );
      expect(hasUnresolvedSpecialistReview(checklist)).toBe(true);
      expect(JSON.parse(checklist)).toMatchObject({
        reviewerReview: {
          decisionType: "specialist-review-required",
          specialistReviewRequired: true,
        },
      });
    }
  });

  it("records not-approved pause without publishing readiness", () => {
    const formData = new FormData();

    formData.set("affectedArea", "Analysis");
    formData.set("reviewerComment", "The current course should not proceed.");
    formData.set("requiredAction", "Re-scope the course before resubmission.");

    const result = parseReviewerPauseFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      const checklist = JSON.parse(
        buildReviewerPauseChecklist("{}", result.value),
      );

      expect(summarizeReviewerPause(result.value)).toContain("Not approved");
      expect(checklist.reviewerReview).toMatchObject({
        decisionType: "not-approved-pause",
        specialistReviewRequired: false,
      });
      expect(checklist.reviewerReview).not.toHaveProperty("approvedAt");
    }
  });

  it("returns creator-facing guidance from structured review routing", () => {
    const checklist = buildReviewerReturnChecklist("{}", {
      returnTarget: "analysis",
      severity: "blocking",
      affectedArea: "Analysis",
      affectedItem: "K/S/M/E route",
      reviewerComment: "Motivation gap was forced into course production.",
      requiredAction: "Record a separable Knowledge/Skill component.",
    });

    expect(getReturnGuidanceFromChecklist(checklist)).toMatchObject({
      decisionLabel: "Returned to Analysis",
      returnTarget: "analysis",
      resumeLabel: "Resume Diagnosis",
      reason: "Motivation gap was forced into course production.",
      requiredAction: "Record a separable Knowledge/Skill component.",
    });
  });
});

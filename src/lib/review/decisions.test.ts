import { describe, expect, it } from "vitest";

import {
  buildReviewerApprovalChecklist,
  buildReviewerReturnChecklist,
  parseReviewerApprovalFormData,
  parseReviewerReturnFormData,
  summarizeReviewerApproval,
  summarizeReviewerReturn,
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
        },
      });
    }
  });

  it("requires reviewer comments before returning a course for changes", () => {
    const result = parseReviewerReturnFormData(new FormData());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.missingFields).toEqual(["returnedReason"]);
    }
  });

  it("serializes return comments for the creator revision loop", () => {
    const formData = new FormData();

    formData.set(
      "returnedReason",
      "Strengthen the scenario feedback before approval.",
    );

    const result = parseReviewerReturnFormData(formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(summarizeReviewerReturn(result.value)).toContain(
        "Strengthen the scenario feedback",
      );
      expect(
        JSON.parse(buildReviewerReturnChecklist("{}", result.value)),
      ).toMatchObject({
        reviewerReview: {
          returnedForChanges: true,
          returnedReason: "Strengthen the scenario feedback before approval.",
        },
      });
    }
  });
});

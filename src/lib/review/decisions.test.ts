import { describe, expect, it } from "vitest";

import { CourseVersionStatus } from "@prisma/client";
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
  getReviewerApprovalBlockers,
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
    formData.set("decisionNotes", "Ready for publishing handoff. All review checks passed and the course is ready.");

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
    formData.set("reviewerComment", "Strengthen the scenario feedback to provide more constructive guidance for learners.");
    formData.set("requiredAction", "Revise the scenario feedback blocks and resubmit for final verification.");

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
              comment: "Strengthen the scenario feedback to provide more constructive guidance for learners.",
              requiredAction: "Revise the scenario feedback blocks and resubmit for final verification.",
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
    designFormData.set("reviewerComment", "Storyboard misses skill practice opportunities in the key modules.");
    designFormData.set("requiredAction", "Revise the Storyboard practice step to include observable actions.");

    const analysisFormData = new FormData();
    analysisFormData.set("returnTarget", "analysis");
    analysisFormData.set("severity", "blocking");
    analysisFormData.set("affectedArea", "Analysis");
    analysisFormData.set(
      "reviewerComment",
      "Course-fit decision needs further diagnosis of the target audience.",
    );
    analysisFormData.set(
      "requiredAction",
      "Clarify the separable Knowledge/Skill component in the diagnosis stage.",
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
    formData.set("reviewerComment", "Sensitive scenario needs specialist review for data safety compliance.");
    formData.set("requiredAction", "Review the scenario for data safety and safeguarding alignment.");

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
    formData.set("reviewerComment", "The current course should not proceed due to misalignment with goals.");
    formData.set("requiredAction", "Re-scope the course before resubmission to the review queue.");

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

  describe("getReviewerApprovalBlockers", () => {
    it("returns blockers when status is not SUBMITTED", () => {
      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.APPROVED, "{}");
      expect(blockers).toContainEqual(expect.objectContaining({ code: "invalid-status" }));
    });

    it("returns blocker when checklist handover is missing", () => {
      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, "{}");
      expect(blockers).toContainEqual(expect.objectContaining({ code: "missing-handover" }));
    });

    it("returns blocker when handover has active blocking warnings", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: ["Missing lesson description"],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "handover-blockers" }));
    });

    it("returns blocker when required final test is not ready on certificate-bearing course", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: true, ready: false },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(
        expect.objectContaining({
          code: "final-test-not-ready",
          label: "Final test is required for this certificate-bearing course but is not ready.",
        })
      );
    });

    it("does not block approval when final test is not required even if not ready", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: false },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers.some((b) => b.code === "final-test-not-ready")).toBe(false);
    });

    it("does not block approval when practical proof is disabled", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false, ready: false, blockers: [{ key: "test", message: "unsafe" }] },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers.some((b) => b.code === "practical-proof-unsafe")).toBe(false);
    });

    it("blocks approval when practical proof is enabled but structured ready is false", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: true, ready: false, blockers: [] },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "practical-proof-unsafe" }));
    });

    it("blocks approval when practical proof is enabled and has structured blockers", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: true, ready: true, blockers: [{ key: "safety", message: "unsafe" }] },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "practical-proof-unsafe" }));
    });

    it("does not block approval when practical proof is enabled, ready, and has no blockers", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: true, ready: true, blockers: [] },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers.some((b) => b.code === "practical-proof-unsafe")).toBe(false);
    });

    it("falls back to status-string scanning for practical proof when structured fields are absent", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: true, status: "Blocked/Unsafe" },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "practical-proof-unsafe" }));
    });

    it("returns blocker when AI review is pending", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 3, reviewedCount: 1, status: "Pending" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "ai-review-pending" }));
    });

    it("returns blocker when there is an unresolved specialist review", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
        reviewerReview: {
          decisionType: "specialist-review-required",
          specialistReviewRequired: true,
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers).toContainEqual(expect.objectContaining({ code: "specialist-review-unresolved" }));
    });

    it("returns empty blockers when everything passes successfully", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          blockingWarnings: [],
          summary: { requiredBlockCount: 2, creatorAddedBlockCount: 0 },
          finalTest: { required: false, ready: true },
          aiReview: { pendingCount: 0, reviewedCount: 1, status: "Ready" },
          practicalProof: { enabled: false },
          accessibility: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          safeguarding: { blocksWithNotes: 0, blocksMissingNotes: 0, status: "Ready" },
          preview: { status: "Ready" },
        },
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers.length).toBe(0);
    });

    it("returns empty blockers for the exact pre-seeded handover checklist used in scripts/seed-golden-path.mjs", () => {
      const checklist = JSON.stringify({
        buildToReviewHandover: {
          generatedAt: "2026-05-06T14:00:00.000Z",
          courseTitle: "Safe Community Feedback Handling for Local CSOs (Review Candidate)",
          certificateRule: "80%+ final test score = pass and automated course certificate",
          submissionType: "new",
          anchors: {
            capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
            gap: "staff lack safe feedback classification/redaction/escalation process",
            route: "Skill"
          },
          summary: {
            moduleCount: 1,
            lessonCount: 3,
            totalBlocks: 3,
            requiredBlockCount: 2,
            creatorAddedBlockCount: 0
          },
          requiredBlocks: [],
          creatorAddedBlocks: [],
          finalTest: {
            required: true,
            ready: true,
            questionCount: 1,
            summary: "Final test ready."
          },
          aiReview: {
            status: "AI not used",
            pendingCount: 0,
            reviewedCount: 0,
            notUsedCount: 3
          },
          accessibility: {
            status: "Block-level notes present",
            blocksWithNotes: 2,
            blocksMissingNotes: 0
          },
          safeguarding: {
            status: "Block-level notes present",
            blocksWithNotes: 2,
            blocksMissingNotes: 0
          },
          preview: {
            completed: true,
            status: "complete"
          },
          creatorReview: {
            completed: true,
            status: "complete"
          },
          practicalProof: {
            enabled: true,
            ready: true,
            status: "Safely configured",
            blockers: []
          },
          blockingWarnings: [],
          reviewerAttentionItems: []
        }
      });

      const blockers = getReviewerApprovalBlockers(CourseVersionStatus.SUBMITTED, checklist);
      expect(blockers.length).toBe(0);
    });
  });
});

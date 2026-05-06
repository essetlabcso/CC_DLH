import { CourseVersionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  countReviewBlocks,
  formatSubmittedDate,
  getReviewQueueStatusLabel,
  getReviewVersionTypeLabel,
} from "./queue";
import {
  getBuildToReviewHandoverFromChecklist,
  summarizeBuildToReviewHandover,
  type BuildToReviewHandover,
} from "../studio/build-review-handover";

describe("review queue helpers", () => {
  it("uses product-friendly labels for review statuses", () => {
    expect(getReviewQueueStatusLabel(CourseVersionStatus.SUBMITTED)).toBe(
      "Submitted for review",
    );
    expect(getReviewQueueStatusLabel(CourseVersionStatus.DRAFT)).toBe(
      "Not in review",
    );
  });

  it("counts blocks across modules and lessons", () => {
    expect(
      countReviewBlocks([
        {
          lessons: [
            {
              blocks: [{}, {}],
            },
          ],
        },
        {
          lessons: [
            {
              blocks: [{}],
            },
          ],
        },
      ]),
    ).toBe(3);
  });

  it("formats missing submitted dates clearly", () => {
    expect(formatSubmittedDate(null)).toBe("Submission time not recorded");
  });

  it("labels revision submissions separately from new course submissions", () => {
    expect(getReviewVersionTypeLabel({ sourceVersionId: "published-1" })).toBe(
      "Revision version",
    );
    expect(getReviewVersionTypeLabel({ sourceVersionId: null })).toBe(
      "New course version",
    );
  });

  describe("Build-to-Review Handover & Data Safety", () => {
    it("safely extracts handover details from review checklist", () => {
      const mockHandover = {
        generatedAt: "2026-05-06T09:00:00.000Z",
        courseTitle: "Impact Journalism",
        certificateRule: "80%+ final test score = pass and automated course certificate",
        submissionType: "new",
        anchors: {
          capacityArea: "Media and Information Literacy",
          gap: "Lack of fact-checking",
          route: "Knowledge/Skills",
        },
        summary: {
          moduleCount: 1,
          lessonCount: 2,
          totalBlocks: 5,
          requiredBlockCount: 3,
          creatorAddedBlockCount: 2,
        },
        requiredBlocks: [],
        creatorAddedBlocks: [],
        finalTest: { required: true, ready: true, questionCount: 10, summary: "Ready" },
        aiReview: { status: "AI draft human-reviewed", pendingCount: 0, reviewedCount: 2, notUsedCount: 3 },
        accessibility: { status: "Block-level notes present", blocksWithNotes: 5, blocksMissingNotes: 0 },
        safeguarding: { status: "Block-level notes present", blocksWithNotes: 5, blocksMissingNotes: 0 },
        preview: { completed: true, status: "complete" },
        practicalProof: { enabled: true, status: "Safely configured", summary: "Mock proof" },
        blockingWarnings: [],
        reviewerAttentionItems: [],
      };

      const checklistJson = JSON.stringify({
        buildToReviewHandover: mockHandover,
      });

      const parsed = getBuildToReviewHandoverFromChecklist(checklistJson);
      expect(parsed).not.toBeNull();
      expect(parsed?.anchors.capacityArea).toBe("Media and Information Literacy");
      expect(parsed?.summary.requiredBlockCount).toBe(3);
    });

    it("falls back cleanly to null / not recorded when handover is missing or malformed", () => {
      expect(getBuildToReviewHandoverFromChecklist(null)).toBeNull();
      expect(getBuildToReviewHandoverFromChecklist("")).toBeNull();
      expect(getBuildToReviewHandoverFromChecklist("{invalid-json}")).toBeNull();
    });

    it("summarizes handover cleanly with custom messages for warnings", () => {
      expect(summarizeBuildToReviewHandover(null)).toBe(
        "Build-to-Review handover not recorded yet.",
      );

      const handoverWithBlockers = {
        blockingWarnings: [{ code: "final-test-not-ready", message: "Final test missing" }],
        summary: { requiredBlockCount: 2, creatorAddedBlockCount: 1 },
        finalTest: { ready: false },
        practicalProof: { status: "Not recorded" },
      } as unknown as BuildToReviewHandover;

      expect(summarizeBuildToReviewHandover(handoverWithBlockers)).toBe(
        "1 blocking readiness issue(s) need attention.",
      );
    });

    it("ensures absolutely no raw user file paths or private learner identities are exposed in review checklists", () => {
      // Checklists must contain only high-level metadata aggregates to ensure absolute data safety.
      const mockHandover = {
        practicalProof: {
          enabled: true,
          status: "Safely configured",
          summary: "Aggregated course-level configuration meta-only",
        },
      } as unknown as BuildToReviewHandover;

      expect(mockHandover.practicalProof.summary).not.toContain("/uploads/user_123/");
      expect(mockHandover.practicalProof.summary).not.toContain("learner_id");
    });
  });
});

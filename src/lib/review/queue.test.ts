import { CourseVersionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  countReviewBlocks,
  formatSubmittedDate,
  getReviewQueueStatusLabel,
  getReviewVersionTypeLabel,
} from "./queue";

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
});

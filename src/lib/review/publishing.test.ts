import { CourseVersionStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  countPublishableLessons,
  formatPublishedDate,
  getPublishingVersionTypeLabel,
  getPublishingStatusLabel,
  summarizePublication,
} from "./publishing";

describe("publishing helpers", () => {
  it("uses product-friendly publication labels", () => {
    expect(getPublishingStatusLabel(CourseVersionStatus.APPROVED)).toBe(
      "Approved for publishing",
    );
    expect(getPublishingStatusLabel(CourseVersionStatus.DRAFT)).toBe(
      "Not ready for publishing",
    );
  });

  it("counts lessons across modules", () => {
    expect(
      countPublishableLessons({
        modules: [
          {
            lessons: [{}, {}],
          },
          {
            lessons: [{}],
          },
        ],
      }),
    ).toBe(3);
  });

  it("formats missing publication time clearly", () => {
    expect(formatPublishedDate(null)).toBe("Publication time not recorded");
  });

  it("summarizes publication handoff for lifecycle evidence", () => {
    expect(summarizePublication("Safeguarding Basics", 2)).toBe(
      "Published Safeguarding Basics version 2 for learner discovery.",
    );
  });

  it("summarizes revision publication distinctly", () => {
    expect(
      summarizePublication("Safeguarding Basics", 2, { isRevision: true }),
    ).toBe(
      "Published revised Safeguarding Basics version 2 for learner discovery.",
    );
  });

  it("labels revision versions in the publishing queue", () => {
    expect(getPublishingVersionTypeLabel({ sourceVersionId: "version-1" })).toBe(
      "Revision version",
    );
    expect(getPublishingVersionTypeLabel({ sourceVersionId: null })).toBe(
      "New course version",
    );
  });
});

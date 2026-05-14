import {
  CourseVersionStatus,
  WorkflowStepStatus,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  filterAdminCourseWorkflowItems,
  getAdminCourseAttentionTags,
  getAdminCourseNextActionLabel,
  getAdminCourseStatusLabel,
  summarizeWorkflowProgress,
  type AdminCourseWorkflowItem,
} from "./course-workflow-overview";

vi.mock("@/lib/db/client", () => ({
  prisma: {},
}));

describe("Admin course workflow overview helpers", () => {
  it("uses plain labels for course workflow states", () => {
    expect(getAdminCourseStatusLabel(CourseVersionStatus.SUBMITTED)).toBe(
      "Submitted for review",
    );
    expect(getAdminCourseStatusLabel(CourseVersionStatus.APPROVED)).toBe(
      "Approved for publish",
    );
    expect(getAdminCourseStatusLabel(CourseVersionStatus.RETURNED)).toBe(
      "Returned for changes",
    );
  });

  it("points next actions to existing workflow gates", () => {
    expect(getAdminCourseNextActionLabel(CourseVersionStatus.SUBMITTED)).toBe(
      "Open review",
    );
    expect(getAdminCourseNextActionLabel(CourseVersionStatus.APPROVED)).toBe(
      "Check publish readiness",
    );
    expect(getAdminCourseNextActionLabel(CourseVersionStatus.DRAFT)).toBe(
      "Creator work in progress",
    );
  });

  it("summarizes workflow completion without changing gate state", () => {
    expect(
      summarizeWorkflowProgress([
        { status: WorkflowStepStatus.COMPLETE },
        { status: WorkflowStepStatus.IN_PROGRESS },
        { status: WorkflowStepStatus.LOCKED },
      ]),
    ).toBe("1 of 10 workflow steps complete");
  });

  it("classifies attention without giving Admin a bypass tag", () => {
    expect(
      getAdminCourseAttentionTags({
        blockers: ["Final test readiness missing"],
        publishReady: false,
        status: CourseVersionStatus.APPROVED,
        warnings: [],
      }),
    ).toEqual(["approved-publish", "blocked-publish"]);
    expect(
      getAdminCourseAttentionTags({
        blockers: [],
        publishReady: null,
        status: CourseVersionStatus.SUBMITTED,
        warnings: [],
      }),
    ).toEqual(["needs-review"]);
  });

  it("filters by approved publish attention", () => {
    const items = [
      makeItem("submitted", ["needs-review"]),
      makeItem("approved", ["approved-publish"]),
    ];

    expect(filterAdminCourseWorkflowItems(items, "approved-publish")).toEqual([
      items[1],
    ]);
    expect(filterAdminCourseWorkflowItems(items, "unknown")).toEqual(items);
  });
});

function makeItem(
  id: string,
  attentionTags: string[],
): AdminCourseWorkflowItem {
  return {
    id,
    attentionTags,
    blockers: [],
    capacityArea: "Capacity",
    courseFitDecisionLabel: "Course-ready",
    courseId: `course-${id}`,
    creatorName: "Creator",
    nextActionHref: null,
    nextActionLabel: "Next",
    nextActionNote: "Note",
    organizationName: "Org",
    ownerName: "Owner",
    programCohortLabel: "Program",
    publishReadinessLabel: "Not at publish gate",
    publishReadinessSummary: "Summary",
    readinessChecklist: [],
    reviewerName: "Reviewer",
    sourceAnchorSummary: "Aligned with source anchor. Package. Gap: Gap",
    status: CourseVersionStatus.DRAFT,
    statusLabel: "Draft",
    statusTone: "",
    title: "Course",
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    versionNumber: 1,
    versionType: "New version",
    warnings: [],
    workflowProgressLabel: "0 of 10 workflow steps complete",
    workflowStage: "Course Setup",
    workflowStepLabels: [],
  };
}

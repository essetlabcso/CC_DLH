import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  canOpenBuildStudio,
  courseWorkflowSteps,
  findWorkflowStepByRouteSegment,
  requiredBeforeBuildSteps,
} from "./course-workflow";

describe("course creator workflow spine", () => {
  it("keeps the DEC workflow in the required order", () => {
    expect(courseWorkflowSteps.map((step) => step.step)).toEqual([
      CourseWorkflowStep.COURSE_SETUP,
      CourseWorkflowStep.DIAGNOSIS,
      CourseWorkflowStep.CAPACITY_MAP,
      CourseWorkflowStep.ACTION_MAP,
      CourseWorkflowStep.STORYBOARD,
      CourseWorkflowStep.BUILD,
      CourseWorkflowStep.PREVIEW,
      CourseWorkflowStep.CREATOR_REVIEW,
      CourseWorkflowStep.MONITORING,
      CourseWorkflowStep.REVISION,
    ]);
  });

  it("requires setup, diagnosis, capacity, action, and storyboard before build", () => {
    expect(requiredBeforeBuildSteps).toEqual([
      CourseWorkflowStep.COURSE_SETUP,
      CourseWorkflowStep.DIAGNOSIS,
      CourseWorkflowStep.CAPACITY_MAP,
      CourseWorkflowStep.ACTION_MAP,
      CourseWorkflowStep.STORYBOARD,
    ]);

    expect(
      canOpenBuildStudio({
        [CourseWorkflowStep.COURSE_SETUP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.DIAGNOSIS]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.CAPACITY_MAP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.ACTION_MAP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.STORYBOARD]: WorkflowStepStatus.IN_PROGRESS,
      }),
    ).toBe(false);

    expect(
      canOpenBuildStudio({
        [CourseWorkflowStep.COURSE_SETUP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.DIAGNOSIS]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.CAPACITY_MAP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.ACTION_MAP]: WorkflowStepStatus.COMPLETE,
        [CourseWorkflowStep.STORYBOARD]: WorkflowStepStatus.COMPLETE,
      }),
    ).toBe(true);
  });

  it("maps planned Studio route segments to workflow steps", () => {
    expect(findWorkflowStepByRouteSegment("diagnosis")?.step).toBe(
      CourseWorkflowStep.DIAGNOSIS,
    );
    expect(findWorkflowStepByRouteSegment("build")?.step).toBe(
      CourseWorkflowStep.BUILD,
    );
    expect(findWorkflowStepByRouteSegment("unknown")).toBeUndefined();
  });
});

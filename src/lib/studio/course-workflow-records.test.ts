import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buildInitialWorkflowStepRecords } from "./course-workflow-records";

describe("initial Studio workflow records", () => {
  it("starts Course Setup open and keeps later workflow steps locked", () => {
    const records = buildInitialWorkflowStepRecords();

    expect(records.find((record) => record.step === CourseWorkflowStep.COURSE_SETUP))
      .toMatchObject({
        status: WorkflowStepStatus.NOT_STARTED,
      });
    expect(records.find((record) => record.step === CourseWorkflowStep.BUILD))
      .toMatchObject({
        status: WorkflowStepStatus.LOCKED,
      });
  });
});

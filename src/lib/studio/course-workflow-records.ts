import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";

import { courseWorkflowSteps } from "@/lib/workflow/course-workflow";

export function buildInitialWorkflowStepRecords() {
  return courseWorkflowSteps.map((workflowStep) => {
    if (workflowStep.step === CourseWorkflowStep.COURSE_SETUP) {
      return {
        step: workflowStep.step,
        status: WorkflowStepStatus.NOT_STARTED,
      };
    }

    return {
      step: workflowStep.step,
      status: WorkflowStepStatus.LOCKED,
      lockedReason:
        workflowStep.step === CourseWorkflowStep.BUILD
          ? "Complete Course Setup, Diagnosis, Capacity Map, Action Map, Storyboard, and Design Handover before building lessons."
          : workflowStep.step === CourseWorkflowStep.CAPACITY_MAP
            ? "Lock Analysis Handover for Design before continuing to Capacity Map."
          : "Complete the earlier required workflow steps first.",
    };
  });
}

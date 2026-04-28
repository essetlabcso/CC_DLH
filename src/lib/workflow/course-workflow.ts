import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";

export type CourseWorkflowStepDefinition = {
  step: CourseWorkflowStep;
  label: string;
  routeSegment: string;
  requiredBeforeBuild: boolean;
};

export const courseWorkflowSteps: readonly CourseWorkflowStepDefinition[] = [
  {
    step: CourseWorkflowStep.COURSE_SETUP,
    label: "Course Setup",
    routeSegment: "setup",
    requiredBeforeBuild: true,
  },
  {
    step: CourseWorkflowStep.DIAGNOSIS,
    label: "Diagnosis",
    routeSegment: "diagnosis",
    requiredBeforeBuild: true,
  },
  {
    step: CourseWorkflowStep.CAPACITY_MAP,
    label: "Capacity Map",
    routeSegment: "capacity-map",
    requiredBeforeBuild: true,
  },
  {
    step: CourseWorkflowStep.ACTION_MAP,
    label: "Action Map",
    routeSegment: "action-map",
    requiredBeforeBuild: true,
  },
  {
    step: CourseWorkflowStep.STORYBOARD,
    label: "Storyboard",
    routeSegment: "storyboard",
    requiredBeforeBuild: true,
  },
  {
    step: CourseWorkflowStep.BUILD,
    label: "Build",
    routeSegment: "build",
    requiredBeforeBuild: false,
  },
  {
    step: CourseWorkflowStep.PREVIEW,
    label: "Preview",
    routeSegment: "preview",
    requiredBeforeBuild: false,
  },
  {
    step: CourseWorkflowStep.CREATOR_REVIEW,
    label: "Creator Review",
    routeSegment: "creator-review",
    requiredBeforeBuild: false,
  },
  {
    step: CourseWorkflowStep.MONITORING,
    label: "Monitoring",
    routeSegment: "monitoring",
    requiredBeforeBuild: false,
  },
  {
    step: CourseWorkflowStep.REVISION,
    label: "Revision",
    routeSegment: "revision",
    requiredBeforeBuild: false,
  },
];

export const requiredBeforeBuildSteps = courseWorkflowSteps
  .filter((step) => step.requiredBeforeBuild)
  .map((step) => step.step);

export type WorkflowStatusInput = Partial<
  Record<CourseWorkflowStep, WorkflowStepStatus>
>;

export function canOpenBuildStudio(statuses: WorkflowStatusInput) {
  return requiredBeforeBuildSteps.every(
    (step) => statuses[step] === WorkflowStepStatus.COMPLETE,
  );
}

export function findWorkflowStepByRouteSegment(routeSegment: string) {
  return courseWorkflowSteps.find((step) => step.routeSegment === routeSegment);
}

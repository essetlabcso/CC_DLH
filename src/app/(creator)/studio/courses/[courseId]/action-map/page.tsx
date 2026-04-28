import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  actionMapFieldLabels,
  parseDifMatrix,
  parseJsonArrayField,
} from "@/lib/studio/action-map";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import { isAnalysisHandoverLocked } from "@/lib/studio/analysis-handover";

import { saveCourseActionMapAction } from "../../../actions";

type ActionMapPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    fields?: string;
    vague?: string;
  }>;
};

export default async function ActionMapPage({
  params,
  searchParams,
}: ActionMapPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/action-map`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const capacityMapStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.CAPACITY_MAP,
  );
  const handover = editable.version.analysisHandover;

  if (
    !isAnalysisHandoverLocked(handover) ||
    capacityMapStatus !== WorkflowStepStatus.COMPLETE
  ) {
    return (
      <WorkspaceShell eyebrow="Action Map" title={editable.course.title}>
        <p>
          Lock Analysis for Design and complete Capacity Map before defining
          learner actions and practice scenarios.
        </p>
        <nav className="workspace-nav" aria-label="Action Map recovery">
          <Link
            className="workspace-link primary"
            href={
              isAnalysisHandoverLocked(handover)
                ? `/studio/courses/${courseId}/capacity-map`
                : `/studio/courses/${courseId}/diagnosis`
            }
          >
            {isAnalysisHandoverLocked(handover)
              ? "Go to Capacity Map"
              : "Go to Diagnosis"}
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const actionMap = editable.version.actionMap;
  const observableAction = parseJsonArrayField(
    actionMap?.observableActions,
  )[0] as { action?: string; evidenceLink?: string } | undefined;
  const practiceScenario = parseJsonArrayField(
    actionMap?.practiceScenarios,
  )[0] as
    | { situation?: string; decision?: string; monitoringSignal?: string }
    | undefined;
  const essentialInformation = parseJsonArrayField(
    actionMap?.essentialInformation,
  )[0] as { item?: string; format?: string } | undefined;
  const difMatrix = parseDifMatrix(actionMap?.difMatrix);
  const saveAction = saveCourseActionMapAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => actionMapFieldLabels[field] || field)
    : [];
  const vagueFields = resolvedSearchParams?.vague
    ? resolvedSearchParams.vague
        .split(",")
        .filter(Boolean)
        .map((field) => actionMapFieldLabels[field] || field)
    : [];

  return (
    <WorkspaceShell eyebrow="Action Map" title={editable.course.title}>
      <p>
        Translate the capacity outcome into observable learner action, practice,
        essential information, and DIF triage.
      </p>
      {resolvedSearchParams?.saved === "1" ? (
        <p className="workspace-note">Action Map saved.</p>
      ) : null}
      {missingFields.length > 0 ? (
        <p className="workspace-error">
          Please complete the required fields: {missingFields.join(", ")}.
        </p>
      ) : null}
      {vagueFields.length > 0 ? (
        <p className="workspace-error">
          Rewrite vague learning language in: {vagueFields.join(", ")}. Use
          observable action words instead.
        </p>
      ) : null}

      {handover ? (
        <AnalysisSummaryPanel
          handover={handover}
          courseFitDecision={editable.version.diagnosis?.courseFitDecision}
        />
      ) : null}

      <form action={saveAction} className="setup-form">
        <fieldset>
          <legend>Capacity goal</legend>
          <label>
            <span>Capacity goal</span>
            <textarea
              name="capacityGoal"
              required
              defaultValue={actionMap?.capacityGoal}
            />
          </label>
          <label>
            <span>Individual learner outcome</span>
            <textarea
              name="individualLearnerOutcome"
              required
              defaultValue={actionMap?.individualLearnerOutcome}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Observable action</legend>
          <label>
            <span>What should the learner be able to do?</span>
            <textarea
              name="observableAction"
              required
              defaultValue={observableAction?.action}
            />
          </label>
          <label>
            <span>Evidence link</span>
            <textarea
              name="actionEvidenceLink"
              required
              defaultValue={observableAction?.evidenceLink}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Practice scenario</legend>
          <label>
            <span>Real situation the learner will practice</span>
            <textarea
              name="practiceScenario"
              required
              defaultValue={practiceScenario?.situation}
            />
          </label>
          <label>
            <span>Decision the learner must make</span>
            <textarea
              name="scenarioDecision"
              required
              defaultValue={practiceScenario?.decision}
            />
          </label>
          <label>
            <span>Monitoring signal</span>
            <textarea
              name="scenarioMonitoringSignal"
              required
              defaultValue={practiceScenario?.monitoringSignal}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Essential information</legend>
          <label>
            <span>What information is essential for action?</span>
            <textarea
              name="essentialInformation"
              required
              defaultValue={essentialInformation?.item}
            />
          </label>
          <label>
            <span>Best format</span>
            <select
              name="essentialInformationFormat"
              required
              defaultValue={essentialInformation?.format}
            >
              <option value="">Choose a format</option>
              <option value="checklist">Checklist</option>
              <option value="job-aid">Job aid</option>
              <option value="accordion">Accordion</option>
              <option value="short-explanation">Short explanation</option>
              <option value="template">Template</option>
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>DIF triage</legend>
          <div className="form-grid">
            <label>
              <span>Difficulty</span>
              <select name="difficulty" required defaultValue={difMatrix.difficulty}>
                <option value="">Choose</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              <span>Importance</span>
              <select name="importance" required defaultValue={difMatrix.importance}>
                <option value="">Choose</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              <span>Frequency</span>
              <select name="frequency" required defaultValue={difMatrix.frequency}>
                <option value="">Choose</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
        </fieldset>

        <div className="next-step-panel">
          <h2>Next step: Storyboard</h2>
          <p>
            Storyboard will turn this Action Map into a lesson-by-lesson build
            plan before the course can move into Build Studio.
          </p>
          <nav className="workspace-nav" aria-label="Action Map next step">
            <Link
              className="workspace-link primary"
              href={`/studio/courses/${courseId}/storyboard`}
            >
              Continue to Storyboard
            </Link>
          </nav>
        </div>

        <div className="studio-actions">
          <button className="workspace-button" type="submit">
            Save Action Map
          </button>
          <Link
            className="workspace-link"
            href={`/studio/courses/${courseId}/capacity-map`}
          >
            Back to Capacity Map
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            My courses
          </Link>
        </div>
      </form>
    </WorkspaceShell>
  );
}

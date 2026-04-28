import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { DesignSummaryPanel } from "@/components/studio/DesignSummaryPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { isAnalysisHandoverLocked } from "@/lib/studio/analysis-handover";
import {
  parseDifMatrix,
  parseJsonArrayField,
} from "@/lib/studio/action-map";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import {
  designHandoverFieldLabels,
  getDesignHandoverStatusLabel,
  isDesignHandoverLocked,
} from "@/lib/studio/design-handover";
import {
  learningModeOptions,
  parseStoryboardLessonPlan,
  storyboardFieldLabels,
} from "@/lib/studio/storyboard";

import {
  lockDesignHandoverForBuildAction,
  saveCourseStoryboardAction,
} from "../../../actions";

type StoryboardPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    designLocked?: string;
    error?: string;
    fields?: string;
  }>;
};

export default async function StoryboardPage({
  params,
  searchParams,
}: StoryboardPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/storyboard`,
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

  const actionMapStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.ACTION_MAP,
  );
  const handover = editable.version.analysisHandover;

  if (
    !isAnalysisHandoverLocked(handover) ||
    actionMapStatus !== WorkflowStepStatus.COMPLETE
  ) {
    return (
      <WorkspaceShell eyebrow="Storyboard" title={editable.course.title}>
        <p>
          Lock Analysis for Design and complete Action Map before turning this
          course into a lesson build plan.
        </p>
        <nav className="workspace-nav" aria-label="Storyboard recovery">
          <Link
            className="workspace-link primary"
            href={
              isAnalysisHandoverLocked(handover)
                ? `/studio/courses/${courseId}/action-map`
                : `/studio/courses/${courseId}/diagnosis`
            }
          >
            {isAnalysisHandoverLocked(handover)
              ? "Go to Action Map"
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
  const capacityMap = editable.version.capacityMap;
  const storyboard = editable.version.storyboard;
  const designHandover = editable.version.designHandover;
  const designLocked = isDesignHandoverLocked(designHandover);
  const lesson = parseStoryboardLessonPlan(storyboard?.lessonPlan)[0];
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
  const saveAction = saveCourseStoryboardAction.bind(null, courseId);
  const lockDesignAction = lockDesignHandoverForBuildAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map(
          (field) =>
            storyboardFieldLabels[field] ||
            designHandoverFieldLabels[field] ||
            field,
        )
    : [];
  const requiresSafetyGate = Boolean(editable.version.setup?.sensitiveFlag);

  return (
    <WorkspaceShell eyebrow="Storyboard" title={editable.course.title}>
      <p>
        Turn the Action Map into a practical lesson plan that Build Studio can
        use for governed course blocks.
      </p>
      {resolvedSearchParams?.saved === "1" ? (
        <p className="workspace-note">
          Storyboard and Design-to-Build Handover saved. Lock Design for Build
          when ready.
        </p>
      ) : null}
      {resolvedSearchParams?.designLocked === "1" ? (
        <p className="workspace-note">
          Design Handover locked for Build. Build Studio is now open.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "missing" ? (
        <p className="workspace-error">
          Please complete the required fields: {missingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "handover" ? (
        <p className="workspace-error">
          Save Storyboard and the Design-to-Build Handover before locking
          Design for Build.
        </p>
      ) : null}

      {handover ? (
        <AnalysisSummaryPanel
          handover={handover}
          courseFitDecision={editable.version.diagnosis?.courseFitDecision}
        />
      ) : null}

      {designLocked && designHandover ? (
        <>
          <DesignSummaryPanel handover={designHandover} />
          <div className="next-step-panel">
            <h2>Build Studio is open</h2>
            <p>
              The Design Handover is locked. Build Studio can now create
              governed lesson blocks from the approved Storyboard.
            </p>
            <nav className="workspace-nav" aria-label="Design locked actions">
              <Link
                className="workspace-link primary"
                href={`/studio/courses/${courseId}/build`}
              >
                Continue to Build Studio
              </Link>
              <Link className="workspace-link" href="/studio/courses">
                My courses
              </Link>
            </nav>
          </div>
        </>
      ) : (
        <>

      <section className="studio-section" aria-labelledby="storyboard-context">
        <h2 id="storyboard-context">Action Map context</h2>
        <div className="context-grid">
          <article>
            <strong>Capacity goal</strong>
            <span>{actionMap?.capacityGoal || "Not set"}</span>
          </article>
          <article>
            <strong>Learner action</strong>
            <span>{observableAction?.action || "Not set"}</span>
          </article>
          <article>
            <strong>Practice activity</strong>
            <span>{practiceScenario?.situation || "Not set"}</span>
          </article>
          <article>
            <strong>Essential information</strong>
            <span>{essentialInformation?.item || "Not set"}</span>
          </article>
          <article>
            <strong>Linked standard</strong>
            <span>{capacityMap?.linkedStandard || "Not set"}</span>
          </article>
          <article>
            <strong>Suggested support</strong>
            <span>{difMatrix.recommendation || "Not set"}</span>
          </article>
        </div>
      </section>

      <form action={saveAction} className="setup-form">
        <fieldset>
          <legend>Lesson identity</legend>
          <div className="form-grid">
            <label>
              <span>Module name</span>
              <input
                name="moduleName"
                required
                defaultValue={lesson?.moduleName}
              />
            </label>
            <label>
              <span>Lesson title</span>
              <input name="lessonTitle" required defaultValue={lesson?.title} />
            </label>
          </div>
          <label>
            <span>Lesson purpose</span>
            <textarea
              name="lessonPurpose"
              required
              defaultValue={lesson?.purpose}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Action alignment</legend>
          <label>
            <span>Linked learner action</span>
            <textarea
              name="linkedLearnerAction"
              required
              defaultValue={
                lesson?.linkedLearnerAction || observableAction?.action
              }
            />
          </label>
          <label>
            <span>Linked capacity goal</span>
            <textarea
              name="linkedCapacityGoal"
              required
              defaultValue={lesson?.linkedCapacityGoal || actionMap?.capacityGoal}
            />
          </label>
          <label>
            <span>Reason this lesson exists</span>
            <textarea
              name="lessonRationale"
              required
              defaultValue={lesson?.rationale}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Learning design</legend>
          <label>
            <span>Learning mode</span>
            <select
              name="learningMode"
              required
              defaultValue={lesson?.learningMode}
            >
              <option value="">Choose a mode</option>
              {learningModeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {formatLearningMode(mode)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Learning flow</span>
            <textarea
              name="learningFlow"
              required
              defaultValue={lesson?.learningFlow}
            />
          </label>
          <label>
            <span>Planned block sequence</span>
            <textarea
              name="plannedBlockSequence"
              required
              defaultValue={lesson?.plannedBlockSequence}
            />
          </label>
          <label>
            <span>Planned interaction</span>
            <textarea
              name="plannedInteraction"
              required
              defaultValue={lesson?.plannedInteraction}
            />
          </label>
          <label>
            <span>Knowledge check or learner output</span>
            <textarea
              name="knowledgeCheck"
              required
              defaultValue={lesson?.knowledgeCheck}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Build handoff</legend>
          <label>
            <span>Media requirement</span>
            <textarea
              name="mediaRequirement"
              required
              defaultValue={lesson?.mediaRequirement}
            />
          </label>
          <label>
            <span>Download or job aid requirement</span>
            <textarea
              name="jobAidRequirement"
              required
              defaultValue={lesson?.jobAidRequirement}
            />
          </label>
          <label>
            <span>Accessibility note</span>
            <textarea
              name="accessibilityNote"
              required
              defaultValue={lesson?.accessibilityNote}
            />
          </label>
          <label>
            <span>AI build handoff note</span>
            <textarea
              name="aiBuildHandoffNote"
              required
              defaultValue={storyboard?.aiHandoffNotes || lesson?.aiBuildHandoffNote}
            />
          </label>
          <label>
            <span>High-stakes or critical action note</span>
            <textarea
              name="criticalActionNote"
              defaultValue={lesson?.criticalActionNote}
            />
          </label>
          {requiresSafetyGate ? (
            <label className="checkbox-row">
              <input
                name="safetyGateConfirmed"
                type="checkbox"
                defaultChecked={storyboard?.approvedForBuild}
              />
              <span>
                Sensitive-course safety check completed for cultural, legal,
                civic-space, and local realism risks
              </span>
            </label>
          ) : null}
        </fieldset>

        <fieldset>
          <legend>Design-to-Build Handover</legend>
          <label>
            <span>Course purpose</span>
            <textarea
              name="coursePurpose"
              required
              defaultValue={
                designHandover?.coursePurpose || actionMap?.capacityGoal
              }
            />
          </label>
          <label>
            <span>Performance goal</span>
            <textarea
              name="performanceGoal"
              required
              defaultValue={
                designHandover?.performanceGoal ||
                actionMap?.individualLearnerOutcome
              }
            />
          </label>
          <label>
            <span>Learning pathway</span>
            <textarea
              name="learningPathway"
              required
              defaultValue={designHandover?.learningPathway || lesson?.learningMode}
            />
          </label>
          <label>
            <span>Approved block sequence</span>
            <textarea
              name="approvedBlockSequence"
              required
              defaultValue={
                designHandover?.approvedBlockSequence ||
                lesson?.plannedBlockSequence
              }
            />
          </label>
          <label>
            <span>Practice strategy</span>
            <textarea
              name="practiceStrategy"
              required
              defaultValue={
                designHandover?.practiceStrategy ||
                practiceScenario?.situation ||
                lesson?.plannedInteraction
              }
            />
          </label>
          <label>
            <span>Assessment strategy</span>
            <textarea
              name="assessmentStrategy"
              required
              defaultValue={
                designHandover?.assessmentStrategy || lesson?.knowledgeCheck
              }
            />
          </label>
          <label>
            <span>Accessibility and low-bandwidth requirements</span>
            <textarea
              name="accessibilityRequirements"
              required
              defaultValue={
                designHandover?.accessibilityRequirements ||
                lesson?.accessibilityNote
              }
            />
          </label>
          <label>
            <span>Safeguards</span>
            <textarea
              name="safeguards"
              required
              defaultValue={designHandover?.safeguards || handover?.safeguardsNote}
            />
          </label>
          <label>
            <span>AI authoring boundaries</span>
            <textarea
              name="aiAuthoringBoundaries"
              required
              defaultValue={
                designHandover?.aiAuthoringBoundaries ||
                storyboard?.aiHandoffNotes ||
                lesson?.aiBuildHandoffNote
              }
            />
          </label>
          <label>
            <span>Evaluation anchor</span>
            <textarea
              name="evaluationAnchor"
              required
              defaultValue={
                designHandover?.evaluationAnchor || handover?.evaluationAnchor
              }
            />
          </label>
        </fieldset>

        <div className="next-step-panel">
          <h2>Next step: Lock Design for Build</h2>
          <p>
            Lock the Design-to-Build Handover before Build Studio creates
            governed lesson blocks from this Storyboard.
          </p>
        </div>

        <div className="studio-actions">
          <button className="workspace-button" type="submit">
            Save Storyboard and Design Handover
          </button>
          <Link
            className="workspace-link"
            href={`/studio/courses/${courseId}/action-map`}
          >
            Back to Action Map
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            My courses
          </Link>
        </div>
      </form>

      {designHandover ? (
        <section className="studio-section" aria-labelledby="lock-design-title">
          <h2 id="lock-design-title">Lock Design for Build</h2>
          <div className="context-grid">
            <article>
              <strong>Handover status</strong>
              <span>{getDesignHandoverStatusLabel(designHandover)}</span>
            </article>
            <article>
              <strong>Learning pathway</strong>
              <span>{designHandover.learningPathway}</span>
            </article>
          </div>
          <form action={lockDesignAction} className="studio-actions">
            <button className="workspace-button" type="submit">
              Lock Design for Build
            </button>
          </form>
        </section>
      ) : null}
        </>
      )}
    </WorkspaceShell>
  );
}

function formatLearningMode(mode: string) {
  return mode
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.substring(1))
    .join(" ");
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  analysisHandoverFieldLabels,
  canAnalysisProceedToDesign,
  getAnalysisHandoverStatusLabel,
  getAnalysisRouteDecisionLabel,
  isAnalysisHandoverLocked,
  requiresSeparableKnowledgeSkill,
} from "@/lib/studio/analysis-handover";
import { getEditableCourseVersion, getWorkflowStepStatus } from "@/lib/studio/courses";
import {
  diagnosisFieldLabels,
  parseEvidenceSources,
} from "@/lib/studio/diagnosis";
import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";

import {
  lockAnalysisHandoverForDesignAction,
  saveCourseDiagnosisAction,
} from "../../../actions";

type DiagnosisPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    fields?: string;
    locked?: string;
  }>;
};

export default async function DiagnosisPage({
  params,
  searchParams,
}: DiagnosisPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/diagnosis`,
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

  const setupStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.COURSE_SETUP,
  );

  if (setupStatus !== WorkflowStepStatus.COMPLETE) {
    return (
      <WorkspaceShell eyebrow="Diagnosis" title={editable.course.title}>
        <p>
          Complete Course Setup before Diagnosis so the learner group and course
          context are clear.
        </p>
        <nav className="workspace-nav" aria-label="Diagnosis recovery">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/setup`}
          >
            Go to Course Setup
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const diagnosis = editable.version.diagnosis;
  const handover = editable.version.analysisHandover;
  const handoverLocked = isAnalysisHandoverLocked(handover);
  const evidenceSources = parseEvidenceSources(diagnosis?.evidenceSources);
  const saveAction = saveCourseDiagnosisAction.bind(null, courseId);
  const lockAction = lockAnalysisHandoverForDesignAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map(
          (field) =>
            diagnosisFieldLabels[field] ||
            analysisHandoverFieldLabels[field] ||
            field,
        )
    : [];
  const routeDecision = handover
    ? getAnalysisRouteDecisionLabel({
        courseFitDecision: diagnosis?.courseFitDecision || "",
        ksmeRoute: handover.ksmeRoute,
        separableKnowledgeSkillComponent:
          handover.separableKnowledgeSkillComponent,
      })
    : "Prepare the Analysis handover before Design can continue.";
  const canProceed =
    diagnosis && handover
      ? canAnalysisProceedToDesign({
          courseFitDecision: diagnosis.courseFitDecision,
          ksmeRoute: handover.ksmeRoute,
          separableKnowledgeSkillComponent:
            handover.separableKnowledgeSkillComponent,
        })
      : false;

  return (
    <WorkspaceShell eyebrow="Diagnosis" title={editable.course.title}>
      <p>
        Confirm the practical CSO challenge, evidence, KSME route, safeguards,
        and evaluation anchor before Design opens.
      </p>
      {resolvedSearchParams?.saved === "1" ? (
        <p className="workspace-note">
          Analysis Handover saved as a draft. Lock it for Design when the route
          is ready.
        </p>
      ) : null}
      {resolvedSearchParams?.locked === "1" ? (
        <p className="workspace-note">
          Analysis Handover is already locked for Design.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "missing" ? (
        <p className="workspace-error">
          Please complete the required fields: {missingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "handover" ? (
        <p className="workspace-error">
          Save the Analysis Handover before locking it for Design.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "route" ? (
        <p className="workspace-error">
          This Analysis cannot open Design yet. Motivation, Environment, or
          Mixed gaps need an explicit separable Knowledge or Skill component,
          and the course-fit decision must confirm course design is appropriate.
        </p>
      ) : null}

      {handoverLocked && handover ? (
        <>
          <AnalysisSummaryPanel
            handover={handover}
            courseFitDecision={diagnosis?.courseFitDecision}
          />
          <div className="next-step-panel">
            <h2>Design is open</h2>
            <p>
              The Analysis Handover is locked. Capacity Map can now use this
              record as the read-only design reference.
            </p>
            <nav className="workspace-nav" aria-label="Analysis locked actions">
              <Link
                className="workspace-link primary"
                href={`/studio/courses/${courseId}/capacity-map`}
              >
                Continue to Capacity Map
              </Link>
              <Link className="workspace-link" href="/studio/courses">
                My courses
              </Link>
            </nav>
          </div>
        </>
      ) : (
        <>

      <form action={saveAction} className="setup-form">
        <label>
          <span>What training or support is being requested?</span>
          <textarea
            name="surfaceRequest"
            required
            defaultValue={diagnosis?.surfaceRequest}
          />
        </label>
        <label>
          <span>What evidence shows a real performance or practice gap?</span>
          <textarea
            name="performanceEvidence"
            required
            defaultValue={diagnosis?.performanceEvidence}
          />
        </label>
        <div className="form-grid">
          <label>
            <span>Current reality</span>
            <textarea
              name="currentReality"
              required
              defaultValue={diagnosis?.currentReality}
            />
          </label>
          <label>
            <span>Desired reality</span>
            <textarea
              name="desiredReality"
              required
              defaultValue={diagnosis?.desiredReality}
            />
          </label>
        </div>
        <label>
          <span>Affected learner group</span>
          <input
            name="affectedLearnerGroup"
            required
            defaultValue={diagnosis?.affectedLearnerGroup}
          />
        </label>
        <fieldset>
          <legend>Evidence source</legend>
          <label>
            <span>Source or reference</span>
            <input
              name="evidenceSource"
              required
              defaultValue={evidenceSources.source}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Evidence type</span>
              <input
                name="evidenceType"
                required
                defaultValue={evidenceSources.type}
              />
            </label>
            <label>
              <span>Evidence date or period</span>
              <input name="evidencePeriod" defaultValue={evidenceSources.period} />
            </label>
          </div>
        </fieldset>
        <div className="form-grid">
          <label>
            <span>KSME gap</span>
            <select name="ksmeGap" required defaultValue={diagnosis?.ksmeGap}>
              <option value="">Choose the main gap</option>
              <option value="knowledge">Knowledge</option>
              <option value="skill">Skill</option>
              <option value="motivation">Motivation</option>
              <option value="environment">Environment or resource condition</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label>
            <span>Course-fit decision</span>
            <select
              name="courseFitDecision"
              required
              defaultValue={diagnosis?.courseFitDecision}
            >
              <option value="">Choose a decision</option>
              <option value="course-fit">A course is likely appropriate</option>
              <option value="needs-more-evidence">
                Pause until stronger evidence is added
              </option>
              <option value="alternative-intervention">
                Recommend another intervention
              </option>
            </select>
          </label>
        </div>
        <label>
          <span>Alternative intervention recommendation</span>
          <textarea
            name="alternativeIntervention"
            defaultValue={diagnosis?.alternativeIntervention}
          />
        </label>

        <fieldset>
          <legend>Analysis-to-Design Handover</legend>
          <label>
            <span>Validated capacity gap</span>
            <textarea
              name="validatedCapacityGap"
              required
              defaultValue={
                handover?.validatedCapacityGap || diagnosis?.performanceEvidence
              }
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Baseline</span>
              <textarea
                name="baseline"
                required
                defaultValue={handover?.baseline || diagnosis?.currentReality}
              />
            </label>
            <label>
              <span>Desired practice</span>
              <textarea
                name="desiredPractice"
                required
                defaultValue={
                  handover?.desiredPractice || diagnosis?.desiredReality
                }
              />
            </label>
          </div>
          <label>
            <span>Root cause summary</span>
            <textarea
              name="rootCauseSummary"
              required
              defaultValue={handover?.rootCauseSummary || diagnosis?.surfaceRequest}
            />
          </label>
          <label>
            <span>Separable Knowledge or Skill component</span>
            <textarea
              name="separableKnowledgeSkillComponent"
              defaultValue={handover?.separableKnowledgeSkillComponent}
            />
          </label>
          <p className="section-subcopy">
            Required when the main route is Motivation, Environment, or Mixed.
            Phase 1 course production can continue only for the clear Knowledge
            or Skill component.
          </p>
          <label>
            <span>Intervention decision</span>
            <textarea
              name="interventionDecision"
              required
              defaultValue={handover?.interventionDecision}
            />
          </label>
          <label>
            <span>Safeguards and no-harm note</span>
            <textarea
              name="safeguardsNote"
              required
              defaultValue={handover?.safeguardsNote}
            />
          </label>
          <label>
            <span>Evaluation anchor</span>
            <textarea
              name="evaluationAnchor"
              required
              defaultValue={handover?.evaluationAnchor}
            />
          </label>
        </fieldset>

        <div className="next-step-panel">
          <h2>Analysis route check</h2>
          <p>{routeDecision}</p>
          {diagnosis?.ksmeGap &&
          requiresSeparableKnowledgeSkill(diagnosis.ksmeGap) ? (
            <p>
              Record the separable Knowledge or Skill component before locking
              this handover for Design.
            </p>
          ) : null}
        </div>

        <div className="studio-actions">
          <button className="workspace-button" type="submit">
            Save Analysis Handover
          </button>
          <Link
            className="workspace-link"
            href={`/studio/courses/${courseId}/setup`}
          >
            Back to Course Setup
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            My courses
          </Link>
        </div>
      </form>

      {handover ? (
        <section className="studio-section" aria-labelledby="lock-analysis-title">
          <h2 id="lock-analysis-title">Lock Analysis for Design</h2>
          <div className="context-grid">
            <article>
              <strong>Handover status</strong>
              <span>{getAnalysisHandoverStatusLabel(handover)}</span>
            </article>
            <article>
              <strong>Route decision</strong>
              <span>{routeDecision}</span>
            </article>
          </div>
          <form action={lockAction} className="studio-actions">
            <button
              className="workspace-button"
              type="submit"
              disabled={!canProceed}
            >
              Lock Analysis for Design
            </button>
          </form>
        </section>
      ) : null}
        </>
      )}
    </WorkspaceShell>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  analysisHandoverFieldLabels,
  canAnalysisProceedToDesign,
  getAnalysisGateDecisionLabel,
  getAnalysisHandoverStatusLabel,
  getAnalysisRouteDecisionLabel,
  isAnalysisHandoverLocked,
  requiresSeparableKnowledgeSkill,
  validateAnalysisAnchorConsistency,
} from "@/lib/studio/analysis-handover";
import { decCapacityAreas } from "@/lib/studio/capacity-map";
import { getEditableCourseVersion, getWorkflowStepStatus } from "@/lib/studio/courses";
import {
  getCourseFitDecisionLabel,
  diagnosisFieldLabels,
  parseEvidenceSources,
} from "@/lib/studio/diagnosis";
import {
  resolveCourseSetupDiagnosisSnapshot,
  type CourseSetupDiagnosisSnapshot,
} from "@/lib/studio/diagnosis-selection";
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
  const linkedDiagnosisRecord = editable.version.setup?.selectedDiagnosisRecordId
    ? await prisma.diagnosisRecord.findUnique({
        where: {
          id: editable.version.setup.selectedDiagnosisRecordId,
        },
        include: {
          dataset: true,
        },
      })
    : null;
  const inheritedDiagnosisSnapshot = resolveCourseSetupDiagnosisSnapshot({
    linkedRecord: linkedDiagnosisRecord,
    snapshotValue: editable.version.setup?.diagnosisSnapshot,
  });
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
          analysisGateDecision: handover.analysisGateDecision,
        })
      : "Prepare the Analysis handover before Design can continue.";
  const canProceed =
    diagnosis && handover
      ? canAnalysisProceedToDesign({
          courseFitDecision: diagnosis.courseFitDecision,
          ksmeRoute: handover.ksmeRoute,
          separableKnowledgeSkillComponent:
            handover.separableKnowledgeSkillComponent,
          analysisGateDecision: handover.analysisGateDecision,
        })
      : false;
  const anchorConsistency =
    diagnosis && handover
      ? validateAnalysisAnchorConsistency({
          diagnosis: {
            affectedLearnerGroup: diagnosis.affectedLearnerGroup,
            courseFitDecision: diagnosis.courseFitDecision,
          },
          handover,
          snapshot: inheritedDiagnosisSnapshot,
        })
      : {
          ok: Boolean(inheritedDiagnosisSnapshot),
          issues: inheritedDiagnosisSnapshot
            ? []
            : [
                "No approved diagnosis evidence is linked to this course. Return to Course Setup and select a valid diagnosis record before locking Analysis for Design.",
              ],
        };
  const canLockForDesign = Boolean(canProceed && anchorConsistency.ok);

  return (
    <WorkspaceShell eyebrow="Diagnosis" title={editable.course.title}>
      <div className="diagnosis-hero">
        <div>
          <p>
            Confirm the practical CSO challenge, evidence, K/S/M/E route,
            safeguards, and evaluation anchor before Design opens.
          </p>
          <div className="review-hero-status" aria-label="Diagnosis status">
            <span
              className={`status-badge ${
                handoverLocked ? "status-badge-ready" : ""
              }`}
            >
              {handover ? getAnalysisHandoverStatusLabel(handover) : "Draft not saved"}
            </span>
            <span
              className={`status-badge ${
                canProceed ? "status-badge-ready" : "status-badge-blocked"
              }`}
            >
              {canProceed ? "Design can open" : "Design waits"}
            </span>
            <span className="status-badge">
              {diagnosis?.ksmeGap
                ? diagnosis.ksmeGap.toUpperCase()
                : "KSME not set"}
            </span>
          </div>
        </div>
        <div className="diagnosis-hero-next">
          <strong>Analysis route check</strong>
          <span>{routeDecision}</span>
        </div>
      </div>
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
      {resolvedSearchParams?.error === "anchor" ? (
        <p className="workspace-error">
          This Analysis handover does not yet align with the approved diagnosis
          evidence selected in Course Setup. Please revise the Analysis fields
          or return to Course Setup if a different diagnosis record is needed.
        </p>
      ) : null}

      <ApprovedDiagnosisEvidencePanel
        courseId={courseId}
        snapshot={inheritedDiagnosisSnapshot}
      />

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
        <section className="setup-form-section" aria-labelledby="diagnosis-evidence-title">
          <div>
            <h2 id="diagnosis-evidence-title">Diagnosis evidence</h2>
            <p className="section-subcopy">
              Confirm the request, evidence, current practice, and desired
              practice before routing the work.
            </p>
          </div>
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
          <div className="setup-subsection">
            <h3>Evidence source</h3>
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
                <input
                  name="evidencePeriod"
                  defaultValue={evidenceSources.period}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="setup-form-section" aria-labelledby="diagnosis-route-title">
          <div>
            <h2 id="diagnosis-route-title">Course-fit route</h2>
            <p className="section-subcopy">
              Decide whether the gap is a course-fit and whether a separable
              Knowledge or Skill component exists.
            </p>
          </div>
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
                  Needs further diagnosis
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
        </section>

        <section className="setup-form-section" aria-labelledby="analysis-handover-title">
          <div>
            <h2 id="analysis-handover-title">Analysis-to-Design Handover</h2>
            <p className="section-subcopy">
              The locked evidence package Design will use as its source.
            </p>
          </div>
          <div className="form-grid">
            <label>
              <span>Capacity area</span>
              <select
                name="capacityArea"
                required
                defaultValue={handover?.capacityArea || ""}
              >
                <option value="">Choose a DEC capacity area</option>
                {decCapacityAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Capacity Practice Area</span>
              <input
                name="subCapacityArea"
                required
                defaultValue={handover?.subCapacityArea}
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              <span>Linked standard or framework</span>
              <input
                name="linkedStandard"
                required
                defaultValue={handover?.linkedStandard}
              />
            </label>
            <label>
              <span>Capacity indicator or evidence marker</span>
              <input
                name="capacityIndicator"
                required
                defaultValue={handover?.capacityIndicator}
              />
            </label>
          </div>
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
            <span>Analysis Gate decision</span>
            <select
              name="analysisGateDecision"
              required
              defaultValue={handover?.analysisGateDecision || ""}
            >
              <option value="">Choose a gate decision</option>
              <option value="proceed-to-design">Proceed to Design</option>
              <option value="proceed-with-conditions">
                Proceed to Design with conditions
              </option>
              <option value="needs-further-diagnosis">
                Needs further diagnosis
              </option>
              <option value="non-course-route">Non-course route</option>
            </select>
          </label>
          <label>
            <span>Referral or further-diagnosis note</span>
            <textarea
              name="referralOrFurtherDiagnosisNote"
              defaultValue={handover?.referralOrFurtherDiagnosisNote}
            />
          </label>
          <p className="section-subcopy">
            Required when the issue needs further diagnosis or should be routed
            outside course production.
          </p>
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
        </section>

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
        <section
          className="studio-section setup-form-section"
          aria-labelledby="lock-analysis-title"
        >
          <div className="section-heading-row">
            <div>
              <h2 id="lock-analysis-title">Lock Analysis for Design</h2>
              <p className="section-subcopy">
                Locking makes this handover the read-only Design reference.
              </p>
            </div>
            <span
              className={`status-badge ${
                canLockForDesign ? "status-badge-ready" : "status-badge-blocked"
              }`}
            >
              {canLockForDesign ? "Ready to lock" : "Not ready"}
            </span>
          </div>
          {!anchorConsistency.ok ? (
            <div className="analysis-consistency-panel" role="alert">
              <h3>Evidence alignment needed</h3>
              <p>
                This Analysis handover does not yet align with the approved
                diagnosis evidence selected in Course Setup.
              </p>
              <ul>
                {anchorConsistency.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="context-grid">
            <article>
              <strong>Handover status</strong>
              <span>{getAnalysisHandoverStatusLabel(handover)}</span>
            </article>
            <article>
              <strong>Course-fit decision</strong>
              <span>{getCourseFitDecisionLabel(diagnosis?.courseFitDecision || "")}</span>
            </article>
            <article>
              <strong>Analysis Gate decision</strong>
              <span>{getAnalysisGateDecisionLabel(handover.analysisGateDecision)}</span>
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
              disabled={!canLockForDesign}
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

function ApprovedDiagnosisEvidencePanel({
  courseId,
  snapshot,
}: {
  courseId: string;
  snapshot: CourseSetupDiagnosisSnapshot | null;
}) {
  if (!snapshot) {
    return (
      <section
        className="approved-diagnosis-panel approved-diagnosis-panel-warning"
        aria-labelledby="approved-diagnosis-title"
      >
        <div className="section-heading-row">
          <div>
            <h2 id="approved-diagnosis-title">
              Approved diagnosis evidence
            </h2>
            <p className="section-subcopy">
              No approved diagnosis evidence is linked to this course. Return to
              Course Setup and select a valid diagnosis record before
              continuing.
            </p>
          </div>
          <span className="status-badge status-badge-blocked">
            Evidence missing
          </span>
        </div>
        <Link
          className="workspace-link primary"
          href={`/studio/courses/${courseId}/setup`}
        >
          Return to Course Setup
        </Link>
      </section>
    );
  }

  return (
    <section
      className="approved-diagnosis-panel"
      aria-labelledby="approved-diagnosis-title"
    >
      <div className="section-heading-row">
        <div>
          <h2 id="approved-diagnosis-title">Approved diagnosis evidence</h2>
          <p className="section-subcopy">
            This course starts from the approved diagnosis record selected
            during Course Setup. Use this as the evidence anchor for
            course-specific analysis.
          </p>
        </div>
        <div className="review-hero-status" aria-label="Inherited evidence badges">
          <span className="status-badge status-badge-ready">Read-only</span>
          <span className="status-badge">{snapshot.record.ksmeRoute}</span>
          <span className="status-badge status-badge-ready">
            {snapshot.record.courseFitDecision}
          </span>
          <span className="status-badge">
            {snapshot.record.dataSensitivityLevel || "Sensitivity not set"}
          </span>
        </div>
      </div>

      <div className="approved-diagnosis-title-card">
        <div>
          <span className="status-badge status-badge-ready">
            Locked evidence
          </span>
          <h3>{snapshot.record.title}</h3>
          <p>
            {snapshot.record.code} · {snapshot.dataset.code} ·{" "}
            {snapshot.dataset.title}
          </p>
        </div>
      </div>

      <dl className="approved-diagnosis-facts">
        <EvidenceFact label="Core capacity area" value={snapshot.record.coreCapacityArea} />
        <EvidenceFact
          label="Capacity Practice Area"
          value={
            snapshot.record.capacityPracticeArea || snapshot.record.subCapacity
          }
        />
        <EvidenceFact label="Target Audience" value={snapshot.record.targetAudience} />
        <EvidenceFact label="Region" value={snapshot.record.region} />
        <EvidenceFact label="Current baseline" value={snapshot.record.currentBaseline} />
        <EvidenceFact
          label="Capacity gap statement"
          value={snapshot.record.capacityGapStatement}
        />
        <EvidenceFact label="Desired practice" value={snapshot.record.desiredPractice} />
        <EvidenceFact
          label="Evidence source summary"
          value={snapshot.record.evidenceSourceSummary}
        />
        <EvidenceFact label="K/S/M/E route" value={snapshot.record.ksmeRoute} />
        <EvidenceFact
          label="Separable Knowledge/Skill component"
          value={snapshot.record.separableKnowledgeSkillComponent}
        />
        <EvidenceFact
          label="Course-Fit Decision"
          value={snapshot.record.courseFitDecision}
        />
        <EvidenceFact
          label="Safeguarding / no-harm note"
          value={snapshot.record.noHarmNote}
        />
        <EvidenceFact
          label="Data sensitivity level"
          value={snapshot.record.dataSensitivityLevel}
        />
        <EvidenceFact label="Evaluation anchor" value={snapshot.record.evaluationAnchor} />
        <EvidenceFact label="Monitoring signal" value={snapshot.record.monitoringSignal} />
        <EvidenceFact
          label="Possible practical proof"
          value={snapshot.record.possiblePracticalProof}
        />
        <EvidenceFact
          label="Verified achievement example"
          value={snapshot.record.verifiedAchievementExample}
        />
      </dl>
    </section>
  );
}

function EvidenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || "Not specified"}</dd>
    </div>
  );
}

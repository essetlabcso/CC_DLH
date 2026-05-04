import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { DesignAnchorPanel } from "@/components/studio/DesignAnchorPanel";
import { EvidenceContextPanel } from "@/components/studio/EvidenceContextPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { isAnalysisHandoverLocked } from "@/lib/studio/analysis-handover";
import { capacityMapFieldLabels } from "@/lib/studio/capacity-map";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";
import { buildEvidenceContextDisplayModel } from "@/lib/studio/evidence-context";

import { saveCourseCapacityMapAction } from "../../../actions";

function formatCapacityStatus(status?: WorkflowStepStatus) {
  switch (status) {
    case WorkflowStepStatus.COMPLETE:
      return "Complete";
    case WorkflowStepStatus.IN_PROGRESS:
      return "In progress";
    case WorkflowStepStatus.LOCKED:
      return "Locked";
    default:
      return "Ready";
  }
}

type CapacityMapPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    analysisLocked?: string;
    error?: string;
    fields?: string;
  }>;
};

export default async function CapacityMapPage({
  params,
  searchParams,
}: CapacityMapPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/capacity-map`,
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

  const diagnosisStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.DIAGNOSIS,
  );
  const capacityMapStatus = getWorkflowStepStatus(
    editable.version.workflowSteps,
    CourseWorkflowStep.CAPACITY_MAP,
  );
  const diagnosis = editable.version.diagnosis;
  const handover = editable.version.analysisHandover;

  if (
    diagnosisStatus !== WorkflowStepStatus.COMPLETE ||
    !isAnalysisHandoverLocked(handover) ||
    capacityMapStatus === WorkflowStepStatus.LOCKED
  ) {
    return (
      <WorkspaceShell eyebrow="Capacity Map" title={editable.course.title}>
        <p>
          Lock the Analysis Handover for Design before mapping this course to a
          CSO capacity area and standard.
        </p>
        {capacityMapStatus === WorkflowStepStatus.LOCKED ? (
          <p className="workspace-note">
            Capacity Map is paused until the Analysis Handover is approved and
            locked for Design.
          </p>
        ) : null}
        <nav className="workspace-nav" aria-label="Capacity Map recovery">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/diagnosis`}
          >
            Go to Diagnosis
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </nav>
      </WorkspaceShell>
    );
  }

  const capacityMap = editable.version.capacityMap;
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
  const evidenceContext = buildEvidenceContextDisplayModel({
    analysisHandover: handover,
    currentStageLabel: "Capacity Map",
    diagnosisSnapshotValue: editable.version.setup?.diagnosisSnapshot,
    linkedDiagnosisRecord,
  });
  const saveAction = saveCourseCapacityMapAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => capacityMapFieldLabels[field] || field)
    : [];

  return (
    <WorkspaceShell eyebrow="Capacity Map" title={editable.course.title}>
      <section className="capacity-hero" aria-labelledby="capacity-map-overview">
        <div>
          <h2 id="capacity-map-overview">Map the course to capacity change</h2>
          <p>
            Place this course inside a CSO capacity domain, link it to a
            relevant standard, and define the capacity outcome that future
            monitoring should watch.
          </p>
          <div className="status-row" aria-label="Capacity Map status">
            <span className="status-badge status-badge-ready">
              Analysis locked
            </span>
            <span className="status-badge status-badge-ready">
              Design anchors available
            </span>
            <span className="status-badge">
              Capacity Map {formatCapacityStatus(capacityMapStatus)}
            </span>
          </div>
        </div>
        <div className="capacity-hero-next">
          <strong>Design anchor</strong>
          <span>
            Use the locked Analysis Handover to keep the Capacity Map aligned
            with the validated CSO need.
          </span>
        </div>
      </section>
      {resolvedSearchParams?.analysisLocked === "1" ? (
        <p className="workspace-note">
          Analysis Handover locked for Design. Capacity Map is now open.
        </p>
      ) : null}
      {resolvedSearchParams?.saved === "1" ? (
        <p className="workspace-note">Capacity Map saved.</p>
      ) : null}
      {resolvedSearchParams?.error === "missing" ? (
        <p className="workspace-error">
          Please complete the required fields: {missingFields.join(", ")}.
        </p>
      ) : null}

      {handover ? (
        <>
          <EvidenceContextPanel context={evidenceContext} />
          <AnalysisSummaryPanel
            handover={handover}
            courseFitDecision={diagnosis?.courseFitDecision}
          />
          <DesignAnchorPanel handover={handover} />
        </>
      ) : null}

      <form action={saveAction} className="setup-form">
        <section className="setup-form-section" aria-labelledby="capacity-source">
          <h2 id="capacity-source">Controlled Capacity Map anchors</h2>
          <p className="section-subcopy">
            Core Capacity Area, Capacity Practice Area, linked standard, and
            capacity indicator come from the locked Analysis Handover.
          </p>
          <div className="context-grid">
            <article>
              <strong>Core Capacity Area</strong>
              <span>{handover?.capacityArea || "Not set"}</span>
            </article>
            <article>
              <strong>Capacity Practice Area</strong>
              <span>{handover?.subCapacityArea || "Not set"}</span>
            </article>
            <article>
              <strong>Linked standard</strong>
              <span>{handover?.linkedStandard || "Not set"}</span>
            </article>
            <article>
              <strong>Capacity indicator</strong>
              <span>{handover?.capacityIndicator || "Not set"}</span>
            </article>
          </div>
        </section>
        <section
          className="setup-form-section"
          aria-labelledby="capacity-outcome"
        >
          <div>
            <h2 id="capacity-outcome">Capacity focus and outcome</h2>
            <p className="section-subcopy">
              Define what capacity should improve and the outcome this course
              should make observable.
            </p>
          </div>
          <label>
            <span>Capability focus</span>
            <textarea
              name="capabilityFocus"
              required
              defaultValue={
                capacityMap?.capabilityFocus || handover?.capacityIndicator
              }
            />
          </label>
          <label>
            <span>Capacity outcome</span>
            <textarea
              name="capacityOutcome"
              required
              defaultValue={capacityMap?.capacityOutcome || handover?.desiredPractice}
            />
          </label>
        </section>
        <section
          className="setup-form-section"
          aria-labelledby="capacity-monitoring"
        >
          <div>
            <h2 id="capacity-monitoring">Diagnosis and monitoring link</h2>
            <p className="section-subcopy">
              Connect the mapped capacity outcome back to the diagnosis evidence
              and the future monitoring signal.
            </p>
          </div>
          <label>
            <span>How this links back to Diagnosis</span>
            <textarea
              name="diagnosisLink"
              required
              defaultValue={
                capacityMap?.diagnosisLink || handover?.validatedCapacityGap
              }
            />
          </label>
          <label>
            <span>Monitoring relevance</span>
            <textarea
              name="monitoringRelevance"
              required
              defaultValue={
                capacityMap?.monitoringRelevance || handover?.evaluationAnchor
              }
            />
          </label>
        </section>

        <div className="next-step-panel">
          <h2>Next step: Action Map</h2>
          <p>
            Action Map will translate this capacity outcome into observable
            learner actions, practice scenarios, and essential information.
          </p>
          <nav className="workspace-nav" aria-label="Capacity Map next step">
            <Link
              className="workspace-link primary"
              href={`/studio/courses/${courseId}/action-map`}
            >
              Continue to Action Map
            </Link>
          </nav>
        </div>

        <div className="studio-actions">
          <button className="workspace-button" type="submit">
            Save Capacity Map
          </button>
          <Link
            className="workspace-link"
            href={`/studio/courses/${courseId}/diagnosis`}
          >
            Back to Diagnosis
          </Link>
          <Link className="workspace-link" href="/studio/courses">
            My courses
          </Link>
        </div>
      </form>
    </WorkspaceShell>
  );
}

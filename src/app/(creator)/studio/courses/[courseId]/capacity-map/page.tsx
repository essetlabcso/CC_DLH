import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalysisSummaryPanel } from "@/components/studio/AnalysisSummaryPanel";
import { DesignAnchorPanel } from "@/components/studio/DesignAnchorPanel";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { isAnalysisHandoverLocked } from "@/lib/studio/analysis-handover";
import { capacityMapFieldLabels } from "@/lib/studio/capacity-map";
import {
  getEditableCourseVersion,
  getWorkflowStepStatus,
} from "@/lib/studio/courses";

import { saveCourseCapacityMapAction } from "../../../actions";

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
  const saveAction = saveCourseCapacityMapAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields
        .split(",")
        .filter(Boolean)
        .map((field) => capacityMapFieldLabels[field] || field)
    : [];

  return (
    <WorkspaceShell eyebrow="Capacity Map" title={editable.course.title}>
      <p>
        Place this course inside a CSO capacity domain, link it to a relevant
        standard, and define the capacity outcome that future monitoring should
        watch.
      </p>
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
          <AnalysisSummaryPanel
            handover={handover}
            courseFitDecision={diagnosis?.courseFitDecision}
          />
          <DesignAnchorPanel handover={handover} />
        </>
      ) : null}

      <form action={saveAction} className="setup-form">
        <section className="studio-section" aria-labelledby="capacity-source">
          <h2 id="capacity-source">Controlled Capacity Map anchors</h2>
          <p className="section-subcopy">
            Core Capacity Area, Capacity Practice Area, linked standard, and capacity
            indicator come from the locked Analysis Handover.
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
        <label>
          <span>Capability focus</span>
          <textarea
            name="capabilityFocus"
            required
            defaultValue={capacityMap?.capabilityFocus || handover?.capacityIndicator}
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
            defaultValue={capacityMap?.monitoringRelevance || handover?.evaluationAnchor}
          />
        </label>

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

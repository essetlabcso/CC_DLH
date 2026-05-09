import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseWorkflowStep, WorkflowStepStatus } from "@prisma/client";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { getEditableCourseVersion } from "@/lib/studio/courses";
import { parseCourseSetupDiagnosisSnapshot } from "@/lib/studio/diagnosis-selection";
import { getCourseSetupDiagnosisOptions } from "@/lib/studio/diagnosis-options";
import {
  getCourseSetupReferenceOptions,
  type CourseSetupReferenceOption,
} from "@/lib/studio/setup-reference-options";

import { saveCourseSetupAction } from "../../../actions";

type CourseSetupPageProps = {
  params?: Promise<{
    courseId?: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    fields?: string;
  }>;
};

export default async function CourseSetupPage({
  params,
  searchParams,
}: CourseSetupPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = resolvedParams?.courseId;

  if (!courseId) {
    notFound();
  }

  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/setup`,
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

  const setup = editable.version.setup;
  const learnerReality = parseLearnerReality(setup?.learnerReality);
  const diagnosisOptions = await getCourseSetupDiagnosisOptions(prisma);
  const referenceOptions = await getCourseSetupReferenceOptions(prisma);
  const selectedDiagnosis = setup?.selectedDiagnosisRecordId
    ? diagnosisOptions.find(
        (option) => option.id === setup.selectedDiagnosisRecordId,
      )
    : null;
  const savedDiagnosisSnapshot = parseCourseSetupDiagnosisSnapshot(
    setup?.diagnosisSnapshot,
  );
  const saveAction = saveCourseSetupAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields.split(",").filter(Boolean)
    : [];
  const courseSetupComplete =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.COURSE_SETUP,
    )?.status === WorkflowStepStatus.COMPLETE;
  const canContinueToDiagnosis = Boolean(selectedDiagnosis) || courseSetupComplete;

  return (
    <WorkspaceShell eyebrow="Course Setup" title={editable.course.title}>
      <div className="setup-hero">
        <div>
          <p>
            Define the course identity, learner group, access realities, and
            early certificate intent before moving into Diagnosis.
          </p>
          <div className="review-hero-status" aria-label="Course Setup summary">
            <span className="status-badge status-badge-ready">
              Private draft
            </span>
            <span className="status-badge">Setup first</span>
            <span className="status-badge status-badge-blocked">
              Diagnosis waits
            </span>
          </div>
        </div>
        <div className="setup-hero-next">
          <strong>What this unlocks</strong>
          <span>
            Saving setup uses a released diagnosis record as the locked source
            anchor for the course.
          </span>
        </div>
      </div>
      {resolvedSearchParams?.saved === "1" ? (
        <p className="workspace-note">Course Setup saved.</p>
      ) : null}
      {resolvedSearchParams?.error === "missing" ? (
        <p className="workspace-error">
          Please complete the required fields: {missingFields.join(", ")}.
        </p>
      ) : null}
      {resolvedSearchParams?.error === "diagnosis" ? (
        <p className="workspace-error">
          Select an approved and released diagnosis record before completing
          Course Setup. DEC courses must start from validated capacity evidence.
        </p>
      ) : null}

      <form action={saveAction} className="setup-form">
        <section
          className="setup-form-section diagnosis-anchor-section"
          aria-labelledby="setup-diagnosis-anchor-title"
        >
          <div className="diagnosis-anchor-heading">
            <div>
              <h2 id="setup-diagnosis-anchor-title">
                Diagnosis evidence anchor
              </h2>
              <p className="section-subcopy">
                DEC courses should start from approved and released capacity
                evidence. Select the validated capacity gap this course will
                respond to before completing Course Setup.
              </p>
            </div>
            {selectedDiagnosis ? (
              <span className="status-badge status-badge-ready">
                Locked source selected
              </span>
            ) : savedDiagnosisSnapshot ? (
              <span className="status-badge status-badge-blocked">
                Historical selection
              </span>
            ) : (
              <span className="status-badge status-badge-blocked">
                Evidence required
              </span>
            )}
          </div>

          {resolvedSearchParams?.error === "diagnosis" ? (
            <p className="workspace-error diagnosis-anchor-error">
              Select an approved and released diagnosis record before completing
              Course Setup. DEC courses must start from validated capacity
              evidence.
            </p>
          ) : null}

          {selectedDiagnosis ? (
            <SelectedDiagnosisSummary
              title={selectedDiagnosis.diagnosisTitle}
              code={selectedDiagnosis.diagnosisCode}
              dataset={`${selectedDiagnosis.datasetCode} · ${selectedDiagnosis.datasetTitle}`}
              capacityPracticeArea={
                selectedDiagnosis.capacityPracticeArea ||
                selectedDiagnosis.subCapacity
              }
              targetAudience={selectedDiagnosis.targetAudience}
              region={selectedDiagnosis.region}
              baseline={selectedDiagnosis.currentBaseline}
              capacityGap={selectedDiagnosis.capacityGapStatement}
              ksmeRoute={selectedDiagnosis.ksmeRoute}
              courseFitDecision={selectedDiagnosis.courseFitDecision}
              noHarmNote={selectedDiagnosis.noHarmNote}
              evaluationAnchor={selectedDiagnosis.evaluationAnchor}
            />
          ) : savedDiagnosisSnapshot ? (
            <SelectedDiagnosisSummary
              title={savedDiagnosisSnapshot.record.title}
              code={savedDiagnosisSnapshot.record.code}
              dataset={`${savedDiagnosisSnapshot.dataset.code} · ${savedDiagnosisSnapshot.dataset.title}`}
              capacityPracticeArea={
                savedDiagnosisSnapshot.record.capacityPracticeArea ||
                savedDiagnosisSnapshot.record.subCapacity
              }
              targetAudience={savedDiagnosisSnapshot.record.targetAudience}
              region={savedDiagnosisSnapshot.record.region}
              baseline={savedDiagnosisSnapshot.record.currentBaseline}
              capacityGap={savedDiagnosisSnapshot.record.capacityGapStatement}
              ksmeRoute={savedDiagnosisSnapshot.record.ksmeRoute}
              courseFitDecision={
                savedDiagnosisSnapshot.record.courseFitDecision
              }
              noHarmNote={savedDiagnosisSnapshot.record.noHarmNote}
              evaluationAnchor={savedDiagnosisSnapshot.record.evaluationAnchor}
              note="This saved context is preserved from the original selection. It may no longer be available for new course setup."
            />
          ) : null}

          <fieldset className="diagnosis-option-fieldset">
            <legend>Released diagnosis source anchors</legend>
            {diagnosisOptions.length > 0 ? (
              <div className="diagnosis-option-grid">
                {diagnosisOptions.map((option) => {
                  const selected = option.id === setup?.selectedDiagnosisRecordId;
                  const selectable = option.eligibility.selectable;

                  return (
                    <label
                      className={`diagnosis-option-card diagnosis-option-card-${option.eligibility.tone}`}
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name="selectedDiagnosisRecordId"
                        value={option.id}
                        defaultChecked={selected}
                        disabled={!selectable}
                      />
                      <span className="diagnosis-option-body">
                        <span className="diagnosis-option-title-row">
                          <strong>{option.diagnosisTitle}</strong>
                          <span
                            className={`status-badge ${getDiagnosisStatusBadgeClass(
                              option.eligibility.tone,
                            )}`}
                          >
                            {getDiagnosisStatusLabel(option.eligibility.tone)}
                          </span>
                        </span>
                        <span className="diagnosis-option-meta">
                          {option.diagnosisCode} · {option.datasetCode}
                        </span>
                        <span className="diagnosis-option-tags">
                          <span>{option.courseFitDecision}</span>
                          <span>K/S/M/E Route: {option.ksmeRoute}</span>
                          <span>Target Audience: {option.targetAudience}</span>
                        </span>
                        <span className="diagnosis-option-detail">
                          <strong>Capacity Practice Area</strong>
                          {option.capacityPracticeArea ||
                            option.subCapacity ||
                            "Not specified"}
                        </span>
                        <span className="diagnosis-option-detail">
                          <strong>Gap</strong>
                          {option.capacityGapStatement || "Not specified"}
                        </span>
                        <span className="diagnosis-option-note">
                          {option.eligibility.reason}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="workspace-note">
                No approved and released diagnosis records are available yet.
              </p>
            )}
          </fieldset>
        </section>

        <section className="setup-form-section" aria-labelledby="setup-identity-title">
          <div>
            <h2 id="setup-identity-title">Course identity</h2>
            <p className="section-subcopy">
              The learner-facing name and short description for this course.
            </p>
          </div>
          <label>
            <span>Course title</span>
            <input
              name="title"
              required
              defaultValue={setup?.title || editable.course.title}
            />
          </label>
          <label>
            <span>Summary</span>
            <textarea name="summary" required defaultValue={setup?.summary} />
          </label>
        </section>

        <section className="setup-form-section" aria-labelledby="setup-context-title">
          <div>
            <h2 id="setup-context-title">Learning context</h2>
            <p className="section-subcopy">
              Who this is for, what capacity area it serves, and how learners
              will take it.
            </p>
          </div>
          <label>
            <span>Target Audience</span>
            <SelectWithCurrentOption
              currentValue={setup?.primaryLearnerGroup}
              name="primaryLearnerGroup"
              options={referenceOptions.targetAudienceGroups}
              placeholder="Choose a Target Audience"
              required
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Language</span>
              <SelectWithCurrentOption
                currentValue={setup?.language || "English"}
                name="language"
                options={referenceOptions.courseLanguages}
                placeholder="Choose a language"
                required
              />
            </label>
            <label>
              <span>Delivery format</span>
              <SelectWithCurrentOption
                currentValue={setup?.formatAndTime}
                name="formatAndTime"
                options={referenceOptions.deliveryFormats}
                placeholder="Choose a delivery format"
                required
              />
            </label>
            <label>
              <span>Participant experience level</span>
              <SelectWithCurrentOption
                currentValue={setup?.level}
                name="level"
                options={referenceOptions.participantExperienceLevels}
                placeholder="Choose an experience level"
                required
              />
            </label>
            <label>
              <span>Broad capacity area</span>
              <SelectWithCurrentOption
                currentValue={setup?.capacityArea}
                name="capacityArea"
                options={referenceOptions.capacityAreas}
                placeholder="Choose a capacity area"
                required
              />
            </label>
          </div>
        </section>

        <section className="setup-form-section" aria-labelledby="setup-reality-title">
          <div>
            <h2 id="setup-reality-title">Learner reality</h2>
            <p className="section-subcopy">
              Access constraints that should shape the course design.
            </p>
          </div>
          <div className="form-grid">
            <label>
              <span>Device access</span>
              <input
                name="deviceAccess"
                defaultValue={learnerReality.deviceAccess}
              />
            </label>
            <label>
              <span>Connectivity</span>
              <input
                name="connectivity"
                defaultValue={learnerReality.connectivity}
              />
            </label>
            <label>
              <span>Time available for learning</span>
              <input
                name="timeAvailable"
                defaultValue={learnerReality.timeAvailable}
              />
            </label>
          </div>
        </section>

        <section className="setup-form-section" aria-labelledby="setup-readiness-title">
          <div>
            <h2 id="setup-readiness-title">Readiness flags</h2>
            <p className="section-subcopy">
              Early certificate intent and sensitivity signals for later review.
            </p>
          </div>
          <label>
            <span>Certificate intent</span>
            <textarea
              name="certificateIntent"
              defaultValue={setup?.certificateIntent}
            />
          </label>
          <label className="checkbox-row setup-sensitive-row">
            <input
              name="sensitiveFlag"
              type="checkbox"
              defaultChecked={setup?.sensitiveFlag}
            />
            <span>This course involves sensitive or high-stakes topics</span>
          </label>
        </section>

        <div className="studio-actions">
          <button className="workspace-button" type="submit">
            Save Course Setup
          </button>
          <Link className="workspace-link" href="/studio/courses">
            Back to My courses
          </Link>
        </div>
      </form>

      <div className="next-step-panel">
        <h2>Next step: Diagnosis</h2>
        <p>
          Diagnosis will preserve the selected capacity gap, baseline, K/S/M/E
          route, course-fit decision, safeguards, and evaluation anchor as the
          source for later design work.
        </p>
        <nav className="workspace-nav" aria-label="Course Setup next step">
          {canContinueToDiagnosis ? (
            <Link
              className="workspace-link primary"
              href={`/studio/courses/${courseId}/diagnosis`}
            >
              Continue to Diagnosis
            </Link>
          ) : (
            <span className="workspace-link disabled" aria-disabled="true">
              Select released diagnosis evidence to continue
            </span>
          )}
        </nav>
      </div>
    </WorkspaceShell>
  );
}

function SelectWithCurrentOption({
  currentValue,
  name,
  options,
  placeholder,
  required,
}: {
  currentValue: string | null | undefined;
  name: string;
  options: CourseSetupReferenceOption[];
  placeholder: string;
  required?: boolean;
}) {
  const normalizedCurrentValue = currentValue?.trim() ?? "";
  const hasCurrentOption =
    !normalizedCurrentValue ||
    options.some((option) => option.value === normalizedCurrentValue);

  return (
    <select
      defaultValue={normalizedCurrentValue}
      name={name}
      required={required}
    >
      <option value="">{placeholder}</option>
      {!hasCurrentOption ? (
        <option value={normalizedCurrentValue}>
          {normalizedCurrentValue} (saved value)
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function SelectedDiagnosisSummary({
  capacityPracticeArea,
  baseline,
  capacityGap,
  code,
  courseFitDecision,
  dataset,
  evaluationAnchor,
  ksmeRoute,
  note,
  noHarmNote,
  region,
  targetAudience,
  title,
}: {
  capacityPracticeArea: string;
  baseline: string;
  capacityGap: string;
  code: string;
  courseFitDecision: string;
  dataset: string;
  evaluationAnchor: string;
  ksmeRoute: string;
  note?: string;
  noHarmNote: string;
  region: string;
  targetAudience: string;
  title: string;
}) {
  return (
    <div className="selected-diagnosis-summary">
      <div>
        <span className="status-badge status-badge-ready">
          Locked source anchor
        </span>
        <h3>{title}</h3>
        <p>
          {code} · {dataset}
        </p>
        <p className="diagnosis-option-note">
          This released diagnosis record is the approved evidence source for the
          course. The capacity gap, K/S/M/E route, course-fit decision,
          baseline, safeguards, and evaluation anchor should not be silently
          changed by the course creator.
        </p>
      </div>
      <dl className="diagnosis-anchor-facts">
        <div>
          <dt>Validated Capacity Gap</dt>
          <dd>{capacityGap || "Not specified"}</dd>
        </div>
        <div>
          <dt>Baseline / Current Practice</dt>
          <dd>{baseline || "Not specified"}</dd>
        </div>
        <div>
          <dt>Capacity Practice Area</dt>
          <dd>{capacityPracticeArea || "Not specified"}</dd>
        </div>
        <div>
          <dt>Target Audience</dt>
          <dd>{targetAudience || "Not specified"}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{region || "Not specified"}</dd>
        </div>
        <div>
          <dt>K/S/M/E Route</dt>
          <dd>{ksmeRoute || "Not specified"}</dd>
        </div>
        <div>
          <dt>Course-Fit Decision</dt>
          <dd>{courseFitDecision || "Not specified"}</dd>
        </div>
        <div>
          <dt>Safeguards / No-Harm Note</dt>
          <dd>{noHarmNote || "Not specified"}</dd>
        </div>
        <div>
          <dt>Evaluation Anchor</dt>
          <dd>{evaluationAnchor || "Not specified"}</dd>
        </div>
      </dl>
      {note ? <p className="diagnosis-option-note">{note}</p> : null}
    </div>
  );
}

function getDiagnosisStatusBadgeClass(
  tone: "ready" | "partial" | "blocked",
) {
  if (tone === "ready") {
    return "status-badge-ready";
  }

  if (tone === "blocked") {
    return "status-badge-blocked";
  }

  return "";
}

function getDiagnosisStatusLabel(tone: "ready" | "partial" | "blocked") {
  if (tone === "ready") {
    return "Course-addressable";
  }

  if (tone === "blocked") {
    return "Not selectable";
  }

  return "Partly course-addressable";
}

function parseLearnerReality(value: string | undefined) {
  if (!value) {
    return {
      deviceAccess: "",
      connectivity: "",
      timeAvailable: "",
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<{
      deviceAccess: string;
      connectivity: string;
      timeAvailable: string;
    }>;

    return {
      deviceAccess: parsed.deviceAccess || "",
      connectivity: parsed.connectivity || "",
      timeAvailable: parsed.timeAvailable || "",
    };
  } catch {
    return {
      deviceAccess: "",
      connectivity: "",
      timeAvailable: "",
    };
  }
}

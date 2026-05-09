import Link from "next/link";

import type {
  AdminDiagnosisRecordDetail,
  AdminDiagnosisRecordDraftFormOptions,
} from "@/lib/admin/diagnosis";
import { getDiagnosisRecordDraftWarnings } from "@/lib/admin/diagnosis-record-form";

type DiagnosisRecordDraftFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  dataset: {
    datasetCode: string;
    datasetTitle: string;
    id: string;
  };
  error?: string;
  mode: "create" | "edit";
  options: AdminDiagnosisRecordDraftFormOptions;
  record?: AdminDiagnosisRecordDetail;
};

export function DiagnosisRecordDraftForm({
  action,
  dataset,
  error,
  mode,
  options,
  record,
}: DiagnosisRecordDraftFormProps) {
  const isEdit = mode === "edit";
  const warnings = getDiagnosisRecordDraftWarnings({
    courseFitDecision: record?.courseFitDecision ?? "",
    currentBaseline: record?.currentBaseline ?? "",
    desiredPractice: record?.desiredPractice ?? "",
    evidenceSource: record?.evidenceSource ?? "",
    evaluationAnchor: record?.evaluationAnchor ?? "",
    ksmeRoute: record?.ksmeRoute ?? "",
    noHarmNote: record?.noHarmNote ?? "",
    targetAudience: record?.targetAudience ?? "",
  });

  return (
    <form action={action} className="setup-form admin-draft-form">
      <input name="datasetId" type="hidden" value={dataset.id} />

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <fieldset>
        <legend>Evidence source package</legend>
        <dl className="reference-meta-list">
          <div>
            <dt>Package code</dt>
            <dd>{dataset.datasetCode}</dd>
          </div>
          <div>
            <dt>Package title</dt>
            <dd>{dataset.datasetTitle}</dd>
          </div>
        </dl>
        <p className="form-help">
          Draft records created here stay unavailable to Course Setup until
          approval and release to Course Creators are complete.
        </p>
      </fieldset>

      <fieldset>
        <legend>Record identity</legend>
        <label>
          <span>Diagnosis code</span>
          <input
            defaultValue={record?.diagnosisCode ?? ""}
            name="diagnosisCode"
            placeholder="AN-2026-001"
            required
          />
        </label>

        <label>
          <span>Diagnosis title</span>
          <input
            defaultValue={record?.diagnosisTitle ?? ""}
            name="diagnosisTitle"
            placeholder="Outcome evidence documentation gap"
            required
          />
        </label>

        <div className="form-grid">
          <SelectField
            defaultValue={record?.region}
            label="Region"
            name="region"
            options={options.geographicFocusAreas}
          />
          <label>
            <span>Organization / group</span>
            <input
              defaultValue={record?.organizationGroup ?? ""}
              name="organizationGroup"
              placeholder="Selected local CSO partners"
            />
          </label>
        </div>

        <label>
          <span>Sector / thematic area</span>
          <input
            defaultValue={record?.sectorThematicArea ?? ""}
            name="sectorThematicArea"
            placeholder="MEAL, governance, finance, safeguarding"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Capacity and Target Audience</legend>
        <SelectField
          defaultValue={record?.coreCapacityArea}
          label="Core Capacity Area"
          name="coreCapacityArea"
          options={options.capacityAreas}
          required
        />

        <div className="form-grid">
          <label>
            <span>Capacity Practice Area</span>
            <input
              defaultValue={record?.capacityPracticeArea ?? ""}
              name="capacityPracticeArea"
              placeholder="Outcome evidence and learning documentation"
            />
          </label>
          <label>
            <span>Sub-capacity</span>
            <input
              defaultValue={record?.subCapacity ?? ""}
              name="subCapacity"
              placeholder="Use when helpful for historical records"
            />
          </label>
        </div>

        <SelectField
          defaultValue={record?.targetAudience}
          label="Target Audience"
          name="targetAudience"
          options={options.targetAudienceGroups}
        />

        <label>
          <span>Indicator / standard link</span>
          <input
            defaultValue={record?.indicatorStandardLink ?? ""}
            name="indicatorStandardLink"
            placeholder="Relevant DEC, CSO, donor, or accountability standard"
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Evidence summary</legend>
        <label>
          <span>Capacity gap statement</span>
          <textarea
            defaultValue={record?.capacityGapStatement ?? ""}
            name="capacityGapStatement"
            placeholder="Describe the practical capacity gap this record captures."
            required
          />
        </label>

        <label>
          <span>Baseline / current practice</span>
          <textarea
            defaultValue={record?.currentBaseline ?? ""}
            name="currentBaseline"
            placeholder="What is currently happening?"
          />
        </label>

        <label>
          <span>Desired practice</span>
          <textarea
            defaultValue={record?.desiredPractice ?? ""}
            name="desiredPractice"
            placeholder="What should participants or CSOs be able to do better?"
          />
        </label>

        <label>
          <span>Evidence source summary</span>
          <textarea
            defaultValue={record?.evidenceSource ?? ""}
            name="evidenceSource"
            placeholder="Use safe summary wording. Do not include raw interviews or personal data."
          />
        </label>

        <label>
          <span>Root cause summary</span>
          <textarea
            defaultValue={record?.rootCauseSummary ?? ""}
            name="rootCauseSummary"
            placeholder="Summarize the reason this gap exists."
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>K/S/M/E and course-fit</legend>
        <div className="form-grid">
          <SelectField
            defaultValue={record?.ksmeRoute}
            label="K/S/M/E Route"
            name="ksmeRoute"
            options={options.ksmeRoutes}
          />
          <SelectField
            defaultValue={record?.courseFitDecision}
            label="Course-Fit Decision"
            name="courseFitDecision"
            options={options.courseFitDecisions}
          />
        </div>

        <label>
          <span>Separable Knowledge/Skill component</span>
          <textarea
            defaultValue={record?.separableKnowledgeSkillComponent ?? ""}
            name="separableKnowledgeSkillComponent"
            placeholder="Required if a Motivation, Environment, or Mixed record should become partly course-addressable."
          />
        </label>

        <label>
          <span>Non-course barrier or support note</span>
          <textarea
            defaultValue={record?.nonCourseBarrierSummary ?? ""}
            name="nonCourseBarrierSummary"
            placeholder="Record complementary support needed outside a course."
          />
        </label>

        <div className="form-grid">
          <label>
            <span>Recommended intervention route</span>
            <input
              defaultValue={record?.recommendedInterventionRoute ?? ""}
              name="recommendedInterventionRoute"
              placeholder="Course, blended support, coaching, toolkit"
            />
          </label>
          <label>
            <span>Recommended course or support title</span>
            <input
              defaultValue={record?.recommendedCourseOrSupportTitle ?? ""}
              name="recommendedCourseOrSupportTitle"
              placeholder="Working title or support route"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Priority, safety, and monitoring</legend>
        <div className="form-grid">
          <label>
            <span>Priority level</span>
            <input
              defaultValue={record?.priorityLevel ?? ""}
              name="priorityLevel"
              placeholder="Low, Medium, High"
            />
          </label>
          <label>
            <span>Priority rank</span>
            <input
              defaultValue={record?.priorityRank ?? ""}
              min="1"
              name="priorityRank"
              type="number"
            />
          </label>
        </div>

        <div className="form-grid">
          <SelectField
            defaultValue={record?.safeguardingRiskLevel}
            label="Safeguarding risk level"
            name="safeguardingRiskLevel"
            options={options.safeguardingRiskLevels}
          />
          <SelectField
            defaultValue={record?.dataSensitivityLevel}
            label="Data sensitivity"
            name="dataSensitivityLevel"
            options={options.dataSensitivityLevels}
          />
        </div>

        <label>
          <span>No-harm note</span>
          <textarea
            defaultValue={record?.noHarmNote ?? ""}
            name="noHarmNote"
            placeholder="Describe safety constraints and no-harm handling."
          />
        </label>

        <label>
          <span>Safe dashboard summary</span>
          <textarea
            defaultValue={record?.safeSummaryForDashboard ?? ""}
            name="safeSummaryForDashboard"
            placeholder="Safe summary that avoids raw sensitive evidence."
          />
        </label>

        <label>
          <span>Evaluation anchor</span>
          <textarea
            defaultValue={record?.evaluationAnchor ?? ""}
            name="evaluationAnchor"
            placeholder="What later evidence should show whether practice improved?"
          />
        </label>

        <label>
          <span>Monitoring signal</span>
          <textarea
            defaultValue={record?.monitoringSignal ?? ""}
            name="monitoringSignal"
            placeholder="What monitoring signal should preserve the link to this diagnosis?"
          />
        </label>

        <label>
          <span>Possible practical proof</span>
          <textarea
            defaultValue={record?.possiblePracticalProof ?? ""}
            name="possiblePracticalProof"
            placeholder="Optional future proof example, separate from certificate."
          />
        </label>

        <label>
          <span>Verified achievement example</span>
          <textarea
            defaultValue={record?.verifiedAchievementExample ?? ""}
            name="verifiedAchievementExample"
            placeholder="Optional future verified achievement example."
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Visibility and change reason</legend>
        <label>
          <span>Visibility scope</span>
          <select
            defaultValue={record?.visibilityScope ?? "ADMIN_ONLY"}
            name="visibilityScope"
          >
            <option value="ADMIN_ONLY">Admin only</option>
            <option value="DEC_COURSE_CREATORS">
              DEC course creators / internal course creation
            </option>
            <option value="INTERNAL_COURSE_CREATION">
              Internal course creation
            </option>
          </select>
        </label>

        {isEdit ? (
          <label>
            <span>Reason for update</span>
            <textarea
              name="updateReason"
              placeholder="Briefly explain why this draft diagnosis record is being updated."
              required
            />
          </label>
        ) : (
          <label>
            <span>Create reason</span>
            <textarea
              name="createReason"
              placeholder="Optional note for the Admin audit trail."
            />
          </label>
        )}
      </fieldset>

      {warnings.length > 0 ? (
        <section className="readiness-warning-panel" aria-labelledby="draft-warning-title">
          <h3 id="draft-warning-title">Draft readiness notes</h3>
          <p>
            These notes do not block draft save. They show what should be filled
            before approval and release review.
          </p>
          <ul>
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="form-actions">
        <button className="workspace-link" type="submit">
          {isEdit ? "Save draft record" : "Create draft record"}
        </button>
        <Link
          className="workspace-link secondary"
          href={
            record
              ? `/admin/diagnosis-records/${record.id}`
              : `/admin/diagnosis-datasets/${dataset.id}`
          }
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
  required = false,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <label>
      <span>{label}</span>
      <select
        className="workspace-select"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

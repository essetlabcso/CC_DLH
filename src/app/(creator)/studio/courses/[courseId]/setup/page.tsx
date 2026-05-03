import Link from "next/link";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { getEditableCourseVersion } from "@/lib/studio/courses";

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
  const saveAction = saveCourseSetupAction.bind(null, courseId);
  const missingFields = resolvedSearchParams?.fields
    ? resolvedSearchParams.fields.split(",").filter(Boolean)
    : [];

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
            Saving setup opens Diagnosis, where the practical CSO challenge and
            evidence are confirmed.
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

      <form action={saveAction} className="setup-form">
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
            <span>Primary learner group</span>
            <input
              name="primaryLearnerGroup"
              required
              defaultValue={setup?.primaryLearnerGroup}
            />
          </label>
          <div className="form-grid">
            <label>
              <span>Language</span>
              <input
                name="language"
                required
                defaultValue={setup?.language || "English"}
              />
            </label>
            <label>
              <span>Format and time expectation</span>
              <input
                name="formatAndTime"
                required
                defaultValue={setup?.formatAndTime}
              />
            </label>
            <label>
              <span>Level</span>
              <input name="level" required defaultValue={setup?.level} />
            </label>
            <label>
              <span>Broad capacity area</span>
              <input
                name="capacityArea"
                required
                defaultValue={setup?.capacityArea}
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
          Diagnosis will confirm the practical CSO challenge, evidence, KSME gap,
          and whether a course is the right intervention.
        </p>
        <nav className="workspace-nav" aria-label="Course Setup next step">
          <Link
            className="workspace-link primary"
            href={`/studio/courses/${courseId}/diagnosis`}
          >
            Continue to Diagnosis
          </Link>
        </nav>
      </div>
    </WorkspaceShell>
  );
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

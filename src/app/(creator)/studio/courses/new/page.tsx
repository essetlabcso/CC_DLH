import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

import { createCourseAction } from "../../actions";

export default function NewStudioCoursePage() {
  return (
    <WorkspaceShell eyebrow="Course Creator Studio" title="Start a course">
      <div className="new-course-hero">
        <div>
          <p>
            Start with Course Setup. The course will begin as a private draft
            and will stay inside the Studio until it passes creator review and
            formal review.
          </p>
          <div className="review-hero-status" aria-label="New course safeguards">
            <span className="status-badge status-badge-ready">
              Private draft
            </span>
            <span className="status-badge">Course Setup first</span>
            <span className="status-badge status-badge-blocked">
              Not learner-visible
            </span>
          </div>
        </div>
        <div className="new-course-next">
          <strong>After you start</strong>
          <span>
            You will go straight to Course Setup to define the learner group,
            course purpose, format, level, and certificate intent.
          </span>
        </div>
      </div>

      <section className="studio-section" aria-labelledby="start-path-title">
        <div className="section-heading-row">
          <div>
            <h2 id="start-path-title">Creator path</h2>
            <p className="section-subcopy">
              A course moves forward one governed step at a time.
            </p>
          </div>
        </div>
        <div className="studio-workflow-strip">
          <span className="workflow-chip workflow-chip-active">
            Setup starts now
          </span>
          <span className="workflow-chip workflow-chip-locked">Analysis</span>
          <span className="workflow-chip workflow-chip-locked">Design</span>
          <span className="workflow-chip workflow-chip-locked">Build</span>
          <span className="workflow-chip workflow-chip-locked">Preview</span>
          <span className="workflow-chip workflow-chip-locked">
            Submit for review
          </span>
        </div>
      </section>

      <div className="studio-actions" aria-label="Start course actions">
        <form action={createCourseAction}>
          <button className="workspace-button" type="submit">
            Begin Course Setup
          </button>
        </form>
        <Link className="workspace-link" href="/studio/courses">
          Back to My courses
        </Link>
      </div>
    </WorkspaceShell>
  );
}

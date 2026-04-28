import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

import { createCourseAction } from "../../actions";

export default function NewStudioCoursePage() {
  return (
    <WorkspaceShell eyebrow="Course Creator Studio" title="Start a course">
      <p>
        Start with Course Setup. The course will begin as a private draft and
        will stay inside the Studio until it passes creator review and formal
        review.
      </p>
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

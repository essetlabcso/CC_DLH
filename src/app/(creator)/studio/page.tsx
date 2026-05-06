import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { courseWorkflowSteps } from "@/lib/workflow/course-workflow";
import { getCourseStatusLabel, getCreatorCourses } from "@/lib/studio/courses";

import { createCourseAction } from "./actions";

export default async function StudioWorkspacePage() {
  const identity = await requireWorkspaceIdentity("/studio");
  const courses = await getCreatorCourses(prisma, {
    userId: identity.user.id,
    organizationId: identity.user.organizationId,
    role: identity.session.role,
  });
  const recentCourses = courses.filter((_, index) => index < 3);

  return (
    <WorkspaceShell eyebrow="Course Creator Studio" title="Course production">
      <p>
        Create DEC courses through a guided path from course setup and diagnosis
        through action mapping, storyboard, build, preview, review, and revision.
      </p>

      <div className="studio-actions" aria-label="Studio actions">
        <form action={createCourseAction}>
          <button className="workspace-button" type="submit">
            Start course
          </button>
        </form>
        <Link className="workspace-link" href="/studio/courses">
          My courses
        </Link>
      </div>

      <section className="studio-section" aria-labelledby="studio-summary-title">
        <h2 id="studio-summary-title">Production overview</h2>
        <div className="metric-grid">
          <article>
            <strong>{courses.length}</strong>
            <span>Courses in your workspace</span>
          </article>
          <article>
            <strong>
              {
                courses.filter(
                  (course) => course.versions[0]?.status === "RETURNED",
                ).length
              }
            </strong>
            <span>Returned for changes</span>
          </article>
          <article>
            <strong>
              {
                courses.filter(
                  (course) => course.versions[0]?.status === "PUBLISHED",
                ).length
              }
            </strong>
            <span>Published courses</span>
          </article>
        </div>
      </section>

      <section className="studio-section" aria-labelledby="recent-title">
        <div className="section-heading-row">
          <h2 id="recent-title">Recent courses</h2>
          <Link href="/studio/courses">View all</Link>
        </div>
        {recentCourses.length > 0 ? (
          <div className="course-list">
            {recentCourses.map((course) => {
              const version = course.versions[0];

              return (
                <article className="course-row" key={course.id}>
                  <div>
                    <h3>{course.title}</h3>
                    <p>{getCourseStatusLabel(version?.status, version?.reviewRecord?.checklist)}</p>
                  </div>
                  <Link href={`/studio/courses/${course.id}/setup`}>
                    Open setup
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No courses in production yet</h3>
            <p>
              Start with Course Setup to define the learner group, course
              purpose, access realities, and certificate intent.
            </p>
          </div>
        )}
      </section>

      <section className="studio-section" aria-labelledby="workflow-title">
        <h2 id="workflow-title">Creator workflow</h2>
        <ol className="workflow-list" aria-label="Course production path">
          {courseWorkflowSteps.map((step) => (
            <li key={step.step}>{step.label}</li>
          ))}
        </ol>
      </section>
    </WorkspaceShell>
  );
}

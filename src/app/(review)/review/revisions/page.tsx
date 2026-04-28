import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { createRevisionDraftAction } from "@/app/(review)/review/actions";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { formatPublishedDate } from "@/lib/review/publishing";

type RevisionQueuePageProps = {
  searchParams?: Promise<{
    requested?: string;
    draft?: string;
    version?: string;
  }>;
};

export default async function RevisionQueuePage({
  searchParams,
}: RevisionQueuePageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/revisions");
  const revisionRecords = await prisma.courseRevisionRecord.findMany({
    where: {
      courseVersion: {
        status: CourseVersionStatus.PUBLISHED,
        course: {
          organizationId: identity.user.organizationId,
        },
      },
    },
    include: {
      courseVersion: {
        include: {
          course: true,
          monitoringRecord: true,
          events: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Revision Queue" title="Requested revisions">
      <p>
        Review published courses that have been flagged for improvement. The
        live course remains published until a separate revision draft replaces
        it through review and publishing.
      </p>

      {resolvedSearchParams?.requested === "1" ? (
        <p className="workspace-note">
          Revision requested. The published course remains live.
        </p>
      ) : null}
      {resolvedSearchParams?.draft === "exists" ? (
        <p className="workspace-note">
          A revision draft already exists for this published course.
        </p>
      ) : null}
      {resolvedSearchParams?.draft === "created" ? (
        <p className="workspace-note">
          Revision draft created for the course owner in Studio.
        </p>
      ) : null}

      <section className="studio-section" aria-labelledby="revision-list-title">
        <h2 id="revision-list-title">Revision requests</h2>
        {revisionRecords.length > 0 ? (
          <div className="course-list course-list-spacious">
            {revisionRecords.map((record) => (
              <article className="course-row" key={record.id}>
                <div>
                  <h3>{record.courseVersion.course.title}</h3>
                  <p>
                    Published{" "}
                    {formatPublishedDate(record.courseVersion.publishedAt)} ·
                    Version {record.courseVersion.versionNumber}
                  </p>
                  <p>{record.revisionReason}</p>
                  {record.courseVersion.events[0]?.note ? (
                    <p>{record.courseVersion.events[0].note}</p>
                  ) : null}
                </div>
                <div className="studio-actions">
                  <form
                    action={createRevisionDraftAction.bind(
                      null,
                      record.courseVersion.course.id,
                      record.courseVersion.id,
                    )}
                  >
                    <button className="workspace-button" type="submit">
                      Create revision draft
                    </button>
                  </form>
                  <Link href="/review/monitoring">Open monitoring</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No revision requests yet</h3>
            <p>
              Requests will appear here when staff flag a published course from
              monitoring.
            </p>
          </div>
        )}
      </section>

      <nav className="workspace-nav" aria-label="Revision queue actions">
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
        <Link className="workspace-link" href="/review/monitoring">
          Monitoring
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

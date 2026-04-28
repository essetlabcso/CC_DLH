import { CourseVersionStatus } from "@prisma/client";
import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  countReviewBlocks,
  formatSubmittedDate,
  getReviewQueueStatusLabel,
  getReviewVersionTypeLabel,
} from "@/lib/review/queue";
import {
  getBuildToReviewHandoverFromChecklist,
  summarizeBuildToReviewHandover,
} from "@/lib/studio/build-review-handover";

type ReviewQueuePageProps = {
  searchParams?: Promise<{
    approved?: string;
    returned?: string;
  }>;
};

export default async function ReviewQueuePage({
  searchParams,
}: ReviewQueuePageProps) {
  const resolvedSearchParams = await searchParams;
  const identity = await requireWorkspaceIdentity("/review/queue");
  const submittedVersions = await prisma.courseVersion.findMany({
    where: {
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      createdBy: true,
      reviewRecord: true,
      modules: {
        include: {
          lessons: {
            include: {
              blocks: true,
            },
          },
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Review Queue" title="Submitted courses">
      <p>
        Open submitted course versions for runtime preview, checklist review,
        return comments, and approval decisions.
      </p>

      {resolvedSearchParams?.approved === "1" ? (
        <p className="workspace-note">
          Course approved. Publishing remains a separate controlled step.
        </p>
      ) : null}
      {resolvedSearchParams?.returned === "1" ? (
        <p className="workspace-note">
          Course returned to the creator with reviewer comments.
        </p>
      ) : null}

      {submittedVersions.length > 0 ? (
        <div className="course-list course-list-spacious">
          {submittedVersions.map((version) => {
            const handover = getBuildToReviewHandoverFromChecklist(
              version.reviewRecord?.checklist,
            );

            return (
              <article className="course-row" key={version.id}>
                <div>
                  <h2>{version.course.title}</h2>
                  <p>
                    {getReviewQueueStatusLabel(version.status)} ·{" "}
                    {getReviewVersionTypeLabel(version)} · Version{" "}
                    {version.versionNumber} · Submitted{" "}
                    {formatSubmittedDate(version.submittedAt)} · Creator{" "}
                    {version.createdBy.name} ·{" "}
                    {countReviewBlocks(version.modules)} blocks
                  </p>
                  <p>{summarizeBuildToReviewHandover(handover)}</p>
                  {handover ? (
                    <p>
                      Final test{" "}
                      {handover.finalTest.ready ? "ready" : "not ready"} · AI{" "}
                      {handover.aiReview.status} · {handover.certificateRule}
                    </p>
                  ) : null}
                  {version.reviewRecord?.decisionNotes ? (
                    <p>{version.reviewRecord.decisionNotes}</p>
                  ) : null}
                </div>
                <Link
                  href={`/review/courses/${version.course.id}/versions/${version.id}`}
                >
                  Open review
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state studio-section">
          <h2>No submitted courses yet</h2>
          <p>
            Submitted courses will appear here after creator-side review is
            complete.
          </p>
        </div>
      )}

      <nav className="workspace-nav" aria-label="Review queue actions">
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

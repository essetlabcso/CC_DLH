import Link from "next/link";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { getProofReviewStatusLabel } from "@/lib/review/proof-review";
import { formatPublishedDate } from "@/lib/review/publishing";

export default async function ProofReviewQueuePage() {
  const identity = await requireWorkspaceIdentity("/review/proof");
  const submissions = await prisma.learnerPracticalProofSubmission.findMany({
    where: {
      courseVersion: {
        course: {
          organizationId: identity.user.organizationId,
        },
      },
      visibilityDefault: "PRIVATE",
      donorVisibilityConsent: false,
      aiVerificationUsed: false,
    },
    include: {
      user: true,
      practicalProofConfig: true,
      courseVersion: {
        include: {
          course: true,
        },
      },
      reviewer: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return (
    <WorkspaceShell eyebrow="Proof Review" title="Private proof submissions">
      <p>
        Review private learner proof submissions separately from course
        certificates. Accepted proof does not automatically issue a verified
        achievement; eligible proof can be recognized separately by
        reviewer/admin action. Badge or public credential issuance is still not
        active.
      </p>

      {submissions.length > 0 ? (
        <div className="course-list course-list-spacious">
          {submissions.map((submission) => (
            <article className="course-row" key={submission.id}>
              <div>
                <h2>{submission.courseVersion.course.title}</h2>
                <p>
                  {submission.practicalProofConfig.proofTitle ||
                    "Practical proof"}{" "}
                  · Learner {submission.user.name} · Status{" "}
                  {getProofReviewStatusLabel(submission.status)} · Submitted{" "}
                  {formatPublishedDate(submission.submittedAt)}
                </p>
                <p>
                  Capacity indicator:{" "}
                  {submission.practicalProofConfig.capacityIndicator ||
                    "Not set"}{" "}
                  · Raw proof visibility {submission.visibilityDefault} · Donor
                  visibility disabled · AI verification not used
                </p>
                {submission.redactionRequired ||
                submission.specialistReviewRequired ? (
                  <p className="workspace-note">
                    {submission.redactionRequired
                      ? "Redaction required"
                      : null}
                    {submission.redactionRequired &&
                    submission.specialistReviewRequired
                      ? " · "
                      : ""}
                    {submission.specialistReviewRequired
                      ? "Specialist review required"
                      : null}
                  </p>
                ) : null}
              </div>
              <Link href={`/review/proof/${submission.id}`}>Open proof</Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state studio-section">
          <h2>No proof submissions yet</h2>
          <p>
            Private proof submissions will appear here after learners submit
            optional practical proof for published courses.
          </p>
        </div>
      )}

      <nav className="workspace-nav" aria-label="Proof review actions">
        <Link className="workspace-link" href="/review">
          Review home
        </Link>
        <Link className="workspace-link" href="/review/queue">
          Course review queue
        </Link>
      </nav>
    </WorkspaceShell>
  );
}

import Link from "next/link";

import { Prisma, ScopedRoleKey } from "@prisma/client";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requirePermissionIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { hasPlatformAdmin } from "@/lib/permissions/scoped-access";
import { getProofReviewStatusLabel } from "@/lib/review/proof-review";
import { formatPublishedDate } from "@/lib/review/publishing";

export default async function ProofReviewQueuePage() {
  const identity = await requirePermissionIdentity("/review/proof");
  const isGlobal = hasPlatformAdmin(identity);

  let whereClause: Prisma.LearnerPracticalProofSubmissionWhereInput = {
    visibilityDefault: "PRIVATE",
    aiVerificationUsed: false,
  };

  if (!isGlobal) {
    const verifierAssignments = (identity.scopedRoleAssignments || []).filter(
      (a) => a.roleKey === ScopedRoleKey.PRACTICAL_PROOF_VERIFIER,
    );

    const submissionIds = verifierAssignments
      .map((a) => a.proofSubmissionId)
      .filter(Boolean) as string[];
    const courseIds = verifierAssignments
      .map((a) => a.courseId)
      .filter(Boolean) as string[];
    const orgIds = verifierAssignments
      .map((a) => a.organizationId)
      .filter(Boolean) as string[];
    const capacityAreas = verifierAssignments
      .map((a) => a.capacityArea)
      .filter(Boolean) as string[];

    if (
      submissionIds.length === 0 &&
      courseIds.length === 0 &&
      orgIds.length === 0 &&
      capacityAreas.length === 0
    ) {
      // Force an empty set if user has no assignments
      whereClause = { id: "BLOCK_ALL" };
    } else {
      whereClause.OR = [
        submissionIds.length > 0 ? { id: { in: submissionIds } } : null,
        courseIds.length > 0
          ? { courseVersion: { courseId: { in: courseIds } } }
          : null,
        orgIds.length > 0
          ? { courseVersion: { course: { organizationId: { in: orgIds } } } }
          : null,
        capacityAreas.length > 0
          ? { practicalProofConfig: { capacityArea: { in: capacityAreas } } }
          : null,
      ].filter(Boolean) as Prisma.LearnerPracticalProofSubmissionWhereInput[];
    }
  }

  const submissions = await prisma.learnerPracticalProofSubmission.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          name: true,
        },
      },
      practicalProofConfig: true,
      courseVersion: {
        include: {
          course: true,
        },
      },
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
                  visibility {submission.donorVisibilityConsent ? "consented" : "disabled"} · AI verification not used
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

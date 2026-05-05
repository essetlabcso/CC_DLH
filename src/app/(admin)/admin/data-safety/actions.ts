"use server";

import { revalidatePath } from "next/cache";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";

export async function resolveSpecialistReviewAction(
  submissionId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/data-safety");
  const note = formData.get("note") as string;

  if (!note || note.trim().length < 5) {
    throw new Error("A reason of at least 5 characters is required.");
  }

  await prisma.$transaction(async (tx) => {
    const submission = await tx.learnerPracticalProofSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    await tx.learnerPracticalProofSubmissionEvent.create({
      data: {
        submissionId: submission.id,
        actorId: identity.user.id,
        eventType: "SPECIALIST_REVIEW_RESOLVED",
        internalNote: note,
        specialistReviewRequired: false,
        redactionRequired: submission.redactionRequired,
      },
    });

    await tx.learnerPracticalProofSubmission.update({
      where: { id: submissionId },
      data: {
        specialistReviewRequired: false,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "SPECIALIST_REVIEW_RESOLVED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify({ specialistReviewRequired: true }),
        afterJson: JSON.stringify({ specialistReviewRequired: false }),
        entityId: submissionId,
        entityType: "PracticalProofSubmission",
        reason: note,
        riskLevel: "HIGH",
      },
    });
  });

  revalidatePath("/admin/data-safety");
}

export async function resolveRedactionRequirementAction(
  submissionId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/data-safety");
  const note = formData.get("note") as string;

  if (!note || note.trim().length < 5) {
    throw new Error("A reason of at least 5 characters is required.");
  }

  await prisma.$transaction(async (tx) => {
    const submission = await tx.learnerPracticalProofSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    await tx.learnerPracticalProofSubmissionEvent.create({
      data: {
        submissionId: submission.id,
        actorId: identity.user.id,
        eventType: "REDACTION_REQUIREMENT_RESOLVED",
        internalNote: note,
        specialistReviewRequired: submission.specialistReviewRequired,
        redactionRequired: false,
      },
    });

    await tx.learnerPracticalProofSubmission.update({
      where: { id: submissionId },
      data: {
        redactionRequired: false,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "REDACTION_REQUIREMENT_RESOLVED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify({ redactionRequired: true }),
        afterJson: JSON.stringify({ redactionRequired: false }),
        entityId: submissionId,
        entityType: "PracticalProofSubmission",
        reason: note,
        riskLevel: "HIGH",
      },
    });
  });

  revalidatePath("/admin/data-safety");
}

export async function revokeExternalVisibilityAction(
  achievementId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity("/admin/data-safety");
  const note = formData.get("note") as string;

  if (!note || note.trim().length < 5) {
    throw new Error("A reason of at least 5 characters is required.");
  }

  await prisma.$transaction(async (tx) => {
    const achievement = await tx.learnerVerifiedAchievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new Error("Achievement not found");
    }

    await tx.learnerVerifiedAchievement.update({
      where: { id: achievementId },
      data: {
        donorVisibilityEnabled: false,
        publicBadgeEnabled: false,
        visibilityDefault: "PRIVATE",
        verificationNote: achievement.verificationNote
          ? `${achievement.verificationNote}\n\n[Admin Note: External visibility revoked. ${note}]`
          : `[Admin Note: External visibility revoked. ${note}]`,
      },
    });

    await tx.learnerPracticalProofSubmissionEvent.create({
      data: {
        submissionId: achievement.proofSubmissionId,
        actorId: identity.user.id,
        eventType: "EXTERNAL_VISIBILITY_REVOKED",
        internalNote: note,
        visibilityDefault: "PRIVATE",
        donorVisibilityConsent: false,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "EXTERNAL_VISIBILITY_REVOKED",
        actorId: identity.user.id,
        beforeJson: JSON.stringify({ 
          donorVisibilityEnabled: achievement.donorVisibilityEnabled,
          publicBadgeEnabled: achievement.publicBadgeEnabled,
          visibilityDefault: achievement.visibilityDefault
        }),
        afterJson: JSON.stringify({ 
          donorVisibilityEnabled: false,
          publicBadgeEnabled: false,
          visibilityDefault: "PRIVATE"
        }),
        entityId: achievementId,
        entityType: "VerifiedAchievement",
        reason: note,
        riskLevel: "HIGH",
      },
    });
  });

  revalidatePath("/admin/data-safety");
}

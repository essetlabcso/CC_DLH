"use server";

import { CertificateStatusEventType, CourseVersionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { createCertificateNumber } from "@/lib/learner/certificates";
import {
  parseFinalTestAnswerFormData,
  parseFinalTestContent,
  scoreFinalTestAnswer,
} from "@/lib/learner/final-test";
import {
  buildPrivatePracticalProofSubmissionData,
  buildPrivatePracticalProofResubmissionData,
  canRevisePrivatePracticalProof,
  canSubmitPrivatePracticalProof,
  parseLearnerPracticalProofFormData,
} from "@/lib/learner/practical-proof";
import {
  buildPracticalProofAuditEventData,
  getNextPracticalProofRevisionNumber,
  practicalProofAuditEventTypes,
} from "@/lib/proof-audit";
import {
  selfEnrollInPublicCourse,
  type SelfEnrollmentPrisma,
} from "@/lib/learner/self-enrollment";

export async function selfEnrollLearnerAction(courseId: string) {
  const coursePath = `/learn/courses/${courseId}`;
  const identity = await requireWorkspaceIdentity(coursePath);

  if (identity.session.role !== "learner") {
    redirect(`/forbidden?next=${encodeURIComponent(coursePath)}&workspace=learner`);
  }

  const result = await selfEnrollInPublicCourse(
    prisma as unknown as SelfEnrollmentPrisma,
    {
      courseId,
      identity: {
        userId: identity.user.id,
        organizationId: identity.user.organizationId,
        roles: identity.user.roles,
      },
    },
  );

  if (!result.ok) {
    notFound();
  }

  revalidatePath("/courses");
  revalidatePath("/learn");
  revalidatePath(coursePath);
  redirect(coursePath);
}

export async function completeLearnerLessonAction(
  courseId: string,
  lessonId: string,
) {
  const lessonPath = `/learn/courses/${courseId}/lessons/${lessonId}`;
  const identity = await requireWorkspaceIdentity(lessonPath);
  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
      modules: {
        some: {
          lessons: {
            some: {
              id: lessonId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      setup: {
        select: {
          certificateIntent: true,
        },
      },
      modules: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!version) {
    notFound();
  }

  const completedAt = new Date();

  await prisma.learnerLessonProgress.upsert({
    where: {
      userId_courseVersionId_lessonId: {
        userId: identity.user.id,
        courseVersionId: version.id,
        lessonId,
      },
    },
    update: {
      completedAt,
    },
    create: {
      userId: identity.user.id,
      courseVersionId: version.id,
      lessonId,
      startedAt: completedAt,
      completedAt,
    },
  });
  revalidatePath("/learn");
  revalidatePath("/learn/certificates");
  revalidatePath(`/learn/courses/${courseId}`);
  revalidatePath(lessonPath);
  redirect(`${lessonPath}?completed=1`);
}

export async function submitLearnerFinalTestAction(
  courseId: string,
  lessonBlockId: string,
  formData: FormData,
) {
  const coursePath = `/learn/courses/${courseId}`;
  const identity = await requireWorkspaceIdentity(coursePath);
  const selectedAnswer = parseFinalTestAnswerFormData(formData);

  if (!selectedAnswer) {
    redirect(`${coursePath}?error=final-test-answer`);
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
      modules: {
        some: {
          lessons: {
            some: {
              blocks: {
                some: {
                  id: lessonBlockId,
                  type: "FINAL_TEST",
                },
              },
            },
          },
        },
      },
    },
    include: {
      course: true,
      setup: true,
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
  });

  if (!version) {
    notFound();
  }

  const finalTestBlock = version.modules
    .flatMap((module) => module.lessons)
    .flatMap((lesson) => lesson.blocks)
    .find((block) => block.id === lessonBlockId && block.type === "FINAL_TEST");
  const finalTest = parseFinalTestContent(finalTestBlock?.content);

  if (!finalTestBlock || !finalTest.ok) {
    notFound();
  }

  const score = scoreFinalTestAnswer({
    selectedAnswer,
    correctAnswer: finalTest.value.correctAnswer,
  });
  const submittedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.learnerFinalTestAttempt.create({
      data: {
        userId: identity.user.id,
        courseVersionId: version.id,
        lessonBlockId: finalTestBlock.id,
        selectedAnswer: score.selectedAnswer,
        correctAnswer: score.correctAnswer,
        scorePercent: score.scorePercent,
        passed: score.passed,
        submittedAt,
      },
    });

    if (score.passed && hasCertificateIntent(version.setup?.certificateIntent)) {
      const certificate = await tx.learnerCertificate.upsert({
        where: {
          userId_courseVersionId: {
            userId: identity.user.id,
            courseVersionId: version.id,
          },
        },
        update: {
          revokedAt: null,
        },
        create: {
          userId: identity.user.id,
          courseVersionId: version.id,
          certificateNumber: createCertificateNumber(
            identity.user.id,
            version.id,
          ),
          issuedAt: submittedAt,
        },
      });

      await tx.learnerCertificateStatusEvent.create({
        data: {
          certificateId: certificate.id,
          actorId: identity.user.id,
          eventType: CertificateStatusEventType.ISSUED,
          note: `Final test passed with ${score.scorePercent}%.`,
        },
      });
    }
  });

  revalidatePath("/learn");
  revalidatePath("/learn/certificates");
  revalidatePath(coursePath);
  redirect(`${coursePath}?finalTest=1`);
}

export async function submitLearnerPracticalProofAction(
  courseId: string,
  formData: FormData,
) {
  const coursePath = `/learn/courses/${courseId}`;
  const identity = await requireWorkspaceIdentity(coursePath);
  const result = parseLearnerPracticalProofFormData(formData);

  if (!result.ok) {
    redirect(
      `${coursePath}?error=proof&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
        status: "ACTIVE",
      },
    },
    include: {
      practicalProofConfig: true,
      practicalProofSubmissions: {
        where: {
          userId: identity.user.id,
        },
        include: {
          events: {
            select: {
              revisionNumber: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        take: 1,
      },
    },
  });

  if (!version || !version.practicalProofConfig) {
    notFound();
  }

  if (!canSubmitPrivatePracticalProof(version.practicalProofConfig)) {
    redirect(`${coursePath}?error=proof-config`);
  }

  const practicalProofConfig = version.practicalProofConfig;
  const existingSubmission = version.practicalProofSubmissions[0];

  if (existingSubmission) {
    if (!canRevisePrivatePracticalProof(existingSubmission.status)) {
      redirect(
        `${coursePath}?error=proof&fields=${encodeURIComponent(
          "resubmissionNotAllowed",
        )}`,
      );
    }

    const resubmissionData = buildPrivatePracticalProofResubmissionData(
      result.value,
    );
    const revisionNumber = getNextPracticalProofRevisionNumber(
      existingSubmission.events,
      {
        hasExistingSubmission: true,
      },
    );

    await prisma.$transaction(async (tx) => {
      await tx.learnerPracticalProofSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: resubmissionData,
      });
      await tx.learnerPracticalProofSubmissionEvent.create({
        data: {
          submissionId: existingSubmission.id,
          ...buildPracticalProofAuditEventData({
            actorId: identity.user.id,
            eventType: practicalProofAuditEventTypes.resubmitted,
            fromStatus: existingSubmission.status,
            toStatus: resubmissionData.status,
            revisionNumber,
            proofTextSnapshot: resubmissionData.proofText,
            evidenceLinkSnapshot: resubmissionData.evidenceLink,
          }),
        },
      });
    });

    revalidatePath("/learn");
    revalidatePath(coursePath);
    redirect(`${coursePath}?proof=resubmitted`);
  }

  const submissionData = buildPrivatePracticalProofSubmissionData(result.value);

  await prisma.$transaction(async (tx) => {
    const submission = await tx.learnerPracticalProofSubmission.create({
      data: {
        userId: identity.user.id,
        courseVersionId: version.id,
        practicalProofConfigId: practicalProofConfig.id,
        ...submissionData,
      },
    });

    await tx.learnerPracticalProofSubmissionEvent.create({
      data: {
        submissionId: submission.id,
        ...buildPracticalProofAuditEventData({
          actorId: identity.user.id,
          eventType: practicalProofAuditEventTypes.submitted,
          toStatus: submissionData.status,
          revisionNumber: 1,
          proofTextSnapshot: submissionData.proofText,
          evidenceLinkSnapshot: submissionData.evidenceLink,
        }),
      },
    });
  });

  revalidatePath("/learn");
  revalidatePath(coursePath);
  redirect(`${coursePath}?proof=1`);
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

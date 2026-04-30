"use server";

import {
  CourseVersionStatus,
  CourseWorkflowStep,
  WorkflowStepStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import { canRoleTransitionCourseVersion } from "@/lib/db/lifecycle";
import {
  buildReviewerPauseChecklist,
  buildReviewerApprovalChecklist,
  buildReviewerReturnChecklist,
  buildSpecialistReviewChecklist,
  hasUnresolvedSpecialistReview,
  parseReviewerApprovalFormData,
  parseReviewerPauseFormData,
  parseReviewerReturnFormData,
  parseReviewerSpecialistReviewFormData,
  summarizeReviewerApproval,
  summarizeReviewerPause,
  summarizeReviewerReturn,
  summarizeSpecialistReview,
} from "@/lib/review/decisions";
import {
  buildPublishReadiness,
  canPublishVersion,
  mergePublicationRecordChecklist,
  summarizePublication,
} from "@/lib/review/publishing";
import {
  buildPracticalProofAuditEventData,
  practicalProofAuditEventTypes,
} from "@/lib/proof-audit";
import {
  buildProofReviewUpdateData,
  parseProofReviewDecisionFormData,
} from "@/lib/review/proof-review";
import {
  parseRevisionRequestFormData,
  summarizeRevisionRequest,
} from "@/lib/review/revisions";

export async function approveSubmittedCourseAction(
  courseId: string,
  versionId: string,
  formData: FormData,
) {
  const reviewPath = `/review/courses/${courseId}/versions/${versionId}`;
  const identity = await requireWorkspaceIdentity(reviewPath);
  const result = parseReviewerApprovalFormData(formData);

  if (!result.ok) {
    redirect(
      `${reviewPath}?error=approve&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      reviewRecord: true,
    },
  });

  if (!version) {
    notFound();
  }

  if (hasUnresolvedSpecialistReview(version.reviewRecord?.checklist)) {
    redirect(`${reviewPath}?error=specialist`);
  }

  const approvedAt = new Date();
  const checklist = buildReviewerApprovalChecklist(
    version.reviewRecord?.checklist,
    result.value,
  );
  const decisionNotes = version.sourceVersionId
    ? `Revision approved for publishing handoff. ${result.value.decisionNotes}`
    : result.value.decisionNotes;

  await prisma.$transaction([
    prisma.courseVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: CourseVersionStatus.APPROVED,
        approvedAt,
      },
    }),
    prisma.course.update({
      where: {
        id: version.course.id,
      },
      data: {
        updatedAt: approvedAt,
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: "",
      },
      create: {
        courseVersionId: version.id,
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.SUBMITTED,
        toStatus: CourseVersionStatus.APPROVED,
        note: summarizeReviewerApproval(result.value),
      },
    }),
  ]);

  revalidateReviewPaths(courseId, versionId);
  redirect("/review/queue?approved=1");
}

export async function returnSubmittedCourseAction(
  courseId: string,
  versionId: string,
  formData: FormData,
) {
  const reviewPath = `/review/courses/${courseId}/versions/${versionId}`;
  const identity = await requireWorkspaceIdentity(reviewPath);
  const result = parseReviewerReturnFormData(formData);

  if (!result.ok) {
    redirect(
      `${reviewPath}?error=return&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      reviewRecord: true,
    },
  });

  if (!version) {
    notFound();
  }

  const returnedAt = new Date();
  const checklist = buildReviewerReturnChecklist(
    version.reviewRecord?.checklist,
    result.value,
  );
  const decisionNotes = summarizeReviewerReturn(result.value);

  await prisma.$transaction([
    prisma.courseVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: CourseVersionStatus.RETURNED,
        returnedAt,
      },
    }),
    prisma.course.update({
      where: {
        id: version.course.id,
      },
      data: {
        updatedAt: returnedAt,
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: decisionNotes,
      },
      create: {
        courseVersionId: version.id,
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: decisionNotes,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.SUBMITTED,
        toStatus: CourseVersionStatus.RETURNED,
        note: decisionNotes,
      },
    }),
  ]);

  revalidateReviewPaths(courseId, versionId);
  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect("/review/queue?returned=1");
}

export async function requireSpecialistReviewAction(
  courseId: string,
  versionId: string,
  formData: FormData,
) {
  const reviewPath = `/review/courses/${courseId}/versions/${versionId}`;
  const identity = await requireWorkspaceIdentity(reviewPath);
  const result = parseReviewerSpecialistReviewFormData(formData);

  if (!result.ok) {
    redirect(
      `${reviewPath}?error=specialistReview&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      reviewRecord: true,
    },
  });

  if (!version) {
    notFound();
  }

  const checklist = buildSpecialistReviewChecklist(
    version.reviewRecord?.checklist,
    result.value,
  );
  const decisionNotes = summarizeSpecialistReview(result.value);

  await prisma.$transaction([
    prisma.course.update({
      where: {
        id: version.course.id,
      },
      data: {
        updatedAt: new Date(),
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: "",
      },
      create: {
        courseVersionId: version.id,
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.SUBMITTED,
        toStatus: CourseVersionStatus.SUBMITTED,
        note: decisionNotes,
      },
    }),
  ]);

  revalidateReviewPaths(courseId, versionId);
  redirect("/review/queue?specialist=1");
}

export async function pauseSubmittedCourseAction(
  courseId: string,
  versionId: string,
  formData: FormData,
) {
  const reviewPath = `/review/courses/${courseId}/versions/${versionId}`;
  const identity = await requireWorkspaceIdentity(reviewPath);
  const result = parseReviewerPauseFormData(formData);

  if (!result.ok) {
    redirect(
      `${reviewPath}?error=pause&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.SUBMITTED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      reviewRecord: true,
    },
  });

  if (!version) {
    notFound();
  }

  const returnedAt = new Date();
  const checklist = buildReviewerPauseChecklist(
    version.reviewRecord?.checklist,
    result.value,
  );
  const decisionNotes = summarizeReviewerPause(result.value);

  await prisma.$transaction([
    prisma.courseVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: CourseVersionStatus.RETURNED,
        returnedAt,
      },
    }),
    prisma.course.update({
      where: {
        id: version.course.id,
      },
      data: {
        updatedAt: returnedAt,
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: decisionNotes,
      },
      create: {
        courseVersionId: version.id,
        reviewerId: identity.user.id,
        checklist,
        decisionNotes,
        returnedReason: decisionNotes,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.SUBMITTED,
        toStatus: CourseVersionStatus.RETURNED,
        note: decisionNotes,
      },
    }),
  ]);

  revalidateReviewPaths(courseId, versionId);
  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect("/review/queue?paused=1");
}

export async function publishApprovedCourseAction(
  courseId: string,
  versionId: string,
) {
  const identity = await requireWorkspaceIdentity("/review/publishing");

  if (
    !canRoleTransitionCourseVersion(
      identity.session.role,
      CourseVersionStatus.APPROVED,
      CourseVersionStatus.PUBLISHED,
    )
  ) {
    redirect(
      `/forbidden?next=${encodeURIComponent(
        "/review/publishing",
      )}&workspace=review`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.APPROVED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
      setup: true,
      reviewRecord: true,
      practicalProofConfig: true,
    },
  });

  if (!version) {
    notFound();
  }

  const publishedAt = new Date();
  const readiness = buildPublishReadiness(version, {
    generatedAt: publishedAt,
  });

  if (!canPublishVersion(readiness)) {
    redirect(
      `/review/publishing?blocked=1&version=${encodeURIComponent(version.id)}`,
    );
  }

  const publicationNote = summarizePublication(
    version.course.title,
    version.versionNumber,
    { isRevision: Boolean(version.sourceVersionId) },
  );
  const publicationChecklist = mergePublicationRecordChecklist(
    version.reviewRecord?.checklist,
    readiness,
    {
      publishedAt: publishedAt.toISOString(),
      publishedById: identity.user.id,
      courseId: version.courseId,
      courseVersionId: version.id,
      versionNumber: version.versionNumber,
      releaseType: "publish-now",
      visibility: readiness.learnerVisibilityDefault,
      enrollment: "Learner sign-in required",
      certificateRule: readiness.certificateRule,
      readinessSummary: readiness.summary,
    },
  );

  await prisma.$transaction(async (tx) => {
    const previouslyPublished = await tx.courseVersion.findMany({
      where: {
        courseId: version.courseId,
        status: CourseVersionStatus.PUBLISHED,
        id: {
          not: version.id,
        },
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      previouslyPublished.map((publishedVersion) =>
        tx.courseVersion.update({
          where: {
            id: publishedVersion.id,
          },
          data: {
            status: CourseVersionStatus.REPLACED,
            replacedAt: publishedAt,
            events: {
              create: {
                actorId: identity.user.id,
                fromStatus: CourseVersionStatus.PUBLISHED,
                toStatus: CourseVersionStatus.REPLACED,
                note: "Replaced by a newer published version.",
              },
            },
          },
        }),
      ),
    );

    await tx.courseVersion.update({
      where: {
        id: version.id,
      },
      data: {
        status: CourseVersionStatus.PUBLISHED,
        publishedAt,
        monitoringRecord: {
          upsert: {
            update: {},
            create: {},
          },
        },
        events: {
          create: {
            actorId: identity.user.id,
            fromStatus: CourseVersionStatus.APPROVED,
            toStatus: CourseVersionStatus.PUBLISHED,
            note: publicationNote,
          },
        },
      },
    });

    await tx.course.update({
      where: {
        id: version.courseId,
      },
      data: {
        updatedAt: publishedAt,
      },
    });

    await tx.courseReviewRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        checklist: publicationChecklist,
      },
      create: {
        courseVersionId: version.id,
        reviewerId: version.reviewRecord?.reviewerId,
        checklist: publicationChecklist,
        decisionNotes: version.reviewRecord?.decisionNotes || publicationNote,
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/learn");
  revalidatePath(`/learn/courses/${courseId}`);
  revalidatePath("/review");
  revalidatePath("/review/queue");
  revalidatePath("/review/publishing");
  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect("/review/publishing?published=1");
}

export async function requestPublishedCourseRevisionAction(
  courseId: string,
  versionId: string,
  formData: FormData,
) {
  const monitoringPath = "/review/monitoring";
  const identity = await requireWorkspaceIdentity(monitoringPath);
  const result = parseRevisionRequestFormData(formData);

  if (!result.ok) {
    redirect(
      `${monitoringPath}?error=revision&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const version = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
      },
    },
    include: {
      course: true,
    },
  });

  if (!version) {
    notFound();
  }

  const note = summarizeRevisionRequest(version.course.title, result.value);

  await prisma.$transaction([
    prisma.courseRevisionRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        sourceVersionId: version.id,
        revisionReason: result.value.revisionReason,
      },
      create: {
        courseVersionId: version.id,
        sourceVersionId: version.id,
        revisionReason: result.value.revisionReason,
      },
    }),
    prisma.courseMonitoringRecord.upsert({
      where: {
        courseVersionId: version.id,
      },
      update: {
        improvementNotes: result.value.revisionReason,
      },
      create: {
        courseVersionId: version.id,
        improvementNotes: result.value.revisionReason,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.PUBLISHED,
        toStatus: CourseVersionStatus.PUBLISHED,
        note,
      },
    }),
  ]);

  revalidatePath("/review");
  revalidatePath("/review/monitoring");
  revalidatePath("/review/revisions");
  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect("/review/revisions?requested=1");
}

export async function recordPracticalProofReviewAction(
  submissionId: string,
  formData: FormData,
) {
  const reviewPath = `/review/proof/${submissionId}`;
  const identity = await requireWorkspaceIdentity(reviewPath);
  const result = parseProofReviewDecisionFormData(formData);

  if (!result.ok) {
    redirect(
      `${reviewPath}?error=proof-review&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const submission = await prisma.learnerPracticalProofSubmission.findFirst({
    where: {
      id: submissionId,
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
      courseVersion: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  const reviewUpdateData = buildProofReviewUpdateData(result.value);

  await prisma.$transaction(async (tx) => {
    await tx.learnerPracticalProofSubmission.update({
      where: {
        id: submission.id,
      },
      data: {
        reviewerId: identity.user.id,
        ...reviewUpdateData,
      },
    });
    await tx.learnerPracticalProofSubmissionEvent.create({
      data: {
        submissionId: submission.id,
        ...buildPracticalProofAuditEventData({
          actorId: identity.user.id,
          eventType: practicalProofAuditEventTypes.reviewDecision,
          fromStatus: submission.status,
          toStatus: result.value.status,
          learnerVisibleNote: result.value.learnerFeedback,
          internalNote: result.value.internalReviewNote,
          requiredAction: result.value.requiredAction,
          redactionRequired: reviewUpdateData.redactionRequired,
          specialistReviewRequired: reviewUpdateData.specialistReviewRequired,
        }),
      },
    });
  });

  revalidatePath("/review/proof");
  revalidatePath(reviewPath);
  revalidatePath(`/learn/courses/${submission.courseVersion.courseId}`);
  redirect(`${reviewPath}?reviewed=1`);
}

export async function createRevisionDraftAction(
  courseId: string,
  versionId: string,
) {
  const identity = await requireWorkspaceIdentity("/review/revisions");
  const publishedVersion = await prisma.courseVersion.findFirst({
    where: {
      id: versionId,
      courseId,
      status: CourseVersionStatus.PUBLISHED,
      course: {
        organizationId: identity.user.organizationId,
      },
      revisionRecord: {
        isNot: null,
      },
    },
    include: {
      course: true,
      setup: true,
      diagnosis: true,
      capacityMap: true,
      actionMap: true,
      storyboard: true,
      practicalProofConfig: true,
      revisionRecord: true,
      modules: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              sortOrder: "asc",
            },
            include: {
              blocks: {
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!publishedVersion || !publishedVersion.revisionRecord) {
    notFound();
  }
  const revisionRecord = publishedVersion.revisionRecord;

  const existingRevisionDraft = await prisma.courseVersion.findFirst({
    where: {
      courseId,
      sourceVersionId: publishedVersion.id,
      status: CourseVersionStatus.REVISION_DRAFT,
    },
    orderBy: {
      versionNumber: "desc",
    },
  });

  if (existingRevisionDraft) {
    redirect("/review/revisions?draft=exists");
  }

  const latestVersion = await prisma.courseVersion.findFirst({
    where: {
      courseId,
    },
    orderBy: {
      versionNumber: "desc",
    },
    select: {
      versionNumber: true,
    },
  });
  const revisionDraft = await prisma.$transaction(async (tx) => {
    const draft = await tx.courseVersion.create({
      data: {
        courseId,
        createdById: publishedVersion.course.ownerId,
        sourceVersionId: publishedVersion.id,
        versionNumber: (latestVersion?.versionNumber || 0) + 1,
        status: CourseVersionStatus.REVISION_DRAFT,
        designRecord: publishedVersion.designRecord,
        setup: publishedVersion.setup
          ? {
              create: {
                title: publishedVersion.setup.title,
                summary: publishedVersion.setup.summary,
                primaryLearnerGroup:
                  publishedVersion.setup.primaryLearnerGroup,
                language: publishedVersion.setup.language,
                formatAndTime: publishedVersion.setup.formatAndTime,
                level: publishedVersion.setup.level,
                capacityArea: publishedVersion.setup.capacityArea,
                sensitiveFlag: publishedVersion.setup.sensitiveFlag,
                certificateIntent: publishedVersion.setup.certificateIntent,
                learnerReality: publishedVersion.setup.learnerReality,
              },
            }
          : undefined,
        diagnosis: publishedVersion.diagnosis
          ? {
              create: {
                surfaceRequest: publishedVersion.diagnosis.surfaceRequest,
                performanceEvidence:
                  publishedVersion.diagnosis.performanceEvidence,
                currentReality: publishedVersion.diagnosis.currentReality,
                desiredReality: publishedVersion.diagnosis.desiredReality,
                affectedLearnerGroup:
                  publishedVersion.diagnosis.affectedLearnerGroup,
                evidenceSources: publishedVersion.diagnosis.evidenceSources,
                ksmeGap: publishedVersion.diagnosis.ksmeGap,
                courseFitDecision:
                  publishedVersion.diagnosis.courseFitDecision,
                alternativeIntervention:
                  publishedVersion.diagnosis.alternativeIntervention,
              },
            }
          : undefined,
        capacityMap: publishedVersion.capacityMap
          ? {
              create: {
                capacityArea: publishedVersion.capacityMap.capacityArea,
                subarea: publishedVersion.capacityMap.subarea,
                capabilityFocus: publishedVersion.capacityMap.capabilityFocus,
                linkedStandard: publishedVersion.capacityMap.linkedStandard,
                capacityOutcome: publishedVersion.capacityMap.capacityOutcome,
                diagnosisLink: publishedVersion.capacityMap.diagnosisLink,
                monitoringRelevance:
                  publishedVersion.capacityMap.monitoringRelevance,
              },
            }
          : undefined,
        actionMap: publishedVersion.actionMap
          ? {
              create: {
                capacityGoal: publishedVersion.actionMap.capacityGoal,
                individualLearnerOutcome:
                  publishedVersion.actionMap.individualLearnerOutcome,
                observableActions: publishedVersion.actionMap.observableActions,
                practiceScenarios: publishedVersion.actionMap.practiceScenarios,
                essentialInformation:
                  publishedVersion.actionMap.essentialInformation,
                difMatrix: publishedVersion.actionMap.difMatrix,
              },
            }
          : undefined,
        storyboard: publishedVersion.storyboard
          ? {
              create: {
                lessonPlan: publishedVersion.storyboard.lessonPlan,
                aiHandoffNotes: publishedVersion.storyboard.aiHandoffNotes,
                approvedForBuild: publishedVersion.storyboard.approvedForBuild,
              },
            }
          : undefined,
        practicalProofConfig: publishedVersion.practicalProofConfig
          ? {
              create: {
                enabled: publishedVersion.practicalProofConfig.enabled,
                proofTitle: publishedVersion.practicalProofConfig.proofTitle,
                proofPurpose: publishedVersion.practicalProofConfig.proofPurpose,
                acceptedProofType:
                  publishedVersion.practicalProofConfig.acceptedProofType,
                submissionFormat:
                  publishedVersion.practicalProofConfig.submissionFormat,
                instructions: publishedVersion.practicalProofConfig.instructions,
                safetyGuidance:
                  publishedVersion.practicalProofConfig.safetyGuidance,
                reviewCriteria:
                  publishedVersion.practicalProofConfig.reviewCriteria,
                capacityArea: publishedVersion.practicalProofConfig.capacityArea,
                subCapacityArea:
                  publishedVersion.practicalProofConfig.subCapacityArea,
                linkedStandard:
                  publishedVersion.practicalProofConfig.linkedStandard,
                capacityIndicator:
                  publishedVersion.practicalProofConfig.capacityIndicator,
                visibilityDefault:
                  publishedVersion.practicalProofConfig.visibilityDefault,
                donorVisibilityEnabled:
                  publishedVersion.practicalProofConfig.donorVisibilityEnabled,
                certificateSeparationConfirmed:
                  publishedVersion.practicalProofConfig
                    .certificateSeparationConfirmed,
                specialistReviewRequired:
                  publishedVersion.practicalProofConfig.specialistReviewRequired,
              },
            }
          : undefined,
        revisionRecord: {
          create: {
            sourceVersionId: publishedVersion.id,
            revisionReason: revisionRecord.revisionReason,
          },
        },
        workflowSteps: {
          create: [
            {
              step: CourseWorkflowStep.COURSE_SETUP,
              status: WorkflowStepStatus.COMPLETE,
              completedAt: new Date(),
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.DIAGNOSIS,
              status: WorkflowStepStatus.COMPLETE,
              completedAt: new Date(),
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.CAPACITY_MAP,
              status: WorkflowStepStatus.COMPLETE,
              completedAt: new Date(),
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.ACTION_MAP,
              status: WorkflowStepStatus.COMPLETE,
              completedAt: new Date(),
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.STORYBOARD,
              status: WorkflowStepStatus.COMPLETE,
              completedAt: new Date(),
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.BUILD,
              status: WorkflowStepStatus.IN_PROGRESS,
              lockedReason: null,
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.PREVIEW,
              status: WorkflowStepStatus.LOCKED,
              lockedReason:
                "Complete revision content checks before opening Preview.",
              updatedById: identity.user.id,
            },
            {
              step: CourseWorkflowStep.CREATOR_REVIEW,
              status: WorkflowStepStatus.LOCKED,
              lockedReason:
                "Complete revision Preview before Creator Review.",
              updatedById: identity.user.id,
            },
          ],
        },
        events: {
          create: {
            actorId: identity.user.id,
            fromStatus: CourseVersionStatus.PUBLISHED,
            toStatus: CourseVersionStatus.REVISION_DRAFT,
            note: `Revision draft created from published version ${publishedVersion.versionNumber}.`,
          },
        },
      },
    });

    for (const sourceModule of publishedVersion.modules) {
      const createdModule = await tx.courseModule.create({
        data: {
          versionId: draft.id,
          title: sourceModule.title,
          sortOrder: sourceModule.sortOrder,
        },
      });

      for (const lesson of sourceModule.lessons) {
        const createdLesson = await tx.courseLesson.create({
          data: {
            moduleId: createdModule.id,
            title: lesson.title,
            sortOrder: lesson.sortOrder,
          },
        });

        await Promise.all(
          lesson.blocks.map((block) =>
            tx.lessonBlock.create({
              data: {
                lessonId: createdLesson.id,
                type: block.type,
                sortOrder: block.sortOrder,
                content: block.content,
              },
            }),
          ),
        );
      }
    }

    await tx.course.update({
      where: {
        id: courseId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return draft;
  });

  revalidatePath("/review");
  revalidatePath("/review/revisions");
  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect(`/review/revisions?draft=created&version=${revisionDraft.id}`);
}

function revalidateReviewPaths(courseId: string, versionId: string) {
  revalidatePath("/review");
  revalidatePath("/review/queue");
  revalidatePath(`/review/courses/${courseId}/versions/${versionId}`);
}

"use server";

import {
  CourseWorkflowStep,
  CourseVersionStatus,
  LessonBlockType,
  WorkflowStepStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { requireWorkspaceIdentity } from "@/lib/auth/server";
import { prisma } from "@/lib/db/client";
import {
  canAnalysisProceedToDesign,
  isAnalysisHandoverLocked,
  parseAnalysisHandoverFormData,
  validateAnalysisAnchorConsistency,
  validateAnalysisHandoverInput,
} from "@/lib/studio/analysis-handover";
import {
  buildDifMatrix,
  buildEssentialInformation,
  buildObservableActions,
  buildPracticeScenarios,
  parseCourseActionMapFormData,
} from "@/lib/studio/action-map";
import {
  buildFinalTestBlockContent,
  buildInitialBlocksFromStoryboard,
  getAdjacentBlockForMove,
  mergeBuildBlockEditContent,
  parseBuildBlockContent,
  parseBuildBlockEditFormData,
  parseFinalTestAuthoringFormData,
  type BuildBlockMoveDirection,
  serializeBuildBlockContent,
} from "@/lib/studio/build-studio";
import {
  blockJustificationLabels,
  buildCreatorAddedBlockContent,
  parseCreatorAddedBlockFormData,
} from "@/lib/studio/block-library";
import {
  getBuildGovernanceIssues,
  hasBuildContent,
  hasFinalTestContent,
  parseBuildCompletionChecksFormData,
  summarizeBuildCompletionChecks,
} from "@/lib/studio/build-checks";
import {
  buildBuildToReviewHandover,
  canSubmitBuildToReviewHandover,
  mergeBuildToReviewHandoverChecklist,
} from "@/lib/studio/build-review-handover";
import { parseCourseCapacityMapFormData } from "@/lib/studio/capacity-map";
import { parseCourseSetupFormData } from "@/lib/studio/course-setup";
import { buildInitialWorkflowStepRecords } from "@/lib/studio/course-workflow-records";
import { getEditableCourseVersion } from "@/lib/studio/courses";
import {
  buildCourseSetupDiagnosisSelectionData,
  resolveCourseSetupDiagnosisSnapshot,
} from "@/lib/studio/diagnosis-selection";
import { getSelectableDiagnosisRecordById } from "@/lib/studio/diagnosis-options";
import {
  buildCreatorReviewChecklist,
  parseCreatorReviewChecksFormData,
  summarizeCreatorReviewChecks,
} from "@/lib/studio/creator-review";
import {
  isDesignHandoverLocked,
  parseDesignHandoverFormData,
  validateDesignHandoverInput,
} from "@/lib/studio/design-handover";
import {
  getAnalysisDesignAnchors,
  getIncompleteDesignPrerequisites,
} from "@/lib/studio/design-anchors";
import { evaluateDownstreamEvidenceReadiness } from "@/lib/studio/downstream-evidence-readiness";
import { buildEvidenceContextDisplayModel } from "@/lib/studio/evidence-context";
import {
  buildEvidenceSources,
  parseCourseDiagnosisFormData,
} from "@/lib/studio/diagnosis";
import {
  parsePreviewCompletionChecksFormData,
  summarizePreviewCompletionChecks,
} from "@/lib/studio/preview-checks";
import {
  buildPracticalProofReadiness,
  parsePracticalProofConfigFormData,
} from "@/lib/studio/practical-proof";
import {
  buildStoryboardLessonPlan,
  parseCourseStoryboardFormData,
  parseStoryboardLessonPlan,
} from "@/lib/studio/storyboard";

export async function createCourseAction() {
  const identity = await requireWorkspaceIdentity("/studio");
  const createdAt = Date.now();
  const title = "Untitled course";
  const course = await prisma.course.create({
    data: {
      organizationId: identity.user.organizationId,
      ownerId: identity.user.id,
      title,
      slug: `untitled-course-${createdAt.toString(36)}`,
      versions: {
        create: {
          createdById: identity.user.id,
          versionNumber: 1,
          status: CourseVersionStatus.DRAFT,
          workflowSteps: {
            create: buildInitialWorkflowStepRecords(),
          },
          events: {
            create: {
              actorId: identity.user.id,
              toStatus: CourseVersionStatus.DRAFT,
              note: "Course draft started.",
            },
          },
        },
      },
    },
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  redirect(`/studio/courses/${course.id}/setup`);
}

export async function saveCourseSetupAction(courseId: string, formData: FormData) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/setup`,
  );
  const result = parseCourseSetupFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/setup?error=missing&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const selectedDiagnosisRecord = result.value.selectedDiagnosisRecordId
    ? await getSelectableDiagnosisRecordById(
        prisma,
        result.value.selectedDiagnosisRecordId,
      )
    : null;

  if (!selectedDiagnosisRecord) {
    redirect(`/studio/courses/${courseId}/setup?error=diagnosis`);
  }

  const diagnosisSelectionData = selectedDiagnosisRecord
    ? buildCourseSetupDiagnosisSelectionData(selectedDiagnosisRecord)
    : {};

  await prisma.$transaction([
    prisma.course.update({
      where: {
        id: editable.course.id,
      },
      data: {
        title: result.value.title,
        updatedAt: new Date(),
      },
    }),
    prisma.courseSetup.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        title: result.value.title,
        summary: result.value.summary,
        primaryLearnerGroup: result.value.primaryLearnerGroup,
        language: result.value.language,
        formatAndTime: result.value.formatAndTime,
        level: result.value.level,
        capacityArea: result.value.capacityArea,
        sensitiveFlag: result.value.sensitiveFlag,
        certificateIntent: result.value.certificateIntent,
        learnerReality: JSON.stringify(result.value.learnerReality),
        ...diagnosisSelectionData,
      },
      create: {
        courseVersionId: editable.version.id,
        title: result.value.title,
        summary: result.value.summary,
        primaryLearnerGroup: result.value.primaryLearnerGroup,
        language: result.value.language,
        formatAndTime: result.value.formatAndTime,
        level: result.value.level,
        capacityArea: result.value.capacityArea,
        sensitiveFlag: result.value.sensitiveFlag,
        certificateIntent: result.value.certificateIntent,
        learnerReality: JSON.stringify(result.value.learnerReality),
        ...diagnosisSelectionData,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.COURSE_SETUP,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.COURSE_SETUP,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.DIAGNOSIS,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.DIAGNOSIS,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/setup`);
  redirect(`/studio/courses/${courseId}/setup?saved=1`);
}

export async function saveCourseDiagnosisAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/diagnosis`,
  );
  const diagnosisResult = parseCourseDiagnosisFormData(formData);
  const handoverResult = parseAnalysisHandoverFormData(formData);

  if (!diagnosisResult.ok || !handoverResult.ok) {
    const missingFields = [
      ...(!diagnosisResult.ok ? diagnosisResult.missingFields : []),
      ...(!handoverResult.ok ? handoverResult.missingFields : []),
    ];

    redirect(
      `/studio/courses/${courseId}/diagnosis?error=missing&fields=${encodeURIComponent(
        missingFields.join(","),
      )}`,
    );
  }

  const result = diagnosisResult;
  const handover = handoverResult;
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  if (isAnalysisHandoverLocked(editable.version.analysisHandover)) {
    redirect(`/studio/courses/${courseId}/diagnosis?locked=1`);
  }

  await prisma.$transaction([
    prisma.courseDiagnosis.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        surfaceRequest: result.value.surfaceRequest,
        performanceEvidence: result.value.performanceEvidence,
        currentReality: result.value.currentReality,
        desiredReality: result.value.desiredReality,
        affectedLearnerGroup: result.value.affectedLearnerGroup,
        evidenceSources: buildEvidenceSources(result.value),
        ksmeGap: result.value.ksmeGap,
        courseFitDecision: result.value.courseFitDecision,
        alternativeIntervention: result.value.alternativeIntervention,
      },
      create: {
        courseVersionId: editable.version.id,
        surfaceRequest: result.value.surfaceRequest,
        performanceEvidence: result.value.performanceEvidence,
        currentReality: result.value.currentReality,
        desiredReality: result.value.desiredReality,
        affectedLearnerGroup: result.value.affectedLearnerGroup,
        evidenceSources: buildEvidenceSources(result.value),
        ksmeGap: result.value.ksmeGap,
        courseFitDecision: result.value.courseFitDecision,
        alternativeIntervention: result.value.alternativeIntervention,
      },
    }),
    prisma.courseAnalysisHandover.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        capacityArea: handover.value.capacityArea,
        subCapacityArea: handover.value.subCapacityArea,
        linkedStandard: handover.value.linkedStandard,
        capacityIndicator: handover.value.capacityIndicator,
        validatedCapacityGap: handover.value.validatedCapacityGap,
        baseline: handover.value.baseline,
        desiredPractice: handover.value.desiredPractice,
        rootCauseSummary: handover.value.rootCauseSummary,
        ksmeRoute: handover.value.ksmeRoute,
        separableKnowledgeSkillComponent:
          handover.value.separableKnowledgeSkillComponent,
        interventionDecision: handover.value.interventionDecision,
        analysisGateDecision: handover.value.analysisGateDecision,
        referralOrFurtherDiagnosisNote:
          handover.value.referralOrFurtherDiagnosisNote,
        safeguardsNote: handover.value.safeguardsNote,
        evaluationAnchor: handover.value.evaluationAnchor,
        status: "DRAFT",
        lockedAt: null,
        lockedById: null,
      },
      create: {
        courseVersionId: editable.version.id,
        capacityArea: handover.value.capacityArea,
        subCapacityArea: handover.value.subCapacityArea,
        linkedStandard: handover.value.linkedStandard,
        capacityIndicator: handover.value.capacityIndicator,
        validatedCapacityGap: handover.value.validatedCapacityGap,
        baseline: handover.value.baseline,
        desiredPractice: handover.value.desiredPractice,
        rootCauseSummary: handover.value.rootCauseSummary,
        ksmeRoute: handover.value.ksmeRoute,
        separableKnowledgeSkillComponent:
          handover.value.separableKnowledgeSkillComponent,
        interventionDecision: handover.value.interventionDecision,
        analysisGateDecision: handover.value.analysisGateDecision,
        referralOrFurtherDiagnosisNote:
          handover.value.referralOrFurtherDiagnosisNote,
        safeguardsNote: handover.value.safeguardsNote,
        evaluationAnchor: handover.value.evaluationAnchor,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.DIAGNOSIS,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        completedAt: null,
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.DIAGNOSIS,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CAPACITY_MAP,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Lock Analysis Handover for Design before continuing to Capacity Map.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CAPACITY_MAP,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Lock Analysis Handover for Design before continuing to Capacity Map.",
        updatedById: identity.user.id,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/diagnosis`);
  redirect(`/studio/courses/${courseId}/diagnosis?saved=1`);
}

export async function lockAnalysisHandoverForDesignAction(courseId: string) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/diagnosis`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const diagnosis = editable.version.diagnosis;
  const handover = editable.version.analysisHandover;

  if (!diagnosis || !handover) {
    redirect(`/studio/courses/${courseId}/diagnosis?error=handover`);
  }

  const validation = validateAnalysisHandoverInput({
    capacityArea: handover.capacityArea,
    subCapacityArea: handover.subCapacityArea,
    linkedStandard: handover.linkedStandard,
    capacityIndicator: handover.capacityIndicator,
    validatedCapacityGap: handover.validatedCapacityGap,
    baseline: handover.baseline,
    desiredPractice: handover.desiredPractice,
    rootCauseSummary: handover.rootCauseSummary,
    ksmeRoute: handover.ksmeRoute,
    separableKnowledgeSkillComponent:
      handover.separableKnowledgeSkillComponent,
    interventionDecision: handover.interventionDecision,
    analysisGateDecision: handover.analysisGateDecision,
    referralOrFurtherDiagnosisNote: handover.referralOrFurtherDiagnosisNote,
    safeguardsNote: handover.safeguardsNote,
    evaluationAnchor: handover.evaluationAnchor,
  }, {
    courseFitDecision: diagnosis.courseFitDecision,
  });

  if (!validation.ok) {
    redirect(
      `/studio/courses/${courseId}/diagnosis?error=missing&fields=${encodeURIComponent(
        validation.missingFields.join(","),
      )}`,
    );
  }

  if (
    !canAnalysisProceedToDesign({
      courseFitDecision: diagnosis.courseFitDecision,
      ksmeRoute: handover.ksmeRoute,
      separableKnowledgeSkillComponent:
        handover.separableKnowledgeSkillComponent,
      analysisGateDecision: handover.analysisGateDecision,
    })
  ) {
    redirect(`/studio/courses/${courseId}/diagnosis?error=route`);
  }

  const linkedDiagnosisRecord = editable.version.setup?.selectedDiagnosisRecordId
    ? await prisma.diagnosisRecord.findUnique({
        where: {
          id: editable.version.setup.selectedDiagnosisRecordId,
        },
        include: {
          dataset: true,
        },
      })
    : null;
  const diagnosisSnapshot = resolveCourseSetupDiagnosisSnapshot({
    linkedRecord: linkedDiagnosisRecord,
    snapshotValue: editable.version.setup?.diagnosisSnapshot,
  });
  const anchorConsistency = validateAnalysisAnchorConsistency({
    diagnosis: {
      affectedLearnerGroup: diagnosis.affectedLearnerGroup,
      courseFitDecision: diagnosis.courseFitDecision,
    },
    handover: validation.value,
    snapshot: diagnosisSnapshot,
  });

  if (!anchorConsistency.ok) {
    redirect(
      `/studio/courses/${courseId}/diagnosis?error=anchor&fields=${encodeURIComponent(
        anchorConsistency.issues.join("|"),
      )}`,
    );
  }

  const lockedAt = new Date();

  await prisma.$transaction([
    prisma.courseAnalysisHandover.update({
      where: {
        courseVersionId: editable.version.id,
      },
      data: {
        status: "LOCKED",
        lockedAt,
        lockedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.DIAGNOSIS,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: lockedAt,
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.DIAGNOSIS,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: lockedAt,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CAPACITY_MAP,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CAPACITY_MAP,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        toStatus: editable.version.status,
        note: "Analysis Handover locked for Design.",
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/diagnosis`);
  revalidatePath(`/studio/courses/${courseId}/capacity-map`);
  redirect(`/studio/courses/${courseId}/capacity-map?analysisLocked=1`);
}

export async function saveCourseCapacityMapAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/capacity-map`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  if (!isAnalysisHandoverLocked(editable.version.analysisHandover)) {
    redirect(`/studio/courses/${courseId}/diagnosis`);
  }

  const analysisAnchors = getAnalysisDesignAnchors(
    editable.version.analysisHandover,
  );
  const result = parseCourseCapacityMapFormData(formData, {
    capacityArea: analysisAnchors.capacityArea,
    subarea: analysisAnchors.subCapacityArea,
    linkedStandard: analysisAnchors.linkedStandard,
  });

  if (!result.ok || !analysisAnchors.capacityIndicator) {
    const missingFields = [
      ...(!result.ok ? result.missingFields : []),
      ...(!analysisAnchors.capacityIndicator ? ["capacityIndicator"] : []),
    ];

    redirect(
      `/studio/courses/${courseId}/capacity-map?error=missing&fields=${encodeURIComponent(
        Array.from(new Set(missingFields)).join(","),
      )}`,
    );
  }

  await prisma.$transaction([
    prisma.courseCapacityMap.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        capacityArea: result.value.capacityArea,
        subarea: result.value.subarea,
        capabilityFocus: result.value.capabilityFocus,
        linkedStandard: result.value.linkedStandard,
        capacityOutcome: result.value.capacityOutcome,
        diagnosisLink: result.value.diagnosisLink,
        monitoringRelevance: result.value.monitoringRelevance,
      },
      create: {
        courseVersionId: editable.version.id,
        capacityArea: result.value.capacityArea,
        subarea: result.value.subarea,
        capabilityFocus: result.value.capabilityFocus,
        linkedStandard: result.value.linkedStandard,
        capacityOutcome: result.value.capacityOutcome,
        diagnosisLink: result.value.diagnosisLink,
        monitoringRelevance: result.value.monitoringRelevance,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CAPACITY_MAP,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CAPACITY_MAP,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.ACTION_MAP,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.ACTION_MAP,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/capacity-map`);
  redirect(`/studio/courses/${courseId}/capacity-map?saved=1`);
}

export async function saveCourseActionMapAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/action-map`,
  );
  const result = parseCourseActionMapFormData(formData);

  if (!result.ok) {
    const params = new URLSearchParams();

    if (result.missingFields.length > 0) {
      params.set("fields", result.missingFields.join(","));
    }

    if (result.vagueFields.length > 0) {
      params.set("vague", result.vagueFields.join(","));
    }

    params.set("error", "invalid");
    redirect(`/studio/courses/${courseId}/action-map?${params.toString()}`);
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  if (!isAnalysisHandoverLocked(editable.version.analysisHandover)) {
    redirect(`/studio/courses/${courseId}/diagnosis`);
  }

  const capacityMapStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.CAPACITY_MAP,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (capacityMapStatus !== WorkflowStepStatus.COMPLETE) {
    redirect(`/studio/courses/${courseId}/capacity-map`);
  }

  await prisma.$transaction([
    prisma.courseActionMap.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        capacityGoal: result.value.capacityGoal,
        individualLearnerOutcome: result.value.individualLearnerOutcome,
        observableActions: buildObservableActions(result.value),
        practiceScenarios: buildPracticeScenarios(result.value),
        essentialInformation: buildEssentialInformation(result.value),
        difMatrix: buildDifMatrix(result.value),
      },
      create: {
        courseVersionId: editable.version.id,
        capacityGoal: result.value.capacityGoal,
        individualLearnerOutcome: result.value.individualLearnerOutcome,
        observableActions: buildObservableActions(result.value),
        practiceScenarios: buildPracticeScenarios(result.value),
        essentialInformation: buildEssentialInformation(result.value),
        difMatrix: buildDifMatrix(result.value),
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.ACTION_MAP,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.ACTION_MAP,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.STORYBOARD,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.STORYBOARD,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/action-map`);
  redirect(`/studio/courses/${courseId}/action-map?saved=1`);
}

export async function saveCourseStoryboardAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/storyboard`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  if (!isAnalysisHandoverLocked(editable.version.analysisHandover)) {
    redirect(`/studio/courses/${courseId}/diagnosis`);
  }

  const analysisAnchors = getAnalysisDesignAnchors(
    editable.version.analysisHandover,
  );
  if (isDesignHandoverLocked(editable.version.designHandover)) {
    redirect(`/studio/courses/${courseId}/storyboard?designLocked=1`);
  }

  const requiresSafetyGate = Boolean(editable.version.setup?.sensitiveFlag);
  const result = parseCourseStoryboardFormData(formData, {
    requiresSafetyGate,
  });
  const designHandoverResult = parseDesignHandoverFormData(formData);

  if (!result.ok || !designHandoverResult.ok) {
    const missingFields = [
      ...(!result.ok ? result.missingFields : []),
      ...(!designHandoverResult.ok ? designHandoverResult.missingFields : []),
    ];

    redirect(
      `/studio/courses/${courseId}/storyboard?error=missing&fields=${encodeURIComponent(
        missingFields.join(","),
      )}`,
    );
  }

  const actionMapStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.ACTION_MAP,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (actionMapStatus !== WorkflowStepStatus.COMPLETE) {
    redirect(`/studio/courses/${courseId}/action-map`);
  }

  await prisma.$transaction([
    prisma.courseStoryboard.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        lessonPlan: buildStoryboardLessonPlan(result.value),
        aiHandoffNotes: result.value.aiBuildHandoffNote,
        approvedForBuild: true,
      },
      create: {
        courseVersionId: editable.version.id,
        lessonPlan: buildStoryboardLessonPlan(result.value),
        aiHandoffNotes: result.value.aiBuildHandoffNote,
        approvedForBuild: true,
      },
    }),
    prisma.courseDesignHandover.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        coursePurpose: designHandoverResult.value.coursePurpose,
        performanceGoal: designHandoverResult.value.performanceGoal,
        learningPathway: designHandoverResult.value.learningPathway,
        approvedBlockSequence:
          designHandoverResult.value.approvedBlockSequence,
        practiceStrategy: designHandoverResult.value.practiceStrategy,
        assessmentStrategy: designHandoverResult.value.assessmentStrategy,
        accessibilityRequirements:
          designHandoverResult.value.accessibilityRequirements,
        safeguards:
          analysisAnchors.safeguardsNote ||
          designHandoverResult.value.safeguards,
        aiAuthoringBoundaries:
          designHandoverResult.value.aiAuthoringBoundaries,
        evaluationAnchor:
          analysisAnchors.evaluationAnchor ||
          designHandoverResult.value.evaluationAnchor,
        status: "DRAFT",
        lockedAt: null,
        lockedById: null,
      },
      create: {
        courseVersionId: editable.version.id,
        coursePurpose: designHandoverResult.value.coursePurpose,
        performanceGoal: designHandoverResult.value.performanceGoal,
        learningPathway: designHandoverResult.value.learningPathway,
        approvedBlockSequence:
          designHandoverResult.value.approvedBlockSequence,
        practiceStrategy: designHandoverResult.value.practiceStrategy,
        assessmentStrategy: designHandoverResult.value.assessmentStrategy,
        accessibilityRequirements:
          designHandoverResult.value.accessibilityRequirements,
        safeguards:
          analysisAnchors.safeguardsNote ||
          designHandoverResult.value.safeguards,
        aiAuthoringBoundaries:
          designHandoverResult.value.aiAuthoringBoundaries,
        evaluationAnchor:
          analysisAnchors.evaluationAnchor ||
          designHandoverResult.value.evaluationAnchor,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.STORYBOARD,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
        lockedReason: null,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.STORYBOARD,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Lock Design Handover for Build before opening Build Studio.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Lock Design Handover for Build before opening Build Studio.",
        updatedById: identity.user.id,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/storyboard`);
  redirect(`/studio/courses/${courseId}/storyboard?saved=1`);
}

export async function lockDesignHandoverForBuildAction(courseId: string) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/storyboard`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const capacityMapStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.CAPACITY_MAP,
    )?.status ?? WorkflowStepStatus.LOCKED;
  const actionMapStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.ACTION_MAP,
    )?.status ?? WorkflowStepStatus.LOCKED;
  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;
  const storyboard = editable.version.storyboard;
  const designHandover = editable.version.designHandover;
  const linkedDiagnosisRecord = editable.version.setup?.selectedDiagnosisRecordId
    ? await prisma.diagnosisRecord.findUnique({
        where: {
          id: editable.version.setup.selectedDiagnosisRecordId,
        },
        include: {
          dataset: true,
        },
      })
    : null;
  const evidenceContext = buildEvidenceContextDisplayModel({
    analysisHandover: editable.version.analysisHandover,
    currentStageLabel: "Storyboard",
    diagnosisSnapshotValue: editable.version.setup?.diagnosisSnapshot,
    linkedDiagnosisRecord,
  });
  const validation = designHandover
    ? validateDesignHandoverInput({
        coursePurpose: designHandover.coursePurpose,
        performanceGoal: designHandover.performanceGoal,
        learningPathway: designHandover.learningPathway,
        approvedBlockSequence: designHandover.approvedBlockSequence,
        practiceStrategy: designHandover.practiceStrategy,
        assessmentStrategy: designHandover.assessmentStrategy,
        accessibilityRequirements: designHandover.accessibilityRequirements,
        safeguards: designHandover.safeguards,
        aiAuthoringBoundaries: designHandover.aiAuthoringBoundaries,
        evaluationAnchor: designHandover.evaluationAnchor,
      })
    : { ok: false, missingFields: ["designHandover"] };
  const incompletePrerequisites = getIncompleteDesignPrerequisites({
    analysisLocked: isAnalysisHandoverLocked(editable.version.analysisHandover),
    capacityMapComplete: capacityMapStatus === WorkflowStepStatus.COMPLETE,
    actionMapComplete: actionMapStatus === WorkflowStepStatus.COMPLETE,
    storyboardComplete: storyboardStatus === WorkflowStepStatus.COMPLETE,
    storyboardApprovedForBuild: Boolean(storyboard?.approvedForBuild),
    designHandoverComplete: validation.ok,
  });
  const evidenceReadiness = evaluateDownstreamEvidenceReadiness({
    analysisHandover: editable.version.analysisHandover,
    designHandover: designHandover
      ? {
          safeguards: designHandover.safeguards,
          evaluationAnchor: designHandover.evaluationAnchor,
        }
      : null,
    evidenceContext,
  });

  if (evidenceReadiness.blockingIssues.length > 0) {
    redirect(
      `/studio/courses/${courseId}/storyboard?error=evidence-readiness&items=${encodeURIComponent(
        evidenceReadiness.blockingIssues.map((issue) => issue.code).join(","),
      )}`,
    );
  }

  if (incompletePrerequisites.length > 0) {
    redirect(
      `/studio/courses/${courseId}/storyboard?error=prerequisites&items=${encodeURIComponent(
        incompletePrerequisites.join(","),
      )}`,
    );
  }

  if (!validation.ok) {
    redirect(
      `/studio/courses/${courseId}/storyboard?error=missing&fields=${encodeURIComponent(
        validation.missingFields.join(","),
      )}`,
    );
  }

  const lockedAt = new Date();

  await prisma.$transaction([
    prisma.courseDesignHandover.update({
      where: {
        courseVersionId: editable.version.id,
      },
      data: {
        status: "LOCKED",
        lockedAt,
        lockedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        toStatus: editable.version.status,
        note: "Design Handover locked for Build.",
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/storyboard`);
  revalidatePath(`/studio/courses/${courseId}/build`);
  redirect(`/studio/courses/${courseId}/build?designLocked=1`);
}

export async function generateBuildFromStoryboardAction(courseId: string) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;
  const storyboard = editable.version.storyboard;
  const designHandover = editable.version.designHandover;
  const storyboardLesson = parseStoryboardLessonPlan(
    storyboard?.lessonPlan,
  )[0];

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !storyboard?.approvedForBuild ||
    !isDesignHandoverLocked(designHandover) ||
    !storyboardLesson
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const blockDrafts = buildInitialBlocksFromStoryboard(storyboardLesson);

  await prisma.$transaction(async (tx) => {
    const courseModule = await tx.courseModule.upsert({
      where: {
        versionId_sortOrder: {
          versionId: editable.version.id,
          sortOrder: 1,
        },
      },
      update: {
        title: storyboardLesson.moduleName,
      },
      create: {
        versionId: editable.version.id,
        sortOrder: 1,
        title: storyboardLesson.moduleName,
      },
    });
    const lesson = await tx.courseLesson.upsert({
      where: {
        moduleId_sortOrder: {
          moduleId: courseModule.id,
          sortOrder: 1,
        },
      },
      update: {
        title: storyboardLesson.title,
      },
      create: {
        moduleId: courseModule.id,
        sortOrder: 1,
        title: storyboardLesson.title,
      },
    });

    await Promise.all(
      blockDrafts.map((block, index) =>
        tx.lessonBlock.upsert({
          where: {
            lessonId_sortOrder: {
              lessonId: lesson.id,
              sortOrder: index + 1,
            },
          },
          update: {
            type: block.type,
            content: serializeBuildBlockContent(block.content),
            origin: "DESIGN_REQUIRED",
            justification: "",
            purposeLink: block.content.linkedLearnerAction || "",
          },
          create: {
            lessonId: lesson.id,
            sortOrder: index + 1,
            type: block.type,
            content: serializeBuildBlockContent(block.content),
            origin: "DESIGN_REQUIRED",
            purposeLink: block.content.linkedLearnerAction || "",
          },
        }),
      ),
    );

    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio content checks before opening Preview.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio content checks before opening Preview.",
        updatedById: identity.user.id,
      },
    });
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  redirect(`/studio/courses/${courseId}/build?generated=1`);
}

export async function addCreatorBlockAction(
  courseId: string,
  lessonId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const result = parseCreatorAddedBlockFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/build?error=add-block&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const lesson = editable.version.modules
    .flatMap((module) => module.lessons)
    .find((moduleLesson) => moduleLesson.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const nextSortOrder =
    lesson.blocks.reduce(
      (highest, block) => Math.max(highest, block.sortOrder),
      0,
    ) + 1;
  if (!result.value.justification) {
    redirect(`/studio/courses/${courseId}/build?error=add-block&fields=justification`);
  }

  const justificationLabel =
    blockJustificationLabels[result.value.justification];

  await prisma.$transaction([
    prisma.lessonBlock.create({
      data: {
        lessonId,
        sortOrder: nextSortOrder,
        type: result.value.libraryItem.type,
        origin: "CREATOR_ADDED",
        justification: justificationLabel,
        purposeLink: result.value.purposeLink,
        content: serializeBuildBlockContent(
          buildCreatorAddedBlockContent({
            title: result.value.title,
            libraryItem: result.value.libraryItem,
            justificationLabel,
            purposeLink: result.value.purposeLink,
          }),
        ),
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        toStatus: editable.version.status,
        note: `Creator-added block: ${result.value.title}.`,
      },
    }),
  ]);

  revalidatePath(`/studio/courses/${courseId}/build`);
  redirect(`/studio/courses/${courseId}/build?added=1`);
}

export async function saveBuildBlockContentAction(
  courseId: string,
  blockId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const result = parseBuildBlockEditFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/build?error=edit-block&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const block = editable.version.modules
    .flatMap((module) => module.lessons)
    .flatMap((lesson) => lesson.blocks)
    .find((lessonBlock) => lessonBlock.id === blockId);

  if (!block) {
    notFound();
  }

  const updatedContent = mergeBuildBlockEditContent(
    parseBuildBlockContent(block.content),
    result.value,
  );

  await prisma.$transaction(async (tx) => {
    await tx.lessonBlock.update({
      where: {
        id: block.id,
      },
      data: {
        content: serializeBuildBlockContent(updatedContent),
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        completedAt: null,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Build Studio content checks after editing lesson content.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio content checks after editing lesson content.",
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Preview again after editing lesson content.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Preview again after editing lesson content.",
        updatedById: identity.user.id,
      },
    });

    const reopenedStatus = editable.version.sourceVersionId
      ? CourseVersionStatus.REVISION_DRAFT
      : CourseVersionStatus.DRAFT;

    if (editable.version.status === CourseVersionStatus.CREATOR_REVIEW) {
      await tx.courseVersion.update({
        where: {
          id: editable.version.id,
        },
        data: {
          status: reopenedStatus,
        },
      });
    }

    await tx.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: editable.version.status,
        toStatus:
          editable.version.status === CourseVersionStatus.CREATOR_REVIEW
            ? reopenedStatus
            : editable.version.status,
        note: `Build block content updated: ${result.value.title}.`,
      },
    });
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  revalidatePath(`/studio/courses/${courseId}/preview`);
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/build?edited=1`);
}

export async function moveBuildBlockAction(
  courseId: string,
  blockId: string,
  direction: BuildBlockMoveDirection,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );

  if (direction !== "up" && direction !== "down") {
    redirect(`/studio/courses/${courseId}/build?error=move-block`);
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const lesson = editable.version.modules
    .flatMap((module) => module.lessons)
    .find((moduleLesson) =>
      moduleLesson.blocks.some((lessonBlock) => lessonBlock.id === blockId),
    );

  if (!lesson) {
    notFound();
  }

  const move = getAdjacentBlockForMove(lesson.blocks, blockId, direction);

  if (!move) {
    redirect(`/studio/courses/${courseId}/build?moved=none`);
  }

  const movedBlockContent = parseBuildBlockContent(move.movingBlock.content);
  const temporarySortOrder = -Date.now();

  await prisma.$transaction(async (tx) => {
    await tx.lessonBlock.update({
      where: {
        id: move.movingBlock.id,
      },
      data: {
        sortOrder: temporarySortOrder,
      },
    });
    await tx.lessonBlock.update({
      where: {
        id: move.targetBlock.id,
      },
      data: {
        sortOrder: move.movingBlock.sortOrder,
      },
    });
    await tx.lessonBlock.update({
      where: {
        id: move.movingBlock.id,
      },
      data: {
        sortOrder: move.targetBlock.sortOrder,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        completedAt: null,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Build Studio content checks after reordering lesson blocks.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio content checks after reordering lesson blocks.",
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Preview again after reordering lesson blocks.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Preview again after reordering lesson blocks.",
        updatedById: identity.user.id,
      },
    });

    const reopenedStatus = editable.version.sourceVersionId
      ? CourseVersionStatus.REVISION_DRAFT
      : CourseVersionStatus.DRAFT;

    if (editable.version.status === CourseVersionStatus.CREATOR_REVIEW) {
      await tx.courseVersion.update({
        where: {
          id: editable.version.id,
        },
        data: {
          status: reopenedStatus,
        },
      });
    }

    await tx.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: editable.version.status,
        toStatus:
          editable.version.status === CourseVersionStatus.CREATOR_REVIEW
            ? reopenedStatus
            : editable.version.status,
        note: `Build block reordered: ${movedBlockContent.title || move.movingBlock.type}.`,
      },
    });
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  revalidatePath(`/studio/courses/${courseId}/preview`);
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/build?moved=1`);
}

export async function saveFinalTestBlockAction(
  courseId: string,
  lessonId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const result = parseFinalTestAuthoringFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/build?error=final-test&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const lesson = editable.version.modules
    .flatMap((module) => module.lessons)
    .find((moduleLesson) => moduleLesson.id === lessonId);

  if (!lesson) {
    notFound();
  }

  const existingFinalTest = editable.version.modules
    .flatMap((module) => module.lessons)
    .flatMap((moduleLesson) => moduleLesson.blocks)
    .find((block) => block.type === LessonBlockType.FINAL_TEST);
  const nextSortOrder =
    lesson.blocks.reduce(
      (highest, block) => Math.max(highest, block.sortOrder),
      0,
    ) + 1;
  const content = buildFinalTestBlockContent(result.value);

  await prisma.$transaction(async (tx) => {
    if (existingFinalTest) {
      await tx.lessonBlock.update({
        where: {
          id: existingFinalTest.id,
        },
        data: {
          content: serializeBuildBlockContent(content),
          origin: "DESIGN_REQUIRED",
          purposeLink: result.value.purpose,
        },
      });
    } else {
      await tx.lessonBlock.create({
        data: {
          lessonId,
          sortOrder: nextSortOrder,
          type: LessonBlockType.FINAL_TEST,
          content: serializeBuildBlockContent(content),
          origin: "DESIGN_REQUIRED",
          purposeLink: result.value.purpose,
        },
      });
    }

    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        completedAt: null,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Build Studio content checks after editing the final test.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio content checks after editing the final test.",
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Preview again after editing the final test.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Preview again after editing the final test.",
        updatedById: identity.user.id,
      },
    });

    const reopenedStatus = editable.version.sourceVersionId
      ? CourseVersionStatus.REVISION_DRAFT
      : CourseVersionStatus.DRAFT;

    if (editable.version.status === CourseVersionStatus.CREATOR_REVIEW) {
      await tx.courseVersion.update({
        where: {
          id: editable.version.id,
        },
        data: {
          status: reopenedStatus,
        },
      });
    }

    await tx.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: editable.version.status,
        toStatus:
          editable.version.status === CourseVersionStatus.CREATOR_REVIEW
            ? reopenedStatus
            : editable.version.status,
        note: existingFinalTest
          ? "Final test updated."
          : "Final test added.",
      },
    });
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  revalidatePath(`/studio/courses/${courseId}/preview`);
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/build?finalTest=1`);
}

export async function savePracticalProofConfigAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const analysis = editable.version.analysisHandover;
  const result = parsePracticalProofConfigFormData(formData, {
    capacityArea: analysis?.capacityArea,
    subCapacityArea: analysis?.subCapacityArea,
    linkedStandard: analysis?.linkedStandard,
    capacityIndicator: analysis?.capacityIndicator,
  });

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/build?error=proof&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.coursePracticalProofConfig.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        enabled: result.value.enabled,
        proofTitle: result.value.proofTitle,
        proofPurpose: result.value.proofPurpose,
        acceptedProofType: result.value.acceptedProofType,
        submissionFormat: result.value.submissionFormat,
        instructions: result.value.instructions,
        safetyGuidance: result.value.safetyGuidance,
        reviewCriteria: result.value.reviewCriteria,
        capacityArea: result.value.capacityArea,
        subCapacityArea: result.value.subCapacityArea,
        linkedStandard: result.value.linkedStandard,
        capacityIndicator: result.value.capacityIndicator,
        visibilityDefault: result.value.visibilityDefault,
        donorVisibilityEnabled: result.value.donorVisibilityEnabled,
        certificateSeparationConfirmed:
          result.value.certificateSeparationConfirmed,
        specialistReviewRequired: result.value.specialistReviewRequired,
      },
      create: {
        courseVersionId: editable.version.id,
        enabled: result.value.enabled,
        proofTitle: result.value.proofTitle,
        proofPurpose: result.value.proofPurpose,
        acceptedProofType: result.value.acceptedProofType,
        submissionFormat: result.value.submissionFormat,
        instructions: result.value.instructions,
        safetyGuidance: result.value.safetyGuidance,
        reviewCriteria: result.value.reviewCriteria,
        capacityArea: result.value.capacityArea,
        subCapacityArea: result.value.subCapacityArea,
        linkedStandard: result.value.linkedStandard,
        capacityIndicator: result.value.capacityIndicator,
        visibilityDefault: result.value.visibilityDefault,
        donorVisibilityEnabled: result.value.donorVisibilityEnabled,
        certificateSeparationConfirmed:
          result.value.certificateSeparationConfirmed,
        specialistReviewRequired: result.value.specialistReviewRequired,
      },
    });

    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.IN_PROGRESS,
        completedAt: null,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.IN_PROGRESS,
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Build Studio checks after updating practical proof configuration.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Build Studio checks after updating practical proof configuration.",
        updatedById: identity.user.id,
      },
    });
    await tx.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.LOCKED,
        completedAt: null,
        lockedReason:
          "Complete Preview again after updating practical proof configuration.",
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.LOCKED,
        lockedReason:
          "Complete Preview again after updating practical proof configuration.",
        updatedById: identity.user.id,
      },
    });

    const reopenedStatus = editable.version.sourceVersionId
      ? CourseVersionStatus.REVISION_DRAFT
      : CourseVersionStatus.DRAFT;

    if (editable.version.status === CourseVersionStatus.CREATOR_REVIEW) {
      await tx.courseVersion.update({
        where: {
          id: editable.version.id,
        },
        data: {
          status: reopenedStatus,
        },
      });
    }

    await tx.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: editable.version.status,
        toStatus:
          editable.version.status === CourseVersionStatus.CREATOR_REVIEW
            ? reopenedStatus
            : editable.version.status,
        note: result.value.enabled
          ? "Optional practical proof configuration updated."
          : "Optional practical proof disabled.",
      },
    });
  });

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  revalidatePath(`/studio/courses/${courseId}/preview`);
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/build?proof=1`);
}

export async function completeBuildChecksAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/build`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const storyboardStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.STORYBOARD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    storyboardStatus !== WorkflowStepStatus.COMPLETE ||
    !isDesignHandoverLocked(editable.version.designHandover)
  ) {
    redirect(`/studio/courses/${courseId}/storyboard`);
  }

  const hasGeneratedContent = hasBuildContent(editable.version.modules);
  const governanceIssues = getBuildGovernanceIssues(editable.version.modules);
  const proofReadiness = buildPracticalProofReadiness(
    editable.version.practicalProofConfig,
  );
  const finalTestRequired = hasCertificateIntent(
    editable.version.setup?.certificateIntent,
  );
  const result = parseBuildCompletionChecksFormData(
    formData,
    hasGeneratedContent,
    finalTestRequired,
    hasFinalTestContent(editable.version.modules),
  );

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/build?error=checks&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  if (governanceIssues.length > 0) {
    redirect(`/studio/courses/${courseId}/build?error=checks&fields=blockGovernanceReady`);
  }

  if (!proofReadiness.ready) {
    redirect(`/studio/courses/${courseId}/build?error=checks&fields=practicalProofReady`);
  }

  await prisma.$transaction([
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.BUILD,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.BUILD,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        toStatus: editable.version.status,
        note: summarizeBuildCompletionChecks(result.value),
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/build`);
  revalidatePath(`/studio/courses/${courseId}/preview`);
  redirect(`/studio/courses/${courseId}/preview?ready=1`);
}

export async function completePreviewChecksAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/preview`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const buildStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.BUILD,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (buildStatus !== WorkflowStepStatus.COMPLETE) {
    redirect(`/studio/courses/${courseId}/build`);
  }

  const result = parsePreviewCompletionChecksFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/preview?error=checks&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  await prisma.$transaction([
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.PREVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.PREVIEW,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.NOT_STARTED,
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.NOT_STARTED,
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        toStatus: editable.version.status,
        note: summarizePreviewCompletionChecks(result.value),
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/preview`);
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/creator-review?ready=1`);
}

export async function completeCreatorReviewAction(
  courseId: string,
  formData: FormData,
) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/creator-review`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const previewStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.PREVIEW,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (previewStatus !== WorkflowStepStatus.COMPLETE) {
    redirect(`/studio/courses/${courseId}/preview`);
  }

  const result = parseCreatorReviewChecksFormData(formData);

  if (!result.ok) {
    redirect(
      `/studio/courses/${courseId}/creator-review?error=checks&fields=${encodeURIComponent(
        result.missingFields.join(","),
      )}`,
    );
  }

  const decisionNotes = editable.version.sourceVersionId
    ? "Creator-side quality review complete for this revision. Ready for formal review submission."
    : "Creator-side quality review complete. Ready for submit-for-review step.";
  const creatorReviewChecklist = buildCreatorReviewChecklist(result.value);
  const handover = buildBuildToReviewHandover(
    {
      courseTitle: editable.course.title,
      version: editable.version,
    },
    {
      workflowStatusOverrides: {
        [CourseWorkflowStep.CREATOR_REVIEW]: WorkflowStepStatus.COMPLETE,
      },
    },
  );
  const checklist = mergeBuildToReviewHandoverChecklist(
    creatorReviewChecklist,
    handover,
  );

  await prisma.$transaction([
    prisma.courseVersion.update({
      where: {
        id: editable.version.id,
      },
      data: {
        status: CourseVersionStatus.CREATOR_REVIEW,
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        checklist,
        decisionNotes,
      },
      create: {
        courseVersionId: editable.version.id,
        checklist,
        decisionNotes,
      },
    }),
    prisma.courseWorkflowStepRecord.upsert({
      where: {
        courseVersionId_step: {
          courseVersionId: editable.version.id,
          step: CourseWorkflowStep.CREATOR_REVIEW,
        },
      },
      update: {
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        lockedReason: null,
        updatedById: identity.user.id,
      },
      create: {
        courseVersionId: editable.version.id,
        step: CourseWorkflowStep.CREATOR_REVIEW,
        status: WorkflowStepStatus.COMPLETE,
        completedAt: new Date(),
        updatedById: identity.user.id,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: editable.version.status,
        toStatus: CourseVersionStatus.CREATOR_REVIEW,
        note: summarizeCreatorReviewChecks(result.value),
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath(`/studio/courses/${courseId}/creator-review`);
  redirect(`/studio/courses/${courseId}/creator-review?completed=1`);
}

export async function submitCourseForReviewAction(courseId: string) {
  const identity = await requireWorkspaceIdentity(
    `/studio/courses/${courseId}/creator-review`,
  );
  const editable = await getEditableCourseVersion(
    prisma,
    {
      userId: identity.user.id,
      organizationId: identity.user.organizationId,
      role: identity.session.role,
    },
    courseId,
  );

  if (!editable) {
    notFound();
  }

  const creatorReviewStatus =
    editable.version.workflowSteps.find(
      (step) => step.step === CourseWorkflowStep.CREATOR_REVIEW,
    )?.status ?? WorkflowStepStatus.LOCKED;

  if (
    editable.version.status !== CourseVersionStatus.CREATOR_REVIEW ||
    creatorReviewStatus !== WorkflowStepStatus.COMPLETE
  ) {
    redirect(`/studio/courses/${courseId}/creator-review`);
  }

  const handover = buildBuildToReviewHandover({
    courseTitle: editable.course.title,
    version: editable.version,
  });

  if (!canSubmitBuildToReviewHandover(handover)) {
    redirect(
      `/studio/courses/${courseId}/creator-review?error=handover&fields=${encodeURIComponent(
        handover.blockingWarnings.map((warning) => warning.code).join(","),
      )}`,
    );
  }

  const existingReviewRecord = await prisma.courseReviewRecord.findUnique({
    where: {
      courseVersionId: editable.version.id,
    },
    select: {
      checklist: true,
    },
  });
  const submittedAt = new Date();
  const isRevisionSubmission = Boolean(editable.version.sourceVersionId);
  const decisionNotes = isRevisionSubmission
    ? "Revision submitted for formal review. Awaiting reviewer assignment and decision."
    : "Submitted for formal review. Awaiting reviewer assignment and decision.";
  const lifecycleNote = isRevisionSubmission
    ? "Revision submitted for formal review."
    : "Course submitted for formal review.";

  await prisma.$transaction([
    prisma.courseVersion.update({
      where: {
        id: editable.version.id,
      },
      data: {
        status: CourseVersionStatus.SUBMITTED,
        submittedAt,
      },
    }),
    prisma.course.update({
      where: {
        id: editable.course.id,
      },
      data: {
        updatedAt: submittedAt,
      },
    }),
    prisma.courseReviewRecord.upsert({
      where: {
        courseVersionId: editable.version.id,
      },
      update: {
        checklist: mergeBuildToReviewHandoverChecklist(
          existingReviewRecord?.checklist,
          handover,
        ),
        decisionNotes,
      },
      create: {
        courseVersionId: editable.version.id,
        checklist: mergeBuildToReviewHandoverChecklist(null, handover),
        decisionNotes,
      },
    }),
    prisma.courseLifecycleEvent.create({
      data: {
        courseVersionId: editable.version.id,
        actorId: identity.user.id,
        fromStatus: CourseVersionStatus.CREATOR_REVIEW,
        toStatus: CourseVersionStatus.SUBMITTED,
        note: lifecycleNote,
      },
    }),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/courses");
  revalidatePath("/review");
  revalidatePath("/review/queue");
  redirect(
    isRevisionSubmission
      ? "/studio/courses?revisionSubmitted=1"
      : "/studio/courses?submitted=1",
  );
}

function hasCertificateIntent(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  return Boolean(normalized && normalized !== "none" && normalized !== "n/a");
}

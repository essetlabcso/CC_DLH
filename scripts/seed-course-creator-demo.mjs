import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_COURSE_ID = "cmp4ws1kv000ffhkk37egckgv";
const DEMO_VERSION_ID = "cmp4ws1kw000hfhkknlmnzomo";
const DEMO_CREATOR_VERSION_ID = "cmp4ws1kw000hfhkknlmnzom2";
const COURSE_TITLE = "Outcome Evidence for CSO MEAL";
const CERTIFICATE_RULE =
  "80%+ final test score = pass and automated course certificate";

const now = new Date();

function blockContent(input) {
  return JSON.stringify({
    aiReviewStatus: "not-used",
    accessibilityNote:
      input.accessibilityNote ||
      "Plain-language text with keyboard-readable interaction.",
    safeguardingNote:
      input.safeguardingNote ||
      "Use anonymized or fictionalized examples. Do not collect raw proof here.",
    reviewReadinessNote:
      input.reviewReadinessNote ||
      "Demo-ready learner block linked to the approved Action Map.",
    ...input,
  });
}

async function upsertDemoUser(organizationId, email, name, role) {
  const user = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId,
        email,
      },
    },
    update: {
      name,
      status: "ACTIVE",
    },
    create: {
      organizationId,
      email,
      name,
      status: "ACTIVE",
    },
  });
  const membership = await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId,
        userId: user.id,
      },
    },
    update: {
      status: "ACTIVE",
    },
    create: {
      organizationId,
      userId: user.id,
      status: "ACTIVE",
    },
  });

  await prisma.membershipRoleAssignment.upsert({
    where: {
      membershipId_role: {
        membershipId: membership.id,
        role,
      },
    },
    update: {},
    create: {
      membershipId: membership.id,
      role,
    },
  });

  return user;
}

async function main() {
  const organization = await prisma.organization.upsert({
    where: {
      slug: "dec-local",
    },
    update: {
      name: "DEC Local Development",
      organizationType: "CSO capacity strengthening",
      status: "ACTIVE",
    },
    create: {
      name: "DEC Local Development",
      slug: "dec-local",
      organizationType: "CSO capacity strengthening",
      status: "ACTIVE",
    },
  });

  const creator = await upsertDemoUser(
    organization.id,
    "creator@dec.local",
    "DEC Course Creator",
    "CREATOR",
  );
  const reviewer = await upsertDemoUser(
    organization.id,
    "reviewer@dec.local",
    "DEC Reviewer",
    "REVIEWER",
  );
  const admin = await upsertDemoUser(
    organization.id,
    "admin@dec.local",
    "DEC Admin",
    "ADMIN",
  );
  const learner = await upsertDemoUser(
    organization.id,
    "learner@dec.local",
    "DEC Learner",
    "LEARNER",
  );

  const diagnosisRecord = await prisma.diagnosisRecord.findFirst({
    where: {
      diagnosisCode: "DEC-CSF-R1-001",
    },
    include: {
      dataset: true,
    },
  });

  await prisma.course.deleteMany({
    where: {
      id: DEMO_COURSE_ID,
    },
  });

  const course = await prisma.course.create({
    data: {
      id: DEMO_COURSE_ID,
      organizationId: organization.id,
      ownerId: creator.id,
      title: COURSE_TITLE,
      slug: "outcome-evidence-for-cso-meal",
      status: "ACTIVE",
      accessMode: "PUBLIC_REGISTRATION_REQUIRED",
      publicCatalogVisible: true,
      versions: {
        create: {
          id: DEMO_VERSION_ID,
          createdById: creator.id,
          versionNumber: 1,
          status: "PUBLISHED",
          designRecord: JSON.stringify({
            demoOnly:
              "DEMO ONLY: seeded for near-term Course Creator Portal UAT.",
          }),
          creatorReviewReadyAt: now,
          submittedAt: now,
          approvedAt: now,
          publishedAt: now,
          events: {
            create: [
              {
                actorId: creator.id,
                toStatus: "DRAFT",
                note: "Demo course reseeded from approved diagnosis evidence.",
              },
              {
                actorId: reviewer.id,
                fromStatus: "SUBMITTED",
                toStatus: "APPROVED",
                note: "Demo review approved for publish.",
              },
              {
                actorId: admin.id,
                fromStatus: "APPROVED",
                toStatus: "PUBLISHED",
                note:
                  "DEMO ONLY: seeded publish shortcut for near-term demo. Formal review workflow remains required for production.",
              },
            ],
          },
        },
      },
    },
    include: {
      versions: true,
    },
  });

  const version = course.versions[0];
  const diagnosisSnapshot = diagnosisRecord
    ? {
        diagnosisRecordId: diagnosisRecord.id,
        diagnosisCode: diagnosisRecord.diagnosisCode,
        diagnosisTitle: diagnosisRecord.diagnosisTitle,
        datasetCode: diagnosisRecord.dataset.datasetCode,
        datasetTitle: diagnosisRecord.dataset.datasetTitle,
        approvalStatus: diagnosisRecord.approvalStatus,
        locked: diagnosisRecord.isLocked,
      }
    : {};

  await prisma.courseSetup.create({
    data: {
      courseVersionId: version.id,
      title: COURSE_TITLE,
      summary:
        "A practical course for CSO MEAL and program staff to write clearer, safer outcome evidence statements from project activities.",
      primaryLearnerGroup:
        "MEAL officers, project officers, program coordinators, and reporting staff",
      language: "English",
      formatAndTime: "Self-paced, 2-3 hours",
      level: "Foundational to intermediate",
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      sensitiveFlag: false,
      certificateIntent: "80%+ final test certificate",
      learnerReality: JSON.stringify({
        device: "phone-first and low-bandwidth friendly",
        workContext:
          "Staff need examples they can use in reports without exposing sensitive data.",
      }),
      selectedDiagnosisDatasetId: diagnosisRecord?.datasetId,
      selectedDiagnosisRecordId: diagnosisRecord?.id,
      diagnosisSnapshot: JSON.stringify(diagnosisSnapshot),
      accessMode: "PUBLIC_REGISTRATION_REQUIRED",
      targetLearnerType: "BOTH",
      deliveryMode: "SELF_PACED",
      enrollmentMode: "SELF_ENROLL",
      publicCatalogVisible: true,
      memberCatalogVisible: true,
      certificateEnabled: true,
      practicalProofEnabled: true,
      learnerVisibilitySummary:
        "Visible to registered demo learners after authorized publication.",
    },
  });

  await prisma.courseDiagnosis.create({
    data: {
      courseVersionId: version.id,
      surfaceRequest:
        "Teams need help turning activity reports into concise outcome evidence.",
      performanceEvidence:
        "CSO reports describe activities and attendance but do not clearly explain what changed, for whom, and what evidence supports the change.",
      currentReality:
        "Project and MEAL staff report activities, participant counts, and broad statements such as awareness increased.",
      desiredReality:
        "Staff write a concise outcome evidence statement naming what changed, for whom, and which safe evidence supports the claim.",
      affectedLearnerGroup: "MEAL staff / Program staff",
      evidenceSources: JSON.stringify({
        source: "DEC-CSF-2026-R1",
        type: "Approved diagnosis/evidence record",
        period: "2026 R1",
      }),
      ksmeGap: "skill_knowledge",
      courseFitDecision: "course_addressable",
      alternativeIntervention:
        "Complementary template support and coaching remain useful, but the separable K/S component is course-addressable.",
    },
  });

  await prisma.courseAnalysisHandover.create({
    data: {
      courseVersionId: version.id,
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      subCapacityArea: "Outcome evidence and learning documentation",
      linkedStandard:
        "CSO uses evidence and learning to communicate results, adapt programming, and strengthen accountability.",
      capacityIndicator: "Outcome evidence statements are clear, safe, and evidence-based.",
      validatedCapacityGap:
        "CSO reports describe activities and attendance but do not clearly explain what changed, for whom, and what evidence supports the change.",
      baseline:
        "Reports usually list trainings delivered, people reached, photos, and general statements without explaining observed change or supporting evidence.",
      desiredPractice:
        "Staff draft safe outcome evidence statements that explain what changed, for whom, compared to the baseline, and what evidence supports the change.",
      rootCauseSummary:
        "Skill + Knowledge gap: staff need to understand outcome evidence concepts and practice applying a simple statement structure.",
      ksmeRoute: "Skill + Knowledge",
      separableKnowledgeSkillComponent:
        "Distinguish activity reporting from outcome evidence, then practice writing a safe evidence-based outcome statement.",
      interventionDecision:
        "Course-addressable with complementary template support.",
      analysisGateDecision: "proceed-to-design",
      safeguardsNote:
        "Do not include beneficiary names, safeguarding case details, phone numbers, politically sensitive details, or unredacted complaint data.",
      evaluationAnchor:
        "Final test on outcome evidence judgment plus optional private practical proof through a safe outcome evidence worksheet.",
      status: "LOCKED",
      lockedAt: now,
      lockedById: creator.id,
    },
  });

  await prisma.courseCapacityMap.create({
    data: {
      courseVersionId: version.id,
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      subarea: "Outcome evidence and learning documentation",
      capabilityFocus:
        "Write outcome evidence from project activities and feedback.",
      linkedStandard:
        "CSO uses evidence and learning to communicate results, adapt programming, and strengthen accountability.",
      capacityOutcome:
        "CSO staff can produce clearer, safer, and more evidence-based outcome statements for project reports and learning discussions.",
      diagnosisLink: "DEC-CSF-R1-001 approved evidence record",
      monitoringRelevance:
        "Track final test pass rate, private proof submissions, verified achievements, feedback, and improvement signals.",
    },
  });

  await prisma.courseActionMap.create({
    data: {
      courseVersionId: version.id,
      capacityGoal:
        "Staff can produce safe, concise, evidence-based outcome statements.",
      individualLearnerOutcome:
        "Learners distinguish activity/output/outcome/evidence, choose safe evidence, and draft a concise outcome statement.",
      observableActions: JSON.stringify([
        "Distinguish activity outputs from outcome evidence",
        "Identify what changed and for whom",
        "Select safe evidence to support a change claim",
        "Draft a concise outcome evidence statement",
        "Review and improve a weak evidence statement",
      ]),
      practiceScenarios: JSON.stringify([
        "Sort reporting statements by type",
        "Choose safe evidence in a fictional CSO case",
        "Draft and revise an outcome evidence statement",
      ]),
      essentialInformation: JSON.stringify([
        "Activity/output/outcome/evidence definitions",
        "Outcome evidence statement formula",
        "Anonymization and safe summary rules",
      ]),
      difMatrix: JSON.stringify({
        assessmentLink:
          "Knowledge checks, branching safety scenario, final test, and optional worksheet proof",
        proofPossibility:
          "Completed safe outcome evidence worksheet, separate from certificate",
      }),
    },
  });

  const lessonPlan = [
    {
      moduleName: "Outcome Evidence Writing",
      title: "Why activity reporting is not enough",
      purpose:
        "Help learners see what the Analysis Handover requires them to improve.",
      linkedLearnerAction:
        "Distinguish activity outputs from outcome evidence",
      linkedCapacityGoal:
        "Produce clearer, safer outcome statements for project reports.",
      rationale:
        "Activity counts matter, but the approved capacity gap is about explaining change and evidence.",
      learningMode: "short-explanation",
      learningFlow:
        "Learners review definitions and compare activity, output, outcome, and evidence statements.",
      plannedBlockSequence:
        "Text explanation, key takeaway, visual placeholder, accordion reveal",
      plannedInteraction: "Reveal statement parts and classify examples.",
      knowledgeCheck:
        "Which statement best explains an outcome evidence claim?",
      mediaRequirement: "Low-bandwidth visual placeholder and text alternative.",
      jobAidRequirement: "Outcome evidence formula job aid.",
      accessibilityNote: "Plain text and keyboard-usable reveal sections.",
      aiBuildHandoffNote:
        "AI may draft examples only from approved fictionalized context.",
      criticalActionNote:
        "Do not ask for real beneficiary names or sensitive raw evidence.",
    },
  ];

  await prisma.courseStoryboard.create({
    data: {
      courseVersionId: version.id,
      lessonPlan: JSON.stringify(lessonPlan),
      aiHandoffNotes:
        "AI draft-only. Use approved analysis, action map, and safe fictional examples.",
      approvedForBuild: true,
    },
  });

  await prisma.courseDesignHandover.create({
    data: {
      courseVersionId: version.id,
      coursePurpose:
        "Turn the approved outcome evidence capacity gap into a practical learner pathway.",
      performanceGoal:
        "Learners draft a safe, concise, evidence-based outcome statement from a project activity example.",
      learningPathway:
        "Explain the reporting gap, reveal statement structure, practice safe evidence choices, draft a statement, then complete final test and optional proof.",
      approvedBlockSequence:
        "Text, callout, visual, accordion, reflection, knowledge check, practical activity, branching scenario, resource, final test, proof instruction.",
      practiceStrategy:
        "Short checks, branching scenario, guided worksheet, and reflection.",
      assessmentStrategy:
        "80%+ final test score issues certificate. Practical proof remains optional and separate.",
      accessibilityRequirements:
        "Plain language, low-bandwidth visual placeholder, keyboard-readable interactions.",
      safeguards:
        "Use fictionalized examples. Raw proof private by default. No beneficiary names or safeguarding case details.",
      aiAuthoringBoundaries:
        "AI may draft wording only. AI does not approve, publish, certify, verify proof, or award badges.",
      evaluationAnchor:
        "Final test, private practical proof counts, verified achievement counts, feedback, and improvement signals.",
      status: "LOCKED",
      lockedAt: now,
      lockedById: creator.id,
    },
  });

  await prisma.coursePracticalProofConfig.create({
    data: {
      courseVersionId: version.id,
      enabled: true,
      proofTitle: "Safe Outcome Evidence Worksheet",
      proofPurpose:
        "Show that the learner can apply the course by drafting a safe, concise outcome evidence statement.",
      acceptedProofType: "COMPLETED_WORKSHEET",
      submissionFormat: "TEXT_ENTRY_OR_LINK",
      instructions:
        "Submit one completed outcome evidence worksheet. Use a real example only if it is safe and anonymized. A fictionalized practice example is acceptable for demo.",
      safetyGuidance:
        "Do not include beneficiary names, phone numbers, addresses, safeguarding case details, political risk information, or unredacted complaint data.",
      reviewCriteria:
        "States what changed, identifies for whom, provides relevant evidence, uses safe wording, and avoids overclaiming.",
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      subCapacityArea: "Outcome evidence and learning documentation",
      linkedStandard:
        "CSO uses evidence and learning to communicate results, adapt programming, and strengthen accountability.",
      capacityIndicator:
        "Outcome evidence statements are clear, safe, and evidence-based.",
      visibilityDefault: "PRIVATE",
      donorVisibilityEnabled: false,
      certificateSeparationConfirmed: true,
      specialistReviewRequired: false,
    },
  });

  const courseModule = await prisma.courseModule.create({
    data: {
      versionId: version.id,
      title: "Outcome Evidence Writing",
      sortOrder: 1,
    },
  });
  const lessons = [];

  for (const [index, title] of [
    "Why activity reporting is not enough",
    "What makes a strong outcome evidence statement",
    "Practice safe evidence decisions",
    "Draft and improve your statement",
    "Final test and optional proof",
  ].entries()) {
    lessons.push(
      await prisma.courseLesson.create({
        data: {
          moduleId: courseModule.id,
          title,
          sortOrder: index + 1,
        },
      }),
    );
  }

  const blocks = [
    {
      lessonId: lessons[0].id,
      type: "TEXT",
      sortOrder: 1,
      content: blockContent({
        title: "Activity, output, outcome, evidence",
        blockTypeLabel: "Text / Explanation",
        purpose:
          "Explain the core difference between activity reporting and outcome evidence.",
        body:
          "Activities are what your project does. Outputs are what the activity directly produces. Outcomes are what changes for people, groups, systems, or practices. Evidence is the information that helps support the change claim.",
        linkedLearnerAction:
          "Distinguish activity outputs from outcome evidence",
      }),
    },
    {
      lessonId: lessons[0].id,
      type: "CALLOUT",
      sortOrder: 2,
      content: blockContent({
        title: "Key takeaway",
        blockTypeLabel: "Callout / Key takeaway",
        purpose: "Keep the main course message visible.",
        body:
          "A useful outcome evidence statement says what changed, for whom, and what safe evidence supports the claim.",
        linkedLearnerAction:
          "Distinguish activity outputs from outcome evidence",
      }),
    },
    {
      lessonId: lessons[1].id,
      type: "IMAGE",
      sortOrder: 1,
      content: blockContent({
        title: "Outcome evidence statement map",
        blockTypeLabel: "Image / visual placeholder",
        purpose:
          "Show the structure: change, people/group, evidence, learning implication.",
        body:
          "Visual placeholder for the statement map. Text alternative: What changed + for whom + evidence source + what we learned.",
        linkedLearnerAction: "Identify what changed and for whom",
      }),
    },
    {
      lessonId: lessons[1].id,
      type: "TEXT",
      sortOrder: 2,
      content: blockContent({
        title: "Reveal the statement parts",
        blockTypeLabel: "Accordion / Reveal",
        interactionType: "accordion",
        purpose:
          "Let learners progressively inspect the parts of a strong statement.",
        revealItems: [
          {
            title: "What changed?",
            body:
              "Name the observed change in knowledge, behavior, practice, service quality, or decision-making.",
          },
          {
            title: "For whom?",
            body:
              "Name the group safely, such as project officers or community committee members, without personal identifiers.",
          },
          {
            title: "What evidence supports it?",
            body:
              "Use safe summaries such as worksheet results, observation notes, or anonymized feedback themes.",
          },
        ],
        linkedLearnerAction: "Identify what changed and for whom",
      }),
    },
    {
      lessonId: lessons[2].id,
      type: "SCENARIO",
      sortOrder: 1,
      content: blockContent({
        title: "Choosing safe evidence",
        blockTypeLabel: "Branching scenario",
        interactionType: "branching-scenario",
        purpose:
          "Practice choosing useful evidence without exposing sensitive details.",
        body:
          "A project officer wants to include an outcome evidence example in a quarterly report.",
        prompt:
          "Which evidence choice is safest and still useful for the report?",
        scenarioChoices: [
          {
            id: "raw-name",
            label:
              "Use a named beneficiary quote with phone number because it feels convincing.",
            feedback:
              "This exposes personal data and creates avoidable risk. The report should not include identifying details.",
          },
          {
            id: "safe-summary",
            label:
              "Use an anonymized summary with the change, group, and evidence source.",
            feedback:
              "This is the best choice. It preserves the outcome evidence while protecting people and organizations.",
            best: true,
          },
          {
            id: "activity-count",
            label:
              "Only report that the training happened and attach the attendance sheet.",
            feedback:
              "This avoids sensitive detail, but it does not explain what changed or which evidence supports the change.",
          },
        ],
        linkedLearnerAction: "Select safe evidence to support a change claim",
      }),
    },
    {
      lessonId: lessons[2].id,
      type: "CHECK",
      sortOrder: 2,
      content: blockContent({
        title: "Check the evidence choice",
        blockTypeLabel: "Knowledge check / multiple choice",
        purpose: "Confirm safe evidence judgment before drafting.",
        prompt:
          "Which detail should usually be removed from an outcome evidence example?",
        choices: [
          "The type of change observed",
          "The group affected, described safely",
          "A beneficiary phone number",
          "The evidence source type",
        ],
        correctAnswer: "C",
        feedback:
          "Correct answer: C. Personal identifiers should be removed unless there is a clear, consented, and safe reason.",
        linkedLearnerAction: "Select safe evidence to support a change claim",
      }),
    },
    {
      lessonId: lessons[3].id,
      type: "TEXT",
      sortOrder: 1,
      origin: "CREATOR_ADDED",
      justification: "support practice",
      content: blockContent({
        title: "Draft your outcome statement",
        blockTypeLabel: "Practical activity / assignment instruction",
        purpose:
          "Guide the learner to draft a practical output using the template.",
        body:
          "Use this formula: After [activity], [who] changed [what practice/knowledge/decision], shown by [safe evidence]. Then add one sentence about what the CSO learned or will adapt.",
        prompt:
          "Draft one outcome evidence statement using a fictionalized or anonymized project example.",
        linkedLearnerAction: "Draft a concise outcome evidence statement",
      }),
    },
    {
      lessonId: lessons[3].id,
      type: "REFLECTION",
      sortOrder: 2,
      content: blockContent({
        title: "Apply this in your next report",
        blockTypeLabel: "Reflection",
        purpose:
          "Connect the course to the learner's next reporting or learning task.",
        prompt:
          "Which upcoming report, learning meeting, or project update could use a stronger outcome evidence statement?",
        linkedLearnerAction:
          "Review and improve a weak evidence statement",
      }),
    },
    {
      lessonId: lessons[3].id,
      type: "CALLOUT",
      sortOrder: 3,
      origin: "CREATOR_ADDED",
      justification: "support low-bandwidth access",
      content: blockContent({
        title: "Outcome evidence worksheet",
        blockTypeLabel: "Download / resource block",
        purpose:
          "Provide a reusable worksheet learners can use after the course.",
        body:
          "Download/resource placeholder: Safe Outcome Evidence Worksheet. Sections: activity, change, who changed, safe evidence, learning/adaptation, redaction check.",
        linkedLearnerAction: "Draft a concise outcome evidence statement",
      }),
    },
    {
      lessonId: lessons[4].id,
      type: "FINAL_TEST",
      sortOrder: 1,
      content: blockContent({
        title: "Outcome Evidence Final Test",
        blockTypeLabel: "Final test",
        purpose:
          "Assess the knowledge, judgment, and safe evidence choices taught in the course.",
        prompt: "Which statement is the strongest outcome evidence statement?",
        choices: [
          "We trained 25 participants on outcome reporting.",
          "Participants attended the full training and received handouts.",
          "After the training, 18 of 25 participants correctly revised a weak outcome statement using the checklist.",
          "The training was successful and participants were happy.",
        ],
        correctAnswer: "C",
        feedback:
          "C is strongest because it describes what changed, for whom, and what evidence supports the change.",
        linkedLearnerAction: "All approved learner actions",
      }),
    },
    {
      lessonId: lessons[4].id,
      type: "CALLOUT",
      sortOrder: 2,
      content: blockContent({
        title: "Optional practical proof",
        blockTypeLabel: "Practical proof instruction",
        purpose:
          "Explain the separate private proof pathway without making it a certificate requirement.",
        body:
          "Your certificate is based on the final test at 80% or above. Practical proof is optional and private by default. Submit only safe, anonymized, redacted, or fictionalized evidence.",
        linkedLearnerAction: "Submit practical proof separately",
      }),
    },
  ];

  for (const block of blocks) {
    await prisma.lessonBlock.create({
      data: {
        lessonId: block.lessonId,
        type: block.type,
        sortOrder: block.sortOrder,
        content: block.content,
        origin: block.origin || "DESIGN_REQUIRED",
        justification: block.justification || "",
        purposeLink:
          JSON.parse(block.content).linkedLearnerAction ||
          "Outcome evidence learning action",
      },
    });
  }

  const handoverChecklist = {
    buildToReviewHandover: {
      generatedAt: now.toISOString(),
      courseTitle: COURSE_TITLE,
      certificateRule: CERTIFICATE_RULE,
      submissionType: "new",
      anchors: {
        capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
        subCapacityArea: "Outcome evidence and learning documentation",
        gap:
          "Reports describe activities but do not clearly explain what changed, for whom, and what evidence supports the change.",
        route: "Skill + Knowledge",
      },
      summary: {
        moduleCount: 1,
        lessonCount: 5,
        totalBlocks: blocks.length,
        requiredBlockCount: blocks.filter(
          (block) => block.origin !== "CREATOR_ADDED",
        ).length,
        creatorAddedBlockCount: blocks.filter(
          (block) => block.origin === "CREATOR_ADDED",
        ).length,
      },
      finalTest: {
        required: true,
        ready: true,
        questionCount: 1,
        summary: CERTIFICATE_RULE,
      },
      aiReview: {
        status: "AI not used",
        pendingCount: 0,
        reviewedCount: 0,
        notUsedCount: blocks.length,
      },
      accessibility: {
        status: "Block-level notes present",
        blocksWithNotes: blocks.length,
        blocksMissingNotes: 0,
      },
      safeguarding: {
        status: "Block-level notes present",
        blocksWithNotes: blocks.length,
        blocksMissingNotes: 0,
      },
      preview: {
        completed: true,
        status: "complete",
      },
      creatorReview: {
        completed: true,
        status: "complete",
      },
      practicalProof: {
        enabled: true,
        ready: true,
        status: "Safely configured",
        blockers: [],
      },
      blockingWarnings: [],
      reviewerAttentionItems: [
        "Confirm the final test preserves the fixed 80% certificate rule.",
        "Confirm practical proof remains optional, private by default, and separate from certificate.",
      ],
    },
    reviewerReview: {
      decisionType: "approve-for-publish",
      certificateRuleConfirmed: true,
      certificateRule: CERTIFICATE_RULE,
      specialistReviewRequired: false,
      decisionNote:
        "Demo review approved: evidence, design, build, final test, proof separation, and safety notes are aligned.",
    },
    publicationRecord: {
      publishedAt: now.toISOString(),
      publishedById: admin.id,
      courseId: course.id,
      courseVersionId: version.id,
      versionNumber: 1,
      releaseType: "publish-now",
      visibility: "PUBLIC_REGISTRATION_REQUIRED",
      enrollment: "SELF_ENROLL",
      certificateRule: CERTIFICATE_RULE,
      readinessSummary:
        "DEMO ONLY seeded publish. Formal review workflow remains required for production.",
    },
  };

  await prisma.courseReviewRecord.create({
    data: {
      courseVersionId: version.id,
      reviewerId: reviewer.id,
      checklist: JSON.stringify(handoverChecklist),
      decisionNotes:
        "Approved for Publish for the Outcome Evidence for CSO MEAL demo.",
      returnedReason: "",
    },
  });

  const monitoringMetrics = {
    courseVersion: "v1.0",
    enrolledLearners: 126,
    startedLearners: 104,
    completedLearners: 78,
    completionRate: 75,
    finalTestAttempts: 84,
    finalTestPassRate: 82,
    certificatesIssued: 69,
    averageFinalTestScore: 84,
    practicalProofSubmissions: 28,
    proofAccepted: 17,
    verifiedAchievementsAwarded: 17,
    proofReturnedForRevision: 8,
    proofPending: 3,
    learnerFeedbackAverage: 4.4,
    topDropOffPoint: "Lesson 3 - Choosing safe evidence",
    improvementSignal:
      "Learners are struggling with anonymization decisions. Add one more worked example or scenario.",
    safeCapacityEvidenceSummary:
      "This course supports MEAL capacity strengthening by helping CSO staff write clearer and safer outcome evidence statements. In version v1.0, 69 participants earned course certificates and 17 practical proof submissions were verified as safe and acceptable outcome evidence examples. Raw proof remains private and is not displayed in this dashboard.",
  };

  await prisma.courseMonitoringRecord.create({
    data: {
      courseVersionId: version.id,
      signalSummary: JSON.stringify(monitoringMetrics),
      improvementNotes: monitoringMetrics.improvementSignal,
    },
  });

  const creatorVersion = await clonePublishedVersionForCreatorWorkspace({
    publishedVersionId: version.id,
    creatorVersionId: DEMO_CREATOR_VERSION_ID,
    creatorId: creator.id,
  });

  await prisma.learnerEnrollment.create({
    data: {
      userId: learner.id,
      courseId: course.id,
      courseVersionId: version.id,
      organizationId: organization.id,
      source: "SELF_ENROLL",
      status: "STARTED",
      enrolledAt: now,
      startedAt: now,
      reason: "Demo learner enrollment",
      metadata: JSON.stringify({
        demoOnly: true,
      }),
    },
  });

  await prisma.scopedRoleAssignment.createMany({
    data: [
      {
        userId: creator.id,
        roleKey: "COURSE_CREATOR",
        scopeType: "COURSE",
        scopeId: course.id,
        organizationId: organization.id,
        courseId: course.id,
        courseVersionId: creatorVersion.id,
        reason: "Demo course owner",
      },
      {
        userId: reviewer.id,
        roleKey: "COURSE_REVIEWER",
        scopeType: "COURSE_VERSION",
        scopeId: version.id,
        organizationId: organization.id,
        courseId: course.id,
        courseVersionId: version.id,
        reason: "Demo reviewer",
      },
      {
        userId: admin.id,
        roleKey: "AUTHORIZED_PUBLISHER",
        scopeType: "COURSE_VERSION",
        scopeId: version.id,
        organizationId: organization.id,
        courseId: course.id,
        courseVersionId: version.id,
        reason: "Demo publisher",
      },
    ],
  });

  for (const step of [
    "COURSE_SETUP",
    "DIAGNOSIS",
    "CAPACITY_MAP",
    "ACTION_MAP",
    "STORYBOARD",
    "BUILD",
    "PREVIEW",
    "CREATOR_REVIEW",
    "MONITORING",
  ]) {
    await prisma.courseWorkflowStepRecord.create({
      data: {
        courseVersionId: version.id,
        step,
        status: "COMPLETE",
        completedAt: now,
        updatedById: creator.id,
      },
    });
  }

  console.log("Seeded Course Creator demo course");
  console.log(`Course ID: ${course.id}`);
  console.log(`Version ID: ${version.id}`);
  console.log(`Creator workspace version ID: ${creatorVersion.id}`);
  console.log("Creator URL: /studio/courses/cmp4ws1kv000ffhkk37egckgv/setup");
  console.log("Learner URL: /courses and /learn/courses/cmp4ws1kv000ffhkk37egckgv");
  console.log(
    "Monitoring URL: /review/monitoring/cmp4ws1kv000ffhkk37egckgv/versions/cmp4ws1kw000hfhkknlmnzomo",
  );
}

async function clonePublishedVersionForCreatorWorkspace({
  publishedVersionId,
  creatorVersionId,
  creatorId,
}) {
  const publishedVersion = await prisma.courseVersion.findUniqueOrThrow({
    where: {
      id: publishedVersionId,
    },
    include: {
      setup: true,
      diagnosis: true,
      analysisHandover: true,
      capacityMap: true,
      actionMap: true,
      storyboard: true,
      designHandover: true,
      practicalProofConfig: true,
      reviewRecord: true,
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

  const creatorVersion = await prisma.courseVersion.create({
    data: {
      id: creatorVersionId,
      courseId: publishedVersion.courseId,
      createdById: creatorId,
      sourceVersionId: publishedVersion.id,
      versionNumber: 2,
      status: "CREATOR_REVIEW",
      designRecord: publishedVersion.designRecord,
      creatorReviewReadyAt: now,
      submittedAt: null,
      approvedAt: null,
      publishedAt: null,
    },
  });

  if (publishedVersion.setup) {
    const { id, courseVersionId, createdAt, updatedAt, ...setup } =
      publishedVersion.setup;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseSetup.create({
      data: {
        ...setup,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.diagnosis) {
    const { id, courseVersionId, createdAt, updatedAt, ...diagnosis } =
      publishedVersion.diagnosis;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseDiagnosis.create({
      data: {
        ...diagnosis,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.analysisHandover) {
    const { id, courseVersionId, createdAt, updatedAt, ...analysis } =
      publishedVersion.analysisHandover;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseAnalysisHandover.create({
      data: {
        ...analysis,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.capacityMap) {
    const { id, courseVersionId, createdAt, updatedAt, ...capacityMap } =
      publishedVersion.capacityMap;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseCapacityMap.create({
      data: {
        ...capacityMap,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.actionMap) {
    const { id, courseVersionId, createdAt, updatedAt, ...actionMap } =
      publishedVersion.actionMap;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseActionMap.create({
      data: {
        ...actionMap,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.storyboard) {
    const { id, courseVersionId, createdAt, updatedAt, ...storyboard } =
      publishedVersion.storyboard;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseStoryboard.create({
      data: {
        ...storyboard,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.designHandover) {
    const { id, courseVersionId, createdAt, updatedAt, ...design } =
      publishedVersion.designHandover;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseDesignHandover.create({
      data: {
        ...design,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.practicalProofConfig) {
    const { id, courseVersionId, createdAt, updatedAt, ...proofConfig } =
      publishedVersion.practicalProofConfig;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.coursePracticalProofConfig.create({
      data: {
        ...proofConfig,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  if (publishedVersion.reviewRecord) {
    const { id, courseVersionId, createdAt, updatedAt, ...reviewRecord } =
      publishedVersion.reviewRecord;
    void id;
    void courseVersionId;
    void createdAt;
    void updatedAt;
    await prisma.courseReviewRecord.create({
      data: {
        ...reviewRecord,
        courseVersionId: creatorVersion.id,
      },
    });
  }

  for (const sourceModule of publishedVersion.modules) {
    const courseModule = await prisma.courseModule.create({
      data: {
        versionId: creatorVersion.id,
        title: sourceModule.title,
        sortOrder: sourceModule.sortOrder,
      },
    });

    for (const sourceLesson of sourceModule.lessons) {
      const lesson = await prisma.courseLesson.create({
        data: {
          moduleId: courseModule.id,
          title: sourceLesson.title,
          sortOrder: sourceLesson.sortOrder,
        },
      });

      for (const sourceBlock of sourceLesson.blocks) {
        await prisma.lessonBlock.create({
          data: {
            lessonId: lesson.id,
            type: sourceBlock.type,
            sortOrder: sourceBlock.sortOrder,
            content: sourceBlock.content,
            origin: sourceBlock.origin,
            justification: sourceBlock.justification,
            purposeLink: sourceBlock.purposeLink,
          },
        });
      }
    }
  }

  for (const step of [
    "COURSE_SETUP",
    "DIAGNOSIS",
    "CAPACITY_MAP",
    "ACTION_MAP",
    "STORYBOARD",
    "BUILD",
    "PREVIEW",
    "CREATOR_REVIEW",
  ]) {
    await prisma.courseWorkflowStepRecord.create({
      data: {
        courseVersionId: creatorVersion.id,
        step,
        status: "COMPLETE",
        completedAt: now,
        updatedById: creatorId,
      },
    });
  }

  await prisma.courseWorkflowStepRecord.create({
    data: {
      courseVersionId: creatorVersion.id,
      step: "MONITORING",
      status: "LOCKED",
      lockedReason:
        "Monitoring uses the published v1.0 course version for this demo.",
      updatedById: creatorId,
    },
  });

  return creatorVersion;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

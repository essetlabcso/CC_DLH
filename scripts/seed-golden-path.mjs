import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCourse(organization, creatorUser, slug, title, status) {
  // Create Course
  const course = await prisma.course.create({
    data: {
      organizationId: organization.id,
      ownerId: creatorUser.id,
      title: title,
      slug: slug,
      status: "ACTIVE",
    },
  });

  // Create CourseVersion
  const version = await prisma.courseVersion.create({
    data: {
      courseId: course.id,
      createdById: creatorUser.id,
      versionNumber: 1,
      status: status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      submittedAt: status === "SUBMITTED" ? new Date() : null,
    },
  });

  // Seed CourseWorkflowStepRecord
  const steps = [
    "COURSE_SETUP",
    "DIAGNOSIS",
    "CAPACITY_MAP",
    "ACTION_MAP",
    "STORYBOARD",
    "BUILD",
    "PREVIEW",
    "CREATOR_REVIEW",
  ];

  for (const step of steps) {
    await prisma.courseWorkflowStepRecord.create({
      data: {
        courseVersionId: version.id,
        step: step,
        status: "COMPLETE",
        completedAt: new Date(),
        updatedById: creatorUser.id,
      },
    });
  }

  // Seed CourseSetup
  await prisma.courseSetup.create({
    data: {
      courseVersionId: version.id,
      title: title,
      summary: "A practical skill-building course for CSO staff to safely handle community feedback, especially sensitive or safeguarding-related comments.",
      primaryLearnerGroup: "MEAL staff and project managers",
      language: "English",
      formatAndTime: "Online self-paced, 2 hours",
      level: "Intermediate",
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      sensitiveFlag: false,
      certificateIntent: "YES_80_PERCENT_RULE",
    },
  });

  // Seed CourseDiagnosis
  await prisma.courseDiagnosis.create({
    data: {
      courseVersionId: version.id,
      surfaceRequest: "Requesting training for community feedback collection.",
      performanceEvidence: "Staff collect community feedback but lack a consistent safe process for classifying, escalating, and documenting sensitive feedback.",
      currentReality: "Feedback is collected ad-hoc with no encryption or clear escalation pathways.",
      desiredReality: "Consistent, secure, standardized feedback logging and classification.",
      affectedLearnerGroup: "CSO project staff",
    },
  });

  // Seed CourseCapacityMap
  await prisma.courseCapacityMap.create({
    data: {
      courseVersionId: version.id,
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      subarea: "Accountability and Community Feedback",
      capabilityFocus: "Skill to handle sensitive information safely",
      linkedStandard: "CHS Commitment 5",
      capacityOutcome: "CSO is capable of securely managing citizen feedback without exposing raw details.",
      diagnosisLink: "Community feedback handling gap",
      monitoringRelevance: "High",
    },
  });

  // Seed CourseActionMap
  await prisma.courseActionMap.create({
    data: {
      courseVersionId: version.id,
      capacityGoal: "Secure feedback log operationalized",
      individualLearnerOutcome: "Learners can classify feedback, redact sensitive details, and safely escalate safeguarding concerns.",
      observableActions: JSON.stringify(["Classify feedback types", "Apply redaction principles", "Trigger secure escalations"]),
      practiceScenarios: JSON.stringify(["Handling a sensitive disclosure", "Filing feedback logs safely"]),
      essentialInformation: JSON.stringify(["Redaction protocol", "Escalation directory"]),
    },
  });

  // Seed CourseStoryboard
  await prisma.courseStoryboard.create({
    data: {
      courseVersionId: version.id,
      lessonPlan: JSON.stringify(["Lesson 1: Introduction to Safe Feedback Handling", "Lesson 2: Redacting Sensitive Feedback Details", "Lesson 3: Final Knowledge & Skill Check"]),
      approvedForBuild: true,
    },
  });

  // Seed CourseDesignHandover
  await prisma.courseDesignHandover.create({
    data: {
      courseVersionId: version.id,
      coursePurpose: "To establish secure feedback handling practices.",
      performanceGoal: "Zero data exposure of feedback contributors.",
      status: "COMPLETE",
      lockedAt: new Date(),
      lockedById: creatorUser.id,
    },
  });

  // Seed CoursePracticalProofConfig
  await prisma.coursePracticalProofConfig.create({
    data: {
      courseVersionId: version.id,
      enabled: true,
      proofTitle: "Redacted Community Feedback Log Sample",
      proofPurpose: "To demonstrate the practical ability to redact citizen feedback logs before sharing reporting summaries.",
      acceptedProofType: "Work sample",
      submissionFormat: "Text template",
      instructions: "Paste a mock feedback log with sensitive details properly redacted using [REDACTED] tags.",
      safetyGuidance: "Do not upload real person names, locations, or sensitive community details.",
      reviewCriteria: "All personal names, identifying locations, and organizational details must be successfully redacted.",
      capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
      subCapacityArea: "Accountability and Community Feedback",
      linkedStandard: "CHS Commitment 5",
      capacityIndicator: "Feedback logs are safely redacted",
      visibilityDefault: "PRIVATE",
      donorVisibilityEnabled: false,
      certificateSeparationConfirmed: true,
    },
  });

  // Seed CourseMonitoringRecord (Only for PUBLISHED course version)
  if (status === "PUBLISHED") {
    await prisma.courseMonitoringRecord.create({
      data: {
        courseVersionId: version.id,
        signalSummary: JSON.stringify({}),
        improvementNotes: "",
      },
    });
  }

  // Seed Modules, Lessons, and Blocks
  const moduleRecord = await prisma.courseModule.create({
    data: {
      versionId: version.id,
      title: "Module 1: Core Feedback Safety",
      sortOrder: 1,
    },
  });

  const lesson1 = await prisma.courseLesson.create({
    data: {
      moduleId: moduleRecord.id,
      title: "Lesson 1: Introduction to Safe Feedback Handling",
      sortOrder: 1,
    },
  });

  await prisma.lessonBlock.create({
    data: {
      lessonId: lesson1.id,
      type: "TEXT",
      sortOrder: 1,
      content: JSON.stringify({
        title: "Introduction to Feedback Safety",
        purpose: "Introduce the core principles of feedback safety.",
        body: "Community feedback handling must be safe, confidential, and respectful of citizen privacy to prevent retaliation or harm.",
        linkedLearnerAction: "Classify feedback types",
        sourceStoryboardField: "learning flow",
        aiReviewStatus: "not-used",
        accessibilityNote: "Standard text content.",
        safeguardingNote: "Ensure feedback contributors are protected.",
        reviewReadinessNote: "Aligned with storyboard."
      }),
    },
  });

  const lesson2 = await prisma.courseLesson.create({
    data: {
      moduleId: moduleRecord.id,
      title: "Lesson 2: Redacting Sensitive Feedback Details",
      sortOrder: 2,
    },
  });

  await prisma.lessonBlock.create({
    data: {
      lessonId: lesson2.id,
      type: "TEXT",
      sortOrder: 1,
      content: JSON.stringify({
        title: "Redacting Sensitive Feedback Details",
        purpose: "Explain how and why to redact identifying information in feedback logs.",
        body: "Always redact names, phone numbers, and identifying locations using the standardized [REDACTED] tag inside feedback logs before compiling reporting summaries.",
        linkedLearnerAction: "Apply redaction principles",
        sourceStoryboardField: "learning flow",
        aiReviewStatus: "not-used",
        accessibilityNote: "Standard text content.",
        safeguardingNote: "Redact identifying information to protect citizen privacy.",
        reviewReadinessNote: "Aligned with storyboard."
      }),
    },
  });

  const lesson3 = await prisma.courseLesson.create({
    data: {
      moduleId: moduleRecord.id,
      title: "Lesson 3: Final Knowledge & Skill Assessment",
      sortOrder: 3,
    },
  });

  const testContent = {
    title: "Feedback Safety & Redaction Final Check",
    purpose: "Evaluate the learner's understanding of secure feedback protocols.",
    prompt: "Which of the following describes the correct secure protocol for handling highly sensitive citizen feedback before compiling organizational summaries?",
    choices: [
      "A) Publish all feedback logs publicly so all local CSOs can access them",
      "B) Redact all names, unique locations, and organizational indicators using standardized [REDACTED] tags",
      "C) Share original raw text feedback logs directly with external donors to prove transparency",
      "D) Avoid documenting any feedback in order to prevent data leaks completely"
    ],
    correctAnswer: "B",
    feedback: "Correct! Redacting all identifying markers using [REDACTED] is the mandatory safety protocol.",
    reviewReadinessNote: "Final test item stay linked to required learner action and uses the 80% pass and certificate rule.",
    aiReviewStatus: "not-used",
    accessibilityNote: "Screen-reader compatible single choice option.",
    safeguardingNote: "Ensures learner knows how to safely redact identifying data to prevent retaliation."
  };

  await prisma.lessonBlock.create({
    data: {
      lessonId: lesson3.id,
      type: "FINAL_TEST",
      sortOrder: 1,
      content: JSON.stringify(testContent),
    },
  });

  // Seed CourseReviewRecord (Only for SUBMITTED review-candidate course version)
  if (status === "SUBMITTED") {
    const handoverChecklist = {
      buildToReviewHandover: {
        generatedAt: new Date().toISOString(),
        courseTitle: title,
        certificateRule: "80%+ final test score = pass and automated course certificate",
        submissionType: "new",
        anchors: {
          capacityArea: "Monitoring, Evaluation, Accountability, and Learning",
          gap: "staff lack safe feedback classification/redaction/escalation process",
          route: "Skill"
        },
        summary: {
          moduleCount: 1,
          lessonCount: 3,
          totalBlocks: 3,
          requiredBlockCount: 2,
          creatorAddedBlockCount: 0
        },
        requiredBlocks: [
          {
            id: "block-lesson1-text",
            title: "Introduction to Feedback Safety",
            type: "Text",
            lessonTitle: "Lesson 1: Introduction to Safe Feedback Handling",
            purpose: "Introduce the core principles of feedback safety.",
            purposeLink: "Classify feedback types",
            aiReviewStatus: "AI not used",
            accessibilityNote: "Standard text content.",
            safeguardingNote: "Ensure feedback contributors are protected.",
            reviewReadinessNote: "Aligned with storyboard."
          },
          {
            id: "block-lesson2-text",
            title: "Redacting Sensitive Feedback Details",
            type: "Text",
            lessonTitle: "Lesson 2: Redacting Sensitive Feedback Details",
            purpose: "Explain how and why to redact identifying information in feedback logs.",
            purposeLink: "Apply redaction principles",
            aiReviewStatus: "AI not used",
            accessibilityNote: "Standard text content.",
            safeguardingNote: "Redact identifying information to protect citizen privacy.",
            reviewReadinessNote: "Aligned with storyboard."
          }
        ],
        creatorAddedBlocks: [],
        finalTest: {
          required: true,
          ready: true,
          questionCount: 1,
          summary: "Final test ready. 80%+ final test score = pass and automated course certificate."
        },
        aiReview: {
          status: "AI not used",
          pendingCount: 0,
          reviewedCount: 0,
          notUsedCount: 3
        },
        accessibility: {
          status: "Block-level notes present",
          blocksWithNotes: 2,
          blocksMissingNotes: 0
        },
        safeguarding: {
          status: "Block-level notes present",
          blocksWithNotes: 2,
          blocksMissingNotes: 0
        },
        preview: {
          completed: true,
          status: "complete"
        },
        creatorReview: {
          completed: true,
          status: "complete"
        },
        practicalProof: {
          enabled: true,
          ready: true,
          status: "Safely configured",
          blockers: []
        },
        blockingWarnings: [],
        reviewerAttentionItems: [
          "Final test is configured. Confirm it uses only taught content and preserves: 80%+ final test score = pass and automated course certificate.",
          "Optional practical proof is safely configured and remains separate from the course certificate."
        ]
      }
    };

    await prisma.courseReviewRecord.create({
      data: {
        courseVersionId: version.id,
        checklist: JSON.stringify(handoverChecklist),
        decisionNotes: "",
        returnedReason: ""
      }
    });
  }

  console.log(`Seeded Course [${title}] ID:`, course.id);
  console.log(`Seeded Course Version ID:`, version.id);
}

async function main() {
  const isSeedEnabled = process.env.ENABLE_DEMO_SEED === "true";

  if (!isSeedEnabled) {
    console.log("ENABLE_DEMO_SEED is not set to 'true'. Skipping golden path course seeding.");
    return;
  }

  console.log("Seeding golden path course: 'Safe Community Feedback Handling for Local CSOs'...");

  // 1. Find or create the default organization
  const orgSlug = "dec-local";
  const organization = await prisma.organization.upsert({
    where: { slug: orgSlug },
    update: {
      name: "DEC Local Development",
      organizationType: "Inter-governmental",
      status: "ACTIVE",
    },
    create: {
      name: "DEC Local Development",
      slug: orgSlug,
      organizationType: "Inter-governmental",
      status: "ACTIVE",
    },
  });

  // 2. Pre-seed all demo users
  const demoUsers = [
    { email: "creator@dec.local", name: "DEC Course Creator", role: "CREATOR" },
    { email: "admin@dec.local", name: "DEC Admin", role: "ADMIN" },
    { email: "reviewer@dec.local", name: "DEC Reviewer", role: "REVIEWER" },
    { email: "learner@dec.local", name: "DEC Learner", role: "LEARNER" },
  ];

  const usersMap = {};

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: {
        organizationId_email: {
          organizationId: organization.id,
          email: demoUser.email,
        },
      },
      update: {
        name: demoUser.name,
        status: "ACTIVE",
      },
      create: {
        organizationId: organization.id,
        email: demoUser.email,
        name: demoUser.name,
        status: "ACTIVE",
      },
    });

    usersMap[demoUser.role] = user;

    const membership = await prisma.organizationMembership.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        organizationId: organization.id,
        userId: user.id,
        status: "ACTIVE",
      },
    });

    await prisma.membershipRoleAssignment.upsert({
      where: {
        membershipId_role: {
          membershipId: membership.id,
          role: demoUser.role,
        },
      },
      update: {},
      create: {
        membershipId: membership.id,
        role: demoUser.role,
      },
    });
  }

  const creatorUser = usersMap["CREATOR"];

  // 3. Make seed idempotent by removing existing golden path courses if present
  const courseSlug = "safe-community-feedback-handling";
  const reviewCourseSlug = "safe-community-feedback-handling-review";
  await prisma.course.deleteMany({
    where: {
      organizationId: organization.id,
      slug: { in: [courseSlug, reviewCourseSlug] },
    },
  });

  // 4. Create Published Golden Path course
  await seedCourse(
    organization,
    creatorUser,
    courseSlug,
    "Safe Community Feedback Handling for Local CSOs",
    "PUBLISHED"
  );

  // 5. Create Submitted Golden Path course (Review Candidate)
  await seedCourse(
    organization,
    creatorUser,
    reviewCourseSlug,
    "Safe Community Feedback Handling for Local CSOs (Review Candidate)",
    "SUBMITTED"
  );

  console.log("Golden path seeding successfully completed!");
}

main()
  .catch((e) => {
    console.error("Error during golden path seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

CREATE TABLE "CourseDesignHandover" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseVersionId" TEXT NOT NULL,
  "coursePurpose" TEXT NOT NULL DEFAULT '',
  "performanceGoal" TEXT NOT NULL DEFAULT '',
  "learningPathway" TEXT NOT NULL DEFAULT '',
  "approvedBlockSequence" TEXT NOT NULL DEFAULT '',
  "practiceStrategy" TEXT NOT NULL DEFAULT '',
  "assessmentStrategy" TEXT NOT NULL DEFAULT '',
  "accessibilityRequirements" TEXT NOT NULL DEFAULT '',
  "safeguards" TEXT NOT NULL DEFAULT '',
  "aiAuthoringBoundaries" TEXT NOT NULL DEFAULT '',
  "evaluationAnchor" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "lockedAt" DATETIME,
  "lockedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CourseDesignHandover_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CourseDesignHandover_courseVersionId_key" ON "CourseDesignHandover"("courseVersionId");
CREATE INDEX "CourseDesignHandover_status_idx" ON "CourseDesignHandover"("status");
CREATE INDEX "CourseDesignHandover_lockedById_idx" ON "CourseDesignHandover"("lockedById");

INSERT INTO "CourseDesignHandover" (
  "id",
  "courseVersionId",
  "coursePurpose",
  "performanceGoal",
  "learningPathway",
  "approvedBlockSequence",
  "practiceStrategy",
  "assessmentStrategy",
  "accessibilityRequirements",
  "safeguards",
  "aiAuthoringBoundaries",
  "evaluationAnchor",
  "status",
  "lockedAt",
  "lockedById",
  "createdAt",
  "updatedAt"
)
SELECT
  'design_handover_' || "CourseStoryboard"."id",
  "CourseStoryboard"."courseVersionId",
  COALESCE("CourseActionMap"."capacityGoal", ''),
  COALESCE("CourseActionMap"."individualLearnerOutcome", ''),
  CASE
    WHEN "CourseStoryboard"."lessonPlan" LIKE '%urgent-job-aid%' THEN 'Urgent job aid'
    WHEN "CourseStoryboard"."lessonPlan" LIKE '%scenario%' THEN 'Scenario-based practice'
    WHEN "CourseStoryboard"."lessonPlan" LIKE '%practice%' THEN 'Guided practice'
    ELSE 'Structured lesson pathway'
  END,
  "CourseStoryboard"."lessonPlan",
  COALESCE("CourseActionMap"."practiceScenarios", ''),
  'Use the planned knowledge check or learner output from Storyboard.',
  'Use the accessibility note carried in Storyboard.',
  COALESCE("CourseAnalysisHandover"."safeguardsNote", ''),
  COALESCE("CourseStoryboard"."aiHandoffNotes", ''),
  COALESCE("CourseAnalysisHandover"."evaluationAnchor", ''),
  'LOCKED',
  CURRENT_TIMESTAMP,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "CourseStoryboard"
LEFT JOIN "CourseActionMap" ON "CourseActionMap"."courseVersionId" = "CourseStoryboard"."courseVersionId"
LEFT JOIN "CourseAnalysisHandover" ON "CourseAnalysisHandover"."courseVersionId" = "CourseStoryboard"."courseVersionId"
WHERE
  "CourseStoryboard"."approvedForBuild" = 1
  AND NOT EXISTS (
    SELECT 1 FROM "CourseDesignHandover"
    WHERE "CourseDesignHandover"."courseVersionId" = "CourseStoryboard"."courseVersionId"
  );

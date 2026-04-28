CREATE TABLE "CourseAnalysisHandover" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseVersionId" TEXT NOT NULL,
  "validatedCapacityGap" TEXT NOT NULL DEFAULT '',
  "baseline" TEXT NOT NULL DEFAULT '',
  "desiredPractice" TEXT NOT NULL DEFAULT '',
  "rootCauseSummary" TEXT NOT NULL DEFAULT '',
  "ksmeRoute" TEXT NOT NULL DEFAULT '',
  "separableKnowledgeSkillComponent" TEXT NOT NULL DEFAULT '',
  "interventionDecision" TEXT NOT NULL DEFAULT '',
  "safeguardsNote" TEXT NOT NULL DEFAULT '',
  "evaluationAnchor" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "lockedAt" DATETIME,
  "lockedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CourseAnalysisHandover_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CourseAnalysisHandover_courseVersionId_key" ON "CourseAnalysisHandover"("courseVersionId");
CREATE INDEX "CourseAnalysisHandover_status_idx" ON "CourseAnalysisHandover"("status");
CREATE INDEX "CourseAnalysisHandover_lockedById_idx" ON "CourseAnalysisHandover"("lockedById");

INSERT INTO "CourseAnalysisHandover" (
  "id",
  "courseVersionId",
  "validatedCapacityGap",
  "baseline",
  "desiredPractice",
  "rootCauseSummary",
  "ksmeRoute",
  "separableKnowledgeSkillComponent",
  "interventionDecision",
  "safeguardsNote",
  "evaluationAnchor",
  "status",
  "lockedAt",
  "lockedById",
  "createdAt",
  "updatedAt"
)
SELECT
  'analysis_handover_' || "CourseDiagnosis"."id",
  "CourseDiagnosis"."courseVersionId",
  "CourseDiagnosis"."performanceEvidence",
  "CourseDiagnosis"."currentReality",
  "CourseDiagnosis"."desiredReality",
  "CourseDiagnosis"."surfaceRequest",
  "CourseDiagnosis"."ksmeGap",
  '',
  "CourseDiagnosis"."courseFitDecision",
  CASE
    WHEN "CourseSetup"."sensitiveFlag" = 1 THEN 'Sensitive course flag carried from Course Setup.'
    ELSE 'No special safeguard recorded during backfill.'
  END,
  "CourseCapacityMap"."monitoringRelevance",
  'LOCKED',
  CURRENT_TIMESTAMP,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "CourseDiagnosis"
LEFT JOIN "CourseVersion" ON "CourseVersion"."id" = "CourseDiagnosis"."courseVersionId"
LEFT JOIN "CourseSetup" ON "CourseSetup"."courseVersionId" = "CourseDiagnosis"."courseVersionId"
LEFT JOIN "CourseCapacityMap" ON "CourseCapacityMap"."courseVersionId" = "CourseDiagnosis"."courseVersionId"
WHERE
  "CourseDiagnosis"."courseFitDecision" = 'course-fit'
  AND "CourseDiagnosis"."ksmeGap" IN ('knowledge', 'skill')
  AND NOT EXISTS (
    SELECT 1 FROM "CourseAnalysisHandover"
    WHERE "CourseAnalysisHandover"."courseVersionId" = "CourseDiagnosis"."courseVersionId"
  );

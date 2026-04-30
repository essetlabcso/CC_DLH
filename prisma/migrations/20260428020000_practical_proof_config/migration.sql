CREATE TABLE "CoursePracticalProofConfig" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseVersionId" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "proofTitle" TEXT NOT NULL DEFAULT '',
  "proofPurpose" TEXT NOT NULL DEFAULT '',
  "acceptedProofType" TEXT NOT NULL DEFAULT '',
  "submissionFormat" TEXT NOT NULL DEFAULT '',
  "instructions" TEXT NOT NULL DEFAULT '',
  "safetyGuidance" TEXT NOT NULL DEFAULT '',
  "reviewCriteria" TEXT NOT NULL DEFAULT '',
  "capacityArea" TEXT NOT NULL DEFAULT '',
  "subCapacityArea" TEXT NOT NULL DEFAULT '',
  "linkedStandard" TEXT NOT NULL DEFAULT '',
  "capacityIndicator" TEXT NOT NULL DEFAULT '',
  "visibilityDefault" TEXT NOT NULL DEFAULT 'PRIVATE',
  "donorVisibilityEnabled" BOOLEAN NOT NULL DEFAULT false,
  "certificateSeparationConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "specialistReviewRequired" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CoursePracticalProofConfig_courseVersionId_fkey"
    FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CoursePracticalProofConfig_courseVersionId_key"
  ON "CoursePracticalProofConfig"("courseVersionId");

CREATE INDEX "CoursePracticalProofConfig_enabled_idx"
  ON "CoursePracticalProofConfig"("enabled");

CREATE INDEX "CoursePracticalProofConfig_visibilityDefault_idx"
  ON "CoursePracticalProofConfig"("visibilityDefault");

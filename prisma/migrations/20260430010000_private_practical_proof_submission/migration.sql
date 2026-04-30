CREATE TABLE "LearnerPracticalProofSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseVersionId" TEXT NOT NULL,
  "practicalProofConfigId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
  "visibilityDefault" TEXT NOT NULL DEFAULT 'PRIVATE',
  "proofText" TEXT NOT NULL DEFAULT '',
  "evidenceLink" TEXT NOT NULL DEFAULT '',
  "safetyAcknowledged" BOOLEAN NOT NULL DEFAULT false,
  "certificateSeparationAcknowledged" BOOLEAN NOT NULL DEFAULT false,
  "donorVisibilityConsent" BOOLEAN NOT NULL DEFAULT false,
  "aiVerificationUsed" BOOLEAN NOT NULL DEFAULT false,
  "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "LearnerPracticalProofSubmission_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerPracticalProofSubmission_courseVersionId_fkey"
    FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerPracticalProofSubmission_practicalProofConfigId_fkey"
    FOREIGN KEY ("practicalProofConfigId") REFERENCES "CoursePracticalProofConfig" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LearnerPracticalProofSubmission_userId_courseVersionId_practicalProofConfigId_key"
  ON "LearnerPracticalProofSubmission"("userId", "courseVersionId", "practicalProofConfigId");

CREATE INDEX "LearnerPracticalProofSubmission_userId_idx"
  ON "LearnerPracticalProofSubmission"("userId");

CREATE INDEX "LearnerPracticalProofSubmission_courseVersionId_idx"
  ON "LearnerPracticalProofSubmission"("courseVersionId");

CREATE INDEX "LearnerPracticalProofSubmission_practicalProofConfigId_idx"
  ON "LearnerPracticalProofSubmission"("practicalProofConfigId");

CREATE INDEX "LearnerPracticalProofSubmission_status_idx"
  ON "LearnerPracticalProofSubmission"("status");

CREATE INDEX "LearnerPracticalProofSubmission_visibilityDefault_idx"
  ON "LearnerPracticalProofSubmission"("visibilityDefault");

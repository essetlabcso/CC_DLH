CREATE TABLE "LearnerVerifiedAchievement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseVersionId" TEXT NOT NULL,
  "practicalProofConfigId" TEXT NOT NULL,
  "proofSubmissionId" TEXT NOT NULL,
  "issuedById" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "capacityArea" TEXT NOT NULL DEFAULT '',
  "subCapacityArea" TEXT NOT NULL DEFAULT '',
  "linkedStandard" TEXT NOT NULL DEFAULT '',
  "capacityIndicator" TEXT NOT NULL DEFAULT '',
  "proofType" TEXT NOT NULL DEFAULT '',
  "verificationDecision" TEXT NOT NULL DEFAULT 'ACCEPTED',
  "verificationNote" TEXT NOT NULL DEFAULT '',
  "visibilityDefault" TEXT NOT NULL DEFAULT 'PRIVATE',
  "donorVisibilityEnabled" BOOLEAN NOT NULL DEFAULT false,
  "publicBadgeEnabled" BOOLEAN NOT NULL DEFAULT false,
  "badgeVisualIssued" BOOLEAN NOT NULL DEFAULT false,
  "aiIssued" BOOLEAN NOT NULL DEFAULT false,
  "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "LearnerVerifiedAchievement_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerVerifiedAchievement_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerVerifiedAchievement_courseVersionId_fkey"
    FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerVerifiedAchievement_practicalProofConfigId_fkey"
    FOREIGN KEY ("practicalProofConfigId") REFERENCES "CoursePracticalProofConfig" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerVerifiedAchievement_proofSubmissionId_fkey"
    FOREIGN KEY ("proofSubmissionId") REFERENCES "LearnerPracticalProofSubmission" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerVerifiedAchievement_issuedById_fkey"
    FOREIGN KEY ("issuedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LearnerVerifiedAchievement_proofSubmissionId_key"
  ON "LearnerVerifiedAchievement"("proofSubmissionId");

CREATE INDEX "LearnerVerifiedAchievement_organizationId_idx"
  ON "LearnerVerifiedAchievement"("organizationId");

CREATE INDEX "LearnerVerifiedAchievement_userId_issuedAt_idx"
  ON "LearnerVerifiedAchievement"("userId", "issuedAt");

CREATE INDEX "LearnerVerifiedAchievement_courseVersionId_idx"
  ON "LearnerVerifiedAchievement"("courseVersionId");

CREATE INDEX "LearnerVerifiedAchievement_practicalProofConfigId_idx"
  ON "LearnerVerifiedAchievement"("practicalProofConfigId");

CREATE INDEX "LearnerVerifiedAchievement_issuedById_idx"
  ON "LearnerVerifiedAchievement"("issuedById");

CREATE INDEX "LearnerVerifiedAchievement_capacityArea_idx"
  ON "LearnerVerifiedAchievement"("capacityArea");

CREATE INDEX "LearnerVerifiedAchievement_visibilityDefault_idx"
  ON "LearnerVerifiedAchievement"("visibilityDefault");

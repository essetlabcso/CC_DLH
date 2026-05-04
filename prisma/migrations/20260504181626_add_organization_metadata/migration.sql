/*
  Warnings:

  - You are about to drop the `UserRoleAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "UserRoleAssignment_userId_role_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserRoleAssignment";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LearnerPracticalProofSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "practicalProofConfigId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "visibilityDefault" TEXT NOT NULL DEFAULT 'PRIVATE',
    "proofText" TEXT NOT NULL DEFAULT '',
    "evidenceLink" TEXT NOT NULL DEFAULT '',
    "safetyAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "certificateSeparationAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "donorVisibilityConsent" BOOLEAN NOT NULL DEFAULT false,
    "aiVerificationUsed" BOOLEAN NOT NULL DEFAULT false,
    "learnerFeedback" TEXT NOT NULL DEFAULT '',
    "internalReviewNote" TEXT NOT NULL DEFAULT '',
    "requiredAction" TEXT NOT NULL DEFAULT '',
    "reviewChecklist" TEXT NOT NULL DEFAULT '{}',
    "redactionRequired" BOOLEAN NOT NULL DEFAULT false,
    "specialistReviewRequired" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" DATETIME,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearnerPracticalProofSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerPracticalProofSubmission_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerPracticalProofSubmission_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerPracticalProofSubmission_practicalProofConfigId_fkey" FOREIGN KEY ("practicalProofConfigId") REFERENCES "CoursePracticalProofConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LearnerPracticalProofSubmission" ("aiVerificationUsed", "certificateSeparationAcknowledged", "courseVersionId", "createdAt", "donorVisibilityConsent", "evidenceLink", "id", "internalReviewNote", "learnerFeedback", "practicalProofConfigId", "proofText", "redactionRequired", "requiredAction", "reviewChecklist", "reviewedAt", "reviewerId", "safetyAcknowledged", "specialistReviewRequired", "status", "submittedAt", "updatedAt", "userId", "visibilityDefault") SELECT "aiVerificationUsed", "certificateSeparationAcknowledged", "courseVersionId", "createdAt", "donorVisibilityConsent", "evidenceLink", "id", "internalReviewNote", "learnerFeedback", "practicalProofConfigId", "proofText", "redactionRequired", "requiredAction", "reviewChecklist", "reviewedAt", "reviewerId", "safetyAcknowledged", "specialistReviewRequired", "status", "submittedAt", "updatedAt", "userId", "visibilityDefault" FROM "LearnerPracticalProofSubmission";
DROP TABLE "LearnerPracticalProofSubmission";
ALTER TABLE "new_LearnerPracticalProofSubmission" RENAME TO "LearnerPracticalProofSubmission";
CREATE INDEX "LearnerPracticalProofSubmission_userId_idx" ON "LearnerPracticalProofSubmission"("userId");
CREATE INDEX "LearnerPracticalProofSubmission_reviewerId_idx" ON "LearnerPracticalProofSubmission"("reviewerId");
CREATE INDEX "LearnerPracticalProofSubmission_courseVersionId_idx" ON "LearnerPracticalProofSubmission"("courseVersionId");
CREATE INDEX "LearnerPracticalProofSubmission_practicalProofConfigId_idx" ON "LearnerPracticalProofSubmission"("practicalProofConfigId");
CREATE INDEX "LearnerPracticalProofSubmission_status_idx" ON "LearnerPracticalProofSubmission"("status");
CREATE INDEX "LearnerPracticalProofSubmission_visibilityDefault_idx" ON "LearnerPracticalProofSubmission"("visibilityDefault");
CREATE UNIQUE INDEX "LearnerPracticalProofSubmission_userId_courseVersionId_practicalProofConfigId_key" ON "LearnerPracticalProofSubmission"("userId", "courseVersionId", "practicalProofConfigId");
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "organizationType" TEXT,
    "geographicFocus" TEXT,
    "description" TEXT,
    "contactEmail" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Organization" ("createdAt", "id", "name", "slug", "updatedAt") SELECT "createdAt", "id", "name", "slug", "updatedAt" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

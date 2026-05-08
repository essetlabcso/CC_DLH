-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "accessMode" TEXT NOT NULL DEFAULT 'MEMBER_CSO_ONLY',
    "publicCatalogVisible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("createdAt", "id", "organizationId", "ownerId", "slug", "status", "title", "updatedAt") SELECT "createdAt", "id", "organizationId", "ownerId", "slug", "status", "title", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE INDEX "Course_organizationId_idx" ON "Course"("organizationId");
CREATE INDEX "Course_ownerId_idx" ON "Course"("ownerId");
CREATE UNIQUE INDEX "Course_organizationId_slug_key" ON "Course"("organizationId", "slug");
CREATE TABLE "new_CourseSetup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "primaryLearnerGroup" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'English',
    "formatAndTime" TEXT NOT NULL DEFAULT '',
    "level" TEXT NOT NULL DEFAULT '',
    "capacityArea" TEXT NOT NULL DEFAULT '',
    "sensitiveFlag" BOOLEAN NOT NULL DEFAULT false,
    "certificateIntent" TEXT NOT NULL DEFAULT '',
    "learnerReality" TEXT NOT NULL DEFAULT '{}',
    "selectedDiagnosisDatasetId" TEXT,
    "selectedDiagnosisRecordId" TEXT,
    "diagnosisSnapshot" TEXT NOT NULL DEFAULT '{}',
    "accessMode" TEXT NOT NULL DEFAULT 'MEMBER_CSO_ONLY',
    "targetLearnerType" TEXT NOT NULL DEFAULT 'MEMBER_CSO',
    "deliveryMode" TEXT NOT NULL DEFAULT 'SELF_PACED',
    "enrollmentMode" TEXT NOT NULL DEFAULT 'SELF_ENROLL',
    "publicCatalogVisible" BOOLEAN NOT NULL DEFAULT false,
    "memberCatalogVisible" BOOLEAN NOT NULL DEFAULT true,
    "certificateEnabled" BOOLEAN NOT NULL DEFAULT true,
    "practicalProofEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requiresProgramAssignment" BOOLEAN NOT NULL DEFAULT false,
    "requiresCohortAssignment" BOOLEAN NOT NULL DEFAULT false,
    "defaultDueDays" INTEGER,
    "accessRestrictionNote" TEXT NOT NULL DEFAULT '',
    "learnerVisibilitySummary" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseSetup_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseSetup_selectedDiagnosisDatasetId_fkey" FOREIGN KEY ("selectedDiagnosisDatasetId") REFERENCES "diagnosis_datasets" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CourseSetup_selectedDiagnosisRecordId_fkey" FOREIGN KEY ("selectedDiagnosisRecordId") REFERENCES "diagnosis_records" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CourseSetup" ("capacityArea", "certificateIntent", "courseVersionId", "createdAt", "diagnosisSnapshot", "formatAndTime", "id", "language", "learnerReality", "level", "primaryLearnerGroup", "selectedDiagnosisDatasetId", "selectedDiagnosisRecordId", "sensitiveFlag", "summary", "title", "updatedAt") SELECT "capacityArea", "certificateIntent", "courseVersionId", "createdAt", "diagnosisSnapshot", "formatAndTime", "id", "language", "learnerReality", "level", "primaryLearnerGroup", "selectedDiagnosisDatasetId", "selectedDiagnosisRecordId", "sensitiveFlag", "summary", "title", "updatedAt" FROM "CourseSetup";
DROP TABLE "CourseSetup";
ALTER TABLE "new_CourseSetup" RENAME TO "CourseSetup";
CREATE UNIQUE INDEX "CourseSetup_courseVersionId_key" ON "CourseSetup"("courseVersionId");
CREATE INDEX "CourseSetup_selectedDiagnosisDatasetId_idx" ON "CourseSetup"("selectedDiagnosisDatasetId");
CREATE INDEX "CourseSetup_selectedDiagnosisRecordId_idx" ON "CourseSetup"("selectedDiagnosisRecordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

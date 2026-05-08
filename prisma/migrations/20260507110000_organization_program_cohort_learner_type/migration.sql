-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "ownerOrganizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Program_ownerOrganizationId_fkey" FOREIGN KEY ("ownerOrganizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgramOrganization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgramOrganization_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "deliveryNotes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cohort_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cohort_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CohortCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" DATETIME,
    "dueAt" DATETIME,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CohortCourse_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CohortCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CohortCourse_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScopedRoleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL DEFAULT '',
    "organizationId" TEXT,
    "courseId" TEXT,
    "courseVersionId" TEXT,
    "proofSubmissionId" TEXT,
    "programId" TEXT,
    "cohortId" TEXT,
    "reviewTrack" TEXT,
    "capacityArea" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startsAt" DATETIME,
    "expiresAt" DATETIME,
    "createdById" TEXT,
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScopedRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_proofSubmissionId_fkey" FOREIGN KEY ("proofSubmissionId") REFERENCES "LearnerPracticalProofSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScopedRoleAssignment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ScopedRoleAssignment" ("capacityArea", "courseId", "courseVersionId", "createdAt", "createdById", "expiresAt", "id", "organizationId", "proofSubmissionId", "reason", "reviewTrack", "roleKey", "scopeId", "scopeType", "startsAt", "status", "updatedAt", "userId") SELECT "capacityArea", "courseId", "courseVersionId", "createdAt", "createdById", "expiresAt", "id", "organizationId", "proofSubmissionId", "reason", "reviewTrack", "roleKey", "scopeId", "scopeType", "startsAt", "status", "updatedAt", "userId" FROM "ScopedRoleAssignment";
DROP TABLE "ScopedRoleAssignment";
ALTER TABLE "new_ScopedRoleAssignment" RENAME TO "ScopedRoleAssignment";
CREATE INDEX "ScopedRoleAssignment_userId_status_idx" ON "ScopedRoleAssignment"("userId", "status");
CREATE INDEX "ScopedRoleAssignment_roleKey_status_idx" ON "ScopedRoleAssignment"("roleKey", "status");
CREATE INDEX "ScopedRoleAssignment_scopeType_scopeId_idx" ON "ScopedRoleAssignment"("scopeType", "scopeId");
CREATE INDEX "ScopedRoleAssignment_organizationId_idx" ON "ScopedRoleAssignment"("organizationId");
CREATE INDEX "ScopedRoleAssignment_courseId_idx" ON "ScopedRoleAssignment"("courseId");
CREATE INDEX "ScopedRoleAssignment_courseVersionId_idx" ON "ScopedRoleAssignment"("courseVersionId");
CREATE INDEX "ScopedRoleAssignment_proofSubmissionId_idx" ON "ScopedRoleAssignment"("proofSubmissionId");
CREATE INDEX "ScopedRoleAssignment_programId_idx" ON "ScopedRoleAssignment"("programId");
CREATE INDEX "ScopedRoleAssignment_cohortId_idx" ON "ScopedRoleAssignment"("cohortId");
CREATE INDEX "ScopedRoleAssignment_createdById_idx" ON "ScopedRoleAssignment"("createdById");
CREATE INDEX "ScopedRoleAssignment_reviewTrack_idx" ON "ScopedRoleAssignment"("reviewTrack");
CREATE INDEX "ScopedRoleAssignment_capacityArea_idx" ON "ScopedRoleAssignment"("capacityArea");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Program_code_key" ON "Program"("code");

-- CreateIndex
CREATE INDEX "Program_status_idx" ON "Program"("status");

-- CreateIndex
CREATE INDEX "Program_ownerOrganizationId_idx" ON "Program"("ownerOrganizationId");

-- CreateIndex
CREATE INDEX "ProgramOrganization_organizationId_idx" ON "ProgramOrganization"("organizationId");

-- CreateIndex
CREATE INDEX "ProgramOrganization_status_idx" ON "ProgramOrganization"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramOrganization_programId_organizationId_key" ON "ProgramOrganization"("programId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_slug_key" ON "Cohort"("slug");

-- CreateIndex
CREATE INDEX "Cohort_programId_idx" ON "Cohort"("programId");

-- CreateIndex
CREATE INDEX "Cohort_organizationId_idx" ON "Cohort"("organizationId");

-- CreateIndex
CREATE INDEX "Cohort_status_idx" ON "Cohort"("status");

-- CreateIndex
CREATE INDEX "CohortCourse_courseId_idx" ON "CohortCourse"("courseId");

-- CreateIndex
CREATE INDEX "CohortCourse_courseVersionId_idx" ON "CohortCourse"("courseVersionId");

-- CreateIndex
CREATE INDEX "CohortCourse_displayOrder_idx" ON "CohortCourse"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CohortCourse_cohortId_courseId_courseVersionId_key" ON "CohortCourse"("cohortId", "courseId", "courseVersionId");

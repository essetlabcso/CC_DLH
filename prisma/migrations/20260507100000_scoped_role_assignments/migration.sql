-- CreateTable
CREATE TABLE "ScopedRoleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL DEFAULT '',
    "organizationId" TEXT,
    "courseId" TEXT,
    "courseVersionId" TEXT,
    "proofSubmissionId" TEXT,
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
    CONSTRAINT "ScopedRoleAssignment_proofSubmissionId_fkey" FOREIGN KEY ("proofSubmissionId") REFERENCES "LearnerPracticalProofSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_userId_status_idx" ON "ScopedRoleAssignment"("userId", "status");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_roleKey_status_idx" ON "ScopedRoleAssignment"("roleKey", "status");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_scopeType_scopeId_idx" ON "ScopedRoleAssignment"("scopeType", "scopeId");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_organizationId_idx" ON "ScopedRoleAssignment"("organizationId");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_courseId_idx" ON "ScopedRoleAssignment"("courseId");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_courseVersionId_idx" ON "ScopedRoleAssignment"("courseVersionId");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_proofSubmissionId_idx" ON "ScopedRoleAssignment"("proofSubmissionId");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_createdById_idx" ON "ScopedRoleAssignment"("createdById");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_reviewTrack_idx" ON "ScopedRoleAssignment"("reviewTrack");

-- CreateIndex
CREATE INDEX "ScopedRoleAssignment_capacityArea_idx" ON "ScopedRoleAssignment"("capacityArea");

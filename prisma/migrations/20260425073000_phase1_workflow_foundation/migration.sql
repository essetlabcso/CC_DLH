-- Membership-aware role model.
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MembershipRoleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "membershipId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MembershipRoleAssignment_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "OrganizationMembership" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "OrganizationMembership" ("id", "organizationId", "userId", "status", "createdAt", "updatedAt")
SELECT 'membership_' || "User"."id" || '_' || "User"."organizationId",
       "User"."organizationId",
       "User"."id",
       'ACTIVE',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM "User"
WHERE NOT EXISTS (
    SELECT 1
    FROM "OrganizationMembership"
    WHERE "OrganizationMembership"."organizationId" = "User"."organizationId"
      AND "OrganizationMembership"."userId" = "User"."id"
);

INSERT INTO "MembershipRoleAssignment" ("id", "membershipId", "role", "createdAt")
SELECT 'membership_role_' || "UserRoleAssignment"."id",
       'membership_' || "User"."id" || '_' || "User"."organizationId",
       "UserRoleAssignment"."role",
       "UserRoleAssignment"."createdAt"
FROM "UserRoleAssignment"
JOIN "User" ON "User"."id" = "UserRoleAssignment"."userId"
WHERE NOT EXISTS (
    SELECT 1
    FROM "MembershipRoleAssignment"
    WHERE "MembershipRoleAssignment"."membershipId" = 'membership_' || "User"."id" || '_' || "User"."organizationId"
      AND "MembershipRoleAssignment"."role" = "UserRoleAssignment"."role"
);

CREATE INDEX "OrganizationMembership_userId_idx" ON "OrganizationMembership"("userId");
CREATE INDEX "OrganizationMembership_organizationId_idx" ON "OrganizationMembership"("organizationId");
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_userId_key" ON "OrganizationMembership"("organizationId", "userId");
CREATE INDEX "MembershipRoleAssignment_membershipId_idx" ON "MembershipRoleAssignment"("membershipId");
CREATE UNIQUE INDEX "MembershipRoleAssignment_membershipId_role_key" ON "MembershipRoleAssignment"("membershipId", "role");

-- Version-safe lifecycle expansion.
ALTER TABLE "CourseVersion" ADD COLUMN "sourceVersionId" TEXT REFERENCES "CourseVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CourseVersion" ADD COLUMN "creatorReviewReadyAt" DATETIME;
ALTER TABLE "CourseVersion" ADD COLUMN "returnedAt" DATETIME;
ALTER TABLE "CourseVersion" ADD COLUMN "replacedAt" DATETIME;
CREATE INDEX "CourseVersion_sourceVersionId_idx" ON "CourseVersion"("sourceVersionId");

-- Structured workflow records.
CREATE TABLE "CourseWorkflowStepRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "lockedReason" TEXT,
    "completedAt" DATETIME,
    "updatedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseWorkflowStepRecord_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseWorkflowStepRecord_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "CourseSetup" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseSetup_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseDiagnosis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "surfaceRequest" TEXT NOT NULL DEFAULT '',
    "performanceEvidence" TEXT NOT NULL DEFAULT '',
    "currentReality" TEXT NOT NULL DEFAULT '',
    "desiredReality" TEXT NOT NULL DEFAULT '',
    "affectedLearnerGroup" TEXT NOT NULL DEFAULT '',
    "evidenceSources" TEXT NOT NULL DEFAULT '{}',
    "ksmeGap" TEXT NOT NULL DEFAULT '',
    "courseFitDecision" TEXT NOT NULL DEFAULT '',
    "alternativeIntervention" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseDiagnosis_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseCapacityMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "capacityArea" TEXT NOT NULL DEFAULT '',
    "subarea" TEXT NOT NULL DEFAULT '',
    "capabilityFocus" TEXT NOT NULL DEFAULT '',
    "linkedStandard" TEXT NOT NULL DEFAULT '',
    "capacityOutcome" TEXT NOT NULL DEFAULT '',
    "diagnosisLink" TEXT NOT NULL DEFAULT '',
    "monitoringRelevance" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseCapacityMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseActionMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "capacityGoal" TEXT NOT NULL DEFAULT '',
    "individualLearnerOutcome" TEXT NOT NULL DEFAULT '',
    "observableActions" TEXT NOT NULL DEFAULT '[]',
    "practiceScenarios" TEXT NOT NULL DEFAULT '[]',
    "essentialInformation" TEXT NOT NULL DEFAULT '[]',
    "difMatrix" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseActionMap_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseStoryboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "lessonPlan" TEXT NOT NULL DEFAULT '[]',
    "aiHandoffNotes" TEXT NOT NULL DEFAULT '',
    "approvedForBuild" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseStoryboard_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseReviewRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "checklist" TEXT NOT NULL DEFAULT '{}',
    "decisionNotes" TEXT NOT NULL DEFAULT '',
    "returnedReason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseReviewRecord_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CourseReviewRecord_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "CourseMonitoringRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "signalSummary" TEXT NOT NULL DEFAULT '{}',
    "improvementNotes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseMonitoringRecord_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "CourseRevisionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseVersionId" TEXT NOT NULL,
    "sourceVersionId" TEXT,
    "revisionReason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CourseRevisionRecord_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CourseWorkflowStepRecord_courseVersionId_status_idx" ON "CourseWorkflowStepRecord"("courseVersionId", "status");
CREATE INDEX "CourseWorkflowStepRecord_updatedById_idx" ON "CourseWorkflowStepRecord"("updatedById");
CREATE UNIQUE INDEX "CourseWorkflowStepRecord_courseVersionId_step_key" ON "CourseWorkflowStepRecord"("courseVersionId", "step");
CREATE UNIQUE INDEX "CourseSetup_courseVersionId_key" ON "CourseSetup"("courseVersionId");
CREATE UNIQUE INDEX "CourseDiagnosis_courseVersionId_key" ON "CourseDiagnosis"("courseVersionId");
CREATE UNIQUE INDEX "CourseCapacityMap_courseVersionId_key" ON "CourseCapacityMap"("courseVersionId");
CREATE UNIQUE INDEX "CourseActionMap_courseVersionId_key" ON "CourseActionMap"("courseVersionId");
CREATE UNIQUE INDEX "CourseStoryboard_courseVersionId_key" ON "CourseStoryboard"("courseVersionId");
CREATE INDEX "CourseReviewRecord_reviewerId_idx" ON "CourseReviewRecord"("reviewerId");
CREATE UNIQUE INDEX "CourseReviewRecord_courseVersionId_key" ON "CourseReviewRecord"("courseVersionId");
CREATE UNIQUE INDEX "CourseMonitoringRecord_courseVersionId_key" ON "CourseMonitoringRecord"("courseVersionId");
CREATE UNIQUE INDEX "CourseRevisionRecord_courseVersionId_key" ON "CourseRevisionRecord"("courseVersionId");

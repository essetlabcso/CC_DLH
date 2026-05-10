-- CreateTable
CREATE TABLE "LearnerInvitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "organizationId" TEXT,
    "programId" TEXT,
    "cohortId" TEXT,
    "courseId" TEXT,
    "courseVersionId" TEXT,
    "invitedById" TEXT NOT NULL,
    "acceptedUserId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "sentAt" DATETIME,
    "acceptedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "cancelledAt" DATETIME,
    "revokedAt" DATETIME,
    "reason" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearnerInvitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LearnerInvitation_acceptedUserId_fkey" FOREIGN KEY ("acceptedUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearnerEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "programId" TEXT,
    "cohortId" TEXT,
    "invitationId" TEXT,
    "assignedById" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "enrolledAt" DATETIME,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "withdrawnAt" DATETIME,
    "expiresAt" DATETIME,
    "dueAt" DATETIME,
    "reason" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearnerEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "LearnerInvitation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgramParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedById" TEXT,
    "invitationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "profileLabel" TEXT NOT NULL DEFAULT '',
    "joinedAt" DATETIME,
    "endedAt" DATETIME,
    "reason" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgramParticipant_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramParticipant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramParticipant_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProgramParticipant_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "LearnerInvitation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CohortParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cohortId" TEXT NOT NULL,
    "programId" TEXT,
    "organizationId" TEXT,
    "userId" TEXT NOT NULL,
    "assignedById" TEXT,
    "invitationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "profileLabel" TEXT NOT NULL DEFAULT '',
    "joinedAt" DATETIME,
    "endedAt" DATETIME,
    "dueAt" DATETIME,
    "reason" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CohortParticipant_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CohortParticipant_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CohortParticipant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CohortParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CohortParticipant_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CohortParticipant_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "LearnerInvitation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearnerEnrollmentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enrollmentId" TEXT,
    "invitationId" TEXT,
    "programParticipantId" TEXT,
    "cohortParticipantId" TEXT,
    "actorId" TEXT,
    "eventType" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL DEFAULT '',
    "toStatus" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL DEFAULT '',
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearnerEnrollmentEvent_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "LearnerEnrollment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollmentEvent_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "LearnerInvitation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollmentEvent_programParticipantId_fkey" FOREIGN KEY ("programParticipantId") REFERENCES "ProgramParticipant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollmentEvent_cohortParticipantId_fkey" FOREIGN KEY ("cohortParticipantId") REFERENCES "CohortParticipant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerEnrollmentEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LearnerInvitation_tokenHash_key" ON "LearnerInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "LearnerInvitation_email_status_idx" ON "LearnerInvitation"("email", "status");

-- CreateIndex
CREATE INDEX "LearnerInvitation_status_expiresAt_idx" ON "LearnerInvitation"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "LearnerInvitation_organizationId_idx" ON "LearnerInvitation"("organizationId");

-- CreateIndex
CREATE INDEX "LearnerInvitation_programId_idx" ON "LearnerInvitation"("programId");

-- CreateIndex
CREATE INDEX "LearnerInvitation_cohortId_idx" ON "LearnerInvitation"("cohortId");

-- CreateIndex
CREATE INDEX "LearnerInvitation_courseId_idx" ON "LearnerInvitation"("courseId");

-- CreateIndex
CREATE INDEX "LearnerInvitation_courseVersionId_idx" ON "LearnerInvitation"("courseVersionId");

-- CreateIndex
CREATE INDEX "LearnerInvitation_invitedById_idx" ON "LearnerInvitation"("invitedById");

-- CreateIndex
CREATE INDEX "LearnerInvitation_acceptedUserId_idx" ON "LearnerInvitation"("acceptedUserId");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_userId_status_idx" ON "LearnerEnrollment"("userId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_courseVersionId_status_idx" ON "LearnerEnrollment"("courseVersionId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_courseId_status_idx" ON "LearnerEnrollment"("courseId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_organizationId_status_idx" ON "LearnerEnrollment"("organizationId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_programId_status_idx" ON "LearnerEnrollment"("programId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_cohortId_status_idx" ON "LearnerEnrollment"("cohortId", "status");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_invitationId_idx" ON "LearnerEnrollment"("invitationId");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_assignedById_idx" ON "LearnerEnrollment"("assignedById");

-- CreateIndex
CREATE INDEX "LearnerEnrollment_source_idx" ON "LearnerEnrollment"("source");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerEnrollment_userId_courseVersionId_key" ON "LearnerEnrollment"("userId", "courseVersionId");

-- CreateIndex
CREATE INDEX "ProgramParticipant_programId_status_idx" ON "ProgramParticipant"("programId", "status");

-- CreateIndex
CREATE INDEX "ProgramParticipant_organizationId_status_idx" ON "ProgramParticipant"("organizationId", "status");

-- CreateIndex
CREATE INDEX "ProgramParticipant_userId_status_idx" ON "ProgramParticipant"("userId", "status");

-- CreateIndex
CREATE INDEX "ProgramParticipant_assignedById_idx" ON "ProgramParticipant"("assignedById");

-- CreateIndex
CREATE INDEX "ProgramParticipant_invitationId_idx" ON "ProgramParticipant"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramParticipant_programId_userId_key" ON "ProgramParticipant"("programId", "userId");

-- CreateIndex
CREATE INDEX "CohortParticipant_cohortId_status_idx" ON "CohortParticipant"("cohortId", "status");

-- CreateIndex
CREATE INDEX "CohortParticipant_programId_status_idx" ON "CohortParticipant"("programId", "status");

-- CreateIndex
CREATE INDEX "CohortParticipant_organizationId_status_idx" ON "CohortParticipant"("organizationId", "status");

-- CreateIndex
CREATE INDEX "CohortParticipant_userId_status_idx" ON "CohortParticipant"("userId", "status");

-- CreateIndex
CREATE INDEX "CohortParticipant_assignedById_idx" ON "CohortParticipant"("assignedById");

-- CreateIndex
CREATE INDEX "CohortParticipant_invitationId_idx" ON "CohortParticipant"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "CohortParticipant_cohortId_userId_key" ON "CohortParticipant"("cohortId", "userId");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_enrollmentId_createdAt_idx" ON "LearnerEnrollmentEvent"("enrollmentId", "createdAt");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_invitationId_createdAt_idx" ON "LearnerEnrollmentEvent"("invitationId", "createdAt");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_programParticipantId_createdAt_idx" ON "LearnerEnrollmentEvent"("programParticipantId", "createdAt");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_cohortParticipantId_createdAt_idx" ON "LearnerEnrollmentEvent"("cohortParticipantId", "createdAt");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_actorId_idx" ON "LearnerEnrollmentEvent"("actorId");

-- CreateIndex
CREATE INDEX "LearnerEnrollmentEvent_eventType_createdAt_idx" ON "LearnerEnrollmentEvent"("eventType", "createdAt");

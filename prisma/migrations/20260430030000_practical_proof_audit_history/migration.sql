CREATE TABLE "LearnerPracticalProofSubmissionEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "submissionId" TEXT NOT NULL,
  "actorId" TEXT,
  "eventType" TEXT NOT NULL,
  "fromStatus" TEXT NOT NULL DEFAULT '',
  "toStatus" TEXT NOT NULL DEFAULT '',
  "revisionNumber" INTEGER,
  "proofTextSnapshot" TEXT NOT NULL DEFAULT '',
  "evidenceLinkSnapshot" TEXT NOT NULL DEFAULT '',
  "learnerVisibleNote" TEXT NOT NULL DEFAULT '',
  "internalNote" TEXT NOT NULL DEFAULT '',
  "requiredAction" TEXT NOT NULL DEFAULT '',
  "redactionRequired" BOOLEAN NOT NULL DEFAULT false,
  "specialistReviewRequired" BOOLEAN NOT NULL DEFAULT false,
  "visibilityDefault" TEXT NOT NULL DEFAULT 'PRIVATE',
  "donorVisibilityConsent" BOOLEAN NOT NULL DEFAULT false,
  "aiVerificationUsed" BOOLEAN NOT NULL DEFAULT false,
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LearnerPracticalProofSubmissionEvent_submissionId_fkey"
    FOREIGN KEY ("submissionId") REFERENCES "LearnerPracticalProofSubmission" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerPracticalProofSubmissionEvent_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "LearnerPracticalProofSubmissionEvent_submissionId_createdAt_idx"
  ON "LearnerPracticalProofSubmissionEvent"("submissionId", "createdAt");

CREATE INDEX "LearnerPracticalProofSubmissionEvent_actorId_idx"
  ON "LearnerPracticalProofSubmissionEvent"("actorId");

CREATE INDEX "LearnerPracticalProofSubmissionEvent_eventType_createdAt_idx"
  ON "LearnerPracticalProofSubmissionEvent"("eventType", "createdAt");

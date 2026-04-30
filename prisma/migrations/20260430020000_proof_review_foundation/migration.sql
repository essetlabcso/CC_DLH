ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "reviewerId" TEXT;

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "learnerFeedback" TEXT NOT NULL DEFAULT '';

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "internalReviewNote" TEXT NOT NULL DEFAULT '';

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "requiredAction" TEXT NOT NULL DEFAULT '';

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "reviewChecklist" TEXT NOT NULL DEFAULT '{}';

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "redactionRequired" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "specialistReviewRequired" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "LearnerPracticalProofSubmission"
ADD COLUMN "reviewedAt" DATETIME;

CREATE INDEX "LearnerPracticalProofSubmission_reviewerId_idx"
ON "LearnerPracticalProofSubmission"("reviewerId");


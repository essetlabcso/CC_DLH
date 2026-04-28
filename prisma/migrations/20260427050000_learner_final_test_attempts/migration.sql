CREATE TABLE "LearnerFinalTestAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseVersionId" TEXT NOT NULL,
  "lessonBlockId" TEXT NOT NULL,
  "selectedAnswer" TEXT NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "scorePercent" INTEGER NOT NULL,
  "passed" BOOLEAN NOT NULL DEFAULT false,
  "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "LearnerFinalTestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerFinalTestAttempt_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerFinalTestAttempt_lessonBlockId_fkey" FOREIGN KEY ("lessonBlockId") REFERENCES "LessonBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "LearnerFinalTestAttempt_userId_courseVersionId_submittedAt_idx" ON "LearnerFinalTestAttempt"("userId", "courseVersionId", "submittedAt");
CREATE INDEX "LearnerFinalTestAttempt_courseVersionId_passed_idx" ON "LearnerFinalTestAttempt"("courseVersionId", "passed");
CREATE INDEX "LearnerFinalTestAttempt_lessonBlockId_idx" ON "LearnerFinalTestAttempt"("lessonBlockId");

CREATE TABLE "LearnerLessonProgress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseVersionId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "LearnerLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerLessonProgress_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LearnerLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "CourseLesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LearnerLessonProgress_userId_courseVersionId_lessonId_key" ON "LearnerLessonProgress"("userId", "courseVersionId", "lessonId");
CREATE INDEX "LearnerLessonProgress_courseVersionId_idx" ON "LearnerLessonProgress"("courseVersionId");
CREATE INDEX "LearnerLessonProgress_lessonId_idx" ON "LearnerLessonProgress"("lessonId");
CREATE INDEX "LearnerLessonProgress_userId_completedAt_idx" ON "LearnerLessonProgress"("userId", "completedAt");

CREATE TABLE "LearnerCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseVersionId" TEXT NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LearnerCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerCertificate_courseVersionId_fkey" FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LearnerCertificate_certificateNumber_key" ON "LearnerCertificate"("certificateNumber");
CREATE UNIQUE INDEX "LearnerCertificate_userId_courseVersionId_key" ON "LearnerCertificate"("userId", "courseVersionId");
CREATE INDEX "LearnerCertificate_courseVersionId_idx" ON "LearnerCertificate"("courseVersionId");
CREATE INDEX "LearnerCertificate_userId_issuedAt_idx" ON "LearnerCertificate"("userId", "issuedAt");
CREATE INDEX "LearnerCertificate_revokedAt_idx" ON "LearnerCertificate"("revokedAt");

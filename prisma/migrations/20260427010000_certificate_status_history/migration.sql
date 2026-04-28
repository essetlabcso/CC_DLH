CREATE TABLE "LearnerCertificateStatusEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "actorId" TEXT,
    "eventType" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearnerCertificateStatusEvent_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "LearnerCertificate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LearnerCertificateStatusEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "LearnerCertificateStatusEvent_certificateId_createdAt_idx" ON "LearnerCertificateStatusEvent"("certificateId", "createdAt");
CREATE INDEX "LearnerCertificateStatusEvent_actorId_idx" ON "LearnerCertificateStatusEvent"("actorId");
CREATE INDEX "LearnerCertificateStatusEvent_eventType_createdAt_idx" ON "LearnerCertificateStatusEvent"("eventType", "createdAt");

INSERT INTO "LearnerCertificateStatusEvent" ("id", "certificateId", "eventType", "note", "createdAt")
SELECT
  'cert_event_' || "id",
  "id",
  'ISSUED',
  'Certificate issued.',
  "issuedAt"
FROM "LearnerCertificate";

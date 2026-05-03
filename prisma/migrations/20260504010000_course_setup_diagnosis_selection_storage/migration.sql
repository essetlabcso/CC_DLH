PRAGMA foreign_keys=OFF;

CREATE TABLE "new_CourseSetup" (
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
  "selectedDiagnosisDatasetId" TEXT,
  "selectedDiagnosisRecordId" TEXT,
  "diagnosisSnapshot" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CourseSetup_courseVersionId_fkey"
    FOREIGN KEY ("courseVersionId") REFERENCES "CourseVersion" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CourseSetup_selectedDiagnosisDatasetId_fkey"
    FOREIGN KEY ("selectedDiagnosisDatasetId") REFERENCES "diagnosis_datasets" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "CourseSetup_selectedDiagnosisRecordId_fkey"
    FOREIGN KEY ("selectedDiagnosisRecordId") REFERENCES "diagnosis_records" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_CourseSetup" (
  "id",
  "courseVersionId",
  "title",
  "summary",
  "primaryLearnerGroup",
  "language",
  "formatAndTime",
  "level",
  "capacityArea",
  "sensitiveFlag",
  "certificateIntent",
  "learnerReality",
  "diagnosisSnapshot",
  "createdAt",
  "updatedAt"
)
SELECT
  "id",
  "courseVersionId",
  "title",
  "summary",
  "primaryLearnerGroup",
  "language",
  "formatAndTime",
  "level",
  "capacityArea",
  "sensitiveFlag",
  "certificateIntent",
  "learnerReality",
  '{}',
  "createdAt",
  "updatedAt"
FROM "CourseSetup";

DROP TABLE "CourseSetup";
ALTER TABLE "new_CourseSetup" RENAME TO "CourseSetup";

CREATE UNIQUE INDEX "CourseSetup_courseVersionId_key"
  ON "CourseSetup"("courseVersionId");

CREATE INDEX "CourseSetup_selectedDiagnosisDatasetId_idx"
  ON "CourseSetup"("selectedDiagnosisDatasetId");

CREATE INDEX "CourseSetup_selectedDiagnosisRecordId_idx"
  ON "CourseSetup"("selectedDiagnosisRecordId");

PRAGMA foreign_keys=ON;

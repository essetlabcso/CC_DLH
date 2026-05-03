CREATE TABLE "admin_lookup_categories" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "categoryKey" TEXT NOT NULL,
  "categoryName" TEXT NOT NULL,
  "workflowPhase" TEXT NOT NULL DEFAULT 'cross-workflow',
  "description" TEXT NOT NULL DEFAULT '',
  "isSystemCategory" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "admin_lookup_categories_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "admin_lookup_categories_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "admin_lookup_categories_categoryKey_key"
  ON "admin_lookup_categories"("categoryKey");

CREATE INDEX "admin_lookup_categories_workflowPhase_idx"
  ON "admin_lookup_categories"("workflowPhase");

CREATE INDEX "admin_lookup_categories_isActive_idx"
  ON "admin_lookup_categories"("isActive");

CREATE INDEX "admin_lookup_categories_createdById_idx"
  ON "admin_lookup_categories"("createdById");

CREATE INDEX "admin_lookup_categories_updatedById_idx"
  ON "admin_lookup_categories"("updatedById");

CREATE TABLE "admin_lookup_values" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "categoryId" TEXT NOT NULL,
  "parentValueId" TEXT,
  "valueKey" TEXT NOT NULL,
  "displayLabel" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "helpText" TEXT NOT NULL DEFAULT '',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isSystemLocked" BOOLEAN NOT NULL DEFAULT false,
  "visibleToAdmin" BOOLEAN NOT NULL DEFAULT true,
  "visibleToCreator" BOOLEAN NOT NULL DEFAULT true,
  "visibleToReviewer" BOOLEAN NOT NULL DEFAULT true,
  "visibleToParticipant" BOOLEAN NOT NULL DEFAULT false,
  "visibleInMonitoring" BOOLEAN NOT NULL DEFAULT false,
  "changeReason" TEXT NOT NULL DEFAULT '',
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "admin_lookup_values_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "admin_lookup_categories" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "admin_lookup_values_parentValueId_fkey"
    FOREIGN KEY ("parentValueId") REFERENCES "admin_lookup_values" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "admin_lookup_values_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "admin_lookup_values_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "admin_lookup_values_categoryId_valueKey_key"
  ON "admin_lookup_values"("categoryId", "valueKey");

CREATE INDEX "admin_lookup_values_categoryId_isActive_idx"
  ON "admin_lookup_values"("categoryId", "isActive");

CREATE INDEX "admin_lookup_values_parentValueId_idx"
  ON "admin_lookup_values"("parentValueId");

CREATE INDEX "admin_lookup_values_displayOrder_idx"
  ON "admin_lookup_values"("displayOrder");

CREATE INDEX "admin_lookup_values_visibleToCreator_idx"
  ON "admin_lookup_values"("visibleToCreator");

CREATE INDEX "admin_lookup_values_visibleToReviewer_idx"
  ON "admin_lookup_values"("visibleToReviewer");

CREATE INDEX "admin_lookup_values_visibleToParticipant_idx"
  ON "admin_lookup_values"("visibleToParticipant");

CREATE INDEX "admin_lookup_values_visibleInMonitoring_idx"
  ON "admin_lookup_values"("visibleInMonitoring");

CREATE INDEX "admin_lookup_values_createdById_idx"
  ON "admin_lookup_values"("createdById");

CREATE INDEX "admin_lookup_values_updatedById_idx"
  ON "admin_lookup_values"("updatedById");

CREATE TABLE "admin_field_metadata" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "workflowPhase" TEXT NOT NULL,
  "formSection" TEXT NOT NULL,
  "metadataKey" TEXT NOT NULL,
  "fieldLabel" TEXT NOT NULL,
  "fieldType" TEXT NOT NULL DEFAULT 'text',
  "lookupCategoryKey" TEXT,
  "requiredRule" TEXT NOT NULL DEFAULT 'optional',
  "editableByCreator" BOOLEAN NOT NULL DEFAULT false,
  "editableByAdmin" BOOLEAN NOT NULL DEFAULT true,
  "readOnlyAfterLock" BOOLEAN NOT NULL DEFAULT true,
  "inheritedFrom" TEXT NOT NULL DEFAULT '',
  "visibleToCreator" BOOLEAN NOT NULL DEFAULT true,
  "visibleToReviewer" BOOLEAN NOT NULL DEFAULT true,
  "visibleToParticipant" BOOLEAN NOT NULL DEFAULT false,
  "visibleInDashboard" BOOLEAN NOT NULL DEFAULT false,
  "validationRule" TEXT NOT NULL DEFAULT '',
  "helpText" TEXT NOT NULL DEFAULT '',
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "admin_field_metadata_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "admin_field_metadata_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "admin_field_metadata_workflowPhase_metadataKey_key"
  ON "admin_field_metadata"("workflowPhase", "metadataKey");

CREATE INDEX "admin_field_metadata_workflowPhase_formSection_idx"
  ON "admin_field_metadata"("workflowPhase", "formSection");

CREATE INDEX "admin_field_metadata_lookupCategoryKey_idx"
  ON "admin_field_metadata"("lookupCategoryKey");

CREATE INDEX "admin_field_metadata_isActive_idx"
  ON "admin_field_metadata"("isActive");

CREATE INDEX "admin_field_metadata_createdById_idx"
  ON "admin_field_metadata"("createdById");

CREATE INDEX "admin_field_metadata_updatedById_idx"
  ON "admin_field_metadata"("updatedById");

CREATE TABLE "diagnosis_datasets" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "datasetCode" TEXT NOT NULL,
  "datasetTitle" TEXT NOT NULL,
  "assessmentPeriodStart" DATETIME,
  "assessmentPeriodEnd" DATETIME,
  "programOrProject" TEXT NOT NULL DEFAULT '',
  "assessmentPurpose" TEXT NOT NULL DEFAULT '',
  "regionsCovered" TEXT NOT NULL DEFAULT '[]',
  "organizationGroup" TEXT NOT NULL DEFAULT '',
  "dataCollectionMethods" TEXT NOT NULL DEFAULT '[]',
  "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
  "visibilityScope" TEXT NOT NULL DEFAULT 'ADMIN_ONLY',
  "notes" TEXT NOT NULL DEFAULT '',
  "approvedById" TEXT,
  "approvedAt" DATETIME,
  "archivedAt" DATETIME,
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "diagnosis_datasets_approvedById_fkey"
    FOREIGN KEY ("approvedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_datasets_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_datasets_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "diagnosis_datasets_datasetCode_key"
  ON "diagnosis_datasets"("datasetCode");

CREATE INDEX "diagnosis_datasets_approvalStatus_idx"
  ON "diagnosis_datasets"("approvalStatus");

CREATE INDEX "diagnosis_datasets_visibilityScope_idx"
  ON "diagnosis_datasets"("visibilityScope");

CREATE INDEX "diagnosis_datasets_archivedAt_idx"
  ON "diagnosis_datasets"("archivedAt");

CREATE INDEX "diagnosis_datasets_approvedById_idx"
  ON "diagnosis_datasets"("approvedById");

CREATE INDEX "diagnosis_datasets_createdById_idx"
  ON "diagnosis_datasets"("createdById");

CREATE INDEX "diagnosis_datasets_updatedById_idx"
  ON "diagnosis_datasets"("updatedById");

CREATE TABLE "diagnosis_records" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "datasetId" TEXT NOT NULL,
  "diagnosisCode" TEXT NOT NULL,
  "diagnosisTitle" TEXT NOT NULL,
  "organizationId" TEXT,
  "organizationGroup" TEXT NOT NULL DEFAULT '',
  "region" TEXT NOT NULL DEFAULT '',
  "sectorThematicArea" TEXT NOT NULL DEFAULT '',
  "coreCapacityArea" TEXT NOT NULL DEFAULT '',
  "capacityPracticeArea" TEXT NOT NULL DEFAULT '',
  "subCapacity" TEXT NOT NULL DEFAULT '',
  "indicatorStandardLink" TEXT NOT NULL DEFAULT '',
  "targetAudience" TEXT NOT NULL DEFAULT '',
  "currentBaseline" TEXT NOT NULL DEFAULT '',
  "desiredPractice" TEXT NOT NULL DEFAULT '',
  "capacityGapStatement" TEXT NOT NULL DEFAULT '',
  "evidenceSource" TEXT NOT NULL DEFAULT '',
  "rootCauseSummary" TEXT NOT NULL DEFAULT '',
  "ksmeRoute" TEXT NOT NULL DEFAULT '',
  "separableKnowledgeSkillComponent" TEXT NOT NULL DEFAULT '',
  "nonCourseBarrierSummary" TEXT NOT NULL DEFAULT '',
  "courseFitDecision" TEXT NOT NULL DEFAULT '',
  "recommendedInterventionRoute" TEXT NOT NULL DEFAULT '',
  "recommendedCourseOrSupportTitle" TEXT NOT NULL DEFAULT '',
  "priorityLevel" TEXT NOT NULL DEFAULT '',
  "priorityRank" INTEGER,
  "safeguardingRiskLevel" TEXT NOT NULL DEFAULT '',
  "dataSensitivityLevel" TEXT NOT NULL DEFAULT 'LOW',
  "noHarmNote" TEXT NOT NULL DEFAULT '',
  "safeSummaryForDashboard" TEXT NOT NULL DEFAULT '',
  "evaluationAnchor" TEXT NOT NULL DEFAULT '',
  "monitoringSignal" TEXT NOT NULL DEFAULT '',
  "possiblePracticalProof" TEXT NOT NULL DEFAULT '',
  "verifiedAchievementExample" TEXT NOT NULL DEFAULT '',
  "approvalStatus" TEXT NOT NULL DEFAULT 'DRAFT',
  "visibilityScope" TEXT NOT NULL DEFAULT 'ADMIN_ONLY',
  "courseCreationStatus" TEXT NOT NULL DEFAULT 'NOT_SELECTED',
  "isLocked" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "approvedById" TEXT,
  "approvedAt" DATETIME,
  "lockedById" TEXT,
  "lockedAt" DATETIME,
  "archivedAt" DATETIME,
  "changeReason" TEXT NOT NULL DEFAULT '',
  "createdById" TEXT,
  "updatedById" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "diagnosis_records_datasetId_fkey"
    FOREIGN KEY ("datasetId") REFERENCES "diagnosis_datasets" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_records_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_records_approvedById_fkey"
    FOREIGN KEY ("approvedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_records_lockedById_fkey"
    FOREIGN KEY ("lockedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_records_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "diagnosis_records_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "diagnosis_records_datasetId_diagnosisCode_key"
  ON "diagnosis_records"("datasetId", "diagnosisCode");

CREATE INDEX "diagnosis_records_datasetId_approvalStatus_idx"
  ON "diagnosis_records"("datasetId", "approvalStatus");

CREATE INDEX "diagnosis_records_organizationId_idx"
  ON "diagnosis_records"("organizationId");

CREATE INDEX "diagnosis_records_region_idx"
  ON "diagnosis_records"("region");

CREATE INDEX "diagnosis_records_coreCapacityArea_idx"
  ON "diagnosis_records"("coreCapacityArea");

CREATE INDEX "diagnosis_records_capacityPracticeArea_idx"
  ON "diagnosis_records"("capacityPracticeArea");

CREATE INDEX "diagnosis_records_ksmeRoute_idx"
  ON "diagnosis_records"("ksmeRoute");

CREATE INDEX "diagnosis_records_courseFitDecision_idx"
  ON "diagnosis_records"("courseFitDecision");

CREATE INDEX "diagnosis_records_dataSensitivityLevel_idx"
  ON "diagnosis_records"("dataSensitivityLevel");

CREATE INDEX "diagnosis_records_visibilityScope_idx"
  ON "diagnosis_records"("visibilityScope");

CREATE INDEX "diagnosis_records_courseCreationStatus_idx"
  ON "diagnosis_records"("courseCreationStatus");

CREATE INDEX "diagnosis_records_isActive_idx"
  ON "diagnosis_records"("isActive");

CREATE INDEX "diagnosis_records_isLocked_idx"
  ON "diagnosis_records"("isLocked");

CREATE INDEX "diagnosis_records_approvedById_idx"
  ON "diagnosis_records"("approvedById");

CREATE INDEX "diagnosis_records_lockedById_idx"
  ON "diagnosis_records"("lockedById");

CREATE INDEX "diagnosis_records_createdById_idx"
  ON "diagnosis_records"("createdById");

CREATE INDEX "diagnosis_records_updatedById_idx"
  ON "diagnosis_records"("updatedById");

CREATE TABLE "admin_audit_log" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "beforeJson" TEXT NOT NULL DEFAULT '',
  "afterJson" TEXT NOT NULL DEFAULT '',
  "reason" TEXT NOT NULL DEFAULT '',
  "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
  "metadata" TEXT NOT NULL DEFAULT '{}',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_audit_log_actorId_fkey"
    FOREIGN KEY ("actorId") REFERENCES "User" ("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "admin_audit_log_actorId_idx"
  ON "admin_audit_log"("actorId");

CREATE INDEX "admin_audit_log_entityType_entityId_idx"
  ON "admin_audit_log"("entityType", "entityId");

CREATE INDEX "admin_audit_log_action_idx"
  ON "admin_audit_log"("action");

CREATE INDEX "admin_audit_log_riskLevel_idx"
  ON "admin_audit_log"("riskLevel");

CREATE INDEX "admin_audit_log_createdAt_idx"
  ON "admin_audit_log"("createdAt");

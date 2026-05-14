import { prisma } from "@/lib/db/client";

export type AdminDiagnosisDatasetCard = {
  id: string;
  datasetCode: string;
  datasetTitle: string;
  programOrProject: string;
  assessmentPurpose: string;
  assessmentPeriod: string;
  regionsCovered: string[];
  organizationGroup: string;
  approvalStatus: string;
  visibilityScope: string;
  approvedByName: string | null;
  approvedAt: Date | null;
  archivedAt: Date | null;
  recordCount: number;
  selectedCourseSetupCount: number;
  canEdit: boolean;
  canEditDatasetCode: boolean;
};

export type AdminDiagnosisRecordCard = {
  id: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  datasetCode: string;
  datasetTitle: string;
  organizationGroup: string;
  region: string;
  coreCapacityArea: string;
  capacityPracticeArea: string;
  subCapacity: string;
  targetAudience: string;
  ksmeRoute: string;
  courseFitDecision: string;
  priorityLabel: string;
  safeguardingRiskLevel: string;
  dataSensitivityLevel: string;
  approvalStatus: string;
  visibilityScope: string;
  isLocked: boolean;
  isActive: boolean;
  archivedAt: Date | null;
  canEdit: boolean;
  currentBaseline: string;
  capacityGapStatement: string;
  desiredPractice: string;
  selectedCourseSetupCount: number;
};

export type AdminDiagnosisCourseUsage = {
  courseId: string;
  courseTitle: string;
  courseVersionId: string;
  setupTitle: string;
  setupUpdatedAt: Date;
  versionNumber: number;
  versionStatus: string;
};

export type AdminDiagnosisLinkedRecord = {
  id: string;
  diagnosisCode: string;
  diagnosisTitle: string;
  coreCapacityArea: string;
  capacityPracticeArea: string;
  subCapacity: string;
  targetAudience: string;
  region: string;
  ksmeRoute: string;
  courseFitDecision: string;
  approvalStatus: string;
  isLocked: boolean;
  isActive: boolean;
  archivedAt: Date | null;
  canEdit: boolean;
  selectedCourseSetupCount: number;
};

export type AdminDiagnosisCourseEligibility = {
  isEligible: boolean;
  label: string;
  reasons: string[];
};

export type AdminDiagnosisDatasetDetail = AdminDiagnosisDatasetCard & {
  assessmentPeriodEnd: Date | null;
  assessmentPeriodStart: Date | null;
  canApprove: boolean;
  canArchive: boolean;
  dataCollectionMethods: string[];
  notes: string;
  createdByName: string | null;
  updatedByName: string | null;
  createdAt: Date;
  updatedAt: Date;
  linkedCourseSetups: AdminDiagnosisCourseUsage[];
  records: AdminDiagnosisLinkedRecord[];
  totals: {
    approvedRecords: number;
    lockedRecords: number;
    activeRecords: number;
    archivedRecords: number;
    selectedCourseSetups: number;
  };
};

export type AdminDiagnosisRecordDetail = AdminDiagnosisRecordCard & {
  datasetId: string;
  assessmentPeriod: string;
  datasetApprovalStatus: string;
  datasetArchivedAt: Date | null;
  organizationName: string | null;
  sectorThematicArea: string;
  indicatorStandardLink: string;
  evidenceSource: string;
  rootCauseSummary: string;
  separableKnowledgeSkillComponent: string;
  nonCourseBarrierSummary: string;
  recommendedInterventionRoute: string;
  recommendedCourseOrSupportTitle: string;
  priorityLevel: string;
  priorityRank: number | null;
  noHarmNote: string;
  safeSummaryForDashboard: string;
  evaluationAnchor: string;
  monitoringSignal: string;
  possiblePracticalProof: string;
  verifiedAchievementExample: string;
  courseCreationStatus: string;
  approvedByName: string | null;
  approvedAt: Date | null;
  lockedByName: string | null;
  lockedAt: Date | null;
  createdByName: string | null;
  updatedByName: string | null;
  createdAt: Date;
  updatedAt: Date;
  changeReason: string;
  linkedCourseSetups: AdminDiagnosisCourseUsage[];
  courseEligibility: AdminDiagnosisCourseEligibility;
  canEdit: boolean;
  selectedCourseSetupCount: number;
};

export type AdminDiagnosisRecordDraftFormOptions = {
  capacityAreas: string[];
  courseFitDecisions: string[];
  dataSensitivityLevels: string[];
  geographicFocusAreas: string[];
  ksmeRoutes: string[];
  safeguardingRiskLevels: string[];
  targetAudienceGroups: string[];
};

export type AdminDiagnosisDatasetBrowser = {
  datasets: AdminDiagnosisDatasetCard[];
  totals: {
    totalDatasets: number;
    approvedDatasets: number;
    draftOrUnderReviewDatasets: number;
    archivedDatasets: number;
    totalRecords: number;
  };
};

export type AdminDiagnosisRecordBrowser = {
  records: AdminDiagnosisRecordCard[];
  filterOptions: {
    approvalStatuses: string[];
    capacityAreas: string[];
    courseFitDecisions: string[];
    datasets: Array<{ datasetCode: string; datasetTitle: string; id: string }>;
    ksmeRoutes: string[];
    regions: string[];
  };
  totals: {
    totalRecords: number;
    approvedRecords: number;
    lockedRecords: number;
    archivedRecords: number;
    courseAddressableRecords: number;
    needsFurtherDiagnosisRecords: number;
  };
};

export type AdminDiagnosisRecordFilters = {
  activeState?: string;
  approvalStatus?: string;
  capacityArea?: string;
  courseFitDecision?: string;
  datasetId?: string;
  ksmeRoute?: string;
  region?: string;
  search?: string;
};

export async function getAdminDiagnosisDatasetBrowser(): Promise<AdminDiagnosisDatasetBrowser> {
  const datasets = await prisma.diagnosisDataset.findMany({
    include: {
      approvedBy: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          records: true,
          selectedCourseSetups: true,
        },
      },
    },
    orderBy: [{ approvalStatus: "asc" }, { datasetTitle: "asc" }],
  });

  const cards = datasets.map((dataset) => ({
    id: dataset.id,
    datasetCode: dataset.datasetCode,
    datasetTitle: dataset.datasetTitle,
    programOrProject: dataset.programOrProject,
    assessmentPurpose: dataset.assessmentPurpose,
    assessmentPeriodEnd: dataset.assessmentPeriodEnd,
    assessmentPeriodStart: dataset.assessmentPeriodStart,
    assessmentPeriod: formatPeriod(
      dataset.assessmentPeriodStart,
      dataset.assessmentPeriodEnd,
    ),
    regionsCovered: parseList(dataset.regionsCovered),
    organizationGroup: dataset.organizationGroup,
    approvalStatus: dataset.approvalStatus,
    visibilityScope: dataset.visibilityScope,
    approvedByName: dataset.approvedBy?.name ?? null,
    approvedAt: dataset.approvedAt,
    archivedAt: dataset.archivedAt,
    recordCount: dataset._count.records,
    selectedCourseSetupCount: dataset._count.selectedCourseSetups,
    canEdit: canEditDataset({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
      selectedCourseSetupCount: dataset._count.selectedCourseSetups,
    }),
    canEditDatasetCode: canEditDatasetCode({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
      recordCount: dataset._count.records,
      selectedCourseSetupCount: dataset._count.selectedCourseSetups,
    }),
  }));

  return {
    datasets: cards,
    totals: {
      totalDatasets: cards.length,
      approvedDatasets: cards.filter((dataset) =>
        isStatus(dataset.approvalStatus, "APPROVED"),
      ).length,
      draftOrUnderReviewDatasets: cards.filter(
        (dataset) =>
          isStatus(dataset.approvalStatus, "DRAFT") ||
          isStatus(dataset.approvalStatus, "UNDER_REVIEW"),
      ).length,
      archivedDatasets: cards.filter((dataset) => dataset.archivedAt).length,
      totalRecords: cards.reduce(
        (total, dataset) => total + dataset.recordCount,
        0,
      ),
    },
  };
}

export async function getAdminDiagnosisDatasetDetail(
  datasetId: string,
): Promise<AdminDiagnosisDatasetDetail | null> {
  const dataset = await prisma.diagnosisDataset.findUnique({
    include: {
      approvedBy: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
      records: {
        orderBy: [{ priorityRank: "asc" }, { diagnosisCode: "asc" }],
        select: {
          archivedAt: true,
          approvalStatus: true,
          capacityPracticeArea: true,
          coreCapacityArea: true,
          courseFitDecision: true,
          diagnosisCode: true,
          diagnosisTitle: true,
          id: true,
          isActive: true,
          isLocked: true,
          ksmeRoute: true,
          region: true,
          subCapacity: true,
          targetAudience: true,
          _count: {
            select: {
              selectedCourseSetups: true,
            },
          },
        },
      },
      selectedCourseSetups: {
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          title: true,
          updatedAt: true,
          courseVersion: {
            select: {
              id: true,
              status: true,
              versionNumber: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      updatedBy: {
        select: {
          name: true,
        },
      },
    },
    where: {
      id: datasetId,
    },
  });

  if (!dataset) {
    return null;
  }

  const records = dataset.records.map((record) => ({
    id: record.id,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    coreCapacityArea: record.coreCapacityArea,
    capacityPracticeArea: record.capacityPracticeArea,
    subCapacity: record.subCapacity,
    targetAudience: record.targetAudience,
    region: record.region,
    ksmeRoute: record.ksmeRoute,
    courseFitDecision: record.courseFitDecision,
    approvalStatus: record.approvalStatus,
    isLocked: record.isLocked,
    isActive: record.isActive,
    archivedAt: record.archivedAt,
    selectedCourseSetupCount: record._count.selectedCourseSetups,
    canEdit: canEditRecord({
      approvalStatus: record.approvalStatus,
      archivedAt: record.archivedAt,
      datasetApprovalStatus: dataset.approvalStatus,
      datasetArchivedAt: dataset.archivedAt,
      isActive: record.isActive,
      isLocked: record.isLocked,
      selectedCourseSetupCount: record._count.selectedCourseSetups,
    }),
  }));

  return {
    id: dataset.id,
    datasetCode: dataset.datasetCode,
    datasetTitle: dataset.datasetTitle,
    programOrProject: dataset.programOrProject,
    assessmentPurpose: dataset.assessmentPurpose,
    assessmentPeriodEnd: dataset.assessmentPeriodEnd,
    assessmentPeriodStart: dataset.assessmentPeriodStart,
    assessmentPeriod: formatPeriod(
      dataset.assessmentPeriodStart,
      dataset.assessmentPeriodEnd,
    ),
    regionsCovered: parseList(dataset.regionsCovered),
    organizationGroup: dataset.organizationGroup,
    dataCollectionMethods: parseList(dataset.dataCollectionMethods),
    approvalStatus: dataset.approvalStatus,
    visibilityScope: dataset.visibilityScope,
    approvedByName: dataset.approvedBy?.name ?? null,
    approvedAt: dataset.approvedAt,
    archivedAt: dataset.archivedAt,
    recordCount: records.length,
    selectedCourseSetupCount: dataset.selectedCourseSetups.length,
    canEdit: canEditDataset({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
      selectedCourseSetupCount: dataset.selectedCourseSetups.length,
    }),
    canApprove: canApproveDataset({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
    }),
    canArchive: canArchiveDataset({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
      selectedCourseSetupCount: dataset.selectedCourseSetups.length,
    }),
    canEditDatasetCode: canEditDatasetCode({
      approvalStatus: dataset.approvalStatus,
      archivedAt: dataset.archivedAt,
      recordCount: records.length,
      selectedCourseSetupCount: dataset.selectedCourseSetups.length,
    }),
    notes: dataset.notes,
    createdByName: dataset.createdBy?.name ?? null,
    updatedByName: dataset.updatedBy?.name ?? null,
    createdAt: dataset.createdAt,
    updatedAt: dataset.updatedAt,
    linkedCourseSetups: dataset.selectedCourseSetups.map(formatCourseUsage),
    records,
    totals: {
      approvedRecords: records.filter((record) =>
        isStatus(record.approvalStatus, "APPROVED"),
      ).length,
      lockedRecords: records.filter((record) => record.isLocked).length,
      activeRecords: records.filter(
        (record) => record.isActive && !record.archivedAt,
      ).length,
      archivedRecords: records.filter((record) => record.archivedAt).length,
      selectedCourseSetups: dataset.selectedCourseSetups.length,
    },
  };
}

export async function getAdminDiagnosisRecordBrowser({
  activeState,
  approvalStatus,
  capacityArea,
  courseFitDecision,
  datasetId,
  ksmeRoute,
  region,
  search,
}: AdminDiagnosisRecordFilters = {}): Promise<AdminDiagnosisRecordBrowser> {
  const [allRecords, filteredRecords, datasets] = await Promise.all([
    prisma.diagnosisRecord.findMany({
      select: {
        approvalStatus: true,
        archivedAt: true,
        courseFitDecision: true,
        isLocked: true,
      },
    }),
    prisma.diagnosisRecord.findMany({
      include: {
        dataset: {
          select: {
            approvalStatus: true,
            archivedAt: true,
            datasetCode: true,
            datasetTitle: true,
          },
        },
        _count: {
          select: {
            selectedCourseSetups: true,
          },
        },
      },
      orderBy: [{ approvalStatus: "asc" }, { priorityRank: "asc" }],
      where: buildRecordWhere({
        activeState,
        approvalStatus,
        capacityArea,
        courseFitDecision,
        datasetId,
        ksmeRoute,
        region,
        search,
      }),
    }),
    prisma.diagnosisDataset.findMany({
      orderBy: [{ datasetTitle: "asc" }],
      select: {
        datasetCode: true,
        datasetTitle: true,
        id: true,
      },
    }),
  ]);

  const records = filteredRecords.map((record) => ({
    id: record.id,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    datasetCode: record.dataset.datasetCode,
    datasetTitle: record.dataset.datasetTitle,
    organizationGroup: record.organizationGroup,
    region: record.region,
    coreCapacityArea: record.coreCapacityArea,
    capacityPracticeArea: record.capacityPracticeArea,
    subCapacity: record.subCapacity,
    targetAudience: record.targetAudience,
    ksmeRoute: record.ksmeRoute,
    courseFitDecision: record.courseFitDecision,
    priorityLabel: formatPriority(record.priorityLevel, record.priorityRank),
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    dataSensitivityLevel: record.dataSensitivityLevel,
    approvalStatus: record.approvalStatus,
    visibilityScope: record.visibilityScope,
    isLocked: record.isLocked,
    isActive: record.isActive,
    archivedAt: record.archivedAt,
    selectedCourseSetupCount: record._count.selectedCourseSetups,
    canEdit: canEditRecord({
      approvalStatus: record.approvalStatus,
      archivedAt: record.archivedAt,
      datasetApprovalStatus: record.dataset.approvalStatus,
      datasetArchivedAt: record.dataset.archivedAt,
      isActive: record.isActive,
      isLocked: record.isLocked,
      selectedCourseSetupCount: record._count.selectedCourseSetups,
    }),
    currentBaseline: record.currentBaseline,
    capacityGapStatement: record.capacityGapStatement,
    desiredPractice: record.desiredPractice,
  }));

  return {
    records,
    filterOptions: {
      approvalStatuses: uniqueSorted(records.map((record) => record.approvalStatus)),
      capacityAreas: uniqueSorted(records.map((record) => record.coreCapacityArea)),
      courseFitDecisions: uniqueSorted(
        records.map((record) => record.courseFitDecision),
      ),
      datasets,
      ksmeRoutes: uniqueSorted(records.map((record) => record.ksmeRoute)),
      regions: uniqueSorted(records.map((record) => record.region)),
    },
    totals: {
      totalRecords: allRecords.length,
      approvedRecords: allRecords.filter((record) =>
        isStatus(record.approvalStatus, "APPROVED"),
      ).length,
      lockedRecords: allRecords.filter((record) => record.isLocked).length,
      archivedRecords: allRecords.filter((record) => record.archivedAt).length,
      courseAddressableRecords: allRecords.filter((record) =>
        record.courseFitDecision
          .toLowerCase()
          .includes("course-addressable"),
      ).length,
      needsFurtherDiagnosisRecords: allRecords.filter((record) =>
        record.courseFitDecision.toLowerCase().includes("further diagnosis"),
      ).length,
    },
  };
}

export async function getAdminDiagnosisRecordDetail(
  recordId: string,
): Promise<AdminDiagnosisRecordDetail | null> {
  const record = await prisma.diagnosisRecord.findUnique({
    include: {
      approvedBy: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
      dataset: {
        select: {
          archivedAt: true,
          approvalStatus: true,
          assessmentPeriodEnd: true,
          assessmentPeriodStart: true,
          datasetCode: true,
          datasetTitle: true,
          id: true,
        },
      },
      lockedBy: {
        select: {
          name: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
      selectedCourseSetups: {
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          title: true,
          updatedAt: true,
          courseVersion: {
            select: {
              id: true,
              status: true,
              versionNumber: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          selectedCourseSetups: true,
        },
      },
      updatedBy: {
        select: {
          name: true,
        },
      },
    },
    where: {
      id: recordId,
    },
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    diagnosisCode: record.diagnosisCode,
    diagnosisTitle: record.diagnosisTitle,
    datasetId: record.dataset.id,
    datasetCode: record.dataset.datasetCode,
    datasetTitle: record.dataset.datasetTitle,
    assessmentPeriod: formatPeriod(
      record.dataset.assessmentPeriodStart,
      record.dataset.assessmentPeriodEnd,
    ),
    datasetApprovalStatus: record.dataset.approvalStatus,
    datasetArchivedAt: record.dataset.archivedAt,
    organizationName: record.organization?.name ?? null,
    organizationGroup: record.organizationGroup,
    region: record.region,
    sectorThematicArea: record.sectorThematicArea,
    coreCapacityArea: record.coreCapacityArea,
    capacityPracticeArea: record.capacityPracticeArea,
    subCapacity: record.subCapacity,
    indicatorStandardLink: record.indicatorStandardLink,
    targetAudience: record.targetAudience,
    currentBaseline: record.currentBaseline,
    desiredPractice: record.desiredPractice,
    capacityGapStatement: record.capacityGapStatement,
    evidenceSource: record.evidenceSource,
    rootCauseSummary: record.rootCauseSummary,
    ksmeRoute: record.ksmeRoute,
    separableKnowledgeSkillComponent: record.separableKnowledgeSkillComponent,
    nonCourseBarrierSummary: record.nonCourseBarrierSummary,
    courseFitDecision: record.courseFitDecision,
    recommendedInterventionRoute: record.recommendedInterventionRoute,
    recommendedCourseOrSupportTitle: record.recommendedCourseOrSupportTitle,
    priorityLabel: formatPriority(record.priorityLevel, record.priorityRank),
    priorityLevel: record.priorityLevel,
    priorityRank: record.priorityRank,
    safeguardingRiskLevel: record.safeguardingRiskLevel,
    dataSensitivityLevel: record.dataSensitivityLevel,
    noHarmNote: record.noHarmNote,
    safeSummaryForDashboard: record.safeSummaryForDashboard,
    evaluationAnchor: record.evaluationAnchor,
    monitoringSignal: record.monitoringSignal,
    possiblePracticalProof: record.possiblePracticalProof,
    verifiedAchievementExample: record.verifiedAchievementExample,
    approvalStatus: record.approvalStatus,
    visibilityScope: record.visibilityScope,
    courseCreationStatus: record.courseCreationStatus,
    isLocked: record.isLocked,
    isActive: record.isActive,
    approvedByName: record.approvedBy?.name ?? null,
    approvedAt: record.approvedAt,
    lockedByName: record.lockedBy?.name ?? null,
    lockedAt: record.lockedAt,
    archivedAt: record.archivedAt,
    createdByName: record.createdBy?.name ?? null,
    updatedByName: record.updatedBy?.name ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    changeReason: record.changeReason,
    linkedCourseSetups: record.selectedCourseSetups.map(formatCourseUsage),
    selectedCourseSetupCount: record._count.selectedCourseSetups,
    canEdit: canEditRecord({
      approvalStatus: record.approvalStatus,
      archivedAt: record.archivedAt,
      datasetApprovalStatus: record.dataset.approvalStatus,
      datasetArchivedAt: record.dataset.archivedAt,
      isActive: record.isActive,
      isLocked: record.isLocked,
      selectedCourseSetupCount: record._count.selectedCourseSetups,
    }),
    courseEligibility: evaluateCourseEligibility({
      courseFitDecision: record.courseFitDecision,
      datasetArchivedAt: record.dataset.archivedAt,
      datasetApprovalStatus: record.dataset.approvalStatus,
      isActive: record.isActive,
      isLocked: record.isLocked,
      ksmeRoute: record.ksmeRoute,
      recordArchivedAt: record.archivedAt,
      recordApprovalStatus: record.approvalStatus,
      separableKnowledgeSkillComponent:
        record.separableKnowledgeSkillComponent,
    }),
  };
}

export async function getAdminDiagnosisRecordDraftFormOptions(): Promise<AdminDiagnosisRecordDraftFormOptions> {
  const categories = await prisma.adminLookupCategory.findMany({
    include: {
      values: {
        orderBy: [{ displayOrder: "asc" }, { displayLabel: "asc" }],
        where: {
          isActive: true,
          visibleToAdmin: true,
        },
      },
    },
    where: {
      categoryKey: {
        in: [
          "capacity_areas",
          "course_fit_decisions",
          "data_sensitivity_levels",
          "geographic_focus_areas",
          "ksme_routes",
          "safeguarding_risk_levels",
          "target_audience_groups",
        ],
      },
      isActive: true,
    },
  });

  const labelsFor = (categoryKey: string) =>
    categories
      .find((category) => category.categoryKey === categoryKey)
      ?.values.map((value) => value.displayLabel) ?? [];

  return {
    capacityAreas: labelsFor("capacity_areas"),
    courseFitDecisions: labelsFor("course_fit_decisions"),
    dataSensitivityLevels: labelsFor("data_sensitivity_levels"),
    geographicFocusAreas: labelsFor("geographic_focus_areas"),
    ksmeRoutes: labelsFor("ksme_routes"),
    safeguardingRiskLevels: labelsFor("safeguarding_risk_levels"),
    targetAudienceGroups: labelsFor("target_audience_groups"),
  };
}

function buildRecordWhere({
  activeState,
  approvalStatus,
  capacityArea,
  courseFitDecision,
  datasetId,
  ksmeRoute,
  region,
  search,
}: AdminDiagnosisRecordFilters) {
  const trimmedSearch = search?.trim();

  return {
    ...(activeState === "active" ? { archivedAt: null, isActive: true } : {}),
    ...(activeState === "archived" ? { archivedAt: { not: null } } : {}),
    ...(approvalStatus ? { approvalStatus } : {}),
    ...(capacityArea ? { coreCapacityArea: capacityArea } : {}),
    ...(courseFitDecision ? { courseFitDecision } : {}),
    ...(datasetId ? { datasetId } : {}),
    ...(ksmeRoute ? { ksmeRoute } : {}),
    ...(region ? { region } : {}),
    ...(trimmedSearch
      ? {
          OR: [
            { diagnosisCode: { contains: trimmedSearch } },
            { diagnosisTitle: { contains: trimmedSearch } },
            { organizationGroup: { contains: trimmedSearch } },
            { region: { contains: trimmedSearch } },
            { coreCapacityArea: { contains: trimmedSearch } },
            { capacityPracticeArea: { contains: trimmedSearch } },
            { targetAudience: { contains: trimmedSearch } },
            { capacityGapStatement: { contains: trimmedSearch } },
          ],
        }
      : {}),
  };
}

function formatPeriod(start: Date | null, end: Date | null) {
  if (!start && !end) {
    return "Not specified";
  }

  if (start && end) {
    return `${formatDate(start)} to ${formatDate(end)}`;
  }

  return start ? `From ${formatDate(start)}` : `Until ${formatDate(end)}`;
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatPriority(priorityLevel: string, priorityRank: number | null) {
  if (priorityLevel && priorityRank !== null) {
    return `${priorityLevel} · Rank ${priorityRank}`;
  }

  if (priorityLevel) {
    return priorityLevel;
  }

  return priorityRank !== null ? `Rank ${priorityRank}` : "Not set";
}

function formatCourseUsage(
  setup: {
    title: string;
    updatedAt: Date;
    courseVersion: {
      id: string;
      status: string;
      versionNumber: number;
      course: {
        id: string;
        title: string;
      };
    };
  },
): AdminDiagnosisCourseUsage {
  return {
    courseId: setup.courseVersion.course.id,
    courseTitle: setup.courseVersion.course.title,
    courseVersionId: setup.courseVersion.id,
    setupTitle: setup.title,
    setupUpdatedAt: setup.updatedAt,
    versionNumber: setup.courseVersion.versionNumber,
    versionStatus: setup.courseVersion.status,
  };
}

function evaluateCourseEligibility({
  courseFitDecision,
  datasetArchivedAt,
  datasetApprovalStatus,
  isActive,
  isLocked,
  ksmeRoute,
  recordArchivedAt,
  recordApprovalStatus,
  separableKnowledgeSkillComponent,
}: {
  courseFitDecision: string;
  datasetArchivedAt: Date | null;
  datasetApprovalStatus: string;
  isActive: boolean;
  isLocked: boolean;
  ksmeRoute: string;
  recordArchivedAt: Date | null;
  recordApprovalStatus: string;
  separableKnowledgeSkillComponent: string;
}): AdminDiagnosisCourseEligibility {
  const reasons: string[] = [];
  const hasKnowledgeSkillComponent = hasText(separableKnowledgeSkillComponent);

  if (!isStatus(datasetApprovalStatus, "APPROVED")) {
    reasons.push("The linked dataset is not approved.");
  }

  if (datasetArchivedAt) {
    reasons.push("The linked dataset is archived.");
  }

  if (!isStatus(recordApprovalStatus, "APPROVED")) {
    reasons.push("The diagnosis record is not approved.");
  }

  if (!isLocked) {
    reasons.push("The diagnosis record is not locked.");
  }

  if (!isActive || recordArchivedAt) {
    reasons.push("The diagnosis record is not active.");
  }

  const fit = normalizeLabel(courseFitDecision);
  if (fit === "course addressable") {
    // Fully course-addressable records pass the course-fit rule.
  } else if (
    fit.startsWith("partly course addressable") ||
    fit === "blended support recommended"
  ) {
    if (!hasKnowledgeSkillComponent) {
      reasons.push(
        "A partly course-addressable record needs an explicit Knowledge or Skill component.",
      );
    }
  } else if (fit.startsWith("non course support")) {
    reasons.push("This record is marked for non-course support.");
  } else if (fit === "further diagnosis needed") {
    reasons.push("This record needs further diagnosis before course creation.");
  } else if (fit === "not prioritized for phase 1") {
    reasons.push("This record is not prioritized for Phase 1 course creation.");
  } else {
    reasons.push("The course-fit decision is not ready for course creation.");
  }

  const route = normalizeLabel(ksmeRoute);
  if (route === "knowledge" || route === "skill") {
    // Knowledge and Skill routes can proceed when course-fit rules pass.
  } else if (
    route === "mixed" ||
    route === "motivation" ||
    route === "environment"
  ) {
    if (!hasKnowledgeSkillComponent) {
      reasons.push(
        "This K/S/M/E route needs a separable Knowledge or Skill component.",
      );
    }
  } else {
    reasons.push("The K/S/M/E route is not ready for course creation.");
  }

  return {
    isEligible: reasons.length === 0,
    label: reasons.length === 0 ? "Course setup eligible" : "Not selectable",
    reasons:
      reasons.length > 0
        ? reasons
        : ["This record can be selected during Course Setup."],
  };
}

function isStatus(value: string, status: string) {
  return value.toLowerCase() === status.toLowerCase();
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseList(value: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

function canEditDataset({
  approvalStatus,
  archivedAt,
  selectedCourseSetupCount,
}: {
  approvalStatus: string;
  archivedAt: Date | null;
  selectedCourseSetupCount: number;
}) {
  return (
    isStatus(approvalStatus, "DRAFT") &&
    !archivedAt &&
    selectedCourseSetupCount === 0
  );
}

function canApproveDataset({
  approvalStatus,
  archivedAt,
}: {
  approvalStatus: string;
  archivedAt: Date | null;
}) {
  return !archivedAt && !isStatus(approvalStatus, "APPROVED");
}

function canArchiveDataset({
  approvalStatus,
  archivedAt,
  selectedCourseSetupCount,
}: {
  approvalStatus: string;
  archivedAt: Date | null;
  selectedCourseSetupCount: number;
}) {
  return (
    !archivedAt &&
    !isStatus(approvalStatus, "ARCHIVED") &&
    selectedCourseSetupCount === 0
  );
}

function canEditDatasetCode({
  approvalStatus,
  archivedAt,
  recordCount,
  selectedCourseSetupCount,
}: {
  approvalStatus: string;
  archivedAt: Date | null;
  recordCount: number;
  selectedCourseSetupCount: number;
}) {
  return (
    canEditDataset({ approvalStatus, archivedAt, selectedCourseSetupCount }) &&
    recordCount === 0
  );
}

function canEditRecord({
  approvalStatus,
  archivedAt,
  datasetApprovalStatus,
  datasetArchivedAt,
  isActive,
  isLocked,
  selectedCourseSetupCount,
}: {
  approvalStatus: string;
  archivedAt: Date | null;
  datasetApprovalStatus: string;
  datasetArchivedAt: Date | null;
  isActive: boolean;
  isLocked: boolean;
  selectedCourseSetupCount: number;
}) {
  return (
    isStatus(datasetApprovalStatus, "DRAFT") &&
    !datasetArchivedAt &&
    isStatus(approvalStatus, "DRAFT") &&
    !isLocked &&
    isActive &&
    !archivedAt &&
    selectedCourseSetupCount === 0
  );
}

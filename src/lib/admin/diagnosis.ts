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
  currentBaseline: string;
  capacityGapStatement: string;
  desiredPractice: string;
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
            datasetCode: true,
            datasetTitle: true,
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

function isStatus(value: string, status: string) {
  return value.toLowerCase() === status.toLowerCase();
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

import { inflateRawSync } from "node:zlib";

import { readFileSync } from "node:fs";

export type WorkbookLayer =
  | "relationship/documentation"
  | "reference/taxonomy"
  | "main data-entry"
  | "dashboard-ready summary";

export type WorkbookSheetContract = {
  sheetName: string;
  logicalTable: string;
  layer: WorkbookLayer;
  description: string;
};

export type CsvExportContract = {
  fileName: string;
  sheetName: string;
  expectedHeaders: readonly string[];
};

export const analysisWorkbookPath =
  "docs/data-templates/DEC_Capacity_Analysis_Data_Entry_Workbook_Final.xlsx";

export const analysisWorkbookReadmePath =
  "docs/data-templates/DEC_Capacity_Analysis_Workbook_README.md";

export const analysisCsvDirectory = "docs/data-templates/csv";

export const fixedCurrentPracticeScoreValues = [1, 2, 3, 4, 5] as const;

export const priorityCapacityGapsBridge = {
  sheetName: "15_Priority_Capacity_Gaps",
  bridgesTo: [
    "K/S/M/E routing",
    "course-fit decisions",
    "course pipeline planning",
  ],
  rule:
    "Priority_Capacity_Gaps is the bridge from assessment data to course planning; raw assessment rows do not automatically become courses.",
} as const;

export const workbookWorkflowFieldsArePlatformConcerns = {
  workbookDoesNotControl: [
    "approval",
    "locking",
    "handover",
    "audit trail",
    "roles",
    "permissions",
  ],
  rule:
    "Workbook data-entry fields do not replace platform workflow gates, locks, audit trail, roles, or permissions.",
} as const;

export const expectedWorkbookSheets: readonly WorkbookSheetContract[] = [
  {
    sheetName: "Dropdown_Lists",
    logicalTable: "Dropdown helper lists",
    layer: "reference/taxonomy",
    description: "Workbook validation lists for controlled values.",
  },
  {
    sheetName: "01_README",
    logicalTable: "README",
    layer: "relationship/documentation",
    description: "Workbook-local documentation and instructions.",
  },
  {
    sheetName: "02_Score_Scale_1_to_5",
    logicalTable: "Score_Scale_1_to_5",
    layer: "reference/taxonomy",
    description: "Fixed Current Practice Score scale.",
  },
  {
    sheetName: "03_ENUM_Helper",
    logicalTable: "ENUM_Helper",
    layer: "reference/taxonomy",
    description: "Controlled enum values used across workbook tables.",
  },
  {
    sheetName: "04_Programs",
    logicalTable: "Programs",
    layer: "reference/taxonomy",
    description: "Program reference data.",
  },
  {
    sheetName: "05_Cohorts",
    logicalTable: "Cohorts",
    layer: "reference/taxonomy",
    description: "Cohort reference data linked to programs.",
  },
  {
    sheetName: "06_CSO_Registry",
    logicalTable: "CSO_Registry",
    layer: "reference/taxonomy",
    description: "CSO registry reference data.",
  },
  {
    sheetName: "07_Target_Learner_Groups",
    logicalTable: "Target_Learner_Groups",
    layer: "reference/taxonomy",
    description: "Controlled target learner group reference data.",
  },
  {
    sheetName: "08_Core_Capacity_Areas",
    logicalTable: "Core_Capacity_Areas",
    layer: "reference/taxonomy",
    description: "Nine DEC Core Capacity Areas.",
  },
  {
    sheetName: "10_Indicator_Standards",
    logicalTable: "Indicator_Standards",
    layer: "reference/taxonomy",
    description: "Indicator and standard reference data.",
  },
  {
    sheetName: "09_Capacity_Practice_Areas",
    logicalTable: "Capacity_Practice_Areas",
    layer: "reference/taxonomy",
    description: "Assessable Capacity Practice Areas under Core Capacity Areas.",
  },
  {
    sheetName: "11_Course_Fit_Rules",
    logicalTable: "Course_Fit_Rules",
    layer: "reference/taxonomy",
    description: "K/S/M/E and course-fit decision support rules.",
  },
  {
    sheetName: "12_Verified_Achievement_Map",
    logicalTable: "Verified_Achievement_Map",
    layer: "reference/taxonomy",
    description: "Internal mapping from capacity practice to possible recognition.",
  },
  {
    sheetName: "13_CSO_Assessment_Header",
    logicalTable: "CSO_Assessment_Header",
    layer: "main data-entry",
    description: "One assessment header per CSO assessment round.",
  },
  {
    sheetName: "14_CSO_Practice_Assessment",
    logicalTable: "CSO_Practice_Area_Assessment_Data",
    layer: "main data-entry",
    description:
      "Main scoring data: one row per CSO per Capacity Practice Area.",
  },
  {
    sheetName: "15_Priority_Capacity_Gaps",
    logicalTable: "Priority_Capacity_Gaps",
    layer: "main data-entry",
    description:
      "Selected priority gaps that bridge assessment data to K/S/M/E and course-fit planning.",
  },
  {
    sheetName: "16_Evidence_Sources",
    logicalTable: "Evidence_Sources",
    layer: "main data-entry",
    description: "Safe summarized evidence references for assessment rows or gaps.",
  },
  {
    sheetName: "17_Document_Evidence",
    logicalTable: "Document_Evidence_Checklist",
    layer: "main data-entry",
    description: "Document evidence checklist and safe evidence summaries.",
  },
  {
    sheetName: "18_Priority_Capacity_Actions",
    logicalTable: "Priority_Capacity_Actions",
    layer: "main data-entry",
    description: "Recommended actions linked to priority gaps.",
  },
  {
    sheetName: "19_CSO_Capacity_Summary",
    logicalTable: "CSO_Capacity_Area_Summary",
    layer: "dashboard-ready summary",
    description: "CSO by Core Capacity Area summary rows.",
  },
  {
    sheetName: "20_CSO_Overall_Summary",
    logicalTable: "CSO_Overall_Summary",
    layer: "dashboard-ready summary",
    description: "Overall CSO assessment summary rows.",
  },
  {
    sheetName: "21_All_CSO_Aggregated",
    logicalTable: "All_CSO_Aggregated_Dashboard_Data",
    layer: "dashboard-ready summary",
    description: "Cohort/all-CSO aggregate dashboard rows.",
  },
  {
    sheetName: "22_Course_Pipeline_Data",
    logicalTable: "Course_Pipeline_Dashboard_Data",
    layer: "dashboard-ready summary",
    description: "Priority-gap course pipeline dashboard rows.",
  },
  {
    sheetName: "23_Relationships",
    logicalTable: "Relationships",
    layer: "relationship/documentation",
    description: "Workbook table relationship documentation.",
  },
] as const;

export const availableCsvExports: readonly CsvExportContract[] = [
  {
    fileName: "Dropdown_Lists.csv",
    sheetName: "Dropdown_Lists",
    expectedHeaders: [
      "assessment_type",
      "assessment_status",
      "data_collection_round",
      "active_status",
      "cso_type",
      "cso_size_category",
      "cso_maturity_level",
      "region",
      "sector_primary",
      "evidence_source_type",
      "evidence_confidence",
      "indicator_strength_rating",
      "course_relevance",
      "ksme_diagnosis",
      "course_fit_decision",
      "recommended_intervention_route",
      "safeguarding_data_sensitivity",
      "safe_for_dashboard",
      "priority_flag",
      "priority_level",
      "document_available_status",
      "document_review_status",
      "document_category",
      "action_type",
      "timeframe_category",
      "action_status",
      "data_quality_check",
      "practical_proof_possibility",
      "recommended_learning_product_type",
      "boolean_true_false",
      "assessment_round",
      "current_practice_score",
    ],
  },
  {
    fileName: "02_Score_Scale_1_to_5.csv",
    sheetName: "02_Score_Scale_1_to_5",
    expectedHeaders: [
      "score_value",
      "score_label",
      "score_definition",
      "dashboard_gap_severity",
      "capacity_level_band",
      "recommended_interpretation",
      "typical_capacity_response",
      "dashboard_sort_order",
    ],
  },
  {
    fileName: "03_ENUM_Helper.csv",
    sheetName: "03_ENUM_Helper",
    expectedHeaders: [
      "enum_group",
      "enum_value",
      "enum_label",
      "enum_definition",
      "applies_to_sheet",
      "applies_to_column",
      "sort_order",
      "active_status",
    ],
  },
  {
    fileName: "08_Core_Capacity_Areas.csv",
    sheetName: "08_Core_Capacity_Areas",
    expectedHeaders: [
      "core_capacity_area_id",
      "core_capacity_area_code",
      "core_capacity_area_name",
      "short_definition",
      "source_reference",
      "dashboard_category",
      "display_order",
      "active_status",
    ],
  },
  {
    fileName: "09_Capacity_Practice_Areas.csv",
    sheetName: "09_Capacity_Practice_Areas",
    expectedHeaders: [
      "capacity_practice_area_id",
      "core_capacity_area_id",
      "core_capacity_area_name",
      "capacity_practice_area_code",
      "capacity_practice_area_name",
      "capacity_practice_area_definition",
      "guiding_standard_or_principle",
      "indicator_standard_id",
      "global_standard_commitment",
      "example_course_addressable_gap",
      "example_performance_goal",
      "example_practical_proof",
      "default_target_learner_group_id",
      "typical_ksme_diagnosis",
      "typical_course_fit_decision",
      "safeguarding_sensitivity_hint",
      "monitoring_dashboard_category",
      "annex4_source_section",
      "display_order",
      "active_status",
    ],
  },
  {
    fileName: "10_Indicator_Standards.csv",
    sheetName: "10_Indicator_Standards",
    expectedHeaders: [
      "indicator_standard_id",
      "indicator_standard_code",
      "indicator_standard_title",
      "source_framework",
      "source_objective_or_commitment",
      "indicator_description",
      "most_relevant_core_capacity_area_id",
      "applicable_capacity_practice_areas",
      "indicator_strength_rating",
      "course_relevance",
      "notes",
      "active_status",
    ],
  },
  {
    fileName: "11_Course_Fit_Rules.csv",
    sheetName: "11_Course_Fit_Rules",
    expectedHeaders: [
      "course_fit_rule_id",
      "core_capacity_area_id",
      "capacity_practice_area_id",
      "issue_type",
      "example_issue",
      "default_course_fit_decision",
      "recommended_intervention_route",
      "separable_ks_component_required",
      "decision_rule_note",
      "safeguarding_note",
      "active_status",
    ],
  },
  {
    fileName: "12_Verified_Achievement_Map.csv",
    sheetName: "12_Verified_Achievement_Map",
    expectedHeaders: [
      "achievement_map_id",
      "core_capacity_area_id",
      "capacity_practice_area_id",
      "verified_achievement_name",
      "practical_proof_type",
      "evidence_required",
      "safety_note",
      "dashboard_category",
      "active_status",
    ],
  },
  {
    fileName: "13_CSO_Assessment_Header.csv",
    sheetName: "13_CSO_Assessment_Header",
    expectedHeaders: [
      "assessment_id",
      "program_id",
      "cohort_id",
      "cso_id",
      "assessment_round",
      "previous_assessment_id",
      "assessment_date",
      "assessment_type",
      "assessment_status",
      "offline_analysis_completed_by",
      "validation_date",
      "validated_by",
      "number_of_participants",
      "participant_roles_summary",
      "assessment_method_summary",
      "evidence_sources_overall",
      "overall_strengths_summary",
      "overall_areas_for_growth_summary",
      "overall_priority_summary",
      "overall_safeguarding_note",
      "overall_comments",
      "ready_for_dashboard",
    ],
  },
  {
    fileName: "14_CSO_Practice_Assessment.csv",
    sheetName: "14_CSO_Practice_Assessment",
    expectedHeaders: [
      "assessment_detail_id",
      "assessment_id",
      "cso_id",
      "cso_code",
      "cso_name",
      "assessment_round",
      "assessment_date",
      "cohort_id",
      "region",
      "sector_primary",
      "core_capacity_area_id",
      "core_capacity_area_name",
      "capacity_practice_area_id",
      "capacity_practice_area_name",
      "capacity_practice_area_definition",
      "indicator_standard_id",
      "indicator_standard_reference",
      "global_standard_commitment",
      "current_practice_score_1_to_5",
      "score_label_auto",
      "score_interpretation_auto",
      "gap_severity_auto",
      "current_practice_summary",
      "strengths_summary",
      "areas_for_growth",
      "capacity_gap",
      "desired_practice",
      "primary_evidence_source",
      "secondary_evidence_sources",
      "evidence_summary",
      "evidence_confidence",
      "target_learner_group_id",
      "target_learner_group_name",
      "ksme_diagnosis",
      "separable_knowledge_or_skill_component",
      "non_course_barrier_summary",
      "course_fit_decision",
      "recommended_intervention_route",
      "safeguarding_data_sensitivity",
      "no_harm_note",
      "safe_for_dashboard",
      "safe_summary_for_dashboard",
      "evaluation_anchor",
      "monitoring_signal",
      "possible_practical_proof",
      "verified_achievement_example",
      "priority_flag",
      "priority_rank",
      "recommended_capacity_action",
      "recommended_course_or_support_title",
      "remarks",
      "data_quality_check",
    ],
  },
  {
    fileName: "19_CSO_Capacity_Summary.csv",
    sheetName: "19_CSO_Capacity_Summary",
    expectedHeaders: [
      "cso_capacity_area_summary_id",
      "assessment_id",
      "cso_id",
      "cso_code",
      "cso_name_or_safe_name",
      "cohort_id",
      "region",
      "sector_primary",
      "core_capacity_area_id",
      "core_capacity_area_name",
      "practice_area_count_assessed",
      "average_current_practice_score",
      "capacity_level_auto",
      "critical_gap_count",
      "high_gap_count",
      "moderate_gap_count",
      "strength_count",
      "lowest_scored_practice_area",
      "highest_scored_practice_area",
      "priority_gap_count",
      "course_addressable_gap_count",
      "blended_support_gap_count",
      "non_course_gap_count",
      "safeguarding_high_or_critical_count",
      "summary_interpretation",
    ],
  },
  {
    fileName: "20_CSO_Overall_Summary.csv",
    sheetName: "20_CSO_Overall_Summary",
    expectedHeaders: [
      "cso_overall_summary_id",
      "assessment_id",
      "cso_id",
      "cso_code",
      "cso_name_or_safe_name",
      "cohort_id",
      "region",
      "sector_primary",
      "total_practice_areas_assessed",
      "overall_average_score",
      "overall_capacity_level_auto",
      "total_critical_gaps",
      "total_high_gaps",
      "total_moderate_gaps",
      "total_strengths",
      "total_priority_gaps",
      "total_course_addressable_gaps",
      "total_blended_support_gaps",
      "total_non_course_gaps",
      "knowledge_gap_count",
      "skill_gap_count",
      "motivation_gap_count",
      "environment_gap_count",
      "mixed_gap_count",
      "high_sensitivity_gap_count",
      "overall_dashboard_summary",
    ],
  },
] as const;

export const missingCsvExports = expectedWorkbookSheets
  .filter(
    (sheet) =>
      !availableCsvExports.some((csvExport) => csvExport.sheetName === sheet.sheetName),
  )
  .map((sheet) => ({
    sheetName: sheet.sheetName,
    logicalTable: sheet.logicalTable,
    layer: sheet.layer,
  }));

export function getWorkbookSheetsByLayer(layer: WorkbookLayer) {
  return expectedWorkbookSheets.filter((sheet) => sheet.layer === layer);
}

export function parseCsvHeader(csvText: string) {
  const firstLine = csvText.replace(/^\uFEFF/, "").split(/\r?\n/, 1)[0] || "";
  const headers: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < firstLine.length; index += 1) {
    const char = firstLine[index];
    const next = firstLine[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      headers.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  headers.push(current.trim());
  return headers;
}

export function validateCsvHeader(
  actualHeaders: readonly string[],
  expectedHeaders: readonly string[],
) {
  return {
    matches: arraysEqual(actualHeaders, expectedHeaders),
    missingHeaders: expectedHeaders.filter(
      (header) => !actualHeaders.includes(header),
    ),
    unexpectedHeaders: actualHeaders.filter(
      (header) => !expectedHeaders.includes(header),
    ),
  };
}

export function inspectWorkbookSheetNames(path = analysisWorkbookPath) {
  const workbookXml = readZipTextEntry(readFileSync(path), "xl/workbook.xml");

  return Array.from(workbookXml.matchAll(/<sheet\b[^>]*\bname="([^"]+)"/g)).map(
    (match) => decodeXmlAttribute(match[1]),
  );
}

function readZipTextEntry(buffer: Buffer, entryName: string) {
  const entry = findZipEntry(buffer, entryName);

  if (!entry) {
    throw new Error(`Workbook entry not found: ${entryName}`);
  }

  const localHeaderOffset = entry.localHeaderOffset;

  if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error(`Invalid local file header for workbook entry: ${entryName}`);
  }

  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
  const extraFieldLength = buffer.readUInt16LE(localHeaderOffset + 28);
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraFieldLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);
  const content =
    entry.compressionMethod === 0
      ? compressed
      : entry.compressionMethod === 8
        ? inflateRawSync(compressed)
        : unsupportedCompression(entryName, entry.compressionMethod);

  return content.toString("utf8");
}

function findZipEntry(buffer: Buffer, entryName: string) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let offset = buffer.readUInt32LE(eocdOffset + 16);

  for (let entryIndex = 0; entryIndex < entryCount; entryIndex += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("Invalid workbook central directory.");
    }

    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const fileCommentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer
      .subarray(offset + 46, offset + 46 + fileNameLength)
      .toString("utf8");

    if (fileName === entryName) {
      return {
        compressionMethod,
        compressedSize,
        localHeaderOffset,
      };
    }

    offset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return null;
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const minOffset = Math.max(0, buffer.length - 65557);

  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }

  throw new Error("Workbook central directory not found.");
}

function unsupportedCompression(entryName: string, compressionMethod: number): never {
  throw new Error(
    `Unsupported workbook compression method ${compressionMethod} for ${entryName}.`,
  );
}

function decodeXmlAttribute(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function arraysEqual(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

import { existsSync } from "node:fs";
import { join } from "node:path";

import { analysisCsvDirectory, fixedCurrentPracticeScoreValues } from "./workbook-contract";

export const csoAssessmentHeaderSheetName = "13_CSO_Assessment_Header" as const;
export const csoPracticeAssessmentSheetName =
  "14_CSO_Practice_Assessment" as const;

export const csoAssessmentHeaderCsvFileName =
  `${csoAssessmentHeaderSheetName}.csv` as const;
export const csoPracticeAssessmentCsvFileName =
  `${csoPracticeAssessmentSheetName}.csv` as const;

export const csoAssessmentHeaderExpectedHeaders = [
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
] as const;

export const csoPracticeAssessmentExpectedHeaders = [
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
] as const;

export const csoAssessmentHeaderRequiredFields = [
  "assessment_id",
  "program_id",
  "cohort_id",
  "cso_id",
  "assessment_round",
  "assessment_type",
  "assessment_status",
] as const;

export const csoPracticeAssessmentRequiredFields = [
  "assessment_detail_id",
  "assessment_id",
  "cso_id",
  "core_capacity_area_id",
  "core_capacity_area_name",
  "capacity_practice_area_id",
  "capacity_practice_area_name",
  "current_practice_score_1_to_5",
  "safe_for_dashboard",
  "data_quality_check",
] as const;

export const csoPracticeAssessmentRowContract = {
  description: "One row per CSO per Capacity Practice Area within an assessment.",
  uniqueBy: ["assessment_id", "cso_id", "capacity_practice_area_id"],
} as const;

export const csoPracticeAssessmentRelationships = {
  assessmentHeader: {
    from: "assessment_id",
    toSheet: csoAssessmentHeaderSheetName,
    to: "assessment_id",
    required: true,
  },
  coreCapacityArea: {
    from: "core_capacity_area_id",
    toSheet: "08_Core_Capacity_Areas",
    to: "core_capacity_area_id",
    required: true,
  },
  capacityPracticeArea: {
    from: "capacity_practice_area_id",
    toSheet: "09_Capacity_Practice_Areas",
    to: "capacity_practice_area_id",
    required: true,
  },
} as const;

export const csoAssessmentDashboardSafeFields = [
  "assessment_id",
  "cso_id",
  "cso_code",
  "cohort_id",
  "region",
  "sector_primary",
  "core_capacity_area_id",
  "core_capacity_area_name",
  "capacity_practice_area_id",
  "capacity_practice_area_name",
  "current_practice_score_1_to_5",
  "score_label_auto",
  "score_interpretation_auto",
  "gap_severity_auto",
  "evidence_confidence",
  "ksme_diagnosis",
  "course_fit_decision",
  "recommended_intervention_route",
  "safeguarding_data_sensitivity",
  "safe_for_dashboard",
  "safe_summary_for_dashboard",
  "evaluation_anchor",
  "monitoring_signal",
  "priority_flag",
  "priority_rank",
  "data_quality_check",
] as const;

export const csoAssessmentUnsafeDashboardFields = [
  "raw_interview_notes",
  "raw_fgd_notes",
  "safeguarding_case_details",
  "personal_data",
  "exact_sensitive_locations",
  "unsafe_organizational_vulnerabilities",
  "raw_evidence_content",
  "internal_unreviewed_validation_notes",
  "cso_name",
  "primary_evidence_source",
  "secondary_evidence_sources",
  "evidence_summary",
  "offline_analysis_completed_by",
  "validated_by",
  "overall_comments",
  "remarks",
] as const;

export const csoAssessmentDryRunBehavior = {
  importsToDatabase: false,
  createsCourses: false,
  createsAnalysisHandovers: false,
  usesPriorityCapacityGapsForCoursePlanning: true,
  rawAssessmentRowsAutomaticallyBecomeCourses: false,
} as const;

export function validateRequiredFields<
  TRecord extends Record<string, string | number | boolean | null | undefined>,
>(record: TRecord, requiredFields: readonly string[]) {
  return requiredFields.filter((field) => {
    const value = record[field];

    return value === null || value === undefined || String(value).trim() === "";
  });
}

export function isValidCurrentPracticeScore(value: unknown) {
  if (typeof value === "number") {
    return Number.isInteger(value) && fixedCurrentPracticeScoreValues.includes(
      value as (typeof fixedCurrentPracticeScoreValues)[number],
    );
  }

  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  if (!/^[1-5]$/.test(value.trim())) {
    return false;
  }

  return fixedCurrentPracticeScoreValues.includes(
    Number(value) as (typeof fixedCurrentPracticeScoreValues)[number],
  );
}

export function validateCompletedPracticeAssessmentScore(value: unknown) {
  return {
    ok: isValidCurrentPracticeScore(value),
    allowedValues: fixedCurrentPracticeScoreValues,
  };
}

export function buildAssessmentCsvReadinessReport(
  csvDirectory = analysisCsvDirectory,
) {
  const sheets = [
    {
      sheetName: csoAssessmentHeaderSheetName,
      csvFileName: csoAssessmentHeaderCsvFileName,
      expectedHeaders: csoAssessmentHeaderExpectedHeaders,
    },
    {
      sheetName: csoPracticeAssessmentSheetName,
      csvFileName: csoPracticeAssessmentCsvFileName,
      expectedHeaders: csoPracticeAssessmentExpectedHeaders,
    },
  ].map((sheet) => {
    const csvPath = join(csvDirectory, sheet.csvFileName);
    const csvExportPresent = existsSync(csvPath);

    return {
      ...sheet,
      headerContractDefined: sheet.expectedHeaders.length > 0,
      csvExportPresent,
      importReady: csvExportPresent,
      readiness:
        csvExportPresent
          ? "import-ready"
          : "not import-ready: missing required CSV export",
    };
  });

  return {
    sheets,
    importReady: sheets.every((sheet) => sheet.importReady),
    missingCsvExportsRequiredBeforeRealImport: sheets
      .filter((sheet) => !sheet.csvExportPresent)
      .map((sheet) => sheet.csvFileName),
  };
}

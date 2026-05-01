import { describe, expect, it } from "vitest";

import {
  buildAssessmentCsvReadinessReport,
  csoAssessmentDashboardSafeFields,
  csoAssessmentDryRunBehavior,
  csoAssessmentHeaderExpectedHeaders,
  csoAssessmentHeaderRequiredFields,
  csoAssessmentHeaderSheetName,
  csoAssessmentUnsafeDashboardFields,
  csoPracticeAssessmentExpectedHeaders,
  csoPracticeAssessmentRelationships,
  csoPracticeAssessmentRequiredFields,
  csoPracticeAssessmentRowContract,
  csoPracticeAssessmentSheetName,
  isValidCurrentPracticeScore,
  validateCompletedPracticeAssessmentScore,
  validateRequiredFields,
} from "./assessment-dry-run-contract";
import {
  fixedCurrentPracticeScoreValues,
  priorityCapacityGapsBridge,
} from "./workbook-contract";

describe("assessment dry-run contract", () => {
  it("defines expected headers for the CSO assessment header sheet", () => {
    expect(csoAssessmentHeaderSheetName).toBe("13_CSO_Assessment_Header");
    expect(csoAssessmentHeaderExpectedHeaders).toEqual([
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
    ]);
  });

  it("defines expected headers for the CSO practice assessment sheet", () => {
    expect(csoPracticeAssessmentSheetName).toBe("14_CSO_Practice_Assessment");
    expect(csoPracticeAssessmentExpectedHeaders).toContain("assessment_id");
    expect(csoPracticeAssessmentExpectedHeaders).toContain(
      "core_capacity_area_id",
    );
    expect(csoPracticeAssessmentExpectedHeaders).toContain(
      "capacity_practice_area_id",
    );
    expect(csoPracticeAssessmentExpectedHeaders).toContain(
      "current_practice_score_1_to_5",
    );
    expect(csoPracticeAssessmentExpectedHeaders).toContain("course_fit_decision");
    expect(csoPracticeAssessmentExpectedHeaders).toContain("priority_flag");
  });

  it("reports missing assessment CSV exports as intentionally not import-ready", () => {
    const readiness = buildAssessmentCsvReadinessReport();

    expect(readiness.importReady).toBe(false);
    expect(readiness.missingCsvExportsRequiredBeforeRealImport).toEqual([
      "13_CSO_Assessment_Header.csv",
      "14_CSO_Practice_Assessment.csv",
    ]);
    expect(readiness.sheets).toEqual([
      expect.objectContaining({
        sheetName: "13_CSO_Assessment_Header",
        headerContractDefined: true,
        csvExportPresent: false,
        importReady: false,
        readiness: "not import-ready: missing required CSV export",
      }),
      expect.objectContaining({
        sheetName: "14_CSO_Practice_Assessment",
        headerContractDefined: true,
        csvExportPresent: false,
        importReady: false,
        readiness: "not import-ready: missing required CSV export",
      }),
    ]);
  });

  it("accepts only fixed 1-5 Current Practice Score values", () => {
    expect(fixedCurrentPracticeScoreValues).toEqual([1, 2, 3, 4, 5]);

    for (const validScore of [1, 2, 3, 4, 5, "1", "2", "3", "4", "5"]) {
      expect(isValidCurrentPracticeScore(validScore)).toBe(true);
      expect(validateCompletedPracticeAssessmentScore(validScore).ok).toBe(true);
    }

    for (const invalidScore of [0, 6, 10, "90%", "2.5", "", " ", null]) {
      expect(isValidCurrentPracticeScore(invalidScore)).toBe(false);
      expect(validateCompletedPracticeAssessmentScore(invalidScore).ok).toBe(
        false,
      );
    }
  });

  it("defines required assessment header and practice row fields", () => {
    expect(csoAssessmentHeaderRequiredFields).toContain("assessment_id");
    expect(csoAssessmentHeaderRequiredFields).toContain("cso_id");
    expect(csoPracticeAssessmentRequiredFields).toContain("assessment_detail_id");
    expect(csoPracticeAssessmentRequiredFields).toContain(
      "capacity_practice_area_id",
    );

    expect(
      validateRequiredFields(
        {
          assessment_id: "A-1",
          program_id: "P-1",
          cohort_id: "",
          cso_id: "CSO-1",
          assessment_round: "baseline",
          assessment_type: "initial",
          assessment_status: "complete",
        },
        csoAssessmentHeaderRequiredFields,
      ),
    ).toEqual(["cohort_id"]);

    expect(
      validateRequiredFields(
        {
          assessment_detail_id: "AD-1",
          assessment_id: "A-1",
          cso_id: "CSO-1",
          core_capacity_area_id: "CCA-1",
          core_capacity_area_name: "Governance",
          capacity_practice_area_id: "",
          capacity_practice_area_name: "Board practice",
          current_practice_score_1_to_5: "",
          safe_for_dashboard: true,
          data_quality_check: "reviewed",
        },
        csoPracticeAssessmentRequiredFields,
      ),
    ).toEqual([
      "capacity_practice_area_id",
      "current_practice_score_1_to_5",
    ]);
  });

  it("represents one row per CSO per Capacity Practice Area", () => {
    expect(csoPracticeAssessmentRowContract).toEqual({
      description:
        "One row per CSO per Capacity Practice Area within an assessment.",
      uniqueBy: ["assessment_id", "cso_id", "capacity_practice_area_id"],
    });
  });

  it("defines practice row relationships to header and taxonomy sheets", () => {
    expect(csoPracticeAssessmentRelationships.assessmentHeader).toEqual({
      from: "assessment_id",
      toSheet: "13_CSO_Assessment_Header",
      to: "assessment_id",
      required: true,
    });
    expect(csoPracticeAssessmentRelationships.coreCapacityArea).toEqual({
      from: "core_capacity_area_id",
      toSheet: "08_Core_Capacity_Areas",
      to: "core_capacity_area_id",
      required: true,
    });
    expect(csoPracticeAssessmentRelationships.capacityPracticeArea).toEqual({
      from: "capacity_practice_area_id",
      toSheet: "09_Capacity_Practice_Areas",
      to: "capacity_practice_area_id",
      required: true,
    });
  });

  it("keeps dashboard-facing fields on a safe allowlist", () => {
    expect(csoAssessmentDashboardSafeFields).toContain("safe_summary_for_dashboard");
    expect(csoAssessmentDashboardSafeFields).toContain("safe_for_dashboard");
    expect(csoAssessmentDashboardSafeFields).toContain(
      "current_practice_score_1_to_5",
    );

    for (const unsafeField of csoAssessmentUnsafeDashboardFields) {
      expect(csoAssessmentDashboardSafeFields).not.toContain(unsafeField);
    }

    expect(csoAssessmentDashboardSafeFields).not.toContain("raw_interview_notes");
    expect(csoAssessmentDashboardSafeFields).not.toContain("raw_fgd_notes");
    expect(csoAssessmentDashboardSafeFields).not.toContain(
      "safeguarding_case_details",
    );
    expect(csoAssessmentDashboardSafeFields).not.toContain("personal_data");
    expect(csoAssessmentDashboardSafeFields).not.toContain(
      "exact_sensitive_locations",
    );
    expect(csoAssessmentDashboardSafeFields).not.toContain(
      "unsafe_organizational_vulnerabilities",
    );
    expect(csoAssessmentDashboardSafeFields).not.toContain(
      "raw_evidence_content",
    );
    expect(csoAssessmentDashboardSafeFields).not.toContain(
      "internal_unreviewed_validation_notes",
    );
  });

  it("keeps Priority Capacity Gaps as the bridge instead of raw assessment rows", () => {
    expect(priorityCapacityGapsBridge.sheetName).toBe(
      "15_Priority_Capacity_Gaps",
    );
    expect(priorityCapacityGapsBridge.bridgesTo).toEqual([
      "K/S/M/E routing",
      "course-fit decisions",
      "course pipeline planning",
    ]);
    expect(csoAssessmentDryRunBehavior.usesPriorityCapacityGapsForCoursePlanning)
      .toBe(true);
    expect(csoAssessmentDryRunBehavior.rawAssessmentRowsAutomaticallyBecomeCourses)
      .toBe(false);
  });

  it("does not define product behavior for database import, courses, or handovers", () => {
    expect(csoAssessmentDryRunBehavior).toEqual({
      importsToDatabase: false,
      createsCourses: false,
      createsAnalysisHandovers: false,
      usesPriorityCapacityGapsForCoursePlanning: true,
      rawAssessmentRowsAutomaticallyBecomeCourses: false,
    });
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  analysisCsvDirectory,
  analysisWorkbookPath,
  availableCsvExports,
  expectedWorkbookSheets,
  fixedCurrentPracticeScoreValues,
  getWorkbookSheetsByLayer,
  inspectWorkbookSheetNames,
  missingCsvExports,
  parseCsvHeader,
  priorityCapacityGapsBridge,
  validateCsvHeader,
  workbookWorkflowFieldsArePlatformConcerns,
} from "./workbook-contract";

describe("DEC Capacity Analysis workbook/import contract", () => {
  it("classifies the final workbook sheets by import layer", () => {
    expect(getWorkbookSheetsByLayer("reference/taxonomy").map(getSheetName)).toEqual([
      "Dropdown_Lists",
      "02_Score_Scale_1_to_5",
      "03_ENUM_Helper",
      "04_Programs",
      "05_Cohorts",
      "06_CSO_Registry",
      "07_Target_Learner_Groups",
      "08_Core_Capacity_Areas",
      "10_Indicator_Standards",
      "09_Capacity_Practice_Areas",
      "11_Course_Fit_Rules",
      "12_Verified_Achievement_Map",
    ]);
    expect(getWorkbookSheetsByLayer("main data-entry").map(getSheetName)).toEqual([
      "13_CSO_Assessment_Header",
      "14_CSO_Practice_Assessment",
      "15_Priority_Capacity_Gaps",
      "16_Evidence_Sources",
      "17_Document_Evidence",
      "18_Priority_Capacity_Actions",
    ]);
    expect(
      getWorkbookSheetsByLayer("dashboard-ready summary").map(getSheetName),
    ).toEqual([
      "19_CSO_Capacity_Summary",
      "20_CSO_Overall_Summary",
      "21_All_CSO_Aggregated",
      "22_Course_Pipeline_Data",
    ]);
    expect(
      getWorkbookSheetsByLayer("relationship/documentation").map(getSheetName),
    ).toEqual(["01_README", "23_Relationships"]);
  });

  it("matches workbook sheet names without adding a spreadsheet dependency", () => {
    expect(existsSync(analysisWorkbookPath)).toBe(true);
    expect(inspectWorkbookSheetNames()).toEqual(
      expectedWorkbookSheets.map((sheet) => sheet.sheetName),
    );
  });

  it("validates headers for existing CSV exports", () => {
    for (const csvExport of availableCsvExports) {
      const csvPath = join(analysisCsvDirectory, csvExport.fileName);
      const actualHeaders = parseCsvHeader(readFileSync(csvPath, "utf8"));

      expect(
        validateCsvHeader(actualHeaders, csvExport.expectedHeaders),
        csvExport.fileName,
      ).toEqual({
        matches: true,
        missingHeaders: [],
        unexpectedHeaders: [],
      });
    }
  });

  it("reports missing CSV exports intentionally instead of failing the contract", () => {
    expect(missingCsvExports.map((csvExport) => csvExport.sheetName)).toEqual([
      "01_README",
      "04_Programs",
      "05_Cohorts",
      "06_CSO_Registry",
      "07_Target_Learner_Groups",
      "13_CSO_Assessment_Header",
      "14_CSO_Practice_Assessment",
      "15_Priority_Capacity_Gaps",
      "16_Evidence_Sources",
      "17_Document_Evidence",
      "18_Priority_Capacity_Actions",
      "21_All_CSO_Aggregated",
      "22_Course_Pipeline_Data",
      "23_Relationships",
    ]);
    expect(missingCsvExports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sheetName: "15_Priority_Capacity_Gaps",
          layer: "main data-entry",
        }),
      ]),
    );
  });

  it("keeps Current Practice Score fixed to one through five", () => {
    expect(fixedCurrentPracticeScoreValues).toEqual([1, 2, 3, 4, 5]);
    expect(fixedCurrentPracticeScoreValues).not.toContain(0);
    expect(fixedCurrentPracticeScoreValues).not.toContain(10);
    expect(fixedCurrentPracticeScoreValues).not.toContain(90);
  });

  it("treats Priority Capacity Gaps as the bridge to K/S/M/E and course-fit", () => {
    expect(priorityCapacityGapsBridge).toMatchObject({
      sheetName: "15_Priority_Capacity_Gaps",
      bridgesTo: [
        "K/S/M/E routing",
        "course-fit decisions",
        "course pipeline planning",
      ],
    });
    expect(priorityCapacityGapsBridge.rule).toContain(
      "raw assessment rows do not automatically become courses",
    );
  });

  it("keeps workbook workflow fields separate from platform gates and locks", () => {
    expect(
      workbookWorkflowFieldsArePlatformConcerns.workbookDoesNotControl,
    ).toEqual([
      "approval",
      "locking",
      "handover",
      "audit trail",
      "roles",
      "permissions",
    ]);
    expect(workbookWorkflowFieldsArePlatformConcerns.rule).toContain(
      "do not replace platform workflow gates",
    );
  });

  it("does not define certificate, proof, achievement, route, or monitoring behavior", () => {
    const contractText = JSON.stringify({
      expectedWorkbookSheets,
      availableCsvExports,
      missingCsvExports,
      priorityCapacityGapsBridge,
      workbookWorkflowFieldsArePlatformConcerns,
    });

    expect(contractText).not.toContain("learnerCertificate");
    expect(contractText).not.toContain("ProofSubmission");
    expect(contractText).not.toContain("issueVerifiedAchievement");
    expect(contractText).not.toContain("/review/");
    expect(contractText).not.toContain("CourseMonitoringRecord");
  });
});

function getSheetName(sheet: { sheetName: string }) {
  return sheet.sheetName;
}

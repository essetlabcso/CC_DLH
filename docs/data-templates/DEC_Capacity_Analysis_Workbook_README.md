# DEC Capacity Analysis Data Entry Workbook — README / Schema Note

## Purpose

This folder contains the final offline/import data-entry workbook for DEC CSO capacity analysis:

```text
DEC_Capacity_Analysis_Data_Entry_Workbook_Final.xlsx
```

The workbook is the operational template for capturing final, cleaned, validated CSO capacity diagnosis data after offline analysis, triangulation, validation, and synthesis are completed outside the platform.

It should be used as an import/data-entry reference for the DEC Learning Hub Analysis Phase, not as a full platform workflow database.

## Source-of-truth relationship

This workbook supersedes earlier single-record workbook assumptions for offline/import data capture.

Where earlier Markdown specifications refer to `sub-capacity`, Codex should interpret the final workbook terminology as:

```text
sub-capacity = Capacity Practice Area
```

Where earlier specifications imply one final Analysis Record per capacity gap, Codex should distinguish between:

```text
CSO_Practice_Area_Assessment_Data = full scoring dataset, one row per CSO per Capacity Practice Area
Priority_Capacity_Gaps = selected priority gaps that may proceed to K/S/M/E routing, course-fit, and course pipeline planning
Platform Analysis Records / Handovers = application-level workflow records derived from approved priority gaps
```

## Core implementation rules

1. Use **Core Capacity Area** for the nine DEC capacity areas.
2. Use **Capacity Practice Area** instead of `sub-capacity` in workbook/import/data-entry contexts.
3. The main assessment dataset is **one row per CSO per Capacity Practice Area**.
4. Current Practice Score uses a fixed **1–5 scale only**.
5. Do not introduce alternative score scales such as 0–100 or 1–10 for the main current-practice scoring model.
6. Scores must aggregate upward into:
   - CSO × Core Capacity Area summaries;
   - CSO overall summaries;
   - all-CSO / cohort dashboard summaries.
7. `Priority_Capacity_Gaps` identifies the subset of assessed gaps that move into:
   - K/S/M/E diagnosis;
   - course-fit decision;
   - recommended intervention route;
   - course pipeline planning;
   - evaluation and monitoring anchors.
8. Platform workflow fields such as approval, locking, Analysis-to-Design handover, audit trail, user roles, permissions, and detailed review actions remain **application-level concerns**, not workbook data-entry requirements.
9. Sensitive evidence should be summarized safely. Do not import raw interview notes, raw FGD notes, real safeguarding case details, personal data, or unsafe organizational vulnerability details into dashboard-facing fields.
10. The workbook should support dashboard-safe aggregation without turning CSO capacity data into ranking, shaming, or donor-surveillance outputs.

## Main workbook table logic

The workbook is organized around four layers.

### 1. Reference and helper tables

These define controlled values and taxonomy:

```text
02_Score_Scale_1_to_5
03_ENUM_Helper
04_Programs
05_Cohorts
06_CSO_Registry
07_Target_Learner_Groups
08_Core_Capacity_Areas
09_Capacity_Practice_Areas
10_Indicator_Standards
11_Course_Fit_Rules
12_Verified_Achievement_Map
```

### 2. Main data-entry tables

These capture final cleaned and validated capacity diagnosis data:

```text
13_CSO_Assessment_Header
14_CSO_Practice_Area_Assessment_Data
15_Priority_Capacity_Gaps
16_Evidence_Sources
17_Document_Evidence_Checklist
18_Priority_Capacity_Actions
```

### 3. Dashboard-ready summary tables / views

These aggregate the scoring data:

```text
19_CSO_Capacity_Area_Summary
20_CSO_Overall_Summary
21_All_CSO_Aggregated_Dashboard_Data
22_Course_Pipeline_Dashboard_Data
```

### 4. Relationship documentation

```text
23_Relationships
```

## Fixed scoring scale

The workbook uses one fixed Current Practice Score scale:

| Score | Label | Interpretation |
|---:|---|---|
| 1 | Nascent | Practice is absent, informal, undocumented, or rarely followed. |
| 2 | Emerging | Some practice exists but is inconsistent, partial, person-dependent, or weakly documented. |
| 3 | Developing | Core practice exists and is used in some teams/projects, but not yet consistent or institutionalized. |
| 4 | Established | Practice is documented, regularly used, understood by relevant staff, and mostly consistent. |
| 5 | Advanced / Adaptive | Practice is institutionalized, reviewed, improved using evidence/feedback, and may support peer learning. |

Suggested dashboard interpretation:

```text
1 = Critical gap
2 = High gap
3 = Moderate gap
4 = Low gap / emerging strength
5 = Strength / possible peer-learning example
```

## Core aggregation rules

For each CSO and each Core Capacity Area:

```text
core_capacity_area_average_score = average of all Current Practice Scores under that Core Capacity Area for that CSO
```

For each CSO overall:

```text
overall_cso_capacity_score = average of the nine Core Capacity Area average scores
```

For cohort/all-CSO dashboards:

```text
average_score_by_capacity_practice_area = average score across all assessed CSOs for that Capacity Practice Area
percent_score_1_or_2 = percentage of assessed CSOs scoring 1 or 2 for that Capacity Practice Area
critical_gap_count = count of rows where score = 1
high_gap_count = count of rows where score = 2
moderate_gap_count = count of rows where score = 3
strength_count = count of rows where score = 4 or 5
```

## K/S/M/E and course-fit use

K/S/M/E and course-fit decisions should be applied especially to priority gaps, not mechanically treated as a reason to turn every low score into a course.

Use these K/S/M/E options:

```text
Knowledge
Skill
Motivation
Environment
Mixed
Unclear / needs further diagnosis
```

Use these course-fit options:

```text
Course-addressable
Partly course-addressable
Blended support recommended
Non-course support required
Further diagnosis needed
Not prioritized for Phase 1
```

Binding rule:

```text
Knowledge and Skill gaps may proceed toward course design if evidence and safeguards are sufficient.
Motivation and Environment gaps should not become Phase 1 courses unless a clearly separable Knowledge/Skill component is recorded.
Mixed gaps may proceed only for the explicitly identified Knowledge/Skill component, with non-course components recorded separately.
```

## Recommended Codex interpretation

When using this workbook for implementation, Codex should:

1. inspect the workbook sheets and column headers;
2. preserve the workbook terminology and table structure;
3. use `Capacity_Practice_Areas` as the assessable taxonomy level;
4. use `CSO_Practice_Area_Assessment_Data` as the main scoring/import dataset;
5. use `Priority_Capacity_Gaps` as the bridge from capacity diagnosis to course pipeline planning;
6. implement score aggregation logic for dashboards;
7. keep approval, locking, handover, audit trail, and permissions in the application database and platform workflow, not in the workbook template;
8. keep sensitive data safe by default and use dashboard-safe summaries for sensitive findings.

## Suggested repo placement

Recommended placement:

```text
docs/data-templates/
  DEC_Capacity_Analysis_Data_Entry_Workbook_Final.xlsx
  DEC_Capacity_Analysis_Workbook_README.md
```

Optional CSV exports for easier Codex inspection and Git diffing:

```text
docs/data-templates/csv/
  02_Score_Scale_1_to_5.csv
  03_ENUM_Helper.csv
  08_Core_Capacity_Areas.csv
  09_Capacity_Practice_Areas.csv
  10_Indicator_Standards.csv
  11_Course_Fit_Rules.csv
  12_Verified_Achievement_Map.csv
  13_CSO_Assessment_Header.csv
  14_CSO_Practice_Assessment.csv
```

These CSV files are template and inspection assets only. Their presence in the repository does not enable database import, automatic course creation, or automatic Analysis Handover creation.

## Short Codex prompt

```text
Please review docs/data-templates/DEC_Capacity_Analysis_Data_Entry_Workbook_Final.xlsx together with docs/data-templates/DEC_Capacity_Analysis_Workbook_README.md.

Treat the workbook as the final offline/import data-entry model for DEC CSO capacity analysis. Align the Analysis Phase implementation with its core structure: one CSO assessment row per Capacity Practice Area, fixed 1–5 Current Practice Score, score aggregation by Core Capacity Area and CSO, and Priority_Capacity_Gaps as the bridge to K/S/M/E routing, course-fit, and course pipeline planning.

Do not treat platform workflow fields such as approval, locking, handover, audit trail, and permissions as workbook requirements; those remain application-level concerns.
```

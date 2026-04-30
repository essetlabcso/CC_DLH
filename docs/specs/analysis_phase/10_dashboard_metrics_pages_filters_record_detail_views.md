# Output 10 — Dashboard Metrics, Pages, Filters, and Record Detail Views

## 1. Purpose of this output

This output translates the Native Analysis Dashboard into a more detailed implementation-ready dashboard specification. It defines the dashboard metrics, pages, filters, calculations, record lists, and Analysis Record Detail View needed for the DEC Learning Hub Analysis Phase.

This output should be read together with Output 11, but it goes deeper into:

- exact metrics and calculations;

- page-by-page content;

- filter logic;

- table/list columns;

- record-detail sections;

- drill-down behavior;

- status labels;

- dashboard safety rules;

- native in-platform implementation readiness.

The dashboard must remain native inside the DEC Learning Hub platform, using the SQL/platform database as the source of truth. The dashboard must not be specified as Power BI or an embedded external BI layer.

## 2. Dashboard source records

The dashboard should draw from the structured Analysis data model.

| Dashboard data source | Used for |
| --- | --- |
| analysis_records | Total records, status, priority, gap, baseline, desired practice, program/cohort context |
| analysis_capacity_links | Capacity area, sub-capacity, indicator/standard |
| analysis_evidence_assessment | triangulation, validation, confidence, evidence limitations |
| analysis_evidence_sources | evidence source type counts and summaries |
| analysis_ksme_diagnoses | Knowledge, Skill, Motivation, Environment, Mixed, separable K/S components |
| analysis_course_fit_decisions | course-fit, intervention route, Design readiness, blocking reasons |
| analysis_safeguard_reviews | risk flags, sensitivity, visibility, specialist review |
| analysis_evaluation_anchors | final test focus, proof possibility, monitoring signals, limitation note |
| analysis_dashboard_flags | safe dashboard label, safe summary, visibility mode |
| analysis_to_design_handovers | handover readiness, created/locked/used-in-Design state |
| analysis_workflow_events | audit history, returns, revisions, review actions |

## 3. Metric library

### 3.1 Executive and pipeline metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Total Analysis Records | All Analysis Records created in the system | Count all analysis_records.id | KPI card |
| Draft Records | Records still being prepared | status = draft | KPI card / funnel |
| Submitted Records | Records submitted for review | status = submitted_for_review | KPI card / funnel |
| Validated Gaps | Records validated by stakeholders/reviewers | validation_status IN (validated, validated_with_revisions) | KPI card |
| Approved Records | Records approved but not necessarily locked | status = approved | KPI card |
| Approved and Locked Records | Records approved and locked as source of truth | status = approved_locked OR lock_status = locked | KPI card |
| Handover-Ready Records | Records ready to create Analysis-to-Design Handover | handover_status = ready_for_handover | KPI card |
| Handover Created | Handover exists but may not yet be used | handover_status = created OR locked | KPI card |
| Used in Design | Records already selected for course Design | handover_status = used_in_design OR status = used_in_design | KPI card |
| Blocked from Design | Records that cannot unlock Design | status = blocked_from_design OR course_design_readiness = blocked | KPI card |
| Records Needing More Evidence | Evidence insufficient for approval | validation_status = needs_more_evidence OR evidence_confidence_level = low | KPI card |
| Specialist Review Required | Records needing safeguarding/civic-space/data review | specialist_review_required = true | KPI card |

### 3.2 Capacity metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Gaps by Capacity Area | Number of Analysis Records under each DEC capacity area | Count records grouped by capacity_area where capacity_link_type = primary | Bar chart |
| Gaps by Sub-Capacity | Number of records by sub-capacity | Count grouped by sub_capacity | Ranked table |
| Priority Gaps by Capacity Area | High-priority records by area | Count where priority_level = priority_a grouped by capacity_area | Bar/heatmap |
| Course-Addressable Gaps by Area | Course-fit viable records by capacity area | Count where course-fit is course-addressable or partly | Stacked bar |
| Non-Course Gaps by Area | Records routed away from course design | Count where course_fit_decision = non_course_route grouped by area | Stacked bar |
| Capacity Area Coverage | Which of the nine areas have validated records | Distinct capacity areas with validated records | Coverage grid |
| Indicator/Standard Coverage | Records linked to indicator/standard references | Count where indicator_or_standard_reference IS NOT NULL | Table/card |

### 3.3 K/S/M/E metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Knowledge Gaps | Main route is Knowledge | primary_ksme_route = knowledge | KPI / chart segment |
| Skill Gaps | Main route is Skill | primary_ksme_route = skill | KPI / chart segment |
| Knowledge + Skill Gaps | Main route combines K and S | primary_ksme_route = knowledge_skill | KPI / chart segment |
| Motivation Gaps | Main route is Motivation | primary_ksme_route = motivation | KPI / chart segment |
| Environment Gaps | Main route is Environment | primary_ksme_route = environment | KPI / chart segment |
| Mixed Gaps | Route is Mixed | primary_ksme_route = mixed | KPI / chart segment |
| Unclear Diagnosis | Root cause not yet clear | primary_ksme_route = unclear | Alert card |
| Mixed with Separable K/S | Mixed records with course-addressable component | primary_ksme_route = mixed AND separable_ks_component_exists = true | KPI / table |
| M/E Blocked Correctly | Motivation/Environment without K/S component blocked | route in M/E AND separable K/S = false AND Design blocked | Quality metric |
| K/S/M/E–Course-Fit Mismatch | Route and course-fit decision conflict | Example: M/E-only + course-addressable | Warning metric |

### 3.4 Course-fit metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Course-Addressable | Records suitable for course design | course_fit_decision = course_addressable | KPI / donut |
| Partly Course-Addressable | Records suitable only for separable K/S component | course_fit_decision = partly_course_addressable | KPI / donut |
| Non-Course Route | Records routed to non-course support | course_fit_decision = non_course_route | KPI / donut |
| Further Diagnosis Needed | Records needing more analysis | course_fit_decision = needs_further_diagnosis | KPI / alert |
| Not Suitable / Archived | Records retained but not active for Phase 1 | course_fit_decision IN (not_suitable_phase1, archive_strategic_learning) | KPI |
| Course-Fit Rate | Share of validated records that are fully/partly course-addressable | (course-addressable + partly) / validated records | Percentage |
| Non-Course Route Rate | Share of validated records routed outside course creation | non-course route / validated records | Percentage |
| Complementary Support Count | Records needing support beyond course | Count where complementary_support_note IS NOT NULL or multiple intervention routes | KPI/table |

### 3.5 Evidence and validation metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| High Confidence Records | Strong evidence records | evidence_confidence_level = high | KPI |
| Medium Confidence Records | Some evidence but limitations remain | evidence_confidence_level = medium | KPI |
| Low Confidence Records | Weak evidence | evidence_confidence_level = low | Alert KPI |
| Confirmed Triangulation | Multiple sources confirm gap | triangulation_status = confirmed | KPI/chart |
| Partly Confirmed | Evidence supports but details need refinement | triangulation_status = partly_confirmed | Chart |
| Reframed Records | Original gap was revised after evidence | triangulation_status = reframed | Table |
| Contradicted Records | Evidence conflicts significantly | triangulation_status = contradicted | Alert list |
| Validation Rate | Share of submitted records validated | Validated records ÷ submitted records | Percentage |
| Validation with Revisions | Validated but changed through validation | validation_status = validated_with_revisions | Table/card |
| Evidence Source Mix | Count of source types used | Group by evidence_type | Bar chart |
| Average Evidence Source Count | Average number of source types per record | Avg evidence_source_count | KPI |

### 3.6 Safeguards and visibility metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Low Sensitivity Records | Standard risk records | sensitivity_level = low | Chart segment |
| Moderate Sensitivity Records | Some restrictions needed | sensitivity_level = moderate | Chart segment |
| High Sensitivity Records | Specialist review likely required | sensitivity_level = high | Alert KPI |
| Do Not Proceed Records | Too risky in current form | sensitivity_level = do_not_proceed | Alert KPI |
| Safeguard-Flagged Records | Any risk flag other than none | risk_flags contains any risk | KPI |
| Specialist Review Pending | Risk review not yet cleared | specialist_review_required = true AND status != cleared | Queue |
| Anonymized Records | Records masked in dashboard | anonymization_required = true | KPI |
| Aggregated-Only Records | Counted but no detail shown | visibility_restriction = aggregated_only | KPI |
| Do-Not-Display Records | Hidden until cleared or archived | visibility_restriction = do_not_display | Alert |
| AI-Restricted Records | Records limited from AI context | ai_use_restriction != safe_to_use_as_approved_context | KPI/table |
| Proof-Safety Concern Records | Practical proof may create risk | risk_flags contains proof safety concern | Table |

### 3.7 Design readiness metrics

| Metric | Definition | Calculation / condition | Display format |
| --- | --- | --- | --- |
| Ready for Design | Approved, locked, course-fit valid, safeguards cleared | design_reuse_allowed = true and handover ready | KPI |
| Ready with Conditions | Mixed/partly course-addressable records with conditions | course_design_readiness = ready_with_conditions | KPI/table |
| Not Ready | Missing evidence, validation, approval, or fields | course_design_readiness = not_ready | KPI |
| Blocked | Cannot proceed due to route, course-fit, or risk | course_design_readiness = blocked | KPI |
| Specialist Review Required | Design blocked until specialist review | course_design_readiness = specialist_review_required | KPI |
| Handover Conversion Rate | Used in Design ÷ handover-ready records | Count used in Design / handover-ready | Percentage |
| Returned to Analysis | Records sent back after Design/Review concern | workflow event = returned_to_analysis | Table/KPI |

## 4. Dashboard pages and content specification

## Page 1 — Executive Overview

### Purpose

Provide a high-level, decision-ready overview of the Analysis Phase pipeline.

### Required KPI cards

| Card | Click-through destination |
| --- | --- |
| Total Analysis Records | Filtered record list: all records |
| Validated Gaps | Evidence and Validation page |
| Approved and Locked Records | Design Readiness page |
| Ready for Design | Ready-for-Design table |
| Course-Addressable Gaps | Course-Fit Pipeline page |
| Partly Course-Addressable Gaps | Course-Fit Pipeline page |
| Non-Course Route Gaps | Course-Fit Pipeline page |
| High-Risk Records | Safeguards page |
| Records Needing More Evidence | Evidence page |

### Required visuals

| Visual | Data shown |
| --- | --- |
| Analysis pipeline funnel | Draft, submitted, validated, approved, locked, handover-ready, used-in-Design |
| Course-fit donut | Course-addressable, partly, non-course, further diagnosis, archived |
| Capacity area bar chart | Count of validated gaps by primary capacity area |
| K/S/M/E stacked chart | Count by K/S/M/E route |
| Risk alert panel | High risk, specialist review pending, do-not-display |
| Priority A table | Top priority records with readiness, capacity area, and course-fit |

### Primary user actions

- Open validated gap list.

- Open ready-for-Design records.

- Review high-risk records.

- Review records needing evidence.

- Drill into capacity area or K/S/M/E pages.

## Page 2 — Capacity Area Analysis

### Purpose

Show how validated gaps are distributed across the nine DEC capacity areas, sub-capacities, and indicator links.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Capacity area horizontal bar chart | Gap count by nine DEC capacity areas |
| Sub-capacity ranked table | Top sub-capacities by validated gap count |
| Capacity area × course-fit heatmap | Course-addressable, partly, non-course, diagnosis needed by area |
| Capacity area × K/S/M/E stacked chart | Root causes by capacity area |
| Indicator/standard coverage table | Records with indicator/standard references |
| Capacity area priority matrix | Capacity area, priority level, evidence confidence, Design readiness |

### Required table columns

| Column |
| --- |
| Capacity area |
| Sub-capacity |
| Validated gap count |
| Priority A count |
| Course-addressable count |
| Partly course-addressable count |
| Non-course route count |
| High-risk count |
| Design-ready count |
| Main target learner groups |

## Page 3 — K/S/M/E Diagnosis

### Purpose

Show the root-cause diagnosis of capacity gaps and ensure course-fit discipline.

### Required visuals

| Visual | Data shown |
| --- | --- |
| K/S/M/E distribution donut | Knowledge, Skill, Knowledge + Skill, Motivation, Environment, Mixed, Unclear |
| Route × course-fit matrix | Diagnosis route compared with course-fit decision |
| Mixed-gap table | Mixed gaps, separable K/S component, non-course component |
| Motivation/Environment blocked list | Correctly blocked non-course gaps |
| Mismatch warning table | Records where route and course-fit conflict |
| Unclear diagnosis alert list | Records requiring further diagnosis |

### Required warning conditions

| Warning | Trigger |
| --- | --- |
| Motivation-only course risk | primary_ksme_route = motivation and course_fit_decision = course_addressable |
| Environment-only course risk | primary_ksme_route = environment and course_fit_decision = course_addressable |
| Mixed without separable K/S | primary_ksme_route = mixed and separable_ks_component_exists = false |
| Unclear diagnosis | primary_ksme_route = unclear |
| Missing component field | K/S/M/E route selected but corresponding component field empty |

### Required table columns

| Column |
| --- |
| Record title |
| Capacity area |
| K/S/M/E route |
| Knowledge component |
| Skill component |
| Motivation component |
| Environment component |
| Separable K/S component |
| Course-fit decision |
| Design readiness |
| Warning status |

## Page 4 — Course-Fit Pipeline

### Purpose

Show whether validated gaps should proceed into course design, blended support, non-course routing, or further diagnosis.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Course-fit pipeline funnel | Validated → course-addressable/partly → approved → locked → handover-ready → used in Design |
| Course-fit distribution chart | Course-addressable, partly, non-course, further diagnosis, archived |
| Intervention route bar chart | Digital course, mentoring, coaching, TA, systems strengthening, leadership, safeguards, enabling environment |
| Partly course-addressable table | Separable K/S and complementary support |
| Non-course route table | Motivation/Environment/systemic barriers |
| Blocked records table | Blocking reason and next action |

### Required table columns

| Column |
| --- |
| Record title |
| Capacity area |
| K/S/M/E route |
| Course-fit decision |
| Separable K/S component |
| Recommended intervention route |
| Complementary support note |
| Course priority |
| Design readiness |
| Blocking reason |
| Next action |

## Page 5 — CSO / Cohort / Region Comparison

### Purpose

Show safe comparison of Analysis patterns by CSO, cohort, region, organization type, or target learner group.

### Safety requirement

This page must respect all visibility and anonymization settings. It should not create public rankings or expose sensitive organizational weaknesses.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Cohort comparison cards | Records by cohort/program |
| Target learner group chart | Gaps by learner group |
| Safe region chart/list | Regional gap patterns where safe |
| Multi-CSO cluster table | Gaps affecting multiple CSOs |
| Restricted records notice | Count of records hidden/anonymized/aggregated |

### Required table columns

| Column |
| --- |
| Safe CSO/cohort label |
| Capacity area |
| Sub-capacity |
| Gap count |
| Priority count |
| Course-addressable count |
| High-risk count |
| Design-ready count |
| Visibility mode |

### Display restrictions

| Condition | Display behavior |
| --- | --- |
| organization_visibility_mode = anonymized | Use anonymized label |
| visibility_restriction = aggregated_only | Count in aggregate but hide detail |
| visibility_restriction = do_not_display | Exclude from page except admin/specialist queue |
| Small subgroup exposes identity | Aggregate upward to cohort/program level |

## Page 6 — Evidence Strength and Validation

### Purpose

Show whether Analysis Records are credible enough to guide course design.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Evidence confidence cards | High, medium, low, not confirmed, unsafe to confirm fully |
| Triangulation status chart | Confirmed, partly, reframed, contradicted, not confirmed, unsafe |
| Validation status chart | Validated, revised, needs evidence, not validated, limited, specialist required |
| Evidence source mix chart | Self-assessment, KII, FGD, document review, validation workshop, etc. |
| Weak evidence table | Records blocked due to evidence weakness |
| Reframed records table | Records whose gap statement changed after triangulation |

### Required table columns

| Column |
| --- |
| Record title |
| Capacity area |
| Evidence source count |
| Evidence source types |
| Triangulation status |
| Validation status |
| Evidence confidence |
| Evidence limitation |
| Validation date |
| Next action |

### Dashboard rule

Records with low confidence, unconfirmed triangulation, contradicted evidence, or missing validation must not appear as Design-ready.

## Page 7 — Safeguards and Risk Flags

### Purpose

Show records that require safety controls before dashboard display, Design handover, AI use, or practical proof planning.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Risk flag cards | Safeguarding, civic-space, political, personal data, organizational vulnerability, AI restriction, proof safety |
| Sensitivity level chart | Low, moderate, high, do not proceed |
| Specialist review queue | Pending, cleared, returned, blocked |
| Visibility restriction table | Standard, restricted, anonymized, aggregated only, do not display |
| Risk by capacity area heatmap | Where sensitive records cluster |
| AI/proof restriction table | Records with AI or proof safety limits |

### Required table columns

| Column |
| --- |
| Record title or safe label |
| Capacity area |
| Risk flags |
| Sensitivity level |
| Visibility restriction |
| Specialist review type |
| Specialist review status |
| AI use restriction |
| Practical proof safety note |
| Design readiness |
| Required action |

## Page 8 — Design Readiness

### Purpose

Show which approved Analysis Records can unlock Design and why other records are blocked.

### Required visuals

| Visual | Data shown |
| --- | --- |
| Design readiness cards | Ready, ready with conditions, not ready, blocked, specialist review required, used in Design |
| Handover funnel | Approved → locked → handover-ready → handover created → used in Design |
| Ready-for-Design table | Records course creators can select |
| Blocked records table | Blocking reason and required fix |
| Returned records table | Records returned from Design/Review |
| Handover action panel | Create/lock handover where authorized |

### Required table columns

| Column |
| --- |
| Record title |
| Capacity area |
| Target learner group |
| K/S/M/E route |
| Course-fit decision |
| Priority |
| Evidence confidence |
| Safeguards status |
| Lock status |
| Handover status |
| Design readiness |
| Action |

### Action states

| Record condition | Action display |
| --- | --- |
| Approved + locked + handover ready | “Start Design” for authorized creator/admin |
| Approved but not locked | “Lock required” |
| Needs specialist review | “Specialist review required” |
| Motivation/Environment without separable K/S | “Blocked: not course-addressable” |
| Low evidence confidence | “More evidence needed” |
| Already used in Design | “Open linked Design” |

## Page 9 — Analysis Record Detail View

### Purpose

Provide a structured, safe, role-sensitive detail view for one Analysis Record.

## 5. Analysis Record Detail View sections

### 5.1 Header summary

| Field | Display |
| --- | --- |
| Dashboard display label | Safe title |
| Analysis Record code | Human-readable ID |
| Status | Draft/submitted/validated/approved/locked/etc. |
| Capacity area | Primary capacity area |
| Sub-capacity | Specific practice |
| Priority | Priority A/B/C/non-course/not ready |
| Design readiness | Ready/blocked/etc. |
| Sensitivity badge | Low/moderate/high/restricted |
| Handover status | Not ready/ready/created/locked/used |

### 5.2 Gap definition section

| Field |
| --- |
| Validated capacity gap |
| Baseline/current practice |
| Desired practice |
| Practical consequence |
| Existing strengths |
| Gap scope |
| Target learner group |
| Learner constraints |

### 5.3 Evidence section

| Field |
| --- |
| Evidence source summary |
| Evidence source types |
| Evidence source count |
| Triangulation status |
| Validation status |
| Validation method |
| Evidence confidence level |
| Evidence limitations |
| Contradiction note |
| Validation note |

### 5.4 Capacity classification section

| Field |
| --- |
| Primary capacity area |
| Secondary capacity area |
| Sub-capacity |
| Indicator/standard reference |
| Taxonomy confidence |
| Classification note |

### 5.5 K/S/M/E diagnosis section

| Field |
| --- |
| Primary K/S/M/E route |
| Knowledge component |
| Skill component |
| Motivation component |
| Environment component |
| Separable K/S component exists |
| Separable K/S component description |
| Non-course component summary |
| K/S/M/E diagnosis confidence |
| Root-cause note |

### 5.6 Course-fit section

| Field |
| --- |
| Course-fit decision |
| Course-fit rationale |
| Recommended intervention route |
| Complementary support note |
| Suggested course type |
| Course priority level |
| Design blocking reason, if any |

### 5.7 Safeguards and visibility section

| Field |
| --- |
| Risk flags |
| Sensitivity level |
| Unsafe data excluded |
| Anonymization required |
| Visibility restriction |
| Specialist review type |
| Specialist review status |
| Safeguards/no-harm note |
| AI use restriction |
| Practical proof safety note |

### 5.8 Evaluation anchor section

| Field |
| --- |
| Evaluation anchor summary |
| Potential final test focus |
| Potential practical output |
| Practical proof possibility |
| Monitoring signal |
| Limitation/overclaiming note |
| Course improvement signal |

### 5.9 Handover and Design reuse section

| Field |
| --- |
| Design reuse allowed |
| Analysis-to-Design Handover status |
| Lock status |
| Locked fields summary |
| Linked Design record, if any |
| Return-to-Analysis status, if any |

### 5.10 Audit trail section

| Field |
| --- |
| Created by / created at |
| Updated by / updated at |
| Submitted by / submitted at |
| Reviewed by / reviewed at |
| Approved by / approved at |
| Locked by / locked at |
| Specialist review events |
| Handover events |
| Return/revision history |
| Admin override history |

## 6. Record Detail View actions

| Action | Who can see/use | Required condition |
| --- | --- | --- |
| View safe summary | Authorized dashboard users | Record visible to role |
| View full internal detail | DEC Admin / authorized lead / assigned reviewer | Visibility allows full detail |
| Edit draft | Entry user / assigned lead | Draft or returned state |
| Submit for review | Entry user / assigned lead | Required fields complete |
| Request more evidence | Reviewer / DEC lead / admin | Evidence insufficient |
| Request specialist review | Reviewer / DEC lead / admin | Risk flags or uncertainty present |
| Approve record | DEC admin / authorized reviewer | All required checks pass |
| Lock record | DEC admin / authorized lead | Approved status |
| Create handover | DEC admin / authorized lead | Handover readiness true |
| Start Design | Course creator/admin | Approved + locked + handover-ready + role allowed |
| Return to Analysis | Reviewer / DEC lead / admin | Issue discovered |
| Archive | DEC admin | Record inactive/not suitable |
| Export safe summary | Authorized users | Visibility permits export |

## 7. Global filter behavior

### 7.1 Filter types

| Filter type | Examples |
| --- | --- |
| Taxonomy filters | Capacity area, sub-capacity, indicator/standard |
| Workflow filters | status, lock status, handover status, Design readiness |
| Diagnosis filters | K/S/M/E route, separable K/S exists |
| Course-fit filters | course-addressable, partly, non-course, diagnosis needed |
| Evidence filters | confidence, triangulation, validation status, evidence source type |
| Safeguards filters | sensitivity, risk flag, visibility restriction, specialist status |
| Context filters | program, cohort, region, CSO, target learner group |
| Time filters | analysis date, validation date, approval date, lock date |
| Priority filters | Priority A/B/C, non-course priority, not ready, archived |

### 7.2 Filter rules

| Rule | Behavior |
| --- | --- |
| Filters must respect permissions | Do not expose restricted records through counts or labels. |
| Filters should persist across page navigation | User can move from overview to detail with the same filter context. |
| Unsafe filters should be hidden for unauthorized roles | Example: CSO filter hidden if user cannot see CSO identities. |
| Empty states should explain next action | “No records match this filter” plus guidance. |
| Filter chips should be visible | Users should always know what filters are active. |
| Reset filters should be available | One-click clear filter option. |
| Default filters should be role-aware | Creators default to Design-ready records; safeguards reviewers default to risk queue. |

## 8. Status labels and dashboard badges

| Badge | Meaning |
| --- | --- |
| Draft | Record is being prepared. |
| Submitted | Awaiting review. |
| Needs Revision | Returned for correction. |
| Validated | Finding confirmed. |
| Approved | Accepted but not necessarily locked. |
| Locked | Core Analysis fields locked. |
| Handover Ready | Can create or use Analysis-to-Design Handover. |
| Used in Design | Already linked to a Design workflow. |
| Blocked | Cannot proceed to Design. |
| Specialist Review Required | Safeguards or technical review needed. |
| Restricted | Visibility limited. |
| Anonymized | Identifying details hidden. |
| Aggregated Only | Counted but no detail view. |
| High Risk | Sensitive or potentially harmful if exposed. |
| Non-Course Route | Not suitable for course creation as primary response. |

## 9. Drill-down and navigation paths

| Starting point | User clicks | Result |
| --- | --- | --- |
| Executive KPI: Ready for Design | KPI card | Opens Design Readiness page filtered to ready records |
| Capacity area chart | “MEAL” bar | Opens Capacity Area page filtered to MEAL |
| K/S/M/E chart | “Mixed” segment | Opens K/S/M/E page filtered to Mixed |
| Course-fit donut | “Partly course-addressable” | Opens Course-Fit page filtered to partly course-addressable |
| High-risk card | Card | Opens Safeguards page filtered to high risk |
| Evidence confidence card | “Low confidence” | Opens Evidence page filtered to low confidence |
| Record row | Record title | Opens Analysis Record Detail View |
| Record detail | Start Design | Opens Design workflow with selected handover |
| Record detail | Return to Analysis | Opens return modal requiring comment |
| Record detail | Request specialist review | Opens review assignment modal |

## 10. Dashboard safety rules

| Risk | Dashboard rule |
| --- | --- |
| Raw evidence exposure | Do not display raw notes, transcripts, or unsafe documents. |
| CSO shaming | Avoid public ranking or league-table style comparisons. |
| Small-number identification | Aggregate upward where small counts expose CSO identity. |
| Civic-space risk | Restrict exact issue, location, organization, or actor details. |
| Safeguarding risk | Specialist-only safe summaries; no case details. |
| AI leakage | Do not expose AI-restricted content in AI context actions. |
| Unauthorized detail access | Enforce record-level permissions before opening detail view. |
| Export risk | Export only safe summaries, never raw sensitive records. |

## 11. Minimum implementation checklist

| Feature | Required for Phase 1? |
| --- | --- |
| Executive KPI cards | Yes |
| Capacity area chart | Yes |
| K/S/M/E distribution chart | Yes |
| Course-fit distribution chart | Yes |
| Evidence confidence/validation chart | Yes |
| Safeguards risk queue | Yes |
| Design readiness table | Yes |
| Analysis Record Detail View | Yes |
| Global filters | Yes |
| Role-sensitive visibility | Yes |
| Start Design action from ready record | Yes |
| Export safe summary | Optional but useful |
| Advanced drill-through animations | Optional |
| Complex geographic map | Optional/future |
| Donor-safe external dashboard | No, future only |

## 12. Quality Self-Check

| Criterion group | Status | Evidence / note | Revision needed? |
| --- | --- | --- | --- |
| Metrics completeness | Met | Provides executive, capacity, K/S/M/E, course-fit, evidence, safeguards, and Design readiness metric libraries. | No |
| Page-level detail | Met | Defines detailed content for Executive Overview, Capacity Area Analysis, K/S/M/E, Course-Fit, Comparison, Evidence, Safeguards, Design Readiness, and Record Detail View. | No |
| Record detail view | Met | Specifies all major sections, fields, and role-sensitive actions. | No |
| Filter logic | Met | Provides global filters, filter rules, active filter behavior, and role-sensitive restrictions. | No |
| Drill-down behavior | Met | Defines navigation paths from KPI cards, charts, tables, and record actions. | No |
| Safety and visibility | Met | Includes dashboard safety rules for raw evidence, CSO identity, civic-space, safeguarding, exports, and AI leakage. | No |
| Native dashboard decision | Met | Uses native in-platform dashboard logic and avoids Power BI/external BI language. | No |
| K/S/M/E and course-fit discipline | Met | Metrics and pages clearly distinguish K/S/M/E routes and course-fit states, including blocked and mismatch conditions. | No |
| Evidence quality | Met | Includes validation, confidence, triangulation, weak evidence, reframed records, and evidence limitation metrics. | No |
| Implementation readiness | Met | Tables, fields, metrics, filters, and actions are directly usable for Codex dashboard implementation planning. | No |
| DEC-specific grounding | Met | Uses DEC capacity areas, Analysis Records, native dashboard, Design readiness, handover, safeguards, and course-fit workflow. | No |
| Overall quality judgment | Met | Output is ready to serve as the detailed dashboard metrics and record-detail specification section of the operating package. | No |

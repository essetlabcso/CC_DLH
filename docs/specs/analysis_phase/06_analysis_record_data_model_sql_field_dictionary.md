# Output 6 — Analysis Record Data Model and SQL-Ready Field Dictionary

## 1. Purpose of this data model

This data model translates the DEC Learning Hub Analysis Phase into a structured, implementation-ready set of records, fields, relationships, statuses, and dashboard-ready data points.

Its purpose is to help Codex/GPT-5.5, developers, dashboard builders, DEC admins, and capacity/M&E leads implement the Analysis Phase as a structured evidence system, not as an informal notes area.

The model follows the corrected architecture:

Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.

The Native Dashboard Addendum is binding: the dashboard should be built natively inside the DEC Learning Hub platform, not as Power BI or an embedded external BI layer.

## 2. Core data model principle

The Analysis Record is the central object.

Every approved course should trace back to one approved Analysis Record or Analysis-to-Design Handover. The wider DEC workflow already requires traceability from capacity evidence through Analysis, Design, Build, Review, Publish, Learner Runtime, Certificate, Practical Proof, Verified Achievement, Monitoring, and Course Improvement.

The Analysis Record should preserve:

| Traceability layer | What must be preserved |
| --- | --- |
| Capacity taxonomy | Capacity area, sub-capacity, indicator/standard |
| Gap evidence | Validated gap, baseline/current practice, desired practice, evidence summary |
| Root cause | K/S/M/E route, separable Knowledge/Skill component, non-course components |
| Course-fit | Course-addressable, partly course-addressable, non-course route, blocked, further diagnosis |
| Safeguards | Sensitivity level, risk flags, visibility restrictions, no-harm note |
| Dashboard use | KPI grouping, filters, readiness status, record detail view |
| Design reuse | Prefill fields, read-only locked anchors, handover status |
| Governance | approval, locking, review, return, audit trail |

## 3. Recommended high-level database records

The Analysis Phase should be implemented through connected records, not one overloaded free-text table.

| Record / table | Purpose |
| --- | --- |
| analysis_records | Main structured Analysis Record. |
| analysis_evidence_sources | Evidence sources used to validate the gap. |
| analysis_capacity_links | Capacity area, sub-capacity, indicator/standard mapping. |
| analysis_ksme_diagnoses | K/S/M/E root-cause details and separable K/S component. |
| analysis_course_fit_decisions | Course-fit, readiness, and intervention route. |
| analysis_safeguard_reviews | Risk flags, sensitivity, visibility, no-harm, and specialist review fields. |
| analysis_evaluation_anchors | Baseline-to-monitoring link, final test focus, practical proof possibility, monitoring signals. |
| analysis_dashboard_flags | Native dashboard visibility, labels, tags, safe summaries, drill-down readiness. |
| analysis_workflow_events | Review, approval, locking, return, reopen, handover, and audit trail events. |
| analysis_to_design_handovers | Locked handover package used to unlock Design. |
| analysis_record_versions | Version history of approved or revised Analysis Records. |
| analysis_comments | Reviewer, specialist, admin, or data-entry comments. |
| analysis_attachments_metadata | Optional metadata for safe, approved supporting documents; not raw unsafe data. |

For Phase 1, Codex may choose to implement this as fewer physical tables if simpler. However, the logical separation should be preserved so the system remains clean, auditable, dashboard-ready, and workflow-ready.

## 4. Entity relationship overview

| From | Relationship | To | Why it matters |
| --- | --- | --- | --- |
| analysis_records | has many | analysis_evidence_sources | A gap should show which evidence supports it. |
| analysis_records | has one or many | analysis_capacity_links | A record may have primary and secondary capacity links. |
| analysis_records | has one | analysis_ksme_diagnoses | Root-cause logic controls course-fit. |
| analysis_records | has one | analysis_course_fit_decisions | Determines whether Design can unlock. |
| analysis_records | has one | analysis_safeguard_reviews | Safety controls follow the record into workflow. |
| analysis_records | has one | analysis_evaluation_anchors | Monitoring must link back to baseline and desired practice. |
| analysis_records | has one | analysis_dashboard_flags | Controls safe native dashboard display. |
| analysis_records | has many | analysis_workflow_events | Provides audit trail and governance history. |
| analysis_records | has many | analysis_record_versions | Preserves revisions and approved versions. |
| analysis_records | has one or many | analysis_to_design_handovers | Approved records can unlock Design. |
| analysis_to_design_handovers | feeds | Design records | Design should start from locked Analysis anchors. |
| Published courses | reference | Analysis handover ID | Monitoring can connect course outcomes back to Analysis. |

## 5. Main table: analysis_records

This is the main table for each validated capacity gap.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID / cuid | Yes | Primary key. | ar_01h... |
| analysis_record_code | varchar(40) | Yes | Human-readable unique code. | AR-2026-0007 |
| title | varchar(160) | Yes | Short specific record title. | Outcome evidence writing gap |
| program_context_id | FK / nullable | Yes | Links to DEC program, project, or cohort. | prog_csf_01 |
| organization_id | FK / nullable | Conditional | CSO/organization, if safe and relevant. | org_123 |
| organization_visibility_mode | enum | Yes | Whether organization identity can display. | anonymized |
| cohort_id | FK / nullable | Optional | Cohort or group context. | cohort_1 |
| geography_label | varchar(160) | Optional | Region/geography label, if safe. | Addis Ababa cohort |
| prepared_by_user_id | FK | Yes | User who prepared the final record. | user_56 |
| analysis_date | date | Yes | Final synthesis date. | 2026-04-29 |
| validated_capacity_gap | text | Yes | Specific validated gap statement. | Program officers cannot write short outcome evidence statements... |
| baseline_current_practice | text | Yes | Current practice or baseline. | Reports mostly list activities and participant numbers. |
| desired_practice | text | Yes | Realistic improved practice. | Reports include change, source, confidence, and limitation. |
| practical_consequence | text | Recommended | Why the gap matters. | Weak outcome reporting limits learning and donor confidence. |
| existing_strengths | text | Optional | Capacity to build on. | The CSO has regular reporting templates. |
| gap_scope | enum | Yes | Scope of the gap. | multi_cso |
| gap_urgency | enum | Yes | Urgency level. | high |
| priority_level | enum | Yes | Priority category. | priority_a |
| record_sensitivity_mode | enum | Yes | Overall record sensitivity. | restricted |
| status | enum | Yes | Current workflow state. | approved_locked |
| lock_status | enum | Yes | Whether core fields are locked. | locked |
| current_version | integer | Yes | Current record version. | 2 |
| created_at | timestamp | Yes | Created timestamp. | system |
| created_by | FK | Yes | Creator user. | system |
| updated_at | timestamp | Yes | Last update timestamp. | system |
| updated_by | FK | Yes | Last editor. | system |

### Controlled options: gap_scope

| Enum value | User-facing label |
| --- | --- |
| single_learner_group | Single learner group |
| single_cso | Single CSO |
| multiple_csos | Multiple CSOs |
| cohort_wide | Cohort-wide |
| consortium_wide | Consortium-wide |
| region_specific | Region-specific |
| unclear | Unclear / needs more evidence |

### Controlled options: status

| Enum value | User-facing label |
| --- | --- |
| draft | Draft |
| submitted_for_review | Submitted for review |
| needs_revision | Needs revision |
| validated | Validated |
| approved | Approved |
| approved_locked | Approved and locked |
| handover_ready | Handover ready |
| used_in_design | Used in Design |
| blocked_from_design | Blocked from Design |
| specialist_review_required | Specialist review required |
| archived | Archived |

## 6. Table: analysis_capacity_links

This table maps Analysis Records to the DEC capacity taxonomy.

The DEC taxonomy should operate as a workflow backbone across Analysis, Design, Build, Review, Publish, certificates, practical proof, verified achievement, and monitoring dashboards.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK | Yes | Parent Analysis Record. |  |
| capacity_area | enum | Yes | One of nine DEC capacity areas. | meal |
| capacity_link_type | enum | Yes | Primary or secondary. | primary |
| sub_capacity | varchar(180) | Yes | Specific sub-capacity. | Outcome evidence writing |
| indicator_standard_reference | text | Recommended | Indicator, standard, or benchmark. | DG NEAR SO3 / internal MEAL reporting standard |
| taxonomy_confidence | enum | Yes | Confidence in classification. | high |
| classification_note | text | Conditional | Needed if low confidence or secondary link. |  |
| created_at | timestamp | Yes | System timestamp. |  |

### Controlled options: capacity_area

| Enum value | Label |
| --- | --- |
| governance_leadership | Internal Governance and Leadership |
| transparency_accountability | Transparency and Accountability |
| strategy_sustainability | Strategic Planning and Organizational Sustainability |
| finance_resource_mobilization | Financial Management and Resource Mobilization |
| hr_inclusion_safeguarding | Human Resources, Inclusion, and Safeguarding |
| advocacy_civic_engagement | Evidence-Based Advocacy and Civic Engagement |
| meal | Monitoring, Evaluation, Accountability, and Learning |
| digital_data_it | Digital Skills and Data Use / IT Competencies |
| networking_partnerships | Networking, Partnerships, and Collective Action |

## 7. Table: analysis_evidence_sources

This table records the evidence used to support the gap. It should store summaries and metadata, not unsafe raw data.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK | Yes | Parent Analysis Record. |  |
| evidence_type | enum | Yes | Type of evidence. | document_review |
| evidence_label | varchar(180) | Yes | Short label. | Review of three donor reports |
| evidence_summary | text | Yes | Safe summary of evidence. | Reports list activities but rarely describe outcome evidence. |
| evidence_date | date / nullable | Optional | Date of evidence source. | 2026-03-20 |
| source_owner_type | enum | Optional | Source owner category. | cso |
| sensitivity_level | enum | Yes | Sensitivity of evidence. | moderate |
| raw_data_stored | boolean | Yes | Should normally be false. | false |
| raw_data_storage_note | text | Conditional | Required if any attachment exists. |  |
| anonymized | boolean | Yes | Whether summary is anonymized. | true |
| confidence_contribution | enum | Required | How much this source strengthens confidence. | strong |
| created_at | timestamp | Yes | System timestamp. |  |

### Controlled options: evidence_type

self_assessment

key_informant_interview

focus_group_discussion

document_review

work_sample_review

validation_workshop

prior_capacity_assessment

donor_feedback

training_feedback

monitoring_report

evaluation_report

observation

existing_cso_tool

other

## 8. Table: analysis_evidence_assessment

This can be a separate one-to-one table or embedded in analysis_records. It captures triangulation and validation results.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent Analysis Record. |  |
| evidence_source_count | integer | Yes | Number of evidence sources. | 4 |
| evidence_sources_summary | text | Yes | Short safe summary. | Self-assessment, KII, document review, validation workshop. |
| triangulation_status | enum | Yes | Triangulation result. | confirmed |
| validation_status | enum | Yes | Validation result. | validated_with_revisions |
| validation_method | enum / array | Yes | How validation occurred. | stakeholder_workshop |
| validation_date | date | Conditional | Required if validated. | 2026-04-25 |
| validation_note | text | Conditional | Required if revised. | Gap narrowed to outcome evidence writing. |
| evidence_confidence_level | enum | Yes | Overall confidence. | high |
| evidence_limitations | text | Conditional | Required for medium/low confidence. |  |
| contradiction_note | text | Optional | Any unresolved contradiction. |  |

### Controlled options: triangulation_status

confirmed

partly_confirmed

reframed

contradicted

not_confirmed

unsafe_to_verify_fully

### Controlled options: validation_status

validated

validated_with_revisions

needs_more_evidence

not_validated

validation_limited

specialist_validation_required

### Controlled options: evidence_confidence_level

high

medium

low

not_confirmed

unsafe_to_confirm_fully

## 9. Table: analysis_ksme_diagnoses

This table stores the K/S/M/E root-cause diagnosis.

The binding K/S/M/E rule is that Knowledge and Skill gaps are normally course-addressable, while Motivation and Environment gaps should not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly identified and recorded.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent Analysis Record. |  |
| primary_ksme_route | enum | Yes | Main route. | mixed |
| knowledge_component | text | Conditional | Required if route includes Knowledge. | Staff confuse outputs and outcomes. |
| skill_component | text | Conditional | Required if route includes Skill. | Staff cannot write outcome evidence statements. |
| motivation_component | text | Conditional | Required if route includes Motivation. | Reporting seen mainly as donor compliance. |
| environment_component | text | Conditional | Required if route includes Environment. | No regular learning review meeting. |
| separable_ks_component_exists | boolean / nullable | Conditional | Required for Mixed/Motivation/Environment. | true |
| separable_ks_component_description | text | Conditional | Required if separable K/S exists. | Practice writing outcome evidence statements. |
| non_course_component_summary | text | Conditional | Required for Mixed/Motivation/Environment. | Leadership should introduce learning review rhythm. |
| ksme_diagnosis_confidence | enum | Yes | Confidence in diagnosis. | medium |
| root_cause_note | text | Yes | Explanation. | Evidence shows both knowledge confusion and practice gap. |
| design_unlock_allowed_by_ksme | boolean | Yes/system | System-calculated. | true |

### Controlled options: primary_ksme_route

knowledge

skill

knowledge_skill

motivation

environment

mixed

unclear

## 10. Table: analysis_course_fit_decisions

This table determines whether the Analysis Record can move toward Design.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent Analysis Record. |  |
| course_fit_decision | enum | Yes | Course-fit status. | partly_course_addressable |
| course_fit_rationale | text | Yes | Why the decision was made. | Course can address writing skill, but leadership support is needed. |
| recommended_intervention_routes | enum array / join table | Yes | Support route(s). | digital_course, leadership_engagement |
| course_design_readiness | enum | Yes | Readiness to unlock Design. | ready_with_conditions |
| design_blocking_reason | text | Conditional | Required if blocked/not ready. |  |
| complementary_support_note | text | Conditional | Required for partly/non-course. | Management learning review routine needed. |
| suggested_course_type | enum | Conditional | Required if course route selected. | guided_practice_course |
| course_priority_level | enum | Yes | Pipeline priority. | priority_a |
| design_unlock_allowed_by_course_fit | boolean | Yes/system | System-calculated. | true |

### Controlled options: course_fit_decision

course_addressable

partly_course_addressable

non_course_route

needs_further_diagnosis

not_suitable_phase1

archive_strategic_learning

### Controlled options: recommended_intervention_routes

digital_course

course_plus_mentoring

course_plus_coaching

course_plus_template_tool

technical_assistance

leadership_governance_engagement

peer_learning_cohort_support

systems_strengthening

resource_infrastructure_support

safeguarding_specialist_review

civic_space_specialist_review

enabling_environment_action

further_diagnosis

archive_no_action_now

## 11. Table: analysis_safeguard_reviews

This table protects CSO trust, safety, privacy, and visibility.

Annex 12 states that the platform should be safe by default: raw proof should be private, donor visibility should be disabled by default or limited to safe summaries, sensitive data should not be requested unless necessary, and dashboards should avoid exposing personal or sensitive details.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent Analysis Record. |  |
| safeguards_review_required | boolean | Yes | Whether safeguards review is required. | true |
| risk_flags | enum array / join table | Yes | Risk categories. | civic_space_sensitivity, data_safety_issue |
| sensitivity_level | enum | Yes | Overall sensitivity. | moderate |
| unsafe_data_excluded | boolean | Yes | Confirmation unsafe raw data excluded. | true |
| anonymization_required | boolean | Yes | Whether anonymization required. | true |
| visibility_restriction | enum | Yes | Visibility setting. | aggregated_only |
| specialist_review_required | boolean | Yes/system | Auto-calculated from risks. | true |
| specialist_review_type | enum array | Conditional | Required if specialist review required. | civic_space_review |
| specialist_review_status | enum | Conditional | Status if review required. | pending |
| safeguards_no_harm_note | text | Yes | Practical safety note. | Do not show CSO name in comparison charts. |
| ai_use_restriction | enum | Yes | AI context restriction. | safe_summary_only |
| practical_proof_safety_note | text | Conditional | Required if proof possible and risk exists. | Do not request raw complaint logs. |
| safeguards_cleared_for_design | boolean | Yes/system | Whether safety allows Design. | false |

### Controlled options: risk_flags

none_identified

safeguarding_concern

child_protection_sensitivity

gbv_protection_sensitivity

civic_space_sensitivity

political_sensitivity

public_authority_advocacy_sensitivity

personal_data_risk

beneficiary_identifiable_data_risk

organizational_vulnerability_risk

financial_confidential_document_risk

donor_sensitivity

data_safety_issue

ai_prompt_safety_restriction

practical_proof_safety_concern

other

### Controlled options: visibility_restriction

standard_internal_visibility

restricted_dec_admin_assigned_analysis

restricted_capacity_meal_lead

specialist_reviewer_only_until_cleared

anonymized_in_dashboard

aggregated_only

do_not_display_in_dashboard

archived_restricted_record

## 12. Table: analysis_evaluation_anchors

This table connects Analysis to future monitoring.

Annex 11 states that Monitoring and Evaluation should connect learner activity back to the original CSO capacity gap, Analysis baseline, Design performance goal, course version, final test, certificate, practical proof, verified achievement, and course improvement decisions.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent Analysis Record. |  |
| evaluation_anchor_summary | text | Yes | Future progress interpretation. | Progress can be assessed through final test scenarios and worksheet review. |
| potential_final_test_focus | text | Conditional | Required if course route selected. | Distinguish output vs outcome; select strongest evidence statement. |
| potential_practical_output | text | Optional/conditional | Required if practical proof = yes. | Completed outcome evidence worksheet. |
| practical_proof_possibility | enum | Yes | Whether proof may be suitable. | conditional |
| monitoring_signals | enum array / join table | Yes | Signals to track later. | final_test_pass_rate, verified_achievements |
| limitation_overclaiming_note | text | Yes | What not to claim. | Certificate does not prove full CSO MEAL system transformation. |
| course_improvement_signal | text | Optional | Future signal for course revision. | Low performance on scenario questions. |

### Controlled options: monitoring_signals

analysis_to_design_handover_count

course_created_from_record

learner_enrollment

course_completion

final_test_attempts

final_test_pass_rate

certificate_count

average_score

learner_feedback_relevance_score

practical_proof_submissions

verified_achievements

course_improvement_flags

dashboard_record_viewed

record_selected_for_design

other

## 13. Table: analysis_dashboard_flags

This table controls safe display in the native in-platform dashboard.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK unique | Yes | Parent record. |  |
| include_in_native_dashboard | enum | Yes | Dashboard inclusion level. | aggregated_and_detail_authorized |
| dashboard_display_label | varchar(160) | Yes | Safe dashboard label. | Outcome evidence writing gap |
| dashboard_summary | text | Yes | Safe detail summary. | Validated gap in preparing outcome evidence statements. |
| dashboard_filter_tags | text array / join table | Optional | Filter tags. | MEAL, Skill, Priority A |
| allow_capacity_area_charts | boolean | Yes/system | Can count in capacity charts. | true |
| allow_ksme_charts | boolean | Yes/system | Can count in K/S/M/E charts. | true |
| allow_cso_comparison | boolean | Yes/system | Can appear in CSO comparison. | false |
| allow_region_comparison | boolean | Yes/system | Can appear in region comparison. | true |
| allow_record_detail_view | boolean | Yes/system | Can authorized users drill into detail. | true |
| dashboard_visibility_note | text | Optional | Explanation of restrictions. | CSO name hidden in comparison views. |

### Controlled options: include_in_native_dashboard

full_internal_dashboard

aggregated_and_detail_authorized

aggregated_only

anonymized_detail

restricted_specialist_only

do_not_display_until_cleared

do_not_display

## 14. Table: analysis_to_design_handovers

This table becomes the official bridge from Analysis into Design.

| Field name | Suggested type | Required? | Description | Example |
| --- | --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |  |
| analysis_record_id | FK | Yes | Source Analysis Record. |  |
| handover_code | varchar(40) | Yes | Human-readable handover code. | A2D-2026-003 |
| handover_status | enum | Yes | Handover state. | locked |
| approved_analysis_version | integer | Yes | Record version used. | 2 |
| locked_capacity_area | enum | Yes | Copied locked field. | meal |
| locked_sub_capacity | varchar(180) | Yes | Copied locked field. | Outcome evidence writing |
| locked_indicator_standard_reference | text | Recommended | Copied locked field. |  |
| locked_target_learner_group | varchar(180) | Yes | Copied locked field. | Program officers |
| locked_validated_capacity_gap | text | Yes | Copied locked field. |  |
| locked_baseline_current_practice | text | Yes | Copied locked field. |  |
| locked_desired_practice | text | Yes | Copied locked field. |  |
| locked_ksme_route | enum | Yes | Copied locked field. | knowledge_skill |
| locked_separable_ks_component | text | Conditional | Required for Mixed/Motivation/Environment proceeding to Design. |  |
| locked_course_fit_decision | enum | Yes | Copied locked field. | course_addressable |
| locked_complementary_support_note | text | Conditional | Required if partly course-addressable. |  |
| locked_safeguards_no_harm_note | text | Yes | Copied locked field. |  |
| locked_visibility_restriction | enum | Yes | Copied locked field. | aggregated_only |
| locked_evaluation_anchor_summary | text | Yes | Copied locked field. |  |
| created_by | FK | Yes | User who created handover. |  |
| created_at | timestamp | Yes | Created timestamp. |  |
| locked_by | FK | Conditional | User who locked handover. |  |
| locked_at | timestamp | Conditional | Lock timestamp. |  |

### Controlled options: handover_status

not_ready

ready_for_handover

created

locked

used_in_design

returned_to_analysis

blocked

archived

## 15. Table: analysis_workflow_events

This table stores the audit trail.

| Field name | Suggested type | Required? | Description |
| --- | --- | --- | --- |
| id | UUID | Yes | Primary key. |
| analysis_record_id | FK | Yes | Related Analysis Record. |
| event_type | enum | Yes | Workflow event type. |
| from_status | enum | Optional | Prior status. |
| to_status | enum | Optional | New status. |
| performed_by | FK | Yes | User who performed event. |
| performed_at | timestamp | Yes | Event timestamp. |
| comment | text | Optional | Notes or reason. |
| requires_follow_up | boolean | Yes | Whether action is needed. |
| follow_up_due_date | date | Optional | Due date, if any. |

### Controlled options: event_type

created

submitted_for_review

review_assigned

returned_for_revision

revised

validated

approved

locked

handover_created

handover_locked

used_in_design

specialist_review_requested

specialist_review_completed

blocked_from_design

reopened

archived

admin_override

## 16. Dashboard-ready views

The native Analysis Dashboard should be built from structured database views. These are logical views; Codex may implement them as SQL views, Prisma queries, server-side loaders, or application-level aggregations.

### View 1: vw_analysis_executive_overview

| Metric | Source fields |
| --- | --- |
| Total Analysis Records | analysis_records.id |
| Validated gaps | analysis_records.status, analysis_evidence_assessment.validation_status |
| Approved and locked records | analysis_records.status, lock_status |
| Ready for Design | analysis_to_design_handovers.handover_status |
| Blocked from Design | analysis_records.status, course_design_readiness |
| Course-addressable gaps | course_fit_decision |
| Partly course-addressable gaps | course_fit_decision |
| Non-course route gaps | course_fit_decision |
| High-risk records | sensitivity_level, risk_flags |
| Priority A gaps | priority_level |

### View 2: vw_analysis_capacity_area_distribution

| Dimension | Source fields |
| --- | --- |
| Capacity area | analysis_capacity_links.capacity_area |
| Sub-capacity | sub_capacity |
| Primary/secondary link | capacity_link_type |
| Count of gaps | analysis_record_id |
| Priority distribution | priority_level |
| Design readiness | course_design_readiness |

### View 3: vw_analysis_ksme_distribution

| Dimension | Source fields |
| --- | --- |
| K/S/M/E route | primary_ksme_route |
| Separable K/S exists | separable_ks_component_exists |
| Course-fit decision | course_fit_decision |
| Blocked/ready status | course_design_readiness |
| Non-course components | non_course_component_summary |

### View 4: vw_analysis_course_fit_pipeline

| Pipeline stage | Source fields |
| --- | --- |
| Needs more evidence | validation_status, evidence_confidence_level |
| Needs further diagnosis | course_fit_decision, primary_ksme_route |
| Specialist review required | specialist_review_required, specialist_review_status |
| Course-addressable | course_fit_decision |
| Partly course-addressable | course_fit_decision |
| Ready for Design | analysis_to_design_handovers.handover_status |
| Used in Design | analysis_records.status, analysis_to_design_handovers.handover_status |

### View 5: vw_analysis_safeguards_risk

| Dimension | Source fields |
| --- | --- |
| Risk flag | risk_flags |
| Sensitivity level | sensitivity_level |
| Visibility restriction | visibility_restriction |
| Specialist review status | specialist_review_status |
| Dashboard display permission | include_in_native_dashboard |

### View 6: vw_analysis_design_readiness

| Dimension | Source fields |
| --- | --- |
| Design reuse allowed | design_reuse_allowed / calculated |
| Handover ready | analysis_to_design_handovers.handover_status |
| K/S/M/E unlock allowed | design_unlock_allowed_by_ksme |
| Course-fit unlock allowed | design_unlock_allowed_by_course_fit |
| Safeguards cleared | safeguards_cleared_for_design |
| Approval/lock status | status, lock_status |

## 17. System-calculated fields and gate logic

The system should calculate some fields to prevent user error.

### design_reuse_allowed

Set to true only if all are true:

| Required condition |
| --- |
| Analysis Record status is approved, approved_locked, or handover_ready. |
| Core fields are complete. |
| Evidence confidence is not low, not_confirmed, or unsafe_to_confirm_fully, unless admin override is recorded. |
| Validation status is validated or validated_with_revisions. |
| K/S/M/E route is Knowledge, Skill, Knowledge + Skill, or Mixed with separable K/S component. |
| Course-fit decision is course_addressable or partly_course_addressable. |
| Safeguards are cleared or manageable. |
| Visibility restrictions do not block Design use. |

### analysis_to_design_handover_ready

Set to true only if:

| Required condition |
| --- |
| design_reuse_allowed = true |
| lock_status = locked |
| course_design_readiness = ready_for_design or ready_with_conditions |
| Required handover fields are complete |

### safeguards_cleared_for_design

Set to false if:

| Blocking condition |
| --- |
| sensitivity level is high and specialist review is pending |
| sensitivity level is do_not_proceed |
| visibility restriction is specialist_reviewer_only_until_cleared |
| unsafe data exclusion is not confirmed |
| risk flags require review and no specialist decision exists |

### design_unlock_allowed_by_ksme

Set to false if:

| Blocking condition |
| --- |
| route is motivation and no separable K/S component exists |
| route is environment and no separable K/S component exists |
| route is mixed and no separable K/S component exists |
| route is unclear |

## 18. Minimum implementation slice for Codex

For an early Phase 1 implementation, Codex can prioritize a leaner version while preserving the full model.

### Minimum required records

| Priority | Record |
| --- | --- |
| 1 | analysis_records |
| 2 | analysis_capacity_links |
| 3 | analysis_evidence_assessment |
| 4 | analysis_ksme_diagnoses |
| 5 | analysis_course_fit_decisions |
| 6 | analysis_safeguard_reviews |
| 7 | analysis_evaluation_anchors |
| 8 | analysis_to_design_handovers |
| 9 | analysis_workflow_events |

### Minimum dashboard aggregations

| Dashboard page | Minimum data needed |
| --- | --- |
| Executive Overview | total records, validated, approved, ready for Design, blocked, high-risk |
| Capacity Area Analysis | capacity area and sub-capacity counts |
| K/S/M/E Diagnosis | K/S/M/E distribution and Mixed separable K/S count |
| Course-Fit Pipeline | course-addressable, partly, non-course, further diagnosis, blocked |
| Evidence and Validation | confidence, validation, triangulation |
| Safeguards | risk flags, sensitivity, specialist review |
| Design Readiness | handover ready, used in Design, blocked |

## 19. Data safety implementation notes

The database should support the following safety rules:

| Safety rule | Implementation implication |
| --- | --- |
| Do not store raw unsafe field notes in Analysis Records | Store summaries and metadata only. |
| Sensitive attachments should be avoided by default | If allowed later, store metadata and restricted file references only. |
| Dashboard labels must be safe | Separate dashboard_display_label from full gap statement. |
| CSO names may need anonymization | Use organization visibility mode and dashboard flags. |
| AI should not receive sensitive raw data | Store ai_use_restriction and pass only safe context. |
| Donor-safe summaries are not default | External visibility should require future consent logic. |
| Safeguarding/protection data should generally not be uploaded | Use simulated or anonymized examples only. |

## 20. Quality Self-Check

| Criterion group | Status | Evidence / note | Revision needed? |
| --- | --- | --- | --- |
| SQL-ready structure | Met | Provides logical tables, fields, types, keys, relationships, enums, and views. | No |
| Comprehensive Analysis Record | Met | Includes identity, capacity, evidence, K/S/M/E, course-fit, safeguards, dashboard flags, evaluation anchor, approval, handover, and audit trail. | No |
| Dashboard readiness | Met | Defines native dashboard views for executive overview, capacity distribution, K/S/M/E, course-fit pipeline, safeguards, and Design readiness. | No |
| Workflow readiness | Met | Includes Analysis-to-Design Handover table, gate logic, status fields, and design reuse rules. | No |
| K/S/M/E discipline | Met | Defines route enums, separable K/S fields, non-course components, and system-calculated Design unlock logic. | No |
| Course-fit discipline | Met | Provides course-fit decision fields and routing rules that prevent training from becoming the default answer. | No |
| Evidence traceability | Met | Evidence source, triangulation, validation, confidence, limitations, and contradiction fields are included. | No |
| Native dashboard decision | Met | Specifies native in-platform dashboard only; no Power BI or external BI embedding. | No |
| Data safety and no-harm | Met | Includes risk flags, sensitivity, unsafe data exclusion, anonymization, visibility restrictions, AI restrictions, and safeguards clearance. | No |
| DEC-specific grounding | Met | Uses DEC capacity areas, Analysis-to-Design logic, K/S/M/E routing, workflow gates, monitoring traceability, and CSO safety principles. | No |
| Practical implementation readiness | Met | Provides minimum implementation slice for Codex while preserving full logical model. | No |
| Overall readiness | Met | Output is ready to inform database schema, Prisma model planning, dashboard queries, and Codex implementation tasks. | No |


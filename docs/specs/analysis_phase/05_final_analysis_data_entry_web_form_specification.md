# Output 5 — Final Analysis Data Entry Web Form Specification

## 1. Purpose of the form

The Final Analysis Data Entry Web Form is the main digital entry point for the DEC Learning Hub Analysis Phase. It should capture only the final validated, synthesized, platform-ready Analysis Record after fieldwork, triangulation, validation, K/S/M/E diagnosis, course-fit decision, safeguards review, and evaluation anchoring are complete.

It should not be used to collect every raw interview note, FGD response, workshop comment, or unprocessed assessment finding. The governing prompt states that the form should capture only final validated and synthesized analysis information, and that it must be comprehensive, standardized, SQL-ready, dashboard-ready, and suitable for Course Creator Portal integration.

The corrected data flow is:

Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.

The dashboard addendum overrides earlier Power BI references and requires the dashboard to be built natively inside the DEC Learning Hub platform, using structured Analysis Records from the platform database.

## 2. Primary users

| User group | Role in this form |
| --- | --- |
| Analysis data-entry users | Enter final validated findings after fieldwork and synthesis are complete. |
| DEC capacity/M&E leads | Review quality, validate evidence confidence, and check dashboard readiness. |
| DEC admins | Approve, lock, return, archive, or reopen records according to permissions. |
| Safeguarding / civic-space reviewers | Review sensitive records where risk flags are triggered. |
| Course creators | Do not normally create raw Analysis Records, but later select approved records for Design. |
| Reviewers | Use approved records to check whether future courses remain aligned with evidence. |

The refined prompt distinguishes analysis data-entry users from dashboard users and course creation workflow users; analysis entry users are authorized DEC staff, consortium leads, consultants, technical experts, or assigned analysis leads who enter structured final findings after fieldwork and validation.

## 3. Form design principles

| Principle | Product implication |
| --- | --- |
| Final synthesis only | Capture validated findings, not raw data dumps. |
| Structured but practical | Use controlled fields where needed, but avoid making the form too heavy for local CSO contexts. |
| Required / conditional / optional logic | Required fields protect traceability; conditional fields appear only when relevant. |
| Native dashboard-ready | Every dashboard filter, KPI, and record detail should come from structured fields. |
| Course workflow-ready | Approved fields should prefill or appear read-only in Design. |
| K/S/M/E discipline | Do not allow Motivation or Environment gaps to unlock Design unless a separable Knowledge/Skill component is recorded. |
| Safeguards by default | Sensitive records require risk flags, visibility limits, and specialist review where needed. |
| Auditability | Record who entered, reviewed, approved, locked, returned, or reopened the Analysis Record. |
| No overclaiming | The form should not imply that a future course or certificate proves full organizational transformation. |

The acceptance guide requires this form specification to include sections, field names, descriptions, field types, dropdowns, validation rules, help text, examples, required/conditional/optional logic, approval and locking status, and integration readiness for SQL storage, native dashboard visualization, and Design prefill/read-only logic.

## 4. Recommended form sections

| Section no. | Form section | Purpose |
| --- | --- | --- |
| 1 | Record Identity and Context | Identifies the Analysis Record, CSO/cohort/program context, and responsible users. |
| 2 | Capacity Classification | Maps the finding to the DEC capacity taxonomy. |
| 3 | Target Learner and Use Context | Defines who the course or support would target. |
| 4 | Validated Capacity Gap | Captures the specific gap, baseline, desired practice, and practical consequence. |
| 5 | Evidence, Triangulation, and Validation | Records evidence sources, triangulation status, validation status, and confidence level. |
| 6 | K/S/M/E Root-Cause Diagnosis | Diagnoses whether the gap is Knowledge, Skill, Motivation, Environment, Mixed, or unclear. |
| 7 | Course-Fit and Intervention Routing | Decides whether the gap can proceed to course design or needs other support. |
| 8 | Safeguards, Data Safety, and Visibility | Screens for sensitivity, no-harm concerns, and dashboard visibility controls. |
| 9 | Evaluation Anchor and Future Monitoring | Defines baseline-to-monitoring linkage and possible learner evidence. |
| 10 | Native Dashboard and Design Reuse Flags | Marks how the record should appear in dashboards and whether it can be used for Design. |
| 11 | Approval, Locking, and Workflow Status | Captures validation, approval, lock, return, and handover state. |
| 12 | Audit Trail and Revision Notes | Records accountability, changes, comments, and revision history. |

# Section 1 — Record Identity and Context

## 1.1 Purpose

This section identifies the Analysis Record and locates it within the DEC Learning Hub program, CSO, cohort, region, or capacity-strengthening context.

## 1.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| analysis_record_title | Short descriptive title for the validated gap. | Short text | Required | 10–140 characters; must be specific. | Use a practical title that describes the capacity gap, not a broad training topic. | “Program officers cannot write outcome evidence statements” |
| analysis_record_code | Unique system-generated code. | Auto-generated ID | Required/system | Auto-generated; non-editable. | The system creates this automatically. | AR-2026-0007 |
| program_context | DEC project, program, cohort, or initiative linked to the analysis. | Dropdown + optional note | Required | Must select active program/cohort if available. | Select the program or cohort where the capacity gap was identified. | EU CSF+ CSO Learning Cohort 1 |
| organization_or_cso | CSO or organization linked to the finding, where safe and relevant. | Search/select + optional anonymized option | Conditional | Required if record is organization-specific; allow anonymized/cohort-only entry for sensitive cases. | Select the CSO only if safe. Use anonymized or cohort-level entry if visibility risk exists. | “CSO A — anonymized in dashboard” |
| cohort_or_group | Cohort, network, consortium, or group if the gap applies to multiple CSOs. | Dropdown/search | Optional | Can be multiple selection. | Use this when the finding applies to more than one CSO. | “Regional accountability cohort” |
| geography | Region, zone, city, or operational geography. | Dropdown + text | Optional/conditional | Required only if geographic comparison is enabled and safe. | Avoid overly specific location if it creates risk. | “Addis Ababa / Oromia cohort” |
| analysis_prepared_by | Person or team entering the final record. | User picker | Required | Must be authorized analysis entry user. | Select the person responsible for this record. | “DEC Capacity Lead” |
| analysis_date | Date the final synthesis was completed. | Date | Required | Cannot be future date. | Enter the date the validated synthesis was finalized. | 2026-04-29 |
| source_tool_package_used | Which field tools informed the record. | Multi-select | Required | At least one source tool required. | Select only tools actually used. | Self-assessment, KII, document review, validation workshop |
| record_sensitivity_mode | Whether the record is standard, restricted, anonymized, or specialist-only. | Dropdown | Required | If restricted/anonymized/specialist-only, Section 8 required. | Choose how safely this record can be shown. | Restricted |

## 1.3 Controlled options

source_tool_package_used

CSO capacity scoping template

CSO self-assessment

Key informant interview

Focus group discussion

Secondary document review

Stakeholder validation workshop

Prioritization matrix

Triangulation matrix

K/S/M/E diagnosis worksheet

Course-fit decision tool

Safeguards/no-harm checklist

Evaluation anchor worksheet

Existing CSO tool mapped to DEC record

Other

record_sensitivity_mode

Standard

Restricted

Anonymized in dashboard

Specialist review only

Do not show in dashboard until cleared

# Section 2 — Capacity Classification

## 2.1 Purpose

This section anchors the finding in the DEC CSO capacity taxonomy. The capacity area should become a controlled field used across Analysis, Design, Build, Review, Publish, and Monitoring. Annex 4 requires the platform to use structured capacity fields such as capacity area, sub-capacity, indicator/standard, evidence source, baseline/current practice, desired practice, K/S/M/E route, and course-fit decision.

## 2.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| primary_capacity_area | Main DEC CSO capacity area affected by the gap. | Dropdown | Required | Must select one of nine DEC capacity areas. | Choose the main capacity area. Do not choose a broad area just because it sounds familiar. | Monitoring, Evaluation, Accountability, and Learning |
| secondary_capacity_area | Additional related capacity area, if relevant. | Multi-select | Optional | Cannot duplicate primary capacity area. | Use only if the gap clearly crosses another capacity area. | Digital Skills and Data Use |
| sub_capacity | Specific sub-capacity or functional practice. | Dropdown + optional custom note | Required | Must not be blank. If “Other,” custom note required. | Be specific enough to guide course design. | Outcome evidence writing |
| indicator_or_standard_reference | Relevant standard, indicator, commitment, internal benchmark, or donor-aligned expectation. | Text / lookup | Recommended/conditional | Required if known or available in taxonomy; optional where not available. | Link the gap to a practical standard or indicator. | DG NEAR SO3 evidence use / internal MEAL reporting standard |
| taxonomy_confidence | Confidence that the capacity classification is correct. | Dropdown | Required | If low, record cannot be approved without reviewer note. | Select how confident the team is that this gap is mapped correctly. | High |
| classification_note | Explanation of why this capacity area was selected. | Long text | Optional/conditional | Required if taxonomy confidence is low or secondary capacity selected. | Explain cross-cutting links or uncertainty. | “The gap relates mainly to outcome evidence but also requires safe data handling.” |

## 2.3 Controlled options: nine DEC capacity areas

Internal Governance and Leadership

Transparency and Accountability

Strategic Planning and Organizational Sustainability

Financial Management and Resource Mobilization

Human Resources, Inclusion, and Safeguarding

Evidence-Based Advocacy and Civic Engagement

Monitoring, Evaluation, Accountability, and Learning

Digital Skills and Data Use / IT Competencies

Networking, Partnerships, and Collective Action

# Section 3 — Target Learner and Use Context

## 3.1 Purpose

This section defines who needs to perform the desired practice. A course should not be designed for “all CSO staff” unless the evidence clearly supports a broad audience.

## 3.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| target_learner_group | Main learner group affected by the gap. | Dropdown + custom text | Required | Must identify role group, not only organization. | Name the people who need to do something differently. | Program officers |
| secondary_learner_groups | Other learner groups affected. | Multi-select | Optional | No more than 5 unless cohort-wide. | Add only groups that need the learning or support. | MEAL officers, project coordinators |
| learner_current_context | Practical work context where the gap appears. | Long text | Required | Minimum 30 characters. | Describe where the gap shows up in real CSO work. | “During donor reporting and internal quarterly reflection.” |
| learner_constraints | Known constraints affecting learning or application. | Multi-select + note | Recommended | If digital, language, accessibility, or safety constraints selected, notes required. | Select constraints that should shape course design. | Low bandwidth; limited MEAL time; English/Amharic terminology mismatch |
| language_localization_needs | Language, translation, or localization needs. | Multi-select/text | Optional/conditional | Required if target group needs non-English support. | Identify language and contextual adaptation needs early. | Amharic examples; plain English glossary |
| accessibility_needs | Accessibility or inclusion considerations. | Multi-select/text | Optional/conditional | Required if known accessibility barrier exists. | Record mobile, low-bandwidth, disability, literacy, or format needs. | Mobile-first; printable worksheet |

## 3.3 Controlled options: learner constraints

Limited internet or device access

Limited staff time

Low prior digital confidence

Low prior technical knowledge

Language/translation challenge

High workload during reporting periods

Sensitive civic-space context

Safeguarding/protection sensitivity

Low trust in data use

Leadership support needed

Accessibility accommodation needed

Other

# Section 4 — Validated Capacity Gap

## 4.1 Purpose

This is the core of the Analysis Record. It defines the actual gap, not a general topic.

## 4.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| validated_capacity_gap | Specific, evidence-backed capacity gap. | Long text | Required | Minimum 40 characters; must include actor + task/practice problem. | Avoid “needs training.” State what the learner/CSO cannot yet do well. | “Program officers cannot write short outcome evidence statements that link observed change to an indicator and evidence source.” |
| baseline_current_practice | What currently happens in practice. | Long text | Required | Minimum 40 characters. | Describe current behavior, output, process, or weakness. | “Current reports mostly list activities, participant numbers, and completed events.” |
| desired_practice | What should happen instead. | Long text | Required | Minimum 40 characters. | Describe realistic improved practice, not an ideal transformation. | “Program officers write concise outcome evidence statements with change, source, confidence, and limitation.” |
| practical_consequence | Why the gap matters for CSO performance, accountability, sustainability, safety, or credibility. | Long text | Recommended | Required for high-priority gaps. | Explain why this gap matters. | “Reports do not show contribution to outcomes, limiting learning and donor confidence.” |
| existing_strengths | Existing capacities, tools, habits, or resources to build on. | Long text | Optional | Encouraged but not mandatory. | Record strengths so the analysis is not deficit-only. | “The CSO already has regular project reports and indicator lists.” |
| gap_scope | Whether the gap applies to one CSO, multiple CSOs, one learner group, or a cohort. | Dropdown | Required | Must be selected. | Define the scope before prioritizing. | Multi-CSO cohort |
| gap_urgency | Urgency of addressing the gap. | Dropdown | Required | If high, priority justification required. | Select based on consequences and timing. | High |
| priority_justification | Why this gap should be prioritized. | Long text | Conditional | Required if urgency or priority is High/Priority A. | Explain the priority using evidence, not opinion. | “Repeated across 5 CSOs and directly affects donor reporting quality.” |

## 4.3 Controlled options

gap_scope

Single learner group

Single CSO

Multiple CSOs

Cohort-wide

Consortium-wide

Region-specific

Unclear / needs more evidence

gap_urgency

Low

Medium

High

Critical / urgent safeguarding or compliance concern

Not yet determined

# Section 5 — Evidence, Triangulation, and Validation

## 5.1 Purpose

This section records why the gap is credible and whether it has been validated. It supports dashboard views on evidence strength and validation status.

## 5.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| evidence_sources_summary | Short summary of evidence sources used. | Long text | Required | Must summarize at least one source; stronger records should include multiple sources. | Summarize, do not paste raw notes. | “Self-assessment, MEAL lead KII, review of 3 reports, validation workshop.” |
| evidence_source_types | Types of evidence used. | Multi-select | Required | At least one required; if only one weak source, confidence cannot be high. | Select actual evidence types. | KII, document review, validation workshop |
| evidence_source_count | Number of distinct evidence sources. | Number | Required | Must be ≥1. | Count evidence source types or documents used. | 4 |
| triangulation_status | Whether evidence confirms the gap across sources. | Dropdown | Required | If contradicted/not confirmed, cannot approve for Design. | Use the triangulation guide. | Confirmed |
| validation_status | Whether stakeholders validated the finding. | Dropdown | Required | If not validated or needs evidence, cannot lock. | Select the actual validation outcome. | Validated with revisions |
| evidence_confidence_level | Confidence in the finding. | Dropdown | Required | High requires multiple credible sources or strong source + validation. | Use high only when evidence is credible and recent. | High |
| evidence_limitations | Limitations, gaps, or contradictions in evidence. | Long text | Conditional | Required if confidence is medium/low, triangulation is partly confirmed, or validation limited. | Be honest about uncertainty. | “No direct observation was conducted; based on documents and staff interviews.” |
| validation_method | How validation was conducted. | Dropdown/multi-select | Required | Must align with validation status. | Select how the finding was checked. | Stakeholder validation workshop |
| validation_date | Date of validation. | Date | Conditional | Required if validation status is validated/validated with revisions. | Enter the date validation occurred. | 2026-04-25 |
| validation_note | Summary of what changed or was confirmed during validation. | Long text | Recommended/conditional | Required if validated with revisions. | Explain any changes made. | “Participants narrowed the gap from general MEAL reporting to outcome evidence writing.” |

## 5.3 Controlled options

evidence_source_types

CSO self-assessment

Key informant interview

Focus group discussion

Secondary document review

Work sample review

Stakeholder validation workshop

Prior capacity assessment

Donor feedback

Training feedback

Monitoring or evaluation report

Observation

Existing CSO tool

Other

triangulation_status

Confirmed

Partly confirmed

Reframed

Contradicted

Not confirmed

Unsafe to verify fully

validation_status

Validated

Validated with revisions

Needs more evidence

Not validated

Validation limited

Specialist validation required

evidence_confidence_level

High

Medium

Low

Not confirmed

Unsafe to confirm fully

# Section 6 — K/S/M/E Root-Cause Diagnosis

## 6.1 Purpose

This section identifies why the gap exists and whether it is a course-addressable issue. DEC’s K/S/M/E rule is central: Knowledge and Skill gaps can normally proceed to Phase 1 course design; Motivation and Environment gaps should not drive course production unless a separable Knowledge/Skill component is explicitly recorded.

The K/S/M/E guide states that Mixed gaps may proceed only for the clearly defined Knowledge/Skill component, while Motivation or Environment components should be recorded for complementary support such as coaching, mentoring, leadership engagement, peer learning, technical assistance, systems strengthening, resource support, safeguarding review, or enabling-environment action.

## 6.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| primary_ksme_route | Main root-cause route. | Dropdown | Required | Must select one. | Choose the main reason the gap exists. | Mixed |
| knowledge_component | Knowledge-related cause, if present. | Long text | Conditional | Required if route includes Knowledge or Mixed with knowledge. | What do learners not yet understand? | “Staff confuse outputs, outcomes, and evidence statements.” |
| skill_component | Skill-related cause, if present. | Long text | Conditional | Required if route includes Skill or Mixed with skill. | What can learners not yet do? | “Staff cannot synthesize a change statement from indicator data.” |
| motivation_component | Motivation-related cause, if present. | Long text | Conditional | Required if route is Motivation or Mixed with motivation. | What confidence, incentive, leadership, culture, habit, or ownership issue exists? | “Reporting is seen mainly as donor compliance, not learning.” |
| environment_component | Environment-related cause, if present. | Long text | Conditional | Required if route is Environment or Mixed with environment. | What system, tool, time, staffing, policy, resource, safety, or external barrier exists? | “No regular learning review meeting exists.” |
| separable_ks_component_exists | Whether a clear course-addressable K/S component exists. | Yes/No/Not applicable | Conditional | Required if route is Mixed, Motivation, or Environment. | Select Yes only if a course can realistically address a defined Knowledge/Skill component. | Yes |
| separable_ks_component_description | The specific Knowledge/Skill component that can proceed to course design. | Long text | Conditional | Required if separable_ks_component_exists = Yes. | State exactly what the course can address. | “Teach and practice writing short outcome evidence statements.” |
| non_course_component_summary | Components that require non-course or complementary support. | Long text | Conditional | Required if Motivation, Environment, or Mixed. | Record what the course cannot solve alone. | “Leadership should introduce regular learning review meetings.” |
| ksme_diagnosis_confidence | Confidence in root-cause classification. | Dropdown | Required | Low confidence blocks approval unless reviewer overrides with reason. | Select how confident the analysis team is. | Medium |
| root_cause_note | Explanation of root-cause decision. | Long text | Required | Minimum 30 characters. | Briefly explain the diagnosis. | “Evidence shows both conceptual confusion and weak reporting culture.” |

## 6.3 Controlled options

primary_ksme_route

Knowledge

Skill

Knowledge + Skill

Motivation

Environment

Mixed

Unclear / needs further diagnosis

ksme_diagnosis_confidence

High

Medium

Low

Unclear

## 6.4 Conditional validation logic

| Condition | Required system behavior |
| --- | --- |
| primary_ksme_route = Knowledge | knowledge_component required; course-fit can be course-addressable if other fields complete. |
| primary_ksme_route = Skill | skill_component required; course-fit can be course-addressable if other fields complete. |
| primary_ksme_route = Knowledge + Skill | both knowledge_component and skill_component required. |
| primary_ksme_route = Motivation | motivation_component required; separable_ks_component_exists required; Design blocked unless separable K/S = Yes and course-fit = partly course-addressable. |
| primary_ksme_route = Environment | environment_component required; separable_ks_component_exists required; Design blocked unless separable K/S = Yes and course-fit = partly course-addressable. |
| primary_ksme_route = Mixed | at least two component fields required; separable_ks_component_exists required. |
| primary_ksme_route = Unclear | course-fit must be needs further diagnosis; Design blocked. |

# Section 7 — Course-Fit and Intervention Routing

## 7.1 Purpose

This section determines whether the validated gap should proceed to course design, proceed only as a narrowed K/S component, or be routed to another form of support.

## 7.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| course_fit_decision | Decision on whether a course is appropriate. | Dropdown | Required | Must align with K/S/M/E logic. | Do not select course-addressable if the main barrier is Motivation or Environment without separable K/S. | Partly course-addressable |
| course_fit_rationale | Explanation for decision. | Long text | Required | Minimum 40 characters. | Explain what a course can and cannot address. | “A course can build outcome evidence writing skill, but learning review culture requires management support.” |
| recommended_intervention_route | Recommended support route. | Multi-select | Required | At least one route required. | Select all realistic support routes. | Course + mentoring; leadership engagement |
| course_design_readiness | Whether the record can unlock Design. | Dropdown | Required | Must be system-calculated but admin-editable with reason. | Shows whether Design can begin. | Ready with conditions |
| design_blocking_reason | Why Design is blocked, if applicable. | Long text | Conditional | Required if readiness = blocked/not ready. | Explain what must be resolved. | “Root cause unclear; need validation with field staff.” |
| complementary_support_note | Non-course support needed. | Long text | Conditional | Required if course-fit is partly course-addressable or non-course route. | Record support outside the course. | “Introduce quarterly learning meeting template and leadership review.” |
| suggested_course_type | Suggested digital learning format if course-addressable. | Dropdown | Conditional | Required if course-fit includes course route. | Choose likely format; final decision happens in Design. | Guided practice course |
| course_priority_level | Course pipeline priority. | Dropdown | Required | Priority A requires high/medium evidence confidence and manageable safeguards. | Select based on validated priority and feasibility. | Priority A |

## 7.3 Controlled options

course_fit_decision

Course-addressable

Partly course-addressable

Non-course route

Needs further diagnosis

Not suitable for Phase 1

Archive / retain for strategic learning

recommended_intervention_route

Digital course

Course + mentoring

Course + coaching

Course + template/tool support

Technical assistance

Leadership or governance engagement

Peer learning / cohort support

Systems strengthening

Resource or infrastructure support

Safeguarding specialist review

Civic-space specialist review

Enabling-environment action

Further diagnosis

Archive / no action now

course_design_readiness

Ready for Design

Ready with conditions

Not ready

Blocked

Specialist review required

Archived

suggested_course_type

Micro-course

Short self-paced course

Guided practice course

Scenario-based course

Template/tool walkthrough

Cohort-supported digital course

Awareness/refresher module

Not applicable

course_priority_level

Priority A — immediate course pipeline

Priority B — important but requires refinement or blended support

Priority C — valid but lower urgency

Non-course priority

Not ready

Archived

# Section 8 — Safeguards, Data Safety, and Visibility

## 8.1 Purpose

This section protects CSO trust and prevents unsafe evidence handling. It ensures that sensitive civic-space, safeguarding, organizational vulnerability, beneficiary, or personal data is not exposed through the form, dashboard, AI prompts, or later course workflow.

## 8.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| safeguards_review_required | Whether safeguards review is required. | Yes/No | Required | Auto-suggest Yes if risk flags selected. | Select Yes for sensitive topics or high-risk evidence. | Yes |
| risk_flags | Risk categories linked to the record. | Multi-select | Required | “None identified” allowed only if no risk selected. | Select all risks that apply. | Civic-space sensitivity; data safety issue |
| sensitivity_level | Overall sensitivity level. | Dropdown | Required | High/Do not proceed requires specialist review. | Choose based on potential harm if exposed. | Moderate |
| unsafe_data_excluded | Confirmation that raw unsafe data was excluded. | Checkbox | Required | Must be checked before submit if any risk flag selected. | Confirm raw names, case files, beneficiary details, or sensitive documents were not entered. | Checked |
| anonymization_required | Whether record must be anonymized in dashboard or reports. | Yes/No | Required | If Yes, dashboard visibility cannot be unrestricted. | Select Yes if CSO, people, or locations should not be identifiable. | Yes |
| visibility_restriction | Visibility mode for dashboard and portal use. | Dropdown | Required | Must align with sensitivity level. | Choose who can see this record or its summary. | Restricted summary only |
| specialist_review_type | Specialist review needed. | Multi-select | Conditional | Required if safeguards_review_required = Yes and sensitivity moderate/high. | Select relevant reviewer type. | Civic-space reviewer |
| safeguards_no_harm_note | Practical note on how to handle the record safely. | Long text | Required | Minimum 30 characters; required for all records. | Include safe wording, redaction, scenario, dashboard, or proof cautions. | “Use anonymized examples; do not display CSO name in comparison charts.” |
| ai_use_restriction | Whether this Analysis Record can be used in AI authoring context. | Dropdown | Required | Sensitive raw data cannot be passed to AI. | Specify AI restrictions for later Build/Design. | Safe summary only |
| practical_proof_safety_note | Safety note if future practical proof may be enabled. | Long text | Conditional | Required if practical proof possibility = Yes/Conditional and risk flags exist. | State what proof should not ask learners to upload. | “Do not request real complaint logs; use anonymized categorization sample.” |

## 8.3 Controlled options

risk_flags

None identified

Safeguarding concern

Child protection sensitivity

GBV/protection sensitivity

Civic-space sensitivity

Political sensitivity

Public authority / advocacy sensitivity

Personal data risk

Beneficiary/community identifiable data risk

Organizational vulnerability risk

Financial/confidential document risk

Donor sensitivity

Data safety issue

AI prompt safety restriction

Practical proof safety concern

Other

sensitivity_level

Low

Moderate

High

Do not proceed in current form

visibility_restriction

Standard internal visibility

Restricted to DEC admin and assigned analysis users

Restricted to DEC capacity/M&E lead

Specialist reviewer only until cleared

Anonymized in dashboard

Aggregated only

Do not display in dashboard

Archived restricted record

ai_use_restriction

Safe to use as approved context

Use safe summary only

Do not include sensitive details in AI prompts

AI use blocked for this record

# Section 9 — Evaluation Anchor and Future Monitoring

## 9.1 Purpose

This section ensures the Analysis Record can later support monitoring, learning, course improvement, and dashboard interpretation. The DEC monitoring logic requires learner activity to connect back to the original capacity gap, Analysis baseline, Design performance goal, course version, final test, certificate, practical proof, verified achievement, and course improvement decisions.

## 9.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| evaluation_anchor_summary | How future progress or learning evidence could be interpreted. | Long text | Required | Minimum 40 characters. | Connect baseline, desired practice, and future evidence. | “Progress can be assessed through final test scenarios and anonymized outcome evidence worksheets.” |
| potential_final_test_focus | What a future final test should verify. | Long text | Recommended/conditional | Required if course-fit includes course route. | State learning evidence, not full organizational transformation. | “Distinguish output vs outcome; select strongest evidence statement.” |
| potential_practical_output | Possible learner work output or practice product. | Long text | Optional/conditional | Required if practical proof possibility = Yes. | Name the practical output learners might produce. | “Completed outcome evidence worksheet.” |
| practical_proof_possibility | Whether future practical proof may be suitable. | Dropdown | Required | If Yes/Conditional, practical proof safety note may be required. | Practical proof is separate from certificate. | Conditional |
| monitoring_signal | Dashboard or monitoring signal linked to this gap. | Multi-select + note | Required | At least one signal required. | Select what DEC could monitor later. | Final test pass rate; proof submission count; learner feedback |
| limitation_overclaiming_note | What the course/certificate should not claim. | Long text | Required | Minimum 30 characters. | Prevent overclaiming. | “Certificate shows learning threshold, not full CSO MEAL system transformation.” |
| course_improvement_signal | What future data might indicate the course needs revision. | Long text | Optional | — | Example: low pass rate, repeated wrong answers, poor relevance feedback. | “Low performance on outcome/evidence scenario questions.” |

## 9.3 Controlled options

practical_proof_possibility

Yes

No

Conditional

Specialist review required

Not suitable due to risk

monitoring_signal

Analysis-to-Design handover count

Course created from this record

Learner enrollment

Course completion

Final test attempts

Final test pass rate

Certificate count

Average score

Learner feedback relevance score

Practical proof submissions

Verified achievements

Course improvement flags

Dashboard record viewed/selected for Design

Other

# Section 10 — Native Dashboard and Design Reuse Flags

## 10.1 Purpose

This section makes the record usable in the native Analysis Dashboard and Course Creator Portal. The addendum states that approved Analysis Records should feed the next workflow steps directly, and when a course creator begins Design, the selected record should prefill or display key fields such as capacity area, sub-capacity, indicator, validated gap, target learner group, baseline, desired practice, K/S/M/E route, course-fit decision, separable K/S component, safeguards/no-harm note, evaluation anchor, and Analysis-to-Design Handover status. Core Analysis fields should become read-only once approved or locked.

## 10.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| include_in_native_dashboard | Whether record appears in the native dashboard. | Dropdown | Required | Cannot be “full detail” if visibility is restricted. | Choose dashboard visibility level. | Aggregated and record detail for authorized users |
| dashboard_display_label | Safe short label for dashboard cards/tables. | Short text | Required | Must not include sensitive names if anonymization required. | Use safe label. | “Outcome evidence writing gap” |
| dashboard_summary | Safe summary for dashboard detail view. | Long text | Required | Must not include raw sensitive details. | Summarize the record safely. | “Validated gap in preparing outcome evidence statements across several CSOs.” |
| design_reuse_allowed | Whether creators can select this record for Design. | Yes/No/System calculated | Required | Yes only if approved/locked and course-fit supports Design. | This controls no-blank-page course creation. | Yes |
| fields_to_prefill_design | Fields that should prefill Design. | Multi-select/system | Required | Default set should be system-defined. | These become Design starting fields. | capacity area, gap, baseline, desired practice, learner group |
| read_only_after_lock | Fields locked after approval. | Multi-select/system | Required | Core fields must be locked. | Locked fields cannot be changed in Design without returning to Analysis. | Core Analysis fields |
| analysis_to_design_handover_ready | Whether handover can be created. | Yes/No/System calculated | Required | Yes only if required fields complete and course-fit allows Design. | System determines readiness. | Yes |
| dashboard_filter_tags | Tags for dashboard filtering. | Multi-select | Optional | Must use controlled tags where possible. | Add useful safe filters. | MEAL, Skill, Priority A, Ready for Design |

## 10.3 Core fields to prefill Design

primary_capacity_area

secondary_capacity_area, if relevant

sub_capacity

indicator_or_standard_reference

target_learner_group

validated_capacity_gap

baseline_current_practice

desired_practice

primary_ksme_route

separable_ks_component_description, where relevant

course_fit_decision

complementary_support_note, where relevant

safeguards_no_harm_note

evaluation_anchor_summary

practical_proof_possibility

monitoring_signal

analysis_to_design_handover_status

## 10.4 Core fields to become read-only after approval/lock

primary_capacity_area

sub_capacity

indicator_or_standard_reference

target_learner_group

validated_capacity_gap

baseline_current_practice

desired_practice

evidence_confidence_level

primary_ksme_route

separable_ks_component_description

course_fit_decision

recommended_intervention_route

safeguards_no_harm_note

evaluation_anchor_summary

analysis_to_design_handover_status

# Section 11 — Approval, Locking, and Workflow Status

## 11.1 Purpose

This section controls the state of the Analysis Record. It prevents unapproved or weak records from being used in Design.

## 11.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| analysis_record_status | Overall status of the Analysis Record. | Dropdown | Required | System state must match approval and completeness. | Shows where the record sits in the workflow. | Approved |
| submission_status | Whether record has been submitted for review. | Dropdown | Required | Draft records cannot be approved. | Submit only when required fields are complete. | Submitted |
| reviewer_assigned | Assigned reviewer or approver. | User picker | Conditional | Required once submitted. | Assign DEC capacity/M&E lead or relevant reviewer. | DEC Capacity Lead |
| review_decision | Reviewer decision. | Dropdown | Conditional | Required before approval. | Reviewer decides whether record is ready. | Approve for lock |
| review_comments | Reviewer comments or required revisions. | Long text | Conditional | Required if returned/needs revision. | Give clear revision instructions. | “Clarify separable skill component before approval.” |
| approved_by | User who approved the record. | User picker/system | Conditional | Required if approved. | System records approver. | DEC Admin |
| approval_date | Approval date. | Date/system | Conditional | Required if approved. | System-generated where possible. | 2026-04-29 |
| lock_status | Whether core fields are locked. | Dropdown/system | Required | Locked only after approval and all required fields complete. | Locked records become official Design inputs. | Locked |
| locked_by | User who locked record. | User picker/system | Conditional | Required if locked. | System-generated. | DEC Admin |
| locked_date | Date locked. | Date/system | Conditional | Required if locked. | System-generated. | 2026-04-30 |
| analysis_to_design_handover_status | Handover state. | Dropdown | Required | Ready/created only if Design reuse allowed. | Shows whether record can unlock Design. | Handover ready |
| return_or_reopen_reason | Reason for returning or reopening. | Long text | Conditional | Required if returned/reopened. | Explain why Analysis must be revised. | “Course-fit was inconsistent with K/S/M/E diagnosis.” |

## 11.3 Controlled options

analysis_record_status

Draft

Submitted for review

Needs revision

Validated

Approved

Locked

Handover ready

Used in Design

Blocked from Design

Specialist review required

Archived

review_decision

Approve for lock

Validate but do not lock yet

Return for revision

Request more evidence

Request specialist review

Block from Design

Archive

lock_status

Unlocked draft

Review locked

Approved and locked

Reopened for revision

Archived locked

analysis_to_design_handover_status

Not ready

Ready for handover

Handover created

Handover locked

Used in Design

Blocked

Returned to Analysis

Archived

# Section 12 — Audit Trail and Revision Notes

## 12.1 Purpose

This section preserves accountability and change history. It is important for future Codex implementation, review, governance, and evidence quality.

## 12.2 Fields

| Field name | Description | Field type | Requirement | Validation rules | Help text | Example |
| --- | --- | --- | --- | --- | --- | --- |
| created_by | User who created the record. | System user | Required/system | Auto-captured. | System records this automatically. | analysis.user@dec |
| created_at | Creation timestamp. | Timestamp | Required/system | Auto-captured. | — | 2026-04-29 14:30 |
| updated_by | Last user who edited. | System user | Required/system | Auto-captured. | — | capacity.lead@dec |
| updated_at | Last update timestamp. | Timestamp | Required/system | Auto-captured. | — | 2026-04-29 16:00 |
| revision_summary | Summary of major revision. | Long text | Conditional | Required when record returned/reopened. | State what changed. | “Reframed gap after validation workshop.” |
| version_number | Analysis Record version. | Number/system | Required | Increment on approved revision. | Supports traceability. | v1.2 |
| change_log | Structured log of changes. | System log | Required/system | Auto-captured. | — | Field changed: course_fit_decision |
| admin_override_used | Whether admin override changed normal gate logic. | Yes/No | Required | If Yes, override reason required. | Use rarely and with explanation. | No |
| admin_override_reason | Reason for override. | Long text | Conditional | Required if override used. | Explain why normal gate logic was overridden. | — |

# 13. Required / conditional / optional summary

## 13.1 Always required fields

analysis_record_title

analysis_record_code

program_context

analysis_prepared_by

analysis_date

source_tool_package_used

record_sensitivity_mode

primary_capacity_area

sub_capacity

taxonomy_confidence

target_learner_group

learner_current_context

validated_capacity_gap

baseline_current_practice

desired_practice

gap_scope

gap_urgency

evidence_sources_summary

evidence_source_types

evidence_source_count

triangulation_status

validation_status

evidence_confidence_level

validation_method

primary_ksme_route

ksme_diagnosis_confidence

root_cause_note

course_fit_decision

course_fit_rationale

recommended_intervention_route

course_design_readiness

course_priority_level

safeguards_review_required

risk_flags

sensitivity_level

unsafe_data_excluded

anonymization_required

visibility_restriction

safeguards_no_harm_note

ai_use_restriction

evaluation_anchor_summary

practical_proof_possibility

monitoring_signal

limitation_overclaiming_note

include_in_native_dashboard

dashboard_display_label

dashboard_summary

design_reuse_allowed

fields_to_prefill_design

read_only_after_lock

analysis_to_design_handover_ready

analysis_record_status

submission_status

lock_status

analysis_to_design_handover_status

audit fields: created_by, created_at, updated_by, updated_at, version_number

## 13.2 Conditionally required fields

| Field | Required when |
| --- | --- |
| organization_or_cso | Record is organization-specific and safe to identify. |
| geography | Geographic comparison is enabled and safe. |
| classification_note | Secondary capacity area selected or taxonomy confidence is low. |
| learner_constraints note | Any major learner constraint is selected. |
| language_localization_needs | Non-English/localized learning need identified. |
| practical_consequence | Priority is high or critical. |
| priority_justification | gap_urgency is High/Critical or priority is A. |
| evidence_limitations | confidence is medium/low, triangulation partly confirmed, or validation limited. |
| validation_date | validation status is validated or validated with revisions. |
| validation_note | validation status is validated with revisions. |
| knowledge_component | route includes Knowledge. |
| skill_component | route includes Skill. |
| motivation_component | route includes Motivation. |
| environment_component | route includes Environment. |
| separable_ks_component_exists | route is Mixed, Motivation, or Environment. |
| separable_ks_component_description | separable_ks_component_exists = Yes. |
| non_course_component_summary | route is Mixed, Motivation, or Environment. |
| design_blocking_reason | readiness is Not ready, Blocked, or Specialist review required. |
| complementary_support_note | course-fit is Partly course-addressable or Non-course route. |
| suggested_course_type | course-fit includes course route. |
| specialist_review_type | safeguards review required and sensitivity is moderate/high. |
| practical_proof_safety_note | practical proof is Yes/Conditional and risk flags exist. |
| potential_final_test_focus | course-fit includes course route. |
| potential_practical_output | practical proof possibility = Yes. |
| reviewer_assigned | submitted for review. |
| review_decision | before approval/locking. |
| review_comments | returned, needs revision, more evidence, or specialist review. |
| approved_by / approval_date | record approved. |
| locked_by / locked_date | record locked. |
| return_or_reopen_reason | record returned or reopened. |
| revision_summary | record returned, reopened, or revised after approval. |
| admin_override_reason | admin override used. |

## 13.3 Optional fields

secondary_capacity_area

cohort_or_group

existing_strengths

secondary_learner_groups

accessibility_needs, unless known barrier exists

course_improvement_signal

dashboard_filter_tags

classification_note, where no uncertainty exists

potential_practical_output, where proof is not relevant

# 14. System-level validation rules

| Rule | Required system behavior |
| --- | --- |
| No blank gap | The record cannot be submitted without a specific validated capacity gap, baseline, and desired practice. |
| No unsupported approval | The record cannot be approved if triangulation status is Not confirmed, Contradicted, or Needs more evidence. |
| No unclear root-cause Design unlock | If K/S/M/E route is Unclear, course-fit must be Needs further diagnosis and Design remains blocked. |
| No Motivation-only Design unlock | Motivation-only gaps cannot unlock Design unless a separable K/S component is recorded and course-fit is Partly course-addressable. |
| No Environment-only Design unlock | Environment-only gaps cannot unlock Design unless a separable K/S component is recorded and course-fit is Partly course-addressable. |
| Mixed-gap control | Mixed gaps can unlock Design only for the separable K/S component; non-course components must be recorded. |
| Safeguards gate | High-risk records require specialist review before Design handover. |
| Sensitive data gate | Records with sensitivity level High or Do not proceed cannot be displayed in full dashboard detail. |
| Dashboard safety | If anonymization_required = Yes, dashboard label and summary must not expose CSO, person, community, or exact sensitive location. |
| Approval lock | Core Analysis fields become read-only after approval/lock. |
| Handover creation | Analysis-to-Design Handover can be created only when required fields are complete, record is approved/locked, and course-fit permits Design. |
| Native dashboard use | The form feeds the native in-platform dashboard, not any external BI layer. |
| No certificate overclaiming | Evaluation and monitoring fields must not imply that future certificates prove full organizational transformation. |

# 15. Examples of good entries

## Example 1 — Strong course-addressable Skill gap

| Field | Good entry |
| --- | --- |
| primary_capacity_area | Monitoring, Evaluation, Accountability, and Learning |
| sub_capacity | Outcome evidence writing |
| target_learner_group | Program officers |
| validated_capacity_gap | Program officers cannot write short outcome evidence statements that link observed change to an indicator and evidence source. |
| baseline_current_practice | Current reports mostly list activities, participant numbers, and completed events. |
| desired_practice | Program officers write concise outcome evidence statements that include change, source, confidence, and limitation. |
| evidence_sources_summary | Self-assessment, MEAL lead interview, review of three reports, and validation workshop. |
| primary_ksme_route | Knowledge + Skill |
| knowledge_component | Staff confuse outputs, outcomes, and evidence statements. |
| skill_component | Staff cannot synthesize a practical outcome evidence statement from available data. |
| course_fit_decision | Course-addressable |
| recommended_intervention_route | Digital course; course + template/tool support |
| safeguards_no_harm_note | Use anonymized examples and avoid beneficiary-identifiable stories. |
| evaluation_anchor_summary | Final test can use scenarios; optional proof can be an anonymized outcome evidence worksheet. |
| limitation_overclaiming_note | Certificate confirms learning threshold, not full CSO MEAL transformation. |

## Example 2 — Mixed gap with separable K/S component

| Field | Good entry |
| --- | --- |
| primary_capacity_area | Financial Management and Resource Mobilization |
| sub_capacity | Donor budget justification |
| validated_capacity_gap | Program staff cannot prepare budget justifications that clearly link budget lines to activities and allowable costs. |
| baseline_current_practice | Budget notes are short, generic, and often disconnected from activity descriptions. |
| desired_practice | Staff write clear budget justifications explaining cost purpose, activity link, and eligibility. |
| primary_ksme_route | Mixed |
| knowledge_component | Staff do not know common allowable cost categories and donor justification expectations. |
| skill_component | Staff cannot write concise justification statements. |
| environment_component | No shared program-finance review template exists. |
| separable_ks_component_exists | Yes |
| separable_ks_component_description | Course can address allowable cost logic and practice writing justifications. |
| non_course_component_summary | Program-finance coordination template should be introduced separately. |
| course_fit_decision | Partly course-addressable |
| recommended_intervention_route | Course + template/tool support; systems strengthening |
| course_design_readiness | Ready with conditions |

## Example 3 — Environment gap blocked from course design

| Field | Good entry |
| --- | --- |
| primary_capacity_area | Digital Skills and Data Use / IT Competencies |
| validated_capacity_gap | Field staff cannot submit timely digital reports from rural sites. |
| baseline_current_practice | Reports are delayed because the data collection tool fails offline and devices are shared among multiple staff. |
| desired_practice | Staff can submit reports reliably using an offline-compatible workflow and adequate devices. |
| primary_ksme_route | Environment |
| environment_component | Main barriers are device access, offline functionality, and connectivity. |
| separable_ks_component_exists | No |
| course_fit_decision | Non-course route |
| recommended_intervention_route | Resource or infrastructure support; systems strengthening; technical assistance |
| course_design_readiness | Blocked |
| design_blocking_reason | Training cannot solve the primary barrier; system and device constraints must be addressed first. |

# 16. Approval and locking behavior

| Status | Meaning | Editable? | Can appear in native dashboard? | Can unlock Design? |
| --- | --- | --- | --- | --- |
| Draft | Record being prepared | Yes | No or internal draft view only | No |
| Submitted for review | Entry user submitted for review | Limited | Internal review view | No |
| Needs revision | Reviewer returned record | Yes, assigned user | No or review queue only | No |
| Validated | Finding validated but not yet approved/locked | Limited | Yes, if safe | No |
| Approved | Reviewer/admin approved the record | Limited | Yes, based on visibility | Not yet unless handover ready |
| Locked | Core fields locked as source of truth | No core edits | Yes, based on visibility | Yes if course-fit allows |
| Handover ready | Ready to create Analysis-to-Design Handover | No core edits | Yes | Yes |
| Used in Design | Selected by course creator | No core edits without return path | Yes | Already used |
| Blocked from Design | Not suitable or not ready | Limited | Dashboard-safe status only | No |
| Specialist review required | Sensitive or technical review needed | Limited | Restricted | No until cleared |
| Archived | Retained but inactive | No, unless reopened | Aggregated or hidden | No |

# 17. Integration with later workflow

| Later workflow stage | Fields reused from this form |
| --- | --- |
| Native Analysis Dashboard | capacity area, sub-capacity, K/S/M/E route, course-fit decision, priority, confidence, validation, risk flags, readiness, geography/cohort if safe |
| Analysis Record Detail View | full safe Analysis Record, evidence summary, diagnosis, course-fit, safeguards, evaluation anchor |
| Design Phase | capacity area, target learner group, gap, baseline, desired practice, separable K/S component, safeguards, evaluation anchor |
| Capacity Map | capacity area, sub-capacity, indicator/standard, target learner group, desired practice |
| Action Map | gap, desired practice, separable K/S component, performance problem, evaluation anchor |
| Learning Design Document | all approved Analysis fields as read-only context |
| Build Studio | safeguards/no-harm note, learner context, capacity area, course-fit boundary, evaluation anchor |
| Review | original Analysis evidence and K/S/M/E logic for traceability checks |
| Publish | capacity and safety metadata, locked Analysis link |
| Monitoring | baseline, capacity area, learner group, course-fit, evaluation anchor, certificate/proof interpretation |

The revised developer-facing implementation description confirms that Design should reuse fields such as linked Analysis Handover ID, target learner group, capacity area and sub-capacity, indicator/standard, baseline/current practice, desired practice, K/S route, safeguarding/civic-space constraints, AI authoring boundaries, and evaluation anchor.

# 18. Quality Self-Check

| Criterion group | Status | Evidence / note | Revision needed? |
| --- | --- | --- | --- |
| Comprehensive structure | Met | Specifies 12 major form sections covering identity, capacity classification, learner context, gap, evidence, K/S/M/E, course-fit, safeguards, evaluation, dashboard reuse, approval, and audit trail. | No |
| Field-level detail | Met | Includes field names, descriptions, field types, requirement levels, validation rules, help text, and examples. | No |
| Required/conditional/optional fields | Met | Provides always-required, conditionally required, and optional field summaries. | No |
| Controlled vocabularies | Met | Includes controlled options for capacity areas, evidence types, validation, confidence, K/S/M/E, course-fit, intervention routes, risk flags, visibility, status, and handover. | No |
| Approval and locking | Met | Includes draft, submitted, needs revision, validated, approved, locked, handover ready, used in Design, blocked, specialist review, and archived states. | No |
| Integration readiness | Met | Fields support SQL/database storage, native dashboard views, Analysis Record detail, and Design Phase prefill/read-only logic. | No |
| User guidance | Met | Provides help text and good-entry examples to guide high-quality entry by analysis leads. | No |
| DEC-specific grounding | Met | Uses DEC capacity areas, Analysis-to-Design logic, K/S/M/E, course-fit, native dashboard, and Course Creator Portal workflow. | No |
| Hybrid field-to-platform logic | Met | Clearly states that raw field data remains outside the form and only synthesized validated findings are entered. | No |
| Native dashboard decision respected | Met | Uses native in-platform dashboard language only and explicitly follows the addendum. | No |
| K/S/M/E and course-fit discipline | Met | Includes explicit system validation rules blocking Motivation/Environment-only and unclear cases from Design. | No |
| Safeguards and no-harm | Met | Includes sensitivity, visibility, AI restriction, anonymization, unsafe-data exclusion, and specialist review fields. | No |
| Practicality for local CSOs | Met | Balances structured fields with conditional logic so the form is robust without forcing unnecessary fields for every record. | No |
| Implementation readiness | Met | The specification can be translated into form sections, schema fields, enums, workflow gates, dashboard filters, and Codex implementation tasks. | No |


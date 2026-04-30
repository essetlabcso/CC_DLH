---
title: "Output 14 — Consolidated Final Operating Package"
project: "DEC Learning Hub Course Creator Portal"
package: "Analysis Phase Operating Package"
status: "Repo-ready specification"
intended_path: "docs/specs/analysis-phase/14_consolidated_final_operating_package.md"
source_basis:
  - "01_analysis_phase_synthesis.md"
  - "02_dec_cso_capacity_development_framework.md"
  - "03_modular_field_tool_package.md"
  - "04_triangulation_validation_synthesis_guide.md"
  - "05_final_analysis_data_entry_web_form_specification.md"
  - "06_analysis_record_data_model_sql_field_dictionary.md"
  - "07_native_in_platform_analysis_dashboard_specification.md"
  - "08_analysis_to_design_handover_specification.md"
  - "09_native_analysis_dashboard_specification.md"
  - "10_dashboard_metrics_pages_filters_record_detail_views.md"
  - "11_safeguards_consent_data_safety_visibility_rules.md"
  - "12_role_based_use_cases_permissions.md"
  - "13_codex_implementation_guidance_acceptance_criteria.md"
---

<!--
Governing note for Codex/GPT-5.5:
This document consolidates the DEC Learning Hub Analysis Phase operating package.
Where any earlier material mentions Power BI, ignore it. The Analysis Dashboard must be implemented natively inside the DEC Learning Hub platform, using the platform database as the source of truth.
-->

# Output 14 — Consolidated Final Operating Package

# DEC Learning Hub Analysis Phase Operating Package

## 1. Executive purpose

The **DEC Learning Hub Analysis Phase Operating Package** defines how DEC and its partners identify, validate, structure, approve, visualize, and reuse CSO capacity gap evidence before course creation begins.

Its core purpose is to ensure that the DEC Learning Hub does **not** become a generic course factory. Every course should begin from a validated CSO capacity gap, a clear learner group, a baseline/current practice, a desired practice, a K/S/M/E diagnosis, a course-fit decision, safeguards, and an evaluation anchor.

The governing workflow is:

**Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.**

The Native Dashboard Addendum overrides all earlier Power BI references. The dashboard must be implemented **natively inside the DEC Learning Hub platform**, using the platform database as the source of truth.

---

# 2. Analysis Phase operating logic

## 2.1 What the Analysis Phase does

The Analysis Phase helps DEC answer:

| Question | Why it matters |
|---|---|
| What CSO capacity gap exists? | Prevents vague training topics. |
| Which DEC capacity area does it belong to? | Links the gap to DEC’s capacity framework. |
| What is the baseline/current practice? | Shows what is happening now. |
| What is the desired practice? | Defines realistic improvement. |
| What evidence confirms the gap? | Prevents assumptions. |
| Why is the gap happening? | Supports K/S/M/E diagnosis. |
| Is the gap course-addressable? | Prevents using courses for non-training problems. |
| What safeguards apply? | Protects CSOs, learners, communities, and sensitive data. |
| What should be monitored later? | Connects Analysis to learning and improvement evidence. |

The Analysis Phase should not capture every raw field note. It should capture the final validated and synthesized findings that are ready to become structured Analysis Records.

## 2.2 Core Analysis Phase workflow

| Step | Activity | Output |
|---:|---|---|
| 1 | Define assessment purpose | Assessment scope |
| 2 | Select field tools | Tool selection plan |
| 3 | Gather evidence | Raw field evidence outside platform |
| 4 | Organize findings by capacity area | Initial synthesis |
| 5 | Triangulate evidence | Triangulation matrix |
| 6 | Validate with CSOs/stakeholders | Validation summary |
| 7 | Diagnose K/S/M/E root cause | Root-cause diagnosis |
| 8 | Decide course-fit | Course-fit decision |
| 9 | Identify complementary support | Intervention route |
| 10 | Review safeguards | No-harm and visibility note |
| 11 | Define evaluation anchor | Future monitoring link |
| 12 | Enter final Analysis Record | Structured platform record |
| 13 | Use native dashboard | Analysis insights and decisions |
| 14 | Approve and lock | Analysis-to-Design Handover |

---

# 3. DEC CSO Capacity Development Framework

## 3.1 Capacity is broader than training

The DEC Learning Hub should treat capacity as more than individual knowledge. Capacity includes individual skills, organizational systems, leadership, culture, relationships, resources, and enabling-environment conditions.

Therefore, a course is appropriate only when the diagnosed gap is primarily **Knowledge** or **Skill**, or when a broader Mixed/Motivation/Environment gap includes a clearly separable Knowledge/Skill component.

## 3.2 The nine DEC capacity areas

Every Analysis Record should be mapped to one primary DEC capacity area.

| No. | DEC capacity area |
|---:|---|
| 1 | Internal Governance and Leadership |
| 2 | Transparency and Accountability |
| 3 | Strategic Planning and Organizational Sustainability |
| 4 | Financial Management and Resource Mobilization |
| 5 | Human Resources, Inclusion, and Safeguarding |
| 6 | Evidence-Based Advocacy and Civic Engagement |
| 7 | Monitoring, Evaluation, Accountability, and Learning |
| 8 | Digital Skills and Data Use / IT Competencies |
| 9 | Networking, Partnerships, and Collective Action |

The taxonomy should function as product logic across Analysis, Design, Build, Review, Publish, learner-facing metadata, practical proof, verified achievements, and monitoring dashboards.

## 3.3 Framework traceability chain

| Framework layer | Required output |
|---|---|
| Capacity area | One of the nine DEC capacity areas |
| Sub-capacity | Specific practice/function |
| Indicator/standard | Relevant benchmark, objective, or donor/CSO standard |
| Capacity gap | Specific validated gap |
| Baseline/current practice | What happens now |
| Desired practice | What should happen instead |
| Evidence | Evidence source summary, triangulation, validation |
| K/S/M/E diagnosis | Knowledge, Skill, Motivation, Environment, Mixed, or Unclear |
| Course-fit | Course-addressable, partly, non-course, further diagnosis, archived |
| Safeguards | Risk flags, visibility restrictions, no-harm note |
| Evaluation anchor | Future monitoring and assessment signal |
| Analysis Record | Structured database record |
| Handover | Locked reusable Design input |
| Monitoring | Dashboard and course improvement evidence |

---

# 4. Modular Field Tool Package

## 4.1 Tool menu

The field tools are a flexible **menu**, not a compulsory package.

| Tool | Purpose |
|---|---|
| 1. CSO Capacity Scoping Template | Define assessment purpose, CSO/cohort, capacity area, learner group, and initial concern. |
| 2. CSO Self-Assessment Tool | Capture CSO perceptions of current practice, strengths, gaps, and priorities. |
| 3. Key Informant Interview Guide | Explore deeper root causes, practical constraints, and K/S/M/E explanations. |
| 4. Focus Group Discussion Guide | Identify shared patterns, role differences, and group-level constraints. |
| 5. Secondary Document Review Checklist | Use existing evidence before collecting new data. |
| 6. Stakeholder Validation Workshop Guide | Confirm, revise, or reject synthesized findings. |
| 7. Capacity Gap Scoring and Prioritization Matrix | Rank gaps by severity, reach, evidence strength, course-fit, and safety. |
| 8. Triangulation Matrix | Compare evidence sources and assign confidence. |
| 9. K/S/M/E Diagnosis Worksheet | Classify root cause and separable K/S component. |
| 10. Course-Fit Decision Tool | Decide whether course design should proceed. |
| 11. Safeguards and No-Harm Review Checklist | Identify safety, privacy, civic-space, and visibility risks. |
| 12. Evaluation Anchor Worksheet | Link baseline and desired practice to future monitoring. |

## 4.2 Minimum final synthesis before platform entry

| Field | Required synthesis |
|---|---|
| CSO/cohort/program context | Who or what context the finding relates to |
| Primary DEC capacity area | One of nine areas |
| Sub-capacity | Specific function/practice |
| Target learner group | Who needs to do something differently |
| Validated capacity gap | Specific actor + task/practice problem |
| Baseline/current practice | Current reality |
| Desired practice | Realistic improved practice |
| Evidence sources used | Safe summary |
| Triangulation status | Confirmed / partly / reframed / contradicted / not confirmed |
| Validation status | Validated / revised / needs evidence / not validated |
| K/S/M/E route | K / S / M / E / Mixed / Unclear |
| Course-fit decision | Course / partly / non-course / further diagnosis |
| Safeguards/no-harm note | Safety and visibility guidance |
| Evaluation anchor | Future monitoring and assessment link |
| Design readiness | Ready / conditional / blocked / specialist review |

---

# 5. Triangulation, Validation, and Synthesis Guide

## 5.1 Triangulation results

| Result | Meaning | Next action |
|---|---|---|
| Confirmed | Multiple sources support the same gap | Proceed to validation and diagnosis |
| Partly confirmed | Evidence supports the gap but details need clarification | Revise or collect limited evidence |
| Reframed | Evidence shows the original issue was wrongly described | Rewrite gap statement |
| Contradicted | Sources disagree in a meaningful way | Investigate before approval |
| Not confirmed | Evidence does not support the gap | Do not proceed to Design |
| Unsafe to verify fully | More verification could create risk | Use safe summary or specialist review |

## 5.2 Evidence confidence

| Confidence | Meaning |
|---|---|
| High | Multiple credible sources confirm gap and root cause |
| Medium | More than one source supports gap, but some uncertainty remains |
| Low | Weak, anecdotal, outdated, or contradictory evidence |
| Not confirmed | Evidence does not support gap |
| Unsafe to confirm fully | Further verification could create harm |

## 5.3 Validation status

| Status | Meaning |
|---|---|
| Validated | Stakeholders confirm the finding |
| Validated with revisions | Finding confirmed but revised |
| Needs more evidence | Cannot confirm yet |
| Not validated | Rejected or unsupported |
| Validation limited | Validation constrained by risk or availability |
| Specialist validation required | Safeguards, civic-space, legal, or technical review needed |

---

# 6. K/S/M/E Routing and Course-Fit Decision Framework

## 6.1 K/S/M/E categories

| Route | Meaning | Phase 1 implication |
|---|---|---|
| Knowledge | Learners do not understand concepts, standards, rules, steps, or good practice | Usually course-addressable |
| Skill | Learners understand but cannot apply in a task, tool, decision, scenario, or work output | Usually course-addressable |
| Motivation | Learners know what to do but lack confidence, ownership, incentive, leadership support, trust, habit, or perceived value | Not a course by itself |
| Environment | Barrier sits outside learner: systems, tools, time, staffing, funding, policies, civic-space, safety, donor rules | Not a course by itself |
| Mixed | More than one cause is present | Proceed only for separable K/S component |
| Unclear | Evidence is insufficient or contradictory | Further diagnosis required |

Knowledge and Skill gaps may proceed into course design. Motivation and Environment gaps should not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly recorded.

## 6.2 Course-fit decisions

| Decision | Meaning | Workflow result |
|---|---|---|
| Course-addressable | Mainly Knowledge/Skill | Can proceed if approved and safe |
| Partly course-addressable | Separable K/S component exists alongside M/E barriers | Can proceed only for K/S component |
| Non-course route | Mainly Motivation/Environment/systemic | Block course Design |
| Needs further diagnosis | Evidence/root cause unclear | Keep in Analysis |
| Not suitable / archived | Outside Phase 1 or unsafe | Archive or retain for strategic learning |

---

# 7. Final Analysis Data Entry Web Form Specification

## 7.1 Form sections

| No. | Section |
|---:|---|
| 1 | Record Identity and Context |
| 2 | Capacity Classification |
| 3 | Target Learner and Use Context |
| 4 | Validated Capacity Gap |
| 5 | Evidence, Triangulation, and Validation |
| 6 | K/S/M/E Root-Cause Diagnosis |
| 7 | Course-Fit and Intervention Routing |
| 8 | Safeguards, Data Safety, and Visibility |
| 9 | Evaluation Anchor and Future Monitoring |
| 10 | Native Dashboard and Design Reuse Flags |
| 11 | Approval, Locking, and Workflow Status |
| 12 | Audit Trail and Revision Notes |

## 7.2 Required core fields

| Field group | Key fields |
|---|---|
| Identity | title, code, program context, organization/cohort if safe, prepared by, analysis date |
| Taxonomy | primary capacity area, sub-capacity, indicator/standard, taxonomy confidence |
| Learner | target learner group, learner context, constraints, language/accessibility needs |
| Gap | validated gap, baseline/current practice, desired practice, consequence, strengths |
| Evidence | evidence sources, triangulation status, validation status, confidence, limitations |
| K/S/M/E | route, components, separable K/S, non-course component, root-cause note |
| Course-fit | decision, rationale, intervention route, readiness, priority, blocking reason |
| Safeguards | risk flags, sensitivity, anonymization, visibility, AI restriction, no-harm note |
| Evaluation | final test focus, practical output, proof possibility, monitoring signal, limitation note |
| Dashboard | safe label, safe summary, inclusion mode, filter tags |
| Workflow | status, submission, approval, lock, handover, return/reopen reason |
| Audit | created/updated/reviewed/approved/locked by and timestamp |

## 7.3 Essential validation rules

| Rule | Required behavior |
|---|---|
| No blank gap | Gap, baseline, and desired practice are required |
| No unsupported approval | Not confirmed/contradicted records cannot be approved |
| No unclear Design unlock | Unclear K/S/M/E blocks Design |
| No M/E-only Design unlock | Motivation/Environment require separable K/S to proceed |
| Mixed-gap control | Mixed requires separable K/S and non-course component |
| Safeguards gate | High-risk records require specialist review |
| Dashboard safety | Anonymized/restricted records cannot expose unsafe labels |
| Approval lock | Core Analysis fields become read-only after lock |
| Handover gate | Only approved, locked, Design-ready records create handover |

---

# 8. Analysis Record Data Model and SQL-Ready Field Dictionary

## 8.1 Recommended logical tables

| Table | Purpose |
|---|---|
| `analysis_records` | Main structured Analysis Record |
| `analysis_capacity_links` | Capacity area, sub-capacity, indicator/standard |
| `analysis_evidence_sources` | Evidence source summaries and metadata |
| `analysis_evidence_assessment` | Triangulation, validation, confidence |
| `analysis_ksme_diagnoses` | Root-cause diagnosis |
| `analysis_course_fit_decisions` | Course-fit and intervention route |
| `analysis_safeguard_reviews` | Risk, visibility, AI/proof restrictions |
| `analysis_evaluation_anchors` | Monitoring, assessment, proof links |
| `analysis_dashboard_flags` | Safe dashboard display settings |
| `analysis_to_design_handovers` | Locked Analysis-to-Design bridge |
| `analysis_workflow_events` | Audit trail and workflow transitions |
| `analysis_record_versions` | Version history |
| `analysis_comments` | Review and specialist comments |
| `analysis_attachments_metadata` | Optional safe metadata for attachments |

## 8.2 Key calculated gates

| Calculated field | True only when |
|---|---|
| `design_reuse_allowed` | approved/locked + valid evidence + valid K/S/M/E + course-fit allows + safeguards cleared |
| `handover_ready` | design reuse allowed + lock status complete + required fields complete |
| `safeguards_cleared_for_design` | no high unresolved risk, unsafe data excluded, specialist review cleared where required |
| `design_unlock_allowed_by_ksme` | K/S route valid, or Mixed/M/E has separable K/S |
| `design_unlock_allowed_by_course_fit` | course-addressable or partly course-addressable |

---

# 9. Native Analysis Dashboard Specification

## 9.1 Dashboard pages

| Page | Purpose |
|---|---|
| Executive Overview | Full pipeline status and priority alerts |
| Capacity Area Analysis | Gaps across nine DEC capacity areas |
| K/S/M/E Diagnosis | Root-cause patterns and mismatches |
| Course-Fit Pipeline | Course, blended, non-course, blocked, diagnosis-needed records |
| CSO/Cohort/Region Comparison | Safe comparison where allowed |
| Evidence Strength and Validation | Evidence quality and validation |
| Safeguards and Risk Flags | Sensitive records and specialist review |
| Design Readiness | Records ready/blocked for Design |
| Analysis Record Detail View | Structured record-level detail and actions |

## 9.2 Core metrics

| Metric group | Example metrics |
|---|---|
| Executive | total records, validated, approved, locked, ready for Design, high-risk |
| Capacity | gaps by capacity area, sub-capacity, indicator coverage |
| K/S/M/E | Knowledge, Skill, Motivation, Environment, Mixed, Unclear |
| Course-fit | course-addressable, partly, non-course, diagnosis-needed |
| Evidence | confidence, validation, triangulation, source mix |
| Safeguards | risk flags, sensitivity, specialist review, visibility |
| Design readiness | ready, conditional, blocked, handover created, used in Design |

## 9.3 Global filters

- program/cohort;
- capacity area;
- sub-capacity;
- K/S/M/E route;
- course-fit decision;
- Design readiness;
- evidence confidence;
- validation status;
- priority;
- risk/sensitivity;
- intervention route;
- geography, if safe;
- organization/CSO, if authorized;
- target learner group;
- date range;
- status.

## 9.4 Dashboard safety rules

| Risk | Dashboard behavior |
|---|---|
| Raw evidence | Never displayed |
| CSO shaming | No public ranking/league tables |
| Small-number exposure | Aggregate upward |
| Civic-space sensitivity | Restrict/anonymize |
| Safeguarding sensitivity | Specialist-only safe summary |
| AI leakage | Do not expose AI-restricted content |
| Unauthorized detail access | Enforce record-level permissions |
| Export risk | Export safe summaries only |

---

# 10. Analysis-to-Design Handover Specification

## 10.1 Purpose

The handover is the locked bridge from Analysis to Design. It prevents blank-page course creation and ensures Design starts from approved evidence.

## 10.2 Handover entry conditions

| Condition | Required |
|---|---|
| Validated gap complete | Yes |
| Capacity taxonomy mapped | Yes |
| Evidence/triangulation/validation complete | Yes |
| K/S/M/E diagnosis complete | Yes |
| Course-fit decision complete | Yes |
| Safeguards/no-harm note complete | Yes |
| Evaluation anchor complete | Yes |
| Specialist review cleared, if required | Yes |
| Record approved and locked | Yes |

## 10.3 Locked fields reused in Design

| Locked Analysis field |
|---|
| capacity area |
| sub-capacity |
| indicator/standard |
| target learner group |
| learner context |
| validated gap |
| baseline/current practice |
| desired practice |
| practical consequence |
| K/S/M/E route |
| separable K/S component |
| non-course component |
| course-fit decision |
| complementary support note |
| safeguards/no-harm note |
| visibility and AI restrictions |
| evaluation anchor |
| final test focus |
| practical proof possibility |
| monitoring signal |
| limitation/overclaiming note |

The Analysis-to-Design Handover should be used as read-only Design context. Course creators should not edit locked Analysis fields directly. Corrections require return to Analysis.

---

# 11. Safeguards, Consent, Data Safety, and Visibility Rules

## 11.1 Safe-by-default principle

The platform should protect CSO trust by default:

- do not enter raw interview/FGD notes into final records;
- do not display personal, beneficiary, safeguarding, civic-space, or politically sensitive details;
- use safe summaries, anonymization, aggregation, and restrictions;
- block AI use for sensitive records;
- avoid donor-facing visibility unless future consent-based safe summaries are explicitly enabled.

## 11.2 Visibility modes

| Mode | Meaning |
|---|---|
| Standard internal visibility | Full safe record visible to authorized internal users |
| Restricted internal visibility | Detail limited to selected roles |
| Anonymized in dashboard | CSO/person/location masked |
| Aggregated only | Counted in charts but no detail |
| Specialist review only | Only assigned specialist/admin sees detail |
| Do not display until cleared | Hidden from dashboard |
| Archived restricted | Retained but inactive and hidden |

## 11.3 Risk flags

| Risk flag examples |
|---|
| Safeguarding concern |
| Child protection sensitivity |
| GBV/protection sensitivity |
| Civic-space sensitivity |
| Political sensitivity |
| Public authority/advocacy sensitivity |
| Personal data risk |
| Beneficiary-identifiable data risk |
| Organizational vulnerability risk |
| Financial/confidential document risk |
| Donor sensitivity |
| AI prompt safety restriction |
| Practical proof safety concern |

---

# 12. Role-Based Use Cases and Permissions

## 12.1 Core roles

| Role | Main Analysis responsibility |
|---|---|
| Analysis Data Entry User | Enter final validated Analysis Records |
| Consortium / Analysis Lead | Coordinate field analysis and synthesis |
| DEC Capacity / M&E Lead | Review evidence, taxonomy, K/S/M/E, course-fit, monitoring anchors |
| DEC Admin | Approve, lock, manage permissions, visibility, handover |
| Course Creator | Select approved Design-ready records |
| Reviewer | Check alignment and return issues |
| Safeguarding / Civic-Space Reviewer | Clear or restrict sensitive records |
| Accessibility / Localization Reviewer | Check learner constraints and adaptation needs |
| Organization Admin, future | Own organization safe summaries |
| Donor / Partner Viewer, future | Consent-based safe summaries only |

## 12.2 Key permission rules

| Action | Who may do it |
|---|---|
| Create draft Analysis Record | Analysis users, consortium leads, DEC leads/admins |
| Submit for review | Entry user or assigned lead |
| Approve record | DEC Admin or authorized reviewer/lead |
| Lock record | DEC Admin or authorized capacity lead |
| Create handover | DEC Admin or authorized capacity lead |
| Select record for Design | Course creator/admin, only if approved/locked/ready |
| View restricted records | Assigned authorized roles only |
| Clear safeguards review | Safeguards/civic-space reviewer or admin |
| Archive/reopen | DEC Admin |
| Edit locked Analysis anchors | Not from Design; must return to Analysis |

---

# 13. Codex Implementation Guidance and Acceptance Criteria

## 13.1 Recommended implementation slices

| Slice | Focus |
|---:|---|
| 1 | Repo/spec alignment and route audit |
| 2 | Analysis data model and seed records |
| 3 | Final Analysis Data Entry Web Form |
| 4 | K/S/M/E and course-fit gate logic |
| 5 | Safeguards, visibility, and role-sensitive access |
| 6 | Native Analysis Dashboard — minimum viable version |
| 7 | Analysis Record Detail View |
| 8 | Analysis-to-Design Handover |
| 9 | Audit trail and workflow events |
| 10 | Acceptance tests, fixtures, and evidence pack |

## 13.2 Binding implementation rules

| Rule | Codex must preserve |
|---|---|
| Native dashboard | No Power BI, embeds, bookmarks, workspaces, or BI dependency |
| K/S/M/E gate | M/E-only cannot unlock Design unless separable K/S exists |
| Analysis before Design | Course creators cannot start from blank page where Analysis is required |
| Locked anchors | Design cannot edit locked Analysis fields |
| Safeguards | No raw sensitive data in dashboard, AI, or examples |
| Role boundaries | Learners/unauthorized users cannot access Analysis/admin routes |
| AI boundaries | AI cannot invent evidence, change K/S/M/E, approve, publish, or verify |
| Certificate rule | 80%+ final test score triggers certificate |
| Proof distinction | Practical proof is separate from certificate |
| Review/Publish separation | Review approval does not publish course |

## 13.3 Required tests

| Test scenario | Expected result |
|---|---|
| Knowledge gap | Can become course-addressable if other gates pass |
| Skill gap | Can become course-addressable |
| Motivation-only without K/S | Design blocked |
| Environment-only without K/S | Design blocked |
| Mixed with separable K/S | Ready with conditions |
| Mixed without separable K/S | Design blocked |
| Unclear diagnosis | Further diagnosis required |
| High-risk pending review | Design blocked |
| Approved locked record | Handover can be created |
| Course creator starts Design | Read-only Analysis anchors appear |
| Unauthorized dashboard access | Blocked or restricted |
| Restricted record | Hidden/masked/aggregated according to visibility |
| Dashboard counts | Match seed data |

## 13.4 Codex evidence pack requirement

After each implementation slice, Codex should provide:

1. implementation slice summary;
2. plain-language product summary;
3. DEC workflow alignment;
4. files changed;
5. routes/screens affected;
6. data/schema/migration changes;
7. workflow/gate changes;
8. role/permission changes;
9. binding rule checks;
10. tests and verification results;
11. manual verification steps;
12. screenshots/URLs/evidence;
13. acceptance criteria results;
14. known gaps;
15. risks/decisions needed;
16. next smallest safe step.

---

# 14. Consolidated acceptance criteria for the Analysis Phase package

| Area | Acceptance standard |
|---|---|
| Evidence-first logic | Course creation begins from validated Analysis Records, not broad topics |
| Field-to-platform flow | Field tools remain modular; final platform entry captures synthesized findings only |
| Capacity framework | All nine DEC capacity areas are supported |
| K/S/M/E routing | Knowledge/Skill proceed; Motivation/Environment blocked unless separable K/S exists |
| Course-fit decision | Course, partly, non-course, diagnosis-needed, and archived routes are distinct |
| Final form | Structured, required/conditional fields, controlled vocabularies, validation rules |
| Data model | SQL-ready records support form, dashboard, handover, audit, and monitoring |
| Native dashboard | Built inside platform; no Power BI dependency |
| Dashboard pages | Executive, capacity, K/S/M/E, course-fit, comparison, evidence, safeguards, readiness, detail |
| Safeguards | Sensitive data restricted, anonymized, aggregated, or hidden |
| Role permissions | Actions and views controlled by role and assignment |
| Handover | Approved/locked records become read-only Design anchors |
| AI safety | AI only uses approved safe context and cannot make workflow decisions |
| Monitoring link | Baseline, desired practice, evaluation anchor, final test, proof, and improvement signals connect |
| Audit trail | Review, approval, lock, return, handover, visibility, and override events logged |
| Codex readiness | Implementation slices, tests, prompt, and evidence pack are defined |

---

# 15. Recommended next step

Place this file and the preceding Analysis Phase specification files in the DEC Learning Hub repo, preferably under:

```text
D:\CC_DLH\docs\specs\analysis-phase\
```

Then ask Codex to first audit the repo and produce a short implementation plan before making code changes.

Suggested controlling instruction for Codex:

```text
This document governs the DEC Learning Hub Analysis Phase implementation. Where any earlier material mentions Power BI, ignore it and implement the dashboard natively inside the DEC Learning Hub platform.
```

---

# 16. Final Quality Self-Check

| Criterion group | Status | Evidence / note |
|---|---:|---|
| Consolidation completeness | Met | Combines operating logic, framework, tools, synthesis, form, data model, dashboard, safeguards, handover, roles, Codex guidance, and acceptance criteria. |
| Native dashboard override | Met | Clearly specifies native in-platform dashboard and excludes Power BI. |
| DEC-specific grounding | Met | Uses DEC capacity areas, Course Creator workflow, K/S/M/E, Analysis-to-Design Handover, monitoring, safeguards, and certificates/proof distinction. |
| Practical usability | Met | Provides structured tables, workflows, tool menus, rules, and implementation slices. |
| K/S/M/E discipline | Met | Repeatedly enforces Knowledge/Skill vs Motivation/Environment routing logic. |
| Data safety | Met | Includes minimization, consent, visibility, dashboard restrictions, AI safety, and practical proof safety. |
| Dashboard readiness | Met | Provides dashboard pages, metrics, filters, record views, calculations, and safe display logic. |
| Implementation readiness | Met | Includes SQL-ready model, Codex slices, tests, evidence pack, and acceptance checklist. |
| Workflow traceability | Met | Preserves link from field evidence to Analysis Record, dashboard, handover, Design, course, certificate/proof, and monitoring. |
| Overall judgment | Met | The package is ready to be placed in the repo and used for Codex implementation planning. |

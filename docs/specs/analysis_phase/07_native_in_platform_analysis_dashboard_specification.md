# Output 7 — Native In-Platform Analysis Dashboard Specification

## 1. Purpose of the native Analysis Dashboard

The native Analysis Dashboard is the main analytical workspace for turning structured Analysis Records into decisions about CSO capacity gaps, course-fit, Design readiness, safeguards, and course pipeline priorities.

It must be built inside the DEC Learning Hub platform, using the same application environment, database, routing, role permissions, and design system as the Course Creator Portal. It must not be built as a Power BI dashboard, embedded Power BI report, or separate external BI layer. The Native Dashboard Addendum explicitly overrides earlier Power BI references and states that the Analysis Dashboard should be developed natively inside the DEC Learning Hub platform, using structured Analysis Records from the SQL/platform database.

The corrected architecture is:

Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.

The dashboard is not only for reporting. It is a workflow decision tool that helps DEC and authorized users identify which validated gaps are ready for Design, which gaps need further diagnosis, which gaps are not course-addressable, and which records carry safeguarding or visibility restrictions.

## 2. Dashboard users and decisions supported

| User group | What they need from the dashboard | Main decisions supported |
| --- | --- | --- |
| DEC Admin | Platform-wide overview of Analysis Records, approval status, locked records, blocked records, risk flags, and Design readiness. | Approve, lock, return, archive, assign reviewer, control visibility. |
| DEC Capacity / M&E Lead | Patterns across capacity areas, cohorts, evidence strength, validation status, K/S/M/E distribution, and future monitoring anchors. | Prioritize capacity areas, identify course pipeline needs, plan complementary support. |
| Course Creator | Approved Analysis Records ready for Design, with read-only context and clear course-fit boundaries. | Select a validated Analysis Record and start Design from evidence, not a blank page. |
| Reviewer | Evidence quality, K/S/M/E logic, safeguards, validation confidence, and whether course-fit decisions are justified. | Confirm whether a record is ready for handover or should be returned. |
| Safeguarding / Civic-Space Reviewer | Sensitive records, risk flags, visibility restrictions, no-harm notes, and specialist review queues. | Clear, restrict, return, or block sensitive records. |
| Consortium Lead / Analysis Lead | Status of submitted records, validation needs, evidence gaps, and returned records. | Revise records, strengthen evidence, complete missing fields. |

The addendum states that dashboard users need to understand validated CSO capacity gaps, explore the nine capacity areas, filter by K/S/M/E diagnosis, identify course-addressable Knowledge and Skill gaps, distinguish Motivation and Environment barriers, review evidence strength and validation status, identify approved Analysis Records ready for Design, and select or reference records for next workflow steps.

## 3. Core dashboard design standard

The native dashboard should feel like a professional analytical web application, not a basic admin table.

The addendum requires the dashboard to include a polished executive homepage, KPI cards, charts, filters, navigation, secondary analytical pages, drill-down or drill-through style interactions, hover tooltips, record-detail views, DEC branding, role-sensitive views, and responsive layout.

### Design principles

| Principle | Dashboard implication |
| --- | --- |
| Professional visual hierarchy | Key decisions appear first: validated gaps, course-addressable gaps, ready-for-Design records, blocked records, high-risk records. |
| DEC-branded | Use DEC Learning Hub visual identity, clean spacing, readable typography, and consistent status colors. |
| Workflow-connected | Every chart should help users move toward a decision, not just display numbers. |
| Role-sensitive | Users see only the records and detail levels appropriate to their role and assignment. |
| Safe by default | Avoid raw evidence exposure, unsafe CSO ranking, sensitive comparisons, or donor-style surveillance. |
| Action-oriented | Cards and charts should link to filtered lists, record detail views, and handover actions where permitted. |
| Low-bandwidth conscious | Avoid unnecessarily heavy visual effects; prioritize fast-loading charts and clear summaries. |
| Responsive | Usable on common laptop screens and tablets, with simplified mobile-friendly views where needed. |

## 4. Dashboard navigation structure

Recommended dashboard navigation:

| Main dashboard page | Purpose |
| --- | --- |
| 1. Executive Overview | High-level status of the full Analysis pipeline. |
| 2. Capacity Area Analysis | Patterns across the nine DEC capacity areas and sub-capacities. |
| 3. K/S/M/E Diagnosis | Root-cause distribution and course-fit implications. |
| 4. Course-Fit Pipeline | Which gaps are course-addressable, partly course-addressable, non-course, blocked, or needing diagnosis. |
| 5. CSO / Cohort / Region Comparison | Safe comparison by CSO, cohort, organization type, learner group, or geography where allowed. |
| 6. Evidence Strength and Validation | Evidence confidence, triangulation status, validation status, and evidence gaps. |
| 7. Safeguards and Risk Flags | Civic-space, safeguarding, data safety, visibility, and specialist review status. |
| 8. Design Readiness | Approved, locked, handover-ready, used-in-Design, blocked, and returned records. |
| 9. Analysis Record Detail View | Full structured safe view of one validated record and fields needed for Design handover. |

These pages match the required dashboard pages in the Native Dashboard Addendum, including Executive Overview, Capacity Area Analysis, K/S/M/E Diagnosis, Course-Fit Pipeline, CSO/Cohort/Region Comparison, Evidence Strength and Validation, Safeguards and Risk Flags, Design Readiness, and Analysis Record Detail View.

# Page 1 — Executive Overview

## Purpose

Give DEC leadership, admins, and capacity/M&E leads a quick understanding of the full Analysis Phase pipeline.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| How many Analysis Records exist? | Total records by status. |
| How many gaps are validated? | Validated and approved records. |
| How many gaps are ready for Design? | Locked and handover-ready records. |
| How many gaps are course-addressable? | Course-addressable and partly course-addressable counts. |
| How many gaps are blocked or need more diagnosis? | Blocked, further diagnosis, low-confidence, or specialist-review records. |
| Where are the main risks? | High-risk and safeguard-flagged records. |
| Which areas should DEC prioritize next? | Priority A/B gaps by capacity area and course-fit. |

## Recommended KPI cards

| KPI card | Calculation / source |
| --- | --- |
| Total Analysis Records | Count of analysis_records |
| Validated Gaps | Count where validation_status = validated or validated_with_revisions |
| Approved and Locked Records | Count where status = approved_locked |
| Ready for Design | Count where analysis_to_design_handover_status = ready_for_handover |
| Course-Addressable Gaps | Count where course_fit_decision = course_addressable |
| Partly Course-Addressable Gaps | Count where course_fit_decision = partly_course_addressable |
| Non-Course Route Gaps | Count where course_fit_decision = non_course_route |
| High-Risk Records | Count where sensitivity_level = high or specialist review required |
| Records Needing More Evidence | Count where validation_status = needs_more_evidence or evidence confidence = low |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Analysis pipeline funnel | Draft → Submitted → Validated → Approved → Locked → Handover Ready → Used in Design |
| Course-fit donut / segmented chart | Course-addressable, partly, non-course, further diagnosis, archived |
| Capacity area bar chart | Validated gaps by nine DEC capacity areas |
| K/S/M/E stacked bar | Knowledge, Skill, Motivation, Environment, Mixed, Unclear |
| Risk alert card group | High-risk, specialist review pending, do-not-display records |
| Priority table | Top Priority A and Priority B gaps with readiness status |

## Interactions

Click any KPI card to open a filtered record list.

Click a capacity area to drill into Page 2.

Click “Ready for Design” to open Page 8.

Click high-risk records to open Page 7.

Tooltip on each KPI explains calculation and safe interpretation.

# Page 2 — Capacity Area Analysis

## Purpose

Show how validated gaps are distributed across the nine DEC CSO capacity areas, sub-capacities, indicators, and learner groups.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Which capacity areas have the most validated gaps? | Bar chart by nine capacity areas. |
| Which sub-capacities are most common? | Ranked sub-capacity table. |
| Which areas have course-addressable gaps? | Capacity area × course-fit matrix. |
| Which capacity areas are blocked by Motivation or Environment barriers? | Capacity area × K/S/M/E distribution. |
| Which areas need complementary support beyond courses? | Capacity area × intervention route. |

## Required capacity areas

The dashboard must support all nine DEC capacity areas:

Internal Governance and Leadership

Transparency and Accountability

Strategic Planning and Organizational Sustainability

Financial Management and Resource Mobilization

Human Resources, Inclusion, and Safeguarding

Evidence-Based Advocacy and Civic Engagement

Monitoring, Evaluation, Accountability, and Learning

Digital Skills and Data Use / IT Competencies

Networking, Partnerships, and Collective Action

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Horizontal bar chart: validated gaps by capacity area | Shows concentration of needs. |
| Heatmap: capacity area × course-fit decision | Shows where courses are viable. |
| Stacked bar: capacity area × K/S/M/E route | Shows why gaps exist. |
| Sub-capacity ranked table | Shows practical areas needing attention. |
| Indicator/standard coverage table | Shows links to standards or benchmarks. |
| Priority bubble chart | Capacity area by number of gaps, priority, and evidence confidence. |

## Filters

Capacity area

Sub-capacity

Indicator/standard

Gap scope

Priority level

Course-fit decision

K/S/M/E route

Validation status

Cohort/region/CSO, if safe

# Page 3 — K/S/M/E Diagnosis

## Purpose

Help users understand the root causes of validated capacity gaps and prevent training from becoming the default answer.

The DEC implementation logic is clear: Knowledge and Skill gaps can proceed to course design; Motivation and Environment gaps should not proceed as Phase 1 courses unless a separable Knowledge/Skill component is recorded; Mixed gaps can proceed only if the course-addressable K/S component is explicit.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Are most gaps Knowledge, Skill, Motivation, Environment, or Mixed? | K/S/M/E distribution chart. |
| Which Motivation or Environment gaps are being blocked correctly? | Blocked record list and route logic. |
| Which Mixed gaps have separable Knowledge/Skill components? | Mixed-gap readiness table. |
| Which gaps still have unclear root cause? | Needs further diagnosis list. |
| Where is DEC at risk of building courses for non-training problems? | Warning list of M/E gaps with course requests. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| K/S/M/E route distribution donut | High-level diagnosis pattern. |
| Route × course-fit matrix | Shows whether course-fit aligns with root cause. |
| Mixed gap table | Lists separable K/S component and non-course support note. |
| Motivation/Environment blocked list | Shows records correctly blocked from Design. |
| Unclear diagnosis alert card | Shows records needing more diagnosis. |
| K/S/M/E by capacity area stacked chart | Shows root-cause patterns by capacity domain. |

## Required warning logic

| Condition | Dashboard warning |
| --- | --- |
| Motivation route + course-addressable decision | “Check course-fit: Motivation-only gaps should not unlock Design unless a separable K/S component is recorded.” |
| Environment route + course-addressable decision | “Check course-fit: Environment-only gaps require non-course support unless a separable K/S component exists.” |
| Mixed route + no separable K/S component | “Mixed gap cannot proceed to Design until course-addressable component is explicit.” |
| Unclear route | “Root cause unclear. Further diagnosis required before course design.” |

# Page 4 — Course-Fit Pipeline

## Purpose

Show how validated gaps move through the course-fit decision process and identify which records should become courses, blended interventions, non-course support, or further diagnosis.

The Course-Fit Decision rules require the platform to distinguish course-addressable gaps, partly course-addressable gaps, non-course routes, needs further diagnosis, and not suitable/archived records.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Which gaps are ready for course creation? | Course-addressable + approved/locked + safeguards cleared. |
| Which gaps need blended support? | Partly course-addressable records with complementary support note. |
| Which gaps should not become courses? | Non-course route records. |
| Which gaps need more diagnosis before a decision? | Needs further diagnosis. |
| What complementary supports are most common? | Intervention route breakdown. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Course-fit funnel | Validated → Course-addressable → Approved → Locked → Handover ready |
| Decision matrix: K/S/M/E × course-fit | Shows discipline in routing. |
| Intervention route bar chart | Course, mentoring, coaching, TA, systems strengthening, leadership, safeguarding, enabling environment |
| Partly course-addressable table | Shows K/S component plus non-course component. |
| Blocked records table | Shows reason Design cannot unlock. |
| Priority course pipeline list | Ready/near-ready course topics from approved Analysis Records. |

## Measures

| Measure | Calculation |
| --- | --- |
| Course-fit rate | Course-addressable + partly course-addressable ÷ validated records |
| Non-course route rate | Non-course records ÷ validated records |
| Mixed with separable K/S count | Mixed records where separable K/S exists |
| Blocked Design count | Records where Design readiness = blocked |
| Complementary support count | Records with at least one non-course support route |

# Page 5 — CSO / Cohort / Region Comparison

## Purpose

Allow safe comparison across CSOs, cohorts, regions, organization types, target learner groups, or program contexts where data is available and safe to display.

## Safety rule

This page must never become a public ranking, donor surveillance tool, or shaming mechanism. Organization-level comparison should be role-restricted, anonymized, aggregated, or hidden where sensitivity requires it.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Are similar gaps appearing across multiple CSOs? | Cohort-level pattern comparison. |
| Which learner groups are most affected? | Target learner group distribution. |
| Which regions or cohorts show repeated capacity needs? | Safe regional/cohort summaries. |
| Are some comparisons unsafe to display? | Visibility restrictions and anonymization flags. |
| Which gaps are cohort-wide and suitable for shared courses? | Multi-CSO validated gaps with course-fit status. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Cohort comparison cards | Gaps by cohort/program. |
| Target learner group bar chart | Who needs learning/support. |
| Safe map or region list | Region patterns only where safe. |
| CSO comparison table | Restricted to authorized users; use anonymized labels if needed. |
| Multi-CSO gap cluster view | Identifies shared course pipeline opportunities. |
| Visibility-restricted records card | Shows records hidden from comparison due to risk. |

## Role-sensitive behavior

| Role | View allowed |
| --- | --- |
| DEC Admin | Full internal view, subject to sensitivity restrictions. |
| DEC Capacity/M&E Lead | Cohort and capacity summaries; organization detail where authorized. |
| Course Creator | Only approved, safe, Design-relevant records. |
| Reviewer | Records assigned for review and safe evidence summaries. |
| Organization Admin | Future/optional: only own organization safe summaries. |
| Donor/Partner Viewer | Not included in this Analysis Phase dashboard unless future consent-based summary role is explicitly enabled. |

# Page 6 — Evidence Strength and Validation

## Purpose

Help users assess whether Analysis Records are credible enough to support Design and dashboard interpretation.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Which gaps are strongly evidenced? | High-confidence records. |
| Which records need more evidence? | Low-confidence or needs-more-evidence list. |
| Which records were validated with CSO stakeholders? | Validation status distribution. |
| Which records were reframed after triangulation? | Reframed records table. |
| Which evidence sources are most used? | Evidence source type breakdown. |
| Which capacity areas have weak evidence? | Capacity area × confidence matrix. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Evidence confidence KPI cards | High, medium, low, not confirmed. |
| Triangulation status chart | Confirmed, partly confirmed, reframed, contradicted, unsafe to verify. |
| Validation status chart | Validated, revised, needs more evidence, not validated, specialist validation required. |
| Evidence source type bar chart | Self-assessment, KII, FGD, document review, validation workshop, etc. |
| Evidence quality table | Record title, capacity area, confidence, limitations, next step. |
| Weak evidence alert list | Records blocked by weak evidence. |

## Important interpretation rule

A visually attractive dashboard should not hide weak evidence. Records with low confidence, unresolved contradictions, or limited validation should be clearly marked and should not unlock Design unless reviewed and corrected.

# Page 7 — Safeguards and Risk Flags

## Purpose

Protect CSOs, learners, communities, rights-holders, and sensitive organizational information from avoidable harm.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Which Analysis Records carry safeguarding, civic-space, data safety, or visibility risks? | Risk flag distribution and record list. |
| Which records need specialist review? | Specialist review queue. |
| Which records should be anonymized or aggregated only? | Visibility restriction summary. |
| Which records should not be displayed in dashboard detail? | Do-not-display or restricted records. |
| Which proof or AI-use restrictions should follow into Design/Build? | Safeguards detail panel. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Risk flag count cards | Safeguarding, civic-space, personal data, organizational vulnerability, AI restriction, proof safety. |
| Sensitivity level chart | Low, moderate, high, do not proceed. |
| Specialist review queue | Pending, cleared, returned, blocked. |
| Visibility restriction table | Standard, restricted, anonymized, aggregated only, do not display. |
| Risk by capacity area heatmap | Shows where sensitive content clusters. |
| Safeguards detail drawer | Shows no-harm note, AI restriction, proof safety note, visibility restrictions. |

## Safety interactions

High-risk records should not open full detail unless the user has the required role.

Sensitive CSO names should be masked where anonymization is required.

Tooltip should explain why a record is restricted.

Dashboard should show safe summary, not raw evidence.

Specialist reviewers should have clear actions: clear, return, restrict, block, or request revision.

# Page 8 — Design Readiness

## Purpose

Identify which Analysis Records can be used to start Design and which are blocked, returned, or still incomplete.

## User questions answered

| User question | Dashboard answer |
| --- | --- |
| Which approved records are ready for Design? | Handover-ready list. |
| Which records are approved but not locked? | Approval/lock status. |
| Which records are blocked from Design and why? | Blocking reason table. |
| Which records need specialist review before Design? | Specialist review list. |
| Which records were already selected by course creators? | Used-in-Design records. |
| Which records are returned to Analysis? | Return/revision queue. |

## Recommended visuals

| Visual | Purpose |
| --- | --- |
| Design readiness KPI cards | Ready, ready with conditions, blocked, specialist review, used in Design. |
| Handover status funnel | Approved → Locked → Handover ready → Handover created → Used in Design. |
| Ready-for-Design table | Records creators can select. |
| Blocked records table | Shows K/S/M/E, course-fit, safeguards, evidence, or approval reason. |
| Returned records list | Shows reviewer comments and next action. |
| Handover action panel | For authorized admins: create/lock handover. |

## Gate logic shown in dashboard

| Condition | Dashboard readiness |
| --- | --- |
| Knowledge/Skill + validated + approved + locked + safeguards cleared | Ready for Design |
| Mixed + separable K/S + complementary support note + approved + locked | Ready with conditions |
| Motivation/Environment without separable K/S | Blocked |
| Unclear K/S/M/E route | Needs further diagnosis |
| High risk + pending specialist review | Specialist review required |
| Not validated or low confidence | Not ready |
| Approved but not locked | Approved, locking needed |

# Page 9 — Analysis Record Detail View

## Purpose

Provide a safe, structured, role-sensitive detail view for one Analysis Record.

This view should be the bridge between dashboard interpretation and Course Creator Portal action.

## Main sections

| Section | Fields shown |
| --- | --- |
| Record summary | Title, code, status, capacity area, sub-capacity, priority, readiness |
| Gap definition | Validated gap, baseline/current practice, desired practice, practical consequence |
| Evidence | Evidence source summary, triangulation status, validation status, confidence level, limitations |
| K/S/M/E diagnosis | Route, components, separable K/S component, non-course component |
| Course-fit | Decision, rationale, intervention route, complementary support |
| Safeguards | Risk flags, sensitivity, no-harm note, AI restrictions, visibility restriction |
| Evaluation anchor | Final test focus, practical output possibility, monitoring signal, overclaiming limitation |
| Handover readiness | Approval, lock status, handover status, Design reuse allowed |
| Audit trail | Created by, updated by, reviewed by, approved by, locked by, version history |
| Actions | View, export safe summary, assign review, approve, lock, create handover, select for Design, return, archive — role-dependent |

## Record detail actions by role

| Action | DEC Admin | Capacity/M&E Lead | Reviewer | Course Creator | Specialist Reviewer |
| --- | --- | --- | --- | --- | --- |
| View full internal record | Yes | Yes, if authorized | Assigned records | Approved safe records only | Relevant sensitive records |
| View safe summary | Yes | Yes | Yes | Yes, if Design-ready | Yes |
| Approve record | Yes | Maybe, if assigned | Maybe, if assigned | No | No, unless specialist clearance |
| Lock record | Yes | Maybe, if assigned | No | No | No |
| Create Analysis-to-Design Handover | Yes | Maybe, if assigned | No | No | No |
| Select record for Design | Yes | No | No | Yes, if approved/ready | No |
| Return for revision | Yes | Yes, if assigned | Yes, if assigned | No | Yes, for safety issues |
| Restrict visibility | Yes | Recommend | Recommend | No | Recommend/require |
| Archive | Yes | Recommend | Recommend | No | Recommend |

## 5. Global filters

Every page should support a consistent filter bar, adjusted by role and permissions.

| Filter | Notes |
| --- | --- |
| Program / cohort | Default filter for DEC program or course pipeline. |
| Capacity area | Nine DEC capacity areas. |
| Sub-capacity | Dependent on capacity area. |
| K/S/M/E route | Knowledge, Skill, Knowledge + Skill, Motivation, Environment, Mixed, Unclear. |
| Course-fit decision | Course-addressable, partly, non-course, further diagnosis, not suitable, archived. |
| Design readiness | Ready, ready with conditions, blocked, specialist review, used in Design. |
| Evidence confidence | High, medium, low, not confirmed, unsafe to confirm fully. |
| Validation status | Validated, revised, needs evidence, not validated, limited, specialist required. |
| Priority | Priority A, B, C, non-course priority, not ready, archived. |
| Risk/sensitivity | Low, moderate, high, do not proceed. |
| Intervention route | Course, mentoring, coaching, TA, systems, leadership, safeguarding, enabling environment. |
| Geography | Only where safe. |
| Organization/CSO | Only where user is authorized and visibility permits. |
| Target learner group | Program officers, finance staff, board members, MEAL staff, etc. |
| Date range | Analysis date, validation date, approval date, lock date. |
| Status | Draft, submitted, validated, approved, locked, handover ready, used in Design, blocked, archived. |

## 6. Interactive behavior

| Interaction | Required behavior |
| --- | --- |
| Click KPI card | Opens filtered record list. |
| Click chart segment | Applies filter across page or navigates to relevant page. |
| Hover tooltip | Shows plain-language definition, calculation, and interpretation caution. |
| Drill-down / drill-through style interaction | Opens capacity area, K/S/M/E, or course-fit page with filter applied. |
| Record row click | Opens Analysis Record Detail View, subject to permissions. |
| “View safe summary” | Opens restricted-safe version of the record. |
| “Create handover” | Available only to authorized roles when readiness conditions are met. |
| “Select for Design” | Available only to course creators/admins for approved, locked, Design-ready records. |
| “Return for revision” | Available to reviewers/admins with required comment. |
| “Request specialist review” | Available when safeguards or technical review is needed. |
| “Export safe summary” | Generates a safe internal summary, not raw evidence export. |

## 7. Recommended dashboard calculations

| Calculation | Formula / logic |
| --- | --- |
| Validation rate | Validated records ÷ submitted records |
| Approval rate | Approved/locked records ÷ validated records |
| Design readiness rate | Handover-ready records ÷ approved records |
| Course-addressable rate | Course-addressable records ÷ validated records |
| Partly course-addressable rate | Partly course-addressable records ÷ validated records |
| Non-course route rate | Non-course route records ÷ validated records |
| K/S course-fit count | Knowledge + Skill + Knowledge/Skill records that are course-addressable |
| Mixed separable K/S count | Mixed records with separable K/S component recorded |
| Blocked by K/S/M/E count | Motivation/Environment/Unclear records without allowed course-fit |
| Safeguard review pending count | Specialist review required but not cleared |
| High-risk display restriction count | High-risk records with restricted/anonymized/aggregated-only visibility |
| Evidence confidence score | Weighted or categorical summary: high, medium, low, not confirmed |
| Priority A course pipeline count | Priority A records with course-addressable or partly course-addressable status |
| Handover conversion rate | Records used in Design ÷ handover-ready records |

## 8. Role-sensitive views

| Role | Default landing view | Hidden/restricted items |
| --- | --- | --- |
| DEC Admin | Executive Overview | None except fields marked specialist-only or do-not-display unless cleared. |
| Capacity/M&E Lead | Capacity Area Analysis + Evidence Strength | Raw sensitive details; restricted CSO identity where anonymized. |
| Course Creator | Design Readiness + approved record list | Draft, unvalidated, blocked, high-risk, raw evidence, restricted records. |
| Reviewer | Review queue + Record Detail View | Records not assigned unless role allows broader review. |
| Safeguarding/Civic-Space Reviewer | Safeguards and Risk Flags | Non-assigned non-sensitive records may be hidden. |
| Consortium/Analysis Lead | Submitted/returned records and validation status | Other organizations’ restricted records. |
| Organization Admin, future | Own organization safe summaries only | Cross-CSO comparison, raw evidence, other CSO records. |

The dashboard must support role-sensitive views and safe display. The acceptance guide specifically requires role-sensitive views, workflow integration, data safety, interactive behavior, and pages that support real decisions rather than decorative charts.

## 9. Data safety and visibility rules inside the dashboard

| Data type | Dashboard behavior |
| --- | --- |
| Raw field notes | Do not display. |
| Interview or FGD quotes | Display only if anonymized, approved, and safe; default should be summary only. |
| CSO names | Display only if organization visibility permits and user is authorized. |
| Safeguarding/protection details | Do not show raw details; use specialist-only safe summaries. |
| Civic-space sensitive records | Restrict, anonymize, or aggregate. |
| Personal/beneficiary data | Do not display. |
| Organizational vulnerabilities | Avoid public ranking; show role-sensitive summaries. |
| Donor-facing summaries | Not part of this phase unless future consent-based role is explicitly enabled. |
| AI-sensitive content | Do not expose in AI prompts unless safe summary is approved. |

## 10. Record selection for Design

The dashboard should support direct workflow action when a record is ready.

### Design selection flow

| Step | Dashboard behavior |
| --- | --- |
| 1 | Course creator opens “Design Readiness” or filtered “Ready for Design” list. |
| 2 | Creator selects an approved, locked Analysis Record. |
| 3 | Platform opens the Analysis Record Detail View in safe read-only mode. |
| 4 | Creator clicks “Start Design from this Analysis Record.” |
| 5 | System creates or links an Analysis-to-Design Handover. |
| 6 | Design workspace opens with prefilled/read-only Analysis fields. |
| 7 | Creator cannot edit locked Analysis anchors from Design; changes require return to Analysis. |

The addendum requires the underlying Analysis Records to feed the next workflow steps directly; when a course creator begins Design, the platform should allow selection of an approved Analysis Record and should prefill or display key fields such as capacity area, sub-capacity, indicator, validated gap, target learner group, baseline, desired practice, K/S/M/E route, course-fit decision, separable K/S component, safeguards/no-harm note, evaluation anchor, and Analysis-to-Design Handover status.

## 11. Native dashboard implementation notes for Codex

| Implementation area | Guidance |
| --- | --- |
| Data source | Use platform database / SQL records as source of truth. |
| Frontend | Build as native DEC Learning Hub routes/components. |
| Routing | Suggested route: /creator/analysis-dashboard or role-specific equivalent. |
| Record detail | Suggested route: /creator/analysis-dashboard/records/[analysisRecordId]. |
| Design selection | Use approved/locked Analysis Record ID or Analysis-to-Design Handover ID. |
| Charts | Use lightweight native chart components compatible with the existing stack. |
| Filters | Server-side or client-side depending on dataset size; preserve role filters. |
| Authorization | Apply role and assignment checks before returning sensitive records. |
| Safe summaries | Use dashboard_display_label, dashboard_summary, and visibility flags, not raw evidence. |
| Status colors | Use consistent colors for ready, warning, blocked, risk, approved, and archived states. |
| Evidence pack | Codex should verify dashboard metrics against seed/sample Analysis Records. |

### Suggested route structure

| Route | Purpose |
| --- | --- |
| /creator/analysis-dashboard | Executive Overview |
| /creator/analysis-dashboard/capacity-areas | Capacity Area Analysis |
| /creator/analysis-dashboard/ksme | K/S/M/E Diagnosis |
| /creator/analysis-dashboard/course-fit | Course-Fit Pipeline |
| /creator/analysis-dashboard/comparison | Safe CSO/cohort/region comparison |
| /creator/analysis-dashboard/evidence | Evidence Strength and Validation |
| /creator/analysis-dashboard/safeguards | Safeguards and Risk Flags |
| /creator/analysis-dashboard/design-readiness | Records ready or blocked for Design |
| /creator/analysis-dashboard/records/[id] | Analysis Record Detail View |

## 12. Dashboard acceptance criteria

| Acceptance criterion | Must be true |
| --- | --- |
| Native implementation | Dashboard is built inside the DEC Learning Hub platform. |
| No external BI dependency | No Power BI dashboard, Power BI embedding, Power BI bookmarks, workspace setup, or licensing dependency. |
| SQL/platform source of truth | Dashboard reads from structured Analysis Records in the platform database. |
| Required pages included | All nine dashboard pages are implemented or clearly planned. |
| Workflow action supported | Users can navigate from dashboard to approved Analysis Record and Design handover where authorized. |
| K/S/M/E logic visible | Dashboard clearly distinguishes Knowledge, Skill, Motivation, Environment, Mixed, and Unclear. |
| Course-fit logic visible | Dashboard clearly distinguishes course-addressable, partly course-addressable, non-course, further diagnosis, and blocked records. |
| Safe visibility | Sensitive records are restricted, anonymized, aggregated, or hidden according to rules. |
| Role-sensitive | Users see only appropriate records, fields, and actions. |
| Professional UX | Dashboard includes KPI cards, charts, filters, tooltips, navigation, detail views, and clear hierarchy. |
| Evidence discipline | Low-confidence and unvalidated records are not visually treated as ready for action. |
| Design readiness | Dashboard shows exactly which records can unlock Design and why others are blocked. |

## 13. Sample dashboard scenario

### Scenario: MEAL outcome evidence gap

| Dashboard page | What the user sees |
| --- | --- |
| Executive Overview | One Priority A, course-addressable MEAL gap is approved and ready for Design. |
| Capacity Area Analysis | MEAL has 6 validated gaps; outcome evidence writing is the top sub-capacity. |
| K/S/M/E Diagnosis | This record is Knowledge + Skill. |
| Course-Fit Pipeline | Record is course-addressable and has template/tool support recommended. |
| Evidence Strength | Evidence confidence is high: self-assessment, KII, document review, validation workshop. |
| Safeguards | Moderate data safety risk; anonymized examples required. |
| Design Readiness | Record is approved, locked, handover ready. |
| Record Detail | Creator reviews gap, baseline, desired practice, K/S route, safeguards, evaluation anchor. |
| Workflow action | Creator selects “Start Design from this Analysis Record.” |

## 14. Quality Self-Check

| Criterion group | Status | Evidence / note | Revision needed? |
| --- | --- | --- | --- |
| Addendum compliance | Met | Specifies a native in-platform dashboard and explicitly excludes Power BI/external BI dependency. | No |
| Professional design standard | Met | Includes executive homepage, KPI cards, charts, filters, navigation, drill-down behavior, tooltips, detail views, role-sensitive views, and responsive/professional UX principles. | No |
| Required pages | Met | Includes Executive Overview, Capacity Area Analysis, K/S/M/E Diagnosis, Course-Fit Pipeline, CSO/Cohort/Region Comparison, Evidence Strength, Safeguards/Risk Flags, Design Readiness, and Analysis Record Detail View. | No |
| Interactive behavior | Met | Includes clickable cards/charts, filters, drill-down/drill-through style interactions, record detail views, tooltips, workflow actions, and safe summary export. | No |
| Decision usefulness | Met | Each page answers specific user questions and supports real decisions about validation, course-fit, risk, Design readiness, and course pipeline. | No |
| Role-sensitive views | Met | Defines different dashboard experiences and visibility limits for DEC Admin, M&E/capacity leads, course creators, reviewers, safeguards reviewers, and analysis leads. | No |
| Workflow integration | Met | Shows how users select approved Analysis Records and start Design through Analysis-to-Design Handover. | No |
| Data safety | Met | Includes rules for raw evidence exclusion, anonymization, restricted views, specialist-only records, no unsafe ranking, and no donor surveillance. | No |
| DEC-specific grounding | Met | Uses DEC capacity areas, K/S/M/E routing, course-fit discipline, safeguards, Analysis Records, and Course Creator Portal workflow. | No |
| SQL/database readiness | Met | Uses structured Analysis Records and logical database views from Output 6 as the dashboard source. | No |
| Practicality for local CSOs | Met | Supports low-bandwidth-friendly design, safe summaries, cohort-level analysis, and avoids overburdening or exposing CSOs. | No |
| Overall quality judgment | Met | Output is ready to guide native dashboard design, Codex implementation planning, sample data testing, and stakeholder review. | No |


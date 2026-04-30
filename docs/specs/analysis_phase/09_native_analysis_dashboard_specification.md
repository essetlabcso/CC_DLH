# Output 9 — Native Analysis Dashboard Specification

## **1. Purpose of the native Analysis Dashboard**

The **Native Analysis Dashboard** is the in-platform analytical workspace that helps DEC users interpret validated Analysis Records and make course-pipeline decisions. It is not an external reporting layer and must not be specified as Power BI.

The approved architecture is:

**Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.**

The dashboard should support DEC and authorized users to:

- understand validated CSO capacity gaps;

- explore the nine DEC capacity areas;

- filter by K/S/M/E route;

- identify course-addressable Knowledge and Skill gaps;

- distinguish Motivation and Environment barriers;

- review evidence strength and validation status;

- identify records ready for Design;

- inspect safeguards and visibility restrictions;

- select or reference approved Analysis Records for the next workflow steps.

The Native Dashboard Addendum clearly states that the dashboard should be built **inside the DEC Learning Hub platform**, using the structured Analysis Records stored in the platform database, and should not use Power BI as a separate or embedded reporting layer.

## **2. Product identity of the dashboard**

The dashboard should be a **professional analytical web application**, not a simple admin table.

It should combine:

| **Dashboard quality** | **Practical meaning**                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------|
| Executive clarity     | DEC leadership and capacity leads can quickly see validated gaps, priorities, risks, and Design readiness.            |
| Workflow connection   | Dashboard insights lead directly to Analysis Record review, handover, and Design selection.                           |
| Course-fit discipline | The dashboard visually separates course-addressable gaps from Motivation, Environment, and non-course barriers.       |
| Evidence transparency | Users can see whether a gap is strongly evidenced, validated, weak, or still uncertain.                               |
| Safety by default     | Sensitive CSO, civic-space, safeguarding, personal, or organizational vulnerability data is restricted or anonymized. |
| DEC branding          | Visual hierarchy, colors, labels, and UX should feel like a polished DEC Learning Hub product.                        |
| Role-sensitive access | Different users see different views, records, and actions based on role and assignment.                               |

The dashboard should feel similar in quality to a polished Power BI-style analytical experience, but built natively inside the DEC Learning Hub application.

## **3. Primary dashboard users**

| **User group**                      | **Main dashboard use**                                                                                                  |
|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| DEC Admin                           | Oversees all Analysis Records, approvals, locked records, blocked records, user permissions, and dashboard visibility.  |
| DEC Capacity / M&E Lead             | Reviews capacity patterns, K/S/M/E distribution, course pipeline priorities, evidence strength, and monitoring anchors. |
| Analysis Lead / Consortium Lead     | Tracks submitted, returned, validated, and incomplete Analysis Records for assigned CSOs/cohorts.                       |
| Course Creator                      | Finds approved, locked, Design-ready Analysis Records and starts Design from validated evidence.                        |
| Reviewer                            | Checks evidence quality, course-fit logic, safeguards, and readiness for handover.                                      |
| Safeguarding / Civic-Space Reviewer | Reviews high-risk records, visibility restrictions, no-harm notes, and specialist review queues.                        |
| Future Organization Admin           | May view safe organization-level summaries only if enabled and consented.                                               |
| Future Donor / Partner Viewer       | Not part of this phase by default; only possible later through explicit consent-based safe summaries.                   |

## **4. Dashboard page structure**

The native dashboard should include the following core pages.

| **Page**                             | **Main purpose**                                                                                     |
|--------------------------------------|------------------------------------------------------------------------------------------------------|
| 1\. Executive Overview               | High-level status of the full Analysis pipeline.                                                     |
| 2\. Capacity Area Analysis           | Distribution of gaps across the nine DEC capacity areas and sub-capacities.                          |
| 3\. K/S/M/E Diagnosis                | Root-cause patterns and course-fit implications.                                                     |
| 4\. Course-Fit Pipeline              | Shows which gaps can proceed to course design, blended support, or non-course routes.                |
| 5\. CSO / Cohort / Region Comparison | Safe comparison by CSO, cohort, geography, organization type, or learner group where allowed.        |
| 6\. Evidence Strength and Validation | Evidence source quality, confidence, triangulation, and validation status.                           |
| 7\. Safeguards and Risk Flags        | Sensitive records, no-harm issues, civic-space/safeguarding/data risks, and visibility restrictions. |
| 8\. Design Readiness                 | Approved, locked, handover-ready, blocked, returned, and used-in-Design records.                     |
| 9\. Analysis Record Detail View      | Full structured safe view of one Analysis Record and its handover/action status.                     |

The addendum requires these dashboard areas at minimum: Executive Overview, Capacity Area Analysis, K/S/M/E Diagnosis, Course-Fit Pipeline, CSO/Cohort/Region Comparison, Evidence Strength and Validation, Safeguards and Risk Flags, Design Readiness, and Analysis Record Detail View.

# **Page 1 — Executive Overview**

## **Purpose**

Provide a fast, decision-ready overview of the whole Analysis Phase pipeline.

## **KPI cards**

| **KPI**                               | **Meaning**                                                                                                        |
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| Total Analysis Records                | All records in the Analysis system.                                                                                |
| Validated Gaps                        | Records with validated or validated-with-revisions status.                                                         |
| Approved and Locked Records           | Records approved as source-of-truth.                                                                               |
| Ready for Design                      | Records with handover-ready status.                                                                                |
| Course-Addressable Gaps               | Knowledge/Skill records ready or near-ready for course design.                                                     |
| Partly Course-Addressable Gaps        | Mixed or M/E-involved records with separable K/S components.                                                       |
| Non-Course Route Gaps                 | Records routed to mentoring, TA, systems strengthening, leadership, safeguarding, or enabling-environment support. |
| High-Risk / Safeguard-Flagged Records | Records with high sensitivity, civic-space, safeguarding, or data safety concerns.                                 |
| Records Needing More Evidence         | Weak, low-confidence, not validated, or incomplete records.                                                        |

## **Visuals**

| **Visual**               | **Use**                                                                             |
|--------------------------|-------------------------------------------------------------------------------------|
| Analysis pipeline funnel | Draft → Submitted → Validated → Approved → Locked → Handover Ready → Used in Design |
| Capacity area bar chart  | Shows where validated gaps are concentrated.                                        |
| Course-fit donut chart   | Shows course-addressable, partly, non-course, further diagnosis, archived.          |
| K/S/M/E stacked bar      | Shows Knowledge, Skill, Motivation, Environment, Mixed, and Unclear patterns.       |
| Risk alert panel         | Highlights safeguard-flagged and specialist-review records.                         |
| Priority gap table       | Lists Priority A and Priority B records with readiness status.                      |

## **Key interactions**

- Click a KPI card to open the filtered record list.

- Click a capacity area to drill into Capacity Area Analysis.

- Click “Ready for Design” to open Design Readiness.

- Click “High-Risk Records” to open Safeguards and Risk Flags.

- Hover over each metric to show definition and interpretation caution.

# **Page 2 — Capacity Area Analysis**

## **Purpose**

Show how validated gaps are distributed across the nine DEC capacity areas.

## **Required capacity areas**

1.  Internal Governance and Leadership

2.  Transparency and Accountability

3.  Strategic Planning and Organizational Sustainability

4.  Financial Management and Resource Mobilization

5.  Human Resources, Inclusion, and Safeguarding

6.  Evidence-Based Advocacy and Civic Engagement

7.  Monitoring, Evaluation, Accountability, and Learning

8.  Digital Skills and Data Use / IT Competencies

9.  Networking, Partnerships, and Collective Action

Annex 4 states that the taxonomy should function as a controlled workflow backbone across Analysis, Design, Build, Review, Publish, learner-facing metadata, certificates, practical proof, verified achievements, and monitoring dashboards.

## **Visuals**

| **Visual**                            | **Use**                                                                |
|---------------------------------------|------------------------------------------------------------------------|
| Horizontal bar chart                  | Validated gaps by capacity area.                                       |
| Sub-capacity ranked list              | Shows the most repeated practical capacity gaps.                       |
| Heatmap: capacity area × course-fit   | Shows where courses are viable and where non-course support is needed. |
| Capacity area × K/S/M/E stacked chart | Shows root-cause patterns by capacity domain.                          |
| Indicator/standard coverage table     | Shows which gaps are linked to standards or indicators.                |

## **Filters**

- capacity area;

- sub-capacity;

- indicator/standard;

- priority level;

- course-fit decision;

- K/S/M/E route;

- validation status;

- evidence confidence;

- cohort/geography/CSO where safe.

# **Page 3 — K/S/M/E Diagnosis**

## **Purpose**

Show why gaps are happening and prevent inappropriate course creation.

## **Core logic**

Knowledge and Skill gaps can normally proceed to course design. Motivation and Environment gaps should not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly recorded. Mixed gaps may proceed only for the clearly defined Knowledge/Skill component.

## **Visuals**

| **Visual**                          | **Use**                                                   |
|-------------------------------------|-----------------------------------------------------------|
| K/S/M/E distribution chart          | Shows overall root-cause pattern.                         |
| Route × course-fit matrix           | Checks whether course-fit decisions align with diagnosis. |
| Mixed-gap table                     | Shows separable K/S component and non-course components.  |
| Motivation/Environment blocked list | Shows gaps correctly blocked from Design.                 |
| Unclear diagnosis alert list        | Shows records needing further diagnosis.                  |
| K/S/M/E by capacity area            | Shows root-cause patterns across capacity domains.        |

## **Warning rules**

| **Condition**                         | **Dashboard warning**                                                                                      |
|---------------------------------------|------------------------------------------------------------------------------------------------------------|
| Motivation-only + course-addressable  | “Check routing: Motivation-only gaps should not unlock Design without a separable K/S component.”          |
| Environment-only + course-addressable | “Check routing: Environment-only gaps require non-course support unless a separable K/S component exists.” |
| Mixed + no separable K/S component    | “Mixed gap cannot proceed to Design until the course-addressable component is explicit.”                   |
| Unclear route                         | “Further diagnosis required before course design.”                                                         |

# **Page 4 — Course-Fit Pipeline**

## **Purpose**

Show which validated gaps should become courses, blended interventions, non-course support, or further diagnosis.

## **Course-fit categories**

| **Category**              | **Meaning**                                                                                           |
|---------------------------|-------------------------------------------------------------------------------------------------------|
| Course-addressable        | Mainly Knowledge or Skill; suitable for course design.                                                |
| Partly course-addressable | Has a separable K/S component but also Motivation/Environment barriers.                               |
| Non-course route          | Mainly Motivation, Environment, systems, leadership, resource, safety, or enabling-environment issue. |
| Needs further diagnosis   | Evidence or root cause is unclear.                                                                    |
| Not suitable / archived   | Not appropriate for Phase 1 course workflow.                                                          |

## **Visuals**

| **Visual**                      | **Use**                                                                                                                                |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Course-fit funnel               | Shows movement from validated gap to Design-ready record.                                                                              |
| Intervention route bar chart    | Shows course, mentoring, coaching, TA, systems strengthening, leadership engagement, safeguarding review, enabling-environment action. |
| Partly course-addressable table | Shows K/S component plus required complementary support.                                                                               |
| Blocked records table           | Shows why a record cannot proceed.                                                                                                     |
| Priority course pipeline table  | Shows approved/near-ready course candidates.                                                                                           |

# **Page 5 — CSO / Cohort / Region Comparison**

## **Purpose**

Support safe comparison by CSO, cohort, geography, organization type, target learner group, or program context.

## **Safety rule**

This page must not become a ranking, shaming, donor surveillance, or deficit-comparison tool. Sensitive organization-level findings should be restricted, anonymized, aggregated, or hidden.

Annex 12 states that organization-level summaries should not become rankings or surveillance tools and that dashboards should avoid exposing personal or sensitive details.

## **Visuals**

| **Visual**                        | **Use**                                                      |
|-----------------------------------|--------------------------------------------------------------|
| Cohort comparison cards           | Shows validated gaps by cohort/program.                      |
| Target learner group distribution | Shows affected roles.                                        |
| Safe regional comparison          | Shows broad geography only where safe.                       |
| Multi-CSO gap cluster view        | Identifies common course pipeline opportunities.             |
| Restricted comparison notice      | Shows how many records are hidden or anonymized due to risk. |

## **Role-sensitive behavior**

| **Role**                          | **View**                                                                  |
|-----------------------------------|---------------------------------------------------------------------------|
| DEC Admin                         | Full internal view, subject to safety restrictions.                       |
| DEC Capacity/M&E Lead             | Cohort and capacity summaries; organization detail only where authorized. |
| Course Creator                    | Only approved, Design-ready, safe records.                                |
| Reviewer                          | Assigned records and relevant summaries.                                  |
| Safeguarding/Civic-Space Reviewer | Risk-related records only.                                                |
| Organization Admin, future        | Own organization safe summary only.                                       |
| Donor/Partner Viewer              | Not enabled in Phase 1 by default.                                        |

# **Page 6 — Evidence Strength and Validation**

## **Purpose**

Show whether Analysis Records are credible enough to guide Design and dashboard interpretation.

## **Visuals**

| **Visual**                    | **Use**                                                                                             |
|-------------------------------|-----------------------------------------------------------------------------------------------------|
| Evidence confidence KPI cards | High, medium, low, not confirmed, unsafe to confirm fully.                                          |
| Triangulation status chart    | Confirmed, partly confirmed, reframed, contradicted, not confirmed, unsafe to verify.               |
| Validation status chart       | Validated, validated with revisions, needs evidence, not validated, specialist validation required. |
| Evidence source type chart    | Self-assessment, KII, FGD, document review, validation workshop, donor feedback, work sample.       |
| Weak evidence alert list      | Shows records blocked by low confidence or missing validation.                                      |
| Evidence limitations table    | Shows records with unresolved gaps or contradictions.                                               |

## **Evidence rule**

Low-confidence, unvalidated, contradicted, or unclear records should not appear as Design-ready. They may appear in dashboard views only as records needing more evidence, further diagnosis, or review.

# **Page 7 — Safeguards and Risk Flags**

## **Purpose**

Show records that require safety controls before Design, dashboard display, AI use, or practical proof planning.

## **Visuals**

| **Visual**                    | **Use**                                                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| Risk flag cards               | Safeguarding, civic-space, political sensitivity, personal data, organizational vulnerability, AI restriction, proof safety. |
| Sensitivity level chart       | Low, moderate, high, do not proceed.                                                                                         |
| Specialist review queue       | Pending, cleared, returned, blocked.                                                                                         |
| Visibility restriction table  | Standard, restricted, anonymized, aggregated only, do not display.                                                           |
| Risk by capacity area heatmap | Shows where sensitive records cluster.                                                                                       |
| Safeguards detail drawer      | Shows no-harm note, AI restriction, proof safety note, and visibility restriction.                                           |

## **Safety behaviors**

- High-risk records should not open in full detail unless the user has permission.

- CSO names should be masked when anonymization is required.

- Dashboard should show safe summaries, not raw field notes.

- Specialist reviewers should be able to clear, return, restrict, or block records.

- AI-restricted records should not be passed into AI context packages.

# **Page 8 — Design Readiness**

## **Purpose**

Identify which records can unlock Design and why other records are blocked.

## **Visuals**

| **Visual**                 | **Use**                                                                              |
|----------------------------|--------------------------------------------------------------------------------------|
| Design readiness KPI cards | Ready, ready with conditions, blocked, specialist review required, used in Design.   |
| Handover funnel            | Approved → Locked → Handover Ready → Handover Created → Used in Design.              |
| Ready-for-Design table     | Records course creators can select.                                                  |
| Blocked records table      | Shows blocking reason: evidence, K/S/M/E, course-fit, safeguards, approval, or lock. |
| Returned records list      | Shows records returned to Analysis from Design or Review.                            |
| Handover action panel      | For authorized users to create or lock handovers.                                    |

## **Gate logic**

| **Record condition**                                                   | **Dashboard status**                |
|------------------------------------------------------------------------|-------------------------------------|
| Knowledge/Skill + validated + approved + locked + safeguards cleared   | Ready for Design                    |
| Mixed + separable K/S + complementary support note + approved + locked | Ready with conditions               |
| Motivation/Environment without separable K/S                           | Blocked                             |
| Unclear K/S/M/E                                                        | Needs further diagnosis             |
| High risk pending specialist review                                    | Specialist review required          |
| Low confidence or not validated                                        | Not ready                           |
| Approved but not locked                                                | Approval complete; locking required |

# **Page 9 — Analysis Record Detail View**

## **Purpose**

Provide a structured, safe, role-sensitive view of one Analysis Record.

## **Sections shown**

| **Section**        | **Fields**                                                                               |
|--------------------|------------------------------------------------------------------------------------------|
| Record summary     | title, code, status, capacity area, priority, readiness                                  |
| Gap definition     | validated gap, baseline, desired practice, practical consequence                         |
| Evidence           | source summary, triangulation, validation, confidence, limitations                       |
| K/S/M/E diagnosis  | route, components, separable K/S component, non-course component                         |
| Course-fit         | decision, rationale, intervention route, complementary support                           |
| Safeguards         | risk flags, sensitivity, no-harm note, AI restriction, visibility restriction            |
| Evaluation anchor  | final test focus, practical proof possibility, monitoring signal, limitation note        |
| Handover readiness | approval, lock, handover status, Design reuse allowed                                    |
| Audit trail        | created, updated, reviewed, approved, locked, returned, version history                  |
| Actions            | role-based actions such as approve, return, lock, create handover, start Design, archive |

## **Key actions**

| **Action**                | **Who can use it**                                                        |
|---------------------------|---------------------------------------------------------------------------|
| View safe summary         | Most authorized dashboard users                                           |
| View full internal record | DEC Admin, authorized DEC Capacity/M&E Lead, assigned reviewer            |
| Request more evidence     | Reviewer, DEC Capacity/M&E Lead, DEC Admin                                |
| Request specialist review | Reviewer, DEC Capacity/M&E Lead, DEC Admin                                |
| Approve record            | DEC Admin or authorized reviewer/lead                                     |
| Lock record               | DEC Admin or authorized capacity lead                                     |
| Create handover           | DEC Admin or authorized capacity lead                                     |
| Start Design              | Course Creator or admin, only when record is approved/locked/Design-ready |
| Return to Analysis        | Reviewer, DEC Capacity/M&E Lead, DEC Admin                                |
| Archive                   | DEC Admin                                                                 |

## **5. Global dashboard filters**

The dashboard should include a persistent filter bar.

| **Filter**           | **Purpose**                                                                               |
|----------------------|-------------------------------------------------------------------------------------------|
| Program/cohort       | View records by DEC program or cohort.                                                    |
| Capacity area        | Filter by nine DEC areas.                                                                 |
| Sub-capacity         | Narrow to specific function or practice.                                                  |
| K/S/M/E route        | Filter by Knowledge, Skill, Motivation, Environment, Mixed, Unclear.                      |
| Course-fit decision  | Filter by course-addressable, partly, non-course, further diagnosis, archived.            |
| Design readiness     | Filter ready, blocked, specialist review, used in Design.                                 |
| Evidence confidence  | Filter high, medium, low, not confirmed.                                                  |
| Validation status    | Filter validated, revised, needs evidence, not validated.                                 |
| Priority             | Priority A, B, C, non-course, not ready, archived.                                        |
| Risk/sensitivity     | Low, moderate, high, do not proceed.                                                      |
| Intervention route   | Course, mentoring, coaching, TA, systems, leadership, safeguarding, enabling environment. |
| Geography            | Only where safe.                                                                          |
| Organization/CSO     | Only where user is authorized and visibility permits.                                     |
| Target learner group | Filter by role group.                                                                     |
| Date range           | Analysis, validation, approval, lock dates.                                               |
| Status               | Draft, submitted, approved, locked, handover ready, used in Design, blocked, archived.    |

## **6. Core dashboard calculations**

| **Metric**                             | **Calculation logic**                                                                    |
|----------------------------------------|------------------------------------------------------------------------------------------|
| Validation rate                        | Validated records ÷ submitted records                                                    |
| Approval rate                          | Approved or locked records ÷ validated records                                           |
| Design readiness rate                  | Handover-ready records ÷ approved records                                                |
| Course-addressable rate                | Course-addressable records ÷ validated records                                           |
| Partly course-addressable rate         | Partly course-addressable records ÷ validated records                                    |
| Non-course route rate                  | Non-course route records ÷ validated records                                             |
| Mixed separable K/S count              | Mixed records where separable K/S component exists                                       |
| Blocked by K/S/M/E count               | Motivation/Environment/Unclear records without allowed course-fit                        |
| Safeguards pending count               | Specialist review required and not cleared                                               |
| High-risk visibility restriction count | High-risk records with restricted, anonymized, aggregated-only, or do-not-display status |
| Priority A pipeline count              | Priority A records that are course-addressable or partly course-addressable              |
| Handover conversion rate               | Records used in Design ÷ handover-ready records                                          |

## **7. Interactive behavior**

| **Interaction**        | **Required behavior**                                                           |
|------------------------|---------------------------------------------------------------------------------|
| Click KPI card         | Opens filtered record list.                                                     |
| Click chart segment    | Applies filter or opens relevant dashboard page.                                |
| Hover tooltip          | Shows plain-language metric definition and caution.                             |
| Drill-down interaction | Moves from overview to capacity, K/S/M/E, course-fit, or record detail.         |
| Record row click       | Opens Analysis Record Detail View, subject to permission.                       |
| View safe summary      | Shows restricted-safe record summary.                                           |
| Create handover        | Available only to authorized users and only when readiness conditions are met.  |
| Start Design           | Available only to authorized creator/admin for approved, locked, ready records. |
| Return for revision    | Requires comment and creates workflow event.                                    |
| Export safe summary    | Exports safe internal summary only, not raw evidence.                           |

## **8. Data safety behavior**

| **Data type**                   | **Dashboard behavior**                                                |
|---------------------------------|-----------------------------------------------------------------------|
| Raw field notes                 | Never displayed.                                                      |
| Interview/FGD quotes            | Display only if anonymized, approved, and safe; default summary only. |
| CSO names                       | Display only if visibility permits and user is authorized.            |
| Safeguarding/protection details | Specialist-only safe summaries; no raw details.                       |
| Civic-space sensitive data      | Restricted, anonymized, or aggregated.                                |
| Personal/beneficiary data       | Do not display.                                                       |
| Organizational vulnerabilities  | Avoid ranking and shaming; show role-sensitive summaries only.        |
| Donor-facing information        | Not enabled in this phase.                                            |
| AI-sensitive content            | Not exposed to AI unless safe approved context exists.                |

## **9. Design selection workflow from dashboard**

| **Step** | **System behavior**                                                                       |
|----------|-------------------------------------------------------------------------------------------|
| 1        | Course creator opens Design Readiness page or filtered ready-record list.                 |
| 2        | Creator selects an approved, locked, Design-ready Analysis Record.                        |
| 3        | Platform opens safe read-only Analysis Record Detail View.                                |
| 4        | Creator clicks “Start Design from this Analysis Record.”                                  |
| 5        | System links or creates the Analysis-to-Design Handover.                                  |
| 6        | Design workspace opens with prefilled/read-only Analysis fields.                          |
| 7        | Creator cannot edit locked Analysis anchors; any major issue requires return to Analysis. |

The addendum requires approved Analysis Records to feed the next workflow steps directly, allowing course creators to select a record and prefill/display key fields such as capacity area, sub-capacity, indicator, validated gap, target learner group, baseline, desired practice, K/S/M/E route, course-fit decision, separable K/S component, safeguards/no-harm note, evaluation anchor, and handover status.

## **10. Suggested route structure**

| **Route**                                    | **Purpose**                      |
|----------------------------------------------|----------------------------------|
| /creator/analysis-dashboard                  | Executive Overview               |
| /creator/analysis-dashboard/capacity-areas   | Capacity Area Analysis           |
| /creator/analysis-dashboard/ksme             | K/S/M/E Diagnosis                |
| /creator/analysis-dashboard/course-fit       | Course-Fit Pipeline              |
| /creator/analysis-dashboard/comparison       | CSO / Cohort / Region Comparison |
| /creator/analysis-dashboard/evidence         | Evidence Strength and Validation |
| /creator/analysis-dashboard/safeguards       | Safeguards and Risk Flags        |
| /creator/analysis-dashboard/design-readiness | Design Readiness                 |
| /creator/analysis-dashboard/records/\[id\]   | Analysis Record Detail View      |

Codex can adapt route names to the existing repo conventions, but the functional areas and role-sensitive behavior should remain intact.

## **11. Minimum Phase 1 implementation**

If implementation must be phased, the minimum viable dashboard should include:

| **Minimum feature**    | **Required behavior**                                                            |
|------------------------|----------------------------------------------------------------------------------|
| Executive KPI cards    | Total records, validated, approved/locked, ready for Design, blocked, high-risk. |
| Capacity area chart    | Gaps across nine DEC capacity areas.                                             |
| K/S/M/E chart          | Root-cause distribution.                                                         |
| Course-fit chart       | Course-addressable, partly, non-course, further diagnosis, archived.             |
| Evidence status chart  | Confidence and validation status.                                                |
| Safeguards queue       | High-risk and specialist-review records.                                         |
| Design readiness table | Approved/locked/ready records with action links.                                 |
| Record detail view     | Safe, structured, role-sensitive detail.                                         |
| Filters                | Capacity area, K/S/M/E, course-fit, status, evidence confidence, risk.           |
| Design action          | Start Design from an approved, locked, ready record.                             |

## **12. Acceptance criteria**

| **Criterion**          | **Acceptance standard**                                                                                         |
|------------------------|-----------------------------------------------------------------------------------------------------------------|
| Native implementation  | Dashboard is built inside the DEC Learning Hub platform.                                                        |
| No Power BI dependency | No external BI, no Power BI embed, no Power BI-specific language.                                               |
| Source of truth        | Dashboard uses the platform SQL/database Analysis Records.                                                      |
| Required pages         | All core dashboard pages are specified and implementable.                                                       |
| Workflow connection    | Dashboard supports record detail, handover readiness, and Start Design action.                                  |
| K/S/M/E visibility     | Dashboard clearly distinguishes Knowledge, Skill, Motivation, Environment, Mixed, and Unclear.                  |
| Course-fit visibility  | Dashboard clearly distinguishes course-addressable, partly, non-course, further diagnosis, and blocked records. |
| Evidence discipline    | Weak/unvalidated records are clearly marked and cannot appear as ready for Design.                              |
| Safeguards             | Sensitive records are restricted, anonymized, aggregated, or hidden.                                            |
| Role-sensitive access  | Users only see records, fields, and actions appropriate to their role.                                          |
| Professional UX        | KPI cards, charts, filters, detail views, tooltips, and hierarchy are included.                                 |
| Design reuse           | Approved and locked records can be selected for Design and passed as read-only context.                         |

## **13. Quality Self-Check**

| **Criterion group**              | **Status** | **Evidence / note**                                                                                                                                   | **Revision needed?** |
|----------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| Native dashboard decision        | Met        | Specifies native in-platform dashboard only and excludes Power BI/external BI dependency.                                                             | No                   |
| Required dashboard pages         | Met        | Includes Executive Overview, Capacity Area Analysis, K/S/M/E, Course-Fit, Comparison, Evidence, Safeguards, Design Readiness, and Record Detail View. | No                   |
| Professional analytical standard | Met        | Includes KPI cards, charts, filters, tooltips, record detail, drill-down behavior, route structure, and responsive product logic.                     | No                   |
| Workflow integration             | Met        | Connects dashboard to approved Analysis Records, handover readiness, and Start Design action.                                                         | No                   |
| K/S/M/E discipline               | Met        | Makes K/S/M/E routing visible and includes warning logic for Motivation, Environment, Mixed, and Unclear records.                                     | No                   |
| Course-fit discipline            | Met        | Distinguishes course-addressable, partly course-addressable, non-course, further diagnosis, and archived records.                                     | No                   |
| Evidence quality                 | Met        | Includes evidence confidence, validation, triangulation, weak evidence alerts, and blocked readiness behavior.                                        | No                   |
| Safeguards and visibility        | Met        | Includes risk flags, sensitivity levels, role restrictions, anonymization, aggregation, and no raw data display.                                      | No                   |
| Role sensitivity                 | Met        | Defines role-sensitive views and actions across admin, capacity/M&E lead, analysis lead, creator, reviewer, and safeguards reviewer.                  | No                   |
| DEC-specific grounding           | Met        | Uses DEC capacity areas, Analysis Records, K/S/M/E routing, course-fit, safeguards, Design handover, and Course Creator Portal workflow.              | No                   |
| Implementation readiness         | Met        | Includes suggested routes, minimum Phase 1 scope, calculations, interactions, and acceptance criteria.                                                | No                   |

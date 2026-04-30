---
title: "Analysis Phase Synthesis"
project: "DEC Learning Hub Course Creator Portal"
package_section: "Output 1"
status: "repo-ready specification"
source_docx: "Output 1 — Synthesis of Analysis Phase.docx"
last_updated: "2026-04-29"
---

<!--
Governing note for Codex/GPT-5.5:
This file is part of the DEC Learning Hub Analysis Phase operating package.
Where earlier materials mention Power BI, treat the Native Dashboard Addendum as the override:
the Analysis Dashboard must be implemented natively inside the DEC Learning Hub platform.
-->

# Analysis Phase Synthesis

## 1. What the Analysis Phase is

The Analysis Phase is the evidence foundation of the DEC Learning Hub Course Creator Portal. Its purpose is to ensure that every course begins from a validated CSO capacity gap, not from a generic training idea, an assumed topic, or a blank course page.

In practical terms, the Analysis Phase helps DEC, consortium leads, consultants, and assigned analysis experts answer:

- What specific CSO capacity gap exists?
- Which of the nine DEC CSO capacity areas does it belong to?
- What is the current practice or baseline?
- What is the desired practice?
- What evidence confirms the gap?
- Why is the gap happening?
- Is the root cause Knowledge, Skill, Motivation, Environment, or Mixed?
- Is the gap suitable for a digital course?
- What complementary support is needed if a course alone is not enough?
- What safeguards, no-harm, civic-space, or data-safety issues must be considered?
- What evidence should later support monitoring, learning, and course improvement?
The uploaded refined prompt defines this clearly: the Analysis Phase must help DEC and assigned analysis actors “identify, validate, structure, and prioritize CSO capacity gaps before any course is designed,” so that course creation starts from validated capacity evidence rather than from a blank page.

## 2. Why the Analysis Phase matters

The Analysis Phase protects the DEC Learning Hub from becoming a generic LMS or a course factory. Many CSO challenges are not training problems. Some are caused by lack of knowledge, some by lack of practical skill, and others by motivation, leadership culture, systems, resources, policies, safety risks, donor conditions, or enabling-environment constraints.

This distinction is central to DEC’s K/S/M/E logic. Knowledge and Skill gaps can normally proceed into Phase 1 course design. Motivation and Environment gaps should not drive course production unless a clear separable Knowledge or Skill component is recorded.

This matters because a course on “MEAL reporting,” for example, may be useful if staff do not understand outcome evidence or cannot complete an evidence worksheet. But it will not solve the problem if staff already know what to do but have no time, no reporting template, no management review process, no functioning devices, or no safe space to use evidence honestly.

The Analysis Phase therefore acts as a course-fit gate. It asks: “Is learning the right intervention, or is this gap better addressed through mentoring, coaching, technical assistance, leadership engagement, systems strengthening, safeguarding review, resource support, or enabling-environment action?”

## 3. The core operating model: hybrid, not over-digitized

The Analysis Phase should use a hybrid model with two connected layers.

### Layer 1: Field and consultation tools

Field-level evidence may be gathered outside the platform through practical, modular tools such as:

- CSO self-assessment
- key informant interviews
- focus group discussions
- document review
- stakeholder validation workshops
- prioritization matrices
- triangulation templates
- K/S/M/E diagnosis worksheets
- course-fit decision tools
- safeguards and no-harm review tools
These tools may be used as Word documents, PDFs, Excel sheets, printable workshop templates, Kobo/Google Forms, or existing CSO tools. The important point is that not every CSO must use every tool. The toolkit should function as a menu, selected based on context, available evidence, time, CSO readiness, risk level, and assessment purpose. The refined prompt explicitly requires this modular approach and allows CSOs or facilitators to use their own existing tools if the findings can be mapped into the final structured Analysis Record.

### Layer 2: Final Analysis Data Entry Web Form

After fieldwork, synthesis, triangulation, and validation, the final findings should be entered into one structured Analysis Data Entry Web Form. This form should not collect every raw interview note, FGD transcript, or workshop comment. It should capture only the validated and synthesized findings that are ready to become platform records.

The final Analysis Record becomes the main digital bridge between field diagnosis and the Course Creator Portal. It must be comprehensive, standardized, SQL-ready, dashboard-ready, and workflow-ready.

## 4. End-to-end workflow: from field evidence to Design handover

The Analysis Phase should follow this practical sequence:

| Step | What happens | Main output |
| --- | --- | --- |
| 1. Define assessment purpose | DEC or consortium leads clarify which CSO group, cohort, capacity area, or learning need is being explored. | Assessment scope note |
| 2. Select field tools | The analysis team selects only the tools needed for the context. | Tool selection plan |
| 3. Gather evidence | Evidence is collected through self-assessment, interviews, FGDs, document review, consultations, or existing CSO evidence. | Raw field evidence |
| 4. Organize findings | Evidence is grouped by capacity area, sub-capacity, learner group, baseline, desired practice, and observed gap. | Initial synthesis table |
| 5. Triangulate | Evidence from different sources is compared to identify repeated patterns, contradictions, and confidence level. | Triangulation matrix |
| 6. Validate | Findings are checked with relevant CSO actors, DEC staff, consortium leads, or technical reviewers. | Validated gap summary |
| 7. Diagnose root cause | Each gap is classified as Knowledge, Skill, Motivation, Environment, or Mixed. | K/S/M/E diagnosis |
| 8. Decide course-fit | The team decides whether the gap is course-addressable, partly course-addressable, or not suitable for Phase 1 course production. | Course-fit decision |
| 9. Identify complementary support | Motivation, Environment, or Mixed gaps are routed to mentoring, coaching, leadership support, systems strengthening, TA, safeguarding review, or enabling-environment action as needed. | Intervention route |
| 10. Review safeguards | Civic-space, data safety, safeguarding, privacy, and do-no-harm issues are checked. | Safeguards/no-harm note |
| 11. Set evaluation anchor | Baseline, desired practice, and future evidence of progress are recorded. | Evaluation anchor |
| 12. Enter final record | Only the validated synthesis is entered into the Analysis Data Entry Web Form. | Final Analysis Record |
| 13. Use native dashboard | DEC users explore patterns through the native in-platform Analysis Dashboard. | Dashboard views and decisions |
| 14. Approve and lock | Approved records are locked and become the official starting point for Design. | Analysis-to-Design Handover |

The corrected architecture is therefore:

Field tools → triangulation and validation → final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and course creation.

The Native Dashboard Addendum explicitly supersedes the earlier dashboard approach and requires the Analysis Dashboard to be built inside the DEC Learning Hub platform, using the SQL/platform database as the source of truth.

## 5. Who is involved

The Analysis Phase has three main user groups.

### A. Analysis data-entry users

These are authorized DEC staff, consortium leads, consultants, technical experts, or assigned analysis leads. They do not enter raw field notes into the platform. Their responsibility is to enter the final validated and synthesized Analysis Record after evidence has been reviewed.

### B. Dashboard users

These include DEC admins, course creators, reviewers, M&E/capacity leads, and other authorized users. They use the native Analysis Dashboard to explore validated gaps, filter by capacity area, understand K/S/M/E patterns, assess evidence strength, identify Design-ready records, and make course pipeline decisions.

The addendum explains that the native dashboard is not only a reporting tool; it is part of the Course Creator Portal workflow because users need it to understand validated gaps, explore the nine capacity areas, filter by K/S/M/E diagnosis, identify course-addressable gaps, and select or reference approved Analysis Records for next workflow steps.

### C. Course creation workflow users

These are course creators, reviewers, and admins who use approved Analysis Records in the Course Creator Portal. When they begin Design, they should select an approved Analysis Record. Key fields should prefill or appear as read-only anchors, including capacity area, sub-capacity, indicator, validated gap, target learner group, baseline, desired practice, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor.

## 6. How the Analysis Phase prevents generic training

The Analysis Phase prevents generic training through five controls.

First, it requires a validated capacity gap before Design begins. A creator should not start with a broad topic such as “fundraising,” “governance,” or “MEAL.” They should start with a specific gap such as: “Project officers cannot turn activity data into simple outcome evidence statements for donor updates.”

Second, it requires a baseline and desired practice. This prevents vague course goals. The platform must know what CSOs currently do and what they need to do better.

Third, it applies K/S/M/E diagnosis. This prevents the platform from treating every problem as a training problem.

Fourth, it requires a course-fit decision. Some gaps proceed to course design; others are routed to blended or non-course support.

Fifth, it locks approved Analysis fields into the Analysis-to-Design Handover. This prevents later drift, where a course gradually becomes broader, more theoretical, or disconnected from the original evidence.

The implementation description confirms that the Analysis Gate should capture validated capacity gap, baseline, desired practice, root cause, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor; allow Knowledge and Skill routes to proceed; block Motivation and Environment routes unless a separable K/S component is recorded; and show the locked Analysis summary as read-only in Design.

## 7. Core decision points in the Analysis Phase

The Analysis Phase should include the following decision points:

| Decision point | Key question | Possible decision |
| --- | --- | --- |
| Capacity area classification | Which of the nine DEC capacity areas does the gap belong to? | Select capacity area and sub-capacity |
| Evidence sufficiency | Is there enough evidence to confirm the gap? | Validated / needs more evidence / not confirmed |
| Baseline clarity | Is the current practice clearly described? | Accept / revise / collect more data |
| Desired practice clarity | Is the expected improved practice specific enough? | Accept / revise |
| K/S/M/E diagnosis | Why is the gap happening? | Knowledge / Skill / Motivation / Environment / Mixed / unclear |
| Course-fit decision | Can a course realistically address this gap? | Course-addressable / partly course-addressable / not course-addressable |
| Mixed-gap decision | Is there a separable Knowledge or Skill component? | Proceed only for K/S component / route non-course components elsewhere |
| Safeguards review | Could evidence collection, dashboard display, or course design create risk? | Safe / safe with controls / specialist review required / do not proceed |
| Evaluation anchor | What evidence could later show improvement? | Baseline and future evidence anchor recorded |
| Approval and locking | Is the Analysis Record ready for Design? | Approved and locked / revise / blocked |

## 8. Relationship to the nine DEC CSO capacity areas

The Analysis Phase should classify each validated gap under the DEC CSO capacity taxonomy:

- Internal Governance and Leadership
- Transparency and Accountability
- Strategic Planning and Organizational Sustainability
- Financial Management and Resource Mobilization
- Human Resources, Inclusion, and Safeguarding
- Evidence-Based Advocacy and Civic Engagement
- Monitoring, Evaluation, Accountability, and Learning
- Digital Skills and Data Use / IT Competencies
- Networking, Partnerships, and Collective Action
These areas are not just tags. They are the backbone for the Analysis Record, dashboard filters, course pipeline planning, Design handover, learner course metadata, monitoring aggregation, and later capacity evidence.

For example, a gap in “community feedback handling” may connect to Transparency and Accountability, MEAL, and possibly Safeguarding. The Analysis Phase should identify the primary capacity area while allowing secondary links where relevant.

## 9. Relationship to the native Analysis Dashboard

The native Analysis Dashboard should help DEC and course creation users move from evidence to decision. It should not be a separate reporting layer, a static table, or an external BI embed. It should be a professional in-platform analytical workspace that supports:

- executive overview of validated gaps
- capacity area distribution
- K/S/M/E diagnosis patterns
- course-fit pipeline
- priority gaps
- evidence strength and validation status
- safeguards and risk flags
- Design readiness
- Analysis Record detail views
- role-sensitive views
- safe aggregation by CSO, cohort, region, organization type, or learner group where appropriate
The dashboard should support action, not just reporting. A course creator should be able to identify approved Analysis Records ready for Design. A reviewer should see evidence strength and safeguards. A DEC capacity/M&E lead should see patterns across capacity areas and cohorts. An admin should see records blocked from Design or needing further diagnosis.

The addendum requires the native dashboard to meet a professional standard: KPI cards, charts, filters, navigation buttons, secondary analytical pages, drill-down interactions, tooltips, record-detail views, DEC branding, role-sensitive views, and responsive layout.

## 10. Relationship to Design, Build, Review, Publish, and Monitoring

The Analysis Phase does not end when data is entered. It creates the official evidence base for the rest of the DEC Learning Hub workflow.

| Later workflow phase | How Analysis supports it |
| --- | --- |
| Design | Approved Analysis Record preloads capacity gap, baseline, desired practice, learner group, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor. |
| Build | AI authoring and block creation should remain grounded in the approved Analysis and Design records, not invented content. |
| Review | Reviewers check whether the course remains aligned with the original Analysis evidence and course-fit decision. |
| Publish | Publication should only happen after the course has remained traceable to approved evidence and passed review. |
| Learner Runtime | Learner activity and final test results can be interpreted against the course’s original capacity gap and target learner group. |
| Certificate | A certificate confirms course pass at 80%+ final test score, but does not prove full organizational transformation. |
| Practical Proof / Verified Achievement | Where enabled, proof can show applied evidence linked back to the original capacity area and practical gap. |
| Monitoring and Evaluation | Dashboards connect learner progress, test results, certificates, feedback, proof, verified achievements, and improvement signals back to the original Analysis baseline and evaluation anchor. |

This is consistent with the wider DEC workflow logic, where the full journey should preserve traceability from CSO capacity evidence through course design, build, learner completion, certificate, optional verified achievement, and monitoring evidence.

## 11. Practical success standard for the Analysis Phase

The Analysis Phase is successful when DEC can say:

A validated capacity gap has been identified, mapped to a DEC capacity area, supported by triangulated evidence, diagnosed through K/S/M/E logic, checked for course-fit, reviewed for safeguards, connected to a baseline and desired practice, entered into a structured platform record, visible in the native Analysis Dashboard, and locked into an Analysis-to-Design Handover that course creators can use without starting from a blank page.

It is not successful if:

- every CSO problem is turned into a course;
- raw field notes are dumped into the platform without synthesis;
- Motivation or Environment barriers are disguised as training topics;
- course creators can bypass validated evidence;
- dashboards show attractive visuals but cannot support course decisions;
- sensitive CSO or civic-space data is exposed;
- Analysis Records are not reusable in Design;
- monitoring later cannot explain which capacity gap a course was meant to address.

## 12. Quality Self-Check

| Acceptance criterion | Status | Self-check |
| --- | --- | --- |
| Purpose clarity | Met | Defines the Analysis Phase as the evidence foundation for DEC course creation. |
| End-to-end flow | Met | Provides full flow from field evidence to triangulation, validation, final data entry, native dashboard, and Analysis-to-Design Handover. |
| Anti-generic training logic | Met | Explains how K/S/M/E routing, course-fit decisions, and locked records prevent blank-page and generic course creation. |
| User roles | Met | Distinguishes analysis data-entry users, dashboard users, and course creation workflow users. |
| Decision points | Met | Includes capacity classification, evidence sufficiency, K/S/M/E diagnosis, course-fit, safeguards, validation, approval, locking, and Design readiness. |
| Monitoring connection | Met | Shows how baseline, desired practice, evaluation anchor, certificates, practical proof, verified achievements, and monitoring connect back to Analysis. |
| Native dashboard compliance | Met | Follows the addendum: dashboard is specified as native inside the DEC Learning Hub, not as Power BI. |
| Practicality for local CSOs | Met | Preserves modular offline/field tools, low-resource flexibility, and avoids forcing all CSOs to use every tool. |
| Safeguards and no-harm | Met | Includes civic-space, safeguarding, privacy, data minimization, and safe dashboard display considerations. |
| Implementation readiness | Met | Provides clear workflow logic suitable for later conversion into form, schema, dashboard, and Codex implementation tasks. |

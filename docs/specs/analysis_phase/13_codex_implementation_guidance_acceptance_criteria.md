# Output 13 — Codex Implementation Guidance and Acceptance Criteria

## 1. Purpose of this output

This output converts the Analysis Phase operating package into Codex-ready implementation guidance. It tells Codex/GPT-5.5 how to implement the Analysis Phase inside the DEC Learning Hub without drifting from the approved product logic.

The implementation must preserve the corrected architecture:

Field tools → triangulation and validation → Final Analysis Data Entry Web Form → SQL/platform database → native Analysis Dashboard inside the DEC Learning Hub → approved Analysis Records reused in Design and later course creation.

The Native Dashboard Addendum is binding: any earlier Power BI reference must be ignored. The dashboard must be implemented as a native in-platform dashboard inside the DEC Learning Hub, using the platform database as the source of truth.

## 2. Implementation principle for Codex

Codex should treat the Analysis Phase as a governed workflow system, not as a simple form or admin page.

The implementation must support:

| Implementation requirement | Meaning |
| --- | --- |
| Structured Analysis Records | Validated capacity gaps are stored as structured database records. |
| K/S/M/E routing | Knowledge, Skill, Motivation, Environment, Mixed, and Unclear diagnoses control course-fit and Design readiness. |
| Course-fit decision | The system must prevent non-course gaps from automatically becoming courses. |
| Safeguards and visibility | Sensitive Analysis data must be restricted, anonymized, aggregated, or blocked where needed. |
| Native dashboard | Dashboard pages, filters, KPIs, and record detail views must be built inside the DEC Learning Hub. |
| Analysis-to-Design Handover | Approved and locked Analysis Records become read-only anchors for Design. |
| Role-sensitive access | Users only see and act on records appropriate to their role and assignment. |
| Audit trail | Review, approval, locking, return, handover, and overrides must be logged. |
| Evidence pack | Codex should report exactly what changed, how it was verified, and what remains incomplete after each implementation slice. |

Annex 13 requires Codex to provide an implementation evidence pack after each implementation slice, including what changed, files changed, verification performed, known gaps, and the next safe step.

## 3. Recommended implementation sequence

Codex should implement the Analysis Phase in small, testable slices.

| Slice | Implementation focus | Why this order matters |
| --- | --- | --- |
| 1 | Repo/spec alignment and route audit | Confirm existing structure before changing code. |
| 2 | Analysis data model and seed records | Establish structured records as source of truth. |
| 3 | Final Analysis Data Entry Web Form | Allow creation and editing of structured Analysis Records. |
| 4 | K/S/M/E and course-fit gate logic | Prevent inappropriate Design unlock. |
| 5 | Safeguards, visibility, and role-sensitive access | Protect sensitive CSO data before dashboard/detail exposure. |
| 6 | Native Analysis Dashboard — minimum viable version | Build executive, capacity, K/S/M/E, course-fit, evidence, risk, and readiness views. |
| 7 | Analysis Record Detail View | Give users a safe, structured record-level view and actions. |
| 8 | Analysis-to-Design Handover | Lock approved records and pass read-only anchors into Design. |
| 9 | Audit trail and workflow events | Track review, approval, lock, return, handover, and override events. |
| 10 | Acceptance tests, fixtures, and evidence pack | Verify full workflow and prepare for human review. |

## 4. Slice-by-slice implementation guidance and acceptance criteria

## Slice 1 — Repo/spec alignment and route audit

### Codex task

Codex should inspect the existing DEC Learning Hub repo and identify:

current route structure;

current auth/role model;

existing database/Prisma schema;

existing Course Creator Portal pages;

existing dashboard or analytics pages;

current tests and seed data;

current workflow states and enums;

where Analysis Phase functionality should live.

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Existing implementation reviewed | Codex reports current relevant routes, schema, components, and tests. |
| No premature rewrite | Codex does not replace working architecture without a clear reason. |
| Native dashboard rule acknowledged | Codex confirms no Power BI implementation will be used. |
| Proposed route placement | Codex proposes where Analysis form, dashboard, and detail views should live. |
| Risks identified | Codex identifies existing mismatches or missing dependencies. |
| No code changes unless instructed | First slice may be audit-only if requested. |

### Verification

Repo tree inspected.

Current tests identified.

Current route map documented.

Existing schemas/models reviewed.

No unintended changes.

## Slice 2 — Analysis data model and seed records

### Codex task

Implement the core Analysis Phase data structures using the existing project’s persistence pattern.

At minimum, support:

analysis_records

capacity area fields

evidence/validation fields

K/S/M/E diagnosis fields

course-fit decision fields

safeguards/visibility fields

evaluation anchor fields

workflow status fields

handover readiness fields

audit timestamps

seed/sample records for testing

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Structured Analysis Record model exists | Model supports core form, dashboard, and handover fields. |
| Nine DEC capacity areas supported | Controlled enum/options include all nine capacity areas. |
| K/S/M/E supported | Knowledge, Skill, Knowledge + Skill, Motivation, Environment, Mixed, and Unclear supported. |
| Course-fit supported | Course-addressable, partly, non-course, further diagnosis, not suitable/archived supported. |
| Safeguards supported | Risk flags, sensitivity, visibility, AI restriction, and specialist review fields available. |
| Evaluation anchor supported | Final test focus, proof possibility, monitoring signal, limitation note supported. |
| Seed data included | Includes realistic sample records covering course-addressable, partly, non-course, blocked, high-risk, and Design-ready cases. |
| Type checks pass | Schema/types compile without errors. |

### Verification

Database validation command passes.

Typecheck passes.

Seed script runs.

Sample Analysis Records appear in local database.

No certificate rule or learner runtime behavior broken.

## Slice 3 — Final Analysis Data Entry Web Form

### Codex task

Build the structured Final Analysis Data Entry Web Form inside the DEC Learning Hub.

The form should include:

Record Identity and Context

Capacity Classification

Target Learner and Use Context

Validated Capacity Gap

Evidence, Triangulation, and Validation

K/S/M/E Root-Cause Diagnosis

Course-Fit and Intervention Routing

Safeguards, Data Safety, and Visibility

Evaluation Anchor and Future Monitoring

Native Dashboard and Design Reuse Flags

Approval, Locking, and Workflow Status

Audit Trail / system metadata

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Form sections implemented | All core sections appear in a usable guided form. |
| Required fields enforced | Cannot submit without capacity area, gap, baseline, desired practice, evidence, K/S/M/E, course-fit, safeguards, and evaluation anchor. |
| Conditional fields enforced | Mixed/Motivation/Environment routes require separable K/S fields where Design is expected. |
| Controlled options used | Capacity areas, K/S/M/E, course-fit, confidence, validation, risk, and status use controlled options. |
| Safe help text included | Form warns users not to enter raw sensitive field notes or unsafe data. |
| Save draft works | User can save incomplete draft. |
| Submit for review works | Complete record can move from draft to submitted. |
| Returned record can be revised | Assigned user can revise records returned for correction. |
| Unauthorized users blocked | Learners and unrelated users cannot access form. |

### Verification

Create draft record.

Save draft.

Attempt invalid submission and confirm validation errors.

Submit complete valid record.

Test Motivation/Environment route without separable K/S and confirm Design readiness is blocked.

Test high-risk record and confirm specialist review required.

## Slice 4 — K/S/M/E and course-fit gate logic

### Codex task

Implement deterministic gate logic for K/S/M/E and course-fit decisions.

### Required rules

| Rule | Expected behavior |
| --- | --- |
| Knowledge | Can be course-addressable if evidence/safeguards/approval pass. |
| Skill | Can be course-addressable if evidence/safeguards/approval pass. |
| Knowledge + Skill | Can be course-addressable if evidence/safeguards/approval pass. |
| Motivation only | Cannot unlock Design unless separable K/S component exists and decision is partly course-addressable. |
| Environment only | Cannot unlock Design unless separable K/S component exists and decision is partly course-addressable. |
| Mixed | Can unlock Design only when separable K/S component is explicit and non-course components are recorded. |
| Unclear | Must be blocked and marked needs further diagnosis. |

This follows Annex 5’s binding rule that Phase 1 courses should address Knowledge and Skill gaps, while Motivation and Environment gaps should not drive course production unless a separable K/S component is explicitly identified.

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Design readiness calculated | System calculates ready, ready with conditions, not ready, blocked, or specialist review required. |
| Invalid route/course-fit combinations blocked | M/E-only course-addressable decisions trigger warnings or block submission. |
| Mixed route requires separable K/S | Mixed records cannot become Design-ready without separable K/S component. |
| Unclear diagnosis blocked | Unclear root cause cannot unlock Design. |
| User-facing explanation shown | Dashboard/form explains why a record is blocked. |
| Tests cover all routes | Automated tests cover Knowledge, Skill, K+S, Motivation, Environment, Mixed, and Unclear. |

### Verification

Unit tests for gate function.

Manual tests with seed records.

Dashboard/readiness status reflects gate output.

No bypass via direct route or action button.

## Slice 5 — Safeguards, visibility, and role-sensitive access

### Codex task

Implement safety and visibility logic for Analysis Records.

### Required behavior

| Area | Expected behavior |
| --- | --- |
| Risk flags | Trigger required safeguards fields and specialist review where needed. |
| Sensitivity level | Controls dashboard visibility and Design readiness. |
| Anonymization | Masks CSO/person/location where required. |
| Aggregated only | Record contributes to counts but not detail view. |
| Do not display | Record hidden from dashboard except authorized admin/specialist queue. |
| AI restriction | Sensitive records are not passed into AI context. |
| Practical proof safety | Risky proof pathways show warning or are blocked. |
| Role access | Users see only records/actions allowed by role and assignment. |

Annex 12 establishes the safe-by-default rule: raw proof and sensitive data should be private by default; dashboards should avoid exposing personal or sensitive details; and organization summaries should not become rankings or surveillance tools.

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Sensitive records restricted | High-risk and specialist-only records are hidden from unauthorized users. |
| Anonymized records masked | Dashboard labels do not expose CSO or person names. |
| Aggregated-only records handled | Counted in charts but no detail view shown. |
| Specialist review state works | Pending, cleared, returned, blocked states supported. |
| AI restriction stored | AI-use restriction field exists and is respected in context-building logic. |
| Proof safety note available | Practical proof safety warning follows into Design/Build context. |
| Role tests pass | Unauthorized users cannot view/edit restricted records. |

### Verification

Test restricted records as DEC Admin, Course Creator, Reviewer, and unauthorized user.

Confirm anonymized labels in dashboard.

Confirm “Start Design” disabled when specialist review pending.

Confirm raw sensitive evidence is not rendered in dashboard.

## Slice 6 — Native Analysis Dashboard, minimum viable version

### Codex task

Build the first functional native dashboard with core pages and filters.

Minimum pages:

Executive Overview

Capacity Area Analysis

K/S/M/E Diagnosis

Course-Fit Pipeline

Evidence Strength and Validation

Safeguards and Risk Flags

Design Readiness

Analysis Record Detail View

Optional/future page:

CSO/Cohort/Region Comparison, if safe and data model is ready

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Dashboard is native | Implemented as DEC Learning Hub routes/components, not external BI. |
| Uses database records | KPIs/charts read from Analysis Records. |
| Executive KPIs present | Total, validated, approved/locked, ready for Design, course-addressable, blocked, high-risk. |
| Capacity view present | Shows records by nine capacity areas. |
| K/S/M/E view present | Shows route distribution and mismatch warnings. |
| Course-fit view present | Shows course-addressable, partly, non-course, diagnosis needed, archived. |
| Evidence view present | Shows confidence, validation, triangulation. |
| Safeguards view present | Shows risk flags, sensitivity, specialist review. |
| Design readiness view present | Shows ready, conditional, blocked, specialist review, used in Design. |
| Filters work | Capacity area, K/S/M/E, course-fit, evidence confidence, risk, status. |
| Role-sensitive visibility works | Dashboard hides or masks restricted records. |

### Verification

Open dashboard as authorized user.

Confirm all KPI cards match seed data counts.

Apply filters and confirm filtered counts.

Confirm restricted records behave correctly.

Confirm no Power BI dependency, references, routes, or embed.

## Slice 7 — Analysis Record Detail View

### Codex task

Build a safe, role-sensitive detail page for one Analysis Record.

### Required sections

Header summary

Gap definition

Capacity classification

Evidence and validation

K/S/M/E diagnosis

Course-fit decision

Safeguards and visibility

Evaluation anchor

Handover and Design reuse

Audit trail

Role-based actions

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Detail route exists | Record detail page opens from dashboard table/chart drill-down. |
| Safe summary shown | Users without full access see safe summary only. |
| Full detail restricted | Sensitive details visible only to authorized users. |
| Status and readiness visible | User can see approval, lock, handover, and Design readiness. |
| Role-based actions shown | Approve, return, lock, create handover, start Design, archive shown only when allowed. |
| Audit history shown | Workflow events visible to authorized roles. |
| Data safety respected | Raw field notes or unsafe details not displayed. |

### Verification

Open normal record detail.

Open restricted record detail as admin and as course creator.

Confirm correct action buttons by role.

Confirm safe summary export excludes restricted details.

## Slice 8 — Analysis-to-Design Handover

### Codex task

Implement the Analysis-to-Design Handover workflow.

### Required behavior

| Handover behavior | Expected result |
| --- | --- |
| Create handover | Authorized user creates handover from approved, locked, Design-ready record. |
| Lock handover | Handover fields become official Design input. |
| Prefill Design | Design workspace receives capacity area, gap, baseline, desired practice, K/S/M/E, course-fit, safeguards, evaluation anchor. |
| Read-only anchors | Design users cannot edit locked Analysis fields. |
| Warnings shown | Mixed, M/E, safeguards, AI restriction, and proof safety warnings appear in Design. |
| Return path | Design/Review can return to Analysis with comments if Analysis basis is wrong. |
| Version preservation | Revised Analysis Record creates new version and does not silently overwrite old handover. |

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Handover creation gated | Cannot create handover from draft, unapproved, blocked, or unsafe record. |
| Locked fields copied | Handover stores approved Analysis version and locked fields. |
| Design prefill works | New Design starts with approved Analysis context. |
| Read-only enforced | Course creator cannot edit locked Analysis anchors. |
| Return-to-Analysis works | Issue can be routed back with comment. |
| Audit trail works | Create/lock/use/return events recorded. |

### Verification

Try to create handover from blocked record and confirm denied.

Create handover from ready record.

Start Design and confirm prefilled read-only fields.

Return record to Analysis and confirm event logged.

## Slice 9 — Audit trail and workflow events

### Codex task

Implement or extend workflow event logging for Analysis Phase actions.

### Events to log

created

edited

submitted for review

assigned reviewer

returned for revision

requested more evidence

specialist review requested

specialist review completed

approved

locked

visibility changed

handover created

handover locked

used in Design

returned to Analysis

reopened

archived

admin override

### Acceptance criteria

| Criterion | Expected result |
| --- | --- |
| Workflow events created | Every major action logs event type, actor, timestamp, from/to status, and comment where relevant. |
| Return comments required | Returned records require a clear reason. |
| Visibility changes logged | Sensitivity or visibility changes require reason. |
| Admin override logged | Any override records rule overridden and reason. |
| Audit visible to authorized users | Audit trail appears in record detail view. |
| Tests cover events | Key workflow transitions produce expected events. |

## Slice 10 — Final acceptance tests and evidence pack

### Codex task

Add or update tests, run verification, and produce an evidence pack.

### Minimum test scenarios

| Test scenario | Expected result |
| --- | --- |
| Create valid Knowledge gap | Record can be submitted and later approved. |
| Create Skill gap | Record can be course-addressable. |
| Motivation-only without K/S | Design blocked. |
| Environment-only without K/S | Design blocked. |
| Mixed with separable K/S | Ready with conditions if other gates pass. |
| Mixed without separable K/S | Design blocked. |
| Unclear diagnosis | Further diagnosis required. |
| High-risk pending review | Design blocked. |
| Approved locked record | Handover can be created. |
| Course creator starts Design | Design opens with read-only Analysis anchors. |
| Unauthorized user accesses dashboard | Access denied or restricted view. |
| Restricted record in dashboard | Masked/hidden according to visibility rules. |
| Native dashboard counts | KPIs match seeded data. |

### Required checks

| Check | Expected |
| --- | --- |
| Typecheck | Pass |
| Lint | Pass |
| Unit tests | Pass |
| Integration/workflow tests | Pass where available |
| Build | Pass |
| Manual route checks | Documented |
| Seed data verification | Documented |
| Role/permission checks | Documented |

## 5. Binding product rules Codex must not violate

| Rule | Do not violate |
| --- | --- |
| Native dashboard | Do not implement Power BI, embed Power BI, or keep Power BI language in product specs/UI. |
| K/S/M/E course-fit | Do not allow Motivation/Environment-only gaps to unlock Design unless separable K/S component exists. |
| Analysis before Design | Do not allow course creators to start Design from a blank page when an Analysis Record is required. |
| Locked Analysis anchors | Do not allow Design users to edit locked Analysis fields directly. |
| Safeguards | Do not expose raw sensitive data in dashboard, AI context, or course examples. |
| Role boundaries | Do not let learners or unauthorized users access Analysis/admin/creator dashboards. |
| AI boundaries | Do not let AI invent evidence, change K/S/M/E route, approve records, publish courses, or verify proof. |
| Certificate rule | Do not change the 80%+ final test score certificate rule. |
| Proof distinction | Do not require practical proof for course certificate. |
| Review/Publish separation | Do not merge Review approval with Publish release. |

Annex 1 and Annex 8 both confirm the binding certificate rule: a final test score of 80% or above means course pass and automated certificate, while practical proof and verified achievement remain separate from certification.

## 6. Copy/paste-ready Codex implementation prompt

```text
You are implementing the DEC Learning Hub Analysis Phase inside the existing repo.

Before coding, inspect the repo and produce a short implementation plan. Do not rewrite working architecture unless needed. Follow the current app stack, routing conventions, auth/role model, database pattern, test setup, and UI design system.

Governing product rule:

Implement the Analysis Phase as a governed workflow system:

field tools → triangulation/validation → Final Analysis Data Entry Web Form → platform database → native in-platform Analysis Dashboard → approved Analysis Records reused in Design.

Important override:

If any existing spec or code mentions Power BI for this Analysis Dashboard, ignore it. The dashboard must be built natively inside the DEC Learning Hub platform. Do not add Power BI dependencies, embeds, workspace logic, bookmarks, reports, or UI wording.

Implement in small slices:

1. Audit current routes/schema/auth/tests.

2. Add/align Analysis Record data model and realistic seed records.

3. Build Final Analysis Data Entry Web Form.

4. Implement K/S/M/E and course-fit gate logic.

5. Implement safeguards, visibility, and role-sensitive access.

6. Build native Analysis Dashboard minimum pages.

7. Build Analysis Record Detail View.

8. Implement Analysis-to-Design Handover.

9. Add audit/workflow events.

10. Add tests and provide evidence pack.

Core Analysis fields:

capacity area, sub-capacity, indicator/standard, target learner group, validated gap, baseline/current practice, desired practice, evidence source summary, triangulation status, validation status, evidence confidence, K/S/M/E route, separable K/S component, course-fit decision, intervention route, safeguards/no-harm note, visibility restriction, AI-use restriction, evaluation anchor, monitoring signal, approval status, lock status, handover status.

K/S/M/E rule:

Knowledge and Skill gaps may proceed to course design if evidence, safeguards, approval, and lock conditions pass.

Motivation and Environment gaps must not unlock Design unless a separable Knowledge/Skill component is explicitly recorded.

Mixed gaps may proceed only for the recorded separable Knowledge/Skill component.

Unclear diagnosis must remain blocked and marked for further diagnosis.

Safeguards rule:

Do not expose raw field notes, interview transcripts, FGD notes, personal data, beneficiary/community identifiable data, safeguarding case details, politically sensitive data, or confidential internal documents in dashboard/detail views.

Use safe summaries, anonymization, aggregation, restricted visibility, specialist review, and AI-use restrictions.

Dashboard minimum:

Native dashboard pages should include Executive Overview, Capacity Area Analysis, K/S/M/E Diagnosis, Course-Fit Pipeline, Evidence Strength and Validation, Safeguards and Risk Flags, Design Readiness, and Analysis Record Detail View.

KPIs and filters must read from the platform database.

Role-sensitive access must be enforced before rendering records, actions, and details.

Handover rule:

Only approved, locked, Design-ready Analysis Records can create an Analysis-to-Design Handover.

Design must receive read-only Analysis anchors and warning messages for Mixed, Motivation, Environment, safeguards, AI restriction, and proof-safety conditions.

Design users must not edit locked Analysis fields directly; corrections require return to Analysis.

Acceptance criteria:

- Typecheck, lint, tests, and build pass.

- Seed records cover Knowledge, Skill, Mixed with separable K/S, Motivation-only blocked, Environment-only blocked, Unclear blocked, high-risk specialist review, approved/locked Design-ready.

- Dashboard counts match seed data.

- Restricted records are hidden, masked, or aggregated according to visibility rules.

- Course Creator can start Design only from approved/locked/Design-ready records.

- Unauthorized users cannot access Analysis dashboard/detail/form.

- No Power BI references or dependencies remain in the Analysis Dashboard implementation.

After implementation, provide a Codex Implementation Evidence Pack with:

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
```

## 7. Codex evidence pack template for this Analysis Phase

```markdown
# Codex Implementation Evidence Pack — DEC Analysis Phase

## 1. Implementation Slice

- Slice name:

- Date:

- Branch / working context:

- Prompt/task summary:

- Scope implemented:

- Out of scope:

## 2. Plain-Language Product Summary

Explain what changed in user-facing terms.

## 3. DEC Workflow Alignment

Explain how this supports:

Field tools → validation → Analysis Record → native dashboard → Analysis-to-Design Handover → Design → Build → Review → Publish → Monitoring.

## 4. Files Changed

| File | Change type | Why changed |

|---|---|---|

## 5. Routes / Screens Affected

| Route / screen | Change made | User role affected |

|---|---|---|

## 6. Data / Schema / Migration Changes

- Schema changes:

- Migration files:

- New fields:

- Changed enums/statuses:

- Seed data:

- Rollback considerations:

## 7. Workflow State / Gate Changes

- States added/changed:

- Gate behavior changed:

- Records created/updated:

- Return paths affected:

- Lock/unlock behavior affected:

## 8. Role and Permission Changes

| Role | New/changed permission | Expected behavior |

|---|---|---|

## 9. Binding Rule Checks

Confirm:

- Native dashboard, no Power BI:

- K/S/M/E routing enforced:

- Motivation/Environment-only gaps blocked unless separable K/S exists:

- Mixed gaps require separable K/S:

- Analysis anchors become read-only in Design:

- Raw sensitive evidence hidden/restricted:

- AI restrictions respected:

- 80%+ final test certificate rule unchanged:

- Practical proof remains separate from certificate:

- Review and Publish remain separate:

## 10. Tests and Verification

| Check | Command / method | Result |

|---|---|---|

| Typecheck | | |

| Lint | | |

| Unit tests | | |

| Integration tests | | |

| Build | | |

| Manual route checks | | |

## 11. Manual Verification Steps for Human Reviewer

1.

2.

3.

4.

5.

## 12. Screenshots / URLs / Evidence

- Local URL(s):

- Screenshot path(s):

- Terminal log summary:

- Test output summary:

## 13. Acceptance Criteria Results

| Acceptance criterion | Status | Evidence |

|---|---|---|

## 14. Known Gaps / Limitations

-

## 15. Risks / Decisions Needed

-

## 16. Next Smallest Safe Step

Recommend exactly one next implementation step.
```

## 8. Human reviewer acceptance checklist

DEC/ESSET should review Codex work using this checklist.

| Review area | Acceptance question | Pass standard |
| --- | --- | --- |
| Product fit | Does the implementation preserve the Analysis Phase as an evidence-linked workflow? | Yes |
| Native dashboard | Is the dashboard built inside the platform, with no Power BI dependency? | Yes |
| Form completeness | Does the Analysis form capture all required Analysis Record fields? | Yes |
| K/S/M/E logic | Are Motivation/Environment-only and Unclear records blocked from Design? | Yes |
| Mixed-gap logic | Does Mixed require separable K/S before Design readiness? | Yes |
| Course-fit | Are course-addressable, partly, non-course, diagnosis-needed, and archived states visible? | Yes |
| Safeguards | Are sensitive records restricted, anonymized, aggregated, or hidden? | Yes |
| Role access | Are unauthorized users blocked from Analysis routes and records? | Yes |
| Dashboard metrics | Do KPI cards and charts match seed data? | Yes |
| Detail view | Does the record detail page show safe, structured, role-sensitive information? | Yes |
| Handover | Can only approved/locked/ready records create handover? | Yes |
| Design prefill | Does Design receive read-only Analysis anchors? | Yes |
| Audit trail | Are review, approval, lock, handover, return, and override events logged? | Yes |
| Tests | Do typecheck, lint, tests, and build pass? | Yes |
| Evidence pack | Did Codex provide a complete evidence pack? | Yes |

## 9. Quality Self-Check

| Criterion group | Status | Evidence / note | Revision needed? |
| --- | --- | --- | --- |
| Codex implementation readiness | Met | Provides slice-by-slice implementation guidance, acceptance criteria, verification steps, and a copy/paste-ready Codex prompt. | No |
| Native dashboard override | Met | Clearly states that Power BI must not be implemented and the dashboard must be native inside the DEC Learning Hub. | No |
| K/S/M/E gate logic | Met | Provides deterministic rules and acceptance criteria for Knowledge, Skill, Mixed, Motivation, Environment, and Unclear routes. | No |
| Form/data model alignment | Met | References Analysis Record fields needed for form, database, dashboard, and handover implementation. | No |
| Safeguards integration | Met | Includes visibility, anonymization, AI restriction, proof safety, and role-sensitive access acceptance criteria. | No |
| Dashboard implementation guidance | Met | Specifies minimum pages, metrics, filters, role-sensitive behavior, and database source-of-truth requirements. | No |
| Handover implementation guidance | Met | Defines approved/locked/Design-ready conditions, read-only anchors, return paths, and version preservation. | No |
| Testing coverage | Met | Includes route, gate, dashboard, restricted record, handover, and unauthorized-access test scenarios. | No |
| Evidence pack | Met | Provides a complete Codex evidence pack template aligned with Annex 13. | No |
| Human review usability | Met | Includes a plain checklist DEC/ESSET can use to assess Codex output without needing deep coding expertise. | No |
| DEC-specific grounding | Met | Preserves DEC capacity areas, Analysis workflow, native dashboard, role boundaries, safeguards, certificate distinction, and evidence-linked course creation. | No |
| Overall quality judgment | Met | Output is ready to be used as the implementation guidance and acceptance criteria section of the operating package. | No |


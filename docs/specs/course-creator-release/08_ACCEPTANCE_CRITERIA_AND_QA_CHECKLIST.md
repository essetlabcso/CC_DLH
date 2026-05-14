# 08 — Acceptance Criteria and QA Checklist

## 1. Purpose

This file defines how ESSET/DEC and Codex should verify that the Course Creator Portal MVP is working.

A release is not accepted because the screens look good. It is accepted only when the governed workflow works end to end and binding DEC product rules are preserved.

## 2. End-to-end acceptance checklist

Use the example course:

```text
Outcome Evidence for CSO MEAL
Capacity area: Monitoring, Evaluation, Accountability, and Learning
K/S/M/E route: Skill + Knowledge
Recognition path: 80%+ certificate + optional practical proof
```

### Creator workflow

```text
[ ] Course Creator can sign in.
[ ] Creator lands on Creator Dashboard.
[ ] Creator can start a new course.
[ ] Creator can open an existing course.
[ ] Creator can complete Course Setup.
[ ] Creator can save Setup draft.
[ ] Creator can continue to Analysis only after required Setup fields are complete.
[ ] Creator can complete Analysis / Diagnosis.
[ ] Creator can select Knowledge route.
[ ] Creator can select Skill route.
[ ] Creator can select Mixed route and document separable K/S component.
[ ] Motivation-only route is blocked from course production.
[ ] Environment-only route is blocked from course production.
[ ] Creator can lock Analysis when required fields are complete.
[ ] Locked Analysis appears read-only in later phases.
[ ] Creator can complete Capacity Map.
[ ] Capacity Map reads locked Analysis.
[ ] Creator can validate Capacity Map.
[ ] Creator can complete Action Map.
[ ] Action Map requires at least one observable action.
[ ] Each observable action includes practice and assessment logic.
[ ] Creator can complete Learning Design Document.
[ ] Learning Design objectives link to Action Map actions.
[ ] Creator can lock Learning Design.
[ ] Creator can complete Storyboard and Block Plan.
[ ] Storyboard blocks link to objectives/actions.
[ ] Creator can generate or open Build Studio draft from Storyboard.
[ ] Build Studio imports/prefills Storyboard blocks.
[ ] Creator can edit required blocks.
[ ] Creator can add at least one creator-added block.
[ ] Creator-added block requires purpose tag and linked action/objective.
[ ] Creator can mark block complete.
[ ] Creator can configure Final Test.
[ ] 80% certificate rule is visible and fixed.
[ ] Creator cannot change certificate threshold.
[ ] No 90% rule appears anywhere.
[ ] Creator can configure optional Practical Proof.
[ ] Practical Proof is separate from certificate.
[ ] Creator can open learner preview.
[ ] Preview/readiness checklist shows unresolved issues.
[ ] Submit for Review is disabled until readiness conditions are met.
[ ] Creator can submit for Review after readiness passes.
[ ] Submission creates Build-to-Review Handover.
[ ] Submission does not publish the course.
```

### Review and revision workflow

```text
[ ] Reviewer can open submitted course.
[ ] Reviewer can view Analysis, Design, Build, Final Test, Proof, and Preview summary.
[ ] Reviewer can add comments linked to exact block/test/proof/design/analysis item.
[ ] Reviewer can return course to Build.
[ ] Reviewer can return course to Design.
[ ] Reviewer can return course to Analysis.
[ ] Creator sees returned comments grouped by required fixes and suggestions.
[ ] Creator can resolve required fixes.
[ ] Resubmit remains disabled until required fixes are resolved.
[ ] Creator can resubmit after required fixes are resolved.
[ ] Reviewer can approve for Publish.
[ ] Approved for Publish does not make course live.
```

### Publish workflow

```text
[ ] Creator cannot publish by default.
[ ] Admin/Authorized Publisher can view Approved for Publish queue.
[ ] Admin/Authorized Publisher can confirm metadata, visibility, access mode, and version.
[ ] Admin/Authorized Publisher can publish approved course.
[ ] Published Course Record is created.
[ ] Course state becomes Published.
[ ] Monitoring activates after publication or seeded runtime data is linked to published version.
```

### Monitoring workflow

```text
[ ] Creator can view monitoring for owned published course.
[ ] Monitoring dashboard is version-aware.
[ ] Dashboard has filters for version, cohort, organization, learner group, and date range.
[ ] Dashboard shows enrolled learners.
[ ] Dashboard shows completed learners.
[ ] Dashboard shows completion rate.
[ ] Dashboard shows final test pass rate.
[ ] Dashboard shows certificates issued.
[ ] Dashboard shows proof submissions.
[ ] Dashboard shows verified achievements.
[ ] Dashboard shows learner feedback summary.
[ ] Dashboard shows improvement signals.
[ ] Monitoring connects back to capacity area and course purpose.
[ ] Raw proof is not exposed in general dashboard.
```

## 3. Binding rule checks

These must pass in every implementation slice that touches the relevant workflow.

```text
[ ] Course creation cannot bypass Analysis / Diagnosis.
[ ] K/S/M/E routing controls course eligibility.
[ ] Motivation-only and Environment-only gaps do not proceed unless separable K/S component exists.
[ ] Analysis lock is enforced before Capacity Map / Design workflow.
[ ] Locked Analysis appears read-only downstream.
[ ] Build Studio is governed flexible authoring, not blank-canvas.
[ ] Required Storyboard blocks prefill Build Studio.
[ ] Creator-added blocks require purpose tag and justification.
[ ] AI outputs are draft-only.
[ ] AI outputs require human review.
[ ] AI does not approve, publish, certify, verify proof, or award badges.
[ ] Final test certificate threshold is fixed at 80%.
[ ] 80%+ final test score triggers certificate.
[ ] Practical proof is not required for certificate.
[ ] Verified achievement requires human review.
[ ] Review and Publish remain separate.
[ ] Reviewer approval does not automatically publish.
[ ] Creator cannot publish by default.
[ ] Raw proof is private by default.
[ ] Donor-facing visibility is not exposed without safe summary/consent logic.
[ ] Monitoring is version-aware.
[ ] Monitoring links to original capacity evidence.
```

## 4. Screen-level acceptance criteria

## 4.1 Creator Dashboard

```text
[ ] Dashboard shows creator's active courses.
[ ] Dashboard shows next required action per course.
[ ] Dashboard shows returned courses and review comments summary.
[ ] Dashboard shows submitted-for-review courses.
[ ] Dashboard shows published courses with monitoring shortcut.
[ ] Dashboard is workflow-first, not decorative only.
```

## 4.2 Course Setup

```text
[ ] Required fields are visible.
[ ] Save draft works.
[ ] Missing required fields show guidance.
[ ] Continue to Analysis is blocked until required fields are complete.
[ ] Course Draft / Setup record is created or updated.
```

## 4.3 Analysis / Diagnosis

```text
[ ] Required Analysis fields are visible.
[ ] K/S/M/E route selection works.
[ ] Motivation-only and Environment-only blocking works.
[ ] Mixed route requires separable K/S component.
[ ] Analysis readiness checklist updates correctly.
[ ] Lock Analysis works only after required fields pass.
[ ] Locked Analysis becomes read-only.
```

## 4.4 Capacity Map

```text
[ ] Locked Analysis summary is visible.
[ ] Capacity area and sub-capacity are visible.
[ ] Indicator/standard link field is visible.
[ ] Capacity objective is required.
[ ] Course boundary statement is required.
[ ] Capacity Map validates before Action Map unlocks.
```

## 4.5 Action Map

```text
[ ] Creator can add/edit/delete action rows.
[ ] At least one observable action is required.
[ ] Practice activity is required for each action.
[ ] Minimum information is required for each action.
[ ] Assessment link is required for each action.
[ ] Action Map validates before Learning Design unlocks.
```

## 4.6 Learning Design

```text
[ ] Locked evidence summary is visible.
[ ] Objectives link to Action Map actions.
[ ] Lesson pathway section exists.
[ ] Assessment approach section exists.
[ ] Accessibility/localization section exists.
[ ] Safeguarding/data safety section exists.
[ ] AI draft-only warning is visible.
[ ] Design lock works only when required sections are complete.
```

## 4.7 Storyboard

```text
[ ] Storyboard imports or references Learning Design.
[ ] Creator can define lessons.
[ ] Creator can define blocks.
[ ] Each required block links to objective/action.
[ ] Block type is selected.
[ ] Draft content summary can be entered.
[ ] Storyboard validates before Build Studio unlocks.
```

## 4.8 Build Studio

```text
[ ] Build Studio uses three-panel layout.
[ ] Left panel includes course outline and block library.
[ ] Center panel includes learner-like canvas.
[ ] Right panel includes block properties/governance.
[ ] Storyboard blocks appear in Build Studio.
[ ] Creator can edit required blocks.
[ ] Creator can add optional block.
[ ] Optional block requires purpose tag and justification.
[ ] Block completion status is visible.
```

## 4.9 Final Test

```text
[ ] Creator can add/edit test questions.
[ ] Questions can link to lesson/block/action.
[ ] Correct answer and feedback can be set.
[ ] Attempts allowed can be set if supported.
[ ] 80% certificate threshold is visible and fixed.
[ ] Threshold is not editable by Creator.
[ ] Final Test readiness is required before Review submission.
```

## 4.10 Practical Proof

```text
[ ] Practical Proof can be enabled or disabled.
[ ] Proof purpose is required if enabled.
[ ] Accepted proof types can be selected.
[ ] Learner instructions can be entered.
[ ] Safety/anonymization note is visible.
[ ] Review rubric can be entered.
[ ] Badge/verified achievement title can be entered.
[ ] Proof visibility defaults to private/safe.
```

## 4.11 Preview & Readiness

```text
[ ] Learner preview opens.
[ ] Required blocks checklist is shown.
[ ] Creator-added block justification checklist is shown.
[ ] AI human review checklist is shown.
[ ] Final Test readiness is shown.
[ ] Practical Proof readiness is shown if enabled.
[ ] Accessibility/safety checklist is shown.
[ ] Submit for Review remains disabled until readiness passes.
```

## 4.12 Review Submission

```text
[ ] Build-to-Review Handover summary is visible.
[ ] Analysis and Design handover links are shown.
[ ] Required blocks summary is shown.
[ ] Creator-added block register is shown.
[ ] AI drafting and review log is shown.
[ ] Final Test record and 80% rule confirmation are shown.
[ ] Practical Proof configuration is shown if enabled.
[ ] Accessibility/safety checklist is shown.
[ ] Submit creates Submitted for Review state.
[ ] Submit does not publish.
```

## 4.13 Review Feedback / Revision

```text
[ ] Returned status is visible.
[ ] Decision history is visible.
[ ] Comments are grouped by required fixes and suggestions.
[ ] Comments link to exact workflow items.
[ ] Creator can mark fixes resolved.
[ ] Resubmit remains disabled until required fixes are resolved.
[ ] Resubmission updates review state.
```

## 4.14 Publish Handoff

```text
[ ] Approved for Publish courses appear in Admin/Publisher queue.
[ ] Publish page checks review approval.
[ ] Metadata/visibility/version are confirmed.
[ ] Publish action is role-restricted.
[ ] Published Course Record is created.
[ ] Monitoring activates.
```

## 4.15 Monitoring Dashboard

```text
[ ] Filters are visible.
[ ] KPI cards are visible.
[ ] Charts/sections are visible.
[ ] Course version is shown.
[ ] Capacity area is shown.
[ ] Certificate metric uses 80% rule.
[ ] Practical proof appears separately from certificates.
[ ] Raw proof is not exposed.
[ ] Improvement signals are visible.
```

## 5. UI quality checklist

```text
[ ] Top app bar is consistent.
[ ] Left sidebar is consistent.
[ ] Workflow stepper is visible on workflow screens.
[ ] Active step is clear.
[ ] Breadcrumbs are clear.
[ ] Course status pill is visible.
[ ] Primary next action is obvious.
[ ] Save/autosave indicator is visible.
[ ] Readiness panels are easy to understand.
[ ] Warning panels are visible but not overwhelming.
[ ] Forms are grouped into manageable cards.
[ ] Tables are readable.
[ ] Build Studio layout is not crowded.
[ ] Colors follow DEC visual system.
[ ] Typography is readable.
[ ] Screens are usable on desktop 16:9.
[ ] Responsive behavior does not break core workflow.
```

## 6. Data safety checklist

```text
[ ] Raw proof is not visible to unauthorized users.
[ ] General monitoring uses aggregate/safe summaries.
[ ] Proof upload instructions warn against sensitive data.
[ ] AI is not given sensitive raw proof.
[ ] Donor-facing visibility is absent or safe-summary-only.
[ ] Organization evidence is not presented as a ranking/surveillance tool.
[ ] Safety/no-harm warnings appear where relevant.
```

## 7. Accessibility and localization checklist

```text
[ ] Text contrast is acceptable.
[ ] Forms have labels.
[ ] Buttons have clear names.
[ ] Status is not shown only through color.
[ ] Images/media have alt text or placeholder alt guidance.
[ ] Video/audio blocks require captions/transcripts where relevant.
[ ] Plain-language guidance is used.
[ ] Low-bandwidth alternative notes are supported where relevant.
```

## 8. Technical QA checklist

Codex should run available checks and report results.

```text
[ ] Type check passes or known issues are documented.
[ ] Lint passes or known issues are documented.
[ ] Unit tests pass where available.
[ ] Build passes.
[ ] Route smoke test completed.
[ ] Role/permission checks completed.
[ ] Gate logic manually verified.
[ ] Seed/demo data works.
[ ] No unrelated files changed.
[ ] No broad schema change without justification.
```

## 9. Manual demo script

Use this script for UAT.

1. Sign in as Course Creator.
2. Open Creator Dashboard.
3. Start new course using the Outcome Evidence example.
4. Complete Setup.
5. Complete Analysis as Skill + Knowledge gap.
6. Lock Analysis.
7. Open Capacity Map and confirm taxonomy.
8. Complete Capacity Map.
9. Open Action Map and add at least two learner actions.
10. Validate Action Map.
11. Complete Learning Design.
12. Lock Design.
13. Create Storyboard with at least one lesson and several blocks.
14. Validate Storyboard.
15. Open Build Studio.
16. Edit required blocks.
17. Add one creator-added block with justification.
18. Configure Final Test with at least three questions.
19. Confirm fixed 80% certificate rule.
20. Enable Practical Proof and configure proof instructions.
21. Open learner preview.
22. Resolve readiness checklist.
23. Submit for Review.
24. Sign in or switch as Reviewer.
25. Return course to Build with one required comment.
26. Sign in as Creator and resolve comment.
27. Resubmit.
28. Reviewer approves for Publish.
29. Sign in or switch as Admin/Publisher.
30. Publish approved course.
31. Open Monitoring Dashboard.
32. Confirm metrics, version-awareness, certificate/proof separation, and raw proof privacy.

## 10. Codex evidence pack requirement

After each implementation slice, Codex must provide:

```text
1. Slice name
2. Plain-language product summary
3. Files changed
4. Routes/screens affected
5. Data/schema changes
6. Role/permission changes
7. Workflow/gate changes
8. Binding rule checks
9. Tests/checks run
10. Manual verification steps
11. Screenshots/URLs/evidence
12. Acceptance criteria results
13. Known gaps
14. Risks/decisions needed
15. Next smallest safe step
```

## 11. Release acceptance decision

The release should be accepted only when:

```text
[ ] End-to-end creator workflow works.
[ ] Review and Publish separation works.
[ ] 80% certificate rule works.
[ ] Practical proof is separate and private by default.
[ ] Monitoring is version-aware and safe.
[ ] UI follows approved Course Creator Portal design direction.
[ ] Codex evidence pack is complete.
```

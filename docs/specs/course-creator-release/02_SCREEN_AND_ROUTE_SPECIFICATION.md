# 02 — Screen and Route Specification

## 1. Purpose

This file defines the required Course Creator Portal MVP screens, recommended route structure, user actions, required data, and gate behavior.

Codex should inspect the existing repo before final route implementation. Use the routes below as recommended targets unless the current architecture already has equivalent paths.

## 2. Recommended route structure

```text
/creator
/creator/courses
/creator/courses/new/setup
/creator/courses/[courseId]/setup
/creator/courses/[courseId]/analysis
/creator/courses/[courseId]/capacity-map
/creator/courses/[courseId]/action-map
/creator/courses/[courseId]/design
/creator/courses/[courseId]/storyboard
/creator/courses/[courseId]/build
/creator/courses/[courseId]/build/final-test
/creator/courses/[courseId]/build/practical-proof
/creator/courses/[courseId]/preview
/creator/courses/[courseId]/review-submit
/creator/courses/[courseId]/revision
/creator/courses/[courseId]/monitoring
```

If the repo already uses a different course route structure, preserve the existing route conventions where possible while maintaining the same screen behavior.

## 3. Global creator screen requirements

Every course workflow screen should include:

- consistent top app bar;
- consistent left sidebar;
- breadcrumb;
- course title and current status;
- workflow stepper;
- save/autosave status;
- primary next action;
- readiness/guidance panel where useful;
- locked evidence summary where applicable;
- visible warning states where blocked.

## 4. Required screens

## Screen 1 — Sign In

### Purpose

Allow authorized Course Creators to access the Course Creator Portal.

### Required behavior

- User signs in.
- System identifies user role.
- Course Creator lands on Creator Dashboard.
- Unauthorized user is blocked or redirected.
- Session persists across workflow screens.

### Acceptance

- Course Creator can sign in once and remain authenticated across the workflow.

---

## Screen 2 — Creator Dashboard / Home

### Recommended route

```text
/creator
```

### Purpose

The creator’s operational control center.

### Required UI sections

- Welcome message.
- My active courses.
- Needs My Action.
- Submitted for Review.
- Returned for Revision.
- Published courses.
- Monitoring snapshot.
- Support resources.
- Start New Course button.
- Open Course button.

### Required course card fields

- Course title.
- Capacity area.
- Target learner group.
- Current workflow state.
- Next required action.
- Linked diagnosis / Analysis status.
- Review status if submitted/returned.
- Monitoring status if published.

### Required behavior

- Creator can open existing course.
- Creator can start a new course.
- Course cards show workflow state, not only draft/published.
- Returned courses show comments/required fixes.
- Published courses show monitoring shortcut.

### Acceptance

- Creator immediately knows which course needs action and what the next step is.

---

## Screen 3 — Course Setup

### Recommended routes

```text
/creator/courses/new/setup
/creator/courses/[courseId]/setup
```

### Purpose

Create the basic course shell before Analysis and Design.

### Required fields

- Course title.
- Short description.
- Course owner.
- Target learner group.
- Language.
- Duration estimate.
- Delivery mode.
- Level.
- Capacity area.
- Sub-capacity.
- Tags.
- Draft learning outcomes.
- Draft lesson outline.
- Draft resource list.
- Final test enabled.
- Certificate enabled.
- Practical proof enabled/disabled.
- Feedback enabled.
- Access mode.

### Required behavior

- Save draft.
- Autosave indicator.
- Setup readiness checklist.
- Continue to Analysis only when required setup fields are complete.

### Gate

Unlock Analysis when:

- course title exists;
- target learner group selected;
- language selected;
- duration estimate added;
- capacity area selected;
- owner assigned.

### Acceptance

- A Course Draft record exists after saving Setup.
- Analysis opens only after core setup fields are complete.

---

## Screen 4 — Analysis / Diagnosis

### Recommended route

```text
/creator/courses/[courseId]/analysis
```

### Purpose

Confirm that the course is based on a real, course-addressable CSO capacity gap.

### Required fields

- Capacity gap statement.
- Evidence source.
- Evidence type.
- Source confidence.
- Current baseline / what CSOs currently do.
- Desired practice / what learners should do better.
- Root cause route: Knowledge, Skill, Motivation, Environment, Mixed.
- Separable Knowledge/Skill component if Mixed or M/E-dominant.
- Course-fit decision.
- Safeguards / no-harm note.
- Data sensitivity note.
- Evaluation anchor.

### Required UI sections

- Analysis form.
- K/S/M/E routing panel.
- Course-fit decision panel.
- Warning panel for Motivation/Environment-only gaps.
- Readiness checklist.
- Lock Analysis button.
- Locked Analysis summary after lock.

### Required behavior

- Creator can save Analysis as draft.
- Creator can validate Analysis.
- Creator can lock Analysis only when required fields are complete.
- Motivation-only or Environment-only gaps cannot proceed unless separable K/S component is recorded.
- Locked Analysis becomes read-only in later phases.

### Gate

Unlock Capacity Map when:

- capacity gap entered;
- evidence source added;
- baseline described;
- desired practice described;
- root cause selected;
- course-fit decision selected;
- safeguards note added;
- evaluation anchor added;
- K/S route or valid mixed K/S component recorded;
- Analysis locked.

### Acceptance

- Knowledge and Skill routes can proceed.
- Mixed route can proceed only if separable Knowledge/Skill component is documented.
- Motivation-only and Environment-only routes are blocked from course production.
- Analysis lock unlocks Capacity Map.

---

## Screen 5 — Capacity Map

### Recommended route

```text
/creator/courses/[courseId]/capacity-map
```

### Purpose

Map locked Analysis to DEC CSO capacity taxonomy and indicator logic.

### Required fields

- Locked Analysis summary.
- Capacity area.
- Sub-capacity.
- Related CSO practice.
- Indicator / standard link.
- Target learner group.
- Organization level.
- Delivery context.
- Capacity objective.
- Course boundary statement.

### Required behavior

- Analysis summary is read-only.
- Creator selects or confirms taxonomy fields.
- Creator writes capacity objective.
- Creator writes boundary statement.
- Creator validates Capacity Map.
- Validated Capacity Map unlocks Action Map.

### Acceptance

- Course cannot proceed to Action Map without valid Capacity Map.
- Capacity Map remains traceable to locked Analysis.

---

## Screen 6 — Action Map

### Recommended route

```text
/creator/courses/[courseId]/action-map
```

### Purpose

Translate the capacity objective into observable learner actions and practical learning design.

### Required fields per action

- Observable learner action.
- Action type.
- Practice activity.
- Practice type.
- Minimum information.
- Assessment link.
- Proof possibility.
- Proof suitability.

### Required behavior

- Creator can add/edit/delete action rows.
- At least one observable action is required.
- Each action must include practice and assessment logic.
- Action Map validates before Learning Design unlocks.

### Gate

Unlock Learning Design when:

- at least one observable action exists;
- each action has a practice activity;
- each action has minimum information;
- each action has assessment link;
- proof suitability is considered;
- Action Map validated.

### Acceptance

- Course cannot proceed with vague topic-only objectives.
- Each action describes what the participant will actually do differently.

---

## Screen 7 — Learning Design Document

### Recommended route

```text
/creator/courses/[courseId]/design
```

### Purpose

Convert Analysis, Capacity Map, and Action Map into a build-ready learning plan.

### Required sections

- Locked evidence summary.
- Design readiness checklist.
- Learning objectives linked to actions.
- Lesson pathway.
- Assessment approach.
- Accessibility and localization notes.
- Safeguarding and data safety notes.
- Evidence and MEAL alignment.
- AI authoring context / draft-only warning.
- Human accountability note.

### Required behavior

- Creator can save draft design.
- Creator can preview design read-only.
- Creator can lock design when required sections are complete.
- Locked design unlocks Storyboard.

### Acceptance

- Learning Design shows traceability to Analysis, Capacity Map, and Action Map.
- Design cannot be marked complete if objectives are not linked to actions.

---

## Screen 8 — Storyboard, Scenario & Block Plan

### Recommended route

```text
/creator/courses/[courseId]/storyboard
```

### Purpose

Turn the learning design into a block-by-block plan that prefills Build Studio.

### Required sections

- Course summary.
- Lesson list.
- Block table.
- Block type.
- Block title.
- Linked action/objective.
- Draft content summary.
- Scenario/practice details.
- Assessment/proof link.
- Estimated time.
- Block status.
- Attachment links.
- Block planning panel.

### Required behavior

- Creator can import from Learning Design.
- Creator can add/edit storyboard blocks.
- Creator can validate Storyboard.
- Creator can generate Build Studio draft.
- Build Studio unlocks only after valid Storyboard.

### Gate

Unlock Build Studio when:

- lessons defined;
- required blocks defined;
- each block linked to objective/action;
- assessment/proof links added where relevant;
- Storyboard validated;
- Build draft generated.

### Acceptance

- At least one lesson and multiple blocks are created.
- Each required block has linked action or objective.
- Build Studio opens with prefilled storyboard blocks.

---

## Screen 9 — Build Studio Suite

### Recommended route

```text
/creator/courses/[courseId]/build
```

### Purpose

Allow creators to build the course using governed flexible blocks.

### Required tabs

- Build Blocks.
- Final Test.
- Practical Proof.
- Preview & Readiness.

### Required layout

- Left panel: course outline and block library.
- Center panel: learner-like course canvas.
- Right panel: block configuration, governance, AI, accessibility, and safeguarding.

### Acceptance

- Build Studio is not blank-canvas.
- Blocks remain linked to approved design records.
- Creator-added blocks are allowed but must be justified.

---

## Screen 9A — Build Blocks

### Required UI

Left panel:

- course outline;
- search blocks;
- block library;
- required/recommended/optional labels.

Center panel:

- learner-like canvas;
- block list/cards;
- add block area;
- reorder controls;
- preview controls.

Right panel:

- block title;
- block type;
- content editor;
- media/attachments;
- block settings;
- linked action/objective;
- assessment/proof link;
- AI draft marker;
- accessibility/safety notes;
- save block.

### Required behavior

- Storyboard blocks prefill Build Studio.
- Creator can edit block content.
- Creator can add at least one new block.
- Creator-added block requires purpose tag and linked action/objective.
- Creator can mark block complete.

---

## Screen 9B — Final Test

### Recommended route

```text
/creator/courses/[courseId]/build/final-test
```

### Required fields

- Final test title.
- Instructions.
- Question list.
- Question type.
- Question prompt.
- Answer options.
- Correct answer.
- Feedback.
- Linked lesson/block/action.
- Attempts allowed.
- Fixed pass/certificate threshold: 80%.

### Required behavior

- Creator can add/edit questions.
- System displays fixed 80% certificate rule.
- Creator cannot change threshold.
- Final Test must be configured before Review submission.

### Acceptance

- 80%+ final test score triggers automated certificate.
- Practical proof is not required for certificate.
- No 90% rule appears anywhere.

---

## Screen 9C — Practical Proof

### Recommended route

```text
/creator/courses/[courseId]/build/practical-proof
```

### Required fields

- Enable/disable practical proof.
- Proof title.
- Proof purpose.
- Linked action/performance goal.
- Accepted proof types.
- Learner instructions.
- Safety/anonymization note.
- Review rubric.
- Verifier role.
- Badge / verified achievement title.
- Visibility setting.

### Required behavior

- Practical proof is optional.
- Proof is separate from certificate.
- Raw proof is private by default.
- Verified achievement requires human review.

### Acceptance

- Certificate can be issued without proof.
- Proof submission can lead to verified achievement only after human review.
- Raw proof is not shown in general monitoring dashboards.

---

## Screen 9D — Preview & Readiness

### Recommended route

```text
/creator/courses/[courseId]/preview
```

### Required sections

- Learner preview.
- Required blocks complete.
- Creator-added blocks justified.
- AI outputs human-reviewed.
- Final test configured.
- Practical proof checked if enabled.
- Accessibility checklist.
- Safeguarding/data safety checklist.
- Unresolved warnings.
- Submit for Review readiness.

### Required behavior

- Preview must be opened or marked checked before Review submission.
- Submit for Review remains disabled until readiness checks pass.

---

## Screen 10 — Review Submission / Build-to-Review Handover

### Recommended route

```text
/creator/courses/[courseId]/review-submit
```

### Purpose

Submit the course package for review without allowing publication.

### Required summary

- Course title/version.
- Course owner.
- Linked Analysis Handover.
- Linked Design Handover.
- Capacity area/sub-capacity.
- Target learner group.
- Performance goal.
- Required blocks summary.
- Creator-added block register.
- AI drafting and human review log.
- Final Test Record.
- 80% certificate rule confirmation.
- Practical Proof Configuration.
- Accessibility checklist.
- Safeguarding/data safety checklist.
- Learner preview status.
- Unresolved warnings.

### Required behavior

- Submit for Review creates Build-to-Review Handover.
- Course state becomes Submitted for Review.
- Creator can no longer edit freely unless returned or reopened.
- Submission does not publish the course.

### Acceptance

- Course cannot be submitted if Build readiness is incomplete.
- Submission does not publish the course.

---

## Screen 11 — Review Feedback / Revision

### Recommended route

```text
/creator/courses/[courseId]/revision
```

### Purpose

Allow creators to address returned reviewer comments.

### Required UI

- Returned status.
- Decision history.
- Required fixes.
- Suggested improvements.
- Resolved comments.
- Comment linked to block/test/proof/design/analysis record.
- Before/after revision area.
- Revision checklist.
- Resubmit button.

### Required behavior

- Reviewer can return to Build, Design, or Analysis.
- Creator sees exact required fixes.
- Creator marks fixes resolved.
- Resubmit remains disabled until required fixes are resolved.

### Acceptance

- Returned comments are actionable and linked to exact workflow items.
- Creator can revise and resubmit.

---

## Screen 12 — Publish Handoff

### Recommended route

Codex should connect this to the existing admin/publish route if already implemented. Suggested route if needed:

```text
/admin/courses/publish
```

### Purpose

Allow Admin/Authorized Publisher to publish only an approved course.

### Required behavior

- Approved for Publish course appears in publish queue.
- Admin confirms metadata, visibility, version, access mode.
- Admin publishes.
- Published Course Record is created.
- Course enters Published state.
- Monitoring activates.

### Acceptance

- Creator cannot publish by default.
- Reviewer approval alone does not make course live.
- Admin/Publisher publish action is required.

---

## Screen 13 — Monitoring Dashboard

### Recommended route

```text
/creator/courses/[courseId]/monitoring
```

### Purpose

Show safe, version-aware monitoring for published courses.

### Required filters

- Version.
- Cohort.
- Organization.
- Learner group.
- Date range.

### Required metrics

- Enrolled learners.
- Completed learners.
- Completion rate.
- Final test pass rate.
- Certificates issued.
- Proof submissions.
- Verified achievements.
- Learner feedback average.
- Improvement signals.

### Required sections

- Enrollment and completion over time.
- Final test performance.
- Score distribution.
- Proof pipeline.
- Lesson progress overview.
- Assessment item analysis.
- Safe capacity evidence summary.
- Learner feedback.
- Improvement signals.
- Next review window.
- Privacy/data safety note.

### Acceptance

- Monitoring is version-aware.
- Monitoring connects back to course capacity area and original course purpose.
- Raw proof is not exposed.

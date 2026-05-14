# 03 — Workflow Gates, States, and Records

## 1. Purpose

This file defines the workflow states, gates, required records, unlock conditions, return paths, and traceability rules for the Course Creator Portal MVP.

The portal must operate as a governed workflow system, not a loose set of disconnected pages.

## 2. Workflow spine

The MVP workflow spine is:

```text
Setup
→ Analysis
→ Capacity Map
→ Action Map
→ Learning Design
→ Storyboard
→ Build
→ Preview
→ Review
→ Publish
→ Learner Runtime
→ Certificate
→ Optional Practical Proof
→ Verified Achievement
→ Monitoring and Evaluation
```

For implementation, these are grouped into major gated workflow areas:

| Gated area | Main purpose |
|---|---|
| Setup | Create basic course identity and ownership |
| Analysis Gate | Confirm evidence, baseline, root cause, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor |
| Design Gate | Convert approved Analysis into Capacity Map, Action Map, Learning Design, Storyboard, and build-ready handover |
| Build Gate | Convert approved Design into learner-facing course, final test, optional proof pathway, preview, and review-ready handover |
| Review Gate | Check alignment, quality, safety, accessibility, assessment, certificate logic, proof pathway, and learner runtime readiness |
| Publish Gate | Release reviewed course version through authorized role and visibility/version controls |
| Monitoring | Track learner progress, final test, certificates, proof, verified achievements, feedback, and improvement evidence |

## 3. High-level gate matrix

| Gate | Required record | Required before unlock | Unlocks |
|---|---|---|---|
| Setup Gate | Course Draft / Course Setup Record | Core course identity, owner, target group, language, capacity area | Analysis |
| Analysis Gate | Analysis-to-Design Handover | Validated capacity gap, baseline/current practice, desired practice, evidence source, root cause, K/S/M/E route, course-fit decision, safeguards/no-harm note, evaluation anchor, lock/approval | Capacity Map and Design workflow |
| Capacity Map Gate | Capacity Map Record | Capacity area, sub-capacity, indicator/standard, target group, capacity objective, course boundary | Action Map |
| Action Map Gate | Capacity Action Map Record | Observable learner actions, practice activities, minimum information, assessment links, proof suitability | Learning Design |
| Design Gate | Learning Design Document + Design-to-Build Handover | Learning objectives, lesson pathway, assessment approach, accessibility/localization, safeguards, AI authoring context, approval/lock | Storyboard / Build preparation |
| Storyboard Gate | Storyboard and Block Plan | Lessons, required blocks, linked objectives/actions, assessment/proof links, validation | Build Studio |
| Build Gate | Build-to-Review Handover | Required blocks built, creator-added blocks purpose-tagged/justified, AI outputs reviewed, final test configured, 80% certificate rule confirmed, learner preview completed, proof setup checked if enabled | Review |
| Review Gate | Course Review Record | Review approval, required fixes closed, safety/accessibility/test/certificate/proof checks passed | Publish |
| Publish Gate | Published Course Record | Authorized publisher/admin, metadata complete, visibility selected, version assigned, final learner preview confirmed, publication action recorded | Learner Runtime and Monitoring |
| Monitoring Activation | Published Course Record + runtime records | Course is published/live or assigned | Dashboards, analytics, feedback, certificate registry, proof tracking, verified achievement records |

## 4. MVP workflow states

The MVP should support these course states:

```text
Setup Draft
Setup Complete
Analysis In Progress
Analysis Ready to Lock
Analysis Locked
Capacity Map In Progress
Capacity Map Validated
Action Map In Progress
Action Map Validated
Design In Progress
Design Locked
Storyboard In Progress
Storyboard Validated
Build In Progress
Build Ready for Review
Submitted for Review
Returned to Analysis
Returned to Design
Returned to Build
Approved for Publish
Published
Monitoring Active
Archived / Retired
```

## 5. State behavior rules

### 5.1 Draft states

Draft states are editable by the assigned Course Creator.

Examples:

- Setup Draft
- Analysis In Progress
- Capacity Map In Progress
- Action Map In Progress
- Design In Progress
- Storyboard In Progress
- Build In Progress

### 5.2 Validated / locked states

Validated or locked states should be read-only downstream unless explicitly reopened with reason.

Examples:

- Analysis Locked
- Capacity Map Validated
- Action Map Validated
- Design Locked
- Storyboard Validated

### 5.3 Submitted states

When a course is Submitted for Review:

- free editing should stop;
- Review package should be visible;
- creator can view but not freely change submitted package unless returned or reopened.

### 5.4 Returned states

Returned states must show exact reviewer comments and required fixes.

Return targets:

```text
Returned to Analysis
Returned to Design
Returned to Build
```

The return path must preserve:

- reviewer decision;
- comment;
- linked record/block/test/proof item;
- severity;
- required/suggested classification;
- resolution status;
- resubmission history.

### 5.5 Approved for Publish

Approved for Publish means Review has approved the course for release, but the course is not live.

Only Admin/Authorized Publisher can publish.

### 5.6 Published / Monitoring Active

Published means the course version has been released.

Monitoring Active means runtime/monitoring records are available or seeded for dashboards.

## 6. Required logical records

The MVP may simplify database normalization, but it must preserve these logical records:

```text
User / Role
Course Draft
Course Setup
Analysis-to-Design Handover
Capacity Map
Action Map
Learning Design
Storyboard / Block Plan
Course Build
Course Block
AI Drafting and Review Log
Final Test
Final Test Question
Practical Proof Configuration
Build-to-Review Handover
Course Review
Review Comment
Published Course
Learner Progress Summary
Final Test Attempt Summary
Certificate Summary
Proof Submission Summary
Verified Achievement Summary
Learner Feedback Summary
Course Improvement Signal
```

## 7. Record responsibilities

| Record | Created/updated in | Purpose |
|---|---|---|
| Course Draft | Setup | Basic course identity and ownership |
| Course Setup | Setup | Stores core course settings and initial configuration |
| Analysis-to-Design Handover | Analysis | Locks evidence base and course-fit decision |
| Capacity Map | Capacity Map | Links course to capacity area, sub-capacity, indicator, and target group |
| Action Map | Action Map | Defines performance goal, learner actions, practice, minimum information, and assessment logic |
| Learning Design | Learning Design | Defines learning pathway, assessment approach, safeguards, accessibility, and AI context |
| Storyboard / Block Plan | Storyboard | Defines lesson and block sequence before Build |
| Course Build | Build Studio | Stores built course shell, lessons, and block sequence |
| Course Block | Build Studio | Stores individual block content and metadata |
| AI Drafting and Review Log | Build Studio | Tracks AI-assisted content and human review status |
| Final Test | Build Studio | Stores test setup, scoring, and 80% certificate rule |
| Final Test Question | Build Studio | Stores final test items and answer keys |
| Practical Proof Configuration | Build Studio | Stores optional proof instructions, accepted proof types, safety notes, rubric, and badge link |
| Build-to-Review Handover | Review Submission | Confirms built course is ready for Review |
| Course Review | Review | Stores review decisions, approvals, returns, and track status |
| Review Comment | Review / Revision | Stores linked comments and resolution status |
| Published Course | Publish | Stores published version, metadata, visibility, release settings, and publisher |
| Learner Progress Summary | Monitoring | Tracks aggregate learner progress |
| Final Test Attempt Summary | Monitoring | Tracks attempt and score summaries |
| Certificate Summary | Monitoring | Tracks certificates issued at 80%+ |
| Proof Submission Summary | Monitoring / Proof Review | Tracks proof submissions and statuses |
| Verified Achievement Summary | Monitoring | Tracks accepted proof and badges |
| Learner Feedback Summary | Monitoring | Tracks ratings/comments in safe summary format |
| Course Improvement Signal | Monitoring | Tracks issues and improvement triggers |

## 8. Gate unlock conditions

### Gate 1 — Setup to Analysis

Unlock when:

```text
Course title exists
Target learner group selected
Language selected
Duration estimate added
Capacity area selected
Owner assigned
```

### Gate 2 — Analysis to Capacity Map

Unlock when:

```text
Capacity gap entered
Evidence source added
Baseline described
Desired practice described
Root cause selected
Course-fit decision selected
Safeguards note added
Evaluation anchor added
K/S route or valid mixed K/S component recorded
Analysis locked
```

### Gate 3 — Capacity Map to Action Map

Unlock when:

```text
Capacity area confirmed
Sub-capacity selected
Indicator/standard linked
Target learner group confirmed
Capacity objective drafted
Course boundary statement added
Capacity Map validated
```

### Gate 4 — Action Map to Learning Design

Unlock when:

```text
At least one observable action exists
Each action has practice activity
Each action has minimum information
Each action has assessment link
Proof suitability considered
Action Map validated
```

### Gate 5 — Learning Design to Storyboard

Unlock when:

```text
Learning objectives linked to actions
Lesson pathway drafted
Assessment approach completed
Accessibility/localization completed
Safeguarding/data safety completed
Evidence/MEAL alignment completed
Design locked
```

### Gate 6 — Storyboard to Build Studio

Unlock when:

```text
Lessons defined
Required blocks defined
Each block linked to objective/action
Assessment/proof links added where relevant
Storyboard validated
Build draft generated
```

### Gate 7 — Build Studio to Review

Unlock when:

```text
Required blocks complete
Creator-added blocks justified
AI outputs human-reviewed
Final test configured
80% certificate rule confirmed
Practical proof checked if enabled
Learner preview completed
Accessibility/safety checklist completed
Build-to-Review handover generated
```

### Gate 8 — Review to Publish

Unlock when:

```text
Reviewer approves
Required fixes resolved
Safety/accessibility/test/proof checks passed
Course Review Record created
State = Approved for Publish
```

### Gate 9 — Publish to Monitoring

Unlock when:

```text
Authorized Admin/Publisher publishes
Published Course Record created
Version assigned
Runtime/monitoring records available or seeded
State = Published / Monitoring Active
```

## 9. K/S/M/E routing logic

### Allowed routes

```text
Knowledge → allow course workflow
Skill → allow course workflow
Mixed with clear Knowledge/Skill component → allow only the documented course-addressable component
```

### Blocked or routed routes

```text
Motivation-only → block course production or route to non-course support
Environment-only → block course production or route to non-course support
Unclear root cause → require further diagnosis
```

### Required warning copy

Use warning copy like:

> This appears to be mainly a Motivation or Environment barrier. A course alone is unlikely to solve it. Record a separable Knowledge or Skill component, or route this issue to coaching, technical assistance, leadership support, systems strengthening, safeguarding review, or enabling-environment action.

## 10. Locking and editability

### Locked Analysis

Once Analysis is locked:

- later phases show it read-only;
- capacity gap, baseline, desired practice, K/S/M/E route, course-fit decision, and safeguards cannot be silently changed;
- any return to Analysis must record reviewer/admin reason.

### Locked Design

Once Design is locked:

- Build Studio should read from the Design and Storyboard records;
- later changes should be handled through return/revision, not silent editing.

### Published Course

Published course versions should be version-aware.

Changes after publication should create revision/version behavior, not silent overwrites.

## 11. Return paths

The Review workflow must support:

```text
Approve for Publish
Approve with minor fixes
Return to Build
Return to Design
Return to Analysis
Specialist Review Required
Not Approved / Pause
```

For MVP, it is acceptable to implement the core paths:

```text
Approve for Publish
Return to Build
Return to Design
Return to Analysis
```

Each returned comment must include:

- severity;
- required or suggested;
- linked item;
- comment text;
- reviewer;
- date;
- resolution status.

## 12. Monitoring activation

Monitoring must activate only after publication or with seeded demo data clearly attached to a published version.

Monitoring records must remain linked to:

- course ID;
- course version ID;
- capacity area;
- target learner group;
- Analysis Handover;
- Design Handover;
- final test;
- practical proof configuration if enabled.

## 13. Audit trail

The MVP should preserve enough audit information for:

- who created the course;
- who locked Analysis;
- who validated/locked Design;
- who submitted for Review;
- who returned or approved;
- who published;
- when major state changes happened;
- what was changed after return.

If full audit log infrastructure already exists, use it. If not, implement minimal workflow history records or visible state history.

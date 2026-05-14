# 01 — Course Creator Release Specification

## 1. Release purpose

The DEC CSO Learning Hub Course Creator Portal release must deliver a functional, governed, evidence-linked course creation workflow. The release is not only a UI build. It must prove that a Course Creator can move one course from an approved CSO capacity gap into a structured course package that can be reviewed, published by an authorized role, and monitored after publication.

The Course Creator Portal must be implemented as a guided production system, not a generic LMS, blank page builder, or AI course generator.

## 2. MVP release goal

The MVP must allow one complete course creation journey:

```text
Sign in
→ Creator Dashboard
→ Course Setup
→ Analysis / Diagnosis
→ Lock Analysis
→ Capacity Map
→ Action Map
→ Learning Design Document
→ Storyboard & Block Plan
→ Build Studio Suite
→ Final Test
→ Optional Practical Proof
→ Preview & Readiness
→ Submit for Review
→ Revise if Returned
→ Approved for Publish
→ Admin Publish
→ Monitoring
```

The MVP should use the example course:

- **Course title:** Outcome Evidence for CSO MEAL
- **Alternative title:** Writing Outcome Evidence from Project Activities
- **Capacity area:** Monitoring, Evaluation, Accountability, and Learning
- **Sub-capacity:** Outcome evidence and adaptive learning
- **Target participants:** MEAL officers, project officers, program coordinators, and reporting staff
- **Main gap:** CSO reports describe activities and attendance but do not clearly explain what changed, for whom, and what evidence supports the change.
- **K/S/M/E route:** Skill + Knowledge
- **Recognition path:** 80%+ final test certificate, plus optional practical proof for verified achievement.

## 3. Product identity

The Course Creator Portal is:

> A governed, evidence-linked, AI-assisted course production workspace that helps DEC and selected course creators transform validated CSO capacity gaps into practical, reviewed, published, and monitored learning courses.

It must preserve the full traceability chain:

```text
Capacity evidence
→ Analysis Gate
→ Capacity Map
→ Action Map
→ Learning Design
→ Storyboard
→ Build Studio
→ Final Test
→ Certificate
→ Optional Practical Proof
→ Verified Achievement
→ Review
→ Publish
→ Monitoring
→ Course Improvement
```

## 4. What this release is not

This release must not become:

- a generic LMS course editor;
- a blank-canvas page builder;
- a simple upload space for PDFs and videos;
- an AI-generated-course tool;
- a decorative dashboard with no real gates;
- a donor surveillance or raw-proof exposure tool;
- a system that treats course completion as proof of organizational transformation.

## 5. Binding product rules

### 5.1 Course creation starts from evidence

Every course must be linked to a diagnosed CSO capacity gap, target learner group, capacity area, baseline/current practice, desired practice, root cause, and course-fit decision.

A course should not be created or published unless it is linked to a recognized CSO capacity area and a specific diagnosed gap.

### 5.2 K/S/M/E routing controls course eligibility

Every diagnosed capacity gap must be classified as:

- Knowledge
- Skill
- Motivation
- Environment
- Mixed

Phase 1 course production may proceed for Knowledge and Skill gaps.

Motivation-only and Environment-only gaps must not proceed into course production unless a separable Knowledge or Skill component is explicitly recorded.

### 5.3 Analysis is locked before design

The Analysis / Diagnosis record is the evidence anchor for the full workflow.

Required behavior:

```text
Analysis draft
→ Analysis validated
→ Analysis locked
→ later phases display locked Analysis read-only
```

Later phases must not silently rewrite the approved Analysis.

### 5.4 Each phase produces a record and unlocks the next phase

The portal must not be a loose set of disconnected pages. Each phase must create or update a workflow record, and each gate must have a clear unlock condition.

### 5.5 Build Studio is governed flexible authoring

The Build Studio must allow creators to build rich learning content while preserving alignment with the approved Analysis, Action Map, and Storyboard.

The Build Studio must not become a blank canvas.

Creator-added blocks are allowed only when they include:

- purpose tag;
- linked action/objective;
- justification;
- accessibility/safeguarding note where relevant;
- optional assessment/proof link where relevant.

### 5.6 AI is draft-only and context-bound

AI may help draft or improve content, but it must not make workflow decisions.

AI may assist with:

- short explanations;
- plain-language rewriting;
- fictionalized examples;
- scenario wording;
- practice instructions;
- quiz item drafts;
- feedback messages;
- alt text drafts;
- localization support.

AI must not:

- invent capacity gaps;
- invent evidence;
- change K/S/M/E route;
- override course-fit decisions;
- approve courses;
- publish courses;
- issue certificates;
- verify proof;
- award badges;
- decide donor visibility.

All AI-assisted outputs must be marked draft and reviewed by a human.

### 5.7 Certificate rule is fixed at 80%

The binding Phase 1 certificate rule is:

```text
80%+ final test score = course pass + automated certificate
```

The platform must not implement:

- a 90% certificate threshold;
- 80% pass but 90% certificate;
- certificate only after practical proof;
- certificate only after badge approval;
- certificate only after proof verification.

### 5.8 Practical proof and verified achievement are separate

Practical proof is an optional/additional pathway for learners or CSOs to show application of learning.

It is separate from course certification.

Correct recognition model:

| Recognition | Trigger | Review required? |
|---|---|---|
| Course certificate | Final test score of 80%+ | Automated |
| Practical proof submission | Learner/CSO submits applied evidence | Not yet verified |
| Verified achievement / badge | Proof accepted | Human review required |

### 5.9 Review and Publish are separate

Course Creators submit for Review. They do not publish by default.

Correct behavior:

```text
Creator submits course
→ Reviewer reviews
→ Reviewer approves for publish or returns
→ Authorized Admin/Publisher publishes
→ Course becomes visible to learners
```

Incorrect behavior:

```text
Creator submits → course goes live
Reviewer approves → course automatically goes live
```

### 5.10 Monitoring connects back to capacity evidence

Monitoring must not only count enrollments and completions. It must connect learner activity back to:

- original CSO capacity gap;
- Analysis baseline;
- Design performance goal;
- course version;
- final test;
- certificate;
- optional practical proof;
- verified achievement;
- learner feedback;
- improvement decisions.

### 5.11 Data safety is safe by default

Raw practical proof is private by default.

General dashboards must show safe summaries, not raw proof.

AI must not process sensitive raw proof.

Proof upload instructions must warn learners not to upload unnecessary beneficiary, safeguarding, civic-space, or personal data.

## 6. MVP scope

### 6.1 Must include

The MVP must include:

- Creator Dashboard;
- Course Setup;
- Analysis Gate;
- K/S/M/E routing;
- Analysis lock;
- Capacity Map;
- Action Map;
- Learning Design Document;
- Storyboard & Block Plan;
- Build Studio Suite;
- Final Test configuration;
- fixed 80% certificate rule;
- optional Practical Proof configuration;
- Preview & Readiness;
- Review Submission;
- Returned Revision handling;
- Admin Publish handoff;
- Monitoring Dashboard;
- role boundary enforcement;
- safe data visibility basics;
- AI draft-only guardrail UI.

### 6.2 Must not overbuild now

Do not overbuild:

- complex donor portal;
- advanced adaptive learning engine;
- full AI-generated course production;
- advanced multi-review automation;
- heavy media editing suite;
- complex public badge sharing;
- advanced cohort facilitation;
- full organization capacity scoring;
- external certificate registry;
- complex role hierarchy beyond MVP needs.

## 7. Minimum user roles

### Course Creator

Can:

- sign in;
- view dashboard;
- create/open assigned course;
- complete Setup, Analysis, Capacity Map, Action Map, Design, Storyboard, and Build;
- configure final test;
- configure optional practical proof;
- preview course;
- submit for Review;
- revise returned course;
- view monitoring for owned published courses.

Cannot:

- publish by default;
- approve own course for publication;
- change certificate threshold;
- verify practical proof unless separately assigned;
- expose raw proof externally;
- bypass Analysis, Review, or Publish gates.

### Reviewer

Can:

- open submitted course;
- review traceability, content, blocks, final test, proof setup, AI review status, safety, and accessibility;
- approve for Publish;
- return to Build, Design, or Analysis;
- add linked comments.

Cannot:

- publish unless separately authorized;
- change certificate rule;
- make raw proof public.

### Admin / Authorized Publisher

Can:

- see courses approved for Publish;
- confirm metadata, version, visibility, and access mode;
- publish approved course version;
- view monitoring;
- manage publish status.

Cannot:

- silently publish unreviewed courses;
- expose raw proof by default;
- change 80% certificate rule without DEC decision.

## 8. Release success standard

The release is successful when the demo course can move through the full workflow:

```text
Setup Draft
→ Analysis Locked
→ Capacity Map Validated
→ Action Map Validated
→ Design Locked
→ Storyboard Validated
→ Build Ready for Review
→ Submitted for Review
→ Returned or Approved
→ Approved for Publish
→ Published
→ Monitoring Active
```

## 9. Final MVP definition

The Course Creator Portal MVP must deliver one complete governed course creation workflow. A Course Creator signs in, opens the dashboard, creates or opens a course, completes Setup, completes and locks Analysis with K/S/M/E routing, completes Capacity Map, Action Map, Learning Design, and Storyboard, opens Build Studio prefilled from Storyboard, edits required blocks, adds at least one justified block, configures Final Test with fixed 80% certificate rule, configures optional Practical Proof separately, previews the learner experience, submits for Review, revises returned comments, reaches Approved for Publish, and then an Admin/Authorized Publisher publishes the course. Monitoring then shows version-aware learning, certificate, proof, feedback, and improvement evidence without exposing raw proof.

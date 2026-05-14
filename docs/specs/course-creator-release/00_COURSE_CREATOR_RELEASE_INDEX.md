# 00 — Course Creator Release Index

## 1. Purpose

This folder is the working implementation package for the DEC CSO Learning Hub Course Creator Portal release.

Codex and any coding agent must read this index first, then follow the release specification, workflow gates, screen specifications, Build Studio specification, role/safety rules, UI design rules, acceptance criteria, and demo data.

Do not rely on chat history. Do not replace this governed workflow with generic LMS patterns.

## 2. Product identity

The DEC CSO Learning Hub Course Creator Portal is a governed, evidence-linked, AI-assisted course production workflow for Ethiopian CSO capacity strengthening.

It helps selected course creators and subject matter experts transform validated CSO capacity gaps into practical learning courses that are:

- linked to CSO capacity evidence;
- routed through K/S/M/E course-fit logic;
- designed around practical learner actions;
- built through a governed flexible Build Studio;
- reviewed before publication;
- published only by an authorized role;
- monitored after publication through learning and capacity evidence.

## 3. What this release is not

The Course Creator Portal must not be implemented as:

- a generic LMS;
- a blank-canvas course editor;
- a simple PDF/video upload area;
- an AI course generator;
- a dashboard-only mockup;
- a donor surveillance tool;
- a tool that claims course completion alone proves organizational transformation.

## 4. Required reading order

Codex must read the release package in this order before audit, planning, or implementation:

```text
1. 00_COURSE_CREATOR_RELEASE_INDEX.md
2. 01_COURSE_CREATOR_RELEASE_SPECIFICATION.md
3. 03_WORKFLOW_GATES_STATES_AND_RECORDS.md
4. 02_SCREEN_AND_ROUTE_SPECIFICATION.md
5. 04_BUILD_STUDIO_SUITE_SPECIFICATION.md
6. 06_ROLE_PERMISSION_AND_SAFETY_RULES.md
7. 05_UI_DESIGN_SYSTEM_AND_LAYOUT_RULES.md
8. 08_ACCEPTANCE_CRITERIA_AND_QA_CHECKLIST.md
9. 09_RELEASE_DEMO_DATA_AND_EXAMPLE_COURSE.md
10. 07_CODEX_IMPLEMENTATION_GUIDE.md
11. SKILL.md
```

## 5. Core release workflow

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

## 6. Binding product rules

These rules are binding for the MVP release.

### 6.1 Evidence-first course creation

A course must begin from a diagnosed CSO capacity gap, not from a blank topic.

### 6.2 K/S/M/E course-fit routing

- Knowledge gaps may proceed.
- Skill gaps may proceed.
- Mixed gaps may proceed only for the documented separable Knowledge/Skill component.
- Motivation-only gaps must not proceed into Phase 1 course production.
- Environment-only gaps must not proceed into Phase 1 course production.
- Unclear root cause requires further diagnosis.

### 6.3 Analysis lock

Analysis must be validated and locked before Capacity Map and Design workflow can proceed.

### 6.4 Governed Build Studio

Build Studio must use governed flexible authoring. It must support creativity while keeping every required or creator-added block linked to approved course purpose, learner action, assessment, proof, accessibility, or safeguarding logic.

### 6.5 AI draft-only

AI may assist drafting, simplifying, localizing, and improving content. AI must not approve, publish, verify proof, issue certificates, award badges, or decide visibility.

### 6.6 Fixed certificate rule

```text
80%+ final test score = course pass + automated certificate
```

No 90% certificate threshold should appear anywhere.

### 6.7 Practical proof is separate from certificate

Practical proof is optional/additional and may lead to verified achievement only after human review. It is not required for course certificate.

### 6.8 Review and Publish separation

Creators submit for Review. Reviewers approve or return. Only an Admin/Authorized Publisher publishes.

### 6.9 Raw proof private by default

Raw practical proof must not appear in general dashboards or donor-facing views. Use safe summaries only.

### 6.10 Monitoring traceability

Monitoring must link learner activity back to course version, capacity area, Analysis, Design, final test, certificate, practical proof, verified achievement, feedback, and improvement signals.

## 7. MVP success standard

The MVP is successful when one example course can move through:

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

## 8. Reference folder

If visual references are added to the repo, use:

```text
docs/specs/course-creator-release/reference/
```

Suggested structure:

```text
reference/
  mockups/
    00_home.png
    01_setup.png
    02_analysis.png
    03_capacity_map.png
    04_action_map.png
    05_learning_design.png
    06_storyboard.png
    07_build_studio.png
    08_build_studio_suite.png
    09_review_revision.png
    10_monitoring.png

  prototype/
    dec-course-creator-portal-code.html
    dec-course-creator-portal-design.md
    dec-course-creator-portal-SKILL.md
```

Use these only as visual/product references. Do not treat static HTML as production code unless it matches the repo architecture.

## 9. Implementation principle

Codex must:

- audit the repo first;
- identify existing routes, models, components, and role guards;
- prepare an implementation plan before coding;
- implement in safe slices;
- provide an evidence pack after each slice;
- avoid broad schema changes unless necessary and justified;
- preserve existing working admin/reviewer/publish foundations where they already satisfy the release logic.

## 10. Conflict handling

This release package is an implementation layer. It does not delete or replace the larger DEC Learning Hub specifications.

If conflicts appear, preserve these binding rules:

- 80% certificate threshold;
- K/S/M/E routing;
- Analysis and Design gates;
- governed Build Studio;
- AI draft-only behavior;
- Review/Publish separation;
- proof privacy;
- monitoring traceability.

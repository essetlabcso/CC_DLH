# SKILL.md — DEC CSO Learning Hub Course Creator Portal

## Purpose

Use this skill when implementing, auditing, testing, or refining the DEC CSO Learning Hub Course Creator Portal.

The portal is a governed, evidence-linked, AI-assisted course creation workflow for Ethiopian CSO capacity strengthening. It is not a generic LMS, not a blank page builder, and not an AI course generator.

## Required reading order

Before planning or coding, read:

```text
docs/specs/course-creator-release/00_COURSE_CREATOR_RELEASE_INDEX.md
docs/specs/course-creator-release/01_COURSE_CREATOR_RELEASE_SPECIFICATION.md
docs/specs/course-creator-release/03_WORKFLOW_GATES_STATES_AND_RECORDS.md
docs/specs/course-creator-release/02_SCREEN_AND_ROUTE_SPECIFICATION.md
docs/specs/course-creator-release/04_BUILD_STUDIO_SUITE_SPECIFICATION.md
docs/specs/course-creator-release/06_ROLE_PERMISSION_AND_SAFETY_RULES.md
docs/specs/course-creator-release/05_UI_DESIGN_SYSTEM_AND_LAYOUT_RULES.md
docs/specs/course-creator-release/08_ACCEPTANCE_CRITERIA_AND_QA_CHECKLIST.md
docs/specs/course-creator-release/09_RELEASE_DEMO_DATA_AND_EXAMPLE_COURSE.md
docs/specs/course-creator-release/07_CODEX_IMPLEMENTATION_GUIDE.md
```

Do not rely on chat history.

## Product identity

The Course Creator Portal helps selected course creators transform validated CSO capacity gaps into practical, reviewed, published, and monitored learning courses.

It preserves the workflow:

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
→ Monitoring
```

## Binding rules

### Evidence-first

Course creation starts from validated CSO capacity evidence, not a blank topic.

### K/S/M/E routing

- Knowledge gaps may proceed.
- Skill gaps may proceed.
- Mixed gaps may proceed only for the documented Knowledge/Skill component.
- Motivation-only gaps are blocked from Phase 1 course production.
- Environment-only gaps are blocked from Phase 1 course production.

### Analysis lock

Analysis must be validated and locked before Capacity Map and Design workflow continue.

### Governed Build Studio

Build Studio is governed flexible authoring.

It must not become:

- blank canvas;
- slide editor;
- generic page builder;
- unrestricted HTML editor.

Creator-added blocks are allowed only with:

- purpose tag;
- linked action/objective;
- justification;
- accessibility/safeguarding note where relevant.

### AI draft-only

AI may draft, simplify, localize, and suggest content.

AI must not:

- invent evidence;
- change K/S/M/E route;
- approve;
- publish;
- issue certificate;
- verify proof;
- award badge;
- decide visibility.

AI output must be marked draft/AI-assisted and human-reviewed.

### Certificate rule

```text
80%+ final test score = course pass + automated certificate
```

No 90% certificate threshold.

Practical proof is not required for certificate.

### Practical proof

Practical proof is optional/additional and separate from certificate.

Verified achievement or badge requires human review.

Raw proof is private by default.

### Review and Publish separation

Creators submit for Review. Reviewers approve or return. Admin/Authorized Publisher publishes.

Reviewer approval alone must not make the course live.

### Monitoring

Monitoring must be version-aware and must link back to:

- course version;
- capacity area;
- Analysis;
- Design;
- final test;
- certificates;
- proof;
- verified achievements;
- feedback;
- improvement signals.

Raw proof must not be shown in general monitoring.

## UI rules

Use the approved Course Creator visual direction:

- consistent top app bar;
- left sidebar;
- workflow stepper;
- clean cards;
- clear status pills;
- readiness checklists;
- warning panels;
- right-side guidance where useful;
- three-panel Build Studio;
- low-clutter forms;
- readable tables;
- DEC blue/green institutional style.

## Implementation behavior

Always:

- audit before coding;
- plan before implementation;
- preserve existing repo architecture where possible;
- make minimal necessary schema changes;
- implement in safe slices;
- report changed files;
- run available tests/checks;
- provide manual verification steps;
- include known gaps.

Never:

- silently bypass gates;
- implement generic LMS shortcuts;
- make Creator a publisher by default;
- expose raw proof;
- change 80% certificate rule;
- let AI make approval/verification/publication decisions;
- overbuild future donor/adaptive/cohort features in MVP.

## Evidence pack after each slice

Return:

```text
1. Slice name
2. Plain-language product summary
3. Files changed
4. Routes/screens affected
5. Data/schema changes
6. Workflow/gate changes
7. Role/permission changes
8. Binding rule checks
9. Tests/checks run
10. Manual verification steps
11. Acceptance criteria results
12. Known gaps
13. Risks/decisions needed
14. Next smallest safe step
```

## Demo course

Use the stable demo course:

```text
Outcome Evidence for CSO MEAL
Capacity area: Monitoring, Evaluation, Accountability, and Learning
K/S/M/E route: Skill + Knowledge
Recognition: 80%+ certificate + optional practical proof
```

All demo work should remain traceable to this course unless asked otherwise.

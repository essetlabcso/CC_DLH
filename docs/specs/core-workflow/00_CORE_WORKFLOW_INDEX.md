# DEC Learning Hub Phase 1 — Refined Core Workflow Specification Index

## Purpose

This folder contains the latest refined operational workflow specifications for the DEC Learning Hub Course Creator Portal. These files should be treated as the detailed phase-level workflow layer for implementing, testing, and reviewing the Course Creator Portal in Phase 1.

The five phase files refine and operationalize the existing repository specifications:

- `DEC_Learning_Hub_Phase1_Core_Workflow_Overriding_Specification_REGENERATED.md`
- `spec_dec_learning_hub.md`

They should not be applied by blindly overwriting the existing implementation. Codex should first compare these files against the current repo, identify gaps and conflicts, and then implement changes through a phased, testable plan.

---

## Source Hierarchy

Use the following hierarchy when interpreting requirements:

1. **The five refined phase files in this folder are the newest detailed operational workflow layer** for the Course Creator Portal.
2. **`DEC_Learning_Hub_Phase1_Core_Workflow_Overriding_Specification_REGENERATED.md` remains the consolidated source of truth** for the overall Phase 1 core workflow principles, scope, and acceptance logic.
3. **`spec_dec_learning_hub.md` remains the broader product implementation specification** for the DEC Learning Hub Phase 1 platform.
4. **Existing working implementation should be preserved where it already satisfies these specifications.**
5. If there is a conflict, Codex should document it in a Spec Integration Audit before changing code.

---

## Core Workflow Phase Files

| Phase | File | Main purpose |
|---|---|---|
| 1 | `01_ANALYSIS_PHASE.md` | Defines evidence intake, CSO capacity diagnosis, baseline, root-cause analysis, K/S/M/E routing, and Analysis-to-Design handover. |
| 2 | `02_DESIGN_PHASE.md` | Defines action mapping, learning design document, storyboard, scenario/practice planning, and Design-to-Build handover. |
| 3 | `03_BUILD_PHASE.md` | Defines governed but flexible block-based course building, full left-side block library, AI-assisted drafting, final test, certificate logic, practical proof, and verified achievement. |
| 4 | `04_REVIEW_AND_PUBLISH_PHASE.md` | Defines quality review, role-sensitive publishing, final test/certificate validation, practical achievement validation, safeguarding/accessibility checks, and version control. |
| 5 | `05_MONITORING_AND_EVALUATION_PHASE.md` | Defines learner progress tracking, final test analytics, certificate registry, practical proof review, verified achievement tracking, dashboards, and course improvement loops. |

---

## Core Workflow Chain

The DEC Learning Hub Course Creator Portal should preserve the full traceability chain:

```text
Analysis evidence
→ capacity gap
→ baseline
→ root cause
→ intervention route
→ action map
→ learning design
→ storyboard
→ flexible block build
→ final test
→ certificate / verified achievement
→ review
→ publish
→ monitoring
→ evaluation
→ course improvement and capacity evidence
```

---

## Phase 1 Scope Rules

For Phase 1, the platform should prioritize course production for **Knowledge** and **Skill** gaps.

| Diagnosis | Phase 1 treatment |
|---|---|
| Knowledge gap | Suitable for course creation, micro-learning, explainers, job aids, knowledge checks, and final tests. |
| Skill gap | Suitable for guided practice, worked examples, scenarios, templates, practical outputs, and final tests. |
| Motivation gap | Should not drive Phase 1 course production; route outside the course workflow or record for future support. |
| Environment gap | Should not drive Phase 1 course production; route outside the course workflow or record for future support. |
| Mixed gap | Build only the clear Knowledge/Skill component if separable; route Motivation/Environment components outside Phase 1. |

---

## Build Phase Implementation Priority

The Build Phase requires special attention because it balances governance and flexibility.

The Course Creator Portal should support:

- governed creation from approved Analysis and Design records;
- flexible block addition during Build;
- a full left-side block navigation panel with expandable categories and subcategories;
- required vs creator-added block distinction;
- added block justification;
- block-purpose linkage;
- final test logic: **80% pass, 90% automated certificate**;
- practical proof submission;
- verified achievement or badge recognition linked to CSO capacity indicators or standards;
- learner preview;
- safeguards for data, civic-space, accessibility, and low-bandwidth use.

---

## Required Spec Integration Process for Codex

Before implementation, Codex should produce a **Spec Integration Audit**.

The audit should compare these phase files against:

- current repo routes;
- current components;
- current schemas/data models;
- workflow states and gates;
- permissions and roles;
- learner runtime behavior;
- review and publishing behavior;
- analytics and monitoring behavior;
- existing tests.

The audit should identify:

- already implemented requirements;
- partially implemented requirements;
- missing requirements;
- conflicting requirements;
- risky changes;
- files likely affected;
- proposed implementation sequence;
- acceptance criteria;
- verification and evidence pack requirements.

---

## Implementation Rule

Codex must not blindly overwrite existing implementation.

Codex should:

1. read this index and the five phase files;
2. read the existing repo specifications;
3. inspect the current implementation;
4. produce a Spec Integration Audit;
5. propose a phased implementation plan;
6. wait for approval before coding;
7. implement in small, testable slices;
8. provide evidence after each implementation slice.

---

## Evidence Pack Requirement

For each implementation slice, Codex should provide:

- changed files list;
- routes affected;
- schema/data model changes;
- workflow/state changes;
- tests added or updated;
- tests run and results;
- screenshots or local URLs for key pages where relevant;
- known gaps or risks;
- manual verification checklist;
- next recommended implementation step.

---

## Recommended Repo Location

These files should be stored at:

```text
docs/specs/core-workflow/
```

Recommended final file structure:

```text
docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md
docs/specs/core-workflow/01_ANALYSIS_PHASE.md
docs/specs/core-workflow/02_DESIGN_PHASE.md
docs/specs/core-workflow/03_BUILD_PHASE.md
docs/specs/core-workflow/04_REVIEW_AND_PUBLISH_PHASE.md
docs/specs/core-workflow/05_MONITORING_AND_EVALUATION_PHASE.md
```

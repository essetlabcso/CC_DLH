# DEC Learning Hub Phase 1 — Refined Core Workflow Specification Index

## Purpose

This folder contains the latest refined operational workflow specifications for the DEC Learning Hub Course Creator Portal. These files should be treated as the detailed workflow, governance, and cross-cutting product-behavior layer for implementing, testing, and reviewing the Course Creator Portal in Phase 1.

The core workflow files refine and operationalize the existing repository specifications:

- `DEC_Learning_Hub_Phase1_Core_Workflow_Overriding_Specification_REGENERATED.md`
- `spec_dec_learning_hub.md`
- the revised developer-facing implementation description
- the approved annexes and later DEC-approved product decisions

They should not be applied by blindly overwriting the existing implementation. Codex should first compare these files against the current repo, identify gaps and conflicts, and then implement changes through a phased, testable plan.

---

## Source Hierarchy

Use the following hierarchy when interpreting requirements:

1. **Later explicit DEC-approved decisions and dedicated cross-cutting specifications in this folder are binding for their defined scope.** This includes `06_ADMIN_ROLE_AND_EXPERIENCE_SPECIFICATION.md` for Admin role and Admin experience behavior.
2. **The refined phase files in this folder are the newest detailed operational workflow layer** for the Course Creator Portal.
3. **The revised developer-facing implementation description provides the integrated product intent and workflow behavior.**
4. **`DEC_Learning_Hub_Phase1_Core_Workflow_Overriding_Specification_REGENERATED.md` remains a consolidated source of truth** for overall Phase 1 core workflow principles, scope, and acceptance logic where it does not conflict with later approved decisions.
5. **`spec_dec_learning_hub.md` remains the broader product implementation specification** for the DEC Learning Hub Phase 1 platform where it does not conflict with later approved decisions.
6. **Existing working implementation should be preserved where it already satisfies these specifications.**
7. If there is a conflict, Codex should document it in a Spec Integration Audit before changing code and should follow the highest-priority applicable source.

---

## Core Workflow and Cross-Cutting Specification Files

| Area | File | Main purpose |
|---|---|---|
| Index | `00_CORE_WORKFLOW_INDEX.md` | Defines how the core workflow specification package should be read, integrated, and used by Codex or developers. |
| Phase 1 | `01_ANALYSIS_PHASE.md` | Defines evidence intake, CSO capacity diagnosis, baseline, root-cause analysis, K/S/M/E routing, and Analysis-to-Design handover. |
| Phase 2 | `02_DESIGN_PHASE.md` | Defines action mapping, learning design document, storyboard, scenario/practice planning, and Design-to-Build handover. |
| Phase 3 | `03_BUILD_PHASE.md` | Defines governed but flexible block-based course building, full left-side block library, AI-assisted drafting, final test, certificate logic, practical proof, and verified achievement. |
| Phase 4 | `04_REVIEW_AND_PUBLISH_PHASE.md` | Defines quality review, role-sensitive publishing, final test/certificate validation, practical achievement validation, safeguarding/accessibility checks, and version control. |
| Phase 5 | `05_MONITORING_AND_EVALUATION_PHASE.md` | Defines learner progress tracking, final test analytics, certificate registry, practical proof review, verified achievement tracking, dashboards, and course improvement loops. |
| Cross-cutting Admin | `06_ADMIN_ROLE_AND_EXPERIENCE_SPECIFICATION.md` | Defines the approved Phase 1 Admin role model and Admin UX, including Super Admin, Platform Admin, Admin dashboard, users/roles, learner management, organizations, lookup/reference data, workflow oversight, Review/Publish queues, certificates, proof/badges, data safety, monitoring, and Admin audit expectations. |

---

## Admin Specification Status

`06_ADMIN_ROLE_AND_EXPERIENCE_SPECIFICATION.md` is the approved Phase 1 source of truth for Admin role and Admin experience behavior.

It is authoritative for:

- the two-level Admin model: Super Admin and Platform Admin;
- the rule that only Super Admin can create, approve, suspend, or remove Platform Admins;
- the Phase 1 simplification that all Platform Admins can publish after Review approval;
- direct Platform Admin management of learners/participants;
- direct Platform Admin management of lookup/reference tables, with audit logging and safe deactivation instead of unsafe deletion;
- the rule that Platform Admins cannot silently bypass workflow gates;
- Admin dashboard and Admin navigation expectations;
- Admin oversight of users, organizations, programs/cohorts, workflow status, Review Queue, Publish Queue, certificates, practical proof, badges, data safety, monitoring, and audit logs.

This file does not replace the phase files. It defines the Admin-facing governance, configuration, and oversight layer that cuts across all phases.

---

## Core Workflow Chain

The DEC Learning Hub Course Creator Portal should preserve the full traceability chain:

```text
Analysis evidence
→ capacity gap
→ baseline
→ root cause
→ K/S/M/E route
→ course-fit decision
→ capacity map
→ action map
→ learning design
→ storyboard
→ governed flexible block build
→ final test
→ certificate
→ optional practical proof
→ verified achievement / badge
→ review
→ publish
→ learner runtime
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
| Motivation gap | Should not drive Phase 1 course production by itself; route outside the course workflow or record for future/complementary support unless a separable Knowledge/Skill component is explicitly identified. |
| Environment gap | Should not drive Phase 1 course production by itself; route outside the course workflow or record for future/complementary support unless a separable Knowledge/Skill component is explicitly identified. |
| Mixed gap | Build only the clear Knowledge/Skill component if separable; route Motivation/Environment components outside Phase 1 or to complementary support. |

---

## Binding Certificate and Recognition Rules

The correct Phase 1 certificate rule is:

```text
Final test score of 80% or above = course pass and automated course certificate.
```

Practical proof, verified achievements, and badges are separate from certificates.

| Recognition type | Basis | Required for course certificate? |
|---|---|---|
| Course certificate | Final test score of 80% or above | Yes, final test score only |
| Practical proof | Learner/CSO submits evidence of application | No |
| Verified achievement / badge | Practical proof is reviewed and accepted by an authorized human verifier | No |

Any older wording suggesting a 90% certificate threshold, 80% pass / 90% certificate split, or certificate dependency on practical proof is superseded.

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
- final test logic: **80%+ final test score triggers automated certificate**;
- practical proof submission as an optional/separate applied-evidence pathway where enabled;
- verified achievement or badge recognition linked to CSO capacity indicators or standards after human proof review;
- learner preview;
- safeguards for data, civic-space, accessibility, and low-bandwidth use.

---

## Admin Phase 1 Implementation Principles

When implementing Admin-related work, Codex should follow these Phase 1 simplification principles:

1. Preserve the existing Admin foundation where it already works.
2. Add or clarify Super Admin authority only for Platform Admin creation/approval/suspension/removal.
3. Treat Platform Admin as the broad day-to-day operational Admin role.
4. Allow all Platform Admins to publish only after Review approval and publish readiness checks.
5. Allow Platform Admins to manage learners/participants directly using simple access controls.
6. Allow Platform Admins to manage lookup/reference tables directly, with audit logging and safe deactivation of used values.
7. Do not add a broad workflow gate override in Phase 1.
8. Require reasons and audit logging for sensitive Admin actions.
9. Keep raw proof private by default and prevent unsafe external visibility.
10. Avoid overbuilding granular Admin permission sets until DEC explicitly needs them.

---

## Required Spec Integration Process for Codex

Before implementation, Codex should produce a **Spec Integration Audit**.

The audit should compare these specification files against:

- current repo routes;
- current components;
- current schemas/data models;
- workflow states and gates;
- permissions and roles;
- learner runtime behavior;
- review and publishing behavior;
- Admin dashboard and Admin UX behavior;
- reference data and lookup behavior;
- certificate, practical proof, badge, data safety, and monitoring behavior;
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

1. read this index and the core workflow specification files;
2. read the existing repo specifications and relevant annexes;
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
- role/permission changes;
- tests added or updated;
- tests run and results;
- screenshots or local URLs for key pages where relevant;
- known gaps or risks;
- manual verification checklist;
- next recommended implementation step.

For Admin-related slices, the evidence pack should also confirm:

- Super Admin vs Platform Admin behavior;
- whether Platform Admin can/cannot create other Platform Admins;
- whether Platform Admin publish remains limited to Approved-for-Publish courses;
- whether learner/participant management behavior is preserved or improved;
- whether lookup/reference table changes are logged and safe;
- whether workflow gates are not silently bypassed;
- whether raw proof remains private by default;
- whether the 80% certificate rule remains unchanged.

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
docs/specs/core-workflow/06_ADMIN_ROLE_AND_EXPERIENCE_SPECIFICATION.md
```

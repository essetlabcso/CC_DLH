# Codex Prompt 01 — Repo Audit and Readiness

## Purpose

Use this prompt as the first Codex task after placing the Course Creator release specification package in the repo.

This prompt asks Codex to audit only. Codex must not implement or change code yet.

---

## Prompt to Codex

You are working in the DEC CSO Learning Hub repo.

Before making any code changes, read the full Course Creator release package under:

```text
docs/specs/course-creator-release/
```

Start with:

```text
docs/specs/course-creator-release/00_COURSE_CREATOR_RELEASE_INDEX.md
```

Then read the rest in this order:

```text
01_COURSE_CREATOR_RELEASE_SPECIFICATION.md
03_WORKFLOW_GATES_STATES_AND_RECORDS.md
02_SCREEN_AND_ROUTE_SPECIFICATION.md
04_BUILD_STUDIO_SUITE_SPECIFICATION.md
06_ROLE_PERMISSION_AND_SAFETY_RULES.md
05_UI_DESIGN_SYSTEM_AND_LAYOUT_RULES.md
08_ACCEPTANCE_CRITERIA_AND_QA_CHECKLIST.md
09_RELEASE_DEMO_DATA_AND_EXAMPLE_COURSE.md
07_CODEX_IMPLEMENTATION_GUIDE.md
SKILL.md
```

## Task

Audit the current repo against the Course Creator Portal MVP release requirements.

Do not implement yet. Do not edit files. Do not run migrations. Do not create new routes. Do not change schema.

## Audit focus

Please inspect and report on:

1. Current app architecture.
2. Existing route structure.
3. Existing auth/session/role logic.
4. Existing creator-facing routes, if any.
5. Existing admin/reviewer/publish routes.
6. Existing Prisma schema and relevant models.
7. Existing seed/demo data.
8. Existing UI components that can be reused.
9. Existing workflow state/status handling.
10. Existing review and publish logic.
11. Existing monitoring/dashboard logic.
12. Existing tests/check scripts.
13. Gaps against the Course Creator MVP.
14. Risks and unknowns.
15. Proposed implementation sequence.

## Binding rules to preserve

Confirm whether the current repo already supports, partially supports, or lacks each of these:

```text
Evidence-first course creation
K/S/M/E routing
Motivation/Environment-only blocking
Analysis lock
Capacity Map
Action Map
Learning Design
Storyboard / Block Plan
Governed Build Studio
AI draft-only support
80% certificate rule
Practical Proof separate from certificate
Review and Publish separation
Creator cannot publish by default
Raw proof private by default
Version-aware Monitoring
```

## Required output format

Return the audit in this structure:

```markdown
# Course Creator Portal Repo Audit and Readiness Report

## 1. Executive Summary
Briefly state the current readiness level and the safest next step.

## 2. Current Repo Architecture
Summarize framework, route structure, data layer, auth/session, and UI patterns observed.

## 3. Relevant Existing Files and Routes
| Area | Existing file/route | Notes |
|---|---|---|

## 4. Existing Data Models and Schema Readiness
| Model / enum / field | Relevant to MVP? | Reuse / gap / risk |
|---|---|---|

## 5. Existing Role and Permission Readiness
| Role / guard | Current behavior | MVP need | Gap |
|---|---|---|---|

## 6. Existing Workflow / Gate Readiness
| MVP gate | Current support | Gap |
|---|---|---|

## 7. Existing UI Component Reuse Opportunities
| Component / pattern | Can reuse for | Notes |
|---|---|---|

## 8. Gap Matrix Against MVP
| MVP requirement | Current status | Severity | Recommended action |
|---|---|---|---|

## 9. Binding Rule Risk Check
| Binding rule | Supported? | Risk | Recommendation |
|---|---|---|---|

## 10. Tests and Verification Available
List package scripts and any relevant test files.

## 11. Recommended Implementation Sequence
Propose safe implementation slices, starting with the smallest useful slice.

## 12. Risks / Decisions Needed
List questions or decisions for ESSET/DEC before coding.

## 13. Next Smallest Safe Step
Recommend exactly one next step.
```

## Important constraints

- Do not implement.
- Do not edit files.
- Do not change schema.
- Do not create migrations.
- Do not remove existing functionality.
- Do not replace existing working admin/reviewer/publish logic.
- Be precise and file-path specific.
- Focus on implementation readiness, not generic advice.

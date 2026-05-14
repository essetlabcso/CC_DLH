# Codex Prompt 02 — Implementation Plan After Repo Audit

## Purpose

Use this prompt after Codex completes the repo audit and ESSET/DEC has reviewed the audit.

This prompt asks Codex to prepare a plan only. Codex must not implement yet.

---

## Prompt to Codex

You have completed the Course Creator Portal repo audit.

Now prepare a plan-first implementation roadmap for the Course Creator Portal MVP using the release package under:

```text
docs/specs/course-creator-release/
```

Before planning, re-read:

```text
00_COURSE_CREATOR_RELEASE_INDEX.md
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

Prepare an implementation plan only.

Do not implement. Do not edit files. Do not run migrations. Do not change schema.

## Planning goal

Create a safe, incremental roadmap that will deliver the MVP workflow:

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

## Required implementation slices

Use or adapt this sequence based on the repo audit:

```text
Slice 1 — Creator shell, navigation, dashboard, course workspace
Slice 2 — Setup + Analysis Gate
Slice 3 — Capacity Map + Action Map
Slice 4 — Learning Design + Storyboard
Slice 5 — Build Studio Suite
Slice 6 — Final Test + Certificate + Practical Proof
Slice 7 — Preview + Review Submission + Revision
Slice 8 — Publish handoff + Monitoring
Slice 9 — End-to-end QA and demo readiness
```

If the audit shows an even safer sequence, propose it clearly and explain why.

## Required output format

Return the plan in this structure:

```markdown
# Course Creator Portal MVP Implementation Plan

## 1. Plan Summary
Short explanation of the implementation strategy and why this sequence is safe.

## 2. Assumptions From Repo Audit
List assumptions based on actual repo findings.

## 3. Out of Scope for This MVP
List future features that will not be implemented now.

## 4. Implementation Slices

### Slice 1 — [Name]
- Goal:
- User value:
- Routes/screens affected:
- Files likely to change:
- Data/schema impact:
- Role/permission impact:
- Workflow/gate impact:
- UI/component impact:
- Acceptance criteria:
- Tests/checks to run:
- Manual verification steps:
- Risks:
- Dependencies:

Repeat for each slice.

## 5. Proposed Data / Schema Changes
Only include changes that are necessary. For each:
| Proposed change | Why needed | Existing alternative considered | Risk |
|---|---|---|---|

## 6. Role and Permission Plan
Explain how Creator, Reviewer, and Admin/Publisher boundaries will be preserved.

## 7. Gate Logic Plan
Explain how each gate will be enforced.

## 8. Demo Data Plan
Explain how the Outcome Evidence for CSO MEAL demo course will be seeded or represented.

## 9. Testing and Verification Plan
List commands and manual UAT steps.

## 10. Binding Rule Preservation Plan
Confirm how the plan preserves:
- 80% certificate rule
- Practical Proof separate from certificate
- Review/Publish separation
- AI draft-only behavior
- Raw proof privacy
- K/S/M/E routing
- Governed Build Studio
- Version-aware Monitoring

## 11. Risks / Decisions Needed Before Coding
List anything needing ESSET/DEC approval.

## 12. First Slice to Implement After Approval
State the first implementation slice and why it is the safest start.
```

## Important constraints

- Do not implement yet.
- Do not edit files.
- Do not change schema.
- Do not run migrations.
- Do not overbuild future features.
- Keep the plan practical for a non-technical project lead to review.
- Use exact file paths and route paths wherever possible.

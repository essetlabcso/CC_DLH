# 07 — Codex Implementation Guide

## 1. Purpose

This file tells Codex how to audit, plan, implement, and report work on the DEC CSO Learning Hub Course Creator Portal MVP.

Codex must not begin by coding. It must first audit the repo, then propose an implementation plan, then wait for approval before implementing.

## 2. Required first instruction to Codex

Use this at the start of the first Codex prompt:

```text
Before making any code changes, read the full Course Creator release package under docs/specs/course-creator-release/. Start with 00_COURSE_CREATOR_RELEASE_INDEX.md. Then audit the current repo against the MVP release requirements. Do not implement yet. Return a repo audit, gap matrix, risks, and proposed implementation sequence.
```

## 3. Implementation posture

Codex should:

- use existing Next.js/App Router structure where possible;
- use existing auth/session/role logic where possible;
- use existing Prisma models where possible;
- preserve existing admin/reviewer/publish foundations where they satisfy the release logic;
- add only necessary schema changes;
- keep implementation incremental;
- avoid broad rewrites;
- avoid overbuilding future features;
- keep demo data stable and traceable;
- provide an evidence pack after each slice.

## 4. What Codex must preserve

Codex must preserve:

- evidence-first course creation;
- K/S/M/E routing;
- Analysis lock before Design;
- phase gates and records;
- governed flexible Build Studio;
- AI draft-only behavior;
- human review of AI output;
- fixed 80% certificate rule;
- separation of certificate and Practical Proof;
- human review for verified achievement;
- Review/Publish separation;
- raw proof privacy;
- version-aware monitoring;
- DEC visual direction and creator UI.

## 5. What Codex must not do without approval

Codex must not:

- replace workflow with generic LMS patterns;
- remove gates to simplify implementation;
- make creator publish courses by default;
- implement 90% certificate threshold;
- require practical proof for certificate;
- let AI approve/publish/verify/award;
- expose raw proof in dashboards;
- add complex donor-facing portal;
- add complex adaptive learning engine;
- add large schema migrations unrelated to current slice;
- delete existing working admin/reviewer/publish logic without explicit reason.

## 6. First Codex task: repo audit and readiness

The first Codex task must produce:

```text
1. Current repo summary
2. Existing relevant routes
3. Existing creator/admin/reviewer routes
4. Existing auth/session/role logic
5. Existing Prisma models related to courses/workflow/users
6. Existing seed/demo data
7. Existing UI components usable for creator portal
8. Existing review/publish logic
9. Existing monitoring/dashboard logic
10. Gap matrix against Course Creator MVP
11. Risks and unknowns
12. Recommended implementation sequence
13. Files likely to change
14. Schema changes likely needed
15. Tests/checks available
16. Next smallest safe implementation slice
```

The audit must not modify code.

## 7. Second Codex task: implementation plan

After the audit is reviewed, ask Codex for a plan-first implementation roadmap.

The plan should include:

- slice sequence;
- exact goal of each slice;
- routes affected;
- data/model changes;
- UI components to build/reuse;
- role/permission checks;
- gate logic to implement;
- tests/checks;
- acceptance criteria;
- risks.

Codex must wait for approval before coding.

## 8. Recommended implementation slices

### Slice 1 — Repo audit and readiness

No code changes.

Output: audit, gap matrix, implementation sequence.

### Slice 2 — Creator shell, navigation, dashboard, course workspace

Goal:

- implement/align creator app shell;
- dashboard;
- course cards;
- course workspace entry;
- status display;
- next-action logic.

### Slice 3 — Setup + Analysis Gate

Goal:

- Course Setup;
- Analysis / Diagnosis;
- K/S/M/E routing;
- Analysis lock;
- blocked Motivation/Environment-only logic;
- locked Analysis summary.

### Slice 4 — Capacity Map + Action Map

Goal:

- Capacity Map screen;
- taxonomy/indicator fields;
- capacity objective;
- course boundary;
- Action Map table;
- observable actions;
- practice and assessment links.

### Slice 5 — Learning Design + Storyboard

Goal:

- Learning Design Document;
- Design lock;
- Storyboard and Block Plan;
- generate/open Build Studio draft.

### Slice 6 — Build Studio Suite

Goal:

- three-panel Build Studio;
- block library;
- course canvas;
- block properties;
- required/creator-added block logic;
- AI draft log placeholder.

### Slice 7 — Final Test + Certificate + Practical Proof

Goal:

- Final Test configuration;
- fixed 80% certificate rule;
- Practical Proof configuration;
- proof privacy guidance;
- verified achievement placeholder if needed.

### Slice 8 — Preview + Review Submission + Revision

Goal:

- learner preview;
- readiness checklist;
- Build-to-Review handover;
- submit for Review;
- returned comments;
- revision workflow;
- resubmission.

### Slice 9 — Publish handoff + Monitoring

Goal:

- approved-for-publish queue or integration with existing admin publish;
- Admin/Publisher publish action;
- Published Course Record/state;
- monitoring dashboard with safe, version-aware metrics.

### Slice 10 — End-to-end QA and demo readiness

Goal:

- complete UAT script;
- seed/demo data;
- role tests;
- route smoke tests;
- evidence pack;
- known gaps.

## 9. Evidence pack requirement

After every implementation slice, Codex must provide:

```text
# Codex Implementation Evidence Pack

## 1. Implementation Slice
- Slice name:
- Date:
- Branch / working context:
- Prompt/task summary:
- Scope implemented:
- Out of scope:

## 2. Plain-Language Product Summary
Briefly explain what changed in user-facing terms.

## 3. DEC Workflow Alignment
Explain how the change supports:
Analysis → Design → Build → Review → Publish → Learner Runtime → Certificate → Practical Proof → Verified Achievement → Monitoring.

## 4. Files Changed
| File | Change type | Why changed |
|---|---|---|

## 5. Routes / Screens Affected
| Route / screen | Change made | User role affected |
|---|---|---|

## 6. Data / Schema / Migration Changes
- Schema changes:
- Migration files:
- New fields:
- Changed enums/statuses:
- Data backfill needed:
- Rollback considerations:

## 7. Workflow State / Gate Changes
- States added/changed:
- Gate behavior changed:
- Records created/updated:
- Return paths affected:
- Lock/unlock behavior affected:

## 8. Role and Permission Changes
| Role | New/changed permission | Expected behavior |
|---|---|---|

## 9. Binding Rule Checks
Confirm:
- 80%+ final test score still triggers certificate:
- Practical proof remains separate from certificate:
- Review and Publish remain separate:
- Build Studio remains governed, not blank-canvas:
- Raw proof remains private by default:
- AI outputs require human review:

## 10. Tests and Verification
| Check | Command / method | Result |
|---|---|---|

## 11. Manual Verification Steps
Step-by-step instructions for human reviewer.

## 12. Screenshots / URLs / Evidence
- Local URLs:
- Screenshot paths:
- Terminal log summary:
- Test output summary:

## 13. Acceptance Criteria Results
| Acceptance criterion | Status | Evidence |
|---|---|---|

## 14. Known Gaps / Limitations
List what remains incomplete or intentionally deferred.

## 15. Risks / Decisions Needed
List anything needing ESSET/DEC approval.

## 16. Next Smallest Safe Step
Recommend exactly one next step.
```

## 10. Testing expectations

Codex should run available checks such as:

```text
npm run typecheck
npm run lint
npm test
npm run build
npx prisma validate
npx prisma generate
```

Only run commands that exist in the repo. If a command does not exist, document that clearly.

## 11. Manual verification expectations

For each slice, Codex must include manual verification steps such as:

- route to open;
- role to sign in as;
- sample course to use;
- expected state;
- expected button behavior;
- expected blocked behavior;
- expected UI warning;
- expected data/state outcome.

## 12. Schema change guidance

Codex should avoid unnecessary broad schema changes.

Before schema changes, Codex should explain:

- what model/field is needed;
- which MVP requirement it supports;
- whether existing model can be reused;
- migration impact;
- seed data impact;
- rollback consideration.

## 13. Demo data guidance

Use one consistent example course:

```text
Outcome Evidence for CSO MEAL
```

All demo data should remain traceable to:

- MEAL capacity area;
- outcome evidence gap;
- Skill + Knowledge route;
- 80% certificate rule;
- optional practical proof;
- safe monitoring summary.

## 14. Final implementation success

Codex work is successful when:

```text
[ ] Creator workflow works end to end.
[ ] Gates block unsafe/invalid progression.
[ ] Build Studio is governed and usable.
[ ] Final Test uses fixed 80% certificate rule.
[ ] Practical Proof is separate and private by default.
[ ] Review and Publish are separate.
[ ] Monitoring is version-aware and safe.
[ ] UI aligns with Course Creator visual direction.
[ ] Evidence pack is complete.
```

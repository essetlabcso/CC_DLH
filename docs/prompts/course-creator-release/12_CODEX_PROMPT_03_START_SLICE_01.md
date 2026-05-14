# Codex Prompt 03 — Start Implementation Slice 1

## Purpose

Use this prompt only after ESSET/DEC approves the implementation plan.

This starts the first implementation slice. Adjust the slice name if the approved plan uses a different first slice.

---

## Prompt to Codex

Proceed with the approved implementation plan for the Course Creator Portal MVP.

Start with:

```text
Slice 1 — Creator shell, navigation, dashboard, course workspace
```

Follow the release package under:

```text
docs/specs/course-creator-release/
```

## Slice 1 goal

Implement the foundational Course Creator portal shell and dashboard/workspace entry so that a Course Creator can:

```text
Sign in
→ land on Creator Dashboard
→ see owned/assigned courses
→ see workflow status and next action
→ start/open a course
→ enter the course workspace
```

This slice should create the stable UI/navigation foundation for later Setup, Analysis, Design, Build, Review, Publish, and Monitoring screens.

## Scope

Implement only what belongs to Slice 1.

Suggested scope:

- creator route shell;
- top app bar;
- left sidebar;
- dashboard page;
- course cards/table;
- workflow status chips;
- next action display;
- course workspace overview or entry route;
- demo course card using Outcome Evidence for CSO MEAL;
- role-aware access guard using existing auth/role pattern;
- no publish action for creator.

## Out of scope for this slice

Do not implement yet:

- full Setup form;
- full Analysis Gate;
- K/S/M/E validation logic beyond status display if needed;
- Capacity Map;
- Action Map;
- Learning Design;
- Storyboard;
- Build Studio;
- Final Test;
- Practical Proof;
- Review submission;
- Publish logic;
- Monitoring dashboard;
- complex schema changes unless the approved plan explicitly requires minimal changes.

## Binding rules for this slice

Even in Slice 1, preserve:

```text
Creator cannot publish by default.
Dashboard must be workflow-first, not decorative only.
Course state/next action must be visible.
Do not create generic LMS shortcuts.
Do not bypass Analysis/Review/Publish gates.
Use the Outcome Evidence for CSO MEAL demo course consistently.
```

## Required evidence pack

After implementation, return the full evidence pack:

```markdown
# Codex Implementation Evidence Pack

## 1. Implementation Slice
- Slice name:
- Date:
- Branch / working context:
- Prompt/task summary:
- Scope implemented:
- Out of scope:

## 2. Plain-Language Product Summary

## 3. DEC Workflow Alignment

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
- Creator cannot publish by default:
- Dashboard remains workflow-first:
- Course state and next action are visible:
- No generic LMS bypass introduced:
- Analysis/Review/Publish gates not bypassed:

## 10. Tests and Verification
| Check | Command / method | Result |
|---|---|---|

## 11. Manual Verification Steps

## 12. Screenshots / URLs / Evidence

## 13. Acceptance Criteria Results
| Acceptance criterion | Status | Evidence |
|---|---|---|

## 14. Known Gaps / Limitations

## 15. Risks / Decisions Needed

## 16. Next Smallest Safe Step
```

## Testing

Run available checks only. For example:

```text
npm run typecheck
npm run lint
npm run build
```

If a command does not exist, document that clearly.

## Manual verification minimum

Include steps for ESSET/DEC to verify:

```text
1. Sign in as Course Creator.
2. Open /creator.
3. Confirm dashboard loads.
4. Confirm Outcome Evidence for CSO MEAL appears.
5. Confirm course status and next action appear.
6. Confirm creator does not see publish action.
7. Open course workspace.
8. Confirm navigation shell and workflow direction are clear.
```

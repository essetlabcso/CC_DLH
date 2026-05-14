# Codex Prompt 04 — Next Slice Template

## Purpose

Use this template for each later implementation slice after reviewing the previous Codex evidence pack.

Replace bracketed text before sending to Codex.

---

## Prompt to Codex

Proceed with the next approved implementation slice for the Course Creator Portal MVP.

## Slice

```text
[Slice number and name]
```

## Goal

```text
[Clear product goal for this slice]
```

## Source references

Before implementing, re-read the relevant files under:

```text
docs/specs/course-creator-release/
```

Required for every slice:

```text
00_COURSE_CREATOR_RELEASE_INDEX.md
01_COURSE_CREATOR_RELEASE_SPECIFICATION.md
03_WORKFLOW_GATES_STATES_AND_RECORDS.md
08_ACCEPTANCE_CRITERIA_AND_QA_CHECKLIST.md
SKILL.md
```

Also read these slice-specific files:

```text
[Add relevant files, e.g. 02_SCREEN_AND_ROUTE_SPECIFICATION.md, 04_BUILD_STUDIO_SUITE_SPECIFICATION.md, 06_ROLE_PERMISSION_AND_SAFETY_RULES.md, etc.]
```

## Scope

Implement:

```text
[Bullet list of exact features/screens/routes]
```

## Out of scope

Do not implement:

```text
[Bullet list of future or later-slice items]
```

## Binding rules for this slice

Preserve:

```text
[Select relevant binding rules]
```

Core binding rules that should always remain true:

```text
80% certificate rule must not change.
Practical Proof remains separate from certificate.
Review and Publish remain separate.
Creator cannot publish by default.
AI remains draft-only.
Raw proof remains private by default.
K/S/M/E routing must not be bypassed.
Build Studio must remain governed, not blank-canvas.
```

## Acceptance criteria

This slice is complete only when:

```text
[Checklist of exact acceptance criteria]
```

## Testing

Run available checks:

```text
[Commands agreed from repo audit, e.g. npm run lint, npm run build, npm run typecheck]
```

If a command is unavailable or fails due to pre-existing issues, document it clearly.

## Evidence pack required

After implementation, return the full evidence pack:

```text
1. Slice name
2. Plain-language product summary
3. Files changed
4. Routes/screens affected
5. Data/schema changes
6. Role/permission changes
7. Workflow/gate changes
8. Binding rule checks
9. Tests/checks run
10. Manual verification steps
11. Screenshots/URLs/evidence
12. Acceptance criteria results
13. Known gaps
14. Risks/decisions needed
15. Next smallest safe step
```

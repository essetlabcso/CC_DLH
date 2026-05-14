# Codex Prompt Package README

## Purpose

This folder contains the recommended Codex prompts for implementing the DEC CSO Learning Hub Course Creator Portal MVP after the repo-ready release specification files are placed in the repo.

## Prompt sequence

Use the prompts in this order:

```text
10_CODEX_PROMPT_01_REPO_AUDIT_AND_READINESS.md
11_CODEX_PROMPT_02_IMPLEMENTATION_PLAN.md
12_CODEX_PROMPT_03_START_SLICE_01.md
13_CODEX_PROMPT_04_NEXT_SLICE_TEMPLATE.md
```

## Workflow

### 1. Add release specs to repo

Place the Course Creator release package here:

```text
docs/specs/course-creator-release/
```

Include:

```text
00_COURSE_CREATOR_RELEASE_INDEX.md
01_COURSE_CREATOR_RELEASE_SPECIFICATION.md
02_SCREEN_AND_ROUTE_SPECIFICATION.md
03_WORKFLOW_GATES_STATES_AND_RECORDS.md
04_BUILD_STUDIO_SUITE_SPECIFICATION.md
05_UI_DESIGN_SYSTEM_AND_LAYOUT_RULES.md
06_ROLE_PERMISSION_AND_SAFETY_RULES.md
07_CODEX_IMPLEMENTATION_GUIDE.md
08_ACCEPTANCE_CRITERIA_AND_QA_CHECKLIST.md
09_RELEASE_DEMO_DATA_AND_EXAMPLE_COURSE.md
SKILL.md
```

### 2. Ask Codex for repo audit only

Use:

```text
10_CODEX_PROMPT_01_REPO_AUDIT_AND_READINESS.md
```

Codex should not edit files.

### 3. Review the audit

Check:

- existing routes;
- schema readiness;
- auth/role readiness;
- review/publish readiness;
- monitoring readiness;
- risks;
- recommended implementation sequence.

### 4. Ask Codex for implementation plan only

Use:

```text
11_CODEX_PROMPT_02_IMPLEMENTATION_PLAN.md
```

Codex should not edit files.

### 5. Approve or revise the plan

Only after the plan is acceptable, proceed to implementation.

### 6. Start Slice 1

Use:

```text
12_CODEX_PROMPT_03_START_SLICE_01.md
```

### 7. Continue slice by slice

Use:

```text
13_CODEX_PROMPT_04_NEXT_SLICE_TEMPLATE.md
```

Customize it for each next slice.

## Important rule

Do not ask Codex to build the whole Course Creator Portal in one prompt.

Use this sequence:

```text
Repo audit
→ implementation plan
→ approved slice 1
→ evidence pack review
→ next slice
```

## Binding rules to check after every slice

```text
80%+ final test score triggers certificate.
Practical Proof remains separate from certificate.
Review and Publish remain separate.
Creator cannot publish by default.
AI outputs require human review.
Raw proof remains private by default.
K/S/M/E routing controls course eligibility.
Build Studio remains governed, not blank-canvas.
Monitoring remains version-aware and safe.
```

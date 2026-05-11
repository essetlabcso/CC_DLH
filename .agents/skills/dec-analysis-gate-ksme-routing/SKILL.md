---
name: dec-analysis-gate-ksme-routing
description: Use this skill when an AI coding agent is designing, implementing, auditing, or reviewing DEC Learning Hub Analysis Gate, K/S/M/E routing, course-fit decisions, evidence admissibility, Analysis-to-Design Handover, or Design unlock/block behavior. This skill is for evidence-first course creation decisions, not generic course ideation.
---

# DEC Analysis Gate K/S/M/E Routing Skill

## Purpose

Use this skill to keep the DEC Learning Hub Course Creator Portal evidence-first. The skill helps any AI coding agent preserve the rule that Phase 1 course creation starts from validated CSO capacity evidence and proceeds to course design only when the gap is Knowledge or Skill, or when a mixed Motivation/Environment gap has a clearly recorded separable Knowledge/Skill component.

This skill is intentionally narrow. It protects the Analysis Gate and the Analysis-to-Design Handover so later Course Creator screens, Action Map, Storyboard, Build Studio, AI authoring, Review, Publish, certificates, proof, and monitoring remain traceable to approved capacity evidence.

## When to use

Use this skill for work involving any of the following:

- Analysis Gate implementation or audit.
- K/S/M/E classification logic.
- Course-fit decision rules.
- Motivation-only or Environment-only blocking behavior.
- Mixed-gap handling and separable Knowledge/Skill components.
- Analysis-to-Design Handover records.
- Analysis lock / unlock / return behavior.
- Design unlock conditions that depend on Analysis Gate status.
- Course Creator dashboard status labels related to Analysis.
- Admin or reviewer checks for Analysis readiness.
- Tests, fixtures, seed examples, or acceptance criteria for course-fit routing.

## When not to use

Do not use this skill for:

- Generic eLearning topic brainstorming without validated evidence.
- Build Studio block authoring after Design-to-Build Handover.
- AI drafting of lesson content, except to check that AI does not invent Analysis evidence.
- Final test scoring, certificate issuance, proof verification, badge awarding, or monitoring dashboards except where they need traceability back to Analysis.
- Publishing or release decisions.
- Motivation/Environment support design such as coaching, grants, leadership engagement, or systems strengthening, except to record that these are routed outside Phase 1 course production.

## Required context before acting

Before changing files or recommending implementation, inspect the closest available project guidance and relevant specs, especially:

1. Root or nearest `.agents/AGENTS.md`, if present.
2. `docs/specs/core-workflow/` source-of-truth files, if present.
3. Revised developer-facing Course Creator Portal description.
4. Annex 1: Source-of-Truth and Override Note.
5. Annex 3: Workflow State, Gate, and Record Matrix.
6. Annex 4: CSO Capacity Taxonomy and Indicator Mapping.
7. Annex 5: K/S/M/E Routing and Course-Fit Decision Rules.
8. Annex 7: AI Authoring Guardrails and Review Log.
9. Annex 12: Data Safety, Consent, and Visibility Rules.
10. Annex 13: Codex / AI Coding Agent Evidence Pack Template.
11. Current repo routes, models, helpers, tests, and seed data relevant to Analysis and Design gates.

If the current repository conflicts with the latest DEC source-of-truth rules, do not silently implement the older behavior. Report the conflict and follow the latest explicit DEC decision unless the user asks for a compatibility plan.

## Core DEC binding rules

Always preserve these rules:

- The DEC Learning Hub is a governed, evidence-linked, AI-assisted CSO capacity-strengthening course creation system, not a generic LMS.
- Course creation starts from validated CSO capacity evidence, not from a blank course idea.
- Phase 1 courses normally address Knowledge and Skill gaps.
- Motivation and Environment gaps must not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly identified and recorded.
- Mixed gaps may proceed only for the clearly recorded Knowledge/Skill component; Motivation/Environment components must be routed or flagged for complementary support.
- If root cause is unclear, mark the case as needing further diagnosis instead of forcing course creation.
- Analysis-to-Design Handover must lock the approved evidence base before Design proceeds.
- Locked Analysis evidence should be read-only downstream unless formally returned/reopened through a traceable workflow.
- AI may clarify or rewrite provided Analysis wording but must not invent evidence, baseline, root cause, K/S/M/E route, course-fit decision, or target learner group.
- Review and Publish remain separate.
- 80%+ final test score triggers course certificate; practical proof and badges remain separate. Do not alter these downstream rules while working on Analysis.
- Raw proof and sensitive learner/CSO data remain private by default.

## Workflow steps

When using this skill, follow this sequence.

### 1. Confirm the task boundary

Identify whether the work is:

- planning only;
- documentation/skill work;
- code implementation;
- tests/fixtures;
- UI/UX alignment;
- audit/review.

If the task may affect route gates, schema, permissions, or existing learner runtime behavior, plan first and identify the smallest safe slice.

### 2. Locate the current Analysis model

Inspect the current implementation for:

- Analysis or diagnosis records;
- capacity gap fields;
- capacity taxonomy fields;
- baseline/current practice;
- desired practice;
- evidence source;
- root cause;
- K/S/M/E classification;
- course-fit decision;
- separable K/S component;
- safeguards/no-harm notes;
- evaluation anchor;
- handover status;
- lock/approval state;
- downstream Design unlock checks.

Do not assume these exist. Report gaps clearly.

### 3. Apply the K/S/M/E decision logic

Classify the gap using the following logic:

- Knowledge: learners lack required information, concepts, standards, distinctions, rules, or process awareness.
- Skill: learners may know the concept but cannot apply it in a practical task, tool, scenario, decision, or work output.
- Motivation: learners may know and be able to act but do not act because of confidence, incentives, leadership signals, culture, trust, fear, ownership, habits, or perceived value.
- Environment: learners are blocked by systems, policies, resources, time, staffing, devices, internet, funding, coordination structures, donor rules, legal/regulatory context, civic-space constraints, safeguarding risks, or other enabling-environment conditions.
- Mixed: more than one cause exists. Proceed only for the explicit K/S component.

### 4. Decide course-fit route

Use one of these decision outcomes:

- `course_addressable`: primarily Knowledge or Skill; Design may unlock after Analysis Handover is complete and locked.
- `partly_course_addressable`: mixed gap with explicit separable Knowledge/Skill component; Design may unlock only for the K/S component while M/E components are recorded for complementary support.
- `not_course_addressable`: Motivation or Environment only; Design remains blocked for Phase 1 course production.
- `needs_further_diagnosis`: root cause, evidence, target learner group, or course-fit decision is unclear.
- `specialist_review_required`: sensitive advocacy, safeguarding, civic-space, legal/compliance, or data-safety issues require review before unlock.

### 5. Preserve traceability

Every Analysis decision should be traceable to source evidence and should produce or update an Analysis-to-Design Handover with at least:

- course or draft ID;
- validated capacity gap;
- capacity area and sub-capacity;
- indicator/standard link where available;
- target learner group;
- baseline/current practice;
- desired practice;
- root cause summary;
- K/S/M/E route;
- course-fit decision;
- separable K/S component if mixed;
- Motivation/Environment components and routing note;
- evidence source summary;
- safeguards/no-harm note;
- evaluation anchor;
- approval/lock status;
- approved/locked by and timestamp where applicable.

### 6. Handle UI/UX implications

If the task touches frontend screens, make the routing decision visible and understandable:

- Show Analysis status and next action.
- Show K/S/M/E route badge or summary.
- Show why Design is unlocked, blocked, or needs diagnosis.
- Show read-only locked evidence downstream.
- Use plain language for non-technical CSO course creators.
- Avoid table-only/admin-heavy layouts for creator-facing screens.
- Do not expose sensitive raw evidence or proof in broad views.

### 7. Add or update tests

Where code changes affect behavior, include tests for at least:

- valid Knowledge gap unlocks Design after Analysis lock;
- valid Skill gap unlocks Design after Analysis lock;
- Motivation-only gap blocks course production;
- Environment-only gap blocks course production;
- mixed gap unlocks only when separable K/S component is recorded;
- unclear root cause returns `needs_further_diagnosis`;
- locked Analysis is read-only downstream;
- AI cannot change route or invent missing evidence.

### 8. Return evidence pack

For implementation tasks, return the standard DEC evidence pack. Include explicit confirmation that downstream certificate, practical proof, review/publish, learner runtime, and monitoring rules were not changed unless the task explicitly required it.

## Required output formats

### Planning or audit output

Return:

1. Task boundary.
2. Files/specs inspected.
3. Current implementation status.
4. K/S/M/E logic found or missing.
5. Gate/unlock behavior found or missing.
6. Risks and conflicts.
7. Recommended smallest safe implementation slice.
8. Acceptance criteria.
9. Tests to add or run.

### Implementation output

Return the standard DEC evidence pack, including:

1. Implementation slice.
2. Plain-language product summary.
3. DEC workflow alignment.
4. Files changed.
5. Routes/screens affected.
6. Data/schema/migration changes.
7. Workflow state/gate changes.
8. Role/permission changes.
9. Binding rule checks.
10. Tests and verification.
11. Manual verification steps.
12. Acceptance criteria results.
13. Known gaps.
14. Risks/decisions needed.
15. Next smallest safe step.

## Evidence requirements

Do not create or approve Analysis decisions without evidence. Every route decision should be supported by:

- source title or ID;
- source type;
- date or version where available;
- relevant excerpt or summarized finding;
- confidence level;
- privacy/sensitivity classification;
- whether the source is sufficient, partial, conflicting, or missing.

## Red flags

Stop and report if you see any of these:

- Course creation starts from a blank title or generic training request.
- Motivation/Environment gaps are converted into courses without separable K/S components.
- The system auto-unlocks Design without Analysis lock/approval.
- AI is allowed to decide the K/S/M/E route.
- Sensitive proof, safeguarding, civic-space, or beneficiary data is shown broadly.
- A downstream feature treats course completion as full organizational capacity transformation.
- Any change silently alters certificate, proof, Review/Publish, or learner runtime rules.

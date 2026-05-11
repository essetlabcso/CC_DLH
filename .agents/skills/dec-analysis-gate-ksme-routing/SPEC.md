# SPEC: DEC Analysis Gate K/S/M/E Routing Skill

## Purpose

This specification governs the `dec-analysis-gate-ksme-routing` skill. The skill exists to help any AI coding agent working on the DEC Learning Hub preserve the platform's evidence-first Course Creator workflow.

The skill must protect the Analysis Gate, K/S/M/E routing, course-fit decision, and Analysis-to-Design Handover so the Course Creator Portal does not become a generic eLearning topic builder.

## Scope

This skill applies to:

- Analysis / diagnosis phase.
- Capacity gap evidence readiness.
- K/S/M/E classification and routing.
- Course-fit decision rules.
- Separable Knowledge/Skill component logic.
- Analysis-to-Design Handover fields and locking behavior.
- Design unlock conditions that depend on Analysis Gate completion.
- Analysis-return behavior when Review identifies weak evidence or wrong route.
- Tests and acceptance criteria for Analysis Gate behavior.
- UI messages that explain Analysis status, blocked course-fit cases, or Design unlock conditions.

## Non-goals

This skill must not act as:

- a generic course ideation skill;
- a Build Studio block authoring skill;
- an AI lesson drafting skill;
- a certificate/proof/badge verification skill;
- a publish approval skill;
- a donor visibility decision skill;
- a substitute for human DEC approval of sensitive cases.

## Source-of-truth hierarchy

When sources conflict, AI coding agents should follow this hierarchy:

1. Explicit DEC decisions recorded in approved project prompts, current chat decisions, or later approved repo docs.
2. Revised developer-facing implementation description of the DEC Learning Hub Course Creator Portal.
3. Annex 1: Source-of-Truth and Override Note.
4. Annex 3: Workflow State, Gate, and Record Matrix.
5. Annex 4: CSO Capacity Taxonomy and Indicator Mapping.
6. Annex 5: K/S/M/E Routing and Course-Fit Decision Rules.
7. Annex 7: AI Authoring Guardrails and Review Log.
8. Annex 12: Data Safety, Consent, and Visibility Rules.
9. Annex 13: AI Coding Agent Evidence Pack Template.
10. Existing repo implementation where it does not conflict with the above.
11. Public skill repositories and public research findings as design references only.

## Binding rules

The skill must enforce these product rules:

- DEC Learning Hub is a governed, evidence-linked, AI-assisted CSO capacity-strengthening workflow, not a generic LMS.
- Course creation starts from validated CSO capacity evidence.
- Phase 1 course production is for Knowledge and Skill gaps.
- Motivation and Environment gaps do not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly recorded.
- Mixed gaps may proceed only for the explicit Knowledge/Skill component.
- Motivation/Environment components must be recorded and routed or flagged for complementary support.
- Unknown or weak root cause should route to further diagnosis, not forced course design.
- Analysis-to-Design Handover must lock the approved evidence base before Design proceeds.
- Locked Analysis evidence must remain read-only downstream unless a traceable return/reopen workflow is used.
- AI can clarify or reformat user-provided Analysis evidence but cannot invent evidence, assign the route independently, or override the course-fit decision.
- Sensitive data should be minimized and not exposed broadly.

## Expected implementation patterns

When this skill informs code work, implementation should generally prefer:

- small pure helper functions for route classification and course-fit decisions;
- explicit enum/status values where the repo already supports them;
- safe additive fields or docs-only changes unless schema change is clearly justified;
- gate checks that fail closed when evidence or root cause is missing;
- UI messages that explain blocked Design access in plain language;
- tests around valid, blocked, mixed, unclear, and sensitive cases;
- audit or event records for lock, return, or reopen actions where the repo already supports them.

## Acceptance criteria

A work product using this skill is acceptable when:

- It does not create course design from a blank topic.
- It requires validated capacity evidence before Design unlock.
- It distinguishes Knowledge, Skill, Motivation, Environment, Mixed, and unclear cases.
- It blocks Motivation-only and Environment-only course production.
- It permits mixed cases only when a separable K/S component is recorded.
- It preserves Analysis-to-Design Handover traceability.
- It keeps locked Analysis read-only downstream.
- It shows clear route and unlock/block messages in creator-facing UI where relevant.
- It includes tests or verification steps appropriate to the change.
- It does not alter certificate, proof, badge, Review/Publish, learner runtime, or monitoring behavior unless explicitly scoped.

## Required evidence-pack checks

Implementation evidence packs must explicitly confirm:

- K/S/M/E routing behavior preserved or improved.
- Course-fit decision behavior preserved or improved.
- Design unlock remains dependent on Analysis readiness and lock/approval.
- No Motivation/Environment-only course creation was introduced.
- No AI authority over Analysis decisions was introduced.
- No certificate threshold change was introduced.
- No practical proof / verified achievement / badge coupling to certificate was introduced.
- Review and Publish separation remains unchanged.
- Raw proof and sensitive data remain private by default.

## Maintenance notes

Revise this skill when:

- DEC approves a new K/S/M/E routing rule.
- Analysis Gate fields or workflow states change.
- Course-fit decisions gain new values.
- The repo adds a new Analysis-to-Design Handover model.
- The Course Creator UI changes how Analysis lock/unlock is displayed.
- Public skill patterns are intentionally adapted into the DEC repo.
- Any eval case fails or a real AI coding agent produces a routing-drift error.

Keep this skill narrow. Do not add Build Studio, AI authoring, certificate/proof, Review/Publish, or monitoring implementation details beyond traceability and boundary protection.

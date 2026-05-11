# SOURCES: DEC Analysis Gate K/S/M/E Routing Skill

This skill is DEC-native. Public skills and repositories are design references only. Do not install or copy third-party skills into the repository without review of licensing, security, prompt-injection risk, and fit with DEC binding rules.

## DEC product and workflow sources

Use these DEC sources as authoritative where present in the repo or project files:

1. Revised Developer-Facing Implementation Description of the DEC Learning Hub Course Creator Portal.
2. Description of the DEC Learning Hub Course Creator Portal.
3. Annex 1: Source-of-Truth and Override Note.
4. Annex 2: Role-Action and Permission Matrix.
5. Annex 3: Workflow State, Gate, and Record Matrix.
6. Annex 4: CSO Capacity Taxonomy and Indicator Mapping.
7. Annex 5: K/S/M/E Routing and Course-Fit Decision Rules.
8. Annex 7: AI Authoring Guardrails and Review Log.
9. Annex 12: Data Safety, Consent, and Visibility Rules.
10. Annex 13: Codex / AI Coding Agent Implementation Evidence Pack Template.
11. K/S/M/E Categories and Diagnostic Guide.
12. Public Agent Skills Research for DEC-native Codex Skills.

## Key DEC source rules summarized

- Course creation should not begin from a blank page or generic course topic.
- Analysis Gate must confirm validated capacity gap, current baseline, desired practice, evidence source, root cause, target learner group, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor.
- Design unlock depends on Analysis-to-Design Handover approval/lock.
- Phase 1 courses are for Knowledge/Skill gaps.
- Motivation and Environment gaps are routed outside course production unless a separable K/S component is recorded.
- Build Studio, AI authoring, Review, Publish, certificate, practical proof, and monitoring must remain traceable to Analysis and Design.
- AI may assist drafting and clarification but cannot invent evidence or override routing decisions.

## Public skill and research references used only as patterns

The approved public agent skills research report identified these patterns as relevant references:

- Official OpenAI / Codex-style skill structure: skill folder centered on `SKILL.md`, optional `references/`, `scripts/`, `assets/`, and validation through real examples.
- GitHub project-level `.agents/skills/` convention for repository skills.
- Open Agent Skills / AgentSkills-style conventions for progressive disclosure and portable skill folders.
- Evidence-based education skill libraries that use typed inputs/outputs, evidence-strength metadata, chaining, and self-checks.
- Course-planning workflow skills that use staged planning artifacts and handoff from planning to implementation.
- Course audit and learning-design review skills that separate builder, reviewer, quality-control, and accessibility responsibilities.
- Engineering workflow skills that use define -> plan -> build -> verify -> review -> ship patterns.
- Citation/evidence verification skills that enforce source-bounded claims.

## Adaptation stance

Borrow:

- folder structure;
- concise `SKILL.md` trigger descriptions;
- source inventories;
- small eval cases;
- planning-before-coding habits;
- evidence-bound outputs;
- explicit red flags and failure modes.

Change:

- replace generic instructional-design assumptions with DEC Analysis Gate logic;
- replace platform/vendor-specific commands with repo inspection and DEC workflow gates;
- replace generic learning-needs analysis with K/S/M/E course-fit routing and CSO capacity taxonomy;
- replace broad AI authoring authority with source-bounded drafting only.

Reject:

- direct third-party skill installation without review;
- generic course generation;
- blank-canvas authoring assumptions;
- AI-driven approval, publish, proof verification, badge awarding, or routing decisions;
- broad ingestion of sensitive CSO, learner, beneficiary, safeguarding, or civic-space data.

## Licensing and reuse caution

Do not copy public skill text, scripts, or assets verbatim unless the license is confirmed and compatible with the DEC repository. Prefer original DEC wording based on DEC specifications and approved project decisions.

## Review checklist for future updates

Before revising this skill, confirm:

- the relevant DEC spec or annex changed;
- the change does not weaken K/S/M/E routing;
- the change does not expand AI authority;
- the change does not make M/E gaps course-addressable by default;
- the change does not expose sensitive evidence;
- the change remains useful for multiple AI coding agents, not only Codex.

# Annex 1: Source-of-Truth and Override Note

## DEC Learning Hub Course Creator Portal

## 1. Purpose of This Annex

This annex defines the **source-of-truth hierarchy, interpretation rules, and binding overrides** for the DEC Learning Hub Course Creator Portal implementation.

Its purpose is to help Codex/GPT-5.5, developers, reviewers, and DEC stakeholders understand how to interpret the different specification documents in the repo, especially where older documents or phase files contain wording that has since been corrected.

This annex should be treated as a **companion control note** to the main developer-facing implementation description.

It does not replace the detailed workflow specifications. Instead, it explains:
- which documents to read;
- how to resolve conflicts;
- which rules are binding;
- which earlier wording is superseded;
- what should not be changed without explicit DEC approval;
- how Codex should apply the specifications safely.

## 2. Product Context

The DEC Learning Hub Course Creator Portal is being developed as part of an EU-funded capacity-building program for local CSOs in Ethiopia.

The portal is not a generic LMS or blank course builder. It is a governed, evidence-linked, AI-assisted course creation workflow that helps DEC and selected course creators transform validated CSO capacity gaps into practical learning courses.

The platform should preserve traceability across the full workflow:

> **Capacity evidence → Analysis Gate → Design → Build → Review → Publish → Learner Runtime → Certificate → optional Practical Proof / Verified Achievement → Monitoring and Evaluation**

All implementation decisions should protect this product identity.

## 3. Core Specification Files

The following files should be treated as the current core workflow specification package:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

docs/specs/core-workflow/01_ANALYSIS_PHASE.md

docs/specs/core-workflow/02_DESIGN_PHASE.md

docs/specs/core-workflow/03_BUILD_PHASE.md

docs/specs/core-workflow/04_REVIEW_AND_PUBLISH_PHASE.md

docs/specs/core-workflow/05_MONITORING_AND_EVALUATION_PHASE.md

These files define the five refined workflow phases:

1.  Analysis

2.  Design

3.  Build

4.  Review and Publish

5.  Monitoring and Evaluation

They should be read together with the revised developer-facing implementation description and this annex.

## 4. Existing Repo Specifications

The following existing repo specifications remain important:

DEC_Learning_Hub_Phase1_Core_Workflow_Overriding_Specification_REGENERATED.md

spec_dec_learning_hub.md

These documents provide broader product scope, Phase 1 interpretation, and previously agreed implementation direction.

They should continue to be used where they do not conflict with:

1.  the revised developer-facing implementation description;

2.  the five refined phase specifications;

3.  this Source-of-Truth and Override Note;

4.  later explicit DEC decisions.

## 5. Source-of-Truth Hierarchy

When Codex or developers find conflicting language between documents, use the following hierarchy.

| **Priority** | **Source**                                                              | **How to use it**                                         |
|--------------|-------------------------------------------------------------------------|-----------------------------------------------------------|
| 1            | Explicit DEC decisions recorded in this annex or later approved prompts | Binding override                                          |
| 2            | Revised developer-facing implementation description                     | Integrated product intent and workflow behavior           |
| 3            | This Source-of-Truth and Override Note                                  | Conflict resolution and binding corrections               |
| 4            | Five refined phase specification files                                  | Detailed phase-level workflow requirements                |
| 5            | Existing repo specifications                                            | Broader implementation context where not superseded       |
| 6            | Current working implementation                                          | Preserve where it already satisfies the intended behavior |

This means that when an older document conflicts with a newer explicit decision, Codex should follow the newer explicit decision and not silently implement the older rule.

## 6. Binding Product Rules

The following rules are binding for Phase 1 implementation.

### 6.1 Certificate Rule

The correct Phase 1 certificate rule is:

> **Final test score of 80% or above = course pass and automated course certificate.**

This rule applies across:
- Build Studio;
- final test setup;
- Review;
- Publish;
- learner runtime;
- certificate generation;
- certificate registry;
- monitoring dashboards;
- organization summaries.

Practical proof is **not required** for the course certificate.

Any earlier wording suggesting that a learner must score 90% to receive an automated certificate is superseded.

### 6.2 Practical Proof and Verified Achievement Rule

Practical proof, verified achievements, and badges are a **separate higher-level recognition layer**.

They are not conditions for course certification.

The correct distinction is:

| **Recognition type**         | **Basis**                                   | **Required for course certificate?** |
|------------------------------|---------------------------------------------|--------------------------------------|
| Course certificate           | Final test score of 80% or above            | Yes, final test score only           |
| Practical proof              | Learner/CSO submits evidence of application | No                                   |
| Verified achievement / badge | Practical proof is reviewed and accepted    | No                                   |

Verified achievements and badges should be linked to CSO capacity indicators, standards, or specific applied capacity achievements.

They may support organization recognition and donor confidence, but they must not be confused with course certificates.

### 6.3 Review and Publish Separation

Review and Publish must remain separate workflow stages.

Course creators may:
- create;
- edit;
- preview;
- submit;
- revise.

Reviewers may:
- review;
- comment;
- approve for publish;
- return to Build;
- return to Design;
- return to Analysis;
- request specialist review.

Authorized publishers/admins may:
- publish;
- schedule;
- pilot release;
- archive;
- manage published versions.

A course should not become learner-visible simply because a creator finished Build or because Review started.

### 6.4 Governed Flexible Build Studio Rule

The Build Studio must preserve a governed workflow.

It must not become an unrestricted blank-canvas builder.

Course creators may add blocks, but creator-added blocks should carry:
- purpose tag;
- linked design element;
- short justification;
- review status.

Purpose-linking is intended as **soft governance**, not a creativity restriction.

Correct interpretation:

> Creators can add useful blocks, but the platform asks why the block is needed and what approved course purpose it supports.

Incorrect interpretation:

> Creators cannot add blocks unless the system automatically approves them.

The platform should guide, warn, flag, and support review rather than block all creator flexibility.

### 6.5 Knowledge/Skill Phase 1 Boundary

Phase 1 course production should focus on Knowledge and Skill gaps.

| **Gap type** | **Phase 1 course production decision**                                                            |
|--------------|---------------------------------------------------------------------------------------------------|
| Knowledge    | Can proceed to course design                                                                      |
| Skill        | Can proceed to course design                                                                      |
| Motivation   | Should not drive Phase 1 course production unless separable Knowledge/Skill component is recorded |
| Environment  | Should not drive Phase 1 course production unless separable Knowledge/Skill component is recorded |
| Mixed        | Can proceed only for the explicit course-addressable Knowledge/Skill component                    |

Motivation and Environment issues may still be recorded and routed to other DEC support pathways, but they should not become Phase 1 courses by themselves.

### 6.6 Data Safety and Donor Visibility Rule

Raw practical proof and sensitive learner/CSO data must be private by default.

Donor-facing visibility should be:
- safe;
- consent-based;
- summary-level;
- role-controlled;
- free of raw proof unless explicitly approved and safeguarded.

The platform must not expose:
- raw proof submissions;
- active safeguarding/protection cases;
- beneficiary names;
- politically sensitive information;
- internal reviewer notes;
- unapproved CSO weaknesses;
- sensitive organizational documents.

Verified achievement summaries may be shared only according to consent and visibility rules.

### 6.7 AI Human Review Rule

AI may assist with drafting, simplifying, adapting, and refining course content, but AI must not independently design, approve, publish, certify, verify proof, or award badges.

All AI-assisted outputs must be human-reviewed before publication.

AI must not invent:
- capacity gaps;
- baseline evidence;
- donor requirements;
- legal claims;
- target learner groups;
- indicators;
- course objectives;
- unsafe examples;
- sensitive scenarios.

AI should work from approved Analysis and Design context.

## 7. Superseded or Corrected Language

The following types of older wording should be treated as superseded.

### 7.1 Superseded Certificate Language

Superseded wording includes any statement such as:
- “80% pass / 90% certificate”
- “90% and above = automated certificate”
- “certificate rate means percentage scoring 90% or above”
- “learners need 90% for certificate”

Correct replacement:

> **80%+ final test score = pass and automated certificate.**

### 7.2 Superseded Practical Proof Interpretation

Superseded wording includes any interpretation that suggests:
- practical proof is required for course certificate;
- badge is part of certificate eligibility;
- verified achievement is the same as course certificate;
- course completion requires accepted practical proof.

Correct replacement:

> Practical proof and verified achievements are optional/additional recognition pathways separate from course certification.

### 7.3 Superseded Build Interpretation

Superseded wording includes any interpretation that suggests:
- the Build Studio should become unrestricted page building;
- creators can add unlimited unrelated content;
- creator-added blocks do not need traceability;
- the approved Analysis and Design records are only advisory.

Correct replacement:

> Build is flexible but governed. Added blocks must be purpose-linked and visible for Review.

## 8. What Codex Should Do When It Finds a Conflict

When Codex finds a conflict between specifications, it should not guess silently.

It should follow this process:

1.  Identify the conflict.

2.  State which documents or sections appear to conflict.

3.  Apply the source-of-truth hierarchy.

4.  Use this annex for binding overrides.

5.  If the conflict is still unclear, stop and request a decision before implementation.

6.  Do not implement conflicting behavior without explicit approval.

Known conflict that is already resolved:

> The certificate threshold is 80%+, not 90%.

Codex should not ask again about that unless DEC explicitly reopens the decision.

## 9. Required Implementation Behavior

Codex should apply the specifications in safe, testable implementation slices.

Recommended implementation order:

1.  Analysis Gate Alignment

2.  Design Handover Alignment

3.  Governed Flexible Build Studio

4.  Final Test + Certificate + Practical Proof / Verified Achievement

5.  Review and Publish Upgrade

6.  Monitoring and Evidence Dashboard

Codex should not attempt to implement all workflow changes in one large task unless explicitly instructed.

Each implementation slice should include:
- plan-first summary;
- files likely to change;
- acceptance criteria;
- tests and verification steps;
- evidence pack after implementation;
- known gaps;
- next safe step.

## 10. What Codex Should Preserve

Codex should preserve working implementation wherever possible.

Do not rewrite or remove working code unless there is a clear reason.

Preserve:
- existing working routes;
- existing dashboard structure where usable;
- existing authentication and role logic;
- existing learner runtime where functional;
- existing final test/certificate behavior if it already uses the 80% rule;
- existing review/publish separation;
- existing schema patterns where possible;
- existing styling and DEC brand behavior;
- existing tests.

If a refactor is needed, Codex should explain why and provide a narrow plan.

## 11. What Codex Must Not Change Without Approval

Codex must not change the following without explicit approval:
- certificate threshold away from 80%;
- practical proof becoming required for certificate;
- Review and Publish being merged;
- Build Studio becoming blank-canvas authoring;
- Motivation/Environment gaps becoming normal Phase 1 course drivers;
- raw proof becoming donor-visible by default;
- public CSO ranking or scoring;
- unrestricted AI course generation;
- publication by course creators without authorized publisher/admin role;
- major schema redesign;
- deletion of working routes or components;
- broad rewrite of the app.

## 12. Annex Relationship to the Main Description

This annex supports the main **Developer-Facing Implementation Description of the DEC Learning Hub Course Creator Portal**.

The main description explains the integrated product behavior, user journey, and implementation intent.

This annex gives Codex and developers the rules for resolving conflicts and applying the correct product interpretation.

When in doubt:

1.  Follow the main developer-facing description for product behavior.

2.  Follow this annex for conflict resolution and binding overrides.

3.  Follow the phase specifications for detailed workflow requirements.

4.  Preserve existing working implementation where it aligns.

## 13. Recommended Repo Placement

This annex should be saved in the repo as:

docs/specs/core-workflow/ANNEX_01_SOURCE_OF_TRUTH_AND_OVERRIDE_NOTE.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested note to add to the index:

\## Annexes

\- ANNEX_01_SOURCE_OF_TRUTH_AND_OVERRIDE_NOTE.md

Defines source-of-truth hierarchy, binding overrides, certificate rule correction, implementation interpretation rules, and conflict-resolution guidance for Codex and developers.

## 14. Success Standard for This Annex

This annex is successful when:

> Codex and developers can read the repo specifications, identify which rules are binding, resolve outdated or conflicting language correctly, preserve the 80% certificate rule, keep practical proof separate from certificates, maintain Review/Publish separation, protect data safety, and implement the portal in safe, testable slices without drifting into generic LMS behavior.

In practical terms, this annex should prevent:

> “Codex found older wording and changed certificate eligibility to 90%.”

And ensure:

> “Codex correctly applies the 80% certificate rule, treats proof/badges as separate, preserves governance, and asks before implementing any unresolved conflict.”

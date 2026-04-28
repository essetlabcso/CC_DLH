# Annex 7: AI Authoring Guardrails and Review Log

## DEC Learning Hub Course Creator Portal

## 1. Purpose of This Annex

This annex defines the **AI Authoring Guardrails and Review Log** for
the DEC Learning Hub Course Creator Portal.

Its purpose is to guide Codex/GPT-5.5, developers, DEC course creators,
reviewers, and admins on how AI-assisted authoring should work inside
the platform.

AI should help course creators produce clearer, more practical, more
accessible learning content. However, AI must not replace the approved
workflow, invent evidence, make sensitive judgments, approve courses,
publish courses, issue certificates, verify practical proof, or award
badges.

The core rule is:

> AI may assist with drafting and improving course content, but all
> AI-assisted outputs must remain inside the approved Analysis and
> Design context and must be reviewed by a human before publication.

This annex should be used together with:

docs/specs/core-workflow/01_ANALYSIS_PHASE.md

docs/specs/core-workflow/02_DESIGN_PHASE.md

docs/specs/core-workflow/03_BUILD_PHASE.md

docs/specs/core-workflow/04_REVIEW_AND_PUBLISH_PHASE.md

docs/specs/core-workflow/ANNEX_01_SOURCE_OF_TRUTH_AND_OVERRIDE_NOTE.md

docs/specs/core-workflow/ANNEX_06_BUILD_STUDIO_BLOCK_LIBRARY_SPECIFICATION.md

# 2. AI Role in the DEC Course Creator Portal

AI is a **guided production assistant**.

It may help course creators:

- draft short learner-facing explanations;

- simplify technical language;

- create fictionalized examples;

- prepare scenario wording;

- draft practice instructions;

- draft feedback messages;

- generate quiz question drafts;

- suggest accessibility alternatives;

- support localization drafts;

- summarize long source materials into shorter blocks;

- transform approved design notes into block-level content.

AI is not:

- the course designer;

- the course approver;

- the publisher;

- the certificate authority;

- the proof verifier;

- the safeguarding reviewer;

- the donor-visibility decision-maker;

- the source of truth for CSO capacity evidence.

The platform should present AI as support, not authority.

# 3. AI Must Work From Approved Context

AI should not operate from a blank prompt.

AI requests should be attached to a specific course, lesson, block, or
workflow record. The platform should pass or display the approved
context that AI is allowed to use.

## 3.1 Required AI context package

When AI is used in Build Studio, the context package should include:

| **Context field**                | **Purpose**                                                                          |
|----------------------------------|--------------------------------------------------------------------------------------|
| Course title                     | Keeps AI output course-specific                                                      |
| Target learner group             | Helps AI adapt tone and examples                                                     |
| CSO capacity area                | Keeps output linked to DEC taxonomy                                                  |
| Sub-capacity / indicator         | Keeps output aligned with capacity standard                                          |
| Capacity gap statement           | Prevents generic content                                                             |
| Baseline/current practice        | Grounds content in the diagnosed problem                                             |
| Desired practice                 | Shows intended improvement                                                           |
| K/S route                        | Keeps AI focused on Knowledge/Skill component                                        |
| Course-fit decision              | Prevents AI from treating non-course barriers as course content                      |
| Performance goal                 | Keeps content action-oriented                                                        |
| Required action                  | Links draft to Action Map                                                            |
| Minimum information              | Prevents unnecessary theory                                                          |
| Block type                       | Tells AI what kind of output to draft                                                |
| Block purpose                    | Explains why the block exists                                                        |
| Safeguards/no-harm note          | Prevents unsafe content                                                              |
| Accessibility/localization needs | Supports mobile, low-bandwidth, plain language, and translation readiness            |
| Practical proof setting          | If proof is enabled, keeps AI aligned with safe evidence requirements                |
| AI restrictions                  | Prevents invented evidence, unsafe advice, legal claims, or unsupported donor claims |

The implementation principle is:

> AI should draft from the approved course record, not from the
> creator’s imagination alone.

# 4. Approved AI Uses

AI may be used for low-risk and medium-risk authoring support when human
review is required.

| **Approved AI use**               | **Example**                                                                       |
|-----------------------------------|-----------------------------------------------------------------------------------|
| Draft short explainer             | Turn minimum information into a simple learner-facing paragraph                   |
| Simplify language                 | Rewrite donor-heavy language into plain language                                  |
| Create fictionalized example      | Draft a fictional CSO case with no real names or sensitive details                |
| Draft worked example              | Show how to complete part of a template                                           |
| Draft scenario wording            | Turn approved scenario notes into learner-facing challenge/choices/consequences   |
| Draft practice instructions       | Explain what learners should do in a guided practice                              |
| Draft feedback                    | Explain why a choice is strong, weak, incomplete, or risky                        |
| Draft quiz questions              | Generate MCQ, true/false, matching, sequencing, or scenario-based question drafts |
| Draft final test items            | Produce draft items for human verification                                        |
| Create alt text draft             | Suggest image description for human review                                        |
| Draft transcript summary          | Summarize audio/video into text support                                           |
| Suggest low-bandwidth alternative | Convert media-heavy content into text or downloadable job aid                     |
| Draft proof instructions          | Explain optional practical proof submission safely                                |
| Draft badge description           | Describe a verified achievement without overclaiming                              |
| Summarize learner feedback        | Help admins identify common feedback themes                                       |

AI output should remain a draft until accepted or edited by a human.

# 5. Prohibited AI Uses

AI must not be allowed to make core workflow decisions or produce
unsupported high-risk content.

AI must not:

- invent capacity gaps;

- invent baseline/current practice;

- invent evidence sources;

- invent target learner groups;

- invent indicators or standards;

- change K/S/M/E route;

- override course-fit decision;

- convert Motivation or Environment gaps into Phase 1 course content
  unless the Analysis record already includes a separable K/S component;

- invent donor requirements;

- provide legal advice;

- provide unsafe advocacy tactics;

- draft real safeguarding case handling instructions beyond approved
  safe referral guidance;

- ask learners to upload real beneficiary or protection data;

- use real names or identifiable community details;

- publish course content;

- approve Review;

- issue certificates;

- verify practical proof;

- award badges;

- decide donor-facing visibility;

- make claims that a certificate proves full organizational capacity or
  donor readiness.

The platform should explicitly block or warn against these uses.

# 6. AI Use by Workflow Phase

AI may appear in different phases, but the safest primary implementation
is **block-level AI support inside Build Studio**.

| **Workflow phase** | **Appropriate AI support**                                                                             | **Guardrail**                                              |
|--------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| Analysis           | Rewrite or clarify entered capacity gap statement; summarize uploaded notes already provided by user   | AI must not invent evidence, baseline, or diagnosis        |
| Design             | Refine wording of performance goal, required actions, or practice instructions                         | AI must not change approved Analysis                       |
| Build              | Draft block content, examples, practice instructions, feedback, quiz items, accessibility alternatives | Human review required before submission                    |
| Review             | Summarize reviewer comments or suggest revision options                                                | AI cannot approve or reject                                |
| Publish            | Draft catalog description from approved course metadata                                                | AI cannot publish                                          |
| Learner Runtime    | Future optional learner support only if safe and reviewed                                              | AI should not provide unreviewed advice in sensitive areas |
| Monitoring         | Summarize learner feedback trends                                                                      | AI cannot claim impact or verify capacity                  |

# 7. AI Use by Block Type

AI behavior should be block-aware.

| **Block type**                 | **AI may help with**                               | **Human review focus**                                   |
|--------------------------------|----------------------------------------------------|----------------------------------------------------------|
| Text / short explainer         | Draft concise explanation                          | Accuracy, simplicity, relevance                          |
| Statement / note               | Draft key takeaway or warning                      | Overclaiming, safety, clarity                            |
| Example / demonstration        | Draft fictionalized worked example                 | Realism, correctness, local relevance                    |
| Practice block                 | Draft task instructions and feedback               | Practicality and alignment with required action          |
| Scenario block                 | Draft challenge, choices, consequences, feedback   | Safety, plausible choices, no sensitive real cases       |
| Knowledge check                | Draft question and feedback                        | Correct answer, fairness, alignment                      |
| Final test                     | Draft test items                                   | SME verification, no unsupported content                 |
| Resource block                 | Draft checklist/template text                      | Practical usefulness and accuracy                        |
| Accessibility block            | Draft alt text, transcript, plain-language version | Meaning preservation and accessibility                   |
| Safeguarding/data safety block | Draft safety note                                  | Specialist review where sensitive                        |
| Practical proof block          | Draft proof instructions and criteria              | Safety, anonymization, clear separation from certificate |
| Badge/achievement block        | Draft badge description                            | No overclaiming; links to accepted proof only            |

# 8. AI Prompt Guardrails

The platform should use structured prompts or prompt templates. Freeform
AI prompts may be allowed, but only with guardrails.

## 8.1 Standard AI system instruction for authoring

Recommended internal instruction:

You are assisting a DEC Learning Hub course creator to draft
learner-facing content for local CSO capacity strengthening in Ethiopia.
Use only the approved course context provided. Do not invent evidence,
indicators, donor rules, legal claims, target learner groups, or course
objectives. Keep content practical, concise, mobile-friendly,
low-bandwidth friendly, and appropriate for local CSO learners. Avoid
sensitive personal data, real case details, unsafe advocacy advice, and
overclaiming. Output is a draft that requires human review.

## 8.2 Block-level prompt template

Draft content for this course block using only the approved context
below.

Course:

\[course title\]

Target learners:

\[target learner group\]

Capacity area:

\[capacity area / sub-capacity\]

Approved capacity gap:

\[capacity gap statement\]

Performance goal:

\[performance goal\]

Required action:

\[required action\]

Block type:

\[block type\]

Block purpose:

\[block purpose\]

Minimum information:

\[minimum information\]

Safeguards:

\[safeguards/no-harm note\]

Accessibility/localization needs:

\[accessibility/localization notes\]

Instructions:

\- Write in clear, simple language.

\- Keep it practical and short.

\- Use local CSO-relevant examples.

\- Do not invent new course objectives or evidence.

\- Do not include real names, real cases, or sensitive data.

\- Do not make legal, donor compliance, or safeguarding claims beyond
the approved context.

\- Mark any uncertainty for human review.

## 8.3 Scenario prompt template

Draft a short CSO decision scenario using the approved context.

Use the 3C structure:

1\. Challenge

2\. Choices

3\. Consequences

Context:

\[approved scenario/practice planner notes\]

Learner role:

\[learner role\]

Required action:

\[required action\]

Safety constraints:

\[safeguarding/civic-space/data safety notes\]

Instructions:

\- Use fictionalized names and situations.

\- Do not use active safeguarding/protection cases.

\- Make choices realistic and plausible.

\- Include one fast but risky option, one incomplete option, and one
safer/better option where appropriate.

\- Explain consequences clearly.

\- Do not make the correct answer too obvious.

\- Keep it suitable for mobile learners.

## 8.4 Final test draft prompt template

Draft final test question options using only the approved course
content.

Course content covered:

\[approved block summary\]

Required action:

\[required action\]

Assessment focus:

\[knowledge/skill/decision logic\]

Question type:

\[MCQ / true-false / matching / sequencing / scenario question\]

Instructions:

\- Test only content taught in the course.

\- Use clear language.

\- Avoid trick questions.

\- Provide one correct or best answer.

\- Provide plausible but fair distractors.

\- Include answer feedback.

\- Do not introduce new facts not taught in the course.

\- Human SME review is required before approval.

## 8.5 Practical proof prompt template

Draft practical proof submission instructions for this course.

Course:

\[course title\]

Capacity area:

\[capacity area\]

Performance goal:

\[performance goal\]

Accepted proof type:

\[proof type\]

Review criteria:

\[criteria\]

Safety constraints:

\[data safety / anonymization / safeguarding notes\]

Instructions:

\- Clearly state that practical proof is separate from the course
certificate.

\- Explain what learners may submit.

\- Explain what learners must not submit.

\- Include anonymization/redaction guidance.

\- Do not ask for real names, phone numbers, addresses, active
protection cases, or politically sensitive details.

\- Keep instructions short and practical.

# 9. AI Output Statuses

Every AI-assisted output should have a visible status.

| **AI status**              | **Meaning**                                        |
|----------------------------|----------------------------------------------------|
| Not AI-assisted            | No AI used                                         |
| AI draft generated         | AI produced draft content                          |
| Human review pending       | Draft has not yet been checked                     |
| Human edited               | Creator edited the AI output                       |
| Human accepted             | Creator accepted the AI output after review        |
| Human rejected             | Creator rejected the AI output                     |
| Specialist review required | Sensitive or technical content needs expert review |
| Specialist approved        | Specialist approved the content                    |
| Block ready for Review     | AI output is reviewed and ready for course Review  |

A block with AI-generated content should not be submitted for Review if
its AI status is still **Human review pending**, unless the platform
explicitly flags it as unresolved.

# 10. AI Drafting and Review Log

The platform should maintain an **AI Drafting and Review Log**.

This log should be visible to course creators, reviewers, and admins.
Learners should not see it.

## 10.1 Required log fields

| **Field**                 | **Description**                                                              |
|---------------------------|------------------------------------------------------------------------------|
| AI log ID                 | Unique record                                                                |
| Course ID                 | Course connected to AI use                                                   |
| Course version ID         | Version-aware tracking                                                       |
| Lesson/block ID           | Specific block where AI was used                                             |
| Block type                | Explainer, scenario, quiz, proof instruction, etc.                           |
| AI task type              | Draft, simplify, translate, quiz draft, scenario draft, feedback draft, etc. |
| Prompt template used      | Which approved prompt pattern was used                                       |
| Approved context used     | Summary or reference to context package                                      |
| User freeform instruction | Any extra user instruction                                                   |
| AI output summary         | Short summary of generated output                                            |
| Risk level                | Low, medium, high                                                            |
| Sensitive content flag    | Yes/No                                                                       |
| Human reviewer            | User who reviewed                                                            |
| Human decision            | Accepted, edited, rejected, escalated                                        |
| Edit summary              | What changed after AI generation                                             |
| Specialist review needed  | Yes/No                                                                       |
| Specialist reviewer       | If applicable                                                                |
| Final AI status           | Reviewed, rejected, specialist approved, etc.                                |
| Created at                | Timestamp                                                                    |
| Reviewed at               | Timestamp                                                                    |

## 10.2 AI task types

Recommended task type values:

- draft explainer;

- simplify language;

- create fictionalized example;

- draft worked example;

- draft scenario;

- draft practice instruction;

- draft feedback;

- draft knowledge check;

- draft final test item;

- draft alt text;

- draft transcript;

- draft low-bandwidth alternative;

- draft proof instruction;

- draft badge description;

- summarize feedback;

- other.

# 11. Risk Levels for AI Outputs

AI outputs should be classified by risk.

| **Risk level** | **Examples**                                                                                         | **Required review**           |
|----------------|------------------------------------------------------------------------------------------------------|-------------------------------|
| Low            | Plain-language rewrite, short explainer, glossary, lesson summary                                    | Creator review                |
| Medium         | Scenario, quiz item, worked example, practice feedback, proof instruction                            | Creator + reviewer/SME review |
| High           | Safeguarding, civic-space, legal/regulatory, donor compliance, sensitive data, proof upload guidance | Specialist review required    |

The platform should automatically suggest high-risk status when blocks
involve:

- safeguarding;

- child protection;

- GBV/protection;

- advocacy;

- civic-space restrictions;

- legal/regulatory issues;

- financial compliance;

- donor eligibility;

- proof submission;

- personal/community data;

- politically sensitive scenarios.

# 12. Human Review Checklist for AI Output

Before accepting AI-assisted content, the creator or reviewer should
confirm:

| **Review question**                                               | **Expected answer**                |
|-------------------------------------------------------------------|------------------------------------|
| Does the output stay within approved Analysis and Design context? | Yes                                |
| Does it support the selected block purpose?                       | Yes                                |
| Does it avoid inventing new objectives or indicators?             | Yes                                |
| Is it accurate?                                                   | Yes                                |
| Is it relevant to local CSO learners?                             | Yes                                |
| Is it practical and action-oriented?                              | Yes                                |
| Is it concise and mobile-friendly?                                | Yes                                |
| Does it avoid unsupported legal, donor, or compliance claims?     | Yes                                |
| Does it avoid real names and sensitive data?                      | Yes                                |
| Does it respect safeguarding and civic-space constraints?         | Yes                                |
| Does it avoid overclaiming impact or capacity?                    | Yes                                |
| Does it require specialist review?                                | No, or specialist review completed |

The platform may show this as a short checklist before the creator marks
AI output as accepted.

# 13. AI and Safeguarding / Civic-Space Guardrails

For sensitive content, AI must be especially constrained.

## 13.1 AI must not generate

AI must not generate:

- active safeguarding case instructions beyond approved referral
  guidance;

- GBV case examples with identifiable or graphic details;

- instructions to investigate cases;

- names or profiles of vulnerable people;

- politically sensitive advocacy tactics;

- advice on bypassing regulations;

- legal determinations;

- unverified donor compliance rules;

- proof instructions asking for raw case files or personal data.

## 13.2 AI may generate

AI may generate:

- fictionalized neutral scenarios;

- safe referral pathway reminders based on approved content;

- anonymization guidance;

- “do not upload” warnings;

- safe advocacy language examples;

- plain-language explanation of approved risk cautions;

- reviewer checklist drafts.

## 13.3 Required warning

For sensitive AI tasks, show:

This AI output involves sensitive content. It must be reviewed for
safeguarding, civic-space, data safety, and local relevance before the
course can be submitted or published.

# 14. AI and Donor / Legal / Compliance Content

AI must be careful with donor, legal, and compliance-related content.

AI may help rewrite or explain **approved** donor or compliance guidance
already provided in the course context.

AI must not:

- invent donor eligibility rules;

- invent legal requirements;

- interpret Ethiopian law as legal advice;

- create compliance claims without a source;

- state that a CSO is donor-ready based only on course completion;

- claim that a badge guarantees funding eligibility.

Recommended warning:

AI-assisted donor, legal, or compliance content must be checked by a
qualified human reviewer. Do not publish unsupported compliance claims.

# 15. AI and Final Test Items

AI may draft final test questions, but every question must be verified
by a human.

AI-generated final test items must meet these rules:

- test only taught content;

- link to required action, minimum information, or course block;

- use clear language;

- avoid trick questions;

- have correct answer verified;

- use fair distractors;

- include feedback;

- avoid unsupported facts;

- avoid sensitive disclosure;

- preserve certificate rule.

The binding rule remains:

> **80%+ final test score = course pass and automated certificate.**

AI must not change the scoring threshold or certificate rule.

# 16. AI and Practical Proof / Verified Achievements

AI may help draft proof instructions, proof examples, review criteria,
or badge descriptions.

AI must not:

- verify proof;

- decide whether proof is valid;

- award badges;

- expose proof to donors;

- summarize raw proof externally without consent;

- ask learners to upload unsafe documents;

- imply that practical proof is required for certificate.

Required learner-facing distinction:

> Your certificate is based on your final test score. Practical proof is
> a separate opportunity to show applied capacity and may lead to a
> verified achievement or badge.

# 17. AI and Localization / Translation

AI may support localization, but AI-generated translation should not be
treated as final.

AI may help:

- simplify English before translation;

- draft Amharic or local-language versions where enabled;

- identify difficult terms;

- suggest culturally appropriate examples;

- create plain-language variants.

Human review is required to ensure:

- meaning is preserved;

- local terminology is appropriate;

- safeguarding messages remain accurate;

- civic-space language is safe;

- examples are locally relevant;

- no harmful or stigmatizing wording is introduced.

# 18. AI and Accessibility

AI may support accessibility by drafting:

- alt text;

- transcript summaries;

- plain-language alternatives;

- low-bandwidth text versions;

- simplified instructions;

- glossary entries.

Human review should ensure:

- alt text accurately describes the image;

- transcript captures meaning;

- simplified version does not remove essential safety or technical
  meaning;

- accessibility alternative is actually usable.

AI-generated accessibility content should not be accepted automatically.

# 19. AI and Source Materials

If AI is used to transform source materials into learning blocks, the
platform should require the creator to identify the source.

Allowed transformation examples:

| **Source material** | **AI-assisted transformation** |
|---------------------|--------------------------------|
| Long manual         | Short explainer + checklist    |
| Framework           | Table + practice activity      |
| Case study          | Scenario draft                 |
| Policy guidance     | FAQ + knowledge check          |
| Template            | Guided practice + proof task   |
| Training transcript | Lesson summary + block outline |

Guardrails:

- AI must not invent content beyond the source;

- source should be referenced internally;

- sensitive source materials should be redacted before AI use;

- creator must review the transformed output;

- reviewer should see AI transformation in the log.

# 20. AI Data Safety Rules

Users should not paste sensitive information into AI prompts.

The platform should warn users not to include:

- real beneficiary names;

- phone numbers;

- addresses;

- active safeguarding or protection cases;

- GBV case details;

- politically sensitive information;

- confidential donor documents;

- internal HR records;

- raw proof submissions unless redacted;

- private organization documents without authorization.

Standard AI prompt warning:

Do not include real names, beneficiary details, active case information,
politically sensitive content, or confidential documents in AI prompts.
Use anonymized, redacted, or fictionalized examples.

# 21. Review Workflow Integration

The Review Workflow should include a specific AI review section.

Reviewers should see:

- which blocks used AI;

- AI task type;

- AI status;

- human decision;

- unresolved AI drafts;

- specialist review flags;

- AI-generated final test items;

- AI-generated proof instructions;

- AI-generated sensitive content.

Review checklist:

| **Review item**                               | **Required result** |
|-----------------------------------------------|---------------------|
| All AI outputs reviewed                       | Yes                 |
| No AI output pending human review             | Yes                 |
| Sensitive AI output specialist-reviewed       | Yes, where required |
| AI did not invent unsupported claims          | Yes                 |
| AI-generated test items verified              | Yes                 |
| AI-generated proof instructions safe          | Yes                 |
| AI-generated examples fictionalized           | Yes                 |
| AI content aligned with approved course scope | Yes                 |

A course should not be approved for Publish if AI-generated high-risk
content remains unreviewed.

# 22. Publish Workflow Integration

Before publishing, the publisher/admin should see an AI readiness
summary.

Minimum AI readiness summary:

| **Item**                        | **Status**                  |
|---------------------------------|-----------------------------|
| AI-assisted blocks count        | Number                      |
| Human-reviewed AI blocks        | Number                      |
| Pending AI review               | Must be zero                |
| High-risk AI outputs            | Must be specialist reviewed |
| AI-generated final test items   | Verified or not             |
| AI-generated proof instructions | Safe or not                 |
| AI review complete              | Yes/No                      |

Publish should be blocked if:

- pending AI review remains;

- high-risk AI output lacks specialist review;

- AI-generated final test items are unverified;

- AI-generated proof instructions lack safety review;

- AI content introduces unresolved scope drift.

# 23. Learner-Facing AI Transparency

Learners do not need to see internal AI logs, prompts, or workflow
metadata.

However, DEC may choose to include a simple transparency note.

Optional learner-facing note:

Some learning materials may have been drafted or refined with AI support
and reviewed by DEC course creators for accuracy, relevance,
accessibility, and safety.

Whether this appears should depend on DEC policy and donor requirements.

Internal AI transparency is mandatory; learner-facing disclosure is a
policy choice.

# 24. AI Guardrail Warnings in the UI

The platform should show short, practical warnings at the point of AI
use.

## 24.1 General AI warning

AI output is a draft. Review it for accuracy, local relevance, safety,
accessibility, and alignment before using it.

## 24.2 Sensitive data warning

Do not include real names, beneficiary details, active case information,
politically sensitive content, or confidential documents in AI prompts.

## 24.3 Scope warning

AI may only use the approved course context. Do not use AI to add new
objectives, evidence, indicators, or topics outside the approved design.

## 24.4 High-risk content warning

This content may involve safeguarding, civic-space, data safety, legal,
or donor-compliance risk. Specialist review may be required before
publication.

## 24.5 Final test warning

AI-generated test items must be verified by a human and linked to course
content before they can be used in the final test.

# 25. AI Review Log Table for Implementation

Codex may implement the review log as a simple table/list in Phase 1.

Recommended columns:

| **Column**        | **Example**                                           |
|-------------------|-------------------------------------------------------|
| Block             | Lesson 2 / Scenario block                             |
| AI task           | Draft scenario                                        |
| Risk              | High                                                  |
| Status            | Human edited                                          |
| Reviewer          | Creator / SME                                         |
| Specialist needed | Yes                                                   |
| Decision          | Accepted after edits                                  |
| Notes             | Removed unsafe reference; added anonymization warning |

This log should be included in the Build-to-Review Handover.

# 26. Minimum Phase 1 Requirements

For Phase 1, the platform should minimally support:

1.  AI assistance tied to a specific course/block context.

2.  AI prompt warning against sensitive data.

3.  AI output saved as draft, not final.

4.  AI status field on blocks.

5.  Human review status for AI-assisted blocks.

6.  AI Drafting and Review Log.

7.  Review visibility of AI-assisted blocks.

8.  Block submission blocked or flagged if AI output is unreviewed.

9.  Final test items generated by AI require human verification.

10. Sensitive AI outputs require specialist review flag.

11. AI cannot change certificate rule.

12. AI cannot verify proof or award badges.

13. AI cannot publish courses.

14. AI-generated proof instructions require safety review.

# 27. Future Enhancements

Future versions may add:

- AI prompt library by block type;

- AI quality scoring;

- AI-assisted localization workflow;

- AI-assisted accessibility checker;

- AI-assisted source-to-block transformation;

- AI-assisted scenario branching planner;

- AI-assisted test item analysis;

- AI-assisted learner feedback summarization;

- AI-assisted course improvement suggestions;

- model governance dashboard;

- organization-level AI usage reports;

- automated detection of unsupported claims;

- automated sensitive data detection before AI prompt submission.

These enhancements should not be implemented before Phase 1 human review
and logging are reliable.

# 28. Implementation Guidance for Codex

Codex should implement AI authoring as a controlled feature, not an open
unrestricted chatbot.

## 28.1 Required implementation behavior

Codex should:

- attach AI actions to course/block context;

- use approved Analysis and Design fields as AI context;

- save AI outputs as drafts;

- track AI task type and status;

- require human review before Review submission;

- flag sensitive AI content;

- expose AI log in Build-to-Review Handover;

- prevent AI from changing workflow gates, certificate threshold,
  publish status, proof verification, or badge awards.

## 28.2 What Codex should not do

Codex should not:

- add “generate full course” as unrestricted AI action;

- allow AI to bypass Analysis or Design;

- allow AI output to auto-publish;

- allow AI to decide final test pass/fail;

- allow AI to verify proof;

- allow AI to create donor-facing claims from raw proof;

- send raw sensitive proof to AI without redaction and approval;

- hide AI use from reviewers.

## 28.3 Acceptance criteria examples

Given a creator uses AI to draft a block,

when the AI output is inserted,

then the block status becomes “AI draft generated” and “Human review
pending.”

Given a block has AI status “Human review pending,”

when the creator attempts to submit the course for Review,

then the platform blocks or flags submission until the AI output is
accepted, edited, rejected, or escalated.

Given a creator drafts a safeguarding scenario with AI,

when the AI output is saved,

then the block is marked high-risk and specialist review is required
before Publish.

Given AI drafts a final test item,

when the creator adds it to the final test,

then the item must be linked to a course block or required action and
marked human-verified before publication.

Given a course uses AI-assisted proof instructions,

when the course is submitted for Review,

then the reviewer can see the AI task, human decision, safety review
status, and final approved wording.

# 29. Recommended Repo Placement

This annex should be saved as:

docs/specs/core-workflow/ANNEX_07_AI_AUTHORING_GUARDRAILS_AND_REVIEW_LOG.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_07_AI_AUTHORING_GUARDRAILS_AND_REVIEW_LOG.md

Defines AI-assisted authoring boundaries, approved/prohibited AI uses,
block-level AI context, human review requirements, AI status fields,
review log structure, sensitive-content rules, and Codex implementation
criteria.

# 30. Success Standard for This Annex

This annex is successful when:

> Codex and developers can implement AI-assisted authoring that helps
> creators draft practical, accessible, locally relevant course content
> while preserving approved Analysis and Design context, human review,
> safeguarding, data safety, certificate rules, proof verification
> boundaries, and publication control.

In practical terms, this annex should prevent:

> “AI generated course content, final test items, proof instructions, or
> donor-facing claims that were published without human review.”

And ensure:

> “AI helps draft block-level content from approved context; creators
> review and edit it; reviewers can see where AI was used; high-risk
> content receives specialist review; and AI never approves, publishes,
> certifies, verifies proof, or awards badges.”

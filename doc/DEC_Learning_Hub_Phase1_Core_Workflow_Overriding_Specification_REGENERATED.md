
# DEC Learning Hub Phase 1 — Core Workflow Overriding Specification

**Repo-ready consolidated specification for Codex planning and implementation**

**Status:** Consolidated source-of-truth supplement for Phase 1 build  
**Primary baseline:** `Project Description - DEC Learning Hub Phase 1 (1).docx`  
**Override rule:** For the **core workflow and workflow behavior**, this consolidated specification overrides any less explicit, less operational, or more generic interpretation in the Project Description. The Project Description remains the baseline for Phase 1 scope, platform areas, user roles, architecture, and delivery boundary. This document provides the required operational detail for building the core workflow correctly.

---

## 1. Purpose of this specification

This document consolidates all additional specifications extracted from the CSO Learning Design Handbook, the revised handbook comparisons, and the additional action-mapping/high-stakes training transcripts into one implementation-ready guide for the DEC Learning Hub Phase 1 repository.

It is intended to help Codex and the full-stack team plan, refine, implement, test, and verify the DEC Learning Hub as a **governed, mobile-first, accessible, workflow-driven learning platform for local and grassroots CSO capacity strengthening**.

The document is not a general concept note. It is a build specification. It should be used to:

- refine the implementation plan;
- identify missing data models, routes, components, and workflow states;
- prevent generic LMS behavior;
- guide creator portal implementation;
- guide learner runtime implementation;
- guide AI authoring behavior;
- guide review, publishing, monitoring, certificates, and telemetry;
- define acceptance evidence for Phase 1 delivery.

---

## 2. Source hierarchy and interpretation rules

### 2.1 Source hierarchy

When Codex or the development team encounters ambiguity, apply this order:

1. **This consolidated specification** — overriding source of truth for core workflow behavior, creator workflow, quality gates, learning-design guardrails, and workflow-level acceptance.
2. **Project Description - DEC Learning Hub Phase 1 (1).docx** — source of truth for Phase 1 product boundary, platform areas, roles, high-level architecture, and baseline delivery scope.
3. **Uploaded CSO Learning Design Handbook specification notes** — source for learning-design rationale, tools, templates, and action-mapping logic.
4. **Technical implementation constraints in the existing repo** — may guide implementation method, but must not weaken the product behavior required here.

### 2.2 Override principle

If the Project Description says “Diagnosis captures the learner problem,” this specification defines the actual required fields, validations, warnings, and progression behavior.

If the Project Description says “Build uses approved blocks,” this specification defines the required three-panel studio, block families, logic fields, accessibility prompts, and runtime parity rules.

If the Project Description says “Monitoring shows progress,” this specification defines canonical events, scenario path tendencies, action-linked signals, version-aware analytics, and revision-trigger behavior.

### 2.3 Product stance

Phase 1 must be implemented as:

> A secure, role-aware, multi-tenant, mobile-first, accessible digital learning platform that enables DEC to create, review, publish, deliver, monitor, and improve practical CSO capacity-strengthening courses through a structured, governed workflow.

Phase 1 must not become:

- a generic LMS;
- a file library;
- a PowerPoint or PDF upload portal;
- a blank-canvas course builder;
- a chatbot-driven course generator;
- a prototype shell with non-working workflow states;
- a disconnected collection of pages.

---

## 3. Core non-negotiables for the build

1. **Structured over freeform:** every course must move through guided workflow steps and structured records.
2. **Action over information:** courses must be built around observable learner actions, not vague knowledge transfer.
3. **Diagnosis before content:** creators must prove a real CSO practice/performance gap before building.
4. **Training only when appropriate:** the system must support stopping or pausing course creation when the issue is primarily environmental, resource-related, legal, or systemic.
5. **Mobile-first by default:** preview, review, and learner runtime must assume low-bandwidth mobile use.
6. **Governed block authoring:** lessons are built from approved blocks, not arbitrary HTML, slides, or blank-canvas objects.
7. **Runtime parity:** Preview and reviewer preview must render the actual learner runtime, not a mockup.
8. **Accessibility parity:** accessible versions must support equivalent learning participation, not minimal fallback.
9. **AI drafts, human decides:** AI must be workflow-aware, source-aware where factual content is involved, editable, and unable to publish.
10. **Review is a real gate:** creator completion does not equal publication.
11. **Published content is version-safe:** live learner content must not be mutated directly.
12. **Monitoring closes the loop:** course use must generate signals that support revision.
13. **Certificates must mean something:** certificates are issued only through rule-based completion logic and protected against informal/manual issuance.
14. **Evidence-based delivery:** no implementation claim is accepted without visible, testable product evidence.

---

## 4. Required platform areas

The Phase 1 application must contain four connected product areas inside one integrated system:

| Area | Primary users | Required purpose |
|---|---|---|
| Learner Platform | Learners from local/grassroots CSOs | Access, complete, resume, and revisit published courses; complete activities/final tests; access certificates. |
| Course Creator Portal | DEC staff and authorized creators | Create structured courses through Setup, Diagnosis, Capacity Map, Action Map, Storyboard, Build, Preview, Review, and Monitoring. |
| Review / Publishing Surface | Reviewers / publishers | Inspect submitted versions, preview runtime, comment, return, approve, and publish. |
| Admin Workspace | Admins | Manage users, roles, memberships, oversight, settings, and platform operations within Phase 1 scope. |

Each area must have its own route family, workspace shell, default landing page, role-aware navigation, and access enforcement.

---

## 5. User roles and permissions

### 5.1 Roles

The system must implement at least four product roles:

- Learner
- Creator
- Reviewer / Publisher
- Admin

Review and publishing may be separate permissions even if held by the same person in Phase 1.

### 5.2 Role behavior summary

| Role | Can do | Cannot do |
|---|---|---|
| Learner | Access assigned/available published courses; complete lessons, checks, final tests; view own progress and certificates. | Access creator/admin/review routes; see drafts, review notes, storyboard, AI notes, internal sources, or unpublished content. |
| Creator | Create/manage draft courses; complete workflow; use AI; preview; creator-side review; submit; monitor authorized courses; start revisions. | Publish directly unless granted; bypass review; edit live published content directly; access unauthorized admin records. |
| Reviewer / Publisher | Open submitted courses; preview learner runtime; comment; return; approve; publish where permitted; view review history. | Silently change creator content without trace; access unrelated admin functions unless granted. |
| Admin | Manage users, roles, organizations/memberships, platform settings, course oversight, certificate oversight, and operational logs within Phase 1. | Use future-state features outside Phase 1 or bypass lifecycle integrity without trace. |

### 5.3 Multi-tenant and membership model

The platform must not treat users as free-floating accounts. It must use:

- platform user identity;
- organization/tenant record;
- membership record linking user to organization;
- role assigned in the membership context.

All access checks must resolve both **organization context** and **role/permission context**.

### 5.4 Access enforcement layers

Access control must be enforced in three layers:

1. **Interface layer:** users only see relevant navigation and actions.
2. **Route/workspace layer:** protected routes block unauthorized access.
3. **Backend/data layer:** reads, writes, transitions, source access, AI actions, learner progress, and certificate records are permission-bound.

Hidden buttons are not authorization.

---

## 6. Course lifecycle and state machine

### 6.1 Required lifecycle states

Course versions must move through explicit lifecycle states:

1. Draft
2. In creator review / ready for creator review
3. Submitted for review
4. Returned for changes
5. Approved
6. Published
7. Revision draft
8. Replaced / archived

### 6.2 Allowed transitions

| Transition | Allowed actor |
|---|---|
| Draft -> Submitted for review | Creator, after required gates pass |
| Submitted for review -> Returned for changes | Reviewer / Publisher |
| Submitted for review -> Approved | Reviewer / Publisher |
| Approved -> Published | Publisher permission |
| Published -> Revision draft | Creator or authorized role from Monitoring/Revision action |
| Revision draft -> Submitted for review | Creator |
| Published -> Replaced/Archived | System after approved revision replaces old version, or authorized admin action |

### 6.3 Lifecycle integrity rules

- Course shell and course version must be separate concepts.
- Creators edit draft/revision versions only.
- Learners consume published versions only.
- Reviewers inspect submitted versions.
- Published content must not be edited directly in place.
- Revisions must clone the current published version into an isolated draft while the live version remains available.
- Learner progress, certificates, telemetry, and analytics must remain tied to the specific course version used.
- Historical analytics across versions must be preserved for comparison.

---

## 7. Course Creator Portal — global behavior

### 7.1 Creator workflow chain

The Creator Portal must implement this connected chain:

**Home -> My Courses -> Course Setup -> Diagnosis -> Capacity Map -> Action Map -> Storyboard -> Build -> Preview -> Review -> Submit for Review -> Review/Publish -> Monitoring -> Revision**

The creator should never need to restart the design logic at each page. Every stage must carry meaningful structured information into the next.

### 7.2 Workspace shell

All creator workflow pages must share:

- fixed top bar;
- stable left global creator navigation;
- active course workflow stepper;
- visible course context;
- consistent page actions;
- save/autosave status;
- clear next step;
- role-aware action controls.

### 7.3 Persistent workflow stepper

The stepper must show:

- Course Setup
- Diagnosis
- Capacity Map
- Action Map
- Storyboard
- Build
- Preview
- Review
- Monitoring

Current step must be highlighted. Previous steps should show complete/partial status. Future steps should be visible but locked or inactive until prerequisites are met.

### 7.4 Draft-safe behavior

The creator must be able to:

- save draft;
- autosave key forms;
- leave the workflow;
- return later;
- resume from the correct stage;
- reopen a course without losing structured inputs.

### 7.5 Course context persistence

Across pages, the system should preserve and surface key context such as:

- course title;
- learner group;
- diagnosis summary;
- capacity area;
- key learner actions;
- storyboard logic;
- current lesson context in Build;
- course status and next action.

---

## 8. Creator Home and My Courses

### 8.1 Creator Home

Creator Home must be a guided production dashboard, not a generic analytics dashboard.

It must include:

- welcome/orientation area;
- workflow overview band;
- clear “Start new course” action;
- active drafts;
- submitted courses;
- returned-for-revision courses;
- published courses;
- one clear next-step focus panel;
- lightweight guidance/help;
- separation between design work and monitoring work.

If the creator has an active course, Home should highlight the next required workflow step. If not, it should direct the creator to start a course.

### 8.2 My Courses / Course Management

My Courses must support status-based organization with filters/tabs:

- Draft
- In progress
- Ready for review
- Submitted
- Returned for changes
- Approved
- Published
- In revision
- Archived

Each course card/list item should show:

- title;
- status;
- current workflow step;
- last edited date;
- assigned creator/team;
- next action;
- review status;
- course version if relevant.

---

## 9. Course Setup specification

### 9.1 Purpose

Course Setup creates the course shell. It must not attempt to do diagnosis, action mapping, or lesson planning.

### 9.2 Required fields

Course Setup must capture:

- course title;
- short summary;
- primary learner group;
- secondary learner group where useful;
- learner role/category;
- organization type if relevant;
- main language;
- language level/style;
- course format;
- estimated time;
- expected number of modules;
- course level;
- broad topic/capacity area;
- creator;
- team/unit;
- target draft completion date;
- course visibility/access assumption;
- high-stakes/sensitive course flag where relevant;
- expected completion/certificate logic at high level, if known.

### 9.3 Learner reality checks

Course Setup or Diagnosis should include learner reality fields:

- likely device;
- connectivity constraint;
- digital confidence level;
- time pressure;
- language level;
- accessibility considerations;
- civic-space sensitivity;
- immediate work pressure;
- high-stakes urgency if relevant.

These fields should influence AI suggestions, storyboard choices, block recommendations, review checks, and mobile/low-bandwidth warnings.

---

## 10. Diagnosis specification

### 10.1 Purpose

Diagnosis captures the real CSO practice/performance gap and determines whether a digital learning course is an appropriate response.

The system must prevent creators from starting content production based only on a vague topic or training request.

### 10.2 Required fields

Diagnosis must capture:

- surface training request;
- visible performance failure evidence;
- current reality: what staff/CSOs are doing now;
- desired reality: what they should do instead;
- affected learner group;
- where the problem appears;
- field evidence sources;
- evidence type;
- evidence date/period;
- key findings;
- one or more real examples;
- KSME gap type: Knowledge, Skill, Motivation/Mindset, Environment/Resource;
- course-addressable part of the problem;
- non-course issue flag;
- alternative intervention recommendation where relevant;
- recommended next step.

### 10.3 Evidence requirement

Progression beyond Diagnosis must require at least one evidence entry. Evidence may include:

- baseline assessment;
- rejected donor report;
- field observation;
- CSO self-assessment;
- reviewer note;
- technical assessment;
- audit finding;
- MEL data;
- stakeholder feedback;
- regulatory or donor requirement.

The system should not accept “we think this is needed” as sufficient without evidence or justification.

### 10.4 KSME behavior

The KSME selection must affect later workflow behavior:

| KSME type | Platform behavior |
|---|---|
| Knowledge | Course may proceed; recommend explanation, checklist, accordion, job aid, short quiz. |
| Skill | Course may proceed; recommend scenario, simulation, matching, sequence/order, case question, practical task. |
| Motivation/Mindset | Course may proceed only with justification; recommend reflection, peer story, real-world consequence scenario, comparison case. |
| Environment/Resource | Course should not proceed as normal; trigger non-course intervention path or require isolating a smaller knowledge/skill component. |

### 10.5 Intervention Pivot Matrix

Diagnosis must include an **Intervention Fit Check**.

If the issue is environmental/resource/systemic, the system should:

- save the diagnosis;
- mark it as “Non-course intervention recommended”; 
- record alternative intervention;
- allow export/share of diagnostic note;
- pause or close course workflow without forcing Build progression.

Alternative interventions may include:

- mentoring/coaching;
- organizational restructuring;
- donor policy change;
- advocacy;
- core/admin funding;
- equipment/infrastructure support;
- legal/policy support;
- peer exchange;
- simplified tool/template;
- other.

### 10.6 Build lock rule

The Build Studio must remain locked until minimum requirements are met:

- Course Setup complete;
- Diagnosis evidence entered;
- KSME gap selected;
- course-addressable gap confirmed;
- Capacity Map selected;
- at least one observable learner action added;
- Storyboard structure completed or approved according to the current workflow rule.

---

## 11. Capacity Map specification

### 11.1 Purpose

Capacity Map places the course within a CSO institutional capacity domain. It must not be implemented as a generic topic/category selector.

### 11.2 Required fields

Capacity Map must capture:

- primary capacity area;
- sub-area;
- capability focus or level;
- linked reference standard;
- capacity outcome;
- why this capacity matters;
- relation to diagnosis;
- monitoring relevance.

### 11.3 Capacity areas

Initial capacity areas should include:

- Governance;
- MEAL;
- Financial management;
- Grants and donor compliance;
- HRBA;
- Safeguarding / PSEA;
- Advocacy and civic space;
- Proposal/project design;
- Accountability and transparency;
- Organizational sustainability;
- Inclusion and gender equality;
- Data/privacy and responsible information handling.

### 11.4 Reference standards

Capacity Map should support linking to:

- Global Standard for CSO Accountability commitments;
- Istanbul Principles;
- EU DG NEAR indicators;
- OECD/DAC enabling civil society guidance;
- DEC/WHH internal standard;
- other approved standard.

---

## 12. Action Map specification

### 12.1 Purpose

Action Map translates diagnosis into observable learner actions and practice needs. It must reject vague knowledge objectives.

### 12.2 Four Pillars of DEC Action Map

Action Map must be structured around four pillars:

1. Capacity Goal
2. Observable Actions
3. Practice Scenarios
4. Essential Information

### 12.3 Pillar 1 — Capacity Goal fields

- capacity goal;
- linked standard/indicator;
- why it matters for local CSOs;
- what success looks like;
- individual learner outcome;
- organizational practice outcome where relevant.

### 12.4 Pillar 2 — Observable Actions fields

Each learner action must capture:

- action verb;
- who performs it;
- where it happens;
- why it is difficult;
- common mistake;
- importance rating;
- difficulty rating;
- frequency rating;
- KSME link;
- evidence link;
- related capacity standard;
- expected signal of progress.

### 12.5 No vague verbs validation

Action Map should flag or reject vague verbs such as:

- understand;
- know;
- appreciate;
- be aware of;
- learn about;
- become familiar with.

Prompt replacement with observable verbs such as:

- draft;
- identify;
- classify;
- submit;
- compare;
- report;
- map;
- assess;
- choose;
- document;
- publish;
- revise.

### 12.6 Pillar 3 — Practice Scenarios fields

Each scenario should capture:

- scenario title;
- real CSO situation;
- learner role;
- decision the learner must make;
- correct/strong choice;
- common weak/passive choice;
- risky/harmful choice;
- consequence feedback;
- coaching note;
- suggested block type;
- monitoring signal;
- civic-space/safeguarding risk flag if relevant.

### 12.7 Pillar 4 — Essential Information fields

Every content item should be classified as:

- Need to do;
- Need to know;
- Nice to know;
- Job aid/template;
- Optional resource;
- Delete.

The platform should prioritize **Need to do** over passive information.

### 12.8 DIF Matrix

The system should include a Difficulty/Importance/Frequency triage tool.

Treatment recommendations:

| DIF result | Recommended treatment |
|---|---|
| Low difficulty / low importance | Delete or optional resource. |
| Low difficulty / high frequency | Quick checklist/job aid. |
| High importance / low frequency | Job aid + short scenario. |
| High difficulty / high importance / high frequency | Full interactive scenario/simulation. |

---

## 13. Storyboard specification

### 13.1 Purpose

Storyboard is a structured build contract. It must not be treated as optional notes.

### 13.2 Required lesson-level fields

For each lesson, Storyboard must capture:

- module name;
- lesson title;
- lesson purpose;
- linked learner action;
- linked capacity goal;
- reason this lesson/block exists;
- learning mode;
- learning flow;
- planned block sequence;
- planned interaction;
- knowledge check/output;
- media requirement;
- download/job-aid requirement;
- accessibility note;
- AI build handoff note;
- high-stakes/critical action note where relevant.

### 13.3 Auto-feed from Action Map

When the creator opens Storyboard, the system should auto-display:

- capacity goal;
- learner actions;
- common mistakes;
- learning support type;
- suggested practice activity;
- essential information;
- linked standard.

The creator should build each lesson against these preloaded action items, not start from a blank storyboard.

### 13.4 Storyboard to Build handoff

Storyboard should generate the initial Build Studio structure.

Examples:

- Scenario mode -> suggest Scenario Card or Decision Branch.
- Checklist mode -> suggest Checkbox List or Download.
- Reflection mode -> suggest Reflection Prompt.
- Practice mode -> suggest Knowledge Check, Matching, Sequence, Short Answer, Case Question.
- High-stakes urgent mode -> suggest Urgent Job Aid and Critical Action First pattern.

### 13.5 Pre-Build SME safety gate

For sensitive courses, add a Storyboard Approval Gate before Build.

Review should check:

- cultural appropriateness;
- legal/civic-space safety;
- local realism;
- advocacy language;
- safeguarding/PSEA risk;
- donor/legal reference accuracy;
- whether a scenario could put a CSO or community member at risk.

---

## 14. Build Studio specification

### 14.1 Purpose

Build Studio turns the structured storyboard into actual lesson content using governed blocks.

### 14.2 Required layout

Build Studio must use a three-panel layout:

**Left panel — Structure + block library**

- course outline;
- module list;
- lesson list;
- current lesson;
- add block menu;
- block categories grouped by learning purpose;
- source/assets access where permitted.

**Center panel — Lesson canvas**

- vertical learner-like block flow;
- drag/reorder blocks;
- add-block empty state;
- incomplete block indicators;
- block status markers;
- learner-action link indicators.

**Right panel — Block setup + AI + accessibility**

- selected block content fields;
- settings;
- rules/logic;
- accessibility metadata;
- AI action buttons;
- source context indicator;
- preview status;
- quality warnings.

### 14.3 Governed block model

The Build Studio must minimize or remove freeform decorative controls such as:

- arbitrary fonts;
- arbitrary colors;
- freeform positioning;
- decorative shadows;
- overlapping objects;
- unrestricted image sizing;
- slide-like canvases.

Use approved DEC design variants that preserve accessibility, consistency, mobile responsiveness, and brand identity.

### 14.4 Block grouping by learning purpose

The block library should be grouped by learning purpose:

| Purpose | Blocks |
|---|---|
| Explain | Heading, Paragraph, Statement, Note, Quote, List, Table |
| Show | Image, Image with text, Chart, Video, Audio, Download |
| Reveal | Accordion, Tabs, Flip cards, Timeline, Process steps, Callout/reveal |
| Practice | Scenario card, Decision branch, Matching, Sequence/order, Case question, Short answer, Matrix mapping |
| Check | Multiple choice, Multi-select, True/false, Final test question |
| Apply | Reflection prompt, Action commitment, Downloadable template, Checklist, Urgent Job Aid |

### 14.5 Required block families

The system should support at least:

- Text: paragraph, heading, subheading, two-column text, table;
- Statement: standard statement, note;
- Quote: single quote, quote carousel;
- List: bulleted, numbered, checkbox;
- Image: standard, image with text, full-width, gallery, carousel, grid;
- Multimedia: video, audio, file download, embedded content, transcript/caption support;
- Interactive: accordion, tabs, flip cards, hotspots, timeline, process steps, callout/reveal, continue block, reflection prompt, scenario card, decision branch, interactive widget;
- Knowledge Check: multiple choice, multi-select, true/false, matching, short answer, sequence/order, case question;
- Chart: bar, line, pie/donut, comparison chart;
- Divider: standard divider, section divider, spacer;
- Image Comparison: before/after slider, side-by-side comparison;
- Custom/Advanced: controlled embed or advanced widget shell, only where safe and accessible.

### 14.6 Block internal structure

Each block must preserve:

- content;
- settings;
- rules;
- accessibility metadata;
- linked learner action;
- linked capacity standard where relevant;
- telemetry label where relevant.

### 14.7 Right-panel logic for interactive blocks

For interactive/scenario blocks, the right panel must include:

- decision options;
- correct/strong path;
- weak/passive path;
- risky/harmful path;
- feedback;
- consequence;
- retry behavior;
- completion rule;
- telemetry label;
- linked action;
- linked standard;
- accessibility description.

### 14.8 Matrix mapping interaction

Support a matrix mapping block for stakeholder mapping and similar tools:

- stakeholder/action cards;
- drag/drop or tap-to-place behavior;
- influence/interest or power/proximity grid;
- feedback on placement;
- retry;
- downloadable blank/completed template.

### 14.9 Large table warning

Build and Preview should warn when a table is not mobile-safe:

- too many columns;
- too much cell text;
- horizontal scrolling required;
- tiny mobile text.

Suggested alternatives:

- accordion;
- comparison cards;
- stacked rows;
- downloadable reference;
- short summary + optional file.

### 14.10 Resource transformation feature

Add a guided feature called **Transform Resource into Learning Blocks**.

It should help creators turn:

- PDF -> accordion/checklist/job aid;
- toolkit -> scenario + downloadable template;
- compliance guidance -> step-by-step process;
- case study -> branching scenario;
- framework -> matching/sorting activity;
- long manual -> short mobile-first lesson sequence.

---

## 15. High-stakes and urgent learning design

### 15.1 High-stakes design lens

For courses involving safeguarding, legal protection, advocacy, civic space, human rights, emergency referral, data privacy, or community risk response, the platform must include a high-stakes design/review lens.

Checklist:

- Can the learner find the most urgent practical answer quickly?
- Are critical action steps visible early?
- Is dangerous advice avoided?
- Can the learner use the content under stress, low battery, and poor connectivity?
- Are urgent job aids easy to access?
- Is the content safe in the local civic-space context?

### 15.2 Critical Action First pattern

For high-stakes lessons, support this pattern:

1. What to do now
2. What not to do
3. Why it matters
4. Practice scenario
5. Downloadable/job-aid version
6. Deeper explanation, optional

### 15.3 Urgent Job Aid block

Support an Urgent Job Aid block or tagged job-aid format with:

- short title;
- immediate action steps;
- warning / do-not-do note;
- contact/referral information if applicable;
- offline/download option;
- print-friendly or screenshot-friendly version;
- last updated date;
- related course/module;
- source/reference basis.

### 15.4 Battery/time/data cost metadata

Storyboard, Build, Preview, and Review should display or require:

- estimated lesson time;
- estimated module time;
- approximate media/data burden;
- warning for long videos or large downloads;
- “Can this be completed in 10–15 minutes?” check for micro-lessons;
- “Critical content available without video” check.

---

## 16. Preview specification

### 16.1 Purpose

Preview must show the actual draft learner runtime. It must not be a superficial simulation.

### 16.2 Required modes and actions

Preview must support:

- lesson selector;
- mobile view by default or strongly emphasized;
- desktop/tablet view;
- reset/restart preview;
- learner-like interaction with checks, scenarios, and branches;
- low-bandwidth media warning;
- accessibility quick check;
- final test simulation;
- certificate condition visibility where relevant.

### 16.3 Preview quality checklist

Preview should ask creators to confirm:

- Does the lesson feel practical?
- Does it avoid information dumping?
- Is the learner making decisions or practicing?
- Is the language plain and CSO-friendly?
- Can this be completed on a small phone?
- Does the scenario feel locally realistic?
- Are downloads/job aids useful?
- Are instructions clear?
- Does the course show certificate requirements clearly?
- Does the final test measure real application?
- Are tables/dense content mobile-safe?

### 16.4 Desktop fantasy prevention

Preview should prevent desktop-first assumptions:

- mobile preview visible by default;
- warnings for overly long content;
- tap-target checks;
- media-size warnings;
- 5-inch phone preview mode where feasible;
- low-bandwidth warnings for large assets.

---

## 17. Creator Review and Formal Review / Publishing

### 17.1 Creator-side Review

Creator-side Review is the final quality checkpoint before submission. It must include:

- course fit;
- diagnosis alignment;
- action map alignment;
- structure and flow;
- lesson completeness;
- activities and checks;
- accessibility and clarity;
- mobile/low-bandwidth readiness;
- AI output review;
- submission readiness.

The page must surface unresolved issues, allow navigation back to Build/Preview, support creator sign-off, and submit into controlled review state.

### 17.2 Formal Review / Publishing Surface

The reviewer workspace must include:

- review queue;
- submitted course version view;
- learner runtime preview mode;
- reviewer checklist;
- block-level comments;
- return-for-changes note;
- approve button;
- publish button where permitted;
- decision history;
- status history;
- audit trail of who reviewed, returned, approved, or published.

Reviewers should comment, approve, return, or publish. They must not silently rewrite creator content unless the system records that intervention.

### 17.3 Required QA rubric

Formal review must check:

- strategic alignment;
- CSO contextual relevance;
- 4A framework;
- HRBA/charity-to-rights framing;
- Istanbul Principles/alignment risk;
- civic-space safety;
- safeguarding/do-no-harm;
- action orientation;
- accessibility;
- accessibility parity;
- low-bandwidth/mobile readiness;
- assessment quality;
- AI governance;
- certificate/completion logic;
- source/citation validity.

### 17.4 4A Review Checklist

- **Addition:** local Ethiopian/CSO context, HRBA, MEAL, and relevant standards added.
- **Deletion:** unnecessary jargon, donor-speak, and nice-to-know content removed.
- **Adjustment:** mobile, low-bandwidth, plain language, and learner reality addressed.
- **Alignment:** CSO standards, rights principles, accessibility, legal/civic-space realities respected.

### 17.5 Runtime review requirement

Reviewer approval must require runtime preview, not script/document review only.

Reviewer checklist should record:

- viewed in mobile mode;
- interacted with scenarios/checks;
- tested downloads;
- checked final test behavior;
- checked certificate condition;
- checked accessibility basics;
- confirmed no creator/internal labels appear.

### 17.6 Return with remediation instruction

When returning a course, reviewers should classify issues and recommend fixes:

- mobile layout issue -> convert table to accordion/cards;
- too much text -> chunk into blocks;
- unsafe advocacy language -> revise scenario;
- AI wording risk -> source-check and rewrite;
- missing accessibility metadata -> add required metadata;
- weak assessment -> replace recall quiz with practice scenario.

---

## 18. Learner Platform specification

### 18.1 Learner workflow

Learner workflow must be:

**Sign in -> Learner Home -> Course Access -> Course Player -> Lesson Progress -> Activities/Final Test -> Completion -> Certificate/Completion Outcome -> Return/Revisit**

### 18.2 Learner Home

Learner Home must include:

- welcome area;
- assigned/current courses;
- continue learning prompt;
- progress summary;
- completed courses;
- certificate access area;
- light support/help access;
- next lesson button;
- clear course start/resume action.

### 18.3 Course access

Learners can only access:

- assigned courses;
- courses available to their permitted learner context;
- intentionally exposed eligible courses.

Direct URL access must not bypass course entitlement.

### 18.4 Course Player layout

Course Player must include:

- course title;
- module navigation;
- lesson navigation;
- current lesson title;
- progress indicator;
- learner-facing lesson blocks;
- next/continue button;
- previous/back option where appropriate;
- downloads/resources area;
- activity/check area;
- final test entry point;
- completion status.

It must not expose creator-facing labels such as block type, storyboard, AI note, draft, review, or internal readiness labels.

### 18.5 Learner progression and resume

The platform must track:

- course opened;
- lesson started;
- lesson completed;
- current position;
- in-progress state;
- course progress;
- activity/check completion;
- final test status;
- course completion;
- certificate earned.

Learners must be able to leave and return, resume from the correct point, revisit completed lessons where allowed, and access earned certificates later.

### 18.6 Prevent passive “Next-button marathon”

The learner runtime and review checks should prevent long passive click-through courses.

Every lesson should include at least one active learning moment where appropriate:

- scenario choice;
- reflection prompt;
- checklist interaction;
- knowledge check;
- sorting/matching;
- short response;
- downloadable job aid application;
- action commitment.

Lessons with only text/image/video should be flagged as too passive unless intentionally justified.

---

## 19. Assessments, completion, certificates, and evidence

### 19.1 Assessment settings

Assessments/final tests should support:

- title;
- required/optional status;
- pass threshold;
- number of allowed attempts;
- retry allowed/not allowed;
- feedback per answer;
- feedback after submission;
- answer review setting;
- certificate requirement flag;
- attempt record;
- highest-score or latest-score logic.

### 19.2 Completion rules

Completion must be configurable and rule-based. Rules may include:

- required lessons completed;
- required activities/checks completed;
- final test submitted;
- pass threshold met;
- scenario score met;
- successful scenario path completed;
- evidence/action commitment submitted;
- reviewer/creator validation if configured.

### 19.3 Scenario-threshold certification

Certificate rules should support threshold-based scenario performance, not only final-test score.

Example:

> Certificate requires at least 80% performance on the hostile stakeholder meeting scenario.

### 19.4 Certificate engine

Certificate system must support:

- certificate template;
- learner name;
- course title;
- completion date;
- score/result if appropriate;
- unique certificate ID;
- issuer information;
- downloadable PDF;
- learner profile certificate record;
- admin/reviewer visibility where authorized;
- re-download later;
- verification-ready structure even if public verification is basic in Phase 1.

### 19.5 Manual override rule

Manual certificate override should be disabled by default or restricted to admin/senior role. If enabled, it must require:

- reason;
- audit log;
- authorized role;
- visible marker if manually overridden.

### 19.6 Evidence-based and delayed completion

For selected courses, completion may require evidence submission:

- draft Board Terms of Reference;
- simplified financial summary;
- stakeholder map;
- MEAL outcome survey draft;
- public accountability post link;
- policy checklist.

Delayed completion should support:

- learner finishes digital lessons;
- learner receives pending application task;
- learner submits evidence/action commitment within timeframe;
- system marks course complete after submission or validation;
- certificate becomes available.

### 19.7 Capacity evidence package

For selected courses, learner/organization should be able to access a capacity evidence package containing:

- certificate;
- course title and capacity area;
- completion date;
- score/result;
- action commitment or uploaded output;
- linked standard/indicator;
- issuer information.

This can be data-model ready in Phase 1 even if the full export UI is limited.

---

## 20. AI Authoring System specification

### 20.1 AI stance

AI is a workflow-aware authoring assistant, not an autonomous course generator.

AI must:

- work from structured course context;
- use approved source/context materials for factual/sensitive content;
- draft only;
- remain editable;
- stay inside the block model;
- never publish;
- never move workflow state automatically.

### 20.2 AI surfaces

AI support should be available primarily in:

- Storyboard;
- Build.

It may also assist with wording, summarization, and review prompts elsewhere, but Storyboard and Build are the main AI surfaces.

### 20.3 Required AI context

AI actions should be bound to:

- current course;
- course version;
- module/lesson;
- course title and summary;
- learner group;
- diagnosis summary;
- capacity area;
- learner actions;
- learning mode;
- storyboard structure;
- lesson purpose;
- lesson-level AI notes;
- approved source/context materials.

### 20.4 Required AI actions

AI should support:

- draft lesson from storyboard;
- draft block;
- suggest better block type;
- draft scenario;
- draft knowledge check;
- simplify language;
- make content more local/practical;
- condense for mobile;
- remove jargon;
- convert to checklist;
- convert to accordion;
- generate feedback;
- rewrite in peer-to-peer tone;
- check for civic-space risk;
- check for corporate language;
- check accessibility/readability.

### 20.5 Source-aware and sensitive-content rule

For sensitive topics, AI must require approved sources before drafting substantive guidance.

Sensitive topics include:

- legal compliance;
- CSO registration;
- advocacy in restricted civic space;
- safeguarding/PSEA;
- financial reporting;
- donor compliance;
- human rights risk;
- government engagement.

If no approved source is attached, AI should only offer structure, wording, or placeholder prompts, not factual guidance.

AI may assist with language, chunking, tone, and formatting without a source, but factual/technical guidance must be grounded in approved sources.

### 20.6 AI output behavior

AI-generated content must:

- appear as editable draft/suggestion;
- be associated with lesson/block;
- be accepted, edited, rejected, or regenerated by creator;
- not silently overwrite approved content;
- not create unsupported runtime structures;
- be traceable enough to know what AI action was used.

### 20.7 AI UX copy

Use labels like:

- “AI draft — review required”;
- “Use this as a starting point”;
- “Creator approval required before saving”;
- “AI cannot publish”;
- “Check for local safety and accuracy.”

Avoid:

- “Generate final course”;
- “Auto-create approved lesson”;
- “Publish AI content.”

---

## 21. Source and asset management

### 21.1 Source vs asset

Separate:

- **Sources:** reference/context materials used for design and AI grounding.
- **Assets:** media/files used in course delivery.

### 21.2 Source classification

Sources should be classifiable as:

- donor guideline;
- legal/policy document;
- CSO toolkit;
- case study;
- training manual;
- template/job aid;
- assessment/baseline report;
- local example;
- approved reference standard.

### 21.3 Source/asset attributes

Each source/asset should support:

- internal-only;
- available to creators;
- approved for AI use;
- approved for learner download;
- linked to course;
- linked to lesson;
- linked to block;
- citation/credit required;
- sensitive/restricted;
- versioned asset;
- language variant;
- source summary;
- last updated/reviewed.

Learners must not access internal creator sources. AI must not access unauthorized or non-approved sources.

---

## 22. Monitoring, analytics, and telemetry

### 22.1 Purpose

Monitoring must support learner progress, course improvement, platform oversight, and evidence-ready reporting. It must not be a decorative dashboard.

### 22.2 Canonical event-based telemetry

Implement a canonical event schema. Events should include:

- learner ID/user ID;
- organization/tenant;
- course ID;
- course version ID;
- module ID;
- lesson ID;
- block/activity ID where applicable;
- timestamp;
- event type;
- role/workspace context;
- score/path/result where relevant;
- privacy-safe device/context metadata where appropriate.

### 22.3 Required event families

Learner events:

- course_started / course_opened;
- module_opened;
- lesson_started;
- lesson_completed;
- block_viewed;
- activity_opened;
- activity_completed;
- knowledge_check_submitted;
- final_test_started;
- final_test_submitted;
- scenario_started;
- scenario_choice_selected;
- scenario_feedback_viewed;
- scenario_completed;
- reflection_submitted;
- action_commitment_submitted;
- course_completed;
- certificate_earned;
- certificate_viewed/downloaded;
- dropoff_detected where derived.

Creator/workflow events:

- course_created;
- draft_saved;
- workflow_step_completed;
- storyboard_created/updated;
- lesson_built/marked ready;
- preview_opened;
- course_submitted;
- course_returned;
- course_approved;
- course_published;
- revision_created.

### 22.4 Creator Monitoring page

Monitoring must be course-specific and action-linked. It should show:

- course overview;
- learners started/completed;
- completion rate;
- average/indicative time;
- recent activity;
- learner progress by lesson;
- drop-off points;
- lesson performance;
- checks and scenario performance;
- scenario path tendencies;
- action commitments;
- certificate outcomes;
- signals of change linked to Action Map;
- improvement notes;
- revision trigger.

### 22.5 Scenario analytics

For scenarios, capture and present:

- scenario started;
- choice selected;
- branch/path followed;
- failed decision point;
- retry behavior;
- completion;
- common wrong choice;
- block where learner exits;
- feedback viewed/not viewed;
- percentage choosing passive/risky/safe response;
- misconception pattern;
- improvement after revision.

### 22.6 Safeguarding/PSEA risk flags

For safeguarding courses, monitoring should flag dangerous tendencies:

- majority choose silence/non-reporting;
- majority choose informal handling of serious violation;
- majority defer to senior staff despite risk;
- majority fail to identify harm/exploitation;
- majority avoid survivor-centered response.

These should trigger urgent review/revision.

### 22.7 Weak-signal classification

When monitoring shows a weak point, creators should classify it as:

- content unclear;
- scenario too difficult;
- instructions confusing;
- mobile/accessibility issue;
- learner lacks prerequisite knowledge;
- deeper sector-wide skill gap;
- diagnosis needs revision;
- source/policy outdated.

This classification should guide whether to revise content, return to Diagnosis/Action Map, or mark a non-course support issue.

### 22.8 Version-bound analytics

Events and outcomes must be tied to course version. When a new version replaces an old one:

- old version analytics remain stored;
- new version analytics start separately;
- monitoring can compare old vs new performance;
- learner records remain tied to the version used;
- certificates preserve completed version.

### 22.9 Revision loop

From Monitoring, creator should be able to create revision. Revision action must capture reason:

- high drop-off;
- high failure rate;
- scenario misconception;
- policy/legal update;
- accessibility issue;
- content outdated;
- learner feedback;
- reviewer/admin request;
- diagnosis refinement.

Revision creates a draft clone of the published version. Existing published version stays live until the revision is approved/published.

### 22.10 Signals of change — bounded interpretation

Monitoring may show course-level evidence signals linked to learner actions, but must not overclaim full institutional impact. It can support improvement-oriented judgments, not replace external evaluation.

---

## 23. Admin and operational controls

Admin Workspace must include:

- user management;
- role assignment;
- organization/membership management;
- course oversight;
- review/publishing oversight;
- certificate record oversight;
- source/asset oversight where relevant;
- platform settings within Phase 1;
- basic analytics/usage overview;
- admin activity logs;
- ability to deactivate users;
- ability to correct role assignments;
- operational status/health visibility where feasible.

Operational monitoring should include:

- client-side error logging;
- server-side error logging;
- uptime/health endpoint;
- admin activity audit logs;
- publish/unpublish audit events;
- role-change audit events;
- failed access attempt logs where feasible.

---

## 24. Accessibility, mobile, and low-bandwidth requirements

### 24.1 Accessibility baseline

Implement WCAG 2.1 AA-aligned behavior where feasible for Phase 1:

- semantic HTML;
- correct heading hierarchy;
- keyboard navigation;
- visible focus states;
- screen-reader labels;
- alt text for images;
- transcripts for audio/video;
- captions where video is used;
- sufficient color contrast;
- form labels and error messages;
- accessible quiz controls;
- accessible accordions/tabs/interactives;
- JAWS/NVDA compatibility checks where feasible.

### 24.2 Blocking accessibility prompts

The system should block submission/review if required accessibility metadata is missing:

- image alt text;
- video transcript/caption;
- audio transcript;
- labels for interactive controls;
- keyboard/screen-reader accessibility for final test controls;
- unacceptable contrast.

### 24.3 Accessibility parity

Accessible versions must preserve the same learning purpose:

- alt text should communicate instructional meaning, not just decoration;
- transcripts should include key explanations/instructions;
- screen-reader labels should support full participation;
- keyboard navigation should allow equivalent interaction.

### 24.4 Low-bandwidth readiness

Phase 1 should include:

- compressed images;
- lazy loading;
- efficient video delivery;
- transcript alternatives;
- file-size warnings;
- caching/CDN where feasible;
- mobile network simulation testing;
- low-bandwidth QA scenario;
- fallback if video cannot load;
- warning for unnecessary heavy media.

### 24.5 Plain-language/readability

The platform should support:

- short sentences;
- simple headings;
- consistent terminology;
- glossary/tooltips where useful;
- plain-language prompts;
- avoidance of dense donor/legal jargon;
- readability review in Preview/Review;
- ESL-friendly text.

---

## 25. Privacy, data protection, backup, and runbook

### 25.1 Data protection

Define and enforce:

- minimum learner data required;
- who can view learner progress;
- who can view quiz attempts;
- who can view certificates;
- retention period for progress records;
- retention period for quiz attempts;
- retention period for certificates;
- retention period for audit logs;
- incident escalation path;
- least-privilege access.

### 25.2 Backup and recovery

Phase 1 should include:

- database backup schedule;
- object/file storage backup or versioning approach;
- recovery checklist;
- restore validation procedure;
- admin runbook;
- guide for adding users;
- guide for assigning roles;
- guide for publishing courses;
- guide for resolving common issues.

---

## 26. Design system and brand rules

Use DEC brand palette:

- Primary: `#3B99D4`
- Secondary: `#91C852`
- Backgrounds: `#F9FAFB`, `#FFFFFF`
- Primary text: `#111827`

Style:

- clean;
- structured;
- minimal;
- calm;
- accessible;
- mobile-first;
- low-clutter;
- professional but CSO-friendly.

Contrast rules:

- `#111827` on `#FFFFFF` / `#F9FAFB` for readability;
- `#FFFFFF` on `#3B99D4` for primary CTA contrast;
- `#111827` on `#91C852` for green surfaces;
- avoid white on green for small text unless contrast is verified.

UI tone must feel like **peer-to-peer capacity sharing**, not corporate compliance training.

Use language such as:

- “What challenge is this course helping CSOs solve?”
- “What should the learner be able to do?”
- “What real situation will they practice?”
- “What tool can they use tomorrow?”
- “What should be removed because it is only nice-to-know?”
- “Respect learner time.”

Avoid:

- “employee performance”;
- “business goal”;
- “compliance training”;
- “corporate onboarding”;
- “maximize productivity”;
- “ROI training outcome.”

---

## 27. Built-in templates and tools

The following handbook tools should be embedded as guided forms, reusable templates, or helper panels:

1. DEC Learner Persona Guide
2. 4A Contextualization Checklist
3. CSO Capacity Diagnosis Template
4. Peeling the Onion Root-Cause Worksheet
5. KSME Gap Classifier
6. Intervention Pivot Matrix
7. Alternative Intervention Recommendation Form
8. 12 Commitments Reference Guide
9. Capacity Action Mapping Canvas
10. DIF Triage Matrix
11. DEC Lesson Storyboard and Build Plan Template
12. Scenario Blueprint
13. Stakeholder Matrix Mapping Template
14. AI Prompting Guardrails Checklist
15. AI Human Review Checklist
16. Technical and Quality Review Checklist
17. 4A Review Checklist
18. Civic-Space/Safeguarding Risk Checklist
19. CART Evaluation Matrix
20. Action Commitment Template
21. Evidence Submission Template
22. Revision Reason Form
23. Metric Dictionary
24. Delivery Evidence Pack Checklist

---

## 28. Quality warnings and smart prompts

The platform should provide warnings/prompts such as:

- “This course has no diagnosed knowledge or skill gap.”
- “This looks like a resource/environment issue. A course may not solve it.”
- “This lesson has no linked learner action.”
- “This lesson has too much text and no interaction.”
- “This lesson may become a Next-button marathon.”
- “This scenario may include civic-space risk. Please review.”
- “This AI-generated block has not been human-reviewed.”
- “This course has no certificate completion rule.”
- “This final test checks definitions only. Consider adding application questions.”
- “This source is internal-only and should not be exposed to learners.”
- “This course has not been previewed in mobile mode.”
- “This course has no action commitment or post-course application signal.”
- “This table may not be mobile-safe. Consider an accordion or card layout.”
- “This sensitive topic needs an approved source before AI can draft factual guidance.”

---

## 29. Route and page inventory for implementation planning

Codex should map the repo against at least the following route/page inventory. Route names may differ if the repo already has a cleaner convention, but the capabilities must exist.

### Public/Auth

- Landing / public entry
- Sign in
- Role-aware post-login redirect

### Learner

- Learner dashboard
- Course list / assigned courses
- Course detail / start page
- Course player
- Activity/check runtime
- Final test runtime
- Completion result
- Certificate page/download
- Learner profile/basic record

### Creator

- Creator Home
- My Courses
- Course Setup
- Diagnosis
- Capacity Map
- Action Map
- Storyboard
- Build Studio
- Preview
- Creator Review
- Sources/Assets
- Monitoring
- Revision workflow

### Review / Publishing

- Review queue
- Submitted course review
- Reviewer runtime preview
- Block/comment review
- Return for changes
- Approve
- Publish
- Review history

### Admin

- Admin dashboard
- User management
- Organization/membership management
- Role assignment
- Course oversight
- Review/publishing oversight
- Certificate records
- Source/asset oversight
- System/health/logs where feasible

---

## 30. Technical architecture expectations

Use the existing stack direction unless DEC explicitly approves a change:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Supabase
- Vercel

The architecture should support:

- one integrated application;
- route-aware workspaces;
- shared authentication;
- organization/membership-aware RBAC;
- structured relational data;
- course shell + course version model;
- governed block content model;
- learner runtime separated from draft authoring;
- server-side AI orchestration;
- permission-aware sources/assets;
- canonical event telemetry;
- certificate backend logic;
- development/staging/production environments.

Do not:

- flatten workflow data into one generic JSON blob;
- collapse course shell/version into one mutable record;
- build AI as a detached frontend chatbot;
- rely on client-only state for completion/certificates;
- mix draft and published runtime sources;
- build monitoring as decorative UI counters.

---

## 31. Acceptance criteria and evidence pack

### 31.1 Mandatory end-to-end journeys

Phase 1 is not ready unless these journeys are working and demonstrable:

1. Learner can sign in, access a published course, complete lessons/checks/final test, meet threshold, complete the course, and access certificate.
2. Creator can sign in, create a course, complete Setup -> Diagnosis -> Capacity Map -> Action Map -> Storyboard -> Build -> Preview -> Review, and submit for review.
3. Reviewer can open a submitted course, preview runtime, comment, return or approve, and publish where permitted.
4. Learners can only access published learner-facing versions.
5. Creator can open Monitoring, see course-level signals, record improvement decisions, and start revision.
6. Admin can manage users, roles, organizations/memberships, and platform oversight within Phase 1 scope.

### 31.2 Acceptance checks

The build is acceptable only if:

- Diagnosis includes KSME and course-fit logic.
- Environment/resource gaps can pause or stop course creation and record alternative intervention.
- Capacity Map links courses to CSO capacity domains and standards.
- Action Map includes capacity goal, observable actions, practice scenarios, DIF, and essential information.
- Storyboard is structured and feeds Build.
- Build uses governed blocks, not blank-canvas authoring.
- AI is structured, editable, source-aware for factual content, and cannot publish.
- Preview renders actual learner runtime.
- Review includes 4A, safeguarding, civic-space, accessibility, mobile, AI, and assessment checks.
- Learners cannot see draft/review/internal content.
- Completion and certificate logic are rule-based.
- Monitoring is event-based, version-aware, and action-linked.
- Revision creates a new draft version, not live mutation.
- Accessibility and low-bandwidth behavior are tested.
- Evidence pack is provided.

### 31.3 Evidence pack requirements

Codex/full-stack delivery should produce:

- screenshots or walkthrough of learner flow;
- screenshots or walkthrough of creator workflow;
- sample course;
- sample diagnosis;
- sample action map;
- sample storyboard;
- sample AI-generated draft with human review;
- sample Build Studio with blocks;
- sample mobile preview;
- sample review queue and comments;
- sample published learner course;
- sample learner completion;
- sample certificate;
- sample monitoring dashboard;
- sample revision initiation;
- RBAC/unauthorized route test evidence;
- accessibility test evidence;
- low-bandwidth/mobile test evidence;
- telemetry/metric dictionary;
- backup/recovery confirmation or plan;
- admin runbook notes.

### 31.4 Status discipline

Use truthful status labels:

- Not started
- Scaffolded
- Implemented
- Verified
- Accepted

Do not claim “complete” if only screens exist. A feature is not accepted until the relevant workflow is working, role-safe, data-backed, and evidenced.

---

## 32. Out-of-scope reminders for Phase 1

Do not overbuild:

- community of practice systems;
- peer-to-peer social networks;
- broad knowledge hub ecosystem;
- operational referral systems;
- sub-grant processing;
- advocacy campaign management;
- public certificate verification portal beyond verification-ready records unless explicitly approved;
- advanced BI/predictive analytics;
- fully offline app mode;
- complex multi-organization external marketplace;
- unrelated future-state platform services.

The architecture may remain ready for future extension, but the Phase 1 build must deliver the complete core learning product without scope drift.

---

## 33. Codex planning instruction

Before implementing, Codex should use this document and the Project Description to produce a refined implementation plan that includes:

- repo assessment and gap analysis;
- route/page inventory status;
- data model gap list;
- workflow state machine plan;
- role/access plan;
- Creator Portal implementation plan by workflow step;
- Learner Runtime implementation plan;
- Review/Publishing plan;
- Monitoring/telemetry plan;
- AI authoring plan;
- certificate/completion plan;
- accessibility/mobile/low-bandwidth verification plan;
- sprint-ready execution board;
- evidence pack checklist;
- risks and sequencing decisions.

Codex should be proactive in technical decisions, but it must preserve the intent and workflow behavior defined here. If implementation constraints require trade-offs, Codex should explain the trade-off and propose the closest Phase 1-safe implementation that maintains the core workflow logic.

# Annex 6: Build Studio Block Library Specification

**DEC Learning Hub Course Creator Portal**

## 1. Purpose of This Annex

This annex defines the Build Studio Block Library Specification for the DEC Learning Hub Course Creator Portal.

Its purpose is to help Codex/GPT-5.5, developers, course creators, reviewers, and DEC stakeholders implement the Build Studio as a governed flexible block-based authoring workspace.

The Build Studio should allow course creators to create rich, practical, interactive, accessible, and locally relevant courses for Ethiopian CSOs, while preserving alignment with the approved Analysis and Design records.

The core principle is:

The Build Studio should provide a full, expandable block library, but every required or creator-added block must remain linked to the approved course purpose, learner action, assessment logic, accessibility need, safeguarding requirement, or practical output pathway.

This annex should prevent two opposite mistakes:

- Over-restriction: a rigid builder that prevents course creators from adding useful learner support.

- Over-flexibility: a blank-canvas builder where creators add unrelated content, decorative elements, or untraceable blocks.

The correct model is:

Governed flexible authoring.

## 2. Source References Used

This annex draws from the refined Build Phase specification, the Course Creator Portal description, the core workflow overriding specification, and the uploaded block-library references.

The refined Build Phase specifies that Build begins after the Design-to-Build Handover, converts the approved design into a learner-facing course, and must balance governed course creation with flexible course building. It also states that creators may add blocks, but added blocks must be linked to an approved purpose such as required action, minimum information, learner practice, final test preparation, practical output, accessibility support, safeguarding note, or learner reflection.

The uploaded block references include standard block families such as Text, Statement, Quote, List, Image, Gallery, Multimedia, Interactive, Knowledge Check, Chart, Divider, Image Comparison, and Custom Code, with interactive subtypes such as accordions, tabs, labeled graphics, processes, scenarios, sorting activities, flashcards, buttons, timelines, checklists, reflections, case studies, matching, hotspots, tool activities, and assignment links.

The detailed block guide also shows that blocks should support accessibility practices, including keyboard/screen-reader testing, alt text for images, captions/transcripts for media, and scene descriptions for scenarios.

The core workflow overriding specification requires a three-panel Build Studio with a left structure/block library panel, center learner-like lesson canvas, and right block setup/AI/accessibility panel. It also requires governed block families and warns against arbitrary fonts, unrestricted colors, freeform positioning, overlapping objects, and slide-like canvases that weaken accessibility and consistency.

## 3. Product Identity of the Build Studio

The Build Studio is the course production workspace where approved course design becomes actual learner-facing content.

It should not be understood as:

- a generic page builder;

- a slide editor;

- a decorative web builder;

- a file upload space;

- a freeform HTML canvas;

- a chatbot-driven course generator.

It should be understood as:

A structured course authoring workspace that helps creators build practical CSO capacity-strengthening learning experiences from approved Analysis and Design records.

The Build Studio should support:

- required blocks from the approved Storyboard;

- creator-added blocks where useful;

- AI-assisted drafting;

- human review of AI output;

- final test configuration;

- practical proof configuration where enabled;

- accessibility and localization support;

- safeguarding and data safety prompts;

- learner preview;

- Build-to-Review Handover.

## 4. Build Studio Layout

The Build Studio should use a three-panel layout.

| Panel | Purpose |
| --- | --- |
| Left panel | Course structure and expandable block library |
| Center panel | Learner-like course canvas where blocks are assembled and edited |
| Right panel | Block properties, governance metadata, AI assistance, accessibility, safeguarding, and readiness checks |

This layout should help creators move between course structure, block authoring, and quality/governance settings without losing context.

## 5. Left Panel: Expandable Block Library

The left panel should contain:

- course outline;

- module list;

- lesson list;

- current lesson indicator;

- add-block menu;

- expandable block categories;

- searchable block library;

- recommended blocks based on approved Design-to-Build Handover;

- required block indicators;

- creator-added block indicators;

- source/resource access where permitted.

The left panel should allow creators to:

- browse block categories;

- expand and collapse categories;

- search block names;

- filter by purpose;

- add blocks to the center canvas;

- identify required blocks;

- identify recommended blocks;

- identify optional blocks;

- understand which blocks need justification.

The left panel should be practical and non-technical. It should help a course creator think:

“What kind of learning moment do I need here — explain, show, reveal, practice, check, apply, safeguard, or recognize?”

## 6. Block Library Organization by Learning Purpose

For DEC, the block library should be organized primarily by learning purpose, not only by technical block type.

This helps course creators choose blocks based on what the learner needs to do.

| Learning purpose | Use when the creator needs to… | Example blocks |
| --- | --- | --- |
| Structure | Organize the course flow | Section header, lesson intro, divider, lesson summary, progress note |
| Explain | Present essential information | Paragraph, heading, short explainer, definition, note, statement, FAQ |
| Emphasize | Highlight important ideas | Statement, warning, quote, key takeaway, callout |
| Show | Demonstrate or illustrate | Image, image with text, gallery, chart, video, audio, worked example |
| Reveal | Let learners explore content progressively | Accordion, tabs, flashcards, timeline, process, labeled graphic |
| Practice | Let learners apply or rehearse | Guided practice, checklist task, sorting, matching, sequencing, template completion |
| Decide | Let learners make judgment choices | Scenario, decision branch, dilemma card, case question |
| Reflect | Connect learning to real CSO work | Reflection prompt, action commitment, personal plan |
| Check | Test understanding | Knowledge check, MCQ, true/false, matching, sequencing, final test item |
| Apply | Support real-world output | Downloadable template, worksheet, job aid, practical proof instruction |
| Safeguard | Reduce risk | Safety note, anonymization warning, do-no-harm reminder, referral note |
| Access | Improve accessibility/localization | Transcript, alt text note, low-bandwidth alternative, printable version |
| Recognize | Support verified achievement pathway | Proof submission, review criteria, badge explanation |

This learning-purpose grouping should coexist with technical block families. Creators may browse by purpose or by block type.

## 7. Required Block Families

The Build Studio should support the following block families.

### 7.1 Structure and Navigation Blocks

Purpose:

To organize the course and help learners understand where they are, what comes next, and how the course flows.

Sub-blocks:

- course intro;

- module header;

- lesson intro;

- section header;

- divider;

- numbered divider;

- spacer;

- progress note;

- continue block;

- next-step instruction;

- lesson summary;

- course closing block.

Use for:

- guiding learners through the course;

- breaking long lessons into shorter sections;

- helping mobile users navigate;

- requiring learners to complete an interaction before moving forward;

- summarizing key points.

Governance requirements:

- should link to course flow or learner navigation need;

- should not be used only for decoration;

- continue blocks should be used after scenarios/processes where learners must complete the activity before moving on.

### 7.2 Text and Explanation Blocks

Purpose:

To explain only the essential information learners need to complete the required action, final test, practical task, or proof pathway.

Sub-blocks:

- heading;

- subheading;

- paragraph;

- two-column text;

- short explainer;

- key concept;

- definition;

- plain-language note;

- myth vs fact;

- do/don’t list;

- FAQ;

- glossary item;

- table.

Use for:

- introducing core concepts;

- explaining steps;

- defining terms;

- presenting small reference tables;

- simplifying complex donor or CSO terminology.

Governance requirements:

- must support minimum information, required action, assessment readiness, or learner support;

- long text should be split into shorter blocks;

- jargon should be explained;

- tables should be mobile-safe.

Accessibility requirements:

- text should be readable on mobile;

- headings should follow accessible structure;

- table content should be short and readable;

- large tables should trigger a mobile-safety warning.

### 7.3 Statement, Note, Warning, and Callout Blocks

Purpose:

To highlight important messages that learners should not miss.

Sub-blocks:

- statement;

- note;

- warning;

- key takeaway;

- reminder;

- do-no-harm callout;

- critical action callout;

- common mistake callout.

Use for:

- critical reminders;

- safety instructions;

- key standards;

- practical rules;

- common mistakes;

- high-stakes warnings.

Examples:

- “Do not upload real beneficiary names.”

- “Use outcome evidence, not only activity counts.”

- “A certificate is earned through the final test; practical proof is separate.”

- “If a safeguarding concern is reported, do not investigate the case yourself.”

Governance requirements:

- warning blocks related to safeguarding, data, civic-space, or proof submission should be visible to reviewers;

- high-stakes warning blocks may require specialist review.

### 7.4 Quote Blocks

Purpose:

To highlight voices, commitments, principles, or short statements from CSO practice, rights-based approaches, or DEC guidance.

Sub-blocks:

- single quote;

- quote with attribution;

- quote carousel;

- quote on image, only if accessible.

Use for:

- grounding the course in CSO voice;

- emphasizing accountability values;

- presenting short stakeholder statements;

- adding human relevance.

Governance requirements:

- should avoid unsupported or fictional quotes unless clearly marked as fictionalized;

- real quotes should be consented and safe;

- quote-on-image must maintain contrast and readability.

### 7.5 List Blocks

Purpose:

To present steps, criteria, principles, or checklist-style content clearly.

Sub-blocks:

- bullet list;

- numbered list;

- checklist;

- interactive checklist;

- do/don’t list;

- readiness list;

- step list.

Use for:

- referral steps;

- budget justification components;

- final test preparation;

- proof submission checklist;

- data safety checklist;

- governance meeting checklist.

Governance requirements:

- lists should support action, practice, or assessment;

- checklist items should be concise and observable.

### 7.6 Image and Visual Blocks

Purpose:

To show a visual, diagram, example, model, process, or local context.

Sub-blocks:

- single image;

- image with text;

- full-width image;

- annotated image;

- image with caption;

- diagram;

- infographic;

- image comparison;

- before/after image.

Use for:

- process diagrams;

- simplified workflow visuals;

- annotated templates;

- before/after examples;

- visual job aids.

Governance requirements:

- images should support learning, not decoration only;

- Western/stock imagery that does not fit Ethiopian/local CSO realities should be avoided;

- AI-generated images must be reviewed for local relevance, bias, and safety;

- images involving people or communities should avoid identifiable sensitive contexts unless consented.

Accessibility requirements:

- every image must have alt text or be marked decorative;

- complex diagrams require a text alternative;

- image comparison blocks require clear labels and explanation.

### 7.7 Gallery Blocks

Purpose:

To show multiple related images, examples, or visual steps.

Sub-blocks:

- carousel;

- image grid;

- before/after gallery;

- example gallery.

Use for:

- multiple examples of forms/templates;

- visual comparison of weak and strong outputs;

- series of field-friendly job aid images.

Governance requirements:

- galleries should not become decorative image collections;

- each image should support the learning purpose.

Accessibility requirements:

- each image requires alt text;

- gallery navigation should be keyboard and screen-reader friendly;

- avoid large image sets that create bandwidth burden.

### 7.8 Multimedia Blocks

Purpose:

To add lightweight media where it improves learning.

Sub-blocks:

- short video;

- captioned video;

- audio note;

- transcript block;

- embedded web content;

- downloadable attachment;

- PDF/Word/Excel attachment;

- code snippet, text-only where needed;

- lightweight infographic.

Use for:

- short demonstrations;

- audio explanation for low-literacy support;

- downloadable templates;

- practical worksheets;

- offline guides.

Governance requirements:

- media should not be required where low-bandwidth learners cannot use it;

- videos should be short;

- downloads should be lightweight where possible;

- attachments should be linked to practice, proof, or real-world application.

Accessibility requirements:

- videos require captions or transcript;

- audio requires transcript;

- attachments should be accessible where possible;

- file size should be visible or warned where large.

### 7.9 Interactive Reveal Blocks

Purpose:

To let learners explore information progressively without overwhelming them.

Sub-blocks:

- accordion;

- tabs;

- flip cards;

- timeline;

- process steps;

- labeled graphic;

- hotspots;

- callout/reveal;

- clickable markers.

Use for:

- comparing categories;

- revealing steps;

- explaining a process;

- exploring parts of a template;

- unpacking a concept in small pieces.

Examples:

- feedback categories in tabs;

- safeguarding referral steps in process block;

- budget justification components in labeled graphic;

- “output vs outcome” examples in flip cards.

Governance requirements:

- interactions should reduce cognitive load, not add unnecessary clicks;

- each item should be short;

- avoid hiding urgent safety instructions behind too many clicks.

Accessibility requirements:

- keyboard navigation must work;

- screen-reader behavior should be tested;

- labeled graphics need image and marker descriptions;

- process blocks should have clear step labels.

### 7.10 Practice Blocks

Purpose:

To let learners apply knowledge or skill before the final test or practical proof.

Sub-blocks:

- guided practice;

- checklist task;

- template completion;

- categorization;

- sorting activity;

- matching;

- sequencing;

- drag-and-drop;

- short answer;

- case review;

- tool activity;

- matrix mapping;

- assignment link.

Use for:

- classifying community feedback;

- sequencing referral steps;

- matching indicators to evidence sources;

- completing parts of a budget justification;

- preparing a simple outcome evidence statement;

- mapping stakeholders;

- applying a checklist.

Governance requirements:

- every practice block should link to a required action;

- feedback should explain why an answer is strong, incomplete, or risky;

- practice should be realistic for local CSO work.

Accessibility requirements:

- drag-and-drop should have keyboard/tap alternative;

- sorting and matching should be mobile-friendly;

- short answer should not collect sensitive personal data.

### 7.11 Scenario and Decision Blocks

Purpose:

To help learners practice judgment, decision-making, and safe action in realistic CSO situations.

Sub-blocks:

- 3C scenario;

- decision branch;

- dilemma card;

- role-based decision;

- branching dialogue;

- scenario card;

- consequence feedback;

- retry loop;

- reflection after scenario;

- case-based decision.

Scenario structure should follow the 3C model:

Challenge → Choices → Consequences

The scenario guide explains that scenario blocks can contain scenes, content, dialogue, responses, feedback, and branching options; dialogue content allows multiple learner responses and branching to different scenes or content, while text content can introduce or end scenario flow.

Use for:

- safeguarding referral decisions;

- handling community feedback;

- drafting safe advocacy messages;

- responding to donor compliance dilemmas;

- identifying conflict of interest;

- choosing evidence for reporting;

- navigating partnership tensions.

Governance requirements:

- scenario must link to a Skill gap or judgment-based required action;

- choices must be plausible, not silly or obvious;

- consequences should show realistic practical effects;

- feedback should explain the consequence, not simply “correct/incorrect”;

- high-risk scenarios require safeguarding/civic-space review.

Accessibility requirements:

- scenario scene descriptions must be completed;

- background and character meaning should be described through scene descriptions;

- keyboard and screen-reader testing should be required;

- a preceding instruction block may be used to set expectations.

### 7.12 Assessment and Knowledge Check Blocks

Purpose:

To check learning during the course and support the final test.

Sub-blocks:

- ungraded knowledge check;

- multiple choice;

- multiple response;

- true/false;

- fill-in-the-blank;

- matching;

- sequencing;

- scenario-based question;

- case question;

- short answer;

- final test question;

- final test block;

- retake instruction;

- score feedback message.

Use for:

- checking essential knowledge;

- testing decision logic;

- preparing learners for final test;

- confirming course completion;

- triggering certificate at 80%+.

Governance requirements:

- every final test question must link to course content, required action, minimum information, or scenario decision;

- final test must not include content not taught in the course;

- certificate rule must be 80%+ final test score;

- practical proof must remain separate from certificate.

Important correction:

Any older checklist item suggesting 90% certificate threshold must be superseded. The binding certificate rule is 80%+ final test score = pass and automated certificate.

### 7.13 Resource and Download Blocks

Purpose:

To provide practical tools learners can use in their CSO work.

Sub-blocks:

- downloadable template;

- checklist;

- job aid;

- worksheet;

- sample form;

- offline guide;

- facilitator note;

- printable summary;

- completed example;

- blank template.

Use for:

- budget justification worksheets;

- outcome evidence worksheet;

- conflict-of-interest declaration form;

- feedback categorization log;

- safeguarding referral checklist;

- partnership role matrix;

- advocacy message template.

Governance requirements:

- resource should support required action, practice, final test preparation, or practical proof;

- resource should be lightweight and mobile-friendly;

- resource should not contain unsafe or sensitive sample data.

### 7.14 Accessibility and Localization Blocks

Purpose:

To ensure equivalent learning access for learners with different devices, language needs, literacy levels, and connectivity constraints.

Sub-blocks:

- plain-language version;

- transcript;

- captions;

- text alternative;

- low-bandwidth alternative;

- printable version;

- translation note;

- local-language note;

- glossary support;

- audio alternative;

- image alt-text support.

Use for:

- low-bandwidth learners;

- mobile users;

- learners needing plain language;

- translation-ready course versions;

- courses with audio/video/media;

- courses with complex images or tables.

Governance requirements:

- accessibility blocks should not be optional decoration;

- they should be added where needed based on course content;

- media-heavy blocks must have alternatives;

- long text should be chunked.

### 7.15 Safeguarding, Civic-Space, and Data Safety Blocks

Purpose:

To reduce harm in courses that involve sensitive data, advocacy, safeguarding, community feedback, protection, or political/civic-space risk.

Sub-blocks:

- safety note;

- anonymization warning;

- sensitive data caution;

- do-no-harm reminder;

- referral note;

- “do not upload” warning;

- fictionalization instruction;

- safe advocacy language note;

- escalation pathway note;

- redaction checklist.

Use for:

- practical proof uploads;

- safeguarding courses;

- community feedback courses;

- advocacy/civic engagement courses;

- courses involving beneficiary or community data;

- courses involving donor or internal organizational documents.

Standard learner-facing warning:

Do not upload real names, phone numbers, addresses, beneficiary details, politically sensitive information, or active safeguarding/protection cases. Use anonymized, redacted, or fictionalized examples unless your organization has approved the document for sharing.

Governance requirements:

- safety blocks should be required before sensitive proof upload;

- high-risk blocks should trigger specialist review;

- unsafe proof instructions should block Review or Publish.

### 7.16 Practical Output and Recognition Blocks

Purpose:

To support optional practical proof, proof review, verified achievement, and badge explanation.

Sub-blocks:

- practical proof instruction;

- upload instruction;

- accepted proof types;

- review criteria;

- rubric;

- safety/anonymization reminder;

- proof status explanation;

- badge explanation;

- verified achievement note;

- organization milestone note;

- donor-safe visibility note.

Use for:

- explaining optional proof submission;

- linking proof to capacity indicator;

- showing badge/achievement criteria;

- guiding learners on safe evidence submission;

- explaining that proof is separate from certificate.

Governance requirements:

- proof blocks should clearly state that proof is separate from certificate;

- proof must link to capacity area/indicator;

- proof submission must include safety guidance;

- raw proof must remain private by default;

- reviewer/verifier role must be configured where proof is enabled.

### 7.17 Chart and Data Visualization Blocks

Purpose:

To present simple data clearly.

Sub-blocks:

- bar chart;

- line chart;

- pie/donut chart;

- comparison chart;

- progress chart;

- simple indicator visual.

Use for:

- showing example M&E data;

- comparing budget categories;

- showing before/after data;

- explaining feedback trends.

Governance requirements:

- charts should support learning, not decoration;

- data should be fictionalized unless safe and consented;

- charts should have text explanation and accessible labels.

### 7.18 Image Comparison Blocks

Purpose:

To compare two images, templates, documents, or examples.

Sub-blocks:

- before/after slider;

- side-by-side comparison;

- weak vs strong example;

- draft vs revised output.

Use for:

- weak vs strong budget justification;

- weak vs strong advocacy message;

- before/after project report paragraph;

- unredacted vs redacted proof example.

Governance requirements:

- should not expose sensitive raw examples;

- labels must be clear;

- accessible text alternative required.

### 7.19 Custom / Advanced Blocks

Purpose:

To support controlled advanced interactions only when standard blocks are insufficient.

Sub-blocks:

- controlled embed;

- advanced widget shell;

- custom HTML/CSS/JS, if allowed;

- external tool embed;

- custom interaction.

Governance requirements:

- should be restricted to authorized creators/admins;

- must be accessible;

- must be mobile-responsive;

- must not create data safety risks;

- must not bypass platform tracking;

- must not introduce arbitrary scripts without review;

- should be avoided in Phase 1 unless clearly necessary.

Custom blocks should be treated as a controlled exception, not normal authoring behavior.

## 8. Recommended DEC Block Category Menu

For the DEC platform UI, the left-side block library should use the following practical category menu.

| Category | Sub-blocks |
| --- | --- |
| 1. Structure & Navigation | Course intro, lesson intro, section header, divider, progress note, continue block, next-step instruction, lesson summary, closing block |
| 2. Text & Explanation | Heading, paragraph, short explainer, key concept, definition, plain-language note, myth/fact, FAQ, glossary, table |
| 3. Emphasis & Notes | Statement, note, warning, reminder, key takeaway, common mistake, do-no-harm callout |
| 4. Example & Demonstration | Worked example, before/after example, annotated example, model answer, case snapshot, demonstration note |
| 5. Visual & Media | Image, image with text, diagram, gallery, infographic, audio, video, transcript, attachment |
| 6. Reveal & Explore | Accordion, tabs, flip cards, labeled graphic, hotspot, timeline, process, callout/reveal |
| 7. Practice | Guided practice, checklist task, template completion, categorization, sorting, matching, sequencing, short answer, matrix mapping |
| 8. Scenario & Decision | 3C scenario, decision branch, dilemma card, role-based decision, branching dialogue, consequence feedback, retry loop |
| 9. Reflection & Action | Reflection prompt, action commitment, personal plan, organizational application prompt, peer discussion prompt |
| 10. Assessment | Knowledge check, MCQ, true/false, matching quiz, sequencing question, scenario question, final test, retake instruction |
| 11. Resources & Job Aids | Downloadable template, checklist, worksheet, sample form, offline guide, printable version, urgent job aid |
| 12. Accessibility & Localization | Plain-language version, translation note, transcript, captions, text alternative, low-bandwidth alternative |
| 13. Safeguarding & Data Safety | Safety note, anonymization warning, sensitive data caution, referral note, redaction checklist |
| 14. Practical Proof & Recognition | Proof submission, upload instruction, review criteria, badge explanation, verified achievement note |
| 15. Advanced / Controlled | Chart, image comparison, controlled embed, advanced widget shell, custom code if authorized |

## 9. Block Metadata Model

Every block should carry structured metadata.

This metadata is essential for traceability, Review, Publish, Monitoring, and future course improvement.

| Metadata field | Required? | Purpose |
| --- | --- | --- |
| Block ID | Yes | Unique identifier |
| Course ID | Yes | Links block to course |
| Course version ID | Yes | Version-aware tracking |
| Lesson/module ID | Yes | Locates block |
| Block family | Yes | Text, Scenario, Practice, Assessment, etc. |
| Block type | Yes | Specific subtype |
| Block title | Yes | Human-readable label |
| Block source | Yes | Required from Design / recommended / creator-added |
| Display order | Yes | Learner sequence |
| Linked Analysis Handover | Yes, inherited | Traceability |
| Linked Design Handover | Yes, inherited | Traceability |
| Linked required action | Required for core blocks | Action alignment |
| Linked minimum information | Where relevant | Avoids unnecessary content |
| Linked practice activity | Where relevant | Practice alignment |
| Linked assessment item | Where relevant | Test alignment |
| Linked practical proof | Where relevant | Proof/achievement alignment |
| Linked capacity area | Yes, inherited | Monitoring and taxonomy |
| Linked indicator/standard | Where available | Capacity evidence |
| Purpose tag | Required for creator-added blocks | Governance |
| Creator justification | Required for creator-added blocks | Review support |
| AI status | Where AI used | Human review control |
| Accessibility status | Yes | Accessibility readiness |
| Safeguarding/data status | Where relevant | Safety readiness |
| Completion rule | Where relevant | Interaction/test/proof behavior |
| Telemetry label | Recommended | Monitoring |
| Review status | Yes | Draft / ready / flagged / approved / revise |
| Last edited by/date | Yes | Audit trail |

## 10. Required vs Recommended vs Creator-Added Blocks

The Build Studio should distinguish three block source types.

| Source type | Meaning | Review implication |
| --- | --- | --- |
| Required from Design | Block came from approved Storyboard/Design-to-Build Handover | Should not be removed without warning/reapproval |
| Recommended | Platform suggested based on course type, route, accessibility, or safety | Creator may accept or skip with reason if important |
| Creator-added | Creator added during Build | Must have purpose tag, linked design element, and justification |

Visual labels should appear on blocks:

- Required from Design;

- Recommended;

- Creator-added;

- Needs justification;

- AI draft pending review;

- Accessibility issue;

- Safeguarding flag;

- Ready for Review.

## 11. Purpose Tags for Creator-Added Blocks

When a creator adds a block not included in the approved Storyboard, the platform should ask:

Why are you adding this block?

Recommended purpose tags:

| Purpose tag | Meaning |
| --- | --- |
| Supports required action | Helps learner perform an approved action |
| Provides minimum information | Adds essential knowledge needed for practice/test |
| Improves practice | Adds or strengthens learner practice |
| Improves assessment readiness | Helps learner prepare for knowledge check/final test |
| Supports practical proof | Helps learner prepare optional applied evidence |
| Supports accessibility | Adds transcript, alt text, simplified version, printable version |
| Supports localization | Adapts language/context for local learners |
| Supports safeguarding/data safety | Adds safety note, anonymization guidance, or do-no-harm reminder |
| Improves navigation | Helps learner understand flow or progress |
| Adds approved resource | Provides template, checklist, worksheet, job aid |
| Reduces cognitive load | Breaks long content into simpler parts |
| Other | Requires short explanation and reviewer attention |

Creator-added blocks should be allowed, but unresolved missing purpose tags should block Review submission or at least create a required fix.

## 12. Right-Side Block Properties and Governance Panel

When a block is selected, the right-side panel should display:

### 12.1 Core block settings

- block title;

- block type;

- block source;

- lesson/module location;

- display order;

- learner-facing purpose;

- completion behavior.

### 12.2 Governance linkages

- linked required action;

- linked minimum information;

- linked practice activity;

- linked final test item;

- linked practical proof, if relevant;

- linked capacity area;

- linked indicator/standard;

- purpose tag;

- creator justification;

- review status.

### 12.3 Accessibility controls

- alt text;

- transcript;

- captions;

- text alternative;

- keyboard navigation status;

- screen-reader note;

- mobile display note;

- low-bandwidth alternative;

- printable version.

### 12.4 Safeguarding and data controls

- sensitive content flag;

- anonymization note;

- do-not-upload warning;

- fictionalization requirement;

- civic-space sensitivity flag;

- specialist review required;

- proof safety note.

### 12.5 AI controls

- generate draft;

- simplify language;

- create fictionalized example;

- draft feedback;

- draft quiz item;

- draft scenario wording;

- generate plain-language version;

- suggest low-bandwidth alternative;

- mark accepted/edited/rejected/escalated;

- AI use log.

AI should work from the selected block’s approved context, not a blank prompt.

## 13. Center Canvas Behavior

The center canvas should show the course as a learner-like vertical flow.

It should display:

- module headings;

- lesson headings;

- blocks in order;

- required blocks;

- creator-added blocks;

- incomplete indicators;

- warnings;

- preview controls;

- drag/reorder where allowed.

Creators should be able to:

- edit content;

- add blocks between existing blocks;

- reorder blocks;

- duplicate blocks;

- delete blocks, where allowed;

- preview block;

- preview lesson;

- preview full course.

However, major changes to required blocks should trigger warnings.

Example warning:

This block came from the approved Storyboard. Removing or substantially changing it may require Design reapproval.

## 14. Block Selection Guidance by Course Type

The platform should recommend block types based on the K/S route and design.

| Course / gap type | Recommended block pattern |
| --- | --- |
| Knowledge gap | Short explainer → example → checklist/job aid → knowledge check → final test |
| Skill gap | Context hook → worked example → guided practice → scenario/decision → final test → optional proof |
| Mixed K/S component | Explain boundary → required action → practice → reflection → final test → proof if relevant |
| High-stakes safeguarding/civic-space | Critical action first → do-not-do warning → scenario → job aid → final test → safe proof guidance |
| MEAL/outcome evidence | Explainer → annotated example → worksheet practice → knowledge check → proof worksheet option |
| Financial/budgeting | Worked example → template completion → common mistake → final test → budget justification proof |
| Advocacy | Safe language note → evidence-message structure → scenario → draft message practice → proof option |
| Accountability/feedback | Categories explainer → sorting practice → escalation scenario → feedback log proof |
| Governance | Scenario/case → decision checklist → documentation practice → final test → governance record proof |
| Digital skills | Step-by-step process → tool activity → screenshot/text guide → practice file → knowledge check |

## 15. Scenario Block Specification

Scenario blocks are especially important for DEC because many CSO capacity gaps involve judgment, risk, and real-world decision-making.

### 15.1 Scenario core structure

Every scenario should include:

| Scenario field | Purpose |
| --- | --- |
| Scenario title | Internal and learner-facing label |
| Capacity area | Links scenario to CSO capacity taxonomy |
| Required action | Shows what learner is practicing |
| Learner role | Defines who learner is in scenario |
| Realistic CSO context | Grounds scenario in local CSO work |
| Challenge | Situation or dilemma |
| Choices | Plausible learner decisions |
| Consequences | What happens after each choice |
| Feedback | Explains why choice is strong, weak, risky, or incomplete |
| Retry behavior | Whether learner may try again |
| Completion rule | What counts as completing scenario |
| Safeguarding/data note | Risk instructions |
| Accessibility description | Scene/character/background description |

### 15.2 Scenario choice quality

Choices should be realistic and nuanced.

Avoid:

- one obviously correct answer;

- one silly wrong answer;

- unrealistic corporate scenarios;

- risky advocacy advice;

- real active safeguarding cases;

- asking learners to disclose sensitive information.

Use:

- a fast but risky option;

- a passive/incomplete option;

- a safe and practical option;

- an escalation/consultation option;

- a resource-limited local CSO constraint.

### 15.3 Scenario feedback quality

Feedback should explain consequences.

Weak feedback:

Correct. Good job.

Better feedback:

This is the safest option because it records the concern without investigating the case, protects confidentiality, and refers the issue through the approved pathway.

### 15.4 Scenario accessibility

Scenario blocks should require:

- scene descriptions;

- dialogue descriptions;

- response descriptions where needed;

- keyboard navigation testing;

- screen-reader testing;

- clear instruction before scenario;

- text alternative where needed.

The scenario guide specifically notes that scene descriptions are read by screen readers and should be used for titles, endings, dialogue, and responses because background/character alt text may not be separately available.

## 16. High-Stakes / Critical Action Block Pattern

For safeguarding, protection, legal/civic-space, advocacy risk, data privacy, or emergency referral courses, the platform should support a Critical Action First pattern.

Recommended sequence:

- What to do now.

- What not to do.

- Why it matters.

- Practice scenario.

- Downloadable/job-aid version.

- Deeper explanation, optional.

Recommended blocks:

- urgent job aid;

- warning statement;

- short process;

- scenario decision;

- referral note;

- printable/screenshot-friendly checklist;

- final test scenario question.

This pattern helps learners find the most important practical guidance quickly.

## 17. Accessibility and Low-Bandwidth Rules by Block Type

| Block type | Required accessibility / low-bandwidth rule |
| --- | --- |
| Text | Short, readable, clear headings |
| Table | Mobile-safe; warn for too many columns |
| Image | Alt text or decorative flag |
| Gallery | Alt text for each image; avoid heavy image sets |
| Video | Captions/transcript; compressed or alternative |
| Audio | Transcript |
| Attachment | File size visible; accessible format where possible |
| Labeled graphic | Overall image description + marker descriptions |
| Process | Clear step labels; keyboard navigation |
| Scenario | Scene descriptions; screen-reader testing |
| Sorting/drag-drop | Keyboard/tap alternative |
| Chart | Text summary and labels |
| Final test | Clear instructions and accessible controls |
| Proof upload | Safety warning and file guidance |

## 18. Scope Warnings and Quality Flags

The Build Studio should automatically flag issues.

| Warning | Trigger |
| --- | --- |
| Missing purpose tag | Creator-added block has no purpose tag |
| Missing design link | Block not linked to action/info/practice/assessment/proof/accessibility/safety |
| Required block missing | Approved storyboard block not built |
| Unreviewed AI content | AI output inserted but not human-reviewed |
| Accessibility missing | Image lacks alt text; video lacks transcript; table not mobile-safe |
| Safeguarding risk | Sensitive content/proof without safety note |
| Proof risk | Proof upload block lacks anonymization guidance |
| Assessment mismatch | Final test item not linked to taught content |
| Scope drift | Added block introduces new topic outside design |
| Course overload | Too many long text/media blocks |
| High-stakes issue | Course contains safeguarding/civic-space risk without specialist flag |

Warning severity levels:

| Severity | Meaning |
| --- | --- |
| Info | Helpful note |
| Warning | Should be reviewed before submission |
| Required fix | Blocks Review submission |
| Specialist review | Blocks Publish until reviewed |

## 19. Block Readiness Status

Each block should have a readiness status.

| Status | Meaning |
| --- | --- |
| Draft | Content started but incomplete |
| Needs linkage | Missing required action/design link |
| Needs purpose tag | Creator-added block missing purpose |
| AI draft pending review | AI content not reviewed |
| Accessibility issue | Missing alt text/transcript/alternative |
| Safeguarding issue | Sensitive content needs safety note/review |
| Ready for Review | Block complete and traceable |
| Reviewer flagged | Reviewer requested change |
| Approved | Block accepted in Review |

## 20. Build-to-Review Handover: Block Evidence

The Build-to-Review Handover should include a block summary table.

| Field | Purpose |
| --- | --- |
| Total blocks | Course size |
| Required blocks present | Design alignment |
| Missing required blocks | Blocking issue |
| Creator-added blocks | Scope and flexibility review |
| Added Block Register | Justification review |
| AI-assisted blocks | Human review check |
| Accessibility flags | Access review |
| Safeguarding flags | Safety review |
| Final test blocks | Certificate readiness |
| Practical proof blocks | Verified achievement readiness |
| Resource blocks | Learner application support |
| Preview status | Runtime readiness |

Reviewers should not need to inspect the entire course blindly. The handover should guide attention.

## 21. Resource-to-Block Transformation Feature

The platform may include a guided feature:

Transform Resource into Learning Blocks

This should help creators convert long materials into learner-friendly blocks.

Examples:

| Source material | Suggested block transformation |
| --- | --- |
| PDF manual | Short explainer + accordion + checklist |
| Toolkit | Process block + job aid + downloadable template |
| Compliance guidance | Step-by-step process + knowledge check |
| Case study | Scenario + consequence feedback |
| Framework | Matching/sorting activity |
| Long policy document | Summary + FAQ + downloadable reference |
| Assessment form | Guided practice + template completion |
| Advocacy guide | Safe message structure + scenario decision |

This should remain AI-assisted and human-reviewed. AI must not invent content or remove safety requirements.

## 22. Phase 1 Minimum Block Library

For Phase 1, the platform should not try to build every advanced interaction perfectly. It should provide enough blocks to support a full course journey.

Minimum recommended Phase 1 block set:

- Section header

- Lesson intro

- Paragraph / short explainer

- Statement / note / warning

- List / checklist

- Table

- Image with alt text

- Downloadable attachment

- Accordion or tabs

- Process steps

- Worked example

- Guided practice

- Scenario / decision block

- Reflection prompt

- Knowledge check

- Matching or sequencing

- Final test block

- Transcript/text alternative

- Safety/anonymization note

- Practical proof instruction

- Review criteria / badge explanation

- Lesson summary / closing block

Future enhancements can add richer branching, advanced simulations, custom embeds, adaptive pathways, media studio, and reusable template libraries.

## 23. Future Block Enhancements

Future versions may include:

- reusable block templates by capacity area;

- scenario template library;

- peer discussion blocks;

- mentor feedback blocks;

- offline package block;

- multilingual block variants;

- advanced branching scenarios;

- adaptive remediation blocks;

- organization portfolio proof blocks;

- donor-safe evidence summary blocks;

- AI-generated image/visual blocks with strict review;

- data dashboard interpretation blocks;

- peer review and rubric blocks;

- interactive matrix mapping block;

- mobile-first micro-simulation blocks.

These should not delay the Phase 1 core workflow.

## 24. Implementation Guidance for Codex

Codex should implement the block library as structured product logic, not just as a visual list.

### 24.1 Required implementation behavior

Codex should:

- preserve the three-panel Build Studio model;

- implement the left-side expandable block library;

- group blocks by learning purpose and/or family;

- support required/recommended/creator-added block source labels;

- require purpose tags for creator-added blocks;

- link blocks to required actions, minimum information, practice, assessment, proof, accessibility, or safeguarding;

- expose block warnings in the right panel;

- show missing required blocks;

- support learner preview;

- include block evidence in Build-to-Review Handover.

### 24.2 What Codex should not do

Codex should not:

- turn Build Studio into a blank-canvas editor;

- add arbitrary styling controls that break DEC consistency;

- allow creator-added blocks with no purpose or review visibility;

- allow AI content to bypass human review;

- allow final tests without link to course content;

- allow proof upload without safety guidance;

- prioritize heavy media over low-bandwidth learning;

- expose internal block metadata to learners.

### 24.3 Acceptance criteria examples

Given a creator opens Build Studio after Design approval,

when the page loads,

then the left panel shows expandable block categories and the center canvas shows required blocks from the approved Storyboard.

Given a creator adds a new block that was not in the approved Storyboard,

when the block is saved,

then the platform requires a purpose tag, linked design element, and short justification before the course can be submitted for Review.

Given a video block is added,

when the creator attempts to mark the block ready,

then the platform asks for a transcript or text alternative.

Given a practical proof block is enabled,

when the creator configures the block,

then the platform requires proof instructions, accepted proof types, review criteria, capacity indicator link, and anonymization/safety note.

Given a learner opens a published course,

when the course renders,

then internal metadata such as creator-added justification, AI review status, and reviewer notes are hidden from the learner view.

## 25. Recommended Repo Placement

This annex should be saved as:

docs/specs/core-workflow/ANNEX_06_BUILD_STUDIO_BLOCK_LIBRARY_SPECIFICATION.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

- ANNEX_06_BUILD_STUDIO_BLOCK_LIBRARY_SPECIFICATION.md

Defines the Build Studio block library, block families, three-panel authoring model, required vs creator-added block logic, block metadata, scenario blocks, accessibility/safeguarding rules, scope warnings, and Build-to-Review evidence requirements.

## 26. Success Standard for This Annex

This annex is successful when:

Codex and developers can implement a full but governed Build Studio block library that gives course creators enough flexibility to build rich, practical, interactive, accessible CSO learning courses while preserving traceability to the approved Analysis and Design records.

In practical terms, this annex should prevent:

“Creators freely add unrelated blocks, long theory, unsafe proof instructions, or unreviewed AI content.”

And ensure:

“Creators build from required Storyboard blocks, add useful supporting blocks with purpose tags and justification, use AI safely, configure final tests and proof pathways correctly, preview the learner experience, and submit a complete Build-to-Review Handover.”

<!--
Repo-ready Markdown conversion of: Revised Developer-Facing Implementation Description of the DEC Learning Hub Course Creator Portal.docx
Generated from the uploaded source document for DEC Learning Hub Course Creator Portal implementation use.
-->


# Developer-Facing Implementation Description of the DEC Learning Hub Course Creator Portal

## Contents

- [1. Purpose of This Description](#1-purpose-of-this-description)
- [2. Product Identity: What the Portal Is](#2-product-identity-what-the-portal-is)
- [3. What the Portal Is Not](#3-what-the-portal-is-not)
- [4. Source-of-Truth Hierarchy and Implementation Rule](#4-source-of-truth-hierarchy-and-implementation-rule)
- [5. Phase 1 Scope and Product Boundaries](#5-phase-1-scope-and-product-boundaries)
- [6. User Roles and Role Boundaries](#6-user-roles-and-role-boundaries)
- [7. High-Level End-to-End Workflow](#7-high-level-end-to-end-workflow)
- [8. Course Creator Dashboard and Navigation Experience](#8-course-creator-dashboard-and-navigation-experience)
- [9. Built-In CSO Capacity Framework](#9-built-in-cso-capacity-framework)
- [10. Analysis Gate: Evidence, Baseline, and Course-Fit Decision](#10-analysis-gate-evidence-baseline-and-course-fit-decision)
- [11. Design Phase: From Diagnosis to Build-Ready Learning Design](#11-design-phase-from-diagnosis-to-build-ready-learning-design)
- [12. Build Studio: Governed Flexible Course Authoring](#12-build-studio-governed-flexible-course-authoring)
- [13. AI-Assisted Authoring and Human Review](#13-ai-assisted-authoring-and-human-review)
- [14. Final Test and Certificate Rule](#14-final-test-and-certificate-rule)
- [15. Practical Proof, Verified Achievements, and Badges](#15-practical-proof-verified-achievements-and-badges)
- [16. Review Workflow](#16-review-workflow)
- [17. Publish Workflow and Version Control](#17-publish-workflow-and-version-control)
- [18. Learner Runtime Connection](#18-learner-runtime-connection)
- [19. Monitoring and Evaluation](#19-monitoring-and-evaluation)
- [20. Data Safety, Consent, and Donor Visibility](#20-data-safety-consent-and-donor-visibility)
- [21. Workflow States, Gates, and Records](#21-workflow-states-gates-and-records)
- [22. Implementation Alignment for Codex / AI Coding Agents](#22-implementation-alignment-for-codex-ai-coding-agents)
- [23. Phase 1 Core vs Future Enhancements](#23-phase-1-core-vs-future-enhancements)
- [24. End-to-End User Journey](#24-end-to-end-user-journey)
- [25. Quality Standard for the Platform](#25-quality-standard-for-the-platform)


## 1. Purpose of This Description

This document provides a developer-facing implementation description of the DEC Learning Hub Course Creator Portal. Its purpose is to give Codex/GPT-5.5 and implementation partners a clear, deterministic understanding of the portal’s intended product behavior, workflow logic, user journey, and capacity-strengthening purpose.

This is not a low-level technical architecture document. It is not intended to prescribe every database table, component structure, API route, or UI implementation detail. Codex can determine appropriate technical implementation patterns based on the existing repo. Instead, this document defines the context, workflow intent, product rules, phase gates, role boundaries, and expected outcomes that the implementation must preserve.

The description should guide developers to build the Course Creator Portal as a governed, evidence-linked, AI-assisted course creation workflow, not as a generic learning management system or unrestricted page builder.

The key implementation principle is:

The platform must help DEC and selected course creators turn validated CSO capacity gaps into practical, reviewed, published, and monitored learning courses while preserving traceability from diagnosis to learning design, course build, learner completion, certificates, practical achievements, and monitoring evidence.

This description should be read together with the detailed phase specifications for:

- Analysis Phase
- Design Phase
- Build Phase
- Review and Publish Phase
- Monitoring and Evaluation Phase
Those detailed phase documents provide the component-level workflow requirements. This description provides the integrated product logic that connects them.

The main audience for this document includes:

- Codex/GPT-5.5 acting as the implementation agent;
- DEC Learning Hub developers;
- platform reviewers;
- course creator workflow designers;
- DEC leadership and implementation partners who need to understand how the portal should behave;
- future maintainers who need to preserve the intended workflow logic.
The description should help developers answer:

- What kind of platform are we building?
- What workflow should course creators follow?
- What should be governed, locked, reviewed, or published?
- What should remain flexible for course creators?
- What should AI assist with, and what should AI not control?
- What should happen before a course can move from one phase to the next?
- What evidence should the platform preserve for CSO capacity strengthening?

## 2. Product Identity: What the Portal Is

The DEC Learning Hub Course Creator Portal is a governed, evidence-linked, AI-assisted course creation and review environment for the EU-funded capacity-building program supporting local CSOs in Ethiopia.

It is designed to help DEC and selected course creators move from documented CSO capacity needs to practical learning courses that are:

- grounded in evidence;
- linked to CSO capacity areas, standards, and indicators;
- designed around practical learner actions;
- built through a structured but flexible block-based authoring system;
- supported by AI within approved boundaries;
- reviewed before publication;
- published through an authorized role-sensitive workflow;
- monitored for learning progress, certificates, practical proof, verified achievements, and course improvement.
The portal should support the following full workflow spine:

CSO capacity evidence → capacity gap → baseline → root cause → Knowledge/Skill course-fit decision → capacity map → action map → learning design → storyboard → governed flexible build → final test → certificate → optional practical proof / verified achievement → review → publish → monitoring → evaluation → course improvement

The Analysis Phase establishes that course creation should not begin from a blank page or from a general training request. It should begin from validated capacity evidence, including the capacity gap, learner group, baseline/current practice, desired practice, root cause, capacity area, indicator/framework, digital learning decision, and approved handover into Design.

The Design Phase then converts this approved evidence into a practical learning design: performance goal, action map, course blueprint, storyboard/block plan, practice activities, assessment/action commitment logic, and Design-to-Build Handover.

The Build Phase turns the approved design into a learner-facing course using a governed but flexible block-building workspace. It must preserve alignment with the approved Analysis and Design records while allowing creators to add useful blocks when they improve clarity, practice, accessibility, engagement, learner support, or assessment.

The Review and Publish Phase ensures that courses are not published simply because they have been built. They must first pass structured checks for alignment, content quality, final test validity, certificate logic, practical proof/verified achievement logic, safeguarding, accessibility, AI-generated content quality, platform functionality, and publication readiness.

The Monitoring and Evaluation Phase connects learner activity, final test results, certificates, practical proof submissions, verified achievements, and learner feedback back to the original Analysis baseline and Design performance goal.

The portal’s identity can be summarized as:

A structured course creation system that helps DEC convert validated CSO capacity gaps into practical learning products, certificates, verified capacity achievements, and monitoring evidence.

It should feel practical and usable for non-technical course creators, but it should also contain enough governance to protect quality, relevance, safety, and traceability.


## 3. What the Portal Is Not

The DEC Learning Hub Course Creator Portal should not be implemented as a generic LMS authoring tool.

It is not simply a place where course creators upload videos, write lessons, add quizzes, and publish content. It is a structured course creation and capacity-strengthening workflow that begins from CSO capacity evidence and ends with monitored learning and capacity evidence.

The portal is not:


### 3.1 Not a generic LMS

It should not behave like a generic learning platform where any creator can add any topic without diagnosis, design logic, review, or capacity linkage.

Courses must be linked to approved CSO capacity gaps, target learner groups, performance goals, and indicators or standards.


### 3.2 Not a blank-canvas page builder

The Build Studio should allow flexible authoring, but it must not become unrestricted blank-canvas authoring.

Creators may add blocks, but added blocks should be purpose-linked and justified. The system should preserve alignment with the approved Analysis and Design records.

The Build Phase specification is clear that the platform should balance governed course creation and flexible building. It should provide a full block library, but every added block must link to an approved purpose such as required action, minimum information, learner practice, assessment readiness, practical output, accessibility, safeguarding, or learner reflection.


### 3.3 Not a replacement for participatory diagnosis

The platform does not need to reproduce all fieldwork, scoping, interviews, focus group discussions, community consultations, CSO assessments, or donor feedback processes as software features.

Those processes may happen partly outside the platform. The portal’s role is to capture the approved outputs of that process as structured, platform-ready evidence that guides course creation.


### 3.4 Not a tool that claims course completion proves organizational transformation

A learner completing a course or receiving a certificate does not automatically prove that the CSO has transformed its organizational capacity.

The system should distinguish between:

- course enrollment;
- course completion;
- final test pass;
- certificate;
- practical proof submission;
- verified achievement or badge;
- aggregated organizational capacity evidence.
This distinction prevents overclaiming and protects the credibility of DEC’s capacity-strengthening evidence.


### 3.5 Not an AI-controlled course design system

AI should support course creators by helping draft, simplify, localize, and refine content. It should not independently decide the course objective, target learner group, capacity area, assessment logic, practical proof pathway, or publication readiness.

AI must work inside approved Analysis and Design boundaries and must be subject to human review.


### 3.6 Not a donor surveillance tool

The portal may support donor-facing summaries of verified achievements where CSOs consent, but it must not expose raw evidence, sensitive documents, beneficiary data, politically sensitive information, safeguarding cases, or internal organizational vulnerabilities without explicit safeguards and consent.

The Monitoring and Evaluation specification emphasizes that raw proof submissions should not be shared with donors without consent and safeguards.


### 3.7 Not a repository for unsafe data

The platform should not encourage learners or CSOs to upload:

- real beneficiary names;
- sensitive community data;
- active protection or safeguarding cases;
- politically sensitive details;
- documents that expose CSOs or communities to risk;
- donor or partner data that has not been approved for sharing.
Where practical proof is submitted, the system should require clear anonymization, redaction, and data safety guidance.


## 4. Source-of-Truth Hierarchy and Implementation Rule

Codex and developers should interpret the DEC Learning Hub Course Creator Portal through a clear source-of-truth hierarchy.

This is necessary because the repo already contains earlier specifications, and the newly refined phase documents add more precise workflow expectations. Some earlier language may also contain outdated rules, especially around certificate thresholds.


### 4.1 Source-of-truth hierarchy

The implementation should follow this hierarchy:


#### 1. This revised developer-facing description

This document provides the integrated product intent, outcome logic, phase connections, user journey, implementation-facing behavior, and key product rules.

It should guide developers on what the platform is expected to become and how the major workflow pieces fit together.


#### 2. The five refined phase specifications

These documents provide detailed workflow requirements for each phase:

- Analysis Phase;
- Design Phase;
- Build Phase;
- Review and Publish Phase;
- Monitoring and Evaluation Phase.
They should be used for detailed behavior, fields, tools, gates, and quality checks.


#### 3. Correction notes and override rules

Where later decisions correct earlier wording, the correction must supersede older text.

The most important override is the certificate rule.


#### 4. Existing repo specifications

Existing repo specifications, including the broader DEC Learning Hub product description and previous overriding specifications, remain important where they do not conflict with the latest workflow direction.


#### 5. Existing working implementation

Working routes, components, schema, tests, and role boundaries should be preserved where they already satisfy the intended behavior.

The implementation should not be rewritten from scratch unless Codex identifies a clear reason and provides a plan, acceptance criteria, and evidence.


### 4.2 Binding certificate rule override

The correct Phase 1 certificate rule is:

Final test score of 80% or above = course pass and automated course certificate.

This is binding for implementation.

Practical proof is not required for certificate eligibility.

Practical proof, verified achievements, and badges are a separate, additional, higher-level recognition layer for specific verified CSO capacity achievements linked to indicators or standards.

Therefore:


| Recognition type | Basis | Required for certificate? |
| --- | --- | --- |
| Course certificate | Final test score of 80% or above | Yes, final test score only |
| Practical proof | Submitted evidence of application | No |
| Verified achievement / badge | Practical proof reviewed and accepted | No |

Any earlier specification language suggesting “80% pass / 90% certificate” should be treated as superseded.

The implementation should not introduce a 90% certificate threshold unless DEC explicitly decides to change the rule later.


### 4.3 Implementation rule for Codex

Codex should implement the platform through controlled, evidence-based slices.

It should not apply all phase specifications at once in a single large implementation.

The expected implementation behavior is:

- Read the relevant specification files.
- Compare against the current repo.
- Preserve existing working code where possible.
- Identify the smallest safe implementation slice.
- Implement only that slice.
- Run tests and checks.
- Provide an evidence pack.
- Wait for approval before moving to the next major slice.
Each implementation slice should report:

- product summary in plain language;
- files changed;
- routes affected;
- schema or data model changes;
- workflow/state changes;
- role/permission changes;
- tests run and results;
- manual verification URLs or screenshots where relevant;
- known gaps;
- next safest step.
This implementation rule is important because the Course Creator Portal affects many connected areas: Analysis, Design, Build, Review, Publish, learner runtime, certificates, practical proof, verified achievements, and Monitoring/Evaluation.


## 5. Phase 1 Scope and Product Boundaries

Phase 1 of the DEC Learning Hub Course Creator Portal should remain focused, practical, and buildable.

It should not attempt to implement every possible future capacity-strengthening feature. It should deliver a strong foundation for governed course creation, learner completion, certificate generation, optional verified achievements, and monitoring evidence.


### 5.1 Phase 1 core scope

Phase 1 should support:


#### Analysis Gate

The platform should strengthen the current Diagnosis/Analysis area into a formal Analysis Gate.

This includes:

- validated capacity gap;
- baseline/current practice;
- desired practice;
- root cause summary;
- K/S/M/E route;
- intervention decision;
- safeguards/no-harm note;
- evaluation anchor;
- Analysis-to-Design Handover;
- approval/locking before Design proceeds.
The Analysis Phase specification states that the platform should capture approved outputs of field-based diagnosis and convert them into structured platform data before any course is designed, built, reviewed, or published.


#### Design Workflow

The platform should support:

- capacity objective;
- performance goal;
- Capacity Action Map;
- Learning Design Document;
- Storyboard and Block Plan;
- Scenario and Practice Activity Planner where needed;
- Design-to-Build Handover;
- Build unlock gate.
The Design Phase specification defines Design as the structured bridge between the approved Analysis Phase and course building, converting evidence into performance goals, action maps, blueprint, storyboard, practice logic, and handover.


#### Governed Flexible Build Studio

The Build Studio should support:

- full left-side expandable block library;
- center course canvas;
- right-side properties and governance panel;
- required blocks from approved design;
- creator-added blocks with purpose tag and justification;
- AI-assisted drafting inside approved boundaries;
- course preview;
- final test setup;
- optional practical proof pathway;
- Build-to-Review Handover.
The Build Phase specification states that the Build Phase must balance governed course creation with flexible course building and that the creator may add more blocks when every added block is linked to an approved purpose.


#### Final Test and Certificate

Each course should include a final test.

The certificate rule is:

80%+ final test score = course pass and automated certificate.

The certificate is based on the final test only. Practical proof is not required for certification.


#### Practical Proof and Verified Achievement Layer

Where relevant, the platform should allow learners or CSOs to submit practical proof of application.

This proof may be reviewed by authorized reviewers or validators. If accepted, the learner or CSO may receive a verified achievement, badge, or capacity milestone linked to a CSO capacity indicator or standard.

This is separate from course certification.


#### Review and Publish Workflow

Review and Publish must remain separated.

Course creators can submit and revise courses. Authorized reviewers can review and return courses. Authorized publishers/admins can publish approved courses.

The Review and Publish specification confirms that publishing is role-sensitive and that creators may submit, revise, and respond to reviewer comments, but should not directly publish unless assigned an authorized publishing role.


#### Monitoring and Evaluation

The platform should track:

- enrollment;
- progress;
- completion;
- final test results;
- certificates;
- practical proof submissions;
- verified achievements;
- learner feedback;
- course improvement signals;
- organization-level capacity evidence where safe and appropriate.
The Monitoring and Evaluation specification defines this phase as connecting learner activity, final test results, certificates, practical proof, verified achievements, and feedback back to the original Analysis baseline and Design performance goal.


### 5.2 Phase 1 Knowledge/Skill boundary

Phase 1 course production should focus on Knowledge and Skill gaps.

Motivation and Environment gaps should not drive course production unless a clear, separable Knowledge or Skill component is explicitly identified.

This rule protects the platform from trying to solve organizational or systemic barriers through courses alone.


| Gap type | Phase 1 decision |
| --- | --- |
| Knowledge | Can proceed to course design |
| Skill | Can proceed to course design |
| Motivation | Record and route outside Phase 1 course production unless separable Knowledge/Skill component exists |
| Environment | Record and route outside Phase 1 course production unless separable Knowledge/Skill component exists |
| Mixed | Proceed only with explicit course-addressable Knowledge/Skill component |

The Build Phase specification states that Phase 1 should focus course production on Knowledge and Skill gaps, while Motivation and Environment issues should be recorded, flagged, or routed to other support pathways rather than driving Phase 1 course production.


### 5.3 What Phase 1 should not overbuild

Phase 1 should avoid overbuilding the following areas too early:

- advanced multi-stakeholder co-design rooms;
- full donor-facing marketplace or public CSO ranking system;
- complex AI media generation workflows;
- fully automated specialist review routing;
- advanced adaptive testing;
- heavy video-first course production;
- unrestricted block/page authoring;
- complex data warehouse dashboards;
- broad environment/system intervention management;
- donor visibility of raw proof submissions.
These may become future enhancements, but Phase 1 should focus on the workflow foundation.


### 5.4 Practical Phase 1 implementation priority

The safest implementation order should be:

- Analysis Gate Alignment 
Establish Analysis-to-Design Handover, locking, K/S/M/E routing, and read-only Analysis reference.
- Design Handover Alignment 
Add Learning Design Document, Storyboard/Block Plan, Scenario/Practice Planner, and Design-to-Build Handover.
- Governed Flexible Build Studio 
Implement full block library, required vs creator-added blocks, purpose tags, justification, and scope warnings.
- Final Test + Certificate + Practical Proof / Verified Achievement 
Keep 80%+ certificate rule and add separate practical proof / verified achievement layer.
- Review and Publish Upgrade 
Strengthen review decisions, publish separation, versioning, and quality gates.
- Monitoring and Evidence Dashboard 
Add analytics, certificate registry, proof tracking, verified achievements, organization evidence, and course improvement signals.
This staged approach helps Codex improve the platform safely without breaking existing working functionality.


## 6. User Roles and Role Boundaries

The DEC Learning Hub Course Creator Portal must be role-sensitive. Different users should see different workspaces, permissions, actions, and dashboards based on their role in the course creation and learning ecosystem.

The purpose of role separation is not to make the platform complicated. It is to protect quality, accountability, publication control, learner safety, and credible capacity evidence.

The core role principle is:

Course creators can create, edit, preview, submit, and revise courses. Reviewers can assess and return or approve courses. Authorized DEC admins or publishers control publication. Learners complete courses, take final tests, receive certificates, and may submit practical proof. Verified achievement reviewers validate practical evidence separately from course certification.


### 6.1 Core user roles


| Role | Main purpose |
| --- | --- |
| Course Creator / Subject Matter Expert | Creates and revises courses based on approved Analysis and Design records. |
| DEC Admin | Oversees platform configuration, users, workflows, permissions, and publication readiness. |
| Instructional Design Reviewer | Reviews course learning flow, action mapping, block quality, assessment logic, and learner experience. |
| DEC Capacity Lead | Checks alignment with CSO capacity areas, indicators, standards, and program objectives. |
| Safeguarding / Civic-Space Reviewer | Reviews sensitive content, advocacy risks, proof submission safety, and do-no-harm concerns. |
| Accessibility / Localization Reviewer | Checks mobile-first design, low-bandwidth readiness, translation-readiness, plain language, and accessibility. |
| Platform / Admin Reviewer | Checks technical settings, course metadata, final test configuration, certificate trigger, permissions, and publish readiness. |
| Authorized Publisher | Publishes approved course versions to the learner-facing platform. |
| Learner | Takes courses, completes final tests, receives certificates, provides feedback, and may submit practical proof. |
| Organization Admin | Views safe organization-level learning progress, certificates, and verified achievements where enabled. |
| Practical Proof Verifier | Reviews submitted practical evidence and approves, rejects, or requests revision for verified achievement/badge recognition. |

These roles may be combined in early Phase 1 implementation if necessary. For example, a DEC Admin may temporarily act as publisher, platform reviewer, or proof verifier. However, the system should still preserve the logical separation between creation, review, publication, and verification.


### 6.2 Course Creator / Subject Matter Expert

Course creators are the main users of the Creator Portal. They may be DEC staff, selected consultants, trainers, subject matter experts, or partner CSO specialists.

They should be able to:

- start a new course or continue an existing course;
- complete or work from an approved Analysis record;
- draft course setup information;
- develop the Capacity Map, Action Map, Learning Design Document, and Storyboard;
- build the course using the governed flexible Build Studio;
- add blocks where useful, with purpose tags and justification;
- use AI-assisted authoring inside approved boundaries;
- configure or draft final test items;
- configure practical proof submission where relevant;
- preview the course as a learner;
- submit the course for Review;
- respond to reviewer comments;
- revise returned courses;
- view monitoring dashboards for courses they created or manage.
They should not automatically publish courses unless they also have an authorized publishing role.

The Course Creator experience should remain guided and non-technical. The platform should show clear next steps, required fields, warnings, and handover summaries so creators understand what to do without needing to understand technical architecture.


### 6.3 DEC Admin

The DEC Admin role provides operational oversight of the portal.

A DEC Admin may be able to:

- manage users and role assignments;
- configure capacity areas, indicators, and controlled taxonomies;
- oversee course workflow status;
- access creator, review, publish, and monitoring areas;
- approve or lock workflow gates in early Phase 1 where specialist approval is not yet implemented;
- manage publication settings;
- monitor certificate issuance;
- monitor practical proof and verified achievement workflows;
- manage organization-level visibility settings;
- archive or retire courses;
- support version control and course revisions.
In early implementation, the DEC Admin may act as the practical first gatekeeper for some workflow approvals, such as locking the Analysis-to-Design Handover. Over time, this can become more role-specific through capacity lead or reviewer approval.


### 6.4 Instructional Design Reviewer

The Instructional Design Reviewer checks whether the course is a good learning experience.

They should review:

- whether the course follows the approved Analysis and Design records;
- whether the performance goal is clear and practical;
- whether the Action Map is reflected in the course;
- whether the lesson sequence makes sense;
- whether the block sequence is clear and not overloaded;
- whether creator-added blocks are justified;
- whether examples and practice activities support learning;
- whether final test items align with course content;
- whether learner workload is realistic;
- whether the course is mobile-first and understandable.
They may return the course to Build or Design if the course is unclear, too generic, too theory-heavy, or not sufficiently action-oriented.


### 6.5 DEC Capacity Lead

The DEC Capacity Lead protects the connection between courses and DEC’s CSO capacity-strengthening objectives.

They should check:

- whether the course remains linked to the approved CSO capacity area;
- whether the capacity gap is valid and still visible;
- whether the course supports the relevant indicator or standard;
- whether the learner group matches the diagnosed capacity need;
- whether the course contributes to program-level capacity-strengthening priorities;
- whether verified achievements or badges are linked to meaningful capacity evidence.
This role is especially important because the platform is not only producing courses. It is producing learning and evidence that should support CSO capacity development in the EU-funded program context.


### 6.6 Safeguarding / Civic-Space Reviewer

The Safeguarding / Civic-Space Reviewer reviews courses and proof pathways that may involve sensitive issues.

They should review:

- safeguarding examples and scenarios;
- community feedback or complaint-handling content;
- advocacy or civic-space scenarios;
- data protection instructions;
- proof submission requirements;
- references to beneficiaries, communities, local authorities, or sensitive actors;
- learner instructions related to uploading evidence;
- anonymization and redaction guidance.
They should be able to flag content that may create risk for learners, CSOs, communities, or rights-holders.

Courses or proof workflows should not proceed to publication if they ask learners to submit unsafe documents, identify vulnerable individuals, disclose politically sensitive information, or upload active protection/safeguarding cases.


### 6.7 Accessibility / Localization Reviewer

The Accessibility / Localization Reviewer checks whether the course can realistically be used by local CSO learners.

They should review:

- mobile usability;
- low-bandwidth readiness;
- plain-language quality;
- translation-readiness;
- captions, transcripts, alt text, and text alternatives;
- file sizes and downloadable resources;
- offline or printable options where relevant;
- inclusiveness of examples and language;
- whether instructions are clear for learners with different digital skill levels.
This role is important because the DEC Learning Hub should be usable by local and grassroots CSOs, not only by learners with strong internet, large screens, or high digital literacy.


### 6.8 Platform / Admin Reviewer

The Platform / Admin Reviewer checks whether the course is technically and operationally ready.

They should review:

- course metadata;
- route visibility;
- learner access setting;
- final test configuration;
- certificate trigger at 80%+ final test score;
- practical proof submission setup, if enabled;
- verified achievement/badge setup, if enabled;
- version number;
- publishing metadata;
- learner preview;
- progress tracking;
- dashboard readiness;
- permission behavior.
They should ensure that the course does not only look complete but also functions correctly.


### 6.9 Authorized Publisher

The Authorized Publisher is responsible for releasing approved courses to the learner-facing platform.

Publishing should remain separate from course creation and review.

The publisher should be able to:

- view approved courses ready for publication;
- check final metadata;
- select visibility setting;
- publish now or schedule publication;
- publish to pilot group or full catalog;
- confirm language version;
- confirm certificate setting;
- confirm practical proof/badge visibility;
- create the publication record;
- lock the published course version.
The publisher should not bypass required review gates unless they also hold the correct admin authority and the system records that decision.


### 6.10 Learner

Learners are CSO staff, leaders, board members, volunteers, or other users who take published courses.

They should be able to:

- access assigned or available courses;
- read course descriptions;
- complete lessons and activities;
- take the final test;
- receive an automated certificate when they score 80% or above;
- download or verify certificates where enabled;
- submit practical proof where a course offers that pathway;
- track proof review status;
- receive verified achievements or badges if proof is accepted;
- provide feedback;
- view progress and recommended next steps.
The learner should not see internal creator/reviewer notes, unsafe raw evidence, or unpublished course versions.


### 6.11 Organization Admin

The Organization Admin role is used where the platform supports organization-level learning records.

They may be able to view safe summaries such as:

- learners from their organization;
- course enrollment and progress;
- certificates earned;
- verified achievements awarded;
- capacity areas covered;
- recommended next courses;
- organization-level capacity evidence summaries.
They should not automatically see sensitive learner submissions, safeguarding information, or raw proof unless the system’s consent and visibility rules allow it.


### 6.12 Practical Proof Verifier

The Practical Proof Verifier reviews submitted evidence for verified achievement or badge recognition.

This role is separate from final test certification.

They should be able to:

- view submitted proof;
- check whether it matches the required task;
- apply the review rubric;
- request revision or redaction;
- reject unsafe or incomplete submissions;
- accept valid proof;
- award a verified achievement, badge, or capacity milestone;
- link the achievement to a CSO capacity indicator or standard;
- record reviewer notes;
- ensure raw evidence is not shared unsafely.
The verifier does not issue course certificates. Certificates are generated automatically based on the final test score of 80% or above.


### 6.13 Role-action matrix


| Action | Creator | DEC Admin | Reviewer | Publisher | Learner | Org Admin | Proof Verifier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create course draft | Yes | Yes | No | No | No | No | No |
| Complete Diagnosis / Analysis | Yes | Yes | No / Later | No | No | No | No |
| Lock Analysis for Design | Yes/Admin in early Phase 1 | Yes | Later enhancement | No | No | No | No |
| Edit Capacity Map / Action Map / Storyboard | Yes | Yes | No | No | No | No | No |
| Build course blocks | Yes | Yes | No | No | No | No | No |
| Add creator-added blocks | Yes | Yes | No | No | No | No | No |
| Use AI drafting support | Yes | Yes | No | No | No | No | No |
| Submit course for Review | Yes | Yes | No | No | No | No | No |
| Review course | No | Yes | Yes | No | No | No | No |
| Return course for revision | No | Yes | Yes | No | No | No | No |
| Approve course for Publish | No | Yes | Yes, if assigned | No | No | No | No |
| Publish course | No by default | Yes | No | Yes | No | No | No |
| Take course | No | Optional/test only | No | No | Yes | No | No |
| Take final test | No | Optional/test only | No | No | Yes | No | No |
| Receive certificate at 80%+ | No | No | No | No | Yes | No | No |
| Submit practical proof | No | No | No | No | Yes / CSO | Possibly | No |
| Review practical proof | No | Yes | If assigned | No | No | No | Yes |
| Award verified achievement/badge | No | Yes | If assigned | No | No | No | Yes |
| View own course monitoring | Yes | Yes | Limited | No | No | No | No |
| View organization dashboard | No | Yes | Limited | No | No | Yes | Limited |
| View donor-safe summaries | No | Yes | Limited | No | No | If enabled | No |

This matrix should guide implementation without forcing unnecessary complexity in early Phase 1. Where the repo currently uses simpler role boundaries, Codex should preserve what works and strengthen role separation in safe slices.


## 7. High-Level End-to-End Workflow

The DEC Learning Hub Course Creator Portal should follow a clear end-to-end workflow from course idea to monitored learning evidence.

The workflow should be understandable to non-technical course creators but deterministic enough for implementation.

The full workflow is:

Sign in → Course dashboard → Analysis Gate → Capacity Map → Action Map → Learning Design → Storyboard → Build Studio → Preview → Submit for Review → Review Decision → Publish → Learner Runtime → Certificate → Practical Proof / Verified Achievement → Monitoring and Improvement


### 7.1 Workflow principle

Each phase should answer a specific question:


| Phase | Main question |
| --- | --- |
| Analysis | What CSO capacity gap are we solving, and is it course-addressable? |
| Capacity Map | Which capacity area, indicator, standard, and learner group does this course support? |
| Action Map | What should learners be able to do differently? |
| Learning Design | What learning pathway, structure, practice, and assessment will support that action? |
| Storyboard | What is the block-by-block learner journey? |
| Build | How do we turn the approved design into a learner-facing course? |
| Preview | Does the course work as learners will experience it? |
| Review | Is the course accurate, useful, safe, accessible, and aligned? |
| Publish | Is the approved course released to the correct learners with the correct settings? |
| Learner Runtime | Do learners complete the course, pass the test, and receive certificates? |
| Practical Proof | Do learners/CSOs submit evidence of applied capacity where relevant? |
| Monitoring | What does the platform evidence show about learning, certificates, achievements, and improvement needs? |

This structure should guide routing, page layout, status labels, and handover records.


### 7.2 Step-by-step creator journey


#### Step 1: Creator signs in

The course creator signs into the portal and lands on the Creator Studio dashboard.

The dashboard should show:

- courses in progress;
- returned courses;
- submitted courses;
- approved courses;
- published courses;
- monitoring cards;
- next required actions.
The creator should not need to guess where to continue. Each course should clearly show its current status and the next step.


#### Step 2: Creator starts or opens a course

The creator may start a new course or continue an existing draft.

If starting a new course, the platform should guide the creator into the Analysis / Diagnosis area or require selection from an approved capacity gap record, depending on the current implementation state.

The system should avoid allowing unsupported generic course creation such as:

“Create any course on fundraising.”

Instead, the creator should work from an approved capacity gap such as:

“Local CSO finance staff struggle to prepare donor budget justifications that clearly link costs to activities and allowable categories.”


#### Step 3: Creator completes or reviews the Analysis Gate

The Analysis Gate captures or confirms:

- validated capacity gap;
- baseline/current practice;
- desired practice;
- root cause summary;
- target learner group;
- CSO capacity area;
- standard or indicator;
- K/S/M/E route;
- intervention decision;
- safeguards/no-harm note;
- evaluation anchor.
The platform should enforce the Phase 1 course-fit rule:

- Knowledge and Skill gaps may proceed to course design after approval/locking.
- Motivation and Environment gaps should not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly recorded.
The output is the Analysis-to-Design Handover.


#### Step 4: Analysis-to-Design Handover is approved or locked

Once the Analysis-to-Design Handover is approved or locked, the core Analysis fields become the official evidence base for the course.

These fields should be visible as read-only reference in later phases.

This handover unlocks the Design workflow.

If the handover is incomplete or not approved, the next phase should remain blocked or show a clear next action.


#### Step 5: Creator moves to Capacity Map

The Capacity Map connects the approved capacity gap to:

- capacity area;
- indicator or standard;
- target learner group;
- baseline;
- desired practice;
- expected capacity objective.
The approved Analysis summary should remain visible so the creator does not expand the course beyond the approved problem.


#### Step 6: Creator develops the Action Map

The Action Map translates the capacity gap into practical learner actions.

The creator defines:

- capacity goal;
- required actions;
- practice activities;
- minimum information.
This step prevents information-heavy training. The creator should first define what learners must do, then identify what information is needed to support that action.

Example:


| Capacity gap | Required learner action |
| --- | --- |
| CSOs collect feedback but do not categorize it | Categorize feedback as complaint, suggestion, protection concern, or project quality issue |
| CSOs submit weak budget narratives | Draft a basic budget justification linked to activity and cost category |
| CSOs do not use outcome evidence | Complete a simple outcome evidence worksheet |


#### Step 7: Creator prepares the Learning Design Document

The Learning Design Document turns the Action Map into a structured course plan.

It should define:

- course purpose;
- learner profile;
- learning pathway;
- lesson structure;
- practice strategy;
- assessment approach;
- accessibility and localization requirements;
- safeguarding constraints;
- AI authoring boundaries;
- evaluation linkage.
This document should answer:

What learning experience will help the target learner perform the required action better?


#### Step 8: Creator prepares the Storyboard and Block Plan

The Storyboard defines the course flow before Build begins.

It should include:

- lesson sequence;
- block sequence;
- purpose of each block;
- learner action in each block;
- examples and practice tasks;
- scenario logic where relevant;
- final test preparation;
- resources or templates;
- accessibility and safeguarding notes.
The Storyboard should not be treated as polished course content. It is the plan for the Build Studio.


#### Step 9: Design-to-Build Handover is approved

The Design-to-Build Handover consolidates:

- Analysis reference;
- performance goal;
- Action Map;
- Learning Design Document;
- Storyboard;
- scenario/practice plan;
- assessment intent;
- accessibility and localization requirements;
- safeguarding constraints;
- AI authoring context;
- evaluation anchor.
Once this handover is approved, the Build Studio can open.

If the handover is incomplete, Build should remain blocked or show clear missing items.


#### Step 10: Creator opens the Build Studio

The Build Studio converts the approved design into the actual learner-facing course.

It should show:

- approved design reference;
- required blocks from storyboard;
- full left-side expandable block library;
- center course canvas;
- right-side properties and governance panel;
- AI drafting support;
- block-purpose linking;
- added-block justification;
- final test configuration;
- practical proof setup where relevant.
The Build Studio should remain flexible but governed.


#### Step 11: Creator builds required blocks first

The creator should first build the required block sequence from the approved Storyboard.

Required blocks may include:

- lesson intro;
- short explainer;
- worked example;
- scenario;
- guided practice;
- checklist;
- resource download;
- knowledge check;
- final test;
- practical output instruction.
These blocks should remain linked to the approved design logic.


#### Step 12: Creator may add additional blocks

The creator may add additional blocks from the full block library when they improve the course.

For every creator-added block, the platform should capture:

- purpose tag;
- linked design element;
- short justification;
- review status.
The platform should guide the creator with warnings where needed, but should not turn the builder into a rigid locked script.

The key rule is:

Creator-added blocks are allowed, but they must remain aligned with the approved Analysis and Design records.


#### Step 13: Creator uses AI support within approved boundaries

AI may help draft or refine:

- short explanations;
- examples;
- scenario wording;
- feedback messages;
- final test items;
- plain-language versions;
- localization drafts;
- low-bandwidth alternatives.
AI must not invent objectives, indicators, donor rules, legal advice, or sensitive examples.

AI output must be reviewed by a human before the course is submitted.


#### Step 14: Creator configures the final test

Each course should include a final test.

The final test may include:

- multiple choice;
- true/false;
- matching;
- sequencing;
- scenario-based questions.
The test should assess essential content and decision logic taught in the course.

The binding certificate rule is:

80%+ final test score = course pass and automated course certificate.

Practical proof is not required for the certificate.


#### Step 15: Creator configures practical proof / verified achievement pathway where relevant

Where relevant, the creator may configure a practical proof pathway.

This is separate from the certificate.

The pathway may include:

- proof submission instructions;
- accepted proof types;
- safety/anonymization guidance;
- review criteria;
- reviewer role;
- verified achievement or badge label;
- link to capacity indicator or standard.
This allows DEC to recognize applied capacity beyond course completion.


#### Step 16: Creator previews the course as a learner

Before submitting for Review, the creator should preview the course in learner mode.

The preview should test:

- learner navigation;
- course flow;
- block rendering;
- mobile display;
- final test behavior;
- certificate trigger at 80%+;
- practical proof submission if enabled;
- downloads;
- accessibility supports;
- completion tracking.
The course should not proceed to Review if it does not work in learner preview.


#### Step 17: Creator submits course for Review

After preview and readiness checks, the creator submits the course for Review.

The Build-to-Review Handover should summarize:

- built course;
- required blocks;
- added blocks and justifications;
- AI review status;
- final test setup;
- certificate rule;
- practical proof setup;
- safeguarding checks;
- accessibility checks;
- learner preview evidence;
- reviewer attention items.

#### Step 18: Reviewers assess the course

Reviewers check:

- traceability to Analysis and Design;
- quality of content;
- block logic;
- added block justification;
- AI-generated content;
- final test quality;
- certificate rule;
- practical proof/badge setup;
- safeguarding and data safety;
- accessibility and localization;
- learner preview functionality.
Reviewers may approve, request minor fixes, return to Build, return to Design, return to Analysis, request specialist review, or reject.


#### Step 19: Authorized publisher publishes the course

Once review approval is complete, an authorized publisher or DEC admin publishes the course.

Publishing includes:

- final metadata;
- visibility setting;
- learner access setting;
- language version;
- certificate setting;
- practical proof/badge setting;
- version number;
- publication record.
Review and Publish must remain separated.


#### Step 20: Learners take the course

After publication, learners access the course from the learner-facing platform.

They complete lessons, activities, resources, and the final test.

If they score 80% or above on the final test, they receive the automated course certificate.


#### Step 21: Learners or CSOs may submit practical proof

Where practical proof is enabled, learners or CSOs may submit evidence of application.

The platform should give clear guidance on:

- what to submit;
- what not to submit;
- anonymization/redaction;
- review criteria;
- expected review process.

#### Step 22: Practical proof may lead to verified achievement or badge

A practical proof verifier reviews submitted evidence.

If accepted, the learner or CSO may receive:

- verified achievement;
- badge;
- organization capacity milestone;
- indicator-linked recognition.
This recognition is separate from the course certificate.


#### Step 23: Course creators and admins monitor performance

After publication, monitoring dashboards show:

- enrollment;
- progress;
- final test performance;
- certificates issued;
- feedback;
- drop-off points;
- proof submissions;
- verified achievements;
- course improvement needs.
Creators should see data for their own courses. Admins should see platform-level evidence.


#### Step 24: Evidence feeds into improvement and capacity strategy

Monitoring evidence should help DEC decide:

- which courses need revision;
- which capacity areas need more support;
- which learners or CSOs may need follow-up;
- which verified achievements show capacity progress;
- what evidence can support donor dialogue and program learning.
The workflow should not end at publication. It should create a feedback loop from learner activity and capacity evidence back into course improvement and DEC’s broader CSO capacity-strengthening strategy.


### 7.3 Workflow gate summary


| Gate | Required before proceeding | Unlocks |
| --- | --- | --- |
| Analysis Gate | Approved/locked Analysis-to-Design Handover | Capacity Map / Design |
| Design Gate | Approved Design-to-Build Handover | Build Studio |
| Build Gate | Completed Build-to-Review Handover | Review |
| Review Gate | Approved Course Review Record | Publish |
| Publish Gate | Authorized publication record | Learner access |
| Monitoring Gate | Published course version | Analytics, feedback, evidence, revision planning |


### 7.4 Implementation meaning

For implementation, this workflow means:

- every phase should have a clear status;
- handovers should preserve traceability;
- later phases should display read-only summaries from earlier approved phases;
- major changes should return the course to the appropriate earlier phase;
- learner-facing behavior should reflect what was approved in creator workflows;
- certificates, proof submissions, verified achievements, and monitoring should remain linked to the published course version.
This ensures that the DEC Learning Hub remains a coherent capacity-strengthening platform rather than a disconnected set of course pages.


## 8. Course Creator Dashboard and Navigation Experience

The Course Creator Dashboard is the main entry point for course creators after signing in. It should give creators a clear, practical view of their courses, their next actions, and the full workflow status of each course.

The dashboard should not feel like a generic admin panel or a technical developer interface. It should feel like a guided workspace for DEC course creators and subject matter experts who are developing learning products for local CSOs.

The dashboard must answer four simple questions for the creator:

- What courses am I responsible for?
- Where is each course in the workflow?
- What do I need to do next?
- What needs attention, review, revision, or monitoring?
The creator should never need to guess whether a course is still in Analysis, Design, Build, Review, Publish, or Monitoring. The platform should make this visible through status labels, workflow steps, progress indicators, next-action prompts, and clear navigation.


### 8.1 Dashboard purpose

The dashboard has three main purposes.

First, it helps creators manage their course work. They should see all courses they are drafting, building, revising, or monitoring.

Second, it reinforces the DEC workflow. The dashboard should show that courses move through a structured process, not random content creation.

Third, it protects quality and traceability. Each course card should remind the creator that the course is linked to a capacity gap, target learner group, capacity area, and workflow state.

The dashboard should therefore act as both a course management space and a workflow guidance space.


### 8.2 Default creator landing experience

After login, a course creator should land on a clear Creator Studio Home or Course Creator Dashboard.

The dashboard should include:


| Dashboard area | Purpose |
| --- | --- |
| Welcome / orientation panel | Briefly explains the creator’s current work and next priorities |
| My active courses | Shows courses currently in progress |
| Returned for revision | Highlights courses requiring creator action |
| Submitted for review | Shows courses waiting for review |
| Published courses | Shows courses already live |
| Monitoring snapshot | Shows high-level data for courses the creator owns or manages |
| Start new course / continue course | Clear action buttons |
| Guidance / support resources | Links to workflow guides, templates, AI support, and help notes |

The dashboard should prioritize action, not decoration. The creator should immediately know where to click next.


### 8.3 Course cards

Each course should appear as a clear card or row in the dashboard.

A course card should show:


| Field | Description |
| --- | --- |
| Course title | Working or published course title |
| Course status | Current workflow status |
| Capacity area | CSO capacity area linked to the course |
| Target learner group | Intended learner group |
| Last updated | Helps creators identify stale drafts |
| Next required action | Clear prompt such as “Complete Analysis Handover” or “Revise Build comments” |
| Review status | If submitted, returned, approved, or waiting |
| Publication status | Draft, scheduled, published, archived, revision |
| Alerts | Missing fields, reviewer comments, unresolved warnings, safeguarding flags |
| Quick actions | Continue, Preview, Submit, View comments, View monitoring |

The card should not show too much technical metadata. It should show just enough information to help the creator act confidently.

Example card logic:


| Course status | Next action |
| --- | --- |
| Analysis incomplete | Complete Analysis-to-Design Handover |
| Analysis locked | Continue to Capacity Map |
| Design incomplete | Complete Action Map / Learning Design / Storyboard |
| Design approved | Open Build Studio |
| Build incomplete | Finish required blocks and preview |
| Returned from Review | Review comments and revise |
| Approved for Publish | Waiting for authorized publisher |
| Published | View monitoring dashboard |


### 8.4 Workflow status labels

The platform should use consistent workflow status labels across the dashboard, navigation, course cards, and handover records.

Recommended status labels:


| Status label | Meaning |
| --- | --- |
| Draft | Course has been started but not yet ready for a gate |
| Setup | Basic course setup is in progress |
| Analysis | Diagnosis / Analysis is being completed |
| Analysis Locked | Analysis-to-Design Handover is approved or locked |
| Capacity Map | Capacity mapping is in progress |
| Action Map | Action mapping is in progress |
| Learning Design | Learning Design Document is being prepared |
| Storyboard | Storyboard / Block Plan is being prepared |
| Design Approved | Design-to-Build Handover is approved |
| Build | Course is being built |
| Preview | Course is being tested in learner mode |
| Submitted for Review | Course is awaiting review |
| Returned | Course has been returned for revision |
| Approved for Publish | Course passed review and is ready for publishing |
| Published | Course is live for learners |
| Revision | Published course is being revised |
| Archived | Course is no longer active |

These status labels should help creators understand where they are without needing to know technical workflow states.


### 8.5 Workflow progress tracker

Inside each course workspace, the platform should show a persistent workflow progress tracker.

Recommended tracker:

Setup → Analysis → Capacity Map → Action Map → Learning Design → Storyboard → Build → Preview → Review → Publish → Monitor

The tracker should show:

- completed steps;
- current step;
- locked steps;
- returned steps;
- steps blocked because a handover is incomplete;
- next required step.
The tracker should also support return paths. For example, if Review returns the course to Build, the tracker should show the course as “Returned to Build” with reviewer comments visible.

This is important because course creation is not always linear. Courses may move forward, return for revision, and then move forward again.


### 8.6 Main navigation structure for course creators

The Course Creator Portal should use clear navigation that mirrors the actual workflow.

Recommended primary navigation:


| Navigation item | Purpose |
| --- | --- |
| Dashboard | Overview of courses, tasks, and monitoring |
| My Courses | List of all courses the creator owns or contributes to |
| Analysis / Diagnosis | Evidence, baseline, K/S/M/E route, Analysis-to-Design Handover |
| Capacity Map | Capacity area, indicator, standard, learner group, baseline alignment |
| Action Map | Performance goal, required actions, practice activities, minimum information |
| Learning Design | Learning Design Document / course blueprint |
| Storyboard | Block plan, scenario/practice plan, assessment intent |
| Build Studio | Block-based course authoring workspace |
| Preview | Learner-mode course preview |
| Review Submission | Build-to-Review Handover and submit workflow |
| Review Feedback | Returned comments and revision tasks |
| Monitoring | Course analytics and improvement signals |
| Help / Guidance | Templates, examples, AI use guidance, support notes |

Navigation should avoid labels that are too technical or internally confusing. For example, “Analysis Handover” can appear inside the Analysis page, but the main navigation can simply say “Analysis / Diagnosis.”


### 8.7 Course workspace navigation

When a creator opens a specific course, the workspace should show course-specific navigation.

Recommended course workspace layout:


| Area | Purpose |
| --- | --- |
| Top bar | Course title, status, autosave/state, preview, submit action |
| Left navigation | Course workflow steps |
| Main workspace | Current step content |
| Right reference panel | Approved Analysis or Design summary, warnings, next action |
| Footer or action bar | Save, continue, request review, submit, return actions |

The right reference panel is important. In later phases, it should show read-only approved information from earlier gates.

Examples:

- In Capacity Map, show approved Analysis summary.
- In Action Map, show Analysis summary and capacity objective.
- In Build Studio, show Design-to-Build Handover summary.
- In Review Submission, show Build readiness and unresolved issues.
This keeps course creators focused and reduces drift.


### 8.8 Next-action guidance

The dashboard should always show a next-action prompt.

Good next-action prompts are specific and task-oriented.

Examples:


| Situation | Weak prompt | Better prompt |
| --- | --- | --- |
| Analysis missing | Continue | Complete Analysis-to-Design Handover |
| K/S route missing | Fix diagnosis | Select Knowledge/Skill route or record separable K/S component |
| Design incomplete | Work on course | Complete Action Map before Storyboard |
| Build missing blocks | Finish build | Add required blocks from approved Storyboard |
| Added blocks missing justification | Warning | Add purpose tags for 3 creator-added blocks |
| Course returned | Returned | Review 5 reviewer comments and revise Build |
| Course published | Done | View learner progress and final test results |

The platform should reduce ambiguity. Each next action should tell the creator exactly what is blocking progress or what to do next.


### 8.9 Alerts and warnings

The dashboard should include alerts, but they should be helpful rather than overwhelming.

Recommended alert types:


| Alert type | Example |
| --- | --- |
| Missing required field | “Baseline/current practice is missing in Analysis.” |
| Gate blocked | “Capacity Map is locked until Analysis Handover is approved.” |
| K/S/M/E routing issue | “Environment gap cannot proceed unless a separable Knowledge/Skill component is recorded.” |
| Added block warning | “Two creator-added blocks need purpose tags.” |
| AI review warning | “Three AI-generated blocks still need human review.” |
| Safeguarding warning | “Proof submission requires anonymization note.” |
| Accessibility warning | “Video block requires transcript or text alternative.” |
| Review return | “Reviewer returned the course to Build with required changes.” |
| Publish pending | “Course approved; waiting for authorized publisher.” |
| Monitoring alert | “High learner drop-off in Lesson 2.” |

Warnings should guide action. They should not simply mark something as wrong without telling the creator what to do.


### 8.10 Dashboard views by course status

The dashboard should allow creators to filter or group courses by status.

Recommended dashboard views:


| View | Shows |
| --- | --- |
| Active drafts | Courses in Setup, Analysis, Design, Storyboard, or Build |
| Needs my action | Courses with missing fields, returned comments, or unresolved warnings |
| Submitted | Courses awaiting review |
| Returned | Courses requiring revision |
| Approved / waiting publish | Courses approved but not yet published |
| Published | Live courses |
| Monitoring | Published courses with learner activity |
| Archived | Inactive or retired courses |

The default dashboard should prioritize Needs my action and Active drafts, because these are most useful for creators.


### 8.11 Monitoring view for course creators

Course creators should not only build courses; they should also learn from course performance.

The creator dashboard should include a monitoring snapshot for their own courses.

This may show:


| Monitoring item | Purpose |
| --- | --- |
| Learners enrolled | Shows course reach |
| Course completion rate | Shows whether learners finish |
| Final test pass rate | Shows learning achievement |
| Certificates issued | Shows learners who passed at 80%+ |
| Drop-off points | Shows where learners stop |
| Feedback summary | Shows learner relevance and usability feedback |
| Practical proof submissions | Shows application attempts |
| Verified achievements | Shows accepted applied-capacity evidence |
| Revision recommendations | Shows whether course improvement may be needed |

This monitoring should not be overloaded. It should help creators improve their courses and understand whether learners are benefiting.

Admins can have a broader monitoring dashboard across all courses, while creators should usually see only the courses they own, manage, or are assigned to.


### 8.12 Returned course and revision experience

When a course is returned from Review, the creator should see a clear revision workspace.

The returned course view should show:

- reviewer decision;
- reviewer comments;
- required fixes;
- optional suggestions;
- affected phase or block;
- severity level;
- due date or priority, if used;
- resubmit button after fixes are complete.
Reviewer comments should be actionable.

Example:


| Weak reviewer comment | Better reviewer comment |
| --- | --- |
| “Improve this section.” | “Shorten Block 4 and link it to Required Action 2. It currently adds theory not needed for the final test or practice task.” |
| “Check safeguarding.” | “Add anonymization warning before the proof upload block. Learners should not upload beneficiary names or active protection cases.” |
| “Quiz issue.” | “Question 6 tests content not covered in the course. Revise or remove.” |

The platform should help creators respond to comments without losing the course workflow history.


### 8.13 Help and support inside the dashboard

The dashboard should provide practical help for course creators.

Support resources may include:

- short workflow guide;
- examples of good Analysis-to-Design Handover;
- sample Capacity Action Map;
- sample Storyboard;
- Build Studio guide;
- AI prompting guidance;
- final test item examples;
- safeguarding and data safety guidance;
- accessibility checklist;
- practical proof guidance;
- review readiness checklist.
Help should be contextual. For example, the Build Studio should show block-building guidance, while the Analysis page should show diagnosis and K/S/M/E routing guidance.


### 8.14 Dashboard design principles

The Course Creator Dashboard should follow these design principles:


| Principle | Meaning |
| --- | --- |
| Workflow-first | The dashboard should show progress through the course creation workflow |
| Action-oriented | Every course should show the next required action |
| Non-technical | Language should be clear for CSO experts, not developers |
| Traceable | Courses should show their link to capacity area, learner group, and workflow state |
| Role-aware | Users should see only actions allowed by their role |
| Review-aware | Returned courses and reviewer comments should be visible and actionable |
| Evidence-aware | Monitoring should connect learning activity to capacity evidence |
| Safe | Sensitive data, proof, and internal review notes should not be exposed to unauthorized users |
| Low-clutter | Important actions and warnings should be prioritized |
| Consistent | Status labels and workflow steps should be used consistently across the portal |


### 8.15 Implementation intent for Codex

For implementation, the dashboard should not be treated as a decorative landing page. It should be the creator’s operational control center.

Codex should preserve existing working routes and dashboard elements where possible, but align the experience with the refined workflow.

The dashboard should support:

- course list with status and next action;
- route-aware workflow progress;
- clear grouping by status;
- returned course visibility;
- monitoring snapshot for published courses;
- role-aware actions;
- links into the correct workflow phase;
- alerts for blocked gates and missing requirements.
The dashboard should not require all advanced features to be completed at once. It can be implemented progressively, but the structure should anticipate the full workflow.

Minimum Phase 1 dashboard behavior should include:

- Creator can see courses they own or manage.
- Each course shows current workflow status.
- Each course shows next required action.
- Returned courses are clearly visible.
- Published courses link to monitoring.
- Navigation follows the workflow sequence.
- Blocked gates show clear explanations.
- Role boundaries prevent unauthorized publish or review actions.
The dashboard’s success standard is:

A course creator signs in and immediately understands what courses they are responsible for, where each course is in the DEC workflow, what is blocking progress, what they should do next, and how the course connects to CSO capacity strengthening.


## 9. Built-In CSO Capacity Framework

The DEC Learning Hub Course Creator Portal must include a built-in CSO Capacity Framework that guides course creators from the beginning of the workflow. This framework is one of the most important foundations of the platform because it prevents the portal from becoming a generic course authoring tool.

Course creators should not start by asking:

“What topic do I want to teach?”

They should start by asking:

“Which CSO capacity area needs to be strengthened, what specific gap has been diagnosed, what standard or indicator does it relate to, and what practical action should learners be able to perform better?”

The built-in CSO Capacity Framework should therefore function as a controlled taxonomy, guidance layer, design anchor, and reporting structure across the full workflow.

It should connect:

capacity area → sub-capacity → diagnosed gap → standard/indicator → learner group → performance goal → course design → final test → optional practical proof → verified achievement → monitoring evidence

The Analysis Phase specification already establishes that course creation should begin from validated capacity evidence, not unsupported course ideas, and that the platform should capture capacity gap, baseline, learner group, root cause, capacity area, indicator/framework, course-fit decision, and approved handover into Design.


### 9.1 Purpose of the CSO Capacity Framework

The built-in CSO Capacity Framework has seven purposes.

First, it gives course creators a structured starting point. Instead of inventing course topics freely, creators select from approved capacity areas, diagnosed gaps, and indicators.

Second, it helps DEC maintain strategic coherence across the EU-funded CSO capacity-building program. Courses should not be isolated learning products; they should contribute to broader capacity-strengthening priorities.

Third, it supports course relevance. By linking every course to a capacity area and indicator, the platform helps ensure that learning responds to actual CSO needs.

Fourth, it supports action-oriented design. The framework should not only name broad themes such as “governance” or “MEAL.” It should help translate them into practical learner actions.

Fifth, it supports monitoring and evidence. If courses, certificates, practical proof, and verified achievements are linked to capacity areas and indicators, DEC can later see which capacity areas are being addressed and where progress is emerging.

Sixth, it supports donor and partner communication. Indicator-linked learning and verified achievements can help DEC and CSOs communicate capacity progress more credibly.

Seventh, it reduces inconsistency. Controlled capacity areas and dropdowns prevent different creators from using different terms for the same capacity domain.


### 9.2 Core CSO Capacity Areas

The platform should include a controlled list of core CSO capacity areas. These should be used consistently in Analysis, Design, Build, Review, Publish, and Monitoring.

Recommended core capacity areas are:


| No. | CSO capacity area | Description |
| --- | --- | --- |
| 1 | Internal Governance and Leadership | Board functioning, leadership roles, decision-making, conflict of interest, organizational accountability, leadership transition, and governance procedures. |
| 2 | Transparency and Accountability | Public accountability, community feedback, complaint handling, information sharing, responsiveness, and trust-building with stakeholders. |
| 3 | Strategic Planning and Organizational Sustainability | Strategic direction, mission alignment, operational planning, sustainability planning, risk management, and adaptive organizational learning. |
| 4 | Financial Management and Resource Mobilization | Budgeting, financial controls, donor compliance, financial reporting, diversified funding, local resource mobilization, and funding readiness. |
| 5 | Human Resources, Inclusion, and Safeguarding | Staff systems, volunteer management, inclusion, gender sensitivity, safeguarding, protection, duty of care, and safe organizational practice. |
| 6 | Evidence-Based Advocacy and Civic Engagement | Policy engagement, advocacy planning, civic participation, evidence use, constituency engagement, and safe public communication. |
| 7 | Monitoring, Evaluation, Accountability, and Learning | Outcome monitoring, data use, feedback loops, learning reviews, adaptive management, reporting, and evidence-informed decision-making. |
| 8 | Digital Skills and Data Use / IT Competencies | Basic digital tools, data collection, information management, online collaboration, data protection, and practical technology use. |
| 9 | Networking, Partnerships, and Collective Action | Coalition-building, partnership management, coordination, shared advocacy, peer learning, and collective CSO action. |

The Analysis specification also emphasizes that these capacity areas should appear as controlled dropdowns or linked taxonomy fields, not only as open text, so DEC can track diagnosed gaps, course responses, and later evidence of improvement.


### 9.3 Capacity Areas Should Not Remain Too Broad

The platform should avoid leaving course creators only with broad categories. Broad categories are useful for organization, but course creation requires more precision.

For example:


| Broad capacity area | More specific sub-capacity | Better course focus |
| --- | --- | --- |
| MEAL | Outcome evidence use | Use one simple outcome indicator to prepare an evidence statement. |
| Financial Management | Budget justification | Prepare a basic donor budget justification linked to activities. |
| Governance | Conflict of interest | Identify and document a board conflict-of-interest situation. |
| Accountability | Community feedback categorization | Categorize feedback and identify safe escalation pathways. |
| Advocacy | Evidence-based policy message | Draft a safe, evidence-based policy message from community data. |
| Safeguarding | Referral pathway | Apply a safeguarding referral pathway using a realistic scenario. |
| Partnerships | Role clarification | Prepare a partnership role clarification note. |

The framework should therefore support capacity area → sub-capacity → specific performance gap.

This is important for implementation because a dropdown that only says “MEAL” is not enough. The platform should guide the creator toward the practical capacity problem inside MEAL.


### 9.4 Link to Standards, Indicators, and Commitments

Each capacity area should be linkable to relevant standards, indicators, or reference frameworks.

These may include:

- EU civil society capacity guidance;
- DG NEAR civil society guidelines;
- CSO accountability standards;
- safeguarding principles;
- HRBA principles;
- OECD/DAC-aligned capacity and learning concepts;
- DEC’s internal capacity-strengthening priorities;
- locally adapted CSO capacity indicators;
- donor-relevant organizational capacity expectations.
The platform does not need to make this overly academic for the course creator. But it should allow the creator to select or view the relevant indicator or standard that justifies the course.

A course should not only be tagged as:

“Advocacy”

It should be linked more specifically to an indicator or standard such as:

“CSO uses community evidence to develop safe, evidence-based advocacy messages.”

A course should not only be tagged as:

“Resource mobilization”

It should be linked to something more precise, such as:

“CSO prepares clear budget justifications and demonstrates funding readiness.”

The Analysis Phase specification states that selected capacity gaps should be mapped to relevant indicators, standards, or frameworks and that this mapping supports credible reporting, donor dialogue, peer learning, and adaptive capacity support.


### 9.5 Controlled Taxonomy and Dropdown Logic

The CSO Capacity Framework should be implemented as a controlled taxonomy, not only as free text.

This means the platform should provide structured selections for:


| Field | Example options |
| --- | --- |
| Capacity area | Governance, Accountability, MEAL, Resource Mobilization, Safeguarding, Digital Skills |
| Sub-capacity | Board oversight, feedback management, outcome evidence, budget justification |
| Target learner group | Board member, project officer, finance officer, MEAL officer, safeguarding focal person, advocacy staff |
| Standard / indicator | Relevant CSO capacity indicator or donor-aligned standard |
| Baseline status | Weak, emerging, partial, functional, strong, or custom rating if used |
| Desired practice | Specific improvement expected |
| Evidence source | Assessment, FGD, interview, CSO self-assessment, donor feedback, community feedback, review report |
| K/S/M/E route | Knowledge, Skill, Motivation, Environment, Mixed |
| Course-fit decision | Course-addressable, partly course-addressable, non-course route |
| Priority level | High, medium, low, strategic priority |
| Safeguarding sensitivity | None, moderate, high, specialist review needed |

Controlled fields should improve consistency, but the platform should also allow short narrative explanation where needed. The best structure is:

controlled selection + short contextual note

For example:


| Field | Controlled selection | Short note |
| --- | --- | --- |
| Capacity area | MEAL | CSOs collect attendance data but rarely use outcome evidence. |
| K/S/M/E route | Skill | Staff know what indicators are but struggle to apply them in reporting. |
| Course-fit decision | Course-addressable | A short guided practice course with template completion is appropriate. |

This gives Codex a clear implementation intent: use structured fields where consistency matters, and narrative fields where context matters.


### 9.6 Master Capacity Gap Bank

The platform should support the idea of a Master Capacity Gap Bank.

This does not have to be overbuilt in the first implementation slice, but the product description should make the intent clear.

The Master Capacity Gap Bank is an approved list of capacity gaps derived from:

- participatory scoping;
- CSO capacity assessments;
- stakeholder consultations;
- DEC program priorities;
- donor or partner feedback;
- community feedback;
- organizational review findings;
- previous learning and monitoring evidence.
Course creators should ideally start from this bank or from an approved Analysis record, rather than inventing unsupported courses.

A capacity gap record may include:


| Field | Description |
| --- | --- |
| Capacity gap title | Short name of the gap |
| Capacity gap statement | Clear description of the actual problem |
| Capacity area | Linked CSO capacity area |
| Sub-capacity | More specific capacity focus |
| Target learner group | Who needs the learning |
| Baseline/current practice | What is currently happening |
| Desired practice | What should improve |
| Evidence source | Where the finding came from |
| Indicator/standard | Relevant standard or measurable indicator |
| Priority level | Strategic importance |
| K/S/M/E diagnosis | Root cause category |
| Course-fit decision | Whether it can become a course |
| Safeguarding/data sensitivity | Whether special handling is needed |
| Status | Draft, validated, approved, archived |

This supports the principle that courses should come from validated capacity needs.

The detailed Analysis specification explicitly recommends a Master Capacity Gap Bank as an approved list of capacity gaps that governs what creators are allowed to build for a defined period.


### 9.7 How the Capacity Framework Appears Across the Workflow

The CSO Capacity Framework should not appear only once during setup. It should follow the course through the full workflow.


| Workflow phase | How the framework is used |
| --- | --- |
| Analysis | Select capacity area, sub-capacity, indicator, baseline, evidence source, K/S/M/E route |
| Capacity Map | Show how the course links to the capacity area and desired improvement |
| Action Map | Translate capacity gap into required learner actions |
| Learning Design | Select learning pathway based on capacity gap and K/S route |
| Storyboard | Plan blocks and practice activities linked to capacity objective |
| Build | Keep capacity reference visible; link blocks to required actions and practical outputs |
| Review | Check that the course still aligns with capacity area, indicator, and Analysis record |
| Publish | Tag course in catalog by capacity area and learner group |
| Learner Runtime | Show learners what capacity the course strengthens |
| Certificate | Include course and possibly capacity area, without overstating applied capacity |
| Practical Proof | Link submission to indicator or standard |
| Verified Achievement | Award badge/recognition linked to specific capacity achievement |
| Monitoring | Aggregate learning and achievement evidence by capacity area and indicator |

This ensures traceability from diagnosis to monitoring.


### 9.8 How the Framework Should Support Course Creation

The platform should use the framework to guide course creators without making the process feel bureaucratic.

For example, when a creator selects a capacity area, the platform can suggest:

- related sub-capacities;
- sample indicators;
- typical learner groups;
- common performance gaps;
- recommended course types;
- relevant block types;
- safeguarding considerations;
- possible practical proof examples.
Example:


| Creator selects | Platform may suggest |
| --- | --- |
| MEAL | Outcome evidence, feedback use, adaptive learning, reporting quality |
| Financial Management | Budgeting, documentation, donor compliance, financial transparency |
| Safeguarding | Referral pathway, code of conduct, safe reporting, data sensitivity |
| Advocacy | Evidence-based messaging, stakeholder mapping, safe civic engagement |
| Digital Skills | Data collection, spreadsheet use, online collaboration, data protection |

This should be guidance, not automatic course generation. The creator remains responsible for selecting the correct course focus based on the approved Analysis record.


### 9.9 Relationship Between Capacity Framework and K/S/M/E Routing

The capacity area tells the platform what domain the course relates to. The K/S/M/E diagnosis tells the platform what kind of intervention is appropriate.

For example:


| Capacity area | Gap | K/S/M/E route | Phase 1 decision |
| --- | --- | --- | --- |
| MEAL | Staff do not know the difference between output and outcome indicators | Knowledge | Can become a course |
| MEAL | Staff cannot complete an outcome evidence worksheet | Skill | Can become a course |
| MEAL | Staff do not value using data for learning | Motivation | Do not drive Phase 1 course unless separable K/S component exists |
| MEAL | Staff have no device or internet to enter data | Environment | Route outside course production |
| Advocacy | Staff know advocacy concepts but cannot draft a safe policy message | Skill | Can become a course |
| Safeguarding | Staff lack safe reporting procedure from management | Environment | Route outside course production or blended support |

This prevents the platform from assuming that every capacity gap can be solved by a course.

For Phase 1, Knowledge and Skill gaps can proceed to course design. Motivation and Environment gaps should be recorded and routed outside course production unless a separable Knowledge or Skill component is explicitly identified. The Build Phase specification confirms this Phase 1 boundary.


### 9.10 Relationship Between Capacity Framework and Practical Proof

The verified achievement layer depends on the capacity framework.

When learners or CSOs submit practical proof, the proof should be linked to a specific capacity area, sub-capacity, and indicator or standard.

For example:


| Course | Capacity area | Practical proof | Verified achievement |
| --- | --- | --- | --- |
| Using Outcome Evidence in CSO Reporting | MEAL | Completed outcome evidence worksheet | Outcome Evidence Practice Badge |
| Preparing Donor Budget Justifications | Financial Management and Resource Mobilization | Budget justification draft | Budget Justification Readiness Badge |
| Applying Safeguarding Referral Pathways | HR, Inclusion, and Safeguarding | Anonymized referral pathway checklist | Safeguarding Referral Practice Badge |
| Categorizing Community Feedback | Transparency and Accountability | Feedback categorization log | Community Feedback Use Badge |
| Drafting Evidence-Based Advocacy Messages | Advocacy and Civic Engagement | Safe policy message draft | Evidence-Based Advocacy Badge |

This is important because the verified achievement is not just a learning badge. It is a signal of reviewed applied capacity linked to the CSO capacity framework.


### 9.11 Relationship Between Capacity Framework and Monitoring

The capacity framework should also structure monitoring dashboards.

DEC should be able to see:

- how many courses exist under each capacity area;
- which capacity areas have high learner demand;
- which courses have high completion or low completion;
- pass rates by capacity area;
- certificates issued by capacity area;
- practical proof submissions by capacity area;
- verified achievements by capacity area;
- organization-level capacity evidence by area;
- gaps where few courses or achievements exist;
- courses that need revision based on feedback or performance.
The Monitoring and Evaluation specification emphasizes that monitoring should connect learner activity, final test results, certificates, practical proof, verified achievements, and feedback back to the original Analysis baseline and Design performance goal.

This means monitoring should not only answer:

“How many learners completed courses?”

It should also answer:

“Which CSO capacity areas are being strengthened, where is practical proof being submitted, and where do courses need improvement?”


### 9.12 Platform Behavior Expected From the Capacity Framework

For implementation, the built-in CSO Capacity Framework should produce the following platform behavior.


| Expected behavior | Description |
| --- | --- |
| Controlled selection | Capacity areas and sub-capacities should be selected from structured lists where possible |
| Link to evidence | Capacity gap should connect to evidence source and baseline |
| Link to standard/indicator | Each course should connect to a relevant indicator or standard where available |
| Read-only persistence | Approved capacity framework selections should remain visible in later phases |
| Course-fit support | K/S/M/E route should guide whether the gap can proceed to course design |
| Design guidance | Capacity area should inform recommended actions, examples, scenarios, and proof types |
| Review support | Reviewers should verify alignment with the selected capacity area and indicator |
| Publish metadata | Published courses should be categorized by capacity area and learner group |
| Certificate context | Certificate may include course and capacity area, but should not overclaim applied capacity |
| Verified achievement linkage | Badges/achievements should link to capacity indicators or standards |
| Monitoring aggregation | Dashboards should aggregate evidence by capacity area and indicator |

This behavior should be implemented progressively. Codex does not need to build the most advanced taxonomy system in the first slice, but the data and UI should be aligned with this direction.


### 9.13 Minimum Phase 1 Requirements

For Phase 1, the CSO Capacity Framework should minimally support:

- Controlled selection of the main CSO capacity area.
- Short description of the specific capacity gap.
- Target learner group.
- Baseline/current practice.
- Desired practice.
- Indicator or standard linkage where available.
- K/S/M/E diagnosis.
- Course-fit decision.
- Read-only display of approved capacity information in Design and Build.
- Course catalog tagging by capacity area.
- Monitoring aggregation by capacity area.
- Verified achievement linkage to capacity area and indicator where proof is enabled.
Future enhancements can deepen the framework with advanced taxonomies, donor mapping, detailed sub-indicators, comparative organizational maturity levels, and richer capacity evidence dashboards.


### 9.14 Success Standard for the Built-In CSO Capacity Framework

The CSO Capacity Framework is successful when:

A course creator cannot easily create a generic course disconnected from DEC’s capacity-strengthening purpose. Every course is visibly linked to a CSO capacity area, a diagnosed gap, a learner group, a practical action, and—where relevant—a standard, indicator, certificate, verified achievement, and monitoring evidence.

In practical terms, the framework should help DEC move from:

“We created a training on MEAL.”

to:

“We created a course for CSO project officers who struggle to use outcome evidence. It is linked to the MEAL capacity area, baseline evidence, a specific performance goal, a final test, optional outcome-evidence proof submission, and monitoring indicators showing completion, certificates, and verified practice.”


## 10. Analysis Gate: Evidence, Baseline, and Course-Fit Decision

The Analysis Gate is the first major quality gate in the DEC Learning Hub Course Creator Portal. It ensures that no course moves into design unless it is linked to a validated CSO capacity need, a baseline/current practice, a root-cause diagnosis, and a clear decision that the gap is suitable for a Phase 1 course.

The Analysis Gate should strengthen the existing Diagnosis area into a more formal Analysis-to-Design Handover. This does not mean the platform must conduct all diagnosis work inside the software. Much of the deep diagnosis may happen outside the platform through participatory scoping, interviews, focus group discussions, CSO self-assessments, community feedback, program reviews, or DEC capacity assessment processes.

The platform’s role is to capture the approved outputs of that diagnosis as structured data that guides the rest of the course creation workflow.

The Analysis Gate answers:

What CSO capacity problem are we solving, what evidence supports it, what is the current baseline, what is the root cause, and is this problem suitable for a Phase 1 learning course?


### 10.1 Purpose of the Analysis Gate

The Analysis Gate exists to prevent generic course creation.

Without this gate, a course creator may start with a broad topic such as:

- “create a course on governance”;
- “create a course on fundraising”;
- “create a course on MEAL”;
- “create a course on safeguarding.”
These topics may be relevant, but they are too broad to guide effective course design.

The Analysis Gate forces the platform to move from a broad topic to a specific capacity gap.

For example:


| Generic topic | Better Analysis Gate output |
| --- | --- |
| Governance | CSO board members do not consistently identify and document conflict-of-interest situations. |
| Fundraising | CSO program staff struggle to prepare donor budget justifications that clearly connect activities, costs, and allowable categories. |
| MEAL | CSO project officers collect activity data but rarely use outcome evidence to support learning or reporting. |
| Safeguarding | Safeguarding focal persons are unsure how to apply referral pathway steps safely when a concern is reported. |
| Advocacy | Advocacy staff struggle to draft evidence-based policy messages using safe and non-inflammatory language. |

This gate protects DEC’s capacity-strengthening purpose by ensuring that each course begins from a real, specific, and course-addressable problem.


### 10.2 Fieldwork and Diagnosis May Happen Outside the Platform

The Analysis Gate should not be overbuilt as if all scoping, fieldwork, and participatory diagnosis must happen inside the software.

In the DEC context, capacity diagnosis may come from:

- participatory scoping sessions;
- CSO consultations;
- interviews;
- focus group discussions;
- CSO self-assessments;
- organizational capacity assessments;
- donor feedback;
- community feedback;
- training evaluation findings;
- DEC program learning;
- partner reports;
- previous monitoring evidence;
- expert review.
The platform should capture the structured result of this work, not replace it.

This means the software should allow DEC staff or creators to enter, select, or confirm:

- evidence source;
- capacity gap statement;
- baseline/current practice;
- desired practice;
- target learner group;
- root cause;
- capacity area;
- indicator or standard;
- course-fit decision;
- safeguards;
- evaluation anchor.
The implementation intent is:

Field reality is gathered through participatory and program processes. The platform turns the validated findings into structured workflow records that govern course design and build.


### 10.3 Master Capacity Gap Bank

The platform should support the idea of a Master Capacity Gap Bank.

This is an approved list of CSO capacity gaps that DEC has identified through scoping, diagnosis, program learning, or strategic priorities.

In Phase 1, this may be implemented simply. It does not need to be a complex standalone system at the beginning. It may start as approved analysis records, controlled lists, or structured diagnosis entries. However, the product direction should be clear: creators should ideally start from a validated capacity gap, not a free-form course idea.

A capacity gap record should include:


| Field | Purpose |
| --- | --- |
| Capacity gap title | Short name of the problem |
| Capacity gap statement | Clear description of the actual capacity problem |
| CSO capacity area | Links to the CSO Capacity Framework |
| Sub-capacity | More specific capacity focus |
| Target learner group | Defines who needs support |
| Evidence source | Shows where the finding came from |
| Baseline/current practice | Describes the current situation |
| Desired practice | Describes the expected improvement |
| Root cause | Explains why the gap exists |
| K/S/M/E route | Shows whether the gap is Knowledge, Skill, Motivation, Environment, or Mixed |
| Course-fit decision | Shows whether it can proceed to course design |
| Indicator or standard | Links to measurable capacity expectations |
| Safeguards/no-harm note | Identifies risks or sensitive issues |
| Evaluation anchor | Defines what later evidence may show progress |
| Status | Draft, validated, approved, archived |

This Master Capacity Gap Bank helps DEC maintain coherence across courses and prevents duplication or unsupported course creation.


### 10.4 Required Analysis Gate Inputs

Before a course can proceed into Design, the Analysis Gate should capture the following minimum information.


| Required input | Description |
| --- | --- |
| Capacity gap statement | A clear statement of the specific CSO capacity problem |
| Target learner group | The staff, leaders, volunteers, or roles the course is intended for |
| CSO capacity area | One of the approved capacity areas from the built-in framework |
| Baseline/current practice | What learners or CSOs currently do, struggle with, or fail to do |
| Desired practice | What learners or CSOs should be able to do better |
| Evidence source | Where the diagnosis came from |
| Root cause summary | Why the gap exists |
| K/S/M/E diagnosis | Whether the gap is Knowledge, Skill, Motivation, Environment, or Mixed |
| Course-fit decision | Whether the issue is suitable for Phase 1 course production |
| Indicator/standard linkage | Relevant standard, indicator, or framework connection where available |
| Safeguards/no-harm note | Any civic-space, safeguarding, data, or ethical concerns |
| Evaluation anchor | What later evidence could show progress |
| Analysis status | Draft, incomplete, ready to lock, locked, returned, archived |

These inputs should be captured as structured fields where possible. Narrative notes may be used for context, but core fields should not be only free text.


### 10.5 The Three Needs-Analysis Questions

The Analysis Gate should guide course creators or DEC staff through three practical needs-analysis questions adapted to the CSO context.


### Question 1: What are CSOs currently doing?

This defines the baseline/current practice.

Examples:

- CSOs collect attendance data but rarely analyze outcome evidence.
- Finance officers prepare budgets but struggle to justify costs clearly.
- Board members approve decisions but do not document conflict-of-interest issues.
- Field staff receive community feedback but do not categorize or escalate it consistently.

### Question 2: What do CSOs need to do to achieve their mission or capacity objective?

This defines the desired practice.

Examples:

- CSOs use simple outcome indicators to explain project results.
- Finance staff prepare budget justifications that link costs to activities and donor rules.
- Board members identify, declare, and document conflict-of-interest situations.
- Field staff categorize feedback and escalate sensitive concerns safely.

### Question 3: Why are CSOs not doing this now?

This defines the root cause.

Examples:

- They do not know the difference between output and outcome evidence.
- They know the concept but cannot apply it to their reporting template.
- They lack confidence to use community evidence in advocacy.
- They lack tools, time, internet access, or management support.
This step is important because the root cause determines whether a course is appropriate.


### 10.6 K/S/M/E Root-Cause Diagnosis

The Analysis Gate should use the K/S/M/E diagnostic model to classify the root cause of the gap.


| Route | Meaning | Phase 1 implication |
| --- | --- | --- |
| Knowledge | Learners lack information, rules, concepts, definitions, or awareness | Can proceed to course design |
| Skill | Learners need practice applying a task, tool, process, or judgment | Can proceed to course design |
| Motivation | Learners may know what to do but lack confidence, incentives, commitment, leadership support, or ownership | Do not proceed as a Phase 1 course unless a separable Knowledge/Skill component is identified |
| Environment | Learners are blocked by tools, systems, resources, policies, funding, time, safety, or infrastructure | Do not proceed as a Phase 1 course unless a separable Knowledge/Skill component is identified |
| Mixed | More than one cause is present | Proceed only if the course-addressable Knowledge/Skill component is explicit |

The platform should not treat all capacity problems as training problems.

For example:


| Problem | Likely route | Course-fit decision |
| --- | --- | --- |
| Staff do not know the donor’s basic reporting categories | Knowledge | Course-addressable |
| Staff know the reporting categories but cannot complete the template accurately | Skill | Course-addressable |
| Staff do not believe the data will be used by management | Motivation | Not a Phase 1 course by itself |
| Staff lack internet access to upload reports | Environment | Not a Phase 1 course by itself |
| Staff lack both skill and tools | Mixed | Build only the skill component if separable; route tool issue elsewhere |

This is a critical Phase 1 product boundary.


### 10.7 Course-Fit Decision

After the K/S/M/E diagnosis, the platform should require a clear course-fit decision.

Recommended options:


| Course-fit decision | Meaning | Next step |
| --- | --- | --- |
| Course-addressable | The gap is mainly Knowledge or Skill and can proceed to Design | Unlock Design after handover is locked |
| Partly course-addressable | A Knowledge/Skill component exists, but other support is needed | Proceed only with explicit course-addressable component |
| Non-course route | The issue is mainly Motivation or Environment | Do not unlock course design |
| Needs further diagnosis | Evidence or root cause is unclear | Return to Analysis |
| Not suitable / archived | Should not become a course | Archive or route outside course workflow |

This decision should be visible in the Analysis-to-Design Handover and later read-only panels.

The platform should explain blocked decisions clearly. For example:

This issue is currently diagnosed as an Environment gap. It cannot proceed to Phase 1 course design unless a separable Knowledge or Skill component is recorded.

This is better than simply hiding the next button.


### 10.8 Separable Knowledge/Skill Component Rule

Some Motivation or Environment gaps may include a smaller Knowledge or Skill component that can be addressed through a course.

The platform should allow such cases only when the creator explicitly records the separable course-addressable component.

Example:


| Main issue | Not course-addressable alone | Separable K/S component |
| --- | --- | --- |
| CSOs lack internet access for digital reporting | Environment | Staff can still learn how to prepare offline data templates before upload |
| Board does not prioritize conflict-of-interest documentation | Motivation | Board members can learn the basic steps and risks of conflict-of-interest declaration |
| CSOs lack donor relationships | Environment/Motivation | Staff can learn how to prepare a funding pitch or donor mapping sheet |
| Staff lack time for MEAL | Environment | Staff can learn a 15-minute feedback categorization routine |

For these cases, the Analysis Gate should require:

- primary K/S/M/E route;
- description of the Motivation/Environment issue;
- explicit separable Knowledge/Skill component;
- course-fit justification;
- non-course support note for the remaining issue.
This prevents the platform from forcing systemic problems into course format while still allowing useful learning products where appropriate.


### 10.9 Safeguards and No-Harm Review at Analysis Stage

The Analysis Gate should capture early safeguards before the course is designed.

This is especially important for courses involving:

- safeguarding;
- GBV or protection;
- child protection;
- community feedback and complaints;
- advocacy;
- civic-space restrictions;
- government relations;
- sensitive data;
- beneficiary information;
- whistleblowing;
- conflict or politically sensitive contexts.
The platform should ask:


| Safeguard question | Purpose |
| --- | --- |
| Could this course expose learners, CSOs, communities, or rights-holders to risk? | Identifies safety concerns early |
| Could the course require learners to discuss sensitive cases? | Prevents unsafe disclosure |
| Could practical proof include personal or sensitive data? | Prepares data protection guidance |
| Is anonymization or fictionalization required? | Prevents unsafe examples |
| Is specialist review needed? | Routes safeguarding/civic-space concerns |

The Analysis-to-Design Handover should include a safeguards/no-harm note. This note should follow the course into Design, Build, Review, and Monitoring.


### 10.10 Baseline and Evaluation Anchor

The Analysis Gate should create the first evaluation anchor for the course.

This does not need to be complex. At minimum, the platform should capture:


| Evaluation field | Purpose |
| --- | --- |
| Baseline/current practice | What is happening now |
| Desired practice | What should improve |
| Indicator or standard | What the improvement is linked to |
| Means of verification | How evidence may later be observed |
| Possible learner output | What learners may produce |
| Practical proof possibility | Whether applied evidence may be submitted later |
| Monitoring signal | What data the platform should track |

Example:


| Field | Example |
| --- | --- |
| Baseline | CSO project officers collect activity counts but rarely prepare outcome evidence statements. |
| Desired practice | Officers can prepare a simple outcome evidence statement using one indicator and one evidence source. |
| Indicator | MEAL / outcome evidence use |
| Means of verification | Final test, completed worksheet, optional submitted outcome evidence worksheet |
| Monitoring signal | Pass rate, certificate count, proof submissions, verified achievements, learner feedback |

This evaluation anchor allows later Monitoring and Evaluation to connect back to the original capacity gap.


### 10.11 Analysis-to-Design Handover

The final output of the Analysis Gate is the Analysis-to-Design Handover.

This handover is the official record that allows the course to proceed into Design.

It should include:


| Handover field | Description |
| --- | --- |
| Handover ID | Unique record ID |
| Course or gap title | Working title or capacity gap title |
| Capacity gap statement | The validated problem |
| Target learner group | Who the course is for |
| Capacity area | Linked CSO capacity domain |
| Sub-capacity | More specific focus |
| Indicator or standard | Relevant framework or indicator |
| Baseline/current practice | Current situation |
| Desired practice | Target improvement |
| Root cause summary | Why the gap exists |
| K/S/M/E route | Knowledge, Skill, Motivation, Environment, Mixed |
| Separable K/S component | Required when Motivation/Environment/Mixed is involved |
| Course-fit decision | Course-addressable, partly course-addressable, non-course, needs further diagnosis |
| Safeguards/no-harm note | Risk and safety considerations |
| Evaluation anchor | How later progress may be assessed |
| Approval/lock status | Draft, ready, locked, returned, archived |
| Locked by / date | Accountability for gate decision |

Once locked, the handover should become read-only unless it is formally reopened.


### 10.12 Approval and Locking Behavior

The Analysis Gate should have clear approval/locking behavior.

In early Phase 1, the practical implementation may allow creator/admin approval inside Studio, using a label such as:

Lock Analysis for Design

or:

Approve Analysis Handover for Design

This should be understood as a workflow gate, not a full institutional external review.

Later, DEC may strengthen this with capacity lead or reviewer approval.

Expected behavior:


| Condition | Platform behavior |
| --- | --- |
| Required fields incomplete | Design remains blocked |
| K/S route selected and handover complete | Handover can be locked |
| Skill route selected and handover complete | Handover can be locked |
| Motivation/Environment selected without separable K/S component | Design remains blocked |
| Mixed selected without explicit K/S component | Design remains blocked |
| Handover locked | Design unlocks |
| Locked handover needs major change | Reopen Analysis and require relocking |
| Course returned to Analysis from Review | Analysis becomes editable according to permissions |

This behavior makes the gate deterministic for implementation.


### 10.13 Read-Only Analysis Reference in Later Phases

After the Analysis-to-Design Handover is locked, its summary should appear as a read-only reference in later phases.

At minimum, it should appear in:

- Capacity Map;
- Action Map;
- Learning Design;
- Storyboard;
- Build Studio;
- Review dashboard.
The read-only reference should show:

- capacity gap;
- target learner group;
- capacity area;
- baseline;
- desired practice;
- root cause;
- K/S/M/E route;
- course-fit decision;
- safeguards;
- evaluation anchor.
The purpose is to prevent drift. Creators and reviewers should always be able to see what problem the course is supposed to solve.


### 10.14 Platform Behavior for Analysis Gate

For implementation, the platform should behave as follows:


| Expected behavior | Description |
| --- | --- |
| Structured inputs | Core analysis fields should be structured, not only free text |
| Controlled taxonomy | Capacity area, learner group, K/S/M/E route, course-fit decision should use controlled options |
| Evidence capture | Evidence source and baseline should be recorded |
| Course-fit logic | Platform should enforce Knowledge/Skill boundary for Phase 1 |
| Handover generation | Platform should generate an Analysis-to-Design Handover |
| Locking | Approved/locked handover controls access to Design |
| Read-only reference | Locked Analysis summary appears in later phases |
| Return path | If major issues are found later, course can return to Analysis |
| Audit trail | Locking/reopening should be traceable |
| Non-course routing | Motivation/Environment gaps should be recorded without forcing a course |

This section should guide Codex to strengthen the current Diagnosis foundation without overbuilding a complex diagnosis platform.


### 10.15 Minimum Phase 1 Requirements

For Phase 1, the Analysis Gate should minimally support:

- Existing Diagnosis flow is preserved.
- Required Analysis-to-Design Handover fields are added or aligned.
- Knowledge and Skill routes can proceed after locking.
- Motivation and Environment routes are blocked from course production unless separable Knowledge/Skill component is recorded.
- Capacity Map / Design is blocked until the handover is locked.
- Locked Analysis summary appears read-only in Design.
- Certificate logic is not touched in this slice.
- Build Studio changes are not required in this slice.
- Practical proof / verified achievement implementation is not required in this slice, though future linkage fields may be noted.
- Tests verify course-fit routing and Design unlock behavior.

### 10.16 Success Standard for the Analysis Gate

The Analysis Gate is successful when:

A course cannot proceed into Design unless it is grounded in a validated CSO capacity gap, baseline/current practice, root-cause diagnosis, Knowledge/Skill course-fit decision, safeguards, and evaluation anchor.

In practical terms, the platform should prevent this:

“I want to create a course on fundraising.”

And guide the creator toward this:

“This course responds to a validated Resource Mobilization capacity gap: CSO program staff struggle to prepare donor budget justifications that connect activities, costs, and allowable categories. The gap is Skill-based, course-addressable, linked to funding readiness, and will be evaluated through a final test and optional budget justification proof.”

The Analysis Gate is the foundation that keeps the DEC Learning Hub from becoming a generic content platform.


## 11. Design Phase: From Diagnosis to Build-Ready Learning Design

The Design Phase is the structured bridge between the approved Analysis Gate and the Build Studio. It converts the locked Analysis-to-Design Handover into a clear, practical, build-ready learning design.

This phase should not be treated as content writing, AI drafting, video production, or course block assembly. Those belong to the Build Phase. The Design Phase is where the creator decides:

What must learners actually do differently, how will they practice it, what information do they need, how will learning be checked, and what design package should guide Build?

The Design Phase should protect the platform from producing courses that are polished but not useful. It ensures that each course is designed around a specific CSO capacity gap, target learner group, performance goal, practical action, assessment logic, and evaluation anchor.

The detailed Design Phase specification defines this phase as the structured bridge between approved Analysis and actual course building, producing the performance goal, action map, course blueprint, storyboard/block plan, practice activities, assessment/action commitment logic, and Design-to-Build Handover.


### 11.0 Purpose of the Design Phase

The Design Phase exists because many training products fail between diagnosis and course production.

A strong diagnosis may identify that CSO staff struggle with donor budget justification, outcome evidence, community feedback, safeguarding referrals, or evidence-based advocacy. But if the creator immediately starts writing content, the course can become too theoretical, too long, or disconnected from real CSO practice.

The Design Phase prevents this by forcing a shift from:

“What content should we teach?”

to:

“What practical action should the learner perform, and what support do they need to perform it well?”

The Design Phase should ensure that each course is:

- grounded in the locked Analysis-to-Design Handover;
- linked to a real CSO capacity gap and baseline;
- focused on observable learner performance;
- aligned with the Knowledge/Skill course-fit decision;
- realistic for local CSO working conditions;
- safe for sensitive civic-space, safeguarding, data, and advocacy contexts;
- suitable for mobile-first and low-bandwidth learning;
- ready for AI-assisted authoring without drifting into generic content;
- prepared for final test development;
- prepared for optional practical proof / verified achievement where relevant;
- connected to monitoring and evaluation from the beginning.
The Design Phase is therefore a build-control layer. Build should not open from a loose idea or general storyboard. Build should open only after the Design-to-Build Handover is complete and approved.


## 11.1 Capacity Objective and Performance Goal

The first task in the Design Phase is to translate the approved capacity gap into a clear capacity objective and performance goal.

The capacity objective explains what area of CSO capacity the course supports. The performance goal explains what the learner should be able to do better after the course.

The platform should display the locked Analysis summary as a read-only reference while the creator writes the objective and goal.

The creator should see:

- validated capacity gap;
- target learner group;
- CSO capacity area;
- baseline/current practice;
- desired practice;
- root cause;
- K/S/M/E route;
- course-fit decision;
- indicator or standard;
- safeguards/no-harm note;
- evaluation anchor.
This ensures that the performance goal is not invented separately from the diagnosis.


### 11.1.1 Capacity objective

The capacity objective describes the organizational or practice improvement the course is meant to support.

It should be:

- linked to the approved CSO capacity area;
- aligned with the indicator or standard;
- realistic for a learning course;
- specific enough to guide course design;
- connected to the baseline and desired practice.
Weak capacity objective:

Improve CSO governance.

Stronger capacity objective:

Strengthen CSO board members’ ability to identify, declare, and document conflict-of-interest situations during board decision-making.

Weak capacity objective:

Improve MEAL.

Stronger capacity objective:

Strengthen CSO project officers’ ability to use simple outcome evidence in project learning and reporting.


### 11.1.2 Performance goal

The performance goal is more learner-facing and action-oriented. It should describe what learners should be able to do by the end of the course.

The performance goal should use observable action verbs, such as:

- identify;
- categorize;
- draft;
- calculate;
- compare;
- apply;
- document;
- escalate;
- analyze;
- revise;
- prepare;
- submit;
- decide.
The platform should discourage vague verbs such as:

- understand;
- know;
- learn about;
- be aware of;
- appreciate.
Examples:


| Capacity area | Weak topic | Strong performance goal |
| --- | --- | --- |
| MEAL | Understand outcome monitoring | Use one simple outcome indicator to prepare an outcome evidence statement. |
| Financial Management and Resource Mobilization | Learn donor budgeting | Prepare a basic donor budget justification using activity links and allowable cost categories. |
| Evidence-Based Advocacy and Civic Engagement | Learn advocacy | Draft a short, safe, evidence-based advocacy message using community evidence. |
| Internal Governance and Leadership | Board leadership | Identify and document a conflict-of-interest situation using a simple board procedure. |
| Human Resources, Inclusion, and Safeguarding | Safeguarding awareness | Apply the correct referral pathway when a safeguarding concern is reported. |
| Transparency and Accountability | Community accountability | Categorize community feedback and identify the correct escalation pathway. |

The platform should treat the performance goal as a core design field. It should later guide:

- Action Map;
- Storyboard;
- Build blocks;
- final test questions;
- practical proof;
- review checklist;
- monitoring evidence.

### 11.1.3 Performance goal quality check

The platform should help the creator check the performance goal.


| Quality question | Expected answer |
| --- | --- |
| Is the goal linked to the approved Analysis record? | Yes |
| Is the learner group clear? | Yes |
| Is the goal observable? | Yes |
| Does it use an action verb? | Yes |
| Can the learner reasonably practice this in a short course? | Yes |
| Can it be assessed through a final test, practical task, or proof? | Yes |
| Does it avoid broad or abstract wording? | Yes |
| Does it preserve safeguards and no-harm requirements? | Yes |

If the performance goal is vague or too broad, the platform should prompt the creator to revise it before moving to the Action Map.


## 11.2 Capacity Action Map

The Capacity Action Map is the core design method of the Design Phase. It converts the performance goal into required learner actions, practice activities, and minimum information.

It prevents information dumping by forcing creators to define action before content.

The Action Map should answer:

What must learners actually do to achieve the performance goal?

The recommended Action Map has four layers:


| Layer | Design question |
| --- | --- |
| Capacity goal | What practical organizational or performance goal does this course support? |
| Required actions | What must the learner actually do? |
| Practice activities | How will the learner practice those actions? |
| Minimum information | What is the smallest amount of information needed to perform the action well? |

The detailed Design Phase specification emphasizes that the action map should include these four layers and that content should only be added if it supports a required action.


### 11.2.1 Required actions

Required actions are the specific steps or behaviors learners must perform.

For example, if the performance goal is:

Use one simple outcome indicator to prepare an outcome evidence statement.

Required actions may include:

- Identify the outcome indicator.
- Identify one relevant evidence source.
- Distinguish activity/output data from outcome evidence.
- Write a short evidence statement.
- Explain how the evidence can inform a project decision.
Required actions should be practical, observable, and realistic.

They should not be phrased as content topics.

Weak required action:

Learn about outcome indicators.

Strong required action:

Select the best outcome indicator from a short project example.


### 11.2.2 Practice activities

Each required action should have a related practice activity.

Practice activities may include:

- categorizing examples;
- completing part of a template;
- choosing a best-fit decision;
- drafting a short message;
- applying a checklist;
- revising a weak example;
- matching terms to examples;
- sequencing steps;
- responding to a scenario;
- completing a short work sample.
Practice should feel close to the learner’s real CSO work.

Examples:


| Required action | Practice activity |
| --- | --- |
| Categorize feedback | Learner reviews five community feedback entries and classifies them correctly. |
| Prepare budget justification | Learner fills in missing justification text for three budget lines. |
| Apply referral pathway | Learner chooses the correct next step in a safeguarding scenario. |
| Draft advocacy message | Learner revises a weak advocacy message using safer language. |
| Identify conflict of interest | Learner reviews a board decision case and marks the conflict issue. |


### 11.2.3 Minimum information

Minimum information is the smallest amount of content learners need to perform the required action.

The platform should discourage creators from adding long background sections that do not support practice.

For example:


| Required action | Minimum information |
| --- | --- |
| Categorize feedback | One-page guide explaining complaint, suggestion, protection concern, and project quality issue. |
| Prepare budget justification | Short list of allowable cost categories and example justification wording. |
| Apply referral pathway | Simple referral pathway diagram and “do not investigate” caution. |
| Draft advocacy message | Three-part message structure: evidence, ask, safe language. |
| Identify conflict of interest | Definition, warning signs, and documentation steps. |

The platform should ask:

Does this information help the learner perform the required action?

If not, it should be removed, shortened, or moved to optional resources.


### 11.2.4 Action Map output

The Action Map should produce a structured record like this:


| Field | Description |
| --- | --- |
| Performance goal | What the learner should do better |
| Required action | Specific learner action |
| Practice activity | How the learner will practice |
| Minimum information | What content is needed |
| Suggested block type | Short explainer, scenario, checklist, practice, quiz, resource |
| Assessment link | How this may appear in final test or practical output |
| Safeguard note | Any safety or data caution |
| Evidence link | How this relates to evaluation/monitoring |

This record should feed directly into the Learning Design Document, Storyboard, Build Studio, final test, and practical proof setup.


## 11.3 Learning Design Document

The Learning Design Document is the course blueprint. It turns the Analysis record and Action Map into a structured plan that can guide Storyboard and Build.

It should be practical, lean, and implementation-ready. It should not become a long academic design report.

The Learning Design Document answers:

What learning experience will help the target learners perform the required actions better?


### 11.3.1 Required Learning Design Document fields

The document should include:


| Field | Purpose |
| --- | --- |
| Course working title | Identifies the planned learning product |
| Linked Analysis Handover ID | Preserves traceability |
| Target learner group | Defines who the course is for |
| Capacity area and sub-capacity | Links to CSO capacity framework |
| Indicator or standard | Connects to capacity evidence |
| Baseline/current practice | Keeps the original gap visible |
| Desired practice | Shows intended improvement |
| Performance goal | Defines what learners should be able to do |
| K/S route | Knowledge, Skill, or Mixed Knowledge/Skill |
| Course type | Micro-course, short course, guided practice, scenario-based course |
| Learning pathway | Sequence of learning experience |
| Required actions | Actions from Action Map |
| Practice activities | How learners will practice |
| Minimum information | Essential content only |
| Assessment approach | Final test and any practical task/proof |
| Final test intent | What the final test should verify |
| Practical proof possibility | Whether an optional proof pathway is relevant |
| Accessibility / low-bandwidth needs | Mobile-first, text alternatives, file size, offline support |
| Localization needs | Language and cultural adaptation considerations |
| Safeguarding / civic-space constraints | No-harm and data safety considerations |
| AI authoring boundaries | What AI may and may not help generate |
| Evaluation anchor | Link back to monitoring/evidence logic |


### 11.3.2 Learning pathway

The Learning Design Document should define the learning pathway.

A simple pathway may be:

- Context hook.
- Short explanation.
- Worked example.
- Guided practice.
- Knowledge check.
- Final test.
- Optional practical proof.
For a skill-focused course, the pathway may be:

- Realistic CSO challenge.
- Demonstration or worked example.
- Practice with feedback.
- Scenario decision.
- Template completion.
- Final test.
- Practical proof submission option.
The pathway should match the K/S route.


| K/S route | Recommended pathway |
| --- | --- |
| Knowledge | Short explainer, checklist, reference aid, knowledge check, final test |
| Skill | Worked example, guided practice, scenario, template task, final test, optional proof |
| Mixed Knowledge/Skill | Concise explanation plus practice and applied task |

Motivation and Environment should not drive Phase 1 course design unless a separable Knowledge/Skill component is recorded in Analysis.


### 11.3.3 Assessment approach

The Learning Design Document should define how learning will be checked.

Every course should have a final test, and the binding rule is:

80%+ final test score = course pass and automated course certificate.

The assessment approach should specify:

- what the final test should assess;
- what question types may be used;
- which required actions or minimum information should be tested;
- whether scenario-based questions are needed;
- whether a practical output/proof pathway is useful;
- how the certificate differs from verified achievement.
The certificate is based on final test score. Practical proof is separate and optional/additional where relevant.


### 11.3.4 Accessibility and localization design

The Learning Design Document should define accessibility and localization needs before Build.

It should consider:

- mobile-first design;
- low-bandwidth constraints;
- short text blocks;
- plain language;
- translation readiness;
- alt text requirements;
- transcript/caption needs;
- printable or downloadable resources;
- offline support where useful;
- examples that fit Ethiopian/local CSO realities.
This prevents accessibility from becoming an afterthought in Build or Review.


### 11.3.5 AI authoring context

The Learning Design Document should also define the AI context package.

This means the platform should later pass approved design context to the AI assistant, such as:

- course title;
- learner group;
- capacity area;
- performance goal;
- required action;
- minimum information;
- tone;
- local CSO context;
- safeguards;
- “do not invent” restrictions.
AI should not generate course content from a blank prompt.


## 11.4 Storyboard and Block Plan

The Storyboard and Block Plan translates the Learning Design Document into a block-by-block learner journey.

It is the direct bridge to the Build Studio.

The Storyboard should not yet be the final course content. It should define the intended sequence, block purpose, learner action, and build requirements.


### 11.4.1 Storyboard purpose

The Storyboard answers:

What will the learner experience from the first screen to the final test and optional practical proof?

It should help the creator plan:

- lesson structure;
- block sequence;
- learner instructions;
- practice activities;
- feedback points;
- resources;
- final test preparation;
- accessibility requirements;
- safeguarding notes;
- practical proof instructions where relevant.
The Storyboard prevents the Build Phase from becoming improvised.


### 11.4.2 Required Storyboard fields

For each lesson or block, the Storyboard should capture:


| Field | Purpose |
| --- | --- |
| Lesson title | Identifies the section |
| Block title | Identifies the block |
| Block type | Explainer, scenario, practice, quiz, resource, etc. |
| Block purpose | Why this block exists |
| Linked required action | Traceability to Action Map |
| Key message or prompt | Main learner-facing idea |
| Learner action | What learner does in this block |
| Interaction type | Read, choose, match, write, upload, reflect, download |
| Feedback need | Whether learner receives feedback |
| Resource need | Template, checklist, job aid, worksheet |
| Assessment link | Final test or practical proof connection |
| Accessibility note | Alt text, transcript, low-bandwidth alternative |
| Safeguarding/data note | Any safety instruction |
| AI drafting note | Whether AI may help draft this block |


### 11.4.3 Block plan

The block plan should identify required blocks that will later appear in Build.

Recommended block types include:

- lesson intro;
- context hook;
- short explainer;
- key concept;
- worked example;
- checklist;
- scenario decision;
- guided practice;
- template completion;
- reflection prompt;
- knowledge check;
- resource download;
- final test preparation;
- final test;
- practical proof instruction;
- safety note;
- accessibility/localization block.
Each block should be linked to a design purpose.

For example:


| Block | Purpose | Linked action |
| --- | --- | --- |
| Context hook | Show why the problem matters | Performance goal |
| Short explainer | Provide essential concept | Minimum information |
| Worked example | Show good practice | Required Action 1 |
| Guided practice | Let learner apply method | Required Action 2 |
| Scenario | Practice judgment | Required Action 3 |
| Knowledge check | Prepare for final test | Assessment |
| Resource download | Support real work | Practical output |
| Final test | Check course learning | Certificate |
| Proof instruction | Explain optional applied evidence | Verified achievement |


### 11.4.4 Storyboard quality check

Before Build opens, the Storyboard should pass a simple quality check.


| Quality question | Expected answer |
| --- | --- |
| Does every block have a purpose? | Yes |
| Does every major block link to the Action Map? | Yes |
| Is the course sequence logical? | Yes |
| Are practice activities included where needed? | Yes |
| Is unnecessary theory avoided? | Yes |
| Is the final test prepared for? | Yes |
| Are accessibility and low-bandwidth needs considered? | Yes |
| Are safeguarding/data risks addressed? | Yes |
| Is AI context clear enough for safe drafting? | Yes |
| Is the course ready for Build? | Yes |


## 11.5 Scenario and Practice Activity Planner

The Scenario and Practice Activity Planner is used when the course requires practice, judgment, decision-making, or application.

Not every course needs a complex scenario. But skill-focused courses should include realistic practice, because learners need to do more than read.

This is especially important for courses on:

- safeguarding;
- accountability;
- community feedback;
- advocacy;
- MEAL;
- governance;
- financial management;
- partnerships;
- data protection;
- civic-space-sensitive work.

### 11.5.1 Purpose of scenarios and practice

Scenarios and practice activities help learners rehearse real decisions in a safe learning environment.

They should reflect local CSO realities, such as:

- limited internet access;
- donor reporting pressure;
- staff workload;
- community expectations;
- local authority pressure;
- sensitive beneficiary information;
- safeguarding concerns;
- limited budget;
- internal governance challenges;
- partnership power imbalance;
- low data quality;
- civic-space sensitivity.
The goal is not entertainment. The goal is practical readiness.


### 11.5.2 Scenario structure

The recommended scenario structure is:


| Element | Purpose |
| --- | --- |
| Challenge | The realistic CSO situation or dilemma |
| Learner role | Who the learner is in the scenario |
| Choices | Plausible options the learner may choose |
| Consequences | Realistic outcomes of each choice |
| Feedback | What the learner should understand |
| Reflection | How the scenario connects to real CSO work |
| Action link | Which required action this scenario practices |
| Safety note | Any safeguarding/data/civic-space caution |

Scenario choices should not be too obvious. They should reflect realistic pressures.

Weak choice design:

- Correct answer.
- Clearly wrong answer.
- Silly answer.
Better choice design:

- Fast but risky option.
- Safe but incomplete option.
- Best-fit option.
- Option requiring escalation or consultation.

### 11.5.3 Practice activity types

Practice activities can include:


| Activity type | Example |
| --- | --- |
| Categorization | Sort feedback entries into complaint, suggestion, protection concern, or quality issue |
| Template completion | Complete part of a budget justification or outcome evidence worksheet |
| Revision | Improve a weak advocacy message or report paragraph |
| Sequencing | Arrange steps in a referral pathway or reporting process |
| Matching | Match indicators to evidence sources |
| Scenario decision | Choose the safest response in a sensitive situation |
| Checklist application | Apply a governance or safeguarding checklist |
| Short written output | Draft one evidence statement, action step, or message |
| Reflection/action commitment | Identify one step the learner will apply in their CSO |

The practice should be directly linked to the required actions in the Action Map.


### 11.5.4 Safeguarding and data safety in scenarios

Scenario planning should identify risks early.

For example, scenarios should avoid:

- real beneficiary names;
- exact locations that create risk;
- active protection or safeguarding cases;
- politically sensitive details;
- unsafe legal advice;
- instructions that encourage risky advocacy behavior;
- asking learners to disclose real sensitive information.
Where sensitive learning is necessary, the scenario should use fictionalized or anonymized examples.

The platform should allow the creator to add a safeguard note to the scenario plan.


### 11.5.5 Practice-to-proof connection

Some practice activities may later connect to optional practical proof or verified achievement.

For example:


| Course practice | Optional practical proof |
| --- | --- |
| Complete a sample outcome evidence worksheet | Submit an anonymized outcome evidence worksheet from own CSO |
| Categorize sample feedback entries | Submit a redacted feedback categorization log |
| Draft a sample advocacy message | Submit a safe evidence-based message draft |
| Complete a budget justification practice | Submit a donor budget justification draft |
| Apply safeguarding referral steps in scenario | Submit an anonymized referral pathway checklist |

This connection should be planned in Design but implemented in Build and Review.


## 11.6 Design-to-Build Handover

The Design-to-Build Handover is the final output of the Design Phase. It confirms that the course is ready to enter Build.

It is the formal record that gives the Build Studio its approved context.

Build should not open until this handover is complete and approved.

The detailed Design Phase specification states that the final output of Design is a Design-to-Build Handover consolidating the approved analysis reference, performance goal, action map, blueprint, storyboard, scenario/practice notes, assessment and action commitment, accessibility/localization requirements, safeguarding constraints, AI authoring context, evaluation anchor, and reviewer approval status.


### 11.6.1 Purpose of the handover

The Design-to-Build Handover ensures that Build begins from a controlled design package.

It prevents the Build Studio from becoming:

- a blank page;
- a place to invent new objectives;
- a loose content editor;
- a disconnected AI authoring space;
- a course production area without traceability.
It gives the Build Phase the approved course logic.


### 11.6.2 Required handover fields

The Design-to-Build Handover should include:


| Field | Description |
| --- | --- |
| Handover ID | Unique handover record |
| Linked Analysis Handover ID | Traceability to approved Analysis |
| Course working title | Planned course title |
| Target learner group | Who the course is for |
| Capacity area / sub-capacity | CSO capacity focus |
| Indicator or standard | Capacity evidence link |
| Baseline/current practice | Starting point from Analysis |
| Desired practice | Target improvement |
| Performance goal | What learner should do better |
| K/S route | Knowledge, Skill, or Mixed Knowledge/Skill |
| Capacity Action Map | Required actions, practice, minimum information |
| Learning Design Document | Course blueprint |
| Storyboard and Block Plan | Required block sequence |
| Scenario / Practice Planner | Scenario and practice logic where relevant |
| Assessment approach | Final test intent and practical task/proof logic |
| Certificate rule | 80%+ final test score = automated certificate |
| Practical proof possibility | Optional/additional recognition layer where relevant |
| Accessibility/localization requirements | Mobile, low-bandwidth, language, alt text, transcript needs |
| Safeguarding/civic-space constraints | No-harm and data safety guidance |
| AI authoring context | Approved prompt boundaries and “do not invent” rules |
| Evaluation anchor | Link to monitoring and evidence logic |
| Approval/lock status | Draft, ready, approved, returned |
| Approved/locked by and date | Accountability |


### 11.6.3 Build unlock behavior

The platform should apply clear Build unlock rules.


| Condition | Platform behavior |
| --- | --- |
| Design-to-Build Handover incomplete | Build remains locked |
| Performance goal missing or vague | Prompt revision |
| Action Map incomplete | Build remains locked |
| Storyboard / Block Plan missing | Build remains locked |
| Safeguarding constraints unresolved | Build remains locked or requires specialist review |
| Accessibility/localization requirements missing | Warn or block depending on severity |
| Handover approved/locked | Build Studio opens |
| Major change after approval | Return to Design and re-approve |

This makes the workflow deterministic for implementation.


### 11.6.4 Read-only Design reference in Build

Once the Design-to-Build Handover is approved, the Build Studio should display its summary as a read-only reference.

At minimum, Build should show:

- performance goal;
- target learner group;
- capacity area;
- required actions;
- approved block sequence;
- final test intent;
- practical proof possibility;
- safeguards;
- accessibility requirements;
- AI authoring boundaries;
- evaluation anchor.
This helps the creator build flexibly while staying aligned.


### 11.6.5 Design Phase success standard

The Design Phase is successful when:

The course has moved from an approved capacity gap into a build-ready learning design that defines what learners must do, how they will practice, what minimum information they need, how learning will be checked, what safeguards apply, and what approved block plan should guide Build.

In practical terms, the Design Phase should prevent this:

“Now let us write a course about accountability.”

And produce this:

“This course helps CSO field staff categorize community feedback safely. The design includes a performance goal, four required actions, a feedback categorization practice, a short explainer, a scenario decision, a final test, optional proof submission through an anonymized feedback log, safeguarding notes, and a Build-ready block plan.”

Section 11 has already been drafted above. I will now continue with Section 12: Build Studio: Governed Flexible Course Authoring.


## 12. Build Studio: Governed Flexible Course Authoring

The Build Studio is the course production workspace of the DEC Learning Hub Course Creator Portal. It is where the approved Design-to-Build Handover is transformed into a real learner-facing course.

The Build Studio must balance two requirements:

- Governance: the course must remain aligned with the approved Analysis and Design records.
- Flexibility: course creators must be able to add useful blocks that improve clarity, practice, accessibility, engagement, learner support, safeguarding, or assessment readiness.
The Build Studio should therefore not be a blank-canvas page builder. It should also not be a rigid locked script. It should function as a governed flexible authoring workspace.

The core principle is:

Course creators can build and improve the course using a full block library, but every required or creator-added block should remain linked to the approved course purpose, learner action, assessment logic, accessibility need, safeguarding requirement, or practical output pathway.

The Build Phase specification already defines this balance clearly: the course must remain grounded in the approved Analysis and Design records, while creators should still be able to add appropriate blocks when they improve clarity, practice, accessibility, engagement, learner support, or assessment.


### 12.0 Purpose of the Build Studio

The Build Studio exists to convert an approved learning design into a complete learner-facing course.

It should help the creator:

- open the approved Design-to-Build Handover;
- generate or prepare the course shell;
- build required blocks from the approved Storyboard;
- add additional blocks where useful;
- draft learner-facing content;
- use AI support within approved boundaries;
- configure final test items;
- apply the correct certificate rule;
- configure optional practical proof and verified achievement pathways;
- apply safeguarding and data safety requirements;
- apply accessibility, localization, and low-bandwidth requirements;
- preview the course as a learner;
- prepare the course for Review.
The Build Studio should preserve traceability from:

Analysis → Design → Storyboard → Build blocks → final test → certificate → optional practical proof → Review → Publish → Monitoring

The creator should always understand what is required, what is optional, what was added, what needs review, and what is blocking submission.


## 12.1 Left-Side Expandable Block Library

The left-side block library is the main authoring toolbox. It should give creators access to all approved block types in a structured and searchable way.

The library should be visible inside the Build Studio as a persistent left-side navigation panel.

It should support:

- expandable block categories;
- subcategories under each main category;
- block search;
- recommended blocks based on the approved Storyboard;
- required blocks from the Design-to-Build Handover;
- optional supporting blocks;
- creator-added block selection;
- visual indicators for blocks that require justification;
- drag-and-drop or “add block” behavior.
The Build Phase specification requires a full left-side block navigation panel with expandable categories, visible subcategories, search/filter, recommended blocks, required/optional/added indicators, and block-purpose tagging when blocks are added.


### 12.1.1 Block library design principle

The block library should make course creation easier without weakening governance.

The creator should be free to choose useful blocks, but the platform should ask:

Why is this block needed, and what approved course purpose does it support?

This allows the course to become richer and more learner-friendly without becoming disconnected from the approved design.

The left-side library should not encourage creators to add decorative or unrelated blocks. It should support purposeful course building.


### 12.1.2 Recommended block categories

The block library should include the following main categories.


| Category | Purpose |
| --- | --- |
| Structure & Navigation | Helps organize lessons and guide learners through the course |
| Text & Explanation | Provides essential concepts and simple explanations |
| Example & Demonstration | Shows what good practice looks like |
| Practice | Allows learners to apply a task or skill |
| Scenario | Supports decision-making, judgment, and realistic CSO dilemmas |
| Reflection & Action | Helps learners connect content to their own CSO work |
| Assessment | Checks understanding and supports final test preparation |
| Resources | Provides templates, checklists, worksheets, and job aids |
| Media | Adds lightweight visuals, audio, video, or infographics where useful |
| Accessibility & Localization | Supports translation, low-bandwidth use, transcripts, and plain-language alternatives |
| Safeguarding & Data Safety | Adds safety notes, anonymization guidance, and do-no-harm reminders |
| Practical Output & Recognition | Supports proof submission, review criteria, badge explanation, and verified achievement logic |


### 12.1.3 Suggested sub-blocks

The left-side navigation should expand each category to show sub-blocks.


| Main category | Sub-blocks |
| --- | --- |
| Structure & Navigation | Section header, lesson intro, lesson summary, divider, progress note, next-step instruction, closing block |
| Text & Explanation | Short explainer, key concept, definition, plain-language note, myth vs fact, do/don’t list, FAQ, glossary item |
| Example & Demonstration | Worked example, before/after example, annotated example, model answer, common mistake, case snapshot |
| Practice | Guided practice, template completion, checklist task, drag-and-drop, matching, sequencing, categorization, short response |
| Scenario | 3C scenario, branching choice, dilemma card, role-based decision, consequence feedback, retry loop, reflection after scenario |
| Reflection & Action | Reflection prompt, action commitment, personal plan, organizational application prompt, peer discussion prompt |
| Assessment | Knowledge check, MCQ, true/false, matching quiz, sequencing question, scenario-based question, final test, retake instruction |
| Resources | Downloadable template, checklist, job aid, worksheet, sample form, offline guide, facilitator note |
| Media | Image with alt text, compressed illustration, audio note, transcript block, short video, captioned video, infographic |
| Accessibility & Localization | Translation note, low-bandwidth alternative, transcript, text alternative, plain-language version, printable version |
| Safeguarding & Data Safety | Safety note, anonymization warning, sensitive data caution, do-no-harm reminder, referral note |
| Practical Output & Recognition | Proof submission, upload instruction, review criteria, verified achievement note, badge explanation, organization milestone note |

These categories should be treated as the platform’s default authoring taxonomy. The exact UI can evolve, but the authoring logic should remain stable.


### 12.1.4 Required, recommended, and optional blocks

The block library should visually distinguish between three types of blocks.


| Block type | Meaning |
| --- | --- |
| Required from Design | Blocks already defined in the approved Storyboard / Design-to-Build Handover |
| Recommended | Blocks suggested by the platform based on course type, K/S route, accessibility, or practice needs |
| Optional / creator-added | Blocks the creator may add to improve the learner experience |

This distinction is important because Reviewers need to know which blocks came from the approved design and which were added during Build.


### 12.1.5 Minimum Phase 1 behavior

In Phase 1, the left-side block library does not need to be overly complex. It should minimally support:

- expandable categories;
- block selection;
- required vs creator-added labeling;
- purpose tag for creator-added blocks;
- connection to the center canvas;
- visibility of missing required blocks;
- review flag for blocks missing justification.
The system can start with simple structured behavior and improve over time.


## 12.2 Center Course Canvas

The Center Course Canvas is where the creator assembles the learner-facing course.

It should show the course structure in sequence, including modules, lessons, and blocks. It should make the course flow visible and editable.

The canvas should not be only a content editor. It should be a structured learning-flow workspace.

The creator should be able to see:

- course shell;
- module or lesson sequence;
- required blocks from Storyboard;
- creator-added blocks;
- block order;
- block completion status;
- missing required blocks;
- warnings;
- learner preview access.

### 12.2.1 Purpose of the center canvas

The center canvas answers:

What will the learner actually experience, in what order, and with which interactions?

It should help the creator move from the approved Storyboard into a real course sequence.

The canvas should support:

- adding blocks from the left library;
- arranging blocks;
- editing block content;
- seeing block status;
- previewing blocks;
- identifying missing design requirements;
- checking whether the course is ready for Review.

### 12.2.2 Course shell on the canvas

The canvas should begin with the course shell, generated from the Design-to-Build Handover.

The course shell should include:


| Course shell field | Purpose |
| --- | --- |
| Course title | Learner-facing course title |
| Short description | Explains what the course helps learners do |
| Target learner group | Shows who the course is for |
| Capacity area | Links to DEC CSO capacity framework |
| Indicator or standard | Links to capacity evidence |
| Estimated duration | Helps learners plan |
| Course language | Supports localization |
| Delivery mode | Mobile-first, low-bandwidth, online, offline-supported, or blended |
| Final test requirement | Shows certificate condition |
| Practical proof pathway | Shows optional verified achievement route where relevant |

The creator may refine learner-facing wording, but should not change the underlying approved course purpose without returning to Design.


### 12.2.3 Block sequence display

The canvas should show blocks in learner order.

Each block should display:

- block title;
- block type;
- required or creator-added status;
- completion state;
- linked design purpose;
- warning or review flag;
- preview option.
Example block labels:


| Label | Meaning |
| --- | --- |
| Required from Storyboard | This block came from the approved design |
| Creator-added | Creator added this block during Build |
| Recommended | Platform suggested this block |
| Needs purpose tag | Added block is missing required governance metadata |
| Needs AI review | AI-generated content has not yet been reviewed |
| Safeguarding flag | Sensitive content needs attention |
| Accessibility flag | Missing transcript, alt text, plain-language alternative, or low-bandwidth support |


### 12.2.4 Reordering behavior

The canvas may allow creators to reorder blocks, but this should be governed.

Safe reordering may be allowed when it does not break the approved learning sequence.

The platform should warn when reordering may affect:

- required action sequence;
- scenario logic;
- final test preparation;
- safeguarding instruction;
- practical output instructions;
- accessibility support.
Example warning:

This block was planned before the practice activity in the approved Storyboard. Moving it may affect learner readiness. Please confirm or revise the Storyboard if this is a major design change.

The goal is not to prevent all changes. The goal is to make design drift visible.


### 12.2.5 Learner preview from the canvas

The center canvas should provide access to learner preview.

The creator should be able to preview:

- individual block;
- lesson;
- full course;
- mobile view;
- final test;
- practical proof submission flow, if enabled.
Preview should show the learner-facing version, not internal metadata.

The Build Phase specification says creators should preview the course exactly as a learner will experience it, including mobile view, language display, required and added blocks, final test behavior, practical output submission, verified achievement pathway, downloads, accessibility features, and completion tracking.


### 12.2.6 Minimum Phase 1 behavior

For Phase 1, the center canvas should minimally support:

- generated course shell;
- required block sequence;
- adding blocks from the block library;
- labeling required vs creator-added blocks;
- editing learner-facing content;
- showing warnings and missing required items;
- previewing learner flow;
- preparing Build-to-Review Handover.
Advanced drag-and-drop, collaboration, and rich media editing can be improved later.


## 12.3 Right-Side Properties and Governance Panel

The Right-Side Properties and Governance Panel is the quality-control layer inside the Build Studio. It shows metadata, linkages, settings, and review requirements for the selected block.

This panel is what makes flexible authoring governed.

When a creator selects a block in the center canvas, the right panel should show:

- block title;
- block type;
- block source;
- learner-facing purpose;
- linked required action;
- linked minimum information;
- linked practice activity;
- linked final test item;
- linked practical output, if relevant;
- accessibility settings;
- safeguarding/data safety notes;
- AI drafting status;
- added block justification;
- review status.

### 12.3.1 Purpose of the right-side panel

The right-side panel answers:

Why does this block exist, what approved design element does it support, and what quality requirements apply to it?

It should make the course traceable at block level.

This is important because a course may look complete but still contain unnecessary theory, unsupported AI text, risky scenarios, or blocks that do not support the performance goal.

The right panel helps prevent that.


### 12.3.2 Block metadata

Each block should carry metadata.

Recommended metadata includes:


| Metadata field | Purpose |
| --- | --- |
| Block ID | Unique identifier |
| Block title | Human-readable label |
| Block type | Explainer, scenario, practice, assessment, resource, etc. |
| Block source | Required from Design, recommended, creator-added |
| Linked required action | Connects block to Action Map |
| Linked minimum information | Shows why content is needed |
| Linked practice activity | Shows practice relevance |
| Linked assessment | Connects to final test or knowledge check |
| Linked practical output | Connects to proof pathway where relevant |
| Purpose tag | Explains why the block exists |
| Creator justification | Required for creator-added blocks |
| Accessibility note | Alt text, transcript, low-bandwidth alternative, plain-language need |
| Safeguarding note | Anonymization, no-harm, data protection, sensitive issue |
| AI status | Not AI-generated, AI draft pending review, AI reviewed, AI rejected |
| Review status | Draft, ready, flagged, approved, needs revision |

This metadata supports Review, Publish, Monitoring, and future course improvement.


### 12.3.3 AI drafting controls

The right-side panel should include AI drafting controls, but AI should be constrained by block context.

AI should receive:

- course title;
- target learner group;
- capacity area;
- performance goal;
- block type;
- block purpose;
- required learner action;
- minimum information;
- safeguarding constraints;
- tone and language guidance;
- “do not invent” rules.
AI should not generate content from a blank prompt.

Every AI-assisted block should be marked for human review before the course is submitted.


### 12.3.4 Accessibility and safeguarding settings

The right panel should make accessibility and safety visible at block level.

For media blocks, it should ask for:

- alt text;
- caption;
- transcript;
- file size awareness;
- low-bandwidth alternative.
For safeguarding or data-sensitive blocks, it should ask for:

- anonymization warning;
- no real names;
- no active safeguarding cases;
- no politically sensitive details;
- fictionalized example if needed;
- specialist review flag if needed.
This ensures that accessibility and safeguarding are not only checked at the end. They are built into the authoring workflow.


### 12.3.5 Minimum Phase 1 behavior

For Phase 1, the right-side panel should minimally support:

- block type;
- block source;
- purpose tag;
- linked design element;
- creator-added justification;
- AI review status;
- accessibility note;
- safeguarding note;
- review flag.
This is enough to preserve governance without overbuilding.


## 12.4 Required vs Creator-Added Blocks

The Build Studio must clearly distinguish between required blocks and creator-added blocks.

This distinction is central to the governed flexible authoring model.


### 12.4.1 Required blocks

Required blocks are blocks that come from the approved Storyboard and Design-to-Build Handover.

They represent the minimum course structure approved during Design.

Required blocks may include:

- context hook;
- short explainer;
- worked example;
- guided practice;
- scenario;
- knowledge check;
- final test;
- resource download;
- practical proof instruction;
- safeguarding note;
- accessibility support.
Required blocks should not be removed without reviewer or design-level attention.

If a creator wants to remove or significantly change a required block, the platform should warn that this may require returning to Design.


### 12.4.2 Creator-added blocks

Creator-added blocks are blocks the creator adds during Build because they improve the course.

They may be added to:

- clarify a concept;
- improve navigation;
- add a worked example;
- reduce learner confusion;
- support low-bandwidth learners;
- add a checklist;
- strengthen practice;
- add a safety note;
- support final test readiness;
- explain practical proof requirements.
Creator-added blocks are allowed. They are not a problem. But they must have a clear purpose.

The Build Phase specification states that additional blocks may be appropriate when they clarify difficult concepts, improve navigation, add a worked example, reduce cognitive load, support low-literacy users, add a checklist or job aid, provide low-bandwidth alternatives, improve accessibility, add safety notes, prepare learners for final test, strengthen practical output tasks, or add reflection/action commitment.


### 12.4.3 Purpose tag and justification

When a creator adds a block, the platform should ask for:

- Purpose tag
- Linked design element
- Short justification
Purpose tag options may include:


| Purpose tag | Meaning |
| --- | --- |
| Supports required action | Helps the learner perform an approved action |
| Provides minimum information | Adds essential knowledge needed for practice or final test |
| Improves practice | Adds or strengthens a learner practice activity |
| Improves assessment readiness | Helps prepare for knowledge check or final test |
| Supports accessibility | Adds transcript, plain-language version, printable version, or text alternative |
| Supports localization | Adds language or local context adaptation |
| Supports safeguarding/data safety | Adds safety note, anonymization instruction, or do-no-harm reminder |
| Improves navigation | Helps learners understand progress or next steps |
| Adds approved resource | Provides template, worksheet, checklist, job aid, or offline guide |
| Other | Requires short explanation and reviewer attention |

Example:

Block source: Creator-added

Purpose tag: Improves practice

Linked design element: Required Action 2 — Categorize community feedback

Justification: Adds a short practice before the final knowledge check.

Review status: Needs review


### 12.4.4 Soft governance, not creativity restriction

Purpose-linking should not be implemented as a heavy restriction that prevents creators from adding useful blocks.

It should be implemented as soft governance:

- allow the creator to add the block;
- ask for purpose and linkage;
- warn if missing;
- flag for review if incomplete;
- prevent submission only if required governance fields remain unresolved.
This preserves creative flexibility while protecting review quality.

The platform should communicate this clearly:

You can add blocks to improve the course. Please tell reviewers why this block is needed and which approved course purpose it supports.


### 12.4.5 Added Block Register

The platform should automatically generate an Added Block Register for Review.

The register should show:


| Field | Description |
| --- | --- |
| Added block ID | Identifier |
| Location | Lesson or section |
| Block type | Type of block added |
| Purpose tag | Why it was added |
| Linked design element | What it supports |
| Justification | Creator’s explanation |
| Review flag | Whether reviewer attention is needed |
| Decision | Keep, revise, remove, return to Design |

This register allows Reviewers to distinguish useful improvements from scope drift.


## 12.5 Scope Warnings

The Build Studio should include scope warnings to prevent the course from drifting away from the approved Analysis and Design records.

Warnings should guide creators. They should not make the platform feel punitive or overly restrictive.

The goal is:

help creators stay aligned, not stop them from improving the course.


### 12.5.1 Types of scope warnings

Recommended scope warnings include:


| Warning type | Example message |
| --- | --- |
| Missing purpose tag | “This creator-added block needs a purpose tag before Review submission.” |
| Missing design link | “This block is not linked to a required action, minimum information, practice activity, final test, or practical output.” |
| Possible new topic | “This block may introduce a topic not included in the approved Design-to-Build Handover.” |
| Course overload | “This section is becoming long. Consider shortening or moving content to optional resources.” |
| Unnecessary theory | “This explanation does not appear linked to a learner action or assessment.” |
| Assessment mismatch | “This final test item is not linked to a course block or required action.” |
| Safeguarding risk | “This block may involve sensitive information. Add a safety or anonymization note.” |
| Accessibility issue | “This media block needs alt text, captions, transcript, or a low-bandwidth alternative.” |
| Practical proof risk | “This proof instruction may ask learners to upload sensitive data. Add anonymization guidance.” |
| Design change risk | “This change affects a required block from the approved Storyboard. Consider returning to Design if major.” |


### 12.5.2 Warning severity

Warnings should have severity levels.


| Severity | Meaning | Behavior |
| --- | --- | --- |
| Info | Helpful suggestion | Does not block |
| Warning | Needs attention before Review | Flag visible |
| Required fix | Must be resolved before Review submission | Blocks submission |
| Specialist review needed | Sensitive issue requires reviewer check | Blocks Publish until reviewed |

For example:

- Missing alt text may be a warning.
- Final test missing may be a required fix.
- Proof upload asking for real beneficiary names may require specialist review.

### 12.5.3 Scope warnings and Review

Scope warnings should flow into the Build-to-Review Handover.

Reviewers should see:

- unresolved warnings;
- creator-added blocks;
- scope concerns;
- safeguarding flags;
- accessibility flags;
- AI review gaps;
- final test issues;
- practical proof risks.
This prevents Review from starting blindly.


### 12.5.4 Correct relationship between warnings and flexibility

The platform should not use warnings to remove creator agency.

Instead, warnings should support the creator by making quality expectations visible.

For example:

Bad implementation:

Creator cannot add a block unless the system accepts it.

Better implementation:

Creator can add a block, but the system asks for purpose, linkage, and justification. If these are missing, the block is flagged before Review.

This allows human judgment while preserving governance.


### 12.5.5 Minimum Phase 1 behavior

For Phase 1, scope warnings should minimally cover:

- creator-added block missing purpose tag;
- creator-added block missing design linkage;
- required block missing;
- final test missing;
- AI-generated content not reviewed;
- proof submission missing safety note;
- media missing accessibility support;
- course trying to proceed without Build readiness.
This level is sufficient for a practical first implementation.


### 12.6 Build Studio Success Standard

The Build Studio is successful when:

A course creator can build a complete learner-facing course from an approved Design-to-Build Handover, use the full block library, add useful blocks with purpose and justification, use AI within safe boundaries, configure the final test and optional practical proof pathway, preview the course as a learner, and submit a traceable Build-to-Review Handover without turning the platform into an unrestricted blank-canvas builder.

In practical terms, the Build Studio should prevent this:

“I added several interesting lessons and videos because they seemed useful.”

And guide the creator toward this:

“I added one worked example to support Required Action 2, one safety note before the proof upload block, and one printable checklist for low-bandwidth learners. All added blocks are purpose-tagged and ready for Review.”


## 13. AI-Assisted Authoring and Human Review

AI-assisted authoring is a support layer inside the DEC Learning Hub Course Creator Portal. It should help course creators draft, simplify, adapt, and refine course content more efficiently, but it must not replace the approved Analysis, Design, Build, Review, or Publish workflow.

AI should be treated as a guided production assistant, not as the course designer, reviewer, or publisher.

The core rule is:

AI may help draft and improve learner-facing content, but it must work within the approved Analysis and Design context, and all AI-assisted outputs must be reviewed by a human before they become part of a published course.

This is especially important because the DEC Learning Hub serves local CSOs in Ethiopia within a capacity-strengthening program context. Courses may involve sensitive issues such as civic space, safeguarding, community feedback, advocacy, financial accountability, donor compliance, data protection, and organizational vulnerabilities. AI must therefore be used carefully, transparently, and with human judgment.


### 13.1 Purpose of AI-Assisted Authoring

AI-assisted authoring should help course creators produce better content faster, especially when they are working from approved course designs.

AI can support:

- converting approved design notes into clear learner-facing content;
- simplifying technical or donor-heavy language;
- drafting short explanations;
- generating fictionalized examples;
- drafting feedback for practice activities;
- preparing quiz and final test draft items;
- suggesting low-bandwidth alternatives;
- improving accessibility and plain-language quality;
- supporting localization or translation drafts;
- creating scenario wording based on approved scenario logic;
- adapting examples to local CSO realities.
AI should help creators move from:

“I have an approved storyboard and action map, but I need help drafting learner-friendly content.”

to:

“I have clear, concise, reviewed course content that supports the approved learner action.”

AI should not move the creator from:

“I have no approved analysis or design.”

to:

“AI created a course for me.”

That would break the governance logic of the platform.


### 13.2 Where AI Appears in the Workflow

AI should appear mainly in the Build Studio, after the Analysis and Design gates are complete.

AI may also support limited tasks in earlier phases, but with strict boundaries.


| Workflow phase | Appropriate AI support | Boundary |
| --- | --- | --- |
| Analysis | Summarize or clarify entered evidence; help rewrite a capacity gap statement | AI must not invent evidence, baseline, diagnosis, or course-fit decision |
| Design | Help refine wording of performance goals or actions | AI must not create new objectives or change approved Analysis |
| Storyboard | Suggest clearer block wording or learner prompts | AI must stay within approved Action Map and Storyboard logic |
| Build | Draft learner-facing content, examples, feedback, test questions, accessibility alternatives | Human review required before use |
| Review | Summarize reviewer comments or suggest revision options | AI cannot approve or reject a course |
| Publish | Help draft catalog description | AI cannot publish |
| Monitoring | Summarize feedback trends | AI cannot make unverified claims about impact |

The safest primary implementation is to place AI controls inside the Build Studio, where each AI request is tied to a specific block and approved context.


### 13.3 AI Must Use Approved Context

AI should not operate from a blank prompt. The platform should inject or display approved course context when AI is used.

The AI context package should include:


| Context field | Purpose |
| --- | --- |
| Course title | Keeps output course-specific |
| Target learner group | Adapts language and examples |
| CSO capacity area | Keeps content linked to framework |
| Sub-capacity / indicator | Keeps output focused on capacity evidence |
| Performance goal | Keeps content action-oriented |
| Required action | Links draft to Action Map |
| Block type | Tells AI whether to draft explainer, practice, scenario, feedback, quiz, etc. |
| Minimum information | Prevents unnecessary theory |
| Safeguards/no-harm note | Prevents unsafe content |
| Accessibility / low-bandwidth requirement | Keeps output practical for local learners |
| Localization notes | Helps adapt language and examples |
| AI restrictions | Prevents invented content, donor rules, legal advice, unsafe examples |

The platform should make clear that AI output is only a draft. The creator remains responsible for checking accuracy, relevance, safety, and alignment.


### 13.4 Approved Uses of AI

AI may be used for tasks that support the approved course design.

Approved AI uses include:


| AI task | Example |
| --- | --- |
| Draft short explainer | Turn approved minimum information into a simple learner-facing explanation |
| Simplify language | Convert technical donor language into plain language |
| Create fictionalized example | Draft a fictional CSO case based on approved scenario context |
| Draft worked example | Show how to complete part of a template or decision process |
| Draft feedback message | Explain why an answer is correct, incomplete, or risky |
| Draft scenario wording | Turn approved Challenge–Choice–Consequence notes into learner-friendly text |
| Draft quiz questions | Generate MCQ, true/false, matching, sequencing, or scenario-based items from approved content |
| Suggest accessibility support | Create plain-language version, transcript draft, alt text draft, or low-bandwidth alternative |
| Support localization | Suggest wording that is easier to translate or adapt |
| Draft learner instructions | Clarify what learners should do in a practice or proof submission block |
| Draft catalog description | Prepare a short course summary after review approval |
| Summarize feedback | Summarize learner feedback trends for course improvement |

AI should be especially useful for helping non-technical course creators produce content that is short, clear, practical, and learner-friendly.


### 13.5 Prohibited Uses of AI

AI must not be used to make core course decisions or introduce unsupported content.

AI must not:

- invent new course objectives;
- change the approved target learner group;
- change the approved capacity area or indicator;
- invent baseline data or evidence sources;
- create a course from an unsupported topic;
- override the K/S/M/E course-fit decision;
- add Motivation or Environment gaps into Phase 1 course production unless a separable Knowledge/Skill component was approved;
- invent donor requirements, legal rules, or compliance claims;
- provide legal advice;
- generate unsafe advocacy tactics;
- use real beneficiary or community data;
- create active safeguarding or protection cases;
- ask learners to upload sensitive or identifiable data;
- make claims that course completion proves full organizational transformation;
- approve courses;
- publish courses;
- verify practical proof;
- award badges;
- decide donor-facing visibility.
These restrictions are essential because AI can produce confident but inaccurate or unsafe content. In the DEC context, inaccurate donor guidance, unsafe advocacy advice, or mishandled safeguarding examples could create real harm.


### 13.6 AI Authoring by Block Type

AI support should be block-aware. Different block types need different AI behavior.


| Block type | AI may help with | Human review focus |
| --- | --- | --- |
| Short explainer | Draft concise explanation from approved minimum information | Accuracy, simplicity, relevance |
| Key concept / definition | Explain a term in plain language | Avoid overgeneralization |
| Worked example | Create fictionalized practical example | Realism and technical accuracy |
| Scenario | Draft learner-facing scenario wording | Safety, plausibility, approved choices/consequences |
| Practice task | Draft instruction and feedback | Clarity and task realism |
| Knowledge check | Draft question and feedback | Correct answer, alignment, fairness |
| Final test item | Draft item from approved content | SME verification, no trick questions |
| Resource block | Draft checklist or template text | Practical usefulness and accuracy |
| Safeguarding note | Draft safety warning | Specialist review if sensitive |
| Accessibility block | Draft transcript, alt text, plain-language version | Accessibility and meaning preservation |
| Practical proof block | Draft submission instructions and criteria | Safety, anonymization, realistic evidence requirement |

AI should not create final test items from content that is not included in the course. Every AI-assisted assessment item should be linked to a course block, required action, or minimum information.


### 13.7 AI Drafting and Review Log

The platform should maintain an AI Drafting and Review Log for transparency and quality control.

This log does not need to be overly complex in Phase 1, but it should capture enough information for Reviewers to see where AI was used and whether human review occurred.

Recommended AI log fields:


| Field | Purpose |
| --- | --- |
| Course ID | Links AI output to course |
| Block ID | Shows where AI was used |
| AI task | Draft, simplify, translate, generate feedback, create question, summarize, etc. |
| Prompt context | Shows what approved context was used |
| AI output summary | Short summary of what AI produced |
| Human decision | Accepted, edited, rejected, escalated |
| Reviewer note | Why the output was accepted or changed |
| SME review needed | Yes/No |
| Safeguarding review needed | Yes/No |
| Final status | Draft, reviewed, approved, rejected |
| Date / user | Accountability |

The Review phase should be able to see this log.

This supports the principle:

No AI-generated content should reach publication without human review.


### 13.8 Human Review Requirements

Every AI-assisted output should be reviewed before the course is submitted for Review or publication.

The creator should check:


| Review question | Expected answer |
| --- | --- |
| Does the output follow the approved block purpose? | Yes |
| Does it stay within the approved course scope? | Yes |
| Is it accurate according to subject matter knowledge? | Yes |
| Is it practical for local CSO learners? | Yes |
| Is the language clear and simple? | Yes |
| Is it mobile-friendly and not too long? | Yes |
| Does it avoid unsupported donor, legal, or compliance claims? | Yes |
| Does it avoid real sensitive data or identifiable cases? | Yes |
| Does it respect safeguarding and civic-space restrictions? | Yes |
| Does it avoid adding new topics or objectives? | Yes |

Where content is sensitive, human review should include a specialist reviewer, such as:

- safeguarding reviewer;
- civic-space reviewer;
- DEC capacity lead;
- subject matter expert;
- accessibility/localization reviewer.

### 13.9 AI and Safeguarding / Civic-Space Sensitivity

AI-assisted authoring must be especially careful where content involves:

- safeguarding;
- GBV or protection;
- child protection;
- advocacy;
- civic-space restrictions;
- community feedback or complaints;
- beneficiary data;
- whistleblowing;
- local authority relationships;
- conflict-sensitive programming;
- politically sensitive scenarios;
- donor compliance;
- legal or regulatory issues.
In these cases, AI may help draft neutral, fictionalized, and safe wording, but it must not provide risky advice or generate sensitive real-world details.

For example, AI may draft:

“A fictional CSO field officer receives a sensitive complaint and must decide which safe referral step to take.”

AI must not draft:

“Here is how to investigate an active safeguarding allegation yourself.”

AI must not ask learners to upload identifiable safeguarding records or politically sensitive evidence.

Where risk is present, the platform should require a safeguarding/civic-space review flag before Review or Publish.


### 13.10 AI and Localization

AI may support localization or translation, but AI translation should not be treated as final without human review.

The platform should support AI-assisted localization for:

- simplifying English text before translation;
- drafting Amharic or local-language equivalents where enabled;
- identifying difficult terms;
- suggesting culturally appropriate examples;
- making content easier for lower-bandwidth and mobile learners.
Human review is required to ensure:

- technical meaning is preserved;
- local language is understandable;
- terms are not stigmatizing or harmful;
- safeguarding messages remain accurate;
- civic-space language is not risky;
- examples make sense in Ethiopian/local CSO context.
AI can make content more accessible, but human judgment is needed for local meaning.


### 13.11 AI and Final Test Items

AI may help draft final test items, but the platform must preserve assessment quality.

Final test questions should:

- test only content taught in the course;
- connect to required actions or minimum information;
- use clear language;
- avoid trick questions;
- have one correct or clearly best-fit answer;
- use plausible but fair distractors;
- include helpful feedback;
- be verified by a human.
AI-generated final test questions should be reviewed by a subject matter expert or course creator before approval.

The binding certificate rule remains:

80%+ final test score = course pass and automated certificate.

AI should not change the certificate rule, scoring rule, or course completion logic.


### 13.12 AI and Practical Proof / Verified Achievement

AI may help draft practical proof instructions, examples, or review criteria, but it must not verify proof or award badges.

AI may support:

- drafting proof submission instructions;
- creating an example of acceptable proof;
- suggesting anonymization wording;
- drafting review criteria;
- simplifying badge descriptions.
AI must not:

- decide whether submitted proof is valid;
- award a verified achievement;
- expose raw proof to unauthorized users;
- create donor-facing summaries without human review and consent;
- ask learners to upload sensitive raw documents.
Verified achievements and badges must be awarded only after human or authorized reviewer validation.


### 13.13 AI Transparency

The platform should decide whether AI use is disclosed internally only or also to learners.

At minimum, the platform should keep an internal AI use record.

Suggested internal note:

AI assistance was used to draft or refine selected course content. All AI-assisted content was reviewed by a human course creator or reviewer before inclusion.

Optional learner-facing note:

Some course content may have been drafted with AI support and reviewed by DEC course creators for accuracy, relevance, and safety.

The decision about learner-facing disclosure may depend on DEC policy, donor requirements, and platform governance.


### 13.14 Implementation Intent for Codex

For implementation, AI support should be treated as a controlled feature inside the workflow, not as an open chat box that can generate arbitrary course content.

Codex should implement or align AI behavior around these principles:

- AI is attached to course/block context.
- AI uses approved Analysis and Design data where available.
- AI output is saved as draft content.
- Human user must accept, edit, reject, or escalate the output.
- AI-assisted content has a review status.
- Sensitive AI outputs can be flagged.
- AI cannot approve, publish, certify, verify proof, or award badges.
- AI use should be visible in the Build-to-Review Handover.
Minimum Phase 1 AI behavior may be simple. The priority is not sophisticated AI generation. The priority is safe, traceable, human-reviewed AI assistance.


### 13.15 Minimum Phase 1 Requirements

For Phase 1, AI-assisted authoring should minimally support:

- AI drafting from block context, not blank course generation.
- Human review status for AI-assisted content.
- Clear allowed and prohibited AI use rules.
- AI output linked to a specific block.
- AI-generated final test items require human verification.
- AI-generated safeguarding, civic-space, or proof submission content requires review.
- AI use summary appears in Review or Build-to-Review Handover.
- AI cannot modify course gates, certificate logic, publication status, or verified achievement decisions.
Advanced AI features, such as automatic translation workflows, media generation, adaptive tutoring, or automated course redesign, should be considered future enhancements.


### 13.16 Success Standard for AI-Assisted Authoring

AI-assisted authoring is successful when:

Course creators can use AI to produce clearer, more practical, more accessible course content faster, while the platform preserves human judgment, approved design boundaries, safeguarding, local relevance, and review accountability.

In practical terms, the platform should prevent this:

“AI created a full course on governance and published it.”

And support this:

“AI helped draft a short explainer and fictionalized scenario for an approved governance course block. The creator reviewed and edited the output, linked it to Required Action 2, added a safeguarding note, and submitted it for Review.”


## 14. Final Test and Certificate Rule

The Final Test and Certificate Rule defines how learners complete a DEC Learning Hub course and when they receive an automated course certificate.

Every published course should include a final test unless DEC explicitly marks a course as non-certifying or informational. For the core Phase 1 course model, the final test is the standard mechanism for confirming that the learner has completed the course and met the required learning threshold.

The binding Phase 1 rule is:

A final test score of 80% or above = course pass and automated course certificate.

This rule must be implemented consistently across Build, Review, Publish, Learner Runtime, Certificate Registry, and Monitoring dashboards.

Practical proof, verified achievements, and badges are not required for the course certificate. They are a separate, additional recognition layer described in Section 15.


### 14.1 Purpose of the final test

The final test should confirm that learners have understood and can apply the essential knowledge, decision logic, and practical judgment taught in the course.

The final test should not be a memory test for unnecessary theory. It should be directly linked to:

- the approved performance goal;
- the required actions from the Action Map;
- the minimum information from the Learning Design Document;
- practice activities and scenarios in the course;
- safeguarding or data safety rules where relevant;
- the course’s practical capacity objective.
The test should answer:

Has the learner reached the minimum learning standard required for course completion and certificate?


### 14.2 What the final test should assess

The final test may assess:


| Assessment focus | Example |
| --- | --- |
| Essential knowledge | Identify the difference between output and outcome evidence |
| Key steps | Select the correct steps in a safeguarding referral pathway |
| Decision logic | Choose the safest response in an advocacy or data-sharing scenario |
| Application of a tool | Use a checklist or template correctly |
| Risk awareness | Recognize when information should be anonymized or escalated |
| Practical judgment | Select the best-fit action in a realistic CSO situation |

The final test should not assess:

- content not included in the course;
- broad theory not needed for the performance goal;
- obscure donor terminology unless required for the learner action;
- trick questions;
- unsupported legal interpretations;
- questions that require learners to disclose sensitive information.

### 14.3 Supported final test item types

The platform should support standard automated final test item types.

Recommended item types include:


| Item type | Best use |
| --- | --- |
| Multiple choice | Testing essential concepts, best-fit actions, decision logic |
| True/false | Testing clear cautions, rules, or simple distinctions |
| Matching | Matching terms to examples, tools to uses, indicators to evidence types |
| Sequencing | Ordering steps in a process such as referral, reporting, or feedback handling |
| Scenario-based question | Testing judgment in a realistic CSO situation |

For Phase 1, the final test should remain simple and reliable. Complex adaptive testing, open-ended automated grading, or advanced psychometrics are future enhancements, not core requirements.


### 14.4 Final test alignment rule

Every final test question should be traceable to the course design.

Each question should link to at least one of the following:

- a course block;
- required action;
- minimum information item;
- practice activity;
- scenario decision;
- safeguarding or data safety rule;
- practical output preparation step.
This prevents test questions from becoming disconnected from the course.

Example:


| Question | Linked design element |
| --- | --- |
| Which evidence source best supports this outcome statement? | Required Action 2: Identify evidence source |
| What should the field officer do first when receiving a safeguarding concern? | Safeguarding referral pathway practice |
| Which budget justification is strongest? | Practice activity: revise budget justification |
| Which feedback category applies to this example? | Required Action: categorize community feedback |


### 14.5 Certificate rule

The DEC Learning Hub Phase 1 certificate rule is:

80%+ final test score = course pass and automated course certificate.

This means:


| Final test score | Platform outcome |
| --- | --- |
| Below 80% | Learner does not pass; platform recommends review and retake where allowed |
| 80% or above | Learner passes the course and receives the automated course certificate |

The implementation must not introduce a separate 90% certificate threshold.

Any earlier wording suggesting “80% pass / 90% automated certificate” is superseded by this rule.


### 14.6 Certificate is based on final test only

The course certificate is based on final test performance only.

The learner does not need to submit practical proof to receive the course certificate.

This distinction must be clear in the platform:


| Recognition type | Basis | Required for certificate? |
| --- | --- | --- |
| Course certificate | 80%+ final test score | Yes, final test score only |
| Practical proof submission | Learner/CSO submits evidence of application | No |
| Verified achievement / badge | Practical proof is reviewed and accepted | No |

Learner-facing message:

Complete the final test. If you score 80% or above, you pass the course and receive your course certificate. Practical proof submission is optional or additional where available and may lead to a separate verified achievement or badge.


### 14.7 Certificate should not overclaim applied capacity

The certificate confirms that the learner completed the course and passed the final test.

It should not claim that:

- the learner has fully applied the skill in their organization;
- the CSO has achieved organizational transformation;
- DEC has verified field-level application;
- the organization meets all donor requirements in that capacity area.
Those stronger claims belong only to the practical proof / verified achievement layer, and even then only within the specific verified indicator or standard.

Recommended certificate meaning:

The learner completed the course and achieved the required final test score.

Not recommended:

This CSO is fully competent in MEAL.


### 14.8 Certificate information fields

The automated certificate should include essential information without overstating impact.

Recommended certificate fields:


| Field | Purpose |
| --- | --- |
| Learner name | Identifies certificate holder |
| Course title | Identifies completed course |
| DEC Learning Hub name / logo | Shows issuing platform |
| Completion date | Records when course was completed |
| Certificate ID / verification code | Supports authenticity |
| Final test pass statement | Confirms learner met the required score |
| Capacity area, optional | Shows course relevance |
| Course version, optional/internal | Supports version-based traceability |

Suggested certificate wording:

This certifies that [Learner Name] has successfully completed [Course Title] through the DEC Learning Hub and achieved the required final test score for course certification.

If a capacity area is included, wording should remain careful:

This course contributes to learning in [Capacity Area].

Avoid wording such as:

Certified as fully competent in [Capacity Area].


### 14.9 Retake logic

The platform should support retake logic where DEC enables it.

Retake settings may include:

- retakes allowed or not;
- number of attempts;
- waiting period between attempts;
- highest score kept or latest score kept;
- feedback shown after attempt;
- recommended review before retake.
Retakes should support learning, not only score improvement.

Suggested learner messages:


| Result | Message |
| --- | --- |
| Below 80% | You have not yet passed the final test. Review the course and try again if retakes are available. |
| 80%+ | Congratulations. You have passed the course and your certificate is available. |

If retakes are allowed after passing, DEC may decide whether learners can retake to improve score, but this should not affect the basic rule: 80%+ is sufficient for certificate.


### 14.10 Final test and certificate review

Before publication, reviewers should confirm:


| Review question | Expected answer |
| --- | --- |
| Is the final test included? | Yes |
| Are all questions linked to course content or required actions? | Yes |
| Are correct answers verified? | Yes |
| Are questions clear and fair? | Yes |
| Is the test free from unnecessary theory? | Yes |
| Are safeguarding/data questions included where relevant? | Yes |
| Is the pass/certificate threshold set at 80%+? | Yes |
| Is there no 90% certificate threshold? | Yes |
| Is practical proof clearly separate from certificate? | Yes |
| Does the certificate wording avoid overclaiming? | Yes |

A course should not publish if final test and certificate logic are unclear or incorrectly configured.


### 14.11 Platform areas affected by the certificate rule

The 80% certificate rule must be consistent across the platform.


| Platform area | Expected behavior |
| --- | --- |
| Build Studio | Creator configures final test; certificate rule shown as 80%+ |
| Review | Reviewer validates final test and 80%+ certificate setting |
| Publish | Publisher confirms certificate setting before release |
| Learner runtime | Learner receives certificate after 80%+ final test score |
| Learner dashboard | Shows certificate when earned |
| Certificate registry | Records certificate issue at 80%+ |
| Monitoring dashboard | Counts certificate issued at 80%+ |
| Organization dashboard | Shows certificates earned by organization learners where enabled |
| Donor-safe summary | May show certificate counts, but not as verified applied capacity |

This rule should be treated as a product-wide invariant.


### 14.12 Minimum Phase 1 requirements

For Phase 1, the final test and certificate system should minimally support:

- Final test configuration for each certifying course.
- Automated scoring.
- Pass/certificate threshold at 80%+.
- Certificate generation at 80%+.
- Certificate record or registry.
- Learner dashboard certificate visibility.
- Review validation that the 80%+ rule is correctly configured.
- Clear separation from practical proof and verified achievements.
- Monitoring count of certificates issued.
- No 90% certificate rule.

### 14.13 Success standard for final test and certificate

The final test and certificate logic is successful when:

A learner completes a published DEC course, takes a final test aligned with the course content and required actions, and receives an automated course certificate when they score 80% or above, without being required to submit practical proof.

In practical terms, the platform should prevent this confusion:

“You passed at 80%, but you only get a certificate at 90% or after submitting proof.”

And implement this clearly:

“You scored 80% or above. You passed the course and your certificate is available. You may also submit practical proof for a separate verified achievement where available.”


## 15. Practical Proof, Verified Achievements, and Badges

The Practical Proof, Verified Achievements, and Badges layer is an additional recognition pathway beyond the course certificate.

It is designed to recognize applied CSO capacity evidence when learners or organizations submit practical proof and that proof is reviewed and accepted by DEC or an authorized verifier.

This layer is important because the DEC Learning Hub is not only about course completion. It is about supporting real CSO capacity strengthening. Certificates show that learners passed a course. Verified achievements can show that a learner or CSO submitted reviewed evidence of applying a specific capacity.

The core distinction is:

Certificate = final test score of 80% or above. 
Verified achievement / badge = practical proof reviewed and accepted.

Practical proof is not required for the certificate.


### 15.1 Purpose of practical proof

Practical proof allows learners or CSOs to demonstrate that they have applied course learning to a practical task, document, decision, process, or organizational output.

The purpose is not to create unnecessary compliance burden. The purpose is to create a credible pathway from learning to applied evidence.

Practical proof can help:

- learners apply what they learned;
- CSOs demonstrate specific capacity progress;
- DEC identify where learning is translating into practice;
- reviewers provide feedback on applied outputs;
- organizations build a portfolio of verified capacity achievements;
- donors and partners see safe, consent-based evidence of CSO capacity development.

### 15.2 Practical proof is separate from certificate

The platform must clearly distinguish between course certification and practical proof.


| Element | Course certificate | Practical proof / verified achievement |
| --- | --- | --- |
| Basis | Final test score of 80%+ | Submitted proof reviewed and accepted |
| Required for course completion? | Yes, if course is certifying | No, unless DEC defines it as part of a special learning pathway |
| Required for certificate? | Yes: final test only | No |
| Review required? | Automated scoring | Human or authorized verifier review |
| Recognition type | Course certificate | Badge, verified achievement, capacity milestone |
| Meaning | Learner passed the course | Learner/CSO demonstrated reviewed practical evidence |
| Donor visibility | Certificate summary may be shown where appropriate | Verified achievement summary may be shared only with consent and safeguards |

Learner-facing message:

Your certificate is based on your final test score. Practical proof is a separate opportunity to show applied capacity and may lead to a verified achievement or badge.


### 15.3 When practical proof should be used

Not every course needs practical proof.

Practical proof is most useful when the course supports:

- a skill-based action;
- a practical template;
- a workplace task;
- a scenario that leads to a real output;
- a CSO organizational process;
- a capacity indicator where applied evidence is meaningful.
Practical proof may be optional, recommended, or required only for a special verified achievement pathway.

Examples of courses where proof is useful:


| Course focus | Practical proof may be useful? | Why |
| --- | --- | --- |
| Outcome evidence use | Yes | Learner can submit an outcome evidence worksheet |
| Donor budget justification | Yes | Learner can submit a budget justification draft |
| Community feedback categorization | Yes | Learner can submit a redacted feedback categorization log |
| Safeguarding referral pathway | Yes, carefully | Learner can submit an anonymized or simulated referral pathway checklist |
| Basic definition of CSO accountability | Maybe not | Final test may be sufficient |
| Introduction to DEC Learning Hub | Usually no | No applied capacity proof needed |


### 15.4 Types of practical proof

Practical proof may include:


| Proof type | Example |
| --- | --- |
| Completed template | Outcome evidence worksheet, risk matrix, budget worksheet |
| Uploaded organizational document | Redacted policy, anonymized procedure, draft plan |
| Action plan | Resource mobilization action plan, advocacy follow-up plan |
| Work sample | Policy message, donor pitch, reporting paragraph |
| Reflection with proof | Short reflection plus anonymized evidence |
| Scenario-based output | Written decision response to a realistic CSO case |
| Peer-reviewed output | Output reviewed by another learner or CSO peer |
| Mentor-reviewed output | Output reviewed by trainer, mentor, or DEC advisor |
| Community/stakeholder feedback record | Anonymized summary of consultation or feedback |
| Before/after improvement evidence | Revised document showing improvement from baseline |

Practical proof should be realistic and not too burdensome. It should support learning and recognition, not create unnecessary paperwork.


### 15.5 Link to CSO capacity indicators and standards

Every verified achievement or badge should be linked to:

- CSO capacity area;
- sub-capacity or performance area;
- indicator or standard where available;
- course title;
- proof type;
- verification decision;
- date of verification;
- learner or organization record.
Example:


| Course | Proof | Verified achievement |
| --- | --- | --- |
| Using Outcome Evidence in Reporting | Completed outcome evidence worksheet | Outcome Evidence Practice Badge |
| Preparing Donor Budget Justifications | Budget justification draft | Budget Justification Readiness Achievement |
| Categorizing Community Feedback | Redacted feedback categorization log | Community Feedback Use Badge |
| Applying Safeguarding Referral Pathways | Simulated referral pathway checklist | Safeguarding Referral Practice Recognition |
| Drafting Evidence-Based Advocacy Messages | Safe advocacy message draft | Evidence-Based Advocacy Badge |

This linkage is what makes verified achievements more meaningful than generic badges.


### 15.6 Proof submission workflow

A practical proof workflow should follow a clear sequence.

- Learner completes the course.
- Learner receives certificate if final test score is 80%+.
- Learner sees optional or required proof opportunity where enabled.
- Platform explains what proof is acceptable.
- Platform displays safety and anonymization guidance.
- Learner submits proof.
- Submission status becomes “Submitted” or “Under review.”
- Authorized verifier reviews proof using criteria/rubric.
- Verifier accepts, requests revision, rejects, or escalates.
- If accepted, platform issues verified achievement/badge.
- Achievement may appear on learner and/or organization profile according to visibility rules.
- Safe summary may be used for monitoring and reporting.
This workflow should be separate from course certificate issuance.


### 15.7 Review criteria / rubric

The proof review should be simple and practical.

Recommended criteria:


| Criterion | Review question |
| --- | --- |
| Task match | Does the submission match the required proof task? |
| Capacity link | Does it relate to the course capacity objective? |
| Action evidence | Does it show the learner/CSO attempted the required action? |
| Completeness | Is it complete enough to review? |
| Practical relevance | Is it realistic for the CSO context? |
| Indicator link | Can it be linked to the relevant capacity indicator or standard? |
| Safety | Does it avoid sensitive or unsafe data? |
| Quality | Does it meet the minimum standard for verification? |

Review decisions:


| Decision | Meaning |
| --- | --- |
| Accepted | Proof meets criteria; verified achievement/badge can be awarded |
| Accepted with note | Proof is sufficient but reviewer provides improvement note |
| Revision requested | Learner/CSO should revise, complete, or redact |
| Rejected | Proof does not meet criteria |
| Unsafe / remove or redact | Submission contains sensitive data and must be removed or corrected |
| Escalate | Specialist reviewer needed |


### 15.8 Verified achievements and badges

A verified achievement or badge should represent a specific applied capacity recognition.

It should not be vague.

Weak badge:

MEAL Badge

Stronger badge:

Outcome Evidence Practice Badge

Weak badge:

Advocacy Badge

Stronger badge:

Evidence-Based Advocacy Message Badge

A verified achievement record should include:


| Field | Purpose |
| --- | --- |
| Achievement title | Clear recognition name |
| Description | What the learner/CSO demonstrated |
| Linked course | Course connected to the achievement |
| Capacity area | CSO capacity domain |
| Indicator / standard | Capacity evidence link |
| Proof type | What was submitted |
| Awarded to | Learner, organization, or both |
| Reviewer/verifier | Who accepted the proof |
| Verification date | When it was verified |
| Visibility setting | Private, organization-visible, donor-safe summary, public if approved |
| Renewal/expiry, optional | Whether achievement should be renewed later |

The badge should be meaningful but not exaggerated.

Recommended wording:

Awarded for submitting reviewed practical evidence of applying outcome evidence in CSO reporting.

Avoid wording such as:

Certified as fully competent in all MEAL functions.


### 15.9 Organization-level recognition

Some verified achievements may contribute to an organization-level capacity evidence profile.

For example, if several staff from one CSO complete relevant courses and submit accepted practical proof, the organization may build evidence under a capacity area such as:

- MEAL;
- governance;
- safeguarding;
- financial management;
- advocacy;
- accountability;
- partnerships.
Organization-level recognition should be careful and evidence-based.

It may show:

- number of certificates earned by staff;
- verified achievements earned;
- capacity areas covered;
- indicator-linked proof accepted;
- date of verification;
- safe summary of achievement.
It should not claim full organizational transformation from one course or one proof submission.


### 15.10 Donor-facing visibility

Verified achievements may be useful for donor confidence, but donor-facing visibility must be carefully controlled.

Rules:

- raw proof is private by default;
- donor-facing visibility should be opt-in or consent-based;
- organization should control what is externally visible;
- sensitive documents should not be exposed;
- personal, beneficiary, safeguarding, or political data must not be shared;
- donor-facing view should show safe summaries only;
- verified achievements should not become surveillance or ranking tools.
A donor-facing summary may include:


| Field | Safe to show if consented |
| --- | --- |
| CSO name | Yes, if organization agrees |
| Capacity area | Yes |
| Verified achievement title | Yes |
| Indicator or standard | Yes |
| Verification date | Yes |
| Recognition status | Yes |
| Raw submitted proof | No by default |
| Reviewer private notes | No |
| Sensitive details | No |

Suggested donor-safe wording:

This CSO has received a verified achievement in Outcome Evidence Practice based on reviewed practical proof submitted through the DEC Learning Hub.


### 15.11 Data safety and proof submission

Proof submission must include strong data safety guidance.

Learners and CSOs should be told not to upload:

- real beneficiary names;
- phone numbers;
- addresses;
- case details;
- active safeguarding or protection cases;
- politically sensitive information;
- confidential donor documents;
- internal documents not approved for sharing;
- unredacted community feedback containing identifying details.
Standard learner safety note:

Do not upload real names, phone numbers, addresses, beneficiary details, politically sensitive information, or active safeguarding/protection cases. Use anonymized, redacted, or fictionalized examples unless your organization has approved the document for sharing.

Where sensitive proof is expected, the platform should support:

- anonymization guidance;
- redaction guidance;
- fictionalized sample submission;
- specialist review flag;
- unsafe submission removal or revision request.

### 15.12 Relationship to Monitoring and Evaluation

Practical proof and verified achievements should feed into Monitoring and Evaluation.

The platform should track:

- proof submission status;
- review status;
- accepted/rejected/revision decisions;
- verified achievements awarded;
- badges awarded;
- capacity areas linked to proof;
- organization-level achievement summaries;
- course-level proof trends;
- safety issues or common proof weaknesses.
This helps DEC understand whether courses are supporting applied capacity, not only completion.

However, monitoring should maintain the distinction:


| Evidence | Meaning |
| --- | --- |
| Certificate | Learner passed the final test |
| Proof submitted | Learner/CSO attempted to apply learning |
| Verified achievement | Proof was reviewed and accepted |
| Organization evidence | Aggregated verified achievements suggest progress in specific capacity areas |

This protects DEC from overclaiming impact.


### 15.13 Minimum Phase 1 requirements

For Phase 1, the practical proof and verified achievement layer should minimally support:

- Optional practical proof configuration for relevant courses.
- Clear proof submission instructions.
- Accepted proof type selection.
- Safety/anonymization guidance.
- Submission status tracking.
- Reviewer/verifier decision: accepted, revision requested, rejected, unsafe/escalated.
- Badge or verified achievement record when proof is accepted.
- Link to capacity area and indicator/standard.
- Clear separation from course certificate.
- Safe visibility settings for learner/organization/admin views.
Advanced donor-facing portals, public badge directories, automated proof scoring, and complex organizational capacity scoring should be future enhancements.


### 15.14 Success standard for practical proof and verified achievements

The practical proof and verified achievement layer is successful when:

A learner or CSO can submit safe, relevant evidence of applying course learning; an authorized reviewer can assess it using clear criteria; and the platform can award a verified achievement or badge linked to a specific CSO capacity indicator or standard—without making it a condition for the course certificate.

In practical terms, the platform should prevent this confusion:

“You need to upload proof to get your course certificate.”

And implement this clearly:

“You already received your certificate because you passed the final test. You may now submit practical proof for a separate verified achievement linked to your CSO’s capacity development.”


## 16. Review Workflow

The Review Workflow is the formal quality assurance gate between Build and Publish. It ensures that a course is not published simply because it has been built. Before learners can access a course, the course must be checked for alignment, accuracy, safety, accessibility, assessment quality, certificate logic, and publication readiness.

The Review Workflow must remain separate from the Publish Workflow. Reviewers may approve a course for publication, request revisions, or return it to an earlier phase, but the actual release of the course should be controlled through the Publish Workflow by an authorized DEC admin or publisher.

The core rule is:

A course can only move to Publish after it has passed structured Review. Review confirms quality and readiness; Publish controls release, visibility, versioning, and learner access.


### 16.1 Purpose of the Review Workflow

The Review Workflow protects DEC, learners, CSOs, communities, and the credibility of the Learning Hub.

A course may appear complete in the Build Studio but still have problems, such as:

- it drifted from the approved Analysis or Design records;
- creator-added blocks introduced unrelated theory;
- AI-generated content included unsupported claims;
- examples are too generic or not relevant to local CSOs;
- final test questions are unclear or misaligned;
- certificate logic is incorrectly configured;
- practical proof instructions ask learners to upload unsafe data;
- scenarios create safeguarding or civic-space risks;
- accessibility and low-bandwidth needs are not addressed;
- learner preview does not function properly.
The Review Workflow ensures that published courses are not only complete, but also accurate, safe, practical, accessible, and aligned with DEC’s CSO capacity-strengthening purpose.


### 16.2 Review begins from the Build-to-Review Handover

Review should begin only after the creator completes the Build-to-Review Handover.

This handover should summarize:


| Handover item | Purpose |
| --- | --- |
| Course title and version | Identifies what is being reviewed |
| Linked Analysis Handover | Shows original capacity gap and baseline |
| Linked Design-to-Build Handover | Shows approved design logic |
| Required blocks | Shows blocks from the approved storyboard |
| Creator-added blocks | Shows added blocks and justifications |
| AI use summary | Shows where AI was used and reviewed |
| Final test configuration | Shows questions, scoring, and certificate rule |
| Practical proof setup | Shows proof and verified achievement pathway, if enabled |
| Safeguarding/data safety checks | Shows risk-related notes and unresolved issues |
| Accessibility/localization checks | Shows mobile, low-bandwidth, language, and accessibility readiness |
| Learner preview record | Shows whether course was tested in learner mode |
| Reviewer attention list | Highlights areas requiring focused review |

This prevents reviewers from starting with an unclear or incomplete course.


### 16.3 Review tracks

Not every course needs every specialist review, but the system should support multiple review tracks.

Recommended review tracks are:


| Review track | Focus |
| --- | --- |
| Instructional design review | Learning flow, action alignment, block quality, workload, practice logic |
| Subject matter review | Accuracy, technical quality, CSO relevance, answer keys |
| DEC capacity alignment review | Alignment with capacity area, indicator, standard, and program objectives |
| Safeguarding / civic-space review | Sensitive scenarios, proof submission safety, advocacy risk, do-no-harm |
| Accessibility / localization review | Mobile use, low-bandwidth, readability, translation-readiness, alt text, transcripts |
| Platform/admin review | Metadata, final test setup, certificate trigger, roles, technical readiness |
| Practical proof review setup check | Rubric, proof instructions, badge logic, visibility, safety |

In early Phase 1, some roles may be combined. For example, a DEC admin may conduct platform review and publication readiness checks. However, the workflow should preserve the logical distinction between these review functions.


### 16.4 Traceability review

The first review check is traceability.

The reviewer should verify that the built course still follows the approved Analysis and Design logic.

Traceability review should check:


| Question | Expected answer |
| --- | --- |
| Does the course respond to the approved CSO capacity gap? | Yes |
| Does it match the approved target learner group? | Yes |
| Does it support the approved performance goal? | Yes |
| Does it remain linked to the correct capacity area and indicator/standard? | Yes |
| Does it stay within the approved Knowledge/Skill scope for Phase 1? | Yes |
| Does it avoid Motivation or Environment gaps as course drivers? | Yes |
| Does it preserve the safeguards/no-harm requirements? | Yes |
| Does it preserve the evaluation anchor? | Yes |

If the course has drifted significantly, it should return to Build, Design, or Analysis depending on the issue.

Examples:


| Issue found | Return path |
| --- | --- |
| Added content is too broad but design is still valid | Return to Build |
| Performance goal no longer matches course content | Return to Design |
| Capacity gap or target learner group appears wrong | Return to Analysis |
| Safeguarding risk not captured earlier | Return to Analysis or specialist review |


### 16.5 Required and creator-added block review

Because the Build Studio allows governed flexibility, reviewers must distinguish between:

- required blocks from the approved storyboard;
- recommended blocks;
- creator-added blocks.
The reviewer should check:


| Review question | Expected answer |
| --- | --- |
| Are all required blocks present? | Yes |
| Are required blocks aligned with the approved Storyboard? | Yes |
| Are creator-added blocks purpose-tagged? | Yes |
| Are creator-added blocks justified? | Yes |
| Do added blocks improve clarity, practice, accessibility, safety, navigation, assessment, or practical output? | Yes |
| Do added blocks avoid unrelated topics? | Yes |
| Do added blocks avoid making the course too long or too theoretical? | Yes |
| Are any added blocks better moved to optional resources? | Reviewer decision |

The review should not punish creators for improving courses. It should ensure that flexibility does not become scope drift.


### 16.6 Content quality review

The course content should be reviewed for clarity, relevance, accuracy, and learner usefulness.

Content quality review should check:


| Question | Expected answer |
| --- | --- |
| Is the language clear and learner-facing? | Yes |
| Is the content practical and action-oriented? | Yes |
| Does the course avoid unnecessary theory? | Yes |
| Are examples relevant to local CSO realities? | Yes |
| Does content avoid generic corporate training style? | Yes |
| Does every major content block support an action, practice, assessment, practical output, or learner support need? | Yes |
| Are templates, checklists, job aids, or examples used where helpful? | Yes |
| Is learner workload realistic? | Yes |

The course should feel useful to a busy CSO staff member, not like a long theoretical training manual.


### 16.7 AI-assisted content review

If AI was used, reviewers should examine the AI Drafting and Review Log.

The review should check:


| AI review question | Expected answer |
| --- | --- |
| Was all AI-assisted content reviewed by a human? | Yes |
| Were inaccurate, generic, unsafe, or unsupported outputs edited or rejected? | Yes |
| Did AI stay within the approved course context? | Yes |
| Did AI avoid inventing objectives, indicators, donor rules, or legal claims? | Yes |
| Did AI avoid real beneficiary or sensitive case details? | Yes |
| Did AI-generated examples remain fictionalized and context-appropriate? | Yes |
| Did AI-generated final test items link to approved course content? | Yes |
| Are any AI outputs requiring SME or safeguarding review still unresolved? | No |

No AI-generated content should be published without human review.


### 16.8 Practice and scenario review

For Skill-focused courses, scenarios and practice activities are especially important.

Reviewers should check:


| Question | Expected answer |
| --- | --- |
| Does each activity practice a real CSO task? | Yes |
| Are scenarios realistic for the target learner group? | Yes |
| Are choices plausible and not artificially obvious? | Yes |
| Do consequences explain practical effects, not only “correct/incorrect”? | Yes |
| Are templates or practice outputs clear? | Yes |
| Are instructions short enough for mobile learners? | Yes |
| Are safeguarding, data protection, or civic-space risks addressed? | Yes |
| Are practice activities connected to final test or optional practical proof where relevant? | Yes |

Practice activities should strengthen real performance, not only decorate the course.


### 16.9 Final test and certificate review

Reviewers must check that the final test is valid and that certificate logic is correct.

The binding rule is:

80%+ final test score = course pass and automated certificate.

Reviewers should check:


| Review question | Expected answer |
| --- | --- |
| Is the final test included? | Yes |
| Does the final test assess course-taught content only? | Yes |
| Does it test essential knowledge, decision logic, or practical judgment? | Yes |
| Are question types appropriate? | Yes |
| Are answer keys correct and verified? | Yes |
| Are distractors plausible but not misleading? | Yes |
| Are feedback messages helpful? | Yes |
| Is the pass/certificate threshold set at 80%+? | Yes |
| Is there no 90% certificate threshold? | Yes |
| Is practical proof clearly separate from the certificate? | Yes |
| Does certificate wording avoid overclaiming applied capacity? | Yes |

A course should not be approved if the final test is missing, misaligned, unfair, or configured with the wrong certificate threshold.


### 16.10 Practical proof and verified achievement review

Where practical proof is enabled, reviewers should check that the pathway is safe, clear, and separate from certification.

Review questions:


| Question | Expected answer |
| --- | --- |
| Is practical proof clearly optional/additional unless explicitly defined otherwise? | Yes |
| Is it clear that proof is not required for the course certificate? | Yes |
| Are accepted proof types defined? | Yes |
| Are review criteria clear? | Yes |
| Is the proof linked to a capacity area and indicator/standard? | Yes |
| Is the reviewer/verifier role clear? | Yes |
| Is the badge or verified achievement label specific and meaningful? | Yes |
| Are anonymization and data safety instructions included? | Yes |
| Are donor-facing visibility settings safe and consent-based? | Yes |

The review should ensure the learner sees a clear distinction:

Certificate is based on final test. Verified achievement is based on reviewed practical proof.


### 16.11 Safeguarding, civic-space, and data safety review

This review is mandatory for sensitive courses or proof pathways.

It should check:


| Question | Expected answer |
| --- | --- |
| Does the course avoid asking learners to disclose sensitive personal data? | Yes |
| Are real names, beneficiary details, and identifiable cases avoided? | Yes |
| Are sensitive examples fictionalized or anonymized? | Yes |
| Are proof submission instructions safe? | Yes |
| Are advocacy or civic-space scenarios framed carefully? | Yes |
| Does the course avoid unsupported legal advice? | Yes |
| Are safeguarding referral instructions accurate and safe? | Yes |
| Is specialist review completed where required? | Yes |

If the course creates safeguarding, civic-space, or data protection risk, it should not be approved until corrected.


### 16.12 Accessibility, localization, and low-bandwidth review

The reviewer should check whether the course is usable by local CSO learners.

Review questions:


| Question | Expected answer |
| --- | --- |
| Is the course mobile-friendly? | Yes |
| Are sections short and readable? | Yes |
| Is language plain and translation-ready? | Yes |
| Is jargon explained or removed? | Yes |
| Do images have alt text or text alternatives? | Yes |
| Do audio/video materials have transcripts or captions? | Yes |
| Are media and downloadable resources low-bandwidth friendly? | Yes |
| Are printable/offline resources included where helpful? | Yes |
| Are examples locally relevant and inclusive? | Yes |
| Is total learner workload realistic? | Yes |

Low-bandwidth readiness should be treated as a core quality requirement, not a later improvement.


### 16.13 Learner preview and platform functionality review

Before approval, the reviewer or platform/admin reviewer should test the course in learner mode.

Functionality review should confirm:


| Check | Expected result |
| --- | --- |
| Course opens correctly in learner view | Pass |
| Navigation works | Pass |
| Required and creator-added blocks display correctly | Pass |
| Interactions work | Pass |
| Scenario logic works, if included | Pass |
| Final test works | Pass |
| Score calculation works | Pass |
| Certificate is issued at 80%+ | Pass |
| Practical proof submission works, if enabled | Pass |
| Verified achievement workflow is configured, if enabled | Pass |
| Downloads work | Pass |
| Progress tracking works | Pass |
| Accessibility features appear correctly | Pass |

The course should not move to Publish if learner runtime behavior is broken.


### 16.14 Review decisions and routing

Review should produce a clear decision.


| Review decision | Meaning | System action |
| --- | --- | --- |
| Approved for Publish | Course is ready for publication | Unlock Publish |
| Approved with minor fixes | Course is nearly ready but needs small fixes | Keep in Review until fixes are closed or allow admin confirmation |
| Return to Build | Course needs content, block, test, accessibility, or platform fixes | Reopen Build |
| Return to Design | Course has design-level problems | Reopen Design and require Design-to-Build reapproval |
| Return to Analysis | Capacity gap, learner group, or course-fit logic is wrong | Reopen Analysis and require Analysis-to-Design reapproval |
| Specialist review required | Safeguarding, civic-space, accessibility, data, or technical issue needs expert review | Block Publish until resolved |
| Not approved | Course should not proceed in current form | Pause, archive, or return based on admin decision |

This decision routing should be visible to creators. They should know exactly what to fix and which phase is affected.


### 16.15 Returned course experience

When a course is returned, the creator should see:

- review decision;
- required fixes;
- optional suggestions;
- affected phase, lesson, block, test item, or proof setup;
- severity;
- reviewer notes;
- resubmission instructions.
Reviewer comments should be specific and actionable.

Example:


| Weak comment | Better comment |
| --- | --- |
| Improve this section | Shorten Block 4 and link it to Required Action 2. It currently adds theory not needed for the practice or final test. |
| Fix quiz | Question 6 tests content not taught in the course. Remove it or add the required content earlier. |
| Add safeguarding | Add an anonymization warning before the proof upload block. Learners should not upload beneficiary names or active protection cases. |

The returned course workflow should preserve review history.


### 16.16 Review output record

The Review Workflow should produce an Approved Course Review Record or a revision/return record.

Recommended fields:


| Field | Purpose |
| --- | --- |
| Review ID | Unique review record |
| Course ID / version | Links review to course version |
| Reviewer role | Shows who reviewed |
| Review track | Instructional, SME, safeguarding, accessibility, platform, capacity |
| Decision | Approved, returned, specialist review, not approved |
| Required revisions | Clear list of required changes |
| Optional suggestions | Improvement notes |
| Final test validation | Confirms test and 80% certificate rule |
| Practical proof validation | Confirms safe proof/badge setup where applicable |
| Safeguarding validation | Confirms safety readiness |
| Accessibility validation | Confirms learner access readiness |
| Publish recommendation | Whether Publish can open |
| Date / reviewer | Accountability |


### 16.17 Minimum Phase 1 Review requirements

For Phase 1, Review should minimally support:

- Build-to-Review Handover review.
- Course alignment check with Analysis and Design.
- Required vs creator-added block review.
- AI use review status.
- Final test validation.
- Certificate rule validation at 80%+.
- Practical proof safety check where enabled.
- Safeguarding and accessibility checks.
- Review decision: approve, return to Build, return to Design, return to Analysis, specialist review, not approved.
- Review comments visible to creator.
- Approved review record unlocks Publish.

### 16.18 Review Workflow success standard

The Review Workflow is successful when:

No course can be published until it has been checked for alignment, accuracy, learner usefulness, final test quality, correct 80% certificate logic, practical proof safety, accessibility, safeguarding, and learner runtime functionality.

In practical terms, Review should prevent this:

“The course was built, so it is published.”

And enforce this:

“The course was built, previewed, reviewed, corrected, approved, and only then moved to Publish.”


## 17. Publish Workflow and Version Control

The Publish Workflow is the controlled release process that makes an approved course available to learners. It begins only after the Review Workflow has approved the course for publication.

Publishing should remain separate from Review. A course may pass Review, but it should still require an authorized publisher or DEC admin to confirm release settings, visibility, versioning, and learner access.

The core rule is:

Review approves the course for release. Publish controls when, where, how, and to whom the approved course becomes available.


### 17.1 Purpose of the Publish Workflow

The Publish Workflow ensures that approved courses are released safely and intentionally.

It controls:

- final course metadata;
- course catalog display;
- target learner group;
- visibility and enrollment;
- language version;
- certificate setting;
- practical proof/badge setting;
- pilot or full release;
- publication date;
- version number;
- archive status;
- learner access.
This prevents accidental publication, wrong audience release, wrong course version display, or confusing learner access.


### 17.2 Publish should begin only after Review approval

Publish should remain locked until the course has an approved Review record.

Expected behavior:


| Condition | Platform behavior |
| --- | --- |
| Build completed but not reviewed | Publish locked |
| Review returned course | Publish locked |
| Specialist review unresolved | Publish locked |
| Approved for Publish | Publish unlocks for authorized publisher/admin |
| Published version requires revision | Create revision flow, not direct edit of live course |

This protects quality and traceability.


### 17.3 Authorized publisher role

Only authorized users should publish a course.

Authorized publishers may include:

- DEC Admin;
- assigned Publisher;
- platform admin with publication rights.
Course creators should not publish by default unless they also have an explicit publisher/admin role.

Publisher responsibilities include:

- confirm Review approval;
- confirm final metadata;
- select visibility and enrollment settings;
- confirm certificate rule;
- confirm practical proof/badge setting where relevant;
- confirm language version;
- confirm pilot or full release;
- create the publication record;
- lock the published version.

### 17.4 Publication metadata

Before publishing, the publisher should confirm metadata.

Recommended publication metadata:


| Field | Purpose |
| --- | --- |
| Course title | Learner-facing title |
| Short description | Catalog description |
| Target learners | Shows who course is for |
| Capacity area | Catalog and monitoring category |
| Sub-capacity / indicator | Capacity evidence linkage |
| Course level | Introductory, intermediate, advanced |
| Estimated time | Helps learner plan |
| Language version | Supports localization |
| Delivery mode | Mobile-first, low-bandwidth, online, offline-supported, blended |
| Certificate setting | Confirms 80%+ final test certificate |
| Practical proof setting | Available, not available, optional, required for badge only |
| Verified achievement/badge setting | Active or inactive |
| Safeguarding/data caution | Learner-facing note where needed |
| Accessibility notes | Transcript, offline guide, low-bandwidth support |
| Version number | Published version tracking |
| Visibility | Public catalog, restricted cohort, pilot, DEC-only, organization-specific, archived |
| Publish date | Release timing |
| Published by | Accountability |

Metadata should be concise and learner-friendly, while preserving internal traceability.


### 17.5 Visibility and enrollment settings

The publisher should choose who can access the course.

Recommended settings:


| Setting | Meaning |
| --- | --- |
| Public learner catalog | Course visible to all eligible learners |
| Restricted cohort | Course visible to selected learners or cohort |
| DEC-only | Internal or staff-only course |
| Pilot group | Course visible to a test group before full release |
| Organization-specific | Course assigned to selected CSO/organization |
| Invitation-only | Learners access through assignment or invite |
| Archived | Course not active |

This allows DEC to test courses safely before broad release.

For Phase 1, pilot release is useful for new or sensitive courses.


### 17.6 Final learner-facing preview before publish

Before publishing, the authorized publisher should complete or confirm a final learner-facing preview.

The preview should check:

- catalog card;
- course landing page;
- course description;
- enrollment or start button;
- lesson navigation;
- mobile display;
- low-bandwidth behavior where available;
- final test;
- certificate trigger at 80%+;
- practical proof submission where enabled;
- verified achievement explanation where enabled;
- accessibility supports;
- completion tracking.
This is the final check before learners see the course.


### 17.7 Publish actions

The platform should support these publish actions:


| Publish action | Meaning |
| --- | --- |
| Publish now | Course becomes available immediately |
| Schedule publish | Course becomes available on a selected date/time |
| Publish to pilot | Course available only to pilot users or cohort |
| Keep as approved draft | Course is approved but not released |
| Return to Review | Course requires final review adjustment |
| Archive | Course is removed from active publication path |

The system should record who performed the action and when.


### 17.8 Published Course Record

When a course is published, the platform should create a Published Course Record.

Recommended fields:


| Field | Purpose |
| --- | --- |
| Published Course ID | Unique published record |
| Course ID | Links to course |
| Course version ID | Links to exact version |
| Review approval ID | Links to approved review |
| Published title | Learner-facing title |
| Published version number | Version tracking |
| Published by | Accountability |
| Publish date | Release date |
| Visibility setting | Who can access |
| Enrollment setting | How learners join |
| Capacity area / indicator | Reporting and catalog linkage |
| Certificate rule | 80%+ final test certificate |
| Practical proof pathway | Enabled or disabled |
| Verified achievement pathway | Enabled or disabled |
| Language version | Localization tracking |
| Notes / conditions | Pilot notes, restrictions, special cautions |
| Status | Published, scheduled, archived, replaced |

This record supports auditability, monitoring, and version-specific reporting.


### 17.9 Version control principle

Published courses should be version-controlled.

Once a course is published, the live version should not be edited casually. Changes should happen through revision logic.

The principle is:

Published learner-facing content should be stable. Major changes should create a new version or formal revision record.

This matters because learner progress, final test results, certificates, proof submissions, verified achievements, and monitoring data must link to the version the learner actually completed.


### 17.10 Types of post-publication changes

Different changes should have different controls.


| Change type | Recommended handling |
| --- | --- |
| Typo correction | Minor update log |
| Broken link fix | Minor update log |
| Alt text or transcript fix | Minor update log; accessibility note |
| Small wording clarification | Minor update log |
| Final test question change | Review reapproval required |
| Certificate rule change | Admin-level approval; avoid unless policy changes |
| Practical proof criteria change | Review reapproval required |
| Badge/verified achievement logic change | Review/admin approval required |
| Safeguarding note change | Specialist review if sensitive |
| Capacity objective change | Return to Design or Analysis |
| Major lesson restructuring | New course version |
| New target learner group | Return to Analysis/Design |
| New indicator/standard | Return to Analysis/Design |

This protects both learners and evidence integrity.


### 17.11 Revision workflow

When a published course needs revision, the platform should create a revision flow rather than directly modifying the live version.

Suggested revision flow:

- Admin or creator creates a revision draft from published version.
- Revision draft is edited.
- Changes are reviewed based on severity.
- New version is approved.
- Publisher releases new version.
- Previous version is archived or replaced.
- Learner records remain linked to the version they completed.
This allows course improvement without corrupting historical learner evidence.


### 17.12 Archive and retire logic

Courses may need to be archived when they become outdated, unsafe, replaced, or no longer aligned with DEC priorities.

Archive reasons may include:

- outdated donor or policy guidance;
- changed safeguarding procedure;
- outdated capacity framework;
- low quality or poor learner performance;
- course replaced by newer version;
- pilot completed;
- program priority changed.
Archived courses should no longer be available for new enrollment, but past learner records and certificates should remain accessible where appropriate.


### 17.13 Relationship between Publish and Monitoring

Publishing activates Monitoring and Evaluation.

Once a course is published, the platform should begin tracking:

- enrollments;
- progress;
- final test attempts;
- pass/certificate rates;
- certificates issued at 80%+;
- feedback;
- proof submissions;
- verified achievements;
- drop-off points;
- course improvement signals.
Monitoring should always be tied to the published course version.

This prevents confusion between old and new versions of a course.


### 17.14 Publication safeguards

Before publication, the platform should confirm:


| Publication safeguard | Expected result |
| --- | --- |
| Approved Review record exists | Yes |
| Certificate rule set to 80%+ | Yes |
| Practical proof is separate from certificate | Yes |
| Sensitive data warnings included where needed | Yes |
| Accessibility requirements completed | Yes |
| Learner preview passed | Yes |
| Metadata complete | Yes |
| Visibility setting selected | Yes |
| Version number assigned | Yes |
| Publisher authorized | Yes |

If any required safeguard fails, Publish should remain blocked or require admin override with recorded reason.


### 17.15 Minimum Phase 1 Publish requirements

For Phase 1, Publish should minimally support:

- Publish locked until Review approval.
- Authorized publisher/admin publishes.
- Course metadata confirmation.
- Visibility/enrollment setting.
- Certificate rule confirmation at 80%+.
- Practical proof/badge setting where enabled.
- Published Course Record.
- Version number.
- Learner runtime access after publish.
- Monitoring activation after publish.
- Archive or unpublish path.
Advanced scheduling, complex cohort assignment, multi-language version branching, and advanced release management can be future enhancements.


### 17.16 Publish Workflow success standard

The Publish Workflow is successful when:

Only reviewed and approved courses can become visible to learners; publication is controlled by authorized roles; each release has complete metadata, correct 80% certificate logic, appropriate visibility, version tracking, and monitoring activation.

In practical terms, Publish should prevent this:

“A creator finished editing and the course went live automatically.”

And enforce this:

“The course passed Review, an authorized publisher confirmed release settings, the published version was recorded, and learners now access the correct course version.”


## 18. Learner Runtime Connection

The Learner Runtime Connection describes how the Course Creator Portal connects to the learner-facing DEC Learning Hub. This section is important because the creator workflow is not complete unless the course built, reviewed, and published in the portal renders correctly for learners.

The Course Creator Portal should not produce content that only looks complete inside the creator workspace. It must produce a stable learner-facing course experience that supports enrollment, lesson progress, activities, final test completion, certificate generation, practical proof submission where enabled, learner feedback, and monitoring.

The core principle is:

Everything approved in the Course Creator Portal must translate into a clear, accessible, mobile-friendly learner experience, and every learner action must feed back into progress, certification, practical achievement, and monitoring records.


### 18.1 Purpose of the Learner Runtime Connection

The learner runtime is where DEC’s course creation workflow becomes real for CSO learners.

It is the space where learners:

- discover or access a course;
- understand the course purpose;
- complete lessons and blocks;
- interact with examples, scenarios, practice tasks, and resources;
- take the final test;
- receive an automated certificate after scoring 80% or above;
- submit practical proof where available;
- receive feedback or verified achievement status;
- provide learner feedback;
- generate monitoring evidence for course improvement.
The learner runtime must therefore reflect the design and governance decisions made earlier in the workflow.

If the creator builds a course linked to MEAL capacity, the learner-facing course should clearly show what the learner will be able to do. If the creator configures a final test, learners should be able to take it. If the creator enables proof submission, learners should see clear instructions and safety guidance. If the course is published as a pilot, only the intended learners should access it.


### 18.2 Relationship Between Creator Workflow and Learner Runtime

The learner runtime should receive approved and published course data from the Course Creator Portal.


| Creator Portal output | Learner runtime behavior |
| --- | --- |
| Published Course Record | Course becomes available according to visibility rules |
| Course title and metadata | Course landing page and catalog card display correctly |
| Target learner group | Course description explains who the course is for |
| Capacity area | Learner sees what capacity the course strengthens |
| Course blocks | Learner sees lessons and activities in the approved sequence |
| Resources | Learner can download or view templates, checklists, and job aids |
| Final test | Learner can complete the test |
| Certificate rule | Certificate generated at 80%+ final test score |
| Practical proof pathway | Learner can submit proof where enabled |
| Badge/verified achievement setup | Learner can see proof review and achievement status |
| Accessibility settings | Learner sees captions, transcripts, alt text, low-bandwidth options |
| Safeguarding/data notes | Learner sees safety warnings before sensitive activities or uploads |
| Monitoring tags | Learner activity feeds into dashboards by course, version, capacity area, and organization where enabled |

This connection should be version-aware. Learners should experience the exact published version assigned to them, and monitoring data should link back to that version.


### 18.3 Course Catalog and Landing Page

After publication, the course should appear in the appropriate learner-facing location based on the visibility and enrollment settings.

The course catalog or assigned course list should show:


| Field | Purpose |
| --- | --- |
| Course title | Helps learner identify the course |
| Short description | Explains the course value |
| Capacity area | Shows the CSO capacity supported |
| Target learner group | Helps learner know whether the course is relevant |
| Estimated duration | Helps learner plan |
| Language | Shows available language version |
| Course level | Introductory, intermediate, advanced |
| Certificate available | Shows that certificate is available at 80%+ final test score |
| Practical proof / badge available | Shows optional verified achievement pathway where enabled |
| Status | Not started, in progress, completed, certificate earned |

The course landing page should explain:

- what the course helps the learner do;
- who the course is designed for;
- what activities are included;
- how to earn the certificate;
- whether practical proof or badge recognition is available;
- any safety or data protection cautions;
- estimated time and device/connectivity expectations.
Learner-facing text should be simple and practical. It should not display internal workflow terms such as “Analysis-to-Design Handover” or “Design-to-Build Handover.”


### 18.4 Lesson and Block Rendering

The learner runtime should render the approved course blocks in a clean, mobile-friendly sequence.

Learners should see:

- lesson introductions;
- short explanations;
- examples;
- practice activities;
- scenarios;
- reflections;
- resources;
- knowledge checks;
- final test;
- practical proof instructions where enabled;
- feedback and completion messages.
The learner should not see internal block metadata such as:

- block source;
- creator-added justification;
- AI drafting status;
- reviewer notes;
- design linkage IDs;
- internal warnings.
However, the system should retain that metadata internally for traceability and monitoring.

The learner runtime should prioritize:

- short sections;
- clear headings;
- simple navigation;
- readable text;
- low-bandwidth behavior;
- accessible content;
- visible progress;
- clear completion requirements.

### 18.5 Learner Progress Tracking

The learner runtime should track progress through the course.

Progress tracking may include:


| Progress item | Purpose |
| --- | --- |
| Course started | Shows learner began the course |
| Lesson completed | Tracks movement through course |
| Block completed | Supports granular progress |
| Resource downloaded | Shows use of tools/templates |
| Practice activity attempted | Shows engagement with application |
| Knowledge check completed | Shows learning interaction |
| Final test started | Shows progression to assessment |
| Final test completed | Triggers scoring and certificate logic |
| Certificate issued | Records 80%+ success |
| Practical proof submitted | Tracks optional applied evidence |
| Feedback submitted | Supports improvement and monitoring |

Progress tracking should be reliable but not intrusive. The learner should understand their own progress without feeling monitored in a punitive way.


### 18.6 Final Test Runtime

The learner runtime must support a clear final test experience.

The final test should:

- appear after required course content, or where the course design places it;
- clearly explain the pass/certificate rule;
- use approved test items;
- calculate score correctly;
- show result clearly;
- issue certificate automatically at 80%+;
- support retake behavior where enabled;
- show feedback where configured;
- record attempts for monitoring.
Learner-facing rule:

Score 80% or above on the final test to pass the course and receive your certificate.

The learner should not see a 90% certificate threshold unless DEC changes the rule in the future. The Phase 1 rule is 80%+.


### 18.7 Certificate Generation in Learner Runtime

When the learner scores 80% or above on the final test, the learner runtime should trigger certificate generation.

The certificate experience should include:

- success message;
- certificate availability;
- download/view certificate option;
- certificate ID or verification code where enabled;
- completion date;
- course title;
- learner name;
- DEC Learning Hub branding;
- optional capacity area label.
The learner dashboard should show certificate status:


| Status | Meaning |
| --- | --- |
| Not eligible yet | Learner has not passed final test |
| Certificate earned | Learner scored 80%+ and certificate is available |
| Certificate downloaded/viewed | Learner accessed certificate |
| Certificate verification available | Certificate can be checked through ID/code where enabled |

The certificate should not claim verified field application. It confirms course completion and final test pass.


### 18.8 Practical Proof Runtime

Where practical proof is enabled, the learner runtime should provide a separate proof submission experience.

This should appear after or alongside course completion, depending on course design. It must be clear that proof submission is not required for the course certificate unless DEC defines a special nonstandard pathway.

The practical proof page or block should show:

- what proof to submit;
- accepted file or text formats;
- whether a template is provided;
- safety and anonymization guidance;
- review criteria;
- review timeline or status, if available;
- resubmission rules;
- badge or verified achievement explanation.
Learner-facing distinction:

Your certificate is based on your final test score. Practical proof is a separate opportunity to show applied capacity and may lead to a verified achievement or badge.

Proof submission should never ask learners to upload unsafe data.


### 18.9 Practical Proof Submission Status

After a learner submits practical proof, the learner dashboard should show its status.

Recommended statuses:


| Status | Meaning |
| --- | --- |
| Not submitted | Learner has not submitted proof |
| Draft saved | Learner started but has not submitted |
| Submitted | Proof sent for review |
| Under review | Reviewer/verifier is assessing |
| Revision requested | Learner must revise, complete, or redact |
| Accepted | Proof meets criteria |
| Rejected | Proof does not meet criteria |
| Unsafe / removed | Submission contained unsafe data and was removed or needs redaction |
| Verified achievement awarded | Badge or achievement issued |

The learner should receive clear next-action messages.

Example:

Revision requested: Please remove names and identifying details from the uploaded document and resubmit.


### 18.10 Verified Achievement and Badge Runtime

When practical proof is accepted, the learner or CSO may receive a verified achievement or badge.

The learner runtime should show:

- achievement title;
- linked course;
- capacity area;
- verification date;
- reviewer/verifier status;
- whether it appears on learner profile;
- whether it appears on organization profile;
- visibility setting;
- safe sharing option where enabled.
The system should clearly distinguish:


| Recognition | Learner meaning |
| --- | --- |
| Certificate | I passed the course final test |
| Verified achievement / badge | My submitted practical proof was reviewed and accepted |

This distinction should remain visible in learner and organization dashboards.


### 18.11 Learner Feedback

The learner runtime should collect simple feedback after course completion or certificate issuance.

Feedback questions should be short and practical.

Recommended feedback prompts:


| Question | Response type |
| --- | --- |
| Was this course relevant to your CSO work? | 1–5 scale |
| Was the course easy to understand? | 1–5 scale |
| Could you use the course on your device/internet connection? | 1–5 scale |
| Did the examples feel realistic? | 1–5 scale |
| What was the most useful part? | Short text |
| What was confusing or difficult? | Short text |
| What will you try to apply in your organization? | Short text |
| What support would help you apply this learning? | Short text |

Feedback should feed into course monitoring and improvement logs.


### 18.12 Learner Dashboard

The learner dashboard should show the learner’s personal learning journey.

It may include:


| Dashboard item | Purpose |
| --- | --- |
| Enrolled courses | Courses available to the learner |
| In-progress courses | Courses started but not completed |
| Completed courses | Courses completed |
| Certificates | Certificates earned at 80%+ final test score |
| Practical proof submissions | Submitted proof and review status |
| Verified achievements / badges | Accepted applied-capacity recognition |
| Recommended next courses | Suggested learning pathway |
| Feedback requests | Courses awaiting learner feedback |

The learner dashboard should be simple, mobile-friendly, and motivating.


### 18.13 Organization Runtime Connection

Where the platform supports organization-level views, learner activity may contribute to organization dashboards.

Organization admins may see safe summaries such as:

- staff enrolled;
- courses completed;
- certificates earned;
- verified achievements awarded;
- capacity areas covered;
- practical proof statuses;
- recommended next learning priorities.
Organization admins should not automatically see sensitive learner submissions or raw proof unless consent and visibility rules allow it.

The organization runtime connection should help CSOs see capacity-building progress without turning the platform into a surveillance tool.


### 18.14 Version-Aware Learner Runtime

Learner runtime must be version-aware.

A learner should complete a specific published version of a course. Their final test results, certificate, feedback, proof submission, and achievement records should link to that version.

This matters because courses may later be revised.

For example:

- Learner A completed Version 1.
- Course is later revised to Version 2.
- Learner A’s certificate and test score remain linked to Version 1.
- New learners take Version 2.
- Monitoring can compare performance by version where needed.
This protects evidence integrity.


### 18.15 Accessibility, Localization, and Low-Bandwidth Runtime

The learner runtime should reflect the accessibility and localization requirements defined during Design and Build.

It should support:

- mobile-first layout;
- short readable sections;
- clear buttons and progress indicators;
- low file sizes;
- text alternatives for media;
- alt text for images;
- transcripts or captions for audio/video;
- downloadable or printable resources;
- plain-language wording;
- translation-ready content;
- local examples;
- low-bandwidth alternatives.
Learners should be able to complete courses even with limited connectivity, small screens, or varying digital skills.


### 18.16 Data Safety in Learner Runtime

The learner runtime should protect learners and CSOs from unsafe disclosure.

This is especially important for practical proof, safeguarding, advocacy, civic-space, and community feedback courses.

The runtime should:

- display safety warnings before sensitive submissions;
- discourage uploading real names or personal details;
- require anonymization or redaction where relevant;
- avoid asking learners to share active protection cases;
- restrict proof visibility by role;
- keep raw evidence private by default;
- show donor-facing summaries only where consent and safeguards exist.
Standard proof safety message:

Do not upload real names, phone numbers, addresses, beneficiary details, politically sensitive information, or active safeguarding/protection cases. Use anonymized, redacted, or fictionalized examples unless your organization has approved the document for sharing.


### 18.17 Runtime Data Feeding Monitoring

Learner runtime actions should feed monitoring and evaluation.

Runtime events may include:

- enrollment;
- course start;
- lesson progress;
- block completion;
- resource download;
- practice attempt;
- final test attempt;
- score;
- certificate issued;
- proof submitted;
- proof review result;
- verified achievement awarded;
- learner feedback submitted.
These events should support dashboards for:

- course creators;
- DEC admins;
- reviewers/verifiers;
- organization admins where enabled;
- DEC M&E/learning leads.
The Monitoring and Evaluation section will define how these records are interpreted.


### 18.18 Minimum Phase 1 Requirements

For Phase 1, the learner runtime connection should minimally support:

- Published course appears in learner-facing access area.
- Course metadata displays correctly.
- Approved blocks render in learner order.
- Learner progress is tracked.
- Final test is accessible and scored.
- Certificate is issued automatically at 80%+ final test score.
- Learner dashboard shows certificate status.
- Practical proof submission appears where enabled.
- Practical proof status is visible to learner where enabled.
- Feedback collection is available after completion.
- Learner data links to course version.
- Monitoring receives basic runtime events.
- Learner-facing experience hides internal creator/reviewer metadata.
- Safety and accessibility notes appear where configured.
Advanced offline sync, adaptive learning paths, complex organization dashboards, and donor-facing recognition portals may be future enhancements.


### 18.19 Success Standard for Learner Runtime Connection

The Learner Runtime Connection is successful when:

A course built and approved in the Course Creator Portal appears to learners as a clear, accessible, mobile-friendly learning experience; learners can complete the course, take the final test, receive a certificate at 80%+, optionally submit practical proof, and generate reliable monitoring evidence tied to the published course version.

In practical terms, the platform should prevent this:

“The course looks complete in Build Studio, but learners cannot complete it, the certificate does not trigger correctly, or proof submission is confusing.”

And ensure this:

“The approved course renders correctly for learners, the final test works, the certificate is issued at 80%+, optional proof submission is safe and separate, and learner activity feeds into monitoring.”


## 19. Monitoring and Evaluation

The Monitoring and Evaluation function connects the published learner experience back to the original course purpose, Analysis baseline, Design performance goal, certificate logic, practical proof pathway, verified achievements, learner feedback, and course improvement decisions.

This section is important because the DEC Learning Hub should not only answer:

How many learners completed a course?

It should also help DEC answer:

Which CSO capacity areas are being strengthened, which courses are working, where learners are struggling, what practical evidence is being submitted, and what should be improved?

Monitoring and Evaluation should therefore be treated as a learning and capacity evidence system, not only a completion dashboard.

The core principle is:

Every published course should generate useful evidence about learner engagement, final test performance, certificates, practical proof, verified achievements, feedback, and improvement needs—while staying linked to the original Analysis and Design records.


### 19.1 Purpose of Monitoring and Evaluation

Monitoring and Evaluation has six main purposes.

First, it tracks learner engagement. DEC should know whether learners enroll, start, progress, complete, drop off, or return to the course.

Second, it tracks learning achievement. Final test scores, pass rates, retakes, and certificate issuance show whether learners are meeting the course learning threshold.

Third, it tracks practical application where enabled. Practical proof submissions and verified achievements provide stronger evidence of applied capacity than course completion alone.

Fourth, it supports course improvement. Low completion, confusing test items, weak proof submissions, or negative feedback can signal that a course needs revision.

Fifth, it supports organization-level capacity evidence. Where safe and appropriate, certificates and verified achievements can contribute to a CSO’s capacity development profile.

Sixth, it supports DEC learning, reporting, and adaptive management. The platform should help DEC understand which capacity areas require more support, which courses perform well, and where future course development should focus.


### 19.2 Monitoring must link back to Analysis and Design

Monitoring should not be disconnected from the course creation workflow.

Each published course should remain traceable to:

- Analysis-to-Design Handover;
- capacity gap;
- baseline/current practice;
- desired practice;
- CSO capacity area;
- indicator or standard;
- target learner group;
- K/S course-fit route;
- performance goal;
- Action Map;
- Design-to-Build Handover;
- final test;
- practical proof pathway where enabled;
- published course version.
This means that monitoring should not only show generic course metrics. It should show metrics in relation to the original capacity-strengthening purpose.

For example, instead of only showing:

120 learners completed the MEAL course.

The platform should support a more meaningful interpretation:

120 CSO project officers completed a course linked to the MEAL capacity area and outcome evidence use; 94 passed the final test and received certificates; 28 submitted optional outcome evidence worksheets; 19 were accepted as verified achievements; learner feedback shows that the worksheet example needs simplification.


### 19.3 Monitoring should be version-aware

Monitoring must be linked to the specific published course version learners completed.

This is essential because courses may be revised after publication.

For example:


| Course version | Monitoring implication |
| --- | --- |
| Version 1 | Learners who completed V1 keep their records, scores, certificates, and feedback linked to V1 |
| Version 2 | New learners complete the updated version |
| Version comparison | DEC may compare whether V2 improved completion, test performance, or feedback |

Version-aware monitoring protects evidence integrity. It prevents results from different versions being mixed without context.

This is especially important where final test questions, practical proof criteria, safeguarding warnings, or course content have changed.


### 19.4 Core Monitoring Records

The platform should generate or maintain several connected monitoring records.


| Record | Purpose |
| --- | --- |
| Enrollment record | Shows who enrolled or was assigned to a course |
| Progress record | Tracks course, lesson, and block progress |
| Final test attempt record | Tracks test attempts, scores, pass status, and retakes |
| Certificate record | Records certificate issued at 80%+ final test score |
| Practical proof submission record | Tracks proof submission and review status |
| Verified achievement / badge record | Records accepted practical proof and related recognition |
| Learner feedback record | Captures relevance, clarity, usability, and application intent |
| Course improvement log | Records issues, revision decisions, and improvement actions |
| Organization capacity evidence summary | Aggregates safe evidence by organization and capacity area |
| Published course version record | Links analytics to the exact course version |

These records do not need to be implemented all at once in advanced form. However, the platform should be designed so these evidence types can connect over time.


### 19.5 Learner Engagement and Progress Metrics

The platform should track basic learner engagement.

Recommended metrics:


| Metric | What it shows |
| --- | --- |
| Enrollment count | Number of learners registered or assigned |
| Start rate | How many enrolled learners begin the course |
| Lesson progress | Which lessons learners complete |
| Block progress | Which blocks learners complete or skip |
| Time to completion | Whether the course length is realistic |
| Drop-off points | Where learners stop |
| Resource downloads | Whether templates and job aids are used |
| Practice activity attempts | Whether learners engage with applied tasks |
| Course completion rate | Whether learners finish the course pathway |

These metrics should help DEC and course creators answer:

- Is the course being used?
- Are learners completing it?
- Where are learners stopping?
- Are resources useful?
- Is the course too long or confusing?
Progress tracking should support improvement, not surveillance.


### 19.6 Final Test and Certificate Metrics

The platform should track final test performance and certificate issuance.

The binding certificate rule is:

80%+ final test score = course pass and automated certificate.

Monitoring should therefore record certificates at 80%+, not 90%.

Recommended metrics:


| Metric | What it shows |
| --- | --- |
| Final test attempts | How many learners attempt the final test |
| First-attempt score | Initial learner performance |
| Highest score | Best achieved score where retakes are enabled |
| Pass/certificate rate | Percentage scoring 80%+ |
| Retake rate | Whether learners need several attempts |
| Question-level performance | Which questions are easy, hard, or confusing |
| Certificate count | Number of automated certificates issued |
| Certificate verification count, if enabled | How often certificates are viewed/verified |

Monitoring should distinguish between:


| Result | Meaning |
| --- | --- |
| Below 80% | Learner has not passed |
| 80%+ | Learner passed and certificate issued |

There should be no 90% certificate threshold in the Phase 1 monitoring logic.


### 19.7 Practical Proof Metrics

Where practical proof is enabled, the platform should track proof submission behavior.

Recommended metrics:


| Metric | What it shows |
| --- | --- |
| Proof pathway enabled | Whether the course includes proof submission |
| Proof submission rate | How many eligible learners submit proof |
| Draft proof count | Learners who started but did not submit |
| Under review count | Submissions awaiting review |
| Revision requested count | Proof needing correction or redaction |
| Accepted proof count | Proof accepted by reviewer/verifier |
| Rejected proof count | Proof not accepted |
| Unsafe submission count | Submissions requiring removal, redaction, or escalation |
| Average review time | How long verification takes |
| Common proof weaknesses | Issues learners repeatedly face |

Practical proof metrics help DEC understand whether learners are applying course content and whether proof instructions are clear.

For example:


| Evidence | Possible interpretation |
| --- | --- |
| High certificate rate but low proof submission | Learners understand content but may need support applying it |
| Many revision requests | Proof criteria or instructions may be unclear |
| Many unsafe uploads | Safety/anonymization guidance needs strengthening |
| High accepted proof rate | Learners can apply the learning in practice |


### 19.8 Verified Achievement and Badge Metrics

Verified achievements and badges should be tracked separately from certificates.

Recommended metrics:


| Metric | What it shows |
| --- | --- |
| Verified achievements awarded | Number of accepted applied-capacity recognitions |
| Badges awarded by course | Which courses generate practical evidence |
| Badges awarded by capacity area | Which capacity areas show applied evidence |
| Badges awarded by organization | Which CSOs are building verified capacity evidence |
| Indicator-linked achievements | Which standards/indicators are supported |
| Learner-level achievements | Learner’s applied recognition record |
| Organization-level achievements | CSO’s capacity evidence profile |
| Expired/renewal-needed achievements, if used | Whether achievements need updating |

The platform should maintain the distinction:


| Recognition | Monitoring meaning |
| --- | --- |
| Certificate | Learner passed the final test |
| Verified achievement / badge | Practical proof was reviewed and accepted |

This distinction is essential for credibility.


### 19.9 Learner Feedback Metrics

Learner feedback should be short, practical, and connected to course improvement.

Recommended feedback questions include:


| Question | Response type |
| --- | --- |
| Was this course relevant to your CSO work? | 1–5 scale |
| Was the course easy to understand? | 1–5 scale |
| Could you use the course on your device/internet connection? | 1–5 scale |
| Did the examples feel realistic? | 1–5 scale |
| What was the most useful part? | Short text |
| What was confusing or difficult? | Short text |
| What will you try to apply in your organization? | Short text |
| What support would help you apply this learning? | Short text |

The platform should allow course creators and DEC admins to review feedback summaries.

Feedback should feed into the Course Improvement Log.


### 19.10 Course Improvement Signals

Monitoring should help identify when a course needs revision.

Examples:


| Signal | Possible action |
| --- | --- |
| High drop-off in first lesson | Simplify introduction or clarify value |
| High drop-off before final test | Course may be too long or final test may feel intimidating |
| Low final test pass rate | Improve explanations, practice, or test clarity |
| Many wrong answers on one question | Revise question or add clearer teaching block |
| Low certificate rate | Review final test difficulty and course design |
| Low proof submission rate | Improve proof instructions or examples |
| Many rejected proof submissions | Clarify criteria or add practice support |
| Many unsafe proof uploads | Strengthen data safety warning |
| Low relevance feedback | Revisit Analysis or learner group |
| Low mobile usability feedback | Improve layout or low-bandwidth design |

Course improvement should be evidence-informed. Monitoring data should not sit unused in dashboards.


### 19.11 Course Improvement Log

The platform should support a Course Improvement Log for each published course.

Recommended fields:


| Field | Purpose |
| --- | --- |
| Course ID / version | Links issue to specific version |
| Issue source | Analytics, learner feedback, reviewer note, admin observation, proof review pattern |
| Issue description | What problem was identified |
| Severity | Low, medium, high |
| Related course area | Lesson, block, final test, proof instruction, accessibility, safeguarding, metadata |
| Suggested action | Revise block, update test item, add example, improve safety note, simplify resource |
| Decision | Accepted, deferred, rejected, needs review |
| Assigned to | Creator, admin, reviewer, accessibility reviewer, safeguarding reviewer |
| Status | Open, in progress, resolved, archived |
| Resulting version | New version if revision is published |

This log helps DEC create a continuous improvement loop.


### 19.12 Dashboards by User Role

Different users need different monitoring views.


### Course Creator Dashboard

Course creators should see monitoring for the courses they own or manage.

They may see:

- enrollment;
- completion;
- final test pass/certificate rate;
- drop-off points;
- learner feedback;
- practical proof submissions;
- verified achievements;
- course improvement alerts.

### DEC Admin Dashboard

Admins should see platform-wide monitoring.

They may see:

- total courses;
- published courses;
- courses by capacity area;
- learner participation;
- organization participation;
- certificates issued;
- proof submissions;
- verified achievements;
- courses needing review or improvement;
- version status;
- data safety flags.

### DEC Capacity / M&E Dashboard

Capacity and M&E leads should see evidence by capacity area, indicator, learner group, organization, and course version.

They may see:

- capacity areas covered;
- indicators supported;
- baseline-to-output links;
- pass/certificate rates by capacity area;
- proof/achievement patterns;
- organization-level evidence;
- gaps in course coverage;
- priority support needs.

### Organization Dashboard

Where enabled, organization admins may see safe summaries for their CSO:

- staff enrolled;
- courses completed;
- certificates earned;
- verified achievements awarded;
- capacity areas covered;
- recommended next courses;
- practical proof status, if visibility rules allow.

### Reviewer / Verifier Dashboard

Reviewers or proof verifiers may see:

- proof submissions awaiting review;
- revision requests;
- accepted/rejected proof;
- unsafe submissions;
- common evidence quality issues;
- review workload.

### Donor-Safe Summary

Where enabled and consented, donor-facing summaries should show only safe, aggregated or verified information, not raw evidence.

They may show:

- CSOs participating;
- capacity areas addressed;
- certificates issued;
- verified achievements awarded;
- indicators supported;
- anonymized learning insights.
Raw proof should remain private unless explicit consent and safeguards apply.


### 19.13 Organization-Level Capacity Evidence

Monitoring can support organization-level capacity evidence, but it must avoid overclaiming.

Organization-level evidence may include:

- number of learners from the organization who completed relevant courses;
- certificates earned by staff;
- verified achievements earned;
- capacity areas where proof has been accepted;
- indicators linked to achievements;
- dates and versions of achievements;
- recommended next capacity steps.
The platform should distinguish:


| Evidence type | Meaning |
| --- | --- |
| Staff certificate | Staff member passed course final test |
| Staff verified achievement | Staff member submitted accepted practical proof |
| Organization achievement | Organization-level proof or multiple staff achievements suggest capacity progress |
| Capacity evidence summary | Aggregated evidence that may support donor/partner dialogue |

This evidence should not be presented as full organizational certification unless DEC later creates a formal organizational certification framework.


### 19.14 Data Safety in Monitoring

Monitoring must protect CSOs, learners, and communities.

Rules:

- collect only necessary data;
- avoid sensitive personal or political data unless clearly justified and protected;
- keep raw practical proof private by default;
- restrict proof visibility by role;
- anonymize or aggregate sensitive dashboard data;
- do not expose unsafe submissions to unauthorized users;
- do not share donor-facing data without consent;
- preserve safeguards for advocacy, community feedback, safeguarding, and protection-related content.
The Monitoring and Evaluation system should support evidence use without becoming surveillance.


### 19.15 Monitoring and Donor Reporting

The platform may support safe donor reporting, but only at the right level.

Useful donor-facing evidence may include:

- number of CSOs reached;
- courses completed;
- certificates issued;
- capacity areas addressed;
- verified achievements awarded;
- indicators supported;
- anonymized learner feedback trends;
- examples of capacity improvement without sensitive raw data.
The platform should not automatically expose:

- raw proof documents;
- personal learner details;
- beneficiary/community data;
- safeguarding cases;
- politically sensitive information;
- internal reviewer notes;
- unapproved organization-level weaknesses.
Donor reporting should be safe, consent-based, and aligned with DEC’s accountability and CSO protection principles.


### 19.16 Adaptive Learning and Strategic Use

Monitoring data should feed back into DEC’s strategic decisions.

DEC should be able to use monitoring evidence to ask:

- Which capacity areas have high demand?
- Which capacity areas lack courses?
- Which courses have high completion and certificate rates?
- Which courses need revision?
- Which organizations are showing verified capacity progress?
- Which learners or CSOs need follow-up support?
- Which practical proof tasks are too difficult?
- Which safeguarding or data risks are emerging?
- Which course topics should be prioritized next?
This turns the Learning Hub into a continuous learning system.


### 19.17 Monitoring Activation After Publish

Monitoring should activate when a course is published.

The Published Course Record should trigger tracking for:

- learner enrollment;
- progress;
- final test attempts;
- certificate issuance at 80%+;
- proof submissions;
- verified achievements;
- feedback;
- improvement signals.
If a course is unpublished or archived, the platform should preserve historical data but stop new enrollments unless explicitly reactivated.


### 19.18 Relationship Between Monitoring and Revision

Monitoring should support course revisions.

When monitoring data shows a course problem, the platform should allow DEC to create a revision draft.

Example flow:

- Monitoring shows low pass rate on final test Question 4.
- Course creator reviews question-level performance.
- Creator identifies unclear teaching block.
- Revision draft is created.
- Block and question are revised.
- Review approval is completed if needed.
- New version is published.
- Monitoring compares Version 1 and Version 2.
This keeps course improvement evidence-based and version-controlled.


### 19.19 Minimum Phase 1 Requirements

For Phase 1, Monitoring and Evaluation should minimally support:

- Enrollment tracking.
- Course progress tracking.
- Final test attempt and score tracking.
- Certificate issuance tracking at 80%+.
- Learner feedback collection.
- Course-level dashboard for creators/admins.
- Practical proof status tracking where enabled.
- Verified achievement/badge tracking where enabled.
- Capacity area linkage in dashboards.
- Version-aware reporting.
- Basic course improvement log or issue tracking.
- Safe role-based visibility for learner/proof data.
Advanced predictive analytics, donor portals, complex organizational maturity scoring, and automated impact attribution should be future enhancements.


### 19.20 What Monitoring Should Not Claim

The platform should avoid overclaiming.

Monitoring should not automatically claim:

- that course completion equals organizational transformation;
- that a certificate proves field application;
- that one badge proves full organizational capacity;
- that donor readiness is guaranteed;
- that raw proof can be shared externally;
- that learning analytics alone prove community-level impact.
The platform can say:

Learners completed the course and passed the final test.

It can say:

Practical proof was submitted and accepted for a verified achievement.

It should not say:

This CSO is fully transformed or fully donor-ready.

unless DEC creates a separate validated organizational certification process.


### 19.21 Success Standard for Monitoring and Evaluation

Monitoring and Evaluation is successful when:

DEC can see who is learning, what they are completing, who is earning certificates at 80%+, who is submitting practical proof, what verified achievements are being awarded, which capacity areas and indicators are being supported, which courses need improvement, and what safe evidence can support adaptive learning, organizational recognition, and donor dialogue.

In practical terms, the platform should prevent this:

“We know 500 people completed courses, but we do not know what capacity areas were addressed, where learners struggled, or whether anyone applied the learning.”

And support this:

“We know which CSO capacity areas were addressed, how learners performed, how many certificates were issued, what practical proof was submitted, which achievements were verified, and which courses should be improved next.”


## 20. Data Safety, Consent, and Donor Visibility

The Data Safety, Consent, and Donor Visibility rules define how the DEC Learning Hub protects learners, CSOs, communities, rights-holders, and sensitive organizational information while still allowing safe use of learning and verified achievement evidence.

This section is critical because the DEC Learning Hub is not only a learning platform. It is also a capacity-strengthening and evidence system. The platform may collect learner progress data, final test results, certificates, practical proof submissions, verified achievements, learner feedback, and organization-level summaries. Some of this evidence can help DEC, CSOs, and donors understand progress. But some of it may also create risk if exposed without consent, anonymization, or role-based controls.

The core principle is:

The platform should make capacity evidence useful without making CSOs, learners, communities, or rights-holders unsafe.


### 20.1 Purpose of data safety rules

The platform should support useful learning evidence, but not at the cost of privacy, protection, or trust.

Data safety rules are needed to:

- prevent learners from uploading unsafe documents;
- protect beneficiary, community, and rights-holder information;
- protect CSOs working in sensitive civic-space environments;
- prevent accidental exposure of organizational weaknesses;
- ensure practical proof is reviewed safely;
- control what organization admins, reviewers, DEC staff, and donors can see;
- make donor-facing recognition consent-based and safe;
- avoid turning monitoring into surveillance;
- build trust with local CSOs.
The data safety approach should be practical, not bureaucratic. Course creators, learners, reviewers, and admins should see clear prompts, warnings, and visibility choices at the point where risk may occur.


### 20.2 Types of data the platform may handle

The platform may handle different categories of data. Each category needs a different level of protection.


| Data type | Examples | Sensitivity level |
| --- | --- | --- |
| Basic learner data | Name, email, role, organization, enrolled courses | Moderate |
| Learning progress data | lessons completed, final test attempts, scores, certificates | Moderate |
| Course creation data | course drafts, analysis handovers, design records, reviewer comments | Internal |
| Practical proof data | uploaded work samples, templates, action plans, documents | Potentially high |
| Verified achievement data | badge title, capacity area, verification date, proof status | Moderate to high depending on visibility |
| Organization capacity evidence | aggregated certificates, achievements, capacity areas | Moderate to high |
| Safeguarding/protection information | cases, referrals, survivor or child protection details | Very high; should generally not be uploaded |
| Civic-space/political information | advocacy plans, sensitive actors, government relations, risk details | High |
| Donor-facing summaries | safe achievement summaries, capacity areas, verified badges | Controlled/consent-based |

The platform should not treat all data the same. Practical proof, safeguarding-related content, civic-space content, and organizational capacity evidence require stronger safeguards than ordinary course progress data.


### 20.3 Data minimization principle

The platform should collect only the data needed for learning, certification, verification, monitoring, and safe reporting.

It should avoid asking learners or CSOs to provide unnecessary sensitive information.

For example:


| Instead of asking for | Ask for |
| --- | --- |
| Full beneficiary list | An anonymized sample or fictionalized example |
| Real safeguarding case file | Simulated referral pathway checklist |
| Full internal financial report | A redacted budget justification sample |
| Politically sensitive advocacy plan | A safe, generalized advocacy message example |
| Raw complaint log with names | Redacted feedback categorization sample |
| Staff performance issues | Aggregated learning need or anonymous example |

The platform should guide learners to submit the minimum safe evidence needed to verify the practical task.


### 20.4 Consent principle

Consent should be required before learner or organization evidence is made visible beyond the intended platform role.

Consent is especially important for:

- organization-level capacity summaries;
- donor-facing verified achievement summaries;
- public badge visibility;
- sharing achievement records outside the platform;
- using learner examples in reports or case studies;
- showing organization names in donor-facing dashboards.
The default rule should be:

Raw learner submissions and practical proof are private by default. External visibility requires explicit permission and safe summary formatting.

Consent should be clear, specific, and reversible where possible.

For example, the platform should not use vague language such as:

“Your data may be shared with partners.”

It should use clear options such as:

“Allow this verified achievement summary to be visible to approved donor users. Raw uploaded proof will not be shared.”


### 20.5 Role-based visibility

The platform should control visibility by role.

Not every user should see every type of data.

Recommended visibility logic:


| Data / record | Learner | Creator | Reviewer | Admin | Org Admin | Donor-facing user |
| --- | --- | --- | --- | --- | --- | --- |
| Learner’s own progress | Yes | No / aggregated | No / if assigned | Yes | Summary only | No |
| Course analytics | No | Own courses | Relevant review context | Yes | Organization summary | Aggregated only |
| Final test score | Own score | Aggregated | If review role requires | Yes | Summary only | No |
| Certificate | Own certificate | Aggregated | No | Yes | Summary where enabled | Count/summary only |
| Practical proof raw upload | Own submission | No by default | Assigned verifier/reviewer | Restricted admin | Only if consented/allowed | No |
| Reviewer notes | No | If returned to creator | Yes | Yes | No | No |
| Verified achievement | Own achievement | Aggregated | If relevant | Yes | Summary where enabled | Consent-based summary |
| Organization capacity summary | No | No / limited | Limited | Yes | Yes | Consent-based summary |
| Sensitive safeguarding data | Avoid upload | No | Specialist only if unavoidable | Restricted | No | No |

This table should guide implementation but can be simplified in early Phase 1. The important rule is that raw sensitive data should not be broadly visible.


### 20.6 Practical proof safety rules

Practical proof is one of the highest-risk areas because it may involve real organizational documents or community-related evidence.

The platform should display safety guidance before proof submission.

Standard learner safety note:

Do not upload real names, phone numbers, addresses, beneficiary details, politically sensitive information, or active safeguarding/protection cases. Use anonymized, redacted, or fictionalized examples unless your organization has approved the document for sharing.

Practical proof submission should support:

- anonymized examples;
- redacted uploads;
- fictionalized/simulated examples where appropriate;
- template-based submissions;
- text-entry alternatives instead of file upload where safer;
- reviewer request for redaction;
- unsafe submission removal;
- specialist escalation.
The platform should not reward learners for uploading excessive evidence. It should reward safe, relevant, sufficient proof.


### 20.7 Unsafe data that should not be uploaded

The platform should clearly warn learners not to upload:

- real beneficiary names;
- phone numbers;
- addresses;
- identifiable community member details;
- active safeguarding or protection case files;
- GBV case details;
- child protection case records;
- politically sensitive information;
- names of at-risk activists or informants;
- unredacted complaint logs;
- confidential donor documents;
- internal HR disciplinary records;
- bank details or financial account information;
- documents not approved by the organization for sharing;
- photos that identify vulnerable individuals without consent.
Where a course involves safeguarding, GBV, protection, advocacy, civic engagement, or community accountability, the safety warning should be more visible and may require an additional confirmation before submission.


### 20.8 Safeguarding and civic-space sensitivity

Some course areas require extra caution.

High-risk areas include:

- safeguarding;
- child protection;
- GBV;
- protection referrals;
- community feedback and complaints;
- advocacy;
- civic engagement;
- legal or regulatory issues;
- conflict-sensitive work;
- government relations;
- whistleblowing;
- financial accountability involving sensitive documents.
For these courses, the platform should require at least one of the following:

- fictionalized examples only;
- anonymized/redacted proof only;
- specialist reviewer flag;
- restricted proof visibility;
- stronger learner warning;
- no file upload, only structured template response;
- manual admin approval before proof pathway is enabled.
The course should avoid asking learners to disclose real cases. It can teach safe process steps through fictionalized scenarios.


### 20.9 Anonymization and redaction guidance

The platform should provide practical guidance on anonymization and redaction.

Learners and CSOs may not know what to remove from a document. The platform should explain.

Before upload, learners should be told to remove or replace:


| Remove / redact | Replace with |
| --- | --- |
| Person’s name | “Participant A” or “Community member” |
| Phone number | “[redacted phone]” |
| Address or kebele details | “local area” or “[redacted location]” |
| Organization-sensitive internal note | summary only |
| Case file number | “[redacted case ID]” |
| Exact incident description | generalized description |
| Photo identifying person | no photo or blurred/anonymized image |
| Political actor name if risky | “local authority” or generalized role |

The platform may include a simple checklist:

Before submitting, have you removed names, phone numbers, addresses, case details, and sensitive political or protection information?


### 20.10 Donor visibility principle

Donor visibility should be useful but safe.

The platform may allow approved donor users or partners to see safe summaries of CSO capacity progress, especially verified achievements or aggregated capacity evidence. But donors should not automatically access raw learner data or uploaded proof.

The donor visibility rule should be:

Donors may see safe, consent-based summaries of verified achievements and capacity areas. They should not see raw proof, sensitive learner data, internal reviewer comments, or unsafe organizational details.

A donor-facing summary may include:


| Field | Visibility |
| --- | --- |
| CSO name | Only if organization consents |
| Capacity area | Yes |
| Verified achievement title | Yes |
| Indicator or standard | Yes |
| Verification date | Yes |
| Recognition status | Yes |
| Short safe summary | Yes, if approved |
| Raw proof file | No by default |
| Learner personal details | No by default |
| Reviewer private notes | No |
| Sensitive organizational weaknesses | No |
| Safeguarding/protection details | No |

This allows DEC and CSOs to communicate progress without exposing sensitive evidence.


### 20.11 Organization control over visibility

CSOs should have control over what is externally visible about them.

The platform should support organization-level visibility settings such as:


| Setting | Meaning |
| --- | --- |
| Private | Visible only to learner, organization admin, and authorized DEC users |
| Organization-visible | Visible within the CSO organization dashboard |
| DEC-visible | Visible to DEC admins and relevant program staff |
| Donor-safe summary | Visible to approved donor users as a safe summary |
| Public profile, future option | Visible more broadly only if DEC and CSO approve |

For Phase 1, donor visibility can remain basic or disabled until the safety and consent model is mature.

The platform should avoid creating public rankings of CSOs or exposing comparative weakness without consent.


### 20.12 Raw evidence vs safe summaries

The platform should separate raw evidence from safe summaries.


| Raw evidence | Safe summary |
| --- | --- |
| Uploaded file, worksheet, document, feedback log, case-based proof | Short statement that evidence was reviewed and accepted |
| May contain sensitive details | Should contain no sensitive details |
| Restricted access | Can be shared more safely with consent |
| Used by verifier | Used for dashboards and reporting |
| Not donor-visible by default | May be donor-visible if approved |

Example:

Raw evidence:

Uploaded outcome evidence worksheet with internal project details.

Safe summary:

Verified achievement awarded for submitting an accepted outcome evidence worksheet linked to MEAL capacity.

This separation is essential for donor-facing features.


### 20.13 Data safety in Monitoring and Evaluation

Monitoring dashboards should avoid exposing unsafe details.

Dashboards should use aggregation and role-based visibility.

For example:


| Dashboard | Safe display |
| --- | --- |
| Creator dashboard | Course-level completion, feedback trends, proof counts |
| Admin dashboard | Platform-wide analytics and restricted issue flags |
| Organization dashboard | Staff certificates and verified achievements |
| Donor summary | Aggregated achievements and capacity areas |
| Reviewer dashboard | Assigned proof submissions only |
| Safeguarding dashboard | Sensitive flags restricted to specialist users |

Monitoring should not become a surveillance tool.

It should help DEC and CSOs learn, improve courses, and recognize capacity progress safely.


### 20.14 Data safety in AI-assisted authoring

AI should not be given raw sensitive data.

The platform should discourage users from pasting sensitive information into AI prompts.

AI prompts should not include:

- beneficiary names;
- phone numbers;
- addresses;
- case details;
- active safeguarding information;
- political risk details;
- confidential organizational documents;
- raw proof submissions unless explicitly safe and redacted.
Where AI helps draft examples, it should use fictionalized scenarios.

Suggested AI warning:

Do not paste real names, beneficiary details, active case information, or confidential documents into AI prompts. Use anonymized or fictionalized examples.

AI-generated content involving safeguarding, advocacy, civic-space, or data protection should require human review.


### 20.15 Data safety in Review and Publish

Reviewers and publishers should check data safety before publication.

Review should confirm:

- course does not ask learners to disclose unsafe data;
- proof submission instructions include anonymization guidance;
- sensitive scenarios are fictionalized;
- donor visibility is not enabled by default for raw proof;
- reviewer notes do not expose sensitive details unnecessarily;
- certificates do not overclaim applied capacity;
- verified achievements use safe wording;
- publication metadata does not reveal sensitive organizational information.
Publish should remain blocked if serious data safety issues are unresolved.


### 20.16 Consent and withdrawal

The platform should support the principle that CSOs can change visibility decisions where feasible.

For example:

- a CSO may allow a verified achievement summary to be donor-visible;
- later, the CSO may request that it be hidden from donor-facing views;
- raw proof remains restricted unless explicitly shared;
- archived or hidden achievements may still remain in DEC internal records for audit, depending on policy.
The exact data retention policy may be defined separately, but the product behavior should respect consent and safe visibility.


### 20.17 Data retention and audit trail

The platform should maintain enough audit trail to support accountability without overexposing sensitive information.

Audit trail may include:

- who submitted proof;
- who reviewed it;
- review decision;
- date of verification;
- badge/achievement awarded;
- visibility setting;
- consent status;
- publication status;
- version history.
However, the platform should avoid permanently retaining unsafe raw data if it was uploaded by mistake. Unsafe submissions may need removal, redaction, or restricted access depending on DEC policy.


### 20.18 Minimum Phase 1 requirements

For Phase 1, the platform should minimally support:

- Clear safety warning before practical proof submission.
- Role-based access to raw proof.
- Proof status tracking without broad exposure of raw evidence.
- Verified achievement records separated from raw proof.
- Safe organization-level summaries where enabled.
- Donor visibility disabled by default or limited to consent-based summaries.
- No raw proof visible to donors by default.
- AI prompt warning against sensitive data.
- Reviewer ability to mark proof as unsafe or request redaction.
- Data safety checks before Review and Publish.
- Certificate wording that avoids overclaiming applied capacity.
- Basic visibility settings for achievements.
Advanced consent management, donor portals, public CSO profiles, data retention automation, and advanced privacy controls can be future enhancements.


### 20.19 What the platform should not do

The platform should not:

- automatically share raw proof with donors;
- expose learner test scores publicly;
- rank CSOs by perceived capacity without consent;
- publish organizational weaknesses;
- encourage learners to upload active safeguarding cases;
- allow AI to process raw sensitive data without safeguards;
- treat certificate counts as proof of full organizational transformation;
- make verified achievements public by default;
- expose internal reviewer notes externally;
- allow unrestricted access to proof submissions.
These boundaries protect trust and reduce harm.


### 20.20 Success standard for data safety, consent, and donor visibility

The data safety, consent, and donor visibility model is successful when:

DEC can use learning data, certificates, practical proof, and verified achievements to support capacity learning, course improvement, organizational recognition, and donor dialogue without exposing learners, CSOs, communities, or rights-holders to avoidable risk.

In practical terms, the platform should prevent this:

“A donor can open raw proof files or see sensitive CSO weaknesses without consent.”

And support this:

“A CSO chooses to share a safe summary showing it earned a verified achievement in Outcome Evidence Practice, while the raw submitted document remains private and protected.”


## 21. Workflow States, Gates, and Records

The Workflow States, Gates, and Records section defines how the DEC Learning Hub Course Creator Portal moves a course from initial diagnosis to published learner experience and monitoring evidence.

This section is important because the platform should not behave like a loose collection of pages. It should behave like a governed workflow system where each phase has:

- a clear status;
- a required output record;
- an approval or locking gate;
- a next-phase unlock condition;
- a return/revision path;
- traceability to earlier decisions.
The core principle is:

A course should move forward only when the required record for the current phase is complete, approved or locked, and traceable to the previous phase.

This makes the Course Creator Portal deterministic enough for implementation while still keeping the user experience practical and understandable for non-technical course creators.


### 21.1 Purpose of workflow states, gates, and records

Workflow states, gates, and records exist to make the course creation process reliable.

They help the platform answer:

- Where is this course now?
- What has already been approved?
- What can still be edited?
- What is locked?
- What is blocking the next step?
- Who needs to act next?
- What record proves that the course is ready to move forward?
- If a problem is found later, which phase should reopen?
- Which version did learners actually complete?
Without this logic, the portal could become confusing. Creators may edit approved diagnosis data after Design begins, reviewers may not know which blocks came from the approved storyboard, publishers may release courses before review, and monitoring may not know which course version produced which results.

The workflow system prevents that.


### 21.2 Workflow spine

The main workflow spine is:

Setup → Analysis → Capacity Map → Action Map → Learning Design → Storyboard → Build → Preview → Review → Publish → Learner Runtime → Monitoring and Evaluation

For implementation purposes, these workflow steps can be grouped into six main gated phases:


| Gated phase | Main purpose |
| --- | --- |
| Analysis Gate | Confirms evidence, baseline, root cause, course-fit decision, and Analysis-to-Design Handover |
| Design Gate | Converts approved Analysis into Action Map, Learning Design, Storyboard, and Design-to-Build Handover |
| Build Gate | Converts approved Design into learner-facing course and Build-to-Review Handover |
| Review Gate | Checks quality, safety, alignment, test/certificate logic, and publication readiness |
| Publish Gate | Releases approved course version to learners through authorized publishing |
| Monitoring/Evaluation | Tracks learner activity, certificates, proof, achievements, feedback, and improvement evidence |

This structure should guide route behavior, dashboard labels, progress trackers, and implementation slices.


### 21.3 Core workflow records

Each major phase should produce a record that moves the course forward.


| Phase | Main record | Purpose |
| --- | --- | --- |
| Analysis | Analysis-to-Design Handover | Locks the evidence base and course-fit decision |
| Design | Design-to-Build Handover | Locks the learning design and build plan |
| Build | Build-to-Review Handover | Confirms the built course is ready for review |
| Review | Course Review Record | Confirms approval, return, or specialist review decision |
| Publish | Published Course Record | Records published version, visibility, metadata, and release settings |
| Learner Runtime | Learner Progress / Test / Certificate Records | Records learner completion, final test score, and certificate |
| Practical Proof | Proof Submission / Verified Achievement Records | Records submitted proof, review decision, and badge/achievement |
| Monitoring | Analytics / Feedback / Improvement Records | Records evidence for course improvement and capacity reporting |

These records should preserve traceability. They do not all need to be complex at the beginning, but the platform should be designed so each phase has an explicit output.


### 21.4 Workflow state labels

The platform should use consistent state labels across dashboards, course cards, progress trackers, and internal workflow logic.

Recommended user-facing state labels:


| State label | Meaning |
| --- | --- |
| Draft | Course has been started but no major gate is complete |
| Setup | Basic course information is being prepared |
| Analysis in progress | Diagnosis/Analysis fields are being completed |
| Analysis ready to lock | Required Analysis fields are complete |
| Analysis locked | Analysis-to-Design Handover is approved/locked |
| Design in progress | Capacity Map, Action Map, Learning Design, or Storyboard is being prepared |
| Design ready for approval | Required Design fields are complete |
| Design approved | Design-to-Build Handover is approved |
| Build in progress | Course blocks and learner-facing content are being built |
| Build ready for review | Required blocks, final test, preview, and checks are complete |
| Submitted for review | Course is awaiting reviewer decision |
| Returned for revision | Course has been returned to an earlier phase |
| Approved for publish | Course has passed Review |
| Scheduled | Course is approved and scheduled for release |
| Published | Course is live for learners |
| Revision draft | A published course is being revised |
| Archived | Course is inactive or retired |

These labels should be understandable to course creators. Internal implementation may use more technical enum values, but the user-facing labels should remain clear.


### 21.5 Gate and unlock matrix

Each gate should define what must be completed before the next phase opens.


| Gate | Required record | Required before unlock | Unlocks |
| --- | --- | --- | --- |
| Analysis Gate | Analysis-to-Design Handover | Capacity gap, baseline, desired practice, root cause, K/S/M/E route, course-fit decision, safeguards, evaluation anchor, lock/approval | Capacity Map / Design |
| Design Gate | Design-to-Build Handover | Performance goal, Action Map, Learning Design Document, Storyboard/Block Plan, assessment intent, accessibility/safeguards, AI context, approval | Build Studio |
| Build Gate | Build-to-Review Handover | Required blocks built, added blocks justified, AI outputs reviewed, final test configured, 80% certificate rule confirmed, preview completed, proof setup checked if enabled | Review |
| Review Gate | Course Review Record | Review decision approved, required fixes closed, safety/accessibility/test/certificate checks passed | Publish |
| Publish Gate | Published Course Record | Authorized publisher, metadata complete, visibility set, version assigned, final learner preview confirmed | Learner access |
| Monitoring Activation | Published Course Record | Course is published or scheduled/live | Analytics, feedback, certificate registry, proof tracking |

This matrix should be treated as the high-level workflow contract.


### 21.6 Analysis Gate state logic

The Analysis Gate controls whether a course can enter Design.

Expected state behavior:


| Condition | State / behavior |
| --- | --- |
| Analysis fields incomplete | Analysis in progress |
| Required Analysis fields complete | Analysis ready to lock |
| Knowledge or Skill route selected and course-fit decision is valid | Can lock Analysis |
| Motivation or Environment route selected without separable K/S component | Cannot unlock Design |
| Mixed route selected without explicit K/S component | Cannot unlock Design |
| Analysis locked | Capacity Map / Design unlocks |
| Locked Analysis needs major change | Reopen Analysis and require relocking |
| Review later finds invalid capacity gap | Return to Analysis |

The locked Analysis summary should remain read-only in later phases.


### 21.7 Design Gate state logic

The Design Gate controls whether Build Studio can open.

Expected state behavior:


| Condition | State / behavior |
| --- | --- |
| Analysis is not locked | Design blocked |
| Capacity Map incomplete | Design in progress |
| Action Map incomplete | Design in progress |
| Learning Design Document incomplete | Design in progress |
| Storyboard/Block Plan incomplete | Design in progress |
| Required safeguards unresolved | Design cannot be approved |
| Design-to-Build Handover complete | Design ready for approval |
| Design approved | Build Studio unlocks |
| Major design change after approval | Return to Design and require reapproval |
| Review later finds design-level problem | Return to Design |

The approved Design-to-Build Handover should appear read-only in Build Studio.


### 21.8 Build Gate state logic

The Build Gate controls whether the course can be submitted for Review.

Expected state behavior:


| Condition | State / behavior |
| --- | --- |
| Design is not approved | Build blocked |
| Course shell generated but blocks incomplete | Build in progress |
| Required blocks missing | Build cannot be submitted |
| Creator-added blocks missing purpose/justification | Warning or required fix before Review |
| AI outputs not reviewed | Required fix before Review |
| Final test missing | Required fix before Review |
| Final test threshold not set to 80%+ certificate rule | Required fix |
| Practical proof enabled but safety note missing | Required fix or specialist flag |
| Learner preview not completed | Build cannot be submitted |
| Build-to-Review Handover complete | Build ready for review |
| Submitted | Review opens |

Build should preserve flexibility, but Review submission should require unresolved critical issues to be addressed.


### 21.9 Review Gate state logic

The Review Gate controls whether Publish can open.

Expected state behavior:


| Review decision | State / behavior |
| --- | --- |
| Review not started | Submitted for review |
| Reviewer comments added | Under review |
| Approved for publish | Publish unlocks |
| Approved with minor fixes | Course remains in Review until fixes are closed or admin confirms |
| Return to Build | Build reopens with reviewer comments |
| Return to Design | Design reopens; Build may require reapproval afterward |
| Return to Analysis | Analysis reopens; Design and Build may require revalidation |
| Specialist review required | Publish blocked until resolved |
| Not approved | Course paused, archived, or returned according to admin decision |

Review history should remain visible and should not be lost after revisions.


### 21.10 Publish Gate state logic

The Publish Gate controls learner access.

Expected state behavior:


| Condition | State / behavior |
| --- | --- |
| Review not approved | Publish blocked |
| User lacks publisher/admin role | Publish action hidden or disabled |
| Metadata incomplete | Publish blocked |
| Visibility setting missing | Publish blocked |
| Version not assigned | Publish blocked |
| Final learner preview not confirmed | Warning or required fix |
| Publish now selected | Course becomes live |
| Schedule selected | Course becomes scheduled |
| Pilot selected | Course visible only to pilot group |
| Course published | Monitoring activates |
| Course archived | New enrollment stops; historical records remain |

Publish should create a Published Course Record.


### 21.11 Learner Runtime state logic

Once published, the learner-facing course should have its own runtime states.

Recommended learner course states:


| Learner state | Meaning |
| --- | --- |
| Not started | Learner has access but has not begun |
| In progress | Learner started course |
| Lessons completed | Required course content completed |
| Final test not attempted | Learner has not taken final test |
| Final test attempted | Learner attempted test |
| Not passed | Learner scored below 80% |
| Passed / certificate earned | Learner scored 80%+ and certificate is available |
| Practical proof available | Proof pathway is enabled |
| Proof submitted | Learner submitted proof |
| Proof under review | Proof is being reviewed |
| Revision requested | Learner must revise/redact proof |
| Verified achievement awarded | Proof accepted and badge/achievement issued |
| Completed | Course completion and related actions recorded |

Certificate generation should trigger at 80%+ final test score.


### 21.12 Practical Proof and Verified Achievement states

Practical proof and verified achievement should have their own states, separate from certificate status.

Recommended proof states:


| Proof state | Meaning |
| --- | --- |
| Not enabled | Course does not include proof pathway |
| Available | Learner may submit proof |
| Draft saved | Learner started but did not submit |
| Submitted | Proof submitted |
| Under review | Verifier is reviewing |
| Revision requested | Learner must revise, complete, or redact |
| Accepted | Proof accepted |
| Rejected | Proof does not meet criteria |
| Unsafe / redaction required | Submission contains unsafe data |
| Verified achievement awarded | Badge/achievement issued |
| Withdrawn / removed | Proof removed or withdrawn |

Certificate state should not depend on proof state.


### 21.13 Version states

Published courses should be version-aware.

Recommended version states:


| Version state | Meaning |
| --- | --- |
| Draft version | Course version being prepared |
| Approved version | Passed Review but not published |
| Scheduled version | Approved and scheduled |
| Published version | Live for learners |
| Revision draft | Draft based on a published version |
| Replaced version | Older version replaced by a newer one |
| Archived version | No longer active for new learners |

Learner progress, test scores, certificates, proof submissions, feedback, and achievements should link to the version completed.


### 21.14 Return and revision paths

The workflow should allow courses to move backward when problems are found.

Return paths should be intentional:


| Problem type | Return path |
| --- | --- |
| Missing block, content issue, accessibility issue | Return to Build |
| Performance goal, Action Map, Storyboard issue | Return to Design |
| Wrong capacity gap, target learner group, or K/S/M/E route | Return to Analysis |
| Unsafe proof setup | Return to Build or specialist review |
| Incorrect final test item | Return to Build |
| Incorrect certificate rule | Return to Build / admin correction |
| Publication metadata issue | Return to Publish setup |
| Post-publication improvement | Create revision draft |

Returning to an earlier phase should preserve history and reviewer comments.


### 21.15 Locking and editability rules

The platform should distinguish between editable and locked fields.


| Record / field type | Editability rule |
| --- | --- |
| Draft Analysis fields | Editable by authorized creator/admin |
| Locked Analysis fields | Read-only unless reopened |
| Draft Design fields | Editable until approved |
| Approved Design Handover | Read-only in Build unless reopened |
| Required blocks from Storyboard | Editable for content, but removal/major structural change should warn |
| Creator-added blocks | Editable, but require purpose tag and justification |
| Submitted for Review | Editing limited or disabled until returned |
| Approved for Publish | Editing should be restricted; publish metadata editable by publisher/admin |
| Published course version | Locked; changes through revision draft |
| Certificate record | Should not be casually edited |
| Verified achievement record | Editable only by authorized admin/verifier according to policy |
| Raw proof submission | Restricted access; removal/redaction rules apply |

This prevents accidental changes to approved evidence or published learner records.


### 21.16 Status visibility by role

Different roles should see workflow states differently.


| Role | Should see |
| --- | --- |
| Creator | Course status, next action, returned comments, build warnings, monitoring for own courses |
| Reviewer | Submitted courses, review status, handover records, reviewer attention list |
| Publisher/Admin | Approved courses awaiting publication, metadata, visibility, version state |
| Learner | Course progress, final test status, certificate status, proof status |
| Organization Admin | Safe organization-level course progress, certificates, verified achievements |
| Proof Verifier | Proof submission states and review decisions |
| DEC Admin | Full workflow status across courses |

Internal workflow states should not be exposed unnecessarily to learners.

For example, learners should not see “Design-to-Build Handover approved.” They should see “Course available” or “In progress.”


### 21.17 Audit trail and accountability

The platform should preserve a basic audit trail for important workflow actions.

Recommended audit trail events:

- Analysis locked;
- Analysis reopened;
- Design approved;
- Design returned;
- Build submitted for Review;
- Review decision made;
- Course returned;
- Course approved for Publish;
- Course published;
- Course archived;
- New version created;
- Final test completed;
- Certificate issued;
- Practical proof submitted;
- Proof accepted/rejected;
- Verified achievement awarded;
- Visibility setting changed.
Each event should include:

- user/role;
- date/time;
- action;
- affected record;
- short note or reason where relevant.
This is important for accountability and future maintenance.


### 21.18 Minimum Phase 1 requirements

For Phase 1, workflow states, gates, and records should minimally support:

- Clear course status labels.
- Analysis-to-Design Handover with locking/unlock behavior.
- Design-to-Build Handover with Build unlock behavior.
- Build-to-Review Handover with Review submission behavior.
- Review decision record.
- Publish record and published version state.
- Certificate record at 80%+ final test score.
- Practical proof and verified achievement states where enabled.
- Monitoring records tied to published course version.
- Return paths from Review to Build, Design, or Analysis.
- Published course version locked from direct editing.
- Basic audit trail for major transitions.
- Role-aware visibility and actions.
Advanced workflow automation, multi-review routing, complex approval chains, and full audit compliance can be future enhancements.


### 21.19 Success standard for workflow states, gates, and records

The workflow state system is successful when:

Every course has a clear current state, every phase produces a traceable record, every gate has a clear unlock condition, every return path is understandable, and every learner-facing record connects back to the published course version.

In practical terms, the platform should prevent this:

“The course is somewhere between design and build, but nobody knows what was approved, who changed it, or whether it is ready to publish.”

And support this:

“The Analysis Handover is locked, the Design Handover approved Build, the course was submitted to Review, the reviewer returned two blocks to Build, the creator revised them, the course was approved, the publisher released Version 1, and learner certificates are linked to that version.”


## 22. Implementation Alignment for Codex / AI Coding Agents

The Implementation Alignment section explains how Codex/GPT-5.5 and other AI coding agents should use this developer-facing description and the attached workflow specifications when implementing the DEC Learning Hub Course Creator Portal.

This section is not a technical architecture plan. It does not prescribe exact database tables, component names, API routes, or code patterns unless those are already present in the repo. Codex should inspect the repo and use the existing architecture wherever it is sound.

The purpose of this section is to define the implementation behavior, sequencing, safeguards, and evidence expectations that should guide AI-assisted development.

The core principle is:

Codex should preserve working implementation, align it progressively with the refined DEC workflow, implement in small testable slices, and provide clear evidence after each change.

OpenAI describes Codex as a software engineering agent that can read and edit code, run tests, linters, and type checks, and provide verifiable evidence through terminal logs and test outputs; OpenAI also notes that Codex works best with clear documentation, reliable test setups, and repo guidance such as AGENTS.md. (OpenAI)


### 22.1 Purpose of Codex alignment

The DEC Learning Hub is not being built as a one-off prototype page. It is a workflow platform with connected creator, learner, review, publish, certificate, proof, badge, and monitoring logic.

Therefore, Codex should not be asked to:

- “apply all documents at once”;
- rebuild the platform from scratch;
- replace working routes blindly;
- make large speculative schema changes without planning;
- convert the Build Studio into an unrestricted page builder;
- change the certificate rule;
- implement donor-facing proof visibility before the safety model is ready.
Instead, Codex should implement the refined workflow through controlled slices.

Each slice should have:

- a clear product goal;
- affected workflow area;
- expected files/routes/components;
- acceptance criteria;
- test plan;
- evidence pack;
- known limitations;
- next safe step.
This reduces implementation risk and keeps the platform aligned with DEC’s Phase 1 priorities.


### 22.2 How Codex should treat the specification documents

Codex should treat the developer-facing description and attached specification files as a hierarchy of product guidance.

Recommended interpretation:


| Source | How Codex should use it |
| --- | --- |
| Revised developer-facing description | Integrated product intent, workflow logic, role boundaries, phase connections, and implementation priorities |
| Five refined phase specifications | Detailed requirements for Analysis, Design, Build, Review/Publish, and Monitoring/Evaluation |
| Source-of-truth / override note | Binding corrections, especially certificate rule and Phase 1 boundaries |
| Existing repo specs | Broader product context and previously agreed requirements, unless superseded |
| Existing implementation | Preserve where it already works and aligns |
| Tests and actual route behavior | Use to verify implementation reality |

The implementation should follow the current corrected rule:

80%+ final test score = course pass and automated certificate.

Any older specification wording that says 90% is required for an automated certificate is superseded.


### 22.3 Required repo guidance for AI coding agents

To reduce drift, the repo should include a short AI-agent guidance file, ideally:

AGENTS.md

This file should tell Codex and other agents:

- what the project is;
- where the core workflow specifications are located;
- what commands to run;
- what not to change without approval;
- what the certificate rule is;
- what the Phase 1 scope boundaries are;
- what evidence to provide after changes.
OpenAI notes that Codex can be guided by AGENTS.md files placed in a repository, where teams can tell Codex how to navigate the codebase, which commands to run for testing, and how to follow project practices. (OpenAI)

A minimal AGENTS.md should include:

# DEC Learning Hub — AI Agent Guidance

## Product identity

This repo implements the DEC Learning Hub, including a Course Creator Portal for an EU-funded capacity-building program supporting local CSOs in Ethiopia.

The Course Creator Portal is not a generic LMS or blank-canvas builder. It is a governed, evidence-linked, AI-assisted course creation workflow.

## Core workflow specs

Read:

- docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

- docs/specs/core-workflow/01_ANALYSIS_PHASE.md

- docs/specs/core-workflow/02_DESIGN_PHASE.md

- docs/specs/core-workflow/03_BUILD_PHASE.md

- docs/specs/core-workflow/04_REVIEW_AND_PUBLISH_PHASE.md

- docs/specs/core-workflow/05_MONITORING_AND_EVALUATION_PHASE.md

## Binding rules

- 80%+ final test score = course pass and automated certificate.

- Practical proof / verified achievement / badge is separate from certificate.

- Review and Publish remain separate.

- Build Studio must remain governed and must not become a blank-canvas builder.

- Motivation and Environment gaps do not drive Phase 1 course production unless a separable Knowledge/Skill component is explicitly recorded.

## Development behavior

- Preserve working routes, components, schemas, and tests where possible.

- Do not rebuild from scratch unless explicitly approved.

- Implement in small, testable slices.

- Provide an evidence pack after each implementation.

This file helps prevent repeated re-explanation in every Codex prompt.


### 22.4 Implementation sequencing

Codex should implement the refined workflow in safe, ordered slices.

Recommended sequence:


| Slice | Focus | Why it comes here |
| --- | --- | --- |
| Slice 1 | Analysis Gate Alignment | Establishes the evidence base and course-fit rule |
| Slice 2 | Design Handover Alignment | Converts diagnosis into build-ready learning design |
| Slice 3 | Governed Flexible Build Studio | Enables structured authoring without blank-canvas drift |
| Slice 4 | Final Test + Certificate + Practical Proof / Verified Achievement | Aligns learner completion and higher-level recognition |
| Slice 5 | Review and Publish Upgrade | Strengthens quality gates and controlled release |
| Slice 6 | Monitoring and Evidence Dashboard | Connects learner activity back to capacity evidence and improvement |

This order matters. Build Studio should not be implemented before the Analysis and Design gates are stable, because Build depends on approved Analysis and Design context.


### 22.5 Slice 1: Analysis Gate Alignment

Goal:

Strengthen the existing Diagnosis/Analysis area into a formal Analysis Gate that produces a locked Analysis-to-Design Handover.

Expected behavior:

- preserve existing Setup → Diagnosis → Capacity Map → Action Map flow where possible;
- add or align Analysis-to-Design Handover;
- capture validated capacity gap, baseline, desired practice, root cause, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor;
- allow Knowledge and Skill routes to proceed;
- block Motivation and Environment routes unless separable Knowledge/Skill component is recorded;
- show locked Analysis summary as read-only in Design.
Do not implement in this slice:

- certificate changes;
- Build Studio block library changes;
- practical proof/badge workflow;
- advanced review routing.
Evidence expected:

- files changed;
- route behavior before/after;
- screenshots or local URLs;
- tests for K/S/M/E routing and Design unlock;
- known gaps.

### 22.6 Slice 2: Design Handover Alignment

Goal:

Convert approved Analysis records into build-ready learning design records.

Expected behavior:

- support Capacity Objective and Performance Goal;
- support Capacity Action Map;
- support Learning Design Document;
- support Storyboard and Block Plan;
- support Scenario and Practice Activity Planner where needed;
- generate Design-to-Build Handover;
- block Build until Design handover is approved;
- pass approved design context to Build and AI authoring.
Do not implement in this slice:

- full Build Studio redesign;
- certificate runtime changes;
- donor visibility;
- advanced monitoring.
Evidence expected:

- Design workflow status;
- handover creation;
- Build locked/unlocked behavior;
- read-only Analysis reference;
- tests for required design fields and Build unlock.

### 22.7 Slice 3: Governed Flexible Build Studio

Goal:

Build or align the Build Studio as a governed flexible block authoring workspace.

Expected behavior:

- left-side expandable block library;
- center course canvas;
- right-side properties and governance panel;
- required blocks from Design;
- creator-added blocks;
- purpose tag and justification for creator-added blocks;
- AI review status;
- accessibility and safeguarding notes;
- scope warnings;
- Build-to-Review Handover.
Build Studio must not become a blank-canvas builder.

Creator-added blocks should be allowed, but governed through purpose-linking and review visibility.

Evidence expected:

- screenshots/local URLs of Build Studio;
- list of block categories;
- block metadata behavior;
- added block register;
- scope warnings;
- tests for required vs creator-added logic.

### 22.8 Slice 4: Final Test + Certificate + Practical Proof / Verified Achievement

Goal:

Align learner completion, certification, and applied-capacity recognition.

Expected behavior:

- final test configuration;
- automated scoring;
- certificate issued at 80%+;
- certificate registry/record;
- practical proof submission pathway where enabled;
- proof review status;
- verified achievement/badge record;
- clear separation between certificate and verified achievement.
Binding rule:

Certificate is generated at 80%+ final test score. Practical proof is not required for certificate.

Evidence expected:

- final test flow;
- 79% no certificate / 80% certificate test case;
- learner dashboard certificate state;
- proof submission state;
- badge/achievement record where enabled;
- monitoring linkage.

### 22.9 Slice 5: Review and Publish Upgrade

Goal:

Strengthen Review and Publish as separate, role-sensitive workflows.

Expected behavior:

- Review begins from Build-to-Review Handover;
- reviewers can approve, return to Build, return to Design, return to Analysis, request specialist review, or reject;
- Review validates final test, certificate rule, proof pathway, safeguarding, accessibility, and learner preview;
- Publish remains locked until Review approval;
- only authorized publisher/admin can publish;
- Published Course Record and version created;
- published version becomes learner-visible.
Evidence expected:

- role-sensitive Review and Publish behavior;
- review decision routing;
- publish blocking until approval;
- version record;
- learner access after publication;
- tests and manual verification.

### 22.10 Slice 6: Monitoring and Evidence Dashboard

Goal:

Connect learner runtime data back to capacity evidence and course improvement.

Expected behavior:

- enrollment tracking;
- progress tracking;
- final test attempts and scores;
- certificate issuance at 80%+;
- practical proof status;
- verified achievement status;
- learner feedback;
- course improvement log;
- capacity-area aggregation;
- organization-safe summaries where enabled;
- version-aware reporting.
Evidence expected:

- dashboard screenshots/local URLs;
- sample data flow from learner action to monitoring;
- certificate count at 80%+;
- proof/achievement status;
- version-aware analytics;
- known limitations.

### 22.11 Codex prompting pattern

Each Codex task should follow a plan-first pattern.

Recommended prompt structure:

Please perform a plan-first implementation for [slice name]. Do not code until you have first summarized the plan.

Read:

- [relevant docs]

Goal:

[clear outcome]

Scope:

[what to include]

Out of scope:

[what not to touch]

Acceptance criteria:

[list]

Tests and verification:

[list]

Evidence pack required:

- files changed

- routes affected

- tests run and results

- screenshots/local URLs

- known gaps

- next safe step

For larger slices, Codex should first produce the plan, then wait for approval.

For small safe patches, Codex may plan and implement in one task if explicitly instructed.


### 22.12 What Codex should preserve

Codex should preserve working implementation wherever possible.

It should not unnecessarily replace:

- existing routes;
- layout shell;
- authentication;
- role logic;
- working learner runtime;
- certificate code that already follows the 80% rule;
- existing dashboard components;
- existing schema patterns;
- existing tests;
- styling and brand conventions;
- working review/publish separation.
If Codex believes a refactor is necessary, it should explain:

- why existing implementation is insufficient;
- what will change;
- what could break;
- how it will test the change;
- how it will preserve user-facing behavior.

### 22.13 What Codex should not do without approval

Codex should not do the following without explicit approval:

- rewrite the whole app;
- remove working routes;
- replace the workflow model entirely;
- change certificate threshold away from 80%;
- make practical proof required for certificate;
- merge Review and Publish;
- turn Build Studio into blank-canvas authoring;
- expose raw proof to donors;
- create public CSO rankings;
- add complex donor-facing dashboards before consent/safety logic;
- introduce major schema migrations without plan and rollback awareness;
- add large dependencies without justification;
- implement advanced AI generation flows before human review logic exists.
These restrictions reduce implementation risk.


### 22.14 Evidence pack after each implementation slice

Every Codex implementation should end with an evidence pack.

Minimum evidence pack:


| Evidence item | Purpose |
| --- | --- |
| Plain-language product summary | Explains what changed |
| Files changed | Helps review scope |
| Routes affected | Helps manual testing |
| Schema/data changes | Shows migration or model impact |
| Workflow/state changes | Shows behavior change |
| Role/permission changes | Shows access implications |
| Tests run | Shows technical verification |
| Test results | Shows pass/fail evidence |
| Screenshots or local URLs | Supports human review |
| Manual verification steps | Helps non-technical reviewer test |
| Known gaps | Shows what is not yet done |
| Next smallest safe step | Supports controlled continuation |

Codex should not simply say “completed.” It should show evidence.

OpenAI emphasizes that users should manually review and validate agent-generated code before integration and execution, and that Codex can provide verifiable evidence through terminal logs and test results. (OpenAI)


### 22.15 Testing and verification expectations

Codex should run the relevant verification steps available in the repo.

Depending on the project setup, this may include:

- type check;
- lint;
- unit tests;
- integration tests;
- Playwright or browser tests;
- build;
- database validation;
- route smoke tests;
- manual browser verification;
- screenshot checks.
For DEC-specific workflows, tests should cover product rules such as:

- Analysis cannot unlock Design without a locked handover;
- Motivation/Environment route blocks Phase 1 course production unless separable K/S component exists;
- Build cannot submit to Review if final test is missing;
- certificate is issued at 80%+;
- no certificate below 80%;
- practical proof does not control certificate;
- Review approval unlocks Publish;
- creator cannot publish unless authorized;
- published version is locked;
- learner runtime hides internal creator/reviewer metadata.

### 22.16 Acceptance criteria style

Acceptance criteria should be written as observable product behavior.

Good acceptance criteria:

Given a course with an Environment-only diagnosis,

when the creator attempts to proceed to Design,

then Design remains blocked and the platform explains that a separable Knowledge/Skill component is required.

Given a learner scores 80% on the final test,

when the score is saved,

then the learner passes the course and a certificate record is created.

Weak acceptance criteria:

Improve the workflow.

Make certificates work.

Codex should be given concrete acceptance criteria, not vague goals.


### 22.17 Handling conflicts between documents

When Codex finds conflicting instructions, it should not guess silently.

It should:

- identify the conflict;
- quote or summarize the conflicting rules;
- apply the source-of-truth hierarchy;
- use the latest override where clear;
- ask for approval only if the conflict affects implementation materially.
Known binding correction:

Any “90% certificate” language is superseded. The correct rule is 80%+ final test score = pass and automated certificate.


### 22.18 Implementation style: intent-focused, not over-engineered

The platform should be implemented with enough structure to preserve the DEC workflow, but not with unnecessary engineering complexity.

Codex should avoid overbuilding:

- complex approval engines before basic gates work;
- advanced donor portals before consent rules exist;
- sophisticated AI automation before human review exists;
- complex analytics before runtime events are reliable;
- detailed organizational maturity scoring before verified achievement records are stable.
The desired implementation style is:

simple first, traceable always, safe by default, extensible later.


### 22.19 Human review of Codex work

AI coding agents can speed up implementation, but their work must still be reviewed.

After each Codex task, a human reviewer should check:

- Does the behavior match the DEC workflow intent?
- Did Codex preserve the 80% certificate rule?
- Did it avoid expanding beyond Phase 1?
- Did it preserve Review/Publish separation?
- Did it avoid exposing sensitive data?
- Did tests actually run?
- Do screenshots/local URLs show meaningful user-facing progress?
- Are there hidden TODOs or broken routes?
- Are known gaps clearly stated?
This is especially important because Codex may implement technically valid code that still misses the DEC-specific product intent.


### 22.20 Success standard for Codex implementation alignment

Codex implementation alignment is successful when:

Each AI-assisted development task moves the DEC Learning Hub closer to the refined workflow in a small, reviewable, tested, evidence-backed way, without breaking working functionality, changing binding product rules, or drifting into generic LMS behavior.

In practical terms, Codex should prevent this:

“I updated many files and implemented the new workflow, but the route behavior, certificate rule, role boundaries, and learner runtime are unclear.”

And support this:

“I implemented Analysis Gate Alignment only, preserved existing routes, added the handover lock behavior, verified K/S/M/E routing, ran tests, provided screenshots, listed changed files, and recommended the next safe slice.”


## 23. Phase 1 Core vs Future Enhancements

The Phase 1 Core vs Future Enhancements section defines what should be treated as essential for the first working version of the DEC Learning Hub Course Creator Portal, and what should be reserved for later improvement.

This distinction is important because the platform has a broad long-term vision. It can eventually support advanced capacity diagnostics, rich AI-assisted authoring, donor-facing recognition, organization-level capacity portfolios, advanced analytics, multilingual learning, and deeper CSO ecosystem evidence.

However, Phase 1 should focus on building a strong, usable, governed foundation.

The core principle is:

Phase 1 should deliver the minimum strong version of the full workflow: evidence-based course creation, governed design and build, review, publish, learner completion, certificate at 80%+, optional practical proof/verified achievement, and basic monitoring.

Future enhancements should deepen, automate, or expand the system only after the core workflow works reliably.


### 23.1 Why the distinction matters

Without clear boundaries, the platform may become overbuilt too early.

Overbuilding creates risks:

- Codex may touch too many parts of the repo at once;
- core workflows may remain incomplete while advanced features are partially built;
- the Build Studio may become too complex before Analysis and Design gates are stable;
- donor-facing features may be created before consent and data safety rules are mature;
- dashboards may show attractive charts without reliable learner runtime data;
- AI may generate content before human review controls are working;
- practical proof and badge logic may be confused with course certificates.
The Phase 1 boundary protects focus.

It ensures that the first working version is:

- practical;
- testable;
- coherent;
- safe;
- useful for DEC and course creators;
- aligned with the EU-funded local CSO capacity-building program;
- ready for iterative improvement.

### 23.2 Phase 1 product goal

The Phase 1 product goal is:

A working Course Creator Portal that allows DEC and selected course creators to create evidence-linked, practical, reviewed, published, and monitored CSO capacity-strengthening courses through a governed workflow.

Phase 1 should allow a complete course to move through:

Analysis → Design → Build → Review → Publish → Learner Runtime → Certificate → Optional Practical Proof / Verified Achievement → Monitoring

This full path matters more than advanced features in any single area.

A simpler end-to-end workflow is better than a sophisticated but incomplete platform.


### 23.3 Phase 1 core capabilities

The following capabilities should be treated as core Phase 1 requirements.


| Area | Phase 1 core capability |
| --- | --- |
| Course Creator Dashboard | Creators can see courses, statuses, next actions, returned items, and monitoring summaries. |
| CSO Capacity Framework | Courses are linked to controlled capacity areas, target learner groups, and indicators/standards where available. |
| Analysis Gate | Courses begin from validated capacity gaps, baseline, K/S/M/E route, safeguards, and Analysis-to-Design Handover. |
| Course-fit logic | Knowledge/Skill gaps proceed; Motivation/Environment gaps do not drive Phase 1 courses unless separable K/S component is recorded. |
| Design Phase | Creators define performance goal, Action Map, Learning Design Document, Storyboard, and Design-to-Build Handover. |
| Build Studio | Creators build courses using governed flexible blocks, required vs creator-added logic, purpose tags, and justification. |
| AI Support | AI helps draft and refine block-level content inside approved context, with human review. |
| Final Test | Each certifying course includes a final test aligned with course content and required actions. |
| Certificate | 80%+ final test score triggers automated course certificate. |
| Practical Proof | Relevant courses may include optional/additional proof submission pathway. |
| Verified Achievement / Badge | Accepted practical proof may generate indicator-linked verified achievement or badge. |
| Review Workflow | Courses are reviewed for alignment, quality, AI use, certificate logic, safety, accessibility, and functionality. |
| Publish Workflow | Authorized publisher/admin releases reviewed courses with metadata, visibility, and version record. |
| Learner Runtime | Learners can access published courses, complete lessons, take final tests, receive certificates, submit proof where enabled, and provide feedback. |
| Monitoring | Platform tracks enrollment, progress, final test, certificates, proof, achievements, feedback, and improvement signals. |
| Data Safety | Raw proof is private by default; sensitive data warnings and role-based visibility are applied. |
| Versioning | Published courses have version records; learner data links to the version completed. |

These capabilities define the minimum strong foundation.


### 23.4 Phase 1 should prioritize the workflow spine

Phase 1 should prioritize the complete workflow spine over advanced depth in one feature.

The most important question is not:

Does the platform have every advanced authoring feature?

The most important question is:

Can a course move safely and clearly from evidence-based diagnosis to published learner experience and monitoring evidence?

Therefore, Phase 1 should focus on:

- clear course states;
- reliable phase gates;
- basic but usable forms and workspaces;
- governed Build Studio;
- functioning learner runtime;
- correct certificate rule;
- safe practical proof pathway;
- role-sensitive Review and Publish;
- basic monitoring.
Advanced refinements can come later.


### 23.5 Phase 1 vs future enhancements table


| Platform area | Phase 1 core | Future enhancement |
| --- | --- | --- |
| Analysis / Diagnosis | Structured Analysis-to-Design Handover with capacity gap, baseline, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor | Advanced participatory diagnosis workspace, field data collection, collaborative scoping, scoring models, import from external assessments |
| Master Capacity Gap Bank | Simple approved capacity gap records or controlled diagnosis entries | Full gap bank with prioritization workflow, multi-stakeholder validation, maturity scoring, trend analysis |
| CSO Capacity Framework | Controlled capacity areas, sub-capacity notes, indicator/standard linkage where available | Detailed indicator library, donor framework mapping, maturity levels, automated recommendation engine |
| K/S/M/E Routing | Basic route selection and Phase 1 course-fit rule | Advanced blended intervention routing and referral to coaching, mentoring, grants, policy support |
| Course Creator Dashboard | Course list, status, next action, returned items, monitoring snapshot | Advanced workload management, notifications, team collaboration, personal task board |
| Design Phase | Performance goal, Action Map, Learning Design Document, Storyboard, Design-to-Build Handover | Collaborative design review, advanced templates by capacity area, visual action map editor, peer co-design |
| Build Studio | Three-panel governed flexible authoring with block library, canvas, properties panel, required vs added blocks | Advanced drag-and-drop, real-time collaboration, media studio, branching scenario builder, adaptive learning paths |
| Block Library | Standard categories and sub-blocks with purpose tags | Custom block templates, organization-specific block libraries, reusable pattern library, advanced interactions |
| AI Authoring | Block-level drafting, simplification, quiz draft, human review log | Advanced AI tutor, multilingual generation, automated content QA, AI media creation, personalized learning paths |
| Final Test | Simple automated test with 80%+ certificate rule | Question banks, randomized tests, adaptive assessment, detailed item analysis |
| Certificate | Automated certificate at 80%+ final test score | Advanced verification portal, QR codes, credential integrations, renewal cycles |
| Practical Proof | Optional proof submission with safety guidance and reviewer decision | Advanced portfolio, structured rubric engine, peer review workflow, mentor scoring |
| Verified Achievement / Badge | Basic badge/achievement linked to capacity area/indicator after accepted proof | Full digital badge ecosystem, public badge wallet, renewal/expiry, donor recognition marketplace |
| Review Workflow | Basic review gates, return decisions, review comments | Multi-specialist review routing, SLA tracking, reviewer workload dashboard |
| Publish Workflow | Authorized publish, metadata, visibility, version record | Advanced scheduling, cohort release, multilingual version branching, release approvals |
| Learner Runtime | Published courses, progress, final test, certificate, proof submission, feedback | Offline sync, mobile app, adaptive recommendations, social learning |
| Monitoring | Basic course analytics, certificate counts, proof status, feedback, improvement signals | Advanced dashboards, predictive analytics, cohort comparison, organizational maturity tracking |
| Organization Dashboard | Safe summaries where enabled | Full CSO capacity portfolio, verified achievement profile, action planning tools |
| Donor Visibility | Disabled or limited safe consent-based summaries | Donor-facing portal, verified CSO profiles, opportunity matching, controlled evidence sharing |
| Data Safety | Role-based access, warnings, safe proof rules, private raw proof | Advanced consent management, data retention automation, audit compliance, privacy dashboards |


### 23.6 What should not be overbuilt in Phase 1

The following should not be treated as Phase 1 essentials unless DEC explicitly reprioritizes them.


### 23.6.1 Advanced donor-facing portal

A donor-facing view may be valuable later, but Phase 1 should not rush it.

Reason:

- consent rules need to be mature;
- raw proof must be protected;
- CSOs need control over visibility;
- donor-facing recognition should not become ranking or surveillance.
Phase 1 can prepare safe verified achievement summaries, but full donor portal should be future work.


### 23.6.2 Complex organizational capacity scoring

The platform should not automatically score or certify entire CSOs based only on course completions or badges.

Reason:

- course completion does not equal organizational transformation;
- verified achievements are specific, not total capacity certification;
- organizational capacity scoring requires stronger methodology and validation.
Phase 1 can aggregate evidence by organization and capacity area, but should avoid overclaiming.


### 23.6.3 Fully automated AI course generation

AI should not generate full courses independently.

Reason:

- courses must start from approved Analysis and Design;
- human review is essential;
- AI may invent unsafe or unsupported content.
Phase 1 AI should support block-level drafting and human review.


### 23.6.4 Advanced adaptive learning

Adaptive learning paths, personalized recommendations, and intelligent tutoring can be future enhancements.

Phase 1 should prioritize stable course runtime, progress tracking, final test, certificate, and proof submission.


### 23.6.5 Heavy media production

The Learning Hub should remain low-bandwidth friendly.

Phase 1 should not depend on heavy video production, complex animation, or large media files. Text, templates, checklists, lightweight visuals, and downloadable resources should be prioritized.


### 23.6.6 Complex multi-review automation

Specialist review tracks are important, but Phase 1 does not need a fully automated enterprise approval engine.

Phase 1 should support review decisions and comments. More advanced reviewer assignment, SLA tracking, and review workload management can come later.


### 23.7 What Phase 1 must not compromise

Even if Phase 1 is lean, it must not compromise the following product rules.


| Non-negotiable | Reason |
| --- | --- |
| Evidence-linked course creation | Prevents generic LMS behavior |
| Analysis-to-Design traceability | Keeps courses grounded in capacity needs |
| Knowledge/Skill Phase 1 boundary | Avoids trying to solve systemic problems through courses |
| Design-to-Build handover | Prevents Build from becoming improvised |
| Governed flexible Build Studio | Allows creativity without blank-canvas drift |
| Human review of AI content | Prevents inaccurate or unsafe AI-generated content |
| Final test for certifying courses | Provides course completion standard |
| 80%+ certificate rule | Binding product rule |
| Practical proof separate from certificate | Prevents learner confusion |
| Review and Publish separation | Protects quality and publication control |
| Role-based visibility | Protects sensitive data |
| Raw proof private by default | Protects CSOs and communities |
| Version-aware learner records | Protects evidence integrity |
| Monitoring linked to capacity framework | Supports adaptive learning and reporting |

These should remain stable throughout implementation.


### 23.8 Minimum viable end-to-end demonstration

For Phase 1, a strong demonstration should show one complete course moving through the workflow.

Example demonstration course:

Using Outcome Evidence in CSO Reporting

The demo should show:

- An approved Analysis record with MEAL capacity gap.
- Knowledge/Skill course-fit decision.
- Capacity Map linked to MEAL and outcome evidence.
- Action Map with required learner actions.
- Learning Design Document.
- Storyboard and Block Plan.
- Build Studio with required and creator-added blocks.
- AI-assisted draft marked as human reviewed.
- Final test configured.
- Certificate rule set at 80%+.
- Optional practical proof: outcome evidence worksheet.
- Review comments and approval.
- Authorized Publish.
- Learner completes course.
- Learner scores 80%+ and receives certificate.
- Learner submits optional proof.
- Proof accepted and badge awarded.
- Monitoring dashboard shows enrollment, completion, certificate, proof, verified achievement, and feedback.
This demonstration would prove that the platform is not just a set of pages. It is an end-to-end CSO capacity-strengthening workflow.


### 23.9 Future enhancement principles

Future enhancements should follow four principles.


### 23.9.1 Build from evidence

Enhance areas where Phase 1 usage shows real demand or pain points.

For example:

- if creators struggle with scenarios, improve scenario builder;
- if proof submissions are weak, improve proof guidance;
- if learners drop off on mobile, improve low-bandwidth experience;
- if donors request recognition summaries, strengthen consent-based donor visibility.

### 23.9.2 Deepen before expanding too widely

Before adding many new features, DEC should ensure that existing features work well.

For example, improve Analysis and Design quality before adding advanced AI course generation.


### 23.9.3 Protect CSO trust

Future donor visibility, organization profiles, and capacity evidence dashboards must protect CSO agency and consent.

The platform should support recognition, not surveillance.


### 23.9.4 Keep local CSO usability central

Future enhancements should not make the platform too complex for local CSO course creators or learners.

The interface should remain practical, low-bandwidth friendly, and clear.


### 23.10 Implementation implication for Codex

For Codex/GPT-5.5 implementation, this section means:

- do not implement future enhancements while core Phase 1 workflow is incomplete;
- do not add advanced features just because they are possible;
- prioritize complete workflow functionality;
- preserve existing working implementation;
- implement in safe slices;
- provide evidence after each slice;
- keep certificate logic at 80%+;
- keep proof/badge separate from certificate;
- keep Review and Publish separate;
- protect data safety and consent;
- leave future features as structured extension points, not half-built systems.
Codex should treat future enhancements as planned extension paths, not immediate implementation requirements.


### 23.11 Phase 1 success standard

Phase 1 is successful when:

DEC can create, review, publish, and monitor practical CSO capacity-strengthening courses through a governed workflow, and learners can complete those courses, earn certificates at 80%+, optionally submit practical proof, and receive verified achievements where evidence is accepted.

In practical terms, Phase 1 should avoid this:

“The platform has many advanced screens, but a course cannot reliably move from diagnosis to learner certificate.”

And achieve this:

“A course can move from validated capacity gap to Design, Build, Review, Publish, learner completion, certificate at 80%+, optional proof submission, verified achievement, and monitoring evidence.”


## 24. End-to-End User Journey

The End-to-End User Journey describes how the DEC Learning Hub Course Creator Portal should work from the perspective of the main users: course creator, reviewer, publisher/admin, learner, proof verifier, organization admin, and DEC capacity/M&E lead.

This section is important because the portal is not only a set of features. It is a connected workflow where each user action affects the next stage of course creation, learner experience, certification, verified achievement, and monitoring evidence.

The core principle is:

Each user should experience the platform through a clear role-specific journey, while the system preserves one shared traceability chain from CSO capacity gap to course design, course build, learner completion, certificate, optional verified achievement, and monitoring evidence.


### 24.1 Shared platform journey

At the highest level, the platform journey follows this sequence:

Capacity evidence → Analysis Gate → Design → Build → Review → Publish → Learner Runtime → Certificate → Optional Practical Proof → Verified Achievement → Monitoring → Course Improvement

Each role interacts with a different part of this chain.


| Role | Main journey focus |
| --- | --- |
| Course creator | Turns approved capacity evidence into a course |
| Reviewer | Checks quality, alignment, safety, accessibility, and readiness |
| Publisher/admin | Releases approved course versions and controls visibility |
| Learner | Takes the course, passes the final test, earns certificate, and may submit proof |
| Proof verifier | Reviews practical evidence and awards verified achievement/badge |
| Organization admin | Views safe organization-level learning and achievement summaries |
| DEC capacity/M&E lead | Uses evidence for learning, reporting, adaptation, and capacity strategy |


## 24.2 Course Creator Journey

The course creator journey begins after sign-in and ends when the course is submitted for review, revised if needed, and later monitored after publication.

The creator should experience the portal as a guided workspace, not as a technical admin system.


### 24.2.1 Creator signs in and opens dashboard

After signing in, the creator lands on the Course Creator Dashboard.

They see:

- courses they own or manage;
- course status;
- next required action;
- returned courses;
- submitted courses;
- published courses;
- monitoring snapshots;
- links to guidance and templates.
The creator should immediately understand:

“These are my courses, this is where each course is in the workflow, and this is what I need to do next.”


### 24.2.2 Creator starts from approved capacity evidence

The creator begins a new course from an approved capacity gap or Analysis record.

They do not begin from an unsupported generic topic.

For example, instead of starting with:

“Create a course on MEAL.”

They start with:

“CSO project officers collect activity data but struggle to use outcome evidence in reports and learning discussions.”

The platform displays the Analysis fields:

- capacity gap;
- baseline/current practice;
- desired practice;
- target learner group;
- capacity area;
- root cause;
- K/S/M/E route;
- course-fit decision;
- safeguards;
- evaluation anchor.

### 24.2.3 Creator locks Analysis for Design

The creator or authorized admin completes the Analysis-to-Design Handover.

If the issue is Knowledge or Skill-based, and required fields are complete, the handover can be locked.

If the issue is Motivation or Environment-based, the platform blocks course production unless a separable Knowledge/Skill component is explicitly recorded.

Once locked, the Analysis summary becomes read-only in later phases.

Creator experience:

“The course is now grounded in a validated CSO capacity gap. I can proceed to Design, but I cannot casually change the diagnosis.”


### 24.2.4 Creator develops Capacity Map and Action Map

The creator maps the course to:

- CSO capacity area;
- sub-capacity;
- indicator or standard;
- target learner group;
- desired practice.
Then the creator prepares the Action Map:

- performance goal;
- required learner actions;
- practice activities;
- minimum information.
The platform guides the creator away from broad content and toward practical learner action.

Example:


| Broad idea | Action-mapped version |
| --- | --- |
| Teach accountability | Categorize community feedback and identify safe escalation pathways |
| Teach budgeting | Prepare a basic donor budget justification |
| Teach safeguarding | Apply a referral pathway safely in a realistic scenario |


### 24.2.5 Creator prepares Learning Design and Storyboard

The creator then prepares:

- Learning Design Document;
- Storyboard and Block Plan;
- Scenario and Practice Activity Planner where needed;
- final test intent;
- accessibility and safeguarding requirements;
- optional practical proof idea.
The Design-to-Build Handover consolidates this into a build-ready package.

Creator experience:

“Before I build content, I have a clear design: what learners must do, how they will practice, what they need to know, how they will be assessed, and what safeguards apply.”


### 24.2.6 Creator builds the course

After Design approval, the creator enters the Build Studio.

They see:

- left-side expandable block library;
- center course canvas;
- right-side properties and governance panel;
- approved Design reference;
- required blocks from Storyboard;
- warnings and readiness checks.
The creator builds required blocks first, then may add creator-added blocks where useful.

For each creator-added block, the platform asks for:

- purpose tag;
- linked design element;
- short justification.
Creator experience:

“I can improve the course, but I need to explain why added blocks matter and how they support the approved learning design.”


### 24.2.7 Creator uses AI support

The creator may use AI to draft or improve content.

AI may help with:

- short explainers;
- examples;
- scenario wording;
- feedback;
- test questions;
- plain-language adaptation;
- localization drafts;
- low-bandwidth alternatives.
But AI must use approved course context and must not create new objectives, donor rules, legal advice, unsafe examples, or unsupported claims.

The creator reviews AI outputs and marks them accepted, edited, rejected, or escalated.

Creator experience:

“AI helps me draft faster, but I remain responsible for checking accuracy, relevance, safety, and alignment.”


### 24.2.8 Creator configures final test and optional proof

The creator configures a final test aligned with the course content and required actions.

The certificate rule is visible:

80%+ final test score = course pass and automated certificate.

Where relevant, the creator may configure optional practical proof for a separate verified achievement or badge.

The platform keeps the distinction clear:

- certificate = final test score;
- verified achievement/badge = reviewed practical proof.

### 24.2.9 Creator previews and submits for Review

The creator previews the course in learner mode.

They check:

- course flow;
- block rendering;
- mobile view;
- final test behavior;
- certificate trigger at 80%+;
- proof submission flow if enabled;
- accessibility supports;
- safety warnings;
- downloads;
- completion tracking.
After completing the Build-to-Review Handover, the creator submits for Review.


### 24.2.10 Creator receives feedback and revises

If reviewers return the course, the creator sees:

- reviewer decision;
- required fixes;
- optional suggestions;
- affected phase/block/test/proof item;
- severity;
- resubmission instructions.
The creator revises and resubmits.

Creator experience:

“I know exactly what needs to be fixed and whether I should revise Build, Design, or Analysis.”


### 24.2.11 Creator monitors published course

After publication, the creator can view monitoring for their courses:

- learner enrollment;
- completion;
- final test performance;
- certificates issued;
- drop-off points;
- learner feedback;
- proof submissions;
- verified achievements;
- course improvement alerts.
Creator experience:

“I can see whether learners are using the course, where they struggle, and what should be improved.”


## 24.3 Reviewer Journey

The reviewer journey begins when a course is submitted for Review.

Reviewers may include instructional design reviewers, subject matter experts, capacity leads, safeguarding reviewers, accessibility reviewers, platform/admin reviewers, or proof-pathway reviewers.


### 24.3.1 Reviewer opens review dashboard

The reviewer sees courses assigned or available for review.

Each course shows:

- title;
- version;
- submitted date;
- review track;
- priority;
- capacity area;
- target learner group;
- reviewer attention items.
The reviewer opens the Build-to-Review Handover.


### 24.3.2 Reviewer checks traceability

The reviewer first checks whether the built course remains aligned with:

- Analysis-to-Design Handover;
- Design-to-Build Handover;
- capacity gap;
- learner group;
- performance goal;
- K/S route;
- safeguards;
- evaluation anchor.
Reviewer experience:

“Before checking content quality, I confirm that this is still the course DEC approved for this capacity gap.”


### 24.3.3 Reviewer checks content, blocks, AI, test, proof, and safety

The reviewer checks:

- required blocks are present;
- creator-added blocks are justified;
- content is clear and practical;
- AI-generated content has been human-reviewed;
- practice activities are realistic;
- final test aligns with content;
- certificate threshold is 80%+;
- practical proof is safe and separate from certificate;
- accessibility and low-bandwidth needs are addressed;
- safeguarding and data safety are adequate;
- learner preview works.

### 24.3.4 Reviewer makes decision

The reviewer may:

- approve for publish;
- approve with minor fixes;
- return to Build;
- return to Design;
- return to Analysis;
- request specialist review;
- reject or pause.
Reviewer experience:

“My decision controls whether the course moves forward, returns for revision, or needs specialist attention.”


## 24.4 Publisher / DEC Admin Journey

The publisher or DEC admin controls release to learners.


### 24.4.1 Publisher sees courses approved for publication

The publisher dashboard shows:

- courses approved for Publish;
- metadata completeness;
- review approval status;
- visibility setting;
- version status;
- publication readiness.
Publish remains locked until Review approval exists.


### 24.4.2 Publisher confirms metadata and release settings

The publisher confirms:

- final course title;
- catalog description;
- target learners;
- capacity area;
- language;
- estimated duration;
- certificate setting;
- practical proof/badge setting;
- visibility;
- enrollment method;
- version number;
- publish date.
Publisher experience:

“The course has been reviewed. My role is to release the correct version to the correct learners with the correct settings.”


### 24.4.3 Publisher publishes or schedules course

The publisher may:

- publish now;
- schedule publication;
- publish to pilot;
- keep as approved draft;
- return to Review;
- archive.
Publishing creates a Published Course Record and activates learner runtime and monitoring.


## 24.5 Learner Journey

The learner journey begins after a course is published and made visible or assigned.

Learners may be CSO staff, leaders, board members, volunteers, or other participants.


### 24.5.1 Learner accesses course

The learner sees the course in the catalog, assigned course list, or learner dashboard.

They see:

- course title;
- short description;
- capacity area;
- target learner relevance;
- estimated duration;
- certificate rule;
- practical proof/badge availability if enabled;
- language;
- start button.
Learner-facing language should be simple and practical.


### 24.5.2 Learner completes lessons and activities

The learner moves through the course:

- short explanations;
- examples;
- practice tasks;
- scenarios;
- reflections;
- resources;
- knowledge checks.
They should not see internal creator metadata, reviewer comments, or handover records.

They should experience the course as a clean, accessible, mobile-friendly learning journey.


### 24.5.3 Learner takes final test and receives certificate

The learner takes the final test.

If they score below 80%, they do not pass yet and may review/retake if allowed.

If they score 80% or above, they pass and receive an automated course certificate.

Learner experience:

“I scored 80% or above. I passed the course and my certificate is available.”

The learner does not need to submit practical proof to receive the certificate.


### 24.5.4 Learner submits practical proof where enabled

If practical proof is enabled, the learner may submit evidence of applying the learning.

The platform explains:

- what to submit;
- what not to submit;
- how to anonymize/redact;
- what review criteria apply;
- what badge/achievement may be awarded.
Learner experience:

“My certificate is already earned. I can now submit practical proof for a separate verified achievement.”


### 24.5.5 Learner tracks proof and achievement status

The learner dashboard shows proof status:

- not submitted;
- draft saved;
- submitted;
- under review;
- revision requested;
- accepted;
- rejected;
- unsafe/redaction required;
- verified achievement awarded.
If accepted, the learner sees the badge or verified achievement.


## 24.6 Practical Proof Verifier Journey

The proof verifier reviews applied evidence separately from course certification.


### 24.6.1 Verifier opens proof review queue

The verifier sees proof submissions assigned or pending.

Each submission shows:

- learner or organization;
- course;
- capacity area;
- proof type;
- submission date;
- safety flags;
- review status.

### 24.6.2 Verifier reviews proof safely

The verifier checks:

- whether the proof matches the task;
- whether it demonstrates the required action;
- whether it links to the capacity indicator;
- whether it is complete enough;
- whether it avoids unsafe data;
- whether revision/redaction is needed.
The verifier may:

- accept;
- accept with note;
- request revision;
- reject;
- mark unsafe/redaction required;
- escalate.

### 24.6.3 Verifier awards achievement

If proof is accepted, the verifier awards a verified achievement or badge.

The record links to:

- learner or organization;
- course;
- capacity area;
- indicator/standard;
- proof type;
- verification date;
- visibility setting.
Verifier experience:

“I am not issuing the course certificate. I am validating applied evidence for a separate capacity achievement.”


## 24.7 Organization Admin Journey

Where enabled, organization admins see safe summaries for their CSO.


### 24.7.1 Organization admin views organization dashboard

The organization admin may see:

- staff enrolled;
- courses completed;
- certificates earned;
- verified achievements;
- capacity areas covered;
- recommended next courses;
- proof review statuses where visibility allows.
They should not automatically see sensitive raw proof or learner details beyond the agreed visibility rules.


### 24.7.2 Organization uses evidence for capacity planning

The organization can use safe summaries to understand:

- which staff are completing capacity courses;
- which capacity areas are being strengthened;
- which verified achievements have been earned;
- where more support is needed;
- what evidence may be shared with donors or partners if consented.
Organization experience:

“We can see our learning and verified achievements without exposing unsafe raw documents.”


## 24.8 DEC Capacity / M&E Lead Journey

The DEC capacity or M&E lead uses the platform for learning, adaptation, and reporting.


### 24.8.1 DEC lead views capacity evidence dashboard

The dashboard may show:

- courses by capacity area;
- learners reached;
- organizations reached;
- pass/certificate rates;
- proof submissions;
- verified achievements;
- feedback trends;
- course improvement alerts;
- gaps in course coverage.

### 24.8.2 DEC lead uses evidence for adaptive decisions

The DEC lead may use data to decide:

- which courses need revision;
- which capacity areas need more content;
- which CSOs may need mentoring;
- which proof tasks are too difficult;
- which courses are effective;
- what safe evidence can support donor reporting;
- what should be prioritized next.
DEC experience:

“The platform helps us see learning progress and capacity evidence without overclaiming impact.”


## 24.9 Cross-role journey summary


| Stage | Creator | Reviewer | Publisher/Admin | Learner | Verifier | Org Admin | DEC M&E |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Analysis | Completes/locks evidence | May later check | Oversees | No role | No role | No role | Uses capacity evidence |
| Design | Creates action map/design | May review | Oversees | No role | No role | No role | Checks alignment |
| Build | Builds course | No role yet | Oversees | No role | No role | No role | No role |
| Review | Revises if returned | Reviews | Oversees | No role | No role | No role | No role |
| Publish | Waits for release | Confirms approval | Publishes | Access begins | No role | May see assigned courses | Monitoring begins |
| Runtime | Monitors own course | No role | Oversees | Completes course/test | No role | Views org summary | Tracks evidence |
| Certificate | Sees counts | No role | Oversees registry | Receives at 80%+ | No role | Sees summary | Tracks certificates |
| Proof | Configures pathway | Checks setup | Oversees | Submits proof | Reviews proof | Sees safe status | Tracks proof |
| Achievement | Sees course achievement data | No role unless assigned | Oversees | Receives badge | Awards badge | Sees safe summary | Tracks achievements |
| Monitoring | Improves course | Reviews issues if assigned | Oversees | Provides feedback | Tracks proof queue | Uses org data | Uses dashboard |


## 24.10 Minimum Phase 1 user journey

For Phase 1, the minimum end-to-end user journey should demonstrate:

- Creator signs in and sees course dashboard.
- Creator starts from an Analysis record.
- Creator locks Analysis for Design.
- Creator completes Capacity Map and Action Map.
- Creator creates Learning Design and Storyboard.
- Creator opens Build Studio.
- Creator builds required blocks.
- Creator adds at least one purpose-linked creator-added block.
- Creator uses AI support and marks output reviewed.
- Creator configures final test.
- Creator confirms 80%+ certificate rule.
- Creator enables optional practical proof pathway.
- Creator previews learner experience.
- Creator submits for Review.
- Reviewer returns or approves.
- Publisher publishes approved course.
- Learner completes course.
- Learner scores 80%+ and receives certificate.
- Learner submits optional proof.
- Verifier accepts proof and awards badge.
- Creator/admin sees monitoring evidence.
This minimum journey proves that the platform works as a real CSO capacity-strengthening workflow.


## 24.11 End-to-end success standard

The end-to-end user journey is successful when:

Each role can complete their part of the workflow without confusion, and every action remains connected to the shared traceability chain from CSO capacity evidence to course design, course build, learner completion, certificate, optional verified achievement, and monitoring evidence.

In practical terms, the platform should prevent this:

“Creators build courses, reviewers review something different, learners experience broken or unclear courses, certificates trigger inconsistently, proof is confused with certification, and monitoring cannot explain what capacity was strengthened.”

And support this:

“A creator builds from validated capacity evidence, reviewers check quality and safety, a publisher releases the approved version, learners complete and receive certificates at 80%+, optional proof is verified separately, and DEC can monitor learning and capacity evidence by course, version, organization, and capacity area.”


## 25. Quality Standard for the Platform

The Quality Standard for the Platform defines what the DEC Learning Hub Course Creator Portal must achieve to be considered successful, reliable, and fit for purpose.

The portal should not be judged only by whether pages exist, buttons work, or courses can be published. It should be judged by whether it helps DEC and course creators produce relevant, practical, safe, accessible, reviewed, and evidence-linked CSO capacity-strengthening courses.

The core quality standard is:

The platform is successful when a course can be traced from an evidence-based CSO capacity gap through Analysis, Design, Build, Review, Publish, Learner Runtime, Certificate, optional Verified Achievement, and Monitoring—without becoming generic, unsafe, inaccessible, unreviewed, or disconnected from DEC’s capacity-strengthening purpose.


### 25.1 Strategic quality standard

At the strategic level, the platform should support DEC’s role in the EU-funded local CSO capacity-building program in Ethiopia.

This means the portal should help DEC:

- strengthen local CSO capacities in practical and measurable ways;
- produce learning products grounded in real CSO needs;
- support course creators with structured workflows;
- ensure courses are linked to capacity areas, indicators, and standards;
- protect CSOs, communities, and rights-holders through safe data and safeguarding practices;
- generate credible learning and capacity evidence;
- support adaptive improvement of courses over time;
- avoid generic, donor-fashion-driven, or content-heavy training.
A high-quality platform should make it difficult to create a course that is disconnected from CSO capacity evidence.


### 25.2 Workflow quality standard

The workflow is high quality when each phase has a clear purpose, gate, record, and output.


| Workflow area | Quality standard |
| --- | --- |
| Analysis | Course begins from validated capacity gap, baseline, root cause, K/S/M/E route, safeguards, and evaluation anchor |
| Design | Course has performance goal, Action Map, Learning Design Document, Storyboard, and Design-to-Build Handover |
| Build | Course is built from approved design using governed flexible blocks |
| Review | Course is checked for alignment, quality, safety, accessibility, AI use, final test, and proof logic |
| Publish | Approved course is released only by authorized role with version and visibility settings |
| Learner Runtime | Course renders clearly, works on learner devices, tracks progress, and supports final test/certificate |
| Certificate | Learner receives certificate at 80%+ final test score |
| Practical Proof | Optional applied evidence pathway is safe and separate from certificate |
| Verified Achievement | Badge/recognition is awarded only after proof is reviewed and accepted |
| Monitoring | Evidence links back to Analysis, Design, course version, capacity area, and improvement needs |

The workflow should prevent random course creation and support intentional capacity-strengthening.


### 25.3 Course quality standard

A high-quality DEC Learning Hub course should be:


| Quality dimension | Meaning |
| --- | --- |
| Evidence-linked | Built from a validated CSO capacity gap |
| Action-oriented | Focused on what learners should do better |
| Practical | Uses examples, practice, tools, templates, or scenarios relevant to CSO work |
| Concise | Avoids unnecessary theory and long background content |
| Locally relevant | Reflects Ethiopian/local CSO realities and constraints |
| Safe | Avoids exposing sensitive data or creating safeguarding/civic-space risk |
| Accessible | Mobile-first, low-bandwidth friendly, readable, and inclusive |
| Reviewable | Has clear records, handovers, block purpose, and reviewer comments |
| Assessable | Includes final test aligned with course content and required actions |
| Certifiable | Correctly applies 80%+ certificate rule |
| Verifiable where relevant | Allows optional practical proof and verified achievement where appropriate |
| Monitorable | Generates useful learner, certificate, proof, feedback, and improvement evidence |

The course should help a learner perform a practical task, not only remember information.


### 25.4 Analysis quality standard

The Analysis Gate is high quality when it prevents unsupported course creation.

A strong Analysis record should include:

- clear capacity gap statement;
- target learner group;
- baseline/current practice;
- desired practice;
- evidence source;
- root cause summary;
- CSO capacity area;
- indicator or standard where available;
- K/S/M/E diagnosis;
- course-fit decision;
- safeguards/no-harm note;
- evaluation anchor;
- locked Analysis-to-Design Handover.
The Analysis Gate should reject or route away vague requests such as:

“Create a training on governance.”

It should support specific, evidence-based course ideas such as:

“Board members struggle to identify and document conflict-of-interest situations during decision-making. This is a Skill gap linked to governance and accountability practice.”


### 25.5 Design quality standard

The Design Phase is high quality when it transforms diagnosis into a build-ready learning plan.

A strong Design record should include:

- capacity objective;
- observable performance goal;
- required learner actions;
- practice activities;
- minimum information;
- Learning Design Document;
- Storyboard and Block Plan;
- Scenario/Practice Planner where relevant;
- final test intent;
- optional practical proof idea where relevant;
- accessibility and localization requirements;
- safeguarding/civic-space constraints;
- AI authoring boundaries;
- Design-to-Build Handover.
The Design Phase should prevent this:

“The diagnosis says CSOs need stronger MEAL, so we will build five lessons explaining MEAL theory.”

And produce this:

“The course will help project officers complete a simple outcome evidence worksheet using one indicator and one evidence source. It includes a short explainer, worked example, guided practice, final test, and optional proof submission.”


### 25.6 Build quality standard

The Build Studio is high quality when it allows creators to build effective courses while preserving governance.

A high-quality Build experience should include:

- approved Design reference visible in Build;
- full left-side expandable block library;
- center course canvas;
- right-side properties/governance panel;
- required blocks from Storyboard;
- creator-added blocks with purpose tag and justification;
- AI-assisted drafts with human review status;
- accessibility and safeguarding notes;
- final test configuration;
- 80%+ certificate rule visible;
- optional practical proof pathway where enabled;
- learner preview;
- Build-to-Review Handover.
The Build Studio should prevent this:

“Creators freely add many lessons, videos, and quizzes without showing why they are needed.”

And support this:

“Creators add only useful blocks, link them to required actions or learner support needs, review AI drafts, preview the learner experience, and submit a traceable build package for Review.”


### 25.7 AI quality standard

AI-assisted authoring is high quality when it improves clarity and speed without weakening human control.

AI use should meet these standards:

- AI works from approved Analysis and Design context;
- AI drafts are linked to specific blocks;
- AI does not invent objectives, indicators, legal rules, donor claims, or sensitive examples;
- AI-generated content is reviewed by a human;
- AI use is recorded in the AI Drafting and Review Log;
- AI outputs can be accepted, edited, rejected, or escalated;
- sensitive AI outputs receive specialist review where needed;
- AI does not approve, publish, certify, verify proof, or award badges.
The platform should prevent this:

“AI generated a full course and it was published without review.”

And support this:

“AI drafted a short explainer for an approved block; the creator edited it, confirmed accuracy, and marked it human-reviewed.”


### 25.8 Review quality standard

Review is high quality when it protects relevance, safety, accessibility, and learner usefulness before publication.

A strong review should check:

- alignment with Analysis and Design;
- required and creator-added blocks;
- content accuracy;
- practical relevance;
- AI-generated content;
- final test quality;
- 80%+ certificate rule;
- practical proof and badge logic where enabled;
- safeguarding and data safety;
- accessibility and low-bandwidth readiness;
- learner preview functionality;
- review comments and revision routing.
Review should prevent this:

“A course is published because it looks complete.”

And enforce this:

“A course is published only after alignment, content, assessment, safety, accessibility, and functionality checks are passed.”


### 25.9 Publish quality standard

Publish is high quality when release is controlled, role-sensitive, and version-aware.

A strong Publish workflow should ensure:

- Review approval exists;
- authorized publisher/admin controls release;
- metadata is complete;
- visibility/enrollment settings are correct;
- final learner preview is confirmed;
- certificate rule is correct;
- practical proof/badge setting is correct where enabled;
- Published Course Record is created;
- version number is assigned;
- Monitoring is activated;
- published version is locked from casual editing.
Publish should prevent this:

“A creator finishes editing and the course automatically goes live.”

And support this:

“The course passed Review, an authorized publisher confirmed settings, Version 1 was published, and Monitoring began.”


### 25.10 Learner runtime quality standard

Learner runtime is high quality when the published course works clearly and reliably for learners.

A strong learner experience should include:

- clear course landing page;
- learner-facing course purpose;
- capacity area and relevance explained simply;
- mobile-friendly lesson flow;
- short readable blocks;
- accessible resources;
- low-bandwidth alternatives where needed;
- functioning interactions;
- final test;
- certificate generation at 80%+;
- optional proof submission where enabled;
- safety guidance for proof;
- learner feedback;
- progress tracking;
- no exposure of internal creator/reviewer metadata.
The learner experience should prevent this:

“The course works in the builder but learners cannot complete it or understand what to do.”

And support this:

“The learner can complete the course on a mobile device, take the test, receive a certificate, and optionally submit proof safely.”


### 25.11 Certificate quality standard

Certificate logic is high quality when it is simple, consistent, and not confused with practical proof.

The binding standard is:

80%+ final test score = course pass and automated certificate.

A high-quality certificate system should:

- trigger automatically at 80%+;
- not require practical proof;
- use accurate learner and course details;
- include certificate ID or verification where enabled;
- avoid claiming full organizational capacity;
- link to course version;
- appear in learner dashboard;
- feed Monitoring.
The platform should prevent this:

“The learner passed at 80%, but certificate logic says 90% or requires proof.”

And support this:

“The learner scored 80%+, passed the course, and received the certificate automatically.”


### 25.12 Practical proof and verified achievement quality standard

Practical proof and verified achievement are high quality when they recognize applied capacity safely and separately from certificates.

A strong proof/achievement pathway should include:

- clear proof instructions;
- acceptable proof types;
- anonymization and redaction guidance;
- no unsafe upload requirements;
- review rubric;
- review statuses;
- verifier decision;
- verified achievement or badge linked to capacity area/indicator;
- organization-level visibility where safe;
- donor-safe summary only with consent;
- raw proof private by default.
The platform should prevent this:

“Learners think proof is required for a certificate or upload sensitive documents to get a badge.”

And support this:

“Learners receive certificates through the final test and may separately submit safe proof for verified capacity recognition.”


### 25.13 Monitoring and evaluation quality standard

Monitoring is high quality when it generates useful evidence without overclaiming.

A strong Monitoring and Evaluation function should show:

- enrollment;
- progress;
- completion;
- final test scores;
- certificates issued at 80%+;
- proof submissions;
- proof review outcomes;
- verified achievements;
- learner feedback;
- course improvement signals;
- capacity areas addressed;
- organization-level summaries where safe;
- version-aware reporting.
Monitoring should prevent this:

“We know completion numbers but not what capacity area was strengthened or what needs improvement.”

And support this:

“DEC can see which courses are working, which learners earned certificates, which proof was verified, which capacity areas are being addressed, and which courses should be revised.”


### 25.14 Data safety quality standard

Data safety is high quality when evidence is useful but not harmful.

The platform should ensure:

- data minimization;
- raw proof private by default;
- role-based visibility;
- anonymization guidance;
- consent-based donor visibility;
- no unsafe uploads;
- safeguarding/civic-space caution;
- AI does not process sensitive raw data unnecessarily;
- organization controls external visibility where possible;
- donor summaries are safe and limited.
The platform should prevent this:

“A donor or unauthorized user sees raw proof, sensitive CSO weaknesses, or personal data.”

And support this:

“A CSO can choose to share a safe verified achievement summary while raw proof remains protected.”


### 25.15 Usability quality standard

The portal should be usable by non-technical course creators, reviewers, and learners.

Usability standards include:

- clear workflow labels;
- visible next actions;
- no developer-facing language in user interface;
- readable forms;
- contextual guidance;
- consistent status labels;
- clear warnings;
- clear difference between certificate and verified achievement;
- simple review comments;
- mobile-friendly learner experience;
- dashboard views that prioritize action.
The platform should prevent this:

“Only developers understand what to do next.”

And support this:

“A course creator logs in and immediately knows which course needs attention, what stage it is in, and what to do next.”


### 25.16 Phase 1 quality standard

Phase 1 should be judged by whether the end-to-end workflow works, not by how many advanced features exist.

A high-quality Phase 1 should demonstrate:

- Course starts from Analysis evidence.
- Analysis is locked before Design.
- Design produces build-ready handover.
- Build Studio supports required and creator-added blocks.
- AI-assisted content is human-reviewed.
- Final test is configured.
- Certificate triggers at 80%+.
- Practical proof is optional/additional and separate.
- Course is reviewed before publication.
- Authorized role publishes course version.
- Learner completes course.
- Learner receives certificate.
- Learner submits proof where enabled.
- Proof can be verified and badge awarded.
- Monitoring shows learning and capacity evidence.
The first strong version should be simple, traceable, safe, and usable.


### 25.17 Implementation quality standard for Codex

Codex implementation is high quality when each implementation slice is:

- small enough to review;
- aligned with the latest product rules;
- preserving existing working functionality;
- tested;
- evidence-backed;
- not overbuilt;
- not drifting into generic LMS behavior;
- clear about known gaps.
Each Codex implementation should provide:

- files changed;
- routes affected;
- workflow behavior changed;
- tests run;
- screenshots or manual verification URLs;
- known limitations;
- next safe step.
Codex should prevent this:

“Many files changed, but we cannot tell what product behavior improved.”

And support this:

“Analysis Gate Alignment was implemented; Design is blocked until Analysis is locked; K/S routing works; tests passed; screenshots and changed files are provided.”


### 25.18 Overall success standard

The overall success standard for the DEC Learning Hub Course Creator Portal is:

DEC and its course creators can reliably produce practical, evidence-linked CSO capacity-strengthening courses that move from diagnosis to design, build, review, publish, learner completion, certificate, optional verified achievement, and monitoring evidence—while preserving safety, accessibility, local relevance, role accountability, and implementation traceability.

In one sentence:

The platform succeeds when it helps DEC turn validated CSO capacity gaps into practical learning experiences and credible capacity evidence without becoming generic, unsafe, overbuilt, or disconnected from local CSO realities.

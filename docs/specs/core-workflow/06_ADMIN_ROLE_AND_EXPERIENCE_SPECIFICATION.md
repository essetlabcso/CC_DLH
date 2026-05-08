# DEC Learning Hub Course Creator Portal
# 06 Admin Role and Admin Experience Specification

**Revised deterministic product specification for Phase 1**

---

## Source-of-truth status

This file is the approved Phase 1 source of truth for **Admin role and Admin experience behavior** in the DEC Learning Hub Course Creator Portal.

It should be read together with the core workflow specifications and the relevant annexes, especially:

- `00_CORE_WORKFLOW_INDEX.md`
- `01_ANALYSIS_PHASE.md`
- `02_DESIGN_PHASE.md`
- `03_BUILD_PHASE.md`
- `04_REVIEW_AND_PUBLISH_PHASE.md`
- `05_MONITORING_AND_EVALUATION_PHASE.md`
- `Annex 1: Source-of-Truth and Override Note`
- `Annex 2: Role-Action and Permission Matrix`
- `Annex 3: Workflow State, Gate, and Record Matrix`
- `Annex 8: Final Test and Certificate Specification`
- `Annex 9: Practical Proof, Verified Achievement, and Badge Specification`
- `Annex 10: Review and Publish Decision Routing`
- `Annex 11: Monitoring, Evaluation, and Dashboard Data Specification`
- `Annex 12: Data Safety, Consent, and Visibility Rules`

Where older documents imply a more complex Admin model, this file confirms the simplified Phase 1 decision:

> **Super Admin controls Platform Admin authority. Platform Admins manage day-to-day administration and can publish reviewed and approved courses.**

This file is authoritative for:

- Super Admin and Platform Admin distinction;
- Admin dashboard and Admin navigation;
- user, learner, organization, program, and cohort management;
- lookup/reference table management;
- Admin workflow oversight;
- Review and Publish queue oversight;
- certificate, practical proof, verified achievement, badge, monitoring, and data-safety oversight;
- Admin audit expectations;
- Phase 1 Admin simplification decisions.

It does not replace the detailed phase specifications. Instead, it defines how Admin users govern and operate those workflows.

---

## 1. Purpose of this specification

This specification defines the final product expectations for the **Admin role and Admin user experience** in the DEC Learning Hub Course Creator Portal.

It is written for DEC leadership, product owners, platform managers, and implementation partners. It is also structured so Codex or another AI coding agent can later translate it into development tasks.

This is **not** a technical architecture document. It does not prescribe exact database structures, routes, components, middleware, or API logic. Instead, it defines what DEC should see, control, configure, approve, protect, and monitor through the Admin experience.

The Admin specification is based on:

- the current Admin implementation already present in the repository;
- the uploaded Codex review of existing Admin routes, roles, permissions, lookup tables, and gaps;
- the current Admin frontend screenshots;
- the DEC workflow specifications;
- the deterministic Admin design decisions confirmed by the product owner.

The repository already has an Admin workspace under `src/app/(admin)/admin`, including dashboard, users, organizations, reference data, configuration, field metadata, diagnosis datasets, diagnosis records, audit log, certificates, data safety, and monitoring pages. This specification therefore does not start from zero. It clarifies how the existing Admin foundation should be refined into a clear, complete, deterministic Phase 1 Admin experience.

---

## 2. Core Admin product identity

The Admin area is the **governance, configuration, access, and oversight center** of the DEC Learning Hub Course Creator Portal.

The Admin role exists to keep the platform:

- structured;
- safe;
- configurable;
- role-aware;
- workflow-aware;
- aligned with DEC’s CSO capacity-strengthening model;
- usable by non-technical DEC staff;
- adaptable without requiring developer support for ordinary platform changes.

The Admin role is not only about managing user accounts. It is also about controlling the reference data, workflow governance, publication readiness, learner access, certificates, practical proof, verified achievements, data safety, and monitoring evidence that make the platform credible.

The role-action specification says the platform must be role-aware across creation, review, publication, learning, proof verification, and monitoring, and that users should only see and perform actions appropriate to their role and assignment. The Admin experience is the control center that makes this role separation work in practice.

In simple language:

> The Admin keeps the DEC Learning Hub organized, governed, safe, and adaptable. The Admin controls who can do what, what options appear in the platform, which courses move forward, what becomes learner-visible, and how DEC monitors capacity-strengthening evidence.

---

## 3. Deterministic Admin design decisions for Phase 1

The following five decisions are binding for the revised Admin specification.

### 3.1 Platform Admin creation

**Decision:** Only the **Super Admin** can create, approve, suspend, or remove Platform Admins.

**Phase 1 rule:** Platform Admins can manage operational users such as course creators, reviewers, proof verifiers, organization admins, and learners, but they cannot create other Platform Admins.

### 3.2 Publishing permission

**Decision:** For Phase 1, all **Platform Admins** can publish courses.

**Phase 1 rule:** Platform Admins and Super Admins can publish only after a course has passed Review and reached **Approved for Publish** status. Course Creators and Reviewers cannot publish unless they are also Platform Admins.

**Future option:** A separate Authorized Publisher permission can be added later if DEC needs stricter separation among Admin users.

This keeps implementation simpler while preserving the most important control: Review and Publish remain separate. Review confirms quality and readiness, while Publish controls release, visibility, versioning, and learner access.

### 3.3 Learner / participant management

**Decision:** Platform Admins should manage learners/participants directly in Phase 1.

**Phase 1 rule:** Platform Admins can add, invite, deactivate, reactivate, and assign learners/participants to courses, organizations, programs, or cohorts using simple access controls.

**Future option:** More advanced enrollment features such as bulk import, learner self-registration approval, and organization-led enrollment can be added later.

### 3.4 Lookup/reference table changes

**Decision:** Any Platform Admin can update lookup/reference tables directly.

**Phase 1 rule:** Platform Admins can add, edit, deactivate, and reactivate lookup/reference values without a separate approval workflow. All changes should be recorded in the Admin activity log.

**Safety rule:** Values already used by courses, certificates, proof records, badges, learner records, or monitoring records should not be permanently deleted. They should be deactivated for future use while preserved historically.

The current repo already has Admin-editable lookup/reference tables through `AdminLookupCategory` and `AdminLookupValue`, with seeded values and protections for system categories or locked values.

### 3.5 Workflow gate override

**Decision:** Platform Admins should not have a broad workflow gate override in Phase 1.

**Phase 1 rule:** Platform Admins can return, reopen, reassign, archive, retire, and move courses through allowed workflow actions. Sensitive actions, such as reopening locked Analysis/Design or returning a course to an earlier phase, must require a short reason and be recorded in the Admin activity log.

**Restriction:** Platform Admins cannot silently bypass required gates such as incomplete Analysis, incomplete Design-to-Build handover, incomplete Build-to-Review handover, missing final test, unresolved Review approval, or missing publish metadata.

The workflow matrix defines specific gate unlock conditions for Analysis, Design, Build, Review, and Publish, including that Publish unlocks only after Review approval, authorized publish action, metadata completion, visibility/enrollment settings, version assignment, and Published Course Record creation.

---

## 4. Admin role model

The platform should support two Admin levels.

### 4.1 Super Admin

The **Super Admin** is the highest-level platform authority.

This role controls who can become a Platform Admin. It should be held by very few trusted people.

#### Super Admin purpose

The Super Admin protects the highest-level control of the platform.

#### Super Admin can

- create Platform Admins;
- approve Platform Admin access;
- suspend Platform Admins;
- remove Platform Admin access;
- view all Platform Admins;
- see major Admin activity;
- intervene in serious access or governance issues;
- protect the platform from unauthorized control.

#### Super Admin cannot be bypassed for

- creating Platform Admins;
- restoring suspended Platform Admins;
- removing Platform Admin authority;
- future emergency override authority, if this is added later.

#### Super Admin should not normally be responsible for

- daily course management;
- routine course review;
- routine lookup/reference table updates;
- routine learner assignment;
- routine proof queue management;
- routine monitoring review.

The Super Admin may perform these actions if necessary, but the role’s main purpose is high-level platform control.

### 4.2 Platform Admin

The **Platform Admin** is the main day-to-day operational Admin role.

There can be several Platform Admins. In Phase 1, they should have the same broad operational authority, except that they cannot create other Platform Admins.

The current repo uses a legacy broad `admin` role, while scoped role definitions such as `PLATFORM_ADMIN`, `COURSE_CREATOR`, `COURSE_REVIEWER`, `AUTHORIZED_PUBLISHER`, `PRACTICAL_PROOF_VERIFIER`, and others already exist but are not yet fully wired into Admin route access. The product direction is to treat Platform Admin as the operational Admin identity for Phase 1, while preserving future room for more granular scoped permissions.

#### Platform Admin can

- manage operational users;
- manage learners/participants;
- assign roles;
- assign users to organizations, courses, programs, and cohorts;
- manage lookup/reference tables;
- manage organizations;
- manage diagnosis datasets and diagnosis records;
- view and use workflow field metadata;
- view all courses across workflow states;
- manage review and publish queues;
- publish courses after Review approval;
- view certificate registry;
- view and manage proof/data safety oversight;
- view monitoring and capacity evidence;
- view Admin activity log;
- make allowed return/reopen/reassign actions with reasons.

#### Platform Admin cannot

- create or approve other Platform Admins;
- silently bypass workflow gates;
- publish courses that have not passed Review;
- delete lookup values already used by records;
- expose raw proof externally by default;
- change binding rules such as the 80% certificate rule;
- treat certificates as proof of full organizational transformation;
- make donor-facing raw evidence visible.

---

## 5. Existing Admin foundation to preserve and refine

The current implementation already includes important Admin foundations that should be preserved and strengthened.

### 5.1 Existing Admin pages

The Admin workspace already includes:

- `/admin` dashboard;
- `/admin/users`;
- `/admin/organizations`;
- `/admin/reference-data`;
- `/admin/config`;
- `/admin/config/lookups`;
- `/admin/field-metadata`;
- `/admin/diagnosis-datasets`;
- `/admin/diagnosis-records`;
- `/admin/audit-log`;
- `/admin/certificates`;
- `/admin/data-safety`;
- `/admin/monitoring`.

These should remain the foundation of the Admin experience.

### 5.2 Existing Admin capabilities

The current implementation already includes:

- Admin-editable lookup/reference data;
- user role management;
- organization creation and membership management;
- certificate viewing, revocation, and reactivation;
- data-safety oversight for proof/redaction/external visibility;
- badge/verified achievement safe summary handling;
- read-only aggregate Admin monitoring;
- Admin audit logging.

These should be treated as Phase 1 assets, not discarded.

### 5.3 Existing implementation gaps to resolve

The major gaps are:

- no distinct Super Admin role;
- legacy Admin is a single broad role;
- Platform Admin exists conceptually in scoped roles but is not fully wired as the actual Admin tier;
- no explicit distinction between Super Admin controls and Platform Admin operations;
- no Super Admin-only Platform Admin management;
- no full two-level Admin governance model;
- some reference values still appear code-defined outside Admin lookup tables;
- publishing, data safety, users, and monitoring are not yet split conceptually by Super Admin vs Platform Admin authority.

For Phase 1, the solution should be practical, not overbuilt:

> Preserve the broad Platform Admin operational role, add Super Admin control over Platform Admin authority, and avoid unnecessary granular permission complexity until later.

---

## 6. Admin landing experience

When a Platform Admin signs in, they should land on the **Admin Control Center**.

The current Admin dashboard already uses the title “Admin Control Center” and focuses on platform governance overview, configuration health, readiness status, Admin areas, and governance reminders. The revised Admin landing page should build on this, but become more action-oriented and complete.

### 6.1 Purpose of Admin Control Center

The Admin Control Center should answer:

> What needs Admin attention today?

It should not only show counts. It should show the most important actions, warnings, and operational priorities.

### 6.2 Admin dashboard sections

The Admin dashboard should include the following sections.

#### A. Platform Governance Overview

Shows a short explanation of what the Admin controls:

- users;
- organizations;
- reference data;
- diagnosis records;
- workflow fields;
- review/publish readiness;
- data safety;
- certificates;
- proof and badges;
- monitoring evidence.

#### B. Action Required

Shows items needing Admin action:

- users without roles;
- invited users pending activation;
- courses waiting for review assignment;
- courses approved for publish;
- proof submissions needing verifier assignment;
- data-safety flags;
- lookup/reference issues;
- courses with blocked publish readiness;
- certificates requiring Admin attention;
- organization membership issues.

#### C. Configuration Health

Shows readiness of:

- reference data;
- workflow metadata;
- diagnosis datasets;
- diagnosis records;
- organization records;
- course setup connection;
- data safety oversight;
- monitoring data.

#### D. Workflow Status

Shows course counts by state:

- Draft / Setup;
- Analysis in progress;
- Analysis locked;
- Design in progress;
- Build in progress;
- Submitted for Review;
- Returned;
- Approved for Publish;
- Published;
- Archived / Retired;
- Revision needed.

#### E. Admin Areas

Provides cards linking to:

- Users & Roles;
- Organizations;
- Reference Data;
- Diagnosis Datasets;
- Diagnosis Records;
- Workflow Field Metadata;
- Review Queue;
- Publish Queue;
- Certificates;
- Practical Proof & Badges;
- Data Safety & Visibility;
- Monitoring & Capacity Evidence;
- Audit Log.

#### F. Governance Reminders

Shows short reminders:

- Only Super Admin can create Platform Admins.
- Platform Admins can publish only after Review approval.
- Reference values in use should be deactivated, not deleted.
- Raw proof is private by default.
- Practical proof is separate from certificate.
- 80%+ final test score triggers certificate.
- Workflow gates should not be silently bypassed.

---

## 7. Admin navigation

The final Admin navigation should be clear and non-technical.

Recommended navigation:

1. Dashboard
2. Users & Roles
3. Organizations
4. Programs & Cohorts
5. Reference Data
6. Diagnosis Datasets
7. Diagnosis Records
8. Workflow Field Metadata
9. Courses & Workflow
10. Review Queue
11. Publish Queue
12. Certificates
13. Practical Proof & Badges
14. Data Safety & Visibility
15. Monitoring & Capacity Evidence
16. Audit Log
17. Settings

If not all pages exist immediately, the navigation can show only active Phase 1 pages and add the rest as future-ready sections.

---

## 8. Users & Roles

The **Users & Roles** area should allow Platform Admins to manage operational users and learners directly.

The current implementation already allows Admins to update membership roles and includes protection against removing one’s own Admin access. This should be preserved and refined.

### 8.1 User list

The user list should show:

- name;
- email;
- organization;
- current role(s);
- status;
- assigned courses;
- assigned program/cohort;
- last activity;
- invitation status;
- Admin actions.

Filters should include:

- role;
- organization;
- status;
- unassigned users;
- invited users;
- learners/participants;
- creators;
- reviewers;
- proof verifiers;
- Platform Admins.

### 8.2 Add or invite user

Platform Admins should be able to:

- add existing user to organization/course/program/cohort;
- invite a new user;
- assign role;
- assign organization;
- assign access area;
- record reason where appropriate.

The current organization membership manager already supports adding an existing user or inviting a new user and requires a reason for adding. This pattern should be used consistently across Admin user management.

### 8.3 Roles available to Platform Admin

Platform Admins should be able to assign:

- Learner / Participant;
- Course Creator;
- Reviewer;
- Practical Proof Verifier;
- Organization Admin / CSO Focal Person;
- Facilitator, if used;
- Program/M&E viewer or manager, if used;
- Safe Dashboard Viewer, if used.

Platform Admins should not be able to create or approve Platform Admins.

### 8.4 Super Admin management

Super Admin should have a dedicated view for Platform Admin management:

- Platform Admin list;
- create/approve Platform Admin;
- suspend Platform Admin;
- remove Platform Admin access;
- view last activity;
- view high-risk Admin changes.

This can be simple in Phase 1.

### 8.5 Learner / participant management

Platform Admins should directly manage learners in Phase 1.

They should be able to:

- add learner;
- invite learner;
- assign learner to organization;
- assign learner to course;
- assign learner to program/cohort;
- deactivate/reactivate learner;
- view learner enrollment/access status;
- view learner certificate status where appropriate;
- view learner proof status where appropriate and safe.

Avoid overbuilding in Phase 1:

- no complex self-registration approval required;
- no advanced bulk import required unless easy;
- no organization-led enrollment required yet;
- no advanced learner segmentation required yet.

---

## 9. Organizations

The **Organizations** area should manage CSOs and their members.

The current implementation already supports organization creation/update and membership management. This should remain a major Admin function.

### 9.1 Organization list

The organization list should show:

- organization name;
- organization type;
- geographic focus;
- status;
- number of members;
- number of learners;
- assigned courses;
- program/cohort participation;
- certificates summary;
- verified achievements summary;
- data visibility status.

### 9.2 Organization detail page

The organization detail page should show:

- organization profile;
- members;
- roles;
- learners;
- courses assigned;
- diagnosis records linked;
- certificates;
- practical proof submissions;
- verified achievements;
- safe monitoring summary;
- consent/visibility status;
- Admin activity related to the organization.

### 9.3 Organization member management

Platform Admins should be able to:

- add existing user to organization;
- invite new user to organization;
- assign member roles;
- deactivate membership;
- update membership;
- record reason for sensitive changes.

### 9.4 Organization Admin / CSO focal person

The platform may use a role such as Organization Admin or CSO Focal Person.

This user should see only safe organization-level summaries, not raw proof or sensitive platform-wide data.

Data safety guidance says practical proof, safeguarding-related content, civic-space content, and organizational capacity evidence require stronger safeguards than ordinary course progress data.

---

## 10. Programs & Cohorts

This area may be simple in Phase 1 but should be included in the Admin specification because access may need to be organized by program or cohort.

### 10.1 Program management

Platform Admins should be able to manage:

- program name;
- description;
- partner/funder reference;
- linked organizations;
- linked courses;
- assigned creators;
- assigned reviewers;
- participants;
- start/end date;
- status.

### 10.2 Cohort management

Platform Admins should be able to manage:

- cohort name;
- course;
- program;
- assigned participants;
- assigned organization(s);
- start/end date;
- access window;
- facilitator, if used;
- status.

### 10.3 Phase 1 simplification

For Phase 1, cohort/program management can be simple:

- assign participants to a course;
- group them under a program/cohort label;
- allow filtering in dashboards.

Advanced cohort automation can wait.

---

## 11. Reference Data

Reference Data is one of the most important Admin areas.

The platform should allow DEC to manage controlled options without developer support.

The current seed data includes categories such as geographic focus areas, K/S/M/E routes, course-fit decisions, delivery formats, access types, and enrollment methods. Course setup options are already partially read from lookup tables.

### 11.1 Purpose

Reference Data should allow Platform Admins to manage approved dropdown/reference values used across:

- Course Setup;
- Analysis;
- Design;
- Build;
- Review;
- Publish;
- Learner access;
- Certificates;
- Practical Proof;
- Badges;
- Monitoring;
- Data Safety.

### 11.2 Reference Data page structure

The page should group reference tables by workflow area.

#### Setup reference tables

- geographic focus;
- Ethiopian regions;
- organization types;
- course languages;
- delivery formats;
- access types;
- enrollment methods;
- target learner groups;
- participant experience levels;
- course duration/effort options.

#### Analysis reference tables

- capacity areas;
- sub-capacity / capacity practice areas;
- evidence source types;
- K/S/M/E routes;
- course-fit decisions;
- safeguard categories;
- evaluation anchor types.

#### Design reference tables

- performance goal types;
- action categories;
- practice activity types;
- scenario types;
- assessment approaches;
- accessibility/localization options.

#### Build reference tables

- block purposes;
- block categories;
- AI use types;
- safeguarding notes;
- accessibility checklist items;
- proof configuration values.

#### Review/Publish reference tables

- review tracks;
- review decision options;
- return reasons;
- specialist review types;
- visibility settings;
- publish statuses;
- archive/retire reasons.

#### Monitoring/reference tables

- feedback categories;
- certificate status reasons;
- proof status reasons;
- badge categories;
- improvement flags;
- monitoring indicator groups.

### 11.3 Actions Platform Admin can take

Platform Admins can:

- add value;
- edit value;
- deactivate value;
- reactivate value;
- reorder values;
- add description/help text;
- mark visible/not visible to creators;
- mark visible/not visible to learners, if relevant;
- see where a value is used.

### 11.4 Safety rules

- Do not permanently delete values already used by existing records.
- Use deactivate instead of delete.
- Log all changes.
- Show warning when editing values used by active courses.
- System-locked values should require stronger restriction.
- K/S/M/E and certificate-critical values should be especially protected.

### 11.5 UX expectation

The Reference Data page should be easy for non-technical Admins:

- left side: category groups;
- center: list of values;
- right side: selected value details;
- clear Add/Edit/Deactivate buttons;
- visible status badges: Active, Inactive, System, Locked, Used;
- plain-language warning messages.

---

## 12. Diagnosis Datasets and Diagnosis Records

The current Admin foundation includes diagnosis datasets and diagnosis records. These should remain central because the DEC Learning Hub should not create courses from a blank page.

### 12.1 Diagnosis Datasets

Admin should use this area to manage approved diagnosis sources.

A diagnosis dataset may represent:

- a capacity assessment source;
- a CSO diagnostic workbook;
- a program assessment;
- a partner-provided needs analysis;
- a validated evidence source.

Admin should be able to:

- add dataset;
- edit dataset metadata;
- mark dataset approved;
- archive dataset;
- link records to dataset;
- see number of diagnosis records inside it.

### 12.2 Diagnosis Records

Admin should use this area to manage approved capacity gap records.

A diagnosis record should show:

- organization/program;
- capacity area;
- sub-capacity;
- gap statement;
- baseline/current practice;
- desired practice;
- evidence source;
- K/S/M/E route;
- course-fit decision;
- safeguards;
- evaluation anchor;
- course creation status.

### 12.3 Admin actions

Platform Admins should be able to:

- approve/configure diagnosis records;
- make diagnosis records available for course setup;
- archive invalid records;
- correct metadata with reason;
- prevent non-course gaps from being pushed into course creation unless a K/S component is recorded.

The K/S/M/E routing rules state that Knowledge and Skill gaps can proceed to Phase 1 course design, while Motivation and Environment gaps are blocked by default unless a separable Knowledge/Skill component is recorded.

---

## 13. Workflow Field Metadata

The current Admin foundation includes a read-only workflow field registry.

### 13.1 Purpose

Workflow Field Metadata should help Admins see which core fields exist across the governed workflow.

It should support transparency around:

- required fields;
- workflow phase;
- field purpose;
- editability;
- role visibility;
- safety relevance;
- whether field is connected to dashboard/reporting.

### 13.2 Phase 1 behavior

For Phase 1, this can remain mostly read-only.

Platform Admins should be able to view:

- workflow field name;
- workflow phase;
- whether required;
- whether visible to creators/reviewers/admins;
- whether learner-visible;
- whether dashboard-relevant;
- whether sensitive.

Future versions may allow Super Admin or advanced Platform Admin configuration.

---

## 14. Courses & Workflow

The Admin should have a clear view of all courses across workflow states.

### 14.1 Course workflow list

The Admin should see:

- course title;
- owner/creator;
- organization/program;
- capacity area;
- current workflow stage;
- status;
- assigned reviewer;
- publish readiness;
- last updated;
- next required action;
- blocker/warning.

### 14.2 Filters

Filters should include:

- status;
- workflow phase;
- creator;
- reviewer;
- organization;
- program/cohort;
- capacity area;
- returned courses;
- approved for publish;
- published courses;
- courses needing attention.

### 14.3 Course detail view

Admin course detail should show:

- setup summary;
- diagnosis link;
- capacity area;
- K/S/M/E route;
- course-fit decision;
- analysis/design/build status;
- review history;
- publish status;
- certificate configuration;
- proof/badge setup;
- learner access settings;
- monitoring summary;
- Admin actions available.

### 14.4 Admin workflow actions

Platform Admins can:

- assign/reassign course owner;
- assign/reassign reviewer;
- return course to earlier phase through allowed route;
- reopen course where allowed;
- archive/retire where allowed;
- publish after Review approval;
- view course monitoring;
- view audit trail.

Platform Admins cannot silently bypass gate requirements. Return paths and revalidation rules should follow the workflow matrix: Build issues return to Build, design logic issues return to Design, and capacity gap or K/S/M/E issues return to Analysis.

---

## 15. Review Queue

The Review Queue should help Admins manage courses submitted for review.

### 15.1 Review Queue list

Show:

- course title;
- submitted by;
- submission date;
- capacity area;
- review status;
- required review track;
- assigned reviewer;
- unresolved comments;
- specialist flags;
- next action.

### 15.2 Platform Admin actions

Platform Admins can:

- view queue;
- assign reviewer;
- reassign reviewer;
- add specialist reviewer if needed;
- view review comments;
- see return decision;
- see courses approved for publish;
- return/reopen through allowed actions with reason.

### 15.3 Review decision options

The platform should support:

- Approve for Publish;
- Approve with minor fixes;
- Return to Build;
- Return to Design;
- Return to Analysis;
- Specialist Review Required;
- Not Approved / Pause.

The Review and Publish routing annex defines these review decision options and states that the platform should record the reviewer decision and route the course accordingly.

### 15.4 Review tracks

The platform should logically support:

- Instructional Design Review;
- Subject Matter Review;
- Capacity Alignment Review;
- Safeguarding / Civic-Space Review;
- Accessibility / Localization Review;
- Platform / Admin Review;
- Practical Proof Review Setup.

In Phase 1, some tracks can be handled by the same Platform Admin or reviewer, but the logical distinction should remain visible.

---

## 16. Publish Queue

The Publish Queue is where Platform Admins release reviewed courses.

### 16.1 Publish Queue list

Show:

- course title;
- approved date;
- approved by;
- version;
- metadata readiness;
- visibility setting;
- enrollment/access setting;
- final preview status;
- practical proof safety status;
- publish action.

### 16.2 Platform Admin publishing rule

All Platform Admins can publish in Phase 1, but only if:

- course status is Approved for Publish;
- required metadata is complete;
- visibility/access setting is selected;
- version is assigned;
- final test/certificate setup is valid;
- practical proof setup is safe if enabled;
- no blocking specialist review remains unresolved.

The Review/Publish annex states that publisher/admin view should show approved courses awaiting publication, metadata readiness, visibility settings, version fields, final preview, and publish/schedule/pilot/archive actions.

### 16.3 Publish should be blocked if

- Review approval is missing;
- required fixes are open;
- specialist review is unresolved;
- final test is missing for certifying course;
- certificate threshold is not 80%+;
- practical proof is incorrectly required for certificate;
- proof pathway lacks safety warning;
- raw proof is donor-facing by default;
- badge wording overclaims;
- learner preview failed;
- course metadata is incomplete.

### 16.4 Publish actions

Platform Admin can:

- publish now;
- schedule publish, if supported;
- pilot publish, if supported;
- archive;
- retire;
- create revision path.

For Phase 1, **Publish Now** and **Archive/Retire** are enough if scheduling is not ready.

---

## 17. Certificates

The Admin should have certificate oversight.

The current implementation already includes Admin certificate viewing, revocation, and reactivation.

### 17.1 Certificate Registry

Show:

- certificate ID;
- learner name;
- organization;
- course;
- version;
- final test score;
- issue date;
- status;
- revoked/reactivated status if applicable;
- reason/history.

### 17.2 Admin actions

Platform Admin can:

- view certificate records;
- filter/search certificates;
- revoke certificate with reason, if policy allows;
- reactivate certificate with reason;
- view certificate audit history.

### 17.3 Binding certificate rule

The certificate rule must remain:

> Final test score of 80% or above = course pass and automated certificate.

Practical proof is separate from certificate. AI, proof verifiers, reviewers, or Admins should not require practical proof before certificate issuance.

The proof and badge specification confirms that certificate, proof submission, accepted proof, and organization recognition are separate evidence layers.

---

## 18. Practical Proof & Badges

The Admin should oversee practical proof and verified achievements without confusing them with certificates.

### 18.1 Proof queue

Show:

- proof submission;
- learner;
- organization;
- course;
- course version;
- capacity area;
- proof status;
- assigned verifier;
- safety flag;
- revision/redaction status;
- badge/achievement outcome.

### 18.2 Platform Admin actions

Platform Admin can:

- view proof queue;
- assign verifier;
- reassign verifier;
- view safe proof status;
- resolve data safety flags where authorized;
- revoke external visibility;
- monitor badge/achievement records;
- ensure raw proof remains private by default.

The current Admin data-safety page can resolve specialist review/redaction flags and revoke external visibility, while badge metadata and safe achievement summaries already exist.

### 18.3 Proof review decisions

Verifier/Admin where authorized can mark:

- accepted;
- revision requested;
- rejected;
- unsafe/redaction required;
- escalated.

### 18.4 Safety rule

Raw proof is private by default.

Donor or external visibility, if enabled, should use safe, consent-based summaries only. Raw proof should not be externally visible by default. The data safety specification states that raw learner submissions and practical proof are private by default, and external visibility requires explicit permission and safe summary formatting.

### 18.5 AI restriction

AI must not:

- verify proof;
- decide proof outcome;
- award badges;
- summarize raw proof externally;
- create donor-facing claims from raw proof.

The practical proof specification explicitly states that AI must not verify proof, decide review outcome, award badges, summarize raw proof externally, or remove human review.

---

## 19. Data Safety & Visibility

The Admin must protect sensitive data and control visibility.

The current implementation already includes an Admin data-safety page for sensitive proof submissions and external visibility.

### 19.1 Data Safety page should show

- proof submissions requiring review/redaction;
- external visibility enabled items;
- donor-safe summaries;
- unsafe/sensitive flags;
- visibility changes;
- consent status where available;
- high-risk data categories.

### 19.2 Admin actions

Platform Admin can:

- revoke external visibility;
- resolve redaction/specialist flags;
- mark unsafe data for restricted handling;
- ensure donor-safe summaries exclude raw proof;
- view visibility audit history.

### 19.3 Visibility levels

Recommended levels:

- private to learner;
- private to learner and assigned verifier;
- restricted DEC Admin;
- organization summary;
- donor-safe summary;
- public visibility, future option only.

### 19.4 Donor visibility rule

For Phase 1, donor visibility should remain disabled or summary-only.

Donors should not see:

- raw proof;
- learner personal details;
- reviewer private notes;
- sensitive organizational weaknesses;
- safeguarding/protection details;
- civic-space/political details.

The source guidance states that donors may see safe, consent-based summaries of verified achievements and capacity areas, but not raw proof, sensitive learner data, internal reviewer comments, or unsafe organizational details.

---

## 20. Monitoring & Capacity Evidence

The Admin should have a monitoring dashboard that is useful but safe.

The current Admin monitoring page shows aggregate counts for total learners, total certificates, proofs under review, and verified achievements, and explains that raw proof and sensitive data are safely omitted.

### 20.1 Monitoring dashboard should show

#### Platform metrics

- total learners;
- total certificates;
- proofs under review;
- verified achievements;
- published courses;
- organizations reached;
- active cohorts/programs if used.

#### Capacity evidence

- verified achievements by capacity area;
- certificates by capacity area;
- courses by capacity area;
- organizations reached by capacity area.

#### Course performance

- enrollments;
- starts;
- completions;
- final test pass rate;
- certificates;
- feedback;
- proof submissions;
- improvement flags.

#### Proof and badge monitoring

- proof enabled courses;
- proof submissions;
- proof under review;
- accepted proof;
- rejected proof;
- revision requested;
- unsafe proof;
- badges awarded.

The practical proof specification says monitoring should track proof and achievements separately from certificates, including proof submissions, proof under review, accepted proof, rejected proof, unsafe proof, verified achievements, achievements by capacity area, and achievements by organization.

### 20.2 Monitoring safety rule

Monitoring should not become surveillance.

Admin dashboards should avoid exposing unnecessary raw evidence or sensitive details. Monitoring should help DEC improve courses, support CSOs, and understand safe capacity evidence.

The data safety guidance states that monitoring dashboards should use aggregation and role-based visibility, and that monitoring should help DEC and CSOs learn, improve courses, and recognize capacity progress safely rather than becoming a surveillance tool.

---

## 21. Audit Log

The Admin Audit Log is a core governance feature.

The current implementation already records Admin audit logs for actions such as role updates and organization creation.

### 21.1 Audit Log should record

- user/role changes;
- Platform Admin creation/removal by Super Admin;
- organization changes;
- reference data changes;
- diagnosis dataset/record changes;
- workflow reopen/return actions;
- publish actions;
- archive/retire actions;
- certificate revocation/reactivation;
- proof visibility changes;
- data safety decisions.

### 21.2 Audit Log fields

Each event should show:

- action;
- actor;
- date/time;
- affected record;
- previous value;
- new value;
- risk level;
- reason/note;
- related course/organization/user where relevant.

### 21.3 Reason-required actions

Require a reason for:

- creating/removing Platform Admin;
- changing high-risk roles;
- reopening locked Analysis/Design;
- returning course to earlier phase;
- publishing with warnings;
- revoking/reactivating certificate;
- changing proof visibility;
- deactivating reference value in use;
- archiving/retiring a course.

---

## 22. Admin UI/UX expectations

The Admin UI should be premium, clear, DEC-branded, and practical.

### 22.1 Overall feel

The Admin area should feel like:

- a professional platform control center;
- calm and structured;
- not overloaded;
- easy to scan;
- action-oriented;
- safe and trustworthy;
- appropriate for DEC staff and CSO capacity-building work.

### 22.2 Language

Use plain labels:

- Users & Roles
- Organizations
- Reference Data
- Courses & Workflow
- Review Queue
- Publish Queue
- Certificates
- Practical Proof & Badges
- Data Safety & Visibility
- Monitoring & Capacity Evidence
- Audit Log

Avoid technical or code-like labels unless unavoidable.

### 22.3 Dashboard card design

Each card should show:

- title;
- count/status;
- short explanation;
- status badge;
- action link.

### 22.4 Tables

Tables should support:

- search;
- filters;
- clear status badges;
- row actions;
- empty states;
- warnings;
- pagination if needed.

### 22.5 Forms

Forms should include:

- clear labels;
- short help text;
- required fields;
- reason field for sensitive changes;
- warning before high-risk actions.

### 22.6 Empty states

Empty states should explain what to do next.

Example:

> No diagnosis records are available yet. Add or configure an approved diagnosis record before course creators can start from a validated capacity gap.

### 22.7 Warning states

Warnings should be clear and action-oriented.

Example:

> This lookup value is already used by 4 courses. You can deactivate it for future use, but it should remain attached to existing records.

---

## 23. Screen-by-screen product expectations

This section defines what each Admin screen should do.

### 23.1 Admin Dashboard / Control Center

**Purpose:** provide platform governance overview and action priorities.

Must show:

- platform readiness;
- configuration health;
- action required;
- Admin area cards;
- governance reminders;
- recent high-risk Admin actions;
- direct links to key areas.

Should improve existing dashboard by becoming less “read-only overview” and more “operational action center.”

### 23.2 Users & Roles

**Purpose:** manage all operational platform users.

Must support:

- list users;
- invite/add user;
- assign role;
- assign organization;
- assign course/program/cohort;
- deactivate/reactivate;
- prevent Platform Admin creation except by Super Admin;
- log role changes.

### 23.3 Organizations

**Purpose:** manage CSO records and organization membership.

Must support:

- create organization;
- update organization;
- add/invite members;
- assign organization roles;
- view linked courses/diagnosis records/learners;
- view safe organization evidence summary;
- log changes.

### 23.4 Programs & Cohorts

**Purpose:** group users and courses by program/cohort.

Phase 1 minimum:

- create/manage program labels;
- create/manage cohort labels;
- assign learners to cohort/course;
- filter monitoring by program/cohort where possible.

### 23.5 Reference Data

**Purpose:** manage platform dropdowns and controlled values.

Must support:

- add/edit/deactivate/reactivate values;
- show active/inactive/locked/system/used status;
- log all changes;
- prevent permanent deletion of used values;
- make values available to creator forms where appropriate.

### 23.6 Diagnosis Datasets

**Purpose:** manage approved evidence sources.

Must support:

- create/edit/archive dataset;
- show source description;
- show approval/configuration status;
- link records;
- make dataset available to course setup/analysis.

### 23.7 Diagnosis Records

**Purpose:** manage approved capacity gap records.

Must support:

- view capacity gap records;
- filter by organization/capacity area/K-S-M-E/course fit;
- make record available for course creation;
- prevent non-course gaps from becoming course drivers unless K/S component exists.

### 23.8 Workflow Field Metadata

**Purpose:** show governed workflow fields.

Phase 1 behavior:

- read-only or mostly read-only;
- show field phase, purpose, required status, visibility, sensitivity;
- help Admin understand workflow structure.

### 23.9 Courses & Workflow

**Purpose:** oversee all courses.

Must support:

- course list by workflow state;
- status filters;
- owner/reviewer assignment;
- blocker visibility;
- allowed return/reopen actions with reason;
- links to review/publish/monitoring.

### 23.10 Review Queue

**Purpose:** manage submitted courses.

Must support:

- see submitted courses;
- assign/reassign reviewers;
- view review status;
- view decisions;
- see return path;
- see specialist review flags;
- move approved courses to Publish Queue.

### 23.11 Publish Queue

**Purpose:** publish reviewed courses.

Must support:

- show Approved for Publish courses;
- show readiness checklist;
- block unsafe/incomplete publishing;
- allow Platform Admin publish action;
- record publish action;
- show recently published courses.

### 23.12 Certificates

**Purpose:** oversee certificates.

Must support:

- view certificates;
- search/filter;
- revoke/reactivate with reason;
- show 80%+ basis;
- show linked course/version/learner.

### 23.13 Practical Proof & Badges

**Purpose:** oversee applied evidence and verified achievements.

Must support:

- proof queue;
- verifier assignment;
- proof status;
- safety/redaction flags;
- badge/achievement record;
- raw proof protection;
- separate proof from certificate.

### 23.14 Data Safety & Visibility

**Purpose:** protect sensitive data.

Must support:

- visibility flags;
- redaction/specialist review queue;
- revoke external visibility;
- show donor-safe summary status;
- ensure raw proof private by default.

### 23.15 Monitoring & Capacity Evidence

**Purpose:** show platform evidence safely.

Must support:

- learner/certificate/proof/badge counts;
- capacity area summaries;
- organization summaries;
- recent recognitions;
- course improvement flags;
- no raw proof exposure.

### 23.16 Audit Log

**Purpose:** preserve accountability.

Must support:

- view Admin actions;
- filter by actor/action/entity/risk/date;
- show reason;
- show before/after where appropriate;
- highlight high-risk changes.

---

## 24. Phase 1 core vs future enhancements

### 24.1 Phase 1 core

Phase 1 must include:

- Super Admin controls Platform Admin authority.
- Platform Admin manages operational users and learners.
- Platform Admin manages organizations.
- Platform Admin manages lookup/reference tables directly.
- Platform Admin views/uses diagnosis datasets and records.
- Platform Admin oversees workflow states.
- Platform Admin manages Review and Publish queues.
- Platform Admin publishes after Review approval.
- Platform Admin views certificate registry.
- Platform Admin oversees proof/badge/data safety.
- Platform Admin views monitoring evidence.
- Audit log records sensitive Admin actions.
- No broad workflow override.
- No unsafe deletion of used reference values.
- Raw proof private by default.

### 24.2 Future enhancements

Future versions may add:

- separate Authorized Publisher permission;
- granular Platform Admin permission sets;
- advanced Super Admin emergency override;
- bulk learner import;
- self-registration approval;
- organization-led enrollment;
- advanced cohort scheduling;
- advanced reviewer workload dashboard;
- parallel review tracks;
- advanced donor-safe portal;
- consent withdrawal workflow;
- advanced data retention policy;
- public certificate verification portal;
- AI-assisted Admin summaries, only using non-sensitive data.

---

## 25. Development priority logic

This is not the Codex prompt yet, but it defines the intended development order for the later implementation plan.

### Priority 1: Clarify Admin role model

- Preserve current broad Admin foundation.
- Add/define Super Admin control over Platform Admin authority.
- Ensure Platform Admin cannot create other Platform Admins.

### Priority 2: Strengthen Admin dashboard

- Convert dashboard from read-only overview to action-oriented control center.
- Add action required cards and workflow status overview.

### Priority 3: User, learner, organization access

- Ensure Platform Admin can manage operational users and learners.
- Ensure organization membership management remains strong.
- Add simple program/cohort assignment if feasible.

### Priority 4: Reference Data refinement

- Preserve editable lookup tables.
- Ensure safe deactivate-not-delete behavior.
- Connect more creator-facing dropdowns to Admin reference data.

### Priority 5: Course workflow oversight

- Add or strengthen Admin course workflow list.
- Show blockers, next actions, reviewer assignment, publish readiness.

### Priority 6: Review and Publish queues

- Preserve Review/Publish separation.
- Allow all Platform Admins to publish after approval.
- Block unsafe/incomplete publish.

### Priority 7: Certificates, proof, data safety, monitoring

- Preserve existing features.
- Improve UX and clarity.
- Keep proof separate from certificates.
- Keep raw proof private by default.

### Priority 8: Audit log and reason requirements

- Ensure sensitive Admin actions require reasons.
- Ensure key Admin actions appear in audit log.

---

## 26. Acceptance criteria

The revised Admin specification is satisfied when the platform meets the following product outcomes.

### 26.1 Admin role model

- Super Admin exists as the highest-level authority.
- Only Super Admin can create/approve/suspend/remove Platform Admins.
- Platform Admin handles day-to-day administration.
- Platform Admin cannot create other Platform Admins.

### 26.2 Admin dashboard

- Platform Admin lands on Admin Control Center.
- Dashboard shows action-required items.
- Dashboard shows configuration health.
- Dashboard shows workflow status.
- Dashboard links to all Admin areas.
- Governance reminders are visible.

### 26.3 Users and learners

- Platform Admin can add/invite operational users.
- Platform Admin can assign roles.
- Platform Admin can manage learners/participants directly.
- Platform Admin can assign users to organization/course/program/cohort.
- Sensitive role changes are logged.

### 26.4 Organizations

- Platform Admin can create/update organizations.
- Platform Admin can manage members.
- Organization summaries are safe and role-aware.

### 26.5 Reference Data

- Platform Admin can add/edit/deactivate/reactivate values.
- Changes are logged.
- Used values cannot be permanently deleted.
- Active values appear in relevant forms where connected.

### 26.6 Diagnosis

- Admin can manage diagnosis datasets and records.
- Diagnosis records support K/S/M/E and course-fit logic.
- Non-course gaps cannot become course drivers without recorded K/S component.

### 26.7 Workflow

- Admin can view all courses by workflow state.
- Admin can return/reopen/reassign through allowed actions.
- Admin cannot silently bypass workflow gates.
- Sensitive workflow actions require a reason.

### 26.8 Review and Publish

- Review and Publish remain separate.
- Publish is locked until Review approval.
- All Platform Admins can publish after Review approval.
- Creators and reviewers cannot publish by default.
- Publish readiness checks are visible.
- Unsafe/incomplete courses are blocked from publishing.

### 26.9 Certificates

- Certificate registry exists.
- 80%+ final test score remains certificate rule.
- Certificate is not dependent on proof or badge.
- Revocation/reactivation requires reason and audit log.

### 26.10 Practical Proof and Badges

- Proof remains separate from certificate.
- Proof requires human review.
- Admin can assign verifiers and monitor proof status.
- Raw proof is private by default.
- Badge/achievement wording should not overclaim.

### 26.11 Data Safety

- Admin can manage visibility safely.
- External visibility can be revoked.
- Donor-safe summaries exclude raw proof.
- Sensitive data is not exposed by default.

### 26.12 Monitoring

- Admin monitoring is aggregate and safe.
- Monitoring tracks learners, certificates, proof, badges, capacity areas, and organizations.
- Monitoring does not claim full organizational transformation from course completion alone.

### 26.13 Audit Log

- Sensitive Admin actions are logged.
- Audit log includes actor, action, entity, time, reason, risk level, and before/after where appropriate.

---

## 27. Final product definition

The DEC Learning Hub Admin role should be defined as follows:

> The DEC Learning Hub Admin role is the governance, configuration, access, workflow oversight, publication, data safety, and monitoring control role for the Course Creator Portal. It has two levels. The Super Admin controls who can become a Platform Admin. Platform Admins manage day-to-day users, learners, organizations, reference data, diagnosis records, workflow oversight, Review and Publish queues, certificates, practical proof, badges, data visibility, monitoring evidence, and audit accountability. For Phase 1, Platform Admins can publish reviewed and approved courses, manage learners directly, and update lookup/reference tables directly. They cannot create other Platform Admins, silently bypass workflow gates, permanently delete used reference values, expose raw proof by default, or change binding product rules. The Admin experience should be dashboard-first, non-technical, action-oriented, role-aware, workflow-aware, and safe by default.

---

## 28. Implementation-readiness note

This file should be used as the main product reference before any Admin implementation work.

Recommended Codex workflow:

1. Read this file and `00_CORE_WORKFLOW_INDEX.md`.
2. Compare the current Admin implementation against this specification.
3. Propose the smallest safe implementation sequence.
4. Implement one slice at a time.
5. Preserve existing working Admin functionality where it already aligns.
6. Provide an implementation evidence pack after each slice.

Implementation should prioritize the Phase 1 Admin simplification rules:

- Super Admin controls Platform Admin authority.
- Platform Admins can publish after Review approval.
- Platform Admins can directly manage learners.
- Platform Admins can directly manage reference data.
- Platform Admins cannot silently bypass workflow gates.
- Sensitive Admin actions must be logged.

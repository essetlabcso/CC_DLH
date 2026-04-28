# **Annex 2: Role-Action and Permission Matrix**

## **DEC Learning Hub Course Creator Portal**

## **1. Purpose of This Annex**

This annex defines the **role-action and permission logic** for the DEC Learning Hub Course Creator Portal.

Its purpose is to help Codex/GPT-5.5, developers, reviewers, and DEC stakeholders understand:

- who can do what in the platform;

- which actions are allowed by role;

- which actions require approval;

- which actions should be blocked or hidden;

- how creation, review, publish, learning, certification, practical proof, verified achievement, and monitoring responsibilities should be separated.

This annex should be treated as a developer-facing product control document. It does not prescribe exact authentication implementation, database policy, or route middleware structure. Codex should inspect the existing repo and apply these rules through the current role and permission architecture where possible.

The core rule is:

> Creation, review, publication, learning, proof verification, and monitoring must be role-aware. A user should only see and perform actions appropriate to their role and assignment.

# **2. Role Separation Principle**

The platform must not treat all users as the same.

The Course Creator Portal supports several connected workflows:

> Analysis → Design → Build → Review → Publish → Learner Runtime → Certificate → Practical Proof → Verified Achievement → Monitoring

Each workflow area has different responsibilities.

The role separation principle is:

> Course creators create and revise. Reviewers review and return or approve. Authorized publishers/admins publish. Learners complete courses and earn certificates. Proof verifiers validate practical evidence. Organization admins view safe organizational summaries. DEC admins oversee the platform.

This separation protects:

- course quality;

- publication control;

- data safety;

- safeguarding;

- learner privacy;

- CSO trust;

- donor-facing credibility;

- workflow traceability.

# **3. Core Roles**

The platform should support or logically distinguish the following roles.

In early Phase 1, some roles may be combined under DEC Admin if the repo does not yet support granular permissions. However, the product logic should preserve these distinctions for future strengthening.

| **Role**                                     | **Primary purpose**                                                                                                            |
|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| Course Creator / Subject Matter Expert       | Creates, edits, builds, previews, submits, and revises courses.                                                                |
| DEC Admin                                    | Oversees platform configuration, roles, workflows, publication controls, and monitoring.                                       |
| Instructional Design Reviewer                | Reviews learning flow, action mapping, block quality, learner workload, and assessment alignment.                              |
| Subject Matter Reviewer                      | Reviews technical accuracy, CSO relevance, answer keys, examples, and content quality.                                         |
| DEC Capacity Lead                            | Checks alignment with CSO capacity areas, indicators, standards, and program objectives.                                       |
| Safeguarding / Civic-Space Reviewer          | Reviews sensitive content, advocacy risks, proof submission safety, and do-no-harm issues.                                     |
| Accessibility / Localization Reviewer        | Reviews mobile usability, low-bandwidth readiness, plain language, translation-readiness, captions, transcripts, and alt text. |
| Platform / Admin Reviewer                    | Reviews metadata, technical settings, final test setup, certificate trigger, permissions, and publish readiness.               |
| Authorized Publisher                         | Publishes approved course versions and controls release settings.                                                              |
| Learner                                      | Takes courses, completes final tests, receives certificates, gives feedback, and may submit practical proof.                   |
| Organization Admin                           | Views safe organization-level learning progress, certificates, and verified achievements where enabled.                        |
| Practical Proof Verifier                     | Reviews practical proof and awards, rejects, or requests revision for verified achievements/badges.                            |
| Donor / Partner Viewer, optional future role | Views only safe, consent-based summaries of verified achievements and capacity evidence.                                       |

# **4. Role Definitions and Boundaries**

## **4.1 Course Creator / Subject Matter Expert**

Course creators are responsible for turning approved capacity needs into courses.

They may:

- create course drafts;

- complete or work from Analysis records;

- prepare Capacity Map, Action Map, Learning Design Document, and Storyboard;

- build course blocks;

- add creator-added blocks with purpose tag and justification;

- use AI-assisted authoring within approved boundaries;

- configure final test items;

- configure practical proof pathway where relevant;

- preview course as learner;

- submit course for Review;

- revise returned courses;

- view monitoring for courses they own or manage.

They should not:

- publish courses by default;

- approve their own course for publication unless they also hold an authorized admin/publisher role;

- bypass Review;

- make raw proof donor-visible;

- verify practical proof unless assigned verifier role;

- change certificate rule.

## **4.2 DEC Admin**

DEC Admins manage the platform and may hold broad permissions.

They may:

- manage users and roles;

- manage controlled taxonomies and capacity areas;

- oversee courses across all workflow states;

- approve or lock workflow gates in early Phase 1 where specialized roles are not yet implemented;

- return, archive, or reopen courses according to workflow rules;

- publish if also acting as authorized publisher;

- view platform-wide dashboards;

- manage certificate registry;

- manage proof and verified achievement workflows;

- control visibility settings;

- manage organization-level summaries.

They should not:

- expose raw proof to donors by default;

- override safeguarding/data safety blocks without recorded reason;

- change binding product rules without DEC decision;

- bypass Review without recorded admin override.

## **4.3 Instructional Design Reviewer**

Instructional Design Reviewers assess whether the course is pedagogically strong and action-oriented.

They may review:

- performance goal;

- Action Map;

- Learning Design Document;

- Storyboard;

- block sequence;

- creator-added blocks;

- practice activities;

- scenario flow;

- learner workload;

- assessment alignment;

- clarity and usability.

They may:

- approve their review track;

- request revisions;

- return course to Build or Design;

- add reviewer comments;

- flag issues for another reviewer.

They should not:

- publish courses;

- change publication settings;

- verify practical proof unless assigned;

- override certificate rules.

## **4.4 Subject Matter Reviewer**

Subject Matter Reviewers check technical accuracy and contextual relevance.

They may review:

- course content accuracy;

- CSO relevance;

- examples;

- donor or compliance-related statements;

- final test answer keys;

- scenario realism;

- templates and resources.

They may:

- approve content accuracy;

- request edits;

- flag unsupported claims;

- reject inaccurate AI-generated content.

They should not:

- publish courses;

- change final certificate rule;

- approve unsafe legal or donor claims without proper basis.

## **4.5 DEC Capacity Lead**

The DEC Capacity Lead ensures the course remains linked to DEC’s CSO capacity-strengthening objectives.

They may review:

- capacity area alignment;

- indicator/standard linkage;

- target learner group;

- capacity gap relevance;

- course-fit logic;

- verified achievement linkage;

- organization-level evidence interpretation.

They may:

- approve capacity alignment;

- return to Analysis or Design if the course drifts;

- flag overclaiming in monitoring or donor-facing summaries.

They should not:

- treat course completion as full organizational transformation;

- approve donor-facing capacity claims without evidence and safeguards.

## **4.6 Safeguarding / Civic-Space Reviewer**

This reviewer protects learners, CSOs, communities, and rights-holders.

They may review:

- safeguarding scenarios;

- advocacy or civic-space content;

- community feedback and complaint-handling examples;

- proof submission instructions;

- data protection guidance;

- unsafe upload risks;

- donor visibility risks.

They may:

- approve safety readiness;

- request anonymization or redaction guidance;

- require fictionalized examples;

- block Publish until risks are corrected;

- mark proof as unsafe or require escalation.

They should not:

- allow active safeguarding/protection case files to be uploaded as proof;

- allow raw sensitive evidence to become donor-visible;

- approve unsafe advocacy instructions.

## **4.7 Accessibility / Localization Reviewer**

This reviewer ensures that courses are usable for local CSO learners.

They may review:

- mobile-first layout;

- low-bandwidth readiness;

- plain language;

- translation-readiness;

- local contextual fit;

- alt text;

- captions;

- transcripts;

- printable/offline resources;

- inclusive wording.

They may:

- request accessibility improvements;

- block publication for critical access barriers;

- flag content that is too long, too technical, or difficult to localize.

They should not:

- approve media-heavy courses that lack low-bandwidth alternatives where required;

- ignore accessibility issues in final learner runtime.

## **4.8 Platform / Admin Reviewer**

This reviewer checks technical and operational readiness before publishing.

They may review:

- course metadata;

- final test configuration;

- 80%+ certificate trigger;

- role/permission settings;

- learner preview;

- proof submission configuration;

- badge/verified achievement setting;

- progress tracking;

- publication readiness.

They may:

- flag broken runtime behavior;

- block Publish until platform issues are resolved;

- confirm readiness after fixes.

They should not:

- change course content quality decisions unless assigned another review role;

- change certificate rule.

## **4.9 Authorized Publisher**

The Authorized Publisher releases reviewed courses to learners.

They may:

- view courses approved for publication;

- confirm publication metadata;

- select visibility and enrollment settings;

- publish now;

- schedule publication;

- publish to pilot group;

- archive or retire course;

- create Published Course Record;

- lock published version.

They should not:

- publish unreviewed courses;

- bypass unresolved specialist review;

- publish with incorrect certificate setting;

- expose raw proof or unsafe metadata;

- edit published course content directly without revision workflow.

## **4.10 Learner**

Learners are CSO staff, leaders, board members, volunteers, or other participants who use the learner-facing platform.

They may:

- access published or assigned courses;

- complete lessons and activities;

- take final tests;

- receive certificates at 80%+ final test score;

- submit practical proof where enabled;

- view proof review status;

- receive verified achievements/badges where proof is accepted;

- provide course feedback;

- view their own learning record.

They should not:

- access internal creator/reviewer metadata;

- see unpublished course versions;

- see other learners’ test scores or proof;

- publish or review courses;

- verify their own proof.

## **4.11 Organization Admin**

Organization Admins may view safe summaries for their own CSO.

They may see:

- learners from their organization;

- course enrollment and progress;

- certificates earned;

- verified achievements awarded;

- capacity areas covered;

- recommended next courses;

- organization-level capacity evidence summaries.

They should not automatically see:

- raw proof submissions;

- sensitive learner details;

- safeguarding/protection data;

- private reviewer notes;

- donor-facing settings unless authorized.

Visibility should depend on consent, role, and organization policy.

## **4.12 Practical Proof Verifier**

Practical Proof Verifiers review applied evidence for verified achievements or badges.

They may:

- view assigned proof submissions;

- check proof against criteria;

- request revision or redaction;

- reject incomplete or unsafe proof;

- accept valid proof;

- award verified achievement/badge;

- link achievement to capacity area and indicator;

- record verification notes.

They should not:

- issue course certificates;

- change final test scores;

- publish courses;

- expose raw proof to donors;

- award badges without reviewed evidence.

## **4.13 Donor / Partner Viewer, Optional Future Role**

This role should be treated as optional and future-facing unless DEC enables it.

Donor/partner viewers may only see:

- safe, consent-based summaries;

- verified achievement titles;

- capacity areas;

- indicator/standard links;

- verification date;

- organization-approved visibility records.

They should not see:

- raw proof;

- learner test scores;

- internal reviewer notes;

- sensitive CSO weaknesses;

- safeguarding/protection data;

- private organizational documents.

# **5. Role-Action Matrix**

The following matrix defines the intended action permissions. “Yes” means the role may perform the action if assigned to that course or organization. “No” means the action should be hidden, disabled, or blocked. “Limited” means the action depends on assignment, visibility, or implementation stage.

| **Action**                        | **Creator**       | **DEC Admin** | **ID Reviewer** | **SME Reviewer**    | **Capacity Lead**   | **Safeguarding Reviewer** | **Accessibility Reviewer** | **Platform Reviewer** | **Publisher** | **Learner** | **Org Admin**    | **Proof Verifier** | **Donor Viewer**    |
|-----------------------------------|-------------------|---------------|-----------------|---------------------|---------------------|---------------------------|----------------------------|-----------------------|---------------|-------------|------------------|--------------------|---------------------|
| Create course draft               | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Edit own course draft             | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| View assigned course draft        | Yes               | Yes           | Limited         | Limited             | Limited             | Limited                   | Limited                    | Limited               | Limited       | No          | No               | No                 | No                  |
| Complete Analysis fields          | Yes               | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Lock Analysis for Design          | Yes/Phase 1A      | Yes           | No              | No                  | Later / Limited     | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Reopen locked Analysis            | No / Limited      | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Edit Capacity Map                 | Yes               | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Edit Action Map                   | Yes               | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Edit Learning Design Document     | Yes               | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Edit Storyboard / Block Plan      | Yes               | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Approve Design-to-Build Handover  | Limited / Phase 1 | Yes           | Limited         | Limited             | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Reopen approved Design            | No / Limited      | Yes           | Limited         | Limited             | Limited             | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Build course blocks               | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Add creator-added block           | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Add purpose tag / justification   | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Use AI drafting support           | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Mark AI output reviewed           | Yes               | Yes           | Limited         | Limited             | Limited             | Limited                   | Limited                    | No                    | No            | No          | No               | No                 | No                  |
| Configure final test              | Yes               | Yes           | No              | Limited             | No                  | No                        | No                         | Limited               | No            | No          | No               | No                 | No                  |
| Configure certificate rule        | No, view only     | Yes           | No              | No                  | No                  | No                        | No                         | Limited               | No            | No          | No               | No                 | No                  |
| Configure practical proof pathway | Yes               | Yes           | No              | Limited             | Limited             | Limited                   | No                         | Limited               | No            | No          | No               | Limited            | No                  |
| Preview as learner                | Yes               | Yes           | Limited         | Limited             | Limited             | Limited                   | Limited                    | Limited               | Limited       | No          | No               | No                 | No                  |
| Submit course for Review          | Yes               | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| View Review queue                 | No                | Yes           | Yes             | Yes                 | Yes                 | Yes                       | Yes                        | Yes                   | Limited       | No          | No               | No                 | No                  |
| Add review comments               | No                | Yes           | Yes             | Yes                 | Yes                 | Yes                       | Yes                        | Yes                   | No            | No          | No               | No                 | No                  |
| Approve review track              | No                | Yes           | Yes             | Yes                 | Yes                 | Yes                       | Yes                        | Yes                   | No            | No          | No               | No                 | No                  |
| Return to Build                   | No                | Yes           | Yes             | Yes                 | Yes                 | Yes                       | Yes                        | Yes                   | No            | No          | No               | No                 | No                  |
| Return to Design                  | No                | Yes           | Yes             | Yes                 | Yes                 | Limited                   | Limited                    | Limited               | No            | No          | No               | No                 | No                  |
| Return to Analysis                | No                | Yes           | Limited         | Limited             | Yes                 | Limited                   | No                         | No                    | No            | No          | No               | No                 | No                  |
| Request specialist review         | No                | Yes           | Yes             | Yes                 | Yes                 | Yes                       | Yes                        | Yes                   | No            | No          | No               | No                 | No                  |
| Approve for Publish               | No                | Yes           | Limited         | Limited             | Limited             | Limited                   | Limited                    | Limited               | No            | No          | No               | No                 | No                  |
| Publish course                    | No                | Yes           | No              | No                  | No                  | No                        | No                         | No                    | Yes           | No          | No               | No                 | No                  |
| Schedule publication              | No                | Yes           | No              | No                  | No                  | No                        | No                         | No                    | Yes           | No          | No               | No                 | No                  |
| Archive course                    | No                | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | Yes           | No          | No               | No                 | No                  |
| Create revision draft             | Yes / assigned    | Yes           | No              | No                  | No                  | No                        | No                         | No                    | No            | No          | No               | No                 | No                  |
| Enroll in course                  | No                | Optional test | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | No               | No                 | No                  |
| Complete lessons                  | No                | Optional test | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | No               | No                 | No                  |
| Take final test                   | No                | Optional test | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | No               | No                 | No                  |
| Receive certificate at 80%+       | No                | No            | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | No               | No                 | No                  |
| Submit practical proof            | No                | No            | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes / CSO   | Limited          | No                 | No                  |
| View own proof status             | No                | No            | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | Limited          | No                 | No                  |
| Review practical proof            | No                | Yes           | No              | Limited             | Limited             | Limited                   | No                         | No                    | No            | No          | No               | Yes                | No                  |
| Request proof revision/redaction  | No                | Yes           | No              | Limited             | Limited             | Yes                       | No                         | No                    | No            | No          | No               | Yes                | No                  |
| Accept/reject proof               | No                | Yes           | No              | Limited             | Limited             | Limited                   | No                         | No                    | No            | No          | No               | Yes                | No                  |
| Award verified achievement/badge  | No                | Yes           | No              | Limited             | Limited             | Limited                   | No                         | No                    | No            | No          | No               | Yes                | No                  |
| View own learner dashboard        | No                | No            | No              | No                  | No                  | No                        | No                         | No                    | No            | Yes         | No               | No                 | No                  |
| View creator monitoring           | Yes, own courses  | Yes           | Limited         | Limited             | Limited             | Limited                   | Limited                    | Limited               | No            | No          | No               | No                 | No                  |
| View organization dashboard       | No                | Yes           | Limited         | No                  | Limited             | No                        | No                         | No                    | No            | No          | Yes              | Limited            | No                  |
| View platform-wide monitoring     | No                | Yes           | Limited         | Limited             | Yes                 | Limited                   | Limited                    | Limited               | No            | No          | No               | No                 | No                  |
| View raw proof                    | No                | Restricted    | No              | Limited if assigned | Limited if assigned | Limited if assigned       | No                         | No                    | No            | Own only    | No by default    | Assigned only      | No                  |
| View donor-safe summaries         | No                | Yes           | Limited         | No                  | Limited             | No                        | No                         | No                    | No            | No          | If enabled       | No                 | Yes, consented only |
| Change donor visibility           | No                | Yes           | No              | No                  | Limited             | No                        | No                         | No                    | No            | No          | Yes / if enabled | No                 | No                  |

# **6. Workflow Gate Permissions**

## **6.1 Analysis Gate**

| **Action**                     | **Default permission**                                             |
|--------------------------------|--------------------------------------------------------------------|
| Draft Analysis                 | Creator, DEC Admin                                                 |
| Lock Analysis for Design       | Creator/Admin in early Phase 1; DEC Capacity Lead later if enabled |
| Reopen Analysis                | DEC Admin; Capacity Lead if enabled                                |
| View locked Analysis reference | Creator, reviewers, admins; learner does not see internal handover |

Phase 1A note:

> In early Phase 1, “Lock Analysis for Design” may be allowed for creator/admin as a practical workflow gate. Later, DEC may require Capacity Lead approval.

## **6.2 Design Gate**

| **Action**                                                     | **Default permission**                                                                     |
|----------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| Draft Capacity Map / Action Map / Learning Design / Storyboard | Creator, DEC Admin                                                                         |
| Approve Design-to-Build Handover                               | DEC Admin; creator/admin in early implementation if approved; reviewer/capacity lead later |
| Reopen Design                                                  | DEC Admin; reviewer/capacity lead where assigned                                           |
| View approved Design reference                                 | Creator, reviewers, admins                                                                 |

## **6.3 Build Gate**

| **Action**                          | **Default permission** |
|-------------------------------------|------------------------|
| Build course blocks                 | Creator, DEC Admin     |
| Add creator-added blocks            | Creator, DEC Admin     |
| Add purpose tags and justifications | Creator, DEC Admin     |
| Use AI drafting support             | Creator, DEC Admin     |
| Submit for Review                   | Creator, DEC Admin     |
| Reopen Build after return           | Creator, DEC Admin     |

## **6.4 Review Gate**

| **Action**                 | **Default permission**                              |
|----------------------------|-----------------------------------------------------|
| View Review queue          | Assigned reviewers, DEC Admin                       |
| Review course              | Assigned reviewers, DEC Admin                       |
| Add comments               | Assigned reviewers, DEC Admin                       |
| Approve review track       | Assigned reviewers, DEC Admin                       |
| Return to earlier phase    | Assigned reviewers, DEC Admin according to severity |
| Approve for Publish        | Assigned reviewer/admin according to workflow       |
| Override unresolved review | DEC Admin only, with recorded reason                |

## **6.5 Publish Gate**

| **Action**                             | **Default permission**    |
|----------------------------------------|---------------------------|
| View courses approved for publication  | Publisher, DEC Admin      |
| Edit publication metadata              | Publisher, DEC Admin      |
| Publish course                         | Publisher, DEC Admin      |
| Schedule publication                   | Publisher, DEC Admin      |
| Archive course                         | Publisher, DEC Admin      |
| Edit published course content directly | No; use revision workflow |

## **6.6 Learner Runtime**

| **Action**                        | **Default permission**    |
|-----------------------------------|---------------------------|
| Access published/assigned course  | Learner                   |
| Complete lessons                  | Learner                   |
| Take final test                   | Learner                   |
| Receive certificate at 80%+       | Learner/system            |
| Submit practical proof            | Learner/CSO where enabled |
| View own certificate/proof status | Learner                   |
| View internal course records      | No                        |

## **6.7 Practical Proof and Verified Achievement**

| **Action**                       | **Default permission**                                  |
|----------------------------------|---------------------------------------------------------|
| Submit proof                     | Learner/CSO                                             |
| View own submitted proof         | Learner                                                 |
| View assigned proof for review   | Proof Verifier, DEC Admin, assigned specialist          |
| Request revision/redaction       | Proof Verifier, DEC Admin, assigned specialist          |
| Accept/reject proof              | Proof Verifier, DEC Admin                               |
| Award badge/verified achievement | Proof Verifier, DEC Admin                               |
| Make achievement donor-visible   | Organization Admin/DEC Admin according to consent rules |
| View raw proof as donor          | No                                                      |

# **7. Data Visibility Rules by Role**

Data visibility must be safe by default.

| **Data type**                   | **Default visibility**                                                                |
|---------------------------------|---------------------------------------------------------------------------------------|
| Course drafts                   | Creator, DEC Admin, assigned reviewers when submitted                                 |
| Analysis/Design handovers       | Creator, DEC Admin, assigned reviewers                                                |
| Reviewer comments               | Creator for returned comments, reviewers, DEC Admin                                   |
| Published course content        | Learners with access                                                                  |
| Learner progress                | Learner, DEC Admin, assigned creator in aggregate, organization admin in safe summary |
| Final test score                | Learner, DEC Admin, aggregate for creator/org                                         |
| Certificate                     | Learner, DEC Admin, organization summary if enabled                                   |
| Practical proof raw file        | Learner, assigned proof verifier, restricted DEC Admin; not donor-visible             |
| Verified achievement            | Learner, DEC Admin, organization summary; donor-safe summary only with consent        |
| Organization capacity evidence  | Organization admin, DEC Admin; donor-safe summary only with consent                   |
| Donor-facing summary            | Donor viewer only if consented and safe                                               |
| Safeguarding/protection content | Avoid upload; specialist-restricted if unavoidable                                    |

# **8. UI Behavior for Permissions**

The platform should implement permission behavior in a user-friendly way.

Recommended behavior:

| **Permission situation**        | **UI behavior**                                       |
|---------------------------------|-------------------------------------------------------|
| User cannot perform action      | Hide or disable action                                |
| Action blocked by workflow gate | Show disabled button with reason                      |
| User needs another role         | Explain who can perform the action                    |
| Course returned for revision    | Show comments and editable affected areas             |
| Publish locked                  | Explain Review approval or publisher role is required |
| Proof visibility restricted     | Show safe status only, not raw file                   |
| Donor visibility not consented  | Hide from donor-facing view                           |
| Certificate not earned          | Show final test requirement                           |
| Certificate earned              | Show certificate download/view option                 |

Examples:

Publish is locked. This course must be approved in Review and published by an authorized publisher.

Design is locked. To change the performance goal, request Design reopening.

You can view the verified achievement summary, but raw proof is restricted.

# **9. Minimum Phase 1 Permission Requirements**

For Phase 1, the platform should minimally enforce:

1.  Course creators can create, edit, build, preview, submit, and revise assigned courses.

2.  Course creators cannot publish by default.

3.  Reviewers/admins can review and return courses.

4.  Publish remains locked until Review approval.

5.  Only authorized publisher/admin can publish.

6.  Learners can access only published or assigned courses.

7.  Certificate is generated automatically at 80%+ final test score.

8.  Practical proof is separate from certificate.

9.  Raw practical proof is not donor-visible by default.

10. Proof verifiers/admins can review proof and award verified achievements.

11. Organization admins see only safe organization summaries.

12. Donor-facing users, if enabled, see only consent-based safe summaries.

13. Published versions cannot be casually edited; use revision workflow.

14. Sensitive data and internal reviewer notes are role-restricted.

# **10. Future Permission Enhancements**

Future versions may add:

- more granular review assignment;

- multi-reviewer approvals;

- workflow-based role delegation;

- organization-level access rules;

- donor viewer role;

- consent management interface;

- audit log dashboard;

- temporary reviewer access;

- proof review queues by capacity area;

- localization reviewer role;

- certificate verification portal;

- badge visibility controls;

- public/private CSO achievement profiles.

These should be added only after Phase 1 role boundaries work reliably.

# **11. Implementation Guidance for Codex**

Codex should implement role and permission rules using the existing repo’s authentication, authorization, routing, and data access patterns.

Codex should not introduce a major permission architecture rewrite unless necessary and approved.

For each implementation slice, Codex should identify:

- which roles are affected;

- which routes are affected;

- which actions are allowed or blocked;

- which UI buttons should be hidden/disabled;

- which records become visible or hidden;

- which tests confirm permissions.

Acceptance criteria should be written as observable behavior.

Example:

Given a course creator without publisher role,

when the course is approved for Publish,

then the creator can see the course status but cannot publish it.

Given a learner scores 80% on the final test,

when the score is saved,

then the learner receives the certificate without submitting practical proof.

Given a donor viewer role,

when opening a CSO achievement summary,

then the donor can see consented verified achievement summaries but cannot access raw proof files.

# **12. Success Standard for This Annex**

This annex is successful when:

> Codex and developers can clearly determine which role can perform each action, which actions must remain restricted, which data should be visible to whom, and how creation, review, publication, learner certification, practical proof verification, donor visibility, and monitoring responsibilities remain separated.

In practical terms, this annex should prevent:

> “A course creator accidentally publishes an unreviewed course or a donor sees raw proof.”

And ensure:

> “Creators create, reviewers review, publishers publish, learners learn and receive certificates at 80%+, proof verifiers validate applied evidence, and donors only see safe consent-based summaries where enabled.”

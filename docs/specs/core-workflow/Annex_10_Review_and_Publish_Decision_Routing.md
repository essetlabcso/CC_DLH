# **Annex 10: Review and Publish Decision Routing**

## **DEC Learning Hub Course Creator Portal**

## **1. Purpose of This Annex**

This annex defines the **Review and Publish Decision Routing** for the
DEC Learning Hub Course Creator Portal.

Its purpose is to help Codex/GPT-5.5, developers, DEC reviewers,
publishers, admins, and course creators implement a clear,
role-sensitive, traceable process for moving a course from **Build** to
**Review** to **Publish**.

This annex should guide:

- Build-to-Review submission;

- reviewer decision options;

- return paths to Build, Design, or Analysis;

- specialist review routing;

- Review approval logic;

- Publish unlock rules;

- publication metadata checks;

- version creation;

- archive/revision behavior;

- evidence pack expectations for implementation.

The core rule is:

> **Review confirms quality and readiness. Publish controls release,
> visibility, versioning, and learner access. These must remain separate
> workflow stages.**

A course should not become visible to learners simply because it has
been built or submitted for Review. It should become visible only after
structured Review approval and authorized Publish action.

# **2. Review and Publish Separation Rule**

Review and Publish must remain separate.

| **Workflow stage** | **Main responsibility**                                                                                                               | **Who acts**                                |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| Review             | Checks quality, alignment, safety, accessibility, final test, certificate logic, proof pathway, AI use, and learner preview readiness | Reviewer / DEC Admin / assigned specialists |
| Publish            | Releases the approved course version to learners with correct metadata, visibility, enrollment, and version controls                  | Authorized Publisher / DEC Admin            |

This separation protects quality and prevents accidental release.

Correct behavior:

> A reviewer may approve a course for Publish, but the course is not
> live until an authorized Publisher/Admin publishes it.

Incorrect behavior:

> A course automatically goes live when the creator submits it or when
> one reviewer leaves a positive comment.

# **3. Review Entry Condition**

A course enters Review only after the creator completes the
**Build-to-Review Handover**.

The handover should confirm that:

- Design-to-Build Handover was approved;

- required blocks are present;

- creator-added blocks have purpose tags and justification;

- AI-assisted blocks have human review status;

- final test is configured;

- certificate threshold is 80%+;

- practical proof pathway is configured safely where enabled;

- learner preview was completed;

- unresolved critical Build warnings are resolved or flagged;

- course is ready for reviewer attention.

A course should not enter Review if essential Build elements are
missing.

# **4. Build-to-Review Handover Contents**

The Review Workflow should begin from a structured handover summary.

Recommended fields:

| **Handover field**                 | **Purpose**                               |
|------------------------------------|-------------------------------------------|
| Course ID / version draft ID       | Identifies course being reviewed          |
| Course title                       | Learner-facing working title              |
| Course owner                       | Creator responsible                       |
| Linked Analysis Handover           | Shows approved evidence base              |
| Linked Design-to-Build Handover    | Shows approved learning design            |
| Capacity area / sub-capacity       | Shows CSO capacity link                   |
| Target learner group               | Shows intended audience                   |
| Performance goal                   | Shows learner action focus                |
| Required blocks summary            | Shows required Storyboard blocks          |
| Creator-added block register       | Shows added blocks and justifications     |
| AI Drafting and Review Log         | Shows AI use and human review status      |
| Final Test Record                  | Shows test setup and 80% certificate rule |
| Practical Proof Configuration      | Shows proof/badge setup if enabled        |
| Accessibility checklist            | Shows learner access readiness            |
| Safeguarding/data safety checklist | Shows risk and no-harm readiness          |
| Learner preview status             | Shows runtime was tested                  |
| Known unresolved warnings          | Directs reviewer attention                |
| Submission date                    | Review timeline                           |
| Submitted by                       | Accountability                            |

# **5. Review Tracks**

The platform should support multiple review tracks logically, even if
early Phase 1 combines them under fewer roles.

| **Review track**                    | **Main focus**                                                                             |
|-------------------------------------|--------------------------------------------------------------------------------------------|
| Instructional Design Review         | Learning flow, Action Map alignment, practice quality, learner workload, block sequence    |
| Subject Matter Review               | Technical accuracy, CSO relevance, answer keys, examples, templates                        |
| Capacity Alignment Review           | Link to capacity area, indicator/standard, Analysis gap, performance goal                  |
| Safeguarding / Civic-Space Review   | Sensitive scenarios, proof safety, advocacy risk, data protection, do-no-harm              |
| Accessibility / Localization Review | Mobile usability, low-bandwidth, plain language, captions, transcripts, alt text           |
| Platform / Admin Review             | Metadata, final test setup, certificate trigger, learner preview, role settings            |
| Practical Proof Review Setup        | Proof instructions, accepted proof types, rubric, badge wording, verifier role, visibility |

Not every course needs every specialist track. However, sensitive
courses should trigger the relevant specialist review.

# **6. Review Decision Options**

Reviewers should have clear decision options.

| **Decision**               | **Meaning**                                                                                                 | **Next state**                                                    |
|----------------------------|-------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| Approve for Publish        | Course passes Review and can move to Publish                                                                | Approved for Publish                                              |
| Approve with minor fixes   | Course is almost ready; small fixes required                                                                | Remains in Review or returns to Build depending on implementation |
| Return to Build            | Content, block, final test, proof, accessibility, or technical issue needs Build-level revision             | Build returned                                                    |
| Return to Design           | Performance goal, Action Map, Storyboard, assessment intent, or design logic needs revision                 | Design returned                                                   |
| Return to Analysis         | Capacity gap, learner group, K/S/M/E route, course-fit decision, or evidence base is incorrect              | Analysis returned                                                 |
| Specialist Review Required | Safeguarding, civic-space, accessibility, legal/compliance, data, or platform issue needs specialist review | Specialist review required                                        |
| Not Approved / Pause       | Course should not proceed in current form                                                                   | Paused / archived / major revision                                |

The platform should record the reviewer decision and route the course
accordingly.

# **7. Decision Routing Matrix**

| **Issue found during Review**                                       | **Correct routing**                                  | **Reason**                                                    |
|---------------------------------------------------------------------|------------------------------------------------------|---------------------------------------------------------------|
| Typo, formatting, unclear wording                                   | Return to Build                                      | Build-level fix                                               |
| Missing required block                                              | Return to Build                                      | Storyboard block not built                                    |
| Creator-added block has no purpose tag                              | Return to Build                                      | Governance metadata missing                                   |
| Added block introduces unrelated topic                              | Return to Build or Design                            | Minor drift = Build; major scope change = Design              |
| AI content unreviewed                                               | Return to Build                                      | Human review required                                         |
| AI-generated donor/legal claim unsupported                          | Return to Build + SME/specialist review              | Accuracy and risk issue                                       |
| Final test missing                                                  | Return to Build                                      | Certificate pathway incomplete                                |
| Final test item tests untaught content                              | Return to Build                                      | Assessment alignment issue                                    |
| Certificate threshold is not 80%+                                   | Return to Build/Admin correction                     | Binding rule violated                                         |
| Practical proof instructions unclear                                | Return to Build                                      | Proof setup issue                                             |
| Proof pathway asks for unsafe data                                  | Return to Build + specialist review                  | Data safety issue                                             |
| Badge title overclaims capacity                                     | Return to Build/Design                               | Recognition wording issue                                     |
| Performance goal is vague or wrong                                  | Return to Design                                     | Design-level issue                                            |
| Action Map does not match course content                            | Return to Design                                     | Design coherence issue                                        |
| Storyboard misses practice for Skill gap                            | Return to Design                                     | Design-level practice gap                                     |
| Course addresses Motivation/Environment issue without K/S component | Return to Analysis                                   | Course-fit issue                                              |
| Target learner group appears wrong                                  | Return to Analysis                                   | Analysis/design foundation issue                              |
| Capacity area/indicator link is wrong                               | Return to Analysis or Design                         | Depends whether original diagnosis or design mapping is wrong |
| Safeguarding scenario risky                                         | Specialist Review Required; possibly return to Build | Safety issue                                                  |
| Accessibility barrier severe                                        | Specialist Review Required or Return to Build        | Access issue                                                  |
| Learner preview broken                                              | Return to Build / platform fix                       | Runtime readiness issue                                       |
| Publish metadata incomplete                                         | Keep Publish locked                                  | Publish setup issue                                           |

# **8. Return-to-Build Rules**

Return to Build when the approved Analysis and Design are still valid,
but the built course needs revision.

Common reasons:

- incomplete block content;

- missing required blocks;

- confusing learner instructions;

- unnecessary long text;

- unsupported creator-added block;

- accessibility issue;

- final test issue;

- practical proof setup issue;

- AI review issue;

- learner preview issue.

The reviewer should provide specific, actionable comments.

Example comment:

> Block 6 is creator-added but has no purpose tag or design linkage.
> Please link it to a required action, assessment readiness,
> accessibility need, or remove it.

Build return should preserve:

- reviewer comments;

- affected blocks;

- severity;

- required fixes;

- optional suggestions;

- resubmission status.

# **9. Return-to-Design Rules**

Return to Design when the built course reveals a problem with the
learning design itself.

Common reasons:

- performance goal is too broad;

- Action Map is incomplete;

- Skill gap lacks practice;

- Storyboard sequence does not support learning;

- assessment intent is unclear;

- practical proof is not connected to required action;

- course content suggests a different learning objective;

- major creator-added content changes the course direction.

Example comment:

> The course is intended to help learners prepare budget justifications,
> but the Storyboard does not include practice using a budget line.
> Please revise the Action Map and Storyboard before rebuilding.

Return to Design should require:

- Design edits;

- updated Design-to-Build Handover;

- revalidation of Build where needed;

- fresh Review submission.

# **10. Return-to-Analysis Rules**

Return to Analysis when the problem is foundational.

Common reasons:

- capacity gap is unclear or unsupported;

- target learner group is wrong;

- baseline/current practice is missing or incorrect;

- K/S/M/E route was misclassified;

- Motivation/Environment gap was forced into course production;

- course-fit decision is invalid;

- safeguarding risk should have been identified earlier;

- indicator/standard linkage is incorrect at the diagnosis level.

Example comment:

> The diagnosis describes an Environment gap: CSOs lack internet access
> and devices. No separable Knowledge/Skill component is recorded. This
> should return to Analysis for course-fit clarification.

Return to Analysis should trigger downstream revalidation because Design
and Build may depend on the old Analysis record.

# **11. Specialist Review Routing**

Some issues require specialist review before approval.

Specialist review should be triggered when a course includes:

- safeguarding;

- child protection;

- GBV/protection;

- community feedback/complaints involving sensitive data;

- advocacy or civic-space risk;

- legal/regulatory guidance;

- donor compliance claims;

- proof submission involving organizational documents;

- accessibility barriers;

- data protection risk;

- AI-generated high-risk content.

Specialist reviewers may:

- approve;

- request revision;

- require redaction;

- require fictionalized examples;

- block Publish;

- escalate to DEC Admin.

Specialist review should be visible in the Review Record and Publish
readiness summary.

# **12. Review Comment Requirements**

Reviewer comments should be specific, actionable, and linked to course
elements.

Each comment should include:

| **Comment field**   | **Purpose**                                                                           |
|---------------------|---------------------------------------------------------------------------------------|
| Comment ID          | Unique comment                                                                        |
| Affected area       | Analysis, Design, Build, final test, proof, accessibility, safeguarding, AI, metadata |
| Affected block/item | Specific block/question/proof item where possible                                     |
| Severity            | Info, minor, required fix, blocking, specialist review                                |
| Comment text        | What needs attention                                                                  |
| Required action     | What creator should do                                                                |
| Reviewer role       | Who made comment                                                                      |
| Status              | Open, addressed, accepted, rejected, resolved                                         |
| Created date        | Audit trail                                                                           |

Weak comment:

> Improve this section.

Better comment:

> Block 4 explains outcome evidence but does not connect to the
> worksheet practice. Add one short worked example or link the block to
> Required Action 2.

# **13. Review Severity Levels**

The platform should classify review issues by severity.

| **Severity**      | **Meaning**                             | **Publish impact**             |
|-------------------|-----------------------------------------|--------------------------------|
| Info              | Optional note or improvement suggestion | Does not block                 |
| Minor             | Small fix recommended                   | May not block if admin accepts |
| Required fix      | Must be fixed before approval           | Blocks approval                |
| Blocking          | Serious issue prevents approval         | Blocks Review approval         |
| Specialist review | Needs assigned specialist decision      | Blocks Publish until resolved  |

Examples:

| **Issue**                             | **Severity**                                   |
|---------------------------------------|------------------------------------------------|
| Minor typo                            | Minor                                          |
| Missing alt text for key image        | Required fix                                   |
| Final test threshold wrong            | Blocking                                       |
| Proof upload asks for real case files | Blocking + specialist review                   |
| AI-generated scenario unreviewed      | Required fix or specialist review if sensitive |
| Course addresses wrong capacity gap   | Blocking; return to Analysis                   |

# **14. Review Approval Criteria**

A course can be approved for Publish only when:

- Analysis reference is valid;

- Design reference is valid;

- required blocks are built;

- creator-added blocks are justified;

- AI outputs are human-reviewed;

- final test is aligned and approved;

- certificate threshold is 80%+;

- proof pathway is safe and approved where enabled;

- badge wording does not overclaim;

- accessibility issues are resolved;

- safeguarding/data safety issues are resolved;

- learner preview works;

- required reviewer comments are closed;

- specialist review is complete where needed.

Review approval should create a **Course Review Record**.

# **15. Course Review Record Specification**

Recommended fields:

| **Field**                    | **Required?**  | **Purpose**                                 |
|------------------------------|----------------|---------------------------------------------|
| Review Record ID             | Yes            | Unique review record                        |
| Course ID                    | Yes            | Course reference                            |
| Course version draft ID      | Yes            | Version under review                        |
| Submitted by                 | Yes            | Creator accountability                      |
| Review start date            | Yes            | Timeline                                    |
| Review decision              | Yes            | Approved, returned, specialist review, etc. |
| Review tracks completed      | Yes            | Shows which review types were done          |
| Required fixes summary       | If any         | Creator action                              |
| Specialist review status     | If relevant    | Safety/accessibility readiness              |
| Final test validation        | Yes            | Confirms test quality                       |
| Certificate rule validation  | Yes            | Confirms 80%+                               |
| Practical proof validation   | If enabled     | Confirms proof/badge setup                  |
| Accessibility validation     | Yes            | Learner access readiness                    |
| Safeguarding/data validation | Where relevant | Safety readiness                            |
| Learner preview validation   | Yes            | Runtime readiness                           |
| Approved by                  | If approved    | Reviewer/admin                              |
| Decision date                | Yes            | Audit trail                                 |
| Return target                | If returned    | Build, Design, or Analysis                  |
| Notes                        | Optional       | Decision rationale                          |

# **16. Publish Unlock Rule**

Publish unlocks only when:

- a Course Review Record exists;

- decision is Approved for Publish or equivalent;

- no blocking comments remain open;

- no specialist review remains unresolved;

- final test and 80% certificate rule are approved;

- proof pathway is approved where enabled;

- accessibility and safeguarding readiness are confirmed;

- user has Publisher/Admin permission.

If any condition fails, Publish should remain locked with a clear
reason.

Example message:

> Publish is locked because the course has not yet been approved in
> Review.

Another example:

> Publish is locked because safeguarding specialist review is still
> required.

# **17. Publish Setup Requirements**

Before publishing, the publisher/admin should confirm publication
settings.

Required fields:

| **Publish field**           | **Required?** | **Purpose**                  |
|-----------------------------|---------------|------------------------------|
| Course title                | Yes           | Catalog display              |
| Short description           | Yes           | Learner understanding        |
| Capacity area               | Yes           | Catalog/monitoring           |
| Target learner group        | Yes           | Relevance                    |
| Estimated duration          | Recommended   | Learner planning             |
| Language                    | Yes           | Localization                 |
| Course level                | Optional      | Catalog filtering            |
| Certificate available       | Yes           | Learner expectation          |
| Certificate threshold       | Yes           | Must be 80%+                 |
| Practical proof available   | If enabled    | Separate proof pathway       |
| Badge/achievement available | If enabled    | Recognition setting          |
| Visibility setting          | Yes           | Who can access               |
| Enrollment setting          | Yes           | How learners join            |
| Release type                | Yes           | Publish now, schedule, pilot |
| Version number              | Yes           | Evidence integrity           |
| Publisher                   | Yes           | Accountability               |
| Publish date                | Yes           | Release record               |

# **18. Publish Decision Options**

Publisher/Admin should have clear options.

| **Publish decision**   | **Meaning**                        | **Result**                            |
|------------------------|------------------------------------|---------------------------------------|
| Publish now            | Release immediately                | Course status becomes Published       |
| Schedule publish       | Release at future date/time        | Course status becomes Scheduled       |
| Publish to pilot       | Release to selected pilot group    | Course status becomes Pilot Published |
| Keep as approved draft | Do not release yet                 | Course remains Approved for Publish   |
| Return to Review       | Issue found during publish setup   | Course returns to Review              |
| Archive                | Course should not proceed          | Course archived                       |
| Create revision draft  | For published course needing edits | Revision workflow begins              |

# **19. Published Course Record Specification**

When a course is published, the system should create a Published Course
Record.

Recommended fields:

| **Field**               | **Required?** | **Purpose**                                     |
|-------------------------|---------------|-------------------------------------------------|
| Published Course ID     | Yes           | Unique published record                         |
| Course ID               | Yes           | Course reference                                |
| Course version ID       | Yes           | Exact published version                         |
| Review Record ID        | Yes           | Link to approval                                |
| Published title         | Yes           | Learner-facing title                            |
| Published description   | Yes           | Catalog text                                    |
| Capacity area           | Yes           | Monitoring/taxonomy                             |
| Target learner group    | Yes           | Learner relevance                               |
| Language                | Yes           | Localization                                    |
| Certificate setting     | Yes           | Certifying/non-certifying                       |
| Certificate threshold   | Yes           | 80%+                                            |
| Practical proof setting | If enabled    | Proof pathway                                   |
| Badge setting           | If enabled    | Recognition pathway                             |
| Visibility setting      | Yes           | Learner access                                  |
| Enrollment setting      | Yes           | Access control                                  |
| Release type            | Yes           | Public, restricted, pilot, scheduled            |
| Version number          | Yes           | Version integrity                               |
| Published by            | Yes           | Accountability                                  |
| Published at            | Yes           | Timestamp                                       |
| Status                  | Yes           | Published, scheduled, pilot, archived, replaced |
| Notes/conditions        | Optional      | Publication context                             |

# **20. Version Control Rules**

Published courses should be version-controlled.

Core rule:

> Published learner-facing content should be stable. Major changes
> should create a revision draft or new version.

## **20.1 Minor updates**

May be handled through a minor update log:

- typo correction;

- broken link fix;

- alt text improvement;

- transcript correction;

- minor wording clarification.

## **20.2 Major updates**

Should create a revision draft and require Review:

- final test change;

- performance goal change;

- required block change;

- Storyboard sequence change;

- practical proof criteria change;

- badge wording change;

- safeguarding instruction change;

- capacity area change;

- target learner group change;

- major content rewrite.

## **20.3 Learner record integrity**

Learner progress, final test scores, certificates, proof submissions,
verified achievements, and feedback should remain linked to the course
version completed.

# **21. Archive and Retire Routing**

A course may be archived when:

- it is outdated;

- it is replaced by a newer version;

- it contains unresolved safety issue;

- it no longer aligns with DEC priorities;

- pilot is complete and not continued;

- course quality is insufficient;

- donor/policy guidance changed.

Archiving should:

- stop new enrollments;

- preserve historical learner records;

- preserve certificates already issued unless revoked separately;

- preserve monitoring data;

- mark course as inactive.

# **22. Review-to-Publish UI Behavior**

The UI should make next actions clear.

## **22.1 Creator view**

Creator sees:

- submitted status;

- reviewer comments;

- returned items;

- approval status;

- whether course is waiting for publisher.

Creator should not see or use publish button unless they also have
publisher/admin role.

## **22.2 Reviewer view**

Reviewer sees:

- course handovers;

- reviewer attention list;

- review checklist;

- decision options;

- return routing;

- unresolved comments;

- specialist review status.

## **22.3 Publisher/Admin view**

Publisher sees:

- approved courses awaiting publication;

- metadata readiness;

- visibility settings;

- version fields;

- final preview;

- publish/schedule/pilot/archive actions.

## **22.4 Learner view**

Learner sees only published courses or assigned courses.

Learner should not see:

- Review comments;

- publish metadata controls;

- workflow handover records;

- internal version draft states.

# **23. Review and Publish Safety Checks**

Publish should be blocked if any of these are true:

- Review approval missing;

- required fixes open;

- specialist review unresolved;

- final test missing for certifying course;

- certificate threshold is not 80%+;

- practical proof is incorrectly required for certificate;

- proof pathway lacks safety warning;

- raw proof visibility is donor-facing by default;

- badge wording overclaims;

- learner preview failed;

- course metadata incomplete;

- publisher lacks permission.

# **24. Minimum Phase 1 Requirements**

For Phase 1, Codex should minimally implement or align:

1.  Build-to-Review Handover submission.

2.  Review queue or Review state.

3.  Review decision options: approve, return to Build, return to Design,
    return to Analysis, specialist review required, not approved.

4.  Review comments with status and severity.

5.  Review Record creation.

6.  Publish locked until Review approval.

7.  Role-sensitive Publish access.

8.  Publication metadata confirmation.

9.  80% certificate rule confirmation before Publish.

10. Practical proof/badge setup validation where enabled.

11. Published Course Record.

12. Version number/state.

13. Learner access only after Publish.

14. Archive or unpublish path.

15. Basic audit trail for Review and Publish decisions.

# **25. Future Enhancements**

Future versions may add:

- multi-reviewer assignment workflow;

- parallel review tracks;

- reviewer workload dashboards;

- review deadlines/SLA tracking;

- automated reviewer routing by risk;

- publish scheduling calendar;

- cohort release management;

- multilingual version branching;

- advanced version diffing;

- public release notes;

- approval chains;

- admin override policy dashboard;

- reviewer performance analytics.

These should not delay the Phase 1 Review/Publish separation and routing
logic.

# **26. Implementation Guidance for Codex**

Codex should implement Review and Publish as separate states, routes,
and actions using the existing repo architecture where possible.

## **26.1 Required implementation behavior**

Codex should:

- preserve Review/Publish separation;

- inspect current route/state model before changes;

- add or align Review Record;

- add return routing to Build/Design/Analysis;

- block Publish until Review approval;

- restrict Publish to Publisher/Admin role;

- create Published Course Record on release;

- maintain version link;

- ensure final test threshold is 80%+ before Publish;

- ensure proof pathway validation where enabled;

- hide Review/Publish internals from learners.

## **26.2 What Codex should not do**

Codex should not:

- allow creators to publish by default;

- publish directly from Build;

- merge Review and Publish;

- bypass unresolved specialist review;

- publish a course with 90% certificate threshold;

- publish proof pathway without safety guidance;

- expose raw proof or reviewer comments to learners/donors;

- edit published content directly without revision/version handling;

- remove existing working review/publish behavior without justification.

## **26.3 Acceptance criteria examples**

Given a course is built but not submitted for Review,

when a user opens Publish,

then Publish is locked and explains that Review approval is required.

Given a reviewer returns a course to Build,

when the creator opens the course,

then the affected Build items and reviewer comments are visible and the
course is no longer Approved for Publish.

Given a reviewer approves a course for Publish,

when an authorized Publisher opens Publish,

then publication metadata and visibility settings are available for
confirmation.

Given a course is approved for Publish,

when a Course Creator without Publisher/Admin role opens the Publish
page,

then the publish action is hidden or disabled with a role explanation.

Given a course is published,

when a learner accesses the learner catalog,

then the course is visible according to its visibility/enrollment
settings and internal Review metadata is hidden.

Given a published course needs a final test change,

when the creator edits it,

then the system creates or requires a revision draft rather than
directly changing the live version.

# **27. Recommended Repo Placement**

This annex should be saved as:

docs/specs/core-workflow/ANNEX_10_REVIEW_AND_PUBLISH_DECISION_ROUTING.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_10_REVIEW_AND_PUBLISH_DECISION_ROUTING.md

Defines Review decision options, return paths to Build/Design/Analysis,
specialist review routing, Publish unlock rules, publication metadata,
version control, archive behavior, and Codex acceptance criteria.

# **28. Success Standard for This Annex**

This annex is successful when:

> Codex and developers can implement a Review and Publish workflow where
> courses move from Build to Review through a structured handover,
> reviewers make clear routing decisions, Publish remains locked until
> approval, authorized publishers release versioned courses, and
> learners only access courses after controlled publication.

In practical terms, this annex should prevent:

> “A creator finishes Build and the course goes live without Review or
> version control.”

And ensure:

> “A course is submitted through Build-to-Review Handover, reviewed with
> clear decisions, approved for Publish, released by an authorized
> publisher, versioned correctly, and made visible only to the intended
> learners.”

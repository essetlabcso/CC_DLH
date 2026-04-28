# Annex 3: Workflow State, Gate, and Record Matrix

## DEC Learning Hub Course Creator Portal

## 1. Purpose of This Annex

This annex defines the **workflow states, phase gates, required records, unlock conditions, return paths, and traceability logic** for the DEC Learning Hub Course Creator Portal.

Its purpose is to help Codex/GPT-5.5, developers, reviewers, and DEC stakeholders implement the Course Creator Portal as a governed workflow system rather than a loose collection of pages.

This annex should guide:

- route gating;

- dashboard status labels;

- workflow progress tracker behavior;

- handover creation;

- approval and locking behavior;

- review return paths;

- publication control;

- learner runtime state;

- certificate and proof state;

- monitoring records;

- version-aware evidence.

The core rule is:

> Each phase should produce a clear record. Each gate should have a clear unlock condition. Each course should have a visible state. Each return path should preserve traceability and reviewer comments.

# 2. Workflow Spine

The full DEC Learning Hub workflow spine is:

> **Setup → Analysis → Capacity Map → Action Map → Learning Design → Storyboard → Build → Preview → Review → Publish → Learner Runtime → Certificate → Optional Practical Proof → Verified Achievement → Monitoring and Evaluation**

For implementation, these are grouped into six major gated workflow areas:

| **Gated workflow area**   | **Main purpose**                                                                                                              |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Analysis Gate             | Confirms evidence, baseline, root cause, K/S/M/E route, course-fit decision, safeguards, and evaluation anchor                |
| Design Gate               | Converts approved Analysis into performance goal, Action Map, Learning Design Document, Storyboard, and build-ready handover  |
| Build Gate                | Converts approved Design into learner-facing course, final test, optional proof pathway, preview, and review-ready handover   |
| Review Gate               | Checks alignment, quality, safety, accessibility, assessment, certificate logic, proof pathway, and learner runtime readiness |
| Publish Gate              | Releases reviewed course version to learners through authorized role and visibility/version controls                          |
| Monitoring and Evaluation | Tracks learner progress, final test, certificates, proof, verified achievements, feedback, and improvement evidence           |

# 3. High-Level Gate Matrix

| **Gate**              | **Required record**                       | **Required before unlock**                                                                                                                                                                                                                                     | **Unlocks**                                                                                         |
|-----------------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Analysis Gate         | Analysis-to-Design Handover               | Validated capacity gap, baseline/current practice, desired practice, evidence source, root cause, K/S/M/E route, course-fit decision, safeguards/no-harm note, evaluation anchor, lock/approval                                                                | Capacity Map and Design workflow                                                                    |
| Design Gate           | Design-to-Build Handover                  | Capacity objective, performance goal, Capacity Action Map, Learning Design Document, Storyboard/Block Plan, scenario/practice plan where needed, assessment intent, accessibility/localization needs, safeguarding constraints, AI authoring context, approval | Build Studio                                                                                        |
| Build Gate            | Build-to-Review Handover                  | Required blocks built, creator-added blocks purpose-tagged/justified, AI outputs reviewed, final test configured, 80% certificate rule confirmed, learner preview completed, practical proof setup checked if enabled                                          | Review                                                                                              |
| Review Gate           | Course Review Record                      | Review approval, required fixes closed, safety/accessibility/test/certificate/proof checks passed, specialist review completed if required                                                                                                                     | Publish                                                                                             |
| Publish Gate          | Published Course Record                   | Authorized publisher/admin, metadata complete, visibility selected, version assigned, final learner preview confirmed, publication action recorded                                                                                                             | Learner Runtime                                                                                     |
| Monitoring Activation | Published Course Record + runtime records | Course is published/live or assigned                                                                                                                                                                                                                           | Dashboards, analytics, feedback, certificate registry, proof tracking, verified achievement records |

# 4. Core Workflow Records

Each major phase should create or update a record. These records preserve the traceability chain.

| **Record**                             | **Created in**                 | **Purpose**                                                                              |
|----------------------------------------|--------------------------------|------------------------------------------------------------------------------------------|
| Course Draft Record                    | Setup                          | Basic course identity and ownership                                                      |
| Analysis-to-Design Handover            | Analysis                       | Locks evidence base and course-fit decision                                              |
| Capacity Map Record                    | Design                         | Links course to capacity area, learner group, indicator, and desired practice            |
| Capacity Action Map Record             | Design                         | Defines performance goal, required actions, practice activities, and minimum information |
| Learning Design Document               | Design                         | Defines learning pathway, assessment approach, safeguards, accessibility, and AI context |
| Storyboard and Block Plan              | Design                         | Defines lesson and block sequence before Build                                           |
| Design-to-Build Handover               | Design                         | Consolidates approved design package and unlocks Build                                   |
| Course Build Record                    | Build                          | Stores built course shell, lessons, blocks, and block metadata                           |
| AI Drafting and Review Log             | Build                          | Tracks AI-assisted content and human review status                                       |
| Final Test Record                      | Build                          | Stores final test items, scoring, and 80% certificate rule                               |
| Practical Proof Configuration Record   | Build                          | Stores optional proof instructions, accepted proof types, safety notes, and badge link   |
| Build-to-Review Handover               | Build                          | Confirms built course is ready for Review                                                |
| Course Review Record                   | Review                         | Stores review decisions, comments, approvals, returns, and specialist review status      |
| Published Course Record                | Publish                        | Stores published version, metadata, visibility, release settings, and publisher          |
| Learner Progress Record                | Learner Runtime                | Tracks learner progress through published course version                                 |
| Final Test Attempt Record              | Learner Runtime                | Tracks attempts, scores, and pass/certificate eligibility                                |
| Certificate Record                     | Learner Runtime                | Records certificate issued at 80%+ final test score                                      |
| Proof Submission Record                | Learner Runtime / Proof Review | Tracks practical proof submission and review status                                      |
| Verified Achievement / Badge Record    | Proof Review                   | Records accepted proof and capacity-linked recognition                                   |
| Learner Feedback Record                | Monitoring                     | Captures learner feedback                                                                |
| Course Improvement Log                 | Monitoring                     | Tracks issues, decisions, revisions, and improvement actions                             |
| Organization Capacity Evidence Summary | Monitoring                     | Aggregates safe organization-level certificates and verified achievements                |

# 5. User-Facing Workflow State Labels

These labels should appear on dashboards, course cards, progress trackers, and workspace headers.

| **State label**           | **Meaning**                                                                |
|---------------------------|----------------------------------------------------------------------------|
| Draft                     | Course has started but no major gate is complete                           |
| Setup                     | Basic course information is being prepared                                 |
| Analysis in progress      | Diagnosis/Analysis fields are being completed                              |
| Analysis ready to lock    | Required Analysis fields are complete                                      |
| Analysis locked           | Analysis-to-Design Handover is approved/locked                             |
| Design in progress        | Capacity Map, Action Map, Learning Design, or Storyboard is being prepared |
| Design ready for approval | Required Design fields are complete                                        |
| Design approved           | Design-to-Build Handover is approved                                       |
| Build in progress         | Course content, blocks, final test, or proof setup is being built          |
| Build ready for review    | Build-to-Review Handover is complete                                       |
| Submitted for review      | Course is awaiting reviewer decision                                       |
| Under review              | Reviewer is actively reviewing                                             |
| Returned for revision     | Course has been returned to an earlier phase                               |
| Approved for publish      | Review is approved and Publish can open                                    |
| Scheduled                 | Course is scheduled for release                                            |
| Published                 | Course is live for learners                                                |
| Revision draft            | Published course is being revised                                          |
| Archived                  | Course is inactive or retired                                              |

Internal implementation can use technical enum values, but the user-facing labels should remain clear and non-technical.

# 6. Phase State Matrix

## 6.1 Setup States

| **State**         | **Condition**                          | **Allowed next action**    |
|-------------------|----------------------------------------|----------------------------|
| Not started       | No course draft exists                 | Create course draft        |
| Setup in progress | Basic metadata incomplete              | Complete course setup      |
| Setup complete    | Required setup fields complete         | Start or continue Analysis |
| Setup returned    | Reviewer/admin returned setup metadata | Revise setup               |

Minimum required setup fields may include:

- working title;

- course owner;

- target learner group, if known;

- initial capacity area, if known;

- course language;

- draft status.

## 6.2 Analysis States

| **State**              | **Condition**                                             | **Allowed next action**                           |
|------------------------|-----------------------------------------------------------|---------------------------------------------------|
| Analysis not started   | Course exists but Analysis record absent                  | Start Analysis                                    |
| Analysis in progress   | Required Analysis fields incomplete                       | Complete Analysis fields                          |
| Analysis blocked       | K/S/M/E or course-fit decision prevents course production | Revise diagnosis or route outside course workflow |
| Analysis ready to lock | Required fields complete and route/course-fit valid       | Lock Analysis for Design                          |
| Analysis locked        | Handover approved/locked                                  | Proceed to Capacity Map / Design                  |
| Analysis returned      | Review or admin returned course to Analysis               | Revise and relock                                 |
| Analysis archived      | Gap not suitable or course discontinued                   | Stop course workflow or create new course         |

## 6.3 Design States

| **State**                   | **Condition**                       | **Allowed next action**               |
|-----------------------------|-------------------------------------|---------------------------------------|
| Design blocked              | Analysis not locked                 | Complete and lock Analysis            |
| Capacity Map in progress    | Capacity mapping incomplete         | Complete Capacity Map                 |
| Action Map in progress      | Action Map incomplete               | Complete Action Map                   |
| Learning Design in progress | Learning Design Document incomplete | Complete Learning Design              |
| Storyboard in progress      | Storyboard/Block Plan incomplete    | Complete Storyboard                   |
| Design ready for approval   | Required design components complete | Approve/lock Design-to-Build Handover |
| Design approved             | Handover approved                   | Proceed to Build                      |
| Design returned             | Review returned course to Design    | Revise and reapprove                  |
| Design archived             | Course discontinued before Build    | Stop workflow                         |

## 6.4 Build States

| **State**                 | **Condition**                                                               | **Allowed next action**           |
|---------------------------|-----------------------------------------------------------------------------|-----------------------------------|
| Build blocked             | Design-to-Build Handover not approved                                       | Complete Design Gate              |
| Build shell created       | Build Studio opened and course shell exists                                 | Build required blocks             |
| Build in progress         | Required blocks/content/test incomplete                                     | Continue Build                    |
| Build warnings unresolved | Missing purpose tags, AI review, accessibility, proof safety, or test setup | Resolve warnings                  |
| Build ready for preview   | Required course content and test are present                                | Preview as learner                |
| Preview complete          | Learner preview completed                                                   | Complete Build-to-Review Handover |
| Build ready for review    | Handover complete                                                           | Submit for Review                 |
| Submitted for review      | Course submitted                                                            | Wait for Review                   |
| Build returned            | Review returned course to Build                                             | Revise and resubmit               |
| Build archived            | Course discontinued before Review                                           | Stop workflow                     |

## 6.5 Review States

| **State**                  | **Condition**                                                 | **Allowed next action**                      |
|----------------------------|---------------------------------------------------------------|----------------------------------------------|
| Review not started         | Build not submitted                                           | Submit Build-to-Review Handover              |
| Submitted for review       | Course awaiting review                                        | Reviewer opens review                        |
| Under review               | Reviewer is reviewing                                         | Add comments and decision                    |
| Specialist review required | Sensitive/accessibility/platform issue needs specialist check | Complete specialist review                   |
| Returned to Build          | Build-level issue found                                       | Creator revises Build                        |
| Returned to Design         | Design-level issue found                                      | Creator revises Design and reapproves        |
| Returned to Analysis       | Diagnosis/course-fit issue found                              | Creator/admin revises Analysis and relocks   |
| Approved with minor fixes  | Small issues remain                                           | Creator/admin closes fixes or admin confirms |
| Approved for publish       | Review passed                                                 | Proceed to Publish                           |
| Not approved               | Course should not proceed                                     | Pause, archive, or major revision            |

## 6.6 Publish States

| **State**        | **Condition**                                                   | **Allowed next action**               |
|------------------|-----------------------------------------------------------------|---------------------------------------|
| Publish locked   | Review not approved                                             | Complete Review                       |
| Ready to publish | Review approved, metadata incomplete or pending                 | Complete publication settings         |
| Publish blocked  | Missing metadata, visibility, version, safety, or authorization | Resolve blockers                      |
| Scheduled        | Publication scheduled                                           | Wait for release or edit schedule     |
| Published        | Course live for learners                                        | Monitor or create revision            |
| Pilot published  | Course live for pilot group only                                | Monitor pilot or expand release       |
| Archived         | Course inactive                                                 | Preserve records; stop new enrollment |
| Replaced         | New version published                                           | Preserve historical records           |

## 6.7 Learner Runtime States

| **Learner state**            | **Meaning**                                   |
|------------------------------|-----------------------------------------------|
| Not enrolled / not assigned  | Learner has no access                         |
| Available                    | Course visible and accessible                 |
| Not started                  | Learner has access but has not begun          |
| In progress                  | Learner started the course                    |
| Lessons completed            | Required lessons/blocks completed             |
| Final test available         | Learner can take the final test               |
| Final test attempted         | Learner submitted an attempt                  |
| Not passed                   | Learner scored below 80%                      |
| Passed / certificate earned  | Learner scored 80%+ and certificate is issued |
| Completed                    | Course completion recorded                    |
| Feedback requested           | Learner may submit feedback                   |
| Practical proof available    | Optional proof pathway is enabled             |
| Practical proof submitted    | Learner submitted proof                       |
| Verified achievement awarded | Proof accepted and badge/achievement issued   |

## 6.8 Practical Proof States

| **Proof state**              | **Meaning**                                 |
|------------------------------|---------------------------------------------|
| Not enabled                  | Course does not include proof pathway       |
| Available                    | Proof pathway is available to learner/CSO   |
| Draft saved                  | Learner started proof but has not submitted |
| Submitted                    | Proof submitted for review                  |
| Under review                 | Verifier is reviewing                       |
| Revision requested           | Learner must revise, complete, or redact    |
| Accepted                     | Proof meets criteria                        |
| Rejected                     | Proof does not meet criteria                |
| Unsafe / redaction required  | Submission contains unsafe data             |
| Escalated                    | Specialist review required                  |
| Verified achievement awarded | Badge or achievement issued                 |
| Withdrawn / removed          | Submission removed or withdrawn             |

Certificate state must remain independent from proof state.

## 6.9 Version States

| **Version state** | **Meaning**                             |
|-------------------|-----------------------------------------|
| Draft version     | Version being prepared                  |
| Approved version  | Passed Review but not published         |
| Scheduled version | Approved and scheduled                  |
| Published version | Live for learners                       |
| Pilot version     | Live for selected pilot group           |
| Revision draft    | Draft based on a published version      |
| Replaced version  | Older version replaced by newer version |
| Archived version  | No longer active for new learners       |

# 7. Gate Unlock Conditions

## 7.1 Analysis Gate Unlocks Design

Design unlocks only when:

- capacity gap statement exists;

- baseline/current practice exists;

- desired practice exists;

- evidence source exists;

- root cause summary exists;

- K/S/M/E route exists;

- course-fit decision is valid;

- Knowledge or Skill route is selected, or separable Knowledge/Skill component is recorded for Mixed/Motivation/Environment;

- safeguards/no-harm note exists;

- evaluation anchor exists;

- Analysis-to-Design Handover is locked/approved.

Blocked behavior:

- Environment-only gaps do not unlock Design.

- Motivation-only gaps do not unlock Design.

- Mixed gaps without explicit course-addressable K/S component do not unlock Design.

## 7.2 Design Gate Unlocks Build

Build unlocks only when:

- Analysis Handover is locked;

- capacity objective is complete;

- performance goal is observable;

- Capacity Action Map is complete;

- Learning Design Document is complete;

- Storyboard/Block Plan is complete;

- Scenario/Practice Planner is complete where needed;

- assessment intent is defined;

- accessibility/localization requirements are captured;

- safeguarding/civic-space constraints are captured;

- AI authoring context is defined;

- Design-to-Build Handover is approved/locked.

## 7.3 Build Gate Unlocks Review

Review opens only when:

- Design Handover is approved;

- course shell is created;

- required blocks are present;

- required blocks have content;

- creator-added blocks have purpose tags and justification;

- AI-generated outputs are reviewed or rejected;

- final test is configured;

- final test certificate rule is set to 80%+;

- practical proof pathway is safe if enabled;

- accessibility warnings are resolved or flagged;

- learner preview is completed;

- Build-to-Review Handover is complete.

## 7.4 Review Gate Unlocks Publish

Publish unlocks only when:

- Review record exists;

- required review tracks are complete;

- final test is approved;

- 80% certificate rule is confirmed;

- practical proof/badge setup is approved where enabled;

- safeguarding/data safety issues are resolved;

- accessibility/localization issues are resolved;

- learner preview functionality is confirmed;

- review decision is “Approved for Publish” or equivalent;

- no blocking specialist review remains unresolved.

## 7.5 Publish Gate Unlocks Learner Runtime

Learner access opens only when:

- Review is approved;

- authorized publisher/admin performs publish action;

- publication metadata is complete;

- visibility/enrollment setting is selected;

- version number is assigned;

- Published Course Record is created;

- course status is Published, Scheduled, or Pilot Published according to release settings.

# 8. Return Paths and Revalidation Rules

The platform should allow courses to move backward when issues are found.

| **Issue type**                                         | **Return path**                      | **Revalidation required**                                 |
|--------------------------------------------------------|--------------------------------------|-----------------------------------------------------------|
| Missing content, unclear block, formatting issue       | Return to Build                      | Build-to-Review Handover updated                          |
| Creator-added block scope drift                        | Return to Build or Design            | Added Block Register reviewed; Design reapproval if major |
| Final test issue                                       | Return to Build                      | Final Test Record updated and Review repeated             |
| Incorrect certificate rule                             | Return to Build/Admin correction     | 80% rule confirmed before Review approval                 |
| Weak performance goal                                  | Return to Design                     | Design-to-Build Handover reapproved                       |
| Missing practice logic                                 | Return to Design                     | Storyboard/Practice Planner updated                       |
| Wrong capacity area or learner group                   | Return to Analysis                   | Analysis Handover relocked; Design/Build revalidated      |
| Motivation/Environment issue wrongly treated as course | Return to Analysis                   | Course-fit decision corrected                             |
| Safeguarding issue in proof pathway                    | Return to Build or specialist review | Safety note/proof config approved                         |
| Publication metadata issue                             | Return to Publish setup              | Published Course Record updated before release            |
| Post-publication content issue                         | Create revision draft                | Review and publish new version as needed                  |

Major changes to an earlier gate should require downstream revalidation.

# 9. Locking and Editability Matrix

| **Item**                 | **Draft state**                | **Locked/approved state**                 | **Published state**                             |
|--------------------------|--------------------------------|-------------------------------------------|-------------------------------------------------|
| Course setup             | Editable                       | Limited edit                              | Metadata changes through publish/admin controls |
| Analysis Handover        | Editable                       | Read-only unless reopened                 | Read-only; new version/revision if major        |
| Capacity Map             | Editable during Design         | Read-only in Build unless Design reopened | Read-only for published version                 |
| Action Map               | Editable during Design         | Read-only in Build unless Design reopened | Read-only for published version                 |
| Learning Design Document | Editable during Design         | Read-only in Build unless Design reopened | Read-only for published version                 |
| Storyboard/Block Plan    | Editable during Design         | Read-only reference in Build              | Read-only for published version                 |
| Required blocks          | Not applicable before Build    | Editable for content; removal warns       | Locked for published version                    |
| Creator-added blocks     | Editable                       | Reviewable; may require revision          | Locked for published version                    |
| AI Drafting Log          | Editable until Review          | Read-only review evidence                 | Read-only audit evidence                        |
| Final Test Record        | Editable before Review         | Locked after approval unless returned     | Locked for published version                    |
| Practical Proof Config   | Editable before Review         | Locked after approval unless returned     | Locked for published version                    |
| Review Record            | Not applicable                 | Read-only after decision                  | Read-only evidence                              |
| Published Course Record  | Not applicable                 | Not applicable                            | Read-only except admin lifecycle actions        |
| Learner Progress Record  | Not applicable                 | Runtime-generated                         | Historical evidence                             |
| Certificate Record       | Not applicable                 | Runtime-generated                         | Should not be casually edited                   |
| Proof Submission         | Learner editable before submit | Restricted after submit                   | Restricted evidence                             |
| Verified Achievement     | Not applicable                 | Verifier/admin controlled                 | Restricted evidence                             |

# 10. Role-Based State Visibility

| **Role**                 | **Should see**                                                                                          |
|--------------------------|---------------------------------------------------------------------------------------------------------|
| Course Creator           | Course state, next action, blocked gates, returned comments, Build warnings, monitoring for own courses |
| DEC Admin                | All workflow states, overrides, audit trail, publish status, monitoring                                 |
| Reviewer                 | Submitted courses, handovers, reviewer attention list, review state, return paths                       |
| Publisher                | Approved for Publish, metadata readiness, version state, release settings                               |
| Learner                  | Course access, progress, final test state, certificate state, proof state                               |
| Organization Admin       | Safe organization-level summaries                                                                       |
| Proof Verifier           | Proof submission state and verification decision                                                        |
| Donor Viewer, if enabled | Safe consent-based verified achievement summaries only                                                  |

Learners should not see internal workflow labels such as “Design-to-Build Handover.” They should see learner-friendly labels such as “Course in progress,” “Final test available,” or “Certificate earned.”

# 11. Audit Trail Events

The platform should record major workflow events.

Recommended audit events:

| **Event**                          | **Trigger**                                         |
|------------------------------------|-----------------------------------------------------|
| Course draft created               | Creator starts course                               |
| Analysis locked                    | Analysis-to-Design Handover approved                |
| Analysis reopened                  | Admin/reviewer reopens Analysis                     |
| Design approved                    | Design-to-Build Handover approved                   |
| Design reopened                    | Course returned to Design                           |
| Build started                      | Build Studio opened after Design approval           |
| Creator-added block added          | Creator adds block outside required design sequence |
| AI output accepted/edited/rejected | Human reviews AI output                             |
| Final test configured              | Creator/admin configures final test                 |
| Build submitted for Review         | Build-to-Review Handover submitted                  |
| Review decision made               | Reviewer approves, returns, or escalates            |
| Specialist review requested        | Safety/accessibility/platform issue flagged         |
| Course approved for Publish        | Review passes                                       |
| Course published                   | Authorized publisher releases course                |
| Course archived                    | Admin/publisher archives course                     |
| Revision draft created             | Published course enters revision                    |
| Learner enrolled                   | Learner gains access                                |
| Final test submitted               | Learner completes test                              |
| Certificate issued                 | Learner scores 80%+                                 |
| Practical proof submitted          | Learner/CSO submits proof                           |
| Proof review decision made         | Verifier accepts/rejects/requests revision          |
| Verified achievement awarded       | Accepted proof generates badge/achievement          |
| Visibility changed                 | Admin/org changes achievement visibility            |

Each audit event should record:

- user ID or role;

- timestamp;

- course ID;

- version ID where applicable;

- action;

- short reason/note where relevant.

# 12. Minimum Phase 1 Matrix Requirements

For Phase 1, the platform should minimally support:

1.  Clear user-facing course state labels.

2.  Analysis-to-Design Handover and lock behavior.

3.  Design-to-Build Handover and Build unlock behavior.

4.  Build-to-Review Handover and Review submission behavior.

5.  Review decision record with return paths.

6.  Publish locked until Review approval.

7.  Published Course Record and version state.

8.  Learner progress states.

9.  Final test attempt and certificate record at 80%+.

10. Practical proof states where enabled.

11. Verified achievement/badge state where enabled.

12. Monitoring records linked to published version.

13. Basic audit trail for major transitions.

14. Role-aware visibility and actions.

15. Return/revision paths that preserve history.

Advanced workflow automation, complex approval chains, detailed SLA management, and full audit compliance can be future enhancements.

# 13. Implementation Guidance for Codex

Codex should use this annex to align route gating, state labels, handover records, and return paths with the intended DEC workflow.

Codex should not introduce a large workflow-engine rewrite unless needed and explicitly approved.

Implementation should proceed in safe slices:

1.  Analysis Gate state and handover.

2.  Design Gate state and handover.

3.  Build Gate and block readiness.

4.  Review decision routing.

5.  Publish/version behavior.

6.  Learner runtime states.

7.  Monitoring state records.

Acceptance criteria should be observable.

Examples:

Given an Analysis record diagnosed as Environment-only,

when the creator attempts to proceed to Design,

then Design remains blocked and the system explains that a separable Knowledge/Skill component is required.

Given a course has no approved Design-to-Build Handover,

when the creator attempts to open Build Studio,

then Build remains locked and the missing Design requirements are shown.

Given a learner scores 80% on the final test,

when the attempt is saved,

then the learner state becomes Passed / certificate earned and a Certificate Record is created.

Given a course is approved for Publish,

when a user without publisher/admin permission opens the Publish page,

then the publish action is disabled or hidden with a clear role explanation.

# 14. Success Standard for This Annex

This annex is successful when:

> Codex and developers can determine the correct state of a course, the record required at each phase, the gate that unlocks the next phase, the correct return path when issues arise, and the evidence records that must remain linked from Analysis through learner runtime and monitoring.

In practical terms, this annex should prevent:

> “A course moves from Build to Publish without Review, or a learner certificate is issued without a traceable course version.”

And ensure:

> “Every course has a clear state, every gate has a required record, every published version is traceable, every certificate follows the 80% rule, and every proof/achievement record remains separate from course certification.”

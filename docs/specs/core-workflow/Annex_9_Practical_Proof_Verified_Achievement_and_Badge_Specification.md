# Annex 9: Practical Proof, Verified Achievement, and Badge Specification
## DEC Learning Hub Course Creator Portal
## 1. Purpose of This Annex
This annex defines the **Practical Proof, Verified Achievement, and Badge Specification** for the DEC Learning Hub Course Creator Portal and learner-facing platform.

Its purpose is to help Codex/GPT-5.5, developers, course creators, reviewers, proof verifiers, publishers, DEC admins, and DEC stakeholders implement the practical proof and recognition layer consistently across:
- Build Studio;
- Review Workflow;
- Publish Workflow;
- Learner Runtime;
- Proof Review;
- Learner Dashboard;
- Organization Dashboard;
- Monitoring and Evaluation;
- donor-safe summaries, if enabled.

The core rule is:

> Practical proof, verified achievements, and badges are **separate from course certification**. A learner receives a course certificate by scoring **80% or above on the final test**. Practical proof may lead to a separate verified achievement or badge only after human review and acceptance.

This annex should prevent confusion between:
- **course completion**;
- **course certificate**;
- **practical application evidence**;
- **verified achievement**;
- **badge or organizational recognition**.

# 2. Binding Rules
## 2.1 Certificate rule remains unchanged
The binding certificate rule is:

> **80%+ final test score = course pass and automated certificate.**

Practical proof is not required for the course certificate.

The platform must not require learners to upload evidence, receive proof approval, or earn a badge before receiving a course certificate.

## 2.2 Practical proof is a separate recognition pathway
Practical proof is an optional or additional pathway that allows learners or CSOs to submit evidence that they have applied course learning in practice.

A learner may:
1.  complete the course;
2.  pass the final test with 80%+;
3.  receive the certificate;
4.  then submit practical proof where enabled;
5.  receive verified achievement or badge if proof is reviewed and accepted.

The certificate is not delayed while proof is under review.

## 2.3 Verified achievement requires human review
Verified achievement or badge issuance must require review by an authorized proof verifier, DEC admin, or assigned reviewer.

AI must not verify proof or award badges.

Automated checks may support the process, but the final verification decision must be made by an authorized human role in Phase 1.

## 2.4 Raw proof is private by default
Raw proof submissions should not be visible to donors or unauthorized users by default.

Donor-facing visibility, if enabled, should use safe, consent-based summaries, not raw uploaded files.

# 3. Key Definitions
| Term                       | Meaning                                                                                             |
|--------------------------------|---------------------------------------------------------------------------------------------------------|
| Practical proof                | Evidence submitted by a learner or CSO to show practical application of course learning                 |
| Proof submission               | The record of a learner/CSO submitting practical proof                                                  |
| Proof verifier                 | Authorized human reviewer who assesses proof                                                            |
| Verified achievement           | Recognition issued after practical proof is reviewed and accepted                                       |
| Badge                          | A visual or named form of verified achievement                                                          |
| Organization-level recognition | A safe summary showing that a CSO has earned verified achievements in specific capacity areas           |
| Donor-safe summary             | A restricted, consent-based summary of verified achievements that excludes raw proof and sensitive data |
| Certificate                    | Automated course completion recognition issued at 80%+ final test score                                 |
| Raw proof                      | Uploaded or entered evidence, such as documents, worksheets, logs, or work samples                      |
| Safe summary                   | A non-sensitive summary of what was verified                                                            |

# 4. Relationship Between Certificate, Proof, and Badge
The platform must show this distinction clearly.

| Element               | Trigger                  | Review required?     | Recognition issued                 | Meaning                                                     |
|---------------------------|------------------------------|--------------------------|----------------------------------------|-----------------------------------------------------------------|
| Final test pass           | Learner scores 80%+          | Automated scoring        | Course certificate                     | Learner met course learning threshold                           |
| Practical proof submitted | Learner/CSO submits evidence | Not yet verified         | Submission status                      | Learner/CSO attempted to show application                       |
| Practical proof accepted  | Verifier approves proof      | Human review             | Verified achievement / badge           | Evidence of specific applied capacity was reviewed and accepted |
| Organization recognition  | Accepted proof linked to CSO | Human/system aggregation | Organization capacity evidence summary | CSO has one or more verified achievements in a capacity area    |

Learner-facing message:

> Your course certificate is based on your final test score. Practical proof is a separate opportunity to show applied capacity and may lead to a verified achievement or badge.

# 5. When Practical Proof Should Be Enabled
Practical proof should not be enabled for every course automatically.

It should be enabled when the course has a clear practical output, work sample, or applied task that can reasonably be reviewed.

Recommended conditions:

| Condition                                              | Practical proof suitability          |
|------------------------------------------------------------|------------------------------------------|
| Course teaches a practical skill                           | Strong candidate                         |
| Course uses a template or worksheet                        | Strong candidate                         |
| Course includes a realistic workplace task                 | Strong candidate                         |
| Course links to a capacity indicator                       | Strong candidate                         |
| Course is mainly awareness/introductory                    | Usually optional or not needed           |
| Course involves high-risk safeguarding/civic-space content | Use only with strong safety restrictions |
| Course has no feasible output                              | Do not enable proof                      |
| Course is purely informational                             | Usually no proof                         |

Examples where proof is useful:
- outcome evidence worksheet;
- budget justification draft;
- feedback categorization log;
- conflict-of-interest documentation checklist;
- safe advocacy message;
- partnership role matrix;
- staff onboarding checklist;
- data protection checklist.

# 6. Practical Proof Configuration in Build Studio
When practical proof is enabled for a course, the Build Studio should require a **Practical Proof Configuration Record**.

Recommended fields:

| Field                     | Required?                        | Purpose                                      |
|-------------------------------|--------------------------------------|--------------------------------------------------|
| Proof configuration ID        | Yes                                  | Unique proof setup record                        |
| Course ID                     | Yes                                  | Links proof to course                            |
| Course version ID             | Yes                                  | Version-aware proof setup                        |
| Capacity area                 | Yes                                  | Links to CSO taxonomy                            |
| Sub-capacity                  | Recommended                          | More specific capacity linkage                   |
| Indicator/standard link       | Recommended/required where available | Evidence credibility                             |
| Performance goal link         | Yes                                  | Shows what proof demonstrates                    |
| Required action link          | Yes                                  | Links proof to Action Map                        |
| Proof title                   | Yes                                  | Learner-facing proof name                        |
| Proof purpose                 | Yes                                  | Explains why proof exists                        |
| Accepted proof type           | Yes                                  | Defines what can be submitted                    |
| Submission format             | Yes                                  | File upload, text response, template, link, etc. |
| Template/resource link        | Recommended                          | Supports learner completion                      |
| Review criteria/rubric        | Yes                                  | Guides verification                              |
| Safety/anonymization guidance | Yes                                  | Prevents unsafe uploads                          |
| Visibility setting default    | Yes                                  | Private by default                               |
| Badge/achievement title       | Yes if badge enabled                 | Recognition name                                 |
| Badge/achievement description | Yes if badge enabled                 | Meaning of recognition                           |
| Reviewer/verifier role        | Yes                                  | Who can verify                                   |
| Revision allowed              | Yes                                  | Whether resubmission is possible                 |
| AI assistance used            | Optional                             | If proof instructions drafted by AI              |
| Review status                 | Yes                                  | Draft, ready, approved, returned                 |

A course should not publish with proof enabled unless proof instructions, review criteria, and safety guidance are complete and approved.

# 7. Accepted Proof Types
The platform should support a controlled list of proof types.

| Proof type                  | Example                            | Notes                                         |
|---------------------------------|----------------------------------------|---------------------------------------------------|
| Completed template              | Outcome evidence worksheet             | Strong for MEAL/resource courses                  |
| Redacted work sample            | Budget justification draft             | Must remove sensitive information                 |
| Checklist completion            | Safeguarding referral checklist        | Use simulated/anonymized examples where sensitive |
| Action plan                     | 90-day capacity action plan            | Good for strategic planning                       |
| Practice output                 | Safe advocacy message draft            | Good for advocacy/civic engagement                |
| Categorization log              | Redacted feedback categorization table | Requires anonymization warning                    |
| Reflection plus evidence        | Short reflection with attached output  | Useful for applied learning                       |
| Scenario-based written response | Decision response to fictional case    | Safer for sensitive areas                         |
| Peer/mentor-reviewed output     | Document reviewed by mentor or peer    | Future enhancement                                |
| Organization-level document     | Policy/procedure extract               | Requires organization approval and redaction      |

The platform should discourage broad proof requests such as:

> Upload anything that shows you applied the course.

Better:

> Upload a completed, anonymized outcome evidence worksheet using the course template.

# 8. Submission Formats
The platform may support several submission formats.

| Format             | Use case                                            | Risk level |
|------------------------|---------------------------------------------------------|----------------|
| Text response          | Short explanation, action commitment, scenario response | Low to medium  |
| Template completion    | Structured worksheet or matrix                          | Low to medium  |
| File upload            | Work sample or completed document                       | Medium to high |
| Link submission        | Shared document or artifact                             | Medium to high |
| Checklist confirmation | Simple completion evidence                              | Low            |
| Combined text + file   | Explanation plus output                                 | Medium         |

Phase 1 should prefer safer structured formats where possible.

For high-risk topics, text response or simulated template may be safer than raw file upload.

# 9. Practical Proof Safety Requirements
Every proof pathway must include safety guidance before submission.

Standard safety warning:

Do not upload real names, phone numbers, addresses, beneficiary details, politically sensitive information, active safeguarding/protection cases, or confidential documents not approved for sharing. Use anonymized, redacted, or fictionalized examples unless your organization has approved the document for submission.

The platform should require learners to acknowledge the warning before submitting proof for sensitive courses.

Proof safety rules:
- raw proof is private by default;
- learners should submit only necessary evidence;
- sensitive details should be removed or redacted;
- active safeguarding/protection cases should not be uploaded;
- politically sensitive details should not be uploaded;
- internal documents should only be submitted if approved by the CSO;
- high-risk submissions may require specialist review;
- unsafe submissions can be removed, returned, or marked for redaction.

# 10. Unsafe Proof Content
The platform should warn learners not to submit:
- real beneficiary names;
- phone numbers;
- addresses;
- exact locations that create risk;
- real safeguarding or protection case files;
- GBV case details;
- child protection case records;
- photos identifying vulnerable individuals;
- politically sensitive advocacy plans;
- names of at-risk activists or informants;
- unredacted complaint logs;
- confidential donor documents;
- bank details;
- internal HR disciplinary records;
- documents not approved by the organization;
- raw community feedback that identifies people.

If unsafe content is submitted, reviewers should have a decision option such as:

> Unsafe / redaction required.

# 11. Proof Submission Workflow
The recommended proof workflow is:
1.  Course is published with proof pathway enabled.
2.  Learner completes the course.
3.  Learner scores 80%+ and receives certificate.
4.  Learner sees proof opportunity.
5.  Learner reads proof instructions and safety warning.
6.  Learner downloads or uses template if provided.
7.  Learner submits proof.
8.  Proof state becomes **Submitted**.
9.  Verifier reviews proof.
10. Verifier accepts, requests revision, rejects, marks unsafe, or escalates.
11. If accepted, verified achievement/badge is issued.
12. Learner and organization dashboard update according to visibility rules.
13. Monitoring records proof and achievement data.

This workflow must remain separate from certificate issuance.

# 12. Proof Submission States
Recommended proof states:

| **State**                    | Meaning                                 |
|------------------------------|---------------------------------------------|
| Not enabled                  | Course has no proof pathway                 |
| Available                    | Learner may submit proof                    |
| Draft saved                  | Learner started but has not submitted       |
| Submitted                    | Proof submitted for review                  |
| Under review                 | Verifier is assessing                       |
| Revision requested           | Learner must revise, complete, or redact    |
| Accepted                     | Proof meets criteria                        |
| Accepted with note           | Proof sufficient but improvement note added |
| Rejected                     | Proof does not meet criteria                |
| Unsafe / redaction required  | Proof contains unsafe data                  |
| Escalated                    | Specialist review required                  |
| Withdrawn                    | Learner/CSO withdrew submission             |
| Removed                      | Admin removed unsafe submission             |
| Verified achievement awarded | Badge/achievement issued                    |

Certificate state remains independent from proof state.

# 13. Proof Submission Record Specification
Each proof submission should create a record.

Recommended fields:

| Field                    | Required? | Purpose                                 |
|------------------------------|---------------|---------------------------------------------|
| Proof submission ID          | Yes           | Unique proof record                         |
| Proof configuration ID       | Yes           | Links to proof setup                        |
| Learner ID                   | Yes           | Submission owner                            |
| Organization ID              | Recommended   | Organization-level evidence                 |
| Course ID                    | Yes           | Course reference                            |
| Course version ID            | Yes           | Version integrity                           |
| Certificate ID               | Recommended   | Shows course completion context             |
| Capacity area                | Yes           | Taxonomy link                               |
| Indicator/standard           | Recommended   | Capacity evidence link                      |
| Proof type                   | Yes           | Submission category                         |
| Submission format            | Yes           | Text/file/link/template                     |
| Submission content/reference | Yes           | File path/text/link, with role restrictions |
| Safety acknowledgement       | Yes           | Confirms warning seen                       |
| Submission status            | Yes           | Draft/submitted/under review/etc.           |
| Submitted at                 | Yes           | Timestamp                                   |
| Reviewer/verifier ID         | When assigned | Review accountability                       |
| Review decision              | When reviewed | Accepted/revision/rejected/etc.             |
| Review notes                 | Recommended   | Feedback or rationale                       |
| Redaction required           | If unsafe     | Safety action                               |
| Specialist review flag       | If needed     | Safeguarding/civic-space escalation         |
| Visibility setting           | Yes           | Private by default                          |
| Achievement issued           | Yes/No        | Link to recognition                         |
| Updated at                   | Yes           | Audit trail                                 |

# 14. Proof Review / Verification Workflow
Proof review should be performed by an authorized verifier.

Verifier can be:
- Practical Proof Verifier;
- DEC Admin;
- assigned subject matter reviewer;
- assigned safeguarding reviewer for sensitive proof;
- assigned capacity lead for capacity alignment.

The verifier should review proof against the approved criteria/rubric.

Review decisions:

| **Decision**                | Meaning                                   | **Result**                                     |
|-----------------------------|-----------------------------------------------|------------------------------------------------|
| Accept                      | Proof meets criteria                          | Issue verified achievement/badge if configured |
| Accept with note            | Proof sufficient but improvement note added   | Issue achievement with feedback                |
| Revision requested          | Proof incomplete, unclear, or needs redaction | Learner may resubmit if allowed                |
| Reject                      | Proof does not meet criteria                  | No achievement                                 |
| Unsafe / redaction required | Proof includes sensitive or unsafe data       | Hide/restrict proof and request redaction      |
| Escalate                    | Specialist review needed                      | Route to specialist                            |
| Remove                      | Proof should not remain accessible            | Admin/specialist action                        |

The reviewer should not use proof review to change final test score or course certificate.

# 15. Proof Review Rubric
The platform should support a simple rubric.

Recommended criteria:

| **Criterion**            | **Review question**                                         | **Rating options**              |
|--------------------------|-------------------------------------------------------------|---------------------------------|
| Task match               | Does the proof match the requested task?                    | Meets / Partly / Does not meet  |
| Capacity link            | Does it relate to the course capacity area and indicator?   | Meets / Partly / Does not meet  |
| Required action evidence | Does it show the learner/CSO attempted the required action? | Meets / Partly / Does not meet  |
| Completeness             | Is it complete enough to review?                            | Meets / Partly / Does not meet  |
| Practical relevance      | Is it realistic for the CSO context?                        | Meets / Partly / Does not meet  |
| Quality threshold        | Does it meet the minimum quality standard?                  | Meets / Partly / Does not meet  |
| Safety                   | Does it avoid sensitive or unsafe data?                     | Safe / Needs redaction / Unsafe |
| Improvement note         | What should the learner improve?                            | Text                            |

Minimum acceptance rule:

> Proof should be accepted only if task match, capacity link, required action evidence, completeness, quality threshold, and safety meet minimum criteria.

For Phase 1, avoid overly complex scoring. Use clear reviewer judgment.

# 16. Verified Achievement / Badge Specification
A verified achievement or badge should be issued only when proof is accepted.

Recommended badge/achievement fields:

| Field             | Required?        | Purpose                                  |
|-----------------------|----------------------|----------------------------------------------|
| Achievement ID        | Yes                  | Unique record                                |
| Badge title           | Yes                  | Recognition name                             |
| Badge description     | Yes                  | Explains what was demonstrated               |
| Learner ID            | Yes if learner-level | Recipient                                    |
| Organization ID       | Recommended          | CSO evidence link                            |
| Course ID             | Yes                  | Linked course                                |
| Course version ID     | Yes                  | Version integrity                            |
| Proof submission ID   | Yes                  | Evidence basis                               |
| Capacity area         | Yes                  | Taxonomy link                                |
| Sub-capacity          | Recommended          | Specific focus                               |
| Indicator/standard    | Recommended          | Evidence credibility                         |
| Proof type            | Yes                  | What was reviewed                            |
| Verification decision | Yes                  | Accepted / accepted with note                |
| Verified by           | Yes                  | Verifier                                     |
| Verification date     | Yes                  | Timestamp                                    |
| Visibility setting    | Yes                  | Private/org/DEC/donor-safe/public if enabled |
| Expiry/renewal        | Optional             | Future feature                               |
| Status                | Yes                  | Active, revoked, hidden, archived            |

Badge wording should be specific.

Weak badge:

> MEAL Badge

Better badge:

> Outcome Evidence Practice Badge

Weak badge:

> Advocacy Certified

Better badge:

> Evidence-Based Advocacy Message Badge

# 17. Recommended Badge Names by Capacity Area
| **Capacity area**                                    | **Example badge / verified achievement** |
|------------------------------------------------------|------------------------------------------|
| Internal Governance and Leadership                   | Conflict-of-Interest Documentation Badge |
| Transparency and Accountability                      | Community Feedback Use Badge             |
| Strategic Planning and Organizational Sustainability | Strategy-to-Action Planning Badge        |
| Financial Management and Resource Mobilization       | Budget Justification Readiness Badge     |
| Human Resources, Inclusion, and Safeguarding         | Safeguarding Referral Practice Badge     |
| Evidence-Based Advocacy and Civic Engagement         | Evidence-Based Advocacy Message Badge    |
| Monitoring, Evaluation, Accountability, and Learning | Outcome Evidence Practice Badge          |
| Digital Skills and Data Use / IT Competencies        | Safe Data Handling Badge                 |
| Networking, Partnerships, and Collective Action      | Partnership Role Clarity Badge           |

Badge labels should avoid overclaiming. They should describe the specific applied task that was reviewed.

# 18. Badge Wording and Overclaiming Rules
Badge/achievement text should be careful.

Recommended wording:

> Awarded for submitting reviewed practical evidence of applying \[specific skill/task\] linked to \[capacity area\].

Example:

> Awarded for submitting reviewed practical evidence of preparing an outcome evidence worksheet linked to MEAL capacity.

Avoid:
- “Certified expert”;
- “Fully competent”;
- “Donor-ready organization”;
- “Safeguarding professional”;
- “Approved by all donors”;
- “Organizational transformation achieved.”

Verified achievements are specific evidence markers, not full organizational certification.

# 19. Organization-Level Recognition
Some verified achievements may contribute to an organization-level evidence profile.

Organization dashboard may show:
- staff certificates;
- verified achievements earned;
- capacity areas covered;
- proof statuses;
- indicator-linked achievements;
- dates of verification;
- recommended next learning pathways.

Organization-level recognition should be cautious.

It may say:

> This organization has earned verified achievements in Outcome Evidence Practice and Budget Justification Readiness.

It should not say:

> This organization is fully donor-ready.

unless DEC later creates a separate organizational certification framework.

# 20. Donor-Safe Visibility
Donor visibility should be disabled by default or limited to safe summaries.

If enabled, donor-facing users may see only consent-based summaries such as:
- CSO name, if consented;
- capacity area;
- verified achievement title;
- indicator/standard;
- verification date;
- safe summary;
- recognition status.

Donors should not see:
- raw proof;
- learner test scores;
- learner private details;
- internal reviewer notes;
- sensitive organizational weaknesses;
- safeguarding/protection details;
- unapproved documents.

A safe summary example:

> This CSO received a verified achievement in Outcome Evidence Practice based on reviewed practical proof submitted through the DEC Learning Hub.

# 21. Visibility Settings
Recommended visibility settings:

| **Setting**           | Meaning                                                 |
|-----------------------|-------------------------------------------------------------|
| Private               | Visible only to learner, verifier, and authorized DEC users |
| Learner-visible       | Visible in learner dashboard                                |
| Organization-visible  | Visible to approved organization admin                      |
| DEC-visible           | Visible to DEC admins and program/M&E staff                 |
| Donor-safe summary    | Visible to approved donor users as safe summary only        |
| Public, future option | Visible publicly only with explicit approval                |

Default:

> Private / learner-visible internally, not donor-visible.

Organization consent should be required before donor-safe visibility is enabled.

# 22. Learner Runtime Experience
When proof is enabled, learner runtime should show proof opportunity separately from certificate.

Recommended learner flow:
1.  Course completion screen shows certificate status.
2.  If learner scored 80%+, certificate is available.
3.  Proof section appears as separate optional/additional step.
4.  Proof section explains benefit of verified achievement.
5.  Learner sees accepted proof type and safety warning.
6.  Learner submits proof.
7.  Learner sees proof status.
8.  Learner receives revision request or badge/achievement if accepted.

Learner-facing copy:

> You have earned your course certificate. You may now submit practical proof for a separate verified achievement linked to this capacity area.

If learner has not passed final test, DEC may decide whether proof is available, but the simplest Phase 1 rule is:

> Proof pathway becomes available after course completion or certificate eligibility.

# 23. Reviewer / Verifier Dashboard
Proof verifiers need a simple review queue.

Queue fields:

| Field              | Purpose                                       |
|------------------------|---------------------------------------------------|
| Submission ID          | Record reference                                  |
| Course title           | Context                                           |
| Learner / organization | Recipient                                         |
| Capacity area          | Taxonomy link                                     |
| Proof type             | What was submitted                                |
| Submitted date         | Review timing                                     |
| Safety flag            | Risk attention                                    |
| Status                 | Submitted, under review, revision requested, etc. |
| Assigned reviewer      | Workload                                          |
| Action                 | Review / request revision / escalate              |

Verifier page should show:
- proof instructions;
- learner submission;
- capacity area;
- required action;
- review rubric;
- safety warning;
- previous review notes;
- decision buttons.

# 24. Build, Review, and Publish Integration
## 24.1 Build Studio
Build Studio must require:
- proof title;
- proof purpose;
- accepted proof type;
- proof instructions;
- safety/anonymization note;
- review criteria;
- badge/achievement title;
- capacity area/indicator link;
- verifier role.

## 24.2 Review
Reviewers must check:
- proof is separate from certificate;
- proof instructions are clear;
- safety guidance is present;
- accepted proof type is realistic;
- review criteria are clear;
- badge wording does not overclaim;
- capacity/indicator link exists;
- donor visibility is safe or disabled.

## 24.3 Publish
Publish should be blocked if proof is enabled but:
- proof instructions are missing;
- accepted proof type is unclear;
- safety guidance is missing;
- badge title/description is vague or overclaims;
- verifier role is missing;
- donor visibility exposes raw proof.

# 25. Monitoring Requirements
Monitoring should track proof and achievement separately from certificates.

Recommended metrics:

| Metric                    | Meaning                               |
|-------------------------------|-------------------------------------------|
| Proof enabled courses         | Courses with proof pathway                |
| Proof submissions             | Learners/CSOs submitting proof            |
| Proof submission rate         | Proof submissions among eligible learners |
| Proof under review            | Review workload                           |
| Revision requested count      | Proof quality or safety issues            |
| Accepted proof count          | Applied evidence accepted                 |
| Rejected proof count          | Proof not sufficient                      |
| Unsafe proof count            | Data safety issue                         |
| Verified achievements awarded | Badges issued                             |
| Achievements by capacity area | Applied capacity evidence                 |
| Achievements by organization  | Organization evidence profile             |
| Average review time           | Operational efficiency                    |
| Common proof weaknesses       | Course improvement input                  |

Monitoring interpretation:

| **Evidence**         | Meaning                                                |
|----------------------|------------------------------------------------------------|
| Certificate          | Learner passed final test                                  |
| Proof submitted      | Learner/CSO attempted application evidence                 |
| Proof accepted       | Evidence was reviewed and met criteria                     |
| Badge awarded        | Verified achievement issued                                |
| Organization summary | Aggregated evidence, not full organizational certification |

# 26. Data Safety and Audit Trail
Proof workflows require audit trail.

Audit events:
- proof configuration created;
- proof configuration approved;
- proof submitted;
- proof viewed by verifier;
- revision requested;
- proof accepted;
- proof rejected;
- proof marked unsafe;
- proof escalated;
- proof removed/redacted;
- badge awarded;
- badge visibility changed;
- donor-safe summary enabled/disabled.

Each event should record:
- user;
- role;
- timestamp;
- course ID;
- version ID;
- proof submission ID;
- action;
- note/reason where relevant.

# 27. AI Use in Proof and Badge Workflows
AI may assist with:
- drafting proof instructions;
- simplifying safety guidance;
- drafting review criteria;
- drafting badge descriptions;
- summarizing non-sensitive feedback patterns.

AI must not:
- verify proof;
- decide review outcome;
- award badges;
- summarize raw proof externally;
- create donor-facing claims from raw proof;
- ask learners to upload unsafe documents;
- remove human review;
- change certificate rule.

AI-generated proof instructions or badge descriptions should be marked human-reviewed before publication.

# 28. Minimum Phase 1 Requirements
For Phase 1, Codex should minimally implement or align:
1.  Practical proof pathway can be enabled per course.
2.  Proof remains separate from certificate.
3.  Certificate still issues at 80%+ final test score without proof.
4.  Proof configuration includes title, instructions, accepted type, safety note, review criteria, capacity link, and verifier role.
5.  Learner can submit proof where enabled.
6.  Proof submission creates a record and status.
7.  Verifier/admin can review proof and choose accepted, revision requested, rejected, unsafe/redaction required, or escalated.
8.  Accepted proof can issue verified achievement/badge.
9.  Badge links to course, version, proof, capacity area, and verifier.
10. Raw proof is private by default.
11. Donor visibility is disabled by default or summary-only with consent.
12. Monitoring tracks proof and badges separately from certificates.
13. Review/Publish blocks unsafe or incomplete proof configuration.
14. AI cannot verify proof or award badges.

# 29. Future Enhancements
Future versions may add:
- advanced rubric scoring;
- peer review;
- mentor review;
- bulk proof review;
- organizational proof portfolios;
- badge wallet integration;
- QR badge verification;
- renewal/expiry;
- public/private achievement profiles;
- donor-facing recognition portal;
- proof redaction tool;
- sensitive data detection;
- automated proof completeness checks;
- integration with organizational capacity assessments;
- multi-stage verification;
- appeal process for rejected proof.

These should not delay the Phase 1 core proof workflow.

# 30. Implementation Guidance for Codex
Codex should implement practical proof and badges as a controlled, separate recognition workflow.

## 30.1 Required implementation behavior
Codex should:
- inspect existing certificate and learner runtime logic before changing;
- ensure proof status does not affect certificate issuance;
- create or align proof configuration model;
- create or align proof submission states;
- create or align verifier decision workflow;
- create or align verified achievement/badge record;
- ensure role-based access to raw proof;
- include safety warnings before proof submission;
- make proof metrics separate from certificate metrics;
- include proof setup in Review and Publish readiness checks.

## 30.2 What Codex should not do
Codex should not:
- require proof for certificate;
- issue certificate after proof acceptance only;
- allow AI to verify proof;
- make raw proof donor-visible;
- create public CSO rankings;
- label badges as full organizational certification;
- publish proof pathway without safety guidance;
- allow proof upload for sensitive topics without warning;
- expose internal verifier notes to learners or donors.

## 30.3 Acceptance criteria examples
Given a learner scores 80% on the final test,

when the final test attempt is saved,

then the course certificate is issued even if no practical proof has been submitted.

Given a course has practical proof enabled,

when a learner completes the course,

then the learner sees proof submission as a separate optional/additional pathway from the certificate.

Given a learner submits practical proof,

when the submission is saved,

then a Proof Submission Record is created with status “Submitted” and raw proof is not visible to donor-facing users.

Given a verifier accepts a proof submission,

when the decision is saved,

then a Verified Achievement / Badge Record is created and linked to the learner, organization where available, course version, proof submission, capacity area, indicator, verifier, and verification date.

Given a proof submission contains sensitive data,

when the verifier marks it “Unsafe / redaction required,”

then no badge is awarded and the learner receives a revision/redaction request.

Given donor visibility is not consented,

when a donor-facing user views organization evidence,

then the raw proof and achievement details remain hidden except approved safe summaries.

# 31. Recommended Repo Placement
This annex should be saved as:

docs/specs/core-workflow/ANNEX_09_PRACTICAL_PROOF_VERIFIED_ACHIEVEMENT_AND_BADGE_SPECIFICATION.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_09_PRACTICAL_PROOF_VERIFIED_ACHIEVEMENT_AND_BADGE_SPECIFICATION.md

Defines the practical proof pathway, proof configuration, proof submission states, verifier review workflow, badge/verified achievement records, safety rules, donor-safe visibility, monitoring metrics, and Codex acceptance criteria.

# 32. Success Standard for This Annex
This annex is successful when:

> Codex and developers can implement practical proof, verified achievement, and badge workflows as a separate applied-capacity recognition layer that does not affect the 80% certificate rule, protects raw evidence, uses human verification, links recognition to CSO capacity indicators, and supports safe monitoring and donor-facing summaries only where consented.

In practical terms, this annex should prevent:

> “A learner must upload proof before receiving a certificate, or a donor can open raw proof files.”

And ensure:

> “A learner receives the course certificate at 80%+, may separately submit safe practical proof, receives a verified achievement only after human review, and the platform tracks certificates and badges as different forms of evidence.”

# Annex 12: Data Safety, Consent, and Visibility Rules
## DEC Learning Hub Course Creator Portal
## 1. Purpose of This Annex
This annex defines the **Data Safety, Consent, and Visibility Rules**
for the DEC Learning Hub Course Creator Portal and learner-facing
platform.

Its purpose is to guide Codex/GPT-5.5, developers, DEC admins, course
creators, reviewers, proof verifiers, organization admins, and future
donor-facing users on how platform data should be protected, displayed,
shared, and restricted.

The DEC Learning Hub will handle learning records, course data, final
test results, certificates, practical proof submissions, verified
achievements, learner feedback, organization-level summaries, and
monitoring data. Some of this information can support CSO capacity
strengthening and donor confidence. Some of it can also create risks if
exposed without consent or safeguards.

The core rule is:

> The platform should make learning and capacity evidence useful without
> exposing learners, CSOs, communities, rights-holders, or sensitive
> organizational information to avoidable risk.

This annex should guide:

- practical proof upload rules;

- role-based visibility;

- consent-based donor visibility;

- raw proof protection;

- AI prompt safety;

- learner data privacy;

- organization-level summaries;

- reviewer access;

- monitoring dashboards;

- publication safety checks;

- future donor-facing visibility.

# 2. Data Safety Principle
The DEC Learning Hub should be **safe by default**.

That means:

- raw proof should be private by default;

- donor visibility should be disabled by default or limited to safe
  summaries;

- learners should be warned before uploading proof;

- sensitive data should not be requested unless absolutely necessary;

- role-based access should control who sees what;

- practical proof should require anonymization or redaction where
  relevant;

- AI should not receive sensitive raw data;

- dashboards should avoid exposing personal or sensitive details;

- organization-level summaries should not become rankings or
  surveillance tools.

The platform should not only comply technically. It should build trust
with local CSOs by showing that evidence is handled carefully.

# 3. Types of Data in the Platform
The platform may handle several types of data. Each type has different
sensitivity.

| **Data type**                      | **Examples**                                                | **Sensitivity**  | **Default visibility**                                      |
|------------------------------------|-------------------------------------------------------------|------------------|-------------------------------------------------------------|
| Public course metadata             | course title, description, capacity area, duration          | Low              | Learners with access                                        |
| Course drafts and workflow records | Analysis, Design, Build, Review notes                       | Internal         | Creator, reviewer, admin                                    |
| Learner account data               | name, email, organization, role                             | Moderate         | Learner, DEC admin, authorized org admin summary            |
| Learner progress data              | lessons completed, course status, time/progress             | Moderate         | Learner, DEC admin, authorized summary                      |
| Final test data                    | attempts, scores, pass/fail, answer data                    | Moderate to high | Learner, DEC admin, limited aggregate views                 |
| Certificate data                   | certificate ID, course, issue date, learner name            | Moderate         | Learner, DEC admin, org summary where enabled               |
| Learner feedback                   | ratings, comments, application intent                       | Moderate         | Creator/admin in aggregate; personal data restricted        |
| Practical proof data               | uploaded worksheets, documents, logs, links, outputs        | High             | Learner, assigned verifier, restricted DEC admin            |
| Proof review notes                 | reviewer decision, comments, redaction requests             | High             | Verifier, DEC admin, learner where appropriate              |
| Verified achievement data          | badge title, capacity area, verification date               | Moderate         | Learner, DEC/admin, org summary; donor-safe only by consent |
| Organization evidence summary      | aggregated certificates and achievements                    | Moderate to high | Org admin, DEC admin; donor-safe only by consent            |
| Safeguarding/protection data       | cases, referrals, child/GBV/protection details              | Very high        | Should generally not be uploaded                            |
| Civic-space/political data         | advocacy risks, sensitive actors, politically risky details | High             | Avoid raw collection; restricted if unavoidable             |
| Donor-safe summaries               | approved achievement summaries                              | Controlled       | Donor-facing only if consented                              |

The system should not treat all records as equally shareable. Practical
proof, safeguarding/protection data, civic-space-sensitive information,
and organization evidence need stronger controls.

# 4. Data Minimization Rule
The platform should collect only what is needed for learning,
certification, practical proof review, verified achievement, monitoring,
and safe reporting.

The product rule is:

> Do not ask learners or CSOs to upload more evidence than necessary.

Examples:

| **Avoid requesting**                | **Safer alternative**                          |
|-------------------------------------|------------------------------------------------|
| Full beneficiary list               | anonymized sample or fictionalized example     |
| active safeguarding case file       | simulated referral pathway checklist           |
| unredacted community complaint log  | redacted feedback categorization sample        |
| full internal financial report      | selected redacted budget justification extract |
| politically sensitive advocacy plan | safe advocacy message draft                    |
| confidential donor contract         | non-sensitive compliance checklist             |
| personal staff records              | anonymized HR process checklist                |
| raw photos of vulnerable people     | text description or anonymized/consented image |

The platform should reward **sufficient and safe evidence**, not
excessive documentation.

# 5. Consent Rule
Consent is required before learner, CSO, or organization evidence is
shown beyond the intended internal platform role.

Consent is especially important for:

- organization-level capacity summaries;

- donor-safe verified achievement summaries;

- public or partner-facing badge visibility;

- using learner examples in reports;

- sharing CSO names in external dashboards;

- showing organization achievements outside DEC/internal views.

Default rule:

> Raw learner submissions and practical proof are private by default.
> External visibility requires explicit consent and safe summary
> formatting.

Consent should be:

- specific;

- understandable;

- role-aware;

- revocable where feasible;

- recorded in the platform;

- connected to what will be shown and to whom.

Avoid vague consent text:

> Your data may be shared with partners.

Use clear consent text:

> Allow this verified achievement summary to be visible to approved
> donor users. Raw uploaded proof will not be shared.

# 6. Role-Based Visibility Rules
The platform should restrict data by role and assignment.

| **Data / record**                | **Learner**                | **Creator**                  | **Reviewer**                   | **Proof Verifier**          | **DEC Admin** | **Org Admin**         | **Donor Viewer**           |
|----------------------------------|----------------------------|------------------------------|--------------------------------|-----------------------------|---------------|-----------------------|----------------------------|
| Published course content         | Own accessible courses     | Yes                          | Yes                            | Limited                     | Yes           | Limited               | Limited                    |
| Course drafts                    | No                         | Own/assigned                 | Assigned                       | No                          | Yes           | No                    | No                         |
| Analysis/Design handovers        | No                         | Own/assigned                 | Assigned                       | No                          | Yes           | No                    | No                         |
| Review comments                  | No                         | Returned/own course comments | Assigned                       | No                          | Yes           | No                    | No                         |
| Learner own progress             | Own only                   | No individual by default     | No                             | No                          | Yes           | Summary only          | No                         |
| Final test score                 | Own only                   | Aggregate only               | If assigned and necessary      | No                          | Yes           | Summary only          | No                         |
| Certificate                      | Own                        | Aggregate only               | No                             | No                          | Yes           | Summary where enabled | Summary only if consented  |
| Practical proof raw file         | Own                        | No by default                | Assigned only if review role   | Assigned only               | Restricted    | No by default         | No                         |
| Proof review notes               | Own relevant feedback only | No                           | If assigned                    | Assigned                    | Yes           | No by default         | No                         |
| Verified achievement             | Own                        | Aggregate                    | If relevant                    | Assigned                    | Yes           | Summary where enabled | Consent-based summary only |
| Organization evidence summary    | No                         | No                           | Limited                        | Limited                     | Yes           | Yes                   | Consent-based safe summary |
| Raw safeguarding/protection data | Should not be uploaded     | No                           | Specialist only if unavoidable | Specialist only if assigned | Restricted    | No                    | No                         |
| Internal audit trail             | No                         | Limited own actions          | Limited review actions         | Limited proof actions       | Yes           | No                    | No                         |

The system should use both **role** and **assignment**. For example, a
reviewer should not see all proof submissions unless assigned or
authorized.

# 7. Practical Proof Safety Rules
Practical proof is the highest-risk routine data flow in the platform.

Before submitting proof, the learner should see a clear safety warning.

Recommended standard warning:

Do not upload real names, phone numbers, addresses, beneficiary details,
politically sensitive information, active safeguarding/protection cases,
or confidential documents not approved for sharing. Use anonymized,
redacted, or fictionalized examples unless your organization has
approved the document for submission.

Proof safety rules:

1.  Raw proof is private by default.

2.  Proof should be linked to a specific task, not open-ended evidence
    collection.

3.  Learners should submit only the minimum safe evidence needed.

4.  Redaction or anonymization should be encouraged.

5.  Sensitive proof should trigger specialist review.

6.  Unsafe submissions can be returned, removed, restricted, or marked
    for redaction.

7.  Raw proof should never be donor-visible by default.

8.  AI should not process raw proof unless it is redacted and explicitly
    allowed.

# 8. Unsafe Data That Should Not Be Uploaded
The platform should warn users not to upload:

- real beneficiary names;

- phone numbers;

- addresses;

- exact locations that create risk;

- case numbers linked to identifiable people;

- photos of vulnerable individuals without consent;

- active safeguarding cases;

- child protection records;

- GBV/protection case details;

- medical or psychosocial case information;

- politically sensitive advocacy plans;

- names of at-risk activists, informants, or community members;

- unredacted complaint logs;

- confidential donor documents;

- internal HR disciplinary files;

- bank account details;

- personal identification documents;

- documents not approved by the CSO for sharing;

- raw community feedback that identifies people.

For high-risk courses, the platform should include an additional
acknowledgement before proof submission.

Example:

I confirm that I have removed names, contact details, identifiable case
information, and sensitive political or protection details from this
submission.

# 9. Anonymization and Redaction Guidance
The platform should provide practical redaction guidance.

| **Remove or redact**            | **Safer replacement**                             |
|---------------------------------|---------------------------------------------------|
| “Aster Tadesse”                 | Participant A                                     |
| phone number                    | \[redacted phone\]                                |
| kebele/address                  | \[redacted location\] or “local area”             |
| exact case file number          | \[redacted case ID\]                              |
| detailed protection incident    | generalized description                           |
| photo of identifiable person    | no photo, blurred image, or fictionalized example |
| internal staff conflict details | generalized process example                       |
| political actor name if risky   | “local authority” or “relevant public office”     |
| donor confidential clause       | summary of non-sensitive requirement              |

Short checklist before upload:

Before submitting, confirm that you removed:

\- names and contact details;

\- addresses and exact locations;

\- active case details;

\- politically sensitive information;

\- confidential documents not approved for sharing.

# 10. Safeguarding, Protection, and Civic-Space Sensitivity
Some course areas require stricter controls.

High-risk areas include:

- safeguarding;

- child protection;

- GBV/protection;

- community feedback and complaints;

- whistleblowing;

- advocacy;

- civic engagement;

- legal or regulatory issues;

- conflict-sensitive work;

- public authority relations;

- sensitive donor compliance;

- financial accountability involving confidential records.

For these areas, the platform should support one or more safeguards:

| **Safeguard**                       | **Use case**                               |
|-------------------------------------|--------------------------------------------|
| No file upload; text/template only  | when raw files are risky                   |
| Simulated proof only                | safeguarding or protection practice        |
| Redaction acknowledgement           | community feedback or complaint logs       |
| Specialist review flag              | safeguarding, civic-space, sensitive proof |
| Restricted raw proof visibility     | high-risk proof                            |
| Donor visibility disabled           | sensitive achievements                     |
| Stronger learner warning            | before proof submission                    |
| Fictionalized scenario requirement  | practice without real cases                |
| Admin approval before proof enabled | high-risk courses                          |

The platform should not ask learners to share active safeguarding or
protection cases as proof.

# 11. AI Data Safety Rules
AI-assisted authoring must follow data safety rules.

Users should be warned not to paste sensitive information into AI
prompts.

Recommended AI warning:

Do not include real names, beneficiary details, active case information,
politically sensitive content, confidential documents, or raw proof
submissions in AI prompts. Use anonymized, redacted, or fictionalized
examples.

AI should not receive:

- raw proof submissions;

- active safeguarding/protection cases;

- personal data;

- confidential organizational documents;

- politically sensitive details;

- unredacted complaint logs.

AI may use:

- approved Analysis/Design summaries;

- fictionalized examples;

- redacted content;

- safe templates;

- non-sensitive course context.

AI-generated content involving safeguarding, advocacy, civic-space,
donor compliance, legal/regulatory issues, or proof submission must be
human-reviewed and may require specialist review.

# 12. Donor Visibility Rule
Donor-facing visibility should be safe, limited, and consent-based.

Default rule:

> Donors should not see raw proof, learner test scores, private learner
> records, internal reviewer notes, or unapproved CSO weaknesses.

If donor visibility is enabled, donors may see only safe summaries such
as:

- CSO name, if consented;

- capacity area;

- verified achievement title;

- indicator/standard link;

- verification date;

- recognition status;

- safe summary text;

- aggregate certificate count, if approved;

- aggregate verified achievement count, if approved.

Donors must not see:

- raw proof files;

- final test answers;

- learner private details;

- individual learner scores;

- internal reviewer notes;

- sensitive organizational weaknesses;

- safeguarding/protection details;

- politically sensitive information;

- unapproved documents.

Example donor-safe summary:

> This CSO received a verified achievement in Outcome Evidence Practice
> based on reviewed practical proof submitted through the DEC Learning
> Hub. Raw proof remains private.

# 13. Organization Control Over Visibility
CSOs should control what externally visible evidence is associated with
them.

Recommended visibility levels:

| **Visibility level**  | **Meaning**                                              |
|-----------------------|----------------------------------------------------------|
| Private               | Visible only to learner and authorized DEC users         |
| Organization-visible  | Visible to approved organization admin                   |
| DEC-visible           | Visible to DEC program/admin/M&E users                   |
| Donor-safe summary    | Visible to approved donor users as a safe summary only   |
| Public, future option | Visible publicly only with explicit DEC and CSO approval |

The default should be:

> Private / DEC-visible where needed for program management, not
> donor-visible.

Organization admins should be able to approve or request hiding of
donor-safe summaries where enabled.

# 14. Raw Proof vs Safe Summary
The system should clearly separate raw proof from safe summaries.

| **Raw proof**                                            | **Safe summary**                                   |
|----------------------------------------------------------|----------------------------------------------------|
| Uploaded file, worksheet, link, document, log, or output | Short non-sensitive statement of what was verified |
| May contain sensitive details                            | Should contain no sensitive details                |
| Restricted to learner/verifier/admin                     | Can be shared more safely with consent             |
| Used for verification                                    | Used for dashboards/reporting                      |
| Not donor-visible by default                             | May be donor-visible if approved                   |

Example:

Raw proof:

> Uploaded redacted outcome evidence worksheet.

Safe summary:

> Verified achievement awarded for submitting an accepted outcome
> evidence worksheet linked to MEAL capacity.

# 15. Learner Data Visibility
Learners should see:

- their own enrolled courses;

- their own progress;

- their own final test result;

- their own certificates;

- their own proof submission status;

- their own verified achievements;

- reviewer feedback addressed to them;

- their own visibility settings where enabled.

Learners should not see:

- other learners’ scores;

- other learners’ proof;

- internal reviewer comments not meant for learners;

- workflow handovers;

- admin dashboards;

- donor visibility settings unless relevant to their own achievement.

# 16. Course Creator Data Visibility
Course creators should see enough data to improve their courses but
should not automatically see sensitive individual learner data.

Creators may see:

- course-level enrollment;

- completion;

- aggregate final test performance;

- certificate counts;

- learner feedback summaries;

- proof submission counts;

- verified achievement counts;

- improvement signals;

- returned review comments for their course.

Creators should not automatically see:

- raw practical proof;

- individual final test answers;

- sensitive learner records;

- safeguarding/protection submissions;

- organization-private documents.

If a creator is also assigned as proof verifier or reviewer, visibility
may expand according to that assigned role.

# 17. Reviewer and Proof Verifier Visibility
Reviewers should see only what is needed for their assigned review task.

Course reviewers may see:

- course draft;

- Analysis/Design/Build handovers;

- AI log;

- final test setup;

- proof configuration;

- reviewer comments;

- learner preview;

- relevant safety/accessibility flags.

Proof verifiers may see:

- assigned proof submissions;

- proof instructions;

- rubric;

- learner/organization context needed for review;

- safety acknowledgement;

- previous proof review notes;

- decision history.

Proof verifiers should not see unrelated course drafts or unrelated
learner records unless they also hold another role.

# 18. Organization Admin Visibility
Organization admins may see safe organization summaries.

They may see:

- staff enrolled;

- staff completing courses;

- certificates earned;

- verified achievements earned;

- capacity areas covered;

- proof statuses where visibility allows;

- recommended next learning areas;

- donor-safe visibility settings where enabled.

They should not automatically see:

- raw proof files;

- individual test answers;

- private learner notes;

- sensitive safeguarding/protection submissions;

- internal reviewer comments;

- other organizations’ data.

Organization visibility should depend on platform policy and consent.

# 19. Monitoring Dashboard Safety
Monitoring dashboards should show useful information without exposing
sensitive details.

Safe dashboard practices:

- aggregate where possible;

- restrict raw records;

- separate certificates from verified achievements;

- show proof status without exposing raw proof;

- use role-based filters;

- hide sensitive flags from unauthorized users;

- avoid ranking CSOs publicly;

- avoid exposing weaknesses without consent;

- use safe summary wording.

Dashboard labels should avoid overclaiming.

Use:

- “Certificates issued”

- “Verified achievements awarded”

- “Capacity areas covered”

- “Proof submissions under review”

Avoid:

- “Certified CSOs”

- “Fully competent organizations”

- “Donor-ready ranking”

- “Weak CSOs”

# 20. Data Safety in Review and Publish
Reviewers and publishers should check data safety before courses go
live.

Review should confirm:

- course does not ask learners to upload unsafe data;

- practical proof instructions include redaction/anonymization guidance;

- sensitive scenarios are fictionalized or safe;

- AI-generated sensitive content is reviewed;

- final test questions do not ask for real cases;

- badge wording does not overclaim;

- donor visibility is not enabled for raw proof.

Publish should be blocked if:

- proof pathway lacks safety warning;

- raw proof is donor-visible by default;

- high-risk content lacks specialist review;

- certificate wording overclaims field competence;

- donor-facing summary includes sensitive details;

- practical proof is incorrectly required for certificate.

# 21. Consent Record Specification
If donor or external visibility is enabled, the platform should record
consent.

Recommended consent record fields:

| **Field**             | **Required?**                          | **Purpose**                             |
|-----------------------|----------------------------------------|-----------------------------------------|
| Consent ID            | Yes                                    | Unique record                           |
| Organization ID       | Yes where organization evidence shared | CSO ownership                           |
| Learner ID            | If learner-level evidence shared       | Learner consent                         |
| Achievement ID        | If achievement visibility shared       | Specific recognition                    |
| Visibility type       | Yes                                    | Donor-safe, public, partner, report use |
| Data included         | Yes                                    | What will be shown                      |
| Data excluded         | Yes                                    | Usually raw proof and sensitive records |
| Consent given by      | Yes                                    | Authorized person                       |
| Role of consent giver | Yes                                    | Learner/org admin/DEC admin             |
| Consent date          | Yes                                    | Timestamp                               |
| Expiry/review date    | Optional                               | Future review                           |
| Withdrawal status     | Yes                                    | Active/withdrawn                        |
| Withdrawal date       | If withdrawn                           | Audit trail                             |
| Notes                 | Optional                               | Conditions                              |

Phase 1 may implement simplified consent, but external donor visibility
should not be enabled without some consent record or explicit
admin-controlled safe setting.

# 22. Visibility Setting Record
For verified achievements and organization summaries, the platform
should store visibility settings.

Recommended fields:

| **Field**                                | **Purpose**                                           |
|------------------------------------------|-------------------------------------------------------|
| Record ID                                | Unique setting                                        |
| Achievement ID / organization summary ID | What visibility applies to                            |
| Current visibility level                 | Private, org-visible, DEC-visible, donor-safe, public |
| Raw proof visible?                       | Should default to No                                  |
| Donor-safe summary text                  | Approved safe wording                                 |
| Approved by                              | Role/user                                             |
| Consent record ID                        | Link to consent                                       |
| Last updated                             | Audit                                                 |
| Updated by                               | Accountability                                        |
| Visibility status                        | Active, hidden, withdrawn, archived                   |

# 23. Unsafe Submission Handling
When proof contains unsafe data, the platform should support a clear
response.

Reviewer/verifier decision options:

| **Decision**             | **Meaning**                                            | **Result**                         |
|--------------------------|--------------------------------------------------------|------------------------------------|
| Redaction required       | Submission may be valid if sensitive parts are removed | Learner asked to revise            |
| Unsafe / restrict access | Submission contains serious sensitive data             | Access restricted; no badge issued |
| Remove submission        | Data should not remain in the platform                 | Admin/specialist action            |
| Escalate                 | Specialist review required                             | Assigned specialist notified       |
| Reject                   | Proof not acceptable or unsafe                         | No badge issued                    |

Learner-facing revision message:

Your submission may contain sensitive information. Please remove names,
contact details, exact locations, active case details, or other
identifying information and resubmit.

# 24. Data Retention and Deletion Considerations
Phase 1 may not implement full retention automation, but the product
should respect the following principles:

- keep certificates and published course records for evidence integrity;

- keep audit records for key workflow actions;

- restrict access to raw proof;

- allow unsafe proof to be removed or restricted;

- preserve version-aware learning records;

- avoid indefinite exposure of sensitive raw uploads;

- support future retention policy.

Data retention details may be defined by DEC policy, but the platform
should not make unsafe data impossible to remove or hide.

# 25. Audit Trail for Data Safety
The platform should record key data safety actions.

Recommended audit events:

- proof submitted;

- safety warning acknowledged;

- proof viewed by verifier;

- proof marked unsafe;

- redaction requested;

- proof removed/restricted;

- verified achievement awarded;

- visibility setting changed;

- donor-safe summary enabled;

- consent granted;

- consent withdrawn;

- raw proof access attempted;

- specialist review requested;

- specialist review completed.

Each event should include:

- user;

- role;

- timestamp;

- record affected;

- action;

- reason/note where relevant.

# 26. Data Safety and Certificate Wording
Certificate wording must not overclaim.

A certificate means:

> Learner completed a course and scored 80% or above on the final test.

It does not mean:

- practical proof was verified;

- CSO applied the learning in the field;

- organization is fully competent;

- organization is donor-ready;

- learner is professionally certified in the technical area.

Recommended certificate wording:

This certifies that \[Learner Name\] has successfully completed \[Course
Title\] through the DEC Learning Hub and achieved the required final
test score for course certification.

Avoid:

This certifies that \[Learner Name\] is fully competent in safeguarding.

# 27. Data Safety and Badge Wording
Verified achievement/badge wording should also avoid overclaiming.

Recommended:

Awarded for submitting reviewed practical evidence of applying
\[specific task\] linked to \[capacity area\].

Avoid:

This organization is fully donor-ready.

A verified achievement is evidence of a specific reviewed task, not full
organizational certification.

# 28. Minimum Phase 1 Requirements
For Phase 1, Codex should minimally implement or align:

1.  Role-based visibility for learner, creator, reviewer, verifier,
    admin, and organization admin views.

2.  Raw proof private by default.

3.  Donor visibility disabled by default or limited to safe summaries.

4.  Safety warning before proof submission.

5.  Redaction/anonymization guidance for proof.

6.  Reviewer/verifier option to mark proof unsafe or request redaction.

7.  Practical proof separated from certificate.

8.  Certificate issued at 80%+ without proof.

9.  AI prompt warning against sensitive data.

10. AI-generated sensitive content requires human/specialist review.

11. Monitoring dashboards avoid raw proof exposure.

12. Organization summaries are safe and not overclaiming.

13. Badge/achievement visibility settings.

14. Basic consent/visibility record if donor-safe sharing is enabled.

15. Audit events for proof submission, unsafe marking, badge award, and
    visibility changes.

# 29. Future Enhancements
Future versions may add:

- full consent management dashboard;

- organization-managed external visibility controls;

- donor-facing portal;

- public/private badge profile;

- advanced data retention automation;

- sensitive data detection;

- redaction tool;

- privacy impact workflow;

- audit log dashboard;

- role-based row-level policies;

- learner data export;

- consent withdrawal workflow;

- organization evidence sharing agreements;

- external verification page;

- automated proof safety scanning.

These should not delay Phase 1 safe defaults.

# 30. Implementation Guidance for Codex
Codex should implement this annex as product safety logic, not only
warning text.

## 30.1 Required implementation behavior
Codex should:

- inspect existing role and data access logic before changing;

- preserve working permissions where aligned;

- restrict raw proof access by role;

- avoid donor visibility for raw proof;

- add proof safety warning and acknowledgement;

- keep certificate and proof independent;

- add visibility settings for achievements where enabled;

- ensure monitoring dashboards use safe summaries;

- ensure AI prompt areas show sensitive data warning;

- add tests or manual checks for role visibility;

- provide evidence showing raw proof is not visible to unauthorized
  roles.

## 30.2 What Codex should not do
Codex should not:

- expose raw proof to donors;

- expose learner test scores publicly;

- require proof for certificate;

- create public CSO rankings;

- allow unreviewed sensitive AI content to publish;

- allow proof submission without safety warning;

- make verified achievements donor-visible by default;

- expose internal reviewer notes to learners/donors;

- claim course completion means organizational transformation.

## 30.3 Acceptance criteria examples
Given a learner submits practical proof,

when a donor-facing user opens the organization summary,

then the raw proof file is not visible or downloadable.

Given practical proof is enabled,

when a learner opens the proof submission page,

then the learner must see safety and anonymization guidance before
submitting.

Given a learner scores 80% on the final test,

when no practical proof has been submitted,

then the certificate is still issued.

Given a proof verifier marks a submission as unsafe/redaction required,

when the learner opens proof status,

then the learner sees a redaction request and no verified achievement is
awarded.

Given donor-safe visibility is enabled for a verified achievement,

when the donor opens the summary,

then the donor sees only the approved safe summary and not raw proof,
reviewer notes, or learner test score.

Given a course creator views analytics for their course,

when practical proof submissions exist,

then they see aggregate proof status but not raw proof unless assigned
as verifier.

# 31. Recommended Repo Placement
This annex should be saved as:

docs/specs/core-workflow/ANNEX_12_DATA_SAFETY_CONSENT_AND_VISIBILITY_RULES.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_12_DATA_SAFETY_CONSENT_AND_VISIBILITY_RULES.md

Defines role-based data visibility, consent rules, proof safety,
donor-safe summaries, AI data safety, unsafe submission handling, audit
events, and Codex acceptance criteria for protecting learners, CSOs, and
sensitive evidence.

# 32. Success Standard for This Annex
This annex is successful when:

> Codex and developers can implement safe default visibility, protect
> raw proof, separate certificates from proof, require consent for
> donor-safe summaries, restrict sensitive records by role, warn users
> before risky submissions, and prevent monitoring or recognition
> features from exposing CSOs, learners, or communities to avoidable
> harm.

In practical terms, this annex should prevent:

> “A donor or unauthorized user can open raw proof files, see learner
> scores, or view sensitive CSO weaknesses.”

And ensure:

> “Learners receive certificates at 80%+, practical proof remains
> private by default, verified achievements can be summarized safely
> with consent, and DEC can use evidence for learning and reporting
> without creating unnecessary risk.”

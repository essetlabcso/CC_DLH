# Annex 8: Final Test and Certificate Specification
## DEC Learning Hub Course Creator Portal
## 1. Purpose of This Annex
This annex defines the **Final Test and Certificate Specification** for the DEC Learning Hub Course Creator Portal and learner-facing platform.

Its purpose is to help Codex/GPT-5.5, developers, course creators, reviewers, publishers, and DEC stakeholders implement final tests and certificates consistently across:
- Build Studio;
- Review Workflow;
- Publish Workflow;
- Learner Runtime;
- Learner Dashboard;
- Certificate Registry;
- Monitoring and Evaluation dashboards.

The core rule is:

> **A learner who scores 80% or above on the final test passes the course and receives an automated course certificate.**

This rule is binding for Phase 1.

Practical proof, verified achievements, and badges are separate from certificates. A learner does **not** need to submit practical proof to receive a course certificate.

# 2. Binding Certificate Rule
The correct certificate rule is:

> **80%+ final test score = course pass and automated certificate.**

This means:

| **Final test score** | **Course result** | **Certificate result**           |
|----------------------|-------------------|----------------------------------|
| Below 80%            | Not passed yet    | No certificate                   |
| 80% or above         | Passed            | Certificate issued automatically |

Any older document, draft, implementation note, test condition, dashboard label, or UI copy suggesting a 90% certificate threshold is superseded.

The platform must not implement:
- 90% certificate threshold;
- 80% pass but 90% certificate;
- certificate only after practical proof;
- certificate only after badge approval;
- certificate only after reviewer validation of proof.

The certificate is issued based on the final test score only.

# 3. Distinction Between Certificate and Verified Achievement
The platform must clearly separate the course certificate from practical proof and verified achievements.

| **Recognition type**         | **Basis**                                   | **Required for course certificate?** | **Review type**                  |
|------------------------------|---------------------------------------------|--------------------------------------|----------------------------------|
| Course certificate           | Final test score of 80% or above            | Yes, final test only                 | Automated scoring                |
| Practical proof submission   | Learner/CSO submits evidence of application | No                                   | Human/verifier review if enabled |
| Verified achievement / badge | Submitted proof is reviewed and accepted    | No                                   | Human/verifier decision          |

Learner-facing explanation:

> Complete the final test. If you score 80% or above, you pass the course and receive your certificate. Practical proof is a separate opportunity to show applied capacity and may lead to a verified achievement or badge.

This distinction should appear wherever learners may confuse certification with proof or badges.

# 4. Purpose of the Final Test
The final test confirms that the learner has met the minimum learning standard for course completion.

It should assess essential knowledge, decision logic, or practical judgment taught in the course.

The final test should be linked to:
- approved performance goal;
- required learner actions;
- minimum information;
- course blocks;
- practice activities;
- scenario decisions;
- safeguarding or data safety rules where relevant;
- practical output preparation where relevant.

The final test should not assess:
- content not taught in the course;
- broad theory unrelated to the performance goal;
- obscure terminology not needed for practice;
- unsupported donor or legal claims;
- learner disclosure of sensitive personal or organizational data;
- practical proof quality.

The final test is not the same as practical proof review. It checks learning; proof review checks applied evidence where enabled.

# 5. Final Test Placement in the Workflow
The final test should appear in multiple workflow areas.

| **Workflow area**    | **Required behavior**                                                                      |
|----------------------|--------------------------------------------------------------------------------------------|
| Analysis             | Evaluation anchor may identify what learning evidence should later be tested               |
| Design               | Assessment intent is defined; final test focus is linked to required actions               |
| Build                | Creator configures final test questions, scoring, feedback, and certificate threshold      |
| Review               | Reviewer validates test quality, answer keys, alignment, and 80% certificate rule          |
| Publish              | Publisher confirms final test and certificate setup before release                         |
| Learner Runtime      | Learner takes final test; system scores attempt                                            |
| Certificate Registry | Certificate issued automatically at 80%+                                                   |
| Monitoring           | Final test attempts, scores, pass rate, certificates, and question performance are tracked |

Final test configuration belongs mainly in the Build Studio, but its quality is controlled by Design and Review.

# 6. Final Test Configuration Fields
Each certifying course should have a Final Test Record.

Recommended fields:

| **Field**                            | **Required?**      | **Purpose**                           |
|--------------------------------------|--------------------|---------------------------------------|
| Final test ID                        | Yes                | Unique test record                    |
| Course ID                            | Yes                | Links test to course                  |
| Course version ID                    | Yes                | Version-aware tracking                |
| Test title                           | Yes                | Learner-facing label                  |
| Test description/instructions        | Yes                | Explains test purpose                 |
| Pass/certificate threshold           | Yes                | Must be 80%                           |
| Attempts allowed                     | Yes                | Defines retake rule                   |
| Score calculation method             | Yes                | Percent correct or configured scoring |
| Feedback setting                     | Yes                | Shows whether feedback appears        |
| Randomization setting                | Optional           | Future enhancement if supported       |
| Question list                        | Yes                | Test items                            |
| Linked required actions              | Yes                | Traceability                          |
| Linked course blocks                 | Yes                | Ensures taught content is tested      |
| Safeguarding/data questions included | Where relevant     | Confirms safety-related learning      |
| Review status                        | Yes                | Draft, ready, approved, returned      |
| Approved by                          | Yes before Publish | Reviewer/admin validation             |
| Last updated                         | Yes                | Audit trail                           |

The threshold field should either be fixed at 80% for Phase 1 or only editable by DEC Admin with strict validation.

# 7. Supported Final Test Question Types
Phase 1 should support simple automated item types.

Recommended item types:

| **Question type**       | **Best use**                                                         |
|-------------------------|----------------------------------------------------------------------|
| Multiple choice         | Concepts, best-fit decisions, key rules, scenario judgment           |
| Multiple response       | Selecting all correct steps or risks                                 |
| True/false              | Clear rules, cautions, distinctions                                  |
| Matching                | Terms to examples, indicators to evidence, roles to responsibilities |
| Sequencing              | Referral steps, reporting steps, feedback handling process           |
| Scenario-based question | Practical judgment in realistic CSO situations                       |

Future item types may include:
- short answer with human review;
- file-based task;
- peer assessment;
- adaptive test items;
- randomized question banks.

For Phase 1, final test scoring should remain reliable and automated.

# 8. Final Test Item Specification
Each final test question should have a structured item record.

Recommended fields:

| **Field**                          | **Required?**      | **Purpose**                                     |
|------------------------------------|--------------------|-------------------------------------------------|
| Question ID                        | Yes                | Unique item                                     |
| Question type                      | Yes                | MCQ, true/false, matching, sequencing, scenario |
| Question text                      | Yes                | Learner-facing prompt                           |
| Answer options                     | Yes where relevant | Possible answers                                |
| Correct answer / best answer       | Yes                | Scoring                                         |
| Feedback for correct answer        | Recommended        | Reinforces learning                             |
| Feedback for incorrect answer      | Recommended        | Guides improvement                              |
| Linked course block                | Yes                | Confirms content was taught                     |
| Linked required action             | Yes                | Confirms action alignment                       |
| Linked minimum information         | Recommended        | Confirms essential knowledge                    |
| Linked capacity area               | Inherited          | Monitoring and taxonomy                         |
| Difficulty level                   | Optional           | Easy/medium/hard                                |
| Safeguarding/data sensitivity flag | Where relevant     | Specialist review                               |
| AI-generated flag                  | Where relevant     | Human review requirement                        |
| Human verified status              | Yes before Publish | Quality control                                 |
| Reviewer note                      | Optional           | QA traceability                                 |

A final test item should not be approved unless it links to taught content or an approved learner action.

# 9. Final Test Quality Standards
A good final test question should be:
- clear;
- fair;
- aligned with course content;
- linked to a required action or minimum information item;
- free from trick wording;
- understandable on mobile;
- realistic for CSO learners;
- safe for sensitive topics;
- technically accurate;
- human-verified if AI-assisted.

A weak question:

> What is MEAL?

A stronger question:

> Which example best shows outcome evidence rather than only an activity count?

A weak question:

> Is safeguarding important?

A stronger question:

> A community member reports a safeguarding concern. What should the field officer do first according to the referral pathway taught in this course?

A weak question:

> Which donor rule is correct?

A stronger question:

> Which budget justification best links an activity, cost, and allowable category based on the example used in this course?

# 10. Final Test Alignment Rules
Every final test must satisfy the alignment rule:

> Test only what the course taught and what the learner was expected to practice or understand.

Each question should map to at least one of:
- course block;
- required action;
- minimum information;
- practice activity;
- scenario decision;
- safeguarding or data safety instruction;
- practical output preparation step.

The Build Studio should show an alignment indicator such as:

| **Question** | **Linked course element**            | **Status** |
|--------------|--------------------------------------|------------|
| Q1           | Block 2: Output vs Outcome Explainer | Linked     |
| Q2           | Required Action 1: Select indicator  | Linked     |
| Q3           | Scenario 1: Feedback escalation      | Linked     |
| Q4           | Not linked                           | Warning    |

Questions that are not linked should be flagged before Review.

# 11. Scoring Rules
The Phase 1 default scoring rule should be:

> Final score = percentage of correctly answered final test questions.

The course pass and certificate threshold is:

> **80% or above.**

Example:

| **Total questions** | **Correct answers needed for 80%+** | **Certificate?**      |
|---------------------|-------------------------------------|-----------------------|
| 5                   | 4                                   | Yes if 4 or 5 correct |
| 10                  | 8                                   | Yes if 8–10 correct   |
| 15                  | 12                                  | Yes if 12–15 correct  |
| 20                  | 16                                  | Yes if 16–20 correct  |

For item counts where 80% creates a decimal, the system should use a clear rule, preferably percentage calculation rounded consistently.

Recommended implementation:
- calculate exact percentage;
- compare scorePercentage \>= 80;
- issue certificate if true.

Avoid ambiguous text such as “must get 8 out of 10” unless the test length is fixed.

# 12. Retake Rules
The platform should support configurable retake behavior.

Recommended fields:

| **Retake setting**     | **Options**                                         |
|------------------------|-----------------------------------------------------|
| Retakes allowed        | Yes / No                                            |
| Maximum attempts       | Unlimited / fixed number                            |
| Waiting period         | None / configured time                              |
| Score kept             | Highest score / latest score                        |
| Feedback after attempt | Immediate / after pass / after final attempt / none |
| Review recommendation  | Show suggested review blocks before retake          |

Default Phase 1 recommendation:
- allow retakes unless DEC decides otherwise;
- keep highest score for certificate eligibility;
- show learner which areas to review if possible;
- do not issue multiple certificates for repeated passing attempts.

Learner-facing messages:

| **Result** | **Message**                                                                        |
|------------|------------------------------------------------------------------------------------|
| Below 80%  | You have not passed yet. Review the course and try again if retakes are available. |
| 80%+       | Congratulations. You passed and your certificate is available.                     |

# 13. Certificate Trigger Logic
The platform should trigger certificate creation automatically when:

1.  learner completes final test attempt;

2.  score is calculated;

3.  score percentage is 80% or above;

4.  course is certifying;

5.  certificate has not already been issued for that learner/course version, unless replacement logic applies.

Pseudologic:

IF course.isCertifying = true

AND finalTestAttempt.scorePercentage \>= 80

AND certificate does not already exist for learner + courseVersion

THEN create Certificate Record

AND mark learner course state = Passed / Certificate Earned

If a certificate already exists, the platform should avoid duplicate certificate creation unless DEC intentionally supports re-issued certificates.

# 14. Certificate Record Specification
Each certificate should create a Certificate Record.

Recommended fields:

| **Field**                          | **Required?** | **Purpose**                         |
|------------------------------------|---------------|-------------------------------------|
| Certificate ID                     | Yes           | Unique certificate                  |
| Verification code / public ID      | Recommended   | Authenticity check                  |
| Learner ID                         | Yes           | Certificate owner                   |
| Learner name                       | Yes           | Display name                        |
| Course ID                          | Yes           | Course reference                    |
| Course version ID                  | Yes           | Version integrity                   |
| Course title at time of completion | Yes           | Historical accuracy                 |
| Capacity area                      | Recommended   | Course context                      |
| Final test attempt ID              | Yes           | Evidence of eligibility             |
| Final score                        | Yes           | Eligibility evidence                |
| Pass threshold                     | Yes           | Should show 80%                     |
| Issue date                         | Yes           | Certificate date                    |
| Issuing platform                   | Yes           | DEC Learning Hub                    |
| Certificate status                 | Yes           | Active, revoked, reissued, archived |
| Download/view history              | Optional      | Monitoring                          |
| Revocation reason                  | If revoked    | Audit trail                         |

The certificate should link to the exact course version the learner completed.

# 15. Certificate Content and Wording
The certificate should be careful and not overclaim.

Recommended certificate fields:
- DEC Learning Hub name and logo;
- learner name;
- course title;
- completion date;
- certificate ID or verification code;
- statement that learner successfully completed the course;
- optional capacity area;
- optional course duration;
- optional issuing organization signature/mark.

Suggested wording:

> This certifies that **\[Learner Name\]** has successfully completed **\[Course Title\]** through the DEC Learning Hub and achieved the required final test score for course certification.

If capacity area is included:

> This course contributes to learning in **\[Capacity Area\]**.

Avoid wording such as:
- “Certified expert in MEAL”;
- “Fully competent in financial management”;
- “Organization is donor-ready”;
- “Safeguarding certified professional”;
- “Verified applied capacity.”

Those claims belong, if at all, to a separate verified achievement process based on reviewed proof.

# 16. Certificate UI Behavior
## 16.1 Learner dashboard
Learner dashboard should show:

| **State**                 | **UI behavior**                                                  |
|---------------------------|------------------------------------------------------------------|
| Final test not attempted  | Show “Final test required for certificate”                       |
| Score below 80%           | Show “Not passed yet” and retake/review option if enabled        |
| Score 80%+                | Show “Certificate earned” and view/download option               |
| Certificate issued        | Show certificate date and verification code where enabled        |
| Course has optional proof | Show separate “Submit practical proof” option, clearly separated |

## 16.2 Course completion screen
After final test:

If below 80%:

> You scored \[X\]%. You need 80% or above to pass and receive your certificate. Review the course and try again if retakes are available.

If 80% or above:

> Congratulations. You scored \[X\]%, passed the course, and your certificate is available.

If proof is enabled:

> You may also submit practical proof for a separate verified achievement or badge. This is not required for your course certificate.

# 17. Creator Build Studio Requirements
In Build Studio, the creator should be able to:
- add/configure final test;
- select question types;
- link questions to course blocks or required actions;
- enter correct answers and feedback;
- preview final test;
- see fixed certificate threshold as 80%;
- configure retake settings where allowed;
- confirm certificate wording/template;
- see warning if final test is missing;
- see warning if questions are unlinked;
- see warning if AI-generated questions are unverified.

The certificate threshold should be displayed as:

> Certificate threshold: 80%+ final test score

It should not be shown as editable for ordinary creators if the rule is product-wide.

# 18. Review Requirements
Reviewers must validate final test and certificate setup before approving a course.

Review checklist:

| **Review question**                                         | **Expected result** |
|-------------------------------------------------------------|---------------------|
| Is the final test included?                                 | Yes                 |
| Are questions linked to taught content or required actions? | Yes                 |
| Are answer keys correct?                                    | Yes                 |
| Are questions fair and clear?                               | Yes                 |
| Are AI-generated questions human-verified?                  | Yes                 |
| Are safeguarding/data questions safe where relevant?        | Yes                 |
| Does the test avoid unsupported legal/donor claims?         | Yes                 |
| Is the certificate threshold 80%+?                          | Yes                 |
| Is there no 90% certificate threshold?                      | Yes                 |
| Is practical proof clearly separate from certificate?       | Yes                 |
| Does certificate wording avoid overclaiming?                | Yes                 |
| Does learner preview show correct pass/fail behavior?       | Yes                 |

A course should not be approved for Publish if the final test is missing, misaligned, incorrectly scored, or using the wrong certificate rule.

# 19. Publish Requirements
Before publication, the publisher/admin should confirm:
- course is approved for Publish;
- final test is approved;
- certificate threshold is 80%+;
- course is marked certifying or non-certifying correctly;
- certificate template is available;
- learner preview was completed;
- practical proof is separate from certificate;
- published version is recorded.

Publish should be blocked if:
- Review has not approved the final test;
- certificate threshold is not 80%;
- certificate template is missing for a certifying course;
- final test is not configured for a certifying course;
- practical proof is incorrectly required for certificate.

# 20. Learner Runtime Requirements
Learner runtime should:
- display final test instructions clearly;
- allow learner to start final test after required course conditions;
- save attempts;
- calculate score;
- compare score to 80%;
- show pass/fail result;
- issue certificate at 80%+;
- show retake options where enabled;
- show certificate in learner dashboard;
- keep proof/badge pathway separate;
- send monitoring event for attempt and certificate issuance.

Learners should never see internal metadata such as:
- final test item linkage IDs;
- reviewer notes;
- AI review logs;
- handover records;
- internal certificate config.

# 21. Monitoring Requirements
Monitoring should track final test and certificate evidence.

Recommended metrics:

| **Metric**                          | **Meaning**                           |
|-------------------------------------|---------------------------------------|
| Final test attempts                 | Learners who attempted the test       |
| First-attempt pass rate             | Learners who passed on first attempt  |
| Overall pass/certificate rate       | Learners who scored 80%+              |
| Average score                       | Course-level performance              |
| Question-level performance          | Identifies confusing or weak items    |
| Retake rate                         | Indicates difficulty or learning gaps |
| Certificate count                   | Certificates issued at 80%+           |
| Certificate count by capacity area  | Capacity-linked completion evidence   |
| Certificate count by organization   | Organization-level learning summary   |
| Certificate count by course version | Version-aware evidence                |

Monitoring should not count verified achievements as certificates or certificates as verified applied capacity.

# 22. Version Control and Certificate Integrity
Certificates must be tied to the exact published course version.

If a course is revised after publication:
- existing learner certificates remain linked to the version completed;
- new learners complete the new version;
- certificate records should not silently migrate to the new version;
- if a final test changes significantly, the new course version should have separate test records;
- monitoring should distinguish certificate counts by version.

This protects evidence integrity and avoids confusion.

# 23. Certificate Revocation or Correction
Phase 1 may not need full certificate revocation workflows, but the product model should support future correction.

Possible certificate states:

| **State** | **Meaning**                               |
|-----------|-------------------------------------------|
| Active    | Valid certificate                         |
| Reissued  | Corrected or replaced certificate         |
| Revoked   | Certificate invalidated by admin decision |
| Archived  | Historical record retained                |

Revocation should be restricted to DEC Admin and require a reason.

Examples:
- certificate issued due to technical error;
- learner identity error;
- course/test misconfiguration discovered;
- duplicate certificate record.

Revocation should not be routine.

# 24. Non-Certifying Courses
DEC may eventually choose to publish informational courses without certificates.

If supported, the course should clearly indicate:
- certifying course: final test required and certificate available at 80%+;
- non-certifying course: no certificate is issued.

For Phase 1, the default should be certifying course unless DEC marks otherwise.

Non-certifying courses should not confuse learners with final test certificate messaging.

# 25. AI-Generated Final Test Items
AI may draft final test items, but human verification is mandatory.

AI-generated final test items must:
- be marked AI-assisted;
- link to course block or required action;
- have correct answer verified by human;
- be reviewed for clarity and fairness;
- be reviewed for safeguarding/data risks where relevant;
- not introduce content outside the course;
- not change certificate threshold.

A test item should not be publishable if:
- AI-generated and unverified;
- not linked to course content;
- answer key is missing;
- answer key is uncertain;
- content is high-risk and specialist review is incomplete.

# 26. Data Safety in Final Tests
Final tests should not ask learners to disclose sensitive information.

They should not ask for:
- real beneficiary names;
- real safeguarding/protection cases;
- politically sensitive details;
- internal confidential documents;
- personal phone numbers or addresses;
- real complaint logs.

For sensitive topics, use fictionalized scenarios.

Example:

Good:

> In this fictional scenario, a field officer receives a sensitive complaint. Which action should they take first?

Bad:

> Describe a real safeguarding case from your organization and explain what happened.

# 27. Minimum Phase 1 Requirements
For Phase 1, Codex should minimally implement or align:

1.  Final Test Record for certifying courses.

2.  Automated scoring for supported question types.

3.  Certificate threshold fixed or validated at 80%+.

4.  Certificate generation at 80%+ final test score.

5.  No certificate below 80%.

6.  No 90% certificate threshold anywhere.

7.  Practical proof not required for certificate.

8.  Final test items linked to course blocks or required actions.

9.  AI-generated test items require human verification.

10. Review checklist validates final test and certificate setup.

11. Learner dashboard shows certificate status.

12. Certificate Record links to learner, course, course version, score, issue date, and certificate ID.

13. Monitoring counts final test attempts, pass rate, and certificates at 80%+.

14. Certificate wording avoids overclaiming applied or organizational capacity.

# 28. Future Enhancements
Future versions may add:
- randomized question banks;
- adaptive testing;
- item difficulty calibration;
- advanced question analytics;
- QR code certificate verification;
- public certificate verification page;
- reissued/revoked certificate workflow;
- multilingual certificate templates;
- organization-level certificate summaries;
- external credential integrations;
- certificate expiry/renewal;
- badge-wallet integration;
- proctored assessments, if ever needed.

These should not delay the Phase 1 requirement: final test works, score is calculated, certificate is issued at 80%+, and monitoring records it.

# 29. Implementation Guidance for Codex
Codex should implement this annex as product logic, not only UI text.

## 29.1 Required implementation behavior
Codex should:
- find existing final test/certificate logic before changing anything;
- preserve working logic if it already uses 80%;
- remove or override any 90% certificate threshold;
- ensure certificate trigger uses score \>= 80;
- ensure practical proof status does not affect certificate issuance;
- link certificate to course version;
- show certificate status in learner dashboard;
- expose final test readiness in Build and Review;
- add tests for 79% and 80% behavior;
- ensure monitoring uses 80% certificate count.

## 29.2 What Codex should not do
Codex should not:
- change threshold to 90%;
- require proof for certificate;
- issue badge as certificate;
- treat certificate as verified field application;
- allow unreviewed AI questions to publish;
- allow final test questions not linked to course content;
- expose internal test metadata to learners;
- edit published test records without version/revision logic.

## 29.3 Acceptance criteria examples
Given a learner scores 79% on the final test,

when the final test attempt is saved,

then the learner does not pass and no certificate record is created.

Given a learner scores exactly 80% on the final test,

when the final test attempt is saved,

then the learner passes and a certificate record is created automatically.

Given a learner scores 80% and has not submitted practical proof,

when the course completion state is evaluated,

then the learner still receives the course certificate.

Given a course has practical proof enabled,

when the learner passes the final test,

then the certificate is issued separately from the proof submission and badge workflow.

Given a final test question is AI-generated,

when the creator attempts to submit the course for Review,

then the item must be marked human-verified or flagged as unresolved.

Given a published course is revised with new final test items,

when learners complete the new version,

then their certificate records link to the new course version and older certificates remain linked to the old version.

# 30. Recommended Repo Placement
This annex should be saved as:

docs/specs/core-workflow/ANNEX_08_FINAL_TEST_AND_CERTIFICATE_SPECIFICATION.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_08_FINAL_TEST_AND_CERTIFICATE_SPECIFICATION.md

Defines final test configuration, scoring, certificate trigger, 80% certificate rule, certificate record fields, learner runtime behavior, review requirements, monitoring requirements, version integrity, and Codex acceptance criteria.

# 31. Success Standard for This Annex
This annex is successful when:

> Codex and developers can implement final test and certificate behavior so that every certifying course has an aligned final test, learners receive certificates automatically at 80% or above, practical proof remains separate, certificates link to the correct course version, and monitoring accurately reports final test and certificate evidence.

In practical terms, this annex should prevent:

> “A learner scores 80% but does not receive a certificate because the system expects 90% or practical proof.”

And ensure:

> “A learner scores 80% or above, receives the course certificate automatically, and may separately submit practical proof for a verified achievement or badge where enabled.”

# **Annex 11: Monitoring, Evaluation, and Dashboard Data Specification**

## **DEC Learning Hub Course Creator Portal**

## **1. Purpose of This Annex**

This annex defines the **Monitoring, Evaluation, and Dashboard Data Specification** for the DEC Learning Hub Course Creator Portal and learner-facing platform.

Its purpose is to guide Codex/GPT-5.5, developers, DEC admins, course creators, reviewers, M&E leads, organization admins, and future donor-facing users on what data should be captured, how it should be structured, how dashboards should interpret it, and how it should remain linked to the DEC CSO capacity-strengthening workflow.

This annex should guide implementation of:

- learner enrollment tracking;

- learner progress tracking;

- final test attempts and scores;

- certificate issuance at 80%+;

- practical proof submissions;

- proof review status;

- verified achievements and badges;

- learner feedback;

- course improvement signals;

- dashboard filters and metrics;

- organization-level summaries;

- version-aware analytics;

- safe donor-facing summaries, if enabled later.

The core rule is:

> Monitoring and Evaluation should connect learner activity back to the original CSO capacity gap, Analysis baseline, Design performance goal, course version, final test, certificate, practical proof, verified achievement, and course improvement decisions.

The platform should not only count completions. It should help DEC understand:

> Which CSO capacity areas are being strengthened, where learners are progressing, where they struggle, what practical evidence is being submitted, what achievements are verified, and which courses need improvement.

# **2. Monitoring and Evaluation Product Principle**

The DEC Learning Hub should function as a **learning and capacity evidence system**, not only as an LMS analytics dashboard.

Standard LMS analytics often focus on:

- enrollments;

- course completion;

- quiz score;

- time spent.

The DEC Learning Hub needs more meaningful evidence:

- Which CSO capacity gap was the course designed to address?

- Which target learner group was reached?

- Which CSO capacity area and indicator were supported?

- How many learners passed the final test and earned certificates?

- Which learners or CSOs submitted practical proof?

- Which proof submissions were accepted and converted into verified achievements?

- Which courses show weak performance or need revision?

- Which capacity areas have strong evidence and which are still under-supported?

- What safe evidence can be shared with CSOs, DEC, or donors?

The platform should therefore preserve the traceability chain:

> **Analysis → Design → Build → Review → Publish → Learner Runtime → Certificate → Practical Proof → Verified Achievement → Monitoring → Course Improvement**

# **3. Monitoring Data Model Overview**

The monitoring model should be based on connected records, not isolated metrics.

Recommended high-level records:

| **Record**                             | **Purpose**                                                |
|----------------------------------------|------------------------------------------------------------|
| Published Course Record                | Defines the course version being monitored                 |
| Learner Enrollment Record              | Tracks learner access to the course                        |
| Learner Progress Record                | Tracks lesson/block progress                               |
| Final Test Attempt Record              | Tracks assessment attempts and scores                      |
| Certificate Record                     | Tracks certificates issued at 80%+                         |
| Practical Proof Submission Record      | Tracks optional applied-evidence submissions               |
| Proof Review Record                    | Tracks verifier decisions and review status                |
| Verified Achievement / Badge Record    | Tracks accepted practical proof recognition                |
| Learner Feedback Record                | Captures learner perception and application intent         |
| Course Improvement Log                 | Tracks course issues and revision actions                  |
| Organization Capacity Evidence Summary | Aggregates safe evidence by organization and capacity area |
| Dashboard Aggregation Record / View    | Supports role-specific dashboards                          |

These records should be version-aware and linked to the course capacity taxonomy.

# **4. Required Traceability Fields**

Every major monitoring record should preserve enough fields to connect back to the original course purpose.

Recommended shared traceability fields:

| **Field**                        | **Purpose**                                 |
|----------------------------------|---------------------------------------------|
| Course ID                        | Links data to course                        |
| Course version ID                | Ensures version-aware reporting             |
| Published Course ID              | Links to exact release                      |
| Capacity area                    | Enables CSO capacity aggregation            |
| Sub-capacity                     | Enables more specific analysis              |
| Indicator / standard             | Links course to capacity evidence           |
| Target learner group             | Shows who the course supports               |
| Organization ID                  | Enables organization-level summaries        |
| Learner ID                       | Enables learner-level progress              |
| Analysis Handover ID             | Links to original capacity gap and baseline |
| Design Handover ID               | Links to performance goal and action map    |
| Final Test ID                    | Links outcomes to assessment                |
| Practical Proof Configuration ID | Links proof to applied evidence pathway     |
| Timestamp                        | Supports monitoring over time               |
| Status                           | Enables dashboard state tracking            |

The platform should avoid orphan metrics that cannot be linked to course version, capacity area, or learner/organization context.

# **5. Course-Level Monitoring Metrics**

Course-level dashboards should answer:

> How is this specific course performing?

Recommended course-level metrics:

| **Metric**                    | **Meaning**                                       |
|-------------------------------|---------------------------------------------------|
| Total enrolled learners       | Number of learners assigned or enrolled           |
| Started learners              | Learners who opened the course                    |
| Start rate                    | Started learners ÷ enrolled learners              |
| In-progress learners          | Learners who started but have not completed       |
| Completed learners            | Learners who completed course content             |
| Completion rate               | Completed learners ÷ started or enrolled learners |
| Final test attempts           | Number of learners who attempted final test       |
| Final test pass rate          | Learners scoring 80%+ ÷ learners attempting       |
| Certificate count             | Certificates issued at 80%+                       |
| Average final test score      | Overall learning performance                      |
| Retake rate                   | Learners requiring multiple attempts              |
| Drop-off points               | Lessons/blocks where learners stop                |
| Resource downloads            | Use of templates, worksheets, and job aids        |
| Practice activity attempts    | Engagement with applied learning                  |
| Feedback response rate        | Learners who submitted feedback                   |
| Practical proof submissions   | Learners/CSOs submitting optional proof           |
| Verified achievements awarded | Accepted proof converted into recognition         |
| Course improvement flags      | Issues requiring review or revision               |

These should be shown by course version.

# **6. Capacity-Area Monitoring Metrics**

The platform should aggregate data by the nine DEC CSO capacity areas.

Recommended capacity-area metrics:

| **Metric**                                   | **Meaning**                               |
|----------------------------------------------|-------------------------------------------|
| Courses by capacity area                     | Which areas DEC has developed courses for |
| Learners enrolled by capacity area           | Demand/reach                              |
| Learners completed by capacity area          | Engagement and completion                 |
| Certificates issued by capacity area         | Learning achievement at 80%+              |
| Average score by capacity area               | Assessment performance                    |
| Practical proof submissions by capacity area | Applied learning attempts                 |
| Verified achievements by capacity area       | Reviewed applied evidence                 |
| Feedback relevance rating by capacity area   | Learner-perceived relevance               |
| Courses needing improvement by capacity area | Quality gaps                              |
| Organizations reached by capacity area       | Organizational spread                     |
| Indicators/standards covered                 | Framework coverage                        |

This helps DEC avoid over-investing in some capacity areas while neglecting others.

# **7. Learner-Level Monitoring**

Learner dashboards and internal monitoring should track learner progress safely.

Recommended learner-level fields:

| **Field**              | **Purpose**                                 |
|------------------------|---------------------------------------------|
| Learner ID             | Unique learner                              |
| Learner name           | Display                                     |
| Organization ID        | Links to CSO                                |
| Course ID / version ID | Course taken                                |
| Enrollment date        | Start of learning record                    |
| Course status          | Not started, in progress, completed, passed |
| Progress percentage    | Learner progress                            |
| Lessons completed      | Course navigation                           |
| Final test attempts    | Assessment activity                         |
| Highest score          | Certificate eligibility                     |
| Certificate status     | Earned / not earned                         |
| Certificate ID         | Link to certificate                         |
| Practical proof status | Optional evidence pathway                   |
| Verified achievements  | Accepted proof recognitions                 |
| Feedback submitted     | Course improvement data                     |

Learners should see their own progress, certificate, proof status, and achievements. Internal staff may see aggregated or role-appropriate learner data.

# **8. Organization-Level Monitoring**

Organization-level dashboards should show safe summaries for each CSO.

Recommended organization-level metrics:

| **Metric**                             | **Meaning**                              |
|----------------------------------------|------------------------------------------|
| Staff enrolled                         | Number of staff participating            |
| Staff completed                        | Number of staff completing courses       |
| Certificates earned                    | Staff who passed final tests at 80%+     |
| Capacity areas covered                 | Areas where staff completed courses      |
| Verified achievements earned           | Accepted practical proof recognitions    |
| Proof submissions under review         | Current applied-evidence pipeline        |
| Revision requests                      | Proof requiring improvement or redaction |
| Recommended next courses               | Suggested learning pathway               |
| Course feedback themes                 | Aggregated learner feedback              |
| Organization capacity evidence summary | Safe evidence portfolio                  |

Organization dashboards should avoid exposing sensitive raw proof by default.

The dashboard should support careful wording:

> This organization has staff certificates and verified achievements in selected capacity areas.

It should not automatically claim:

> This organization is fully competent or donor-ready.

# **9. Final Test and Certificate Metrics**

The platform must apply the binding rule:

> **80%+ final test score = course pass and automated certificate.**

Recommended final test metrics:

| **Metric**                      | **Meaning**                                  |
|---------------------------------|----------------------------------------------|
| Attempts started                | Learners who began test                      |
| Attempts submitted              | Learners who submitted test                  |
| First-attempt score             | Initial learning performance                 |
| Highest score                   | Best learner score where retakes are allowed |
| Pass/certificate rate           | Learners scoring 80%+                        |
| Certificate count               | Certificates issued                          |
| Retake count                    | Number of additional attempts                |
| Retake success rate             | Learners who pass after retake               |
| Question-level correct rate     | Identifies confusing test items              |
| Average score by course version | Version performance                          |
| Average score by learner group  | Audience-specific insight                    |
| No-certificate count            | Learners below 80%                           |

Certificate metrics must not use 90%.

Monitoring should not require proof submission before counting a certificate.

# **10. Practical Proof Metrics**

Practical proof should be tracked separately from certificates.

Recommended proof metrics:

| **Metric**                | **Meaning**                                   |
|---------------------------|-----------------------------------------------|
| Proof pathway enabled     | Course includes optional proof                |
| Eligible learners         | Learners who can submit proof                 |
| Proof drafts              | Learners who started proof but did not submit |
| Proof submissions         | Submitted applied evidence                    |
| Proof submission rate     | Submitted ÷ eligible learners                 |
| Proof under review        | Verifier workload                             |
| Revision requested        | Proof needs improvement or redaction          |
| Rejected proof            | Proof did not meet criteria                   |
| Unsafe/redaction required | Data safety concern                           |
| Accepted proof            | Proof meets criteria                          |
| Average proof review time | Operational efficiency                        |
| Common proof weaknesses   | Course/proof instruction improvement          |
| Proof by capacity area    | Applied evidence by capacity                  |
| Proof by organization     | Organization-level evidence activity          |

Important interpretation:

| **Evidence**             | **Meaning**                                           |
|--------------------------|-------------------------------------------------------|
| Proof submitted          | Learner/CSO attempted to show application             |
| Proof accepted           | Evidence was reviewed and met criteria                |
| Proof rejected           | Evidence was insufficient or unsafe                   |
| Proof revision requested | Submission needs correction, completion, or redaction |

# **11. Verified Achievement and Badge Metrics**

Verified achievements and badges should be tracked as applied-capacity recognition.

Recommended metrics:

| **Metric**                      | **Meaning**                                |
|---------------------------------|--------------------------------------------|
| Verified achievements awarded   | Accepted proof converted into recognition  |
| Badges awarded by course        | Courses producing verified evidence        |
| Badges awarded by capacity area | Capacity areas with applied evidence       |
| Badges awarded by organization  | Organization capacity evidence             |
| Badges awarded by learner       | Learner applied achievements               |
| Badge approval rate             | Accepted proof ÷ proof submitted           |
| Badge revision rate             | Revision requested ÷ proof submitted       |
| Badge safety issue rate         | Unsafe proof ÷ proof submitted             |
| Badge visibility status         | Private/org-visible/DEC-visible/donor-safe |
| Badge by indicator/standard     | Framework-linked evidence                  |

Badge dashboards should avoid vague or exaggerated interpretations.

Correct:

> 18 Outcome Evidence Practice Badges awarded after proof review.

Incorrect:

> 18 CSOs are fully MEAL competent.

# **12. Learner Feedback Data**

Learner feedback should be short, useful, and linked to course improvement.

Recommended feedback fields:

| **Field**                    | **Response type**   | **Purpose**                   |
|------------------------------|---------------------|-------------------------------|
| Relevance rating             | 1–5                 | Course relevance to CSO work  |
| Clarity rating               | 1–5                 | Ease of understanding         |
| Mobile/usability rating      | 1–5                 | Device/connectivity usability |
| Example realism rating       | 1–5                 | Local CSO relevance           |
| Confidence rating            | 1–5                 | Confidence to apply learning  |
| Most useful part             | Short text          | Positive insight              |
| Most confusing part          | Short text          | Improvement signal            |
| What learner will apply      | Short text          | Application intent            |
| Support needed               | Short text          | Complementary support signal  |
| Safety/accessibility concern | Optional short text | Risk or usability concern     |

Feedback should feed into the Course Improvement Log.

# **13. Course Improvement Signals**

The system should generate or display improvement signals based on monitoring data.

| **Signal**                   | **Possible interpretation**                 | **Suggested action**                                    |
|------------------------------|---------------------------------------------|---------------------------------------------------------|
| High enrollment, low start   | Course value or access unclear              | Improve catalog description or assignment communication |
| High start, low completion   | Course may be too long or difficult         | Review length, structure, mobile usability              |
| Drop-off at specific block   | Block may be confusing or heavy             | Revise block or add support                             |
| Low final test pass rate     | Content or test may be misaligned           | Review teaching blocks and test items                   |
| High failure on one question | Question unclear or content missing         | Revise question or related block                        |
| High retake rate             | Test difficulty or content clarity issue    | Review final test and practice                          |
| Low proof submission rate    | Proof instructions unclear or task too hard | Add examples or simplify proof task                     |
| High proof rejection rate    | Rubric unclear or practice weak             | Improve proof guidance/practice                         |
| High unsafe proof rate       | Safety warning inadequate                   | Strengthen anonymization guidance                       |
| Low relevance feedback       | Analysis/design may be misaligned           | Review target learner and capacity gap                  |
| Low mobile usability rating  | Runtime/accessibility issue                 | Improve layout and low-bandwidth support                |

Course improvement should be a structured workflow, not only informal observation.

# **14. Course Improvement Log Specification**

Each course should have a Course Improvement Log.

Recommended fields:

| **Field**               | **Required?** | **Purpose**                                                    |
|-------------------------|---------------|----------------------------------------------------------------|
| Improvement ID          | Yes           | Unique issue/action                                            |
| Course ID               | Yes           | Course reference                                               |
| Course version ID       | Yes           | Version-specific issue                                         |
| Issue source            | Yes           | Analytics, feedback, review, admin observation, proof pattern  |
| Issue category          | Yes           | Content, test, proof, accessibility, safety, runtime, metadata |
| Issue description       | Yes           | What needs attention                                           |
| Evidence summary        | Recommended   | Data supporting issue                                          |
| Severity                | Yes           | Low, medium, high, blocking                                    |
| Recommended action      | Recommended   | What should be done                                            |
| Decision                | Yes           | Accepted, deferred, rejected, needs review                     |
| Assigned to             | Optional      | Creator/admin/reviewer                                         |
| Status                  | Yes           | Open, in progress, resolved, archived                          |
| Resulting revision      | Optional      | Link to revision/new version                                   |
| Created at / updated at | Yes           | Audit trail                                                    |

The Course Improvement Log should support version control. If a course revision is created, the log should link to the revised version.

# **15. Dashboard Types by Role**

Different roles need different dashboards.

## **15.1 Course Creator Dashboard**

Course creators should see data for courses they own or manage.

Recommended widgets:

- courses by status;

- published course performance;

- enrollment and completion;

- final test pass/certificate rate;

- drop-off points;

- learner feedback;

- proof submissions;

- verified achievements;

- improvement alerts;

- returned review comments;

- next action list.

Creator dashboard should answer:

> What is happening with my courses, and what should I improve next?

## **15.2 DEC Admin Dashboard**

DEC Admins should see platform-wide workflow and performance.

Recommended widgets:

- total courses by workflow state;

- courses pending review;

- courses approved for publish;

- published courses;

- archived courses;

- users by role;

- learner enrollments;

- certificates issued;

- proof submissions;

- verified achievements;

- safety/accessibility flags;

- course improvement backlog;

- capacity area coverage.

Admin dashboard should answer:

> Is the platform operating smoothly, safely, and according to workflow rules?

## **15.3 DEC Capacity / M&E Dashboard**

DEC capacity and M&E leads need evidence by capacity area, indicator, organization, and course version.

Recommended widgets:

- courses by capacity area;

- learners reached by capacity area;

- certificates by capacity area;

- verified achievements by capacity area;

- organizations reached;

- indicator/standard coverage;

- capacity gaps with no course yet;

- high-demand capacity areas;

- low-performance courses;

- proof acceptance patterns;

- learner feedback themes;

- adaptive action log.

M&E dashboard should answer:

> What evidence do we have about CSO capacity learning and applied progress?

## **15.4 Reviewer Dashboard**

Reviewers should see assigned review work.

Recommended widgets:

- courses awaiting review;

- review track assignments;

- overdue reviews, if enabled;

- unresolved comments;

- courses returned;

- specialist review requests;

- final test review flags;

- proof setup review flags;

- accessibility/safeguarding issues.

Reviewer dashboard should answer:

> What needs my review, what is blocking approval, and what decisions are pending?

## **15.5 Proof Verifier Dashboard**

Proof verifiers should see proof review work.

Recommended widgets:

- proof submissions awaiting review;

- submissions under review;

- revision requested;

- unsafe/redaction required;

- accepted proof;

- rejected proof;

- average review time;

- proof by capacity area;

- proof by organization;

- common proof weaknesses.

Verifier dashboard should answer:

> Which practical evidence submissions need review, and what decisions are pending?

## **15.6 Learner Dashboard**

Learners should see their own learning progress.

Recommended widgets:

- enrolled courses;

- in-progress courses;

- completed courses;

- final test status;

- certificates earned;

- proof submissions;

- proof review status;

- verified achievements/badges;

- recommended next courses;

- feedback requests.

Learner dashboard should answer:

> What have I completed, what certificate did I earn, and what can I do next?

## **15.7 Organization Admin Dashboard**

Organization admins should see safe summaries for their CSO.

Recommended widgets:

- staff enrolled;

- staff completing courses;

- certificates earned;

- capacity areas covered;

- verified achievements;

- proof submissions by status;

- recommended next capacity areas;

- learner feedback summary;

- donor-safe achievement visibility settings, if enabled.

Organization dashboard should answer:

> What learning and verified achievements are emerging across our organization?

## **15.8 Donor-Safe Summary Dashboard, Future / Optional**

If enabled later, donor-facing dashboards should show only safe, consent-based summaries.

Possible widgets:

- participating CSOs, if consented;

- capacity areas addressed;

- certificates issued, aggregated;

- verified achievements awarded;

- indicators supported;

- anonymized feedback themes;

- safe organization achievement summaries.

Donor dashboard must not show:

- raw proof;

- learner test scores;

- private learner data;

- internal reviewer notes;

- sensitive CSO weaknesses;

- safeguarding/protection data;

- politically sensitive details.

# **16. Dashboard Filters**

Dashboards should support practical filters.

Recommended filters:

- date range;

- course;

- course version;

- capacity area;

- sub-capacity;

- indicator/standard;

- target learner group;

- organization;

- learner group/role;

- workflow state;

- certificate status;

- proof status;

- verified achievement status;

- review status;

- publication status;

- language;

- pilot/full release;

- risk/safeguarding flag;

- accessibility flag.

Phase 1 can start with a smaller set, but capacity area, course version, course, organization, and date range are highly important.

# **17. Dashboard Data Refresh and Timing**

The platform should clarify when dashboard data updates.

Recommended behavior:

| **Data event**             | **Dashboard update**                          |
|----------------------------|-----------------------------------------------|
| Learner enrolls            | Enrollment count updates                      |
| Learner starts course      | Start count updates                           |
| Learner completes lesson   | Progress updates                              |
| Learner submits final test | Attempt and score update                      |
| Learner scores 80%+        | Certificate count updates                     |
| Learner submits proof      | Proof submission count updates                |
| Verifier accepts proof     | Verified achievement count updates            |
| Learner submits feedback   | Feedback dashboard updates                    |
| Course published           | Monitoring activates                          |
| Course archived            | New enrollment stops; historical data remains |

Data does not need real-time streaming in Phase 1. However, it should be reliable and refreshed consistently.

# **18. Monitoring Events Specification**

Codex may implement analytics using event logs, relational records, or both. The product behavior should support the following monitoring events.

| **Event**                    | **Trigger**                     |
|------------------------------|---------------------------------|
| course_published             | Course published                |
| learner_enrolled             | Learner enrolled/assigned       |
| course_started               | Learner opens course            |
| lesson_started               | Learner starts lesson           |
| lesson_completed             | Learner completes lesson        |
| block_completed              | Learner completes block         |
| resource_downloaded          | Learner downloads resource      |
| practice_attempted           | Learner attempts practice       |
| final_test_started           | Learner starts final test       |
| final_test_submitted         | Learner submits final test      |
| certificate_issued           | Learner scores 80%+             |
| proof_started                | Learner begins proof draft      |
| proof_submitted              | Learner submits proof           |
| proof_revision_requested     | Verifier requests revision      |
| proof_accepted               | Verifier accepts proof          |
| proof_rejected               | Verifier rejects proof          |
| proof_marked_unsafe          | Verifier flags unsafe data      |
| verified_achievement_awarded | Badge/achievement issued        |
| learner_feedback_submitted   | Learner submits feedback        |
| improvement_issue_created    | Course improvement issue opened |
| course_revision_created      | Revision draft created          |
| course_archived              | Course archived                 |

Each event should include course ID, course version ID, learner ID where relevant, organization ID where relevant, timestamp, and event-specific metadata.

# **19. Version-Aware Monitoring**

Monitoring must be version-aware.

Rules:

- learner progress links to the course version the learner accessed;

- final test attempts link to the test version;

- certificates link to the course version and test attempt;

- proof submissions link to the course version and proof configuration version;

- feedback links to the course version;

- dashboard can show current version or all versions;

- course revisions do not overwrite historical learner records.

Example:

| **Scenario**                    | **Correct behavior**                     |
|---------------------------------|------------------------------------------|
| Learner completes Version 1     | Certificate links to Version 1           |
| Course revised to Version 2     | New learners complete Version 2          |
| Final test changed in Version 2 | V1 and V2 scores are reported separately |
| Proof criteria changed          | Proof records link to the version used   |

This protects evidence integrity.

# **20. Data Safety and Role-Based Visibility**

Monitoring dashboards must follow data safety rules.

| **Data**                    | **Visibility**                                                 |
|-----------------------------|----------------------------------------------------------------|
| Aggregated course metrics   | Creator, DEC Admin, M&E, relevant reviewers                    |
| Individual learner progress | Learner, DEC Admin, organization summary where allowed         |
| Final test scores           | Learner and authorized staff; aggregate for others             |
| Certificate counts          | Aggregated and safe                                            |
| Raw proof                   | Restricted to learner, assigned verifier, authorized DEC admin |
| Proof status                | Learner, verifier, admin, organization summary where allowed   |
| Verified achievement        | Learner, DEC, organization summary; donor-safe if consented    |
| Reviewer notes              | Creator/reviewer/admin only                                    |
| Donor-safe summaries        | Consent-based, summary-only                                    |
| Sensitive/safeguarding data | Avoid collection; specialist-restricted if unavoidable         |

Dashboard design should avoid accidental exposure of sensitive information.

# **21. Monitoring Interpretation Rules**

The platform should guide users to interpret evidence responsibly.

## **21.1 Certificate interpretation**

A certificate means:

> The learner completed the course and scored 80% or above on the final test.

It does not mean:

> The learner or organization has fully applied the capacity in the field.

## **21.2 Practical proof interpretation**

Proof submitted means:

> The learner or CSO attempted to provide evidence of application.

It does not mean proof was accepted.

## **21.3 Verified achievement interpretation**

Verified achievement means:

> Submitted proof was reviewed and accepted for a specific applied task or capacity indicator.

It does not mean:

> The CSO is fully transformed or fully donor-ready.

## **21.4 Mixed K/S/M/E interpretation**

For Mixed diagnosis courses:

> Monitoring reflects learning progress on the approved Knowledge/Skill component only. It should not claim that Motivation or Environment barriers have been solved.

# **22. Dashboard Copy and Labels**

Dashboard labels should be clear and avoid overclaiming.

Recommended labels:

| **Use**                       | **Avoid**                     |
|-------------------------------|-------------------------------|
| Certificates issued           | Certified CSOs                |
| Verified achievements awarded | Fully competent organizations |
| Capacity areas covered        | Capacity achieved             |
| Practical proof accepted      | Transformation completed      |
| Course pass rate              | Organizational readiness      |
| Learner feedback              | Impact evidence               |
| Improvement signals           | Failure ranking               |
| Organization evidence summary | Donor-ready score             |

Suggested dashboard note:

> Certificates show course completion and final test success. Verified achievements show reviewed practical proof for specific applied tasks. Neither should be interpreted as full organizational certification unless DEC creates a separate certification framework.

# **23. Data Quality Rules**

Monitoring data should be reliable enough for decision-making.

Recommended data quality checks:

| **Data quality check**                                 | **Purpose**                           |
|--------------------------------------------------------|---------------------------------------|
| Course has version ID                                  | Prevents mixed-version reporting      |
| Certificate has final test attempt ID                  | Validates certificate eligibility     |
| Certificate threshold stored as 80%                    | Confirms binding rule                 |
| Proof submission has status                            | Prevents ambiguous proof records      |
| Verified achievement links to proof                    | Confirms evidence basis               |
| Dashboard excludes deleted/invalid attempts            | Prevents inflated metrics             |
| Learner organization is current or historically stored | Supports org-level reporting          |
| Course capacity area is required                       | Supports taxonomy aggregation         |
| Feedback links to course version                       | Supports version-specific improvement |
| Archived course data preserved                         | Maintains historical integrity        |

# **24. Reporting Outputs**

Phase 1 may support simple reporting exports or summaries.

Recommended reports:

| **Report**                    | **Use**                                 |
|-------------------------------|-----------------------------------------|
| Course performance summary    | Review course usage and outcomes        |
| Capacity area coverage report | Show which capacity areas are supported |
| Certificate report            | Track certificates issued at 80%+       |
| Practical proof report        | Track proof submissions and decisions   |
| Verified achievement report   | Track badges/achievements               |
| Organization summary report   | Safe CSO-level learning evidence        |
| Course improvement report     | Open issues and revision actions        |
| Donor-safe summary, future    | Consent-based evidence sharing          |

Reports should respect role permissions and data safety.

# **25. Minimum Phase 1 Requirements**

For Phase 1, Codex should minimally implement or align:

1.  Enrollment tracking.

2.  Course progress tracking.

3.  Final test attempt tracking.

4.  Certificate issuance tracking at 80%+.

5.  Certificate records linked to course version.

6.  Practical proof status tracking where enabled.

7.  Verified achievement/badge tracking where enabled.

8.  Learner feedback collection.

9.  Course-level dashboard.

10. Admin dashboard or summary view.

11. Capacity area aggregation.

12. Organization-level safe summary where enabled.

13. Version-aware reporting.

14. Course Improvement Log or basic improvement issue tracking.

15. Role-based visibility for monitoring data.

16. Clear distinction between certificate, proof submitted, and verified achievement.

# **26. Future Enhancements**

Future versions may add:

- advanced analytics dashboards;

- predictive drop-off alerts;

- automated course improvement recommendations;

- advanced question-level analytics;

- cohort comparison;

- organization maturity scoring;

- donor-facing evidence portal;

- consent management dashboard;

- public/private achievement profiles;

- integration with external M&E systems;

- Power BI or external dashboard exports;

- automated narrative reporting;

- longitudinal capacity tracking;

- AI-assisted feedback synthesis;

- AI-assisted dashboard insights;

- advanced data quality monitoring.

These should not delay the Phase 1 requirement to capture reliable, version-aware course, certificate, proof, achievement, and feedback data.

# **27. Implementation Guidance for Codex**

Codex should implement monitoring incrementally and safely.

## **27.1 Required implementation behavior**

Codex should:

- inspect existing analytics/progress/certificate structures before changing them;

- preserve existing working tracking where possible;

- ensure certificate metrics use 80%+;

- ensure proof and badge metrics are separate from certificate metrics;

- ensure dashboards link metrics to course version;

- expose capacity area in course and dashboard records;

- implement role-aware visibility;

- avoid exposing raw proof in dashboards;

- create or align basic Course Improvement Log;

- provide tests or manual verification steps for dashboard data flow.

## **27.2 What Codex should not do**

Codex should not:

- count badges as certificates;

- count proof submissions as verified achievements;

- use 90% certificate threshold;

- expose raw proof to donors;

- create public CSO ranking;

- claim organizational transformation from course completion;

- overwrite historical course version data;

- build advanced donor dashboards before consent and safety rules;

- implement complex maturity scoring in Phase 1.

## **27.3 Acceptance criteria examples**

Given a learner enrolls in a published course,

when the learner starts the course,

then the course dashboard updates started learner count for that course version.

Given a learner scores exactly 80% on the final test,

when the attempt is saved,

then a Certificate Record is created and the certificate count increases for that course version and capacity area.

Given a learner submits practical proof,

when the submission is saved,

then the proof submission count increases but the verified achievement count does not increase until a verifier accepts the proof.

Given a verifier accepts practical proof,

when the decision is saved,

then a Verified Achievement Record is created and dashboard metrics update separately from certificate metrics.

Given a course is revised from Version 1 to Version 2,

when dashboards show certificate counts,

then learners who completed Version 1 remain counted under Version 1 unless the dashboard intentionally aggregates all versions.

Given a donor-facing user opens a summary dashboard,

when donor visibility is enabled,

then the user sees only consent-based safe summaries and cannot access raw proof, learner test scores, or reviewer notes.

# **28. Recommended Repo Placement**

This annex should be saved as:

docs/specs/core-workflow/ANNEX_11_MONITORING_EVALUATION_AND_DASHBOARD_DATA_SPECIFICATION.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_11_MONITORING_EVALUATION_AND_DASHBOARD_DATA_SPECIFICATION.md

Defines monitoring records, dashboard metrics, learner progress tracking, final test and certificate analytics, proof and verified achievement metrics, course improvement logs, organization summaries, version-aware reporting, and Codex acceptance criteria.

# **29. Success Standard for This Annex**

This annex is successful when:

> Codex and developers can implement monitoring and dashboards that show learner progress, final test performance, certificates at 80%+, practical proof status, verified achievements, feedback, capacity-area coverage, organization-level summaries, and course improvement signals while preserving version integrity and data safety.

In practical terms, this annex should prevent:

> “The dashboard shows course completions but cannot explain which capacity area was supported, which version learners completed, whether certificates were issued at 80%, or whether practical proof was actually verified.”

And ensure:

> “DEC can see course usage, learner achievement, certificates, practical proof, verified achievements, feedback, capacity evidence, and improvement priorities by course, version, organization, and capacity area.”

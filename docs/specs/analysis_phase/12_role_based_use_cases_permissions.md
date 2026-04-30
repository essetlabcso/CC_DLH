# Output 12 — Role-Based Use Cases and Permissions for the Analysis Phase

## **1. Purpose of this role and permission specification**

This specification defines who can create, edit, review, approve, view,
lock, reuse, and monitor Analysis Phase data inside the DEC Learning
Hub.

The Analysis Phase handles validated CSO capacity evidence, K/S/M/E
diagnosis, safeguards notes, course-fit decisions, dashboard views, and
Analysis-to-Design Handover records. These records directly influence
course creation, so role boundaries must be clear.

The core rule is:

**Analysis data must be role-aware, assignment-aware, and safety-aware.
A user should only see and act on Analysis Records appropriate to their
role, responsibility, and visibility permission.**

Annex 2 defines the wider DEC role-separation principle: creation,
review, publication, learning, proof verification, and monitoring must
be role-aware, and each user should only see and perform actions
appropriate to their role and assignment.

## **2. Main user groups in the Analysis Phase**

The Analysis Phase has three broad user groups.

| **User group**                     | **Main responsibility**                                                                                                                                   |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Analysis data-entry users**      | Enter final validated and synthesized Analysis Records after fieldwork, triangulation, validation, and safeguards review.                                 |
| **Dashboard users**                | Explore native Analysis Dashboard views to understand capacity patterns, K/S/M/E routes, course-fit, evidence strength, safeguards, and Design readiness. |
| **Course creation workflow users** | Use approved and locked Analysis Records as read-only Design inputs, review alignment, and preserve traceability across later workflow stages.            |

The refined prompt requires these groups to be clearly distinguished:
analysis data-entry users, dashboard users, and course creation workflow
users.

## **3. Core Analysis Phase roles**

| **Role**                                   | **Primary Analysis Phase responsibility**                                                                                          |
|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Analysis Data Entry User**               | Enters final synthesized Analysis Records into the platform.                                                                       |
| **Consortium Lead / Analysis Lead**        | Coordinates field evidence, validation, and synthesis before platform entry.                                                       |
| **DEC Capacity / M&E Lead**                | Reviews evidence quality, taxonomy alignment, K/S/M/E diagnosis, course-fit, dashboard patterns, and monitoring anchors.           |
| **DEC Admin**                              | Manages permissions, approves/locks records where authorized, controls workflow, visibility, and dashboard governance.             |
| **Course Creator / Subject Matter Expert** | Selects approved Analysis Records for Design and uses read-only Analysis anchors.                                                  |
| **Instructional Design Reviewer**          | Later checks whether Design and course build remain aligned to the approved Analysis evidence.                                     |
| **Subject Matter Reviewer**                | Checks technical accuracy and relevance against the approved Analysis Record.                                                      |
| **Safeguarding / Civic-Space Reviewer**    | Reviews sensitive Analysis Records, risk flags, no-harm notes, and visibility restrictions.                                        |
| **Accessibility / Localization Reviewer**  | Reviews whether learner constraints, language, accessibility, and low-bandwidth considerations are properly carried forward.       |
| **Authorized Publisher**                   | Does not normally act in Analysis, but later confirms that published course metadata remains linked to approved Analysis evidence. |
| **Organization Admin**                     | Future or limited role: may see safe organization-level summaries only where enabled and consented.                                |
| **Donor / Partner Viewer**                 | Not part of Phase 1 Analysis Dashboard by default; future role only for consent-based safe summaries.                              |

## **4. Role definitions and boundaries**

### **4.1 Analysis Data Entry User**

**Purpose:** Enter the final validated Analysis Record into the
platform.

| **May do**                                                              | **Should not do**                                                |
|-------------------------------------------------------------------------|------------------------------------------------------------------|
| Create draft Analysis Records.                                          | Enter raw interview transcripts or unsafe field notes.           |
| Enter final synthesized findings.                                       | Approve or lock their own record by default.                     |
| Select evidence source types and summarize evidence.                    | Override K/S/M/E or course-fit rules without approval.           |
| Complete K/S/M/E, course-fit, safeguards, and evaluation anchor fields. | Make sensitive records visible in the dashboard without review.  |
| Submit records for review.                                              | Create Analysis-to-Design Handover unless separately authorized. |
| Revise returned records.                                                | Publish courses or approve Design.                               |

### **4.2 Consortium Lead / Analysis Lead**

**Purpose:** Coordinate field analysis and ensure submitted records
reflect validated evidence.

| **May do**                                     | **Should not do**                                                           |
|------------------------------------------------|-----------------------------------------------------------------------------|
| Coordinate use of field tools.                 | Treat self-assessment alone as enough evidence for high-confidence records. |
| Review synthesis before platform entry.        | Force every identified issue into a course pipeline.                        |
| Submit or co-submit Analysis Records.          | Bypass safeguards review for sensitive records.                             |
| View assigned records and dashboard summaries. | View unrelated CSO-sensitive records without authorization.                 |
| Respond to reviewer comments.                  | Lock records unless explicitly assigned that permission.                    |

### **4.3 DEC Capacity / M&E Lead**

**Purpose:** Ensure the Analysis Record is valid, capacity-aligned,
dashboard-ready, and monitoring-ready.

| **May do**                                                     | **Should not do**                                                                     |
|----------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Review capacity area and sub-capacity mapping.                 | Approve weak records without evidence note.                                           |
| Review evidence strength, validation, and confidence.          | Treat low-confidence records as ready for Design.                                     |
| Check K/S/M/E diagnosis and course-fit logic.                  | Convert Motivation/Environment barriers into courses without separable K/S component. |
| Review evaluation anchors and monitoring signals.              | Overclaim what future certificates or dashboards can prove.                           |
| Recommend approval, revision, blocking, or handover readiness. | Expose sensitive CSO records beyond role-based visibility.                            |
| Use native dashboard for capacity pattern analysis.            | Use dashboard comparisons as rankings or surveillance.                                |

### **4.4 DEC Admin**

**Purpose:** Manage Analysis workflow, permissions, approval, locking,
handover actions, and dashboard governance.

| **May do**                                                                  | **Should not do**                                                       |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Manage Analysis user roles and permissions.                                 | Override binding product rules without recorded reason.                 |
| Approve, lock, return, reopen, archive, or assign records where authorized. | Expose raw evidence or sensitive data to unauthorized users.            |
| Create or lock Analysis-to-Design Handovers.                                | Treat admin authority as a substitute for evidence quality.             |
| Manage native dashboard visibility and role access.                         | Enable donor/external visibility without explicit future consent model. |
| Resolve workflow blocks with documented decisions.                          | Bypass specialist safeguards review for high-risk records.              |
| View platform-wide internal dashboard data subject to safety rules.         | Allow unsafe CSO ranking or public comparison.                          |

### **4.5 Course Creator / Subject Matter Expert**

**Purpose:** Use approved Analysis Records as the starting point for
Design.

| **May do**                                                                                                                 | **Should not do**                                                       |
|----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| View approved, locked, Design-ready Analysis Records.                                                                      | Create courses from unapproved or draft Analysis Records.               |
| Select a record to start Design.                                                                                           | Edit locked Analysis fields directly.                                   |
| Use capacity area, gap, baseline, desired practice, K/S/M/E route, safeguards, and evaluation anchor as read-only context. | Broaden the course beyond the approved gap and separable K/S component. |
| See Design warnings for Mixed, Motivation, Environment, safeguards, AI restrictions, and proof safety.                     | Ignore complementary support notes.                                     |
| Request return to Analysis if the record appears wrong.                                                                    | Use sensitive raw evidence in AI prompts or course examples.            |

### **4.6 Reviewers**

Reviewers may be specialized, but in early Phase 1, some roles may be
combined under DEC Admin or DEC Capacity/M&E Lead. The product logic
should still preserve the distinctions.

| **Reviewer type**                               | **Analysis-related focus**                                                                                             |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Instructional Design Reviewer                   | Checks later Design/Build alignment with the approved gap, learner group, performance problem, and action focus.       |
| Subject Matter Reviewer                         | Checks whether the Analysis basis and later course content are technically accurate and contextually relevant.         |
| Capacity Alignment Reviewer / DEC Capacity Lead | Checks taxonomy, K/S/M/E route, course-fit, evidence strength, and Design readiness.                                   |
| Safeguarding / Civic-Space Reviewer             | Checks sensitive evidence, advocacy risk, safeguarding risk, visibility, AI safety, and proof safety.                  |
| Accessibility / Localization Reviewer           | Checks whether learner constraints, language, low-bandwidth, and accessibility considerations are carried into Design. |

Annex 10 confirms that Review should check alignment, safety,
accessibility, assessment, certificate logic, proof pathway, and learner
readiness, and that Review and Publish remain separate stages.

## **5. Permission matrix for Analysis Records**

| **Action / permission**            | **Analysis Entry User** | **Consortium / Analysis Lead** | **DEC Capacity / M&E Lead**   | **DEC Admin**    | **Course Creator**                       | **Reviewer**     | **Safeguards Reviewer**     |
|------------------------------------|-------------------------|--------------------------------|-------------------------------|------------------|------------------------------------------|------------------|-----------------------------|
| Create draft Analysis Record       | Yes                     | Yes                            | Yes                           | Yes              | No by default                            | No by default    | No by default               |
| Edit own draft                     | Yes                     | Yes                            | Yes                           | Yes              | No                                       | No               | No                          |
| Edit submitted record              | Limited / if returned   | Limited / if assigned          | Yes, if assigned              | Yes              | No                                       | No               | No                          |
| Submit for review                  | Yes                     | Yes                            | Yes                           | Yes              | No                                       | No               | No                          |
| View assigned draft                | Yes                     | Yes                            | Yes                           | Yes              | No                                       | If assigned      | If assigned                 |
| View approved safe summary         | Assigned/authorized     | Assigned/authorized            | Yes                           | Yes              | Yes, if Design-ready                     | Yes, if assigned | Yes, if relevant            |
| View full internal record          | Assigned/authorized     | Assigned/authorized            | Yes, if authorized            | Yes              | No, unless safe read-only Design context | If assigned      | If relevant                 |
| View sensitive safeguards detail   | No unless assigned      | No unless assigned             | Restricted                    | Yes / restricted | No                                       | Restricted       | Yes                         |
| Change capacity classification     | Draft/returned only     | Draft/returned only            | Yes if reviewer               | Yes              | No                                       | Recommend only   | No                          |
| Change K/S/M/E diagnosis           | Draft/returned only     | Draft/returned only            | Yes if reviewer               | Yes              | No                                       | Recommend only   | Recommend if safety-related |
| Change course-fit decision         | Draft/returned only     | Draft/returned only            | Yes if reviewer               | Yes              | No                                       | Recommend only   | Recommend if safety-related |
| Change visibility restriction      | No                      | Recommend                      | Recommend                     | Yes              | No                                       | Recommend        | Recommend/require           |
| Request more evidence              | No                      | Yes                            | Yes                           | Yes              | No                                       | Yes              | Yes                         |
| Request specialist review          | No                      | Yes                            | Yes                           | Yes              | No                                       | Yes              | Yes                         |
| Approve Analysis Record            | No                      | No by default                  | Yes if assigned               | Yes              | No                                       | Yes if assigned  | Safety clearance only       |
| Lock Analysis Record               | No                      | No by default                  | If authorized                 | Yes              | No                                       | No               | No                          |
| Reopen locked Analysis Record      | No                      | Request only                   | Request/approve if authorized | Yes              | Request only                             | Request only     | Request only                |
| Archive record                     | No                      | Request only                   | Recommend                     | Yes              | No                                       | Recommend        | Recommend                   |
| Create Analysis-to-Design Handover | No                      | No by default                  | If authorized                 | Yes              | No                                       | No               | No                          |
| Select record for Design           | No                      | No                             | No                            | Yes              | Yes, if approved/ready                   | No               | No                          |

## **6. Permission matrix for the native Analysis Dashboard**

| **Dashboard view / action**      | **DEC Admin** | **DEC Capacity / M&E Lead** | **Analysis Entry User** | **Consortium Lead**  | **Course Creator**              | **Reviewer**          | **Safeguards Reviewer** |
|----------------------------------|---------------|-----------------------------|-------------------------|----------------------|---------------------------------|-----------------------|-------------------------|
| Executive Overview               | Yes           | Yes                         | Limited                 | Limited              | No or limited                   | Limited               | Risk-focused only       |
| Capacity Area Analysis           | Yes           | Yes                         | Assigned/cohort only    | Assigned/cohort only | Design-ready records only       | Assigned/review scope | If relevant             |
| K/S/M/E Diagnosis                | Yes           | Yes                         | Assigned/cohort only    | Assigned/cohort only | Design-ready records only       | Assigned/review scope | If relevant             |
| Course-Fit Pipeline              | Yes           | Yes                         | Assigned/cohort only    | Assigned/cohort only | Ready-for-Design only           | Assigned/review scope | If relevant             |
| CSO/Cohort/Region Comparison     | Yes, if safe  | Yes, if safe                | Assigned/cohort only    | Assigned/cohort only | No                              | No by default         | No by default           |
| Evidence Strength and Validation | Yes           | Yes                         | Assigned records        | Assigned/cohort only | Safe summary only               | Assigned/review scope | If relevant             |
| Safeguards and Risk Flags        | Yes           | Restricted                  | No except assigned      | No except assigned   | No                              | Restricted            | Yes                     |
| Design Readiness                 | Yes           | Yes                         | Assigned/cohort only    | Assigned/cohort only | Yes, approved/ready only        | Assigned/review scope | No by default           |
| Analysis Record Detail           | Yes           | Authorized                  | Assigned                | Assigned             | Safe read-only approved records | Assigned              | Relevant risk records   |
| Create handover from dashboard   | Yes           | If authorized               | No                      | No                   | No                              | No                    | No                      |
| Start Design from dashboard      | Yes           | No                          | No                      | No                   | Yes, if creator assigned        | No                    | No                      |
| Export safe summary              | Yes           | Yes                         | Assigned only           | Assigned only        | Approved Design context only    | Assigned only         | Relevant risk records   |

The Native Dashboard Addendum requires role-sensitive views where
relevant and confirms that the dashboard should support record-detail
views, filters, drill-down style interactions, and direct reuse of
approved Analysis Records in the Course Creator Portal workflow.

## **7. Analysis workflow states by role**

| **Workflow state**         | **Who can move record into this state**                            | **Who can move it out**                        |
|----------------------------|--------------------------------------------------------------------|------------------------------------------------|
| Draft                      | Analysis entry user, consortium lead, DEC lead, DEC admin          | Owner, assigned lead, DEC admin                |
| Submitted for review       | Analysis entry user / analysis lead                                | Reviewer, DEC lead, DEC admin                  |
| Needs revision             | Reviewer, DEC lead, DEC admin                                      | Assigned editor after revision                 |
| Specialist review required | Reviewer, DEC lead, DEC admin                                      | Specialist reviewer / DEC admin                |
| Validated                  | Reviewer, DEC lead, DEC admin                                      | Approver / admin                               |
| Approved                   | DEC lead if authorized, DEC admin, assigned reviewer if configured | DEC admin / authorized approver                |
| Approved and locked        | DEC admin / authorized capacity lead                               | DEC admin through reopen/return path           |
| Handover ready             | System + DEC admin / authorized lead                               | DEC admin / authorized lead                    |
| Handover created           | DEC admin / authorized lead                                        | DEC admin / authorized lead                    |
| Used in Design             | Course creator / DEC admin selects approved handover               | Design workflow owner                          |
| Blocked from Design        | Reviewer, DEC lead, DEC admin                                      | DEC admin / authorized reviewer after revision |
| Archived                   | DEC admin                                                          | DEC admin through reopen                       |

Annex 3 states that each phase should produce a clear record, each gate
should have a clear unlock condition, each course should have a visible
state, and each return path should preserve traceability and reviewer
comments.

## **8. Role-specific user stories**

### **8.1 Analysis Data Entry User**

| **User story**                                                                                                                        | **Acceptance behavior**                                                                          |
|---------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| As an Analysis Data Entry User, I want to enter a validated capacity gap so that the platform can store a structured Analysis Record. | User can create a draft and complete required fields, but cannot approve or lock the record.     |
| As an Analysis Data Entry User, I want to revise a returned record so that I can address reviewer comments.                           | User sees reviewer comments and can edit only records returned or assigned to them.              |
| As an Analysis Data Entry User, I want safeguards prompts so that I do not enter unsafe raw data.                                     | Risk flags trigger warning fields, unsafe-data confirmation, and specialist review requirements. |

### **8.2 DEC Capacity / M&E Lead**

| **User story**                                                                                                                             | **Acceptance behavior**                                                                                           |
|--------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| As a DEC Capacity/M&E Lead, I want to review evidence confidence so that weak records do not move to Design.                               | User can review triangulation, validation, evidence confidence, and limitations.                                  |
| As a DEC Capacity/M&E Lead, I want to check K/S/M/E and course-fit so that training is not used for non-training problems.                 | User can return records where Motivation/Environment gaps lack separable K/S components.                          |
| As a DEC Capacity/M&E Lead, I want to view capacity patterns in the native dashboard so that DEC can prioritize course pipeline decisions. | User can view capacity area, K/S/M/E, course-fit, evidence, and readiness dashboards subject to visibility rules. |

### **8.3 DEC Admin**

| **User story**                                                                                                                  | **Acceptance behavior**                                            |
|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| As a DEC Admin, I want to lock approved Analysis Records so that Design starts from a stable source of truth.                   | User can lock approved records; core fields become read-only.      |
| As a DEC Admin, I want to create Analysis-to-Design Handovers so that course creators can begin Design from validated evidence. | User can create handovers only when readiness conditions are met.  |
| As a DEC Admin, I want to manage visibility so that sensitive CSO data is not exposed.                                          | User can set or enforce visibility restrictions and audit changes. |

### **8.4 Course Creator**

| **User story**                                                                                                                                              | **Acceptance behavior**                                                              |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| As a Course Creator, I want to browse Design-ready Analysis Records so that I can start a course from approved evidence.                                    | User sees only approved, locked, Design-ready records they are allowed to use.       |
| As a Course Creator, I want read-only Analysis context so that I understand the gap, baseline, desired practice, and K/S/M/E route.                         | Design workspace displays locked Analysis fields but does not allow editing.         |
| As a Course Creator, I want warning messages for Mixed, Motivation, Environment, or safeguards issues so that my design stays within the approved boundary. | Design shows warnings and requires return to Analysis for changes to locked anchors. |

### **8.5 Safeguarding / Civic-Space Reviewer**

| **User story**                                                                                                                                       | **Acceptance behavior**                                                                     |
|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| As a Safeguarding/Civic-Space Reviewer, I want to see records flagged for risk so that unsafe records do not move into Design.                       | User has a risk review queue and can clear, return, restrict, or block records.             |
| As a Safeguarding/Civic-Space Reviewer, I want to control visibility recommendations so that dashboard views do not expose sensitive actors or CSOs. | User can recommend anonymization, aggregation, specialist-only restriction, or non-display. |
| As a Safeguarding/Civic-Space Reviewer, I want AI restrictions recorded so that sensitive evidence is not passed into AI authoring.                  | AI-use restriction follows the record into Design/Build.                                    |

### **8.6 Reviewer**

| **User story**                                                                                                                             | **Acceptance behavior**                                                         |
|--------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| As a Reviewer, I want to check whether the future course remains aligned to the Analysis Record so that course quality is evidence-linked. | Reviewer can compare Design/Build outputs against the locked Analysis handover. |
| As a Reviewer, I want to return a course to Analysis if the original diagnosis is wrong so that errors are corrected at the source.        | Reviewer can route back to Analysis with required comments.                     |

## **9. Separation of duties**

To protect quality and accountability, the system should avoid allowing
one person to complete all critical steps without review.

| **Process**                          | **Separation rule**                                                                      |
|--------------------------------------|------------------------------------------------------------------------------------------|
| Data entry vs approval               | The person entering a record should not normally be the only approver.                   |
| Approval vs locking                  | Locking should be done by DEC Admin or authorized capacity lead.                         |
| Course creator vs Analysis editor    | Course creators should not directly edit locked Analysis anchors.                        |
| Safeguards review vs course creation | Sensitive records should be cleared by safeguards/civic-space reviewer before Design.    |
| Review vs Publish                    | Review approval does not publish a course; Publish remains a separate authorized action. |
| AI drafting vs human approval        | AI cannot approve Analysis, change K/S/M/E, create evidence, or authorize handover.      |

Annex 7 states that AI may assist with drafting and improving content
but must not invent evidence, change K/S/M/E routes, override course-fit
decisions, publish courses, verify proof, award badges, or make
donor-visibility decisions.

## **10. Restricted and sensitive record behavior**

| **Sensitivity mode**         | **Who can see**                                     | **Who can act**                                             |
|------------------------------|-----------------------------------------------------|-------------------------------------------------------------|
| Standard                     | Authorized internal users by role                   | Normal workflow roles                                       |
| Restricted                   | DEC Admin, DEC Capacity/M&E Lead, assigned users    | Assigned reviewers/admins                                   |
| Anonymized in dashboard      | Dashboard users see safe masked summary             | Admin/capacity lead controls full access                    |
| Aggregated only              | Contributes to charts but no detail view            | Admin/capacity lead only                                    |
| Specialist review only       | Specialist reviewer, DEC Admin                      | Specialist reviewer clears/returns; admin controls workflow |
| Do not display until cleared | Hidden from dashboard except admin/specialist queue | Specialist/admin only                                       |
| Archived restricted          | Retained but inactive and hidden                    | DEC Admin only                                              |

## **11. Permission logic for Design unlock**

The system should calculate Design unlock based on record state, role,
and safety.

| **Condition**                                               | **Required behavior**                                                                         |
|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| User is Course Creator but record is not approved/locked    | Hide or disable “Start Design.”                                                               |
| Record is approved but handover not created                 | Show “Awaiting handover” to creator; admin/capacity lead can create handover.                 |
| Record has high-risk safeguards pending                     | Disable Design; show “Specialist review required.”                                            |
| Record is Motivation/Environment-only without separable K/S | Disable Design; show “Not course-addressable.”                                                |
| Record is Mixed with separable K/S                          | Allow Design only for recorded K/S component; show warning.                                   |
| Record is used in Design                                    | Show link to existing Design workspace; avoid duplicate course creation unless admin permits. |
| User lacks role/assignment                                  | Hide record or show access denied according to platform pattern.                              |

## **12. Audit trail requirements by role**

Every significant action should be logged.

| **Action**                    | **Logged fields**                                               |
|-------------------------------|-----------------------------------------------------------------|
| Create record                 | user, timestamp, record ID                                      |
| Edit record                   | user, timestamp, field changed, old/new value where appropriate |
| Submit for review             | user, timestamp, status change                                  |
| Assign reviewer               | assigned by, assigned to, timestamp                             |
| Request more evidence         | reviewer, comment, timestamp                                    |
| Request specialist review     | requester, specialist type, reason, timestamp                   |
| Change visibility restriction | user, old/new restriction, reason, timestamp                    |
| Approve record                | approver, timestamp, approval note                              |
| Lock record                   | locker, timestamp, locked version                               |
| Create handover               | user, timestamp, source record version                          |
| Return to Analysis            | user, reason, affected workflow stage                           |
| Reopen locked record          | user, reason, timestamp                                         |
| Admin override                | admin, reason, rule overridden, timestamp                       |
| Archive record                | user, reason, timestamp                                         |

## **13. Minimum Phase 1 role implementation**

If the platform cannot yet implement all specialized roles separately,
Phase 1 may combine some permissions while preserving the product logic.

| **Minimum role**                    | **Can temporarily cover**                                                          |
|-------------------------------------|------------------------------------------------------------------------------------|
| DEC Admin                           | Admin, approver, lock manager, publisher-level governance, dashboard governance    |
| DEC Capacity / M&E Lead             | Capacity reviewer, evidence reviewer, K/S/M/E reviewer, monitoring anchor reviewer |
| Analysis Entry User                 | Data entry and returned-record revision                                            |
| Course Creator                      | View/select approved records and use handover in Design                            |
| Safeguarding / Civic-Space Reviewer | Specialist review for sensitive records; may be assigned ad hoc                    |

Even if some roles are technically combined, the interface, records,
comments, and audit trail should still distinguish **which function**
was performed: data entry, evidence review, safeguards clearance,
approval, lock, handover, or Design selection.

## **14. Implementation guidance for Codex/GPT-5.5**

| **Implementation area**  | **Guidance**                                                                                                                    |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Role checks              | Implement role and assignment checks before showing records, actions, and dashboard views.                                      |
| Record-level permissions | Sensitive records should require record-specific access, not only global role access.                                           |
| Dashboard filters        | Apply visibility restrictions before aggregating or rendering record detail.                                                    |
| Action buttons           | Show, hide, or disable actions based on role, status, and gate readiness.                                                       |
| Read-only anchors        | Course creators can view but not edit locked Analysis fields.                                                                   |
| Specialist workflows     | Risk flags should create specialist review queue or status.                                                                     |
| Audit trail              | Store all state changes and sensitive visibility changes.                                                                       |
| Safe defaults            | Default sensitive/external visibility to restricted, not open.                                                                  |
| Tests                    | Include tests for unauthorized access, restricted records, handover creation, Design unlock, and role-specific dashboard views. |

## **15. Quality Self-Check**

| **Criterion group**           | **Status** | **Evidence / note**                                                                                                               | **Revision needed?** |
|-------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------|----------------------|
| Role clarity                  | Met        | Defines all key roles involved in Analysis, dashboard use, course creation, review, safeguards, and administration.               | No                   |
| Permission detail             | Met        | Includes permission matrices for Analysis Records and native dashboard views/actions.                                             | No                   |
| Separation of duties          | Met        | Distinguishes data entry, review, approval, locking, handover, Design selection, and publication logic.                           | No                   |
| Workflow state permissions    | Met        | Maps workflow states to actors who can move records in and out.                                                                   | No                   |
| Dashboard role sensitivity    | Met        | Specifies which roles can see which dashboard pages and actions.                                                                  | No                   |
| Safeguards visibility         | Met        | Includes restricted, anonymized, aggregated-only, specialist-only, do-not-display, and archived record behavior.                  | No                   |
| Course creator boundary       | Met        | Course creators can select approved records but cannot edit locked Analysis anchors.                                              | No                   |
| K/S/M/E and course-fit gating | Met        | Design unlock permissions depend on approval, lock, safeguards, K/S/M/E, and course-fit status.                                   | No                   |
| Audit trail readiness         | Met        | Lists role-based actions that must be logged for accountability.                                                                  | No                   |
| Phase 1 practicality          | Met        | Provides minimum role implementation where specialized roles may initially be combined.                                           | No                   |
| DEC-specific grounding        | Met        | Uses DEC workflow, Analysis Records, native dashboard, handover, role-action matrix, safeguards, and Course Creator Portal logic. | No                   |
| Implementation readiness      | Met        | Includes Codex guidance for role checks, record permissions, dashboard filters, action buttons, tests, and audit trail.           | No                   |

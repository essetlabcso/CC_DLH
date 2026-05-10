# Learner Access and Enrollment Foundation Specification

## 1. Purpose and Scope

This specification defines the Phase 1 foundation for learner access, enrollment, invitation, participant assignment, and safe learner-facing course availability in the DEC Learning Hub Course Creator/Admin Portal.

The learner access layer is needed because the platform already supports governed course creation, review, publishing, certificates, practical proof, data safety, monitoring, and Admin accountability, but the learner runtime still needs a clear access model before schema and runtime enforcement are expanded. Published courses must not simply become available to every learner in the same organization unless the course access policy allows that.

This specification enables Phase 1 implementation of:

- public learner discovery, registration, and self-enrollment;
- invited learner access for member, program, cohort, and private courses;
- Admin-managed participant assignment;
- organization-linked participant access;
- program and cohort participant access;
- facilitator and cohort lead support;
- safe organization focal-person summaries;
- auditable participant access decisions;
- learner runtime enforcement that preserves certificate, proof, badge, monitoring, and data-safety boundaries.

This specification does not yet implement schema, migrations, route changes, UI changes, invitation delivery, email sending, external authentication, payment, donor portals, advanced LMS scheduling, learner analytics beyond safe aggregate summaries, or raw-proof visibility changes.

## 2. Source-of-Truth Alignment

This document extends the current core workflow specification package under `docs/specs/core-workflow`.

It should be interpreted with:

- `ANNEX_01_SOURCE_OF_TRUTH_AND_OVERRIDE_NOTE.md`;
- `Revised_Developer_Facing_Implementation_Description_DEC_Learning_Hub_Course_Creator_Portal.md`;
- `04_REVIEW_AND_PUBLISH_PHASE.md`;
- `05_MONITORING_AND_EVALUATION_PHASE.md`;
- `06_ADMIN_ROLE_AND_EXPERIENCE_SPECIFICATION.md`;
- `Annex_2_Role_Action_and_Permission_Matrix.md`;
- `Annex_8_Final_Test_and_Certificate_Specification.md`;
- `Annex_9_Practical_Proof_Verified_Achievement_and_Badge_Specification.md`;
- `Annex_11_Monitoring_Evaluation_and_Dashboard_Data_Specification.md`;
- `Annex_12_Data_Safety_Consent_and_Visibility_Rules.md`.

Where this document conflicts with older learner access wording, use this document for the Phase 1 learner access and enrollment foundation unless DEC approves a later override.

The following binding product rules remain unchanged:

- Review and Publish remain separate workflows.
- A course becomes learner-visible only after the relevant published state and access policy allow it.
- The course certificate rule remains final test score of 80 percent or above.
- Practical proof, verified achievements, and badges remain separate from certificates.
- Raw practical proof remains private by default.
- Monitoring remains aggregate by default unless a dedicated safe learner-management page is explicitly designed.

## 3. Current Implementation Snapshot

The current implementation already includes these relevant foundations:

- `User`, `OrganizationMembership`, and `MembershipRoleAssignment` support organization membership and legacy workspace roles.
- `Program`, `ProgramOrganization`, `Cohort`, and `CohortCourse` support program/cohort structures and course linkage.
- `Course` and `CourseSetup` include access metadata such as `accessMode`, `targetLearnerType`, `enrollmentMode`, catalogue visibility flags, program assignment requirement, and cohort assignment requirement.
- `ScopedRoleAssignment` supports scoped roles including `PLATFORM_ADMIN`, `ORG_FOCAL_PERSON`, `FACILITATOR`, `PROGRAM_ME_MANAGER`, and `SAFE_DASHBOARD_VIEWER`.
- Learner runtime routes support course listing, course detail, lesson completion, final test submission, certificates, proof submission, and private achievement display.
- Certificate, proof, badge, data-safety, monitoring, and audit surfaces already exist and should be preserved.

The current implementation does not yet include first-class learner enrollment, learner invitation, program participant, cohort participant, participant assignment, or enrollment event models.

The current learner runtime access behavior is mainly based on active published course versions and matching learner organization. The next implementation phase should replace this with a central learner access decision service.

## 4. Product Language

Phase 1 must separate two ideas that are often blurred:

1. Learner group/access model
2. Intended audience/profile

The learner group/access model determines who may discover, enroll in, be assigned to, and open a course.

The intended audience/profile describes who the course is designed for pedagogically and operationally.

Do not use "mixed" or "both" as user-facing learner type labels. If an existing enum or internal compatibility field contains `BOTH`, it should be treated as a legacy/internal compatibility value and translated into clearer product language in UI and documentation.

Examples:

- Access model: `program-assigned`
- Intended audience/profile: project officers and M&E officers in grassroots CSOs

Access model answers: "Who is allowed into this course?"

Audience/profile answers: "Who is this course designed for?"

## 5. Learner Access Models

### 5.1 Access Model Summary

| Access model | Who can access | Who can enroll or assign | Login required | Invitation required | Admin assignment required | Program/cohort/org linkage required | Catalogue/runtime behavior |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public-open` | Any eligible public learner | Learner self-enrolls | Required to track progress | No | No | No | Visible in public catalogue; available after sign-in/self-enroll |
| `public-registration-required` | Public learners who register | Learner self-registers and self-enrolls | Yes | No | No | No | Visible in public catalogue; prompts registration/sign-in |
| `organization-assigned` | Learners linked to an allowed organization | Admin or organization-authorized flow assigns | Yes | Optional | Usually yes | Organization required | Visible only in member/eligible runtime surfaces |
| `program-assigned` | Learners assigned to a program | Admin or program manager assigns | Yes | Optional | Yes | Program required | Visible only to assigned program participants |
| `cohort-assigned` | Learners assigned to a cohort | Admin, program manager, or cohort lead assigns | Yes | Optional | Yes | Cohort required | Visible only to assigned cohort participants and schedule |
| `invitation-only` | Learners with accepted invitation | Admin or authorized manager invites | Yes | Yes | Not always, depending on invitation scope | Scope depends on invitation | Not public; appears after accepted invitation |
| `private-internal` | Internal DEC/admin-approved learners only | Platform Admin assigns | Yes | Optional | Yes | Usually organization or internal scope | Hidden from public catalogue; available only by assignment |
| `pilot-restricted` | Pilot learners, reviewers, and approved test participants | Platform Admin or pilot owner assigns | Yes | Optional | Yes | Optional pilot scope | Hidden or explicitly labelled as pilot; limited runtime access |

### 5.2 Public Open

Public-open courses are intended for broad public access after publication. They may appear in the public course catalogue.

Rules:

- A learner may discover the course before sign-in.
- Sign-in or registration is required before progress, tests, certificates, or proof can be recorded.
- A self-enrollment record should be created before the learner starts or when the learner first chooses to start.
- Admin assignment is not required.
- Program, cohort, and organization linkage is not required.
- The course must still be published and active.

### 5.3 Public Registration Required

Public-registration-required courses are public-facing but require registration before access.

Rules:

- The course may appear in the public catalogue.
- The learner must register or sign in before entering the course runtime.
- A self-enrollment record should be created before course access.
- Invitation and Admin assignment are not required.
- The learner may be organizationless only if the future auth/account model supports it; otherwise a default public learner organization or equivalent tenant strategy is required.

### 5.4 Organization Assigned

Organization-assigned courses are available to learners connected to a specific CSO, DEC partner, or allowed organization.

Rules:

- The learner must have an active user account and active organization membership.
- The learner must be linked to an allowed organization.
- Admin assignment is normally required unless a future organization-authorized enrollment policy is approved.
- Invitation may be used to create the user/membership and assignment.
- The course should not appear in the public catalogue as open enrollment.
- Organization focal persons may see safe summaries, not raw proof or sensitive learner details.

### 5.5 Program Assigned

Program-assigned courses are part of a program pathway.

Rules:

- The learner must be assigned to the program or hold an accepted program-scoped invitation.
- The course must be linked to the program directly or through a cohort/course relation.
- Admin, program manager, or another authorized role assigns access.
- The course should not be shown as generally available just because it is published.
- Monitoring should support program-level aggregate evidence.

### 5.6 Cohort Assigned

Cohort-assigned courses are delivered to a defined cohort schedule or group.

Rules:

- The learner must be assigned to the cohort or hold an accepted cohort-scoped invitation.
- The course version should be linked through `CohortCourse` or a future equivalent relation.
- Due dates, start dates, and required/optional status may be cohort-specific.
- Facilitators or cohort leads may support safe follow-up.
- Learners outside the cohort should not see the course as available unless they also qualify through another access model.

### 5.7 Invitation Only

Invitation-only courses are accessed through an invitation lifecycle.

Rules:

- The course is not public catalogue content.
- A learner must receive and accept an invitation before runtime access.
- The invitation may create or connect a user, organization membership, program participant, cohort participant, and/or course enrollment.
- The invitation must expire or be revocable.
- Invitation acceptance must produce an auditable access event.

### 5.8 Private Internal

Private-internal courses are for DEC/internal or restricted operational use.

Rules:

- The course is hidden from public catalogues.
- Platform Admin or another explicitly authorized role controls assignment.
- Learners need an active account and assignment.
- Monitoring should not mix private internal courses into public/program summaries unless filtered intentionally.

### 5.9 Pilot Restricted

Pilot-restricted courses support controlled testing before wider release.

Rules:

- Access is limited to assigned pilot learners, reviewers, or named test participants.
- The course may be published in a pilot state or use a published version with restricted access.
- Public catalogue visibility should be disabled unless the UI clearly labels a pilot opportunity and enforces eligibility.
- Pilot status should not imply production readiness for broad learner access.

## 6. Intended Audience and Profile Categories

Audience/profile categories describe the people a course is designed for. They do not grant access by themselves.

Recommended examples:

- CSO leader
- Project officer
- Finance/admin staff
- M&E officer
- Board member
- Facilitator
- Community mobilizer
- Volunteer
- Organization focal person

Future implementation may store these as free text, controlled lookup values, or a `CourseAudienceProfile` relation. The first implementation should preserve existing free-text values while allowing a later move to governed values if needed.

Examples:

- A course with access model `public-registration-required` may target "volunteers and community mobilizers."
- A course with access model `cohort-assigned` may target "project officers and M&E officers."
- A course with access model `organization-assigned` may target "CSO leaders and board members."

## 7. Enrollment and Invitation Lifecycle

### 7.1 Enrollment Statuses

Recommended learner enrollment statuses:

| Status | Meaning |
| --- | --- |
| `INVITED` | Learner has been invited but has not accepted or started enrollment. |
| `ASSIGNED` | Learner has been assigned by Admin or authorized manager but has not started. |
| `ENROLLED` | Learner has accepted access or self-enrolled and can open the course. |
| `STARTED` | Learner has begun course activity, such as opening a lesson or saving progress. |
| `COMPLETED` | Learner has completed the course runtime criteria for the enrollment. |
| `WITHDRAWN` | Learner was removed or withdrew without completion. |
| `EXPIRED` | Access is no longer valid because an invitation, cohort window, or due period expired. |
| `CANCELLED` | Access was cancelled before meaningful learner activity. |
| `SUSPENDED` | Access is temporarily blocked for administrative, safety, or eligibility reasons. |

`COMPLETED` should not be confused with certificate issuance. Certificate issuance remains based on the 80 percent final test rule.

### 7.2 Invitation Lifecycle

Recommended invitation lifecycle:

| State | Meaning |
| --- | --- |
| `created` | Invitation record exists but has not been sent. |
| `sent` | Invitation has been sent or made available to the learner. |
| `pending acceptance` | Invitation is waiting for learner acceptance. |
| `accepted` | Learner accepted and linked to the relevant access records. |
| `expired` | Invitation was not accepted before expiry. |
| `cancelled` | Invitation was cancelled before acceptance. |
| `revoked` | Invitation or accepted access was revoked after issuance. |

Invitation records should be auditable and should avoid storing raw sensitive content in metadata.

## 8. Route-by-Route Access Audit

### 8.1 Public Catalogue

Current behavior:

- Published active course versions are listed broadly.

Needed enforcement:

- Show only courses with public catalogue eligibility.
- Respect `public-open` and `public-registration-required`.
- Hide organization-assigned, program-assigned, cohort-assigned, invitation-only, private-internal, and pilot-restricted courses unless an explicit public pilot policy is later approved.
- The primary action should distinguish "Start learning", "Register to learn", "Sign in", or "Request/invitation required" according to policy.

### 8.2 Public Course Detail

Current behavior:

- A dedicated public course detail route is not the main learner access gate.

Needed enforcement:

- If implemented, public detail pages may show safe catalogue information for public courses.
- Restricted course detail pages must not expose sensitive cohort/program/member-only information.
- Starting the course should route through registration, sign-in, enrollment, or invitation acceptance as required.

### 8.3 `/learn`

Current behavior:

- Shows published active courses for the learner's organization.

Needed enforcement:

- Show courses the learner is enrolled in, assigned to, eligible to self-enroll in, or invited to accept.
- Do not show all published organization courses by default.
- Separate "My learning", "Available to enroll", and "Invitations/assignments" if useful.
- Respect suspended, withdrawn, expired, and cancelled status.

### 8.4 Lesson Pages

Current behavior:

- Lesson access follows the course organization/published check.

Needed enforcement:

- Require an allowed learner access decision before rendering a lesson.
- Create or update enrollment status to `STARTED` when the learner begins real activity.
- Prevent expired, suspended, withdrawn, or cancelled enrollments from continuing unless Admin reactivates access.

### 8.5 Final Test

Current behavior:

- Final test submission records attempts and can issue certificates when the learner passes.

Needed enforcement:

- Require active enrollment/access before test submission.
- Preserve final test score of 80 percent or above as certificate trigger.
- Do not expose final test answer detail to organization focal persons, facilitators, or monitoring dashboards by default.

### 8.6 Certificate

Current behavior:

- Learners can view their own certificates, and Admin certificate registry exists.

Needed enforcement:

- Certificate eligibility must require valid learner course access at the time of attempt.
- Revocation remains separate from enrollment status.
- Certificate registry should display safe certificate metadata, not proof content.

### 8.7 Proof Submission

Current behavior:

- Learners can submit proof privately when practical proof is enabled.

Needed enforcement:

- Require active learner access before proof submission.
- Keep raw proof private by default.
- Keep proof/verified achievement separate from course certificate.
- Ensure redaction and specialist review flags continue to drive data-safety queues.

### 8.8 Admin Participant Overview

Current behavior:

- Admin user, organization, program/cohort, monitoring, certificate, proof/badge, data safety, and audit areas exist.
- A dedicated participant assignment workspace does not yet exist.

Needed enforcement:

- Add a safe Admin participant overview for assignments, invitations, enrollment status, progress summary, certificate status, and safety flags.
- Do not expose raw proof in overview tables.
- All participant access changes must create audit accountability.

### 8.9 Program and Cohort Pages

Current behavior:

- Programs, cohorts, program organizations, and cohort courses are visible in Admin.
- There is no per-learner program/cohort participant assignment model.

Needed enforcement:

- Program pages should show safe aggregate participant status once participant models exist.
- Cohort pages should show assigned participants, required courses, timing, and completion summary.
- Program/cohort assignment should drive learner runtime eligibility.

### 8.10 Organization Focal-Person View

Current behavior:

- Scoped role and safe organization summary permission helpers exist.
- A dedicated focal-person participant summary view is not yet implemented.

Needed enforcement:

- Focal persons may view safe organization-level summaries for their organization.
- They may not see raw proof, sensitive learner submissions, private final test details, or unrelated organizations.
- Any learner-level detail must be limited to operationally necessary status fields approved for Phase 1.

### 8.11 Facilitator or Cohort Lead View

Current behavior:

- Scoped `FACILITATOR` role and cohort oversight permission helper exist.
- A facilitator/cohort lead route is not yet implemented.

Needed enforcement:

- Facilitators may view safe cohort rosters and follow-up indicators for assigned cohorts.
- They may see completion status, due dates, and support needs.
- They may not see raw proof, private learner reflections, or sensitive assessment detail by default.

## 9. Recommended Data Model

This section is a schema recommendation only. Do not implement these models until the implementation package is approved.

### 9.1 `LearnerEnrollment`

Purpose:

- First-class record of a learner's course or course-version access.

Key fields:

- `id`
- `userId`
- `courseId`
- `courseVersionId`
- `organizationId`
- `programId`
- `cohortId`
- `invitationId`
- `source` such as self, admin, invitation, organization, program, cohort, pilot
- `status`
- `assignedById`
- `enrolledAt`
- `startedAt`
- `completedAt`
- `withdrawnAt`
- `expiresAt`
- `dueAt`
- `reason`
- `createdAt`
- `updatedAt`

Relationships:

- User
- Course
- CourseVersion
- Organization
- Program
- Cohort
- LearnerInvitation
- Admin actor or assigning user

Required for Phase 1:

- Yes.

Migration risk:

- Medium. Additive model, but route enforcement changes are behaviorally significant.

### 9.2 `LearnerInvitation`

Purpose:

- Tokenized and auditable invitation into learner access, membership, program, cohort, or course enrollment.

Key fields:

- `id`
- `email`
- `name`
- `organizationId`
- `programId`
- `cohortId`
- `courseId`
- `courseVersionId`
- `invitedById`
- `tokenHash`
- `status`
- `sentAt`
- `acceptedAt`
- `expiresAt`
- `cancelledAt`
- `revokedAt`
- `reason`
- `createdAt`
- `updatedAt`

Relationships:

- Organization
- Program
- Cohort
- Course
- CourseVersion
- Inviting user
- Accepted user
- Enrollment records

Required for Phase 1:

- Yes, if member/program/cohort invitation access is included in the next workstream.

Migration risk:

- Medium. Additive model, but auth and acceptance flows need careful handling.

### 9.3 `ProgramParticipant`

Purpose:

- First-class link between a learner and a program.

Key fields:

- `id`
- `programId`
- `organizationId`
- `userId`
- `status`
- `profileLabel`
- `assignedById`
- `joinedAt`
- `endedAt`
- `reason`
- `createdAt`
- `updatedAt`

Relationships:

- Program
- Organization
- User
- Assigning user
- Learner enrollments

Required for Phase 1:

- Required if program-assigned access is implemented as more than organization membership plus course enrollment.

Migration risk:

- Medium.

### 9.4 `CohortParticipant`

Purpose:

- First-class link between a learner and a cohort.

Key fields:

- `id`
- `cohortId`
- `programId`
- `organizationId`
- `userId`
- `status`
- `profileLabel`
- `assignedById`
- `joinedAt`
- `endedAt`
- `dueAt`
- `reason`
- `createdAt`
- `updatedAt`

Relationships:

- Cohort
- Program
- Organization
- User
- Assigning user
- Learner enrollments

Required for Phase 1:

- Required if cohort-assigned access and facilitator views are implemented.

Migration risk:

- Medium.

### 9.5 `EnrollmentEvent`

Purpose:

- Durable event history for enrollment and invitation lifecycle changes.

Key fields:

- `id`
- `enrollmentId`
- `invitationId`
- `actorUserId`
- `eventType`
- `beforeJson`
- `afterJson`
- `reason`
- `createdAt`

Relationships:

- LearnerEnrollment
- LearnerInvitation
- Actor user

Required for Phase 1:

- Optional if Admin Audit Log is extended to cover participant access changes. Recommended for learner-facing lifecycle history.

Migration risk:

- Low to medium.

### 9.6 Optional `LearnerProfile`

Purpose:

- Store learner-facing profile data separate from access rules.

Key fields:

- `id`
- `userId`
- `preferredName`
- `profileLabel`
- `jobFunction`
- `languagePreference`
- `accessibilityNotes`
- `createdAt`
- `updatedAt`

Required for Phase 1:

- Optional.

Migration risk:

- Low if minimal and non-sensitive. Higher if it starts collecting sensitive demographic data.

### 9.7 Optional `CourseAudienceProfile`

Purpose:

- Govern intended audience/profile descriptors separately from access mode.

Key fields:

- `id`
- `courseVersionId`
- `label`
- `description`
- `sortOrder`

Required for Phase 1:

- Optional. Existing free-text learner group fields can continue until governance requires structured audience profiles.

Migration risk:

- Low.

## 10. Backfill Strategy

When enrollment models are implemented, existing learner activity should be connected to inferred enrollment records without changing historical learning results.

Recommended backfill rules:

- If a learner has `LearnerLessonProgress` for a course version, create or infer an enrollment with status `STARTED` unless the course completion criteria are already met.
- If all required lessons are complete, infer `COMPLETED` for the enrollment, but do not issue a certificate unless the final test rule is satisfied.
- If a learner has a passing final test attempt and certificate, create or infer enrollment status `COMPLETED`.
- If a learner has practical proof submission but no lesson progress, create or infer at least `STARTED` unless the future policy requires manual review.
- If a learner has a revoked certificate, preserve revocation and do not infer current good standing from the certificate alone.
- If a course is linked to a cohort through `CohortCourse`, and the learner can be confidently linked to that cohort through future participant data, connect the inferred enrollment to the cohort. Otherwise leave cohort linkage null and mark the source as legacy/inferred.
- Inferred records should carry a safe audit or migration marker such as `source = legacy_inferred` and should avoid storing raw proof text in event metadata.

Backfill should be idempotent and should never duplicate active enrollment records for the same learner and course version.

## 11. Safety and Privacy Boundaries

### 11.1 Admin

Admins may see:

- user identity and organization membership;
- invitation and assignment status;
- enrollment status;
- safe progress summary;
- certificate status;
- practical proof status and data-safety flags;
- verified achievement visibility status;
- participant access audit history.

Admins should not see raw proof in broad overview tables. Raw proof access, where allowed, must remain a deliberate review/detail action with permission checks.

### 11.2 Learner

Learners may see:

- their own available, invited, assigned, enrolled, and completed learning;
- their own lesson progress;
- their own final test outcome;
- their own certificates;
- their own practical proof submissions;
- their own private verified achievements.

Learners should not see other learners' progress, proof, certificates, or organization summaries.

### 11.3 Organization Focal Person

Organization focal persons may see:

- safe participation summaries for their organization;
- assigned course/cohort participation counts;
- completion aggregates;
- certificate counts;
- safe follow-up status if explicitly approved.

They must not see:

- raw proof;
- sensitive proof text;
- private learner reflections;
- detailed final test answers;
- unrelated organizations;
- donor visibility controls beyond safe summary status.

### 11.4 Facilitator or Cohort Lead

Facilitators may see:

- assigned cohort roster;
- course completion status;
- due dates;
- safe support indicators;
- non-sensitive action needs.

They must not see:

- raw proof by default;
- final test answer detail;
- sensitive data-safety payloads;
- learner data outside their assigned cohort scope.

### 11.5 M&E or Program Manager

M&E and program managers may see:

- program/cohort aggregate evidence;
- enrollment counts;
- start and completion rates;
- certificate counts;
- practical proof and achievement aggregate status;
- capacity-area trends where safe.

They must not see raw proof or learner surveillance-style records by default.

## 12. Acceptance Criteria for Future Implementation

### 12.1 Public Self-Enrollment

- Public catalogue shows only public-eligible courses.
- Public learners can register/sign in and self-enroll in eligible courses.
- Self-enrollment creates an auditable enrollment record.
- Learner runtime access requires an allowed enrollment or eligibility decision.

### 12.2 Invitation-Based Access

- Admin or authorized manager can create scoped invitations.
- Invitations can be accepted, expired, cancelled, or revoked.
- Accepted invitations create or link the correct user, membership, participant, and enrollment records.
- Invited users cannot access restricted learning before acceptance and activation.

### 12.3 Admin Assignment

- Admin can assign learners to courses, programs, cohorts, or organizations according to policy.
- Admin can pause, revoke, withdraw, or expire access with a reason.
- Assignment changes are auditable.
- Admin participant overview avoids raw proof exposure.

### 12.4 Program and Cohort Assignment

- Program participants can access program-assigned courses.
- Cohort participants can access cohort-assigned courses and schedules.
- Cohort required/optional course status is respected.
- Facilitator support views are scoped to assigned cohorts.

### 12.5 Learner Runtime Enforcement

- `/learn`, course detail, lesson pages, final test, certificate, and proof submission use the same access decision service.
- Suspended, withdrawn, expired, and cancelled access blocks new learner activity.
- Existing certificates, proof, and audit records remain historically intact.

### 12.6 Focal-Person and Facilitator Safe Views

- Organization focal persons see only safe organization-scoped summaries.
- Facilitators see only safe cohort-scoped learner support information.
- Neither role sees raw proof or sensitive assessment details by default.

### 12.7 Audit Accountability

- Invitation, assignment, enrollment status changes, revocation, suspension, and reactivation produce audit records.
- Audit payloads use minimal before/after JSON and avoid sensitive content.

## 13. Implementation Package Sequence

### Package 1: Enrollment Foundation

Define and implement the first-class enrollment and invitation model, central learner access decision service, backfill strategy, and tests.

Expected outputs:

- additive schema changes;
- access decision helper;
- route access matrix tests;
- backfill script or migration plan;
- no broad UI yet except where needed for tests.

### Package 2: Public Self-Registration and Self-Enrollment

Implement public catalogue filtering, registration-required flow, self-enroll action, and learner runtime entry for public courses.

### Package 3: Invitation-Based Member Learner Access

Implement tokenized invitations, acceptance, activation, expiry, revocation, and invitation-scoped enrollment.

### Package 4: Admin Participant Overview and Assignment Workspace

Add Admin UI for participant search, invitations, assignments, enrollment status, and safe participant overview.

### Package 5: Program/Cohort Participant Assignment

Add program and cohort participant records, assignment UI, cohort course access enforcement, due dates, and required/optional course behavior.

### Package 6: Organization Focal-Person View

Add safe organization-level summaries for scoped focal persons.

### Package 7: Facilitator/Cohort Lead View

Add safe cohort support view for facilitators and cohort leads.

### Package 8: Learner Runtime Completion Integration

Complete runtime integration across `/learn`, course detail, lessons, final test, certificates, proof, achievements, and learner status messaging.

## 14. Risks and Open Decisions

### 14.1 Schema and Migration Risks

- Enrollment, invitation, program participant, and cohort participant models are additive but central to runtime behavior.
- Existing learner progress, certificates, and proof need careful idempotent backfill.
- Unique constraints must avoid duplicate active enrollment while still preserving historical withdrawals/re-enrollments if that becomes necessary.

### 14.2 Current Permissive Access Risk

The current learner runtime is more permissive than the target model because published courses are largely filtered by organization rather than first-class enrollment or assignment. The next implementation must avoid breaking existing demo/runtime data while tightening access.

### 14.3 Dev Sign-In Limitations

Current dev sign-in is role-based and creates local active users such as learner/admin. It does not model real email-specific invitation acceptance. Invitation implementation will need a dev-safe way to test invited users without weakening production access assumptions.

### 14.4 `BOTH` Legacy/Internal Compatibility

The existing `CourseTargetLearnerType.BOTH` value conflicts with the product decision to avoid "mixed" or "both" as primary learner type labels. Future UI should not expose `BOTH` as a learner type. A later migration may replace this with separate access model and audience/profile structures.

### 14.5 Demo Data Implications

Supplemental demo data may include program, cohort, organization, certificate, proof, achievement, data-safety, and audit examples before enrollment models exist. When enrollment models are added, demo data should be backfilled or re-seeded to include explicit enrollment, invitation, program participant, and cohort participant records.

### 14.6 Open Product Decisions

- Should public learners belong to a default public learner organization, or should Phase 1 support organizationless learner accounts?
- Should program and cohort participation be separate models, or can one generalized participant assignment model cover both?
- Should `EnrollmentEvent` be separate, or should Admin Audit Log carry all participant access events?
- Should organization focal persons see named learner rows, or only aggregate summaries plus a small safe exception list?
- Should facilitators be allowed to mark support follow-up complete, or only view learner status?
- Should cohort due dates block access after expiry or only mark the enrollment overdue?

## 15. Developer Notes for Next Implementation

The first implementation package should introduce a central access decision function before changing route behavior broadly.

Recommended shape:

- Input: learner identity, course, course version, setup, enrollment records, invitation state, organization membership, program/cohort participant records, now.
- Output: allowed/blocked decision, reason code, learner-facing message, allowed actions, and audit-relevant context.

All learner runtime routes should eventually call the same service:

- public catalogue;
- public course detail;
- `/learn`;
- course detail;
- lesson pages;
- final test;
- certificate pages;
- proof submission.

Admin, focal-person, facilitator, and monitoring views should consume safe summary data rather than raw learner proof or sensitive assessment payloads.

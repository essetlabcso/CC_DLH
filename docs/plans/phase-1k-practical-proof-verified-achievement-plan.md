# Phase 1K Practical Proof and Verified Achievement Plan

Status label: Practical proof and verified achievement layer planned.

This is a planning-only step. No product code, database schema, route, or Supabase database command is changed by this plan.

## Product Intent

The DEC Learning Hub needs two clearly separated recognition layers:

1. Course certificate: the learner passes the course Final Test with a score of 80% or above and receives the automated course certificate.
2. Verified achievement or badge: the learner or CSO submits practical proof that the learning was applied in a real capacity context, and an authorized reviewer accepts that proof.

The verified achievement layer is higher-evidence recognition. It supports CSO capacity evidence, donor confidence, organizational reporting, and standards-linked proof of practice. It must not become a hidden condition for course certificate eligibility.

## Controlling Certificate Rule

The approved Phase 1 certificate rule is:

`80%+ Final Test score = course pass and automated course certificate.`

Practical proof is not required for the course certificate. Verified achievements and badges are additional recognition after reviewed evidence.

The refined monitoring specification still contains older wording that separates 80% pass from 90% certificate. For Phase 1 implementation, that older wording is superseded by the approved 80%+ certificate rule.

## Current Repo Status

Already implemented:

- Learner-facing course access and lesson progress.
- Final Test authoring in the Course Creator Studio.
- Learner Final Test scoring.
- Automated certificate availability at 80%+ Final Test score.
- Persisted certificate records, printable learner certificates, public certificate verification, and admin certificate oversight.
- Review monitoring with aggregate Final Test signals.
- Monitoring grouping by capacity area and linked standard.
- Printable monitoring evidence snapshot.

Not yet implemented:

- Practical proof requirement definition.
- Learner practical proof submission.
- Practical proof review queue and decisions.
- Verified achievement or badge issuance.
- Badge registry or revocation/status history.
- Achievement monitoring and evidence snapshot integration.
- Organization-level achievement summary.

## Required Separation

The learner experience should present these as related but different outcomes:

| Outcome | How it is earned | Meaning |
| --- | --- | --- |
| Course certificate | 80%+ Final Test score | The learner met the course assessment rule. |
| Practical proof submitted | Learner or CSO submits application evidence | The learner is trying to show applied practice. |
| Verified achievement / badge | Reviewer accepts practical proof | The application evidence has been checked against a capacity indicator or standard. |
| Organizational recognition | Aggregated verified achievements | A CSO can show stronger capacity evidence across people or programs. |

## Recommended Implementation Sequence

### Phase 1K.1: Proof Requirement Definition in Studio

Product outcome:
Creators can define an optional practical proof pathway for a course, linked to the approved capacity map and action map.

Visible browser result:

- Course Creator Studio shows a practical proof section after the Final Test and before monitoring/revision planning.
- Creator can set proof prompt, accepted evidence type, review criteria, linked capacity area, linked standard, and learner guidance.
- The UI makes clear that proof is optional/additional recognition and not required for the course certificate.

Implementation notes:

- Add a `PracticalProofRequirement` model linked to `CourseVersion`.
- Keep this course-versioned so published courses preserve the proof requirement that existed at publication time.
- Use text and structured fields first; defer file upload.
- Require purpose linkage to `CourseCapacityMap` and `CourseActionMap`.

Acceptance criteria:

- A certificate-ready course can still publish without practical proof if no proof pathway is configured.
- A configured proof requirement must include capacity link, prompt, criteria, and learner guidance.
- The requirement cannot imply proof is needed for certificate eligibility.
- Existing Final Test certificate behavior remains unchanged.

### Phase 1K.2: Learner Practical Proof Submission

Product outcome:
Learners who completed or are completing a course can submit evidence of applying the learning.

Visible browser result:

- Learner course page shows a separate practical proof area when a published course has a proof requirement.
- Learner can submit a narrative and evidence reference.
- Learner certificate messaging remains based only on the Final Test.

Implementation notes:

- Add `PracticalProofSubmission` linked to learner, course version, and proof requirement.
- Initial evidence fields should be narrative text and external/reference notes only.
- File upload/storage should be deferred until privacy, retention, and storage rules are approved.

Acceptance criteria:

- Learner can earn certificate at 80%+ without submitting proof.
- Learner can submit proof after proof requirement is available.
- Learner can see proof status separately from certificate status.
- Learner cannot see other learners' submissions.

### Phase 1K.3: Practical Proof Review Queue

Product outcome:
Authorized staff can review practical proof submissions and make decisions without mixing this with course publishing approval.

Visible browser result:

- Reviewer area has a practical proof queue.
- Reviewer can view proof, linked capacity indicator, criteria, learner/course context, and decision history.
- Reviewer can approve, return for changes, or reject.

Implementation notes:

- Add `PracticalProofReview` or status event records.
- Keep course review/publish workflow separate from proof review.
- A returned proof should remain editable by the learner.

Acceptance criteria:

- Reviewers/admins can review proof; learners cannot access the queue.
- Creator access should be read-only unless explicitly approved later.
- Approving proof does not alter course certificate eligibility.
- Returned proof gives the learner clear next action.

### Phase 1K.4: Verified Achievement and Badge Registry

Product outcome:
Accepted proof can issue a trusted verified achievement or badge linked to a learner or organization and to a DEC capacity indicator or standard.

Visible browser result:

- Learner achievement area lists earned verified achievements.
- Reviewer/admin can see achievement registry and status.
- Public verification can be considered later, but should not be added automatically in this slice.

Implementation notes:

- Add `VerifiedAchievement` linked to accepted proof submission.
- Store capacity area, linked standard, indicator, course version, recipient, issue status, issue date, and optional revocation status.
- Consider a status event table if revocation/history is needed immediately.

Acceptance criteria:

- Achievement is issued only from approved practical proof.
- Achievement is distinct from `LearnerCertificate`.
- Achievement can be monitored by capacity area and linked standard.
- No achievement is issued directly from a Final Test score alone.

### Phase 1K.5: Monitoring and Evidence Snapshot Integration

Product outcome:
Staff can monitor practical proof and verified achievement signals alongside existing course, certificate, and capacity evidence.

Visible browser result:

- Monitoring dashboard shows proof submission count, proof review status, verified achievement count, and capacity grouping.
- Evidence snapshot can include aggregate proof and achievement signals.
- Individual learner proof details remain protected.

Implementation notes:

- Extend existing monitoring helpers rather than creating a parallel dashboard.
- Preserve aggregate-first reporting.
- Keep capacity area and linked standard filters working.

Acceptance criteria:

- Monitoring can show proof and achievement signals without exposing sensitive learner details.
- Snapshot clearly distinguishes certificates from verified achievements.
- Capacity grouping includes achievement evidence where available.

### Phase 1K.6: Admin Controls and Governance

Product outcome:
Admin users can oversee proof and achievement status, correct mistakes, and manage revocation/history where needed.

Visible browser result:

- Admin area shows proof/achievement records and status history.
- Admin can revoke or correct an achievement only with a required note.

Implementation notes:

- Follow the existing certificate status-event pattern if achievement revocation is in scope.
- Keep audit notes required for manual status changes.

Acceptance criteria:

- Admin changes are recorded with actor, note, timestamp, and status.
- Admin controls do not bypass learner certificate rules.
- Revoked achievements are not counted as active verified capacity evidence.

## Likely Files and Routes for Future Implementation

Likely schema files:

- `prisma/schema.prisma`
- A new Prisma migration under `prisma/migrations`

Likely learner routes:

- `src/app/(learner)/learn/courses/[courseId]/page.tsx`
- Future route: `src/app/(learner)/learn/achievements/page.tsx`

Likely Studio routes:

- `src/app/(studio)/studio/courses/[courseId]/build/page.tsx`
- Possible future route: `src/app/(studio)/studio/courses/[courseId]/proof/page.tsx`

Likely review routes:

- Future route: `src/app/(review)/review/proof/page.tsx`
- Future route: `src/app/(review)/review/proof/[submissionId]/page.tsx`
- `src/app/(review)/review/monitoring/page.tsx`
- `src/app/(review)/review/monitoring/snapshot/page.tsx`

Likely admin routes:

- Future route: `src/app/(admin)/admin/achievements/page.tsx`

Likely supporting modules:

- `src/lib/studio/*`
- `src/lib/learner/*`
- `src/lib/review/monitoring.ts`
- New proof and achievement helper modules under `src/lib`

Likely tests:

- Studio proof requirement validation tests.
- Learner proof submission validation tests.
- Reviewer proof decision tests.
- Verified achievement issuance tests.
- Monitoring aggregate tests.
- Role-boundary route tests or smoke checks.

## Role and Permission Rules

- Learner: can view own certificate, own proof submissions, and own verified achievements.
- Creator: can define proof requirements for courses they can manage; should not review proof by default.
- Reviewer: can review proof submissions and issue verified achievements when authorized.
- Admin: can oversee records, status changes, and revocations.
- Public user: can verify certificates through existing public verification; public achievement verification is a later decision.

## UX Rules

- Do not show proof as a requirement for the course certificate.
- Do not label verified achievements as course completion certificates.
- Do not expose internal staff queues to learners.
- Do not show learner proof details in aggregate monitoring reports.
- Use plain learner-facing language: "Apply what you learned", "Submit practical evidence", "Verified achievement".
- Avoid development-process language in the product UI.

## Data Model Recommendation

Proposed future models:

- `PracticalProofRequirement`
  - Course version, capacity area, linked standard, prompt, accepted evidence types, review criteria, learner guidance, status.
- `PracticalProofSubmission`
  - Learner, course version, requirement, narrative, evidence reference, status, submitted date, returned date.
- `PracticalProofReview`
  - Submission, reviewer, decision, notes, criteria outcome, reviewed date.
- `VerifiedAchievement`
  - Submission, learner, organization, course version, capacity area, linked standard, indicator, title, status, issued date, revoked date.
- `VerifiedAchievementStatusEvent`
  - Achievement, actor, event type, note, date.

Recommended first schema slice:

Start with `PracticalProofRequirement` only. This lets the Studio define the proof pathway before adding learner submissions or review decisions.

## Test Plan for the Future Implementation

For each implementation slice:

- `npx prisma validate`
- `npx prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Manual browser review of learner, Studio, review, and admin routes affected
- Protected-route smoke checks
- User-facing wording scan to avoid internal development language

Additional proof-specific tests:

- Certificate remains available at 80%+ Final Test score without proof.
- Proof cannot issue a course certificate.
- Verified achievement cannot be issued without approved proof.
- Proof and achievement signals remain capacity-linked.
- Learners cannot access other learners' proof records.
- Review and publish remain separated from proof review.

## Evidence Pack Required After Implementation

Each implementation run report should include:

- Product summary in plain language.
- Files changed.
- Schema and migration changes.
- Routes affected.
- Before/after workflow behavior.
- Manual reviewer URLs.
- Certificate separation evidence.
- Role and permission checks.
- Test results.
- Known gaps.
- Next smallest safe step.

## Risks and Decisions

Risks:

- If proof is placed too close to certificate messaging, learners may think proof is required for the certificate.
- If file upload is added too early, privacy, storage, and retention risks expand quickly.
- If creators can approve proof by default, the evidence layer may not feel trusted enough for donor or organizational recognition.
- If achievements are publicly verifiable too early, privacy and consent rules may be under-designed.

Recommended decisions:

- Keep the first implementation slice small: Studio proof requirement definition only.
- Defer file upload until storage, privacy, retention, and review rules are approved.
- Use reviewer/admin approval for verified achievements, not automatic issuance.
- Keep certificate verification and achievement verification separate.

## Recommended Next Smallest Safe Step

After approval, implement `Phase 1K.1: Proof Requirement Definition in Studio`.

This will add the course-level proof pathway definition while preserving the current certificate rule, learner certificate experience, review/publish workflow, and monitoring behavior.

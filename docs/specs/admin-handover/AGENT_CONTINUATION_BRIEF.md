# Agent Continuation Brief

## Product Identity

DEC Learning Hub is not a generic LMS. It is a governed CSO capacity-strengthening platform for transforming validated CSO capacity gaps into practical, reviewed, safe, traceable learning.

The platform should help DEC and partners move from evidence-based diagnosis to practical learning, certificates, optional proof, verified achievements, and monitoring evidence without losing governance or data-safety control.

## Core Workflow

```text
Analysis
-> Design
-> Build
-> Review
-> Publish
-> Learner Runtime
-> Certificate
-> Practical Proof
-> Verified Achievement
-> Monitoring
```

## Binding Rules

- 80%+ final test score triggers the course certificate.
- Practical proof is separate from the course certificate.
- Review and Publish remain separate workflows.
- Raw proof is private by default.
- Invitation access must not bypass `LearnerEnrollment`.
- Course runtime access must come from explicit enrollment/participant access records and status.
- Do not hard-delete learning/access history.
- Motivation-only or Environment-only gaps should not drive Phase 1 course production unless a separable Knowledge or Skill component exists.
- Monitoring should stay aggregate by default unless a dedicated safe participant management page is designed.

## Current Admin Status

Admin is a strong Phase 1 governance foundation, but not a complete mature operational Admin system.

Current estimate:

- Overall Admin build: around 60 percent complete.
- Demo-ready Phase 1 Admin: around 70 percent ready.
- Mature production Admin: around 50 to 55 percent complete.

Implemented or mostly implemented:

- Admin Control Center and navigation.
- Users and roles foundation.
- Admin Authority read-only overview.
- Organization management and membership management.
- Reference data management.
- Diagnosis dataset and diagnosis record governance.
- Course workflow oversight.
- Review Queue and Publish Queue.
- Certificate registry and revoke/reactivate.
- Proof/badge safe aggregate overview.
- Data safety queues.
- Monitoring aggregate dashboard.
- Audit log.
- Learner invitation creation, acceptance, cancel, and revoke.

## Current Invitation Lifecycle

- Admin creates one invitation.
- Raw token is generated server-side and shown once.
- Database stores only `tokenHash`.
- Learner opens `/invite/[token]`.
- Acceptance requires the invited signed-in account.
- Course-scoped invitation creates or reuses `LearnerEnrollment`.
- Program/cohort scoped invitation creates or reuses participant records where applicable.
- Program/cohort-only invitation does not unlock course runtime automatically.
- Pending invitations can be `CANCELLED`.
- Accepted invitations can be `REVOKED`.
- Revocation suspends linked active enrollment/participant records where supported.
- Admin cancel/revoke actions require a reason and write `AdminAuditLog`.

## Known Gaps

- No full participant/enrollment Admin overview.
- No direct Admin assignment to course/program/cohort.
- Program/cohort management is mostly read-only.
- Scoped Platform Admin authority management is read-only.
- No organization focal-person safe summary view.
- No facilitator/cohort lead support view.
- No proof verifier assignment workspace.
- Monitoring needs denominators, trends, safe exports, and improvement loop.
- Consent/visibility lifecycle is incomplete.
- No email delivery, bulk invite, resend, or edit workflow for invitations.

## Safest Next Package

Start with:

> Admin Participant Access Overview, read-only first.

Do not add writes in that first package. Build a safe map of invitations, enrollments, program participants, cohort participants, users, organizations, courses, versions, and access statuses. This reduces risk before direct assignment actions are added.

## Required Plan-First Style

Before implementation:

1. Confirm branch, HEAD, `origin/main`, and git status.
2. Read the relevant specs and current files.
3. Produce a short plan.
4. Confirm exact files likely affected.
5. Implement only the approved slice.
6. Do not touch unrelated routes, schema, package files, demo evidence, or seed data.
7. Preserve existing working behavior.

## Required Evidence Pack After Every Implementation

Include:

- Slice name.
- Branch and commit context.
- Product summary.
- Files changed.
- Routes/screens affected.
- Data/schema/migration changes.
- Workflow state/gate changes.
- Role and permission changes.
- Binding rule checks.
- Tests and verification commands.
- Manual verification steps.
- Acceptance criteria results.
- Known gaps.
- Risks or decisions needed.
- Next smallest safe step.

Minimum validation for implementation packages:

```powershell
npm run lint
npm run typecheck
npm test
$env:DATABASE_URL='file:./admin-phase1-demo.db'; npm run build
git diff --check
```


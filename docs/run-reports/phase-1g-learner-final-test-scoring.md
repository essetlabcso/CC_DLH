# Phase 1G Learner Final Test Scoring Run Report

Status label: Learner final test scoring and 80% certificate eligibility implemented and verified.

## Product Summary

Learners can now take the authored course Final Test from the learner course page. The platform records the selected answer, correct answer, score, pass/fail status, and submission time.

The certificate rule is now aligned with the approved DEC rule: a final test score of 80% or above passes the course and makes the automated course certificate available. Practical proof, verified achievements, and badges remain separate and are not certificate conditions.

## Files Changed

- `prisma/schema.prisma`
- `prisma/migrations/20260427050000_learner_final_test_attempts/migration.sql`
- `src/app/(learner)/learn/actions.ts`
- `src/app/(learner)/learn/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/lessons/[lessonId]/page.tsx`
- `src/app/(learner)/learn/certificates/page.tsx`
- `src/lib/learner/certificates.ts`
- `src/lib/learner/certificates.test.ts`
- `src/lib/learner/final-test.ts`
- `src/lib/learner/final-test.test.ts`
- `src/app/globals.css`
- `docs/README.md`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/phase-1g-learner-final-test-scoring.md`

## Schema and Migration Changes

Added `LearnerFinalTestAttempt` to store learner final test submissions:

- learner
- course version
- final test block
- selected answer
- correct answer
- score percentage
- pass/fail
- submitted timestamp

Migration added:

- `20260427050000_learner_final_test_attempts`

## Routes Affected

- `/learn`
- `/learn/courses/:courseId`
- `/learn/courses/:courseId/lessons/:lessonId`
- `/learn/certificates`

## Before and After Workflow Behavior

Before this slice, certificates were based on lesson completion records. Learners could not submit a Final Test score.

After this slice, learner certificate eligibility is based on the Final Test score. A score of 80% or above creates or restores the learner certificate. Scores below 80% are recorded but do not issue a certificate.

## Manual Reviewer URLs

- Learner dashboard: `/learn`
- Learner course page: `/learn/courses/:courseId`
- Learner lesson page: `/learn/courses/:courseId/lessons/:lessonId`
- Learner certificates: `/learn/certificates`
- Public certificate verification: `/verify`

## Checks Run

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260427050000_learner_final_test_attempts`
- `npm run db:generate` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed, 29 files and 108 tests
- `npm run build` passed
- User-facing wording scan passed
- HTTP smoke checks passed for `/`, `/courses`, and protected Studio access

## Known Gaps

- The current Final Test supports one authored multiple-choice item because that is what the current Build Studio authoring slice creates.
- Multi-question scoring, attempt limits, and richer assessment analytics are not implemented yet.
- Practical proof, verified achievements, and badges remain separate and are not certificate conditions.

## Next Smallest Safe Step

Add a small final test results view for staff monitoring so creators/reviewers can see pass rate and learner score signals without exposing individual-sensitive details unnecessarily.

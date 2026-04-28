# Sprint 9 Run Report: Creator Review

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Creator Review after Preview. Creators must complete Preview checks first, then complete a final creator-side quality checklist before the course can move toward formal review submission.

Creator Review checks that the course still follows the learning design spine, sources are ready, accessibility and mobile readiness are acceptable, safeguarding/civic-space risks are checked, learner practice is present, language is clear, and the course is ready for formal review submission.

Completing Creator Review does not publish the course. It moves the course version to `CREATOR_REVIEW`, stores the creator checklist, and records lifecycle evidence. The next step is still needed: controlled Submit for Review into the reviewer workspace.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses shows the course ready for submit after Creator Review |
| `/studio/courses/:courseId/preview` | Preview checks can hand off to Creator Review |
| `/studio/courses/:courseId/creator-review` | Creator-side final quality checklist and ready-for-submit state |
| `/staff` then choose learner, open `/studio/courses/:courseId/creator-review` | Wrong-role access is blocked |

Sample course URL:

- `/studio/courses/cmodv20im001efhmwa1e3fu4h/creator-review`

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/preview/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/creator-review/page.tsx`
- `src/lib/studio/courses.ts`
- `src/lib/studio/preview-checks.ts`
- `src/lib/studio/preview-checks.test.ts`
- `src/lib/studio/creator-review.ts`
- `src/lib/studio/creator-review.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-8-preview-readiness.md`
- `docs/run-reports/sprint-9-creator-review.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 16 test files, 45 tests
- `npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /studio/courses/:courseId/creator-review` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses/:courseId/preview` | 200 |
| Creator session `GET /studio/courses/:courseId/creator-review` | 200 |
| Creator session `GET /studio/courses` | 200 |
| Learner session `GET /studio/courses/:courseId/creator-review` | 307 to `/forbidden?next=...&workspace=studio` |

## Creator Review evidence

Verified through the running app using a creator session:

- Preview completion returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/creator-review?ready=1`.
- Creator Review completion returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/creator-review?completed=1`.
- Course version status changed to `CREATOR_REVIEW`.
- Preview workflow status is `COMPLETE`.
- Creator Review workflow status is `COMPLETE`.
- Creator-side review checklist was stored in `CourseReviewRecord`.
- Decision note saved: `Creator-side quality review complete. Ready for submit-for-review step.`
- Latest lifecycle evidence records Creator Review completion with all checklist areas.

Automated tests also verify:

- Preview checks cannot complete without all required confirmations.
- Creator Review cannot complete without all required quality gates.
- Creator Review checklist evidence serializes with the expected fields.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Submit for Review and the first reviewer queue are now built.
- Reviewer comments, return/approve/publish, learner runtime, certificates, monitoring, revision, and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add reviewer decision controls: reviewer checklist, comments, return for changes, and approval path without publishing directly from the creator workspace.

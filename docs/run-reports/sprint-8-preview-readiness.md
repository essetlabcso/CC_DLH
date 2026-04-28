# Sprint 8 Run Report: Preview Readiness

Status label: Implemented and verified

## Product outcome

Build Studio now has completion checks before Preview opens. A creator must confirm that generated lesson content exists, the blocks still support the intended learner action, the content is mobile and low-bandwidth ready, accessibility risks have been checked, and safety/local realism have been reviewed.

After those checks pass, the course opens in Preview. Preview renders the saved module, lesson, and blocks in a learner-facing shape so creators can inspect the actual learning flow before the next quality gate.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends Build-complete courses to Preview |
| `/studio/courses/:courseId/build` | Completion checks appear after lesson blocks exist |
| `/studio/courses/:courseId/preview` | Preview shows the generated lesson in learner-facing shape |
| `/staff` then choose learner, open `/studio/courses/:courseId/preview` | Wrong-role access is blocked |

Sample course URL:

- `/studio/courses/cmodv20im001efhmwa1e3fu4h/preview`

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/preview/page.tsx`
- `src/app/globals.css`
- `src/lib/studio/build-checks.ts`
- `src/lib/studio/build-checks.test.ts`
- `src/lib/studio/courses.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-7-build-studio.md`
- `docs/run-reports/sprint-8-preview-readiness.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 14 test files, 41 tests
- `npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /studio/courses/:courseId/preview` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses/:courseId/build` | 200 |
| Creator session `GET /studio/courses/:courseId/preview` | 200 |
| Creator session `GET /studio/courses` | 200 |
| Learner session `GET /studio/courses/:courseId/preview` | 307 to `/forbidden?next=...&workspace=studio` |

## Build completion evidence

Verified through the running app using a creator session:

- Build completion returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/preview?ready=1`.
- Build workflow status changed to `COMPLETE`.
- Preview workflow status changed to `NOT_STARTED`.
- Completion evidence was stored in the latest course lifecycle event:
  `Build checks completed: generated lesson content, learner action alignment, mobile and low-bandwidth readiness, accessibility readiness, safety and local realism review.`
- The sample course still has one module, one lesson, and four lesson blocks.

Automated tests also verify:

- Build checks cannot complete without generated content and all readiness confirmations.
- A complete checklist is accepted and summarized for evidence.
- Generated content detection works against the module/lesson/block structure.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Preview is implemented and can hand off to Creator Review, but it does not yet support reviewer submission, comments, or publishing.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.
- Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI generation are not built yet.

## Next smallest safe step

Add Submit for Review: move creator-reviewed courses into controlled `SUBMITTED` state and create the first reviewer queue.

# Sprint 6 Run Report: Storyboard

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Storyboard as the guided step after Action Map. A creator can turn the approved action design into a lesson-level build contract before Build Studio opens.

Storyboard displays Action Map context at the top of the page so the creator does not start from a blank form. The form captures module name, lesson title, lesson purpose, linked learner action, linked capacity goal, lesson rationale, learning mode, learning flow, planned block sequence, planned interaction, knowledge check/output, media requirement, job aid requirement, accessibility note, AI build handoff note, and high-stakes notes.

For courses marked sensitive, the page requires a safety confirmation before saving the Storyboard. This is the first local safety gate for cultural, legal, civic-space, and local realism risks. A fuller reviewer/SME approval workflow remains a later phase.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends Action Map complete courses toward Storyboard |
| `/studio/courses/:courseId/action-map` | Action Map includes a Continue to Storyboard action |
| `/studio/courses/:courseId/storyboard` | Storyboard form with Action Map context and structured lesson handoff fields |
| `/staff` then choose learner, open `/studio/courses/:courseId/storyboard` | Wrong-role access is blocked |

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/action-map/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/storyboard/page.tsx`
- `src/app/globals.css`
- `src/lib/studio/action-map.ts`
- `src/lib/studio/courses.ts`
- `src/lib/studio/storyboard.ts`
- `src/lib/studio/storyboard.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-5-action-map.md`
- `docs/run-reports/sprint-6-storyboard.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 12 test files, 35 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /studio/courses/:courseId/storyboard` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses/:courseId/storyboard` | 200 |
| Creator session `GET /studio/courses` | 200 |
| Learner session `GET /studio/courses/:courseId/storyboard` | 307 to `/forbidden?next=...&workspace=studio` |

## Storyboard save evidence

Verified through the running app using a creator session:

- Storyboard save returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/storyboard?saved=1`.
- Saved lesson title: `Choose the safest reporting pathway`.
- Saved learning mode: `scenario`.
- Storyboard stores the AI build handoff note.
- Storyboard workflow status changed to `COMPLETE`.
- Build workflow status changed to `NOT_STARTED`.
- Sensitive-course safety confirmation set `approvedForBuild` to `true`.

Automated tests also verify:

- Storyboard cannot complete without the required structured lesson fields.
- Sensitive courses require the safety confirmation.
- Storyboard serializes lesson data into the Build Studio handoff format.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Preview, Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI generation are not built yet.
- Sensitive-course approval is captured as a local Storyboard confirmation; a full reviewer/SME approval workflow still needs a later implementation step.

## Next smallest safe step

Preview readiness: add Build Studio content checks so the course can move toward learner-runtime preview safely.

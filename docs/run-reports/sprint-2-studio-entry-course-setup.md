# Sprint 2 Run Report: Studio Entry, My Courses, and Course Setup

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now has a usable entry experience. Authorized creators can open Studio, view their course production workspace, see My Courses, start a new draft course, and complete the first workflow step: Course Setup.

Course Setup now captures the basic course identity, learner group, language, format/time expectation, level, broad capacity area, sensitive/high-stakes flag, certificate intent, and learner reality notes.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio` | Studio home with production overview, recent courses, and workflow spine |
| `/studio/courses` | Creator-owned course production list |
| `/studio/courses/new` | Start course page |
| `/studio/courses/:courseId/setup` | Course Setup form |
| `/creator` | Legacy redirect to `/studio` |

## Files created or changed

- `src/app/(creator)/studio/page.tsx`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/new/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/setup/page.tsx`
- `src/app/globals.css`
- `src/lib/auth/server.ts`
- `src/lib/studio/course-setup.ts`
- `src/lib/studio/course-setup.test.ts`
- `src/lib/studio/course-workflow-records.ts`
- `src/lib/studio/course-workflow-records.test.ts`
- `src/lib/studio/courses.ts`
- `src/lib/studio/courses.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/sprint-2-studio-entry-course-setup.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 8 test files, 23 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| `GET /` | 200 |
| `GET /courses` | 200 |
| `GET /staff` | 200 |
| Anonymous `GET /studio` | 307 to `/staff?next=%2Fstudio&workspace=studio` |
| Anonymous `GET /studio/courses` | 307 to `/staff?next=%2Fstudio%2Fcourses&workspace=studio` |
| Anonymous `GET /studio/courses/new` | 307 to `/staff?next=%2Fstudio%2Fcourses%2Fnew&workspace=studio` |
| `GET /creator` | 307 to `/studio` |
| Creator session `GET /studio` | 200 |
| Creator session `GET /studio/courses` | 200 |
| Creator session `GET /studio/courses/new` | 200 |
| Learner session `GET /learn` | 200 |
| Learner session `GET /studio/courses` | 307 to `/forbidden?next=%2Fstudio%2Fcourses&workspace=studio` |

## Course creation and setup evidence

Verified through the running app using a creator session:

- Start course action returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/setup`.
- Created course version status: `DRAFT`.
- Initial workflow records created: `10`.
- Initial Course Setup status: `NOT_STARTED`.
- Initial Build status: `LOCKED`.

Verified Course Setup save:

- Save action returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/setup?saved=1`.
- Course title saved as `Safeguarding response for local CSOs`.
- Sensitive/high-stakes flag saved as `true`.
- Course Setup status changed to `COMPLETE`.
- Diagnosis status changed to `NOT_STARTED`.
- Build remains `LOCKED`.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Capacity Map, Action Map, Storyboard, Build Studio, Preview, Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI support are not built yet.
- Course Setup currently saves the first required course identity fields; richer guidance and field-level helper panels can be added in later refinement.

## Next smallest safe step

Build Capacity Map: capacity area, subarea, capability focus, linked standard, capacity outcome, diagnosis link, and monitoring relevance.

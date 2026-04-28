# Sprint 4 Run Report: Capacity Map

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Capacity Map as the third guided workflow step. A creator can map a course to a DEC CSO capacity area, subarea, capability focus, linked standard, capacity outcome, diagnosis link, and monitoring relevance.

Capacity Map is only available after a course-fit Diagnosis. This keeps the product from behaving like a generic topic/category selector.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends diagnosis-complete courses toward Capacity Map |
| `/studio/courses/:courseId/diagnosis` | Diagnosis includes a Continue to Capacity Map action |
| `/studio/courses/:courseId/capacity-map` | Capacity Map form with CSO capacity domain, standard, outcome, and monitoring relevance |

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/diagnosis/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/capacity-map/page.tsx`
- `src/lib/studio/capacity-map.ts`
- `src/lib/studio/capacity-map.test.ts`
- `src/lib/studio/courses.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/sprint-3-diagnosis.md`
- `docs/run-reports/sprint-4-capacity-map.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 10 test files, 29 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| `GET /` | 200 |
| Anonymous `GET /studio/courses/:courseId/capacity-map` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses` | 200 |
| Creator session `GET /studio/courses/:courseId/capacity-map` | 200 |
| Learner session `GET /studio/courses/:courseId/capacity-map` | 307 to `/forbidden?next=...&workspace=studio` |

## Capacity Map save evidence

Verified through the running app using a creator session:

- Capacity Map save returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/capacity-map?saved=1`.
- Capacity area saved as `Safeguarding and accountability`.
- Subarea saved as `Incident reporting`.
- Capacity Map workflow status changed to `COMPLETE`.
- Action Map workflow status changed to `NOT_STARTED`.
- Build remains `LOCKED`.

Automated tests also verify:

- Capacity Map cannot complete without required domain, standard, outcome, diagnosis link, and monitoring relevance fields.
- DEC capacity areas are explicit and include examples such as MEAL and Advocacy and civic space.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Storyboard, Build Studio, Preview, Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI support are not built yet.

## Next smallest safe step

Build Storyboard: lesson plan fed from Action Map, lesson purpose, linked learner action, activity/check plan, resource/job-aid need, and AI handoff note.

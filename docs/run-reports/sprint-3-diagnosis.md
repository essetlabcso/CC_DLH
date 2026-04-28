# Sprint 3 Run Report: Diagnosis

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Diagnosis as the second guided workflow step after Course Setup. A creator must record the request, evidence, current and desired reality, affected learner group, evidence source, KSME gap, and course-fit decision.

Diagnosis now prevents a generic topic-only course start. It also supports the Phase 1 rule that course design should pause when the problem is not course-fit or needs stronger evidence.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends setup-complete courses toward Diagnosis |
| `/studio/courses/:courseId/setup` | Course Setup includes a Continue to Diagnosis action |
| `/studio/courses/:courseId/diagnosis` | Diagnosis form with evidence, KSME, course-fit, and alternative intervention fields |

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/setup/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/diagnosis/page.tsx`
- `src/app/globals.css`
- `src/lib/studio/courses.ts`
- `src/lib/studio/diagnosis.ts`
- `src/lib/studio/diagnosis.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/sprint-2-studio-entry-course-setup.md`
- `docs/run-reports/sprint-3-diagnosis.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 9 test files, 26 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| `GET /` | 200 |
| Anonymous `GET /studio/courses` | 307 to `/staff?next=%2Fstudio%2Fcourses&workspace=studio` |
| Anonymous `GET /studio/courses/:courseId/diagnosis` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses` | 200 |
| Creator session `GET /studio/courses/:courseId/diagnosis` | 200 |
| Learner session `GET /studio/courses/:courseId/diagnosis` | 307 to `/forbidden?next=...&workspace=studio` |

## Diagnosis save evidence

Verified through the running app using a creator session:

- Diagnosis save returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/diagnosis?saved=1`.
- KSME gap saved as `skill`.
- Course-fit decision saved as `course-fit`.
- Diagnosis workflow status changed to `COMPLETE`.
- Capacity Map workflow status changed to `NOT_STARTED`.
- Build remains `LOCKED`.

Automated tests also verify:

- Diagnosis cannot complete without evidence and course-fit fields.
- Alternative intervention recommendation is required when the creator chooses another intervention.
- Course-fit Diagnosis opens Capacity Map next.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Action Map, Storyboard, Build Studio, Preview, Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI support are not built yet.
- Diagnosis currently stores one structured evidence source. Richer multi-evidence handling can be added later if needed.

## Next smallest safe step

Build Action Map: capacity goal, observable learner actions, practice scenario, essential information, and DIF triage.

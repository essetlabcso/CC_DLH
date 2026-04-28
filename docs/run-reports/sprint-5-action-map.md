# Sprint 5 Run Report: Action Map

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Action Map as the fourth guided workflow step. A creator can translate the Capacity Map into a capacity goal, individual learner outcome, observable learner action, practice scenario, essential information, and DIF triage.

Action Map rejects vague learning language such as `understand`, `know`, and `be aware` in action-critical fields. This keeps the course design centered on what learners should be able to do.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends capacity-complete courses toward Action Map |
| `/studio/courses/:courseId/capacity-map` | Capacity Map includes a Continue to Action Map action |
| `/studio/courses/:courseId/action-map` | Action Map form with capacity goal, observable action, scenario, essential information, and DIF triage |

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/capacity-map/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/action-map/page.tsx`
- `src/lib/studio/action-map.ts`
- `src/lib/studio/action-map.test.ts`
- `src/lib/studio/courses.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/sprint-4-capacity-map.md`
- `docs/run-reports/sprint-5-action-map.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 11 test files, 32 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| `GET /` | 200 |
| Anonymous `GET /studio/courses/:courseId/action-map` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses` | 200 |
| Creator session `GET /studio/courses/:courseId/action-map` | 200 |
| Learner session `GET /studio/courses/:courseId/action-map` | 307 to `/forbidden?next=...&workspace=studio` |

## Action Map save evidence

Verified through the running app using a creator session:

- Action Map save returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/action-map?saved=1`.
- Capacity goal saved as `Improve safe and timely safeguarding incident response`.
- Observable action saved as `Select the correct safeguarding reporting pathway`.
- DIF recommendation stored as `scenario and coached practice`.
- Action Map workflow status changed to `COMPLETE`.
- Storyboard workflow status changed to `NOT_STARTED`.
- Build remains `LOCKED`.

Automated tests also verify:

- Action Map cannot complete without the four pillars and DIF fields.
- Vague action language is rejected.
- Observable action and DIF records serialize into structured fields.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Build Studio, Preview, Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI support are not built yet.

## Next smallest safe step

Build Studio: use the saved Storyboard to generate governed lesson blocks instead of starting from a blank page.

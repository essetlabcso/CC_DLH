# Sprint 7 Run Report: Build Studio

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now includes Build Studio after Storyboard. A creator can open the Build Studio for a Storyboard-approved course and generate the first real lesson structure from the saved Storyboard.

Build Studio creates data-backed course content:

- one course module from the Storyboard module name;
- one lesson from the Storyboard lesson title;
- governed lesson blocks from the Storyboard learning mode and lesson plan;
- Build workflow status moves to `IN_PROGRESS`;
- Preview remains locked until later Build completion checks are added.

For the current sample course, the Storyboard generated four governed blocks: Callout, Scenario, Knowledge Check, and Callout. This keeps authoring structured and prevents blank-page or arbitrary content creation at this stage.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | My Courses now sends Storyboard-complete courses to Build Studio |
| `/studio/courses/:courseId/storyboard` | Storyboard includes Continue to Build Studio |
| `/studio/courses/:courseId/build` | Build Studio shows Storyboard context and generated lesson blocks |
| `/staff` then choose learner, open `/studio/courses/:courseId/build` | Wrong-role access is blocked |

Sample course URL:

- `/studio/courses/cmodv20im001efhmwa1e3fu4h/build`

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/storyboard/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/app/globals.css`
- `src/lib/studio/build-studio.ts`
- `src/lib/studio/build-studio.test.ts`
- `src/lib/studio/courses.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-6-storyboard.md`
- `docs/run-reports/sprint-7-build-studio.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 13 test files, 38 tests
- `npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

Note: the first sandboxed `npm run test` attempt hit a Windows `spawn EPERM` while Vitest loaded config. The same test suite passed through the approved PowerShell/npm test path.

## Route smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /studio/courses/:courseId/build` | 307 to `/staff?next=...&workspace=studio` |
| Creator session `GET /studio/courses/:courseId/build` | 200 |
| Creator session `GET /studio/courses` | 200 |
| Learner session `GET /studio/courses/:courseId/build` | 307 to `/forbidden?next=...&workspace=studio` |

## Build generation evidence

Verified through the running app using a creator session:

- Build generation returned `303` to `/studio/courses/cmodv20im001efhmwa1e3fu4h/build?generated=1`.
- Created module title: `Safe reporting basics`.
- Created lesson title: `Choose the safest reporting pathway`.
- Created block types: `CALLOUT`, `SCENARIO`, `CHECK`, `CALLOUT`.
- Created block count: `4`.
- First block title: `Why this matters`.
- Build workflow status changed to `IN_PROGRESS`.
- Preview workflow status remains `LOCKED`.
- Preview locked reason: `Complete Build Studio content checks before opening Preview.`

Automated tests also verify:

- Scenario Storyboards generate only governed block types.
- Reflection Storyboards generate a reflection block.
- Build block content can be safely serialized and parsed for display.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Build Studio now generates the initial lesson blocks and can complete readiness checks, but it does not yet support full manual block editing, reorder, or media upload.
- Creator Review, Review/Publishing, Learner Runtime, Certificates, Monitoring, Revision, and AI generation are not built yet.

## Next smallest safe step

Add Creator Review so creators can run a final internal quality gate before submitting the course to reviewers.

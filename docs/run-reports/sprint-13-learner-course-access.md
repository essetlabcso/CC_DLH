# Sprint 13 Run Report: Learner Course Access

Status label: Implemented and verified

## Product outcome

Learners can now move from public course discovery into a protected learner course experience.

The public `/courses` page links published courses to learner sign-in. After sign-in, the learner can open the course overview at `/learn/courses/:courseId`, see the course summary, module outline, first lesson path, and then open the first lesson at `/learn/courses/:courseId/lessons/:lessonId`.

Only published course versions are available to learners. Anonymous users are redirected to sign in, and staff roles that do not have learner access are blocked from learner routes.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/courses` | Public discovery shows the published sample course |
| `/sign-in?next=/learn/courses/cmodv20im001efhmwa1e3fu4h` | Learner sign-in can enter the published course |
| `/learn` | Learner workspace lists available published learning |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h` | Learner course overview, module outline, and first lesson button |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h/lessons/cmodxdphz0011fhjs2bbvob95` | Learner lesson page with published lesson blocks |
| `/staff` then choose reviewer, open `/learn/courses/cmodv20im001efhmwa1e3fu4h` | Wrong-role access is blocked |

Sample published course:

- Course id: `cmodv20im001efhmwa1e3fu4h`
- Version id: `cmodv20im001gfhmwn2nnv68w`
- First lesson id: `cmodxdphz0011fhjs2bbvob95`
- Course title: `Safeguarding response for local CSOs`

## Files created or changed

- `src/app/(learner)/learn/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/lessons/[lessonId]/page.tsx`
- `src/app/(public)/courses/page.tsx`
- `src/app/globals.css`
- `src/lib/learner/course-access.ts`
- `src/lib/learner/course-access.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-12-publishing-gate.md`
- `docs/run-reports/sprint-13-learner-course-access.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 20 test files, 59 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Learner access smoke checks

| Check | Result |
| --- | --- |
| Public `GET /courses` | 200 |
| Public `/courses` includes sample course title | Yes |
| Anonymous `GET /learn/courses/:courseId` | 307 |
| Learner session `GET /learn/courses/:courseId` | 200 |
| Learner course overview includes first lesson title | Yes |
| Learner session `GET /learn/courses/:courseId/lessons/:lessonId` | 200 |
| Learner lesson includes published block content | Yes |
| Reviewer session `GET /learn/courses/:courseId` | 307 |

## Published course evidence

- Course title: `Safeguarding response for local CSOs`
- Status: `PUBLISHED`
- Module count: 1
- Lesson count: 1
- Block count: 4
- First lesson: `Choose the safest reporting pathway`

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Learner progress tracking and completion state were added in Sprint 14.
- Certificates, monitoring dashboards, revision loop, and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add a simple monitoring view for published courses so staff can see learner progress signals without exposing private learner data publicly.

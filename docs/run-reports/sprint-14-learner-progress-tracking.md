# Sprint 14 Run Report: Learner Progress Tracking

Status label: Implemented and verified

## Product outcome

Learner progress is now saved locally for published lessons.

When a learner opens a published lesson, the app records that the lesson has started. The lesson page also gives the learner a clear `Mark lesson complete` action. After completion, the course overview and learner dashboard show completion progress.

Certificates remain separate. This step records lesson progress only; it does not issue certificates or define final completion rules beyond the current lesson count.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/learn` | Learner dashboard shows the published course and progress label |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h` | Course overview shows progress and completed lesson status |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h/lessons/cmodxdphz0011fhjs2bbvob95` | Lesson page records start and has completion action before completion |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h/lessons/cmodxdphz0011fhjs2bbvob95?completed=1` | Completion confirmation after marking the lesson complete |

Sample completed lesson:

- Course id: `cmodv20im001efhmwa1e3fu4h`
- Version id: `cmodv20im001gfhmwn2nnv68w`
- Lesson id: `cmodxdphz0011fhjs2bbvob95`
- Lesson title: `Choose the safest reporting pathway`

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260425110000_learner_progress/migration.sql`
- `src/app/(learner)/learn/actions.ts`
- `src/app/(learner)/learn/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/lessons/[lessonId]/page.tsx`
- `src/lib/learner/progress.ts`
- `src/lib/learner/progress.test.ts`
- `docs/architecture/data-model.md`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-13-learner-course-access.md`
- `docs/run-reports/sprint-14-learner-progress-tracking.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `DATABASE_URL=file:./dev.db npm run db:generate` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 21 test files, 63 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Progress smoke checks

| Check | Result |
| --- | --- |
| Learner session `GET /learn/courses/:courseId/lessons/:lessonId` | 200 |
| Lesson start progress record | Created |
| Completion form submission | 303 to lesson URL with `?completed=1` |
| Lesson completion record | `completedAt` recorded |
| Learner course overview after completion | 200 and shows completion |
| Learner dashboard after completion | 200 and shows completion |

## Saved progress evidence

- Course title: `Safeguarding response for local CSOs`
- Learner: `learner@dec.local`
- Lesson title: `Choose the safest reporting pathway`
- `startedAt`: recorded
- `completedAt`: recorded
- Progress records for the sample course: 1

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Certificates are not built yet.
- The first monitoring view was added in Sprint 15.
- Revision loop and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add the revision loop entry point so staff can move from monitoring signals to a controlled improvement/revision workflow.

# Sprint 11 Run Report: Reviewer Decision Controls

Status label: Implemented and verified

## Product outcome

Reviewers can now make formal decisions on submitted course versions without publishing them.

The submitted version screen now supports:

- reviewer checklist evidence;
- reviewer decision notes;
- return for changes with required comments;
- approval for publishing handoff.

Approval changes the course version to `APPROVED`, records the reviewer, saves checklist evidence, and leaves `publishedAt` empty. Returning a course changes it to `RETURNED` and saves the exact comments the creator needs for revision.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review` | Reviewer workspace summary |
| `/review/queue` | Submitted courses waiting for review |
| `/review/courses/:courseId/versions/:versionId` | Runtime preview plus reviewer decision controls for submitted versions |
| `/review/queue?approved=1` | Approval confirmation after reviewer approval |
| `/review/queue?returned=1` | Return confirmation after reviewer sends comments |
| `/staff` then choose learner, open `/review/queue` | Wrong-role access is blocked |

Sample approved version:

- Course id: `cmodv20im001efhmwa1e3fu4h`
- Version id: `cmodv20im001gfhmwn2nnv68w`

This sample was published in Sprint 12, so it now appears in learner course discovery.

## Files created or changed

- `src/app/(review)/review/actions.ts`
- `src/app/(review)/review/page.tsx`
- `src/app/(review)/review/queue/page.tsx`
- `src/app/(review)/review/courses/[courseId]/versions/[versionId]/page.tsx`
- `src/app/globals.css`
- `src/lib/review/decisions.ts`
- `src/lib/review/decisions.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-10-submit-for-review.md`
- `docs/run-reports/sprint-11-reviewer-decision-controls.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 18 test files, 52 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Reviewer decision smoke checks

| Check | Result |
| --- | --- |
| Reviewer session `GET /review/courses/:courseId/versions/:versionId` before approval | 200 |
| Approval form submission | 303 to `/review/queue?approved=1` |
| Course version status after approval | `APPROVED` |
| `approvedAt` after approval | Recorded |
| `publishedAt` after approval | Empty |
| Reviewer evidence | Reviewer id, checklist, and decision notes recorded |
| Review queue count after approval | 0 submitted courses |
| Reviewer session `GET /review/queue?approved=1` | 200 |
| Reviewer session `GET` approved submitted-version decision URL | 404, because it is no longer submitted |
| Anonymous `GET /review/queue` | 307 |
| Learner session `GET /review/queue` | 307 |

## Saved approval evidence

- Course title: `Safeguarding response for local CSOs`
- Status: `APPROVED`
- Reviewer: `reviewer@dec.local`
- Decision notes: `Reviewer approval complete. Ready for publishing handoff.`
- Latest lifecycle event: `SUBMITTED` to `APPROVED`
- Latest lifecycle note: `Reviewer approval recorded: runtime preview, action alignment, accessibility and mobile readiness, safeguarding and civic-space safety, learner checks and assessment, source and credibility review.`

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Publishing was added in Sprint 12.
- Returned-course revision workflow is not fully built yet.
- Learner runtime, certificates, monitoring, revision, and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add the learner course access route for published courses, so learners can open a published course from discovery and see its first learner-facing course page.

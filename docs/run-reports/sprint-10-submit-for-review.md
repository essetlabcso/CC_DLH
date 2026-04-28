# Sprint 10 Run Report: Submit for Review

Status label: Implemented and verified

## Product outcome

The Course Creator Studio can now submit a creator-reviewed course into formal review. This is a controlled handoff: creators do not publish directly, and reviewers now have a queue of submitted course versions.

The reviewer workspace now includes:

- `/review` with a queue summary;
- `/review/queue` listing submitted course versions;
- `/review/courses/:courseId/versions/:versionId` showing a read-only submitted version with runtime-style content preview.

Reviewers can open the submitted course and inspect the saved module, lesson, and blocks. Reviewer checklist decisions, return comments, and approval were added in Sprint 11. Publishing remains separate.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | Creator sees the course submitted for review |
| `/review` | Reviewer workspace summary shows submitted course count |
| `/review/queue` | Submitted course appears in the review queue |
| `/review/courses/:courseId/versions/:versionId` | Reviewer can inspect the submitted course version |
| `/staff` then choose learner, open `/review/queue` | Wrong-role access is blocked |

Sample submitted version URLs:

- `/review/queue`
- `/review/courses/cmodv20im001efhmwa1e3fu4h/versions/cmodv20im001gfhmwn2nnv68w`

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/creator-review/page.tsx`
- `src/app/(review)/review/page.tsx`
- `src/app/(review)/review/queue/page.tsx`
- `src/app/(review)/review/courses/[courseId]/versions/[versionId]/page.tsx`
- `src/lib/review/queue.ts`
- `src/lib/review/queue.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-9-creator-review.md`
- `docs/run-reports/sprint-10-submit-for-review.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 17 test files, 48 tests
- `npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| Creator submit action | 303 to `/studio/courses?submitted=1` |
| Anonymous `GET /review/queue` | 307 to `/staff?next=...&workspace=review` |
| Reviewer session `GET /review` | 200 |
| Reviewer session `GET /review/queue` | 200 |
| Reviewer session `GET /review/courses/:courseId/versions/:versionId` | 200 |
| Learner session `GET /review/queue` | 307 to `/forbidden?next=...&workspace=review` |
| Creator session `GET /studio/courses?submitted=1` | 200 |

## Submit evidence

Verified through the running app using a creator session:

- Submit for Review returned `303` to `/studio/courses?submitted=1`.
- Course version status changed to `SUBMITTED`.
- `submittedAt` was recorded.
- Review decision note updated to `Submitted for formal review. Awaiting reviewer assignment and decision.`
- Latest lifecycle event records `Course submitted for formal review.`
- Review queue count is `1`.

Automated tests also verify:

- Review queue status labels are product-friendly.
- Queue block counts work across modules and lessons.
- Missing submission dates are displayed clearly.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Reviewer comments, checklist decisions, return for changes, and approval were added in Sprint 11.
- Publishing is not built yet.
- Learner runtime, certificates, monitoring, revision, and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add the publishing gate for approved course versions while keeping publication separate from reviewer approval.

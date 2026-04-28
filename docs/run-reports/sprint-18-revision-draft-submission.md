# Sprint 18 Run Report: Revision Draft Submission

Status label: Implemented and verified

## Product outcome

Creators can now take a revision draft through the final Studio readiness path and submit it back into formal review.

The live published course stays published while the revision version is reviewed. Reviewers can clearly see that the submitted item is a revision version, not a brand-new course submission.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses` | Creator sees submitted revision confirmation and the course status as submitted for review |
| `/review/queue` | Reviewer sees the submitted course labeled as a revision version |
| `/review/courses/cmodv20im001efhmwa1e3fu4h/versions/cmoeumd370008fhi0xuygs249` | Reviewer detail page opens as a submitted revision with runtime preview and decision controls |
| `/courses` | Public learner discovery still shows the live published course |

Sample submitted revision:

- Course title: `Safeguarding response for local CSOs`
- Published version id: `cmodv20im001gfhmwn2nnv68w`
- Submitted revision version id: `cmoeumd370008fhi0xuygs249`
- Submitted revision version number: 2
- Submitted revision source version: `cmodv20im001gfhmwn2nnv68w`
- Current submitted revision status: `SUBMITTED`
- Live published version status: `PUBLISHED`

## Files created or changed

- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/page.tsx`
- `src/app/(review)/review/queue/page.tsx`
- `src/app/(review)/review/courses/[courseId]/versions/[versionId]/page.tsx`
- `src/lib/review/queue.ts`
- `src/lib/review/queue.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-17-revision-draft-creation.md`
- `docs/run-reports/sprint-18-revision-draft-submission.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 23 test files, 70 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Smoke checks

| Check | Result |
| --- | --- |
| Creator Build checks submission | 303 to `/studio/courses/cmodv20im001efhmwa1e3fu4h/preview?ready=1` |
| Creator Preview checks submission | 303 to `/studio/courses/cmodv20im001efhmwa1e3fu4h/creator-review?ready=1` |
| Creator Review checklist submission | 303 to `/studio/courses/cmodv20im001efhmwa1e3fu4h/creator-review?completed=1` |
| Formal revision submission | 303 to `/studio/courses?revisionSubmitted=1` |
| Revision version status after submission | `SUBMITTED` |
| Live published version status after revision submission | `PUBLISHED` |
| Review queue label | Shows `Revision version` |
| Review detail label | Shows `Submitted Revision` and `Version type: Revision version` |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Completed in Sprint 19: reviewer approval and replacement publishing for submitted revision versions.
- Certificates are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Completed in Sprint 19. Next, add certificate eligibility and the learner certificate view after course completion.

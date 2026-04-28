# Sprint 19 Run Report: Revision Approval and Publishing

Status label: Implemented and verified

## Product outcome

Reviewers can now approve a submitted revision version and hand it to the separate publishing gate.

Publishing the approved revision replaces the previous live version only at the publishing step. Learners now see the newly published revision as the current course, while the prior published version is retained as replaced history.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review/publishing?published=1` | Publisher sees the publication confirmation and recently published revision |
| `/courses` | Public learner discovery shows the course from the current published version |
| `/learn` | Signed-in learner sees the same current published course |
| `/review/monitoring` | Staff monitoring now reads the current published version |

Sample published revision:

- Course title: `Safeguarding response for local CSOs`
- Previous published version id: `cmodv20im001gfhmwn2nnv68w`
- Current published revision id: `cmoeumd370008fhi0xuygs249`
- Current published revision number: 2
- Previous version status after publishing: `REPLACED`
- Current revision status after publishing: `PUBLISHED`

## Files created or changed

- `src/app/(review)/review/actions.ts`
- `src/app/(review)/review/publishing/page.tsx`
- `src/lib/review/publishing.ts`
- `src/lib/review/publishing.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-18-revision-draft-submission.md`
- `docs/run-reports/sprint-19-revision-approval-publishing.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 23 test files, 72 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Smoke checks

| Check | Result |
| --- | --- |
| Reviewer approval submission | 303 to `/review/queue?approved=1` |
| Publishing queue after approval | Shows the approved revision as `Revision version` |
| Publishing submission | 303 to `/review/publishing?published=1` |
| Previous version status | `REPLACED` |
| Current revision status | `PUBLISHED` |
| Current revision source version | Previous published version id retained |
| Current revision monitoring record | Created |
| Public course discovery | Shows the course |
| Learner dashboard | Shows the course |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Certificates are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.
- The revision history view is still implicit in staff records; a more explicit version history page can be added later.

## Next smallest safe step

Certificate eligibility and learner certificate view after course completion.

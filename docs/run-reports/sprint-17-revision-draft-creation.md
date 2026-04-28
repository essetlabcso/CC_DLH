# Sprint 17 Run Report: Revision Draft Creation

Status label: Implemented and verified

## Product outcome

Staff can now create a controlled revision draft from a requested revision.

The revision draft is a new course version copied from the live published version. The live published version remains unchanged and visible to learners. The creator sees the new `Revision draft` in Studio and can continue from Build Studio.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review/revisions` | Staff can create a revision draft from the revision request |
| `/review/revisions?draft=created` | Confirmation after draft creation |
| `/studio/courses` | Creator sees the new revision draft and can continue build |
| `/courses` | Public learner discovery still shows the published course |

Sample revision draft:

- Course title: `Safeguarding response for local CSOs`
- Published version id: `cmodv20im001gfhmwn2nnv68w`
- Revision draft id: `cmoeumd370008fhi0xuygs249`
- Revision draft status: `REVISION_DRAFT`
- Revision draft version number: 2

## Files created or changed

- `src/app/(review)/review/actions.ts`
- `src/app/(review)/review/revisions/page.tsx`
- `src/lib/db/lifecycle.ts`
- `src/lib/db/lifecycle.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-16-revision-entry-point.md`
- `docs/run-reports/sprint-17-revision-draft-creation.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 23 test files, 69 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Revision draft smoke checks

| Check | Result |
| --- | --- |
| Reviewer session `GET /review/revisions` | 200 |
| Create revision draft form submission | 303 to `/review/revisions?draft=created&version=...` |
| Published version status after draft creation | `PUBLISHED` |
| New version status | `REVISION_DRAFT` |
| New version number | 2 |
| New draft source version | Published version id |
| Copied content | 1 module, 1 lesson, 4 blocks |
| Draft workflow state | Build in progress, Preview locked |
| Creator session `GET /studio/courses` | 200 and shows `Revision draft` |
| Public `GET /courses` | 200 |

## Saved revision draft evidence

- Revision reason preserved on the new draft.
- Lifecycle event on the draft records `PUBLISHED` to `REVISION_DRAFT`.
- The published version remains live with its published timestamp.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Completed in Sprint 18: the creator can now complete revision Build, Preview, Creator Review, and submit the revision version to formal review.
- Certificates are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Completed in Sprint 18. Next, reviewers can decide the submitted revision and hand it to the separate publishing gate.

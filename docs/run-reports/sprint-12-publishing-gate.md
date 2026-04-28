# Sprint 12 Run Report: Publishing Gate

Status label: Implemented and verified

## Product outcome

The platform now separates reviewer approval from learner publication.

Reviewers can open `/review/publishing`, see approved course versions waiting for publication, and publish an approved version through a separate controlled action. Once published, the course appears on the public learner course discovery page at `/courses`.

This means learners do not see draft, submitted, returned, or merely approved content. They only see content that has passed the publishing gate.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review` | Reviewer workspace shows submitted and approved-for-publishing counts |
| `/review/publishing` | Approved courses waiting for publication, plus recently published courses |
| `/review/publishing?published=1` | Confirmation after a reviewer publishes a course |
| `/courses` | Public learners can see published courses only |
| `/staff` then choose learner, open `/review/publishing` | Wrong-role access is blocked |

Sample published version:

- Course id: `cmodv20im001efhmwa1e3fu4h`
- Version id: `cmodv20im001gfhmwn2nnv68w`
- Course title: `Safeguarding response for local CSOs`

## Files created or changed

- `src/app/(public)/courses/page.tsx`
- `src/app/(review)/review/actions.ts`
- `src/app/(review)/review/page.tsx`
- `src/app/(review)/review/publishing/page.tsx`
- `src/lib/review/publishing.ts`
- `src/lib/review/publishing.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-11-reviewer-decision-controls.md`
- `docs/run-reports/sprint-12-publishing-gate.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 19 test files, 56 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Publishing smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /review/publishing` | 307 |
| Learner session `GET /review/publishing` | 307 |
| Reviewer session `GET /review/publishing` before publication | 200 |
| Publish form submission | 303 to `/review/publishing?published=1` |
| Course version status after publication | `PUBLISHED` |
| `approvedAt` after publication | Still recorded |
| `publishedAt` after publication | Recorded |
| Monitoring record after publication | Created |
| Approved queue count after publication | 0 approved courses |
| Published course count after publication | 1 published course |
| Public `GET /courses` | 200 |
| Public `/courses` includes sample course title | Yes |

## Saved publication evidence

- Course title: `Safeguarding response for local CSOs`
- Status: `PUBLISHED`
- Latest lifecycle event: `APPROVED` to `PUBLISHED`
- Latest lifecycle note: `Published Safeguarding response for local CSOs version 1 for learner discovery.`
- Learner discovery includes the published course title.

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Learner course overview and first lesson access were added in Sprint 13.
- Returned-course revision workflow is not fully built yet.
- Certificates, monitoring dashboards, revision loop, and AI generation are not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add learner progress tracking and completion state for the published lesson path.

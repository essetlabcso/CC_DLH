# Sprint 16 Run Report: Revision Entry Point

Status label: Implemented and verified

## Product outcome

Staff can now move from monitoring signals into a controlled revision request.

From `/review/monitoring`, staff can enter a reason for revision on a published course. The request is saved and appears in `/review/revisions`. Sprint 17 adds controlled revision draft creation from that request.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review/monitoring` | Staff can request a revision for a published course |
| `/review/revisions` | Staff can see requested revisions and reasons |
| `/review/revisions?requested=1` | Confirmation after a revision request |
| `/staff` then choose learner, open `/review/revisions` | Wrong-role access is blocked |

Sample revision request:

- Course title: `Safeguarding response for local CSOs`
- Course status after request: `PUBLISHED`
- Revision reason: `Monitoring suggests learners need clearer examples in the reporting pathway lesson.`

## Files created or changed

- `src/app/(review)/review/actions.ts`
- `src/app/(review)/review/page.tsx`
- `src/app/(review)/review/monitoring/page.tsx`
- `src/app/(review)/review/revisions/page.tsx`
- `src/lib/review/revisions.ts`
- `src/lib/review/revisions.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-15-monitoring-view.md`
- `docs/run-reports/sprint-16-revision-entry-point.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 23 test files, 68 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Revision smoke checks

| Check | Result |
| --- | --- |
| Reviewer session `GET /review/monitoring` | 200 |
| Revision request form submission | 303 to `/review/revisions?requested=1` |
| Reviewer session `GET /review/revisions?requested=1` | 200 |
| Revision queue includes sample course title | Yes |
| Revision queue includes saved reason | Yes |
| Published course status after request | `PUBLISHED` |
| Anonymous `GET /review/revisions` | 307 |
| Learner session `GET /review/revisions` | 307 |
| Reviewer session `GET /review/revisions` | 200 |

## Saved revision evidence

- Course title: `Safeguarding response for local CSOs`
- Course status: `PUBLISHED`
- Published timestamp: still recorded
- Revision reason saved on `CourseRevisionRecord`
- Improvement note saved on `CourseMonitoringRecord`
- Latest lifecycle note records the revision request while keeping status `PUBLISHED`

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Controlled revision draft creation was added in Sprint 17.
- Certificates are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Let the creator complete the revision draft review path and submit the revision draft back into formal review.

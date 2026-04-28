# Sprint 15 Run Report: Monitoring View

Status label: Implemented and verified

## Product outcome

Staff now have a protected monitoring view for published courses.

The new `/review/monitoring` page shows aggregate course-level learning signals after publication, including learners started, learners completed, lesson starts, lesson completions, and completion rate. It does not show individual learner records.

The review home also links to monitoring and shows published-course activity at a glance.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/review` | Staff can see the monitoring entry point and published course activity |
| `/review/monitoring` | Staff can see aggregate monitoring signals for published courses |
| `/staff` then choose learner, open `/review/monitoring` | Wrong-role access is blocked |

Sample monitoring evidence:

- Course title: `Safeguarding response for local CSOs`
- Total lessons: 1
- Learners started: 1
- Lesson starts: 1
- Lesson completions: 1

## Files created or changed

- `src/app/(review)/review/page.tsx`
- `src/app/(review)/review/monitoring/page.tsx`
- `src/lib/review/monitoring.ts`
- `src/lib/review/monitoring.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-14-learner-progress-tracking.md`
- `docs/run-reports/sprint-15-monitoring-view.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 22 test files, 66 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Local dev server restarted successfully at `http://127.0.0.1:3000`

## Monitoring smoke checks

| Check | Result |
| --- | --- |
| Anonymous `GET /review/monitoring` | 307 |
| Learner session `GET /review/monitoring` | 307 |
| Reviewer session `GET /review/monitoring` | 200 |
| Monitoring page includes sample course title | Yes |
| Monitoring page includes aggregate activity signals | Yes |
| Review home includes monitoring entry point | Yes |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Revision request entry point was added in Sprint 16.
- Certificates are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Add controlled revision draft creation so a creator can work on improvements without mutating the live published course.

# Phase 1A Run Report: Analysis Gate Alignment

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now has a formal Analysis-to-Design Handover gate.

Creators still use the existing Setup -> Diagnosis -> Capacity Map -> Action Map flow, but Capacity Map no longer opens just because Diagnosis was saved. The Analysis Handover must first be saved and then locked for Design. This makes the approved capacity gap, baseline, desired practice, root cause, KSME route, intervention decision, safeguards, and evaluation anchor visible as the read-only reference for Design.

Motivation, Environment, and Mixed gaps cannot move into Phase 1 course production unless the creator records the clear separable Knowledge or Skill component that the course will address.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses/:courseId/diagnosis` | Save the Analysis Handover and use `Lock Analysis for Design` when the route is valid |
| `/studio/courses/:courseId/capacity-map` | Capacity Map is blocked until Analysis is locked; after locking, it shows the read-only Analysis summary |
| `/studio/courses/:courseId/action-map` | Action Map still follows Capacity Map and shows the read-only Analysis summary |
| `/studio/courses/:courseId/storyboard` | Storyboard still follows Action Map and shows the read-only Analysis summary |

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260427020000_analysis_handover/migration.sql`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/[courseId]/diagnosis/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/capacity-map/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/action-map/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/storyboard/page.tsx`
- `src/components/studio/AnalysisSummaryPanel.tsx`
- `src/lib/studio/analysis-handover.ts`
- `src/lib/studio/analysis-handover.test.ts`
- `src/lib/studio/course-workflow-records.ts`
- `src/lib/studio/courses.ts`
- `src/lib/studio/diagnosis.ts`
- `src/lib/studio/diagnosis.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/phase-1a-analysis-gate-alignment.md`

## Schema and workflow changes

- Added `CourseAnalysisHandover` as a separate version-linked model.
- Existing course-fit Knowledge/Skill diagnoses are backfilled as locked handovers to preserve current working sample courses.
- Saving Diagnosis now saves a draft Analysis Handover and keeps Capacity Map locked.
- `Lock Analysis for Design` locks the handover, completes the Diagnosis workflow step, and opens Capacity Map.
- Capacity Map, Action Map, and Storyboard guard against direct access when the Analysis Handover is not locked.

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260427020000_analysis_handover`
- `npm run db:generate` passed after stopping the local server that held the Prisma engine lock
- `npm run typecheck` passed
- Focused tests passed: `2` test files, `10` tests
- `npm run lint` passed
- `npm test` passed: `26` test files, `89` tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Public homepage | `200` |
| Public course discovery | `200` |
| Unauthenticated Studio access | Redirects to staff access |
| Creator Studio home with local creator session | `200` |
| Diagnosis page with local creator session | `200` and shows Analysis Handover content |
| Capacity Map before locked handover on a draft needing more evidence | `200` blocked page explaining that Analysis must be locked first |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Reviewer/capacity-lead approval of Analysis is not built in this slice.
- The full Build Studio block library is not changed.
- Final test scoring is not changed.
- Practical proof, verified achievements, and badges are not built in this slice.

## Next smallest safe step

Design Handover Alignment: add a formal Design-to-Build Handover after Action Map and Storyboard, while preserving the governed Build Studio route.

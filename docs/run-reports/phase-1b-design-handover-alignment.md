# Phase 1B Run Report: Design Handover Alignment

Status label: Implemented and verified

## Product outcome

The Course Creator Studio now has a formal Design-to-Build Handover gate.

Creators still use the existing Setup -> Diagnosis -> Capacity Map -> Action Map -> Storyboard -> Build Studio route structure. The change is that Storyboard now prepares a structured Design-to-Build Handover, and Build Studio stays blocked until the creator/admin uses `Lock Design for Build`.

This keeps Build Studio governed. It does not become a blank-canvas builder, and it still creates lesson blocks from the approved Storyboard only after the design package is locked.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses/:courseId/storyboard` | Save Storyboard and the Design-to-Build Handover, then use `Lock Design for Build` when ready |
| `/studio/courses/:courseId/build` | Build Studio is blocked until Design Handover is locked; after locking, it shows the Design summary and allows Storyboard-fed block generation |
| `/studio/courses/:courseId/action-map` | Existing Action Map route remains unchanged before Storyboard |

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260427030000_design_handover/migration.sql`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/[courseId]/storyboard/page.tsx`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/components/studio/DesignSummaryPanel.tsx`
- `src/lib/studio/design-handover.ts`
- `src/lib/studio/design-handover.test.ts`
- `src/lib/studio/course-workflow-records.ts`
- `src/lib/studio/courses.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/phase-1b-design-handover-alignment.md`

## Schema and workflow changes

- Added `CourseDesignHandover` as a separate version-linked model.
- Existing approved Storyboards are backfilled as locked design handovers to preserve current working sample courses.
- Saving Storyboard now saves a draft Design-to-Build Handover and keeps Build Studio locked.
- `Lock Design for Build` locks the design handover and opens Build Studio.
- Build Studio and build generation actions guard against direct access when Design Handover is not locked.

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260427030000_design_handover`
- `npm run db:generate` passed after stopping the local server that held the Prisma engine lock
- `npm run typecheck` passed
- Focused tests passed: `2` test files, `6` tests
- `npm run lint` passed
- `npm test` passed: `27` test files, `92` tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Public homepage | `200` |
| Public course discovery | `200` |
| Unauthenticated Studio access | Redirects to staff access |
| Draft Build Studio before locked Design Handover | `200` blocked recovery page |
| Backfilled published sample | Has locked Design Handover for preservation of existing working content |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Reviewer/capacity-lead approval of Design is not built in this slice.
- The full Build Studio block library is not changed.
- Final test scoring is not changed.
- Practical proof, verified achievements, and badges are not built in this slice.

## Next smallest safe step

Governed Build Studio block library planning and implementation: add the left-side expandable block library while preserving Storyboard and Design Handover controls.

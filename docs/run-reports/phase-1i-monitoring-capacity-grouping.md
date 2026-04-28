# Phase 1I Monitoring Capacity Grouping Run Report

Status label: Monitoring filters and capacity grouping implemented and verified.

## Product Summary

Staff monitoring now supports capacity-area and linked-standard filters. The monitoring page also groups published course signals by capacity indicator, so staff can see results across related courses instead of only reading one course at a time.

The grouped view remains aggregate: it shows course count, learners started, average completion rate, final test pass rate, and average final test score without exposing individual learner records.

## Files Changed

- `src/lib/review/monitoring.ts`
- `src/lib/review/monitoring.test.ts`
- `src/app/(review)/review/monitoring/page.tsx`
- `src/app/globals.css`
- `docs/README.md`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/phase-1i-monitoring-capacity-grouping.md`

## Schema and Migration Changes

No schema or migration changes were required.

## Routes Affected

- `/review/monitoring`

## Before and After Workflow Behavior

Before this slice, monitoring showed aggregate lesson progress and Final Test signals by course.

After this slice, staff can filter monitoring by capacity area and linked standard, and can review grouped signals across capacity indicators.

## Manual Reviewer URLs

- Published course monitoring: `/review/monitoring`
- Filtered by capacity area: `/review/monitoring?capacityArea=Safeguarding`
- Filtered by linked standard: `/review/monitoring?linkedStandard=CHS`
- Review workspace: `/review`

## Checks Run

- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed, 29 files and 110 tests
- `npm run build` passed
- User-facing wording scan passed
- HTTP smoke checks passed for `/`, `/courses`, `/review/monitoring`, and protected workspace redirects

## Known Gaps

- Date-range filtering is not implemented yet.
- There is no export/download of monitoring evidence yet.
- Grouping depends on course capacity map fields; courses without capacity mapping appear under unmapped labels.
- Practical proof, verified achievements, and badge monitoring remain separate future layers.

## Next Smallest Safe Step

Add a monitoring evidence export or snapshot view so staff can capture aggregate course and capacity signals for reporting without exposing individual learner details.

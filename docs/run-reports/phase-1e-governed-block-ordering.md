# Phase 1E Governed Block Ordering Run Report

Status label: Governed Build Studio block ordering implemented and verified.

## Product Summary

Creators can now move lesson blocks up or down inside Build Studio. This supports a more natural lesson flow without turning the Build Studio into a blank-canvas builder.

The platform keeps the governance evidence attached to each block. Required blocks remain required, creator-added blocks keep their justification and purpose link, and changing the order requires Build checks again before Preview and Creator Review can continue.

## Files Changed

- `src/lib/studio/build-studio.ts`
- `src/lib/studio/build-studio.test.ts`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/app/globals.css`
- `docs/README.md`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/phase-1e-governed-block-ordering.md`

## Schema and Migration Changes

No schema or migration changes were required. Ordering uses the existing `LessonBlock.sortOrder` field.

## Routes Affected

- `/studio/courses/:courseId/build`

## Before and After Workflow Behavior

Before this slice, creators could generate, add, and edit blocks but could not adjust the lesson sequence.

After this slice, each block has Move up and Move down controls. Boundary moves are disabled in the UI, and the server also prevents invalid moves. A successful move swaps the block order inside the same lesson and reopens Build checks.

## Manual Reviewer URLs

- Public learner homepage: `/`
- Course discovery: `/courses`
- Course Creator Studio: `/studio`
- Course list: `/studio/courses`
- Build Studio for a course: `/studio/courses/:courseId/build`
- Preview after Build checks: `/studio/courses/:courseId/preview`

## Checks Run

- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed, 28 files and 99 tests
- `npm run build` passed
- User-facing wording scan passed
- HTTP smoke checks passed for `/`, `/courses`, and protected Studio access

## Known Gaps

- Drag-and-drop ordering is not implemented; the current controls are explicit Move up and Move down buttons.
- Rich media and advanced interaction editors are not implemented yet.
- Final test question authoring remains a later Build Studio slice.
- Certificate behavior was not changed.

## Next Smallest Safe Step

Add final test authoring controls in Build Studio so creators can create course assessment items that later support the existing 80% pass and automated certificate rule.

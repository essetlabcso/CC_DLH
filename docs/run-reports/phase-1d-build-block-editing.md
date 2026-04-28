# Phase 1D Build Block Editing Run Report

Status label: Build Studio block editing implemented and verified.

## Product Summary

Creators can now edit the learner-facing content inside each Build Studio block. The edit surface is inside the governed Build Studio flow, so required Storyboard-derived blocks and creator-added blocks remain connected to their purpose, source, and justification evidence.

When a block is saved, Build returns to in-progress and Preview is locked until the creator completes the Build checks again. Creator Review is also locked again if the edited content had already moved that far. This keeps the platform from treating changed lesson content as already reviewed.

## Files Changed

- `src/lib/studio/build-studio.ts`
- `src/lib/studio/build-studio.test.ts`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/app/globals.css`
- `docs/README.md`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/run-reports/phase-1d-build-block-editing.md`

## Schema and Migration Changes

No schema or migration changes were required. The existing `LessonBlock.content` field already stores the editable learner-facing content, and the existing `origin`, `justification`, and `purposeLink` fields remain protected outside the edit form.

## Routes Affected

- `/studio/courses/:courseId/build`

## Before and After Workflow Behavior

Before this slice, creators could generate governed lesson blocks and add justified creator blocks, but could not directly edit the content inside those blocks.

After this slice, creators can edit block title, purpose, content, prompt, feedback, and accessibility note. Saving a block preserves the block's governed source metadata, requires Build checks before Preview can reopen, and re-locks Creator Review when changed content needs a fresh preview pass.

## Manual Reviewer URLs

- Public learner homepage: `/`
- Course discovery: `/courses`
- Course Creator Studio: `/studio`
- Course list: `/studio/courses`
- Build Studio for a course: `/studio/courses/:courseId/build`
- Storyboard gate before Build: `/studio/courses/:courseId/storyboard`
- Preview after Build checks: `/studio/courses/:courseId/preview`

## Checks Run

- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed, 28 files and 98 tests
- `npm run build` passed
- User-facing wording scan passed
- HTTP smoke checks passed for `/`, `/courses`, and protected Studio access

## Known Gaps

- Block reordering is not implemented yet.
- Rich interaction editors for choices, branches, media, and final test questions are not implemented yet.
- The full practical proof and verified achievement layer remains out of scope for this slice.
- Certificate behavior was not changed.

## Next Smallest Safe Step

Add governed block ordering controls so creators can adjust lesson flow while preserving required/creator-added metadata and keeping Build checks in control.

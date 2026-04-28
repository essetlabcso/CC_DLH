# Phase 1C Run Report: Governed Build Block Library

Status label: Implemented and verified

## Product outcome

Build Studio now includes a governed left-side block library.

The library is visible inside the Build Studio workspace after the approved Storyboard blocks have been generated. Creators can add extra support blocks, but only with a required block type, title, justification, and purpose link. Added blocks are marked as `Creator-added`, while Storyboard-generated blocks remain marked as `Required from Design`.

This keeps Build Studio flexible without turning it into a blank-canvas builder.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/studio/courses/:courseId/build` | Left-side block library appears after generated lesson blocks exist |
| `/studio/courses/:courseId/build` | Creator-added block form requires block type, title, justification, and purpose link |
| `/studio/courses/:courseId/build` | Added blocks display governance metadata: justification and purpose link |

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260427040000_build_block_metadata/migration.sql`
- `src/app/(creator)/studio/actions.ts`
- `src/app/(creator)/studio/courses/[courseId]/build/page.tsx`
- `src/app/globals.css`
- `src/lib/studio/block-library.ts`
- `src/lib/studio/block-library.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/phase-1c-governed-build-block-library.md`

## Schema and workflow changes

- Added block metadata fields to `LessonBlock`:
  - `origin`
  - `justification`
  - `purposeLink`
- Existing blocks default to `DESIGN_REQUIRED`.
- New creator-added blocks are stored as `CREATOR_ADDED`.
- Build Studio remains gated by the locked Design-to-Build Handover.

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260427040000_build_block_metadata`
- `npm run db:generate` passed after stopping the local server that held the Prisma engine lock
- Focused tests passed: `2` test files, `7` tests
- `npm run typecheck` passed
- `npm test` passed: `28` test files, `96` tests
- `npm run lint` passed
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Public homepage | `200` |
| Public course discovery | `200` |
| Unauthenticated Studio access | Redirects to staff access |
| Draft Build Studio before locked Design Handover | `200` blocked recovery page |
| Existing block metadata backfill | Existing blocks remain `DESIGN_REQUIRED` |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- This slice does not add drag-and-drop reorder.
- This slice does not add rich block editing.
- This slice does not add final test scoring.
- This slice does not add practical proof, verified achievements, or badges.

## Next smallest safe step

Build Studio block editing: allow creators to edit learner-facing content inside existing governed blocks while preserving required/creator-added metadata.

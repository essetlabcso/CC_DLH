# Phase 0-1 Implementation Run Report

Status label: Implemented architecture foundation

## Product outcome

Phase 0 removed internal development wording from the real product UI. The public site remains learner-facing, staff access is separate, and protected workspaces now show role-appropriate product language.

Phase 1 upgraded the architecture foundation for the Phase 1 workflow. The app now has membership-aware role records, a richer course-version lifecycle, dedicated creator workflow records, and code-level workflow policy helpers.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/` | Public learner homepage; no staff role buttons |
| `/courses` | Learner course discovery entry |
| `/sign-in` | Learner sign-in |
| `/staff` | Clearly marked internal staff access |
| `/learn` | Learner workspace product language |
| `/studio` | Course Creator Studio with workflow spine |
| `/review` | Review and publishing workspace |
| `/admin` | Platform oversight workspace |
| `/creator` | Redirects to `/studio` |

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260425073000_phase1_workflow_foundation/migration.sql`
- `scripts/apply-local-sqlite.mjs`
- `src/components/workspace/WorkspaceShell.tsx`
- `src/components/foundation/WorkspaceShell.tsx` removed
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/not-found.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/courses/page.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/staff/page.tsx`
- `src/app/(auth)/forbidden/page.tsx`
- `src/app/(learner)/learn/page.tsx`
- `src/app/(creator)/studio/page.tsx`
- `src/app/(review)/review/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/lib/auth/persistence.ts`
- `src/lib/auth/persistence.test.ts`
- `src/lib/db/lifecycle.ts`
- `src/lib/db/lifecycle.test.ts`
- `src/lib/workflow/course-workflow.ts`
- `src/lib/workflow/course-workflow.test.ts`
- `docs/architecture/data-model.md`
- `docs/architecture/foundation.md`
- `docs/architecture/phase-1-route-inventory.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:generate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run test` passed: 5 test files, 18 tests
- `DATABASE_URL=file:./dev.db npm run build` passed
- User-facing source wording scan passed for banned development terms in `src`

## Route smoke checks

| Check | Result |
| --- | --- |
| `GET /` | 200 |
| `GET /courses` | 200 |
| `GET /sign-in` | 200 |
| `GET /staff` | 200 |
| Anonymous `GET /studio` | 307 to `/staff?next=%2Fstudio&workspace=studio` |
| `GET /creator` | 307 to `/studio` |
| Creator session `GET /studio` | 200 |
| Learner session `GET /learn` | 200 |
| Learner session `GET /studio` | 307 to `/forbidden?next=%2Fstudio&workspace=studio` |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Full Creator Studio forms are not built yet.
- Learner runtime is not built yet.
- Review queue and publishing actions are not built yet.
- Admin management screens are not built yet.
- Monitoring, certificates, source/asset governance, and AI authoring are not built yet.

## Next smallest safe step

Start the next approved implementation phase with the Studio home and My Courses experience, then Course Setup.

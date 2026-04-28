# Sprint 23 Run Report: Certificate Revocation and Status History

Status label: Implemented and verified

## Product outcome

Admins can now revoke and reactivate issued certificates.

Public certificate verification no longer treats revoked certificates as simply missing. It shows the certificate status clearly and includes a status history, so reviewers and external verifiers can understand whether a certificate is active, revoked, or reactivated.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/admin/certificates` | Admin can revoke or reactivate an issued certificate and see status history |
| `/verify?certificate=DEC-CERT-YGS249-DVCZP5` | Public verifier sees current status and status history |
| `/learn/certificates` | Learner sees certificate status and can verify the certificate |

Sample certificate:

- Certificate ID: `DEC-CERT-YGS249-DVCZP5`
- Final status after smoke test: `Active`
- History events: `ISSUED`, `REVOKED`, `REACTIVATED`
- Admin actor on status changes: `DEC admin`

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260427010000_certificate_status_history/migration.sql`
- `src/app/(admin)/admin/certificates/actions.ts`
- `src/app/(admin)/admin/certificates/page.tsx`
- `src/app/(public)/verify/page.tsx`
- `src/app/(learner)/learn/certificates/page.tsx`
- `src/app/globals.css`
- `src/lib/learner/certificate-status.ts`
- `src/lib/learner/certificate-status.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-22-certificate-download-verification.md`
- `docs/run-reports/sprint-23-certificate-revocation-history.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260427010000_certificate_status_history`
- `npm run db:generate` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 25 test files, 82 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Admin revoke action | 303 to `/admin/certificates?revoked=1` |
| Public verification after revoke | Shows `Certificate revoked` and status history |
| Admin reactivate action | 303 to `/admin/certificates?reactivated=1` |
| Public verification after reactivation | Shows `Certificate verified` and `Reactivated` history |
| Final database status | `revokedAt` is `null` |
| History records | `ISSUED`, `REVOKED`, `REACTIVATED` |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.
- Certificate expiry rules are not built yet.

## Next smallest safe step

Governed AI authoring support for Build Studio drafts.

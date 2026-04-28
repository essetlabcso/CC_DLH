# Sprint 21 Run Report: Persisted Certificate Issuance

Status label: Implemented and verified

## Product outcome

Certificates are now persisted as durable learning records.

When a learner completes all required lessons in a certificate-ready published course, the app issues a certificate record with a stable certificate ID. Learners can see the certificate ID in My Certificates, and admins can review issued certificates from a dedicated oversight page.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/learn/certificates` | Learner sees the issued certificate ID and completion record |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h` | Learner sees certificate status on the course overview |
| `/admin` | Admin home links to certificate oversight |
| `/admin/certificates` | Admin sees issued certificate records with learner, course, version, and status |

Sample issued certificate:

- Course title: `Safeguarding response for local CSOs`
- Current published version id: `cmoeumd370008fhi0xuygs249`
- Learner: `DEC learner`
- Certificate ID: `DEC-CERT-YGS249-DVCZP5`
- Certificate status: `Active`

## Files created or changed

- `prisma/schema.prisma`
- `prisma/migrations/20260426200000_learner_certificates/migration.sql`
- `src/app/(learner)/learn/actions.ts`
- `src/app/(learner)/learn/certificates/page.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/certificates/page.tsx`
- `src/lib/learner/certificates.ts`
- `src/lib/learner/certificates.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-20-certificate-eligibility.md`
- `docs/run-reports/sprint-21-persisted-certificate-issuance.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed and applied `20260426200000_learner_certificates`
- `npm run db:generate` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 24 test files, 78 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Sample completed learner certificate issuance | Created `DEC-CERT-YGS249-DVCZP5` |
| Learner certificate record uniqueness | Enforced by learner and course version |
| Admin certificate page route | Included in build |
| Learner certificate page route | Included in build |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Completed in Sprint 22: printable learner certificate and public certificate verification.
- Certificate expiry and revocation actions are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Completed in Sprint 22. Next, add certificate revocation controls and verification status history.

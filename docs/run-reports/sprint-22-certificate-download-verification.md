# Sprint 22 Run Report: Certificate Download and Verification

Status label: Implemented and verified

## Product outcome

Learners can now open a certificate page that is formatted for printing or saving as a PDF from the browser.

The platform also has a public certificate verification page. Anyone with a certificate ID can verify whether it belongs to an active issued certificate and see the learner name, course, and issue date.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/learn/certificates` | Learner sees links to open and verify issued certificates |
| `/learn/certificates/DEC-CERT-YGS249-DVCZP5` | Learner sees a printable certificate page |
| `/verify` | Public certificate verification form |
| `/verify?certificate=DEC-CERT-YGS249-DVCZP5` | Public verification confirms the active certificate |
| `/admin/certificates` | Admin can open public verification for an issued certificate |

Sample certificate:

- Certificate ID: `DEC-CERT-YGS249-DVCZP5`
- Learner: `DEC learner`
- Course: `Safeguarding response for local CSOs`
- Public verification status: `Certificate verified`

## Files created or changed

- `src/app/(learner)/learn/certificates/[certificateNumber]/page.tsx`
- `src/app/(learner)/learn/certificates/page.tsx`
- `src/app/(public)/verify/page.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(admin)/admin/certificates/page.tsx`
- `src/app/globals.css`
- `src/components/certificates/PrintCertificateButton.tsx`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-21-persisted-certificate-issuance.md`
- `docs/run-reports/sprint-22-certificate-download-verification.md`

## Verification

- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 24 test files, 78 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed

## Smoke checks

| Check | Result |
| --- | --- |
| Public verification route in build | Yes |
| Learner printable certificate route in build | Yes |
| `/verify?certificate=DEC-CERT-YGS249-DVCZP5` | Shows `Certificate verified` |
| `/learn/certificates/DEC-CERT-YGS249-DVCZP5` | Shows `Certificate of completion` |
| `/admin/certificates` | Shows verification link for issued certificate |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Completed in Sprint 23: certificate revocation controls and verification status history.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Completed in Sprint 23. Next, add governed AI authoring support for Build Studio drafts.

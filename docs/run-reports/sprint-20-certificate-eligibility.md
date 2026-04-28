# Sprint 20 Run Report: Certificate Eligibility

Status label: Implemented and verified

## Product outcome

Learners can now see certificate readiness for published DEC courses.

The learner dashboard shows certificate status beside course progress. The course overview shows whether the certificate is available or still in progress. A new learner certificate page shows the learner name, completion date, course version, and certificate record type when all required lessons are complete.

This first certificate pass is derived from the current published course and lesson completion records. It does not add a new certificate database table yet.

## Browser review guide

| URL | What to check |
| --- | --- |
| `/learn` | Learner sees course progress and certificate status |
| `/learn/certificates` | Learner sees certificate readiness and available completion records |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h` | Course overview shows certificate status |
| `/learn/courses/cmodv20im001efhmwa1e3fu4h/lessons/cmoeumd5s000tfhi0wwc2uml3` | Learner can complete the required lesson |

Sample certificate evidence:

- Course title: `Safeguarding response for local CSOs`
- Current published version id: `cmoeumd370008fhi0xuygs249`
- Required lesson id: `cmoeumd5s000tfhi0wwc2uml3`
- Certificate status after completion: `Certificate available`
- Record type: `Certificate of completion`

## Files created or changed

- `src/app/(learner)/learn/certificates/page.tsx`
- `src/app/(learner)/learn/page.tsx`
- `src/app/(learner)/learn/courses/[courseId]/page.tsx`
- `src/lib/learner/certificates.ts`
- `src/lib/learner/certificates.test.ts`
- `docs/architecture/phase-1-route-inventory.md`
- `docs/README.md`
- `docs/run-reports/sprint-20-certificate-eligibility.md`

## Verification

- `DATABASE_URL=file:./dev.db npm run db:validate` passed
- `DATABASE_URL=file:./dev.db npm run db:apply:local` passed
- `npm run typecheck` passed
- `npm run lint` passed
- `npm test` passed: 24 test files, 77 tests
- User-facing source wording scan passed for banned development terms in `src`
- `npm run build` passed
- Production route smoke verified `/courses`, `/learn/certificates`, and `/learn/courses/cmodv20im001efhmwa1e3fu4h`

## Smoke checks

| Check | Result |
| --- | --- |
| Build includes `/learn/certificates` | Yes |
| Course discovery route | 200 |
| Learner certificate page with signed learner session | Shows `Certificate available` |
| Learner course overview with signed learner session | Shows `Certificate available` |
| Certificate record type | Shows `Certificate of completion` |
| Lesson completion record | Present for the current published version |

## Supabase status

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Known incomplete items

- Completed in Sprint 21: persisted certificate issuance records with certificate IDs and admin certificate oversight.
- Certificate download, expiry, revocation actions, and public verification are not built yet.
- AI generation is not built yet.
- Manual block editing, reorder, media upload, and richer learner interactions remain incomplete.

## Next smallest safe step

Completed in Sprint 21. Next, add certificate download and public certificate verification.

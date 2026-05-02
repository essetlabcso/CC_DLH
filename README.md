# DEC Learning Hub

Current DEC Learning Hub Phase 1 codebase.

The repo now includes working foundations for learner runtime, Course Creator Studio, review, publishing, certificates, revision, monitoring, practical proof, and verified achievements. Badge visuals/public badge workflows, richer AI governance, production auth/storage, and several revised-spec upgrades remain future implementation work.

## Source Of Truth

- Current spec package: [docs/specs/core-workflow](docs/specs/core-workflow)
- Source-of-truth and override note: [Annex 1](docs/specs/core-workflow/Annex_1_Source_of_Truth_and_Override_Note.md)
- Evidence pack template: [Annex 13](docs/specs/core-workflow/Annex_13_Codex_Implementation_Evidence_Pack_Template.md)
- Legacy baseline spec: [doc/spec_dec_learning_hub.md](doc/spec_dec_learning_hub.md)
- Brand note: [doc/dec_brand_colors_style.md](doc/dec_brand_colors_style.md)

## Local Setup

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run db:setup:local
npm run typecheck
npm run lint
npm run test
npm run build
```

## Project Shape

- App Router source lives under `src/app`.
- Route groups separate public/auth/learner/studio/review/admin areas.
- `src/middleware.ts` defines signed-session, role-aware route boundary policy.
- DEC theme tokens live in `src/styles/dec-theme.css` and `src/theme/dec-tokens.ts`.
- Project documentation lives under `docs/`.

## Status Language

Use DEC status labels truthfully in reports:

- `Not Started`
- `Scaffolded`
- `Implemented`
- `Verified`
- `Accepted`

Route presence alone is not proof of complete Phase 1 workflows. Use the run reports and Annex 13 evidence pack expectations when reporting implementation status.

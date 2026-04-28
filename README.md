# DEC Learning Hub

Foundation scaffold for the DEC Learning Hub Phase 1 product.

The current repo state is **Slice 0-1: Scaffolded**. It establishes the route, documentation, environment, middleware, and theme-token foundation only. It does not implement learner, creator, reviewer, admin, AI, course, certificate, or monitoring product behavior yet.

## Source Of Truth

- Primary spec: [doc/spec_dec_learning_hub.md](doc/spec_dec_learning_hub.md)
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

## Foundation Shape

- App Router source lives under `src/app`.
- Route groups separate public/auth/learner/studio/review/admin foundations.
- `src/middleware.ts` defines the first signed-session, role-aware route boundary policy.
- DEC theme tokens live in `src/styles/dec-theme.css` and `src/theme/dec-tokens.ts`.
- Project documentation lives under `docs/`.

## Status Language

Use DEC status labels truthfully:

- `Not Started`
- `Scaffolded`
- `Implemented`
- `Verified`
- `Accepted`

For the current slice, route presence and signed-session workspace boundaries are scaffolded only. They are not proof of complete Phase 1 workflows.

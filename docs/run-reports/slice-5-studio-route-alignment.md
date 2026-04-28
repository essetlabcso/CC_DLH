# Slice 5 Run Report

Date: 2026-04-25

Status label: Scaffolded

## Product Outcome

- The Course Creator Portal now uses `/studio` as the canonical route.
- `/creator` remains only as a legacy redirect to `/studio`.
- Public learner pages remain clean and do not expose staff roles.
- Staff access remains separate at `/staff`.
- Studio is protected for course creators and admins.
- Review remains protected for reviewers and admins.
- Admin remains protected for admins only.

## Current Entry Points

- Public learner homepage: `/`
- Learner sign-in: `/sign-in`
- Course discovery: `/courses`
- Member learning workspace: `/learn`
- Staff access: `/staff`
- Course Creator Studio: `/studio`
- Reviewer area: `/review`
- Admin area: `/admin`
- Legacy creator URL: `/creator` redirects to `/studio`

## Reviewer Guide

Open these URLs from one running `npm run dev` server:

- Public learner homepage: `http://localhost:3000/`
- Learner sign-in: `http://localhost:3000/sign-in`
- Course discovery: `http://localhost:3000/courses`
- Staff access: `http://localhost:3000/staff`
- Creator portal / Studio: `http://localhost:3000/studio`
- Reviewer area: `http://localhost:3000/review`
- Admin area: `http://localhost:3000/admin`
- Wrong-role blocked access: sign in as learner, then open `http://localhost:3000/studio`

## Created / Changed

- Added canonical Studio route at `/studio`.
- Changed staff creator access to send creators to `/studio`.
- Changed protected workspace policy from `/creator` to `/studio`.
- Tightened Studio access to creator and admin only.
- Kept `/creator` as a redirect to `/studio`.
- Updated route documentation to name `/studio` as the creator workspace.

## Checks

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run test` passed: 4 test files, 12 tests.
- `npm run build` passed with `DATABASE_URL=file:./dev.db`.
- Clean local dev restart passed with `DATABASE_URL=file:./dev.db`.

## Access Smoke Checks

- `GET /` returned `200`.
- `GET /sign-in` returned `200`.
- `GET /courses` returned `200`.
- `GET /staff` returned `200`.
- anonymous `GET /studio` returned `307` to `/staff?next=%2Fstudio&workspace=studio`.
- anonymous `GET /review` returned `307` to `/staff?next=%2Freview&workspace=review`.
- anonymous `GET /admin` returned `307` to `/staff?next=%2Fadmin&workspace=admin`.
- legacy `GET /creator` returned `307` to `/studio`.
- signed learner `GET /learn` returned `200`.
- signed learner `GET /studio` returned `307` to forbidden.
- signed creator `GET /studio` returned `200`.
- signed creator `GET /admin` returned `307` to forbidden.
- signed reviewer `GET /review` returned `200`.
- signed reviewer `GET /studio` returned `307` to forbidden.
- signed admin `GET /admin` returned `200`.
- signed admin `GET /studio` returned `200`.

## Supabase Boundary

Supabase remains initialized and linked only. No Supabase database push, pull, reset, or schema-changing command was run.

## Next Smallest Safe Step

Start the creator setup skeleton inside `/studio`, using persisted users and organization-scoped course records.

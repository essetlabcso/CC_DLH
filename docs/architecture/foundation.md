# Application Architecture

Status: Implemented architecture foundation

This foundation follows the DEC Phase 1 spec direction: secure access, role-aware workspaces, controlled route boundaries, mobile-first accessible styling, and evidence-based reporting.

## Route Groups

The App Router is split by workspace responsibility:

| Group | URL prefix | Purpose | Status |
| --- | --- | --- | --- |
| `(public)` | `/` | Public landing and basic orientation | Scaffolded |
| `(auth)` | `/sign-in` | Authentication entry point placeholder | Scaffolded |
| `(learner)` | `/learn` | Learner workspace boundary | Scaffolded |
| `(creator)` | `/studio` | Course Creator Studio boundary | Scaffolded |
| `(review)` | `/review` | Reviewer / publisher workspace boundary | Scaffolded |
| `(admin)` | `/admin` | Admin governance boundary | Scaffolded |

## Access Boundary

`src/middleware.ts` protects workspace URL prefixes with signed session checks. The current implementation reads a signed session cookie named by `DEC_SESSION_COOKIE` or `dec_session` by default.

This is still local development authentication, not a production identity system. The current local sign-in route is only for exercising DEC role boundaries. Production identity provider integration and Supabase-backed auth remain future work.

The persisted identity model now resolves roles through `OrganizationMembership` and `MembershipRoleAssignment`, so role checks are tied to an organization context instead of free-floating accounts.

## Theme Tokens

The DEC base theme is defined as CSS custom properties in `src/styles/dec-theme.css` and mirrored for TypeScript consumers in `src/theme/dec-tokens.ts`.

The initial tokens come from the spec and brand note:

- Primary: `#3B99D4`
- Secondary: `#91C852`
- Background: `#F9FAFB`, `#FFFFFF`
- Primary text: `#111827`

## Current Non-Goals

- No full creator form workflow yet.
- No learner runtime yet.
- No AI authoring yet.
- No certificate or completion logic yet.
- No monitoring analytics UI yet.
- No Supabase database schema push/pull/reset has been run.

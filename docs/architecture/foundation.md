# Application Architecture

Status: Implemented architecture foundation

This foundation follows the DEC Phase 1 spec direction: secure access, role-aware workspaces, controlled route boundaries, mobile-first accessible styling, and evidence-based reporting.

## Route Groups

The App Router is split by workspace responsibility:

| Group | URL prefix | Purpose | Status |
| --- | --- | --- | --- |
| `(public)` | `/` | Public landing, course discovery, and certificate verification | Partial foundation |
| `(auth)` | `/sign-in` | Local development authentication entry points | Local-dev foundation |
| `(learner)` | `/learn` | Learner workspace, published course access, progress, final test, certificates, and proof submission | Implemented foundation |
| `(creator)` | `/studio` | Course Creator Studio production workflow from setup through creator review submission | Implemented foundation |
| `(review)` | `/review` | Review, publishing, monitoring, revisions, proof review, and verified achievement summary | Implemented foundation |
| `(admin)` | `/admin` | Admin governance boundary with certificate oversight and planned management areas | Partial foundation |

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

## Current Remaining Non-Goals / Gaps

- Production identity provider integration is not implemented; current sign-in remains local development only.
- Full governed AI authoring is not implemented, though limited AI-review metadata and status foundations exist in Build Studio logic.
- Badge visuals/public badge workflows are not implemented.
- Admin user, course, and system management routes remain planned.
- Supabase database schema push/pull/reset has not been run.

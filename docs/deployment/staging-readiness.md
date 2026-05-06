# DEC Learning Hub - Staging Deployment & Readiness Guide

This document prepares the DEC Learning Hub Course Creator Portal for successful deployment to staging environments, structured user acceptance testing (UAT), and live demonstrations.

## 1. System Requirements

- **Node.js**: Version `>=24.0.0` (as defined in `package.json`).
- **NPM**: Version `>=11.0.0` (as defined in `package.json`).
- **Operating System**: Linux (Ubuntu 22.04+ recommended), macOS, or Windows Server.
- **Database**: SQLite (standard local development and staging file database) or Postgres (via planned Supabase migration).

---

## 2. Staging Environment Variables

Copy `.env.example` to `.env` or set these in your hosting environment:

| Variable | Description | Recommended Staging Value |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Display name of the application | `"DEC Learning Hub (Staging)"` |
| `NEXT_PUBLIC_APP_URL` | Staging URL of the deployment | e.g. `"https://staging.dec.org"` |
| `AUTH_SECRET` | Secret used to sign session cookies | Generating a strong secure secret is required |
| `DEC_SESSION_COOKIE` | Cookie name for sessions | `"dec_session"` |
| `DATABASE_URL` | SQLite file path or database connection URL | `"file:./prisma/dev.db"` (default SQLite file path) |
| `ENABLE_DEMO_LOGIN` | Flag to enable passwordless demo login | `"true"` (or `"false"` to disable) |
| `ENABLE_DEMO_SEED` | Flag to enable UAT golden path course seed | `"true"` (or `"false"` to disable) |

---

## 3. Database & Seeding Setup

Before building the application, initialize the database and load reference taxonomy datasets.

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Setup SQLite database file and apply schema migrations
npm run db:apply:local

# 3. Seed administrative reference and lookup tables
npm run db:seed:admin-reference

# 4. (Optional) Seed the Golden Path course for UAT walkthroughs
# Make sure ENABLE_DEMO_SEED="true" is in your environment variables.
# WARNING: Running this is reset-style (deletes and recreates Golden Path records).
npm run db:seed:golden-path
```

---

## 4. Staging Build & Run Commands

Compile the optimized Next.js application bundle and start the service:

```bash
# 1. Build the production package
npm run build

# 2. Run the application
npm start
```

---

## 5. Local vs Staging Behavioral Differences

1. **Authentication Strategy**:
   - Both local and staging environments support the **Development Login Bypass** allowing seamless testing as `Admin`, `Creator`, `Reviewer`, or `Learner` **only** if the environment flag `ENABLE_DEMO_LOGIN` is explicitly set to `"true"`. No real production identity provider is connected in the core scaffold. In production, this flag defaults to `"false"`.
2. **Database Persistence**:
   - The default staging deployment uses a file-based SQLite database (`./prisma/dev.db`). Ensure that your staging server's deployment pipeline does not wipe the SQLite file on redeployment unless seeding is intentionally rerun.

---

## 6. Staging Support & Execution Package

For step-by-step guidance on executing deployment checklists or understanding staging environment limitations, refer to the following auxiliary materials:
- **[Staging Deployment Execution Checklist](./STAGING_DEPLOYMENT_EXECUTION_CHECKLIST.md)**: Structured checklists detailing pre-deployment, seeding, compilation, and rollback steps.
- **[Staging Limitations & Non-Production Notice](../demo/STAGING_LIMITATIONS_AND_NON_PRODUCTION_NOTE.md)**: Important, non-alarming notice outlining SQLite, synthetic data, and AI-assistance boundaries.
- **[Staging UAT Handoff Summary](../demo/DEC_STAGING_UAT_HANDOFF_SUMMARY.md)**: Clear, non-technical overview summary designed for DEC/ESSET stakeholders.

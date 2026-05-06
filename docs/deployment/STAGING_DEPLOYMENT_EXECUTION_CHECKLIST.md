# Staging Deployment Execution Checklist

This document provides a step-by-step checklist for the deployment engineer to safely deploy, verify, and manage the DEC Learning Hub Course Creator Portal in a staging or private demonstration environment.

---

## A. Pre-Deployment Configuration & Environment Checks

Before initiating deployment, verify that the repository state, software dependencies, and environment configurations are fully prepared.

- [ ] **Confirm Repository Branch**: Verify that you are on the approved staging branch (e.g., `main` or `staging`).
- [ ] **Confirm Clean Working Tree**: Run `git status` to ensure there are no uncommitted changes or untracked temporary files in the build workspace.
- [ ] **Confirm Node & npm Versions**: 
  - Run `node -v` (required: **Node.js >=24.0.0**).
  - Run `npm -v` (required: **npm >=11.0.0**).
- [ ] **Confirm Environment Variables**: Inspect the staging `.env` or container configuration and verify the following variables:
  - [ ] `ENABLE_DEMO_LOGIN="true"` — **WARNING: Must be disabled (unset or `"false"`) in production environments.**
  - [ ] `ENABLE_DEMO_SEED="true"` — Enables the Golden Path UAT courses to be pre-seeded. **WARNING: Staging-only flag.**
  - [ ] `AUTH_SECRET="..."` — Confirm this is set to a cryptographically strong, random string (e.g., generated via `openssl rand -base64 32`).
  - [ ] `DATABASE_URL="file:./prisma/dev.db"` — Points to the local SQLite database file inside the repository structure.
- [ ] **Confirm SQLite Persistence / Backups**:
  - Since SQLite resides in a local file (`prisma/dev.db`), confirm that the deployment host preserves this directory across container restarts or build redeployments.
  - Establish a scheduled backup job (cron) to copy the `prisma/dev.db` file to a secure, off-site storage volume if data persistence is required between testing cycles.

---

## B. Database Initialization & Seeding Setup

Configure the database schema and load reference data using the local script orchestrators.

- [ ] **Generate Prisma Client**: Run the client code generator to build type-safe database queries.
  ```bash
  npm run db:generate
  ```
- [ ] **Apply Schema Migrations**: Create or update the local SQLite database file and apply all schema migrations.
  ```bash
  npm run db:apply:local
  ```
- [ ] **Seed Reference Taxonomy**: Seed the administrative lookup and reference tables (including Ethiopian regions and K/S/M/E root-cause routing options).
  ```bash
  npm run db:seed:admin-reference
  ```
- [ ] **Seed Golden Path Courses**: Seed the Published and Submitted Golden Path course templates for walkthrough testing.
  ```bash
  ENABLE_DEMO_SEED=true npm run db:seed:golden-path
  ```
- [ ] **Verify Seed Idempotency**: Run the golden path seed command **a second time** to confirm the script operates idempotently without throwing duplicate key errors or unique constraint violations.
  ```bash
  ENABLE_DEMO_SEED=true npm run db:seed:golden-path
  ```
  > [!WARNING]
  > **Reset-Style Seeding Warning**: Running `db:seed:golden-path` will completely delete and recreate all course records associated with the Golden Path slugs. Do not execute this script in environments where live tester progress or custom training data must be preserved.

---

## C. Code Validation, Compilation & Startup

Verify code health and build the production-optimized Next.js bundles before starting the application server.

- [ ] **Run Typecheck**: Compile the codebase to confirm zero static analysis or type-safety issues.
  ```bash
  npm run typecheck
  ```
- [ ] **Run Linter**: Run ESLint to verify full formatting and coding standard compliance.
  ```bash
  npm run lint
  ```
- [ ] **Run Unit Tests**: Execute the Vitest suite to confirm all 322 test cases pass cleanly.
  ```bash
  npm run test
  ```
- [ ] **Build Production Bundle**: Generate the optimized production deployment bundles.
  ```bash
  npm run build
  ```
- [ ] **Start Application**: Launch the application server in production mode.
  ```bash
  npm start
  ```

---

## D. Post-Deployment Smoke Test Routines

Navigate to the following staging routes to verify successful server-side initialization and visual alignment:

- [ ] `/sign-in` — Confirm that the development role buttons (Creator, Reviewer, Admin, Learner) render cleanly.
- [ ] `/admin/config/lookups` — Sign in as **DEC Admin** (`admin@dec.local`) and verify Ethiopian regions and lookup datasets render successfully.
- [ ] `/studio` — Sign in as **Course Creator** (`creator@dec.local`) and verify the Published Golden Path course card is visible.
- [ ] `/review/queue` — Sign in as **Reviewer** (`reviewer@dec.local`) and verify that the Submitted review-candidate course is listed.
- [ ] `/review/publishing` — Sign in as **DEC Admin** (`admin@dec.local`) and verify the publishing handoff interface is accessible.
- [ ] `/courses` — Sign in as **Learner** (`learner@dec.local`) and verify that ONLY `PUBLISHED` active courses appear in the catalog.
- [ ] `/learn` — Access the lesson workstation and verify lesson blocks load successfully.
- [ ] `/learn/certificates` — Confirm issued certificates can be accessed and display the prominent **Governance Notice**.
- [ ] `/review/monitoring` — Access the monitoring dashboard and confirm aggregate summaries render with proper metric separation.

---

## E. Rollback, Maintenance & Reset Procedures

- **Stop the Application**: To shut down the web service, send a terminate signal (`Ctrl+C` or standard process kill `kill <PID>`) to the running Node process.
- **Safely Re-Run Seeding**: If the database state becomes corrupted or misconfigured during testing, stop the application, delete the `prisma/dev.db` file, and re-run steps B-1 through B-4 to restore a clean, pre-configured slate.
- **What NOT to Do in Production**:
  - **NEVER** leave `ENABLE_DEMO_LOGIN` or `ENABLE_DEMO_SEED` enabled on production instances.
  - **NEVER** use SQLite as the database engine for production deployments. Production instances must utilize a managed Postgres database (such as Supabase) with secure role scoping and point-in-time recovery.
  - **NEVER** rely on raw un-backed-up local filesystems to persist system states.

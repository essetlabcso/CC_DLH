# Staging Smoke Test Checklist

This checklist is used to verify that the DEC Learning Hub Course Creator Portal has deployed successfully and is operating securely and correctly in a staging environment.

---

## 1. Baseline Route Open & Server Checks

- [ ] **Home Page Loading**: Navigate to `/` and confirm the homepage renders correctly with no errors.
- [ ] **Sign-In Page Rendering**: Go to `/sign-in` and verify the development role buttons are fully visible.
- [ ] **CSS & Styling Integration**: Verify all premium styles, custom fonts, HSL colors, gradients, and micro-animations render flawlessly.

---

## 2. Role Permissions & Security Scoping

- [ ] **Admin Authorization**: Sign in as `admin@dec.local`. Navigate to `/admin/config/lookups` and ensure access is permitted.
- [ ] **Creator Isolation**: Sign in as `creator@dec.local`. Navigate to `/admin` and confirm you are safely redirected or shown a **Forbidden** (`/forbidden`) error screen.
- [ ] **Reviewer Queue Isolation**: Sign in as `reviewer@dec.local`. Navigate to `/admin` and confirm access is denied. Confirm you can access `/review/queue`.
- [ ] **Learner Access Isolation**: Sign in as `learner@dec.local`. Navigate to `/studio` and confirm access is denied. Confirm you can access `/learn`.

---

## 3. Core Course Setup & Gate Logic

- [ ] **Course Creation**: Sign in as `creator@dec.local`, create a new course, and verify the course record saves successfully to the SQLite database.
- [ ] **Analysis Lock Gate**: Map geographic areas and routes, click **Lock Analysis Handover**, and confirm the gate locks correctly (allowing progression to Capacity Mapping).
- [ ] **Design Lock Gate**: Build storyboards, click **Lock Design Handover**, and confirm design fields become read-only.

---

## 4. Reviewer Approval & Blockers

- [ ] **Handover Checklist Parsing**: Open `/review/queue` as `reviewer@dec.local`. Verify that submitted course cards accurately display block counts and handover details.
- [ ] **Approval Blocker Enforcement**: Verify that a course with unready required tests cannot be approved and displays the precise **Decision Readiness Warning** banner.
- [ ] **Approval Action**: Verify that a complete, blocker-free course can be successfully approved, changing its status to `APPROVED`.

---

## 5. Admin-Only Publishing

- [ ] **Publisher Authorization**: Verify that only `admin@dec.local` has access to the publish action inside `/review/publishing`. Verify that `reviewer@dec.local` cannot publish the course.
- [ ] **Publication Status**: Publish an approved version, verify its status changes to `PUBLISHED`, and confirm any older version transitions to `REPLACED` in the database.

---

## 6. Learner Catalog & Certificate Validation

- [ ] **Catalog Visibility**: Sign in as `learner@dec.local`. Navigate to `/courses` and confirm that ONLY `PUBLISHED` active courses appear.
- [ ] **80% Certificate Basis**: Complete lessons, answer final test questions, and confirm:
  - Score **79%** or below: **FAILED** (no certificate issued).
  - Score **80%** or above: **PASSED** (completion certificate issued instantly).
- [ ] **No-Overclaim Notice**: Open the certificate details and confirm the governance disclaimer is rendered clearly.

---

## 7. Monitoring & Summaries Safety

- [ ] **Evidence Separability**: Navigate to `/review/monitoring` as `admin@dec.local`. Verify that learner progress, tests, certificates, and practical proof are listed as separate evidence dimensions.
- [ ] **Sensitive Data Masking**: Confirm that no raw practical proofs or learner-level sensitive information are visible in the dashboard summaries.
- [ ] **Organizational Transformation Disclaimer**: Confirm the warning notice is clearly visible at the top of monitoring pages.

---

## 8. Admin Dashboard Triage & Invitation Lifecycle

- [ ] **Operational Dashboard Queues**: Navigate to `/admin` as `admin@dec.local`. Verify the presence of specialized action-required queues (Pending Reviews, Flags, Access Issues) and confirm they link to their target functional views.
- [ ] **Learner Invitation Flow**: Create an invitation, verify the one-time copyable link appears once, and accept it as a learner to unlock course enrollment records.
- [ ] **Invitation Token Rotation**: Locate an existing invitation (active or expired). Rotate the token, enter a required governance reason, and confirm a new unique copyable URL is issued while resetting the record status to `CREATED`.
- [ ] **Direct Participant Assignment**: Navigate to `/admin/participant-access`. Assign a learner directly to a course, program, or cohort with required justification reason. Verify their runtime access is enabled instantly.

---

## 9. Staging Deployment Execution Reference

For detailed instructions on preparing, executing, and rolling back staging deployments, please refer to:
- **[Staging Deployment Execution Checklist](../deployment/STAGING_DEPLOYMENT_EXECUTION_CHECKLIST.md)**: Complete step-by-step technical deployment checklists.

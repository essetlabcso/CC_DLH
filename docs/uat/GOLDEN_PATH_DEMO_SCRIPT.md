# Staging Golden Path Walkthrough & Demo Script

This document provides a highly detailed, step-by-step walkthrough of the **"Safe Community Feedback Handling for Local CSOs"** course scenario. This golden path enables ESSET/DEC stakeholders to demo the complete learning lifecycle in less than 5 minutes.

---

## 1. Demo Overview & Scenario

This package pre-seeds **two variants** of the Golden Path course to allow comprehensive testing of both learner and reviewer features simultaneously:
- **Published Course**: `Safe Community Feedback Handling for Local CSOs` (Slug: `safe-community-feedback-handling`). Used to demo the Learner runtime, Final Quiz, Automated Certificates, and Admin Monitoring dashboards.
- **Submitted Review Candidate**: `Safe Community Feedback Handling for Local CSOs (Review Candidate)` (Slug: `safe-community-feedback-handling-review`). Used to demo the Reviewer Queue, handover checklist verification, and approval/decision gates.

- **Focus Capability Area**: `Monitoring, Evaluation, Accountability, and Learning` (MEAL)
- **Target Audience**: CSO project staff and MEAL managers.
- **Identified Gap**: CSO staff collect citizen feedback but lack secure processes to classify, redact, and escalate sensitive disclosures without exposing names.
- **K/S/M/E Intervention Route**: `Skill` (standardized safe documentation log).
- **Core Governance Rules**:
  - **80% Pass Score**: Required to automatically issue a digital certificate.
  - **No 90% Threshold**: Fully compliant with the DEC Learning Hub standard.
  - **Separate Practical Proof**: Optional work sample submission that does not block basic course completion.

---

## 2. Prerequisites & Demo Accounts

### Required Environment Flags
Ensure your staging environment or `.env` has these flags enabled:
```env
ENABLE_DEMO_LOGIN="true"
ENABLE_DEMO_SEED="true"
DATABASE_URL="file:./dev.db"
```

### Seeding the Golden Path (Reset-Style)
Running this command is **idempotent but reset-style** (it will delete and recreate the courses `safe-community-feedback-handling` and `safe-community-feedback-handling-review` to ensure a clean slate):
```bash
# On Windows PowerShell
$env:DATABASE_URL="file:./dev.db"; $env:ENABLE_DEMO_SEED="true"; npm run db:seed:golden-path

# On Linux/macOS
DATABASE_URL="file:./dev.db" ENABLE_DEMO_SEED="true" npm run db:seed:golden-path
```

### Tester Credentials (Pre-seeded Demo Accounts)
The seed command pre-creates these demo accounts under the standard `dec-local` organization:
- **Course Creator**: `creator@dec.local`
- **Reviewer**: `reviewer@dec.local`
- **DEC Admin**: `admin@dec.local`
- **Learner**: `learner@dec.local`

---

## 3. Step-by-Step Staging Walkthrough

### Step 1: Creator Dashboard & Reviewer Queue Inspection
1. Log in as **Course Creator** (`creator@dec.local`).
2. Navigate to `/studio`.
3. **Verify**: You can see the seeded course card titled **"Safe Community Feedback Handling for Local CSOs"** in `Published` status.
4. Log in as **Reviewer** (`reviewer@dec.local`).
5. Navigate to `/review/queue`.
6. **Verify**: You can see the submitted course version card for **"Safe Community Feedback Handling for Local CSOs (Review Candidate)"** in the queue.
7. Click on the course card to enter the **Review Detail** page.
8. **Verify**: The **Build-to-Review Handover Checklist** panel is visible showing pre-seeded metadata:
   - Capacity Area is set to **Monitoring, Evaluation, Accountability, and Learning**.
   - Blocking Warnings display as `[]` (empty, with **0 blockers**).
   - Final Test and Practical Proof are flagged as safely configured.
9. Scroll down to the **Reviewer Decision Form**.
10. Check all the required reviewer checkboxes (e.g., Runtime Preview Confirmed, Safeguarding Confirmed, etc.).
11. Enter at least 20 characters of decision notes in the text area (e.g., `"Review candidate successfully approved for publishing handover."`).
12. Click **Approve & Forward to Publishing**.
13. **Verify**:
    - The approval succeeds and the course version status transitions from `SUBMITTED` to `APPROVED` only.
    - The course is removed from the reviewer queue and is ready for publishing handover.

### Step 1.5: DEC Admin Publishing Handover
1. Log in as **DEC Admin** (`admin@dec.local`).
2. Navigate to `/review/publishing`.
3. **Verify**: The approved course version **"Safe Community Feedback Handling for Local CSOs (Review Candidate)"** appears in the publishing queue.
4. Click **Publish** to release the course version.
5. **Verify**: The course status transitions to `PUBLISHED`, making it available to learners in the Course Catalog.

### Step 2: Learner Catalog & Progression
1. Log in as **Learner** (`learner@dec.local`).
2. Navigate to `/courses`.
3. **Verify**: The published course **"Safe Community Feedback Handling for Local CSOs"** is listed in the catalog.
4. Click **Start Course** to enter the learning workstation at `/learn`.
5. Read through **Lesson 1** and **Lesson 2**, confirming the content explains safe handling and redaction tag standards.
6. Click **Complete Lesson** for each to build progress.

### Step 3: Final Test Attempt & Passing Certificates
1. Navigate to **Lesson 3: Final Knowledge & Skill Assessment**.
2. Select choice **B) Redact all names, unique locations, and organizational indicators using standardized [REDACTED] tags** (the correct answer).
3. Click **Submit Assessment**.
4. **Verify**:
   - The assessment passes instantly with a score of **100%** (meeting the **80%** threshold).
   - A congratulations screen appears with a direct link to view your **Automated Completion Certificate**.
   - Click the certificate link to verify the **No-Overclaim disclaimer** and certificate metadata.

### Step 4: Submitting Practical Proof
1. Go to the course details page as a **Learner**.
2. Scroll to the **Practical Proof** section.
3. **Verify**: A callout highlights that practical proof is optional and separate from your academic certificate.
4. Click **Submit Practical Proof**.
5. Copy/paste the following safe redacted log:
   ```text
   [REDACTED] at [REDACTED] reported that the distributed community feedback cards lacked local translation support. Action: Escalated to regional team.
   ```
6. Check the safety acknowledgment boxes and click **Submit**.
7. **Verify**: The submission registers successfully and remains `PRIVATE` by default.

### Step 5: Reviewing the Submitted Proof
1. Log in as **Reviewer** (`reviewer@dec.local`).
2. Navigate to `/review/queue` or click on proof moderation options.
3. **Verify**: The learner's redacted log sample appears clearly for review.
4. Click **Accept** or provide feedback notes.

### Step 6: Monitoring & Administrative Oversight
1. Log in as **DEC Admin** (`admin@dec.local`).
2. Navigate to `/review/monitoring`.
3. **Verify**: The admin monitoring dashboard shows:
   - Completion percentages and aggregate metrics for **"Safe Community Feedback Handling for Local CSOs"**.
   - Separate dimensions for **Certificates Issued** vs **Practical Proof Submissions**.
   - The required **Organizational Transformation Disclaimer** displayed at the top of the screen.
   - Zero exposure of the learner's raw proof text in public summaries.

---

## 4. Common Troubleshooting & FAQs

- **"PrismaClientInitializationError: Environment variable not found: DATABASE_URL"**
  - *Solution*: Set `$env:DATABASE_URL="file:./dev.db"` (PowerShell) or `export DATABASE_URL="file:./dev.db"` (Bash) before executing the seed command.
- **"403 Forbidden on dev-sign-in"**
  - *Solution*: Verify that `ENABLE_DEMO_LOGIN="true"` is declared in your active environment variables.
- **Where are the database files stored?**
  - *Location*: The SQLite database file resides at `/prisma/dev.db`.

---

## 5. Staging Walkthrough & UAT Support Package

To support your staging walkthroughs and user testing sessions, refer to the following auxiliary resources:
- **[Demo Facilitation Script](../demo/DEC_DEMO_FACILITATION_SCRIPT.md)**: A complete, step-by-step guide for ESSET presenters to facilitate live walkthroughs.
- **[UAT Feedback Form Template](./DEC_UAT_FEEDBACK_FORM_TEMPLATE.md)**: A structured feedback form to collect and log tester observations during UAT.
- **[Staging Limitations & Non-Production Notice](../demo/STAGING_LIMITATIONS_AND_NON_PRODUCTION_NOTE.md)**: A non-alarming notice detailing staging environment constraints (SQLite, mock login, synthetic data).

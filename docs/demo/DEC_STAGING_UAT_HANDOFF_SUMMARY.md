# DEC Learning Hub Course Creator Portal — Staging UAT Handoff Summary

Dear ESSET/DEC Stakeholders,

We are pleased to share the Staging User Acceptance Testing (UAT) Handoff Summary for the **DEC Learning Hub Course Creator Portal**. This document summarizes the system capabilities, configurations, and core safety safeguards prepared for your staging evaluation.

---

### 1. What is Ready for Staging UAT
The Course Creator Portal is fully scaffolded and **ready for structured staging demonstration and UAT**. This includes:
- **Foundational Lookups**: Geographic Ethiopian focus areas and capacity indicators.
- **Course Creator Studio**: Structured capacity mapping, diagnostics, storyboarding, and build gates.
- **Review Queue**: A dedicated panel displaying the automated Build-to-Review Handover Checklist with zero blockers.
- **Publishing Handoff**: Single-click approved course publication by DEC Admins.
- **Learner Workstation**: Access to lessons, interactive final tests, and automated academic certificates.
- **Monitoring Dashboards**: Clean, aggregated administrative summaries of certificates and practical proofs.

---

### 2. The Golden Path Demo Scenario
The pre-seeded scenario focuses on **"Safe Community Feedback Handling for Local CSOs"**:
- **The Published Course**: Allows immediate enrollment by learners, lesson completion, and certificate generation upon passing the final test with 100%.
- **The Submitted Review Candidate Course**: Appears instantly in the Review Queue. Reviewers can verify the pre-seeded **Build-to-Review Handover Checklist** (showing **0 blocking warnings**), approve the version, and forward it to publishing, where DEC Admins can immediately publish it to release the approved candidate.

---

### 3. Demo Roles & Pre-Seeded Accounts
To allow multi-role testing without manual configuration, the following accounts have been pre-seeded under the `dec-local` organization:
- **DEC Admin**: `admin@dec.local` (Manages lookups, publishes approved courses, and views monitoring dashboards)
- **Course Creator**: `creator@dec.local` (Creates courses, completes diagnostics, and designs storyboards)
- **Reviewer**: `reviewer@dec.local` (Inspects Build-to-Review handovers and approves submitted courses)
- **Learner**: `learner@dec.local` (Enrolls in published courses, completes lessons, passes tests, and receives certificates)

*All pre-seeded accounts can be accessed instantly from the mock Sign-In screen on staging.*

---

### 4. Prerequisites & Environment Flags
To deploy the portal successfully, verify the following prerequisites and environment settings:

#### System Prerequisites
- **Node.js**: `>=24.0.0`
- **npm**: `>=11.0.0`

#### Environment Configuration
```ini
ENABLE_DEMO_LOGIN="true"  # Enables quick-access mock role buttons on the Sign-In page
ENABLE_DEMO_SEED="true"   # Enables pre-seeding of the Golden Path courses and accounts
DATABASE_URL="file:./prisma/dev.db"  # Points to the local file-based SQLite database
```
> [!WARNING]
> **Staging Safety Rule**: Both `ENABLE_DEMO_LOGIN` and `ENABLE_DEMO_SEED` must be **disabled or unset** in any production environments.

---

### 5. Core Deployment Commands
The deployment engineer can configure and start the staging portal using these commands:
```bash
# 1. Install dependencies
npm install

# 2. Build the database client and apply SQLite file schemas
npm run db:setup:local

# 3. Seed administrative reference and lookup tables
npm run db:seed:admin-reference
```

#### Seed Golden Path Courses
Run the appropriate command below to load the Golden Path courses:

**Linux / macOS**:
```bash
ENABLE_DEMO_SEED=true npm run db:seed:golden-path
```

**Windows PowerShell**:
```powershell
$env:ENABLE_DEMO_SEED="true"; npm run db:seed:golden-path
```

```bash
# 4. Build and launch the production application server
npm run build
npm run start
```
> [!IMPORTANT]
> **Reset-Style Seeding Warning**: Re-running the Golden Path seed deletes and recreates the Golden Path demo records. Use it only when a clean reset is intended. Do not execute this script in environments where live tester progress or custom training data must be preserved.

---

### 6. Smoke Test Walkthrough Sequence
To verify a successful deployment, execute this 15-minute walkthrough:
1. **Admin configuration**: Sign in as `admin@dec.local`, open `/admin/config/lookups`, and verify regions are visible.
2. **Reviewer approval**: Sign in as `reviewer@dec.local`, open `/review/queue`, select the **Review Candidate** course, verify 0 blocking warnings on the Handover Checklist, and submit approval.
3. **Admin publishing**: Sign in as `admin@dec.local`, open `/review/publishing`, and click **Publish** on the approved course.
4. **Learner test & certificate**: Sign in as `learner@dec.local`, open `/courses`, enroll in the course, navigate to `/learn`, complete lessons, and pass the Final Test (Lesson 3) with **100% (Option B)** to view the certificate.
5. **Admin monitoring**: Sign in as `admin@dec.local`, open `/review/monitoring`, and confirm aggregate metrics render properly.

---

### 7. What DEC Testers Should Focus On
Testers should evaluate:
- The **strict separation of roles** (Course Creators cannot publish courses; only DEC Admins can).
- The **governed Build Studio** (it is not a blank canvas; courses must flow through diagnosis, mapping, and storyboarding).
- The **rigor of the final test** (learners scoring below 80% do not pass and do not receive certificates).
- The **clarity of the Handover Checklist** (prevents reviewers from approving courses with active blockers).

---

### 8. What Should NOT be Claimed as Production-Ready
The staging release has specific operational boundaries that must not be overclaimed to stakeholders:
- **File-Based SQLite Database**: Suitable only for small-scale testing. PostgreSQL is required for multi-organization production.
- **Mock Authentication**: Staging uses a simplified login bypass; production requires standard credential encryption and email verification.
- **Synthetic Data**: The courses, lessons, and questions are pre-seeded demo content only and do not represent final curricular guidelines.

---

### 9. Key Safety and Governance Rules
The portal operates under strict regulatory guidelines that must be preserved:
- **Strict 80% Certificate Rule**: Certificates are issued only for final test scores of 80% or higher. No 90% threshold exists.
- **Practical Proof Independence**: Completion certificates prove course completion. Practical proof submissions are optional, kept private by default, and measure field-level capability separately.
- **No Raw Proof Exposure**: Raw student practical proof texts are never exposed in administrative summaries, preserving student privacy.
- **No Automated AI Decisions**: AI remains strictly a drafting aid for Course Creators. AI is blocked from making any approval, publishing, certificate-issuing, or badge-awarding decisions.

---

### 10. Next Action
Deploy the Course Creator Portal to your designated staging host using the **[Staging Deployment Execution Checklist](./STAGING_DEPLOYMENT_EXECUTION_CHECKLIST.md)** and initiate the structured testing cycle using the **[User Acceptance Testing Script](../uat/DEC_Course_Creator_Portal_UAT_Script.md)**!

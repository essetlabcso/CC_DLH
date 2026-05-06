# User Acceptance Testing (UAT) Walkthrough Script

This script provides step-by-step instructions for ESSET and DEC testers to evaluate the full end-to-end course creation, review, publishing, and learner workflows in the DEC Learning Hub Course Creator Portal.

> [!TIP]
> To quickly demonstrate or test the platform without manually inputting all content fields, use the pre-seeded **UAT Golden Path** course. See the [Staging Golden Path Walkthrough Guide](./GOLDEN_PATH_DEMO_SCRIPT.md) for a streamlined 5-minute demo.

---

## Demo Role Credentials

To test different roles, use the dedicated development credentials provided below:

| Tester Role | Mock Account Email | Primary Workspaces |
|---|---|---|
| **DEC Admin** | `admin@dec.local` | `/admin`, `/review/publishing`, `/review/monitoring` |
| **Course Creator** | `creator@dec.local` | `/studio` |
| **Reviewer** | `reviewer@dec.local` | `/review/queue`, `/review/courses/...` |
| **Participant / Learner** | `learner@dec.local` | `/learn`, `/courses` |

---

## Stage A: Admin Reference Lookup Validation

1. **Sign in** as **DEC Admin**:
   - Access the sign-in page (`/sign-in`).
   - Enter `admin@dec.local` as the email (no password needed in staging).
2. **Navigate** to **Admin Configuration**:
   - Go to `/admin/config/lookups` or `/admin/reference-data`.
3. **Verify Reference Data**:
   - Confirm that the **Ethiopian regions** (Addis Ababa, Afar, Amhara, Tigray, Oromia, etc.) are visible in the **Geographic Focus Areas** category.
   - Confirm **K/S/M/E root-cause routing values** (Knowledge, Skill, Motivation, Environment, Mixed) are loaded under **K/S/M/E Routes**.
4. **Confirm 80% Rule Constraint**:
   - Verify that there is **no editable field** or lookup value that allows altering the 80% course certificate score pass threshold (as this is a binding platform rule).

---

## Stage B: Creator Course Authoring Workflow

1. **Sign in** as **Course Creator**:
   - Sign in using `creator@dec.local`.
2. **Create New Course**:
   - Navigate to **Studio** (`/studio`) and click **Create Course** (`/studio/courses/new`).
   - Enter course details: Title, Description, and select delivery formats. Mark **Certificate Intent** as `Yes`.
3. **Complete Diagnosis & Analysis**:
   - Go to **Diagnosis / Analysis** (`/studio/courses/[courseId]/diagnosis`).
   - Select a Geographic Focus Area (e.g., Amhara) and map the root-cause route to `Knowledge` or `Skill`.
   - Complete the **Analysis Handover** checklist and **Lock** it.
4. **Map Capacity Areas & Actions**:
   - Go to **Capacity Map** (`/studio/courses/[courseId]/capacity-map`) and **Action Map** (`/studio/courses/[courseId]/action-map`).
   - Select relevant CSO Capacity Taxonomy items, map indicators, and lock.
5. **Complete Storyboard**:
   - Go to **Storyboard / Design Handover** (`/studio/courses/[courseId]/storyboard`).
   - Fill in storyboard details and click **Lock Design Handover**.
6. **Author Lessons in Build Studio**:
   - Go to **Build Studio** (`/studio/courses/[courseId]/build`).
   - Add lessons, create governed blocks (e.g., Quiz, Reflection), and provide **purpose and justification** for any creator-added custom blocks.
7. **Preview and Submit for Review**:
   - Go to **Preview** (`/studio/courses/[courseId]/preview`) and complete a full dry-run of all lessons.
   - Go to **Creator Review** (`/studio/courses/[courseId]/creator-review`).
   - Complete the review checklist and click **Submit for Formal Review**.

---

## Stage C: Reviewer Queue & Approval Decision

> [!TIP]
> To skip Stage B (manual course creation), you can use the pre-seeded **"Safe Community Feedback Handling for Local CSOs (Review Candidate)"** course version which is already in `SUBMITTED` status and waiting in the reviewer queue.

1. **Sign in** as **Reviewer**:
   - Sign in using `reviewer@dec.local`.
2. **Open Review Queue**:
   - Navigate to `/review/queue` and observe the submitted course version cards showing the capacity areas, anchors, and block counts.
3. **Inspect Handover**:
   - Click on the course version card to open the **Submitted Version Detail** page (`/review/courses/[courseId]/versions/[versionId]`).
   - Verify that the pre-seeded **Build-to-Review Handover Checklist** displays correctly with **0 blocking warnings** (e.g. AI pending is 0, final test is ready).
   - Verify the detailed registers of anchors, indicators, quizzes, and justification texts.
4. **Test Return & Blockers Gate**:
   - Notice that if any required quiz is not ready, or a pending AI review is unresolved, a prominent **Decision Readiness Warning** block is displayed.
   - Confirm that trying to submit approval while blockers exist is prevented server-side.
   - Click **Return** to send the course back to the creator with feedback if adjustments are needed.
5. **Approve Handover**:
   - Once all checklist items are marked ready, click **Approve** to move the version status from `SUBMITTED` to `APPROVED`. Confirm that approval alone does not publish the course.

---

## Stage D: Admin Publishing Handoff

1. **Sign in** as **DEC Admin**:
   - Sign in using `admin@dec.local`.
2. **Navigate** to **Publishing**:
   - Go to the **Publishing Handoff** page (`/review/publishing`).
3. **Verify Separation of Roles**:
   - Confirm that only users with the **Admin** (or Publisher) role can see the **Publish** action button.
4. **Publish Course**:
   - Select the `APPROVED` course version and click **Publish**.
   - Verify the status transitions to `PUBLISHED` and any older version of the same course is automatically updated to `REPLACED`.

---

## Stage E: Learner Catalog & Certification

1. **Sign in** as **Learner**:
   - Sign in using `learner@dec.local`.
2. **Open Catalog**:
   - Navigate to the **Learner Catalog** (`/courses`). Verify that ONLY `PUBLISHED` active course versions appear in the list.
3. **Complete Lesson Runtime**:
   - Click on the published course and click **Enroll**.
   - Go to the lessons interface (`/learn/courses/[courseId]/lessons/[lessonId]`).
   - Read the content, complete the interactive blocks (quizzes, reflections) to log progress.
4. **Take Final Test (80% Rule)**:
   - Navigate to the Final Test screen.
   - **Scenario 1 (79% Fail)**: Answer questions to get a score of `79%` or below. Verify that you fail and **no certificate** is issued.
   - **Scenario 2 (80% Pass)**: Answer questions to get a score of `80%` or above. Verify that you pass successfully.
5. **View Certificate**:
   - Confirm that a course certificate is now issued dynamically and is accessible via `/learn/certificates`.
   - Verify the certificate has the prominent **Governance Notice**: *"It does not signify full organizational transformation. Practical proof and verified achievement pathways are separate from certification."*

---

## Stage F: Monitoring & Evidence Dashboard

1. **Sign in** as **DEC Admin**:
   - Sign in using `admin@dec.local`.
2. **Open Monitoring Dashboard**:
   - Go to `/review/monitoring` and click on the course to see `/review/monitoring/[courseId]/versions/[versionId]`.
3. **Verify Separate Evidence Types**:
   - Confirm that learner progress, final test attempts, certificates, and practical proof submissions are shown as separate, independent metrics.
4. **Verify Data Safety**:
   - Confirm that **no raw practical proof** or learner-level sensitive data is exposed in summaries.
   - Confirm the banner warning is clearly visible: *"Course completion certificates prove that a learner has passed the final test (80%+ score) and completed training. They do not prove full organizational transformation or performance change in the field."*

---

## Stage G: Staging Support Package & Testing Guidance

To support your testing process, refer to the following auxiliary resources:
- **[UAT Feedback Form Template](./DEC_UAT_FEEDBACK_FORM_TEMPLATE.md)**: Standardized form to submit bug reports and feature recommendations.
- **[Staging Limitations & Non-Production Notice](../demo/STAGING_LIMITATIONS_AND_NON_PRODUCTION_NOTE.md)**: Explains current staging-specific boundaries (synthetic data, local SQLite, mock login).

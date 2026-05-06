# DEC Demo Facilitation Script & Walkthrough Guide

This script is designed to help ESSET and DEC presenters run the live staging walkthrough smoothly and professionally, highlighting the platform's core governance gates and operational safeguards.

---

## 1. Walkthrough Metadata

- **Demo Purpose**: Demonstrate the end-to-end learning lifecycle, quality gates, and role separations of the DEC Learning Hub Course Creator Portal in under 15 minutes.
- **Recommended Audience**: DEC Commissioners, Ministry of Innovation and Technology (MInT) representatives, ESSET leadership, CSO capacity building leads, and staging/UAT testers.
- **Recommended Duration**: 15 Minutes (10 minutes live demo, 5 minutes Q&A).
- **Pre-Seeded Demo Accounts**:
  - **DEC Admin**: `admin@dec.local`
  - **Course Creator**: `creator@dec.local`
  - **Reviewer**: `reviewer@dec.local`
  - **Learner**: `learner@dec.local`

---

## 2. Opening Framing (First 2 Minutes)

**What to Say:**
> *"Welcome, colleagues. Today, we are demonstrating the staging release of the DEC Learning Hub Course Creator Portal. This platform is custom-built to support CSO capacity building in Ethiopia while enforcing strict administrative governance. 
> 
> As we walk through this live system, you will see a strict separation of roles: Course Creators can build and review courses, but they cannot approve or publish them. Professional Reviewers assess quality, and only authorized DEC Admins can publish courses to the catalog.
> 
> Throughout this demo, please note that we enforce a strict 80% passing threshold for certificates, and our practical proof pathways are kept completely separate from certificates to prevent overclaiming of field-level organizational change. Let's begin by signing in as a DEC Admin."*

---

## 3. Demo Sequence & Speaking Script

### Stage 1: DEC Admin Configuration & Taxonomy Lookups
- **Action**: Sign in as `admin@dec.local` and navigate to `/admin/config/lookups`.
- **Expected Screen Outcome**: Visible list of Ethiopian regions (Amhara, Tigray, Oromia, etc.) and lookup tables.
- **What to Say**:
  > *"We are signed in as a DEC Admin. Here, we manage the foundational taxonomy and lookup tables—such as Ethiopian geographic focus areas and capacity indicators. Notice that our core platform governance constraints, like the 80% final test score rule, are locked system-wide. Admins cannot relax these quality gates, ensuring that every certificate carries the same academic rigor."*
- **Transition Line**:
  > *"Now, let's step into the shoes of a Course Creator to see how courses are structured and governed."*

### Stage 2: Course Creator Studio & Quality Gates
- **Action**: Sign out, sign in as `creator@dec.local`, and navigate to `/studio`.
- **Expected Screen Outcome**: The `/studio` dashboard is visible with the pre-seeded course card **"Safe Community Feedback Handling for Local CSOs"** shown in `Published` status.
- **What to Say**:
  > *"We are now logged in as a Course Creator. In our Studio dashboard, we can see our pre-seeded Published course. Every course must complete a rigorous, multi-gate journey—from Initial Diagnosis, through Capacity Mapping, to Design Handover and Block-by-Block authoring. 
  > 
  > Note that we don't have a blank-canvas builder; the Build Studio is fully governed. Custom blocks added by creators require a specified purpose and justification to ensure content is tightly aligned with our capacity building objectives."*
- **Transition Line**:
  > *"Next, let's see how our professional Reviewers inspect course quality and verify build handovers."*

### Stage 3: Reviewer Queue Inspection & Checklist Handover
- **Action**: Sign out, sign in as `reviewer@dec.local`, and navigate to `/review/queue`. Click on the card for **"Safe Community Feedback Handling for Local CSOs (Review Candidate)"** to open the detail page.
- **Expected Screen Outcome**: The Submitted Version Detail page renders, showing the pre-seeded **Build-to-Review Handover Checklist** panel with **0 blocking warnings** and an active approval decision form.
- **What to Say**:
  > *"As a Reviewer, we enter our specialized Queue. Here, we see our submitted review-candidate course. Let's open the detail page. 
  > 
  > Notice the Build-to-Review Handover Checklist. This displays critical metadata generated automatically by the platform, confirming that all required blocks are present, the final test is fully configured, and there are zero pending AI-assisted block warnings. Because this course version is completely clean and has zero blockers, our approval form is fully active."*
- **Action**: Scroll to the approval form, check all checkboxes, enter `"Review candidate successfully approved for publishing handover."` (20+ characters), and click **Approve & Forward to Publishing**.
- **Expected Screen Outcome**: Successful redirection, removing the course from the reviewer queue.
- **What to Say**:
  > *"We check all the mandatory quality assurance boxes, provide our professional decision notes of at least 20 characters, and click Approve. The course status moves to APPROVED. Notice that approving a course does not publish it; the separation of review and publishing roles is strictly enforced."*
- **Transition Line**:
  > *"Let's sign back in as an Admin to complete the publishing handoff."*

### Stage 4: Admin Publishing Handoff
- **Action**: Sign out, sign in as `admin@dec.local`, and navigate to `/review/publishing`.
- **Expected Screen Outcome**: The approved review-candidate course appears in the publishing list.
- **Action**: Click **Publish** to release the approved version.
- **Expected Screen Outcome**: Successful status transition to `PUBLISHED`.
- **What to Say**:
  > *"We are signed back in as a DEC Admin in the Publishing dashboard. Only Admins can see this screen and click Publish. With one click, we release the approved course. It is now live, and any older versions of this course are automatically replaced in the database."*
- **Transition Line**:
  > *"Now, let's experience the platform from a Learner's perspective."*

### Stage 5: Learner Experience, Final Test & Certificates
- **Action**: Sign out, sign in as `learner@dec.local`, navigate to `/courses`, click on the Published course, and open the lesson workstation at `/learn`.
- **Expected Screen Outcome**: The lesson workstation renders with structured text blocks explaining safe feedback classification and redaction tags.
- **Action**: Proceed to the Final Test, select choice **B** (the correct redaction tag protocol), and submit the assessment.
- **Expected Screen Outcome**: "Congratulations" screen with a **100%** score and a clickable certificate link.
- **Action**: Click the certificate link to view the issued certificate.
- **Expected Screen Outcome**: The certificate page renders, highlighting the **Governance Notice**: *"It does not signify full organizational transformation. Practical proof and verified achievement pathways are separate from certification."*
- **What to Say**:
  > *"We are logged in as a Learner. We enroll in our newly published course. The learning workstation renders beautifully and loads our structured text blocks. We complete our lessons and take the Final Test. 
  > 
  > Notice that scoring below 80% would fail us, but answering correctly earns us a 100% score and issues our Automated Completion Certificate immediately. Notice the prominent Governance Notice on the certificate: it explicitly states that passing this test proves course completion, not full organizational transformation in the field. This keeps our certification claims honest and credible."*
- **Transition Line**:
  > *"To demonstrate field capability, learners can submit practical proof, which remains completely separate from academic certificates."*

### Stage 6: Optional Practical Proof & Separation of Evidence
- **Action**: Go back to the course details page, scroll to the **Practical Proof** section, click **Submit Practical Proof**, check all safety acknowledgments, copy-paste a redacted log sample, and submit.
- **Expected Screen Outcome**: Submission success. The practical proof remains private by default.
- **What to Say**:
  > *"Our practical proof pathway is optional and private by default. Learners submit real-world, safely redacted log samples as evidence of field capability. Reviewers can accept or provide feedback on these submissions, keeping practical proof independent from the certificate."*
- **Transition Line**:
  > *"Finally, let's look at how DEC Admins monitor performance and verify safety metrics."*

### Stage 7: Admin Monitoring Dashboard & Governance Disclaimers
- **Action**: Sign out, sign in as `admin@dec.local`, and navigate to `/review/monitoring`.
- **Expected Screen Outcome**: The dashboard displays separate metrics for course progress, certificates issued, and practical proofs submitted, with a prominent warning banner at the top.
- **What to Say**:
  > *"We are back as a DEC Admin inside our Monitoring dashboard. Notice that our aggregate metrics are cleanly separated: Certificates Issued vs. Practical Proof Submissions are shown as independent dimensions. 
  > 
  > Most importantly, look at the top of the dashboard: we display a prominent Organizational Transformation Disclaimer. This keeps DEC's internal reporting aligned with real capabilities. In addition, no raw, sensitive learner proof text is ever exposed in public summaries, preserving privacy."*

---

## 4. Closing Key Messages (1 Minute)

- **Separation of Roles**: Distinct boundaries between Creator, Reviewer, and Publisher prevent collusion and ensure strict quality control.
- **Rigorous Gates**: No course can skip diagnosis, mapping, or storyboarding steps.
- **Academic Integrity**: Enforces a strict 80% pass rule for certificates.
- **Separation of Proof**: Academic certificate is separate from practical proof.
- **No Production Overclaiming**: AI does not make decisions; it remains a creator aid. Staging uses mock auth and synthetic data only.

---

## 5. Walkthrough Contingency Backup Plan

If a specific live step fails or database state is reset, refer to these backup paths:
- **Database Seed Fails**: If the seed has not been run, run the recovery scripts immediately:
  ```powershell
  $env:DATABASE_URL="file:./prisma/dev.db"; $env:ENABLE_DEMO_SEED="true"; npm run db:seed:golden-path
  ```
- **Login fails or Redirect Loop**: Clear your browser's cookies and site data for `localhost:3000` and re-attempt signing in using the pre-seeded development email accounts directly.
- **Reviewer Approval Blocked**: If a custom course version has blockers, use the pre-seeded `"Safe Community Feedback Handling for Local CSOs (Review Candidate)"` course version which is guaranteed to have 0 blockers and is ready for immediate approval.

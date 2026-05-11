# Admin Next Packages

## Recommended Sequence

### 1. Admin Participant Access Overview, Read-Only First

| Item | Detail |
| --- | --- |
| Objective | Give Admin a safe read-only view of participant access across invitations, enrollments, program participants, cohort participants, organizations, courses, and statuses. |
| Why it matters | Admin needs to understand current access before adding more write actions. |
| Likely affected files/routes | New or existing Admin participant route, `src/lib/admin/*`, Prisma read selectors, no schema changes unless proven necessary. |
| Acceptance criteria | Shows safe participant/access rows; no raw proof; no final answers; no writes; filters by organization/program/cohort/course/status. |
| What not to change | Learner runtime enforcement, schema, invitations, certificates, proof, monitoring writes. |
| Risk level | Medium |
| Evidence pack | Confirm read-only selectors, safe fields only, no runtime behavior changes, tests and build. |

### 2. Direct Admin Assignment To Course/Program/Cohort

| Item | Detail |
| --- | --- |
| Objective | Allow Admin to create or reuse `LearnerEnrollment`, `ProgramParticipant`, and `CohortParticipant` records directly with required reason. |
| Why it matters | Not all member learner access should require invitation links. |
| Likely affected files/routes | Participant access route/actions, `src/lib/admin/*`, learner enrollment event helpers. |
| Acceptance criteria | Idempotent assignment; required reason; audit/event records; no duplicate active access. |
| What not to change | Public self-enrollment, invitation acceptance, certificate/proof rules. |
| Risk level | High |
| Evidence pack | Confirm access still comes from explicit enrollment/participant records and no hard deletes. |

### 3. Program/Cohort Participant Management Actions And Status Controls

| Item | Detail |
| --- | --- |
| Objective | Add participant status changes for program/cohort assignments, including suspend/reactivate/end where supported. |
| Why it matters | Cohort delivery needs operational control beyond read-only grouping. |
| Likely affected files/routes | `/admin/programs-cohorts`, program/cohort detail pages, admin helper tests. |
| Acceptance criteria | Reason-required status changes; audit/events; historical records preserved. |
| What not to change | Course runtime beyond status-driven access effects. |
| Risk level | High |
| Evidence pack | Confirm no deletion and no unsafe learner roster exposure. |

### 4. Super Admin / Platform Admin Authority Management

| Item | Detail |
| --- | --- |
| Objective | Let Super Admin-equivalent users create, approve, suspend, and remove scoped Platform Admin authority. |
| Why it matters | This is a binding Admin specification rule. |
| Likely affected files/routes | `/admin/admin-authority`, `/admin/users`, `src/lib/admin/admin-authority.ts`. |
| Acceptance criteria | Only Super Admin-equivalent users can modify Platform Admin authority; reason and audit required. |
| What not to change | Broad operational Platform Admin permissions unless planned. |
| Risk level | High |
| Evidence pack | Confirm Platform Admin cannot grant Platform Admin authority. |

### 5. Organization Focal-Person Safe Summary View

| Item | Detail |
| --- | --- |
| Objective | Provide CSO focal persons a safe organization-level view of participation, certificates, and verified achievements. |
| Why it matters | CSOs need useful summaries without exposing raw proof or sensitive learner details. |
| Likely affected files/routes | New org-facing route or scoped Admin route, permission helpers. |
| Acceptance criteria | Aggregate-safe summaries only; no raw proof; no final answers; scoped access enforced. |
| What not to change | Admin monitoring defaults or learner privacy rules. |
| Risk level | Medium |
| Evidence pack | Confirm scoped role enforcement and safe field selection. |

### 6. Facilitator/Cohort Lead Support View

| Item | Detail |
| --- | --- |
| Objective | Give facilitators or cohort leads safe cohort-level delivery support views. |
| Why it matters | Cohort delivery needs follow-up without surveillance-style monitoring. |
| Likely affected files/routes | New facilitator/cohort route, permission helpers, cohort participant selectors. |
| Acceptance criteria | Shows cohort progress summaries and support flags, not raw proof or final answers. |
| What not to change | Course scoring, certificate logic, proof review. |
| Risk level | Medium |
| Evidence pack | Confirm least-privilege scoped access. |

### 7. Proof Verifier Assignment Workspace

| Item | Detail |
| --- | --- |
| Objective | Assign proof verifiers to proof submissions or scopes. |
| Why it matters | Human proof verification is separate from Admin, certificate, and AI workflows. |
| Likely affected files/routes | `/admin/proof-badges`, `/review/proof`, scoped roles. |
| Acceptance criteria | Assigned verifier can review; raw proof access limited to authorized verifier/Admin; audit recorded. |
| What not to change | Certificate rule or proof/certificate separation. |
| Risk level | High |
| Evidence pack | Confirm raw proof privacy boundaries. |

### 8. Monitoring Improvements: Denominators, Trends, Safe Exports, Course Improvement Loop

| Item | Detail |
| --- | --- |
| Objective | Improve monitoring usefulness with aggregate denominators, trend views, safe exports, and improvement records. |
| Why it matters | DEC needs credible capacity evidence, not only counts. |
| Likely affected files/routes | `/admin/monitoring`, `src/lib/admin/monitoring.ts`, future improvement log helpers. |
| Acceptance criteria | Aggregate-only views; safe exports; no raw proof; no learner surveillance. |
| What not to change | Proof privacy or individual learner exposure. |
| Risk level | High |
| Evidence pack | Confirm aggregation and privacy constraints. |

### 9. Consent/Visibility Lifecycle Improvements

| Item | Detail |
| --- | --- |
| Objective | Add lifecycle controls for donor visibility consent, public badges, expiry, and revocation. |
| Why it matters | External visibility must stay safe and consent-based. |
| Likely affected files/routes | `/admin/data-safety`, proof/achievement helpers. |
| Acceptance criteria | Reason-required visibility changes; audit; no raw proof exposure. |
| What not to change | Certificate, proof review decision, or badge award logic unless scoped. |
| Risk level | Medium |
| Evidence pack | Confirm donor/public visibility uses safe summaries only. |

### 10. Admin QA/Demo Readiness Polish

| Item | Detail |
| --- | --- |
| Objective | Refresh smoke checklist, screenshots, copy, and walkthrough evidence after current merges. |
| Why it matters | Keeps demos reliable and transferable. |
| Likely affected files/routes | Docs and screenshots only unless copy fixes are approved. |
| Acceptance criteria | Current route screenshots, checklist, known caveats, and demo script. |
| What not to change | Runtime behavior or schema. |
| Risk level | Low |
| Evidence pack | Confirm docs/evidence scope only. |

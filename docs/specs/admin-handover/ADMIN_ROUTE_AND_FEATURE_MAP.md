# Admin Route And Feature Map

## Route Map

| Route | Purpose | Main user role | Current status | Key files | Known limitations |
| --- | --- | --- | --- | --- | --- |
| `/admin` | Admin Control Center, specialized triage queues, navigation summaries. | Super Admin-equivalent, Platform Admin | Complete | `src/app/(admin)/admin/page.tsx`, `src/lib/admin/dashboard.ts` | UI copy refreshed; maintain queue performance. |
| `/admin/users` | User and role overview; update membership roles with reason/audit. | Admin | Mostly complete | `src/app/(admin)/admin/users/page.tsx`, `src/app/(admin)/admin/users/actions.ts`, `src/lib/admin/users.ts` | No full account creation workflow; scoped role management remains limited. |
| `/admin/admin-authority` | Super Admin-equivalent and Platform Admin authority oversight and assignment panels. | Super Admin-equivalent, Platform Admin | Complete | `src/app/(admin)/admin/admin-authority/page.tsx`, `src/lib/admin/admin-authority.ts` | Completed in Package 4; audited platform admin roles. |
| `/admin/organizations` | Organization list, safe summaries, create entry point. | Admin | Complete | `src/app/(admin)/admin/organizations/page.tsx`, `src/lib/admin/organizations.ts` | Organization-level access summaries fully integrated. |
| `/admin/organizations/[organizationId]` | Organization detail, safe summaries, membership management. | Admin | Complete | `src/app/(admin)/admin/organizations/[organizationId]/page.tsx`, `src/app/(admin)/admin/organizations/MembershipManager.tsx`, `src/app/(admin)/admin/organizations/actions.ts` | CSO focal-person safe views fully integrated. |
| `/admin/programs-cohorts` | Program/cohort grouping overview. | Admin | Complete | `src/app/(admin)/admin/programs-cohorts/page.tsx`, `src/lib/admin/programs-cohorts.ts` | Participant status management and assignment active. |
| `/admin/programs-cohorts/programs/[programId]` | Program detail and participant organization summaries. | Admin | Complete | `src/app/(admin)/admin/programs-cohorts/programs/[programId]/page.tsx`, `src/lib/admin/programs-cohorts.ts` | Program participant management actions integrated. |
| `/admin/programs-cohorts/cohorts/[cohortId]` | Cohort detail and linked course summaries. | Admin | Complete | `src/app/(admin)/admin/programs-cohorts/cohorts/[cohortId]/page.tsx`, `src/lib/admin/programs-cohorts.ts` | Safe facilitator cohort oversight view active. |
| `/admin/participant-access` | Safe access overview and direct course/program/cohort assignment. | Admin | Complete | `src/app/(admin)/admin/participant-access/page.tsx`, `src/lib/admin/participant-access.ts` | Safe direct assignments with required reasons. |
| `/admin/learner-invitations` | Create one learner invitation, rotate tokens/resend, copy link once, cancel/revoke. | Admin | Complete | `src/app/(admin)/admin/learner-invitations/page.tsx`, `src/app/(admin)/admin/learner-invitations/actions.ts`, `src/lib/admin/learner-invitations.ts` | Token rotation and cancel/revoke lifecycle active. |
| `/admin/reference-data` | Browse and manage Admin lookup categories and values. | Admin | Complete | `src/app/(admin)/admin/reference-data/page.tsx`, `src/app/(admin)/admin/reference-data/actions.ts`, `src/lib/admin/reference-data.ts` | Fully lookup-driven categories and anchors. |
| `/admin/diagnosis-datasets` | Evidence source package browser and creation entry point. | Admin | Complete | `src/app/(admin)/admin/diagnosis-datasets/page.tsx`, `src/app/(admin)/admin/diagnosis-datasets/actions.ts`, `src/lib/admin/diagnosis.ts` | Draft, approve, archive, and release workflows active. |
| `/admin/diagnosis-records` | Validated capacity gap browser, filters, approval/release links. | Admin | Complete | `src/app/(admin)/admin/diagnosis-records/page.tsx`, `src/app/(admin)/admin/diagnosis-records/actions.ts`, `src/lib/admin/diagnosis.ts` | Return and reopen after release integrated. |
| `/admin/courses` | Course workflow oversight and publish readiness summary. | Admin | Complete | `src/app/(admin)/admin/courses/page.tsx`, `src/lib/admin/course-workflow-overview.ts` | Oversight only; no broad Admin override, by design. |
| `/review/queue` | Review queue for submitted course versions. | Reviewer, Admin | Complete | `src/app/(review)/review/queue/page.tsx`, `src/app/(review)/review/actions.ts`, `src/lib/review/queue.ts` | Reviewer assignment foundation integrated. |
| `/review/publishing` | Publish queue for approved course versions. | Platform Admin, Super Admin-equivalent | Mostly complete | `src/app/(review)/review/publishing/page.tsx`, `src/app/(review)/review/actions.ts`, `src/lib/review/publishing.ts` | Scheduling/pilot release controls remain deferred. |
| `/admin/certificates` | Certificate registry, revoke/reactivate with reason. | Admin | Complete | `src/app/(admin)/admin/certificates/page.tsx`, `src/app/(admin)/admin/certificates/actions.ts`, `src/lib/admin/certificates.ts` | Advanced registry filters and safe export active. |
| `/admin/proof-badges` | Safe aggregate overview of proof, achievements, badges, and visibility. | Admin | Complete | `src/app/(admin)/admin/proof-badges/page.tsx`, `src/lib/admin/proof-badges.ts` | Safe proof verifier assignment workspace integrated. |
| `/admin/data-safety` | Data safety queue for proof flags and external visibility. | Admin | Complete | `src/app/(admin)/admin/data-safety/page.tsx`, `src/app/(admin)/admin/data-safety/actions.ts`, `src/lib/admin/data-safety.ts` | Consent lifecycle and external visibility controls active. |
| `/admin/monitoring` | Aggregate monitoring and capacity evidence dashboard. | Admin, M&E role later | Complete | `src/app/(admin)/admin/monitoring/page.tsx`, `src/lib/admin/monitoring.ts` | Denominators, rates, trends, and signals active. |
| `/admin/audit-log` | Safe Admin audit log filters and summaries. | Admin | Mostly complete | `src/app/(admin)/admin/audit-log/page.tsx`, `src/lib/admin/audit-log.ts` | Raw before/after payloads intentionally hidden; future export may be needed. |
| `/invite/[token]` | Public invitation landing and acceptance flow. | Invited learner | Mostly complete | `src/app/invite/[token]/page.tsx`, `src/app/invite/[token]/actions.ts`, `src/lib/learner/invitation-acceptance.ts` | No email delivery; acceptance requires existing sign-in flow. |
| `/learn` | Learner dashboard for enrolled and available learning. | Learner/participant | Partial | `src/app/(learner)/learn/page.tsx`, `src/lib/learner/runtime-access.ts`, `src/lib/learner/access-loader.ts` | Program/cohort/private/pilot enforcement beyond current scope still needs care. |

## Connected Governance Notes

- Invitation access must produce or reuse `LearnerEnrollment` before course runtime access.
- Program/cohort-only invitations do not automatically unlock course runtime.
- Raw proof must remain private by default.
- Admin monitoring should stay aggregate unless a dedicated safe participant management page is designed.

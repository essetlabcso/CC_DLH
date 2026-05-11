# Admin Route And Feature Map

## Route Map

| Route | Purpose | Main user role | Current status | Key files | Known limitations |
| --- | --- | --- | --- | --- | --- |
| `/admin` | Admin Control Center, navigation, summary counts, governance reminders. | Super Admin-equivalent, Platform Admin | Mostly complete | `src/app/(admin)/admin/page.tsx`, `src/lib/admin/dashboard.ts` | Needs richer action-required queues and post-merge copy polish. |
| `/admin/users` | User and role overview; update membership roles with reason/audit. | Admin | Mostly complete | `src/app/(admin)/admin/users/page.tsx`, `src/app/(admin)/admin/users/actions.ts`, `src/lib/admin/users.ts` | No full account creation workflow; scoped role management remains limited. |
| `/admin/admin-authority` | Read-only Super Admin-equivalent and Platform Admin authority overview. | Super Admin-equivalent, Platform Admin | Partial | `src/app/(admin)/admin/admin-authority/page.tsx`, `src/lib/admin/admin-authority.ts` | No scoped Platform Admin create/approve/suspend/remove workflow yet. |
| `/admin/organizations` | Organization list, safe summaries, create entry point. | Admin | Mostly complete | `src/app/(admin)/admin/organizations/page.tsx`, `src/lib/admin/organizations.ts` | Needs stronger organization-level learner/access summaries. |
| `/admin/organizations/[organizationId]` | Organization detail, safe summaries, membership management. | Admin | Mostly complete | `src/app/(admin)/admin/organizations/[organizationId]/page.tsx`, `src/app/(admin)/admin/organizations/MembershipManager.tsx`, `src/app/(admin)/admin/organizations/actions.ts` | CSO focal-person view not implemented. |
| `/admin/programs-cohorts` | Program/cohort grouping overview. | Admin | Partial | `src/app/(admin)/admin/programs-cohorts/page.tsx`, `src/lib/admin/programs-cohorts.ts` | Read-only; no participant assignment or status management. |
| `/admin/programs-cohorts/programs/[programId]` | Program detail and participant organization summaries. | Admin | Partial | `src/app/(admin)/admin/programs-cohorts/programs/[programId]/page.tsx`, `src/lib/admin/programs-cohorts.ts` | No program participant management actions. |
| `/admin/programs-cohorts/cohorts/[cohortId]` | Cohort detail and linked course summaries. | Admin | Partial | `src/app/(admin)/admin/programs-cohorts/cohorts/[cohortId]/page.tsx`, `src/lib/admin/programs-cohorts.ts` | No cohort participant assignment, facilitator assignment, or schedule automation. |
| `/admin/learner-invitations` | Create one learner invitation, show one-time link, list invitation statuses, cancel/revoke. | Admin | Mostly complete | `src/app/(admin)/admin/learner-invitations/page.tsx`, `src/app/(admin)/admin/learner-invitations/actions.ts`, `src/lib/admin/learner-invitations.ts` | No email delivery, bulk invite, resend, edit, or advanced filtering. |
| `/admin/reference-data` | Browse and manage Admin lookup categories and values. | Admin | Mostly complete | `src/app/(admin)/admin/reference-data/page.tsx`, `src/app/(admin)/admin/reference-data/actions.ts`, `src/lib/admin/reference-data.ts` | Not all workflow dropdowns are guaranteed lookup-driven yet. |
| `/admin/diagnosis-datasets` | Evidence source package browser and creation entry point. | Admin | Mostly complete | `src/app/(admin)/admin/diagnosis-datasets/page.tsx`, `src/app/(admin)/admin/diagnosis-datasets/actions.ts`, `src/lib/admin/diagnosis.ts` | Reopen/versioned correction workflow is limited. |
| `/admin/diagnosis-records` | Validated capacity gap browser, filters, approval/release links. | Admin | Mostly complete | `src/app/(admin)/admin/diagnosis-records/page.tsx`, `src/app/(admin)/admin/diagnosis-records/actions.ts`, `src/lib/admin/diagnosis.ts` | Return/reopen after release is limited. |
| `/admin/courses` | Course workflow oversight and publish readiness summary. | Admin | Mostly complete | `src/app/(admin)/admin/courses/page.tsx`, `src/lib/admin/course-workflow-overview.ts` | Oversight only; no broad Admin override, by design. |
| `/review/queue` | Review queue for submitted course versions. | Reviewer, Admin | Mostly complete | `src/app/(review)/review/queue/page.tsx`, `src/app/(review)/review/actions.ts`, `src/lib/review/queue.ts` | Reviewer assignment and specialist routing can be expanded. |
| `/review/publishing` | Publish queue for approved course versions. | Platform Admin, Super Admin-equivalent | Mostly complete | `src/app/(review)/review/publishing/page.tsx`, `src/app/(review)/review/actions.ts`, `src/lib/review/publishing.ts` | Scheduling/pilot release controls are limited. |
| `/admin/certificates` | Certificate registry, revoke/reactivate with reason. | Admin | Mostly complete | `src/app/(admin)/admin/certificates/page.tsx`, `src/app/(admin)/admin/certificates/actions.ts`, `src/lib/admin/certificates.ts` | Advanced filters/export and certificate exception workflow deferred. |
| `/admin/proof-badges` | Safe aggregate overview of proof, achievements, badges, and visibility. | Admin | Partial | `src/app/(admin)/admin/proof-badges/page.tsx`, `src/lib/admin/proof-badges.ts` | Read-only; verifier assignment and badge configuration are not implemented. |
| `/admin/data-safety` | Data safety queue for proof flags and external visibility. | Admin | Mostly complete | `src/app/(admin)/admin/data-safety/page.tsx`, `src/app/(admin)/admin/data-safety/actions.ts`, `src/lib/admin/data-safety.ts` | Consent lifecycle and retention controls remain limited. |
| `/admin/monitoring` | Aggregate monitoring and capacity evidence dashboard. | Admin, M&E role later | Partial | `src/app/(admin)/admin/monitoring/page.tsx`, `src/lib/admin/monitoring.ts` | Needs denominators, trends, safe exports, and improvement loop. |
| `/admin/audit-log` | Safe Admin audit log filters and summaries. | Admin | Mostly complete | `src/app/(admin)/admin/audit-log/page.tsx`, `src/lib/admin/audit-log.ts` | Raw before/after payloads intentionally hidden; future export may be needed. |
| `/invite/[token]` | Public invitation landing and acceptance flow. | Invited learner | Mostly complete | `src/app/invite/[token]/page.tsx`, `src/app/invite/[token]/actions.ts`, `src/lib/learner/invitation-acceptance.ts` | No email delivery; acceptance requires existing sign-in flow. |
| `/learn` | Learner dashboard for enrolled and available learning. | Learner/participant | Partial | `src/app/(learner)/learn/page.tsx`, `src/lib/learner/runtime-access.ts`, `src/lib/learner/access-loader.ts` | Program/cohort/private/pilot enforcement beyond current scope still needs care. |

## Connected Governance Notes

- Invitation access must produce or reuse `LearnerEnrollment` before course runtime access.
- Program/cohort-only invitations do not automatically unlock course runtime.
- Raw proof must remain private by default.
- Admin monitoring should stay aggregate unless a dedicated safe participant management page is designed.


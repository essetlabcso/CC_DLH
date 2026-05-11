# Admin Smoke Test And Demo Checklist

## Repo Checks

Run from a clean `main` worktree:

```powershell
npm run lint
npm run typecheck
npm test
$env:DATABASE_URL='file:./admin-phase1-demo.db'; npm run build
git diff --check
```

Expected:

- Commands pass.
- Tracked files remain clean unless intentionally editing docs/code.
- `docs/demo-evidence/` may remain untracked if local screenshots are present.

## Admin Route Smoke Test

| Check | Expected result | Notes |
| --- | --- | --- |
| `/admin` loads | Admin Control Center appears. | Confirm governance reminders and navigation cards. |
| `/admin/users` loads | Users and role management appears. | Confirm role update requires reason. |
| `/admin/admin-authority` loads | Super Admin-equivalent and Platform Admin authority overview appears. | Read-only currently. |
| `/admin/organizations` loads | Organization list and summary appear. | Confirm safe organization summaries. |
| `/admin/programs-cohorts` loads | Program/cohort overview appears. | Read-only currently. |
| `/admin/reference-data` loads | Lookup category/value browser appears. | Confirm add/edit links exist. |
| `/admin/diagnosis-datasets` loads | Evidence source package browser appears. | Confirm draft/new entry point. |
| `/admin/diagnosis-records` loads | Validated capacity gap browser appears. | Confirm filters and release status. |
| `/admin/courses` loads | Course workflow oversight appears. | Confirm no Admin gate override. |
| `/review/queue` loads | Review queue appears. | Confirm Review remains separate from Publish. |
| `/review/publishing` loads | Publish queue appears. | Confirm publish buttons only for approved/ready versions and authorized Admin. |
| `/admin/certificates` loads | Certificate registry appears. | Confirm 80% rule language. |
| `/admin/proof-badges` loads | Proof/badge overview appears. | Confirm read-only aggregate behavior. |
| `/admin/data-safety` loads | Data safety queues appear. | Confirm no raw proof in Admin overview. |
| `/admin/monitoring` loads | Aggregate monitoring dashboard appears. | Confirm no learner rosters or raw proof. |
| `/admin/audit-log` loads | Audit log appears. | Confirm safe summaries and filters. |

## Invitation Lifecycle Smoke Test

| Check | Expected result |
| --- | --- |
| Admin can create learner invitation | A single invitation is created for a valid email, organization, optional program/cohort/course, and future expiry. |
| Raw invitation link is shown once | Link appears only immediately after creation. |
| Refreshing list hides raw link | Raw link is not shown again after refresh/navigation. |
| `tokenHash`/raw token not shown in list | Invitation list shows safe metadata only. |
| Learner can open `/invite/[token]` | Invitation landing appears with safe messaging. |
| Wrong signed-in email is blocked | Learner sees safe sign-in/account message. |
| Learner can accept valid invitation | Invitation becomes accepted for the invited user. |
| Course-scoped accepted invitation creates enrollment | `LearnerEnrollment` exists or is reused. |
| Program/cohort scoped accepted invitation creates participants where applicable | `ProgramParticipant`/`CohortParticipant` exist or are reused. |
| Program/cohort-only invitation does not unlock runtime automatically | Runtime access still requires explicit course enrollment. |
| Admin can cancel pending invitation | `CREATED`, `SENT`, or `PENDING_ACCEPTANCE` becomes `CANCELLED` with reason. |
| Cancelled invitation cannot be accepted | `/invite/[token]` blocks acceptance safely. |
| Admin can revoke accepted invitation | `ACCEPTED` becomes `REVOKED` with reason. |
| Revoked invitation suspends linked active access | Linked active enrollment/participants become `SUSPENDED` where supported. |
| Revoked invitation cannot be reused | `/invite/[token]` blocks acceptance safely. |
| Historical records are not deleted | Progress, attempts, certificates, proof, achievements, monitoring, and audit remain. |

## Binding Rule Smoke Test

| Binding rule | Expected result |
| --- | --- |
| 80% certificate rule | Certificate copy and final test behavior continue to use 80%+. |
| Practical proof separate from certificate | Proof/badge pages state proof is separate and certificate does not require proof. |
| Review and Publish separate | Review approval does not publish; publish happens only through publish flow. |
| Raw proof private by default | Admin dashboards and data safety overview do not show raw proof text. |
| Invitation access does not bypass enrollment | Runtime access comes from `LearnerEnrollment` and status. |
| No hard delete of learning/access history | Cancel/revoke/suspend actions preserve historical records. |

## Demo Notes

- Use the enriched local demo DB only when explicitly requested.
- Use normal viewport screenshots, not full-page screenshots, to avoid repeated-content artifacts.
- Keep demo language clear: this is local synthetic data, not live program data.

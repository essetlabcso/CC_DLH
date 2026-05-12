# Admin Remaining Gap Matrix

## Overall Estimates

| Scope | Current estimate |
| --- | --- |
| Overall Admin build | Around 80 percent complete, 20 percent remaining |
| Demo-ready Phase 1 Admin | Around 90 percent ready, 10 percent remaining |
| Mature production Admin | Around 65 to 70 percent complete, 30 to 35 percent remaining |

## Gap Matrix

| Area | Estimated completion | Current status | Remaining gaps | Recommended build task | Effort | Priority | Suggested package name |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| Admin dashboard/navigation | 95% | Complete | Action-required queues integrated; landing navigation card copy updated. | Maintain and audit performance metrics. | Low | Complete | Admin Action Required Dashboard |
| User and role management | 60% | Partial | No full scoped Platform Admin management; no full user invite/account lifecycle. | Add Super Admin Platform Admin authority management. | High | Phase 1 essential | Super Admin Authority Management |
| Organization management | 70% | Mostly complete | Missing CSO focal-person safe view and stronger organization-level access summary. | Add safe organization focal-person summary. | Medium | Phase 1 essential | Organization Focal Person Summary |
| Program/cohort/member learner management | 75% | Mostly complete | Full access overview and direct assignments implemented; missing status changes. | Add program/cohort participant status actions. | Medium | Phase 1 essential | Admin Participant Access Overview |
| Learner invitation lifecycle | 90% | Mostly complete | Token rotation and resend implemented; no bulk invite or email integration. | Add optional email delivery triggers. | Medium | Deferrable | Admin Invitation Resend Foundation |
| Reference data/lookups | 80% | Mostly complete | Some workflow values still appear code-defined or not clearly lookup-driven. | Audit and migrate high-value dropdowns to lookup use. | Medium | Phase 1 essential | Reference Data Integration Audit |
| Analysis/diagnosis approval/lock | 80% | Mostly complete | Limited reopen/return/versioned correction workflow after release. | Add controlled diagnosis reopen/return with reason. | Medium | Deferrable unless field corrections are needed | Diagnosis Reopen Controls |
| Review and publish controls | 75% | Mostly complete | Reviewer assignment, scheduling, pilot release, and specialist routing are limited. | Add reviewer assignment/readiness management. | High | Phase 1 essential | Review Assignment Foundation |
| Certificate administration | 75% | Mostly complete | Advanced filters/export/search and exception workflows deferred. | Add certificate filters/export if needed for demo or reporting. | Low | Deferrable | Certificate Registry Filters |
| Practical proof/badge/verifier admin | 50% | Partial | Proof/badge overview is read-only; no verifier assignment workspace. | Add proof verifier assignment and safe queue controls. | High | Phase 1 essential | Proof Verifier Assignment Workspace |
| Monitoring/M&E dashboards | 45% | Partial | Needs denominators, trends, safe exports, learner feedback, and improvement loop. | Add aggregate denominators and course improvement evidence. | High | Phase 1 essential | Monitoring Denominators And Trends |
| Data safety, consent, visibility, audit | 70% | Mostly complete | Consent lifecycle, retention rules, and visibility expiry are limited. | Add consent/visibility lifecycle controls. | Medium | Phase 1 essential | Consent Visibility Lifecycle |
| Admin QA/demo readiness | 95% | Complete | Refreshed smoke checklist, staging guides, and UI copy updates finished. | Run final demo smoke test loop. | Low | Complete | Admin Demo Readiness Polish |

## Main Phase 1 Gap

The strongest remaining Phase 1 gap is Platform Admin authority lifecycle and Organization-scoped summary views. The system can now manage participant access and invitations completely, but Super Admin does not yet have an audited workspace to approve or suspend scoped Platform Admin roles, and CSOs do not yet have a safe focal-person summary view.

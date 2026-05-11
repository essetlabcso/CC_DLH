# Admin Remaining Gap Matrix

## Overall Estimates

| Scope | Current estimate |
| --- | --- |
| Overall Admin build | Around 60 percent complete, 40 percent remaining |
| Demo-ready Phase 1 Admin | Around 70 percent ready, 30 percent remaining |
| Mature production Admin | Around 50 to 55 percent complete, 45 to 50 percent remaining |

## Gap Matrix

| Area | Estimated completion | Current status | Remaining gaps | Recommended build task | Effort | Priority | Suggested package name |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| Admin dashboard/navigation | 75% | Mostly complete | Needs richer action-required queues, better stale copy, and demo polish. | Add action-required dashboard cards from existing queues. | Medium | Phase 1 essential | Admin Action Required Dashboard |
| User and role management | 60% | Partial | No full scoped Platform Admin management; no full user invite/account lifecycle. | Add Super Admin Platform Admin authority management. | High | Phase 1 essential | Super Admin Authority Management |
| Organization management | 70% | Mostly complete | Missing CSO focal-person safe view and stronger organization-level access summary. | Add safe organization focal-person summary. | Medium | Phase 1 essential | Organization Focal Person Summary |
| Program/cohort/member learner management | 35% | Partial | Program/cohort pages are read-only; no direct participant assignment/status actions. | Add read-only participant access overview, then assignment. | High | Phase 1 essential | Admin Participant Access Overview |
| Learner invitation lifecycle | 75% | Mostly complete | No email, bulk invite, resend, edit, expiry admin job, or advanced filters. | Add resend/token rotation only after participant overview. | Medium | Deferrable | Admin Invitation Resend Foundation |
| Reference data/lookups | 80% | Mostly complete | Some workflow values still appear code-defined or not clearly lookup-driven. | Audit and migrate high-value dropdowns to lookup use. | Medium | Phase 1 essential | Reference Data Integration Audit |
| Analysis/diagnosis approval/lock | 80% | Mostly complete | Limited reopen/return/versioned correction workflow after release. | Add controlled diagnosis reopen/return with reason. | Medium | Deferrable unless field corrections are needed | Diagnosis Reopen Controls |
| Review and publish controls | 75% | Mostly complete | Reviewer assignment, scheduling, pilot release, and specialist routing are limited. | Add reviewer assignment/readiness management. | High | Phase 1 essential | Review Assignment Foundation |
| Certificate administration | 75% | Mostly complete | Advanced filters/export/search and exception workflows deferred. | Add certificate filters/export if needed for demo or reporting. | Low | Deferrable | Certificate Registry Filters |
| Practical proof/badge/verifier admin | 50% | Partial | Proof/badge overview is read-only; no verifier assignment workspace. | Add proof verifier assignment and safe queue controls. | High | Phase 1 essential | Proof Verifier Assignment Workspace |
| Monitoring/M&E dashboards | 45% | Partial | Needs denominators, trends, safe exports, learner feedback, and improvement loop. | Add aggregate denominators and course improvement evidence. | High | Phase 1 essential | Monitoring Denominators And Trends |
| Data safety, consent, visibility, audit | 70% | Mostly complete | Consent lifecycle, retention rules, and visibility expiry are limited. | Add consent/visibility lifecycle controls. | Medium | Phase 1 essential | Consent Visibility Lifecycle |
| Admin QA/demo readiness | 70% | Mostly complete | Needs refreshed smoke checklist, screenshot set, and minor copy fixes. | Run demo smoke test and prepare evidence refresh. | Low | Deferrable but useful before demos | Admin Demo Readiness Polish |

## Main Phase 1 Gap

The strongest remaining Phase 1 gap is operational participant/access management. The system can now create and accept invitations, but Admin does not yet have a complete workspace to see and manage participant access across invitations, enrollments, programs, cohorts, organizations, and courses.

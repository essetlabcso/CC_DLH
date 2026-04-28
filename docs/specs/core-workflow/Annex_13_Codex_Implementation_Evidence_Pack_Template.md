# Annex 13: Codex Implementation Evidence Pack Template
## DEC Learning Hub Course Creator Portal
## 1. Purpose of This Annex
This annex defines the **Codex Implementation Evidence Pack Template** for all implementation work on the DEC Learning Hub Course Creator Portal.

Its purpose is to make every Codex/GPT-5.5 implementation task reviewable, testable, and safe for a non-technical or semi-technical project lead to assess.

Codex can read and edit files, run commands such as tests, linters, and type checks, and provide evidence through terminal logs and test outputs; OpenAI also recommends clear repo guidance such as AGENTS.md and reliable testing setups for better Codex performance. ([OpenAI](https://openai.com/index/introducing-codex/))

The core rule is:

> Codex should never simply say “completed.” It should provide an evidence pack showing what changed, why it changed, how it was verified, what remains incomplete, and what the next safest step is.

# 2. When This Evidence Pack Is Required
Codex should provide this evidence pack after every implementation slice, especially when work affects:

- Analysis Gate;

- Design Handover;

- Build Studio;

- AI-assisted authoring;

- final test and certificate logic;

- practical proof, verified achievements, or badges;

- Review and Publish workflows;

- learner runtime;

- monitoring dashboards;

- role permissions;

- data safety and visibility;

- schema or migration changes;

- route structure;

- tests or build configuration.

For very small edits, Codex may provide a shortened version, but it should still include:

1.  what changed;

2.  files changed;

3.  verification performed;

4.  known gaps;

5.  next safe step.

# 3. Evidence Pack Summary Template
Codex should use the following structure after implementation.

\# Codex Implementation Evidence Pack

\## 1. Implementation Slice

\- Slice name:

\- Date:

\- Branch / working context:

\- Prompt/task summary:

\- Scope implemented:

\- Out of scope:

\## 2. Plain-Language Product Summary

Briefly explain what changed in user-facing terms.

\## 3. DEC Workflow Alignment

Explain how the change supports the DEC Learning Hub workflow:

Analysis → Design → Build → Review → Publish → Learner Runtime → Certificate → Practical Proof → Verified Achievement → Monitoring.

\## 4. Files Changed

\| File \| Change type \| Why changed \|

\|---\|---\|---\|

\| path/to/file \| added/modified/deleted \| reason \|

\## 5. Routes / Screens Affected

\| Route / screen \| Change made \| User role affected \|

\|---\|---\|---\|

\| /creator/... \| ... \| Creator/Admin/etc. \|

\## 6. Data / Schema / Migration Changes

\- Schema changes:

\- Migration files:

\- New fields:

\- Changed enums/statuses:

\- Data backfill needed:

\- Rollback considerations:

\## 7. Workflow State / Gate Changes

\- States added/changed:

\- Gate behavior changed:

\- Records created/updated:

\- Return paths affected:

\- Lock/unlock behavior affected:

\## 8. Role and Permission Changes

\| Role \| New/changed permission \| Expected behavior \|

\|---\|---\|---\|

\| Creator \| ... \| ... \|

\## 9. Binding Rule Checks

Confirm:

\- 80%+ final test score still triggers certificate:

\- Practical proof remains separate from certificate:

\- Review and Publish remain separate:

\- Build Studio remains governed, not blank-canvas:

\- Raw proof remains private by default:

\- AI outputs require human review:

\## 10. Tests and Verification

\| Check \| Command / method \| Result \|

\|---\|---\|---\|

\| Type check \| ... \| pass/fail \|

\| Lint \| ... \| pass/fail \|

\| Unit tests \| ... \| pass/fail \|

\| Playwright/E2E \| ... \| pass/fail \|

\| Build \| ... \| pass/fail \|

\| Manual route check \| ... \| pass/fail \|

\## 11. Manual Verification Steps for Human Reviewer

Step-by-step instructions for ESSET/DEC reviewer to confirm the work.

\## 12. Screenshots / URLs / Evidence

\- Local URL(s):

\- Screenshot path(s):

\- Terminal log summary:

\- Test output summary:

\## 13. Acceptance Criteria Results

\| Acceptance criterion \| Status \| Evidence \|

\|---\|---\|---\|

\| ... \| pass/fail/partial \| ... \|

\## 14. Known Gaps / Limitations

List what is not completed, intentionally deferred, or partially implemented.

\## 15. Risks / Decisions Needed

List anything requiring ESSET/DEC approval before proceeding.

\## 16. Next Smallest Safe Step

Recommend exactly one next implementation step.

# 4. Required Plain-Language Summary
Codex should begin each evidence pack with a short plain-language summary.

The summary should answer:

- What changed?

- Who benefits?

- What can the user now do?

- What workflow stage is stronger?

- What did not change?

Example:

\## Plain-Language Product Summary

This implementation adds the Analysis-to-Design Handover lock. A course creator can now complete the Analysis record, confirm the K/S/M/E route, and lock the handover before entering Design. Design remains blocked for Motivation-only or Environment-only gaps unless a separable Knowledge/Skill component is recorded. No Build Studio, certificate, proof, or Publish behavior was changed in this slice.

This helps non-technical reviewers understand the value before reading code details.

# 5. Required Binding Rule Checks
Every evidence pack should explicitly confirm whether binding rules were preserved.

Codex should include this checklist:

\## Binding Rule Checks

\- \[ \] 80%+ final test score still triggers course certificate.

\- \[ \] No 90% certificate threshold was introduced.

\- \[ \] Practical proof is not required for certificate.

\- \[ \] Practical proof / verified achievement / badge remains separate from certificate.

\- \[ \] Review and Publish remain separate.

\- \[ \] Course creators cannot publish by default unless they have publisher/admin role.

\- \[ \] Build Studio remains governed and does not become a blank-canvas builder.

\- \[ \] Creator-added blocks require purpose/linkage/justification where relevant.

\- \[ \] AI-assisted content requires human review.

\- \[ \] Raw practical proof is not donor-visible by default.

\- \[ \] Learner-facing screens do not show internal workflow metadata.

If any item is not applicable, Codex should write:

> Not applicable to this slice.

If any item fails, Codex should stop and identify the issue rather than present the work as complete.

# 6. Required Verification Evidence
Codex should provide proof that it verified the implementation.

OpenAI’s Codex documentation notes that Codex can run code and tests in its environment and provide verifiable evidence from terminal logs and test outputs; this evidence should be included or summarized after each implementation task. ([OpenAI](https://openai.com/index/introducing-codex/))

Recommended verification evidence:

| **Evidence type**               | **Required when**                                          |
|---------------------------------|------------------------------------------------------------|
| Type check                      | TypeScript or typed code was changed                       |
| Lint                            | UI/app code was changed                                    |
| Unit tests                      | Logic, utilities, permissions, scoring, or routing changed |
| Integration tests               | Workflow, data model, or API behavior changed              |
| Playwright/E2E tests            | User-facing route behavior changed                         |
| Build command                   | Significant app-wide change                                |
| Manual route smoke test         | Any route/page was changed                                 |
| Screenshot                      | UI was changed                                             |
| Migration verification          | Schema/database changed                                    |
| Permission test                 | Roles or visibility changed                                |
| 79% / 80% test                  | Final test/certificate logic changed                       |
| Donor/raw-proof visibility test | Proof/visibility logic changed                             |

Codex should not claim “tested” without naming the test or command.

# 7. Acceptance Criteria Result Table
Every implementation prompt should include acceptance criteria. The evidence pack should report whether each criterion passed.

Template:

\## Acceptance Criteria Results

\| Acceptance criterion \| Status \| Evidence \|

\|---\|---\|---\|

\| Given a Knowledge route Analysis is locked, Design unlocks. \| Pass \| Unit test \`analysis-gate.test.ts\`; manual route \`/creator/...\` \|

\| Given Environment-only route has no K/S component, Design remains blocked. \| Pass \| Unit test; screenshot \`analysis-blocked.png\` \|

\| Given a locked Analysis is shown in Design, it is read-only. \| Partial \| UI displays summary; edit prevention still needs test \|

Status values:

- Pass

- Partial

- Fail

- Not applicable

- Deferred with reason

# 8. Manual Verification Steps Template
Codex should include simple steps for a human reviewer.

Example:

\## Manual Verification Steps

1\. Start the local app.

2\. Sign in as Course Creator.

3\. Open \`/creator/courses/\[courseId\]/analysis\`.

4\. Select Knowledge as the route.

5\. Complete required Analysis fields.

6\. Click “Lock Analysis.”

7\. Confirm the course status becomes “Analysis locked.”

8\. Open Design.

9\. Confirm the Analysis summary appears read-only.

10\. Create another course with Environment route and no K/S component.

11\. Confirm Design remains blocked with a clear explanation.

Manual steps should avoid developer-only language where possible.

# 9. Screenshot / URL Evidence
If UI changes were made, Codex should provide:

- local route URL;

- screenshot path or attached screenshot;

- what the screenshot proves;

- role used to view it.

Template:

\## Screenshots / URLs

\| Evidence \| Path / URL \| What it proves \|

\|---\|---\|---\|

\| Analysis lock screen \| /creator/courses/demo/analysis \| Required fields and lock action visible \|

\| Design blocked screen \| /creator/courses/demo/design \| Design blocked for Environment-only route \|

\| Read-only Analysis summary \| /creator/courses/demo/design \| Locked Analysis appears in Design \|

Screenshots are especially important for non-technical review.

# 10. Data and Schema Change Reporting
If Codex changes data models, schema, migrations, seeds, or enums, it must report the change clearly.

Template:

\## Data / Schema / Migration Changes

\### New fields

\| Table/model \| Field \| Type \| Required? \| Purpose \|

\|---\|---\|---\|---\|---\|

\| courses \| analysisStatus \| enum \| yes \| Tracks Analysis gate status \|

\### New enum values

\| Enum \| Values \|

\|---\|---\|

\| AnalysisStatus \| in_progress, ready_to_lock, locked, returned \|

\### Migration files

\- \`supabase/migrations/...\`

\### Backfill needed

\- Existing courses default to \`analysisStatus = in_progress\`.

\### Rollback considerations

\- Revert migration and remove UI references to new field.

Codex should not make broad schema changes without explaining the downstream effects.

# 11. Workflow State / Gate Reporting
If workflow logic changes, Codex should report:

- state added;

- gate added;

- unlock rule;

- return path;

- record created;

- user roles affected.

Template:

\## Workflow State / Gate Changes

\| Workflow element \| Change \| Impact \|

\|---\|---\|---\|

\| Analysis Gate \| Added locked state \| Design cannot open until Analysis is locked \|

\| K/S/M/E route \| Added course-fit check \| Motivation/Environment route blocks Design without K/S component \|

\| Analysis-to-Design Handover \| Added record \| Design reads approved Analysis context \|

# 12. Role and Permission Evidence
If role or permission logic changes, Codex should provide behavior evidence.

Template:

\## Role and Permission Verification

\| Scenario \| Expected behavior \| Result \|

\|---\|---\|---\|

\| Creator opens Publish \| Publish button hidden/disabled \| Pass \|

\| Publisher opens approved course \| Publish action visible \| Pass \|

\| Donor user opens raw proof \| Raw proof not visible \| Pass \|

\| Learner opens course draft \| Access denied \| Pass \|

This is especially important for Review, Publish, proof visibility, and donor-safe summaries.

# 13. Certificate Rule Evidence
Any implementation touching final test, learner runtime, certificates, monitoring, or dashboards must include certificate evidence.

Required test cases:

\## Certificate Rule Evidence

\| Scenario \| Expected result \| Result \|

\|---\|---\|---\|

\| Learner scores 79% \| No certificate \| Pass/Fail \|

\| Learner scores exactly 80% \| Certificate issued \| Pass/Fail \|

\| Learner scores 80% without proof \| Certificate still issued \| Pass/Fail \|

\| Proof accepted after certificate \| Badge issued separately \| Pass/Fail \|

\| Dashboard certificate count \| Counts 80%+ certificates \| Pass/Fail \|

This protects the binding 80% rule.

# 14. Practical Proof / Badge Evidence
Any implementation touching proof, badges, organization recognition, or donor visibility must include proof evidence.

Required test cases:

\## Practical Proof and Badge Evidence

\| Scenario \| Expected result \| Result \|

\|---\|---\|---\|

\| Learner submits proof \| Proof status becomes Submitted \| Pass/Fail \|

\| Proof submitted \| Certificate status unchanged \| Pass/Fail \|

\| Verifier accepts proof \| Verified achievement created \| Pass/Fail \|

\| Verifier requests redaction \| No badge issued \| Pass/Fail \|

\| Donor opens organization summary \| Raw proof hidden \| Pass/Fail \|

\| Badge metric updates \| Badge count changes separately from certificate count \| Pass/Fail \|

# 15. AI Authoring Evidence
Any implementation touching AI-assisted authoring must include AI evidence.

Required test cases:

\## AI Authoring Evidence

\| Scenario \| Expected result \| Result \|

\|---\|---\|---\|

\| AI drafts block content \| Block status becomes Human review pending \| Pass/Fail \|

\| AI output accepted \| Status becomes Human accepted/edited \| Pass/Fail \|

\| AI output pending \| Review submission is blocked or flagged \| Pass/Fail \|

\| AI drafts high-risk content \| Specialist review flag appears \| Pass/Fail \|

\| Reviewer opens Build-to-Review Handover \| AI log visible \| Pass/Fail \|

Codex should confirm that AI cannot approve, publish, certify, verify proof, or award badges.

# 16. Monitoring Evidence
Any implementation touching monitoring or dashboards must include dashboard evidence.

Template:

\## Monitoring Evidence

\| Event/action \| Expected dashboard change \| Result \|

\|---\|---\|---\|

\| Learner starts course \| Started count increases \| Pass/Fail \|

\| Learner scores 80% \| Certificate count increases \| Pass/Fail \|

\| Learner submits proof \| Proof submitted count increases \| Pass/Fail \|

\| Verifier accepts proof \| Verified achievement count increases \| Pass/Fail \|

\| Course version changes \| Metrics remain version-aware \| Pass/Fail \|

Monitoring evidence should show that certificates, proof submissions, and badges are counted separately.

# 17. Known Gaps and Limitations
Codex must always include known gaps.

Good gap statement:

\## Known Gaps / Limitations

\- The Analysis Handover is now locked and visible in Design, but reviewer return-to-Analysis routing is not yet implemented.

\- Playwright coverage was added for Knowledge and Environment routes, but no visual regression tests were added.

\- Existing seed data has only one demo capacity area; broader taxonomy seeds remain future work.

Weak gap statement:

No gaps.

Codex should write “No known gaps” only if it is genuinely accurate.

# 18. Risks and Decisions Needed
Codex should identify anything that needs ESSET/DEC decision before the next step.

Examples:

\## Risks / Decisions Needed

\- Decision needed: Should Analysis locking be allowed by creators in Phase 1, or only by DEC Admin?

\- Risk: Existing demo data does not include organization IDs, so organization dashboard metrics are currently incomplete.

\- Risk: Proof upload storage rules need verification before enabling donor-safe summaries.

This prevents hidden assumptions.

# 19. Next Smallest Safe Step
Codex should end with exactly one recommended next step.

Example:

\## Next Smallest Safe Step

Proceed with Slice 2A: Design-to-Build Handover Alignment. This should add the Design Handover record, show locked Analysis context as read-only, and block Build until Design is approved.

Avoid broad next steps like:

> Implement the whole remaining workflow.

The recommendation should be narrow, safe, and testable.

# 20. Short Evidence Pack for Small Fixes
For very small fixes, Codex may use this shorter format.

\# Short Evidence Pack

\## Change made

...

\## Files changed

\- ...

\## Verification

\- Command/run:

\- Result:

\## Binding rules checked

\- 80% certificate rule unaffected:

\- Proof separate from certificate unaffected:

\- Review/Publish separation unaffected:

\## Known gaps

...

\## Next safe step

...

# 21. Evidence Pack Quality Checklist
A good evidence pack should be:

- specific;

- truthful;

- test-backed;

- role-aware;

- clear for non-technical review;

- honest about failures;

- clear about what was not done;

- tied to DEC workflow;

- tied to acceptance criteria;

- protective of binding rules.

It should not:

- exaggerate completion;

- hide failing tests;

- omit schema changes;

- omit role implications;

- say “done” without evidence;

- claim screenshots exist if not provided;

- claim tests passed if not run;

- present partial work as complete;

- ignore known conflicts.

# 22. Recommended Repo Placement
This annex should be saved as:

docs/specs/core-workflow/ANNEX_13_CODEX_IMPLEMENTATION_EVIDENCE_PACK_TEMPLATE.md

It should be referenced from:

docs/specs/core-workflow/00_CORE_WORKFLOW_INDEX.md

Suggested index entry:

\- ANNEX_13_CODEX_IMPLEMENTATION_EVIDENCE_PACK_TEMPLATE.md

Defines the required evidence pack format for Codex/GPT-5.5 implementation tasks, including changed files, routes, schema changes, workflow gates, role impacts, tests, screenshots, acceptance criteria results, known gaps, risks, and next safe step.

# 23. Success Standard for This Annex
This annex is successful when:

> Codex and developers provide implementation evidence that allows ESSET/DEC to confidently review what changed, verify whether the workflow behaves correctly, confirm that binding rules were preserved, identify unresolved gaps, and decide the next safe implementation step.

In practical terms, this annex should prevent:

> “Codex says the workflow is complete, but we do not know what files changed, what tests ran, whether 80% certificates still work, or whether Publish is still protected.”

And ensure:

> “Each implementation slice ends with a clear evidence pack showing changed files, tested behavior, screenshots or URLs, acceptance criteria results, known gaps, risks, and one next safe step.”

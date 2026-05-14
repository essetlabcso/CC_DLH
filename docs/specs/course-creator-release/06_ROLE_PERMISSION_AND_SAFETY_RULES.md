# 06 — Role, Permission, and Safety Rules

## 1. Purpose

This file defines role boundaries, permissions, safety rules, visibility rules, and data protection expectations for the Course Creator Portal MVP.

The core principle is:

> Creation, review, publication, learning, proof verification, and monitoring must be role-aware. A user should only see and perform actions appropriate to their role and assignment.

## 2. MVP roles

The MVP should support or simulate the following roles:

```text
Course Creator
Reviewer
Admin / Authorized Publisher
Practical Proof Verifier, if proof review is included
Learner / Participant, for runtime/monitoring linkage where needed
```

If the repo already has more granular roles, map these MVP responsibilities to the existing role structure.

## 3. Course Creator

### Can

- sign in to creator portal;
- view Creator Dashboard;
- create/open assigned courses;
- complete Course Setup;
- complete Analysis / Diagnosis;
- lock Analysis where allowed by MVP workflow;
- complete Capacity Map;
- complete Action Map;
- complete Learning Design;
- complete Storyboard;
- open Build Studio;
- edit required blocks;
- add creator-added blocks with justification;
- use AI draft assistance;
- configure Final Test;
- configure optional Practical Proof;
- preview learner experience;
- submit course for Review;
- revise returned courses;
- view monitoring for owned published courses.

### Cannot

- publish courses by default;
- approve own course for publication unless also assigned authorized role;
- bypass Analysis Gate;
- bypass Review Gate;
- bypass Publish Gate;
- change the 80% certificate threshold;
- verify practical proof unless assigned verifier role;
- award badges unless assigned verifier/admin role;
- expose raw proof externally;
- make donor-facing evidence visible by default.

## 4. Reviewer

### Can

- open submitted courses;
- review traceability from Analysis to Build;
- review block quality and alignment;
- review final test and answer keys;
- review 80% certificate rule setup;
- review practical proof setup;
- review AI/human review log;
- review accessibility/localization readiness;
- review safeguarding/data safety readiness;
- add linked comments;
- return to Build;
- return to Design;
- return to Analysis;
- approve for Publish.

### Cannot

- publish unless also assigned Authorized Publisher/Admin role;
- change certificate rule;
- verify proof unless also assigned Proof Verifier role;
- expose raw proof to unauthorized users;
- make donor-facing visibility decisions without consent/safe summary rules.

## 5. Admin / Authorized Publisher

### Can

- view courses approved for Publish;
- confirm publication metadata;
- confirm version;
- confirm visibility/access settings;
- publish approved course version;
- archive/retire course version if supported;
- view platform or course monitoring according to role;
- manage workflow exceptions with reason if supported;
- manage roles/reference data where current admin foundation allows.

### Cannot

- silently publish unreviewed course;
- bypass Review without recorded reason;
- expose raw proof to donors by default;
- change the binding 80% certificate rule without explicit DEC decision;
- treat practical proof as certificate requirement.

## 6. Practical Proof Verifier

If implemented in MVP or stubbed for future:

### Can

- view assigned proof submissions;
- review proof against rubric;
- request revision;
- accept proof;
- reject proof;
- award verified achievement/badge after acceptance;
- add safe review comments.

### Cannot

- issue course certificate;
- change final test score;
- expose raw proof externally;
- use AI as final proof verifier;
- publish donor-facing proof without consent/safe summary.

## 7. Review and Publish separation

Review and Publish must remain separate.

Correct behavior:

```text
Creator submits course
→ Reviewer reviews
→ Reviewer approves for publish or returns
→ Admin/Authorized Publisher publishes
→ Course becomes live
```

Incorrect behavior:

```text
Creator submits → course goes live
Reviewer approves → course automatically goes live
Course is published without review
```

## 8. Certificate and proof separation

Course certificate and Practical Proof / Verified Achievement are separate.

Correct rules:

```text
80%+ final test score → automated course certificate
Practical proof submission → proof review state only
Accepted practical proof → verified achievement / badge
```

Incorrect rules:

```text
Practical proof required for certificate
Badge required for certificate
90% threshold required for certificate
AI verifies proof
Certificate delayed until proof review
```

## 9. Raw proof visibility

Raw proof is private by default.

Raw proof may be visible only to:

- learner/participant who submitted it;
- assigned proof verifier;
- authorized DEC admin with legitimate need;
- possibly organization admin only if explicitly permitted and safe.

Raw proof must not be visible to:

- general course creators;
- general monitoring dashboard users;
- donors/partners;
- public users;
- unrelated organization users.

## 10. Safe summary visibility

Monitoring dashboards may show:

- proof submission count;
- proof review status count;
- verified achievement count;
- safe aggregated summary;
- capacity area summary;
- non-sensitive badge status.

Monitoring dashboards must not show:

- raw uploaded documents;
- beneficiary names;
- safeguarding case details;
- unredacted complaint logs;
- politically sensitive advocacy details;
- confidential donor contracts;
- personal staff records;
- identifiable vulnerable persons.

## 11. Consent and donor visibility

Donor-facing visibility is out of MVP unless safe consent logic is implemented.

If future donor-safe summaries are enabled, they must be:

- explicit;
- consent-based;
- summary-only;
- revocable where feasible;
- non-sensitive;
- clearly separated from raw proof.

## 12. AI safety boundaries

AI may assist with drafting and refinement.

AI must not:

- receive sensitive raw proof;
- invent capacity gaps;
- invent evidence;
- invent target learner groups;
- change K/S/M/E route;
- override course-fit decision;
- approve content;
- publish course;
- issue certificate;
- verify proof;
- award badge;
- decide visibility;
- provide legal advice;
- provide unsafe advocacy tactics;
- request sensitive beneficiary/protection data.

AI outputs must be:

- marked as AI-assisted;
- draft by default;
- human-reviewed before Review submission;
- listed in AI Drafting and Review Log.

## 13. K/S/M/E safety routing

Motivation-only and Environment-only gaps should be routed away from course production.

Potential support routes:

```text
coaching
mentoring
leadership engagement
technical assistance
systems strengthening
resource support
safeguarding review
peer learning
enabling-environment action
```

A course may proceed only if a separable Knowledge or Skill component is recorded.

## 14. Proof upload safety copy

Use safety copy such as:

> Upload only evidence needed to show your learning application. Do not upload beneficiary names, safeguarding case files, unredacted complaint logs, politically sensitive details, confidential donor contracts, or personal staff records. Use anonymized, redacted, or fictionalized examples where possible.

## 15. Monitoring safety rules

Monitoring must be useful but safe.

Allowed:

- aggregate enrollments;
- aggregate completions;
- final test pass rate;
- certificates issued;
- proof submission counts;
- verified achievements;
- learner feedback themes;
- improvement signals.

Not allowed in general dashboard:

- raw proof;
- individual sensitive proof;
- identifiable community details;
- sensitive learner comments;
- unsafe organization rankings;
- donor surveillance-style views.

## 16. MVP permission checks

```text
[ ] Course Creator can create/edit assigned course drafts.
[ ] Course Creator can submit for Review.
[ ] Course Creator cannot publish by default.
[ ] Reviewer can return/approve but not publish.
[ ] Admin/Publisher can publish only approved courses.
[ ] Certificate threshold is not editable by Creator.
[ ] Practical Proof does not block certificate.
[ ] Raw proof is hidden from general dashboards.
[ ] AI outputs require human review.
[ ] Review and Publish remain separate.
```

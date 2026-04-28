# Phase 1K Practical Proof and Verified Achievement Planning Run Report

Status label: Practical proof and verified achievement layer planned.

## Product Summary

This step clarified the recognition model before implementation. The course certificate remains automatic when the learner scores 80% or above on the Final Test. Practical proof, verified achievements, and badges are planned as a separate higher-evidence recognition layer for applied CSO capacity.

No learner, creator, reviewer, admin, database, or Supabase behavior was changed.

## Files Changed

- `docs/plans/phase-1k-practical-proof-verified-achievement-plan.md`
- `docs/run-reports/phase-1k-practical-proof-verified-achievement-planning.md`
- `docs/README.md`

## Schema and Migration Changes

No schema or migration changes were made.

## Routes Affected

No app routes were changed.

## Before and After Workflow Behavior

Before this planning step, the repo had certificates, Final Test scoring, monitoring, and evidence snapshots implemented, but no approved plan for practical proof and verified achievements.

After this planning step, the next recognition layer is sequenced safely:

1. Define practical proof requirements in Studio.
2. Add learner proof submission.
3. Add proof review decisions.
4. Issue verified achievements or badges from accepted proof.
5. Add aggregate monitoring and evidence snapshot signals.
6. Add admin governance where needed.

## Certificate Rule Confirmation

The controlling Phase 1 rule remains:

`80%+ Final Test score = course pass and automated course certificate.`

Practical proof is not required for certificate eligibility. Verified achievements and badges are separate from course certificates.

## Manual Reviewer URLs

No new URLs were added in this planning step.

Current relevant URLs remain:

- Learner certificates: `/learn/certificates`
- Public certificate verification: `/verify`
- Review monitoring: `/review/monitoring`
- Monitoring evidence snapshot: `/review/monitoring/snapshot`

## Checks Run

No app code changed, so typecheck, lint, tests, and build were not rerun for this planning-only documentation step.

Repository search confirmed the current app implementation and recent run reports already state the approved 80% certificate rule and keep proof/achievements separate.

## Known Gaps

- Practical proof requirements are not implemented yet.
- Learner proof submission is not implemented yet.
- Proof review queue and decision controls are not implemented yet.
- Verified achievements and badges are not implemented yet.
- Achievement monitoring is not implemented yet.

## Next Smallest Safe Step

Implement `Phase 1K.1: Proof Requirement Definition in Studio`, starting with a versioned proof requirement model and a Studio UI section that makes practical proof optional and separate from the course certificate.

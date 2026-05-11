# Admin Token Strategy Note

## Why Feature Implementation Is Paused

This handover pack intentionally pauses new feature implementation.

Reasons:

- Codex weekly capacity is low.
- Starting a major Admin feature now risks leaving unfinished work in the repo.
- The Admin module has just received several important learner access and invitation lifecycle merges.
- A documentation handover is safer than beginning a large participant management package without enough remaining execution room.
- The repo should remain clean, understandable, and transferable to another AI coding agent or future Codex session.

## Safe Continuation Strategy

The safest next step is not a broad rewrite. It is a small, plan-first package:

> Admin Participant Access Overview, read-only first.

This keeps the next agent focused on understanding access records before adding writes.

## Token And Invitation Safety Reminder

- Raw invitation tokens are generated server-side.
- Only `tokenHash` is stored.
- Raw invite links are shown only once after creation.
- Cancel/revoke actions must not expose `tokenHash` or raw token.
- Invitation acceptance must not bypass `LearnerEnrollment`.

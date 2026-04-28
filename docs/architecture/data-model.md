# Data Model Architecture

Status: Implemented architecture foundation

The database foundation uses Prisma with SQLite for local development. The current model supports the Phase 1 architecture needed before full product workflows are built.

## Core Boundaries

- `Organization`: tenant or operating boundary.
- `User`: platform account.
- `OrganizationMembership`: links a user to an organization.
- `MembershipRoleAssignment`: assigns learner, creator, reviewer, or admin roles in the membership context.
- `Course`: stable course identity owned by a creator.
- `CourseVersion`: version-aware draft/review/published lifecycle record.
- `CourseWorkflowStepRecord`: tracks the status of each creator workflow step.
- `CourseSetup`, `CourseDiagnosis`, `CourseCapacityMap`, `CourseActionMap`, `CourseStoryboard`: structured homes for the creator workflow.
- `CourseReviewRecord`, `CourseMonitoringRecord`, `CourseRevisionRecord`: structured homes for review, monitoring, and revision loop records.
- `CourseModule`, `CourseLesson`, `LessonBlock`: structured content primitives.
- `LearnerLessonProgress`: learner lesson start and completion tracking for published course access.
- `CourseLifecycleEvent`: audit trail for course version state movement.

## Lifecycle Discipline

Course versions move through explicit states:

`DRAFT -> CREATOR_REVIEW -> SUBMITTED -> APPROVED -> PUBLISHED`

Supported return, revision, replacement, and archive movement:

- `SUBMITTED -> RETURNED`
- `RETURNED -> DRAFT`
- `PUBLISHED -> REVISION_DRAFT`
- `REVISION_DRAFT -> SUBMITTED`
- `PUBLISHED -> REPLACED`
- governed states to `ARCHIVED` where configured

Direct `DRAFT -> PUBLISHED` movement is intentionally blocked by policy helpers.

## Workflow Spine

The Course Creator Studio workflow is represented in code and data in this order:

1. Course Setup
2. Diagnosis
3. Capacity Map
4. Action Map
5. Storyboard
6. Build
7. Preview
8. Creator Review
9. Monitoring
10. Revision

Build is considered locked until Course Setup, Diagnosis, Capacity Map, Action Map, and Storyboard are complete.

## Local Database

The development database URL is:

```env
DATABASE_URL="file:./dev.db"
```

Run:

```bash
npm run db:validate
npm run db:generate
npm run db:apply:local
```

Production/staging database provider and deployment migration command should be confirmed before release hardening.

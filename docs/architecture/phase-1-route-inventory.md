# Phase 1 Route Inventory

Status: Planned route structure, with current route boundaries implemented.

## Public and Auth

| URL | Purpose | Current status |
| --- | --- | --- |
| `/` | Public learner homepage | Implemented entry surface |
| `/courses` | Public course discovery | Shows published courses only |
| `/verify` | Public certificate verification | Implemented certificate ID lookup, active/revoked status, and status history |
| `/sign-in` | Learner sign in | Local development sign-in |
| `/staff` | Staff access | Local development staff access |

## Learner

| URL | Purpose | Current status |
| --- | --- | --- |
| `/learn` | Learner dashboard | Lists published courses and saved lesson progress |
| `/learn/courses/:courseId` | Learner course access | Implemented published-course overview, module list, completion status, final test taking, and 80%+ certificate eligibility |
| `/learn/courses/:courseId/lessons/:lessonId` | Course player | Implemented published lesson path with start and completion tracking, including final test choice display |
| `/learn/certificates` | Learner certificates | Implemented certificate eligibility and final test score record view |
| `/learn/certificates/:certificateNumber` | Learner printable certificate | Implemented protected certificate print/save page |

## Creator Studio

| URL | Purpose | Current status |
| --- | --- | --- |
| `/studio` | Course Creator Studio home | Shows workflow spine |
| `/studio/courses` | My Courses | Implemented creator-owned list with revision draft visibility |
| `/studio/courses/new` | Start course | Implemented start action page |
| `/studio/courses/:courseId/setup` | Course Setup | Implemented setup form |
| `/studio/courses/:courseId/diagnosis` | Diagnosis / Analysis Handover | Implemented evidence, course-fit, Analysis-to-Design Handover draft, and Lock Analysis for Design gate |
| `/studio/courses/:courseId/capacity-map` | Capacity Map | Implemented capacity domain form; blocked until Analysis Handover is locked and shows read-only Analysis summary |
| `/studio/courses/:courseId/action-map` | Action Map | Implemented action, scenario, essential information, and DIF form with read-only Analysis summary |
| `/studio/courses/:courseId/storyboard` | Storyboard / Design Handover | Implemented structured lesson plan, read-only Analysis summary, Design-to-Build Handover draft, and Lock Design for Build gate |
| `/studio/courses/:courseId/build` | Build Studio | Implemented Storyboard-fed module, lesson, governed block generation, left-side expandable block library, purpose-linked creator-added blocks, governed learner-content editing, governed block ordering, and final test authoring; blocked until Design Handover is locked |
| `/studio/courses/:courseId/preview` | Preview | Implemented learner-shaped preview after Build completion checks |
| `/studio/courses/:courseId/creator-review` | Creator Review | Implemented creator-side final quality checklist before new-course or revision submission |
| `/studio/courses/:courseId/monitoring` | Monitoring | Planned |
| `/studio/courses/:courseId/revision` | Revision | Planned |
| `/creator` | Legacy compatibility redirect | Redirects to `/studio` |

## Review and Publishing

| URL | Purpose | Current status |
| --- | --- | --- |
| `/review` | Review workspace | Implemented submitted, approved-for-publishing, published-course, final-test-attempt, and revision summaries |
| `/review/queue` | Review queue | Implemented submitted-course queue with new course and revision version labeling |
| `/review/publishing` | Publishing queue | Implemented approved-course publishing gate, revision replacement publishing, and recently published list |
| `/review/monitoring` | Published course monitoring | Implemented course-level learner progress, aggregate final test score signals, capacity-area filters, linked-standard filters, and capacity indicator grouping |
| `/review/monitoring/snapshot` | Monitoring evidence snapshot | Implemented printable aggregate evidence snapshot with optional capacity-area and linked-standard scope |
| `/review/revisions` | Revision queue | Implemented revision requests and controlled revision draft creation while published courses remain live |
| `/review/courses/:courseId/versions/:versionId` | Submitted version review | Implemented runtime preview, reviewer checklist, revision version labeling, return-for-changes comments, and approval path |

## Admin

| URL | Purpose | Current status |
| --- | --- | --- |
| `/admin` | Admin workspace | Product-ready empty state |
| `/admin/users` | User and membership management | Planned |
| `/admin/courses` | Course oversight | Planned |
| `/admin/certificates` | Certificate oversight | Implemented issued certificate list with learner, course, version, status, certificate ID, revocation controls, and status history |
| `/admin/system` | Operational health and logs | Planned |

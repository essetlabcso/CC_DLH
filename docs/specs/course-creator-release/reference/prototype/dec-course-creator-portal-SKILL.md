# SKILL.md — DEC Learning Hub Course Creator Portal

## Purpose

Use this skill to transform the DEC Learning Hub Course Creator Portal mockups into production-ready front-end implementation. The portal supports course creators through a governed, evidence-linked course production workflow from setup to monitoring.

The implementation must preserve the visual direction, workflow logic, and governance intent shown in the uploaded mockups and the accompanying `code.html` and `design.md` files.

## Product Context

The DEC Learning Hub Course Creator Portal is a premium institutional web app for Ethiopian CSO capacity-strengthening course development. It is not a generic LMS, not a free-form AI course generator, and not a loose content editor. It is a structured workflow system that helps course creators build courses from validated capacity evidence.

The portal guides creators through:

1. Dashboard
2. Course Setup
3. Analysis / Diagnosis
4. Capacity Map
5. Action Map
6. Learning Design Document
7. Storyboard & Block Plan
8. Build Studio Suite
9. Review
10. Publish
11. Monitoring

Each stage must communicate progress, governance, traceability, and readiness.

## Source Files

Expected working files:

- `code.html` — static HTML/CSS prototype generated from the mockups
- `design.md` — human-readable design specification
- `SKILL.md` — this reusable instruction file for coding agents
- Uploaded image mockups for reference only

If these files are placed temporarily in the repository, use a clear temporary location such as:

```text
/tmp/course-creator-portal-reference/
```

or, inside the repo:

```text
docs/temp/course-creator-portal-reference/
```

After extracting useful specifications and assets, remove unnecessary temporary files unless the project owner asks to keep them.

## Visual System

Use a clean, premium, institutional SaaS style.

### Brand Colors

- Primary blue: `#0B66D8` or DEC blue `#3B99D4` where already used
- Accent green: `#31A354` or DEC green `#91C852`
- Deep navy: `#071B3A`
- Page background: `#F8FAFC` / `#F9FAFB`
- Card background: `#FFFFFF`
- Text primary: `#111827`
- Text secondary: `#6B7280`
- Border: `#E5E7EB`
- Warning orange: `#F97316`
- Review purple: `#7C3AED` / `#8B5CF6`
- Critical red: `#EF4444`
- Success green: `#22C55E` / DEC green

### Layout Style

- Desktop-first 16:9 layout fidelity
- Fixed left sidebar
- Sticky or consistent top bar
- Clear workflow stepper across course creation screens
- White cards with subtle shadows
- Rounded corners, usually 12–20px
- Large readable typography
- Generous spacing
- Strong alignment and consistent grid logic
- Footer/partner logo strip retained where shown

### Logo and Partner Branding

Preserve DEC and partner logos exactly when assets are available.
Do not redraw, recolor, distort, crop, or invent partner logos.
If real assets are not available, use safe placeholders but keep layout spacing compatible with real logos.

## Global Navigation Requirements

### Top Bar

Include:

- DEC logo
- “DEC Learning Hub”
- “Course Creator Portal” subtitle
- Global search field
- Help icon
- Notification icon with badge
- User avatar/name, e.g. Hanna T.
- Profile dropdown affordance

### Sidebar

Core items:

- Dashboard
- My Courses
- Start New Course
- Monitoring
- Templates & Resources
- Help

Extended workflow screens may also show:

- Evidence Library
- Resource Bank
- Review Tasks
- Messages
- Alerts
- Help Center
- Settings

Keep the sidebar clean. The active item must be visually obvious.

## Workflow Rules

The portal must enforce a governed course creation sequence:

```text
Setup → Analysis → Capacity Map → Action Map → Design → Storyboard → Build → Review → Publish → Monitoring
```

### Gate Logic

- Course Setup starts the workflow but does not replace diagnosis.
- Analysis/Diagnosis must be validated and locked before Capacity Map proceeds.
- Capacity Map depends on locked Analysis.
- Action Map depends on completed Capacity Map.
- Learning Design depends on completed Action Map.
- Storyboard depends on approved Learning Design.
- Build Studio is prefilled from Storyboard.
- Creators submit to Review but cannot publish.
- Publish remains an admin-controlled action.
- Monitoring shows evidence and learning performance after publication.

### K/S/M/E Routing

Diagnosis uses Knowledge, Skill, Motivation, and Environment classification.

- Knowledge and Skill gaps may proceed to course production.
- Motivation and Environment gaps require separate support or complementary non-course routes.
- Mixed gaps must clearly identify which part is course-addressable.
- The UI must warn against creating courses for barriers mainly caused by missing tools, funding, leadership support, unsafe conditions, or operating environment constraints.

### Certificate Rule

Use one authoritative certificate rule:

```text
80%+ final test score = automated certificate
```

Practical proof is separate and optional. Verified achievement requires human review. Do not treat practical proof as required for certificate issuance unless explicitly configured in a future approved change.

## Screen Requirements

## 1. Dashboard

Purpose: give the creator an immediate view of active courses, required actions, returned comments, review status, and published course performance.

Must include:

- Welcome banner for the creator
- Quick actions: Start New Course, View My Courses
- KPI cards: active courses, submitted for review, returned for revision, published courses
- “Needs My Action” list with workflow stage, progress, next action, and Open Course button
- Recent Feedback / Returned Comments panel
- Published Course Monitoring Snapshot
- Published Courses at a Glance

UX intent: the creator should instantly know what needs attention.

## 2. Course Setup

Purpose: create the basic course shell before linking to diagnosis and design evidence.

Must include:

- Breadcrumb
- Course workflow stepper
- Course identity section
- Audience and delivery section
- Classification section
- Draft learning intent section
- Setup readiness checklist
- Course configuration toggles
- Access/certification logic panel
- Save Draft and Continue to Analysis actions

Important:

- Show the certificate rule as 80%+ final test score.
- Allow practical proof as optional.
- Treat setup fields as draft planning notes until validated downstream.

## 3. Analysis / Diagnosis

Purpose: confirm the capacity gap and course-fit decision before design begins.

Must include:

- Course summary strip
- Capacity gap and evidence section
- Baseline and desired practice section
- Root cause diagnosis with K/S/M/E options
- Course-fit decision cards
- Safeguards and evaluation anchor
- Analysis readiness checklist
- K/S/M/E routing guidance
- Warning against non-course barriers
- Analysis-to-Design handover lock panel
- Validate Analysis and Lock Analysis actions

Important:

- This is the evidence anchor for the whole course.
- The screen must make clear that courses start from diagnosis evidence, not ideas.

## 4. Capacity Map

Purpose: map the approved diagnosis to the DEC CSO capacity framework, sub-capacity, indicator, target learner group, and capacity objective.

Must include:

- Locked analysis summary
- CSO capacity classification
- Indicator / standard link
- Target learner group
- Capacity objective
- Course boundary statement
- Readiness checklist
- Traceability chain visualization
- Controlled taxonomy note
- Warning to avoid broad course topics

Important:

- Capacity taxonomy must be controlled by admin/reference data.
- Locked analysis information must appear read-only.

## 5. Action Map

Purpose: translate the capacity objective into observable learner actions, practice activities, minimum information, assessment links, and proof possibilities.

Must include:

- Capacity objective summary from Capacity Map
- Guiding question card
- Action Map table with columns for:
  - Observable learner action
  - Action type
  - Practice activity
  - Practice type
  - Minimum information
  - Assessment link
  - Proof possibilities
  - Proof suitability
  - Actions
- Add Action button
- Filters for action/practice/proof types
- Action Map guidance box

Important:

- Focus on observable performance change, not vague awareness topics.

## 6. Learning Design Document

Purpose: turn approved analysis, capacity map, and action map into a build-ready learning design.

Must include:

- Evidence Summary locked from previous steps
- Design readiness panel
- AI Authoring draft-only caution panel
- Learning objectives linked to actions
- Lesson pathway
- Assessment approach
- Accessibility and localization
- Safeguarding and data safety
- Evidence and MEAL alignment
- Human accountability warning
- Mark Design Complete & Lock action

Important:

- AI can support drafting but cannot replace human review and accountability.
- Learning design should be traceable to evidence and actions.

## 7. Storyboard & Block Plan

Purpose: transform the learning design into a structured block-by-block plan that can prefill Build Studio.

Must include:

- Approved learning design summary
- Lesson cards
- Storyboard and block plan table
- Block types such as Structure, Explain, Practice, Decide, Show, Apply, Reflect, Access
- Configure selected block panel
- Block type library preview
- Build Studio prefill preview
- Storyboard readiness checklist
- Generate Build Studio Draft action

Important:

- The storyboard is not free-form content; it is a structured plan for governed course build.

## 8. Build Studio Suite

Purpose: create, configure, and preview the actual course content using governed blocks.

Must include top suite tabs:

- Build Blocks
- Final Test
- Practical Proof
- Preview & Readiness

### Build Blocks

Must include:

- Block library and course outline
- Course canvas prefilled from storyboard
- Block configuration panel
- Import from Storyboard
- Version history
- Save all changes
- Block status legend
- Go to Preview & Readiness action

Block library examples:

- Text / Content
- Image
- Video
- Scenario
- Interactive Activity
- Discussion
- Case Example
- Job Aid / Resource
- Reflection
- Quiz / Formative Assessment
- Checklist
- Divider

Block configuration must support:

- Block title
- Block type
- Content editor
- Media/attachments
- Block settings
- Linked actions
- Linked objectives
- Assessment/proof link
- Advanced optional settings

### Final Test

Must support final assessment configuration aligned to the 80% certificate rule.

### Practical Proof

Must support optional evidence submission and human verification for verified achievement badges.

### Preview & Readiness

Must support learner preview, accessibility checks, readiness checks, and review submission preparation.

## Implementation Guidance

### Recommended Component Structure

Suggested React/Next.js component breakdown:

```text
components/course-creator/
  CreatorShell.tsx
  CreatorTopBar.tsx
  CreatorSidebar.tsx
  WorkflowStepper.tsx
  PartnerLogoStrip.tsx
  StatusBadge.tsx
  ReadinessChecklist.tsx
  EvidenceSummaryCard.tsx
  LockedSourcePanel.tsx
  CourseDashboard.tsx
  CourseSetupForm.tsx
  AnalysisDiagnosisForm.tsx
  CapacityMapForm.tsx
  ActionMapTable.tsx
  LearningDesignDocument.tsx
  StoryboardBlockPlan.tsx
  BuildStudioSuite.tsx
  BuildBlockCanvas.tsx
  BlockLibrary.tsx
  BlockConfigurationPanel.tsx
```

Suggested routes:

```text
/course-creator
/course-creator/courses
/course-creator/courses/new/setup
/course-creator/courses/[courseId]/analysis
/course-creator/courses/[courseId]/capacity-map
/course-creator/courses/[courseId]/action-map
/course-creator/courses/[courseId]/design
/course-creator/courses/[courseId]/storyboard
/course-creator/courses/[courseId]/build
/course-creator/courses/[courseId]/review
/course-creator/courses/[courseId]/monitoring
```

Adapt route names to the existing repo conventions instead of forcing these exact paths.

## Data and State Expectations

Represent at minimum:

- Course
- Course version
- Creator
- Diagnosis record
- Capacity map
- Action map item
- Learning design document
- Storyboard block
- Build block
- Assessment item
- Practical proof configuration
- Review submission
- Review comment
- Publication status
- Monitoring summary

State examples:

```text
Draft
Setup
Analysis in Progress
Analysis Locked
Capacity Map in Progress
Design in Progress
Storyboard Complete
Build in Progress
Submitted for Review
Returned
Approved for Publish
Published
Archived
```

## Accessibility Requirements

- Use semantic HTML.
- Use visible focus states.
- Ensure keyboard navigation for forms, tabs, tables, and block actions.
- Use accessible labels for icons and buttons.
- Do not rely on color alone for status.
- Maintain strong text contrast.
- Support responsive scaling even if the mockups are desktop-first.

## Responsive Behavior

Desktop is the priority, but the UI should degrade gracefully:

- Sidebar may collapse on smaller screens.
- Tables should scroll horizontally when necessary.
- Right-side panels may stack below main content.
- Workflow stepper may become horizontally scrollable.
- Cards should stack cleanly.

## Coding Standards

- Keep implementation deterministic and repo-aware.
- Reuse existing project components where possible.
- Do not introduce large dependencies unless clearly justified.
- Avoid hard-coded business rules when existing constants or reference-data patterns exist.
- Do not change schema unless required and documented.
- Preserve existing auth, role, permission, and workflow guard logic.
- Keep visual changes scoped to course creator portal surfaces unless asked otherwise.

## Acceptance Criteria

A successful implementation should satisfy the following:

- Course creator portal visually matches the uploaded mockup direction.
- All major screens are represented or mapped to existing routes.
- Global top bar and sidebar are consistent across screens.
- Workflow stepper clearly shows completed, active, locked, and future states.
- Analysis must precede Capacity Map.
- Locked evidence appears read-only downstream.
- K/S/M/E routing is visible and respected.
- Motivation/Environment barriers are not treated as automatic course-build inputs.
- Certificate rule is consistently shown as 80%+ final test score.
- Practical proof remains optional and separate from certificate logic.
- Creators can submit to review but cannot publish.
- Build Studio is structured around blocks, not a free canvas.
- Storyboard can prefill Build Studio.
- Monitoring shows safe summaries, not raw sensitive proof.
- UI remains clean, premium, readable, and not overcrowded.

## Verification Steps

After implementation, run available checks such as:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If commands differ in the repo, use the repo’s actual package scripts.

Manual verification:

1. Open the course creator dashboard.
2. Confirm sidebar, top bar, and branding consistency.
3. Start a new course and complete setup draft fields.
4. Continue to Analysis and confirm the gate sequence.
5. Validate and lock Analysis.
6. Confirm locked analysis is read-only in Capacity Map.
7. Complete Capacity Map and continue to Action Map.
8. Add or review learner actions.
9. Review Learning Design traceability.
10. Generate or review Storyboard block plan.
11. Open Build Studio and confirm prefilled blocks.
12. Confirm Final Test, Practical Proof, and Preview tabs are present.
13. Confirm creator cannot publish directly.
14. Confirm certificate threshold displays 80%+.
15. Confirm sensitive proof data is not exposed in summary views.

## Evidence Pack Required From Coding Agent

When completing work, provide an evidence pack with:

1. Plain-language summary of what changed
2. Files changed
3. Routes/screens affected
4. Components added or updated
5. Data/schema changes, if any
6. Role/permission changes, if any
7. Workflow/gate changes
8. Binding rule checks
9. Tests/checks run
10. Manual verification steps completed
11. Known gaps
12. Risks or decisions
13. Next smallest safe step

## Do Not Do

- Do not make the portal a generic LMS dashboard.
- Do not remove the evidence-first workflow.
- Do not let creators publish courses directly.
- Do not replace governed workflow with free-form AI generation.
- Do not expose raw practical proof or sensitive learner evidence in monitoring summaries.
- Do not change the certificate threshold away from 80%+.
- Do not treat Motivation or Environment barriers as automatically course-ready.
- Do not distort logos or partner branding.
- Do not overcrowd screens with every possible admin or learner function.

## Core Design Principle

Every screen should help the course creator answer one question:

```text
What evidence do I have, what learning change am I designing for, and what must I complete next before this course can safely move forward?
```

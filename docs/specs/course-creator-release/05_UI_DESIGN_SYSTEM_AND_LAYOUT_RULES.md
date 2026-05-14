# 05 — UI Design System and Layout Rules

## 1. Purpose

This file defines the Course Creator Portal visual and interaction rules for MVP implementation.

The UI must be clean, premium, workflow-first, low-clutter, role-aware, and evidence-linked.

The user should always know:

```text
Where am I?
What is the course status?
What is locked?
What must I complete next?
What is blocking progress?
What will be reviewed?
```

## 2. Visual identity

Use a professional institutional SaaS style for Ethiopian CSO capacity strengthening.

The UI should feel:

- calm;
- trustworthy;
- structured;
- practical;
- modern;
- not generic corporate LMS;
- not cluttered;
- not decorative without workflow function.

## 3. Color system

Recommended tokens:

| Token | Value | Use |
|---|---:|---|
| Primary Blue | `#0B66D8` or DEC blue `#3B99D4` | Primary buttons, active nav, progress |
| Accent Green | `#31A354` or DEC green `#91C852` | Success, completion, positive states |
| Deep Navy | `#071B3A` | Main headings |
| Page Background | `#F8FAFC` / `#F9FAFB` | Main app background |
| Card Background | `#FFFFFF` | Cards and panels |
| Text Primary | `#111827` | Main text |
| Text Secondary | `#6B7280` | Helper text |
| Border | `#E5E7EB` | Card/input borders |
| Warning Orange | `#F97316` | Warnings and blocked states |
| Review Purple | `#7C3AED` / `#8B5CF6` | Review, returned, AI/revision states |
| Critical Red | `#EF4444` | Critical errors |
| Success Green | `#22C55E` / DEC green | Completed/validated states |

## 4. Typography

Use the repo’s current typography system where possible. If implementing new styles, use:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Recommended hierarchy:

- Page title: 28–32px, bold.
- Section title: 18–20px, semibold/bold.
- Card title: 15–17px, semibold.
- Body text: 14–16px.
- Helper text: 12–13px.
- Status labels: 11–13px, semibold.

## 5. Global app shell

Every creator screen should use a consistent shell.

### 5.1 Top app bar

Required elements:

- DEC logo / product mark area;
- product name: DEC Learning Hub;
- portal label: Course Creator Portal;
- global search field;
- help icon;
- notification icon with badge;
- user avatar/name;
- optional course status pill on course-specific screens.

### 5.2 Left sidebar

Core items:

```text
Dashboard
My Courses
Start New Course
Monitoring
Templates & Resources
Help
```

Extended workflow screens may show:

```text
Evidence Library
Resource Bank
Review Tasks
Messages
Alerts
Help Center
Settings
```

Rules:

- active item must be visually obvious;
- sidebar must not become overcrowded;
- use grouping if many items exist;
- keep course workflow navigation separate from global navigation.

### 5.3 Workflow stepper

Course workflow screens should show a horizontal or compact workflow stepper:

```text
Setup
Analysis
Capacity Map
Action Map
Design
Storyboard
Build
Preview
Review
Publish
Monitoring
```

The stepper must show:

- current step;
- completed steps;
- locked steps;
- blocked steps;
- returned step if applicable.

## 6. Page layout pattern

Recommended page layout:

```text
Top app bar
Left sidebar
Main content area
  Breadcrumb
  Page title + status
  Course summary / locked evidence summary
  Workflow stepper
  Main card/grid
  Right guidance/readiness panel where useful
  Primary next action
```

## 7. Cards and panels

Use cards for grouped information.

Card style:

- white background;
- subtle border;
- soft shadow;
- rounded corners, 12–20px;
- generous padding;
- clear title;
- concise helper text;
- avoid dense wall-of-text.

Recommended card types:

```text
Course card
Locked evidence summary card
Readiness checklist card
Warning card
Review comment card
Metric/KPI card
Traceability card
Block card
Configuration card
```

## 8. Status pills

Use consistent status pills.

Required statuses:

```text
Draft
In Progress
Ready to Lock
Locked
Validated
Blocked
Needs Action
Submitted for Review
Returned
Approved for Publish
Published
Monitoring Active
```

Suggested color logic:

- Draft / In Progress: neutral/blue.
- Locked / Validated / Published: green.
- Submitted / Review: purple.
- Returned / Needs Action: orange.
- Blocked / Critical: red.
- Monitoring Active: blue/green.

Do not rely only on color. Include text labels.

## 9. Forms

Form rules:

- group related fields in cards;
- use clear labels;
- include helper text for complex concepts;
- show required fields;
- show validation messages near the field;
- avoid long unbroken forms;
- use progressive disclosure for advanced settings;
- use dropdowns for controlled taxonomy/reference data;
- use text areas for reasoning fields such as safeguards, baseline, desired practice, and course boundary.

## 10. Tables

Tables should be readable and action-oriented.

Use tables for:

- course list;
- action map;
- storyboard block list;
- review comments;
- final test questions;
- monitoring breakdowns.

Table rules:

- show only necessary columns;
- use status chips;
- keep actions obvious;
- avoid very wide tables where possible;
- allow cards or stacked rows if responsive layout requires it.

## 11. Readiness panels

Readiness panels must show what is complete and what is blocking progress.

Examples:

```text
Setup readiness
Analysis lock readiness
Design lock readiness
Build-to-Review readiness
Publish readiness
Monitoring data readiness
```

Each item should show:

- complete;
- incomplete;
- warning;
- blocked;
- link to fix.

## 12. Warning panels

Warning panels should be clear but not overwhelming.

Use warnings for:

- Motivation/Environment-only route;
- missing Analysis evidence;
- missing safeguard note;
- unlinked blocks;
- unreviewed AI output;
- final test not configured;
- proof enabled but safety note missing;
- raw proof privacy issue;
- creator trying to publish;
- submitted course locked from editing.

## 13. Build Studio layout

Build Studio must use a three-panel layout.

```text
Left: Course outline + block library
Center: Learner-like block canvas
Right: Block properties + governance + AI/accessibility/safety
```

Rules:

- keep center canvas readable;
- avoid freeform positioning;
- avoid overlapping objects;
- avoid arbitrary fonts/colors;
- make block status visible;
- keep required/creator-added labels clear;
- support scrolling inside panels when needed.

## 14. Locked record display

Locked records must be shown as read-only summary cards.

Use:

- lock icon;
- “Locked” status pill;
- approved/locked timestamp if available;
- “Used as source for this step” text;
- no editable fields unless returned/reopened with reason.

## 15. Review and revision UI

Returned comments should be grouped as:

```text
Required fixes
Suggested improvements
Resolved comments
Decision history
```

Each comment should link to exact:

- block;
- final test item;
- proof configuration;
- design record;
- analysis field.

Resubmit should stay disabled until required fixes are resolved.

## 16. Monitoring UI

Monitoring dashboard should be version-aware and safe.

Required UI sections:

- filters;
- KPI cards;
- enrollment/completion chart;
- final test performance;
- score distribution;
- proof pipeline;
- lesson progress;
- learner feedback summary;
- safe capacity evidence summary;
- improvement signals;
- privacy/data safety note.

Do not show raw proof in general monitoring.

## 17. Partner logo strip

Where used in mockups, keep partner logo strip at bottom or footer area.

Rules:

- use approved logo assets when available;
- do not redraw, distort, recolor, crop, or invent partner logos;
- if assets are unavailable, use safe placeholders only in documentation/mockup context.

## 18. Accessibility rules

Minimum accessibility requirements:

- sufficient contrast;
- visible focus states;
- form labels;
- buttons with clear names;
- status not communicated by color alone;
- image alt text guidance;
- captions/transcripts guidance for media blocks;
- keyboard-usable controls where feasible;
- plain-language helper text.

## 19. Low-bandwidth and localization rules

The UI should support low-bandwidth and localization readiness:

- allow text alternatives to media-heavy blocks;
- include transcript/printable resource block options;
- avoid unnecessary heavy visuals in functional screens;
- support plain-language copy;
- keep labels translatable;
- avoid idioms where possible.

## 20. MVP UI acceptance

```text
[ ] Top app bar is consistent.
[ ] Left sidebar is consistent.
[ ] Workflow stepper is visible and meaningful.
[ ] Active screen is obvious.
[ ] Course status is visible.
[ ] Locked records are clearly read-only.
[ ] Readiness panels guide completion.
[ ] Warning panels explain blocked states.
[ ] Build Studio uses three-panel layout.
[ ] Forms are grouped and not overcrowded.
[ ] Tables are readable.
[ ] Monitoring does not expose raw proof.
[ ] UI follows DEC blue/green institutional direction.
[ ] Screens are usable on desktop 16:9.
```

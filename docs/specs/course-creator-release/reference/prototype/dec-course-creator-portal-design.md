# DEC Learning Hub — Course Creator Portal Design Specification

## 1. Purpose

This design translates the uploaded course creator portal mockups into an implementation-ready static HTML prototype and a reusable design specification for the DEC CSO Learning Hub. The portal supports course creators as they move from evidence-based course setup through diagnosis, capacity mapping, action mapping, learning design, storyboard/block planning, build studio configuration, review readiness, publishing support, and monitoring.

The experience is intentionally not a generic LMS course editor. It is a governed, evidence-linked, CSO capacity-strengthening workflow for Ethiopian civil society learning content.

## 2. Product Identity

**Visible product name:** DEC Learning Hub  
**Portal label:** Course Creator Portal  
**Primary user shown in mockups:** Hanna T. / Hanna Berhe, Course Creator  
**Institutional context:** DEC, WHH, CoSAP, ZFD Civil Peace Service, European Union  
**Core positioning:** Governed, quality-assured, evidence-linked CSO strengthening platform.

## 3. Global Layout

### 3.1 Top App Bar

The top app bar is consistent across all creator screens and includes:

- DEC logo area at far left.
- Product name: `DEC Learning Hub`.
- Portal subtitle: `Course Creator Portal`.
- Global search field with placeholder: `Search courses, templates, resources...`.
- Help icon.
- Notification icon with badge.
- User avatar and name.
- Optional course status pill on course-specific screens.

### 3.2 Left Sidebar

The left sidebar provides persistent navigation:

- Dashboard
- My Courses
- Start New Course
- Monitoring
- Templates & Resources
- Help
- Review Tasks
- Messages
- Alerts

On some deeper workflow screens, the sidebar can expand to include:

- Evidence Library
- Resource Bank
- Standards & Guidance
- Quality Checklist
- Change Log
- Approvals
- Help Center
- Settings

The sidebar uses a landscape illustration zone at the bottom and a small trust message:

`Governed • Quality Assured`  
`Evidence-Linked • CSO Strengthening`

### 3.3 Footer Partner Strip

Each main screen includes a partner logo strip across the bottom. In the HTML prototype this is represented as text-based logo placeholders for:

- DEC
- WHH / Welthungerhilfe
- CoSAP
- ZFD Civil Peace Service
- EU

For production, these should be replaced with approved image assets without distortion, recoloring, cropping, or rearranging.

## 4. Visual System

### 4.1 Colors

| Token | Value | Use |
|---|---:|---|
| Primary Blue | `#0B7FDB` | Primary buttons, active states, progress, key actions |
| Strong Blue | `#006EE6` | Links, active navigation, action buttons |
| Deep Navy | `#071B3A` | Main headings and strong text |
| Ink | `#111827` | Body text |
| Muted Text | `#64748B` | Secondary labels and helper copy |
| Border | `#DDE7F3` | Card and input borders |
| Soft Background | `#F6FAFF` | Page background and soft panels |
| White | `#FFFFFF` | Cards and form surfaces |
| Green | `#31A354` | Completed states, success, readiness |
| DEC Green | `#91C852` | Brand accent and landscape styling |
| Purple | `#7C3AED` | Review, design draft, returned, AI guidance |
| Orange | `#F97316` | Warning, attention, revision |
| Red | `#EF4444` | Risk, deletion, critical issue |

### 4.2 Typography

Recommended production font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Typography hierarchy:

- Page title: 28–32px, bold, deep navy.
- Section title: 18–20px, bold.
- Card label: 12–14px, bold or semibold.
- Body text: 14–16px.
- Helper text: 12–13px, muted.

### 4.3 Cards and Surfaces

Cards use:

- White background.
- 1px light blue-gray border.
- 14–18px border radius.
- Soft shadow.
- Generous spacing.
- Clear section headings.

Avoid dense, crowded form layouts. Use grouped cards and progressive disclosure.

### 4.4 Buttons

Button types:

- Primary: solid blue gradient for the main next action.
- Secondary: white background with blue border.
- Ghost: neutral border for back/cancel/utility actions.
- Green: positive create or save action.
- Warning/critical: orange or red only for risk or destructive action.

Primary actions should be visually stronger and placed at bottom-right or top-right depending on workflow context.

## 5. Workflow Model

The course creator journey follows a governed sequence:

1. Dashboard
2. Course Setup
3. Analysis / Diagnosis
4. Capacity Map
5. Action Map
6. Learning Design Document
7. Storyboard, Scenario & Block Plan
8. Build Studio Suite
9. Review
10. Publish
11. Monitoring

Screens show a horizontal workflow stepper. Completed steps use green checkmarks. Current step uses blue. Locked future steps use gray lock indicators.

## 6. Screen-by-Screen Specification

### Screen 0 — Creator Dashboard / Home

**Purpose:** Give the course creator a clear home base showing active work, returned feedback, review status, and monitoring signals.

**Main components:**

- Welcome hero: `Welcome back, Hanna`.
- Alert pill: `Today: 2 courses need action`.
- Primary actions: `Start New Course`, `View My Courses`.
- KPI cards:
  - My Active Courses
  - Submitted for Review
  - Returned for Revision
  - Published Courses
- `Needs My Action` list with course rows.
- Recent feedback / returned comments panel.
- Published course monitoring snapshot.
- Published courses at a glance.

**UX intent:** The creator should immediately know what needs action and where to continue.

### Screen 1 — Course Setup

**Purpose:** Create the initial course shell before diagnosis and design work begins.

**Key sections:**

1. Course Identity
   - Course ID
   - Course title
   - Short description
   - Course owner
   - Course status

2. Audience & Delivery
   - Target learner group
   - Language
   - Duration estimate
   - Delivery mode
   - Level

3. Classification
   - Capacity area
   - Sub-capacity
   - Tags
   - Program / project / cohort selectors

4. Draft Learning Intent
   - Draft learning outcomes
   - Initial lesson outline
   - Draft resource list

5. Right-side readiness cards
   - Setup readiness checklist
   - Course configuration toggles
   - Access / certification logic

**Binding rule:** Certificate rule must remain `80%+ final test score = automated certificate`.

### Screen 2 — Analysis / Diagnosis

**Purpose:** Ensure every course begins from validated CSO capacity evidence, not from an unsupported topic idea.

**Key sections:**

- Course metadata summary.
- Capacity gap and evidence.
- Baseline and desired practice.
- Root cause diagnosis.
- K/S/M/E classification.
- Course-fit decision:
  - Course-addressable
  - Partly course-addressable
  - Not course-addressable / route outside course workflow
- Safeguards and evaluation anchor.
- Readiness checklist.
- K/S/M/E guidance.
- Warning against creating courses for non-learning barriers.
- Analysis-to-design handover.

**Workflow gate:** Analysis must be validated and locked before Capacity Map unlocks.

### Screen 3 — Capacity Map

**Purpose:** Translate the locked analysis into DEC’s capacity taxonomy and indicator framework.

**Key sections:**

- Locked analysis summary.
- CSO capacity classification.
- Capacity area.
- Sub-capacity.
- Related CSO practice.
- Indicator / standard link.
- Target learner group.
- Capacity objective.
- Course boundary statement.
- Traceability chain.
- Controlled taxonomy guidance.

**Workflow gate:** Capacity Map must validate before Action Map unlocks.

### Screen 4 — Action Map

**Purpose:** Convert a capacity objective into observable learner actions, practice activities, minimum information, assessment links, and proof possibilities.

**Key sections:**

- Capacity objective card.
- Indicator / standard card.
- Guiding question panel.
- Action map table with columns:
  - Observable learner action
  - Action type
  - Practice activity
  - Practice type
  - Minimum information
  - Assessment link
  - Proof possibilities
  - Proof suitability
- Guidance warning against vague actions.

**Design principle:** The action map should be measurable and performance-oriented, not topic-oriented.

### Screen 5 — Learning Design Document

**Purpose:** Convert approved analysis, capacity map, and action map into a build-ready learning design.

**Key sections:**

- Locked evidence summary.
- Design readiness checklist.
- AI authoring draft-only panel.
- Learning objectives.
- Lesson pathway.
- Assessment approach.
- Accessibility and localization.
- Safeguarding and data safety.
- Evidence and MEAL alignment.
- Human accountability banner.

**AI rule:** AI can support drafting only. Human review, adaptation, and approval are mandatory.

### Screen 6 — Storyboard, Scenario & Block Plan

**Purpose:** Turn the learning design into a detailed block-by-block plan that can prefill the Build Studio.

**Key sections:**

- Capacity gap, capacity objective, performance goal.
- Learning objectives.
- Lesson cards.
- Storyboard & block plan table.
- Configure scenario block panel.
- Block type library preview.
- Build Studio prefill preview.
- Storyboard readiness checklist.

**Output:** A structured block plan that seeds Build Studio.

### Screen 7 — Build Studio: Build Blocks

**Purpose:** Let creators build and configure course blocks using a three-panel layout.

**Primary layout:**

1. Left panel: Course outline and block library.
2. Center panel: Course canvas / block preview.
3. Right panel: Block configuration.

**Key functions:**

- Import from storyboard.
- Version history.
- Save all changes.
- Edit block content.
- Add media.
- Configure required/completion settings.
- Link blocks to actions, objectives, assessment, and proof.
- Go to Preview & Readiness.

### Screen 8 — Build Studio Suite

**Purpose:** Provide a more complete suite view of the Build stage, including build blocks, final test, practical proof, and preview/readiness.

**Top tabs:**

- Build Blocks
- Final Test
- Practical Proof
- Preview & Readiness

**Core build layout:**

- Block Library & Course Outline.
- Course Canvas, prefilled from Storyboard.
- Block Configuration Panel.

**Governance:** The screen keeps the Build stage tied to previously approved action maps, objectives, and assessment/proof links.

## 7. Content and Data Examples Used

Example course names:

- Outcome Evidence for CSO MEAL
- Safe Community Feedback Systems
- Budget Justification for CSO Projects
- Practical Safeguarding for CSO Staff
- Effective Community Engagement for Local Peacebuilding

Example capacity areas:

- Monitoring, Evaluation, Accountability, and Learning
- Financial Management
- Accountability and Safeguarding
- Governance

Example target groups:

- MEAL Officers and Program Staff
- Program Officers and Community Focal Points
- Local CSO Staff & Volunteers
- All CSO Staff

## 8. Governance and Binding Rules

The interface must preserve the following rules:

1. Course creation begins with evidence, not arbitrary topic generation.
2. Analysis must be locked before Capacity Map.
3. Capacity Map must be validated before Action Map.
4. Learning Design must be based on approved previous steps.
5. Storyboard pre-fills Build Studio but creators can edit block content.
6. AI authoring is draft-only and never final without human review.
7. Certificate rule is fixed at `80%+ final test score`.
8. Practical proof is optional and separate from certificate issuance.
9. Practical proof requires human verification for verified achievement.
10. Raw proof and sensitive learner evidence should remain private by default.
11. Review and publish remain separate stages.
12. Publish is not a creator action unless explicitly authorized by governance.

## 9. Responsive Behavior

The mockups are designed for 16:9 desktop. For smaller screens:

- Sidebar can collapse or hide.
- Main grids become single-column.
- Search can collapse into an icon.
- Workflow stepper may scroll horizontally.
- Three-panel Build Studio should stack or use tabs on tablet/mobile.

## 10. Implementation Notes

The included `code.html` file is a static visual prototype. It does not include backend logic, authentication, persistence, routing, or real data integration.

For production implementation in the DEC Learning Hub app:

- Convert each screen into route-level React/Next.js components.
- Replace placeholder icons and logos with approved assets.
- Connect forms to typed data models.
- Enforce workflow gates server-side, not only visually.
- Use role-based access checks for creator, reviewer, admin, verifier, and participant workflows.
- Keep audit history for lock, submit, review, return, publish, and configuration changes.
- Ensure accessibility: keyboard support, labels, focus states, contrast, and screen-reader descriptions.

## 11. File Outputs

- `dec-course-creator-portal-code.html` — static HTML/CSS prototype of the uploaded screens.
- `dec-course-creator-portal-design.md` — human-readable design specification and implementation guide.

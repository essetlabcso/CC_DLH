# 04 — Build Studio Suite Specification

## 1. Purpose

The Build Studio Suite is the workspace where approved course design becomes learner-facing content.

It must preserve the approved Analysis, Capacity Map, Action Map, Learning Design, and Storyboard while allowing the Course Creator to build engaging, practical, accessible learning content.

The Build Studio must be governed and flexible. It must not become a blank canvas.

## 2. Build Studio product identity

The Build Studio is:

> A structured course authoring workspace that helps creators build practical CSO capacity-strengthening learning experiences from approved Analysis and Design records.

It is not:

- a generic page builder;
- a slide editor;
- a decorative web builder;
- a file upload area;
- a freeform HTML canvas;
- a chatbot-driven course generator.

## 3. Required Build Studio tabs

The MVP Build Studio Suite must include these tabs or equivalent sub-sections:

```text
Build Blocks
Final Test
Practical Proof
Preview & Readiness
```

## 4. Required three-panel layout

The Build Blocks workspace must use a three-panel layout.

| Panel | Purpose |
|---|---|
| Left panel | Course outline and expandable block library |
| Center panel | Learner-like course canvas where blocks are assembled and edited |
| Right panel | Block properties, governance metadata, AI assistance, accessibility, safeguarding, and readiness checks |

## 5. Left panel requirements

The left panel must include:

- course outline;
- module list;
- lesson list;
- current lesson indicator;
- add-block button/menu;
- searchable block library;
- expandable block categories;
- recommended blocks from Storyboard;
- required block indicators;
- creator-added block indicators;
- filter by purpose or block type.

The left panel should help creators choose blocks based on learning purpose, not only technical format.

## 6. Block library organization

Block library should be organized by learning purpose.

| Learning purpose | Use when creator needs to... | Example blocks |
|---|---|---|
| Structure | Organize course flow | Course intro, section header, divider, lesson summary |
| Explain | Present essential information | Paragraph, short explainer, definition, FAQ |
| Emphasize | Highlight important ideas | Statement, warning, quote, key takeaway |
| Show | Demonstrate or illustrate | Image, chart, video, audio, worked example |
| Reveal | Let learners explore progressively | Accordion, tabs, flashcards, timeline, process |
| Practice | Let learners apply or rehearse | Guided practice, checklist, sorting, matching, template task |
| Decide | Let learners make judgment choices | Scenario, decision branch, case question, dilemma card |
| Reflect | Connect learning to real CSO work | Reflection prompt, action commitment, personal plan |
| Check | Test understanding | Knowledge check, MCQ, true/false, matching |
| Apply | Support real-world output | Downloadable template, worksheet, job aid |
| Safeguard | Reduce risk | Safety note, anonymization warning, do-no-harm reminder |
| Access | Improve accessibility/localization | Transcript, alt text note, low-bandwidth alternative |
| Recognize | Support verified achievement pathway | Proof instruction, review criteria, badge explanation |

## 7. Minimum MVP block families

The MVP does not need every future block type. It must support enough block types to demonstrate a full course.

Minimum block families:

```text
Structure
Text / Explanation
Callout / Warning
Image or Visual Placeholder
Accordion / Tabs or Reveal
Scenario / Decision
Practice Activity
Knowledge Check
Downloadable Resource / Job Aid
Reflection
Final Test Item Reference
Practical Proof Instruction
```

## 8. Center canvas requirements

The center canvas must:

- show the selected lesson;
- display blocks in sequence;
- show required, recommended, and creator-added status;
- allow editing selected block;
- allow reordering where supported;
- allow marking a block complete;
- show learner-like preview mode;
- avoid freeform positioning;
- avoid arbitrary overlapping objects;
- preserve consistent spacing, typography, and accessibility.

Each block card should show:

- block title;
- block type;
- linked action/objective;
- status;
- AI-assisted marker if relevant;
- accessibility/safety marker where relevant;
- quick edit action.

## 9. Right panel requirements

The right panel must change based on selected block.

Minimum fields:

- block title;
- block type;
- learner-facing content;
- linked objective/action;
- linked lesson;
- purpose tag;
- required/recommended/creator-added status;
- justification if creator-added;
- assessment link;
- proof link if relevant;
- AI draft controls/status;
- human review status for AI output;
- accessibility fields;
- safeguarding/data safety fields;
- save block button.

## 10. Required versus creator-added blocks

### 10.1 Required blocks

Required blocks come from the approved Storyboard and Design-to-Build Handover.

They must:

- remain visible in Build Studio;
- be linked to objective/action;
- be completed before Review submission;
- appear in readiness checklist.

### 10.2 Creator-added blocks

Creators may add useful blocks, but every added block must include:

- purpose tag;
- linked action/objective;
- justification;
- accessibility note where relevant;
- safeguarding note where relevant;
- optional assessment/proof link where relevant.

Allowed purposes for added blocks:

```text
clarify essential information
support practice
prepare final test
support practical proof
improve accessibility
support low-bandwidth access
add safeguard/no-harm guidance
support reflection/action commitment
```

Not allowed:

```text
decorative filler
unlinked theory expansion
unsupported donor/legal claims
unsafe advocacy tactics
sensitive raw-data collection
unreviewed AI-generated content
```

## 11. AI draft support inside Build Studio

AI may assist with:

- drafting short learner-facing explanation;
- simplifying technical text;
- creating fictionalized examples;
- drafting scenario wording;
- drafting practice instructions;
- drafting knowledge check questions;
- drafting final test item suggestions;
- drafting feedback messages;
- drafting alt text;
- drafting transcript summary;
- drafting proof instructions safely.

AI must work from approved context:

- course title;
- target learner group;
- capacity area;
- sub-capacity;
- capacity gap;
- baseline/current practice;
- desired practice;
- K/S route;
- course-fit decision;
- performance goal;
- required action;
- minimum information;
- block type;
- safeguards/no-harm note;
- accessibility/localization needs.

AI outputs must be:

```text
Draft
AI-assisted
Requires human review
Not approved until accepted/edited by creator
Visible in AI Drafting and Review Log
```

## 12. Final Test tab

### 12.1 Purpose

The Final Test confirms that the learner has met the course learning threshold. It checks knowledge, decision logic, and practical judgment taught in the course.

### 12.2 Required fields

- final test title;
- instructions;
- attempts allowed;
- scoring method;
- fixed pass/certificate threshold: 80%;
- question list;
- question type;
- question prompt;
- answer options;
- correct answer;
- feedback;
- linked lesson/block/action;
- safeguarding/data safety question marker if relevant.

### 12.3 Supported MVP question types

Minimum MVP should support:

```text
Multiple choice
True/false
Scenario-based multiple choice
Matching or sequencing if already easy in repo
```

### 12.4 Binding behavior

- The certificate threshold must be fixed at 80%.
- Creator must not edit the threshold.
- Practical proof must not be required for certificate.
- Final Test must be configured before Review submission.
- No 90% certificate threshold appears anywhere.

## 13. Practical Proof tab

### 13.1 Purpose

Practical Proof is an optional/additional recognition pathway that allows learners or CSOs to submit evidence of applying learning in real work.

It is separate from the certificate.

### 13.2 Required fields if enabled

- proof enabled/disabled;
- proof title;
- proof purpose;
- linked performance goal;
- linked action;
- linked capacity area/sub-capacity;
- accepted proof types;
- learner instructions;
- safety/anonymization guidance;
- review rubric;
- verifier role;
- verified achievement/badge title;
- visibility setting.

### 13.3 Binding behavior

- Certificate can be issued without proof.
- Proof submission does not automatically create verified achievement.
- Verified achievement requires human review.
- Raw proof is private by default.
- Donor-facing summary is out of MVP unless safe consent logic exists.

### 13.4 Safe proof guidance

Proof instructions should warn learners:

> Do not upload beneficiary names, safeguarding case files, unredacted complaint logs, politically sensitive details, confidential donor contracts, or personal staff records. Use anonymized, fictionalized, or redacted examples where possible.

## 14. Preview & Readiness tab

### 14.1 Purpose

Preview & Readiness confirms that the course is safe, complete, accessible, and ready to submit for Review.

### 14.2 Required sections

- learner preview;
- required blocks complete;
- creator-added blocks justified;
- AI outputs human-reviewed;
- final test configured;
- 80% certificate rule confirmed;
- practical proof checked if enabled;
- accessibility checklist;
- safeguarding/data safety checklist;
- unresolved warnings;
- submit for review readiness.

### 14.3 Submit readiness conditions

Submit for Review unlocks only when:

```text
Required blocks complete
Creator-added blocks justified
AI outputs human-reviewed
Final test configured
80% certificate rule confirmed
Practical proof checked if enabled
Learner preview completed
Accessibility checklist completed
Safeguarding/data safety checklist completed
Build-to-Review handover generated
```

## 15. Build-to-Review handover

The Build Studio must create or support a Build-to-Review Handover containing:

- Course ID / version draft ID;
- course title;
- course owner;
- linked Analysis Handover;
- linked Design-to-Build Handover;
- capacity area / sub-capacity;
- target learner group;
- performance goal;
- required blocks summary;
- creator-added block register;
- AI Drafting and Review Log;
- Final Test Record;
- 80% certificate rule confirmation;
- Practical Proof Configuration if enabled;
- accessibility checklist;
- safeguarding/data safety checklist;
- learner preview status;
- known unresolved warnings;
- submission date;
- submitted by.

## 16. MVP acceptance criteria

```text
[ ] Build Studio opens only after valid Storyboard.
[ ] Storyboard blocks prefill Build Studio.
[ ] Build Studio uses three-panel layout.
[ ] Required blocks are visible and trackable.
[ ] Creator can edit required blocks.
[ ] Creator can add at least one creator-added block.
[ ] Creator-added block requires purpose tag and justification.
[ ] AI outputs are marked draft/AI-assisted.
[ ] AI outputs require human review.
[ ] Final Test can be configured.
[ ] 80% certificate threshold is fixed and visible.
[ ] Practical Proof can be enabled separately.
[ ] Raw proof defaults to private.
[ ] Learner preview can be opened.
[ ] Submit for Review is gated by readiness checklist.
```

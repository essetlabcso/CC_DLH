# K/S/M/E Routing Rules Reference

## Core rule

Phase 1 course production should normally proceed only for Knowledge and Skill gaps. Motivation and Environment gaps must not drive course production unless the Analysis record explicitly identifies a separable Knowledge or Skill component.

## Definitions

### Knowledge

Learners do not yet understand the required concept, rule, standard, process, distinction, or good practice.

Typical signs:

- learners do not know what something means;
- learners are unaware of a standard or requirement;
- learners confuse key concepts;
- learners do not know the steps in a process;
- learners do not know what good practice looks like.

Decision: course-addressable if evidence is sufficient and Analysis Handover can be locked.

### Skill

Learners may understand the concept but cannot apply it correctly in a practical CSO task, decision, tool, work output, scenario, template, or process.

Typical signs:

- learners know the idea but cannot perform the task;
- learners need guided practice;
- learners make errors applying a standard;
- learners cannot make the correct decision in a realistic scenario;
- learners need feedback and repetition.

Decision: course-addressable if evidence is sufficient and Analysis Handover can be locked.

### Motivation

Learners may know what to do and may have the skill, but the practice is not happening because of confidence, incentives, leadership signals, organizational culture, trust, fear, ownership, habits, or perceived value.

Typical signs:

- people know what to do but do not prioritize it;
- leadership does not value the practice;
- staff believe the work will not be used;
- staff fear consequences;
- staff are not rewarded or encouraged;
- accountability culture is weak.

Decision: not course-addressable by itself. Record and route to complementary support unless a separable K/S component is identified.

### Environment

Learners are blocked by external or organizational conditions beyond their individual knowledge or skill.

Typical signs:

- tools or systems are missing;
- policies or procedures are absent;
- leadership approval is missing;
- staff lack time, budget, devices, internet, or templates;
- laws, civic-space dynamics, or public authority practices restrict action;
- safety risks prevent action.

Decision: not course-addressable by itself. Record and route to complementary support unless a separable K/S component is identified.

### Mixed

More than one cause exists. Mixed gaps are common in CSO capacity strengthening.

Decision: proceed only for the explicit K/S component. Record M/E components and route or flag them for complementary support.

## Course-fit outcomes

Use these normalized outcomes in planning, docs, tests, or implementation unless the repo has established enum names that should be preserved:

- `course_addressable`
- `partly_course_addressable`
- `not_course_addressable`
- `needs_further_diagnosis`
- `specialist_review_required`

## Unlock logic

Design can unlock only when:

1. required Analysis fields are complete;
2. evidence is sufficient;
3. course-fit decision is `course_addressable` or `partly_course_addressable`;
4. separable K/S component is recorded for mixed gaps;
5. safeguards/no-harm considerations are recorded;
6. Analysis-to-Design Handover is approved or locked.

Design remains blocked when:

- root cause is unclear;
- evidence is missing or insufficient;
- gap is Motivation-only;
- gap is Environment-only;
- mixed gap has no separable K/S component;
- sensitive case requires specialist review before unlock;
- Analysis Handover is not locked or approved.

## Complementary support examples for M/E components

Record these as non-course or blended support pathways where relevant:

- coaching;
- mentoring;
- leadership engagement;
- peer learning;
- technical assistance;
- systems strengthening;
- templates/tools provision;
- policy/procedure development;
- safeguarding review;
- enabling-environment or civic-space action;
- resource support;
- management routines or accountability mechanisms.

## Red flags

- A course title is created before validated gap evidence is selected or entered.
- The platform treats all capacity gaps as training problems.
- M/E gaps are reframed as K/S without evidence.
- A mixed gap proceeds without identifying what the course can realistically change.
- Root cause is unknown but Design unlocks anyway.
- AI changes the K/S/M/E route or invents the separable K/S component.

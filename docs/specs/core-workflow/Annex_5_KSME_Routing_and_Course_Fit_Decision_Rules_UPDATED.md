# Annex 5: K/S/M/E Routing and Course-Fit Decision Rules

**DEC Learning Hub Course Creator Portal**  
**Updated repo-ready version**

---

## 1. Purpose of This Annex

This annex defines the **K/S/M/E Routing and Course-Fit Decision Rules** for the DEC Learning Hub Course Creator Portal.

Its purpose is to help Codex/GPT-5.5, developers, course creators, reviewers, DEC capacity leads, and DEC stakeholders determine whether a diagnosed CSO capacity gap should:

1. proceed into Phase 1 course design;
2. be narrowed into a separable course-addressable Knowledge or Skill component;
3. be routed to a non-course support pathway; or
4. remain in diagnosis because the root cause is unclear.

This annex should guide:

- Analysis Gate logic;
- diagnosis form fields;
- root-cause classification;
- course-fit decision rules;
- Design unlock conditions;
- reviewer checks;
- non-course support routing;
- platform warning messages;
- monitoring interpretation;
- Codex implementation decisions.

**Core rule:**  
Phase 1 courses should normally address **Knowledge** and **Skill** gaps. **Motivation** and **Environment** gaps should not drive Phase 1 course production unless the Analysis record explicitly identifies a separable Knowledge or Skill component that a course can realistically address.

---

## 2. Why K/S/M/E Routing Matters

Many CSO capacity challenges are **not training problems**.

For example:

- A CSO may struggle with MEAL reporting because staff do not understand outcome indicators. That is a **Knowledge** gap and can be addressed through a course.
- Another CSO may understand outcome indicators but cannot complete an outcome evidence worksheet. That is a **Skill** gap and can also be addressed through a course.
- But if staff do not use MEAL data because leadership never discusses evidence, that is mostly a **Motivation / management culture** issue. A course alone cannot solve it.
- If staff do not use MEAL data because they have no tools, time, internet, reporting system, or management meeting structure, that is mostly an **Environment** issue. Again, a course alone cannot solve it.

The K/S/M/E model prevents the platform from treating every capacity problem as a course topic. It protects DEC from producing courses that are polished but ineffective because the real barrier sits outside digital learning.

In the DEC Learning Hub, K/S/M/E should be understood as a practical CSO capacity-strengthening diagnostic model. It asks:

- Do learners **know** what is required?
- Can they **apply** it in real work?
- Are they **motivated, supported, and signaled** to use it?
- Does the organizational or external **environment** allow them to do it?

This makes the platform more than a course builder. It becomes a disciplined system for deciding when a course is the right intervention, when it is only one part of the response, and when a different support pathway is needed.

---

## 3. Are K/S/M/E Categories Exhaustive?

For DEC's Phase 1 learning design purposes, K/S/M/E is **sufficiently comprehensive** if used as broad diagnostic categories.

Most CSO capacity gaps can be classified as one or a combination of:

1. what people know;
2. what people can do;
3. whether they are willing, confident, incentivized, and organizationally supported to do it; and
4. whether the surrounding organizational, resource, legal, civic-space, policy, digital, social, or donor environment allows them to do it.

However, the platform should apply two safeguards.

### 3.1 Mixed is required, but not a fifth category

Most real CSO capacity problems are mixed. For example, weak MEAL data use may involve:

- lack of skill in writing outcome evidence;
- leadership not demanding learning discussions;
- no management meeting structure;
- weak tools or templates;
- donor reporting pressure that rewards activity counts.

Therefore, **Mixed** should be a required diagnosis option in the platform. But it should not be treated as a fifth root-cause category. It is a combination state that requires the platform to identify the specific Knowledge/Skill component that can proceed as a course.

### 3.2 Needs further diagnosis is a workflow state, not a capacity category

Some problems are too vague, sensitive, political, or weakly evidenced to classify safely. In those cases, the platform should not force a K/S/M/E label.

The correct platform behavior is to mark the case as:

- **Needs further diagnosis**;
- **Needs additional evidence**;
- **Needs safeguarding/civic-space review**; or
- **Needs stakeholder validation**.

This prevents the platform from turning unclear problems into courses.

### 3.3 Do not add a fifth substantive category by default

This annex does not recommend adding a fifth substantive category unless DEC later identifies a strong operational need.

Some performance models separate factors such as aptitude, role fit, or capacity constraints. In the DEC CSO capacity-strengthening context, those should normally be handled inside **Environment**, because they are usually shaped by organizational design, inclusion, role clarity, workload, duty of care, accessibility, language, psychosocial support, management systems, or enabling conditions.

This avoids stigmatizing individual learners and keeps the model practical.

---

## 4. Definitions of K/S/M/E Routes

### 4.1 Knowledge

A **Knowledge** gap means that the target learners do not yet understand the required concept, standard, rule, process, distinction, right, responsibility, donor requirement, safeguarding step, MEAL distinction, or good-practice expectation.

Typical signs:

- learners do not know what something means;
- learners are unaware of a standard or requirement;
- learners confuse key concepts;
- learners do not know the steps in a process;
- learners do not know what good practice looks like;
- learners cannot explain why a rule, standard, or process matters.

Examples:

- Finance officers do not know what a budget justification should include.
- Project officers do not understand the difference between outputs and outcomes.
- Board members do not know what conflict of interest means.
- Field staff do not know the categories of community feedback.
- Safeguarding focal persons do not know the correct referral steps.
- Advocacy staff do not know the difference between safe evidence and sensitive disclosure.

**Phase 1 decision:**  
Knowledge gaps are course-addressable. A course can explain concepts, standards, steps, distinctions, examples, and good practice.

---

### 4.2 Skill

A **Skill** gap means learners may understand the concept but cannot yet apply it correctly in a practical CSO task, tool, judgment, work output, meeting process, data tool, budget justification, advocacy message, feedback log, outcome evidence statement, scenario, template, or decision process.

Typical signs:

- learners understand the idea but cannot perform the task;
- learners need practice using a template, checklist, tool, or process;
- learners make errors when applying a standard;
- learners cannot make the right decision in a realistic scenario;
- learners need feedback and repetition;
- learners cannot produce a usable work output.

Examples:

- Staff know what an outcome indicator is but cannot prepare an outcome evidence statement.
- Finance staff know budget categories but cannot write a clear budget justification.
- Board members know conflict of interest is important but cannot document it in meeting records.
- Advocacy staff know evidence matters but cannot draft a safe policy message.
- Field staff know feedback categories but misclassify sensitive complaints.
- HR staff know safeguarding principles but cannot apply a referral pathway in a scenario.

**Phase 1 decision:**  
Skill gaps are course-addressable, but the course must include realistic practice, examples, feedback, final test alignment, and where relevant, practical proof.

---

### 4.3 Motivation

A **Motivation** gap means learners or organizations may know what to do and may have the skill, but the practice is not happening because of confidence, incentives, leadership signals, organizational culture, ownership, trust, fear, habits, perceived value, consequences, accountability routines, or management priorities.

Typical signs:

- people know what to do but do not prioritize it;
- leadership does not value the practice;
- staff believe the task will not be used;
- staff fear negative consequences;
- staff are not rewarded, encouraged, or protected;
- the organization has weak accountability culture;
- staff see the practice as donor compliance rather than mission-critical work.

Examples:

- Staff know how to collect feedback but do not believe management will act on it.
- Board members know they should declare conflicts but do not want to challenge powerful members.
- Project staff know how to write learning notes but see reporting only as donor compliance.
- Finance staff know procedures but bypass them because informal practice is rewarded.
- Advocacy staff avoid evidence-based public messaging because they fear backlash.
- MEAL officers know how to facilitate reflection sessions but leadership never asks for learning evidence.

**Phase 1 decision:**  
Motivation gaps should not drive Phase 1 course production by themselves. A course may support confidence, clarify value, or explain why a practice matters, but broader change usually requires leadership engagement, coaching, peer learning, mentoring, management routines, accountability practices, or change-management support.

A Motivation gap may proceed only if the Analysis record explicitly identifies a separable Knowledge or Skill component.

---

### 4.4 Environment

An **Environment** gap means the learner is blocked by conditions outside individual knowledge or skill.

These conditions may include organizational systems, policies, leadership approval, time, staffing, tools, funding, coordination structures, donor rules, legal/regulatory conditions, public authority behavior, civic-space constraints, safeguarding risks, social norms, digital infrastructure, language access, inclusion barriers, accessibility needs, workload, data systems, partner requirements, or other enabling-environment factors.

Typical signs:

- tools or systems are missing;
- policies or procedures are absent;
- leadership approval is missing;
- staff lack time, budget, devices, internet, templates, translation support, or accessible formats;
- laws or public authority practices restrict action;
- donor requirements are unclear or inconsistent;
- safety risks prevent action;
- social norms, exclusion, or organizational design prevent participation;
- the learner's role does not allow them to apply the skill.

Examples:

- Staff cannot submit digital reports because there is no reliable internet or device access.
- CSO cannot diversify funding because legal or banking restrictions block funding channels.
- Safeguarding referral cannot work because the organization has no referral partnership.
- MEAL data is not used because there is no management meeting structure.
- Community feedback cannot be escalated because no complaint-handling mechanism exists.
- A course requires file uploads but field staff only have basic phones and low bandwidth.
- Advocacy staff cannot use a public messaging approach because civic-space risks are high.

**Phase 1 decision:**  
Environment gaps should not drive Phase 1 course production by themselves. A course may address a separable Knowledge or Skill component, but the wider barrier requires advisory support, systems strengthening, resource support, policy engagement, partnerships, safeguarding support, digital infrastructure support, or enabling-environment work.

---

### 4.5 Mixed

A **Mixed** gap means more than one cause exists.

Most real CSO capacity problems are mixed. The platform should allow mixed diagnosis, but it must still identify the course-addressable component.

Examples:

- Staff lack skill in budget justification, and the organization lacks donor budgeting templates.
- Staff know feedback matters, but there is no clear escalation policy and they lack categorization skill.
- Board members do not document conflicts because they lack both procedure knowledge and leadership commitment.
- MEAL officers lack evidence writing skill, and management does not use evidence in decisions.
- Advocacy staff need skill in safe messaging, but civic-space risk also limits public action.

**Phase 1 decision:**  
Mixed gaps may proceed only for the explicit Knowledge/Skill component. The Motivation or Environment component must be recorded and routed to complementary support.

---

## 5. Course-Fit Decision Options

The Analysis Gate should require one of the following course-fit decisions.

| Course-fit decision | Meaning | Platform behavior |
|---|---|---|
| Course-addressable | Gap is primarily Knowledge or Skill | Design can unlock after Analysis Handover is complete and locked |
| Partly course-addressable | Gap is Mixed, with explicit Knowledge/Skill component | Design can unlock only for the recorded K/S component |
| Non-course route | Gap is primarily Motivation or Environment | Design remains blocked; route to non-course support |
| Needs further diagnosis | Evidence or root cause is unclear | Analysis remains open or routed for further validation |
| Not suitable / archive | Issue should not become a course | Archive, close, or route outside the course workflow |

The course-fit decision should be visible in:

- Analysis-to-Design Handover;
- Design reference panel;
- Capacity Map;
- Action Map;
- Review checklist;
- monitoring interpretation where relevant.

---

## 6. Analysis Gate Routing Logic

### 6.1 Knowledge route

If route = Knowledge:

Required behavior:

- require capacity gap statement;
- require baseline/current practice;
- require desired practice;
- require evidence source;
- require target learner group;
- require capacity area and sub-capacity where available;
- require indicator/standard where available;
- require safeguards/no-harm note;
- require evaluation anchor;
- allow course-fit decision: **Course-addressable**;
- allow Analysis Handover to lock;
- unlock Design.

Example platform message:

> This appears to be a Knowledge gap. A course can proceed if the Analysis Handover is complete and locked.

---

### 6.2 Skill route

If route = Skill:

Required behavior:

- require capacity gap statement;
- require baseline/current practice;
- require desired practice;
- require evidence source;
- require target learner group;
- require capacity area and sub-capacity where available;
- require indicator/standard where available;
- require practical action statement;
- require safeguards/no-harm note;
- require evaluation anchor;
- allow course-fit decision: **Course-addressable**;
- allow Analysis Handover to lock;
- unlock Design.

Example platform message:

> This appears to be a Skill gap. A course can proceed if it includes realistic practice, final test alignment, and optional practical proof where relevant.

---

### 6.3 Motivation route

If route = Motivation:

Default behavior:

- Design remains blocked;
- platform asks whether there is a separable Knowledge or Skill component;
- if no separable component exists, set course-fit decision to **Non-course route**;
- record recommended support pathway;
- do not unlock Design.

If a separable Knowledge/Skill component exists:

- require explicit K/S component statement;
- require justification for course-fit;
- require non-course support note for the Motivation component;
- allow course-fit decision: **Partly course-addressable**;
- unlock Design only for the K/S component.

Example platform message:

> This appears to be a Motivation gap. A course alone is unlikely to solve it. Design can proceed only if you identify a specific Knowledge or Skill component that the course can realistically address.

---

### 6.4 Environment route

If route = Environment:

Default behavior:

- Design remains blocked;
- platform asks whether there is a separable Knowledge or Skill component;
- if no separable component exists, set course-fit decision to **Non-course route**;
- record the environmental barrier;
- record recommended support pathway;
- do not unlock Design.

If a separable Knowledge/Skill component exists:

- require explicit K/S component statement;
- require justification for course-fit;
- require non-course support note for the Environment component;
- require safeguards/no-harm review if the barrier involves civic-space, safeguarding, protection, legal, or political sensitivity;
- allow course-fit decision: **Partly course-addressable**;
- unlock Design only for the K/S component.

Example platform message:

> This appears to be an Environment gap. A course cannot remove the external barrier. Design can proceed only for a specific Knowledge or Skill component, while the environmental barrier is routed to complementary support.

---

### 6.5 Mixed route

If route = Mixed:

Required behavior:

- require selection of all applicable root-cause components;
- require the primary route;
- require explicit Knowledge/Skill component;
- require Motivation/Environment notes where relevant;
- require support pathway for non-course components;
- allow course-fit decision: **Partly course-addressable** only if the K/S component is clear;
- block Design if the K/S component is missing or vague;
- unlock Design only for the recorded K/S component.

Example platform message:

> This is a Mixed gap. Design can proceed only for the clearly defined Knowledge or Skill component. The Motivation or Environment components must be recorded for complementary support.

---

### 6.6 Needs further diagnosis route

If route = Needs further diagnosis / unclear:

Required behavior:

- Design remains blocked;
- require reason why classification is unclear;
- require additional evidence needed;
- allow assignment for further diagnosis, stakeholder validation, or specialist review;
- prevent course creation until course-fit is clarified.

Example platform message:

> The root cause is not clear enough to create a course. Please gather additional evidence or request review before unlocking Design.

---

## 7. Required Fields by Route

| Field | Knowledge | Skill | Motivation | Environment | Mixed | Needs further diagnosis |
|---|---:|---:|---:|---:|---:|---:|
| Capacity gap statement | Required | Required | Required | Required | Required | Required |
| Evidence source | Required | Required | Required | Required | Required | Required |
| Baseline/current practice | Required | Required | Required | Required | Required | Required |
| Desired practice | Required | Required | Required | Required | Required | Recommended |
| Target learner group | Required | Required | Recommended | Recommended | Required if K/S exists | Optional |
| Capacity area | Required | Required | Required | Required | Required | Recommended |
| Sub-capacity | Recommended | Recommended | Recommended | Recommended | Recommended | Optional |
| Indicator/standard link | Recommended | Recommended | Recommended | Recommended | Recommended | Optional |
| K/S/M/E route | Required | Required | Required | Required | Required | Unclear |
| Course-fit decision | Course-addressable | Course-addressable | Usually non-course | Usually non-course | Partly course-addressable if K/S exists | Needs further diagnosis |
| Practical action statement | Recommended | Required | Optional | Optional | Required for K/S component | Optional |
| Separable K/S component | Not needed | Not needed | Required if proceeding | Required if proceeding | Required | Not applicable |
| Non-course support note | Optional | Optional | Required | Required | Required if M/E exists | Required |
| Safeguards/no-harm note | Required | Required | Required | Required | Required | Required if sensitive |
| Evaluation anchor | Required | Required | Recommended | Recommended | Required for K/S component | Optional |
| Design unlock | Yes if complete | Yes if complete | Only if K/S component exists | Only if K/S component exists | Only if K/S component exists | No |

---

## 8. Course-Fit Decision Matrix

| Root cause route | Can proceed to Phase 1 course? | Condition |
|---|---|---|
| Knowledge | Yes | Course explains the missing concept, rule, standard, process, or good practice |
| Skill | Yes | Course includes practice, examples, feedback, final test alignment, and applied task logic |
| Motivation | No by default | May proceed only for a separable Knowledge/Skill component |
| Environment | No by default | May proceed only for a separable Knowledge/Skill component |
| Mixed | Partly | Must define the K/S component and route the M/E component to complementary support |
| Needs further diagnosis | No | Must gather evidence or complete validation before course design |

---

## 9. Examples by Capacity Area

### 9.1 Internal Governance and Leadership

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Board members do not know what conflict of interest means | Knowledge | Course-addressable | Explain conflict of interest, examples, declaration steps |
| Board members know the rule but cannot document conflict-of-interest decisions | Skill | Course-addressable | Practice completing a declaration and meeting record |
| Board members avoid declaring conflicts because powerful members discourage it | Motivation | Non-course or partly course-addressable | Course may explain roles, but leadership/accountability support is needed |
| The organization has no board procedure or meeting template | Environment | Non-course or partly course-addressable | Course may explain what a procedure includes; system/template support is needed |

### 9.2 Transparency and Accountability

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not know what information should be shared with communities | Knowledge | Course-addressable | Explain minimum accountability information |
| Staff cannot prepare plain-language project information | Skill | Course-addressable | Practice rewriting project information |
| Staff do not believe community feedback will be used | Motivation | Non-course or partly course-addressable | Course may clarify feedback value; management routines are needed |
| No feedback mechanism or escalation pathway exists | Environment | Non-course or partly course-addressable | Course may teach feedback categories; mechanism design is needed |

### 9.3 Financial Management and Resource Mobilization

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not know allowable cost categories | Knowledge | Course-addressable | Explain categories and donor logic |
| Staff cannot write a budget justification linked to activities | Skill | Course-addressable | Practice writing a justification |
| Staff bypass controls because informal approval is rewarded | Motivation | Non-course or partly course-addressable | Course may explain control value; leadership/accountability support is needed |
| CSO lacks finance software, role separation, or templates | Environment | Non-course or partly course-addressable | Course may teach template use; systems support is needed |

### 9.4 Human Resources, Inclusion, and Safeguarding

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not know safeguarding referral steps | Knowledge | Course-addressable | Explain referral pathway |
| Staff cannot apply referral steps in a realistic scenario | Skill | Course-addressable | Scenario-based practice |
| Staff fear reporting safeguarding concerns | Motivation | Non-course or partly course-addressable | Course may clarify safe reporting; protection culture and leadership support are needed |
| No referral partner or safeguarding focal point exists | Environment | Non-course or partly course-addressable | Course may teach what a referral system requires; organizational setup is needed |

### 9.5 Evidence-Based Advocacy and Civic Engagement

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not know what counts as evidence for advocacy | Knowledge | Course-addressable | Explain evidence types and safe use |
| Staff cannot draft a safe evidence-based advocacy message | Skill | Course-addressable | Practice drafting and reviewing a message |
| Staff avoid advocacy because of fear or low confidence | Motivation | Non-course or partly course-addressable | Course may build confidence through scenarios; risk management and leadership support are needed |
| Civic-space restrictions make public advocacy unsafe | Environment | Non-course or partly course-addressable with safeguards | Course may teach safe framing; broader civic-space strategy is needed |

### 9.6 Monitoring, Evaluation, Accountability, and Learning

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not understand the difference between outputs and outcomes | Knowledge | Course-addressable | Explain the distinction |
| Staff cannot write an outcome evidence statement | Skill | Course-addressable | Practice completing an evidence worksheet |
| Management does not ask staff to use evidence in decisions | Motivation | Non-course or partly course-addressable | Course may explain evidence use; management routines are needed |
| No data review meeting, dashboard, or reporting system exists | Environment | Non-course or partly course-addressable | Course may teach review steps; system/process setup is needed |

### 9.7 Digital Skills and Data Use

| Diagnosed gap | Route | Course-fit decision | Courseable component |
|---|---|---|---|
| Staff do not know basic spreadsheet terms | Knowledge | Course-addressable | Explain rows, columns, filters, formulas |
| Staff cannot clean or categorize data in a spreadsheet | Skill | Course-addressable | Practice using a sample sheet |
| Staff avoid digital tools because they lack confidence | Motivation | Partly course-addressable | Course may build confidence; peer support may be needed |
| Staff lack devices, internet, accounts, or accessible formats | Environment | Non-course or partly course-addressable | Course may explain tool use; infrastructure/access support is needed |

---

## 10. Non-Course Support Routing

Motivation and Environment gaps should not be discarded. They should be recorded and routed to appropriate support.

| Non-course support route | Use when |
|---|---|
| Coaching | Staff or leaders need individualized guidance, confidence-building, or habit support |
| Mentoring | A learner or CSO needs repeated practical support from an experienced person |
| Peer learning | CSOs can learn from each other through examples, reflection, and exchange |
| Leadership engagement | Management signals, priorities, culture, or accountability routines are blocking practice |
| Organizational advisory support | Policies, procedures, roles, governance routines, or management systems need strengthening |
| Technical assistance | The CSO needs hands-on help setting up tools, templates, systems, or processes |
| Toolkit/template provision | A missing form, checklist, guide, or worksheet prevents application |
| Resource support | Funding, devices, connectivity, staffing, or time constraints are the core barrier |
| Digital infrastructure support | Devices, internet, software, accounts, data systems, or platform access are missing |
| Safeguarding specialist support | Protection, referral, case handling, consent, duty of care, or trauma-informed support is needed |
| Civic-space/risk advisory support | Advocacy, public authority, political, legal, or security risks shape what is feasible |
| Legal/compliance review | Laws, registration rules, banking constraints, donor compliance, or regulatory risks are involved |
| Enabling-environment action | External rules, donor systems, public authority practices, or sector-level constraints must be addressed |
| Further diagnosis | Evidence is insufficient or root cause is unclear |

---

## 11. Separable Knowledge/Skill Component Rules

A Motivation, Environment, or Mixed gap may proceed to course design only if the Analysis record clearly defines a separable K/S component.

The separable component must answer:

1. What exactly do learners need to know or do?
2. How is this different from the wider Motivation or Environment barrier?
3. Can a short, practical, mobile-first course realistically address it?
4. What non-course support remains necessary?
5. What should monitoring avoid overclaiming?

| Field | Example |
|---|---|
| Wider gap | CSOs do not use feedback data for decisions |
| Root cause | Mixed: staff lack categorization skill; management does not hold review meetings |
| Courseable K/S component | Staff need to categorize feedback and identify escalation pathway |
| Non-course component | Leadership needs to introduce regular feedback review meetings |
| Course-fit decision | Partly course-addressable |
| Design scope warning | Course should not claim it will institutionalize feedback use without management routines |

---

## 12. Platform Warning Messages

### 12.1 Motivation warning

> This appears to be a Motivation gap. A course alone is unlikely to change practice unless learners also receive leadership support, incentives, confidence-building, peer support, or accountability routines. Identify a separable Knowledge or Skill component before proceeding.

### 12.2 Environment warning

> This appears to be an Environment gap. A course cannot remove missing tools, policies, funding, time, safety risks, civic-space restrictions, or system barriers. Identify a separable Knowledge or Skill component before proceeding, and record the required non-course support.

### 12.3 Mixed route warning

> This is a Mixed gap. The course may proceed only for the clearly defined Knowledge or Skill component. Record the Motivation or Environment barriers so they can be routed to complementary support.

### 12.4 Needs further diagnosis warning

> The root cause is unclear. Do not create a course yet. Record the missing evidence, request validation, or route the case for further diagnosis.

### 12.5 Review warning

> Reviewers should check whether the built course still addresses the approved Knowledge or Skill component. If the course attempts to solve Motivation or Environment barriers through content alone, return it to Analysis or Design.

---

## 13. Review Rules

Reviewers should use the following questions during Analysis, Design, Build, and Review.

| Review question | Expected answer |
|---|---|
| Is the capacity gap clearly stated? | Yes |
| Is there a baseline/current practice statement? | Yes |
| Is the desired practice clear? | Yes |
| Is there an evidence source? | Yes |
| Is the target learner group specific? | Yes for course-addressable gaps |
| Is the K/S/M/E route recorded? | Yes |
| Is the course-fit decision recorded? | Yes |
| If Motivation or Environment is selected, is a separable K/S component recorded? | Required if proceeding |
| If Mixed is selected, are non-course barriers also recorded? | Yes |
| Is there a safeguards/no-harm note? | Yes |
| Is the course scope limited to the K/S component? | Yes |
| Does the Design phase avoid overclaiming? | Yes |
| Does monitoring avoid claiming full organizational capacity from course completion? | Yes |

---

## 14. Monitoring Interpretation Rules

K/S/M/E routing should shape how course outcomes are interpreted.

### 14.1 Knowledge and Skill courses

For Knowledge and Skill gaps, monitoring may track:

- enrollment;
- completion;
- final test attempts;
- final test pass rate;
- certificates issued at 80%+;
- learner feedback;
- practical proof submissions where enabled;
- verified achievements where proof is accepted;
- course improvement signals.

Monitoring may say:

> Learners completed a course addressing a validated Knowledge or Skill gap.

Monitoring should not automatically say:

> The organization has fully transformed its capacity.

### 14.2 Motivation and Environment components

For Motivation and Environment components recorded alongside the course, monitoring should preserve a caution note.

Monitoring may say:

> This course addressed the Knowledge/Skill component of a wider Motivation or Environment barrier. Additional support may still be required.

Monitoring should not say:

> The course solved the full organizational or enabling-environment barrier.

### 14.3 Mixed gaps

For Mixed gaps, dashboards should distinguish:

- course-addressed K/S component;
- remaining Motivation or Environment barrier;
- recommended complementary support;
- whether practical proof or verified achievement exists;
- whether organizational evidence is still limited.

---

## 15. Minimum Phase 1 Requirements

Phase 1 should implement the following minimum K/S/M/E features:

1. K/S/M/E route field in Analysis.
2. Course-fit decision field in Analysis.
3. Required evidence source, baseline, desired practice, and target learner group fields.
4. Ability to mark a gap as Mixed.
5. Ability to mark a gap as Needs further diagnosis.
6. Separable K/S component field for Motivation, Environment, or Mixed routes.
7. Non-course support note for Motivation/Environment/Mixed barriers.
8. Design unlock only for Knowledge, Skill, or partly course-addressable Mixed/K/S components.
9. Platform warning messages for Motivation, Environment, Mixed, and unclear cases.
10. Read-only display of K/S/M/E route in Design, Build, Review, and Monitoring.
11. Review checklist item confirming the course remains within the approved K/S scope.
12. Monitoring note explaining whether the course addressed a full Knowledge/Skill gap or only part of a Mixed gap.

---

## 16. Future Enhancements

Future phases may add:

- more advanced diagnosis questionnaires;
- participatory validation records;
- CSO self-assessment imports;
- evidence upload and review for diagnosis;
- recommended support pathways by capacity area;
- automated dashboard summaries of non-course barriers;
- coaching and mentoring workflow integration;
- peer learning group matching;
- links to advisory support, technical assistance, or enabling-environment action;
- stronger relationship between K/S/M/E findings and DEC program planning.

These should not delay the Phase 1 implementation of the core routing logic.

---

## 17. Implementation Guidance for Codex

Codex should treat this annex as a binding workflow-control document for Analysis Gate and course-fit logic.

Implementation principles:

1. Do not allow every capacity gap to become a course.
2. Keep Knowledge and Skill as the normal course-addressable routes.
3. Treat Motivation and Environment as non-course routes unless a separable K/S component exists.
4. Treat Mixed as a combination state, not a fifth root-cause category.
5. Treat Needs further diagnosis as a workflow state, not a capacity category.
6. Preserve non-course barriers in records so DEC can address them later.
7. Do not hide or discard Motivation/Environment issues.
8. Do not let course completion overclaim organizational transformation.
9. Make routing visible in Review and Monitoring.
10. Keep platform language clear for non-technical course creators.

Codex should avoid:

- hardcoding route logic only in UI without data records;
- allowing Design to unlock for Motivation/Environment-only gaps;
- treating Mixed as automatically course-addressable;
- using AI to override K/S/M/E diagnosis;
- turning non-course barriers into generic learning objectives;
- presenting certificates as proof of full organizational capacity.

---

## 18. Recommended Repo Placement

Recommended file path:

```text
docs/specs/core-workflow/ANNEX_05_KSME_ROUTING_AND_COURSE_FIT_DECISION_RULES.md
```

This annex should be read together with:

```text
docs/specs/core-workflow/ANNEX_01_SOURCE_OF_TRUTH_AND_OVERRIDE_NOTE.md
docs/specs/core-workflow/ANNEX_03_WORKFLOW_STATE_GATE_AND_RECORD_MATRIX.md
docs/specs/core-workflow/ANNEX_04_CSO_CAPACITY_TAXONOMY_AND_INDICATOR_MAPPING.md
docs/specs/core-workflow/ANNEX_06_BUILD_STUDIO_BLOCK_LIBRARY_SPECIFICATION.md
docs/specs/core-workflow/ANNEX_10_REVIEW_AND_PUBLISH_DECISION_ROUTING.md
docs/specs/core-workflow/ANNEX_11_MONITORING_EVALUATION_AND_DASHBOARD_DATA_SPECIFICATION.md
```

---

## 19. Success Standard for This Annex

This annex is successfully implemented when:

- every diagnosed CSO capacity gap must be classified before Design unlocks;
- Knowledge and Skill gaps can proceed to course design after the Analysis Handover is complete and locked;
- Motivation and Environment gaps are blocked from course production unless a separable K/S component is recorded;
- Mixed gaps proceed only for the clearly defined K/S component;
- unclear cases remain in diagnosis rather than becoming courses;
- non-course barriers are recorded and routed to complementary support;
- Review can check whether the course stayed within scope;
- Monitoring can interpret course results without overclaiming organizational transformation;
- Codex and developers can implement routing logic without ambiguity.

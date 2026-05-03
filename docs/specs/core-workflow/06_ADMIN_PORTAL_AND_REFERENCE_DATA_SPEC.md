# 06 — Admin Portal and Reference Data Specification

**Project:** DEC Learning Hub Course Creator Portal  
**File purpose:** Repo-ready implementation specification for the Admin Portal and reference-data foundation  
**Primary audience:** Codex / AI coding agents, developers, DEC Admins, ESSET/DEC reviewers  
**Recommended repo path:** `docs/specs/core-workflow/06_ADMIN_PORTAL_AND_REFERENCE_DATA_SPEC.md`  
**Status:** Phase 1 implementation guidance  

---

## 1. Purpose of This Specification

This specification defines the Admin Portal and reference-data foundation for the DEC Learning Hub Course Creator Portal.

The Admin Portal is not only a place for managing users. It is the control layer that makes the whole Course Creator Portal work as one governed, evidence-linked, role-aware, and traceable system.

The Admin Portal should allow authorized DEC Admins to manage:

- users and role assignments;
- course creators, reviewers, proof verifiers, publishers, and organization-level users;
- controlled lookup tables and dropdown values;
- Course Setup metadata and field behavior;
- approved diagnosis datasets and approved diagnosis records;
- workflow field metadata across Setup, Analysis, Design, Build, Review, Publish, and Monitoring;
- visibility, data safety, consent, and publication settings;
- certificate and recognition settings where these are configurable;
- audit records for important administrative changes.

The main implementation goal is:

> The platform should allow course creators to start course creation from approved DEC capacity evidence, not from a blank page or arbitrary topic idea.

This means the Admin layer must be built before the platform continues to expand hardcoded Course Setup, Analysis, Design, Build Studio, Review, Publish, or Monitoring dropdowns and form options.

---

## 2. Product Principle

The DEC Learning Hub Course Creator Portal is not a generic LMS, a blank-canvas course builder, or a simple content upload system.

It is a governed course creation workflow that helps DEC and selected course creators transform validated CSO capacity gaps into practical learning courses, final tests, certificates, optional practical proof pathways, verified achievements, and monitoring evidence.

Therefore, the Admin Portal should protect the following product principles:

1. **Course creation starts from approved evidence.**  
   Course creators should select an approved diagnosis dataset and approved diagnosis record before moving deeply into course design.

2. **Dropdowns and workflow options should not be hardcoded across screens.**  
   Controlled values should come from Admin-managed lookup tables wherever practical.

3. **The workflow should preserve traceability.**  
   Setup → Analysis → Design → Build → Review → Publish → Participant Runtime → Certificate → Practical Proof → Verified Achievement → Monitoring should remain connected.

4. **Admin manages the reference architecture.**  
   Admin controls the master lists, diagnosis data, role assignments, field metadata, and visibility rules that govern the portal.

5. **Phase 1 must remain practical.**  
   The Admin Portal should be strong enough to support real workflow governance, but it should avoid overbuilding complex enterprise features before the core workflow spine is stable.

---

## 3. Current Implementation Context

The current Codex-built frontend is a functional foundation and internal testing prototype. The main workflow exists, but many screens are still early, text-heavy, and not yet fully polished.

The `/admin` area is currently underdeveloped compared with the creator, review, and learner-facing paths. This makes the Admin Portal the next strategic foundation to build.

The Admin Portal should now become the source of controlled data for:

- Course Setup fields;
- capacity areas and sub-capacities;
- K/S/M/E routing values;
- course-fit decisions;
- target audience values;
- delivery and access settings;
- review tracks and review decisions;
- publish visibility values;
- final test and certificate settings;
- practical proof and badge settings;
- monitoring filters and dashboard categories.

Implementation should avoid duplicating or hardcoding these values inside individual frontend forms.

---

## 4. Source-of-Truth Relationship

This specification should be read together with the existing DEC core workflow specification package.

It should align with:

- `00_CORE_WORKFLOW_INDEX.md`
- `01_ANALYSIS_PHASE.md`
- `02_DESIGN_PHASE.md`
- `03_BUILD_PHASE.md`
- `04_REVIEW_AND_PUBLISH_PHASE.md`
- `05_MONITORING_AND_EVALUATION_PHASE.md`
- `Annex_1_Source_of_Truth_and_Override_Note.md`
- `Annex_2_Role_Action_and_Permission_Matrix.md`
- `Annex_3_Workflow_State_Gate_and_Record_Matrix.md`
- `Annex_4_CSO_Capacity_Taxonomy_and_Indicator_Mapping.md`
- `Annex_5_K_S_M_E_Routing_and_Course_Fit_Decision_Rules.md`
- `Annex_6_Build_Studio_Block_Library_Specification.md`
- `Annex_7_AI_Authoring_Guardrails_and_Review_Log.md`
- `Annex_8_Final_Test_and_Certificate_Specification.md`
- `Annex_9_Practical_Proof_Verified_Achievement_and_Badge_Specification.md`
- `Annex_10_Review_and_Publish_Decision_Routing.md`
- `Annex_11_Monitoring_Evaluation_and_Dashboard_Data_Specification.md`
- `Annex_12_Data_Safety_Consent_and_Visibility_Rules.md`
- `Annex_13_Codex_Implementation_Evidence_Pack_Template.md`

If this Admin specification conflicts with older implementation wording, Codex should follow the current source-of-truth hierarchy already defined in Annex 1 and preserve explicit binding rules.

---

## 5. Binding Rules Admin Must Protect

The Admin Portal must protect the following binding product rules.

### 5.1 Certificate Rule

- A final test score of **80% or above** means the participant passes the course and receives the automated course certificate.
- Practical proof is not required for the course certificate.
- Verified achievement or badge approval is not required for the course certificate.
- Any previous 90% certificate threshold wording is superseded.

Implementation implication:

- If certificate settings appear in Admin, the Phase 1 threshold should be fixed at 80%, or editable only by a protected DEC Admin control with strict validation and clear warning.
- No frontend copy should imply that 90% is required for the certificate.

### 5.2 Practical Proof and Badge Rule

- Practical proof, verified achievements, and badges are separate from the course certificate.
- Practical proof requires human review where enabled.
- AI must not verify proof or award badges.
- Raw proof is private by default.

### 5.3 Review and Publish Separation Rule

- Review confirms quality and readiness.
- Publish controls release, visibility, versioning, and participant access.
- A course should not become live simply because a creator built it or a reviewer approved it.
- Only authorized publishers or DEC Admins with publish authority should publish.

### 5.4 K/S/M/E Course-Fit Rule

- Knowledge and Skill gaps are normally course-addressable in Phase 1.
- Motivation and Environment gaps should not drive Phase 1 course production unless a separable Knowledge or Skill component is explicitly recorded.
- Mixed gaps may proceed only for the clearly defined Knowledge/Skill component.
- Unclear root causes should be marked as needing further diagnosis.

### 5.5 Data Safety Rule

- Raw proof should be private by default.
- Donor-facing or external visibility should use safe, consent-based summaries only.
- Sensitive safeguarding, protection, civic-space, or beneficiary-identifiable information should not be requested or exposed.
- Dashboards should avoid surveillance, ranking, or unsafe disclosure of CSOs, participants, or communities.

### 5.6 AI Rule

- AI may assist drafting, simplification, localization, feedback, quiz drafts, and block content.
- AI must work from approved Analysis and Design context.
- AI must not invent capacity gaps, baselines, evidence, target groups, indicators, course-fit decisions, final approval, certificates, proof verification, badges, or donor visibility decisions.
- AI output must remain subject to human review.

### 5.7 Participant-Facing Label Rule

- User-facing labels should use **Participant**, **Participants**, **Target Audience**, or **Course Participants** instead of “Learner” where possible.
- Backend names may remain unchanged if renaming them creates unnecessary technical risk.

---

## 6. Admin Portal Scope

The Admin Portal should support the following Phase 1 capabilities.

### 6.1 Core Admin Capabilities

DEC Admins should be able to:

- manage active users;
- assign and update roles;
- create and manage course creator accounts;
- create and manage reviewer assignments;
- assign practical proof verifiers;
- assign authorized publishers;
- manage organizations or CSO groups where supported;
- manage lookup categories and lookup values;
- manage Course Setup metadata and field behavior;
- manage diagnosis datasets;
- manage approved diagnosis records;
- approve, lock, archive, or deactivate records;
- control visibility of lookup values and records by role;
- view audit history for important changes;
- access certificate oversight;
- access publication and monitoring controls where already implemented.

### 6.2 What Admin Should Not Become in Phase 1

The Phase 1 Admin Portal should not overbuild:

- complex donor-facing portals;
- complex organization scoring engines;
- automated AI governance engines;
- fully dynamic no-code form builders;
- advanced workflow automation across all specialist roles;
- full enterprise data warehouse dashboards;
- complex permission inheritance beyond the current repo architecture.

Codex should implement a practical admin foundation that fits the existing repo structure and supports the immediate course creation workflow.

---

## 7. Recommended Admin Navigation

The Admin Portal should use a distinct workspace layout with clear role-aware navigation.

Recommended Admin navigation sections:

1. **Admin Dashboard**
2. **Users and Roles**
3. **Organizations / CSO Groups**
4. **Lookup Tables**
5. **Course Setup Metadata**
6. **Diagnosis Datasets**
7. **Diagnosis Records**
8. **Workflow Field Metadata**
9. **Review and Publish Controls**
10. **Certificate and Recognition Controls**
11. **Data Safety and Visibility Controls**
12. **Monitoring Configuration**
13. **Audit Log**

The UI should clearly indicate that this is an Admin workspace, separate from creator, reviewer, publisher, and participant-facing workspaces.

---

## 8. Admin Dashboard Requirements

The Admin Dashboard should provide a premium, clear, high-confidence overview of platform configuration and operational readiness.

Recommended dashboard cards:

- active course creators;
- active reviewers;
- active publishers;
- active proof verifiers;
- active lookup categories;
- active lookup values;
- approved diagnosis datasets;
- approved diagnosis records;
- records awaiting admin approval;
- courses blocked because diagnosis data is missing;
- courses approved for publish;
- certificates issued;
- proof submissions awaiting verification;
- recent admin changes.

Recommended dashboard sections:

1. **Configuration Health**  
   Shows whether required lookup categories and seed values exist.

2. **Diagnosis Evidence Readiness**  
   Shows approved datasets and diagnosis records available for creators.

3. **Role and Access Readiness**  
   Shows whether creators, reviewers, publishers, and verifiers are assigned.

4. **Workflow Alerts**  
   Shows missing configuration, inactive values used in active workflows, unpublished approved courses, and safety warnings.

5. **Recent Admin Activity**  
   Shows recent changes to lookup values, diagnosis records, roles, visibility settings, or approval status.

---

## 9. Admin-Controlled Reference Data Architecture

The Admin Portal should manage three connected layers of reference data.

| Layer | What Admin Controls | Why It Matters |
|---|---|---|
| Lookup Tables / Master Lists | Dropdown values such as delivery format, target audience, capacity area, K/S/M/E route, review decision, publish status, proof type | Prevents inconsistent field values and hardcoded frontend dropdowns |
| Approved Diagnosis / Analysis Data | Validated capacity gaps, assessment period, CSO group, region, capacity area, evidence source, baseline, root cause, course-fit decision | Ensures course creation starts from approved DEC evidence, not creator assumptions |
| Workflow Field Metadata | Which fields appear in each phase, which are required, read-only, inherited, editable, locked, visible to roles, visible in dashboards | Ensures Setup, Analysis, Design, Build, Review, Publish, and Monitoring behave as one coordinated system |

Admin therefore manages the reference architecture of the portal, not only a few dropdown menus.

---

## 10. Recommended Data Model

Codex should inspect the existing repo, database schema, Prisma models, local SQLite setup, and current route architecture before implementing. The tables below define product intent and recommended structure. Codex may adapt names and relations to the existing repo conventions, but should preserve the behavior.

### 10.1 `admin_lookup_categories`

Defines lookup table groups.

| Field | Purpose |
|---|---|
| `lookup_category_id` | Unique ID |
| `category_key` | Stable internal key, e.g. `delivery_formats`, `capacity_areas`, `review_decisions` |
| `category_name` | Human-readable name |
| `used_in_workflow_phase` | Setup, Analysis, Design, Build, Review, Publish, Monitoring, Cross-workflow |
| `description` | Explains what this lookup controls |
| `is_system_category` | Marks core system categories |
| `is_active` | Enables or disables the category |
| `created_by` | Audit |
| `created_at` | Audit |
| `updated_by` | Audit |
| `updated_at` | Audit |

Expected behavior:

- System categories may be protected from deletion.
- Admins may deactivate non-critical categories where safe.
- Categories should show count of active and inactive values.

### 10.2 `admin_lookup_values`

Stores actual dropdown values.

| Field | Purpose |
|---|---|
| `lookup_value_id` | Unique ID |
| `lookup_category_id` | Links value to category |
| `value_key` | Stable internal key |
| `display_label` | Frontend label shown to users |
| `description` | Explains the option |
| `help_text` | Optional guidance for forms |
| `parent_lookup_value_id` | Enables dependent dropdowns, e.g. Capacity Area → Sub-Capacity |
| `display_order` | Controls order in dropdowns |
| `is_active` | Appears in new forms if active |
| `is_system_locked` | Prevents casual editing/deletion |
| `visible_to_admin` | Admin visibility |
| `visible_to_creator` | Creator visibility |
| `visible_to_reviewer` | Reviewer visibility |
| `visible_to_participant` | Participant-facing visibility |
| `visible_in_monitoring` | Dashboard/filter visibility |
| `change_reason` | Required for major edits |
| `created_by` | Audit |
| `created_at` | Audit |
| `updated_by` | Audit |
| `updated_at` | Audit |

Expected behavior:

- Admins can add, edit, deactivate, reorder, and describe values.
- System-locked values cannot be deleted casually.
- Deactivated values should not appear in new creator forms but should remain visible on historical records where already used.
- Values should support role visibility flags.
- Parent-child values should support dependent dropdown behavior.

### 10.3 `admin_field_metadata`

Controls which fields appear in each workflow form and how they behave.

| Field | Purpose |
|---|---|
| `field_metadata_id` | Unique ID |
| `workflow_phase` | Setup, Analysis, Capacity Map, Action Map, Learning Design, Storyboard, Build, Final Test, Proof, Review, Publish, Monitoring |
| `form_section` | Course identity, Diagnosis selection, Safeguards, etc. |
| `metadata_key` | Stable field key, e.g. `selected_analysis_record_id` |
| `field_label` | Frontend label |
| `field_type` | Text, long text, dropdown, multi-select, date, number, user picker, record picker, status, boolean |
| `lookup_category_key` | Used when field is dropdown or multi-select |
| `required_rule` | Required, optional, conditional, system-generated |
| `editable_by_creator` | Yes/no |
| `editable_by_admin` | Yes/no |
| `read_only_after_lock` | Yes/no |
| `inherited_from` | Setup, Analysis, Design, Build, Review, Publish |
| `visible_to_creator` | Yes/no |
| `visible_to_reviewer` | Yes/no |
| `visible_to_participant` | Yes/no |
| `visible_in_dashboard` | Yes/no |
| `validation_rule` | Example: certificate threshold must be 80% |
| `help_text` | Guidance text |
| `display_order` | Form order |
| `is_active` | Enables/disables field |
| `created_by` | Audit |
| `created_at` | Audit |
| `updated_by` | Audit |
| `updated_at` | Audit |

Expected behavior:

- In Phase 1, this does not need to become a full no-code form builder.
- It should be used as an Admin-visible registry of workflow fields and as a basis for future dynamic form behavior.
- Where practical, existing forms should read lookup category bindings from this metadata.

### 10.4 `diagnosis_datasets`

Represents a completed DEC diagnosis exercise, assessment round, or approved capacity analysis dataset.

| Field | Purpose |
|---|---|
| `diagnosis_dataset_id` | Unique dataset ID |
| `dataset_code` | Example: `DEC-CSF-2026-R1` |
| `dataset_title` | Example: `CSF+ Partner CSO Capacity Diagnosis — Round 1` |
| `assessment_period_start` | Start date |
| `assessment_period_end` | End date |
| `program_or_project` | Example: EU CSF+ |
| `assessment_purpose` | Why the diagnosis was conducted |
| `regions_covered` | Regions included |
| `organization_group` | CSO group, cohort, consortium, partner type |
| `data_collection_methods` | Workshop, survey, interview, document review, assessment |
| `approved_by` | Admin/DEC lead |
| `approval_status` | Draft, Under Review, Approved, Archived |
| `approved_date` | Approval date |
| `visibility_scope` | Which creators can use this dataset |
| `notes` | Admin notes |
| `created_by` | Audit |
| `created_at` | Audit |
| `updated_by` | Audit |
| `updated_at` | Audit |

Expected behavior:

- Creators should only select from approved datasets.
- Admins can keep draft datasets hidden from creators.
- Archived datasets should remain available for historical traceability but not for new course creation unless explicitly reopened.

### 10.5 `diagnosis_records`

Contains specific approved diagnosis records or capacity gaps inside a dataset.

| Field | Purpose |
|---|---|
| `diagnosis_record_id` | Unique record ID |
| `diagnosis_dataset_id` | Links to dataset |
| `diagnosis_code` | Example: `AN-2026-001` |
| `diagnosis_title` | Short title of the capacity gap |
| `organization_id` | Specific CSO if applicable |
| `organization_group_id` | Group/cohort if applicable |
| `region` | Geographic filter |
| `sector_thematic_area` | Optional program/sector focus |
| `capacity_area` | Controlled capacity area |
| `sub_capacity` | Controlled sub-capacity |
| `indicator_standard_link` | Linked standard/indicator |
| `target_audience` | Participant group affected |
| `current_baseline` | What CSOs currently do or struggle with |
| `desired_practice` | What participants/CSOs should do better |
| `capacity_gap_statement` | Concrete gap statement |
| `evidence_source` | Workshop, assessment, document review, etc. |
| `root_cause_summary` | Why the gap exists |
| `ksme_route` | Knowledge, Skill, Motivation, Environment, Mixed |
| `separable_ks_component` | Required if route is Motivation/Environment/Mixed and course is allowed |
| `course_fit_decision` | Course-addressable, partly course-addressable, not course-addressable, further diagnosis required |
| `recommended_intervention_type` | Course, coaching, TA, peer learning, system support, non-course support |
| `priority_level` | Low, medium, high, critical |
| `safeguards_no_harm_note` | Safety constraints |
| `data_sensitivity_level` | Low, moderate, high, very high |
| `evaluation_anchor` | What evidence may later show progress |
| `recommended_course_focus` | Suggested focus if course-addressable |
| `approval_status` | Draft, Under Review, Approved, Archived |
| `approved_by` | Admin/DEC lead |
| `approved_date` | Approval date |
| `visibility_scope` | Which creators can use the record |
| `is_locked` | Prevents creator edits after approval |
| `notes` | Admin notes |
| `created_by` | Audit |
| `created_at` | Audit |
| `updated_by` | Audit |
| `updated_at` | Audit |

Expected behavior:

- Only approved diagnosis records should be selectable by creators.
- Diagnosis records should be read-only for creators once selected, unless Admin explicitly reopens or replaces them.
- Course creation should be blocked for diagnosis records marked `not_course_addressable` unless Admin has identified a separable Knowledge/Skill component and allowed a partial course response.

### 10.6 `admin_audit_log`

Tracks important admin actions.

| Field | Purpose |
|---|---|
| `audit_log_id` | Unique ID |
| `actor_user_id` | User who made the change |
| `actor_role` | Role at time of action |
| `action_type` | Created, updated, deactivated, approved, archived, role assigned, visibility changed, etc. |
| `entity_type` | Lookup category, lookup value, diagnosis dataset, diagnosis record, user role, field metadata, etc. |
| `entity_id` | Affected record ID |
| `previous_value` | Optional JSON/text summary |
| `new_value` | Optional JSON/text summary |
| `change_reason` | Required for major changes |
| `created_at` | Timestamp |

Expected behavior:

- Important actions should create audit records.
- At minimum, log changes to system-locked lookup values, diagnosis approval status, role assignments, publish-related settings, certificate thresholds, proof visibility, and data safety settings.

---

## 11. Required Initial Lookup Categories

The Admin system should seed required lookup categories and values so the platform can operate without hardcoded dropdowns.

### 11.1 Course Setup Lookups

Recommended categories:

- `course_code_prefix`
- `responsible_units`
- `target_audience_groups`
- `participant_experience_levels`
- `organization_types`
- `geographic_focus_areas`
- `course_languages`
- `delivery_formats`
- `access_types`
- `enrollment_methods`
- `course_levels`
- `course_types`
- `course_duration_units`
- `weekly_commitment_levels`
- `time_models`
- `content_duration_types`
- `learning_modes`
- `localization_needs`

### 11.2 Capacity and Diagnosis Lookups

Recommended categories:

- `capacity_areas`
- `sub_capacity_areas`
- `indicator_standards`
- `ksme_routes`
- `course_fit_decisions`
- `diagnosis_priority_levels`
- `evidence_sources`
- `recommended_intervention_types`
- `root_cause_categories`
- `data_sensitivity_levels`
- `safeguarding_risk_levels`

### 11.3 Design and Build Lookups

Recommended categories:

- `performance_goal_quality_flags`
- `required_action_types`
- `practice_activity_types`
- `storyboard_block_purposes`
- `block_families`
- `block_subtypes`
- `creator_added_block_justifications`
- `ai_assistance_modes`
- `ai_review_statuses`
- `accessibility_requirements`
- `localization_requirements`
- `low_bandwidth_alternatives`

### 11.4 Review and Publish Lookups

Recommended categories:

- `review_tracks`
- `review_decisions`
- `review_issue_severities`
- `specialist_review_types`
- `publish_statuses`
- `publish_visibility_modes`
- `enrollment_visibility_modes`
- `course_version_statuses`
- `archive_reasons`

### 11.5 Certificate, Proof, and Badge Lookups

Recommended categories:

- `final_test_question_types`
- `final_test_attempt_rules`
- `certificate_rule_types`
- `proof_enablement_statuses`
- `proof_submission_types`
- `proof_review_decisions`
- `proof_revision_reasons`
- `verified_achievement_types`
- `badge_statuses`
- `donor_safe_visibility_statuses`
- `consent_statuses`

### 11.6 Monitoring Lookups

Recommended categories:

- `monitoring_metric_groups`
- `dashboard_visibility_levels`
- `feedback_question_types`
- `course_improvement_signal_types`
- `course_improvement_statuses`
- `organization_summary_visibility_levels`

---

## 12. Seed Values for Priority Lookup Categories

Codex should seed at least the following values unless equivalent values already exist.

### 12.1 `capacity_areas`

1. Internal Governance and Leadership
2. Transparency and Accountability
3. Strategic Planning and Organizational Sustainability
4. Financial Management and Resource Mobilization
5. Human Resources, Inclusion, and Safeguarding
6. Evidence-Based Advocacy and Civic Engagement
7. Monitoring, Evaluation, Accountability, and Learning
8. Digital Skills and Data Use / IT Competencies
9. Networking, Partnerships, and Collective Action

### 12.2 `ksme_routes`

1. Knowledge
2. Skill
3. Motivation
4. Environment
5. Mixed
6. Needs Further Diagnosis

### 12.3 `course_fit_decisions`

1. Course-addressable
2. Partly course-addressable with separable Knowledge/Skill component
3. Not course-addressable
4. Needs further diagnosis
5. Route to non-course support

### 12.4 `delivery_formats`

1. Self-paced online
2. Cohort-based online
3. Blended online and workshop-supported
4. Facilitated online
5. In-person supported with digital resources
6. Hybrid cohort

### 12.5 `access_types`

1. Always open
2. Scheduled cohort
3. Time-bound access window
4. Invitation only
5. Pilot only
6. Internal DEC only
7. Archived / no new enrollment

### 12.6 `enrollment_methods`

1. Open enrollment
2. Admin-assigned
3. Organization-assigned
4. Invitation code
5. Cohort roster upload
6. Manual approval required

### 12.7 `target_audience_groups`

1. CSO executive directors / senior leaders
2. Program managers
3. MEAL staff
4. Finance and grants staff
5. Board members
6. Field officers
7. Safeguarding focal persons
8. Advocacy and communications staff
9. HR / operations staff
10. Volunteers / community facilitators
11. DEC staff
12. Consortium partner staff

### 12.8 `participant_experience_levels`

1. Introductory
2. Basic working knowledge
3. Intermediate practitioner
4. Advanced practitioner
5. Leadership / strategic level
6. Mixed experience group

### 12.9 `organization_types`

1. Local CSO
2. Grassroots/community-based organization
3. Women-led CSO
4. Youth-led CSO
5. Disability-focused CSO
6. Consortium member
7. DEC partner CSO
8. Network or coalition
9. DEC internal team
10. Other

### 12.10 `course_languages`

1. English
2. Amharic
3. Afan Oromo
4. Tigrinya
5. Somali
6. Afar
7. Sidama
8. Other

### 12.11 `geographic_focus_areas`

For Ethiopia, seed at least:

1. Addis Ababa
2. Afar
3. Amhara
4. Benishangul-Gumuz
5. Central Ethiopia
6. Dire Dawa
7. Gambela
8. Harari
9. Oromia
10. Sidama
11. Somali
12. South Ethiopia
13. South West Ethiopia Peoples'
14. Tigray
15. National / multi-region
16. Other

### 12.12 `review_tracks`

1. Instructional Design Review
2. Subject Matter Review
3. Capacity Alignment Review
4. Safeguarding / Civic-Space Review
5. Accessibility / Localization Review
6. Platform / Admin Review
7. Practical Proof Review Setup

### 12.13 `review_decisions`

1. Approve for Publish
2. Approve with minor fixes
3. Return to Build
4. Return to Design
5. Return to Analysis
6. Specialist Review Required
7. Not Approved / Pause

### 12.14 `publish_visibility_modes`

1. Draft only
2. Internal preview only
3. Pilot cohort
4. Assigned participants only
5. Organization-restricted
6. DEC program participants
7. Public catalog listing where approved
8. Archived / hidden

### 12.15 `proof_submission_types`

1. Completed worksheet
2. Redacted work sample
3. Action plan
4. Checklist evidence
5. Scenario response
6. Reflection with evidence
7. Template completion
8. Safe advocacy message draft
9. Budget or MEAL sample excerpt
10. Other safe evidence type

### 12.16 `proof_review_decisions`

1. Accepted
2. Accepted with note
3. Revision requested
4. Rejected
5. Unsafe evidence submitted — redaction required
6. Not enough evidence
7. Out of scope

### 12.17 `data_sensitivity_levels`

1. Low
2. Moderate
3. High
4. Very high — avoid collection

### 12.18 `consent_statuses`

1. Not requested
2. Requested
3. Granted
4. Declined
5. Withdrawn
6. Expired

---

## 13. Course Setup Metadata Foundation

The Admin Portal should define and manage Course Setup metadata so course creators complete a consistent setup form.

Recommended fields for the Course Setup form:

| Metadata Key | Field Label | Field Type | Required? | Lookup Category |
|---|---|---|---|---|
| `course_title` | Course Title | Short text | Yes | N/A |
| `course_short_title` | Short Display Title | Short text | Optional | N/A |
| `course_code` | Course Code | Short text / auto-generated | Recommended | `course_code_prefix` optional |
| `course_summary` | Course Summary | Long text | Yes | N/A |
| `course_rationale` | Why This Course Is Needed | Long text | Recommended | N/A |
| `course_owner_id` | Course Owner | User picker | Yes | Active course creators |
| `co_creators` | Co-Creators / Contributors | Multi-user picker | Optional | Active creators / SMEs |
| `responsible_unit` | Responsible DEC Unit / Team | Dropdown | Recommended | `responsible_units` |
| `target_audience` | Target Audience | Multi-select dropdown | Yes | `target_audience_groups` |
| `participant_profile` | Participant Profile Description | Long text | Recommended | N/A |
| `participant_level` | Participant Experience Level | Dropdown | Recommended | `participant_experience_levels` |
| `organization_type` | Target Organization Type | Multi-select dropdown | Recommended | `organization_types` |
| `geographic_focus` | Geographic / Program Focus | Multi-select dropdown | Optional | `geographic_focus_areas` |
| `course_language` | Course Language | Dropdown / multi-select | Yes | `course_languages` |
| `translation_required` | Translation Required? | Boolean | Recommended | N/A |
| `localization_notes` | Localization Notes | Long text | Optional | N/A |
| `delivery_format` | Delivery Format | Dropdown | Yes | `delivery_formats` |
| `access_type` | Access Type / Access Window | Dropdown | Yes | `access_types` |
| `enrollment_method` | Participant Enrollment Method | Dropdown | Recommended | `enrollment_methods` |
| `course_start_date` | Course Start Date | Date | Conditional | N/A |
| `course_end_date` | Course End Date | Date | Conditional | N/A |
| `estimated_total_effort_hours` | Total Participant Effort | Number | Recommended | N/A |
| `weekly_commitment` | Weekly Commitment | Dropdown | Recommended | `weekly_commitment_levels` |
| `content_duration_hours` | Media / Seat Time | Number | Optional | N/A |
| `selected_diagnosis_dataset_id` | Approved Diagnosis Dataset | Record picker | Yes | Approved diagnosis datasets |
| `selected_diagnosis_record_id` | Approved Diagnosis Record | Record picker | Yes | Approved diagnosis records |

Implementation expectations:

- Course Setup should pull dropdown values from Admin lookup values.
- Course Setup should require approved diagnosis selection before the creator can proceed deeply into Analysis/Design.
- Selected diagnosis data should be displayed as a locked reference.
- Creator should be allowed to add course-specific metadata but not rewrite approved diagnosis evidence.

---

## 14. Diagnosis Selection Behavior in Course Setup

Course creators should not create diagnosis/analysis data from scratch.

Expected behavior:

1. Creator starts a new course.
2. Creator enters basic course identity metadata.
3. Creator selects an approved Diagnosis Dataset.
4. The system filters approved Diagnosis Records from that dataset.
5. Creator selects one primary Diagnosis Record.
6. The system displays the selected diagnosis summary:
   - capacity area;
   - sub-capacity;
   - target audience;
   - region / organization group;
   - capacity gap statement;
   - current baseline;
   - desired practice;
   - root cause summary;
   - K/S/M/E route;
   - course-fit decision;
   - safeguards/no-harm note;
   - evaluation anchor.
7. If the diagnosis record is course-addressable, the workflow may proceed.
8. If the diagnosis record is partly course-addressable, the separable Knowledge/Skill component must be shown and locked.
9. If the diagnosis record is not course-addressable, the platform should block course creation and show a routing message.
10. If the diagnosis record needs further diagnosis, the platform should block Design unlock and show a clarification requirement.

Recommended filtering options:

- dataset;
- capacity area;
- sub-capacity;
- target audience;
- region;
- organization group;
- K/S/M/E route;
- course-fit decision;
- priority level;
- approval status.

---

## 15. Downstream Inheritance Rules

Once a course is linked to an approved diagnosis record, the selected diagnosis should guide the rest of the workflow.

| Workflow Area | Inherited / Controlled by Selected Diagnosis |
|---|---|
| Setup | Diagnosis dataset and diagnosis record selected; course-specific metadata added |
| Analysis | Approved diagnosis appears as read-only reference; creator should not invent baseline/root cause |
| Capacity Map | Capacity area, sub-capacity, target audience, indicator/standard, desired practice inherited |
| Action Map | Required actions and practice activities must respond to the selected gap |
| Learning Design | Learning pathway, assessment intent, accessibility, safeguards, and AI context inherit approved anchors |
| Storyboard | Blocks must link to required actions, minimum information, practice, assessment, proof, or safeguards |
| Build Studio | Blocks carry purpose tags and traceability metadata; added blocks need justification |
| Final Test | Questions align to taught content and required actions; certificate threshold remains 80% |
| Practical Proof | Proof configuration links to performance goal, action map, capacity area, and safety rules |
| Review | Reviewer checks whether course stayed aligned with approved diagnosis and design |
| Publish | Publisher confirms metadata, visibility, version, certificate rule, and release controls |
| Monitoring | Dashboards aggregate by course version, diagnosis, capacity area, target audience, certificate, proof, and achievement status |

---

## 16. User and Role Management

The Admin Portal should support role assignment and role visibility consistent with the existing role-action matrix.

### 16.1 Core Roles to Support

The system should support or logically distinguish:

- DEC Admin;
- Course Creator / Subject Matter Expert;
- Instructional Design Reviewer;
- Subject Matter Reviewer;
- DEC Capacity Lead;
- Safeguarding / Civic-Space Reviewer;
- Accessibility / Localization Reviewer;
- Platform / Admin Reviewer;
- Authorized Publisher;
- Participant;
- Organization Admin;
- Practical Proof Verifier;
- Donor / Partner Viewer, optional future role.

In early Phase 1, some specialist reviewer roles may be combined under broader reviewer/admin roles if the repo does not yet support granular permissions. However, the product logic should preserve the distinctions for future strengthening.

### 16.2 User Management Screens

Admin should be able to:

- view users;
- search users;
- filter by role, organization, active/inactive status;
- create or invite users where supported;
- assign roles;
- remove roles;
- deactivate users;
- assign users to organizations or CSO groups where supported;
- assign creators to courses;
- assign reviewers to review tracks;
- assign proof verifiers;
- assign authorized publishers;
- see recent user-role changes.

### 16.3 Role Boundary Rules

- Creators create, revise, preview, and submit.
- Reviewers review, approve, return, or request specialist review.
- Authorized publishers/admins publish.
- Participants complete courses, take final tests, receive certificates, and may submit practical proof.
- Practical Proof Verifiers review proof and make verification decisions.
- Organization Admins view only safe organization-level summaries where enabled.
- Donor/Partner viewers, if enabled later, see only safe consent-based summaries.

---

## 17. Lookup Table Manager UI Requirements

The Lookup Table Manager should be practical, safe, and premium-level.

Recommended layout:

- left column: lookup categories list;
- center/right panel: selected category values table;
- detail drawer/modal: create/edit lookup value;
- top filters: workflow phase, active/inactive, system/non-system, visible to role;
- search box;
- status chips;
- audit summary.

Each lookup category page should show:

- category name;
- category key;
- workflow phase used in;
- description;
- active/inactive status;
- system category status;
- number of active values;
- number of inactive values;
- last updated.

Each lookup value row should show:

- display label;
- value key;
- parent value if applicable;
- workflow visibility;
- role visibility;
- dashboard visibility;
- active/inactive status;
- system-locked status;
- display order;
- last updated.

Admin actions:

- create value;
- edit label/help text/description;
- reorder values;
- activate/deactivate value;
- set parent value;
- set role visibility;
- set dashboard visibility;
- record change reason for major edits.

Safety rules:

- Do not permanently delete values already used in records.
- Prefer deactivate over delete.
- System-locked values should require stronger warning and change reason.
- Historical records should continue showing old values even if inactive.

---

## 18. Diagnosis Dataset Manager UI Requirements

The Diagnosis Dataset Manager should allow Admins to manage assessment rounds and approved diagnosis datasets.

Recommended dataset list columns:

- dataset code;
- dataset title;
- program/project;
- assessment period;
- regions covered;
- organization group;
- number of diagnosis records;
- approval status;
- visibility scope;
- approved by;
- approved date;
- last updated.

Admin actions:

- create dataset;
- edit dataset metadata;
- upload/import records in a future enhancement if supported;
- mark under review;
- approve dataset;
- archive dataset;
- reopen dataset where authorized;
- manage visibility scope;
- view linked diagnosis records;
- view audit history.

Dataset approval behavior:

- Draft datasets should not appear in Course Setup selection.
- Under Review datasets should not appear unless Admin preview mode is active.
- Approved datasets should appear to authorized creators according to visibility scope.
- Archived datasets should not be selectable for new courses but should remain available for historical courses.

---

## 19. Diagnosis Record Manager UI Requirements

The Diagnosis Record Manager is one of the most important Admin features.

Recommended list columns:

- diagnosis code;
- diagnosis title;
- dataset;
- organization/organization group;
- region;
- capacity area;
- sub-capacity;
- target audience;
- K/S/M/E route;
- course-fit decision;
- priority;
- approval status;
- locked status;
- last updated.

Recommended detail view sections:

1. **Evidence Summary**
   - current baseline;
   - desired practice;
   - gap statement;
   - evidence source;
   - assessment period.

2. **Capacity Linkage**
   - capacity area;
   - sub-capacity;
   - indicator/standard link;
   - target audience;
   - organization group/region.

3. **Root Cause and Course Fit**
   - root cause summary;
   - K/S/M/E route;
   - separable Knowledge/Skill component;
   - course-fit decision;
   - recommended intervention type.

4. **Safety and Monitoring**
   - safeguards/no-harm note;
   - data sensitivity level;
   - evaluation anchor;
   - recommended course focus.

5. **Approval and Visibility**
   - approval status;
   - approved by;
   - approved date;
   - visibility scope;
   - locked status.

Admin actions:

- create diagnosis record;
- edit draft diagnosis record;
- approve diagnosis record;
- lock approved record;
- archive record;
- reopen record with reason;
- deactivate record for new course use;
- manage visibility scope;
- view linked courses using the record;
- view audit history.

Safety behavior:

- If `ksme_route = Motivation` or `Environment`, require explicit separable Knowledge/Skill component before allowing course-fit decision to be course-addressable.
- If no separable Knowledge/Skill component exists, Course Setup should block new course creation from this record.
- If `data_sensitivity_level = High` or `Very high`, show safety warnings in Setup, Build, Proof, Review, and Publish.

---

## 20. Workflow Field Metadata Manager UI Requirements

The Field Metadata Manager should allow Admins to see and eventually control how workflow fields behave.

Recommended list columns:

- workflow phase;
- form section;
- metadata key;
- field label;
- field type;
- lookup category;
- required rule;
- editable by creator;
- editable by admin;
- read-only after lock;
- inherited from;
- role visibility;
- dashboard visibility;
- active status.

Expected Phase 1 behavior:

- At minimum, provide an Admin-readable registry of workflow fields.
- Where safe, use field metadata to power field labels/help text/dropdown category binding.
- Do not attempt a full dynamic form builder unless the repo already supports that pattern.

---

## 21. Review and Publish Controls

Admin should be able to configure and oversee review and publish-related reference values.

Admin should manage:

- review tracks;
- review decisions;
- issue severity levels;
- specialist review types;
- publish statuses;
- publish visibility modes;
- archive reasons;
- course version statuses.

Admin should view:

- courses submitted for review;
- courses returned to Build/Design/Analysis;
- courses approved for Publish;
- published courses;
- archived/retired courses.

Admin should not accidentally bypass Review and Publish separation. If Admin override is implemented, it must require a recorded reason and audit log entry.

---

## 22. Certificate and Recognition Controls

Admin should oversee certificate and recognition settings, while preserving binding rules.

Admin-visible settings may include:

- final test question types;
- attempts allowed options;
- feedback settings;
- certificate template/status registry;
- certificate threshold display;
- practical proof enablement values;
- proof submission types;
- proof review decisions;
- badge/verified achievement types;
- donor-safe visibility statuses.

Rules:

- The certificate threshold must remain 80% in Phase 1.
- Certificate is based on final test score only.
- Practical proof is optional/additional where enabled.
- Verified achievement requires authorized human review.
- Raw proof remains private by default.

---

## 23. Data Safety and Visibility Controls

Admin should manage controlled values and settings that support safe visibility.

Recommended Admin controls:

- data sensitivity levels;
- safeguarding risk levels;
- donor-safe visibility statuses;
- consent statuses;
- organization summary visibility levels;
- proof visibility modes;
- dashboard visibility levels.

Default behavior:

- raw proof private by default;
- donor visibility disabled or limited to safe summaries by default;
- participant-level data restricted;
- organization-level summaries safe, aggregated, and consent-aware;
- high-risk data should trigger warnings and restrictions.

---

## 24. Monitoring Configuration

Admin should manage monitoring lookup values and view configuration readiness.

Admin should ensure monitoring records can be filtered by:

- course;
- course version;
- diagnosis dataset;
- diagnosis record;
- capacity area;
- sub-capacity;
- target audience;
- organization;
- region;
- final test pass/fail;
- certificate issued/not issued;
- practical proof status;
- verified achievement/badge status;
- course improvement flag.

Admin should not overbuild advanced dashboards before the data relationships are properly connected.

---

## 25. Route and UI Recommendations

Codex should inspect the existing App Router structure before choosing final route names.

Recommended route pattern:

```text
/admin
/admin/users
/admin/roles
/admin/organizations
/admin/lookups
/admin/lookups/[categoryKey]
/admin/course-setup-metadata
/admin/diagnosis-datasets
/admin/diagnosis-datasets/[datasetId]
/admin/diagnosis-records
/admin/diagnosis-records/[recordId]
/admin/field-metadata
/admin/review-publish
/admin/certificates
/admin/recognition
/admin/data-safety
/admin/monitoring-config
/admin/audit-log
```

If the existing repo has different route conventions, Codex should adapt while preserving the Admin Portal structure.

---

## 26. UI Quality Standard

The Admin Portal should not look like a raw database editor.

It should feel like a premium, clear, structured platform administration workspace.

UI expectations:

- role-aware Admin shell;
- clear sidebar navigation;
- page headers with purpose text;
- status badges and chips;
- cards for key metrics;
- clean tables with filters and search;
- empty states with next actions;
- safe edit forms with help text;
- change reason prompts for high-risk changes;
- visual distinction between draft, approved, archived, active, inactive, locked, and system values;
- clear warnings when changes affect active workflows;
- DEC brand alignment using the existing design tokens and style system;
- avoid exposing developer terms such as “slice,” “mock seed,” or “evidence pack” in the UI.

---

## 27. Implementation Sequencing for Codex

Do not ask Codex to build everything at once. The safest sequence is:

### Slice 1 — Plan-First Repo Inspection

Codex should inspect the repo and produce an implementation plan only.

Plan should identify:

- current schema and seed structure;
- current admin routes;
- current auth/session/role pattern;
- current UI shell components;
- hardcoded dropdowns that should eventually use Admin lookup values;
- safest implementation sequence;
- risks and files likely to change.

No code should be implemented in Slice 1.

### Slice 2 — Data Model and Seed Foundation

Implement:

- lookup categories;
- lookup values;
- field metadata foundation;
- diagnosis datasets;
- diagnosis records;
- admin audit log;
- initial seed values.

### Slice 3 — Admin Workspace Shell

Implement:

- admin dashboard;
- admin sidebar/navigation;
- route protection consistent with existing role system;
- configuration health cards;
- recent activity placeholder/initial version.

### Slice 4 — Lookup Table Manager

Implement:

- lookup category list;
- lookup value table;
- create/edit/deactivate/reorder values;
- system-locked warnings;
- role visibility controls where practical.

### Slice 5 — Diagnosis Dataset and Record Manager

Implement:

- dataset list/detail/create/edit/approve/archive;
- diagnosis record list/detail/create/edit/approve/lock/archive;
- K/S/M/E and course-fit validation;
- visibility scope.

### Slice 6 — User and Role Management

Implement:

- user list;
- role assignment;
- creator/reviewer/publisher/verifier assignment where repo supports it;
- audit role changes.

### Slice 7 — Connect Course Setup to Admin Data

Implement:

- Course Setup dropdowns read from Admin lookup values;
- approved diagnosis dataset picker;
- approved diagnosis record picker;
- locked diagnosis summary;
- course-fit blocking rules.

### Slice 8 — Convert Analysis to Approved Context Reference

Implement:

- selected diagnosis appears in Analysis as read-only reference;
- prevent creators from inventing core diagnosis anchors;
- allow only course-specific analysis notes where appropriate;
- preserve traceability into Design.

### Slice 9 — Expand Review, Publish, Certificate, Proof, Monitoring Integration

Implement after core Admin data is stable.

---

## 28. Acceptance Criteria

Codex implementation should satisfy the following criteria.

### 28.1 Admin Access and Navigation

- Admin users can access `/admin` and related admin routes.
- Non-admin users cannot access admin routes.
- Admin workspace has clear navigation and page hierarchy.
- Admin UI is visibly distinct from creator/reviewer/participant spaces.

### 28.2 Lookup Management

- Admin can view lookup categories.
- Admin can view lookup values under each category.
- Admin can create/edit/deactivate values where allowed.
- System-locked values cannot be casually deleted.
- Inactive values do not appear in new creator-facing dropdowns.
- Historical records can still display inactive values where already used.

### 28.3 Diagnosis Dataset and Record Management

- Admin can create and manage diagnosis datasets.
- Admin can create and manage diagnosis records.
- Only approved diagnosis records are selectable during Course Setup.
- Diagnosis records with non-course-addressable decisions block course creation.
- Motivation/Environment/Mixed records require separable Knowledge/Skill component to proceed.

### 28.4 Course Setup Integration

- Course Setup uses Admin-managed lookup values.
- Creator selects approved diagnosis dataset and record.
- Selected diagnosis appears as read-only approved context.
- Downstream workflow can inherit diagnosis anchors.

### 28.5 Role Management

- Admin can view users and roles.
- Admin can assign appropriate roles where supported.
- Creator, reviewer, publisher, verifier, and participant boundaries remain protected.

### 28.6 Binding Rules

- 80% certificate rule remains unchanged.
- Practical proof remains separate from certificate.
- Review and Publish remain separate.
- Raw proof remains private by default.
- AI outputs require human review.
- Course creation remains linked to approved capacity evidence.

### 28.7 Audit and Safety

- High-risk admin changes create audit records.
- Major changes require a change reason where practical.
- Admin UI warns before changes that affect active workflows.

---

## 29. Verification Expectations

After each implementation slice, Codex must provide an implementation evidence pack with:

1. plain-language product summary;
2. files changed;
3. routes/screens affected;
4. data/schema/migration changes;
5. workflow state/gate changes;
6. role and permission changes;
7. binding rule checks;
8. tests and verification performed;
9. manual verification steps;
10. screenshots or local URLs where relevant;
11. known gaps;
12. risks/decisions needed;
13. next smallest safe step.

Codex should run available checks such as:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

If commands differ in the repo, Codex should inspect `package.json` and use the actual available commands.

---

## 30. Manual Review Checklist for ESSET/DEC

After Codex implements the Admin foundation, ESSET/DEC should manually verify:

- Can Admin access the Admin Portal?
- Are non-admin users blocked from Admin routes?
- Can Admin see lookup categories?
- Can Admin see and manage lookup values?
- Are system-locked values protected?
- Are key DEC capacity areas seeded correctly?
- Are K/S/M/E values seeded correctly?
- Are course-fit decisions seeded correctly?
- Can Admin create an approved diagnosis dataset?
- Can Admin create an approved diagnosis record?
- Does Course Setup show approved datasets and records?
- Does Course Setup block non-course-addressable records?
- Does the selected diagnosis appear as locked context?
- Does certificate logic still say 80%?
- Is practical proof clearly separate from certificate?
- Are raw proof and donor visibility protected by default?
- Are Admin changes auditable?
- Is the UI clear, premium, and non-technical enough for DEC Admins?

---

## 31. Suggested Initial Codex Prompt After This File Is Added

Use the following prompt after placing this file in the repo.

```text
You are working in the DEC Learning Hub Course Creator Portal repo.

Plan first only. Do not implement yet.

Please inspect the current repo and read:
- docs/specs/core-workflow/06_ADMIN_PORTAL_AND_REFERENCE_DATA_SPEC.md
- the existing core workflow specs and annexes under docs/specs/core-workflow/
- the current Prisma/schema/seed files
- the current admin, studio, review, publish, learner, and shared UI routes/components

Task:
Prepare a detailed implementation plan for building the Admin Portal and reference-data foundation described in 06_ADMIN_PORTAL_AND_REFERENCE_DATA_SPEC.md.

The plan must cover:
1. current repo state relevant to admin implementation;
2. existing admin routes and gaps;
3. current role/session/permission pattern;
4. current schema and seed-data structure;
5. where dropdowns are currently hardcoded and should later move to Admin lookup data;
6. proposed data models or schema changes;
7. proposed seed-data changes;
8. proposed Admin UI routes and components;
9. how Course Setup will later consume approved diagnosis datasets and lookup values;
10. risks and migration/backfill considerations;
11. recommended implementation slices in safest order;
12. acceptance criteria for the first implementation slice;
13. verification commands you will run after implementation.

Constraints:
- Preserve the 80% certificate rule.
- Keep practical proof separate from certificate.
- Keep Review and Publish separate.
- Keep raw proof private by default.
- Do not introduce a generic LMS or blank-canvas course builder pattern.
- Do not rename backend learner objects unless there is a safe technical reason; use Participant/Target Audience in user-facing labels.
- Do not overbuild a full dynamic no-code form builder in Phase 1 unless the repo already supports it naturally.
- Do not implement until I approve the plan.

Return the plan in clear sections with files likely to change, route impacts, schema impacts, verification steps, and known risks.
```

---

## 32. Success Standard

The Admin Portal and reference-data foundation is successful when:

- DEC Admins can manage the core reference data that guides course creation;
- course creators no longer depend on hardcoded dropdowns and arbitrary course topics;
- Course Setup can start from approved diagnosis evidence;
- Analysis, Design, Build, Review, Publish, and Monitoring can preserve traceability;
- roles and responsibilities remain clear;
- binding rules are protected;
- data safety and consent are respected;
- the UI feels like a premium DEC administration workspace, not a raw database table;
- Codex can safely continue building the creator workflow on top of a controlled, Admin-managed data foundation.


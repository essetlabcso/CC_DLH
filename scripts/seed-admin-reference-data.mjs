import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const prismaDir = resolve(process.cwd(), "prisma");
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const databasePath = resolveSqliteFilePath(databaseUrl);

const categories = [
  {
    key: "geographic_focus_areas",
    name: "Geographic Focus Areas",
    phase: "cross-workflow",
    description: "Approved geographic focus areas for DEC course and diagnosis records.",
    values: [
      "Addis Ababa",
      "Afar",
      "Amhara",
      "Benishangul-Gumuz",
      "Central Ethiopia",
      "Dire Dawa",
      "Gambela",
      "Harari",
      "Oromia",
      "Sidama",
      "Somali",
      "South Ethiopia",
      "Southwest Ethiopia",
      "Tigray",
    ].map((label, index) => value(label, index + 1)),
  },
  {
    key: "ksme_routes",
    name: "K/S/M/E Routes",
    phase: "analysis",
    description: "Approved root-cause routing values for Knowledge, Skill, Motivation, Environment, and mixed diagnosis decisions.",
    values: [
      value("Knowledge", 1, "Course-addressable when the main gap is information, concept, or awareness."),
      value("Skill", 2, "Course-addressable when the main gap is practice, application, or performance."),
      value("Motivation", 3, "Usually not a Phase 1 course driver unless a separable Knowledge or Skill component is documented."),
      value("Environment", 4, "Usually routed outside course production unless a separable Knowledge or Skill component is documented."),
      value("Mixed", 5, "May proceed only for the clearly defined Knowledge or Skill component."),
      value("Unclear / needs further diagnosis", 6, "Use when evidence is not sufficient to route the gap safely."),
    ],
  },
  {
    key: "course_fit_decisions",
    name: "Course-Fit Decisions",
    phase: "analysis",
    description: "Approved decisions for whether a diagnosis record should proceed toward course creation.",
    values: [
      value("Course-addressable", 1),
      value("Partly course-addressable", 2),
      value("Blended support recommended", 3),
      value("Non-course support required", 4),
      value("Further diagnosis needed", 5),
      value("Not prioritized for Phase 1", 6),
    ],
  },
  {
    key: "delivery_formats",
    name: "Delivery Formats",
    phase: "setup",
    description: "Approved course delivery format options.",
    values: [
      value("Self-paced", 1),
      value("Facilitated online", 2),
      value("Blended", 3),
      value("Cohort-based", 4),
      value("Workshop-supported", 5),
      value("Offline-supported", 6),
    ],
  },
  {
    key: "access_types",
    name: "Access Types",
    phase: "publish",
    description: "Approved participant access modes for course release planning.",
    values: [
      value("Open internal", 1),
      value("Assigned", 2),
      value("Cohort-restricted", 3),
      value("Pilot-only", 4),
      value("Invitation-only", 5),
      value("Time-bound", 6),
    ],
  },
  {
    key: "enrollment_methods",
    name: "Enrollment Methods",
    phase: "publish",
    description: "Approved participant enrollment methods.",
    values: [
      value("Self-enroll", 1),
      value("Admin-assigned", 2),
      value("Organization-assigned", 3),
      value("Cohort-assigned", 4),
      value("Invitation-only", 5),
    ],
  },
  {
    key: "target_audience_groups",
    name: "Target Audience Groups",
    phase: "setup",
    description: "Approved Course Participant groups for course setup and diagnosis records.",
    values: [
      value("CSO leaders", 1),
      value("Board members", 2),
      value("Program staff", 3),
      value("MEAL staff", 4),
      value("Finance staff", 5),
      value("Safeguarding focal points", 6),
      value("Advocacy staff", 7),
      value("Field staff", 8),
      value("Volunteers", 9),
    ],
  },
  {
    key: "participant_experience_levels",
    name: "Participant Experience Levels",
    phase: "setup",
    description: "Approved experience-level options for Course Participants.",
    values: [
      value("Beginner", 1),
      value("Intermediate", 2),
      value("Advanced", 3),
      value("Mixed", 4),
    ],
  },
  {
    key: "organization_types",
    name: "Organization Types",
    phase: "admin",
    description: "Approved organization type values for DEC administration and diagnosis records.",
    values: [
      value("Local CSO", 1),
      value("Community-based organization", 2),
      value("Network", 3),
      value("Coalition", 4),
      value("Consortium member", 5),
      value("Implementing partner", 6),
      value("DEC staff/team", 7),
    ],
  },
  {
    key: "course_languages",
    name: "Course Languages",
    phase: "setup",
    description: "Approved language values for course setup and localization planning.",
    values: [
      value("English", 1),
      value("Amharic", 2),
      value("Afaan Oromo", 3),
      value("Somali", 4),
      value("Tigrinya", 5),
      value("Sidama", 6),
    ],
  },
  {
    key: "capacity_areas",
    name: "Core Capacity Areas",
    phase: "analysis",
    description: "The nine DEC Core Capacity Areas used across diagnosis, design, review, proof, and monitoring.",
    values: [
      "Internal Governance and Leadership",
      "Transparency and Accountability",
      "Strategic Planning and Organizational Sustainability",
      "Financial Management and Resource Mobilization",
      "Human Resources, Inclusion, and Safeguarding",
      "Evidence-Based Advocacy and Civic Engagement",
      "Monitoring, Evaluation, Accountability, and Learning",
      "Digital Skills and Data Use / IT Competencies",
      "Networking, Partnerships, and Collective Action",
    ].map((label, index) => value(label, index + 1)),
  },
  {
    key: "review_tracks",
    name: "Review Tracks",
    phase: "review",
    description: "Approved review tracks for quality, safety, accessibility, and platform readiness.",
    values: [
      value("Instructional Design Review", 1),
      value("Subject Matter Review", 2),
      value("Capacity Alignment Review", 3),
      value("Safeguarding / Civic-Space Review", 4),
      value("Accessibility / Localization Review", 5),
      value("Platform / Admin Review", 6),
      value("Practical Proof Review Setup", 7),
    ],
  },
  {
    key: "review_decisions",
    name: "Review Decisions",
    phase: "review",
    description: "Approved review decision values. Review approval confirms readiness; Publish remains a separate Admin action.",
    values: [
      value("Approve for Publish", 1),
      value("Approve with minor fixes", 2),
      value("Return to Build", 3),
      value("Return to Design", 4),
      value("Return to Analysis", 5),
      value("Specialist Review Required", 6),
      value("Not Approved / Pause", 7),
    ],
  },
  {
    key: "publish_visibility_modes",
    name: "Publish Visibility Modes",
    phase: "publish",
    description: "Approved visibility modes for authorized publication and release planning.",
    values: [
      value("Internal pilot", 1),
      value("Assigned participants only", 2),
      value("Organization-restricted", 3),
      value("Cohort-restricted", 4),
      value("Public to eligible participants", 5),
      value("Archived / hidden", 6),
    ],
  },
  {
    key: "practical_proof_types",
    name: "Practical Proof Types",
    phase: "build",
    description: "Approved practical proof types. Practical proof is separate from course certificates.",
    values: [
      value("Worksheet or template", 1),
      value("Work sample", 2),
      value("Action plan", 3),
      value("Reflection and application note", 4),
      value("Checklist", 5),
      value("Redacted document extract", 6),
      value("Safe advocacy message", 7),
      value("MEAL evidence output", 8),
      value("Budget justification sample", 9),
      value("Partnership or governance record", 10),
    ],
  },
  {
    key: "proof_review_decisions",
    name: "Proof Review Decisions",
    phase: "review",
    description: "Approved practical proof review decisions for human reviewers.",
    values: [
      value("Accepted", 1),
      value("Return for revision", 2),
      value("Rejected", 3),
      value("Needs safeguarding review", 4),
      value("Needs redaction", 5),
      value("Not enough evidence", 6),
    ],
  },
  {
    key: "safeguarding_risk_levels",
    name: "Safeguarding Risk Levels",
    phase: "cross-workflow",
    description: "Approved safeguarding risk levels for diagnosis, course design, proof, review, and publish readiness.",
    values: [
      value("Low", 1),
      value("Moderate", 2),
      value("High", 3),
      value("Very high / do not upload raw evidence", 4, "Raw sensitive evidence should not be uploaded."),
    ],
  },
  {
    key: "data_sensitivity_levels",
    name: "Data Sensitivity Levels",
    phase: "cross-workflow",
    description: "Approved data sensitivity levels. Raw proof remains private by default.",
    values: [
      value("Public / low sensitivity", 1),
      value("Internal", 2),
      value("Moderate", 3),
      value("High", 4),
      value("Very high / restricted", 5),
    ],
  },
  {
    key: "accessibility_requirements",
    name: "Accessibility Requirements",
    phase: "cross-workflow",
    description: "Approved accessibility requirements for participant-facing course design.",
    values: [
      value("Plain language", 1),
      value("Mobile-friendly", 2),
      value("Low-bandwidth alternative", 3),
      value("Captions required", 4),
      value("Transcript required", 5),
      value("Alt text required", 6),
      value("Printable version", 7),
      value("Translation/localization required", 8),
    ],
  },
  {
    key: "ai_assistance_settings",
    name: "AI Assistance Settings",
    phase: "build",
    description: "Approved AI assistance settings. AI output remains subject to human review.",
    values: [
      value("AI disabled", 1),
      value("AI drafting allowed with human review", 2),
      value("AI simplification allowed", 3),
      value("AI localization support allowed", 4),
      value("AI quiz draft allowed with human review", 5),
      value("AI restricted due to sensitivity", 6),
    ],
  },
];

const fieldMetadata = [
  {
    phase: "course_setup",
    section: "Course identity",
    fields: [
      field("course_title", "Course title", "text", 1, {
        requiredRule: "required",
        editableByCreator: true,
        helpText: "Main participant-facing course title.",
      }),
      field("course_short_title", "Course short title", "text", 2, {
        editableByCreator: true,
        helpText: "Short display title for compact course cards and tables.",
      }),
      field("course_code", "Course code", "text", 3, {
        helpText: "Stable DEC course identifier assigned or confirmed by Admin.",
      }),
      field("course_summary", "Course summary", "long_text", 4, {
        requiredRule: "required",
        editableByCreator: true,
        helpText: "Brief participant-facing summary of what the course covers.",
      }),
      field("course_rationale", "Course rationale", "long_text", 5, {
        editableByCreator: true,
        helpText: "Why this course is needed based on approved capacity evidence.",
      }),
      field("course_owner_id", "Course owner", "user_picker", 6, {
        requiredRule: "required",
        helpText: "Primary user responsible for the course draft.",
      }),
      field("co_creators", "Co-creators", "user_picker", 7, {
        helpText: "Additional course creators or subject matter contributors.",
      }),
      field("responsible_unit", "Responsible unit", "text", 8, {
        helpText: "DEC unit, team, or partner group responsible for stewardship.",
      }),
      field("target_audience", "Target Audience", "dropdown", 9, {
        lookupCategoryKey: "target_audience_groups",
        requiredRule: "required",
        editableByCreator: true,
        helpText: "Primary Course Participant group for this course.",
      }),
      field("participant_profile", "Participant profile", "long_text", 10, {
        editableByCreator: true,
        helpText: "Short profile of the Course Participants and their working context.",
      }),
      field("participant_level", "Participant level", "dropdown", 11, {
        lookupCategoryKey: "participant_experience_levels",
        editableByCreator: true,
        helpText: "Expected experience level of Course Participants.",
      }),
      field("organization_type", "Organization type", "dropdown", 12, {
        lookupCategoryKey: "organization_types",
        editableByCreator: true,
        helpText: "Type of organization the course is designed to support.",
      }),
      field("geographic_focus", "Geographic focus", "dropdown", 13, {
        lookupCategoryKey: "geographic_focus_areas",
        editableByCreator: true,
        visibleInDashboard: true,
        helpText: "Primary Ethiopian region or focus area for the course context.",
      }),
      field("course_language", "Course language", "dropdown", 14, {
        lookupCategoryKey: "course_languages",
        editableByCreator: true,
        helpText: "Primary language for participant-facing course content.",
      }),
      field("delivery_format", "Delivery format", "dropdown", 15, {
        lookupCategoryKey: "delivery_formats",
        editableByCreator: true,
        helpText: "How Course Participants are expected to take the course.",
      }),
      field("access_type", "Access type", "dropdown", 16, {
        lookupCategoryKey: "access_types",
        helpText: "Planned access control for participant availability.",
      }),
      field("enrollment_method", "Enrollment method", "dropdown", 17, {
        lookupCategoryKey: "enrollment_methods",
        helpText: "How Course Participants will be enrolled.",
      }),
      field("course_start_date", "Course start date", "date", 18, {
        helpText: "Optional planned start date for cohort or time-bound courses.",
      }),
      field("course_end_date", "Course end date", "date", 19, {
        helpText: "Optional planned end date for cohort or time-bound courses.",
      }),
      field("estimated_total_effort_hours", "Estimated total effort hours", "number", 20, {
        editableByCreator: true,
        helpText: "Estimated total participant effort required to complete the course.",
      }),
      field("weekly_commitment_level", "Weekly commitment level", "text", 21, {
        editableByCreator: true,
        helpText: "Expected weekly time commitment for Course Participants.",
      }),
      field("selected_diagnosis_dataset_id", "Selected diagnosis dataset", "record_picker", 22, {
        requiredRule: "required",
        helpText: "Approved diagnosis dataset that anchors the course.",
      }),
      field("selected_diagnosis_record_id", "Selected diagnosis record", "record_picker", 23, {
        requiredRule: "required",
        helpText: "Approved diagnosis record that supplies the course evidence anchor.",
      }),
    ],
  },
  {
    phase: "approved_diagnosis_reference",
    section: "Approved diagnosis context",
    inheritedFrom: "diagnosis_record",
    fields: [
      field("diagnosis_dataset_code", "Diagnosis dataset code", "text", 1),
      field("diagnosis_record_code", "Diagnosis record code", "text", 2),
      field("core_capacity_area", "Core Capacity Area", "dropdown", 3, {
        lookupCategoryKey: "capacity_areas",
        visibleInDashboard: true,
      }),
      field("capacity_practice_area", "Capacity Practice Area", "text", 4, {
        visibleInDashboard: true,
        helpText: "Workbook-aligned Capacity Practice Area, equivalent to older sub-capacity wording.",
      }),
      field("capacity_gap_statement", "Capacity gap statement", "long_text", 5),
      field("current_baseline", "Current baseline", "long_text", 6),
      field("desired_practice", "Desired practice", "long_text", 7),
      field("evidence_source_summary", "Evidence source summary", "long_text", 8),
      field("ksme_route", "K/S/M/E route", "dropdown", 9, {
        lookupCategoryKey: "ksme_routes",
        visibleInDashboard: true,
      }),
      field("separable_knowledge_skill_component", "Separable Knowledge/Skill component", "long_text", 10),
      field("course_fit_decision", "Course-fit decision", "dropdown", 11, {
        lookupCategoryKey: "course_fit_decisions",
        visibleInDashboard: true,
      }),
      field("safeguarding_no_harm_note", "Safeguarding and no-harm note", "long_text", 12),
      field("data_sensitivity_level", "Data sensitivity level", "dropdown", 13, {
        lookupCategoryKey: "data_sensitivity_levels",
        visibleInDashboard: true,
      }),
      field("evaluation_anchor", "Evaluation anchor", "long_text", 14),
      field("monitoring_anchor", "Monitoring anchor", "long_text", 15, {
        visibleInDashboard: true,
      }),
    ],
  },
  {
    phase: "design",
    section: "Design planning",
    inheritedFrom: "analysis",
    fields: [
      field("capacity_objective", "Capacity objective", "long_text", 1, { editableByCreator: true }),
      field("performance_goal", "Performance goal", "long_text", 2, { editableByCreator: true }),
      field("required_actions", "Required actions", "long_text", 3, { editableByCreator: true }),
      field("practice_activities", "Practice activities", "long_text", 4, { editableByCreator: true }),
      field("minimum_information", "Minimum information", "long_text", 5, { editableByCreator: true }),
      field("assessment_intent", "Assessment intent", "long_text", 6, { editableByCreator: true }),
      field("accessibility_localization_needs", "Accessibility and localization needs", "multi_select", 7, {
        lookupCategoryKey: "accessibility_requirements",
        editableByCreator: true,
      }),
      field("storyboard_block_plan", "Storyboard block plan", "long_text", 8, { editableByCreator: true }),
    ],
  },
  {
    phase: "build",
    section: "Build Studio",
    inheritedFrom: "design",
    fields: [
      field("lesson_title", "Lesson title", "text", 1, { editableByCreator: true }),
      field("block_type", "Block type", "dropdown", 2, { editableByCreator: true }),
      field("block_purpose", "Block purpose", "long_text", 3, { editableByCreator: true }),
      field("block_traceability_anchor", "Block traceability anchor", "text", 4, { editableByCreator: true }),
      field("creator_added_block_justification", "Creator-added block justification", "long_text", 5, { editableByCreator: true }),
      field("ai_assistance_status", "AI assistance status", "dropdown", 6, {
        lookupCategoryKey: "ai_assistance_settings",
        editableByCreator: true,
      }),
      field("accessibility_check_status", "Accessibility check status", "status", 7),
      field("safeguarding_check_status", "Safeguarding check status", "status", 8),
      field("final_test_configured", "Final test configured", "boolean", 9),
      field("practical_proof_enabled", "Practical proof enabled", "boolean", 10),
    ],
  },
  {
    phase: "review",
    section: "Review decision",
    fields: [
      field("review_track", "Review track", "dropdown", 1, {
        lookupCategoryKey: "review_tracks",
      }),
      field("review_decision", "Review decision", "dropdown", 2, {
        lookupCategoryKey: "review_decisions",
      }),
      field("reviewer_comments", "Reviewer comments", "long_text", 3),
      field("returned_to_phase", "Returned to phase", "text", 4),
      field("specialist_review_required", "Specialist review required", "boolean", 5),
      field("review_approval_status", "Review approval status", "status", 6),
    ],
  },
  {
    phase: "publish",
    section: "Publication record",
    fields: [
      field("publish_visibility_mode", "Publish visibility mode", "dropdown", 1, {
        lookupCategoryKey: "publish_visibility_modes",
      }),
      field("enrollment_method", "Enrollment method", "dropdown", 2, {
        lookupCategoryKey: "enrollment_methods",
      }),
      field("published_version_label", "Published version label", "text", 3),
      field("release_notes", "Release notes", "long_text", 4),
      field("published_by", "Published by", "user_picker", 5),
      field("published_at", "Published at", "date", 6),
    ],
  },
  {
    phase: "monitoring",
    section: "Monitoring signals",
    fields: [
      field("enrollment_count", "Enrollment count", "number", 1, { visibleInDashboard: true }),
      field("completion_rate", "Completion rate", "number", 2, { visibleInDashboard: true }),
      field("final_test_pass_rate", "Final test pass rate", "number", 3, { visibleInDashboard: true }),
      field("certificate_count", "Certificate count", "number", 4, { visibleInDashboard: true }),
      field("practical_proof_submission_count", "Practical proof submission count", "number", 5, { visibleInDashboard: true }),
      field("verified_achievement_count", "Verified achievement count", "number", 6, { visibleInDashboard: true }),
      field("feedback_summary", "Feedback summary", "long_text", 7, { visibleInDashboard: true }),
      field("course_improvement_flag", "Course improvement flag", "boolean", 8, { visibleInDashboard: true }),
    ],
  },
].flatMap((group) =>
  group.fields.map((item) => ({
    ...item,
    workflowPhase: group.phase,
    formSection: group.section,
    inheritedFrom: item.inheritedFrom ?? group.inheritedFrom ?? "",
  })),
);

mkdirSync(dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
const monitoringVisibleCategories = new Set([
  "geographic_focus_areas",
  "target_audience_groups",
  "capacity_areas",
  "ksme_routes",
  "course_fit_decisions",
  "data_sensitivity_levels",
]);

try {
  db.exec("BEGIN");

  const upsertCategory = db.prepare(`
    INSERT INTO "admin_lookup_categories" (
      "id",
      "categoryKey",
      "categoryName",
      "workflowPhase",
      "description",
      "isSystemCategory",
      "isActive",
      "updatedAt"
    )
    VALUES (?, ?, ?, ?, ?, true, true, CURRENT_TIMESTAMP)
    ON CONFLICT("categoryKey") DO UPDATE SET
      "categoryName" = excluded."categoryName",
      "workflowPhase" = excluded."workflowPhase",
      "description" = excluded."description",
      "isSystemCategory" = true,
      "isActive" = true,
      "updatedAt" = CURRENT_TIMESTAMP
  `);

  const upsertValue = db.prepare(`
    INSERT INTO "admin_lookup_values" (
      "id",
      "categoryId",
      "valueKey",
      "displayLabel",
      "description",
      "helpText",
      "displayOrder",
      "isActive",
      "isSystemLocked",
      "visibleToAdmin",
      "visibleToCreator",
      "visibleToReviewer",
      "visibleToParticipant",
      "visibleInMonitoring",
      "updatedAt"
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, true, true, true, true, true, false, ?, CURRENT_TIMESTAMP)
    ON CONFLICT("categoryId", "valueKey") DO UPDATE SET
      "displayLabel" = excluded."displayLabel",
      "description" = excluded."description",
      "helpText" = excluded."helpText",
      "displayOrder" = excluded."displayOrder",
      "isActive" = true,
      "isSystemLocked" = true,
      "visibleToAdmin" = true,
      "visibleToCreator" = true,
      "visibleToReviewer" = true,
      "visibleToParticipant" = false,
      "visibleInMonitoring" = excluded."visibleInMonitoring",
      "updatedAt" = CURRENT_TIMESTAMP
  `);

  const upsertFieldMetadata = db.prepare(`
    INSERT INTO "admin_field_metadata" (
      "id",
      "workflowPhase",
      "formSection",
      "metadataKey",
      "fieldLabel",
      "fieldType",
      "lookupCategoryKey",
      "requiredRule",
      "editableByCreator",
      "editableByAdmin",
      "readOnlyAfterLock",
      "inheritedFrom",
      "visibleToCreator",
      "visibleToReviewer",
      "visibleToParticipant",
      "visibleInDashboard",
      "validationRule",
      "helpText",
      "displayOrder",
      "isActive",
      "updatedAt"
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, CURRENT_TIMESTAMP)
    ON CONFLICT("workflowPhase", "metadataKey") DO UPDATE SET
      "formSection" = excluded."formSection",
      "fieldLabel" = excluded."fieldLabel",
      "fieldType" = excluded."fieldType",
      "lookupCategoryKey" = excluded."lookupCategoryKey",
      "requiredRule" = excluded."requiredRule",
      "editableByCreator" = excluded."editableByCreator",
      "editableByAdmin" = true,
      "readOnlyAfterLock" = excluded."readOnlyAfterLock",
      "inheritedFrom" = excluded."inheritedFrom",
      "visibleToCreator" = excluded."visibleToCreator",
      "visibleToReviewer" = excluded."visibleToReviewer",
      "visibleToParticipant" = excluded."visibleToParticipant",
      "visibleInDashboard" = excluded."visibleInDashboard",
      "validationRule" = excluded."validationRule",
      "helpText" = excluded."helpText",
      "displayOrder" = excluded."displayOrder",
      "isActive" = true,
      "updatedAt" = CURRENT_TIMESTAMP
  `);

  for (const category of categories) {
    const categoryId = categoryIdFor(category.key);

    upsertCategory.run(
      categoryId,
      category.key,
      category.name,
      category.phase,
      category.description,
    );

    for (const item of category.values) {
      upsertValue.run(
        valueIdFor(category.key, item.key),
        categoryId,
        item.key,
        item.label,
        item.description,
        item.helpText,
        item.displayOrder,
        monitoringVisibleCategories.has(category.key) ? 1 : 0,
      );
    }
  }

  for (const item of fieldMetadata) {
    upsertFieldMetadata.run(
      fieldMetadataIdFor(item.workflowPhase, item.key),
      item.workflowPhase,
      item.formSection,
      item.key,
      item.label,
      item.fieldType,
      item.lookupCategoryKey,
      item.requiredRule,
      item.editableByCreator ? 1 : 0,
      item.readOnlyAfterLock ? 1 : 0,
      item.inheritedFrom,
      item.visibleToCreator ? 1 : 0,
      item.visibleToReviewer ? 1 : 0,
      item.visibleToParticipant ? 1 : 0,
      item.visibleInDashboard ? 1 : 0,
      item.validationRule,
      item.helpText,
      item.displayOrder,
    );
  }

  db.exec("COMMIT");
  console.log(
    `Seeded ${categories.length} admin lookup categories and ${categories.reduce(
      (total, category) => total + category.values.length,
      0,
    )} system-locked lookup values.`,
  );
  console.log(`Seeded ${fieldMetadata.length} admin field metadata records.`);
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}

function value(label, displayOrder, description = "") {
  return {
    key: slugKey(label),
    label,
    description,
    helpText: description,
    displayOrder,
  };
}

function field(key, label, fieldType, displayOrder, options = {}) {
  return {
    key,
    label,
    fieldType,
    displayOrder,
    lookupCategoryKey: options.lookupCategoryKey ?? null,
    requiredRule: options.requiredRule ?? "optional",
    editableByCreator: options.editableByCreator ?? false,
    readOnlyAfterLock: options.readOnlyAfterLock ?? true,
    visibleToCreator: options.visibleToCreator ?? true,
    visibleToReviewer: options.visibleToReviewer ?? true,
    visibleToParticipant: options.visibleToParticipant ?? false,
    visibleInDashboard: options.visibleInDashboard ?? false,
    validationRule: options.validationRule ?? "",
    helpText: options.helpText ?? "",
    inheritedFrom: options.inheritedFrom,
  };
}

function categoryIdFor(categoryKey) {
  return `admin_lookup_category_${categoryKey}`;
}

function valueIdFor(categoryKey, valueKey) {
  return `admin_lookup_value_${categoryKey}_${valueKey}`;
}

function fieldMetadataIdFor(workflowPhase, metadataKey) {
  return `admin_field_metadata_${workflowPhase}_${metadataKey}`;
}

function slugKey(label) {
  return label
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("/", " ")
    .replaceAll("+", " plus ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveSqliteFilePath(value) {
  if (!value.startsWith("file:")) {
    throw new Error("Admin reference-data seeding only supports SQLite file: DATABASE_URL values.");
  }

  const filePath = value.slice("file:".length);

  if (filePath.startsWith("/") || /^[A-Za-z]:[\\/]/.test(filePath)) {
    return resolve(filePath);
  }

  return resolve(prismaDir, filePath);
}

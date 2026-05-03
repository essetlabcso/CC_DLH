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

const sampleDiagnosisDataset = {
  id: "diagnosis_dataset_dec_csf_2026_r1",
  datasetCode: "DEC-CSF-2026-R1",
  datasetTitle: "CSF+ Partner CSO Capacity Diagnosis — Round 1",
  assessmentPeriodStart: "2026-02-02T00:00:00.000Z",
  assessmentPeriodEnd: "2026-03-27T00:00:00.000Z",
  programOrProject: "EU CSF+",
  assessmentPurpose:
    "Validated capacity diagnosis to identify practical Knowledge and Skill gaps that can inform Phase 1 DEC Learning Hub course creation and complementary non-course support.",
  regionsCovered: [
    "Addis Ababa",
    "Amhara",
    "Oromia",
    "Sidama",
    "Somali",
    "Tigray",
  ],
  organizationGroup: "Selected local CSO partners / CSF+ cohort",
  dataCollectionMethods: [
    "Workshop",
    "Survey",
    "Interview",
    "Document review",
    "Facilitated validation",
  ],
  approvalStatus: "APPROVED",
  visibilityScope: "DEC_COURSE_CREATORS_INTERNAL_COURSE_CREATION",
  notes:
    "Internal demo/testing dataset using safe fictionalized summaries only. No raw interview, FGD, safeguarding, political, personal, or sensitive evidence is included.",
  approvedAt: "2026-04-10T00:00:00.000Z",
};

const sampleDiagnosisRecords = [
  diagnosisRecord({
    code: "DEC-CSF-R1-001",
    title: "Prepare concise outcome evidence notes",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Addis Ababa",
    coreCapacityArea: "Monitoring, Evaluation, Accountability, and Learning",
    capacityPracticeArea: "Outcome evidence and learning documentation",
    targetAudience: "MEAL staff / Program staff",
    currentBaseline:
      "Staff understand reporting requirements and collect routine monitoring data, but outcome statements are often too activity-focused.",
    gap:
      "Staff understand reporting requirements but cannot prepare concise outcome evidence statements from routine monitoring data.",
    desiredPractice:
      "Staff prepare a short outcome evidence note that links activity outputs, observed change, evidence source, and learning implication.",
    evidenceSource:
      "Fictionalized workshop exercise, survey summary, and validation discussion.",
    rootCauseSummary:
      "The main barrier is practice applying an evidence-note structure to routine monitoring data.",
    ksmeRoute: "Skill",
    courseFitDecision: "Course-addressable",
    recommendedCourseOrSupportTitle: "Writing outcome evidence notes",
    priorityLevel: "High",
    priorityRank: 1,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote:
      "Use anonymized examples and avoid raw participant details in practice activities.",
    safeSummaryForDashboard:
      "Course-addressable skill gap in turning monitoring data into concise outcome evidence.",
    evaluationAnchor:
      "Participant can produce a short outcome evidence note from a safe sample dataset.",
    monitoringSignal:
      "Quality of submitted outcome evidence notes improves in course practice tasks.",
    possiblePracticalProof: "MEAL evidence output",
    verifiedAchievementExample: "Accepted outcome evidence note using safe sample data.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-002",
    title: "Connect budget lines to activities and outputs",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Amhara",
    coreCapacityArea: "Financial Management and Resource Mobilization",
    capacityPracticeArea: "Donor budget justification",
    targetAudience: "Finance staff / Program staff",
    currentBaseline:
      "Staff can identify common budget categories but justification notes vary in clarity and completeness.",
    gap:
      "Staff know budget categories but struggle to justify how budget lines connect to activities, allowable costs, and expected outputs.",
    desiredPractice:
      "Staff prepare a clear budget justification note using a simple checklist.",
    evidenceSource: "Fictionalized document review and validation workshop summary.",
    rootCauseSummary:
      "The main barrier is skill in linking budget wording to activities, outputs, and allowability.",
    ksmeRoute: "Skill",
    courseFitDecision: "Course-addressable",
    recommendedCourseOrSupportTitle: "Budget justification checklist practice",
    priorityLevel: "High",
    priorityRank: 2,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote: "Use fictional budget lines and no real partner financial data.",
    safeSummaryForDashboard:
      "Course-addressable skill gap in writing donor-facing budget justifications.",
    evaluationAnchor:
      "Participant can draft a clear justification note for a fictional budget line.",
    monitoringSignal:
      "Practice submissions show clearer links between costs, activities, and outputs.",
    possiblePracticalProof: "Budget justification sample",
    verifiedAchievementExample: "Accepted fictional budget justification note.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-003",
    title: "Document board conflict-of-interest decisions",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Sidama",
    coreCapacityArea: "Internal Governance and Leadership",
    capacityPracticeArea: "Board decision records and conflict of interest",
    targetAudience: "Board members / CSO leaders",
    currentBaseline:
      "Board members discuss conflicts informally, but meeting records do not consistently show declarations or decisions.",
    gap:
      "Board members are unclear on what counts as conflict of interest and how to document declarations in meeting records.",
    desiredPractice:
      "Board members identify a conflict-of-interest situation and document the decision using a simple procedure.",
    evidenceSource: "Fictionalized governance checklist and facilitated validation.",
    rootCauseSummary:
      "The main barrier is knowledge of conflict-of-interest examples and documentation steps.",
    ksmeRoute: "Knowledge",
    courseFitDecision: "Course-addressable",
    recommendedCourseOrSupportTitle: "Conflict-of-interest documentation basics",
    priorityLevel: "Medium",
    priorityRank: 3,
    safeguardingRiskLevel: "Moderate",
    dataSensitivityLevel: "Internal",
    noHarmNote:
      "Use fictional governance scenarios and avoid naming real organizations or people.",
    safeSummaryForDashboard:
      "Course-addressable knowledge gap in recognizing and documenting conflict-of-interest decisions.",
    evaluationAnchor:
      "Participant can identify a conflict scenario and select the right documentation steps.",
    monitoringSignal:
      "Practice records include a declaration, recusal, decision, and follow-up note.",
    possiblePracticalProof: "Partnership or governance record",
    verifiedAchievementExample: "Accepted fictional board decision note.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-004",
    title: "Categorize feedback and apply safe escalation",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Somali",
    coreCapacityArea: "Transparency and Accountability",
    capacityPracticeArea: "Community feedback and complaint categorization",
    targetAudience: "Field staff / Safeguarding focal points",
    currentBaseline:
      "Staff collect community feedback, but sensitive complaint categories and referral pathways are not consistently applied.",
    gap:
      "Staff can collect feedback but often misclassify sensitive complaints or escalate them through informal channels.",
    desiredPractice:
      "Staff classify feedback using a simple category guide and apply safe referral/escalation rules.",
    evidenceSource: "Fictionalized feedback categorization exercise and validation notes.",
    rootCauseSummary:
      "The issue includes knowledge of categories and skill applying safe escalation rules.",
    ksmeRoute: "Mixed",
    separableKnowledgeSkillComponent:
      "Recognize feedback categories and apply safe escalation rules without collecting unnecessary sensitive data.",
    courseFitDecision: "Partly course-addressable",
    recommendedInterventionRoute:
      "Short course component plus organization-specific referral pathway support.",
    recommendedCourseOrSupportTitle: "Feedback categorization and safe escalation",
    priorityLevel: "High",
    priorityRank: 4,
    safeguardingRiskLevel: "High",
    dataSensitivityLevel: "High",
    noHarmNote:
      "Do not use real complaints. Training must use fictional examples and emphasize minimum necessary information.",
    safeSummaryForDashboard:
      "Partly course-addressable mixed gap in categorizing feedback and applying safe escalation rules.",
    evaluationAnchor:
      "Participant can classify fictional feedback and choose a safe escalation step.",
    monitoringSignal:
      "Practice tasks show correct category selection and safe referral decision-making.",
    possiblePracticalProof: "Checklist",
    verifiedAchievementExample: "Accepted safe escalation checklist using fictional examples.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-005",
    title: "Draft safe evidence-based advocacy messages",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Tigray",
    coreCapacityArea: "Evidence-Based Advocacy and Civic Engagement",
    capacityPracticeArea: "Safe evidence-based advocacy message",
    targetAudience: "Advocacy staff / CSO leaders",
    currentBaseline:
      "Staff can describe advocacy goals, but messages sometimes lack neutral wording, evidence boundaries, or no-harm checks.",
    gap:
      "Staff understand advocacy goals but need support to translate evidence into safe, non-inflammatory public messages.",
    desiredPractice:
      "Staff prepare a short advocacy message using evidence, neutral language, and no-harm checks.",
    evidenceSource: "Fictionalized message review exercise and validation summary.",
    rootCauseSummary:
      "The course-addressable part is drafting a safe message from non-sensitive evidence.",
    ksmeRoute: "Mixed",
    separableKnowledgeSkillComponent:
      "Draft a safe, evidence-based advocacy message that avoids personal data, unsupported claims, and risky wording.",
    courseFitDecision: "Partly course-addressable",
    recommendedInterventionRoute:
      "Short course component plus contextual review by authorized staff before external use.",
    recommendedCourseOrSupportTitle: "Safe evidence-based advocacy message drafting",
    priorityLevel: "High",
    priorityRank: 5,
    safeguardingRiskLevel: "High",
    dataSensitivityLevel: "High",
    noHarmNote:
      "Use fictional non-sensitive evidence only. Do not include personal data, political claims, or real public messaging.",
    safeSummaryForDashboard:
      "Partly course-addressable mixed gap in safe advocacy message drafting.",
    evaluationAnchor:
      "Participant can draft a neutral fictional advocacy message with no-harm checks.",
    monitoringSignal:
      "Practice messages avoid unsupported claims, personal data, and risky wording.",
    possiblePracticalProof: "Safe advocacy message",
    verifiedAchievementExample: "Accepted fictional advocacy message with no-harm checklist.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-006",
    title: "Address digital reporting access barriers",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Oromia",
    coreCapacityArea: "Digital Skills and Data Use / IT Competencies",
    capacityPracticeArea: "Digital reporting workflow",
    targetAudience: "Program staff / MEAL staff",
    currentBaseline:
      "Staff know the reporting requirement but cannot reliably access devices or connectivity during reporting windows.",
    gap:
      "Staff cannot submit digital reports consistently because device access and connectivity are unreliable.",
    desiredPractice:
      "Not course-addressable by itself; requires tool/access support, with only a possible future micro-guide if tools are available.",
    evidenceSource: "Fictionalized operational barrier summary and validation discussion.",
    rootCauseSummary:
      "The primary barrier is environmental access to devices and connectivity.",
    ksmeRoute: "Environment",
    courseFitDecision: "Non-course support required",
    recommendedInterventionRoute:
      "Operational support for device access, connectivity, and reporting workflow conditions.",
    recommendedCourseOrSupportTitle: "Not recommended for Phase 1 course creation",
    priorityLevel: "Medium",
    priorityRank: 6,
    safeguardingRiskLevel: "Moderate",
    dataSensitivityLevel: "Internal",
    noHarmNote:
      "Do not frame access barriers as individual performance gaps.",
    safeSummaryForDashboard:
      "Environment-only diagnosis showing that not every gap should become a course.",
    evaluationAnchor:
      "Track whether access conditions improve before considering any learning support.",
    monitoringSignal:
      "Reporting completion improves only if tool and connectivity barriers are addressed.",
    possiblePracticalProof: "",
    verifiedAchievementExample: "",
    courseCreationStatus: "NON_COURSE_SUPPORT",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-007",
    title: "Assess resource mobilization readiness",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Addis Ababa",
    coreCapacityArea: "Strategic Planning and Organizational Sustainability",
    capacityPracticeArea: "Resource mobilization readiness",
    targetAudience: "CSO leaders / Program staff",
    currentBaseline:
      "Teams can list funding ideas, but readiness checks for organizational fit and delivery capacity are inconsistent.",
    gap:
      "Staff need a simple method to assess whether an opportunity matches organizational priorities, capacity, and compliance requirements.",
    desiredPractice:
      "Staff apply a readiness checklist before deciding whether to pursue a funding opportunity.",
    evidenceSource: "Fictionalized opportunity-screening exercise and validation notes.",
    rootCauseSummary:
      "The gap combines knowledge of readiness criteria with skill applying a checklist.",
    ksmeRoute: "Mixed",
    separableKnowledgeSkillComponent:
      "Use readiness criteria to screen a fictional funding opportunity before escalation.",
    courseFitDecision: "Course-addressable",
    recommendedCourseOrSupportTitle: "Resource mobilization readiness checklist",
    priorityLevel: "Medium",
    priorityRank: 7,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote: "Use fictional opportunity examples only.",
    safeSummaryForDashboard:
      "Course-addressable mixed gap in screening resource mobilization opportunities.",
    evaluationAnchor:
      "Participant can complete a readiness checklist for a fictional opportunity.",
    monitoringSignal:
      "Practice checklists show clear rationale for pursue or do-not-pursue decisions.",
    possiblePracticalProof: "Checklist",
    verifiedAchievementExample: "Accepted fictional opportunity readiness checklist.",
  }),
  diagnosisRecord({
    code: "DEC-CSF-R1-008",
    title: "Clarify partnership roles and responsibilities",
    organizationGroup: "Selected local CSO partners / CSF+ cohort",
    region: "Oromia",
    coreCapacityArea: "Networking, Partnerships, and Collective Action",
    capacityPracticeArea: "Partnership role matrix",
    targetAudience: "Program staff / CSO leaders",
    currentBaseline:
      "Teams coordinate with partners, but roles, decision points, and follow-up owners are not consistently documented.",
    gap:
      "Staff struggle to translate partnership discussions into a simple role matrix with responsibilities and follow-up owners.",
    desiredPractice:
      "Staff prepare a basic role matrix for a fictional partnership scenario.",
    evidenceSource: "Fictionalized partnership planning exercise and validation summary.",
    rootCauseSummary:
      "The main barrier is skill in converting discussion outcomes into clear role documentation.",
    ksmeRoute: "Skill",
    courseFitDecision: "Course-addressable",
    recommendedCourseOrSupportTitle: "Partnership role matrix practice",
    priorityLevel: "Medium",
    priorityRank: 8,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    noHarmNote: "Use fictional partnership scenarios with no real partner names.",
    safeSummaryForDashboard:
      "Course-addressable skill gap in documenting partnership roles and follow-up owners.",
    evaluationAnchor:
      "Participant can complete a role matrix for a fictional partnership scenario.",
    monitoringSignal:
      "Practice matrices identify roles, decision points, and follow-up owners clearly.",
    possiblePracticalProof: "Partnership or governance record",
    verifiedAchievementExample: "Accepted fictional partnership role matrix.",
  }),
];

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

  const upsertDiagnosisDataset = db.prepare(`
    INSERT INTO "diagnosis_datasets" (
      "id",
      "datasetCode",
      "datasetTitle",
      "assessmentPeriodStart",
      "assessmentPeriodEnd",
      "programOrProject",
      "assessmentPurpose",
      "regionsCovered",
      "organizationGroup",
      "dataCollectionMethods",
      "approvalStatus",
      "visibilityScope",
      "notes",
      "approvedAt",
      "updatedAt"
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT("datasetCode") DO UPDATE SET
      "datasetTitle" = excluded."datasetTitle",
      "assessmentPeriodStart" = excluded."assessmentPeriodStart",
      "assessmentPeriodEnd" = excluded."assessmentPeriodEnd",
      "programOrProject" = excluded."programOrProject",
      "assessmentPurpose" = excluded."assessmentPurpose",
      "regionsCovered" = excluded."regionsCovered",
      "organizationGroup" = excluded."organizationGroup",
      "dataCollectionMethods" = excluded."dataCollectionMethods",
      "approvalStatus" = excluded."approvalStatus",
      "visibilityScope" = excluded."visibilityScope",
      "notes" = excluded."notes",
      "approvedAt" = excluded."approvedAt",
      "archivedAt" = NULL,
      "updatedAt" = CURRENT_TIMESTAMP
  `);

  const upsertDiagnosisRecord = db.prepare(`
    INSERT INTO "diagnosis_records" (
      "id",
      "datasetId",
      "diagnosisCode",
      "diagnosisTitle",
      "organizationGroup",
      "region",
      "sectorThematicArea",
      "coreCapacityArea",
      "capacityPracticeArea",
      "subCapacity",
      "indicatorStandardLink",
      "targetAudience",
      "currentBaseline",
      "desiredPractice",
      "capacityGapStatement",
      "evidenceSource",
      "rootCauseSummary",
      "ksmeRoute",
      "separableKnowledgeSkillComponent",
      "nonCourseBarrierSummary",
      "courseFitDecision",
      "recommendedInterventionRoute",
      "recommendedCourseOrSupportTitle",
      "priorityLevel",
      "priorityRank",
      "safeguardingRiskLevel",
      "dataSensitivityLevel",
      "noHarmNote",
      "safeSummaryForDashboard",
      "evaluationAnchor",
      "monitoringSignal",
      "possiblePracticalProof",
      "verifiedAchievementExample",
      "approvalStatus",
      "visibilityScope",
      "courseCreationStatus",
      "isLocked",
      "isActive",
      "approvedAt",
      "lockedAt",
      "updatedAt"
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT("datasetId", "diagnosisCode") DO UPDATE SET
      "diagnosisTitle" = excluded."diagnosisTitle",
      "organizationGroup" = excluded."organizationGroup",
      "region" = excluded."region",
      "sectorThematicArea" = excluded."sectorThematicArea",
      "coreCapacityArea" = excluded."coreCapacityArea",
      "capacityPracticeArea" = excluded."capacityPracticeArea",
      "subCapacity" = excluded."subCapacity",
      "indicatorStandardLink" = excluded."indicatorStandardLink",
      "targetAudience" = excluded."targetAudience",
      "currentBaseline" = excluded."currentBaseline",
      "desiredPractice" = excluded."desiredPractice",
      "capacityGapStatement" = excluded."capacityGapStatement",
      "evidenceSource" = excluded."evidenceSource",
      "rootCauseSummary" = excluded."rootCauseSummary",
      "ksmeRoute" = excluded."ksmeRoute",
      "separableKnowledgeSkillComponent" = excluded."separableKnowledgeSkillComponent",
      "nonCourseBarrierSummary" = excluded."nonCourseBarrierSummary",
      "courseFitDecision" = excluded."courseFitDecision",
      "recommendedInterventionRoute" = excluded."recommendedInterventionRoute",
      "recommendedCourseOrSupportTitle" = excluded."recommendedCourseOrSupportTitle",
      "priorityLevel" = excluded."priorityLevel",
      "priorityRank" = excluded."priorityRank",
      "safeguardingRiskLevel" = excluded."safeguardingRiskLevel",
      "dataSensitivityLevel" = excluded."dataSensitivityLevel",
      "noHarmNote" = excluded."noHarmNote",
      "safeSummaryForDashboard" = excluded."safeSummaryForDashboard",
      "evaluationAnchor" = excluded."evaluationAnchor",
      "monitoringSignal" = excluded."monitoringSignal",
      "possiblePracticalProof" = excluded."possiblePracticalProof",
      "verifiedAchievementExample" = excluded."verifiedAchievementExample",
      "approvalStatus" = excluded."approvalStatus",
      "visibilityScope" = excluded."visibilityScope",
      "courseCreationStatus" = excluded."courseCreationStatus",
      "isLocked" = excluded."isLocked",
      "isActive" = excluded."isActive",
      "approvedAt" = excluded."approvedAt",
      "lockedAt" = excluded."lockedAt",
      "archivedAt" = NULL,
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

  upsertDiagnosisDataset.run(
    sampleDiagnosisDataset.id,
    sampleDiagnosisDataset.datasetCode,
    sampleDiagnosisDataset.datasetTitle,
    sampleDiagnosisDataset.assessmentPeriodStart,
    sampleDiagnosisDataset.assessmentPeriodEnd,
    sampleDiagnosisDataset.programOrProject,
    sampleDiagnosisDataset.assessmentPurpose,
    JSON.stringify(sampleDiagnosisDataset.regionsCovered),
    sampleDiagnosisDataset.organizationGroup,
    JSON.stringify(sampleDiagnosisDataset.dataCollectionMethods),
    sampleDiagnosisDataset.approvalStatus,
    sampleDiagnosisDataset.visibilityScope,
    sampleDiagnosisDataset.notes,
    sampleDiagnosisDataset.approvedAt,
  );

  for (const item of sampleDiagnosisRecords) {
    upsertDiagnosisRecord.run(
      diagnosisRecordIdFor(item.code),
      sampleDiagnosisDataset.id,
      item.code,
      item.title,
      item.organizationGroup,
      item.region,
      item.sectorThematicArea,
      item.coreCapacityArea,
      item.capacityPracticeArea,
      item.capacityPracticeArea,
      item.indicatorStandardLink,
      item.targetAudience,
      item.currentBaseline,
      item.desiredPractice,
      item.gap,
      item.evidenceSource,
      item.rootCauseSummary,
      item.ksmeRoute,
      item.separableKnowledgeSkillComponent,
      item.nonCourseBarrierSummary,
      item.courseFitDecision,
      item.recommendedInterventionRoute,
      item.recommendedCourseOrSupportTitle,
      item.priorityLevel,
      item.priorityRank,
      item.safeguardingRiskLevel,
      item.dataSensitivityLevel,
      item.noHarmNote,
      item.safeSummaryForDashboard,
      item.evaluationAnchor,
      item.monitoringSignal,
      item.possiblePracticalProof,
      item.verifiedAchievementExample,
      item.approvalStatus,
      item.visibilityScope,
      item.courseCreationStatus,
      item.isLocked ? 1 : 0,
      item.isActive ? 1 : 0,
      item.approvedAt,
      item.lockedAt,
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
  console.log(
    `Seeded 1 sample diagnosis dataset and ${sampleDiagnosisRecords.length} sample diagnosis records for internal demo/testing.`,
  );
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

function diagnosisRecord(options) {
  return {
    sectorThematicArea: "CSO capacity strengthening",
    indicatorStandardLink: "",
    separableKnowledgeSkillComponent: "",
    nonCourseBarrierSummary: "",
    recommendedInterventionRoute: "Course creation",
    priorityLevel: "Medium",
    priorityRank: null,
    safeguardingRiskLevel: "Low",
    dataSensitivityLevel: "Internal",
    possiblePracticalProof: "",
    verifiedAchievementExample: "",
    approvalStatus: "APPROVED",
    visibilityScope: "DEC_COURSE_CREATORS_INTERNAL_COURSE_CREATION",
    courseCreationStatus: "READY_FOR_COURSE_SETUP",
    isLocked: true,
    isActive: true,
    approvedAt: "2026-04-11T00:00:00.000Z",
    lockedAt: "2026-04-11T00:00:00.000Z",
    ...options,
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

function diagnosisRecordIdFor(diagnosisCode) {
  return `diagnosis_record_${slugKey(diagnosisCode)}`;
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

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

  db.exec("COMMIT");
  console.log(
    `Seeded ${categories.length} admin lookup categories and ${categories.reduce(
      (total, category) => total + category.values.length,
      0,
    )} system-locked lookup values.`,
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

function categoryIdFor(categoryKey) {
  return `admin_lookup_category_${categoryKey}`;
}

function valueIdFor(categoryKey, valueKey) {
  return `admin_lookup_value_${categoryKey}_${valueKey}`;
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

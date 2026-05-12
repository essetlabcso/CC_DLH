# Reference Data Integration Audit Note

Date: 2026-05-12
Package: Package 9 - Reference Data Integration

## 1. Scope Summary
This document captures the state of Reference Data integrations within the Studio and Admin surfaces as of the finalization of Package 9.

## 2. Fully Dynamic Integrations
The following Reference Data categories are now fully managed by the Admin Lookup infrastructure (`AdminLookupCategory` / `AdminLookupValue`) and dynamically loaded via `getCourseSetupReferenceOptions`:
- `capacity_areas`
- `course_languages`
- `delivery_formats`
- `participant_experience_levels`
- `target_audience_groups`
- `ksme_routes`
- `course_fit_decisions`

**Design Decisions Applied:**
- **Value Sourcing**: Adopted a selective dual strategy to maximize system resilience. Specialized decision sets (KSME routes and course-fit decisions) correctly bind `value: valueKey` as stable keys. All other general setup categories (specifically `capacity_areas`) intentionally store their canonical `displayLabel` to protect Phase 1 anchor and diagnosis consistency.
- **Dynamic Expansion**: `isDecCapacityArea` has been updated to accept any non-empty string to facilitate scaling beyond static lists without re-deploying application binaries.

## 3. Hard-coded Dependencies and Deferred Integrations
The following domains remain explicitly hard-coded as part of the intentional decoupling strategy for Phase 1:

### 3.1. Analysis Gate Implementation
- **Status**: DEFERRED/HARDCODED.
- **Location**: `src/lib/studio/analysis-handover.ts`
- **Rationale**: The transition logic gating progress through the Studio workflow depends on rigid binary/trinary state machine flags (e.g., `PENDING`, `APPROVED`). Exposing these to purely user-editable dynamic lookups without backend orchestration logic risks breaking underlying workflow enforcement. Integration is deferred until the overall State Machine engine is refactored.

## 4. Safe Fallback Strategy & Deployment Readiness
In alignment with high availability and safety principles, core workflow paths now incorporate hardcoded fallback maps inside `setup-reference-options.ts`.

### 4.1. Built-in Fail-Safes
If standard lookup categories are absent from the runtime database (e.g., immediately following deployment before standard seeds have applied), the system will fallback to standard TypeScript constants for:
- Course Fit Decisions
- KSME Gap Routes
- Broad Capacity Areas (DEC Canonical Set)

### 4.2. Deployment Requirements
Non-critical categories (e.g., available Languages, Audience Groups, and Delivery Formats) do NOT possess internal application defaults. Administrators MUST execute standard data seed scripts to ensure these dropdowns populate successfully upon deployment.

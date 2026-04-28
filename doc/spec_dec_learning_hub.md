## A. Project Overview

### Phase 1 DEC Learning Hub Implementation Description

The **DEC Learning Hub** is the Phase 1 digital learning platform for the Capacity Development
Program for Local and Grassroots CSOs. In this phase, it is being implemented as a **working,
mobile-first, accessible, web-based learning system** with two tightly connected sides: a
**learner-facing platform** for local CSO users and a **creator-facing portal** for DEC staff and
authorized course creators to design, build, review, preview, and improve structured digital
courses. Phase 1 is not a generic LMS, not a document repository, and not a blank-canvas
authoring tool. It is a governed learning platform built to produce practical, structured,
context-grounded courses for local CSO capacity strengthening.
At product level, the Phase 1 DEC Learning Hub should be understood as a **single integrated
system** that combines:
● a learner-facing learning experience,
● a creator-facing course production workspace,
● controlled review and publishing flow,
● and the core platform foundation needed for secure access, structured content, learner
progress, assessments, certificates, and monitoring.
The core purpose of Phase 1 is to move DEC from one-off training delivery and static content
sharing into a reusable digital learning service. That service must allow DEC to:
● digitize and deliver priority CSO learning content,
● create and manage courses through a structured internal workflow,
● provide learners with a clear and usable course experience,
● track learning progress and completion,
● and improve courses over time based on actual use.
Phase 1 is intentionally bounded. It focuses on delivering the **foundation-stage product** that is
fully usable in its own right. That means the implementation must concentrate on the essential
platform areas and working journeys that have to function end to end in this phase:
● creator signs in and creates a course,
● creator moves through course setup, diagnosis, mapping, storyboard, build, preview,
review, and monitoring,
● reviewer or authorized role can assess readiness and control forward movement,
● learner can access assigned or available courses,
● learner can move through modules and lessons, complete checks, and receive course
completion certificate as evidence (configured in the system)


The creator-side workflow is especially important in Phase 1 because the DEC Learning Hub is
not meant to generate generic courses. The course creation system must help creators turn real
CSO challenges into practical learning experiences. To do that, Phase 1 uses a structured
workflow that captures:
● the course basics,
● the diagnosed learner problem,
● the relevant capacity area,
● the intended learner actions,
● the storyboard and lesson structure,
● and finally the built content, learner preview, review state, and monitoring signals.
This means the portal is not just a content editor. It is a **workflow-driven course production
system** where each stage feeds the next, and where the structured design record later supports
stronger AI-assisted authoring and more meaningful monitoring.
From a user perspective, Phase 1 includes at least four important product surfaces:
● **Learner workspace** for course access and completion,
● **Creator workspace** for structured course production,
● **Reviewer / publisher workflow surface** for controlled review and forward movement,
● **Admin / governance surface** for platform oversight, user control, and settings within
Phase 1 needs.
From an implementation perspective, the product stance for Phase 1 is clear:
● structured over freeform,
● governed over ad hoc,
● version-aware over mutable live editing,
● learner-usable over feature-heavy,
● and workflow-connected over disconnected screens.
The technical direction already established for DEC supports this through a schema-first,
block-based, version-aware architecture with controlled routes, role-aware workspaces,
and support for AI-native authoring workflows inside approved boundaries.

### What this section means for the full-stack team

The full-stack team should read Phase 1 as the implementation of a **complete first operational
release** , not a prototype shell. The system delivered in this phase must be usable, reviewable,
and testable as a real DEC product. The learner side, creator side, core role separation, content
lifecycle, and course workflow all need to work together as one product. The team should not
treat the creator portal, learner runtime, and governance functions as disconnected modules
built in isolation. They are parts of the same integrated system and must be implemented that
way.


### Phase 1 project overview — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub** should therefore be treated as:
A secure, structured, mobile-first digital learning platform for local CSO capacity strengthening,
comprising a learner-facing learning portal and an internal creator workflow system that enables
DEC to create, review, deliver, and improve practical digital courses through a governed
end-to-end process.

## B. Product Scope

### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 product scope** defines the exact product boundary for the first operational
release of the DEC Learning Hub. Its purpose is to keep implementation disciplined, prevent
scope drift, and ensure that the full-stack team builds a usable, testable, and reviewable
learning platform rather than a partial prototype or an overextended future-state system. In this
phase, the DEC Learning Hub must be implemented as a **working digital learning platform**
with the core surfaces, workflows, and system behaviors needed for course creation, learner
delivery, controlled review, and course improvement.
Phase 1 is not intended to deliver every capability that may later exist in the wider DEC
Learning Hub vision. It is intended to deliver the **foundation-stage release** that can already
function as a real DEC service. The scope must therefore stay concentrated on the product
areas that are essential for creating, delivering, reviewing, and monitoring digital CSO learning
content in a structured way.

### B.1 In-scope product capabilities for Phase 1

The following product capabilities are in scope and must be treated as implementation
requirements for Phase 1.

**1. Learner-facing digital learning platform**
Phase 1 must include a learner-facing platform where authorized learners can:
    ● sign in and access the learning environment
    ● view assigned or available courses
    ● open course modules and lessons
    ● progress through structured digital learning content
    ● interact with supported blocks and learning activities


● complete configured checks and assessments
● view progress
● receive completion certificates
This learner-facing layer is part of the Phase 1 product and must work as an actual user
experience, not only as backend support for the creator portal.

**2. Course Creator Portal**
Phase 1 must include the full creator workflow surface for DEC staff and authorized creators.
This includes the connected workflow pages and supporting workspace needed to:
    ● start and manage courses
    ● define course metadata
    ● capture diagnosis findings
    ● map the course into a capacity area
    ● define action logic
    ● create storyboard structure
    ● build lesson content using approved block types
    ● preview learner runtime
    ● review readiness
    ● and monitor course-level performance after use
This creator portal is a core Phase 1 deliverable and must function as a complete internal
production environment.
**3. Controlled review and forward movement**
Phase 1 must include a controlled path for a course to move from creator build state into review
readiness and onward into approved use. Even if the publishing model is role-sensitive and
narrower than a mature later-state system, this phase must still support:
    ● creator-side final review
    ● readiness checks
    ● submission for review
    ● reviewer or authorized role access to submitted content
    ● controlled movement of content forward
The Phase 1 product cannot rely on informal manual handoffs outside the system.
**4. Structured content model and lesson runtime**
Phase 1 must implement the structured content model needed to support authoring and runtime
parity. That includes:
    ● courses


● modules
● lessons
● governed block types
● supported interactive elements
● learner runtime rendering
● preview rendering from draft content
● completion and learner flow logic appropriate to the supported lesson types
This is necessary because DEC is defined as a structured, schema-first learning platform rather
than a freeform slide product.

**5. AI-assisted authoring inside the creator workflow**
Phase 1 must include AI-assisted authoring support within approved creator workflow surfaces,
especially Storyboard and Build. This includes AI support to:
    ● draft lesson structure from storyboard context
    ● draft lesson blocks
    ● suggest contextual examples
    ● generate practical exercises and checks
    ● support scenario drafting where applicable
    ● simplify and refine language
    ● and improve lesson content using approved source/context inputs
AI in Phase 1 must operate as creator support inside the workflow, not as an ungoverned
autonomous course generator.
**6. Preview and course-quality checking**
Phase 1 must include the ability to preview the course as a learner-facing experience before
final submission. It must also include creator-facing review checks for:
    ● completeness
    ● structure
    ● activity presence
    ● readability
    ● accessibility basics
    ● and submission readiness
This is a required product capability, not an optional QA extra.
**7. Monitoring and course improvement view**
Phase 1 must include a creator-facing monitoring view that helps course owners see how a
course is performing after use. This should include:


● basic course-level overview
● learner progress patterns
● lesson performance
● checks and scenario performance where relevant
● signals useful for course improvement
● and a revision path from monitoring back into creator workflow
This monitoring layer should be course-specific and tied to the course’s own design logic.

**8. Secure access, roles, and workflow-aware navigation**
Phase 1 must include:
    ● authenticated access
    ● protected workspaces
    ● role-aware navigation
    ● separation between learner and creator/admin surfaces
    ● and the core access controls needed for a functioning multi-user platform
The product cannot be treated as a front-end shell with informal permissions. Role and
workspace boundaries are part of Phase 1 scope.
**9. Mobile-first, accessible, web-based delivery**
Phase 1 must deliver:
    ● responsive web access
    ● mobile-first design
    ● accessibility requirements aligned to the agreed baseline
    ● and usability appropriate for the intended DEC audience
This is a core part of the Phase 1 promise and not a later enhancement.

### B.2 In-scope implementation outcomes

To count as delivered in Phase 1, the product scope above must result in these implementation
outcomes:
● a creator can sign in, create a course, move through the full workflow, build content,
preview it, review it, and submit it
● an authorized role can assess the course in review state and control its forward
movement
● a learner can sign in, access a course, move through lessons, interact with checks and
supported content, and complete the course flow


● the system can track learner progress and support completion evidence such as
certificates where configured
● the course can later be reopened in Monitoring so the creator can judge what to improve
These outcomes must be visible and testable in the working product.

### B.3 Out-of-scope capabilities for Phase 1

The following items are outside the product scope of Phase 1 and must not be treated as
required implementation targets for this release.

**1. Broad ecosystem and collaboration functions**
Phase 1 does not include:
    ● community of practice systems
    ● peer-to-peer learning networks
    ● broader collaborative sector exchange spaces
    ● large-scale external knowledge-sharing systems
**2. Operational non-course workflows beyond learning production**
Phase 1 does not include:
    ● operational referral mechanisms
    ● sub-grant processing workflows
    ● advocacy/policy action systems
    ● broader institutional support mechanisms outside the course workflow
**3. Mature knowledge hub functions beyond course production and delivery**
Phase 1 does not include the full knowledge hub or resource ecosystem beyond what is
required to support course authoring and learning delivery in this release.
**4. Broader future-state platform expansion**
Phase 1 does not include:
    ● later-phase ecosystem services
    ● expanded opportunity systems
    ● additional product surfaces not required for the core learning platform
    ● broad future-state integrations beyond what is needed for the phase foundation


These items should not be partially designed into the Phase 1 implementation in ways that
complicate delivery or blur the boundary of the release. The architecture may remain ready for
future extension, but the Phase 1 implementation itself must stay within scope.

### B.4 Scope discipline rules for the implementation team

To keep Phase 1 coherent, the full-stack team should apply the following scope discipline:
● treat the learner platform and creator portal as **required product surfaces** , not optional
follow-on work
● do not implement speculative future product features unless they are directly necessary
for Phase 1 working behavior
● do not replace structured course workflow with generic CMS behavior
● do not overbuild collaboration or ecosystem layers that sit outside the course creation
and learning delivery scope
● do not treat analytics, review, or monitoring as later add-ons if they are required to make
the Phase 1 product complete
● do not remove required Phase 1 workflow steps in order to simplify implementation
This matters because DEC’s architecture and acceptance logic rely on truthful, bounded
delivery rather than scaffolded claims.

### B.5 Phase 1 deliverable reading for implementation

From the implementation point of view, the full-stack team should read Phase 1 scope as:
Build the first complete DEC Learning Hub release that allows DEC to create, review, deliver,
and improve practical digital CSO learning courses through a working learner platform and a
structured internal creator workflow.
That means Phase 1 is neither:
● a narrow technical scaffold,
● nor a reduced design prototype,
● nor a partial creator-only environment.
It is a bounded but complete first release of the product.


### B.6 Product Scope — validated implementation reading

For implementation purposes, the **Phase 1 product scope** is therefore:
● **in scope:** learner platform, creator portal, review/forward workflow, structured lesson
runtime, AI-assisted authoring, preview, monitoring, secure access, responsive delivery
● **out of scope:** broader future ecosystem functions, non-course operational systems, and
later-phase expansion beyond the core learning platform boundary

## C. User Types and Roles

### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 DEC Learning Hub** must implement a clear and enforceable user-role model.
This is necessary because the platform includes multiple workspaces with different
responsibilities: learner-facing course use, creator-side course production, controlled review and
forward movement, and platform administration. The system must not rely on informal
assumptions about who can access which pages or perform which actions. User type, role, and
permission boundaries must be explicit in the interface, the route structure, and the backend
logic.
For Phase 1, the platform should recognize **four primary user roles** :
● **Learner**
● **Creator**
● **Reviewer / Publisher**
● **Admin**
These are product roles, not only technical labels. Each role must have:
● a clear workspace entry point
● clear route access rules
● visible navigation appropriate to the role
● allowed actions
● restricted actions
● and system-level enforcement behind the interface
The platform should be implemented so that users only see the workspaces, pages, and actions
relevant to their role. Learners must not see creator or admin controls. Creators must not see
publishing or governance controls unless their permissions allow it. Admin tools must remain
restricted to authorized roles only.


### C.1 Learner

The **Learner** is the user who enters the learner-facing DEC Learning Hub to access and
complete courses.
**Main purpose**
The learner uses the platform to:
● sign in
● access assigned or available courses
● move through modules and lessons
● complete checks, activities, and assessments
● track their own progress
● access completion results and certificates where earned
● revisit completed learning where allowed
**Learner workspace access**
The learner has access only to the learner-facing workspace. This includes:
● learner dashboard
● course list or assigned learning
● learner course player
● progress view
● assessment/final test area where applicable
● certificate access
● learner profile or basic personal area if included in scope
**Learner rights**
The learner can:
● open learner routes
● start and resume courses available to them
● complete lessons and activities
● submit responses in supported checks and final tests
● view their own progress
● view their own completion status
● receive a certificate when the course completion rules are satisfied, including required
final test performance where applicable
**Learner restrictions**


The learner cannot:
● access creator routes
● access admin routes
● edit course content
● open internal review tools
● access creator monitoring pages
● see draft or unpublished creator content
● see internal source materials, storyboard data, or authoring notes
**Certificate rule**
The platform should support certificate issuance as part of the learner experience, but certificate
awarding is governed by the course’s completion rules. In Phase 1, this may include both:
● completing the course flow, and
● achieving the required result on the final test or other completion assessment, such as
an 80 percent threshold where that rule is set for the course.
The certificate should therefore be treated as a course outcome tied to defined completion logic,
not as a universal automatic action unrelated to assessment rules.

### C.2 Creator

The **Creator** is the main course production user in the DEC Learning Hub. This role is used by
DEC staff or authorized contributors who are responsible for turning real CSO learning needs
into structured digital courses.
**Main purpose**
The creator uses the platform to:
● create and manage draft courses
● move through the full creator workflow
● enter course setup and diagnosis information
● map capacity and actions
● design storyboard structure
● build lessons using approved block types
● use AI support to accelerate drafting
● preview courses in learner form
● complete creator-side review
● monitor course performance after release
● initiate revisions


**Creator workspace access**
The creator has access to:
● creator home
● my courses
● course workflow pages
● build studio
● preview
● creator-side review page
● monitoring page
● sources and assets within allowed scope
● templates if enabled in Phase 1
**Creator rights**
The creator can:
● create a new course
● edit draft content
● save drafts
● upload or attach approved source/context material if permitted
● use AI authoring tools within the governed workflow
● open preview
● complete creator-side review checks
● submit a course for review
● view monitoring for their course
● create a revision after monitoring
**Creator restrictions**
The creator cannot:
● directly access admin-only controls
● bypass review and publish governance if those actions belong to another role
● edit published content directly in place without following the versioning path
● access other users’ restricted administrative records
● perform unauthorized platform-wide or tenant-wide actions
**Product expectation**
The creator is the main user of the **Course Creator Portal** , so this role must support the full
connected workflow defined for Phase 1. It is not a generic editor role. It is tied to DEC’s
structured workflow and should be implemented that way.


### C.3 Reviewer / Publisher

The **Reviewer / Publisher** role is responsible for controlled review and forward movement of
courses after the creator has completed the draft and submission stages.
In implementation, review and publishing may remain distinct permissions even if they are held
by the same user in Phase 1. For product clarity, this role should still be treated as the authority
that checks readiness beyond the creator’s own internal review and controls whether the course
moves forward.
**Main purpose**
The reviewer / publisher uses the platform to:
● access submitted courses
● inspect course structure and learner readiness
● review creator submissions
● assess whether the course is ready to move forward
● approve, reject, or return content as appropriate
● control the forward movement of the course into published learner use
**Reviewer / publisher workspace access**
This role must have access to:
● review queue or review workspace
● submitted course versions
● review-specific comments or readiness records
● preview in reviewer mode
● publishing controls if included in the same role
● course status and review history needed for controlled release
**Reviewer / publisher rights**
The reviewer / publisher can:
● open courses submitted for review
● inspect the course and related readiness data
● return a course for changes
● mark a course approved
● publish a course if their permissions include publish rights
● view version and status information needed for controlled release
**Reviewer / publisher restrictions**
The reviewer / publisher cannot:


● use admin-only system management features unless separately granted
● access unrelated platform-wide administration without permission
● silently change creator content without trace where the workflow requires creator
revision and resubmission
**Product importance**
This role is essential because Phase 1 must include controlled forward movement of courses,
not only creator drafting. The system should not assume that creator completion automatically
equals live learner release.

### C.4 Admin

The **Admin** is the platform operations and governance role.
**Main purpose**
The admin uses the platform to:
● manage users
● manage roles and permissions
● oversee platform settings within Phase 1 scope
● oversee course and workflow status
● access system-level analytics or oversight views where included
● manage organizational or platform settings as required
**Admin workspace access**
The admin must have access to:
● admin dashboard or admin workspace
● user management
● role management
● organization or platform settings within scope
● governance or oversight views
● course oversight views where needed
● reporting or analytics oversight where included in Phase 1
**Admin rights**
The admin can:
● create or manage authorized platform users
● assign or manage roles


● control access boundaries
● oversee platform-wide content status
● access administrative settings and system oversight features within scope
● intervene where the system requires admin-level governance
**Admin restrictions**
The admin role should still be limited by the Phase 1 product boundary. Admin rights do not
imply access to future-state capabilities that are outside this release.
**Product importance**
Without the admin role, the platform would lack the operating layer needed for user control,
access management, and governance. The full-stack team should not treat admin as a later
enhancement if the platform is to function as a real service in Phase 1.

### C.5 Role-based workspace model

For implementation clarity, the full-stack team should treat the platform as having **role-aware
workspaces** rather than one shared interface with all functions exposed.
That means:
● the **learner** enters the learner workspace
● the **creator** enters the creator workspace
● the **reviewer / publisher** enters the review/publishing surface
● the **admin** enters the admin workspace
These workspaces may still exist inside one integrated application, but the navigation, available
routes, visible actions, and default landing pages must differ by role. This is a product
requirement, not just a backend permission detail.

### C.6 Role implementation rule for the full-stack team

The implementation team should treat user roles as a **core product control layer**. In practical
terms, this means:
● UI visibility must respect role
● route access must respect role
● allowed actions must respect role
● workflow transitions must respect role
● backend enforcement must match the visible product behavior


The role model must be consistent across:
● learner routes
● creator workflow pages
● review and publishing surfaces
● monitoring visibility
● certificate access
● admin controls

## D. Multi-Tenant and Access Model

### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 DEC Learning Hub** must be implemented as a **single integrated application
with a multi-tenant, role-aware access model**. In practical terms, this means the system runs
as one product, but users, content, settings, and administrative control must still be correctly
scoped by organization and role. The platform must not behave like a single flat workspace
where all users see the same content and actions. It must enforce clear boundaries between
organizations, between user roles, and between draft and published learning content.
For Phase 1, the multi-tenant model should be treated as a **foundational system rule** , not as a
later scalability enhancement. The core product already requires:
● organization-aware records,
● role-aware memberships,
● protected workspaces,
● secure course access,
● and tenant-safe data handling.
This is necessary because the platform includes creator workflows, learner delivery, review and
publishing steps, certificates, monitoring, and administration. These cannot be implemented
safely if all users and content exist in one unrestricted global pool.

### D.1 Multi-tenant model — implementation reading

For implementation purposes, the DEC Learning Hub should be treated as:
**One application, one shared platform foundation, but organization-scoped data,
memberships, and access rights.**


This means:
● there is one DEC Learning Hub product
● the product may serve more than one organization or organizational unit
● user membership determines which organization context they belong to
● content and access must respect that organization context
● and the system must prevent unauthorized cross-organization visibility or editing
The team should not interpret “multi-tenant” as meaning many separate deployments. It means
the platform must support organizational separation inside one governed system.

### D.2 Core tenant entity

The basic tenant unit in Phase 1 is the **organization**.
At minimum, the system should treat the following as organization-scoped or
organization-aware:
● users through membership
● creator access
● learner access where applicable
● courses
● course versions
● modules and lessons through course ownership
● source materials and assets where permission-bound
● review records
● certificates and learner records
● monitoring data
● settings and branding where used
The organization is therefore not only a label. It is the main access and data boundary in the
product model. The implementation should use organization scoping consistently in both UI
logic and backend enforcement.

### D.3 User membership model

Users should not be treated as free-floating accounts without organization context. The system
should implement a **membership model** in which a user belongs to one or more organizations
through a role-bound membership record.
That means:


● a user identity exists at platform level
● membership records connect that user to an organization
● the role is resolved in the context of that membership
● access is determined not only by who the user is, but by which organization they belong
to and what role they hold there
This matters because the same individual could theoretically have different responsibilities in
different organizational contexts, even if Phase 1 keeps that use case limited. The system
model should still be correct from the start.

### D.4 Role and tenant context work together

The access model in Phase 1 must always resolve **both** :

1. **organization context**
2. **role / permission context**
A valid sign-in alone is not enough to grant access to content, workflows, or administrative
actions.
For example:
● a learner can only access courses available to them within their permitted context
● a creator can only create or edit draft content within the organization scope they are
authorized for
● a reviewer / publisher can only review submitted content they are permitted to see
● an admin can only perform administrative actions within the scope granted to them
This means the platform must not use role logic alone and must not use organization logic
alone. Both must be applied together.

### D.5 Workspace access model

The system must enforce **workspace separation** through the access model.
At minimum, the platform contains:
● learner workspace
● creator workspace
● reviewer / publisher workflow surface
● admin workspace


Access to these workspaces must be determined by the signed-in user’s active membership
and role.
**Learner workspace**
Available only to authorized learners and other roles with explicit learner access
**Creator workspace**
Available only to creators and higher-authority roles allowed to use creator features
**Reviewer / publisher surface**
Available only to authorized review/publish roles
**Admin workspace**
Available only to admin-authorized roles
This separation must exist in:
● route access
● visible navigation
● available actions
● backend enforcement
The system must not rely only on hiding menu items. Unauthorized routes and actions must still
be blocked.

### D.6 Content visibility model

The full-stack team must treat course content as having **lifecycle-based visibility** , not only
role-based visibility.
At minimum, the product must distinguish between:
● draft content
● content in review
● approved content
● published content
The most important Phase 1 rules are:
**Draft content**


● visible to creators and authorized internal roles only
● not visible to learners
● editable through creator workflow
**Content in review**
● visible to the creator and authorized reviewer / publisher roles
● not visible to learners as live content
● forward movement controlled by review workflow
**Published content**
● visible to learners according to learner access rules
● not directly mutated in place through creator editing
● used as the learner runtime source
This is critical because the DEC platform architecture depends on version integrity and
controlled publication rather than live mutation of active learner content.

### D.7 Learner course access model

In Phase 1, learner access must be controlled and not assumed to be universal across all
courses.
The implementation should support the logic that learners can only access:
● courses assigned to them
● courses available to their permitted learner context
● or courses intentionally exposed to their eligible learner audience
The team should not treat all published courses as automatically public to all signed-in learners
unless that is explicitly configured by the course and access model.
At product level, this means:
● course access should be mediated by access rules
● learner routes must verify entitlement
● direct URL access to a course should not bypass access control
● progress and certificate records must remain tied to authorized learner access
This is necessary for platform integrity and for later reporting reliability.


### D.8 Course ownership and editing boundaries

The implementation should also make clear who can edit what.
At minimum:
● creators can edit draft courses they are authorized to manage
● reviewer / publisher roles can inspect submitted drafts and move them forward or back
according to review rules
● admins can oversee course records according to admin rights
● learners cannot edit course content at all
The system should not assume that all creators can freely edit all draft content across all
contexts unless that is explicitly intended by DEC. Course ownership, organization membership,
and role should be used together to determine edit rights.

### D.9 Source and asset access model

Because the creator workflow includes **Sources** and **Assets** , Phase 1 must also define access
boundaries for those materials.
The implementation should assume:
● sources and assets are not universally open to all users
● learners do not access internal creator sources
● creators only access sources and assets they are authorized to use
● AI authoring can only work from approved source/context materials inside permitted
access boundaries
● restricted source materials should not leak into unauthorized creator or learner views
This is especially important because the AI authoring workflow depends on approved context
and source material. Access control must apply there as well.

### D.10 Monitoring and data visibility model

Monitoring data must also follow the multi-tenant and access model.
At minimum:
● learners can only see their own progress and certificate data
● creators can see monitoring for courses they are authorized to manage
● reviewer / publisher visibility should match their workflow scope


● admin visibility can extend further, but only within allowed administrative scope
● no user should see unrelated organization-level learner data without permission
This matters because monitoring includes course performance, progress patterns, and
completion information, all of which are sensitive and must be scoped correctly.

### D.11 Access control implementation rules

For the full-stack team, the access model should be implemented across **three layers at the
same time** :

**1. Interface layer**
Users only see the navigation items, pages, and actions relevant to their role and organization
context.
**2. Route / workspace layer**
Protected routes must enforce workspace boundaries. A user must not be able to enter creator,
review, or admin surfaces without the required authorization.
**3. Backend / data layer**
The backend must enforce the same rules for reads, writes, and sensitive actions. Hidden
buttons are not enough. The data and action layer must still reject unauthorized access.
This three-layer enforcement model is required for a real platform implementation.

### D.12 Default implementation assumptions for Phase 1

Unless DEC specifies otherwise in a narrower business rule, the implementation team should
use these Phase 1 assumptions:
● the platform is one integrated application
● organization is the primary tenant boundary
● users access the platform through membership-linked roles
● learner, creator, reviewer/publisher, and admin workspaces are separated
● published learner content is not edited directly in place
● draft and review content remain internal
● learner records, certificates, and monitoring are permission-bound
● source materials and AI context are access-controlled
● tenant and role checks apply together across the system


These assumptions are aligned with the DEC system and technical specifications and should be
treated as the working baseline unless a more specific DEC business decision overrides them.

### D.13 What the team should not do

To avoid breaking the product model, the implementation team should **not** :
● treat the system as a single flat workspace with only superficial role hiding
● expose creator routes to learner users
● allow all creators to see or edit everything by default without clear scope rules
● allow draft and published content to blur together
● let direct URLs bypass course or workspace access checks
● expose internal sources, notes, or creator context to learners
● rely only on frontend visibility rules without backend enforcement
These shortcuts would directly undermine the Phase 1 product model.

### D.14 Multi-Tenant and Access Model — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub multi-tenant and access
model** should be read as:
One integrated DEC Learning Hub application with organization-scoped data,
membership-based access, role-aware workspaces, protected content lifecycle states, and
enforced boundaries across learner, creator, review, and admin surfaces.

## E. Platform Areas

### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 DEC Learning Hub** should be implemented as one integrated platform made up
of **four main product areas** :
● **Learner Platform**
● **Course Creator Portal**
● **Review / Publishing Surface**
● **Admin Workspace**


These are not separate products. They are connected parts of the same system, built on the
same platform foundation, but presented through different workspaces, routes, and role-based
access rules. The full-stack team should implement them as coordinated product areas with
shared data, shared content lifecycle, and shared access controls.
This section defines what each platform area is for, who uses it, and what it must contain in
Phase 1.

### E.1 Learner Platform

The **Learner Platform** is the learner-facing side of the DEC Learning Hub. It is the part of the
system used by local CSO learners to access, complete, and revisit courses.
**Main purpose**
The learner platform exists to provide a clear and usable course experience. It must allow
learners to:
● sign in
● access available or assigned learning
● open a course
● move through modules and lessons
● complete activities, checks, and final tests
● track their own progress
● receive a certificate when course completion rules are met
● return later and continue where they left off
**What this area must include in Phase 1**
At minimum, the learner platform should include:
● learner sign-in and protected learner entry
● learner home/dashboard
● course list or assigned learning view
● learner course player
● progress display
● final test / assessment view where applicable
● certificate access
● a clean, mobile-first course consumption experience
**Product expectations**


This platform area must feel like a real learning product, not like a course preview screen or a
thin content wrapper. It must be easy to use, readable, responsive, and grounded in the actual
learner flow. Published courses should render here in learner form, not in creator-edit mode.

### E.2 Course Creator Portal

The **Course Creator Portal** is the internal authoring and course production workspace for DEC
staff and authorized course creators.
**Main purpose**
This area exists to let creators build structured, practical courses for local CSOs through a
guided workflow rather than disconnected editing tools.
**What this area must include in Phase 1**
At minimum, the creator portal should include:
● creator home
● course setup
● diagnosis
● capacity map
● action map
● storyboard
● build studio
● preview
● creator-side review
● monitoring
● course list / active drafts
● source and asset access within creator permissions
**Product expectations**
This platform area must function as one connected course-production system. Each page feeds
the next. The creator portal must not be treated as a generic admin dashboard plus a lesson
editor. Its primary product identity is a **workflow-driven course creation system** that carries
structured information from setup and diagnosis all the way into build, preview, review, and
monitoring.


### E.3 Review / Publishing Surface

The **Review / Publishing Surface** is the controlled workspace used after the creator has
finished a draft and submitted it forward.
This may appear as:
● a dedicated review queue,
● a reviewer-focused workspace,
● or permission-aware review surfaces inside the creator/admin environment,
but the underlying capability set must exist in Phase 1.
**Main purpose**
This area exists to support controlled forward movement of courses. It must allow authorized
roles to:
● open submitted course drafts
● review readiness
● inspect the course in structured form
● preview the learner experience in reviewer mode
● return a course for changes
● approve a course
● publish a course where the role includes publish rights
**What this area must include in Phase 1**
At minimum, the review/publishing surface should include:
● list of submitted courses
● course review view
● reviewer access to preview
● approval / return controls
● publishing control where applicable
● visibility into course status and version state
**Product expectations**
This area must not be left as an informal manual step outside the system. The platform needs a
real review and forward movement layer so that course release is governed and does not
depend on ad hoc coordination.

### E.4 Admin Workspace


The **Admin Workspace** is the operational control surface of the Phase 1 DEC Learning Hub.
**Main purpose**
This area exists to support platform administration, governance, and operational oversight.
**What this area must include in Phase 1**
At minimum, the admin workspace should include:
● admin home or dashboard
● user management
● role management
● platform or organization settings within scope
● course oversight views
● access to system-level status or reporting views where included
● governance or platform control tools needed to operate the service
**Product expectations**
This area must be sufficient for DEC or authorized platform administrators to manage the
platform as a real working service. It does not need to include every future-state control, but it
must include the essential operating layer for:
● managing who can access the platform,
● controlling roles,
● overseeing platform use,
● and supporting course governance in Phase 1.

### E.5 Shared foundation across all platform areas

Although these four areas appear as different workspaces, they must be built on a shared
platform foundation.
That shared foundation includes:
● authentication
● role resolution
● organization / tenant context
● course and version data
● learner progress data
● certificate records
● source and asset management
● content lifecycle status


● monitoring and telemetry signals
● shared route and layout patterns where appropriate
The full-stack team should not build these platform areas as isolated mini-products with
duplicated logic. They are different surfaces over a connected platform model.

### E.6 Relationship between the platform areas

The four platform areas are connected by the course lifecycle.
That relationship works like this:
● the **Course Creator Portal** is where courses are created and built
● the **Review / Publishing Surface** is where courses are checked and moved forward
● the **Learner Platform** is where published courses are used
● the **Admin Workspace** is where access, governance, and oversight are managed
The system must preserve this relationship so that:
● draft content stays in creator/review areas
● learner-facing content comes from approved/published state
● learner use generates progress and completion data
● monitoring and governance can refer back to that course use
● course improvement can later move back into creator-side revision workflows
This connected model is one of the most important product rules in Phase 1.

### E.7 Platform area implementation rule

For implementation purposes, the team should treat each platform area as having:
● its own default landing page
● its own navigation emphasis
● its own allowed actions
● its own route access rules
● and its own user expectations
But they must all remain visibly part of one DEC Learning Hub system.
That means:
● consistent global identity


```
● consistent role-aware navigation logic
● consistent content lifecycle behavior
● consistent access enforcement
● and shared data integrity across areas
```
### E.8 Platform Areas — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub platform areas** should be read
as:
One integrated system with four core product areas: Learner Platform, Course Creator Portal,
Review / Publishing Surface, and Admin Workspace, all connected by shared content lifecycle,
shared access logic, and shared platform data.

## F. End-to-End Workflows

### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 DEC Learning Hub** must be implemented around a small number of complete,
working end-to-end workflows. These workflows are the most important way for the full-stack
team to understand the system as a real product rather than as a set of pages or modules. The
platform is only complete if these workflows function across the correct roles, workspaces, data
states, and lifecycle transitions.
For Phase 1, the full-stack team should treat the following as the **core end-to-end workflows** :

1. **Learner learning workflow**
2. **Creator course production workflow**
3. **Review / approval / publishing workflow**
4. **Monitoring and improvement workflow**
5. **Administrative access and control workflow**
Each of these workflows is described below as a real operational path through the product.

### F.1 Learner learning workflow

This workflow begins when an authorized learner enters the learner-facing DEC Learning Hub
and ends when the learner completes the course and receives the course completion outcome,
including the certificate where the course completion rules are met.


**Workflow sequence**

**1. Learner signs in**
The learner signs in through the learner access path and lands in the learner workspace.
**2. Learner enters learner home or course list**
The learner sees assigned or available courses relevant to their access context.
**3. Learner opens a course**
The learner opens a published course they are allowed to access.
**4. Learner enters the course player**
The learner sees the course structure in learner-facing form:
    ● modules
    ● lessons
    ● progress state
    ● supported lesson components
**5. Learner progresses through lessons**
The learner reads, watches, interacts, answers, reflects, and moves through the course.
**6. Learner completes checks, activities, and final test**
Where included, the learner completes the course checks and final test. Final completion must
respect the course’s completion rules, including required test performance thresholds where
defined.
**7. Learner reaches course completion**
Once the course completion criteria are satisfied, the learner’s progress is updated to
completed.
**8. Learner receives completion result**
The learner can view completion status and access the certificate if the course completion rules
have been met.
**Implementation meaning**
The team must ensure this workflow works as one connected runtime path:
    ● published course access only


● progress persisted correctly
● lesson and assessment behavior functioning in learner runtime
● completion logic enforced
● certificate outcome linked to completion rules
● learner only seeing their own progress and results
This is the minimum learner-side product flow required in Phase 1.

### F.2 Creator course production workflow

This is the main internal workflow of the Course Creator Portal. It begins when a creator starts
or opens a draft course and ends when the course is submitted forward after internal
creator-side review.
**Workflow sequence**

**1. Creator signs in**
The creator signs in and lands in the creator workspace.
**2. Creator enters Home**
The creator sees:
    ● workflow overview
    ● current draft status
    ● next recommended action
    ● active courses
**3. Creator starts or opens a course**
The creator either:
    ● starts a new course, or
    ● opens an existing draft
**4. Creator completes Course Setup**
The creator enters the basic course metadata:
    ● title
    ● summary
    ● learner group
    ● language
    ● format


```
● topic area
● other required starting fields
```
**5. Creator completes Diagnosis**
The creator records the real learner challenge and field evidence that justify the course,
including the knowledge and/or skill focus that the course can meaningfully address.
**6. Creator completes Capacity Map**
The creator places the course in the relevant capacity area and capability focus.
**7. Creator completes Action Map**
The creator defines:
    ● the main practical change
    ● key learner actions
    ● common difficulties
    ● needed learning support
    ● useful signals of progress
**8. Creator completes Storyboard**
The creator turns the previous structured inputs into:
    ● modules
    ● lessons
    ● lesson purposes
    ● linked learner actions
    ● checks and outputs
    ● lesson-level AI notes
    ● design flow for Build
**9. Creator enters Build**
The creator opens lessons in the authoring studio, uses the storyboard as the design backbone,
and creates real lesson content using approved block types and AI-assisted drafting where
needed.
**10. Creator enters Preview**
The creator views the course in learner runtime form and checks whether the course feels
coherent, usable, and practical.
**11. Creator completes Review**


The creator performs the structured final readiness check, resolves any remaining issues, and
confirms the course is ready to move forward.

**12. Creator submits the course for review**
The draft changes state and enters the review / approval workflow.
**Implementation meaning**
This workflow is the backbone of the creator portal and must be implemented as one connected
chain. Each page must carry forward structured information into the next stage. The team must
not treat these pages as isolated forms or separate tools. The creator portal only works correctly
if:
    ● setup feeds diagnosis
    ● diagnosis feeds capacity/action mapping
    ● mapping feeds storyboard
    ● storyboard feeds Build
    ● Build feeds Preview
    ● Preview feeds Review
    ● Review feeds submission state
This workflow is one of the highest-priority Phase 1 implementation paths.

### F.3 Review / approval / publishing workflow

This workflow begins when a creator submits a course and ends when the course has been
moved into the published learner-facing state through authorized review and publishing control.
**Workflow sequence**

**1. Course is submitted from creator workflow**
The course moves out of creator-side drafting readiness and into submitted/reviewable state.
**2. Reviewer / publisher accesses submitted course**
An authorized review or publishing role opens the submitted course through the review
workspace or equivalent review surface.
**3. Reviewer inspects the course**
The reviewer checks:
    ● course structure


```
● learner-facing preview
● readiness information
● course completeness
● any review notes or prior context
```
**4. Reviewer decides the next state**
Depending on permissions and readiness:
    ● return for changes
    ● approve
    ● publish
**5. If returned, the course goes back to creator workflow**
The creator reopens the draft, resolves issues, and resubmits.
**6. If approved/published, the course moves into learner-facing availability**
The learner platform now renders the published version, not the creator draft version.
**Implementation meaning**
The team must implement this workflow as a real system transition, not as a manual instruction
outside the product. At minimum, the system must support:
    ● submitted state
    ● review access by the correct role
    ● controlled forward or backward movement
    ● protected learner access to published content only
    ● version-aware transition between draft and published use
The main rule is that creator completion does not automatically equal learner release.

### F.4 Monitoring and improvement workflow

This workflow begins after a course is in learner use and ends when the creator initiates a
revision based on actual course performance.
**Workflow sequence**

**1. Learners use the published course**
The learner runtime generates progress, completion, assessment, and activity signals.
**2. Creator opens Monitoring for the course**


The creator enters the monitoring page for a specific course.

**3. Creator reviews course performance**
The creator sees:
    ● course overview
    ● learner progress
    ● lesson performance
    ● checks and scenarios
    ● signals tied to the intended practical change
    ● improvement notes area
**4. Creator identifies weak areas or strong areas**
The creator notices where:
    ● learners drop off
    ● checks underperform
    ● scenarios confuse learners
    ● lessons may need to be shortened or improved
    ● practical actions are or are not being supported well
**5. Creator records improvement decisions**
The creator notes what should be improved and what should stay.
**6. Creator creates a revision**
The creator opens a new draft/revision path from the monitoring view and re-enters the creator
workflow for improvement.
**Implementation meaning**
The team must make monitoring part of the end-to-end lifecycle rather than a decorative
dashboard. The point of the workflow is:
    ● course use produces signals
    ● signals are shown meaningfully to the creator
    ● creator can act on them
    ● revisions can be initiated in a structured way
This keeps the Phase 1 product iterative and evidence-informed.

### F.5 Administrative access and control workflow


This workflow begins when an admin needs to operate the platform and ends when the relevant
user, role, or platform-level control has been updated.
**Workflow sequence**

**1. Admin signs in**
The admin enters the admin workspace.
**2. Admin opens user or platform management**
The admin navigates to the relevant control area:
    ● user management
    ● role management
    ● organization/platform settings
    ● oversight views
**3. Admin performs authorized management action**
Examples:
    ● add or update a user
    ● assign or update role access
    ● review platform-wide course status
    ● inspect administrative oversight data
    ● maintain essential service controls in scope
**4. System enforces updated access state**
The affected user’s access, visibility, and actions update according to the new settings or role
assignment.
**Implementation meaning**
This workflow ensures that the platform can be run as a service in Phase 1. The admin workflow
must be real enough to:
    ● maintain access
    ● support role separation
    ● keep the product operational
    ● support platform governance
It should not be treated as a future enhancement if the system is to function in real use.


### F.6 Workflow connection rules

The full-stack team should also implement the following **cross-workflow rules** :

**1. Draft and published content must remain distinct**
Creator work happens on draft/review states. Learner access happens on published state.
**2. Role transitions must be respected**
A course moves from creator to reviewer to learner use through controlled state changes, not
informal handling.
**3. Monitoring must refer back to design intent**
Monitoring is not generic usage reporting. It should remain tied to course logic, especially
intended learner actions and practical change signals.
**4. Certificates must remain tied to course completion rules**
The learner outcome must reflect the completion logic defined for the course, including final test
thresholds where required.
**5. Revision must flow back into creator workflow**
Monitoring findings should be actionable, not terminal.
These rules ensure that the workflows remain connected into one product lifecycle rather than
becoming disconnected modules.

### F.7 What the team should validate end-to-end

For Phase 1, the team should be able to demonstrate at least the following validated end-to-end
paths:
● learner can sign in, take a course, complete it, and receive the correct completion
outcome
● creator can build a course from setup to submission
● reviewer can open a submitted course and control its forward movement
● learners can only access the published learner-facing version
● creator can monitor course performance and start a revision
These are not optional examples. They are the core product workflows that must work in the
delivered system.


### F.8 End-to-End Workflows — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub end-to-end workflows** should
be read as:
A connected set of working product journeys across learner use, creator production, controlled
review, monitoring-based improvement, and admin operation, all enforced through shared
lifecycle states, role-aware workspaces, and structured platform behavior.

## G. Creator Portal Workflow

### Phase 1 DEC Learning Hub Implementation Description

The **Course Creator Portal** is the internal production workflow of the Phase 1 DEC Learning
Hub. It is the workspace used by DEC staff and authorized creators to turn a real CSO learning
need into a structured digital course that can be reviewed, released, and improved over time.
The creator portal is not a generic editor and not a loose set of disconnected pages. It is a
**single guided workflow** in which each stage captures information that the next stage uses.
For implementation purposes, the creator portal workflow must be treated as a **connected
authoring chain** :
**Home → Course Setup → Diagnosis → Capacity Map → Action Map → Storyboard →
Build → Preview → Review → Monitoring**
The product rule is simple:
The creator should never have to restart the design logic at each page.
Every stage must carry forward meaningful structured information into the next one.
That means the creator portal is both:
● a workflow experience for users, and
● a structured data pipeline for the system.
This section defines how that workflow must function.

### G.1 Global creator portal behavior


Before looking at individual workflow stages, the full-stack team should implement the creator
portal with the following shared behavior across all main pages.

**1. Fixed creator workspace shell**
All workflow pages must share:
    ● a fixed top bar
    ● a stable left global creator navigation
    ● the active course workflow navigation
    ● consistent page actions
    ● consistent course context display
**2. Persistent workflow navigation**
The workflow steps must remain visible throughout the course creation journey:
    ● Course Setup
    ● Diagnosis
    ● Capacity Map
    ● Action Map
    ● Storyboard
    ● Build
    ● Preview
    ● Review
    ● Monitoring
The current step must be highlighted, previous steps marked complete where relevant, and
future steps shown but inactive. This is a core usability requirement because the workflow is
part of the product logic, not just a menu.
**3. Draft-safe behavior**
The creator must be able to:
    ● save draft
    ● leave the workflow
    ● return later
    ● reopen at the correct stage
    ● continue without losing structured inputs
**4. Course context persistence**
Across the workflow, the system must preserve key course context such as:
    ● course title


● learner group
● diagnosis summary
● capacity area
● key learner actions
● storyboard logic
● current lesson context in Build
This must be visible where needed so the creator does not lose track of the course purpose
while moving forward.

### G.2 Home

The **Home** page is the creator landing page after sign-in.
**Main purpose**
Home exists to:
● orient the creator
● show the creator workflow at a glance
● point the creator to the most relevant next action
● let the creator open existing courses or start a new one
**What Home must contain**
At minimum, Home must include:
● welcome / orientation area
● workflow overview band
● one clear “next step” focus panel
● active courses list
● light support / guidance area
**Required behavior**
Home should not behave like a crowded analytics dashboard. It should act as a guided starting
page. A creator should land here and immediately understand:
● what this workspace is for
● where they are in the workflow
● what they should do next
If the creator has an active course, Home should highlight the next required workflow step for
that course. If the creator has no course yet, Home should direct them to start one.


### G.3 Course Setup

The **Course Setup** page creates the course shell and captures the initial course metadata.
**Main purpose**
This page defines the starting record for the course and provides the basic information needed
for the rest of the workflow.
**Required input areas**
At minimum, Course Setup must capture:
● course title
● short summary
● main learner group
● secondary learner group where useful
● main language
● language style / language level
● course format
● estimated time
● expected number of modules
● course level
● broad topic area
● creator
● team/unit
● optional target draft completion date
**What this page must not do**
This page must not try to do diagnosis, action logic, or lesson planning. It is the course shell
page, not a full planning page.
**Required output**
On save, this page must create or update the draft course shell and move the creator to
Diagnosis.

### G.4 Diagnosis

The **Diagnosis** page captures the real learner problem and the key findings from the diagnosis
work already done outside or around the platform.


**Main purpose**
This page records the practical problem the course is meant to address, along with the evidence
and learner context that justify the course design.
**Required input areas**
At minimum, Diagnosis must capture:
● the challenge now
● what good looks like
● evidence from the field
● type of gap
● what should shape the course
This must include fields for:
● practical learner challenge
● where the problem appears
● who is most affected
● desired better performance
● diagnosis evidence sources
● key findings
● one or more real examples
● main gap type
● what part of the problem the course can actually address
● key learner realities the course must reflect
**Gap logic requirement**
The page may record wider diagnosis findings such as:
● knowledge gap
● skill gap
● motivation gap
● resource/environment gap
But for Phase 1 course design, the workflow must actively carry forward the **knowledge** and
**skill** findings that the course can address. The other findings may be recorded for context, but
they do not become the active content logic in the creator workflow.
**Required output**
The system must preserve structured diagnosis outputs and carry forward at least:
● main challenge


● desired improvement
● relevant learner realities
● course-relevant knowledge/skill focus
● likely learning support direction
These outputs must feed Capacity Map and later pages.

### G.5 Capacity Map

The **Capacity Map** page places the course in the right institutional capacity area.
**Main purpose**
This page ensures the course is not treated as a generic topic. It maps the course into the
relevant CSO capacity domain so the course can later be organized, tracked, and interpreted in
a meaningful way.
**Required input areas**
At minimum, Capacity Map must allow the creator to select:
● primary capacity area
● sub-area
● capability focus or level
The page should also show the diagnosis summary so the creator can map the course correctly.
**Required output**
The system must save:
● selected capacity area
● sub-area
● capability focus
These must feed Action Map, Storyboard, and later monitoring logic.

### G.6 Action Map

The **Action Map** page translates the diagnosis into practical learner actions.
**Main purpose**


This page defines what learners should be able to do better after the course. It is the main
bridge between problem definition and course design.
**Required input areas**
At minimum, Action Map must capture:
● main practical change
● key learner actions
● where those actions happen
● action importance
● action difficulty
● common mistakes
● why the action is difficult
● what type of learning support is most useful
● basic signals of progress
**Product requirement**
This page must support multiple learner action records, not just one generic objective. The
system should be able to link those actions forward into Storyboard and Build.
**Required output**
The system must carry forward:
● the main practical change
● the action list
● common weak points
● likely learning support types
● useful progress signals
These outputs are critical because they shape Storyboard and make later AI authoring
meaningful rather than generic.

### G.7 Storyboard

The **Storyboard** page is the design backbone of the creator workflow.
**Main purpose**
This page converts the workflow inputs gathered so far into the actual course structure that will
drive authoring.


**Required input and design areas**
At minimum, Storyboard must support:
● course design summary
● module list
● lesson list
● lesson purposes
● links between lessons and learner actions
● learning mode per lesson
● learning flow
● checks and outputs
● build handoff note
● lesson-level AI notes
**Storyboard rule**
The storyboard must not be treated as optional notes. It is the structured design layer that the
Build phase uses. Lessons, purposes, actions, and AI notes defined here must be available
inside Build.
**AI support at storyboard stage**
The system should allow AI-assisted draft support here for:
● module suggestions
● lesson sequence suggestions
● learning flow suggestions
● check/output suggestions
But the creator remains in control of the storyboard.
**Required output**
The system must carry forward:
● module structure
● lesson structure
● lesson purposes
● action links
● learning modes
● planned checks and outputs
● AI notes for authoring
This is the main content backbone for Build.


### G.8 Build

The **Build** page is the lesson authoring studio.
**Main purpose**
This page turns the storyboard into actual lesson content.
**Required layout**
The Build page must use a three-panel studio layout:
● left: lesson structure + block library
● center: lesson canvas
● right: block setup + structured input + AI support + guidance
**Required behavior**
The Build page must:
● open lessons from the storyboard structure
● show lesson context from storyboard
● let creators manually add approved block types
● let creators reorder and combine blocks freely within the governed lesson flow
● support configuration of block content, settings, rules, and accessibility
● support structured input templates for each block type
**Structured but flexible authoring rule**
The system must use a structured block-authoring model as the foundation. It must not become
an unrestricted blank-canvas editor. But it must still allow creators meaningful flexibility:
● add blocks manually
● choose different approved block types
● expand beyond the AI suggestions
● shape the lesson flow as needed inside the governed system
**AI authoring rule**
The Build page must include strong AI support, but AI must be:
● storyboard-governed
● lesson-aware
● source-aware where approved materials exist
● creator-controlled


Required AI actions include:
● draft lesson from storyboard
● draft block
● suggest better block type
● draft scenario
● draft knowledge check
● simplify language
● make content more local/practical
● condense for mobile
The creator always reviews and edits AI outputs before finalizing the lesson.

### G.9 Preview

The **Preview** page shows the learner-facing draft runtime.
**Main purpose**
This page allows the creator to experience the course as a learner would before final review.
**Required capabilities**
Preview must support:
● lesson selector
● device view selector
● reset/restart preview
● learner-like interaction with content
● realistic rendering of lessons, checks, and scenarios
**Product rule**
Preview must render the actual draft learner runtime, not a superficial simulation. It must help
the creator judge:
● flow
● clarity
● practical usefulness
● interaction quality
● mobile readiness
**Required output**


The creator should be able to move from Preview into Review or back to Build for changes.

### G.10 Review

The **Review** page is the final creator-side quality checkpoint.
**Main purpose**
This page ensures the course is complete, coherent, and ready for formal submission.
**Required review areas**
At minimum, the Review page must check:
● course fit
● structure and flow
● lesson completeness
● activities and checks
● accessibility and clarity
● submission readiness
**Required behavior**
The page must:
● surface unresolved issues
● allow quick navigation back to Build or Preview
● allow creator sign-off
● support submission into the next controlled workflow state
This must be implemented as a real workflow gate, not as a passive checklist.

### G.11 Monitoring

The **Monitoring** page closes the creator workflow loop after the course is in use.
**Main purpose**
This page allows the creator to see how the course is performing and identify what should be
improved.
**Required monitoring areas**


At minimum, Monitoring must show:
● course overview
● learner progress
● lesson performance
● checks and scenarios
● signals of change
● improvement notes
**Product rule**
The Monitoring page must not act like a generic analytics dashboard. It should be
course-specific and grounded in the earlier workflow, especially:
● original learner challenge
● selected capacity area
● learner actions
● intended practical change
● planned signals from Action Map and Storyboard
**Required behavior**
The page must help the creator decide whether to:
● keep the course as is
● revise parts of it
● start a new revision cycle

### G.12 Workflow continuity rules

For implementation, the full-stack team must enforce these workflow continuity rules.

**1. Each page must save structured outputs**
The workflow is only useful if the page outputs are reusable and machine-readable, not just text
blobs.
**2. Later pages must visibly use earlier outputs**
Examples:
    ● Storyboard must use Diagnosis and Action Map
    ● Build must use Storyboard
    ● Monitoring must refer back to Action Map and Storyboard signals


**3. The creator should never lose course context**
The system must keep core context visible at the right points so the course remains grounded
and practical.
**4. The workflow must be resumable**
A creator should be able to stop at any stage and return without losing the structured state of
the course.
**5. Draft and submission states must be respected**
The workflow must align with course lifecycle state and role permissions.

### G.13 Creator Portal Workflow — validated implementation reading

For implementation purposes, the **Creator Portal Workflow** should be read as:
A connected, structured, resumable course-production workflow in which Home, Course Setup,
Diagnosis, Capacity Map, Action Map, Storyboard, Build, Preview, Review, and Monitoring
operate as one coherent creator experience and one structured data flow.

## H. Learner Platform Workflow

### Phase 1 DEC Learning Hub Implementation Description

The **Learner Platform Workflow** defines the end-to-end experience for learners using the
Phase 1 DEC Learning Hub. It describes how an authorized learner enters the platform,
discovers or opens a course, progresses through lessons and activities, completes required
checks and the final test, and reaches course completion outcomes, including certificate access
when the course completion rules are met.
For implementation purposes, the learner workflow must be treated as a **complete, working
product journey** , not as a passive content viewer. The learner side is a core platform area of
Phase 1 and must function as a real digital learning experience with protected access,
structured runtime behavior, saved progress, and clear completion logic.
The full-stack team should implement the learner platform so that it feels:
● simple
● clear


```
● mobile-first
● low-clutter
● progress-aware
● practical for local CSO learners
● and clearly separate from the creator and admin workspaces
```
### H.1 Learner workflow overview

The learner workflow in Phase 1 should follow this connected path:
**Sign in → Learner Home → Course Access → Course Player → Lesson Progress →
Activities and Final Test → Completion → Certificate / Completion Outcome → Return /
Revisit**
This path must work cleanly end to end. The learner should not need to understand internal
course production logic. They should only experience a clear learning journey.

### H.2 Learner sign-in and entry

**Main purpose**
This is the entry point into the learner-facing platform.
**Required behavior**
When a learner signs in:
● the system authenticates them
● resolves their access context
● opens the learner workspace
● and directs them to the learner home/dashboard
The learner must not be routed into creator, review, or admin surfaces. The learner entry must
clearly feel like the learning side of the DEC Learning Hub.
**Product expectation**
The learner sign-in and first landing experience must be simple and non-technical. The learner
should immediately understand that they are in the learning environment and not in an internal
staff workspace.


### H.3 Learner home / dashboard

**Main purpose**
The learner home/dashboard is the learner’s starting point after sign-in. It must show them what
learning is available and what they should do next.
**What this page must contain**
At minimum, the learner home should include:
● welcome area
● current or assigned courses
● continue learning prompt
● progress summary
● completed courses
● certificate area or access point
● light support/help access if included in scope
**Required behavior**
If the learner has a course in progress, the dashboard should clearly highlight:
● current course
● progress status
● next lesson or next step
● continue button
If the learner has not started yet, the dashboard should highlight:
● assigned or available courses
● course summaries
● start action
This page should not be crowded. It should behave as a practical learning home.

### H.4 Course access

**Main purpose**
This is the point where the learner opens a course they are allowed to use.
**Required behavior**
The learner must be able to:


● open an assigned or available published course
● see the course title, summary, expected time, and progress state
● enter the course player
The system must enforce course access rules here. A learner should not be able to access a
course just by typing a direct URL if that course is not available to them.
**Product expectation**
Course access should feel clean and straightforward. The learner should not encounter internal
course states such as draft, storyboard, or review language.

### H.5 Course player

The **Course Player** is the main learner runtime surface.
**Main purpose**
The course player is where the learner experiences the course itself:
● modules
● lessons
● explanations
● media
● examples
● activities
● checks
● scenarios
● final test where applicable
**What this area must include**
At minimum, the course player should include:
● course title
● module and lesson navigation
● progress indicator
● lesson content rendered in learner-facing form
● next / continue logic
● access to downloads where part of the lesson
● learner completion status within the course
**Product expectation**


The learner course player must feel stable, readable, and mobile-first. It must render the
published course in a clean and understandable way. It must not expose creator-facing labels
such as block types, AI tools, build logic, or review notes.

### H.6 Lesson progression

**Main purpose**
Lesson progression is the way the learner moves through the course from lesson to lesson.
**Required behavior**
The learner must be able to:
● start at the correct point in the course
● complete the lesson flow in order
● move to the next lesson when completion conditions are satisfied
● leave and return later without losing progress
● resume where they stopped
The platform should track:
● lesson started
● lesson completed
● current position
● in-progress state
● overall course progress
**Product expectation**
The learner should always know:
● where they are
● how much they have completed
● what comes next
The runtime should not feel like a long scroll of disconnected content. It should feel like
structured guided learning.

### H.7 Activities, checks, and scenarios

**Main purpose**


These are the active learning parts of the learner experience.
Depending on the course, the learner may encounter:
● knowledge checks
● guided practice activities
● reflection prompts
● case questions
● scenarios
● branching exercises
● short answer prompts
● final test
**Required behavior**
The learner must be able to:
● answer questions
● select choices
● receive feedback
● interact with scenarios or guided activities
● move through activities without breaking the lesson flow
If the course includes a scenario or branching activity, the learner runtime must:
● present the scenario clearly
● allow path selection
● show the relevant response and feedback
● store the relevant interaction data where required for monitoring
**Product expectation**
Activities should feel like a natural part of the lesson, not like separate technical components.
They should support learning and not interrupt the flow unnecessarily.

### H.8 Final test

**Main purpose**
The final test is the concluding assessment layer for courses that require it.
**Required behavior**
Where a course includes a final test, the learner must be able to:


● enter the final test when the course rules allow it
● complete the full test
● submit answers
● receive a result
● see whether the passing threshold has been met
The system must support course completion rules where the learner must achieve the defined
acceptable result on the final test, for example 80 percent, in addition to or as part of course
completion.
**Product expectation**
The final test should feel like a normal part of the learner journey. The learner should clearly
understand:
● when they are in the final test
● whether it is required for completion
● what result they achieved
● whether they have met the course completion requirement

### H.9 Course completion

**Main purpose**
This is the point where the system determines whether the learner has completed the course
successfully.
**Required behavior**
The system must evaluate course completion according to the course’s completion rules. These
may include:
● completing all required lessons or activities
● completing the final test
● reaching the required final test threshold
When the required conditions are satisfied:
● the learner’s course status changes to completed
● the completion outcome becomes visible in the learner platform
● the certificate outcome becomes available where earned
**Product expectation**


Completion must be rule-based, not vague. The learner should receive a clear result:
● completed
● completed and certificate earned
● or not yet complete, with reason if necessary

### H.10 Certificate access

**Main purpose**
The learner must be able to access the certificate after meeting the course completion rules.
**Required behavior**
Once the learner has satisfied completion conditions, the platform should:
● generate or make available the learner’s certificate
● show the certificate in the learner workspace
● allow the learner to view or download it according to product behavior
● preserve it as part of the learner’s course record
This should happen through the learner’s own completion or certificate area, not through creator
or admin workspaces.
**Product expectation**
Certificate access should be simple and clearly tied to successful completion. The learner
should not be confused about whether they have earned it or where to find it.

### H.11 Resume, revisit, and return behavior

**Main purpose**
The learner platform must support interrupted learning and repeat access.
**Required behavior**
The learner must be able to:
● leave a course
● return later
● resume from the correct point
● reopen completed courses where allowed


● revisit prior lessons if the product allows it
The dashboard should reflect:
● in-progress courses
● completed courses
● certificates earned
● the next recommended action
This is important because Phase 1 is a practical learning platform, not a one-session-only
experience.

### H.12 Learner-visible progress model

The learner platform must show enough progress information to support motivation and clarity.
At minimum, the learner should be able to see:
● current course progress
● lesson or module completion state
● whether the final test has been completed
● whether the course is complete
● whether the certificate has been earned
The learner should not see creator-side workflow states such as:
● draft
● in review
● storyboard
● build
● internal readiness labels
Only learner-relevant progress states should be shown.

### H.13 Learner support expectations

Within Phase 1, the learner platform should provide light support to help the learner stay
oriented.
At minimum, the learner should have:
● clear lesson navigation


● clear continue/resume behavior
● readable instructions
● visible progress
● basic help or support access if included in product scope
This does not require a large support center, but the runtime should not leave the learner
confused about what to do next.

### H.14 Relationship to creator and publishing workflow

The learner workflow is directly connected to the creator and publishing workflow, even though
the learner does not see that internal process.
For implementation purposes, the team must preserve these rules:
● learners access only the published course version
● creator drafts do not appear in the learner runtime
● review state does not appear in learner-facing course lists
● monitoring uses learner runtime signals produced from actual learner use
That means the learner workflow depends on correct lifecycle handling behind the scenes.

### H.15 What the learner platform must not become

The learner platform should **not** :
● expose creator or admin controls
● show internal production labels
● behave like a file library instead of a guided course experience
● overload the learner with too many menus or settings
● blur draft and published content
● treat completion as informal or inconsistent
The learner side should remain focused, usable, and clear.

### H.16 Learner Platform Workflow — validated implementation reading

For implementation purposes, the **Learner Platform Workflow** should be read as:


A complete, role-protected learner journey that begins at sign-in, moves through course access
and structured lesson progression, includes activities and final test completion where required,
and ends in clear course completion outcomes including certificate access when the completion
rules are met.

## I. Content and Authoring Model

### Phase 1 DEC Learning Hub Implementation Description

The **Content and Authoring Model** defines how learning content is structured, authored,
stored, rendered, reviewed, and improved in the Phase 1 DEC Learning Hub. This section is
critical for the full-stack team because it connects the creator workflow, the learner runtime, the
review flow, the AI authoring layer, and the monitoring layer into one coherent system.
For implementation purposes, the DEC Learning Hub must **not** be treated as a loose content
management system or a slide-based publishing tool. It must be implemented as a **structured,
schema-driven, block-based authoring system** where content is created through a guided
workflow, assembled as modular learning objects, and rendered consistently in both preview
and learner runtime.

### I.1 Core content model

The core content model in Phase 1 should be hierarchical and version-aware.
At minimum, the platform must support the following content levels:
● **Course**
● **Module**
● **Lesson**
● **Lesson Block**
These are not optional design ideas. They are the minimum structured units required for course
production and learner delivery in Phase 1.
**Course**
A **Course** is the top-level learning product. It contains the course metadata, course-level
workflow records, version state, learner access rules, completion logic, and the overall module
structure.


**Module**
A **Module** is a major content grouping within a course. It organizes lessons into manageable
thematic or functional sections.
**Lesson**
A **Lesson** is the main runtime learning unit. It is what the creator builds in the Build studio and
what the learner consumes in the course player.
**Lesson Block**
A **Lesson Block** is the smallest structured authoring unit in the lesson. It represents one
governed content component such as a paragraph, image, checklist, accordion, scenario card,
or question.
This hierarchy must be implemented consistently across:
● creator workflow
● preview
● learner runtime
● review
● monitoring
● data model
● versioning logic

### I.2 Course shell and version model

The platform must distinguish between the **course shell** and the **course version**.
**Course shell**
The course shell is the durable parent record of the course. It contains:
● course identity
● ownership context
● broad metadata
● lifecycle linkage across versions
**Course version**
A course version is the actual editable and publishable learning package tied to a specific draft,
review state, or published release.
This distinction is essential because:


● creators work on draft versions
● reviewers inspect submitted versions
● learners consume published versions
● revisions should create new controlled version states, not mutate the live learner content
in place
The full-stack team must not collapse these two concepts into one mutable course record.
Phase 1 must preserve version integrity from the start.

### I.3 Workflow-generated authoring model

The DEC authoring system is not designed for authors to start from an empty lesson editor and
invent the course structure directly inside the build environment.
Instead, the authoring model is **workflow-generated**.
That means the course content structure is built progressively through earlier workflow stages:
● **Course Setup** creates the course shell and basic metadata
● **Diagnosis** defines the learner problem and real-world challenge
● **Capacity Map** places the course in the correct institutional area
● **Action Map** defines the learner actions, weak points, and progress signals
● **Storyboard** defines the course structure, module logic, lesson intentions, learning flow,
checks, and outputs
● **Build** turns that structure into actual lesson content
This is one of the most important product rules in Phase 1:
The lesson authoring experience must be driven by the structured workflow that comes before
it.
The authoring model therefore depends on prior structured inputs, not only free writing.

### I.4 Storyboard as the design backbone

The **Storyboard** is the main design backbone for the content and authoring model.
The system must preserve storyboard outputs in structured form so they can be used directly in
Build and later in Review and Monitoring.
At minimum, the storyboard should provide:


● course design summary
● module structure
● lesson list
● lesson purpose
● linked learner action(s)
● learning mode per lesson
● checks or outputs planned
● lesson-level AI notes
● build handoff notes
The Build page must be able to read and use this structure directly. The creator should not need
to manually restate the lesson purpose, learner action, or lesson type inside Build if that was
already defined in Storyboard.
The full-stack team should treat Storyboard not as optional documentation, but as a **structured
design layer** in the content model.

### I.5 Lesson authoring model

The DEC lesson authoring model in Phase 1 must be implemented as a **structured
block-authoring model**.
This means:
● a lesson is built from approved block types
● blocks are arranged in a vertical learning flow
● each block has structured fields
● blocks are governed by known content, settings, rules, and accessibility requirements
● lessons are not composed as visually free-floating, unstructured objects
However, the authoring model must remain **flexible in composition**.
That means the creator must still be able to:
● add blocks manually
● choose block types intentionally
● reorder blocks
● duplicate and adapt blocks
● combine explanation, media, interaction, and assessment blocks
● extend or simplify lessons as needed
The platform must therefore support:
● **structured authoring**


● but not **rigid closed authoring**
What the system must avoid is:
● unrestricted blank-canvas placement
● unsupported custom content objects outside the governed model
● authoring patterns that break learner runtime parity, reviewability, accessibility, or
analytics
This balance is central to DEC’s product stance.

### I.6 Block-based content model

All lesson content in Phase 1 should be authored through a governed **block library**.
Each block must belong to a supported block family and subtype, and each must have a clear
rendering model and configuration pattern.
At minimum, the platform must support the following block families and subtypes in the
authoring model:
**Text**
● Paragraph
● Heading
● Subheading
● Two-column text
● Table
**Statement**
● Standard statement
● Note
**Quote**
● Single quote
● Quote carousel
**List**
● Bulleted list
● Numbered list
● Checkbox list


**Image**
● Standard image
● Image with text
● Full-width image
**Gallery**
● Carousel gallery
● Grid gallery
**Multimedia**
● Video
● Audio
● File download
● Embedded content
● Transcript / caption support
**Interactive**
● Accordion
● Tabs
● Flip cards
● Hotspots
● Timeline
● Process steps
● Callout / reveal
● Continue block
● Reflection prompt
● Scenario card
● Decision branch
● Interactive widget
**Knowledge Check**
● Multiple choice
● Multi-select
● True / false
● Matching
● Short answer
● Sequence / order
● Case question
**Chart**


● Bar chart
● Line chart
● Pie / donut chart
● Simple comparison chart
**Divider**
● Standard divider
● Section divider
● Spacer
**Image Comparison**
● Before / after slider
● Side-by-side comparison
**Custom Code**
● Custom embed
● Advanced widget shell
The team should implement these as actual structured content units, not just as UI design
categories. Each must have corresponding authoring behavior and learner runtime behavior.

### I.7 Block structure requirements

Every block used in the system should support a structured internal model.
At minimum, the block authoring and storage model should preserve:
● **Content**
● **Settings**
● **Rules**
● **Accessibility metadata
Content**
The actual instructional or media content:
● text
● labels
● prompts
● answer choices
● feedback text


● media links
● captions
● download labels
● scenario text
**Settings**
Display and layout choices appropriate to the block:
● alignment
● width
● spacing
● style variation
● visual options
● layout arrangement
**Rules**
Behavior logic where relevant:
● completion conditions
● answer checking
● retry rules
● continue logic
● branch target logic
● response rules
● required/optional behavior
**Accessibility metadata**
Required support information such as:
● alt text
● transcripts
● labels
● accessibility-ready prompts
The authoring UI must expose these in understandable terms, not raw technical schema
language.

### I.8 Structured input model in the Build page

The Build page must not expose authors to raw JSON, schema fields, or developer-like
configuration complexity.


Instead, the authoring model must use **structured input templates** for each selected block
type.
For example:
● a paragraph block opens heading/body/supporting note fields
● a multiple choice block opens question/options/correct answer/feedback fields
● a scenario card opens situation/prompt/choices/feedback fields
● a reflection block opens prompt/instruction/required-or-optional fields
This is important because the content model must be robust for the system, but easy and
understandable for non-technical creators.

### I.9 Preview and learner runtime parity

A major requirement of the content and authoring model is **runtime parity**.
This means:
● the content authored in Build must render predictably in Preview
● the content shown in Preview must match the learner-facing runtime behavior
● the authoring model must not allow content structures that cannot be rendered
consistently in learner use
Preview must therefore be based on the actual lesson/block runtime, not on a visual
approximation.
The team should treat runtime parity as a core model rule, not only a QA concern.

### I.10 AI-assisted authoring inside the model

The content and authoring model must support strong AI assistance, but only inside the
structured workflow and structured lesson model.
AI should not be implemented as a detached freeform assistant with no awareness of:
● course context
● lesson purpose
● learner action
● learning mode
● approved source materials
● storyboard notes


Instead, AI authoring must operate on structured course and lesson context.
**AI must be able to:**
● draft modules and lessons from storyboard context
● draft lesson blocks from lesson purpose and notes
● generate examples grounded in the course context
● suggest practical activities
● generate checks and feedback
● draft scenarios
● improve language clarity
● condense lessons for mobile use
● suggest better block types for the current lesson purpose
**AI must not:**
● invent the course from nothing without structured inputs
● overwrite creator content silently
● bypass creator review
● operate outside approved course/source context
The team should implement AI as a **context-aware authoring layer inside the content model** ,
not as an external content chatbot.

### I.11 Source-aware authoring model

The authoring model should support the use of approved source/context inputs in lesson
creation.
At minimum, the system should support:
● source upload or linking through creator-side source areas
● source association with the course or lesson where needed
● AI use of only approved source/context materials
● creator visibility into what source context is being used for draft generation
This matters because DEC’s Phase 1 AI authoring is meant to be grounded in real course inputs
and approved materials, not generic public-language generation.

### I.12 Assessment and completion content model

The content model must also support the course’s assessment and completion structure.


At minimum, this includes:
● lesson-level checks
● interactive activities
● final test support where required
● answer evaluation logic
● retry behavior where relevant
● learner completion state
● certificate-linked completion outcome
This should not be treated as an add-on to the content system. It is part of the content model
because assessments and checks are authored inside the same lesson structure and runtime.

### I.13 Reviewability of content

The content and authoring model must support formal review.
That means the system must preserve enough structured content information so that reviewers
can inspect:
● course structure
● lesson completeness
● activities and checks
● learner-facing flow
● readiness state
If the authoring model becomes too loose or too opaque, the review workflow will break. So
reviewability is a real requirement of the content model, not only of the review page.

### I.14 Monitorability of content

The content model must also support the Monitoring page.
That means:
● lessons
● blocks
● checks
● scenarios
● and final tests


must all be implemented in ways that allow meaningful runtime signals to be captured and
associated back to the course structure.
The monitoring model in Phase 1 does not need to expose every low-level technical signal, but
the content model must still make it possible for the system to relate learner performance back
to:
● course
● module
● lesson
● key check or scenario
● intended learner action
Without structured content, this will not work.

### I.15 What the team should not do

The implementation team should **not** :
● build the authoring system as a slide-placement editor
● collapse structured lessons into undifferentiated HTML blobs
● allow unsupported content elements outside the block model
● treat Storyboard as informal notes instead of structured design data
● implement Preview as a separate mock rendering
● implement AI without structured lesson context
● allow content editing patterns that break reviewability, accessibility, or monitoring
These would directly undermine the product model required for Phase 1.

### I.16 Content and Authoring Model — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub content and authoring model**
should be read as:
A workflow-generated, storyboard-backed, version-aware, block-based authoring system in
which courses are structured as courses, modules, lessons, and governed lesson blocks;
authored through structured creator workflows; rendered with preview/runtime parity; and
supported by context-aware AI authoring inside a controlled content model.


## J. AI Authoring System

### Phase 1 DEC Learning Hub Implementation Description

The **AI Authoring System** in the Phase 1 DEC Learning Hub is the creator-side intelligence
layer that supports course production inside the structured workflow. It is not a general chatbot,
not a freeform content generator, and not an autonomous publishing agent. Its role is to help
creators produce better courses faster by drafting, suggesting, refining, and restructuring
content using the course data already captured through the creator workflow. In Phase 1, AI
must function as a **workflow-aware authoring assistant** that is tightly connected to Course
Setup, Diagnosis, Capacity Map, Action Map, Storyboard, and Build.
The most important implementation rule is:
**AI does not start from nothing.**
It works from structured course context, approved source inputs, and the lesson design logic
already created by the human creator.
This requirement is central to DEC’s product model because the platform is intended to produce
practical, local-CSO-relevant learning experiences, not generic training content. The quality of
AI output depends on the quality of the structured inputs gathered earlier in the workflow. That is
why the AI authoring system must be implemented as part of the platform’s content and
workflow architecture, not as an external prompt box.

### J.1 Purpose of the AI Authoring System

In Phase 1, the AI authoring system exists to help creators:
● move faster from analysis into structured course design
● reduce repetitive drafting work
● generate first drafts that are aligned with the course purpose
● improve language clarity and practicality
● turn approved source materials into usable lessons
● create more relevant examples, checks, and scenarios
● strengthen lesson quality without replacing creator judgment
The AI layer should therefore be treated as a **creator productivity and quality support layer** ,
not as a replacement for the creator workflow. The creator remains the final decision-maker at
every step.

### J.2 Where AI is used in Phase 1


AI support in Phase 1 should be available mainly in two areas:

**1. Storyboard stage**
AI helps turn structured workflow inputs into:
    ● draft module structures
    ● draft lesson sequences
    ● lesson purpose suggestions
    ● lesson flow suggestions
    ● initial check/output suggestions
    ● initial scenario ideas
    ● plain-language course design summaries
**2. Build stage**
AI helps turn storyboard and source context into:
    ● first lesson drafts
    ● block-level content drafts
    ● practical examples
    ● knowledge checks
    ● scenario content
    ● feedback text
    ● language refinement
    ● content condensation for mobile use
    ● more locally grounded or practical rewrites
These are the main AI entry points for Phase 1. AI may support other small actions such as
summarization or wording improvement in nearby pages, but Storyboard and Build are the
primary authoring surfaces that the full-stack team must support.

### J.3 AI operating model

The AI Authoring System must be implemented as a **context-aware internal service layer**
inside the creator workflow.
That means AI actions must operate with awareness of:
● the current course
● the current course version
● the current module or lesson
● the course title and summary
● the learner group


● the diagnosis summary
● the capacity area
● the learner actions
● the learning mode
● the storyboard structure
● the lesson purpose
● the lesson-level AI notes
● approved source/context materials
The system must not treat AI as a single generic text box with no structured context. The
implementation should always bind AI requests to a known course and workflow context. This is
what makes the output relevant, reviewable, and useful.

### J.4 Required AI context inputs

For implementation purposes, the AI layer should be able to use the following structured inputs
where available:
**Course-level inputs**
● course title
● short summary
● learner group
● language
● course level
● topic area
**Diagnosis inputs**
● main learner challenge
● desired better performance
● field evidence summary
● key learner realities
● identified knowledge/skill focus
**Capacity and action inputs**
● selected capacity area
● main practical change
● learner actions
● common difficulties
● likely learning support types
● signals of progress


**Storyboard inputs**
● module structure
● lesson titles
● lesson purposes
● linked learner actions
● learning modes
● checks and outputs
● lesson AI notes
● build handoff notes
**Source/context inputs**
● approved source files
● contextual notes
● approved examples
● uploaded support materials
The AI layer should degrade gracefully if some inputs are missing, but the system should be
designed so that the strongest results come from the full structured workflow. That is one reason
the earlier creator pages matter so much to the quality of later authoring.

### J.5 AI actions required in Storyboard

The Storyboard page is the first major AI design surface.
At minimum, the AI system should support the following actions there:

**1. Generate draft structure**
Generate a first module and lesson structure using:
    ● diagnosis
    ● action map
    ● capacity focus
    ● course metadata
**2. Suggest lesson flow**
Suggest a better sequence of lessons or learning flow if the current structure is too weak or too
generic.
**3. Suggest practice points**


Recommend where guided practice, checks, or scenario moments should appear based on the
learner actions and learning mode.

**4. Suggest outputs and checks**
Propose what learners could answer, produce, or demonstrate by the end of each lesson or
module.
**5. Simplify design language**
Rewrite dense or overly abstract storyboard descriptions into simpler, creator-friendly language.
These actions must remain editable. The creator reviews the draft structure and adjusts it before
moving to Build.

### J.6 AI actions required in Build

The Build page is the main AI production surface.
At minimum, the AI system should support the following actions there:

**1. Draft Lesson from Storyboard**
Create a first lesson draft directly into the lesson canvas using:
    ● lesson purpose
    ● linked learner action
    ● learning mode
    ● lesson-level AI notes
    ● approved sources
**2. Draft Block**
Draft content for the selected block type only.
Examples:
    ● paragraph
    ● example
    ● scenario prompt
    ● question
    ● feedback text
    ● summary
**3. Suggest Better Block Type**


Recommend a more suitable approved block type when the current content would work better in
another form.
Examples:
● turn long explanation into accordion
● convert weak static example into scenario card
● split dense content into explanation plus checklist

**4. Draft Scenario**
Generate:
    ● situation setup
    ● learner options
    ● plausible weak and strong choices
    ● coaching feedback
    ● simple branch logic
**5. Draft Knowledge Check**
Generate:
    ● question wording
    ● answer choices
    ● distractors
    ● correct feedback
    ● incorrect feedback
    ● case-style checks where relevant
**6. Simplify Language**
Rewrite content for clarity, readability, and learner suitability.
**7. Make It More Local / Practical**
Replace generic language or examples with more grounded, practical local-CSO-style examples
using the stored course context.
**8. Condense for Mobile**
Shorten or restructure the content so it is more usable on small screens and in lower-bandwidth
contexts.
These actions are required because they reflect the practical authoring work the creator needs
help with in Phase 1.


### J.7 Source-aware AI behavior

The AI system must support **source-aware drafting**.
That means:
● approved source files may be used as AI context
● AI should work from those materials where available
● the creator should know when source-backed drafting is being used
● source use must remain within creator permission boundaries
This is especially important for DEC because the learning content should not drift into
unsupported, generic content generation when relevant approved materials exist.
For implementation, source-aware drafting should support cases such as:
● summarizing approved materials into creator-ready language
● converting source material into a lesson explanation
● turning dense guidance into a short practice block
● extracting likely knowledge checks from source content
● grounding examples in approved reference material

### J.8 Creator control rule

The strongest governance rule in Phase 1 is:
**AI always drafts; the creator always decides.**
This must be reflected clearly in the implementation.
That means:
● AI outputs appear as drafts or suggestions
● the creator can accept, edit, reject, or regenerate them
● AI must not silently overwrite existing approved creator content
● AI must not publish directly
● AI must not move the course forward in the workflow automatically
The system should support creator trust by making AI assistance feel useful and controlled, not
opaque or unpredictable.


### J.9 AI output insertion behavior

The full-stack team should implement AI output behavior carefully.
At minimum:
● AI-generated content should appear in a clearly editable state
● inserted content should remain visible and reviewable in the normal authoring interface
● creators should be able to replace or remove AI-generated content easily
● AI suggestions should stay associated with the lesson or block they belong to
The AI layer should not produce orphaned text outside the normal authoring flow. All AI output
must land inside the structured authoring model.

### J.10 AI and storyboard relationship

The storyboard is the strongest control layer for AI authoring in Phase 1.
The team should treat Storyboard as the **main design backbone** for AI-assisted Build.
This means:
● lesson purpose must guide lesson drafting
● linked learner action must guide checks and activities
● learning mode must influence content type and flow
● AI notes must refine the tone and constraints of the draft
● build output should reflect storyboard intent
This is how the AI authoring system avoids generating generic course content. The better the
storyboard, the stronger the lesson draft. That relationship must be preserved by the
implementation.

### J.11 AI and block model relationship

The AI authoring system must respect the block-based content model.
That means AI should generate:
● content that fits the selected block type
● suggestions that map to supported block types
● activity ideas that can be implemented using approved components
● scenario suggestions that still fit the governed interaction model


AI must not generate content structures the runtime cannot support. It must stay inside the
content model already defined for the platform.

### J.12 AI logging and traceability

At minimum, the system should preserve enough traceability for AI use inside the creator
workflow.
The implementation should aim to retain:
● which lesson or block AI acted on
● which AI action was used
● what workflow context was provided
● whether the creator accepted or edited the output where relevant
This does not need to become a heavy audit console in the product UI, but the platform should
not treat AI as an invisible untracked event. AI-assisted authoring is part of the content creation
process and should remain attributable.

### J.13 AI safety and scope rules

The team should implement the AI authoring system with clear boundaries.
AI should **not** :
● invent the full course without structured inputs
● act without a bound course/lesson context
● replace creator judgment
● bypass review workflow
● publish content
● access unauthorized source materials
● output unsupported runtime structures
● operate outside the approved creator workflow surfaces
AI should remain:
● workflow-bound
● context-bound
● source-aware
● editable
● human-controlled


These rules are essential to keep the AI layer useful without letting it distort the product model.

### J.14 AI UX expectations

The AI system should feel:
● helpful
● predictable
● specific
● embedded in the actual work
● not like a separate chat app bolted onto the product
That means:
● clear action buttons such as “Draft Lesson from Storyboard”
● clear context display such as “AI drafting from lesson purpose and approved sources”
● editable outputs inside the normal build interface
● lesson-appropriate suggestions rather than vague generic text
This matters for adoption. Non-technical creators should experience AI as a practical authoring
aid, not as a technical burden.

### J.15 What the full-stack team should not do

The implementation team should **not** :
● build AI as a generic unrestricted chat box with no workflow awareness
● let AI run without using the structured creator workflow inputs
● treat source-aware behavior as optional if approved sources are central to the content
● allow AI to bypass creator review
● allow AI to generate unsupported lesson structures outside the block model
● treat AI as the main author while the creator becomes secondary
These would weaken the full Phase 1 product and produce generic content instead of
DEC-specific learning design.

### J.16 AI Authoring System — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub AI Authoring System** should
be read as:


A workflow-aware, storyboard-governed, source-aware creator support layer that drafts and
refines course structures, lessons, blocks, checks, and scenarios inside the structured authoring
model, while always keeping the creator in control and keeping all output inside the approved
content workflow.

## K. Monitoring and Analytics

### Phase 1 DEC Learning Hub Implementation Description

The **Monitoring and Analytics** layer in the Phase 1 DEC Learning Hub is the system that turns
learner activity, course use, and creator workflow events into usable signals for improvement,
oversight, and reporting. In Phase 1, this layer must be implemented as a **practical, governed
learning-record and course-monitoring system** , not as a decorative dashboard and not as a
separate business-intelligence product detached from the learning workflows. It must connect
directly to the course structure, learner progress, creator workflow, and content lifecycle of the
platform.
For the full-stack team, the key rule is:
Monitoring and analytics in Phase 1 must be useful at course level, trustworthy at system level,
and grounded in the structured course and workflow model.
That means the system must not only count page views or logins. It must capture signals that
relate to:
● course progress
● lesson completion
● checks and final tests
● scenario or activity behavior where supported
● certificate outcomes
● creator-side course workflow events
● and course-specific improvement patterns visible in the Monitoring page
At the same time, it must remain bounded within Phase 1 and avoid overclaiming predictive or
advanced analytics that do not yet have the required product and data pipeline behind them.

### K.1 Purpose of the monitoring and analytics layer

In Phase 1, the monitoring and analytics layer exists to support four main needs:


**1. Learner progress tracking**
The system must show whether learners are:
    ● starting courses
    ● progressing through lessons
    ● completing required checks
    ● taking and passing final tests where applicable
    ● completing courses
    ● earning certificates when course completion rules are met
**2. Course improvement**
The system must provide course creators with practical signals about:
    ● where learners are dropping off
    ● which lessons are performing well or poorly
    ● which checks are weak, confusing, or too difficult
    ● whether scenarios and activities are functioning as intended
    ● what may need revision in the next draft
**3. Platform oversight**
The system must allow reviewer/admin roles to see enough information to oversee:
    ● course usage
    ● completion patterns
    ● release and version status
    ● workflow movement
    ● general platform functioning within Phase 1 scope
**4. Evidence-ready reporting foundation**
The system must create a clean foundation for course-level and platform-level reporting by
capturing structured events linked to:
    ● course
    ● version
    ● module
    ● lesson
    ● block or activity where relevant
    ● learner
    ● role/workspace context where relevant
This does not mean building a large external BI environment in Phase 1. It means the platform
must produce consistent, trustworthy internal data from real platform use.


### K.2 Monitoring and analytics product surfaces

In Phase 1, monitoring and analytics should appear through different product surfaces
depending on role.

**1. Learner-facing progress signals**
Visible in the learner workspace:
    ● current progress
    ● completed lessons or modules
    ● final test result where relevant
    ● course completion status
    ● certificate access after successful completion
**2. Creator-facing monitoring page**
Visible in the creator portal:
    ● course overview
    ● learner progress
    ● lesson performance
    ● checks and scenarios
    ● signals of change
    ● improvement notes
    ● revision trigger
**3. Reviewer / publisher and admin oversight views**
Visible according to role and scope:
    ● course status and readiness visibility
    ● course usage summaries where appropriate
    ● oversight of published courses and completion patterns
    ● operational reporting views inside admin/governance scope
This means the analytics layer is shared, but role-specific in how it is presented.

### K.3 Core telemetry model

The platform should implement a **canonical event-based monitoring model** in Phase 1. This
means the system should capture standard events from trusted runtime and workflow surfaces


rather than relying on ad hoc UI counters. The DEC analytics specification explicitly requires
canonical events, tenant safety, version traceability, idempotency, and a derived analytics layer
built on top of governed event capture.
For implementation purposes, the monitoring model should assume events are linked, where
applicable, to:
● organization / tenant
● user
● role/workspace context
● course
● course version
● module
● lesson
● block or activity
● time of event
● event type / verb
● runtime source
The full-stack team does not need to expose this structure directly in the UI, but it must exist in
the implementation model so that the platform can produce consistent course and learner
monitoring.

### K.4 Minimum learner events required in Phase 1

At minimum, the system should be able to capture and use the following learner-side event
families:
**Course access and progression**
● course opened
● module opened
● lesson started
● lesson completed
● course resumed
● course completed
**Assessment and activity events**
● knowledge check answered
● final test started
● final test submitted
● score/result recorded
● scenario or branching activity interacted with, where relevant


● reflection or activity submitted where tracked
**Completion and credential events**
● completion criteria met
● certificate issued
● certificate viewed or downloaded where supported
These events are necessary because they power both the learner progress view and the creator
monitoring page.

### K.5 Minimum creator-side monitoring events required in Phase 1

The monitoring layer should also capture key creator workflow events so the platform can
support governance, oversight, and honest reporting of course lifecycle movement.
At minimum, the system should be able to capture:
● course created
● draft saved
● workflow step completed
● storyboard created or updated
● lesson built or marked ready
● preview opened
● review submitted
● course returned
● course approved
● course published
● revision created
The DEC run-reporting and execution materials strongly emphasize truthful progression and
traceable movement through slices and lifecycle states; the product implementation should
reflect that same discipline in its core platform behavior.

### K.6 Course-specific monitoring model

One of the most important product requirements in Phase 1 is that the creator-facing Monitoring
page must not behave like a generic analytics dashboard. It must be **course-specific** and
grounded in the logic captured earlier in the creator workflow.
That means the monitoring layer must be able to connect later course-use signals back to
earlier creator inputs, especially:


● the learner challenge from Diagnosis
● the capacity focus from Capacity Map
● the learner actions from Action Map
● the checks, outputs, and flow defined in Storyboard
● the actual lessons and activities built in Build
This is why the earlier creator workflow needs structured data capture. The monitoring layer
should use those structured records to organize what creators see later.
For example, the Monitoring page should be able to show:
● which learner action the course was supposed to strengthen
● which lesson(s) support that action
● which check or scenario relates to it
● what completion or performance signals are available from runtime use
This is how monitoring becomes practical and improvement-oriented instead of generic.

### K.7 Monitoring page requirements for creators

The creator-facing Monitoring page must support the following sections in Phase 1:

**1. Course overview**
At minimum:
    ● learners started
    ● learners completed
    ● completion rate
    ● average or indicative time spent
    ● recent activity
    ● course status
**2. Learner progress**
At minimum:
    ● lesson-by-lesson progression
    ● drop-off points
    ● where learners stop or return
    ● high-level progression through the course
**3. Lesson performance**


At minimum:
● lesson completion rate
● average time spent
● lessons performing well / needing attention
● quick connection to lesson revision if needed

**4. Checks and scenarios**
At minimum:
    ● check completion
    ● correct / incorrect patterns
    ● weak feedback or repeated wrong choices
    ● scenario path tendencies where supported
**5. Signals of change**
At minimum:
    ● a course-level view of the key action or change signals identified earlier
    ● what course-based evidence is actually available
    ● what seems to be improving or underperforming
**6. Improvement notes**
At minimum:
    ● creator observations
    ● system-surfaced weak points
    ● revision priorities
    ● create revision action
This page must feel actionable. A creator should leave it knowing what to improve, not just what
numbers exist.

### K.8 Learner progress and completion logic

Monitoring and analytics must respect the course’s actual completion rules.
This means the system must not assume that:
● simply opening a course means progress
● simply reaching the last lesson means completion
● completion always automatically implies certificate issuance


Instead, the monitoring layer must reflect the course’s configured completion logic, including:
● required lesson completion
● required activities or checks where used
● final test completion
● required test threshold, such as 80 percent, where that is part of the course rule
● certificate outcome after those rules are satisfied
The analytics layer must therefore derive completion and certificate outcomes from the course
logic, not from generic assumptions.

### K.9 Version-bound monitoring

The DEC analytics specification requires **version traceability**. For Phase 1, the full-stack team
should treat this as a real implementation rule:
Course-use data must be tied to the specific course version the learner actually used.
This matters because:
● creators may later revise courses
● monitoring should reflect the published version in use at the time
● comparisons across revisions depend on version-aware records
● review and publishing logic depends on draft vs published distinction
The monitoring layer should therefore associate learner progress and key course events with:
● course
● course version
● relevant module / lesson
● and where useful, activity or check context

### K.10 Admin and oversight analytics

In Phase 1, admin/reviewer roles should have access to a bounded oversight view, not
necessarily the same detailed creator monitoring view for every course.
At minimum, oversight analytics should support:
● high-level course usage
● course completion patterns
● course publication status


● learner counts where allowed
● role-appropriate system oversight
The product should avoid exposing unrelated sensitive learner-level data to users who do not
need it. Monitoring visibility must continue to respect the platform’s role and tenant model.

### K.11 Certificate and credential analytics

Because the learner platform includes completion outcomes and certificate access, the
monitoring layer should also support credential-related signals.
At minimum, the system should be able to reflect:
● how many learners reached completion
● how many learners met the final assessment threshold where required
● how many certificates were issued
● how many certificates were accessed or downloaded where supported
This is useful both for learner support and for creator/admin understanding of whether courses
are leading to real completion outcomes.

### K.12 Data quality and trustworthiness rules

The DEC analytics specification is explicit that the analytics engine should be built on governed
telemetry rather than decorative dashboard logic. The implementation should therefore follow
these rules in Phase 1:

**1. Canonical events over ad hoc counters**
Core course analytics should come from the event model, not only from local UI state.
**2. Version traceability**
Content-related learner events must remain linked to the correct course version.
**3. Tenant safety**
Analytics visibility must obey tenant and role boundaries.
**4. No client-only trusted metrics**
Admin-grade or course-grade metrics should not exist only in the browser with no trusted
backend source.


**5. No overclaiming**
The product should not present signals as proof of broader institutional impact when they are
only course-level learning signals.
These rules are important for platform trust and for later expansion.

### K.13 Signals of change — bounded Phase 1 interpretation

The creator workflow earlier captures practical change signals in Action Map and Storyboard.
The Monitoring page should make use of those, but carefully.
The correct Phase 1 implementation stance is:
● the system can show **course-level evidence signals**
● the system can connect those signals to intended learner actions
● the system can help creators judge whether the course appears to be supporting the
intended change
But the system should **not** overclaim that it can prove full real-world institutional impact from
course data alone.
That means “signals of change” in Phase 1 should be implemented as:
● action-linked course-use evidence
● improvement-oriented course indicators
● patterns in learner responses, completion, practice, and checks
not as a substitute for full external program evaluation.
This is the right balance between usefulness and honesty.

### K.14 Monitoring-to-revision loop

The monitoring and analytics layer must support one of the most important lifecycle behaviors in
Phase 1:
Monitoring should lead back into revision.
That means the creator-facing Monitoring page must allow the creator to:
● identify weak lessons or activities
● capture improvement priorities


● and start a revision workflow from that point
This turns analytics into product improvement rather than passive observation. It also closes the
content lifecycle loop between:
● Build
● Preview
● Review
● Published use
● Monitoring
● Revision
The full-stack team should preserve that loop as a real workflow connection.

### K.15 What the team should not do

The implementation team should **not** :
● build only a generic dashboard with no connection to course structure
● rely only on pageview-style counters for core course monitoring
● ignore course version when storing usage signals
● expose sensitive learner data outside role/tenant boundaries
● present weak heuristics as strong proof of external impact
● treat monitoring as optional after publication
● separate monitoring completely from the creator improvement workflow
These would weaken the product and contradict the DEC analytics direction.

### K.16 Monitoring and Analytics — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub Monitoring and Analytics
layer** should be read as:
A governed, version-aware, role-aware monitoring system that captures learner and creator
workflow events, powers learner progress and creator-facing course monitoring, supports
completion and certificate outcomes, and provides practical, course-specific signals that help
creators and admins understand performance and drive revision.

## L. Technical Architecture


### Phase 1 DEC Learning Hub Implementation Description

The **Phase 1 DEC Learning Hub** must be implemented as a **single integrated web
application** with role-aware workspaces, structured content management, governed course
lifecycle, learner runtime delivery, and AI-assisted authoring support. The technical architecture
must support the full Phase 1 product boundary already defined in earlier sections: learner
platform, creator portal, review/publishing surface, admin workspace, shared access control,
structured content model, course versioning, monitoring, and certificate-enabled completion
flow.
For the full-stack team, the correct implementation reading is:
Build one governed product with shared platform services, role-separated workspaces,
structured data, and version-aware content delivery — not a collection of disconnected
interfaces or prototypes.
This section defines the minimum technical architecture the team should treat as the working
Phase 1 baseline.

### L.1 Architectural stance

The technical architecture for Phase 1 should follow these core decisions:
● **one application**
● **one shared authentication boundary**
● **one shared primary database**
● **one governed content lifecycle**
● **one structured content model**
● **multiple role-aware workspaces**
● **published learner runtime separated from draft authoring state**
● **AI support embedded inside the creator workflow**
● **telemetry and monitoring linked to the canonical course structure**
The team should not implement Phase 1 as separate mini-products for learners, creators, and
admins with duplicated logic and weak coordination. These are different workspaces inside one
system.

### L.2 Recommended stack baseline

The uploaded DEC specifications already point toward a modern web stack centered on:
● **Next.js App Router**


● **React**
● **TypeScript**
● **Tailwind CSS**
● **PostgreSQL**
● **Supabase**
● **Vercel**
This should be treated as the primary Phase 1 implementation baseline unless DEC explicitly
approves a change.
**Frontend / application layer**
Recommended baseline:
● Next.js App Router for route-aware workspace structure
● React component architecture for shared and role-specific interfaces
● TypeScript for typed data and safer workflow logic
● Tailwind CSS for consistent design system implementation
**Backend / platform layer**
Recommended baseline:
● PostgreSQL as the primary relational store
● Supabase for auth, database access, and storage support where used
● server-side trusted logic through Next.js server actions / route handlers and supporting
backend services as appropriate
**Hosting / deployment layer**
Recommended baseline:
● Vercel for application deployment and managed environment handling
● structured environment separation such as local/dev, staging/UAT, and production
The team should not treat this stack as an abstract suggestion. It is already aligned with the
broader DEC architecture direction and should be used to avoid needless divergence.

### L.3 Application structure

The system should be implemented as a **single application with route-separated
workspaces**.


At minimum, the architecture should support these route families or equivalent structured
workspace groupings:
● public / auth entry routes
● learner workspace routes
● creator workspace routes
● review / publishing routes
● admin routes
● shared API / backend routes where required
The route design must enforce role-aware separation. The learner should never land inside
creator or admin surfaces, and creator-side workflows should not be mixed into learner routes.
The DEC auth and route architecture notes strongly support this workspace separation model.

### L.4 Workspace-based frontend architecture

The frontend should be organized around **workspace shells** , not only page components.
At minimum, the application should have:

**1. Learner shell**
Used for:
    ● learner dashboard
    ● course list
    ● course player
    ● completion/certificate views
**2. Creator shell**
Used for:
    ● Home
    ● course workflow pages
    ● build studio
    ● preview
    ● monitoring
    ● sources/assets where applicable
**3. Review / publishing shell**
Used for:


```
● review queue
● course review screens
● approval / return / publish actions
```
**4. Admin shell**
Used for:
    ● user and role management
    ● settings
    ● oversight views
Each shell should provide:
    ● consistent layout
    ● role-aware navigation
    ● appropriate action controls
    ● workspace-specific mental model
This is important because the platform is not just a list of pages. Workspace separation is part of
the product behavior.

### L.5 Canonical data architecture

The data model in Phase 1 must be **structured, relational, and version-aware**.
At minimum, the architecture should support the following main entity groups:
**Identity and access**
● user
● organization / tenant
● membership
● role / permission assignment
● session / access state as needed
**Course and content**
● course shell
● course version
● module
● lesson
● lesson block
● source


● asset
● review record
● publish state
**Learner runtime**
● enrollment or access record
● learner progress
● lesson completion
● check / test result
● final test result
● certificate record
**Workflow and authoring**
● diagnosis record
● capacity map record
● action map record
● storyboard record
● AI authoring notes
● revision records
**Monitoring and telemetry**
● canonical events
● course-level summaries
● learner progress summaries
● course performance summaries
The team must not implement the creator workflow only as unstructured JSON blobs stored in
one catch-all field. The workflow stages are meaningful system records and should remain
queryable and reusable.

### L.6 Content lifecycle architecture

The content lifecycle must distinguish clearly between:
● **course shell**
● **draft version**
● **submitted version**
● **approved / published version**
● **revision version**
This is a non-negotiable technical rule in Phase 1.


Creators must work on draft versions.
Reviewers must inspect submitted versions.
Learners must consume published versions.
Revisions must create a new controlled editing path instead of directly mutating live learner
content.
This means the team should implement:
● version records
● status transitions
● protected learner runtime sourcing from published state
● creator-side edit access only on draft/revision states
This is essential for both product integrity and monitoring accuracy.

### L.7 Structured block architecture

The lesson authoring and runtime model must be block-based.
Each lesson should be stored and rendered as an ordered sequence of recognized block
records. Each block must belong to a supported block family and subtype and must preserve
structured subfields such as:
● content
● settings
● rules
● accessibility metadata
The block model must be used consistently across:
● Build
● Preview
● learner runtime
● review
● monitoring references where relevant
This is one of the strongest architectural decisions in the DEC documentation and should not be
diluted into a loose HTML-content approach.

### L.8 Build studio architecture


The Build page should be implemented as a structured studio surface with three coordinated
panels:
● left: course structure + block library
● center: lesson canvas
● right: block setup + input templates + AI support + guidance
From a technical perspective, this means the system should support:
● live lesson loading from storyboard-linked structure
● controlled block insertion
● block reordering
● block editing via structured forms
● lesson draft persistence
● lesson context display from storyboard
● AI actions bound to lesson/block context
The Build studio should not be engineered as a freeform design canvas. The technical
implementation should reflect the structured block model and storyboard-governed authoring
flow already defined in the product design.

### L.9 AI architecture baseline

The AI authoring system in Phase 1 should be implemented as a **server-side, governed
orchestration layer** rather than purely client-side prompting.
At minimum, the AI architecture should support:
● context gathering from structured workflow records
● prompt construction from course, lesson, and source context
● controlled AI action types such as draft lesson, draft block, draft scenario, simplify
language
● return of structured or editable draft outputs to the normal authoring interface
● traceability of AI actions
The AI layer should be able to access:
● course metadata
● diagnosis summary
● capacity map
● action map
● storyboard structure
● lesson purpose
● lesson AI notes


● approved source/context materials
The AI layer should not:
● operate detached from the course record
● write directly into published runtime
● bypass creator review
● ignore access control on source/context materials
A server-side orchestration model is the safest and most appropriate architecture for these
needs.

### L.10 Source and asset architecture

Phase 1 should implement a clear separation between:
● **sources**
● **assets
Sources**
Sources are context materials used to inform or ground course creation and AI drafting, such
as:
● reference documents
● notes
● transcripts
● guidance material
● workshop outputs
**Assets**
Assets are reusable media or delivery components used in courses, such as:
● images
● downloads
● audio/video files
● embedded media
● reusable files
The architecture should support:
● secure storage
● permission-aware access


● association to course and/or lesson where needed
● creator-side retrieval and reuse
● source-aware AI use where approved
The team should not merge all uploaded materials into one uncontrolled file area.

### L.11 Authentication and authorization architecture

The technical architecture must enforce the multi-tenant and role-aware access model already
defined earlier.
At minimum, the system must support:
● sign-in flows
● protected workspaces
● route protection
● organization / membership-aware access resolution
● role-aware UI visibility
● backend authorization for sensitive actions
The team must not rely only on frontend hiding of routes or actions. Authorization must exist in
the backend and data layer as well.

### L.12 Monitoring and telemetry architecture

The monitoring and analytics layer must be technically supported through a **governed event
pipeline** and derived views.
At minimum, the architecture should support:
● learner progression events
● check/final test events
● completion and certificate events
● creator workflow events
● version-aware event association
● course-level summary queries
● creator-facing monitoring page data
● admin/reviewer oversight summaries where needed
The team should not build Monitoring purely as manually computed UI counters. The DEC
analytics architecture requires canonical events and a derived analytics layer.


### L.13 Certificate architecture

Phase 1 must support certificate-enabled course completion.
The certificate architecture should include:
● rule-aware completion evaluation
● final test threshold handling where applicable
● certificate record generation after valid completion
● learner-side certificate access
● certificate persistence tied to learner and course version context
● certificate verification support if already in scope of the platform architecture
This should not be implemented as a loose front-end badge. It must be part of the trusted
backend logic tied to course completion rules.

### L.14 Environment model

The architecture should support at least three working environments:
● **development**
● **staging / UAT**
● **production**
The full-stack team should use this environment separation to support:
● feature development
● integration testing
● role and route validation
● workflow testing
● course preview and acceptance checks
● safer publication and release control
This is especially important because the platform includes multiple roles, content states, and
learner/runtime transitions that must be validated before production use.

### L.15 Deployment and release expectations

The technical architecture should support:


● stable deployable builds
● environment-based configuration
● protected secrets and API keys
● controlled release process
● consistent runtime behavior between staging and production
● practical support for future iteration without architectural rewrite
The team should build Phase 1 as a real deployable service, not as a local-only proof of
concept.

### L.16 Performance and usability baseline

The architecture must support the non-functional requirements of the product, especially:
● responsive UI
● acceptable performance on common devices
● usable learner runtime on mobile
● usable creator workflow for non-technical staff
● low-clutter frontend behavior
● reliable save/resume behavior
● predictable draft handling
This affects technical choices such as:
● component design
● route loading strategy
● client/server boundaries
● asset loading
● lesson rendering strategy
● AI action handling

### L.17 What the team should not do

The implementation team should **not** :
● build separate disconnected apps for each workspace unless DEC explicitly changes the
architecture
● flatten all workflow data into one generic content object
● collapse course shell and course version into one mutable record
● build the lesson editor as a blank-canvas slide designer
● implement AI as a detached frontend chatbot with no structured context


● rely only on frontend permission hiding
● treat monitoring as only dashboard widgets with no trusted event model
● mix draft and published content sources in learner runtime
These shortcuts would undermine the architecture needed for a stable Phase 1 platform.

### L.18 Technical Architecture — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub technical architecture** should
be read as:
A single integrated, role-aware, multi-tenant web application built on a modern typed frontend
and relational backend stack, with structured workflow data, version-aware course lifecycle,
governed block-based authoring, server-side AI orchestration, protected learner runtime,
canonical monitoring events, and environment-separated deployment.

## M. Non-Functional Requirements

### Phase 1 DEC Learning Hub Implementation Description

The **Non-Functional Requirements** define how the Phase 1 DEC Learning Hub must perform,
behave, and be experienced as a working product beyond its visible features. These
requirements matter because the platform is intended to be a real, usable DEC service for local
CSOs and DEC staff, not just a feature-complete prototype. The full-stack team must therefore
treat these requirements as implementation constraints that shape design, architecture, testing,
and release quality across the learner platform, creator portal, review surface, and admin
workspace.
For implementation purposes, the non-functional baseline for Phase 1 should be read as:
The DEC Learning Hub must be secure, usable, accessible, mobile-first, role-safe, version-safe,
performant enough for real use, and maintainable enough to support iterative improvement
without architectural rework.
This section describes the required non-functional baseline.

### M.1 Usability


The platform must be usable by the intended user groups in Phase 1:
● learners, including local CSO users accessing courses in practical work settings
● creators, including non-technical content creators and DEC staff
● reviewers / publishers
● admins
**Product expectation**
The system should feel:
● clear
● understandable
● calm
● low-clutter
● guided where needed
● consistent across related pages
**Required usability behavior**
The team should implement interfaces so that:
● each workspace has a clear purpose
● role-relevant navigation is obvious
● users can tell where they are and what to do next
● creators are guided through workflow steps rather than dropped into open-ended
complexity
● learners can move through courses without confusion
● important actions are visible but not overwhelming
● forms and authoring controls use simple, practical terminology
**What should be avoided**
The platform should not feel:
● crowded
● overly technical
● admin-heavy for normal users
● inconsistent from page to page
● dependent on hidden knowledge of the workflow
Usability is especially important because the creator workflow is complex in structure, but it must
still feel manageable to non-technical course creators.


### M.2 Accessibility

Accessibility is a core Phase 1 requirement, not a later enhancement.
The platform should align with the agreed accessibility baseline for both:
● the learner-facing platform
● the creator-facing platform
**Required accessibility expectations**
At minimum, the system should support:
● keyboard-accessible navigation
● readable contrast
● screen-reader-friendly structure where appropriate
● meaningful labels on form controls
● accessible button and interaction states
● alt text support for images
● transcript or caption support for audio/video where required
● clear interaction feedback
● avoidance of interaction patterns that are unusable on assistive technologies or mobile
devices
**Creator-side accessibility relevance**
The creator portal must make it possible for creators to enter:
● alt text
● captions or transcript references
● accessibility-relevant block settings
**Learner-side accessibility relevance**
The learner runtime must render authored content in a way that preserves accessibility support
and does not break it at runtime.
The team should not treat accessibility as only front-end styling. It must exist in:
● layout
● component behavior
● form design
● media handling
● and content authoring support


### M.3 Mobile-first and responsive behavior

The Phase 1 DEC Learning Hub must be implemented as a **mobile-first web platform**.
This matters for both:
● learner access, where mobile use is especially important
● creator use, where at minimum responsive support should remain stable even if heavy
authoring is more practical on larger screens
**Required behavior**
At minimum:
● learner runtime must work well on common mobile screens
● course content must remain readable and navigable on smaller devices
● interaction elements must remain tappable and usable
● layouts must adapt gracefully across desktop, tablet, and mobile
● preview must support device-mode checking
● dense layouts should collapse appropriately on smaller screens
**Product expectation**
The platform should not assume desktop-only use for learners.
It should not require hover-dependent interactions to complete core learner tasks.
It should not allow authored content to render in unusable ways on mobile devices.
For creators, full authoring may still be more comfortable on larger screens, but the system shell
and navigation should remain responsive and stable across common device sizes.

### M.4 Low-bandwidth and practical delivery readiness

The platform is being built for a context where bandwidth and device conditions may be
constrained. Phase 1 should therefore be engineered with practical delivery discipline.
**Required behavior**
The team should optimize for:
● reasonable load behavior on ordinary connections
● efficient asset loading
● lessons that do not assume heavy continuous bandwidth
● support for transcript/text alternatives where media is used
● sensible lesson rendering even when media-rich content is present


● practical course design patterns that do not depend on oversized assets
**Product expectation**
The learner experience should remain useful even when connectivity is imperfect.
The creator workflow should help surface overly dense or mobile-unfriendly lesson design
patterns.
The system should avoid unnecessary front-end weight in critical learning flows.
This does not mean Phase 1 must fully solve offline learning, but it must avoid being built in a
way that assumes ideal connectivity.

### M.5 Performance

The product must perform well enough to be credible as a working platform.
**Required performance expectations**
At minimum:
● protected workspace navigation should feel responsive
● common pages should load predictably
● lesson runtime should not feel sluggish under ordinary use
● save draft actions should complete reliably
● course preview should open in a reasonable time
● monitoring pages should present usable summaries without dashboard overload
● AI actions should provide visible working feedback rather than silent long waits
**Performance-sensitive areas**
The team should pay special attention to:
● creator workflow transitions
● Build page behavior with many blocks
● learner course player
● final test submission
● monitoring summary queries
● AI generation actions
● asset/media rendering
The platform does not need unrealistic speed guarantees in every case, but it must not feel
unstable or heavy in its main product flows.


### M.6 Reliability and state integrity

The platform must behave reliably in real use. This is especially important because Phase 1
includes:
● multi-step creator workflows
● draft saving
● review state transitions
● learner progress
● final tests
● certificates
● monitoring signals
● role-aware access boundaries
**Required reliability expectations**
At minimum:
● draft saves must persist correctly
● users must be able to leave and return without losing workflow state
● learner progress must persist correctly
● course completion must not be lost or inconsistently recalculated
● review and publish state transitions must be stable
● certificate outcomes must reflect the correct completion rules
● monitoring signals must reflect real runtime use, not broken partial counters
The team must not allow fragile client-side-only state to become the source of truth for important
outcomes such as:
● course status
● learner completion
● certificate eligibility
● review readiness
These require trusted backend persistence.

### M.7 Security

Security is a core non-functional requirement because the platform includes:
● authenticated access
● role-aware workspaces
● learner progress and certificate data
● internal creator materials


● source/context materials
● draft and published content boundaries
● AI-assisted workflow actions
**Required security expectations**
At minimum:
● authenticated users only for protected workspaces
● route protection
● backend authorization for sensitive actions
● role-aware access enforcement
● organization/tenant-aware data protection
● safe handling of uploaded source and asset files
● secure secret and key management
● safe handling of AI service credentials
● separation between internal draft materials and learner-visible published content
**Product expectation**
The system must not rely only on hidden buttons or frontend navigation constraints. Sensitive
actions and data access must be protected by backend logic as well.
The platform must also avoid exposing internal materials to the learner runtime, including:
● draft content
● authoring notes
● internal source/context files
● review comments
● internal workflow state

### M.8 Role safety and permission integrity

Because the Phase 1 product depends on role-aware workspaces, permission integrity is a
non-functional requirement in its own right.
**Required behavior**
The system must reliably ensure that:
● learners stay inside learner surfaces
● creators stay inside creator-authorized functions
● reviewer / publisher actions are restricted to the right roles
● admin controls remain restricted


● users do not gain access to unrelated areas by URL guessing or weak client logic
**Product expectation**
Role behavior must remain consistent across:
● navigation
● routes
● page actions
● data access
● workflow transitions
This requirement connects directly to the multi-tenant and access model and must be enforced
at implementation level, not only described in UI.

### M.9 Content lifecycle integrity

The platform must preserve the integrity of the course lifecycle.
**Required behavior**
At minimum:
● draft versions remain separate from published versions
● published learner content is not directly edited in place
● review states are preserved
● revisions create the correct next editable path
● preview reads from the right draft context
● learner runtime reads from the right published context
**Product expectation**
A learner should never accidentally consume creator draft content.
A creator should never accidentally mutate the live learner version without going through the
intended lifecycle path.
This is essential for trustworthy release behavior and later monitoring accuracy.

### M.10 Data integrity

The system must preserve structured and trustworthy data across the workflow.
**Required behavior**


At minimum:
● course metadata remains linked to the correct course
● diagnosis, mapping, and storyboard records remain tied to the right course version
● lesson blocks remain ordered and associated correctly
● final test results remain tied to the right learner and course version
● completion and certificate outcomes remain tied to valid course results
● monitoring events remain linked to the correct course and version context
The full-stack team should avoid loose implementations where major records are stored in ways
that are difficult to validate, query, or reuse later.

### M.11 Auditability and traceability

Phase 1 does not need a heavy enterprise audit product, but it does require enough traceability
for trustworthy platform operation.
**Required traceability expectations**
At minimum, the system should preserve traceable records for:
● who created or updated a course draft
● when a course was submitted for review
● when a course was approved or published
● what version the learner used
● who completed the course
● who earned a certificate
● key creator workflow transitions
● important AI authoring actions where relevant
This matters because DEC’s broader documentation emphasizes evidence-based
implementation, truthful status, and controlled release behavior. The product should reflect that
same discipline.

### M.12 Maintainability

The platform must be maintainable by the development team and ready for iteration after Phase
1.
**Required maintainability expectations**
The implementation should support:


● clear separation of workspaces
● reusable UI components
● reusable block-rendering logic
● reusable workflow patterns
● typed data models
● understandable route structure
● environment-separated configuration
● reasonable testing and debugging paths
**Product expectation**
The team should avoid:
● deeply duplicated workspace logic
● tightly coupled lesson rendering that cannot evolve
● hard-coded workflow transitions scattered across many components
● AI features implemented as brittle page-specific hacks
The platform should be ready for course and product iteration without major architectural
rework.

### M.13 Consistency

Consistency is a system-wide non-functional requirement.
**Required behavior**
The product should feel consistent in:
● navigation
● action placement
● workflow progression
● page shell structure
● terminology
● form behavior
● lesson runtime behavior
● review behavior
● monitoring display logic
This is important because the creator workflow is long and only feels manageable if each page
behaves as part of the same system. The learner platform also depends on consistency to
remain understandable.


### M.14 Simplicity in language and interface

Because the platform is intended for practical use by non-technical users, the interface
language must remain clear and simple.
**Required behavior**
The product should use:
● plain labels
● understandable field names
● practical action text
● clear status wording
The system should avoid:
● internal engineering terms in the user interface
● abstract workflow language that normal creators or learners would not understand
● unnecessarily complex error or status messages
This is especially important in creator-side forms, review states, learner completion views, and
final test/certificate messaging.

### M.15 Error handling and recovery

The platform must fail in understandable ways when something goes wrong.
**Required behavior**
At minimum:
● users should receive clear feedback when save actions fail
● blocked actions should explain why they are blocked
● missing required data should be identified clearly
● unauthorized access should redirect or stop safely
● broken preview or publishing states should not silently fail
● AI errors should return understandable fallback behavior
● learners should not lose progress due to avoidable transient failures
The system should support recovery rather than dead ends wherever practical.

### M.16 Environment and release discipline


The platform must support practical release discipline across:
● development
● staging / UAT
● production
**Required behavior**
The team should validate:
● role access
● workflow transitions
● preview and learner runtime
● completion logic
● final test logic
● certificate behavior
● monitoring summaries
before production release.
This is important because the platform includes multiple state transitions that cannot be safely
validated only in local development.

### M.17 What the team should not do

The implementation team should **not** :
● treat accessibility as only visual styling
● treat performance as only a post-build optimization concern
● rely only on client state for important platform outcomes
● expose weakly protected routes or data
● blur draft and published content behavior
● allow inconsistent role enforcement across pages
● ignore mobile and low-bandwidth realities
● build the product in a way that is difficult to extend or maintain after Phase 1
These failures would directly weaken the credibility of the delivered platform.

### M.18 Non-Functional Requirements — validated implementation reading

For implementation purposes, the **Phase 1 DEC Learning Hub non-functional requirements**
should be read as:


The platform must be secure, role-safe, mobile-first, accessible, low-clutter, reasonably
performant, version-safe, maintainable, and reliable enough to support real learner use, real
creator workflows, real course completion logic, and real platform governance in Phase 1.

## N. Acceptance Criteria / Delivery Readiness

### Phase 1 DEC Learning Hub Implementation Description

The **Acceptance Criteria / Delivery Readiness** section defines what must be true for the
Phase 1 DEC Learning Hub to be considered ready for formal review, validation, and delivery.
This section is critical because the DEC documentation explicitly rejects vague claims such as
“done,” “complete,” or “production-ready” without evidence, verified behavior, and alignment to
the approved source-of-truth stack. For implementation purposes, the full-stack team must treat
delivery readiness as a combination of **working end-to-end behavior, evidence-backed
verification, and scope-accurate completion against the Phase 1 boundary**.
The core implementation rule is:
**Phase 1 is ready only when the required learner, creator, review, admin, and monitoring
workflows work visibly and verifiably inside the actual product, with evidence that the
agreed Phase 1 scope has been met.**
This means the team must not rely on:
● hidden backend assumptions,
● partial UI scaffolds,
● route shells without complete behavior,
● or unverified claims that functionality exists.
The accepted standard is evidence-based completion with bounded scope discipline.

### N.1 Acceptance model for Phase 1

Phase 1 acceptance should be evaluated at three levels:

**1. Product scope acceptance**
The delivered system must match the agreed Phase 1 scope and must not omit core required
product surfaces.


This includes:
● learner platform
● creator portal
● review / publishing surface
● admin workspace
● shared access, workflow, and lifecycle logic

**2. Workflow acceptance**
The required end-to-end workflows must work from start to finish in the live product.
This includes:
    ● learner workflow
    ● creator workflow
    ● review / approval / publishing workflow
    ● monitoring and revision workflow
    ● admin access and role control workflow
**3. Evidence acceptance**
The team must be able to show visible, testable, reviewable proof that the product behaves as
required.
This includes:
    ● route behavior
    ● UI behavior
    ● workflow state transitions
    ● learner progress
    ● final test and completion behavior
    ● certificate outcome
    ● monitoring visibility
    ● role-safe access boundaries
These acceptance levels should be treated together. A Phase 1 release is not acceptable if the
UI exists but the workflows fail, or if workflows are claimed but not evidenced.

### N.2 Minimum delivery-ready product surfaces

For Phase 1 to be delivery-ready, the following product surfaces must exist in working form:

**1. Learner Platform**


Must be operational enough for real course use.
Minimum acceptance expectation:
● learner can sign in
● learner can access available or assigned published courses
● learner can move through modules and lessons
● learner can complete checks and final test where applicable
● learner progress is saved
● learner completion is evaluated correctly
● learner can access certificate after satisfying course completion rules

**2. Course Creator Portal**
Must be operational enough for real course production.
Minimum acceptance expectation:
    ● creator can sign in
    ● creator can create and manage a course
    ● creator can move through the full structured workflow
    ● structured inputs persist across pages
    ● storyboard feeds Build
    ● Build supports authoring with approved blocks
    ● Preview shows learner runtime draft
    ● creator can complete review and submit the course forward
**3. Review / Publishing Surface**
Must support controlled forward movement.
Minimum acceptance expectation:
    ● submitted courses are visible to authorized review/publish roles
    ● reviewer can inspect and return or approve
    ● publishing behavior is controlled
    ● learners only access the published version
**4. Admin Workspace**
Must be sufficient for real platform operation.
Minimum acceptance expectation:
    ● admin can manage users/roles within scope
    ● admin can access the required platform governance views
    ● admin controls are role-protected and functional


**5. Monitoring Layer**
Must support course-level monitoring and revision decisions.
Minimum acceptance expectation:
    ● creators can open monitoring for a course
    ● learner progress and lesson performance are visible
    ● checks/scenario signals are visible where relevant
    ● creators can identify improvement areas and initiate revision
These five surfaces together define the minimum product shape of Phase 1.

### N.3 Mandatory end-to-end acceptance journeys

The following end-to-end product journeys must be working and demonstrable for Phase 1
acceptance.
**A. Learner completion journey**
A learner can:
● sign in
● open a course
● move through lessons
● complete checks
● complete final test where required
● meet the required threshold
● reach completion
● access the certificate
This journey is one of the most important acceptance paths because it proves the full learner
runtime, progress, completion logic, and credential outcome are functioning together.
**B. Creator course production journey**
A creator can:
● sign in
● start a new course
● complete Course Setup
● complete Diagnosis
● complete Capacity Map
● complete Action Map


● complete Storyboard
● build lessons
● preview the course
● complete creator-side review
● submit the course for review
This journey proves the creator workflow is real and connected, not only page-deep.
**C. Review and publishing journey**
An authorized reviewer / publisher can:
● open a submitted course
● inspect readiness
● return it for change or approve it
● publish the course
● and make it available to learners in published state
This journey proves lifecycle control.
**D. Monitoring and revision journey**
After learner use:
● the creator can open Monitoring
● see meaningful course-level signals
● identify issues
● create a revision path
This journey proves that the product supports improvement after release.
**E. Admin control journey**
An admin can:
● access the admin workspace
● manage users/roles within scope
● and preserve operational control of the platform
The delivered system should not be accepted if any of these major journeys are missing or only
partially scaffolded.

### N.4 Functional acceptance requirements by area

Below are the main functional acceptance checks the team should satisfy.


**Learner platform acceptance**
The learner platform is acceptable when:
● learner routes are protected correctly
● only published courses are visible in learner runtime
● lessons render correctly
● progress updates correctly
● final test logic works
● completion status is correct
● certificate access is correct
● learner cannot access creator/internal workflow routes
**Creator portal acceptance**
The creator portal is acceptable when:
● the workflow steps exist and are connected
● page-to-page data handoff works
● creators can resume drafts
● storyboard data feeds Build
● Build supports approved block families
● AI authoring actions are functional and creator-controlled
● Preview matches learner runtime draft behavior
● Review correctly detects unresolved issues and supports submission
**Review / publishing acceptance**
The review/publishing layer is acceptable when:
● submitted courses are visible only to authorized roles
● return / approve / publish actions work
● status changes are preserved
● learners cannot access non-published course states
**Monitoring acceptance**
Monitoring is acceptable when:
● learner progress data is visible at course level
● lesson/check/scenario patterns are visible where supported
● monitoring reflects real course structure and usage
● creators can translate monitoring into revision action
**Admin acceptance**


The admin surface is acceptable when:
● user/role control works within scope
● role boundaries are enforced
● governance-critical platform controls are accessible to the correct role

### N.5 Workflow-state and lifecycle acceptance

Because Phase 1 depends on a governed content lifecycle, the system must pass lifecycle
acceptance checks.
At minimum, the following must be true:
● a course draft exists separately from the published learner version
● creator editing does not directly mutate live learner content
● submitted state is distinct from draft state
● review or publish state transitions are preserved
● a new revision follows the correct version path
● monitoring refers to the appropriate course version in use
The platform should not be accepted if draft, review, and published states are blurred together in
ways that break trust or lifecycle control.

### N.6 Role and access acceptance

The platform must pass role and access acceptance checks.
At minimum, the following must be demonstrably true:
● learner cannot access creator or admin workspaces
● creator cannot perform review/publish/admin actions without authorization
● reviewer/publisher only sees the workflows relevant to their permissions
● admin controls remain restricted to admin-authorized roles
● route protection works beyond UI hiding
● direct URL access does not bypass permissions
● organization/tenant-aware boundaries are respected
This is a core readiness requirement because the system includes multiple protected
workspaces and sensitive internal materials.


### N.7 AI authoring acceptance

Because AI-assisted authoring is part of Phase 1, it must also meet delivery readiness
requirements.
The AI authoring layer is acceptable when:
● AI actions are available in the approved workflow surfaces
● AI uses the structured course and lesson context
● AI can draft usable lesson or block content from storyboard context
● source-aware AI behavior works where approved materials exist
● creators can accept, edit, reject, or regenerate outputs
● AI does not bypass creator control
● AI output stays inside the approved block-based authoring model
The system should not be accepted if AI exists only as a vague prompt surface with no
structured integration into the creator workflow.

### N.8 Certificate and completion acceptance

The completion and certificate flow must also pass acceptance checks.
At minimum, the following must be demonstrably true:
● course completion rules are enforced correctly
● final test threshold logic works where required
● learner completion status reflects actual course rules
● certificate is only available after valid completion
● certificate outcome is preserved in learner records
The system should not be accepted if certificate behavior is loosely attached or decoupled from
actual course completion logic.

### N.9 Accessibility, mobile, and usability acceptance

The system must satisfy the non-functional baselines already defined earlier, but readiness also
requires visible evidence that those standards are being respected in the working product.
At minimum, delivery readiness should include validation that:
● learner runtime is usable on mobile
● creator workflow is understandable for non-technical users


● navigation is consistent
● key accessibility requirements are respected
● overly dense or broken interfaces are not present in the core flows
● preview supports device-aware checking
● the platform does not assume desktop-only, high-bandwidth use
These should be checked through working product review, not only written claims.

### N.10 Evidence required for delivery readiness

A Phase 1 delivery claim must be supported by evidence. The DEC execution and run-report
standards require evidence-based reporting and forbid vague optimistic status language without
file, route, test, or behavior proof.
For delivery readiness, the team should be able to provide evidence such as:

**1. Route and workspace proof**
    ● learner routes working
    ● creator routes working
    ● review routes working
    ● admin routes working
    ● unauthorized access blocked
**2. Workflow proof**
    ● creator can move from setup to submission
    ● learner can move from course start to completion
    ● reviewer can approve/publish
    ● creator can open Monitoring and start revision
**3. UI proof**
    ● screenshots or walkthrough proof of the core product surfaces
    ● preview/runtime parity proof
    ● certificate-access proof
    ● role-specific interface proof
**4. State/lifecycle proof**
    ● draft vs published separation
    ● submission and review states
    ● revision path behavior


**5. Data/progress proof**
    ● learner progress saved
    ● final test results stored
    ● certificate outcome stored
    ● monitoring summaries populated from real use
**6. Test/check proof**
    ● end-to-end tests where available
    ● manual walkthrough validation where needed
    ● evidence of key route and workflow checks
The exact evidence package format can vary, but the delivery standard must remain
evidence-based.

### N.11 Acceptance status discipline

The DEC run-report and phase-gate materials are clear that the team should use truthful
implementation status language and avoid loose claims. The acceptance model already
distinguishes between:
● Not Started
● Scaffolded
● Implemented
● Verified
● Accepted
For a Phase 1 delivery handoff, the team should not describe the platform as fully ready unless
the core product journeys are at least **Verified** , and preferably **Accepted** through the applicable
review process.
That means:
● UI shells without behavior are not enough
● routes without functioning workflow are not enough
● partially implemented work should remain labeled partial
● missing learner/runtime parity should block stronger claims
● missing role safety should block stronger claims
This is both a reporting rule and a delivery-readiness rule.


### N.12 Delivery readiness checklist for the full-stack team

As a practical delivery gate, the team should be able to answer **yes** to all of the following before
Phase 1 is considered ready:
● Is the learner platform working end to end?
● Is the creator portal workflow working end to end?
● Is review / approval / publishing working in system?
● Is admin control sufficient for Phase 1 operation?
● Are role boundaries enforced across workspaces and routes?
● Does the course lifecycle preserve draft vs published integrity?
● Does Preview reflect the learner-facing draft runtime?
● Does Monitoring show meaningful course-level signals?
● Does the completion/final test/certificate logic work correctly?
● Is AI authoring integrated into the workflow in a structured, governed way?
● Are the core flows mobile-usable and accessible enough for Phase 1?
● Is the release supported by visible and testable evidence?
If the answer is no to any of these, the system is not yet delivery-ready.

### N.13 What the team should not do

The implementation team should **not** :
● claim delivery readiness based only on page presence
● treat scaffolded screens as accepted product behavior
● claim completion without working end-to-end flows
● blur Phase 1 with later-phase ambitions
● skip evidence collection
● ignore lifecycle, role, or certificate logic because the UI “looks done”
● treat acceptance as a documentation exercise rather than a real product-readiness
check
These behaviors would directly violate the DEC implementation and reporting standards.

### N.14 Acceptance Criteria / Delivery Readiness — validated implementation

### reading

For implementation purposes, the **Phase 1 DEC Learning Hub acceptance and delivery
readiness standard** should be read as:


The product is delivery-ready only when the required learner, creator, review, admin, lifecycle,
completion, certificate, monitoring, and AI-assisted authoring workflows are working visibly and
verifiably within the actual Phase 1 system, and when those workflows are supported by
evidence, truthful status reporting, and correct scope alignment.

# DEC Brand Colors and style

DEC Branding
Primary: #3B99D4
Secondary: #91C852
Backgrounds: #F9FAFB, #FFFFFF
Text (Primary): #111827
Styles: clean, structured, minimal, calm UI, accessible, mobile-first
Text & Contrast:
#111827 on #FFFFFF / #F9FAFB (high readability)
#FFFFFF on #3B99D4 (primary CTA contrast)
#111827 on #91C852 for readability; avoid white on green for small text
Ensuring WCAG-compliant contrast for all UI elements


# Staging Limitations & Non-Production Notice

This document outlines the operational boundaries, synthetic data usage, and non-production configurations applied to the current staging deployment of the DEC Learning Hub Course Creator Portal. It serves to keep all stakeholders aligned on real-world system readiness and prevent overclaiming of production capabilities.

---

## 1. Authentication & Mock Sign-In System

- **Development Login Bypass**: The staging environment utilizes a development-only mock sign-in system enabled via `ENABLE_DEMO_LOGIN="true"`. Testers can log in by entering a registered email address directly, without requiring a password.
- **Not Production-Ready**: This mock login bypass does not represent a production authentication system. Future production hardening requires integrating secure OAuth providers, single sign-on (SSO), or managed authentication services (such as Supabase Auth or Auth0).

---

## 2. Database Engine & Persistence Limits

- **Staging SQLite Engine**: The application is configured to run with a local SQLite database file (`prisma/dev.db`). While highly efficient for local-first development, private staging, and quick walkthroughs, SQLite is not recommended for production.
- **Production Postgres Hardening**: Production deployments must be transitioned to a robust, managed Postgres database engine (such as Supabase or AWS RDS) supporting connection pooling, point-in-time recovery, secure schema isolation, and automated multi-region replication.
- **Persistence & Backups**: In SQLite setups, database state is stored in a single file on the local disk. This file must be backed up securely or placed on a persistent volume; otherwise, server redeployments or container restarts may reset testing progress.

---

## 3. Synthetic Demo Data

- **Mock Profiles & Courses**: All course profiles, capacity indicators, geo-focus records, learner profiles, test attempts, and certificate logs seeded in the staging environment are synthetic and used strictly for demonstration purposes.
- **Privacy Assurance**: No real CSO practitioner data, identifying learner information, or real-world feedback logs are loaded into the database, preserving absolute data privacy during UAT.

---

## 4. Academic Certificates vs. Organizational Transformation

- **Course Completion Proof**: Certificates issued by the platform prove strictly that a learner has completed all course lessons and successfully passed the governed final test with a **score of 80% or higher**.
- **No Performance Overclaims**: Certificates do not prove, signify, or verify full organizational transformation, field-level performance improvements, or operational changes inside local CSOs. 
- **Practical Proof Separation**: True field capability is measured through the **Practical Proof** pathway, which remains completely optional, separate from academic certificates, and private by default (`visibilityDefault: "PRIVATE"`).

---

## 5. Role of Artificial Intelligence (AI)

- **AI as a Creator Aid Only**: The platform integrates AI-assisted block drafting tools to help Course Creators build curriculum content faster.
- **No Governance Autonomy**: AI tools operate purely as draft assistants. **AI does not have the authority to**:
  - Approve course versions.
  - Publish courses to the catalog.
  - Verify learner practical proofs.
  - Issue academic certificates.
  - Award verified achievement badges.
- **Strict Human Oversight**: Every piece of AI-drafted content, and all critical progression/publishing steps, require explicit human review, authorization, and audit logs.

---

## 6. Donor-Facing Visibility

- **Staging Default Private**: All learner progress metrics and practical proof submissions are defaulted to `PRIVATE` and are masked in public-facing dashboards.
- **No Default Donor Access**: Public or donor-facing visibility of achievement evidence is disabled by default to protect practitioner and citizen safety.

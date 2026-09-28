# CAPACITY CONNECT — SIH 2026 Prototype

**Problem Statement:** SIH26075 — Digital Capacity Building and Learning Management Portal  
**Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
**Core proposition:** move beyond course completion to **evidence-backed operational capability**.

## Technology

- React 18 + TypeScript + Vite
- Recharts analytics + Lucide icon system
- Responsive enterprise/government-style custom CSS
- localStorage mock database for a fully interactive no-backend SIH demo
- PostgreSQL-ready production data model in `database/schema.sql`
- REST migration contract in `docs/API_CONTRACT.md`
- PWA-ready manifest

## Run

```bash
npm install
npm run dev
```

For production validation:

```bash
npm run build
npm run preview
```

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@capacityconnect.in` | `Demo@123` |
| Trainer | `trainer@capacityconnect.in` | `Demo@123` |
| Trainee | `trainee@capacityconnect.in` | `Demo@123` |

New Trainer/Trainee registrations remain **Pending Approval** until reviewed by Admin.

## Open SIH Judge Mode first

Visit:

```text
/judge-demo
```

Judge Mode contains a six-screen guided presentation path and can open each screen with the correct demo role automatically.

## What makes this prototype different

### 1. Operational Readiness Index (ORI)

A learner is not marked ready because a course reached 100%. ORI transparently combines five signals:

- role-based competency baseline — 30%
- learning completion — 15%
- post-training assessment — 25%
- trainer-verified operational evidence — 15%
- operational scenario performance — 15%

Admin receives a **Readiness Command Center** with personnel-level scores and department × competency heatmaps.

### 2. Evidence-backed competency verification

Before final verification, a trainee can submit:

- Operational Task
- Simulation
- Case Report
- Dataset Review

The assigned **Admin-Verified Trainer** reviews the evidence, records a score and reviewer note, and can request revision. Final competency verification requires:

```text
Lessons complete
        +
Post-test passed
        +
Operational evidence verified
        ↓
Competency verified
        ↓
Certificate + Capability Passport
```

### 3. Operational Scenario Lab

Scenario-based decision exercises test whether trainees can apply knowledge in realistic conditions. Demo scenarios include severe-weather nowcasting and climate-data quality control.

### 4. Explainable trainer/course matching

The matching engine exposes its weighted score instead of showing an unexplained AI percentage:

- competency alignment
- learning-level fit
- trainer expertise
- Admin verification trust
- trainer quality rating
- availability
- active trainer load

This makes the recommendation **auditable and defensible**.

### 5. Verified Capability Passport

The trainee receives a printable capability record containing:

- Operational Readiness Index
- verified competencies
- evidence ledger
- operational scenario results
- certificates
- credential validity / recertification date
- QR verification placeholder

### 6. Knowledge Continuity Vault

Trainers preserve tacit expert knowledge as:

- Expert Debriefs
- Playbooks
- Case Archives
- Recorded Walkthroughs

Each asset is tagged with **criticality** and **successor risk**, helping the organization preserve difficult-to-replace expertise.

### 7. Low-Bandwidth / Field Mode

The authenticated portal includes a Field Mode toggle that reduces heavy visual presentation and animation for low-bandwidth environments while retaining the core workflow.

## Complete end-to-end workflow

1. Trainer or Trainee registers.
2. Admin reviews and approves the account.
3. Trainer completes professional profile and expertise evidence.
4. Admin verifies Trainer.
5. Trainer proposes course and learning content.
6. Admin reviews and publishes course.
7. Trainee completes professional profile.
8. Trainee takes role-based competency check.
9. System identifies competency gaps.
10. Explainable engine ranks course + verified trainer combinations.
11. Trainee requests enrollment.
12. Admin approves enrollment where required.
13. Trainee completes lessons and resources.
14. Pre/post assessment measures knowledge improvement.
15. Trainee completes job-relevant Operational Scenario Lab.
16. Trainee submits operational evidence.
17. Verified Trainer reviews and signs off evidence.
18. Trainer verifies final competency.
19. System issues time-bounded certificate.
20. Capability Passport and organization readiness analytics update.
21. Expert learning is captured in the Knowledge Continuity Vault for future batches.

## Recommended 5-minute SIH demonstration

1. Open **Judge Demo Mode**.
2. Show **Trainee → Competency Check**: training starts from a measured gap.
3. Show **Recommendations**: expand the transparent matching breakdown.
4. Show **Scenario Lab**: demonstrate applied decision-making.
5. Switch to **Trainer → Evidence Review**: verify operational proof.
6. Switch to **Admin → Readiness Command**: show ORI and heatmap.
7. End at **Trainee → Capability Passport**.

### One-line pitch

> **CAPACITY CONNECT does not ask only “Who completed training?” It answers “Who is demonstrably ready to perform the competency, what evidence proves it, and where does the organization still have capability risk?”**

## Reset prototype

Use **Reset demo data** from the Admin Dashboard or clear browser localStorage keys beginning with `capacityConnect`.

## IMD FINAL REBUILD — Added in V3

This edition converts the prototype into an IMD-focused operational capacity-building portal.

### Identity & access
- Admin can create **Admin, Trainer or Trainee** accounts directly.
- Official email, IMD division, designation, employee/staff ID and temporary password are captured.
- Self-registration remains approval-based.
- Admin can activate/deactivate accounts and change portal roles.

### Governed learning-media workflow
Trainer Library is now a working media-ingestion studio supporting:
- Recorded lecture / video
- Image (radar, satellite, chart or training visual)
- PDF
- Presentation
- Document
- Audio briefing
- Notes
- Dataset
- External link

Every resource can be mapped to:
**Subject → Competency → Level → Course → Module → Lesson**

Metadata includes description, tags, language, visibility and download permission. Uploaded prototype files are previewed locally and stored as data URLs in localStorage (5 MB prototype limit). A production deployment should upload large video/media directly to S3/MinIO/object storage and persist only signed object URLs in PostgreSQL.

### Admin media governance
`/admin/media` gives Admin a repository-wide review queue with publish/reject/delete actions and mapping visibility. Trainee course pages expose only published resources mapped to their approved course.

### IMD visual identity
The interface uses a meteorological operations visual system: deep forecast blue, sky/cyan, white and readiness green, subtle radar-ring visual language, and IMD-specific divisions/content while remaining an enterprise/government portal rather than a weather website.


## V4 — IMD Meteorological Operations Theme

The interface is intentionally designed as an India Meteorological Department operational capacity portal rather than a generic LMS. The visual system uses atmospheric blue/cyan, radar-ring motifs, operational status indicators, and visible IMD domains: Weather Forecasting, Doppler Weather Radar, Satellite Meteorology, Monsoon/Hydrometeorology, Warnings, Climate and Observations. Functional capacity-building workflows remain primary; meteorological identity is applied to navigation, dashboards, competency context and training data.

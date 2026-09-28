# CAPACITY CONNECT — System Feature Matrix

| Functional Requirement | Production Portal Location | Enterprise Value / Capability |
|---|---|---|
| **Role-Protected Authentication** | `/login`, `/register` | Admin-approved registrations, role guards, persistent secure sessions |
| **Dedicated Role Workspaces** | `/admin`, `/trainer`, `/trainee` | Purpose-built dashboards tailored to each stakeholder's responsibilities |
| **User & Access Governance** | `/admin/users` | Comprehensive search, filtering, role assignments, activation/deactivation |
| **Trainer Credentialing & Verification** | `/trainer/profile`, `/admin/trainers` | Multi-point administrative verification and credentials review |
| **Centralized Media & Resource Library** | `/trainer/library`, `/admin/media` | Structured media ingestion (Video, PDF, Satellite imagery, Datasets, Audio) |
| **Curriculum & Lesson Management** | `/trainer/courses`, `/admin/courses` | Module structure, lesson hierarchy, metadata, publishing workflow |
| **Formative & Summative Assessments** | `/trainer/assessments`, `/trainee/assessments` | Pre-test, post-test, and competency evaluations with automated scoring |
| **Trainee Performance Monitoring** | `/trainer/trainees` | Real-time tracking of completions, quiz scores, and verification stages |
| **Trainee Professional Profiling** | `/trainee/profile` | Baseline qualifications, department, designation, and target competencies |
| **Course Enrollment Workflows** | `/trainee/recommendations` | Self-enrollment with optional administrative authorization rules |
| **Interactive Learning Workspace** | `/trainee/learning/:courseId` | Video streaming, notes, discussion threads, and evidence submission |
| **Course Evaluation & Feedback** | Course Learning page | 5-star metric ratings and qualitative learner feedback collection |
| **Evidence-Gated Certification** | `/trainee/certificates` | Cryptographically unique certificate issuance with validity periods |
| **Administrative Communications** | `/admin/content`, Portal Header | Broadcast announcements, target audience filtering, alerts |
| **Readiness & Analytics Dashboards** | All role dashboards | Real-time charts, completion trends, and key performance indicators |
| **Competency Gap Diagnostic** | `/admin/competencies`, `/trainee/competency` | Required-vs-actual competency gap analysis with radar visualizers |
| **Explainable Matching Engine** | `/trainee/recommendations` | Multi-factor weighted match showing exact scoring rationale |
| **Responsive & Low-Bandwidth Mode** | Universal across portal | Adaptive interface with Field Mode toggle for low-bandwidth stations |
| **Knowledge Continuity Vault** | `/admin/knowledge`, `/trainer/knowledge` | Archive critical tacit knowledge with successor-risk indexing |
| **Operational Scenario Lab** | `/trainee/scenarios` | Simulation-based situational decision-making exercises |
| **Readiness Command Center** | `/admin/readiness` | Organization-wide Operational Readiness Index & competency heatmaps |
| **Verified Capability Passport** | `/trainee/passport` | Comprehensive, print-ready evidence ledger and capability credentials |

# SIH26075 Feature Coverage Matrix

| Problem-statement need | Working prototype location | Differentiation added |
|---|---|---|
| Secure signup/login | `/login`, `/register` | Pending approvals + role-protected routes + persistent session |
| Trainee / Trainer / Admin roles | Entire portal | Dedicated task-focused workspaces |
| Admin user approval & role management | `/admin/users` | Search, filters, activation/deactivation, role change |
| Trainer profile & qualification review | `/trainer/profile`, `/admin/trainers` | Admin Verified trust signal used by matching engine |
| Trainer Library | `/trainer/library` | Subject/type/level filtering |
| Recorded lectures, PDFs, presentations, notes | Trainer Library / course content | Reusable organization learning assets |
| Trainer questionnaires / MCQs | `/trainer/assessments` | Pre/post/competency assessment types + deadlines |
| Monitor trainee participation & performance | `/trainer/trainees` | Progress, post-test, evidence status, final verification |
| Trainee professional profile | `/trainee/profile` | Feeds role/competency personalization |
| Course enrollment | `/trainee/recommendations` | Request → Admin approval workflow |
| Learning resources | `/trainee/learning/:courseId` | Progress tracking + discussion + evidence submission |
| Subject-wise MCQ assessment | `/trainee/assessments` | Pre/post comparison and pass rules |
| Course feedback | Course Learning page | Working 1–5 rating + written feedback storage |
| Certificates | `/trainee/certificates` | Evidence-gated issuance + validity / recertification date |
| Notifications / announcements / achievements | `/admin/content` + homepage | Audience-aware publishing |
| Dashboards / participation statistics | Admin, Trainer, Trainee dashboards | Role-specific KPIs |
| Competency mapping | `/admin/competencies`, `/trainee/competency` | Required-vs-current gap model |
| Identify suitable trainers | `/trainee/recommendations` | Explainable weighted match with load balance |
| Responsive / accessible across devices | Entire app | Desktop/tablet/mobile + Low-Bandwidth Field Mode |
| Knowledge sharing | Trainer Library | **Knowledge Continuity Vault** with successor risk |
| Competency development | End-to-end workflow | **Operational Scenario Lab + Evidence Review** |
| Organizational decision support | `/admin/readiness` | **Operational Readiness Index + competency heatmap** |
| Verified competency record | `/trainee/passport` | **Capability Passport with evidence ledger** |

# CAPACITY CONNECT — Application Structure

## Architecture

CAPACITY CONNECT is an enterprise-grade React + TypeScript single-page application utilizing a robust service layer and local storage engine for instant offline evaluation and testing, paired with a complete PostgreSQL relational database blueprint and REST API contract ready for containerized production deployment.

### Layers

- `src/pages/public` — homepage, authentication, registration.
- `src/pages/admin` — governance, trainer verification, course approval, competency framework, analytics, Readiness Command Center, Knowledge Continuity Vault.
- `src/pages/trainer` — professional profile, course/content creation, Trainer Library, assessments, trainee monitoring, Capability Evidence Review, Expert Knowledge Capture.
- `src/pages/trainee` — profile, competency check, explainable recommendations, learning, assessments, Operational Scenario Lab, Capability Passport, certificates.
- `src/context/AppContext.tsx` — prototype service layer and all working workflow actions.
- `src/utils/engine.ts` — recommendation scoring, assessment improvement and Operational Readiness Index.
- `src/data/seed.ts` — realistic IMD/MoES demo records.
- `database/schema.sql` — PostgreSQL-ready relational schema including evidence, scenarios and knowledge continuity.

## Key routes

### Public
- `/`
- `/login`
- `/register`

### Admin
- `/admin`
- `/admin/users`
- `/admin/trainers`
- `/admin/courses`
- `/admin/competencies`
- `/admin/reports`
- `/admin/readiness`
- `/admin/knowledge`
- `/admin/content`

### Trainer
- `/trainer`
- `/trainer/profile`
- `/trainer/courses`
- `/trainer/library`
- `/trainer/assessments`
- `/trainer/trainees`
- `/trainer/evidence`
- `/trainer/knowledge`

### Trainee
- `/trainee`
- `/trainee/profile`
- `/trainee/competency`
- `/trainee/recommendations`
- `/trainee/learning`
- `/trainee/learning/:courseId`
- `/trainee/assessments`
- `/trainee/scenarios`
- `/trainee/passport`
- `/trainee/certificates`

## Capability verification gates

Final competency verification requires:

1. approved enrollment
2. 100% required lesson completion
3. passed post-training assessment
4. trainer-verified operational evidence
5. verified trainer identity

Operational Scenario performance is tracked separately and contributes to the Operational Readiness Index.

# CAPACITY CONNECT — Application Structure

## Prototype architecture

The SIH demo is a React + TypeScript single-page application using a localStorage-backed mock database. It runs without a backend during judging, while the data model and actions are structured for later Node.js + PostgreSQL migration.

### Layers

- `src/pages/public` — homepage, authentication, SIH Judge Demo Mode.
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
- `/judge-demo`

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

# Node.js REST API migration contract

The localStorage prototype actions map directly to a future REST API.

## Authentication / users
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users?status=pending`
- `PATCH /api/users/:id/status`
- `PATCH /api/users/:id/role`

## Trainers / courses
- `GET /api/trainers`
- `PATCH /api/trainers/:id/verification`
- `POST /api/courses`
- `PATCH /api/courses/:id`
- `PATCH /api/courses/:id/status`
- `POST /api/resources`

## Enrollment / learning
- `POST /api/enrollments`
- `PATCH /api/enrollments/:id/status`
- `PATCH /api/enrollments/:id/progress`

## Competency / recommendations
- `POST /api/competency-checks`
- `GET /api/recommendations/me`
- `GET /api/readiness/me`
- `GET /api/readiness/organization`

## Assessments / scenarios
- `POST /api/assessment-attempts`
- `POST /api/course-feedback`
- `GET /api/courses/:id/feedback`
- `GET /api/scenarios`
- `POST /api/scenarios/:id/attempts`

## Evidence-backed verification
- `POST /api/capability-evidence`
- `GET /api/trainers/me/evidence-queue`
- `PATCH /api/capability-evidence/:id/review`
- `POST /api/competency-verifications`
- `GET /api/certificates/me`
- `GET /api/capability-passport/me`

## Knowledge continuity
- `POST /api/knowledge-assets`
- `GET /api/knowledge-assets`
- `GET /api/knowledge-assets?successorRisk=High`

## Communications
- `POST /api/notifications`

## Production controls

Recommended middleware and infrastructure:

- secure server sessions or short-lived JWT + refresh rotation
- RBAC authorization on every protected endpoint
- schema validation
- rate limiting
- immutable audit logs for approval and verification actions
- object-storage signed upload URLs
- malware scanning for uploaded evidence/resources
- parameterized PostgreSQL queries / ORM
- encryption in transit and at rest
- certificate verification token / QR endpoint
- versioned competency frameworks and recertification rules

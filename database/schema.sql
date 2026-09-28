-- CAPACITY CONNECT PostgreSQL-ready schema
CREATE TYPE app_role AS ENUM ('admin','trainer','trainee');
CREATE TYPE user_status AS ENUM ('pending','active','inactive','rejected');
CREATE TYPE competency_level AS ENUM ('Beginner','Intermediate','Advanced');
CREATE TYPE course_status AS ENUM ('draft','pending','published','archived');
CREATE TYPE enrollment_status AS ENUM ('requested','approved','rejected','completed');

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role app_role NOT NULL,
  status user_status NOT NULL DEFAULT 'pending',
  department TEXT,
  designation TEXT,
  employee_id TEXT,
  profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trainer_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  qualification TEXT,
  experience_years INT NOT NULL DEFAULT 0,
  competency_level competency_level,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  availability TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  bio TEXT
);

CREATE TABLE trainer_subjects (
  trainer_id UUID REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  PRIMARY KEY(trainer_id, subject)
);

CREATE TABLE trainer_skills (
  trainer_id UUID REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  PRIMARY KEY(trainer_id, skill)
);

CREATE TABLE trainer_certifications (
  id UUID PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  evidence_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trainee_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  qualification TEXT,
  experience_years INT NOT NULL DEFAULT 0,
  goals TEXT
);

CREATE TABLE trainee_interests (
  trainee_id UUID REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  PRIMARY KEY(trainee_id, interest)
);

CREATE TABLE courses (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  subject TEXT NOT NULL,
  level competency_level NOT NULL,
  trainer_id UUID REFERENCES trainer_profiles(id),
  description TEXT,
  duration_hours INT NOT NULL,
  start_date DATE,
  end_date DATE,
  enrollment_limit INT,
  status course_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE course_objectives (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE modules (
  id UUID PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 0,
  resource_url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status enrollment_status NOT NULL DEFAULT 'requested',
  progress INT NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trainee_id, course_id)
);

CREATE TABLE lesson_progress (
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(enrollment_id, lesson_id)
);

CREATE TABLE competency_requirements (
  id UUID PRIMARY KEY,
  job_role TEXT NOT NULL,
  subject TEXT NOT NULL,
  required_level competency_level NOT NULL,
  UNIQUE(job_role, subject)
);

CREATE TABLE competency_requirement_items (
  requirement_id UUID REFERENCES competency_requirements(id) ON DELETE CASCADE,
  competency TEXT NOT NULL,
  PRIMARY KEY(requirement_id, competency)
);

CREATE TABLE competency_results (
  id UUID PRIMARY KEY,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  job_role TEXT NOT NULL,
  subject TEXT NOT NULL,
  current_level competency_level NOT NULL,
  required_level competency_level NOT NULL,
  score INT NOT NULL CHECK(score BETWEEN 0 AND 100),
  gap_text TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE competency_missing_items (
  result_id UUID REFERENCES competency_results(id) ON DELETE CASCADE,
  competency TEXT NOT NULL,
  PRIMARY KEY(result_id, competency)
);

CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK(assessment_type IN ('pre','post','competency')),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  passing_percentage INT NOT NULL CHECK(passing_percentage BETWEEN 0 AND 100),
  duration_minutes INT NOT NULL
);

CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INT NOT NULL,
  competency TEXT
);

CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK(score BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resources (
  id UUID PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES trainer_profiles(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  level competency_level NOT NULL,
  object_url TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  module_id TEXT,
  lesson_id TEXT,
  competency TEXT,
  description TEXT,
  tags TEXT[],
  language TEXT DEFAULT 'English',
  visibility TEXT DEFAULT 'Enrolled Trainees',
  downloadable BOOLEAN DEFAULT TRUE,
  file_name TEXT,
  mime_type TEXT,
  file_size BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  trainer_id UUID NOT NULL REFERENCES trainer_profiles(id),
  competency TEXT NOT NULL,
  certificate_code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  qr_verification_token TEXT UNIQUE
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  audience TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_status_role ON users(status, role);
CREATE INDEX idx_courses_status_subject ON courses(status, subject);
CREATE INDEX idx_enrollments_trainee ON enrollments(trainee_id);
CREATE INDEX idx_attempts_trainee_assessment ON assessment_attempts(trainee_id, assessment_id);
CREATE INDEX idx_competency_results_trainee_subject ON competency_results(trainee_id, subject);

-- SIH differentiation layer: evidence-backed capability, operational scenarios and knowledge continuity
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS valid_until DATE;

CREATE TYPE evidence_status AS ENUM ('submitted','verified','revision');
CREATE TYPE knowledge_criticality AS ENUM ('Standard','Important','Mission Critical');
CREATE TYPE succession_risk AS ENUM ('Low','Medium','High');

CREATE TABLE capability_evidence (
  id UUID PRIMARY KEY,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  evidence_type TEXT NOT NULL CHECK(evidence_type IN ('Case Report','Simulation','Operational Task','Dataset Review')),
  status evidence_status NOT NULL DEFAULT 'submitted',
  reviewer_id UUID REFERENCES trainer_profiles(id),
  score INT CHECK(score BETWEEN 0 AND 100),
  reviewer_note TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE operational_scenarios (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  target_role TEXT NOT NULL,
  context TEXT NOT NULL,
  difficulty competency_level NOT NULL,
  passing_percentage INT NOT NULL CHECK(passing_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE operational_scenario_steps (
  id UUID PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES operational_scenarios(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INT NOT NULL,
  competency TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE operational_scenario_attempts (
  id UUID PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES operational_scenarios(id) ON DELETE CASCADE,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK(score BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL,
  readiness_band TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE knowledge_assets (
  id UUID PRIMARY KEY,
  trainer_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK(asset_type IN ('Expert Debrief','Playbook','Case Archive','Recorded Walkthrough')),
  criticality knowledge_criticality NOT NULL,
  successor_risk succession_risk NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','published')),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_trainee_course ON capability_evidence(trainee_id, course_id);
CREATE INDEX idx_evidence_status ON capability_evidence(status);
CREATE INDEX idx_scenario_attempt_trainee ON operational_scenario_attempts(trainee_id, scenario_id);
CREATE INDEX idx_knowledge_subject_risk ON knowledge_assets(subject, successor_risk);

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;

CREATE TABLE course_feedback (
  id UUID PRIMARY KEY,
  trainee_id UUID NOT NULL REFERENCES trainee_profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trainee_id, course_id)
);
CREATE INDEX idx_feedback_course ON course_feedback(course_id, rating);

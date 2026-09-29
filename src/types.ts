export type Role = "admin" | "trainer" | "trainee";
export type UserStatus = "pending" | "active" | "inactive" | "rejected";
export type Level = "Beginner" | "Intermediate" | "Advanced";

export type CompetencyLevel = "L1" | "L2" | "L3" | "L4" | "L5";

export interface LevelDefinition {
  level: CompetencyLevel;
  code: string;
  name: string;
  fullName: string;
  rank: number;
}

export interface CompetencyItem {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  department: string;
  designation: string;
  jobRole?: string;
  createdAt: string;
  profileComplete: boolean;
  employeeId?: string;
}

export interface Trainer {
  id: string;
  userId: string;
  name: string;
  department: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  skills: string[];
  level: Level;
  rating: number;
  availability: "Available" | "Limited" | "Unavailable";
  verified: boolean;
  certifications: string[];
  bio: string;
}

export interface TraineeCompetency {
  name: string;
  currentLevel: CompetencyLevel;
  targetLevel: CompetencyLevel;
  lastAssessmentScore?: number;
  updatedAt?: string;
}

export interface RoleCompetencyRequirement {
  competency: string;
  requiredLevel: CompetencyLevel;
}

export interface RoleCompetencyGapItem {
  competency: string;
  currentLevel: CompetencyLevel;
  requiredLevel: CompetencyLevel;
  currentRank: number;
  requiredRank: number;
  gap: number;
  status: "Met" | "Gap";
  recommendedCourse: Course | null;
  reasonMessage?: string;
}

export interface LevelRecommendation {
  competency: string;
  currentLevel: CompetencyLevel;
  targetLevel: CompetencyLevel;
  gap: number;
  status: "recommended" | "target-achieved" | "no-course-found" | "Met" | "Gap";
  recommendedCourse?: Course;
  message?: string;
}

export interface CourseAccessCheck {
  canEnroll: boolean;
  status: "available" | "locked";
  message: string;
  recommendedCourse: Course | null;
}

export interface Trainee {
  id: string;
  userId: string;
  name: string;
  role?: string;
  jobRole?: string;
  centre?: string;
  department: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  interests: string[];
  skills: Record<string, Level>;
  competencies?: TraineeCompetency[];
  goals: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  competency?: string;
  entryLevel?: CompetencyLevel;
  targetLevel?: CompetencyLevel;
  prerequisiteCourseId?: string | null;
  duration?: string;
  department: string;
  subject: string;
  level: Level;
  trainerId: string;
  description: string;
  objectives: string[];
  durationHours: number;
  startDate: string;
  endDate: string;
  enrollmentLimit: number;
  status: "draft" | "pending" | "published" | "archived";
  modules: Module[];
  rating: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "pdf" | "presentation" | "note";
  durationMin: number;
  resource: string;
}

export interface Enrollment {
  id: string;
  traineeId: string;
  courseId: string;
  status: "requested" | "approved" | "rejected" | "completed";
  progress: number;
  completedLessonIds: string[];
  requestedAt: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  type: "pre" | "post" | "competency";
  title: string;
  subject: string;
  passingPercentage: number;
  durationMin: number;
  deadline?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  competency: string;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  traineeId: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  /** Phase 6: Level-up result info, only present when a level-course assessment is submitted */
  levelUpInfo?: {
    levelled: boolean;
    previousLevel: CompetencyLevel;
    newLevel: CompetencyLevel;
    competency: string;
    courseTitle: string;
    lessonsIncomplete: boolean;
    roleRequirementMet: boolean;
    roleRequiredLevel?: CompetencyLevel;
    message: string;
    certificate?: Certificate;
  };
}

export interface CompetencyRequirement {
  role: string;
  subject: string;
  requiredLevel: Level;
  competencies: string[];
}

export interface CompetencyResult {
  id: string;
  traineeId: string;
  role: string;
  subject: string;
  currentLevel: Level;
  requiredLevel: Level;
  gapText: string;
  score: number;
  missingCompetencies: string[];
  updatedAt: string;
}

export interface Certificate {
  id: string;
  traineeId: string;
  courseId: string;
  trainerId: string;
  competency: string;
  levelAchieved?: CompetencyLevel;
  issuedAt: string;
  validUntil?: string;
  certificateCode: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "announcement" | "achievement" | "course" | "resource" | "deadline";
  audience: "all" | Role;
  publishedAt: string;
}

export interface Resource {
  id: string;
  trainerId: string;
  title: string;
  subject: string;
  type: "Video" | "Image" | "PDF" | "Presentation" | "Document" | "Audio" | "Notes" | "Dataset" | "Recorded Lecture" | "External Link";
  level: Level;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  competency?: string;
  description?: string;
  tags?: string[];
  language?: string;
  visibility?: "Enrolled Trainees" | "All Approved Users";
  downloadable?: boolean;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  dataUrl?: string;
  externalUrl?: string;
  status?: "draft" | "pending" | "published" | "rejected";
  addedAt: string;
}

export type EvidenceStatus = "submitted" | "verified" | "revision";
export interface EvidenceItem {
  id: string;
  traineeId: string;
  courseId: string;
  subject: string;
  title: string;
  type: "Case Report" | "Simulation" | "Operational Task" | "Dataset Review";
  status: EvidenceStatus;
  submittedAt: string;
  reviewerId?: string;
  score?: number;
  note?: string;
}

export interface ScenarioStep {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  competency: string;
}

export interface OperationalScenario {
  id: string;
  title: string;
  subject: string;
  role: string;
  context: string;
  difficulty: Level;
  passingPercentage: number;
  steps: ScenarioStep[];
}

export interface ScenarioAttempt {
  id: string;
  traineeId: string;
  scenarioId: string;
  score: number;
  passed: boolean;
  readinessBand: "Needs Development" | "Developing" | "Operationally Ready" | "High Readiness";
  attemptedAt: string;
}

export interface KnowledgeAsset {
  id: string;
  trainerId: string;
  title: string;
  subject: string;
  type: "Expert Debrief" | "Playbook" | "Case Archive" | "Recorded Walkthrough";
  criticality: "Standard" | "Important" | "Mission Critical";
  successorRisk: "Low" | "Medium" | "High";
  summary: string;
  status: "draft" | "published";
  capturedAt: string;
}

export interface CourseFeedback {
  id: string;
  traineeId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  text: string;
  at: string;
}

export type RoleRequirementsMap = Record<string, Record<string, CompetencyLevel>>;
export type TraineeLevelsMap = Record<string, Record<string, CompetencyLevel>>;

export interface DB {
  users: User[];
  trainers: Trainer[];
  trainees: Trainee[];
  courses: Course[];
  enrollments: Enrollment[];
  assessments: Assessment[];
  attempts: AssessmentAttempt[];
  competencyRequirements: CompetencyRequirement[];
  competencyResults: CompetencyResult[];
  certificates: Certificate[];
  notifications: NotificationItem[];
  resources: Resource[];
  evidence: EvidenceItem[];
  scenarios: OperationalScenario[];
  scenarioAttempts: ScenarioAttempt[];
  knowledgeAssets: KnowledgeAsset[];
  feedback: CourseFeedback[];
  activities: Activity[];
}

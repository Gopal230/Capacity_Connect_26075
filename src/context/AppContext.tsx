import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { seedDB } from "../data/seed";
import { Assessment, AssessmentAttempt, CompetencyResult, Course, CourseAccessCheck, CourseFeedback, DB, EvidenceItem, EvidenceStatus, KnowledgeAsset, LevelRecommendation, NotificationItem, Resource, Role, ScenarioAttempt, Trainer, Trainee, User } from "../types";
import { checkCourseAccess, gapText, getLevelBasedRecommendations, levelFromScore, recommend, updateLevelAfterAssessment } from "../utils/engine";

const DB_KEY = "capacityConnectDB_v6";
const SESSION_KEY = "capacityConnectSession_v1";

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };

interface AppContextType {
  db: DB;
  currentUser: User | null;
  toast: Toast | null;
  login: (email: string, password: string) => { ok: boolean; message: string; role?: Role };
  logout: () => void;
  register: (input: { name: string; email: string; password: string; role: "trainer"|"trainee"; department: string; designation: string }) => { ok: boolean; message: string };
  createUser: (input: { name:string; email:string; password:string; role:Role; department:string; designation:string; employeeId?:string }) => {ok:boolean;message:string};
  resetDemo: () => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
  approveUser: (id: string, approved: boolean) => void;
  toggleUserStatus: (id: string) => void;
  changeUserRole: (id: string, role: Role) => void;
  verifyTrainer: (id: string, verified: boolean) => void;
  updateTrainerProfile: (patch: Partial<Trainer>) => void;
  updateTraineeProfile: (patch: Partial<Trainee>) => void;
  createCourse: (course: Omit<Course,"id"|"status"|"rating">) => void;
  setCourseStatus: (id: string, status: Course["status"]) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  requestEnrollment: (courseId: string) => void;
  decideEnrollment: (id: string, approved: boolean) => void;
  toggleLesson: (courseId: string, lessonId: string) => void;
  submitAssessment: (assessmentId: string, answers: number[]) => AssessmentAttempt | null;
  runCompetencyCheck: (role: string, subject: string, score: number, missed: string[]) => CompetencyResult | null;
  addNotification: (item: Omit<NotificationItem,"id"|"publishedAt">) => void;
  addResource: (item: Omit<Resource,"id"|"addedAt">) => void;
  setResourceStatus: (id:string, status:NonNullable<Resource["status"]>) => void;
  deleteResource: (id:string) => void;
  addAssessment: (item: Omit<Assessment,"id">) => void;
  submitEvidence: (courseId: string, title: string, type: EvidenceItem["type"]) => void;
  reviewEvidence: (id: string, status: EvidenceStatus, score: number, note: string) => void;
  submitScenario: (scenarioId: string, answers: number[]) => ScenarioAttempt | null;
  addKnowledgeAsset: (item: Omit<KnowledgeAsset,"id"|"capturedAt">) => void;
  submitFeedback: (courseId:string, rating:number, comment:string) => void;
  verifyCompetency: (traineeId: string, courseId: string) => boolean;
  recommendationsForCurrentTrainee: () => ReturnType<typeof recommend>;
  levelRecommendationsForCurrentTrainee: () => LevelRecommendation[];
  checkCourseEligibility: (courseId: string) => CourseAccessCheck;
}

const AppContext = createContext<AppContextType | null>(null);

function cloneSeed(): DB {
  return JSON.parse(JSON.stringify(seedDB));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      return raw ? JSON.parse(raw) : cloneSeed();
    } catch { return cloneSeed(); }
  });
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => localStorage.setItem(DB_KEY, JSON.stringify(db)), [db]);
  useEffect(() => {
    if (sessionId) localStorage.setItem(SESSION_KEY, sessionId);
    else localStorage.removeItem(SESSION_KEY);
  }, [sessionId]);

  const currentUser = useMemo(() => db.users.find(u => u.id === sessionId) ?? null, [db.users, sessionId]);

  const notify = (message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => setToast(t => t?.id === id ? null : t), 3200);
  };

  const login = (email: string, password: string) => {
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: "Invalid email or password." };
    if (user.status === "pending") return { ok: false, message: "Registration is pending Admin approval." };
    if (user.status !== "active") return { ok: false, message: `Account status is ${user.status}. Contact the administrator.` };
    setSessionId(user.id);
    notify(`Welcome, ${user.name}`);
    return { ok: true, message: "Login successful", role: user.role };
  };

  const logout = () => {
    setSessionId(null);
    notify("Signed out", "info");
  };

  const register: AppContextType["register"] = input => {
    if (!input.name.trim() || !input.email.trim() || input.password.length < 6 || !input.department.trim() || !input.designation.trim()) {
      return { ok: false, message: "Complete all required fields. Password must be at least 6 characters." };
    }
    if (db.users.some(u => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const id = `u-${Date.now()}`;
    const user: User = {
      id,
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
      role: input.role,
      status: "pending",
      department: input.department.trim(),
      designation: input.designation.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      profileComplete: false
    };
    setDb(prev => ({ ...prev, users: [user, ...prev.users] }));
    return { ok: true, message: "Account created successfully. Await Administrator verification." };
  };

  const createUser: AppContextType["createUser"] = input => {
    if (!input.name.trim() || !input.email.trim() || !input.password.trim()) {
      return { ok: false, message: "Name, email and password are required." };
    }
    if (db.users.some(u => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { ok: false, message: "A user with this email already exists." };
    }
    const id = `u-${Date.now()}`;
    const user: User = {
      id,
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
      role: input.role,
      status: "active",
      department: input.department.trim() || "Headquarters",
      designation: input.designation.trim() || "Staff",
      createdAt: new Date().toISOString().slice(0, 10),
      profileComplete: true,
      employeeId: input.employeeId?.trim()
    };
    setDb(prev => {
      let trainers = prev.trainers;
      let trainees = prev.trainees;
      if (input.role === "trainer") {
        trainers = [{
          id: `tr-${Date.now()}`,
          userId: id,
          name: user.name,
          department: user.department,
          qualification: "Postgraduate Degree",
          experienceYears: 5,
          subjects: ["General Meteorology"],
          skills: ["Training Facilitation"],
          level: "Intermediate",
          rating: 4.5,
          availability: "Available",
          verified: false,
          certifications: [],
          bio: "Newly onboarded trainer awaiting profile completion."
        }, ...trainers];
      }
      if (input.role === "trainee") {
        trainees = [{
          id: `ta-${Date.now()}`,
          userId: id,
          name: user.name,
          role: "Weather Forecaster",
          centre: "Bhopal",
          department: user.department,
          designation: user.designation,
          qualification: "Graduate Degree",
          experienceYears: 1,
          interests: ["Meteorology", "Forecasting"],
          skills: { "Radar Interpretation": "Beginner", "Synoptic Forecasting": "Beginner" },
          competencies: [
            { name: "Radar Interpretation", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 0 },
            { name: "Synoptic Forecasting", currentLevel: "L1", targetLevel: "L3", lastAssessmentScore: 0 }
          ],
          goals: "Develop foundational operational competency."
        }, ...trainees];
      }
      return { ...prev, users: [user, ...prev.users], trainers, trainees };
    });
    notify(`Created user ${user.name}`);
    return { ok: true, message: "User account created." };
  };

  const approveUser = (id: string, approved: boolean) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, status: approved ? "active" : "rejected" } : u)
    }));
    notify(approved ? "User approved" : "User rejected", approved ? "success" : "info");
  };

  const toggleUserStatus = (id: string) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)
    }));
    notify("User status updated");
  };

  const changeUserRole = (id: string, role: Role) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, role } : u)
    }));
    notify(`Role changed to ${role}`);
  };

  const verifyTrainer = (id: string, verified: boolean) => {
    setDb(prev => ({
      ...prev,
      trainers: prev.trainers.map(t => t.id === id ? { ...t, verified } : t)
    }));
    notify(verified ? "Trainer verified" : "Trainer verification revoked");
  };

  const updateTrainerProfile = (patch: Partial<Trainer>) => {
    if (!currentUser) return;
    setDb(prev => ({
      ...prev,
      trainers: prev.trainers.map(t => t.userId === currentUser.id ? { ...t, ...patch } : t)
    }));
    notify("Trainer profile saved");
  };

  const updateTraineeProfile = (patch: Partial<Trainee>) => {
    if (!currentUser) return;
    setDb(prev => ({
      ...prev,
      trainees: prev.trainees.map(t => t.userId === currentUser.id ? { ...t, ...patch } : t)
    }));
    notify("Trainee profile saved");
  };

  const createCourse = (input: Omit<Course, "id"|"status"|"rating">) => {
    const course: Course = {
      ...input,
      id: `c-${Date.now()}`,
      status: "pending",
      rating: 0
    };
    setDb(prev => ({ ...prev, courses: [course, ...prev.courses] }));
    notify("Course submitted for admin review");
  };

  const setCourseStatus = (id: string, status: Course["status"]) => {
    setDb(prev => ({ ...prev, courses: prev.courses.map(c => c.id === id ? { ...c, status } : c) }));
    notify(`Course status changed to ${status}`);
  };

  const updateCourse = (id: string, patch: Partial<Course>) => {
    setDb(prev => ({ ...prev, courses: prev.courses.map(c => c.id === id ? { ...c, ...patch } : c) }));
    notify("Course updated");
  };

  const currentTraineeId = () => currentUser ? db.trainees.find(t => t.userId === currentUser.id)?.id : undefined;

  const currentTrainee = () => currentUser ? db.trainees.find(t => t.userId === currentUser.id) : undefined;

  const checkCourseEligibility = (courseId: string): CourseAccessCheck => {
    const trainee = currentTrainee();
    const course = db.courses.find(c => c.id === courseId);
    if (!course) {
      return { canEnroll: false, status: "locked", message: "Course not found", recommendedCourse: null };
    }
    if (!trainee) {
      return { canEnroll: true, status: "available", message: "Open for enrollment", recommendedCourse: null };
    }
    const compName = course.competency || course.subject;
    const comp = trainee.competencies?.find(c => c.name === compName || c.name === course.subject);
    return checkCourseAccess(comp, course, db.courses);
  };

  const levelRecommendationsForCurrentTrainee = (): LevelRecommendation[] => {
    const trainee = currentTrainee();
    if (!trainee) return [];
    return getLevelBasedRecommendations(trainee, db.courses);
  };

  const requestEnrollment = (courseId: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return notify("Trainee profile not found", "error");

    // Enforce Level prerequisite check
    const check = checkCourseEligibility(courseId);
    if (!check.canEnroll) {
      notify(check.message, "error");
      return;
    }

    if (db.enrollments.some(e => e.traineeId === traineeId && e.courseId === courseId && e.status !== "rejected")) {
      return notify("Enrollment already exists", "info");
    }
    setDb(prev => ({
      ...prev,
      enrollments: [{
        id: `e-${Date.now()}`,
        traineeId,
        courseId,
        status: "approved",
        progress: 0,
        completedLessonIds: [],
        requestedAt: new Date().toISOString().slice(0, 10)
      }, ...prev.enrollments]
    }));
    notify("Enrolled successfully! Course is ready in My Learning.");
  };

  const decideEnrollment = (id: string, approved: boolean) => {
    setDb(prev => ({
      ...prev,
      enrollments: prev.enrollments.map(e => e.id === id ? { ...e, status: approved ? "approved" : "rejected" } : e)
    }));
    notify(approved ? "Enrollment approved" : "Enrollment rejected", approved ? "success" : "info");
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return;
    setDb(prev => {
      const course = prev.courses.find(c => c.id === courseId);
      const total = course?.modules.flatMap(m => m.lessons).length || 1;
      return {
        ...prev,
        enrollments: prev.enrollments.map(e => {
          if (e.traineeId !== traineeId || e.courseId !== courseId || !["approved", "completed"].includes(e.status)) return e;
          const has = e.completedLessonIds.includes(lessonId);
          const completed = has ? e.completedLessonIds.filter(x => x !== lessonId) : [...e.completedLessonIds, lessonId];
          const progress = Math.round((completed.length / total) * 100);
          return {
            ...e,
            completedLessonIds: completed,
            progress,
            status: progress === 100 ? "completed" : e.status === "completed" ? "approved" : e.status
          };
        })
      };
    });
    notify("Lesson progress updated");
  };

  const submitAssessment = (assessmentId: string, answers: number[]) => {
    const traineeId = currentTraineeId();
    const assessment = db.assessments.find(a => a.id === assessmentId);
    if (!traineeId || !assessment) return null;
    const correct = assessment.questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
    const score = Math.round((correct / assessment.questions.length) * 100);
    const passed = score >= assessment.passingPercentage;
    const attempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      assessmentId,
      traineeId,
      score,
      passed,
      attemptedAt: new Date().toISOString().slice(0, 10)
    };

    const course = db.courses.find(c => c.id === assessment.courseId);
    let levelNotice: string | null = null;

    setDb(prev => {
      let updatedTrainees = prev.trainees;
      if (passed && course) {
        const compName = course.competency || course.subject;
        updatedTrainees = prev.trainees.map(t => {
          if (t.id !== traineeId) return t;
          const currentComps = t.competencies ? [...t.competencies] : [];
          const compIdx = currentComps.findIndex(c => c.name === compName || c.name === course.subject);
          if (compIdx !== -1) {
            const comp = { ...currentComps[compIdx] };
            const res = updateLevelAfterAssessment(comp, course, score);
            if (res.updated) {
              levelNotice = res.message;
              currentComps[compIdx] = comp;
            }
          }
          return { ...t, competencies: currentComps };
        });
      }

      return {
        ...prev,
        attempts: [attempt, ...prev.attempts],
        trainees: updatedTrainees
      };
    });

    if (levelNotice) {
      notify(levelNotice, "success");
    } else {
      notify(`Assessment submitted: ${score}%`, attempt.passed ? "success" : "info");
    }
    return attempt;
  };

  const runCompetencyCheck = (role: string, subject: string, score: number, missed: string[]) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return null;
    const req = db.competencyRequirements.find(r => r.role === role && r.subject === subject) || db.competencyRequirements.find(r => r.subject === subject);
    const currentLevel = levelFromScore(score);
    const requiredLevel = req?.requiredLevel ?? "Advanced";
    const result: CompetencyResult = {
      id: `cr-${Date.now()}`,
      traineeId,
      role,
      subject,
      currentLevel,
      requiredLevel,
      gapText: gapText(currentLevel, requiredLevel),
      score,
      missingCompetencies: missed,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setDb(prev => ({
      ...prev,
      competencyResults: [result, ...prev.competencyResults.filter(r => !(r.traineeId === traineeId && r.subject === subject))]
    }));
    notify("Competency gap analysis completed");
    return result;
  };

  const addNotification = (item: Omit<NotificationItem, "id"|"publishedAt">) => {
    const n: NotificationItem = { ...item, id: `n-${Date.now()}`, publishedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
    notify("Content published");
  };

  const addResource = (item: Omit<Resource, "id"|"addedAt">) => {
    const resource: Resource = { ...item, id: `r-${Date.now()}`, status: item.status || "pending", addedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, resources: [resource, ...prev.resources] }));
    notify(resource.status === "draft" ? "Resource saved as draft" : "Resource submitted for Admin review");
  };

  const setResourceStatus = (id: string, status: NonNullable<Resource["status"]>) => {
    setDb(prev => ({ ...prev, resources: prev.resources.map(r => r.id === id ? { ...r, status } : r) }));
    notify(`Resource ${status}`);
  };

  const deleteResource = (id: string) => {
    setDb(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
    notify("Resource removed", "info");
  };

  const addAssessment = (item: Omit<Assessment, "id">) => {
    const assessment: Assessment = { ...item, id: `a-${Date.now()}` };
    setDb(prev => ({ ...prev, assessments: [assessment, ...prev.assessments] }));
    notify("Assessment created");
  };

  const submitEvidence = (courseId: string, title: string, type: EvidenceItem["type"]) => {
    const traineeId = currentTraineeId();
    const course = db.courses.find(c => c.id === courseId);
    if (!traineeId || !course || !title.trim()) return notify("Add an evidence title before submitting.", "error");
    const item: EvidenceItem = {
      id: `ev-${Date.now()}`,
      traineeId,
      courseId,
      subject: course.subject,
      title: title.trim(),
      type,
      status: "submitted",
      submittedAt: new Date().toISOString().slice(0, 10),
      note: "Awaiting trainer review."
    };
    setDb(prev => ({ ...prev, evidence: [item, ...prev.evidence] }));
    notify("Operational evidence submitted for trainer evaluation");
  };

  const reviewEvidence = (id: string, status: EvidenceStatus, score: number, note: string) => {
    setDb(prev => ({
      ...prev,
      evidence: prev.evidence.map(e => e.id === id ? { ...e, status, score, note, reviewerId: currentUser?.id } : e)
    }));
    notify(`Evidence ${status}`);
  };

  const submitScenario = (scenarioId: string, answers: number[]) => {
    const traineeId = currentTraineeId();
    const scenario = db.scenarios.find(s => s.id === scenarioId);
    if (!traineeId || !scenario) return null;
    const correct = scenario.steps.reduce((sum, s, i) => sum + (answers[i] === s.answer ? 1 : 0), 0);
    const score = Math.round((correct / scenario.steps.length) * 100);
    const passed = score >= scenario.passingPercentage;
    const readinessBand = score >= 85 ? "High Readiness" : score >= 70 ? "Operationally Ready" : score >= 45 ? "Developing" : "Needs Development";
    const attempt: ScenarioAttempt = {
      id: `sca-${Date.now()}`,
      traineeId,
      scenarioId,
      score,
      passed,
      readinessBand,
      attemptedAt: new Date().toISOString().slice(0, 10)
    };
    setDb(prev => ({ ...prev, scenarioAttempts: [attempt, ...prev.scenarioAttempts] }));
    notify(`Scenario completed: ${score}% (${readinessBand})`, passed ? "success" : "info");
    return attempt;
  };

  const addKnowledgeAsset = (item: Omit<KnowledgeAsset, "id"|"capturedAt">) => {
    const asset: KnowledgeAsset = {
      ...item,
      id: `ka-${Date.now()}`,
      status: "published",
      capturedAt: new Date().toISOString().slice(0, 10)
    };
    setDb(prev => ({ ...prev, knowledgeAssets: [asset, ...prev.knowledgeAssets] }));
    notify("Knowledge asset shared with training cell");
  };

  const submitFeedback = (courseId: string, rating: number, comment: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return;
    const fb: CourseFeedback = {
      id: `fb-${Date.now()}`,
      traineeId,
      courseId,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setDb(prev => ({
      ...prev,
      feedback: [fb, ...prev.feedback.filter(f => !(f.traineeId === traineeId && f.courseId === courseId))]
    }));
    notify("Course feedback submitted");
  };

  const verifyCompetency = (traineeId: string, courseId: string) => {
    const enrollment = db.enrollments.find(e => e.traineeId === traineeId && e.courseId === courseId);
    const course = db.courses.find(c => c.id === courseId);
    const post = db.assessments.find(a => a.courseId === courseId && a.type === "post");
    const passed = post ? db.attempts.some(a => a.traineeId === traineeId && a.assessmentId === post.id && a.passed) : false;
    const evidenceVerified = course ? db.evidence.some(e => e.traineeId === traineeId && e.courseId === courseId && e.status === "verified") : false;
    if (!enrollment || !course || enrollment.progress < 100 || !passed || !evidenceVerified) {
      notify("Verification blocked: complete lessons, pass the post-training assessment and obtain trainer-verified operational evidence.", "error");
      return false;
    }
    if (db.certificates.some(c => c.traineeId === traineeId && c.courseId === courseId)) {
      notify("Certificate already issued", "info");
      return true;
    }
    const trainer = db.trainers.find(t => t.id === course.trainerId);
    const trainee = db.trainees.find(t => t.id === traineeId);
    if (!trainer || !trainee) return false;
    const issued = new Date();
    const valid = new Date(issued);
    valid.setFullYear(valid.getFullYear() + 1);
    const cert = {
      id: `cert-${Date.now()}`,
      traineeId,
      courseId,
      trainerId: trainer.id,
      competency: course.subject,
      issuedAt: issued.toISOString().slice(0, 10),
      validUntil: valid.toISOString().slice(0, 10),
      certificateCode: `CC-${new Date().getFullYear()}-${course.code.split("-")[1]}-${String(db.certificates.length + 1).padStart(4, "0")}`
    };
    const req = db.competencyRequirements.find(r => r.role === trainee.designation && r.subject === course.subject) || db.competencyRequirements.find(r => r.subject === course.subject);
    const result: CompetencyResult = {
      id: `cr-${Date.now()}`,
      traineeId,
      role: trainee.designation,
      subject: course.subject,
      currentLevel: req?.requiredLevel || course.level,
      requiredLevel: req?.requiredLevel || course.level,
      gapText: "Required level met",
      score: 100,
      missingCompetencies: [],
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setDb(prev => ({
      ...prev,
      certificates: [cert, ...prev.certificates],
      competencyResults: [result, ...prev.competencyResults.filter(r => !(r.traineeId === traineeId && r.subject === course.subject))]
    }));
    notify("Competency verified and certificate issued");
    return true;
  };

  const recommendationsForCurrentTrainee = () => {
    const traineeId = currentTraineeId();
    if (!traineeId) return [];
    const latest = db.competencyResults.find(r => r.traineeId === traineeId);
    if (!latest) return [];
    return recommend(db, latest.subject, latest.currentLevel, latest.requiredLevel);
  };

  const resetDemo = () => {
    setDb(cloneSeed());
    setSessionId(null);
    notify("Demo data reset", "info");
  };

  return (
    <AppContext.Provider value={{
      db,
      currentUser,
      toast,
      login,
      logout,
      register,
      createUser,
      resetDemo,
      notify,
      approveUser,
      toggleUserStatus,
      changeUserRole,
      verifyTrainer,
      updateTrainerProfile,
      updateTraineeProfile,
      createCourse,
      setCourseStatus,
      updateCourse,
      requestEnrollment,
      decideEnrollment,
      toggleLesson,
      submitAssessment,
      runCompetencyCheck,
      addNotification,
      addResource,
      setResourceStatus,
      deleteResource,
      addAssessment,
      submitEvidence,
      reviewEvidence,
      submitScenario,
      addKnowledgeAsset,
      submitFeedback,
      verifyCompetency,
      recommendationsForCurrentTrainee,
      levelRecommendationsForCurrentTrainee,
      checkCourseEligibility
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { CURRENT_SCHEMA_VERSION, DEFAULT_ROLE_REQUIREMENTS, KEYS, sanitizeLevel } from "../data/constants";
import { seedDB } from "../data/seed";
import { Assessment, AssessmentAttempt, Certificate, CompetencyLevel, CompetencyResult, Course, CourseFeedback, DB, EvidenceItem, EvidenceStatus, KnowledgeAsset, NotificationItem, Resource, Role, RoleCompetencyGapItem, RoleRequirementsMap, ScenarioAttempt, Trainee, TraineeLevelsMap, Trainer, TrainerExpertiseItem, TrainerExpertiseMap, User } from "../types";
import { formatLevel, gapText, getLevelNumber, levelFromScore, recommend, getRoleCompetencyRecommendations, getNextStepRecommendation } from "../utils/engine";

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };

interface AppContextType {
  db: DB;
  currentUser: User | null;
  toast: Toast | null;
  roleRequirements: RoleRequirementsMap;
  traineeLevels: TraineeLevelsMap;
  certificates: Certificate[];
  trainerExpertise: TrainerExpertiseMap;
  login: (email: string, password: string) => { ok: boolean; message: string; role?: Role };
  logout: () => void;
  register: (input: { name: string; email: string; password: string; role: Role; department: string; designation: string; jobRole?: string }) => { ok: boolean; message: string };
  createUser: (input: { name: string; email: string; password: string; role: Role; department: string; designation: string; employeeId?: string; jobRole?: string }) => { ok: boolean; message: string };
  resetDemo: () => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
  approveUser: (id: string, approved: boolean) => void;
  toggleUserStatus: (id: string) => void;
  changeUserRole: (id: string, role: Role) => void;
  verifyTrainer: (id: string, verified: boolean) => void;
  updateTrainerProfile: (patch: Partial<Trainer>) => void;
  updateTraineeProfile: (patch: Partial<Trainee>) => void;
  createCourse: (course: Omit<Course, "id" | "status" | "rating">) => void;
  setCourseStatus: (id: string, status: Course["status"]) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  requestEnrollment: (courseId: string) => void;
  decideEnrollment: (id: string, approved: boolean) => void;
  toggleLesson: (courseId: string, lessonId: string) => void;
  submitAssessment: (assessmentId: string, answers: number[]) => AssessmentAttempt | null;
  runCompetencyCheck: (role: string, subject: string, score: number, missed: string[]) => CompetencyResult | null;
  addNotification: (item: Omit<NotificationItem, "id" | "publishedAt">) => void;
  addResource: (item: Omit<Resource, "id" | "addedAt">) => void;
  setResourceStatus: (id: string, status: NonNullable<Resource["status"]>) => void;
  deleteResource: (id: string) => void;
  addAssessment: (item: Omit<Assessment, "id">) => void;
  submitEvidence: (courseId: string, title: string, type: EvidenceItem["type"]) => void;
  reviewEvidence: (id: string, status: EvidenceStatus, score: number, note: string) => void;
  submitScenario: (scenarioId: string, answers: number[]) => ScenarioAttempt | null;
  addKnowledgeAsset: (item: Omit<KnowledgeAsset, "id" | "capturedAt">) => void;
  submitFeedback: (courseId: string, rating: number, comment: string) => void;
  verifyCompetency: (traineeId: string, courseId: string) => boolean;
  recommendationsForCurrentTrainee: () => ReturnType<typeof recommend>;
  getTraineeLevel: (traineeId: string, competencyName: string) => CompetencyLevel;
  setTraineeLevel: (traineeId: string, competencyName: string, newLevel: CompetencyLevel) => void;
  getTraineeLevels: (traineeId: string) => Record<string, CompetencyLevel>;
  getRoleRequirements: (roleName: string) => Record<string, CompetencyLevel>;
  getRoleRecommendations: (trainee?: Trainee) => RoleCompetencyGapItem[];
  getNextStep: (trainee?: Trainee) => RoleCompetencyGapItem | null;
  getTrainerExpertise: (trainerId: string) => TrainerExpertiseItem[];
  setTrainerExpertise: (trainerId: string, items: TrainerExpertiseItem[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function cloneSeed(): DB {
  return JSON.parse(JSON.stringify(seedDB));
}

function getDefaultTraineeLevels(): TraineeLevelsMap {
  return {
    "u-tra1": {
      "Basic Meteorology": "L1",
      "Doppler Radar Operations": "L1",
      "Radar Data Interpretation": "L1",
      "Severe Weather Detection": "L1",
      "Warning Communication": "L1",
      "Radar Quality Control and Maintenance": "L1",
    },
    "ta1": {
      "Basic Meteorology": "L1",
      "Doppler Radar Operations": "L1",
      "Radar Data Interpretation": "L1",
      "Severe Weather Detection": "L1",
      "Warning Communication": "L1",
      "Radar Quality Control and Maintenance": "L1",
    },
    "u-tra2": {
      "Basic Meteorology": "L2",
      "Doppler Radar Operations": "L2",
      "Radar Data Interpretation": "L1",
      "Severe Weather Detection": "L1",
      "Warning Communication": "L1",
      "Radar Quality Control and Maintenance": "L1",
    },
    "ta2": {
      "Basic Meteorology": "L2",
      "Doppler Radar Operations": "L2",
      "Radar Data Interpretation": "L1",
      "Severe Weather Detection": "L1",
      "Warning Communication": "L1",
      "Radar Quality Control and Maintenance": "L1",
    },
    "u-tra3": {
      "Doppler Radar Operations": "L3",
      "Radar Data Interpretation": "L3",
      "Severe Weather Detection": "L3",
      "Basic Meteorology": "L2",
      "Radar Quality Control and Maintenance": "L2",
      "Warning Communication": "L1",
    },
    "ta3": {
      "Doppler Radar Operations": "L3",
      "Radar Data Interpretation": "L3",
      "Severe Weather Detection": "L3",
      "Basic Meteorology": "L2",
      "Radar Quality Control and Maintenance": "L2",
      "Warning Communication": "L1",
    },
  };
}

export function getDefaultTrainerExpertise(): TrainerExpertiseMap {
  return {
    "tr1": [
      { competencyId: "doppler-radar-operations", expertiseLevel: "L5" },
      { competencyId: "radar-data-interpretation", expertiseLevel: "L5" },
      { competencyId: "severe-weather-detection", expertiseLevel: "L4" },
      { competencyId: "basic-meteorology", expertiseLevel: "L4" },
      { competencyId: "radar-quality-control-and-maintenance", expertiseLevel: "L4" },
      { competencyId: "warning-communication", expertiseLevel: "L3" },
    ],
    "tr2": [
      { competencyId: "basic-meteorology", expertiseLevel: "L4" },
      { competencyId: "doppler-radar-operations", expertiseLevel: "L4" },
      { competencyId: "radar-data-interpretation", expertiseLevel: "L3" },
    ],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  // 8. DATA VERSIONING & SAFE RE-SEEDING
  const [db, setDb] = useState<DB>(() => {
    try {
      const storedVersion = localStorage.getItem(KEYS.SCHEMA_VERSION);
      if (!storedVersion || storedVersion !== CURRENT_SCHEMA_VERSION) {
        // Wipe old cc_ / capacityConnect data and re-seed
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("cc_") || key.startsWith("capacityConnect")) {
            localStorage.removeItem(key);
          }
        });
        localStorage.setItem(KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
        localStorage.setItem(KEYS.ROLE_REQUIREMENTS, JSON.stringify(DEFAULT_ROLE_REQUIREMENTS));
        localStorage.setItem(KEYS.TRAINEE_LEVELS, JSON.stringify(getDefaultTraineeLevels()));
        localStorage.setItem(KEYS.TRAINER_EXPERTISE, JSON.stringify(getDefaultTrainerExpertise()));
        return cloneSeed();
      }

      const raw = localStorage.getItem(KEYS.DB);
      return raw ? JSON.parse(raw) : cloneSeed();
    } catch {
      return cloneSeed();
    }
  });

  const [roleRequirements, setRoleRequirements] = useState<RoleRequirementsMap>(() => {
    try {
      const raw = localStorage.getItem(KEYS.ROLE_REQUIREMENTS);
      return raw ? JSON.parse(raw) : DEFAULT_ROLE_REQUIREMENTS;
    } catch {
      return DEFAULT_ROLE_REQUIREMENTS;
    }
  });

  const [traineeLevels, setTraineeLevels] = useState<TraineeLevelsMap>(() => {
    try {
      const raw = localStorage.getItem(KEYS.TRAINEE_LEVELS);
      return raw ? JSON.parse(raw) : getDefaultTraineeLevels();
    } catch {
      return getDefaultTraineeLevels();
    }
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const raw = localStorage.getItem(KEYS.CERTIFICATES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [trainerExpertise, setTrainerExpertiseState] = useState<TrainerExpertiseMap>(() => {
    try {
      const raw = localStorage.getItem(KEYS.TRAINER_EXPERTISE);
      return raw ? JSON.parse(raw) : getDefaultTrainerExpertise();
    } catch {
      return getDefaultTrainerExpertise();
    }
  });

  const [sessionId, setSessionId] = useState<string | null>(() => {
    const sid = localStorage.getItem(KEYS.SESSION);
    // Keep currently logged-in session sensible (log out if user no longer exists)
    if (sid && !seedDB.users.some(u => u.id === sid)) {
      localStorage.removeItem(KEYS.SESSION);
      return null;
    }
    return sid;
  });

  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    localStorage.setItem(KEYS.DB, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    localStorage.setItem(KEYS.ROLE_REQUIREMENTS, JSON.stringify(roleRequirements));
  }, [roleRequirements]);

  useEffect(() => {
    localStorage.setItem(KEYS.TRAINEE_LEVELS, JSON.stringify(traineeLevels));
  }, [traineeLevels]);

  useEffect(() => {
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(KEYS.TRAINER_EXPERTISE, JSON.stringify(trainerExpertise));
  }, [trainerExpertise]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(KEYS.SESSION, sessionId);
    } else {
      localStorage.removeItem(KEYS.SESSION);
    }
  }, [sessionId]);

  const currentUser = useMemo(() => {
    const user = db.users.find(u => u.id === sessionId);
    return user ?? null;
  }, [db.users, sessionId]);

  const notify = (message: string, tone: Toast["tone"] = "success") => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => setToast(t => (t?.id === id ? null : t)), 2800);
  };

  const getRoleRequirements = (roleName: string): Record<string, CompetencyLevel> => {
    return roleRequirements[roleName] || DEFAULT_ROLE_REQUIREMENTS[roleName] || {};
  };

  const getTraineeLevel = (traineeId: string, competencyName: string): CompetencyLevel => {
    const traineeKey = traineeId;
    const levels = traineeLevels[traineeKey] || traineeLevels[currentTraineeId() || ""] || {};
    return sanitizeLevel(levels[competencyName] || "L1");
  };

  const getTraineeLevels = (traineeId: string): Record<string, CompetencyLevel> => {
    const levels = traineeLevels[traineeId] || traineeLevels[currentTraineeId() || ""] || {};
    return { ...levels };
  };

  const setTraineeLevel = (traineeId: string, competencyName: string, newLevel: CompetencyLevel) => {
    const cleanLevel = sanitizeLevel(newLevel);
    const targetNum = getLevelNumber(cleanLevel);

    setTraineeLevels(prev => {
      const currentMap = { ...(prev[traineeId] || {}) };
      const currentLevelStr = currentMap[competencyName] || "L1";
      const currentNum = getLevelNumber(currentLevelStr);

      // Never lower a level, never below 1, never above 5
      if (targetNum <= currentNum) {
        return prev;
      }

      currentMap[competencyName] = cleanLevel;
      return {
        ...prev,
        [traineeId]: currentMap
      };
    });

    // Also update in db.trainees competencies array if present
    setDb(prev => ({
      ...prev,
      trainees: prev.trainees.map(t => {
        if (t.id !== traineeId && t.userId !== traineeId) return t;
        const currentComps = t.competencies ? [...t.competencies] : [];
        const idx = currentComps.findIndex(c => c.name === competencyName);
        if (idx !== -1) {
          currentComps[idx] = { ...currentComps[idx], currentLevel: cleanLevel };
        } else {
          currentComps.push({ name: competencyName, currentLevel: cleanLevel, targetLevel: "L3" });
        }
        return { ...t, competencies: currentComps };
      })
    }));
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
      jobRole: input.role === "trainee" ? (input.jobRole || "Radar Operator") : undefined,
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
      jobRole: input.role === "trainee" ? (input.jobRole || "Radar Operator") : undefined,
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
          subjects: ["Basic Meteorology", "Doppler Radar Operations"],
          skills: ["Radar Operations"],
          level: "Intermediate",
          rating: 4.5,
          availability: "Available",
          verified: false,
          certifications: [],
          bio: "Newly onboarded trainer."
        }, ...trainers];
      }
      if (input.role === "trainee") {
        trainees = [{
          id: `ta-${Date.now()}`,
          userId: id,
          name: user.name,
          role: user.jobRole || "Radar Operator",
          jobRole: user.jobRole || "Radar Operator",
          centre: "IMD Centre",
          department: user.department,
          designation: user.designation,
          qualification: "Graduate Degree",
          experienceYears: 1,
          interests: ["Radar", "Meteorology"],
          skills: { "Basic Meteorology": "Beginner" },
          competencies: [
            { name: "Basic Meteorology", currentLevel: "L1", targetLevel: "L2" },
            { name: "Doppler Radar Operations", currentLevel: "L1", targetLevel: "L3" }
          ],
          goals: "Develop radar operational competency."
        }, ...trainees];
      }
      return { ...prev, users: [user, ...prev.users], trainers, trainees };
    });
    notify(`Created user ${user.name}`);
    return { ok: true, message: "User account created." };
  };

  const approveUser = (id: string, approved: boolean) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, status: approved ? "active" : "rejected" } : u) }));
    notify(approved ? "User approved" : "User rejected", approved ? "success" : "info");
  };

  const toggleUserStatus = (id: string) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u) }));
    notify("User status updated");
  };

  const changeUserRole = (id: string, role: Role) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, role } : u) }));
    notify(`Role changed to ${role}`);
  };

  const verifyTrainer = (id: string, verified: boolean) => {
    setDb(prev => ({ ...prev, trainers: prev.trainers.map(t => t.id === id ? { ...t, verified } : t) }));
    notify(verified ? "Trainer verified" : "Trainer verification revoked");
  };

  const updateTrainerProfile = (patch: Partial<Trainer>) => {
    if (!currentUser) return;
    setDb(prev => ({ ...prev, trainers: prev.trainers.map(t => t.userId === currentUser.id ? { ...t, ...patch } : t) }));
    notify("Trainer profile saved");
  };

  const updateTraineeProfile = (patch: Partial<Trainee>) => {
    if (!currentUser) return;
    setDb(prev => ({ ...prev, trainees: prev.trainees.map(t => t.userId === currentUser.id ? { ...t, ...patch } : t) }));
    notify("Trainee profile saved");
  };

  const createCourse = (course: Omit<Course, "id" | "status" | "rating">) => {
    const item: Course = { ...course, id: `c-${Date.now()}`, status: "pending", rating: 0 };
    setDb(prev => ({ ...prev, courses: [item, ...prev.courses] }));
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

  const requestEnrollment = (courseId: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return notify("Trainee profile not found", "error");
    if (db.enrollments.some(e => e.traineeId === traineeId && e.courseId === courseId && e.status !== "rejected")) return notify("Enrollment already exists", "info");
    setDb(prev => ({ ...prev, enrollments: [{ id: `e-${Date.now()}`, traineeId, courseId, status: "approved", progress: 0, completedLessonIds: [], requestedAt: new Date().toISOString().slice(0, 10) }, ...prev.enrollments] }));
    notify("Enrollment successful");
  };

  const decideEnrollment = (id: string, approved: boolean) => {
    setDb(prev => ({ ...prev, enrollments: prev.enrollments.map(e => e.id === id ? { ...e, status: approved ? "approved" : "rejected" } : e) }));
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
          return { ...e, completedLessonIds: completed, progress, status: progress === 100 ? "completed" : e.status === "completed" ? "approved" : e.status };
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
    const attempt: AssessmentAttempt = { id: `att-${Date.now()}`, assessmentId, traineeId, score, passed, attemptedAt: new Date().toISOString().slice(0, 10) };

    // Phase 6: Level-up logic for level-course assessments
    const course = db.courses.find(c => c.id === assessment.courseId);
    if (course && course.competency && course.entryLevel && course.targetLevel) {
      const competencyName = course.competency;
      const previousLevel = getTraineeLevel(traineeId, competencyName);
      const previousRank = getLevelNumber(previousLevel);
      const targetRank = getLevelNumber(course.targetLevel);

      // Check if all lessons are complete
      const enrollment = db.enrollments.find(e => e.traineeId === traineeId && e.courseId === course.id && e.status !== "rejected");
      const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const completedLessons = enrollment?.completedLessonIds.length || 0;
      const lessonsIncomplete = completedLessons < totalLessons;

      // Check role requirement
      const trainee = db.trainees.find(t => t.id === traineeId || t.userId === traineeId);
      const roleReqs = roleRequirements[trainee?.jobRole || trainee?.role || ""] || {};
      const roleRequiredLevel = roleReqs[competencyName] as CompetencyLevel | undefined;
      const roleRequiredRank = roleRequiredLevel ? getLevelNumber(roleRequiredLevel) : 0;

      if (!passed) {
        // Failed: level unchanged
        attempt.levelUpInfo = {
          levelled: false,
          previousLevel: formatLevel(previousRank),
          newLevel: formatLevel(previousRank),
          competency: competencyName,
          courseTitle: course.title,
          lessonsIncomplete: false,
          roleRequirementMet: false,
          message: `Your level is unchanged. Score ${score}% did not meet the ${assessment.passingPercentage}% pass mark.`,
        };
      } else if (lessonsIncomplete) {
        // Passed but lessons incomplete: level unchanged
        attempt.levelUpInfo = {
          levelled: false,
          previousLevel: formatLevel(previousRank),
          newLevel: formatLevel(previousRank),
          competency: competencyName,
          courseTitle: course.title,
          lessonsIncomplete: true,
          roleRequirementMet: false,
          message: `Complete all lessons (${completedLessons}/${totalLessons}) to receive the level upgrade.`,
        };
      } else if (targetRank > previousRank) {
        // Passed + all lessons done + target is higher: LEVEL UP!
        const newLevel = formatLevel(targetRank);
        setTraineeLevel(traineeId, competencyName, course.targetLevel!);

        const roleRequirementMet = roleRequiredRank > 0 && targetRank >= roleRequiredRank && previousRank < roleRequiredRank;

        // Phase 7: Create and issue certificate record upon level-up
        const certCode = `CC-IMD-${course.targetLevel}-${Date.now().toString().slice(-6)}`;
        const certificate: Certificate = {
          id: `cert-${Date.now()}`,
          traineeId,
          courseId: course.id,
          trainerId: course.trainerId,
          competency: competencyName,
          levelAchieved: course.targetLevel,
          issuedAt: new Date().toISOString().slice(0, 10),
          validUntil: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          certificateCode: certCode,
        };

        attempt.levelUpInfo = {
          levelled: true,
          previousLevel: formatLevel(previousRank),
          newLevel,
          competency: competencyName,
          courseTitle: course.title,
          lessonsIncomplete: false,
          roleRequirementMet,
          roleRequiredLevel,
          message: `Level updated: ${formatLevel(previousRank)} → ${newLevel} in ${competencyName}!`,
          certificate,
        };

        // Save to certificates state (synced with KEYS.CERTIFICATES in localStorage)
        setCertificates(prev => {
          const alreadyHasCert = prev.some(
            c => c.traineeId === traineeId && c.courseId === course.id && c.levelAchieved === course.targetLevel
          );
          return alreadyHasCert ? prev : [certificate, ...prev];
        });

        // Add certificate to db.certificates (preventing duplicate certificates if retaken)
        setDb(prev => {
          const alreadyHasCert = prev.certificates.some(
            c => c.traineeId === traineeId && c.courseId === course.id && c.levelAchieved === course.targetLevel
          );
          return {
            ...prev,
            certificates: alreadyHasCert ? prev.certificates : [certificate, ...prev.certificates],
            attempts: [attempt, ...prev.attempts],
          };
        });

        addNotification({
          title: `Competency Level Upgraded: ${newLevel}`,
          body: `Congratulations! You advanced from ${formatLevel(previousRank)} to ${newLevel} in ${competencyName}. Official certificate ${certCode} issued.`,
          type: "achievement",
          audience: "trainee",
        });

        notify(`Level Updated: ${formatLevel(previousRank)} → ${newLevel}! Certificate issued.`, "success");
        return attempt;
      } else {
        // Passed but already at or above target level (retake): no change
        attempt.levelUpInfo = {
          levelled: false,
          previousLevel: formatLevel(previousRank),
          newLevel: formatLevel(previousRank),
          competency: competencyName,
          courseTitle: course.title,
          lessonsIncomplete: false,
          roleRequirementMet: false,
          message: `Assessment passed! Your level in ${competencyName} is already ${formatLevel(previousRank)} (at or above ${course.targetLevel}).`,
        };
      }
    }

    setDb(prev => ({ ...prev, attempts: [attempt, ...prev.attempts] }));
    notify(`Assessment submitted: ${score}%`, attempt.passed ? "success" : "info");
    return attempt;
  };

  const runCompetencyCheck = (role: string, subject: string, score: number, missed: string[]) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return null;
    const req = db.competencyRequirements.find(r => r.role === role && r.subject === subject) || db.competencyRequirements.find(r => r.subject === subject);
    const currentLevel = levelFromScore(score);
    const requiredLevel = req?.requiredLevel ?? "Advanced";
    const result: CompetencyResult = { id: `cr-${Date.now()}`, traineeId, role, subject, currentLevel, requiredLevel, gapText: gapText(currentLevel, requiredLevel), score, missingCompetencies: missed, updatedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, competencyResults: [result, ...prev.competencyResults.filter(r => !(r.traineeId === traineeId && r.subject === subject))] }));
    notify("Competency check completed");
    return result;
  };

  const addNotification = (item: Omit<NotificationItem, "id" | "publishedAt">) => {
    const n: NotificationItem = { ...item, id: `n-${Date.now()}`, publishedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, notifications: [n, ...prev.notifications] }));
    notify("Content published");
  };

  const addResource = (item: Omit<Resource, "id" | "addedAt">) => {
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
    const item: EvidenceItem = { id: `ev-${Date.now()}`, traineeId, courseId, subject: course.subject, title: title.trim(), type, status: "submitted", submittedAt: new Date().toISOString().slice(0, 10), note: "Awaiting trainer review." };
    setDb(prev => ({ ...prev, evidence: [item, ...prev.evidence] }));
    notify("Evidence submitted");
  };

  const reviewEvidence = (id: string, status: EvidenceStatus, score: number, note: string) => {
    setDb(prev => ({ ...prev, evidence: prev.evidence.map(e => e.id === id ? { ...e, status, score, note, reviewerId: currentUser?.id } : e) }));
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
    const attempt: ScenarioAttempt = { id: `sca-${Date.now()}`, traineeId, scenarioId, score, passed, readinessBand, attemptedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, scenarioAttempts: [attempt, ...prev.scenarioAttempts] }));
    notify(`Scenario completed: ${score}%`, passed ? "success" : "info");
    return attempt;
  };

  const addKnowledgeAsset = (item: Omit<KnowledgeAsset, "id" | "capturedAt">) => {
    const asset: KnowledgeAsset = { ...item, id: `ka-${Date.now()}`, status: "published", capturedAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, knowledgeAssets: [asset, ...prev.knowledgeAssets] }));
    notify("Knowledge asset saved");
  };

  const submitFeedback = (courseId: string, rating: number, comment: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return;
    const fb: CourseFeedback = { id: `fb-${Date.now()}`, traineeId, courseId, rating, comment: comment.trim(), createdAt: new Date().toISOString().slice(0, 10) };
    setDb(prev => ({ ...prev, feedback: [fb, ...prev.feedback.filter(f => !(f.traineeId === traineeId && f.courseId === courseId))] }));
    notify("Course feedback submitted");
  };

  const verifyCompetency = (traineeId: string, courseId: string) => {
    const enrollment = db.enrollments.find(e => e.traineeId === traineeId && e.courseId === courseId);
    const course = db.courses.find(c => c.id === courseId);
    const post = db.assessments.find(a => a.courseId === courseId && a.type === "post");
    const passed = post ? db.attempts.some(a => a.traineeId === traineeId && a.assessmentId === post.id && a.passed) : false;
    if (!enrollment || !course || enrollment.progress < 100 || !passed) {
      notify("Verification requires 100% course progress and passing post-test.", "error");
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
      competency: course.competency || course.subject,
      levelAchieved: course.targetLevel,
      issuedAt: issued.toISOString().slice(0, 10),
      validUntil: valid.toISOString().slice(0, 10),
      certificateCode: `CC-${new Date().getFullYear()}-${course.code.split("-")[1] || "RAD"}-${String(db.certificates.length + 1).padStart(4, "0")}`
    };
    setDb(prev => ({ ...prev, certificates: [cert, ...prev.certificates] }));
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

  const getRoleRecommendations = (targetTrainee?: Trainee): RoleCompetencyGapItem[] => {
    const t = targetTrainee || (currentUser ? db.trainees.find(x => x.userId === currentUser.id) : undefined);
    return getRoleCompetencyRecommendations(t, db.courses, roleRequirements, traineeLevels);
  };

  const getNextStep = (targetTrainee?: Trainee): RoleCompetencyGapItem | null => {
    const items = getRoleRecommendations(targetTrainee);
    return getNextStepRecommendation(items);
  };

  const getTrainerExpertise = (trainerId: string): TrainerExpertiseItem[] => {
    return trainerExpertise[trainerId] || getDefaultTrainerExpertise()[trainerId] || [];
  };

  const setTrainerExpertise = (trainerId: string, items: TrainerExpertiseItem[]) => {
    setTrainerExpertiseState(prev => {
      const updated = {
        ...prev,
        [trainerId]: items,
      };
      return updated;
    });
    notify("Trainer competency expertise updated");
  };

  const resetDemo = () => {
    localStorage.removeItem(KEYS.DB);
    localStorage.removeItem(KEYS.ROLE_REQUIREMENTS);
    localStorage.removeItem(KEYS.TRAINEE_LEVELS);
    localStorage.removeItem(KEYS.CERTIFICATES);
    localStorage.removeItem(KEYS.TRAINER_EXPERTISE);
    localStorage.setItem(KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    setRoleRequirements(DEFAULT_ROLE_REQUIREMENTS);
    setTraineeLevels(getDefaultTraineeLevels());
    setCertificates([]);
    setTrainerExpertiseState(getDefaultTrainerExpertise());
    setDb(cloneSeed());
    setSessionId(null);
    notify("Demo data reset to Phase 1 data foundation", "info");
  };

  return (
    <AppContext.Provider
      value={{
        db,
        currentUser,
        toast,
        roleRequirements,
        traineeLevels,
        certificates,
        trainerExpertise,
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
        getTraineeLevel,
        setTraineeLevel,
        getTraineeLevels,
        getRoleRequirements,
        getRoleRecommendations,
        getNextStep,
        getTrainerExpertise,
        setTrainerExpertise,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
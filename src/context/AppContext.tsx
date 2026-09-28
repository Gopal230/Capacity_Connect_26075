import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { seedDB } from "../data/seed";
import { Assessment, AssessmentAttempt, CompetencyResult, Course, CourseFeedback, DB, EvidenceItem, EvidenceStatus, KnowledgeAsset, NotificationItem, Resource, Role, ScenarioAttempt, Trainer, Trainee, User } from "../types";
import { gapText, levelFromScore, recommend } from "../utils/engine";

const DB_KEY = "capacityConnectDB_v4";
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
    window.setTimeout(() => setToast(t => t?.id === id ? null : t), 2800);
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
      id, name: input.name.trim(), email: input.email.trim(), password: input.password, role: input.role,
      status: "pending", department: input.department.trim(), designation: input.designation.trim(),
      createdAt: new Date().toISOString().slice(0,10), profileComplete: false
    };
    setDb(prev => ({ ...prev, users: [user, ...prev.users], activities: [{id:`ac-${Date.now()}`, text:`${user.name} submitted ${user.role} registration.`, at:new Date().toLocaleString()}, ...prev.activities] }));
    return { ok: true, message: "Registration submitted. Admin approval is required before login." };
  };

  const createUser: AppContextType["createUser"] = input => {
    if(!currentUser || currentUser.role!=="admin") return {ok:false,message:"Admin access required."};
    if(!input.name.trim()||!input.email.trim()||input.password.length<8||!input.department.trim()||!input.designation.trim()) return {ok:false,message:"Complete all fields. Temporary password must be at least 8 characters."};
    if(db.users.some(u=>u.email.toLowerCase()===input.email.toLowerCase())) return {ok:false,message:"Email already exists."};
    const id=`u-${Date.now()}`;
    const user:User={id,name:input.name.trim(),email:input.email.trim(),password:input.password,role:input.role,status:"active",department:input.department.trim(),designation:input.designation.trim(),employeeId:input.employeeId?.trim(),createdAt:new Date().toISOString().slice(0,10),profileComplete:false};
    setDb(prev=>{
      let trainers=prev.trainers, trainees=prev.trainees;
      if(user.role==="trainer") trainers=[{id:`tr-${Date.now()}`,userId:id,name:user.name,department:user.department,qualification:"Profile pending",experienceYears:0,subjects:[],skills:[],level:"Beginner",rating:0,availability:"Available",verified:false,certifications:[],bio:"Profile pending completion."},...trainers];
      if(user.role==="trainee") trainees=[{id:`ta-${Date.now()}`,userId:id,name:user.name,department:user.department,designation:user.designation,qualification:"Profile pending",experienceYears:0,interests:[],skills:{},goals:""},...trainees];
      return {...prev,users:[user,...prev.users],trainers,trainees,activities:[{id:`ac-${Date.now()}`,text:`Admin created ${user.role} account for ${user.name}.`,at:new Date().toLocaleString()},...prev.activities]};
    });
    notify(`${input.role[0].toUpperCase()+input.role.slice(1)} account created`);
    return {ok:true,message:"Account created and activated."};
  };

  const approveUser = (id: string, approved: boolean) => {
    setDb(prev => {
      const target = prev.users.find(u => u.id === id);
      if (!target) return prev;
      const users = prev.users.map(u => u.id === id ? {...u, status: approved ? "active" as const : "rejected" as const } : u);
      let trainers = prev.trainers;
      let trainees = prev.trainees;
      if (approved && target.role === "trainer" && !prev.trainers.some(t => t.userId === id)) {
        trainers = [{ id:`tr-${Date.now()}`, userId:id, name:target.name, department:target.department, qualification:"Not submitted", experienceYears:0, subjects:[], skills:[], level:"Beginner", rating:0, availability:"Available", verified:false, certifications:[], bio:"Profile pending completion." }, ...trainers];
      }
      if (approved && target.role === "trainee" && !prev.trainees.some(t => t.userId === id)) {
        trainees = [{ id:`ta-${Date.now()}`, userId:id, name:target.name, department:target.department, designation:target.designation, qualification:"Not submitted", experienceYears:0, interests:[], skills:{}, goals:"" }, ...trainees];
      }
      return {...prev, users, trainers, trainees, activities:[{id:`ac-${Date.now()}`, text:`${target.name} registration ${approved ? "approved" : "rejected"}.`, at:new Date().toLocaleString()}, ...prev.activities]};
    });
    notify(approved ? "User approved successfully" : "Registration rejected", approved ? "success" : "info");
  };

  const toggleUserStatus = (id: string) => {
    setDb(prev => ({...prev, users: prev.users.map(u => u.id===id ? {...u, status:u.status==="active"?"inactive":"active"} : u)}));
    notify("Account status updated");
  };

  const changeUserRole = (id:string, role:Role) => {
    setDb(prev => {
      const user=prev.users.find(u=>u.id===id);
      if(!user||user.role==="admin") return prev;
      let trainers=prev.trainers, trainees=prev.trainees;
      if(role==="trainer"&&!trainers.some(t=>t.userId===id)){
        trainers=[{id:`tr-${Date.now()}`,userId:id,name:user.name,department:user.department,qualification:"Not submitted",experienceYears:0,subjects:[],skills:[],level:"Beginner",rating:0,availability:"Available",verified:false,certifications:[],bio:"Profile pending completion."},...trainers];
      }
      if(role==="trainee"&&!trainees.some(t=>t.userId===id)){
        trainees=[{id:`ta-${Date.now()}`,userId:id,name:user.name,department:user.department,designation:user.designation,qualification:"Not submitted",experienceYears:0,interests:[],skills:{},goals:""},...trainees];
      }
      return {...prev,users:prev.users.map(u=>u.id===id?{...u,role}:u),trainers,trainees};
    });
    notify("User role updated");
  };

  const verifyTrainer = (id: string, verified: boolean) => {
    setDb(prev => ({...prev, trainers: prev.trainers.map(t => t.id===id ? {...t, verified} : t)}));
    notify(verified ? "Trainer verified" : "Trainer verification removed");
  };

  const updateTrainerProfile = (patch: Partial<Trainer>) => {
    if (!currentUser) return;
    setDb(prev => ({...prev, trainers: prev.trainers.map(t=>t.userId===currentUser.id?{...t,...patch}:t), users:prev.users.map(u=>u.id===currentUser.id?{...u,profileComplete:true}:u)}));
    notify("Trainer profile saved");
  };

  const updateTraineeProfile = (patch: Partial<Trainee>) => {
    if (!currentUser) return;
    setDb(prev => ({...prev, trainees: prev.trainees.map(t=>t.userId===currentUser.id?{...t,...patch}:t), users:prev.users.map(u=>u.id===currentUser.id?{...u,profileComplete:true}:u)}));
    notify("Trainee profile saved");
  };

  const createCourse: AppContextType["createCourse"] = course => {
    const item: Course = {...course, id:`c-${Date.now()}`, status:"pending", rating:0};
    setDb(prev=>({...prev,courses:[item,...prev.courses],activities:[{id:`ac-${Date.now()}`,text:`Course proposal "${item.title}" submitted for Admin approval.`,at:new Date().toLocaleString()},...prev.activities]}));
    notify("Course proposal sent for Admin approval");
  };

  const setCourseStatus = (id: string, status: Course["status"]) => {
    setDb(prev=>({...prev,courses:prev.courses.map(c=>c.id===id?{...c,status}:c)}));
    notify(`Course status changed to ${status}`);
  };

  const updateCourse = (id:string, patch:Partial<Course>) => {
    setDb(prev=>({...prev,courses:prev.courses.map(c=>c.id===id?{...c,...patch}:c)}));
    notify("Course updated");
  };

  const currentTraineeId = () => currentUser ? db.trainees.find(t=>t.userId===currentUser.id)?.id : undefined;

  const requestEnrollment = (courseId: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return notify("Trainee profile not found","error");
    if (db.enrollments.some(e=>e.traineeId===traineeId && e.courseId===courseId && e.status!=="rejected")) return notify("Enrollment already exists","info");
    setDb(prev=>({...prev,enrollments:[{id:`e-${Date.now()}`,traineeId,courseId,status:"requested",progress:0,completedLessonIds:[],requestedAt:new Date().toISOString().slice(0,10)},...prev.enrollments]}));
    notify("Enrollment request submitted");
  };

  const decideEnrollment = (id: string, approved: boolean) => {
    setDb(prev=>({...prev,enrollments:prev.enrollments.map(e=>e.id===id?{...e,status:approved?"approved":"rejected"}:e)}));
    notify(approved ? "Enrollment approved" : "Enrollment rejected", approved?"success":"info");
  };

  const toggleLesson = (courseId: string, lessonId: string) => {
    const traineeId = currentTraineeId();
    if (!traineeId) return;
    setDb(prev=>{
      const course = prev.courses.find(c=>c.id===courseId);
      const total = course?.modules.flatMap(m=>m.lessons).length || 1;
      return {...prev,enrollments:prev.enrollments.map(e=>{
        if(e.traineeId!==traineeId||e.courseId!==courseId||!["approved","completed"].includes(e.status)) return e;
        const has=e.completedLessonIds.includes(lessonId);
        const completed=has?e.completedLessonIds.filter(x=>x!==lessonId):[...e.completedLessonIds,lessonId];
        const progress=Math.round((completed.length/total)*100);
        return {...e,completedLessonIds:completed,progress,status:progress===100?"completed":e.status==="completed"?"approved":e.status};
      })};
    });
    notify("Lesson progress updated");
  };

  const submitAssessment = (assessmentId: string, answers: number[]) => {
    const traineeId = currentTraineeId();
    const assessment = db.assessments.find(a=>a.id===assessmentId);
    if(!traineeId||!assessment) return null;
    const correct=assessment.questions.reduce((sum,q,i)=>sum+(answers[i]===q.answer?1:0),0);
    const score=Math.round((correct/assessment.questions.length)*100);
    const attempt:AssessmentAttempt={id:`att-${Date.now()}`,assessmentId,traineeId,score,passed:score>=assessment.passingPercentage,attemptedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,attempts:[attempt,...prev.attempts]}));
    notify(`Assessment submitted: ${score}%`, attempt.passed?"success":"info");
    return attempt;
  };

  const runCompetencyCheck = (role:string, subject:string, score:number, missed:string[]) => {
    const traineeId=currentTraineeId();
    if(!traineeId) return null;
    const req=db.competencyRequirements.find(r=>r.role===role&&r.subject===subject) || db.competencyRequirements.find(r=>r.subject===subject);
    const currentLevel=levelFromScore(score);
    const requiredLevel=req?.requiredLevel ?? "Advanced";
    const result:CompetencyResult={id:`cr-${Date.now()}`,traineeId,role,subject,currentLevel,requiredLevel,gapText:gapText(currentLevel,requiredLevel),score,missingCompetencies:missed,updatedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,competencyResults:[result,...prev.competencyResults.filter(r=>!(r.traineeId===traineeId&&r.subject===subject))]}));
    notify("Competency gap analysis completed");
    return result;
  };

  const addNotification = (item: Omit<NotificationItem,"id"|"publishedAt">) => {
    const n:NotificationItem={...item,id:`n-${Date.now()}`,publishedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,notifications:[n,...prev.notifications]}));
    notify("Content published");
  };

  const addResource = (item: Omit<Resource,"id"|"addedAt">) => {
    const resource:Resource={...item,id:`r-${Date.now()}`,status:item.status||"pending",addedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,resources:[resource,...prev.resources]}));
    notify(resource.status==="draft"?"Resource saved as draft":"Resource submitted for Admin review");
  };

  const setResourceStatus=(id:string,status:NonNullable<Resource["status"]>)=>{setDb(prev=>({...prev,resources:prev.resources.map(r=>r.id===id?{...r,status}:r)}));notify(`Resource ${status}`)};
  const deleteResource=(id:string)=>{setDb(prev=>({...prev,resources:prev.resources.filter(r=>r.id!==id)}));notify("Resource removed","info")};

  const addAssessment = (item: Omit<Assessment,"id">) => {
    const assessment:Assessment={...item,id:`a-${Date.now()}`};
    setDb(prev=>({...prev,assessments:[assessment,...prev.assessments]}));
    notify("Assessment created");
  };

  const submitEvidence = (courseId:string, title:string, type:EvidenceItem["type"]) => {
    const traineeId=currentTraineeId();
    const course=db.courses.find(c=>c.id===courseId);
    if(!traineeId||!course||!title.trim()) return notify("Add an evidence title before submitting.","error");
    const item:EvidenceItem={id:`ev-${Date.now()}`,traineeId,courseId,subject:course.subject,title:title.trim(),type,status:"submitted",submittedAt:new Date().toISOString().slice(0,10),note:"Awaiting trainer review."};
    setDb(prev=>({...prev,evidence:[item,...prev.evidence],activities:[{id:`ac-${Date.now()}`,text:`Operational evidence submitted for ${course.subject}.`,at:new Date().toLocaleString()},...prev.activities]}));
    notify("Operational evidence submitted for trainer review");
  };

  const reviewEvidence = (id:string, status:EvidenceStatus, score:number, note:string) => {
    if(!currentUser||currentUser.role!=="trainer") return notify("Only the assigned trainer can review evidence.","error");
    const reviewer=db.trainers.find(t=>t.userId===currentUser.id);
    if(!reviewer?.verified) return notify("Trainer verification is required before evidence sign-off.","error");
    setDb(prev=>({...prev,evidence:prev.evidence.map(e=>e.id===id?{...e,status,score:Math.max(0,Math.min(100,score)),note:note.trim()||undefined,reviewerId:reviewer.id}:e)}));
    notify(status==="verified"?"Evidence verified and added to capability record":"Evidence returned for revision",status==="verified"?"success":"info");
  };

  const submitScenario = (scenarioId:string, answers:number[]) => {
    const traineeId=currentTraineeId();
    const scenario=db.scenarios.find(s=>s.id===scenarioId);
    if(!traineeId||!scenario) return null;
    const correct=scenario.steps.reduce((sum,step,i)=>sum+(answers[i]===step.answer?1:0),0);
    const score=Math.round(correct/scenario.steps.length*100);
    const readinessBand:ScenarioAttempt["readinessBand"]=score>=85?"High Readiness":score>=scenario.passingPercentage?"Operationally Ready":"Needs Development";
    const attempt:ScenarioAttempt={id:`sca-${Date.now()}`,traineeId,scenarioId,score,passed:score>=scenario.passingPercentage,readinessBand,attemptedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,scenarioAttempts:[attempt,...prev.scenarioAttempts],activities:[{id:`ac-${Date.now()}`,text:`Operational scenario completed with ${score}% readiness score.`,at:new Date().toLocaleString()},...prev.activities]}));
    notify(`Scenario completed: ${score}% — ${readinessBand}`,attempt.passed?"success":"info");
    return attempt;
  };

  const addKnowledgeAsset = (item:Omit<KnowledgeAsset,"id"|"capturedAt">) => {
    if(!currentUser||currentUser.role!=="trainer") return;
    const trainer=db.trainers.find(t=>t.userId===currentUser.id);
    if(!trainer) return notify("Trainer profile not found","error");
    const asset:KnowledgeAsset={...item,trainerId:trainer.id,id:`ka-${Date.now()}`,capturedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,knowledgeAssets:[asset,...prev.knowledgeAssets],activities:[{id:`ac-${Date.now()}`,text:`Knowledge asset “${asset.title}” captured by ${trainer.name}.`,at:new Date().toLocaleString()},...prev.activities]}));
    notify("Expert knowledge captured in continuity vault");
  };

  const submitFeedback = (courseId:string, rating:number, comment:string) => {
    const traineeId=currentTraineeId();
    if(!traineeId||!comment.trim()) return notify("Add feedback before submitting.","error");
    const item:CourseFeedback={id:`fb-${Date.now()}`,traineeId,courseId,rating:Math.max(1,Math.min(5,rating)),comment:comment.trim(),createdAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,feedback:[item,...prev.feedback.filter(f=>!(f.traineeId===traineeId&&f.courseId===courseId))]}));
    notify("Course feedback submitted");
  };

  const verifyCompetency = (traineeId:string, courseId:string) => {
    const enrollment=db.enrollments.find(e=>e.traineeId===traineeId&&e.courseId===courseId);
    const course=db.courses.find(c=>c.id===courseId);
    const post=db.assessments.find(a=>a.courseId===courseId&&a.type==="post");
    const passed=post?db.attempts.some(a=>a.traineeId===traineeId&&a.assessmentId===post.id&&a.passed):false;
    const evidenceVerified=course?db.evidence.some(e=>e.traineeId===traineeId&&e.courseId===courseId&&e.status==="verified"):false;
    if(!enrollment||!course||enrollment.progress<100||!passed||!evidenceVerified){ notify("Verification blocked: complete lessons, pass the post-test and obtain trainer-verified operational evidence.","error"); return false; }
    if(db.certificates.some(c=>c.traineeId===traineeId&&c.courseId===courseId)){ notify("Certificate already issued","info"); return true; }
    const trainer=db.trainers.find(t=>t.id===course.trainerId);
    const trainee=db.trainees.find(t=>t.id===traineeId);
    if(!trainer||!trainee) return false;
    const issued=new Date(); const valid=new Date(issued); valid.setFullYear(valid.getFullYear()+1);
    const cert={id:`cert-${Date.now()}`,traineeId,courseId,trainerId:trainer.id,competency:course.subject,issuedAt:issued.toISOString().slice(0,10),validUntil:valid.toISOString().slice(0,10),certificateCode:`CC-${new Date().getFullYear()}-${course.code.split("-")[1]}-${String(db.certificates.length+1).padStart(4,"0")}`};
    const req=db.competencyRequirements.find(r=>r.role===trainee.designation&&r.subject===course.subject)||db.competencyRequirements.find(r=>r.subject===course.subject);
    const result:CompetencyResult={id:`cr-${Date.now()}`,traineeId,role:trainee.designation,subject:course.subject,currentLevel:req?.requiredLevel||course.level,requiredLevel:req?.requiredLevel||course.level,gapText:"Required level met",score:100,missingCompetencies:[],updatedAt:new Date().toISOString().slice(0,10)};
    setDb(prev=>({...prev,certificates:[cert,...prev.certificates],competencyResults:[result,...prev.competencyResults.filter(r=>!(r.traineeId===traineeId&&r.subject===course.subject))]}));
    notify("Competency verified and certificate issued");
    return true;
  };

  const recommendationsForCurrentTrainee = () => {
    const traineeId=currentTraineeId();
    if(!traineeId) return [];
    const latest=db.competencyResults.find(r=>r.traineeId===traineeId);
    if(!latest) return [];
    return recommend(db,latest.subject,latest.currentLevel,latest.requiredLevel);
  };

  const resetDemo=()=>{
    setDb(cloneSeed());
    setSessionId(null);
    notify("Demo data reset","info");
  };

  return <AppContext.Provider value={{db,currentUser,toast,login,logout,register,createUser,resetDemo,notify,approveUser,toggleUserStatus,changeUserRole,verifyTrainer,updateTrainerProfile,updateTraineeProfile,createCourse,setCourseStatus,updateCourse,requestEnrollment,decideEnrollment,toggleLesson,submitAssessment,runCompetencyCheck,addNotification,addResource,setResourceStatus,deleteResource,addAssessment,submitEvidence,reviewEvidence,submitScenario,addKnowledgeAsset,submitFeedback,verifyCompetency,recommendationsForCurrentTrainee}}>
    {children}
  </AppContext.Provider>;
}

export function useApp(){
  const ctx=useContext(AppContext);
  if(!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
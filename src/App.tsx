import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";
import { Role } from "./types";
import AppShell from "./layouts/AppShell";
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import JudgeDemo from "./pages/public/JudgeDemo";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCompetencies from "./pages/admin/AdminCompetencies";
import AdminReports from "./pages/admin/AdminReports";
import AdminContent from "./pages/admin/AdminContent";
import AdminReadiness from "./pages/admin/AdminReadiness";
import AdminKnowledge from "./pages/admin/AdminKnowledge";
import AdminMedia from "./pages/admin/AdminMedia";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerCourses from "./pages/trainer/TrainerCourses";
import TrainerLibrary from "./pages/trainer/TrainerLibrary";
import TrainerAssessments from "./pages/trainer/TrainerAssessments";
import TrainerTrainees from "./pages/trainer/TrainerTrainees";
import TrainerEvidence from "./pages/trainer/TrainerEvidence";
import TrainerKnowledge from "./pages/trainer/TrainerKnowledge";
import TraineeDashboard from "./pages/trainee/TraineeDashboard";
import TraineeProfile from "./pages/trainee/TraineeProfile";
import CompetencyCheck from "./pages/trainee/CompetencyCheck";
import Recommendations from "./pages/trainee/Recommendations";
import LearningPage from "./pages/trainee/LearningPage";
import AssessmentPage from "./pages/trainee/AssessmentPage";
import CertificatesPage from "./pages/trainee/CertificatesPage";
import ScenarioLab from "./pages/trainee/ScenarioLab";
import CapabilityPassport from "./pages/trainee/CapabilityPassport";

function Protected({role,children}:{role:Role;children:React.ReactNode}){
  const {currentUser}=useApp();
  if(!currentUser) return <Navigate to="/login" replace/>;
  if(currentUser.role!==role) return <Navigate to={`/${currentUser.role}`} replace/>;
  return <AppShell role={role}>{children}</AppShell>;
}

export default function App(){
  return <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/judge-demo" element={<JudgeDemo/>}/>

    <Route path="/admin" element={<Protected role="admin"><AdminDashboard/></Protected>}/>
    <Route path="/admin/users" element={<Protected role="admin"><AdminUsers/></Protected>}/>
    <Route path="/admin/trainers" element={<Protected role="admin"><AdminTrainers/></Protected>}/>
    <Route path="/admin/courses" element={<Protected role="admin"><AdminCourses/></Protected>}/>
    <Route path="/admin/media" element={<Protected role="admin"><AdminMedia/></Protected>}/>
    <Route path="/admin/competencies" element={<Protected role="admin"><AdminCompetencies/></Protected>}/>
    <Route path="/admin/reports" element={<Protected role="admin"><AdminReports/></Protected>}/>
    <Route path="/admin/content" element={<Protected role="admin"><AdminContent/></Protected>}/>
    <Route path="/admin/readiness" element={<Protected role="admin"><AdminReadiness/></Protected>}/>
    <Route path="/admin/knowledge" element={<Protected role="admin"><AdminKnowledge/></Protected>}/>

    <Route path="/trainer" element={<Protected role="trainer"><TrainerDashboard/></Protected>}/>
    <Route path="/trainer/profile" element={<Protected role="trainer"><TrainerProfile/></Protected>}/>
    <Route path="/trainer/courses" element={<Protected role="trainer"><TrainerCourses/></Protected>}/>
    <Route path="/trainer/library" element={<Protected role="trainer"><TrainerLibrary/></Protected>}/>
    <Route path="/trainer/assessments" element={<Protected role="trainer"><TrainerAssessments/></Protected>}/>
    <Route path="/trainer/trainees" element={<Protected role="trainer"><TrainerTrainees/></Protected>}/>
    <Route path="/trainer/evidence" element={<Protected role="trainer"><TrainerEvidence/></Protected>}/>
    <Route path="/trainer/knowledge" element={<Protected role="trainer"><TrainerKnowledge/></Protected>}/>

    <Route path="/trainee" element={<Protected role="trainee"><TraineeDashboard/></Protected>}/>
    <Route path="/trainee/profile" element={<Protected role="trainee"><TraineeProfile/></Protected>}/>
    <Route path="/trainee/competency" element={<Protected role="trainee"><CompetencyCheck/></Protected>}/>
    <Route path="/trainee/recommendations" element={<Protected role="trainee"><Recommendations/></Protected>}/>
    <Route path="/trainee/learning" element={<Protected role="trainee"><LearningPage/></Protected>}/>
    <Route path="/trainee/learning/:courseId" element={<Protected role="trainee"><LearningPage/></Protected>}/>
    <Route path="/trainee/assessments" element={<Protected role="trainee"><AssessmentPage/></Protected>}/>
    <Route path="/trainee/certificates" element={<Protected role="trainee"><CertificatesPage/></Protected>}/>
    <Route path="/trainee/scenarios" element={<Protected role="trainee"><ScenarioLab/></Protected>}/>
    <Route path="/trainee/passport" element={<Protected role="trainee"><CapabilityPassport/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
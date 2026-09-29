import { Archive, BookOpen, CalendarClock, ClipboardCheck, FileCheck2, FileUp, Users } from "lucide-react";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import MeteorologyContext from "../../components/MeteorologyContext";

export default function TrainerDashboard(){
  const {db,currentUser}=useApp();
  const trainer=db.trainers.find(t=>t.userId===currentUser?.id);
  const courses=db.courses.filter(c=>c.trainerId===trainer?.id);
  const enrollments=db.enrollments.filter(e=>courses.some(c=>c.id===e.courseId));
  const avg=enrollments.length?Math.round(enrollments.reduce((s,e)=>s+e.progress,0)/enrollments.length):0;
  const pendingEval=enrollments.filter(e=>e.progress===100&&!db.certificates.some(c=>c.traineeId===e.traineeId&&c.courseId===e.courseId)).length;const pendingEvidence=db.evidence.filter(e=>courses.some(c=>c.id===e.courseId)&&e.status==="submitted").length;const knowledge=db.knowledgeAssets.filter(a=>a.trainerId===trainer?.id).length;
  return <><PageHeader title="Trainer Dashboard" subtitle="Manage training delivery, learner progress and competency verification."/>
      <MeteorologyContext/>
    <div className="stats-grid"><StatCard label="Assigned Courses" value={courses.length} icon={<BookOpen/>}/><StatCard label="Total Trainees" value={new Set(enrollments.map(e=>e.traineeId)).size} icon={<Users/>}/><StatCard label="Pending Evaluations" value={pendingEval} icon={<ClipboardCheck/>}/><StatCard label="Upcoming Deadlines" value={courses.filter(c=>c.status==="published").length} icon={<CalendarClock/>}/><StatCard label="Average Progress" value={`${avg}%`} icon={<Users/>}/><StatCard label="Recent Uploads" value={db.resources.filter(r=>r.trainerId===trainer?.id).length} icon={<FileUp/>}/><StatCard label="Evidence Reviews" value={pendingEvidence} icon={<FileCheck2/>} caption="Awaiting sign-off"/><StatCard label="Knowledge Assets" value={knowledge} icon={<Archive/>} caption="Continuity vault"/></div>
    <div className="dashboard-grid two"><section className="panel"><div className="panel-head"><div><h3>Assigned courses</h3><p>Published and proposed training</p></div></div><div className="course-list">{courses.map(c=><article key={c.id}><div><h4>{c.title}</h4><p>{c.code} · {c.level}</p></div><Badge tone={c.status==="published"?"green":c.status==="pending"?"amber":"gray"}>{c.status}</Badge></article>)}</div></section>
    <section className="panel"><div className="panel-head"><div><h3>Trainee progress</h3><p>Active learners in your courses</p></div></div><div className="progress-list">{enrollments.slice(0,6).map(e=><div key={e.id}><div><strong>{db.trainees.find(t=>t.id===e.traineeId)?.name}</strong><span>{db.courses.find(c=>c.id===e.courseId)?.title}</span></div><b>{e.progress}%</b><ProgressBar value={e.progress}/></div>)}</div></section></div>
  </>
}
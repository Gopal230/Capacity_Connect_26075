import { Award, BookOpen, BrainCircuit, ClipboardCheck, Gauge, GraduationCap, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ProgressChart } from "../../components/Charts";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness } from "../../utils/engine";
import MeteorologyContext from "../../components/MeteorologyContext";

export default function TraineeDashboard(){
  const {db,currentUser,recommendationsForCurrentTrainee}=useApp();const trainee=db.trainees.find(t=>t.userId===currentUser?.id);
  const results=db.competencyResults.filter(r=>r.traineeId===trainee?.id);const latest=results[0];const recs=recommendationsForCurrentTrainee();const enrollments=db.enrollments.filter(e=>e.traineeId===trainee?.id&&e.status!=="rejected");const certs=db.certificates.filter(c=>c.traineeId===trainee?.id);
  const avg=enrollments.length?Math.round(enrollments.reduce((s,e)=>s+e.progress,0)/enrollments.length):0;const readiness=trainee?operationalReadiness(db,trainee.id):null;
  return <><PageHeader title={`Welcome, ${trainee?.name||"Trainee"}`} subtitle="Your personalized competency and learning workspace."/>
      <MeteorologyContext/>
    <div className="stats-grid"><StatCard label="Operational Readiness" value={readiness?`${readiness.score}/100`:"—"} icon={<Gauge/>} caption={readiness?.band}/><StatCard label="Competency Score" value={latest?`${latest.score}%`:"Not checked"} icon={<BrainCircuit/>} caption={latest?latest.currentLevel:"Run assessment"}/><StatCard label="Competency Gaps" value={latest?.missingCompetencies.length||0} icon={<Settings2/>}/><StatCard label="Recommended Courses" value={recs.length} icon={<BookOpen/>}/><StatCard label="Enrolled Courses" value={enrollments.length} icon={<GraduationCap/>}/><StatCard label="Upcoming Assessments" value={db.assessments.filter(a=>enrollments.some(e=>e.courseId===a.courseId)).length} icon={<ClipboardCheck/>}/><StatCard label="Certificates Earned" value={certs.length} icon={<Award/>}/></div>
    <div className="dashboard-grid two">
      <section className="panel"><div className="panel-head"><div><h3>Current competency status</h3><p>Latest verified or assessed result</p></div><Link to="/trainee/competency" className="text-link">Run check</Link></div>{latest?<div className="competency-summary"><div className="score-ring"><strong>{latest.score}</strong><span>/100</span></div><div><h4>{latest.subject}</h4><p><Badge tone="amber">{latest.currentLevel}</Badge> required <Badge tone="blue">{latest.requiredLevel}</Badge></p><strong className="gap-label">{latest.gapText}</strong><div className="chip-row">{latest.missingCompetencies.map(c=><span className="chip" key={c}>{c}</span>)}</div></div></div>:<div className="empty-inline"><p>No competency check recorded yet.</p><Link className="btn btn-primary" to="/trainee/competency">Start competency check</Link></div>}</section>
      <section className="panel"><div className="panel-head"><div><h3>Learning progress</h3><p>Average active course completion: {avg}%</p></div></div><ProgressChart/></section>
    </div>
    <div className="dashboard-grid two"><section className="panel"><div className="panel-head"><div><h3>Recommended next step</h3><p>Based on your competency gap</p></div><Link to="/trainee/recommendations" className="text-link">View all</Link></div>{recs.slice(0,2).map(r=><article className="recommend-mini" key={r.course.id}><div><Badge tone="green">{r.match}% match</Badge><h4>{r.course.title}</h4><p>{r.trainer?.name} · {r.course.level} · {r.course.durationHours} hrs</p></div><Link className="btn btn-secondary" to="/trainee/recommendations">Details</Link></article>)}</section>
      <section className="panel"><div className="panel-head"><div><h3>My courses</h3><p>Approved enrollment and completion</p></div><Link to="/trainee/learning" className="text-link">Open learning</Link></div><div className="progress-list">{enrollments.map(e=><div key={e.id}><div><strong>{db.courses.find(c=>c.id===e.courseId)?.title}</strong><span>{e.status}</span></div><b>{e.progress}%</b><ProgressBar value={e.progress}/></div>)}</div></section></div>
  </>
}
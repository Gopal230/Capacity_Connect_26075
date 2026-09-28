import { Archive, Award, BookOpen, CheckCircle2, ClipboardCheck, Gauge, GraduationCap, ShieldCheck, UserCheck, Users } from "lucide-react";
import { CompetencyChart, ParticipationChart } from "../../components/Charts";
import { Badge, ConfirmButton, PageHeader, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness, trainingImpact } from "../../utils/engine";
import MeteorologyContext from "../../components/MeteorologyContext";

export default function AdminDashboard(){
  const {db,resetDemo}=useApp();
  const pending=db.users.filter(u=>u.status==="pending").length;
  const activeCourses=db.courses.filter(c=>c.status==="published").length;
  const completed=db.enrollments.filter(e=>e.status==="completed").length;
  const completion=db.enrollments.length?Math.round(completed/db.enrollments.length*100):0;
  const impact=trainingImpact(db);const readiness=db.trainees.length?Math.round(db.trainees.reduce((s,t)=>s+operationalReadiness(db,t.id).score,0)/db.trainees.length):0;
  return <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Organization-wide training, competency and governance overview."
        actions={
          <ConfirmButton
            label="Reset demo data"
            className="btn btn-secondary"
            confirmText="Restore the original SIH demo dataset and sign out?"
            onConfirm={resetDemo}
          />
        }
      />

      <MeteorologyContext/>
    <div className="stats-grid">
      <StatCard label="Total Trainees" value={db.trainees.length} icon={<GraduationCap/>} caption="Approved profiles"/>
      <StatCard label="Total Trainers" value={db.trainers.length} icon={<Users/>} caption={`${db.trainers.filter(t=>t.verified).length} verified`}/>
      <StatCard label="Pending Approvals" value={pending} icon={<UserCheck/>} caption="Requires review"/>
      <StatCard label="Active Courses" value={activeCourses} icon={<BookOpen/>}/>
      <StatCard label="Enrollments" value={db.enrollments.length} icon={<CheckCircle2/>}/>
      <StatCard label="Assessments" value={db.attempts.length} icon={<ClipboardCheck/>}/>
      <StatCard label="Certificates" value={db.certificates.length} icon={<Award/>}/>
      <StatCard label="Completion Rate" value={`${completion}%`} icon={<CheckCircle2/>} caption="Prototype sample"/>
      <StatCard label="Operational Readiness" value={`${readiness}/100`} icon={<Gauge/>} caption={`${impact.readinessRate}% personnel ready`}/>
      <StatCard label="Verified Evidence" value={impact.verified} icon={<ShieldCheck/>} caption={`${impact.evidenceRate}% evidence verified`}/>
      <StatCard label="Knowledge Assets" value={db.knowledgeAssets.length} icon={<Archive/>} caption="Institutional memory"/>
    </div>
    <div className="dashboard-grid two">
      <section className="panel"><div className="panel-head"><div><h3>Competency improvement</h3><p>Average verified score trend</p></div><Badge tone="green">+30 pts</Badge></div><CompetencyChart/></section>
      <section className="panel"><div className="panel-head"><div><h3>Department participation</h3><p>Active learners by training area</p></div></div><ParticipationChart/></section>
    </div>
    <div className="dashboard-grid two">
      <section className="panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest workflow events</p></div></div><div className="activity-list">{db.activities.slice(0,6).map(a=><div key={a.id}><i/><div><strong>{a.text}</strong><span>{a.at}</span></div></div>)}</div></section>
      <section className="panel"><div className="panel-head"><div><h3>Pending actions</h3><p>Items requiring governance review</p></div></div><div className="action-summary"><div><span>User registrations</span><Badge tone="amber">{pending}</Badge></div><div><span>Course proposals</span><Badge tone="amber">{db.courses.filter(c=>c.status==="pending").length}</Badge></div><div><span>Enrollment requests</span><Badge tone="amber">{db.enrollments.filter(e=>e.status==="requested").length}</Badge></div><div><span>Unverified trainers</span><Badge tone="gray">{db.trainers.filter(t=>!t.verified).length}</Badge></div></div></section>
    </div>
  </>
}
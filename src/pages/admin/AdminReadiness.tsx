import { AlertTriangle, BrainCircuit, CheckCircle2, Gauge, ShieldCheck } from "lucide-react";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness, trainingImpact } from "../../utils/engine";

export default function AdminReadiness(){
  const {db}=useApp();
  const snapshots=db.trainees.map(t=>({trainee:t,ready:operationalReadiness(db,t.id)})).sort((a,b)=>b.ready.score-a.ready.score);
  const impact=trainingImpact(db);
  const org=snapshots.length?Math.round(snapshots.reduce((s,x)=>s+x.ready.score,0)/snapshots.length):0;
  const highRisk=snapshots.filter(x=>x.ready.score<45).length;
  const subjects=[...new Set(db.competencyRequirements.map(r=>r.subject))];
  const departments=[...new Set(db.trainees.map(t=>t.department))];

  const cell=(department:string,subject:string)=>{
    const ids=db.trainees.filter(t=>t.department===department).map(t=>t.id);
    const scores=db.competencyResults.filter(r=>ids.includes(r.traineeId)&&r.subject===subject).map(r=>r.score);
    if(!scores.length)return null;
    return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  };

  return <>
    <PageHeader title="Operational Readiness Command Center" subtitle="Convert training records into a decision-ready view of who is actually prepared for operational responsibilities."/>
    <div className="innovation-banner"><div><span className="innovation-kicker">SIH DIFFERENTIATOR</span><h2>Operational Readiness Index (ORI)</h2><p>Readiness combines competency assessment, learning completion, post-test performance, trainer-verified evidence and scenario performance. No single course-completion metric can mark a learner ready.</p></div><div className="innovation-score"><strong>{org}</strong><span>Organization ORI</span></div></div>
    <div className="stats-grid compact">
      <StatCard label="Operationally Ready" value={`${impact.readinessRate}%`} icon={<Gauge/>} caption="ORI ≥ 70"/>
      <StatCard label="High-Risk Learners" value={highRisk} icon={<AlertTriangle/>} caption="ORI below 45"/>
      <StatCard label="Evidence Verification" value={`${impact.evidenceRate}%`} icon={<ShieldCheck/>} caption={`${impact.verified} evidence items verified`}/>
      <StatCard label="Avg. Learning Gain" value={`+${impact.avgDelta} pts`} icon={<BrainCircuit/>} caption="Pre-test → post-test"/>
    </div>

    <section className="panel readiness-panel"><div className="panel-head"><div><h3>Personnel readiness radar</h3><p>Prioritized by operational readiness, not course attendance.</p></div><Badge tone="blue">Live prototype index</Badge></div>
      <div className="readiness-list">{snapshots.map(({trainee,ready})=><article key={trainee.id}>
        <div className="readiness-person"><div className="avatar">{trainee.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{trainee.name}</strong><span>{trainee.designation} · {trainee.department}</span></div></div>
        <div className="readiness-meter"><div><span>{ready.band}</span><b>{ready.score}/100</b></div><ProgressBar value={ready.score}/></div>
        <div className="readiness-components"><span title="Competency">C {ready.competency}/30</span><span title="Learning">L {ready.learning}/15</span><span title="Assessment">A {ready.assessment}/25</span><span title="Evidence">E {ready.evidence}/15</span><span title="Scenario">S {ready.scenario}/15</span></div>
      </article>)}</div>
    </section>

    <section className="panel table-panel"><div className="panel-head"><div><h3>Department × competency heatmap</h3><p>Average assessed competency score. Blank means evidence is not yet available—an actionable data gap.</p></div></div><div className="table-scroll"><table className="heatmap-table"><thead><tr><th>Department</th>{subjects.map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{departments.map(d=><tr key={d}><td><strong>{d}</strong></td>{subjects.map(s=>{const score=cell(d,s);return <td key={s}>{score===null?<span className="heat-empty">No data</span>:<span className={`heat-cell heat-${score>=75?"high":score>=50?"mid":"low"}`}>{score}%</span>}</td>})}</tr>)}</tbody></table></div></section>

    <section className="panel"><div className="panel-head"><div><h3>Readiness governance rules</h3><p>Transparent conditions keep recommendations and verification auditable.</p></div></div><div className="rule-grid"><article><CheckCircle2/><strong>Knowledge</strong><span>Role-based competency assessment establishes the baseline.</span></article><article><CheckCircle2/><strong>Learning</strong><span>Assigned modules must be completed and tracked.</span></article><article><CheckCircle2/><strong>Evidence</strong><span>An operational artifact must be reviewed by a verified trainer.</span></article><article><CheckCircle2/><strong>Scenario</strong><span>Decision-making is tested in a job-relevant situation.</span></article></div></section>
  </>
}

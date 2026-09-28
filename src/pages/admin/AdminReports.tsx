import { Download, Printer } from "lucide-react";
import { CompetencyChart, ParticipationChart } from "../../components/Charts";
import { PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { trainingImpact } from "../../utils/engine";

export default function AdminReports(){
  const {db,notify}=useApp();const impact=trainingImpact(db);
  const csv=()=>{
    const rows=[["Metric","Value"],["Trainees",db.trainees.length],["Trainers",db.trainers.length],["Courses",db.courses.length],["Enrollments",db.enrollments.length],["Certificates",db.certificates.length],["Readiness rate",`${impact.readinessRate}%`],["Verified evidence",impact.verified],["Knowledge assets",db.knowledgeAssets.length]];
    const blob=new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="capacity-connect-report.csv";a.click();URL.revokeObjectURL(a.href);notify("CSV report exported");
  };
  return <><PageHeader title="Reports & Analytics" subtitle="Participation, completion, assessment improvement and competency trends." actions={<div className="page-actions"><button className="btn btn-secondary" onClick={()=>window.print()}><Printer size={16}/> Print / PDF</button><button className="btn btn-primary" onClick={csv}><Download size={16}/> Export CSV</button></div>}/>
    <div className="dashboard-grid two"><section className="panel"><div className="panel-head"><div><h3>Training participation</h3><p>Department distribution</p></div></div><ParticipationChart/></section><section className="panel"><div className="panel-head"><div><h3>Competency improvement</h3><p>Verified learning trend</p></div></div><CompetencyChart/></section></div>
    <div className="report-grid">{[
      ["Course completion","78%","Across active prototype enrollments"],
      ["Pre → Post improvement",`+${impact.avgDelta} pts`,"Average verified learning uplift"],
      ["Trainer effectiveness","4.7 / 5","Average verified trainer rating"],
      ["Operational readiness",`${impact.readinessRate}%`,"Personnel at ORI 70 or above"],
      ["Evidence verification",`${impact.evidenceRate}%`,"Operational evidence reviewed"],
      ["Knowledge continuity",String(db.knowledgeAssets.length),"Expert assets preserved"],
      ["Certificates issued",String(db.certificates.length),"Verification-backed certificates"],
      ["Training participation","82%","Sample reporting indicator"]
    ].map(([a,b,c])=><article className="report-card" key={a}><span>{a}</span><strong>{b}</strong><p>{c}</p></article>)}</div>
    <section className="panel"><div className="panel-head"><div><h3>Assessment comparison</h3><p>Pre-test versus post-test results</p></div></div><div className="comparison-list"><div><span>Operational NWP</span><b>Pre-test 50%</b><i>→</i><b className="positive">Post-test 100%</b></div><div><span>Satellite Meteorology</span><b>Pre-test 44%</b><i>→</i><b className="positive">Post-test 81%</b></div><div><span>Climate Data</span><b>Pre-test 58%</b><i>→</i><b className="positive">Post-test 86%</b></div></div></section>
  </>
}
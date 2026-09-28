import { Archive, ArrowLeft, ArrowRight, BrainCircuit, FileCheck2, Gauge, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

export default function JudgeDemo(){
  const {login}=useApp();const navigate=useNavigate();
  const open=(role:Role,path:string)=>{const r=login(`${role}@capacityconnect.in`,"Demo@123");if(r.ok)navigate(path)};
  const steps=[
    {n:"01",title:"Show the gap",body:"Open the Trainee competency check and explain that training starts from a role-specific competency requirement, not a generic course catalog.",role:"trainee" as Role,path:"/trainee/competency",icon:<BrainCircuit/>},
    {n:"02",title:"Show explainable matching",body:"Open Recommendations. Each match exposes the score contribution from competency alignment, trainer expertise, verification, rating, availability and trainer load.",role:"trainee" as Role,path:"/trainee/recommendations",icon:<Sparkles/>},
    {n:"03",title:"Prove application",body:"Open Scenario Lab to show job-relevant decision simulation, then explain that MCQ completion alone cannot mark someone capable.",role:"trainee" as Role,path:"/trainee/scenarios",icon:<Radar/>},
    {n:"04",title:"Verify evidence",body:"Switch to Trainer Evidence Review. A verified trainer reviews an operational task, case report, simulation or dataset review before sign-off.",role:"trainer" as Role,path:"/trainer/evidence",icon:<FileCheck2/>},
    {n:"05",title:"Show organizational readiness",body:"Switch to Admin Readiness Command. Demonstrate the Operational Readiness Index and department × competency heatmap for decision-makers.",role:"admin" as Role,path:"/admin/readiness",icon:<Gauge/>},
    {n:"06",title:"End with the Capability Passport",body:"Return to the Trainee and show a portable evidence-backed record with readiness composition, evidence ledger and verifiable credentials.",role:"trainee" as Role,path:"/trainee/passport",icon:<ShieldCheck/>}
  ];
  return <div className="judge-page"><header className="judge-header"><Link to="/" className="back-link"><ArrowLeft/> Back to homepage</Link><div className="judge-brand"><span>CC</span><div><strong>CAPACITY CONNECT</strong><small>SIH Judge Demo Mode</small></div></div><Link className="btn btn-secondary" to="/login">Normal login</Link></header>
    <main className="judge-main"><section className="judge-hero"><span className="eyebrow">SMART INDIA HACKATHON · 5-MINUTE DEMO PATH</span><h1>Don’t demo another LMS. Demo the journey from <em>competency gap to operational readiness.</em></h1><p>This guided mode opens the exact screens that explain the differentiator quickly. Demo credentials are applied automatically for the selected role.</p><div className="judge-chips"><span><BrainCircuit/> Gap intelligence</span><span><FileCheck2/> Evidence verification</span><span><Gauge/> Readiness index</span><span><Archive/> Knowledge continuity</span></div></section>
      <section className="judge-compare"><div><span>Typical LMS stops at</span><strong>Enroll → Learn → Quiz → Certificate</strong></div><ArrowRight/><div className="judge-compare-highlight"><span>CAPACITY CONNECT continues to</span><strong>Evidence → Scenario → Verification → Readiness → Capability Passport</strong></div></section>
      <section className="judge-steps"><div className="section-head-row"><div><div className="section-kicker">RECOMMENDED PRESENTATION FLOW</div><h2>Six screens that tell the complete story</h2></div></div>{steps.map(s=><article key={s.n}><div className="judge-step-icon">{s.icon}</div><span className="judge-step-no">{s.n}</span><div><h3>{s.title}</h3><p>{s.body}</p></div><button className="btn btn-primary" onClick={()=>open(s.role,s.path)}>Open as {s.role}<ArrowRight size={15}/></button></article>)}</section>
      <section className="judge-proof"><div><span className="section-kicker">CORE SELECTION MESSAGE</span><h2>Course completion is an activity. Capability is an evidence-backed outcome.</h2><p>The prototype separates those two concepts and gives Admin a transparent way to see readiness, Trainer a governed way to verify application, and Trainee a portable record of proven capability.</p></div><div className="judge-proof-score"><strong>5</strong><span>signals in ORI</span><small>Competency · Learning · Assessment · Evidence · Scenario</small></div></section>
    </main></div>
}

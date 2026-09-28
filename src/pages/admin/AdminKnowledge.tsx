import { Archive, BookOpenCheck, BrainCircuit, ShieldAlert } from "lucide-react";
import { Badge, PageHeader, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function AdminKnowledge(){
  const {db}=useApp();
  const critical=db.knowledgeAssets.filter(a=>a.criticality==="Mission Critical");
  const highRisk=db.knowledgeAssets.filter(a=>a.successorRisk==="High");
  const subjects=[...new Set(db.knowledgeAssets.map(a=>a.subject))];
  return <>
    <PageHeader title="Knowledge Continuity Vault" subtitle="Preserve hard-to-replace operational expertise before it is lost through transfer, retirement or role changes."/>
    <div className="stats-grid compact"><StatCard label="Captured Assets" value={db.knowledgeAssets.length} icon={<Archive/>}/><StatCard label="Mission Critical" value={critical.length} icon={<ShieldAlert/>}/><StatCard label="High Successor Risk" value={highRisk.length} icon={<BrainCircuit/>}/><StatCard label="Covered Domains" value={subjects.length} icon={<BookOpenCheck/>}/></div>
    <div className="innovation-banner knowledge"><div><span className="innovation-kicker">KNOWLEDGE RETENTION ENGINE</span><h2>Training content tells people what to learn. The Vault preserves how experts actually work.</h2><p>Expert debriefs, case archives and operational playbooks become reusable institutional knowledge, tagged by criticality and successor risk.</p></div></div>
    <section className="vault-grid">{db.knowledgeAssets.map(a=>{const trainer=db.trainers.find(t=>t.id===a.trainerId);return <article className="vault-card" key={a.id}><div className="vault-top"><Badge tone={a.criticality==="Mission Critical"?"red":a.criticality==="Important"?"amber":"gray"}>{a.criticality}</Badge><Badge tone={a.successorRisk==="High"?"red":a.successorRisk==="Medium"?"amber":"green"}>Succession risk: {a.successorRisk}</Badge></div><span className="eyebrow">{a.type} · {a.subject}</span><h3>{a.title}</h3><p>{a.summary}</p><div className="vault-meta"><span>Captured by <strong>{trainer?.name}</strong></span><span>{a.capturedAt}</span></div></article>})}</section>
  </>
}

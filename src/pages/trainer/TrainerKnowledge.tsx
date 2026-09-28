import { FormEvent, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { KnowledgeAsset } from "../../types";

export default function TrainerKnowledge(){
  const {db,currentUser,addKnowledgeAsset}=useApp();
  const trainer=db.trainers.find(t=>t.userId===currentUser?.id);
  const mine=db.knowledgeAssets.filter(a=>a.trainerId===trainer?.id);
  const [form,setForm]=useState({title:"",subject:trainer?.subjects[0]||"Numerical Weather Prediction",type:"Expert Debrief" as KnowledgeAsset["type"],criticality:"Important" as KnowledgeAsset["criticality"],successorRisk:"Medium" as KnowledgeAsset["successorRisk"],summary:""});
  const submit=(e:FormEvent)=>{e.preventDefault();if(!form.title.trim()||!form.summary.trim())return;addKnowledgeAsset({...form,trainerId:trainer?.id||"",status:"published"});setForm({...form,title:"",summary:""})};
  return <><PageHeader title="Expert Knowledge Capture" subtitle="Turn tacit operational experience into reusable institutional knowledge for future batches and successors."/>
    <section className="panel"><div className="panel-head"><div><h3>Capture a knowledge asset</h3><p>Use for lessons that are difficult to obtain from standard manuals or course material.</p></div></div><form className="knowledge-form" onSubmit={submit}><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Monsoon model-bias debrief"/></label><label>Subject<input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>Format<select value={form.type} onChange={e=>setForm({...form,type:e.target.value as KnowledgeAsset["type"]})}><option>Expert Debrief</option><option>Playbook</option><option>Case Archive</option><option>Recorded Walkthrough</option></select></label><label>Criticality<select value={form.criticality} onChange={e=>setForm({...form,criticality:e.target.value as KnowledgeAsset["criticality"]})}><option>Standard</option><option>Important</option><option>Mission Critical</option></select></label><label>Successor risk<select value={form.successorRisk} onChange={e=>setForm({...form,successorRisk:e.target.value as KnowledgeAsset["successorRisk"]})}><option>Low</option><option>Medium</option><option>High</option></select></label><label className="form-span">Summary<textarea required rows={4} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} placeholder="Capture the operational insight, decision checkpoints and lessons learned..."/></label><div className="form-span"><button className="btn btn-primary">Publish to Knowledge Vault</button></div></form></section>
    <section className="vault-grid compact-vault">{mine.map(a=><article className="vault-card" key={a.id}><div className="vault-top"><Badge tone={a.criticality==="Mission Critical"?"red":"amber"}>{a.criticality}</Badge><Badge tone={a.successorRisk==="High"?"red":"gray"}>Risk {a.successorRisk}</Badge></div><span className="eyebrow">{a.type} · {a.subject}</span><h3>{a.title}</h3><p>{a.summary}</p></article>)}</section>
  </>
}

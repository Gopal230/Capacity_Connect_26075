import { useState } from "react";
import { Badge, EmptyState, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function TrainerEvidence(){
  const {db,currentUser,reviewEvidence}=useApp();
  const trainer=db.trainers.find(t=>t.userId===currentUser?.id);
  const courseIds=db.courses.filter(c=>c.trainerId===trainer?.id).map(c=>c.id);
  const evidence=db.evidence.filter(e=>courseIds.includes(e.courseId));
  const [scores,setScores]=useState<Record<string,string>>({});
  const [notes,setNotes]=useState<Record<string,string>>({});
  return <>
    <PageHeader title="Capability Evidence Review" subtitle="Verify whether learners can apply knowledge in a realistic task—not merely pass an MCQ."/>
    <div className="evidence-flow"><span>Course complete</span><b>→</b><span>Post-test passed</span><b>→</b><span className="active">Operational evidence</span><b>→</b><span>Trainer sign-off</span><b>→</b><span>Capability passport</span></div>
    <section className="evidence-stack">{evidence.map(e=>{const t=db.trainees.find(x=>x.id===e.traineeId);const c=db.courses.find(x=>x.id===e.courseId);return <article className="evidence-review" key={e.id}><div className="evidence-main"><div><Badge tone={e.status==="verified"?"green":e.status==="revision"?"red":"amber"}>{e.status}</Badge><span className="eyebrow">{e.type} · {e.subject}</span><h3>{e.title}</h3><p>{t?.name} · {t?.designation} · {c?.title}</p></div><div className="evidence-score">{e.score!==undefined?<><strong>{e.score}</strong><span>/100 verified</span></>:<><strong>—</strong><span>awaiting score</span></>}</div></div>{e.status==="submitted"&&<div className="review-form"><label>Evidence score<input type="number" min="0" max="100" value={scores[e.id]||"85"} onChange={x=>setScores(v=>({...v,[e.id]:x.target.value}))}/></label><label>Reviewer note<input value={notes[e.id]||""} onChange={x=>setNotes(v=>({...v,[e.id]:x.target.value}))} placeholder="What was demonstrated?"/></label><div className="review-actions"><button className="btn btn-secondary" onClick={()=>reviewEvidence(e.id,"revision",Number(scores[e.id]||70),notes[e.id]||"Please strengthen the operational reasoning and resubmit.")}>Request revision</button><button className="btn btn-primary" onClick={()=>reviewEvidence(e.id,"verified",Number(scores[e.id]||85),notes[e.id]||"Operational capability demonstrated successfully.")}>Verify evidence</button></div></div>}{e.note&&<div className="review-note"><strong>Reviewer note</strong><span>{e.note}</span></div>}</article>})}{!evidence.length&&<EmptyState title="No evidence submitted" body="Evidence from trainees enrolled in your courses will appear here."/>}</section>
  </>
}

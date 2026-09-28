import { FormEvent, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { OperationalScenario } from "../../types";

export default function ScenarioLab(){
  const {db,currentUser,submitScenario}=useApp();
  const trainee=db.trainees.find(t=>t.userId===currentUser?.id);
  const scenarios=db.scenarios.filter(s=>s.role===trainee?.designation||s.subject===Object.keys(trainee?.skills||{})[0]||true);
  const [active,setActive]=useState<OperationalScenario|null>(null);const [answers,setAnswers]=useState<number[]>([]);const [result,setResult]=useState<{score:number;band:string}|null>(null);
  const submit=(e:FormEvent)=>{e.preventDefault();if(!active)return;const r=submitScenario(active.id,answers);if(r)setResult({score:r.score,band:r.readinessBand});setActive(null);setAnswers([])};
  return <><PageHeader title="Operational Scenario Lab" subtitle="Practice job-relevant decisions under realistic constraints. Scenario performance contributes to your Operational Readiness Index."/>
    {result&&<div className={result.score>=70?"success-banner":"warning-banner"}><strong>Scenario readiness: {result.score}% — {result.band}</strong><span>The result is saved in your capability record and readiness profile.</span></div>}
    <div className="scenario-grid">{scenarios.map(s=>{const attempts=db.scenarioAttempts.filter(a=>a.traineeId===trainee?.id&&a.scenarioId===s.id);const best=attempts.length?Math.max(...attempts.map(a=>a.score)):null;return <article className="scenario-card" key={s.id}><div className="scenario-top"><Badge tone={s.difficulty==="Advanced"?"red":"blue"}>{s.difficulty}</Badge>{best!==null&&<Badge tone={best>=s.passingPercentage?"green":"amber"}>Best {best}%</Badge>}</div><span className="eyebrow">{s.subject} · {s.steps.length} decisions</span><h3>{s.title}</h3><p>{s.context}</p><div className="scenario-footer"><span>Pass threshold {s.passingPercentage}%</span><button className="btn btn-primary" onClick={()=>{setActive(s);setAnswers([])}}>{attempts.length?"Run again":"Start simulation"}</button></div></article>})}</div>
    {active&&<div className="modal-backdrop"><form className="modal-card scenario-modal" onSubmit={submit}><div className="panel-head"><div><Badge tone="blue">Operational simulation</Badge><h3>{active.title}</h3><p>{active.context}</p></div></div>{active.steps.map((q,i)=><fieldset className="question-card compact-q" key={q.id}><legend>{i+1}. {q.prompt}</legend>{q.options.map((o,j)=><label className={answers[i]===j?"selected":""} key={o}><input type="radio" name={q.id} checked={answers[i]===j} onChange={()=>{const a=[...answers];a[i]=j;setAnswers(a)}} required/>{o}</label>)}</fieldset>)}<div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setActive(null)}>Exit</button><button className="btn btn-primary">Submit operational decisions</button></div></form></div>}
  </>
}

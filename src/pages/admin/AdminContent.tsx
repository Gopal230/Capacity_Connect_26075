import { FormEvent, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { Role } from "../../types";

export default function AdminContent(){
  const {db,addNotification}=useApp(); const [form,setForm]=useState({title:"",body:"",type:"announcement" as "announcement"|"achievement"|"course"|"resource"|"deadline",audience:"all" as "all"|Role});
  const submit=(e:FormEvent)=>{e.preventDefault();addNotification(form);setForm({...form,title:"",body:""})};
  return <><PageHeader title="Content & Notifications" subtitle="Publish announcements, achievements, new courses, resources and deadlines."/>
    <div className="dashboard-grid content-layout"><section className="panel"><div className="panel-head"><div><h3>Publish update</h3><p>Visible to selected audience</p></div></div><form className="stack-form" onSubmit={submit}><label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></label><label>Message<textarea rows={5} value={form.body} onChange={e=>setForm({...form,body:e.target.value})} required/></label><div className="form-grid two"><label>Type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})}><option>announcement</option><option>achievement</option><option>course</option><option>resource</option><option>deadline</option></select></label><label>Audience<select value={form.audience} onChange={e=>setForm({...form,audience:e.target.value as any})}><option>all</option><option>admin</option><option>trainer</option><option>trainee</option></select></label></div><button className="btn btn-primary">Publish notification</button></form></section>
      <section className="panel"><div className="panel-head"><div><h3>Published content</h3><p>Newest first</p></div></div><div className="notification-list">{db.notifications.map(n=><article key={n.id}><div><Badge tone="blue">{n.type}</Badge><Badge tone="gray">{n.audience}</Badge></div><h4>{n.title}</h4><p>{n.body}</p><small>{n.publishedAt}</small></article>)}</div></section></div>
  </>
}
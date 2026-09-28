import { ArrowLeft, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function RegisterPage(){
  const {register}=useApp();
  const [form,setForm]=useState({name:"",email:"",password:"",role:"trainee" as "trainer"|"trainee",department:"",designation:""});
  const [message,setMessage]=useState<{ok:boolean;text:string}|null>(null);
  const submit=(e:FormEvent)=>{e.preventDefault();const r=register(form);setMessage({ok:r.ok,text:r.message});if(r.ok)setForm({name:"",email:"",password:"",role:"trainee",department:"",designation:""})};
  return <div className="auth-page"><div className="auth-side"><Link to="/" className="back-link"><ArrowLeft/> Back to homepage</Link><div><span className="eyebrow light">REGISTRATION WORKFLOW</span><h1>Register first. Access after Admin approval.</h1><p>Trainer and Trainee self-registration is intentionally governed. New accounts remain in Pending Approval until reviewed by the Admin.</p></div></div>
    <div className="auth-card-wrap"><form className="auth-card wide" onSubmit={submit}><div className="auth-logo"><UserPlus/></div><h2>Create registration</h2><p>Submit your professional details for review.</p>
      <div className="form-grid two"><label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label>
      <label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value as any})}><option value="trainee">Trainee</option><option value="trainer">Trainer</option></select></label><label>Password<input type="password" minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label>
      <label>Department<input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} required placeholder="e.g. Forecasting"/></label><label>Designation<input value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})} required placeholder="e.g. Scientific Assistant"/></label></div>
      {message&&<div className={message.ok?"form-success":"form-error"}>{message.text}</div>}<button className="btn btn-primary btn-block">Submit for Admin approval</button><p className="auth-switch">Already approved? <Link to="/login">Sign in</Link></p>
    </form></div></div>
}
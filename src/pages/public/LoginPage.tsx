import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function LoginPage(){
  const {login}=useApp(); const navigate=useNavigate();
  const [email,setEmail]=useState("admin@capacityconnect.in"); const [password,setPassword]=useState("Demo@123"); const [show,setShow]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const submit=(e:FormEvent)=>{e.preventDefault();setLoading(true);setError("");window.setTimeout(()=>{const r=login(email,password);setLoading(false);if(!r.ok)return setError(r.message);navigate(`/${r.role}`)},350)};
  const useDemo=(role:"admin"|"trainer"|"trainee")=>{setEmail(`${role}@capacityconnect.in`);setPassword("Demo@123");setError("")};
  return <div className="auth-page"><div className="auth-side"><Link to="/" className="back-link"><ArrowLeft/> Back to homepage</Link><div><span className="eyebrow light">CAPACITY CONNECT</span><h1>Secure role-based access for capacity building.</h1><p>Use one of the demo accounts to test Admin, Trainer and Trainee workflows.</p><div className="auth-points"><span>✓ Pending registrations cannot log in</span><span>✓ Each role has protected routes</span><span>✓ Sessions persist in local storage</span></div></div></div>
    <div className="auth-card-wrap"><form className="auth-card" onSubmit={submit}><div className="auth-logo"><LockKeyhole/></div><h2>Sign in</h2><p>Access your CAPACITY CONNECT workspace.</p>
      <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Password<div className="password-field"><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
      {error&&<div className="form-error">{error}</div>}<button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading?"Authenticating...":"Sign in"}</button>
      <div className="demo-box"><strong>Demo accounts</strong><div><button type="button" onClick={()=>useDemo("admin")}>Admin</button><button type="button" onClick={()=>useDemo("trainer")}>Trainer</button><button type="button" onClick={()=>useDemo("trainee")}>Trainee</button></div><small>Password for all: Demo@123</small></div>
      <p className="auth-switch">New user? <Link to="/register">Register for approval</Link></p>
    </form></div></div>
}
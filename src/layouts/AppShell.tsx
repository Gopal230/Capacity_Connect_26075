import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Archive, Award, BarChart3, Bell, BookOpen, BrainCircuit, ClipboardCheck, FileCheck2, Gauge, GraduationCap, Home, Library, LogOut, Menu, Radar, Settings2, ShieldCheck, UserCheck, Users, X, WifiOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";

const nav: Record<Role,{to:string;label:string;icon:ReactNode}[]> = {
  admin:[
    {to:"/admin",label:"Command Center",icon:<Home/>},
    {to:"/admin/users",label:"Personnel Clearance",icon:<UserCheck/>},
    {to:"/admin/trainers",label:"Faculty Governance",icon:<Users/>},
    {to:"/admin/courses",label:"Curricula Catalog",icon:<BookOpen/>},
    {to:"/admin/media",label:"Asset Repository",icon:<Library/>},
    {to:"/admin/competencies",label:"Competency Matrix",icon:<BrainCircuit/>},
    {to:"/admin/reports",label:"Institutional Analytics",icon:<BarChart3/>},
    {to:"/admin/readiness",label:"Operational Readiness",icon:<Gauge/>},
    {to:"/admin/knowledge",label:"Institutional Memory",icon:<Archive/>},
    {to:"/admin/content",label:"Bulletins & Advisories",icon:<Bell/>}
  ],
  trainer:[
    {to:"/trainer",label:"Faculty Workspace",icon:<Home/>},
    {to:"/trainer/profile",label:"Faculty Dossier",icon:<ShieldCheck/>},
    {to:"/trainer/courses",label:"Program Authoring",icon:<BookOpen/>},
    {to:"/trainer/library",label:"Instructional Media",icon:<Library/>},
    {to:"/trainer/assessments",label:"Exam Repository",icon:<ClipboardCheck/>},
    {to:"/trainer/trainees",label:"Cohort Analytics",icon:<Users/>},
    {to:"/trainer/evidence",label:"Practical Submissions",icon:<FileCheck2/>},
    {to:"/trainer/knowledge",label:"Technical Playbooks",icon:<Archive/>}
  ],
  trainee:[
    {to:"/trainee",label:"Officer Dashboard",icon:<Home/>},
    {to:"/trainee/profile",label:"Service Dossier",icon:<Users/>},
    {to:"/trainee/competency",label:"Diagnostic Benchmark",icon:<BrainCircuit/>},
    {to:"/trainee/recommendations",label:"Curated Pathways",icon:<Settings2/>},
    {to:"/trainee/learning",label:"Active Curricula",icon:<GraduationCap/>},
    {to:"/trainee/assessments",label:"Qualifying Exams",icon:<ClipboardCheck/>},
    {to:"/trainee/scenarios",label:"Simulation Deck",icon:<Radar/>},
    {to:"/trainee/passport",label:"Credential Transcript",icon:<ShieldCheck/>},
    {to:"/trainee/certificates",label:"Accredited Certifications",icon:<Award/>}
  ]
};

export default function AppShell({children,role}:{children:ReactNode;role:Role}){
  const {currentUser,logout,toast}=useApp();
  const [open,setOpen]=useState(false);
  const [lite,setLite]=useState(()=>localStorage.getItem("capacityConnectLite")==="1");
  const navigate=useNavigate();
  useEffect(()=>{document.body.classList.toggle("lite-mode",lite)},[lite]);
  const toggleLite=()=>{const next=!lite;setLite(next);localStorage.setItem("capacityConnectLite",next?"1":"0");document.body.classList.toggle("lite-mode",next)};
  return <div className="app-shell">
    <aside className={`sidebar ${open?"open":""}`}>
      <div className="brand"><div className="brand-mark">IMD</div><div><strong>METEO-ACADEMY</strong><span>National Meteorological Institute</span></div><button className="sidebar-close" onClick={()=>setOpen(false)}><X/></button></div>
      <nav>{nav[role].map(item=><NavLink end={item.to===`/${role}`} key={item.to} to={item.to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"active":""}>{item.icon}<span>{item.label}</span></NavLink>)}</nav>
      <div className="sidebar-footer"><div className="mini-user"><div className="avatar">{currentUser?.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{currentUser?.name}</strong><span>{role.toUpperCase()}</span></div></div><button className="logout-btn" onClick={()=>{logout();navigate("/login")}}><LogOut size={18}/> Sign out</button></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><button className="menu-btn" onClick={()=>setOpen(true)}><Menu/></button><div><strong>National Institute of Meteorological Training & Research</strong><span>Ministry of Earth Sciences · Government of India</span></div><div className="top-actions"><button className={`lite-toggle ${lite?"active":""}`} onClick={toggleLite} title="Reduce visual load for low-bandwidth use"><WifiOff size={15}/><span>{lite?"Field Mode ON":"Field Mode"}</span></button><span className="system-status"><i/> Portal Online</span><div className="avatar small">{currentUser?.name.charAt(0)}</div></div></header>
      <main className="page-content">{children}</main>
    </div>
    {open&&<div className="sidebar-overlay" onClick={()=>setOpen(false)}/>}
    {toast&&<div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
  </div>
}
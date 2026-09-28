import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Archive, Award, BarChart3, Bell, BookOpen, BrainCircuit, ClipboardCheck, FileCheck2, Gauge, GraduationCap, Home, Library, LogOut, Menu, Radar, Settings2, ShieldCheck, UserCheck, Users, X, WifiOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";

const nav: Record<Role,{to:string;label:string;icon:ReactNode}[]> = {
  admin:[
    {to:"/admin",label:"Dashboard",icon:<Home/>},
    {to:"/admin/users",label:"User Approval",icon:<UserCheck/>},
    {to:"/admin/trainers",label:"Trainer Management",icon:<Users/>},
    {to:"/admin/courses",label:"Course Management",icon:<BookOpen/>},
    {to:"/admin/media",label:"Media Governance",icon:<Library/>},
    {to:"/admin/competencies",label:"Competencies",icon:<BrainCircuit/>},
    {to:"/admin/reports",label:"Reports & Analytics",icon:<BarChart3/>},
    {to:"/admin/readiness",label:"Readiness Command",icon:<Gauge/>},
    {to:"/admin/knowledge",label:"Knowledge Continuity",icon:<Archive/>},
    {to:"/admin/content",label:"Content & Notifications",icon:<Bell/>}
  ],
  trainer:[
    {to:"/trainer",label:"Dashboard",icon:<Home/>},
    {to:"/trainer/profile",label:"Professional Profile",icon:<ShieldCheck/>},
    {to:"/trainer/courses",label:"Courses & Content",icon:<BookOpen/>},
    {to:"/trainer/library",label:"Trainer Library",icon:<Library/>},
    {to:"/trainer/assessments",label:"Assessments",icon:<ClipboardCheck/>},
    {to:"/trainer/trainees",label:"Trainee Monitoring",icon:<Users/>},
    {to:"/trainer/evidence",label:"Evidence Review",icon:<FileCheck2/>},
    {to:"/trainer/knowledge",label:"Knowledge Capture",icon:<Archive/>}
  ],
  trainee:[
    {to:"/trainee",label:"Dashboard",icon:<Home/>},
    {to:"/trainee/profile",label:"Professional Profile",icon:<Users/>},
    {to:"/trainee/competency",label:"Competency Check",icon:<BrainCircuit/>},
    {to:"/trainee/recommendations",label:"Recommendations",icon:<Settings2/>},
    {to:"/trainee/learning",label:"My Learning",icon:<GraduationCap/>},
    {to:"/trainee/assessments",label:"Assessments",icon:<ClipboardCheck/>},
    {to:"/trainee/scenarios",label:"Scenario Lab",icon:<Radar/>},
    {to:"/trainee/passport",label:"Capability Passport",icon:<ShieldCheck/>},
    {to:"/trainee/certificates",label:"Certificates",icon:<Award/>}
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
      <div className="brand"><div className="brand-mark imd-mark">IMD</div><div><strong>CAPACITY CONNECT</strong><span>Ministry of Earth Sciences · India Meteorological Department</span></div><button className="sidebar-close" onClick={()=>setOpen(false)}><X/></button></div>
      <nav>{nav[role].map(item=><NavLink end={item.to===`/${role}`} key={item.to} to={item.to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"active":""}>{item.icon}<span>{item.label}</span></NavLink>)}</nav>
      <div className="sidebar-footer"><div className="mini-user"><div className="avatar">{currentUser?.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><strong>{currentUser?.name}</strong><span>{role.toUpperCase()}</span></div></div><button className="logout-btn" onClick={()=>{logout();navigate("/login")}}><LogOut size={18}/> Sign out</button></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><button className="menu-btn" onClick={()=>setOpen(true)}><Menu/></button><div><strong>IMD Meteorological Capacity & Readiness Centre</strong><span>Forecasting · Radar · Satellite · Climate · Warnings · Observations</span></div><div className="top-actions"><button className={`lite-toggle ${lite?"active":""}`} onClick={toggleLite} title="Reduce visual/data load for low-bandwidth use"><WifiOff size={15}/><span>{lite?"Low-bandwidth ON":"Field mode"}</span></button><span className="system-status"><i/> Prototype Online</span><div className="avatar small">{currentUser?.name.charAt(0)}</div></div></header>
      <main className="page-content">{children}</main>
    </div>
    {open&&<div className="sidebar-overlay" onClick={()=>setOpen(false)}/>}
    {toast&&<div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
  </div>
}
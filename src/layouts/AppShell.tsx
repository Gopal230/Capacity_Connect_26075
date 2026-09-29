import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Archive, Award, BarChart3, Bell, BookOpen, BrainCircuit, ChevronLeft, ChevronRight, ClipboardCheck, FileCheck2, Gauge, GraduationCap, Home, Library, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Radar, Settings2, ShieldCheck, UserCheck, Users, X, WifiOff } from "lucide-react";
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
    {to:"/trainee/scenarios",label:"Practical Lab Assessment",icon:<Radar/>},
    {to:"/trainee/passport",label:"Capability Passport",icon:<ShieldCheck/>},
    {to:"/trainee/certificates",label:"Certificates",icon:<Award/>}
  ]
};

export default function AppShell({children,role}:{children:ReactNode;role:Role}){
  const {currentUser,logout,toast}=useApp();
  const [open,setOpen]=useState(false);
  const [minimized,setMinimized]=useState(()=>localStorage.getItem("capacityConnectSidebarMinimized")==="1");
  const [lite,setLite]=useState(()=>localStorage.getItem("capacityConnectLite")==="1");
  const navigate=useNavigate();

  useEffect(()=>{document.body.classList.toggle("lite-mode",lite)},[lite]);
  const toggleLite=()=>{const next=!lite;setLite(next);localStorage.setItem("capacityConnectLite",next?"1":"0");document.body.classList.toggle("lite-mode",next)};
  const toggleMinimized=()=>{const next=!minimized;setMinimized(next);localStorage.setItem("capacityConnectSidebarMinimized",next?"1":"0")};

  return <div className="app-shell">
    <aside className={`sidebar ${open?"open":""} ${minimized?"minimized":""}`}>
      <div className="brand">
        <div className="brand-mark" title="Capacity Connect">CC</div>
        {!minimized&&<div><strong>CAPACITY CONNECT</strong><span>Operational Capacity & Learning Portal</span></div>}
        <button className="sidebar-collapse-btn" onClick={toggleMinimized} title={minimized?"Expand sidebar":"Collapse sidebar"}>
          {minimized?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}
        </button>
        <button className="sidebar-close" onClick={()=>setOpen(false)}><X size={18}/></button>
      </div>

      <nav>
        {nav[role].map(item=>(
          <NavLink
            end={item.to===`/${role}`}
            key={item.to}
            to={item.to}
            onClick={()=>setOpen(false)}
            title={minimized?item.label:undefined}
            className={({isActive})=>isActive?"active":""}
          >
            {item.icon}
            {!minimized&&<span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="mini-user" title={minimized?`${currentUser?.name} (${role.toUpperCase()})`:undefined}>
          <div className="avatar">{currentUser?.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
          {!minimized&&<div><strong>{currentUser?.name}</strong><span>{role.toUpperCase()}</span></div>}
        </div>
        <button className="logout-btn" onClick={()=>{logout();navigate("/login")}} title="Sign out">
          <LogOut size={18}/>
          {!minimized&&<span>Sign out</span>}
        </button>
      </div>
    </aside>

    <div className={`main-wrap ${minimized?"minimized":""}`}>
      <header className="topbar">
        <button
          className="sidebar-toggle-btn"
          onClick={() => {
            if (window.innerWidth <= 900) {
              setOpen((prev) => !prev);
            } else {
              toggleMinimized();
            }
          }}
          title={minimized ? "Expand navigation sidebar" : "Minimize navigation sidebar"}
          aria-label="Toggle navigation sidebar"
        >
          {minimized ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
        <div><strong>Operational Capacity & Learning Center</strong><span>Ministry of Earth Sciences · India Meteorological Department</span></div>
        <div className="top-actions">
          <button className={`lite-toggle ${lite?"active":""}`} onClick={toggleLite} title="Reduce visual load for low-bandwidth use">
            <WifiOff size={15}/><span>{lite?"Field Mode ON":"Field Mode"}</span>
          </button>
          <span className="system-status"><i/> Portal Online</span>
          <div className="avatar small">{currentUser?.name.charAt(0)}</div>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>

    {open&&<div className="sidebar-overlay" onClick={()=>setOpen(false)}/>}
    {toast&&<div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
  </div>
}
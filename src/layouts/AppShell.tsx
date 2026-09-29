import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Archive, Award, BarChart3, Bell, BookOpen, BrainCircuit, ChevronLeft, ChevronRight, ClipboardCheck, FileCheck2, Gauge, GraduationCap, Home, Library, LogOut, Menu, Radar, Settings2, ShieldCheck, User, UserCheck, Users, X, WifiOff } from "lucide-react";
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
    {to:"/trainer/courses",label:"Courses & Content",icon:<BookOpen/>},
    {to:"/trainer/library",label:"Trainer Library",icon:<Library/>},
    {to:"/trainer/assessments",label:"Assessments",icon:<ClipboardCheck/>},
    {to:"/trainer/trainees",label:"Trainee Monitoring",icon:<Users/>},
    {to:"/trainer/evidence",label:"Evidence Review",icon:<FileCheck2/>},
    {to:"/trainer/knowledge",label:"Knowledge Capture",icon:<Archive/>}
  ],
  trainee:[
    {to:"/trainee",label:"Dashboard",icon:<Home/>},
    {to:"/trainee/competency",label:"Competency Check",icon:<BrainCircuit/>},
    {to:"/trainee/recommendations",label:"Recommendations",icon:<Settings2/>},
    {to:"/trainee/learning",label:"Courses",icon:<GraduationCap/>},
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
  const [profileOpen,setProfileOpen]=useState(false);
  const profileMenuRef=useRef<HTMLDivElement>(null);
  const navigate=useNavigate();

  useEffect(()=>{document.body.classList.toggle("lite-mode",lite)},[lite]);
  const toggleLite=()=>{const next=!lite;setLite(next);localStorage.setItem("capacityConnectLite",next?"1":"0");document.body.classList.toggle("lite-mode",next)};
  const toggleMinimized=()=>{const next=!minimized;setMinimized(next);localStorage.setItem("capacityConnectSidebarMinimized",next?"1":"0")};

  useEffect(()=>{
    const handleOutsideClick=(e:MouseEvent)=>{
      if(profileMenuRef.current&&!profileMenuRef.current.contains(e.target as Node)){
        setProfileOpen(false);
      }
    };
    if(profileOpen){
      document.addEventListener("mousedown",handleOutsideClick);
    }
    return ()=>{
      document.removeEventListener("mousedown",handleOutsideClick);
    };
  },[profileOpen]);

  const profilePath = role === "trainer" ? "/trainer/profile" : role === "trainee" ? "/trainee/profile" : null;

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

    </aside>

    <div className={`main-wrap ${minimized?"minimized":""}`}>
      <header className="topbar">
        <button className="menu-btn" onClick={()=>setOpen(true)}><Menu/></button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <strong>Capacity Connect</strong>
            <span>Operational Capacity & Learning Portal</span>
          </div>

          <span
            style={{
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: "11.5px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "9999px",
              letterSpacing: "0.3px",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "0 2px 6px rgba(220, 38, 38, 0.3)",
            }}
          >
            {role === "trainee" ? "Trainee Flow (7 Steps)" : role === "trainer" ? "Faculty Command" : "Directorate Admin"}
          </span>

          <span
            style={{
              color: "#F59E0B",
              fontSize: "12px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ★ Core Competency Mapping Engine
          </span>
        </div>

        <div className="top-actions">
          {/* Active Persona Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#05101E",
              border: "1px solid #1E293B",
              padding: "3px 6px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, paddingLeft: "4px" }}>
              Active Persona:
            </span>
            <button
              type="button"
              onClick={() => navigate("/trainee")}
              style={{
                background: role === "trainee" ? "#0284C7" : "transparent",
                color: role === "trainee" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                borderRadius: "5px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Trainee
            </button>
            <button
              type="button"
              onClick={() => navigate("/trainer")}
              style={{
                background: role === "trainer" ? "#0284C7" : "transparent",
                color: role === "trainer" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                borderRadius: "5px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              style={{
                background: role === "admin" ? "#0284C7" : "transparent",
                color: role === "admin" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                borderRadius: "5px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Admin
            </button>
          </div>

          <button className={`lite-toggle ${lite?"active":""}`} onClick={toggleLite} title="Reduce visual load for low-bandwidth use">
            <WifiOff size={15}/><span>{lite?"Field Mode ON":"Field Mode"}</span>
          </button>
          <span className="system-status"><i/> Portal Online</span>

          {/* Circular Profile Button with Dropdown */}
          <div className="profile-menu-container" ref={profileMenuRef}>
            <button
              className={`profile-avatar-btn ${profileOpen?"active":""}`}
              onClick={()=>setProfileOpen(!profileOpen)}
              title="Profile and account options"
              aria-expanded={profileOpen}
            >
              <div className="avatar small" style={{ background: "#DC2626", color: "#FFFFFF", fontWeight: 800 }}>
                {currentUser?.name.charAt(0)}
              </div>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <strong>{currentUser?.name}</strong>
                  <span>{currentUser?.email}</span>
                  <span className="profile-dropdown-badge">{role}</span>
                </div>
                {profilePath && (
                  <Link
                    to={profilePath}
                    className="profile-dropdown-item"
                    onClick={()=>setProfileOpen(false)}
                  >
                    <User size={16}/>
                    <span>Personal Profile</span>
                  </Link>
                )}
                <div className="profile-dropdown-divider"/>
                <button
                  className="profile-dropdown-item logout"
                  onClick={()=>{
                    setProfileOpen(false);
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut size={16}/>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>

    {open&&<div className="sidebar-overlay" onClick={()=>setOpen(false)}/>}
    {toast&&<div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
  </div>
}

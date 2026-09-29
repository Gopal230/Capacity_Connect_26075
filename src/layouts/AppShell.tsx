import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Archive,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  GraduationCap,
  Home,
  Library,
  LogOut,
  Menu,
  Radar,
  Settings2,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Users,
  WifiOff,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";

const nav: Record<Role, { to: string; label: string; icon: ReactNode }[]> = {
  trainee: [
    { to: "/trainee", label: "1. Profile", icon: <User size={15} /> },
    { to: "/trainee/learning", label: "2. Browse Courses", icon: <BookOpen size={15} /> },
    { to: "/trainee/competency", label: "3. Competency Check", icon: <BrainCircuit size={15} /> },
    { to: "/trainee/recommendations", label: "4. Recommendations", icon: <Settings2 size={15} /> },
    { to: "/trainee/assessments", label: "5. Assessments", icon: <ClipboardCheck size={15} /> },
    { to: "/trainee/scenarios", label: "6. Practical Lab Assessment", icon: <Radar size={15} /> },
    { to: "/trainee/passport", label: "7. Capability Passport", icon: <ShieldCheck size={15} /> },
    { to: "/trainee/certificates", label: "8. Certificates", icon: <Award size={15} /> }
  ],
  trainer: [
    { to: "/trainer", label: "1. Dashboard", icon: <Home size={15} /> },
    { to: "/trainer/courses", label: "2. Courses & Content", icon: <BookOpen size={15} /> },
    { to: "/trainer/library", label: "3. Trainer Library", icon: <Library size={15} /> },
    { to: "/trainer/assessments", label: "4. Assessments", icon: <ClipboardCheck size={15} /> },
    { to: "/trainer/trainees", label: "5. Trainee Monitoring", icon: <Users size={15} /> },
    { to: "/trainer/evidence", label: "6. Evidence Review", icon: <FileCheck2 size={15} /> },
    { to: "/trainer/knowledge", label: "7. Knowledge Capture", icon: <Archive size={15} /> }
  ],
  admin: [
    { to: "/admin", label: "1. Dashboard", icon: <Home size={15} /> },
    { to: "/admin/users", label: "2. User Approval", icon: <UserCheck size={15} /> },
    { to: "/admin/trainers", label: "3. Trainer Management", icon: <Users size={15} /> },
    { to: "/admin/courses", label: "4. Course Management", icon: <BookOpen size={15} /> },
    { to: "/admin/media", label: "5. Media Governance", icon: <Library size={15} /> },
    { to: "/admin/competencies", label: "6. Competencies", icon: <BrainCircuit size={15} /> },
    { to: "/admin/reports", label: "7. Reports & Analytics", icon: <BarChart3 size={15} /> },
    { to: "/admin/readiness", label: "8. Readiness Command", icon: <Gauge size={15} /> },
    { to: "/admin/knowledge", label: "9. Knowledge Continuity", icon: <Archive size={15} /> },
    { to: "/admin/content", label: "10. Content & Notifications", icon: <Bell size={15} /> }
  ]
};

const FLOW_STEPS: Record<Role, string> = {
  trainee: "Trainee Flow (8 Steps)",
  trainer: "Trainer Flow (7 Steps)",
  admin: "Admin Flow (10 Steps)"
};

export default function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { currentUser, logout, login, toast } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lite, setLite] = useState(() => localStorage.getItem("capacityConnectLite") === "1");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("lite-mode", lite);
  }, [lite]);

  const toggleLite = () => {
    const next = !lite;
    setLite(next);
    localStorage.setItem("capacityConnectLite", next ? "1" : "0");
    document.body.classList.toggle("lite-mode", next);
  };

  const handleQuickPersonaSwitch = (targetRole: Role) => {
    if (targetRole === "trainee") {
      login("priya.verma@imd.gov.in", "trainee123");
      navigate("/trainee");
    } else if (targetRole === "trainer") {
      login("rajesh.kumar@imd.gov.in", "trainer123");
      navigate("/trainer");
    } else if (targetRole === "admin") {
      login("dr.sharma@imd.gov.in", "admin123");
      navigate("/admin");
    }
    setMobileNavOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [profileOpen]);

  const profilePath = role === "trainer" ? "/trainer/profile" : role === "trainee" ? "/trainee/profile" : null;

  return (
    <div className="app-shell top-nav-layout">
      {/* Top Navbar Header */}
      <header className="top-navbar-container">
        {/* Tier 1: Brand, Tagline, Persona Switcher & Controls */}
        <div className="top-navbar-main">
          {/* Left: Brand Identity */}
          <div className="top-navbar-brand-col">
            <Link to={`/${role}`} className="top-navbar-brand-link">
              <div className="brand-mark" title="Capacity Connect">CC</div>
              <div className="brand-details">
                <strong className="brand-title">Capacity Connect</strong>
                <span className="brand-subtext">Learning Management System · IMD</span>
              </div>
            </Link>

            {/* Flow Badge */}
            <span className="brand-flow-pill">{FLOW_STEPS[role]}</span>

            {/* Gold Star Tagline */}
            <span className="brand-engine-star">
              ★ Core Competency Mapping Engine
            </span>
          </div>

          {/* Right: Quick Persona Switcher & Utilities */}
          <div className="top-navbar-controls">
            {/* Quick Persona Switcher */}
            <div className="persona-switcher-strip">
              <span className="persona-label">Active Persona:</span>
              <div className="persona-btn-group">
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSwitch("trainee")}
                  className={`persona-pill ${role === "trainee" ? "active" : ""}`}
                >
                  Trainee
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSwitch("trainer")}
                  className={`persona-pill ${role === "trainer" ? "active" : ""}`}
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersonaSwitch("admin")}
                  className={`persona-pill ${role === "admin" ? "active" : ""}`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Field Mode Toggle */}
            <button
              className={`lite-toggle ${lite ? "active" : ""}`}
              onClick={toggleLite}
              title="Reduce visual load for low-bandwidth field use"
            >
              <WifiOff size={14} />
              <span className="lite-text">{lite ? "Field Mode ON" : "Field Mode"}</span>
            </button>

            {/* Circular Profile Avatar Button with Dropdown */}
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button
                className={`profile-avatar-btn ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                title="Profile and account options"
                aria-expanded={profileOpen}
              >
                <div className="avatar small">{currentUser?.name.charAt(0) || "U"}</div>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <strong>{currentUser?.name}</strong>
                    <span>{currentUser?.email}</span>
                    <span className="profile-dropdown-badge">{role.toUpperCase()}</span>
                  </div>
                  {profilePath && (
                    <Link
                      to={profilePath}
                      className="profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={15} />
                      <span>Personal Profile</span>
                    </Link>
                  )}
                  <div className="profile-dropdown-divider" />
                  <button
                    className="profile-dropdown-item logout"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate("/login");
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="top-mobile-hamburger"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileNavOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-links">
              {nav[role].map(item => (
                <NavLink
                  end={item.to === `/${role}`}
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="nav-btn-icon">{item.icon}</span>
                  <span className="nav-btn-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Tier 2: Floating Horizontal Navigation Ribbon */}
      <div className="top-nav-ribbon-container">
        <nav className="top-nav-ribbon">
          {nav[role].map(item => (
            <NavLink
              end={item.to === `/${role}`}
              key={item.to}
              to={item.to}
              className={({ isActive }) => `top-nav-ribbon-btn ${isActive ? "active" : ""}`}
            >
              <span className="nav-btn-icon">{item.icon}</span>
              <span className="nav-btn-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Full-Width Content Container */}
      <div className="main-wrap-full">
        <main className="page-content">{children}</main>
      </div>

      {mobileNavOpen && <div className="sidebar-overlay" onClick={() => setMobileNavOpen(false)} />}
      {toast && <div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
    </div>
  );
}

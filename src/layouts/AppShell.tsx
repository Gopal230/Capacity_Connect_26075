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
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Users,
  WifiOff,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";

const nav: Record<Role, { to: string; label: string; icon: ReactNode }[]> = {
  admin: [
    { to: "/admin", label: "1. Dashboard", icon: <Home size={15} /> },
    { to: "/admin/users", label: "2. User Approval", icon: <UserCheck size={15} /> },
    { to: "/admin/trainers", label: "3. Trainers", icon: <Users size={15} /> },
    { to: "/admin/courses", label: "4. Courses", icon: <BookOpen size={15} /> },
    { to: "/admin/media", label: "5. Media Governance", icon: <Library size={15} /> },
    { to: "/admin/competencies", label: "6. Competencies", icon: <BrainCircuit size={15} /> },
    { to: "/admin/reports", label: "7. Reports", icon: <BarChart3 size={15} /> },
    { to: "/admin/readiness", label: "8. Readiness Command", icon: <Gauge size={15} /> },
    { to: "/admin/content", label: "9. Notifications", icon: <Bell size={15} /> },
  ],
  trainer: [
    { to: "/trainer", label: "1. Dashboard", icon: <Home size={15} /> },
    { to: "/trainer/courses", label: "2. Courses & Content", icon: <BookOpen size={15} /> },
    { to: "/trainer/library", label: "3. Library", icon: <Library size={15} /> },
    { to: "/trainer/assessments", label: "4. Assessments", icon: <ClipboardCheck size={15} /> },
    { to: "/trainer/trainees", label: "5. Trainee Monitoring", icon: <Users size={15} /> },
    { to: "/trainer/profile", label: "6. Instructor Profile", icon: <User size={15} /> },
  ],
  trainee: [
    { to: "/trainee", label: "1. Profile", icon: <User size={15} /> },
    { to: "/courses", label: "2. Browse Courses", icon: <BookOpen size={15} /> },
    { to: "/trainee/learning", label: "3. Enroll", icon: <FileCheck2 size={15} /> },
    { to: "/trainee/learning", label: "4. Study Material", icon: <GraduationCap size={15} /> },
    { to: "/trainee/competency", label: "5. Practice MCQs", icon: <BrainCircuit size={15} /> },
    { to: "/trainee/assessments", label: "6. Assessment", icon: <ClipboardCheck size={15} /> },
    { to: "/trainee/certificates", label: "7. Certificate", icon: <Award size={15} /> },
    { to: "/trainee/passport", label: "8. Feedback", icon: <ShieldCheck size={15} /> },
  ],
};

export default function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { currentUser, logout, toast, switchPersona } = useApp();
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

  const handlePersonaSwitch = (targetRole: Role) => {
    if (targetRole === role) return;
    switchPersona(targetRole);
    navigate(`/${targetRole}`);
  };

  return (
    <div className="app-shell top-nav-layout">
      {/* Top Navbar Header */}
      <header className="top-navbar-container">
        {/* Tier 1: Brand, Workflow indicators & Right Utilities */}
        <div className="top-navbar-main">
          {/* Brand Logo & Title */}
          <Link to={`/${role}`} className="top-navbar-brand-link">
            <div className="brand-mark" title="SIH / Capacity Connect">S</div>
            <div className="brand-details">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <strong className="brand-title">SIH 26075</strong>
                <span className="brand-lms-pill">LMS+</span>
              </div>
              <span className="brand-subtext">Competency & Skill-Gap Engine</span>
            </div>
          </Link>

          {/* Center Badges (Flow & Engine Banner) */}
          <div className="top-navbar-center-badges">
            <div className="flow-step-badge">
              {role === "trainee" ? "Trainee Flow (8 Steps)" : role === "trainer" ? "Trainer Flow (6 Steps)" : "Admin Command"}
            </div>
            <div className="engine-banner-text">
              ★ Core Competency Mapping Engine
            </div>
          </div>

          {/* Right Utilities */}
          <div className="top-navbar-controls">
            {/* Active Persona Switcher */}
            <div className="persona-switcher-pill">
              <span className="persona-label">Active Persona:</span>
              <button
                type="button"
                className={`persona-btn ${role === "trainee" ? "active" : ""}`}
                onClick={() => handlePersonaSwitch("trainee")}
              >
                Trainee
              </button>
              <button
                type="button"
                className={`persona-btn ${role === "trainer" ? "active" : ""}`}
                onClick={() => handlePersonaSwitch("trainer")}
              >
                Trainer
              </button>
              <button
                type="button"
                className={`persona-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => handlePersonaSwitch("admin")}
              >
                Admin
              </button>
            </div>

            {/* Field Mode Toggle */}
            <button
              className={`lite-toggle ${lite ? "active" : ""}`}
              onClick={toggleLite}
              title="Reduce visual load for field operations"
            >
              <WifiOff size={13} />
              <span className="lite-text">{lite ? "Field" : "Field"}</span>
            </button>

            {/* Circular Profile Avatar Button with Dropdown */}
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button
                className={`profile-avatar-btn ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                title="Profile and account options"
                aria-expanded={profileOpen}
              >
                <div className="avatar small">{currentUser?.name?.charAt(0) || role.charAt(0).toUpperCase()}</div>
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

        {/* Tier 2: Horizontal Navigation Bar (Left-to-Right Flow Buttons) */}
        <nav className="top-navbar-links-bar">
          <div className="top-navbar-links-scroll">
            {nav[role].map((item, idx) => (
              <NavLink
                end={item.to === `/${role}`}
                key={`${item.to}-${idx}`}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) => `top-nav-btn ${isActive ? "active" : ""}`}
              >
                <span className="nav-btn-icon">{item.icon}</span>
                <span className="nav-btn-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-links">
              {nav[role].map((item, idx) => (
                <NavLink
                  end={item.to === `/${role}`}
                  key={`m-${item.to}-${idx}`}
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

      {/* Main Full-Width Content Container */}
      <div className="main-wrap-full">
        <main className="page-content">{children}</main>
      </div>

      {mobileNavOpen && <div className="sidebar-overlay" onClick={() => setMobileNavOpen(false)} />}
      {toast && <div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
    </div>
  );
}

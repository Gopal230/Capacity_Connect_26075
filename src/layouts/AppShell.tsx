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
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Role } from "../types";

const nav: Record<Role, { to: string; label: string; icon: ReactNode }[]> = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: <Home size={15} /> },
    { to: "/admin/users", label: "User Approval", icon: <UserCheck size={15} /> },
    { to: "/admin/trainers", label: "Trainers", icon: <Users size={15} /> },
    { to: "/admin/courses", label: "Courses", icon: <BookOpen size={15} /> },
    { to: "/admin/media", label: "Media Governance", icon: <Library size={15} /> },
    { to: "/admin/competencies", label: "Competencies", icon: <BrainCircuit size={15} /> },
    { to: "/admin/reports", label: "Reports", icon: <BarChart3 size={15} /> },
    { to: "/admin/readiness", label: "Readiness Command", icon: <Gauge size={15} /> },
    { to: "/admin/content", label: "Notifications", icon: <Bell size={15} /> },
  ],
  trainer: [
    { to: "/trainer", label: "Dashboard", icon: <Home size={15} /> },
    { to: "/trainer/courses", label: "Courses & Content", icon: <BookOpen size={15} /> },
    { to: "/trainer/library", label: "Library", icon: <Library size={15} /> },
    { to: "/trainer/assessments", label: "Assessments", icon: <ClipboardCheck size={15} /> },
    { to: "/trainer/trainees", label: "Trainee Monitoring", icon: <Users size={15} /> },
    { to: "/trainer/profile", label: "Instructor Profile", icon: <User size={15} /> },
  ],
  trainee: [
    { to: "/trainee", label: "Dashboard", icon: <Home size={15} /> },
    { to: "/trainee/competency", label: "Competency Check", icon: <BrainCircuit size={15} /> },
    { to: "/trainee/learning", label: "Courses", icon: <BookOpen size={15} /> },
    { to: "/trainee/assessments", label: "Assessments", icon: <ClipboardCheck size={15} /> },
    { to: "/trainee/scenarios", label: "Practical Lab Assessment", icon: <Radar size={15} /> },
    { to: "/trainee/passport", label: "Capability Passport", icon: <ShieldCheck size={15} /> },
    { to: "/trainee/certificates", label: "Certificates", icon: <Award size={15} /> },
  ],
};

export default function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { currentUser, logout, toast, switchPersona } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        {/* Tier 1: Brand & Right Utilities */}
        <div className="top-navbar-main">
          {/* Brand Logo & Title */}
          <Link to={`/${role}`} className="top-navbar-brand-link">
            <div className="brand-mark" title="Capacity Connect">CC</div>
            <div className="brand-details">
              <strong className="brand-title">CAPACITY CONNECT</strong>
              <span className="brand-subtext">Operational Capacity & Learning Portal · Ministry of Earth Sciences (IMD)</span>
            </div>
          </Link>

          {/* Right Utilities */}
          <div className="top-navbar-controls">
            {/* Portal Online Status Pill */}
            <div className="system-status">
              <i />
              <span>Portal Online</span>
            </div>

            {/* Circular Profile Avatar Button with Dropdown */}
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button
                className={`profile-avatar-btn ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen(!profileOpen)}
                title="Profile and account options"
                aria-expanded={profileOpen}
              >
                <div className="avatar small">{currentUser?.name?.charAt(0) || "R"}</div>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <strong>{currentUser?.name || "Rahul Verma"}</strong>
                    <span>{currentUser?.email || "trainee@test.com"}</span>
                    <span className="profile-dropdown-badge">{role.toUpperCase()}</span>
                  </div>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-clean)", fontSize: "12px", color: "var(--text-muted)" }}>
                    <span style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>Switch Role:</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        type="button"
                        className={`persona-btn ${role === "trainee" ? "active" : ""}`}
                        style={{ color: role === "trainee" ? "#fff" : "var(--text-body)", background: role === "trainee" ? "#C1121F" : "#f1f5f9" }}
                        onClick={() => handlePersonaSwitch("trainee")}
                      >
                        Trainee
                      </button>
                      <button
                        type="button"
                        className={`persona-btn ${role === "trainer" ? "active" : ""}`}
                        style={{ color: role === "trainer" ? "#fff" : "var(--text-body)", background: role === "trainer" ? "#C1121F" : "#f1f5f9" }}
                        onClick={() => handlePersonaSwitch("trainer")}
                      >
                        Trainer
                      </button>
                      <button
                        type="button"
                        className={`persona-btn ${role === "admin" ? "active" : ""}`}
                        style={{ color: role === "admin" ? "#fff" : "var(--text-body)", background: role === "admin" ? "#C1121F" : "#f1f5f9" }}
                        onClick={() => handlePersonaSwitch("admin")}
                      >
                        Admin
                      </button>
                    </div>
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

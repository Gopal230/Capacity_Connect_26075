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
    { to: "/admin", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/admin/users", label: "User Approval", icon: <UserCheck size={16} /> },
    { to: "/admin/trainers", label: "Trainer Management", icon: <Users size={16} /> },
    { to: "/admin/courses", label: "Course Management", icon: <BookOpen size={16} /> },
    { to: "/admin/media", label: "Media Governance", icon: <Library size={16} /> },
    { to: "/admin/competencies", label: "Competencies", icon: <BrainCircuit size={16} /> },
    { to: "/admin/reports", label: "Reports & Analytics", icon: <BarChart3 size={16} /> },
    { to: "/admin/readiness", label: "Readiness Command", icon: <Gauge size={16} /> },
    { to: "/admin/knowledge", label: "Knowledge Continuity", icon: <Archive size={16} /> },
    { to: "/admin/content", label: "Content & Notifications", icon: <Bell size={16} /> },
  ],
  trainer: [
    { to: "/trainer", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/trainer/courses", label: "Courses & Content", icon: <BookOpen size={16} /> },
    { to: "/trainer/library", label: "Trainer Library", icon: <Library size={16} /> },
    { to: "/trainer/assessments", label: "Assessments", icon: <ClipboardCheck size={16} /> },
    { to: "/trainer/trainees", label: "Trainee Monitoring", icon: <Users size={16} /> },
    { to: "/trainer/evidence", label: "Evidence Review", icon: <FileCheck2 size={16} /> },
    { to: "/trainer/knowledge", label: "Knowledge Capture", icon: <Archive size={16} /> },
  ],
  trainee: [
    { to: "/trainee", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/trainee/competency", label: "Competency Check", icon: <BrainCircuit size={16} /> },
    { to: "/trainee/learning", label: "Courses", icon: <GraduationCap size={16} /> },
    { to: "/trainee/assessments", label: "Assessments", icon: <ClipboardCheck size={16} /> },
    { to: "/trainee/scenarios", label: "Practical Lab Assessment", icon: <Radar size={16} /> },
    { to: "/trainee/passport", label: "Capability Passport", icon: <ShieldCheck size={16} /> },
    { to: "/trainee/certificates", label: "Certificates", icon: <Award size={16} /> },
  ],
};

export default function AppShell({ children, role }: { children: ReactNode; role: Role }) {
  const { currentUser, logout, toast } = useApp();
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

  return (
    <div className="app-shell top-nav-layout">
      {/* Top Navbar Header */}
      <header className="top-navbar-container">
        {/* Tier 1: Brand & Top Utilities */}
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
            {/* Field Mode Toggle */}
            <button
              className={`lite-toggle ${lite ? "active" : ""}`}
              onClick={toggleLite}
              title="Reduce visual load for low-bandwidth field use"
            >
              <WifiOff size={14} />
              <span className="lite-text">{lite ? "Field Mode ON" : "Field Mode"}</span>
            </button>

            {/* Portal Online Status */}
            <span className="system-status">
              <i /> Portal Online
            </span>

            {/* Circular Profile Avatar Button with Dropdown (Un-squeezed) */}
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

        {/* Tier 2: Horizontal Navigation Bar (Left-to-Right Buttons) */}
        <nav className="top-navbar-links-bar">
          <div className="top-navbar-links-scroll">
            {nav[role].map((item) => (
              <NavLink
                end={item.to === `/${role}`}
                key={item.to}
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
              {nav[role].map((item) => (
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

      {/* Main Full-Width Content Container */}
      <div className="main-wrap-full">
        <main className="page-content">{children}</main>
      </div>

      {mobileNavOpen && <div className="sidebar-overlay" onClick={() => setMobileNavOpen(false)} />}
      {toast && <div className={`toast toast-${toast.tone}`}>{toast.message}</div>}
    </div>
  );
}

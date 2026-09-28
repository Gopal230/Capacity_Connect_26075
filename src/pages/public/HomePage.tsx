import { ArrowRight, CheckCircle2, GraduationCap, Menu, ShieldCheck, Users, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const quickLogin = (role: "admin" | "trainer" | "trainee") => {
    const res = login(`${role}@capacityconnect.in`, "Demo@123");
    if (res.ok) {
      navigate(`/${res.role}`);
    }
  };

  return (
    <div className="public-site">
      {/* Top Navbar */}
      <header className="public-nav">
        <Link to="/" className="public-brand">
          <span className="public-brand-mark">CC</span>
          <div>
            <strong>CAPACITY CONNECT</strong>
            <small>India Meteorological Department · Ministry of Earth Sciences</small>
          </div>
        </Link>

        <button
          className="public-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={menu ? "show" : ""}>
          <Link to="/courses" onClick={() => setMenu(false)}>Course Catalog</Link>
          <Link to="/login?role=trainee" onClick={() => setMenu(false)}>Trainee Sign In</Link>
          <Link to="/login?role=trainer" onClick={() => setMenu(false)}>Trainer Sign In</Link>
          <Link to="/login?role=admin" onClick={() => setMenu(false)}>Admin Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenu(false)}>
            Register
          </Link>
        </nav>
      </header>

      {/* Main Gateway */}
      <main className="portal-gateway">
        {/* Gateway Hero */}
        <section className="gateway-hero">
          <div className="gateway-kicker">
            MINISTRY OF EARTH SCIENCES · GOVERNMENT OF INDIA
          </div>
          <h1 className="gateway-title">
            Meteorological Capacity Building & Operational Readiness Portal
          </h1>
          <p className="gateway-desc">
            The unified continuous learning and capability governance system for the India Meteorological Department.
            Select your professional role below to access your dedicated workspace or explore immediately using instant demo credentials.
          </p>
        </section>

        {/* 3-PART ROLE DIVISION - CLEAN ENTERPRISE ARCHITECTURE */}
        <section className="three-part-container">
          {/* =========================================
              PART 1: OPERATIONAL TRAINEE
              ========================================= */}
          <div className="role-part-column">
            <div className="part-header">
              <div className="part-header-top">
                <div className="part-icon-wrap">
                  <GraduationCap size={22} />
                </div>
                <span className="role-category-label">OPERATIONAL PERSONNEL</span>
              </div>
              <h2>Operational Trainee</h2>
              <p className="part-audience">
                Meteorological Officers, Observers, Scientific Assistants & Forecasters
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Core Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Diagnostic competency checks & tailored study pathways</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Curricula in NWP modeling, Doppler Radar & Satellite meteorology</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Severe weather decision labs & synoptic forecasting scenarios</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Trainer-verified digital Capability Passport & certifications</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=trainee" className="btn btn-role-primary">
                Sign In as Trainee <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                className="btn btn-role-demo"
                onClick={() => quickLogin("trainee")}
              >
                ⚡ 1-Click Trainee Demo
              </button>
              <Link to="/register?role=trainee" className="part-register-link">
                New Trainee? Register for Clearance →
              </Link>
            </div>
          </div>

          {/* =========================================
              PART 2: ACCREDITED TRAINER
              ========================================= */}
          <div className="role-part-column">
            <div className="part-header">
              <div className="part-header-top">
                <div className="part-icon-wrap">
                  <Users size={22} />
                </div>
                <span className="role-category-label">FACULTY & INSTRUCTORS</span>
              </div>
              <h2>Accredited Trainer</h2>
              <p className="part-audience">
                Senior Meteorologists, Faculty Scientists & Specialized Domain Instructors
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Core Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Curriculum authoring studio & interactive module publishing</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Doppler radar archives, satellite loops & instructional media</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Practical evidence review & operational forecaster sign-offs</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Cohort performance monitoring & longitudinal progress tracking</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=trainer" className="btn btn-role-primary">
                Sign In as Trainer <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                className="btn btn-role-demo"
                onClick={() => quickLogin("trainer")}
              >
                ⚡ 1-Click Trainer Demo
              </button>
              <Link to="/register?role=trainer" className="part-register-link">
                Faculty Accreditation Registration →
              </Link>
            </div>
          </div>

          {/* =========================================
              PART 3: PORTAL ADMINISTRATOR
              ========================================= */}
          <div className="role-part-column">
            <div className="part-header">
              <div className="part-header-top">
                <div className="part-icon-wrap">
                  <ShieldCheck size={22} />
                </div>
                <span className="role-category-label">SYSTEM GOVERNANCE</span>
              </div>
              <h2>Portal Administrator</h2>
              <p className="part-audience">
                IMD Directorate, Training Division Heads & Governance Officers
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Core Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>User clearance reviews & role-based credential authorization</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>Faculty accreditation & institutional syllabus compliance</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>National Operational Readiness Index (ORI) analytics</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="check-icon" />
                  <span>System audit logs, data governance & security administration</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=admin" className="btn btn-role-primary">
                Sign In as Admin <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                className="btn btn-role-demo"
                onClick={() => quickLogin("admin")}
              >
                ⚡ 1-Click Admin Demo
              </button>
              <span className="part-admin-notice">
                Access restricted to authorized IMD personnel
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="public-footer">
        <div>
          <strong>CAPACITY CONNECT</strong>
          <p>Digital Capacity Building & Operational Readiness Portal</p>
          <small>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</small>
        </div>
        <div className="footer-links">
          <Link to="/courses">Course Catalog</Link>
          <Link to="/login?role=trainee">Trainee Sign In</Link>
          <Link to="/login?role=trainer">Trainer Sign In</Link>
          <Link to="/login?role=admin">Admin Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
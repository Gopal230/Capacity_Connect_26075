import { ArrowRight, CheckCircle2, GraduationCap, Menu, ShieldCheck, Sparkles, Users, X } from "lucide-react";
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
          <Link to="/courses">Courses Catalog</Link>
          <Link to="/login?role=trainee">Trainee Sign In</Link>
          <Link to="/login?role=trainer">Trainer Sign In</Link>
          <Link to="/login?role=admin">Admin Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </nav>
      </header>

      {/* Main Gateway */}
      <main className="portal-gateway">
        {/* Gateway Hero */}
        <section className="gateway-hero">
          <div className="gateway-badge">
            <Sparkles size={14} />
            <span>INDIA METEOROLOGICAL DEPARTMENT · MINISTRY OF EARTH SCIENCES</span>
          </div>
          <h1>Welcome to CAPACITY CONNECT</h1>
          <p className="gateway-desc">
            The national operational capacity building and continuous learning platform for meteorological personnel.
            Choose your role below to access your dedicated workspace or explore immediately using instant demo access.
          </p>
        </section>

        {/* 3-PART ROLE DIVISION - ZERO OVERLAPPING, MAXIMUM CLARITY */}
        <section className="three-part-container">
          {/* =========================================
              PART 1: OPERATIONAL TRAINEE
              ========================================= */}
          <div className="role-part-column part-trainee">
            <div className="part-header">
              <span className="part-tag tag-trainee">ROLE 01 · OPERATIONAL PERSONNEL</span>
              <div className="part-icon-box box-trainee">
                <GraduationCap size={28} />
              </div>
              <h2>Operational Trainee</h2>
              <p className="part-audience">
                Meteorological Officers · Observers · Scientific Assistants · Operational Forecasters
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Role-specific diagnostic skill assessments</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Curricula in NWP, Doppler Radar, Satellite & Severe Weather</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Interactive synoptic forecasting simulations</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Verified digital Capability Passport & credentials</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=trainee" className="btn btn-trainee-login">
                Sign In as Trainee <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-solid"
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
          <div className="role-part-column part-trainer">
            <div className="part-header">
              <span className="part-tag tag-trainer">ROLE 02 · FACULTY & INSTRUCTOR</span>
              <div className="part-icon-box box-trainer">
                <Users size={28} />
              </div>
              <h2>Accredited Trainer</h2>
              <p className="part-audience">
                Senior Meteorologists · Faculty Scientists · Domain Experts · Research Mentors
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Curriculum authoring studio & module publication</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Radar loops, satellite imagery & media repository</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Practical evidence review & forecaster sign-offs</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Cohort performance monitoring & mentoring</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=trainer" className="btn btn-trainer-login">
                Sign In as Trainer <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-solid"
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
          <div className="role-part-column part-admin">
            <div className="part-header">
              <span className="part-tag tag-admin">ROLE 03 · GOVERNANCE & COMMAND</span>
              <div className="part-icon-box box-admin">
                <ShieldCheck size={28} />
              </div>
              <h2>Portal Administrator</h2>
              <p className="part-audience">
                IMD Directorate · Training Heads · Governance & Compliance Officers
              </p>
            </div>

            <div className="part-body">
              <span className="part-features-title">Workspace Capabilities</span>
              <ul className="part-checklist">
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Pending user clearance reviews & role authorization</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>Faculty accreditation & standard compliance tracking</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>National Operational Readiness Index (ORI) dashboards</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="check-icon" />
                  <span>System audit logs, data integrity & security control</span>
                </li>
              </ul>
            </div>

            <div className="part-actions">
              <Link to="/login?role=admin" className="btn btn-admin-login">
                Sign In as Admin <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-solid"
                onClick={() => quickLogin("admin")}
              >
                ⚡ 1-Click Admin Demo
              </button>
              <span className="part-admin-notice">
                Admin access is strictly restricted to authorized IMD officials
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
          <Link to="/courses">Courses Catalog</Link>
          <Link to="/login?role=trainee">Trainee Sign In</Link>
          <Link to="/login?role=trainer">Trainer Sign In</Link>
          <Link to="/login?role=admin">Admin Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
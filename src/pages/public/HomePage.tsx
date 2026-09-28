import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, Clock, CloudLightning, Compass, FileCheck2, Gauge, GraduationCap, Menu, Radar, Satellite, ShieldCheck, Sparkles, Star, Users, Wind, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage() {
  const { db, login } = useApp();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const courses = db.courses.filter((c) => c.status === "published");

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
          <a href="#roles">Select Role</a>
          <a href="#about">About Platform</a>
          <a href="#disciplines">Disciplines</a>
          <a href="#courses">Courses</a>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </nav>
      </header>

      {/* Welcome Hero & Explanation */}
      <section className="welcome-hero-section">
        <div className="welcome-hero-container">
          <div className="welcome-badge">
            <Sparkles size={15} />
            <span>INDIA METEOROLOGICAL DEPARTMENT · MINISTRY OF EARTH SCIENCES</span>
          </div>

          <h1>Welcome to CAPACITY CONNECT</h1>

          <p className="welcome-lead">
            The official operational capacity building and continuous learning platform for the India
            Meteorological Department. We connect operational forecasters, certified trainers, and structured
            curricula in Numerical Weather Prediction (NWP), Doppler Weather Radar (DWR), Satellite Meteorology,
            and Cyclone Early Warning.
          </p>

          <div className="welcome-highlights">
            <div className="welcome-highlight-item">
              <CheckCircle2 size={16} />
              <span>Role-governed competency benchmarks</span>
            </div>
            <div className="welcome-highlight-item">
              <CheckCircle2 size={16} />
              <span>Accredited faculty-evaluated evidence</span>
            </div>
            <div className="welcome-highlight-item">
              <CheckCircle2 size={16} />
              <span>Verifiable digital capability passports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Selection Section ("Are you Trainee, Trainer, or Admin?") */}
      <section id="roles" className="role-selector-section">
        <div className="role-selector-header">
          <span className="section-kicker">GET STARTED</span>
          <h2>Select Your Role to Access Portal</h2>
          <p>
            Choose your account role to proceed to your dedicated sign-in and registration portal.
            Each portal includes instant 1-click demo account access.
          </p>
        </div>

        <div className="role-selection-grid">
          {/* Card 1: Trainee */}
          <div className="role-select-card trainee-card">
            <div className="role-card-badge">OPERATIONAL PERSONNEL</div>
            <div className="role-card-icon-wrap">
              <GraduationCap size={32} />
            </div>
            <h3>Operational Trainee</h3>
            <p className="role-card-desc">
              For meteorological officers, scientific assistants, and forecasters looking to build operational competencies, study courses, and earn verified certifications.
            </p>

            <ul className="role-card-features">
              <li>✓ Role-based diagnostic skill checks</li>
              <li>✓ Interactive modules & synoptic exercises</li>
              <li>✓ Verified Capability Passport & Transcript</li>
            </ul>

            <div className="role-card-actions">
              <Link to="/login?role=trainee" className="btn btn-primary btn-block">
                Sign In as Trainee <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-quick btn-block"
                onClick={() => quickLogin("trainee")}
              >
                ⚡ 1-Click Trainee Demo
              </button>
              <Link to="/register?role=trainee" className="role-signup-link">
                New Trainee? Register here
              </Link>
            </div>
          </div>

          {/* Card 2: Trainer */}
          <div className="role-select-card trainer-card">
            <div className="role-card-badge">FACULTY & INSTRUCTORS</div>
            <div className="role-card-icon-wrap">
              <Users size={32} />
            </div>
            <h3>Accredited Trainer</h3>
            <p className="role-card-desc">
              For senior scientists, domain experts, and faculty members authoring operational curricula, evaluating evidence submissions, and mentoring cohorts.
            </p>

            <ul className="role-card-features">
              <li>✓ Course & module authoring studio</li>
              <li>✓ Radar/satellite media repository</li>
              <li>✓ Trainee practical evidence grading</li>
            </ul>

            <div className="role-card-actions">
              <Link to="/login?role=trainer" className="btn btn-primary btn-block">
                Sign In as Trainer <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-quick btn-block"
                onClick={() => quickLogin("trainer")}
              >
                ⚡ 1-Click Trainer Demo
              </button>
              <Link to="/register?role=trainer" className="role-signup-link">
                New Faculty? Register here
              </Link>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="role-select-card admin-card">
            <div className="role-card-badge">GOVERNANCE & AUDIT</div>
            <div className="role-card-icon-wrap">
              <ShieldCheck size={32} />
            </div>
            <h3>Portal Administrator</h3>
            <p className="role-card-desc">
              For executive administration, training directors, and governance authorities overseeing user clearance, faculty accreditation, and organization-wide readiness.
            </p>

            <ul className="role-card-features">
              <li>✓ User clearance & identity management</li>
              <li>✓ Faculty accreditation & course approval</li>
              <li>✓ Operational Readiness Command Center</li>
            </ul>

            <div className="role-card-actions">
              <Link to="/login?role=admin" className="btn btn-primary btn-block">
                Sign In as Admin <ArrowRight size={16} />
              </Link>
              <button
                type="button"
                className="btn btn-demo-quick btn-block"
                onClick={() => quickLogin("admin")}
              >
                ⚡ 1-Click Admin Demo
              </button>
              <Link to="/register" className="role-signup-link">
                Request admin clearance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="metric-strip">
        <div>
          <strong>{db.trainees.length * 50 + 120}+</strong>
          <span>Trainee Personnel</span>
        </div>
        <div>
          <strong>{db.trainers.length}</strong>
          <span>Accredited Faculty</span>
        </div>
        <div>
          <strong>{courses.length}</strong>
          <span>Published Curricula</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Trainer-Verified Credentials</span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="public-section">
        <div className="section-kicker">ENTERPRISE ARCHITECTURE</div>
        <h2>A Complete Capacity Development Lifecycle</h2>
        <p className="section-lead">
          CAPACITY CONNECT transforms traditional passive training into measurable, evidence-backed operational readiness.
        </p>

        <div className="benefit-grid">
          {[
            [BookOpen, "Accredited Curricula", "High-resolution NWP modeling, Doppler radar nowcasting, and synoptic chart interpretation."],
            [Compass, "Competency Diagnostics", "Role-based diagnostic assessments identify individual skill gaps before curriculum assignment."],
            [FileCheck2, "Trainer-Verified Evidence", "Officers submit real forecasting deliverables evaluated by certified domain experts."],
            [Award, "Certified Capability Passport", "Digital, portable record of frontline competencies and emergency simulation readiness."],
            [Radar, "Emergency Decision Lab", "Realistic forecast desks simulating cyclone warnings and severe thunderstorm advisories."],
            [BarChart3, "Operational Readiness Index", "Multi-factor analytics tracking department-wide deployment preparedness."],
          ].map(([Icon, title, desc]: any) => (
            <article key={title}>
              <div className="feature-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Meteorological Disciplines */}
      <section id="disciplines" className="public-section soft">
        <div className="section-kicker">TRAINING DISCIPLINES</div>
        <h2>Specialized Meteorological Domains</h2>
        <div className="discipline-grid">
          {[
            { icon: Wind, title: "Numerical Weather Prediction", count: "6 Courses", desc: "WRF modeling, boundary conditions, and model forecast verification." },
            { icon: Radar, title: "Doppler Weather Radar", count: "5 Courses", desc: "Radar reflectivity, velocity products, and storm nowcasting." },
            { icon: Satellite, title: "Satellite Applications", count: "4 Courses", desc: "INSAT-3D/3DR imagery analysis and tropical cyclone monitoring." },
            { icon: CloudLightning, title: "Cyclone & Severe Weather", count: "4 Courses", desc: "Track prediction, storm surge estimation, and warning bulletins." },
            { icon: Compass, title: "Aviation & Marine Services", count: "3 Courses", desc: "Aerodrome forecasts (TAF/METAR) and coastal marine advisories." },
            { icon: BarChart3, title: "Climate & Extended Range", count: "4 Courses", desc: "Monsoon diagnostics, coupled models, and agricultural advisories." },
          ].map((d) => {
            const Icon = d.icon;
            return (
              <article key={d.title} className="discipline-card">
                <div className="discipline-icon-wrap">
                  <Icon size={22} />
                </div>
                <div className="discipline-info">
                  <span className="discipline-count">{d.count}</span>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Courses Catalog */}
      <section id="courses" className="public-section">
        <div className="section-head-row">
          <div>
            <div className="section-kicker">CURRICULUM CATALOG</div>
            <h2>Available Training Courses</h2>
          </div>
          <Link to="/login" className="text-link">
            Log in to view all courses <ArrowRight size={15} />
          </Link>
        </div>

        <div className="course-grid">
          {courses.slice(0, 6).map((c) => (
            <article className="course-card" key={c.id}>
              <div className="course-top">
                <span className="course-category-pill">{c.department}</span>
                <span className="badge badge-blue">{c.level}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <div className="course-meta">
                <span>
                  <Clock size={13} /> {c.durationHours} hours
                </span>
                <span className="course-rating">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" /> {c.rating}
                </span>
                <span className="course-code">{c.code}</span>
              </div>
              <div className="course-card-action">
                <Link to="/login?role=trainee" className="btn btn-primary btn-block">
                  Enroll as Trainee
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div>
          <strong>CAPACITY CONNECT</strong>
          <p>India Meteorological Department · Ministry of Earth Sciences</p>
          <small>© {new Date().getFullYear()} Government of India. All rights reserved.</small>
        </div>
        <div className="footer-links">
          <Link to="/login?role=trainee">Trainee Portal</Link>
          <Link to="/login?role=trainer">Trainer Workspace</Link>
          <Link to="/login?role=admin">Admin Command</Link>
        </div>
      </footer>
    </div>
  );
}
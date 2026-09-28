import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, Clock, FileCheck2, Gauge, GraduationCap, Menu, Radar, Satellite, ShieldCheck, Star, Users, Wind, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage() {
  const { db } = useApp();
  const [menu, setMenu] = useState(false);
  const courses = db.courses.filter((c) => c.status === "published");

  return (
    <div className="public-site">
      {/* Top Header */}
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
          <a href="#disciplines">Disciplines</a>
          <a href="#courses">Courses</a>
          <a href="#framework">Certification</a>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section with Small, Clean Heading */}
      <section className="hero">
        <div className="hero-copy">
          <span className="category-pill">IMD / MOES · OFFICIAL TRAINING PORTAL</span>
          <h1>IMD Operational Training & Competency Development</h1>
          <p>
            Official capacity building platform for India Meteorological Department personnel.
            Access training courses, competency diagnostics, and verified certifications in
            weather forecasting, radar meteorology, and numerical modeling.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login">
              Access Portal <ArrowRight size={15} />
            </Link>
            <a className="btn btn-secondary" href="#courses">
              View Course Catalog
            </a>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={15} /> WMO-aligned standards
            </span>
            <span>
              <CheckCircle2 size={15} /> Accredited IMD faculty
            </span>
            <span>
              <CheckCircle2 size={15} /> Practical forecast verification
            </span>
          </div>
        </div>

        {/* Clean, Simple Operational Pathways Card */}
        <div className="hero-panel">
          <div className="hero-panel-head">
            <div>
              <span>Core Training Tracks</span>
              <strong>Meteorological Disciplines</strong>
            </div>
            <ShieldCheck size={20} />
          </div>

          <div className="engine-step">
            <Wind size={18} />
            <div>
              <strong>Numerical Weather Prediction (NWP)</strong>
              <small>WRF modeling, data assimilation, and model diagnostics</small>
            </div>
          </div>

          <div className="engine-step">
            <Radar size={18} />
            <div>
              <strong>Doppler Weather Radar (DWR)</strong>
              <small>Reflectivity products, storm velocity, and severe nowcasting</small>
            </div>
          </div>

          <div className="engine-step">
            <Satellite size={18} />
            <div>
              <strong>Satellite Meteorology</strong>
              <small>INSAT-3D/3DR imagery interpretation and sounder products</small>
            </div>
          </div>

          <div className="engine-step">
            <Gauge size={18} />
            <div>
              <strong>Cyclone & Severe Weather Warning</strong>
              <small>Track prediction, storm surge estimates, and public advisories</small>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="metric-strip">
        <div>
          <strong>{db.trainees.length}+</strong>
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
          <span>Verified Certifications</span>
        </div>
      </section>

      {/* Meteorological Disciplines */}
      <section id="disciplines" className="public-section">
        <div className="section-kicker">TRAINING DISCIPLINES</div>
        <h2>Specialized Meteorological Areas</h2>
        <p className="section-lead">
          Core operational disciplines mapped to IMD forecasting desks and observational units.
        </p>

        <div className="benefit-grid">
          {[
            [Wind, "Numerical Weather Prediction", "Hands-on regional model configuration, boundary conditions, and forecast output verification."],
            [Radar, "Doppler Weather Radar", "Operational nowcasting, convective storm identification, and radar product interpretation."],
            [Satellite, "Satellite Applications", "INSAT-3D/3DR imagery analysis, derived winds, and tropical cyclone monitoring."],
            [BookOpen, "Synoptic Weather Forecasting", "Surface and upper-air analysis, synoptic charts, and weather briefing preparation."],
            [Award, "Aviation Meteorological Services", "Aerodrome forecasts (TAF), routine observations (METAR), and SIGMET advisories."],
            [BarChart3, "Climate & Extended-Range Forecasting", "Monsoon monitoring, coupled models, and agricultural weather advisories."],
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

      {/* Courses Catalog */}
      <section id="courses" className="public-section soft">
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
                <Link to="/login" className="btn btn-primary btn-block">
                  View Course Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Certification Process */}
      <section id="framework" className="public-section">
        <div className="section-kicker">CERTIFICATION FRAMEWORK</div>
        <h2>Structured Competency Progression</h2>
        <p className="section-lead">
          Every certification requires baseline diagnostic evaluation, course study, and practical evidence review by an accredited trainer.
        </p>

        <div className="framework-pillars">
          <div className="pillar-card">
            <div className="pillar-number">01</div>
            <h3>Competency Diagnostic</h3>
            <p>Initial assessment identifies role-specific skill gaps and training needs.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-number">02</div>
            <h3>Structured Coursework</h3>
            <p>Video lectures, synoptic charts, and technical documentation.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-number">03</div>
            <h3>Practical Evidence</h3>
            <p>Submission of real forecasting tasks or radar analyses for trainer evaluation.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-number">04</div>
            <h3>Accredited Certificate</h3>
            <p>Official credential recorded in the personnel Capability Passport.</p>
          </div>
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
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <a href="#courses">Courses</a>
        </div>
      </footer>
    </div>
  );
}
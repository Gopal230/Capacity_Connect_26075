import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, Clock, CloudLightning, Compass, FileCheck2, Filter, GraduationCap, Menu, Radar, Satellite, Search, ShieldCheck, Star, Users, Wind, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage() {
  const { db } = useApp();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const publishedCourses = db.courses.filter((c) => c.status === "published");
  const filteredCourses = searchQuery
    ? publishedCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publishedCourses.slice(0, 6);

  const disciplines = [
    {
      icon: Wind,
      title: "Numerical Weather Prediction",
      desc: "High-resolution WRF modeling, data assimilation, and deterministic-ensemble post-processing.",
      count: "6 Programs",
    },
    {
      icon: Radar,
      title: "Doppler Radar Meteorology",
      desc: "DWR product interpretation, nowcasting severe thunderstorms, and convective storm tracking.",
      count: "5 Programs",
    },
    {
      icon: Satellite,
      title: "Satellite Meteorology",
      desc: "INSAT-3D/3DR imagery interpretation, sounder products, and tropical cyclone intensity estimation.",
      count: "4 Programs",
    },
    {
      icon: CloudLightning,
      title: "Severe Weather & Cyclone Warning",
      desc: "Synoptic diagnosis, storm surge modeling, track prediction, and impact-based public bulletins.",
      count: "4 Programs",
    },
    {
      icon: Compass,
      title: "Aviation & Marine Services",
      desc: "Aerodrome forecasts (TAF/METAR), SIGMET issuance, marine sea-state guidance, and coastal safety.",
      count: "3 Programs",
    },
    {
      icon: BarChart3,
      title: "Climate Dynamics & Extended Range",
      desc: "Monsoon diagnostics, teleconnections (ENSO/IOD), coupled models, and agricultural advisory.",
      count: "4 Programs",
    },
  ];

  return (
    <div className="public-site">
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
          {menu ? <X /> : <Menu />}
        </button>
        <nav className={menu ? "show" : ""}>
          <a href="#disciplines">Disciplines</a>
          <a href="#courses">Specializations</a>
          <a href="#framework">Capability Framework</a>
          <a href="#bulletins">Bulletins</a>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <span className="category-pill">
            NATIONAL METEOROLOGICAL CAPACITY BUILDING · MOES / IMD
          </span>
          <h1>
            Empowering India's Meteorological Workforce Through{" "}
            <em>Specialized Operational Training.</em>
          </h1>
          <p>
            The official continuous learning and capability verification platform for
            the India Meteorological Department. Access specialized curricula in
            Numerical Weather Prediction, Doppler Weather Radar, Cyclone Warning, and
            Synoptic Meteorology — verified through hands-on operational evidence.
          </p>

          <div className="hero-search-bar">
            <div className="hero-search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specializations, tools (e.g. NWP, Radar, INSAT-3D)..."
              />
            </div>
            <a href="#courses" className="btn btn-primary">
              Explore Programs
            </a>
          </div>

          <div className="hero-domain-pills">
            <span>Trending:</span>
            <button type="button" onClick={() => setSearchQuery("Numerical Weather Prediction")}>
              Numerical Modeling (NWP)
            </button>
            <button type="button" onClick={() => setSearchQuery("Radar")}>
              Doppler Radar
            </button>
            <button type="button" onClick={() => setSearchQuery("Satellite")}>
              INSAT-3DR Satellite
            </button>
            <button type="button" onClick={() => setSearchQuery("Cyclone")}>
              Cyclone Warning
            </button>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={16} /> WMO Competency Standards
            </span>
            <span>
              <CheckCircle2 size={16} /> Accredited IMD Faculty
            </span>
            <span>
              <CheckCircle2 size={16} /> Verifiable Operational Credentials
            </span>
          </div>
        </div>

        {/* Featured Program Showcase Card (Coursera-style) */}
        <div className="hero-featured-card">
          <div className="featured-card-badge">
            <GraduationCap size={16} />
            <span>Featured National Specialization</span>
          </div>
          <div className="featured-card-body">
            <span className="department-tag">Numerical Weather Prediction Division</span>
            <h3>Operational NWP Modeling, Data Assimilation & Verification</h3>
            <p>
              Master high-resolution regional WRF model initialization, satellite radiance
              assimilation, and precipitation verification for operational forecast desks.
            </p>
            <div className="featured-faculty">
              <div className="faculty-avatar">AR</div>
              <div>
                <strong>Dr. Arvind Rao</strong>
                <span>Senior Meteorologist & Chief NWP Modeler · IMD New Delhi</span>
              </div>
            </div>
            <div className="featured-meta-row">
              <div className="meta-item">
                <Clock size={15} />
                <span>45 Total Hours</span>
              </div>
              <div className="meta-item">
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <span>4.9 (184 reviews)</span>
              </div>
              <div className="meta-item">
                <ShieldCheck size={15} />
                <span>MoES Certified</span>
              </div>
            </div>
            <div className="featured-syllabus-highlights">
              <div className="highlight-item">
                <CheckCircle2 size={14} />
                <span>WRF-ARW dynamical core configuration & domain nesting</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={14} />
                <span>Operational GFS boundary condition assimilation</span>
              </div>
              <div className="highlight-item">
                <CheckCircle2 size={14} />
                <span>Quantitative Precipitation Forecast (QPF) verification</span>
              </div>
            </div>
            <div className="featured-card-footer">
              <Link to="/login" className="btn btn-primary btn-block">
                Enroll via Departmental Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="metric-strip">
        <div>
          <strong>{db.trainees.length * 50 + 120}+</strong>
          <span>Operational Officers Trained</span>
        </div>
        <div>
          <strong>{db.trainers.length}</strong>
          <span>Accredited Senior Faculty</span>
        </div>
        <div>
          <strong>{publishedCourses.length}</strong>
          <span>Approved Specializations</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Faculty-Verified Credentialing</span>
        </div>
      </section>

      {/* Disciplines Section */}
      <section id="disciplines" className="public-section">
        <div className="section-kicker">CURRICULUM DOMAINS</div>
        <h2>Explore Training by Meteorological Discipline</h2>
        <p className="section-lead">
          Structured learning tracks mapped directly to WMO and IMD operational qualifications,
          enabling officers to upskill in specialized observational and forecasting techniques.
        </p>
        <div className="discipline-grid">
          {disciplines.map((d) => {
            const Icon = d.icon;
            return (
              <article key={d.title} className="discipline-card">
                <div className="discipline-icon-wrap">
                  <Icon size={24} />
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

      {/* Courses Catalog Section */}
      <section id="courses" className="public-section soft">
        <div className="section-head-row">
          <div>
            <div className="section-kicker">ACADEMIC & OPERATIONAL CATALOG</div>
            <h2>Specialized Training Curricula</h2>
            <p className="section-subtitle">
              Comprehensive courses designed and mentored by accredited IMD scientists.
            </p>
          </div>
          {searchQuery && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchQuery("")}
            >
              Clear filter ({filteredCourses.length} results)
            </button>
          )}
        </div>

        <div className="course-grid">
          {filteredCourses.map((c) => (
            <article className="course-card" key={c.id}>
              <div className="course-top">
                <span className="course-category-pill">{c.department}</span>
                <span className="badge badge-blue">{c.level}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <div className="course-objectives">
                {c.objectives.slice(0, 2).map((obj, idx) => (
                  <span key={idx} className="objective-item">
                    <CheckCircle2 size={13} /> {obj}
                  </span>
                ))}
              </div>
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
                  View Program Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Capability Framework Section */}
      <section id="framework" className="public-section">
        <div className="section-kicker">ACCREDITATION STANDARD</div>
        <h2>The IMD Operational Capability Framework</h2>
        <p className="section-lead">
          Traditional training platforms track passive video attendance. CAPACITY CONNECT
          operates on a verified competency standard ensuring personnel possess frontline operational proficiency.
        </p>

        <div className="framework-pillars">
          <div className="pillar-card">
            <div className="pillar-number">01</div>
            <div className="pillar-icon">
              <BookOpen size={24} />
            </div>
            <h3>Competency Diagnostic</h3>
            <p>
              Pre-training diagnostics evaluate current proficiency across observational,
              synoptic, and numerical forecasting skills against WMO standards.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">02</div>
            <div className="pillar-icon">
              <GraduationCap size={24} />
            </div>
            <h3>Specialized Instruction</h3>
            <p>
              Modular coursework incorporating live synoptic charts, Doppler radar loops,
              satellite products, and operational case studies led by certified trainers.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">03</div>
            <div className="pillar-icon">
              <FileCheck2 size={24} />
            </div>
            <h3>Operational Deliverable</h3>
            <p>
              Trainees formulate real-time synoptic forecasts, radar warnings, or model
              diagnostics and submit deliverables for rigorous faculty evaluation.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">04</div>
            <div className="pillar-icon">
              <Award size={24} />
            </div>
            <h3>Faculty Sign-Off & Passport</h3>
            <p>
              Credentials and verifiable Capability Passports are granted exclusively
              upon trainer sign-off, creating an auditable record of national readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Bulletins & Official Policy */}
      <section id="bulletins" className="public-section split-news">
        <div>
          <div className="section-kicker">INSTITUTIONAL BULLETINS</div>
          <h2>Announcements & Schedules</h2>
          {db.notifications.slice(0, 3).map((n) => (
            <div className="news-item" key={n.id}>
              <span>{n.type}</span>
              <div>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
              </div>
              <time>{n.publishedAt}</time>
            </div>
          ))}
        </div>
        <aside className="achievement-box">
          <Award size={32} />
          <span>GOVERNANCE & STANDARDS</span>
          <h3>Credentials Represent Frontline Operational Mastery</h3>
          <p>
            Certificates of Competency issued through CAPACITY CONNECT adhere to the
            guidelines established by the India Meteorological Department and the World
            Meteorological Organization (WMO) Basic Instruction Package for Meteorologists.
          </p>
          <div className="policy-points">
            <span>✓ Rigorous pre & post assessments</span>
            <span>✓ Independent faculty review of deliverables</span>
            <span>✓ Verifiable digital certificate ledger</span>
          </div>
        </aside>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <strong>CAPACITY CONNECT</strong>
            <p>
              National Meteorological Capacity Building & Operational Readiness Portal
            </p>
            <small>
              India Meteorological Department · Ministry of Earth Sciences, Government of
              India
            </small>
          </div>
          <div className="footer-nav-col">
            <h4>Training Divisions</h4>
            <a href="#courses">Numerical Weather Prediction</a>
            <a href="#courses">Radar Meteorology</a>
            <a href="#courses">Satellite Applications</a>
            <a href="#courses">Aviation Weather Services</a>
          </div>
          <div className="footer-nav-col">
            <h4>Portals & Governance</h4>
            <Link to="/login">Officer Portal</Link>
            <Link to="/login">Faculty Workspace</Link>
            <Link to="/login">Administrative Command</Link>
            <Link to="/register">Account Clearance</Link>
          </div>
          <div className="footer-nav-col">
            <h4>Institutional Standards</h4>
            <span>WMO-No. 1083 BIP-M Compliant</span>
            <span>MoES Capacity Building Commission</span>
            <span>Government of India Security Guidelines</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} India Meteorological Department · Ministry of
            Earth Sciences. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Security Protocol</a>
            <a href="#">Contact Directorate</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
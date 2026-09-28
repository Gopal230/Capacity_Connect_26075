import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, Clock, CloudLightning, Compass, FileCheck2, GraduationCap, Menu, Radar, Satellite, Search, ShieldCheck, Sparkles, Star, Users, Wind, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function HomePage() {
  const { db } = useApp();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");

  const publishedCourses = db.courses.filter((c) => c.status === "published");
  const filtered = query
    ? publishedCourses.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.department.toLowerCase().includes(query.toLowerCase()) ||
          c.subject.toLowerCase().includes(query.toLowerCase())
      )
    : publishedCourses.slice(0, 6);

  const tracks = [
    {
      icon: Wind,
      title: "Weather Modeling (NWP)",
      desc: "Learn high-resolution WRF modeling, data assimilation, and forecast verification.",
      count: "6 Courses",
    },
    {
      icon: Radar,
      title: "Doppler Weather Radar",
      desc: "Interpret radar reflectivity, velocity products, and nowcast thunderstorms.",
      count: "5 Courses",
    },
    {
      icon: Satellite,
      title: "Satellite Meteorology",
      desc: "Analyze INSAT-3D/3DR satellite imagery, sounder data, and tropical storms.",
      count: "4 Courses",
    },
    {
      icon: CloudLightning,
      title: "Cyclone & Severe Weather",
      desc: "Track cyclones, estimate storm surge, and issue clear public warning bulletins.",
      count: "4 Courses",
    },
    {
      icon: Compass,
      title: "Aviation & Marine Forecasts",
      desc: "Prepare aerodrome forecasts (TAF/METAR) and coastal marine advisories.",
      count: "3 Courses",
    },
    {
      icon: BarChart3,
      title: "Climate & Monsoon Dynamics",
      desc: "Study long-range monsoon forecasting, ENSO/IOD patterns, and climate trends.",
      count: "4 Courses",
    },
  ];

  return (
    <div className="public-site">
      {/* Top Navbar */}
      <header className="public-nav">
        <Link to="/" className="public-brand">
          <div className="brand-logo-pill">
            <CloudLightning size={20} />
          </div>
          <div>
            <strong>MeteoLearn</strong>
            <small>India Meteorological Department · MoES</small>
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
          <a href="#tracks">Specializations</a>
          <a href="#courses">Courses</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge-pill">
            <Sparkles size={14} />
            <span>India Meteorological Department · Official Learning Hub</span>
          </div>

          <h1>
            Master weather forecasting. <br />
            <em>Simple, practical, and certified.</em>
          </h1>

          <p>
            Interactive courses, radar and satellite simulations, and verified credentials
            for atmospheric scientists and operational weather officers across India.
          </p>

          <div className="hero-search-bar">
            <div className="hero-search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses (e.g. Radar, Cyclone, WRF, Satellite)..."
              />
            </div>
            <a href="#courses" className="btn btn-primary">
              Find Courses
            </a>
          </div>

          <div className="hero-domain-pills">
            <span>Popular:</span>
            <button type="button" onClick={() => setQuery("Numerical Weather Prediction")}>
              Numerical Modeling (WRF)
            </button>
            <button type="button" onClick={() => setQuery("Radar")}>
              Doppler Radar
            </button>
            <button type="button" onClick={() => setQuery("Satellite")}>
              INSAT-3DR
            </button>
            <button type="button" onClick={() => setQuery("Cyclone")}>
              Cyclone Warning
            </button>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={16} /> Certified IMD Faculty
            </span>
            <span>
              <CheckCircle2 size={16} /> Practical Weather Labs
            </span>
            <span>
              <CheckCircle2 size={16} /> Official Credentials
            </span>
          </div>
        </div>

        {/* Featured Card */}
        <div className="hero-featured-card">
          <div className="featured-card-badge">
            <GraduationCap size={16} />
            <span>Featured Specialization</span>
          </div>
          <div className="featured-card-body">
            <span className="department-tag">Numerical Weather Prediction</span>
            <h3>Operational Weather Modeling & Forecasting</h3>
            <p>
              Master regional WRF model configuration, satellite data assimilation,
              and rainfall verification for daily forecast shifts.
            </p>

            <div className="featured-faculty">
              <div className="faculty-avatar">AR</div>
              <div>
                <strong>Dr. Arvind Rao</strong>
                <span>Senior Modeler · IMD New Delhi</span>
              </div>
            </div>

            <div className="featured-meta-row">
              <div className="meta-item">
                <Clock size={15} />
                <span>45 Hours</span>
              </div>
              <div className="meta-item">
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <span>4.9 Rating</span>
              </div>
              <div className="meta-item">
                <ShieldCheck size={15} />
                <span>Certified</span>
              </div>
            </div>

            <div className="featured-card-footer">
              <Link to="/login" className="btn btn-primary btn-block">
                Start Course <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Friendly Metric Bar */}
      <section className="metric-strip">
        <div>
          <strong>850+</strong>
          <span>Officers Trained</span>
        </div>
        <div>
          <strong>14</strong>
          <span>Senior Faculty</span>
        </div>
        <div>
          <strong>24</strong>
          <span>Active Courses</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Verified Certificates</span>
        </div>
      </section>

      {/* Specialization Tracks */}
      <section id="tracks" className="public-section">
        <div className="section-kicker">LEARNING TRACKS</div>
        <h2>Explore Weather Science Disciplines</h2>
        <p className="section-lead">
          Structured courses mapped directly to real operational forecasting desks at IMD.
        </p>

        <div className="discipline-grid">
          {tracks.map((t) => {
            const Icon = t.icon;
            return (
              <article key={t.title} className="discipline-card">
                <div className="discipline-icon-wrap">
                  <Icon size={24} />
                </div>
                <div className="discipline-info">
                  <span className="discipline-count">{t.count}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="public-section soft">
        <div className="section-head-row">
          <div>
            <div className="section-kicker">COURSE CATALOG</div>
            <h2>Specialized Training Curricula</h2>
            <p className="section-lead">
              Practical courses designed and mentored by accredited IMD faculty.
            </p>
          </div>
          {query && (
            <button className="btn btn-secondary btn-sm" onClick={() => setQuery("")}>
              Clear search filter
            </button>
          )}
        </div>

        <div className="course-grid">
          {filtered.map((c) => (
            <article className="course-card" key={c.id}>
              <div className="course-top">
                <span className="course-category-pill">{c.department}</span>
                <span className="badge badge-blue">{c.level}</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>

              <div className="course-objectives">
                {c.objectives.slice(0, 2).map((obj, i) => (
                  <span key={i} className="objective-item">
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
                  View Course Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Simple How-It-Works */}
      <section id="how-it-works" className="public-section">
        <div className="section-kicker">HOW IT WORKS</div>
        <h2>A Straightforward Path to Operational Certification</h2>
        <p className="section-lead">
          Clear, structured milestones from diagnostic evaluation to verified credentials.
        </p>

        <div className="framework-pillars">
          <div className="pillar-card">
            <div className="pillar-number">01</div>
            <div className="pillar-icon">
              <BookOpen size={24} />
            </div>
            <h3>Skill Check</h3>
            <p>Take a quick diagnostic to identify your strengths and topics needing focus.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">02</div>
            <div className="pillar-icon">
              <GraduationCap size={24} />
            </div>
            <h3>Interactive Learning</h3>
            <p>Watch video lectures, review synoptic charts, and study satellite loops.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">03</div>
            <div className="pillar-icon">
              <FileCheck2 size={24} />
            </div>
            <h3>Practical Task</h3>
            <p>Submit a real forecasting task or radar interpretation for faculty review.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-number">04</div>
            <div className="pillar-icon">
              <Award size={24} />
            </div>
            <h3>Official Certificate</h3>
            <p>Earn an accredited credential verified by your trainer and logged in your profile.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <strong>MeteoLearn</strong>
            <p>Continuous learning and capacity building for the India Meteorological Department.</p>
            <small>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</small>
          </div>
          <div className="footer-nav-col">
            <h4>Tracks</h4>
            <a href="#courses">Numerical Weather Prediction</a>
            <a href="#courses">Radar Meteorology</a>
            <a href="#courses">Satellite Applications</a>
            <a href="#courses">Aviation Weather</a>
          </div>
          <div className="footer-nav-col">
            <h4>Portals</h4>
            <Link to="/login">Officer Portal</Link>
            <Link to="/login">Faculty Workspace</Link>
            <Link to="/login">Admin Center</Link>
            <Link to="/register">Register Account</Link>
          </div>
          <div className="footer-nav-col">
            <h4>Standards</h4>
            <span>WMO-No. 1083 BIP-M</span>
            <span>MoES Training Standards</span>
            <span>Govt. of India Guidelines</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} IMD · MoES, Govt of India.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
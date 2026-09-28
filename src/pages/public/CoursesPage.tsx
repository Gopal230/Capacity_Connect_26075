import { Clock, Menu, Search, Star, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function CoursesPage() {
  const { db } = useApp();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const published = db.courses.filter((c) => c.status === "published");
  const departments = ["all", ...Array.from(new Set(published.map((c) => c.department)))];

  const filtered = published.filter((c) => {
    const matchesDept = selectedDept === "all" || c.department === selectedDept;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

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
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={menu ? "show" : ""}>
          <Link to="/">Get Started / Roles</Link>
          <Link to="/courses" className="active">Courses</Link>
          <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </nav>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span className="section-kicker">COURSE CATALOG</span>
          <h1 style={{ fontSize: "26px", color: "var(--text-heading)", margin: "8px 0 12px" }}>
            Operational Training Programs
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
            Explore standardized curricula developed for operational forecasters and meteorological staff.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            padding: "16px",
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1", minWidth: "240px" }}>
            <Search size={18} color="#475569" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, topic, or code..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#0F172A",
                background: "transparent",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: selectedDept === dept ? "1.5px solid #1D4ED8" : "1px solid #CBD5E1",
                  background: selectedDept === dept ? "#1D4ED8" : "#F8FAFC",
                  color: selectedDept === dept ? "#FFFFFF" : "#1E293B",
                  cursor: "pointer",
                }}
              >
                {dept === "all" ? "All Disciplines" : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="course-grid">
          {filtered.map((c) => (
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
              <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                <Link
                  to={`/login?role=trainee`}
                  className="btn btn-primary btn-block btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Enroll via Trainee Portal
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className="public-footer">
        <div>
          <strong>CAPACITY CONNECT</strong>
          <p>Digital Capacity Building & Operational Readiness Portal</p>
          <small>© {new Date().getFullYear()} India Meteorological Department · Ministry of Earth Sciences</small>
        </div>
        <div className="footer-links">
          <Link to="/">Get Started</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/login?role=trainee">Trainee Portal</Link>
          <Link to="/login?role=trainer">Trainer Portal</Link>
          <Link to="/login?role=admin">Admin Command</Link>
        </div>
      </footer>
    </div>
  );
}

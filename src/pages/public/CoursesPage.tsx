import { Clock, Lock, Menu, Search, Star, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getLevelNumber } from "../../utils/engine";

export default function CoursesPage() {
  const { db, currentUser, getTraineeLevel } = useApp();
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

  // If logged in as trainee, find trainee record for level checking
  const trainee = currentUser?.role === "trainee"
    ? db.trainees.find((t) => t.userId === currentUser.id)
    : null;

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
          {currentUser ? (
            <Link to={`/${currentUser.role}`} className="btn btn-primary btn-sm">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
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
            padding: "16px 20px",
            background: "#FFFFFF",
            border: "1.5px solid #E5DCC5",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 48, 73, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1", minWidth: "240px" }}>
            <Search size={18} color="#5C768D" />
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
                color: "#003049",
                background: "transparent",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    border: isSelected ? "1.5px solid #C1121F" : "1px solid #E5DCC5",
                    background: isSelected ? "#C1121F" : "#FAF7EE",
                    color: isSelected ? "#FFFFFF" : "#003049",
                    boxShadow: isSelected ? "0 2px 6px rgba(193, 18, 31, 0.3)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {dept === "all" ? "All Disciplines" : dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="course-grid">
          {filtered.map((c) => {
            const hasLevels = Boolean(c.entryLevel && c.targetLevel);
            const competencyName = c.competency || c.subject;

            // Check if locked for logged-in trainee
            let isLocked = false;
            let lockMessage = "";
            if (trainee && hasLevels && c.competency) {
              const currentLvl = getTraineeLevel(trainee.id, c.competency);
              const currentRank = getLevelNumber(currentLvl);
              const entryRank = getLevelNumber(c.entryLevel);
              if (entryRank > currentRank) {
                isLocked = true;
                lockMessage = `Requires ${c.entryLevel} in ${c.competency}. Your level: ${currentLvl}.`;
              }
            }

            return (
              <article className={`course-card ${isLocked ? "locked" : ""}`} key={c.id} style={isLocked ? { background: "#F8FAFC", borderColor: "#E2E8F0" } : {}}>
                <div className="course-top">
                  <span className="course-category-pill">{competencyName}</span>
                  {hasLevels ? (
                    <span className="badge badge-blue">{c.entryLevel} → {c.targetLevel}</span>
                  ) : (
                    <span className="badge badge-blue">{c.level}</span>
                  )}
                </div>
                <h3 style={isLocked ? { color: "#64748B" } : {}}>{c.title}</h3>
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

                {isLocked && (
                  <p style={{ fontSize: "11.5px", color: "#92400E", background: "#FEF3C7", padding: "6px 8px", borderRadius: "4px", margin: "10px 0 0" }}>
                    <Lock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {lockMessage}
                  </p>
                )}

                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
                  {isLocked ? (
                    <button
                      disabled
                      className="btn btn-disabled btn-block btn-sm"
                    >
                      <Lock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                      Locked (Requires {c.entryLevel})
                    </button>
                  ) : trainee ? (
                    <Link
                      to={`/trainee`}
                      className="btn btn-primary btn-block btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Go to Dashboard to Enroll
                    </Link>
                  ) : (
                    <Link
                      to={`/login?role=trainee`}
                      className="btn btn-primary btn-block btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Sign In to Enroll
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
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

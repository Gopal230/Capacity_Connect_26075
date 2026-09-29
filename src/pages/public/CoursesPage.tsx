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
    <div className="public-site" style={{ background: "#080E18", minHeight: "100vh", color: "#CBD5E1" }}>
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
          <Link to="/courses" style={{ color: "#F87171", fontWeight: 700 }}>Courses</Link>
          {currentUser ? (
            <Link to={`/${currentUser.role}`} className="btn btn-primary btn-sm" style={{ background: "#991B1B", borderColor: "#991B1B" }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ background: "#142034", color: "#F8FAFC", borderColor: "#1B2A44" }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ background: "#991B1B", borderColor: "#991B1B" }}>Register</Link>
            </>
          )}
        </nav>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span className="section-kicker" style={{ color: "#F87171" }}>COURSE CATALOG</span>
          <h1 style={{ fontSize: "28px", color: "#F8FAFC", margin: "8px 0 12px", fontWeight: 800 }}>
            Operational Training Programs
          </h1>
          <p style={{ color: "#8899B0", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
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
            background: "#0E1726",
            border: "1.5px solid #1B2A44",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1", minWidth: "240px" }}>
            <Search size={18} color="#8899B0" />
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
                color: "#F8FAFC",
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
                  border: selectedDept === dept ? "1.5px solid #991B1B" : "1px solid #1B2A44",
                  background: selectedDept === dept ? "#991B1B" : "#142034",
                  color: selectedDept === dept ? "#FFFFFF" : "#CBD5E1",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {dept === "all" ? "All Disciplines" : dept}
              </button>
            ))}
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
              <article
                className={`course-card ${isLocked ? "locked" : ""}`}
                key={c.id}
                style={{
                  background: isLocked ? "#080E18" : "#0E1726",
                  border: `1.5px solid ${isLocked ? "#16233B" : "#1B2A44"}`,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="course-top">
                  <span className="course-category-pill" style={{ background: "#241114", color: "#F87171", border: "1px solid #4C1D24" }}>
                    {competencyName}
                  </span>
                  {hasLevels ? (
                    <span className="badge badge-blue" style={{ background: "#142034", color: "#93C5FD", border: "1px solid #233454" }}>
                      {c.entryLevel} → {c.targetLevel}
                    </span>
                  ) : (
                    <span className="badge badge-blue" style={{ background: "#142034", color: "#93C5FD", border: "1px solid #233454" }}>
                      {c.level}
                    </span>
                  )}
                </div>
                <h3 style={{ color: isLocked ? "#8899B0" : "#F8FAFC", fontSize: "16px", margin: "12px 0 8px", fontWeight: 700 }}>
                  {c.title}
                </h3>
                <p style={{ color: "#8899B0", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px" }}>
                  {c.description}
                </p>
                <div className="course-meta" style={{ color: "#8899B0", fontSize: "12px" }}>
                  <span>
                    <Clock size={13} /> {c.durationHours} hours
                  </span>
                  <span className="course-rating" style={{ color: "#FBBF24" }}>
                    <Star size={13} fill="#FBBF24" color="#FBBF24" /> {c.rating}
                  </span>
                  <span className="course-code" style={{ color: "#8899B0" }}>{c.code}</span>
                </div>

                {isLocked && (
                  <p style={{ fontSize: "11.5px", color: "#FBBF24", background: "#261D0C", border: "1px solid #543E19", padding: "8px 10px", borderRadius: "6px", margin: "12px 0 0" }}>
                    <Lock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {lockMessage}
                  </p>
                )}

                <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #1B2A44" }}>
                  {isLocked ? (
                    <button
                      disabled
                      className="btn btn-disabled btn-block btn-sm"
                      style={{ background: "#16233B", color: "#8899B0", border: "none" }}
                    >
                      <Lock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                      Locked (Requires {c.entryLevel})
                    </button>
                  ) : trainee ? (
                    <Link
                      to={`/trainee`}
                      className="btn btn-primary btn-block btn-sm"
                      style={{ textDecoration: "none", background: "#991B1B", borderColor: "#991B1B" }}
                    >
                      Go to Dashboard to Enroll
                    </Link>
                  ) : (
                    <Link
                      to={`/login?role=trainee`}
                      className="btn btn-primary btn-block btn-sm"
                      style={{ textDecoration: "none", background: "#991B1B", borderColor: "#991B1B" }}
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

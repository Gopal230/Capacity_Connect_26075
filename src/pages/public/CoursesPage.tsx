import {
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Lock,
  Menu,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LevelBadge,
  LevelJumpBadge,
  LevelPathBar,
  StatusBadge,
  LevelEmptyState,
} from "../../components/LevelUI";
import { Badge } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { IMD_RADAR_COMPETENCIES, COMPETENCY_LEVELS } from "../../data/constants";
import { CompetencyLevel, Course } from "../../types";
import { canEnroll, formatLevel, getLevelNumber } from "../../utils/engine";

export default function CoursesPage() {
  const { db, currentUser, roleRequirements, traineeLevels, getRoleRecommendations, getTraineeLevel, requestEnrollment } = useApp();
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [recommendedOnly, setRecommendedOnly] = useState<boolean>(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(courseId || null);

  // Sync route param with active course modal
  useEffect(() => {
    if (courseId) {
      setActiveCourseId(courseId);
    }
  }, [courseId]);

  const trainee = useMemo(() => {
    return currentUser?.role === "trainee"
      ? db.trainees.find((t) => t.userId === currentUser.id)
      : null;
  }, [currentUser, db.trainees]);

  const roleRecommendations = useMemo(() => {
    return trainee ? getRoleRecommendations(trainee) : [];
  }, [trainee, getRoleRecommendations]);

  const recommendedCourseIds = useMemo(() => {
    const ids = new Set<string>();
    roleRecommendations.forEach((r) => {
      if (r.status === "Gap" && r.recommendedCourse) {
        ids.add(r.recommendedCourse.id);
      }
    });
    return ids;
  }, [roleRecommendations]);

  const enrollments = useMemo(() => {
    return trainee
      ? db.enrollments.filter((e) => e.traineeId === trainee.id && e.status !== "rejected")
      : [];
  }, [trainee, db.enrollments]);

  const published = db.courses.filter((c) => c.status === "published");

  // Competency options
  const competencies = ["all", ...IMD_RADAR_COMPETENCIES.map((c) => c.name)];

  // Filtering
  const filteredCourses = published.filter((c) => {
    const compName = c.competency || c.subject;

    // Filter by Competency
    if (selectedCompetency !== "all" && compName !== selectedCompetency) {
      return false;
    }

    // Filter by Level (matches either entry or target level)
    if (selectedLevel !== "all") {
      const matchEntry = c.entryLevel === selectedLevel;
      const matchTarget = c.targetLevel === selectedLevel;
      if (!matchEntry && !matchTarget) return false;
    }

    // Filter by "Recommended for me" toggle
    if (recommendedOnly && !recommendedCourseIds.has(c.id)) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchComp = compName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCode && !matchComp) {
        return false;
      }
    }

    return true;
  });

  const activeCourse = activeCourseId ? db.courses.find((c) => c.id === activeCourseId) : null;

  const handleOpenCourse = (id: string) => {
    setActiveCourseId(id);
    navigate(`/courses/${id}`, { replace: true });
  };

  const handleCloseModal = () => {
    setActiveCourseId(null);
    navigate("/courses", { replace: true });
  };

  return (
    <div className="public-site">
      {/* Navigation Header */}
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
          <Link to="/courses" className="active">Course Catalog</Link>
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

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Page Title */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <span className="section-kicker">STANDARDIZED OPERATIONAL CURRICULUM</span>
          <h1 style={{ fontSize: "28px", color: "var(--text-heading)", margin: "8px 0 12px", fontWeight: 700 }}>
            Competency-Based Course Catalog
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.5 }}>
            Structured learning pathways advancing radar meteorologists from L1 Awareness to L3 Proficient operational benchmarks.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", marginBottom: "16px" }}>
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: 1,
                minWidth: "260px",
                background: "#F8FAFC",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <Search size={18} color="#64748B" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by course title, code, or meteorological topic..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "13.5px",
                  background: "transparent",
                  color: "#0F172A",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: "2px" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Recommended For Me Toggle (Active for logged-in trainees) */}
            {trainee && (
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  background: recommendedOnly ? "#EFF6FF" : "#F8FAFC",
                  border: `1.5px solid ${recommendedOnly ? "#0056D2" : "#CBD5E1"}`,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: recommendedOnly ? "#0056D2" : "#334155",
                  userSelect: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={recommendedOnly}
                  onChange={(e) => setRecommendedOnly(e.target.checked)}
                  style={{ accentColor: "#0056D2", width: "16px", height: "16px" }}
                />
                <Sparkles size={15} color={recommendedOnly ? "#0056D2" : "#F59E0B"} />
                Recommended for my role ({recommendedCourseIds.size})
              </label>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            {/* Filter by Competency */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                Competency:
              </span>
              <select
                value={selectedCompetency}
                onChange={(e) => setSelectedCompetency(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1.5px solid #CBD5E1",
                  background: "#F8FAFC",
                  fontSize: "13px",
                  color: "#0F172A",
                  outline: "none",
                  fontWeight: 500,
                }}
              >
                <option value="all">All Competencies ({published.length})</option>
                {IMD_RADAR_COMPETENCIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Level */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                Level:
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { key: "all", label: "All Levels" },
                  { key: "L1", label: "L1 Awareness" },
                  { key: "L2", label: "L2 Working" },
                  { key: "L3", label: "L3 Proficient" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedLevel(item.key)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: selectedLevel === item.key ? "1.5px solid #0056D2" : "1px solid #CBD5E1",
                      background: selectedLevel === item.key ? "#0056D2" : "#F8FAFC",
                      color: selectedLevel === item.key ? "#FFFFFF" : "#334155",
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCompetency !== "all" || selectedLevel !== "all" || search !== "" || recommendedOnly) && (
              <button
                onClick={() => {
                  setSelectedCompetency("all");
                  setSelectedLevel("all");
                  setSearch("");
                  setRecommendedOnly(false);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "#64748B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
            Showing <strong>{filteredCourses.length}</strong> course{filteredCourses.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <LevelEmptyState
            type="no-course"
            message="No courses found matching your current filter criteria. Try resetting your search or filter tags."
          />
        ) : (
          <div className="course-grid">
            {filteredCourses.map((c) => {
              const compName = c.competency || c.subject;
              const currentLvl = trainee ? getTraineeLevel(trainee.id, compName) : "L1";
              const enrollment = enrollments.find((e) => e.courseId === c.id);
              const isEnrolled = Boolean(enrollment);
              const isCompleted = enrollment?.status === "completed";
              const isRecommended = recommendedCourseIds.has(c.id);

              // Check canEnroll
              const enrollCheck = canEnroll(trainee, c, currentLvl, traineeLevels);
              const isLocked = !isCompleted && !isEnrolled && !enrollCheck.canEnroll;

              const trainer = db.trainers.find((t) => t.id === c.trainerId);

              // Determine status
              let statusLabel = "";
              let statusTone: "green" | "blue" | "amber" | "gray" = "gray";

              if (isCompleted) {
                statusLabel = "Completed";
                statusTone = "green";
              } else if (isEnrolled) {
                statusLabel = "Enrolled";
                statusTone = "blue";
              } else if (isLocked) {
                statusLabel = "Locked";
                statusTone = "gray";
              } else if (isRecommended) {
                statusLabel = "Recommended";
                statusTone = "amber";
              }

              return (
                <article
                  key={c.id}
                  className={`course-card ${isLocked ? "locked" : ""}`}
                  style={{
                    background: isLocked ? "#F8FAFC" : "#FFFFFF",
                    borderColor: isLocked ? "#E2E8F0" : isRecommended ? "#BFDBFE" : "#CBD5E1",
                    opacity: isLocked ? 0.85 : 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Top Row: Competency & Jump Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                      <span className="course-category-pill" style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={compName}>
                        {compName}
                      </span>
                      {c.entryLevel && c.targetLevel ? (
                        <LevelJumpBadge from={c.entryLevel} to={c.targetLevel} size="sm" />
                      ) : (
                        <LevelBadge level={c.level} size="sm" />
                      )}
                    </div>

                    {/* Title & Status Badge */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                      <h3
                        onClick={() => handleOpenCourse(c.id)}
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: 700,
                          color: isLocked ? "#64748B" : "var(--text-heading)",
                          cursor: "pointer",
                        }}
                      >
                        {c.title}
                      </h3>
                      {statusLabel && (
                        <Badge tone={statusTone}>
                          {isLocked && <Lock size={11} style={{ marginRight: "3px" }} />}
                          {isRecommended && <Sparkles size={11} style={{ marginRight: "3px" }} />}
                          {statusLabel}
                        </Badge>
                      )}
                    </div>

                    <p style={{ fontSize: "13px", color: "var(--text-body)", margin: "0 0 12px", lineHeight: 1.45 }}>
                      {c.description}
                    </p>

                    {/* Course Meta: Duration, Trainer, Rating */}
                    <div className="course-meta" style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                      <span>
                        <Clock size={13} /> {c.durationHours} hrs
                      </span>
                      <span>
                        Trainer: {trainer?.name || "IMD Faculty"}
                      </span>
                      <span className="course-code">{c.code}</span>
                    </div>

                    {/* Locked reason banner */}
                    {isLocked && (
                      <div
                        style={{
                          background: "#FEF3C7",
                          border: "1px solid #FDE68A",
                          borderRadius: "6px",
                          padding: "8px 10px",
                          margin: "8px 0 12px",
                          fontSize: "12px",
                          color: "#92400E",
                          lineHeight: 1.35,
                        }}
                      >
                        <Lock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                        {enrollCheck.reason || `Requires level ${c.entryLevel} in ${compName} first.`}
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #E2E8F0", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleOpenCourse(c.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, textAlign: "center" }}
                    >
                      View Details
                    </button>

                    {isLocked ? (
                      <button
                        disabled
                        className="btn btn-disabled btn-sm"
                        style={{ flex: 1, cursor: "not-allowed" }}
                        title={enrollCheck.reason}
                      >
                        <Lock size={12} style={{ display: "inline", marginRight: "4px" }} />
                        Locked
                      </button>
                    ) : isCompleted ? (
                      <Link
                        to={`/trainee/learning/${c.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        Review Course
                      </Link>
                    ) : isEnrolled ? (
                      <Link
                        to={`/trainee/learning/${c.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        Continue Learning
                      </Link>
                    ) : trainee ? (
                      <button
                        onClick={() => requestEnrollment(c.id)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Enroll Now
                      </button>
                    ) : (
                      <Link
                        to={`/login?role=trainee`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, textAlign: "center" }}
                      >
                        Sign In to Enroll
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* =========================================================
          COURSE DETAILS MODAL (Prompt 6)
          "You are L? / this course takes you to L? / your role needs L?"
          outcomes list from course.outcomes
          ========================================================= */}
      {activeCourse && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: "28px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="course-category-pill">{activeCourse.competency || activeCourse.subject}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{activeCourse.code}</span>
                  {activeCourse.entryLevel && activeCourse.targetLevel && (
                    <LevelJumpBadge from={activeCourse.entryLevel} to={activeCourse.targetLevel} size="sm" />
                  )}
                </div>
                <h2 style={{ fontSize: "22px", margin: 0, color: "var(--text-heading)", fontWeight: 700 }}>
                  {activeCourse.title}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "#64748B",
                }}
                aria-label="Close Course Details"
              >
                <X size={18} />
              </button>
            </div>

            {/* TOP BANNER: "You are L? / this course takes you to L? / your role needs L?" */}
            {(() => {
              const comp = activeCourse.competency || activeCourse.subject;
              const currentLvlStr = trainee ? getTraineeLevel(trainee.id, comp) : "L1";
              const targetLvlStr = activeCourse.targetLevel || "L2";

              // Check role requirement
              const roleReqs = trainee ? (roleRequirements[trainee.jobRole || trainee.role || ""] || {}) : {};
              const roleNeedLvlStr = roleReqs[comp] || "L3";

              const enrollCheck = canEnroll(trainee, activeCourse, currentLvlStr, traineeLevels);
              const isLocked = !enrollCheck.canEnroll;
              const enrollment = enrollments.find((e) => e.courseId === activeCourse.id);
              const isEnrolled = Boolean(enrollment);
              const isCompleted = enrollment?.status === "completed";

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div
                    style={{
                      background: "#EFF6FF",
                      border: "1.5px solid #BFDBFE",
                      borderRadius: "10px",
                      padding: "16px 20px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0056D2" }}>
                        Level Progression Pathway: {comp}
                      </span>
                      <span style={{ fontSize: "12px", color: "#1E40AF", fontWeight: 600 }}>
                        You are <strong>{currentLvlStr}</strong> · Takes you to <strong>{targetLvlStr}</strong> · Role needs <strong>{roleNeedLvlStr}</strong>
                      </span>
                    </div>

                    <LevelPathBar
                      currentLevel={currentLvlStr}
                      requiredLevel={roleNeedLvlStr}
                      compact={false}
                    />
                  </div>

                  {/* Course Description */}
                  <div>
                    <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", margin: "0 0 6px", fontWeight: 700 }}>
                      Course Overview
                    </h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--text-body)", lineHeight: 1.5 }}>
                      {activeCourse.description}
                    </p>
                  </div>

                  {/* Course Outcomes List: "After this course you will be able to:" */}
                  {activeCourse.outcomes && activeCourse.outcomes.length > 0 && (
                    <div
                      style={{
                        background: "#F8FAFC",
                        border: "1.5px solid #E2E8F0",
                        borderRadius: "10px",
                        padding: "16px 20px",
                      }}
                    >
                      <h4 style={{ fontSize: "14px", margin: "0 0 10px", color: "var(--text-heading)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={16} color="#059669" />
                        After this course you will be able to:
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {activeCourse.outcomes.map((outcome, idx) => (
                          <li key={idx} style={{ fontSize: "13.5px", color: "var(--text-body)", lineHeight: 1.45 }}>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modules & Lessons Curriculum */}
                  <div>
                    <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", margin: "0 0 10px", fontWeight: 700 }}>
                      Curriculum Structure ({activeCourse.modules.length} Modules)
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {activeCourse.modules.map((m, mIdx) => (
                        <div
                          key={m.id}
                          style={{
                            background: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            padding: "10px 14px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "13px", color: "var(--text-heading)" }}>
                              Module {mIdx + 1}: {m.title}
                            </strong>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {m.lessons.length} Lessons
                            </span>
                          </div>
                          <ul style={{ margin: "6px 0 0", paddingLeft: "18px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                            {m.lessons.map((l) => (
                              <li key={l.id}>{l.title} ({l.durationMin} min)</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locked Notice / Explanation */}
                  {isLocked && (
                    <div
                      style={{
                        background: "#FEF3C7",
                        border: "1.5px solid #FDE68A",
                        borderRadius: "10px",
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <Lock size={20} color="#B45309" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong style={{ color: "#92400E", fontSize: "14px" }}>
                          Prerequisite Competency Locked
                        </strong>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#B45309", lineHeight: 1.4 }}>
                          {enrollCheck.reason || `You currently hold level ${currentLvlStr} in ${comp}. This course requires prerequisite level ${activeCourse.entryLevel}.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer / Action Button */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
                    <button
                      onClick={handleCloseModal}
                      className="btn btn-secondary"
                    >
                      Close
                    </button>

                    {isLocked ? (
                      <button
                        disabled
                        className="btn btn-disabled"
                        style={{ cursor: "not-allowed", padding: "10px 20px" }}
                        title={enrollCheck.reason}
                      >
                        <Lock size={14} style={{ display: "inline", marginRight: "6px" }} />
                        Prerequisite Locked ({activeCourse.entryLevel})
                      </button>
                    ) : isCompleted ? (
                      <Link
                        to={`/trainee/learning/${activeCourse.id}`}
                        className="btn btn-secondary"
                      >
                        Review Course
                      </Link>
                    ) : isEnrolled ? (
                      <Link
                        to={`/trainee/learning/${activeCourse.id}`}
                        className="btn btn-primary"
                      >
                        Continue Learning →
                      </Link>
                    ) : trainee ? (
                      <button
                        onClick={() => {
                          requestEnrollment(activeCourse.id);
                          handleCloseModal();
                        }}
                        className="btn btn-primary"
                      >
                        Enroll in Course
                      </button>
                    ) : (
                      <Link
                        to="/login?role=trainee"
                        className="btn btn-primary"
                      >
                        Sign In to Enroll
                      </Link>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Institutional Footer */}
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

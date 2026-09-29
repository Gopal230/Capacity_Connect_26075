import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Lock,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import MeteorologyContext from "../../components/MeteorologyContext";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { COMPETENCY_LEVELS } from "../../data/constants";
import { CompetencyLevel, Course } from "../../types";
import { formatLevel, getLevelNumber } from "../../utils/engine";
import {
  LevelBadge,
  LevelJumpBadge,
  LevelPathBar,
  StatusBadge,
  CompetencyCardRow,
  LevelEmptyState,
} from "../../components/LevelUI";

export default function TraineeDashboard() {
  const {
    db,
    currentUser,
    getRoleRecommendations,
    getNextStep,
    getTraineeLevel,
    requestEnrollment,
  } = useApp();

  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";

  // Enrollments and Certificates
  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );
  const certs = db.certificates.filter((c) => c.traineeId === trainee?.id);

  // Recommendations and gaps from Phase 3 engine
  const roleRecommendations = getRoleRecommendations(trainee);
  const nextStep = getNextStep(trainee);

  // 1. Four Stat Cards metrics
  const competenciesMet = roleRecommendations.filter((r) => r.status === "Met").length;
  const competenciesWithGap = roleRecommendations.filter((r) => r.status === "Gap").length;
  const totalLevelsStillToGain = roleRecommendations.reduce((sum, r) => sum + r.gap, 0);
  const enrolledCoursesCount = enrollments.length;

  // Helper for level titles
  const getLevelLabel = (lvl: string) => {
    const item = COMPETENCY_LEVELS[lvl as CompetencyLevel];
    return item ? item.fullName : lvl;
  };

  // 4. Available courses grouping
  // Recommended courses for immediate gaps
  const recommendedCoursesMap = new Map<string, Course>();
  roleRecommendations.forEach((item) => {
    if (item.status === "Gap" && item.recommendedCourse) {
      recommendedCoursesMap.set(item.recommendedCourse.id, item.recommendedCourse);
    }
  });
  const recommendedCourses = Array.from(recommendedCoursesMap.values());

  // Other courses
  const publishedCourses = db.courses.filter((c) => c.status === "published");
  const otherCourses = publishedCourses.filter((c) => !recommendedCoursesMap.has(c.id));

  return (
    <>
      <PageHeader
        title={`Welcome, ${trainee?.name || "Trainee"}`}
        subtitle={`Role: ${jobRole} · Step-by-Step Level-Based Competency Progression`}
      />

      <MeteorologyContext />

      {/* ========================================================
          TEMPORARY UI KIT TEST SHOWCASE (PROMPT 4)
          Will be removed in Prompt 5
          ======================================================== */}
      <section
        className="card"
        style={{
          marginBottom: "2rem",
          border: "2px dashed #0056D2",
          background: "#FFFFFF",
          padding: "1.75rem",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0, 86, 210, 0.08)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "1.5rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0056D2", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "3px 8px", borderRadius: "9999px" }}>
              Prompt 4 Test Showcase · Temporary
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "8px 0 4px", color: "var(--text-heading)" }}>
              Level-Based Competency UI Kit
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Standardized components designed for Trainee, Trainer, and Admin views with strict accessibility (numbers + names alongside color tokens).
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Component 1: Level Badges */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              1. Level Badges (Normal & Small)
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748B", minWidth: "60px" }}>Normal:</span>
              <LevelBadge level="L1" />
              <LevelBadge level="L2" />
              <LevelBadge level="L3" />
              <LevelBadge level="L4" />
              <LevelBadge level="L5" />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B", minWidth: "60px" }}>Small:</span>
              <LevelBadge level={1} size="sm" />
              <LevelBadge level={2} size="sm" />
              <LevelBadge level={3} size="sm" />
              <LevelBadge level={4} size="sm" />
              <LevelBadge level={5} size="sm" />
            </div>
          </div>

          {/* Component 2: Level Jump Badges */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              2. Level Jump Badges (With Arrow)
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <LevelJumpBadge from="L1" to="L2" />
              <LevelJumpBadge from="L2" to="L3" />
              <LevelJumpBadge from="L1" to="L3" />
              <LevelJumpBadge from={1} to={2} size="sm" />
              <LevelJumpBadge from={2} to={3} size="sm" />
            </div>
          </div>

          {/* Component 3: Level Path Bar */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              3. Level Path Bar (Connected Steps, Required Marker, L4/L5 Coming Soon)
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                  Standard Full Width (Current: L2 Working · Target: L3 Proficient)
                </p>
                <LevelPathBar currentLevel="L2" requiredLevel="L3" />
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                  Standard Full Width (Current: L3 Proficient · Target: L3 Proficient [Met])
                </p>
                <LevelPathBar currentLevel="L3" requiredLevel="L3" />
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#475569", fontWeight: 600 }}>
                  Compact Table Row Version (Current: L1 · Target: L2)
                </p>
                <div style={{ maxWidth: "260px" }}>
                  <LevelPathBar currentLevel="L1" requiredLevel="L2" compact={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Component 4: Status Badges */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              4. Status Badges
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <StatusBadge status="Met" />
              <StatusBadge status="Gap" />
              <StatusBadge status="no-course" />
              <StatusBadge status="locked" />
              <StatusBadge status="Met" size="sm" />
              <StatusBadge status="Gap" size="sm" />
              <StatusBadge status="no-course" size="sm" />
              <StatusBadge status="locked" size="sm" />
            </div>
          </div>

          {/* Component 5: Competency Card / Row */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              5. Competency Card / Row
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <CompetencyCardRow
                name="Doppler Radar Operations"
                currentLevel="L2"
                requiredLevel="L3"
                status="Gap"
                recommendedCourseTitle="Advanced Radar Scanning Strategies"
              />
              <CompetencyCardRow
                name="Basic Meteorology"
                currentLevel="L2"
                requiredLevel="L2"
                status="Met"
              />
              <CompetencyCardRow
                name="Numerical Weather Prediction Assimilation"
                currentLevel="L1"
                requiredLevel="L2"
                status="no-course"
              />
            </div>
          </div>

          {/* Component 6: Empty / Message States */}
          <div>
            <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748B", marginBottom: "8px", fontWeight: 700 }}>
              6. Empty / Message States
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
              <LevelEmptyState type="all-met" />
              <LevelEmptyState type="no-course" />
              <LevelEmptyState type="no-requirements" />
            </div>
          </div>
        </div>
      </section>

      {/* 1. Four Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Competencies Met"
          value={competenciesMet}
          icon={<CheckCircle2 className="text-emerald-600" />}
          caption={roleRecommendations.length > 0 ? `Out of ${roleRecommendations.length} required` : "No role assigned"}
        />
        <StatCard
          label="Competencies With Gap"
          value={competenciesWithGap}
          icon={<AlertTriangle className="text-amber-600" />}
          caption="Requires progressive training"
        />
        <StatCard
          label="Total Levels Still To Gain"
          value={totalLevelsStillToGain}
          icon={<TrendingUp className="text-blue-600" />}
          caption="Steps to operational readiness"
        />
        <StatCard
          label="My Courses"
          value={enrolledCoursesCount}
          icon={<GraduationCap className="text-blue-600" />}
          caption="Enrolled or completed"
        />
      </div>

      {/* 3. Recommended Next Step Card */}
      {roleRecommendations.length > 0 && competenciesWithGap === 0 ? (
        <section className="next-step-panel ready-state">
          <div className="next-step-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CheckCircle2 size={24} color="#10B981" />
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", color: "#065F46" }}>
                  Operational Readiness Achieved
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#047857" }}>
                  All role competency requirements met. You are operationally ready.
                </p>
              </div>
            </div>
            <Badge tone="green">Operationally Ready</Badge>
          </div>
        </section>
      ) : nextStep && nextStep.recommendedCourse ? (
        (() => {
          const course = nextStep.recommendedCourse;
          const isEnrolled = enrollments.some((e) => e.courseId === course.id);
          const targetRank = getLevelNumber(course.targetLevel);
          const remainingAfter = Math.max(0, nextStep.requiredRank - targetRank);

          return (
            <section className="next-step-panel">
              <div className="next-step-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={20} color="#0056D2" />
                  <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0056D2" }}>
                    Recommended Next Step
                  </span>
                </div>
                <Badge tone="blue">Priority Gap: {nextStep.competency}</Badge>
              </div>

              <div className="next-step-content">
                <div className="next-step-info">
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Focus Competency: <strong>{nextStep.competency}</strong>
                  </span>
                  <h4 className="next-step-title">{course.title}</h4>
                  <p style={{ fontSize: "13.5px", color: "var(--text-body)", margin: "0 0 12px", maxWidth: "650px" }}>
                    {course.description}
                  </p>
                  <div className="next-step-meta">
                    <Badge tone="amber">
                      Level Jump: {course.entryLevel} to {course.targetLevel}
                    </Badge>
                    <span style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
                      {remainingAfter === 0 ? (
                        <strong style={{ color: "#10B981" }}>Reaches required role level ({nextStep.requiredLevel})!</strong>
                      ) : (
                        <span>
                          <strong>{remainingAfter}</strong> level{remainingAfter > 1 ? "s" : ""} to go after this to reach {nextStep.requiredLevel}
                        </span>
                      )}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      · {course.durationHours} hrs · Trainer: {db.trainers.find((t) => t.id === course.trainerId)?.name || "IMD Faculty"}
                    </span>
                  </div>
                </div>

                <div>
                  {isEnrolled ? (
                    <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary">
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={() => requestEnrollment(course.id)}
                      className="btn btn-primary"
                    >
                      Enroll in Recommended Course
                    </button>
                  )}
                </div>
              </div>
            </section>
          );
        })()
      ) : null}

      {/* 2. Competency Profile Section */}
      <section className="competency-profile-panel">
        <div className="panel-head">
          <div>
            <h3>Competency Profile ({jobRole})</h3>
            <p>Your current skill levels compared with required operational levels for your role</p>
          </div>
          <Link to="/trainee/competency" className="text-link">
            Self Assessment Check
          </Link>
        </div>

        {roleRecommendations.length === 0 ? (
          <div className="empty-inline">
            <p>No role competency requirements found for "{jobRole}".</p>
          </div>
        ) : (
          <div className="competency-table-wrapper">
            <table className="competency-table">
              <thead>
                <tr>
                  <th style={{ width: "28%" }}>Competency</th>
                  <th style={{ width: "18%" }}>Current Level</th>
                  <th style={{ width: "18%" }}>Required Level</th>
                  <th style={{ width: "12%" }}>Status</th>
                  <th style={{ width: "24%" }}>5-Step Level Progress</th>
                </tr>
              </thead>
              <tbody>
                {roleRecommendations.map((item) => {
                  const isMet = item.status === "Met";

                  return (
                    <tr key={item.competency}>
                      <td>
                        <strong>{item.competency}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: isMet ? "#047857" : "#0056D2" }}>
                          {getLevelLabel(item.currentLevel)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                          {getLevelLabel(item.requiredLevel)}
                        </span>
                      </td>
                      <td>
                        {isMet ? (
                          <Badge tone="green">Met</Badge>
                        ) : (
                          <Badge tone="amber">Gap ({item.gap} lvl)</Badge>
                        )}
                      </td>
                      <td>
                        {/* 5-Step Visual Level Bar */}
                        <div
                          className="level-bar-container"
                          title={`Current: ${item.currentLevel}, Required: ${item.requiredLevel}`}
                        >
                          {[1, 2, 3, 4, 5].map((lvlNum) => {
                            const lvlStr = formatLevel(lvlNum);
                            const isFilled = lvlNum <= item.currentRank;
                            const isTarget = lvlNum === item.requiredRank;

                            return (
                              <div
                                key={lvlNum}
                                className={`level-step ${isFilled ? "filled" : ""} ${
                                  isFilled && isMet ? "met" : ""
                                } ${isTarget ? "is-target" : ""}`}
                                title={`${lvlStr} ${COMPETENCY_LEVELS[lvlStr as CompetencyLevel]?.name || ""}${
                                  isTarget ? " (Role Target)" : ""
                                }`}
                              >
                                {isTarget && (
                                  <span className="target-pin" title="Role Target Level">
                                    Target
                                  </span>
                                )}
                                <span>{lvlStr}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5. My Courses Section */}
      <section className="panel" style={{ marginBottom: "24px" }}>
        <div className="panel-head">
          <div>
            <h3>My Courses</h3>
            <p>Active enrollments, progress, and target level advancement</p>
          </div>
          <Link to="/trainee/learning" className="text-link">
            Open Learning Hub
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty-inline">
            <p>You have not enrolled in any courses yet.</p>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Explore the recommended courses below to begin closing your competency gaps.
            </p>
          </div>
        ) : (
          <div className="progress-list">
            {enrollments.map((e) => {
              const course = db.courses.find((c) => c.id === e.courseId);
              const trainer = db.trainers.find((t) => t.id === course?.trainerId);

              return (
                <div key={e.id} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 0", borderBottom: "1px solid var(--border-clean)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <strong>{course?.title || e.courseId}</strong>
                        {course?.entryLevel && course?.targetLevel ? (
                          <Badge tone="blue">{course.entryLevel} to {course.targetLevel}</Badge>
                        ) : (
                          <Badge tone="gray">{course?.level || "General"}</Badge>
                        )}
                        <Badge tone={e.status === "completed" ? "green" : "blue"}>{e.status}</Badge>
                      </div>
                      <small style={{ color: "var(--text-muted)" }}>
                        {course?.competency || course?.subject} · Trainer: {trainer?.name || "IMD Faculty"}
                      </small>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <b>{e.progress}%</b>
                      <Link to={`/trainee/learning/${e.courseId}`} className="btn btn-secondary btn-sm">
                        Open Course
                      </Link>
                    </div>
                  </div>
                  <ProgressBar value={e.progress} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Phase 7: My Certificates and Verified Levels Section */}
      <section className="panel" style={{ marginBottom: "24px" }}>
        <div className="panel-head">
          <div>
            <h3>My Certificates & Verified Levels</h3>
            <p>Official records of achieved competency levels and operational qualifications</p>
          </div>
          <Link to="/trainee/certificates" className="text-link">
            View Certificate Records
          </Link>
        </div>

        {certs.length === 0 ? (
          <div className="empty-inline">
            <p>No verified certificates earned yet.</p>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Complete course modules and pass post-training assessments to advance your levels and earn official certificates.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px", marginTop: "12px" }}>
            {certs.map((c) => {
              const course = db.courses.find((x) => x.id === c.courseId);
              return (
                <div
                  key={c.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #CBD5E1",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0056D2", background: "#EFF6FF", padding: "2px 8px", borderRadius: "4px" }}>
                        {c.certificateCode}
                      </span>
                      {c.levelAchieved && (
                        <Badge tone="green">
                          Level {c.levelAchieved}
                        </Badge>
                      )}
                    </div>
                    <h4 style={{ margin: "4px 0", fontSize: "15px", color: "var(--text-heading)" }}>
                      {c.competency}
                    </h4>
                    <p style={{ margin: "0 0 8px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                      Course: {course?.title || c.courseId}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "10px", marginTop: "8px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                    <span>Issued: {c.issuedAt}</span>
                    <Link to="/trainee/certificates" className="btn btn-secondary btn-sm" style={{ padding: "4px 10px", fontSize: "11.5px" }}>
                      View Certificate
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Available Courses Section */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Course Catalog & Level Prerequisites</h3>
            <p>Courses organized by your role recommendations and current qualification level</p>
          </div>
        </div>

        {/* Group A: Recommended for your role */}
        <div className="section-divider-title" style={{ marginTop: 0 }}>
          <div>
            <h3>Recommended for your role</h3>
            <p>Immediate next-level courses to address identified competency gaps</p>
          </div>
          <Badge tone="blue">{recommendedCourses.length} Recommended</Badge>
        </div>

        {recommendedCourses.length === 0 ? (
          <div className="empty-inline" style={{ padding: "18px 0" }}>
            <p>
              {competenciesWithGap === 0
                ? "No immediate course recommendations. All required competency levels are currently met!"
                : "No courses are currently available for your immediate level gap."}
            </p>
          </div>
        ) : (
          <div className="course-grid-catalog">
            {recommendedCourses.map((course) => {
              const isEnrolled = enrollments.some((e) => e.courseId === course.id);
              const trainer = db.trainers.find((t) => t.id === course.trainerId);

              return (
                <div key={course.id} className="course-card-modern">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <Badge tone="blue">
                        {course.entryLevel} to {course.targetLevel}
                      </Badge>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                        {course.code}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "15px", margin: "0 0 6px", color: "var(--text-heading)" }}>
                      {course.title}
                    </h4>

                    <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: "0 0 10px", lineHeight: 1.4 }}>
                      {course.description}
                    </p>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                      <span><strong>Competency:</strong> {course.competency || course.subject}</span>
                      <br />
                      <span>{course.durationHours} hrs · Trainer: {trainer?.name || "IMD Faculty"}</span>
                    </div>
                  </div>

                  <div>
                    {isEnrolled ? (
                      <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary btn-block btn-sm">
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={() => requestEnrollment(course.id)}
                        className="btn btn-primary btn-block btn-sm"
                      >
                        Enroll in Course
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Group B: Other courses */}
        <div className="section-divider-title" style={{ marginTop: "32px" }}>
          <div>
            <h3>Other courses</h3>
            <p>Higher-level or alternative courses in the IMD training catalog</p>
          </div>
          <Badge tone="gray">{otherCourses.length} Courses</Badge>
        </div>

        {otherCourses.length === 0 ? (
          <div className="empty-inline" style={{ padding: "18px 0" }}>
            <p>No other courses available.</p>
          </div>
        ) : (
          <div className="course-grid-catalog">
            {otherCourses.map((course) => {
              const isEnrolled = enrollments.some((e) => e.courseId === course.id);
              const trainer = db.trainers.find((t) => t.id === course.trainerId);

              // Check if locked
              const courseComp = course.competency || course.subject;
              const currentLevelStr = courseComp ? getTraineeLevel(trainee?.id || "", courseComp) : "L1";
              const currentRank = getLevelNumber(currentLevelStr);
              const entryRank = course.entryLevel ? getLevelNumber(course.entryLevel) : 1;
              const isLocked = entryRank > currentRank;

              return (
                <div
                  key={course.id}
                  className={`course-card-modern ${isLocked ? "locked" : ""}`}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <Badge tone={isLocked ? "gray" : "blue"}>
                        {course.entryLevel && course.targetLevel ? `${course.entryLevel} to ${course.targetLevel}` : course.level}
                      </Badge>

                      {isLocked ? (
                        <span className="locked-badge-pill" title={`Requires ${course.entryLevel} in ${courseComp}`}>
                          <Lock size={12} /> Requires {course.entryLevel} first
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                          {course.code}
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: "15px", margin: "0 0 6px", color: isLocked ? "#64748B" : "var(--text-heading)" }}>
                      {course.title}
                    </h4>

                    <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: "0 0 10px", lineHeight: 1.4 }}>
                      {course.description}
                    </p>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                      <span><strong>Competency:</strong> {course.competency || course.subject}</span>
                      <br />
                      <span>{course.durationHours} hrs · Trainer: {trainer?.name || "IMD Faculty"}</span>
                    </div>

                    {isLocked && (
                      <p style={{ fontSize: "11.5px", color: "#92400E", background: "#FEF3C7", padding: "6px 8px", borderRadius: "4px", margin: "0 0 12px" }}>
                        Locked: Your current level in {courseComp} is {currentLevelStr}. Reach {course.entryLevel} to unlock.
                      </p>
                    )}
                  </div>

                  <div>
                    {isLocked ? (
                      <button
                        disabled
                        className="btn btn-disabled btn-block btn-sm"
                        title={`Requires ${course.entryLevel} first`}
                      >
                        <Lock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                        Locked (Requires {course.entryLevel})
                      </button>
                    ) : isEnrolled ? (
                      <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary btn-block btn-sm">
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={() => requestEnrollment(course.id)}
                        className="btn btn-primary btn-block btn-sm"
                      >
                        Enroll in Course
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
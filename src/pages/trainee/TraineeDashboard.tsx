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

  // Enrollments
  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );

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
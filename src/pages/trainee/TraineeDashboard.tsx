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
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import {
  LevelBadge,
  LevelJumpBadge,
  LevelPathBar,
  StatusBadge,
  LevelEmptyState,
} from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { COMPETENCY_LEVELS } from "../../data/constants";
import { CompetencyLevel, Course } from "../../types";
import { canEnroll, formatLevel, getLevelNumber } from "../../utils/engine";

export default function TraineeDashboard() {
  const {
    db,
    currentUser,
    roleRequirements,
    traineeLevels,
    certificates,
    getRoleRecommendations,
    getNextStep,
    getTraineeLevel,
    requestEnrollment,
  } = useApp();

  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";

  // Enrollments and Certificates (from KEYS.CERTIFICATES and db.certificates)
  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );
  const allCerts = [...certificates, ...db.certificates];
  const certs = allCerts.filter(
    (c, index, self) =>
      c.traineeId === trainee?.id &&
      index === self.findIndex((t) => t.id === c.id || (t.courseId === c.courseId && t.levelAchieved === c.levelAchieved))
  );

  // Recommendations and gaps from Phase 3 engine
  const roleRecommendations = getRoleRecommendations(trainee);
  const nextStep = getNextStep(trainee);

  // 1. Summary Metrics
  const competenciesMet = roleRecommendations.filter((r) => r.status === "Met").length;
  const competenciesWithGap = roleRecommendations.filter((r) => r.status === "Gap").length;
  const totalLevelsStillToGain = roleRecommendations.reduce((sum, r) => sum + r.gap, 0);
  const enrolledCoursesCount = enrollments.length;

  // 4. Sorted Competency Profile: largest gap first, Met last
  const sortedRecommendations = [...roleRecommendations].sort((a, b) => {
    if (a.status === "Gap" && b.status === "Met") return -1;
    if (a.status === "Met" && b.status === "Gap") return 1;
    return b.gap - a.gap;
  });

  // 6. Available Courses grouping
  const recommendedCoursesMap = new Map<string, Course>();
  roleRecommendations.forEach((item) => {
    if (item.status === "Gap" && item.recommendedCourse) {
      recommendedCoursesMap.set(item.recommendedCourse.id, item.recommendedCourse);
    }
  });
  const recommendedCourses = Array.from(recommendedCoursesMap.values());

  const publishedCourses = db.courses.filter((c) => c.status === "published");
  const otherCourses = publishedCourses.filter((c) => !recommendedCoursesMap.has(c.id));

  return (
    <>
      {/* 1. Welcome Header: name, job role, and "X of Y competencies met" */}
      <PageHeader
        title={`Welcome, ${trainee?.name || currentUser?.name || "Trainee"}`}
        subtitle={
          roleRecommendations.length > 0
            ? `Role: ${jobRole} · ${competenciesMet} of ${roleRecommendations.length} competencies met`
            : `Role: ${jobRole || "Unassigned"}`
        }
      />

      {/* 2. Summary Strip: Competencies Met, With Gap, Levels Still To Gain, My Courses */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <StatCard
          label="Competencies Met"
          value={competenciesMet}
          icon={<CheckCircle2 className="text-emerald-600" />}
          caption={roleRecommendations.length > 0 ? `Out of ${roleRecommendations.length} required` : "No role assigned"}
        />
        <StatCard
          label="With Gap"
          value={competenciesWithGap}
          icon={<AlertTriangle className="text-amber-600" />}
          caption="Requires progressive training"
        />
        <StatCard
          label="Levels Still To Gain"
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

      {/* 3. "Recommended Next Step" hero card */}
      {roleRecommendations.length > 0 && competenciesWithGap === 0 ? (
        <section
          className="card congratulations-hero"
          style={{
            borderLeft: "6px solid #10B981",
            background: "#F0FDF4",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "28px",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div
              style={{
                background: "#DCFCE7",
                color: "#15803D",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#15803D", background: "#DCFCE7", padding: "3px 8px", borderRadius: "9999px", marginBottom: "6px" }}>
                Operational Readiness Achieved
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: "19px", color: "#14532D", fontWeight: 700 }}>
                Congratulations! All Role Competencies Met
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#166534", lineHeight: 1.5 }}>
                You have reached or exceeded all required benchmark levels for <strong>{jobRole}</strong>. You are fully qualified for operational radar deployment and severe weather surveillance.
              </p>
            </div>
            <Link to="/trainee/certificates" className="btn btn-secondary" style={{ whiteSpace: "nowrap" }}>
              View Qualifications & Passport
            </Link>
          </div>
        </section>
      ) : nextStep && nextStep.recommendedCourse ? (
        (() => {
          const course = nextStep.recommendedCourse;
          const isEnrolled = enrollments.some((e) => e.courseId === course.id);
          const targetRank = getLevelNumber(course.targetLevel);
          const remainingAfter = Math.max(0, nextStep.requiredRank - targetRank);

          return (
            <section
              className="card next-step-hero"
              style={{
                borderLeft: "6px solid #0056D2",
                background: "#FFFFFF",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "28px",
                boxShadow: "0 4px 14px rgba(0, 86, 210, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={20} color="#0056D2" />
                  <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0056D2" }}>
                    Recommended Next Step
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <LevelJumpBadge from={course.entryLevel || "L1"} to={course.targetLevel || "L2"} />
                  <Badge tone="blue">Priority Gap: {nextStep.competency}</Badge>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Target Competency: <strong>{nextStep.competency}</strong>
                  </span>
                  <h3 style={{ fontSize: "1.25rem", margin: "0 0 8px", color: "var(--text-heading)", fontWeight: 700 }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "var(--text-body)", margin: "0 0 12px", lineHeight: 1.5, maxWidth: "680px" }}>
                    {course.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", fontSize: "12.5px", color: "var(--text-muted)" }}>
                    <span style={{ color: remainingAfter === 0 ? "#15803D" : "#C2410C", fontWeight: 600 }}>
                      {remainingAfter === 0 ? (
                        "✓ Reaches required role level upon completion!"
                      ) : (
                        `• ${remainingAfter} level${remainingAfter > 1 ? "s" : ""} to go after this to reach ${nextStep.requiredLevel}`
                      )}
                    </span>
                    <span>· Duration: {course.durationHours} hrs</span>
                    <span>· Trainer: {db.trainers.find((t) => t.id === course.trainerId)?.name || "IMD Faculty"}</span>
                  </div>
                </div>

                <div>
                  {isEnrolled ? (
                    <Link
                      to={`/trainee/learning/${course.id}`}
                      className="btn btn-secondary btn-lg"
                      style={{ padding: "12px 24px", fontSize: "15px", fontWeight: 700 }}
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={() => requestEnrollment(course.id)}
                      className="btn btn-primary btn-lg"
                      style={{ padding: "12px 24px", fontSize: "15px", fontWeight: 700 }}
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

      {/* 4. Competency Profile: competency cards with level path bar, sorted largest gap first, Met last */}
      <section className="panel" style={{ marginBottom: "28px" }}>
        <div className="panel-head">
          <div>
            <h3>Competency Profile ({jobRole})</h3>
            <p>Your current skill levels sorted by largest operational gap first</p>
          </div>
          <Link to="/trainee/competency" className="text-link">
            Self Assessment Check
          </Link>
        </div>

        {roleRecommendations.length === 0 ? (
          <LevelEmptyState
            type="no-requirements"
            message={`No role requirements set for "${jobRole}". Please contact your station training supervisor.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
            {sortedRecommendations.map((item) => {
              const isMet = item.status === "Met";
              const course = item.recommendedCourse;
              const hasNoCourse = item.status === "Gap" && !course;

              return (
                <div
                  key={item.competency}
                  style={{
                    background: "#FFFFFF",
                    border: `1.5px solid ${isMet ? "#E2E8F0" : "#CBD5E1"}`,
                    borderLeft: `5px solid ${isMet ? "#10B981" : "#EA580C"}`,
                    borderRadius: "10px",
                    padding: "16px 20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", color: "var(--text-heading)", fontWeight: 700 }}>
                        {item.competency}
                      </h4>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Current:</span>
                        <LevelBadge level={item.currentLevel} size="sm" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Required:</span>
                        <LevelBadge level={item.requiredLevel} size="sm" />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <LevelPathBar
                      currentLevel={item.currentLevel}
                      requiredLevel={item.requiredLevel}
                      compact={false}
                    />
                  </div>

                  {/* Recommended course link or No course empty state */}
                  {item.status === "Gap" && course && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginTop: "10px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Recommended Course:</span>
                        <strong style={{ fontSize: "13px", color: "var(--brand-primary)" }}>{course.title}</strong>
                        <LevelJumpBadge from={course.entryLevel || "L1"} to={course.targetLevel || "L2"} size="sm" />
                      </div>
                      <div>
                        {enrollments.some((e) => e.courseId === course.id) ? (
                          <Link to={`/trainee/learning/${course.id}`} className="btn btn-secondary btn-sm">
                            Continue Learning
                          </Link>
                        ) : (
                          <button
                            onClick={() => requestEnrollment(course.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Enroll in Course
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {hasNoCourse && (
                    <div
                      style={{
                        background: "#F8FAFC",
                        border: "1px dashed #CBD5E1",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      No course available yet for this level gap. Central Training Directorate syllabus pending.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. My Courses: existing cards plus jump badge, competency label and progress */}
      <section className="panel" style={{ marginBottom: "28px" }}>
        <div className="panel-head">
          <div>
            <h3>My Courses</h3>
            <p>Active course enrollments with level advancement milestones</p>
          </div>
          <Link to="/trainee/learning" className="text-link">
            Open Learning Hub
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty-inline" style={{ padding: "20px 0" }}>
            <p>You have not enrolled in any courses yet.</p>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Explore the recommended courses below to begin closing your operational gaps.
            </p>
          </div>
        ) : (
          <div className="progress-list">
            {enrollments.map((e) => {
              const course = db.courses.find((c) => c.id === e.courseId);
              const trainer = db.trainers.find((t) => t.id === course?.trainerId);
              const compName = course?.competency || course?.subject;

              return (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--border-clean)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "15px", color: "var(--text-heading)" }}>{course?.title || e.courseId}</strong>
                        {course?.entryLevel && course?.targetLevel ? (
                          <LevelJumpBadge from={course.entryLevel} to={course.targetLevel} size="sm" />
                        ) : (
                          <Badge tone="gray">{course?.level || "General"}</Badge>
                        )}
                        <Badge tone={e.status === "completed" ? "green" : "blue"}>{e.status}</Badge>
                      </div>
                      <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        <strong>Competency:</strong> {compName} · Trainer: {trainer?.name || "IMD Faculty"} · Code: {course?.code}
                      </small>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>{e.progress}%</span>
                      <Link to={`/trainee/learning/${e.courseId}`} className="btn btn-secondary btn-sm">
                        Continue Learning
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

      {/* 6. Courses catalog: "Recommended for your role" then "Other courses" */}
      <section className="panel" style={{ marginBottom: "28px" }}>
        <div className="panel-head">
          <div>
            <h3>Course Catalog & Level Prerequisites</h3>
            <p>Targeted courses organized by role priority and qualification eligibility</p>
          </div>
        </div>

        {/* 6A: Recommended for your role */}
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
              const compName = course.competency || course.subject;

              return (
                <div key={course.id} className="course-card-modern">
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <LevelJumpBadge from={course.entryLevel || "L1"} to={course.targetLevel || "L2"} size="sm" />
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                        {course.code}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "15px", margin: "0 0 6px", color: "var(--text-heading)", fontWeight: 700 }}>
                      {course.title}
                    </h4>

                    <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: "0 0 10px", lineHeight: 1.4 }}>
                      {course.description}
                    </p>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                      <span><strong>Competency:</strong> {compName}</span>
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

        {/* 6B: Other courses */}
        <div className="section-divider-title" style={{ marginTop: "32px" }}>
          <div>
            <h3>Other courses</h3>
            <p>Courses requiring higher prerequisite qualifications or alternative subjects</p>
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
              const courseComp = course.competency || course.subject;
              const currentLvl = courseComp ? getTraineeLevel(trainee?.id || "", courseComp) : "L1";

              // Check canEnroll
              const enrollCheck = canEnroll(trainee, course, currentLvl, traineeLevels);
              const isLocked = !enrollCheck.canEnroll;

              return (
                <div
                  key={course.id}
                  className={`course-card-modern ${isLocked ? "locked" : ""}`}
                  style={isLocked ? { background: "#F8FAFC", borderColor: "#E2E8F0", opacity: 0.85 } : {}}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      {course.entryLevel && course.targetLevel ? (
                        <LevelJumpBadge from={course.entryLevel} to={course.targetLevel} size="sm" />
                      ) : (
                        <Badge tone={isLocked ? "gray" : "blue"}>{course.level}</Badge>
                      )}

                      {isLocked ? (
                        <span className="locked-badge-pill" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#B45309", background: "#FEF3C7", padding: "2px 8px", borderRadius: "9999px", fontWeight: 600 }}>
                          <Lock size={12} /> Prerequisite Locked
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                          {course.code}
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: "15px", margin: "0 0 6px", color: isLocked ? "#64748B" : "var(--text-heading)", fontWeight: 700 }}>
                      {course.title}
                    </h4>

                    <p style={{ fontSize: "12.5px", color: "var(--text-body)", margin: "0 0 10px", lineHeight: 1.4 }}>
                      {course.description}
                    </p>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                      <span><strong>Competency:</strong> {courseComp}</span>
                      <br />
                      <span>{course.durationHours} hrs · Trainer: {trainer?.name || "IMD Faculty"}</span>
                    </div>

                    {isLocked && (
                      <p style={{ fontSize: "11.5px", color: "#92400E", background: "#FEF3C7", padding: "6px 8px", borderRadius: "6px", margin: "0 0 12px", lineHeight: 1.3 }}>
                        <Lock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                        {enrollCheck.reason || `Requires ${course.entryLevel} first.`}
                      </p>
                    )}
                  </div>

                  <div>
                    {isLocked ? (
                      <button
                        disabled
                        className="btn btn-disabled btn-block btn-sm"
                        title={enrollCheck.reason}
                        style={{ cursor: "not-allowed" }}
                      >
                        <Lock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                        Locked ({course.entryLevel})
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

      {/* 7. Certificates and Verified Levels Section (Empty state for now, filled in later step) */}
      <section className="panel" style={{ marginBottom: "28px" }}>
        <div className="panel-head">
          <div>
            <h3>Certificates & Verified Levels</h3>
            <p>Official records of achieved competency levels and operational qualifications</p>
          </div>
          <Link to="/trainee/certificates" className="text-link">
            View Certificate Records
          </Link>
        </div>

        {certs.length === 0 ? (
          <div
            style={{
              background: "#F8FAFC",
              border: "1.5px dashed #CBD5E1",
              borderRadius: "10px",
              padding: "32px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#EFF6FF",
                color: "#0056D2",
                display: "grid",
                placeItems: "center",
                marginBottom: "12px",
              }}
            >
              <Award size={26} />
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--text-heading)", fontWeight: 700 }}>
              No Verified Certificates Earned Yet
            </h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)", maxWidth: "480px", lineHeight: 1.5 }}>
              Complete course modules and pass post-training assessments with 100% lesson completion to advance your competency levels and receive official IMD credentials.
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
                        <LevelBadge level={c.levelAchieved} size="sm" />
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
    </>
  );
}
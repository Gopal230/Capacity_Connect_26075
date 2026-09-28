import { Award, BookOpen, CheckCircle2, ChevronRight, GraduationCap, Lock, Play, ShieldAlert, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { getLevelNumber, operationalReadiness } from "../../utils/engine";
import MeteorologyContext from "../../components/MeteorologyContext";

export default function TraineeDashboard() {
  const { db, currentUser, levelRecommendationsForCurrentTrainee, requestEnrollment } = useApp();
  const trainee = db.trainees.find(t => t.userId === currentUser?.id);
  const recs = levelRecommendationsForCurrentTrainee();
  const enrollments = db.enrollments.filter(e => e.traineeId === trainee?.id && e.status !== "rejected");
  const certs = db.certificates.filter(c => c.traineeId === trainee?.id);
  const readiness = trainee ? operationalReadiness(db, trainee.id) : null;

  const competencies = trainee?.competencies || [
    { name: "Radar Interpretation", currentLevel: "L1" as const, targetLevel: "L3" as const, lastAssessmentScore: 45 },
    { name: "Synoptic Forecasting", currentLevel: "L2" as const, targetLevel: "L3" as const, lastAssessmentScore: 68 },
    { name: "Satellite Meteorology", currentLevel: "L2" as const, targetLevel: "L2" as const, lastAssessmentScore: 75 }
  ];

  const totalGaps = competencies.reduce((acc, c) => {
    const gap = Math.max(0, getLevelNumber(c.targetLevel) - getLevelNumber(c.currentLevel));
    return acc + gap;
  }, 0);

  return (
    <>
      <PageHeader
        title={`Welcome, ${trainee?.name || "Trainee"}`}
        subtitle={`${trainee?.role || trainee?.designation || "Operational Forecaster"} · ${trainee?.centre || trainee?.department || "IMD Centre"}`}
      />

      <MeteorologyContext />

      {/* STATS OVERVIEW */}
      <div className="stats-grid">
        <StatCard
          label="Operational Readiness"
          value={readiness ? `${readiness.score}/100` : "—"}
          caption={readiness?.band}
          icon={<Target />}
        />
        <StatCard
          label="Active Competency Gaps"
          value={totalGaps === 0 ? "Target Met" : `${totalGaps} Level Gap${totalGaps > 1 ? "s" : ""}`}
          caption={totalGaps === 0 ? "All role requirements achieved" : "Governed step-by-step path"}
          icon={<ShieldAlert />}
        />
        <StatCard
          label="Enrolled Courses"
          value={enrollments.length}
          caption={`${enrollments.filter(e => e.progress === 100).length} completed`}
          icon={<GraduationCap />}
        />
        <StatCard
          label="Certificates Earned"
          value={certs.length}
          caption="Verified competency credentials"
          icon={<Award />}
        />
      </div>

      {/* LEVEL-BASED LEARNING PATH & COMPETENCY PROGRESSION */}
      <section className="panel" style={{ marginBottom: "28px", border: "1.5px solid #CBD5E1", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#0056D2", background: "#EFF6FF", padding: "3px 8px", borderRadius: "6px" }}>
                Role-Governed Roadmap
              </span>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Target Role: <strong>{trainee?.role || "Weather Forecaster"}</strong>
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: 0 }}>
              My Competency Progress & Level Paths
            </h3>
            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>
              Progress step-by-step from your current skill level to your role requirement. Skip-level enrollment is prohibited.
            </p>
          </div>
          <Link to="/trainee/recommendations" className="btn btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            View Full Learning Path <ChevronRight size={15} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
          {competencies.map((comp) => {
            const currentNum = getLevelNumber(comp.currentLevel);
            const targetNum = getLevelNumber(comp.targetLevel);
            const gap = Math.max(0, targetNum - currentNum);
            const rec = recs.find(r => r.competency === comp.name);
            const nextCourse = rec?.recommendedCourse;
            const isEnrolledInNext = nextCourse
              ? enrollments.find(e => e.courseId === nextCourse.id)
              : undefined;

            return (
              <div
                key={comp.name}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0F172A" }}>
                        {comp.name}
                      </h4>
                      {gap === 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "600", color: "#047857", background: "#ECFDF5", padding: "2px 8px", borderRadius: "9999px" }}>
                          <CheckCircle2 size={13} /> Target Achieved
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#B45309", background: "#FEF3C7", padding: "2px 8px", borderRadius: "9999px" }}>
                          {gap} Level Gap ({comp.currentLevel} → {comp.targetLevel})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                      Current: <strong>{comp.currentLevel}</strong> &nbsp;·&nbsp; Role Required: <strong>{comp.targetLevel}</strong>
                      {comp.lastAssessmentScore !== undefined && (
                        <span> &nbsp;·&nbsp; Last Assessment: <strong>{comp.lastAssessmentScore}%</strong></span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>Progression:</span>
                    <strong style={{ fontSize: "13px", color: "#0056D2" }}>
                      {Math.min(100, Math.round((currentNum / targetNum) * 100))}% of Role Goal
                    </strong>
                  </div>
                </div>

                {/* VISUAL LEVEL ROADMAP TRACK (L1 ──── L2 ──── L3) */}
                <div style={{ margin: "16px 0 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    {[1, 2, 3, 4].slice(0, Math.max(targetNum, 3)).map((lvl, idx, arr) => {
                      const isPassed = lvl < currentNum;
                      const isCurrent = lvl === currentNum;
                      const isTarget = lvl === targetNum;
                      const isLocked = lvl > currentNum;

                      let nodeBg = "#F1F5F9";
                      let nodeBorder = "#CBD5E1";
                      let nodeText = "#64748B";

                      if (isPassed) {
                        nodeBg = "#10B981";
                        nodeBorder = "#10B981";
                        nodeText = "#FFFFFF";
                      } else if (isCurrent) {
                        nodeBg = "#0056D2";
                        nodeBorder = "#0056D2";
                        nodeText = "#FFFFFF";
                      } else if (isTarget) {
                        nodeBg = "#EFF6FF";
                        nodeBorder = "#2563EB";
                        nodeText = "#1D4ED8";
                      }

                      return (
                        <div key={lvl} style={{ display: "flex", alignItems: "center", flex: idx === arr.length - 1 ? "0 0 auto" : "1" }}>
                          {/* Circle Node */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                            <div
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background: nodeBg,
                                border: `2px solid ${nodeBorder}`,
                                color: nodeText,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700",
                                fontSize: "13px",
                                boxShadow: isCurrent ? "0 0 0 4px #DBEAFE" : "none",
                                zIndex: 2,
                                transition: "all 0.2s ease"
                              }}
                            >
                              {isPassed ? <CheckCircle2 size={18} /> : `L${lvl}`}
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: isCurrent || isTarget ? "700" : "500", color: isCurrent ? "#0056D2" : isTarget ? "#1D4ED8" : "#64748B", marginTop: "6px", whiteSpace: "nowrap" }}>
                              {isCurrent ? "Current Level" : isTarget ? "Role Target" : `Level ${lvl}`}
                            </span>
                          </div>

                          {/* Connecting line between nodes */}
                          {idx < arr.length - 1 && (
                            <div
                              style={{
                                flex: "1",
                                height: "4px",
                                background: lvl < currentNum ? "#10B981" : "#E2E8F0",
                                margin: "0 8px 18px",
                                borderRadius: "2px",
                                zIndex: 1
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* RECOMMENDED COURSE OR TARGET ACHIEVED BANNER */}
                {gap === 0 ? (
                  <div
                    style={{
                      background: "#F0FDF4",
                      border: "1px solid #BBF7D0",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <CheckCircle2 color="#059669" size={20} />
                      <span style={{ fontSize: "13px", color: "#065F46", fontWeight: "600" }}>
                        Role Requirement Satisfied — You possess the required {comp.targetLevel} competency for {trainee?.role || "your role"}.
                      </span>
                    </div>
                    <Badge tone="green">Target Met</Badge>
                  </div>
                ) : nextCourse ? (
                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderLeft: "4px solid #0056D2",
                      borderRadius: "8px",
                      padding: "14px 18px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: "1", minWidth: "260px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#0056D2", background: "#EFF6FF", padding: "2px 6px", borderRadius: "4px" }}>
                          IMMEDIATE NEXT COURSE: {nextCourse.entryLevel} → {nextCourse.targetLevel}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748B" }}>
                          Duration: {nextCourse.duration || `${nextCourse.durationHours} Hours`}
                        </span>
                      </div>
                      <h5 style={{ margin: "2px 0 4px", fontSize: "15px", fontWeight: "700", color: "#0F172A" }}>
                        {nextCourse.title}
                      </h5>
                      <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                        {nextCourse.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {isEnrolledInNext ? (
                        <Link
                          to={`/trainee/learning/${nextCourse.id}`}
                          className="btn btn-primary btn-sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Play size={14} /> Continue Course ({isEnrolledInNext.progress}%)
                        </Link>
                      ) : (
                        <button
                          onClick={() => requestEnrollment(nextCourse.id)}
                          className="btn btn-primary btn-sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          <Sparkles size={14} /> Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", color: "#64748B" }}>
                    No next-level course is currently scheduled for {comp.name}. Check back shortly.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD BOTTOM GRID */}
      <div className="dashboard-grid two">
        {/* Active Enrolled Courses */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>My Active Courses</h3>
              <p>Approved operational training modules</p>
            </div>
            <Link to="/trainee/learning" className="text-link">
              Open Learning
            </Link>
          </div>
          {enrollments.length > 0 ? (
            <div className="progress-list">
              {enrollments.map((e) => {
                const course = db.courses.find((c) => c.id === e.courseId);
                return (
                  <div key={e.id} style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#0F172A" }}>
                          {course?.title || e.courseId}
                        </strong>
                        <div style={{ fontSize: "12px", color: "#64748B" }}>
                          {course?.competency || course?.subject} · Level {course?.entryLevel || course?.level}
                        </div>
                      </div>
                      <Badge tone={e.progress === 100 ? "green" : "blue"}>
                        {e.progress}%
                      </Badge>
                    </div>
                    <ProgressBar value={e.progress} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-inline">
              <p>No active courses. Enroll in your recommended next course above.</p>
            </div>
          )}
        </section>

        {/* Assessments & Verifications */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Upcoming Assessments</h3>
              <p>Score 60% or higher to level up competency</p>
            </div>
            <Link to="/trainee/assessments" className="text-link">
              View All
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {db.assessments
              .filter(a => enrollments.some(e => e.courseId === a.courseId))
              .slice(0, 3)
              .map(a => {
                const attempts = db.attempts.filter(x => x.assessmentId === a.id && x.traineeId === trainee?.id);
                const passed = attempts.some(x => x.passed);
                const best = attempts.length ? Math.max(...attempts.map(x => x.score)) : null;

                return (
                  <div
                    key={a.id}
                    style={{
                      padding: "12px 14px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: passed ? "#F0FDF4" : "#FFFFFF"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "13px", color: "#0F172A", display: "block" }}>
                        {a.title}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>
                        Pass mark: {a.passingPercentage}% · {a.questions.length} questions
                      </span>
                    </div>

                    <div>
                      {passed ? (
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669" }}>
                          ✓ Passed ({best}%)
                        </span>
                      ) : (
                        <Link to="/trainee/assessments" className="btn btn-secondary btn-sm">
                          Take Test
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
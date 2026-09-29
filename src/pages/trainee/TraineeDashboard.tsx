import {
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Gauge,
  GraduationCap,
  MapPin,
  PlayCircle,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Zap,
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
import { CompetencyLevel } from "../../types";
import { getLevelNumber, operationalReadiness } from "../../utils/engine";

export default function TraineeDashboard() {
  const {
    db,
    currentUser,
    roleRequirements,
    traineeLevels,
    certificates,
    getRoleRecommendations,
    getNextStep,
    requestEnrollment,
  } = useApp();

  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";
  const centreName = trainee?.centre || "Bhopal Doppler Radar Station";

  // Enrollments and Certificates
  const enrollments = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && e.status !== "rejected"
  );
  const activeEnrollments = enrollments.filter((e) => e.status === "approved");
  const completedEnrollments = enrollments.filter((e) => e.status === "completed");

  const allCerts = [...certificates, ...db.certificates];
  const userCerts = allCerts.filter(
    (c, index, self) =>
      c.traineeId === trainee?.id &&
      index === self.findIndex((t) => t.id === c.id || (t.courseId === c.courseId && t.levelAchieved === c.levelAchieved))
  );

  // Recommendations and gaps from engine
  const roleRecommendations = getRoleRecommendations(trainee);
  const nextStep = getNextStep(trainee);

  // Summary Metrics
  const competenciesMet = roleRecommendations.filter((r) => r.status === "Met").length;
  const competenciesWithGap = roleRecommendations.filter((r) => r.status === "Gap").length;
  const totalLevelsStillToGain = roleRecommendations.reduce((sum, r) => sum + r.gap, 0);

  // Operational Readiness calculation
  const readinessSnapshot = trainee ? operationalReadiness(db, trainee.id) : { score: 45, band: "Developing" as const };

  // Recent assessment attempts
  const recentAttempts = db.attempts
    .filter((a) => a.traineeId === trainee?.id)
    .sort((a, b) => (b.attemptedAt || "").localeCompare(a.attemptedAt || ""))
    .slice(0, 3);

  // Sorted Competency Profile: largest gap first, Met last
  const sortedRecommendations = [...roleRecommendations].sort((a, b) => {
    if (a.status === "Gap" && b.status === "Met") return -1;
    if (a.status === "Met" && b.status === "Gap") return 1;
    return b.gap - a.gap;
  });

  return (
    <>
      {/* 1. Officer Profile & Station Command Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #081A2E 0%, #0F2A4A 100%)",
          borderRadius: "14px",
          padding: "24px 28px",
          color: "#FFFFFF",
          marginBottom: "24px",
          boxShadow: "0 4px 16px rgba(8, 26, 46, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#DC2626",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(220, 38, 38, 0.35)",
              }}
            >
              {(trainee?.name || currentUser?.name || "T").split(" ").map((x) => x[0]).slice(0, 2).join("")}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                <h2 style={{ margin: 0, fontSize: "22px", color: "#FFFFFF", fontWeight: 800 }}>
                  {trainee?.name || currentUser?.name || "Operational Trainee"}
                </h2>
                <span
                  style={{
                    fontSize: "11.5px",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                  }}
                >
                  {currentUser?.employeeId || trainee?.id || "IMD-STAFF"}
                </span>
                <span
                  style={{
                    fontSize: "11.5px",
                    background: "#10B981",
                    color: "#FFFFFF",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                  }}
                >
                  Active Personnel
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "13px", opacity: 0.9 }}>
                <span><strong>Role:</strong> {jobRole}</span>
                <span>•</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={13} /> {centreName}
                </span>
                <span>•</span>
                <span>{trainee?.department || "Radar Meteorology"}</span>
                <span>•</span>
                <span>{currentUser?.email}</span>
              </div>
            </div>
          </div>

          {/* Operational Readiness Meter */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "10px",
              padding: "12px 18px",
              textAlign: "right",
              minWidth: "160px",
            }}
          >
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.85, fontWeight: 600, marginBottom: "2px" }}>
              Operational Readiness
            </div>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>
              {readinessSnapshot.score}<span style={{ fontSize: "14px", opacity: 0.8 }}>/100</span>
            </div>
            <div style={{ fontSize: "11.5px", color: "#86EFAC", fontWeight: 700, marginTop: "2px" }}>
              ● {readinessSnapshot.band}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Executive Stat Strip */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <StatCard
          label="Competencies Met"
          value={`${competenciesMet} / ${roleRecommendations.length}`}
          icon={<CheckCircle2 className="text-emerald-600" />}
          caption={competenciesWithGap === 0 ? "All requirements satisfied" : `${competenciesWithGap} gap(s) remaining`}
        />
        <StatCard
          label="Levels to Advance"
          value={totalLevelsStillToGain}
          icon={<TrendingUp className="text-blue-600" />}
          caption="Total competency milestones"
        />
        <StatCard
          label="Enrolled Courses"
          value={activeEnrollments.length}
          icon={<BookOpen className="text-blue-600" />}
          caption={`${completedEnrollments.length} course(s) completed`}
        />
        <StatCard
          label="Verified Certificates"
          value={userCerts.length}
          icon={<Award className="text-amber-600" />}
          caption="Digital credentials issued"
        />
      </div>

      {/* 3. Role Competency Benchmark & Recommendations Matrix */}
      <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "24px", marginBottom: "24px", background: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#0F172A", fontWeight: 800 }}>
              Role Competency Benchmark Matrix ({jobRole})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Real-time operational competency baseline verified against IMD Central Directorate standards.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to="/trainee/competency" className="btn btn-secondary btn-sm">
              Take Competency Check
            </Link>
            <Link to="/trainee/learning" className="btn btn-primary btn-sm">
              Open Course Hub
            </Link>
          </div>
        </div>

        {/* Priority Recommendation Banner */}
        {nextStep && nextStep.recommendedCourse && (
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #CBD5E1",
              borderLeft: "5px solid #DC2626",
              borderRadius: "10px",
              padding: "18px 20px",
              marginBottom: "20px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Compass size={18} color="#DC2626" />
                <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#DC2626" }}>
                  Priority Recommendation
                </span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#991B1B",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                }}
              >
                Biggest Gap: {nextStep.competency} ({nextStep.gap} Levels)
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div>
                <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "#0F172A", fontWeight: 700 }}>
                  {nextStep.recommendedCourse.title}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "12.5px", color: "var(--text-muted)" }}>
                  <LevelJumpBadge from={nextStep.recommendedCourse.entryLevel || "L1"} to={nextStep.recommendedCourse.targetLevel || "L2"} size="sm" />
                  <span>{nextStep.recommendedCourse.competency} · {nextStep.recommendedCourse.durationHours} hrs</span>
                </div>
              </div>

              <div>
                {enrollments.some((e) => e.courseId === nextStep.recommendedCourse!.id) ? (
                  <Link to={`/trainee/learning/${nextStep.recommendedCourse.id}`} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                    Continue Learning →
                  </Link>
                ) : (
                  <button onClick={() => requestEnrollment(nextStep.recommendedCourse!.id)} className="btn btn-primary btn-sm" style={{ fontWeight: 600 }}>
                    Enroll Now →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Competency Gap Overview Table */}
        {roleRecommendations.length === 0 ? (
          <LevelEmptyState
            type="no-requirements"
            message={`No role requirements set for "${jobRole}". Please contact your station training supervisor.`}
          />
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: "10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569" }}>COMPETENCY</th>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569", width: "90px" }}>CURRENT</th>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569", width: "90px" }}>REQUIRED</th>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569", width: "100px" }}>STATUS</th>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569", minWidth: "160px" }}>LEVEL PROGRESSION</th>
                  <th style={{ padding: "11px 14px", fontWeight: 700, color: "#475569" }}>RECOMMENDED COURSE</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecommendations.map((item) => {
                  const isMet = item.status === "Met";
                  return (
                    <tr key={item.competency} style={{ borderBottom: "1px solid #E2E8F0", background: isMet ? "#FAFAFA" : "#FFFFFF" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <strong style={{ color: "#0F172A" }}>{item.competency}</strong>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <LevelBadge level={item.currentLevel} size="sm" />
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <LevelBadge level={item.requiredLevel} size="sm" />
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {isMet ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700 }}>
                            Met
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700 }}>
                            Gap ({item.gap})
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <LevelPathBar
                          currentLevel={item.currentLevel}
                          requiredLevel={item.requiredLevel}
                          compact={true}
                        />
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {item.recommendedCourse ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A" }}>
                              {item.recommendedCourse.title}
                            </span>
                            <span style={{ fontSize: "10.5px", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>
                              {item.recommendedCourse.entryLevel} → {item.recommendedCourse.targetLevel}
                            </span>
                            {enrollments.some((e) => e.courseId === item.recommendedCourse!.id) ? (
                              <Link to={`/trainee/learning/${item.recommendedCourse.id}`} className="btn btn-secondary btn-sm" style={{ padding: "3px 8px", fontSize: "11.5px" }}>
                                Continue
                              </Link>
                            ) : (
                              <button onClick={() => requestEnrollment(item.recommendedCourse!.id)} className="btn btn-primary btn-sm" style={{ padding: "3px 8px", fontSize: "11.5px" }}>
                                Enroll
                              </button>
                            )}
                          </div>
                        ) : isMet ? (
                          <span style={{ color: "#059669", fontSize: "12px", fontWeight: 600 }}>— Requirement Met —</span>
                        ) : (
                          <span style={{ color: "#92400E", fontSize: "12px" }}>
                            {item.reasonMessage || "No course available yet"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Two Column Grid: Active Learning Progress & Recent Assessment Records */}
      <div className="dashboard-grid two">
        {/* Active Courses In Progress */}
        <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={18} color="#0056D2" /> Active Course Progress
            </h3>
            <Link to="/trainee/learning" style={{ fontSize: "12.5px", color: "#0056D2", fontWeight: 600 }}>
              All Courses →
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {enrollments.slice(0, 3).map((e) => {
                const c = db.courses.find((x) => x.id === e.courseId);
                return (
                  <div key={e.id} style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>{c?.title || e.courseId}</strong>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0056D2" }}>{e.progress}%</span>
                    </div>
                    <ProgressBar value={e.progress} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      <span>{c?.competency} · {c?.durationHours}h</span>
                      <Link to={`/trainee/learning/${e.courseId}`} style={{ color: "#0056D2", fontWeight: 600 }}>
                        Resume Lesson →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 10px", color: "var(--text-muted)" }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px" }}>No active course enrollments yet.</p>
              <Link to="/trainee/learning" className="btn btn-secondary btn-sm">
                Browse Recommended Courses
              </Link>
            </div>
          )}
        </section>

        {/* Recent Performance & Practical Simulations */}
        <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #E2E8F0", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Radar size={18} color="#0056D2" /> Practical Lab & Assessments
            </h3>
            <Link to="/trainee/assessments" style={{ fontSize: "12.5px", color: "#0056D2", fontWeight: 600 }}>
              View Exams →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--text-heading)" }}>
                  Operational Lab Simulations
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Severe Convection, Cyclone Landfall, AP Clutter
                </div>
              </div>
              <Link to="/trainee/scenarios" className="btn btn-secondary btn-sm">
                Launch Lab
              </Link>
            </div>

            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#166534" }}>
                  Verified Capability Passport
                </div>
                <div style={{ fontSize: "12px", color: "#15803D" }}>
                  {userCerts.length} Certified Level Achievement(s)
                </div>
              </div>
              <Link to="/trainee/passport" className="btn btn-secondary btn-sm">
                View Passport
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
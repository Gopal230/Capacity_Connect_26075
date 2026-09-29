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
      {/* 1. Trainee Profile Card & Competency Radar (Matching Reference Palette) */}
      <section
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "26px 28px",
          marginBottom: "24px",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Header Row: Officer Avatar, Info & KPIs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                background: "#081A2E",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 2px 6px rgba(8, 26, 46, 0.3)",
              }}
            >
              {(trainee?.name || currentUser?.name || "RS").split(" ").map((x) => x[0]).slice(0, 2).join("")}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "3px" }}>
                <h2 style={{ margin: 0, fontSize: "22px", color: "#0F172A", fontWeight: 800 }}>
                  {trainee?.name || currentUser?.name || "Rahul Sharma"}
                </h2>
                <span
                  style={{
                    fontSize: "11.5px",
                    background: "#DCFCE7",
                    color: "#15803D",
                    border: "1px solid #86EFAC",
                    padding: "2px 10px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                  }}
                >
                  Verified Trainee
                </span>
              </div>

              <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "3px" }}>
                <span>{currentUser?.employeeId || trainee?.id || "SB-2024-TR-492"}</span>
                <span style={{ margin: "0 6px" }}>•</span>
                <span>{jobRole}</span>
              </div>

              <div style={{ fontSize: "12.5px", color: "#2563EB", fontWeight: 600 }}>
                Batch A - {centreName}
              </div>
            </div>
          </div>

          {/* Right KPIs: Streak and Benchmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div
              style={{
                background: "#FFFBEB",
                border: "1px solid #FEF08A",
                borderRadius: "10px",
                padding: "10px 20px",
                textAlign: "center",
                minWidth: "110px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
                7 Days
              </div>
              <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.5px", marginTop: "2px" }}>
                DAILY STREAK
              </div>
            </div>

            <div
              style={{
                background: "#FFFBEB",
                border: "1px solid #FEF08A",
                borderRadius: "10px",
                padding: "10px 20px",
                textAlign: "center",
                minWidth: "120px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#DC2626", lineHeight: 1.1 }}>
                {Math.round((competenciesMet / (roleRecommendations.length || 1)) * 100)}%
              </div>
              <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, letterSpacing: "0.5px", marginTop: "2px" }}>
                BENCHMARK MET
              </div>
            </div>
          </div>
        </div>

        {/* TRAINEE COMPETENCY RADAR & SKILL GAPS */}
        <div style={{ marginTop: "30px" }}>
          <h3
            style={{
              fontSize: "13.5px",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            TRAINEE COMPETENCY RADAR & SKILL GAPS
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "16px",
            }}
          >
            {sortedRecommendations.map((item) => {
              const currentLvlNum = getLevelNumber(item.currentLevel);
              const reqLvlNum = getLevelNumber(item.requiredLevel);
              const percentage = Math.min(100, Math.round((currentLvlNum / Math.max(reqLvlNum, 1)) * 100));
              const gapPercentage = percentage - 100;
              const isMet = item.status === "Met";

              return (
                <div
                  key={item.competency}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                      {item.competency}
                    </span>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>
                      <span style={{ color: "#0F172A" }}>{percentage}%</span>
                      {isMet ? (
                        <span style={{ color: "#059669", marginLeft: "6px" }}>Met</span>
                      ) : (
                        <span style={{ color: "#DC2626", marginLeft: "6px" }}>Gap: {gapPercentage}%</span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#EDF2F7",
                      height: "8px",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#081A2E",
                        height: "100%",
                        borderRadius: "9999px",
                        width: `${percentage}%`,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
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

      {/* 3. Priority Next Action Banner (If applicable) */}
      {nextStep && nextStep.recommendedCourse && (
        <section
          style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
            border: "1.5px solid #BFDBFE",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 86, 210, 0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={18} color="#0056D2" />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0056D2" }}>
                Targeted Next Priority Action
              </span>
            </div>
            <Badge tone="blue">Priority Gap: {nextStep.competency}</Badge>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", color: "#0F172A" }}>
                {nextStep.recommendedCourse.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-muted)" }}>
                <LevelJumpBadge from={nextStep.recommendedCourse.entryLevel || "L1"} to={nextStep.recommendedCourse.targetLevel || "L2"} size="sm" />
                <span>{nextStep.recommendedCourse.competency} · {nextStep.recommendedCourse.durationHours} hrs</span>
              </div>
            </div>

            <div>
              <Link to="/trainee/learning" className="btn btn-primary" style={{ fontWeight: 600 }}>
                View in Courses →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Role Competency Benchmark & Level Progression Map */}
      <section className="panel" style={{ border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "22px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "17.5px" }}>
              Role Competency Benchmark Matrix ({jobRole})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Real-time operational competency baseline verified against IMD Central Directorate standards.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/trainee/competency" className="btn btn-secondary btn-sm">
              Take Competency Check
            </Link>
            <Link to="/trainee/learning" className="btn btn-primary btn-sm">
              Open Course Hub
            </Link>
          </div>
        </div>

        {roleRecommendations.length === 0 ? (
          <LevelEmptyState
            type="no-requirements"
            message={`No role requirements set for "${jobRole}". Please contact your station training supervisor.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sortedRecommendations.map((item) => {
              const isMet = item.status === "Met";
              return (
                <div
                  key={item.competency}
                  style={{
                    background: isMet ? "#F8FAFC" : "#FFFFFF",
                    border: `1.5px solid ${isMet ? "#E2E8F0" : "#CBD5E1"}`,
                    borderLeft: `5px solid ${isMet ? "#10B981" : "#EA580C"}`,
                    borderRadius: "10px",
                    padding: "14px 18px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "15px", color: "var(--text-heading)" }}>{item.competency}</strong>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Current:</span>
                        <LevelBadge level={item.currentLevel} size="sm" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Required:</span>
                        <LevelBadge level={item.requiredLevel} size="sm" />
                      </div>
                    </div>
                  </div>

                  <LevelPathBar
                    currentLevel={item.currentLevel}
                    requiredLevel={item.requiredLevel}
                    compact={true}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Two Column Grid: Active Learning Progress & Recent Assessment Records */}
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
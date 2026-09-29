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
      {/* 1. Officer Profile & Station Command Header */}
      <section
        style={{
          background: "linear-gradient(135deg, #081A2E 0%, #DC2626 100%)",
          borderRadius: "14px",
          padding: "24px 28px",
          color: "#FFFFFF",
          marginBottom: "24px",
          boxShadow: "0 4px 16px rgba(0, 51, 102, 0.15)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#FFFFFF",
                color: "#DC2626",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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

      {/* 3. Priority Next Action Banner (If applicable) */}
      {nextStep && nextStep.recommendedCourse && (
        <section
          style={{
            background: "linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)",
            border: "1.5px solid #FECACA",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 86, 210, 0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={18} color="#DC2626" />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#DC2626" }}>
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
              <BookOpen size={18} color="#DC2626" /> Active Course Progress
            </h3>
            <Link to="/trainee/learning" style={{ fontSize: "12.5px", color: "#DC2626", fontWeight: 600 }}>
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
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#DC2626" }}>{e.progress}%</span>
                    </div>
                    <ProgressBar value={e.progress} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      <span>{c?.competency} · {c?.durationHours}h</span>
                      <Link to={`/trainee/learning/${e.courseId}`} style={{ color: "#DC2626", fontWeight: 600 }}>
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
              <Radar size={18} color="#DC2626" /> Practical Lab & Assessments
            </h3>
            <Link to="/trainee/assessments" style={{ fontSize: "12.5px", color: "#DC2626", fontWeight: 600 }}>
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
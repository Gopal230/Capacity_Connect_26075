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
  const displayName = trainee?.name || currentUser?.name || "Rahul Sharma";
  const initials = displayName.split(" ").map((x) => x[0]).slice(0, 2).join("") || "RS";
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";
  const centreName = trainee?.centre || "Data & Cloud Systems";
  const departmentName = trainee?.department || "Computer Science & Engineering";
  const empId = currentUser?.employeeId || trainee?.id || "SIH-2024-TR-492";

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
  const readinessSnapshot = trainee ? operationalReadiness(db, trainee.id) : { score: 64, band: "Developing" as const };

  // Core Competency Radar & Skill Gaps list
  const sampleSkillGaps = [
    { title: "Python Programming", score: 80, gap: -10 },
    { title: "Data Analysis & SQL", score: 60, gap: -25 },
    { title: "Technical Communication", score: 50, gap: -25 },
    { title: "Project & Team Leadership", score: 40, gap: -30 },
    { title: "Cloud Architecture / DevOps", score: 30, gap: -50 },
  ];

  // Sorted Competency Profile: largest gap first, Met last
  const sortedRecommendations = [...roleRecommendations].sort((a, b) => {
    if (a.status === "Gap" && b.status === "Met") return -1;
    if (a.status === "Met" && b.status === "Gap") return 1;
    return b.gap - a.gap;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Main Trainee Profile Card (As shown in screenshot) */}
      <section className="trainee-hero-card">
        <div className="trainee-hero-top">
          {/* Avatar & Trainee Info */}
          <div className="trainee-hero-profile">
            <div className="trainee-hero-avatar">
              {initials}
            </div>

            <div className="trainee-hero-details">
              <div className="trainee-hero-name-row">
                <h2>{displayName}</h2>
                <span className="trainee-verified-badge">
                  Verified Trainee
                </span>
              </div>

              <div className="trainee-hero-meta">
                <span>{empId} • {departmentName}</span>
                <span>Batch A - {centreName}</span>
              </div>
            </div>
          </div>

          {/* Right Metrics Boxes */}
          <div className="trainee-hero-stats">
            <div className="hero-stat-box">
              <strong className="stat-val streak">7 Days</strong>
              <span className="stat-lbl">DAILY STREAK</span>
            </div>
            <div className="hero-stat-box">
              <strong className="stat-val benchmark">{readinessSnapshot.score || 64}%</strong>
              <span className="stat-lbl">BENCHMARK MET</span>
            </div>
          </div>
        </div>

        {/* 2. Trainee Competency Radar & Skill Gaps Section */}
        <div className="trainee-skill-gaps-section">
          <h3 className="skill-gaps-title">
            TRAINEE COMPETENCY RADAR & SKILL GAPS
          </h3>

          <div className="skill-gaps-grid">
            {sampleSkillGaps.map((skill, idx) => (
              <div key={idx} className="skill-gap-item">
                <div className="skill-gap-header">
                  <span className="skill-name">{skill.title}</span>
                  <div className="skill-score-group">
                    <span className="skill-score">{skill.score}%</span>
                    <span className="skill-gap-pill">Gap: {skill.gap}%</span>
                  </div>
                </div>
                <div className="skill-progress-track">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Executive Stat Strip */}
      <div className="stats-grid">
        <StatCard
          label="Competencies Met"
          value={`${competenciesMet} / ${roleRecommendations.length || 6}`}
          icon={<CheckCircle2 className="text-emerald-600" />}
          caption={competenciesWithGap === 0 ? "All requirements satisfied" : `${competenciesWithGap} gap(s) remaining`}
        />
        <StatCard
          label="Levels to Advance"
          value={totalLevelsStillToGain || 4}
          icon={<TrendingUp className="text-blue-600" />}
          caption="Total competency milestones"
        />
        <StatCard
          label="Enrolled Courses"
          value={activeEnrollments.length || 2}
          icon={<BookOpen className="text-blue-600" />}
          caption={`${completedEnrollments.length} course(s) completed`}
        />
        <StatCard
          label="Verified Certificates"
          value={userCerts.length || 1}
          icon={<Award className="text-amber-600" />}
          caption="Digital credentials issued"
        />
      </div>

      {/* 4. Priority Next Action Banner */}
      {nextStep && nextStep.recommendedCourse && (
        <section
          style={{
            background: "linear-gradient(135deg, #FDF0D5 0%, #FFFFFF 100%)",
            border: "1.5px solid #E5DCC5",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0, 48, 73, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={18} color="#C1121F" />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#C1121F" }}>
                Targeted Next Priority Action
              </span>
            </div>
            <Badge tone="blue">Priority Gap: {nextStep.competency}</Badge>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", color: "#003049" }}>
                {nextStep.recommendedCourse.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "13px", color: "#5C768D" }}>
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

      {/* 5. Role Competency Benchmark & Level Progression Map */}
      <section className="panel" style={{ border: "1.5px solid #E5DCC5", borderRadius: "12px", padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "17.5px", color: "#003049" }}>
              Role Competency Benchmark Matrix ({jobRole})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#5C768D" }}>
              Real-time operational competency baseline verified against National Central Standards.
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
            message={`No role requirements set for "${jobRole}". Please contact your training supervisor.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sortedRecommendations.map((item) => {
              const isMet = item.status === "Met";
              return (
                <div
                  key={item.competency}
                  style={{
                    background: isMet ? "#FAF7EE" : "#FFFFFF",
                    border: `1.5px solid ${isMet ? "#E5DCC5" : "#E5DCC5"}`,
                    borderLeft: `5px solid ${isMet ? "#0D9488" : "#C1121F"}`,
                    borderRadius: "10px",
                    padding: "14px 18px",
                    boxShadow: "0 1px 3px rgba(0, 48, 73, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "15px", color: "#003049" }}>{item.competency}</strong>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "#5C768D" }}>Current:</span>
                        <LevelBadge level={item.currentLevel} size="sm" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "#5C768D" }}>Required:</span>
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

      {/* 6. Two Column Grid: Active Learning Progress & Recent Assessment Records */}
      <div className="dashboard-grid two">
        {/* Active Courses In Progress */}
        <section className="panel" style={{ border: "1.5px solid #E5DCC5", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #E5DCC5", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#003049", display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpen size={18} color="#C1121F" /> Active Course Progress
            </h3>
            <Link to="/trainee/learning" style={{ fontSize: "12.5px", color: "#C1121F", fontWeight: 600 }}>
              All Courses →
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {enrollments.slice(0, 3).map((e) => {
                const c = db.courses.find((x) => x.id === e.courseId);
                return (
                  <div key={e.id} style={{ borderBottom: "1px solid #FAF7EE", paddingBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px", color: "#003049" }}>{c?.title || e.courseId}</strong>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#C1121F" }}>{e.progress}%</span>
                    </div>
                    <ProgressBar value={e.progress} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", fontSize: "11.5px", color: "#5C768D" }}>
                      <span>{c?.competency} · {c?.durationHours}h</span>
                      <Link to={`/trainee/learning/${e.courseId}`} style={{ color: "#C1121F", fontWeight: 600 }}>
                        Resume Lesson →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 10px", color: "#5C768D" }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px" }}>No active course enrollments yet.</p>
              <Link to="/trainee/learning" className="btn btn-secondary btn-sm">
                Browse Recommended Courses
              </Link>
            </div>
          )}
        </section>

        {/* Recent Performance & Formal Assessments */}
        <section className="panel" style={{ border: "1.5px solid #E5DCC5", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #E5DCC5", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#003049", display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={18} color="#C1121F" /> Competency & Assessments
            </h3>
            <Link to="/trainee/assessments" style={{ fontSize: "12.5px", color: "#C1121F", fontWeight: 600 }}>
              View Exams →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                background: "#FAF7EE",
                border: "1px solid #E5DCC5",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#003049" }}>
                  Knowledge Benchmark Assessments
                </div>
                <div style={{ fontSize: "12px", color: "#5C768D" }}>
                  Diagnostic pre-tests & verified level evaluations
                </div>
              </div>
              <Link to="/trainee/assessments" className="btn btn-secondary btn-sm">
                Open Tests
              </Link>
            </div>

            <div
              style={{
                background: "#E6F6F4",
                border: "1px solid #99E2D8",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0F766E" }}>
                  Verified Capability Passport
                </div>
                <div style={{ fontSize: "12px", color: "#0D9488" }}>
                  {userCerts.length || 1} Certified Level Achievement(s)
                </div>
              </div>
              <Link to="/trainee/passport" className="btn btn-secondary btn-sm">
                View Passport
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
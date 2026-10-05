import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Radar,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, ProgressBar, StatCard } from "../../components/UI";
import {
  LevelBadge,
  LevelJumpBadge,
  LevelPathBar,
  StatusBadge,
  LevelEmptyState,
} from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { operationalReadiness } from "../../utils/engine";

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
  const displayName = trainee?.name || currentUser?.name || "Rahul Verma";
  const initials = displayName
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("") || "RV";
  const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";
  const centreName = trainee?.centre || "Bhopal Doppler Radar Station";
  const departmentName = trainee?.department || "Radar Operations Center";
  const empId = currentUser?.employeeId || trainee?.id || "ta1";
  const email = currentUser?.email || "trainee@test.com";

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
  const readinessSnapshot = trainee ? operationalReadiness(db, trainee.id) : { score: 14, band: "Needs Development" as const };
  const readinessScore = readinessSnapshot.score || 14;

  // Sorted Competency Profile: largest gap first, Met last
  const sortedRecommendations = [...roleRecommendations].sort((a, b) => {
    if (a.status === "Gap" && b.status === "Met") return -1;
    if (a.status === "Met" && b.status === "Gap") return 1;
    return b.gap - a.gap;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Trainee Hero Banner (Exact Dark Navy to Crimson Gradient Layout) */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-dark) 48%, var(--brand-hover) 85%, var(--brand-hover) 100%)",
          borderRadius: "14px",
          padding: "24px 28px",
          color: "#FFFFFF",
          boxShadow: "0 8px 24px rgba(0, 24, 38, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Left: Avatar & Identity Details */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Circular White Avatar with Bold Red Initials */}
          <div
            style={{
              width: "60px",
              height: "60px",
              minWidth: "60px",
              borderRadius: "50%",
              background: "#FFFFFF",
              color: "var(--brand-primary)",
              fontWeight: 800,
              fontSize: "22px",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
              letterSpacing: "0.5px",
            }}
          >
            {initials}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "23px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                {displayName}
              </h2>
              <span
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "#E2E8F0",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                {empId}
              </span>
              <span
                style={{
                  background: "#10B981",
                  color: "#FFFFFF",
                  padding: "2px 10px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
                }}
              >
                Active Personnel
              </span>
            </div>

            <div style={{ fontSize: "12.5px", color: "rgba(255, 255, 255, 0.85)", fontWeight: 500 }}>
              Role: {jobRole} • {centreName} • {departmentName} • {email}
            </div>
          </div>
        </div>

        {/* Right: Operational Readiness Glass Metric Card */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.28)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            padding: "14px 22px",
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "5px",
            minWidth: "175px",
          }}
        >
          <span
            style={{
              background: "rgba(220, 38, 38, 0.35)",
              color: "#FECACA",
              border: "1px solid rgba(239, 68, 68, 0.45)",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.6px",
              padding: "2px 8px",
              borderRadius: "9999px",
              textTransform: "uppercase",
            }}
          >
            Operational Readiness
          </span>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1 }}>
            {readinessScore}/100
          </div>
          <span
            style={{
              background: "rgba(16, 185, 129, 0.18)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#A7F3D0",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "9999px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34D399" }} />
            {readinessSnapshot.band || "Needs Development"}
          </span>
        </div>
      </section>

      {/* 2. Executive Metric Cards Strip */}
      <div className="stats-grid">
        <StatCard
          label="Competencies Met"
          value={`${competenciesMet} / ${roleRecommendations.length || 6}`}
          icon={<CheckCircle2 className="text-emerald-600" />}
          caption={competenciesWithGap === 0 ? "All requirements satisfied" : `${competenciesWithGap || 6} gap(s) remaining`}
        />
        <StatCard
          label="Levels to Advance"
          value={totalLevelsStillToGain || 9}
          icon={<TrendingUp style={{ color: "var(--brand-accent)" }} />}
          caption="Total competency milestones"
        />
        <StatCard
          label="Enrolled Courses"
          value={activeEnrollments.length || 2}
          icon={<BookOpen style={{ color: "var(--brand-accent)" }} />}
          caption={`${completedEnrollments.length} course(s) completed`}
        />
        <StatCard
          label="Verified Certificates"
          value={userCerts.length || 0}
          icon={<Award className="text-amber-600" />}
          caption="Digital credentials issued"
        />
      </div>

      {/* 3. Targeted Next Priority Action Box */}
      {nextStep && nextStep.recommendedCourse && (
        <section
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0, 48, 73, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Compass size={18} color="var(--brand-primary)" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  color: "var(--brand-primary)",
                }}
              >
                🎯 Targeted Next Priority Action
              </span>
            </div>
            <span
              style={{
                background: "var(--surface-tint)",
                color: "var(--brand-dark)",
                border: "1px solid var(--border-clean)",
                borderRadius: "9999px",
                padding: "3px 12px",
                fontSize: "11.5px",
                fontWeight: 700,
              }}
            >
              Priority Gap: {nextStep.competency}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17.5px", color: "#0F172A", fontWeight: 700 }}>
                {nextStep.recommendedCourse.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  fontSize: "13px",
                  color: "#64748B",
                }}
              >
                <LevelJumpBadge
                  from={nextStep.recommendedCourse.entryLevel || "L1"}
                  to={nextStep.recommendedCourse.targetLevel || "L2"}
                  size="sm"
                />
                <span>
                  {nextStep.recommendedCourse.competency} · {nextStep.recommendedCourse.durationHours} hrs
                </span>
              </div>
            </div>

            <div>
              <Link
                to="/trainee/learning"
                style={{
                  background: "var(--brand-primary)",
                  color: "#FFFFFF",
                  padding: "9px 20px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "none",
                  boxShadow: "0 2px 6px rgba(193, 18, 31, 0.3)",
                }}
              >
                View in Courses →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Role Competency Benchmark Matrix */}
      <section
        className="panel"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #E2E8F0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0, 48, 73, 0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#0F172A", fontWeight: 700 }}>
              Role Competency Benchmark Matrix ({jobRole})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
              Real-time operational competency baseline verified against IMD Central Directorate standards.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/trainee/competency"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #CBD5E1",
                color: "#1E293B",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Take Competency Check
            </Link>
            <Link
              to="/trainee/learning"
              style={{
                background: "var(--brand-primary)",
                border: "1.5px solid var(--brand-primary)",
                color: "#FFFFFF",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 6px rgba(193, 18, 31, 0.25)",
              }}
            >
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
                    background: isMet ? "#F8FAFC" : "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderLeft: `5px solid ${isMet ? "#10B981" : "var(--brand-primary)"}`,
                    borderRadius: "10px",
                    padding: "16px 20px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "15px", color: "#0F172A" }}>{item.competency}</strong>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "#64748B" }}>Current:</span>
                        <LevelBadge level={item.currentLevel} size="sm" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                        <span style={{ color: "#64748B" }}>Required:</span>
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

      {/* 5. Two Column Grid: Active Course Progress & Practical Lab & Assessments */}
      <div className="dashboard-grid two">
        {/* Active Courses In Progress */}
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              borderBottom: "1px solid #F1F5F9",
              paddingBottom: "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#0F172A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <BookOpen size={18} color="var(--brand-primary)" /> Active Course Progress
            </h3>
            <Link to="/trainee/learning" style={{ fontSize: "12.5px", color: "var(--brand-primary)", fontWeight: 700 }}>
              All Courses →
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {enrollments.slice(0, 3).map((e) => {
                const c = db.courses.find((x) => x.id === e.courseId);
                return (
                  <div key={e.id} style={{ borderBottom: "1px solid #F8FAFC", paddingBottom: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <strong style={{ fontSize: "14px", color: "#0F172A" }}>{c?.title || e.courseId}</strong>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--brand-primary)" }}>{e.progress}%</span>
                    </div>
                    <ProgressBar value={e.progress} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "6px",
                        fontSize: "11.5px",
                        color: "#64748B",
                      }}
                    >
                      <span>
                        {c?.competency} · {c?.durationHours}h
                      </span>
                      <Link
                        to={`/trainee/learning/${e.courseId}`}
                        style={{ color: "var(--brand-primary)", fontWeight: 700 }}
                      >
                        Resume Lesson →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 10px", color: "#64748B" }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px" }}>No active course enrollments yet.</p>
              <Link to="/trainee/learning" className="btn btn-secondary btn-sm">
                Browse Recommended Courses
              </Link>
            </div>
          )}
        </section>

        {/* Practical Lab & Assessments */}
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              borderBottom: "1px solid #F1F5F9",
              paddingBottom: "10px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#0F172A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <Radar size={18} color="var(--brand-primary)" /> Practical Lab & Assessments
            </h3>
            <Link to="/trainee/assessments" style={{ fontSize: "12.5px", color: "var(--brand-primary)", fontWeight: 700 }}>
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
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0F172A" }}>
                  Operational Lab Simulations
                </div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>
                  Severe Convection, Radar Diagnostics & Clutter
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
                  {userCerts.length || 0} Certified Level Achievement(s)
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
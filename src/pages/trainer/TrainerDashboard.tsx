import { Archive, BookOpen, CalendarClock, CheckCircle2, ClipboardCheck, FileCheck2, FileUp, Lock, Sparkles, Users } from "lucide-react";
import { Badge, PageHeader, ProgressBar, StatCard } from "../../components/UI";
import { LevelBadge, LevelJumpBadge, StatusBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { canEnroll, getLevelNumber } from "../../utils/engine";

export default function TrainerDashboard() {
  const { db, currentUser, roleRequirements, traineeLevels, getTraineeLevel } = useApp();
  const trainer = db.trainers.find((t) => t.userId === currentUser?.id);
  const courses = db.courses.filter((c) => c.trainerId === trainer?.id);
  const enrollments = db.enrollments.filter((e) => courses.some((c) => c.id === e.courseId) && e.status !== "rejected");
  const avg = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length) : 0;
  const pendingEval = enrollments.filter(
    (e) => e.progress === 100 && !db.certificates.some((c) => c.traineeId === e.traineeId && c.courseId === e.courseId)
  ).length;
  const pendingEvidence = db.evidence.filter((e) => courses.some((c) => c.id === e.courseId) && e.status === "submitted").length;
  const knowledge = db.knowledgeAssets.filter((a) => a.trainerId === trainer?.id).length;

  return (
    <>
      <PageHeader
        title="Trainer Operational Dashboard"
        subtitle="Manage training delivery, monitor learner progression through competency levels, and verify qualifications."
      />

      <div className="stats-grid">
        <StatCard label="Assigned Courses" value={courses.length} icon={<BookOpen />} />
        <StatCard label="Total Trainees" value={new Set(enrollments.map((e) => e.traineeId)).size} icon={<Users />} />
        <StatCard label="Pending Evaluations" value={pendingEval} icon={<ClipboardCheck />} />
        <StatCard label="Upcoming Deadlines" value={courses.filter((c) => c.status === "published").length} icon={<CalendarClock />} />
        <StatCard label="Average Progress" value={`${avg}%`} icon={<Users />} />
        <StatCard label="Recent Uploads" value={db.resources.filter((r) => r.trainerId === trainer?.id).length} icon={<FileUp />} />
        <StatCard label="Evidence Reviews" value={pendingEvidence} icon={<FileCheck2 />} caption="Awaiting sign-off" />
        <StatCard label="Knowledge Assets" value={knowledge} icon={<Archive />} caption="Continuity vault" />
      </div>

      <div className="dashboard-grid two">
        {/* 1. Assigned Courses with Level Jump Badge and Competency Name */}
        <section className="panel" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "20px" }}>
          <div className="panel-head" style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "12px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Assigned Courses & Level Steps</h3>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
                Published and proposed training curriculum
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {courses.map((c) => {
              const comp = c.competency || c.subject;
              const courseEnrollments = enrollments.filter((e) => e.courseId === c.id);
              let eligible = 0;
              let locked = 0;

              courseEnrollments.forEach((e) => {
                const trainee = db.trainees.find((t) => t.id === e.traineeId);
                if (trainee && c.entryLevel) {
                  const access = canEnroll(trainee, c, undefined, traineeLevels);
                  if (access.canEnroll) eligible++;
                  else locked++;
                } else {
                  eligible++;
                }
              });

              return (
                <article
                  key={c.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <strong style={{ fontSize: "15px", color: "var(--text-heading)" }}>{c.title}</strong>
                        {c.entryLevel && c.targetLevel ? (
                          <LevelJumpBadge from={c.entryLevel} to={c.targetLevel} size="sm" />
                        ) : (
                          <Badge tone="blue">{c.level}</Badge>
                        )}
                      </div>
                      <small style={{ color: "#64748B", fontSize: "12px" }}>
                        Competency: <strong>{comp}</strong> · Code: {c.code}
                      </small>
                    </div>
                    <Badge tone={c.status === "published" ? "green" : c.status === "pending" ? "amber" : "gray"}>
                      {c.status}
                    </Badge>
                  </div>

                  {/* Small stat: locked out vs eligible */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #E2E8F0",
                      paddingTop: "6px",
                      marginTop: "2px",
                      fontSize: "11.5px",
                    }}
                  >
                    <span style={{ color: "#475569" }}>
                      <strong>{courseEnrollments.length}</strong> Enrolled
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: "#166534", fontWeight: 600 }}>✓ {eligible} Eligible</span>
                      {locked > 0 && <span style={{ color: "#B45309", fontWeight: 600 }}>🔒 {locked} Locked</span>}
                    </div>
                  </div>
                </article>
              );
            })}

            {courses.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>
                No assigned courses found.
              </div>
            )}
          </div>
        </section>

        {/* 2. Trainee Progress with Current Level and Met/Gap Highlight */}
        <section className="panel" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "20px" }}>
          <div className="panel-head" style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "12px", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Active Trainee Progress</h3>
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-muted)" }}>
                Learners in your courses and competency role qualification impact
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {enrollments.slice(0, 8).map((e) => {
              const trainee = db.trainees.find((t) => t.id === e.traineeId);
              const course = db.courses.find((c) => c.id === e.courseId);
              if (!course) return null;

              const compName = course.competency || course.subject;
              const currentLevel = trainee ? getTraineeLevel(trainee.id, compName) : ("L1" as const);
              const currentRank = getLevelNumber(currentLevel);

              // Role requirements
              const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";
              const roleReqMap = roleRequirements[jobRole] || {};
              const requiredLevel = roleReqMap[compName];
              const requiredRank = requiredLevel ? getLevelNumber(requiredLevel) : 0;
              const targetRank = course.targetLevel ? getLevelNumber(course.targetLevel) : currentRank + 1;
              const willBeMet = requiredRank > 0 ? targetRank >= requiredRank : true;

              return (
                <div
                  key={e.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
                        <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                          {trainee?.name || "Trainee"}
                        </strong>
                        <LevelBadge level={currentLevel} size="sm" />
                      </div>
                      <small style={{ color: "#64748B", fontSize: "12px" }}>
                        Course: {course.title} ({compName})
                      </small>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {willBeMet ? (
                        <StatusBadge status="Met" size="sm" />
                      ) : (
                        <StatusBadge status="Gap" size="sm" />
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, minWidth: "35px" }}>{e.progress}%</span>
                    <div style={{ flex: 1 }}>
                      <ProgressBar value={e.progress} />
                    </div>
                  </div>
                </div>
              );
            })}

            {enrollments.length === 0 && (
              <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>
                No active trainee enrollments.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
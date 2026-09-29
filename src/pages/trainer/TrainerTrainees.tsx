import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge, ConfirmButton, PageHeader, ProgressBar } from "../../components/UI";
import { LevelBadge, LevelJumpBadge, StatusBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";
import { Course, Trainee } from "../../types";
import { canEnroll, formatLevel, getLevelNumber } from "../../utils/engine";

export default function TrainerTrainees() {
  const {
    db,
    currentUser,
    roleRequirements,
    traineeLevels,
    getTraineeLevel,
    verifyCompetency,
  } = useApp();

  const trainer = db.trainers.find((t) => t.userId === currentUser?.id);
  const myCourses = db.courses.filter((c) => c.trainerId === trainer?.id);

  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Base enrollments for trainer's courses
  const enrollments = useMemo(() => {
    return db.enrollments.filter(
      (e) => myCourses.some((c) => c.id === e.courseId) && e.status !== "rejected"
    );
  }, [db.enrollments, myCourses]);

  // Filtered list
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      if (selectedCourseFilter !== "all" && e.courseId !== selectedCourseFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const trainee = db.trainees.find((t) => t.id === e.traineeId);
        const course = db.courses.find((c) => c.id === e.courseId);
        const text = `${trainee?.name || ""} ${course?.title || ""} ${trainee?.jobRole || ""} ${course?.competency || ""}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [enrollments, selectedCourseFilter, searchQuery, db.trainees, db.courses]);

  // Quick stats across all trainer's enrolled trainees
  const overallStats = useMemo(() => {
    let eligibleCount = 0;
    let lockedCount = 0;
    let completedCount = 0;

    enrollments.forEach((e) => {
      const course = db.courses.find((c) => c.id === e.courseId);
      const trainee = db.trainees.find((t) => t.id === e.traineeId);
      if (e.progress === 100 || e.status === "completed") {
        completedCount++;
      }
      if (course && trainee) {
        const access = canEnroll(trainee, course, undefined, traineeLevels);
        if (access.canEnroll) {
          eligibleCount++;
        } else {
          lockedCount++;
        }
      }
    });

    return {
      total: enrollments.length,
      eligibleCount,
      lockedCount,
      completedCount,
    };
  }, [enrollments, db.courses, db.trainees, traineeLevels]);

  return (
    <>
      <PageHeader
        title="Trainee Monitoring & Competency Progression"
        subtitle="Track enrolled trainees, verify operational capability milestones, and monitor role qualification status."
      />

      {/* Summary KPI Cards with Eligible vs Locked Out stats */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Total Enrollments</span>
            <Users size={20} color="#0056D2" />
          </div>
          <strong style={{ fontSize: "28px", color: "#0F172A", display: "block" }}>{overallStats.total}</strong>
          <small style={{ color: "#64748B", fontSize: "12px" }}>Across {myCourses.length} authored courses</small>
        </div>

        <div className="stat-card" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Eligible Learners</span>
            <CheckCircle2 size={20} color="#166534" />
          </div>
          <strong style={{ fontSize: "28px", color: "#166534", display: "block" }}>{overallStats.eligibleCount}</strong>
          <small style={{ color: "#166534", fontSize: "12px" }}>Meet prerequisite entry level</small>
        </div>

        <div className="stat-card" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#B45309", textTransform: "uppercase" }}>Locked Out (Below Entry)</span>
            <Lock size={20} color="#B45309" />
          </div>
          <strong style={{ fontSize: "28px", color: "#B45309", display: "block" }}>{overallStats.lockedCount}</strong>
          <small style={{ color: "#B45309", fontSize: "12px" }}>Require foundational ladder steps</small>
        </div>

        <div className="stat-card" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "10px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#0056D2", textTransform: "uppercase" }}>Completed / Verified</span>
            <ShieldCheck size={20} color="#0056D2" />
          </div>
          <strong style={{ fontSize: "28px", color: "#0056D2", display: "block" }}>{overallStats.completedCount}</strong>
          <small style={{ color: "#64748B", fontSize: "12px" }}>100% lessons completed</small>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <section className="panel" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "18px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
            <Search size={18} color="#64748B" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trainee name, course, or role..."
              style={{ padding: "8px 12px", fontSize: "13.5px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Filter size={16} color="#64748B" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>Course Filter:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              style={{ width: "auto", minWidth: "240px", padding: "8px 12px", fontSize: "13px" }}
            >
              <option value="all">All Authored Courses ({myCourses.length})</option>
              {myCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.entryLevel || "L1"} → {c.targetLevel || "L2"})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Trainee Monitoring Table */}
      <section className="panel table-panel" style={{ background: "#FFFFFF", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "24px" }}>
        <div className="panel-head" style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "14px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "19px", color: "var(--text-heading)" }}>
              Active Course Trainees & Competency Impact
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
              Showing {filteredEnrollments.length} enrolled student records
            </p>
          </div>
        </div>

        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #CBD5E1", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Trainee & Current Level</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Course & Ladder Step</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Eligibility / Lockout</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Progress</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Assessment</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Role Requirement Impact</th>
                <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((e) => {
                const trainee = db.trainees.find((x) => x.id === e.traineeId);
                const course = db.courses.find((x) => x.id === e.courseId)!;
                if (!course) return null;

                const compName = course.competency || course.subject;

                // 3. Trainee's current level in this course's competency
                const currentLevel = trainee
                  ? getTraineeLevel(trainee.id, compName)
                  : ("L1" as const);
                const currentRank = getLevelNumber(currentLevel);

                // Role requirement check for this competency
                const jobRole = trainee?.jobRole || trainee?.role || "Radar Operator";
                const roleReqMap = roleRequirements[jobRole] || {};
                const requiredLevel = roleReqMap[compName];
                const requiredRank = requiredLevel ? getLevelNumber(requiredLevel) : 0;

                // Target level upon completing this course
                const targetRank = course.targetLevel ? getLevelNumber(course.targetLevel) : currentRank + 1;

                // Prompt 2 #3: Highlight whether completing this course will make them Met or still leave a Gap
                let willBeMet = false;
                if (requiredRank > 0) {
                  willBeMet = targetRank >= requiredRank;
                } else {
                  willBeMet = true;
                }

                // Prompt 2 #2: Check if trainee is locked out (below entry level)
                const accessCheck = canEnroll(trainee, course, currentLevel, traineeLevels);
                const isLocked = !accessCheck.canEnroll;

                // Assessment attempt
                const post = db.assessments.find((a) => a.courseId === course.id && a.type === "post");
                const attempt = post
                  ? db.attempts.find((a) => a.traineeId === e.traineeId && a.assessmentId === post.id)
                  : undefined;

                // Certificate status
                const cert = db.certificates.find((x) => x.traineeId === e.traineeId && x.courseId === course.id);

                return (
                  <tr key={e.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    {/* Trainee Name and Current Level Badge */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                            {trainee?.name || "Trainee"}
                          </strong>
                          {/* Prompt 2 #3: current level next to their name */}
                          <LevelBadge level={currentLevel} size="sm" />
                        </div>
                        <small style={{ color: "#64748B", fontSize: "12px" }}>
                          {trainee?.jobRole || trainee?.designation || "Operational Personnel"}
                        </small>
                      </div>
                    </td>

                    {/* Course Title and Level Jump Badge */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>
                            {course.title}
                          </strong>
                          {/* Prompt 2 #1: Level jump badge instead of old difficulty */}
                          {course.entryLevel && course.targetLevel ? (
                            <LevelJumpBadge from={course.entryLevel} to={course.targetLevel} size="sm" />
                          ) : (
                            <Badge tone="blue">{course.level}</Badge>
                          )}
                        </div>
                        <small style={{ color: "#64748B", fontSize: "11.5px" }}>
                          Competency: <strong>{compName}</strong> · Code: {course.code}
                        </small>
                      </div>
                    </td>

                    {/* Eligibility / Locked Out Status */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      {isLocked ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: "#FEF3C7",
                            color: "#92400E",
                            fontSize: "11.5px",
                            fontWeight: 600,
                          }}
                          title={accessCheck.reason}
                        >
                          <Lock size={12} />
                          Locked ({course.entryLevel})
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            background: "#ECFDF5",
                            color: "#065F46",
                            fontSize: "11.5px",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Eligible
                        </span>
                      )}
                    </td>

                    {/* Progress */}
                    <td style={{ padding: "14px", verticalAlign: "middle", minWidth: "120px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700 }}>
                          <span>{e.progress}%</span>
                          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>
                            {e.completedLessonIds?.length || 0} lessons
                          </span>
                        </div>
                        <ProgressBar value={e.progress} />
                      </div>
                    </td>

                    {/* Assessment */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      {attempt ? (
                        <Badge tone={attempt.passed ? "green" : "red"}>
                          {attempt.score}% {attempt.passed ? "Pass" : "Fail"}
                        </Badge>
                      ) : (
                        <Badge tone="gray">Not attempted</Badge>
                      )}
                    </td>

                    {/* Prompt 2 #3: Highlight whether completing will make them Met or still leave a Gap */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {willBeMet ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <StatusBadge status="Met" size="sm" />
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <StatusBadge status="Gap" size="sm" />
                          </div>
                        )}
                        <small style={{ fontSize: "11px", color: "#64748B" }}>
                          Target: {course.targetLevel} {requiredLevel ? `(Req: ${requiredLevel})` : ""}
                        </small>
                      </div>
                    </td>

                    {/* Verification Actions */}
                    <td style={{ padding: "14px", verticalAlign: "middle" }}>
                      {cert ? (
                        <Badge tone="green">Verified ({cert.levelAchieved})</Badge>
                      ) : (
                        <ConfirmButton
                          label="Verify Capability"
                          className="btn btn-secondary btn-sm"
                          confirmText={`Verify ${trainee?.name || "Trainee"} for ${compName} (${course.targetLevel})?`}
                          onConfirm={() => verifyCompetency(e.traineeId, e.courseId)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredEnrollments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#64748B" }}>
                    No trainee enrollments found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
import { useState } from "react";
import { AlertTriangle, ArrowRight, Award, CheckCircle2, ChevronRight, Info, Lock, Play, Sparkles, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { getLevelNumber } from "../../utils/engine";

export default function Recommendations() {
  const { db, currentUser, requestEnrollment, checkCourseEligibility } = useApp();
  const trainee = db.trainees.find(t => t.userId === currentUser?.id);
  const enrollments = db.enrollments.filter(e => e.traineeId === trainee?.id && e.status !== "rejected");

  const [selectedComp, setSelectedComp] = useState<string>("all");
  const [highlightedCourseId, setHighlightedCourseId] = useState<string | null>(null);

  const competencies = trainee?.competencies || [
    { name: "Radar Interpretation", currentLevel: "L1" as const, targetLevel: "L3" as const, lastAssessmentScore: 45 },
    { name: "Synoptic Forecasting", currentLevel: "L2" as const, targetLevel: "L3" as const, lastAssessmentScore: 68 },
    { name: "Satellite Meteorology", currentLevel: "L2" as const, targetLevel: "L2" as const, lastAssessmentScore: 75 }
  ];

  const filteredCompetencies = selectedComp === "all"
    ? competencies
    : competencies.filter(c => c.name === selectedComp);

  const scrollToCourse = (courseId: string) => {
    setHighlightedCourseId(courseId);
    const element = document.getElementById(`course-card-${courseId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setHighlightedCourseId(null);
    }, 2500);
  };

  return (
    <>
      <PageHeader
        title="Personalized Learning Path"
        subtitle={`Role-based competency roadmap for ${trainee?.name || "Trainee"} · ${trainee?.role || "Weather Forecaster"} (${trainee?.centre || "Bhopal"})`}
      />

      {/* OVERVIEW BANNER */}
      <section
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #CBD5E1",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#0056D2", background: "#EFF6FF", padding: "3px 8px", borderRadius: "6px" }}>
                Role-Governed Curriculum
              </span>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#0F172A" }}>
                Target Role: {trainee?.role || "Weather Forecaster"}
              </span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: "0 0 6px" }}>
              Level-Based Course Recommendation Engine
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#475569", maxWidth: "800px", lineHeight: "1.5" }}>
              Recommendations are systematically governed by your current skill level and your role requirements.
              Courses must be completed in order: <strong>L1 → L2 → L3 → L4</strong>. Advanced courses remain locked until you pass the preceding level assessment with at least 60%.
            </p>
          </div>

          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "12px 18px", borderRadius: "8px", textAlign: "right" }}>
            <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "600" }}>Center Assignment</span>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#0056D2" }}>{trainee?.centre || "Bhopal"} MC</div>
          </div>
        </div>

        {/* COMPETENCY SELECTOR TABS */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E2E8F0" }}>
          <button
            onClick={() => setSelectedComp("all")}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              border: selectedComp === "all" ? "1.5px solid #0056D2" : "1.5px solid #CBD5E1",
              background: selectedComp === "all" ? "#0056D2" : "#FFFFFF",
              color: selectedComp === "all" ? "#FFFFFF" : "#334155",
              transition: "all 0.15s ease",
            }}
          >
            All Competencies ({competencies.length})
          </button>
          {competencies.map((comp) => {
            const isTarget = getLevelNumber(comp.currentLevel) >= getLevelNumber(comp.targetLevel);
            return (
              <button
                key={comp.name}
                onClick={() => setSelectedComp(comp.name)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: selectedComp === comp.name ? "1.5px solid #0056D2" : "1.5px solid #CBD5E1",
                  background: selectedComp === comp.name ? "#0056D2" : "#FFFFFF",
                  color: selectedComp === comp.name ? "#FFFFFF" : "#334155",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                {comp.name} ({comp.currentLevel} / {comp.targetLevel})
                {isTarget && <CheckCircle2 size={13} color={selectedComp === comp.name ? "#FFFFFF" : "#10B981"} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* COMPETENCY SECTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {filteredCompetencies.map((comp) => {
          const currentNum = getLevelNumber(comp.currentLevel);
          const targetNum = getLevelNumber(comp.targetLevel);
          const gap = Math.max(0, targetNum - currentNum);

          // Get all published courses for this competency, ordered by entryLevel
          const compCourses = db.courses
            .filter(c => (c.competency === comp.name || c.subject === comp.name) && c.status === "published")
            .sort((a, b) => getLevelNumber(a.entryLevel || a.level) - getLevelNumber(b.entryLevel || b.level));

          return (
            <div
              key={comp.name}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #CBD5E1",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              {/* COMPETENCY HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0F172A" }}>
                      {comp.name}
                    </h3>
                    {gap === 0 ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "700", color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 10px", borderRadius: "9999px" }}>
                        <CheckCircle2 size={13} /> Role Target Achieved ({comp.targetLevel})
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#B45309", background: "#FEF3C7", border: "1px solid #FDE68A", padding: "2px 10px", borderRadius: "9999px" }}>
                        Level Gap: {gap} ({comp.currentLevel} → {comp.targetLevel})
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748B" }}>
                    Your Current Skill: <strong>{comp.currentLevel}</strong> &nbsp;·&nbsp;
                    Role Required: <strong>{comp.targetLevel}</strong>
                    {comp.lastAssessmentScore !== undefined && (
                      <span> &nbsp;·&nbsp; Diagnostic Score: <strong>{comp.lastAssessmentScore}%</strong></span>
                    )}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    Curriculum Stage: <strong>{Math.min(targetNum, currentNum)} of {targetNum}</strong>
                  </div>
                </div>
              </div>

              {/* COURSES SEQUENCE (STEP-BY-STEP LEARNING PATH) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {compCourses.map((course, idx) => {
                  const courseEntryNum = getLevelNumber(course.entryLevel || course.level);
                  const courseTargetNum = getLevelNumber(course.targetLevel || "L2");
                  const isCompleted = currentNum >= courseTargetNum;
                  const isImmediateNext = currentNum === courseEntryNum && courseTargetNum === currentNum + 1;
                  const isLocked = courseEntryNum > currentNum;

                  const access = checkCourseEligibility(course.id);
                  const enrollment = enrollments.find(e => e.courseId === course.id);
                  const trainer = db.trainers.find(t => t.id === course.trainerId);
                  const isHighlighted = highlightedCourseId === course.id;

                  // Find foundation prerequisite course if locked
                  const foundationCourse = isLocked
                    ? compCourses.find(c => getLevelNumber(c.entryLevel) === currentNum && getLevelNumber(c.targetLevel) === currentNum + 1)
                    : null;

                  return (
                    <article
                      id={`course-card-${course.id}`}
                      key={course.id}
                      style={{
                        border: isImmediateNext
                          ? "2px solid #0056D2"
                          : isCompleted
                          ? "1.5px solid #10B981"
                          : isLocked
                          ? "1.5px solid #E2E8F0"
                          : "1.5px solid #CBD5E1",
                        background: isHighlighted
                          ? "#EFF6FF"
                          : isImmediateNext
                          ? "#F8FAFF"
                          : isLocked
                          ? "#FAFAFA"
                          : "#FFFFFF",
                        borderRadius: "12px",
                        padding: "20px",
                        transition: "all 0.3s ease",
                        boxShadow: isImmediateNext
                          ? "0 4px 12px rgba(0, 86, 210, 0.08)"
                          : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
                        <div style={{ flex: "1", minWidth: "280px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748B" }}>
                              Step {idx + 1}:
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: isImmediateNext ? "#0056D2" : isCompleted ? "#059669" : "#64748B",
                                color: "#FFFFFF",
                              }}
                            >
                              {course.entryLevel || "L1"} → {course.targetLevel || "L2"}
                            </span>

                            {isImmediateNext && (
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#0056D2", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: "9999px" }}>
                                ★ RECOMMENDED NEXT STEP
                              </span>
                            )}

                            {isCompleted && (
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "2px 8px", borderRadius: "9999px" }}>
                                ✓ COMPLETED
                              </span>
                            )}

                            {isLocked && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: "700", color: "#64748B", background: "#F1F5F9", padding: "2px 8px", borderRadius: "9999px" }}>
                                <Lock size={11} /> LOCKED
                              </span>
                            )}
                          </div>

                          <h4 style={{ margin: "4px 0 6px", fontSize: "17px", fontWeight: "700", color: isLocked ? "#475569" : "#0F172A" }}>
                            {course.title}
                          </h4>

                          <p style={{ margin: "0 0 10px", fontSize: "13px", color: isLocked ? "#64748B" : "#334155", lineHeight: "1.4" }}>
                            {course.description}
                          </p>

                          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#64748B", flexWrap: "wrap" }}>
                            <span>Duration: <strong>{course.duration || `${course.durationHours} Hours`}</strong></span>
                            <span>Trainer: <strong>{trainer?.name || "Senior Faculty"}</strong></span>
                            <span>Standard: <strong>IMD Operational Manual</strong></span>
                          </div>
                        </div>

                        {/* RIGHT ACTION OR LOCK STATUS */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                          {isImmediateNext ? (
                            enrollment ? (
                              <div style={{ textAlign: "right" }}>
                                <Link
                                  to={`/trainee/learning/${course.id}`}
                                  className="btn btn-primary"
                                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                  <Play size={15} /> Continue Learning ({enrollment.progress}%)
                                </Link>
                                <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                                  Pass assessment to reach {course.targetLevel}
                                </div>
                              </div>
                            ) : (
                              <div style={{ textAlign: "right" }}>
                                <button
                                  onClick={() => requestEnrollment(course.id)}
                                  className="btn btn-primary"
                                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                  <Sparkles size={15} /> Enroll Now
                                </button>
                                <div style={{ fontSize: "11px", color: "#0056D2", fontWeight: "600", marginTop: "4px" }}>
                                  Eligible for your Level ({comp.currentLevel})
                                </div>
                              </div>
                            )
                          ) : isCompleted ? (
                            <div style={{ textAlign: "right" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "#059669" }}>
                                <CheckCircle2 size={16} /> Level Achieved
                              </span>
                              {enrollment && (
                                <Link to={`/trainee/learning/${course.id}`} className="text-link" style={{ display: "block", fontSize: "11px", marginTop: "2px" }}>
                                  Review Materials
                                </Link>
                              )}
                            </div>
                          ) : isLocked ? (
                            <div style={{ textAlign: "right" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: "#64748B" }}>
                                <Lock size={15} /> Locked
                              </span>
                            </div>
                          ) : (
                            <button onClick={() => requestEnrollment(course.id)} className="btn btn-secondary btn-sm">
                              Enroll
                            </button>
                          )}
                        </div>
                      </div>

                      {/* INFORMATIVE PREREQUISITE LOCK CALLOUT */}
                      {isLocked && (
                        <div
                          style={{
                            marginTop: "16px",
                            padding: "14px 16px",
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                              <AlertTriangle size={15} color="#DC2626" />
                              <strong style={{ fontSize: "13px", color: "#991B1B" }}>
                                {course.title} is locked.
                              </strong>
                            </div>
                            <div style={{ fontSize: "12px", color: "#7F1D1D", lineHeight: "1.4" }}>
                              Required Level: <strong>{course.entryLevel}</strong> &nbsp;|&nbsp;
                              Your Current Level: <strong>{comp.currentLevel}</strong>
                              <br />
                              Complete <strong>"{foundationCourse?.title || "the preceding course"}"</strong> first to reach {course.entryLevel} and unlock this course.
                            </div>
                          </div>

                          {foundationCourse && (
                            <button
                              onClick={() => scrollToCourse(foundationCourse.id)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#FFFFFF",
                                borderColor: "#DC2626",
                                color: "#DC2626",
                                fontWeight: "600",
                              }}
                            >
                              [ View Recommended Course ] <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
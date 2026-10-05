import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Printer,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LevelBadge,
  LevelJumpBadge,
  LevelPathBar,
} from "../../components/LevelUI";
import { Badge, EmptyState, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { Assessment, AssessmentAttempt } from "../../types";

export default function AssessmentPage() {
  const { db, currentUser, submitAssessment, getTraineeLevel } = useApp();
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const enrolled = db.enrollments.filter(
    (e) => e.traineeId === trainee?.id && ["approved", "completed"].includes(e.status)
  );
  const assessments = db.assessments.filter(
    (a) => a.type !== "competency" && enrolled.some((e) => e.courseId === a.courseId)
  );

  const [active, setActive] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [last, setLast] = useState<AssessmentAttempt | null>(null);

  const activeCourse = active ? db.courses.find((c) => c.id === active.courseId) : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const r = submitAssessment(active.id, answers);
    setLast(r);
    setActive(null);
    setAnswers([]);
  };

  const handleRetake = (assessment: Assessment) => {
    setLast(null);
    setActive(assessment);
    setAnswers([]);
  };

  return (
    <>
      <PageHeader
        title="Operational Assessments & Competency Verification"
        subtitle="Validate practical radar skills with standardized IMD MCQs. Passing moves you up the competency ladder."
      />

      {/* =========================================================
          RESULT SCREEN (Prompt 7)
          1. Level-Up Celebration Panel
          2. Lessons Incomplete Notice
          3. Calm Neutral Panel for Failed Attempt
          ========================================================= */}
      {last && (
        <div style={{ marginBottom: "28px" }}>
          {last.levelUpInfo?.levelled ? (
            /* 1. Celebration Panel on Level-Up */
            <div
              className="card celebration-panel"
              style={{
                background: "#F0FDF4",
                border: "2px solid #86EFAC",
                borderRadius: "14px",
                padding: "28px",
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
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
                  <Sparkles size={28} />
                </div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#15803D", background: "#DCFCE7", padding: "3px 8px", borderRadius: "9999px", marginBottom: "4px" }}>
                    Competency Milestone Unlocked
                  </div>
                  <h2 style={{ margin: 0, fontSize: "22px", color: "#14532D", fontWeight: 700 }}>
                    Congratulations! Operational Level Upgraded
                  </h2>
                </div>
              </div>

              {/* Old and New Level Badges */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #BBF7D0",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  margin: "16px 0",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginBottom: "4px" }}>
                    Competency: <strong>{last.levelUpInfo.competency}</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <LevelBadge level={last.levelUpInfo.previousLevel} />
                    <ArrowRight size={18} color="#059669" />
                    <LevelBadge level={last.levelUpInfo.newLevel} />
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginBottom: "2px" }}>
                    Assessment Score
                  </span>
                  <strong style={{ fontSize: "20px", color: "#15803D" }}>{last.score}%</strong>
                  <span style={{ fontSize: "12px", color: "#15803D", marginLeft: "6px" }}>(Pass 60%)</span>
                </div>
              </div>

              {/* Advancing Level Path Bar */}
              <div style={{ margin: "18px 0" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#15803D", display: "block", marginBottom: "6px" }}>
                  Updated Progression Pathway:
                </span>
                <LevelPathBar
                  currentLevel={last.levelUpInfo.newLevel}
                  requiredLevel={last.levelUpInfo.roleRequiredLevel || last.levelUpInfo.newLevel}
                  compact={false}
                />
              </div>

              {/* Role Requirement Met Alert */}
              {last.levelUpInfo.roleRequirementMet && (
                <div
                  style={{
                    background: "#DCFCE7",
                    border: "1.5px solid #86EFAC",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#14532D",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    fontSize: "14px",
                    margin: "16px 0",
                  }}
                >
                  <CheckCircle2 size={18} color="#15803D" />
                  Role requirement met for {last.levelUpInfo.competency} (Achieved {last.levelUpInfo.newLevel})
                </div>
              )}

              {/* Official Printable Certificate Block */}
              {last.levelUpInfo.certificate && (
                <div
                  className="printable-certificate-block"
                  style={{
                    marginTop: "20px",
                    background: "#FFFFFF",
                    border: "3px double var(--brand-primary)",
                    borderRadius: "12px",
                    padding: "24px 28px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ borderBottom: "1.5px solid #E2E8F0", paddingBottom: "14px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <Award size={26} color="var(--brand-primary)" />
                      <strong style={{ fontSize: "16px", letterSpacing: "1.5px", color: "#0F172A" }}>
                        INDIA METEOROLOGICAL DEPARTMENT
                      </strong>
                    </div>
                    <small style={{ color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", fontSize: "11px", fontWeight: 600 }}>
                      Ministry of Earth Sciences · Government of India
                    </small>
                    <div style={{ marginTop: "8px" }}>
                      <span style={{ background: "#FEF2F2", color: "var(--brand-primary)", border: "1px solid #FECACA", padding: "3px 12px", borderRadius: "9999px", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.5px" }}>
                        OFFICIAL CERTIFICATE OF OPERATIONAL COMPETENCY
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748B" }}>This is to certify that</p>
                  <h3 style={{ margin: "0 0 6px", fontSize: "22px", color: "#0F172A", fontWeight: 700 }}>
                    {trainee?.name || currentUser?.name || "Operational Trainee"}
                  </h3>
                  <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748B" }}>
                    has successfully fulfilled all operational curriculum modules, passed standardized assessments, and attained verified capability in:
                  </p>

                  <div style={{ margin: "12px 0" }}>
                    <h4 style={{ margin: "0 0 6px", fontSize: "18px", color: "var(--brand-primary)", fontWeight: 700 }}>
                      {last.levelUpInfo.competency}
                    </h4>
                    <LevelBadge level={last.levelUpInfo.newLevel} />
                  </div>

                  <p style={{ fontSize: "13px", color: "#475569", margin: "8px 0 0" }}>
                    Program: <strong>{last.levelUpInfo.courseTitle}</strong>
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "14px", marginTop: "18px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ textAlign: "left", fontSize: "12px", color: "#64748B" }}>
                      <div><strong>Certificate ID:</strong> {last.levelUpInfo.certificate.certificateCode}</div>
                      <div><strong>Issue Date:</strong> {last.levelUpInfo.certificate.issuedAt}</div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-secondary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Printer size={14} /> Print Certificate
                      </button>
                      <Link to="/trainee/certificates" className="btn btn-secondary btn-sm">
                        View Records
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: "Go to my next step" */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
                <Link
                  to="/trainee"
                  className="btn btn-primary btn-lg"
                  style={{ padding: "12px 28px", fontSize: "15px", fontWeight: 700 }}
                >
                  Go to my next step →
                </Link>
              </div>
            </div>
          ) : last.levelUpInfo?.lessonsIncomplete ? (
            /* 2. Passed but lessons incomplete */
            <div
              className="card"
              style={{
                background: "#FFFBEB",
                border: "2px solid #FDE68A",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    background: "#FEF3C7",
                    color: "#D97706",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#B45309", background: "#FEF3C7", padding: "2px 8px", borderRadius: "9999px" }}>
                      Assessment Score: {last.score}% (Passed)
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#92400E", fontWeight: 700 }}>
                    Complete all lessons to receive the level upgrade
                  </h3>
                  <p style={{ margin: "0 0 14px", fontSize: "13.5px", color: "#78350F", lineHeight: 1.5 }}>
                    {last.levelUpInfo.message} You must complete 100% of the lessons in this course before the level upgrade and official IMD certificate can be issued.
                  </p>
                  {last.levelUpInfo.courseTitle && (
                    <Link
                      to="/trainee/learning"
                      className="btn btn-primary btn-sm"
                    >
                      Complete Remaining Lessons →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 3. Failed attempt: Calm neutral panel, level unchanged, retake option */
            <div
              className="card"
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #CBD5E1",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    background: "#E2E8F0",
                    color: "#475569",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#475569", background: "#E2E8F0", padding: "2px 8px", borderRadius: "9999px" }}>
                      Score: {last.score}% · Pass mark: 60%
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#1E293B", fontWeight: 700 }}>
                    Assessment Not Passed · Level Unchanged
                  </h3>
                  <p style={{ margin: "0 0 14px", fontSize: "13.5px", color: "#475569", lineHeight: 1.5 }}>
                    Your current competency level remains unchanged. Retaking an assessment will never lower your level. Review the training materials and retake the assessment when prepared.
                  </p>
                  {(() => {
                    const attemptedAssessment = assessments.find((a) => a.id === last.assessmentId);
                    return attemptedAssessment ? (
                      <button
                        onClick={() => handleRetake(attemptedAssessment)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <RotateCcw size={14} /> Retake Assessment
                      </button>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          ASSESSMENT LIST
          Each card shows level jump at the top ("Passing this moves you from L1 to L2")
          ========================================================= */}
      <div className="assessment-list">
        {assessments.map((a) => {
          const attempts = db.attempts.filter(
            (x) => x.assessmentId === a.id && x.traineeId === trainee?.id
          );
          const best = attempts.length ? Math.max(...attempts.map((x) => x.score)) : null;
          const course = db.courses.find((c) => c.id === a.courseId);
          const compName = course?.competency || a.subject;

          return (
            <article key={a.id} className="assessment-card">
              <div className="assessment-card-content">
                {/* 1. Show level jump at the top ("Passing this moves you from L1 to L2") */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <Badge tone={a.type === "post" ? "blue" : "gray"}>
                    {a.type === "pre" ? "Pre-Assessment" : "Post-Assessment"}
                  </Badge>
                  {course?.entryLevel && course?.targetLevel ? (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      <span style={{ fontSize: "11.5px", color: "var(--brand-dark)", fontWeight: 600 }}>
                        Passing this moves you:
                      </span>
                      <LevelJumpBadge from={course.entryLevel} to={course.targetLevel} size="sm" />
                    </div>
                  ) : null}
                </div>

                <h3 style={{ margin: "0 0 6px", fontSize: "17px", color: "var(--text-heading)", fontWeight: 700 }}>
                  {a.title}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
                  {compName} · Course: {course?.title || a.courseId} · {a.questions.length} questions · {a.durationMin} mins · <strong>Pass mark {a.passingPercentage}%</strong>
                </p>
              </div>

              <div className="assessment-card-actions">
                {best !== null && (
                  <Badge tone={best >= a.passingPercentage ? "green" : "red"}>
                    Best: {best}% {best >= a.passingPercentage ? "(Passed)" : ""}
                  </Badge>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setLast(null);
                    setActive(a);
                    setAnswers([]);
                  }}
                >
                  {attempts.length ? "Retake Assessment" : "Attempt Assessment"}
                </button>
              </div>
            </article>
          );
        })}

        {!assessments.length && (
          <EmptyState
            title="No assessments available"
            body="Enroll in approved operational courses and complete training lessons to access practical competency assessments."
          />
        )}
      </div>

      {/* =========================================================
          ACTIVE ASSESSMENT MODAL
          Prominently displays: "Passing this moves you from L1 to L2"
          ========================================================= */}
      {active && (
        <div className="modal-backdrop">
          <form className="modal-card assessment-modal" onSubmit={submit} style={{ maxWidth: "720px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "14px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "19px" }}>{active.title}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
                  {activeCourse?.competency || active.subject} · {active.durationMin} minutes · Pass mark: <strong>{active.passingPercentage}%</strong>
                </p>
              </div>
            </div>

            {/* Top Level Jump Notice Banner */}
            {activeCourse?.entryLevel && activeCourse?.targetLevel && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1.5px solid #FECACA",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Compass size={18} color="var(--brand-primary)" />
                  <span style={{ fontSize: "13px", color: "#991B1B", fontWeight: 600 }}>
                    Passing this moves you from <strong>{activeCourse.entryLevel}</strong> to <strong>{activeCourse.targetLevel}</strong> in {activeCourse.competency}
                  </span>
                </div>
                <LevelJumpBadge from={activeCourse.entryLevel} to={activeCourse.targetLevel} size="sm" />
              </div>
            )}

            {/* Assessment Questions (IMD-style Modern MCQs) */}
            <div className="mcq-list">
              {active.questions.map((q, i) => (
                <div key={q.id} className="mcq-question">
                  <div className="mcq-question-title">
                    <span className="mcq-question-number">{i + 1}</span>
                    <h4>{q.text}</h4>
                  </div>

                  <div className="mcq-options">
                    {q.options.map((o, j) => {
                      const isSelected = answers[i] === j;
                      const letter = String.fromCharCode(65 + j);

                      return (
                        <label
                          key={o}
                          className={`mcq-option ${isSelected ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`${active.id}-${q.id}`}
                            checked={isSelected}
                            onChange={() => {
                              const a = [...answers];
                              a[i] = j;
                              setAnswers(a);
                            }}
                            required
                          />
                          <span className="mcq-option-letter">{letter}</span>
                          <span className="mcq-option-text">{o}</span>
                          <span className="mcq-option-indicator" aria-hidden="true" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions assessment-modal-actions">
              <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>
                Answered: {answers.filter((x) => x !== undefined).length} / {active.questions.length}
              </span>

              <div className="assessment-modal-buttons">
                <button type="button" className="btn btn-secondary" onClick={() => setActive(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={answers.filter((x) => x !== undefined).length < active.questions.length}
                  style={{ fontWeight: 700, padding: "8px 22px" }}
                >
                  Submit Assessment →
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
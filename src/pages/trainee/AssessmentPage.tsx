import { FormEvent, useState } from "react";
import { ArrowRight, Award, CheckCircle2, Clock, HelpCircle, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, EmptyState, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { Assessment } from "../../types";

export default function AssessmentPage() {
  const { db, currentUser, submitAssessment } = useApp();
  const trainee = db.trainees.find(t => t.userId === currentUser?.id);
  const enrolled = db.enrollments.filter(e => e.traineeId === trainee?.id && ["approved", "completed"].includes(e.status));
  const assessments = db.assessments.filter(a => a.type !== "competency" && enrolled.some(e => e.courseId === a.courseId));

  const [active, setActive] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<{ score: number; passed: boolean; courseTitle?: string; targetLevel?: string; compName?: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const course = db.courses.find(c => c.id === active.courseId);
    const r = submitAssessment(active.id, answers);
    if (r) {
      setLastResult({
        score: r.score,
        passed: r.passed,
        courseTitle: course?.title,
        targetLevel: course?.targetLevel,
        compName: course?.competency || course?.subject
      });
    }
    setActive(null);
    setAnswers([]);
  };

  return (
    <>
      <PageHeader
        title="Course Assessments & Level Progression"
        subtitle="Complete post-training assessments with at least 60% to advance your competency level and unlock higher-tier courses."
      />

      {/* LEVEL PROGRESSION SUCCESS BANNER */}
      {lastResult && (
        <section
          style={{
            marginBottom: "24px",
            padding: "20px 24px",
            background: lastResult.passed ? "#F0FDF4" : "#FEF2F2",
            border: lastResult.passed ? "2px solid #10B981" : "2px solid #F87171",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: lastResult.passed ? "#10B981" : "#EF4444",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {lastResult.passed ? <Sparkles size={24} /> : <HelpCircle size={24} />}
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: lastResult.passed ? "#065F46" : "#991B1B" }}>
                  {lastResult.passed ? "Assessment Passed & Competency Promoted!" : "Assessment Not Passed (Score below 60%)"}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: lastResult.passed ? "#047857" : "#7F1D1D" }}>
                  Score: <strong>{lastResult.score}%</strong> (Passing Mark: 60%). &nbsp;
                  {lastResult.passed ? (
                    <span>
                      Congratulations! You achieved <strong>{lastResult.targetLevel || "Next Level"}</strong> in <strong>{lastResult.compName}</strong>.
                      The next-stage course has now been unlocked in your learning path.
                    </span>
                  ) : (
                    <span>Please review course materials and retake the assessment to unlock the next level.</span>
                  )}
                </p>
              </div>
            </div>

            {lastResult.passed && (
              <Link
                to="/trainee/recommendations"
                className="btn btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                View Unlocked Courses <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ASSESSMENT LIST */}
      <div className="assessment-list">
        {assessments.map(a => {
          const course = db.courses.find(c => c.id === a.courseId);
          const attempts = db.attempts.filter(x => x.assessmentId === a.id && x.traineeId === trainee?.id);
          const best = attempts.length ? Math.max(...attempts.map(x => x.score)) : null;
          const isPassed = best !== null && best >= a.passingPercentage;

          return (
            <article
              key={a.id}
              style={{
                border: isPassed ? "1.5px solid #10B981" : "1.5px solid #CBD5E1",
                background: "#FFFFFF",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Badge tone={a.type === "post" ? "blue" : "gray"}>
                    {a.type === "post" ? "Post-Training Assessment" : "Pre-Test"}
                  </Badge>
                  {course?.entryLevel && course?.targetLevel && (
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#0056D2", background: "#EFF6FF", padding: "2px 8px", borderRadius: "4px" }}>
                      Target: {course.entryLevel} → {course.targetLevel}
                    </span>
                  )}
                  {isPassed && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#059669", background: "#ECFDF5", padding: "2px 8px", borderRadius: "4px" }}>
                      <CheckCircle2 size={12} /> LEVEL UNLOCKED
                    </span>
                  )}
                </div>

                <h3 style={{ margin: "2px 0 6px", fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>
                  {a.title}
                </h3>

                <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
                  {course?.title} · {a.questions.length} questions · {a.durationMin} minutes · Pass mark: <strong>{a.passingPercentage}%</strong>
                  {a.deadline && <span> · Deadline: {a.deadline}</span>}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {best !== null && (
                  <Badge tone={isPassed ? "green" : "red"}>
                    Best: {best}% {isPassed ? "(Pass)" : "(Retake Needed)"}
                  </Badge>
                )}

                <button
                  className={isPassed ? "btn btn-secondary" : "btn btn-primary"}
                  onClick={() => {
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
            title="No assessments currently available"
            body="Enroll in your recommended level-based courses to take relevant competency qualification assessments."
          />
        )}
      </div>

      {/* MODAL FOR ATTEMPTING ASSESSMENT */}
      {active && (
        <div className="modal-backdrop">
          <form className="modal-card assessment-modal" onSubmit={submit} style={{ maxWidth: "680px" }}>
            <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0F172A" }}>{active.title}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748B" }}>
                  {active.questions.length} questions · {active.durationMin} min · Minimum {active.passingPercentage}% required to advance level
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "60vh", overflowY: "auto", padding: "16px 4px" }}>
              {active.questions.map((q, i) => (
                <fieldset
                  className="question-card compact-q"
                  key={q.id}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "#FAFAFA"
                  }}
                >
                  <legend style={{ fontWeight: "700", color: "#0F172A", fontSize: "14px", padding: "0 6px" }}>
                    Question {i + 1} of {active.questions.length}
                  </legend>
                  <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#1E293B", fontWeight: "600" }}>
                    {q.text}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {q.options.map((o, j) => (
                      <label
                        className={answers[i] === j ? "selected" : ""}
                        key={o}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 14px",
                          borderRadius: "6px",
                          border: answers[i] === j ? "1.5px solid #0056D2" : "1px solid #CBD5E1",
                          background: answers[i] === j ? "#EFF6FF" : "#FFFFFF",
                          cursor: "pointer",
                          fontSize: "13px",
                          color: "#334155"
                        }}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[i] === j}
                          onChange={() => {
                            const a = [...answers];
                            a[i] = j;
                            setAnswers(a);
                          }}
                          required
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="modal-actions" style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActive(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Submit Assessment
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
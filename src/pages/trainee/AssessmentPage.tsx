import { FormEvent, useState } from "react";
import { ArrowUpCircle, AlertTriangle, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { Badge, EmptyState, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { Assessment, AssessmentAttempt } from "../../types";

export default function AssessmentPage() {
  const { db, currentUser, submitAssessment } = useApp();
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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const r = submitAssessment(active.id, answers);
    setLast(r);
    setActive(null);
    setAnswers([]);
  };

  return (
    <>
      <PageHeader
        title="Assessments"
        subtitle="Attempt course MCQs, compare pre- and post-training performance and verify learning."
      />

      {/* Phase 6: Enhanced result banner with level-up info */}
      {last && (
        <div
          className={last.passed ? "success-banner" : "warning-banner"}
          style={{ marginBottom: "20px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            {last.passed ? <CheckCircle2 size={20} color="#047857" /> : <XCircle size={20} color="#B91C1C" />}
            <strong style={{ fontSize: "15px" }}>
              Latest result: {last.score}% — {last.passed ? "PASS" : "NOT PASSED"}
            </strong>
          </div>

          {last.levelUpInfo && (
            <div
              style={{
                marginTop: "10px",
                padding: "12px 14px",
                borderRadius: "6px",
                background: last.levelUpInfo.levelled ? "#ECFDF5" : last.levelUpInfo.lessonsIncomplete ? "#FEF3C7" : "#F8FAFC",
                border: `1px solid ${last.levelUpInfo.levelled ? "#A7F3D0" : last.levelUpInfo.lessonsIncomplete ? "#FDE68A" : "#E2E8F0"}`,
              }}
            >
              {last.levelUpInfo.levelled ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <ArrowUpCircle size={20} color="#10B981" />
                    <strong style={{ color: "#065F46", fontSize: "14px" }}>
                      Level Updated: {last.levelUpInfo.previousLevel} → {last.levelUpInfo.newLevel}
                    </strong>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#047857" }}>
                    Your competency level in <strong>{last.levelUpInfo.competency}</strong> has been
                    upgraded from {last.levelUpInfo.previousLevel} to {last.levelUpInfo.newLevel}.
                  </p>
                  {last.levelUpInfo.roleRequirementMet && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "13px",
                        color: "#065F46",
                        fontWeight: 600,
                        background: "#D1FAE5",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        display: "inline-block",
                      }}
                    >
                      ✓ Role requirement met for {last.levelUpInfo.competency}
                      {last.levelUpInfo.roleRequiredLevel && ` (required: ${last.levelUpInfo.roleRequiredLevel})`}
                    </p>
                  )}
                </>
              ) : last.levelUpInfo.lessonsIncomplete ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <BookOpen size={20} color="#92400E" style={{ marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#92400E", fontSize: "13.5px" }}>
                      Complete all lessons to receive the level upgrade
                    </strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#78350F" }}>
                      {last.levelUpInfo.message}
                    </p>
                  </div>
                </div>
              ) : !last.passed ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <AlertTriangle size={20} color="#64748B" style={{ marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#334155", fontSize: "13.5px" }}>
                      Your level is unchanged
                    </strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#64748B" }}>
                      {last.levelUpInfo.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <CheckCircle2 size={20} color="#2563EB" style={{ marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#1E40AF", fontSize: "13.5px" }}>
                      Assessment Passed
                    </strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#64748B" }}>
                      {last.levelUpInfo.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!last.levelUpInfo && (
            <span>{last.passed ? "Result saved successfully." : "Review the course and retake when permitted."}</span>
          )}
        </div>
      )}

      {/* Assessment list */}
      <div className="assessment-list">
        {assessments.map((a) => {
          const attempts = db.attempts.filter(
            (x) => x.assessmentId === a.id && x.traineeId === trainee?.id
          );
          const best = attempts.length ? Math.max(...attempts.map((x) => x.score)) : null;
          const course = db.courses.find((c) => c.id === a.courseId);

          return (
            <article key={a.id}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <Badge tone={a.type === "post" ? "blue" : "gray"}>
                    {a.type === "pre" ? "Pre-test" : "Post-test"}
                  </Badge>
                  {course?.entryLevel && course?.targetLevel && (
                    <Badge tone="blue">
                      {course.entryLevel} → {course.targetLevel}
                    </Badge>
                  )}
                </div>
                <h3>{a.title}</h3>
                <p>
                  {course?.competency || a.subject} · {a.questions.length} questions · {a.durationMin}{" "}
                  minutes · Pass {a.passingPercentage}%
                  {a.deadline ? ` · Due ${a.deadline}` : ""}
                </p>
              </div>
              <div>
                {best !== null && (
                  <Badge tone={best >= a.passingPercentage ? "green" : "red"}>
                    Best {best}%
                  </Badge>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setActive(a);
                    setAnswers([]);
                  }}
                >
                  {attempts.length ? "Retake" : "Attempt"}
                </button>
              </div>
            </article>
          );
        })}
        {!assessments.length && (
          <EmptyState
            title="No assessments available"
            body="Approved course assessments will appear here."
          />
        )}
      </div>

      {/* Assessment modal */}
      {active && (
        <div className="modal-backdrop">
          <form className="modal-card assessment-modal" onSubmit={submit}>
            <div className="panel-head">
              <div>
                <h3>{active.title}</h3>
                <p>
                  {active.durationMin} min · Pass {active.passingPercentage}%
                </p>
              </div>
            </div>
            {active.questions.map((q, i) => (
              <fieldset className="question-card compact-q" key={q.id}>
                <legend>
                  {i + 1}. {q.text}
                </legend>
                {q.options.map((o, j) => (
                  <label className={answers[i] === j ? "selected" : ""} key={o}>
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
              </fieldset>
            ))}
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setActive(null)}>
                Cancel
              </button>
              <button className="btn btn-primary">Submit answers</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
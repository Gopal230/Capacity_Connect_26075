import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  FileQuestion,
  RotateCcw,
} from "lucide-react";
import { Badge, PageHeader } from "../../components/UI";
import { LevelBadge } from "../../components/LevelUI";
import { useApp } from "../../context/AppContext";

export default function CompetencyCheck() {
  const { db, currentUser, runCompetencyCheck } = useApp();
  const nav = useNavigate();
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const competencyAssessments = db.assessments.filter(
    (a) => a.type === "competency" || a.type === "post"
  );
  const [assessmentId, setAssessmentId] = useState(
    competencyAssessments[0]?.id || ""
  );
  const assessment = db.assessments.find((a) => a.id === assessmentId);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!assessment || !trainee) return;
    const correct = assessment.questions.reduce(
      (s, q, i) => s + (answers[i] === q.answer ? 1 : 0),
      0
    );
    const score = Math.round((correct / assessment.questions.length) * 100);
    const missed = assessment.questions
      .filter((q, i) => answers[i] !== q.answer)
      .map((q) => q.competency);
    const r = runCompetencyCheck(
      trainee.designation,
      assessment.subject,
      score,
      [...new Set(missed)]
    );
    setResult(r);
  };

  const answeredCount = answers.filter((x) => x !== undefined).length;
  const totalCount = assessment?.questions.length || 0;

  return (
    <>
      <PageHeader
        title="Role Competency Diagnostic & Benchmarking"
        subtitle="Benchmark your operational capability against the official IMD role requirements using standardized evaluation MCQs."
      />

      {!result ? (
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            borderRadius: "12px",
            border: "1.5px solid #CBD5E1",
            padding: "24px",
          }}
        >
          {/* Header & Assessment Selection */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
              paddingBottom: "18px",
              borderBottom: "1.5px solid #E2E8F0",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#DC2626",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  marginBottom: "6px",
                }}
              >
                <BrainCircuit size={13} />
                Role-Based Diagnostic
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#0F172A", fontWeight: 700 }}>
                Select Role Competency Assessment
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>
                Current Role: <strong>{trainee?.jobRole || trainee?.designation || "Operational Trainee"}</strong> · Station: <strong>{trainee?.centre || "IMD Field Station"}</strong>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>
                Assessment:
              </label>
              <select
                value={assessmentId}
                onChange={(e) => {
                  setAssessmentId(e.target.value);
                  setAnswers([]);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #CBD5E1",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  background: "#F8FAFC",
                  color: "#0F172A",
                  minWidth: "260px",
                }}
              >
                {competencyAssessments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.subject})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {assessment && (
            <form onSubmit={submit}>
              {/* Meta Banner */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Badge tone="blue">{assessment.subject}</Badge>
                  <span style={{ fontSize: "12.5px", color: "#64748B", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <FileQuestion size={14} />
                    {assessment.questions.length} Standardized Questions
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#64748B", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} />
                    {assessment.durationMin} minutes
                  </span>
                </div>

                <span style={{ fontSize: "12.5px", color: "#475569", fontWeight: 600 }}>
                  Pass Benchmark: <strong>{assessment.passingPercentage || 60}%</strong>
                </span>
              </div>

              {/* MCQ Question List (Exact Assessment Design) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {assessment.questions.map((q, i) => (
                  <div
                    key={q.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid #CBD5E1",
                      borderRadius: "10px",
                      padding: "18px 20px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "14px" }}>
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: "#081A2E",
                          color: "#FFFFFF",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 800,
                          fontSize: "12px",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <h4 style={{ margin: 0, fontSize: "15px", color: "#0F172A", fontWeight: 700, lineHeight: 1.45 }}>
                        {q.text}
                      </h4>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {q.options.map((o, j) => {
                        const isSelected = answers[i] === j;
                        const letter = String.fromCharCode(65 + j);

                        return (
                          <div
                            key={o}
                            onClick={() => {
                              const a = [...answers];
                              a[i] = j;
                              setAnswers(a);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: `2px solid ${isSelected ? "#DC2626" : "#E2E8F0"}`,
                              background: isSelected ? "#FEF2F2" : "#F8FAFC",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div
                                style={{
                                  width: "26px",
                                  height: "26px",
                                  borderRadius: "50%",
                                  background: isSelected ? "#DC2626" : "#FFFFFF",
                                  color: isSelected ? "#FFFFFF" : "#64748B",
                                  border: `1.5px solid ${isSelected ? "#DC2626" : "#CBD5E1"}`,
                                  display: "grid",
                                  placeItems: "center",
                                  fontWeight: 800,
                                  fontSize: "11.5px",
                                  flexShrink: 0,
                                }}
                              >
                                {letter}
                              </div>
                              <span
                                style={{
                                  fontSize: "13.5px",
                                  color: isSelected ? "#991B1B" : "#1E293B",
                                  fontWeight: isSelected ? 700 : 500,
                                }}
                              >
                                {o}
                              </span>
                            </div>

                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                border: `2px solid ${isSelected ? "#DC2626" : "#CBD5E1"}`,
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0,
                                background: "#FFFFFF",
                              }}
                            >
                              {isSelected && (
                                <div
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#DC2626",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky Action Bar */}
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#F8FAFC",
                  border: "1.5px solid #CBD5E1",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  flexWrap: "wrap",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13.5px", color: "#475569", fontWeight: 600 }}>
                    Answered: <strong style={{ color: answeredCount === totalCount ? "#15803D" : "#DC2626" }}>{answeredCount}</strong> / {totalCount} questions
                  </span>
                  {answeredCount < totalCount && (
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      ({totalCount - answeredCount} remaining)
                    </span>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={answeredCount < totalCount}
                  style={{ fontWeight: 700, padding: "10px 24px", fontSize: "14px" }}
                >
                  Submit Competency Check →
                </button>
              </div>
            </form>
          )}
        </section>
      ) : (
        /* Result Diagnostic View */
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            borderRadius: "12px",
            border: "1.5px solid #CBD5E1",
            padding: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1.5px solid #E2E8F0",
              paddingBottom: "18px",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#15803D",
                  background: "#DCFCE7",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginBottom: "4px",
                }}
              >
                Diagnostic Completed
              </span>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0F172A", fontWeight: 700 }}>
                Competency Evaluation Result: {result.subject}
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                padding: "10px 16px",
                borderRadius: "10px",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", color: "#64748B", display: "block" }}>Diagnostic Score</span>
                <strong style={{ fontSize: "22px", color: result.score >= 60 ? "#15803D" : "#DC2626" }}>
                  {result.score}%
                </strong>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {/* Achieved vs Required Level */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginBottom: "8px" }}>
                Assessed Competency Level
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <Badge tone="amber">{result.currentLevel}</Badge>
                <ArrowRight size={16} color="#64748B" />
                <span style={{ fontSize: "13px", color: "#334155" }}>
                  Required for Role: <strong>{result.requiredLevel}</strong>
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", lineHeight: 1.45 }}>
                {result.gapText}
              </p>
            </div>

            {/* Missing Competency Gaps */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                padding: "18px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginBottom: "8px" }}>
                Competency Gap Analysis
              </span>
              {result.missingCompetencies.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "12.5px", color: "#B91C1C", fontWeight: 600 }}>
                    Identified Areas for Knowledge Upskilling:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.missingCompetencies.map((x: string) => (
                      <span
                        key={x}
                        style={{
                          background: "#FEF2F2",
                          border: "1px solid #FECACA",
                          color: "#991B1B",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#15803D", fontWeight: 600, fontSize: "13.5px" }}>
                  <CheckCircle2 size={18} />
                  No competency gaps detected for this evaluation!
                </div>
              )}
            </div>
          </div>

          {/* Result Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setResult(null);
                setAnswers([]);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RotateCcw size={14} /> Retake Assessment
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => nav("/trainee/recommendations")}
              style={{ fontWeight: 700 }}
            >
              See Personalized Recommendations →
            </button>
          </div>
        </section>
      )}
    </>
  );
}
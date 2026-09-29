import { FormEvent, useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Compass,
  Gauge,
  Play,
  Radar,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { LevelBadge } from "../../components/LevelUI";
import { Badge, EmptyState, PageHeader, ProgressBar } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { OperationalScenario } from "../../types";

export default function ScenarioLab() {
  const { db, currentUser, submitScenario } = useApp();
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);

  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [active, setActive] = useState<OperationalScenario | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; band: string; passed: boolean; scenarioTitle: string } | null>(null);

  const scenarios = db.scenarios.filter((s) => {
    const matchSubject = filterSubject === "all" || s.subject === filterSubject;
    const matchDiff = filterDifficulty === "all" || s.difficulty === filterDifficulty;
    return matchSubject && matchDiff;
  });

  const allSubjects = Array.from(new Set(db.scenarios.map((s) => s.subject)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const r = submitScenario(active.id, answers);
    if (r) {
      setResult({
        score: r.score,
        band: r.readinessBand,
        passed: r.passed,
        scenarioTitle: active.title,
      });
    }
    setActive(null);
    setAnswers([]);
  };

  const getDifficultyLevel = (diff: string) => {
    if (diff === "Advanced") return "L3";
    if (diff === "Intermediate") return "L2";
    return "L1";
  };

  return (
    <>
      <PageHeader
        title="Practical Lab Assessment & Simulation"
        subtitle="Experience job-critical operational decision scenarios under simulated severe weather constraints. Directly impacts your Operational Readiness Index (ORI)."
      />

      {/* Result feedback banner */}
      {result && (
        <section
          style={{
            background: result.passed
              ? "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)"
              : "linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)",
            border: `1.5px solid ${result.passed ? "#86EFAC" : "#FCA5A5"}`,
            borderRadius: "10px",
            padding: "18px 22px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {result.passed ? <CheckCircle2 size={28} color="#16A34A" /> : <AlertTriangle size={28} color="#DC2626" />}
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", color: result.passed ? "#166534" : "#991B1B" }}>
                  Simulation Evaluation: {result.score}% — {result.band}
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: result.passed ? "#15803D" : "#B91C1C" }}>
                  Scenario: <strong>{result.scenarioTitle}</strong> · Saved to verified capability passport and readiness score.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setResult(null)}
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {/* Filter toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1.5px solid #CBD5E1",
              fontSize: "13px",
              background: "#FFFFFF",
              color: "#0F172A",
              fontWeight: 500,
            }}
          >
            <option value="all">All Competency Areas</option>
            {allSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1.5px solid #CBD5E1",
              fontSize: "13px",
              background: "#FFFFFF",
              color: "#0F172A",
              fontWeight: 500,
            }}
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner (L1)</option>
            <option value="Intermediate">Intermediate (L2)</option>
            <option value="Advanced">Advanced (L3/L4)</option>
          </select>
        </div>

        <div style={{ fontSize: "12.5px", color: "var(--text-muted)", fontWeight: 600 }}>
          {scenarios.length} Interactive Lab Simulation(s) Available
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="scenario-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "18px" }}>
        {scenarios.map((s) => {
          const attempts = db.scenarioAttempts.filter(
            (a) => a.traineeId === trainee?.id && a.scenarioId === s.id
          );
          const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : null;
          const isPassed = best !== null && best >= s.passingPercentage;

          return (
            <article
              className="scenario-card"
              key={s.id}
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #CBD5E1",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <LevelBadge level={getDifficultyLevel(s.difficulty)} size="sm" />
                    <Badge tone="gray">{s.subject}</Badge>
                  </div>
                  {best !== null && (
                    <Badge tone={isPassed ? "green" : "red"}>
                      Best: {best}% {isPassed ? "(Passed)" : ""}
                    </Badge>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0056D2", fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  <Radar size={14} /> Operational Lab Simulator
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: "16.5px", color: "var(--text-heading)", lineHeight: "1.3" }}>
                  {s.title}
                </h3>

                <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-body)", lineHeight: "1.5" }}>
                  {s.context}
                </p>
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px", marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span><b>{s.steps.length}</b> Operational Decision Steps</span>
                  <span>Pass Threshold: <b>{s.passingPercentage}%</b></span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", fontWeight: 600 }}
                  onClick={() => {
                    setActive(s);
                    setAnswers([]);
                  }}
                >
                  <Play size={15} />
                  <span>{attempts.length ? "Rerun Simulation" : "Launch Practical Simulation"}</span>
                </button>
              </div>
            </article>
          );
        })}

        {scenarios.length === 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <EmptyState
              title="No Scenarios Match Your Filter"
              body="Try selecting a different competency area or difficulty level from the filters above."
            />
          </div>
        )}
      </div>

      {/* =========================================================
          INTERACTIVE SCENARIO SIMULATION MODAL
          ========================================================= */}
      {active && (
        <div className="modal-backdrop">
          <form
            className="modal-card scenario-modal"
            onSubmit={submit}
            style={{ maxWidth: "740px", maxHeight: "90vh", overflowY: "auto", border: "1.5px solid #CBD5E1", borderRadius: "12px", padding: "24px" }}
          >
            <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "14px", marginBottom: "18px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Radar size={18} color="#0056D2" />
                  <Badge tone="blue">IMD Operational Lab Simulation</Badge>
                  <LevelBadge level={getDifficultyLevel(active.difficulty)} size="sm" />
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: "18.5px" }}>{active.title}</h3>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: "1.5", background: "#F8FAFC", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <strong>Operational Context:</strong> {active.context}
                </p>
              </div>
            </div>

            {/* Decision Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {active.steps.map((step, i) => (
                <fieldset
                  className="question-card compact-q"
                  key={step.id}
                  style={{
                    border: "1.5px solid #CBD5E1",
                    borderRadius: "10px",
                    padding: "16px 18px",
                    background: "#FFFFFF",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <legend style={{ fontWeight: 700, color: "var(--text-heading)", padding: "0 8px", fontSize: "14.5px" }}>
                    Decision Step {i + 1} of {active.steps.length}: {step.prompt}
                  </legend>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                    {step.options.map((option, j) => (
                      <label
                        className={answers[i] === j ? "selected" : ""}
                        key={option}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: `1.5px solid ${answers[i] === j ? "#0056D2" : "#CBD5E1"}`,
                          background: answers[i] === j ? "#EFF6FF" : "#F8FAFC",
                          cursor: "pointer",
                          fontSize: "13.5px",
                          fontWeight: answers[i] === j ? 600 : 400,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name={step.id}
                          checked={answers[i] === j}
                          onChange={() => {
                            const a = [...answers];
                            a[i] = j;
                            setAnswers(a);
                          }}
                          required
                          style={{ accentColor: "#0056D2", width: "16px", height: "16px", flexShrink: 0 }}
                        />
                        <span style={{ color: "var(--text-heading)" }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActive(null)}
              >
                Abort Simulation
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={answers.filter((x) => x !== undefined).length !== active.steps.length}
              >
                Submit Operational Decisions
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

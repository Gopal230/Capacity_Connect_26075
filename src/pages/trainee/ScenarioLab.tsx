import { FormEvent, useState } from "react";
import { Badge, PageHeader } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { OperationalScenario } from "../../types";
import PracticalAssessmentLab from "./PracticalAssessmentLab";
import { CloudLightning, Layers, Play, Radar } from "lucide-react";

export default function ScenarioLab() {
  const { db, currentUser, submitScenario } = useApp();
  const [activeTab, setActiveTab] = useState<"interactive" | "all">("interactive");
  const trainee = db.trainees.find((t) => t.userId === currentUser?.id);
  const scenarios = db.scenarios.filter(
    (s) =>
      s.role === trainee?.designation ||
      s.subject === Object.keys(trainee?.skills || {})[0] ||
      true
  );
  const [active, setActive] = useState<OperationalScenario | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; band: string } | null>(
    null
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!active) return;
    const r = submitScenario(active.id, answers);
    if (r) setResult({ score: r.score, band: r.readinessBand });
    setActive(null);
    setAnswers([]);
  };

  return (
    <>
      <PageHeader
        title="Operational Practical Lab & Scenario Assessment"
        subtitle="Practice real-time meteorological decisions under operational constraints. Evaluated decisions contribute directly to your Operational Readiness Index (ORI)."
      />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1.5px solid #CBD5E1",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("interactive")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: activeTab === "interactive" ? 700 : 500,
            color: activeTab === "interactive" ? "#DC2626" : "#475569",
            borderBottom: activeTab === "interactive" ? "3px solid #DC2626" : "3px solid transparent",
            background: "transparent",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            cursor: "pointer",
            marginBottom: "-1.5px",
          }}
        >
          <CloudLightning size={16} />
          Thunderstorm Nowcasting Lab
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("all")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            fontWeight: activeTab === "all" ? 700 : 500,
            color: activeTab === "all" ? "#DC2626" : "#475569",
            borderBottom: activeTab === "all" ? "3px solid #DC2626" : "3px solid transparent",
            background: "transparent",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            cursor: "pointer",
            marginBottom: "-1.5px",
          }}
        >
          <Layers size={16} />
          Operational Scenario Library ({scenarios.length})
        </button>
      </div>

      {activeTab === "interactive" ? (
        <PracticalAssessmentLab />
      ) : (
        <>
          {result && (
            <div
              className={result.score >= 70 ? "success-banner" : "warning-banner"}
              style={{ marginBottom: "20px" }}
            >
              <strong>
                Scenario readiness: {result.score}% — {result.band}
              </strong>
              <span>
                The result is saved in your capability record and readiness profile.
              </span>
            </div>
          )}

          <div className="scenario-grid">
            {scenarios.map((s) => {
              const attempts = db.scenarioAttempts.filter(
                (a) => a.traineeId === trainee?.id && a.scenarioId === s.id
              );
              const best = attempts.length
                ? Math.max(...attempts.map((a) => a.score))
                : null;

              return (
                <article className="scenario-card" key={s.id}>
                  <div className="scenario-top">
                    <Badge tone={s.difficulty === "Advanced" ? "red" : "blue"}>
                      {s.difficulty}
                    </Badge>
                    {best !== null && (
                      <Badge tone={best >= s.passingPercentage ? "green" : "amber"}>
                        Best {best}%
                      </Badge>
                    )}
                  </div>
                  <span className="eyebrow">
                    {s.subject} · {s.steps.length} decisions
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.context}</p>
                  <div className="scenario-footer">
                    <span>Pass threshold {s.passingPercentage}%</span>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setActive(s);
                        setAnswers([]);
                      }}
                    >
                      {attempts.length ? "Run again" : "Start simulation"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {active && (
            <div className="modal-backdrop">
              <form className="modal-card scenario-modal" onSubmit={submit}>
                <div className="panel-head">
                  <div>
                    <Badge tone="blue">Operational simulation</Badge>
                    <h3>{active.title}</h3>
                    <p>{active.context}</p>
                  </div>
                </div>

                {active.steps.map((q, i) => (
                  <fieldset className="question-card compact-q" key={q.id}>
                    <legend>
                      {i + 1}. {q.prompt}
                    </legend>
                    {q.options.map((o, j) => (
                      <label
                        className={answers[i] === j ? "selected" : ""}
                        key={o}
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
                  </fieldset>
                ))}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActive(null)}
                  >
                    Exit
                  </button>
                  <button className="btn btn-primary">
                    Submit operational decisions
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}

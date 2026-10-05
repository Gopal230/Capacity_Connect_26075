import { useState } from "react";
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, Clock3, CloudLightning, RotateCcw, Target, XCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PRACTICAL_LAB_SCENARIO } from "../../data/seed";
import type { OperationalScenario } from "../../types";

type AnswerState = {
  selected: number | null;
  submitted: boolean;
};

export default function ScenarioLab() {
  const { db, submitScenario } = useApp();
  const availableScenarios = db.scenarios.length > 0 ? db.scenarios : [PRACTICAL_LAB_SCENARIO];
  const scenarios = availableScenarios.filter(scenario => scenario.steps.length > 0);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [answerState, setAnswerState] = useState<AnswerState>({ selected: null, submitted: false });
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const scenario = scenarios.find(item => item.id === scenarioId);

  const beginScenario = (item: OperationalScenario) => {
    setScenarioId(item.id);
    setStepIndex(0);
    setAnswers([]);
    setAnswerState({ selected: null, submitted: false });
    setResult(null);
  };

  const submitAnswer = () => {
    if (!scenario || answerState.selected === null || answerState.submitted) return;
    const nextAnswers = [...answers];
    nextAnswers[stepIndex] = answerState.selected;
    setAnswers(nextAnswers);
    setAnswerState(current => ({ ...current, submitted: true }));
  };

  const finishScenario = () => {
    if (!scenario) return;
    const correct = scenario.steps.reduce(
      (count, currentStep, index) => count + (answers[index] === currentStep.answer ? 1 : 0),
      0,
    );
    const score = Math.round((correct / scenario.steps.length) * 100);
    setResult({ score, passed: score >= scenario.passingPercentage });
    submitScenario(scenario.id, answers);
  };

  const advance = () => {
    if (!scenario) return;
    setStepIndex(index => index + 1);
    setAnswerState({ selected: null, submitted: false });
  };

  const exitScenario = () => {
    setScenarioId(null);
    setResult(null);
  };

  if (!scenario) {
    return (
      <div className="scenario-lab">
        <header className="scenario-lab__header">
          <div>
            <span className="scenario-lab__eyebrow">TRAINING SIMULATOR</span>
            <h1>Practical Assessment Lab</h1>
            <p>Practice operational decisions in realistic weather scenarios.</p>
          </div>
          <div className="scenario-lab__header-icon"><CloudLightning size={28} /></div>
        </header>
        <div className="scenario-lab__grid">
          {scenarios.map(item => (
            <article className="scenario-lab__card" key={item.id}>
              <div className="scenario-lab__card-icon"><Activity size={22} /></div>
              <div className="scenario-lab__tags">
                <span>{item.subject}</span><span>{item.difficulty}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.context}</p>
              <div className="scenario-lab__meta">
                <span><Target size={15} /> {item.steps.length} decision points</span>
                <span><Clock3 size={15} /> {item.durationMin ?? 10} min</span>
              </div>
              <button className="scenario-lab__primary" onClick={() => beginScenario(item)}>
                Start Simulation <ArrowRight size={17} />
              </button>
            </article>
          ))}
          {scenarios.length === 0 && (
            <div className="scenario-lab__empty">No practical simulations are available right now.</div>
          )}
        </div>
      </div>
    );
  }

  const step = scenario.steps[stepIndex];
  const selectedCorrectly = answerState.selected === step.answer;

  return (
    <div className="scenario-lab">
      <button className="scenario-lab__back" onClick={exitScenario}><ArrowLeft size={16} /> All simulations</button>
      <header className="scenario-lab__header scenario-lab__header--compact">
        <div>
          <span className="scenario-lab__eyebrow">PRACTICAL ASSESSMENT</span>
          <h1>{scenario.title}</h1>
          <p>{scenario.context}</p>
        </div>
        <div className="scenario-lab__header-icon"><CloudLightning size={28} /></div>
      </header>

      {!result ? (
        <>
          <section className="scenario-lab__observations">
            <div className="scenario-lab__section-heading">
              <div><span className="scenario-lab__eyebrow">LIVE SCENARIO DATA</span><h2>Radar Observations</h2></div>
              <span className="scenario-lab__live"><i /> SIMULATION LIVE</span>
            </div>
            {scenario.observations?.length ? (
              <div className="scenario-lab__table-wrap">
                <table>
                  <thead><tr><th>Observation Time</th><th>Max Reflectivity</th><th>Storm Movement</th><th>Echo Top</th></tr></thead>
                  <tbody>{scenario.observations.map((observation, index) => (
                    <tr key={`${observation.time}-${index}`}>
                      <td>{observation.time}</td><td>{observation.reflectivity}</td>
                      <td>{observation.movement}</td><td>{observation.echoTop ?? "—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <p className="scenario-lab__context">{scenario.context}</p>}
          </section>

          <section className="scenario-lab__question">
            <div className="scenario-lab__progress">
              <span>Decision point {stepIndex + 1} of {scenario.steps.length}</span>
              <span>{Math.round(((stepIndex + 1) / scenario.steps.length) * 100)}%</span>
            </div>
            <div className="scenario-lab__progress-track"><span style={{ width: `${((stepIndex + 1) / scenario.steps.length) * 100}%` }} /></div>
            <span className="scenario-lab__eyebrow">{step.competency}</span>
            <h2>{step.title ?? `Decision ${stepIndex + 1}`}</h2>
            <p className="scenario-lab__prompt">{step.prompt}</p>
            <div className="scenario-lab__options">
              {step.options.map((option, index) => {
                const correct = answerState.submitted && index === step.answer;
                const incorrect = answerState.submitted && answerState.selected === index && !correct;
                return (
                  <button
                    key={option}
                    className={`scenario-lab__option${answerState.selected === index ? " is-selected" : ""}${correct ? " is-correct" : ""}${incorrect ? " is-incorrect" : ""}`}
                    onClick={() => !answerState.submitted && setAnswerState(current => ({ ...current, selected: index }))}
                    disabled={answerState.submitted}
                  >
                    <span className="scenario-lab__option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                    {correct && <CheckCircle2 size={19} />}
                    {incorrect && <XCircle size={19} />}
                  </button>
                );
              })}
            </div>
            {answerState.submitted && (
              <div className={`scenario-lab__feedback${selectedCorrectly ? " is-correct" : " is-incorrect"}`}>
                <strong>{selectedCorrectly ? "Correct decision" : "Not quite"}</strong>
                <p>{step.explanation ?? `The recommended response is: ${step.options[step.answer]}`}</p>
              </div>
            )}
            <div className="scenario-lab__actions">
              <span>Passing score: {scenario.passingPercentage}%</span>
              {!answerState.submitted ? (
                <button className="scenario-lab__primary" onClick={submitAnswer} disabled={answerState.selected === null}>
                  Submit Decision <ArrowRight size={17} />
                </button>
              ) : stepIndex < scenario.steps.length - 1 ? (
                <button className="scenario-lab__primary" onClick={advance}>Next Decision <ArrowRight size={17} /></button>
              ) : (
                <button className="scenario-lab__primary" onClick={finishScenario}>View Results <ArrowRight size={17} /></button>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="scenario-lab__result">
          <div className={`scenario-lab__result-icon${result.passed ? " is-passed" : ""}`}>
            {result.passed ? <CheckCircle2 size={34} /> : <Target size={34} />}
          </div>
          <span className="scenario-lab__eyebrow">SIMULATION COMPLETE</span>
          <h2>{result.passed ? "Well done!" : "Keep practicing"}</h2>
          <p>{result.passed ? "You met the passing score for this practical assessment." : "Review the decision feedback and try the simulation again."}</p>
          <div className="scenario-lab__score"><strong>{result.score}%</strong><span>Your score</span></div>
          <div className="scenario-lab__result-actions">
            <button className="scenario-lab__secondary" onClick={() => beginScenario(scenario)}><RotateCcw size={16} /> Retry Simulation</button>
            <button className="scenario-lab__primary" onClick={exitScenario}>All Simulations <ArrowRight size={17} /></button>
          </div>
        </section>
      )}
    </div>
  );
}

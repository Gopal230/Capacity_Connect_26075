import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Play,
  Radar,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge, PageHeader } from "../../components/UI";

const scenario = {
  title: "Thunderstorm Nowcasting",
  course: "Radar Meteorology",
  difficulty: "Advanced",
  duration: "10 min",
  description:
    "A thunderstorm is developing near a populated area. " +
    "Review the sample radar observations and decide how to respond.",
  observations: [
    { time: "14:00", reflectivity: "32 dBZ", movement: "North-East" },
    { time: "14:10", reflectivity: "41 dBZ", movement: "North-East" },
    { time: "14:20", reflectivity: "48 dBZ", movement: "North-East" },
  ],
  questions: [
    {
      title: "Analyze the radar observations",
      question:
        "The radar reflectivity has increased over the last 20 minutes. What should you do first?",
      options: [
        "Ignore the increase",
        "Monitor the storm's intensity and movement",
        "Immediately declare the storm harmless",
      ],
      answer: 1,
      explanation:
        "Increasing reflectivity may indicate a developing storm. " +
        "Monitoring its intensity and movement helps assess the situation.",
    },
    {
      title: "Assess the storm's movement",
      question:
        "The storm is moving towards a populated area. Which information should you consider before deciding on a warning?",
      options: [
        "Only the current temperature",
        "Radar trends, storm movement and other available observations",
        "Only yesterday's weather report",
      ],
      answer: 1,
      explanation:
        "A forecaster should consider multiple observations and the storm's movement before making a decision.",
    },
    {
      title: "Choose the next action",
      question:
        "The storm continues to intensify and is approaching the area. What should you do next?",
      options: [
        "Stop monitoring the storm",
        "Continue monitoring and follow the relevant warning procedure",
        "Wait until the storm has passed",
      ],
      answer: 1,
      explanation:
        "Continue monitoring the changing conditions and follow the applicable warning procedures.",
    },
  ],
};

export default function PracticalAssessmentLab() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const question = scenario.questions[current];
  const score = answers.filter(
    (answer, index) => answer === scenario.questions[index].answer
  ).length;

  const percentage = Math.round((score / scenario.questions.length) * 100);
  const passed = percentage >= 70;

  function submitAnswer() {
    if (selected === null) return;
    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;
    setAnswers(updatedAnswers);
  }

  function nextQuestion() {
    if (current < scenario.questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setStarted(false);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  const submitted = answers[current] !== undefined;

  return (
    <div className="practical-lab" style={{ width: "100%", maxWidth: "960px", margin: "0 auto" }}>
      {/* Page Heading */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", padding: "3px 8px", borderRadius: "4px", marginBottom: "6px" }}>
          <Radar size={13} />
          Interactive Operational Simulation
        </div>
        <h1 style={{ fontSize: "24px", color: "#0F172A", fontWeight: 700, margin: "0 0 6px" }}>
          Practical Assessment Lab: {scenario.title}
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Course: <strong>{scenario.course}</strong> · Difficulty: <strong>{scenario.difficulty}</strong> · Duration: <strong>{scenario.duration}</strong>
        </p>
      </div>

      {/* Screen 1: Briefing & Observations Overview before starting */}
      {!started && !finished && (
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "12px",
            padding: "26px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "18px" }}>
            <div>
              <span style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", color: "#0056D2", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: "4px" }}>
                Scenario Briefing
              </span>
              <h2 style={{ margin: "8px 0 6px", fontSize: "19px", color: "#0F172A", fontWeight: 700 }}>
                {scenario.title}
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>
                {scenario.description}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Badge tone="red">{scenario.difficulty}</Badge>
              <Badge tone="blue">{scenario.duration}</Badge>
            </div>
          </div>

          {/* Observations Table */}
          <div style={{ margin: "22px 0" }}>
            <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#0F172A", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} color="#DC2626" />
              Recorded Doppler Radar Observations:
            </h4>
            <div style={{ overflowX: "auto", border: "1.5px solid #E2E8F0", borderRadius: "8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px", color: "#475569" }}>Time (UTC)</th>
                    <th style={{ padding: "10px 14px", color: "#475569" }}>Reflectivity</th>
                    <th style={{ padding: "10px 14px", color: "#475569" }}>Observed Movement</th>
                    <th style={{ padding: "10px 14px", color: "#475569" }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {scenario.observations.map((obs, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0", background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A" }}>{obs.time}</td>
                      <td style={{ padding: "10px 14px", color: "#DC2626", fontWeight: 700 }}>{obs.reflectivity}</td>
                      <td style={{ padding: "10px 14px", color: "#334155" }}>{obs.movement}</td>
                      <td style={{ padding: "10px 14px", color: idx === 2 ? "#DC2626" : "#64748B", fontWeight: idx === 2 ? 700 : 500 }}>
                        {idx === 0 ? "Initial echo detected" : idx === 1 ? "Rapid intensification (+9 dBZ)" : "Severe convective core (+7 dBZ)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStarted(true);
                setCurrent(0);
                setSelected(null);
                setAnswers([]);
                setFinished(false);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", fontSize: "14.5px", fontWeight: 700 }}
            >
              <Play size={16} /> Start Practical Lab Assessment →
            </button>
          </div>
        </section>
      )}

      {/* Screen 2: Interactive Simulation Questions */}
      {started && !finished && (
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "12px",
            padding: "26px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header Step Progress */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1.5px solid #E2E8F0",
              paddingBottom: "14px",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>
                Step {current + 1} of {scenario.questions.length} · {question.title}
              </span>
              <h3 style={{ margin: "4px 0 0", fontSize: "17px", color: "#0F172A", fontWeight: 700 }}>
                {question.question}
              </h3>
            </div>

            <span
              style={{
                background: "#F1F5F9",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "6px",
              }}
            >
              Question {current + 1} / {scenario.questions.length}
            </span>
          </div>

          {/* Quick Observation Reference Ribbon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "20px",
              fontSize: "12.5px",
              flexWrap: "wrap",
            }}
          >
            <strong style={{ color: "#0F172A" }}>Radar Context:</strong>
            {scenario.observations.map((o, idx) => (
              <span key={idx} style={{ color: "#475569" }}>
                <strong>{o.time}</strong>: <span style={{ color: "#DC2626", fontWeight: 600 }}>{o.reflectivity}</span> ({o.movement})
              </span>
            ))}
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {question.options.map((opt, idx) => {
              const isSelected = selected === idx || answers[current] === idx;
              const isCorrect = submitted && idx === question.answer;
              const isWrong = submitted && answers[current] === idx && idx !== question.answer;
              const letter = String.fromCharCode(65 + idx);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!submitted) setSelected(idx);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: `2px solid ${
                      isCorrect
                        ? "#16A34A"
                        : isWrong
                        ? "#DC2626"
                        : isSelected
                        ? "#DC2626"
                        : "#E2E8F0"
                    }`,
                    background: isCorrect
                      ? "#F0FDF4"
                      : isWrong
                      ? "#FEF2F2"
                      : isSelected
                      ? "#FEF2F2"
                      : "#FFFFFF",
                    cursor: submitted ? "default" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: isCorrect
                          ? "#16A34A"
                          : isWrong
                          ? "#DC2626"
                          : isSelected
                          ? "#DC2626"
                          : "#FFFFFF",
                        color: isSelected || isCorrect || isWrong ? "#FFFFFF" : "#64748B",
                        border: `1.5px solid ${
                          isCorrect
                            ? "#16A34A"
                            : isWrong
                            ? "#DC2626"
                            : isSelected
                            ? "#DC2626"
                            : "#CBD5E1"
                        }`,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: "12px",
                        flexShrink: 0,
                      }}
                    >
                      {letter}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: isCorrect ? "#15803D" : isWrong ? "#991B1B" : "#1E293B",
                        fontWeight: isSelected || isCorrect ? 700 : 500,
                      }}
                    >
                      {opt}
                    </span>
                  </div>

                  {submitted && (
                    <div>
                      {isCorrect && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#16A34A", fontSize: "12px", fontWeight: 700 }}>
                          <CheckCircle2 size={16} /> Correct Decision
                        </span>
                      )}
                      {isWrong && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#DC2626", fontSize: "12px", fontWeight: 700 }}>
                          <XCircle size={16} /> Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {submitted && (
            <div
              style={{
                marginTop: "18px",
                background: answers[current] === question.answer ? "#F0FDF4" : "#FEF2F2",
                border: `1.5px solid ${answers[current] === question.answer ? "#BBF7D0" : "#FECACA"}`,
                borderRadius: "8px",
                padding: "14px 18px",
              }}
            >
              <h5 style={{ margin: "0 0 4px", fontSize: "13.5px", color: answers[current] === question.answer ? "#15803D" : "#991B1B", fontWeight: 700 }}>
                Operational Rationale:
              </h5>
              <p style={{ margin: 0, fontSize: "13px", color: "#334155", lineHeight: 1.5 }}>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Actions Footer */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1.5px solid #E2E8F0",
              paddingTop: "16px",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={restart}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RotateCcw size={14} /> Reset Lab
            </button>

            {!submitted ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={submitAnswer}
                disabled={selected === null}
                style={{ fontWeight: 700, padding: "10px 22px" }}
              >
                Submit Decision →
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="button"
                onClick={nextQuestion}
                style={{ fontWeight: 700, padding: "10px 22px" }}
              >
                {current < scenario.questions.length - 1 ? "Next Question →" : "View Assessment Results →"}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Screen 3: Final Results & Capability Performance Screen */}
      {finished && (
        <section
          className="panel"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #CBD5E1",
            borderRadius: "12px",
            padding: "28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              borderBottom: "1.5px solid #E2E8F0",
              paddingBottom: "20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: passed ? "#DCFCE7" : "#FEF2F2",
                color: passed ? "#15803D" : "#DC2626",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 12px",
              }}
            >
              {passed ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
            </div>

            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: passed ? "#15803D" : "#DC2626",
                background: passed ? "#DCFCE7" : "#FEF2F2",
                padding: "3px 10px",
                borderRadius: "9999px",
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              {passed ? "Practical Assessment Passed (≥ 70%)" : "Practical Assessment Not Passed (< 70%)"}
            </span>

            <h2 style={{ margin: "0 0 6px", fontSize: "22px", color: "#0F172A", fontWeight: 700 }}>
              {scenario.title} — Evaluation Summary
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
              Operational decisions evaluated for <strong>{scenario.course}</strong>
            </p>

            <div
              style={{
                display: "inline-flex",
                gap: "24px",
                background: "#F8FAFC",
                border: "1.5px solid #E2E8F0",
                padding: "12px 28px",
                borderRadius: "10px",
                marginTop: "16px",
              }}
            >
              <div>
                <span style={{ fontSize: "12px", color: "#64748B", display: "block" }}>Decision Score</span>
                <strong style={{ fontSize: "22px", color: passed ? "#15803D" : "#DC2626" }}>
                  {percentage}%
                </strong>
              </div>
              <div style={{ borderLeft: "1px solid #CBD5E1", paddingLeft: "24px" }}>
                <span style={{ fontSize: "12px", color: "#64748B", display: "block" }}>Correct Decisions</span>
                <strong style={{ fontSize: "22px", color: "#0F172A" }}>
                  {score} / {scenario.questions.length}
                </strong>
              </div>
            </div>
          </div>

          {/* Decision Review List */}
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 14px", fontSize: "15px", color: "#0F172A", fontWeight: 700 }}>
              Decision-by-Decision Review:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scenario.questions.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.answer;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#F8FAFC",
                      border: `1.5px solid ${isCorrect ? "#BBF7D0" : "#FECACA"}`,
                      borderRadius: "8px",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                      <strong style={{ fontSize: "13.5px", color: "#0F172A" }}>
                        {idx + 1}. {q.title}
                      </strong>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: isCorrect ? "#15803D" : "#DC2626",
                          background: isCorrect ? "#DCFCE7" : "#FEF2F2",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 6px", fontSize: "13px", color: "#475569" }}>
                      {q.question}
                    </p>
                    <div style={{ fontSize: "12.5px", color: "#64748B" }}>
                      <span>Selected: <strong>{q.options[userAns]}</strong></span> · <span>Correct: <strong style={{ color: "#15803D" }}>{q.options[q.answer]}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={restart}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RotateCcw size={14} /> Retake Simulation
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
